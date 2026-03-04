/**
 * NUTRITION MODULE — Example Triple-Layer Knowledge Module
 * 
 * Demonstrates the full architecture with real-world nutrition domain.
 */

import type {
  KnowledgeModule,
  DomainOntology,
  DomainObservation,
  KnowledgeClaim,
  InterventionRanking,
  CrossModuleVariable,
} from '../types';

// ============================================================================
// STEP 1: DOMAIN ONTOLOGY
// ============================================================================

export const NUTRITION_ONTOLOGY: DomainOntology = {
  entities: [
    { code: 'DIET_PATTERN', name: 'Dietary Pattern', type: 'intervention', description: 'A defined way of eating over time' },
    { code: 'NUTRIENT', name: 'Nutrient', type: 'mechanism', description: 'A biochemical substance with physiological effect' },
    { code: 'FOOD_GROUP', name: 'Food Group', type: 'intervention', description: 'A category of food items' },
    { code: 'BIOMARKER', name: 'Biomarker', type: 'outcome', description: 'A measurable biological indicator' },
    { code: 'HEALTH_OUTCOME', name: 'Health Outcome', type: 'outcome', description: 'A clinically significant health event' },
    { code: 'POPULATION', name: 'Population', type: 'subject', description: 'A defined group of people' },
    { code: 'GUT_MICROBIOME', name: 'Gut Microbiome', type: 'mechanism', description: 'The community of microorganisms in the digestive tract' },
  ],
  variables: [
    { code: 'CVD_MORTALITY', name: 'Cardiovascular mortality rate', unit: 'per 100,000', measurement_type: 'continuous', direction: 'lower_better' },
    { code: 'ALL_CAUSE_MORTALITY', name: 'All-cause mortality rate', unit: 'per 100,000', measurement_type: 'continuous', direction: 'lower_better' },
    { code: 'BMI', name: 'Body Mass Index', unit: 'kg/m²', measurement_type: 'continuous', direction: 'neutral' },
    { code: 'HBA1C', name: 'HbA1c', unit: '%', measurement_type: 'continuous', direction: 'lower_better' },
    { code: 'LDL_CHOLESTEROL', name: 'LDL Cholesterol', unit: 'mg/dL', measurement_type: 'continuous', direction: 'lower_better' },
    { code: 'INFLAMMATION_CRP', name: 'C-Reactive Protein', unit: 'mg/L', measurement_type: 'continuous', direction: 'lower_better' },
    { code: 'ADHERENCE', name: 'Diet adherence score', unit: '0-100', measurement_type: 'continuous', direction: 'higher_better' },
    { code: 'MICROBIOME_DIVERSITY', name: 'Gut microbiome diversity', unit: 'Shannon index', measurement_type: 'continuous', direction: 'higher_better' },
  ],
  relationships: [
    { source: 'DIET_PATTERN', target: 'BIOMARKER', type: 'associated_with' },
    { source: 'DIET_PATTERN', target: 'HEALTH_OUTCOME', type: 'associated_with' },
    { source: 'NUTRIENT', target: 'BIOMARKER', type: 'mediates' },
    { source: 'GUT_MICROBIOME', target: 'HEALTH_OUTCOME', type: 'mediates' },
    { source: 'FOOD_GROUP', target: 'DIET_PATTERN', type: 'component_of' },
    { source: 'POPULATION', target: 'ADHERENCE', type: 'modifies' },
  ],
  data_sources: [
    { code: 'PREDIMED', name: 'PREDIMED Trial', type: 'study', organization: 'University of Barcelona', reliability_tier: 1 },
    { code: 'PURE', name: 'PURE Study', type: 'study', organization: 'McMaster University', reliability_tier: 1 },
    { code: 'NHANES', name: 'NHANES', type: 'dataset', organization: 'CDC', reliability_tier: 1 },
    { code: 'GBD', name: 'Global Burden of Disease', type: 'dataset', organization: 'IHME', reliability_tier: 1 },
    { code: 'NUTRIRECS', name: 'NutriRECS Consortium', type: 'study', organization: 'NutriRECS', reliability_tier: 2 },
  ],
};

// ============================================================================
// STEP 2: SEED OBSERVATIONS (Data Layer)
// ============================================================================

