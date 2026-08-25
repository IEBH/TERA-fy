import {cloneDeep, debounce, isEqual, isPlainObject, omit, random, sample} from 'lodash-es';
import {addRxPlugin, createRxDatabase} from 'rxdb';
import {getRxStorageDexie} from 'rxdb/plugins/storage-dexie';
import {replicateRxCollection} from 'rxdb/plugins/replication';
import {RxDBLeaderElectionPlugin} from 'rxdb/plugins/leader-election';
import {RxDBMigrationSchemaPlugin} from 'rxdb/plugins/migration-schema';
import {filter, interval, map, merge as rxMerge, Subject} from 'rxjs';
import mitt from 'mitt';

/**
* Entities which have ReST sync endpoints within the tera-io worker
* Anything not in this list mounts as a local-only document (persisted to IndexedDB but not replicated)
*
* @type {Set<String>}
*/
let syncableEntities = new Set(['institutes', 'projects', 'test', 'users']);


/**
* Keys stripped from the inner `data` payload when pulling
* The sync setter endpoint merges the whole RxDB document (sans `id`) into the rows JSONB `data` column so
* these replication metadata keys leak into the stored data and need removing on the way back down
*
* @type {Array<String>}
*/
let metadataKeys = ['_attachments', '_deleted', '_meta', '_rev', 'updatedAt'];


/**
* Earliest allowed sync checkpoint (in epoch seconds), used when no local checkpoint exists yet
* This mirrors the tera-io workers earliest accepted `updatedAt` value
*
* @type {Number}
*/
const syncEpoch = new Date('2024-01-01').getTime() / 1000;


/**
* Generic RxDB schema applied to all TERA entity collections
* Each Supabase row is exposed as `{id: UUID, data: Object}` with the JSONB `data` object being the portion
* the frontend actually works with
*
* @type {Object}
*/
let entitySchema = {
	version: 1,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {type: 'string', minLength: 1, maxLength: 128}, // Usually a UUID but local-only mounts use composite keys - e.g. `project_namespaces` uses `${PROJECT_UUID}::${NAME}`
		updatedAt: {type: 'string', maxLength: 40}, // Stored as a timestampnz within Supabase, its just available here as a Linux epoc to keep RxDB happy
		data: {type: 'object', additionalProperties: true},
	},
	required: ['id'],
};


/**
* Per-version migration strategies for `entitySchema`
* v0 -> v1 only widened the allowed `id` length so documents pass through unchanged
*
* @type {Object<Function>}
*/
let entityMigrationStrategies = {
	1: doc => doc,
};


/**
* Perform a field-level three-way merge of a documents `data` payload
* Given the last agreed base state + the local edit + the remote (master) edit this keeps both sides
* non-overlapping changes, only falling back to the remote state when both sides changed the exact same leaf
*
* @param {Object} base The last state both sides agreed on (the assumed master state)
* @param {Object} local The local documents state
* @param {Object} remote The remote / real master state
*
* @returns {Object} The merged state
*/
function threeWayMerge(base, local, remote) {
	let output = {};

	new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)])
		.forEach(key => {
			let hasLocalChange = !isEqual(local[key], base[key]);
			let hasRemoteChange = !isEqual(remote[key], base[key]);
			let value =
				!hasLocalChange ? remote[key] // Local untouched - take the remote state (including remote deletions)
				: !hasRemoteChange ? local[key] // Only local changed - keep the local edit
				: isPlainObject(local[key]) && isPlainObject(remote[key]) ? threeWayMerge( // Both sides changed within the same object - merge the subtree
					isPlainObject(base[key]) ? base[key] : {},
					local[key],
					remote[key],
				)
				: remote[key]; // Both sides changed the same leaf - the master state wins

			if (value !== undefined) output[key] = cloneDeep(value); // Clone as RxDB deep-freezes its documents
		});

	return output;
}


/**
* Compute an RFC7386 style JSON Merge Patch between two document `data` payloads
* Changed scalars / arrays are included verbatim, nested objects recurse + keys removed within the target
* are marked with `null` - NOTE this means literal `null` values cannot be stored, they read back as deletes
*
* @param {Object} base The base state the patch applies over
* @param {Object} target The desired output state
*
* @returns {Object} A minimal merge patch object such that applying it over `base` produces `target`
*/
function jsonMergePatch(base, target) {
	let patch = {};
	let baseObj = isPlainObject(base) ? base : {};

	Object.keys(baseObj)
		.filter(key => !Object.hasOwn(target, key))
		.forEach(key => patch[key] = null); // Removed keys become explicit null delete markers

	Object.entries(target)
		.forEach(([key, val]) => {
			if (isEqual(baseObj[key], val)) return; // Unchanged - omit from the patch
			patch[key] = isPlainObject(baseObj[key]) && isPlainObject(val)
				? jsonMergePatch(baseObj[key], val) // Both sides are objects - recurse for a minimal sub-patch
				: val;
		});

	return patch;
}


/**
* Minimal fetch() based implementation of the Axios-like HTTP contract `Syncro.settings.http` expects
* Used as the fallback when no richer HTTP client has been injected via `Syncro.setup({http})`
*
* @type {Object}
* @property {Function} get GET a URL, called as `(url, {params, headers})`, resolves with `{data}`
* @property {Function} post POST a JSON body to a URL, called as `(url, body, {headers})`, resolves with `{data}`
*/
let fetchHttp = {
	get(url, options) {
		let fetchUrl = new URL(url);
		Object.entries(options?.params || {})
			.forEach(([key, val]) => fetchUrl.searchParams.set(key, val));

		return fetch(fetchUrl, {headers: options?.headers})
			.then(response => response.ok
				? response.json().catch(()=> null)
				: Promise.reject(new Error(`${response.status}: ${response.statusText || 'HTTP request failed'}`))
			)
			.then(data => ({data}));
	},
	post(url, body, options) {
		return fetch(url, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				...options?.headers,
			},
			body: JSON.stringify(body),
		})
			.then(response => response.ok
				? response.json().catch(()=> null)
				: Promise.reject(new Error(`${response.status}: ${response.statusText || 'HTTP request failed'}`))
			)
			.then(data => ({data}));
	},
};


/**
* RxDB conflict handler applied to all entity collections
* Replaces RxDB's default "master wins" behaviour with a field-level three-way merge so two clients editing
* different parts of the same document both keep their changes - the losing client rebases its edits over
* the master state and re-pushes
*
* @type {RxConflictHandler}
*/
let entityConflictHandler = {
	isEqual: (a, b) => (
		a.id == b.id
		&& a.updatedAt == b.updatedAt
		&& (a._deleted ?? false) == (b._deleted ?? false)
		&& isEqual(a.data, b.data)
	),
	resolve: ({realMasterState, newDocumentState, assumedMasterState}) => ({
		...realMasterState,
		data: threeWayMerge(
			assumedMasterState?.data ?? {},
			newDocumentState.data ?? {},
			realMasterState.data ?? {},
		),
	}),
};


