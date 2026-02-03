/**
 * GLOBAL MULTI-INDEX ANALYSMOTOR (LAMBDA-SYSTEM)
 * 
 * Index-lager fungerar som sensorer i en global analysmotor.
 * Alla index normaliseras per region, tid och köpkraft.
 * 
 * Princip: INGA slutsatser utan spårbar dataväg.
 */

// =============================================================================
// INDEX CATEGORIES
// =============================================================================

export type IndexCategory = 
  | 'living_basic'      // Basala levnadsindex
  | 'shadow_economy'    // Informella & skuggekonomi
  | 'health_function'   // Hälso- & funktionsindex
  | 'social_cultural'   // Sociala & kulturella index
  | 'productivity_work' // Produktivitet & arbete
  | 'environmental'     // Miljö & resurser
  | 'governance';       // Styrning & institutioner

export type IndexCode = 
  // Living Basic
  | 'BIG_MAC_INDEX'
  | 'STAPLE_FOOD_INDEX'
  | 'HOUSING_AFFORDABILITY_INDEX'
  | 'ENERGY_COST_INDEX'
  | 'TRANSPORT_INDEX'
  | 'TIME_COST_INDEX'
  // Shadow Economy
  | 'INFORMAL_MARKET_INDEX'
  | 'CORRUPTION_FRICTION_INDEX'
  | 'PARALLEL_ECONOMY_INDEX'
  // Health & Function
  | 'LIFE_EXPECTANCY_QUALITY_ADJUSTED'
  | 'METABOLIC_DISEASE_INDEX'
  | 'MENTAL_HEALTH_INDEX'
  | 'SUBSTANCE_PREVALENCE_INDEX'
  | 'HEALTHCARE_EFFICIENCY_INDEX'
  // Social & Cultural
  | 'FAMILY_FORMATION_INDEX'
  | 'FERTILITY_INDEX'
  | 'LONELINESS_INDEX'
  | 'SOCIAL_TRUST_INDEX'
  | 'VIOLENCE_INDEX'
  // Productivity & Work
  | 'AUTOMATION_RISK_INDEX'
  | 'WAGE_PRODUCTIVITY_GAP'
  | 'ADMINISTRATIVE_OVERHEAD_INDEX'
  | 'EDUCATION_MISMATCH_INDEX'
  | 'SKILL_WASTE_INDEX';

// =============================================================================
// INDEX DEFINITION
// =============================================================================

export interface IndexDefinition {
  code: IndexCode;
  category: IndexCategory;
  name_en: string;
  name_sv: string;
  description: string;
  
  // Calculation
  formula_description: string;
  input_indicators: string[];
  normalization_method: 'zscore' | 'minmax' | 'percentile' | 'ppp_adjusted';
  
  // Interpretation
  optimal_range: { min: number; max: number };
  direction: 'higher_better' | 'lower_better' | 'neutral_optimal';
  
  // Metadata
  update_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  primary_sources: string[];
  coverage_start_year: number;
  geo_coverage: 'global' | 'oecd' | 'eu' | 'regional';
}

// =============================================================================
// INDEX VALUE
// =============================================================================

export interface IndexValue {
  index_code: IndexCode;
  geo_code: string;
  geo_level: 'global' | 'country' | 'region' | 'municipality';
  period: string; // ISO date or period code
  
  // Values
  raw_value: number;
  normalized_value: number; // 0-100 scale
  zscore: number;
  percentile_rank: number;
  
  // Context
  ppp_adjusted: boolean;
  population_weighted: boolean;
  
  // Quality
  data_coverage: number; // 0-1
  confidence_interval: { lower: number; upper: number };
  source_count: number;
  
  // Trend
  change_1y: number | null;
  change_5y: number | null;
  change_10y: number | null;
  trend_direction: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  
  // Timestamps
  measured_at: string;
  calculated_at: string;
}

// =============================================================================
// CROSS-CORRELATION
// =============================================================================

export interface IndexCorrelation {
  index_a: IndexCode;
  index_b: IndexCode;
  
  // Correlation metrics
  pearson_r: number;
  spearman_rho: number;
  kendall_tau: number;
  
  // Temporal
  time_lag_months: number | null; // If one leads the other
  lag_direction: 'a_leads' | 'b_leads' | 'simultaneous' | null;
  
  // Robustness
  sample_size: number;
  time_periods_analyzed: number;
  geo_units_analyzed: number;
  
  // Stability
  stability_score: number; // How consistent across time/geography
  breakpoints: string[]; // Periods where correlation changed
  
  // Confidence
  p_value: number;
  confidence_level: 'high' | 'medium' | 'low' | 'insufficient';
  
