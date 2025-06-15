import { isEmpty, cloneDeep, random, sample, throttle, isEqual } from 'lodash-es';
import { doc as FirestoreDocRef, getDoc as FirestoreGetDoc, onSnapshot as FirestoreOnSnapshot, setDoc as FirestoreSetDoc, updateDoc as FirestoreUpdateDoc, } from 'firebase/firestore';
// @ts-ignore
import marshal from '@momsfriendlydevco/marshal';
import { nanoid } from 'nanoid';
import PromiseRetry from 'p-retry';
import { FirebaseError } from 'firebase/app';
/**
* @class Syncro
* TERA Isomorphic Syncro class
* Slurp an entity from Supabase and hold it in Firebase/Firestore as a "floating" entity which periodically gets flushed back to Supabase and eventually completely cleaned up
* This class tries to be as independent as possible to help with adapting it to various front-end TERA-fy plugin frameworks
*/
export default class Syncro {
    /**
    * @interface
    * Debugging printer for this instance
    * Defaults to doing nothing
    *
    * @param {*...} [msg] The message to output
    */
    debug(...msg) { } // eslint-disable-line no-unused-vars
    /**
    * @interface
    * Debugging printer specifically for error messages
    * Defaults to using console.log()
    *
    * @param {*...} [msg] The message to output
    */
    debugError(...msg) {
        console.log(`[Syncro ${this.path}]`, ...msg);
    }
    /**
    * Instance constructor
    *
    * @param {String} path Mount path for the Syncro. Should be in the form `${ENTITY}::${ID}(::${RELATION})?`
    * @param {Object} [options] Additional instance setters (mutates instance directly), note that the `config` subkey is merged with the existing config rather than assigned
    */
    constructor(path, options) {
        /**
        * Default throttle to apply for writes
        *
        * @type {Number} Throttle time in milliseconds
        */
        this.throttle = 250;
        /**
        * Various Misc config for the Syncro instance
        *
        * @type {Object}
        * @property {Number} heartbeatinterval Time in milliseconds between heartbeat beacons
        * @property {String} syncroRegistryUrl The prefix Sync worker URL, used to populate Syncros and determine their active status
        * @property {Object} context Additional named parameters to pass to callbacks like initState
        */
        this.config = {
            heartbeatInterval: 50000, //~= 50s
            syncroRegistryUrl: 'https://tera-tools.com/api/sync',
            context: {},
        };
        /**
        * Whether the next heartbeat should be marked as 'dirty'
        * This indicates that at least one change has occured since the last hearbeat and the server should perform a flush (but not a clean)
        * This flag is only transmitted once in the next heartbeat before being reset
        *
        * @see markDirty()
        * @type {Boolean}
        */
        this.isDirty = false;
        /**
        * Actions to preform when we are destroying this instance
        * This is an array of function callbacks to execute in parallel when `destroy()` is called
        *
        * @type {Array<() => void>}
        */
        this._destroyActions = [];
        this.path = path;
        Object.assign(this, {
            ...options,
            config: {
                ...this.config,
                ...options?.config,
            },
        });
        if (!Syncro.session) // Assign a random session ID if we don't already have one
            Syncro.session = `syncro_${nanoid()}`;
    }
    /**
    * Instance destruction trigger
    * This will unsubscribe from various facilities and release the object for cleanup
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    destroy() {
        this.debug('Destroy!');
        return Promise.all(this._destroyActions
            .map(fn => fn()))
            .then(() => this._destroyActions = []); // Reset list of actions to perform when terminating
    }
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
    getReactive(value) {
        console.warn('Syncro.getReactive has not been subclassed, assuming a POJO response');
        let doc = { ...value };
        return {
            doc,
            setState(state) {
                // Shallow copy all sub keys into existing object (keeping the object pointer)
                Object.entries(state || {})
                    .forEach(([k, v]) => doc[k] = v);
            },
            getState() {
                return cloneDeep(doc);
            },
            watch(cb) {
                // Stub
            },
        };
    }
    ;
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
    static pathSplit(path, options) {
        let settings = {
            allowAsterisk: false,
            ...options,
        };
        let pathMatcher = new RegExp(
        // Compose the patch matching expression - note double escapes for backslashes to avoid encoding as raw string values
        '^'
            + '(?<entity>\\w+?)' // Any alpha-numeric sequence as the entity name (non-greedy capture)
            + '::' // Followed by '::'
            + '(?<id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})' // Followed by a valid lower-case UUID
            + '(?:::(?<relation>[' // Followed by an optional ansi relation
            + '\\w' // Which is any alpha-numeric sequence...
            + '\\-' // ... Including UUID characters
            + (settings.allowAsterisk ? '\\*' : '') // ... and (optionally) an asterisk
            + ']+?))?'
            + '$');
        let extracted = { ...pathMatcher.exec(path)?.groups };
        if (!extracted || !extracted.entity || !extracted.id)
            throw new Error(`Invalid session path syntax "${path}"`);
        if (Syncro.SyncroEntities && !(extracted.entity in Syncro.SyncroEntities))
            throw new Error(`Unsupported entity "${path}" -> Entity="${extracted.entity}"`);
        return {
            entity: extracted.entity,
            id: extracted.id,
            relation: extracted.relation,
            fsCollection: extracted.entity,
            fsId: extracted.relation
                ? `${extracted.id}::${extracted.relation}`
                : extracted.id,
        };
    }
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
    static toFirestore(snapshot = {}) {
        return marshal.serialize(snapshot, {
            circular: false,
            clone: true, // Clone away from the original Vue Reactive so we dont mangle it while traversing
            modules: [
                marshalFlattenArrays,
                ...marshal.settings.modules,
            ],
            stringify: false,
        });
    }
    /**
    * Convert local Firestore compatible object -> local POJO
    * This reverses the mutations listed in `toFirestore()`
    *
    * @param {Object} snapshot The raw Firebase state to convert
    * @returns {Object} A JavaScript POJO representing the converted state
    */
    static fromFirestore(snapshot = {}) {
        return marshal.deserialize(snapshot, {
            circular: false,
            clone: true, // Clone away from original so we don't trigger a loop within Firebase
            modules: [
                marshalFlattenArrays,
                ...marshal.settings.modules,
            ],
            destringify: false,
        });
    }
    /**
    * Convert a raw POJO into Firestore field layout
    * Field structures are usually consumed by the Firestore ReST API and need converting before being used
    * NOTE: This does not serialize the incoming data so you likely want to use this as `toFirestoreFields(toFirestore(data))`
    *
    * @see https://stackoverflow.com/a/62304377
    * @param {Object} data The raw value to convert
    * @returns {Object} A Firestore compatible, typed data structure
    */
    static toFirestoreFields(data) {
        const result = {};
        for (const [key, value] of Object.entries(data)) {
            const type = typeof value;
            if (type === 'string') { // eslint-disable-line unicorn/prefer-switch
                result[key] = { stringValue: value };
            }
            else if (type === 'number') {
                result[key] = { doubleValue: value };
            }
            else if (type === 'boolean') {
                result[key] = { booleanValue: value };
            }
            else if (value === null) {
                result[key] = { nullValue: null };
            }
            else if (Array.isArray(value)) {
                // Need to handle the inner item structure correctly
                result[key] = { arrayValue: { values: value.map(item => {
                            const field = Syncro.toFirestoreFields({ item });
                            return field.item; // Extract the typed value from the temporary {item: ...} structure
                        }) } };
            }
            else if (type === 'object') {
                result[key] = { mapValue: { fields: Syncro.toFirestoreFields(value) } };
            }
        }
        return result;
    }
    /**
    * Convert a Firestore field dump into a native POJO
    * Field structures are usually provided by the Firestore ReST API and need de-typing back into a native document
    * NOTE: This does not deserialize the result so you likely want to use this as `fromFirestore(fromFirestoreFields(response.fields))`
    *
    * @see https://stackoverflow.com/a/62304377
    * @param {Object} fields The raw Snapshot to convert
    * @returns {Object} A JavaScript POJO representing the converted state
    */
    static fromFirestoreFields(fields = {}) {
        let result = {};
        for (let key in fields) {
            let value = fields[key];
            let isDocumentType = [
                'stringValue', 'booleanValue', 'doubleValue',
                'integerValue', 'timestampValue', 'mapValue', 'arrayValue', 'nullValue', // Added nullValue
            ].find(t => t === Object.keys(value)[0]); // Check the first key of the value object
            if (isDocumentType) {
                if (isDocumentType === 'mapValue') {
                    result[key] = Syncro.fromFirestoreFields(value.mapValue.fields || {});
                }
                else if (isDocumentType === 'arrayValue') {
                    let list = value.arrayValue.values;
                    result[key] = !!list ? list.map((l) => Syncro.fromFirestoreFields(l)) : [];
                }
                else if (isDocumentType === 'nullValue') {
                    result[key] = null;
                }
                else {
                    result[key] = value[isDocumentType];
                }
            }
            else {
                // This case might not be standard Firestore field structure, but handle recursively
                result[key] = Syncro.fromFirestoreFields(value);
            }
        }
        return result;
    }
    /**
    * Perform a one-off fetch of a given Syncro path
    *
    * @param {String} path The Syncro entity + ID path. Takes the form `ENTITY::ID`
    *
    * @returns {Promise<Object|Null>} An eventual snapshot of the given path, if the entity doesn't exist null is returned
    */
    static getSnapshot(path) {
        let { fsCollection, fsId } = Syncro.pathSplit(path);
        return Promise.resolve()
            .then(async () => FirestoreGetDoc(// Set up binding and wait for it to come ready
        FirestoreDocRef(Syncro.firestore, fsCollection, fsId)))
            .then(doc => doc.exists() // Use exists() method
            ? Syncro.fromFirestore(doc.data())
            : null);
    }
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
    static setSnapshot(path, state, options) {
        let settings = {
            method: 'merge',
            ...options,
        };
        let { fsCollection, fsId } = Syncro.pathSplit(path);
        const docRef = FirestoreDocRef(Syncro.firestore, fsCollection, fsId);
        const firestoreData = Syncro.toFirestore(state);
        return Promise.resolve()
            .then(() => {
            if (settings.method === 'merge') {
                return FirestoreUpdateDoc(docRef, firestoreData);
            }
            else { // method === 'set'
                return FirestoreSetDoc(docRef, firestoreData); // Default set overwrites
            }
        })
            .then(() => state);
    }
    /**
    * Mount the remote Firestore document against this Syncro instance
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Object} [options.initalState] State to use if no state is already loaded, overrides the entities own `initState` function fetcher
    * @param {Number} [options.retries=3] Number of times to retry if a mounted Syncro fails its sanity checks
    * @returns {Promise<Syncro>} A promise which resolves as this syncro instance when completed
    */
    mount(options) {
        let settings = {
            initialState: null,
            retries: 5,
            retryMinTime: 250,
            ...options,
        };
        let { fsCollection, fsId, entity } = Syncro.pathSplit(this.path);
        let reactive; // Eventual response from reactive() with the intitial value
        let doc; // Eventual Firebase document
        return PromiseRetry(async () => {
            await this.setHeartbeat(false); // Disable any existing heartbeat - this only really applies if we're changing path for some reason
            // Set up binding and wait for it to come ready
            this.docRef = FirestoreDocRef(Syncro.firestore, fsCollection, fsId);
            // Initalize state
            let initialState = await this.getFirestoreState();
            // Construct a reactive component
            reactive = this.getReactive(initialState);
            if (!reactive.doc || !reactive.setState || !reactive.getState || !reactive.watch)
                throw new Error('Syncro.getReactive() requires a returned `doc`, `setState()`, `getState()` + `watch()`');
            this.value = doc = reactive.doc;
            this.debug('Initial state', { doc });
            // Subscribe to remote updates
            const unsubscribe = FirestoreOnSnapshot(this.docRef, snapshot => {
                let snapshotData = Syncro.fromFirestore(snapshot.data());
                this.debug('Incoming snapshot', { snapshotData });
                reactive.setState(snapshotData);
            });
            this._destroyActions.push(unsubscribe); // Add the unsubscribe handle to the list of destroyAction promises we call on `destroy()`
            // Optionally create the doc if it has no content
            if (!isEmpty(doc)) { // Doc already has content - skip
                // Do nothing
            }
            else if (settings.initialState) { // Provided an intiailState - use that instead of the entities own method
                this.debug('Populate initial Syncro state (from provided initialState)');
                await this.setFirestoreState(settings.initialState, { method: 'set' });
            }
            else {
                this.debug(`Populate initial Syncro state (from "${entity}" Syncro worker)`);
                const response = await fetch(`${this.config.syncroRegistryUrl}/${this.path}`);
                if (!response.ok) {
                    throw new Error(`Failed to check Syncro "${fsCollection}::${fsId}" status - ${response.statusText}`);
                }
                // Assuming the fetch populates the syncro state server-side, no local state set needed here
            }
            // Setup local state watcher
            reactive.watch(throttle((newState) => {
                this.debug('Local change', { newState });
                this.markDirty();
                this.setFirestoreState(newState, { method: 'merge' });
            }, this.throttle));
            await this.setHeartbeat(true, {
                immediate: true,
            });
            return this;
        }, {
            retries: settings.retries,
            minTimeout: settings.retryMinTime,
            randomize: true,
            factor: 3,
            onFailedAttempt: async (e) => {
                this.debugError(`[Attempt ${e.attemptNumber}/${e.attemptNumber + e.retriesLeft - 1}] to mount syncro`, e);
                await this.destroy(); // Ensure cleanup on failed attempt before retry
            },
        });
    }
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
    async set(key, value, options) {
        // Argument mangling - [key, value, settings] -> changes{}, settings {{{
        let changes;
        if (typeof key == 'string') { // Called as (key:String, value:*, options?:Object)
            changes[key] = value;
        }
        else if (typeof key == 'object') { // Called as (changes:Object, options?:Object)
            [changes, options] = [key, value];
        }
        else {
            throw new Error('Unknown call signature for set() - call with string+value or object');
        }
        // }}}
        let settings = {
            delta: true,
            flush: true,
            forceFlush: false,
            flushDestroy: false,
            ...options,
        };
        // Perform merge
        let hasChanges = false;
        if (settings.delta) { // Merge changes lazily
            Object.entries(changes)
                .filter(([k, v]) => !isEqual(this.value[k], v))
                .forEach(([k, v]) => {
                hasChanges = true;
                this.value[k] = v;
            });
        }
        else {
            hasChanges = true;
            Object.assign(this.value, changes);
        }
        // Optionally perform flush
        if ((settings.forceFlush || hasChanges)
            && settings.flush) {
            await this.flush({ destroy: settings.flushDestroy });
        }
        return this;
    }
    /**
    * Schedule Syncro heartbeats
    * This populates the `sync` presence meta-information
    *
    * @param {Boolean} [enable=true] Whether to enable heartbeating
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.immediate=false] Fire a heartbeat as soon as this function is called, this is only really useful on mount
    */
    setHeartbeat(enable = true, options) {
        let settings = {
            immediate: true,
            ...options,
        };
        // Clear existing heartbeat timer, if there is one
        clearTimeout(this._heartbeatTimer);
        if (enable) {
            const heartbeatAction = async () => {
                // Perform the heartbeat
                await this.heartbeat();
                // If we're enabled - schedule the next heartbeat timer
                if (enable)
                    this.setHeartbeat(true); // Reschedule
            };
            this._heartbeatTimer = setTimeout(heartbeatAction, this.config.heartbeatInterval);
            if (settings.immediate)
                return this.heartbeat(); // Return the promise from immediate heartbeat
        }
    }
    /**
    * Perform one heartbeat pulse to the server to indicate presense within this Syncro
    * This function is automatically called by a timer if `setHeartbeat(true)` (the default behaviour)
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    async heartbeat() {
        this.debug('heartbeat!');
        try {
            const response = await fetch(`${this.config.syncroRegistryUrl}/${this.path}/heartbeat`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: Syncro.session,
                    ...(this.isDirty && { dirty: true }),
                }),
            });
            if (!response.ok) {
                console.warn(this.path, `Heartbeat failed - ${response.statusText}`, { response });
            }
            this.isDirty = false; // Reset the dirty flag if it is set
        }
        catch (error) {
            console.warn(this.path, 'Heartbeat fetch error', error);
            // Decide if isDirty should be reset on network error
        }
    }
    /**
    * Utility function to directly set this documents firestore state
    *
    * @param {Object} state The state to set / merge
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {'merge'|'set'} [options.method='merge'] How to apply the new state. 'merge' (merge in partial data to an existing Syncro), 'set' (overwrite the entire Syncro state)
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    async setFirestoreState(state, options, retries = 0) {
        let settings = {
            method: 'merge',
            ...options,
        };
        if (!this.docRef)
            throw new Error('mount() must be called before setting Firestore state');
        const firestoreData = Syncro.toFirestore(state);
        try {
            if (settings.method === 'merge') {
                return await FirestoreUpdateDoc(this.docRef, firestoreData);
            }
            else { // method === 'set'
                return await FirestoreSetDoc(this.docRef, firestoreData);
            }
        }
        catch (e) {
            if (e instanceof FirebaseError && e.code === 'not-found') {
                if (retries < 3) {
                    console.warn('Firebase syncro document does not exist during document update, reinitializing...');
                    // Reinitialize the firestore syncro document
                    const response = await fetch(`${this.config.syncroRegistryUrl}/${this.path}?force=1`);
                    if (!response.ok) {
                        console.error('Failed to reinitialize Syncro');
                    }
                    // Retry the request
                    return await this.setFirestoreState(state, options, retries + 1);
                }
                else {
                    console.warn('Max retries exceeded while trying to recover firestore syncro document, throwing error');
                }
            }
            console.error(`Error during Firestore operation (${settings.method}) on doc: ${this.docRef.path}`, e);
            throw e;
        }
    }
    /**
    * Utility method to fetch the Firestore state for this Syncro
    * NOTE: This directly extracts the state of the Firestore, not its wrapping doc object returned by `FirestoreGetDoc`
    *
    * @returns {Promise<Object>} A promise which resolves to the Firestore state
    */
    getFirestoreState() {
        if (!this.docRef)
            throw new Error('mount() must be called before getting Firestore state');
        return FirestoreGetDoc(this.docRef)
            .then(doc => Syncro.fromFirestore(doc.data() ?? {})); // Handle undefined data with default {}
    }
    /**
    * Set the Syncro dirty flag which gets passed to the server on the next heartbeat
    *
    * @see isDirty
    * @returns {Syncro} This chainable Syncro instance
    */
    markDirty() {
        this.isDirty = true;
        return this;
    }
    /**
    * Force the server to flush state
    * This is only really useful for debugging as this happens automatically anyway
    *
    * @param {Object} [options] Additional options to mutate behaviour
    * @param {Boolean} [options.destroy=false] Instruct the server to also dispose of the Syncro state
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    flush(options) {
        let settings = {
            destroy: false,
            ...options,
        };
        return fetch(`${this.config.syncroRegistryUrl}/${this.path}/flush` + (settings.destroy ? '?destroy=1' : ''))
            .then(response => response.ok
            ? null
            : Promise.reject(response.statusText || 'An error occured'));
    }
}
/**
* Build a chaotic random tree structure based on dice rolls
* This funciton is mainly used for sync testing
*
* @param {Number} [depth=0] The current depth we are starting at, changes the nature of branches based on probability
*
* @returns {*} The current branch conotents
*/
export function randomBranch(depth = 0) {
    let dice = // Roll a dice to pick the content
     depth == 0 ? 10 // first roll is always '10'
        : random(0, 11 - depth, false); // Subsequent rolls bias downwards based on depth (to avoid recursion)
    return (dice == 0 ? false
        : dice == 1 ? true
            : dice == 2 ? random(1, 10000)
                : dice == 3 ? (new Date(random(1000000000000, 1777777777777))).toISOString()
                    : dice == 5 ? Array.from({ length: random(1, 10) }, () => random(1, 10)) // Added return type hint
                        : dice == 6 ? null
                            : dice < 8 ? Array.from({ length: random(1, 10) }, () => randomBranch(depth + 1)) // Added return type hint
                                : Object.fromEntries(Array.from({ length: random(1, 5) })
                                    .map((v, k) => [
                                    sample(['foo', 'bar', 'baz', 'quz', 'flarp', 'corge', 'grault', 'garply', 'waldo', 'fred', 'plugh', 'thud'])
                                        + `_${k}`,
                                    randomBranch(depth + 1),
                                ])));
}
/**
* NPM:@momsfriendlydevco/marshal Compatible module for flattening arrays
* @type {MarshalModule}
*/
const marshalFlattenArrays = {
    id: `~array`,
    recursive: true,
    test: (v) => Array.isArray(v),
    serialize: (v) => ({ _: '~array', ...v }),
    deserialize: (v) => {
        let arr = Array.from({ length: Object.keys(v).length - 1 });
        Object.entries(v)
            .filter(([k]) => k !== '_')
            .forEach(([k, val]) => arr[+k] = val); // Changed v to val to avoid shadowing
        return arr;
    },
};
//# sourceMappingURL=syncro.js.map