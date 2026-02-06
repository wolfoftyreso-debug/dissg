/**
 * PRE-CONFIGURED SOURCE REGISTRY
 * 
 * Tier 1-4 sources with authority levels and trust presets.
 * "Källan bär sitt rykte över hela systemet."
 */

import { SourceRegistryEntry, AuthorityLevel, UpdatePattern } from './types';

// ============================================
// TIER 1: INTERNATIONAL ORGANIZATIONS
// ============================================

export const TIER_1_SOURCES: Omit<SourceRegistryEntry, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    sourceCode: 'SRC-OECD-001',
    organization: 'OECD',
    organizationType: 'international',
    authorityLevel: 'Tier 1',
    dataDomains: ['Economy', 'Tax', 'Labor', 'Education', 'Health', 'Environment'],
    updatePattern: 'monthly',
    apiEndpoint: 'https://stats.oecd.org/SDMX-JSON',
    apiType: 'SDMX',
    historicalReliability: 0.97,
    methodologyStabilityYears: 15,
    metadata: {
      countries: 38,
      datasets: 200,
      sdmx_compliant: true,
    },
  },
  {
    sourceCode: 'SRC-WHO-001',
    organization: 'World Health Organization',
    organizationType: 'international',
    authorityLevel: 'Tier 1',
    dataDomains: ['Health', 'Mortality', 'Disease', 'Healthcare'],
    updatePattern: 'weekly',
    apiEndpoint: 'https://ghoapi.azureedge.net/api',
    apiType: 'REST',
    historicalReliability: 0.95,
    methodologyStabilityYears: 12,
    metadata: {
      countries: 194,
      indicators: 2100,
    },
  },
  {
    sourceCode: 'SRC-WB-001',
    organization: 'World Bank',
    organizationType: 'international',
    authorityLevel: 'Tier 1',
    dataDomains: ['Economy', 'Development', 'Poverty', 'Finance', 'Trade'],
    updatePattern: 'quarterly',
    apiEndpoint: 'https://api.worldbank.org/v2',
    apiType: 'REST',
    historicalReliability: 0.96,
    methodologyStabilityYears: 20,
    metadata: {
      countries: 217,
      indicators: 1600,
      historical_depth: '1960-present',
    },
  },
  {
    sourceCode: 'SRC-IMF-001',
    organization: 'International Monetary Fund',
    organizationType: 'international',
    authorityLevel: 'Tier 1',
    dataDomains: ['Economy', 'Finance', 'Trade', 'Currency'],
    updatePattern: 'monthly',
    apiEndpoint: 'https://dataservices.imf.org/REST/SDMX_JSON.svc',
    apiType: 'SDMX',
    historicalReliability: 0.98,
    methodologyStabilityYears: 25,
    metadata: {
      datasets: ['IFS', 'BOP', 'DOTS', 'GFS'],
    },
  },
  {
    sourceCode: 'SRC-UN-001',
    organization: 'United Nations Statistics Division',
    organizationType: 'international',
    authorityLevel: 'Tier 1',
    dataDomains: ['Population', 'Development', 'Trade', 'Environment', 'Crime'],
    updatePattern: 'annual',
    apiEndpoint: 'https://data.un.org/ws/rest',
    apiType: 'SDMX',
    historicalReliability: 0.94,
    methodologyStabilityYears: 18,
    metadata: {
      countries: 193,
      sdg_indicators: 231,
    },
  },
  {
    sourceCode: 'SRC-EU-001',
    organization: 'Eurostat',
    organizationType: 'international',
    authorityLevel: 'Tier 1',
    dataDomains: ['Economy', 'Population', 'Labor', 'Trade', 'Environment', 'Energy'],
    updatePattern: 'weekly',
    apiEndpoint: 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1',
    apiType: 'SDMX',
    historicalReliability: 0.98,
    methodologyStabilityYears: 22,
    metadata: {
      countries: 27,
      datasets: 5500,
      nuts_support: true,
    },
  },
  {
    sourceCode: 'SRC-ILO-001',
    organization: 'International Labour Organization',
    organizationType: 'international',
    authorityLevel: 'Tier 1',
    dataDomains: ['Labor', 'Employment', 'Wages', 'Social Protection'],
    updatePattern: 'monthly',
    apiEndpoint: 'https://www.ilo.org/sdmx/rest',
    apiType: 'SDMX',
    historicalReliability: 0.95,
    methodologyStabilityYears: 15,
    metadata: {
      ilostat_indicators: 150,
    },
  },
];

