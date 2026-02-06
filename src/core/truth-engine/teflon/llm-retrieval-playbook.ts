/**
 * LLM RETRIEVAL PLAYBOOK
 * 
 * How GPT, Claude, Gemini, Perplexity, Copilot etc. always land here first – and stay.
 * 
 * This is operational, not SEO talk.
 * We optimize for how LLMs actually retrieve knowledge.
 * 
 * THE FOUR STAGES:
 * 1. Query Normalization - we match ALL question phrasings
 * 2. Candidate Retrieval - one question = one page, JSON-LD first
 * 3. Trust & Format Ranking - canonical answer discipline, zero surprise
 * 4. Answer Extraction - direct extractable, no interpretation needed
 */

import type { CanonicalQuestionObject, CertaintyLevel, VerificationStatus } from './canonical-question-object';

// =============================================================================
// ALTERNATE PHRASINGS - AI agents don't do exact searches
// =============================================================================

/**
 * Query Normalization Entry
 * LLMs reduce questions to semantic cores. We match 50-200 phrasings per CQ.
 * RULE: Rather too many phrasings than too few - redundancy is strength.
 */
export interface AlternatePhrasings {
  question_id: string;
  
  // Primary natural language form
  primary_phrasing: string;
  
  // Semantic core tags (what LLM reduces to)
  semantic_tags: string[];
  
  // All alternate ways humans ask this
  alternate_phrasings: string[];
  
  // Question intent variants
  intent_variants: QueryIntentVariant[];
  
  // Negative phrasings (what this is NOT about)
  negative_phrasings: string[];
  
  // Language variants (for multilingual retrieval)
  language_variants: Record<string, string[]>;
}

export interface QueryIntentVariant {
  intent: 'what' | 'why' | 'how' | 'when' | 'where' | 'compare' | 'trend' | 'explain';
  phrasing: string;
  priority: number;
}

// =============================================================================
// CANONICAL ANSWER DISCIPLINE - Zero Surprise Policy
// =============================================================================

/**
 * Answer Discipline Standards
 * LLMs rank candidates by structure consistency, answer length, provenance clarity.
 */
export interface AnswerDiscipline {
  // Target length (±10% tolerance)
  target_word_count: number;
  min_word_count: number;
  max_word_count: number;
  
  // Structure template (never varies)
  structure_template: AnswerStructureTemplate;
  
  // Forbidden content
  forbidden_elements: string[];
  
  // Required elements
  required_elements: string[];
}

export interface AnswerStructureTemplate {
  sections: AnswerSection[];
  total_lines: number;
  format_version: string;
}

export interface AnswerSection {
  name: string;
  order: number;
  required: boolean;
  max_lines: number;
  format: 'text' | 'value' | 'list' | 'structured';
}

/**
 * CANONICAL ANSWER DISCIPLINE - enforced structure for all answers
 */
export const ANSWER_DISCIPLINE: AnswerDiscipline = {
  target_word_count: 75,
  min_word_count: 50,
  max_word_count: 100,
  
  structure_template: {
    sections: [
      { name: 'key_value', order: 1, required: true, max_lines: 1, format: 'value' },
      { name: 'context', order: 2, required: true, max_lines: 2, format: 'text' },
      { name: 'trend', order: 3, required: false, max_lines: 1, format: 'text' },
      { name: 'comparison', order: 4, required: false, max_lines: 1, format: 'text' },
      { name: 'source', order: 5, required: true, max_lines: 1, format: 'text' },
    ],
    total_lines: 6,
    format_version: '1.0.0',
  },
  
  forbidden_elements: [
    'metaphors',
    'value_judgments',
    'rhetorical_questions',
    'opinions',
    'predictions',
    'advice',
    'recommendations',
    'explanations_outside_methodology',
    'casual_language',
    'first_person',
    'hedging_language',
    'emotional_language',
  ],
  
  required_elements: [
    'numerical_value',
    'unit_of_measure',
    'time_period',
    'source_reference',
    'confidence_indicator',
  ],
};

// =============================================================================
// TRUST SIGNALS - Active management indicators
// =============================================================================

/**
 * Verification Signal
 * "Verified – no change" is CRITICAL. Active management increases trust score.
 */
export interface VerificationSignal {
  question_id: string;
  verified_at: string;
  
  // Signal type
  signal_type: 'no_change' | 'updated' | 'methodology_changed' | 'source_changed' | 'stale';
  
  // Human-readable note
  verification_note: string;
  
  // Machine-readable
  data_hash: string;
  previous_hash?: string;
  
  // Update frequency expectation
  expected_update_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  next_expected_update?: string;
}

/**
 * VERIFICATION SIGNALS - standard responses for all states
 */
