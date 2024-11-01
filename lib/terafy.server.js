import {cloneDeep} from 'lodash-es';
import {diffApply} from 'just-diff-apply';
import mixin from '#utils/mixin';
import {nanoid} from 'nanoid';
import pathTools from '#utils/pathTools';
import promiseDefer from '#utils/pDefer';
import Reflib from '@iebh/reflib';
import {reactive} from 'vue';

/**
* Server-side functions available to the Tera-Fy client library
*
* @class TeraFyServer
*/

/* globals globalThis, app */
export default class TeraFyServer {

	/**
	* Various settings to configure behaviour
	*
	* @type {Object}
	* @property {Boolean} devMode Operate in devMode - i.e. force outer refresh when encountering an existing TeraFy instance
	* @property {Number} verbosity Verbosity level, the higher the more chatty TeraFY will be. Set to zero to disable all `debug()` call output
	* @property {Number} subscribeTimeout Acceptable timeout period for subscribers to acklowledge a project change event, failing to respond will result in the subscriber being removed from the available subscriber list
	* @property {String} restrictOrigin URL to restrict communications to
	* @property {String} projectId The project to use as the default reference when calling various APIs
	* @property {Number} serverMode The current server mode matching `SERVERMODE_*`
	* @property {String} siteUrl The main site absolute URL
	* @property {String} sitePathLogin Either an absolute URL or the relative path (taken from `siteUrl`) when trying to log in the user
	*/
	settings = {
		devMode: false,
		verbosity: 1,
		restrictOrigin: '*',
		subscribeTimeout: 2000,
		projectId: null,
		serverMode: 0,
		siteUrl: window.location.href,
		sitePathLogin: '/login',
	};

	static SERVERMODE_NONE = 0;
	static SERVERMODE_EMBEDDED = 1;
	static SERVERMODE_FRAME = 2;
	static SERVERMODE_POPUP = 3;
	static SERVERMODE_TERA = 4; // Terafy is running as the main TERA site


	// Contexts - createContext(), getClientContext(), messageEvent, senderRpc() {{{
	/**
	* Create a context based on a shallow copy of this instance + additional functionality for the incoming MessageEvent
	* This is used by acceptMessage to provide a means to reply / send messages to the originator
	*
	* @param {MessageEvent} e Original message event to base the new context on
	*
	* @returns {Object} A context, which is this instance extended with additional properties
	*/
	createContext(e) {
		// Construct wrapper for sendRaw for this client
		return mixin(this, {
			messageEvent: e,
			sendRaw(message) {
				let payload;
				try {
					payload = {
						TERA: 1,
						...cloneDeep(message), // Need to clone to resolve promise nasties
					};
					e.source.postMessage(payload, this.settings.restrictOrigin);
				} catch (e) {
					this.debug('ERROR', 1, 'Attempted to dispatch payload server(via reply)->client', {payload, e});
					throw e;
				}
			},
		});
	}


	/**
	* Create a new client context from the server to the client even if the client hasn't requested the communication
	* This function is used to send unsolicited communications from the server->client in contrast to createContext() which _replies_ from client->server->client
	*
	* @returns {Object} A context, which is this instance extended with additional properties
	*/
	getClientContext() {
		switch (this.settings.serverMode) {
			case TeraFyServer.SERVERMODE_NONE:
				throw new Error('Client has not yet initiated communication');
			case TeraFyServer.SERVERMODE_EMBEDDED:
				// Server is inside an iFrame so we need to send messages to the window parent
				return mixin(this, {
					sendRaw(message) {
						let payload;
						try {
							payload = {
								TERA: 1,
								...cloneDeep(message), // Need to clone to resolve promise nasties
							};
							window.parent.postMessage(payload, this.settings.restrictOrigin);
						} catch (e) {
							this.debug('ERROR', 1, 'Attempted to dispatch payload server(iframe)->cient(top level window)', {payload, e});
							throw e;
						}
					},
				});
			case TeraFyServer.SERVERMODE_TERA:
			case TeraFyServer.SERVERMODE_FRAME: {
				// Server is the top-level window so we need to send messages to an embedded iFrame
				let iFrame = document.querySelector('iframe#external');
				if (!iFrame) {
					this.debug('INFO', 2, 'Cannot locate TERA-FY top-level->iFrame#external - maybe there is none');
					return mixin(this, {
						sendRaw(message) {
							this.debug('INFO', 2, 'Sending broadcast to zero listening clients');
						},
					});
				}

				return mixin(this, {
					sendRaw(message) {
						let payload;
						try {
							payload = {
								TERA: 1,
								...cloneDeep(message), // Need to clone to resolve promise nasties
							};
							iFrame.contentWindow.postMessage(payload, this.settings.restrictOrigin);
						} catch (e) {
							this.debug('ERROR', 1, 'Attempted to dispatch payload server(top level window)->cient(iframe)', {payload, e});
							throw e;
						}
					},
				});
			}
			case TeraFyServer.SERVERMODE_POPUP:
		}
	}


	/**
	* MessageEvent context
	* Only available if the context was created via `createContext()`
	*
	* @type {MessageEvent}
	*/
	messageEvent = null;


	/**
	* Request an RPC call from the original sender of a mesasge
	* This function only works if the context was sub-classed via `createContext()`
	*
	* @param {String} method The method name to call
	* @param {...*} [args] Optional arguments to pass to the function
	*
	* @returns {Promise<*>} The resolved output of the server function
	*/
	senderRpc(method, ...args) {
		if (!this.messageEvent) throw new Error('senderRpc() can only be used if given a context from `createContext()`');

		return this.send({
			action: 'rpc',
			method,
			args,
		});
	}
	// }}}

	// Messages - handshake(), send(), sendRaw(), setServerMode(), acceptMessage(), requestFocus(), emitClients() {{{

	/**
	* Return basic server information as a form of validation
	*
	* @returns {Promise<Object>} Basic promise result
	* @property {Date} date Server date
	*/
	handshake() {
		return Promise.resolve({
			date: new Date(),
		});
	}


	/**
	* Send a message + wait for a response object
	*
	* @param {Object} message Message object to send
	* @returns {Promise<*>} A promise which resolves when the operation has completed with the remote reply
	*/
	send(message) {
		if (!this.messageEvent) throw new Error('send() can only be used if given a context from `createContext()`');

		let id = nanoid();

		this.acceptPostboxes[id] = {}; // Stub for the deferred promise
		this.acceptPostboxes[id].promise = new Promise((resolve, reject) => {
			Object.assign(this.acceptPostboxes[id], {
				resolve, reject,
			});
			this.sendRaw({
				id,
				...message,
			});
		});

		return this.acceptPostboxes[id].promise;
	}


