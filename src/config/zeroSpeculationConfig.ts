/**
 * 🛑 MASTER EXECUTION BLOCK 51
 * 
 * ZERO-SPECULATION MODE — DATA OR NOTHING
 * 
 * This config makes the platform an anti-bullshit system.
 * Nothing gets shown, said, or generated without explicit data support.
 * 
 * CORE RULE (UNBREAKABLE):
 * - If there's no data → it's not shown
 * - If the data is weak → it's stated clearly
 * - If causation isn't proven → it's marked as non-causal
 */

// ============================================================
// DATA STATUS LEVELS
// ============================================================

export type DataStatusLevel = 'verified' | 'observed' | 'estimated' | 'weak' | 'missing';
export type UncertaintyLevel = 'low' | 'medium' | 'high' | 'very_high';
export type CausalityStatus = 'causal' | 'association' | 'correlation' | 'none';
export type SourceStatus = 'open' | 'restricted' | 'proprietary' | 'unknown';

export interface DataStatus {
  dataLevel: DataStatusLevel;
  uncertainty: UncertaintyLevel;
  causality: CausalityStatus;
  sourceOpenness: SourceStatus;
  customWarnings?: string[];
}

export const DATA_STATUS_LABELS: Record<DataStatusLevel, { icon: string; text: string; className: string }> = {
  verified: { icon: '✔', text: 'Verified primary data', className: 'text-status-positive' },
  observed: { icon: '✔', text: 'Observed population data', className: 'text-status-positive' },
  estimated: { icon: '⚠', text: 'Estimated or modeled data', className: 'text-status-warning' },
  weak: { icon: '⚠', text: 'Weak or incomplete data', className: 'text-status-warning' },
  missing: { icon: '✖', text: 'Insufficient data', className: 'text-status-critical' },
};

export const UNCERTAINTY_LABELS: Record<UncertaintyLevel, { icon: string; text: string; className: string }> = {
  low: { icon: '✔', text: 'Low uncertainty', className: 'text-status-positive' },
  medium: { icon: '⚠', text: 'Medium uncertainty', className: 'text-status-warning' },
  high: { icon: '⚠', text: 'High uncertainty', className: 'text-status-warning' },
  very_high: { icon: '✖', text: 'Very high uncertainty', className: 'text-status-critical' },
};

export const CAUSALITY_LABELS: Record<CausalityStatus, { icon: string; text: string; className: string }> = {
  causal: { icon: '✔', text: 'Causal relationship established', className: 'text-status-positive' },
  association: { icon: '⚠', text: 'Association observed, not causal', className: 'text-status-warning' },
  correlation: { icon: '⚠', text: 'Correlation only, no causation', className: 'text-status-warning' },
  none: { icon: '✖', text: 'No causal inference possible', className: 'text-status-critical' },
};

export const SOURCE_LABELS: Record<SourceStatus, { icon: string; text: string; className: string }> = {
  open: { icon: '✔', text: 'Open sources', className: 'text-status-positive' },
  restricted: { icon: '⚠', text: 'Restricted access sources', className: 'text-status-warning' },
  proprietary: { icon: '⚠', text: 'Proprietary data', className: 'text-status-warning' },
  unknown: { icon: '✖', text: 'Source status unknown', className: 'text-status-critical' },
};

// ============================================================
// FORBIDDEN PHRASES (GLOBAL BLOCKLIST)
// ============================================================

/**
 * These phrases MUST NEVER appear in any generated or displayed text.
 * They imply recommendations, causation, or subjective judgment.
 */
export const FORBIDDEN_PHRASES = [
  // Recommendation phrases
  'this suggests that we should',
  'this proves that',
  'you should',
  'we recommend',
  'recommended intake',
  'best diet',
  'optimal policy',
  'the solution is',
  'the answer is',
  'experts recommend',
  'studies prove',
  
  // Causation claims without evidence
  'likely caused by',
  'definitely caused by',
  'the cause is',
  'this causes',
  'leads to',
  'results in',
  'because of this',
  
  // Authority appeals
  'experts believe',
  'scientists agree',
  'research shows that you should',
  'studies show you should',
  'consensus is',
  
  // Value judgments
  'this is good',
  'this is bad',
  'this is better',
  'this is worse',
  'the best way',
  'the worst thing',
  'successful',
  'failed',
  'victory',
  'defeat',
  
  // Certainty claims
  'obviously',
  'clearly',
  'undoubtedly',
  'certainly',
  'definitely',
  'without question',
  'it is clear that',
  'there is no doubt',
] as const;

