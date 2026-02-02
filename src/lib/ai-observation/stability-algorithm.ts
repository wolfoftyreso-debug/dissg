/**
 * STABILITY SCORE ALGORITHM
 * 
 * An open, auditable algorithm for calculating pattern stability
 * across time, geography, and data sources.
 * 
 * This implementation is designed to be:
 * - Fully transparent (no black boxes)
 * - Reproducible (deterministic given same inputs)
 * - Auditable (every step is documented)
 */

import type { StabilityLevel } from '@/types/ai-observation';

/**
 * Configuration for stability calculation
 * All parameters are exposed for transparency
 */
export interface StabilityConfig {
  // Temporal stability
  min_subperiods: number;           // Minimum subperiods to test
  temporal_consistency_weight: number; // Weight for temporal score
  
  // Geographic stability
  min_regions: number;              // Minimum regions for geographic test
  geographic_consistency_weight: number;
  
  // Source stability
  min_sources: number;              // Minimum sources for cross-source test
  source_consistency_weight: number;
  
  // Thresholds
  high_stability_threshold: number;
  medium_stability_threshold: number;
  low_stability_threshold: number;
}

export const DEFAULT_STABILITY_CONFIG: StabilityConfig = {
  min_subperiods: 4,
  temporal_consistency_weight: 0.4,
  min_regions: 3,
  geographic_consistency_weight: 0.3,
  min_sources: 2,
  source_consistency_weight: 0.3,
  high_stability_threshold: 0.8,
  medium_stability_threshold: 0.6,
  low_stability_threshold: 0.3
};

/**
 * Result from a single dimension of stability testing
 */
export interface DimensionResult {
  dimension: 'temporal' | 'geographic' | 'source';
  score: number;              // 0-1 score
  samples_tested: number;     // Number of subperiods/regions/sources tested
  consistent_samples: number; // Number that showed consistent pattern
  coefficient_of_variation: number; // CV of the correlation across samples
  details: string[];          // Audit trail
}

/**
 * Complete stability assessment result
 */
export interface StabilityAssessment {
  // Overall scores
  overall_score: number;
  stability_level: StabilityLevel;
  
  // Dimension breakdowns
  temporal: DimensionResult;
  geographic: DimensionResult;
  source: DimensionResult;
  
  // Audit information
  config_used: StabilityConfig;
  calculation_steps: string[];
  data_warnings: string[];
  
  // Reproducibility
  input_hash: string;
  calculated_at: string;
}

/**
 * Calculate coefficient of variation
 * CV = standard deviation / mean
 * Lower CV = more stable
 */
function calculateCV(values: number[]): number {
  if (values.length === 0) return 1;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return values.some(v => v !== 0) ? 1 : 0;
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const std = Math.sqrt(variance);
  
  return std / Math.abs(mean);
}

/**
 * Calculate temporal stability
 * Tests if the pattern holds across subperiods
 */
export function calculateTemporalStability(
  correlations_by_period: Array<{ period: string; correlation: number }>,
  config: StabilityConfig = DEFAULT_STABILITY_CONFIG
): DimensionResult {
  const details: string[] = [];
  
  if (correlations_by_period.length < config.min_subperiods) {
    details.push(`Insufficient subperiods: ${correlations_by_period.length} < ${config.min_subperiods}`);
    return {
      dimension: 'temporal',
      score: 0,
      samples_tested: correlations_by_period.length,
      consistent_samples: 0,
      coefficient_of_variation: 1,
      details
    };
  }
  
  const correlations = correlations_by_period.map(c => c.correlation);
  const cv = calculateCV(correlations);
  
  // Check sign consistency (all positive or all negative)
  const positiveCount = correlations.filter(c => c > 0).length;
  const negativeCount = correlations.filter(c => c < 0).length;
  const signConsistent = positiveCount === correlations.length || negativeCount === correlations.length;
  
  // Score: inverse of CV, capped at 1, with sign consistency bonus
  let score = Math.max(0, 1 - cv);
  if (signConsistent) {
    details.push('Direction consistent across all subperiods');
  } else {
    score *= 0.5; // Penalty for sign changes
    details.push(`Direction inconsistent: ${positiveCount} positive, ${negativeCount} negative`);
  }
  
  // Count consistent samples (within 1 std of mean)
  const mean = correlations.reduce((a, b) => a + b, 0) / correlations.length;
  const std = Math.sqrt(correlations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / correlations.length);
  const consistentCount = correlations.filter(c => Math.abs(c - mean) <= std).length;
  
  details.push(`CV: ${cv.toFixed(4)}`);
  details.push(`Mean correlation: ${mean.toFixed(4)}`);
  details.push(`Std: ${std.toFixed(4)}`);
  details.push(`${consistentCount}/${correlations.length} samples within 1 std`);
  
  return {
    dimension: 'temporal',
    score,
    samples_tested: correlations.length,
    consistent_samples: consistentCount,
    coefficient_of_variation: cv,
    details
  };
}