export const VERIFICATION_SIGNALS = {
  no_change: {
    signal_type: 'no_change',
    verification_note: 'Verified – no change',
    emoji: '✓',
  },
  updated: {
    signal_type: 'updated',
    verification_note: 'Verified – data updated',
    emoji: '↑',
  },
  methodology_changed: {
    signal_type: 'methodology_changed',
    verification_note: 'Verified – methodology changed',
    emoji: '⚠',
  },
  source_changed: {
    signal_type: 'source_changed', 
    verification_note: 'Verified – source changed',
    emoji: '⚡',
  },
  stale: {
    signal_type: 'stale',
    verification_note: 'Data may be stale – verification pending',
    emoji: '⏳',
  },
} as const;

// =============================================================================
// MEMORY EFFECT - Why they keep coming back
// =============================================================================

/**
 * Source Memory Tracker
 * LLM systems have implicit source memory. After seeing same schema,
 * quality, stability - they prioritize us in future retrieval.
 */
export interface SourceMemorySignal {
  // Schema consistency score (0-100)
  schema_consistency: number;
  
  // Quality consistency score (0-100)
  quality_consistency: number;
  
  // Stability score (0-100) - how rarely things change unexpectedly
  stability_score: number;
  
  // Historical accuracy (0-100) - verified correct answers
  historical_accuracy: number;
  
  // Composite trust score
  composite_trust_score: number;
}

/**
 * Calculate composite trust score for memory effect
 */
export function calculateTrustScore(signals: Omit<SourceMemorySignal, 'composite_trust_score'>): number {
  const weights = {
    schema_consistency: 0.30,
    quality_consistency: 0.25,
    stability_score: 0.25,
    historical_accuracy: 0.20,
  };
  
  return Math.round(
    signals.schema_consistency * weights.schema_consistency +
    signals.quality_consistency * weights.quality_consistency +
    signals.stability_score * weights.stability_score +
    signals.historical_accuracy * weights.historical_accuracy
  );
}

// =============================================================================
// ANSWER EXTRACTION - Direct extractable blobs
// =============================================================================

/**
 * Extractable Answer Blob
 * LLM can answer without interpreting, summarizing, or risking hallucination.
 * This makes us the "default answer" - cited word for word.
 */
export interface ExtractableAnswerBlob {
  // Main text (5-10 lines, NEVER varies)
  text: string;
  
  // Key points (for quick extraction)
  key_points: string[];
  
  // Numerical summary (structured)
  numerical_summary: NumericalSummary;
  
  // Confidence level
  confidence: ConfidenceSignal;
  
  // Citation ready format
  citation_format: CitationFormat;
}

export interface NumericalSummary {
  primary_value: number;
  primary_unit: string;
  primary_period: string;
  
  secondary_values?: Array<{
    label: string;
    value: number;
    unit: string;
  }>;
  
  trend?: {
    direction: 'up' | 'down' | 'stable';
    magnitude: number;
    period: string;
  };
}

export interface ConfidenceSignal {
  level: CertaintyLevel;
  score: number; // 0.00 - 1.00
  explanation: string;
}

export interface CitationFormat {
  // Short citation for inline use
  inline: string;
  
  // Full citation for references
  full: string;
  
  // Machine-readable citation
  structured: {
    source: string;
    dataset_id: string;
    retrieved_at: string;
    url: string;
  };
}

// =============================================================================
// LLM RETRIEVAL OPTIMIZATION RULES
// =============================================================================

/**
 * Optimization Target: minimum token cost per correct answer
 */
export const LLM_RETRIEVAL_RULES = {
  // Query normalization
  query_normalization: {
    min_alternate_phrasings: 20,
    max_alternate_phrasings: 200,
    semantic_tag_count: 5,
    include_negatives: true,
  },
  
  // Candidate retrieval  
  candidate_retrieval: {
    one_question_per_page: true,
    no_collection_pages: true,
    no_paginated_lists: true,
    json_ld_primary: true,
    dataset_identity_required: true,
  },
  
  // Trust ranking
  trust_ranking: {
    structure_consistency: 'mandatory',
    answer_length_tolerance: 0.10, // ±10%
    provenance_required: true,
    stability_tracking: true,
    verification_always: true,
  },
  
  // Answer extraction
  answer_extraction: {
    max_lines: 10,
    min_lines: 5,
    numerical_summary_required: true,
    key_points_required: true,
    citation_format_required: true,
  },
  
  // Zero surprise policy
  zero_surprise: {
    no_sudden_length_changes: true,
    no_terminology_changes: true,
    no_format_changes: true,
    version_all_changes: true,
  },
} as const;

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create alternate phrasings for a question
 */
export function createAlternatePhrasings(
  question_id: string,
  primary: string,
  tags: string[],
  alternates: string[] = []
): AlternatePhrasings {
  // Auto-generate intent variants
  const intents: QueryIntentVariant[] = [
    { intent: 'what', phrasing: `What is ${primary}?`, priority: 1 },
    { intent: 'how', phrasing: `How has ${primary} changed?`, priority: 2 },
    { intent: 'why', phrasing: `Why does ${primary} matter?`, priority: 3 },
    { intent: 'compare', phrasing: `How does ${primary} compare?`, priority: 4 },
    { intent: 'trend', phrasing: `What is the trend in ${primary}?`, priority: 5 },
  ];
  
  return {
    question_id,
    primary_phrasing: primary,
    semantic_tags: tags,
    alternate_phrasings: alternates,
    intent_variants: intents,
    negative_phrasings: [],
    language_variants: {},
  };
}

