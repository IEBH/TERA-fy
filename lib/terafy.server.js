import {cloneDeep, has as pathExists, set as pathSet} from 'lodash-es';
import {diffApply, jsonPatchPathConverter as jsPatchConverter} from 'just-diff-apply';
import {nanoid} from 'nanoid';
import mixin from '#utils/mixin';
import Reflib from '@iebh/reflib';

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
	* @property {Number} subscribeTimeout Acceptable timeout period for subscribers to acklowledge a project change event, failing to respond will result in the subscriber being removed from the available subscriber list
	* @property {String} restrictOrigin URL to restrict communications to
	* @property {String} projectId The project to use as the default reference when calling various APIs
	* @property {Number} The current server mode matching `SERVERMODE_*`
	*/
	settings = {
		devMode: false,
		restrictOrigin: '*',
		subscribeTimeout: 2000,
		projectId: null,
		serverMode: 0,
	};

	static SERVERMODE_NONE = 0;
	static SERVERMODE_EMBEDDED = 1;
	static SERVERMODE_WINDOW = 2;
	static SERVERMODE_TERA = 3; // Terafy is running as the main TERA site


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
					this.debug('ERROR', 'Attempted to dispatch payload server(via reply)->client', {payload, e});
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
							this.debug('ERROR', 'Attempted to dispatch payload server(iframe)->cient(top level window)', {payload, e});
							throw e;
						}
					},
				});
			case TeraFyServer.SERVERMODE_WINDOW:
				// Server is the top-level window so we need to send messages to an embedded iFrame
				var iFrame = document.querySelector('iframe#external');
				if (!iFrame) throw new Error('Cannot locate TERA-FY top-level->iFrame#external');

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
							this.debug('ERROR', 'Attempted to dispatch payload server(top level window)->cient(iframe)', {payload, e});
							throw e;
						}
					},
				});
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
	* @param {*} [...] Optional arguments to pass to the function
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
		return {
			date: new Date(),
		};
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
	* @param {Window} Window context to dispatch the message via if its not the same as the regular window
	*/
	sendRaw(message, sendVia) {
		let payload;
		try {
			payload = {
				TERA: 1,
				...cloneDeep(message), // Need to clone to resolve promise nasties
			};
			this.debug('INFO', 'Parent send', message, '<=>', payload);
			(sendVia || globalThis.parent).postMessage(payload, this.settings.restrictOrigin);
		} catch (e) {
			this.debug('ERROR', 'Attempted to dispatch payload server->client', payload);
			this.debug('ERROR', 'Message compose server->client:', e);
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
			case 'window':
				this.settings.serverMode = TeraFyServer.SERVERMODE_WINDOW;
				break;
			default:
				throw new Error(`Unsupported server mode "${mode}"`);
		}
	}


	/**
	* Accept a message from the parent event listener
	*
	* @param {MessageEvent} Raw message event to process
	*/
	acceptMessage(rawMessage) {
		if (rawMessage.origin == window.location.origin) return; // Message came from us

		let message = rawMessage.data;
		if (!message.TERA) return; // Ignore non-TERA signed messages
		this.debug('Recieved', message);

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
					this.debug('Unexpected incoming TERA-FY SERVER message', {message});
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
					response: e.toString(),
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
	* @param {*} [args...] Optional event payload to send
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
	* @returns {Promise<User>} The current logged in user or null if none
	*/
	getUser() {
		let $auth = app.service('$auth');
		let $subscriptions = app.service('$subscriptions');

		return Promise.all([
			$auth.promise(),
			$subscriptions.promise(),
		])
			.then(()=> $auth.user.id ? {
				id: $auth.user.id,
				email: $auth.user.email,
				name: [
					$auth.user.given_name,
					$auth.user.family_name,
				].filter(Boolean).join(' '),
				isSubscribed: $subscriptions.isSubscribed,
			} : null)
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
			.then(user => user || this.uiAlert('You must be logged in to <a href="https://tera-tools.com" target="_blank">TERA-tools.com</a> to use this tool', {
				title: 'TERA-tools account needed',
				isHtml: true,
			}))
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
	*/
	setActiveProject(project) {
		return app.service('$projects').setActive(project)
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
	* @param {Boolean} [options.allowCancel=true] Advertise cancelling the operation, the dialog can still be cancelled by closing it
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

	// Project State - getProjectState(), setProjectState(), saveProjectState(), replaceProjectState(), applyProjectStatePatch {{{

	/**
	* Return the current, full snapshot state of the active project
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Array<String>} Paths to subscribe to e.g. ['/users/'],
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
	* Paths can be any valid Lodash.set() value such as:
	*
	*     - Dotted notation - e.g. `foo.bar.1.baz`
	*     - Array path segments e.g. `['foo', 'bar', 1, 'baz']`
	*
	* @param {String|Array<String>} path The sub-path within the project state to set
	* @param {*} value The value to set
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.save=true] Save the changes to the server immediately, disable to queue up multiple writes
	* @param {Boolean} [options.sync=false] Wait for the server to acknowledge the write, you almost never need to do this
	*
	* @returns {Promise} A promise which resolves when the operation has synced with the server
	*/
	setProjectState(path, value, options) {
		let settings = {
			save: true,
			sync: false,
			...options,
		};

		if (!app.service('$projects').active) throw new Error('No active project');
		if (typeof path != 'string' && !Array.isArray(path)) throw new Error('setProjectStateDefaults(path, value) - path must be a dotted string or array of path segments');

		pathSet(app.service('$projects').active, path, value)

		return (
			this.save && this.sync ? this.saveProjectState()
			: this.save ? void this.saveProjectState()
			: (()=> { throw new Error('setProjectState({sync: true, save: false}) makes no sense') })()
		);
	}


	/**
	* Set a nested value within the project state - just like `setProjectState()` - but only if no value for that path exists
	*
	* @see setProjectState()
	* @param {String|Array<String>} path The sub-path within the project state to set
	* @param {*} value The value to set
	* @param {Object} [options] Additional options to mutate behaviour, see setProjectState() for the full list of supported options
	*
	* @returns {Promise<Boolean>} A promise which resolves to whether any changes were made - True if defaults were applied, false otherwise
	*/
	setProjectStateDefaults(path, value, options) {
		if (!app.service('$projects').active) throw new Error('No active project');

		if (!pathExists(app.service('$projects').active, path)) {
			return this.setProjectState(path, value, options)
				.then(()=> true)
		} else {
			return Promise.resolve(false);
		}
	}


	/**
	* Force-Save the currently active project state
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	saveProjectState() {
		if (!app.service('$projects').active) throw new Error('No active project');

		this.debug('FIXME: Force saving projects is not yet supported - this should occur in realtime anyway');
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
	* @param {Object} Patch to apply
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	applyProjectStatePatch(patch) {
		if (!app.service('$projects').active) throw new Error('No active project to patch');
		this.debug('Applying', patch.length, 'project state patches', {patch});
		diffApply(app.service('$projects').active, patch, jsPatchConverter);

		return Promise.resolve();
	}
	// }}}

	// Project files - getProjectFiles() {{{

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
	* Fetch the files associated with a given project
	*
	* @param {Object} options Options which mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Boolean} [options.meta=true] Pull meta information for each file entity
	*
	* @returns {Promise<ProjectFile>} A collection of project files for the given project
	*/
	getProjectFiles(options) {
		let settings = {
			autoRequire: true,
			meta: true,
			...options,
		};

		return Promise.resolve()
			.then(()=> app.service('$projects').promise())
			.then(()=> settings.autoRequire && this.requireProject())
			.then(project => app.service('$supabase').fileList(`/projects/${project.id}`, {
				meta: settings.meta,
			}))
	}
	// }}}

	// Project Libraries - getProjectLibrary(), setProjectLibrary() {{{

	/**
	* Fetch the active projects citation library
	*
	* @param {String} [path] Optional file path to use, if omitted the contents of `options` are used to guess at a suitable file
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.format='json'] Format for the file. ENUM: 'pojo' (return a parsed JS collection), 'blob' (raw JS Blob object), 'file' (named JS File object)
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Boolean} [options.multiple=false] Allow selection of multiple libraries
	* @param {Function} [options.filter] Optional async file filter, called each time as `(File:ProjectFile)`
	* @param {Function} [options.find] Optional async final stage file filter to reduce all candidates down to one subject file
	* @param {String|Array<String>} [options.hint] Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage - e.g. 'deduped', 'review1', 'review2', 'dedisputed'
	*
	* @returns {Promise<Array<ProjectFile>>} Collection of references for the selected library matching the given hint + filter, this could be a zero length array
	*/
	getProjectLibrary(path, options) {
		let settings = {
			path,
			format: 'pojo',
			autoRequire: true,
			multiple: false,
			hint: null,
			filter: file => true,
			find: files => files.at(0),
			...(typeof path == 'string' ? {path, ...options} : path),
		};

		return Promise.resolve()
			.then(()=> {
				if (settings.path) { // Already have a file name picked
					if (!settings.path.startsWith('/')) throw new Error('All file names must start with a forward slash');
					return settings.path;
				} else { // Try to guess the file from the options structure
					return this.getProjectFiles({
						autoRequire: settings.autoRequire,
					})
					.then(files => files.filter(file =>
						settings.filter(file)
					))
					.then(files => settings.find(files))
					.then(file => file.path)
				}
			})
			.then(filePath => app.service('$supabase').fileGet(filePath, {
				toast: false,
			}))
			.then(blob => {
				switch (settings.format) {
					case 'pojo':
						return Reflib.uploadFile({
							file: new File(
								[blob],
								app.service('$supabase')._parsePath(settings.path).basename,
							),
						});
					case 'blob':
						return blob;
					case 'file':
						return new File(
							[blob],
							app.service('$supabase')._parsePath(settings.path).basename,
						);
					default:
						throw new Error(`Unsupported library format "${settings.format}"`);
				}
			})
	}


	/**
	* Save back a projects citation library
	*
	* @param {Array<RefLibRef>} Collection of references for the selected library
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {String} [options.hint] Hint to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'
	*
	* @returns {Promise} A promise which resolves when the save operation has completed
	*/
	setProjectLibrary(refs, options) {
		let settings = {
			autoRequire: true,
			hint: null,
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
		// FIXME: Stub
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
	}
	// }}}

	// UI - uiAlert() {{{
	/**
	* Display simple text within TERA
	*
	* @param {String} text The text to display
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.title='TERA'] The title of the alert box
	* @param {Boolean} [options.isHtml=false] If falsy the text is rendered as plain-text otherwise it will be assumed as HTML content
	*
	* @returns {Promise} A promise which resolves when the alert has been dismissed
	*/
	uiAlert(text, options) {
		let settings = {
			title: 'TERA',
			isHtml: false,
			...options,
		};

		return this.requestFocus(()=>
			app.service('$prompt').dialog({
				title: settings.title,
				body: text,
				buttons: ['ok'],
				isHtml: settings.isHtml,
				dialogClose: 'resolve',
			})
		);
	}
	// }}}

	// Utility - debug() {{{

	/**
	* Debugging output function
	* This function will only act if `settings.devMode` is truthy
	*
	* @param {String} [msg...] Output to show
	*/
	debug(...msg) {
		let method = 'log';
		// Argument mangling for prefixing method {{{
		if (typeof msg[0] == 'string' && ['INFO', 'LOG', 'WARN', 'ERROR'].includes(msg[0])) {
			method = msg.shift().toLowerCase();
		}
		// }}}

		if (
			['INFO', 'LOG'].includes(method)
			&& !this.settings.devMode
		) return;

		console.log(
			'%c[TERA-FY SERVER]',
			'font-weight: bold; color: #4d659c;',
			...msg,
		);
	}

	// }}}
}