/**
* @class Syncro
* TERA Isomorphic Syncro class
*
* Each Syncro instance mounts one remote TERA entity (a Supabase row exposed via the tera-io worker) as a
* local-first RxDB document with a framework-native reactive mirror of its `data` payload
*
* Class-level (static) state manages the shared plumbing all instances use:
* - The RxDB database + per-entity collections (Dexie / IndexedDB storage)
* - The single multiplexed stream WebSocket against the tera-io worker (leader tab only)
* - Cross-tab leader election + follower state relay over a BroadcastChannel
* - Browser lifecycle listeners (online/offline/visibility/pagehide)
*
* This class tries to be as independent as possible to help with adapting it to various front-end
* TERA-fy plugin frameworks - framework specifics (reactivity, auth, HTTP) are injected via `Syncro.setup()`
*/
export default class Syncro {

	/**
	* Global Syncro configuration, applied via `Syncro.setup()`
	*
	* @type {Object}
	* @property {String} databaseName Name of the local RxDB (IndexedDB) database
	* @property {Boolean} devMode Whether to inject the RxDB dev-mode tooling + AJV schema validation
	* @property {String} url Base URL of the tera-io worker used for replication + snapshots
	* @property {Object} http Axios-like HTTP client used for replication + snapshot calls, must expose `get(url, opts)` + `post(url, body, opts)`, defaults to a minimal fetch() based adapter
	* @property {Function} getToken Async function which resolves with the current auth bearer token
	* @property {Function} canReplicate Guard called before establishing a replication, return falsy to refuse
	* @property {Function} isAuthenticated Whether the user currently holds a valid login, used to classify socket failures
	* @property {Function} getReactive Framework reactive adapter, see `Syncro.defaultReactive()` for the expected contract
	* @property {Function} onStatus Boot progress reporting hook, called as `(message:String)`
	* @property {Function} debug Debug output hook, called as `(...msg:*)`
	* @property {Number} throttle Debounce time in milliseconds for outbound reactive->RxDB writes
	* @property {Number} pollInterval Base fallback poll interval in milliseconds while no live stream covers a path
	* @property {Number} pollIntervalMax Maximum fallback poll interval in milliseconds after idle backoff
	* @property {Number} streamReconnect Base stream socket reconnect delay in milliseconds
	* @property {Number} streamReconnectMax Maximum stream socket reconnect delay in milliseconds
	* @property {Number} heartbeatInterval Time in milliseconds between stream socket heartbeat pings
	* @property {Number} mountTimeout Maximum time in milliseconds to wait for the initial replication during mount
	*/
	static settings = {
		databaseName: 'tera',
		devMode: false,
		url: null,
		http: fetchHttp,
		getToken: ()=> Promise.reject(new Error('Syncro.settings.getToken() has not been configured - call Syncro.setup() first')),
		canReplicate: ()=> true,
		isAuthenticated: ()=> true,
		getReactive: null,
		onStatus: ()=> {},
		debug: ()=> {},
		throttle: 250,
		pollInterval: 15_000,
		pollIntervalMax: 60_000,
		streamReconnect: 5000,
		streamReconnectMax: 60_000,
		heartbeatInterval: 30_000,
		mountTimeout: 10_000,
	};


	/**
	* Event emitter used to signal shared state changes to wrapping services
	* Emits:
	* - `socketState` (state:String) - overall stream connection state changed
	* - `socketSession` (sessionId:String|null) - server-assigned stream session ID changed
	* - `pathState` ({path:String, state:String|null}) - per-path stream state changed (null = path released)
	* - `leader` (isLeader:Boolean) - this tabs cross-tab leadership changed
	*
	* @type {Mitt}
	*/
	static events = mitt();


	/**
	* Initialized RxDB database instance
	* @type {RxDatabase}
	*/
	static db = null;


	/**
	* Mounted Syncro instances by path
	* @type {Object<Syncro>}
	*/
	static syncros = {};


	/**
	* Pending / settled mount promises by path, used to dedupe simultaneous `mount()` calls
	* @type {Object<Promise<Syncro>>}
	*/
	static mounts = {};


	/**
	* Pending / settled collection creation promises by entity, used to dedupe simultaneous `collection()` calls
	* @type {Object<Promise<RxCollection>>}
	*/
	static collections = {};


	/**
	* Promise run to handle the initial connection
	* Returned automatically if `connect()` has already run at least once
	* @type {Promise}
	*/
	static connectPromise = null;


	/**
	* The shared multiplexed stream WebSocket (leader tab only)
	* All mounted Syncros subscribe over this one socket - see `connectSocket()`
	* @type {WebSocket|null}
	*/
	static socket = null;


	/**
	* Overall stream connection state, usable by UIs for a sync indicator
	* Followers mirror the leaders state via `leaderState` instead
	* @type {'idle'|'connecting'|'connected'|'reconnecting'|'disconnected'|'offline'|'auth-expired'}
	*/
	static socketState = 'idle';


	/**
	* Server-assigned session ID of the current stream socket, for log correlation with the tera-io worker
	* @type {String|null}
	*/
	static socketSessionId = null;


	/**
	* Sequential failed / dropped stream connections, drives the reconnect backoff
	* Only reset after a connection stays open for 30s (or on wake/online events) so a crash-looping
	* server keeps backing off
	* @type {Number}
	*/
	static reconnectAttempts = 0;


	/**
	* Whether this tab won the cross-tab leader election + owns the stream WebSocket
	* @type {Boolean}
	*/
	static isLeader = false;


	/**
	* Followers only - the last broadcast `socketState` of the leader tab
	* @type {String|null}
	*/
	static leaderState = null;


	/**
	* Followers only - the paths the leader tab is actively streaming
	* @type {Array<String>}
	*/
	static leaderPaths = [];


	/**
	* Followers only - epoch of the last message received from the leader tab
	* @type {Number}
	*/
	static leaderLastSeen = 0;


	/**
	* Per-path stream state by Syncro path, usable by UIs for per-document sync indicators
	* @type {Object<'local'|'polling'|'live'>}
	*/
	static states = {};


	/**
	* Timer handles + private shared plumbing
	* @type {*}
	*/
	static heartbeatTimer;
	static leaderHeartbeatTimer;
	static stabilityTimer;
	static reconnectTimer = null;
	static lastSeen = 0;
	static broadcastChannel = null;
	static onlineListener;
	static offlineListener;
	static wakeListener;
	static sleepListener;


	/**
	* Merge global Syncro configuration
	*
	* @param {Object} options Settings to merge into `Syncro.settings`
	* @returns {Syncro} This class, for chaining
	*/
	static setup(options) {
		Object.assign(this.settings, options);
		return this;
	}


	/**
	* Split a Syncro path into its component parts
	*
	* @param {String} path The Syncro entity + ID path. Takes the form `ENTITY::ID`
	*
	* @returns {Object} An object composed of `{entity: String, id: String, isSyncable: Boolean}`
	*/
	static parsePath(path) {
		let [entity, ...idSegments] = path.split('::');
		if (!entity || idSegments.length == 0) throw new Error(`Invalid Syncro path "${path}"`);

		return {
			entity,
			id: idSegments.join('::'),
			isSyncable: syncableEntities.has(entity),
		};
	}