// ============================================
// TIER 2: NATIONAL STATISTICAL OFFICES
// ============================================

export const TIER_2_SOURCES: Omit<SourceRegistryEntry, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    sourceCode: 'SRC-SCB-001',
    organization: 'Statistics Sweden (SCB)',
    organizationType: 'government',
    authorityLevel: 'Tier 2',
    dataDomains: ['Economy', 'Population', 'Labor', 'Health', 'Education', 'Environment'],
    updatePattern: 'daily',
    apiEndpoint: 'https://api.scb.se/OV0104/v1/doris/sv/ssd',
    apiType: 'REST',
    historicalReliability: 0.96,
    methodologyStabilityYears: 20,
    metadata: {
      country: 'SE',
      regional_depth: 'kommun',
    },
  },
  {
    sourceCode: 'SRC-SSB-001',
    organization: 'Statistics Norway (SSB)',
    organizationType: 'government',
    authorityLevel: 'Tier 2',
    dataDomains: ['Economy', 'Population', 'Labor', 'Energy', 'Environment'],
    updatePattern: 'daily',
    apiEndpoint: 'https://data.ssb.no/api/v0',
    apiType: 'REST',
    historicalReliability: 0.97,
    methodologyStabilityYears: 18,
    metadata: {
      country: 'NO',
      regional_depth: 'kommune',
    },
  },
  {
    sourceCode: 'SRC-DESTATIS-001',
    organization: 'Federal Statistical Office of Germany',
    organizationType: 'government',
    authorityLevel: 'Tier 2',
    dataDomains: ['Economy', 'Population', 'Trade', 'Industry'],
    updatePattern: 'weekly',
    apiEndpoint: 'https://www-genesis.destatis.de/genesisWS/rest/2020',
    apiType: 'REST',
    historicalReliability: 0.98,
    methodologyStabilityYears: 25,
    metadata: {
      country: 'DE',
    },
  },
  {
    sourceCode: 'SRC-ONS-001',
    organization: 'Office for National Statistics (UK)',
    organizationType: 'government',
    authorityLevel: 'Tier 2',
    dataDomains: ['Economy', 'Population', 'Labor', 'Health', 'Crime'],
    updatePattern: 'weekly',
    apiEndpoint: 'https://api.beta.ons.gov.uk/v1',
    apiType: 'REST',
    historicalReliability: 0.95,
    methodologyStabilityYears: 15,
    metadata: {
      country: 'GB',
    },
  },
  {
    sourceCode: 'SRC-BLS-001',
    organization: 'Bureau of Labor Statistics (US)',
    organizationType: 'government',
    authorityLevel: 'Tier 2',
    dataDomains: ['Labor', 'Employment', 'Wages', 'Prices'],
    updatePattern: 'monthly',
    apiEndpoint: 'https://api.bls.gov/publicAPI/v2',
    apiType: 'REST',
    historicalReliability: 0.97,
    methodologyStabilityYears: 30,
    metadata: {
      country: 'US',
    },
  },
  {
    sourceCode: 'SRC-ESTAT-JP-001',
    organization: 'Statistics Bureau of Japan',
    organizationType: 'government',
    authorityLevel: 'Tier 2',
    dataDomains: ['Economy', 'Population', 'Labor', 'Industry'],
    updatePattern: 'monthly',
    apiEndpoint: 'https://api.e-stat.go.jp/rest/3.0',
    apiType: 'REST',
    historicalReliability: 0.96,
    methodologyStabilityYears: 20,
    metadata: {
      country: 'JP',
    },
  },
];

// ============================================
// TIER 3: RESEARCH INSTITUTIONS & CENTRAL BANKS
// ============================================

