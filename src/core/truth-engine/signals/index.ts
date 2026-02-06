/**
 * REAL-TIME SIGNAL LAYER
 * 
 * STEG 21: REAL-TIME SIGNAL INGESTION & AUTOMATISK FRÅGEUPPKOMST
 * 
 * Nyckelprincip: Oraklet jagar aldrig nyheter.
 * Det registrerar förändring.
 * 
 * Här slutar ni planera täckning.
 * Nu börjar världen själv tala om för oraklet vilka frågor som uppstår.
 */

// Signal Types
export type {
  SignalType,
  BaseSignal,
  AnomalySignal,
  NewDimensionSignal,
  StructuralChangeSignal,
  CrossCouplingSignal,
  Signal,
  SignalClassification,
} from './signal-types';

export {
  SIGNALS_ARE_NOT,
  SIGNALS_ARE,
  SIGNAL_TYPE_DESCRIPTIONS,
  createAnomalySignal,
  createNewDimensionSignal,
} from './signal-types';

// Question Emergence
export type {
  EmergedQuestion,
  QuestionEmergenceStats,
} from './question-emergence';

export {
  QUESTION_TEMPLATES,
  QuestionEmergenceEngine,
  EMERGENCE_PRINCIPLES,
  createQuestionEmergenceEngine,
} from './question-emergence';

// Slow Truth
export type {
  TimelinessPolicy,
  VerificationRequirements,
  VisibilityStage,
  StageRequirements,
  QuestionState,
  StageTransition,
  SlowTruthStats,
} from './slow-truth';

export {
  STAGE_REQUIREMENTS,
  SlowTruthEngine,
  DEFAULT_TIMELINESS_POLICY,
  SLOW_TRUTH_PRINCIPLES,
  createSlowTruthEngine,
} from './slow-truth';

// Signal Pipeline
export type {
  PipelineResult,
  PipelineStats,
} from './signal-pipeline';

export {
  SignalPipeline,
  PIPELINE_PRINCIPLES,
  STEG_21_OUTCOMES,
  createSignalPipeline,
} from './signal-pipeline';

/**
 * STEG 21 SUMMARY
 * 
 * After this step you have:
 * - A system that discovers new questions itself
 * - Zero speculation
 * - Zero reactivity
 * - Maximum long-term relevance
 * 
 * You have built:
 * An oracle that listens – not reacts.
 */
export const STEG_21_SUMMARY = {
  // Four signal types that create new questions
  signal_types: {
    A_anomaly: 'Statistical deviation from historical pattern',
    B_new_dimension: 'New data source, demographic, or geographic granularity',
    C_structural_change: 'Methodology, definition, or regulation change',
    D_cross_coupling: 'Previously separate datasets can now be linked',
  },
  
  // Slow Truth principle
  slow_truth: {
    detection: 'Immediate',
    answering: 'Post-verification',
    benefit: 'Never spread false first reads',
  },
  
  // Visibility progression
  visibility_stages: [
    'dormant',      // Just emerged
    'agent_only',   // AI agents only
    'limited',      // Some search engines
    'standard',     // Normal visibility
    'promoted',     // High visibility
  ],
  
  // Time is a signal
  time_is_a_signal: true,
  
  // Key outcomes
  outcomes: {
    no_manual_roadmap_needed: true,
    no_trend_chasing: true,
    world_generates_its_own_question_structure: true,
    extreme_scalability: true,
  },
} as const;
