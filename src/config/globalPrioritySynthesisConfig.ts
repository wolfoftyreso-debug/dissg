/**
 * MODULE — "WHAT MATTERS MOST RIGHT NOW?"
 * Global Priority Synthesis Engine
 * 
 * Startsidan för mänsklig orientering.
 * 
 * Systemet ställer alltid samma fråga:
 * "Vilka faktorer har just nu störst dokumenterad påverkan på 
 * mänskliga livsbetingelser, samhällsstabilitet och framtida handlingsutrymme?"
 * 
 * KRITISKT:
 * - Inte "vad borde vi göra"
 * - Inte "vad är rätt"
 * - Utan vad är mest påverkande enligt data
 */

// ═══════════════════════════════════════════════════════════════
// KÄRNPRINCIP (ALDRIG BRYT)
// ═══════════════════════════════════════════════════════════════

export const CORE_PRINCIPLE = {
  statement: 'Systemet pekar på vad som betyder mest. Människor bestämmer vad de gör med den kunskapen.',
  enforced: true,
  display: 'always_visible',
  
  forbidden: [
    'recommendations',
    'policy_advice',
    'should_statements',
    'political_positioning',
    'value_judgments',
  ],
  
  always_show: [
    'uncertainty',
    'alternative_rankings',
    'methodology_choices',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════
// FORMELL FRÅGESTÄLLNING
// ═══════════════════════════════════════════════════════════════

export const SYSTEM_QUESTION = {
  formal: 'Vilka faktorer har just nu störst dokumenterad påverkan på mänskliga livsbetingelser, samhällsstabilitet och framtida handlingsutrymme?',
  
  short: 'Vad är viktigast just nu?',
  
  english: {
    formal: 'Which factors currently have the greatest documented impact on human living conditions, societal stability, and future capacity for action?',
    short: 'What matters most right now?',
  },
  
  clarification: {
    not_what_to_do: true,
    not_what_is_right: true,
    only_what_impacts_most: true,
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK KA — GLOBAL PRIORITY SYNTHESIS ENGINE
// ═══════════════════════════════════════════════════════════════

export type ImpactDomain = 
  | 'health'
  | 'demography'
  | 'economy'
  | 'energy'
  | 'climate_environment'
  | 'institutional_stability'
  | 'education_competence'
  | 'scientific_consensus';

export interface DataSource {
  id: string;
  name: string;
  type: 'official_statistics' | 'scientific_consensus' | 'meta_analysis';
  authority: string; // WHO, IPCC, OECD, UN, etc.
  update_frequency: string;
  open_access: boolean;
}

export const INPUT_SOURCES: Record<ImpactDomain, DataSource[]> = {
  health: [
    { id: 'who_gho', name: 'WHO Global Health Observatory', type: 'official_statistics', authority: 'WHO', update_frequency: 'annual', open_access: true },
    { id: 'ihme_gbd', name: 'Global Burden of Disease', type: 'meta_analysis', authority: 'IHME', update_frequency: 'annual', open_access: true },
  ],
  demography: [
    { id: 'un_pop', name: 'UN Population Division', type: 'official_statistics', authority: 'UN', update_frequency: 'biennial', open_access: true },
    { id: 'wb_pop', name: 'World Bank Population', type: 'official_statistics', authority: 'World Bank', update_frequency: 'annual', open_access: true },
  ],
  economy: [
    { id: 'imf_weo', name: 'IMF World Economic Outlook', type: 'official_statistics', authority: 'IMF', update_frequency: 'quarterly', open_access: true },
    { id: 'wb_wdi', name: 'World Development Indicators', type: 'official_statistics', authority: 'World Bank', update_frequency: 'annual', open_access: true },
    { id: 'oecd_eco', name: 'OECD Economic Outlook', type: 'official_statistics', authority: 'OECD', update_frequency: 'biannual', open_access: true },
  ],
  energy: [
    { id: 'iea_weo', name: 'IEA World Energy Outlook', type: 'official_statistics', authority: 'IEA', update_frequency: 'annual', open_access: true },
    { id: 'irena', name: 'IRENA Renewable Capacity', type: 'official_statistics', authority: 'IRENA', update_frequency: 'annual', open_access: true },
  ],
  climate_environment: [
    { id: 'ipcc_ar', name: 'IPCC Assessment Reports', type: 'scientific_consensus', authority: 'IPCC', update_frequency: '5-7 years', open_access: true },
    { id: 'unep_geo', name: 'UNEP Global Environment Outlook', type: 'scientific_consensus', authority: 'UNEP', update_frequency: '4 years', open_access: true },
  ],
  institutional_stability: [
    { id: 'wgi', name: 'Worldwide Governance Indicators', type: 'official_statistics', authority: 'World Bank', update_frequency: 'annual', open_access: true },
    { id: 'fsi', name: 'Fragile States Index', type: 'meta_analysis', authority: 'Fund for Peace', update_frequency: 'annual', open_access: true },
  ],
  education_competence: [
    { id: 'unesco_uis', name: 'UNESCO Institute for Statistics', type: 'official_statistics', authority: 'UNESCO', update_frequency: 'annual', open_access: true },
    { id: 'oecd_pisa', name: 'OECD PISA', type: 'official_statistics', authority: 'OECD', update_frequency: 'triennial', open_access: true },
  ],
  scientific_consensus: [
    { id: 'cochrane', name: 'Cochrane Systematic Reviews', type: 'meta_analysis', authority: 'Cochrane', update_frequency: 'continuous', open_access: true },
    { id: 'lancet_commissions', name: 'Lancet Commissions', type: 'scientific_consensus', authority: 'Lancet', update_frequency: 'variable', open_access: true },
  ],
};

// ═══════════════════════════════════════════════════════════════
// IMPACT CALCULATION MODEL
// ═══════════════════════════════════════════════════════════════

export interface ImpactDimension {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  weight: number; // 0-1, sum should = 1
  calculation: string;
}

export const IMPACT_DIMENSIONS: ImpactDimension[] = [
  {
    id: 'impact_scope',
    name: 'Impact Scope',
    nameSv: 'Påverkansomfång',
    description: 'Hur många människor berörs',
    weight: 0.25,
    calculation: 'population_affected / global_population',
  },
  {
    id: 'impact_depth',
    name: 'Impact Depth',
    nameSv: 'Påverkansdjup',
    description: 'Hur allvarlig påverkan på individnivå',
    weight: 0.25,
    calculation: 'severity_score based on DALY/mortality/welfare impact',
  },
  {
    id: 'time_sensitivity',
    name: 'Time Sensitivity',
    nameSv: 'Tidskänslighet',
    description: 'Hur snabbt effekter ackumuleras',
    weight: 0.20,
    calculation: 'rate_of_change * accumulation_factor',
  },
  {
    id: 'reversibility',
    name: 'Reversibility',
    nameSv: 'Reversibilitet',
    description: 'Hur svår påverkan är att vända (inverterad)',
    weight: 0.15,
    calculation: '1 - (recovery_potential * intervention_effectiveness)',
  },
  {
    id: 'cross_domain_coupling',
    name: 'Cross-Domain Coupling',
    nameSv: 'Tvärdomänkoppling',
    description: 'Hur många system påverkas samtidigt',
    weight: 0.15,
    calculation: 'count(affected_domains) * coupling_strength',
  },
];

export interface ImpactProfile {
  factor_id: string;
  factor_name: string;
  factor_name_sv: string;
  
  scores: {
    impact_scope: number;
    impact_depth: number;
    time_sensitivity: number;
    reversibility: number;
    cross_domain_coupling: number;
  };
  
  weighted_total: number;
  
  affected_domains: ImpactDomain[];
  
  uncertainty: {
    level: 'low' | 'medium' | 'high';
    sources: string[];
  };
  
  data_quality: {
    coverage: number; // 0-1
    recency_months: number;
    source_count: number;
  };
}

// ═══════════════════════════════════════════════════════════════
// BLOCK KB — GLOBAL TOP ISSUES (DESCRIPTIVE)
// ═══════════════════════════════════════════════════════════════

export interface GlobalTopIssue {
  rank: number;
  factor_id: string;
  title: string;
  title_sv: string;
  
  impact_profile: ImpactProfile;
  
  affected_systems: string[];
  
  key_connections: string[];
  
  current_trajectory: 'improving' | 'stable' | 'declining' | 'volatile';
  
  // CRITICAL: No recommendations, only observations
  observation: string;
  observation_sv: string;
}

export const EXAMPLE_TOP_ISSUES: GlobalTopIssue[] = [
  {
    rank: 1,
    factor_id: 'energy_system_stability',
    title: 'Energy System Stability & Transition',
    title_sv: 'Energisystemets stabilitet & omställning',
    impact_profile: {
      factor_id: 'energy_system_stability',
      factor_name: 'Energy System Stability',
      factor_name_sv: 'Energisystemets stabilitet',
      scores: {
        impact_scope: 0.95,
        impact_depth: 0.85,
        time_sensitivity: 0.80,
        reversibility: 0.70,
        cross_domain_coupling: 0.95,
      },
      weighted_total: 0.86,
      affected_domains: ['economy', 'climate_environment', 'institutional_stability', 'health'],
      uncertainty: { level: 'medium', sources: ['transition_speed', 'technology_adoption'] },
      data_quality: { coverage: 0.92, recency_months: 3, source_count: 8 },
    },
    affected_systems: ['economy', 'geopolitics', 'health', 'climate'],
    key_connections: ['inflation', 'conflict_risk', 'living_costs', 'industrial_capacity'],
    current_trajectory: 'volatile',
    observation: 'High coupling to inflation, conflict risk, and living costs observed across regions.',
    observation_sv: 'Hög koppling till inflation, konfliktrisk och levnadskostnader observeras över regioner.',
  },
  {
    rank: 2,
    factor_id: 'demographic_imbalance',
    title: 'Population Structure & Demographic Imbalance',
    title_sv: 'Befolkningsstruktur & demografisk obalans',
    impact_profile: {
      factor_id: 'demographic_imbalance',
      factor_name: 'Demographic Imbalance',
      factor_name_sv: 'Demografisk obalans',
      scores: {
        impact_scope: 0.90,
        impact_depth: 0.75,
        time_sensitivity: 0.60,
        reversibility: 0.85,
        cross_domain_coupling: 0.80,
      },
      weighted_total: 0.78,
      affected_domains: ['economy', 'health', 'institutional_stability', 'education_competence'],
      uncertainty: { level: 'low', sources: ['migration_patterns'] },
      data_quality: { coverage: 0.95, recency_months: 6, source_count: 5 },
    },
    affected_systems: ['labor_market', 'welfare', 'stability'],
    key_connections: ['aging_populations', 'youth_bulge_regions', 'dependency_ratios'],
    current_trajectory: 'stable',
    observation: 'Divergent patterns: aging populations in developed regions, rapid growth in others.',
    observation_sv: 'Divergerande mönster: åldrande befolkningar i utvecklade regioner, snabb tillväxt i andra.',
  },
  {
    rank: 3,
    factor_id: 'public_health_burden',
    title: 'Public Health (Chronic & Mental Health)',
    title_sv: 'Folkhälsa (kroniska sjukdomar, psykisk hälsa)',
    impact_profile: {
      factor_id: 'public_health_burden',
      factor_name: 'Public Health Burden',
      factor_name_sv: 'Folkhälsobörda',
      scores: {
        impact_scope: 0.85,
        impact_depth: 0.90,
        time_sensitivity: 0.50,
        reversibility: 0.60,
        cross_domain_coupling: 0.70,
      },
      weighted_total: 0.74,
      affected_domains: ['health', 'economy', 'education_competence'],
      uncertainty: { level: 'medium', sources: ['mental_health_reporting', 'emerging_conditions'] },
      data_quality: { coverage: 0.85, recency_months: 12, source_count: 6 },
    },
    affected_systems: ['productivity', 'life_quality', 'healthcare_costs'],
    key_connections: ['ncd_burden', 'mental_health_crisis', 'healthcare_capacity'],
    current_trajectory: 'declining',
    observation: 'Direct impact on productivity and life quality. Long lag but extreme cumulative effect.',
    observation_sv: 'Direkt påverkan på produktivitet och livskvalitet. Lång lagg men extrem ackumulativ effekt.',
  },
  {
    rank: 4,
    factor_id: 'institutional_trust',
    title: 'Institutional Trust & Governance Capacity',
    title_sv: 'Institutionell tillit & styrningsförmåga',
    impact_profile: {
      factor_id: 'institutional_trust',
      factor_name: 'Institutional Trust',
      factor_name_sv: 'Institutionell tillit',
      scores: {
        impact_scope: 0.80,
        impact_depth: 0.70,
        time_sensitivity: 0.75,
        reversibility: 0.65,
        cross_domain_coupling: 0.90,
      },
      weighted_total: 0.76,
      affected_domains: ['institutional_stability', 'economy', 'health', 'education_competence'],
      uncertainty: { level: 'medium', sources: ['measurement_methodology', 'cultural_variation'] },
      data_quality: { coverage: 0.80, recency_months: 12, source_count: 4 },
    },
    affected_systems: ['policy_effectiveness', 'social_cohesion', 'crisis_response'],
    key_connections: ['decision_effectiveness', 'policy_implementation', 'crisis_management'],
    current_trajectory: 'declining',
    observation: 'Strongly correlates with all other outcomes. Low trust = low effect of all decisions.',
    observation_sv: 'Korrelerar starkt med alla andra utfall. Låg tillit = låg effekt av alla beslut.',
  },
  {
    rank: 5,
    factor_id: 'education_competence_match',
    title: 'Education & Competence Matching',
    title_sv: 'Utbildning & kompetensmatchning',
    impact_profile: {
      factor_id: 'education_competence_match',
      factor_name: 'Education Competence Match',
      factor_name_sv: 'Utbildning & kompetens',
      scores: {
        impact_scope: 0.85,
        impact_depth: 0.65,
        time_sensitivity: 0.40,
        reversibility: 0.55,
        cross_domain_coupling: 0.75,
      },
      weighted_total: 0.66,
      affected_domains: ['education_competence', 'economy', 'institutional_stability'],
      uncertainty: { level: 'medium', sources: ['future_skill_requirements', 'technology_disruption'] },
      data_quality: { coverage: 0.88, recency_months: 18, source_count: 5 },
    },
    affected_systems: ['innovation_capacity', 'adaptation_ability', 'economic_resilience'],
    key_connections: ['skill_gaps', 'technology_adoption', 'workforce_adaptability'],
    current_trajectory: 'stable',
    observation: 'Affects long-term innovation and adaptation capacity.',
    observation_sv: 'Påverkar långsiktig innovations- och anpassningsförmåga.',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK KC — REGIONAL & NATIONAL BREAKDOWN
// ═══════════════════════════════════════════════════════════════

export type WorldRegion = 
  | 'europe'
  | 'north_america'
  | 'africa'
  | 'asia'
  | 'latin_america'
  | 'middle_east'
  | 'oceania';

export interface RegionalPriorityProfile {
  region: WorldRegion;
  region_name: string;
  region_name_sv: string;
  
  top_factors: Array<{
    rank: number;
    factor_id: string;
    title_sv: string;
    weighted_score: number;
    deviation_from_global: number; // positive = higher priority than global
  }>;
  
  unique_factors: string[]; // Factors that are top-5 here but not globally
  
  shared_with_global: string[]; // Factors shared with global top-5
  
  key_differences: string[];
}

export interface NationalPriorityProfile {
  country_code: string;
  country_name: string;
  
  top_factors: Array<{
    rank: number;
    factor_id: string;
    title_sv: string;
    weighted_score: number;
  }>;
  
  perception_gap: {
    overexposed: Array<{
      topic: string;
      attention_level: number;
      actual_impact: number;
      gap: number;
    }>;
    underexposed: Array<{
      topic: string;
      attention_level: number;
      actual_impact: number;
      gap: number;
    }>;
  };
  
  global_sensitivities: Array<{
    global_factor: string;
    sensitivity_score: number; // How exposed this country is
    explanation: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK KD — SCIENCE META-SYNTHESIS
// ═══════════════════════════════════════════════════════════════

export interface ScientificConsensusPoint {
  id: string;
  statement: string;
  statement_sv: string;
  
  evidence_base: {
    systematic_reviews: number;
    meta_analyses: number;
    consensus_reports: number;
    total_studies: number;
  };
  
  consistency: 'very_high' | 'high' | 'moderate' | 'emerging';
  
  key_sources: string[];
  
  domain: ImpactDomain;
  
  // NOT policy, just observed relationships
  observed_relationship: string;
}

export const SCIENCE_CONSENSUS_QUESTION = {
  question: 'Vilka faktorer återkommer i oberoende vetenskap som mest avgörande för långsiktigt välbefinnande?',
  english: 'Which factors consistently appear in independent science as most crucial for long-term wellbeing?',
  
  clarification: 'Ingen "policy". Bara återkommande samband.',
} as const;

export const EXAMPLE_CONSENSUS_POINTS: ScientificConsensusPoint[] = [
  {
    id: 'stable_institutions',
    statement: 'Stable institutions correlate with better outcomes across all measured domains',
    statement_sv: 'Stabila institutioner korrelerar med bättre utfall över alla mätta domäner',
    evidence_base: { systematic_reviews: 45, meta_analyses: 23, consensus_reports: 12, total_studies: 850 },
    consistency: 'very_high',
    key_sources: ['World Bank WGI', 'Acemoglu & Robinson', 'North institutional economics'],
    domain: 'institutional_stability',
    observed_relationship: 'Governance quality positively correlates with health, education, and economic outcomes',
  },
  {
    id: 'energy_access',
    statement: 'Energy access is consistently associated with development outcomes',
    statement_sv: 'Tillgång till energi är konsekvent associerat med utvecklingsutfall',
    evidence_base: { systematic_reviews: 38, meta_analyses: 19, consensus_reports: 8, total_studies: 620 },
    consistency: 'very_high',
    key_sources: ['IEA', 'SE4All', 'UN SDG7 reviews'],
    domain: 'energy',
    observed_relationship: 'Energy access correlates with poverty reduction, health improvements, and economic growth',
  },
  {
    id: 'basic_health',
    statement: 'Basic health interventions show highest return on investment',
    statement_sv: 'Grundläggande hälsoinsatser visar högst avkastning på investering',
    evidence_base: { systematic_reviews: 120, meta_analyses: 67, consensus_reports: 25, total_studies: 2400 },
    consistency: 'very_high',
    key_sources: ['Cochrane', 'WHO Essential Interventions', 'Lancet Commissions'],
    domain: 'health',
    observed_relationship: 'Preventive and basic care consistently outperform advanced interventions in population health impact',
  },
  {
    id: 'education_foundation',
    statement: 'Foundational education strongly predicts long-term outcomes',
    statement_sv: 'Grundläggande utbildning förutsäger starkt långsiktiga utfall',
    evidence_base: { systematic_reviews: 85, meta_analyses: 42, consensus_reports: 18, total_studies: 1800 },
    consistency: 'very_high',
    key_sources: ['UNESCO', 'OECD PISA', 'Heckman early childhood research'],
    domain: 'education_competence',
    observed_relationship: 'Early and foundational education has stronger long-term effects than later interventions',
  },
  {
    id: 'extreme_inequality',
    statement: 'Extreme inequality correlates with negative outcomes across domains',
    statement_sv: 'Extrem ojämlikhet korrelerar med negativa utfall över domäner',
    evidence_base: { systematic_reviews: 55, meta_analyses: 28, consensus_reports: 15, total_studies: 920 },
    consistency: 'high',
    key_sources: ['World Inequality Lab', 'Piketty', 'Wilkinson & Pickett'],
    domain: 'economy',
    observed_relationship: 'High inequality associated with health problems, reduced trust, and lower social mobility',
  },
  {
    id: 'ecosystem_function',
    statement: 'Functioning ecosystems underpin multiple human welfare dimensions',
    statement_sv: 'Fungerande ekosystem underbygger flera mänskliga välfärdsdimensioner',
    evidence_base: { systematic_reviews: 65, meta_analyses: 31, consensus_reports: 20, total_studies: 1100 },
    consistency: 'very_high',
    key_sources: ['IPBES', 'Millennium Ecosystem Assessment', 'IPCC'],
    domain: 'climate_environment',
    observed_relationship: 'Ecosystem services directly support food security, water availability, climate stability, and health',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK KE — SINGLE PAGE ANSWER
// ═══════════════════════════════════════════════════════════════

export interface SinglePageAnswer {
  question: string;
  question_sv: string;
  
  short_answer: string;
  short_answer_sv: string;
  
  actions: Array<{
    id: string;
    label: string;
    label_sv: string;
    destination: string;
  }>;
  
  last_updated: string;
  
  disclaimer: string;
  disclaimer_sv: string;
}

export const HOMEPAGE_ANSWER_CONFIG: SinglePageAnswer = {
  question: 'What matters most right now?',
  question_sv: 'Vad är viktigast just nu?',
  
  short_answer: 'Aggregated open data indicates that energy systems, demography, health, and institutional capacity currently have the greatest combined impact globally. How this manifests varies significantly between regions.',
  short_answer_sv: 'Den samlade öppna datan pekar på att energisystem, demografi, hälsa och institutionell kapacitet just nu har störst samlad påverkan globalt. Hur detta yttrar sig varierar kraftigt mellan regioner.',
  
  actions: [
    { id: 'global_analysis', label: 'Show global analysis', label_sv: 'Visa global analys', destination: '/global/priority-synthesis' },
    { id: 'my_country', label: 'Show for my country', label_sv: 'Visa för mitt land', destination: '/country/priority-synthesis' },
    { id: 'scientific_basis', label: 'Show scientific basis', label_sv: 'Visa vetenskapligt underlag', destination: '/science/consensus' },
    { id: 'uncertainties', label: 'Show uncertainties', label_sv: 'Visa osäkerheter', destination: '/methodology/uncertainties' },
  ],
  
  last_updated: new Date().toISOString(),
  
  disclaimer: 'This is not a recommendation. It is a compilation of observed impact.',
  disclaimer_sv: 'Detta är inte en rekommendation. Det är en sammanställning av observerad påverkan.',
};

// ═══════════════════════════════════════════════════════════════
// BLOCK KF — PROTECTION MECHANISMS
// ═══════════════════════════════════════════════════════════════

export const PROTECTION_MECHANISMS = {
  always_display: {
    uncertainty: {
      required: true,
      format: 'confidence_interval_or_qualitative',
    },
    alternative_rankings: {
      required: true,
      show_top_n_alternatives: 3,
    },
    methodology_choices: {
      required: true,
      link_to_full_methodology: true,
    },
  },
  
  mandatory_disclaimer: {
    text: 'This is not a recommendation. It is a compilation of observed impact.',
    text_sv: 'Detta är inte en rekommendation. Det är en sammanställning av observerad påverkan.',
    display: 'always_visible',
    position: 'top_and_bottom',
  },
  
  forbidden_language: [
    'should',
    'must',
    'need to',
    'have to',
    'recommend',
    'advise',
    'bör',
    'måste',
    'rekommenderar',
    'föreslår',
  ],
  
  required_qualifiers: [
    'according to data',
    'based on observed patterns',
    'the data indicates',
    'measurements show',
    'enligt data',
    'baserat på observerade mönster',
    'datan indikerar',
    'mätningar visar',
  ],
  
  anti_normative_checks: [
    { check: 'no_value_judgments', enforcement: 'block' },
    { check: 'no_policy_recommendations', enforcement: 'block' },
    { check: 'no_comparative_value_statements', enforcement: 'block' },
    { check: 'uncertainty_always_shown', enforcement: 'require' },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════
// CALCULATION HELPERS
// ═══════════════════════════════════════════════════════════════

export function calculateWeightedImpact(scores: ImpactProfile['scores']): number {
  let total = 0;
  for (const dim of IMPACT_DIMENSIONS) {
    const score = scores[dim.id as keyof typeof scores];
    if (typeof score === 'number') {
      total += score * dim.weight;
    }
  }
  return Math.round(total * 100) / 100;
}

export function rankFactors(factors: ImpactProfile[]): ImpactProfile[] {
  return [...factors].sort((a, b) => b.weighted_total - a.weighted_total);
}

export function calculatePerceptionGap(
  attention: number,
  impact: number
): { gap: number; direction: 'overexposed' | 'underexposed' | 'aligned' } {
  const gap = attention - impact;
  const direction = gap > 0.2 ? 'overexposed' : gap < -0.2 ? 'underexposed' : 'aligned';
  return { gap, direction };
}

export function validateLanguage(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  for (const forbidden of PROTECTION_MECHANISMS.forbidden_language) {
    if (text.toLowerCase().includes(forbidden.toLowerCase())) {
      violations.push(`Forbidden term: "${forbidden}"`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const GLOBAL_PRIORITY_SYNTHESIS_SYSTEM = {
  name: 'Global Priority Synthesis Engine',
  module: 'What Matters Most Right Now?',
  version: '1.0',
  
  core_principle: CORE_PRINCIPLE,
  system_question: SYSTEM_QUESTION,
  
  blocks: {
    KA: 'Global Priority Synthesis Engine',
    KB: 'Global Top Issues (Descriptive)',
    KC: 'Regional & National Breakdown',
    KD: 'Science Meta-Synthesis',
    KE: 'Single Page Answer',
    KF: 'Protection Mechanisms',
  },
  
  data_sources: Object.keys(INPUT_SOURCES).length,
  impact_dimensions: IMPACT_DIMENSIONS.length,
  
  achievements: {
    answered_what_matters_without_opinion: true,
    global_orientation_point: true,
    debate_comparable_to_reality: true,
    daily_updatable: true,
  },
  
  next_modules: [
    { name: 'Global Blind Spot Detector', description: 'Vad borde vara högt men syns inte alls?' },
    { name: 'Decision Stress Index', description: 'Var är världen mest sårbar om inget görs?' },
  ],
  
  description: 'Det här är det mänskligheten saknat.',
} as const;
