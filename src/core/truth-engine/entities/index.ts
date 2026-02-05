 /**
  * TRUTH ENGINE - ENTITIES MODULE
  * 
  * Step 9: Explicit entities with time and source.
  */
 
 export { COUNTRY_SCHEMA_V1 } from '../schemas/country';
 export { SWEDEN, SWEDEN_ENTITY_SOURCE, SWEDEN_TEMPORAL } from './sweden';
 export {
   entityExists,
   getEntity,
   registerEntity,
   getAllEntities,
   getRegistryStats,
 } from './registry';