export const NUTRITION_SEED_OBSERVATIONS: Omit<DomainObservation, 'id' | 'module_id'>[] = [
  {
    observation_code: 'OBS-NUT-001',
    source_type: 'study',
    source_reference: 'Estruch et al. (2018). PREDIMED primary prevention trial. NEJM 378:e34',
    source_organization: 'University of Barcelona',
    source_url: 'https://doi.org/10.1056/NEJMoa1800389',
    population_descriptor: 'Adults aged 55-80 at high cardiovascular risk',
    population_size: 7447,
    measurement_type: 'CVD_MORTALITY',
    effect_size: -0.30,
    confidence_interval_lower: -0.46,
    confidence_interval_upper: -0.10,
    p_value: 0.003,
    methodology: 'Multicenter randomized controlled trial',
    geo_scope: 'country',
    geo_code: 'ES',
    time_period_start: '2003-01-01',
    time_period_end: '2011-12-31',
    raw_metadata: { study_design: 'RCT', intervention: 'Mediterranean diet + EVOO or nuts' },
    is_replicated: true,
    replication_count: 3,
  },
  {
    observation_code: 'OBS-NUT-002',
    source_type: 'study',
    source_reference: 'Dehghan et al. (2017). PURE Study. The Lancet 390(10107):2050-2062',
    source_organization: 'McMaster University',
    source_url: 'https://doi.org/10.1016/S0140-6736(17)32252-3',
    population_descriptor: 'Adults aged 35-70 from 18 countries',
    population_size: 135335,
    measurement_type: 'ALL_CAUSE_MORTALITY',
    effect_size: -0.23,
    confidence_interval_lower: -0.31,
    confidence_interval_upper: -0.14,
    p_value: 0.001,
    methodology: 'Prospective cohort study',
    geo_scope: 'global',
    time_period_start: '2003-01-01',
    time_period_end: '2013-03-31',
    raw_metadata: { study_design: 'cohort', finding: 'Higher fruit/veg/legume intake associated with lower mortality' },
    is_replicated: true,
    replication_count: 5,
  },
  {
    observation_code: 'OBS-NUT-003',
    source_type: 'study',
    source_reference: 'Zmora et al. (2019). Personalized gut mucosal colonization. Cell 174(6):1388-1405',
    source_organization: 'Weizmann Institute',
    source_url: 'https://doi.org/10.1016/j.cell.2018.08.041',
    population_descriptor: 'Healthy adults',
    population_size: 25,
    measurement_type: 'MICROBIOME_DIVERSITY',
    effect_size: 0.45,
    methodology: 'Interventional study with probiotic supplementation',
    geo_scope: 'country',
    geo_code: 'IL',
    time_period_start: '2017-01-01',
    time_period_end: '2018-06-30',
    raw_metadata: { study_design: 'interventional', finding: 'Probiotic response is person-specific' },
    is_replicated: false,
    replication_count: 0,
  },
  {
    observation_code: 'OBS-NUT-004',
    source_type: 'dataset',
    source_reference: 'GBD 2019: Dietary risk factors',
    source_organization: 'IHME',
    source_url: 'https://ghdx.healthdata.org/gbd-2019',
    population_descriptor: 'Global population',
    population_size: 7700000000,
    measurement_type: 'ALL_CAUSE_MORTALITY',
    measurement_value: 11000000,
    measurement_unit: 'deaths attributable to dietary risks per year',
    methodology: 'Systematic analysis of 87 risk factors',
    geo_scope: 'global',
    time_period_start: '2019-01-01',
    time_period_end: '2019-12-31',
    raw_metadata: { study_design: 'systematic_analysis', key_risks: ['low whole grains', 'high sodium', 'low fruits'] },
    is_replicated: true,
    replication_count: 4,
  },
  {
    observation_code: 'OBS-NUT-005',
    source_type: 'study',
    source_reference: 'Johnston et al. (2019). NutriRECS red meat review. Annals of Internal Medicine 171(10):756-764',
    source_organization: 'NutriRECS',
    source_url: 'https://doi.org/10.7326/M19-1621',
    population_descriptor: 'General adult population',
    measurement_type: 'CVD_MORTALITY',
    effect_size: -0.01,
    confidence_interval_lower: -0.04,
    confidence_interval_upper: 0.02,
    p_value: 0.42,
    methodology: 'Systematic review of RCTs and observational studies',
    geo_scope: 'global',
    raw_metadata: { study_design: 'systematic_review', finding: 'Very low certainty evidence for red meat reduction' },
    is_replicated: false,
    replication_count: 0,
  },
];

