/**
* Server-side functions available to the Tera-Fy client library
*
* @class TeraFyServer
*/

/* globals app */
export class TeraFyServer {
	// Basics - handshake() {{{

	/**
	* Return basic server information as a form of validation
	*
	* @returns {Promise<Object>} Basic promise result
	* @property {Date} date Server date
	*/
	handshake() {
		return {
			date: new Date(),
		};
	}
	// }}}

	// Session / user - getUser() {{{

	/**
	* User / active session within TERA
	* @class User
	* @property {String} id Unique identifier of the user
	* @property {String} email The email address of the current user
	* @property {String} name The provided full name of the user
	* @property {Boolean} isSubscribed Whether the active user has a TERA subscription
	*/

	/**
	* Fetch the current session user
	*
	* @returns {Promise<User>} The current logged in user or null if none
	*/
	getUser() {
		let $auth = app.service('$auth');
		let $subscriptions = app.service('$subscriptons');

		return Promise.all([
			$auth.promise(),
			$subscriptions.promise(),
		])
			.then(()=> ({
				id: $auth.user.id,
				email: $auth.user.email,
				name: [
					$auth.user.given_name,
					$auth.user.family_name,
				].filter(Boolean).join(' '),
				isSubscribed: $subscriptions.isSubscribed,
			}))
	}

	// }}}

	// Projects - getProject(), getProjects() {{{

	/**
	* Project entry within TERA
	* @class Project
	* @property {String} id The Unique ID of the project
	* @property {String} name The name of the project
	* @property {String} created The creation date of the project as an ISO string
	* @property {Boolean} isOwner Whether the current session user is the owner of the project
	*/


	/**
	* Get the currently active project, if any
	*
	* @returns {Promise<Project|null>} The currently active project, if any
	*/
	getProject() {
		let $projects = app.service('$projects');

		return $projects.promise()
			.then(()=> $projects.active
				? {
					id: $projects.active.id,
					name: $projects.active.name,
					created: $projects.active.created,
					isOwner: $projects.active.$isOwner,
				}
				: null
			)
	}


	/**
	* Get a list of projects the current session user has access to
	*
	* @returns {Promise<Array<Project>>} Collection of projects the user has access to
	*/
	getProjects() {
		let $projects = app.service('$projects');

		return $projects.promise()
			.then(()=> $projects.list.map(project => ({
				id: project.id,
				name: project.name,
				created: project.created,
				isOwner: project.$isOwner,
			})))
	}


	/**
	* Ask the user to select a project from those available - if one isn't already active
	* Note that this function will percist in asking the uesr even if they try to cancel
	*
	* @returns {Promise<Project>} The active project
	*/
	requireProject() {
		let $prompt = app.service('$prompt');
		return this.getProject()
			.then(active => {
				if (active) return active; // Use active project

				return new Promise((resolve, reject) => {
					let askProject = ()=> Promise.resolve()
						.then(()=> this.selectProject({
							allowCancel: false,
						}))
						.then(project => resolve(project))
						.catch(e => {
							if (e == 'cancel') {
								return $prompt.dialog({
									title: 'Select project',
									body: 'A project needs to be selected to continue',
									buttons: ['ok'],
								})
								.then(()=> askProject())
								.catch(reject)
							} else {
								reject(e);
							}
						})
				});
			})
	}


	/**
	* Prompt the user to select a project from those available
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {String} [options.title="Select a project to work with"] The title of the dialog to display
	* @param {Boolean} [options.allowCancel=true] Advertise cancelling the operation, the dialog can still be cancelled by closing it
	*
	* @returns {Promise<Project>} The active project
	*/
	selectProject(options) {
		let settings = {
			title: 'Select a project to work with',
			allowCancel: true,
			...options,
		};
		let $projects = app.service('$projects');
		let $prompt = app.service('$prompt');
		return $projects.promise()
			.then(()=> $prompt.dialog({
				title: 'Select project',
				component: 'projectsSelect',
				dialogClose: 'reject',
				buttons: settings.allowCancel && ['cancel'],
			}))
	}


	// }}}

	// Project State {{{

	/**
	* Return the current, full snapshot state of the active project
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Array<String>} Paths to subscribe to e.g. ['/users/'],
	*
	* @returns {Promise<Object>} The current project state snapshot
	*/
	getProjectStateSnapshot(options) {
		let settings = {
			autoRequire: true,
			paths: null,
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
	}


	/**
	* Apply a computed `just-diff` patch to the current project state
	*/
	applyProjectStatePatch(patch) {
		console.log('Applying sever state patch', {patch});
	}

	// }}}

	// Project Libraries {{{

	/**
	* Fetch the active projects citation library
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {Boolean} [options.multiple=false] Allow selection of multiple libraries
	* @param {String|Array<String>} [options.hint] Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage - e.g. 'deduped', 'review1', 'review2', 'dedisputed'
	*
	* @returns {Promise<Array<RefLibRef>>} Collection of references for the selected library
	*/
	getProjectLibrary(options) {
		let settings = {
			autoRequire: true,
			multiple: false,
			hint: null,
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
			// FIXME: Stub
	}


	/**
	* Save back a projects citation library
	*
	* @param {Array<RefLibRef>} Collection of references for the selected library
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.autoRequire=true] Run `requireProject()` automatically before continuing
	* @param {String} [options.hint] Hint to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'
	*
	* @returns {Promise} A promise which resolves when the save operation has completed
	*/
	setProjectLibrary(refs, options) {
		let settings = {
			autoRequire: true,
			hint: null,
			...options,
		};

		return Promise.resolve()
			.then(()=> settings.autoRequire && this.requireProject())
		// FIXME: Stub
	}

	// }}}
}
