 /**
  * CORE ONTOLOGY - BASE OBJECTS
  * 
  * All data in the world reduces to exactly 6 types.
  * Nothing else may exist.
  */
 
 // =============================================================================
 // THE SIX ABSOLUTE TYPES
 // =============================================================================
 
 export type BaseObjectType = 
   | 'ENTITY'      // Something that exists
   | 'ATTRIBUTE'   // Property of an entity
   | 'RELATION'    // Connection between entities
   | 'EVENT'       // Change over time
   | 'MEASURE'     // Quantifiable observation
   | 'SOURCE';     // Where data comes from
 
 export const BASE_OBJECT_TYPES: readonly BaseObjectType[] = [
   'ENTITY',
   'ATTRIBUTE', 
   'RELATION',
   'EVENT',
   'MEASURE',
   'SOURCE',
 ] as const;
 
 // =============================================================================
 // MANDATORY FIELDS (every object must have these)
 // =============================================================================
 
 export interface BaseObjectFields {
   /** Global, eternal, immutable identifier */
   id: string;
   
   /** Formally defined object type */
   type: BaseObjectType;
   
   /** UTC timestamp of creation */
   created_at: string;
   
   /** When this data became valid */
   valid_from: string;
   
   /** When this data ceased to be valid (null = still valid) */
   valid_to: string | null;
   
   /** Reference to source object */
   source_id: string;
   
   /** Semantic schema version */
   schema_version: string;
 }
 
 // =============================================================================
 // SPECIFIC OBJECT DEFINITIONS
 // =============================================================================
 
 export interface Entity extends BaseObjectFields {
   type: 'ENTITY';
   entity_type: string;        // e.g., 'country', 'region', 'indicator'
   canonical_name: string;     // Primary name
   names: Record<string, string>; // Localized names
 }
 
 export interface Attribute extends BaseObjectFields {
   type: 'ATTRIBUTE';
   entity_id: string;          // Which entity this belongs to
   attribute_key: string;      // e.g., 'population', 'area'
   value: unknown;             // The actual value
   unit: string | null;        // Unit of measurement
 }
 
 export interface Relation extends BaseObjectFields {
   type: 'RELATION';
   relation_type: string;      // e.g., 'parent_of', 'contains', 'correlates_with'
   from_entity_id: string;     // Source entity
   to_entity_id: string;       // Target entity
   properties: Record<string, unknown>; // Relation metadata
   bidirectional: boolean;     // Can be traversed both ways
 }
 
 export interface Event extends BaseObjectFields {
   type: 'EVENT';
   event_type: string;         // e.g., 'policy_change', 'data_revision'
   affected_entity_ids: string[];
   occurred_at: string;        // When the event happened
   description: string;
   impact_assessment: Record<string, unknown> | null;
 }
 
 export interface Measure extends BaseObjectFields {
   type: 'MEASURE';
   entity_id: string;          // What is being measured
   indicator_id: string;       // Which indicator
   value: number;              // The measurement
   unit: string;               // Unit of measurement
   measurement_date: string;   // When measured
   confidence: number;         // 0-1 confidence score
   methodology: string;        // How it was measured
 }
 
 export interface Source extends BaseObjectFields {
   type: 'SOURCE';
   source_type: 'official' | 'academic' | 'ngo' | 'derived';
   organization: string;
   reliability_score: number;  // 0-1
   url: string | null;
   last_verified: string;
   coverage: {
     geographic: string[];
     temporal: { from: string; to: string };
     thematic: string[];
   };
 }
 
 export type AnyBaseObject = Entity | Attribute | Relation | Event | Measure | Source;
 
 // =============================================================================
 // VALIDATION
 // =============================================================================
 
 export function isValidBaseObject(obj: unknown): obj is AnyBaseObject {
   if (typeof obj !== 'object' || obj === null) return false;
   
   const o = obj as Record<string, unknown>;
   
   // Check mandatory fields
   if (typeof o.id !== 'string') return false;
   if (!BASE_OBJECT_TYPES.includes(o.type as BaseObjectType)) return false;
   if (typeof o.created_at !== 'string') return false;
   if (typeof o.valid_from !== 'string') return false;
   if (o.valid_to !== null && typeof o.valid_to !== 'string') return false;
   if (typeof o.source_id !== 'string') return false;
   if (typeof o.schema_version !== 'string') return false;
   
   return true;
 }
 
 export function validateBaseObjectCompleteness(obj: Partial<BaseObjectFields>): {
   valid: boolean;
   missing: string[];
 } {
   const required = ['id', 'type', 'created_at', 'valid_from', 'source_id', 'schema_version'];
   const missing = required.filter(field => !(field in obj) || obj[field as keyof BaseObjectFields] === undefined);
   
   return {
     valid: missing.length === 0,
     missing,
   };
 }