	/**
	* Fallback reactive adapter used when `Syncro.settings.getReactive` has not been configured
	* Framework wrappers should provide their own version of this via `Syncro.setup({getReactive})`
	*
	* @param {Object} value Initial value of the reactive
	*
	* @returns {Object} A reactive object prototype
	* @property {Object} doc The reactive object
	* @property {Function} setState Function used to apply an incoming document state over `doc` (keeping the object pointer), called as `(newState:Object)`
	* @property {Function} getState Function used to fetch a detached snapshot of the current state, called as `()`
	* @property {Function} watch Function used to set up state watchers, should call its callback when a change is detected + return an un-watch function, called as `(cb:Function)`
	*/
	static defaultReactive(value) {
		console.warn('this.settings.getReactive has not been configured, assuming a POJO response');
		let doc = {...value};
		return {
			doc,
			setState(state) {
				let stateKeys = new Set(Object.keys(state || {}));

				// Remove local keys that no longer exist upstream
				Object.keys(doc)
					.filter(key => !stateKeys.has(key))
					.forEach(key => delete doc[key]);

				// Shallow copy changed sub-keys into the existing object (keeping the object pointer)
				Object.entries(state || {})
					.forEach(([key, val]) => {
						if (!isEqual(doc[key], val)) doc[key] = cloneDeep(val); // Clone as RxDB deep-freezes its documents
					});
			},
			getState() {
				return cloneDeep(doc);
			},
			watch(cb) { // eslint-disable-line no-unused-vars
				return ()=> {}; // Stub - POJOs have no reactivity to watch
			},
		};
	}


	/**
	* Initialize the local RxDB database using Dexie (IndexedDB) as the storage backend
	* In dev mode the storage is additionally wrapped with the ajv schema validator - RxDB's dev-mode
	* plugin refuses to boot against an unwrapped storage (error DVM1) since most RxDB bugs come from
	* data that silently doesn't match its collection schema
	*
	* @returns {Promise<RxDatabase>} A promise which resolves with the RxDB database instance when the operation has completed
	*/
	static connect() {
		// Promise allready running or has run? - return that
		if (this.connectPromise) return this.connectPromise;

		return this.connectPromise = Promise.resolve()
			.then(()=> addRxPlugin(RxDBMigrationSchemaPlugin)) // Schema version migrations (see `entitySchema.version`)
			.then(()=> addRxPlugin(RxDBLeaderElectionPlugin)) // Cross-tab leader election - only one tab holds the stream WebSocket
			.then(()=> this.settings.devMode
				? Promise.resolve()
					.then(()=> this.settings.onStatus('inject RxDB dev mode tooling, AJV schema validator + Dexie'))
					.then(()=> Promise.all([
						import('rxdb/plugins/dev-mode'),
						import('rxdb/plugins/validate-ajv'),
					]))
					.then(([{RxDBDevModePlugin, disableWarnings}, {wrappedValidateAjvStorage}]) => {
						disableWarnings();
						addRxPlugin(RxDBDevModePlugin);
						return wrappedValidateAjvStorage({storage: getRxStorageDexie()});
					})
				: Promise.resolve()
					.then(()=> this.settings.onStatus('inject Dexie (production mode)'))
					.then(()=> getRxStorageDexie())
			)
			.then(storage => {
				this.settings.onStatus('create RxDatabase');
				return storage;
			})
			.then(storage => createRxDatabase({
				name: this.settings.databaseName,
				storage,
				eventReduce: true,
				closeDuplicates: true, // Allow Vite HMR to recreate the database without throwing DB9
			}))
			.then(db => this.db = db);
	}


	/**
	* Fetch (lazily creating) the RxDB collection for a given entity
	*
	* @param {String} entity The entity name, corresponds with the Supabase table
	*
	* @returns {Promise<RxCollection>} An eventual RxDB collection for the entity
	*/
	static collection(entity) {
		let existing = this.collections[entity];
		if (existing) return existing;

		return this.collections[entity] = this.connect()
			.then(()=> this.db.collections[entity] || this.db.addCollections({
				[entity]: {
					schema: entitySchema,
					migrationStrategies: entityMigrationStrategies,
					conflictHandler: entityConflictHandler,
				},
			}))
			.then(()=> this.db.collections[entity])
			.catch(e => {
				delete this.collections[entity]; // Remove failed collection creations so they can be retried
				throw e;
			});
	}


	/**
	* Set the per-path stream state, notifying wrapping services
	*
	* @param {String} path The Syncro path to set the state for
	* @param {'local'|'polling'|'live'|null} state The new state, null removes the path entirely
	*/
	static setPathState(path, state) {
		if (state == null) {
			delete this.states[path];
		} else {
			this.states[path] = state;
		}
		this.events.emit('pathState', {path, state});
	}


	/**
	* Mount a Syncro instance for the given path, deduping simultaneous calls
	*
	* @param {String} path The Syncro entity + ID path. Takes the form `ENTITY::ID`
	*
	* @returns {Promise<Syncro>} An eventual mounted Syncro instance
	*/
	static mount(path) {
		// Already mounted / mounting - provide it directly
		let existing = this.mounts[path];
		if (existing) return existing;

		return this.mounts[path] = Promise.resolve()
			.then(()=> new Syncro(path).mount())
			.catch(e => Promise.resolve()
				.then(()=> this.destroy(path)) // Tear down any half-mounted state (replication, stream socket, watchers)
				.catch(()=> {}) // Best effort teardown - the original error is the one worth surfacing
				.then(()=> {
					delete this.mounts[path]; // Remove failed mounts so they can be retried
					throw e;
				})
			);
	}


	/**
	* Destroy / unmount the Syncro instance mounted at the given path
	* If nothing is mounted at the path this resolves quietly
	*
	* @param {String} path The Syncro entity + ID path to release
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	static destroy(path) {
		let syncro = this.syncros[path];
		if (!syncro) return Promise.resolve(); // Already released

		return syncro.destroy();
	}


	/**
	* Whether the shared stream WebSocket is currently open
	* @returns {Boolean} True if the socket exists and is in the OPEN state
	*/
	static isSocketOpen() {
		return !!this.socket && this.socket.readyState == WebSocket.OPEN;
	}


	/**
	* Whether a live stream currently covers a Syncro (so its fallback interval poll can stay quiet)
	* Leaders check their own socket + subscription state, followers check the leader tabs last broadcast
	*
	* @param {Syncro} syncro The syncro instance to check
	* @returns {Boolean} True if stream events for this path arrive without polling
	*/
	static streamCovers(syncro) {
		return this.isLeader
			? this.isSocketOpen() && syncro.isSubscribed
			: (
				this.leaderState == 'connected'
				&& Date.now() - this.leaderLastSeen < 45_000 // Leader heartbeats every 15s - treat a quiet leader as gone
				&& this.leaderPaths.includes(syncro.path)
			);
	}


