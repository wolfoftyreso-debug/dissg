/**
 * AGGREGATION REGISTRY – TYPES v1
 * 
 * Canonical index of all aggregations.
 * Read-only. Versioned. Auditable.
 * 
 * Core untouched. This is metadata & contracts only.
 */

// ============================================================================
// ENUMS
// ============================================================================

export const AGGREGATION_CATEGORIES = [
  'prevalence',
  'decision_pattern',
  'outcome_variance',
  'data_coverage',
] as const;

export type AggregationCategory = typeof AGGREGATION_CATEGORIES[number];

export const AGGREGATION_STATUS = [
  'active',
  'deprecated',
  'experimental',
] as const;

export type AggregationStatus = typeof AGGREGATION_STATUS[number];

export const SOURCE_SCOPES = [
  'locked_decisions_only',
  'reviews_only',
  'public_data_only',
] as const;

export type SourceScope = typeof SOURCE_SCOPES[number];

export const OUTPUT_TYPES = [
  'frequency_distribution',
  'range_distribution',
  'time_series',
  'categorical_set',
] as const;

export type OutputType = typeof OUTPUT_TYPES[number];

export const NORMALIZATION_TYPES = [
  'none',
  'per_capita',
  'per_decision',
] as const;

export type NormalizationType = typeof NORMALIZATION_TYPES[number];

export const FRESHNESS_CLASSES = [
  'fresh',
  'aging',
  'stale',
] as const;

export type FreshnessClass = typeof FRESHNESS_CLASSES[number];

export const ALLOWED_SURFACES = [
  'cdp',
  'reference_case',
  'cannot_answer',
  'api_only',
] as const;

export type AllowedSurface = typeof ALLOWED_SURFACES[number];

// ============================================================================
// TIME RANGE
// ============================================================================

export interface TimeRange {
  /** ISO 8601 date string */
  start: string;
  /** ISO 8601 date string, null = ongoing */
  end: string | null;
}

// ============================================================================
// INPUT CONTRACT (HARD)
// ============================================================================

export interface InputContract {
  /** What data can be used */
  source_scope: SourceScope;
  /** Minimum observations required */
  minimum_sample_size: number;
  /** Fields that MUST be present */
  required_fields: readonly string[];
  /** Filters that MAY be applied */
  allowed_filters: readonly string[];
  /** Valid time window for data */
  time_window: TimeRange;
}

// ============================================================================
// OUTPUT CONTRACT (CRITICAL)
// ============================================================================

export interface OutputContract {
  /** Shape of the output */
  output_type: OutputType;
  /** Unit of measurement, null if categorical */
  units: string | null;
  /** How values are normalized */
  normalization: NormalizationType;
  /** ALWAYS false in v1 */
  predictive: false;
}

// ============================================================================
// BOUNDARY & DISCLAIMER (MACHINE-READABLE)
// ============================================================================

export interface Boundary {
  /** This aggregation describes, never prescribes */
  descriptive_only: true;
  /** This is NOT a recommendation */
  not_recommendation: true;
  /** Conditions that must hold for validity */
  validity_conditions: readonly string[];
  /** Conditions that invalidate the aggregation */
  break_conditions: readonly string[];
}

// ============================================================================
// DATA PROVENANCE
// ============================================================================

export interface DataSourceRef {
  /** Source identifier */
  source_id: string;
  /** Human-readable name */
  name: string;
  /** Link to source registry */
  registry_url?: string;
}

export interface Provenance {
  /** Data sources used */
  data_sources: readonly DataSourceRef[];
  /** 
   * Known biases - MUST have at least one.
   * Empty array = invalid aggregation.
   */
  known_biases: readonly string[];
  /** Last update timestamp (ISO 8601) */
  last_updated: string;
  /** Data freshness classification */
  freshness_class: FreshnessClass;
}

// ============================================================================
// VISIBILITY & USAGE POLICY
// ============================================================================

export interface Visibility {
  /** Where this aggregation may appear */
  allowed_surfaces: readonly AllowedSurface[];
  /** Must be shown with context block */
  requires_context: true;
  /** Must display uncertainty information */
  requires_uncertainty_display: true;
}

// ============================================================================
// GOVERNANCE & CHANGE
// ============================================================================

export interface Governance {
  /** Role responsible for this aggregation */
  owner_role: 'AggregationSteward';
  /** Review cycle in months */
  review_cycle_months: number;
  /** Policy for deprecation */
  deprecation_policy: string;
}

// ============================================================================
// AGGREGATION (TOP-LEVEL OBJECT)
// ============================================================================

export interface Aggregation {
  /** 
   * Unique identifier 
   * Format: agg:<category>:<semantic_hash>:<version>
   */
  aggregation_id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Category determines allowed outputs */
  category: AggregationCategory;
  
  /** Structured description */
  description: string;
  
  /** Lifecycle status */
  status: AggregationStatus;
  
  /** Creation timestamp (ISO 8601) */
  created_at: string;
  
  /** Semantic version */
  version: string;
  
  /** Input requirements */
  input_contract: InputContract;
  
  /** Output specification */
  output_contract: OutputContract;
  
  /** Usage boundaries */
  boundary: Boundary;
  
  /** Data provenance */
  provenance: Provenance;
  
  /** Display policy */
  visibility: Visibility;
  
  /** Governance metadata */
  governance: Governance;
}

// ============================================================================
// REGISTRY (COLLECTION)
// ============================================================================

export interface AggregationRegistry {
  /** Registry version */
  registry_version: string;
  
  /** Last updated */
  last_updated: string;
  
  /** All registered aggregations */
  aggregations: readonly Aggregation[];
  
  /** Registry checksum for integrity */
  checksum: string;
}