  // Context
  confounders_identified: string[];
  spurious_warning: boolean;
  
  // Metadata
  analyzed_at: string;
  methodology_version: string;
}

// =============================================================================
// RESEARCH ALIGNMENT
// =============================================================================

export type ResearchAlignment = 
  | 'aligned_with_consensus'      // I linje med majoriteten av aktuell forskning
  | 'conflicts_with_established'  // I konflikt med etablerad forskning
  | 'insufficient_evidence'       // Otillräcklig evidens
  | 'emerging_pattern'            // Nytt mönster utan tillräcklig forskningsbas
  | 'contested';                  // Aktivt debatterat i forskarsamhället

export interface ResearchReference {
  correlation_id: string;
  alignment: ResearchAlignment;
  
  // Evidence base
  meta_analyses_count: number;
  supporting_studies: number;
  contradicting_studies: number;
  
  // Sources
  key_references: {
    source: string;
    year: number;
    finding_summary: string;
    doi?: string;
  }[];
  
  // Quality
  evidence_grade: 'A' | 'B' | 'C' | 'D' | 'F'; // GRADE-style
  last_reviewed: string;
}

// =============================================================================
// UNDERPERFORMANCE DETECTION
// =============================================================================

export type PerformanceClass =
  | 'overperforming_low_resource'   // Överpresterar trots låg resursinsats
  | 'overperforming_high_resource'  // Presterar bra med hög insats (förväntat)
  | 'underperforming_high_resource' // Underpresterar trots hög resursinsats
  | 'underperforming_low_resource'  // Underpresterar med låg insats (förväntat)
  | 'structurally_locked'           // Strukturellt låst system
  | 'insufficient_data';

export interface PerformanceAnalysis {
  geo_code: string;
  sector: string;
  period: string;
  
  // Resource input
  resource_input_index: number; // Normalized resource spending
  resource_percentile: number;
  
  // Outcome
  outcome_index: number; // Actual results achieved
  outcome_percentile: number;
  
  // Classification
  performance_class: PerformanceClass;
  efficiency_ratio: number; // outcome / input
  
  // Comparison
  vs_global_median: number;
  vs_peer_group_median: number;
  peer_group: string[];
  best_performer_in_peer_group: string;
  
  // Gap analysis
  outcome_gap_to_best: number;
  resource_gap_to_best: number;
  
  // Historical context
  performance_trend_5y: 'improving' | 'stable' | 'declining';
  similar_historical_patterns: {
    geo_code: string;
    period: string;
    eventual_outcome: string;
  }[];
  
  // Metadata
  analyzed_at: string;
  methodology_version: string;
}

// =============================================================================
// LAMBDA INTEGRATION
// =============================================================================

export interface LambdaSensorReading {
  index_code: IndexCode;
  contribution_to_lambda: number; // How much this index affects lambda
  weight: number;
  
  current_value: number;
  optimal_value: number;
  deviation: number; // current - optimal
  deviation_direction: 'above' | 'below' | 'within_range';
  
  // Impact
  is_primary_driver: boolean;
  rank_among_drivers: number;
}

export interface LambdaCalculation {
  geo_code: string;
  geo_level: 'global' | 'country' | 'region' | 'sector';
  period: string;
  
  // Lambda value
  lambda: number;
  lambda_interpretation: 'balanced' | 'inefficient' | 'overheated' | 'critical';
  
  // Components
  sensor_readings: LambdaSensorReading[];
  primary_drivers: IndexCode[];
  
  // Uncertainty
  confidence_interval: { lower: number; upper: number };
  data_coverage: number;
  
  // Temporal
  lambda_1y_ago: number | null;
  lambda_5y_ago: number | null;
  trend: 'improving' | 'stable' | 'declining';
  
  // Historical parallels
  similar_historical_states: {
    geo_code: string;
    period: string;
    lambda: number;
    what_followed: string;
  }[];
  
  // Metadata
  calculated_at: string;
  methodology_version: string;
}

// =============================================================================
// PRESENTATION OUTPUT
// =============================================================================

export interface IndexPresentation {
  // Core message (begriplig för 18-åring)
  headline: string; // Max 10 words
  summary: string;  // Max 50 words
  
  // Structured data
  what: string;
  how_much: string;
  since_when: string;
  compared_to: string;
  
  // Drill-down path
  click_path: {
    level: number;
    label: string;
    description: string;
    data_type: 'index' | 'component' | 'raw_data' | 'source';
  }[];
  
  // Verification
  qr_verification_url: string;
  source_list: string[];
  
  // Warnings
  data_quality_warning: string | null;
  coverage_warning: string | null;
}
