/**
 * REALTIME DEVIATION DETECTOR
 * 
 * Live monitoring system that automatically flags new deviations
 * when data is updated.
 * 
 * This module provides:
 * - Real-time detection of level shifts, trend breaks, volatility jumps
 * - Automatic alerting when new patterns emerge
 * - Comparison with historical baselines
 */

import type { DeviationDetection, StabilityLevel } from '@/types/ai-observation';
import { detectLevelShifts, detectTrendBreaks, detectVolatilityJumps, assessStability } from './deviation-detector';

/**
 * Alert severity levels
 */
export type AlertSeverity = 'info' | 'warning' | 'critical';

/**
 * Real-time deviation alert
 */
export interface DeviationAlert {
  id: string;
  created_at: string;
  severity: AlertSeverity;
  detection: DeviationDetection;
  context: {
    baseline_period: string;
    deviation_from_baseline: number;
    historical_occurrences: number;
    is_novel: boolean;
  };
  status: 'new' | 'acknowledged' | 'resolved';
}

/**
 * Monitoring configuration
 */
export interface MonitoringConfig {
  // Detection thresholds
  level_shift_threshold: number;
  trend_break_threshold: number;
  volatility_threshold: number;
  
  // Alert thresholds
  critical_z_score: number;
  warning_z_score: number;
  
  // Historical context
  lookback_periods: number;
  novelty_threshold: number;
}

const DEFAULT_MONITORING_CONFIG: MonitoringConfig = {
  level_shift_threshold: 2.0,
  trend_break_threshold: 0.05,
  volatility_threshold: 2.0,
  critical_z_score: 3.0,
  warning_z_score: 2.0,
  lookback_periods: 60,
  novelty_threshold: 0.1
};

/**
 * Store for active monitors
 */
interface MonitorState {
  variable_id: string;
  variable_name: string;
  last_check: string;
  baseline_stats: {
    mean: number;
    std: number;
    trend_slope: number;
  };
  recent_values: Array<{ date: string; value: number }>;
  active_alerts: DeviationAlert[];
}

const activeMonitors: Map<string, MonitorState> = new Map();

/**
 * Generate unique alert ID
 */
function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate severity based on magnitude
 */
function calculateSeverity(magnitude: number, config: MonitoringConfig): AlertSeverity {
  if (magnitude >= config.critical_z_score) return 'critical';
  if (magnitude >= config.warning_z_score) return 'warning';
  return 'info';
}

/**
 * Check if a detection is novel (not seen recently in history)
 */
function isNovelDetection(
  detection: DeviationDetection,
  historicalDetections: DeviationDetection[],
  config: MonitoringConfig
): boolean {
  // Check if similar detections occurred recently
  const similarCount = historicalDetections.filter(h => 
    h.type === detection.type &&
    h.variable_id === detection.variable_id &&
    Math.abs(h.magnitude - detection.magnitude) < config.novelty_threshold
  ).length;
  
  return similarCount === 0;
}

/**
 * Create alert from detection
 */
function createAlert(
  detection: DeviationDetection,
  historicalDetections: DeviationDetection[],
  config: MonitoringConfig
): DeviationAlert {
  return {
    id: generateAlertId(),
    created_at: new Date().toISOString(),
    severity: calculateSeverity(detection.magnitude, config),
    detection,
    context: {
      baseline_period: detection.baseline_period,
      deviation_from_baseline: detection.magnitude,
      historical_occurrences: historicalDetections.filter(h => 
        h.type === detection.type && h.variable_id === detection.variable_id
      ).length,
      is_novel: isNovelDetection(detection, historicalDetections, config)
    },
    status: 'new'
  };
}

/**
 * Initialize monitoring for a variable
 */
export function startMonitoring(
  variableId: string,
  variableName: string,
  historicalData: Array<{ date: string; value: number }>,
  config: MonitoringConfig = DEFAULT_MONITORING_CONFIG
): void {
  const values = historicalData.map(d => d.value);
  const n = values.length;
  
  // Calculate baseline statistics
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance);
  
  // Calculate trend slope
  const xMean = (n - 1) / 2;
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - mean);
    denominator += (i - xMean) ** 2;
  }
  const trendSlope = denominator !== 0 ? numerator / denominator : 0;
  
  activeMonitors.set(variableId, {
    variable_id: variableId,
    variable_name: variableName,
    last_check: new Date().toISOString(),
    baseline_stats: { mean, std, trend_slope: trendSlope },
    recent_values: historicalData.slice(-config.lookback_periods),
    active_alerts: []
  });
}

