/**
 * GLOBAL MASTER INDEX (GMI)
 * Ett gemensamt språk för hur samhällen utvecklas
 */

// GMI Pillars - The five stable global pillars
export interface GMIPillar {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  defaultWeight: number;
  indicators: GMIIndicator[];
  color: string;
}

export interface GMIIndicator {
  code: string;
  name: string;
  unit: string;
  source: string;
  availability: 'global' | 'oecd' | 'eu' | 'national';
  inverted?: boolean; // Higher is worse (e.g., mortality)
  description?: string;
}

export const gmiPillars: GMIPillar[] = [
  {
    id: 'health',
    name: 'Hälsa',
    nameEn: 'Health',
    icon: '🏥',
    description: 'Livslängd, dödlighet, självrapporterad hälsa',
    defaultWeight: 0.25,
    color: 'hsl(var(--chart-1))',
    indicators: [
      { code: 'life_expectancy', name: 'Medellivslängd', unit: 'år', source: 'WHO', availability: 'global' },
      { code: 'avoidable_mortality', name: 'Undvikbar dödlighet', unit: 'per 100k', source: 'Eurostat', availability: 'eu', inverted: true },
      { code: 'self_reported_health', name: 'Självrapporterad hälsa', unit: '%', source: 'EU-SILC', availability: 'eu' },
      { code: 'infant_mortality', name: 'Spädbarnsdödlighet', unit: 'per 1000', source: 'WHO', availability: 'global', inverted: true },
      { code: 'healthcare_access', name: 'Tillgång till vård', unit: 'index', source: 'OECD', availability: 'oecd' },
    ],
  },
  {
    id: 'workforce',
    name: 'Arbetsförmåga',
    nameEn: 'Workforce Capacity',
    icon: '💼',
    description: 'Sysselsättning, arbetskraftsdeltagande, sjukfrånvaro',
    defaultWeight: 0.20,
    color: 'hsl(var(--chart-2))',
    indicators: [
      { code: 'employment_rate', name: 'Sysselsättningsgrad', unit: '%', source: 'ILO', availability: 'global' },
      { code: 'labor_participation', name: 'Arbetskraftsdeltagande', unit: '%', source: 'ILO', availability: 'global' },
      { code: 'long_term_sick_leave', name: 'Långvarig sjukfrånvaro', unit: '%', source: 'Eurostat', availability: 'eu', inverted: true },
      { code: 'unemployment_rate', name: 'Arbetslöshet', unit: '%', source: 'ILO', availability: 'global', inverted: true },
      { code: 'youth_neet', name: 'NEET (15-24)', unit: '%', source: 'OECD', availability: 'oecd', inverted: true },
    ],
  },
  {
    id: 'economy',
    name: 'Ekonomisk bärkraft',
    nameEn: 'Economic Sustainability',
    icon: '💰',
    description: 'BNP per capita, produktivitet, inkomstutveckling',
    defaultWeight: 0.20,
    color: 'hsl(var(--chart-3))',
    indicators: [
      { code: 'gdp_per_capita_ppp', name: 'BNP per capita (PPP)', unit: 'USD', source: 'World Bank', availability: 'global' },
      { code: 'labor_productivity', name: 'Arbetsproduktivitet', unit: 'USD/timme', source: 'OECD', availability: 'oecd' },
      { code: 'real_income_growth', name: 'Real inkomstutveckling', unit: '%', source: 'World Bank', availability: 'global' },
      { code: 'gini_coefficient', name: 'Gini-koefficient', unit: 'index', source: 'World Bank', availability: 'global', inverted: true },
      { code: 'government_debt', name: 'Statsskuld', unit: '% av BNP', source: 'IMF', availability: 'global', inverted: true },
    ],
  },
  {
    id: 'education',
    name: 'Utbildning & humankapital',
    nameEn: 'Education & Human Capital',
    icon: '🎓',
    description: 'Utbildningsnivå, skolnärvaro, grundläggande färdigheter',
    defaultWeight: 0.20,
    color: 'hsl(var(--chart-4))',
    indicators: [
      { code: 'tertiary_education', name: 'Högre utbildning (25-64)', unit: '%', source: 'OECD', availability: 'oecd' },
      { code: 'school_enrollment', name: 'Inskrivningsgrad', unit: '%', source: 'UNESCO', availability: 'global' },
      { code: 'pisa_average', name: 'PISA genomsnitt', unit: 'poäng', source: 'OECD', availability: 'oecd' },
      { code: 'adult_literacy', name: 'Läskunnighet (vuxna)', unit: '%', source: 'UNESCO', availability: 'global' },
      { code: 'early_leavers', name: 'Avhopp från skolan', unit: '%', source: 'Eurostat', availability: 'eu', inverted: true },
    ],
  },
  {
    id: 'stability',
    name: 'Social stabilitet',
    nameEn: 'Social Stability',
    icon: '🤝',
    description: 'Brottslighet, tillit, institutionell stabilitet',
    defaultWeight: 0.15,
    color: 'hsl(var(--chart-5))',
    indicators: [
      { code: 'homicide_rate', name: 'Mordfrekvens', unit: 'per 100k', source: 'UNODC', availability: 'global', inverted: true },
      { code: 'social_trust', name: 'Mellanmänsklig tillit', unit: '%', source: 'WVS', availability: 'global' },
      { code: 'rule_of_law', name: 'Rättsstat', unit: 'index', source: 'WJP', availability: 'global' },
      { code: 'corruption_index', name: 'Korruptionsindex', unit: 'index', source: 'TI', availability: 'global' },
      { code: 'voter_turnout', name: 'Valdeltagande', unit: '%', source: 'IDEA', availability: 'global' },
    ],
  },
];

