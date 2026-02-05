/**
 * FLAGSHIP INDEXES
 * 
 * Composite indexes for each domain.
 * Index-first thinking: show importance, not raw data.
 */

/**
 * INDEX DEFINITION
 */
export interface FlagshipIndex {
  readonly id: string;
  readonly domain: string;
  readonly name: string;
  readonly description: string;
  readonly components: readonly IndexComponent[];
  readonly methodology: string;
  readonly update_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  readonly importance_rationale: string;
}

export interface IndexComponent {
  readonly node_id: string;
  readonly weight: number;
  readonly transformation?: 'raw' | 'normalized' | 'z_score' | 'percentile';
}

/**
 * HEALTH DOMAIN INDEXES
 */
export const HEALTH_INDEXES: FlagshipIndex[] = [
  {
    id: 'idx_population_mental_health',
    domain: 'health',
    name: 'Population Mental Health Index',
    description: 'Composite measure of population-level mental health status',
    components: [
      { node_id: 'health_anxiety_youth_se', weight: 0.25, transformation: 'z_score' },
      { node_id: 'health_anxiety_adult_se', weight: 0.25, transformation: 'z_score' },
      { node_id: 'health_depression_young_se', weight: 0.25, transformation: 'z_score' },
      { node_id: 'health_stress_population_se', weight: 0.25, transformation: 'z_score' },
    ],
    methodology: 'Z-score normalization with equal weighting',
    update_frequency: 'yearly',
    importance_rationale: 'Mental health affects all other societal systems',
  },
  {
    id: 'idx_health_outcomes',
    domain: 'health',
    name: 'Health Outcomes Index',
    description: 'Overall population health outcome measure',
    components: [
      { node_id: 'health_life_expectancy_se', weight: 0.40, transformation: 'normalized' },
      { node_id: 'health_self_rated_se', weight: 0.30, transformation: 'normalized' },
      { node_id: 'health_life_satisfaction_se', weight: 0.30, transformation: 'normalized' },
    ],
    methodology: 'Normalized values weighted by outcome significance',
    update_frequency: 'yearly',
    importance_rationale: 'Ultimate measure of health system effectiveness',
  },
];

/**
 * HEALTHCARE SYSTEM INDEXES
 */
export const HEALTHCARE_SYSTEM_INDEXES: FlagshipIndex[] = [
  {
    id: 'idx_healthcare_access',
    domain: 'healthcare_system',
    name: 'Healthcare Access Index',
    description: 'Composite measure of healthcare system accessibility',
    components: [
      { node_id: 'hcs_wait_primary_care_se', weight: 0.30, transformation: 'normalized' },
      { node_id: 'hcs_wait_specialist_se', weight: 0.30, transformation: 'normalized' },
      { node_id: 'hcs_wait_surgery_se', weight: 0.20, transformation: 'normalized' },
      { node_id: 'hcs_wait_mental_health_se', weight: 0.20, transformation: 'normalized' },
    ],
    methodology: 'Inverse normalization (lower wait = higher score)',
    update_frequency: 'monthly',
    importance_rationale: 'Access is the primary constraint on healthcare effectiveness',
  },
  {
    id: 'idx_healthcare_capacity',
    domain: 'healthcare_system',
    name: 'Healthcare Capacity Index',
    description: 'System capacity relative to demand',
    components: [
      { node_id: 'hcs_beds_per_capita_se', weight: 0.25, transformation: 'normalized' },
      { node_id: 'hcs_bed_occupancy_se', weight: 0.25, transformation: 'normalized' },
      { node_id: 'hcs_physicians_per_capita_se', weight: 0.25, transformation: 'normalized' },
      { node_id: 'hcs_nurses_per_capita_se', weight: 0.25, transformation: 'normalized' },
    ],
    methodology: 'Capacity measures normalized to international benchmarks',
    update_frequency: 'yearly',
    importance_rationale: 'Capacity determines surge capability and resilience',
  },
  {
    id: 'idx_healthcare_stress',
    domain: 'healthcare_system',
    name: 'Healthcare System Stress Index',
    description: 'Indicators of system strain',
    components: [
      { node_id: 'hcs_bed_occupancy_se', weight: 0.30, transformation: 'raw' },
      { node_id: 'hcs_icu_occupancy_se', weight: 0.40, transformation: 'raw' },
      { node_id: 'hcs_staff_turnover_se', weight: 0.30, transformation: 'raw' },
    ],
    methodology: 'Higher values indicate greater stress',
    update_frequency: 'monthly',
    importance_rationale: 'Early warning of system breakdown risk',
  },
];

/**
 * ECONOMY INDEXES
 */
export const ECONOMY_INDEXES: FlagshipIndex[] = [
  {
    id: 'idx_cost_of_living',
    domain: 'economy',
    name: 'Cost of Living Pressure Index',
    description: 'Composite measure of household cost pressures',
    components: [
      { node_id: 'econ_cpi_total_se', weight: 0.30, transformation: 'raw' },
      { node_id: 'econ_cpi_food_se', weight: 0.20, transformation: 'raw' },
      { node_id: 'econ_cpi_energy_se', weight: 0.20, transformation: 'raw' },
      { node_id: 'econ_housing_cost_burden_se', weight: 0.30, transformation: 'raw' },
    ],
    methodology: 'Weighted average of cost components',
    update_frequency: 'monthly',
    importance_rationale: 'Directly affects household financial wellbeing',
  },
  {
    id: 'idx_household_vulnerability',
    domain: 'economy',
    name: 'Household Financial Vulnerability Index',
    description: 'Sensitivity to interest rate and cost changes',
    components: [
      { node_id: 'econ_household_debt_ratio_se', weight: 0.40, transformation: 'normalized' },
      { node_id: 'econ_mortgage_rate_se', weight: 0.30, transformation: 'normalized' },
      { node_id: 'econ_housing_cost_burden_se', weight: 0.30, transformation: 'normalized' },
    ],
    methodology: 'Higher values indicate greater vulnerability',
    update_frequency: 'quarterly',
    importance_rationale: 'Identifies population segments at financial risk',
  },
  {
    id: 'idx_purchasing_power',
    domain: 'economy',
    name: 'Real Purchasing Power Index',
    description: 'Income growth relative to cost growth',
    components: [
      { node_id: 'econ_real_wage_growth_se', weight: 0.50, transformation: 'raw' },
      { node_id: 'econ_median_income_se', weight: 0.50, transformation: 'normalized' },
    ],
    methodology: 'Inflation-adjusted income measures',
    update_frequency: 'yearly',
    importance_rationale: 'Determines whether living standards are improving',
  },
];