	/**
	* Open the shared multiplexed stream WebSocket against the tera-io `GET /sync/stream` endpoint
	* Only the leader tab connects - followers receive relayed events over the BroadcastChannel
	* Idempotent - returns quietly if a socket is already connecting/connected or nothing needs streaming
	*
	* @returns {Promise} A promise which resolves when the connection attempt has been made (NOT when the socket opens)
	*/
	static connectSocket() {
		if (
			!this.isLeader // Only the leader tab holds the stream socket
			|| (this.socket && [WebSocket.CONNECTING, WebSocket.OPEN].includes(this.socket.readyState)) // Already live
			|| Object.values(this.syncros).every(s => !s.isSyncable) // Nothing mounted that streams
		) return Promise.resolve();
		if (navigator.onLine === false) return Promise.resolve(this.setSocketState('offline')); // Wait for the 'online' event instead of burning attempts

		this.clearReconnect();
		this.setSocketState('connecting');
		return Promise.resolve()
			.then(()=> this.settings.getToken())
			.then(bearerToken => {
				if (!this.isLeader) return; // Lost leadership while fetching the token - abort

				let wsUrl = new URL(`${this.settings.url}/sync/stream`);
				wsUrl.protocol = wsUrl.protocol == 'https:' ? 'wss:' : 'ws:';
				wsUrl.searchParams.set('token', bearerToken); // Browsers cannot attach an authorization header to WebSocket upgrades

				let socket = new WebSocket(wsUrl.toString());
				this.socket = socket;
				this.lastSeen = Date.now();
				socket.addEventListener('open', ()=> this.onSocketOpen(socket));
				socket.addEventListener('message', event => this.onSocketMessage(socket, event));
				socket.addEventListener('close', event => this.onSocketClose(socket, event));
			})
			.catch(e => {
				this.settings.debug('Stream socket connection failed', e);
				if (!this.settings.isAuthenticated()) return this.setSocketState('auth-expired'); // Token fetch failed while logged out - `resumeAuth()` resumes us
				this.scheduleReconnect();
			});
	}


	/**
	* Handle the shared stream socket opening - subscribe all replicated Syncros + start the heartbeat
	* NOTE: The reconnect backoff only resets after the connection proves stable for 30s so a
	*       crash-looping server that accepts upgrades then drops them keeps backing off
	*
	* @param {WebSocket} socket The socket that opened
	*/
	static onSocketOpen(socket) {
		if (this.socket != socket) return; // Superseded while opening
		this.settings.debug('Stream socket connected');
		this.setSocketState('connected');
		this.lastSeen = Date.now();

		clearTimeout(this.stabilityTimer);
		this.stabilityTimer = setTimeout(()=> this.reconnectAttempts = 0, 30_000);

		// (Re)subscribe every streaming Syncro + repull anything missed while the socket was down
		Object.values(this.syncros)
			.filter(s => s.isSyncable)
			.forEach(s => {
				this.sendSubscribe(s);
				s.resync$?.next();
			});

		// Heartbeat - ping while the socket is quiet, cycle it once it looks half-open
		clearInterval(this.heartbeatTimer);
		this.heartbeatTimer = setInterval(()=> {
			if (this.socket != socket || socket.readyState != WebSocket.OPEN) return;
			let idleTime = Date.now() - this.lastSeen;
			if (idleTime > this.settings.heartbeatInterval * 2.5) { // No traffic for 2.5 beats - assume half-open
				this.settings.debug('Stream socket unresponsive - cycling');
				this.cycleSocket();
			} else if (idleTime >= this.settings.heartbeatInterval) {
				socket.send(JSON.stringify({id: 'ping', method: 'ping', params: []}));
			}
		}, this.settings.heartbeatInterval);
	}


	/**
	* Handle an inbound message on the shared stream socket
	* Routes stream events to their Syncro by path + relays them to follower tabs
	*
	* @param {WebSocket} socket The socket the message arrived on
	* @param {MessageEvent} event The raw message event
	* @returns {Promise} A promise which resolves when the message has been processed
	*/
	static onSocketMessage(socket, {data}) {
		this.lastSeen = Date.now(); // Any inbound traffic counts as liveness (including ping answers)
		return Promise.resolve()
			.then(()=> JSON.parse(data))
			.then(msg => {
				if (msg.error) {
					this.settings.debug('Stream socket error response', msg.error);
					if (typeof msg.id == 'string' && msg.id.startsWith('sub:')) { // Subscribe rejected - that path stays on polling
						let path = msg.id.slice(4);
						let syncro = this.syncros[path];
						if (syncro) this.setPathState(path, 'polling');
					}
				} else if (msg.id == 'hello') {
					this.socketSessionId = msg.answer?.sessionId; // For log correlation with the tera-io worker
					this.events.emit('socketSession', this.socketSessionId);
					this.settings.debug('Stream socket session', this.socketSessionId);
				} else if (msg.id == 'stream') {
					let path = `${msg.collection}::${msg.documentId}`;
					let payload = {
						documents: (msg.answer?.documents || []).map(doc => ({
							id: doc.id,
							updatedAt: new Date(doc.edited_at).toISOString(),
							data: omit(doc.data, metadataKeys),
							_deleted: false,
						})),
						checkpoint: msg.answer?.checkpoint,
					};
					this.dispatchStream(path, payload);
					this.broadcastChannel?.postMessage({type: 'stream', path, payload}); // Relay to follower tabs
				} else if (typeof msg.id == 'string' && msg.id.startsWith('sub:')) { // Subscribe acknowledged
					let path = msg.id.slice(4);
					let syncro = this.syncros[path];
					if (syncro) {
						syncro.isSubscribed = true;
						this.setPathState(path, 'live');
					}
					this.broadcastLeaderState(); // Streaming path list changed
				} // Everything else (pongs, unsubscribe acks) only counts as liveness
			})
			.catch(e => this.settings.debug('Unparsable stream socket payload', e));
	}


	/**
	* Handle the shared stream socket closing, reacting to the servers close code:
	* - 4001 (token expired) / 4008 (planned session rotation) - reconnect immediately (with jitter), not counted as a failure
	* - Anything else - reconnect on the exponential backoff
	*
	* @param {WebSocket} socket The socket that closed
	* @param {CloseEvent} event The close event
	*/
	static onSocketClose(socket, event) {
		if (this.socket != socket) return; // Superseded / already detached by cycleSocket() or destroy()
		this.settings.debug(`Stream socket closed (code=${event?.code} reason=${event?.reason || 'none'})`);
		this.detachSocket();

		if ([4001, 4008].includes(event?.code)) { // Planned close - reconnect immediately, connectSocket() fetches a fresh token anyway
			this.scheduleReconnect({immediate: true, countFailure: false});
		} else {
			this.scheduleReconnect();
		}
	}