/**
 * Check for new deviations in updated data
 */
export function checkForDeviations(
  variableId: string,
  newData: Array<{ date: string; value: number }>,
  config: MonitoringConfig = DEFAULT_MONITORING_CONFIG
): DeviationAlert[] {
  const monitor = activeMonitors.get(variableId);
  if (!monitor) {
    console.warn(`No active monitor for variable ${variableId}`);
    return [];
  }
  
  // Combine recent values with new data
  const combinedData = [...monitor.recent_values, ...newData];
  const timeSeriesData = combinedData.map(d => ({ date: d.date, value: d.value }));
  
  // Run all detection algorithms
  const levelShifts = detectLevelShifts(
    timeSeriesData, 
    variableId, 
    monitor.variable_name,
    { z_score_threshold: config.level_shift_threshold }
  );
  
  const trendBreaks = detectTrendBreaks(
    timeSeriesData,
    variableId,
    monitor.variable_name,
    { trend_sensitivity: config.trend_break_threshold }
  );
  
  const volatilityJumps = detectVolatilityJumps(
    timeSeriesData,
    variableId,
    monitor.variable_name,
    { z_score_threshold: config.volatility_threshold }
  );
  
  // Get historical detections for novelty check
  const allDetections = [...levelShifts, ...trendBreaks, ...volatilityJumps];
  
  // Filter to only new detections (in the new data period)
  const newDataStartDate = newData[0]?.date;
  const newDetections = allDetections.filter(d => 
    d.period_start >= newDataStartDate
  );
  
  // Create alerts for new detections
  const alerts: DeviationAlert[] = newDetections.map(detection =>
    createAlert(detection, allDetections, config)
  );
  
  // Update monitor state
  monitor.last_check = new Date().toISOString();
  monitor.recent_values = combinedData.slice(-config.lookback_periods);
  monitor.active_alerts.push(...alerts);
  activeMonitors.set(variableId, monitor);
  
  return alerts;
}

/**
 * Get current monitoring status
 */
export function getMonitoringStatus(variableId: string): MonitorState | undefined {
  return activeMonitors.get(variableId);
}

/**
 * Get all active alerts across all monitors
 */
export function getAllActiveAlerts(): DeviationAlert[] {
  const allAlerts: DeviationAlert[] = [];
  activeMonitors.forEach(monitor => {
    allAlerts.push(...monitor.active_alerts.filter(a => a.status === 'new'));
  });
  return allAlerts.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Acknowledge an alert
 */
export function acknowledgeAlert(alertId: string): boolean {
  for (const [, monitor] of activeMonitors) {
    const alert = monitor.active_alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'acknowledged';
      return true;
    }
  }
  return false;
}

/**
 * Resolve an alert
 */
export function resolveAlert(alertId: string): boolean {
  for (const [, monitor] of activeMonitors) {
    const alert = monitor.active_alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      return true;
    }
  }
  return false;
}

/**
 * Stop monitoring a variable
 */
export function stopMonitoring(variableId: string): boolean {
  return activeMonitors.delete(variableId);
}

/**
 * Get list of all monitored variables
 */
export function getMonitoredVariables(): string[] {
  return Array.from(activeMonitors.keys());
}

/**
 * Export monitoring configuration for audit
 */
export function exportMonitoringConfig(config: MonitoringConfig = DEFAULT_MONITORING_CONFIG): string {
  return JSON.stringify({
    version: '1.0.0',
    config,
    methodology: {
      level_shift: 'Z-score based detection with sliding window comparison',
      trend_break: 'Linear regression slope change detection',
      volatility_jump: 'Rolling standard deviation with z-score threshold'
    },
    alert_levels: {
      critical: `Z-score >= ${config.critical_z_score}`,
      warning: `Z-score >= ${config.warning_z_score}`,
      info: `Z-score >= detection threshold but < warning`
    }
  }, null, 2);
}
