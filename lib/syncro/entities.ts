/* eslint-disable jsdoc/reject-function-type, no-unused-vars */
// @ts-expect-error TODO: Remove when reflib gets declaration file
import Reflib from '@iebh/reflib';
import {v4 as uuid4} from 'uuid';
import {nanoid} from 'nanoid';
import {BoundSupabaseyFunction} from '@iebh/supabasey';


// Minimal interface for a postgres-npm Sql instance (db is injected by the Cloudflare Worker runtime)
interface PostgresSql {
	(strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
	json(value: any): any;
}


// DATABASE TABLE TYPE DEFINITIONS {{{
interface ProjectRow {
	data: {
		id: string;
		// TODO: add other properties in project data
	};
	// TODO: Define other columns in project table
}

interface InstituteRow {
	data: any;
}

interface UserRow {
	id: string;
	data: {
		id: string;
		credits: number;
		[key: string]: any;
		// TODO: add other properties in user data
	};
	// TODO: Define other columns in user table
}

interface NamespaceRow {
	project: string;
	name: string;
	data: {
		[key: string]: any;
		// TODO: add other properties in namespace data
	};
	// TODO: Define other columns in namespace table
}
// }}}


// Interface for each syncro entity config
interface SyncroEntityConfig {
	singular: string;
	initState: (args: {
			db: PostgresSql;
			supabasey: BoundSupabaseyFunction;
			id: string; // Primary ID for the entity
			relation?: string; // Optional relation identifier (for namespaces, libraries)
	}) => Promise<any>;
	flushState: (args: {
			db?: PostgresSql;
			supabasey: BoundSupabaseyFunction;
			state: any; // The state object to flush
			id?: string; // Primary ID (used in some lookups like namespaces)
			fsId?: string; // ID often passed to Supabase RPCs (might be same as 'id')
			relation?: string; // Optional relation identifier
	}) => Promise<any>; // Return type signifies completion/result of flush
}


type SyncroConfig = Record<string, SyncroEntityConfig>;


/**
* Entities we support Syncro paths for, each should correspond directly with a Firebase/Firestore collection name
*
* @type {Object} An object lookup of entities
*
* @property {String} singular The singular noun for the item
* @property {Function} initState Function called to initialize state when Firestore has no existing document. Called as `({db:PostgresSql, supabasey:BoundSupabaseyFunction, id:String, relation?:string})` and expected to return the initial data object state
* @property {Function} flushState Function called to flush state from Firebase to Supabase. Called the same as `initState` + `{state:Object}`
*/
const syncroConfig: SyncroConfig = {
	institutes: { // {{{
		singular: 'institute',
		async initState({db, id}: {db: PostgresSql, id: string}) {
			let institute = await db`
				SELECT data
				FROM institutes
				WHERE id = ${id}
				LIMIT 1
			`;
			if (institute.length > 0) {
				return institute[0].data; // institute is valid and already exists
			} else {
				throw new Error(`Syncro institute "${id}" not found`);
			}
		},
		flushState({supabasey, state, id}) {
			// FIXME: Better to reuse `env.db` instead of supabasey here in future
			return supabasey((supabase) => supabase.rpc('syncro_merge_data', {
				table_name: 'institutes',
				entity_id: id,
				new_data: state,
			}));
		},
	}, // }}}
	projects: { // {{{
		singular: 'project',
		async initState({db, supabasey, id}: {db: PostgresSql, supabasey: BoundSupabaseyFunction, id: string}) {
			let projects = await db`
				SELECT data
				FROM projects
				WHERE id = ${id}
				LIMIT 1
			`;
			if (projects.length == 0) throw new Error(`Syncro project "${id}" not found`);

			const data = projects[0].data;

			// MIGRATION - Move data.temp{} into Supabase files + add pointer to filename {{{
			if (
				data.temp // Project contains temp subkey
				&& Object.values(data.temp).some((t: any) => typeof t == 'object') // Some of the temp keys are objects
			) {
				console.log('[MIGRATION] tera-fy project v1 -> v2', data.temp);
				const tempObject = data.temp;

				await Promise.all(
					Object.entries(data.temp)
						.filter(([, branch]) => typeof branch == 'object')
						.map(([toolKey]) => {
							console.log(`[MIGRATION] Converting data.temp[${toolKey}]...`);

							const toolName = toolKey.split('-')[0];
							const fileName = `data-${toolName}-${nanoid()}.json`;
							console.log('[MIGRATION] Creating filename:', fileName);

							return Promise.resolve()
								.then(()=> supabasey((supabase) => supabase // Split data.temp[toolKey] -> file {{{
									.storage
									.from('projects')
									.upload(
										`${id}/${fileName}`,
										new File(
											[
												new Blob(
													[
														JSON.stringify(tempObject[toolKey], null, '\t'),
													],
													{
														type: 'application/json',
													},
												),
											],
											fileName,
											{
												type: 'application/json',
											},
										),
										{
											cacheControl: '3600',
											upsert: true,
										},
									)
								)) // }}}
								.then(()=> tempObject[toolKey] = fileName) // Replace data.temp[toolKey] with new filename
								.catch(e => {
									console.warn('[MIGRATION] Failed to create file', fileName, '-', e);
									throw e;
								})

						})
				);
			} // }}}

			return data;
		},
		flushState({supabasey, state, fsId}) {
			// FIXME: Better to reuse `env.db` instead of supabasey here in future
			return supabasey((supabase) => supabase.rpc('syncro_merge_data', {
				table_name: 'projects',
				entity_id: fsId,
				new_data: state,
			}));
		},
	}, // }}}
	project_libraries: { // {{{
		singular: 'project library',
		async initState({id, relation, supabasey}: {db: PostgresSql, id: string, relation?: string, supabasey: BoundSupabaseyFunction}) {
			if (!relation || !/_\*$/.test(relation)) throw new Error('Project library relation missing, path should resemble "project_library::${PROJECT}::${LIBRARY_FILE_ID}_*"');

			const fileId = relation.replace(/_\*$/, '');

			const files = await supabasey((supabase) => supabase
				.storage
				.from('projects')
				.list(id))

			const file = files?.find((f: any) => f.id == fileId);
			if (!file) return Promise.reject(`Invalid file ID "${fileId}"`);

			const blob = await supabasey((supabase) => supabase
				.storage
				.from('projects')
				.download(`${id}/${file.name}`))

			if (!blob) throw new Error('Failed to download file blob');

			const refs = await Reflib.uploadFile({
				file: new File(
					[blob],
					file.name.replace(/^.*[/\\]/, ''), // Extract basename from original file name
				),
			})

			return Object.fromEntries(refs // Transform Reflib Ref array into a keyed UUID object
				.map((ref: any) => [ // Construct Object.fromEntries() compatible object [key, val] tuple
					uuid4(), // TODO: This should really be using V5 with some-kind of namespacing but I can't get my head around the documentation - MC 2025-02-21
					ref, // The actual ref payload
				])
			)
		},
		flushState() {
			throw new Error('Flushing project_libraries::* namespace is not yet supported');
		},
	}, // }}}
	project_namespaces: { // NOT YET SUPPORTED {{{
		singular: 'project namespace',
		async initState() {
			throw new Error('Updating project_namespaces is not yet supported');
		},
		async flushState() {
			throw new Error('Updating project_namespaces is not yet supported');
		},
	}, // }}}
	test: { // {{{
		singular: 'test',
		async initState({db, id}: {db: PostgresSql, id: string}) {
			let rows = await db`
				SELECT data
				FROM test
				WHERE id = ${id}
				LIMIT 1
			`;
			if (rows.length > 0) {
				return rows[0].data; // User is valid and already exists
			} else {
				throw new Error(`Syncro test "${id}" not found`);
			}
		},
		flushState({supabasey, state, fsId}) {
			// FIXME: Better to reuse `env.db` instead of supabasey here in future
			return supabasey((supabase) => supabase.rpc('syncro_merge_data', {
				table_name: 'test',
				entity_id: fsId,
				new_data: state,
			}));
		},
	}, // }}}
	users: { // {{{
		singular: 'user',
		async initState({db, id}: {db: PostgresSql, id: string}) {
			let user = await db`
				SELECT data
				FROM users
				WHERE id = ${id}
				LIMIT 1
			`;
			if (user.length > 0) return user[0].data; // User is valid and already exists

			// User row doesn't already exist - this shouldn't happen if the user has correctly gone through the onboarding process
			// but... *shrugs*, who knows
			let newUser = await db`
				INSERT INTO users
				(
					id,
					data
				)
				VALUES (
					${id},
					${db.json({
						id,
						credits: 1000,
					})}::JSONB
				)
			`;
			if (!newUser?.length) throw new Error(`Failed to create new user "${id}"`);
			return newUser[0].data; // Return back the data that eventually got created - allowing for database triggers, default field values etc.

		},
		flushState({supabasey, state, fsId}) {
			// FIXME: Better to reuse `env.db` instead of supabasey here in future
			return supabasey((supabase) => supabase.rpc('syncro_merge_data', {
				table_name: 'users',
				entity_id: fsId,
				new_data: state,
			}));
		},
	}, // }}}
};

export default syncroConfig;
