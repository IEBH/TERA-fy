import Syncro from '../lib/syncro/syncro.js';
import TeraFyPluginBase from './base.js';


/**
* Plugin which adds RxDB Syncro support for namespace mounts
* This wires the shared Syncro engine (see `lib/syncro/syncro.js`) into the TeraFy client, fetching auth
* tokens over the TeraFy RPC bridge
*
* Framework specific plugins (vue2 / vue3) extend this class, providing their own `getReactive()`
*
* @class TeraFyPluginSyncro
*/
export default class TeraFyPluginSyncro extends TeraFyPluginBase {

	/**
	* Lookup object of mounted Syncro objects by namespace name
	*
	* @type {Object<Syncro>}
	*/
	syncros = {};


	/**
	* Available Namespaces
	*
	* @type {Object}
	*/
	namespaces = {};


	/**
	* @interface
	* The reactive adapter to use when mounting Syncro instances
	* This is expected to be overridden by framework plugins (vue2 / vue3)
	* If falsy the Syncro module will fall back to its internal (POJO only) `Syncro.defaultReactive()` function
	*
	* @name getReactive
	* @type {Function} A reactive adapter function as defined in `Syncro.defaultReactive()`
	*/


	/**
	* Configure the shared Syncro engine
	*
	* @param {Object} options Additional options to mutate behaviour (defaults to the main teraFy settings)
	* @param {String} [options.syncUrl] Base URL of the tera-io worker used for replication + snapshots
	* @param {Object} [options.syncHttp] Axios-like HTTP client to use for replication calls, defaults to the built-in fetch adapter
	* @param {Function} [options.syncGetToken] Async function resolving with an auth bearer token, defaults to the TeraFy `getKindeToken()` RPC
	*
	* @returns {Promise} A Promise which will resolve when the init process has completed
	*/
	init(options) {
		let settings = {
			syncUrl: null,
			syncHttp: null,
			syncGetToken: null,
			...options,
		};

		return Promise.resolve()
			.then(()=> Syncro.setup({
				devMode: !!this.settings?.devMode,
				debug: (...msg) => this.debug('SYNCRO', ...msg),
				getReactive: this.getReactive
					? (...args) => this.getReactive(...args)
					: null,
				getToken: settings.syncGetToken
					|| (()=> this.getKindeToken()),
				...(settings.syncUrl && {url: settings.syncUrl}),
				...(settings.syncHttp && {http: settings.syncHttp}),
			}))
	}


	/**
	* Mount the given namespace against `namespaces[name]`
	*
	* @param {'_PROJECT'|String} name The name/Syncro path of the namespace to mount (or '_PROJECT' for the project mount-point)
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	_mountNamespace(name) { // eslint-disable-line unicorn/prefer-private-class-fields -- Method name is part of the TeraFy client plugin contract
		return Promise.resolve()
			.then(()=> this.requireProject())
			.then(project => {
				let path = name == '_PROJECT'
					? `projects::${project.id}`
					: `project_namespaces::${project.id}::${name}`;

				return Syncro.mount(path);
			})
			.then(syncro => { // Assign local state
				this.syncros[name] = syncro;
				this.namespaces[name] = syncro.value;
			})
	}


	/**
	* Unmount the given namespace from `namespaces[name]`
	*
	* @param {String} name The name/Syncro path of the namespace to unmount
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	_unmountNamespace(name) { // eslint-disable-line unicorn/prefer-private-class-fields -- Method name is part of the TeraFy client plugin contract
		let syncro = this.syncros[name]; // Create local alias for Syncro before we detach it

		// Detach local state
		delete this.namespaces[name];
		delete this.syncros[name];

		return syncro
			? syncro.destroy() // Trigger Syncro destruction
			: Promise.resolve(); // Syncro doesn't exist - nothing to do
	}
}
