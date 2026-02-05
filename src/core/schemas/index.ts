 /**
  * CORE SCHEMA INDEX
  * 
  * All 6 base object schemas in one place.
  * These are the ONLY valid data structures in the system.
  */
 
 // Schema file paths for runtime loading
 export const SCHEMA_PATHS = {
   ENTITY: './entity.schema.json',
   ATTRIBUTE: './attribute.schema.json',
   RELATION: './relation.schema.json',
   EVENT: './event.schema.json',
   MEASURE: './measure.schema.json',
   SOURCE: './source.schema.json',
 } as const;
 
 // Schema metadata
 export const SCHEMA_METADATA = {
   version: '1.0.0',
   baseUri: 'https://dissg.io/schemas/v1/',
   totalSchemas: 6,
   specification: 'JSON Schema draft-07',
   
   schemas: [
     {
       type: 'ENTITY',
       description: 'Something that exists in the world',
       file: 'entity.schema.json',
       examples: ['country', 'region', 'indicator', 'organization'],
     },
     {
       type: 'ATTRIBUTE',
       description: 'A property of an entity',
       file: 'attribute.schema.json',
       examples: ['population', 'area', 'gdp', 'name'],
     },
     {
       type: 'RELATION',
       description: 'A connection between entities',
       file: 'relation.schema.json',
       examples: ['contains', 'correlates_with', 'governs', 'supersedes'],
     },
     {
       type: 'EVENT',
       description: 'A change over time',
       file: 'event.schema.json',
       examples: ['policy_enacted', 'election_held', 'methodology_changed'],
     },
     {
       type: 'MEASURE',
       description: 'A quantifiable observation',
       file: 'measure.schema.json',
       examples: ['unemployment_rate', 'gdp_growth', 'life_expectancy'],
     },
     {
       type: 'SOURCE',
       description: 'Where data comes from',
       file: 'source.schema.json',
       examples: ['eurostat', 'world_bank', 'scb', 'who'],
     },
   ],
 } as const;
 
 // Required fields that ALL base objects must have
 export const UNIVERSAL_REQUIRED_FIELDS = [
   'id',
   'type',
   'created_at',
   'valid_from',
   'source_id',
   'schema_version',
 ] as const;
 
 // Field that can be null across all schemas
 export const NULLABLE_FIELDS = [
   'valid_to',
 ] as const;
 
 /**
  * Validate that an object has all universal required fields
  */
 export function hasUniversalFields(obj: unknown): boolean {
   if (typeof obj !== 'object' || obj === null) return false;
   
   const record = obj as Record<string, unknown>;
   return UNIVERSAL_REQUIRED_FIELDS.every(field => field in record);
 }
 
 /**
  * Get schema URL for a base object type
  */
 export function getSchemaUrl(type: keyof typeof SCHEMA_PATHS): string {
   return `${SCHEMA_METADATA.baseUri}${type.toLowerCase()}.json`;
 }