	/**
	* Common bookkeeping when the active socket stops being usable
	* Clears the heartbeat, marks every Syncro unsubscribed (reactivating their fallback polls) and
	* flags the connection state as down
	*/
	static detachSocket() {
		clearInterval(this.heartbeatTimer);
		clearTimeout(this.stabilityTimer);
		this.socket = null;
		this.socketSessionId = null;
		this.events.emit('socketSession', null);
		Object.values(this.syncros)
			.filter(s => s.isSyncable)
			.forEach(s => {
				s.isSubscribed = false;
				this.setPathState(s.path, 'polling');
			});
		this.setSocketState('disconnected');
	}


	/**
	* Cycle a half-open socket - detach + reconnect immediately rather than waiting out the close
	* handshake, which can take up to a TCP timeout on a dead connection
	*/
	static cycleSocket() {
		let socket = this.socket;
		this.detachSocket(); // Detach first so the sockets own close event becomes a no-op
		Promise.resolve()
			.then(()=> socket?.close())
			.catch(()=> {}); // Socket already closed - benign
		this.scheduleReconnect(); // Counts as a failure so repeated cycles back off
	}


	/**
	* Schedule a stream socket reconnect attempt
	* Skips quietly while offline (the 'online' listener resumes us), when not the leader or when an
	* attempt is already scheduled
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.immediate=false] Reconnect after only a small jitter instead of the exponential backoff
	* @param {Boolean} [options.countFailure=true] Whether this reconnect stems from a failure (increments the backoff counter)
	*/
	static scheduleReconnect(options) {
		if (this.reconnectTimer || !this.isLeader) return; // Already scheduled / not our job
		if (navigator.onLine === false) { // The 'online' listener resumes us
			this.setSocketState('offline');
			return;
		}

		let settings = {
			immediate: false,
			countFailure: true,
			...options,
		};
		let delay = settings.immediate
			? Math.random() * 1000 // Small jitter so rotated clients don't stampede the worker
			: Math.min(
				this.settings.streamReconnectMax,
				this.settings.streamReconnect * (2 ** this.reconnectAttempts),
			) * (0.5 + (Math.random() / 2));
		if (settings.countFailure) this.reconnectAttempts++;

		this.setSocketState('reconnecting');
		this.settings.debug(`Stream socket reconnecting in ${Math.ceil(delay)}ms`);
		this.reconnectTimer = setTimeout(()=> {
			this.reconnectTimer = null;
			this.connectSocket();
		}, delay);
	}


	/**
	* Cancel any pending reconnect attempt
	*/
	static clearReconnect() {
		clearTimeout(this.reconnectTimer);
		this.reconnectTimer = null;
	}


	/**
	* Set the overall connection state, broadcasting the change to follower tabs + wrapping services
	* @param {String} state The new `socketState`
	*/
	static setSocketState(state) {
		if (this.socketState == state) return;
		this.socketState = state;
		this.events.emit('socketState', state);
		this.broadcastLeaderState();
	}


	/**
	* Leader only - broadcast our connection state + actively streamed paths to follower tabs
	* Followers use this to decide whether their fallback polls can stay quiet (see `streamCovers()`)
	*/
	static broadcastLeaderState() {
		if (!this.isLeader || !this.broadcastChannel) return;
		this.broadcastChannel.postMessage({
			type: 'leader',
			state: this.socketState,
			paths: Object.values(this.syncros)
				.filter(s => s.isSubscribed)
				.map(s => s.path),
		});
	}


	/**
	* Emit a mapped stream payload into a Syncros replication stream
	*
	* @param {String} path The Syncro path the payload belongs to
	* @param {Object} payload The pre-mapped `{documents, checkpoint}` payload
	*/
	static dispatchStream(path, payload) {
		let syncro = this.syncros[path];
		if (!syncro?.stream$) return;
		if (payload.checkpoint?.updatedAt) syncro.lastCheckpoint = payload.checkpoint.updatedAt;
		syncro.stream$.next(payload);
	}


	/**
	* Send a subscribe request for a Syncro down the shared socket (no-op while the socket is down)
	* Seeds the servers stream checkpoint from our last known replication checkpoint so the first
	* stream event covers any offline gap
	*
	* @param {Syncro} syncro The syncro instance to subscribe
	*/
	static sendSubscribe(syncro) {
		if (!this.isSocketOpen()) return;
		this.socket.send(JSON.stringify({
			id: `sub:${syncro.path}`,
			collection: syncro.entity,
			method: 'subscribe',
			params: [syncro.id, syncro.lastCheckpoint || undefined],
		}));
	}


	/**
	* Send an unsubscribe request for a Syncro down the shared socket (no-op while the socket is down)
	* @param {Syncro} syncro The syncro instance to unsubscribe
	*/
	static sendUnsubscribe(syncro) {
		if (!this.isSocketOpen()) return;
		this.socket.send(JSON.stringify({
			id: `unsub:${syncro.path}`,
			collection: syncro.entity,
			method: 'unsubscribe',
			params: [syncro.id],
		}));
	}


	/**
	* Fire the resync trigger on every mounted Syncro - used after reconnects / wakes to catch up on
	* anything missed while detached
	*/
	static resyncAll() {
		Object.values(this.syncros).forEach(s => s.resync$?.next());
	}


	/**
	* Commit any pending debounced writes on all Syncros to their local RxDB documents immediately
	* Used when the page is backgrounded / closing so edits survive the tab dying
	*/
	static flushLocal() {
		Object.values(this.syncros).forEach(s => s.write.flush());
	}


	/**
	* Recover from an expired login - call when the user is logged in again
	* Quietly does nothing unless the stream connection is actually waiting on auth
	*/
	static resumeAuth() {
		if (this.socketState != 'auth-expired') return;
		this.reconnectAttempts = 0;
		this.connectSocket();
	}


