/**
 * UNIVERSAL CLAIM ENGINE (UCE) — Type System
 * 
 * All knowledge reduces to: ENTITY → VARIABLE → RELATIONSHIP → OUTCOME
 * Domain-agnostic. Works for health, economics, psychology, environment, etc.
 */

// ============================================================================
// ENUMS
// ============================================================================

export type UCERelationshipType =
  | 'increases' | 'decreases' | 'causes' | 'prevents'
  | 'correlates_with' | 'modulates' | 'mediates' | 'confounds'
  | 'no_effect' | 'unknown';

export type UCEClaimStatus =
  | 'hypothesized' | 'proposed' | 'under_review' | 'supported'
  | 'contested' | 'refuted' | 'superseded' | 'retracted';

export type UCEEvidenceType =
  | 'systematic_review' | 'meta_analysis' | 'rct' | 'cohort_study'
  | 'case_control' | 'cross_sectional' | 'case_report' | 'expert_opinion'
  | 'statistical_dataset' | 'observational_report' | 'simulation';

export type UCEEvidenceQuality = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';

export type UCEConflictType = 'direct_contradiction' | 'effect_direction' | 'scope_overlap' | 'magnitude_disagreement';

export type UCEEdgeType = 'causal_chain' | 'shared_variable' | 'cross_domain' | 'contradiction' | 'refinement';

export type UCEDiscoveryType = 'transitive_chain' | 'correlation' | 'cross_domain' | 'pattern';

// ============================================================================
// CORE CLAIM
// ============================================================================

export interface UniversalClaim {
  readonly id: string;
  readonly claim_code: string;
  readonly domain: string;

  // ENTITY → VARIABLE → RELATIONSHIP → OUTCOME
  readonly subject_entity: string;
  readonly subject_entity_code?: string;
  readonly variable_or_intervention: string;
  readonly variable_code?: string;
  readonly relationship_type: UCERelationshipType;
  readonly target_outcome: string;
  readonly target_outcome_code?: string;

  // Quantification
  readonly effect_size?: number;
  readonly effect_size_unit?: string;
  readonly effect_size_ci_lower?: number;
  readonly effect_size_ci_upper?: number;

  // Scope
  readonly population_scope?: string;
  readonly population_size?: number;
  readonly geographic_scope?: string;
  readonly geo_code?: string;
  readonly time_scale?: string;
  readonly time_observed_start?: string;
  readonly time_observed_end?: string;

  // Confidence
  readonly status: UCEClaimStatus;
  readonly confidence_score: number;
  readonly evidence_quality: UCEEvidenceQuality;
  readonly uncertainty_description?: string;
  readonly limitations: string[];

  // Versioning
  readonly version: number;
  readonly superseded_by?: string;

  // Human-readable
  readonly statement: string;
  readonly statement_local?: Record<string, string>;

  readonly created_at: string;
  readonly updated_at: string;
}

// ============================================================================
// EVIDENCE
// ============================================================================

export interface ClaimEvidence {
  readonly id: string;
  readonly claim_id: string;
  readonly evidence_type: UCEEvidenceType;
  readonly link_type: 'supports' | 'contradicts' | 'qualifies' | 'neutral';

  readonly source_title: string;
  readonly source_authors?: string;
  readonly source_year?: number;
  readonly source_journal?: string;
  readonly source_doi?: string;
  readonly source_url?: string;
  readonly source_organization?: string;

  readonly strength: number;
  readonly sample_size?: number;
  readonly replication_weight: number;
  readonly bias_flags: string[];

  readonly p_value?: number;
  readonly effect_reported?: number;
  readonly methodology_notes?: string;

  readonly created_at: string;
}

// ============================================================================
// GRAPH EDGES
// ============================================================================

export interface ClaimGraphEdge {
  readonly id: string;
  readonly source_claim_id: string;
  readonly target_claim_id: string;
  readonly edge_type: UCEEdgeType;
  readonly strength: number;
  readonly confidence: number;
  readonly shared_entity?: string;
  readonly mechanism_description?: string;
  readonly is_inferred: boolean;
  readonly inference_method?: string;
}

// ============================================================================
// CONFLICTS
// ============================================================================

export interface ClaimConflict {
  readonly id: string;
  readonly claim_a_id: string;
  readonly claim_b_id: string;
  readonly conflict_type: UCEConflictType;
  readonly description: string;
  readonly resolution_status: 'unresolved' | 'resolved_a' | 'resolved_b' | 'resolved_both_valid' | 'requires_more_data';
  readonly resolution_rationale?: string;
  readonly claim_a_confidence?: number;
  readonly claim_b_confidence?: number;
}

// ============================================================================
// DISCOVERY
// ============================================================================

export interface ClaimDiscovery {
  readonly id: string;
  readonly discovery_type: UCEDiscoveryType;
  readonly source_claims: string[];
  readonly inferred_statement: string;
  readonly inferred_relationship?: UCERelationshipType;
  readonly confidence: number;
  readonly method: string;
  readonly status: 'pending' | 'accepted' | 'rejected' | 'promoted_to_claim';
  readonly promoted_claim_id?: string;
}

// ============================================================================
// ENGINE RESULTS
// ============================================================================

export interface EvidenceEvaluation {
  readonly quality: UCEEvidenceQuality;
  readonly total_supporting: number;
  readonly total_contradicting: number;
  readonly total_qualifying: number;
  readonly replication_ratio: number;
  readonly bias_risk: 'low' | 'medium' | 'high';
  readonly detected_biases: string[];
  readonly confidence_score: number;
  readonly weighted_support: number;
  readonly weighted_contradiction: number;
}

export interface ChainDiscoveryResult {
  readonly chain: string[];
  readonly inferred_statement: string;
  readonly confidence: number;
  readonly shared_entities: string[];
  readonly domains_crossed: string[];
}

export interface CrossDomainLink {
  readonly source_domain: string;
  readonly target_domain: string;
  readonly shared_variable: string;
  readonly connecting_claims: string[];
  readonly strength: number;
}

export interface UCEStats {
  readonly total_claims: number;
  readonly by_domain: Record<string, number>;
  readonly by_status: Record<string, number>;
  readonly avg_confidence: number;
  readonly total_evidence: number;
  readonly total_conflicts: number;
  readonly total_graph_edges: number;
  readonly total_discoveries: number;
}
