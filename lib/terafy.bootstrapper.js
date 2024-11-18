import {merge} from 'lodash-es';

/**
* Tera-Fy Bootstrapper Client
* This class loads the "real" Tera-Fy from remote and mutates into it
*
* @class TeraFy
*/
export default class TeraFy {
	settings = {
		client: 'tera-fy', // Client name within https://tera-tools.com/api/tera-fy/<NAME>.js to load
		clientType: 'esm',
	};


	/**
	* Download the remote TERA-fy client, initalize it and mix it in with this class instance
	*
	* @param {Object} [options] Additional options to merge into `settings` via `set`
	* @returns {Promise<TeraFy>} An eventual promise which will resovle with this terafy instance
	*/
	init(options) {
		// FIXME: Note this needs to point at the live site
		let getUrl = client => `https://dev.tera-tools.com/api/tera-fy/${client}.js`;

		return Promise.resolve()
			.then(()=>
				this.settings.clientType == 'esm' ?
					this.bootstrapperImport(getUrl(this.settings.client))
						.then(exported => typeof exported == 'function' ? exported : Promise.reject("Tera-fy import didn't return a class"))
				: Promise.reject(`Unsupported TERA-fy clientType "${this.settings.clientType}"`)
			)
			.then(TeraClient => {
				let tc = new TeraClient();
				if (!tc.mixin) throw new Error('TERA-fy client doesnt expose a mixin() method');

				tc.mixin(this, tc);

				// Merge settings object
				merge(this.settings, tc.settings, this.settings);
			})
			.then(()=> { // Sanity checks
				console.log('IAM', this);
				if (!this.init || typeof this.init != 'function') throw new Error('Newly mixed-in TERA-fy client doesnt expose a init() method');
				if (!this.detectMode || typeof this.detectMode != 'function') throw new Error('Newly mixed-in TERA-fy client doesnt expose a detectMode() method');
			})
			.then(()=> this.bootstrapperDeferredMethods.reduce((chain, dm) => { // Run all deferred methods as an sequencial promise chain
				if (dm.method == 'use' && typeof dm.args[0] == 'string') { // Wrap `use(pluginClient:String,options:Object)` method to fetch plugin from remote
					console.log('TERA-FY DEFERRED-USE', dm.args[0]);
					return this.bootstrapperImport(getUrl(dm.args[0]))
						.then(exported => typeof exported == 'function' ? exported : Promise.reject("Tera-fy plugin import didn't return a class"))
						.then(mod => this.use(mod, ...dm.args.slice(1)));
				} else {
					console.log('TERA-FY DEFERRED-METHOD', dm);
					return this[dm.method].apply(this, dm.args)
				}
			}), Promise.resolve())
			.then(()=> delete this.bootstrapperDeferredMethods)
			.then(()=> console.log('TYBS', 'Init'))
			.then(()=> this.init.call(this, options))
	}


	/**
	* Methods to call post-init when the main TeraFyClient has loaded
	* These are setup during construction
	*
	* @type {Array<Object>}
	*/
	bootstrapperDeferredMethods = [];


	/**
	* Go fetch a remote URL, inject it as a <script> element and resolve to the exported default
	* This is a fix for the fact that regular import() can't accept URLs
	*
	* @param {String} url The URL to import
	* @returns {*} The default, single export of the module
	*/
	bootstrapperImport(url) {
		return new Promise((resolve, reject) => {
			// Create a unique module ID
			const moduleId = `installTFyBS${Math.random().toString(36).slice(2)}`;

			// Add a wrapper module that will expose the class
			const script = document.createElement('script');
			script.type = 'module';
			script.textContent = `
				import mod from '${url}';
				window['installMod${moduleId}'](mod);
			`;

			// Create cleanup function
			let cleanup = () => {
				return console.warn('CLEANUP', moduleId);
				delete window[moduleId];
				document.head.removeChild(script);
			}

			// Create stub function to accept payload + quit
			window[`installMod${moduleId}`] = payload => {
				console.log('Accept module from', url, '=', payload);
				resolve(payload);
				cleanup();
			};


			// FIXME: Not sure if this is actually detecting errors? addEventListener instead maybe?
			script.onerror = (error) => {
				console.log('post onerror', window[moduleId]);
				reject(new Error(`Failed to load module from ${url}`));
				cleanup();
			};

			// Append stub script element and quit
			document.head.appendChild(script);
		});
	}


	/**
	* TeraFyBootstrapper constructor
	*
	* @param {String} [options] Optional settings to merge
	*/
	constructor(options) {
		// Merge options if provided
		if (options) merge(this.settings, options);

		// Map various methods to a deferred process so we execute these after init() has grabbed the actual TeraFyClient
		['set', 'setIfDev', 'use'].forEach(m => {
			this[m] = (...args) => {
				this.bootstrapperDeferredMethods.push({method: m, args});
				return this;
			}
		});
	}
}
