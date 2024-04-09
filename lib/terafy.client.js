import {diff, jsonPatchPathConverter as jsPatchConverter} from 'just-diff';
import {cloneDeep} from 'lodash-es';
import Mitt from 'mitt';
import {nanoid} from 'nanoid';
import ProjectFile from './projectFile.js';

/* globals globalThis */


/**
* Main Tera-Fy Client (class singleton) to be used in a frontend browser
*
* @class TeraFy
*/
export default class TeraFy {
	/**
	* Various settings to configure behaviour
	*
	* @type {Object}
	* @property {Boolean} devMode Operate in devMode - i.e. force outer refresh when encountering an existing TeraFy instance
	* @property {'detect'|'parent'|'child'|'popup'} mode How to communicate with TERA. 'parent' assumes that the parent of the current document is TERA, 'child' spawns an iFrame and uses TERA there, 'detect' tries parent and switches to `modeFallback` if communication fails
	* @property {String} modeFallback Method to use when all method detection fails
	* @property {Number} modeTimeout How long entities have in 'detect' mode to identify themselves
	* @property {String} siteUrl The TERA URL to connect to
	* @property {String} restrictOrigin URL to restrict communications to
	* @property {Array<String>} List of sandbox allowables for the embedded if in embed mode
	* @property {Number} handshakeInterval Interval in milliseconds when sanning for a handshake
	*/
	settings = {
		devMode: true,
		mode: 'detect',
		modeTimeout: 300,
		modeFallback: 'child', // ENUM: 'child' (use iframes), 'popup' (use popup windows)
		siteUrl: 'https://tera-tools.com/embed',
		restrictOrigin: '*', // FIXME: Need to restrict this to TERA site
		frameSandbox: [
			'allow-forms',
			'allow-modals',
			'allow-orientation-lock',
			'allow-pointer-lock',
			'allow-popups',
			'allow-popups-to-escape-sandbox',
			'allow-presentation',
			'allow-same-origin',
			'allow-scripts',
			'allow-top-navigation',
		],
		handshakeInterval: 1000,
	};


	/**
	* Event emitter subscription endpoint
	* @type {Mitt}
	*/
	events = Mitt();


	/**
	* DOMElements for this TeraFy instance
	*
	* @type {Object}
	* @property {DOMElement} el The main tera-fy div wrapper
	* @property {DOMElement} iframe The internal iFrame element  (if `settings.mode == 'child'`)
	* @property {Window} popup The popup window context (if `settings.mode == 'popup'`)
	* @property {DOMElement} stylesheet The corresponding stylesheet
	*/
	dom = {
		el: null,
		iframe: null,
		popup: null,
		stylesheet: null,
	};


	/**
	* List of function stubs mapped here from the server
	* This array is forms the reference of `TeraFy.METHOD()` objects to provide locally which will be mapped via `TeraFy.rpc(METHOD, ...args)`
	*
	* @type {Array<String>}
	*/
	methods = [
		// Messages
		'handshake',

		// Session
		'getUser',
		'requireUser',

		// Projects
		'bindProject',
		'getProject',
		'getProjects',
		'setActiveProject',
		'requireProject',
		'selectProject',

		// Project State
		'getProjectState',
		'setProjectState',
		'setProjectStateDefaults',
		'saveProjectState',
		'replaceProjectState',
		'applyProjectStatePatch',
		// For bindProjectState() - See individual plugins

		// Project files
		// 'selectProjectFile', - Handled below (requires return collection mapped to ProjectFile)
		// 'getProjectFiles', - Handled below (requires return collection mapped to ProjectFile)
		// 'getProjectFile', - Handled below (requires return mapped to ProjectFile)
		'setProjectFile',

		// Project Libraries
		'selectProjectLibrary',
		'parseProjectLibrary',
		'setProjectLibrary',

		// UI
		'uiAlert',
		'uiSplat',
		'uiWindow',
	];


	/**
	* Loaded plugins via Use()
	* @type {Array<TeraFyPlugin>}
	*/
	plugins = [];


	// Messages - send(), sendRaw(), rpc(), acceptMessage() {{{

