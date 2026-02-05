/**
 * DATA SOURCE REGISTRY
 * 
 * All official, operational, sensor, and platform data sources.
 */

/**
 * DATA SOURCE TYPE
 */
export type DataSourceType = 
  // A. Official & Semi-official
  | 'statistical_authority'
  | 'central_bank'
  | 'regulator'
  | 'international_org'
  | 'public_register'
  
  // B. Operational Systems (aggregates)
  | 'hospital_stats'
  | 'school_stats'
  | 'transport_system'
  | 'energy_grid'
  | 'employment_office'
  
  // C. Sensor & Flow Data (aggregated)
  | 'traffic_flow'
  | 'energy_consumption'
  | 'mobility_data'
  | 'environmental_sensor'
  | 'weather_extreme'
  
  // D. Platform Signals (meta)
  | 'search_trends'
  | 'api_usage'
  | 'reporting_frequency'
  | 'authority_update_rate';

/**
 * DATA SOURCE DEFINITION
 */
export interface DataSourceDefinition {
  readonly source_id: string;
  readonly name: string;
  readonly type: DataSourceType;
  readonly tier: 1 | 2 | 3;
  readonly geographic_scope: 'global' | 'regional' | 'national' | 'local';
  readonly domains_served: readonly string[];
  readonly update_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  readonly api_available: boolean;
  readonly requires_agreement: boolean;
  readonly data_quality_score: number; // 0-1
  readonly documentation_url?: string;
}

/**
 * DATA SOURCE REGISTRY
 */
export const DATA_SOURCE_REGISTRY: Record<string, DataSourceDefinition> = {
  // ========== A. OFFICIAL & SEMI-OFFICIAL ==========
  eurostat: {
    source_id: 'eurostat',
    name: 'Eurostat',
    type: 'statistical_authority',
    tier: 1,
    geographic_scope: 'regional',
    domains_served: ['economy', 'labor', 'society', 'environment', 'education'],
    update_frequency: 'monthly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.95,
    documentation_url: 'https://ec.europa.eu/eurostat/web/main/data/database',
  },
  world_bank: {
    source_id: 'world_bank',
    name: 'World Bank',
    type: 'international_org',
    tier: 1,
    geographic_scope: 'global',
    domains_served: ['economy', 'education', 'healthcare', 'society'],
    update_frequency: 'yearly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.92,
    documentation_url: 'https://data.worldbank.org/',
  },
  who: {
    source_id: 'who',
    name: 'World Health Organization',
    type: 'international_org',
    tier: 1,
    geographic_scope: 'global',
    domains_served: ['healthcare', 'mental_health', 'youth', 'metabolic_health'],
    update_frequency: 'yearly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.93,
    documentation_url: 'https://www.who.int/data',
  },
  oecd: {
    source_id: 'oecd',
    name: 'OECD',
    type: 'international_org',
    tier: 1,
    geographic_scope: 'regional',
    domains_served: ['economy', 'education', 'healthcare', 'labor'],
    update_frequency: 'monthly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.94,
    documentation_url: 'https://data.oecd.org/',
  },
  imf: {
    source_id: 'imf',
    name: 'International Monetary Fund',
    type: 'international_org',
    tier: 1,
    geographic_scope: 'global',
    domains_served: ['economy', 'markets'],
    update_frequency: 'monthly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.94,
  },
  
  // National Statistics Offices
  scb: {
    source_id: 'scb',
    name: 'Statistics Sweden (SCB)',
    type: 'statistical_authority',
    tier: 1,
    geographic_scope: 'national',
    domains_served: ['economy', 'labor', 'housing', 'society', 'education', 'crime'],
    update_frequency: 'monthly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.96,
    documentation_url: 'https://www.scb.se/en/',
  },
  destatis: {
    source_id: 'destatis',
    name: 'Destatis (Germany)',
    type: 'statistical_authority',
    tier: 1,
    geographic_scope: 'national',
    domains_served: ['economy', 'labor', 'housing', 'society'],
    update_frequency: 'monthly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.95,
  },
  ons: {
    source_id: 'ons',
    name: 'Office for National Statistics (UK)',
    type: 'statistical_authority',
    tier: 1,
    geographic_scope: 'national',
    domains_served: ['economy', 'labor', 'housing', 'society', 'healthcare'],
    update_frequency: 'monthly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.95,
  },
  
  // Central Banks
  ecb: {
    source_id: 'ecb',
    name: 'European Central Bank',
    type: 'central_bank',
    tier: 1,
    geographic_scope: 'regional',
    domains_served: ['economy', 'markets', 'housing'],
    update_frequency: 'daily',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.97,
  },
  fed: {
    source_id: 'fed',
    name: 'Federal Reserve',
    type: 'central_bank',
    tier: 1,
    geographic_scope: 'national',
    domains_served: ['economy', 'markets'],
    update_frequency: 'daily',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.97,
  },
  
  // ========== B. OPERATIONAL SYSTEMS ==========
  hospital_registry: {
    source_id: 'hospital_registry',
    name: 'National Hospital Registry',
    type: 'hospital_stats',
    tier: 2,
    geographic_scope: 'national',
    domains_served: ['healthcare', 'readmissions', 'wait_time_variance', 'care_outcomes'],
    update_frequency: 'weekly',
    api_available: false,
    requires_agreement: true,
    data_quality_score: 0.88,
  },
  school_board: {
    source_id: 'school_board',
    name: 'National School Board',
    type: 'school_stats',
    tier: 2,
    geographic_scope: 'national',
    domains_served: ['education', 'school_stress', 'teacher_density', 'grade_inflation'],
    update_frequency: 'yearly',
    api_available: false,
    requires_agreement: true,
    data_quality_score: 0.85,
  },
  transport_authority: {
    source_id: 'transport_authority',
    name: 'National Transport Authority',
    type: 'transport_system',
    tier: 2,
    geographic_scope: 'national',
    domains_served: ['public_transport', 'environment'],
    update_frequency: 'daily',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.82,
  },
  energy_authority: {
    source_id: 'energy_authority',
    name: 'Energy Market Authority',
    type: 'energy_grid',
    tier: 2,
    geographic_scope: 'national',
    domains_served: ['environment', 'economy'],
    update_frequency: 'hourly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.90,
  },
  employment_agency: {
    source_id: 'employment_agency',
    name: 'Employment Agency',
    type: 'employment_office',
    tier: 2,
    geographic_scope: 'national',
    domains_served: ['labor', 'stress'],
    update_frequency: 'weekly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.88,
  },
  
  // ========== C. SENSOR & FLOW DATA ==========
  traffic_sensors: {
    source_id: 'traffic_sensors',
    name: 'Traffic Sensor Network',
    type: 'traffic_flow',
    tier: 3,
    geographic_scope: 'local',
    domains_served: ['public_transport', 'environment'],
    update_frequency: 'realtime',
    api_available: true,
    requires_agreement: true,
    data_quality_score: 0.78,
  },
  smart_grid: {
    source_id: 'smart_grid',
    name: 'Smart Grid Data',
    type: 'energy_consumption',
    tier: 3,
    geographic_scope: 'regional',
    domains_served: ['environment', 'housing_quality'],
    update_frequency: 'hourly',
    api_available: true,
    requires_agreement: true,
    data_quality_score: 0.82,
  },
  mobility_data: {
    source_id: 'mobility_data',
    name: 'Anonymized Mobility Data',
    type: 'mobility_data',
    tier: 3,
    geographic_scope: 'national',
    domains_served: ['public_transport', 'local_safety'],
    update_frequency: 'daily',
    api_available: true,
    requires_agreement: true,
    data_quality_score: 0.75,
  },
  air_quality_network: {
    source_id: 'air_quality_network',
    name: 'Air Quality Monitoring Network',
    type: 'environmental_sensor',
    tier: 2,
    geographic_scope: 'national',
    domains_served: ['environment'],
    update_frequency: 'hourly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.88,
  },
  weather_service: {
    source_id: 'weather_service',
    name: 'National Weather Service',
    type: 'weather_extreme',
    tier: 1,
    geographic_scope: 'national',
    domains_served: ['environment'],
    update_frequency: 'hourly',
    api_available: true,
    requires_agreement: false,
    data_quality_score: 0.92,
  },
  
  // ========== D. PLATFORM SIGNALS ==========
  google_trends: {
    source_id: 'google_trends',
    name: 'Google Trends',
    type: 'search_trends',
    tier: 3,
    geographic_scope: 'global',
    domains_served: ['society', 'mental_health', 'economy'],
    update_frequency: 'daily',
    api_available: true,
    requires_agreement: true,
    data_quality_score: 0.70,
  },
  api_usage_monitor: {
    source_id: 'api_usage_monitor',
    name: 'API Usage Monitor',
    type: 'api_usage',
    tier: 3,
    geographic_scope: 'global',
    domains_served: ['digital_wellness'],
    update_frequency: 'daily',
    api_available: false,
    requires_agreement: true,
    data_quality_score: 0.65,
  },
  authority_tracker: {
    source_id: 'authority_tracker',
    name: 'Authority Update Tracker',
    type: 'authority_update_rate',
    tier: 3,
    geographic_scope: 'national',
    domains_served: ['society'],
    update_frequency: 'daily',
    api_available: false,
    requires_agreement: false,
    data_quality_score: 0.75,
  },
};