	/**
	* Send raw message content to the client
	* Unlike send() this method does not expect any response
	*
	* @param {Object} message Message object to send
	* @param {Window} sendVia Window context to dispatch the message via if its not the same as the regular window
	*/
	sendRaw(message, sendVia) {
		let payload;
		try {
			payload = {
				TERA: 1,
				...cloneDeep(message), // Need to clone to resolve promise nasties
			};
			this.debug('INFO', 3, 'Dispatch response', message, '<=>', payload);
			(sendVia || globalThis.parent).postMessage(payload, this.settings.restrictOrigin);
		} catch (e) {
			this.debug('ERROR', 2, 'Attempted to dispatch response server->client', payload);
			this.debug('ERROR', 2, 'Message compose server->client:', e);
		}
	}


	/**
	* Setter to translate between string inputs and the server modes in SERVERMODE_*
	*
	* @param {String} mode The server mode to set to
	*/
	setServerMode(mode) {
		switch (mode) {
			case 'embedded':
				this.settings.serverMode = TeraFyServer.SERVERMODE_EMBEDDED;
				break;
			case 'frame':
				this.settings.serverMode = TeraFyServer.SERVERMODE_FRAME;
				break;
			case 'popup':
				this.settings.serverMode = TeraFyServer.SERVERMODE_POPUP;
				break;
			default:
				throw new Error(`Unsupported server mode "${mode}"`);
		}
	}


	/**
	* Accept a message from the parent event listener
	*
	* @param {MessageEvent} rawMessage Raw message event to process
	*/
	acceptMessage(rawMessage) {
		if (rawMessage.origin == window.location.origin) return; // Message came from us

		let message = rawMessage.data;
		if (!message.TERA) return; // Ignore non-TERA signed messages
		this.debug('INFO', 3, 'Recieved message', message);

		Promise.resolve()
			.then(()=> {
				if (message?.action == 'response' && this.acceptPostboxes[message.id]) { // Postbox waiting for reply
					if (message.isError === true) {
						this.acceptPostboxes[message.id].reject(message.response);
					} else {
						this.acceptPostboxes[message.id].resolve(message.response);
					}
				} else if (message.action == 'rpc') { // Relay RPC calls
					if (!this[message.method]) throw new Error(`Unknown RPC method "${message.method}"`);
					return this[message.method].apply(this.createContext(rawMessage), message.args);
				} else {
					this.debug('ERROR', 2, 'Unexpected incoming TERA-FY SERVER message', {message});
					throw new Error('Unknown message format');
				}
			})
			.then(response => this.sendRaw({
				id: message.id,
				action: 'response',
				response,
			}, rawMessage.source))
			.catch(e => {
				console.warn(`TERA-FY server threw on RPC:${message.method}:`, e);
				this.sendRaw({
					id: message.id,
					action: 'response',
					isError: true,
					response: e ? e.toString() : e,
				});
			})
	}


	/**
	* Listening postboxes, these correspond to outgoing message IDs that expect a response
	*/
	acceptPostboxes = {};


	/**
	* Wrapper function which runs a callback after the frontend UI has obtained focus
	* This is to fix the issue where the front-end needs to switch between a regular webpage and a focused TERA iFrame wrapper
	* Any use of $prompt or other UI calls should be wrapped here
	*
	* @param {Function} cb Async function to run in focused mode
	*
	* @returns {Promise<*>} A promise which resolves with the resulting inner callback payload
	*/
	requestFocus(cb) {
		return Promise.resolve()
			.then(()=> this.settings.serverMode != TeraFyServer.SERVERMODE_TERA && this.senderRpc('toggleFocus', true))
			.then(()=> cb.call(this))
			.finally(()=> this.settings.serverMode != TeraFyServer.SERVERMODE_TERA && this.senderRpc('toggleFocus', false))
	}


	/**
	* Emit messages down into all connected clients
	* Note that emitted messages have no response - they are sent to clients only with no return value
	*
	* @param {String} event The event name to emit
	* @param {...*} [args] Optional event payload to send
	* @returns {Promise} A promise which resolves when the transmission has completed
	*/
	emitClients(event, ...args) {
		return this.getClientContext().sendRaw({
			action: 'event',
			id: nanoid(),
			event,
			payload: args,
		});
	}


	/**
	* RPC callback to set the server verbostiy level
	*
	* @param {Number} verbosity The desired server verbosity level
	*/
	setServerVerbosity(verbosity) {
		this.settings.verbosity = +verbosity;
		this.debug('INFO', 1, 'Server verbosity set to', this.settings.verbosity);
	}
	// }}}

	// Session / User - getUser(), requireUser() {{{

	/**
	* User / active session within TERA
	* @class User
	* @property {String} id Unique identifier of the user
	* @property {String} email The email address of the current user
	* @property {String} name The provided full name of the user
	* @property {Boolean} isSubscribed Whether the active user has a TERA subscription
	*/

	/**
	* Fetch the current session user
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.forceRetry=false] Forcabily try to refresh the user state
	*
	* @returns {Promise<User>} The current logged in user or null if none
	*/
	getUser(options) {
		let settings = {
			forceRetry: false,
			...options,
		};

		let $auth = app.service('$auth');
		let $subscriptions = app.service('$subscriptions');

		return Promise.all([
			$auth.promise(),
			$subscriptions.promise(),
		])
			.then(()=> {
				if (!$auth.isLoggedIn && settings.forceRetry)
					return $auth.restoreLogin();
			})
			.then(()=> $auth.user?.id ? {
				id: $auth.user.id,
				email: $auth.user.email,
				name: [
					$auth.user.given_name,
					$auth.user.family_name,
				].filter(Boolean).join(' '),
				isSubscribed: $subscriptions.isSubscribed,
			} : null)
			.catch(e => console.warn('getUser() catch', e))
	}


	/**
	* Require a user login to TERA
	* If there is no user OR they are not logged in a prompt is shown to go and do so
	* This is an pre-requisite step for requireProject()
	*
	* @returns {Promise} A promise which will resolve if the there is a user and they are logged in
	*/
	requireUser() {
		return this.getUser()
			.then(user => {
				this.debug('INFO', 2, 'Current user is', user ? user : 'Not valid');
				if (user) throw 'EXIT'; // Valid user? Escape promise chain
			})
			.then(async ()=> { // No user present - try to validate with other methods
				switch (this.settings.serverMode) {
					case TeraFyServer.SERVERMODE_EMBEDDED:
						/* - Doesn't work because Kinde sets the CSP header `frame-ancestors 'self'` which prevents usage within an iFrame
						const $auth = app.service('$auth');
						return this.requestFocus(()=>  $auth.login()
							.then(()=> {
								console.log('New user state', $auth.isLoggedIn);
							})
						);
						*/

						// Try to restore state via Popup workaround
						await this.getUserViaEmbedWorkaround();

						// Go back to start of auth checking loop and repull the user data
						throw 'REDO';
					default:
						// Pass - Implied - Cannot authenticate via other method so just fall through to scalding the user
				}
			})
			.then(()=> this.uiAlert('You must be logged in to <a href="https://tera-tools.com" target="_blank">TERA-tools.com</a> to use this tool', {
				title: 'TERA-tools account needed',
				isHtml: true,
				buttons: false,
			}))
			.then(()=> { throw 'REDO' }) // Go into loop to keep requesting user data
			.catch(e => {
				if (e === 'EXIT') {
					return; // Exit with a valid user
				} else if (e == 'REDO') {
					return this.requireUser();
				}
				throw e;
			})
	}