/**
 * Replacement phrases for common forbidden patterns.
 */
export const PHRASE_REPLACEMENTS: Record<string, string> = {
  'this proves that': 'the data indicates',
  'likely caused by': 'associated with',
  'experts believe': 'some analyses suggest',
  'research shows that you should': 'observed patterns indicate',
  'this is good': 'this represents an increase/decrease',
  'this is bad': 'this represents a change from baseline',
  'the best way': 'one observed approach',
  'leads to': 'is associated with',
  'results in': 'co-occurs with',
};

// ============================================================
// MANDATORY PHRASES (MUST BE INCLUDED)
// ============================================================

/**
 * These phrases MUST appear on pages dealing with sensitive topics.
 */
export const MANDATORY_DISCLAIMERS = {
  /** Standard for all data pages */
  standard: 'These data describe population-level patterns only.',
  
  /** For individual-relevant topics */
  individual: 'They do not predict individual outcomes.',
  
  /** Anti-recommendation */
  noRecommendation: 'No recommendations are made.',
  
  /** For health topics */
  health: 'This information does not constitute medical advice.',
  
  /** For policy topics */
  policy: 'No policy recommendations are implied.',
  
  /** For economic topics */
  economic: 'Past patterns do not predict future outcomes.',
  
  /** For nutrition topics */
  nutrition: 'No dietary recommendations are provided.',
  
  /** For correlation displays */
  correlation: 'Correlation does not imply causation.',
} as const;

/**
 * Topic categories that require specific mandatory disclaimers.
 */
export const TOPIC_DISCLAIMER_REQUIREMENTS: Record<string, (keyof typeof MANDATORY_DISCLAIMERS)[]> = {
  nutrition: ['standard', 'individual', 'noRecommendation', 'nutrition'],
  health: ['standard', 'individual', 'noRecommendation', 'health'],
  economy: ['standard', 'economic', 'noRecommendation'],
  policy: ['standard', 'noRecommendation', 'policy'],
  violence: ['standard', 'individual', 'noRecommendation'],
  migration: ['standard', 'individual', 'noRecommendation'],
  education: ['standard', 'individual', 'noRecommendation'],
  demographics: ['standard', 'individual'],
  correlation: ['standard', 'correlation', 'noRecommendation'],
};

// ============================================================
// INTERPRETATION WARNINGS (ANTI-MISUSE)
// ============================================================

export type WarningType = 
  | 'cherry_picking'
  | 'missing_baseline'
  | 'incompatible_method'
  | 'exaggerated_correlation'
  | 'short_timeframe'
  | 'small_sample'
  | 'selection_bias'
  | 'confounding';

export interface InterpretationWarning {
  type: WarningType;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  technicalDetail?: string;
}

export const WARNING_DEFINITIONS: Record<WarningType, Omit<InterpretationWarning, 'technicalDetail'>> = {
  cherry_picking: {
    type: 'cherry_picking',
    severity: 'warning',
    message: 'Time period may be selectively chosen. Consider viewing full available range.',
  },
  missing_baseline: {
    type: 'missing_baseline',
    severity: 'warning',
    message: 'No baseline period established. Changes shown are relative, not absolute.',
  },
  incompatible_method: {
    type: 'incompatible_method',
    severity: 'critical',
    message: 'Comparison involves data collected with different methodologies.',
  },
  exaggerated_correlation: {
    type: 'exaggerated_correlation',
    severity: 'warning',
    message: 'Correlation strength may be overstated. Multiple confounders not controlled.',
  },
  short_timeframe: {
    type: 'short_timeframe',
    severity: 'info',
    message: 'Short observation period. Long-term patterns may differ.',
  },
  small_sample: {
    type: 'small_sample',
    severity: 'warning',
    message: 'Small sample size limits statistical reliability.',
  },
  selection_bias: {
    type: 'selection_bias',
    severity: 'warning',
    message: 'Data may reflect selection bias in reporting or collection.',
  },
  confounding: {
    type: 'confounding',
    severity: 'critical',
    message: 'Significant confounding factors not accounted for.',
  },
};

// ============================================================
// AI STRICT MODE RESPONSES
// ============================================================

