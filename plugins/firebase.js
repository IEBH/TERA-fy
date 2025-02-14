import TeraFyPluginBase from './base.js';

export default class TeraFyPluginFirebase extends TeraFyPluginBase {

	/**
	* Local Firebase instance we are using
	*
	* @type {Firebase}
	*/
	firebase;


	/**
	* Local Firestore instance we are using
	*
	* @type {Firestore}
	*/
	firestore;


	/**
	* Setup Firebase + Firestore
	*
	* @param {Object} options Additional options to mutate behaviour (defaults to the main teraFy settings)
	*
	* @returns {Promise} A Promise which will resolve when the init process has completed
	*/
	init(options) {
		let settings = {
			...options,
			firebaseApiKey: null,
			firebaseAuthDomain: null,
			firebaseProjectId: null,
			firebaseAppId: null,
		};
		if (!settings.firebaseApiKey || !settings.firebaseAuthDomain || !settings.firebaseProjectId || !settings.firebaseAppId)
			throw new Error('Firebase requires `firebaseApiKey`, `firebaseAuthDomain`, `firebaseProjectId` and `firebaseAppId`');

		this.firebase = Firebase({
			apiKey: settings.firebaseApiKey,
			authDomain: settings.firebaseAuthDomain,
			projectId: settings.firebaseProjectId,
			appId: settings.firebaseAppId,
		});
		this.firestore = markRaw(Firestore(this.firebase));
	}


	_mountNamespace(name) {
	}


	_unmountNamespace(name) {
	}
}
