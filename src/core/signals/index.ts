/**
 * SIGNALS MODULE
 * 
 * Real-time change detection without narrative.
 * Knows when reality moves, not what to think about it.
 */

// Types
export type {
  RawSignal,
  NormalizedSignal,
  SignalDetection,
  SignalBinding,
  SignalSourceType,
  DetectionType,
} from './types';

export {
  DETECTION_THRESHOLDS,
  SIGNAL_GUARDRAILS,
  SIGNAL_DISPLAY_RULES,
} from './types';

// Normalizer
export {
  normalizeSignal,
  normalizeSignals,
  filterValidSignals,
  registerBaseline,
  hasBaseline,
  getBaseline,
  NORMALIZER_STATS,
} from './normalizer';

// Detector
export {
  detectSpike,
  detectAcceleration,
  detectPersistence,
  detectChanges,
  shouldFlagAsSignal,
} from './detector';

// Binder
export {
  bindSignal,
  bindSignals,
  filterBoundSignals,
  getSignalsForIndex,
  getSignalsForDomain,
  aggregateDetectionsForIndex,
} from './binder';

// Red Team
export {
  ATTACK_SCENARIOS,
  runRedTeamScenario,
  runAllRedTeamScenarios,
  getRedTeamSummary,
} from './red-team';

export type { RedTeamResult } from './red-team';
