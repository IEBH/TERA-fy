import {get} from 'lodash-es';

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
				name: 'user-get',
				description: 'Retrieve the current session user including their ID, email, name, membership status and credits',
				execute: ()=> this.$tera.getUser(),
			}, settings),

			registerTool({
				name: 'project-get',
				description: 'Retrieve basic information for the active project, returns null if no project is active',
				execute: ()=> Promise.resolve()
					.then(()=> this.$tera.getProject())
					.then(project => project && {
						...project,
						nameShort: this.$projects.active.nameShort,
						type: this.$projects.active.type || 'invalid',
						members: (this.$projects.active.users || []).map(m => ({
							role: m.role,
							...(m.email && {email: m.email}),
							// TODO: Resolve user names
						})),
					}),
			}, settings),

			registerTool({
				name: 'projects-list',
				description: 'List all projects the current session user has access to',
				execute: ()=> this.$tera.getProjects(),
			}, settings),

			registerTool({
				name: 'project-select',
				description: 'Prompt the user to select a project from those available, optionally setting it as the active project',
				annotations: {readOnlyHint: false},
				inputSchema: {
					type: 'object',
					properties: {
						title: {
							type: 'string',
							description: 'The title of the dialog to display to the user',
						},
						setActive: {
							type: 'boolean',
							description: 'Also set the selected project as the active project',
							default: false,
						},
					},
				},
				execute: input => this.$tera.selectProject({
					...(input?.title && {title: input.title}),
					setActive: !!input?.setActive,
				}),
			}, settings),

			registerTool({
				name: 'project-state-get',
				description: 'Retrieve the full state of the active project, or a nested sub-path within it',
				inputSchema: {
					type: 'object',
					properties: {
						path: {
							type: 'string',
							description: 'Optional dotted notation path to extract from the project state e.g. `temp.someTool.settings`',
						},
					},
				},
				execute: input => Promise.resolve()
					.then(()=> this.$tera.getProjectState())
					.then(state => input?.path
						? get(state, input.path)
						: state
					),
			}, settings),

			registerTool({
				name: 'project-files-list',
				description: 'List the files associated with a project',
				execute: ()=> this.$tera.getProjectFiles({lazy: true}),
			}, settings),

			registerTool({
				name: 'project-file-get',
				description: 'Fetch a single project file by its name including relative directory path',
				inputSchema: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
							description: 'The name + relative directory path of the file',
						},
						subkey: {
							type: 'string',
							description: 'If specified only this key of the file object is returned rather than the full object',
						},
						cache: {
							type: 'boolean',
							description: 'Use the existing file cache if possible, set to false to force a refresh of files from the server first',
							default: true,
						},
					},
					required: ['name'],
				},
				execute: input => this.$tera.getProjectFile(input.name, {
					...(input.subkey && {subkey: input.subkey}),
					cache: input.cache ?? true,
				}),
			}, settings),

			registerTool({
				name: 'project-library-get',
				description: 'Fetch a project file by its ID and parse it as a collection of citations / references',
				inputSchema: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							description: 'The ID of the project file to read',
						},
					},
					required: ['id'],
				},
				execute: input => this.$tera.getProjectLibrary(input.id, {format: 'pojo'}),
			}, settings),
		]))
		.then(controllers => controllers.filter(Boolean)) // Remove duds
		.then(controllers => ({
			count: controllers.length,
			unregister: ()=> controllers.forEach(controller =>
				controller.abort()
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
