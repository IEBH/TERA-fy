import {cloneDeep, debounce} from 'lodash-es';
import TeraFyPluginBase from './base.js';
import {reactive, watch} from 'vue';

/**
* Vue observables plugin
* Provides the `bindProjectState()` function for Vue based projects
*
* This function is expected to be included via the `terafy.use(MODULE, OPTIONS)` syntax rather than directly
*
* @class TeraFyPluginVue
*
* @example Implementation within a Vue3 / Vite project within `src/main.js`:
* import TeraFy from '@iebh/tera-fy';
* import TerafyVue from '@iebh/tera-fy/plugins/vue';
* let terafy = new TeraFy()
*   .set('devMode', import.meta.env.DEV)
*   .set('siteUrl', 'http://localhost:7334/embed') // Uncomment this line if running TERA locally
*   .use(TerafyVue) // Add the Vue plugin
*
* terafy.init(); // Initialize everything
*
* app.use(terafy.vuePlugin({
*   globalName: '$tera', // Install as vm.$tera into every component
* }));
*/
export default class TeraFyPluginVue extends TeraFyPluginBase {

	/**
	* Return a Vue reactive object that can be read/written which whose changes will transparently be written back to the TERA server instance
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Boolean} [options.read=true] Allow remote reactivity - update the local state when the server changes
	* @param {Boolean} [options.write=true] Allow local reactivity to writes - send these to the server
	* @param {Object} [options.throttle] Lodash debounce options + `wait` key used to throttle all writes, set to falsy to disable
	*
	* @returns {Promie<Reactive<Object>>} A reactive object representing the project state
	*/
	bindProjectState(options) {
		let settings = {
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
			.then(()=> this.getProjectState({
				autoRequire: settings.autoRequire ,
			}))
			.then(snapshot => {
				// Create initial reactive
				let stateReactive = reactive(snapshot);

				// Watch for remote changes and update
				if (settings.read) {
					this.events.on(`update:projects/${stateReactive.id}`, newState => {
						if (
							newState?.lastPatch?.session // Last state change had a session worth noting
							&& newState.lastPatch.session == this.settings.session  // The last state update was made FROM INSIDE THE BUILDING! BUWHAHAHA!
						)
							return; // Discard it, we don't care

						// Everything else - patch the remote state locally
						Object.assign(stateReactive, newState);
					});
				}

				// Watch for local writes and react
				if (settings.write) {

					// NOTE: The below watch function returns two copies of the new value of the observed
					//       so we have to keep track of what changed ourselves by initalizing against the
					//       snapshot
					let oldVal = cloneDeep(snapshot);

					// Function to handle the state update (can be debounced)
					let watchHandle = newVal => {
						this.createProjectStatePatch(newVal, oldVal);
						oldVal = cloneDeep(newVal); // Update old state the the last seen value
					};

					watch(
						stateReactive, // State to watch
						settings.throttle // Pointer to watchHandle which takes the new state (optionally throttled)
							? debounce(watchHandle, settings.throttle.wait, settings.throttle)
							: watchHandle,
						{ // Watch options
							deep: true,
						},
					);
				}

				// Return Vue Reactive
				return stateReactive;
			})
	}


	/**
	* List of available projects for the current session
	* @type {VueReactive<Array<Object>>}
	*/
	projects = reactive([]);


	/**
	* The bound, reactive state of a Vue project
	* When loaded this represents the state of a project as an object
	* @type {Object}
	*/
	state = null;


	/**
	* Promise used when binding to state
	* @type {Promise}
	*/
	statePromisable = null;


	/**
	* Utility function which returns an awaitable promise when the state is loading or being refreshed
	* This is used in place of `statePromisable` as it has a slightly more logical syntax as a function
	*
	* @returns {Promise} A promise representing the loading of the project state
	*
	* @example Await the state loading
	* await $tera.statePromise();
	*/
	statePromise() {
		return this.statePromisable;
	}


	/**
	* Provide a Vue@3 compatible plugin
	*
	* @returns {VuePlugin} A Vue@3 plugin spec
	*/
	vuePlugin() {
		let $tera = this;

		return {

			/**
			* Install into Vue as a generic Vue@3 plugin
			*
			* @param {VueApp} app The Vue top-level app to install against
			*
			* @param {Object} [options] Additional options to mutate behaviour
			* @param {Boolean} [options.autoInit=true] Call Init() during the `statePromiseable` cycle if its not already been called
			* @param {String} [options.globalName='$tera'] Globa property to allocate this service as
			* @param {Objecct} [options.bindOptions] Options passed to `bindProjectState()`
			*/
			install(app, options) {
				let settings = {
					autoInit: true,
					globalName: '$tera',
					subscribeState: true,
					subscribeProjects: true,
					stateOptions: {
						write: true,
					},
					...options,
				};

				// Bind $tera.state to the active project
				// Initialize state to null
				$tera.state = null;

				// $tera.statePromisable becomes the promise we are waiting on to resolve
				$tera.statePromisable = Promise.resolve()
					.then(()=> settings.autoInit && $tera.init())
					.then(()=> Promise.all([
						// Bind available project and wait on it
						settings.subscribeState && $tera.bindProjectState(settings.stateOptions)
							.then(state => $tera.state = state)
							.then(()=> $tera.debug('INFO', 1, 'Loaded initial project state', $tera.state)),

						// Fetch available projects
						settings.subscribeProjects && $tera.getProjects()
							.then(projects => $tera.projects = reactive(projects))
							.then(()=> $tera.debug('INFO', 2, 'Loaded project list', $tera.projects)),
					]))
					.then(()=> $tera.debug('INFO', 1, 'Ready'))


				// Make this module available globally
				app.config.globalProperties[settings.globalName] = $tera;
			},

		};
	}

}
