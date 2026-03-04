/**
 * DIAGNOSTIC ENGINE
 * 
 * Standalone diagnostic logic module, fully decoupled from UI.
 * Provides machine-to-machine diagnostic capability via pure functions.
 */

export { DiagnosticEngine, createDiagnosticEngine } from './engine';
export type {
  DiagnosticSession,
  SystemIdentity,
  ActiveFaultCode,
  MeasureBlock,
  GuidedStep,
  ProbableCause,
  DeepAnalysis,
  DiagnosticScope,
  DiagnosticResult,
} from './types';
export { generateSessionId, computeUncertainty, rankCauses } from './utils';
