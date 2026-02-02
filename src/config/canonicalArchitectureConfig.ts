/**
 * Block 58: Canonical Backend Architecture Configuration
 * 
 * Live Data, Auto-Discovery, No Hardcode
 * This is the machine room configuration.
 */

// ============================================
// ARCHITECTURE LAYERS
// ============================================

export const ARCHITECTURE_LAYERS = [
  'ingestion',      // Data enters
  'validation',     // Schema & contract check
  'canonical_store', // Immutable storage
  'aggregation',    // Statistical processing
  'fact_builder',   // Fact/Indicator/Question generation
  'api_html_cite',  // Public exposure
] as const;

export type ArchitectureLayer = typeof ARCHITECTURE_LAYERS[number];

// ============================================
// DATA CONTRACT (MANDATORY)
// ============================================

export interface DataContract {
  source_id: string;
  source_type: 'api' | 'dataset' | 'feed';
  update_frequency: string;
  temporal_coverage: {
    start: string;
    end: string;
  };
  geographic_coverage: string[];
  method: 'observed' | 'estimated';
  uncertainty: 'low' | 'medium' | 'high';
  license: 'open';
  last_verified: string; // ISO-8601
}

export const DATA_CONTRACT_REQUIRED_FIELDS = [
  'source_id',
  'source_type',
  'update_frequency',
  'temporal_coverage',
  'geographic_coverage',
  'method',
  'uncertainty',
  'license',
  'last_verified',
] as const;

// ============================================
// GEO LEVELS (HIERARCHICAL)
// ============================================

export const GEO_LEVELS = {
  global: { level: 0, name: 'Global', parent: null },
  bloc: { level: 1, name: 'Bloc/Region', parent: 'global' },
  country: { level: 2, name: 'Country', parent: 'bloc' },
  region: { level: 3, name: 'Region/State', parent: 'country' },
  municipality: { level: 4, name: 'Municipality', parent: 'region' },
} as const;

export type GeoLevel = keyof typeof GEO_LEVELS;

// ============================================
// RENDERING STATES (EXACTLY 3)
// ============================================

export const RENDERING_STATES = {
  live: {
    code: 'LIVE',
    action: 'render',
    description: 'Live data available',
  },
  unavailable: {
    code: 'UNAVAILABLE',
    action: 'fallback',
    description: 'Data temporarily unavailable',
  },
  not_supported: {
    code: 'NOT_SUPPORTED',
    action: 'hide',
    description: 'Data not supported yet',
  },
} as const;

export type RenderingState = keyof typeof RENDERING_STATES;

// ============================================
// FALLBACK MESSAGE (EXACT, NO ALTERNATIVES)
// ============================================

export const CANONICAL_FALLBACK_MESSAGE = {
  en: 'This data is not currently available because the upstream source has not yet been connected or validated. The system does not estimate or simulate missing data.',
  sv: 'Denna data är för närvarande inte tillgänglig eftersom uppströmskällan ännu inte har anslutits eller validerats. Systemet uppskattar eller simulerar inte saknad data.',
} as const;

// ============================================
// AGGREGATION RULES
// ============================================

export const AGGREGATION_RULES = {
  // Aggregation must be deterministic and reproducible
  deterministic: true,
  
  // Raw data is immutable
  rawDataImmutable: true,
  
  // Aggregations are versioned
  versioned: true,
  
  // Historical outputs are never overwritten
  appendOnly: true,
  
  // Associations are allowed
  associationsAllowed: true,
  
  // Causation is never inferred
  causationNeverInferred: true,
} as const;

// ============================================
// AUTO-DISCOVERY PIPELINE STEPS
// ============================================

export const AUTO_DISCOVERY_STEPS = [
  {
    step: 1,
    name: 'validate_schema',
    description: 'Check if data conforms to expected schema',
    failAction: 'reject',
  },
  {
    step: 2,
    name: 'validate_license',
    description: 'Verify data has open license',
    failAction: 'reject',
  },
  {
    step: 3,
    name: 'validate_coverage',
    description: 'Check temporal and geographic scope',
    failAction: 'reject',
  },
  {
    step: 4,
    name: 'assign_domain',
    description: 'Map to domain and indicator',
    failAction: 'queue_manual',
  },
  {
    step: 5,
    name: 'generate_outputs',
    description: 'Create fact pages, indicator pages, sitemap entries',
    failAction: 'retry',
  },
  {
    step: 6,
    name: 'expose_publicly',
    description: 'Make available via API and HTML',
    failAction: 'retry',
  },
] as const;

