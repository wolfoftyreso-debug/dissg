/**
 * Copy templates for crystal-clear KPI communication
 * Following the "Supertydlighet" principles
 */

export interface CopyTemplate {
  changeText: (value: number, unit: string, direction: 'up' | 'down' | 'stable') => string;
  comparisonText: string;
  trendLabel: string;
  warningPrefix: string;
  clarificationNote?: string;
}

/**
 * Templates for different KPI types
 */
export const COPY_TEMPLATES: Record<string, CopyTemplate> = {
  // Percentage of population (e.g., employment rate, working age population)
  percentage_population: {
    changeText: (value, unit, direction) => {
      if (direction === 'stable') return 'Oförändrad';
      return `Har ${direction === 'up' ? 'ökat' : 'minskat'} med ${Math.abs(value).toFixed(1)} procentenheter`;
    },
    comparisonText: 'Jämfört med samma period förra året',
    trendLabel: 'Trend senaste 12 månaderna',
    warningPrefix: '⚠️ Kräver uppföljning',
  },

  // Absolute value (e.g., life expectancy, queue days)
  absolute_value: {
    changeText: (value, unit, direction) => {
      if (direction === 'stable') return 'Oförändrad';
      return `Har ${direction === 'up' ? 'ökat' : 'minskat'} med ${Math.abs(value).toLocaleString('sv-SE')} ${unit}`;
    },
    comparisonText: 'Jämfört med samma period förra året',
    trendLabel: 'Trend senaste 12 månaderna',
    warningPrefix: '⚠️ Kräver uppföljning',
  },

  // Deviation from baseline (e.g., excess mortality)
  deviation_baseline: {
    changeText: (value, unit, direction) => {
      if (direction === 'stable') return 'Oförändrad avvikelse';
      return `Avvikelsen har ${direction === 'up' ? 'ökat' : 'minskat'} med ${Math.abs(value).toFixed(1)} procentenheter`;
    },
    comparisonText: 'Jämfört med samma period förra året',
    trendLabel: 'Trend i avvikelsen',
    warningPrefix: '⚠️ Negativ utveckling',
    clarificationNote: 'Detta visar hur avvikelsen förändrats, inte den totala dödligheten.',
  },

  // Per capita / per 100,000 (e.g., crime rate)
  per_capita: {
    changeText: (value, unit, direction) => {
      if (direction === 'stable') return 'Oförändrad';
      return `Har ${direction === 'up' ? 'ökat' : 'minskat'} med ${Math.abs(value).toFixed(1)} fall per 100 000`;
    },
    comparisonText: 'Jämfört med samma period förra året',
    trendLabel: 'Trend senaste 12 månaderna',
    warningPrefix: '⚠️ Kräver uppföljning',
  },

  // Time duration (e.g., queue days, processing time)
  time_duration: {
    changeText: (value, unit, direction) => {
      if (direction === 'stable') return 'Oförändrad';
      return `Har ${direction === 'up' ? 'ökat' : 'minskat'} med ${Math.abs(Math.round(value))} dagar`;
    },
    comparisonText: 'Jämfört med samma period förra året',
    trendLabel: 'Trend senaste 12 månaderna',
    warningPrefix: '⚠️ Lång väntetid',
  },

  // Index value (e.g., energy stability, trust index)
  index_value: {
    changeText: (value, unit, direction) => {
      if (direction === 'stable') return 'Oförändrad';
      return `Har ${direction === 'up' ? 'ökat' : 'minskat'} med ${Math.abs(Math.round(value))} indexenheter`;
    },
    comparisonText: 'Jämfört med samma period förra året',
    trendLabel: 'Trend senaste 12 månaderna',
    warningPrefix: '⚠️ Lågt indexvärde',
  },

  // Ratio (e.g., dependency ratio)
  ratio: {
    changeText: (value, unit, direction) => {
      if (direction === 'stable') return 'Oförändrad';
      return `Har ${direction === 'up' ? 'ökat' : 'minskat'} med ${Math.abs(value).toFixed(2)} enheter`;
    },
    comparisonText: 'Jämfört med samma period förra året',
    trendLabel: 'Trend senaste 12 månaderna',
    warningPrefix: '⚠️ Högre kvot = fler att försörja per arbetande',
    clarificationNote: 'Denna kvot visar hur många icke-arbetande varje arbetande person försörjer.',
  },

  // Currency per capita (e.g., public cost per capita)
  currency_per_capita: {
    changeText: (value, unit, direction) => {
      if (direction === 'stable') return 'Oförändrad';
      const formattedValue = Math.abs(Math.round(value)).toLocaleString('sv-SE');
      return `Har ${direction === 'up' ? 'ökat' : 'minskat'} med ${formattedValue} SEK`;
    },
    comparisonText: 'Jämfört med samma period förra året',
    trendLabel: 'Trend senaste 12 månaderna',
    warningPrefix: '⚠️ Kostnad ökar',
  },
};

