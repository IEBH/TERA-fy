import { BoundSupabaseyFunction } from '@iebh/supabasey';
interface SyncroEntityConfig {
    singular: string;
    initState: (args: {
        supabasey: BoundSupabaseyFunction;
        id: string;
        relation?: string;
    }) => Promise<any>;
    flushState: (args: {
        supabasey: BoundSupabaseyFunction;
        state: any;
        id?: string;
        fsId?: string;
        relation?: string;
    }) => Promise<any>;
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
declare const syncroConfig: SyncroConfig;
export default syncroConfig;
