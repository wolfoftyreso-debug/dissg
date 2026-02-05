/**
 * CONTRACTS — PUBLIC API
 * 
 * Core contracts that all outputs must satisfy.
 */

export {
  createEmptyOutput,
  validateSemanticOutput,
  type SemanticOutput,
  type SemanticOrientation,
  type ImportanceClassification,
  type UncertaintyBlock,
  type UncertaintySource,
  type OutputMetadata,
  type Direction,
  type Magnitude,
  type Persistence,
  type ValidationResult,
} from './semantic-output';
