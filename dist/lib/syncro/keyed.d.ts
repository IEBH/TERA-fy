import Syncro from './syncro.js';
interface FlushOptions {
    destroy?: boolean;
}
/**
* @class SyncroKeyed
* TERA Isomorphic SyncroKeyed class
* Collate a single (potencially very large) single Syncro object by spltting it acrtoss multiple Syncros
* This makes the assumption that the Syncro content is a large object collection of objects - a keyed map collection
* The original impetus is to allow TERA citation libraries to be held in a Syncro object and flushed back to Supabase when editing has completed
*/
export default class SyncroKeyed extends Syncro {
    /**
    * Config used by this instance to configure behaviour
    *
    * @type {Object}
    * @property {Number} maxKeys The maximum number of keys a member can contain before needing to add a member
    */
    keyedConfig: {
        maxKeys: number;
    };
    /**
    * Various storage about keyed path
    */
    keyedPath: {
        getKey(path: string, index: number): string;
    };
    /**
    * Member Syncros which form part of this meta Syncro
    *
    * @type {Array<Syncro>}
    */
    members: Syncro[];
    /**
    * Instance constructor
    *
    * @param {String} path Mount path for the Syncro. Should be in the form `${ENTITY}::${ID}(::${RELATION})?_*` (must contain a '*' operator)
    * @param {Object} [options] Additional instance setters (mutates instance directly)
    */
    constructor(path: string, options?: Record<string, any>);
    /**
    * Destroy all Syncro members
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    destroy(): Promise<never[]>;
    /**
    * Mount this SyncroKeyed instance
    * i.e. Fetch all members and mount them locally creating a Proxy
    *
    * @returns {Promise<Syncro>} A promise which resolves as this SyncroKeyed instance when completed
    */
    mount(): Promise<Syncro>;
    /**
    * Return a Proxy which will map setter/getter actions to their correct member
    *
    * @returns {Proxy} A proxy of all combined members
    */
    proxy(): Record<string | symbol, any>;
    /**
    * Flush all member states
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.destroy=false] Instruct the server to also dispose of the Syncro state
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    flush(options?: FlushOptions): Promise<void>;
    /**
    * Set a given key against the next available member
    * This will either pick the next available member with keys below `config.maxKeys` or extend the member array and append to it
    *
    * @param {String} key The key to set
    * @param {*} value The value to set
    *
    * @returns {Promise<*>} A promise which resolves when the operation has completed with the set value
    */
    keyedSet(key: string, value: any): Promise<any>;
    /**
    * Assign an entire in-memory object to members
    * This can be thought of as the optimized equivelent of Object.assign()
    * Use this when merging large objects as it can make optimizations
    *
    * @param {Object} state The value to merge
    */
    keyedAssign(state: Record<string, any>): Promise<void>;
    /**
    * Extend the member pool by one member
    *
    * @param {Number} [index] The index to use when expanding, if omitted the next index offset is used
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    keyedMembersExpand(index?: number): Promise<void>;
}
export {};
