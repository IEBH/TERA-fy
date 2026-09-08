/**
* Convenience wrapper for registering tools
* - Adds an AbortController to `vm.registrations[]`
* - Assumes the tool is read-only unless overriden
* - Assumes an empty inputSchema unless overriden
* - Wraps error handling
*
* @url https://developer.chrome.com/docs/ai/webmcp/declarative-api
* @param {Object} tool The MCP tool to register
* @param {Object} [options] Additional options to mutate behaviour
* @param {Function} [options.debug] Debugging function, if any, to show diagnostic information
* @returns {Promise<AbortController>} A promise which resolves when the operation has completed. Returns the abort controller to unregister the same
*/
export function registerTool(tool, options) {
	let settings = {
		debug: ()=> {},
		...options,
	};

	return Promise.resolve()
		.then(()=> {
			let controller = new AbortController();

			settings.debug('Register tool', tool.name);

			return document.modelContext.registerTool({
				annotations: {readOnlyHint: true},
				inputSchema: {type: 'object', properties: {}},
				onError: e => settings.debug(`Error when running tool '${tool.name}' - ${e.toString()}`, {error: e}),
				onSuccess: result => settings.debug(`Ran tool '${tool.name}'`, {result}),
				...tool,
			}, {
				signal: controller.signal,
			})
				.then(()=> controller)
		})
		.catch(e => {
			settings.debug(`Error registering MCP tool '${tool.name}' - ${e.toString()}`, {cause: e});
		})
}


/**
* Export an array of `document.modelContext.registerTool()` TERA tools
*
* @context {Object} Context to call registerTool with, should be the VitelService corresponding with `app.service('$webmcp')`
*
* @param {Object} [options] Additional options to mutate behaviour
* @param {Function} [options.debug] Debugging function, if any, to show diagnostic information
*
* @returns {Promise<Object>} A promise which resolves when all tools have been registed via Promise.all() and `document.modelContext.registerTool()`
* @property {Number} count The number of tools registered
* @property {Function} unregister A function to unregister everything
*/
export default function registerAllTools(options) {
	let settings = {
		debug: ()=> {},
		...options,
	};

	return Promise.resolve()
		.then(()=> this.$tera.getUser())
		.then(user => user.isMember || Promise.reject('NON-MEMBER'))
		.then(()=> Promise.all([
			registerTool({
				name: 'project-get',
				description: 'Retrieve basic information for the active project',
				execute: ()=> ({
					id: this.$projects.id,
					name: this.$projects.active.name,
					nameShort: this.$projects.active.nameShort,
					type: this.$projects.type || 'invalid',
					members: this.$projects.active.users.map(m => ({
						role: m.role,
						...(m.email && {email: m.email}),
						// TODO: Resolve user names
					})),
				}),
			}, settings),

			registerTool({
				name: 'project-files-list',
				description: 'List the files associated with a project',
				execute() {
					return Promise.resolve()
						.then(()=> this.refreshFiles({lazy: true}))
						.then(()=> this.$projects.activeFiles)
				},
			}, settings),
		]))
		.then(controllers => ({
			count: controllers.length,
			unregister: ()=> Promise.all(
				controllers.map(controller =>
					controller.signal.abort()
				)
			),
		}))
		.catch(e => {
			if (e === 'NON-MEMBER') {
				settings.debug('Cannot register WebMCP service - user is not subscribed');
			} else {
				throw e;
			}
		})
}
