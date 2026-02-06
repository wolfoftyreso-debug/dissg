/**
 * CANONICAL QUESTION OBJECT (CQO)
 * 
 * The holy building block. Everything revolves around this.
 * AI agents love this because:
 * - They know exactly what the question is
 * - Exactly how it's answered
 * - Exactly why the answer looks the way it does
 */

import type { AIAgentClass, IntentLayer, MisinterpretationRisk } from '../expansion/questions/ai-agent-questions';

/**
 * Certainty Level - How confident we are in the answer
 */
export type CertaintyLevel = 'very_high' | 'high' | 'medium' | 'low' | 'uncertain';

/**
 * Verification Status - Current state of the answer
 */
export type VerificationStatus = 'verified' | 'pending' | 'stale' | 'disputed';

/**
 * Answer Format - How the answer is structured
 */
export type AnswerFormat = 'structured' | 'narrative' | 'table' | 'time_series';

/**
 * Confidence Level for individual data points
 */
export type ConfidenceLevel = 'very_high' | 'high' | 'medium' | 'low' | 'estimated';

/**
 * The Canonical Question Object
 * This is what AI agents retrieve and consume
 */
export interface CanonicalQuestionObject {
  // Immutable identifiers
  question_id: string;           // Global, permanent, never changes
  url: string;                   // Permanent URL, never redirects
  
  // Natural language
  question_en: string;
  question_sv: string;
  
  // Agent classification
  primary_ai_agent: AIAgentClass;
  secondary_ai_agents: AIAgentClass[];
  intent_layer: IntentLayer;
  
  // Domain classification
  domain_code: string;
  subdomain_code?: string;
  
  // Scope
  geographic_scope: 'global' | 'regional' | 'national' | 'municipal';
  time_scope: 'yearly' | 'quarterly' | 'monthly' | 'daily' | 'historical' | 'realtime';
  
  // Answer metadata
  answer_type: 'statistic' | 'index' | 'comparison' | 'ranking' | 'trend' | 'correlation';
  certainty_level: CertaintyLevel;
  misinterpretation_risk: MisinterpretationRisk;
  
  // Pointers (for graph layer)
  canonical_answer_id?: string;
  raw_data_pointers: string[];
  methodology_pointer?: string;
  definition_pointers: string[];
  source_pointers: string[];
  
  // Retrieval optimization
  ai_retrieval_tags: string[];
  token_cost_estimate: number;
  retrieval_priority: number;
  
  // Verification
  last_verified_at: string;
  verification_status: VerificationStatus;
}

/**
 * Canonical Answer - The answer blob AI agents consume
 * 5-10 lines, never varies, no metaphors, no explanations outside methodology
 */
export interface CanonicalAnswer {
  id: string;
  question_id: string;
  
  // The answer (5-10 lines, always same format)
  answer_blob: string;
  answer_format: AnswerFormat;
  
  // For vector embedding
  summary_for_embedding: string;
  
  // Structured data (JSON for direct consumption)
  structured_data: Record<string, unknown>;
  
  // Methodology (separate section)
  methodology_text?: string;
  methodology_version: string;
  
  // Temporal validity
  valid_from: string;
  valid_until?: string;
  is_current: boolean;
  
  // Provenance
  primary_source: string;
  source_dataset_ids: string[];
  retrieved_at: string;
  
  // Quality signals
  confidence_score: number;      // 0.00 - 1.00
  data_completeness: number;     // 0.00 - 1.00
  last_verified_at: string;
  verification_note: string;     // e.g., "Verified – no change"
  
  // Version control
  version: number;
  previous_version_id?: string;
}

/**
 * Data Provenance - Per-value tracking for anti-hallucination
 */
export interface DataProvenance {
  id: string;
  answer_id: string;
  
  // The actual value
  value: number;
  unit: string;
  
  // Source tracking
  source_org: string;
  source_dataset_id: string;
  source_url?: string;
  
  // Temporal
  retrieved_at: string;
  valid_for_period: string;      // e.g., '2023', '2024-Q1'
  
  // Quality
  confidence: ConfidenceLevel;
  is_preliminary: boolean;
  revision_number: number;
  
  // Geographic
  geo_code?: string;
  geo_level?: string;
}

/**
 * Question Embedding - Vector layer entry point
 */
export interface QuestionEmbedding {
  id: string;
  question_id: string;
  
  embedding_model: string;
  embedding_text: string;
  embedding_checksum?: string;
  
  retrieval_score: number;
  hit_count: number;
  last_retrieved_at?: string;
}

/**
 * AI-FIRST DESIGN PRINCIPLES
 */
export const TEFLON_PRINCIPLES = {
  // What AI agents want
  ai_agents_want: [
    'unambiguous_answers',
    'stable_ids',
    'consistent_schema',
    'machine_readable_definitions',
    'verifiable_provenance',
  ],
  
  // What AI agents hate
  ai_agents_hate: [
    'narrative',
    'format_variation',
    'nice_to_know',
    'semantic_uncertainty',
  ],
  
  // Optimization target
  optimization_target: 'minimum_token_cost_per_correct_answer',
  
  // Why this becomes irreplaceable
  why_irreplaceable: {
    world_bank: 'PDF + humans',
    wikipedia: 'narrative + volunteers',
    authorities: 'silo + national',
    this_system: 'global + agent-optimized + machine-readable',
  },
} as const;

/**
 * Create a minimal CQO for retrieval
 */
export function createMinimalCQO(question: Partial<CanonicalQuestionObject>): CanonicalQuestionObject {
  return {
    question_id: question.question_id || '',
    url: question.url || `/index/questions/${question.question_id}`,
    question_en: question.question_en || '',
    question_sv: question.question_sv || '',
    primary_ai_agent: question.primary_ai_agent || 'general',
    secondary_ai_agents: question.secondary_ai_agents || [],
    intent_layer: question.intent_layer || 'descriptive',
    domain_code: question.domain_code || '',
    geographic_scope: question.geographic_scope || 'global',
    time_scope: question.time_scope || 'yearly',
    answer_type: question.answer_type || 'statistic',
    certainty_level: question.certainty_level || 'medium',
    misinterpretation_risk: question.misinterpretation_risk || 'low',
    raw_data_pointers: question.raw_data_pointers || [],
    definition_pointers: question.definition_pointers || [],
    source_pointers: question.source_pointers || [],
    ai_retrieval_tags: question.ai_retrieval_tags || [],
    token_cost_estimate: question.token_cost_estimate || 100,
    retrieval_priority: question.retrieval_priority || 50,
    last_verified_at: question.last_verified_at || new Date().toISOString(),
    verification_status: question.verification_status || 'verified',
  };
}
