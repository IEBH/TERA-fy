import { filesize } from 'filesize';
import { pick, omit } from 'lodash-es';
import type TeraFy from './terafy.client.js';

// TODO: Refactor terafy.client.ts so that we don't need to extend the class with injected functions
interface TeraClient extends TeraFy {
	getProjectFileContents: (id: any, options?: any) => any
	setProjectFileContents: (id: any, contents: any, options?: any) => any
	getProjectLibrary: (id: any, options?: any) => any
	setProjectLibrary: (id: any, refs:any, options?: any) => any
};
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
	_tera!: TeraClient;


	/**
	* The TERA compatible unique ID of the file
	* NOTE: This is computed each time from the Base64 of the file path
	* @type {String}
	*/
	id!: string;


	/**
	* The raw Supabase UUID of the file
	* @type {String}
	*/
	sbId!: string;


	/**
	* Relative name path (can contain prefix directories) for the human readable file name
	* @type {String}
	*/
	name!: string;


	/**
	* CSS class to use as the file icon
	* @type {String}
	*/
	icon!: string;


	/**
	* Full path to the file
	* This is also used as the unique identifier within the project
	* @type {String}
	*/
	path!: string;


	/**
	* Fully qualified URL to view / access / download the file from TERA
	* This will usually open an edit UI within the TERA site
	* @type {String}
	*/
	url!: string;


	/**
	* Rewrite of the URL where the absolute URL has been removed in place of a relative path, assuming the owner project is active
	* This is used to direct to the edit/view/download UI when the files project is active and is usually used in place of URL for TERA related operations
	* @type {String}
	*/
	teraUrl!: string;


	/**
	* An object representing meta file parts of a file name
	* @type {Object}
	* @property {String} basename The filename + extention (i.e. everything without directory name)
	* @property {String} filename The file portion of the name (basename without the extension)
	* @property {String} ext The extension portion of the name (always lower case)
	* @property {String} dirName The directory path portion of the name
	*/
	// Using 'any' for simplicity, define an interface for better type safety if desired
	parsedName: any;


	/**
	* A date representing when the file was created
	* @type {Date}
	*/
	// Using Date | undefined because constructor checks if it exists
	created: Date | undefined;


	/**
	* A human readable, formatted version of "created"
	* @type {String}
	*/
	createdFormatted!: string;


	/**
	* A date representing when the file was created
	* @type {Date}
	*/
	// Using Date | undefined because constructor checks if it exists
	modified: Date | undefined;


	/**
	* A human readable, formatted version of "modified"
	* @type {String}
	*/
	modifiedFormatted!: string;


	/**
	* A date representing when the file was last accessed
	* @type {Date}
	*/
	// Using Date | undefined because constructor checks if it exists
	accessed: Date | undefined;


	/**
	* A human readable, formatted version of "accessed"
	* @type {String}
	*/
	accessedFormatted!: string;


	/**
	* Size, in bytes, of the file
	* @type {Number}
	*/
	// Using number | undefined because constructor uses `|| 0`
	size: number | undefined;


	/**
	* A human readable, formatted version of the file size
	* @type {String}
	*/
	sizeFormatted!: string;


	/**
	* The associated mime type for the file
	* @type {String}
	*/
	mime!: string;


	/**
	* Additional meta information for the file
	* @type {Object}
	*/
	// Using Record<string, any> for a generic object, adjust if meta has a known structure
	meta: Record<string, any> = {};

	/**
	 * Whether this is a folder or not
	 */
	isFolder!: boolean;

	/**
	 * If it is a folder, it will have an array of files in the folder
	 */
	files?: ProjectFile[];

	/**
	* ProjectFile constructor
	* Takes the input basic file type from Supabase and adds additional formatted fields
	* @param {SupabaseFile} baseFile The basic Supabase file to extend
	* @param {TeraFyClient} baseFile.tera The associated TeraFyClient instance to use for some file methods
	*/

	constructor(baseFile: SupabaseFile) {
		// Note: baseFile.tera is assumed to exist based on the check below and the SupabaseFile type definition above
		if (!baseFile.tera) throw new Error('Basic file requires a `tera` key to access the Tera instance');
		Object.assign(this, omit(baseFile, 'encodeIdFunction')); // don't copy encodeIdFunction

		// Check whether encodeIdFunction exists and if it does then parse the id
		if (baseFile.encodeIdFunction && typeof baseFile.encodeIdFunction === 'function') {
			this.id = baseFile.encodeIdFunction(this.id);
		}

		// Translate baseFile.tera -> this._tera (non-enumerable, non-configurable)
		const tera = (this as any).tera;
		Object.defineProperty(this, '_tera', {
			enumerable: false,
			configurable: false,
			get() {
				// NOTE: We can't just set {value:tera} as it upsets how Vue uses proxies
				return tera;
			},
		});

		delete (this as any).tera; // Remove original ref we merged above

		// Ensure date properties are actual Date objects, not strings.
		// This makes the class resilient to the format of the input data.
		if (this.created && typeof this.created === 'string') {
			this.created = new Date(this.created);
		}
		if (this.modified && typeof this.modified === 'string') {
			this.modified = new Date(this.modified);
		}
		if (this.accessed && typeof this.accessed === 'string') {
			this.accessed = new Date(this.accessed);
		}

		if (this.isFolder) {
			// Process all files in the folder
			this.files = this.files?.map(file => {
				let path = file.path.split(/\//).slice(3).join('/');
				let url = this.url + '/' + file.name // Add file name to url
				// Parse url to show library instead of download if reflib file
				if (file.meta.reflib) {
					url = url.replace(/\/project\/download\//, '/project/library/');
				}
				return new ProjectFile({
					tera: this._tera,
					...file,
					sbId: file.id, // Sash the original Supabase ID under sbId
					id: file.path,
					encodeIdFunction: baseFile.encodeIdFunction,
					path,
					url,
				})
			})
		}

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

	getContents(options?: any): Promise<Blob> {
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

	setContents(contents: File | Blob | FormData | object | any[]): Promise<void> {
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

	getRefs(): Promise<Array<RefLibRef>> {
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

	setRefs(refs: Array<RefLibRef>): Promise<void> {
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

	serialize(): Partial<ProjectFile> { // Using Partial<ProjectFile> as it returns a subset
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

	static deserialize(data: any): ProjectFile {
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