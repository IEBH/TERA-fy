import {cloneDeep, isEqual} from 'lodash-es';
import TeraFyPluginFirebase from './firebase.js';

/**
* Vue@2 observables plugin
*
* This function is expected to be included via the `terafy.use(MODULE, OPTIONS)` syntax rather than directly
*
* @class TeraFyPluginVue2
*
* @example Implementation within a Vue@2 project `src/main.js`:
* // Include the main Tera-Fy core
* import TeraFy from '@iebh/tera-fy';
* import TerafyVue from '@iebh/tera-fy/plugins/vue2';
* let terafy = new TeraFy()
*   .set('devMode', true) // Uncomment this line if you want TeraFy to be chatty
*   .set('siteUrl', 'http://localhost:7334/embed') // Uncomment this line if running TERA locally
*   .use(TerafyVue, { // Add the Vue plugin
*   	vue: window.Vue, // Assumes Vue is available on the window object
*   })
*
* // Include after app boot
* const app = new Vue({ ... })
* app.$mount("#app");
* await terafy.init({app});
*/
export default class TeraFyPluginVue2 extends TeraFyPluginFirebase {

	/**
	* Local Vue@2 library to use, set during constuctor
	*
	* @type {Vue}
	*/
	Vue: any;

	/**
	* The root Vue app instance
	* @type {any}
	*/
	app: any;


	/**
	* The bound, reactive state of the active TERA project
	*
	* @type {Object | null}
	*/
	project: any = null;


	/**
	* Simple incrementor to ensure unique IDs for $watch expressions
	*
	* @type {Number}
	*/
	reactiveId = 1001;


	/**
	* Install into Vue@2
	*
	* @param {Object} options Additional options to mutate behaviour, see TeraFyPluginFirebase
	* @param {Object} options.app Root level Vue app to bind against
	* @param {Vue} options.Vue Vue@2 instance to bind against
	* @param {String} [options.globalName='$tera'] Global property to allocate this service as within Vue2
	* @param {*...} [options...] see TeraFyPluginFirebase
	*
	* @returns {Promise} A Promise which will resolve when the init process has completed
	*/
	async init(options: any) {
		let settings = {
			app: null,
			Vue: null,
			globalName: '$tera',
			...options,
		};

		if (!settings.Vue) throw new Error('Vue instance to use must be specified in init options as `Vue`');
		this.Vue = settings.Vue;

		if (!settings.app) throw new Error('Vue Root / App instance to use must be specified in init options as `app`');
		this.app = settings.app;

		// Make this module available globally
		if (settings.globalName)
			this.Vue.prototype[settings.globalName] = this;

		await super.init(settings); // Initalize parent class Firebase functionality

		this.project = await this._mountNamespace('_PROJECT');
	}


	/** @override */
	getReactive = (value: any) => {
		let doc = this.Vue.observable(value);

		let watcherPath = `_teraFy_${this.reactiveId++}`;
		this.app[watcherPath] = doc; // Attach onto app so we can use $watch later on

		return {
			doc,
			setState: (state: any) => {
				// Shallow copy all sub-keys into existing object (keeping the object pointer)
				Object.entries(state || {})
					.filter(([k]) => !isEqual(doc[k], state[k])) // Only accept changed keys
					.forEach(([k, v]) => doc[k] = v)
			},
			getState: () => {
				return cloneDeep(doc);
			},
			watch: (cb: Function) => {
				this.app.$watch(watcherPath, cb, {deep: true});
			},
		};
	}

}