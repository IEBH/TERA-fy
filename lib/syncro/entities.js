import Reflib from '@iebh/reflib';
import {v4 as uuid4} from 'uuid';

/**
* Entities we support Syncro paths for, each should correspond directly with a Firebase/Firestore collection name
*
* @type {Object} An object lookup of entities
*
* @property {String} singular The singular noun for the item
* @property {Function} initState Function called to initialize state when Firestore has no existing document. Called as `({supabase:SupabaseClient, entity:String, id:String, relation?:string})` and expected to return the initial data object state
* @property {Function} flushState Function called to flush state from Firebase to Supabase. Called the same as `initState` + `{state:Object}`
*/
export default syncEntities = {
	projects: { // {{{
		singular: 'project',
		async initState({supabase, id, tera}) {
			debugger; // FIXME: Check that `tera` gets populated
			if (!tera) throw new Error('initState() for projects requires `{tera:app.service("$tera")}`');

			const result = await Syncro.wrapSupabase(supabase.from('projects')
				.select('data')
				.limit(1)
				.eq('id', id)
			);

			if (result.length !== 1) {
				throw new Error(`Syncro project "${id}" not found`);
			}

			const data = result[0].data;
			console.log('[MIGRATION] State of temp at start:', data.temp);

			// Check if temp variable exists
			if (!data.temp) return data;

			let shownAlert = false;
			for (const toolKey in data.temp) {
				// Check if temp has already been set to file path
				if (typeof data.temp[toolKey] !== 'object') {
					console.log(`[MIGRATION] Skipping conversion of ${toolKey}, not an object:`, data.temp[toolKey])
					return;
				}

				if (!shownAlert) {
					shownAlert = true;
					console.log('[MIGRATION] showing alert');
					alert('Data found that will be migrated to new TERA file storage system. This may take a few minutes, please do not close your browser or refresh.');
				}

				// Create filename based on existing key
				const toolName = toolKey.split('-')[0];
				const fileName = `data-${toolName}-${nanoid()}.json`;
				console.log('[MIGRATION] Creating filename:', fileName);

				// Create file, set contents and overwrite key
				const projectFile = await tera.createProjectFile(fileName);
				console.log('[MIGRATION] Setting file contents:', projectFile, 'to:', data.temp[toolKey]);
				await projectFile.setContents(data.temp[toolKey])
				console.log('[MIGRATION] Overwriting temp key with filepath:', fileName);
				data.temp[toolKey] = fileName;
			}

			console.log("[MIGRATION] State of temp at end:", data.temp)

			return data;
		},
		flushState({supabase, state, fsId}) {
			return Syncro.wrapSupabase(supabase.rpc('syncro_merge_data', {
				table_name: 'projects',
				entity_id: fsId,
				new_data: state,
			}))
		},
	}, // }}}
	project_libraries: { // {{{
		singular: 'project library',
		initState({supabase, id, relation}) {
			if (!relation || !/_\*$/.test(relation)) throw new Error('Project library relation missing, path should resemble "project_library::${PROJECT}::${LIBRARY_FILE_ID}_*"');

			let fileId = relation.replace(/_\*$/, '');

			return Promise.resolve()
				.then(()=> Syncro.wrapSupabase(supabase.storage
					.from('projects')
					.list(id)
				))
				.then(files => files.find(f => f.id == fileId))
				.then(file => file || Promise.reject(`Invalid file ID "${fileId}"`))
				.then(file => Syncro.wrapSupabase(supabase.storage
					.from('projects')
					.download(`${id}/${file.name}`)
				)
					.then(blob => ({blob, file}))
				)
				.then(({blob, file}) => Reflib.uploadFile({
					file: new File(
						[blob],
						file.name.replace(/^.*[/\\]/, ''), // Extract basename from original file name
					),
				}))
				.then(refs => Object.fromEntries(refs // Transform Reflib Ref array into a keyed UUID object
					.map(ref => [ // Construct Object.fromEntries() compatible object [key, val] tuple
						uuid4(), // TODO: This should really be using V5 with some-kind of namespacing but I can't get my head around the documentation - MC 2025-02-21
						ref, // The actual ref payload
					])
				))
		},
		flushState({supabase, id, relation}) {
			throw new Error('Flushing project_libraries::* namespace is not yet supported');
		},
	}, // }}}
	project_namespaces: { // {{{
		singular: 'project namespace',
		initState({supabase, id, relation}) {
			if (!relation) throw new Error('Project namespace relation missing, path should resemble "project_namespaces::${PROJECT}::${RELATION}"');
			return Syncro.wrapSupabase(supabase.from('project_namespaces')
				.select('data')
				.limit(1)
				.eq('project', id)
				.eq('name', relation)
			)
				.then(rows => rows.length == 1
					? rows[0]
					: Syncro.wrapSupabase(supabase.from('project_namespaces') // Doesn't exist - create it
						.insert({
							project: id,
							name: relation,
							data: {},
						})
						.select('data')
					)
				)
				.then(item => item.data);
		},
		flushState({supabase, state, id, relation}) {
			return Syncro.wrapSupabase(supabase.from('project_namespaces')
				.update({
					edited_at: new Date(),
					data: state,
				})
				.eq('project', id)
				.eq('name', relation)
			)
		},
	}, // }}}
	test: { // {{{
		singular: 'test',
		initState({supabase, id}) {
			return Syncro.wrapSupabase(supabase.from('test')
				.select('data')
				.limit(1)
				.eq('id', id)
			)
				.then(rows => rows.length == 1 ? rows[0] : Promise.reject(`Syncro test item "${id}" not found`))
				.then(item => item.data);
		},
		flushState({supabase, state, fsId}) {
			return Syncro.wrapSupabase(supabase.rpc('syncro_merge_data', {
				table_name: 'test',
				entity_id: fsId,
				new_data: state,
			}))
		},
	}, // }}}
	users: { // {{{
		singular: 'user',
		initState({supabase, id}) {
			return Syncro.wrapSupabase(supabase.from('users')
				.select('data')
				.limit(1)
				.eq('id', id)
			)
				.then(rows => rows.length == 1 ? rows[0] : Promise.reject(`Syncro user "${id}" not found`))
				.then(item => item.data);
		},
		flushState({supabase, state, fsId}) {
			return Syncro.wrapSupabase(supabase.rpc('syncro_merge_data', {
				table_name: 'users',
				entity_id: fsId,
				new_data: state,
			}))
		},
	}, // }}}
};
