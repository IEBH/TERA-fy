import {filesize} from 'filesize';

/**
* A project file fetched from TERA
* @class ProjectFile
*/
export default class ProjectFile {

	/**
	* Parent TeraClient instance used by all helper functions
	* @param {TeraClient}
	*/
	tera;


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
	* Full path to the file
	* This is also used as the unique identifier within the project
	* @type {String}
	*/
	path;


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
	* ProjectFile constructor
	* Takes the input basic file type from Supabase and adds additional formatted fields
	* @param {SupabaseFile} baseFile The basic Supabase file to extend
	*/
	constructor(baseFile) {
		if (!baseFile.tera) throw new Error('Basic file requires a `tera` key to access the Tera instance');
		Object.assign(this, baseFile);

		// Set all `*Formatted` fields
		this.sizeFormatted = filesize(this.size || 0, {spacer: ''});
		this.createdFormatted = this.created ? this.created.toLocaleDateString() : 'Unknown created date';
		this.modifiedFormatted = this.modified ? this.modified.toLocaleDateString() : 'Unknown modified date';
		this.accessedFormatted = this.accessed ? this.accessed.toLocaleDateString() : 'Unknown access date';
	}


	/**
	* Fetch the raw file contents as a Blob
	*
	* returns {Blob} The eventual raw file contents as a Blob
	*
	* @see getProjectFile()
	*/
	getContents() {
		return this.tera.getProjectFile(this.path);
	}


	/**
	* Overwrite the contents of a file with new content
	*
	* @param {File|Blob|FormData|Object|Array} contents The new file contents
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*
	* @see setProjectFile()
	*/
	setContents(contents) {
		return this.tera.setProjectFile(this.path, contents);
	}


	/**
	* Fetch the file contents as an array of Reflib refs
	*
	* @returns {Promise<Array<Ref>>} An eventual array of RefLib references
	*
	* @see getProjectLibrary()
	*/
	getRefs() {
		return this.tera.getProjectLibrary(this.path);
	}


	/**
	* Overwrite the contents of a file with a new collection of Reflib refs
	*
	* @param {Array<RefLibRef>} Collection of references for the selected library
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*
	* @see setProjectLibrary()
	*/
	setRefs(refs) {
		return this.tera.setProjectLibrary(this.path, refs);
	}
}
