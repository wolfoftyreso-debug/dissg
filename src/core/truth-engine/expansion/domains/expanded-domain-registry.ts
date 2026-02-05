/**
 * EXPANDED DOMAIN REGISTRY
 * 
 * New categories that are highly demanded but poorly structured today.
 * Each domain maps to specific measures, sources, and answer types.
 */

/**
 * EXPANDED DOMAIN CODE
 */
export type ExpandedDomainCode = 
  // Original core domains
  | 'economy'
  | 'healthcare'
  | 'youth'
  | 'markets'
  | 'education'
  | 'labor'
  | 'housing'
  | 'crime'
  | 'environment'
  | 'migration'
  | 'society'
  | 'substance_use'
  | 'medicine'
  
  // NEW: Cognitive & Mental Load
  | 'cognitive_load'
  | 'mental_health'
  | 'stress'
  | 'sleep'
  | 'digital_wellness'
  
  // NEW: Biology & Lifestyle (population-level)
  | 'physical_activity'
  | 'nutrition'
  | 'metabolic_health'
  | 'aging'
  | 'sedentary'
  
  // NEW: School & Performance
  | 'school_stress'
  | 'grade_inflation'
  | 'teacher_density'
  | 'school_segregation'
  | 'knowledge_development'
  
  // NEW: Local Community
  | 'local_safety'
  | 'service_access'
  | 'public_transport'
  | 'care_proximity'
  | 'housing_quality'
  
  // NEW: Healthcare Outcomes
  | 'readmissions'
  | 'treatment_frequency'
  | 'regional_care_variance'
  | 'wait_time_variance'
  | 'care_outcomes'
;

/**
 * DOMAIN CATEGORY
 */
export type DomainCategory = 
  | 'economic'
  | 'health'
  | 'social'
  | 'environmental'
  | 'institutional'
  | 'cognitive'
  | 'local';

/**
 * EXPANDED DOMAIN DEFINITION
 */
export interface ExpandedDomainDefinition {
  readonly code: ExpandedDomainCode;
  readonly name: string;
  readonly name_sv: string;
  readonly description: string;
  readonly category: DomainCategory;
  readonly key_measures: readonly string[];
  readonly primary_sources: readonly string[];
  readonly related_domains: readonly ExpandedDomainCode[];
  readonly coverage_tier: 1 | 2 | 3;
  readonly is_new: boolean;
  readonly ai_agent_value: 'high' | 'very_high' | 'exceptional';
}

/**
 * EXPANDED DOMAIN REGISTRY
 */
