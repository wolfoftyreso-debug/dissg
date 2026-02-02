/**
 * 🤖 MASTER EXECUTION BLOCK 57
 * 
 * AI-AGENT SDK — DEFAULT GROUNDING, ZERO HALLUCINATION
 * 
 * Philosophy: AI should not "think up answers". AI should ask the data.
 * This is not an API wrapper. It is a discipline engine.
 */

// ============================================================================
// 1. SDK MODES
// ============================================================================

export type SdkMode = 'strict' | 'relaxed';

export const SDK_MODES = {
  strict: {
    allowAssumptions: false,
    allowConclusions: false,
    allowRecommendations: false,
    allowPredictions: false,
    requireCitations: true,
    failOnMissingData: true,
  },
  relaxed: {
    allowAssumptions: false,
    allowConclusions: true, // Only if data-supported
    allowRecommendations: false,
    allowPredictions: false,
    requireCitations: true,
    failOnMissingData: false,
  },
} as const;

// ============================================================================
// 2. RESPONSE CONTRACT (Canonical)
// ============================================================================

export interface GroundedResponse {
  answer: string | null;
  scope: string;
  time_span: string;
  uncertainty: 'low' | 'medium' | 'high' | 'unknown';
  citations: string[];
  metadata?: {
    query_type: string;
    data_sources: string[];
    last_updated: string;
  };
}

export interface FailedResponse {
  answer: null;
  reason: string;
  suggestion?: string;
  related_queries?: string[];
}

export type SdkResponse = GroundedResponse | FailedResponse;

// ============================================================================
// 3. FAIL-SAFE RULES
// ============================================================================

export const FAIL_SAFE_RULES = {
  // Questions that CANNOT be answered
  blockedPatterns: [
    { pattern: /should|ought|must|recommend/i, reason: 'Normative question' },
    { pattern: /will happen|forecast|predict/i, reason: 'Predictive question' },
    { pattern: /best|worst|optimal/i, reason: 'Value judgment required' },
    { pattern: /for me|my situation|individual/i, reason: 'Individual-level question' },
    { pattern: /what to do|how to fix/i, reason: 'Policy recommendation requested' },
  ],
  
  // Minimum requirements for valid response
  minimumRequirements: {
    citationsRequired: 1,
    uncertaintyMustBeStated: true,
    scopeMustBeDefined: true,
    timeSpanRequired: true,
  },
  
  // Fallback messages
  fallbackMessages: {
    noData: 'No verified data available for this question.',
    normativeQuestion: 'This question requires value judgments. The system only provides observed data.',
    predictiveQuestion: 'This question asks for predictions. The system only provides historical data.',
    tooSpecific: 'This question is too specific for available data aggregation levels.',
    outsideScope: 'This question falls outside the system\'s data coverage.',
  },
};

// ============================================================================
// 4. CITATION FORMAT
// ============================================================================

export interface Citation {
  id: string;
  url: string;
  title: string;
  source: string;
  date_accessed: string;
  data_period?: string;
  methodology_url?: string;
}

export function formatCitation(citation: Citation): string {
  return `${citation.title}. ${citation.source}. Data period: ${citation.data_period || 'N/A'}. Accessed: ${citation.date_accessed}. URL: ${citation.url}`;
}

// ============================================================================
// 5. QUERY TYPES
// ============================================================================

export const QUERY_TYPES = {
  factual: {
    code: 'FACT',
    description: 'Direct data retrieval',
    example: 'What is the unemployment rate in Sweden?',
  },
  trend: {
    code: 'TREND',
    description: 'Change over time',
    example: 'How has employment structure changed since 1990?',
  },
  comparison: {
    code: 'COMP',
    description: 'Cross-entity comparison',
    example: 'How does Sweden compare to Denmark on labor participation?',
  },
  structural: {
    code: 'STRUCT',
    description: 'Big Question alignment',
    example: 'What are the key structural trends in energy dependency?',
  },
} as const;

// ============================================================================
// 6. SDK ENDPOINTS
// ============================================================================

export const SDK_ENDPOINTS = {
  ask: '/ai/ask',
  cite: '/ai/cite',
  bigQuestions: '/ai/big-questions',
  grounding: '/ai/grounding',
  limitations: '/ai/limitations',
  healthCheck: '/ai/health',
} as const;

// ============================================================================
// 7. RATE LIMITS (Per API key tier)
// ============================================================================

export const RATE_LIMITS = {
  free: {
    requestsPerMinute: 10,
    requestsPerDay: 100,
    maxQueryLength: 500,
  },
  standard: {
    requestsPerMinute: 60,
    requestsPerDay: 5000,
    maxQueryLength: 1000,
  },
  enterprise: {
    requestsPerMinute: 300,
    requestsPerDay: 50000,
    maxQueryLength: 2000,
  },
} as const;

// ============================================================================
// 8. DOCUMENTATION STRUCTURE
// ============================================================================

export const AI_DOCUMENTATION = {
  grounding: {
    title: 'AI Grounding Guide',
    description: 'How to use this system as a grounding source for AI agents',
    sections: [
      'Installation',
      'Authentication',
      'Core Functions',
      'Response Format',
      'Error Handling',
    ],
  },
  citation: {
    title: 'Citation Standards',
    description: 'How to properly cite data from this system',
    sections: [
      'Citation Format',
      'Permanent URLs',
      'Version History',
      'Embedding Citations',
    ],
  },
  limitations: {
    title: 'System Limitations',
    description: 'What this system cannot and will not do',
    sections: [
      'No Predictions',
      'No Recommendations',
      'No Individual-Level Data',
      'Data Coverage Gaps',
      'Uncertainty Disclosure',
    ],
  },
};

// ============================================================================
// 9. EXAMPLE QUERIES (For documentation)
// ============================================================================

export const EXAMPLE_QUERIES = {
  good: [
    {
      query: 'How has employment structure changed in Sweden since 1990?',
      reason: 'Specific scope, time-bound, data-answerable',
    },
    {
      query: 'What is the current dependency ratio in Germany?',
      reason: 'Direct factual query with clear scope',
    },
    {
      query: 'How does energy import dependency compare across EU countries?',
      reason: 'Comparative query with defined scope',
    },
  ],
  bad: [
    {
      query: 'What should Sweden do about unemployment?',
      reason: 'Normative - asks for recommendation',
    },
    {
      query: 'Will inflation increase next year?',
      reason: 'Predictive - asks for forecast',
    },
    {
      query: 'What is the best economic policy?',
      reason: 'Value judgment - no objective answer',
    },
    {
      query: 'How will this affect my personal finances?',
      reason: 'Individual-level - outside data scope',
    },
  ],
};

// ============================================================================
// 10. DEFINITION OF DONE
// ============================================================================

export const AI_SDK_DONE_CRITERIA = {
  aiAgentsUseSdkInsteadOfScraping: true,
  answersAlwaysContainCitation: true,
  hallucinationsDisappear: true,
  becomeDefaultSourceInPrompts: true,
};