// ============================================================================
// STEP 3: SEED CLAIMS (Knowledge Layer)
// ============================================================================

export const NUTRITION_SEED_CLAIMS: Omit<KnowledgeClaim, 'id' | 'module_id' | 'supporting_evidence' | 'contradicting_evidence'>[] = [
  {
    claim_code: 'CLM-NUT-001',
    statement: 'Mediterranean dietary pattern is associated with reduced cardiovascular mortality in high-risk populations',
    statement_sv: 'Medelhavskostmönster är associerat med minskad kardiovaskulär dödlighet i högriskpopulationer',
    claim_type: 'intervention_effect',
    status: 'supported',
    confidence_score: 0.82,
    evidence_quality: 'high',
    population_scope: 'Adults aged 55-80 at high CV risk',
    geographic_scope: 'Southern Europe (primarily Spain)',
    temporal_scope: '2003-2018',
    effect_size: -0.30,
    effect_size_unit: 'Hazard ratio reduction',
    uncertainty_description: 'Effect may vary by genetic background, baseline diet, and food supply. Original trial had randomization concerns (corrected in 2018 re-analysis).',
    limitations: [
      'Limited to Southern European population',
      'Adherence in free-living conditions may differ from trial setting',
      'Cannot separate effects of individual diet components',
      'Healthy user bias in observational replications',
    ],
    version: 1,
  },
  {
    claim_code: 'CLM-NUT-002',
    statement: 'Higher fruit, vegetable, and legume intake is associated with lower all-cause mortality across income levels',
    statement_sv: 'Högre intag av frukt, grönsaker och baljväxter är associerat med lägre total dödlighet oavsett inkomstnivå',
    claim_type: 'correlational',
    status: 'supported',
    confidence_score: 0.78,
    evidence_quality: 'moderate',
    population_scope: 'Adults 35-70 across 18 countries',
    geographic_scope: 'Global (5 continents)',
    temporal_scope: '2003-2013',
    effect_size: -0.23,
    effect_size_unit: 'Hazard ratio reduction (3-4 servings/day vs <1)',
    uncertainty_description: 'Observational design cannot establish causation. Dietary measurement via recall has known limitations.',
    limitations: [
      'Observational — no causal claim possible',
      'Self-reported dietary data',
      'Residual confounding by socioeconomic factors',
      'Benefit plateaus at 3-4 servings/day',
    ],
    version: 1,
  },
  {
    claim_code: 'CLM-NUT-003',
    statement: 'Dietary risk factors are among the leading contributors to global mortality, primarily through low whole grain intake, high sodium, and low fruit consumption',
    statement_sv: 'Kostfaktorer är bland de ledande bidragande faktorerna till global dödlighet, främst genom lågt fullkornsintag, högt natrium och lågt fruktintag',
    claim_type: 'prevalence',
    status: 'supported',
    confidence_score: 0.85,
    evidence_quality: 'high',
    population_scope: 'Global population',
    geographic_scope: 'Global (195 countries)',
    temporal_scope: '2019',
    effect_size: 11000000,
    effect_size_unit: 'Deaths per year attributable to dietary risk',
    uncertainty_description: 'Estimates depend on counterfactual risk level assumptions and diet-disease associations used.',
    limitations: [
      'Model-dependent estimates',
      'Assumes causal relationships from observational data',
      'Country-level diet data quality varies',
    ],
    version: 1,
  },
  {
    claim_code: 'CLM-NUT-004',
    statement: 'Evidence for reducing red meat consumption to improve cardiovascular outcomes is of very low certainty',
    statement_sv: 'Evidensen för att minska rött kött-konsumtion förbättrar kardiovaskulära utfall är av mycket låg säkerhet',
    claim_type: 'descriptive',
    status: 'contested',
    confidence_score: 0.45,
    evidence_quality: 'low',
    population_scope: 'General adult population',
    geographic_scope: 'Global',
    uncertainty_description: 'NutriRECS methodology was controversial. Multiple health organizations disagree with their conclusions.',
    limitations: [
      'NutriRECS approach was criticized by >30 scientific organizations',
      'GRADE methodology may not suit nutritional epidemiology',
      'Conflating certainty of evidence with magnitude of effect',
    ],
    version: 1,
  },
];

// ============================================================================
// STEP 5: SEED INTERVENTION RANKING (Intelligence Layer)
// ============================================================================

