import TeraFyPluginBase from './base.js';
import {diff} from 'just-diff';
import {reactive, watch} from 'vue';

/**
* Vue observables plugin
* Provides the `bindProjectState()` function for Vue based projects
*
* This function is expected to be included via the `terafy.use(MODULE, OPTIONS)` syntax rather than directly
*
* @class TeraFyPluginVue
*/
export default class TeraFyPluginVue extends TeraFyPluginBase {

	/**
	* Return a Vue reactive object that can be read/written which whose changes will transparently be written back to the TERA server instance
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Boolean} [options.write=true] Allow local reactivity to writes - send these to the server
	* @param {Array<String>} Paths to subscribe to e.g. ['/users/'],
	*
	* @returns {Promie<Reactive<Object>>} A reactive object representing the project state
	*/
	bindProjectState(options) {
		let settings = {
			autoRequire: true,
			write: true,
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
			.then(()=> this.getProjectState({
				autoRequire: false, // already handled this
				paths: settings.paths,
			}))
			.then(snapshot => {
				this.debug('Got project snapshot', snapshot);

				// Create initial reactive
				let stateReactive = reactive(snapshot);

				// Watch for remote changes and update
				// FIXME: Not yet supported

				// Watch for local writes and react
				if (settings.write) {
					watch(
						stateReactive,
						(newVal, oldVal) => {
							let diff = diff(newVal, oldVal);
							this.debug('APPLY DIFF', diff);
							this.applyProjectStatePatch(diff);
						},
						{
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
	* @example Await the state loading
	* await $tera.statePromise();
	*/
	statePromise() {
		return this.statePromisable;
	}


	/**
	* Provide a Vue@3 compatible plugin
	*/
	vuePlugin() {
		let $tera = this;

		return {

			/**
			* Install into Vue as a generic Vue@3 plugin
			*
			* @param {Object} [options] Additional options to mutate behaviour
			* @param {String} [options.globalName='$tera'] Globa property to allocate this service as
			* @param {Objecct} [options.bindOptions] Options passed to `bindProjectState()`
			*
			* @returns {VuePlugin} A plugin matching the Vue@3 spec
			*/
			install(app, options) {
				let settings = {
					globalName: '$tera',
					stateOptions: {
						autoRequire: true,
						write: true,
					},
					...options,
				};

				// Bind $tera.state to the active project
				// Initialize state to null
				$tera.state = null;

				// $tera.statePromisable becomes the promise we are waiting on to resolve
				$tera.statePromisable = Promise.all([

					// Bind available project and wait on it
					$tera.bindProjectState(settings.stateOptions)
						.then(state => $tera.state = state)
						.then(()=> $tera.debug('INFO', 'Loaded project state', $tera.state)),

					// Fetch available projects
					// TODO: It would be nice if this was responsive to remote changes
					$tera.getProjects()
						.then(projects => $tera.projects = projects)
						.then(()=> $tera.debug('INFO', 'Loaded projects', $tera.list)),
				])


				// Make this module available globally
				app.config.globalProperties[settings.globalName] = $tera;
			},

		};
	}

}
