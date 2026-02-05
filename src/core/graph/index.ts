 /**
  * GRAPH MODEL
  * 
  * Defines exact relation types between the 6 base objects
  * and traversal rules for the knowledge graph.
  */
 
 // Relation types
 export {
   RELATION_TYPES,
   getRelationTypesByCategory,
   getValidRelationsFrom,
   getValidRelationsTo,
   isRelationValid,
   type BaseObjectType,
   type RelationCategory,
   type RelationDirection,
   type RelationTypeDefinition,
   type RelationConstraint,
 } from './relation-types';
 
 // Traversal rules
 export {
   TRAVERSAL_LIMITS,
   TRAVERSAL_PATTERNS,
   FORBIDDEN_PATTERNS,
   DEFAULT_TRAVERSAL_OPTIONS,
   estimateTraversalCost,
   validateTraversal,
   type TraversalOperation,
   type TraversalCost,
   type TraversalPath,
   type TraversalStep,
   type TraversalFilter,
   type TraversalOptions,
   type TraversalResult,
   type TraversalNode,
   type TraversalPathResult,
   type TraversalMetadata,
   type TraversalValidation,
 } from './traversal-rules';
 
 // Anti-patterns
 export {
   ANTI_PATTERNS,
  AMBIGUOUS_TERMS,
  UX_MOTIVATION_PATTERNS,
   detectAntiPattern,
   getBlockingAntiPatterns,
   getAutoDetectableAntiPatterns,
   type AntiPattern,
 } from './anti-patterns';
 
// Ontology Guardian
export {
  runGuardianCheck,
  requestOverride,
  approveOverride,
  rejectOverride,
  getGuardianStats,
  getOverrideLog,
  setGuardianEnabled,
  expireOldOverrides,
  type GuardianOperation,
  type GuardianVerdict,
  type ViolationRecord,
  type OverrideRequest,
  type OverrideLog,
} from './ontology-guardian';

 /**
  * GRAPH MODEL SUMMARY
  * 
  * Base Objects (6):
  * - Entity: Something that exists
  * - Attribute: Property of an entity
  * - Relation: Connection between entities
  * - Event: Change over time
  * - Measure: Quantifiable observation
  * - Source: Where data comes from
  * 
  * Relation Categories (6):
  * - Structural: How things are organized (part_of, contains, borders)
  * - Temporal: Time-based connections (preceded_by, concurrent_with)
  * - Semantic: Meaning relationships (has_attribute, defined_by, same_as, similar_to)
  * - Provenance: Data origin and trust (sourced_from, derived_from, validates, contradicts)
  * - Measurement: Quantitative connections (measures, aggregates, triggered_by)
  * - Supersession: Version replacement (supersedes, corrects, redefines)
  * 
  * Key Principles:
  * - Hierarchies are relations, not structure
  * - All relations are typed and constrained
  * - Traversal has explicit limits
  * - Anti-patterns are blocked, not warned
  * - Ontology Guardian enforces compliance
  * - Overrides are painful, public, and traceable
  */
 export const GRAPH_MODEL_VERSION = '1.0.0' as const;