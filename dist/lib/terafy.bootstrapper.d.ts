interface DeferredMethod {
    method: string;
    args: any[];
}
/**
* Tera-Fy Bootstrapper Client
* This class loads the "real" Tera-Fy from remote and mutates into it
*
* @class TeraFy
*/
export default class TeraFy {
    settings: Record<string, any>;
    /**
    * Download the remote TERA-fy client, initialize it and mix it in with this class instance
    *
    * @param {Object} [options] Additional options to merge into `settings` via `set`
    * @returns {Promise<TeraFy>} An eventual promise which will resolve with this terafy instance
    */
    init(options?: any): Promise<this>;
    /**
    * Methods to call post-init when the main TeraFyClient has loaded
    * These are setup during construction
    *
    * @type {Array<Object>}
    */
    bootstrapperDeferredMethods: DeferredMethod[];
    /**
    * Go fetch a remote URL, inject it as a <script> element and resolve to the exported default
    * This is a fix for the fact that regular import() can't accept URLs
    *
    * @param {String} url The URL to import
    * @returns {*} The default, single export of the module
    */
    bootstrapperImport(url: string): Promise<any>;
    /**
    * TeraFyBootstrapper constructor
    *
    * @param {String} [options] Optional settings to merge
    */
    constructor(options?: any);
}
export {};
