 /**
  * TRUTH ENGINE - COUNTRY SCHEMA
  * 
  * Step 9: Entity schema for sovereign countries.
  * 
  * This is NOT Sweden.
  * This is the TYPE "country".
  * No values, only structure.
  */
 
 import { generateSchemaId } from '../core/ids';
 import type { Schema } from '../core/ontology';
 
 export const COUNTRY_SCHEMA_V1: Schema = {
   id: generateSchemaId('country', 1),
   baseClass: 'Schema',
   schema_id: 'schema:v1:system',
   created_at: new Date().toISOString(),
   created_by: 'truth-engine:init',
   
   name: 'Country (Sovereign State)',
   definition: 'A sovereign geopolitical unit recognized by at least one international body (UN, EU, etc.). Excludes dependent territories, disputed regions, and historical states unless explicitly versioned.',
   unit: 'entity',
   dimension: 'geopolitical',
   version: 1,
   supersedes: null,
 };
 
 /**
  * Country entity attributes (required for all country instances)
  */
 export interface CountryAttributes {
   readonly name: string;
   readonly iso_alpha2: string;  // ISO 3166-1 alpha-2
   readonly iso_alpha3: string;  // ISO 3166-1 alpha-3
   readonly iso_numeric: string; // ISO 3166-1 numeric
   readonly name_local?: string; // Name in local language
 }
 
 /**
  * Country temporal requirements
  */
 export interface CountryTemporal {
   readonly valid_from: string;  // ISO 8601 - when the country came into existence
   readonly valid_to: string | null; // ISO 8601 or null if still exists
 }