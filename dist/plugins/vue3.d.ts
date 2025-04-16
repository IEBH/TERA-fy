import TeraFyPluginFirebase from './firebase.js';
import { App, WatchCallback } from 'vue';
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
    project: any;
    /**
    * Init the project including create a reactive mount for the active project
    *
    * @param {Object} options Additional options to mutate behaviour
    * @param {*} [options...] see TeraFyPluginFirebase
    */
    init(options: Record<string, any>): Promise<void>;
    /** @override */
    getReactive(value: any): {
        doc: any;
        setState(state: any): void;
        getState(): any;
        watch(cb: WatchCallback<any, any>): void;
    };
    /**
    * Provide a Vue@3 compatible plugin
    *
    * @returns {VuePlugin} A Vue@3 plugin spec
    */
    vuePlugin(): {
        /**
        * Install into Vue as a generic Vue@3 plugin
        *
        * @param {VueApp} app The Vue top-level app to install against
        *
        * @param {Object} [options] Additional options to mutate behaviour
        * @param {String} [options.globalName='$tera'] Global property to allocate this service as
        */
        install(app: App, options: Record<string, any>): void;
    };
}