/**
 * Calculate geographic stability
 * Tests if the pattern holds across regions
 */
export function calculateGeographicStability(
  correlations_by_region: Array<{ region: string; correlation: number }>,
  config: StabilityConfig = DEFAULT_STABILITY_CONFIG
): DimensionResult {
  const details: string[] = [];
  
  if (correlations_by_region.length < config.min_regions) {
    details.push(`Insufficient regions: ${correlations_by_region.length} < ${config.min_regions}`);
    return {
      dimension: 'geographic',
      score: 0,
      samples_tested: correlations_by_region.length,
      consistent_samples: 0,
      coefficient_of_variation: 1,
      details
    };
  }
  
  const correlations = correlations_by_region.map(c => c.correlation);
  const cv = calculateCV(correlations);
  
  // Check sign consistency
  const positiveCount = correlations.filter(c => c > 0).length;
  const negativeCount = correlations.filter(c => c < 0).length;
  const signConsistent = positiveCount === correlations.length || negativeCount === correlations.length;
  
  let score = Math.max(0, 1 - cv);
  if (signConsistent) {
    details.push('Pattern direction consistent across all regions');
  } else {
    score *= 0.5;
    details.push(`Pattern direction varies: ${positiveCount} positive, ${negativeCount} negative`);
  }
  
  const mean = correlations.reduce((a, b) => a + b, 0) / correlations.length;
  const std = Math.sqrt(correlations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / correlations.length);
  const consistentCount = correlations.filter(c => Math.abs(c - mean) <= std).length;
  
  details.push(`Geographic CV: ${cv.toFixed(4)}`);
  details.push(`Regions: ${correlations_by_region.map(r => r.region).join(', ')}`);
  
  return {
    dimension: 'geographic',
    score,
    samples_tested: correlations.length,
    consistent_samples: consistentCount,
    coefficient_of_variation: cv,
    details
  };
}

/**
 * Calculate source stability
 * Tests if the pattern holds across different data sources
 */
export function calculateSourceStability(
  correlations_by_source: Array<{ source: string; correlation: number }>,
  config: StabilityConfig = DEFAULT_STABILITY_CONFIG
): DimensionResult {
  const details: string[] = [];
  
  if (correlations_by_source.length < config.min_sources) {
    details.push(`Insufficient sources: ${correlations_by_source.length} < ${config.min_sources}`);
    return {
      dimension: 'source',
      score: 0,
      samples_tested: correlations_by_source.length,
      consistent_samples: 0,
      coefficient_of_variation: 1,
      details
    };
  }
  
  const correlations = correlations_by_source.map(c => c.correlation);
  const cv = calculateCV(correlations);
  
  // Check sign consistency
  const positiveCount = correlations.filter(c => c > 0).length;
  const signConsistent = positiveCount === correlations.length || positiveCount === 0;
  
  let score = Math.max(0, 1 - cv);
  if (!signConsistent) {
    score *= 0.5;
    details.push('Pattern varies by data source');
  }
  
  const mean = correlations.reduce((a, b) => a + b, 0) / correlations.length;
  const std = Math.sqrt(correlations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / correlations.length);
  const consistentCount = correlations.filter(c => Math.abs(c - mean) <= std).length;
  
  details.push(`Source CV: ${cv.toFixed(4)}`);
  details.push(`Sources: ${correlations_by_source.map(s => s.source).join(', ')}`);
  
  return {
    dimension: 'source',
    score,
    samples_tested: correlations.length,
    consistent_samples: consistentCount,
    coefficient_of_variation: cv,
    details
  };
}

/**
 * Generate SHA-256 hash for reproducibility verification
 */
