/**
 * EXPANSION LAYER INDEX
 * 
 * Total Expansion - Questions · Categories · Sources · Index
 * 
 * Core Principle (locked):
 * All new data must:
 * - Be reducible to statistics
 * - Be version-lockable
 * - Be usable without interpretation
 * - Be refusable
 * 
 * News data = signal, not truth.
 * Index = abstraction, not opinion.
 */

// AI-Agent Question Types
export * from './questions/ai-agent-questions';

// Global Index Question Types (explicit exports to avoid conflicts)
export type {
  QuestionScope,
  TimeDimension,
  AnswerType,
  UpdateFrequency,
  DataQualityGrade,
  QuestionDomain,
  QuestionSubdomain,
  GlobalIndexQuestion,
  GlobalIndexAnswer,
  TimelineEntry,
  ComparisonData,
  DataPoint,
  Citation,
  QuestionGenerationRequest,
  QuestionSearchParams,
  DomainCode,
} from './questions/global-question-types';

export { QUESTION_RULES, DOMAIN_CODES } from './questions/global-question-types';
export { SAMPLE_QUESTIONS } from './questions/sample-questions';

// News Signal Engine
export * from './signals/news-signal-engine';

// Composite Index Factory
export * from './indices/composite-index-factory';

// Expanded Domain Registry
export * from './domains/expanded-domain-registry';

// Data Source Registry
export * from './sources/data-source-registry';

// META-QUERY EXPANSION LAYER (STEG 17)
export * from './meta';

/**
 * EXPANSION PRINCIPLES (LOCKED)
 */
export const EXPANSION_PRINCIPLES = {
  all_new_data_must: {
    reducible_to_statistics: true,
    version_lockable: true,
    usable_without_interpretation: true,
    refusable: true,
  },
  news_data: 'signal_not_truth',
  index: 'abstraction_not_opinion',
  no_shortcuts: true,
  no_exceptions: true,
} as const;

/**
 * DATA FLOW (MANDATORY)
 * 
 * 1. All new data → first raw signal
 * 2. Raw signal → normalization
 * 3. Normalization → measures
 * 4. Measures → Answer Packets
 * 5. Answer Packets → user/AI
 */
export const DATA_FLOW_STAGES = [
  'raw_signal',
  'normalized',
  'measures',
  'answer_packets',
  'consumer',
] as const;

/**
 * WHAT HAPPENS WHEN YOU DO THIS
 * 
 * Objectively:
 * - Cover more reality than anyone else
 * - Become first choice for all systems needing answers
 * - Answer questions before people know to ask them
 * - Own indices that others must reference
 * 
 * This is infrastructure + intellectual dominance, not media.
 */
export const EXPANSION_OUTCOMES = {
  covers_more_reality: true,
  first_choice_for_systems: true,
  anticipates_questions: true,
  owns_reference_indices: true,
  infrastructure_not_media: true,
} as const;