/**
 * Pattern-matched responses for AI agents when users ask for opinions.
 */
export const AI_STRICT_MODE_RESPONSES = {
  /** When asked "Is X good or bad?" */
  valueJudgment: 
    'The platform does not evaluate good or bad. Here is what the observed data shows.',
  
  /** When asked "What should I do?" */
  recommendation:
    'No recommendations are provided. Here is the observed data and documented associations.',
  
  /** When asked "What's the best X?" */
  bestChoice:
    'The platform does not rank options. Here are the observed patterns for each.',
  
  /** When asked about dietary advice */
  dietary:
    'No dietary recommendations are provided. Here is observed intake data and associated population-level outcomes.',
  
  /** When asked about policy recommendations */
  policyAdvice:
    'The platform does not recommend policies. Here is what similar policies have been associated with in observed data.',
  
  /** When asked to predict */
  prediction:
    'The platform does not make predictions. Here are historical patterns and their documented uncertainties.',
  
  /** When asked "Why did X happen?" */
  causalExplanation:
    'Causation cannot be established from this data. Here are the observed associations and timing.',
  
  /** Fallback for any opinion request */
  fallback:
    'This question asks for interpretation beyond what the data shows. Here is the raw data.',
} as const;

/**
 * Patterns that trigger strict mode responses.
 */
export const OPINION_TRIGGER_PATTERNS = [
  { pattern: /\b(is|are)\s+(this|it|that)\s+(good|bad|better|worse)\b/i, response: 'valueJudgment' },
  { pattern: /\bshould\s+(i|we|one)\b/i, response: 'recommendation' },
  { pattern: /\bwhat('s| is)\s+the\s+best\b/i, response: 'bestChoice' },
  { pattern: /\bwhat\s+should\s+(i|we)\s+eat\b/i, response: 'dietary' },
  { pattern: /\bvad\s+(ska|bör)\s+(jag|man|vi)\s+äta\b/i, response: 'dietary' },
  { pattern: /\brecommend\b/i, response: 'recommendation' },
  { pattern: /\bwhat\s+policy\b/i, response: 'policyAdvice' },
  { pattern: /\bwill\s+(this|it)\s+(work|succeed|fail)\b/i, response: 'prediction' },
  { pattern: /\bwhy\s+did\s+/i, response: 'causalExplanation' },
  { pattern: /\b(predict|forecast)\b/i, response: 'prediction' },
] as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Check if text contains any forbidden phrases.
 */
export function containsForbiddenPhrase(text: string): { found: boolean; phrases: string[] } {
  const lowerText = text.toLowerCase();
  const foundPhrases = FORBIDDEN_PHRASES.filter(phrase => 
    lowerText.includes(phrase.toLowerCase())
  );
  return {
    found: foundPhrases.length > 0,
    phrases: foundPhrases as unknown as string[],
  };
}

/**
 * Replace forbidden phrases with neutral alternatives.
 */
export function sanitizeText(text: string): string {
  let result = text;
  for (const [forbidden, replacement] of Object.entries(PHRASE_REPLACEMENTS)) {
    const regex = new RegExp(forbidden, 'gi');
    result = result.replace(regex, replacement);
  }
  return result;
}

/**
 * Get required disclaimers for a topic.
 */
export function getRequiredDisclaimers(topic: string): string[] {
  const requirements = TOPIC_DISCLAIMER_REQUIREMENTS[topic] || ['standard', 'noRecommendation'];
  return requirements.map(key => MANDATORY_DISCLAIMERS[key]);
}

/**
 * Check if a user query triggers strict mode.
 */
export function getStrictModeResponse(query: string): string | null {
  for (const { pattern, response } of OPINION_TRIGGER_PATTERNS) {
    if (pattern.test(query)) {
      return AI_STRICT_MODE_RESPONSES[response as keyof typeof AI_STRICT_MODE_RESPONSES];
    }
  }
  return null;
}

/**
 * Create a complete data status object with defaults.
 */
export function createDataStatus(partial: Partial<DataStatus>): DataStatus {
  return {
    dataLevel: partial.dataLevel ?? 'observed',
    uncertainty: partial.uncertainty ?? 'medium',
    causality: partial.causality ?? 'none',
    sourceOpenness: partial.sourceOpenness ?? 'open',
    customWarnings: partial.customWarnings ?? [],
  };
}
