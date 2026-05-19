/**
* A raw JSON compatible object representing a file
* This object can be expanded into a TERAFile instance via `new TERAFile(...data)`
*
* @typedef {Object} TERAFileRaw
* @type {Object}
*
* @property {String} path The relative path of the file, usually of the format `/:entity/:id/:dir?/:name`
* @property {String} [icon] CSS class to use as the file icon
* @property {String} created File creation ISO-8601 date string
* @property {String} modified File modified ISO-8601 date string
* @property {String} [accessed] File accessed ISO-8601 date string
* @property {Number} size Size, in bytes, of the file
* @property {String} [mime] The MIME time of the file
* @property {Boolean} isFolder Whether the file is a folder or a regular binary file
* @property {Object} meta Optional meta information attached to the file, object will always exist but may be empty
*/
