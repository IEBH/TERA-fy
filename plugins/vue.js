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
	* @returns {Promies<Reactive<Object>>} A reactive object representing the project state
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

				// Make this module available globally
				app.config.globalProperties[settings.globalName] = $tera;

				// Bind $tera.state to the active project
				// TODO: context.bindProjectState(settings.stateOptions),
				$tera.state = {
					id: 'TERAPROJ',
					name: 'A fake project',
				};
			},

		};
	}

}
