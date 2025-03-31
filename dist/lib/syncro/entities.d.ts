import { SupabaseClient } from '@supabase/supabase-js';
/**
* Entities we support Syncro paths for, each should correspond directly with a Firebase/Firestore collection name
*
* @type {Object} An object lookup of entities
*
* @property {String} singular The singular noun for the item
* @property {Function} initState Function called to initialize state when Firestore has no existing document. Called as `({supabase:Supabasey, entity:String, id:String, relation?:string})` and expected to return the initial data object state
* @property {Function} flushState Function called to flush state from Firebase to Supabase. Called the same as `initState` + `{state:Object}`
*/
declare const _default: {
    projects: {
        singular: string;
        initState({ supabase, id }: {
            supabase: SupabaseClient;
            id: string;
        }): Promise<any>;
        flushState({ supabase, state, fsId }: {
            supabase: SupabaseClient;
            state: any;
            fsId: string;
        }): import("@supabase/postgrest-js").PostgrestFilterBuilder<any, any, any, "syncro_merge_data", null>;
    };
    project_libraries: {
        singular: string;
        initState({ supabase, id, relation }: {
            supabase: SupabaseClient;
            id: string;
            relation: string | undefined;
        }): Promise<{
            [k: string]: any;
        }>;
        flushState({ supabase, id, relation }: {
            supabase: SupabaseClient;
            id: string;
            relation: string | undefined;
        }): never;
    };
    project_namespaces: {
        singular: string;
        initState({ supabase, id, relation }: {
            supabase: SupabaseClient;
            id: string;
            relation: string | undefined;
        }): Promise<any>;
        flushState({ supabase, state, id, relation }: {
            supabase: SupabaseClient;
            state: any;
            id: string;
            relation: string | undefined;
        }): import("@supabase/postgrest-js").PostgrestFilterBuilder<any, any, null, "project_namespaces", unknown>;
    };
    test: {
        singular: string;
        initState({ supabase, id }: {
            supabase: SupabaseClient;
            id: string;
        }): Promise<any>;
        flushState({ supabase, state, fsId }: {
            supabase: SupabaseClient;
            state: any;
            fsId: string;
        }): import("@supabase/postgrest-js").PostgrestFilterBuilder<any, any, any, "syncro_merge_data", null>;
    };
    users: {
        singular: string;
        initState({ supabase, id }: {
            supabase: SupabaseClient;
            id: string;
        }): Promise<any>;
        flushState({ supabase, state, fsId }: {
            supabase: SupabaseClient;
            state: any;
            fsId: string;
        }): import("@supabase/postgrest-js").PostgrestFilterBuilder<any, any, any, "syncro_merge_data", null>;
    };
};
export default _default;
