// @ts-ignore
import Reflib from '@iebh/reflib';
import {v4 as uuid4} from 'uuid';
import {nanoid} from 'nanoid';
import { BoundSupabaseyFunction } from '@iebh/supabasey';

// DATABASE TABLE TYPE DEFINITIONS {{{
interface ProjectRow {
  data: {
		temp?: { [key: string]: any };
		// TODO: add other properties in project data
	};
	// TODO: Define other columns in project table
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
	// TODO: Define other namespace in user table
}
// }}}

// Interface for each syncroconfic
interface SyncroEntityConfig {
	singular: string;
	initState: (args: {
			supabasey: BoundSupabaseyFunction;
			id: string; // Primary ID for the entity
			relation?: string; // Optional relation identifier (for namespaces, libraries)
	}) => Promise<any>;

	flushState: (args: {
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
* @property {Function} initState Function called to initialize state when Firestore has no existing document. Called as `({supabase:BoundSupabaseyFunction, entity:String, id:String, relation?:string})` and expected to return the initial data object state
* @property {Function} flushState Function called to flush state from Firebase to Supabase. Called the same as `initState` + `{state:Object}`
*/
const syncroConfig: SyncroConfig = {
	projects: { // {{{
		singular: 'project',
		async initState({supabasey, id}) {
			let projectData = await supabasey((supabase) => supabase
				.from('projects')
				.select('data')
				.eq('id', id)
				.maybeSingle<ProjectRow>()
			);
			if (!projectData) throw new Error(`Syncro project "${id}" not found`);
			let data = projectData.data;

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
						.map(([toolKey, ]) => {
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
			// Import Supabasey because 'supabasey' lowercase is just a function
			return supabasey(supabase => supabase.rpc('syncro_merge_data', {
				table_name: 'projects',
				entity_id: fsId,
				new_data: state,
			}));
		},
	}, // }}}
	project_libraries: { // {{{
		singular: 'project library',
		async initState({supabasey, id, relation}) {
			if (!relation || !/_\*$/.test(relation)) throw new Error('Project library relation missing, path should resemble "project_library::${PROJECT}::${LIBRARY_FILE_ID}_*"');

			let fileId = relation.replace(/_\*$/, '');

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
	project_namespaces: { // {{{
		singular: 'project namespace',
		async initState({supabasey, id, relation}) {
			if (!relation) throw new Error('Project namespace relation missing, path should resemble "project_namespaces::${PROJECT}::${RELATION}"');
			let rows = await supabasey((supabase) => supabase
				.from('project_namespaces')
				.select('data')
				.eq('project', id)
				.eq('name', relation)
				.limit(1)
			);

			if (rows && rows.length == 1) {
				return rows[0].data;
			} else {
				const newItem = await supabasey((supabase) => supabase
					.from('project_namespaces') // Doesn't exist - create it
					.insert<NamespaceRow>({
						project: id,
						name: relation,
						data: {},
					})
					.select('data')
					.single<NamespaceRow>() // Assuming insert returns the single inserted row
				);

				if (!newItem) throw new Error('Failed to create project namespace');
				return newItem.data;
			}
		},
		flushState({supabasey, state, id, relation}) {
			return supabasey((supabase) => supabase
				.from('project_namespaces')
				.update({
					edited_at: new Date().toISOString(),
					data: state,
				})
				.eq('project', id)
				.eq('name', relation)
			);
		},
	}, // }}}
	test: { // {{{
		singular: 'test',
		async initState({supabasey, id}: {supabasey: BoundSupabaseyFunction, id: string}) {
			let rows = await supabasey((supabase) => supabase
				.from('test')
				.select('data')
				.eq('id', id)
				.limit(1)
			);

			if (!rows || rows.length !== 1) return Promise.reject(`Syncro test item "${id}" not found`);
			return rows[0].data;
		},
		flushState({supabasey, state, fsId}) {
			return supabasey(supabase => supabase.rpc('syncro_merge_data', {
				table_name: 'test',
				entity_id: fsId,
				new_data: state,
			}));
		},
	}, // }}}
	users: { // {{{
		singular: 'user',
		async initState({supabasey, id}: {supabasey: BoundSupabaseyFunction, id: string}) {
			let user = await supabasey((supabase) => supabase
				.from('users')
				.select('data')
				.eq('id', id)
				.maybeSingle<UserRow>()
			);
			if (user) return user.data; // User is valid and already exists

			// User row doesn't already exist - need to create stub
			let newUser = await supabasey((supabase) => supabase
				.from('users')
				.insert<UserRow>({
					id,
					data: {
						id,
						credits: 1000,
					},
				})
				.select('data')
				.single<UserRow>() // Assuming insert returns the single inserted row
			);
			if (!newUser) throw new Error('Failed to create user');
			return newUser.data; // Return back the data that eventually got created - allowing for database triggers, default field values etc.

		},
		flushState({supabasey, state, fsId}) {
			return supabasey(supabase => supabase.rpc('syncro_merge_data', {
				table_name: 'users',
				entity_id: fsId,
				new_data: state,
			}));
		},
	}, // }}}
};

export default syncroConfig;