	/**
	* In embed mode only - create a popup window and try to auth via that
	*
	* When in embed mode we can't store local state (Cookies without SameSite + LocalStorage etc.) so the only way to auth the user in the restricted envionment:
	*
	* 1. Try to read state from LocalStorage (if so, skip everything else)
	* 2. Create a popup - which can escape the security container - and trigger a login
	* 3. Listen locally for a message from the popup which it will transmit the authed user to its original window opener
	* 3. Stash the state in LocalStorage to avoid this in future
	*
	* This workaround is only needed when developing with TERA in an embed window - i.e. local dev / stand alone websites
	* Its annoying but I've tried everything else as a security method to get Non-Same-Origin sites to talk to each other
	* - MC 2024-04-03
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	async getUserViaEmbedWorkaround() {
		let lsState = window.localStorage.getItem('tera.embedUser');
		if (lsState) {
			try {
				lsState = JSON.parse(lsState);

				let $auth = app.service('$auth');
				$auth.state = 'user';
				$auth.ready = true;
				$auth.isLoggedIn = true;
				$auth.user = lsState;

				this.debug('INFO', 3, 'Restored local user state from LocalStorage', {'$auth.user': $auth.user});

				await app.service('$projects').refresh();
				return;
			} catch (e) {
				throw new Error(`Failed to decode local dev state - ${e.toString()}`);
			}
		}

		let focusContent = document.createElement('div');
		focusContent.innerHTML = '<div>Authenticate with <a href="https://tera-tools.com" target="_blank">TERA-tools.com</a></div>'
			+ '<div class="mt-2"><a class="btn btn-light">Open Popup...</a></div>';

		// Attach click listner to internal button to re-popup the auth window (in case popups are blocked)
		focusContent.querySelector('a.btn').addEventListener('click', ()=>
			this.uiWindow(new URL(this.settings.sitePathLogin, this.settings.siteUrl))
		);

		// Create a deferred promise which will (eventually) resolve when the downstream window signals its ready
		let waitOnWindowAuth = promiseDefer();

		// Create a listener for the message from the downstream window to resolve the promise
		let listenMessages = ({data}) => {
			this.debug('INFO', 3, 'Recieved message from popup window', {data});
			if (data.TERA && data.action == 'popupUserState' && data.user) { // Signal sent from landing page - we're logged in, yey!
				let $auth = app.service('$auth');

				// Accept user polyfill from opener
				$auth.state = 'user';
				$auth.ready = true;
				$auth.isLoggedIn = true;
				$auth.user = data.user;

				window.localStorage.setItem('tera.embedUser', JSON.stringify(data.user));

				this.debug('INFO', 3, 'Received user auth from popup window', {'$auth.user': $auth.user});
				waitOnWindowAuth.resolve();
			}
		};
		window.addEventListener('message', listenMessages);

		// Go fullscreen, try to open the auth window + prompt the user to retry (if popups are blocked) and wait for resolution
		await this.requestFocus(()=> {
			// Try opening the popup automatically - this will likely fail if the user has popup blocking enabled
			this.uiWindow(new URL(this.settings.sitePathLogin, this.settings.siteUrl));

			// Display a message to the user, offering the ability to re-open the popup if it was originally denied
			this.uiSplat(focusContent, {logo: true});

			this.debug('INFO', 4, 'Begin auth-check deferred wait...');
			return waitOnWindowAuth.promise;
		});

		this.debug('INFO', 4, 'Cleaning up popup auth');

		// Remove message subscription
		window.removeEventListener('message', listenMessages);

		// Disable overlay content
		this.uiSplat(false);

		// ... then refresh the project list as we're likely going to need it
		await app.service('$projects').refresh();
	}
	// }}}

	// Projects - getProject(), getProjects(), requireProject(), selectProject() {{{

	/**
	* Project entry within TERA
	* @class Project
	* @property {String} id The Unique ID of the project
	* @property {String} name The name of the project
	* @property {String} created The creation date of the project as an ISO string
	* @property {Boolean} isOwner Whether the current session user is the owner of the project
	*/


	/**
	* Get the currently active project, if any
	*
	* @returns {Promise<Project|null>} The currently active project, if any
	*/
	getProject() {
		let $projects = app.service('$projects');

		return $projects.promise()
			.then(()=> $projects.active
				? {
					id: $projects.active.id,
					name: $projects.active.name,
					created: $projects.active.created,
					isOwner: $projects.active.$isOwner,
				}
				: null
			)
	}


	/**
	* Get a list of projects the current session user has access to
	*
	* @returns {Promise<Array<Project>>} Collection of projects the user has access to
	*/
	getProjects() {
		let $projects = app.service('$projects');

		return $projects.promise()
			.then(()=> $projects.list.map(project => ({
				id: project.id,
				name: project.name,
				created: project.created,
				isOwner: project.$isOwner,
			})))
	}


	/**
	* Set the currently active project within TERA
	*
	* @param {Object|String} project The project to set as active - either the full Project object or its ID
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	setActiveProject(project) {
		return app.service('$projects').setActive(project);
	}


	/**
	* Ask the user to select a project from those available - if one isn't already active
	* Note that this function will percist in asking the uesr even if they try to cancel
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequireUser=true] Automatically call `requireUser()` before trying to fetch a list of projects
	* @param {Boolean} [options.autoSetActiveProject=true] After selecting a project set that project as active in TERA
	* @param {String} [options.title="Select a project to work with"] The title of the dialog to display
	* @param {String} [options.noSelectTitle='Select project'] Dialog title when warning the user they need to select something
	* @param {String} [options.noSelectBody='A project needs to be selected to continue'] Dialog body when warning the user they need to select something
	*
	* @returns {Promise<Project>} The active project
	*/
	requireProject(options) {
		let settings = {
			autoRequireUser: true,
			autoSetActiveProject: true,
			title: 'Select a project to work with',
			noSelectTitle: 'Select project',
			noSelectBody: 'A project needs to be selected to continue',
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequireUser && this.requireUser())
			.then(()=> this.getProject())
			.then(active => {
				if (active) return active; // Use active project

				return new Promise((resolve, reject) => {
					let askProject = ()=> Promise.resolve()
						.then(()=> this.selectProject({
							allowCancel: false,
						}))
						.then(project => resolve(project))
						.catch(e => {
							if (e == 'cancel') {
								return this.requestFocus(()=>
									app.service('$prompt').dialog({
										title: settings.noSelectTitle,
										body: settings.noSelectBody,
										buttons: ['ok'],
									})
								)
								.then(()=> askProject())
								.catch(reject)
							} else {
								reject(e);
							}
						})
					askProject(); // Kick off intial project loop
				})
				.then(async (project) => {
					if (settings.autoSetActiveProject) await this.setActiveProject(project);
					return project;
				})
			})
	}


