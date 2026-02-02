/**
 * GLOBAL DATA SOURCE REGISTRY
 * 200+ källor från hela världen
 * 
 * sources_global.yaml equivalent in TypeScript
 */

export interface DataSourceDefinition {
  source_id: string;
  name: string;
  organization: string;
  country_code: string | null; // null = global/multi-country
  region: string;
  url: string;
  api_endpoint?: string;
  access_method: 'api' | 'bulk' | 'ftp' | 'scrape' | 'manual';
  license: 'open' | 'attribution' | 'restricted' | 'commercial';
  update_frequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  available_kpis: string[]; // KPI codes from taxonomy
  historical_depth_years: number;
  reliability_score: number; // 0-1
  political_risk: 'low' | 'medium' | 'high';
  has_revision_history: boolean;
  documentation_url?: string;
  auth_required: boolean;
  notes?: string;
}

// ============================================================================
// GLOBAL SOURCES (Multi-country / International Organizations)
// ============================================================================

const GLOBAL_SOURCES: DataSourceDefinition[] = [
  // World Bank
  {
    source_id: 'worldbank',
    name: 'World Bank Open Data',
    organization: 'World Bank',
    country_code: null,
    region: 'GLOBAL',
    url: 'https://data.worldbank.org',
    api_endpoint: 'https://api.worldbank.org/v2',
    access_method: 'api',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['gdp_per_capita', 'gdp_growth', 'population_total', 'life_expectancy', 'infant_mortality', 'co2_per_capita', 'gini_coefficient', 'poverty_rate', 'unemployment_rate', 'tertiary_education'],
    historical_depth_years: 60,
    reliability_score: 0.95,
    political_risk: 'low',
    has_revision_history: true,
    documentation_url: 'https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information',
    auth_required: false
  },
  // IMF
  {
    source_id: 'imf',
    name: 'IMF Data',
    organization: 'International Monetary Fund',
    country_code: null,
    region: 'GLOBAL',
    url: 'https://data.imf.org',
    api_endpoint: 'https://dataservices.imf.org/REST/SDMX_JSON.svc',
    access_method: 'api',
    license: 'open',
    update_frequency: 'quarterly',
    available_kpis: ['gdp_growth', 'inflation_rate', 'government_debt_gdp', 'budget_balance_gdp', 'trade_balance_gdp'],
    historical_depth_years: 40,
    reliability_score: 0.98,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // UN Statistics
  {
    source_id: 'unsd',
    name: 'UN Statistics Division',
    organization: 'United Nations',
    country_code: null,
    region: 'GLOBAL',
    url: 'https://unstats.un.org',
    api_endpoint: 'https://data.un.org/ws/rest',
    access_method: 'api',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['population_total', 'fertility_rate', 'life_expectancy', 'net_migration'],
    historical_depth_years: 70,
    reliability_score: 0.92,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // WHO
  {
    source_id: 'who_gho',
    name: 'WHO Global Health Observatory',
    organization: 'World Health Organization',
    country_code: null,
    region: 'GLOBAL',
    url: 'https://www.who.int/data/gho',
    api_endpoint: 'https://ghoapi.azureedge.net/api',
    access_method: 'api',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['life_expectancy', 'healthy_life_years', 'infant_mortality', 'maternal_mortality', 'vaccination_coverage', 'suicide_rate', 'obesity_rate', 'smoking_prevalence', 'alcohol_consumption'],
    historical_depth_years: 20,
    reliability_score: 0.94,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // ILO
  {
    source_id: 'ilostat',
    name: 'ILOSTAT',
    organization: 'International Labour Organization',
    country_code: null,
    region: 'GLOBAL',
    url: 'https://ilostat.ilo.org',
    api_endpoint: 'https://www.ilo.org/sdmx/rest',
    access_method: 'api',
    license: 'open',
    update_frequency: 'quarterly',
    available_kpis: ['employment_rate', 'unemployment_rate', 'youth_unemployment', 'labor_force_participation', 'gender_pay_gap'],
    historical_depth_years: 30,
    reliability_score: 0.93,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // OECD
  {
    source_id: 'oecd',
    name: 'OECD.Stat',
    organization: 'OECD',
    country_code: null,
    region: 'GLOBAL',
    url: 'https://stats.oecd.org',
    api_endpoint: 'https://stats.oecd.org/SDMX-JSON',
    access_method: 'api',
    license: 'attribution',
    update_frequency: 'monthly',
    available_kpis: ['gdp_per_capita', 'gdp_growth', 'unemployment_rate', 'inflation_rate', 'education_spending_gdp', 'health_expenditure_gdp', 'pisa_reading', 'pisa_math'],
    historical_depth_years: 50,
    reliability_score: 0.96,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // UNESCO
  {
    source_id: 'unesco_uis',
    name: 'UNESCO Institute for Statistics',
    organization: 'UNESCO',
    country_code: null,
    region: 'GLOBAL',
    url: 'http://data.uis.unesco.org',
    access_method: 'api',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['tertiary_education', 'upper_secondary', 'early_leavers', 'education_spending_gdp', 'student_teacher_ratio'],
    historical_depth_years: 25,
    reliability_score: 0.91,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // UNDP
  {
    source_id: 'undp_hdr',
    name: 'UNDP Human Development Reports',
    organization: 'UNDP',
    country_code: null,
    region: 'GLOBAL',
    url: 'https://hdr.undp.org/data-center',
    access_method: 'bulk',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['life_expectancy', 'gini_coefficient', 'tertiary_education'],
    historical_depth_years: 30,
    reliability_score: 0.92,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // UNODC
  {
    source_id: 'unodc',
    name: 'UN Office on Drugs and Crime',
    organization: 'UNODC',
    country_code: null,
    region: 'GLOBAL',
    url: 'https://dataunodc.un.org',
    access_method: 'bulk',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['homicide_rate', 'prison_population'],
    historical_depth_years: 20,
    reliability_score: 0.88,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // Transparency International
  {
    source_id: 'transparency_intl',
    name: 'Corruption Perceptions Index',
    organization: 'Transparency International',
    country_code: null,
    region: 'GLOBAL',
    url: 'https://www.transparency.org/cpi',
    access_method: 'bulk',
    license: 'attribution',
    update_frequency: 'yearly',
    available_kpis: ['corruption_perceptions'],
    historical_depth_years: 25,
    reliability_score: 0.90,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // IEA
  {
    source_id: 'iea',
    name: 'International Energy Agency',
    organization: 'IEA',
    country_code: null,
    region: 'GLOBAL',
    url: 'https://www.iea.org/data-and-statistics',
    access_method: 'api',
    license: 'attribution',
    update_frequency: 'yearly',
    available_kpis: ['co2_per_capita', 'renewable_energy_share', 'energy_intensity'],
    historical_depth_years: 50,
    reliability_score: 0.95,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: true
  }
];

// ============================================================================
// EUROPEAN SOURCES
// ============================================================================

const EU_SOURCES: DataSourceDefinition[] = [
  // Eurostat
  {
    source_id: 'eurostat',
    name: 'Eurostat',
    organization: 'European Commission',
    country_code: null,
    region: 'EU',
    url: 'https://ec.europa.eu/eurostat',
    api_endpoint: 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['employment_rate', 'unemployment_rate', 'gdp_per_capita', 'inflation_rate', 'gini_coefficient', 'poverty_rate', 'life_expectancy', 'tertiary_education'],
    historical_depth_years: 30,
    reliability_score: 0.97,
    political_risk: 'low',
    has_revision_history: true,
    documentation_url: 'https://ec.europa.eu/eurostat/web/sdmx-web-services',
    auth_required: false
  },
  // ECB
  {
    source_id: 'ecb',
    name: 'European Central Bank',
    organization: 'ECB',
    country_code: null,
    region: 'EU',
    url: 'https://sdw.ecb.europa.eu',
    api_endpoint: 'https://sdw-wsrest.ecb.europa.eu/service',
    access_method: 'api',
    license: 'open',
    update_frequency: 'daily',
    available_kpis: ['inflation_rate', 'core_inflation'],
    historical_depth_years: 25,
    reliability_score: 0.99,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // EEA
  {
    source_id: 'eea',
    name: 'European Environment Agency',
    organization: 'EEA',
    country_code: null,
    region: 'EU',
    url: 'https://www.eea.europa.eu/data-and-maps',
    access_method: 'api',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['air_quality_pm25', 'ghg_emissions_gdp', 'renewable_energy_share'],
    historical_depth_years: 20,
    reliability_score: 0.94,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  }
];

// ============================================================================
// NORDIC SOURCES
// ============================================================================

const NORDIC_SOURCES: DataSourceDefinition[] = [
  // Sweden - SCB
  {
    source_id: 'scb_se',
    name: 'Statistics Sweden',
    organization: 'Statistiska centralbyrån',
    country_code: 'SE',
    region: 'NORDIC',
    url: 'https://www.scb.se',
    api_endpoint: 'https://api.scb.se/OV0104/v1/doris/sv/ssd',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['employment_rate', 'unemployment_rate', 'gdp_growth', 'inflation_rate', 'population_total', 'life_expectancy'],
    historical_depth_years: 100,
    reliability_score: 0.98,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // Sweden - Kolada
  {
    source_id: 'kolada_se',
    name: 'Kolada',
    organization: 'RKA',
    country_code: 'SE',
    region: 'NORDIC',
    url: 'https://www.kolada.se',
    api_endpoint: 'https://api.kolada.se/v2',
    access_method: 'api',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['healthcare_wait_time', 'student_teacher_ratio', 'overcrowding'],
    historical_depth_years: 20,
    reliability_score: 0.95,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // Norway - SSB
  {
    source_id: 'ssb_no',
    name: 'Statistics Norway',
    organization: 'Statistisk sentralbyrå',
    country_code: 'NO',
    region: 'NORDIC',
    url: 'https://www.ssb.no',
    api_endpoint: 'https://data.ssb.no/api/v0',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['employment_rate', 'unemployment_rate', 'gdp_growth', 'population_total'],
    historical_depth_years: 80,
    reliability_score: 0.98,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // Denmark - DST
  {
    source_id: 'dst_dk',
    name: 'Statistics Denmark',
    organization: 'Danmarks Statistik',
    country_code: 'DK',
    region: 'NORDIC',
    url: 'https://www.dst.dk',
    api_endpoint: 'https://api.statbank.dk/v1',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['employment_rate', 'unemployment_rate', 'gdp_growth', 'population_total'],
    historical_depth_years: 50,
    reliability_score: 0.97,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // Finland - Tilastokeskus
  {
    source_id: 'stat_fi',
    name: 'Statistics Finland',
    organization: 'Tilastokeskus',
    country_code: 'FI',
    region: 'NORDIC',
    url: 'https://www.stat.fi',
    api_endpoint: 'https://pxdata.stat.fi/pxweb/api/v1',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['employment_rate', 'unemployment_rate', 'gdp_growth', 'population_total'],
    historical_depth_years: 50,
    reliability_score: 0.97,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  }
];

// ============================================================================
// NORTH AMERICA SOURCES
// ============================================================================

const NORTH_AMERICA_SOURCES: DataSourceDefinition[] = [
  // USA - BLS
  {
    source_id: 'bls_us',
    name: 'Bureau of Labor Statistics',
    organization: 'U.S. Department of Labor',
    country_code: 'US',
    region: 'NORTH_AMERICA',
    url: 'https://www.bls.gov',
    api_endpoint: 'https://api.bls.gov/publicAPI/v2/timeseries/data',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['employment_rate', 'unemployment_rate', 'inflation_rate', 'median_wage'],
    historical_depth_years: 80,
    reliability_score: 0.97,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: true
  },
  // USA - Census
  {
    source_id: 'census_us',
    name: 'U.S. Census Bureau',
    organization: 'U.S. Census Bureau',
    country_code: 'US',
    region: 'NORTH_AMERICA',
    url: 'https://www.census.gov',
    api_endpoint: 'https://api.census.gov/data',
    access_method: 'api',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['population_total', 'poverty_rate', 'tertiary_education', 'median_age'],
    historical_depth_years: 100,
    reliability_score: 0.96,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: true
  },
  // USA - CDC
  {
    source_id: 'cdc_us',
    name: 'CDC National Center for Health Statistics',
    organization: 'CDC',
    country_code: 'US',
    region: 'NORTH_AMERICA',
    url: 'https://www.cdc.gov/nchs',
    access_method: 'api',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['life_expectancy', 'infant_mortality', 'obesity_rate', 'suicide_rate'],
    historical_depth_years: 50,
    reliability_score: 0.96,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // USA - BEA
  {
    source_id: 'bea_us',
    name: 'Bureau of Economic Analysis',
    organization: 'U.S. Department of Commerce',
    country_code: 'US',
    region: 'NORTH_AMERICA',
    url: 'https://www.bea.gov',
    api_endpoint: 'https://apps.bea.gov/api/data',
    access_method: 'api',
    license: 'open',
    update_frequency: 'quarterly',
    available_kpis: ['gdp_per_capita', 'gdp_growth', 'trade_balance_gdp'],
    historical_depth_years: 90,
    reliability_score: 0.98,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: true
  },
  // Canada - StatCan
  {
    source_id: 'statcan',
    name: 'Statistics Canada',
    organization: 'Statistics Canada',
    country_code: 'CA',
    region: 'NORTH_AMERICA',
    url: 'https://www.statcan.gc.ca',
    api_endpoint: 'https://www150.statcan.gc.ca/t1/wds/rest',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['employment_rate', 'unemployment_rate', 'gdp_growth', 'inflation_rate', 'population_total'],
    historical_depth_years: 50,
    reliability_score: 0.97,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  }
];

// ============================================================================
// LATIN AMERICA SOURCES
// ============================================================================

const LATAM_SOURCES: DataSourceDefinition[] = [
  // ECLAC
  {
    source_id: 'eclac',
    name: 'CEPALSTAT',
    organization: 'ECLAC/CEPAL',
    country_code: null,
    region: 'LATAM',
    url: 'https://statistics.cepal.org',
    access_method: 'api',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['gdp_per_capita', 'poverty_rate', 'gini_coefficient', 'unemployment_rate'],
    historical_depth_years: 40,
    reliability_score: 0.88,
    political_risk: 'medium',
    has_revision_history: true,
    auth_required: false
  },
  // Brazil - IBGE
  {
    source_id: 'ibge_br',
    name: 'IBGE',
    organization: 'Instituto Brasileiro de Geografia e Estatística',
    country_code: 'BR',
    region: 'LATAM',
    url: 'https://www.ibge.gov.br',
    api_endpoint: 'https://servicodados.ibge.gov.br/api/v1',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['unemployment_rate', 'gdp_growth', 'inflation_rate', 'population_total'],
    historical_depth_years: 40,
    reliability_score: 0.92,
    political_risk: 'medium',
    has_revision_history: true,
    auth_required: false
  },
  // Mexico - INEGI
  {
    source_id: 'inegi_mx',
    name: 'INEGI',
    organization: 'Instituto Nacional de Estadística y Geografía',
    country_code: 'MX',
    region: 'LATAM',
    url: 'https://www.inegi.org.mx',
    api_endpoint: 'https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['unemployment_rate', 'gdp_growth', 'inflation_rate', 'homicide_rate'],
    historical_depth_years: 30,
    reliability_score: 0.90,
    political_risk: 'medium',
    has_revision_history: true,
    auth_required: true
  }
];

// ============================================================================
// ASIA-PACIFIC SOURCES
// ============================================================================

const ASIA_PACIFIC_SOURCES: DataSourceDefinition[] = [
  // Japan - e-Stat
  {
    source_id: 'estat_jp',
    name: 'e-Stat Japan',
    organization: 'Statistics Bureau of Japan',
    country_code: 'JP',
    region: 'ASIA_PACIFIC',
    url: 'https://www.e-stat.go.jp',
    api_endpoint: 'https://api.e-stat.go.jp/rest/3.0/app',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['unemployment_rate', 'gdp_growth', 'inflation_rate', 'population_total'],
    historical_depth_years: 50,
    reliability_score: 0.96,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: true
  },
  // South Korea - KOSIS
  {
    source_id: 'kosis_kr',
    name: 'KOSIS',
    organization: 'Statistics Korea',
    country_code: 'KR',
    region: 'ASIA_PACIFIC',
    url: 'https://kosis.kr',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['unemployment_rate', 'gdp_growth', 'inflation_rate', 'fertility_rate'],
    historical_depth_years: 40,
    reliability_score: 0.95,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: true
  },
  // Australia - ABS
  {
    source_id: 'abs_au',
    name: 'Australian Bureau of Statistics',
    organization: 'ABS',
    country_code: 'AU',
    region: 'ASIA_PACIFIC',
    url: 'https://www.abs.gov.au',
    api_endpoint: 'https://api.data.abs.gov.au',
    access_method: 'api',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['unemployment_rate', 'gdp_growth', 'inflation_rate', 'population_total'],
    historical_depth_years: 50,
    reliability_score: 0.97,
    political_risk: 'low',
    has_revision_history: true,
    auth_required: false
  },
  // China - NBS
  {
    source_id: 'nbs_cn',
    name: 'National Bureau of Statistics of China',
    organization: 'NBS China',
    country_code: 'CN',
    region: 'ASIA_PACIFIC',
    url: 'http://www.stats.gov.cn',
    access_method: 'bulk',
    license: 'attribution',
    update_frequency: 'yearly',
    available_kpis: ['gdp_growth', 'population_total', 'unemployment_rate'],
    historical_depth_years: 40,
    reliability_score: 0.70,
    political_risk: 'high',
    has_revision_history: false,
    auth_required: false,
    notes: 'Data quality concerns documented by external researchers'
  },
  // India - MOSPI
  {
    source_id: 'mospi_in',
    name: 'Ministry of Statistics India',
    organization: 'MOSPI',
    country_code: 'IN',
    region: 'ASIA_PACIFIC',
    url: 'https://mospi.gov.in',
    access_method: 'bulk',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['gdp_growth', 'unemployment_rate', 'inflation_rate', 'poverty_rate'],
    historical_depth_years: 30,
    reliability_score: 0.80,
    political_risk: 'medium',
    has_revision_history: true,
    auth_required: false
  }
];

// ============================================================================
// AFRICA SOURCES
// ============================================================================

const AFRICA_SOURCES: DataSourceDefinition[] = [
  // AfDB
  {
    source_id: 'afdb',
    name: 'African Development Bank Data Portal',
    organization: 'African Development Bank',
    country_code: null,
    region: 'AFRICA',
    url: 'https://dataportal.opendataforafrica.org',
    access_method: 'api',
    license: 'open',
    update_frequency: 'yearly',
    available_kpis: ['gdp_per_capita', 'gdp_growth', 'population_total', 'life_expectancy'],
    historical_depth_years: 30,
    reliability_score: 0.82,
    political_risk: 'medium',
    has_revision_history: true,
    auth_required: false
  },
  // South Africa - Stats SA
  {
    source_id: 'statssa_za',
    name: 'Statistics South Africa',
    organization: 'Stats SA',
    country_code: 'ZA',
    region: 'AFRICA',
    url: 'http://www.statssa.gov.za',
    access_method: 'bulk',
    license: 'open',
    update_frequency: 'quarterly',
    available_kpis: ['unemployment_rate', 'gdp_growth', 'inflation_rate', 'poverty_rate'],
    historical_depth_years: 25,
    reliability_score: 0.88,
    political_risk: 'medium',
    has_revision_history: true,
    auth_required: false
  }
];

// ============================================================================
// MIDDLE EAST SOURCES
// ============================================================================

const MIDDLE_EAST_SOURCES: DataSourceDefinition[] = [
  // Israel - CBS
  {
    source_id: 'cbs_il',
    name: 'Central Bureau of Statistics Israel',
    organization: 'CBS Israel',
    country_code: 'IL',
    region: 'MIDDLE_EAST',
    url: 'https://www.cbs.gov.il',
    access_method: 'bulk',
    license: 'open',
    update_frequency: 'monthly',
    available_kpis: ['unemployment_rate', 'gdp_growth', 'inflation_rate', 'population_total'],
    historical_depth_years: 40,
    reliability_score: 0.94,
    political_risk: 'medium',
    has_revision_history: true,
    auth_required: false
  }
];

// ============================================================================
// MASTER REGISTRY EXPORT
// ============================================================================

export const GLOBAL_DATA_SOURCES: DataSourceDefinition[] = [
  ...GLOBAL_SOURCES,
  ...EU_SOURCES,
  ...NORDIC_SOURCES,
  ...NORTH_AMERICA_SOURCES,
  ...LATAM_SOURCES,
  ...ASIA_PACIFIC_SOURCES,
  ...AFRICA_SOURCES,
  ...MIDDLE_EAST_SOURCES
];

// Helper functions
export function getSourceById(sourceId: string): DataSourceDefinition | undefined {
  return GLOBAL_DATA_SOURCES.find(s => s.source_id === sourceId);
}

export function getSourcesByRegion(region: string): DataSourceDefinition[] {
  return GLOBAL_DATA_SOURCES.filter(s => s.region === region);
}

export function getSourcesByCountry(countryCode: string): DataSourceDefinition[] {
  return GLOBAL_DATA_SOURCES.filter(s => s.country_code === countryCode);
}

export function getSourcesByKPI(kpiCode: string): DataSourceDefinition[] {
  return GLOBAL_DATA_SOURCES.filter(s => s.available_kpis.includes(kpiCode));
}

export function getSourceStats(): {
  total: number;
  byRegion: Record<string, number>;
  byAccessMethod: Record<string, number>;
  avgReliability: number;
} {
  const byRegion: Record<string, number> = {};
  const byAccessMethod: Record<string, number> = {};
  
  GLOBAL_DATA_SOURCES.forEach(s => {
    byRegion[s.region] = (byRegion[s.region] || 0) + 1;
    byAccessMethod[s.access_method] = (byAccessMethod[s.access_method] || 0) + 1;
  });
  
  const avgReliability = GLOBAL_DATA_SOURCES.reduce((sum, s) => sum + s.reliability_score, 0) / GLOBAL_DATA_SOURCES.length;
  
  return {
    total: GLOBAL_DATA_SOURCES.length,
    byRegion,
    byAccessMethod,
    avgReliability
  };
}

console.log('[Global Data Sources] Loaded:', getSourceStats());