	/**
	* Wire up cross-tab leadership, the follower relay channel + browser lifecycle listeners
	* Should be called once by the wrapping service after `connect()` has resolved:
	*
	* - Leader election: only one tab per browser holds the stream socket, followers receive relayed
	*   stream events + leader state over a BroadcastChannel
	* - online/offline: reconnect immediately when connectivity returns, pause reconnects while offline
	* - visibilitychange/pageshow: waking from sleep reconnects + resyncs immediately instead of waiting
	*   out a (possibly maxed) backoff timer, backgrounding flushes pending writes
	* - pagehide: flush pending writes + close the socket cleanly so the server releases the session
	*/
	static initLifecycle() {
		// Cross-tab leadership + follower relay channel
		this.broadcastChannel = typeof BroadcastChannel != 'undefined'
			? new BroadcastChannel(`tera-sync-${this.settings.databaseName}`)
			: null;
		this.broadcastChannel?.addEventListener('message', ({data: msg}) => {
			if (this.isLeader) return; // Leaders publish, followers consume
			if (msg.type == 'stream') {
				this.leaderLastSeen = Date.now();
				this.dispatchStream(msg.path, msg.payload);
				let syncro = this.syncros[msg.path];
				if (syncro) this.setPathState(msg.path, 'live');
			} else if (msg.type == 'leader') {
				this.leaderLastSeen = Date.now();
				this.leaderState = msg.state;
				this.leaderPaths = msg.paths || [];
			}
		});

		this.db.waitForLeadership().then(()=> {
			this.settings.debug('Elected sync leader for this browser');
			this.isLeader = true;
			this.events.emit('leader', true);
			this.leaderHeartbeatTimer = setInterval(()=> this.broadcastLeaderState(), 15_000);
			this.broadcastLeaderState();
			this.connectSocket(); // Take over streaming for anything already mounted
		});

		// Browser connectivity + wake listeners
		this.onlineListener = ()=> {
			this.settings.debug('Browser back online');
			this.reconnectAttempts = 0;
			this.clearReconnect();
			this.connectSocket();
			this.resyncAll();
		};
		this.offlineListener = ()=> {
			this.settings.debug('Browser offline');
			this.clearReconnect();
			this.setSocketState('offline');
		};
		this.wakeListener = ()=> {
			if (document.visibilityState == 'hidden') return this.flushLocal(); // Backgrounded - opportunistically commit pending writes
			if (this.isSocketOpen()) return;
			this.reconnectAttempts = 0; // Waking from sleep is not a server failure - don't inherit a maxed backoff
			this.clearReconnect();
			this.connectSocket();
			this.resyncAll();
		};
		this.sleepListener = ()=> { // Navigating away / closing - commit writes + close cleanly so the server releases the session promptly
			this.flushLocal();
			this.socket?.close(1000, 'Page hidden');
		};
		window.addEventListener('online', this.onlineListener);
		window.addEventListener('offline', this.offlineListener);
		window.addEventListener('pageshow', this.wakeListener);
		document.addEventListener('visibilitychange', this.wakeListener);
		window.addEventListener('pagehide', this.sleepListener);
	}


	/**
	* Tear down everything `initLifecycle()` wired up + release the stream socket
	* Mainly Vite HMR hygiene - the shared state otherwise lives for the app lifetime
	*/
	static teardownLifecycle() {
		this.isLeader = false; // Stops any further reconnect scheduling
		this.events.emit('leader', false);
		clearInterval(this.heartbeatTimer);
		clearInterval(this.leaderHeartbeatTimer);
		clearTimeout(this.stabilityTimer);
		this.clearReconnect();
		this.broadcastChannel?.close();
		this.broadcastChannel = null;
		window.removeEventListener('online', this.onlineListener);
		window.removeEventListener('offline', this.offlineListener);
		window.removeEventListener('pageshow', this.wakeListener);
		document.removeEventListener('visibilitychange', this.wakeListener);
		window.removeEventListener('pagehide', this.sleepListener);
		let socket = this.socket;
		if (socket) { // Detach before closing so the close handler doesn't schedule a reconnect
			this.socket = null;
			socket.close(1000, 'Service unmounted');
		}
	}


	/**
	* Perform a one-off fetch of a given Syncro path
	*
	* @param {String} path The Syncro entity + ID path. Takes the form `ENTITY::ID`
	*
	* @returns {Promise<Object|Null>} An eventual snapshot of the given path, if the entity doesn't exist null is returned
	*/
	static getSnapshot(path) {
		let {entity, id} = this.parsePath(path);

		return this.settings.http.get(`${this.settings.url}/${entity}/${id}`)
			.then(({data}) => data?.data ?? null)
			.catch(()=> null);
	}


	/**
	* Perform a one-off set/merge operation against a Syncro path
	*
	* @param {String} path The Syncro entity + ID path. Takes the form `ENTITY::ID`
	* @param {Object} state The new state to set/merge
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {'merge'|'set'} [options.method='merge'] How to apply the new state. NOTE: Only 'merge' is supported by the ReST endpoints
	*
	* @returns {Promise<*>} The state object after it has been applied
	*/
	static setSnapshot(path, state, options) {
		let settings = {
			method: 'merge',
			...options,
		};
		if (settings.method != 'merge') throw new Error('this.setSnapshot() only supports {method:"merge"} against the ReST sync endpoints');

		let {entity, id} = this.parsePath(path);

		return this.settings.http.post(`${this.settings.url}/${entity}/${id}`, state)
			.then(()=> this.getSnapshot(path));
	}


	/**
	* This instances fully formed string path
	* @type {String}
	*/
	path;


	/**
	* The entity segment of `path`, corresponds with the Supabase table
	* @type {String}
	*/
	entity;


	/**
	* The ID segment of `path`
	* @type {String}
	*/
	id;


	/**
	* Whether the entity has a ReST sync endpoint within the tera-io worker
	* @type {Boolean}
	*/
	isSyncable;


	/**
	* The RxDB collection holding this instances document, populated during `mount()`
	* @type {RxCollection}
	*/
	collection = null;


	/**
	* The reactive object mirroring the documents `data` payload
	* The nature of this varies by framework and what `Syncro.settings.getReactive()` provides
	* @type {any}
	*/
	value = null;


	/**
	* The reactive adapter wrapping `value`, see `Syncro.defaultReactive()` for the contract
	* @type {Object}
	*/
	reactive = null;


	/**
	* The current local RxDB document
	* @type {RxDocument}
	*/
	rxDoc = null;


	/**
	* Active RxDB replication state, if the entity is syncable
	* @type {RxReplicationState|null}
	*/
	replication = null;


	/**
	* Manual resync trigger, pushed into the replications pull stream
	* @type {Subject|null}
	*/
	resync$ = null;


	/**
	* Server push channel - the shared socket routes change events into this stream
	* @type {Subject|null}
	*/
	stream$ = null;


	/**
	* RxJS subscription piping local RxDB document changes into the reactive mirror
	* @type {Subscription|null}
	*/
	subscription = null;


	/**
	* Un-watch function for the outbound reactive->RxDB watcher
	* @type {Function|null}
	*/
	stopWatch = null;


	/**
	* Whether the shared stream socket has acknowledged a subscription for this path
	* @type {Boolean}
	*/
	isSubscribed = false;


	/**
	* Last known replication checkpoint stamp (epoch seconds), seeds reconnect subscriptions
	* @type {Number|null}
	*/
	lastCheckpoint = null;


	/**
	* Sequential empty fallback-poll pulls, drives the poll backoff
	* @type {Number}
	*/
	pollIdleStreak = 0;


	/**
	* Epoch before which the fallback interval poll is suppressed
	* @type {Number}
	*/
	nextPollAt = 0;


	/**
	* Guard - true while applying inbound RxDB state to the reactive mirror (suppresses the outbound watcher)
	* @type {Boolean}
	*/
	applying = false;


	/**
	* Debounced outbound writer - copies the reactive mirror into the local RxDB document
	* Populated in the constructor as it needs the instance + settings throttle
	* @type {Function}
	*/
	write;


