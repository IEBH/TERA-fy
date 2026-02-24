import ProjectFile from './projectFile.js';
/**
* Main Tera-Fy Client (class singleton) to be used in a frontend browser
*
* @class TeraFy
*/
export default class TeraFy {
    /**
    * Various settings to configure behaviour
    *
    * @type {Object}
    * @property {String} session Unique session signature for this instance of TeraFy, used to sign server messages, if falsy `getEntropicString(16)` is used to populate
    * @property {Boolean} devMode Operate in Dev-Mode - i.e. force outer refresh when encountering an existing TeraFy instance + be more tolerant of weird iframe origins
    * @property {Number} verbosity Verbosity level, the higher the more chatty TeraFY will be. Set to zero to disable all `debug()` call output
    * @property {'detect'|'parent'|'child'|'popup'} mode How to communicate with TERA. 'parent' assumes that the parent of the current document is TERA, 'child' spawns an iFrame and uses TERA there, 'detect' tries parent and switches to `modeFallback` if communication fails
    * @property {String} modeFallback Method to use when all method detection fails
    * @property {Object<Object<Function>>} modeOverrides Functions to run when switching to specific modes, these are typically used to augment config. Called as `(config:Object)`
    * @property {Number} modeTimeout How long entities have in 'detect' mode to identify themselves
    * @property {String} siteUrl The TERA URL to connect to
    * @property {String} restrictOrigin URL to restrict communications to
    * @property {Array<String>} List of sandbox allowables for the embedded if in embed mode
    * @property {Number} handshakeInterval Interval in milliseconds when scanning for a handshake
    * @property {Number} handshakeTimeout Interval in milliseconds for when to give up trying to handshake
    * @property {Array<String|Array<String>>} [debugPaths] List of paths (in either dotted or array notation) to enter debugging mode if a change is detected in dev mode e.g. `{debugPaths: ['foo.bar.baz']}`. This really slows down state writes so should only be used for debugging
    */
    settings: {
        session: string | null;
        devMode: boolean;
        verbosity: number;
        mode: "detect" | "parent" | "child" | "popup";
        modeTimeout: number;
        modeFallback: string;
        modeOverrides: {
            [key: string]: (config: any) => void;
        };
        siteUrl: string;
        restrictOrigin: string;
        frameSandbox: string[];
        handshakeInterval: number;
        handshakeTimeout: number;
        debugPaths: Array<string | Array<string>> | null;
    };
    /**
    * Event emitter subscription endpoint
    * @type {Mitt}
    */
    events: any;
    /**
    * DOMElements for this TeraFy instance
    *
    * @type {Object}
    * @property {DOMElement} el The main tera-fy div wrapper
    * @property {DOMElement} iframe The internal iFrame element  (if `settings.mode == 'child'`)
    * @property {Window} popup The popup window context (if `settings.mode == 'popup'`)
    * @property {DOMElement} stylesheet The corresponding stylesheet
    */
    dom: {
        el: HTMLDivElement | null;
        iframe: HTMLIFrameElement | null;
        popup: Window | null;
        stylesheet: HTMLStyleElement | null;
    };
    /**
    * List of function stubs mapped from the server to here
    * This array is forms the reference of `TeraFy.METHOD()` objects to provide locally which will be mapped via `TeraFy.rpc(METHOD, ...args)`
    *
    * @type {Array<String>}
    */
    methods: readonly ["handshake", "setServerVerbosity", "getUser", "requireUser", "getCredentials", "getKindeToken", "bindProject", "getProject", "getProjects", "setActiveProject", "requireProject", "selectProject", "getNamespace", "setNamespace", "listNamespaces", "getProjectState", "setProjectState", "setProjectStateDefaults", "setProjectStateRefresh", "getProjectFileContents", "deleteProjectFile", "setProjectFileContents", "createProjectFolder", "deleteProjectFolder", "selectProjectLibrary", "getProjectLibrary", "setProjectLibrary", "projectLog", "setPage", "uiAlert", "uiConfirm", "uiJson", "uiPanic", "uiProgress", "uiPrompt", "uiThrow", "uiSplat", "uiWindow"];
    /**
    * Loaded plugins via Use()
    * @type {Array<TeraFyPlugin>}
    */
    plugins: any[];
    /**
    * Active namespaces we are subscribed to
    * Each key is the namespace name with the value as the local reactive \ observer \ object equivalent
    * The key string is always of the form `${ENTITY}::${ID}` e.g. `projects:1234`
    *
    * @type {Object<Object>}
    */
    namespaces: {
        [key: string]: any;
    };
    /**
    * Send a message + wait for a response object
    *
    * @param {Object} message Message object to send
    * @returns {Promise<*>} A promise which resolves when the operation has completed with the remote reply
    */
    send(message: any): any;
    /**
    * Send raw message content to the server
    * This function does not return or wait for a reply - use `send()` for that
    *
    * @param {Object} message Message object to send
    */
    sendRaw(message: any): void;
    /**
    * Call an RPC function in the server instance
    *
    * @param {String} method The method name to call
    * @param {...*} [args] Optional arguments to pass to the function
    *
    * @returns {Promise<*>} The resolved output of the server function
    */
    rpc(method: any, ...args: any[]): any;
    /**
    * Accept an incoming message
    *
    * @param {MessageEvent} rawMessage Raw message event to process
    *
    * @returns {Promise} A promise which will resolve when the message has been processed
    */
    acceptMessage(rawMessage: any): Promise<any>;
    /**
    * Listening postboxes, these correspond to outgoing message IDs that expect a response
    */
    acceptPostboxes: {
        [key: string]: any;
    };
    /**
    * Make a namespace available locally
    * This generally creates whatever framework flavoured reactive/observer/object is supported locally - generally with writes automatically synced with the master state
    *
    * @function mountNamespace
    * @param {String} name The alias of the namespace, this should be alphanumeric + hyphens + underscores
    *
    * @returns {Promise<Reactive>} A promise which resolves to the reactive object
    */
    mountNamespace(name: any): Promise<any>;
    /**
    * @interface
    * Actual namespace mounting function designed to be overridden by plugins
    *
    * @param {String} name The alias of the namespace, this should be alphanumeric + hyphens + underscores
    *
    * @returns {Promise} A promise which resolves when the mount operation has completed
    */
    _mountNamespace(name: any): void;
    /**
    * Release a locally mounted namespace
    * This function will remove the namespace from `namespaces`, cleaning up any memory / subscription hooks
    *
    * @function unmountNamespace
    *
    * @param {String} name The name of the namespace to unmount
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    unmountNamespace(name: any): void | Promise<void>;
    /**
    * @interface
    * Actual namespace unmounting function designed to be overridden by plugins
    *
    * @param {String} name The name of the namespace to unmount
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    _unmountNamespace(name: any): void;
    /**
    * Setup the TERA-fy client singleton
    *
    * @param {Object} [options] Additional options to merge into `settings` via `set`
    */
    constructor(options?: any);
    private initPromise;
    /**
    * Initialize the TERA client singleton
    * This function can only be called once and will return the existing init() worker Promise if its called against
    *
    * @param {Object} [options] Additional options to merge into `settings` via `set`
    * @returns {Promise<TeraFy>} An eventual promise which will resolve with this terafy instance
    */
    init(options?: any): Promise<TeraFy>;
    /**
    * Populate `settings.mode`
    * Try to communicate with a parent frame, if none assume we need to fallback to child mode
    *
    * @returns {Promise<String>} A promise which will resolve with the detected mode to use
    */
    detectMode(): Promise<'parent' | 'child' | 'popup'>;
    /**
    * Find an existing active TERA server OR initialize one
    *
    * @returns {Promise} A promise which will resolve when the loading has completed and we have found a parent TERA instance or initialized a child
    */
    injectComms(): Promise<void>;
    /**
    * Keep trying to handshake until the target responds
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @property {Number} [handshakeInterval] Interval in milliseconds when scanning for a handshake, defaults to global setting
    * @property {Number} [handshakeTimeout] Interval in milliseconds for when to give up trying to handshake, defaults to global setting
    *
    * @returns {Promise} A promise which will either resolve when the handshake is successful OR fail with 'TIMEOUT'
    */
    handshakeLoop(options?: any): Promise<void>;
    /**
    * Inject a local stylesheet to handle TERA server functionality
    *
    * @returns {Promise} A promise which will resolve when the loading has completed and we have found a parent TERA instance or initialized a child
    */
    injectStylesheet(): Promise<void>;
    /**
    * Inject all server methods defined in `methods` as local functions wrapped in the `rpc` function
    */
    injectMethods(): void;
    /**
    * Debugging output function
    * This function will only act if `settings.devMode` is truthy
    *
    * @param {'INFO'|'LOG'|'WARN'|'ERROR'} [method='LOG'] Logging method to use
    * @param {Number} [verboseLevel=1] The verbosity level to trigger at. If `settings.verbosity` is lower than this, the message is ignored
    * @param {...*} [msg] Output to show
    */
    debug(...msg: any[]): void;
    /**
    * Set or merge settings
    * This function also routes 'special' keys like `devMode` to their internal handlers
    *
    * @param {String|Object} key Either a single setting key to set or an object to merge
    * @param {*} value The value to set if `key` is a string
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.ignoreNullish=true] If falsy, this forces the setting of undefined or null values rather than ignoring them when specifying values by string
    *
    * @returns {TeraFy} This chainable terafy instance
    */
    set(key: string | object, value?: any, options?: {
        ignoreNullish?: boolean;
    }): this;
    /**
    * Set or merge settings - but only in dev mode and only if the value is not undefined
    *
    * @see set()
    * @param {String|Object} key Either a single setting key to set or an object to merge
    * @param {*} value The value to set if `key` is a string
    * @param {Object} [options] Additional options to mutate behaviour
    *
    * @returns {TeraFy} This chainable terafy instance
    */
    setIfDev(key: any, value: any, options?: any): this;
    /**
    * Include a TeraFy client plugin
    *
    * @param {Function|Object|String} source Either the JS module class, singleton object or URL to fetch it from. Eventually constructed as invoked as `(teraClient:TeraFy, options:Object)`
    * @param {Object} [options] Additional options to mutate behaviour during construction (pass options to init() to initialize later options)
    *
    * @returns {TeraFy} This chainable terafy instance
    */
    use(source: any, options?: any): this;
    /**
    * Internal function used by use() to merge an external declared singleton against this object
    *
    * @param {Object} target Installed class instance to extend
    * @param {Object} source Initialized source object to extend from
    */
    mixin(target: any, source: any): void;
    /**
    * Set or toggle devMode
    * This function also accepts meta values:
    *
    *     'toggle' - Set dev mode to whatever the opposing value of the current mode
    *     'proxy'  - Optimize for using a loopback proxy
    *
    * @param {'toggle'|'proxy'|Boolean} [devModeEnabled='toggle'] Optional boolean to force dev mode or specify other behaviour
    *
    * @returns {TeraFy} This chainable terafy instance
    */
    toggleDevMode(devModeEnabled?: 'toggle' | 'proxy' | boolean): this;
    /**
    * Fit the nested TERA server to a full-screen
    * This is usually because the server component wants to perform some user activity like calling $prompt
    *
    * @param {String|Boolean} [isFocused='toggle'] Whether to fullscreen the embedded component
    */
    toggleFocus(isFocused?: boolean | 'toggle'): void;
    /**
    * Generate random entropic character string in Base64
    *
    * @param {Number} [maxLength=32] Maximum length of the generated string
    * @returns {String}
    */
    getEntropicString(maxLength?: number): string;
    /**
    * Return basic server information as a form of validation
    *
    * @function handshake
    * @returns {Promise<Object>} Basic promise result
    * @property {Date} date Server date
    */
    /**
    * RPC callback to set the server verbosity level
    *
    * @function setServerVerbosity
    * @param {Number} verbosity The desired server verbosity level
    */
    /**
    * User / active session within TERA
    *
    * @name User
    * @property {String} id Unique identifier of the user
    * @property {String} email The email address of the current user
    * @property {String} name The provided full name of the user
    * @property {Boolean} isSubscribed Whether the active user has a TERA subscription
    */
    /**
    * Fetch the current session user
    *
    * @function getUser
    * @param {Boolean} [options.forceRetry=false] Forcibly try to refresh the user state
    * @param {Boolean} [options.waitPromises=true] Wait for $auth + $subscriptions to resolve before fetching the user (mainly internal use)
    * @returns {Promise<User>} The current logged in user or null if none
    */
    /**
    * Provide an object of credentials for 3rd party services like Firebase/Supabase
    *
    * @function getCredentials
    * @returns {Object} An object containing 3rd party service credentials
    */
    /**
    * Require a user login to TERA
    * If there is no user OR they are not logged in a prompt is shown to go and do so
    * This is an pre-requisite step for requireProject()
    *
    * @function requireUser
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.forceRetry=false] Forcibly try to refresh the user state
    *
    * @returns {Promise<User>} The current logged in user or null if none
    */
    /**
    * Require a user login to TERA
    * If there is no user OR they are not logged in a prompt is shown to go and do so
    * This is an pre-requisite step for requireProject()
    *
    * @returns {Promise} A promise which will resolve if the there is a user and they are logged in
    */
    /**
    * Project entry within TERA
    *
    * @name Project
    * @url https://tera-tools.com/help/api/schema
    */
    /**
    * Get the currently active project, if any
    *
    * @function getProject
    * @returns {Promise<Project|null>} The currently active project, if any
    */
    /**
    * Get a list of projects the current session user has access to
    *
    * @function getProjects
    * @returns {Promise<Array<Project>>} Collection of projects the user has access to
    */
    /**
    * Set the currently active project within TERA
    *
    * @function setActiveProject
    * @param {Object|String} project The project to set as active - either the full Project object or its ID
    */
    /**
    * Ask the user to select a project from those available - if one isn't already active
    * Note that this function will persist in asking the user even if they try to cancel
    *
    * @function requireProject
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.autoSetActiveProject=true] After selecting a project set that project as active in TERA
    * @param {String} [options.title="Select a project to work with"] The title of the dialog to display
    * @param {String} [options.noSelectTitle='Select project'] Dialog title when warning the user they need to select something
    * @param {String} [options.noSelectBody='A project needs to be selected to continue'] Dialog body when warning the user they need to select something
    *
    * @returns {Promise<Project>} The active project
    */
    /**
    * Prompt the user to select a project from those available
    *
    * @function selectProject
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {String} [options.title="Select a project to work with"] The title of the dialog to display
    * @param {Boolean} [options.allowCancel=true] Advertise cancelling the operation, the dialog can still be cancelled by closing it
    * @param {Boolean} [options.setActive=false] Also set the project as active when selected
    *
    * @returns {Promise<Project>} The active project
    */
    /**
    * Get a one-off snapshot of a namespace without mounting it
    * This can be used for simpler apps which don't have their own reactive / observer equivalent
    *
    * @function getNamespace
    * @param {String} name The alias of the namespace, this should be alphanumeric + hyphens + underscores
    *
    * @returns {Promise<Object>} A promise which resolves to the namespace POJO state
    */
    /**
    * Set (or merge by default) a one-off snapshot over an existing namespace
    * This can be used for simpler apps which don't have their own reactive / observer equivalent and just want to quickly set something
    *
    * @function setNamespace
    * @param {String} name The name of the namespace
    * @param {Object} state The state to merge
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {'merge'|'set'} [options.method='merge'] How to handle the state. 'merge' (merge a partial state over the existing namespace state), 'set' (completely overwrite the existing namespace)
    *
    * @returns {Promise<Object>} A promise which resolves to the namespace POJO state
    */
    /**
    * Return a list of namespaces available to the current project
    *
    * @function listNamespaces
    * @returns {Promise<Array<Object>>} Collection of available namespaces for the current project
    * @property {String} name The name of the namespace
    */
    /**
    * Return the current, full snapshot state of the active project
    *
    * @function getProjectState
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
    * @param {Array<String>} Paths to subscribe to e.g. ['/users/'],
    *
    * @returns {Promise<Object>} The current project state snapshot
    */
    /**
    * Set a nested value within the project state
    * Paths can be any valid Lodash.set() value such as:
    *
    *     - Dotted notation - e.g. `foo.bar.1.baz`
    *     - Array path segments e.g. `['foo', 'bar', 1, 'baz']`
    *
    * @function setProjectState
    * @param {String|Array<String>} path The sub-path within the project state to set
    * @param {*} value The value to set
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.save=true] Save the changes to the server immediately, disable to queue up multiple writes
    *
    * @returns {Promise} A promise which resolves when the operation has been dispatched to the server
    */
    /**
    * Set a nested value within the project state - just like `setProjectState()` - but only if no value for that path exists
    *
    * @function setProjectStateDefaults
    * @see setProjectState()
    * @param {String|Array<String>} path The sub-path within the project state to set
    * @param {*} value The value to set
    * @param {Object} [options] Additional options to mutate behaviour, see setProjectState() for the full list of supported options
    *
    * @returns {Promise<Boolean>} A promise which resolves to whether any changes were made - True if defaults were applied, false otherwise
    */
    /**
    * Force refetching the remote project state into local
    * This is only ever needed when saving large quantities of data that need to be immediately available
    *
    * @function setProjectStateRefresh
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    /**
    * Data structure for a file filter
    * @name FileFilters
    *
    * @property {Boolean} [library=false] Restrict to library files only
    * @property {String} [filename] CSV of @momsfriendlydevco/match expressions to filter the filename by (filenames are the basename sans extension)
    * @property {String} [basename] CSV of @momsfriendlydevco/match expressions to filter the basename by
    * @property {String} [ext] CSV of @momsfriendlydevco/match expressions to filter the file extension by
    */
    /**
    * Prompt the user to select a library to operate on
    *
    * @function selectProjectFile
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {String} [options.title="Select a file"] The title of the dialog to display
    * @param {String|Array<String>} [options.hint] Hints to identify the file to select in array order of preference
    * @param {Boolean} [options.save=false] Set to truthy if saving a new file, UI will adjust to allowing overwrite OR new file name input
    * @param {String} [options.saveFilename] File name to save as, if omitted the hinting system is used otherwise 'My File.unknown' is assumed
    * @param {FileFilters} [options.filters] Optional file filters
    * @param {Boolean} [options.allowUpload=true] Allow uploading new files
    * @param {Boolean} [options.allowRefresh=true] Allow the user to manually refresh the file list
    * @param {Boolean} [options.allowDownloadZip=true] Allow the user to download a Zip of all files
    * @param {Boolean} [options.allowCancel=true] Allow cancelling the operation. Will throw `'CANCEL'` as the promise rejection if actioned
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
    * @param {Boolean} [options.showHiddenFiles=false] Whether hidden data.json files should be shown
    *
    * @returns {Promise<ProjectFile>} The eventually selected file, if in save mode new files are created as stubs
    */
    selectProjectFile(options?: any): any;
    /**
    * Fetch the files associated with a given project
    *
    * @function getProjectFiles
    * @param {Object} options Options which mutate behaviour
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
    * @param {Boolean} [options.lazy=true] If true, use the fastest method to retrieve the file list such as the cache. If false, force a refresh each time
    * @param {Boolean} [options.meta=true] Pull meta information for each file entity
    *
    * @returns {Promise<Array<ProjectFile>>} A collection of project files for the given project
    */
    getProjectFiles(options?: any): any;
    /**
    * Fetch the raw contents of a file by its ID
    *
    * @function getProjectFileContents
    * @param {String} [id] File ID to retrieve the contents of
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {'blob'|'json'} [options.format='blob'] The format to retrieve the file in
    *
    * @returns {*} The file contents in the requested format
    */
    /**
    * Fetch a project file by its name
    *
    * @function getProjectFile
    * @param {String} name The file name (or path if inside a directory)
    *
    * @param {Object|String} [options] Additional options to mutate behaviour, if a string is given `options.subkey` is assumed
    * @param {String} [options.subkey] If specified only the extracted subkey is returned rather than the full object
    * @param {Boolean} [options.cache=true] Use the existing file cache if possible, set to false to force a refresh of files from the server first
    *
    * @returns {Promise<ProjectFile>} The eventual fetched ProjectFile (or requested subkey)
    */
    getProjectFile(name: string, options?: any): any;
    /**
    * Create a new file
    * This creates an empty file which can then be written to
    *
    * @function createProjectFile
    * @param {String} name The name + relative directory path component
    * @returns {Promise<ProjectFile>} The eventual ProjectFile created
    */
    createProjectFile(name: any): any;
    /**
    * Moves a project file to a new name/path.
    * The file's unique ID (UUID) remains the same, but its 'name' (relative path) and associated properties will be updated.
    *
    * @function moveProjectFile
    * @param {String} sourceId The unique ID (UUID) of the file to move.
    * @param {String} newName The new relative name for the file (e.g., "documents/report-final.pdf" or "image.png").
    *                         This path is relative to the project's root file directory.
    *
    * @param {Object} [options] Additional options to mutate behaviour.
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing.
    * @param {Boolean} [options.overwrite=true] If true (default), moving a file to a `newName` that already exists will overwrite the existing file.
    *                                          This aligns with the default behavior of the underlying Supabase storage `move` operation.
    *                                          If set to false, the function would ideally check and prevent overwrite, but current implementation relies on underlying storage behavior.
    *
    * @returns {Promise<ProjectFile | null>} A promise which resolves to the updated ProjectFile object for the moved file if found after the operation,
    *                                        or null if the file could not be located post-move (e.g., if its ID changed unexpectedly or it was deleted).
    */
    moveProjectFile(sourceId: string, newName: string, options?: any): Promise<ProjectFile | null>;
}