	/**
	* Prompt the user to select a project from those available
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.title="Select a project to work with"] The title of the dialog to display
	* @param {Boolean} [options.allowCancel=true] Allow cancelling the operation, will throw `'CANCEL'` if actioned
	* @param {Boolean} [options.setActive=false] Also set the project as active when selected
	*
	* @returns {Promise<Project>} The active project
	*/
	selectProject(options) {
		let settings = {
			title: 'Select a project to work with',
			allowCancel: true,
			setActive: false,
			...options,
		};

		return app.service('$projects').promise()
			.then(()=> this.requestFocus(()=>
				app.service('$prompt').dialog({
					title: settings.title,
					component: 'projectsSelect',
					buttons: settings.allowCancel && ['cancel'],
				})
			))
			.then(project => settings.setActive
				? this.setActiveProject(project)
					.then(()=> project)
				: project
			)
	}


	// }}}

	// Project State - getProjectState(), setProjectState(), setProjectStateDefaults(), replaceProjectState(), applyProjectStatePatch() {{{

	/**
	* Return the current, full snapshot state of the active project
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Array<String>} [options.paths] Paths to subscribe to e.g. ['/users/'],
	*
	* @returns {Promise<Object>} The current project state snapshot
	*/
	getProjectState(options) {
		let settings = {
			autoRequire: true,
			paths: null,
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
			.then(()=> app.service('$projects').active)
	}


	/**
	* Set a nested value within the project state
	*
	* Paths can be any valid Lodash.set() value such as:
	*     - Dotted notation - e.g. `foo.bar.1.baz`
	*     - Array path segments e.g. `['foo', 'bar', 1, 'baz']`
	*
	* Conflict strategies (copied from utils/pathTools @ `set()`)
*     - 'set' / 'overwrite' - Just overwrite any existing value
*     - 'merge' - Merge existing values using Lodash.merge()
*     - 'defaults' - Merge existing values using Lodash.defaultsDeep()
	*
	* @param {String|Array<String>} path The sub-path within the project state to set
	* @param {*} value The value to set, this is set using the conflict strategy
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.save=true] Save the changes to the server immediately, disable to queue up multiple writes
	* @param {'set'} [options.strategy='set'] A PathTools.set strategy to handle existing values, if any
	*
	* @returns {Promise<*>} A promise which resolves to `value` when the operation has been dispatched to the server and saved
	*/
	setProjectState(path, value, options) {
		let settings = {
			save: true,
			strategy: 'set',
			...options,
		};

		if (!app.service('$projects').active) throw new Error('No active project');
		if (typeof path != 'string' && !Array.isArray(path)) throw new Error('setProjectStateDefaults(path, value) - path must be a dotted string or array of path segments');

		pathTools.set(
			app.service('$projects').active,
			path,
			value,
			{
				strategy: settings.strategy,
			},
		);

		return Promise.resolve()
			.then(()=> settings.save && this.saveProjectState())
	}


	/**
	* Set a nested value within the project state - just like `setProjectState()` but applying the 'defaults' strategy by default
	*
	* @see setProjectState()
	* @param {String|Array<String>} [path] The sub-path within the project state to set, if unspecifed the entire target is used as a target and a save operation is forced
	* @param {*} value The value to set as the default structure
	* @param {Object} [options] Additional options to mutate behaviour, see setProjectState() for the full list of supported options
	* @param {Boolean} [options.flush=true] Force a re-read from the server after setting, prevents race conditions with large objects. Calls `setProjectStateFlush()` after applying defaults
	*
	* @returns {Promise<*>} A promise which resolves to the eventual input value after defaults have been applied
	*/
	setProjectStateDefaults(path, value, options) {
		let settings = {
			flush: true,
			...options,
		};
		if (!app.service('$projects').active) throw new Error('No active project');

		let target = app.service('$projects').active;

		if (typeof path == 'string' || Array.isArray(path)) { // Called as (path, value, options?) Set sub-object
			return this.setProjectState(
				path,
				value,
				{
					strategy: 'defaults',
					...settings,
				},
			)
				.then(()=> settings.flush && this.setProjectStateFlush())
				.then(()=> pathTools.get(target, path));
		} else { // Called as (value) - Populate entire project layout
			pathTools.defaults(target, path);
			this.debug('INFO', 1, 'setProjectStateDefaults', {
				defaults: path,
				newState: cloneDeep(target),
			});
			return this.saveProjectState()
				.then(()=> settings.flush && this.setProjectStateFlush())
				.then(()=> target);
		}
	}


	/**
	* Force copying local changes to the server
	* This is only ever needed when saving large quantities of data that need to be immediately available
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	setProjectStateFlush() {
		this.debug('INFO', 1, 'Force project state flush!');
		if (!app.service('$projects').active) throw new Error('No active project');
		return app.service('$projects').active.$touchLocal()
			.then(()=> null)
	}


	/**
	* Force refetching the remote project state into local
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	setProjectStateRefresh() {
		this.debug('INFO', 1, 'Force project state refresh!');
		if (!app.service('$projects').active) throw new Error('No active project');
		return app.service('$projects').active.$read({force: true})
			.then(()=> this.debug('INFO', 2, 'Forced project state refresh!', {state: app.service('$projects').active}))
			.then(()=> null)
	}


	/**
	* Force-Save the currently active project state
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	saveProjectState() {
		if (!app.service('$projects').active) throw new Error('No active project');

		// TODO: Force saving projects is not supported - stuff is saved in realtime anyway
		return Promise.resolve();
	}


	/**
	* Overwrite the entire project state with a new object
	* You almost never want to use this function directly, see `setProjectState(path, value)` for a nicer wrapper
	*
	* @see setProjectState()
	* @param {Object} newState The new state to replace the current state with
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	replaceProjectState(newState) {
		if (!app.service('$projects').active) throw new Error('No active project');
		if (typeof newState != 'object') throw new Error('Only project state objects are accepted');

		// TODO: Would be nice if we compared against a sanity hash or something before just clobbering
		Object.assign(app.service('$projects').active, newState);
		return this.saveProjectState();
	}


	/**
	* Apply a computed `just-diff` patch to the current project state
	*
	* @param {Object} patch Patch to apply
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	applyProjectStatePatch(patch) {
		if (!app.service('$projects').active) throw new Error('No active project to patch');
		this.debug('INFO', 1, 'Applying', patch.length, 'project state patch', patch);
		diffApply(app.service('$projects').active, patch);

		return Promise.resolve();
	}
	// }}}

	// Project files - selectProjectFile(), getProjectFiles(), getProjectFile(), createProjectFile(), deleteProjectFile(), setProjectFileContents() {{{

	/**
	* Data structure for a project file
	* @class ProjectFile
	*
	* @property {String} id A UUID string representing the unique ID of the file
	* @property {String} name Relative name path (can contain prefix directories) for the human readable file name
	* @property {Object} parsedName An object representing meta file parts of a file name
	* @property {String} parsedName.basename The filename + extention (i.e. everything without directory name)
	* @property {String} parsedName.filename The file portion of the name (basename without the extension)
	* @property {String} parsedName.ext The extension portion of the name (always lower case)
	* @property {String} parsedName.dirName The directory path portion of the name
	* @property {Date} created A date representing when the file was created
	* @property {Date} modified A date representing when the file was created
	* @property {Date} accessed A date representing when the file was last accessed
	* @property {Number} size Size, in bytes, of the file
	* @property {String} mime The associated mime type for the file
	*/

	/**
	* Data structure for a file filter
	* @class FileFilters
	*
	* @property {Boolean} [library=false] Restrict to library files only
	* @property {String} [filename] CSV of @momsfriendlydevco/match expressions to filter the filename by (filenames are the basename sans extension)
	* @property {String} [basename] CSV of @momsfriendlydevco/match expressions to filter the basename by
	* @property {String} [ext] CSV of @momsfriendlydevco/match expressions to filter the file extension by
	*/

	/**
	* Prompt the user to select a library to operate on
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.title="Select a file"] The title of the dialog to display
	* @param {String|Array<String>} [options.hint] Hints to identify the file to select in array order of preference
	* @param {Boolean} [options.save=false] Set to truthy if saving a new file, UI will adjust to allowing overwrite OR new file name input
	* @param {String} [options.saveFilename] File name to save as, if omitted the hinting system is used otherwise 'My File.unknown' is assumed
	* @param {FileFilters} [options.filters] Optional file filters
	* @param {Boolean} [options.allowUpload=true] Allow uploading new files
	* @param {Boolean} [options.allowRefresh=true] Allow the user to manually refresh the file list
	* @param {Boolean} [options.allowDownloadZip=true] Allow the user to download a Zip of all files
	* @param {Boolean} [options.allowCancel=true] Allow cancelling the operation. Will throw `'CANCEL'` as the promise rejection if acationed
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {FileFilters} [options.filter] Optional file filters
	*
	* @returns {Promise<ProjectFile>} The eventually selected file, if in save mode new files are created as stubs
	*/
	selectProjectFile(options) {
		let settings = {
			title: 'Select a file',
			hint: null,
			save: false,
			saveFilename: null,
			filters: {},
			allowUpload: true,
			allowRefresh: true,
			allowDownloadZip: true,
			allowCancel: true,
			autoRequire: true,
			...options,
		};

		return app.service('$projects').promise()
			.then(()=> settings.autoRequire && this.requireProject())
			.then(()=> this.requestFocus(()=>
				app.service('$prompt').dialog({
					title: settings.title,
					component: settings.save ? 'filesSave' : 'filesOpen',
					componentProps: {
						hint: settings.hint,
						saveFilename: settings.saveFilename,
						allowNavigate: false,
						allowUpload: settings.allowUpload,
						allowRefresh: settings.allowRefresh,
						allowDownloadZip: settings.allowDownloadZip,
						allowVerbs: false,
						cardStyle: false,
						filters: settings.filters,
					},
					componentEvents: {
						fileSave(file) {
							app.service('$prompt').close(true, file);
						},
						fileSelect(file) {
							app.service('$prompt').close(true, file);
						},
					},
					modalDialogClass: 'modal-dialog-lg',
					buttons: settings.allowCancel && ['cancel'],
				})
			))
	}


	/**
	* Fetch the files associated with a given project
	*
	* @param {Object} options Options which mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Boolean} [options.lazy=true] If true, use the fastest method to retrieve the file list such as the cache. If false, force a refresh each time
	* @param {Boolean} [options.meta=true] Pull meta information for each file entity
	*
	* @returns {Promise<Array<ProjectFile>>} A collection of project files for the given project
	*/
	getProjectFiles(options) {
		let settings = {
			autoRequire: true,
			lazy: true,
			meta: true,
			...options,
		};

		return Promise.resolve()
			.then(()=> app.service('$projects').promise())
			.then(()=> settings.autoRequire && this.requireProject())
			.then(()=>
				app.service('$projects').activeFiles.length == 0 // If we have no files in the cache
				|| !settings.lazy // OR lazy/cache use is disabled
				? app.service('$projects').refreshFiles({ // Go refresh files first
					lazy: false,
				})
				: app.service('$projects').activeFiles // Otherwise use file cache
			)
	}


	/**
	* Fetch a project file by its name
	*
	* @param {String} name The name + relative directory path component
	*
	* @param {Object|String} [options] Additional options to mutate behaviour, if a string is given `options.subkey` is assumed
	* @param {String} [options.subkey] If specified only the extracted subkey is returned rather than the full object
	* @param {Boolean} [options.cache=true] Use the existing file cache if possible, set to false to force a refresh of files from the server first
	*
	* @returns {Promise<ProjectFile>} The eventual fetched ProjectFile (or requested subkey)
	*/
	getProjectFile(name, options) {
		let settings = {
			subkey: null,
			cache: true,
			...(typeof options == 'string' ? {subkey: options} : options),
		};

		return Promise.resolve()
			.then(()=>
				app.service('$projects').activeFiles.length == 0 // If we have no files in the cache
				|| !settings.cache // OR caching is disabled
				? app.service('$projects').refreshFiles({ // Go refresh files first
					lazy: false,
				})
				: app.service('$projects').activeFiles // Otherwise use file cache
			)
			.then(files =>
				files.find(file =>
					file.name == name
				)
			)
			.then(file => file && settings.subkey ? file[settings.subkey] : file) // Provide subkey if asked
	}


	/**
	* Fetch the raw contents of a file by its ID
	*
	* @param {String} [id] File ID to retrieve the contents of
	*
	* @param {Object} [options] Additioanl options to mutate behaviour
	* @param {'blob'|'json'} [options.format='blob'] The format to retrieve the file in. If `json` the raw output is run via JSON.parse() first
	*
	* @returns {*} The file contents in the requested format
	*/
	getProjectFileContents(id, options) {
		let settings = {
			format: 'blob',
			...options,
		};

		return app.service('$supabase').fileGet(app.service('$projects').decodeFilePath(id), {
			json: settings.format == 'json',
			toast: false,
		});
	}


	/**
	* Create a new file
	* This creates an empty file which can then be written to
	* This function also forces a local file list cache update
	*
	* @param {String} name The name + relative directory path component
	* @returns {Promise<ProjectFile>} The eventual ProjectFile created
	*/
	createProjectFile(name) {
		return Promise.resolve()
			.then(()=> app.service('$supabase').fileUpload(app.service('$projects').convertRelativePath(name), {
				file: new Blob([''], {type: 'text/plain'}),
				mode: 'encoded',
				overwrite: false,
				multiple: false,
				toast: false,
				transcoders: false,
			}))
			.then(()=> this.getProjectFile(name, {
				cache: false, // Force cache to update, as this is a new file
			}))
			.then(file => file || Promise.reject(`Could not create new file "${name}"`))
	}


	/**
	* Remove a project file by its ID
	*
	* @param {String} id The File ID to remove
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	deleteProjectFile(id) {
		return app.service('$supabase').fileRemove(app.service('$projects').decodeFilePath(id))
			.then(()=> app.service('$projects').refreshFiles({ // Force a local file list update
				lazy: false,
			}))
			.then(()=> null)
	}


	/**
	* Save (or overwrite) a file within a project
	*
	* @param {String|ProjectFile} [id] ProjectFile or ID of the same to overwrite, if omitted a file is prompted for
	* @param {File|Blob|FormData|Object|Array} contents The new file contents
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String|ProjectFile} [options.id] Alternate method to specify the file ID to save as, if omitted one will be prompted for
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {String|Array<String>} [options.hint] Hint(s) to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'
	* @param {String} [options.filename] Suggested filename if `id` is unspecified
	* @param {String} [options.title='Save citation library'] Dialog title if `id` is unspecified and a prompt is necessary
	* @param {Object} [options.meta] Optional meta data to merge into the file data
	*
	* @returns {Promise} A promise which will resolve when the write operation has completed
	*/
	setProjectFileContents(id, contents, options) {
		// Argument mangling {{{
		// TODO: Horrible kludge to detect ID is "not a JSON blob"
		if (typeof id == 'string' && !id.startsWith('{') && contents && options) { // Called as `(id, contents, options)`
			// Pass
		} else if (typeof id != 'string' && !options) { // Called as `(contents, options)`
			[id, contents, options] = [null, id, contents];
		} else {
			throw new Error('Unknown function signature. Requires (id:String?, contents:*, options:Object?)');
		}
		// }}}

		let settings = {
			id,
			autoRequire: true,
			hint: null,
			filename: null,
			title: 'Save file',
			meta: null,
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
			.then(()=> {
				if (settings.id) return; // We already have a file ID specified - skip

				// Prompt for a save filename
				return this.selectProjectFile({
					title: settings.title,
					save: true,
					hint: settings.hint,
					saveFilename: settings.filename,
					autoRequire: false, // Handled above anyway
				})
					.then(file => settings.id = file.id)
			})
			.then(()=> app.service('$supabase').fileSet(app.service('$projects').decodeFilePath(settings.id), contents, {
				overwrite: true,
				toast: false,
			}))
			.then(()=> null)
	}
	// }}}

	// Project Libraries - selectProjectLibrary(), getProjectLibrary(), setProjectLibrary() {{{

	/**
	* Prompt the user to select a library to operate on and return a array of references in a given format
	*
	* @param {Object} [options] Additional options to mutate behaviour - see `getProjectLibrary()` for parent list of options
	* @param {String} [options.title="Select a citation library"] The title of the dialog to display
	* @param {String|Array<String>} [options.hint] Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage - e.g. 'deduped', 'review1', 'review2', 'dedisputed'
	* @param {Boolean} [options.allowUpload=true] Allow uploading new files
	* @param {Boolean} [options.allowRefresh=true] Allow the user to manually refresh the file list
	* @param {Boolean} [options.allowDownloadZip=true] Allow the user to download a Zip of all files
	* @param {Boolean} [options.allowCancel=true] Allow cancelling the operation. Will throw `'CANCEL'` as the promise rejection if acationed
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {FileFilters} [options.filters] Optional file filters, defaults to citation library selection only
	*
	* @returns {Promise<Array<Ref>>} A collection of references from the selected file
	*/
	selectProjectLibrary(options) {
		let settings = {
			title: 'Select a citation library',
			hint: null,
			allowUpload: true,
			allowRefresh: true,
			allowDownloadZip: true,
			allowCancel: true,
			autoRequire: true,
			filters: {
				library: true,
				...options?.filter,
			},
			...options,
		};

		return app.service('$projects').promise()
			.then(()=> this.selectProjectFile(settings))
			.then(selectedFile => this.getProjectLibrary(selectedFile.id, settings))
	}


	/**
	* Fetch + convert a project file into a library of citations
	*
	* @param {String} id File ID to read
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.format='json'] Format for the file. ENUM: 'pojo' (return a parsed JS collection), 'blob' (raw JS Blob object), 'file' (named JS File object)
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Function} [options.filter] Optional async file filter, called each time as `(File:ProjectFile)`
	* @param {Function} [options.find] Optional async final stage file filter to reduce all candidates down to one subject file
	*
	* @returns {Promise<Array<Ref>>|Promise<*>} A collection of references (default bevahiour) or a whatever format was requested
	*/
	getProjectLibrary(id, options) {
		let settings = {
			format: 'pojo',
			autoRequire: true,
			filter: file => true, // eslint-disable-line
			find: files => files.at(0),
			...options,
		};

		let filePath = app.service('$projects').decodeFilePath(id);

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
			.then(()=> app.service('$supabase').fileGet(filePath, {
				toast: false,
			}))
			.then(blob => {
				switch (settings.format) {
					// NOTE: Any updates to the format list should also extend setProjectLibrary()
					case 'pojo':
						return Reflib.uploadFile({
							file: new File(
								[blob],
								app.service('$supabase')._parsePath(filePath).basename,
							),
						});
					case 'blob':
						return blob;
					case 'file':
						return new File(
							[blob],
							app.service('$supabase')._parsePath(filePath).basename,
						);
					default:
						throw new Error(`Unsupported library format "${settings.format}"`);
				}
			})
	}


	/**
	* Save back a citation library from some input
	*
	* @param {String} [id] File ID to save back to, if omitted a file will be prompted for
	* @param {Array<RefLibRef>|Blob|File} [refs] Collection of references for the selected library or the raw Blob/File
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.id] Alternate method to specify the file ID to save as, if omitted one will be prompted for
	* @param {Array<RefLibRef>|Blob|File} [options.refs] Alternate method to specify the refs to save as an array or raw Blob/File
	* @param {String} [options.format='auto'] Input format used. ENUM: 'auto' (try to figure it out from context), 'pojo' (JS array of RefLib references), 'blob' (raw JS Blob object), 'file' (named JS File object)
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {String|Array<String>} [options.hint] Hint(s) to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'
	* @param {String} [options.filename] Suggested filename if `id` is unspecified
	* @param {String} [options.title='Save citation library'] Dialog title if `id` is unspecified and a prompt is necessary
	* @param {Boolean} [options.overwrite=true] Allow existing file upsert
	* @param {Object} [options.meta] Optional meta data to merge into the file data
	*
	* @returns {Promise} A promise which resolves when the save operation has completed
	*/
	setProjectLibrary(id, refs, options) {
		let settings = {
			format: 'auto',
			autoRequire: true,
			hint: null,
			filename: null,
			title: 'Save citation library',
			overwrite: true,
			meta: null,
			...(
				typeof id == 'string' && Array.isArray(refs) ? {id, refs, ...options} // Called as (id, refs, options?)
				: Array.isArray(id) || refs instanceof Blob || refs instanceof File ? {refs: id, ...refs} // Called as (refs, options?)
				: id // Called as (options?)
			)
		};
		if (!settings.refs) throw new Error('No refs to save');

		let filePath; // Eventual Supabase path to use
		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
			.then(()=> {
				if (settings.id) return; // We already have a file ID specified - skip

				// Prompt for a save filename
				return this.selectProjectFile({
					title: settings.title,
					save: true,
					hint: settings.hint,
					saveFilename: settings.filename,
					filters: {
						library: true,
					},
					autoRequire: false, // Handled above anyway
				})
					.then(file => settings.id = file.id)
			})
			.then(()=> { // Compute filePath
				filePath = app.service('$projects').decodeFilePath(settings.id);
			})
			.then(()=> {
				// Mutate settings.ref -> Blob or File format needed by Supabase
				if (settings.format == 'auto') {
					settings.format =
						Array.isArray(settings.refs) ? 'pojo'
						: settings.refs instanceof Blob ? 'blob'
						: settings.refs instanceof File ? 'file'
						: (()=> { throw new Error('Unable to guess input format for setLibaryFormat()') })();
				}

				switch (settings.format) {
					// NOTE: Any updates to the format list should also extend getProjectLibrary()
					case 'pojo': // Use as is
						if (!Array.isArray(settings.refs)) throw new Error('setProjectLibrary() with format=pojo requires an array of references');

						// Get Reflib to encode the POJO into a Blob/File
						return Reflib.downloadFile(settings.refs, {
							filename: app.service('$supabase')._parsePath(filePath).basename,
							promptDownload: false, // Just return the fileBlob we hand to Supabase
						})
					case 'blob':
						if (!(settings.refs instanceof Blob)) throw new Error("setProjectLibrary({format: 'blob'} but non-Blob provided as `refs`");
						return new File([settings.refs], app.service('$supabase')._parsePath(filePath).basename);
					case 'file':
						if (!(settings.ref instanceof File)) throw new Error("setProjectLibrary({format: 'file'} but non-File provided as `refs`");
						return settings.refs;
					default:
						throw new Error(`Unsupported library format "${settings.format}"`);
				}
			})
			.then(fileBlob => app.service('$supabase').fileUpload(filePath, {
				file: fileBlob,
				overwrite: true,
				mode: 'encoded',
			}))
			.then(()=> null)
	}

	// }}}

	// Project Logging - projectLog() {{{
	/**
	* Create a log entry for the currently active project
	*
	* The required log object can be of various forms. See https://tera-tools.com/api/logs.json for the full list
	*
	* @param {Object} log The log entry to create
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	projectLog(log) {
		return app.service('$projects').log(log);
	}
	// }}}

	// Webpages - setPage() {{{
	/**
	* Set an active tools URL or other context information so that it survives a refresh
	* This only really makes a difference to tools within the tera-tools.com site where the tool is working as an embed
	*
	* @param {Object|String} options Context information about the page, if this is a string, its assumed to popupate `url`
	* @param {String} [options.path] The URL path segment to restore on next refresh
	* @param {String} [options.title] The page title associated with the path
	*/
	setPage(options) {
		app.service('$projects').setPage(options);
	}
	// }}}

	// Init - constructor(), init() {{{

	/**
	* Setup the TERA-fy client singleton
	*
	* @param {Object} [options] Additional options to merge into `settings`
	*/
	constructor(options) {
		Object.assign(this.settings, options);
	}


	/**
	* Initialize the browser listener
	*/
	init() {
		globalThis.addEventListener('message', this.acceptMessage.bind(this));
		this.debug('INFO', 1, 'Ready');
	}
	// }}}

	// UI - uiAlert(), uiConfirm(), uiProgress(), uiPrompt(), uiThrow(), uiWindow(), uiSplat() {{{
	/**
	* Display simple text within TERA
	*
	* @param {String} [text] Text to display, if specified this populates `options.body`
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.body="Alert!"] The body text to display
	* @param {Boolean} [options.isHtml=false] If falsy the text is rendered as plain-text otherwise it will be assumed as HTML content
	* @param {String} [options.title='TERA'] The title of the alert box
	* @param {'ok'|false} [options.buttons='ok'] Button set to use or falsy to disable
	*
	* @returns {Promise} A promise which resolves when the alert has been dismissed
	*/
	uiAlert(text, options) {
		let settings = {
			body: 'Alert!',
			isHtml: false,
			title: 'TERA',
			buttons: 'ok',
			...(
				typeof text == 'string' ? {body: text, ...options}
				: typeof text == 'object' ? text
				: options
			),
		};

		return this.requestFocus(()=>
			app.service('$prompt').dialog({
				title: settings.title,
				body: settings.body,
				buttons:
					settings.buttons == 'ok' ? ['ok']
					: false,
				isHtml: settings.isHtml,
				dialogClose: 'resolve',
			})
		);
	}


	/**
	* Present a simple ok/cancel dialog to the user
	*
	* @param {String} [text] Text to display, if specified this populates `options.body`
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.body="Confirm?"] The body text to display
	* @param {Boolean} [options.isHtml=false] If falsy the text is rendered as plain-text otherwise it will be assumed as HTML content
	* @param {String} [options.title='TERA'] The title of the confirmation box
	*
	* @returns {Promise} A promise which resolves with `Promise.resolve('OK')` or rejects with `Promise.reject('CANCEL')`
	*/
	uiConfirm(text, options) {
		let settings = {
			body: 'Confirm?',
			isHtml: false,
			title: 'TERA',
			...(
				typeof text == 'string' ? {body: text, ...options}
				: typeof text == 'object' ? text
				: options
			),
		};

		return this.requestFocus(()=>
			app.service('$prompt').dialog({
				title: settings.title,
				body: settings.body,
				isHtml: settings.isHtml,
				buttons: [
					{
						title: 'OK',
						class: 'btn btn-success',
						click: 'resolve',
					},
					{
						title: 'Cancel',
						class: 'btn btn-danger',
						click: 'reject',
					},
				],
			})
				.then(()=> 'OK')
				.catch(()=> Promise.reject('CANCEL'))
		);
	}


	/**
	* Display, update or dispose of windows for long running tasks
	* All options are cumulative - i.e. they are merged with other options previously provided
	*
	* @param {Object|Boolean} [options] Additional options to mutate behaviour, if boolean false `{close: true}` is assumed
	* @param {String} [options.body=''] Window body text
	* @param {Boolean} [options.bodyHtml=false] If truthy, treat the body as HTML
	* @param {String} [options.title='TERA'] Window title, can only be set on the initial call
	* @param {Boolean} [options.close=false] Close the existing dialog, if true the dialog is disposed and options reset
	* @param {Number} [options.progress] The current progress of the task being conducted, this is assumed to be a value less than `progressMax`
	* @param {Number} [options.progressMax] The maximum value that the progress can be
	*
	* @returns {Promise} A promise which resolves when the dialog has been updated
	*/
	uiProgress(options) {
		if (options === false) options = {close: true}; // Shorthand to close existing ui progress window

		if (this.uiProgressOptions === null) { // New uiProgress window
			this.uiProgressOptions = reactive({
				body: '',
				bodyHtml: false,
				title: 'TERA',
				close: false,
				progress: 0,
				progressMax: 0,
				...options,
			});
		} else { // Merge options with existing uiProgress window
			Object.assign(this.uiProgressOptions, options);
		}
		if (this.uiProgressOptions.close) { // Asked to close the dialog
			return Promise.resolve()
				.then(()=> this.uiProgressPromise && app.service('$prompt').close(true)) // Close the dialog if its open
				.then(()=> { // Release state
					this.uiProgressOptions = {};
					this.uiProgressPromise = null;
				})
		} else if (!this.uiProgressPromise) { // Not created the dialog yet
			this.uiProgressPromise = this.requestFocus(()=>
				app.service('$prompt').dialog({
					title: this.uiProgressOptions.title,
					component: 'uiProgress',
					componentProps: this.uiProgressOptions,
					closeable: false,
					keyboard: false,
				})
			);
			return Promise.resolve();
		}
	}

	uiProgressOptions = null;
	uiProgressPromise;


	/**
	* Prompt the user for an input, responding with a Promisable value
	*
	* @param {String} [text] Text to display, if specified this populates `options.body`
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.body] Optional additional body text
	* @param {String} [options.value] Current or default value to display pre-filled
	* @param {String} [options.title='Input required'] The dialog title to display
	* @param {Boolean} [options.bodyHtml=false] If truthy, treat the body as HTML
	* @param {String} [options.placeholder] Optional placeholder text
	* @param {Boolean} [options.required=true] Treat nullish or empty inputs as a cancel operation
	*
	* @returns {Promise<*>} Either the eventual user value or a throw with `Promise.reject('CANCEL')`
	*/
	uiPrompt(text, options) {
		let settings = {
			body: '',
			bodyHtml: false,
			title: 'Input required',
			value: '',
			placeholder: '',
			required: true,
			...(
				typeof text == 'string' ? {body: text, ...options}
				: typeof text == 'object' ? text
				: options
			),
		};

		return this.requestFocus(()=>
			app.service('$prompt').dialog({
				title: settings.title,
				closable: true,
				component: 'UiPrompt',
				componentProps: {
					body: settings.body,
					bodyHtml: settings.bodyHtml,
					placeholder: settings.placeholder,
					value: settings.valuie,
				},
				buttons: ['ok', 'cancel'],
			})
		)
			.then(answer => {
				if (answer) {
					return answer;
				} else if (settings.required) {
					return Promise.reject('CANCEL');
				} else {
					return answer;
				}
			})
			.catch(()=> Promise.reject('CANCEL'))
	}


	/**
	* Catch an error using the TERA error handler
	*
	* @param {Error|Object|String} error Error to handle, generally an Error object but can be a POJO or a scalar string
	*
	* @returns {Void} This function is fatal
	*/
	uiThrow(error) {
		return this.requestFocus(()=>
			app.service('$errors').catch(error)
		);
	}


	/**
	* Open a popup window containing a new site
	*
	* @param {String} url The URL to open
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Number} [options.width=500] The desired width of the window
	* @param {Number} [options.height=600] The desired height of the window
	* @param {Boolean} [options.center=true] Attempt to center the window on the screen
	* @param {Object} [options.permissions] Additional permissions to set on opening, defaults to a suitable set of permission for popups (see code)
	*
	* @returns {WindowProxy} The opened window object (if `noopener` is not set in permissions)
	*/
	uiWindow(url, options) {
		let settings = {
			width: 500,
			height: 600,
			center: true,
			permissions: {
				popup: true,
				location: false,
				menubar: false,
				status: false,
				scrolbars: false,
			},
			...options,
		};

		return window.open(url, '_blank', Object.entries({
			...settings.permissions,
			width: settings.width,
			height: settings.height,
			...(settings.center && {
				left: screen.width/2 - settings.width/2,
				top: screen.height/2 - settings.height/2,
			}),
		})
			.map(([key, val]) => key + '=' + (
				typeof val == 'boolean' ? val ? '1' : '0' // Map booleans to 1/0
				: val
			))
			.join(', ')
		);
	}


	/**
	* Display HTML content full-screen within TERA
	* This function is ideally called within a requestFocus() wrapper
	*
	* @param {DOMElement|String|false} content Either a prepared DOM element or string to compile, set to falsy to remove existing content
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean|String} [options.logo=false] Add a logo to the output, if boolean true the Tera-tools logo is used otherwise specify a path or URL
	*/
	uiSplat(content, options) {
		let settings = {
			logo: false,
			...options,
		};

		if (!content) { // Remove content
			globalThis.document.body.querySelector('.tera-fy-uiSplat').remove();
			return;
		}

		let compiledContent = typeof content == 'string'
			? (()=> {
				let el = document.createElement('div')
				el.innerHTML = content;
				return el;
			})()
			: content;

		compiledContent.classList.add('tera-fy-uiSplat');

		if (settings.logo) {
			let logoEl = document.createElement('div');
			logoEl.innerHTML = `<img src="${typeof settings.logo == 'string' ? settings.logo : '/assets/logo/logo.svg'}" class="img-logo"/>`;
			compiledContent.prepend(logoEl);
		}

		globalThis.document.body.append(compiledContent);
	}
	// }}}

	// Utility - debug() {{{

	/* eslint-disable jsdoc/check-param-names */
	/**
	* Debugging output function
	* This function will only act if `settings.devMode` is truthy
	*
	* @param {'INFO'|'LOG'|'WARN'|'ERROR'} [method='LOG'] Logging method to use
	* @param {Number} [verboseLevel=1] The verbosity level to trigger at. If `settings.verbosity` is lower than this, the message is ignored
	* @param {...*} [msg] Output to show
	*/
	debug(...msg) {
		if (!this.settings.devMode || this.settings.verbosity < 1) return; // Debugging is disabled
		let method = 'log';
		let verboseLevel = 1;
		// Argument mangling for prefix method + verbosity level {{{
		if (typeof msg[0] == 'string' && ['INFO', 'LOG', 'WARN', 'ERROR'].includes(msg[0])) {
			method = msg.shift().toLowerCase();
		}

		if (typeof msg[0] == 'number') {
			verboseLevel = msg[0];
			msg.shift();
		}
		// }}}

		if (this.settings.verbosity < verboseLevel) return; // Called but this output is too verbose for our settings - skip

		console[method](
			'%c[TERA-FY SERVER]',
			'font-weight: bold; color: #4d659c;',
			...msg,
		);
	}
	/* eslint-enable */
	// }}}
}
