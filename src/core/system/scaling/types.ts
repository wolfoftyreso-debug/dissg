/**
 * VOLUME SCALING TYPES
 * 
 * Year 5+: When the system grows without changing.
 * Increase volume, never degrees of freedom.
 */

// ============================================================================
// SCALING RULE
// ============================================================================

export const SCALING_RULE = {
  principle: 'Increase volume, never degrees of freedom',
  requirements: [
    'Use same ontology',
    'Go through same compiler',
    'Locked by same legitimacy rules',
  ],
  forbidden: 'No local adaptation of truth',
} as const;

// ============================================================================
// SCALING AXES
// ============================================================================

export type ScalingAxis = 'questions' | 'domains' | 'languages';

export interface QuestionScaling {
  readonly input: string[];
  readonly mechanism: string;
  readonly output: {
    readonly cdp_percentage: number;
    readonly cannot_answer_percentage: number;
  };
  readonly key_principle: string;
}

export interface DomainScaling {
  readonly requirements: readonly string[];
  readonly priority_order: readonly DomainPriority[];
  readonly new_domain_requires: readonly string[];
}

export interface DomainPriority {
  readonly rank: number;
  readonly name: string;
  readonly notes?: string;
}

export interface LanguageScaling {
  readonly canonical_language: 'EN';
  readonly compiler_output: 'structurally_identical';
  readonly ui_texts: 'translated';
  readonly requirement: string;
}

// ============================================================================
// AUTOMATION PIPELINE
// ============================================================================

export interface PipelineStage {
  readonly name: string;
  readonly order: number;
  readonly automated: boolean;
  readonly human_required?: string;
}

export interface AutomationPipeline {
  readonly stages: readonly PipelineStage[];
  readonly properties: {
    readonly deterministic: true;
    readonly version_pinned: true;
    readonly no_human_editing: true;
  };
  readonly human_only_for: readonly string[];
}

// ============================================================================
// QUALITY GUARDS
// ============================================================================

export interface QualityGuard {
  readonly name: string;
  readonly description: string;
  readonly trigger: string;
  readonly action: 'flag' | 'block' | 'alert';
}

// ============================================================================
// ORGANIZATION
// ============================================================================

export interface ScalingRole {
  readonly title: string;
  readonly count: string;
  readonly permanent: boolean;
}

// ============================================================================
// ECONOMICS
// ============================================================================

export interface RevenueStream {
  readonly source: string;
  readonly scales_with: string;
}

export interface PublicContentPolicy {
  readonly free: true;
  readonly complete: true;
  readonly non_commercially_influenced: true;
  readonly reason: string;
}

// ============================================================================
// COMPLETION SIGNALS
// ============================================================================

export interface CompletionSignal {
  readonly indicator: string;
  readonly meaning: string;
}

export interface DestructionRisk {
  readonly not_from: readonly string[];
  readonly from: string;
}