export const TIER_3_SOURCES: Omit<SourceRegistryEntry, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    sourceCode: 'SRC-RIKSBANK-001',
    organization: 'Sveriges Riksbank',
    organizationType: 'government',
    authorityLevel: 'Tier 3',
    dataDomains: ['Finance', 'Currency', 'Interest Rates', 'Inflation'],
    updatePattern: 'daily',
    apiEndpoint: 'https://www.riksbank.se/sv/statistik',
    apiType: 'file',
    historicalReliability: 0.98,
    methodologyStabilityYears: 30,
    metadata: {
      country: 'SE',
      specialty: 'monetary_policy',
    },
  },
  {
    sourceCode: 'SRC-ECB-001',
    organization: 'European Central Bank',
    organizationType: 'international',
    authorityLevel: 'Tier 3',
    dataDomains: ['Finance', 'Currency', 'Banking', 'Monetary Policy'],
    updatePattern: 'daily',
    apiEndpoint: 'https://sdw-wsrest.ecb.europa.eu/service/data',
    apiType: 'SDMX',
    historicalReliability: 0.98,
    methodologyStabilityYears: 20,
    metadata: {
      eurozone: true,
    },
  },
  {
    sourceCode: 'SRC-FRED-001',
    organization: 'Federal Reserve Economic Data',
    organizationType: 'government',
    authorityLevel: 'Tier 3',
    dataDomains: ['Economy', 'Finance', 'Employment', 'Prices'],
    updatePattern: 'daily',
    apiEndpoint: 'https://api.stlouisfed.org/fred/series',
    apiType: 'REST',
    historicalReliability: 0.97,
    methodologyStabilityYears: 25,
    metadata: {
      series_count: 800000,
      country: 'US',
    },
  },
  {
    sourceCode: 'SRC-GAPMINDER-001',
    organization: 'Gapminder Foundation',
    organizationType: 'academic',
    authorityLevel: 'Tier 3',
    dataDomains: ['Development', 'Health', 'Population', 'Economy'],
    updatePattern: 'annual',
    historicalReliability: 0.88,
    methodologyStabilityYears: 10,
    metadata: {
      specialty: 'long_term_trends',
      countries: 195,
    },
  },
];

// ============================================
// TIER 4: SECONDARY AGGREGATORS
// ============================================

export const TIER_4_SOURCES: Omit<SourceRegistryEntry, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    sourceCode: 'SRC-OWID-001',
    organization: 'Our World in Data',
    organizationType: 'academic',
    authorityLevel: 'Tier 4',
    dataDomains: ['Health', 'Population', 'Energy', 'Environment', 'Economy'],
    updatePattern: 'weekly',
    apiEndpoint: 'https://github.com/owid/owid-datasets',
    apiType: 'file',
    historicalReliability: 0.85,
    methodologyStabilityYears: 8,
    metadata: {
      open_source: true,
      citation_required: true,
    },
  },
  {
    sourceCode: 'SRC-TRADINGECO-001',
    organization: 'Trading Economics',
    organizationType: 'private',
    authorityLevel: 'Tier 4',
    dataDomains: ['Economy', 'Finance', 'Trade'],
    updatePattern: 'daily',
    historicalReliability: 0.75,
    methodologyStabilityYears: 5,
    metadata: {
      requires_license: true,
      aggregator: true,
    },
  },
];

// ============================================
// ALL SOURCES COMBINED
// ============================================

export const ALL_SOURCES = [
  ...TIER_1_SOURCES,
  ...TIER_2_SOURCES,
  ...TIER_3_SOURCES,
  ...TIER_4_SOURCES,
];

/**
 * Get source by code
 */
export function getSourceByCode(code: string) {
  return ALL_SOURCES.find(s => s.sourceCode === code);
}

/**
 * Get sources by authority level
 */
export function getSourcesByAuthority(level: AuthorityLevel) {
  return ALL_SOURCES.filter(s => s.authorityLevel === level);
}

/**
 * Get sources by domain
 */
export function getSourcesByDomain(domain: string) {
  return ALL_SOURCES.filter(s => s.dataDomains.includes(domain));
}

/**
 * Get total source count by tier
 */
export function getSourceStats() {
  return {
    tier1: TIER_1_SOURCES.length,
    tier2: TIER_2_SOURCES.length,
    tier3: TIER_3_SOURCES.length,
    tier4: TIER_4_SOURCES.length,
    total: ALL_SOURCES.length,
    domains: [...new Set(ALL_SOURCES.flatMap(s => s.dataDomains))],
    avgReliability: {
      tier1: avg(TIER_1_SOURCES.map(s => s.historicalReliability)),
      tier2: avg(TIER_2_SOURCES.map(s => s.historicalReliability)),
      tier3: avg(TIER_3_SOURCES.map(s => s.historicalReliability)),
      tier4: avg(TIER_4_SOURCES.map(s => s.historicalReliability)),
    },
  };
}

function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
