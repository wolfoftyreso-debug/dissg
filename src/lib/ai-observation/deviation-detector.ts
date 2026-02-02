/**
 * DEVIATION DETECTOR
 * 
 * Detects anomalies, level shifts, trend breaks, and volatility changes
 * using purely mathematical methods without interpretation.
 */

import type { DeviationDetection, StabilityLevel } from '@/types/ai-observation';

interface TimeSeriesPoint {
  date: string;
  value: number;
}

interface DetectionConfig {
  z_score_threshold: number;      // Standard deviations for anomaly
  window_size: number;            // Rolling window for baseline
  min_data_points: number;        // Minimum points for valid detection
  trend_sensitivity: number;      // Sensitivity for trend break detection
}

const DEFAULT_CONFIG: DetectionConfig = {
  z_score_threshold: 2.0,
  window_size: 12,
  min_data_points: 24,
  trend_sensitivity: 0.05
};

/**
 * Calculate basic statistics for a time series
 */
function calculateStats(values: number[]): { mean: number; std: number; min: number; max: number } {
  const n = values.length;
  if (n === 0) return { mean: 0, std: 0, min: 0, max: 0 };
  
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance);
  
  return {
    mean,
    std,
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

/**
 * Detect level shifts (sudden changes in mean)
 */
export function detectLevelShifts(
  data: TimeSeriesPoint[],
  variableId: string,
  variableName: string,
  config: Partial<DetectionConfig> = {}
): DeviationDetection[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const detections: DeviationDetection[] = [];
  
  if (data.length < cfg.min_data_points) return detections;
  
  const values = data.map(d => d.value);
  
  // Sliding window comparison
  for (let i = cfg.window_size; i < values.length - cfg.window_size; i++) {
    const beforeWindow = values.slice(i - cfg.window_size, i);
    const afterWindow = values.slice(i, i + cfg.window_size);
    
    const beforeStats = calculateStats(beforeWindow);
    const afterStats = calculateStats(afterWindow);
    
    // Calculate magnitude of shift
    const pooledStd = Math.sqrt((beforeStats.std ** 2 + afterStats.std ** 2) / 2) || 1;
    const shiftMagnitude = (afterStats.mean - beforeStats.mean) / pooledStd;
    
    if (Math.abs(shiftMagnitude) >= cfg.z_score_threshold) {
      detections.push({
        type: 'level_shift',
        variable_id: variableId,
        variable_name: variableName,
        period_start: data[i].date,
        period_end: data[Math.min(i + cfg.window_size, data.length - 1)].date,
        magnitude: Math.abs(shiftMagnitude),
        direction: shiftMagnitude > 0 ? 'increase' : 'decrease',
        baseline_period: `${data[i - cfg.window_size].date} to ${data[i - 1].date}`,
        confidence_interval: [
          afterStats.mean - 1.96 * afterStats.std / Math.sqrt(cfg.window_size),
          afterStats.mean + 1.96 * afterStats.std / Math.sqrt(cfg.window_size)
        ]
      });
    }
  }
  
  return detections;
}

/**
 * Detect trend breaks (changes in direction or acceleration)
 */
export function detectTrendBreaks(
  data: TimeSeriesPoint[],
  variableId: string,
  variableName: string,
  config: Partial<DetectionConfig> = {}
): DeviationDetection[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const detections: DeviationDetection[] = [];
  
  if (data.length < cfg.min_data_points) return detections;
  
  const values = data.map(d => d.value);
  
  // Calculate rolling slopes
  const slopes: number[] = [];
  for (let i = cfg.window_size; i < values.length; i++) {
    const window = values.slice(i - cfg.window_size, i);
    // Simple linear regression slope
    const xMean = (cfg.window_size - 1) / 2;
    const yMean = window.reduce((a, b) => a + b, 0) / cfg.window_size;
    
    let numerator = 0;
    let denominator = 0;
    for (let j = 0; j < cfg.window_size; j++) {
      numerator += (j - xMean) * (window[j] - yMean);
      denominator += (j - xMean) ** 2;
    }
    slopes.push(denominator !== 0 ? numerator / denominator : 0);
  }
  
  // Detect slope sign changes
  for (let i = 1; i < slopes.length; i++) {
    const slopeChange = slopes[i] - slopes[i - 1];
    const avgSlope = (Math.abs(slopes[i]) + Math.abs(slopes[i - 1])) / 2 || 1;
    
    if (Math.abs(slopeChange) / avgSlope > cfg.trend_sensitivity * 10) {
      const dataIndex = i + cfg.window_size;
      detections.push({
        type: 'trend_break',
        variable_id: variableId,
        variable_name: variableName,
        period_start: data[dataIndex].date,
        period_end: data[Math.min(dataIndex + cfg.window_size, data.length - 1)].date,
        magnitude: Math.abs(slopeChange),
        direction: slopeChange > 0 ? 'increase' : 'decrease',
        baseline_period: `${data[dataIndex - cfg.window_size].date} to ${data[dataIndex - 1].date}`,
        confidence_interval: [slopes[i] - 0.1, slopes[i] + 0.1]
      });
    }
  }
  
  return detections;
}

/**
 * Detect volatility jumps (changes in variance)
 */
export function detectVolatilityJumps(
  data: TimeSeriesPoint[],
  variableId: string,
  variableName: string,
  config: Partial<DetectionConfig> = {}
): DeviationDetection[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const detections: DeviationDetection[] = [];
  
  if (data.length < cfg.min_data_points) return detections;
  
  const values = data.map(d => d.value);
  
  // Calculate rolling volatility (standard deviation)
  const volatilities: number[] = [];
  for (let i = cfg.window_size; i < values.length; i++) {
    const window = values.slice(i - cfg.window_size, i);
    const stats = calculateStats(window);
    volatilities.push(stats.std);
  }
  
  const volStats = calculateStats(volatilities);
  
  // Detect volatility spikes
  for (let i = 0; i < volatilities.length; i++) {
    const zScore = (volatilities[i] - volStats.mean) / (volStats.std || 1);
    
    if (Math.abs(zScore) >= cfg.z_score_threshold) {
      const dataIndex = i + cfg.window_size;
      detections.push({
        type: 'volatility_jump',
        variable_id: variableId,
        variable_name: variableName,
        period_start: data[dataIndex - cfg.window_size].date,
        period_end: data[dataIndex].date,
        magnitude: Math.abs(zScore),
        direction: zScore > 0 ? 'increase' : 'decrease',
        baseline_period: `Historical average volatility`,
        confidence_interval: [
          volatilities[i] - 1.96 * volStats.std,
          volatilities[i] + 1.96 * volStats.std
        ]
      });
    }
  }
  
  return detections;
}

/**
 * Assess stability of a detected pattern
 */
export function assessStability(
  detections: DeviationDetection[],
  _bySubperiod: boolean = true,
  _byGeography: boolean = false
): { level: StabilityLevel; score: number; breakdown: Record<string, number> } {
  if (detections.length === 0) {
    return { level: 'unstable', score: 0, breakdown: {} };
  }
  
  // Calculate consistency across detections
  const magnitudes = detections.map(d => d.magnitude);
  const stats = calculateStats(magnitudes);
  
  // Coefficient of variation as stability measure
  const cv = stats.mean > 0 ? stats.std / stats.mean : 1;
  
  // Convert to 0-1 score (lower CV = higher stability)
  const score = Math.max(0, 1 - cv);
  
  let level: StabilityLevel;
  if (score >= 0.8) level = 'high';
  else if (score >= 0.6) level = 'medium';
  else if (score >= 0.3) level = 'low';
  else level = 'unstable';
  
  return {
    level,
    score,
    breakdown: {
      temporal_consistency: score,
      magnitude_variance: cv,
      detection_count: detections.length
    }
  };
}

/**
 * Run all deviation detection algorithms
 */
export function runFullDeviationAnalysis(
  data: TimeSeriesPoint[],
  variableId: string,
  variableName: string,
  config: Partial<DetectionConfig> = {}
): {
  level_shifts: DeviationDetection[];
  trend_breaks: DeviationDetection[];
  volatility_jumps: DeviationDetection[];
  stability: { level: StabilityLevel; score: number };
} {
  const levelShifts = detectLevelShifts(data, variableId, variableName, config);
  const trendBreaks = detectTrendBreaks(data, variableId, variableName, config);
  const volatilityJumps = detectVolatilityJumps(data, variableId, variableName, config);
  
  const allDetections = [...levelShifts, ...trendBreaks, ...volatilityJumps];
  const stability = assessStability(allDetections);
  
  return {
    level_shifts: levelShifts,
    trend_breaks: trendBreaks,
    volatility_jumps: volatilityJumps,
    stability: { level: stability.level, score: stability.score }
  };
}
