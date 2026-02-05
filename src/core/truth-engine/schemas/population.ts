 /**
  * TRUTH ENGINE - POPULATION SCHEMA
  * 
  * First truth: Sverige befolkning 2023 enligt SCB
  */
 
 import type { Schema, Source, Entity, Measure } from '../core/ontology';
 import { generateSchemaId, generateSourceId, generateEntityId, generateMeasureId } from '../core/ids';
 
 const NOW = new Date().toISOString();
 
 /**
  * SCHEMA: Population (Resident Definition)
  */
 export const POPULATION_SCHEMA: Schema = {
   id: generateSchemaId('population_resident', 1),
   baseClass: 'Schema',
   schema_id: 'schema:v1:system',
   created_at: NOW,
   created_by: 'truth-engine:init',
   name: 'Population (Resident Definition)',
   definition: 'Total number of persons registered as residents in a geographic area at a specific point in time. Includes all persons with a registered address regardless of citizenship. Excludes temporary visitors and undocumented persons.',
   unit: 'persons',
   dimension: 'count',
   version: 1,
   supersedes: null,
 };
 
 /**
  * SOURCE: SCB (Statistics Sweden)
  */
 export const SCB_SOURCE: Source = {
   id: generateSourceId('SCB', 'Population Statistics'),
   baseClass: 'Source',
   schema_id: 'schema:v1:system',
   created_at: NOW,
   created_by: 'truth-engine:init',
   name: 'Population Statistics',
   organization: 'Statistics Sweden (SCB)',
   url: 'https://www.scb.se/en/finding-statistics/statistics-by-subject-area/population/',
   reliability_score: 0.95,
   methodology_url: 'https://www.scb.se/en/finding-statistics/statistics-by-subject-area/population/population-composition/population-statistics/',
 };
 
 /**
  * ENTITY: Sweden
  * 
  * Step 9: Now includes temporal bounds and source (REQUIRED)
  */
 export const SWEDEN_ENTITY: Entity = {
   id: generateEntityId('country', { iso3166_1_alpha2: 'SE', name: 'Sweden' }),
   baseClass: 'Entity',
   schema_id: 'schema:v1:system',
   created_at: NOW,
   created_by: 'truth-engine:init',
   entity_type: 'country',
   name: 'Sweden',
   identifiers: {
     iso3166_1_alpha2: 'SE',
     iso3166_1_alpha3: 'SWE',
     iso3166_1_numeric: '752',
     name_en: 'Sweden',
     name_sv: 'Sverige',
     // Step 9: Temporal bounds and source (REQUIRED)
     valid_from: '1523-06-06',  // Gustav Vasa
     valid_to: null,            // Still exists
     source_id: 'source:v1:SCB:Geographic Registry',
   },
 };
 
 /**
  * MEASURE: Sweden Population 2023
  * 
  * THE FIRST TRUTH
  */
 export const SWEDEN_POPULATION_2023: Measure = {
   id: generateMeasureId(POPULATION_SCHEMA.id, SWEDEN_ENTITY.id, '2023-12-31'),
   baseClass: 'Measure',
   schema_id: POPULATION_SCHEMA.id,
   entity_id: SWEDEN_ENTITY.id,
   created_at: NOW,
   created_by: 'truth-engine:init',
   
   value: 10551707,
   unit: 'persons',
   
   temporal: {
     observed_at: '2023-12-31T00:00:00Z',
     valid_from: '2023-12-31T00:00:00Z',
     valid_to: null, // Most recent
   },
   
   source: {
     source_id: SCB_SOURCE.id,
     source_version: '2024-02',
     source_accessed_at: '2025-02-05T00:00:00Z',
   },
   
   uncertainty: {
     confidence_interval: [10551707, 10551707], // Exact count
     coverage: 0.99, // 99% - excludes undocumented
     methodology_note: 'Based on population register. Excludes persons not registered in Sweden. Registration lag may affect accuracy by approximately 0.1%.',
   },
 };
 
 /**
  * ALL SEED DATA
  */
 export const SEED_DATA = {
   schemas: [POPULATION_SCHEMA],
   sources: [SCB_SOURCE],
   entities: [SWEDEN_ENTITY],
   measures: [SWEDEN_POPULATION_2023],
 };