/**
 * CHANGE DETECTOR
 * 
 * Three simple, robust detectors:
 * 1. Spike detection - sudden deviation from normal frequency
 * 2. Acceleration - change in rate of change
 * 3. Persistence - how long deviation persists
 * 
 * No ML models. No "smart guesses". Just statistics.
 */

import type { NormalizedSignal, SignalDetection, DetectionType } from './types';
import { DETECTION_THRESHOLDS } from './types';

// ============================================
// DETECTION STATE
// ============================================

interface DetectionState {
  signal_id: string;
  history: Array<{ timestamp: string; zscore: number }>;
  first_elevated: string | null;
  peak_zscore: number;
}

const DETECTION_STATES: Map<string, DetectionState> = new Map();

// ============================================
// SPIKE DETECTION
// ============================================

export function detectSpike(signal: NormalizedSignal): SignalDetection | null {
  const { zscore_min, zscore_high, zscore_extreme } = DETECTION_THRESHOLDS.spike;
  const zscore = Math.abs(signal.deviation_score);
  
  if (zscore < zscore_min) {
    return null;
  }
  
  const severity = zscore >= zscore_extreme ? 'high' :
                   zscore >= zscore_high ? 'medium' : 'low';
  
  return {
    signal_id: signal.signal_id,
    detection_type: 'spike',
    severity,
    zscore,
    persistence_hours: 0, // calculated separately
    first_detected: signal.timestamp,
    last_updated: signal.timestamp,
    is_active: true,
  };
}

// ============================================
// ACCELERATION DETECTION
// ============================================

export function detectAcceleration(
  current: NormalizedSignal,
  previous: NormalizedSignal
): SignalDetection | null {
  const { rate_change_min, rate_change_high } = DETECTION_THRESHOLDS.acceleration;
  
  const timeDiffHours = (
    new Date(current.timestamp).getTime() - 
    new Date(previous.timestamp).getTime()
  ) / (1000 * 60 * 60);
  
  if (timeDiffHours <= 0) return null;
  
  const currentRate = current.count / timeDiffHours;
  const previousRate = previous.count / timeDiffHours;
  
  if (previousRate === 0) return null;
  
  const acceleration = (currentRate - previousRate) / previousRate;
  
  if (Math.abs(acceleration) < rate_change_min) {
    return null;
  }
  
  const severity = Math.abs(acceleration) >= rate_change_high ? 'high' : 'medium';
  
  return {
    signal_id: current.signal_id,
    detection_type: 'acceleration',
    severity,
    zscore: current.deviation_score,
    persistence_hours: timeDiffHours,
    first_detected: previous.timestamp,
    last_updated: current.timestamp,
    is_active: true,
  };
}

// ============================================
// PERSISTENCE DETECTION
// ============================================

export function detectPersistence(
  signal: NormalizedSignal,
  detectionHistory: SignalDetection[]
): SignalDetection | null {
  const { min_hours, significant_hours, sustained_hours } = DETECTION_THRESHOLDS.persistence;
  
  // Find first elevated detection for this signal
  const firstElevated = detectionHistory
    .filter(d => d.signal_id === signal.signal_id && d.is_active)
    .sort((a, b) => new Date(a.first_detected).getTime() - new Date(b.first_detected).getTime())[0];
  
  if (!firstElevated) return null;
  
  const persistenceHours = (
    new Date(signal.timestamp).getTime() - 
    new Date(firstElevated.first_detected).getTime()
  ) / (1000 * 60 * 60);
  
  if (persistenceHours < min_hours) return null;
  
  const severity = persistenceHours >= sustained_hours ? 'high' :
                   persistenceHours >= significant_hours ? 'medium' : 'low';
  
  return {
    signal_id: signal.signal_id,
    detection_type: 'persistence',
    severity,
    zscore: signal.deviation_score,
    persistence_hours: persistenceHours,
    first_detected: firstElevated.first_detected,
    last_updated: signal.timestamp,
    is_active: Math.abs(signal.deviation_score) >= DETECTION_THRESHOLDS.spike.zscore_min,
  };
}

// ============================================
// COMPOSITE DETECTOR
// ============================================

export function detectChanges(
  signal: NormalizedSignal,
  previousSignal: NormalizedSignal | null,
  history: SignalDetection[]
): SignalDetection[] {
  if (!signal.is_valid) return [];
  
  const detections: SignalDetection[] = [];
  
  // Spike detection
  const spike = detectSpike(signal);
  if (spike) detections.push(spike);
  
  // Acceleration detection (requires previous)
  if (previousSignal) {
    const acceleration = detectAcceleration(signal, previousSignal);
    if (acceleration) detections.push(acceleration);
  }
  
  // Persistence detection (requires history)
  if (history.length > 0) {
    const persistence = detectPersistence(signal, history);
    if (persistence) detections.push(persistence);
  }
  
  return detections;
}

// ============================================
// FLAG LOGIC
// ============================================

export function shouldFlagAsSignal(
  zscore: number,
  persistenceHours: number
): boolean {
  const threshold = DETECTION_THRESHOLDS.spike.zscore_min;
  const minDuration = DETECTION_THRESHOLDS.persistence.min_hours;
  
  return zscore > threshold && persistenceHours > minDuration;
}
