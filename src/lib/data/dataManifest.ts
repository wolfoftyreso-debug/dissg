/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPLETE DATA AGGREGATION MANIFEST
 * Machine-Readable Data Source Registry
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * VERSION: 2.0.0
 * LAST_UPDATED: 2026-02-04
 * SCHEMA: https://schema.org/Dataset
 * 
 * This manifest defines ALL data sources the system aggregates.
 * Organized by ingestion channel per architecture specification.
 * 
 * CHANNELS:
 * ┌─────────┬────────────────────────────────────────────────────────────────────┐
 * │ CHANNEL │ DESCRIPTION                                                        │
 * ├─────────┼────────────────────────────────────────────────────────────────────┤
 * │ A       │ Official APIs (structured, verified, empirical)                   │
 * │ B       │ Semi-official/Real-time (non-empirical, flagged)                  │
 * │ C       │ Document extraction (PDFs, reports, claims)                       │
 * │ D       │ Aggregated external (pre-processed datasets)                      │
 * └─────────┴────────────────────────────────────────────────────────────────────┘
 * 
 * MACHINE-READABLE EXPORTS:
 * - toSchemaOrg(): Export as Schema.org/Dataset JSON-LD
 * - toSDMX(): Export as SDMX-ML structure
 * - validate(): Run structural validation
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// =============================================================================
// TYPE DEFINITIONS - Strict enumerated types for machine parsing
// =============================================================================

/**
 * DATA DOMAINS
 * Taxonomic classification of what is measured.
 * Maps to SDMX concept scheme.
 */
export const DATA_DOMAIN_CODES = [
  'demographics',
  'economy', 
  'health',
  'education',
  'environment',
  'governance',
  'infrastructure',
  'social',
  'security',
  'technology',
  'culture',
  'finance'
] as const;

export type DataDomain = typeof DATA_DOMAIN_CODES[number];

export const DATA_DOMAIN_LABELS: Record<DataDomain, { en: string; sv: string; sdmxCode: string }> = {
  demographics: { en: 'Demographics', sv: 'Demografi', sdmxCode: 'POP' },
  economy: { en: 'Economy', sv: 'Ekonomi', sdmxCode: 'ECO' },
  health: { en: 'Health', sv: 'Hälsa', sdmxCode: 'HLT' },
  education: { en: 'Education', sv: 'Utbildning', sdmxCode: 'EDU' },
  environment: { en: 'Environment', sv: 'Miljö & Klimat', sdmxCode: 'ENV' },
  governance: { en: 'Governance', sv: 'Styrning & Demokrati', sdmxCode: 'GOV' },
  infrastructure: { en: 'Infrastructure', sv: 'Infrastruktur', sdmxCode: 'INF' },
  social: { en: 'Social Conditions', sv: 'Sociala förhållanden', sdmxCode: 'SOC' },
  security: { en: 'Security', sv: 'Säkerhet', sdmxCode: 'SEC' },
  technology: { en: 'Technology', sv: 'Teknologi & Innovation', sdmxCode: 'TEC' },
  culture: { en: 'Culture', sv: 'Kultur & Media', sdmxCode: 'CUL' },
  finance: { en: 'Finance', sv: 'Finansmarknader', sdmxCode: 'FIN' }
};

/**
 * DATA CHANNELS
 * Ingestion pathway classification.
 */
export const DATA_CHANNEL_CODES = ['A', 'B', 'C', 'D'] as const;
export type DataChannel = typeof DATA_CHANNEL_CODES[number];

export const DATA_CHANNEL_METADATA: Record<DataChannel, {
  name: string;
  description: string;
  isEmpirical: boolean;
  trustLevel: 'high' | 'medium' | 'low';
  pipelineSteps: string[];
}> = {
  A: {
    name: 'Official Statistical APIs',
    description: 'Primary official sources - national statistics offices and international organizations',
    isEmpirical: true,
    trustLevel: 'high',
    pipelineSteps: ['fetch', 'validate_schema', 'normalize', 'version', 'publish']
  },
  B: {
    name: 'Real-time & Market Feeds',
    description: 'Semi-official and commercial real-time data streams',
    isEmpirical: false,
    trustLevel: 'medium',
    pipelineSteps: ['fetch', 'flag_non_empirical', 'validate', 'normalize', 'version', 'publish']
  },
  C: {
    name: 'Document Extraction',
    description: 'PDFs, reports, legislation - claim extraction pipeline',
    isEmpirical: true,
    trustLevel: 'medium',
    pipelineSteps: ['fetch', 'ocr', 'claim_extract', 'verify_claim', 'normalize', 'version', 'publish']
  },
  D: {
    name: 'Aggregated Datasets',
    description: 'Pre-processed academic and research datasets',
    isEmpirical: true,
    trustLevel: 'medium',
    pipelineSteps: ['fetch', 'validate_methodology', 'cross_reference', 'normalize', 'version', 'publish']
  }
};

/**
 * DATA TIERS
 * Source authority classification.
 */
export const DATA_TIER_CODES = ['tier_1', 'tier_2', 'tier_3', 'tier_4'] as const;
export type DataTier = typeof DATA_TIER_CODES[number];

