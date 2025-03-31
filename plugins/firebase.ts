import {initializeApp as Firebase, FirebaseApp} from 'firebase/app';
import {getFirestore as Firestore, Firestore as FirestoreInstance} from 'firebase/firestore';
import {createClient as Supabase, SupabaseClient} from '@supabase/supabase-js'
import Syncro from '../lib/syncro/syncro.js';
import TeraFyPluginBase from './base.js';


/**
* Plugin which adds Firebase / Firestore support for namespace mounts
*
* @class TeraFyPluginFirebase
*/
export default class TeraFyPluginFirebase extends TeraFyPluginBase {

	/**
	* Lookup object of mounted Syncro objects by path
	*
	* @type {Object<Syncro>}
	*/
	syncros: Record<string, Syncro> = {};
	namespaces: Record<string, any> = {}; // Declare namespaces property

	// Declare properties expected by the class methods or potentially inherited
	getCredentials!: () => Promise<Record<string, any>>;
	requireProject!: () => Promise<{ id: string }>;
	debug!: (...args: any[]) => void;


	/**
	* @interface
	* The Syncro#reactive option to use when creating new Syncro instances
	* This is expected to be overriden by other plugins
	* If falsy the Syncro module will fall back to its internal (POJO only) getReactive() function
	*
	* @name getReactive
	* @type {Function} A reactive function as defined in Syncro
	*/
	getReactive?: Function;


	/**
	* Setup Firebase + Firestore + Supabase
	* Default credentials (Firebase + Supabase) will be retrieved from `getCredentials()` unless overriden here
	*
	* @param {Object} options Additional options to mutate behaviour (defaults to the main teraFy settings)
	* @param {String} [options.firebaseApiKey] Firebase API key
	* @param {String} [options.firebaseAuthDomain] Firebase authorized domain
	* @param {String} [options.firebaseProjectId] Firebase project ID
	* @param {String} [options.firebaseAppId] Firebase App ID
	* @param {String} [options.supabaseUrl] Supabase URL
	* @param {String} [options.supabaseKey] Supabase client key
	*
	* @returns {Promise} A Promise which will resolve when the init process has completed
	*/
	async init(options?: any): Promise<void> { // Add optional '?' and type 'any', keep async Promise<void>
		let settings = {
			firebaseApiKey: null,
			firebaseAuthDomain: null,
			firebaseProjectId: null,
			firebaseAppId: null,
			supabaseUrl: null,
			supabaseKey: null,
			...await this.getCredentials(),
			...options,
		};

		let emptyValues = Object.keys(settings).filter(k => k === null);
		if (emptyValues.length > 0)
			throw new Error('Firebase plugin requires mandatory options: ' + emptyValues.join(', '));

		Syncro.firebase = Firebase({
			apiKey: settings.firebaseApiKey!, // Add non-null assertion
			authDomain: settings.firebaseAuthDomain!, // Add non-null assertion
			projectId: settings.firebaseProjectId!, // Add non-null assertion
			appId: settings.firebaseAppId!, // Add non-null assertion
		});
		Syncro.firestore = Firestore(Syncro.firebase); // Use Syncro.firebase

		Syncro.supabase = Supabase(settings.supabaseUrl!, settings.supabaseKey!); // Add non-null assertions
	}


	/**
	* Mount the given namespace against `namespaces[name]`
	*
	* @param {'_PROJECT'|String} name The name/Syncro path of the namespace to mount (or '_PROJECT' for the project mountpoint)
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	_mountNamespace(name: string): Promise<void> { // Add type 'string'
		let syncro: Syncro; // Add type Syncro

		return Promise.resolve()
			.then(()=> this.requireProject())
			.then(project => {
				let path = name == '_PROJECT'
					? `projects::${project.id}`
					: `project_namespaces::${project.id}::${name}`;

				syncro = this.syncros[name] = new Syncro(path, {
					debug: (...msg: any[]) => this.debug(`SYNCRO://${path}`, ...msg), // Add type any[]
					getReactive: this.getReactive, // Try to inherit this instances getReactive prop, otherwise Syncro will fall back to its default
				});

				// Perform the mount action
				return syncro.mount();
			})
			.then(()=> { // Assign local state
				this.namespaces[name] = syncro.value;
			})
	}


	/**
	* Unmount the given namespace from `namespaces[name]`
	*
	* @param {String} name The name/Syncro path of the namespace to unmount
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	_unmountNamespace(name: string): Promise<void | any[]> { // Add type 'string'
		let syncro = this.syncros[name]; // Create local alias for Syncro before we detach it

		// Detach local state
		delete this.namespaces[name];
		delete this.syncros[name];

		// Check if syncro exists before calling destroy
		if (syncro) {
			return syncro.destroy(); // Trigger Syncro distruction
		} else {
			return Promise.resolve(); // Or handle the case where syncro doesn't exist
		}
	}
}