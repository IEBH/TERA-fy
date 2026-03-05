import { merge } from 'lodash-es';
/**
* Tera-Fy Bootstrapper Client
* This class loads the "real" Tera-Fy from remote and mutates into it
*
* @class TeraFy
*/
export default class TeraFy {
    /**
    * Download the remote TERA-fy client, initialize it and mix it in with this class instance
    *
    * @param {Object} [options] Additional options to merge into `settings` via `set`
    * @returns {Promise<TeraFy>} An eventual promise which will resolve with this terafy instance
    */
    init(options) {
        // FIXME: Note this needs to point at the live site
        const getUrl = (client) => `https://dev.tera-tools.com/api/tera-fy/${client}.js`;
        return Promise.resolve()
            .then(() => this.settings.clientType == 'esm' ?
            this.bootstrapperImport(getUrl(this.settings.client))
                .then(exported => typeof exported == 'function' ? exported : Promise.reject("Tera-fy import didn't return a class"))
            : Promise.reject(`Unsupported TERA-fy clientType "${this.settings.clientType}"`))
            .then((TeraClient) => {
            const tc = new TeraClient();
            if (!tc.mixin)
                throw new Error("TERA-fy client doesn't expose a mixin() method");
            tc.mixin(this, tc);
            // Merge settings object
            merge(this.settings, tc.settings, options || {}); // Use options passed to init here
        })
            .then(() => {
            console.log('IAM', this);
            if (!this.init || typeof this.init != 'function')
                throw new Error("Newly mixed-in TERA-fy client doesn't expose a init() method");
            if (!this.detectMode || typeof this.detectMode != 'function')
                throw new Error("Newly mixed-in TERA-fy client doesn't expose a detectMode() method");
        })
            // Run all deferred methods as an sequential promise chain
            .then(() => this.bootstrapperDeferredMethods.reduce((chain, dm) => {
            return chain.then(() => {
                if (dm.method == 'use' && typeof dm.args[0] == 'string') { // Wrap `use(pluginClient:String,options:Object)` method to fetch plugin from remote
                    console.log('TERA-FY DEFERRED-USE', dm.args[0]);
                    return this.bootstrapperImport(getUrl(dm.args[0]))
                        .then(exported => typeof exported == 'function' ? exported : Promise.reject("Tera-fy plugin import didn't return a class"))
                        .then(mod => this.use(mod, ...dm.args.slice(1)));
                }
                else {
                    console.log('TERA-FY DEFERRED-METHOD', dm);
                    // Assuming the deferred method might return a promise or a value
                    return Promise.resolve(this[dm.method].apply(this, dm.args));
                }
            });
        }, Promise.resolve())) // Initialize reduce chain correctly
            .then(() => { delete this.bootstrapperDeferredMethods; }) // Use type assertion for delete
            .then(() => console.log('TYBS', 'Init'))
            // Call the *actual* init method mixed in from the client
            .then(() => this.init.call(this, options))
            .then(() => this); // Ensure the promise chain resolves with `this`
    }
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
            const cleanup = () => {
                // console.warn('CLEANUP', moduleId); // Keep console.warn commented out unless needed
                delete window[`installMod${moduleId}`]; // Use type assertion for delete
                if (script.parentNode) { // Check if script is still in DOM
                    script.remove();
                }
            };
            // Create stub function to accept payload + quit
            window[`installMod${moduleId}`] = (payload) => {
                console.log('Accept module from', url, '=', payload);
                resolve(payload);
                cleanup();
            };
            script.addEventListener('error', (event) => {
                reject(new Error(`Failed to load module script from ${url}. Event type: ${event.type}`));
                cleanup();
            });
            // Append stub script element and quit
            document.head.append(script);
        });
    }
    /**
    * TeraFyBootstrapper constructor
    *
    * @param {String} [options] Optional settings to merge
    */
    constructor(options) {
        this.settings = {
            client: 'tera-fy', // Client name within https://tera-tools.com/api/tera-fy/<NAME>.js to load
            clientType: 'esm',
        };
        /**
        * Methods to call post-init when the main TeraFyClient has loaded
        * These are setup during construction
        *
        * @type {Array<Object>}
        */
        this.bootstrapperDeferredMethods = [];
        // Merge options if provided
        if (options)
            merge(this.settings, options);
        // Map various methods to a deferred process so we execute these after init() has grabbed the actual TeraFyClient
        ['set', 'setIfDev', 'use'].forEach(m => {
            this[m] = (...args) => {
                this.bootstrapperDeferredMethods.push({ method: m, args });
                return this;
            };
        });
    }
}
//# sourceMappingURL=terafy.bootstrapper.js.map