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
	* @property {String} session Unique session signature for this instance of TeraFy, used to sign server messages, if falsy `getEntropicString(16)` is used to populate
	* @property {Boolean} devMode Operate in Dev-Mode - i.e. force outer refresh when encountering an existing TeraFy instance + be more tolerent of weird iframe origins
	* @property {Number} verbosity Verbosity level, the higher the more chatty TeraFY will be. Set to zero to disable all `debug()` call output
	* @property {'detect'|'parent'|'child'|'popup'} mode How to communicate with TERA. 'parent' assumes that the parent of the current document is TERA, 'child' spawns an iFrame and uses TERA there, 'detect' tries parent and switches to `modeFallback` if communication fails
	* @property {String} modeFallback Method to use when all method detection fails
	* @property {Object<Object<Function>>} modeOverrides Functions to run when switching to specific modes, these are typically used to augment config. Called as `(config:Object)`
	* @property {Number} modeTimeout How long entities have in 'detect' mode to identify themselves
	* @property {String} siteUrl The TERA URL to connect to
	* @property {String} restrictOrigin URL to restrict communications to
	* @property {Array<String>} List of sandbox allowables for the embedded if in embed mode
	* @property {Number} handshakeInterval Interval in milliseconds when sanning for a handshake
	* @property {Number} handshakeTimeout Interval in milliseconds for when to give up trying to handshake
	* @property {Array<String|Array<String>>} [debugPaths] List of paths (in either dotted or array notation) to enter debugging mode if a change is detected in dev mode e.g. `{debugPaths: ['foo.bar.baz']}`. This really slows down state writes so should only be used for debugging
	*/
	settings = {
		session: null as string | null,
		// client: 'tera-fy', // Reserved by terafy.bootstrapper.js
		// clientType: 'esm', // Reserved by terafy.bootstrapper.js
		devMode: false,
		verbosity: 1,
		mode: 'detect' as 'detect' | 'parent' | 'child' | 'popup',
		modeTimeout: 300,
		modeFallback: 'child', // ENUM: 'child' (use iframes), 'popup' (use popup windows)
		modeOverrides: {
			child(config: any) { // When we're in child mode assume a local dev environment and use the dev.tera-tools.com site instead to work around CORS restrictions
				if (config.siteUrl == 'https://tera-tools.com/embed') { // Only if we're using the default URL...
					config.siteUrl = 'https://dev.tera-tools.com/embed'; // Repoint URL to dev site
				}
			},
		} as { [key: string]: (config: any) => void },
		siteUrl: 'https://tera-tools.com/embed',
		restrictOrigin: '*',
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
		handshakeInterval: 1_000, // ~1s
		handshakeTimeout: 10_000, // ~10s
		debugPaths: null as Array<string | Array<string>> | null, // Transformed into a Array<String> (in Lodash dotted notation) on init()
	};


	/**
	* Event emitter subscription endpoint
	* @type {Mitt}
	*/
	// @ts-ignore
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
		el: null as HTMLDivElement | null,
		iframe: null as HTMLIFrameElement | null,
		popup: null as Window | null,
		stylesheet: null as HTMLStyleElement | null,
	};


	/**
	* List of function stubs mapped from the server to here
	* This array is forms the reference of `TeraFy.METHOD()` objects to provide locally which will be mapped via `TeraFy.rpc(METHOD, ...args)`
	*
	* @type {Array<String>}
	*/
	methods = [
		// Messages
		'handshake',
		'setServerVerbosity',

		// Session
		'getUser',
		'requireUser',
		'getCredentials',

		// Projects
		'bindProject',
		'getProject',
		'getProjects',
		'setActiveProject',
		'requireProject',
		'selectProject',

		// Project namespaces
		// 'mountNamespace', // Handled by this library
		// 'unmountNamespace', // Handled by this library
		'getNamespace',
		'setNamespace',
		'listNamespaces',

		// Project State
		'getProjectState',
		'setProjectState',
		'setProjectStateDefaults',
		'setProjectStateRefresh',

		// Project files
		// 'selectProjectFile', - Handled below (requires return collection mapped to ProjectFile)
		// 'getProjectFiles', - Handled below (requires return collection mapped to ProjectFile)
		// 'getProjectFile', - Handled below (requires return mapped to ProjectFile)
		'getProjectFileContents',
		// 'createProjectFile', - Handled below (requires return mapped to ProjectFile)
		// 'moveProjectFile', - Handled below (requires return mapped to ProjectFile)
		'deleteProjectFile',
		'setProjectFileContents',

		// Project folders
		'createProjectFolder',
		'deleteProjectFolder',

		// Project Libraries
		'selectProjectLibrary',
		'getProjectLibrary',
		'setProjectLibrary',

		// Project Logging
		'projectLog',

		// Webpages
		'setPage',

		// UI
		'uiAlert',
		'uiConfirm',
		'uiPanic',
		'uiProgress',
		'uiPrompt',
		'uiThrow',
		'uiSplat',
		'uiWindow',
	] as const;


	/**
	* Loaded plugins via Use()
	* @type {Array<TeraFyPlugin>}
	*/
	plugins: any[] = [];


	/**
	* Active namespaces we are subscribed to
	* Each key is the namespace name with the value as the local reactive \ observer \ object equivelent
	* The key string is always of the form `${ENTITY}::${ID}` e.g. `projects:1234`
	*
	* @type {Object<Object>}
	*/
	namespaces: { [key: string]: any } = {};


	// Messages - send(), sendRaw(), rpc(), acceptMessage() {{{

	/**
	* Send a message + wait for a response object
	*
	* @param {Object} message Message object to send
	* @returns {Promise<*>} A promise which resolves when the operation has completed with the remote reply
	*/
	send(message: any) {
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
	sendRaw(message: any) {
		let payload: any;
		try {
			payload = {
				TERA: 1,
				id: message.id || nanoid(),
				...cloneDeep(message), // Need to clone to resolve promise nasties
			};

			if (this.settings.mode == 'parent') {
				window.parent.postMessage(payload, this.settings.restrictOrigin);
			} else if (this.settings.mode == 'child') {
				this.dom.iframe!.contentWindow!.postMessage(payload, this.settings.restrictOrigin);
			} else if (this.settings.mode == 'popup') {
				this.dom.popup!.postMessage(payload, this.settings.restrictOrigin);
			} else if (this.settings.mode == 'detect') {
				throw new Error('Call init() or detectMode() before trying to send data to determine the mode');
			} else {
				throw new Error(`Unknown TERA communication mode "${this.settings.mode}"`);
			}
		} catch (e) {
			this.debug('ERROR', 1, 'Message compose client->server:', e);
			this.debug('ERROR', 1, 'Attempted to dispatch payload client->server', payload);
			throw e;
		}
	}


	/**
	* Call an RPC function in the server instance
	*
	* @param {String} method The method name to call
	* @param {...*} [args] Optional arguments to pass to the function
	*
	* @returns {Promise<*>} The resolved output of the server function
	*/
	rpc(method: any, ...args: any[]) {
		return this.send({
			action: 'rpc',
			method,
			args,
		});
	}


	/**
	* Accept an incoming message
	*
	* @param {MessageEvent} rawMessage Raw message event to process
	*
	* @returns {Promise} A promise which will resolve when the message has been processed
	*/
	acceptMessage(rawMessage: any) {
		if (rawMessage.origin == window.location.origin) return Promise.resolve(); // Message came from us

		let message = rawMessage.data;
		if (!message.TERA || !message.id) return Promise.resolve(); // Ignore non-TERA signed messages
		this.debug('INFO', 3, 'Recieved message', message);

		if (message?.action == 'response' && this.acceptPostboxes[message.id]) { // Postbox waiting for reply
			if (message.isError === true) {
				this.acceptPostboxes[message.id].reject(message.response);
			} else {
				this.acceptPostboxes[message.id].resolve(message.response);
			}
			return Promise.resolve();
		} else if (message?.action == 'rpc') {
			return Promise.resolve()
				.then(()=> (this as any)[message.method].apply(this, message.args as any[]))
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
						response: e ? e.toString() : e,
					});
				})
		} else if (message?.action == 'event') {
			return Promise.resolve()
				.then(()=> this.events.emit(message.event, ...(message.payload as [])))
				.catch(e => {
					console.warn(`TERA-FY client threw while handling emitted event "${message.event}"`, {message});
					throw e;
				})
		} else if (message?.id) {
			this.debug('INFO', 3, `Ignoring message ID ${message.id} - was meant for someone else?`);
			return Promise.resolve();
		} else {
			this.debug('INFO', 3, 'Unexpected incoming TERA-FY CLIENT message', {message});
			return Promise.resolve();
		}
	}


	/**
	* Listening postboxes, these correspond to outgoing message IDs that expect a response
	*/
	acceptPostboxes: { [key: string]: any } = {};

	// }}}

	// Project namespace - mountNamespace(), unmountNamespace() {{{
	/**
	* Make a namespace available locally
	* This generally creates whatever framework flavoured reactive/observer/object is supported locally - generally with writes automatically synced with the master state
	*
	* @function mountNamespace
	* @param {String} name The alias of the namespace, this should be alphanumeric + hyphens + underscores
	*
	* @returns {Promise<Reactive>} A promise which resolves to the reactive object
	*/
	mountNamespace(name: any) {
		if (!/^[\w-]+$/.test(name)) throw new Error('Namespaces must be alphanumeric + hyphens + underscores');
		if (this.namespaces[name]) return Promise.resolve(this.namespaces[name]); // Already mounted

		return Promise.resolve()
			.then(()=> this._mountNamespace(name))
			.then(()=> this.namespaces[name] || Promise.reject(`teraFy.mountNamespace('${name}') resolved but no namespace has been mounted`))
	}


	/**
	* @interface
	* Actual namespace mounting function designed to be overriden by plugins
	*
	* @param {String} name The alias of the namespace, this should be alphanumeric + hyphens + underscores
	*
	* @returns {Promise} A promise which resolves when the mount operation has completed
	*/
	_mountNamespace(name: any) { // eslint-disable-line no-unused-vars
		console.warn('teraFy._mountNamespace() has not been overriden by a TERA-fy plugin, load one to add this functionality for your preferred framework');
		throw new Error('teraFy._mountNamespace() is not supported');
	}


	/**
	* Release a locally mounted namespace
	* This function will remove the namespace from `namespaces`, cleaning up any memory / subscription hooks
	*
	* @function unmountNamespace
	*
	* @param {String} name The name of the namespace to unmount
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	unmountNamespace(name: any) {
		if (!this.namespaces[name]) return Promise.resolve(); // Already unmounted
		return this._unmountNamespace(name);
	}


	/**
	* @interface
	* Actual namespace unmounting function designed to be overriden by plugins
	*
	* @param {String} name The name of the namespace to unmount
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	_unmountNamespace(name: any) { // eslint-disable-line no-unused-vars
		console.warn('teraFy.unbindNamespace() has not been overriden by a TERA-fy plugin, load one to add this functionality for your preferred framework');
	}
	// }}}

	// Init - constructor(), init(), inject*() {{{

	/**
	* Setup the TERA-fy client singleton
	*
	* @param {Object} [options] Additional options to merge into `settings` via `set`
	*/
	constructor(options?: any) {
		if (options) this.set(options);
	}

	private initPromise: Promise<TeraFy> | null = null;

	/**
	* Initalize the TERA client singleton
	* This function can only be called once and will return the existing init() worker Promise if its called againt
	*
	* @param {Object} [options] Additional options to merge into `settings` via `set`
	* @returns {Promise<TeraFy>} An eventual promise which will resovle with this terafy instance
	*/
	init(options?: any): Promise<TeraFy> {
		if (options) this.set(options);
		if (this.initPromise) return this.initPromise; // Aleady been called - return init promise

		window.addEventListener('message', this.acceptMessage.bind(this));

		const context = this;
		this.initPromise = Promise.resolve()
			.then(()=> this.settings.session ||= 'tfy-' + this.getEntropicString(16))
			.then(()=> this.debug('INFO', 4, '[0/6] Init', 'Session', this.settings.session, 'against', this.settings.siteUrl))
			.then(()=> { // Init various options for optimized access
				if (!this.settings.devMode) return; // Not in dev mode
				if (this.settings.debugPaths) {
					this.settings.debugPaths = (this.settings.debugPaths as any[]).map((path: any) =>
						Array.isArray(path) ? path.join('.') // Transform arrays into dotted notation
						: typeof path == 'string' ? path // Assume already in dotted notation
						: (()=> { throw new Error('Unknown path type - should be an array or string in dotted notation') })()
					)
				} else {
					this.settings.debugPaths = null;
				}

				this.debug('INFO', 0, 'Watching state paths', this.settings.debugPaths);
			})
			.then(()=> this.detectMode())
			.then(mode => {
				this.debug('INFO', 4, '[1/6] Setting client mode to', mode);
				this.settings.mode = mode;

				if (this.settings.modeOverrides[mode]) {
					this.debug('INFO', 4, '[1/6] Applying specific config overrides for mode', mode);
					return this.settings.modeOverrides[mode](this.settings);
				}
			})
			.then(()=> this.debug('INFO', 4, '[2/6] Injecting comms + styles + methods'))
			.then(()=> Promise.all([
				// Init core functions async
				this.injectComms(),
				this.injectStylesheet(),
				this.injectMethods(),
			]))
			.then(()=> {
				if (this.settings.verbosity <=1) {
					this.debug('INFO', 4, '[3/6] Skip - Server verbosity is already at 1');
					return;
				} else {
					this.debug('INFO', 4, `[3/6] Set server verbosity to ${this.settings.verbosity}`);
					return this.rpc('setServerVerbosity', this.settings.verbosity);
				}
			})
			.then(()=> this.debug('INFO', 4, `[4/6] Set server mode to "${this.settings.mode}"`))
			.then(()=> this.rpc('setServerMode', // Tell server what mode its in
				this.settings.mode == 'child' ? 'embedded'
				: this.settings.mode == 'parent' ? 'frame'
				: this.settings.mode == 'popup' ? 'popup'
				: (()=> { throw(`Unknown server mode "${this.settings.mode}"`) })()
			))
			.then(()=> this.debug('INFO', 4, '[5/6] Run client plugins'))
			.then(()=> Promise.all( // Init all plugins (with this outer module as the context)
				this.plugins.map(plugin =>
					plugin.init.call(context, this.settings)
				)
			))
			.then(()=> {
				this.debug('INFO', 4, '[6/6] Init complete');
				return context; // Resolve with the instance
			})
			.catch(e => {
				this.debug('WARN', 0, 'Init process fault', e);
				throw e; // Re-throw
			});

		return this.initPromise;
	}



	/**
	* Populate `settings.mode`
	* Try to communicate with a parent frame, if none assume we need to fallback to child mode
	*
	* @returns {Promise<String>} A promise which will resolve with the detected mode to use
	*/
	detectMode(): Promise<'parent' | 'child' | 'popup'> {
		if (this.settings.mode != 'detect') { // Dev has specified a forced mode to use
			return Promise.resolve(this.settings.mode);
		} else if (window.self === window.parent) { // This frame is already at the top
			return Promise.resolve(this.settings.modeFallback as 'child' | 'popup');
		} else { // No idea - try messaging
			return Promise.resolve()
				.then(()=> this.settings.mode = 'parent') // Switch to parent mode...
				.then(()=> new Promise<void>((resolve, reject) => { // And try messaging with a timeout
					let timeoutHandle = setTimeout(()=> reject('TIMEOUT'), this.settings.modeTimeout);

					this.rpc('handshake')
						.then(()=> clearTimeout(timeoutHandle))
						.then(()=> resolve(undefined))
						.catch(reject); // Propagate RPC errors
				}))
				.then(()=> 'parent' as 'parent')
				.catch(()=> this.settings.modeFallback as 'child' | 'popup')
		}
	}


	/**
	* Find an existing active TERA server OR initalize one
	*
	* @returns {Promise} A promise which will resolve when the loading has completed and we have found a parent TERA instance or initiallized a child
	*/
	injectComms() {
		switch (this.settings.mode) {
			case 'child': return Promise.resolve()
				.then(()=> new Promise<void>(resolve => {
					this.debug('INFO', 2, 'Injecting TERA site as iFrame child');

					this.dom.el = document.createElement('div')
					this.dom.el.id = 'tera-fy';
					this.dom.el!.classList.toggle('dev-mode', this.settings.devMode);
					this.dom.el!.classList.add('minimized');
					document.body.append(this.dom.el!);

					this.dom.el!.addEventListener('click', ()=> this.dom.el!.classList.toggle('minimized'));

					this.dom.iframe = document.createElement('iframe')

					// Queue up event chain when document loads
					this.dom.iframe!.setAttribute('sandbox', this.settings.frameSandbox.join(' '));
					this.dom.iframe!.addEventListener('load', ()=> {
						this.debug('INFO', 3, 'Embeded iframe ready');
						resolve(undefined);
					});

					// Start document load sequence + append to DOM
					this.dom.iframe!.src = this.settings.siteUrl;
					this.dom.el!.append(this.dom.iframe!);
				}))
				.then(()=> this.handshakeLoop())

			case 'parent':
				this.debug('INFO', 2, 'Using TERA window parent');
				return Promise.resolve();

			case 'popup':
				this.debug('INFO', 2, 'Injecting TERA site as a popup window');
				this.dom.popup = window.open(this.settings.siteUrl, '_blank', 'popup=1, location=0, menubar=0, status=0, scrollbars=0, width=500, height=600');

				return this.handshakeLoop()
					.then(()=> this.debug('INFO', 3, 'Popup window accepted handshake'))

			default:
				throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`);
		}
	}


	/**
	* Keep trying to handshake until the target responds
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @property {Number} [handshakeInterval] Interval in milliseconds when sanning for a handshake, defaults to global setting
	* @property {Number} [handshakeTimeout] Interval in milliseconds for when to give up trying to handshake, defaults to global setting
	*
	* @returns {Promise} A promise which will either resolve when the handshake is successful OR fail with 'TIMEOUT'
	*/
	handshakeLoop(options?: any) {
		let settings = {
			handshakeInterval: this.settings.handshakeInterval,
			handshakeTimeout: this.settings.handshakeTimeout,
			...options,
		};

		// Loop until the window context returns a handshake
		return new Promise<void>((resolve, reject) => {
			let handshakeCount = 0;
			let handshakeTimer: any;

			let handshakeTimeout = setTimeout(()=> {
				clearTimeout(handshakeTimer);
				reject('TIMEOUT');
			}, settings.handshakeTimeout);

			const tryHandshake = ()=> {
				this.debug('INFO', 4, 'Trying handshake', ++handshakeCount);

				clearTimeout(handshakeTimer);
				handshakeTimer = setTimeout(tryHandshake, settings.handshakeInterval);

				this.rpc('handshake')
					.then(()=> {
						clearTimeout(handshakeTimeout);
						clearTimeout(handshakeTimer);
					})
					.then(()=> resolve(undefined))
					.catch(reject) // Let RPC errors propagate
			};
			tryHandshake(); // Kick off initial handshake
		});
	}


	/**
	* Inject a local stylesheet to handle TERA server functionality
	*
	* @returns {Promise} A promise which will resolve when the loading has completed and we have found a parent TERA instance or initiallized a child
	*/
	injectStylesheet() {
		switch (this.settings.mode) {
			case 'child':
				this.dom.stylesheet = document.createElement('style');
				this.dom.stylesheet!.innerHTML = [
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

						// Minimize / de-minimize functionality {{{
						'body:not(.tera-fy-focus) &.minimized.dev-mode {',
							'background: var(--TERA-accent) !important;',
							'opacity: 0.5;',
							'right: 0px;',
							'bottom: 0px;',
							'width: 30px;',
							'height: 30px;',
							'transition: opacity 0.2s ease-out;',

							'cursor: pointer;',

							'border: none;',
							'border-top-left-radius: 30px;',
							'border-top: 2px solid var(--TERA-accent);',
							'border-left: 2px solid var(--TERA-accent);',

							'display: flex;',
							'justify-content: center;',
							'align-items: center;',

							'&::before {',
								'margin: 2px 0 0 0;',
								'content: "🌀";',
								'color: #FFF;',
							'}',

							'&:hover {',
								'opacity: 1;',
							'}',

							'& > iframe {',
								'display: none;',
							'}',
						'}',

						'body:not(.tera-fy-focus) &:not(.minimized) {',
							'&::before {',
								'display: flex;',
								'align-items: center;',
								'justify-content: center;',

								'cursor: pointer;',

								'background: var(--TERA-accent) !important;',
								'opacity: 0.5;',
								'transition: opacity 0.2s ease-out;',

								'position: absolute;',
								'right: 0px;',
								'bottom: 0px;',
								'width: 20px;',
								'height: 20px;',

								'margin: 2px 0 0 0;',
								'content: "⭨";',
								'color: #FFF;',

								'border: none;',
								'border-top-left-radius: 30px;',
								'border-top: 2px solid var(--TERA-accent);',
								'border-left: 2px solid var(--TERA-accent);',
							'}',


							'&:hover::before {',
								'opacity: 1;',
							'}',
						'}',
						// }}}

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
				document.head.appendChild(this.dom.stylesheet!);
				break;
			case 'parent':
			case 'popup':
				break;
			default:
				throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`);
		}

		return Promise.resolve();
	}


	/**
	* Inject all server methods defined in `methods` as local functions wrapped in the `rpc` function
	*/
	injectMethods() {
		this.methods.forEach(method =>
			(this as any)[method] = this.rpc.bind(this, method)
		);
	}
	// }}}

	// Utility - debug(), set(), setIfDev(), use(), mixin(), toggleDevMode(), toggleFocus(), getEntropicString() {{{

	/* eslint-disable jsdoc/check-param-names */
	/**
	* Debugging output function
	* This function will only act if `settings.devMode` is truthy
	*
	* @param {'INFO'|'LOG'|'WARN'|'ERROR'} [method='LOG'] Logging method to use
	* @param {Number} [verboseLevel=1] The verbosity level to trigger at. If `settings.verbosity` is lower than this, the message is ignored
	* @param {...*} [msg] Output to show
	*/
	debug(...msg: any[]) {
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

		(console as any)[method](
			'%c[TERA-FY CLIENT]',
			'font-weight: bold; color: #ff5722;',
			...msg,
		);
	}
	/* eslint-enable */


	/**
	* Set or merge settings
	* This function also routes 'special' keys like `devMode` to their internal handlers
	*
	* @param {String|Object} key Either a single setting key to set or an object to merge
	* @param {*} value The value to set if `key` is a string
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.ignoreNullish=true] If falsy, this forces the setting of undefined or null values rather than ignoring them when specifying values by string
	*
	* @returns {TeraFy} This chainable terafy instance
	*/
	set(key: string | object, value?: any, options?: { ignoreNullish?: boolean }) {
		let settings = {
			ignoreNullish: true,
			...options,
		};

		if (typeof key == 'string') {
			if (!settings.ignoreNullish || (value !== null && value !== undefined))
				(this.settings as any)[key] = value;
		} else {
			Object.assign(this.settings, key);
		}

		return this.toggleDevMode(this.settings.devMode as boolean);
	}


	/**
	* Set or merge settings - but only in dev mode and only if the value is not undefined
	*
	* @see set()
	* @param {String|Object} key Either a single setting key to set or an object to merge
	* @param {*} value The value to set if `key` is a string
	* @param {Object} [options] Additional options to mutate behaviour
	*
	* @returns {TeraFy} This chainable terafy instance
	*/
	setIfDev(key: any, value: any, options?: any) {
		if (!this.settings.devMode || value === undefined) return this;
		return this.set(key, value, options);
	}


	/**
	* Include a TeraFy client plugin
	*
	* @param {Function|Object|String} source Either the JS module class, singleton object or URL to fetch it from. Eventually constructed as invoked as `(teraClient:TeraFy, options:Object)`
	* @param {Object} [options] Additional options to mutate behaviour during construction (pass options to init() to intialize later options)
	*
	* @returns {TeraFy} This chainable terafy instance
	*/
	use(source: any, options?: any) {
		let mod: any =
			typeof source == 'function' ? new source(this, options)
			: typeof source == 'object' ? source
			: typeof source == 'string' ? (()=> { throw new Error('use(String) is not yet supported') })()
			: (()=> { throw new Error('Expected use() call to be provided with a class initalizer') })();

		this.mixin(this, mod);

		this.plugins.push(mod);
		return this;
	}


	/**
	* Internal function used by use() to merge an external declared singleton against this object
	*
	* @param {Object} target Initalied class instance to extend
	* @param {Object} source Initalized source object to extend from
	*/
	mixin(target: any, source: any) {
		// Iterate through the source object upwards extracting each prototype
		let prototypeStack = [];
		let node = source;
		do {
			prototypeStack.unshift(node);
		} while (node = Object.getPrototypeOf(node)); // Walk upwards until we hit null (no more inherited classes)

		// Iterate through stacks inheriting each prop into the target
		prototypeStack.forEach(stack =>
			Object.getOwnPropertyNames(stack)
				.filter(prop =>
					!['constructor', 'init', 'prototype', 'name'].includes(prop) // Ignore forbidden properties
					&& !prop.startsWith('__') // Ignore double underscore meta properties
				)
				.forEach(prop => {
					if (typeof (source as any)[prop] == 'function') { // Inheriting function - glue onto object as non-editable, non-enumerable property
						Object.defineProperty(
							target,
							prop,
							{
								enumerable: false,
								value: (source as any)[prop].bind(target), // Rebind functions
							},
						);
					} else { // Everything else, just glue onto the object
						target[prop] = (source as any)[prop];
					}
				})
		)
	}


	/**
	* Set or toggle devMode
	* This function also accepts meta values:
	*
	*     'toggle' - Set dev mode to whatever the opposing value of the current mode
	*     'proxy'  - Optimize for using a loopback proxy
	*
	* @param {'toggle'|'proxy'|Boolean} [devModeEnabled='toggle'] Optional boolean to force dev mode or specify other behaviour
	*
	* @returns {TeraFy} This chainable terafy instance
	*/
	toggleDevMode(devModeEnabled: 'toggle' | 'proxy' | boolean = 'toggle') {
		if (devModeEnabled === 'toggle') {
			this.settings.devMode = !this.settings.devMode;
		} else if (devModeEnabled === 'proxy') {
			Object.assign(this.settings, {
				devMode: true,
				siteUrl: 'http://localhost:7334/embed',
				mode: 'child',
			});
		} else {
			this.settings.devMode = !! devModeEnabled;
		}

		if (this.settings.devMode)
			this.settings.restrictOrigin = '*'; // Allow all upstream iframes

		if (this.dom?.el) // Have we actually set up yet?
			this.dom.el!.classList.toggle('dev-mode', this.settings.devMode);

		return this;
	}


	/**
	* Fit the nested TERA server to a full-screen
	* This is usually because the server component wants to perform some user activity like calling $prompt
	*
	* @param {String|Boolean} [isFocused='toggle'] Whether to fullscreen the embedded component
	*/
	toggleFocus(isFocused: boolean | 'toggle' = 'toggle') {
		this.debug('INFO', 2, 'Request focus', {isFocused});
		globalThis.document.body.classList.toggle('tera-fy-focus', isFocused === 'toggle' ? undefined : isFocused);
	}



	/**
	* Generate random entropic character string in Base64
	*
	* @param {Number} [maxLength=32] Maximum lengh of the genrated string
	* @returns {String}
	*/
	getEntropicString(maxLength = 32) {
		const array = new Uint32Array(4);
		window.crypto.getRandomValues(array);
		return btoa(String.fromCharCode(...new Uint8Array(array.buffer)))
			.replace(/[+/]/g, '') // Remove + and / characters
			.slice(0, maxLength) // Trim
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
	* RPC callback to set the server verbostiy level
	*
	* @function setServerVerbosity
	* @param {Number} verbosity The desired server verbosity level
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
	* @param {Boolean} [options.forceRetry=false] Forcabily try to refresh the user state
	* @param {Boolean} [options.waitPromises=true] Wait for $auth + $subscriptions to resolve before fetching the user (mainly internal use)
	* @returns {Promise<User>} The current logged in user or null if none
	*/


	/**
	* Provide an object of credentials for 3rd party services like Firebase/Supabase
	*
	* @function getCredentials
	* @returns {Object} An object containing 3rd party service credentials
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
	* Get a one-off snapshot of a namespace without mounting it
	* This can be used for simpler apps which don't have their own reactive / observer equivelent
	*
	* @function getNamespace
	* @param {String} name The alias of the namespace, this should be alphanumeric + hyphens + underscores
	*
	* @returns {Promise<Object>} A promise which resolves to the namespace POJO state
	*/


	/**
	* Set (or merge by default) a one-off snapshot over an existing namespace
	* This can be used for simpler apps which don't have their own reactive / observer equivelent and just want to quickly set something
	*
	* @function setNamespace
	* @param {String} name The name of the namespace
	* @param {Object} state The state to merge
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {'merge'|'set'} [options.method='merge'] How to handle the state. 'merge' (merge a partial state over the existing namespace state), 'set' (completely overwrite the existing namespace)
	*
	* @returns {Promise<Object>} A promise which resolves to the namespace POJO state
	*/


	/**
	* Return a list of namespaces available to the current project
	*
	* @function listNamespaces
	* @returns {Promise<Array<Object>>} Collection of available namespaces for the current project
	* @property {String} name The name of the namespace
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
	* Force refetching the remote project state into local
	* This is only ever needed when saving large quantities of data that need to be immediately available
	*
	* @function setProjectStateRefresh
	* @returns {Promise} A promise which resolves when the operation has completed
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
	* @returns {Promise<ProjectFile>} The eventually selected file, if in save mode new files are created as stubs
	*/
	selectProjectFile(options?: any) {
		return this.rpc('selectProjectFile', options)
			.then((file: any) => file
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
	* @function getProjectFiles
	* @param {Object} options Options which mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Boolean} [options.lazy=true] If true, use the fastest method to retrieve the file list such as the cache. If false, force a refresh each time
	* @param {Boolean} [options.meta=true] Pull meta information for each file entity
	*
	* @returns {Promise<Array<ProjectFile>>} A collection of project files for the given project
	*/
	getProjectFiles(options?: any) {
		return this.rpc('getProjectFiles', options)
			.then((files: any) => files.map((file: any) =>
				new ProjectFile({
					tera: this,
					...file,
				})
			))
	}


	/**
	* Fetch the raw contents of a file by its ID
	*
	* @function getProjectFileContents
	* @param {String} [id] File ID to retrieve the contents of
	* @param {Object} [options] Additioanl options to mutate behaviour
	* @param {'blob'|'json'} [options.format='blob'] The format to retrieve the file in
	*
	* @returns {*} The file contents in the requested format
	*/


	/**
	* Fetch a project file by its name
	*
	* @function getProjectFile
	* @param {String} id The name + relative directory path component
	*
	* @param {Object|String} [options] Additional options to mutate behaviour, if a string is given `options.subkey` is assumed
	* @param {String} [options.subkey] If specified only the extracted subkey is returned rather than the full object
	* @param {Boolean} [options.cache=true] Use the existing file cache if possible, set to false to force a refresh of files from the server first
	*
	* @returns {Promise<ProjectFile>} The eventual fetched ProjectFile (or requested subkey)
	*/
	getProjectFile(id: any, options?: any) {
		return this.rpc('getProjectFile', id, options)
			.then((file: any) => file
				? new ProjectFile({
					tera: this,
					...file,
				})
				: file
			)
	}


	/**
	* Create a new file
	* This creates an empty file which can then be written to
	*
	* @function createProjectFile
	* @param {String} name The name + relative directory path component
	* @returns {Promise<ProjectFile>} The eventual ProjectFile created
	*/
	createProjectFile(name: any) {
		return this.rpc('createProjectFile', name)
			.then((file: any) => file
				? new ProjectFile({
					tera: this,
					...file,
				})
				: file
			)
	}

	/**
	* Moves a project file to a new name/path.
	* The file's unique ID (UUID) remains the same, but its 'name' (relative path) and associated properties will be updated.
	*
	* @function moveProjectFile
	* @param {String} sourceId The unique ID (UUID) of the file to move.
	* @param {String} newName The new relative name for the file (e.g., "documents/report-final.pdf" or "image.png").
	*                         This path is relative to the project's root file directory.
	*
	* @param {Object} [options] Additional options to mutate behaviour.
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing.
	* @param {Boolean} [options.overwrite=true] If true (default), moving a file to a `newName` that already exists will overwrite the existing file.
	*                                          This aligns with the default behavior of the underlying Supabase storage `move` operation.
	*                                          If set to false, the function would ideally check and prevent overwrite, but current implementation relies on underlying storage behavior.
	*
	* @returns {Promise<ProjectFile | null>} A promise which resolves to the updated ProjectFile object for the moved file if found after the operation,
	*                                        or null if the file could not be located post-move (e.g., if its ID changed unexpectedly or it was deleted).
	*/
	moveProjectFile(sourceId: string, newName: string, options?: any): Promise<ProjectFile | null> {
		return this.rpc('moveProjectFile', sourceId, newName, options)
				.then((fileData: any) => { // fileData is the plain object from the server
						if (fileData) {
								return new ProjectFile({
										tera: this, // Pass the TeraFy client instance
										...fileData,
								});
						}
						return null;
				});
	}

	/**
	* Remove a project file by its ID
	*
	* @function deleteProjectFile
	* @param {String} id The File ID to remove
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/


	/**
	* Save (or overwrite) a file within a project
	*
	* @function setProjectFileContents
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

		/**
	* Creates a new "folder" within the project's file storage.
	* Folders in Supabase storage are typically represented by creating a placeholder file (e.g., .emptyFolderPlaceholder) within the desired path.
	* This operation is idempotent: if the folder (via its placeholder) already exists, it will not error.
	*
	* @function createProjectFolder
	* @param {String} folderPath The relative path of the folder to create (e.g., "myDocuments/reports").
	* @param {Object} [options] Additional options.
	* @param {Boolean} [options.autoRequire=true] Automatically run `requireProject()` to ensure an active project context.
	* @returns {Promise<void>} A promise that resolves when the folder is created or ensured.
	* @throws {Error} If no project is active (and autoRequire is false), or if folderPath is invalid, or if the creation fails.
	*/

		/**
	* Deletes a "folder" and all its contents from the project's file storage.
	* This involves listing all files under the given folder path (prefix) and removing them.
	*
	* @function deleteProjectFolder
	* @param {String} folderPath The relative path of the folder to delete (e.g., "myDocuments/reports").
	* @param {Object} [options] Additional options.
	* @param {Boolean} [options.autoRequire=true] Automatically run `requireProject()` to ensure an active project context.
	* @returns {Promise<null>} A promise that resolves with null when the folder and its contents are deleted.
	* @throws {Error} If no project is active (and autoRequire is false), or if folderPath is invalid, or if deletion fails.
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
	* @param {...*} [options] Additional options - see `getProjectLibrary()`
	*
	* @returns {Promise<Array<Ref>>} A collection of references from the selected file
	*/


	/**
	* Fetch + convert a project file into a library of citations
	*
	* @function getProjectLibrary
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


	/**
	* Save back a citation library from some input
	*
	* @function setProjectLibrary
	* @param {String} [id] File ID to save back to, if omitted a file will be prompted for
	* @param {Array<RefLibRef>|Blob|File} [refs] Collection of references for the selected library or the raw Blob/File
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.id] Alternate method to specify the file ID to save as, if omitted one will be prompted for
	* @param {Array<RefLibRef>|Blob|File} [options.refs] Alternate method to specify the refs to save as an array or raw Blob/File
	* @param {String} [options.format='json'] Input format used. ENUM: 'pojo' (return a parsed JS collection), 'blob' (raw JS Blob object), 'file' (named JS File object)
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {String} [options.hint] Hint to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'
	* @param {String} [options.filename] Suggested filename if `id` is unspecified
	* @param {String} [options.title='Save citation library'] Dialog title if `id` is unspecified and a prompt is necessary
	* @param {Boolean} [options.overwrite=true] Allow existing file upsert
	* @param {Object} [options.meta] Optional meta data to merge into the file data
	*
	* @returns {Promise} A promise which resolves when the save operation has completed
	*/


	/**
	* Create a log entry for the currently active project
	*
	* The required log object can be of various forms. See https://tera-tools.com/api/logs.json for the full list
	*
	* @function projectLog
	* @param {Object} log The log entry to create
	* @returns {Promise} A promise which resolves when the operation has completed
	*/


	/**
	* Set the active page title
	* This is usually called by a tool nested within the tera-tools.com embed
	*
	* @function setPage
	* @param {Object|String} options Context information about the page, if this is a string, its assumed to popupate `url`
	* @param {String} [options.path] The URL path segment to restore on next refresh
	* @param {String} [options.title] The page title associated with the path
	*/


	/**
	* Display simple text within TERA
	*
	* @function uiAlert
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


	/**
	* Present a simple ok/cancel dialog to the user
	*
	* @function uiConfirm
	* @param {String} [text] Text to display, if specified this populates `options.body`
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.body="Confirm?"] The body text to display
	* @param {Boolean} [options.isHtml=false] If falsy the text is rendered as plain-text otherwise it will be assumed as HTML content
	* @param {String} [options.title='TERA'] The title of the confirmation box
	*
	* @returns {Promise} A promise which resolves with `Promise.resolve('OK')` or rejects with `Promise.reject('CANCEL')`
	*/


	/**
	* Trigger a fatal error, killing the outer TERA site
	*
	* @function uiPanic
	* @param {String} [text] Text to display
	*/


	/**
	* Display, update or dispose of windows for long running tasks
	* All options are cumulative - i.e. they are merged with other options previously provided
	*
	* @function uiProgress
	* @param {Object|Boolean} [options] Additional options to mutate behaviour, if boolean false `{close: true}` is assumed
	* @param {String} [options.title='TERA'] Window title, can only be set on the initial call
	* @param {String} [options.backdrop=true] Set to `'static'` to prevent user being able to click outside the modal to close
	* @param {String} [options.body=''] Window body text, can only be set on the initial call
	* @param {Boolean} [options.bodyHtml=false] Treat body text as HTML
	* @param {Boolean} [options.close=false] Close the existing dialog, if true the dialog is disposed and options reset
	* @param {String} [options.text] The text of the task being conducted
	* @param {Number} [options.progress] The current progress of the task being conducted, this is assumed to be a value less than `maxProgress`
	* @param {Number} [options.maxProgress] The maximum value that the progress can be
	*
	* @returns {Promise} A promise which resolves when the dialog has been updated
	*/


	/**
	* Prompt the user for an input, responding with a Promisable value
	*
	* @function uiPrompt
	* @param {String} [text] Text to display, if specified this populates `options.body`
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.body] Optional additional body text
	* @param {Boolean} [options.isHtml=false] If truthy, treat the body as HTML
	* @param {String} [options.value] Current or default value to display pre-filled
	* @param {String} [options.title='Input required'] The dialog title to display
	* @param {String} [options.placeholder] Optional placeholder text
	* @param {Boolean} [options.required=true] Treat nullish or empty inputs as a cancel operation
	*
	* @returns {Promise<*>} Either the eventual user value or a throw with `Promise.reject('CANCEL')`
	*/


	/**
	* Catch an error using the TERA error handler
	*
	* @function uiThrow
	* @param {Error|Object|String} error Error to handle, generally an Error object but can be a POJO or a scalar string
	*
	* @returns {Void} This function is fatal
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

	// }}}
}