export const NUTRITION_SEED_RANKING: Omit<InterventionRanking, 'id' | 'module_id'> = {
  ranking_code: 'RANK-NUT-CVD-001',
  question: 'Which dietary interventions have the strongest evidence for reducing cardiovascular mortality?',
  question_sv: 'Vilka kostinterventioner har starkast evidens för att minska kardiovaskulär dödlighet?',
  methodology: 'Evidence synthesis from RCTs and large cohort studies, weighted by evidence quality, effect size, and population applicability.',
  interventions: [
    {
      code: 'INT-MED-DIET',
      name: 'Mediterranean dietary pattern',
      rank: 1,
      score: 0.85,
      effect_size: -0.30,
      evidence_quality: 'high',
      supporting_claims: ['CLM-NUT-001'],
      cost_effectiveness: 0.8,
      population_applicability: 0.6,
      side_effects: ['May be difficult to adopt outside Mediterranean food culture'],
    },
    {
      code: 'INT-FRUIT-VEG',
      name: 'Increased fruit and vegetable intake (3-4 servings/day)',
      rank: 2,
      score: 0.75,
      effect_size: -0.23,
      evidence_quality: 'moderate',
      supporting_claims: ['CLM-NUT-002'],
      cost_effectiveness: 0.9,
      population_applicability: 0.9,
      side_effects: [],
    },
    {
      code: 'INT-WHOLE-GRAINS',
      name: 'Increased whole grain intake',
      rank: 3,
      score: 0.70,
      effect_size: -0.15,
      evidence_quality: 'moderate',
      supporting_claims: ['CLM-NUT-003'],
      cost_effectiveness: 0.85,
      population_applicability: 0.8,
      side_effects: ['Celiac/gluten sensitivity exclusion'],
    },
    {
      code: 'INT-SODIUM-REDUCTION',
      name: 'Sodium reduction',
      rank: 4,
      score: 0.65,
      effect_size: -0.12,
      evidence_quality: 'moderate',
      supporting_claims: ['CLM-NUT-003'],
      cost_effectiveness: 0.95,
      population_applicability: 0.85,
      side_effects: ['Very low sodium may increase mortality in some populations'],
    },
  ],
  ranking_criteria: {
    effect_weight: 0.35,
    evidence_weight: 0.30,
    cost_weight: 0.10,
    applicability_weight: 0.15,
    safety_weight: 0.10,
  },
  limitations: [
    'Rankings reflect evidence quality, not definitive superiority',
    'Individual genetic and microbiome variation may alter optimal diet',
    'Cultural and economic factors affect applicability',
    'Effect sizes from different study designs are not directly comparable',
  ],
  confidence_score: 0.72,
  valid_for_population: 'General adult population, primarily Western dietary context',
};

// ============================================================================
// STEP 6: CROSS-MODULE BRIDGES
// ============================================================================

export const NUTRITION_CROSS_MODULE: Omit<CrossModuleVariable, 'id' | 'source_module_id' | 'target_module_id'>[] = [
  {
    variable_name: 'INFLAMMATION_CRP',
    relationship_type: 'shared_output',
    description: 'C-reactive protein is both a nutrition biomarker and a cardiovascular risk factor',
    strength: 0.75,
  },
  {
    variable_name: 'GUT_MICROBIOME_DIVERSITY',
    relationship_type: 'mediator',
    description: 'Gut microbiome mediates diet-health relationships and affects psychological outcomes',
    strength: 0.6,
  },
  {
    variable_name: 'BMI',
    relationship_type: 'shared_input',
    description: 'BMI is influenced by diet and affects metabolic, cardiovascular, and psychological outcomes',
    strength: 0.8,
  },
  {
    variable_name: 'SOCIOECONOMIC_STATUS',
    relationship_type: 'confounder',
    description: 'SES affects dietary choice, food access, and health outcomes independently',
    strength: 0.7,
  },
];

// ============================================================================
// MODULE DEFINITION
// ============================================================================

export const NUTRITION_MODULE: Omit<KnowledgeModule, 'id'> = {
  module_code: 'MOD-NUTRITION-V1',
  name: 'Nutrition & Dietary Health',
  description: 'Evidence-graded knowledge module covering dietary patterns, nutrient effects, and food-health relationships. Built on PREDIMED, PURE, GBD, and systematic reviews.',
  domain: 'nutrition',
  status: 'active',
  version: 1,
  ontology_schema: NUTRITION_ONTOLOGY,
  cross_module_links: ['longevity', 'psychology', 'economics'],
};
