 /**
  * TRUTH ENGINE - DETERMINISTIC ID GENERATOR
  * 
  * IDs are content-addressable.
  * Same content = same ID = no duplicates.
  */
 
 import type { BaseClass } from './ontology';
 
 /**
  * Generate deterministic hash from content
  */
 function hashContent(content: string): string {
   let hash = 0;
   for (let i = 0; i < content.length; i++) {
     const char = content.charCodeAt(i);
     hash = ((hash << 5) - hash) + char;
     hash = hash & hash; // Convert to 32bit integer
   }
   return Math.abs(hash).toString(16).padStart(8, '0');
 }
 
 /**
  * Generate content-addressable ID
  * 
  * Format: {baseClass}:{schema_version}:{content_hash}
  */
 export function generateId(
   baseClass: BaseClass,
   schemaVersion: string,
   content: unknown
 ): string {
   // Canonical JSON serialization (sorted keys)
   const canonical = JSON.stringify(content, Object.keys(content as object).sort());
   const contentHash = hashContent(canonical);
   
   return `${baseClass.toLowerCase()}:${schemaVersion}:${contentHash}`;
 }
 
 /**
  * Parse ID components
  */
 export function parseId(id: string): {
   baseClass: string;
   schemaVersion: string;
   contentHash: string;
 } | null {
   const parts = id.split(':');
   if (parts.length !== 3) return null;
   
   return {
     baseClass: parts[0],
     schemaVersion: parts[1],
     contentHash: parts[2],
   };
 }
 
 /**
  * Validate ID format
  */
 export function isValidId(id: string): boolean {
   const parsed = parseId(id);
   if (!parsed) return false;
   
   // Validate base class prefix
   const validPrefixes = [
     'entity', 'attribute', 'relation', 'event', 
     'measure', 'source', 'schema', 'version', 'conclusion'
   ];
   
   return validPrefixes.includes(parsed.baseClass);
 }
 
 /**
  * Generate source ID
  */
 export function generateSourceId(
   organization: string,
   name: string
 ): string {
   return generateId('Source', 'v1', { organization, name });
 }
 
 /**
  * Generate schema ID
  */
 export function generateSchemaId(
   name: string,
   version: number
 ): string {
   return generateId('Schema', 'v1', { name, version });
 }
 
 /**
  * Generate entity ID
  */
 export function generateEntityId(
   entityType: string,
   identifiers: Record<string, string>
 ): string {
   return generateId('Entity', 'v1', { entityType, identifiers });
 }
 
 /**
  * Generate measure ID
  */
 export function generateMeasureId(
   schemaId: string,
   entityId: string,
   observedAt: string
 ): string {
   return generateId('Measure', 'v1', { schemaId, entityId, observedAt });
 }