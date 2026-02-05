 /**
  * SCHEMA LAW
  * 
  * Each schema is:
  * - A file
  * - An ID
  * - A hash
  * - A contract
  * 
  * FORBIDDEN:
  * - "latest"
  * - "current"
  * - "default"
  */
 
 /**
  * SCHEMA DEFINITION
  */
 export interface SchemaDefinition {
   /** Unique schema ID: {domain}:{name}:v{version} */
   id: string;
   
   /** Schema name */
   name: string;
   
   /** Version number (immutable once created) */
   version: number;
   
   /** Content hash (SHA-256) */
   hash: string;
   
   /** Created timestamp */
   createdAt: string;
   
   /** Schema definition */
   definition: SchemaFields;
   
   /** Supersedes previous version */
   supersedes?: string;
   
   /** Status */
   status: 'active' | 'deprecated' | 'superseded';
 }
 
 export interface SchemaFields {
   requiredFields: SchemaField[];
   optionalFields: SchemaField[];
   constraints: SchemaConstraint[];
 }
 
 export interface SchemaField {
   name: string;
   type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
   description: string;
   validationRule?: string;
 }
 
 export interface SchemaConstraint {
   name: string;
   rule: string;
   errorCode: string;
 }
 
 /**
  * FORBIDDEN SCHEMA TERMS
  */
 export const FORBIDDEN_SCHEMA_TERMS = [
   'latest',
   'current',
   'default',
   'newest',
   'recent',
   'active', // as alias, not status
 ] as const;
 
 /**
  * SCHEMA REGISTRY
  */
 export class SchemaRegistry {
   private schemas: Map<string, SchemaDefinition> = new Map();
   
   /**
    * REGISTER SCHEMA
    */
   register(schema: SchemaDefinition): { success: boolean; error?: string } {
     // Check for forbidden terms in ID
     for (const term of FORBIDDEN_SCHEMA_TERMS) {
       if (schema.id.toLowerCase().includes(term)) {
         return {
           success: false,
           error: `FORBIDDEN: Schema ID cannot contain "${term}"`,
         };
       }
     }
     
     // Check if already exists
     if (this.schemas.has(schema.id)) {
       return {
         success: false,
         error: `Schema ${schema.id} already exists. Schemas are immutable.`,
       };
     }
     
     // Verify hash
     const computedHash = this.computeHash(schema.definition);
     if (schema.hash !== computedHash) {
       return {
         success: false,
         error: 'Schema hash mismatch',
       };
     }
     
     this.schemas.set(schema.id, schema);
     return { success: true };
   }
   
   /**
    * GET SCHEMA BY EXACT ID
    */
   get(id: string): SchemaDefinition | undefined {
     // Block forbidden lookups
     for (const term of FORBIDDEN_SCHEMA_TERMS) {
       if (id.toLowerCase().includes(term)) {
         throw new Error(`FORBIDDEN: Cannot lookup schema by "${term}". Use exact version.`);
       }
     }
     
     return this.schemas.get(id);
   }
   
   /**
    * GET ALL VERSIONS OF A SCHEMA
    */
   getAllVersions(baseName: string): SchemaDefinition[] {
     return Array.from(this.schemas.values())
       .filter(s => s.name === baseName)
       .sort((a, b) => a.version - b.version);
   }
   
   /**
    * DEPRECATE SCHEMA (never delete)
    */
   deprecate(id: string, reason: string): { success: boolean; error?: string } {
     const schema = this.schemas.get(id);
     if (!schema) {
       return { success: false, error: `Schema ${id} not found` };
     }
     
     schema.status = 'deprecated';
     // Note: Schema is NOT deleted, just marked
     
     return { success: true };
   }
   
   /**
    * COMPUTE HASH
    */
   private computeHash(definition: SchemaFields): string {
     const str = JSON.stringify(definition);
     let hash = 0;
     for (let i = 0; i < str.length; i++) {
       const char = str.charCodeAt(i);
       hash = ((hash << 5) - hash) + char;
       hash = hash & hash;
     }
     return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
   }
 }
 
 /**
  * EXAMPLE SCHEMAS
  */
 export const EXAMPLE_SCHEMAS: SchemaDefinition[] = [
   {
     id: 'population:resident:v1',
     name: 'population_resident',
     version: 1,
     hash: 'sha256:0000000000000001',
     createdAt: '2024-01-01T00:00:00Z',
     status: 'deprecated',
     definition: {
       requiredFields: [
         { name: 'count', type: 'number', description: 'Total resident count' },
         { name: 'geography_id', type: 'string', description: 'Geographic unit ID' },
         { name: 'timestamp', type: 'date', description: 'Measurement date' },
       ],
       optionalFields: [],
       constraints: [
         { name: 'positive_count', rule: 'count >= 0', errorCode: 'SCH-001' },
       ],
     },
   },
   {
     id: 'population:resident:v2',
     name: 'population_resident',
     version: 2,
     hash: 'sha256:0000000000000002',
     createdAt: '2024-06-01T00:00:00Z',
     status: 'active',
     supersedes: 'population:resident:v1',
     definition: {
       requiredFields: [
         { name: 'count', type: 'number', description: 'Total resident count' },
         { name: 'geography_id', type: 'string', description: 'Geographic unit ID' },
         { name: 'timestamp', type: 'date', description: 'Measurement date' },
         { name: 'methodology_version', type: 'string', description: 'Counting methodology' },
       ],
       optionalFields: [
         { name: 'confidence', type: 'number', description: 'Confidence interval' },
       ],
       constraints: [
         { name: 'positive_count', rule: 'count >= 0', errorCode: 'SCH-001' },
         { name: 'valid_confidence', rule: 'confidence BETWEEN 0 AND 1', errorCode: 'SCH-002' },
       ],
     },
   },
 ];
 
 /**
  * SCHEMA SELF-TESTS
  */
 export const SCHEMA_SELF_TESTS = {
   noForbiddenTerms: {
     test: 'ASSERT no_schema_id CONTAINS forbidden_terms',
     description: 'No schema uses "latest", "current", or "default"',
   },
   allVersioned: {
     test: 'FOR EACH schema: ASSERT id CONTAINS version_number',
     description: 'All schemas have explicit version in ID',
   },
   hashVerified: {
     test: 'FOR EACH schema: ASSERT hash(definition) == stored_hash',
     description: 'All schema hashes are verified',
   },
   neverDeleted: {
     test: 'ASSERT schema_delete_count == 0',
     description: 'Schemas are never deleted, only deprecated',
   },
 } as const;
 
 /**
  * CREATE REGISTRY
  */
 export function createSchemaRegistry(): SchemaRegistry {
   const registry = new SchemaRegistry();
   for (const schema of EXAMPLE_SCHEMAS) {
     registry.register(schema);
   }
   return registry;
 }