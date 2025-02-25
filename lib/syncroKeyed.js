import {chunk} from 'lodash-es';
import {doc as FirestoreDocRef, getDoc as FirestoreGetDoc} from 'firebase/firestore';
import Syncro, {syncEntities} from './syncro.js';

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
	keyedConfig = {
		maxKeys: 2,
	};


	/**
	* Various storage about keyed path
	*/
	keyedPath = {
		getKey(path, index) {
			return path + '_' + index;
		},
	};


	/**
	* Member Syncros which form part of this meta Syncro
	*
	* @type {Array<Syncro>}
	*/
	members = [];


	/**
	* Instance constructor
	*
	* @param {String} path Mount path for the Syncro. Should be in the form `${ENTITY}::${ID}(::${RELATION})?_*` (must contain a '*' operator)
	* @param {Object} [options] Additional instance setters (mutates instance directly)
	*/
	constructor(path, options) {
		super(path, options);

		if (!/\*/.test(path)) throw new Error('SyncroKeyed paths must contain at least one asterisk as an object pagination indicator');

		let {prefix, suffix} = /^(?<prefix>.+)\*(?<suffix>.*)$/.exec(path).groups;
		this.keyedPath.getKey = (path, index) => `${prefix}${index}${suffix}`;
	}


	/**
	* Destroy all Syncro members
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	async destroy() {
		this.debug('Destroy!');
		await Promise.all(
			this.members.map(member =>
				member.destroy()
			)
		);

		this.members = [];
	}


	/**
	* Mount this SyncroKeyed instance
	* i.e. Fetch all members and mount them locally creating a Proxy
	*
	* @returns {Promise<Syncro>} A promise which resolves as this SyncroKeyed instance when completed
	*/
	mount() {
		let {entity, id, relation, fsCollection, fsId} = Syncro.pathSplit(this.path, {allowAsterisk: true});

		return Promise.resolve()
			.then(()=> new Promise(resolve => { // Mount all members by looking for similar keys
				this.members = []; // Reset member list

				let seekMember = async (index) => {
					let memberId = fsId.replace('*', ''+index);
					this.debug('Seek keyedMember', fsCollection, '#', memberId);

					let docRef = FirestoreDocRef(Syncro.firestore, fsCollection, memberId);

					let doc = await FirestoreGetDoc(docRef);
					if (doc.exists()) { // Found a matching entry
						// Expand member lookup with the new member by its numeric index
						this.keyedMembersExpand(index);

						// Queue up next member fetcher
						setTimeout(()=> seekMember(index+1));
					} else { // Likely reached end of possible members
						resolve();
					}
				};

				seekMember(0); // Look for first member
			}))
			.then(async ()=> { // No members? Go fetch at least one and populate the initial (missing) state
				if (this.members.length > 0) return;

				// Create at least one member in the registry
				await this.keyedMembersExpand(0);

				this.debug('Populate initial SyncroKeyed state');

				// Extract base data + add document and return new hook
				if (!syncEntities[entity]) throw new Error(`Unknown Sync entity "${entity}"`);

				// Go fetch the initial state object
				let state = await syncEntities[entity].initState({
					supabase: Syncro.supabase,
					fsCollection, fsId,
					entity, id, relation,
				});

				await this.keyedAssign(state);
			})
			.then(()=> this.value = this.proxy())
	}


	/**
	* Return a Proxy which will map setter/getter actions to their correct member
	*
	* @returns {Proxy} A proxy of all combined members
	*/
	proxy() {
		return new Proxy({}, {
			// Return the full list of keys
			ownKeys: (target) => {
				return this.members.flatMap(m => Object.keys(m.value));
			},

			// Return if we have a lookup key
			has: (target, prop) => {
				return this.members.some(m => !! m.value[prop]);
			},

			// Scope through members until we get a hit on the key
			get: (target, prop) => {
				let targetMember = this.members.find(m => prop in m.value);
				return targetMember ? targetMember[prop] : undefined;
			},

			// Set the member key if one already exists, otherwise overflow onto the next member
			set: (target, prop, value) => {
				let targetMember = this.members.find(m => prop in m.value);
				if (targetMember) {
					targetMember[prop] = value;
				} else {
					this.keyedSet(prop, value);
				}
			},

			// Remove a key
			deleteProperty: (target, prop) => {
				let targetMember = this.members.find(m => prop in m);
				if (targetMember) targetMember.value[prop];
			},
		});
	}


	/**
	* Flush all member states
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.destroy=false] Instruct the server to also dispose of the Syncro state
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	async flush(options) {
		let settings = {
			destroy: false,
			...options,
		};

		await Promise.all(
			this.members.map(member =>
				member.flush({
					destroy: settings.destroy,
				})
			)
		);

		if (settings.destroy) await this.destroy();
	}


	/**
	* Set a given key against the next available member
	* This will either pick the next available member with keys below `config.maxKeys` or extend the member array and append to it
	*
	* @param {String} key The key to set
	* @param {*} value The value to set
	*
	* @returns {Promise<*>} A promise which resolves when the operation has completed with the set value
	*/
	async keyedSet(key, value) {
		let candidateMember = this.members.find(m => Object.keys(m.value).length < this.config.maxKeys);
		if (candidateMember) {
			return candidateMember.value[key] = value;
		} else { // No candidate - need to expand then set
			// Extend members
			await this.keyedMembersExpand();

			// Sanity check
			let candidateMember = this.members.at(-1);
			if (Object.keys(candidateMember).length >= this.config.maxKeys) throw new Error(`Need to append key "${key}" but newly added member doesnt have enough room. Member offset #${this.members.length-1} has size of ${Object.keys(candidateMember).length}`);

			return candidateMember.value[key] = value;
		}
	}


	/**
	* Assign an entire in-memory object to members
	* This can be thought of as the optimized equivelent of Object.assign()
	* Use this when merging large objects as it can make optimizations
	*
	* @param {Object} state The value to merge
	*/
	async keyedAssign(state) {
		// Can we assume we have a blank state - this speeds up existing key checks significantly
		let isBlank = this.members.length == 1 && Object.keys(this.members[0].value).length == 0;

		if (isBlank) {
			let chunks = chunk(Object.entries(state), this.keyedConfig.maxKeys)
				.map(chunk => Object.fromEntries(chunk));

			await Promise.all(
				chunks.map(async (chunk, chunkIndex) => {
					this.debug(`Assign chunk #${chunkIndex} content`, {chunk});

					// Create chunk document if its missing
					if (!this.members[chunkIndex]) await this.keyedMembersExpand(chunkIndex);

					// Populate its state
					await this.members[chunkIndex].setFirestoreState(chunk, {method: 'set'});
				})
			);

		} else { // Non-blank - call keyedSet() on each key of state, merging slowly
			await Array.fromAsync( // In a promise-series chain call keyedSet for each item
				Object.entries(state),
				([key, val]) => this.keyedSet(key, val),
			);
		}
	}


	/**
	* Extend the member pool by one member
	*
	* @param {Number} [index] The index to use when expanding, if omitted the next index offset is used
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	async keyedMembersExpand(index) {
		index ??= this.members.length;
		if (this.members[index]) throw new Error(`keyedMembersExpand(${index}) but index already exists`);; // Member already exists

		let syncroPath = this.keyedPath.getKey(this.path, index);
		let {fsCollection, fsId} = Syncro.pathSplit(syncroPath);
		this.debug('Expand SyncroKeyed size to index=', index);

		// Create a new Syncro member, inheriteing some details from this parent item
		let syncro = new Syncro(`${fsCollection}::${fsId}`, {
			debug: this.debug,
			getReactive: this.getReactive,
		});

		// Wait for mount to complete
		await syncro.mount({
			initialState: {}, // Force intital state to empty object so we don't get stuck in a loop
		});

		this.members.push(syncro);
	}

}
