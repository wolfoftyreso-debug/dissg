/**
 * EU-DJUPET: Konfiguration för NUTS-hierarki och EU-data
 * 
 * Eurostat-harmoniserade indikatorer med regional granularitet
 */

// NUTS-nivåer
export type NutsLevel = 0 | 1 | 2 | 3;

export const nutsLevelConfig: Record<NutsLevel, {
  label: string;
  description: string;
  typicalPopulation: string;
  examples: string[];
}> = {
  0: {
    label: 'NUTS 0 (Land)',
    description: 'Nationell nivå',
    typicalPopulation: '> 3 miljoner',
    examples: ['Sverige', 'Tyskland', 'Frankrike'],
  },
  1: {
    label: 'NUTS 1 (Storregion)',
    description: 'Större regioner eller landsdelar',
    typicalPopulation: '3-7 miljoner',
    examples: ['Östra Sverige', 'Bayern', 'Île-de-France'],
  },
  2: {
    label: 'NUTS 2 (Region)',
    description: 'Standardnivå för EU:s regionalpolitik',
    typicalPopulation: '800k - 3 miljoner',
    examples: ['Stockholm', 'Lombardia', 'Cataluña'],
  },
  3: {
    label: 'NUTS 3 (Mindre region)',
    description: 'Finmaskig nivå för detaljanalys',
    typicalPopulation: '150k - 800k',
    examples: ['Uppsala län', 'Köln', 'Barcelona'],
  },
};

// EU-datakällor
export const euDataSources = {
  eurostat: {
    name: 'Eurostat',
    code: 'eurostat',
    icon: '🇪🇺',
    description: 'EU:s officiella statistikbyrå',
    categories: ['economy', 'workforce', 'health', 'education', 'migration', 'demography'],
    reliability: 95,
    nutsSupport: [0, 1, 2, 3] as NutsLevel[],
    apiBase: 'https://ec.europa.eu/eurostat/api/dissemination',
  },
  ecdc: {
    name: 'ECDC',
    code: 'ecdc',
    icon: '🏥',
    description: 'Europeiskt centrum för sjukdomskontroll',
    categories: ['health', 'epidemiology'],
    reliability: 92,
    nutsSupport: [0, 1] as NutsLevel[],
    apiBase: 'https://opendata.ecdc.europa.eu/api',
  },
  ecb: {
    name: 'ECB',
    code: 'ecb',
    icon: '🏦',
    description: 'Europeiska centralbanken',
    categories: ['economy', 'finance', 'monetary'],
    reliability: 98,
    nutsSupport: [0] as NutsLevel[],
    apiBase: 'https://data.ecb.europa.eu/data/api',
  },
  eea: {
    name: 'EEA',
    code: 'eea',
    icon: '🌿',
    description: 'Europeiska miljöbyrån',
    categories: ['environment', 'climate', 'energy'],
    reliability: 90,
    nutsSupport: [0, 1, 2] as NutsLevel[],
    apiBase: 'https://discomap.eea.europa.eu/api',
  },
};

// EU KPI-kategorier
export const euKpiCategories = {
  workforce: {
    name: 'Arbetsförmåga',
    icon: '💼',
    description: 'Sysselsättning, arbetslöshet, arbetsmarknad',
    kpis: ['eu_employment_rate', 'eu_unemployment', 'eu_long_term_unemployment', 'eu_youth_unemployment'],
  },
  economy: {
    name: 'Ekonomi',
    icon: '💰',
    description: 'BNP, produktivitet, inkomster',
    kpis: ['eu_gdp_per_capita_ppp', 'eu_productivity', 'eu_real_income_growth', 'eu_gini'],
  },
  health: {
    name: 'Hälsa',
    icon: '🏥',
    description: 'Dödlighet, livslängd, sjukvård',
    kpis: ['eu_preventable_mortality', 'eu_life_expectancy', 'eu_healthy_life_years', 'eu_healthcare_expenditure'],
  },
  education: {
    name: 'Utbildning',
    icon: '🎓',
    description: 'Utbildningsnivå, skolavhopp',
    kpis: ['eu_tertiary_education', 'eu_early_leavers', 'eu_neet'],
  },
  migration: {
    name: 'Migration & Demografi',
    icon: '👥',
    description: 'Befolkningsrörelser, åldersstruktur',
    kpis: ['eu_foreign_born', 'eu_net_migration', 'eu_dependency_ratio'],
  },
};

// EU-feeds konfiguration
export const euFeedTiers = {
  open: {
    label: 'Öppen',
    description: 'Gratis veckosammanfattningar',
    feeds: ['eu_weekly_summary', 'eu_top_changes'],
    color: 'bg-green-500/20 text-green-500',
  },
  plus: {
    label: 'Plus',
    description: 'Regionala anomalier och trender',
    feeds: ['eu_regional_anomalies', 'eu_emerging_trends'],
    color: 'bg-blue-500/20 text-blue-500',
  },
  pro: {
    label: 'Pro',
    description: 'Fullständig intelligens och varningar',
    feeds: ['eu_priority_alerts', 'eu_structural_decline', 'eu_policy_sensitive', 'eu_cluster_shifts'],
    color: 'bg-purple-500/20 text-purple-500',
  },
};

// Klusterkonfiguration
export const euClusterTypes = {
  economic: {
    name: 'Ekonomiska',
    description: 'Baserat på produktivitet, BNP och sysselsättning',
    icon: '📊',
  },
  structural: {
    name: 'Strukturella',
    description: 'Baserat på näringslivsstruktur och innovation',
    icon: '🏗️',
  },
  demographic: {
    name: 'Demografiska',
    description: 'Baserat på åldersstruktur och befolkningsutveckling',
    icon: '👥',
  },
};

// Jämförbarhetskonfiguration för EU-data
export const euComparabilityRules = {
  full: {
    label: 'Full jämförbarhet',
    description: 'Harmoniserade definitioner, hög datakvalitet',
    minScore: 0.90,
    badge: '✓ EU-standard',
    color: 'text-green-500',
  },
  high: {
    label: 'Hög jämförbarhet',
    description: 'Mindre metodskillnader, justerbara',
    minScore: 0.75,
    badge: '~ Jämförbar',
    color: 'text-blue-500',
  },
  medium: {
    label: 'Begränsad jämförbarhet',
    description: 'Definitionsskillnader eller datakvalitetsvariationer',
    minScore: 0.50,
    badge: '⚠ Begränsad',
    color: 'text-yellow-500',
  },
  low: {
    label: 'Låg jämförbarhet',
    description: 'Betydande metodskillnader',
    minScore: 0,
    badge: '⚠ Ej jämförbar',
    color: 'text-red-500',
  },
};

// Helper för att bestämma jämförbarhetsnivå
export function getEuComparabilityLevel(score: number): keyof typeof euComparabilityRules {
  if (score >= 0.90) return 'full';
  if (score >= 0.75) return 'high';
  if (score >= 0.50) return 'medium';
  return 'low';
}

// Helper för att formatera NUTS-kod
export function formatNutsCode(code: string): { level: NutsLevel; country: string; region?: string } {
  const country = code.substring(0, 2);
  const level = (code.length - 2) as NutsLevel;
  return {
    level: Math.min(level, 3) as NutsLevel,
    country,
    region: code.length > 2 ? code : undefined,
  };
}

// UI-standardinställningar
export const euDefaultSettings = {
  defaultNutsLevel: 2 as NutsLevel,
  showNuts3OnlyWhenQualitySufficient: true,
  minPopulationForNuts3: 100000,
  defaultTimeRange: '5y',
  showUncertaintyBands: true,
  clusteringEnabled: true,
};
