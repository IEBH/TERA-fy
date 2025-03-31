import { chunk } from 'lodash-es';
import { doc as FirestoreDocRef, getDoc as FirestoreGetDoc } from 'firebase/firestore';
import Syncro from './syncro.js';
import SyncroEntities from './entities.js';
/**
* @class SyncroKeyed
* TERA Isomorphic SyncroKeyed class
* Collate a single (potencially very large) single Syncro object by spltting it acrtoss multiple Syncros
* This makes the assumption that the Syncro content is a large object collection of objects - a keyed map collection
* The original impetus is to allow TERA citation libraries to be held in a Syncro object and flushed back to Supabase when editing has completed
*/
export default class SyncroKeyed extends Syncro {
    /**
    * Instance constructor
    *
    * @param {String} path Mount path for the Syncro. Should be in the form `${ENTITY}::${ID}(::${RELATION})?_*` (must contain a '*' operator)
    * @param {Object} [options] Additional instance setters (mutates instance directly)
    */
    constructor(path, options) {
        super(path, options);
        /**
        * Config used by this instance to configure behaviour
        *
        * @type {Object}
        * @property {Number} maxKeys The maximum number of keys a member can contain before needing to add a member
        */
        this.keyedConfig = {
            maxKeys: 2,
        };
        /**
        * Various storage about keyed path
        */
        this.keyedPath = {
            getKey(path, index) {
                return path + '_' + index;
            },
        };
        /**
        * Member Syncros which form part of this meta Syncro
        *
        * @type {Array<Syncro>}
        */
        this.members = [];
        if (!/\*/.test(path))
            throw new Error('SyncroKeyed paths must contain at least one asterisk as an object pagination indicator');
        let { prefix, suffix } = /^(?<prefix>.+)\*(?<suffix>.*)$/.exec(path).groups;
        this.keyedPath.getKey = (path, index) => `${prefix}${index}${suffix}`;
    }
    /**
    * Destroy all Syncro members
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    async destroy() {
        this.debug('Destroy!');
        await Promise.all(this.members.map(member => member.destroy()));
        this.members = [];
        return []; // Return empty array cast to never[] to satisfy signature
    }
    /**
    * Mount this SyncroKeyed instance
    * i.e. Fetch all members and mount them locally creating a Proxy
    *
    * @param {any} [options] Optional mount options (ignored by SyncroKeyed but needed for signature match)
    * @returns {Promise<Syncro>} A promise which resolves as this SyncroKeyed instance when completed
    */
    mount(options) {
        // Cast the result to the expected interface
        let { entity, id, relation, fsCollection, fsId } = Syncro.pathSplit(this.path, { allowAsterisk: true });
        return Promise.resolve()
            .then(() => new Promise(resolve => {
            this.members = []; // Reset member list
            let seekMember = async (index) => {
                let memberId = fsId.replace('*', '' + index);
                this.debug('Seek keyedMember', fsCollection, '#', memberId);
                let docRef = FirestoreDocRef(Syncro.firestore, fsCollection, memberId);
                let doc = await FirestoreGetDoc(docRef);
                if (doc.exists()) { // Found a matching entry
                    // Expand member lookup with the new member by its numeric index
                    await this.keyedMembersExpand(index);
                    // Queue up next member fetcher
                    setTimeout(() => seekMember(index + 1));
                }
                else { // Likely reached end of possible members
                    resolve();
                }
            };
            seekMember(0); // Look for first member
        }))
            .then(async () => {
            if (this.members.length > 0)
                return;
            // Create at least one member in the registry
            await this.keyedMembersExpand(0);
            this.debug('Populate initial SyncroKeyed state');
            // Extract base data + add document and return new hook
            const entityKey = entity;
            if (!SyncroEntities[entityKey])
                throw new Error(`Unknown Sync entity "${entity}"`);
            // Go fetch the initial state object
            let state = await SyncroEntities[entityKey].initState({
                supabase: Syncro.supabase,
                id, relation,
            });
            await this.keyedAssign(state);
        })
            .then(() => {
            let reactive = this.getReactive(this.proxy());
            // Assuming this.value should hold the reactive proxy
            // If this.value is inherited and has a specific type, this might need adjustment
            this.value = reactive.doc;
        })
            .then(() => this);
    }
    /**
    * Return a Proxy which will map setter/getter actions to their correct member
    *
    * @returns {Proxy} A proxy of all combined members
    */
    proxy() {
        return new Proxy(this, {
            // Return the full list of keys
            ownKeys(target) {
                return target.members.flatMap(m => Object.keys(m.value || {}));
            },
            // Return if we have a lookup key
            has(target, prop) {
                // Ensure m.value exists before checking property
                return target.members.some(m => m.value && prop in m.value);
            },
            // Scope through members until we get a hit on the key
            get(target, prop) {
                let targetMember = target.members.find(m => m.value && prop in m.value);
                // Access value via targetMember.value if found
                return targetMember ? targetMember.value[prop] : undefined;
            },
            // Set the member key if one already exists, otherwise overflow onto the next member
            set(target, prop, value) {
                let targetMember = target.members.find(m => m.value && prop in m.value);
                if (targetMember && targetMember.value) {
                    targetMember.value[prop] = value;
                }
                else {
                    // Assuming keyedSet handles adding the value appropriately
                    target.keyedSet(prop, value); // Cast prop to string if keyedSet expects string
                }
                return true; // Proxy set must return boolean
            },
            // Remove a key
            deleteProperty(target, prop) {
                let targetMember = target.members.find(m => m.value && prop in m.value);
                if (targetMember && targetMember.value) {
                    delete targetMember.value[prop];
                    return true; // Indicate success
                }
                return false; // Indicate key not found or failure
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
        await Promise.all(this.members.map(member => member.flush({
            destroy: settings.destroy,
        })));
        if (settings.destroy)
            await this.destroy();
        return; // Return void to match signature
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
        let candidateMember = this.members.find(m => m.value && Object.keys(m.value).length < this.keyedConfig.maxKeys);
        if (candidateMember?.value) {
            candidateMember.value[key] = value;
            return value;
        }
        else { // No candidate - need to expand then set
            // Extend members
            await this.keyedMembersExpand(); // Call without index to append
            // Get the newly added member
            let newMember = this.members.at(-1);
            if (!newMember || !newMember.value) {
                throw new Error('Failed to expand members or new member has no value object');
            }
            // Sanity check (check the new member's value)
            if (Object.keys(newMember.value).length >= this.keyedConfig.maxKeys) {
                throw new Error(`Need to append key "${key}" but newly added member (offset #${this.members.length - 1}) has size of ${Object.keys(newMember.value).length}, exceeding maxKeys ${this.keyedConfig.maxKeys}`);
            }
            newMember.value[key] = value;
            return value;
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
        // Ensure members[0] and its value exist
        let isBlank = this.members.length === 1 && this.members[0]?.value && Object.keys(this.members[0].value).length === 0;
        if (isBlank) {
            let chunks = chunk(Object.entries(state), this.keyedConfig.maxKeys)
                .map(chunk => Object.fromEntries(chunk));
            await Promise.all(chunks.map(async (chunk, chunkIndex) => {
                this.debug(`Assign chunk #${chunkIndex} content`, { chunk });
                // Create chunk document if its missing
                if (!this.members[chunkIndex])
                    await this.keyedMembersExpand(chunkIndex);
                // Ensure the member exists and has setFirestoreState method
                const member = this.members[chunkIndex];
                if (member && typeof member.setFirestoreState === 'function') {
                    // Populate its state - Cast to any temporarily if setFirestoreState is not public/recognized
                    await member.setFirestoreState(chunk, { method: 'set' });
                }
                else {
                    console.warn(`Member at index ${chunkIndex} is missing or does not have setFirestoreState`);
                }
            }));
        }
        else { // Non-blank - call keyedSet() on each key of state, merging slowly
            // Replace Array.fromAsync with a standard loop
            for (const [key, val] of Object.entries(state)) {
                await this.keyedSet(key, val);
            }
        }
    }
    /**
    * Extend the member pool by one member
    *
    * @param {Number} [index] The index to use when expanding, if omitted the next index offset is used
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    async keyedMembersExpand(index) {
        index = index ?? this.members.length; // Use provided index or next available slot
        if (this.members[index]) {
            // If member already exists (e.g., during initial seek), just ensure it's mounted.
            // If it was called intentionally with an existing index, maybe log a warning or skip.
            this.debug(`keyedMembersExpand called for existing index ${index}, ensuring mounted.`);
            if (!this.members[index].value) { // If it exists but isn't mounted somehow
                await this.members[index].mount({ initialState: {} });
            }
            return; // Exit if member already exists
        }
        let syncroPath = this.keyedPath.getKey(this.path, index);
        // Pass empty options object {} or specify allowAsterisk: false if needed
        let { fsCollection, fsId } = Syncro.pathSplit(syncroPath, {});
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
        // Insert at the correct index if specified, otherwise push
        if (index < this.members.length) {
            this.members.splice(index, 0, syncro);
        }
        else {
            this.members.push(syncro);
        }
    }
}
//# sourceMappingURL=keyed.js.map