/**
 * GLOBAL API REGISTRY — TOTAL DATA HARVEST
 * Block X: Every API that publishes relevant data
 * 
 * TARGET: 1000-3000 sources
 */

export type AccessMethod = 'api' | 'rss' | 'html' | 'pdf' | 'bulk' | 'ftp' | 'websocket' | 'graphql';
export type AuthType = 'none' | 'key' | 'oauth' | 'basic' | 'certificate';
export type DataType = 'time_series' | 'text' | 'events' | 'documents' | 'realtime' | 'geospatial';

export interface GlobalSource {
  source_id: string;
  name: string;
  organization: string;
  country: string | 'global';
  category: SourceCategory;
  url: string;
  api_url?: string;
  access_method: AccessMethod;
  auth: AuthType;
  license: string;
  update_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  data_types: DataType[];
  kpis_available: string[];
  historical_depth_years: number;
  reliability_score: number;
  notes?: string;
  is_active: boolean;
  last_verified: string;
}

export type SourceCategory = 
  | 'statistics'
  | 'policy_legislation'
  | 'economy_markets'
  | 'health'
  | 'education_research'
  | 'crime_safety'
  | 'housing_real_estate'
  | 'energy_commodities'
  | 'environment_climate'
  | 'infrastructure_transport'
  | 'digitalization'
  | 'demographics_migration'
  | 'elections_politics'
  | 'news_media'
  | 'public_documents'
  | 'realtime_indicators';

// ============================================================================
// STATISTICS SOURCES (📊)
// ============================================================================

