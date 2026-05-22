import {filesize} from 'filesize';
import {omit} from 'lodash-es';


/**
* A file fetched from TERA
* These are usually associated with Projects
*
* @class ProjectFile
*/
export default class TERAFile {

	/**
	* Parent TeraClient instance used by helper functions
	* This may be empty if the class was instanciated without a TERAClient
	*
	* @private
	* @type {TeraClient}
	*/
	_tera;


	/**
	* Settings used to perform various actions
	*
	* @type {Object}
	* @property {String} ioUrl The base URL for the tera-io worker, will use $infra.workerUrls.io if present, otherwise falls back to the live TERA site
	*/
	settings = {
		ioUrl: 'https://tera-tools.com/api/io',
	};


	/**
	* Raw data returned from the tera-io endpoint
	* This is usually transformed by getters/setters into something useful
	* Ideally you do NOT want to access this directly
	*
	* @private
	* @type {TERAFileRaw}
	*/
	_data;


	/**
	* Wrapper around _tera which throws if the instance is not available
	*
	* @returns {TERAClient}
	*/
	get tera() {
		if (!this._tera) throw new Error('TERAFile.tera<TERAClient> not available');
		return this._tera;
	}


	/**
	* Format a date into a Human Readable string
	*
	* @param {Date|String|Number} inputDate Either a native JS-Date object, an ISO-8601 string or a JS-Unix Epoch to format into one
	* @returns {String} Human readable version of the date
	*/
	static formatDate(inputDate) {
		return (
			inputDate instanceof Date ? inputDate
			: typeof inputDate == 'string' ? new Date(inputDate)
			: isFinite(inputDate) ? new Date(inputDate) // eslint-disable-line unicorn/prefer-number-properties
			: (()=> { throw new Error('Invalid input date type') })()
		).toLocaleString();
	}


	/**
	* The Entity type the file coresponds with
	* This is usually a plural noun like 'projects', 'users' etc.
	*
	* @returns {String}
	*/
	get entity() {
		return this._data.entity;
	}


	/**
	* The ID fo the entity this file coresponds with
	* This is usually a UUID
	*
	* @returns {String}
	*/
	get entityId() {
		return this._data.entityId;
	}


	/**
	* The relative path of the file
	* This usually corresponds to `:dir?/:name?`
	*
	* @returns {String} The relative file path + name within the entity+id storage
	*/
	get path() {
		return this._data.path;
	}


	/**
	* The human readable filename - the same as a basename
	*
	* @returns {String}
	*/
	get name() {
		return this._data.name;
	}


	/**
	* CSS class to use as the file icon
	*
	* @returns {String}
	*/
	get icon() {
		return this._data.icon;
	}


	/**
	* JS-Date object representing the creation time of a file
	*
	* @returns {Date} Native JS-Date representing the creation date/time of the file
	*/
	get created() {
		return new Date(this._data.created);
	}


	/**
	* A human readable, formatted version of "created"
	*
	* @returns {String} Formatted version of "created"
	*/
	get createdFormatted() {
		return TERAFile.formatDate(this._data.created);
	}


	/**
	* JS-Date object representing the modification time of a file
	*
	* @returns {Date} Native JS-Date representing the last modified date/time of the file
	*/
	get modified() {
		return new Date(this._data.modified);
	}


	/**
	* A human readable, formatted version of "modified"
	*
	* @returns {String} Formatted version of "modified"
	*/
	get modifiedFormatted() {
		return TERAFile.formatDate(this._data.modified);
	}


	/**
	* JS-Date object representing the last access time time of a file
	*
	* @returns {Date} Native JS-Date representing the last access date/time of the file
	*/
	get accessed() {
		return new Date(this._data.accessed);
	}


	/**
	* A human readable, formatted version of "accessed"
	*
	* @returns {String} Formatted version of "accessed"
	*/
	get accessedFormatted() {
		return TERAFile.formatDate(this._data.accessed);
	}


	/**
	* The size, in bytes, of the file
	*
	* @returns {Number}
	*/
	get size() {
		return this._data.size;
	}


	/**
	* Formatted size as a human readable string
	*
	* @returns {String} Human readable version of `size`
	*/
	get sizeFormatted() {
		return filesize(this._data.size ?? 0, {spacer: ''});
	}


	/**
	* The MIME type of the file
	*
	* @returns {String} The files MIME type
	*/
	get mime() {
		return this._data.mime;
	}


	/**
	* Whether the file is a folder or a regular binary file
	*
	* @type {Boolean}
	*/
	get isFolder() {
		return this._data.isFolder;
	}


	/**
	* TERAFile constructor
	* This will take a `tera` instance + an object which will be expanded into `raw`
	*
	* @param {TERAFileRaw} base Base file data to create the object from + `tera` key
	* @param {TERAClient} base.client TERA instance to use for file functionality
	*/
	constructor(base) {
		if (base.tera) this._tera = base.tera;

		// Populate raw data
		this._data = omit(base, 'tera');

		// Check raw data
		['url', 'modified', 'size'].forEach(key => {
			if (this._data[key] === undefined) throw new Error(`new TERAFile(...) requires key "${key}"`);
		});

		// Check URL looks valid
		let urlPieces = /^https:\/\/tera-tools\.com\/api\/io\/(?<entity>[^\/]+)\/(?<entityId>[0-9a-f\-]+?)\/files\/(?<path>.+?)$/.exec(base.url)?.groups;
		if (!urlPieces) throw new Error('Untable to parse File URL - check this is a TERA file');
		this._data.entity = urlPieces.entity;
		this._data.entityId = urlPieces.entityId;

		// Populate out defaults if we dont already have any
		this._data.icon ||= 'far fa-file'; // Generic fallback icon
		this._data.mime ||= 'application/octet-stream'; // Fallback mimetype
		this._data.isFolder = !!base.isFolder; // Force isFolder to be a boolean
		this._data.meta ||= {}; // Cast meta information store to an object
	}


	/**
	* Fetch the raw file contents as a Blob
	*
	* @returns {Promise<Blob>} The eventual raw file contents as a Blob
	*/
	getContents() {
		return Promise.resolve()
			.then(()=> fetch(`${this.settings.ioUrl}/${this.type}/${this.path}`))
			.then(res => res.ok
				? res.blob()
				: Promise.reject(`Unexpected response code ${res.status}: ${res.statusText || '(No error text)'}`)
			)
			.catch(e => {
				throw new Error(`Unable to fetch ${this.path} - ${e.toString()}`, {cause: e});
			})
	}


	/**
	* Overwrite the contents of a file with a Blob
	*
	* @param {File|Blob|FormData|Object|Array} contents The new file contents
	* @param {Object} [meta] Optional meta information to merge
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	setContents(contents, meta) {
		return Promise.resolve()
			.then(()=> {
				let form = new FormData();
				form.append('file', contents);
				if (meta) form.append('meta', JSON.stringify(meta));
				return form;
			})
			.then(form => fetch(`${this.settings.ioUrl}/${this.type}/${this.path}`, {
				method: 'POST',
				body: form,
			}))
			.then(res => res.ok || res.text())
	}


	/**
	* Fetch the file contents as an array of Reflib refs
	*
	* @returns {Promise<Array<ReflibRef>>} An eventual array of RefLib references
	*/
	getRefs() {
		// FIXME: Stub
	}


	/**
	* Overwrite the contents of a file with a new collection of Reflib refs
	*
	* @param {Array<ReflibRef>} refs Collection of references for the selected library
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	setRefs(refs) {
		// FIXME: Stub
	}
}
