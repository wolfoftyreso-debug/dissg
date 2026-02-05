/**
 * HUMAN COGNITION ALIGNMENT LAYER (HCAL)
 * 
 * Makes ST-OS speak the brain's language without losing precision.
 */

// Cognitive Primitives
export {
  COGNITIVE_PRIMITIVE_DEFINITIONS,
  ATTENTION_MARKERS,
  checkPrimitiveUsage,
  classifyAttention,
  type CognitivePrimitive,
  type PrimitiveUsage,
  type AttentionMarker,
} from './cognitive-primitives';

// Mental Model Builder
export {
  buildMentalModel,
  formatMentalModelSummary,
  type MentalModel,
  type BaselineState,
  type CurrentState,
  type DirectionState,
  type PersistenceState,
  type CouplingState,
  type UncertaintyState,
} from './mental-model-builder';

// Progressive Depth
export {
  DEPTH_LEVELS,
  buildProgressiveDisclosure,
  navigateDepth,
  validateDepthContent,
  type DepthLevel,
  type DepthLevelDefinition,
  type DepthContent,
  type ProgressiveDisclosure,
} from './progressive-depth';