/**
 * Get sources by type
 */
export function getSourcesByType(type: DataSourceType): readonly DataSourceDefinition[] {
  return Object.values(DATA_SOURCE_REGISTRY).filter(s => s.type === type);
}

/**
 * Get sources by tier
 */
export function getSourcesByTier(tier: 1 | 2 | 3): readonly DataSourceDefinition[] {
  return Object.values(DATA_SOURCE_REGISTRY).filter(s => s.tier === tier);
}

/**
 * Get sources for domain
 */
export function getSourcesForDomain(domain: string): readonly DataSourceDefinition[] {
  return Object.values(DATA_SOURCE_REGISTRY).filter(s => s.domains_served.includes(domain));
}

/**
 * Source registry stats
 */
export function getSourceRegistryStats() {
  const all = Object.values(DATA_SOURCE_REGISTRY);
  return {
    total_sources: all.length,
    by_tier: {
      tier_1: all.filter(s => s.tier === 1).length,
      tier_2: all.filter(s => s.tier === 2).length,
      tier_3: all.filter(s => s.tier === 3).length,
    },
    by_type: {
      official: all.filter(s => ['statistical_authority', 'central_bank', 'international_org', 'regulator', 'public_register'].includes(s.type)).length,
      operational: all.filter(s => ['hospital_stats', 'school_stats', 'transport_system', 'energy_grid', 'employment_office'].includes(s.type)).length,
      sensor: all.filter(s => ['traffic_flow', 'energy_consumption', 'mobility_data', 'environmental_sensor', 'weather_extreme'].includes(s.type)).length,
      platform: all.filter(s => ['search_trends', 'api_usage', 'reporting_frequency', 'authority_update_rate'].includes(s.type)).length,
    },
    api_available: all.filter(s => s.api_available).length,
    average_quality: all.reduce((sum, s) => sum + s.data_quality_score, 0) / all.length,
  };
}
