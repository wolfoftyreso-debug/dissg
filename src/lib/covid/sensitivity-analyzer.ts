/**
 * COVID-19 REALITY LAYER - Sensitivity Analyzer (Fjädran)
 * Tests how conclusions change under different assumptions
 */

import type { 
  SensitivityOutcome,
  StabilityClassification,
  CovidRawDataPoint 
} from '@/types/covid';

export interface SensitivityTestConfig {
  baseData: CovidRawDataPoint[];
  parameterToVary: string;
  variations: unknown[];
  metric: 'sum' | 'average' | 'trend' | 'peak';
}

export interface SensitivityAnalysisResult {
  stabilityScore: number;
  classification: StabilityClassification;
  outcomes: SensitivityOutcome[];
  keySensitivities: string[];
  interpretation: string;
}

/**
 * Run sensitivity analysis on COVID data
 * Tests how conclusions change when parameters are varied
 */
export function runSensitivityAnalysis(
  config: SensitivityTestConfig
): SensitivityAnalysisResult {
  const baseValue = calculateMetric(config.baseData, config.metric);
  const outcomes: SensitivityOutcome[] = [];

  for (let i = 0; i < config.variations.length; i++) {
    const variation = config.variations[i];
    const adjustedData = applyVariation(config.baseData, config.parameterToVary, variation);
    const newValue = calculateMetric(adjustedData, config.metric);
    
    const changePercent = baseValue !== 0 
      ? ((newValue - baseValue) / baseValue) * 100 
      : 0;

    outcomes.push({
      variationId: `var_${i}`,
      parameterChanged: config.parameterToVary,
      newValue: variation,
      resultChange: newValue - baseValue,
      resultChangePercent: changePercent,
    });
  }

  // Calculate stability score
  const maxChange = Math.max(...outcomes.map(o => Math.abs(o.resultChangePercent)));
  const avgChange = outcomes.reduce((sum, o) => sum + Math.abs(o.resultChangePercent), 0) / outcomes.length;

  let stabilityScore: number;
  let classification: StabilityClassification;

  if (maxChange < 5 && avgChange < 2) {
    stabilityScore = 0.95;
    classification = 'robust';
  } else if (maxChange < 15 && avgChange < 7) {
    stabilityScore = 0.75;
    classification = 'moderate';
  } else if (maxChange < 30 && avgChange < 15) {
    stabilityScore = 0.50;
    classification = 'sensitive';
  } else {
    stabilityScore = 0.25;
    classification = 'unstable';
  }

  // Identify key sensitivities
  const keySensitivities = outcomes
    .filter(o => Math.abs(o.resultChangePercent) > 10)
    .map(o => `${o.parameterChanged}: ${o.newValue}`);

  return {
    stabilityScore,
    classification,
    outcomes,
    keySensitivities,
    interpretation: generateInterpretation(classification, keySensitivities),
  };
}

function calculateMetric(data: CovidRawDataPoint[], metric: 'sum' | 'average' | 'trend' | 'peak'): number {
  if (data.length === 0) return 0;

  switch (metric) {
    case 'sum':
      return data.reduce((sum, d) => sum + d.value, 0);
    case 'average':
      return data.reduce((sum, d) => sum + d.value, 0) / data.length;
    case 'peak':
      return Math.max(...data.map(d => d.value));
    case 'trend':
      // Simple linear trend coefficient
      if (data.length < 2) return 0;
      const n = data.length;
      const sumX = (n * (n - 1)) / 2;
      const sumY = data.reduce((sum, d) => sum + d.value, 0);
      const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0);
      const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
      return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    default:
      return 0;
  }
}

function applyVariation(
  data: CovidRawDataPoint[], 
  parameter: string, 
  value: unknown
): CovidRawDataPoint[] {
  // Simulate parameter changes
  switch (parameter) {
    case 'time_window':
      // Adjust time window by filtering data
      const days = value as number;
      const cutoffIndex = Math.max(0, data.length - days);
      return data.slice(cutoffIndex);
    
    case 'age_filter':
      // Filter by age group
      const ageGroup = value as string;
      return data.filter(d => !d.ageGroup || d.ageGroup === ageGroup);
    
    case 'reporting_adjustment':
      // Adjust for reporting bias
      const factor = value as number;
      return data.map(d => ({ ...d, value: d.value * factor }));
    
    case 'preliminary_exclusion':
      // Exclude preliminary data
      const excludePreliminary = value as boolean;
      return excludePreliminary ? data.filter(d => !d.isPreliminary) : data;
    
    default:
      return data;
  }
}

function generateInterpretation(
  classification: StabilityClassification,
  keySensitivities: string[]
): string {
  const base = {
    robust: 'The observed pattern is robust and does not significantly change under tested variations.',
    moderate: 'The observed pattern is moderately stable but shows some sensitivity to parameter changes.',
    sensitive: 'The observed pattern is sensitive to assumptions. Conclusions should be stated with caution.',
    unstable: 'The observed pattern is highly sensitive to assumptions. No firm conclusions can be drawn.',
  };

  let text = base[classification];
  
  if (keySensitivities.length > 0) {
    text += ` Key sensitivities: ${keySensitivities.join(', ')}.`;
  }

  return text;
}

/**
 * Pre-defined sensitivity tests for common COVID analyses
 */
export const STANDARD_SENSITIVITY_TESTS = {
  timeWindow: {
    parameter: 'time_window',
    variations: [7, 14, 30, 60, 90],
    description: 'Tests how the conclusion changes with different time windows',
  },
  reportingAdjustment: {
    parameter: 'reporting_adjustment',
    variations: [0.8, 0.9, 1.0, 1.1, 1.2],
    description: 'Tests sensitivity to potential under/over-reporting',
  },
  preliminaryExclusion: {
    parameter: 'preliminary_exclusion',
    variations: [false, true],
    description: 'Tests whether excluding preliminary data changes the result',
  },
};

/**
 * Stability classification display text
 */
export const STABILITY_DISPLAY = {
  robust: {
    label: 'Robust',
    color: 'green',
    icon: '✓',
    description: 'Result is stable under tested variations',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-500',
  },
  moderate: {
    label: 'Moderate',
    color: 'yellow',
    icon: '○',
    description: 'Result shows some sensitivity',
    bgClass: 'bg-yellow-500/10',
    textClass: 'text-yellow-500',
  },
  sensitive: {
    label: 'Sensitive',
    color: 'orange',
    icon: '△',
    description: 'Result is sensitive to assumptions',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-500',
  },
  unstable: {
    label: 'Unstable',
    color: 'red',
    icon: '⚠',
    description: 'Result changes significantly with assumptions',
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
  },
};
