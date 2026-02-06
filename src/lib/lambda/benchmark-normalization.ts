/**
 * BENCHMARK NORMALIZATION SYSTEM
 * 
 * All indexes are normalized to a global benchmark where:
 * - Global average = 100 (like OMX30 baseline)
 * - Values above 100 = above global average
 * - Values below 100 = below global average
 * 
 * This creates a universal comparison framework across all indicators.
 */

export interface BenchmarkConfig {
  /** Baseline value (default 100, like stock indexes) */
  baseline: number;
  /** Standard deviation for scoring spread */
  stdDevMultiplier: number;
  /** Min possible score */
  floor: number;
  /** Max possible score */
  ceiling: number;
}

export const DEFAULT_BENCHMARK_CONFIG: BenchmarkConfig = {
  baseline: 100,
  stdDevMultiplier: 15, // Each std dev = 15 points (like IQ scoring)
  floor: 0,
  ceiling: 200,
};

export interface BenchmarkDataPoint {
  entityCode: string; // Country/city code
  entityName: string;
  rawValue: number;
  year: number;
}

export interface BenchmarkResult {
  entityCode: string;
  entityName: string;
  rawValue: number;
  benchmarkScore: number; // Normalized to 100 = global average
  percentile: number; // 0-100
  deviation: number; // How many std devs from mean
  trend: 'improving' | 'declining' | 'stable';
  rank: number;
  totalEntities: number;
}

export interface GlobalBenchmark {
  indicatorId: string;
  indicatorName: string;
  year: number;
  globalMean: number;
  globalMedian: number;
  globalStdDev: number;
  minValue: number;
  maxValue: number;
  totalDataPoints: number;
  results: BenchmarkResult[];
  lastUpdated: string;
}

/**
 * Calculate standard deviation
 */
function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Calculate percentile rank
 */
function calculatePercentile(value: number, sortedValues: number[], higherIsBetter: boolean): number {
  const n = sortedValues.length;
  if (n === 0) return 50;
  
  let count = 0;
  for (const v of sortedValues) {
    if (higherIsBetter ? v < value : v > value) count++;
  }
  
  return Math.round((count / n) * 100);
}

/**
 * Normalize raw values to benchmark scores (100 = global average)
 */