// Data quality levels
export type DataQuality = 'high' | 'medium' | 'low';
export type ComparabilityLevel = 'full' | 'partial' | 'limited';

export interface DataQualityConfig {
  label: string;
  description: string;
  opacity: number;
  color: string;
}

export const dataQualityConfig: Record<DataQuality, DataQualityConfig> = {
  high: {
    label: 'Hög',
    description: 'Fullständig data från verifierade källor',
    opacity: 1.0,
    color: 'text-green-500',
  },
  medium: {
    label: 'Medel',
    description: 'Viss data saknas eller är estimerad',
    opacity: 0.7,
    color: 'text-yellow-500',
  },
  low: {
    label: 'Låg',
    description: 'Betydande dataluckor, använd med försiktighet',
    opacity: 0.4,
    color: 'text-orange-500',
  },
};

export const comparabilityConfig: Record<ComparabilityLevel, {
  label: string;
  description: string;
  color: string;
}> = {
  full: {
    label: 'Full jämförbarhet',
    description: 'Harmoniserade definitioner och metoder',
    color: 'text-green-500',
  },
  partial: {
    label: 'Delvis jämförbar',
    description: 'Vissa metodskillnader kan påverka',
    color: 'text-yellow-500',
  },
  limited: {
    label: 'Begränsad jämförbarhet',
    description: 'Betydande skillnader i definitioner',
    color: 'text-orange-500',
  },
};

// GMI calculation configuration
export interface GMIConfig {
  version: string;
  normalization: 'percentile' | 'zscore' | 'minmax';
  timeWindow: {
    level: number; // months for current level
    trend: number; // months for trend calculation
    acceleration: number; // months for acceleration
  };
  missingDataHandling: 'exclude' | 'impute' | 'penalize';
  weightAdjustmentLimit: number; // max deviation from default (e.g., 0.05 = ±5%)
}

export const defaultGMIConfig: GMIConfig = {
  version: 'v1.0',
  normalization: 'percentile',
  timeWindow: {
    level: 12,
    trend: 24,
    acceleration: 36,
  },
  missingDataHandling: 'exclude',
  weightAdjustmentLimit: 0.05,
};

// Weight presets for different contexts
export interface WeightPreset {
  id: string;
  name: string;
  description: string;
  weights: Record<string, number>;
  applicableTo: string[]; // country codes or 'global'
}

export const weightPresets: WeightPreset[] = [
  {
    id: 'global_standard',
    name: 'Global standard',
    description: 'Standardvikter för global jämförelse',
    weights: {
      health: 0.25,
      workforce: 0.20,
      economy: 0.20,
      education: 0.20,
      stability: 0.15,
    },
    applicableTo: ['global'],
  },
  {
    id: 'eu_focus',
    name: 'EU-fokus',
    description: 'Anpassat för EU-länder med mer arbetsmarknadsdata',
    weights: {
      health: 0.22,
      workforce: 0.25,
      economy: 0.18,
      education: 0.20,
      stability: 0.15,
    },
    applicableTo: ['eu'],
  },
  {
    id: 'nordic_model',
    name: 'Nordisk modell',
    description: 'Betonar välfärd och jämlikhet',
    weights: {
      health: 0.25,
      workforce: 0.22,
      economy: 0.15,
      education: 0.22,
      stability: 0.16,
    },
    applicableTo: ['SE', 'NO', 'DK', 'FI', 'IS'],
  },
];

// Helper functions
export function getPillarById(id: string): GMIPillar | undefined {
  return gmiPillars.find(p => p.id === id);
}

export function getTotalDefaultWeight(): number {
  return gmiPillars.reduce((sum, p) => sum + p.defaultWeight, 0);
}

export function validateWeights(weights: Record<string, number>): boolean {
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  return Math.abs(total - 1.0) < 0.001;
}

export function getIndicatorAvailability(countryBloc: string | null): GMIIndicator[] {
  const availableLevels: ('global' | 'oecd' | 'eu' | 'national')[] = ['global'];
  
  if (countryBloc === 'oecd' || countryBloc === 'eu') {
    availableLevels.push('oecd');
  }
  if (countryBloc === 'eu') {
    availableLevels.push('eu');
  }
  
  return gmiPillars.flatMap(p => 
    p.indicators.filter(i => availableLevels.includes(i.availability))
  );
}