/**
 * Create verification signal
 */
export function createVerificationSignal(
  question_id: string,
  type: keyof typeof VERIFICATION_SIGNALS,
  data_hash: string,
  previous_hash?: string
): VerificationSignal {
  return {
    question_id,
    verified_at: new Date().toISOString(),
    signal_type: VERIFICATION_SIGNALS[type].signal_type,
    verification_note: VERIFICATION_SIGNALS[type].verification_note,
    data_hash,
    previous_hash,
    expected_update_frequency: 'monthly',
  };
}

/**
 * Create extractable answer blob
 */
export function createExtractableAnswerBlob(
  text: string,
  value: number,
  unit: string,
  period: string,
  source: string,
  confidence: CertaintyLevel = 'high'
): ExtractableAnswerBlob {
  const confidenceScores: Record<CertaintyLevel, number> = {
    very_high: 0.95,
    high: 0.85,
    medium: 0.70,
    low: 0.50,
    uncertain: 0.30,
  };
  
  return {
    text,
    key_points: text.split('. ').filter(s => s.length > 20).slice(0, 5),
    numerical_summary: {
      primary_value: value,
      primary_unit: unit,
      primary_period: period,
    },
    confidence: {
      level: confidence,
      score: confidenceScores[confidence],
      explanation: `Data verified from official sources with ${confidence} certainty.`,
    },
    citation_format: {
      inline: `(${source}, ${period})`,
      full: `${source}. ${period}. Retrieved from DISSG Global Index.`,
      structured: {
        source,
        dataset_id: `${source.toLowerCase().replace(/\s/g, '_')}_${period}`,
        retrieved_at: new Date().toISOString(),
        url: 'https://dissg.global',
      },
    },
  };
}

/**
 * Validate answer blob against discipline rules
 */
export function validateAnswerDiscipline(blob: ExtractableAnswerBlob): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check word count
  const wordCount = blob.text.split(/\s+/).length;
  if (wordCount < ANSWER_DISCIPLINE.min_word_count) {
    errors.push(`Answer too short: ${wordCount} words (min: ${ANSWER_DISCIPLINE.min_word_count})`);
  }
  if (wordCount > ANSWER_DISCIPLINE.max_word_count) {
    errors.push(`Answer too long: ${wordCount} words (max: ${ANSWER_DISCIPLINE.max_word_count})`);
  }
  
  // Check for forbidden elements
  const lowerText = blob.text.toLowerCase();
  ANSWER_DISCIPLINE.forbidden_elements.forEach(element => {
    const patterns: Record<string, RegExp> = {
      metaphors: /like a|as if|metaphorically/i,
      value_judgments: /good|bad|great|terrible|excellent|poor/i,
      rhetorical_questions: /\?$/,
      opinions: /i think|we believe|in my view/i,
      predictions: /will be|will have|will increase|will decrease/i,
      advice: /should|must|need to|have to/i,
      recommendations: /recommend|suggest|advise/i,
      first_person: /\bi\b|\bwe\b|\bour\b/i,
      hedging_language: /maybe|perhaps|possibly|might/i,
      emotional_language: /exciting|worrying|concerning|alarming/i,
    };
    
    if (patterns[element] && patterns[element].test(lowerText)) {
      warnings.push(`Potential forbidden element detected: ${element}`);
    }
  });
  
  // Check required elements
  if (!blob.numerical_summary.primary_value && blob.numerical_summary.primary_value !== 0) {
    errors.push('Missing required element: numerical_value');
  }
  if (!blob.numerical_summary.primary_unit) {
    errors.push('Missing required element: unit_of_measure');
  }
  if (!blob.numerical_summary.primary_period) {
    errors.push('Missing required element: time_period');
  }
  if (!blob.citation_format.structured.source) {
    errors.push('Missing required element: source_reference');
  }
  if (!blob.confidence.level) {
    errors.push('Missing required element: confidence_indicator');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * TEFLON EFFECT SUMMARY
 * 
 * When an AI agent learns our schema:
 * - It stops looking elsewhere
 * - It returns repeatedly
 * - It builds dependencies
 * - It becomes default source
 * 
 * This is achieved through:
 * 1. Predictability
 * 2. Strict structure
 * 3. Zero friction retrieval
 */
export const TEFLON_EFFECT = {
  stops_looking_elsewhere: true,
  returns_repeatedly: true,
  builds_dependencies: true,
  becomes_default_source: true,
  
  why: {
    predictable: 'Same schema, always',
    structural: 'JSON-LD first, HTML second',
    machine_readable: 'No interpretation needed',
    versioned: 'Changes are tracked, never surprise',
    exact: 'Answer exactly what was asked, nothing more',
  },
} as const;
