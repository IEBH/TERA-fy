import {filesize} from 'filesize';
import {pick} from 'lodash-es';

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
	_tera;


	/**
	* A UUID string representing the unique ID of the file
	* @type {String}
	*/
	id;


	/**
	* Relative name path (can contain prefix directories) for the human readable file name
	* @type {String}
	*/
	name;


	/**
	* CSS class to use as the file icon
	* @type {String}
	*/
	icon;


	/**
	* Full path to the file
	* This is also used as the unique identifier within the project
	* @type {String}
	*/
	path;


	/**
	* Fully qualified URL to view / access / download the file from TERA
	* This will usually open an edit UI within the TERA site
	* @type {String}
	*/
	url;


	/**
	* Rewrite of the URL where the absolute URL has been removed in place of a relative path, assuming the owner project is active
	* This is used to direct to the edit/view/download UI when the files project is active and is usually used in place of URL for TERA related operations
	* @type {String}
	*/
	teraUrl;


	/**
	* An object representing meta file parts of a file name
	* @type {Object}
	* @property {String} basename The filename + extention (i.e. everything without directory name)
	* @property {String} filename The file portion of the name (basename without the extension)
	* @property {String} ext The extension portion of the name (always lower case)
	* @property {String} dirName The directory path portion of the name
	*/
	parsedName;


	/**
	* A date representing when the file was created
	* @type {Date}
	*/
	created;


	/**
	* A human readable, formatted version of "created"
	* @type {String}
	*/
	createdFormatted;


	/**
	* A date representing when the file was created
	* @type {Date}
	*/
	modified;


	/**
	* A human readable, formatted version of "modified"
	* @type {String}
	*/
	modifiedFormatted;


	/**
	* A date representing when the file was last accessed
	* @type {Date}
	*/
	accessed;


	/**
	* A human readable, formatted version of "accessed"
	* @type {String}
	*/
	accessedFormatted;


	/**
	* Size, in bytes, of the file
	* @type {Number}
	*/
	size;


	/**
	* A human readable, formatted version of the file size
	* @type {String}
	*/
	sizeFormatted;


	/**
	* The associated mime type for the file
	* @type {String}
	*/
	mime;


	/**
	* Additional meta information for the file
	* @type {Object}
	*/
	meta = {};


	/**
	* ProjectFile constructor
	* Takes the input basic file type from Supabase and adds additional formatted fields
	* @param {SupabaseFile} baseFile The basic Supabase file to extend
	* @param {TeraFyClient} baseFile.tera The associated TeraFyClient instance to use for some file methods
	*/
	constructor(baseFile) {
		if (!baseFile.tera) throw new Error('Basic file requires a `tera` key to access the Tera instance');
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
		this.teraUrl = this.url.replace(/^https?:\/\/(?:.+?)\/projects\/(?:.+?)\/project\/(.+)$/, '/project/$1');

		// Set all `*Formatted` fields
		this.sizeFormatted = filesize(this.size || 0, {spacer: ''});
		this.createdFormatted = this.created ? this.created.toLocaleDateString() : 'Unknown created date';
		this.modifiedFormatted = this.modified ? this.modified.toLocaleDateString() : 'Unknown modified date';
		this.accessedFormatted = this.accessed ? this.accessed.toLocaleDateString() : 'Unknown access date';
	}


	/**
	* Fetch the raw file contents as a Blob
	*
	* @param {Object} [options] Additioanl options to mutate behaviour
	*
	* @returns {Blob} The eventual raw file contents as a Blob
	*
	* @see getProjectFile()
	*/
	getContents(options) {
		return this._tera.getProjectFileContents(this.id, options);
	}


	/**
	* Overwrite the contents of a file with new content
	*
	* @param {File|Blob|FormData|Object|Array} contents The new file contents
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*
	* @see setProjectFileContents()
	*/
	setContents(contents) {
		return this._tera.setProjectFileContents(this.id, contents);
	}


	/**
	* Fetch the file contents as an array of Reflib refs
	*
	* @returns {Promise<Array<Ref>>} An eventual array of RefLib references
	*
	* @see getProjectLibrary()
	*/
	getRefs() {
		return this._tera.getProjectLibrary(this.id);
	}


	/**
	* Overwrite the contents of a file with a new collection of Reflib refs
	*
	* @param {Array<RefLibRef>} refs Collection of references for the selected library
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*
	* @see setProjectLibrary()
	*/
	setRefs(refs) {
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
	*
	* @param {Object} data An input object created via `ProjectFiles.serialize()`
	* @returns {ProjectFile} A ProjectFile instance setup against the deserializzed data
	*/
	static deserialize(data) {
		return new ProjectFile(pick(data, [
			'tera',
			'id',
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
		]));
	}
}
