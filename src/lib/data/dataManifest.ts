/**
 * COMPLETE DATA AGGREGATION MANIFEST
 * 
 * Defines ALL data sources the system should aggregate.
 * Organized by ingestion channel per architecture specification.
 * 
 * CHANNELS:
 * A - Official APIs (structured, verified, empirical)
 * B - Semi-official/Real-time (non-empirical, flagged)
 * C - Document extraction (PDFs, reports, claims)
 * D - Aggregated external (pre-processed datasets)
 */

// =============================================================================
// DATA DOMAINS - What we measure
// =============================================================================

export type DataDomain = 
  | 'demographics'      // Population, age, migration, fertility
  | 'economy'           // GDP, employment, trade, prices
  | 'health'            // Mortality, morbidity, healthcare access
  | 'education'         // Enrollment, attainment, literacy
  | 'environment'       // Emissions, energy, resources, climate
  | 'governance'        // Transparency, rule of law, elections
  | 'infrastructure'    // Transport, digital, utilities
  | 'social'            // Inequality, poverty, crime, housing
  | 'security'          // Defense, conflicts, terrorism
  | 'technology'        // R&D, patents, innovation
  | 'culture'           // Media, heritage, tourism
  | 'finance'           // Markets, banking, debt;

export type DataChannel = 'A' | 'B' | 'C' | 'D';

export type DataTier = 
  | 'tier_1'  // Primary official (national statistics offices)
  | 'tier_2'  // Secondary official (international organizations)
  | 'tier_3'  // Academic/research verified
  | 'tier_4'  // Commercial/monitored;

export type UpdateFrequency = 
  | 'realtime'    // < 1 minute
  | 'hourly'      // Every hour
  | 'daily'       // Every day
  | 'weekly'      // Every week
  | 'monthly'     // Every month
  | 'quarterly'   // Every quarter
  | 'annual'      // Every year
  | 'irregular';  // No fixed schedule

export type GeographicScope = 
  | 'global'        // Worldwide coverage
  | 'continental'   // Regional blocs (EU, ASEAN, etc.)
  | 'national'      // Country-level
  | 'subnational'   // Regions, provinces
  | 'municipal'     // Cities, municipalities
  | 'granular';     // Point data, addresses

// =============================================================================
// DATA SOURCE REGISTRY
// =============================================================================

export interface DataSourceDefinition {
  id: string;
  name: string;
  shortName: string;
  channel: DataChannel;
  tier: DataTier;
  domains: DataDomain[];
  
  // Coverage
  geographicScope: GeographicScope;
  countries?: string[];  // ISO codes if not global
  temporalCoverage: {
    start: string;  // YYYY or YYYY-MM
    end: 'present' | string;
  };
  
  // Technical
  updateFrequency: UpdateFrequency;
  apiEndpoint?: string;
  apiType?: 'rest' | 'graphql' | 'sdmx' | 'odata' | 'bulk';
  authRequired: boolean;
  
  // Quality
  isEmpirical: boolean;
  reliabilityScore: number;  // 0-100
  methodology?: string;
  
  // Legal
  license: 'open' | 'attribution' | 'restricted' | 'commercial';
  citationRequired: boolean;
  
  // Status
  isActive: boolean;
  lastVerified?: string;
  notes?: string;
}

// =============================================================================
// CHANNEL A: OFFICIAL STATISTICAL APIs
// =============================================================================

export const CHANNEL_A_SOURCES: DataSourceDefinition[] = [
  // INTERNATIONAL ORGANIZATIONS
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
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    license: 'open',
    citationRequired: true,
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
  },
  
  // NATIONAL STATISTICS OFFICES (Priority Countries)
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
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
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
    isActive: true
  }
];

// =============================================================================
// CHANNEL B: REAL-TIME & NON-EMPIRICAL FEEDS
// =============================================================================

export const CHANNEL_B_SOURCES: DataSourceDefinition[] = [
  // FINANCIAL MARKETS
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
    notes: 'Stock prices, indices - NOT for critical analysis'
  },
  
  // WEATHER & CLIMATE
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
    notes: 'Satellite and reanalysis climate data'
  },
  
  // ENERGY
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
    notes: 'Global energy production/consumption'
  },
  
  // TRANSPORT
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
    isEmpirical: false,
    reliabilityScore: 70,
    authRequired: true,
    license: 'commercial',
    citationRequired: true,
    isActive: false,
    notes: 'Vessel tracking - commercial API'
  }
];

// =============================================================================
// CHANNEL C: DOCUMENT EXTRACTION (Claim-based)
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
    isEmpirical: true,
    reliabilityScore: 98,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 95,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 100,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true
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
    isEmpirical: true,
    reliabilityScore: 90,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 98,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 85,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 85,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 95,
    authRequired: true,
    license: 'attribution',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 80,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 85,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 88,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 90,
    authRequired: false,
    license: 'open',
    citationRequired: true,
    isActive: true,
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
    isEmpirical: true,
    reliabilityScore: 90,
    authRequired: true,
    license: 'attribution',
    citationRequired: true,
    isActive: true,
    notes: 'IHME disease burden estimates'
  }
];

