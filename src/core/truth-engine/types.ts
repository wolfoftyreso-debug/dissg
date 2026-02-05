/**
 * TRUTH ENGINE CORE TYPES
 * 
 * Fundamental type definitions for the Semantic Truth OS.
 * These types are immutable contracts.
 */

// ============================================
// SCOPE TYPES
// ============================================

export interface TimeRange {
  start: string; // ISO date
  end: string;   // ISO date
}

export interface Scope {
  geo_level: 'global' | 'continent' | 'country' | 'nuts2' | 'nuts3' | 'municipal' | 'unknown';
  geo_code: string;
  time_range: TimeRange;
  population_scope: 'total' | 'adult' | 'working_age' | 'elderly' | 'youth';
}

// ============================================
// TRUTH NODE
// ============================================

export interface TruthNode {
  id: string;
  type: 'ENTITY' | 'ATTRIBUTE' | 'RELATION' | 'EVENT' | 'MEASURE' | 'SOURCE';
  scope: Scope;
  importance: number; // 0-1
  values: number[];
  unit: string;
  source_ref: string;
  created_at: string;
  ontology_version: string;
  checksum: string;
  
  // Optional fields
  supersedes?: string;
  superseded_by?: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// ANSWER PACKET
// ============================================

export interface AnswerPacket {
  packet_id: string;
  query_hash: string;
  
  // What we show
  observation: string;
  data_refs: string[];
  uncertainty: UncertaintyLevel;
  
  // What we never include
  recommendation: never;
  advice: never;
  prediction: never;
  
  // Provenance
  generated_at: string;
  valid_until: string;
  generator_version: string;
}

export type UncertaintyLevel = 'low' | 'medium' | 'high' | 'insufficient';

// ============================================
// INDEX DEFINITION
// ============================================

export interface IndexDefinition {
  index_id: string;
  version: string;
  name: string;
  description: string;
  
  inputs: string[];
  weights: Record<string, number>;
  normalize_method: 'zscore' | 'minmax' | 'rank' | 'none';
  aggregate_method: 'weighted_mean' | 'geometric_mean' | 'median' | 'sum';
  
  constraints: {
    no_forecast: true;
    no_recommendation: true;
  };
}

// ============================================
// DECISION GRAPH
// ============================================

export interface DecisionGraphNode {
  node_id: string;
  type: string;
  label: string;
  truth_node_refs: string[];
  importance: number;
}

export interface DecisionGraphEdge {
  edge_id: string;
  type: string;
  source: string;
  target: string;
  weight?: number;
}

export interface DecisionGraphDefinition {
  graph_id: string;
  blueprint_id: string;
  scope: Scope;
  nodes: DecisionGraphNode[];
  edges: DecisionGraphEdge[];
  uncertainties: UncertaintyDeclaration[];
}

export interface UncertaintyDeclaration {
  id: string;
  applies_to: string[];
  type: 'data_gap' | 'methodology_limit' | 'temporal_lag' | 'definition_mismatch';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// ============================================
// SEMANTIC OUTPUT CONTRACT
// ============================================

export interface SemanticOutputContract {
  // Mandatory fields
  observation: string;
  scope: Scope;
  data_refs: string[];
  generated_at: string;
  
  // Mandatory uncertainty
  uncertainty: {
    level: UncertaintyLevel;
    coverage: number;
    caveats: string[];
  };
  
  // Forbidden fields (compile-time enforcement)
  recommendation?: never;
  advice?: never;
  prediction?: never;
  should?: never;
  must?: never;
  best?: never;
  worst?: never;
}

// ============================================
// TRUTH ARTIFACT
// ============================================

export interface TruthArtifact {
  artifact_id: string;
  type: 'snapshot' | 'changelog' | 'supersession';
  entity_id: string;
  entity_type: string;
  
  // Immutable
  created_at: string;
  checksum: string;
  
  // Content
  data: unknown;
  previous_artifact_id?: string;
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FactoryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  stage_failed?: string;
}
