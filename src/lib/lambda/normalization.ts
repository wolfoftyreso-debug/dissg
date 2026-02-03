/**
 * INDEX NORMALIZATION ENGINE
 * 
 * Exakt matematik bakom index-normalisering:
 * - Z-score normalisering
 * - Min-max scaling
 * - Percentilrankning
 * - PPP-justering (Purchasing Power Parity)
 * - Viktning och aggregering
 * 
 * Princip: All normalisering är reproducerbar och verifierbar.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface RawDataPoint {
  geo_code: string;
  period: string;
  value: number;
  population?: number;
  ppp_factor?: number; // Local currency to international dollars
}

export interface NormalizedDataPoint extends RawDataPoint {
  zscore: number;
  percentile_rank: number;
  minmax_scaled: number; // 0-100
  ppp_adjusted_value: number;
}

export interface NormalizationParams {
  method: 'zscore' | 'minmax' | 'percentile' | 'ppp_adjusted';
  reference_population?: RawDataPoint[]; // For calculating global stats
  min_override?: number;
  max_override?: number;
  invert?: boolean; // True if lower values are better
  winsorize_percentile?: number; // Remove outliers (e.g., 0.01 for 1%)
}

export interface AggregationWeight {
  index_code: string;
  weight: number;
  category_weight?: number;
}

// =============================================================================
// STATISTICAL FUNCTIONS
// =============================================================================

/**
 * Calculate mean of an array
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const squareDiffs = values.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

/**
 * Calculate median
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculate percentile value
 */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  
  if (lower === upper) return sorted[lower];
  return sorted[lower] * (upper - index) + sorted[upper] * (index - lower);
}

/**
 * Calculate percentile rank of a value within a distribution
 */
export function percentileRank(value: number, distribution: number[]): number {
  if (distribution.length === 0) return 50;
  const below = distribution.filter(v => v < value).length;
  const equal = distribution.filter(v => v === value).length;
  return ((below + 0.5 * equal) / distribution.length) * 100;
}

// =============================================================================
// NORMALIZATION METHODS
// =============================================================================

/**
 * Z-score normalization: (value - mean) / std_dev
 * 
 * Result interpretation:
 * - z = 0: at the mean
 * - z = 1: one standard deviation above mean
 * - z = -1: one standard deviation below mean
 */
export function normalizeZScore(
  value: number,
  distribution: number[]
): number {
  const avg = mean(distribution);
  const std = standardDeviation(distribution);
  
  if (std === 0) return 0;
  return (value - avg) / std;
}

/**
 * Min-max scaling to 0-100 range
 * 
 * Formula: (value - min) / (max - min) * 100
 */
export function normalizeMinMax(
  value: number,
  distribution: number[],
  minOverride?: number,
  maxOverride?: number
): number {
  const min = minOverride ?? Math.min(...distribution);
  const max = maxOverride ?? Math.max(...distribution);
  
  if (max === min) return 50;
  
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, normalized));
}

/**
 * PPP adjustment: Convert to international dollars
 * 
 * PPP factor = Local currency units per international dollar
 * Adjusted value = Raw value / PPP factor
 */
export function adjustPPP(value: number, pppFactor: number): number {
  if (pppFactor <= 0) return value;
  return value / pppFactor;
}

/**
 * Winsorize to remove outliers
 * Replaces values outside the specified percentile range with the boundary values
 */
export function winsorize(
  values: number[],
  lowerPercentile: number = 1,
  upperPercentile: number = 99
): number[] {
  const lower = percentile(values, lowerPercentile);
  const upper = percentile(values, upperPercentile);
  
  return values.map(v => {
    if (v < lower) return lower;
    if (v > upper) return upper;
    return v;
  });
}

// =============================================================================
// COMPLETE NORMALIZATION PIPELINE
// =============================================================================

/**
 * Normalize a single data point using the specified method
 */