export const DATA_TIER_METADATA: Record<DataTier, {
  name: string;
  description: string;
  minReliabilityScore: number;
  examples: string[];
}> = {
  tier_1: {
    name: 'Primary Official',
    description: 'National statistics offices, central banks, primary government agencies',
    minReliabilityScore: 90,
    examples: ['SCB', 'Eurostat', 'Census Bureau', 'Riksbank']
  },
  tier_2: {
    name: 'Secondary Official',
    description: 'International organizations, supranational bodies',
    minReliabilityScore: 80,
    examples: ['World Bank', 'IMF', 'WHO', 'OECD']
  },
  tier_3: {
    name: 'Academic/Research',
    description: 'Peer-reviewed research institutions and academic datasets',
    minReliabilityScore: 70,
    examples: ['Gapminder', 'Our World in Data', 'V-Dem']
  },
  tier_4: {
    name: 'Commercial/Monitored',
    description: 'Commercial providers requiring verification',
    minReliabilityScore: 50,
    examples: ['Yahoo Finance', 'Bloomberg', 'Refinitiv']
  }
};

/**
 * UPDATE FREQUENCY
 * Data refresh cadence.
 */
export const UPDATE_FREQUENCY_CODES = [
  'realtime',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'annual',
  'irregular'
] as const;

export type UpdateFrequency = typeof UPDATE_FREQUENCY_CODES[number];

export const UPDATE_FREQUENCY_METADATA: Record<UpdateFrequency, {
  maxLatencyMs: number;
  description: string;
  iso8601Duration: string;
}> = {
  realtime: { maxLatencyMs: 60000, description: '< 1 minute', iso8601Duration: 'PT1M' },
  hourly: { maxLatencyMs: 3600000, description: 'Every hour', iso8601Duration: 'PT1H' },
  daily: { maxLatencyMs: 86400000, description: 'Every day', iso8601Duration: 'P1D' },
  weekly: { maxLatencyMs: 604800000, description: 'Every week', iso8601Duration: 'P1W' },
  monthly: { maxLatencyMs: 2678400000, description: 'Every month', iso8601Duration: 'P1M' },
  quarterly: { maxLatencyMs: 7948800000, description: 'Every quarter', iso8601Duration: 'P3M' },
  annual: { maxLatencyMs: 31536000000, description: 'Every year', iso8601Duration: 'P1Y' },
  irregular: { maxLatencyMs: -1, description: 'No fixed schedule', iso8601Duration: '' }
};

/**
 * GEOGRAPHIC SCOPE
 * Spatial coverage classification.
 */
export const GEOGRAPHIC_SCOPE_CODES = [
  'global',
  'continental',
  'national',
  'subnational',
  'municipal',
  'granular'
] as const;

export type GeographicScope = typeof GEOGRAPHIC_SCOPE_CODES[number];

export const GEOGRAPHIC_SCOPE_METADATA: Record<GeographicScope, {
  nutsLevel: number | null;
  description: string;
}> = {
  global: { nutsLevel: null, description: 'Worldwide coverage' },
  continental: { nutsLevel: 0, description: 'Regional blocs (EU, ASEAN, etc.)' },
  national: { nutsLevel: 0, description: 'Country-level' },
  subnational: { nutsLevel: 2, description: 'Regions, provinces (NUTS-2)' },
  municipal: { nutsLevel: 3, description: 'Cities, municipalities (NUTS-3/LAU)' },
  granular: { nutsLevel: null, description: 'Point data, addresses' }
};

/**
 * LICENSE TYPES
 * Data usage rights classification.
 */
export const LICENSE_CODES = ['open', 'attribution', 'restricted', 'commercial'] as const;
export type LicenseType = typeof LICENSE_CODES[number];

export const LICENSE_METADATA: Record<LicenseType, {
  spdxIdentifier: string | null;
  requiresAttribution: boolean;
  allowsRedistribution: boolean;
  allowsCommercialUse: boolean;
}> = {
  open: {
    spdxIdentifier: 'CC0-1.0',
    requiresAttribution: false,
    allowsRedistribution: true,
    allowsCommercialUse: true
  },
  attribution: {
    spdxIdentifier: 'CC-BY-4.0',
    requiresAttribution: true,
    allowsRedistribution: true,
    allowsCommercialUse: true
  },
  restricted: {
    spdxIdentifier: null,
    requiresAttribution: true,
    allowsRedistribution: false,
    allowsCommercialUse: false
  },
  commercial: {
    spdxIdentifier: null,
    requiresAttribution: true,
    allowsRedistribution: false,
    allowsCommercialUse: true
  }
};

/**
 * API TYPES
 * Technical interface classification.
 */
export const API_TYPE_CODES = ['rest', 'graphql', 'sdmx', 'odata', 'bulk', 'websocket'] as const;
export type ApiType = typeof API_TYPE_CODES[number];

// =============================================================================
// DATA SOURCE DEFINITION - Core schema
// =============================================================================

/**
 * Complete data source definition.
 * Follows Schema.org/Dataset with extensions.
 */
export interface DataSourceDefinition {
  /** Unique machine identifier (lowercase, underscore-separated) */
  id: string;
  
  /** Human-readable full name */
  name: string;
  
  /** Short code for display (uppercase) */
  shortName: string;
  
  /** Ingestion channel classification */
  channel: DataChannel;
  
