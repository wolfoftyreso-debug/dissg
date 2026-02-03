/**
 * LAMBDA CALCULATION ENGINE
 * 
 * Lambda ≈ 1.0 → balanserat system
 * Lambda < 1.0 → ineffektivitet, spill
 * Lambda > 1.0 → överhettning, risk
 * 
 * Beräknas: globalt, nationellt, regionalt, sektoriellt
 */

import type { 
  IndexCode, 
  IndexValue,
  LambdaSensorReading,
  LambdaCalculation 
} from './index-types';
import { INDEX_REGISTRY, getIndexDefinition } from './index-registry';

// =============================================================================
// LAMBDA CONFIGURATION
// =============================================================================

export interface LambdaConfig {
  version: string;
  
  // Index weights per category
  category_weights: {
    living_basic: number;
    shadow_economy: number;
    health_function: number;
    social_cultural: number;
    productivity_work: number;
  };
  
  // Individual index weights (override category defaults)
  index_weights?: Partial<Record<IndexCode, number>>;
  
  // Interpretation thresholds
  thresholds: {
    balanced_min: number;
    balanced_max: number;
    warning_low: number;
    warning_high: number;
    critical_low: number;
    critical_high: number;
  };
}

export const DEFAULT_LAMBDA_CONFIG: LambdaConfig = {
  version: '1.0.0',
  
  category_weights: {
    living_basic: 0.25,
    shadow_economy: 0.10,
    health_function: 0.25,
    social_cultural: 0.20,
    productivity_work: 0.20,
  },
  
  thresholds: {
    balanced_min: 0.90,
    balanced_max: 1.10,
    warning_low: 0.85,
    warning_high: 1.15,
    critical_low: 0.70,
    critical_high: 1.30,
  },
};

// =============================================================================
// OPTIMAL VALUES
// =============================================================================

/**
 * Get optimal value for an index based on its definition
 */
function getOptimalValue(code: IndexCode): number {
  const def = getIndexDefinition(code);
  if (!def) return 50; // Default normalized midpoint
  
  const { optimal_range, direction } = def;
  
  if (direction === 'neutral_optimal') {
    return (optimal_range.min + optimal_range.max) / 2;
  } else if (direction === 'higher_better') {
    return optimal_range.max;
  } else {
    return optimal_range.min;
  }
}

/**
 * Calculate deviation from optimal (normalized -1 to 1)
 */
function calculateDeviation(
  value: number, 
  optimal: number, 
  direction: 'higher_better' | 'lower_better' | 'neutral_optimal'
): number {
  const diff = value - optimal;
  
  if (direction === 'neutral_optimal') {
    // Deviation in either direction is bad
    return Math.abs(diff) / 50; // Normalize to roughly 0-1
  } else if (direction === 'higher_better') {
    // Negative when below optimal
    return diff / 50;
  } else {
    // Negative when above optimal
    return -diff / 50;
  }
}

// =============================================================================
// SENSOR READINGS
// =============================================================================

/**
 * Convert index values to sensor readings
 */
export function createSensorReadings(
  values: Map<IndexCode, IndexValue>,
  config: LambdaConfig = DEFAULT_LAMBDA_CONFIG
): LambdaSensorReading[] {
  const readings: LambdaSensorReading[] = [];
  
  for (const [code, value] of values) {
    const def = getIndexDefinition(code);
    if (!def) continue;
    
    const optimal = getOptimalValue(code);
    const deviation = calculateDeviation(
      value.normalized_value, 
      optimal, 
      def.direction
    );
    
    // Get weight
    const categoryWeight = config.category_weights[def.category as keyof typeof config.category_weights] || 0.1;
    const indexWeight = config.index_weights?.[code] ?? categoryWeight;
    
    readings.push({
      index_code: code,
      contribution_to_lambda: 0, // Will be calculated later
      weight: indexWeight,
      current_value: value.normalized_value,
      optimal_value: optimal,
      deviation,
      deviation_direction: deviation > 0.05 ? 'above' : deviation < -0.05 ? 'below' : 'within_range',
      is_primary_driver: false,
      rank_among_drivers: 0,
    });
  }
  
  return readings;
}