export function normalizeDataPoint(
  dataPoint: RawDataPoint,
  referencePopulation: RawDataPoint[],
  params: NormalizationParams
): NormalizedDataPoint {
  const values = referencePopulation.map(d => d.value);
  
  // Apply winsorization if specified
  const cleanValues = params.winsorize_percentile
    ? winsorize(values, params.winsorize_percentile, 100 - params.winsorize_percentile)
    : values;
  
  // PPP adjustment
  const pppAdjustedValue = dataPoint.ppp_factor
    ? adjustPPP(dataPoint.value, dataPoint.ppp_factor)
    : dataPoint.value;
  
  // Use PPP-adjusted values for reference if method is PPP
  const referenceValues = params.method === 'ppp_adjusted'
    ? referencePopulation.map(d => d.ppp_factor ? adjustPPP(d.value, d.ppp_factor) : d.value)
    : cleanValues;
  
  const valueForCalculation = params.method === 'ppp_adjusted'
    ? pppAdjustedValue
    : dataPoint.value;
  
  // Calculate all normalization metrics
  let zscore = normalizeZScore(valueForCalculation, referenceValues);
  let percentile_rank = percentileRank(valueForCalculation, referenceValues);
  let minmax_scaled = normalizeMinMax(
    valueForCalculation,
    referenceValues,
    params.min_override,
    params.max_override
  );
  
  // Invert if lower is better (e.g., mortality rate)
  if (params.invert) {
    zscore = -zscore;
    percentile_rank = 100 - percentile_rank;
    minmax_scaled = 100 - minmax_scaled;
  }
  
  return {
    ...dataPoint,
    zscore: roundTo(zscore, 4),
    percentile_rank: roundTo(percentile_rank, 2),
    minmax_scaled: roundTo(minmax_scaled, 2),
    ppp_adjusted_value: roundTo(pppAdjustedValue, 4),
  };
}

/**
 * Normalize a batch of data points
 */
export function normalizeDataBatch(
  dataPoints: RawDataPoint[],
  params: NormalizationParams
): NormalizedDataPoint[] {
  const referencePopulation = params.reference_population || dataPoints;
  
  return dataPoints.map(dp => normalizeDataPoint(dp, referencePopulation, params));
}

// =============================================================================
// WEIGHTED AGGREGATION
// =============================================================================

/**
 * Calculate weighted average of normalized values
 */
export function weightedAggregate(
  values: { value: number; weight: number }[]
): number {
  const totalWeight = values.reduce((sum, v) => sum + v.weight, 0);
  if (totalWeight === 0) return 0;
  
  const weightedSum = values.reduce((sum, v) => sum + v.value * v.weight, 0);
  return weightedSum / totalWeight;
}

/**
 * Aggregate multiple indices into a composite score
 */
export function aggregateIndices(
  indexValues: { code: string; normalized_value: number }[],
  weights: AggregationWeight[]
): {
  composite_score: number;
  contributions: { code: string; contribution: number; weight: number }[];
} {
  const contributions: { code: string; contribution: number; weight: number }[] = [];
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const indexValue of indexValues) {
    const weightConfig = weights.find(w => w.index_code === indexValue.code);
    const weight = weightConfig?.weight ?? 1;
    const categoryWeight = weightConfig?.category_weight ?? 1;
    const effectiveWeight = weight * categoryWeight;
    
    totalWeight += effectiveWeight;
    const contribution = indexValue.normalized_value * effectiveWeight;
    weightedSum += contribution;
    
    contributions.push({
      code: indexValue.code,
      contribution: roundTo(contribution / (totalWeight || 1), 4),
      weight: effectiveWeight,
    });
  }
  
  return {
    composite_score: totalWeight > 0 ? roundTo(weightedSum / totalWeight, 4) : 0,
    contributions,
  };
}

// =============================================================================
// POPULATION WEIGHTING
// =============================================================================

/**
 * Calculate population-weighted average across regions
 */
export function populationWeightedAverage(
  dataPoints: { value: number; population: number }[]
): number {
  const totalPopulation = dataPoints.reduce((sum, d) => sum + d.population, 0);
  if (totalPopulation === 0) return 0;
  
  const weightedSum = dataPoints.reduce((sum, d) => sum + d.value * d.population, 0);
  return weightedSum / totalPopulation;
}

/**
 * Calculate global statistics with population weighting
 */
export function globalPopulationWeightedStats(
  dataPoints: { value: number; population: number }[]
): {
  weighted_mean: number;
  unweighted_mean: number;
  weighted_median: number;
  population_coverage: number;
} {
  const values = dataPoints.map(d => d.value);
  const totalPop = dataPoints.reduce((sum, d) => sum + d.population, 0);
  
  // Create expanded array for weighted median
  const expandedValues: number[] = [];
  for (const d of dataPoints) {
    const count = Math.round(d.population / 1000000); // Per million for efficiency
    for (let i = 0; i < Math.max(1, count); i++) {
      expandedValues.push(d.value);
    }
  }
  
  return {
    weighted_mean: populationWeightedAverage(dataPoints),
    unweighted_mean: mean(values),
    weighted_median: median(expandedValues),
    population_coverage: totalPop,
  };
}

// =============================================================================
// CONFIDENCE INTERVALS
// =============================================================================

/**
 * Calculate confidence interval for normalized value
 */
