import {
	isEmpty,
	cloneDeep,
	random,
	sample,
	throttle,
} from 'lodash-es';
import {
	doc as FirestoreDocRef,
	getDoc as FirestoreGetDoc,
	onSnapshot as FirestoreOnSnapshot,
	setDoc as FirestoreSetDoc,
	updateDoc as FirestoreUpdateDoc,
} from 'firebase/firestore';
import marshal from '@momsfriendlydevco/marshal';
import {nanoid} from 'nanoid';


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
	* @type {Firebase}
	*/
	static firebase;


	/**
	* Firestore instance in use
	*
	* @type {Firestore}
	*/
	static firestore;


	/**
	* Supabase instance in use
	*
	* @type {SupabaseClient}
	*/
	static supabase;


	/**
	* The current user session, should be unique for the user + browser tab
	* Used by the heartbeat system
	*
	* @type {String}
	*/
	static session;


	/**
	* This instances fully formed string path
	*
	* @type {String}
	*/
	path;


	/**
	* The Firestore docHandle when calling various Firestore functions
	*
	* @type {FirestoreRef}
	*/
	docRef;


	/**
	* The reactive object managed by this Syncro instance
	* The nature of this varies by framework and what `getReactive()` provides
	*
	* @type {*}
	*/
	value;


	/**
	* Default throttle to apply for writes
	*
	* @type {Number} Throttle time in milliseconds
	*/
	throttle = 250;


	/**
	* Various Misc config for the Syncro instance
	*
	* @type {Object}
	* @property {Number} heartbeatinterval Time in milliseconds between heartbeat beacons
	* @property {String} syncWorkerUrl The prefix Sync worker URL
	* @property {Object} context Additional named parameters to pass to callbacks like initState
	*/
	config = {
		heartbeatInterval: 50_000, //~= 50s
		syncWorkerUrl: 'https://tera-tools.com/api/sync',
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
	isDirty = false;


	/**
	* @interface
	* Debugging printer for this instance
	* Defaults to doing nothing
	*
	* @param {*...} [msg] The message to output
	*/
	debug(...msg) {} // eslint-disable-line no-unused-vars


	/**
	* Instance constructor
	*
	* @param {String} path Mount path for the Syncro. Should be in the form `${ENTITY}::${ID}(::${RELATION})?`
	* @param {Object} [options] Additional instance setters (mutates instance directly), note that the `config` subkey is merged with the existing config rather than assigned
	*/
	constructor(path, options) {
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
			.map(fn => fn())
		)
			.then(()=> this._destroyActions = []) // Reset list of actions to perform when terminating
	}


	/**
	* Actions to preform when we are destroying this instance
	* This is an array of function callbacks to execute in parallel when `destroy()` is called
	*
	* @type {Array<Function>}
	*/
	_destroyActions = [];


	/**
	* Function to return whatever the local framework uses as a reactive object
	* This should respond with an object of mandatory functions to watch for changes and remerge them
	*
	* @param {Object} value Initial value of the reactive
	*
	* @returns {Object} A reactive object prototype
	* @property {Object} doc The reactive object
	* @property {Function} setState Function used to overwrite the default state, called as `(newState:Object)`
	* @property {Function} getState Function used to fetch the current snapshot state, called as `()`
	* @property {Function} watch Function used to set up state watchers, should call its callback when a change is detected, called as `(cb:Function)`
	*/
	getReactive(value) {
		console.warn('Syncro.getReactive has not been subclassed, assuming a POJO response');
		let doc = {...value};
		return {
			doc,
			setState(state) {
				// Shallow copy all sub keys into existing object (keeping the object pointer)
				Object.entries(state || {})
					.forEach(([k, v]) => doc[k] = v)
			},
			getState() {
				return cloneDeep(doc);
			},
			watch(cb) { // eslint-disable-line no-unused-vars
				// Stub
			},
		};
	};


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
	* @returns {Object} An object composed of the session path components
	* @property {String} fbEntity The top level Firebase collection to store within
	* @property {String} fsId The top level Firebase ID of the collection to store as, this is either just a copy of the ID or a combination of id + relation
	* @property {String} entity A valid entity name (in plural form e.g. 'projects')
	* @property {String} id A valid UUID ID
	* @property {String} [relation] A string representing a sub-relationship. Usually a short string alias
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
			+ '$'
		);

		let extracted = { ...pathMatcher.exec(path)?.groups };

		if (!extracted) throw new Error(`Invalid session path syntax "${path}"`);
		if (!(extracted.entity in syncEntities)) throw new Error(`Unsupported entity "${path}" -> Entity="${extracted.entity}"`);

		return {
			...extracted,
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
				'integerValue', 'timestampValue', 'mapValue', 'arrayValue',
			].find(t => t === key);

			if (isDocumentType) {
				let item = ['stringValue', 'booleanValue', 'doubleValue', 'integerValue', 'timestampValue']
					.find(t => t === key)

				if (item) {
					return value;
				} else if ('mapValue' == key) {
					return Syncro.fromFirestoreFields(value.fields || {});
				} else if ('arrayValue' == key) {
					let list = value.values;
					return !!list ? list.map(l => Syncro.fromFirestoreFields(l)) : [];
				}
			} else {
				result[key] = Syncro.fromFirestoreFields(value)
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
		let {fsCollection, fsId} = Syncro.pathSplit(path);

		return Promise.resolve()
			.then(async ()=> FirestoreGetDoc( // Set up binding and wait for it to come ready
				FirestoreDocRef(Syncro.firestore, fsCollection, fsId)
			))
			.then(doc => doc
				? Syncro.fromFirestore(doc.data())
				: null
			)
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
		let {fsCollection, fsId} = Syncro.pathSplit(path);

		return Promise.resolve()
			.then(()=> // Set up binding and wait for it to come ready
				(settings.method == 'merge' ? 'FirestoreUpdateDoc' : 'FirestoreSetDoc')(
					FirestoreDocRef(Syncro.firestore, fsCollection, fsId),
					Syncro.toFirestore(state),
				)
			)
			.then(()=> state)
	}


	/**
	* Wrap a Supabase query so it works more like a classic-JS promise
	*
	* 1. Flatten non-promise responses into thennables
	* 2. The query is forced to respond as a promise (prevents accidental query chaining)
	* 3. The response data object is forced as a POJO (if any data is returned, otherwise void)
	* 4. Error responses throw with a logical error message rather than a weird object return
	* 5. Translate various error messages to something logical
	*
	* @param {SupabaseQuery} query A Supabase query object or method to execute
	* @returns {Object} The data response as a plain JavaScript Object
	*/
	static wrapSupabase(query) {
		return Promise.resolve(query)
			.then(res => {
				if (res?.error) {
					if (/JSON object requested, multiple \(or no\) rows returned$/.test(res.error.message)) {
						console.warn('Supabase query threw record not found against query', query.url.search);
						console.warn('Supabase raw error', res);
						throw new Error('NOT-FOUND');
					} else {
						console.warn('Supabase query threw', res.error.message);
						throw new Error(`${res.error?.code || 'UnknownError'}: ${res.error?.message || 'Unknown Supabase error'}`);
					}
				} else if (res.data) { // Do we have output data
					return res.data;
				}
			})
	}


	/**
	* Mount the remote Firestore document against this Syncro instance
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Object} [options.initalState] State to use if no state is already loaded, overrides the entities own `initState` function fetcher
	* @returns {Promise<Syncro>} A promise which resolves as this syncro instance when completed
	*/
	mount(options) {
		let settings = {
			initialState: null,
			...options,
		};

		let {fsCollection, fsId, entity, id, relation} = Syncro.pathSplit(this.path);
		let reactive; // Eventual response from reactive() with the intitial value
		let doc; // Eventual Firebase document

		return Promise.resolve()
			.then(()=> this.setHeartbeat(false)) // Disable any existing heartbeat - this only really applies if we're changing path for some reason
			.then(async ()=> { // Set up binding and wait for it to come ready
				this.docRef = FirestoreDocRef(Syncro.firestore, fsCollection, fsId);

				// Initalize state
				let initialState = await this.getFirestoreState();

				// Construct a reactive component
				reactive = this.getReactive(initialState);
				if (!reactive.doc || !reactive.setState || !reactive.getState || !reactive.watch) throw new Error('Syncro.getReactive() requires a returned `doc`, `setState()`, `getState()` + `watch()`');
				this.value = doc = reactive.doc;

				this.debug('Initial state', {doc});

				// Subscribe to remote updates
				this._destroyActions.push( // Add the unsubscribe handle to the list of destroyAction promises we call on `destroy()`
					FirestoreOnSnapshot(this.docRef, snapshot => {
						let snapshotData = Syncro.fromFirestore(snapshot.data());
						this.debug('Incoming snapshot', {snapshotData});
						reactive.setState(snapshotData);
					})
				);
			})
			.then(()=> { // Optionally create the doc if it has no content
				if (!isEmpty(doc)) { // Doc already has content - skip
					return;
				} else if (settings.initialState) { // Provided an intiailState - use that instead of the entities own method
					this.debug('Populate initial Syncro state (from provided initialState)');
					return this.setFirestoreState(settings.initialState, {method: 'set'});
				} else {
					this.debug(`Populate initial Syncro state (from "${entity}" entity)`);

					// Extract base data + add document and return new hook
					return Promise.resolve()
						.then(()=> syncEntities[entity] || Promise.reject(`Unknown Sync entity "${entity}"`))
						.then(()=> syncEntities[entity].initState({
							supabase: Syncro.supabase,
							fsCollection, fsId,
							entity, id, relation,
							...this.config.context,
						}))
						.then(state => this.setFirestoreState(state, {method: 'set'})) // Send new base state to Firestore
				}
			})
			.then(()=> { // Setup local state watcher
				reactive.watch(throttle(newState => {
					this.debug('Local change', {newState});
					this.markDirty();
					this.setFirestoreState(newState, {method: 'merge'});
				}, this.throttle));
			})
			.then(()=> this.setHeartbeat(true, {
				immediate: true,
			}))
			.then(()=> this)
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
			this._heartbeatTimer = setTimeout(async ()=> {
				// Perform the heartbeat
				await this.heartbeat();

				// If we're enabled - schedule the next heartbeat timer
				enable && this.setHeartbeat(true);
			}, this.config.heartbeatInterval);

			if (settings.immediate) this.heartbeat();
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

		await fetch(`${this.config.syncWorkerUrl}/${this.path}/heartbeat`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				session: Syncro.session,
				...(this.isDirty && {dirty: true}),
			}),
		})
			.then(response => response.ok
				? null
				: console.warn(this.path, `Heartbeat failed - ${response.statusText}`, {response})
			)
			.then(()=> this.isDirty = false) // Reset the dirty flag if it is set
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
	setFirestoreState(state, options) {
		let settings = {
			method: 'merge',
			...options,
		};
		if (!this.docRef) throw new Error('mount() must be called before setting Firestore state');

		return (settings.method == 'set' ? FirestoreSetDoc : FirestoreUpdateDoc)(
			this.docRef,
			Syncro.toFirestore(state),
		)
	}


	/**
	* Utility method to fetch the Firestore state for this Syncro
	* NOTE: This directly extracts the state of the Firestore, not its wrapping doc object returned by `FirestoreGetDoc`
	*
	* @returns {Promise<Object>} A promise which resolves to the Firestore state
	*/
	getFirestoreState() {
		if (!this.docRef) throw new Error('mount() must be called before getting Firestore state');

		return FirestoreGetDoc(this.docRef)
			.then(doc => Syncro.fromFirestore(doc.data()))
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

		return fetch(`${this.config.syncWorkerUrl}/${this.path}/flush` + (settings.destroy ? '?destroy=1' : ''))
			.then(response => response.ok ? null : Promise.reject(response.statusText || 'An error occured'))
	}


	/**
	* Timer handle for heartbeats
	*
	* @type {Handle}
	*/
	_heartbeatTimer;
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

	return (
		dice == 0 ? false
		: dice == 1 ? true
		: dice == 2 ? random(1, 10_000)
		: dice == 3 ? (new Date(random(1_000_000_000_000, 1_777_777_777_777))).toISOString()
		: dice == 5 ? Array.from({length: random(1, 10)}, ()=> random(1, 10))
		: dice == 6 ? null
		: dice < 8 ? Array.from({length: random(1, 10)}, ()=> randomBranch(depth+1))
		: Object.fromEntries(
			Array.from({length: random(1, 5)})
				.map((v, k) => [
					sample(['foo', 'bar', 'baz', 'quz', 'flarp', 'corge', 'grault', 'garply', 'waldo', 'fred', 'plugh', 'thud'])
					+ `_${k}`,
					randomBranch(depth+1),
				])
		)
	)
}


/**
* NPM:@momsfriendlydevco/marshal Compatible module for flattening arrays
* @type {MarshalModule}
*/
const marshalFlattenArrays = {
	id: `~array`,
	recursive: true,
	test: v => Array.isArray(v),
	serialize: v => ({_: '~array', ...v}),
	deserialize: v => {
		let arr = Array.from({length: Object.keys(v).length - 1});

		Object.entries(v)
			.filter(([k]) => k !== '_')
			.forEach(([k, v]) => arr[+k] = v);

		return arr;
	},
};
