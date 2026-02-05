/**
 * AGGREGATION REGISTRY – INVARIANTS
 * 
 * Validation rules that MUST hold for all aggregations.
 * Fail-hard: any violation = rejection.
 */

import type {
  Aggregation,
  AggregationRegistry,
  AggregationCategory,
  OutputType,
} from './types';
import {
  AGGREGATION_CATEGORIES,
  AGGREGATION_STATUS,
  SOURCE_SCOPES,
  OUTPUT_TYPES,
  NORMALIZATION_TYPES,
  FRESHNESS_CLASSES,
  ALLOWED_SURFACES,
} from './types';

// ============================================================================
// VALIDATION RESULT
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: readonly string[];
  warnings: readonly string[];
}

// ============================================================================
// CATEGORY → OUTPUT RULES
// ============================================================================

/**
 * Category determines which output types are allowed.
 * This enforces structural consistency.
 */
export const CATEGORY_OUTPUT_RULES: Record<AggregationCategory, readonly OutputType[]> = {
  prevalence: ['frequency_distribution', 'time_series', 'range_distribution'],
  decision_pattern: ['frequency_distribution', 'categorical_set'],
  outcome_variance: ['range_distribution', 'time_series'],
  data_coverage: ['frequency_distribution', 'range_distribution'],
} as const;

// ============================================================================
// CORE INVARIANTS
// ============================================================================

/**
 * Invariant: predictive must always be false in v1
 */
function checkPredictiveFalse(agg: Aggregation): string | null {
  if (agg.output_contract.predictive !== false) {
    return `[${agg.aggregation_id}] output_contract.predictive must be false`;
  }
  return null;
}

/**
 * Invariant: descriptive_only must be true
 */
function checkDescriptiveOnly(agg: Aggregation): string | null {
  if (agg.boundary.descriptive_only !== true) {
    return `[${agg.aggregation_id}] boundary.descriptive_only must be true`;
  }
  return null;
}

/**
 * Invariant: not_recommendation must be true
 */
function checkNotRecommendation(agg: Aggregation): string | null {
  if (agg.boundary.not_recommendation !== true) {
    return `[${agg.aggregation_id}] boundary.not_recommendation must be true`;
  }
  return null;
}

/**
 * Invariant: requires_context must be true
 */
function checkRequiresContext(agg: Aggregation): string | null {
  if (agg.visibility.requires_context !== true) {
    return `[${agg.aggregation_id}] visibility.requires_context must be true`;
  }
  return null;
}

/**
 * Invariant: requires_uncertainty_display must be true
 */
function checkRequiresUncertainty(agg: Aggregation): string | null {
  if (agg.visibility.requires_uncertainty_display !== true) {
    return `[${agg.aggregation_id}] visibility.requires_uncertainty_display must be true`;
  }
  return null;
}

/**
 * Invariant: known_biases must not be empty
 */
function checkKnownBiases(agg: Aggregation): string | null {
  if (!agg.provenance.known_biases || agg.provenance.known_biases.length === 0) {
    return `[${agg.aggregation_id}] provenance.known_biases must have at least one entry`;
  }
  return null;
}

/**
 * Invariant: minimum_sample_size must be positive
 */
function checkMinSampleSize(agg: Aggregation): string | null {
  if (agg.input_contract.minimum_sample_size <= 0) {
    return `[${agg.aggregation_id}] input_contract.minimum_sample_size must be > 0`;
  }
  return null;
}

/**
 * Invariant: output_type must be valid for category
 */
function checkCategoryOutputMatch(agg: Aggregation): string | null {
  const allowedOutputs = CATEGORY_OUTPUT_RULES[agg.category];
  if (!allowedOutputs.includes(agg.output_contract.output_type)) {
    return `[${agg.aggregation_id}] output_type '${agg.output_contract.output_type}' not allowed for category '${agg.category}'`;
  }
  return null;
}

/**
 * Invariant: owner_role must be AggregationSteward
 */
function checkOwnerRole(agg: Aggregation): string | null {
  if (agg.governance.owner_role !== 'AggregationSteward') {
    return `[${agg.aggregation_id}] governance.owner_role must be 'AggregationSteward'`;
  }
  return null;
}

/**
 * Invariant: version must be valid semver
 */
function checkSemver(agg: Aggregation): string | null {
  const semverRegex = /^\d+\.\d+\.\d+$/;
  if (!semverRegex.test(agg.version)) {
    return `[${agg.aggregation_id}] version '${agg.version}' is not valid semver`;
  }
  return null;
}

/**
 * Invariant: aggregation_id must follow format
 */
