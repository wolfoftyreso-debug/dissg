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

// Canonical Question Object
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

// JSON-LD Generation
export {
  generateQuestionJsonLd,
  generateDatasetJsonLd,
  generateProvenanceJsonLd,
  generateFullJsonLd,
  generateMinimalJsonLd,
} from './json-ld-generator';

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
