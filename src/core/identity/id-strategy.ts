 /**
  * GLOBAL ID STRATEGY
  * 
  * LOCKED. This specification is immutable.
  * IDs are: global, eternal, deterministic, context-free, machine-readable, never reused.
  * 
  * Format: <namespace>:<object_type>:<semantic_hash>:<version>
  */
 
 import { type BaseObjectType } from '../ontology/base-objects';
 
 // =============================================================================
 // ID FORMAT SPECIFICATION
 // =============================================================================
 
 export interface CanonicalId {
   /** Namespace (always 'core' for system objects) */
   namespace: 'core' | 'ext';
   
   /** Object type in lowercase */
   objectType: Lowercase<BaseObjectType>;
   
   /** Semantic hash of the definition */
   semanticHash: string;
   
   /** Version number */
   version: number;
 }
 
 export interface IdComponents {
   namespace: string;
   objectType: string;
   semanticHash: string;
   version: string;
 }
 
 // =============================================================================
 // ID FORMAT RULES
 // =============================================================================
 
 export const ID_RULES = {
   separator: ':',
   versionPrefix: 'v',
   
   namespaces: ['core', 'ext'] as const,
   
   objectTypes: [
     'entity',
     'attribute', 
     'relation',
     'event',
     'measure',
     'source',
     'schema',
     'version',
   ] as const,
   
   // Semantic hash requirements
   hashAlgorithm: 'sha256' as const,
   hashLength: 12, // First 12 chars of hash for readability
   
   // Version rules
   minVersion: 1,
   maxVersion: 999999,
   
   // Character rules
   allowedChars: /^[a-z0-9_]+$/,
   maxSemanticHashLength: 64,
 } as const;
 
 // =============================================================================
 // FORBIDDEN ID PATTERNS
 // =============================================================================
 
 export const FORBIDDEN_ID_PATTERNS = {
   /** Never use auto-increment */
   autoIncrement: /^\d+$/,
   
   /** Never use UUIDv4 (random = meaningless for semantics) */
   uuidV4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
   
   /** Never use database-specific keys */
   databaseKey: /^(row_|pk_|id_)\d+$/,
   
   /** Never use timestamps alone */
   timestampOnly: /^\d{10,13}$/,
 } as const;
 
 // =============================================================================
 // SEMANTIC HASH INPUT
 // =============================================================================
 
 export interface SemanticHashInput {
   /** Canonical name of the object */
   canonicalName: string;
   
   /** Formal definition text */
   definition: string;
   
   /** Unit of measurement (for measures) */
   unit?: string;
   
   /** Time dimension type */
   timeDimension?: 'point' | 'period' | 'series' | 'snapshot';
   
   /** Allowed relation types (for entities) */
   allowedRelations?: string[];
   
   /** Parent schema ID */
   schemaId?: string;
 }
 
 // =============================================================================
 // ID GENERATION
 // =============================================================================
 
 /**
  * Generate a deterministic semantic hash from definition
  * Same definition = same hash (always)
  */
 export async function generateSemanticHash(input: SemanticHashInput): Promise<string> {
   // Normalize input for deterministic hashing
   const normalized = {
     canonicalName: input.canonicalName.toLowerCase().trim(),
     definition: input.definition.toLowerCase().trim(),
     unit: input.unit?.toLowerCase().trim() ?? null,
     timeDimension: input.timeDimension ?? null,
     allowedRelations: input.allowedRelations?.sort() ?? null,
     schemaId: input.schemaId ?? null,
   };
   
   // Create deterministic string
   const hashInput = JSON.stringify(normalized, Object.keys(normalized).sort());
   
   // Generate SHA-256 hash
   const encoder = new TextEncoder();
   const data = encoder.encode(hashInput);
   const hashBuffer = await crypto.subtle.digest('SHA-256', data);
   
   // Convert to hex and take first N characters
   const hashArray = Array.from(new Uint8Array(hashBuffer));
   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   
   return hashHex.substring(0, ID_RULES.hashLength);
 }
 
 /**
  * Generate a human-readable semantic slug
  * Used in combination with hash for readability
  */
 export function generateSemanticSlug(canonicalName: string): string {
   return canonicalName
     .toLowerCase()
     .trim()
     .replace(/[^a-z0-9]+/g, '_')
     .replace(/^_+|_+$/g, '')
     .substring(0, 40);
 }
 
 /**
  * Generate a complete canonical ID
  */
 export async function generateCanonicalId(
   objectType: Lowercase<BaseObjectType>,
   input: SemanticHashInput,
   version: number = 1
 ): Promise<string> {
   const slug = generateSemanticSlug(input.canonicalName);
   const hash = await generateSemanticHash(input);
   
   return formatCanonicalId({
     namespace: 'core',
     objectType,
     semanticHash: `${slug}_${hash}`,
     version,
   });
 }
 
 /**
  * Format a CanonicalId object to string
  */
 export function formatCanonicalId(id: CanonicalId): string {
   return [
     id.namespace,
     id.objectType,
     id.semanticHash,
     `${ID_RULES.versionPrefix}${id.version}`,
   ].join(ID_RULES.separator);
 }
 
 /**
  * Parse a string ID to components
  */
 export function parseCanonicalId(idString: string): IdComponents | null {
   const parts = idString.split(ID_RULES.separator);
   
   if (parts.length !== 4) return null;
   
   const [namespace, objectType, semanticHash, versionStr] = parts;
   
   if (!ID_RULES.namespaces.includes(namespace as any)) return null;
   if (!ID_RULES.objectTypes.includes(objectType as any)) return null;
   if (!versionStr.startsWith(ID_RULES.versionPrefix)) return null;
   
   return {
     namespace,
     objectType,
     semanticHash,
     version: versionStr,
   };
 }
 
 // =============================================================================
 // ID VALIDATION
 // =============================================================================
 
 export interface IdValidationResult {
   valid: boolean;
   errors: string[];
   parsed?: IdComponents;
 }
 
 export function validateCanonicalId(idString: string): IdValidationResult {
   const errors: string[] = [];
   
   // Check forbidden patterns
   for (const [name, pattern] of Object.entries(FORBIDDEN_ID_PATTERNS)) {
     if (pattern.test(idString)) {
       errors.push(`ID matches forbidden pattern: ${name}`);
     }
   }
   
   // Parse and validate structure
   const parsed = parseCanonicalId(idString);
   
   if (!parsed) {
     errors.push('ID does not match canonical format: namespace:type:hash:version');
     return { valid: false, errors };
   }
   
   // Validate namespace
   if (!ID_RULES.namespaces.includes(parsed.namespace as any)) {
     errors.push(`Invalid namespace: ${parsed.namespace}`);
   }
   
   // Validate object type
   if (!ID_RULES.objectTypes.includes(parsed.objectType as any)) {
     errors.push(`Invalid object type: ${parsed.objectType}`);
   }
   
   // Validate semantic hash
   if (!ID_RULES.allowedChars.test(parsed.semanticHash)) {
     errors.push('Semantic hash contains invalid characters');
   }
   
   if (parsed.semanticHash.length > ID_RULES.maxSemanticHashLength) {
     errors.push(`Semantic hash too long: ${parsed.semanticHash.length} > ${ID_RULES.maxSemanticHashLength}`);
   }
   
   // Validate version
   const versionNum = parseInt(parsed.version.substring(1), 10);
   if (isNaN(versionNum) || versionNum < ID_RULES.minVersion || versionNum > ID_RULES.maxVersion) {
     errors.push(`Invalid version: ${parsed.version}`);
   }
   
   return {
     valid: errors.length === 0,
     errors,
     parsed: errors.length === 0 ? parsed : undefined,
   };
 }
 
 // =============================================================================
 // VERSION OPERATIONS
 // =============================================================================
 
 /**
  * Create next version of an ID
  */
 export function incrementVersion(idString: string): string | null {
   const parsed = parseCanonicalId(idString);
   if (!parsed) return null;
   
   const currentVersion = parseInt(parsed.version.substring(1), 10);
   const nextVersion = currentVersion + 1;
   
   return [
     parsed.namespace,
     parsed.objectType,
     parsed.semanticHash,
     `${ID_RULES.versionPrefix}${nextVersion}`,
   ].join(ID_RULES.separator);
 }
 
 /**
  * Get base ID without version
  */
 export function getBaseId(idString: string): string | null {
   const parsed = parseCanonicalId(idString);
   if (!parsed) return null;
   
   return [
     parsed.namespace,
     parsed.objectType,
     parsed.semanticHash,
   ].join(ID_RULES.separator);
 }
 
 /**
  * Check if two IDs are versions of the same concept
  */
 export function areSameConcept(id1: string, id2: string): boolean {
   const base1 = getBaseId(id1);
   const base2 = getBaseId(id2);
   
   return base1 !== null && base2 !== null && base1 === base2;
 }