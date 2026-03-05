/**
* General path setters / getters for project state
* These are _MAINLY_ wrappers for Lodash functionality such as Lodash.set() / Lodash.get(), any deviations are documented inline
*
* In each case these functions work with either dotted or array notation against a target master-object
*     - Dotted notation - e.g. `foo.bar.1.baz`
*     - Array path segments e.g. `['foo', 'bar', 1, 'baz']`
*/
/**
* Internal recursive path setter
*
* Conflict strategies (copied from utils/pathTools @ `set()`)
*     - 'set' / 'overwrite' - Just overwrite any existing value
*     - 'merge' - Merge existing values using Lodash.merge()
*     - 'defaults' - Merge existing values using Lodash.defaultsDeep()
*
* @param {Object} target The target to operate on
* @param {String|Array} path The path within the target to set, in dotted or array notation
* @param {*} value The value to set
* @param {Object} [options] Additional options to mutate behaviour
* @param {'set'|'overwrite'|'merge'|'defaults'} [options.strategy='set'] How to handle an existing value, if any
*
* @returns {*} The set value
*/
export declare function set(target: any, path: string | (string | number)[], value: any, options?: any): any;
/**
* Internal recursive path fetcher
*
* @param {Object} target The target to examine
* @param {String|Array} path The path within the target to fetch, in dotted or array notation
* @param {*} [fallback] Optional fallback to return if the end point does not exist
* @returns {*} The fetched value
*/
export declare function get(target: any, path: string | (string | number)[], fallback?: any): any;
/**
* Internal recursive path checker
*
* @param {Object} target The target to examine
* @param {String|Array} path The path within the target, to fetch in dotted or array notation
* @returns {Boolean} True if the given path already exists within the subject
*/
export declare function has(target: any, path: string | (string | number)[]): boolean;
/**
* Internal recursive path merger
*
* @param {Object} target The target to operate on, this is likly to be mutated
* @param {String|Array} path The path within the target to merge, in dotted or array notation
* @param {*} value The value to merge
*
* @returns {*} The merged value
*/
export declare function merge(target: any, path: string | (string | number)[], value: any): any;
/**
* Internal recursive path defaulter
*
* @param {Object} target The target to operate on, this is likly to be mutated
* @param {String|Array} [path] The path within the target to merge, in dotted or array notation
* @param {*} value The value to merge
*
* @returns {*} The resulting object with defaults applied
*/
export declare function defaults(target: any, path: string | (string | number)[], value?: any): any;
declare const _default: {
    set: typeof set;
    get: typeof get;
    has: typeof has;
    merge: typeof merge;
    defaults: typeof defaults;
};
export default _default;