// ============================================
// FACT GENERATION TEMPLATES
// ============================================

export const FACT_TEMPLATES = {
  increase: {
    en: 'Observed data indicates that {indicator_name} increased by {magnitude}% in {geo_name} during {time_range}.',
    sv: 'Observerad data indikerar att {indicator_name} ökade med {magnitude}% i {geo_name} under {time_range}.',
  },
  decrease: {
    en: 'Observed data indicates that {indicator_name} decreased by {magnitude}% in {geo_name} during {time_range}.',
    sv: 'Observerad data indikerar att {indicator_name} minskade med {magnitude}% i {geo_name} under {time_range}.',
  },
  stable: {
    en: 'Observed data indicates that {indicator_name} remained stable in {geo_name} during {time_range}.',
    sv: 'Observerad data indikerar att {indicator_name} var stabil i {geo_name} under {time_range}.',
  },
  unknown: {
    en: 'Data for {indicator_name} in {geo_name} during {time_range} shows no clear trend pattern.',
    sv: 'Data för {indicator_name} i {geo_name} under {time_range} visar inget tydligt trendmönster.',
  },
} as const;

export type TrendType = keyof typeof FACT_TEMPLATES;

// ============================================
// API ENDPOINTS (READ-ONLY)
// ============================================

export const CANONICAL_API_ENDPOINTS = {
  facts: '/api/facts',
  indicators: '/api/indicators',
  observations: '/api/observations',
  bigQuestions: '/api/big-questions',
  cite: '/cite/:fact_id',
} as const;

// ============================================
// VALIDATION FUNCTIONS
// ============================================

export function validateDataContract(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data must be an object'] };
  }
  
  const d = data as Record<string, unknown>;
  
  for (const field of DATA_CONTRACT_REQUIRED_FIELDS) {
    if (!(field in d) || d[field] === null || d[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate source_type
  if ('source_type' in d && !['api', 'dataset', 'feed'].includes(d.source_type as string)) {
    errors.push('Invalid source_type: must be api, dataset, or feed');
  }
  
  // Validate method
  if ('method' in d && !['observed', 'estimated'].includes(d.method as string)) {
    errors.push('Invalid method: must be observed or estimated');
  }
  
  // Validate uncertainty
  if ('uncertainty' in d && !['low', 'medium', 'high'].includes(d.uncertainty as string)) {
    errors.push('Invalid uncertainty: must be low, medium, or high');
  }
  
  // Validate license is open
  if ('license' in d && d.license !== 'open') {
    errors.push('License must be open');
  }
  
  return { valid: errors.length === 0, errors };
}

export function generateFactStatement(
  template: TrendType,
  variables: {
    indicator_name: string;
    geo_name: string;
    time_range: string;
    magnitude?: number;
  },
  language: 'en' | 'sv' = 'en'
): string {
  const templateObj = FACT_TEMPLATES[template];
  const templateText = templateObj[language] as string;
  
  let statement = templateText
    .replace('{indicator_name}', variables.indicator_name)
    .replace('{geo_name}', variables.geo_name)
    .replace('{time_range}', variables.time_range);
  
  if (variables.magnitude !== undefined) {
    statement = statement.replace('{magnitude}', Math.abs(variables.magnitude).toFixed(1));
  }
  
  return statement;
}

export function determineRenderingState(
  dataExists: boolean,
  schemaExists: boolean,
  sourceExists: boolean,
  uncertaintyExists: boolean
): RenderingState {
  if (dataExists && schemaExists && sourceExists && uncertaintyExists) {
    return 'live';
  }
  
  if (schemaExists && sourceExists) {
    return 'unavailable';
  }
  
  return 'not_supported';
}

// ============================================
// BLOCK 58 DONE CRITERIA
// ============================================

export const BLOCK_58_DONE_CRITERIA = [
  'New data source appears → automatically visible',
  'No developer manually adds data',
  'Frontend never needs update for new domains',
  'History is never overwritten',
  'Fallback shown rather than garbage',
] as const;
