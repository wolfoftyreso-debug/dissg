/**
 * ONTOLOGY CORE ARCHITECTURE (OCA) — Type System
 * 
 * The 5 fundamental object types that prevent ontological collapse.
 * ALL knowledge in the entire system MUST reduce to these primitives.
 * 
 * ENTITY → VARIABLE → STATE
 * INTERVENTION → RELATIONSHIP → OUTCOME
 */

// ============================================================================
// THE 5 FUNDAMENTAL OBJECT TYPES
// ============================================================================

export type OCAObjectType = 'entity' | 'variable' | 'state' | 'intervention' | 'relationship';

// ============================================================================
// 1 — ENTITY: Something that exists
// ============================================================================

export type OCAEntityCategory =
  | 'individual' | 'population' | 'biological_system'
  | 'institution' | 'economy' | 'environment'
  | 'technology' | 'infrastructure' | 'ecosystem';

export interface OCAEntity {
  readonly id: string; // Deterministic: oca:entity:<hash>
  readonly code: string;
  readonly name: string;
  readonly category: OCAEntityCategory;
  readonly domain: OCADomain;
  readonly definition: string; // Formal, machine-readable definition
  readonly aliases: string[];
  readonly parent_id?: string;
  readonly ontology_version: string;
  readonly created_at: string;
  readonly frozen_at?: string; // Once frozen, immutable
}

// ============================================================================
// 2 — VARIABLE: A measurable property
// ============================================================================

export type OCAVariableType =
  | 'biomarker' | 'economic_indicator' | 'behavioral_metric'
  | 'environmental_factor' | 'demographic_metric' | 'institutional_metric'
  | 'psychological_metric' | 'composite_index' | 'physical_metric';

export interface OCAVariable {
  readonly id: string; // oca:variable:<hash>
  readonly code: string;
  readonly name: string;
  readonly definition: string; // Unambiguous formal definition
  readonly variable_type: OCAVariableType;
  readonly domain: OCADomain;
  readonly unit: string;
  readonly unit_system: 'SI' | 'imperial' | 'custom' | 'dimensionless';
  readonly min_value?: number;
  readonly max_value?: number;
  readonly precision?: number;
  readonly measurement_method?: string;
  readonly linked_entity_categories: OCAEntityCategory[];
  readonly validation_status: OCAValidationStatus;
  readonly semantic_hash: string; // Hash of definition — prevents drift
  readonly ontology_version: string;
  readonly first_source?: string;
  readonly created_at: string;
  readonly frozen_at?: string;
}

// ============================================================================
// 3 — STATE: A value of a variable at a point in time/space
// ============================================================================

export interface OCAState {
  readonly id: string;
  readonly variable_id: string;
  readonly entity_id: string;
  readonly value: number | string | boolean;
  readonly unit: string;
  readonly observed_at: string;
  readonly valid_from: string;
  readonly valid_until?: string;
  readonly geo_scope: OCAGeoScope;
  readonly population_scope?: string;
  readonly confidence: number; // 0-1
  readonly source_id: string;
  readonly is_provisional: boolean;
  readonly ontology_version: string;
}

// ============================================================================
// 4 — INTERVENTION: A change in the system
// ============================================================================

export type OCAInterventionCategory =
  | 'lifestyle' | 'policy' | 'medical' | 'environmental'
  | 'technological' | 'economic' | 'behavioral' | 'natural_event';

export interface OCAIntervention {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly definition: string;
  readonly category: OCAInterventionCategory;
  readonly domain: OCADomain;
  readonly target_variable_ids: string[];
  readonly mechanism?: string;
  readonly reversibility: 'reversible' | 'partially_reversible' | 'irreversible';
  readonly ontology_version: string;
  readonly created_at: string;
}

// ============================================================================
// 5 — RELATIONSHIP: How things affect each other
// ============================================================================

export type OCARelationshipType =
  | 'increases' | 'decreases'
  | 'correlates_with' | 'causes'
  | 'moderates' | 'mediates'
  | 'inhibits' | 'enables'
  | 'precedes' | 'co_occurs';