export function calculateConfidenceInterval(
  normalizedValue: number,
  sampleSize: number,
  sourceCount: number,
  dataCoverage: number
): { lower: number; upper: number; confidence_level: 'high' | 'medium' | 'low' | 'insufficient' } {
  // Base uncertainty from sample size (Central Limit Theorem approximation)
  const baseUncertainty = 1.96 / Math.sqrt(Math.max(1, sampleSize));
  
  // Adjust for source diversity
  const sourceFactor = sourceCount >= 3 ? 1 : sourceCount === 2 ? 1.2 : 1.5;
  
  // Adjust for data coverage
  const coverageFactor = dataCoverage >= 0.8 ? 1 : dataCoverage >= 0.5 ? 1.3 : 2;
  
  const totalUncertainty = baseUncertainty * sourceFactor * coverageFactor;
  
  // Determine confidence level
  let confidence_level: 'high' | 'medium' | 'low' | 'insufficient';
  if (totalUncertainty <= 0.1) {
    confidence_level = 'high';
  } else if (totalUncertainty <= 0.25) {
    confidence_level = 'medium';
  } else if (totalUncertainty <= 0.5) {
    confidence_level = 'low';
  } else {
    confidence_level = 'insufficient';
  }
  
  return {
    lower: roundTo(normalizedValue - totalUncertainty * 50, 2), // Scale to 0-100
    upper: roundTo(normalizedValue + totalUncertainty * 50, 2),
    confidence_level,
  };
}

// =============================================================================
// TREND CALCULATION
// =============================================================================

/**
 * Calculate trend from historical values
 */
export function calculateTrend(
  historicalValues: { period: string; value: number }[]
): {
  direction: 'improving' | 'stable' | 'declining';
  slope: number;
  r_squared: number;
  change_percent: number;
} {
  if (historicalValues.length < 2) {
    return {
      direction: 'stable',
      slope: 0,
      r_squared: 0,
      change_percent: 0,
    };
  }
  
  // Simple linear regression
  const n = historicalValues.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = historicalValues.map(h => h.value);
  
  const xMean = mean(x);
  const yMean = mean(y);
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    denominator += (x[i] - xMean) ** 2;
  }
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  
  // Calculate R-squared
  const yPredicted = x.map(xi => yMean + slope * (xi - xMean));
  const ssRes = y.reduce((sum, yi, i) => sum + (yi - yPredicted[i]) ** 2, 0);
  const ssTot = y.reduce((sum, yi) => sum + (yi - yMean) ** 2, 0);
  const rSquared = ssTot !== 0 ? 1 - ssRes / ssTot : 0;
  
  // Calculate percent change
  const firstValue = historicalValues[0].value;
  const lastValue = historicalValues[historicalValues.length - 1].value;
  const changePercent = firstValue !== 0 ? ((lastValue - firstValue) / Math.abs(firstValue)) * 100 : 0;
  
  // Determine direction
  let direction: 'improving' | 'stable' | 'declining' = 'stable';
  const significantChange = Math.abs(changePercent) > 2; // 2% threshold
  
  if (significantChange && slope > 0) {
    direction = 'improving';
  } else if (significantChange && slope < 0) {
    direction = 'declining';
  }
  
  return {
    direction,
    slope: roundTo(slope, 4),
    r_squared: roundTo(rSquared, 4),
    change_percent: roundTo(changePercent, 2),
  };
}

// =============================================================================
// UTILITIES
// =============================================================================

function roundTo(num: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}

/**
 * Validate data quality before normalization
 */
export function validateDataQuality(
  dataPoints: RawDataPoint[]
): {
  valid: boolean;
  coverage: number;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check for minimum data points
  if (dataPoints.length < 5) {
    issues.push('Insufficient data points for reliable normalization (min: 5)');
  }
  
  // Check for missing values
  const missingCount = dataPoints.filter(d => d.value === null || d.value === undefined || isNaN(d.value)).length;
  if (missingCount > 0) {
    issues.push(`${missingCount} data points have missing values`);
  }
  
  // Check for extreme outliers (beyond 5 standard deviations)
  const values = dataPoints.map(d => d.value).filter(v => !isNaN(v));
  const avg = mean(values);
  const std = standardDeviation(values);
  const extremeOutliers = values.filter(v => Math.abs(v - avg) > 5 * std).length;
  if (extremeOutliers > 0) {
    issues.push(`${extremeOutliers} extreme outliers detected (>5 SD)`);
  }
  
  // Calculate coverage
  const validCount = dataPoints.filter(d => !isNaN(d.value)).length;
  const coverage = validCount / Math.max(1, dataPoints.length);
  
  return {
    valid: issues.length === 0,
    coverage: roundTo(coverage, 4),
    issues,
  };
}
