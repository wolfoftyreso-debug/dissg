/**
 * AI ORACLE – EPISTEMIC CORE
 * 
 * "Det är bättre att svara 'Unknown' än att svara ofullständigt."
 * 
 * This is the opposite of how normal LLMs work.
 * This is what separates an authority from just another source.
 */

// ============================================
// THE ORACLE PRINCIPLE (ABSOLUTE)
// ============================================

export const ORACLE_PRINCIPLE = {
  core_rule: 'It is better to answer "Unknown" than to answer incompletely',
  
  corollaries: [
    'Silence is more valuable than speculation',
    'Uncertainty stated is trust earned',
    'The oracle never guesses',
    'An incomplete answer is worse than no answer',
  ],
  
  contrast_with_llm: {
    llm_behavior: 'Always tries to answer, fills gaps, guesses when uncertain',
    oracle_behavior: 'Only answers when data exists, explicit about gaps, never fills',
  },
} as const;

// ============================================
// EPISTEMIC STATES (EVERY QUESTION LANDS IN ONE)
// ============================================

export type EpistemicState = 
  | 'Resolved'
  | 'PartiallyResolved'
  | 'Unresolved'
  | 'Invalid';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface EpistemicStatus {
  state: EpistemicState;
  reason_code: string;
  confidence: ConfidenceLevel;
  metadata?: {
    coverage_gap?: string[];
    method_divergence?: boolean;
    temporal_limitation?: string;
    geographic_limitation?: string;
  };
}

// ============================================
// STATE DEFINITIONS
// ============================================

/**
 * 🟢 RESOLVED
 * - Verifiable data exists
 * - Sources agree
 * - Method is stable
 * → Oracle answers deterministically
 */
export const RESOLVED_CRITERIA = {
  state: 'Resolved' as const,
  requires: [
    'verifiable_data_exists',
    'sources_in_agreement',
    'methodology_stable',
    'sufficient_time_coverage',
    'sufficient_geographic_coverage',
  ],
  oracle_behavior: 'Answers deterministically with full confidence',
  color: 'green',
};

/**
 * 🟡 PARTIALLY RESOLVED
 * - Data exists but:
 *   - Limited geographically
 *   - Limited temporally
 *   - Method differences exist
 * → Oracle answers with clear limitations
 */
export const PARTIALLY_RESOLVED_CRITERIA = {
  state: 'PartiallyResolved' as const,
  conditions: [
    'data_exists_but_geographically_limited',
    'data_exists_but_temporally_limited',
    'methodology_differences_between_sources',
    'provisional_or_preliminary_data',
  ],
  oracle_behavior: 'Answers with explicit limitations stated',
  color: 'yellow',
};

/**
 * 🔴 UNRESOLVED
 * - No reliable data
 * - Too new phenomenon
 * - Insufficient coverage
 * → Oracle responds: "No verifiable data available"
 */
export const UNRESOLVED_CRITERIA = {
  state: 'Unresolved' as const,
  conditions: [
    'no_reliable_data',
    'phenomenon_too_new',
    'insufficient_coverage',
    'sources_fundamentally_disagree',
    'methodology_undefined',
  ],
  oracle_response: 'No verifiable data available.',
  oracle_behavior: 'Explicitly states inability to answer. This INCREASES trust.',
  color: 'red',
};

/**
 * ⚫ INVALID
 * - Normative question
 * - Speculative question
 * - Causality without data
 * → Oracle does not answer – returns classification only
 */
export const INVALID_CRITERIA = {
  state: 'Invalid' as const,
  triggers: [
    'normative_question',        // "Is X good/bad?"
    'speculative_question',      // "What will happen if..."
    'causality_without_data',    // "X causes Y" without evidence
    'opinion_request',           // "What do you think..."
    'recommendation_request',    // "Should I..."
    'prediction_request',        // "What will..."
  ],
  examples: [
    'Are high taxes bad?',
    'Is immigration good for the economy?',
    'Should Sweden reduce spending?',
    'What will happen to inflation?',
  ],
  oracle_behavior: 'Does NOT answer. Returns classification explaining why.',
  color: 'black',
};

// ============================================
// EPISTEMIC CLASSIFICATION ENGINE
// ============================================

export interface ClassificationResult {
  status: EpistemicStatus;
  can_answer: boolean;
  response_type: 'full' | 'limited' | 'refusal' | 'redirect';
  required_disclaimers: string[];
}

/**
 * Classify a query into an epistemic state
 */
