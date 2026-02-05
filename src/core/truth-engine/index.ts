 /**
  * TRUTH ENGINE - MINIMAL VIABLE CORE (MCTE)
  * 
  * The smallest runnable system that can:
  * 1. Store ONE truth correctly
  * 2. Reject everything else
  * 
  * Components:
  * - Core: Ontology, IDs, Invariants
  * - Store: Append-only
  * - Query: Read-only
  * - Schemas: Population (first truth)
  */
 
 // Core
 export {
   BASE_CLASSES,
   type BaseClass,
   type CoreObject,
   type Entity,
   type Source,
   type Schema,
   type Measure,
   type TemporalEnvelope,
   type SourceEnvelope,
   type UncertaintyEnvelope,
   isMeasure,
   isSource,
   isSchema,
   isEntity,
   isValidBaseClass,
 } from './core/ontology';
 
 export {
   generateId,
   generateSourceId,
   generateSchemaId,
   generateEntityId,
   generateMeasureId,
   parseId,
   isValidId,
 } from './core/ids';
 
 export {
   CORE_INVARIANTS,
   runInvariants,
   enforceInvariants,
   type Invariant,
   type InvariantResult,
 } from './core/invariants';
 
 // Store
 export {
   create,
   read,
   readAll,
   exists,
   getWriteLog,
   getStats,
   update,
   deleteObject,
   _clearForTesting,
   type WriteResult,
 } from './store/append-only';
 
 // Query
 export {
   executeQuery,
   getById,
   getSchema,
   getSource,
   getEntity,
   explainValue,
   type QueryRequest,
   type QueryResult,
 } from './query/read';
 
 // Schemas (First Truth)
 export {
   POPULATION_SCHEMA,
   SCB_SOURCE,
   SWEDEN_ENTITY,
   SWEDEN_POPULATION_2023,
   SEED_DATA,
 } from './schemas/population';
 
 // Tests
 export {
   runAllTests,
 } from './tests/invariant-tests';
 
 /**
  * INITIALIZE TRUTH ENGINE
  * 
  * Seeds the store with the first truth.
  */
 import { create as storeCreate } from './store/append-only';
 import { 
   SEED_DATA, 
   POPULATION_SCHEMA as _POPULATION_SCHEMA,
   SCB_SOURCE as _SCB_SOURCE,
   SWEDEN_ENTITY as _SWEDEN_ENTITY,
   SWEDEN_POPULATION_2023 as _SWEDEN_POPULATION_2023,
 } from './schemas/population';
 
 export function initializeTruthEngine(): {
   success: boolean;
   objectsCreated: number;
   errors: string[];
 } {
   const errors: string[] = [];
   let created = 0;
   
   // Write schemas
   for (const schema of SEED_DATA.schemas) {
     const result = storeCreate(schema, 'truth-engine:init');
     if (result.success) created++;
     else if (result.error && !result.error.includes('already exists')) {
       errors.push(result.error);
     }
   }
   
   // Write sources
   for (const source of SEED_DATA.sources) {
     const result = storeCreate(source, 'truth-engine:init');
     if (result.success) created++;
     else if (result.error && !result.error.includes('already exists')) {
       errors.push(result.error);
     }
   }
   
   // Write entities
   for (const entity of SEED_DATA.entities) {
     const result = storeCreate(entity, 'truth-engine:init');
     if (result.success) created++;
     else if (result.error && !result.error.includes('already exists')) {
       errors.push(result.error);
     }
   }
   
   // Write measures
   for (const measure of SEED_DATA.measures) {
     const result = storeCreate(measure, 'truth-engine:init');
     if (result.success) created++;
     else if (result.error && !result.error.includes('already exists')) {
       errors.push(result.error);
     }
   }
   
   return {
     success: errors.length === 0,
     objectsCreated: created,
     errors,
   };
 }
 
 /**
  * THE FIRST TRUTH - Explain it
  */
 export function explainFirstTruth(): string {
   return `
 ═══════════════════════════════════════════════════════════════
 TRUTH ENGINE - FIRST TRUTH
 ═══════════════════════════════════════════════════════════════
 
 VALUE: 10,551,707 persons
 
 WHAT IT MEANS:
 ${_POPULATION_SCHEMA.definition}
 
 SOURCE: ${_SCB_SOURCE.organization}
 Reliability: ${(_SCB_SOURCE.reliability_score * 100).toFixed(0)}%
 Methodology: ${_SCB_SOURCE.methodology_url}
 
 ENTITY: ${_SWEDEN_ENTITY.name} (${_SWEDEN_ENTITY.identifiers.iso3166_1_alpha2})
 
 TIME:
 - Observed: ${_SWEDEN_POPULATION_2023.temporal.observed_at}
 - Valid from: ${_SWEDEN_POPULATION_2023.temporal.valid_from}
 - Valid to: ${_SWEDEN_POPULATION_2023.temporal.valid_to || 'Present (most recent)'}
 
 UNCERTAINTY:
 - Coverage: ${(_SWEDEN_POPULATION_2023.uncertainty.coverage * 100).toFixed(1)}%
 - Note: ${_SWEDEN_POPULATION_2023.uncertainty.methodology_note}
 
 ═══════════════════════════════════════════════════════════════
 This is what a truth looks like when properly specified.
 ═══════════════════════════════════════════════════════════════
 `.trim();
 }