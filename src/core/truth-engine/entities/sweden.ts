 /**
  * TRUTH ENGINE - SWEDEN ENTITY
  * 
  * Step 9: Sweden as an explicit, versioned, time-bound entity.
  * 
  * From now on:
  * ❌ No values without entities
  * ❌ No entities without time
  * ❌ No entities without source
  * 
  * This is IRREVERSIBLE.
  */
 
 import { generateEntityId, generateSourceId } from '../core/ids';
 import type { Entity, Source } from '../core/ontology';
 import { COUNTRY_SCHEMA_V1 } from '../schemas/country';
 
 const NOW = new Date().toISOString();
 
 /**
  * Source for Sweden entity data
  */
 export const SWEDEN_ENTITY_SOURCE: Source = {
   id: generateSourceId('SCB', 'Geographic Registry'),
   baseClass: 'Source',
   schema_id: 'schema:v1:system',
   created_at: NOW,
   created_by: 'truth-engine:init',
   name: 'Geographic Registry',
   organization: 'Statistics Sweden (SCB)',
   url: 'https://www.scb.se/en/finding-statistics/regional-statistics/',
   reliability_score: 0.98,
   methodology_url: null,
 };
 
 /**
  * SWEDEN - The Entity
  * 
  * Note:
  * - valid_from: 1523-06-06 (Gustav Vasa elected king, end of Kalmar Union)
  * - valid_to: null (still exists)
  * - The entity lives INDEPENDENTLY of any measures
  */
 export const SWEDEN: Entity = {
   id: generateEntityId('country', { 
     iso3166_1_alpha2: 'SE', 
     name: 'Sweden',
     version: 'v1',
   }),
   baseClass: 'Entity',
   schema_id: COUNTRY_SCHEMA_V1.id,
   created_at: NOW,
   created_by: 'truth-engine:init',
   
   entity_type: 'country',
   name: 'Sweden',
   
   identifiers: {
     // ISO 3166-1 codes
     iso_alpha2: 'SE',
     iso_alpha3: 'SWE',
     iso_numeric: '752',
     
     // Names
     name_en: 'Sweden',
     name_sv: 'Sverige',
     name_official: 'Kingdom of Sweden',
     name_official_sv: 'Konungariket Sverige',
     
     // Temporal bounds (entity-level, not measure-level)
     valid_from: '1523-06-06',  // Gustav Vasa
     valid_to: null,            // Still exists
     
     // Source reference
     source_id: SWEDEN_ENTITY_SOURCE.id,
   },
 };
 
 /**
  * Entity temporal metadata (for validation)
  */
 export const SWEDEN_TEMPORAL = {
   valid_from: '1523-06-06',
   valid_to: null,
   source_id: SWEDEN_ENTITY_SOURCE.id,
   source_note: 'Gustav Vasa elected king, marking the end of the Kalmar Union and the beginning of modern Sweden as a sovereign state.',
 };