import {cloneDeep} from 'lodash-es';
import {nanoid} from 'nanoid';

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
	* @property {String} restrictOrigin URL to restrict communications to
	*/
	settings = {
		restrictOrigin: '*',
	};

	// Contexts - createContext(), messageEvent, senderRpc() {{{
	/**
	* Create a context based on a shallow copy of this instance + additional functionality for the incoming MessageEvent
	* This is used by acceptMessage to provide a means to reply / send messages to the originator
	*
	* @param {MessageEvent} e Original message event to base the new context on
	*
	* @returns {Object} A context, which is this instance extended with additional properties
	*/
	createContext(e) {
		// Rather ugly shallow-copy-of instance hack from https://stackoverflow.com/a/44782052/1295040
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this, {
			messageEvent: e,
			sendRaw(message) { // Override sendRaw because we can't do this inline for security reasons
				this.debug('Send to message source', e.origin, {message});
				e.source.postMessage(
					{
						TERA: 1,
						...cloneDeep(message), // Need to clone to resolve promise nasties
					},
					this.settings.restrictOrigin
				);
			},
		});
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

	// Messages - handshake(), sendRaw(), acceptMessage(), requestFocus() {{{

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
	*
	* @param {Object} message Message object to send
	*/
	sendRaw(message) {
		this.debug('SendRaw', {message});
		globalThis.parent.postMessage(
			{
				TERA: 1,
				...cloneDeep(message), // Need to clone to resolve promise nasties
			},
			this.settings.restrictOrigin
		);
	}


	/**
	* Accept a message from the parent event listener
	*
	* @param {MessageEvent} Raw message event to process
	*/
	acceptMessage(rawMessage) {
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
			.then(res => this.sendRaw({
				id: message.id,
				action: 'response',
				response: res,
			}))
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
			.then(()=> this.senderRpc('toggleFocus', true))
			.then(()=> cb.call(this))
			.finally(()=> this.senderRpc('toggleFocus', false))
	}
	// }}}

	// Session / User - getUser() {{{

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
			.then(()=> ({
				id: $auth.user.id,
				email: $auth.user.email,
				name: [
					$auth.user.given_name,
					$auth.user.family_name,
				].filter(Boolean).join(' '),
				isSubscribed: $subscriptions.isSubscribed,
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
	* Ask the user to select a project from those available - if one isn't already active
	* Note that this function will percist in asking the uesr even if they try to cancel
	*
	* @returns {Promise<Project>} The active project
	*/
	requireProject() {
		return this.getProject()
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
										title: 'Select project',
										body: 'A project needs to be selected to continue',
										buttons: ['ok'],
									})
								)
								.then(()=> askProject())
								.catch(reject)
							} else {
								reject(e);
							}
						})
				});
			})
	}


	/**
	* Prompt the user to select a project from those available
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.title="Select a project to work with"] The title of the dialog to display
	* @param {Boolean} [options.allowCancel=true] Advertise cancelling the operation, the dialog can still be cancelled by closing it
	*
	* @returns {Promise<Project>} The active project
	*/
	selectProject(options) {
		let settings = {
			title: 'Select a project to work with',
			allowCancel: true,
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
	}


	// }}}

	// Project State - getProjectStateSnapshot(), applyProjectStatePatch() {{{

	/**
	* Return the current, full snapshot state of the active project
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Array<String>} Paths to subscribe to e.g. ['/users/'],
	*
	* @returns {Promise<Object>} The current project state snapshot
	*/
	getProjectStateSnapshot(options) {
		let settings = {
			autoRequire: true,
			paths: null,
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
	}


	/**
	* Apply a computed `just-diff` patch to the current project state
	*/
	applyProjectStatePatch(patch) {
		this.debug('Applying sever state patch', {patch});
	}

	// }}}

	// Project Libraries - getProjectLibrary(), setProjectLibrary() {{{

	/**
	* Fetch the active projects citation library
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Boolean} [options.multiple=false] Allow selection of multiple libraries
	* @param {String|Array<String>} [options.hint] Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage - e.g. 'deduped', 'review1', 'review2', 'dedisputed'
	*
	* @returns {Promise<Array<RefLibRef>>} Collection of references for the selected library
	*/
	getProjectLibrary(options) {
		let settings = {
			autoRequire: true,
			multiple: false,
			hint: null,
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
			// FIXME: Stub
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

	// Utility - debug() {{{

	/**
	* Debugging output function
	* This function will only act if `settings.devMode` is truthy
	*
	* @param {String} [msg...] Output to show
	*/
	debug(...msg) {
		if (!this.settings.devMode) return;
		console.log(
			'%c[TERA-FY SERVER]',
			'font-weight: bold; color: #4d659c;',
			...msg,
		);
	}

	// }}}
}
