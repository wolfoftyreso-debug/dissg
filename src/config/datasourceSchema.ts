/**
 * BLOCK N — GLOBAL DATASOURCE SCHEMA
 * 
 * Schema for cataloging all data sources globally.
 * Target: 300-500 sources covering all regions.
 */

// =============================================================================
// DATASOURCE SCHEMA
// =============================================================================

export type DataSourceType = 
  | 'national_statistics_office'
  | 'international_organization'
  | 'central_bank'
  | 'government_agency'
  | 'research_institution'
  | 'registry'
  | 'survey_provider'
  | 'composite_aggregator';

export type AccessMethod = 
  | 'api_rest'
  | 'api_graphql'
  | 'bulk_download'
  | 'sdmx'
  | 'web_scrape'
  | 'manual_request'
  | 'subscription';

export type DataLicense = 
  | 'public_domain'
  | 'cc_by'
  | 'cc_by_sa'
  | 'cc_by_nc'
  | 'open_government'
  | 'restricted'
  | 'commercial'
  | 'unknown';

export type DataFormat = 
  | 'json'
  | 'csv'
  | 'xlsx'
  | 'xml'
  | 'sdmx'
  | 'parquet'
  | 'api_response';

export interface DataSourceDefinition {
  source_id: string;                    // Unique identifier
  code: string;                         // Short code
  
  organization: string;                 // Full name
  organization_local?: string;          // Local language name
  organization_acronym?: string;        // e.g., "SCB", "ONS"
  
  country_code: string | null;          // ISO 3166-1 alpha-2, null for international
  region: string;                       // Geographic region
  
  source_type: DataSourceType;
  
  url: string;                          // Main website
  data_portal_url?: string;             // Data portal if different
  api_documentation_url?: string;
  
  access: {
    method: AccessMethod;
    requires_auth: boolean;
    auth_type?: 'api_key' | 'oauth' | 'basic' | 'session';
    rate_limited: boolean;
    rate_limit_info?: string;
  };
  
  license: DataLicense;
  license_url?: string;
  
  update_frequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  typical_lag_days: number;
  
  kpis_available: string[];             // KPI IDs this source provides
  kpi_categories: string[];             // Domain categories
  
  historical_depth: {
    earliest_year: number;
    has_revisions: boolean;
    revision_policy?: string;
  };
  
  data_format: DataFormat[];
  
  geographic_coverage: {
    countries: string[];                // ISO codes
    has_subnational: boolean;
    subnational_levels?: string[];
  };
  
  quality: {
    reliability_score: number;          // 0-100
    methodology_documented: boolean;
    microdata_available: boolean;
    metadata_quality: 'excellent' | 'good' | 'fair' | 'poor';
  };
  
  contact?: {
    email?: string;
    support_url?: string;
  };
  
  notes?: string;
  
  metadata: {
    added_at: string;
    added_by: string;
    last_verified: string;
    is_active: boolean;
  };
}

// =============================================================================
// REGIONAL BREAKDOWN
// =============================================================================

export interface RegionalSourceInventory {
  region: string;
  target_sources: number;
  current_sources: number;
  key_organizations: string[];
  notes?: string;
}

export const REGIONAL_INVENTORY: RegionalSourceInventory[] = [
  {
    region: 'European Union',
    target_sources: 35,
    current_sources: 0,
    key_organizations: [
      'Eurostat',
      'European Central Bank',
      'European Environment Agency',
      '27 National Statistics Offices',
    ],
  },
  {
    region: 'United States',
    target_sources: 25,
    current_sources: 0,
    key_organizations: [
      'U.S. Census Bureau',
      'Bureau of Labor Statistics',
      'Bureau of Economic Analysis',
      'Federal Reserve',
      'CDC',
      'EPA',
      '50 State Data Portals',
    ],
  },
  {
    region: 'United Kingdom',
    target_sources: 8,
    current_sources: 0,
    key_organizations: [
      'Office for National Statistics',
      'NHS Digital',
      'Bank of England',
    ],
  },
  {
    region: 'Canada',
    target_sources: 5,
    current_sources: 0,
    key_organizations: [
      'Statistics Canada',
      'Bank of Canada',
    ],
  },
  {
    region: 'International',
    target_sources: 40,
    current_sources: 0,
    key_organizations: [
      'World Bank',
      'International Monetary Fund',
      'OECD',
      'United Nations (DESA, UNCTAD)',
      'World Health Organization',
      'International Labour Organization',
      'FAO',
      'UNICEF',
      'UNESCO',
      'IEA',
    ],
  },
  {
    region: 'Asia-Pacific',
    target_sources: 30,
    current_sources: 0,
    key_organizations: [
      'Asian Development Bank',
      'National Bureau of Statistics China',
      'Statistics Bureau Japan',
      'Australian Bureau of Statistics',
      'Statistics New Zealand',
      'Korea Statistics',
    ],
  },
  {
    region: 'Latin America',
    target_sources: 25,
    current_sources: 0,
    key_organizations: [
      'ECLAC',
      'IBGE Brazil',
      'INEGI Mexico',
      'Regional NSOs',
    ],
  },
  {
    region: 'Africa',
    target_sources: 20,
    current_sources: 0,
    key_organizations: [
      'African Development Bank',
      'African Union',
      'Regional NSOs',
    ],
  },
  {
    region: 'Middle East & North Africa',
    target_sources: 15,
    current_sources: 0,
    key_organizations: [
      'Regional NSOs',
      'Central Banks',
    ],
  },
  {
    region: 'South Asia',
    target_sources: 10,
    current_sources: 0,
    key_organizations: [
      'National Statistical Office India',
      'Pakistan Bureau of Statistics',
      'Bangladesh Bureau of Statistics',
    ],
  },
];

