/**
 * GLOBAL REALITY MODEL (GRM) — Type System
 * 
 * Superstructure connecting all domains into a single causal system.
 * All knowledge reduces to: ENTITY → STATE → INTERVENTION → EFFECT
 * 
 * Temporal, population, and uncertainty dimensions on every relationship.
 */

// ============================================================================
// GRM ENTITY TYPES
// ============================================================================

export type GRMEntityCategory =
  | 'individual' | 'population' | 'biological_system'
  | 'institution' | 'economy' | 'environment'
  | 'technology' | 'policy' | 'infrastructure';

export type GRMVariableType =
  | 'biomarker' | 'economic_indicator' | 'behavioral_metric'
  | 'environmental_factor' | 'demographic_metric' | 'institutional_metric'
  | 'psychological_metric' | 'composite_index';

export type GRMInterventionType =
  | 'lifestyle_change' | 'policy_change' | 'environmental_intervention'
  | 'technological_intervention' | 'economic_intervention'
  | 'medical_intervention' | 'behavioral_intervention' | 'natural_event';

export type GRMEffectDuration = 'transient' | 'short_term' | 'medium_term' | 'long_term' | 'permanent';

export type GRMConfidenceLevel = 'speculative' | 'low' | 'moderate' | 'high' | 'established';

export type GRMDomain =
  | 'health' | 'psychology' | 'economics' | 'environment'
  | 'demography' | 'governance' | 'education' | 'technology'
  | 'security' | 'energy' | 'nutrition' | 'urbanization';

// ============================================================================
// STEP 1 — ENTITY ONTOLOGY
// ============================================================================

export interface GRMEntity {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly category: GRMEntityCategory;
  readonly domain: GRMDomain;
  readonly description?: string;
  readonly aliases?: string[];
  readonly parent_entity_id?: string;
  readonly metadata?: Record<string, unknown>;
  readonly created_at: string;
}

// ============================================================================
// STEP 2 — VARIABLE STRUCTURE
// ============================================================================

export interface GRMVariable {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly variable_type: GRMVariableType;
  readonly domain: GRMDomain;
  readonly unit?: string;
  readonly min_value?: number;
  readonly max_value?: number;
  readonly geographic_scope?: string;
  readonly description?: string;
  readonly measurement_frequency?: string;
  readonly linked_entity_id?: string;
  readonly linked_kpi_code?: string;
  readonly created_at: string;
}

// ============================================================================
// STEP 3 — INTERVENTION MODEL
// ============================================================================

export interface GRMIntervention {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly intervention_type: GRMInterventionType;
  readonly domain: GRMDomain;
  readonly description?: string;
  readonly target_variable_ids: string[];
  readonly population_scope?: string;
  readonly geographic_scope?: string;
  readonly estimated_cost_level?: 'low' | 'medium' | 'high' | 'very_high';
  readonly reversibility: 'reversible' | 'partially_reversible' | 'irreversible';
  readonly created_at: string;
}

// ============================================================================
// STEP 4 — CAUSAL GRAPH STRUCTURE
// ============================================================================

export type GRMCausalDirection = 'positive' | 'negative' | 'bidirectional' | 'nonlinear' | 'unknown';

export interface GRMCausalLink {
  readonly id: string;
  readonly code: string;

  // Source → Target
  readonly source_type: 'entity' | 'variable' | 'intervention' | 'outcome';
  readonly source_id: string;
  readonly source_label: string;
  readonly target_type: 'entity' | 'variable' | 'intervention' | 'outcome';
  readonly target_id: string;
  readonly target_label: string;

  // Causal properties
  readonly direction: GRMCausalDirection;
  readonly strength: number; // 0-1
  readonly confidence: GRMConfidenceLevel;
  readonly confidence_score: number; // 0-1

  // STEP 5 — Temporal modeling
  readonly effect_delay_min_days?: number;
  readonly effect_delay_max_days?: number;
  readonly effect_duration: GRMEffectDuration;
  readonly is_persistent: boolean;

  // STEP 6 — Uncertainty
  readonly effect_variance?: number;
  readonly evidence_count: number;
  readonly evidence_quality: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';

  // Population dimension
  readonly population_scope?: string;
  readonly population_modifiers?: GRMPopulationModifier[];

  // Cross-domain
  readonly source_domain: GRMDomain;
  readonly target_domain: GRMDomain;
  readonly is_cross_domain: boolean;

  // Provenance
  readonly claim_ids?: string[]; // Links to UCE claims
  readonly mechanism_description?: string;
  readonly falsifiable: boolean;
  readonly falsification_criteria?: string;

  readonly created_at: string;
  readonly updated_at: string;
}

// ============================================================================
// POPULATION DIMENSION
// ============================================================================

export interface GRMPopulationModifier {
  readonly population_group: string;
  readonly effect_multiplier: number; // 1.0 = baseline
  readonly confidence: number;
  readonly notes?: string;
}

// ============================================================================
// OUTCOMES
// ============================================================================

export interface GRMOutcome {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly domain: GRMDomain;
  readonly description?: string;
  readonly measurement_variable_id?: string;
  readonly is_terminal: boolean; // End of causal chain
  readonly desirability: 'positive' | 'negative' | 'neutral' | 'context_dependent';
  readonly created_at: string;
}

// ============================================================================
// STEP 8 — DISCOVERY
// ============================================================================

export interface GRMDiscovery {
  readonly id: string;
  readonly discovery_type: 'indirect_chain' | 'hidden_correlation' | 'intervention_point' | 'feedback_loop';
  readonly chain: string[]; // Ordered list of node IDs
  readonly chain_labels: string[];
  readonly domains_crossed: GRMDomain[];
  readonly total_strength: number;
  readonly total_confidence: number;
  readonly inferred_statement: string;
  readonly potential_intervention_points: string[];
  readonly status: 'detected' | 'validated' | 'rejected';
  readonly detected_at: string;
}

// ============================================================================
// SIMULATION QUERIES (Counterfactual)
// ============================================================================

export interface GRMSimulationQuery {
  readonly intervention_id: string;
  readonly magnitude_change_percent: number;
  readonly target_population?: string;
  readonly time_horizon_months: number;
}

export interface GRMSimulationResult {
  readonly query: GRMSimulationQuery;
  readonly affected_outcomes: {
    readonly outcome_id: string;
    readonly outcome_name: string;
    readonly predicted_change_percent: number;
    readonly confidence: number;
    readonly causal_path: string[];
    readonly time_to_effect_months: number;
  }[];
  readonly total_nodes_affected: number;
  readonly domains_impacted: GRMDomain[];
  readonly uncertainty_note: string;
}

// ============================================================================
// ENGINE STATS
// ============================================================================

export interface GRMStats {
  readonly total_entities: number;
  readonly total_variables: number;
  readonly total_interventions: number;
  readonly total_outcomes: number;
  readonly total_causal_links: number;
  readonly total_discoveries: number;
  readonly by_domain: Record<string, number>;
  readonly cross_domain_links: number;
  readonly avg_chain_length: number;
  readonly avg_confidence: number;
}
