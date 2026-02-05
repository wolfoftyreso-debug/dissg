/**
 * SEARCH → DECISION INGESTION PIPELINE — TYPES
 * 
 * From world's questions → structured decision surfaces.
 * This is the production line.
 */

/**
 * Raw search intent (input)
 */
export interface RawSearchIntent {
  intent_id: string;
  surface_forms: string[];  // All linguistic variants
  volume_rank: number;
  geo: 'global' | string;   // Country code or 'global'
  language: string;         // ISO 639-1
  source: IntentSource;
  collected_at: string;
}

/**
 * Intent source types
 */
export type IntentSource =
  | 'aggregated_search'      // Top-N per country/language
  | 'people_also_ask'        // PAA clusters
  | 'related_queries'        // Query graphs
  | 'ai_agent_requests'      // Anonymized AI requests
  | 'internal_gaps';         // "Next valid questions" gaps

/**
 * Normalized intent (after normalization)
 */
export interface NormalizedIntent {
  intent_id: string;
  decision_type: string;
  alternatives_required: boolean;
  risk_exposure: 'low' | 'medium' | 'high' | 'critical';
  time_horizon: 'immediate' | 'short_term' | 'multi_year' | 'lifetime';
  domains: string[];
  normalized_at: string;
}

/**
 * Entity resolution result
 */
export interface ResolvedEntity {
  entity_id: string;
  entity_name: string;
  entity_type: EntityType;
  ontology_path: string[];
  confidence: number;
  fallback: boolean;
  alternatives: string[];  // Comparable entities
  metadata?: Record<string, unknown>;
}

/**
 * Entity types
 */
export type EntityType =
  | 'vehicle_model'
  | 'vehicle_brand'
  | 'consumer_product'
  | 'service'
  | 'financial_instrument'
  | 'policy'
  | 'medical_condition'
  | 'treatment'
  | 'phenomenon'
  | 'organization'
  | 'location'
  | 'unknown';

/**
 * Entity stub (for unknown entities)
 */
export interface EntityStub {
  stub_id: string;
  provisional_name: string;
  provisional_type: EntityType;
  created_at: string;
  pending_data: string[];
  status: 'pending' | 'enriching' | 'resolved' | 'rejected';
}

/**
 * Data coverage check result
 */
export interface CoverageCheck {
  entity_id: string;
  intent_id: string;
  coverage: 'sufficient' | 'partial' | 'insufficient';
  gaps: DataGap[];
  build_allowed: boolean;
  reason?: string;
  checked_at: string;
}

/**
 * Data gap definition
 */
export interface DataGap {
  gap_id: string;
  block_group: string;
  description: string;
  severity: 'blocking' | 'degrading' | 'cosmetic';
  can_proceed_without: boolean;
  potential_sources: string[];
}

/**
 * Block generation result
 */
export interface BlockGenerationResult {
  block_id: number;
  status: 'filled' | 'empty' | 'partial';
  validation: BlockValidation;
  content?: unknown;
  empty_reason?: string;
}

/**
 * Block validation
 */
export interface BlockValidation {
  data_valid: boolean;
  scope_valid: boolean;
  uncertainty_stated: boolean;
  sources_cited: boolean;
  errors: string[];
}

/**
 * Conditional answer (parametric, never advice)
 */
export interface ConditionalAnswer {
  answer_id: string;
  conditions: Condition[];
  dominance: 'dominant' | 'competitive' | 'inferior' | 'indeterminate';
  confidence: number;
  compared_to: string[];
  valid_until?: string;
}

/**
 * Condition for conditional answer
 */
export interface Condition {
  variable: string;
  operator: '==' | '!=' | '<' | '>' | '<=' | '>=' | 'in' | 'not_in';
  value: string | number | boolean | string[];
}

/**
 * Publication result
 */
export interface PublicationResult {
  cdp_id: string;
  human_view_url: string;
  machine_view_url: string;
  schema_org_markup: object;
  custom_ontology: object;
  version: number;
  published_at: string;
}

/**
 * Update event
 */
export interface UpdateEvent {
  event_id: string;
  cdp_id: string;
  trigger: UpdateTrigger;
  affected_blocks: number[];
  previous_version: number;
  new_version: number;
  updated_at: string;
}

/**
 * Update triggers
 */
export type UpdateTrigger =
  | 'new_data'
  | 'price_change'
  | 'reliability_update'
  | 'source_revision'
  | 'entity_update'
  | 'scheduled_refresh';

/**
 * Pipeline run status
 */
export interface PipelineRun {
  run_id: string;
  started_at: string;
  completed_at?: string;
  status: 'running' | 'completed' | 'failed' | 'blocked';
  stages_completed: PipelineStage[];
  current_stage?: PipelineStage;
  error?: string;
  metrics: PipelineMetrics;
}

/**
 * Pipeline stages
 */
export type PipelineStage =
  | 'intake'
  | 'normalization'
  | 'entity_resolution'
  | 'coverage_check'
  | 'block_generation'
  | 'answer_compilation'
  | 'publication'
  | 'indexing';

/**
 * Pipeline metrics
 */
export interface PipelineMetrics {
  intents_processed: number;
  entities_resolved: number;
  cdps_generated: number;
  blocks_filled: number;
  blocks_empty: number;
  average_confidence: number;
  duration_ms: number;
}

/**
 * Pipeline configuration
 */
export interface PipelineConfig {
  min_coverage_for_build: number;      // 0-1
  min_alternatives_required: number;
  max_empty_blocks_allowed: number;
  require_uncertainty_statement: boolean;
  auto_publish: boolean;
  languages: string[];
  geo_scope: string[];
}
