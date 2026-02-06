/**
 * GLOBAL INDEX QUESTION TYPES
 * 
 * Machine-readable, AI-optimized question structure
 * Based on the Master Prompt specification
 */

// Enums matching database
export type QuestionScope = 'global' | 'regional' | 'national' | 'municipal';
export type TimeDimension = 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'historical';
export type AnswerType = 'statistic' | 'index' | 'comparison' | 'ranking' | 'trend' | 'correlation' | 'distribution' | 'aggregate';
export type UpdateFrequency = 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'event_based';
export type DataQualityGrade = 'A' | 'B' | 'C' | 'D' | 'unverified';

/**
 * Domain definition - 30 core domains
 */
export interface QuestionDomain {
  code: string;
  name_en: string;
  name_sv: string;
  description?: string;
  icon?: string;
  parent_domain_code?: string;
  sort_order: number;
  question_count: number;
  is_active: boolean;
}

/**
 * Subdomain definition
 */
export interface QuestionSubdomain {
  code: string;
  domain_code: string;
  name_en: string;
  name_sv: string;
  description?: string;
  question_count: number;
  is_active: boolean;
}

/**
 * Data source type definition
 */
export interface DataSourceType {
  code: string;
  name_en: string;
  name_sv: string;
  description?: string;
  reliability_default: DataQualityGrade;
  examples: string[];
}

/**
 * Global Index Question - Master format
 * 
 * This is the canonical structure for all questions in the system.
 * Follows the Master Prompt specification exactly.
 */
export interface GlobalIndexQuestion {
  // Identifiers
  id: string;
  question_id: string; // Stable semantic ID like "DEMO-POP-001"
  
  // Question content (multilingual)
  question_en: string;
  question_sv: string;
  question_variants: string[]; // Alternative phrasings for search
  
  // Classification
  domain_code: string;
  subdomain_code?: string;
  scope: QuestionScope;
  time_dimension: TimeDimension;
  answer_type: AnswerType;
  update_frequency: UpdateFrequency;
  
  // Data sourcing
  primary_source_types: string[];
  data_quality: DataQualityGrade;
  data_coverage_percent: number;
  
  // Cross-referencing
  cross_reference_domains: string[];
  related_question_ids: string[];
  parent_question_id?: string;
  
  // AI/Search optimization
  ai_retrieval_tags: string[];
  search_volume_estimate: number;
  seo_priority: number;
  
  // Metadata
  is_answerable: boolean;
  is_published: boolean;
  last_answered_at?: string;
  answer_count: number;
  view_count: number;
  
  // Audit
  created_at: string;
  updated_at: string;
  created_by: string;
  version: number;
}

/**
 * Global Index Answer - A2F Format
 * 
 * Always-Answer-Format:
 * 1. Summary (kort faktasvar)
 * 2. Mechanisms (drivande mekanismer)
 * 3. Timeline (tidslinje)
 * 4. Comparison (jämförelse)
 * 5. Uncertainty (osäkerhet/begränsningar)
 * 6. Deep Dive Links (fördjupningslänkar)
 */
export interface GlobalIndexAnswer {
  id: string;
  question_id: string;
  
  // Scope
  geo_scope: string;
  time_period_start?: string;
  time_period_end?: string;
  
  // A2F Content
  summary: string;
  mechanisms?: string;
  timeline?: TimelineEntry[];
  comparison?: ComparisonData;
  uncertainty?: string;
  deep_dive_links?: string[];
  
  // Raw data
  data_points: DataPoint[];
  aggregation_method?: string;
  
  // Sources
  citations: Citation[];
  source_checksums?: string[];
  
  // Quality
  confidence_score: number;
  data_quality: DataQualityGrade;
  is_current: boolean;
  expires_at?: string;
  
  // Generation
  generated_at: string;
  generated_by: string;
  model_used?: string;
  
  // Metrics
  view_count: number;
  citation_count: number;
}

/**
 * Timeline entry for A2F
 */
export interface TimelineEntry {
  date: string;
  event: string;
  value?: number;
  source?: string;
}

/**
 * Comparison data for A2F
 */
export interface ComparisonData {
  baseline: {
    geo: string;
    value: number;
    period: string;
  };
  comparisons: {
    geo: string;
    value: number;
    difference_percent: number;
    period: string;
  }[];
}

/**
 * Data point structure
 */
export interface DataPoint {
  geo: string;
  period: string;
  value: number;
  unit: string;
  source: string;
  quality: DataQualityGrade;
}

/**
 * Citation structure
 */
export interface Citation {
  id: string;
  source_type: string;
  source_name: string;
  publication_date?: string;
  url?: string;
  access_date: string;
  reliability: DataQualityGrade;
}

/**
 * Question generation request
 */
export interface QuestionGenerationRequest {
  domain_code: string;
  subdomain_code?: string;
  count: number;
  scope?: QuestionScope;
  language?: 'en' | 'sv';
}

/**
 * Question search params
 */
export interface QuestionSearchParams {
  query?: string;
  domain_codes?: string[];
  scope?: QuestionScope;
  answer_type?: AnswerType;
  min_coverage?: number;
  has_answer?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * MASTER PROMPT RULES (LOCKED)
 */
export const QUESTION_RULES = {
  // Forbidden question types
  forbidden: {
    yes_no_questions: true,
    normative_questions: true,
    speculative_future_questions: true,
    opinion_polls: true,
  },
  
  // Required characteristics
  required: {
    answerable_with_existing_data: true,
    eternally_relevant: true,
    suitable_as_landing_page: true,
    perfect_for_rag_systems: true,
  },
  
  // Answer format
  answer_format: 'A2F', // Always-Answer-Format
  
  // Target count
  target_question_count: 3000,
} as const;

/**
 * Domain codes - 30 core domains
 */
export const DOMAIN_CODES = [
  'DEMO', 'ECON', 'TAX', 'HEALTH', 'EDU', 'LABOR', 'CRIME', 'ENERGY',
  'HOUSING', 'TRANSPORT', 'MIGRATION', 'BUSINESS', 'TRADE', 'TECH',
  'INTERNET', 'MEDIA', 'GOV', 'WELFARE', 'PENSION', 'INTL', 'CONSUME',
  'FOOD', 'URBAN', 'RELIGION', 'ADDICTION', 'CLIMATE', 'RND', 'CRYPTO',
  'PROCUREMENT', 'INEQUALITY'
] as const;

export type DomainCode = typeof DOMAIN_CODES[number];