/**
 * STABILITY INDEXES
 */
export const STABILITY_INDEXES: FlagshipIndex[] = [
  {
    id: 'idx_institutional_trust',
    domain: 'stability',
    name: 'Institutional Trust Index',
    description: 'Composite trust in key institutions',
    components: [
      { node_id: 'stab_trust_government_se', weight: 0.40, transformation: 'normalized' },
      { node_id: 'stab_trust_media_se', weight: 0.30, transformation: 'normalized' },
      { node_id: 'stab_trust_interpersonal_se', weight: 0.30, transformation: 'normalized' },
    ],
    methodology: 'Weighted average of trust measures',
    update_frequency: 'yearly',
    importance_rationale: 'Trust is the foundation of functional society',
  },
  {
    id: 'idx_social_cohesion',
    domain: 'stability',
    name: 'Social Cohesion Index',
    description: 'Measure of societal integration and cooperation',
    components: [
      { node_id: 'stab_political_polarization_se', weight: 0.40, transformation: 'normalized' },
      { node_id: 'stab_civic_participation_se', weight: 0.30, transformation: 'normalized' },
      { node_id: 'stab_trust_interpersonal_se', weight: 0.30, transformation: 'normalized' },
    ],
    methodology: 'Polarization is inverse-weighted',
    update_frequency: 'yearly',
    importance_rationale: 'Cohesion enables collective problem-solving',
  },
  {
    id: 'idx_governance_stability',
    domain: 'stability',
    name: 'Governance Stability Index',
    description: 'Predictability and consistency of governance',
    components: [
      { node_id: 'stab_regulatory_change_rate_se', weight: 0.50, transformation: 'normalized' },
      { node_id: 'stab_policy_reversal_count_se', weight: 0.50, transformation: 'normalized' },
    ],
    methodology: 'Lower change rates indicate higher stability',
    update_frequency: 'yearly',
    importance_rationale: 'Stable governance enables long-term planning',
  },
];

/**
 * DEMOGRAPHICS INDEXES
 */
export const DEMOGRAPHICS_INDEXES: FlagshipIndex[] = [
  {
    id: 'idx_demographic_sustainability',
    domain: 'demographics',
    name: 'Demographic Sustainability Index',
    description: 'Long-term population structure viability',
    components: [
      { node_id: 'demo_fertility_rate_se', weight: 0.30, transformation: 'normalized' },
      { node_id: 'demo_dependency_ratio_total_se', weight: 0.35, transformation: 'normalized' },
      { node_id: 'demo_working_age_share_se', weight: 0.35, transformation: 'normalized' },
    ],
    methodology: 'Weighted toward workforce sustainability',
    update_frequency: 'yearly',
    importance_rationale: 'Demographics determine everything long-term',
  },
  {
    id: 'idx_aging_pressure',
    domain: 'demographics',
    name: 'Aging Pressure Index',
    description: 'Intensity of population aging effects',
    components: [
      { node_id: 'demo_median_age_se', weight: 0.30, transformation: 'normalized' },
      { node_id: 'demo_elderly_share_se', weight: 0.35, transformation: 'normalized' },
      { node_id: 'demo_dependency_ratio_old_se', weight: 0.35, transformation: 'normalized' },
    ],
    methodology: 'Higher values indicate greater aging pressure',
    update_frequency: 'yearly',
    importance_rationale: 'Aging drives healthcare and pension costs',
  },
];

/**
 * ALL FLAGSHIP INDEXES
 */
export const ALL_FLAGSHIP_INDEXES: FlagshipIndex[] = [
  ...HEALTH_INDEXES,
  ...HEALTHCARE_SYSTEM_INDEXES,
  ...ECONOMY_INDEXES,
  ...STABILITY_INDEXES,
  ...DEMOGRAPHICS_INDEXES,
];

/**
 * GET INDEX BY ID
 */
export function getIndex(indexId: string): FlagshipIndex | undefined {
  return ALL_FLAGSHIP_INDEXES.find(i => i.id === indexId);
}

/**
 * GET INDEXES BY DOMAIN
 */
export function getIndexesByDomain(domain: string): FlagshipIndex[] {
  return ALL_FLAGSHIP_INDEXES.filter(i => i.domain === domain);
}

/**
 * GET INDEX SUMMARY
 */
export function getIndexSummary(): {
  total: number;
  by_domain: Record<string, number>;
} {
  const byDomain: Record<string, number> = {};
  
  for (const index of ALL_FLAGSHIP_INDEXES) {
    byDomain[index.domain] = (byDomain[index.domain] || 0) + 1;
  }
  
  return {
    total: ALL_FLAGSHIP_INDEXES.length,
    by_domain: byDomain,
  };
}