const STATISTICS_SOURCES: GlobalSource[] = [
  // Global Organizations
  {
    source_id: 'worldbank_wdi',
    name: 'World Development Indicators',
    organization: 'World Bank',
    country: 'global',
    category: 'statistics',
    url: 'https://data.worldbank.org/',
    api_url: 'https://api.worldbank.org/v2/',
    access_method: 'api',
    auth: 'none',
    license: 'CC-BY-4.0',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['gdp', 'population', 'health', 'education', 'poverty'],
    historical_depth_years: 60,
    reliability_score: 0.95,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'imf_weo',
    name: 'World Economic Outlook',
    organization: 'International Monetary Fund',
    country: 'global',
    category: 'statistics',
    url: 'https://www.imf.org/en/Publications/WEO',
    api_url: 'https://www.imf.org/external/datamapper/api/v1/',
    access_method: 'api',
    auth: 'none',
    license: 'IMF Terms',
    update_frequency: 'quarterly',
    data_types: ['time_series'],
    kpis_available: ['gdp', 'inflation', 'debt', 'balance'],
    historical_depth_years: 40,
    reliability_score: 0.98,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'un_data',
    name: 'UN Data',
    organization: 'United Nations',
    country: 'global',
    category: 'statistics',
    url: 'https://data.un.org/',
    access_method: 'api',
    auth: 'none',
    license: 'UN Terms',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['population', 'mortality', 'sdg'],
    historical_depth_years: 70,
    reliability_score: 0.95,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'oecd_stats',
    name: 'OECD Statistics',
    organization: 'OECD',
    country: 'global',
    category: 'statistics',
    url: 'https://stats.oecd.org/',
    api_url: 'https://stats.oecd.org/SDMX-JSON/',
    access_method: 'api',
    auth: 'none',
    license: 'OECD Terms',
    update_frequency: 'quarterly',
    data_types: ['time_series'],
    kpis_available: ['employment', 'gdp', 'education', 'health', 'trade'],
    historical_depth_years: 50,
    reliability_score: 0.97,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'eurostat',
    name: 'Eurostat',
    organization: 'European Commission',
    country: 'global',
    category: 'statistics',
    url: 'https://ec.europa.eu/eurostat/',
    api_url: 'https://ec.europa.eu/eurostat/api/dissemination/',
    access_method: 'api',
    auth: 'none',
    license: 'Eurostat Terms',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['employment', 'gdp', 'demographics', 'prices', 'trade'],
    historical_depth_years: 30,
    reliability_score: 0.98,
    notes: 'Primary source for EU NUTS-level data',
    is_active: true,
    last_verified: '2024-12-01'
  },
  
  // National Statistics - Europe
  {
    source_id: 'scb_sweden',
    name: 'Statistiska Centralbyrån',
    organization: 'SCB',
    country: 'SE',
    category: 'statistics',
    url: 'https://www.scb.se/',
    api_url: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/',
    access_method: 'api',
    auth: 'none',
    license: 'CC0',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['population', 'employment', 'prices', 'housing', 'trade'],
    historical_depth_years: 100,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'ssb_norway',
    name: 'Statistisk sentralbyrå',
    organization: 'SSB',
    country: 'NO',
    category: 'statistics',
    url: 'https://www.ssb.no/',
    api_url: 'https://data.ssb.no/api/v0/',
    access_method: 'api',
    auth: 'none',
    license: 'NLOD',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['population', 'employment', 'prices', 'oil'],
    historical_depth_years: 80,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'destatis_germany',
    name: 'Destatis',
    organization: 'Statistisches Bundesamt',
    country: 'DE',
    category: 'statistics',
    url: 'https://www.destatis.de/',
    api_url: 'https://www-genesis.destatis.de/genesisWS/rest/',
    access_method: 'api',
    auth: 'key',
    license: 'DL-DE/BY-2-0',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['population', 'employment', 'gdp', 'trade', 'prices'],
    historical_depth_years: 70,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'insee_france',
    name: 'INSEE',
    organization: 'Institut national de la statistique',
    country: 'FR',
    category: 'statistics',
    url: 'https://www.insee.fr/',
    api_url: 'https://api.insee.fr/',
    access_method: 'api',
    auth: 'key',
    license: 'Etalab Open Licence',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['population', 'employment', 'gdp', 'prices'],
    historical_depth_years: 60,
    reliability_score: 0.98,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'ons_uk',
    name: 'Office for National Statistics',
    organization: 'ONS',
    country: 'GB',
    category: 'statistics',
    url: 'https://www.ons.gov.uk/',
    api_url: 'https://api.beta.ons.gov.uk/',
    access_method: 'api',
    auth: 'none',
    license: 'OGL',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['population', 'employment', 'gdp', 'prices', 'trade'],
    historical_depth_years: 50,
    reliability_score: 0.98,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'istat_italy',
    name: 'ISTAT',
    organization: 'Istituto Nazionale di Statistica',
    country: 'IT',
    category: 'statistics',
    url: 'https://www.istat.it/',
    api_url: 'https://esploradati.istat.it/SDMXWS/',
    access_method: 'api',
    auth: 'none',
    license: 'CC-BY-3.0-IT',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['population', 'employment', 'gdp', 'prices'],
    historical_depth_years: 60,
    reliability_score: 0.97,
    is_active: true,
    last_verified: '2024-12-01'
  },
  
  // National Statistics - Americas
  {
    source_id: 'bls_usa',
    name: 'Bureau of Labor Statistics',
    organization: 'BLS',
    country: 'US',
    category: 'statistics',
    url: 'https://www.bls.gov/',
    api_url: 'https://api.bls.gov/publicAPI/v2/',
    access_method: 'api',
    auth: 'key',
    license: 'Public Domain',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['employment', 'unemployment', 'wages', 'prices'],
    historical_depth_years: 100,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'census_usa',
    name: 'US Census Bureau',
    organization: 'Census Bureau',
    country: 'US',
    category: 'statistics',
    url: 'https://www.census.gov/',
    api_url: 'https://api.census.gov/data/',
    access_method: 'api',
    auth: 'key',
    license: 'Public Domain',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['population', 'demographics', 'housing', 'income'],
    historical_depth_years: 200,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'bea_usa',
    name: 'Bureau of Economic Analysis',
    organization: 'BEA',
    country: 'US',
    category: 'statistics',
    url: 'https://www.bea.gov/',
    api_url: 'https://apps.bea.gov/api/data/',
    access_method: 'api',
    auth: 'key',
    license: 'Public Domain',
    update_frequency: 'quarterly',
    data_types: ['time_series'],
    kpis_available: ['gdp', 'trade', 'investment'],
    historical_depth_years: 80,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'statcan_canada',
    name: 'Statistics Canada',
    organization: 'StatCan',
    country: 'CA',
    category: 'statistics',
    url: 'https://www.statcan.gc.ca/',
    api_url: 'https://www150.statcan.gc.ca/t1/wds/rest/',
    access_method: 'api',
    auth: 'none',
    license: 'Statistics Canada Open Licence',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['population', 'employment', 'gdp', 'trade'],
    historical_depth_years: 100,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  
  // National Statistics - Asia
  {
    source_id: 'nbs_china',
    name: 'National Bureau of Statistics',
    organization: 'NBS',
    country: 'CN',
    category: 'statistics',
    url: 'https://www.stats.gov.cn/',
    access_method: 'html',
    auth: 'none',
    license: 'Government',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['gdp', 'population', 'industry', 'trade'],
    historical_depth_years: 40,
    reliability_score: 0.80,
    notes: 'Data quality concerns documented',
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'estat_japan',
    name: 'e-Stat Japan',
    organization: 'Statistics Bureau of Japan',
    country: 'JP',
    category: 'statistics',
    url: 'https://www.e-stat.go.jp/',
    api_url: 'https://api.e-stat.go.jp/',
    access_method: 'api',
    auth: 'key',
    license: 'CC-BY-4.0',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['population', 'employment', 'prices', 'trade'],
    historical_depth_years: 70,
    reliability_score: 0.98,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'kosis_korea',
    name: 'Korean Statistical Information Service',
    organization: 'Statistics Korea',
    country: 'KR',
    category: 'statistics',
    url: 'https://kosis.kr/',
    api_url: 'https://kosis.kr/openapi/',
    access_method: 'api',
    auth: 'key',
    license: 'KOGL',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['population', 'employment', 'gdp', 'trade'],
    historical_depth_years: 50,
    reliability_score: 0.97,
    is_active: true,
    last_verified: '2024-12-01'
  },
];

// ============================================================================
// HEALTH SOURCES (🏥)
// ============================================================================

const HEALTH_SOURCES: GlobalSource[] = [
  {
    source_id: 'who_gho',
    name: 'Global Health Observatory',
    organization: 'World Health Organization',
    country: 'global',
    category: 'health',
    url: 'https://www.who.int/data/gho/',
    api_url: 'https://ghoapi.azureedge.net/api/',
    access_method: 'api',
    auth: 'none',
    license: 'CC-BY-NC-SA',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['mortality', 'morbidity', 'health_systems', 'risk_factors'],
    historical_depth_years: 30,
    reliability_score: 0.95,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'ihme_gbd',
    name: 'Global Burden of Disease',
    organization: 'Institute for Health Metrics and Evaluation',
    country: 'global',
    category: 'health',
    url: 'https://www.healthdata.org/gbd',
    api_url: 'https://ghdx.healthdata.org/gbd-results-tool',
    access_method: 'bulk',
    auth: 'none',
    license: 'CC-BY-NC-ND',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['dalys', 'mortality', 'prevalence', 'incidence'],
    historical_depth_years: 30,
    reliability_score: 0.93,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'ecdc',
    name: 'European Centre for Disease Prevention',
    organization: 'ECDC',
    country: 'global',
    category: 'health',
    url: 'https://www.ecdc.europa.eu/',
    api_url: 'https://atlas.ecdc.europa.eu/public/index.aspx',
    access_method: 'api',
    auth: 'none',
    license: 'ECDC Terms',
    update_frequency: 'weekly',
    data_types: ['time_series', 'events'],
    kpis_available: ['infectious_diseases', 'vaccination', 'antimicrobial'],
    historical_depth_years: 20,
    reliability_score: 0.97,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'cdc_usa',
    name: 'Centers for Disease Control',
    organization: 'CDC',
    country: 'US',
    category: 'health',
    url: 'https://www.cdc.gov/',
    api_url: 'https://data.cdc.gov/api/',
    access_method: 'api',
    auth: 'none',
    license: 'Public Domain',
    update_frequency: 'weekly',
    data_types: ['time_series', 'events'],
    kpis_available: ['mortality', 'infectious_diseases', 'chronic_diseases'],
    historical_depth_years: 50,
    reliability_score: 0.98,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'oecd_health',
    name: 'OECD Health Statistics',
    organization: 'OECD',
    country: 'global',
    category: 'health',
    url: 'https://www.oecd.org/health/',
    api_url: 'https://stats.oecd.org/SDMX-JSON/',
    access_method: 'api',
    auth: 'none',
    license: 'OECD Terms',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['health_spending', 'physicians', 'hospital_beds', 'mortality'],
    historical_depth_years: 40,
    reliability_score: 0.97,
    is_active: true,
    last_verified: '2024-12-01'
  },
];

// ============================================================================
// ECONOMY & MARKETS SOURCES (💰)
// ============================================================================

const ECONOMY_SOURCES: GlobalSource[] = [
  {
    source_id: 'bis',
    name: 'Bank for International Settlements',
    organization: 'BIS',
    country: 'global',
    category: 'economy_markets',
    url: 'https://www.bis.org/',
    api_url: 'https://stats.bis.org/api/v1/',
    access_method: 'api',
    auth: 'none',
    license: 'BIS Terms',
    update_frequency: 'quarterly',
    data_types: ['time_series'],
    kpis_available: ['credit', 'debt', 'fx', 'derivatives'],
    historical_depth_years: 40,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'ecb_sdw',
    name: 'ECB Statistical Data Warehouse',
    organization: 'European Central Bank',
    country: 'global',
    category: 'economy_markets',
    url: 'https://sdw.ecb.europa.eu/',
    api_url: 'https://sdw-wsrest.ecb.europa.eu/service/',
    access_method: 'api',
    auth: 'none',
    license: 'ECB Terms',
    update_frequency: 'daily',
    data_types: ['time_series', 'realtime'],
    kpis_available: ['interest_rates', 'money_supply', 'balance_of_payments', 'inflation'],
    historical_depth_years: 25,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'fred',
    name: 'Federal Reserve Economic Data',
    organization: 'Federal Reserve Bank of St. Louis',
    country: 'US',
    category: 'economy_markets',
    url: 'https://fred.stlouisfed.org/',
    api_url: 'https://api.stlouisfed.org/fred/',
    access_method: 'api',
    auth: 'key',
    license: 'FRED Terms',
    update_frequency: 'daily',
    data_types: ['time_series'],
    kpis_available: ['gdp', 'employment', 'inflation', 'interest_rates', 'money_supply'],
    historical_depth_years: 100,
    reliability_score: 0.99,
    notes: '820,000+ data series',
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'wto',
    name: 'World Trade Organization',
    organization: 'WTO',
    country: 'global',
    category: 'economy_markets',
    url: 'https://www.wto.org/',
    api_url: 'https://apiportal.wto.org/',
    access_method: 'api',
    auth: 'key',
    license: 'WTO Terms',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['trade', 'tariffs', 'services'],
    historical_depth_years: 30,
    reliability_score: 0.97,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'unctad',
    name: 'UNCTAD Statistics',
    organization: 'UN Conference on Trade and Development',
    country: 'global',
    category: 'economy_markets',
    url: 'https://unctadstat.unctad.org/',
    access_method: 'api',
    auth: 'none',
    license: 'UN Terms',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['fdi', 'trade', 'commodities', 'maritime'],
    historical_depth_years: 50,
    reliability_score: 0.95,
    is_active: true,
    last_verified: '2024-12-01'
  },
];

// ============================================================================
// NEWS & MEDIA SOURCES (📰)
// ============================================================================

const NEWS_SOURCES: GlobalSource[] = [
  {
    source_id: 'gdelt',
    name: 'GDELT Project',
    organization: 'GDELT',
    country: 'global',
    category: 'news_media',
    url: 'https://www.gdeltproject.org/',
    api_url: 'https://api.gdeltproject.org/api/v2/',
    access_method: 'api',
    auth: 'none',
    license: 'Open',
    update_frequency: 'realtime',
    data_types: ['events', 'text'],
    kpis_available: ['news_volume', 'sentiment', 'events'],
    historical_depth_years: 15,
    reliability_score: 0.85,
    notes: 'Global news monitoring in 65 languages',
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'mediacloud',
    name: 'Media Cloud',
    organization: 'Media Cloud',
    country: 'global',
    category: 'news_media',
    url: 'https://mediacloud.org/',
    api_url: 'https://api.mediacloud.org/api/v2/',
    access_method: 'api',
    auth: 'key',
    license: 'Open',
    update_frequency: 'daily',
    data_types: ['text', 'events'],
    kpis_available: ['news_volume', 'topics', 'sources'],
    historical_depth_years: 10,
    reliability_score: 0.80,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'acled',
    name: 'Armed Conflict Location & Event Data',
    organization: 'ACLED',
    country: 'global',
    category: 'news_media',
    url: 'https://acleddata.com/',
    api_url: 'https://api.acleddata.com/acled/read',
    access_method: 'api',
    auth: 'key',
    license: 'ACLED Terms',
    update_frequency: 'weekly',
    data_types: ['events', 'geospatial'],
    kpis_available: ['conflict_events', 'fatalities', 'actors'],
    historical_depth_years: 25,
    reliability_score: 0.90,
    is_active: true,
    last_verified: '2024-12-01'
  },
];

// ============================================================================
// ENVIRONMENT & CLIMATE SOURCES (🌍)
// ============================================================================

const ENVIRONMENT_SOURCES: GlobalSource[] = [
  {
    source_id: 'noaa',
    name: 'National Oceanic and Atmospheric Administration',
    organization: 'NOAA',
    country: 'US',
    category: 'environment_climate',
    url: 'https://www.noaa.gov/',
    api_url: 'https://www.ncei.noaa.gov/cdo-web/api/v2/',
    access_method: 'api',
    auth: 'key',
    license: 'Public Domain',
    update_frequency: 'daily',
    data_types: ['time_series', 'realtime'],
    kpis_available: ['temperature', 'precipitation', 'extreme_events'],
    historical_depth_years: 150,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'copernicus',
    name: 'Copernicus Climate Data Store',
    organization: 'Copernicus',
    country: 'global',
    category: 'environment_climate',
    url: 'https://cds.climate.copernicus.eu/',
    api_url: 'https://cds.climate.copernicus.eu/api/v2',
    access_method: 'api',
    auth: 'key',
    license: 'Copernicus Terms',
    update_frequency: 'daily',
    data_types: ['time_series', 'geospatial'],
    kpis_available: ['temperature', 'emissions', 'sea_level', 'ice'],
    historical_depth_years: 80,
    reliability_score: 0.97,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'eea',
    name: 'European Environment Agency',
    organization: 'EEA',
    country: 'global',
    category: 'environment_climate',
    url: 'https://www.eea.europa.eu/',
    api_url: 'https://discodata.eea.europa.eu/',
    access_method: 'api',
    auth: 'none',
    license: 'EEA Terms',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['air_quality', 'emissions', 'waste', 'water'],
    historical_depth_years: 30,
    reliability_score: 0.96,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'iea',
    name: 'International Energy Agency',
    organization: 'IEA',
    country: 'global',
    category: 'energy_commodities',
    url: 'https://www.iea.org/',
    api_url: 'https://api.iea.org/',
    access_method: 'api',
    auth: 'key',
    license: 'IEA Terms',
    update_frequency: 'monthly',
    data_types: ['time_series'],
    kpis_available: ['energy_production', 'consumption', 'emissions', 'renewables'],
    historical_depth_years: 50,
    reliability_score: 0.98,
    is_active: true,
    last_verified: '2024-12-01'
  },
];

// ============================================================================
// POLICY & LEGISLATION SOURCES (🏛️)
// ============================================================================

const POLICY_SOURCES: GlobalSource[] = [
  {
    source_id: 'eurlex',
    name: 'EUR-Lex',
    organization: 'European Union',
    country: 'global',
    category: 'policy_legislation',
    url: 'https://eur-lex.europa.eu/',
    api_url: 'https://eur-lex.europa.eu/eurlex-ws/',
    access_method: 'api',
    auth: 'none',
    license: 'EU Terms',
    update_frequency: 'daily',
    data_types: ['documents', 'events'],
    kpis_available: ['legislation', 'directives', 'regulations'],
    historical_depth_years: 70,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'congress_gov',
    name: 'Congress.gov',
    organization: 'US Congress',
    country: 'US',
    category: 'policy_legislation',
    url: 'https://www.congress.gov/',
    api_url: 'https://api.congress.gov/v3/',
    access_method: 'api',
    auth: 'key',
    license: 'Public Domain',
    update_frequency: 'daily',
    data_types: ['documents', 'events'],
    kpis_available: ['bills', 'votes', 'members'],
    historical_depth_years: 250,
    reliability_score: 0.99,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'wipo',
    name: 'World Intellectual Property Organization',
    organization: 'WIPO',
    country: 'global',
    category: 'policy_legislation',
    url: 'https://www.wipo.int/',
    api_url: 'https://www.wipo.int/ipstats/api/',
    access_method: 'api',
    auth: 'none',
    license: 'WIPO Terms',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['patents', 'trademarks', 'designs'],
    historical_depth_years: 40,
    reliability_score: 0.97,
    is_active: true,
    last_verified: '2024-12-01'
  },
];

// ============================================================================
// CRIME & SAFETY SOURCES (🚓)
// ============================================================================

const CRIME_SOURCES: GlobalSource[] = [
  {
    source_id: 'unodc',
    name: 'UN Office on Drugs and Crime',
    organization: 'UNODC',
    country: 'global',
    category: 'crime_safety',
    url: 'https://www.unodc.org/',
    api_url: 'https://dataunodc.un.org/api/',
    access_method: 'api',
    auth: 'none',
    license: 'UN Terms',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['homicide', 'drug_trafficking', 'corruption', 'organized_crime'],
    historical_depth_years: 20,
    reliability_score: 0.90,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'fbi_ucr',
    name: 'FBI Uniform Crime Reports',
    organization: 'FBI',
    country: 'US',
    category: 'crime_safety',
    url: 'https://ucr.fbi.gov/',
    api_url: 'https://api.usa.gov/crime/fbi/sapi/',
    access_method: 'api',
    auth: 'key',
    license: 'Public Domain',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['violent_crime', 'property_crime', 'hate_crime'],
    historical_depth_years: 90,
    reliability_score: 0.95,
    is_active: true,
    last_verified: '2024-12-01'
  },
  {
    source_id: 'bra_sweden',
    name: 'Brottsförebyggande rådet',
    organization: 'BRÅ',
    country: 'SE',
    category: 'crime_safety',
    url: 'https://www.bra.se/',
    api_url: 'https://statistik.bra.se/solr/',
    access_method: 'api',
    auth: 'none',
    license: 'CC0',
    update_frequency: 'yearly',
    data_types: ['time_series'],
    kpis_available: ['reported_crimes', 'solved_crimes', 'victims'],
    historical_depth_years: 70,
    reliability_score: 0.98,
    is_active: true,
    last_verified: '2024-12-01'
  },
];

// ============================================================================
// COMBINED REGISTRY
// ============================================================================

export const GLOBAL_API_REGISTRY: GlobalSource[] = [
  ...STATISTICS_SOURCES,
  ...HEALTH_SOURCES,
  ...ECONOMY_SOURCES,
  ...NEWS_SOURCES,
  ...ENVIRONMENT_SOURCES,
  ...POLICY_SOURCES,
  ...CRIME_SOURCES,
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getSourceById(id: string): GlobalSource | undefined {
  return GLOBAL_API_REGISTRY.find(s => s.source_id === id);
}

export function getSourcesByCategory(category: SourceCategory): GlobalSource[] {
  return GLOBAL_API_REGISTRY.filter(s => s.category === category);
}

export function getSourcesByCountry(country: string): GlobalSource[] {
  return GLOBAL_API_REGISTRY.filter(s => s.country === country || s.country === 'global');
}

export function getActiveSources(): GlobalSource[] {
  return GLOBAL_API_REGISTRY.filter(s => s.is_active);
}

export function getRealtimeSources(): GlobalSource[] {
  return GLOBAL_API_REGISTRY.filter(s => s.update_frequency === 'realtime');
}

export function getSourceStats(): {
  total: number;
  byCategory: Record<string, number>;
  byCountry: Record<string, number>;
  byAccessMethod: Record<string, number>;
  realtime: number;
} {
  const byCategory: Record<string, number> = {};
  const byCountry: Record<string, number> = {};
  const byAccessMethod: Record<string, number> = {};
  
  for (const source of GLOBAL_API_REGISTRY) {
    byCategory[source.category] = (byCategory[source.category] || 0) + 1;
    byCountry[source.country] = (byCountry[source.country] || 0) + 1;
    byAccessMethod[source.access_method] = (byAccessMethod[source.access_method] || 0) + 1;
  }
  
  return {
    total: GLOBAL_API_REGISTRY.length,
    byCategory,
    byCountry,
    byAccessMethod,
    realtime: getRealtimeSources().length,
  };
}

console.log('[Global API Registry] Loaded:', getSourceStats());
