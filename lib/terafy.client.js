import {cloneDeep} from 'lodash-es';
import {nanoid} from 'nanoid';
import {reactive, watch} from 'vue';
import diff from 'just-diff';

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
	* @property {String} siteUrl The TERA URL to connect to
	* @property {String} restrictOrigin URL to restrict communications to
	*/
	settings = {
		devMode: true,
		siteUrl: 'http://localhost:5173/embed',
		restrictOrigin: '*', // DEBUG: Need to restrict this to TERA site
	};


	/**
	* DOMElements for this TeraFy instance
	*
	* @type {Object}
	* @property {DOMElement} el The main tera-fy div wrapper
	* @property {DOMElement} iframe The internal iFrame element
	* @property {DOMElement} stylesheet The corresponding stylesheet
	*/
	dom = {
		el: null,
		iframe: null,
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

		// Projects
		'bindProject', 'getProject', 'getProjects', 'setActiveProject', 'requireProject', 'selectProject',

		// Project state
		'getProjectStateSnapshot', 'applyProjectStatePatch',
		// bindProjectState() - See below

		// Project Libraries
		'getProjectLibrary', 'setProjectLibrary',
	];


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
		this.dom.iframe.contentWindow.postMessage(
			{
				TERA: 1,
				id: message.id || nanoid(),
				...cloneDeep(message), // Need to clone to resolve promise nasties
			},
			this.settings.restrictOrigin
		);
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

	// Init - constructor(), toggleDevMode(), init(), injectMain(), injectStylesheet(), injectMethods() {{{

	/**
	* Setup the TERA-fy client singleton
	*
	* @param {Object} [options] Additional options to merge into `settings`
	*/
	constructor(options) {
		Object.assign(this.settings, options);
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

		this.dom.el.classList.toggle('dev-mode', this.settings.devMode);
		return this;
	}


	/**
	* Initalize the TERA client singleton
	*/
	init() {
		window.addEventListener('message', this.acceptMessage.bind(this));

		this.injectMain();
		this.injectStylesheet();
		this.injectMethods();
	}


	/**
	* Find an existing active TERA server OR initalize one
	*/
	injectMain() {
		this.dom.el = document.createElement('div')
		this.dom.el.id = 'tera-fy';
		this.dom.el.classList.toggle('dev-mode', this.settings.devMode);
		document.body.append(this.dom.el);

		this.dom.iframe = document.createElement('iframe')

		// Queue up event chain when document loads
		this.dom.iframe.setAttribute('sandbox', 'allow-downloads allow-scripts allow-same-origin');
		this.dom.iframe.addEventListener('load', ()=> {
			this.debug('TERA EMBED FRAME READY');
		});

		// Start document load sequence + append to DOM
		this.dom.iframe.src = this.settings.siteUrl;
		this.dom.el.append(this.dom.iframe);
	}


	/**
	* Inject a local stylesheet to handle TERA server functionality
	*/
	injectStylesheet() {
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

	// Utility - debug(), bindProjectState(), toggleFullscreen() {{{

	/**
	* Debugging output function
	* This function will only act if `settings.devMode` is truthy
	*
	* @param {String} [msg...] Output to show
	*/
	debug(...msg) {
		if (!this.settings.devMode) return;
		console.log(
			'%c[TERA-FY CLIENT]',
			'font-weight: bold; color: #ff5722;',
			...msg,
		);
	}


	/**
	* Return a Vue reactive object that can be read/written which whose changes will transparently be written back to the TERA server instance
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Boolean} [options.write=true] Allow local reactivity to writes - send these to the server
	* @param {Array<String>} Paths to subscribe to e.g. ['/users/'],
	*
	* @returns {Promies<Reactive<Object>>} A reactive object representing the project state
	*/
	bindProjectState(options) {
		let settings = {
			autoRequire: true,
			write: true,
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
			.then(()=> this.getProjectStateSnapshot({
				autoRequire: false, // already handled this
				paths: settings.paths,
			}))
			.then(snapshot => {
				// Create initial reactive
				let stateReactive = reactive(snapshot);

				// Watch for remote changes and update
				// FIXME: Not yet supported

				// Watch for local writes and react
				if (settings.write) {
					watch(
						stateReactive,
						(newVal, oldVal) => {
							let diff = diff(newVal, oldVal);
							this.debug('APPLY DIFF', diff);
							this.applyProjectStatePatch(diff);
						},
						{
							deep: true,
						},
					);
				}

				// Return Vue Reactive
				return stateReactive;
			})
	}


	/**
	* Fit the nested TERA server to a full-screen
	* This is usually because the server component wants to perform some user activity like calling $prompt
	* @param {String|Boolean} [isFocused='toggle'] Whether to fullscreen the embedded component
	*/
	toggleFocus(isFocused = 'toggle') {
		this.debug('Request focus', {isFocused});
		globalThis.document.body.classList.toggle('tera-fy-focus', isFocused === 'toggle' ? undefined : isFocused);
	}

	// }}}
}