async function hashInput(data: unknown): Promise<string> {
  const text = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculate complete stability assessment
 * Main entry point for stability scoring
 */
export async function calculateStabilityScore(
  temporal_data: Array<{ period: string; correlation: number }>,
  geographic_data: Array<{ region: string; correlation: number }>,
  source_data: Array<{ source: string; correlation: number }>,
  config: StabilityConfig = DEFAULT_STABILITY_CONFIG
): Promise<StabilityAssessment> {
  const calculationSteps: string[] = [];
  const warnings: string[] = [];
  
  calculationSteps.push('Step 1: Calculate temporal stability');
  const temporal = calculateTemporalStability(temporal_data, config);
  
  calculationSteps.push('Step 2: Calculate geographic stability');
  const geographic = calculateGeographicStability(geographic_data, config);
  
  calculationSteps.push('Step 3: Calculate source stability');
  const source = calculateSourceStability(source_data, config);
  
  // Weighted average
  calculationSteps.push('Step 4: Calculate weighted overall score');
  
  const weightedScore = 
    (temporal.score * config.temporal_consistency_weight) +
    (geographic.score * config.geographic_consistency_weight) +
    (source.score * config.source_consistency_weight);
  
  calculationSteps.push(`  Temporal: ${temporal.score.toFixed(4)} × ${config.temporal_consistency_weight} = ${(temporal.score * config.temporal_consistency_weight).toFixed(4)}`);
  calculationSteps.push(`  Geographic: ${geographic.score.toFixed(4)} × ${config.geographic_consistency_weight} = ${(geographic.score * config.geographic_consistency_weight).toFixed(4)}`);
  calculationSteps.push(`  Source: ${source.score.toFixed(4)} × ${config.source_consistency_weight} = ${(source.score * config.source_consistency_weight).toFixed(4)}`);
  calculationSteps.push(`  Total: ${weightedScore.toFixed(4)}`);
  
  // Determine stability level
  calculationSteps.push('Step 5: Classify stability level');
  let stabilityLevel: StabilityLevel;
  if (weightedScore >= config.high_stability_threshold) {
    stabilityLevel = 'high';
    calculationSteps.push(`  ${weightedScore.toFixed(4)} >= ${config.high_stability_threshold} → HIGH`);
  } else if (weightedScore >= config.medium_stability_threshold) {
    stabilityLevel = 'medium';
    calculationSteps.push(`  ${weightedScore.toFixed(4)} >= ${config.medium_stability_threshold} → MEDIUM`);
  } else if (weightedScore >= config.low_stability_threshold) {
    stabilityLevel = 'low';
    calculationSteps.push(`  ${weightedScore.toFixed(4)} >= ${config.low_stability_threshold} → LOW`);
  } else {
    stabilityLevel = 'unstable';
    calculationSteps.push(`  ${weightedScore.toFixed(4)} < ${config.low_stability_threshold} → UNSTABLE`);
  }
  
  // Data quality warnings
  if (temporal.samples_tested < config.min_subperiods) {
    warnings.push('Insufficient temporal data for robust stability assessment');
  }
  if (geographic.samples_tested < config.min_regions) {
    warnings.push('Insufficient geographic data for robust stability assessment');
  }
  if (source.samples_tested < config.min_sources) {
    warnings.push('Insufficient cross-source data for robust stability assessment');
  }
  
  // Generate input hash for reproducibility
  const inputHash = await hashInput({ temporal_data, geographic_data, source_data, config });
  
  return {
    overall_score: weightedScore,
    stability_level: stabilityLevel,
    temporal,
    geographic,
    source,
    config_used: config,
    calculation_steps: calculationSteps,
    data_warnings: warnings,
    input_hash: inputHash,
    calculated_at: new Date().toISOString()
  };
}

/**
 * Quick stability classification (for simple use cases)
 */
export function classifyStabilitySimple(score: number): StabilityLevel {
  if (score >= 0.8) return 'high';
  if (score >= 0.6) return 'medium';
  if (score >= 0.3) return 'low';
  return 'unstable';
}

/**
 * Export configuration as JSON for audit purposes
 */
export function exportConfigurationAudit(config: StabilityConfig = DEFAULT_STABILITY_CONFIG): string {
  return JSON.stringify({
    algorithm_version: '1.0.0',
    last_updated: '2026-02-02',
    methodology: 'Coefficient of Variation with sign consistency',
    config,
    formulas: {
      cv: 'CV = σ / |μ|',
      dimension_score: 'score = max(0, 1 - CV) × sign_consistency_factor',
      overall_score: 'score = Σ(dimension_score × weight)',
      sign_consistency_factor: 'If all signs match: 1.0, else: 0.5'
    }
  }, null, 2);
}