	/**
	* Instance constructor
	*
	* @param {String} path Mount path for the Syncro. Should be in the form `${ENTITY}::${ID}`
	*/
	constructor(path) {
		let {entity, id, isSyncable} = Syncro.parsePath(path);
		this.path = path;
		this.entity = entity;
		this.id = id;
		this.isSyncable = isSyncable;

		this.write = debounce(()=> {
			if (!this.rxDoc) return;

			let state = this.reactive.getState();
			if (isEqual(state, this.rxDoc.get('data'))) return; // No genuine change (e.g. an inbound apply echoing through an async watcher) - skip

			return Promise.resolve()
				.then(()=> this.rxDoc.incrementalPatch({
					data: state,
				}))
				.then(rxDoc => this.rxDoc = rxDoc)
				.catch(e => this.debug('Outbound write failed', e))
		}, Syncro.settings.throttle);
	}


	/**
	* Debugging printer for this instance, prefixes all output with the Syncro path
	*
	* @param {...*} [msg] The message to output
	*/
	debug(...msg) {
		Syncro.settings.debug(`[Syncro://${this.path}]`, ...msg);
	}


	/**
	* Mount the remote document against this Syncro instance
	* This creates the local RxDB document (waiting on the initial replication cycle if we don't have a local
	* copy yet) and two-way binds it against a new reactive mirror
	*
	* @returns {Promise<Syncro>} A promise which resolves as this Syncro instance when completed
	*/
	mount() {
		return Promise.resolve()
			.then(()=> Syncro.collection(this.entity))
			.then(collection => this.collection = collection)
			.then(()=> {
				let reactive = this.reactive = (Syncro.settings.getReactive || Syncro.defaultReactive)({});
				if (!reactive.doc || !reactive.setState || !reactive.getState || !reactive.watch) throw new Error('Syncro getReactive() requires a returned `doc`, `setState()`, `getState()` + `watch()`');
				this.value = reactive.doc;

				Syncro.syncros[this.path] = this;

				if (this.isSyncable) {
					this.replication = this.replicate();
				} else {
					this.debug(`Entity "${this.entity}" has no ReST sync endpoint - mounting as local-only document`);
					Syncro.setPathState(this.path, 'local');
				}
			})
			// Fetch the local copy, waiting on the initial replication cycle if we don't have one yet
			// The wait is capped at `mountTimeout` so an offline cold-start still mounts (as an empty
			// local-first document) instead of blocking forever - replication merges upstream state when it recovers
			.then(()=> this.collection.findOne(this.id).exec())
			.then(rxDoc => {
				if (rxDoc || !this.replication) return rxDoc;

				return Promise.race([
					this.replication.awaitInitialReplication(),
					new Promise(resolve => setTimeout(resolve, Syncro.settings.mountTimeout)),
				])
					.then(()=> this.collection.findOne(this.id).exec());
			})
			.then(rxDoc => rxDoc || this.collection.insert({id: this.id, data: {}})) // Nothing local + nothing upstream (or unreachable) - start from an empty document
			.then(rxDoc => this.rxDoc = rxDoc)
			.then(()=> {
				// Inbound: RxDB document -> Reactive mirror
				this.subscription = this.collection.findOne(this.id).$.subscribe(doc => {
					if (!doc) return;
					this.rxDoc = doc;
					this.applying = true;
					this.reactive.setState(doc.get('data'));
					this.applying = false; // The outbound watcher is expected to fire synchronously so all echo callbacks have already run by this point - later mutations are genuine local writes
				});

				// Outbound: Reactive mirror -> RxDB document (debounced by `throttle`)
				this.stopWatch = this.reactive.watch(()=> {
					if (this.applying) return; // Change came from an inbound apply - ignore
					this.write();
				});
			})
			.then(()=> this);
	}


	/**
	* Create + start an RxDB replication for this instances document
	* This uses the tera-io worker GET + POST `/:entity/:id/sync` ReST endpoints as the remote master
	*
	* @returns {RxReplicationState} The created RxDB replication state
	*/
	replicate() {
		if (!Syncro.settings.canReplicate()) throw new Error('Cannot establish a Syncro for an unauthorized user');

		let url = `${Syncro.settings.url}/${this.entity}/${this.id}/sync`;
		let resync$ = this.resync$ = new Subject();
		let stream$ = this.stream$ = new Subject();

		// Server push channel via the `GET /:entity/:id/sync/stream` WebSocket with interval polling
		// as a fallback while the socket is down + a repull immediately after each push
		let pull$ = rxMerge(
			stream$, // Change events pushed down the sync/stream WebSocket
			resync$.pipe(map(()=> 'RESYNC')),
			interval(Syncro.settings.pollInterval).pipe(
				filter(()=>
					!Syncro.streamCovers(this) // Only poll while no live stream covers this path (own socket or the leader tabs)
					&& Date.now() >= this.nextPollAt // AND the adaptive idle backoff window has elapsed
				),
				map(()=> 'RESYNC'),
			),
		);

		// Establish the server push channel - the shared socket routes change events into `this.stream$`
		Syncro.setPathState(this.path, 'polling');
		Syncro.sendSubscribe(this); // Subscribe now if the shared socket is already open...
		Syncro.connectSocket(); // ...otherwise ensure its opening (leader only, no-op elsewhere)

		let replication = replicateRxCollection({
			collection: this.collection,
			replicationIdentifier: `tera-io-${this.path}`,
			live: true,
			retryTime: 5000,
			pull: {
				batchSize: 10,

				/**
				* Pull the document state from the tera-io sync getter endpoint
				*
				* @param {Object} [checkpoint] Last known checkpoint of the form `{id: String, updatedAt: Number}` (updatedAt in epoch seconds)
				* @param {Number} batchSize Maximum number of documents to fetch
				*
				* @returns {Promise<Object>} RxDB pull response of the form `{documents: Array, checkpoint: Object}`
				*/
				handler: (checkpoint, batchSize) => Promise.resolve()
					.then(()=> Syncro.settings.getToken())
					.then(bearerToken => Syncro.settings.http.get(url, {
						params: {
							updatedAt: checkpoint?.updatedAt || syncEpoch, // Always provide a checkpoint stamp so the endpoint responds with one
							limit: batchSize,
						},
						headers: {
							authorization: `Bearer ${bearerToken}`,
						},
					}))
					.then(({data}) => {
						// Adaptive fallback-poll bookkeeping - back off while pulls come back empty, snap back on activity
						if ((data.documents || []).length > 0) {
							this.pollIdleStreak = 0;
							this.nextPollAt = 0;
						} else {
							this.pollIdleStreak++;
							this.nextPollAt = Date.now() + Math.min(
								Syncro.settings.pollIntervalMax,
								Syncro.settings.pollInterval * (2 ** this.pollIdleStreak),
							);
						}

						let checkpointOut = data.checkpoint || checkpoint;
						if (checkpointOut?.updatedAt) this.lastCheckpoint = checkpointOut.updatedAt; // Remembered so reconnect subscriptions can seed the servers stream checkpoint

						return {
							documents: (data.documents || []).map(doc => ({
								id: doc.id,
								updatedAt: new Date(doc.edited_at).toISOString(),
								data: omit(doc.data, metadataKeys),
								_deleted: false,
							})),
							checkpoint: checkpointOut,
						};
					}),

				stream$: pull$,
			},
			push: {
				batchSize: 10,

				/**
				* Push local document changes to the tera-io sync setter endpoint
				*
				* @param {Array<Object>} rows RxDB replication rows of the form `{assumedMasterState: Object|undefined, newDocumentState: Object}`
				*
				* @returns {Promise<Array>} An eventual array of conflicting master states, if any
				*/
				handler: rows => {
					let payload = rows
						.filter(row => row.newDocumentState.id == this.id) // Other documents within this collection are handled by their own per-path replication
						.map(row => ({
							assumedMasterState: row.assumedMasterState?.updatedAt
								? {
									id: row.assumedMasterState.id,
									_deleted: row.assumedMasterState._deleted ?? false,
									updatedAt: row.assumedMasterState.updatedAt,
								}
								: null,
							newDocumentState: { // The endpoint merges everything except `id` into the rows JSONB `data` column
								...row.newDocumentState.data,
								id: row.newDocumentState.id,
								updatedAt: new Date().toISOString(),
							},
							dataPatch: jsonMergePatch( // Minimal merge diff so the endpoint can apply sub-document granularity writes (+ propagate key deletions)
								row.assumedMasterState?.data ?? {},
								row.newDocumentState.data ?? {},
							),
						}));

					if (payload.length == 0) return []; // No change payload - skip push

					return Promise.resolve()
						.then(()=> Syncro.settings.getToken())
						.then(bearerToken => Syncro.settings.http.post(url, payload, {
							headers: {
								authorization: `Bearer ${bearerToken}`,
							},
						}))
						.then(({data: conflicts}) => (conflicts || []).map(conflictData => ({
							id: conflictData?.id || this.id,
							updatedAt: conflictData?.updatedAt // The endpoint includes its authoritative `edited_at` stamp in conflict payloads
								? new Date(conflictData.updatedAt).toISOString()
								: new Date().toISOString(),
							data: omit(conflictData, ['id', ...metadataKeys]),
							_deleted: conflictData?._deleted ?? false,
						})))
						.finally(()=> resync$.next()) // The server assigns its own `edited_at` stamp on write - repull so the next push carries the true master timestamp
				},
			},
		});

		replication.error$.subscribe(e => this.debug('Replication error', e));

		return replication;
	}


