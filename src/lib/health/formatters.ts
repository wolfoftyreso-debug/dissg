/**
 * Health Data Formatters
 * Consistent, neutral presentation of health data
 */

import type { HealthPolicyPeriod } from '@/types/health';

/**
 * Format DALYs with proper context
 */
export function formatDALYs(value: number, per100k: boolean = true): string {
  if (per100k) {
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} per 100,000`;
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

/**
 * Format life expectancy
 */
export function formatLifeExpectancy(years: number): string {
  return `${years.toFixed(1)} years`;
}

/**
 * Format mortality rate
 */
export function formatMortalityRate(value: number, denominator: string = '100,000'): string {
  return `${value.toFixed(1)} per ${denominator}`;
}

/**
 * Format prevalence as percentage
 */
export function formatPrevalence(value: number): string {
  if (value >= 1) {
    return `${value.toFixed(1)}%`;
  }
  return `${value.toFixed(2)}%`;
}

/**
 * Format healthcare capacity metrics
 */
export function formatCapacityMetric(
  value: number, 
  type: 'physicians' | 'nurses' | 'beds'
): string {
  const labels = {
    physicians: 'physicians per 10,000',
    nurses: 'nurses per 10,000',
    beds: 'hospital beds per 10,000'
  };
  return `${value.toFixed(1)} ${labels[type]}`;
}

/**
 * Format health expenditure
 */
export function formatHealthExpenditure(
  pctGdp?: number,
  perCapita?: number
): string {
  const parts: string[] = [];
  if (pctGdp !== undefined) {
    parts.push(`${pctGdp.toFixed(1)}% of GDP`);
  }
  if (perCapita !== undefined) {
    parts.push(`$${perCapita.toFixed(0)} per capita`);
  }
  return parts.join(' / ') || 'No data';
}

/**
 * Format trend as neutral observation
 */
export function formatTrendObservation(
  currentValue: number,
  previousValue: number,
  unit: string
): string {
  const change = currentValue - previousValue;
  const pctChange = previousValue !== 0 
    ? ((change / previousValue) * 100).toFixed(1)
    : 'N/A';
  
  if (change > 0) {
    return `Increased by ${Math.abs(change).toFixed(1)} ${unit} (+${pctChange}%)`;
  } else if (change < 0) {
    return `Decreased by ${Math.abs(change).toFixed(1)} ${unit} (${pctChange}%)`;
  }
  return 'No change observed';
}

/**
 * Format age group for display
 */
export function formatAgeGroup(ageGroup: string): string {
  if (ageGroup === 'all') return 'All ages';
  if (ageGroup.includes('-')) {
    const [start, end] = ageGroup.split('-');
    return `Ages ${start}–${end}`;
  }
  if (ageGroup.endsWith('+')) {
    return `Ages ${ageGroup.replace('+', '')} and older`;
  }
  return ageGroup;
}

/**
 * Format sex/gender for display
 */
export function formatSex(sex: 'both' | 'male' | 'female'): string {
  const labels = {
    both: 'All sexes',
    male: 'Male',
    female: 'Female'
  };
  return labels[sex];
}

/**
 * Generate "What happened when..." summary
 */
export function generateWhatHappenedSummary(
  indicator: string,
  beforeValue: number,
  afterValue: number,
  beforePeriod: string,
  afterPeriod: string,
  unit: string
): string {
  const change = afterValue - beforeValue;
  const direction = change > 0 ? 'increased' : change < 0 ? 'decreased' : 'remained stable';
  const magnitude = Math.abs(change).toFixed(1);
  
  return `${indicator} ${direction} from ${beforeValue.toFixed(1)} ${unit} (${beforePeriod}) to ${afterValue.toFixed(1)} ${unit} (${afterPeriod}) — a change of ${magnitude} ${unit}.`;
}

/**
 * Format policy period for timeline display
 */
export function formatPolicyPeriod(policy: HealthPolicyPeriod): {
  title: string;
  dateRange: string;
  isOngoing: boolean;
} {
  const startYear = new Date(policy.start_date).getFullYear();
  const endYear = policy.end_date 
    ? new Date(policy.end_date).getFullYear() 
    : null;
  
  return {
    title: policy.name,
    dateRange: endYear ? `${startYear}–${endYear}` : `${startYear}–present`,
    isOngoing: !policy.end_date
  };
}

/**
 * Generate confidence statement
 */
export function formatConfidenceStatement(
  confidence: number,
  isEstimated: boolean
): string {
  if (isEstimated) {
    return `Estimated value (confidence: ${confidence}%)`;
  }
  if (confidence >= 90) {
    return 'High confidence';
  }
  if (confidence >= 70) {
    return 'Moderate confidence';
  }
  return `Lower confidence (${confidence}%)`;
}

/**
 * Format data source attribution
 */
export function formatDataSource(
  sourceCode: string,
  sourceUrl?: string
): { name: string; url?: string } {
  const sourceNames: Record<string, string> = {
    'WHO': 'World Health Organization',
    'GBD': 'Global Burden of Disease Study',
    'OECD': 'Organisation for Economic Co-operation and Development',
    'EUROSTAT': 'Eurostat',
    'CDC': 'U.S. Centers for Disease Control and Prevention',
    'ECDC': 'European Centre for Disease Prevention and Control',
    'IHME': 'Institute for Health Metrics and Evaluation',
    'EMCDDA': 'European Monitoring Centre for Drugs and Drug Addiction',
    'UNODC': 'United Nations Office on Drugs and Crime'
  };
  
  return {
    name: sourceNames[sourceCode] || sourceCode,
    url: sourceUrl
  };
}

/**
 * Generate "This shows / This does not show" block
 */
export function generateInterpretationGuide(
  indicatorType: 'disease_burden' | 'life_expectancy' | 'substance_prevalence' | 'healthcare_capacity'
): { shows: string[]; doesNotShow: string[] } {
  const guides: Record<string, { shows: string[]; doesNotShow: string[] }> = {
    disease_burden: {
      shows: [
        'Years of healthy life lost to disease and disability (DALYs)',
        'Relative impact of different health conditions on population',
        'Changes in disease patterns over time'
      ],
      doesNotShow: [
        'Individual risk of developing a condition',
        'Effectiveness of treatments',
        'Quality of care provided',
        'Subjective experience of illness'
      ]
    },
    life_expectancy: {
      shows: [
        'Average years a newborn is expected to live given current mortality rates',
        'Differences between populations',
        'Trends over time'
      ],
      doesNotShow: [
        'How long any individual will live',
        'Quality of those years',
        'Causes of death',
        'Future changes in mortality'
      ]
    },
    substance_prevalence: {
      shows: [
        'Estimated percentage of population reporting use',
        'Differences across time, age groups, or regions',
        'Survey-based estimates with margins of error'
      ],
      doesNotShow: [
        'Individual patterns of use',
        'Whether use is problematic',
        'Causation with health outcomes',
        'Undetected use'
      ]
    },
    healthcare_capacity: {
      shows: [
        'Resources available per population',
        'Investment levels',
        'System capacity indicators'
      ],
      doesNotShow: [
        'Quality of care delivered',
        'Patient outcomes',
        'Accessibility for individuals',
        'Efficiency of resource use'
      ]
    }
  };
  
  return guides[indicatorType] || { shows: [], doesNotShow: [] };
}
