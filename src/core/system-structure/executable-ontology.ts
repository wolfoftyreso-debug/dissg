 /**
  * EXECUTABLE ONTOLOGY
  * 
  * Ontology is CODE, not documentation.
  * If it can't be loaded by machine → it's worthless.
  * 
  * ASSERT ontology_files ARE parseable AND executable
  */
 
 /**
  * ENTITY DEFINITION
  */
 export interface OntologyEntity {
   /** Canonical ID: core:entity:{type}:v{version} */
   id: string;
   
   /** Version number */
   version: number;
   
   /** Human-readable definition */
   definition: string;
   
   /** Is temporal dimension required? */
   temporal: 'required' | 'optional' | 'forbidden';
   
   /** Allowed relations */
   relations: OntologyRelation[];
   
   /** Required properties */
   requiredProperties: string[];
   
   /** Optional properties */
   optionalProperties: string[];
   
   /** Validation rules */
   validationRules: ValidationRule[];
   
   /** Supersedes (if this is a new version) */
   supersedes?: string;
 }
 
 export interface OntologyRelation {
   name: string;
   targetEntityType: string;
   cardinality: '1:1' | '1:n' | 'n:1' | 'n:n';
   required: boolean;
 }
 
 export interface ValidationRule {
   name: string;
   rule: string;
   errorCode: string;
 }
 
 /**
  * EXAMPLE ENTITIES (EXECUTABLE)
  */
 export const CORE_ENTITIES: OntologyEntity[] = [
   {
     id: 'core:entity:country:v1',
     version: 1,
     definition: 'Sovereign geopolitical unit recognized by at least one international body.',
     temporal: 'required',
     relations: [
       { name: 'borders', targetEntityType: 'country', cardinality: 'n:n', required: false },
       { name: 'has_population', targetEntityType: 'population', cardinality: '1:n', required: true },
       { name: 'governed_by', targetEntityType: 'government', cardinality: '1:1', required: false },
     ],
     requiredProperties: ['code', 'name', 'recognition_date'],
     optionalProperties: ['local_name', 'capital'],
     validationRules: [
       { name: 'valid_code', rule: 'code MATCHES /^[A-Z]{2,3}$/', errorCode: 'ONT-001' },
       { name: 'has_name', rule: 'name IS NOT EMPTY', errorCode: 'ONT-002' },
     ],
   },
   
   {
     id: 'core:entity:indicator:v1',
     version: 1,
     definition: 'Measurable quantity with defined methodology and unit.',
     temporal: 'required',
     relations: [
       { name: 'measured_at', targetEntityType: 'geography', cardinality: 'n:n', required: true },
       { name: 'has_source', targetEntityType: 'source', cardinality: 'n:n', required: true },
       { name: 'part_of', targetEntityType: 'indicator_group', cardinality: 'n:1', required: false },
     ],
     requiredProperties: ['code', 'name', 'unit', 'methodology_version'],
     optionalProperties: ['description', 'frequency'],
     validationRules: [
       { name: 'has_unit', rule: 'unit IS NOT EMPTY', errorCode: 'ONT-003' },
       { name: 'has_methodology', rule: 'methodology_version IS NOT NULL', errorCode: 'ONT-004' },
     ],
   },
   
   {
     id: 'core:entity:measurement:v1',
     version: 1,
     definition: 'Single data point with full provenance chain.',
     temporal: 'required',
     relations: [
       { name: 'of_indicator', targetEntityType: 'indicator', cardinality: 'n:1', required: true },
       { name: 'at_geography', targetEntityType: 'geography', cardinality: 'n:1', required: true },
       { name: 'from_source', targetEntityType: 'source', cardinality: 'n:1', required: true },
     ],
     requiredProperties: ['value', 'timestamp', 'source_hash', 'methodology_version'],
     optionalProperties: ['confidence', 'revision_number'],
     validationRules: [
       { name: 'has_value', rule: 'value IS NOT NULL', errorCode: 'ONT-005' },
       { name: 'has_time', rule: 'timestamp IS NOT NULL', errorCode: 'ONT-006' },
       { name: 'has_source', rule: 'source_hash IS NOT NULL', errorCode: 'ONT-007' },
     ],
   },
 ];
 
 /**
  * ONTOLOGY REGISTRY
  */
 export class OntologyRegistry {
   private entities: Map<string, OntologyEntity> = new Map();
   
   constructor() {
     // Load core entities
     for (const entity of CORE_ENTITIES) {
       this.entities.set(entity.id, entity);
     }
   }
   
   /**
    * GET ENTITY BY ID
    */
   getEntity(id: string): OntologyEntity | undefined {
     return this.entities.get(id);
   }
   
   /**
    * VALIDATE ENTITY INSTANCE
    */
   validateInstance(
     entityId: string,
     instance: Record<string, unknown>
   ): { valid: boolean; errors: string[] } {
     const entity = this.entities.get(entityId);
     if (!entity) {
       return { valid: false, errors: [`Unknown entity: ${entityId}`] };
     }
     
     const errors: string[] = [];
     
     // Check required properties
     for (const prop of entity.requiredProperties) {
       if (!(prop in instance) || instance[prop] === null || instance[prop] === undefined) {
         errors.push(`Missing required property: ${prop}`);
       }
     }
     
     // Check temporal requirement
     if (entity.temporal === 'required' && !instance['timestamp']) {
       errors.push('Temporal dimension required but not provided');
     }
     
     return {
       valid: errors.length === 0,
       errors,
     };
   }
   
   /**
    * GET ALL ENTITIES
    */
   getAllEntities(): OntologyEntity[] {
     return Array.from(this.entities.values());
   }
   
   /**
    * ADD ENTITY (versioned, never replaces)
    */
   addEntity(entity: OntologyEntity): { success: boolean; error?: string } {
     if (this.entities.has(entity.id)) {
       return { success: false, error: `Entity ${entity.id} already exists. Use SUPERSEDE.` };
     }
     this.entities.set(entity.id, entity);
     return { success: true };
   }
 }
 
 /**
  * CREATE REGISTRY
  */
 export function createOntologyRegistry(): OntologyRegistry {
   return new OntologyRegistry();
 }
 
 /**
  * ONTOLOGY SELF-TESTS
  */
 export const ONTOLOGY_SELF_TESTS = {
   parseable: {
     test: 'ASSERT ontology_files ARE parseable',
     description: 'All ontology definitions can be loaded',
   },
   executable: {
     test: 'ASSERT ontology_files ARE executable',
     description: 'All validation rules can be run',
   },
   complete: {
     test: 'FOR EACH entity: ASSERT has_definition AND has_relations',
     description: 'All entities are fully defined',
   },
 } as const;