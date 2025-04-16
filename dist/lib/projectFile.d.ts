import type TeraFy from './terafy.client.ts';
interface TeraClient extends TeraFy {
    getProjectFileContents: (id: any, options?: any) => any;
    setProjectFileContents: (id: any, contents: any, options?: any) => any;
    getProjectLibrary: (id: any, options?: any) => any;
    setProjectLibrary: (id: any, refs: any, options?: any) => any;
}
type SupabaseFile = any;
type RefLibRef = any;
/**
* A project file fetched from TERA
* @class ProjectFile
*/
export default class ProjectFile {
    /**
    * Parent TeraClient instance used by all helper functions
    * @type {TeraClient}
    * @private
    */
    _tera: TeraClient;
    /**
    * The TERA compatible unique ID of the file
    * NOTE: This is computed each time from the Base64 of the file path
    * @type {String}
    */
    id: string;
    /**
    * The raw Supabase UUID of the file
    * @type {String}
    */
    sbId: string;
    /**
    * Relative name path (can contain prefix directories) for the human readable file name
    * @type {String}
    */
    name: string;
    /**
    * CSS class to use as the file icon
    * @type {String}
    */
    icon: string;
    /**
    * Full path to the file
    * This is also used as the unique identifier within the project
    * @type {String}
    */
    path: string;
    /**
    * Fully qualified URL to view / access / download the file from TERA
    * This will usually open an edit UI within the TERA site
    * @type {String}
    */
    url: string;
    /**
    * Rewrite of the URL where the absolute URL has been removed in place of a relative path, assuming the owner project is active
    * This is used to direct to the edit/view/download UI when the files project is active and is usually used in place of URL for TERA related operations
    * @type {String}
    */
    teraUrl: string;
    /**
    * An object representing meta file parts of a file name
    * @type {Object}
    * @property {String} basename The filename + extention (i.e. everything without directory name)
    * @property {String} filename The file portion of the name (basename without the extension)
    * @property {String} ext The extension portion of the name (always lower case)
    * @property {String} dirName The directory path portion of the name
    */
    parsedName: any;
    /**
    * A date representing when the file was created
    * @type {Date}
    */
    created: Date | undefined;
    /**
    * A human readable, formatted version of "created"
    * @type {String}
    */
    createdFormatted: string;
    /**
    * A date representing when the file was created
    * @type {Date}
    */
    modified: Date | undefined;
    /**
    * A human readable, formatted version of "modified"
    * @type {String}
    */
    modifiedFormatted: string;
    /**
    * A date representing when the file was last accessed
    * @type {Date}
    */
    accessed: Date | undefined;
    /**
    * A human readable, formatted version of "accessed"
    * @type {String}
    */
    accessedFormatted: string;
    /**
    * Size, in bytes, of the file
    * @type {Number}
    */
    size: number | undefined;
    /**
    * A human readable, formatted version of the file size
    * @type {String}
    */
    sizeFormatted: string;
    /**
    * The associated mime type for the file
    * @type {String}
    */
    mime: string;
    /**
    * Additional meta information for the file
    * @type {Object}
    */
    meta: Record<string, any>;
    /**
    * ProjectFile constructor
    * Takes the input basic file type from Supabase and adds additional formatted fields
    * @param {SupabaseFile} baseFile The basic Supabase file to extend
    * @param {TeraFyClient} baseFile.tera The associated TeraFyClient instance to use for some file methods
    */
    constructor(baseFile: SupabaseFile);
    /**
    * Fetch the raw file contents as a Blob
    *
    * @param {Object} [options] Additioanl options to mutate behaviour
    *
    * @returns {Promise<Blob>} The eventual raw file contents as a Blob
    *
    * @see getProjectFile()
    */
    getContents(options?: any): Promise<Blob>;
    /**
    * Overwrite the contents of a file with new content
    *
    * @param {File|Blob|FormData|Object|Array} contents The new file contents
    *
    * @returns {Promise<void>} A promise which resolves when the operation has completed
    *
    * @see setProjectFileContents()
    */
    setContents(contents: File | Blob | FormData | object | any[]): Promise<void>;
    /**
    * Fetch the file contents as an array of Reflib refs
    *
    * @returns {Promise<Array<RefLibRef>>} An eventual array of RefLib references
    *
    * @see getProjectLibrary()
    */
    getRefs(): Promise<Array<RefLibRef>>;
    /**
    * Overwrite the contents of a file with a new collection of Reflib refs
    *
    * @param {Array<RefLibRef>} refs Collection of references for the selected library
    *
    * @returns {Promise<void>} A promise which resolves when the operation has completed
    *
    * @see setProjectLibrary()
    */
    setRefs(refs: Array<RefLibRef>): Promise<void>;
    /**
    * Compress a file state down into a serializable entity
    * By default this computes a Structured Clone which can be stringified
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
    * @returns {Object} A Structured Clone compatible representation of this ProjectFile instance
    */
    serialize(): Partial<ProjectFile>;
    /**
    * Restore an entity created with serialize
    * NOTE: This requires the 'tera' instance to be manually added to the 'data' object before calling deserialize,
    *       as it's not included in the serialized output.
    *
    * @param {Object} data An input object created via `ProjectFiles.serialize()` (MUST include a 'tera' property added manually)
    * @returns {ProjectFile} A ProjectFile instance setup against the deserializzed data
    */
    static deserialize(data: any): ProjectFile;
}
export {};