// =============================================================================
// COMPLETE MANIFEST
// =============================================================================

export const DATA_MANIFEST = {
  version: '1.0.0',
  lastUpdated: '2026-02-04',
  
  channels: {
    A: {
      name: 'Official Statistical APIs',
      description: 'Primary official sources - national statistics offices and international organizations',
      isEmpirical: true,
      sources: CHANNEL_A_SOURCES
    },
    B: {
      name: 'Real-time & Market Feeds',
      description: 'Semi-official and commercial real-time data streams',
      isEmpirical: false,
      sources: CHANNEL_B_SOURCES
    },
    C: {
      name: 'Document Extraction',
      description: 'PDFs, reports, legislation - claim extraction pipeline',
      isEmpirical: true,
      sources: CHANNEL_C_SOURCES
    },
    D: {
      name: 'Aggregated Datasets',
      description: 'Pre-processed academic and research datasets',
      isEmpirical: true,
      sources: CHANNEL_D_SOURCES
    }
  },
  
  domains: [
    { id: 'demographics', name: 'Demografi', indicatorCount: 0 },
    { id: 'economy', name: 'Ekonomi', indicatorCount: 0 },
    { id: 'health', name: 'Hälsa', indicatorCount: 0 },
    { id: 'education', name: 'Utbildning', indicatorCount: 0 },
    { id: 'environment', name: 'Miljö & Klimat', indicatorCount: 0 },
    { id: 'governance', name: 'Styrning & Demokrati', indicatorCount: 0 },
    { id: 'infrastructure', name: 'Infrastruktur', indicatorCount: 0 },
    { id: 'social', name: 'Sociala förhållanden', indicatorCount: 0 },
    { id: 'security', name: 'Säkerhet', indicatorCount: 0 },
    { id: 'technology', name: 'Teknologi & Innovation', indicatorCount: 0 },
    { id: 'culture', name: 'Kultur & Media', indicatorCount: 0 },
    { id: 'finance', name: 'Finansmarknader', indicatorCount: 0 }
  ] as const,
  
  // Statistics
  get totalSources() {
    return CHANNEL_A_SOURCES.length + 
           CHANNEL_B_SOURCES.length + 
           CHANNEL_C_SOURCES.length + 
           CHANNEL_D_SOURCES.length;
  },
  
  get activeSources() {
    return [...CHANNEL_A_SOURCES, ...CHANNEL_B_SOURCES, ...CHANNEL_C_SOURCES, ...CHANNEL_D_SOURCES]
      .filter(s => s.isActive).length;
  },
  
  get tier1Sources() {
    return [...CHANNEL_A_SOURCES, ...CHANNEL_B_SOURCES, ...CHANNEL_C_SOURCES, ...CHANNEL_D_SOURCES]
      .filter(s => s.tier === 'tier_1').length;
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getSourcesByDomain(domain: DataDomain): DataSourceDefinition[] {
  return [
    ...CHANNEL_A_SOURCES,
    ...CHANNEL_B_SOURCES,
    ...CHANNEL_C_SOURCES,
    ...CHANNEL_D_SOURCES
  ].filter(s => s.domains.includes(domain) && s.isActive);
}

export function getSourcesByCountry(countryCode: string): DataSourceDefinition[] {
  return [
    ...CHANNEL_A_SOURCES,
    ...CHANNEL_B_SOURCES,
    ...CHANNEL_C_SOURCES,
    ...CHANNEL_D_SOURCES
  ].filter(s => 
    s.isActive && 
    (s.geographicScope === 'global' || 
     s.geographicScope === 'continental' ||
     (s.countries && s.countries.includes(countryCode)))
  );
}

export function getSourcesByChannel(channel: DataChannel): DataSourceDefinition[] {
  switch (channel) {
    case 'A': return CHANNEL_A_SOURCES.filter(s => s.isActive);
    case 'B': return CHANNEL_B_SOURCES.filter(s => s.isActive);
    case 'C': return CHANNEL_C_SOURCES.filter(s => s.isActive);
    case 'D': return CHANNEL_D_SOURCES.filter(s => s.isActive);
  }
}

export function getEmpiricalSources(): DataSourceDefinition[] {
  return [
    ...CHANNEL_A_SOURCES,
    ...CHANNEL_B_SOURCES,
    ...CHANNEL_C_SOURCES,
    ...CHANNEL_D_SOURCES
  ].filter(s => s.isEmpirical && s.isActive);
}

export function getSourceReliability(sourceId: string): number {
  const source = [
    ...CHANNEL_A_SOURCES,
    ...CHANNEL_B_SOURCES,
    ...CHANNEL_C_SOURCES,
    ...CHANNEL_D_SOURCES
  ].find(s => s.id === sourceId);
  
  return source?.reliabilityScore ?? 0;
}
