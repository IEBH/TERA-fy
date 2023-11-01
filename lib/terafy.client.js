import {cloneDeep} from 'lodash-es';
import {nanoid} from 'nanoid';

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
		siteUrl: 'https://tera-tools.com/embed',
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
		'getProjectState', 'applyProjectStatePatch',
		// bindProjectState() - See below

		// Project Libraries
		'getProjectLibrary', 'setProjectLibrary',
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
			this.dom.iframe.contentWindow.postMessage(payload, this.settings.restrictOrigin);
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
	*
	* @returns {Promise<TeraFy>} An eventual promise which will resovle with this terafy instance
	*/
	init() {
		window.addEventListener('message', this.acceptMessage.bind(this));

		return Promise.all([
			// Init core functions async
			this.injectComms(),
			this.injectStylesheet(),
			this.injectMethods(),

			// Init all plugins
			...this.plugins
				.map(plugin => plugin.init()),
		])
			.then(()=> this)
	}


	/**
	* Find an existing active TERA server OR initalize one
	*
	* @returns {Promise} A promise which will resolve when the loading has completed and we have found a parent TERA instance or initiallized a child
	*/
	injectComms() { return new Promise(resolve => {
		this.dom.el = document.createElement('div')
		this.dom.el.id = 'tera-fy';
		this.dom.el.classList.toggle('dev-mode', this.settings.devMode);
		document.body.append(this.dom.el);

		this.dom.iframe = document.createElement('iframe')

		// Queue up event chain when document loads
		this.dom.iframe.setAttribute('sandbox', 'allow-downloads allow-scripts allow-same-origin');
		this.dom.iframe.addEventListener('load', ()=> {
			this.debug('TERA EMBED FRAME READY');
			resolve();
		});

		// Start document load sequence + append to DOM
		this.dom.iframe.src = this.settings.siteUrl;
		this.dom.el.append(this.dom.iframe);
	})}


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
		this.debug('Remote methods installed:', this.methods);
	}
	// }}}

	// Utility - debug(), use(), mixin(), toggleDevMode(), toggleFocus() {{{

	/**
	* Debugging output function
	* This function will only act if `settings.devMode` is truthy
	*
	* @param {'INFO'|'LOG'|'WARN'|'ERROR'} [status] Optional prefixing level to mark the message as. 'WARN' and 'ERROR' will always show reguardless of devMode being enabled
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
	* Include a TeraFy client plugin
	*
	* @param {Object} The module function to include. Invoked as `(teraClient:TeraFy, options:Object)`
	* @param {Object} [options] Additional options to mutate behaviour
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
			.forEach((prop) => {
				console.log('Merge method', prop);
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
}
