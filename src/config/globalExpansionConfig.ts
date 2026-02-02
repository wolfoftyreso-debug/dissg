/**
 * DEL XXX — GLOBAL EXPANSION
 * EU → OECD → Globalt (lager för lager)
 * 
 * Konfiguration för globalt samhälls-operativsystem med adaptivt djup per land
 */

// Data depth levels
export type DataDepthLevel = 'global_baseline' | 'regional_bloc' | 'national_deep';

export const dataDepthConfig: Record<DataDepthLevel, {
  label: string;
  description: string;
  color: string;
  features: string[];
}> = {
  global_baseline: {
    label: 'Global Baseline',
    description: 'Grundläggande indikatorer för alla länder',
    color: 'bg-green-500/20 text-green-500',
    features: [
      'Befolkning',
      'Livslängd',
      'BNP per capita',
      'Sysselsättning (grov)',
      'Utbildning (grov)',
      'Hälsa (grov)',
      'Migration (nettoflöden)',
    ],
  },
  regional_bloc: {
    label: 'Regional Bloc',
    description: 'Utökad data för EU/OECD-länder',
    color: 'bg-blue-500/20 text-blue-500',
    features: [
      'Regional nivå (NUTS)',
      'Köns- och åldersuppdelning',
      'Arbetsmarknad',
      'Detaljerad hälsa',
      'Detaljerad migration',
      'Välfärdsindikatorer',
      'Tidsserier av hög kvalitet',
    ],
  },
  national_deep: {
    label: 'Nationellt djup',
    description: 'Fullständigt djup med ansvar och simulering',
    color: 'bg-purple-500/20 text-purple-500',
    features: [
      'Kommun/stad',
      'Kluster',
      'Ansvarsmodell',
      'Politikerprofiler',
      'Intelligence Feeds',
      'Simulering',
      'Beslutsunderlag',
    ],
  },
};

// Regional blocs
export const regionalBlocs = {
  eu: {
    name: 'Europeiska unionen',
    code: 'eu',
    color: '#003399',
    dataDepth: 'regional_bloc' as DataDepthLevel,
    primarySource: 'eurostat',
  },
  oecd: {
    name: 'OECD',
    code: 'oecd',
    color: '#0077B5',
    dataDepth: 'regional_bloc' as DataDepthLevel,
    primarySource: 'oecd',
  },
  nordic: {
    name: 'Norden',
    code: 'nordic',
    color: '#003366',
    dataDepth: 'regional_bloc' as DataDepthLevel,
    primarySource: 'eurostat',
  },
};

// Regions for grouping
export const regions = {
  europe: { name: 'Europa', emoji: '🇪🇺' },
  north_america: { name: 'Nordamerika', emoji: '🌎' },
  south_america: { name: 'Sydamerika', emoji: '🌎' },
  asia_pacific: { name: 'Asien-Stillahavsregionen', emoji: '🌏' },
  africa: { name: 'Afrika', emoji: '🌍' },
  middle_east: { name: 'Mellanöstern', emoji: '🌍' },
};

// Global Master Index components
export const gmiComponents = [
  {
    id: 'health',
    name: 'Hälsa',
    icon: '🏥',
    description: 'Livslängd, dödlighet, sjukvård',
    defaultWeight: 0.20,
    kpis: ['life_expectancy', 'infant_mortality', 'healthcare_access'],
  },
  {
    id: 'workforce',
    name: 'Arbetsförmåga',
    icon: '💼',
    description: 'Sysselsättning, produktivitet',
    defaultWeight: 0.25,
    kpis: ['employment_rate', 'labor_productivity', 'unemployment'],
  },
  {
    id: 'economy',
    name: 'Ekonomisk bärkraft',
    icon: '💰',
    description: 'BNP, skuld, hållbarhet',
    defaultWeight: 0.20,
    kpis: ['gdp_per_capita', 'government_debt', 'fiscal_balance'],
  },
  {
    id: 'education',
    name: 'Utbildning',
    icon: '🎓',
    description: 'Kompetens, PISA, utbildningsnivå',
    defaultWeight: 0.15,
    kpis: ['pisa_score', 'tertiary_education', 'adult_literacy'],
  },
  {
    id: 'stability',
    name: 'Social stabilitet',
    icon: '🤝',
    description: 'Brottslighet, integration, tillit',
    defaultWeight: 0.20,
    kpis: ['crime_rate', 'social_trust', 'inequality_gini'],
  },
];