	/**
	* Send a message + wait for a response object
	*
	* @param {Object} message Message object to send
	* @returns {Promise<*>} A promise which resolves when the operation has completed with the remote reply
	*/
	send(message) {
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
	* Send raw message content to the server
	* This function does not return or wait for a reply - use `send()` for that
	*
	* @param {Object} message Message object to send
	*/
	sendRaw(message) {
		let payload;
		try {
			payload = {
				TERA: 1,
				id: message.id || nanoid(),
				...cloneDeep(message), // Need to clone to resolve promise nasties
			};

			if (this.settings.mode == 'parent') {
				window.parent.postMessage(payload, this.settings.restrictOrigin);
			} else if (this.settings.mode == 'child') {
				this.dom.iframe.contentWindow.postMessage(payload, this.settings.restrictOrigin);
			} else if (this.settings.mode == 'popup') {
				this.dom.popup.postMessage(payload, this.settings.restrictOrigin);
			} else if (this.settings.mode == 'detect') {
				throw new Error('Call init() or detectMode() before trying to send data to determine the mode');
			} else {
				throw new Error(`Unknown TERA communication mode "${this.settings.mode}"`);
			}
		} catch (e) {
			this.debug('ERROR', 'Message compose client->server:', e);
			this.debug('ERROR', 'Attempted to dispatch payload client->server', payload);
			throw e;
		}
	}


	/**
	* Call an RPC function in the server instance
	*
	* @param {String} method The method name to call
	* @param {*} [...] Optional arguments to pass to the function
	*
	* @returns {Promise<*>} The resolved output of the server function
	*/
	rpc(method, ...args) {
		return this.send({
			action: 'rpc',
			method,
			args,
		});
	}


	/**
	* Accept an incoming message
	*
	* @param {MessageEvent} Raw message event to process
	*/
	acceptMessage(rawMessage) {
		if (rawMessage.origin == window.location.origin) return; // Message came from us

		let message = rawMessage.data;
		if (!message.TERA || !message.id) return; // Ignore non-TERA signed messages
		this.debug('Recieved', message);

		if (message?.action == 'response' && this.acceptPostboxes[message.id]) { // Postbox waiting for reply
			if (message.isError === true) {
				this.acceptPostboxes[message.id].reject(message.response);
			} else {
				this.acceptPostboxes[message.id].resolve(message.response);
			}
		} else if (message?.action == 'rpc') {
			return Promise.resolve()
				.then(()=> this[message.method].apply(this, message.args))
				.then(res => this.sendRaw({
					id: message.id,
					action: 'response',
					response: res,
				}))
				.catch(e => {
					console.warn(`TERA-FY client threw on RPC:${message.method}:`, e);
					this.sendRaw({
						id: message.id,
						action: 'response',
						isError: true,
						response: e.toString(),
					});
				})
		} else if (message?.action == 'event') {
			return Promise.resolve()
				.then(()=> this.events.emit(message.event, ...message.payload))
				.catch(e => {
					console.warn(`TERA-FY client threw while handling emitted event "${message.event}"`, {message});
					throw e;
				})
		} else if (message?.id) {
			this.debug(`Ignoring message ID ${message.id} - was meant for someone else?`);
		} else {
			this.debug('Unexpected incoming TERA-FY CLIENT message', {message});
		}
	}


	/**
	* Listening postboxes, these correspond to outgoing message IDs that expect a response
	*/
	acceptPostboxes = {};

	// }}}

	// Project state - createProjectStatePatch(), applyProjectStatePatchLocal() {{{
	/**
	* Create + transmit a new project state patch base on the current and previous states
	* The transmitted patch follows the [JSPatch](http://jsonpatch.com) standard
	* This function accepts an entire projectState instance, computes the delta and transmits that to the server for merging
	*
	* @param {Object} newState The local projectState to accept
	* @param {Object} oldState The previous projectState to examine against
	*
	* @returns {Promise} A promise which will resolve when the operation has completed
	*/
	createProjectStatePatch(newState, oldState) {
		let patch = diff(oldState, newState, jsPatchConverter);
		this.debug('INFO', 'Created project patch', {newState, oldState});
		return this.applyProjectStatePatch(patch);
	}


	/**
	* Client function which accepts a patch from the server and applies it to local project state
	* The patch should follow the [JSPatch](http://jsonpatch.com) standard
	* This function is expected to be sub-classed by a plugin
	*
	* @param {Array} patch A JSPatch patch to apply
	*
	* @returns {Promise} A promise which will resolve when the operation has completed
	*/
	applyProjectStatePatchLocal(patch) {
		throw new Error('applyProjectStatePatchLocal() has not been sub-classed by a plugin');
	}
	// }}}

	// Init - constructor(), init(), inject*() {{{

	/**
	* Setup the TERA-fy client singleton
	*
	* @param {Object} [options] Additional options to merge into `settings` via `set`
	*/
	constructor(options) {
		if (options) this.set(options);
	}


	/**
	* Initalize the TERA client singleton
	* This function can only be called once and will return the existing init() worker Promise if its called againt
	*
	* @param {Object} [options] Additional options to merge into `settings` via `set`
	* @returns {Promise<TeraFy>} An eventual promise which will resovle with this terafy instance
	*/
	init(options) {
		if (options) this.set(options);
		if (this.init.promise) return this.init.promise; // Aleady been called - return init promise

		window.addEventListener('message', this.acceptMessage.bind(this));

		const context = this;
		return this.init.promise = Promise.resolve()
			.then(()=> this.detectMode())
			.then(mode => this.settings.mode = mode)
			.then(()=> Promise.all([
				// Init core functions async
				this.injectComms(),
				this.injectStylesheet(),
				this.injectMethods(),
			]))
			.then(()=> this.rpc('setServerMode', // Tell server what mode its in
				this.settings.mode == 'child' ? 'embedded'
				: this.settings.mode == 'parent' ? 'frame'
				: this.settings.mode == 'popup' ? 'popup'
				: (()=> { throw(`Unknown server mode "${this.settings.mode}"`) })()
			))
			.then(()=> Promise.all( // Init all plugins (with this outer module as the context)
				this.plugins.map(plugin =>
					plugin.init.call(context, this.settings)
				)
			))
	}



	/**
	* Populate `settings.mode`
	* Try to communicate with a parent frame, if none assume we need to fallback to child mode
	*
	* @returns {Promise<String>} A promise which will resolve with the detected mode to use
	*/
	detectMode() {
		if (this.settings.mode != 'detect') { // Dev has specified a forced mode to use
			return this.settings.mode;
		} else if (window.self === window.parent) { // This frame is already at the top
			return this.settings.modeFallback;
		} else { // No idea - try messaging
			return Promise.resolve()
				.then(()=> this.settings.mode = 'parent') // Switch to parent mode...
				.then(()=> new Promise((resolve, reject) => { // And try messaging with a timeout
					let timeoutHandle = setTimeout(()=> reject(), this.settings.modeTimeout);

					this.rpc('handshake')
						.then(()=> clearTimeout(timeoutHandle))
						.then(()=> resolve())
				}))
				.then(()=> 'parent')
				.catch(()=> this.settings.modeFallback)
		}
	}


	/**
	* Find an existing active TERA server OR initalize one
	*
	* @returns {Promise} A promise which will resolve when the loading has completed and we have found a parent TERA instance or initiallized a child
	*/
	injectComms() { return new Promise(resolve => {
		switch (this.settings.mode) {
			case 'child':
				this.debug('Injecting TERA site as iFrame child');

				this.dom.el = document.createElement('div')
				this.dom.el.id = 'tera-fy';
				this.dom.el.classList.toggle('dev-mode', this.settings.devMode);
				document.body.append(this.dom.el);

				this.dom.iframe = document.createElement('iframe')

				// Queue up event chain when document loads
				this.dom.iframe.setAttribute('sandbox', this.settings.frameSandbox.join(' '));
				this.dom.iframe.addEventListener('load', ()=> {
					this.debug('Embed frame ready');
					resolve();
				});

				// Start document load sequence + append to DOM
				this.dom.iframe.src = this.settings.siteUrl;
				this.dom.el.append(this.dom.iframe);
				break;
			case 'parent':
				this.debug('Using TERA window parent');
				resolve();
				break;
			case 'popup':
				this.debug('Injecting TERA site as a popup window');
				this.dom.popup = window.open(this.settings.siteUrl, '_blank', 'popup=1, location=0, menubar=0, status=0, scrollbars=0, width=500, height=600');

				// Loop until the window context returns a handshake
				(()=> {
					let handshakeCount = 0;
					let handshakeTimer;

					const tryHandshake = ()=> {
						this.debug('Trying handshake', ++handshakeCount);

						clearTimeout(handshakeTimer);
						handshakeTimer = setTimeout(tryHandshake, this.settings.handshakeInterval);

						this.rpc('handshake')
							.then(()=> {
								clearTimeout(handshakeTimer);
								this.debug('Popup window accepted handshake');
								resolve();
							});
					};
					tryHandshake();
				})();
				break;
			default:
				throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`);
		}
	})}


	/**
	* Inject a local stylesheet to handle TERA server functionality
	*/
	injectStylesheet() {
		switch (this.settings.mode) {
			case 'child':
				this.dom.stylesheet = document.createElement('style');
				this.dom.stylesheet.innerHTML = [
					':root {',
						'--TERA-accent: #4d659c;',
					'}',

					'#tera-fy {',
						'display: none;',
						'position: fixed;',
						'right: 50px;',
						'bottom: 50px;',
						'width: 300px;',
						'height: 150px;',
						'background: transparent;',

						'&.dev-mode {',
							'display: flex;',
							'border: 5px solid var(--TERA-accent);',
							'background: #FFF;',
						'}',

						'& > iframe {',
							'width: 100%;',
							'height: 100%;',
						'}',
					'}',

					// Fullscreen functionality {{{
					'body.tera-fy-focus {',
						'overflow: hidden;',

						'& #tera-fy {',
							'display: flex !important;',
							'position: fixed !important;',
							'top: 0px !important;',
							'width: 100vw !important;',
							'height: 100vh !important;',
							'left: 0px !important;',
							'z-index: 10000 !important;',
						'}',
					'}',
					// }}}
				].join('\n');
				document.head.appendChild(this.dom.stylesheet);
				break;
			case 'parent':
			case 'popup':
				break;
			default:
				throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`);
		}
	}


	/**
	* Inject all server methods defined in `methods` as local functions wrapped in the `rpc` function
	*/
	injectMethods() {
		this.methods.forEach(method =>
			this[method] = this.rpc.bind(this, method)
		);
	}
	// }}}

	// Utility - debug(), use(), mixin(), toggleDevMode(), toggleFocus() {{{

	/**
	* Debugging output function
	* This function will only act if `settings.devMode` is truthy
	*
	* @param {'VERBOSE'|'INFO'|'LOG'|'WARN'|'ERROR'} [status] Optional prefixing level to mark the message as. 'WARN' and 'ERROR' will always show reguardless of devMode being enabled
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

		console[method](
			'%c[TERA-FY CLIENT]',
			'font-weight: bold; color: #ff5722;',
			...msg,
		);
	}


	/**
	* Set or merge settings
	* This function also routes 'special' keys like `devMode` to their internal handlers
	*
	* @param {String|Object} key Either a single setting key to set or an object to merge
	* @param {*} value The value to set if `key` is a string
	*
	* @returns {TeraFy} This chainable terafy instance
	*/
	set(key, value) {
		if (typeof key == 'string') {
			this.settings[key] = value;
		} else {
			Object.assign(this.settings, key);
		}

		return this.toggleDevMode(this.settings.devMode);
	}


	/**
	* Set or merge settings - but only in dev mode and only if the value is not undefined
	*
	* @see set()
	* @param {String|Object} key Either a single setting key to set or an object to merge
	* @param {*} value The value to set if `key` is a string
	*
	* @returns {TeraFy} This chainable terafy instance
	*/
	setIfDev(key, value) {
		if (!this.settings.devMode || value === undefined) return this;
		return this.set(key, value);
	}


	/**
	* Include a TeraFy client plugin
	*
	* @param {Object} The module function to include. Invoked as `(teraClient:TeraFy, options:Object)`
	* @param {Object} [options] Additional options to mutate behaviour during construction (pass options to init() to intialize later options)
	*
	* @returns {TeraFy} This chainable terafy instance
	*/
	use(mod, options) {
		if (typeof mod != 'function') throw new Error('Expected use() call to be provided with a class initalizer');

		let singleton = new mod(this, options);
		this.mixin(this, singleton);

		this.plugins.push(singleton);
		return this;
	}


	/**
	* Internal function used by use() to merge an external declared singleton against this object
	*
	* @param {Object} target Initalied class instance to extend
	* @param {Object} source Initalized source object to extend from
	*/
	mixin(target, source) {
		Object.getOwnPropertyNames(Object.getPrototypeOf(source))
			.filter(prop => !['constructor', 'prototype', 'name'].includes(prop))
			.filter(prop => prop != 'init') // Don't allow plugin init() to override our version - these all get called during init() anyway
			.forEach((prop) => {
				Object.defineProperty(
					target,
					prop,
					{
						value: source[prop].bind(target),
						enumerable: false,
					},
				);
			});
	}


	/**
	* Set or toggle devMode
	*
	* @param {String|Boolean} [devModeEnabled='toggle'] Optional boolean to force dev mode
	*
	* @returns {TeraFy} This chainable terafy instance
	*/
	toggleDevMode(devModeEnabled = 'toggle') {
		this.settings.devMode = devModeEnabled === 'toggle'
			? !this.settings.devMode
			: devModeEnabled;

		if (this.dom.el) // Have we actually set up yet?
			this.dom.el.classList.toggle('dev-mode', this.settings.devMode);

		return this;
	}


	/**
	* Fit the nested TERA server to a full-screen
	* This is usually because the server component wants to perform some user activity like calling $prompt
	*
	* @param {String|Boolean} [isFocused='toggle'] Whether to fullscreen the embedded component
	*/
	toggleFocus(isFocused = 'toggle') {
		this.debug('Request focus', {isFocused});
		globalThis.document.body.classList.toggle('tera-fy-focus', isFocused === 'toggle' ? undefined : isFocused);
	}
	// }}}

	// Stub documentation carried over from ./terafy.server.js {{{
	/**
	* Return basic server information as a form of validation
	*
	* @function handshake
	* @returns {Promise<Object>} Basic promise result
	* @property {Date} date Server date
	*/


	/**
	* User / active session within TERA
	*
	* @name User
	* @property {String} id Unique identifier of the user
	* @property {String} email The email address of the current user
	* @property {String} name The provided full name of the user
	* @property {Boolean} isSubscribed Whether the active user has a TERA subscription
	*/


	/**
	* Fetch the current session user
	*
	* @function getUser
	* @returns {Promise<User>} The current logged in user or null if none
	*/


	/**
	* Require a user login to TERA
	* If there is no user OR they are not logged in a prompt is shown to go and do so
	* This is an pre-requisite step for requireProject()
	*
	* @function requireUser
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.forceRetry=false] Forcabily try to refresh the user state
	*
	* @returns {Promise<User>} The current logged in user or null if none
	*/


	/**
	* Require a user login to TERA
	* If there is no user OR they are not logged in a prompt is shown to go and do so
	* This is an pre-requisite step for requireProject()
	*
	* @returns {Promise} A promise which will resolve if the there is a user and they are logged in
	*/


	/**
	* Project entry within TERA
	*
	* @name Project
	* @url https://tera-tools.com/help/api/schema
	*/


	/**
	* Get the currently active project, if any
	*
	* @function getProject
	* @returns {Promise<Project|null>} The currently active project, if any
	*/


	/**
	* Get a list of projects the current session user has access to
	*
	* @function getProjects
	* @returns {Promise<Array<Project>>} Collection of projects the user has access to
	*/


	/**
	* Set the currently active project within TERA
	*
	* @function setActiveProject
	* @param {Object|String} project The project to set as active - either the full Project object or its ID
	*/


	/**
	* Ask the user to select a project from those available - if one isn't already active
	* Note that this function will percist in asking the uesr even if they try to cancel
	*
	* @function requireProject
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoSetActiveProject=true] After selecting a project set that project as active in TERA
	* @param {String} [options.title="Select a project to work with"] The title of the dialog to display
	* @param {String} [options.noSelectTitle='Select project'] Dialog title when warning the user they need to select something
	* @param {String} [options.noSelectBody='A project needs to be selected to continue'] Dialog body when warning the user they need to select something
	*
	* @returns {Promise<Project>} The active project
	*/


	/**
	* Prompt the user to select a project from those available
	*
	* @function selectProject
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.title="Select a project to work with"] The title of the dialog to display
	* @param {Boolean} [options.allowCancel=true] Advertise cancelling the operation, the dialog can still be cancelled by closing it
	* @param {Boolean} [options.setActive=false] Also set the project as active when selected
	*
	* @returns {Promise<Project>} The active project
	*/


	/**
	* Return the current, full snapshot state of the active project
	*
	* @function getProjectState
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Array<String>} Paths to subscribe to e.g. ['/users/'],
	*
	* @returns {Promise<Object>} The current project state snapshot
	*/


	/**
	* Set a nested value within the project state
	* Paths can be any valid Lodash.set() value such as:
	*
	*     - Dotted notation - e.g. `foo.bar.1.baz`
	*     - Array path segments e.g. `['foo', 'bar', 1, 'baz']`
	*
	* @function setProjectState
	* @param {String|Array<String>} path The sub-path within the project state to set
	* @param {*} value The value to set
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.save=true] Save the changes to the server immediately, disable to queue up multiple writes
	*
	* @returns {Promise} A promise which resolves when the operation has been dispatched to the server
	*/


	/**
	* Set a nested value within the project state - just like `setProjectState()` - but only if no value for that path exists
	*
	* @function setProjectStateDefaults
	* @see setProjectState()
	* @param {String|Array<String>} path The sub-path within the project state to set
	* @param {*} value The value to set
	* @param {Object} [options] Additional options to mutate behaviour, see setProjectState() for the full list of supported options
	*
	* @returns {Promise<Boolean>} A promise which resolves to whether any changes were made - True if defaults were applied, false otherwise
	*/


	/**
	* Force-Save the currently active project state
	*
	* @function saveProjectState
	* @returns {Promise} A promise which resolves when the operation has completed
	*/


	/**
	* Overwrite the entire project state with a new object
	* You almost never want to use this function directly, see `setProjectState(path, value)` for a nicer wrapper
	*
	* @function replaceProjectState
	* @see setProjectState()
	* @param {Object} newState The new state to replace the current state with
	* @returns {Promise} A promise which resolves when the operation has completed
	*/


	/**
	* Apply a computed `just-diff` patch to the current project state
	*
	* @function applyProjectStatePatch
	* @param {Object} Patch to apply
	* @returns {Promise} A promise which resolves when the operation has completed
	*/


	/**
	* Subscribe to project state changes
	* This will dispatch an RPC call to the source object `applyProjectStatePatchLocal()` function with the patch
	* If the above call fails the subscriber is assumed as dead and unsubscribed from the polling list
	*
	* @function subscribeProjectState
	* @returns {Promise<Function>} A promise which resolves when a subscription has been created, call the resulting function to unsubscribe
	*/


	/**
	* Data structure for a file filter
	* @name FileFilters
	*
	* @property {Boolean} [library=false] Restrict to library files only
	* @property {String} [filename] CSV of @momsfriendlydevco/match expressions to filter the filename by (filenames are the basename sans extension)
	* @property {String} [basename] CSV of @momsfriendlydevco/match expressions to filter the basename by
	* @property {String} [ext] CSV of @momsfriendlydevco/match expressions to filter the file extension by
	*/


	/**
	* Prompt the user to select a library to operate on
	*
	* @function selectProjectFile
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.title="Select a file"] The title of the dialog to display
	* @param {String|Array<String>} [options.hint] Hints to identify the file to select in array order of preference
	* @param {Boolean} [options.save=false] Set to truthy if saving a new file, UI will adjust to allowing overwrite OR new file name input
	* @param {FileFilters} [options.filters] Optional file filters
	* @param {Boolean} [options.allowUpload=true] Allow uploading new files
	* @param {Boolean} [options.allowRefresh=true] Allow the user to manually refresh the file list
	* @param {Boolean} [options.allowDownloadZip=true] Allow the user to download a Zip of all files
	* @param {Boolean} [options.allowCancel=true] Allow cancelling the operation. Will throw `'CANCEL'` as the promise rejection if acationed
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {FileFilters} [options.filter] Optional file filters
	*
	* @returns {Promise<ProjectFile>} The eventually selected file
	*/
	selectProjectFile(options) {
		return this.rpc('selectProjectFile', options)
			.then(file => file
				? new ProjectFile({
					tera: this,
					...file,
				})
				: file
			)
	}


	/**
	* Fetch the files associated with a given project
	*
	* @param {Object} options Options which mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Boolean} [options.meta=true] Pull meta information for each file entity
	*
	* @returns {Promise<Array<ProjectFile>>} A collection of project files for the given project
	*/
	getProjectFiles(options) {
		return this.rpc('getProjectFiles', options)
			.then(files => files.map(file =>
				new ProjectFile({
					tera: this,
					...file,
				})
			))
	}


	/**
	* Fetch a project file
	*
	* @param {String} path File path to read
	* @returns {Promise<Blob>} The eventual fetched file as a blob
	*/
	getProjectFile(path) {
		return this.rpc('getProjectFile', path)
			.then(file => file
				? new ProjectFile({
					tera: this,
					...file,
				})
				: file
			)
	}


	/**
	* Replace a project files contents
	*
	* @function setProjectFile
	* @param {String} path File path to write
	* @param {File|Blob|FormData|Object|Array} contents The new file contents
	* @returns {Promise} A promise which will resolve when the write operation has completed
	*/


	/**
	* Prompt the user to select a library to operate on and return a array of references in a given format
	*
	* @function selectProjectLibrary
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.title="Select a citation library"] The title of the dialog to display
	* @param {String|Array<String>} [options.hint] Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage - e.g. 'deduped', 'review1', 'review2', 'dedisputed'
	* @param {Boolean} [options.allowUpload=true] Allow uploading new files
	* @param {Boolean} [options.allowRefresh=true] Allow the user to manually refresh the file list
	* @param {Boolean} [options.allowDownloadZip=true] Allow the user to download a Zip of all files
	* @param {Boolean} [options.allowCancel=true] Allow cancelling the operation. Will throw `'CANCEL'` as the promise rejection if acationed
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {FileFilters} [options.filters] Optional file filters, defaults to citation library selection only
	* @param {*} [options.*] Additional options - see `parseProjectLibrary()`
	*
	* @returns {Promise<Array<Ref>>} A collection of references from the selected file
	*/


	/**
	* Convert a project file into a library of citations
	*
	* @function parseProjectLibrary
	* @param {String} path File path to read, if omitted the contents of `options` are used to guess at a suitable file
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.format='json'] Format for the file. ENUM: 'pojo' (return a parsed JS collection), 'blob' (raw JS Blob object), 'file' (named JS File object)
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Function} [options.filter] Optional async file filter, called each time as `(File:ProjectFile)`
	* @param {Function} [options.find] Optional async final stage file filter to reduce all candidates down to one subject file
	*
	* @returns {Promise<Array<Ref>>|Promise<*>} A collection of references (default bevahiour) or a whatever format was requested
	*/


	/**
	* Save back a citation library from some input
	*
	* @function setProjectLibrary
	* @param {String} [path] File path to save back to
	* @param {Array<RefLibRef>} Collection of references for the selected library
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.format='json'] Input format used. ENUM: 'pojo' (return a parsed JS collection), 'blob' (raw JS Blob object), 'file' (named JS File object)
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {String} [options.hint] Hint to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'
	* @param {Boolean} [options.overwrite=true] Allow existing file upsert
	* @param {Object} [options.meta] Optional meta data to merge into the file data
	*
	* @returns {Promise} A promise which resolves when the save operation has completed
	*/


	/**
	* Save back a projects citation library
	*
	* @function setProjectLibrary
	* @param {Array<RefLibRef>} Collection of references for the selected library
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {String} [options.hint] Hint to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'
	*
	* @returns {Promise} A promise which resolves when the save operation has completed
	*/


	/**
	* Display simple text within TERA
	*
	* @function uiAlert
	* @param {String} text The text to display
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.title='TERA'] The title of the alert box
	* @param {Boolean} [options.isHtml=false] If falsy the text is rendered as plain-text otherwise it will be assumed as HTML content
	*
	* @returns {Promise} A promise which resolves when the alert has been dismissed
	*/


	/**
	* Display HTML content full-screen within TERA
	* This function is ideally called within a requestFocus() wrapper
	*
	* @function uiSplat
	* @param {DOMElement|String|false} content Either a prepared DOM element or string to compile, set to falsy to remove existing content
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean|String} [options.logo=false] Add a logo to the output, if boolean true the Tera-tools logo is used otherwise specify a path or URL
	*/


	/**
	* Open a popup window containing a new site
	*
	* @function uiWindow
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

	// }}}
}