export interface OCARelationship {
  readonly id: string;
  readonly relationship_type: OCARelationshipType;
  readonly source_type: OCAObjectType;
  readonly source_id: string;
  readonly target_type: OCAObjectType;
  readonly target_id: string;
  readonly strength: number; // 0-1
  readonly confidence: number; // 0-1
  readonly evidence_level: OCAEvidenceLevel;
  readonly temporal_delay_days?: number;
  readonly population_scope?: string;
  readonly effect_variance?: number;
  readonly is_causal: boolean; // true only with RCT/quasi-experimental evidence
  readonly mechanism_description?: string;
  readonly ontology_version: string;
  readonly created_at: string;
}

// ============================================================================
// SUPPORTING TYPES
// ============================================================================

export type OCADomain =
  | 'health' | 'psychology' | 'economics' | 'environment'
  | 'demography' | 'governance' | 'education' | 'technology'
  | 'security' | 'energy' | 'nutrition' | 'urbanization';

export type OCAEvidenceLevel =
  | 'meta_analysis' | 'rct' | 'cohort_study'
  | 'observational' | 'expert_opinion' | 'theoretical';

export type OCAValidationStatus =
  | 'proposed' | 'under_review' | 'validated' | 'frozen' | 'deprecated';

export interface OCAGeoScope {
  readonly level: 'global' | 'continent' | 'country' | 'region' | 'municipality' | 'local';
  readonly code: string;
}

// ============================================================================
// ONTOLOGY REGISTRY — Central concept management
// ============================================================================

export interface OCARegistryEntry {
  readonly id: string;
  readonly object_type: OCAObjectType;
  readonly code: string;
  readonly name: string;
  readonly definition: string;
  readonly domain: OCADomain;
  readonly semantic_hash: string;
  readonly validation_status: OCAValidationStatus;
  readonly first_source: string;
  readonly created_at: string;
  readonly frozen_at?: string;
  readonly deprecated_at?: string;
  readonly superseded_by?: string;
}

// ============================================================================
// CONFLICT DETECTION
// ============================================================================

export type OCAConflictType =
  | 'duplicate_variable' | 'conflicting_definition'
  | 'unit_inconsistency' | 'semantic_overlap'
  | 'circular_relationship' | 'orphan_entity';

export interface OCAConflict {
  readonly id: string;
  readonly conflict_type: OCAConflictType;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly entry_a_id: string;
  readonly entry_a_name: string;
  readonly entry_b_id?: string;
  readonly entry_b_name?: string;
  readonly description: string;
  readonly suggested_resolution: string;
  readonly status: 'detected' | 'reviewing' | 'resolved' | 'accepted';
  readonly detected_at: string;
  readonly resolved_at?: string;
}

// ============================================================================
// GOVERNANCE LOG
// ============================================================================

export type OCAGovernanceAction =
  | 'concept_proposed' | 'concept_validated' | 'concept_frozen'
  | 'concept_deprecated' | 'conflict_detected' | 'conflict_resolved'
  | 'version_bumped' | 'merge_executed' | 'definition_updated';

export interface OCAGovernanceEntry {
  readonly id: string;
  readonly action: OCAGovernanceAction;
  readonly object_type: OCAObjectType;
  readonly object_id: string;
  readonly object_name: string;
  readonly reason: string;
  readonly performed_by: string;
  readonly ontology_version_before: string;
  readonly ontology_version_after: string;
  readonly created_at: string;
}

// ============================================================================
// OCA HEALTH METRICS
// ============================================================================

export interface OCAHealthMetrics {
  readonly total_entities: number;
  readonly total_variables: number;
  readonly total_states: number;
  readonly total_interventions: number;
  readonly total_relationships: number;
  readonly total_registry_entries: number;
  readonly frozen_entries: number;
  readonly deprecated_entries: number;
  readonly active_conflicts: number;
  readonly critical_conflicts: number;
  readonly domains_covered: OCADomain[];
  readonly avg_semantic_consistency: number; // 0-1
  readonly ontology_version: string;
  readonly last_governance_action?: string;
}
