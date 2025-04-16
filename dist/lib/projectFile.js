import { filesize } from 'filesize';
import { pick } from 'lodash-es';
;
/**
* A project file fetched from TERA
* @class ProjectFile
*/
export default class ProjectFile {
    /**
    * ProjectFile constructor
    * Takes the input basic file type from Supabase and adds additional formatted fields
    * @param {SupabaseFile} baseFile The basic Supabase file to extend
    * @param {TeraFyClient} baseFile.tera The associated TeraFyClient instance to use for some file methods
    */
    constructor(baseFile) {
        /**
        * Additional meta information for the file
        * @type {Object}
        */
        // Using Record<string, any> for a generic object, adjust if meta has a known structure
        this.meta = {};
        // Note: baseFile.tera is assumed to exist based on the check below and the SupabaseFile type definition above
        if (!baseFile.tera)
            throw new Error('Basic file requires a `tera` key to access the Tera instance');
        Object.assign(this, baseFile);
        // Translate baseFile.tera -> this._tera (non-enumerable, non-configurable)
        const tera = this.tera;
        Object.defineProperty(this, '_tera', {
            enumerable: false,
            configurable: false,
            get() {
                // NOTE: We can't just set {value:tera} as it upsets how Vue uses proxies
                return tera;
            },
        });
        delete this.tera; // Remove original ref we merged above
        // Calculate `teraUrl` from URL
        // Assuming this.url is always defined after Object.assign
        this.teraUrl = this.url.replace(/^https?:\/\/(?:.+?)\/projects\/(?:.+?)\/project\/(.+)$/, '/project/$1');
        // Set all `*Formatted` fields
        this.sizeFormatted = filesize(this.size || 0, { spacer: '' });
        this.createdFormatted = this.created ? this.created.toLocaleDateString() : 'Unknown created date';
        this.modifiedFormatted = this.modified ? this.modified.toLocaleDateString() : 'Unknown modified date';
        this.accessedFormatted = this.accessed ? this.accessed.toLocaleDateString() : 'Unknown access date';
    }
    /**
    * Fetch the raw file contents as a Blob
    *
    * @param {Object} [options] Additioanl options to mutate behaviour
    *
    * @returns {Promise<Blob>} The eventual raw file contents as a Blob
    *
    * @see getProjectFile()
    */
    getContents(options) {
        // Assuming _tera has this method and it returns Promise<Blob>
        return this._tera.getProjectFileContents(this.id, options);
    }
    /**
    * Overwrite the contents of a file with new content
    *
    * @param {File|Blob|FormData|Object|Array} contents The new file contents
    *
    * @returns {Promise<void>} A promise which resolves when the operation has completed
    *
    * @see setProjectFileContents()
    */
    setContents(contents) {
        // Assuming _tera has this method and it returns Promise<void> or similar
        return this._tera.setProjectFileContents(this.id, contents, {});
    }
    /**
    * Fetch the file contents as an array of Reflib refs
    *
    * @returns {Promise<Array<RefLibRef>>} An eventual array of RefLib references
    *
    * @see getProjectLibrary()
    */
    getRefs() {
        // Assuming _tera has this method and it returns Promise<Array<RefLibRef>>
        return this._tera.getProjectLibrary(this.id);
    }
    /**
    * Overwrite the contents of a file with a new collection of Reflib refs
    *
    * @param {Array<RefLibRef>} refs Collection of references for the selected library
    *
    * @returns {Promise<void>} A promise which resolves when the operation has completed
    *
    * @see setProjectLibrary()
    */
    setRefs(refs) {
        // Assuming _tera has this method and it returns Promise<void> or similar
        return this._tera.setProjectLibrary(this.id, refs);
    }
    /**
    * Compress a file state down into a serializable entity
    * By default this computes a Structured Clone which can be stringified
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
    * @returns {Object} A Structured Clone compatible representation of this ProjectFile instance
    */
    serialize() {
        return pick(this, [
            'id',
            'sbId',
            'name',
            'icon',
            'path',
            'url',
            'parsedName',
            'created',
            'modified',
            'accessed',
            'size',
            'mime',
            'meta',
            // Note that computed values such as `*Formatted` are omitted as they can be computed during the constructor stage
        ]);
    }
    /**
    * Restore an entity created with serialize
    * NOTE: This requires the 'tera' instance to be manually added to the 'data' object before calling deserialize,
    *       as it's not included in the serialized output.
    *
    * @param {Object} data An input object created via `ProjectFiles.serialize()` (MUST include a 'tera' property added manually)
    * @returns {ProjectFile} A ProjectFile instance setup against the deserializzed data
    */
    static deserialize(data) {
        // TODO: Check the below
        // WARNING: The original 'serialize' method does NOT include 'tera'.
        // The caller of 'deserialize' MUST add the correct 'tera' instance to the 'data' object
        // before passing it here, otherwise the constructor will fail.
        // e.g., const serializedData = file.serialize();
        //       serializedData.tera = myTeraClientInstance;
        //       const restoredFile = ProjectFile.deserialize(serializedData);
        // This pick includes 'tera', assuming it was added to 'data' externally.
        const constructorArg = pick(data, [
            'tera', // Assumes 'tera' exists on the input 'data' object
            'id',
            'sbId',
            'name',
            'icon',
            'path',
            'url',
            'parsedName',
            'created',
            'modified',
            'accessed',
            'size',
            'mime',
            'meta',
        ]);
        return new ProjectFile(constructorArg);
    }
}
//# sourceMappingURL=projectFile.js.map