export function normalizeToBenchmark(
  dataPoints: BenchmarkDataPoint[],
  indicatorId: string,
  indicatorName: string,
  higherIsBetter: boolean = true,
  config: BenchmarkConfig = DEFAULT_BENCHMARK_CONFIG
): GlobalBenchmark {
  if (dataPoints.length === 0) {
    return {
      indicatorId,
      indicatorName,
      year: new Date().getFullYear(),
      globalMean: 0,
      globalMedian: 0,
      globalStdDev: 0,
      minValue: 0,
      maxValue: 0,
      totalDataPoints: 0,
      results: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  const values = dataPoints.map(d => d.rawValue);
  const sortedValues = [...values].sort((a, b) => a - b);
  
  // Calculate statistics
  const globalMean = values.reduce((a, b) => a + b, 0) / values.length;
  const globalMedian = sortedValues[Math.floor(sortedValues.length / 2)];
  const globalStdDev = calculateStdDev(values, globalMean);
  const minValue = sortedValues[0];
  const maxValue = sortedValues[sortedValues.length - 1];

  // Calculate benchmark scores for each entity
  const results: BenchmarkResult[] = dataPoints.map(dp => {
    // Calculate deviation from mean in std dev units
    const deviation = globalStdDev > 0 ? (dp.rawValue - globalMean) / globalStdDev : 0;
    
    // Convert to benchmark score (100 = mean)
    // If higher is better, positive deviation = higher score
    // If lower is better (like crime rate), positive deviation = lower score
    const adjustedDeviation = higherIsBetter ? deviation : -deviation;
    let benchmarkScore = config.baseline + (adjustedDeviation * config.stdDevMultiplier);
    
    // Clamp to floor/ceiling
    benchmarkScore = Math.max(config.floor, Math.min(config.ceiling, benchmarkScore));
    benchmarkScore = Math.round(benchmarkScore * 10) / 10;

    const percentile = calculatePercentile(dp.rawValue, sortedValues, higherIsBetter);

    return {
      entityCode: dp.entityCode,
      entityName: dp.entityName,
      rawValue: dp.rawValue,
      benchmarkScore,
      percentile,
      deviation: Math.round(deviation * 100) / 100,
      trend: 'stable' as const, // Would need historical data to calculate
      rank: 0, // Calculated below
      totalEntities: dataPoints.length,
    };
  });

  // Sort by benchmark score and assign ranks
  results.sort((a, b) => b.benchmarkScore - a.benchmarkScore);
  results.forEach((r, i) => {
    r.rank = i + 1;
  });

  return {
    indicatorId,
    indicatorName,
    year: dataPoints[0]?.year || new Date().getFullYear(),
    globalMean: Math.round(globalMean * 100) / 100,
    globalMedian: Math.round(globalMedian * 100) / 100,
    globalStdDev: Math.round(globalStdDev * 100) / 100,
    minValue,
    maxValue,
    totalDataPoints: dataPoints.length,
    results,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get color for benchmark score
 */
export function getBenchmarkColor(score: number): string {
  if (score >= 130) return '#22c55e'; // Excellent - green
  if (score >= 115) return '#84cc16'; // Good - lime
  if (score >= 100) return '#eab308'; // Average - yellow
  if (score >= 85) return '#f97316'; // Below average - orange
  return '#ef4444'; // Poor - red
}

/**
 * Get label for benchmark score
 */
export function getBenchmarkLabel(score: number): string {
  if (score >= 130) return 'Utmärkt';
  if (score >= 115) return 'Över snittet';
  if (score >= 100) return 'Genomsnitt';
  if (score >= 85) return 'Under snittet';
  return 'Kritiskt';
}

/**
 * Format benchmark score for display
 */
export function formatBenchmarkScore(score: number, showDiff: boolean = true): string {
  const diff = score - 100;
  if (!showDiff) return score.toFixed(1);
  
  if (diff > 0) return `${score.toFixed(1)} (+${diff.toFixed(1)})`;
  if (diff < 0) return `${score.toFixed(1)} (${diff.toFixed(1)})`;
  return `${score.toFixed(1)} (±0)`;
}

/**
 * Indicator polarity - whether higher raw values are better
 */
export const INDICATOR_POLARITY: Record<string, boolean> = {
  // Health - higher is generally better except...
  life_expectancy: true,
  healthcare_access: true,
  air_quality: true, // Higher AQI = better (inverted from raw PM2.5)
  mental_health: false, // Lower rate = better
  child_mortality: false,
  obesity_rate: false,
  drug_deaths: false,
  
  // Safety - lower is better
  crime_rate: false,
  murder: false,
  rape: false,
  robbery: false,
  assault: false,
  theft: false,
  burglary: false,
  car_theft: false,
  fraud: false,
  drug_crime: false,
  gang_activity: false,
  shootings: false,
  explosions: false,
  gang_murders: false,
  traffic_safety: false,
  fire_incidents: false,
  police_trust: true,
  
  // Economy - higher is generally better except...
  median_income: true,
  unemployment: false,
  housing_cost: false, // Lower cost = better
  gini: false, // Lower inequality = better
  gdp_per_capita: true,
  poverty_rate: false,
  startup_rate: true,
  tax_burden: false, // Subjective, but treating lower as better
  
  // Environment
  co2_emissions: false,
  green_space: true,
  renewable_energy: true,
  recycling: true,
  water_quality: true,
  noise_pollution: false,
  biodiversity: true,
  
  // Social
  education_level: true,
  voter_turnout: true,
  trust_index: true,
  social_mobility: true,
  gender_equality: true,
  integration: true,
  loneliness: false,
  
  // Demographics - neutral/contextual
  population_density: true, // Treating as neutral-positive
  median_age: true, // Neutral
  dependency_ratio: false,
  birth_rate: true,
  net_migration: true,
  foreign_born: true, // Neutral
  
  // Infrastructure
  public_transport: true,
  internet_speed: true,
  hospital_beds: true,
  road_quality: true,
  electricity_reliability: false, // Lower outage = better
  mobile_coverage: true,
  
  // Culture
  cultural_spending: true,
  library_access: true,
  sports_facilities: true,
  restaurant_density: true,
  nightlife: true,
};

/**
 * Get polarity for an indicator
 */
export function getIndicatorPolarity(indicatorId: string): boolean {
  return INDICATOR_POLARITY[indicatorId] ?? true;
}
