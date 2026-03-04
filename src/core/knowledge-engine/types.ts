/**
 * TRIPLE-LAYER KNOWLEDGE MODULE — TYPE SYSTEM
 * 
 * Layer 1: Data Layer (Observations) — raw reality, no interpretation
 * Layer 2: Knowledge Layer (Claims) — evidence-graded statements
 * Layer 3: Intelligence Layer (Decisions) — ranked interventions & causal models
 * Meta Layer: Self-analysis — gap detection, bias scan, replication audit
 */

// ============================================================================
// MODULE REGISTRY
// ============================================================================

export interface KnowledgeModule {
  readonly id: string;
  readonly module_code: string;
  readonly name: string;
  readonly description: string;
  readonly domain: string;
  readonly status: 'draft' | 'active' | 'deprecated';
  readonly version: number;
  readonly ontology_schema: DomainOntology;
  readonly cross_module_links: string[];
}

export interface DomainOntology {
  readonly entities: readonly OntologyEntity[];
  readonly variables: readonly OntologyVariable[];
  readonly relationships: readonly OntologyRelationship[];
  readonly data_sources: readonly OntologyDataSource[];
}

export interface OntologyEntity {
  readonly code: string;
  readonly name: string;
  readonly type: 'subject' | 'intervention' | 'outcome' | 'environment' | 'mechanism';
  readonly description: string;
}

export interface OntologyVariable {
  readonly code: string;
  readonly name: string;
  readonly unit: string;
  readonly measurement_type: 'continuous' | 'categorical' | 'ordinal' | 'binary';
  readonly direction?: 'higher_better' | 'lower_better' | 'neutral';
}

export interface OntologyRelationship {
  readonly source: string;
  readonly target: string;
  readonly type: 'associated_with' | 'component_of' | 'modifies' | 'mediates' | 'confounds';
}

export interface OntologyDataSource {
  readonly code: string;
  readonly name: string;
  readonly type: 'study' | 'api' | 'dataset' | 'report' | 'sensor' | 'survey';
  readonly organization: string;
  readonly reliability_tier: 1 | 2 | 3;
}

// ============================================================================
// LAYER 1 — DATA LAYER (Observations)
// ============================================================================

export interface DomainObservation {
  readonly id: string;
  readonly module_id: string;
  readonly observation_code: string;
  readonly source_type: 'study' | 'api' | 'dataset' | 'report' | 'sensor' | 'survey';
  readonly source_reference: string;
  readonly source_organization?: string;
  readonly source_url?: string;
  readonly population_descriptor?: string;
  readonly population_size?: number;
  readonly measurement_type: string;
  readonly measurement_value?: number;
  readonly measurement_unit?: string;
  readonly effect_size?: number;
  readonly confidence_interval_lower?: number;
  readonly confidence_interval_upper?: number;
  readonly p_value?: number;
  readonly methodology?: string;
  readonly geo_scope: string;
  readonly geo_code?: string;
  readonly time_observed?: string;
  readonly time_period_start?: string;
  readonly time_period_end?: string;
  readonly raw_metadata: Record<string, unknown>;
  readonly is_replicated: boolean;
  readonly replication_count: number;
}

// ============================================================================
// LAYER 2 — KNOWLEDGE LAYER (Claims)
// ============================================================================

export type ClaimStatus = 'proposed' | 'under_review' | 'supported' | 'contested' | 'refuted' | 'superseded';
export type EvidenceQuality = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';

export interface KnowledgeClaim {
  readonly id: string;
  readonly module_id: string;
  readonly claim_code: string;
  readonly statement: string;
  readonly statement_sv?: string;
  readonly claim_type: 'descriptive' | 'correlational' | 'mechanistic' | 'intervention_effect' | 'prevalence';
  readonly status: ClaimStatus;
  readonly confidence_score: number;
  readonly evidence_quality: EvidenceQuality;
  readonly population_scope?: string;
  readonly geographic_scope: string;
  readonly temporal_scope?: string;
  readonly effect_size?: number;
  readonly effect_size_unit?: string;
  readonly uncertainty_description?: string;
  readonly limitations: string[];
  readonly superseded_by?: string;
  readonly version: number;
  readonly supporting_evidence: readonly EvidenceLink[];
  readonly contradicting_evidence: readonly EvidenceLink[];
}

