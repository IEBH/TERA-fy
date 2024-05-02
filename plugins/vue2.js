import {cloneDeep} from 'lodash-es';
import TeraFyPluginBase from './base.js';

/**
* Vue2 observables plugin
* Provides the `bindProjectState()` function for Vue based projects
*
* This function is expected to be included via the `terafy.use(MODULE, OPTIONS)` syntax rather than directly
*
* @class TeraFyPluginVue
* @param {Object} options Options when initalizing
* @param {Vue} options.Vue Vue instance to bind against
*
* @example Implementation within a Vue2 project `src/main.js`:
* // Include the main Tera-Fy core
* import TeraFy from '@iebh/tera-fy';
* import TerafyVue from '@iebh/tera-fy/plugins/vue2';
* let terafy = new TeraFy()
*   .set('devMode', true) // Uncomment this line if you want TeraFy to be chatty
*   .set('siteUrl', 'http://localhost:8000/embed') // Uncomment this line if running TERA locally
*   .use(TerafyVue, { // Add the Vue plugin
*   	vue: window.Vue, // Assumes Vue is available on the window object
*   })
*
* // Include after app boot
* const app = new Vue({ ... })
* app.$mount("#app");
* await terafy.init({app});
*/
export default class TeraFyPluginVue2 extends TeraFyPluginBase {

	/**
	* Local Vue@2 library to use, set during constuctor
	*
	* @type {Vue}
	*/
	Vue;


	/**
	* Return a Vue Observable object that can be read/written which whose changes will transparently be written back to the TERA server instance
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {VueComponent} [options.component] Component to use to bind $watch events
	* @param {String} [options.componentKey] Key within the component to attach the state. Defaults to a random string
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {String|Boolean} [options.bindKey='project'] If set, creates the binding also as the specified key within the main Tera object, if falsy just returns the observable
	* @param {Boolean} [options.write=true] Allow local reactivity to writes - send these to the server
	*
	* @returns {Promie<VueObservable<Object>>} A Vue.Observable object representing the project state
	*/
	bindProjectState(options) {
		let settings = {
			component: null,
			componentKey: null,
			autoRequire: true,
			write: true,
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
						if (!Object.hasOwnProperty(settings.component, key)) { // eslint-disable-line
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
				let skipUpdate = 0; // How many subsequent WRITE operations to ignore (set when reading)
				if (settings.read) {
					this.events.on(`update:projects/${stateObservable.id}`, newState => {
						skipUpdate++; // Skip next update as we're updating our own state anyway
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

					settings.component.$watch(
						settings.componentKey,
						newVal => {
							if (skipUpdate > 0) {
								skipUpdate--;
								return;
							}

							this.createProjectStatePatch(newVal, oldVal);
							oldVal = cloneDeep(snapshot);
						},
						{
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
				.forEach(k =>
					this.Vue.set(target, k, pl[k])
				)
		);

		return target;
	}



	/**
	* List of available projects for the current session
	* Initalized during constructor
	*
	* @type {VueReactive<Array<Object>>}
	*/
	projects;


	/**
	* The bound, reactive state of a Vue project
	* When loaded this represents the state of a project as an object
	*
	* @type {Object}
	*/
	state = null;


	/**
	* Install into Vue@2
	*
	* @param {Object} options Additional options to mutate behaviour (defaults to the main teraFy settings)
	* @param {Object} options.app Root level Vue app to bind against
	* @param {Vue} options.Vue Vue@2 instance to bind against
	* @param {String} [options.globalName='$tera'] Global property to allocate this service as within Vue2
	* @param {Boolean} [options.requireProject=true] Automatically call requireProject() prior to any operation
	* @param {Boolean} [options.subscribeState=true] Setup `vm.$tera.state` as a live binding on init
	* @param {Boolean} [options.subscribeList=true] Setup `vm.$tera.projects` as a list of accesible projects on init
	* @param {Objecct} [options.stateOptions] Options passed to `bindProjectState()` when setting up the main state
	*
	* @returns {Promise} A Promise which will resolve when the init process has completed
	*/
	init(options) {
		let settings = {
			app: null,
			Vue: null,
			globalName: '$tera',
			requireProject: true,
			subscribeState: true,
			subscribeProjects: true,
			stateOptions: {
				read: true,
				write: true,
			},
			...options,
		};

		if (!settings.Vue) throw new Error('Vue instance to use must be specified in init options as `Vue`');
		this.Vue = options.Vue;

		if (!this.settings.app) throw new Error('Need to specify the root level Vue2 app during init');
		settings.stateOptions.app = this.settings.app;

		// Create observable binding for projects
		this.projects = this.Vue.observable([])

		// Make this module available globally
		if (settings.globalName)
			this.Vue.prototype[settings.globalName] = this;

		// Bind `state` to the active project
		// Initialize state to null
		this.state = null;

		// this.statePromisable becomes the promise we are waiting on to resolve
		return Promise.resolve()
			.then(()=> settings.requireProject && this.requireProject())
			.then(()=> Promise.all([
				// Bind available project and wait on it
				settings.subscribeState && this.bindProjectState({
					...settings.stateOptions,
					component: this.settings.app.$root,
				})
					.then(state => this.state = state)
					.then(()=> this.debug('INFO', 1, 'Loaded initial project state', this.state)),

				// Fetch available projects
				settings.subscribeProjects && this.getProjects()
					.then(projects => this.projects = this.Vue.observable(projects))
					.then(()=> this.debug('INFO', 2, 'Loaded project list', this.projects)),
			]))
			.then(()=> this.debug('INFO', 1, 'Ready'))
	}
}