function checkIdFormat(agg: Aggregation): string | null {
  const idRegex = /^agg:[a-z_]+:[a-z0-9_]+:\d+\.\d+\.\d+$/;
  if (!idRegex.test(agg.aggregation_id)) {
    return `[${agg.aggregation_id}] aggregation_id format invalid. Expected: agg:<category>:<semantic_hash>:<version>`;
  }
  return null;
}

/**
 * Invariant: validity_conditions must not be empty
 */
function checkValidityConditions(agg: Aggregation): string | null {
  if (!agg.boundary.validity_conditions || agg.boundary.validity_conditions.length === 0) {
    return `[${agg.aggregation_id}] boundary.validity_conditions must have at least one entry`;
  }
  return null;
}

/**
 * Invariant: break_conditions must not be empty
 */
function checkBreakConditions(agg: Aggregation): string | null {
  if (!agg.boundary.break_conditions || agg.boundary.break_conditions.length === 0) {
    return `[${agg.aggregation_id}] boundary.break_conditions must have at least one entry`;
  }
  return null;
}

/**
 * Invariant: data_sources must not be empty
 */
function checkDataSources(agg: Aggregation): string | null {
  if (!agg.provenance.data_sources || agg.provenance.data_sources.length === 0) {
    return `[${agg.aggregation_id}] provenance.data_sources must have at least one entry`;
  }
  return null;
}

// ============================================================================
// ENUM VALIDATION
// ============================================================================

function checkEnums(agg: Aggregation): string[] {
  const errors: string[] = [];
  
  if (!AGGREGATION_CATEGORIES.includes(agg.category)) {
    errors.push(`[${agg.aggregation_id}] invalid category: ${agg.category}`);
  }
  if (!AGGREGATION_STATUS.includes(agg.status)) {
    errors.push(`[${agg.aggregation_id}] invalid status: ${agg.status}`);
  }
  if (!SOURCE_SCOPES.includes(agg.input_contract.source_scope)) {
    errors.push(`[${agg.aggregation_id}] invalid source_scope: ${agg.input_contract.source_scope}`);
  }
  if (!OUTPUT_TYPES.includes(agg.output_contract.output_type)) {
    errors.push(`[${agg.aggregation_id}] invalid output_type: ${agg.output_contract.output_type}`);
  }
  if (!NORMALIZATION_TYPES.includes(agg.output_contract.normalization)) {
    errors.push(`[${agg.aggregation_id}] invalid normalization: ${agg.output_contract.normalization}`);
  }
  if (!FRESHNESS_CLASSES.includes(agg.provenance.freshness_class)) {
    errors.push(`[${agg.aggregation_id}] invalid freshness_class: ${agg.provenance.freshness_class}`);
  }
  
  for (const surface of agg.visibility.allowed_surfaces) {
    if (!ALLOWED_SURFACES.includes(surface)) {
      errors.push(`[${agg.aggregation_id}] invalid allowed_surface: ${surface}`);
    }
  }
  
  return errors;
}

// ============================================================================
// VALIDATE SINGLE AGGREGATION
// ============================================================================

export function validateAggregation(agg: Aggregation): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Core invariants
  const checks = [
    checkIdFormat(agg),
    checkSemver(agg),
    checkPredictiveFalse(agg),
    checkDescriptiveOnly(agg),
    checkNotRecommendation(agg),
    checkRequiresContext(agg),
    checkRequiresUncertainty(agg),
    checkKnownBiases(agg),
    checkMinSampleSize(agg),
    checkCategoryOutputMatch(agg),
    checkOwnerRole(agg),
    checkValidityConditions(agg),
    checkBreakConditions(agg),
    checkDataSources(agg),
  ];
  
  for (const err of checks) {
    if (err) errors.push(err);
  }
  
  // Enum validation
  errors.push(...checkEnums(agg));
  
  // Warnings (non-blocking)
  if (agg.status === 'deprecated') {
    warnings.push(`[${agg.aggregation_id}] is deprecated`);
  }
  if (agg.provenance.freshness_class === 'stale') {
    warnings.push(`[${agg.aggregation_id}] has stale data`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// VALIDATE REGISTRY
// ============================================================================

export function validateRegistry(registry: AggregationRegistry): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for duplicate IDs
  const ids = new Set<string>();
  for (const agg of registry.aggregations) {
    if (ids.has(agg.aggregation_id)) {
      errors.push(`Duplicate aggregation_id: ${agg.aggregation_id}`);
    }
    ids.add(agg.aggregation_id);
    
    // Validate each aggregation
    const result = validateAggregation(agg);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