// =============================================================================
// LAMBDA CALCULATION
// =============================================================================

/**
 * Calculate Lambda value from sensor readings
 */
export function calculateLambda(
  readings: LambdaSensorReading[],
  config: LambdaConfig = DEFAULT_LAMBDA_CONFIG
): number {
  if (readings.length === 0) return 1.0;
  
  // Normalize weights
  const totalWeight = readings.reduce((sum, r) => sum + r.weight, 0);
  
  // Calculate weighted average of "balance scores"
  // Balance score = 1 when at optimal, decreases with deviation
  let weightedBalanceSum = 0;
  
  for (const reading of readings) {
    const normalizedWeight = reading.weight / totalWeight;
    const balanceScore = 1 - Math.abs(reading.deviation);
    weightedBalanceSum += balanceScore * normalizedWeight;
  }
  
  // Lambda is the weighted balance score
  // But we also need to account for direction (over vs under)
  const avgDeviation = readings.reduce((sum, r) => sum + r.deviation * r.weight, 0) / totalWeight;
  
  // Adjust lambda based on overall direction
  let lambda = weightedBalanceSum;
  
  // If overall deviation is positive (overheating), lambda > 1
  // If overall deviation is negative (underperforming), lambda < 1
  lambda = 1 + (avgDeviation * 0.3); // Scale factor
  
  return roundTo(lambda, 4);
}

/**
 * Interpret Lambda value
 */
export function interpretLambda(
  lambda: number,
  config: LambdaConfig = DEFAULT_LAMBDA_CONFIG
): 'balanced' | 'inefficient' | 'overheated' | 'critical' {
  const { thresholds } = config;
  
  if (lambda <= thresholds.critical_low || lambda >= thresholds.critical_high) {
    return 'critical';
  }
  
  if (lambda < thresholds.balanced_min) {
    return 'inefficient';
  }
  
  if (lambda > thresholds.balanced_max) {
    return 'overheated';
  }
  
  return 'balanced';
}

// =============================================================================
// FULL LAMBDA CALCULATION
// =============================================================================

export interface LambdaInput {
  geo_code: string;
  geo_level: 'global' | 'country' | 'region' | 'sector';
  period: string;
  index_values: Map<IndexCode, IndexValue>;
  historical_values?: {
    period: string;
    lambda: number;
  }[];
}

/**
 * Full Lambda calculation with all metadata
 */
export function computeLambda(
  input: LambdaInput,
  config: LambdaConfig = DEFAULT_LAMBDA_CONFIG,
  historicalPatterns: { geo_code: string; period: string; lambda: number; what_followed: string }[] = []
): LambdaCalculation {
  // Create sensor readings
  const readings = createSensorReadings(input.index_values, config);
  
  // Calculate contributions
  const totalWeight = readings.reduce((sum, r) => sum + r.weight, 0);
  for (const reading of readings) {
    reading.contribution_to_lambda = (reading.deviation * reading.weight) / totalWeight;
  }
  
  // Rank drivers by absolute contribution
  const sortedByContribution = [...readings].sort(
    (a, b) => Math.abs(b.contribution_to_lambda) - Math.abs(a.contribution_to_lambda)
  );
  
  sortedByContribution.forEach((r, i) => {
    r.rank_among_drivers = i + 1;
    r.is_primary_driver = i < 3;
  });
  
  // Calculate Lambda
  const lambda = calculateLambda(readings, config);
  const interpretation = interpretLambda(lambda, config);
  
  // Primary drivers
  const primaryDrivers = sortedByContribution
    .slice(0, 5)
    .map(r => r.index_code);
  
  // Historical values
  const lambda_1y_ago = input.historical_values?.find(h => h.period === getPreviousPeriod(input.period, 1))?.lambda ?? null;
  const lambda_5y_ago = input.historical_values?.find(h => h.period === getPreviousPeriod(input.period, 5))?.lambda ?? null;
  
  // Trend
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (lambda_1y_ago !== null) {
    const diff = lambda - lambda_1y_ago;
    if (diff > 0.02) trend = 'improving';
    else if (diff < -0.02) trend = 'declining';
  }
  
  // Confidence interval (simplified)
  const dataCoverage = readings.length / INDEX_REGISTRY.length;
  const confidenceWidth = 0.1 * (1 - dataCoverage); // Wider with less data
  
  // Find similar historical states
  const similarStates = historicalPatterns
    .filter(hp => Math.abs(hp.lambda - lambda) < 0.05)
    .slice(0, 5);
  
  return {
    geo_code: input.geo_code,
    geo_level: input.geo_level,
    period: input.period,
    
    lambda,
    lambda_interpretation: interpretation,
    
    sensor_readings: readings,
    primary_drivers: primaryDrivers,
    
    confidence_interval: {
      lower: roundTo(lambda - confidenceWidth, 4),
      upper: roundTo(lambda + confidenceWidth, 4),
    },
    data_coverage: roundTo(dataCoverage, 2),
    
    lambda_1y_ago,
    lambda_5y_ago,
    trend,
    
    similar_historical_states: similarStates,
    
    calculated_at: new Date().toISOString(),
    methodology_version: config.version,
  };
}

