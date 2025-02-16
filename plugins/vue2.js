import {cloneDeep} from 'lodash-es';
import TeraFyPluginFirebase from './firebase.js';

/**
* Vue@2 observables plugin
*
* This function is expected to be included via the `terafy.use(MODULE, OPTIONS)` syntax rather than directly
*
* @class TeraFyPluginVue2
*
* @example Implementation within a Vue@2 project `src/main.js`:
* // Include the main Tera-Fy core
* import TeraFy from '@iebh/tera-fy';
* import TerafyVue from '@iebh/tera-fy/plugins/vue2';
* let terafy = new TeraFy()
*   .set('devMode', true) // Uncomment this line if you want TeraFy to be chatty
*   .set('siteUrl', 'http://localhost:7334/embed') // Uncomment this line if running TERA locally
*   .use(TerafyVue, { // Add the Vue plugin
*   	vue: window.Vue, // Assumes Vue is available on the window object
*   })
*
* // Include after app boot
* const app = new Vue({ ... })
* app.$mount("#app");
* await terafy.init({app});
*/
export default class TeraFyPluginVue2 extends TeraFyPluginFirebase {

	/**
	* Local Vue@2 library to use, set during constuctor
	*
	* @type {Vue}
	*/
	Vue;


	/**
	* The bound, reactive state of the active TERA project
	*
	* @type {Object}
	*/
	project = null;


	/**
	* Simple incrementor to ensure unique IDs for $watch expressions
	*
	* @type {Number{
	*/
	reactiveId = 1001;


	/**
	* Install into Vue@2
	*
	* @param {Object} options Additional options to mutate behaviour, see TeraFyPluginFirebase
	* @param {Object} options.app Root level Vue app to bind against
	* @param {Vue} options.Vue Vue@2 instance to bind against
	* @param {String} [options.globalName='$tera'] Global property to allocate this service as within Vue2
	* @param {*...} [options...] see TeraFyPluginFirebase
	*
	* @returns {Promise} A Promise which will resolve when the init process has completed
	*/
	async init(options) {
		let settings = {
			app: null,
			Vue: null,
			globalName: '$tera',
			...options,
		};

		if (!settings.Vue) throw new Error('Vue instance to use must be specified in init options as `Vue`');
		this.Vue = settings.Vue;

		if (!settings.app) throw new Error('Vue Root / App instance to use must be specified in init options as `app`');
		this.app = settings.app;

		// Make this module available globally
		if (settings.globalName)
			this.Vue.prototype[settings.globalName] = this;

		await super.init(settings); // Initalize parent class Firebase functionality

		this.project = await this.mountNamespace('_PROJECT');
	}


	/** @override */
	getReactive(value) {
		let doc = this.Vue.observable(value);

		let watcherPath = `_teraFy_${this.reactiveId++}`;
		this.app[watcherPath] = doc; // Attach onto app so we can use $watch later on

		return {
			doc,
			setState(state) {
				// Shallow copy all sub-keys into existing object (keeping the object pointer)
				Object.entries(state || {})
					.forEach(([k, v]) => doc[k] = v)
			},
			getState() {
				return cloneDeep(doc);
			},
			watch: cb => {
				this.app.$watch(watcherPath, cb, {deep: true});
			},
		};
	}



	/**
	* Return a Vue Observable object that can be read/written which whose changes will transparently be written back to the TERA server instance
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {VueComponent} [options.component] Component to use to bind $watch events
	* @param {String} [options.componentKey] Key within the component to attach the state. Defaults to a random string
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {String|Boolean} [options.bindKey='project'] If set, creates the binding also as the specified key within the main Tera object, if falsy just returns the observable
	* @param {Boolean} [options.read=true] Allow remote reactivity - update the local state when the server changes
	* @param {Boolean} [options.write=true] Allow local reactivity to writes - send these to the server
	* @param {Object} [options.throttle] Lodash debounce options + `wait` key used to throttle all writes, set to falsy to disable
	*
	* @returns {Promie<VueObservable<Object>>} A Vue.Observable object representing the project state
	*/
	bindProjectState(options) {
		let settings = {
			component: null,
			componentKey: null,
			autoRequire: true,
			read: true,
			write: true,
			throttle: {
				wait: 200,
				maxWait: 2000,
				leading: false,
				trailing: true,
			},
			...options,
		};

		return Promise.resolve()
			.then(()=> Promise.all([
				// Fetch initial state {{{
				this.getProjectState({
					autoRequire: settings.autoRequire,
				}),
				// }}}
				// Allocate component[componentKey] to stash our observable {{{
				(()=> {
					if (settings.componentKey) return; // Already allocated by user
					for (let x = 0; x < 50; x++) {
						let key = `terafy_${x}`;
						if (!Object.hasOwnProperty(settings.component, key)) {
							settings.componentKey = key;
							return;
						}
					}
					throw new Error('Unable to find unique key to allocate against Vue2 component');
				})(),
				// }}}
			]))
			.then(([snapshot]) => {
				this.debug('INFO', 2, 'Got project snapshot', snapshot);

				// Create initial Observable
				let stateObservable = this.Vue.observable(snapshot);

				// Allocate to component
				settings.component[settings.componentKey] = stateObservable;

				// Watch for remote changes and update
				if (settings.read) {
					this.events.on(`update:projects/${stateObservable.id}`, newState => {
						if (
							newState?.lastPatch?.session // Last state change had a session worth noting
							&& newState.lastPatch.session == this.settings.session  // The last state update was made FROM INSIDE THE BUILDING! BUWHAHAHA!
						)
							return; // Discard it, we don't care

						// Everything else - patch the remote state locally
						this.debug('INFO', 5, 'Update Vue2 Remote->Local', {new: newState, old: stateObservable});

						this.merge(stateObservable, newState);
					});
				}

				// Watch for local writes and react
				if (settings.write) {
					if (!settings.component) throw new Error('bindProjectState requires a VueComponent specified as `component`');

					// NOTE: The below $watch function returns two copies of the new value of the observed
					//       so we have to keep track of what changed ourselves by initalizing against the
					//       snapshot
					let oldVal = cloneDeep(snapshot);

					// Function to handle the state update (can be debounced)
					let watchHandle = ()=> {
						let newVal = cloneDeep(snapshot);

						this.debug('INFO', 5, 'Update Vue2 Local->Remote', {new: newVal, old: oldVal});
						this.createProjectStatePatch(newVal, oldVal);

						// Set oldVal to the deep clone we just made so we can track the diff
						oldVal = newVal;
					};

					settings.component.$watch(
						settings.componentKey, // State to watch
						settings.throttle // Pointer to watchHandle which takes the new state (optionally throttled)
							? debounce(watchHandle, settings.throttle.wait, settings.throttle)
							: watchHandle,
						{ // Watch options
							deep: true,
						},
					);
				}

				// Return Vue Reactive
				return stateObservable;
			})
	}


	/**
	* Internal function to merge an existing Vue2 Observable with an incomming object
	*
	* @param {VueObservable} target The target object to merge with
	* @param {Object} payload The sub-objects to merge into the Observable
	* @returns {VueObservable} The input target with all payloads merged
	*/
	merge(target, ...payload) {
		payload.forEach(pl =>
			Object.keys(pl)
				.forEach(k => {
					if (isPlainObject(pl[k])) { // Setting sub-objects - we need to recurse these in Vue2 in case a sub-key gets glued on
						if (!(k in target)) // Destination to merge doesn't exist yet - create it
							this.Vue.set(target, k, {});

						this.merge(target[k], pl[k]);
					} else {
						this.Vue.set(target, k, pl[k])
					}
				})
		);

		return target;
	}

}