// Comparability levels
export type ComparabilityLevel = 'full' | 'partial' | 'limited' | 'none';

export const comparabilityConfig: Record<ComparabilityLevel, {
  label: string;
  description: string;
  color: string;
  score: { min: number; max: number };
}> = {
  full: {
    label: 'Full jämförbarhet',
    description: 'Samma definitioner och hög datakvalitet',
    color: 'text-green-500',
    score: { min: 0.85, max: 1.0 },
  },
  partial: {
    label: 'Delvis jämförbar',
    description: 'Liknande definitioner, viss metodskillnad',
    color: 'text-yellow-500',
    score: { min: 0.60, max: 0.84 },
  },
  limited: {
    label: 'Begränsad jämförbarhet',
    description: 'Olika definitioner eller datakvalitet',
    color: 'text-orange-500',
    score: { min: 0.30, max: 0.59 },
  },
  none: {
    label: 'Ej jämförbar',
    description: 'Kan inte meningsfullt jämföras',
    color: 'text-red-500',
    score: { min: 0, max: 0.29 },
  },
};

// Data source configurations
export const globalDataSources = {
  worldbank: {
    name: 'World Bank',
    coverage: 'global',
    depth: 'global_baseline' as DataDepthLevel,
    reliability: 95,
    url: 'https://data.worldbank.org',
  },
  who: {
    name: 'WHO',
    coverage: 'global',
    depth: 'global_baseline' as DataDepthLevel,
    reliability: 90,
    url: 'https://www.who.int/data',
  },
  imf: {
    name: 'IMF',
    coverage: 'global',
    depth: 'global_baseline' as DataDepthLevel,
    reliability: 95,
    url: 'https://www.imf.org/en/Data',
  },
  undp: {
    name: 'UNDP',
    coverage: 'global',
    depth: 'global_baseline' as DataDepthLevel,
    reliability: 90,
    url: 'https://hdr.undp.org/data-center',
  },
  oecd: {
    name: 'OECD',
    coverage: 'oecd',
    depth: 'regional_bloc' as DataDepthLevel,
    reliability: 95,
    url: 'https://data.oecd.org',
  },
  eurostat: {
    name: 'Eurostat',
    coverage: 'eu',
    depth: 'regional_bloc' as DataDepthLevel,
    reliability: 95,
    url: 'https://ec.europa.eu/eurostat',
  },
};

// API tier access
export const apiTierAccess = {
  free: {
    name: 'Free',
    depth: 'global_baseline' as DataDepthLevel,
    features: [
      'Country-level KPIs',
      'Global masterindex',
      'Jämförelser',
      'Ranking (med osäkerhetsflagga)',
    ],
  },
  plus: {
    name: 'Plus',
    depth: 'regional_bloc' as DataDepthLevel,
    features: [
      'Regional data',
      'Korrelationer',
      'Demografi',
      'Trends',
    ],
  },
  pro: {
    name: 'Pro',
    depth: 'national_deep' as DataDepthLevel,
    features: [
      'Ansvar',
      'Feeds',
      'Simulering',
      'Beslutsunderlag',
    ],
  },
};

// Helper to get comparability level from score
export function getComparabilityLevel(score: number): ComparabilityLevel {
  if (score >= 0.85) return 'full';
  if (score >= 0.60) return 'partial';
  if (score >= 0.30) return 'limited';
  return 'none';
}

// Helper to check if feature is available for country
export function isFeatureAvailable(
  dataDepth: DataDepthLevel,
  feature: 'regional' | 'municipal' | 'responsibility' | 'feeds' | 'simulation'
): boolean {
  const depthOrder: DataDepthLevel[] = ['global_baseline', 'regional_bloc', 'national_deep'];
  const requiredDepth: Record<string, DataDepthLevel> = {
    regional: 'regional_bloc',
    municipal: 'national_deep',
    responsibility: 'national_deep',
    feeds: 'national_deep',
    simulation: 'national_deep',
  };
  
  const currentIndex = depthOrder.indexOf(dataDepth);
  const requiredIndex = depthOrder.indexOf(requiredDepth[feature]);
  
  return currentIndex >= requiredIndex;
}