  /** Authority tier */
  tier: DataTier;
  
  /** Subject matter domains */
  domains: DataDomain[];
  
  // ─────────────────────────────────────────────────────────────────────────
  // COVERAGE
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Spatial coverage level */
  geographicScope: GeographicScope;
  
  /** ISO 3166-1 alpha-2 country codes (if not global) */
  countries?: string[];
  
  /** Temporal coverage */
  temporalCoverage: {
    /** Start date (YYYY or YYYY-MM) */
    start: string;
    /** End date or 'present' */
    end: 'present' | string;
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // TECHNICAL
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Data refresh frequency */
  updateFrequency: UpdateFrequency;
  
  /** API endpoint URL */
  apiEndpoint?: string;
  
  /** API type/protocol */
  apiType?: ApiType;
  
  /** Authentication required */
  authRequired: boolean;
  
  // ─────────────────────────────────────────────────────────────────────────
  // QUALITY
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Empirical (measured) vs modeled/estimated */
  isEmpirical: boolean;
  
  /** Reliability score (0-100) */
  reliabilityScore: number;
  
  /** Methodology documentation URL */
  methodology?: string;
  
  // ─────────────────────────────────────────────────────────────────────────
  // LEGAL
  // ─────────────────────────────────────────────────────────────────────────
  
  /** License type */
  license: LicenseType;
  
  /** Citation required in outputs */
  citationRequired: boolean;
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATUS
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Source is active in ingestion */
  isActive: boolean;
  
  /** Last verification date (ISO 8601) */
  lastVerified?: string;
  
  /** Additional notes */
  notes?: string;
}

// =============================================================================
// CHANNEL A: OFFICIAL STATISTICAL APIs
// =============================================================================

export const CHANNEL_A_SOURCES: DataSourceDefinition[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // INTERNATIONAL ORGANIZATIONS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'eurostat',
    name: 'Eurostat - European Statistical Office',
    shortName: 'EUROSTAT',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'environment', 'social'],
    geographicScope: 'continental',
    temporalCoverage: { start: '1960', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1',
    apiType: 'sdmx',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 95,
    methodology: 'https://ec.europa.eu/eurostat/web/quality/european-quality-standards',
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Primary source for EU27+EFTA data'
  },
  {
    id: 'worldbank',
    name: 'World Bank Open Data',
    shortName: 'WB',
    channel: 'A',
    tier: 'tier_2',
    domains: ['demographics', 'economy', 'health', 'education', 'governance', 'infrastructure'],
    geographicScope: 'global',
    temporalCoverage: { start: '1960', end: 'present' },
    updateFrequency: 'quarterly',
    apiEndpoint: 'https://api.worldbank.org/v2',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 90,
    methodology: 'https://datahelpdesk.worldbank.org/knowledgebase/topics/19280-data-quality-and-effectiveness',
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'imf',
    name: 'International Monetary Fund Data',
    shortName: 'IMF',
    channel: 'A',
    tier: 'tier_2',
    domains: ['economy', 'finance'],
    geographicScope: 'global',
    temporalCoverage: { start: '1948', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://dataservices.imf.org/REST/SDMX_JSON.svc',
    apiType: 'sdmx',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 92,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'oecd',
    name: 'OECD Statistics',
    shortName: 'OECD',
    channel: 'A',
    tier: 'tier_2',
    domains: ['economy', 'education', 'health', 'environment', 'governance', 'technology'],
    geographicScope: 'global',
    countries: ['OECD_MEMBERS'],
    temporalCoverage: { start: '1960', end: 'present' },
    updateFrequency: 'quarterly',
    apiEndpoint: 'https://stats.oecd.org/SDMX-JSON',
    apiType: 'sdmx',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 93,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'who',
    name: 'World Health Organization Data',
    shortName: 'WHO',
    channel: 'A',
    tier: 'tier_2',
    domains: ['health'],
    geographicScope: 'global',
    temporalCoverage: { start: '1950', end: 'present' },
    updateFrequency: 'annual',
    apiEndpoint: 'https://ghoapi.azureedge.net/api',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 88,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'ilo',
    name: 'International Labour Organization',
    shortName: 'ILO',
    channel: 'A',
    tier: 'tier_2',
    domains: ['economy', 'social'],
    geographicScope: 'global',
    temporalCoverage: { start: '1970', end: 'present' },
    updateFrequency: 'quarterly',
    apiEndpoint: 'https://www.ilo.org/sdmx/rest',
    apiType: 'sdmx',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 88,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'un_data',
    name: 'United Nations Data',
    shortName: 'UN',
    channel: 'A',
    tier: 'tier_2',
    domains: ['demographics', 'economy', 'health', 'education', 'environment', 'governance', 'social'],
    geographicScope: 'global',
    temporalCoverage: { start: '1950', end: 'present' },
    updateFrequency: 'annual',
    apiEndpoint: 'https://data.un.org/ws/rest',
    apiType: 'sdmx',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 90,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'fao',
    name: 'Food and Agriculture Organization',
    shortName: 'FAO',
    channel: 'A',
    tier: 'tier_2',
    domains: ['environment', 'economy'],
    geographicScope: 'global',
    temporalCoverage: { start: '1961', end: 'present' },
    updateFrequency: 'annual',
    apiEndpoint: 'https://fenixservices.fao.org/faostat/api/v1',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 88,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NATIONAL STATISTICS OFFICES
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'scb',
    name: 'Statistiska centralbyrån (Sweden)',
    shortName: 'SCB',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'social', 'environment'],
    geographicScope: 'subnational',
    countries: ['SE'],
    temporalCoverage: { start: '1749', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://api.scb.se/OV0104/v1/doris/sv/ssd',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 98,
    methodology: 'https://www.scb.se/om-scb/kvalitet/',
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Oldest continuous national statistics office (1749)'
  },
  {
    id: 'ssb',
    name: 'Statistisk sentralbyrå (Norway)',
    shortName: 'SSB',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'social', 'environment'],
    geographicScope: 'subnational',
    countries: ['NO'],
    temporalCoverage: { start: '1876', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://data.ssb.no/api/v0',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 97,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'dst',
    name: 'Danmarks Statistik',
    shortName: 'DST',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'social', 'environment'],
    geographicScope: 'subnational',
    countries: ['DK'],
    temporalCoverage: { start: '1850', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://api.statbank.dk/v1',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 97,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'tilastokeskus',
    name: 'Tilastokeskus (Finland)',
    shortName: 'STAT.FI',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'social', 'environment'],
    geographicScope: 'subnational',
    countries: ['FI'],
    temporalCoverage: { start: '1865', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 97,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'ons',
    name: 'Office for National Statistics (UK)',
    shortName: 'ONS',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'social'],
    geographicScope: 'subnational',
    countries: ['GB'],
    temporalCoverage: { start: '1801', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://api.beta.ons.gov.uk/v1',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 96,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'destatis',
    name: 'Statistisches Bundesamt (Germany)',
    shortName: 'DESTATIS',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'social', 'environment'],
    geographicScope: 'subnational',
    countries: ['DE'],
    temporalCoverage: { start: '1950', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://www-genesis.destatis.de/genesisWS/rest/2020',
    apiType: 'rest',
    authRequired: true,
    isEmpirical: true,
    reliabilityScore: 96,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'insee',
    name: 'Institut national de la statistique (France)',
    shortName: 'INSEE',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'social'],
    geographicScope: 'subnational',
    countries: ['FR'],
    temporalCoverage: { start: '1946', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://api.insee.fr/series/BDM',
    apiType: 'rest',
    authRequired: true,
    isEmpirical: true,
    reliabilityScore: 95,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'cbs',
    name: 'Centraal Bureau voor de Statistiek (Netherlands)',
    shortName: 'CBS',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'social', 'environment'],
    geographicScope: 'subnational',
    countries: ['NL'],
    temporalCoverage: { start: '1899', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://opendata.cbs.nl/ODataApi/odata',
    apiType: 'odata',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 97,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'bfs',
    name: 'Bundesamt für Statistik (Switzerland)',
    shortName: 'BFS',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'social'],
    geographicScope: 'subnational',
    countries: ['CH'],
    temporalCoverage: { start: '1860', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://www.pxweb.bfs.admin.ch/api/v1/de',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 97,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'census_us',
    name: 'US Census Bureau',
    shortName: 'CENSUS',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'social'],
    geographicScope: 'subnational',
    countries: ['US'],
    temporalCoverage: { start: '1790', end: 'present' },
    updateFrequency: 'annual',
    apiEndpoint: 'https://api.census.gov/data',
    apiType: 'rest',
    authRequired: true,
    isEmpirical: true,
    reliabilityScore: 94,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'bls',
    name: 'Bureau of Labor Statistics (US)',
    shortName: 'BLS',
    channel: 'A',
    tier: 'tier_1',
    domains: ['economy', 'social'],
    geographicScope: 'subnational',
    countries: ['US'],
    temporalCoverage: { start: '1947', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://api.bls.gov/publicAPI/v2',
    apiType: 'rest',
    authRequired: true,
    isEmpirical: true,
    reliabilityScore: 95,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'fred',
    name: 'Federal Reserve Economic Data',
    shortName: 'FRED',
    channel: 'A',
    tier: 'tier_1',
    domains: ['economy', 'finance'],
    geographicScope: 'global',
    temporalCoverage: { start: '1947', end: 'present' },
    updateFrequency: 'daily',
    apiEndpoint: 'https://api.stlouisfed.org/fred',
    apiType: 'rest',
    authRequired: true,
    isEmpirical: true,
    reliabilityScore: 96,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'abs',
    name: 'Australian Bureau of Statistics',
    shortName: 'ABS',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'social'],
    geographicScope: 'subnational',
    countries: ['AU'],
    temporalCoverage: { start: '1911', end: 'present' },
    updateFrequency: 'quarterly',
    apiEndpoint: 'https://api.data.abs.gov.au/data',
    apiType: 'sdmx',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 95,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'statcan',
    name: 'Statistics Canada',
    shortName: 'STATCAN',
    channel: 'A',
    tier: 'tier_1',
    domains: ['demographics', 'economy', 'health', 'education', 'social', 'environment'],
    geographicScope: 'subnational',
    countries: ['CA'],
    temporalCoverage: { start: '1918', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://www150.statcan.gc.ca/t1/wds/rest',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 96,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  }
];

// =============================================================================
// CHANNEL B: REAL-TIME & NON-EMPIRICAL FEEDS
// =============================================================================

export const CHANNEL_B_SOURCES: DataSourceDefinition[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // FINANCIAL MARKETS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ecb_market',
    name: 'European Central Bank Market Data',
    shortName: 'ECB',
    channel: 'B',
    tier: 'tier_2',
    domains: ['finance'],
    geographicScope: 'continental',
    temporalCoverage: { start: '1999', end: 'present' },
    updateFrequency: 'daily',
    apiEndpoint: 'https://sdw-wsrest.ecb.europa.eu/service/data',
    apiType: 'sdmx',
    authRequired: false,
    isEmpirical: false,
    reliabilityScore: 95,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Exchange rates, interest rates, monetary aggregates'
  },
  {
    id: 'yahoo_finance',
    name: 'Yahoo Finance',
    shortName: 'YAHOO',
    channel: 'B',
    tier: 'tier_4',
    domains: ['finance'],
    geographicScope: 'global',
    temporalCoverage: { start: '1970', end: 'present' },
    updateFrequency: 'realtime',
    apiEndpoint: 'https://query1.finance.yahoo.com/v8/finance',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: false,
    reliabilityScore: 75,
    license: 'commercial',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Stock prices, indices - NOT for critical analysis'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // WEATHER & CLIMATE
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'openmeteo',
    name: 'Open-Meteo Weather API',
    shortName: 'METEO',
    channel: 'B',
    tier: 'tier_3',
    domains: ['environment'],
    geographicScope: 'global',
    temporalCoverage: { start: '1940', end: 'present' },
    updateFrequency: 'hourly',
    apiEndpoint: 'https://api.open-meteo.com/v1',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: false,
    reliabilityScore: 80,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Current weather and forecasts'
  },
  {
    id: 'copernicus',
    name: 'Copernicus Climate Data Store',
    shortName: 'CDS',
    channel: 'B',
    tier: 'tier_2',
    domains: ['environment'],
    geographicScope: 'global',
    temporalCoverage: { start: '1950', end: 'present' },
    updateFrequency: 'daily',
    apiEndpoint: 'https://cds.climate.copernicus.eu/api/v2',
    apiType: 'rest',
    authRequired: true,
    isEmpirical: true,
    reliabilityScore: 92,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Satellite and reanalysis climate data'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ENERGY
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'entsoe',
    name: 'ENTSO-E Transparency Platform',
    shortName: 'ENTSOE',
    channel: 'B',
    tier: 'tier_2',
    domains: ['environment', 'infrastructure'],
    geographicScope: 'continental',
    temporalCoverage: { start: '2015', end: 'present' },
    updateFrequency: 'hourly',
    apiEndpoint: 'https://web-api.tp.entsoe.eu/api',
    apiType: 'rest',
    authRequired: true,
    isEmpirical: true,
    reliabilityScore: 90,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'European electricity generation/consumption'
  },
  {
    id: 'eia',
    name: 'US Energy Information Administration',
    shortName: 'EIA',
    channel: 'B',
    tier: 'tier_1',
    domains: ['environment', 'economy'],
    geographicScope: 'global',
    temporalCoverage: { start: '1949', end: 'present' },
    updateFrequency: 'weekly',
    apiEndpoint: 'https://api.eia.gov/v2',
    apiType: 'rest',
    authRequired: true,
    isEmpirical: true,
    reliabilityScore: 93,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Global energy production/consumption'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRANSPORT
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'flightradar',
    name: 'Flight Radar 24',
    shortName: 'FR24',
    channel: 'B',
    tier: 'tier_4',
    domains: ['infrastructure'],
    geographicScope: 'global',
    temporalCoverage: { start: '2006', end: 'present' },
    updateFrequency: 'realtime',
    apiEndpoint: 'https://data-cloud.flightradar24.com/zones/fcgi',
    apiType: 'rest',
    authRequired: true,
    isEmpirical: false,
    reliabilityScore: 70,
    license: 'commercial',
    citationRequired: true,
    isActive: false,
    lastVerified: '2026-02-01',
    notes: 'Live air traffic - commercial API'
  },
  {
    id: 'ais_marine',
    name: 'Marine Traffic AIS',
    shortName: 'AIS',
    channel: 'B',
    tier: 'tier_4',
    domains: ['infrastructure'],
    geographicScope: 'global',
    temporalCoverage: { start: '2010', end: 'present' },
    updateFrequency: 'realtime',
    authRequired: true,
    isEmpirical: false,
    reliabilityScore: 70,
    license: 'commercial',
    citationRequired: true,
    isActive: false,
    lastVerified: '2026-02-01',
    notes: 'Vessel tracking - commercial API'
  }
];

// =============================================================================
// CHANNEL C: DOCUMENT EXTRACTION
// =============================================================================

export const CHANNEL_C_SOURCES: DataSourceDefinition[] = [
  {
    id: 'gov_budget_se',
    name: 'Swedish Government Budget Proposals',
    shortName: 'GOV.SE',
    channel: 'C',
    tier: 'tier_1',
    domains: ['economy', 'governance'],
    geographicScope: 'national',
    countries: ['SE'],
    temporalCoverage: { start: '1990', end: 'present' },
    updateFrequency: 'annual',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 98,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'PDF extraction via claim pipeline'
  },
  {
    id: 'sou_reports',
    name: 'Swedish Government Official Reports (SOU)',
    shortName: 'SOU',
    channel: 'C',
    tier: 'tier_1',
    domains: ['governance', 'social', 'economy', 'health', 'education'],
    geographicScope: 'national',
    countries: ['SE'],
    temporalCoverage: { start: '1922', end: 'present' },
    updateFrequency: 'irregular',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 95,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Official investigations and reports'
  },
  {
    id: 'eu_legislation',
    name: 'EUR-Lex EU Legislation',
    shortName: 'EURLEX',
    channel: 'C',
    tier: 'tier_1',
    domains: ['governance'],
    geographicScope: 'continental',
    temporalCoverage: { start: '1952', end: 'present' },
    updateFrequency: 'daily',
    apiEndpoint: 'https://eur-lex.europa.eu/eurlex-ws',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 100,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01'
  },
  {
    id: 'ipcc_reports',
    name: 'IPCC Assessment Reports',
    shortName: 'IPCC',
    channel: 'C',
    tier: 'tier_2',
    domains: ['environment'],
    geographicScope: 'global',
    temporalCoverage: { start: '1990', end: 'present' },
    updateFrequency: 'irregular',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 90,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Climate assessment reports'
  },
  {
    id: 'riksbank_reports',
    name: 'Swedish Riksbank Reports',
    shortName: 'RIKSBANK',
    channel: 'C',
    tier: 'tier_1',
    domains: ['economy', 'finance'],
    geographicScope: 'national',
    countries: ['SE'],
    temporalCoverage: { start: '1668', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://www.riksbank.se/api',
    apiType: 'rest',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 98,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Oldest central bank (1668)'
  }
];

// =============================================================================
// CHANNEL D: AGGREGATED DATASETS
// =============================================================================

export const CHANNEL_D_SOURCES: DataSourceDefinition[] = [
  {
    id: 'gapminder',
    name: 'Gapminder',
    shortName: 'GAPMINDER',
    channel: 'D',
    tier: 'tier_3',
    domains: ['demographics', 'economy', 'health', 'education'],
    geographicScope: 'global',
    temporalCoverage: { start: '1800', end: 'present' },
    updateFrequency: 'annual',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 85,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Curated historical datasets'
  },
  {
    id: 'owid',
    name: 'Our World in Data',
    shortName: 'OWID',
    channel: 'D',
    tier: 'tier_3',
    domains: ['demographics', 'economy', 'health', 'education', 'environment', 'technology'],
    geographicScope: 'global',
    temporalCoverage: { start: '1800', end: 'present' },
    updateFrequency: 'weekly',
    apiEndpoint: 'https://github.com/owid/owid-datasets',
    apiType: 'bulk',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 85,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Pre-aggregated research datasets'
  },
  {
    id: 'hmd',
    name: 'Human Mortality Database',
    shortName: 'HMD',
    channel: 'D',
    tier: 'tier_2',
    domains: ['health', 'demographics'],
    geographicScope: 'global',
    temporalCoverage: { start: '1751', end: 'present' },
    updateFrequency: 'monthly',
    apiEndpoint: 'https://mortality.org',
    apiType: 'bulk',
    authRequired: true,
    isEmpirical: true,
    reliabilityScore: 95,
    license: 'attribution',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Gold standard mortality data'
  },
  {
    id: 'maddison',
    name: 'Maddison Project Database',
    shortName: 'MADDISON',
    channel: 'D',
    tier: 'tier_3',
    domains: ['economy'],
    geographicScope: 'global',
    temporalCoverage: { start: '1', end: 'present' },
    updateFrequency: 'annual',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 80,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Historical GDP estimates from year 1'
  },
  {
    id: 'vdem',
    name: 'V-Dem Democracy Index',
    shortName: 'V-DEM',
    channel: 'D',
    tier: 'tier_3',
    domains: ['governance'],
    geographicScope: 'global',
    temporalCoverage: { start: '1789', end: 'present' },
    updateFrequency: 'annual',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 85,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Academic democracy measurement'
  },
  {
    id: 'wgi',
    name: 'Worldwide Governance Indicators',
    shortName: 'WGI',
    channel: 'D',
    tier: 'tier_2',
    domains: ['governance'],
    geographicScope: 'global',
    temporalCoverage: { start: '1996', end: 'present' },
    updateFrequency: 'annual',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 88,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'World Bank governance metrics'
  },
  {
    id: 'ghsl',
    name: 'Global Human Settlement Layer',
    shortName: 'GHSL',
    channel: 'D',
    tier: 'tier_2',
    domains: ['demographics', 'infrastructure'],
    geographicScope: 'global',
    temporalCoverage: { start: '1975', end: 'present' },
    updateFrequency: 'annual',
    apiEndpoint: 'https://ghsl.jrc.ec.europa.eu',
    apiType: 'bulk',
    authRequired: false,
    isEmpirical: true,
    reliabilityScore: 90,
    license: 'open',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'Satellite-derived urbanization data'
  },
  {
    id: 'gbd',
    name: 'Global Burden of Disease Study',
    shortName: 'GBD',
    channel: 'D',
    tier: 'tier_2',
    domains: ['health'],
    geographicScope: 'global',
    temporalCoverage: { start: '1990', end: 'present' },
    updateFrequency: 'annual',
    authRequired: true,
    isEmpirical: true,
    reliabilityScore: 90,
    license: 'attribution',
    citationRequired: true,
    isActive: true,
    lastVerified: '2026-02-01',
    notes: 'IHME disease burden estimates'
  }
];

// =============================================================================
// COMPLETE MANIFEST
// =============================================================================

export interface ManifestStatistics {
  totalSources: number;
  activeSources: number;
  tier1Sources: number;
  tier2Sources: number;
  tier3Sources: number;
  tier4Sources: number;
  empiricalSources: number;
  byChannel: Record<DataChannel, number>;
  byDomain: Record<DataDomain, number>;
}

function calculateStatistics(): ManifestStatistics {
  const allSources = [
    ...CHANNEL_A_SOURCES,
    ...CHANNEL_B_SOURCES,
    ...CHANNEL_C_SOURCES,
    ...CHANNEL_D_SOURCES
  ];
  
  const byChannel: Record<DataChannel, number> = { A: 0, B: 0, C: 0, D: 0 };
  const byDomain: Partial<Record<DataDomain, number>> = {};
  
  allSources.forEach(s => {
    byChannel[s.channel]++;
    s.domains.forEach(d => {
      byDomain[d] = (byDomain[d] || 0) + 1;
    });
  });
  
  return {
    totalSources: allSources.length,
    activeSources: allSources.filter(s => s.isActive).length,
    tier1Sources: allSources.filter(s => s.tier === 'tier_1').length,
    tier2Sources: allSources.filter(s => s.tier === 'tier_2').length,
    tier3Sources: allSources.filter(s => s.tier === 'tier_3').length,
    tier4Sources: allSources.filter(s => s.tier === 'tier_4').length,
    empiricalSources: allSources.filter(s => s.isEmpirical).length,
    byChannel,
    byDomain: byDomain as Record<DataDomain, number>
  };
}

export const DATA_MANIFEST = {
  // ─────────────────────────────────────────────────────────────────────────
  // METADATA
  // ─────────────────────────────────────────────────────────────────────────
  '@context': 'https://schema.org',
  '@type': 'DataCatalog',
  version: '2.0.0',
  lastUpdated: '2026-02-04T00:00:00Z',
  schemaVersion: 'https://schema.org/Dataset',
  
  // ─────────────────────────────────────────────────────────────────────────
  // CHANNELS
  // ─────────────────────────────────────────────────────────────────────────
  channels: {
    A: {
      ...DATA_CHANNEL_METADATA.A,
      sources: CHANNEL_A_SOURCES
    },
    B: {
      ...DATA_CHANNEL_METADATA.B,
      sources: CHANNEL_B_SOURCES
    },
    C: {
      ...DATA_CHANNEL_METADATA.C,
      sources: CHANNEL_C_SOURCES
    },
    D: {
      ...DATA_CHANNEL_METADATA.D,
      sources: CHANNEL_D_SOURCES
    }
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // DOMAINS
  // ─────────────────────────────────────────────────────────────────────────
  domains: DATA_DOMAIN_CODES.map(id => ({
    id,
    ...DATA_DOMAIN_LABELS[id]
  })),
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATISTICS
  // ─────────────────────────────────────────────────────────────────────────
  statistics: calculateStatistics()
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all sources as flat array
 */
export function getAllSources(): DataSourceDefinition[] {
  return [
    ...CHANNEL_A_SOURCES,
    ...CHANNEL_B_SOURCES,
    ...CHANNEL_C_SOURCES,
    ...CHANNEL_D_SOURCES
  ];
}

/**
 * Get sources by domain
 */
export function getSourcesByDomain(domain: DataDomain): DataSourceDefinition[] {
  return getAllSources().filter(s => s.domains.includes(domain) && s.isActive);
}

/**
 * Get sources by country (ISO 3166-1 alpha-2)
 */
export function getSourcesByCountry(countryCode: string): DataSourceDefinition[] {
  return getAllSources().filter(s => 
    s.isActive && 
    (s.geographicScope === 'global' || 
     s.geographicScope === 'continental' ||
     (s.countries && s.countries.includes(countryCode)))
  );
}

/**
 * Get sources by channel
 */
export function getSourcesByChannel(channel: DataChannel): DataSourceDefinition[] {
  switch (channel) {
    case 'A': return CHANNEL_A_SOURCES.filter(s => s.isActive);
    case 'B': return CHANNEL_B_SOURCES.filter(s => s.isActive);
    case 'C': return CHANNEL_C_SOURCES.filter(s => s.isActive);
    case 'D': return CHANNEL_D_SOURCES.filter(s => s.isActive);
  }
}

/**
 * Get sources by tier
 */
export function getSourcesByTier(tier: DataTier): DataSourceDefinition[] {
  return getAllSources().filter(s => s.tier === tier && s.isActive);
}

/**
 * Get empirical sources only
 */
export function getEmpiricalSources(): DataSourceDefinition[] {
  return getAllSources().filter(s => s.isEmpirical && s.isActive);
}

/**
 * Get source reliability score
 */
export function getSourceReliability(sourceId: string): number | null {
  const source = getAllSources().find(s => s.id === sourceId);
  return source?.reliabilityScore ?? null;
}

/**
 * Get source by ID
 */
export function getSourceById(sourceId: string): DataSourceDefinition | undefined {
  return getAllSources().find(s => s.id === sourceId);
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a single data source definition
 */
export function validateSource(source: DataSourceDefinition): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!source.id || !/^[a-z][a-z0-9_]*$/.test(source.id)) {
    errors.push(`Invalid source ID: ${source.id} (must be lowercase snake_case)`);
  }
  
  if (!source.name || source.name.length < 3) {
    errors.push(`Invalid source name: ${source.name}`);
  }
  
  if (!DATA_CHANNEL_CODES.includes(source.channel)) {
    errors.push(`Invalid channel: ${source.channel}`);
  }
  
  if (!DATA_TIER_CODES.includes(source.tier)) {
    errors.push(`Invalid tier: ${source.tier}`);
  }
  
  if (!source.domains.length) {
    errors.push('Source must have at least one domain');
  }
  
  source.domains.forEach(d => {
    if (!DATA_DOMAIN_CODES.includes(d)) {
      errors.push(`Invalid domain: ${d}`);
    }
  });
  
  // Reliability score validation
  const tierMeta = DATA_TIER_METADATA[source.tier];
  if (source.reliabilityScore < tierMeta.minReliabilityScore) {
    warnings.push(
      `Reliability score ${source.reliabilityScore} is below tier minimum ${tierMeta.minReliabilityScore}`
    );
  }
  
  // Temporal coverage
  const startYear = parseInt(source.temporalCoverage.start);
  if (isNaN(startYear) || startYear < 1 || startYear > 2100) {
    errors.push(`Invalid temporal coverage start: ${source.temporalCoverage.start}`);
  }
  
  // API endpoint for applicable types
  if (source.apiEndpoint) {
    try {
      new URL(source.apiEndpoint);
    } catch {
      errors.push(`Invalid API endpoint URL: ${source.apiEndpoint}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate entire manifest
 */
export function validateManifest(): ValidationResult {
  const allSources = getAllSources();
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for duplicate IDs
  const ids = new Set<string>();
  allSources.forEach(s => {
    if (ids.has(s.id)) {
      errors.push(`Duplicate source ID: ${s.id}`);
    }
    ids.add(s.id);
  });
  
  // Validate each source
  allSources.forEach(s => {
    const result = validateSource(s);
    errors.push(...result.errors.map(e => `[${s.id}] ${e}`));
    warnings.push(...result.warnings.map(w => `[${s.id}] ${w}`));
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// =============================================================================
// SERIALIZATION FUNCTIONS
// =============================================================================

/**
 * Export source as Schema.org/Dataset JSON-LD
 */
export function toSchemaOrgDataset(source: DataSourceDefinition): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `urn:datasource:${source.id}`,
    name: source.name,
    alternateName: source.shortName,
    description: source.notes || `Data source from ${source.name}`,
    creator: {
      '@type': 'Organization',
      name: source.name
    },
    distribution: source.apiEndpoint ? {
      '@type': 'DataDownload',
      contentUrl: source.apiEndpoint,
      encodingFormat: source.apiType === 'sdmx' ? 'application/xml' : 'application/json'
    } : undefined,
    temporalCoverage: `${source.temporalCoverage.start}/${source.temporalCoverage.end === 'present' ? '' : source.temporalCoverage.end}`,
    spatialCoverage: source.geographicScope === 'global' ? 'World' : 
                     source.countries?.join(', ') || source.geographicScope,
    keywords: source.domains.map(d => DATA_DOMAIN_LABELS[d].en),
    license: LICENSE_METADATA[source.license].spdxIdentifier || source.license,
    isAccessibleForFree: !source.authRequired,
    measurementTechnique: source.isEmpirical ? 'Direct measurement' : 'Modeled/estimated'
  };
}

/**
 * Export entire manifest as Schema.org DataCatalog
 */
export function toSchemaOrgCatalog(): object {
  const allSources = getAllSources();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    '@id': 'urn:datacatalog:manifest',
    name: 'Data Aggregation Manifest',
    description: 'Complete registry of all data sources aggregated by the system',
    dateModified: DATA_MANIFEST.lastUpdated,
    dataset: allSources.map(toSchemaOrgDataset)
  };
}

/**
 * Export manifest statistics as machine-readable summary
 */
export function getManifestSummary(): object {
  const stats = calculateStatistics();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    dateModified: DATA_MANIFEST.lastUpdated,
    version: DATA_MANIFEST.version,
    numberOfItems: stats.totalSources,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'activeSources', value: stats.activeSources },
      { '@type': 'PropertyValue', name: 'tier1Sources', value: stats.tier1Sources },
      { '@type': 'PropertyValue', name: 'tier2Sources', value: stats.tier2Sources },
      { '@type': 'PropertyValue', name: 'tier3Sources', value: stats.tier3Sources },
      { '@type': 'PropertyValue', name: 'tier4Sources', value: stats.tier4Sources },
      { '@type': 'PropertyValue', name: 'empiricalSources', value: stats.empiricalSources }
    ]
  };
}