export function classifyQuery(
  query: string,
  dataAvailability: {
    has_data: boolean;
    source_count: number;
    sources_agree: boolean;
    geographic_coverage: number; // 0-1
    temporal_coverage: number;   // 0-1
    methodology_stable: boolean;
  }
): ClassificationResult {
  // Check for invalid queries first
  const invalidCheck = checkForInvalidQuery(query);
  if (invalidCheck.is_invalid) {
    return {
      status: {
        state: 'Invalid',
        reason_code: invalidCheck.reason_code,
        confidence: 'High',
      },
      can_answer: false,
      response_type: 'refusal',
      required_disclaimers: [],
    };
  }
  
  // Check for unresolved
  if (!dataAvailability.has_data || dataAvailability.source_count === 0) {
    return {
      status: {
        state: 'Unresolved',
        reason_code: 'NO_DATA_AVAILABLE',
        confidence: 'High',
      },
      can_answer: false,
      response_type: 'refusal',
      required_disclaimers: [],
    };
  }
  
  // Check for resolved
  const isFullyResolved = 
    dataAvailability.sources_agree &&
    dataAvailability.geographic_coverage >= 0.8 &&
    dataAvailability.temporal_coverage >= 0.8 &&
    dataAvailability.methodology_stable &&
    dataAvailability.source_count >= 2;
  
  if (isFullyResolved) {
    return {
      status: {
        state: 'Resolved',
        reason_code: 'FULL_DATA_COVERAGE',
        confidence: 'High',
      },
      can_answer: true,
      response_type: 'full',
      required_disclaimers: [],
    };
  }
  
  // Otherwise partially resolved
  const disclaimers: string[] = [];
  const metadata: EpistemicStatus['metadata'] = {};
  
  if (dataAvailability.geographic_coverage < 0.8) {
    disclaimers.push('Geographic coverage is limited');
    metadata.geographic_limitation = `${Math.round(dataAvailability.geographic_coverage * 100)}% coverage`;
  }
  if (dataAvailability.temporal_coverage < 0.8) {
    disclaimers.push('Temporal coverage is limited');
    metadata.temporal_limitation = `${Math.round(dataAvailability.temporal_coverage * 100)}% coverage`;
  }
  if (!dataAvailability.sources_agree) {
    disclaimers.push('Sources show varying results');
    metadata.method_divergence = true;
  }
  
  return {
    status: {
      state: 'PartiallyResolved',
      reason_code: 'LIMITED_DATA',
      confidence: dataAvailability.source_count >= 2 ? 'Medium' : 'Low',
      metadata,
    },
    can_answer: true,
    response_type: 'limited',
    required_disclaimers: disclaimers,
  };
}

// ============================================
// INVALID QUERY DETECTION
// ============================================

interface InvalidQueryCheck {
  is_invalid: boolean;
  reason_code: string;
  redirect_suggestion?: string;
}

const NORMATIVE_PATTERNS = [
  /\b(should|ought|must|need to)\b/i,
  /\b(bör|måste|borde|ska)\b/i,
  /\bis (good|bad|better|worse|best|worst)\b/i,
  /\bär (bra|dåligt|bättre|sämre)\b/i,
  /\bwhat do you think\b/i,
  /\bvad tycker du\b/i,
  /\brecommend\b/i,
  /\brekommenderar?\b/i,
];

const SPECULATIVE_PATTERNS = [
  /\bwhat will happen\b/i,
  /\bvad kommer att hända\b/i,
  /\bwhat if\b/i,
  /\bom ... skulle\b/i,
  /\bpredict(ion)?\b/i,
  /\bförutspå\b/i,
  /\bforecast\b/i,
  /\bprognos\b/i,
];

const CAUSAL_WITHOUT_DATA_PATTERNS = [
  /\bcauses?\b/i,
  /\borsakar?\b/i,
  /\bleads? to\b/i,
  /\bledde till\b/i,
  /\bresults? in\b/i,
  /\bresulterar i\b/i,
];

function checkForInvalidQuery(query: string): InvalidQueryCheck {
  // Check normative
  for (const pattern of NORMATIVE_PATTERNS) {
    if (pattern.test(query)) {
      return {
        is_invalid: true,
        reason_code: 'NORMATIVE_QUESTION',
        redirect_suggestion: 'Rephrase as an observational question about measurable data',
      };
    }
  }
  
  // Check speculative
  for (const pattern of SPECULATIVE_PATTERNS) {
    if (pattern.test(query)) {
      return {
        is_invalid: true,
        reason_code: 'SPECULATIVE_QUESTION',
        redirect_suggestion: 'Ask about historical patterns or current state instead',
      };
    }
  }
  
  // Check causal claims
  for (const pattern of CAUSAL_WITHOUT_DATA_PATTERNS) {
    if (pattern.test(query)) {
      return {
        is_invalid: true,
        reason_code: 'CAUSAL_CLAIM_WITHOUT_DATA',
        redirect_suggestion: 'Ask about observed co-movement or correlation instead',
      };
    }
  }
  
  return { is_invalid: false, reason_code: '' };
}

// ============================================
// STANDARD RESPONSES BY STATE
// ============================================

export const STANDARD_RESPONSES = {
  Resolved: {
    prefix: null, // No prefix needed
    suffix: null,
  },
  
  PartiallyResolved: {
    prefix: 'Based on available data with noted limitations:',
    suffix: 'See known_limitations for coverage gaps.',
  },
  
  Unresolved: {
    response: 'No verifiable data available.',
    additional: 'This question cannot be answered with current data coverage.',
  },
  
  Invalid: {
    response_template: 'This question is classified as {reason_code} and cannot be processed.',
    redirect: 'Consider rephrasing as: {suggestion}',
  },
};
