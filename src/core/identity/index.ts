 /**
  * IDENTITY SYSTEM INDEX
  * 
  * Global ID strategy - the foundation everything rests on.
  * This specification is LOCKED and may never change.
  */
 
 // =============================================================================
 // ID STRATEGY (core)
 // =============================================================================
 
 export {
   ID_RULES,
   FORBIDDEN_ID_PATTERNS,
   generateSemanticHash,
   generateSemanticSlug,
   generateCanonicalId,
   formatCanonicalId,
   parseCanonicalId,
   validateCanonicalId,
   incrementVersion,
   getBaseId,
   areSameConcept,
   type CanonicalId,
   type IdComponents,
   type SemanticHashInput,
   type IdValidationResult,
 } from './id-strategy';
 
 // =============================================================================
 // SOURCE REGISTRY
 // =============================================================================
 
 export {
   WELL_KNOWN_SOURCES,
   generateSourceId,
   buildSourceChain,
   validateSourceChain,
   type SourceDefinition,
   type SourceChainLink,
   type SourceChain,
 } from './source-registry';
 
 // =============================================================================
 // TEMPORAL AXIS
 // =============================================================================
 
 export {
   validateTemporalAxis,
   createCurrentTemporalAxis,
   closeTemporalAxis,
   isValidAt,
   getCurrentVersion,
   getVersionAt,
   type TemporalAxis,
   type TemporalPrecision,
   type TemporalMetadata,
   type TemporalValidationResult,
 } from './temporal-axis';
 
 // =============================================================================
 // ID STRATEGY SUMMARY (for documentation)
 // =============================================================================
 
 export const ID_STRATEGY_SPEC = {
   version: '1.0.0',
   lockedAt: '2025-02-05T00:00:00Z',
   
   format: '<namespace>:<object_type>:<semantic_hash>:<version>',
   
   principles: [
     'Global - works across all systems',
     'Eternal - never expires or changes meaning',
     'Deterministic - same definition = same ID',
     'Context-free - no external knowledge needed',
     'Machine-readable - parseable by any system',
     'Never reused - dead IDs stay dead',
   ],
   
   rules: [
     'Same object → same ID',
     'Different meaning → new ID',
     'New version → new ID (with supersedes relation)',
   ],
   
   forbidden: [
     'Auto-increment integers',
     'UUIDv4 (random = meaningless)',
     'Database-specific keys',
     'Timestamps alone',
   ],
   
   semanticHashInputs: [
     'Canonical name',
     'Formal definition',
     'Unit (if measure)',
     'Time dimension',
     'Allowed relations',
   ],
   
   versionRules: [
     'Version is part of ID, not metadata',
     'Versions linked by supersedes relation',
     'Definition change → new hash → new ID',
     'Data change → same ID (append only)',
   ],
 } as const;