	/**
	* Merge a single or multiple values into this Syncros reactive mirror
	* NOTE: Default behaviour is to flush (if any changes apply), use direct object mutation or `flush:false` to disable
	*
	* @param {String|Object} key Either the single named key to set OR the object to merge
	* @param {*} [value] The value to set if `key` is a string
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.delta=true] Only merge keys that differ, skipping flush if no changes are made
	* @param {Boolean} [options.flush=true] Commit + push the changes immediately on completion
	* @param {Boolean} [options.forceFlush=false] Flush even if no changes were made
	*
	* @returns {Promise<Syncro>} A promise which resolves with this Syncro instance on completion
	*/
	set(key, value, options) {
		// Argument mangling - [key, value, settings] -> changes{}, settings {{{
		let changes;
		if (typeof key == 'string') { // Called as (key:String, value:*, options?:Object)
			changes = {[key]: value};
		} else if (isPlainObject(key)) { // Called as (changes:Object, options?:Object)
			[changes, options] = [key, value];
		} else {
			throw new Error('Unknown call signature for set() - call with string+value or object');
		}
		// }}}

		let settings = {
			delta: true,
			flush: true,
			forceFlush: false,
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
				})
		} else {
			hasChanges = true;
			Object.assign(this.value, changes);
		}

		return Promise.resolve()
			.then(()=> // Optionally perform flush
				(settings.forceFlush || hasChanges)
				&& settings.flush
				&& this.flush()
			)
			.then(()=> this);
	}


	/**
	* Flush this Syncro manually
	* Commits any pending local write then waits for the replication cycle to settle in-sync
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	flush() {
		return Promise.resolve()
			.then(()=> this.write.flush())
			.then(()=> {
				if (!this.replication) return; // Local-only document - nothing to push upstream
				this.replication.reSync();
				return this.replication.awaitInSync();
			});
	}


	/**
	* Instance destruction trigger
	* This commits any pending local write, cancels the replication and removes the document from active tracking
	* The local copy remains in IndexedDB to warm-start the next mount, along with any un-pushed changes
	* which resume replication on the next mount of the same path
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	destroy() {
		this.debug('Destroy!');
		return Promise.resolve()
			.then(()=> {
				this.stopWatch?.();
				this.subscription?.unsubscribe();
				return this.write.flush(); // Commit any pending outbound write to the local RxDB copy
			})
			.then(()=> {
				if (this.isSubscribed) Syncro.sendUnsubscribe(this); // Release the servers stream subscription
				if (!this.replication) return;
				this.resync$?.complete();
				this.stream$?.complete();
				return this.replication.cancel();
			})
			.then(()=> {
				delete Syncro.syncros[this.path];
				delete Syncro.mounts[this.path];
				Syncro.setPathState(this.path, null);

				if (Syncro.isLeader && Object.values(Syncro.syncros).every(s => !s.isSyncable)) { // Last streaming document gone - release the shared socket
					Syncro.clearReconnect();
					let socket = Syncro.socket;
					if (socket) {
						Syncro.detachSocket();
						socket.close(1000, 'No active documents');
					}
					Syncro.setSocketState('idle');
				}
				Syncro.broadcastLeaderState(); // Streaming path list changed
			});
	}
}


/**
* Build a chaotic random tree structure based on dice rolls
* This function is mainly used for sync testing
*
* @param {Number} [depth=0] The current depth we are starting at, changes the nature of branches based on probability
*
* @returns {*} The current branch contents
*/
export function randomBranch(depth = 0) {
	/* eslint-disable @stylistic/indent -- Chained ternary formatting */
	const dice = // Roll a dice to pick the content
		depth == 0 ? 10 // first roll is always '10'
		: random(0, 11 - depth, false); // Subsequent rolls bias downwards based on depth (to avoid recursion)

	return (
		dice == 0 ? false
		: dice == 1 ? true
		: dice == 2 ? random(1, 10_000)
		: dice == 3 ? (new Date(random(1_000_000_000_000, 1_777_777_777_777))).toISOString()
		: dice == 5 ? Array.from({length: random(1, 10)}, () => random(1, 10))
		: dice == 6 ? null
		: dice < 8 ? Array.from({length: random(1, 10)}, () => randomBranch(depth+1))
		: Object.fromEntries(
			Array.from({length: random(1, 5)}, (v, k) => [
					sample(['foo', 'bar', 'baz', 'quz', 'flarp', 'corge', 'grault', 'garply', 'waldo', 'fred', 'plugh', 'thud'])
					+ `_${k}`,
					randomBranch(depth+1),
			])
		)
	)
}
