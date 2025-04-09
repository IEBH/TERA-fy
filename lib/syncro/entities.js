import Reflib from '@iebh/reflib';
import {v4 as uuid4} from 'uuid';
import {nanoid} from 'nanoid';

/**
* Entities we support Syncro paths for, each should correspond directly with a Firebase/Firestore collection name
*
* @type {Object} An object lookup of entities
*
* @property {String} singular The singular noun for the item
* @property {Function} initState Function called to initialize state when Firestore has no existing document. Called as `({supabase:Supabasey, entity:String, id:String, relation?:string})` and expected to return the initial data object state
* @property {Function} flushState Function called to flush state from Firebase to Supabase. Called the same as `initState` + `{state:Object}`
*/
export default {
	projects: { // {{{
		singular: 'project',
		async initState({supabase, id}) {
			let data = await supabase
				.from('projects')
				.select('data')
				.maybeSingle()
				.eq('id', id)
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
								.then(()=> supabase // Split data.temp[toolKey] -> file {{{
									.storage
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
								) // }}}
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
			return supabase.rpc('syncro_merge_data', {
				table_name: 'projects',
				entity_id: fsId,
				new_data: state,
			})
		},
	}, // }}}
	project_libraries: { // {{{
		singular: 'project library',
		initState({supabase, id, relation}) {
			if (!relation || !/_\*$/.test(relation)) throw new Error('Project library relation missing, path should resemble "project_library::${PROJECT}::${LIBRARY_FILE_ID}_*"');

			let fileId = relation.replace(/_\*$/, '');

			return Promise.resolve()
				.then(()=> supabase.storage
					.from('projects')
					.list(id)
				)
				.then(files => files.find(f => f.id == fileId))
				.then(file => file || Promise.reject(`Invalid file ID "${fileId}"`))
				.then(file => supabase.storage
					.from('projects')
					.download(`${id}/${file.name}`)
					.then(({ data: blob, error }) => {
						if (error) throw error;
						if (!blob) throw new Error('Failed to download file blob');
						return {blob, file}
					})
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
		flushState() {
			throw new Error('Flushing project_libraries::* namespace is not yet supported');
		},
	}, // }}}
	project_namespaces: { // {{{
		singular: 'project namespace',
		async initState({supabase, id, relation}) {
			if (!relation) throw new Error('Project namespace relation missing, path should resemble "project_namespaces::${PROJECT}::${RELATION}"');
			let { data: rows, error: selectError } = await supabase
				.from('project_namespaces')
				.select('data')
				.eq('project', id)
				.eq('name', relation)
				.limit(1);

			if (selectError) throw selectError;

			if (rows && rows.length == 1) {
					return rows[0].data;
			} else {
				const { data: newItem, error: insertError } = await supabase
					.from('project_namespaces') // Doesn't exist - create it
					.insert({
						project: id,
						name: relation,
						data: {},
					})
					.select('data')
					.single(); // Assuming insert returns the single inserted row

				if (insertError) throw insertError;
				if (!newItem) throw new Error('Failed to create project namespace');
				return newItem.data;
			}
		},
		flushState({supabase, state, id, relation}) {
			return supabase
				.from('project_namespaces')
				.update({
					edited_at: new Date(),
					data: state,
				})
				.eq('project', id)
				.eq('name', relation)
		},
	}, // }}}
	test: { // {{{
		singular: 'test',
		async initState({supabase, id}) {
			const { data: rows, error } = await supabase
				.from('test')
				.select('data')
				.eq('id', id)
				.limit(1);

			if (error) throw error;
			if (!rows || rows.length !== 1) return Promise.reject(`Syncro test item "${id}" not found`);
			return rows[0].data;
		},
		flushState({supabase, state, fsId}) {
			return supabase.rpc('syncro_merge_data', {
				table_name: 'test',
				entity_id: fsId,
				new_data: state,
			})
		},
	}, // }}}
	users: { // {{{
		singular: 'user',
		async initState({supabase, id}) {
			const { data: user, error: selectError } = await supabase
				.from('users')
				.select('data')
				.eq('id', id)
				.maybeSingle();

			if (selectError) throw selectError;

			if (user) return user.data; // User is valid and already exists

			// User row doesn't already exist - need to create stub
			const { data: newUser, error: insertError } = await supabase
				.from('users')
				.insert({
					id,
					data: {
						id,
						credits: 1000,
					},
				})
				.select('data')
				.single(); // Assuming insert returns the single inserted row

			if (insertError) throw insertError;
			if (!newUser) throw new Error('Failed to create user');
			return newUser.data; // Return back the data that eventually got created - allowing for database triggers, default field values etc.
		},
		flushState({supabase, state, fsId}) {
			return supabase.rpc('syncro_merge_data', {
				table_name: 'users',
				entity_id: fsId,
				new_data: state,
			})
		},
	}, // }}}
};