// =============================================================================
// MAJOR SOURCES (STARTER)
// =============================================================================

export const MAJOR_SOURCES: Partial<DataSourceDefinition>[] = [
  // International
  {
    source_id: 'world_bank',
    code: 'WB',
    organization: 'World Bank',
    country_code: null,
    region: 'International',
    source_type: 'international_organization',
    url: 'https://data.worldbank.org',
    access: { method: 'api_rest', requires_auth: false, rate_limited: true },
    license: 'cc_by',
    update_frequency: 'annual',
    kpi_categories: ['economy', 'health', 'education', 'demographics'],
  },
  {
    source_id: 'imf',
    code: 'IMF',
    organization: 'International Monetary Fund',
    country_code: null,
    region: 'International',
    source_type: 'international_organization',
    url: 'https://data.imf.org',
    access: { method: 'api_rest', requires_auth: false, rate_limited: true },
    license: 'open_government',
    update_frequency: 'quarterly',
    kpi_categories: ['economy', 'finance'],
  },
  {
    source_id: 'oecd',
    code: 'OECD',
    organization: 'Organisation for Economic Co-operation and Development',
    country_code: null,
    region: 'International',
    source_type: 'international_organization',
    url: 'https://stats.oecd.org',
    access: { method: 'sdmx', requires_auth: false, rate_limited: true },
    license: 'open_government',
    update_frequency: 'monthly',
    kpi_categories: ['economy', 'workforce', 'education', 'health', 'environment'],
  },
  {
    source_id: 'who',
    code: 'WHO',
    organization: 'World Health Organization',
    country_code: null,
    region: 'International',
    source_type: 'international_organization',
    url: 'https://www.who.int/data',
    access: { method: 'api_rest', requires_auth: false, rate_limited: false },
    license: 'cc_by',
    update_frequency: 'annual',
    kpi_categories: ['health'],
  },
  
  // EU
  {
    source_id: 'eurostat',
    code: 'ESTAT',
    organization: 'Eurostat',
    country_code: null,
    region: 'European Union',
    source_type: 'international_organization',
    url: 'https://ec.europa.eu/eurostat',
    access: { method: 'api_rest', requires_auth: false, rate_limited: true },
    license: 'open_government',
    update_frequency: 'monthly',
    kpi_categories: ['economy', 'demographics', 'workforce', 'environment'],
  },
  
  // National
  {
    source_id: 'scb_sweden',
    code: 'SCB',
    organization: 'Statistics Sweden',
    organization_local: 'Statistiska centralbyrån',
    country_code: 'SE',
    region: 'European Union',
    source_type: 'national_statistics_office',
    url: 'https://www.scb.se',
    access: { method: 'api_rest', requires_auth: false, rate_limited: false },
    license: 'open_government',
    update_frequency: 'monthly',
    kpi_categories: ['economy', 'demographics', 'workforce', 'housing'],
  },
  {
    source_id: 'ons_uk',
    code: 'ONS',
    organization: 'Office for National Statistics',
    country_code: 'GB',
    region: 'United Kingdom',
    source_type: 'national_statistics_office',
    url: 'https://www.ons.gov.uk',
    access: { method: 'api_rest', requires_auth: false, rate_limited: true },
    license: 'open_government',
    update_frequency: 'monthly',
    kpi_categories: ['economy', 'demographics', 'workforce', 'health'],
  },
  {
    source_id: 'census_usa',
    code: 'USCB',
    organization: 'U.S. Census Bureau',
    country_code: 'US',
    region: 'United States',
    source_type: 'national_statistics_office',
    url: 'https://www.census.gov',
    access: { method: 'api_rest', requires_auth: true, auth_type: 'api_key', rate_limited: true },
    license: 'public_domain',
    update_frequency: 'monthly',
    kpi_categories: ['demographics', 'economy', 'housing'],
  },
  {
    source_id: 'bls_usa',
    code: 'BLS',
    organization: 'Bureau of Labor Statistics',
    country_code: 'US',
    region: 'United States',
    source_type: 'government_agency',
    url: 'https://www.bls.gov',
    access: { method: 'api_rest', requires_auth: true, auth_type: 'api_key', rate_limited: true },
    license: 'public_domain',
    update_frequency: 'monthly',
    kpi_categories: ['workforce', 'economy'],
  },
];

// =============================================================================
// VALIDATION
// =============================================================================

export function validateDataSource(source: Partial<DataSourceDefinition>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!source.source_id) errors.push('Missing source_id');
  if (!source.organization) errors.push('Missing organization');
  if (!source.url) errors.push('Missing url');
  if (!source.source_type) errors.push('Missing source_type');
  if (!source.access) errors.push('Missing access configuration');
  if (!source.license) errors.push('Missing license');
  
  return { valid: errors.length === 0, errors };
}

export function getSourceCoverage(): { 
  total: number; 
  byRegion: Record<string, number>; 
  byType: Record<string, number>;
  targetProgress: number;
} {
  // This would calculate from actual data
  const total = MAJOR_SOURCES.length;
  const target = REGIONAL_INVENTORY.reduce((sum, r) => sum + r.target_sources, 0);
  
  return {
    total,
    byRegion: {},
    byType: {},
    targetProgress: Math.round((total / target) * 100),
  };
}
