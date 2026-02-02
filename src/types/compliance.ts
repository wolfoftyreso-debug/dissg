/**
 * AI & COMPLIANCE GUARDRAILS TYPE DEFINITIONS
 * 
 * Types for maintaining platform as reference, not advisor.
 * All types enforce the principle: describe reality, never prescribe action.
 */

// Scope Declaration - machine-readable limits for all data
export interface ScopeDeclaration {
  id: string;
  entity_type: 'dataset' | 'view' | 'report' | 'indicator';
  entity_id: string;
  entity_name: string;
  
  // Coverage definition
  covers: string[];
  does_not_cover: string[];
  valid_comparisons: string[];
  invalid_uses: string[];
  
  // Confidence
  confidence_level: 'high' | 'medium' | 'low' | 'experimental';
  confidence_rationale?: string;
  temporal_validity_start?: string;
  temporal_validity_end?: string;
  geographic_scope: string[];
  
  // AI instructions
  ai_must_cite: boolean;
  ai_blocked_actions: AIBlockedAction[];
  ai_required_disclaimers: string[];
  
  version: number;
  created_at: string;
  updated_at: string;
}

// Actions AI is never allowed to perform
export type AIBlockedAction = 
  | 'recommend'
  | 'advise'
  | 'predict'
  | 'prescribe'
  | 'judge'
  | 'optimize'
  | 'rank_preference'
  | 'suggest_action';

// Blocked query pattern definition
export interface BlockedQueryPattern {
  id: string;
  pattern_type: 'advice' | 'recommendation' | 'prediction' | 'medical' | 'individual';
  pattern_regex: string;
  pattern_keywords: string[];
  block_response_template: string;
  redirect_suggestion?: string;
  severity: 'block' | 'warn' | 'log';
  category: 'medical' | 'policy' | 'individual' | 'predictive';
  is_active: boolean;
}

// Result of query compliance check
export interface QueryComplianceResult {
  allowed: boolean;
  blocked_patterns: BlockedQueryPattern[];
  warnings: string[];
  required_disclaimers: string[];
  scope_citations: ScopeCitation[];
  sanitized_query?: string;
}

// Scope citation for AI responses
export interface ScopeCitation {
  scope_id: string;
  scope_name: string;
  covers: string[];
  does_not_cover: string[];
  confidence_level: string;
}

// AI Response Template
export interface AIResponseTemplate {
  id: string;
  template_code: string;
  template_name: string;
  template_text: string;
  required_placeholders: string[];
  use_when: string[];
  never_use_when: string[];
  translations: Record<string, string>;
  is_active: boolean;
}

// Filled AI response
export interface AIResponse {
  template_code: string;
  response_text: string;
  scope_citations: ScopeCitation[];
  disclaimers: string[];
  blocked: boolean;
  block_reason?: string;
}

// Legal classification per jurisdiction
export interface LegalClassification {
  id: string;
  jurisdiction: string;
  platform_classification: string;
  not_classified_as: string[];
  required_disclaimers: string[];
  regulatory_framework?: string;
  compliance_notes?: string;
  effective_date: string;
  is_active: boolean;
}

// Ethics constraint definition
export interface EthicsConstraint {
  id: string;
  constraint_code: string;
  constraint_name: string;
  constraint_description: string;
  prevents: string[];
  enforcement_type: 'block' | 'aggregate' | 'anonymize' | 'warn';
  minimum_group_size?: number;
  rationale: string;
  is_active: boolean;
}

// API Compliance log entry
export interface APIComplianceLogEntry {
  id: string;
  api_key_id?: string;
  endpoint: string;
  method: string;
  scope_declaration_id?: string;
  scope_accepted: boolean;
  usage_declaration?: string;
  query_blocked: boolean;
  block_reason?: string;
  warnings_issued: string[];
  request_hash?: string;
  response_included_disclaimers: boolean;
  created_at: string;
}

// Misuse detection entry
export interface MisuseDetection {
  id: string;
  detection_type: 'campaign_use' | 'data_harvesting' | 'context_stripping' | 'selective_citation' | 'rate_abuse' | 'scope_violation';
  severity: 'info' | 'warning' | 'critical';
  evidence_summary: string;
  api_log_ids: string[];
  action_taken?: string;
  detected_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

// AI SDK Configuration
export interface AISDKConfig {
  // Response behavior
  always_cite_scope: boolean;
  always_include_disclaimers: boolean;
  block_on_pattern_match: boolean;
  
  // Blocked actions
  blocked_actions: AIBlockedAction[];
  
  // Response templates
  default_template: string;
  blocked_template: string;
  
  // Jurisdiction
  active_jurisdiction: string;
}

// Standard AI response wrapper
export interface SafeAIResponse<T = unknown> {
  success: boolean;
  data?: T;
  
  // Compliance metadata
  scope_cited: boolean;
  scope_declarations: ScopeCitation[];
  disclaimers_included: string[];
  
  // If blocked
  blocked: boolean;
  block_reason?: string;
  redirect_suggestion?: string;
  
  // Audit
  request_hash: string;
  response_hash: string;
  timestamp: string;
}

// Query analysis result
export interface QueryAnalysis {
  original_query: string;
  sanitized_query: string;
  detected_intent: QueryIntent;
  blocked: boolean;
  block_patterns: string[];
  warnings: string[];
  required_scopes: string[];
}

export type QueryIntent = 
  | 'observation'      // Valid: "What was X during Y?"
  | 'comparison'       // Valid: "How did X compare to Y?"
  | 'trend'            // Valid: "What trend did X show?"
  | 'advice'           // BLOCKED: "What should I do?"
  | 'recommendation'   // BLOCKED: "Which is better?"
  | 'prediction'       // BLOCKED: "What will happen?"
  | 'medical'          // BLOCKED: "What should I take?"
  | 'individual'       // BLOCKED: "What about me?"
  | 'unknown';
