/**
 * HEALTH & SUBSTANCE REALITY LAYER - Type Definitions
 * Epidemiological reference layer - NO medical advice
 * 
 * This module provides population-level health data for observation only.
 * It never provides medical advice, diagnoses, or treatment recommendations.
 */

// ===== HEALTH INDICATORS =====

export type HealthCategory = 
  | 'disease_burden'
  | 'mortality'
  | 'morbidity'
  | 'capacity'
  | 'substance'
  | 'life_expectancy';

export type DefinitionSource = 'WHO' | 'ICD-11' | 'GBD' | 'OECD' | 'ECDC' | 'CDC';

export interface HealthIndicator {
  id: string;
  code: string;
  name: string;
  name_local?: Record<string, string>;
  category: HealthCategory;
  subcategory?: string;
  unit: string;
  description?: string;
  definition_source?: DefinitionSource;
  icd_codes?: string[];
  atc_codes?: string[];
  is_inverted: boolean;
  aggregation_method: 'sum' | 'average' | 'rate';
  normalization_method?: 'per_100k' | 'per_capita' | 'percentage';
  data_quality_notes?: string;
  typical_lag_months: number;
  is_active: boolean;
}

export interface HealthValue {
  id: string;
  indicator_id: string;
  country_code: string;
  region_code?: string;
  period_start: string;
  period_end: string;
  value: number;
  value_male?: number;
  value_female?: number;
  age_group?: string;
  confidence: number;
  is_estimated: boolean;
  estimation_method?: string;
  data_source_code: string;
  source_indicator_code?: string;
  source_url?: string;
  flags?: string[];
}

// ===== SUBSTANCE PROFILES =====

export type ChemicalClass = 
  | 'opioid'
  | 'stimulant'
  | 'depressant'
  | 'hallucinogen'
  | 'cannabinoid'
  | 'nicotine'
  | 'alcohol'
  | 'other';

export type LegalStatus = 
  | 'prohibited'
  | 'controlled'
  | 'prescription'
  | 'otc'
  | 'legal'
  | 'decriminalized';

export type SubstanceMeasureType = 
  | 'prevalence'
  | 'incidence'
  | 'mortality'
  | 'overdose'
  | 'treatment_contacts'
  | 'debut_age';

export interface SubstanceProfile {
  id: string;
  code: string;
  name: string;
  name_local?: Record<string, string>;
  chemical_class?: ChemicalClass;
  pharmacological_category?: string;
  description?: string;
  who_classification?: string;
  is_active: boolean;
}

export interface SubstanceLegalStatus {
  id: string;
  substance_id: string;
  country_code: string;
  status: LegalStatus;
  schedule?: string;
  effective_from: string;
  effective_to?: string;
  source_document?: string;
  source_url?: string;
  notes?: string;
}

export interface SubstanceData {
  id: string;
  substance_id: string;
  country_code: string;
  region_code?: string;
  period_start: string;
  period_end: string;
  measure_type: SubstanceMeasureType;
  age_group: string;
  value: number;
  value_male?: number;
  value_female?: number;
  unit: string;
  confidence: number;
  is_estimated: boolean;
  data_source_code: string;
  source_url?: string;
  methodology_notes?: string;
}

// ===== DISEASE BURDEN (GBD) =====

export interface DiseaseBurden {
  id: string;
  country_code: string;
  region_code?: string;
  period_year: number;
  cause_code: string;
  cause_name: string;
  cause_level: number;
  parent_cause_code?: string;
  dalys?: number;
  dalys_per_100k?: number;
  yll?: number;
  yll_per_100k?: number;
  yld?: number;
  yld_per_100k?: number;
  deaths?: number;
  deaths_per_100k?: number;
  prevalence?: number;
  prevalence_per_100k?: number;
  incidence?: number;
  incidence_per_100k?: number;
  age_group: string;
  sex: 'both' | 'male' | 'female';
  confidence_lower?: number;
  confidence_upper?: number;
  data_source_code: string;
  gbd_study_year?: number;
}

// ===== HEALTHCARE CAPACITY =====

