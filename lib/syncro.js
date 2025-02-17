import {
	isEmpty,
	cloneDeep,
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


/**
* TERA Isomorphic Syncro class
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
	static session = `syncro_${crypto.randomUUID()}`;


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
	* Time between heartbeats
	*
	* @type {Number} Heartbeat time in milliseconds
	*/
	heartbeatInterval = 30_000; //~= 30s


	/**
	* @interface
	* Debugging printer for this instance
	* Defaults to doing nothing
	*
	* @param {*...} [msg] The message to output
	*/
	debug(...msg) {}


	/**
	* Instance constructor
	*
	* @param {String} path Mount path for the Syncro. Should be in the form `${ENTITY}::${ID}(::${RELATION})?`
	* @param {Object} [options] Additional instance setters (mutates instance directly)
	*/
	constructor(path, options) {
		this.path = path;
		Object.assign(this, options);
	}


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
			watch(cb) {
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
	*
	* @returns {Object} An object composed of the session path components
	* @property {String} fbEntity The top level Firebase collection to store within
	* @property {String} fsId The top level Firebase ID of the collection to store as, this is either just a copy of the ID or a combination of id + relation
	* @property {String} entity A valid entity name (in plural form e.g. 'projects')
	* @property {String} id A valid UUID ID
	* @property {String} [relation] A string representing a sub-relationship. Usually a short string alias
	*/
	static pathSplit(path) {
		let extracted = { .../^(?<entity>\w+?)::(?<id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:::(?<relation>\w+?))?$/.exec(path)?.groups };

		if (!extracted) throw new Error(`Invalid session path syntax "${path}"`);
		if (!extracted.entity in syncEntities) throw new Error(`Unsupported entity "${path}" -> Entity="${extracted.entity}"`);

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
	* @FIXME: Pretty sure we can drop the fromEntities() + key serializer in future
	*
	* @param {Object} snapshot The current state to convert
	* @returns {Object} A Firebase compatible object
	*/
	static toFirestore(snapshot = {}) {
		return marshal.serialize(snapshot, {
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
	* @FIXME: Pretty sure we can drop the fromEntities() + key serializer in future
	*
	* @param {Object} snapshot The raw Firebase state to convert
	* @returns {Object} A JavaScript POJO representing the converted state
	*/
	static fromFirestore(snapshot = {}) {
		return marshal.deserialize(snapshot, {
			clone: true, // Clone away from original so we don't trigger a loop within Firebase
			modules: [
				marshalFlattenArrays,
				...marshal.settings.modules,
			],
			destringify: false,
		});
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
			.then(async ()=> { // Set up binding and wait for it to come ready
				let docRef = FirestoreDocRef(Syncro.firestore, fsCollection, fsId);
				return FirestoreGetDoc(docRef);
			})
			.then(doc => doc
				? Syncro.fromFirestore(snapshot.data())
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
					FirestoreDocRef(this.firestore, fsCollection, fsId),
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
	* Mount the remote Firestore document against this instances local `value` getReactive
	*
	* @returns {Promise<Sync>} A promise which resolves as this sync instance when completed
	*/
	mount() {
		let {fsCollection, fsId, entity, id, relation} = Syncro.pathSplit(this.path);
		let reactive; // Eventual response from reactive() with the intitial value
		let doc; // Eventual Firebase document

		return Promise.resolve()
			.then(()=> this.setHeartbeat(false)) // Disable any existing heartbeat - this only really applies if we're changing path for some reason
			.then(async ()=> { // Set up binding and wait for it to come ready
				this.docRef = FirestoreDocRef(Syncro.firestore, fsCollection, fsId);

				// Initalize state
				let initialState = Syncro.fromFirestore(
					(await FirestoreGetDoc(this.docRef))
						.data()
				);

				// Construct a reactive component
				reactive = this.getReactive(initialState);
				if (!reactive.doc || !reactive.setState || !reactive.getState || !reactive.watch) throw new Error('Syncro.getReactive() requires a returned `doc`, `setState()`, `getState()` + `watch()`');
				this.value = doc = reactive.doc;

				this.debug('Initial state', {doc});

				// Subscribe to remote updates
				FirestoreOnSnapshot(this.docRef, snapshot => {
					let snapshotData = Syncro.fromFirestore(snapshot.data());
					this.debug('Incoming snapshot', {snapshotData});
					reactive.setState(snapshotData);
				});
			})
			.then(()=> { // Optionally create the doc if it has no content
				if (!isEmpty(doc)) return; // Doc already has some content at least

				this.debug('Populate initial state');

				// Extract base data + add document and return new hook
				return Promise.resolve()
					.then(()=> syncEntities[entity] || Promise.reject(`Unknown Sync entity "${entity}"`))
					.then(()=> syncEntities[entity].initState({
						supabase: Syncro.supabase,
						entity,
						id,
						relation,
					}))
					.then(state => FirestoreSetDoc(
						this.docRef,
						Syncro.toFirestore(state),
					)) // Send new base state to Firestore
			})
			.then(()=> { // Setup local state watcher
				reactive.watch(throttle(newState => {
					this.debug('Local change', {newState});
					FirestoreUpdateDoc(
						this.docRef,
						Syncro.toFirestore(newState),
					);
				}, this.throttle));
			})
			.then(()=> this.setHeartbeat(true))
			.then(()=> this)
	}


	/**
	* Schedule Syncro heartbeats
	* This populates the `sync` presence meta-information
	*
	* @param {Boolean} [enable=true] Whether to enable heartbeating
	*/
	setHeartbeat(enable = true) {
		clearTimeout(this._heartbeatTimer);

		this._heartbeatTimer = enable && setTimeout(async ()=> {
			this.debug('heartbeat!');
			let timestamp = (new Date()).toISOString();
			await FirestoreSetDoc(
				FirestoreDocRef(Syncro.firestore, 'presence', this.path),
				{
					latest: timestamp,
					sessions: {
						[this.session]: timestamp,
					},
				},
				{merge: true},
			);

			// If we're enabled - set the next heartbeat timer
			this.setHeartbeat(true);
		}, this.heartbeatInterval);
	}


	/**
	* Timer handle for heartbeats
	*
	* @type {Handle}
	*/
	_heartbeatTimer;
}


/**
* Entities we support syncro paths on, each needs to correspond with a Firebase/Firestore collection name
*
* @type {Object} An object lookup of entities
*
* @property {String} singular The singular noun for the item
* @property {Function} initState Function called to initialize state when Firestore has no existing document. Called as `({supabase:SupabaseClient, entity:String, id:String, relation?:string})` and expected to return the initial data object state
*/
export const syncEntities = {
	presence: {
		singular: 'presence',
		initState() {
			return {};
		},
	},
	projects: {
		singular: 'project',
		initState({supabase, id}) {
			return Syncro.wrapSupabase(supabase.from('projects')
				.select('data')
				.limit(1)
				.eq('id', id)
			)
				.then(rows => rows.length == 1 ? rows[0] : Promise.reject(`Syncro project "${id}" not found`))
				.then(item => item.data); // Bind to 'data' JSONB column
		},
	},
	project_namespaces: {
		singular: 'project namespace',
		initState({supabase, id, relation}) {
			if (!relation) throw new Error('Project namespace relation missing, path should resemble "project_namespaces::${PROJECT}::${RELATION}"');
			return Syncro.wrapSupabase(supabase.from('project_namespaces')
				.select('data')
				.limit(1)
				.eq('project', id)
				.eq('name', relation)
			)
				.then(rows => rows.length == 1 ? rows[0] : Promise.reject(`Syncro project ("${id}") namespace ("${relation}") not found`))
				.then(item => item.data);
		},
	},
	test: {
		singular: 'test',
		initState({supabase, id}) {
			return Syncro.wrapSupabase(supabase.from('test')
				.select('data')
				.limit(1)
				.eq('id', id)
			)
				.then(rows => rows.length == 1 ? rows[0] : Promise.reject(`Syncro test item "${id}" not found`))
				.then(item => item.data);
		},
	},
	users: {
		singular: 'user',
		initState({supabase, id}) {
			return Syncro.wrapSupabase(supabase.from('users')
				.select('data')
				.limit(1)
				.eq('id', id)
			)
				.then(rows => rows.length == 1 ? rows[0] : Promise.reject(`Syncro user "${id}" not found`))
				.then(item => item.data);
		},
	},
};


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
