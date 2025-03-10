import Reflib from '@iebh/reflib';
import {v4 as uuid4} from 'uuid';
import {nanoid} from 'nanoid';
import Syncro from './syncro.js';

/**
* Entities we support Syncro paths for, each should correspond directly with a Firebase/Firestore collection name
*
* @type {Object} An object lookup of entities
*
* @property {String} singular The singular noun for the item
* @property {Function} initState Function called to initialize state when Firestore has no existing document. Called as `({supabase:SupabaseClient, entity:String, id:String, relation?:string})` and expected to return the initial data object state
* @property {Function} flushState Function called to flush state from Firebase to Supabase. Called the same as `initState` + `{state:Object}`
*/
export default {
	projects: { // {{{
		singular: 'project',
		async initState({supabase, id}) {
			let data = await Syncro.wrapSupabase(supabase
				.from('projects')
				.select('data')
				.maybeSingle()
				.eq('id', id)
			);
			if (!data) throw new Error(`Syncro project "${id}" not found`);
			data = data.data;

			// MIGRATION - Move data.temp{} into Supabase files + add pointer to filename {{{
			if (
				data.temp // Project contains no temp subkey
				&& Object.values(data.temp).some(t => typeof t == 'object') // Some of the temp keys are objects
			) {
				console.log('[MIGRATION] tera-fy project v1 -> v2', data.temp);

				await Promise.all(
					Object.entries(data.temp)
						.filter(([, branch]) => typeof branch == 'object')
						.map(([toolKey, ]) => {
							console.log(`[MIGRATION] Converting data.temp[${toolKey}]...`);

							const toolName = toolKey.split('-')[0];
							const fileName = `data-${toolName}-${nanoid()}.json`;
							console.log('[MIGRATION] Creating filename:', fileName);

							return Promise.resolve()
								.then(()=> Syncro.wrapSupabase(supabase.storage // Split data.temp[toolKey] -> file {{{
									.from('projects')
									.upload(
										`${id}/${fileName}`,
										new File(
											[
												new Blob(
													[
														JSON.stringify(data.temp[toolKey], null, '\t'),
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
								.then(()=> data.temp[toolKey] = fileName) // Replace data.temp[toolKey] with new filename
								.catch(e => {
									console.warn('[MIGRATION] Failed to create file', fileName, '-', e);
									throw e;
								})

						})
				);
			} // }}}

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
