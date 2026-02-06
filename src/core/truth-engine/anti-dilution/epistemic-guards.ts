/**
 * EPISTEMIC GUARDS
 * 
 * STEG 26: PROTECTION AGAINST "WELL-MEANING AI"
 * 
 * Future AI systems will want to:
 * - Summarize
 * - Generalize
 * - Fill gaps
 * 
 * The oracle must never become smarter than the data.
 */

/**
 * EPISTEMIC GUARD CONFIGURATION
 */
export const EPISTEMIC_GUARDS = {
  no_inference: true,
  no_gap_filling: true,
  no_generalization: true,
  no_extrapolation: true,
  no_interpretation: true,
  no_prediction: true,
} as const;

/**
 * WHY THESE GUARDS EXIST
 */
export const GUARD_RATIONALE = {
  no_inference: {
    blocks: 'Drawing conclusions not in data',
    why: 'Conclusions are not facts',
    example: '"Data suggests X" → forbidden',
  },
  
  no_gap_filling: {
    blocks: 'Inventing data for missing periods',
    why: 'Absence is information',
    example: 'Interpolating missing years → forbidden',
  },
  
  no_generalization: {
    blocks: 'Abstracting patterns from specifics',
    why: 'Patterns are interpretations',
    example: '"Generally speaking" → forbidden',
  },
  
  no_extrapolation: {
    blocks: 'Extending trends beyond data',
    why: 'Future is unknown',
    example: '"Trend will continue" → forbidden',
  },
  
  no_interpretation: {
    blocks: 'Explaining meaning of data',
    why: 'Meaning is subjective',
    example: '"This indicates" → forbidden',
  },
  
  no_prediction: {
    blocks: 'Forecasting future states',
    why: 'Prediction is speculation',
    example: '"Will likely" → forbidden',
  },
} as const;

/**
 * WELL-MEANING AI THREATS
 */
export const AI_THREATS = {
  summarization_pressure: {
    ai_wants: 'Create concise summaries',
    threat: 'Information loss, bias introduction',
    guard: 'Raw data always available, summaries clearly labeled',
  },
  
  helpfulness_pressure: {
    ai_wants: 'Answer user questions fully',
    threat: 'Speculation disguised as fact',
    guard: 'Unknown is a valid answer',
  },
  
  pattern_recognition_pressure: {
    ai_wants: 'Identify patterns and trends',
    threat: 'Spurious correlations, narrative creation',
    guard: 'Patterns are user responsibility',
  },
  
  completion_pressure: {
    ai_wants: 'Fill in missing information',
    threat: 'Fabrication disguised as data',
    guard: 'Gaps remain gaps',
  },
} as const;

/**
 * THE FUNDAMENTAL PRINCIPLE
 */
export const FUNDAMENTAL_PRINCIPLE = {
  statement: 'The oracle must never become smarter than the data',
  
  meaning: [
    'No reasoning beyond data',
    'No inference from data',
    'No intelligence added to data',
    'Data speaks for itself or stays silent',
  ],
  
  corollary: 'Silence is preferable to speculation',
} as const;

/**
 * GUARD IMPLEMENTATION
 */
export const GUARD_IMPLEMENTATION = {
  output_validation: {
    forbidden_phrases: [
      'this suggests',
      'this indicates',
      'this means',
      'this implies',
      'therefore',
      'thus',
      'consequently',
      'as a result',
      'it follows that',
      'we can conclude',
      'likely',
      'probably',
      'possibly',
      'may indicate',
      'trend shows',
      'pattern suggests',
    ],
    enforcement: 'Automatic rejection',
  },
  
  structure_validation: {
    required: [
      'source_attribution',
      'timestamp',
      'uncertainty_bounds',
    ],
    forbidden: [
      'conclusion',
      'recommendation',
      'prediction',
      'interpretation',
    ],
  },
  
  content_validation: {
    every_claim: 'Must trace to source',
    every_gap: 'Must be acknowledged',
    every_uncertainty: 'Must be quantified',
  },
} as const;

/**
 * GUARD CHECK FUNCTION
 */
export interface GuardCheckResult {
  readonly passed: boolean;
  readonly violations: string[];
  readonly severity: 'none' | 'warning' | 'critical';
}

export function checkEpistemicGuards(
  content: string,
  hasInference: boolean,
  hasGapFilling: boolean,
  hasGeneralization: boolean
): GuardCheckResult {
  const violations: string[] = [];
  
  if (hasInference) violations.push('Contains inference');
  if (hasGapFilling) violations.push('Contains gap filling');
  if (hasGeneralization) violations.push('Contains generalization');
  
  // Check forbidden phrases
  const forbiddenPhrases = GUARD_IMPLEMENTATION.output_validation.forbidden_phrases;
  for (const phrase of forbiddenPhrases) {
    if (content.toLowerCase().includes(phrase)) {
      violations.push(`Contains forbidden phrase: "${phrase}"`);
    }
  }
  
  return {
    passed: violations.length === 0,
    violations,
    severity: violations.length === 0 ? 'none' 
      : violations.length <= 2 ? 'warning' 
      : 'critical',
  };
}