export interface EvidenceLink {
  readonly id: string;
  readonly claim_id: string;
  readonly observation_id: string;
  readonly link_type: 'supports' | 'contradicts' | 'qualifies' | 'neutral';
  readonly strength: number;
  readonly replication_weight: number;
  readonly bias_flags: string[];
  readonly notes?: string;
}

// ============================================================================
// LAYER 3 — INTELLIGENCE LAYER (Decisions)
// ============================================================================

export interface InterventionRanking {
  readonly id: string;
  readonly module_id: string;
  readonly ranking_code: string;
  readonly question: string;
  readonly question_sv?: string;
  readonly methodology: string;
  readonly interventions: readonly RankedIntervention[];
  readonly ranking_criteria: RankingCriteria;
  readonly limitations: string[];
  readonly confidence_score: number;
  readonly valid_for_population?: string;
}

export interface RankedIntervention {
  readonly code: string;
  readonly name: string;
  readonly rank: number;
  readonly score: number;
  readonly effect_size: number;
  readonly evidence_quality: EvidenceQuality;
  readonly supporting_claims: string[];
  readonly cost_effectiveness?: number;
  readonly population_applicability: number;
  readonly side_effects: string[];
}

export interface RankingCriteria {
  readonly effect_weight: number;
  readonly evidence_weight: number;
  readonly cost_weight: number;
  readonly applicability_weight: number;
  readonly safety_weight: number;
}

// ============================================================================
// META LAYER — Self-Analysis
// ============================================================================

export type MetaAnalysisType = 'weak_claims' | 'data_gaps' | 'bias_scan' | 'replication_deficit' | 'cross_domain_opportunity';

export interface ModuleMetaAnalysis {
  readonly id: string;
  readonly module_id: string;
  readonly analysis_type: MetaAnalysisType;
  readonly findings: readonly MetaFinding[];
  readonly severity: 'info' | 'warning' | 'critical';
  readonly auto_generated: boolean;
  readonly resolved: boolean;
}

export interface MetaFinding {
  readonly code: string;
  readonly title: string;
  readonly description: string;
  readonly affected_entities: string[];
  readonly suggested_action: string;
  readonly priority: number;
}

// ============================================================================
// CROSS-MODULE VARIABLES
// ============================================================================

export interface CrossModuleVariable {
  readonly id: string;
  readonly source_module_id: string;
  readonly target_module_id: string;
  readonly variable_name: string;
  readonly relationship_type: 'shared_input' | 'shared_output' | 'mediator' | 'moderator' | 'confounder';
  readonly description?: string;
  readonly strength: number;
}

// ============================================================================
// EVIDENCE HIERARCHY (GRADE-based)
// ============================================================================

export const EVIDENCE_HIERARCHY = {
  levels: [
    { rank: 1, type: 'systematic_review_with_meta_analysis', quality: 'very_high' as EvidenceQuality },
    { rank: 2, type: 'randomized_controlled_trial', quality: 'high' as EvidenceQuality },
    { rank: 3, type: 'cohort_study', quality: 'moderate' as EvidenceQuality },
    { rank: 4, type: 'case_control_study', quality: 'low' as EvidenceQuality },
    { rank: 5, type: 'cross_sectional_study', quality: 'low' as EvidenceQuality },
    { rank: 6, type: 'case_report', quality: 'very_low' as EvidenceQuality },
    { rank: 7, type: 'expert_opinion', quality: 'very_low' as EvidenceQuality },
  ],
  bias_types: [
    'selection_bias', 'measurement_bias', 'reporting_bias', 'attrition_bias',
    'confounding', 'reverse_causation', 'healthy_user_bias', 'publication_bias',
    'funding_bias', 'cultural_bias', 'temporal_bias',
  ],
} as const;
