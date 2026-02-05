 /**
  * TRUTH ENGINE - CORE ONTOLOGY
  * 
  * The 9 permitted base classes.
  * NO OTHER TYPES MAY EXIST.
  */
 
 /**
  * BASE CLASS ENUMERATION (LOCKED)
  */
 export const BASE_CLASSES = [
   'Entity',
   'Attribute', 
   'Relation',
   'Event',
   'Measure',
   'Source',
   'Schema',
   'Version',
   'Conclusion',
 ] as const;
 
 export type BaseClass = typeof BASE_CLASSES[number];
 
 /**
  * TEMPORAL ENVELOPE (REQUIRED FOR ALL OBJECTS)
  */
 export interface TemporalEnvelope {
   readonly observed_at: string;   // ISO 8601
   readonly valid_from: string;    // ISO 8601
   readonly valid_to: string | null; // ISO 8601 or null for ongoing
 }
 
 /**
  * SOURCE ENVELOPE (REQUIRED FOR ALL DATA)
  */
 export interface SourceEnvelope {
   readonly source_id: string;
   readonly source_version: string;
   readonly source_accessed_at: string;
 }
 
 /**
  * UNCERTAINTY ENVELOPE (REQUIRED FOR ALL MEASURES)
  */
 export interface UncertaintyEnvelope {
   readonly confidence_interval: [number, number];
   readonly coverage: number; // 0-1
   readonly methodology_note: string;
 }
 
 /**
  * CORE OBJECT - Base for all truth engine objects
  */
 export interface CoreObject {
   readonly id: string;
   readonly baseClass: BaseClass;
   readonly schema_id: string;
   readonly created_at: string;
   readonly created_by: string;
 }
 
 /**
  * ENTITY - A thing that exists
  */
 export interface Entity extends CoreObject {
   readonly baseClass: 'Entity';
   readonly entity_type: string;
   readonly name: string;
   readonly identifiers: Record<string, string>;
 }
 
 /**
  * SOURCE - Origin of data
  */
 export interface Source extends CoreObject {
   readonly baseClass: 'Source';
   readonly name: string;
   readonly organization: string;
   readonly url: string | null;
   readonly reliability_score: number; // 0-1
   readonly methodology_url: string | null;
 }
 
 /**
  * SCHEMA - Definition of a measure
  */
 export interface Schema extends CoreObject {
   readonly baseClass: 'Schema';
   readonly name: string;
   readonly definition: string;
   readonly unit: string;
   readonly dimension: string;
   readonly version: number;
   readonly supersedes: string | null;
 }
 
 /**
  * MEASURE - A quantified observation
  */
 export interface Measure extends CoreObject {
   readonly baseClass: 'Measure';
   readonly schema_id: string;
   readonly entity_id: string;
   readonly value: number;
   readonly unit: string;
   readonly temporal: TemporalEnvelope;
   readonly source: SourceEnvelope;
   readonly uncertainty: UncertaintyEnvelope;
 }
 
 /**
  * Type guards
  */
 export function isValidBaseClass(value: unknown): value is BaseClass {
   return typeof value === 'string' && BASE_CLASSES.includes(value as BaseClass);
 }
 
 export function isMeasure(obj: CoreObject): obj is Measure {
   return obj.baseClass === 'Measure';
 }
 
 export function isSource(obj: CoreObject): obj is Source {
   return obj.baseClass === 'Source';
 }
 
 export function isSchema(obj: CoreObject): obj is Schema {
   return obj.baseClass === 'Schema';
 }
 
 export function isEntity(obj: CoreObject): obj is Entity {
   return obj.baseClass === 'Entity';
 }