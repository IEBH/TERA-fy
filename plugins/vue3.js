import {cloneDeep, isEqual} from 'lodash-es';
import {reactive as vueReactive, toRaw, watch as vueWatch} from 'vue';
import TeraFyPluginSyncro from './syncro.js';


/**
* Vue@3 implementation of the Syncro reactive adapter
* Provides a Vue reactive as the document mirror with sync-flushed deep watching
* Exported standalone so non-plugin consumers (e.g. the main TERA `$sync` service) can inject it via `Syncro.setup({getReactive})`
*
* @param {Object} value Initial value of the reactive
*
* @returns {Object} A reactive object prototype as expected by `Syncro.settings.getReactive`
* @property {VueReactive} doc The reactive object
* @property {Function} setState Apply an incoming document state over `doc`, keeping the object pointer + only touching changed keys so Vue only re-renders affected subtrees
* @property {Function} getState Fetch a detached (raw + deep-cloned) snapshot of the current state
* @property {Function} watch Set up a deep, sync-flushed state watcher, returns its un-watch function
*/
export function getReactive(value) {
	let doc = vueReactive(value ?? {});

	return {
		doc,
		setState(state) {
			let stateKeys = new Set(Object.keys(state || {}));

			// Remove local keys that no longer exist upstream
			Object.keys(doc)
				.filter(key => !stateKeys.has(key))
				.forEach(key => delete doc[key]);

			// Shallow copy changed sub-keys into the existing object (keeping the object pointer)
			Object.entries(state || {})
				.forEach(([key, val]) => {
					if (!isEqual(toRaw(doc[key]), val)) doc[key] = cloneDeep(val); // Clone as RxDB deep-freezes its documents
				});
		},
		getState() {
			return cloneDeep(toRaw(doc));
		},
		watch(cb) { // flush:'sync' so inbound applies echo synchronously + the Syncro `applying` guard can suppress them
			return vueWatch(doc, cb, {deep: true, flush: 'sync'});
		},
	};
}


/**
* Vue observables plugin
*
* This function is expected to be included via the `terafy.use(MODULE, OPTIONS)` syntax rather than directly
*
* @class TeraFyPluginVue3
*
* @example Implementation within a Vue3 / Vite project within `src/main.js`:
* import TeraFy from '@iebh/tera-fy';
* import TerafyVue from '@iebh/tera-fy/plugins/vue3';
* let terafy = new TeraFy()
*   .set('devMode', import.meta.env.DEV)
*   .set('siteUrl', 'http://localhost:7334/embed') // Uncomment this line if running TERA locally
*   .use(TerafyVue) // Add the Vue plugin
*
* terafy.init(); // Initialize everything
*
* app.use(terafy.vuePlugin({
*   globalName: '$tera', // Install as vm.$tera into every component
* }));
*
* @example Accessing project state - within a Vue component
* this.$tera.active
*/
export default class TeraFyPluginVue3 extends TeraFyPluginSyncro {

	/**
	* The bound, reactive state of the active TERA project
	*
	* @type {Object}
	*/
	project = null;


	/**
	* Init the project including create a reactive mount for the active project
	*
	* @param {Object} options Additional options to mutate behaviour, see TeraFyPluginSyncro
	* @returns {Promise} A Promise which will resolve when the init process has completed
	*/
	init(options) {
		return Promise.resolve()
			.then(()=> super.init(options)) // Initalize parent class Syncro functionality
			.then(()=> this.mountNamespace('_PROJECT')) // Mount the project namespace
			.then(()=> this.project = this.namespaces['_PROJECT'])
	}


	/**
	* @override
	*/
	getReactive(value) {
		return getReactive(value);
	}


	/**
	* Provide a Vue@3 compatible plugin
	*
	* @returns {VuePlugin} A Vue@3 plugin spec
	*/
	vuePlugin() {
		let $tera = this;

		return {

			/**
			* Install into Vue as a generic Vue@3 plugin
			*
			* @param {VueApp} app The Vue top-level app to install against
			*
			* @param {Object} [options] Additional options to mutate behaviour
			* @param {String} [options.globalName='$tera'] Global property to allocate this service as
			*/
			install(app, options) {
				let settings = {
					globalName: '$tera',
					...options,
				};

				// Make this module available globally
				app.config.globalProperties[settings.globalName] = $tera;
			},

		};
	}
}
