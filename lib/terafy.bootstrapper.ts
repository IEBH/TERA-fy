import {merge} from 'lodash-es';
import type { default as TeraClient } from './terafy.client.ts';

// Define interface for deferred methods
interface DeferredMethod {
    method: string;
    args: any[];
}

type TeraClientConstructor = typeof TeraClient


/**
* Tera-Fy Bootstrapper Client
* This class loads the "real" Tera-Fy from remote and mutates into it
*
* @class TeraFy
*/
export default class TeraFy {
	settings: Record<string, any> = { // Added index signature for merge compatibility
		client: 'tera-fy', // Client name within https://tera-tools.com/api/tera-fy/<NAME>.js to load
		clientType: 'esm',
	};


	/**
	* Download the remote TERA-fy client, initalize it and mix it in with this class instance
	*
	* @param {Object} [options] Additional options to merge into `settings` via `set`
	* @returns {Promise<TeraFy>} An eventual promise which will resovle with this terafy instance
	*/
	init(options?: any): Promise<this> {
		// FIXME: Note this needs to point at the live site
		let getUrl = (client: string) => `https://dev.tera-tools.com/api/tera-fy/${client}.js`;

		return Promise.resolve()
			.then(()=>
				this.settings.clientType == 'esm' ?
					this.bootstrapperImport(getUrl(this.settings.client))
						.then(exported => typeof exported == 'function' ? exported : Promise.reject("Tera-fy import didn't return a class"))
				: Promise.reject(`Unsupported TERA-fy clientType "${this.settings.clientType}"`)
			)
			.then((TeraClient: TeraClientConstructor) => {
				let tc = new TeraClient();
				if (!tc.mixin) throw new Error('TERA-fy client doesnt expose a mixin() method');

				tc.mixin(this, tc);

				// Merge settings object
				merge(this.settings, tc.settings, options || {}); // Use options passed to init here
			})
			.then(()=> { // Sanity checks
				console.log('IAM', this);
				if (!(this as any).init || typeof (this as any).init != 'function') throw new Error('Newly mixed-in TERA-fy client doesnt expose a init() method');
				if (!(this as any).detectMode || typeof (this as any).detectMode != 'function') throw new Error('Newly mixed-in TERA-fy client doesnt expose a detectMode() method');
			})
			// Run all deferred methods as an sequencial promise chain
			.then(() => this.bootstrapperDeferredMethods.reduce((chain: Promise<any>, dm: DeferredMethod) => {
				return chain.then(() => {
					if (dm.method == 'use' && typeof dm.args[0] == 'string') { // Wrap `use(pluginClient:String,options:Object)` method to fetch plugin from remote
						console.log('TERA-FY DEFERRED-USE', dm.args[0]);
						return this.bootstrapperImport(getUrl(dm.args[0]))
							.then(exported => typeof exported == 'function' ? exported : Promise.reject("Tera-fy plugin import didn't return a class"))
							.then(mod => (this as any).use(mod, ...dm.args.slice(1)));
					} else {
						console.log('TERA-FY DEFERRED-METHOD', dm);
						// Assuming the deferred method might return a promise or a value
						return Promise.resolve((this as any)[dm.method].apply(this, dm.args));
					}
				});
			}, Promise.resolve<any>(undefined))) // Initialize reduce chain correctly
			.then(()=> { delete (this as any).bootstrapperDeferredMethods; }) // Use type assertion for delete
			.then(()=> console.log('TYBS', 'Init'))
			// Call the *actual* init method mixed in from the client
			.then((): Promise<any> => (this as any).init.call(this, options))
			.then(() => this); // Ensure the promise chain resolves with `this`
	}


	/**
	* Methods to call post-init when the main TeraFyClient has loaded
	* These are setup during construction
	*
	* @type {Array<Object>}
	*/
	bootstrapperDeferredMethods: DeferredMethod[] = [];


	/**
	* Go fetch a remote URL, inject it as a <script> element and resolve to the exported default
	* This is a fix for the fact that regular import() can't accept URLs
	*
	* @param {String} url The URL to import
	* @returns {*} The default, single export of the module
	*/
	bootstrapperImport(url: string): Promise<any> {
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
				// console.warn('CLEANUP', moduleId); // Keep console.warn commented out unless needed
				delete (window as any)[`installMod${moduleId}`]; // Use type assertion for delete
				if (script.parentNode) { // Check if script is still in DOM
					script.parentNode.removeChild(script);
				}
			}

			// Create stub function to accept payload + quit
			(window as any)[`installMod${moduleId}`] = (payload: any) => {
				console.log('Accept module from', url, '=', payload);
				resolve(payload);
				cleanup();
			};


			// FIXME: Not sure if this is actually detecting errors? addEventListener instead maybe?
			script.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
				reject(new Error(`Failed to load module from ${url} - ${error ? error.toString() : event}`));
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
	constructor(options?: any) {
		// Merge options if provided
		if (options) merge(this.settings, options);

		// Map various methods to a deferred process so we execute these after init() has grabbed the actual TeraFyClient
		['set', 'setIfDev', 'use'].forEach(m => {
			(this as any)[m] = (...args: any[]) => {
				this.bootstrapperDeferredMethods.push({method: m, args});
				return this;
			}
		});
	}
}