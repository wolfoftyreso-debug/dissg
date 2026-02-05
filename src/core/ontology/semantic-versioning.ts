 /**
  * SEMANTIC VERSIONING SYSTEM
  * 
  * Rule: Meanings may never change - only be replaced.
  * Example: "unemployed" 1990 ≠ "unemployed" 2025 = two different concepts
  */
 
 export interface SemanticVersion {
   major: number;  // Breaking semantic change
   minor: number;  // Additive change (new fields)
   patch: number;  // Corrections without semantic change
 }
 
 export interface SchemaDefinition {
   /** Unique schema identifier */
   schema_id: string;
   
   /** Schema version */
   version: SemanticVersion;
   
   /** Human-readable name */
   name: string;
   
   /** What this schema represents */
   description: string;
   
   /** When this schema version was created */
   created_at: string;
   
   /** Previous version this supersedes (null if first) */
   supersedes: string | null;
   
   /** Future version that supersedes this (null if current) */
   superseded_by: string | null;
   
   /** The actual schema definition */
   fields: SchemaField[];
   
   /** Semantic mapping to previous versions */
   migration_notes: string | null;
 }
 
 export interface SchemaField {
   name: string;
   type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
   required: boolean;
   description: string;
   unit: string | null;
   constraints: Record<string, unknown> | null;
 }
 
 /**
  * Parse a version string like "1.2.3" into SemanticVersion
  */
 export function parseVersion(versionString: string): SemanticVersion {
   const parts = versionString.split('.');
   if (parts.length !== 3) {
     throw new Error(`Invalid version string: ${versionString}`);
   }
   
   return {
     major: parseInt(parts[0], 10),
     minor: parseInt(parts[1], 10),
     patch: parseInt(parts[2], 10),
   };
 }
 
 /**
  * Format SemanticVersion to string
  */
 export function formatVersion(version: SemanticVersion): string {
   return `${version.major}.${version.minor}.${version.patch}`;
 }
 
 /**
  * Compare two versions
  * Returns: -1 if a < b, 0 if equal, 1 if a > b
  */
 export function compareVersions(a: SemanticVersion, b: SemanticVersion): -1 | 0 | 1 {
   if (a.major !== b.major) return a.major < b.major ? -1 : 1;
   if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1;
   if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1;
   return 0;
 }
 
 /**
  * Check if a version change is breaking (major bump)
  */
 export function isBreakingChange(from: SemanticVersion, to: SemanticVersion): boolean {
   return to.major > from.major;
 }
 
 /**
  * Schema Registry - tracks all schema versions
  */
 export class SchemaRegistry {
   private schemas: Map<string, SchemaDefinition[]> = new Map();
   
   register(schema: SchemaDefinition): void {
     const existing = this.schemas.get(schema.schema_id) || [];
     existing.push(schema);
     existing.sort((a, b) => compareVersions(a.version, b.version));
     this.schemas.set(schema.schema_id, existing);
   }
   
   getLatest(schemaId: string): SchemaDefinition | undefined {
     const versions = this.schemas.get(schemaId);
     return versions?.[versions.length - 1];
   }
   
   getVersion(schemaId: string, version: string): SchemaDefinition | undefined {
     const versions = this.schemas.get(schemaId);
     const target = parseVersion(version);
     return versions?.find(s => compareVersions(s.version, target) === 0);
   }
   
   getAllVersions(schemaId: string): SchemaDefinition[] {
     return this.schemas.get(schemaId) || [];
   }
   
   getLineage(schemaId: string): string[] {
     const versions = this.getAllVersions(schemaId);
     return versions.map(v => formatVersion(v.version));
   }
 }
 
 // Global registry instance
 export const globalSchemaRegistry = new SchemaRegistry();