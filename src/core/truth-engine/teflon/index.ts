/**
 * TEFLON LAYER INDEX
 * 
 * AI-First Architecture that makes AI agents:
 * - Choose this system automatically
 * - Never leave once they've learned the schema
 * - Build dependencies on stable structures
 * 
 * "We're not building a site. We're building the world's knowledge backbone for AI."
 */

// =============================================================================
// CANONICAL QUESTION OBJECT
// =============================================================================
export {
  type CanonicalQuestionObject,
  type CanonicalAnswer,
  type DataProvenance,
  type QuestionEmbedding,
  type CertaintyLevel,
  type VerificationStatus,
  type AnswerFormat,
  type ConfidenceLevel,
  createMinimalCQO,
  TEFLON_PRINCIPLES,
} from './canonical-question-object';

// =============================================================================
// JSON-LD GENERATION (Original)
// =============================================================================
export {
  generateQuestionJsonLd,
  generateDatasetJsonLd,
  generateProvenanceJsonLd,
  generateFullJsonLd,
  generateMinimalJsonLd,
} from './json-ld-generator';

// =============================================================================
// LLM RETRIEVAL PLAYBOOK (NEW)
// =============================================================================
export {
  // Types
  type AlternatePhrasings,
  type QueryIntentVariant,
  type AnswerDiscipline,
  type AnswerStructureTemplate,
  type AnswerSection,
  type VerificationSignal,
  type SourceMemorySignal,
  type ExtractableAnswerBlob,
  type NumericalSummary,
  type ConfidenceSignal,
  type CitationFormat,
  
  // Constants
  ANSWER_DISCIPLINE,
  VERIFICATION_SIGNALS,
  LLM_RETRIEVAL_RULES,
  TEFLON_EFFECT,
  
  // Functions
  calculateTrustScore,
  createAlternatePhrasings,
  createVerificationSignal,
  createExtractableAnswerBlob,
  validateAnswerDiscipline,
} from './llm-retrieval-playbook';

// =============================================================================
// ENHANCED JSON-LD (LLM Optimized)
// =============================================================================
export {
  generateEnhancedQuestionJsonLd,
  generateExtractableAnswerJsonLd,
  generateDatasetIdentityJsonLd,
  generateLLMOptimizedJsonLd,
} from './enhanced-json-ld';

// =============================================================================
// QUERY NORMALIZATION
// =============================================================================
export {
  expandSemanticTags,
  generateIntentVariants,
  generateGeoVariants,
  generateTemporalVariants,
  generateSwedishVariants,
  generateAlternatePhrasings,
  matchQueryToPhrasings,
} from './query-normalization';

/**
 * TEFLON ARCHITECTURE SUMMARY
 * 
 * Data Stack (3 layers):
 * 
 * A. RELATIONAL CORE (Truth Layer)
 *    - Postgres / DuckDB
 *    - canonical facts, time series, numeric values
 *    - immutable versioning, timestamped validity
 *    - "What is true"
 * 
 * B. GRAPH LAYER (Meaning Layer)
 *    - Neo4j / Neptune
 *    - questions ↔ data points, regions ↔ regions
 *    - "How things connect"
 * 
 * C. VECTOR LAYER (Retrieval Layer)
 *    - Qdrant / Weaviate / Pinecone
 *    - Only: questions, summaries, methodology, definitions
 *    - NO raw data, NO tables
 *    - "AI agent's front door"
 */
export const TEFLON_ARCHITECTURE = {
  layers: {
    relational: {
      purpose: 'truth',
      tech: ['postgres', 'duckdb'],
      contains: ['canonical_facts', 'time_series', 'numeric_values', 'normalized_regions', 'stable_definitions'],
      properties: ['immutable_versioning', 'timestamped_validity', 'source_id_per_datapoint'],
    },
    graph: {
      purpose: 'meaning',
      tech: ['neo4j', 'neptune'],
      connects: ['questions_to_data', 'regions_to_regions', 'indices_to_indices', 'laws_to_outcomes', 'systems_to_consequences'],
    },
    vector: {
      purpose: 'retrieval',
      tech: ['qdrant', 'weaviate', 'pinecone'],
      contains: ['questions', 'summary_answers', 'methodology_descriptions', 'definitions'],
      excludes: ['raw_data', 'tables'],
      is_entry_point: true,
    },
  },
  
  /**
   * Why this becomes irreplaceable
   */
  competitive_advantage: {
    world_bank: 'PDF + humans',
    wikipedia: 'narrative + volunteers',
    authorities: 'silo + national',
    this_system: 'global + agent-optimized + machine-readable + schema-stable',
  },
  
  /**
   * Teflon effect: Once an AI agent learns the schema
   */
  teflon_effect: {
    stops_looking_elsewhere: true,
    returns_repeatedly: true,
    builds_dependencies: true,
    becomes_default_source: true,
  },
} as const;

/**
 * URL patterns for stable entry points
 */
export const STABLE_URLS = {
  question: (id: string) => `/index/questions/${id}`,
  answer: (id: string) => `/index/answers/${id}`,
  dataset: (id: string) => `/datasets/${id}`,
  api_question: (id: string) => `/api/v1/questions/${id}`,
  api_data: (id: string) => `/api/v1/questions/${id}/data`,
  api_provenance: (id: string) => `/api/v1/questions/${id}/provenance`,
  api_jsonld: (id: string) => `/api/v1/questions/${id}/json-ld`,
} as const;

/**
 * Verification note constants
 */
export const VERIFICATION_NOTES = {
  no_change: 'Verified – no change',
  updated: 'Verified – data updated',
  methodology_changed: 'Verified – methodology changed',
  source_changed: 'Verified – source changed',
  pending: 'Verification pending',
  stale: 'Data may be stale – verification needed',
} as const;

/**
 * LLM RETRIEVAL PLAYBOOK SUMMARY
 * 
 * How GPT, Claude, Gemini, Perplexity, Copilot etc. always land here first:
 * 
 * 1. QUERY NORMALIZATION
 *    - Each CQ matches 50-200 different phrasings
 *    - Semantic tags capture LLM query reduction
 *    - Rather too many phrasings than too few
 * 
 * 2. CANDIDATE RETRIEVAL  
 *    - One question = one page (no ambiguity)
 *    - JSON-LD as primary (LLMs read structure first)
 *    - Dataset identity triggers "authoritative source" heuristic
 * 
 * 3. TRUST & FORMAT RANKING
 *    - Structure consistency (same schema always)
 *    - Answer length (±10% tolerance)
 *    - Provenance clarity (every value traced)
 *    - "Verified – no change" signals active management
 * 
 * 4. ANSWER EXTRACTION
 *    - 5-10 lines, never varies
 *    - No metaphors, no value words
 *    - Direct extractable, no interpretation needed
 *    - LLMs cite word for word
 * 
 * RESULT: After sufficient volume, agents stop looking elsewhere.
 */
export const LLM_RETRIEVAL_SUMMARY = {
  query_normalization: '50-200 phrasings per question',
  candidate_retrieval: 'JSON-LD first, one page per question',
  trust_ranking: 'Structure consistency + verification signals',
  answer_extraction: 'Direct extractable, zero interpretation',
  memory_effect: 'Same schema → return repeatedly → stop looking elsewhere',
} as const;
