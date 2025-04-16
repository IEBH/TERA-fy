import { DocumentReference, Firestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';
import { BoundSupabaseyFunction } from '@iebh/supabasey';
interface ReactiveWrapper<T = any> {
    doc: T;
    setState: (newState: T) => void;
    getState: () => T;
    watch: (cb: (newState: T) => void) => void;
}
interface PathSplitResult {
    fsCollection: string;
    fsId: string;
    entity: string;
    id: string;
    relation?: string;
}
/**
* @class Syncro
* TERA Isomorphic Syncro class
* Slurp an entity from Supabase and hold it in Firebase/Firestore as a "floating" entity which periodically gets flushed back to Supabase and eventually completely cleaned up
* This class tries to be as independent as possible to help with adapting it to various front-end TERA-fy plugin frameworks
*/
export default class Syncro {
    /**
    * Firebase instance in use
    *
    * @type {FirebaseApp}
    */
    static firebase: FirebaseApp;
    /**
    * Firestore instance in use
    *
    * @type {Firestore}
    */
    static firestore: Firestore;
    /**
    * Supabasey instance in use
    *
    * @type {Supabasey}
    */
    static supabasey: BoundSupabaseyFunction;
    /**
    * The current user session, should be unique for the user + browser tab
    * Used by the heartbeat system
    *
    * @type {String}
    */
    static session: string | undefined;
    /**
    * OPTIONAL SyncroEntiries from './entiries.js' if its required
    * This only gets populated if `config.forceLocalInit` is truthy and we've mounted at least one Syncro
    *
    * @type {Record<string, any>}
    */
    static SyncroEntities: Record<string, any>;
    /**
    * This instances fully formed string path
    *
    * @type {String}
    */
    path: string;
    /**
    * The Firestore docHandle when calling various Firestore functions
    *
    * @type {DocumentReference | undefined}
    */
    docRef: DocumentReference | undefined;
    /**
    * The reactive object managed by this Syncro instance
    * The nature of this varies by framework and what `getReactive()` provides
    *
    * @type {any}
    */
    value: any;
    /**
    * Default throttle to apply for writes
    *
    * @type {Number} Throttle time in milliseconds
    */
    throttle: number;
    /**
    * Various Misc config for the Syncro instance
    *
    * @type {Object}
    * @property {Number} heartbeatinterval Time in milliseconds between heartbeat beacons
    * @property {String} syncroRegistryUrl The prefix Sync worker URL, used to populate Syncros and determine their active status
    * @property {Object} context Additional named parameters to pass to callbacks like initState
    */
    config: {
        heartbeatInterval: number;
        syncroRegistryUrl: string;
        context: Record<string, any>;
    };
    /**
    * Whether the next heartbeat should be marked as 'dirty'
    * This indicates that at least one change has occured since the last hearbeat and the server should perform a flush (but not a clean)
    * This flag is only transmitted once in the next heartbeat before being reset
    *
    * @see markDirty()
    * @type {Boolean}
    */
    isDirty: boolean;
    /**
    * @interface
    * Debugging printer for this instance
    * Defaults to doing nothing
    *
    * @param {*...} [msg] The message to output
    */
    debug(...msg: any[]): void;
    /**
    * @interface
    * Debugging printer specifically for error messages
    * Defaults to using console.log()
    *
    * @param {*...} [msg] The message to output
    */
    debugError(...msg: any[]): void;
    /**
    * Instance constructor
    *
    * @param {String} path Mount path for the Syncro. Should be in the form `${ENTITY}::${ID}(::${RELATION})?`
    * @param {Object} [options] Additional instance setters (mutates instance directly), note that the `config` subkey is merged with the existing config rather than assigned
    */
    constructor(path: string, options?: any);
    /**
    * Instance destruction trigger
    * This will unsubscribe from various facilities and release the object for cleanup
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    destroy(): Promise<any[]>;
    /**
    * Actions to preform when we are destroying this instance
    * This is an array of function callbacks to execute in parallel when `destroy()` is called
    *
    * @type {Array<() => void>}
    */
    _destroyActions: Array<() => void>;
    /**
    * Function to return whatever the local framework uses as a reactive object
    * This should respond with an object of mandatory functions to watch for changes and remerge them
    *
    * @param {Object} value Initial value of the reactive
    *
    * @returns {ReactiveWrapper} A reactive object prototype
    * @property {Object} doc The reactive object
    * @property {Function} setState Function used to overwrite the default state, called as `(newState:Object)`
    * @property {Function} getState Function used to fetch the current snapshot state, called as `()`
    * @property {Function} watch Function used to set up state watchers, should call its callback when a change is detected, called as `(cb:Function)`
    */
    getReactive(value: any): ReactiveWrapper;
    /**
    * Returns the split entity + ID relationship from a given session path
    * This funciton checks for valid UUID format strings + that the entity is a known/supported entity (see `knownEntities`)
    * NOTE: When used by itself (i.e. ignoring response) this function can also act as a guard that a path is valid
    *
    * INPUT: `widgets::UUID` -> `{entity:'widgets', id:UUID}`
    * INPUT: `widgets::UUID::thing` -> `{entity:'widgets', id:UUID, relation:'thing'}`
    *
    * @param {String} path The input session path of the form `${ENTITY}::${ID}`
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.allowAsterisk=false] Whether to allow the meta asterisk character when recognising paths, this is used by the SyncroKeyed class
    *
    * @returns {PathSplitResult} An object composed of the session path components
    */
    static pathSplit(path: string, options?: any): PathSplitResult;
    /**
    * Convert local POJO -> Firestore compatible object
    * This applies the following mutations to the incoming object:
    *
    * 1. Arrays are converted to Objects (Firestore cannot store nested arrays)
    * 2. All non-POJO objects (e.g. Dates) to a symetric object
    *
    * @param {Object} snapshot The current state to convert
    * @returns {Object} A Firebase compatible object
    */
    static toFirestore(snapshot?: any): any;
    /**
    * Convert local Firestore compatible object -> local POJO
    * This reverses the mutations listed in `toFirestore()`
    *
    * @param {Object} snapshot The raw Firebase state to convert
    * @returns {Object} A JavaScript POJO representing the converted state
    */
    static fromFirestore(snapshot?: any): any;
    /**
    * Convert a raw POJO into Firestore field layout
    * Field structures are usually consumed by the Firestore ReST API and need converting before being used
    * NOTE: This does not serialize the incoming data so you likely want to use this as `toFirestoreFields(toFirestore(data))`
    *
    * @see https://stackoverflow.com/a/62304377
    * @param {Object} data The raw value to convert
    * @returns {Object} A Firestore compatible, typed data structure
    */
    static toFirestoreFields(data: any): Record<string, any>;
    /**
    * Convert a Firestore field dump into a native POJO
    * Field structures are usually provided by the Firestore ReST API and need de-typing back into a native document
    * NOTE: This does not deserialize the result so you likely want to use this as `fromFirestore(fromFirestoreFields(response.fields))`
    *
    * @see https://stackoverflow.com/a/62304377
    * @param {Object} fields The raw Snapshot to convert
    * @returns {Object} A JavaScript POJO representing the converted state
    */
    static fromFirestoreFields(fields?: any): any;
    /**
    * Perform a one-off fetch of a given Syncro path
    *
    * @param {String} path The Syncro entity + ID path. Takes the form `ENTITY::ID`
    *
    * @returns {Promise<Object|Null>} An eventual snapshot of the given path, if the entity doesn't exist null is returned
    */
    static getSnapshot(path: string): Promise<any | null>;
    /**
    * Perform a one-off set/merge operation against
    *
    * @param {String} path The Syncro entity + ID path. Takes the form `ENTITY::ID`
    * @param {Object} state The new state to set/merge
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {'merge'|'set'} [options.method='merge'] How to apply the new state. 'merge' (merge in partial data to an existing Syncro), 'set' (overwrite the entire Syncro state)
    *
    * @returns {Promise<*>} The state object after it has been applied
    */
    static setSnapshot(path: string, state: any, options?: {
        method?: 'merge' | 'set';
    }): Promise<any>;
    /**
    * Mount the remote Firestore document against this Syncro instance
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Object} [options.initalState] State to use if no state is already loaded, overrides the entities own `initState` function fetcher
    * @param {Number} [options.retries=3] Number of times to retry if a mounted Syncro fails its sanity checks
    * @returns {Promise<Syncro>} A promise which resolves as this syncro instance when completed
    */
    mount(options?: any): Promise<Syncro>;
    /**
    * Merge a single or multiple values into a Syncro data object
    * NOTE: Default behaviour is to flush (if any changes apply), use direct object mutation or disable with `flush:false` to disable
    *
    * @param {String|Object} key Either the single named key to set OR the object to merge
    * @param {*} [value] The value to set if `key` is a string
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.delta=true] Only merge keys that differ, skipping flush if no changes are made
    * @param {Boolean} [options.flush=true] Send a flush signal that Firebase should sync to Supabase on changes
    * @param {Boolean} [options.forceFlush=false] Flush even if no changes were made
    * @param {Boolean} [options.flushDestroy=false] Destroy the Syncro after flushing
    *
    * @returns {Promise<Syncro>} A promise which resolves with this Syncro instance on completion
    */
    set(key: string | object, value: any, options: {
        delta?: boolean;
        flush?: boolean;
        forceFlush?: boolean;
        flushDestroy?: boolean;
    }): Promise<this>;
    /**
    * Schedule Syncro heartbeats
    * This populates the `sync` presence meta-information
    *
    * @param {Boolean} [enable=true] Whether to enable heartbeating
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.immediate=false] Fire a heartbeat as soon as this function is called, this is only really useful on mount
    */
    setHeartbeat(enable?: boolean, options?: any): Promise<void> | void;
    /**
    * Perform one heartbeat pulse to the server to indicate presense within this Syncro
    * This function is automatically called by a timer if `setHeartbeat(true)` (the default behaviour)
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    heartbeat(): Promise<void>;
    /**
    * Utility function to directly set this documents firestore state
    *
    * @param {Object} state The state to set / merge
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {'merge'|'set'} [options.method='merge'] How to apply the new state. 'merge' (merge in partial data to an existing Syncro), 'set' (overwrite the entire Syncro state)
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    setFirestoreState(state: any, options?: {
        method?: 'merge' | 'set';
    }): Promise<void>;
    /**
    * Utility method to fetch the Firestore state for this Syncro
    * NOTE: This directly extracts the state of the Firestore, not its wrapping doc object returned by `FirestoreGetDoc`
    *
    * @returns {Promise<Object>} A promise which resolves to the Firestore state
    */
    getFirestoreState(): Promise<any>;
    /**
    * Set the Syncro dirty flag which gets passed to the server on the next heartbeat
    *
    * @see isDirty
    * @returns {Syncro} This chainable Syncro instance
    */
    markDirty(): this;
    /**
    * Force the server to flush state
    * This is only really useful for debugging as this happens automatically anyway
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.destroy=false] Instruct the server to also dispose of the Syncro state
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    flush(options?: any): Promise<void | null>;
    /**
    * Timer handle for heartbeats
    *
    * @type {any}
    */
    _heartbeatTimer: any;
}
/**
* Build a chaotic random tree structure based on dice rolls
* This funciton is mainly used for sync testing
*
* @param {Number} [depth=0] The current depth we are starting at, changes the nature of branches based on probability
*
* @returns {*} The current branch conotents
*/
export declare function randomBranch(depth?: number): any;
export {};