// =============================================================================
// UTILITIES
// =============================================================================

function getPreviousPeriod(period: string, yearsBack: number): string {
  // Assumes period is YYYY or YYYY-MM format
  const year = parseInt(period.slice(0, 4), 10);
  return (year - yearsBack).toString() + period.slice(4);
}

function roundTo(num: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}

// =============================================================================
// LAMBDA BAND DEFINITIONS
// =============================================================================

export interface LambdaBand {
  min: number;
  max: number;
  label_sv: string;
  label_en: string;
  color: string;
  description_sv: string;
}

export const LAMBDA_BANDS: LambdaBand[] = [
  {
    min: 0,
    max: 0.70,
    label_sv: 'Kritisk ineffektivitet',
    label_en: 'Critical inefficiency',
    color: '#dc2626', // red-600
    description_sv: 'Systemet visar tecken på allvarlig obalans med betydande resursförlust.',
  },
  {
    min: 0.70,
    max: 0.85,
    label_sv: 'Betydande ineffektivitet',
    label_en: 'Significant inefficiency',
    color: '#f97316', // orange-500
    description_sv: 'Systemet underpresterar märkbart relativt insatta resurser.',
  },
  {
    min: 0.85,
    max: 0.90,
    label_sv: 'Måttlig ineffektivitet',
    label_en: 'Moderate inefficiency',
    color: '#fbbf24', // amber-400
    description_sv: 'Visst utrymme för förbättring identifierat.',
  },
  {
    min: 0.90,
    max: 1.10,
    label_sv: 'Balanserad',
    label_en: 'Balanced',
    color: '#3b82f6', // blue-500
    description_sv: 'Systemet opererar inom normalt intervall.',
  },
  {
    min: 1.10,
    max: 1.15,
    label_sv: 'Måttlig överhettning',
    label_en: 'Moderate overheating',
    color: '#a855f7', // purple-500
    description_sv: 'Systemet visar tecken på stress.',
  },
  {
    min: 1.15,
    max: 1.30,
    label_sv: 'Betydande överhettning',
    label_en: 'Significant overheating',
    color: '#c026d3', // fuchsia-600
    description_sv: 'Systemet opererar under hög belastning.',
  },
  {
    min: 1.30,
    max: 2.0,
    label_sv: 'Kritisk överhettning',
    label_en: 'Critical overheating',
    color: '#be123c', // rose-700
    description_sv: 'Systemet visar tecken på allvarlig obalans med risk för kollaps.',
  },
];

export function getLambdaBand(lambda: number): LambdaBand {
  return LAMBDA_BANDS.find(b => lambda >= b.min && lambda < b.max) || LAMBDA_BANDS[3];
}
