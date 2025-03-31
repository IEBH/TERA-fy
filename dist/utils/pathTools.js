import { defaultsDeep as _defaults, get as _get, has as _has, merge as _merge, set as _set, } from 'lodash-es';
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
export function set(target, path, value, options) {
    let settings = {
        strategy: 'overwrite',
        ...options,
    };
    // Fetch the existing value if the strategy calls for it
    let hasExistingValue = ['merge', 'defaults'].includes(settings.strategy)
        ? has(target, path)
        : undefined;
    switch (settings.strategy) {
        case 'set':
        case 'overwrite':
            _set(target, path, value);
            break;
        case 'merge':
            if (hasExistingValue) {
                merge(target, path, value);
            }
            else {
                _set(target, path, value);
            }
            break;
        case 'defaults':
            defaults(target, path, value);
            break;
        default:
            throw new Error(`Unknown conflict resolution strategy "${settings.strategy}"`);
    }
    return value;
}
/**
* Internal recursive path fetcher
*
* @param {Object} target The target to examine
* @param {String|Array} path The path within the target to fetch, in dotted or array notation
* @param {*} [fallback] Optional fallback to return if the end point does not exist
* @returns {*} The fetched value
*/
export function get(target, path, fallback) {
    return _get(target, path, fallback);
}
/**
* Internal recursive path checker
*
* @param {Object} target The target to examine
* @param {String|Array} path The path within the target, to fetch in dotted or array notation
* @returns {Boolean} True if the given path already exists within the subject
*/
export function has(target, path) {
    return _has(target, path);
}
/**
* Internal recursive path merger
*
* @param {Object} target The target to operate on, this is likly to be mutated
* @param {String|Array} path The path within the target to merge, in dotted or array notation
* @param {*} value The value to merge
*
* @returns {*} The merged value
*/
export function merge(target, path, value) {
    // @ts-ignore
    _merge(get(target, path), value);
    return value;
}
/**
* Internal recursive path defaulter
*
* @param {Object} target The target to operate on, this is likly to be mutated
* @param {String|Array} [path] The path within the target to merge, in dotted or array notation
* @param {*} value The value to merge
*
* @returns {*} The resulting object with defaults applied
*/
export function defaults(target, path, value) {
    if (typeof path == 'string' || Array.isArray(path)) { // Called as (target, path, value)
        if (!has(target, path)) { // Target path doesn't exist at all
            return set(target, path, value, undefined);
        }
        else { // Target path exists - apply Lodash defaults
            return _defaults(get(target, path), value);
        }
    }
    else { // Called as (target, value)
        // @ts-ignore
        return _defaults(target, path);
    }
}
// Export all functions as a lookup object
export default {
    set,
    get,
    has,
    merge,
    defaults,
};
//# sourceMappingURL=pathTools.js.map