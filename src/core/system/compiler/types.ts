/**
 * QUERY → ONTOLOGY COMPILER — TYPES
 * 
 * All types for the QOC pipeline.
 */

// ═══════════════════════════════════════════════════════════════════
//                         INPUT TYPES
// ═══════════════════════════════════════════════════════════════════

export interface RawQuery {
  readonly query_text: string;
  readonly locale: string;
}

export interface QueryMetadata {
  readonly source: 'search' | 'direct' | 'api' | 'agent';
  readonly volume_rank?: number;
  readonly geo: string;
  readonly timestamp?: string;
}

export interface CompilerInput {
  readonly query: RawQuery;
  readonly metadata?: QueryMetadata;
}

// ═══════════════════════════════════════════════════════════════════
//                         STEP 1: INTENT NORMALIZATION
// ═══════════════════════════════════════════════════════════════════

export type IntentClass = 
  | 'consumer_product_evaluation'
  | 'service_comparison'
  | 'location_assessment'
  | 'policy_impact'
  | 'investment_analysis'
  | 'career_decision'
  | 'health_choice'
  | 'educational_path'
  | 'unknown';

export interface NormalizedIntent {
  readonly intent_id: IntentClass;
  readonly implicit_choice: string;
  readonly risk_exposure: 'low' | 'medium' | 'high';
  readonly time_horizon_hint: 'immediate' | 'short_term' | 'multi_year' | 'long_term';
  readonly confidence: number;
}

// ═══════════════════════════════════════════════════════════════════
//                         STEP 2: ENTITY RESOLUTION
// ═══════════════════════════════════════════════════════════════════

export type EntityType = 
  | 'vehicle_model'
  | 'product'
  | 'service'
  | 'location'
  | 'organization'
  | 'policy'
  | 'investment'
  | 'career_path'
  | 'health_intervention'
  | 'educational_program'
  | 'unknown';

export interface ResolvedEntity {
  readonly name: string;
  readonly type: EntityType;
  readonly confidence: number;
  readonly is_stub: boolean;
}

// ═══════════════════════════════════════════════════════════════════
//                         STEP 3: DECISION BLUEPRINT
// ═══════════════════════════════════════════════════════════════════

export interface DecisionBlueprint {
  readonly decision_type: string;
  readonly required: {
    readonly alternatives: number;
    readonly uncertainties: number;
    readonly scope: boolean;
    readonly time_horizon: boolean;
  };
  readonly suggested_dimensions: readonly string[];
}

// ═══════════════════════════════════════════════════════════════════
//                         STEP 4: DRAFT DECISION
// ═══════════════════════════════════════════════════════════════════

export interface DraftDecision {
  readonly decision_type: string;
  readonly scope: {
    readonly population_size: 'individual' | 'household' | 'group' | 'organization' | 'population';
    readonly reversibility: 'low' | 'medium' | 'high';
  };
  readonly time_horizon: {
    readonly start: string;
    readonly end: string;
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         STEP 5: CONTEXT SKELETON
// ═══════════════════════════════════════════════════════════════════

export interface ContextSkeleton {
  readonly description: string;
  readonly affected_population: string;
  readonly geographic_scope: string;
  readonly assumptions: readonly {
    readonly text: string;
    readonly is_specified: boolean;
  }[];
}

// ═══════════════════════════════════════════════════════════════════
//                         STEP 6: ALTERNATIVE SEED
// ═══════════════════════════════════════════════════════════════════

export interface AlternativeSeed {
  readonly label: string;
  readonly description: string;
  readonly required_assumptions: readonly string[];
  readonly is_placeholder: boolean;
}

// ═══════════════════════════════════════════════════════════════════
//                         STEP 7: UNCERTAINTY SEED
// ═══════════════════════════════════════════════════════════════════

export type UncertaintyType = 
  | 'future_variability'
  | 'external_dependency'
  | 'measurement_error'
  | 'model_limitation'
  | 'behavioral_unknown';

export interface UncertaintySeed {
  readonly description: string;
  readonly uncertainty_type: UncertaintyType;
  readonly impact_range: 'low' | 'medium' | 'high';
}

// ═══════════════════════════════════════════════════════════════════
//                         STEP 8: COVERAGE CHECK
// ═══════════════════════════════════════════════════════════════════

export interface CoverageResult {
  readonly coverage: 'full' | 'partial' | 'insufficient';
  readonly gaps: readonly string[];
  readonly build_allowed: boolean;
  readonly reason?: string;
}

// ═══════════════════════════════════════════════════════════════════
//                         COMPILER OUTPUT
// ═══════════════════════════════════════════════════════════════════

export interface CompilerOutput {
  readonly success: boolean;
  readonly decision_id: string;
  readonly status: 'draft' | 'blocked';
  readonly draft?: {
    readonly decision: DraftDecision;
    readonly context: ContextSkeleton;
    readonly alternatives: readonly AlternativeSeed[];
    readonly uncertainties: readonly UncertaintySeed[];
  };
  readonly missing_to_lock: readonly string[];
  readonly public_facing_message: string;
  readonly pipeline_trace: readonly PipelineStep[];
}

export interface PipelineStep {
  readonly step: number;
  readonly name: string;
  readonly input: unknown;
  readonly output: unknown;
  readonly duration_ms: number;
}

// ═══════════════════════════════════════════════════════════════════
//                         FORBIDDEN WORDS
// ═══════════════════════════════════════════════════════════════════

export const FORBIDDEN_OUTPUT_WORDS = [
  'best',
  'recommend',
  'should',
  'winner',
  'top',
  'optimal',
  'perfect',
  'ideal',
  'must',
  'better',
  'worst',
  'avoid',
] as const;
