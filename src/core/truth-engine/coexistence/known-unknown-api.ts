/**
 * KNOWN VS UNKNOWN API
 * 
 * STEG 24: THE SAFETY MECHANISM
 * 
 * In crises, systems want to know: "What do we know for certain?"
 * 
 * The oracle answers this perfectly, because it is built for exactly this.
 * 
 * This is enormously valuable - without giving a single recommendation.
 */

/**
 * KNOWLEDGE STATE
 */
export type KnowledgeState = 
  | 'known'
  | 'unknown'
  | 'unverifiable'
  | 'contested'
  | 'outdated';

/**
 * KNOWLEDGE ITEM
 */
export interface KnowledgeItem {
  readonly statement: string;
  readonly state: KnowledgeState;
  readonly confidence: number;  // 0-1
  readonly source: string;
  readonly timestamp: string;
  readonly limitations: string[];
}

/**
 * KNOWN-UNKNOWN RESPONSE
 */
export interface KnownUnknownResponse {
  readonly query: string;
  readonly timestamp: string;
  readonly known: KnowledgeItem[];
  readonly unknown: KnowledgeItem[];
  readonly unverifiable: KnowledgeItem[];
  readonly contested: KnowledgeItem[];
  readonly outdated: KnowledgeItem[];
  readonly summary: KnowledgeSummary;
}

/**
 * KNOWLEDGE SUMMARY
 */
export interface KnowledgeSummary {
  readonly total_claims_assessed: number;
  readonly known_count: number;
  readonly unknown_count: number;
  readonly unverifiable_count: number;
  readonly overall_confidence: number;
  readonly recommendation: 'sufficient_for_context' | 'significant_gaps' | 'mostly_unknown';
}

/**
 * WHY THIS IS VALUABLE
 */
export const VALUE_PROPOSITION = {
  in_crisis_systems_ask: 'What do we know for certain?',
  
  oracle_provides: {
    known: 'Facts verified with high confidence',
    unknown: 'Questions we cannot answer',
    unverifiable: 'Claims that cannot be checked',
    contested: 'Points where sources disagree',
    outdated: 'Information that may have changed',
  },
  
  without_providing: [
    'recommendations',
    'predictions',
    'action guidance',
    'decision support',
  ],
  
  value: 'Enormous clarity without any opinion',
} as const;

/**
 * KNOWLEDGE STATE DEFINITIONS
 */
export const KNOWLEDGE_STATE_DEFINITIONS: Record<KnowledgeState, {
  readonly definition: string;
  readonly confidence_range: [number, number];
  readonly action_implication: string;
}> = {
  known: {
    definition: 'Verified by multiple reliable sources with consistent methodology',
    confidence_range: [0.85, 1.0],
    action_implication: 'Can be used as factual basis',
  },
  unknown: {
    definition: 'No reliable data available',
    confidence_range: [0, 0],
    action_implication: 'Cannot inform decisions on this point',
  },
  unverifiable: {
    definition: 'Claims exist but cannot be independently verified',
    confidence_range: [0.1, 0.4],
    action_implication: 'Treat with extreme caution',
  },
  contested: {
    definition: 'Multiple sources with conflicting information',
    confidence_range: [0.3, 0.6],
    action_implication: 'Acknowledge uncertainty explicitly',
  },
  outdated: {
    definition: 'Information was accurate but may have changed',
    confidence_range: [0.4, 0.7],
    action_implication: 'Valid for historical context only',
  },
};

/**
 * Create a known-unknown response
 */
export function createKnownUnknownResponse(
  query: string,
  items: KnowledgeItem[]
): KnownUnknownResponse {
  const known = items.filter(i => i.state === 'known');
  const unknown = items.filter(i => i.state === 'unknown');
  const unverifiable = items.filter(i => i.state === 'unverifiable');
  const contested = items.filter(i => i.state === 'contested');
  const outdated = items.filter(i => i.state === 'outdated');
  
  const totalConfidence = items.length > 0
    ? items.reduce((sum, i) => sum + i.confidence, 0) / items.length
    : 0;
  
  let recommendation: KnowledgeSummary['recommendation'];
  if (known.length >= items.length * 0.7) {
    recommendation = 'sufficient_for_context';
  } else if (unknown.length >= items.length * 0.5) {
    recommendation = 'mostly_unknown';
  } else {
    recommendation = 'significant_gaps';
  }
  
  return {
    query,
    timestamp: new Date().toISOString(),
    known,
    unknown,
    unverifiable,
    contested,
    outdated,
    summary: {
      total_claims_assessed: items.length,
      known_count: known.length,
      unknown_count: unknown.length,
      unverifiable_count: unverifiable.length,
      overall_confidence: totalConfidence,
      recommendation,
    },
  };
}

/**
 * Create a knowledge item
 */
export function createKnowledgeItem(
  statement: string,
  state: KnowledgeState,
  confidence: number,
  source: string,
  limitations: string[] = []
): KnowledgeItem {
  return {
    statement,
    state,
    confidence: Math.max(0, Math.min(1, confidence)),
    source,
    timestamp: new Date().toISOString(),
    limitations,
  };
}

/**
 * API ENDPOINT SPECIFICATION
 */
export const KNOWN_UNKNOWN_API = {
  endpoint: '/api/v1/knowledge-state',
  method: 'POST',
  
  request: {
    query: 'string',
    scope: 'string[]',  // Which domains to assess
    depth: 'shallow | deep',
  },
  
  response: 'KnownUnknownResponse',
  
  example_use_cases: [
    'Crisis assessment: What do we know about current situation?',
    'Due diligence: What is verified about this entity?',
    'Research: What is established fact vs hypothesis?',
    'Audit: What claims can be independently verified?',
  ],
} as const;

/**
 * THE CRISIS VALUE
 */
export const CRISIS_VALUE = {
  when_crisis_hits: [
    'Everyone wants to know "what is true"',
    'Information is fragmentary and conflicting',
    'Pressure to act before verification',
    'Blame will follow bad decisions',
  ],
  
  oracle_provides: [
    'Clear separation of known from unknown',
    'Explicit confidence levels',
    'Source attribution',
    'Limitation disclosure',
  ],
  
  oracle_does_not_provide: [
    'What to do about it',
    'Who is responsible',
    'What will happen next',
    'Whether situation is good or bad',
  ],
  
  value: 'Maximum information, zero opinion',
} as const;
