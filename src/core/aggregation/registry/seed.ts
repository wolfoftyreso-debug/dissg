/**
 * AGGREGATION REGISTRY – SEED DATA
 * 
 * Initial set of aggregations following the TOP 20 specification.
 * All aggregations are: read-only, descriptive, conditional, reproducible.
 */

import type { Aggregation, AggregationRegistry } from './types';

// ============================================================================
// A. PREVALENCE & BASELINES (1-7)
// ============================================================================

const PREVALENCE_BY_TIME: Aggregation = {
  aggregation_id: 'agg:prevalence:time_freq:1.0.0',
  name: 'Prevalence by Time',
  category: 'prevalence',
  description: 'How often X occurs over time (year/quarter). Output: frequency + trend (no interpretation).',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'public_data_only',
    minimum_sample_size: 12,
    required_fields: ['indicator_code', 'time_period'],
    allowed_filters: ['region', 'segment'],
    time_window: { start: '2000-01-01', end: null },
  },
  output_contract: {
    output_type: 'time_series',
    units: 'occurrences',
    normalization: 'none',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Consistent measurement methodology across period'],
    break_conditions: ['Methodology change mid-series', 'Sample size below minimum'],
  },
  provenance: {
    data_sources: [{ source_id: 'PUBLIC_REGISTRY_V1', name: 'Public Data Registry' }],
    known_biases: ['Reporting lag bias', 'Seasonal collection bias'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['cdp', 'reference_case', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 12,
    deprecation_policy: 'Mark deprecated if methodology fundamentally changes.',
  },
};

const PREVALENCE_BY_REGION: Aggregation = {
  aggregation_id: 'agg:prevalence:region_freq:1.0.0',
  name: 'Prevalence by Region',
  category: 'prevalence',
  description: 'Occurrence per country/region. Output: comparable scale, same time window.',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'public_data_only',
    minimum_sample_size: 5,
    required_fields: ['indicator_code', 'geo_code'],
    allowed_filters: ['time_period'],
    time_window: { start: '2015-01-01', end: null },
  },
  output_contract: {
    output_type: 'frequency_distribution',
    units: 'per_100k',
    normalization: 'per_capita',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Same time window for all regions', 'Comparable definitions'],
    break_conditions: ['Definition mismatch across regions', 'Incomplete coverage'],
  },
  provenance: {
    data_sources: [{ source_id: 'PUBLIC_REGISTRY_V1', name: 'Public Data Registry' }],
    known_biases: ['Reporting standard variation', 'Population denominator accuracy'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['cdp', 'reference_case', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 12,
    deprecation_policy: 'Mark deprecated if regional comparability breaks.',
  },
};

const BASELINE_VS_CURRENT: Aggregation = {
  aggregation_id: 'agg:prevalence:baseline_delta:1.0.0',
  name: 'Baseline vs Current',
  category: 'prevalence',
  description: 'Historical baseline compared to current. Output: change (not "improvement").',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'public_data_only',
    minimum_sample_size: 24,
    required_fields: ['indicator_code', 'baseline_period', 'current_period'],
    allowed_filters: ['region', 'segment'],
    time_window: { start: '1990-01-01', end: null },
  },
  output_contract: {
    output_type: 'range_distribution',
    units: 'delta',
    normalization: 'none',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Baseline period clearly defined', 'No structural breaks between periods'],
    break_conditions: ['Definition change between baseline and current', 'Insufficient baseline data'],
  },
  provenance: {
    data_sources: [{ source_id: 'PUBLIC_REGISTRY_V1', name: 'Public Data Registry' }],
    known_biases: ['Baseline selection bias', 'Survivorship bias'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['cdp', 'reference_case', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 12,
    deprecation_policy: 'Mark deprecated if baseline definition changes.',
  },
};

const NORMAL_RANGE_ENVELOPE: Aggregation = {
  aggregation_id: 'agg:prevalence:normal_range:1.0.0',
  name: 'Normal Range Envelope',
  category: 'prevalence',
  description: '25th-75th percentile band. Output: range (not normalization).',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'public_data_only',
    minimum_sample_size: 50,
    required_fields: ['indicator_code', 'value'],
    allowed_filters: ['region', 'time_period', 'segment'],
    time_window: { start: '2010-01-01', end: null },
  },
  output_contract: {
    output_type: 'range_distribution',
    units: 'percentile_band',
    normalization: 'none',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Sufficient sample for percentile calculation', 'Homogeneous population'],
    break_conditions: ['Sample size below 50', 'Bimodal distribution'],
  },
  provenance: {
    data_sources: [{ source_id: 'PUBLIC_REGISTRY_V1', name: 'Public Data Registry' }],
    known_biases: ['Central tendency bias', 'Outlier exclusion'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['cdp', 'reference_case', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 12,
    deprecation_policy: 'Mark deprecated if distribution assumptions change.',
  },
};

// ============================================================================
// B. DECISION PATTERNS (8-13)
// ============================================================================

const COMMON_ASSUMPTIONS_FREQUENCY: Aggregation = {
  aggregation_id: 'agg:decision_pattern:assumption_freq:1.0.0',
  name: 'Common Assumptions Frequency',
  category: 'decision_pattern',
  description: 'Most common assumptions for decision type. Output: frequency list (no weighting).',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'locked_decisions_only',
    minimum_sample_size: 30,
    required_fields: ['decision_type', 'assumptions'],
    allowed_filters: ['region', 'time_horizon'],
    time_window: { start: '2018-01-01', end: null },
  },
  output_contract: {
    output_type: 'frequency_distribution',
    units: null,
    normalization: 'per_decision',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Decisions structurally comparable', 'Assumptions explicitly declared'],
    break_conditions: ['Decision type mismatch', 'Implicit assumptions'],
  },
  provenance: {
    data_sources: [{ source_id: 'DECISIONS_V1', name: 'Locked Decisions Registry' }],
    known_biases: ['Selection bias in decision documentation', 'Hindsight bias'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['cdp', 'reference_case', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 12,
    deprecation_policy: 'Mark deprecated if decision taxonomy changes.',
  },
};

const COMMON_ALTERNATIVES_SET: Aggregation = {
  aggregation_id: 'agg:decision_pattern:alternatives_set:1.0.0',
  name: 'Common Alternatives Set',
  category: 'decision_pattern',
  description: 'Alternatives most often considered. Output: set (not ranking).',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'locked_decisions_only',
    minimum_sample_size: 25,
    required_fields: ['decision_type', 'alternatives_considered'],
    allowed_filters: ['region', 'scale'],
    time_window: { start: '2018-01-01', end: null },
  },
  output_contract: {
    output_type: 'categorical_set',
    units: null,
    normalization: 'per_decision',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Alternatives explicitly enumerated', 'Comparable decision scope'],
    break_conditions: ['Implicit alternatives', 'Scope mismatch'],
  },
  provenance: {
    data_sources: [{ source_id: 'DECISIONS_V1', name: 'Locked Decisions Registry' }],
    known_biases: ['Documentation bias', 'Framing effects'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['cdp', 'reference_case', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 12,
    deprecation_policy: 'Mark deprecated if alternative taxonomy changes.',
  },
};

const UNCERTAINTY_DENSITY: Aggregation = {
  aggregation_id: 'agg:decision_pattern:uncertainty_density:1.0.0',
  name: 'Uncertainty Density',
  category: 'decision_pattern',
  description: 'Number and type of uncertainties per decision. Output: distribution.',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'locked_decisions_only',
    minimum_sample_size: 30,
    required_fields: ['decision_type', 'uncertainties'],
    allowed_filters: ['region', 'decision_scope'],
    time_window: { start: '2018-01-01', end: null },
  },
  output_contract: {
    output_type: 'frequency_distribution',
    units: 'count_per_decision',
    normalization: 'per_decision',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Uncertainties explicitly catalogued', 'Consistent taxonomy'],
    break_conditions: ['Implicit uncertainties', 'Taxonomy mismatch'],
  },
  provenance: {
    data_sources: [{ source_id: 'DECISIONS_V1', name: 'Locked Decisions Registry' }],
    known_biases: ['Underreporting of uncertainties', 'Overconfidence bias'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['cdp', 'reference_case', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 12,
    deprecation_policy: 'Mark deprecated if uncertainty taxonomy changes.',
  },
};

// ============================================================================
// C. OUTCOME VARIANCE (14-17)
// ============================================================================

const OUTCOME_SPREAD: Aggregation = {
  aggregation_id: 'agg:outcome_variance:spread:1.0.0',
  name: 'Outcome Spread',
  category: 'outcome_variance',
  description: 'Spread between best and worst observed outcomes. Output: min-max, percentiles.',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'reviews_only',
    minimum_sample_size: 30,
    required_fields: ['expected_vs_observed', 'decision_type'],
    allowed_filters: ['region', 'time_horizon'],
    time_window: { start: '2019-01-01', end: null },
  },
  output_contract: {
    output_type: 'range_distribution',
    units: 'domain_specific',
    normalization: 'per_decision',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Comparable decision structure', 'Outcomes measured consistently'],
    break_conditions: ['Unmatched scope', 'Measurement inconsistency'],
  },
  provenance: {
    data_sources: [{ source_id: 'REVIEWS_V1', name: 'Decision Reviews Registry' }],
    known_biases: ['Survivorship bias', 'Reporting bias on extremes'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['reference_case', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 12,
    deprecation_policy: 'Mark deprecated if structural assumptions no longer hold.',
  },
};

const LAGGED_EFFECTS: Aggregation = {
  aggregation_id: 'agg:outcome_variance:lagged:1.0.0',
  name: 'Lagged Effects',
  category: 'outcome_variance',
  description: 'Effects that emerged later than decision horizon. Output: time offset.',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'reviews_only',
    minimum_sample_size: 20,
    required_fields: ['decision_date', 'effect_date', 'decision_horizon'],
    allowed_filters: ['decision_type', 'region'],
    time_window: { start: '2015-01-01', end: null },
  },
  output_contract: {
    output_type: 'time_series',
    units: 'months_offset',
    normalization: 'per_decision',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Clear decision horizon defined', 'Effects attributable'],
    break_conditions: ['Horizon undefined', 'Attribution impossible'],
  },
  provenance: {
    data_sources: [{ source_id: 'REVIEWS_V1', name: 'Decision Reviews Registry' }],
    known_biases: ['Attribution bias', 'Observation truncation'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['reference_case', 'cannot_answer', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 12,
    deprecation_policy: 'Mark deprecated if attribution methodology changes.',
  },
};

// ============================================================================
// D. DATA COVERAGE & LIMITS (18-20)
// ============================================================================

const COVERAGE_COMPLETENESS: Aggregation = {
  aggregation_id: 'agg:data_coverage:completeness:1.0.0',
  name: 'Coverage Completeness',
  category: 'data_coverage',
  description: 'Proportion of decisions with full structure. Output: percentage.',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'locked_decisions_only',
    minimum_sample_size: 100,
    required_fields: ['structure_completeness_score'],
    allowed_filters: ['decision_type', 'region'],
    time_window: { start: '2018-01-01', end: null },
  },
  output_contract: {
    output_type: 'frequency_distribution',
    units: 'percent',
    normalization: 'none',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Completeness definition stable'],
    break_conditions: ['Definition change'],
  },
  provenance: {
    data_sources: [{ source_id: 'DECISIONS_V1', name: 'Locked Decisions Registry' }],
    known_biases: ['Self-selection bias in documentation quality'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['cannot_answer', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 6,
    deprecation_policy: 'Mark deprecated if completeness metrics change.',
  },
};

const DATA_FRESHNESS: Aggregation = {
  aggregation_id: 'agg:data_coverage:freshness:1.0.0',
  name: 'Data Freshness',
  category: 'data_coverage',
  description: 'Age of underlying data. Output: age distribution.',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'public_data_only',
    minimum_sample_size: 50,
    required_fields: ['last_updated', 'source_id'],
    allowed_filters: ['source_type', 'domain'],
    time_window: { start: '2020-01-01', end: null },
  },
  output_contract: {
    output_type: 'range_distribution',
    units: 'months',
    normalization: 'none',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Update timestamps reliable'],
    break_conditions: ['Timestamp unreliable or missing'],
  },
  provenance: {
    data_sources: [{ source_id: 'SOURCE_REGISTRY_V1', name: 'Source Metadata Registry' }],
    known_biases: ['Timestamp granularity variation'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['cannot_answer', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 6,
    deprecation_policy: 'Mark deprecated if freshness calculation changes.',
  },
};

const KNOWN_BIAS_REGISTRY: Aggregation = {
  aggregation_id: 'agg:data_coverage:bias_registry:1.0.0',
  name: 'Known Bias Registry',
  category: 'data_coverage',
  description: 'Identified biases per data source. Output: list + impact surface.',
  status: 'active',
  created_at: '2026-02-05T00:00:00Z',
  version: '1.0.0',
  input_contract: {
    source_scope: 'public_data_only',
    minimum_sample_size: 10,
    required_fields: ['source_id', 'bias_type', 'impact_description'],
    allowed_filters: ['source_type', 'domain'],
    time_window: { start: '2015-01-01', end: null },
  },
  output_contract: {
    output_type: 'categorical_set',
    units: null,
    normalization: 'none',
    predictive: false,
  },
  boundary: {
    descriptive_only: true,
    not_recommendation: true,
    validity_conditions: ['Biases explicitly documented', 'Impact assessed'],
    break_conditions: ['Undocumented biases discovered'],
  },
  provenance: {
    data_sources: [{ source_id: 'BIAS_AUDIT_V1', name: 'Bias Audit Registry' }],
    known_biases: ['Meta-bias: incomplete bias identification'],
    last_updated: '2026-02-05T00:00:00Z',
    freshness_class: 'fresh',
  },
  visibility: {
    allowed_surfaces: ['cannot_answer', 'api_only'],
    requires_context: true,
    requires_uncertainty_display: true,
  },
  governance: {
    owner_role: 'AggregationSteward',
    review_cycle_months: 6,
    deprecation_policy: 'Mark deprecated if bias taxonomy changes.',
  },
};

// ============================================================================
// REGISTRY
// ============================================================================

export const AGGREGATION_REGISTRY_V1: AggregationRegistry = {
  registry_version: '1.0.0',
  last_updated: '2026-02-05T00:00:00Z',
  aggregations: [
    // A. Prevalence & Baselines
    PREVALENCE_BY_TIME,
    PREVALENCE_BY_REGION,
    BASELINE_VS_CURRENT,
    NORMAL_RANGE_ENVELOPE,
    // B. Decision Patterns
    COMMON_ASSUMPTIONS_FREQUENCY,
    COMMON_ALTERNATIVES_SET,
    UNCERTAINTY_DENSITY,
    // C. Outcome Variance
    OUTCOME_SPREAD,
    LAGGED_EFFECTS,
    // D. Data Coverage
    COVERAGE_COMPLETENESS,
    DATA_FRESHNESS,
    KNOWN_BIAS_REGISTRY,
  ],
  checksum: 'sha256:pending',
};

// ============================================================================
// ACCESSOR FUNCTIONS
// ============================================================================

export function getAggregationById(id: string): Aggregation | undefined {
  return AGGREGATION_REGISTRY_V1.aggregations.find(a => a.aggregation_id === id);
}

export function getAggregationsByCategory(category: string): readonly Aggregation[] {
  return AGGREGATION_REGISTRY_V1.aggregations.filter(a => a.category === category);
}

export function getActiveAggregations(): readonly Aggregation[] {
  return AGGREGATION_REGISTRY_V1.aggregations.filter(a => a.status === 'active');
}

export function getAggregationsForSurface(surface: string): readonly Aggregation[] {
  return AGGREGATION_REGISTRY_V1.aggregations.filter(
    a => a.visibility.allowed_surfaces.includes(surface as any)
  );
}
