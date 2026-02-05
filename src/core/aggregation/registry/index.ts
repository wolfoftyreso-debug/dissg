/**
 * AGGREGATION REGISTRY – PUBLIC API
 * 
 * Canonical index of all aggregations.
 * Read-only. Versioned. Auditable.
 */

// Types
export type {
  Aggregation,
  AggregationRegistry,
  AggregationCategory,
  AggregationStatus,
  SourceScope,
  OutputType,
  NormalizationType,
  FreshnessClass,
  AllowedSurface,
  TimeRange,
  InputContract,
  OutputContract,
  Boundary,
  DataSourceRef,
  Provenance,
  Visibility,
  Governance,
} from './types';

export {
  AGGREGATION_CATEGORIES,
  AGGREGATION_STATUS,
  SOURCE_SCOPES,
  OUTPUT_TYPES,
  NORMALIZATION_TYPES,
  FRESHNESS_CLASSES,
  ALLOWED_SURFACES,
} from './types';

// Invariants
export {
  validateAggregation,
  validateRegistry,
  CATEGORY_OUTPUT_RULES,
  type ValidationResult,
} from './invariants';

// Registry & Seed Data
export {
  AGGREGATION_REGISTRY_V1,
  getAggregationById,
  getAggregationsByCategory,
  getActiveAggregations,
  getAggregationsForSurface,
} from './seed';