/**
 * Mapping from KPI ID to copy template type
 */
export const KPI_TEMPLATE_MAP: Record<string, keyof typeof COPY_TEMPLATES> = {
  life_expectancy: 'absolute_value',
  excess_mortality: 'deviation_baseline',
  working_age_functional: 'percentage_population',
  employment_rate_net: 'percentage_population',
  productivity_per_hour: 'index_value',
  long_term_exclusion: 'percentage_population',
  tax_base_growth: 'percentage_population',
  public_cost_per_capita: 'currency_per_capita',
  dependency_ratio: 'ratio',
  violent_crime_rate: 'per_capita',
  young_men_outside_system: 'percentage_population',
  substance_harm: 'per_capita',
  healthcare_queue_functional: 'time_duration',
  school_outcomes_grade9: 'percentage_population',
  justice_throughput: 'time_duration',
  housing_turnover: 'percentage_population',
  energy_stability: 'index_value',
  regional_divergence: 'index_value',
  institutional_trust: 'index_value',
  critical_imports: 'percentage_population',
};

/**
 * Get the appropriate copy template for a KPI
 */
export function getCopyTemplate(kpiId: string): CopyTemplate {
  const templateType = KPI_TEMPLATE_MAP[kpiId] || 'absolute_value';
  return COPY_TEMPLATES[templateType];
}

/**
 * Standard comparison periods
 */
export const COMPARISON_PERIODS = {
  sameLastYear: 'samma period förra året',
  lastQuarter: 'förra kvartalet',
  lastMonth: 'förra månaden',
  lastWeek: 'förra veckan',
  baseline: 'den historiska baslinjen',
} as const;

/**
 * Standard trend descriptions
 */
export function getTrendDescription(
  direction: 'up' | 'down' | 'stable',
  months: number = 12
): string {
  if (direction === 'stable') {
    return `Stabil trend senaste ${months} månaderna`;
  }
  return direction === 'up'
    ? `📈 Uppåtgående trend senaste ${months} månaderna`
    : `📉 Nedåtgående trend senaste ${months} månaderna`;
}

/**
 * Status labels in plain Swedish
 */
export const STATUS_LABELS = {
  positive: {
    short: 'Bra',
    long: 'Positiv utveckling',
    description: 'Måttet utvecklas i rätt riktning',
  },
  warning: {
    short: 'Varning',
    long: 'Kräver uppmärksamhet',
    description: 'Måttet avviker från önskad nivå',
  },
  critical: {
    short: 'Kritisk',
    long: 'Kräver åtgärd',
    description: 'Allvarlig avvikelse som kräver omedelbar uppmärksamhet',
  },
  neutral: {
    short: 'Stabil',
    long: 'Ingen tydlig trend',
    description: 'Måttet är stabilt utan tydlig riktning',
  },
} as const;
