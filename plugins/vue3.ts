import {cloneDeep} from 'lodash-es';
import TeraFyPluginFirebase from './firebase.js';
import {reactive as vueReactive, watch as vueWatch, App, WatchCallback} from 'vue';

/**
* Vue observables plugin
*
* This function is expected to be included via the `terafy.use(MODULE, OPTIONS)` syntax rather than directly
*
* @class TeraFyPluginVue3
*
* @example Implementation within a Vue3 / Vite project within `src/main.js`:
* import TeraFy from '@iebh/tera-fy';
* import TerafyVue from '@iebh/tera-fy/plugins/vue';
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
export default class TeraFyPluginVue3 extends TeraFyPluginFirebase {

	/**
	* The bound, reactive state of the active TERA project
	*
	* @type {Object}
	*/
	project: any = null;


	/**
	* Init the project including create a reactive mount for the active project
	*
	* @param {Object} options Additional options to mutate behaviour
	* @param {*} [options...] see TeraFyPluginFirebase
	*/
	async init(options: Record<string, any>) {
		await super.init(options); // Initalize parent class Firebase functionality

		// Mount the project namespace
		this.project = await this._mountNamespace('_PROJECT');
	}


	/** @override */
	getReactive = (value: any) => {
		let doc = vueReactive(value);
		return {
			doc,
			setState(state: any) {
				// Shallow copy all sub-keys into existing object (keeping the object pointer)
				Object.entries(state || {})
					.forEach(([k, v]) => doc[k] = v)
			},
			getState() {
				return cloneDeep(doc);
			},
			watch(cb: WatchCallback<any, any>) {
				vueWatch(doc, cb, {deep: true});
			},
		};
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
			install(app: App, options: Record<string, any>) {
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