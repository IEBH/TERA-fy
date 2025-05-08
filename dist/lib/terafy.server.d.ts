declare global {
    interface Window {
        panic(text: any): void;
    }
}
/**
* Server-side functions available to the Tera-Fy client library
*
* @class TeraFyServer
*/
export default class TeraFyServer {
    /**
    * Various settings to configure behaviour
    *
    * @type {Object}
    * @property {Boolean} devMode Operate in devMode - i.e. force outer refresh when encountering an existing TeraFy instance
    * @property {Number} verbosity Verbosity level, the higher the more chatty TeraFY will be. Set to zero to disable all `debug()` call output
    * @property {Number} subscribeTimeout Acceptable timeout period for subscribers to acklowledge a project change event, failing to respond will result in the subscriber being removed from the available subscriber list
    * @property {String} restrictOrigin URL to restrict communications to
    * @property {String} projectId The project to use as the default reference when calling various APIs
    * @property {Number} serverMode The current server mode matching `SERVERMODE_*`
    * @property {String} siteUrl The main site absolute URL
    * @property {String} sitePathLogin Either an absolute URL or the relative path (taken from `siteUrl`) when trying to log in the user
    * @property {Boolean} embedWorkaround Try to use `getUserViaEmbedWorkaround()` to force a login via popup if the user is running in local mode (see function docs for more details). This is toggled to false after the first run
    */
    settings: any;
    static SERVERMODE_NONE: number;
    static SERVERMODE_EMBEDDED: number;
    static SERVERMODE_FRAME: number;
    static SERVERMODE_POPUP: number;
    static SERVERMODE_TERA: number;
    /**
    * Create a context based on a shallow copy of this instance + additional functionality for the incoming MessageEvent
    * This is used by acceptMessage to provide a means to reply / send messages to the originator
    *
    * @param {MessageEvent} e Original message event to base the new context on
    *
    * @returns {Object} A context, which is this instance extended with additional properties
    */
    createContext(e: MessageEvent): any;
    /**
    * Create a new client context from the server to the client even if the client hasn't requested the communication
    * This function is used to send unsolicited communications from the server->client in contrast to createContext() which _replies_ from client->server->client
    *
    * @returns {Object} A context, which is this instance extended with additional properties
    */
    getClientContext(): any;
    /**
    * MessageEvent context
    * Only available if the context was created via `createContext()`
    *
    * @type {MessageEvent}
    */
    messageEvent: MessageEvent | null;
    /**
    * Request an RPC call from the original sender of a mesasge
    * This function only works if the context was sub-classed via `createContext()`
    *
    * @param {String} method The method name to call
    * @param {...*} [args] Optional arguments to pass to the function
    *
    * @returns {Promise<*>} The resolved output of the server function
    */
    senderRpc(method: string, ...args: any[]): Promise<any>;
    /**
    * Return basic server information as a form of validation
    *
    * @returns {Promise<Object>} Basic promise result
    * @property {Date} date Server date
    */
    handshake(): Promise<any>;
    /**
    * Send a message + wait for a response object
    * This method should likely be part of the context returned by createContext
    * Assuming it's intended to work on the base class referencing a stored messageEvent
    *
    * @param {Object} message Message object to send
    * @returns {Promise<*>} A promise which resolves when the operation has completed with the remote reply
    */
    send(message: any): Promise<any>;
    /**
    * Send raw message content to the client
    * Unlike send() this method does not expect any response
    *
    * @param {Object} message Message object to send
    * @param {Window} sendVia Window context to dispatch the message via if its not the same as the regular window
    */
    sendRaw(message: any, sendVia?: any): void;
    /**
    * Setter to translate between string inputs and the server modes in SERVERMODE_*
    *
    * @param {String} mode The server mode to set to
    */
    setServerMode(mode: string): void;
    /**
    * Accept a message from the parent event listener
    *
    * @param {MessageEvent} rawMessage Raw message event to process
    */
    acceptMessage(rawMessage: MessageEvent): void;
    /**
    * Listening postboxes, these correspond to outgoing message IDs that expect a response
    */
    acceptPostboxes: Record<string, any>;
    /**
    * Wrapper function which runs a callback after the frontend UI has obtained focus
    * This is to fix the issue where the front-end needs to switch between a regular webpage and a focused TERA iFrame wrapper
    * Any use of $prompt or other UI calls should be wrapped here
    *
    * @param {Function} cb Async function to run in focused mode
    *
    * @returns {Promise<*>} A promise which resolves with the resulting inner callback payload
    */
    requestFocus(cb: () => Promise<any>): Promise<any>;
    /**
    * Emit messages down into all connected clients
    * Note that emitted messages have no response - they are sent to clients only with no return value
    *
    * @param {String} event The event name to emit
    * @param {...*} [args] Optional event payload to send
    * @returns {Promise} A promise which resolves when the transmission has completed
    */
    emitClients(event: string, ...args: any[]): Promise<void>;
    /**
    * RPC callback to set the server verbostiy level
    *
    * @param {Number} verbosity The desired server verbosity level
    */
    setServerVerbosity(verbosity: number): void;
    /**
    * User / active session within TERA
    * @class User
    * @property {String} id Unique identifier of the user
    * @property {String} email The email address of the current user
    * @property {String} name The provided full name of the user
    * @property {Boolean} isSubscribed Whether the active user has a TERA subscription
    */
    /**
    * Fetch the current session user
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.forceRetry=false] Forcabily try to refresh the user state
    * @param {Boolean} [options.waitPromises=true] Wait for $auth + $subscriptions to resolve before fetching the user (mainly internal use)
    *
    * @returns {Promise<User>} The current logged in user or null if none
    */
    getUser(options?: any): Promise<any | null>;
    /**
    * Require a user login to TERA
    * If there is no user OR they are not logged in a prompt is shown to go and do so
    * This is an pre-requisite step for requireProject()
    *
    * @returns {Promise<User>} A promise which will resolve if the there is a user and they are logged in
    */
    requireUser(): Promise<any>;
    /**
    * Provide an object of credentials for 3rd party services like Firebase/Supabase
    *
    * @returns {Object} An object containing 3rd party service credentials
    */
    getCredentials(): any;
    /**
    * In embed mode only - create a popup window and try to auth via that
    *
    * When in embed mode we can't store local state (Cookies without SameSite + LocalStorage etc.) so the only way to auth the user in the restricted envionment:
    *
    * 1. Try to read state from LocalStorage (if so, skip everything else)
    * 2. Create a popup - which can escape the security container - and trigger a login
    * 3. Listen locally for a message from the popup which it will transmit the authed user to its original window opener
    * 3. Stash the state in LocalStorage to avoid this in future
    *
    * This workaround is only needed when developing with TERA in an embed window - i.e. local dev / stand alone websites
    * Its annoying but I've tried everything else as a security method to get Non-Same-Origin sites to talk to each other
    * - MC 2024-04-03
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    getUserViaEmbedWorkaround(): Promise<void>;
    /**
    * Project entry within TERA
    * @class Project
    * @property {String} id The Unique ID of the project
    * @property {String} name The name of the project
    * @property {String} created The creation date of the project as an ISO string
    * @property {Boolean} isOwner Whether the current session user is the owner of the project
    */
    /**
    * Get the currently active project, if any
    *
    * @returns {Promise<Project|null>} The currently active project, if any
    */
    getProject(): Promise<any | null>;
    /**
    * Get a list of projects the current session user has access to
    *
    * @returns {Promise<Array<Project>>} Collection of projects the user has access to
    */
    getProjects(): Promise<any[]>;
    /**
    * Set the currently active project within TERA
    *
    * @param {Object|String} project The project to set as active - either the full Project object or its ID
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    setActiveProject(project: any): Promise<void>;
    /**
    * Ask the user to select a project from those available - if one isn't already active
    * Note that this function will percist in asking the uesr even if they try to cancel
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.autoRequireUser=true] Automatically call `requireUser()` before trying to fetch a list of projects
    * @param {Boolean} [options.autoSetActiveProject=true] After selecting a project set that project as active in TERA
    * @param {String} [options.title="Select a project to work with"] The title of the dialog to display
    * @param {String} [options.noSelectTitle='Select project'] Dialog title when warning the user they need to select something
    * @param {String} [options.noSelectBody='A project needs to be selected to continue'] Dialog body when warning the user they need to select something
    *
    * @returns {Promise<Project>} The active project
    */
    requireProject(options?: any): Promise<any>;
    /**
    * Prompt the user to select a project from those available
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {String} [options.title="Select a project to work with"] The title of the dialog to display
    * @param {Boolean} [options.allowCancel=true] Allow cancelling the operation, will throw `'CANCEL'` if actioned
    * @param {Boolean} [options.setActive=false] Also set the project as active when selected
    *
    * @returns {Promise<Project>} The active project
    */
    selectProject(options?: any): Promise<any>;
    /**
    * Get a one-off snapshot of a namespace without mounting it
    * This can be used for simpler apps which don't have their own reactive / observer equivelent
    *
    * @param {String} name The alias of the namespace, this should be alphanumeric + hyphens + underscores
    *
    * @returns {Promise<Object>} A promise which resolves to the namespace POJO state
    */
    getNamespace(name: string): Promise<any>;
    /**
    * Set (or merge by default) a one-off snapshot over an existing namespace
    * This can be used for simpler apps which don't have their own reactive / observer equivelent and just want to quickly set something
    *
    * @param {String} name The name of the namespace
    * @param {Object} state The state to merge
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {'merge'|'set'} [options.method='merge'] How to handle the state. 'merge' (merge a partial state over the existing namespace state), 'set' (completely overwrite the existing namespace)
    *
    * @returns {Promise<Object>} A promise which resolves to the namespace POJO state
    */
    setNamespace(name: string, state: any, options?: any): Promise<any>;
    /**
    * Return a list of namespaces available to the current project
    *
    * @returns {Promise<Array<Object>>} Collection of available namespaces for the current project
    * @property {String} name The name of the namespace
    */
    listNamespaces(): Promise<any[]>;
    /**
    * Return the current, full snapshot state of the active project
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
    * @param {Array<String>} [options.paths] Paths to subscribe to e.g. ['/users/'],
    *
    * @returns {Promise<Object>} The current project state snapshot
    */
    getProjectState(options?: any): Promise<any>;
    /**
    * Set a nested value within the project state
    *
    * Paths can be any valid Lodash.set() value such as:
    *     - Dotted notation - e.g. `foo.bar.1.baz`
    *     - Array path segments e.g. `['foo', 'bar', 1, 'baz']`
    *
    * Conflict strategies (copied from utils/pathTools @ `set()`)
*     - 'set' / 'overwrite' - Just overwrite any existing value
*     - 'merge' - Merge existing values using Lodash.merge()
*     - 'defaults' - Merge existing values using Lodash.defaultsDeep()
    *
    * @param {String|Array<String>} path The sub-path within the project state to set
    * @param {*} value The value to set, this is set using the conflict strategy
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {'set'} [options.strategy='set'] A PathTools.set strategy to handle existing values, if any
    *
    * @returns {Promise<*>} A promise which resolves to `value` when the operation has been dispatched to the server and saved
    */
    setProjectState(path: string | string[], value: any, options?: any): Promise<any>;
    /**
    * Set a nested value within the project state - just like `setProjectState()` but applying the 'defaults' strategy by default
    *
    * @see setProjectState()
    * @param {String|Array<String>} [path] The sub-path within the project state to set, if unspecifed the entire target is used as a target and a save operation is forced
    * @param {*} value The value to set as the default structure
    * @param {Object} [options] Additional options to mutate behaviour, see setProjectState() for the full list of supported options
    *
    * @returns {Promise<*>} A promise which resolves to the eventual input value after defaults have been applied
    */
    setProjectStateDefaults(path: string | string[] | any, value?: any, options?: any): Promise<any>;
    /**
    * Force refetching the remote project state into local
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    setProjectStateRefresh(): Promise<null>;
    /**
    * Data structure for a project file
    * @class ProjectFile
    *
    * @property {String} id A UUID string representing the unique ID of the file
    * @property {String} name Relative name path (can contain prefix directories) for the human readable file name
    * @property {Object} parsedName An object representing meta file parts of a file name
    * @property {String} parsedName.basename The filename + extention (i.e. everything without directory name)
    * @property {String} parsedName.filename The file portion of the name (basename without the extension)
    * @property {String} parsedName.ext The extension portion of the name (always lower case)
    * @property {String} parsedName.dirName The directory path portion of the name
    * @property {Date} created A date representing when the file was created
    * @property {Date} modified A date representing when the file was created
    * @property {Date} accessed A date representing when the file was last accessed
    * @property {Number} size Size, in bytes, of the file
    * @property {String} mime The associated mime type for the file
    */
    /**
    * Data structure for a file filter
    * @class FileFilters
    *
    * @property {Boolean} [library=false] Restrict to library files only
    * @property {String} [filename] CSV of @momsfriendlydevco/match expressions to filter the filename by (filenames are the basename sans extension)
    * @property {String} [basename] CSV of @momsfriendlydevco/match expressions to filter the basename by
    * @property {String} [ext] CSV of @momsfriendlydevco/match expressions to filter the file extension by
    */
    /**
    * Prompt the user to select a library to operate on
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {String} [options.title="Select a file"] The title of the dialog to display
    * @param {String|Array<String>} [options.hint] Hints to identify the file to select in array order of preference
    * @param {Boolean} [options.save=false] Set to truthy if saving a new file, UI will adjust to allowing overwrite OR new file name input
    * @param {String} [options.saveFilename] File name to save as, if omitted the hinting system is used otherwise 'My File.unknown' is assumed
    * @param {FileFilters} [options.filters] Optional file filters
    * @param {Boolean} [options.allowUpload=true] Allow uploading new files
    * @param {Boolean} [options.allowRefresh=true] Allow the user to manually refresh the file list
    * @param {Boolean} [options.allowDownloadZip=true] Allow the user to download a Zip of all files
    * @param {Boolean} [options.allowCancel=true] Allow cancelling the operation. Will throw `'CANCEL'` as the promise rejection if acationed
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
    * @param {FileFilters} [options.filter] Optional file filters
    *
    * @returns {Promise<ProjectFile>} The eventually selected file, if in save mode new files are created as stubs
    */
    selectProjectFile(options?: any): Promise<any>;
    /**
    * Fetch the files associated with a given project
    *
    * @param {Object} options Options which mutate behaviour
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
    * @param {Boolean} [options.lazy=true] If true, use the fastest method to retrieve the file list such as the cache. If false, force a refresh each time
    * @param {Boolean} [options.meta=true] Pull meta information for each file entity
    *
    * @returns {Promise<Array<ProjectFile>>} A collection of project files for the given project
    */
    getProjectFiles(options?: any): Promise<any[]>;
    /**
    * Fetch a project file by its name
    *
    * @param {String} name The name + relative directory path component
    *
    * @param {Object|String} [options] Additional options to mutate behaviour, if a string is given `options.subkey` is assumed
    * @param {String} [options.subkey] If specified only the extracted subkey is returned rather than the full object
    * @param {Boolean} [options.cache=true] Use the existing file cache if possible, set to false to force a refresh of files from the server first
    *
    * @returns {Promise<ProjectFile>} The eventual fetched ProjectFile (or requested subkey)
    */
    getProjectFile(name: string, options?: any): Promise<any>;
    /**
    * Fetch the raw contents of a file by its ID
    *
    * @param {String} [id] File ID to retrieve the contents of
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {'blob'|'json'} [options.format='blob'] The format to retrieve the file in. If `json` the raw output is run via JSON.parse() first
    *
    * @returns {*} The file contents in the requested format
    */
    getProjectFileContents(id: string, options?: any): Promise<any>;
    /**
    * Create a new file
    * This creates an empty file which can then be written to
    * This function also forces a local file list cache update
    *
    * @param {String} name The name + relative directory path component
    * @returns {Promise<ProjectFile>} The eventual ProjectFile created
    */
    createProjectFile(name: string): Promise<any>;
    /**
    * Moves a project file to a new name/path.
    * The file's unique ID (UUID) remains the same, but its 'name' (relative path) and associated properties will be updated.
    *
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
    moveProjectFile(sourceId: string, newName: string, options?: any): Promise<any | null>;
    /**
    * Remove a project file by its ID
    *
    * @param {String} id The File ID to remove
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    deleteProjectFile(id: string): Promise<null>;
    /**
    * Save (or overwrite) a file within a project
    *
    * @param {String|ProjectFile} [id] ProjectFile or ID of the same to overwrite, if omitted a file is prompted for
    * @param {File|Blob|FormData|Object|Array} contents The new file contents
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {String|ProjectFile} [options.id] Alternate method to specify the file ID to save as, if omitted one will be prompted for
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
    * @param {String|Array<String>} [options.hint] Hint(s) to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'
    * @param {String} [options.filename] Suggested filename if `id` is unspecified
    * @param {String} [options.title='Save citation library'] Dialog title if `id` is unspecified and a prompt is necessary
    * @param {Object} [options.meta] Optional meta data to merge into the file data
    *
    * @returns {Promise} A promise which will resolve when the write operation has completed
    */
    setProjectFileContents(id: string | any | null, contents: any, options?: any): Promise<null>;
    /**
    * Creates a new "folder" within the project's file storage.
    * Folders in Supabase storage are typically represented by creating a placeholder file (e.g., .emptyFolderPlaceholder) within the desired path.
    * This operation is idempotent: if the folder (via its placeholder) already exists, it will not error.
    *
    * @param {String} folderPath The relative path of the folder to create (e.g., "myDocuments/reports").
    * @param {Object} [options] Additional options.
    * @param {Boolean} [options.autoRequire=true] Automatically run `requireProject()` to ensure an active project context.
    * @returns {Promise<void>} A promise that resolves when the folder is created or ensured.
    * @throws {Error} If no project is active (and autoRequire is false), or if folderPath is invalid, or if the creation fails.
    */
    createProjectFolder(folderPath: string, options?: {
        autoRequire?: boolean;
    }): Promise<void>;
    /**
    * Deletes a "folder" and all its contents from the project's file storage.
    * This involves listing all files under the given folder path (prefix) and removing them.
    *
    * @param {String} folderPath The relative path of the folder to delete (e.g., "myDocuments/reports").
    * @param {Object} [options] Additional options.
    * @param {Boolean} [options.autoRequire=true] Automatically run `requireProject()` to ensure an active project context.
    * @returns {Promise<null>} A promise that resolves with null when the folder and its contents are deleted.
    * @throws {Error} If no project is active (and autoRequire is false), or if folderPath is invalid, or if deletion fails.
    */
    deleteProjectFolder(folderPath: string, options?: {
        autoRequire?: boolean;
    }): Promise<null>;
    /**
    * Prompt the user to select a library to operate on and return a array of references in a given format
    *
    * @param {Object} [options] Additional options to mutate behaviour - see `getProjectLibrary()` for parent list of options
    * @param {String} [options.title="Select a citation library"] The title of the dialog to display
    * @param {String|Array<String>} [options.hint] Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage - e.g. 'deduped', 'review1', 'review2', 'dedisputed'
    * @param {Boolean} [options.allowUpload=true] Allow uploading new files
    * @param {Boolean} [options.allowRefresh=true] Allow the user to manually refresh the file list
    * @param {Boolean} [options.allowDownloadZip=true] Allow the user to download a Zip of all files
    * @param {Boolean} [options.allowCancel=true] Allow cancelling the operation. Will throw `'CANCEL'` as the promise rejection if acationed
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
    * @param {FileFilters} [options.filters] Optional file filters, defaults to citation library selection only
    *
    * @returns {Promise<Array<Ref>>} A collection of references from the selected file
    */
    selectProjectLibrary(options?: any): Promise<any[]>;
    /**
    * Fetch + convert a project file into a library of citations
    *
    * @param {String} id File ID to read
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {String} [options.format='json'] Format for the file. ENUM: 'pojo' (return a parsed JS collection), 'blob' (raw JS Blob object), 'file' (named JS File object)
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
    * @param {Function} [options.filter] Optional async file filter, called each time as `(File:ProjectFile)`
    * @param {Function} [options.find] Optional async final stage file filter to reduce all candidates down to one subject file
    *
    * @returns {Promise<Array<Ref>>|Promise<*>} A collection of references (default bevahiour) or a whatever format was requested
    */
    getProjectLibrary(id: string, options?: any): Promise<any>;
    /**
    * Save back a citation library from some input
    *
    * @param {String} [id] File ID to save back to, if omitted a file will be prompted for
    * @param {Array<RefLibRef>|Blob|File} [refs] Collection of references for the selected library or the raw Blob/File
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {String} [options.id] Alternate method to specify the file ID to save as, if omitted one will be prompted for
    * @param {Array<RefLibRef>|Blob|File} [options.refs] Alternate method to specify the refs to save as an array or raw Blob/File
    * @param {String} [options.format='auto'] Input format used. ENUM: 'auto' (try to figure it out from context), 'pojo' (JS array of RefLib references), 'blob' (raw JS Blob object), 'file' (named JS File object)
    * @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
    * @param {String|Array<String>} [options.hint] Hint(s) to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'
    * @param {String} [options.filename] Suggested filename if `id` is unspecified
    * @param {String} [options.title='Save citation library'] Dialog title if `id` is unspecified and a prompt is necessary
    * @param {Boolean} [options.overwrite=true] Allow existing file upsert
    * @param {Object} [options.meta] Optional meta data to merge into the file data
    *
    * @returns {Promise} A promise which resolves when the save operation has completed
    */
    setProjectLibrary(id: string | any | null, refs?: any, options?: any): Promise<null>;
    /**
    * Create a log entry for the currently active project
    *
    * The required log object can be of various forms. See https://tera-tools.com/api/logs.json for the full list
    *
    * @param {Object} log The log entry to create
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    projectLog(log: any): Promise<void>;
    /**
    * Set an active tools URL or other context information so that it survives a refresh
    * This only really makes a difference to tools within the tera-tools.com site where the tool is working as an embed
    *
    * @param {Object|String} options Context information about the page, if this is a string, its assumed to popupate `url`
    * @param {String} [options.path] The URL path segment to restore on next refresh
    * @param {String} [options.title] The page title associated with the path
    */
    setPage(options: any): void;
    /**
    * Setup the TERA-fy client singleton
    *
    * @param {Object} [options] Additional options to merge into `settings`
    */
    constructor(options?: any);
    /**
    * Initialize the browser listener
    */
    init(): void;
    /**
    * Display simple text within TERA
    *
    * @param {String} [text] Text to display, if specified this populates `options.body`
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {String} [options.body="Alert!"] The body text to display
    * @param {Boolean} [options.isHtml=false] If falsy the text is rendered as plain-text otherwise it will be assumed as HTML content
    * @param {String} [options.title='TERA'] The title of the alert box
    * @param {'ok'|false} [options.buttons='ok'] Button set to use or falsy to disable
    *
    * @returns {Promise} A promise which resolves when the alert has been dismissed
    */
    uiAlert(text: string | any, options?: any): Promise<void>;
    /**
    * Present a simple ok/cancel dialog to the user
    *
    * @param {String} [text] Text to display, if specified this populates `options.body`
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {String} [options.body="Confirm?"] The body text to display
    * @param {Boolean} [options.isHtml=false] If falsy the text is rendered as plain-text otherwise it will be assumed as HTML content
    * @param {String} [options.title='TERA'] The title of the confirmation box
    *
    * @returns {Promise} A promise which resolves with `Promise.resolve('OK')` or rejects with `Promise.reject('CANCEL')`
    */
    uiConfirm(text: string | any, options?: any): Promise<'OK'>;
    /**
    * Trigger a fatal error, killing the outer TERA site
    *
    * @function uiPanic
    * @param {String} [text] Text to display
    */
    uiPanic(text: any): void;
    /**
    * Display, update or dispose of windows for long running tasks
    * All options are cumulative - i.e. they are merged with other options previously provided
    *
    * @param {Object|Boolean} [options] Additional options to mutate behaviour, if boolean false `close: true` is assumed
    * @param {String} [options.body=''] Window body text
    * @param {Boolean} [options.bodyHtml=false] If truthy, treat the body as HTML
    * @param {String} [options.title='TERA'] Window title, can only be set on the initial call
    * @param {Boolean} [options.close=false] Close the existing dialog, if true the dialog is disposed and options reset
    * @param {Number} [options.progress] The current progress of the task being conducted, this is assumed to be a value less than `progressMax`
    * @param {Number} [options.progressMax] The maximum value that the progress can be
    *
    * @returns {Promise} A promise which resolves when the dialog has been updated
    */
    uiProgress(options?: any): Promise<void>;
    _uiProgress: {
        options: any | null;
        promise: Promise<any> | null;
    };
    /**
    * Prompt the user for an input, responding with a Promisable value
    *
    * @param {String} [text] Text to display, if specified this populates `options.body`
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {String} [options.body] Optional additional body text
    * @param {Boolean} [options.isHtml=false] If truthy, treat the body as HTML
    * @param {String} [options.value] Current or default value to display pre-filled
    * @param {String} [options.title='Input required'] The dialog title to display
    * @param {String} [options.placeholder] Optional placeholder text
    * @param {Boolean} [options.required=true] Treat nullish or empty inputs as a cancel operation
    *
    * @returns {Promise<*>} Either the eventual user value or a throw with `Promise.reject('CANCEL')`
    */
    uiPrompt(text: string | any, options?: any): Promise<any>;
    /**
    * Catch an error using the TERA error handler
    *
    * @param {Error|Object|String} error Error to handle, generally an Error object but can be a POJO or a scalar string
    *
    * @returns {Void} This function is fatal
    */
    uiThrow(error: any): Promise<void>;
    /**
    * Open a popup window containing a new site
    *
    * @param {String} url The URL to open
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Number} [options.width=500] The desired width of the window
    * @param {Number} [options.height=600] The desired height of the window
    * @param {Boolean} [options.center=true] Attempt to center the window on the screen
    * @param {Object} [options.permissions] Additional permissions to set on opening, defaults to a suitable set of permission for popups (see code)
    *
    * @returns {WindowProxy} The opened window object (if `noopener` is not set in permissions)
    */
    uiWindow(url: string | URL, options?: any): WindowProxy | null;
    /**
    * Display HTML content full-screen within TERA
    * This function is ideally called within a requestFocus() wrapper
    *
    * @param {DOMElement|String|false} content Either a prepared DOM element or string to compile, set to falsy to remove existing content
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean|String} [options.logo=false] Add a logo to the output, if boolean true the Tera-tools logo is used otherwise specify a path or URL
    */
    uiSplat(content: Element | string | false, options?: any): void;
    /**
    * Debugging output function
    * This function will only act if `settings.devMode` is truthy
    *
    * @param {'INFO'|'LOG'|'WARN'|'ERROR'} [method='LOG'] Logging method to use
    * @param {Number} [verboseLevel=1] The verbosity level to trigger at. If `settings.verbosity` is lower than this, the message is ignored
    * @param {...*} [msg] Output to show
    */
    debug(...inputArgs: any[]): void;
}
