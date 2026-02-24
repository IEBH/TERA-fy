import Syncro from '../lib/syncro/syncro.js';
import TeraFyPluginBase from './base.js';
/**
* Plugin which adds Firebase / Firestore support for namespace mounts
*
* @class TeraFyPluginFirebase
*/
export default class TeraFyPluginFirebase extends TeraFyPluginBase {
    /**
    * Lookup object of mounted Syncro objects by path
    *
    * @type {Object<Syncro>}
    */
    syncros: Record<string, Syncro>;
    namespaces: Record<string, any>;
    getCredentials: () => Promise<Record<string, any>>;
    requireProject: () => Promise<{
        id: string;
    }>;
    debug: (...args: any[]) => void;
    /**
    * @interface
    * The Syncro#reactive option to use when creating new Syncro instances
    * This is expected to be overridden by other plugins
    * If falsy the Syncro module will fall back to its internal (POJO only) getReactive() function
    *
    * @name getReactive
    * @type {Function} A reactive function as defined in Syncro
    */
    getReactive?: () => any;
    /**
    * Setup Firebase + Firestore + Supabase
    * Default credentials (Firebase + Supabase) will be retrieved from `getCredentials()` unless overridden here
    *
    * @param {Object} options Additional options to mutate behaviour (defaults to the main teraFy settings)
    * @param {String} [options.firebaseApiKey] Firebase API key
    * @param {String} [options.firebaseAuthDomain] Firebase authorized domain
    * @param {String} [options.firebaseProjectId] Firebase project ID
    * @param {String} [options.firebaseAppId] Firebase App ID
    * @param {String} [options.supabaseUrl] Supabase URL
    * @param {String} [options.supabaseKey] Supabase client key
    *
    * @returns {Promise} A Promise which will resolve when the init process has completed
    */
    init(options?: any): Promise<void>;
    /**
    * Mount the given namespace against `namespaces[name]`
    *
    * @param {'_PROJECT'|String} name The name/Syncro path of the namespace to mount (or '_PROJECT' for the project mount-point)
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    _mountNamespace(name: string): Promise<void>;
    /**
    * Unmount the given namespace from `namespaces[name]`
    *
    * @param {String} name The name/Syncro path of the namespace to unmount
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    _unmountNamespace(name: string): Promise<void | any[]>;
}