export const EXPANDED_DOMAIN_REGISTRY: Record<ExpandedDomainCode, ExpandedDomainDefinition> = {
  // ========== ORIGINAL DOMAINS ==========
  economy: {
    code: 'economy',
    name: 'Economy',
    name_sv: 'Ekonomi',
    description: 'Macroeconomic indicators and financial stability',
    category: 'economic',
    key_measures: ['gdp_growth', 'inflation', 'unemployment', 'interest_rate'],
    primary_sources: ['eurostat', 'world_bank', 'central_bank', 'oecd'],
    related_domains: ['labor', 'markets', 'housing'],
    coverage_tier: 1,
    is_new: false,
    ai_agent_value: 'exceptional',
  },
  healthcare: {
    code: 'healthcare',
    name: 'Healthcare',
    name_sv: 'Sjukvård',
    description: 'Health system capacity and population health',
    category: 'health',
    key_measures: ['wait_times', 'bed_occupancy', 'life_expectancy'],
    primary_sources: ['who', 'national_health', 'eurostat'],
    related_domains: ['mental_health', 'care_outcomes', 'medicine'],
    coverage_tier: 1,
    is_new: false,
    ai_agent_value: 'exceptional',
  },
  youth: {
    code: 'youth',
    name: 'Youth',
    name_sv: 'Ungdom',
    description: 'Youth wellbeing and development indicators',
    category: 'social',
    key_measures: ['youth_mental_health', 'education_outcomes', 'youth_employment'],
    primary_sources: ['national_statistics', 'school_surveys'],
    related_domains: ['education', 'mental_health', 'school_stress'],
    coverage_tier: 1,
    is_new: false,
    ai_agent_value: 'exceptional',
  },
  markets: {
    code: 'markets',
    name: 'Markets',
    name_sv: 'Marknader',
    description: 'Financial market indicators and volatility',
    category: 'economic',
    key_measures: ['index_volatility', 'trading_volume', 'market_cap'],
    primary_sources: ['central_bank', 'stock_exchanges'],
    related_domains: ['economy'],
    coverage_tier: 1,
    is_new: false,
    ai_agent_value: 'exceptional',
  },
  education: {
    code: 'education',
    name: 'Education',
    name_sv: 'Utbildning',
    description: 'Educational attainment and system performance',
    category: 'social',
    key_measures: ['literacy_rate', 'graduation_rate', 'pisa_scores'],
    primary_sources: ['oecd', 'national_education'],
    related_domains: ['youth', 'knowledge_development', 'teacher_density'],
    coverage_tier: 1,
    is_new: false,
    ai_agent_value: 'very_high',
  },
  labor: {
    code: 'labor',
    name: 'Labor',
    name_sv: 'Arbetsmarknad',
    description: 'Employment and labor market dynamics',
    category: 'economic',
    key_measures: ['employment_rate', 'wage_growth', 'labor_participation'],
    primary_sources: ['eurostat', 'national_statistics'],
    related_domains: ['economy', 'stress'],
    coverage_tier: 1,
    is_new: false,
    ai_agent_value: 'very_high',
  },
  housing: {
    code: 'housing',
    name: 'Housing',
    name_sv: 'Bostad',
    description: 'Housing market and affordability',
    category: 'economic',
    key_measures: ['housing_prices', 'rent_index', 'construction_starts'],
    primary_sources: ['national_statistics', 'central_bank'],
    related_domains: ['economy', 'housing_quality'],
    coverage_tier: 1,
    is_new: false,
    ai_agent_value: 'very_high',
  },
  crime: {
    code: 'crime',
    name: 'Crime',
    name_sv: 'Brottslighet',
    description: 'Crime rates and public safety',
    category: 'social',
    key_measures: ['crime_rate', 'clearance_rate', 'incarceration_rate'],
    primary_sources: ['police_statistics', 'justice_ministry'],
    related_domains: ['local_safety', 'society'],
    coverage_tier: 2,
    is_new: false,
    ai_agent_value: 'very_high',
  },
  environment: {
    code: 'environment',
    name: 'Environment',
    name_sv: 'Miljö',
    description: 'Environmental quality and climate indicators',
    category: 'environmental',
    key_measures: ['emissions', 'air_quality', 'temperature_anomaly'],
    primary_sources: ['environment_agency', 'ipcc', 'national_weather'],
    related_domains: ['aging'],
    coverage_tier: 1,
    is_new: false,
    ai_agent_value: 'exceptional',
  },
  migration: {
    code: 'migration',
    name: 'Migration',
    name_sv: 'Migration',
    description: 'Population movement and immigration',
    category: 'social',
    key_measures: ['net_migration', 'refugee_applications', 'integration_index'],
    primary_sources: ['migration_agency', 'eurostat'],
    related_domains: ['society', 'labor'],
    coverage_tier: 2,
    is_new: false,
    ai_agent_value: 'very_high',
  },
  society: {
    code: 'society',
    name: 'Society',
    name_sv: 'Samhälle',
    description: 'Demographic and social cohesion indicators',
    category: 'social',
    key_measures: ['population_growth', 'fertility_rate', 'trust_index'],
    primary_sources: ['national_statistics', 'eurobarometer'],
    related_domains: ['migration', 'local_safety'],
    coverage_tier: 1,
    is_new: false,
    ai_agent_value: 'very_high',
  },
  substance_use: {
    code: 'substance_use',
    name: 'Substance Use',
    name_sv: 'Substansbruk',
    description: 'Drug and alcohol consumption patterns',
    category: 'health',
    key_measures: ['alcohol_consumption', 'drug_overdoses', 'treatment_admissions'],
    primary_sources: ['health_surveys', 'police_statistics'],
    related_domains: ['mental_health', 'healthcare'],
    coverage_tier: 2,
    is_new: false,
    ai_agent_value: 'high',
  },
  medicine: {
    code: 'medicine',
    name: 'Medicine',
    name_sv: 'Medicin',
    description: 'Pharmaceutical and treatment data',
    category: 'health',
    key_measures: ['prescription_rates', 'drug_approvals', 'treatment_efficacy'],
    primary_sources: ['drug_agency', 'health_registry'],
    related_domains: ['healthcare', 'care_outcomes'],
    coverage_tier: 2,
    is_new: false,
    ai_agent_value: 'high',
  },
  
  // ========== NEW: COGNITIVE & MENTAL LOAD ==========
  cognitive_load: {
    code: 'cognitive_load',
    name: 'Cognitive Load',
    name_sv: 'Kognitiv belastning',
    description: 'Mental burden and cognitive capacity indicators',
    category: 'cognitive',
    key_measures: ['concentration_issues', 'decision_fatigue', 'information_overload'],
    primary_sources: ['health_surveys', 'work_environment_studies'],
    related_domains: ['stress', 'digital_wellness', 'mental_health'],
    coverage_tier: 3,
    is_new: true,
    ai_agent_value: 'exceptional',
  },
  mental_health: {
    code: 'mental_health',
    name: 'Mental Health',
    name_sv: 'Psykisk hälsa',
    description: 'Population mental health prevalence',
    category: 'health',
    key_measures: ['anxiety_prevalence', 'depression_prevalence', 'psychiatric_admissions'],
    primary_sources: ['who', 'national_health', 'health_surveys'],
    related_domains: ['stress', 'youth', 'healthcare'],
    coverage_tier: 1,
    is_new: true,
    ai_agent_value: 'exceptional',
  },
  stress: {
    code: 'stress',
    name: 'Stress',
    name_sv: 'Stress',
    description: 'Stress and burnout indicators',
    category: 'cognitive',
    key_measures: ['sick_leave_rate', 'burnout_prevalence', 'stress_index'],
    primary_sources: ['insurance_data', 'work_environment_authority'],
    related_domains: ['mental_health', 'labor', 'cognitive_load'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'exceptional',
  },
  sleep: {
    code: 'sleep',
    name: 'Sleep',
    name_sv: 'Sömn',
    description: 'Sleep patterns and disorders',
    category: 'health',
    key_measures: ['sleep_deprivation', 'insomnia_prevalence', 'sleep_quality'],
    primary_sources: ['health_surveys', 'sleep_research'],
    related_domains: ['mental_health', 'stress', 'youth'],
    coverage_tier: 3,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  digital_wellness: {
    code: 'digital_wellness',
    name: 'Digital Wellness',
    name_sv: 'Digital hälsa',
    description: 'Screen time and digital overstimulation',
    category: 'cognitive',
    key_measures: ['screen_time', 'social_media_usage', 'digital_fatigue'],
    primary_sources: ['youth_surveys', 'media_research'],
    related_domains: ['cognitive_load', 'youth', 'mental_health'],
    coverage_tier: 3,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  
  // ========== NEW: BIOLOGY & LIFESTYLE ==========
  physical_activity: {
    code: 'physical_activity',
    name: 'Physical Activity',
    name_sv: 'Fysisk aktivitet',
    description: 'Population physical activity levels',
    category: 'health',
    key_measures: ['activity_level', 'exercise_frequency', 'sport_participation'],
    primary_sources: ['health_surveys', 'who'],
    related_domains: ['sedentary', 'metabolic_health'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'high',
  },
  nutrition: {
    code: 'nutrition',
    name: 'Nutrition',
    name_sv: 'Näring',
    description: 'Dietary patterns and food consumption',
    category: 'health',
    key_measures: ['calorie_intake', 'fruit_vegetable_consumption', 'processed_food'],
    primary_sources: ['food_agency', 'health_surveys'],
    related_domains: ['metabolic_health', 'physical_activity'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'high',
  },
  metabolic_health: {
    code: 'metabolic_health',
    name: 'Metabolic Health',
    name_sv: 'Metabol hälsa',
    description: 'Metabolic indicators at population level',
    category: 'health',
    key_measures: ['obesity_rate', 'diabetes_prevalence', 'hypertension_rate'],
    primary_sources: ['who', 'national_health'],
    related_domains: ['nutrition', 'physical_activity', 'healthcare'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  aging: {
    code: 'aging',
    name: 'Aging',
    name_sv: 'Åldrande',
    description: 'Population aging and longevity indicators',
    category: 'health',
    key_measures: ['median_age', 'dependency_ratio', 'healthy_life_years'],
    primary_sources: ['eurostat', 'national_statistics'],
    related_domains: ['healthcare', 'society'],
    coverage_tier: 1,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  sedentary: {
    code: 'sedentary',
    name: 'Sedentary Behavior',
    name_sv: 'Stillasittande',
    description: 'Inactivity and sitting time',
    category: 'health',
    key_measures: ['sedentary_hours', 'desk_work_prevalence', 'car_dependency'],
    primary_sources: ['health_surveys', 'transport_data'],
    related_domains: ['physical_activity', 'metabolic_health'],
    coverage_tier: 3,
    is_new: true,
    ai_agent_value: 'high',
  },
  
  // ========== NEW: SCHOOL & PERFORMANCE ==========
  school_stress: {
    code: 'school_stress',
    name: 'School Stress',
    name_sv: 'Skolstress',
    description: 'Academic pressure and student wellbeing',
    category: 'social',
    key_measures: ['student_stress', 'homework_load', 'performance_anxiety'],
    primary_sources: ['school_surveys', 'education_agency'],
    related_domains: ['youth', 'education', 'mental_health'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  grade_inflation: {
    code: 'grade_inflation',
    name: 'Grade Inflation',
    name_sv: 'Betygsinflation',
    description: 'Grade trends and assessment quality',
    category: 'social',
    key_measures: ['grade_average', 'grade_trend', 'assessment_validity'],
    primary_sources: ['education_agency', 'school_statistics'],
    related_domains: ['education', 'knowledge_development'],
    coverage_tier: 3,
    is_new: true,
    ai_agent_value: 'exceptional',
  },
  teacher_density: {
    code: 'teacher_density',
    name: 'Teacher Density',
    name_sv: 'Lärartäthet',
    description: 'Teaching resources and class sizes',
    category: 'social',
    key_measures: ['students_per_teacher', 'teacher_turnover', 'qualified_teachers'],
    primary_sources: ['education_agency', 'school_statistics'],
    related_domains: ['education', 'school_stress'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'high',
  },
  school_segregation: {
    code: 'school_segregation',
    name: 'School Segregation',
    name_sv: 'Skolsegregation',
    description: 'Educational segregation patterns',
    category: 'social',
    key_measures: ['segregation_index', 'school_choice_patterns', 'socioeconomic_mix'],
    primary_sources: ['education_agency', 'national_statistics'],
    related_domains: ['education', 'society'],
    coverage_tier: 3,
    is_new: true,
    ai_agent_value: 'exceptional',
  },
  knowledge_development: {
    code: 'knowledge_development',
    name: 'Knowledge Development',
    name_sv: 'Kunskapsutveckling',
    description: 'Learning outcomes and skill acquisition',
    category: 'social',
    key_measures: ['reading_level', 'math_proficiency', 'critical_thinking'],
    primary_sources: ['pisa', 'national_tests'],
    related_domains: ['education', 'grade_inflation'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  
  // ========== NEW: LOCAL COMMUNITY ==========
  local_safety: {
    code: 'local_safety',
    name: 'Local Safety',
    name_sv: 'Lokal trygghet',
    description: 'Neighborhood safety and security',
    category: 'local',
    key_measures: ['perceived_safety', 'local_crime_rate', 'lighting_coverage'],
    primary_sources: ['police_statistics', 'citizen_surveys'],
    related_domains: ['crime', 'housing_quality'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  service_access: {
    code: 'service_access',
    name: 'Service Access',
    name_sv: 'Serviceåtkomst',
    description: 'Access to public and private services',
    category: 'local',
    key_measures: ['service_distance', 'service_density', 'digital_service_access'],
    primary_sources: ['municipal_data', 'mapping_services'],
    related_domains: ['public_transport', 'care_proximity'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'high',
  },
  public_transport: {
    code: 'public_transport',
    name: 'Public Transport',
    name_sv: 'Kollektivtrafik',
    description: 'Public transportation availability and quality',
    category: 'local',
    key_measures: ['transit_coverage', 'frequency', 'reliability'],
    primary_sources: ['transport_authorities', 'municipal_data'],
    related_domains: ['service_access', 'environment'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'high',
  },
  care_proximity: {
    code: 'care_proximity',
    name: 'Care Proximity',
    name_sv: 'Vårdnärhet',
    description: 'Distance to healthcare services',
    category: 'local',
    key_measures: ['hospital_distance', 'gp_availability', 'emergency_response_time'],
    primary_sources: ['health_registry', 'emergency_services'],
    related_domains: ['healthcare', 'service_access'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  housing_quality: {
    code: 'housing_quality',
    name: 'Housing Quality',
    name_sv: 'Boendekvalitet',
    description: 'Living conditions and housing standards',
    category: 'local',
    key_measures: ['overcrowding', 'housing_standards', 'energy_efficiency'],
    primary_sources: ['housing_surveys', 'building_registry'],
    related_domains: ['housing', 'local_safety'],
    coverage_tier: 3,
    is_new: true,
    ai_agent_value: 'high',
  },
  
  // ========== NEW: HEALTHCARE OUTCOMES ==========
  readmissions: {
    code: 'readmissions',
    name: 'Readmissions',
    name_sv: 'Återinläggningar',
    description: 'Hospital readmission rates',
    category: 'health',
    key_measures: ['readmission_rate', 'readmission_causes', 'time_to_readmission'],
    primary_sources: ['patient_registry', 'hospital_statistics'],
    related_domains: ['healthcare', 'care_outcomes'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  treatment_frequency: {
    code: 'treatment_frequency',
    name: 'Treatment Frequency',
    name_sv: 'Behandlingsfrekvens',
    description: 'Medical treatment patterns',
    category: 'health',
    key_measures: ['procedure_rates', 'treatment_variation', 'intervention_frequency'],
    primary_sources: ['patient_registry', 'drug_registry'],
    related_domains: ['healthcare', 'medicine'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  regional_care_variance: {
    code: 'regional_care_variance',
    name: 'Regional Care Variance',
    name_sv: 'Regionala vårdskillnader',
    description: 'Geographic variation in healthcare',
    category: 'health',
    key_measures: ['care_variation', 'outcome_disparity', 'resource_distribution'],
    primary_sources: ['quality_registry', 'health_board_data'],
    related_domains: ['healthcare', 'care_outcomes'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'exceptional',
  },
  wait_time_variance: {
    code: 'wait_time_variance',
    name: 'Wait Time Variance',
    name_sv: 'Väntetidsvariation',
    description: 'Variation in healthcare waiting times',
    category: 'health',
    key_measures: ['wait_time_std', 'wait_time_range', 'wait_time_trend'],
    primary_sources: ['health_board_data', 'queue_statistics'],
    related_domains: ['healthcare'],
    coverage_tier: 2,
    is_new: true,
    ai_agent_value: 'very_high',
  },
  care_outcomes: {
    code: 'care_outcomes',
    name: 'Care Outcomes',
    name_sv: 'Vårdutfall',
    description: 'Healthcare treatment outcomes (population level)',
    category: 'health',
    key_measures: ['survival_rates', 'complication_rates', 'patient_outcomes'],
    primary_sources: ['quality_registry', 'patient_registry'],
    related_domains: ['healthcare', 'medicine', 'readmissions'],
    coverage_tier: 1,
    is_new: true,
    ai_agent_value: 'exceptional',
  },
};

/**
 * Get all new domains
 */
export function getNewDomains(): readonly ExpandedDomainDefinition[] {
  return Object.values(EXPANDED_DOMAIN_REGISTRY).filter(d => d.is_new);
}

/**
 * Get domains by category
 */
export function getDomainsByCategory(category: DomainCategory): readonly ExpandedDomainDefinition[] {
  return Object.values(EXPANDED_DOMAIN_REGISTRY).filter(d => d.category === category);
}

/**
 * Get high-value domains for AI agents
 */
export function getHighValueDomains(): readonly ExpandedDomainDefinition[] {
  return Object.values(EXPANDED_DOMAIN_REGISTRY).filter(
    d => d.ai_agent_value === 'exceptional' || d.ai_agent_value === 'very_high'
  );
}

/**
 * Domain expansion stats
 */
export function getDomainExpansionStats() {
  const all = Object.values(EXPANDED_DOMAIN_REGISTRY);
  return {
    total_domains: all.length,
    new_domains: all.filter(d => d.is_new).length,
    by_category: {
      economic: all.filter(d => d.category === 'economic').length,
      health: all.filter(d => d.category === 'health').length,
      social: all.filter(d => d.category === 'social').length,
      environmental: all.filter(d => d.category === 'environmental').length,
      institutional: all.filter(d => d.category === 'institutional').length,
      cognitive: all.filter(d => d.category === 'cognitive').length,
      local: all.filter(d => d.category === 'local').length,
    },
    by_tier: {
      tier_1: all.filter(d => d.coverage_tier === 1).length,
      tier_2: all.filter(d => d.coverage_tier === 2).length,
      tier_3: all.filter(d => d.coverage_tier === 3).length,
    },
    by_ai_value: {
      exceptional: all.filter(d => d.ai_agent_value === 'exceptional').length,
      very_high: all.filter(d => d.ai_agent_value === 'very_high').length,
      high: all.filter(d => d.ai_agent_value === 'high').length,
    },
  };
}