export interface HealthcareCapacity {
  id: string;
  country_code: string;
  region_code?: string;
  period_year: number;
  physicians_per_10k?: number;
  nurses_per_10k?: number;
  hospital_beds_per_10k?: number;
  psychiatric_beds_per_10k?: number;
  health_expenditure_pct_gdp?: number;
  health_expenditure_per_capita_usd?: number;
  out_of_pocket_pct?: number;
  universal_coverage_index?: number;
  data_source_code: string;
  source_url?: string;
}

// ===== LIFE EXPECTANCY =====

export interface LifeExpectancy {
  id: string;
  country_code: string;
  region_code?: string;
  period_year: number;
  life_expectancy_total: number;
  life_expectancy_male?: number;
  life_expectancy_female?: number;
  healthy_life_expectancy_total?: number;
  healthy_life_expectancy_male?: number;
  healthy_life_expectancy_female?: number;
  infant_mortality_per_1k?: number;
  under5_mortality_per_1k?: number;
  maternal_mortality_per_100k?: number;
  data_source_code: string;
  source_url?: string;
}

// ===== POLICY PERIODS =====

export type PolicyCategory = 
  | 'substance_policy'
  | 'healthcare_reform'
  | 'public_health'
  | 'pandemic_response';

export interface HealthPolicyPeriod {
  id: string;
  code: string;
  name: string;
  name_local?: Record<string, string>;
  category: PolicyCategory;
  country_code: string;
  region_code?: string;
  start_date: string;
  end_date?: string;
  description?: string;
  key_changes?: string[];
  source_documents?: string[];
  source_urls?: string[];
  affected_indicators?: string[];
  affected_substances?: string[];
  is_active: boolean;
}

// ===== SCENARIO ANALOGUES =====

export interface HealthScenarioAnalogue {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: 'demographic' | 'policy' | 'crisis' | 'reform';
  base_country_code: string;
  base_period_start: string;
  base_period_end: string;
  key_characteristics?: Record<string, unknown>;
  observed_outcomes?: Record<string, unknown>;
  relevant_indicators?: string[];
  relevant_substances?: string[];
  uncertainty_factors?: string[];
}

// ===== AGGREGATED VIEWS =====

export interface DiseaseBurdenSummary {
  country_code: string;
  country_name: string;
  period_year: number;
  total_dalys_per_100k: number;
  top_causes: Array<{
    cause_name: string;
    dalys_per_100k: number;
    percent_of_total: number;
  }>;
  life_expectancy: number;
  healthy_life_expectancy?: number;
}

export interface SubstanceOverview {
  substance: SubstanceProfile;
  latest_prevalence?: SubstanceData;
  latest_mortality?: SubstanceData;
  legal_status_current?: SubstanceLegalStatus;
  trend_direction?: 'increasing' | 'decreasing' | 'stable' | 'unknown';
  policy_periods?: HealthPolicyPeriod[];
}

// ===== CONTEXT REQUIREMENTS =====

/**
 * Every health data display MUST include socioeconomic context
 * This is a core principle: health = societal outcome, not individual fault
 */
export interface HealthContextBlock {
  country_code: string;
  period_year: number;
  unemployment_rate?: number;
  gdp_per_capita?: number;
  gini_coefficient?: number;
  education_index?: number;
  urbanization_rate?: number;
  age_dependency_ratio?: number;
  data_sources: string[];
}

// ===== DISCLAIMERS =====

/**
 * Required disclaimer for all health views
 * Must be visible at all times
 */
export const HEALTH_DISCLAIMER = {
  primary: "This platform does not provide medical advice",
  secondary: "No diagnosis, treatment, or prevention guidance is offered",
  action: "For personal health decisions, consult licensed professionals",
  legal: "This is epidemiological reference data only"
} as const;

/**
 * Required warning for scenario exploration
 */
export const SCENARIO_WARNING = 
  "This is a historical scenario exploration, not a medical recommendation.";

/**
 * Blocked query patterns - system refuses to answer these
 */
export const BLOCKED_PATTERNS = [
  'what should I take',
  'which drug is better',
  'recommended dose',
  'how to treat',
  'cure for',
  'should I stop taking',
  'is it safe to',
  'will this help me',
  'diagnosis',
  'my symptoms'
] as const;
