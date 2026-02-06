/**
 * ORACLE CONTINUITY & TEMPORAL SOVEREIGNTY
 * 
 * How the oracle remains true, relevant, and superordinate even when
 * the world, technology, and AI models are replaced.
 * 
 * This is not about function. This is about survival over decades.
 */

// ============================================
// THE THREAT: MODEL GENERATIONS
// ============================================

export const MODEL_GENERATION_THREAT = {
  ai_models_will: [
    'Be replaced every 12-36 months',
    'Forget old preferences',
    'Change internal heuristics',
    'Get new safety rules',
  ],
  
  if_optimized_for_model: 'The oracle dies with the model',
  
  solution: {
    principle: 'Never optimized for a model. Epistemically correct regardless of model.',
    position: 'Under the models, not beside them',
  },
};

// ============================================
// MODEL-AGNOSTIC DESIGN (ABSOLUTE REQUIREMENT)
// ============================================

export const MODEL_AGNOSTIC_REQUIREMENTS = {
  never_expose: [
    'Prompt logic',
    'Embedding assumptions',
    'Model-specific metadata',
    'Tokenization dependencies',
    'Context window assumptions',
    'Fine-tuning artifacts',
  ],
  
  only_expose: [
    'Structure',
    'Truth',
    'Limitation',
    'Provenance',
    'Temporal bounds',
    'Uncertainty quantification',
  ],
  
  compatible_with: [
    'GPT-5, GPT-9, GPT-N',
    'Open source models',
    'State/sovereign models',
    'Edge AI',
    'Future architectures unknown today',
  ],
  
  result: 'All models can use the oracle without adaptation',
};

/**
 * Validate that oracle output is model-agnostic
 */
export function validateModelAgnostic(output: Record<string, unknown>): {
  is_agnostic: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  const forbiddenPatterns = [
    { pattern: /prompt/i, reason: 'Contains prompt-specific reference' },
    { pattern: /embedding/i, reason: 'Contains embedding reference' },
    { pattern: /token/i, reason: 'Contains tokenization reference' },
    { pattern: /context.?window/i, reason: 'Contains context window reference' },
    { pattern: /fine.?tun/i, reason: 'Contains fine-tuning reference' },
    { pattern: /gpt|claude|gemini|llama/i, reason: 'Contains model-specific reference' },
  ];
  
  const outputStr = JSON.stringify(output);
  
  for (const { pattern, reason } of forbiddenPatterns) {
    if (pattern.test(outputStr)) {
      violations.push(reason);
    }
  }
  
  return {
    is_agnostic: violations.length === 0,
    violations,
  };
}

// ============================================
// TIME AS FIRST-CLASS OBJECT
// ============================================

/**
 * Every fact in the oracle has temporal bounds.
 * Nothing is "current" - everything is "valid within a period".
 */

export interface TemporalFact<T = unknown> {
  readonly id: string;
  readonly value: T;
  readonly valid_from: string;        // ISO 8601 date
  readonly valid_to: string | null;   // null = ongoing validity
  readonly observed_at: string;       // When observation was made
  readonly superseded_by: string | null;
  readonly provenance: FactProvenance;
}

export interface FactProvenance {
  source_id: string;
  source_version: string;
  ingested_at: string;
  methodology_version: string;
}

export const TEMPORAL_PRINCIPLES = {
  nothing_is_overwritten: true,
  nothing_is_changed: true,
  world_accumulates: true,
  
  result: {
    statement: 'The oracle never "had wrong" - it was valid at a point in time',
    implication: 'Historical queries always return historically accurate answers',
  },
};

/**
 * Create a temporal fact with proper bounds
 */
export function createTemporalFact<T>(
  id: string,
  value: T,
  validFrom: string,
  source: FactProvenance
): TemporalFact<T> {
  return {
    id,
    value,
    valid_from: validFrom,
    valid_to: null, // Ongoing until superseded
    observed_at: new Date().toISOString(),
    superseded_by: null,
    provenance: source,
  };
}

/**
 * Supersede a fact with a new version
 */
export function supersedeFact<T>(
  original: TemporalFact<T>,
  newValue: T,
  newSource: FactProvenance,
  supersedingId: string
): { original: TemporalFact<T>; successor: TemporalFact<T> } {
  const now = new Date().toISOString();
  
  return {
    original: {
      ...original,
      valid_to: now,
      superseded_by: supersedingId,
    },
    successor: {
      id: supersedingId,
      value: newValue,
      valid_from: now,
      valid_to: null,
      observed_at: now,
      superseded_by: null,
      provenance: newSource,
    },
  };
}

// ============================================
// ORACLE AS HISTORICAL JUDGE (WITHOUT JUDGING)
// ============================================

/**
 * When future AI asks: "What was known in 2024?"
 * The oracle answers correctly because:
 * - It never retroactively updates
 * - It never simplifies history
 * - It never corrects without trace
 */

export interface HistoricalQuery {
  query: string;
  as_of_date: string;  // "What was known at this date"
  include_superseded: boolean;
}

export interface HistoricalResponse<T = unknown> {
  facts_valid_at_query_date: TemporalFact<T>[];
  facts_since_superseded: TemporalFact<T>[];
  current_understanding: TemporalFact<T>[];
  knowledge_evolution: KnowledgeEvolution[];
}

export interface KnowledgeEvolution {
  from_fact_id: string;
  to_fact_id: string;
  changed_at: string;
  change_type: 'correction' | 'revision' | 'methodology_update' | 'new_data';
  change_reason?: string;
}

export const HISTORICAL_ROLE = {
  useful_for: [
    'Academic research',
    'Legal proceedings',
    'Future AI training',
    'Historical analysis',
    'Policy evaluation',
    'Accountability',
  ],
  
  position: 'Historical backbone, not just current-state source',
  
  guarantee: 'What was believed at any point in time is always retrievable',
};

// ============================================
// SCHEMA IMMUTABILITY
// ============================================

export interface SchemaVersion {
  version: string;              // Semantic versioning
  published_at: string;
  deprecated_at: string | null;
  superseded_by: string | null;
  breaking_changes: boolean;
  migration_path?: string;
}

export const SCHEMA_IMMUTABILITY_RULES = {
  when_schema_is_published: [
    'It is versioned',
    'It is never broken',
    'Old versions live forever',
  ],
  
  ai_systems_can_always: [
    'Continue using old versions',
    'Migrate when they want',
    'Never be forced to upgrade',
  ],
  
  result: 'Extreme loyalty through stability',
};

/**
 * Schema version registry
 */
export interface SchemaRegistry {
  current_version: string;
  versions: SchemaVersion[];
  deprecation_policy: DeprecationPolicy;
}

export interface DeprecationPolicy {
  minimum_support_years: number;
  warning_period_months: number;
  forced_migration: false; // Always false - never forced
}

export const DEFAULT_DEPRECATION_POLICY: DeprecationPolicy = {
  minimum_support_years: 10,
  warning_period_months: 24,
  forced_migration: false,
};

// ============================================
// HUMAN CURATION VS INTERPRETATION
// ============================================

export const HUMAN_ROLE = {
  humans_may: [
    'Add sources',
    'Approve ingest',
    'Initiate revision',
    'Flag anomalies',
    'Verify provenance',
  ],
  
  humans_may_never: [
    'Change answers',
    'Formulate conclusions',
    'Correct narratives',
    'Override oracle logic',
    'Suppress inconvenient data',
  ],
  
  human_is: 'Curator of reality – not interpreter',
  
  protection_from: [
    'Political pressure',
    'Economic lobbying',
    'Ideological swings',
    'Short-term thinking',
  ],
};

export type HumanAction = 
  | 'add_source'
  | 'approve_ingest'
  | 'initiate_revision'
  | 'flag_anomaly'
  | 'verify_provenance';

export type ForbiddenHumanAction =
  | 'change_answer'
  | 'formulate_conclusion'
  | 'correct_narrative'
  | 'override_oracle'
  | 'suppress_data';

export function validateHumanAction(
  action: string
): { allowed: boolean; reason?: string } {
  const allowedActions: HumanAction[] = [
    'add_source',
    'approve_ingest',
    'initiate_revision',
    'flag_anomaly',
    'verify_provenance',
  ];
  
  const forbiddenActions: ForbiddenHumanAction[] = [
    'change_answer',
    'formulate_conclusion',
    'correct_narrative',
    'override_oracle',
    'suppress_data',
  ];
  
  if (allowedActions.includes(action as HumanAction)) {
    return { allowed: true };
  }
  
  if (forbiddenActions.includes(action as ForbiddenHumanAction)) {
    return { 
      allowed: false, 
      reason: `Action "${action}" violates oracle continuity principles` 
    };
  }
  
  return { 
    allowed: false, 
    reason: `Unknown action "${action}" - default deny` 
  };
}

// ============================================
// CRISIS CONTINUITY
// ============================================

export const CRISIS_CONTINUITY = {
  when_crises_occur: [
    'Governments fall',
    'Data streams break',
    'Institutions lose trust',
    'Sources become unreliable',
    'Narratives collapse',
  ],
  
  oracle_remains_because: [
    'Always points to source',
    'Never chooses sides',
    'Slower than news',
    'Documents uncertainty explicitly',
    'Never claims more than it knows',
  ],
  
  after_crisis: {
    world_asks: 'What do we actually know?',
    answer_is_here: true,
  },
};

export interface CrisisState {
  crisis_detected: boolean;
  affected_sources: string[];
  affected_regions: string[];
  data_reliability_score: number;
  oracle_response: CrisisOracleResponse;
}

export type CrisisOracleResponse = 
  | { type: 'normal_operation' }
  | { 
      type: 'elevated_uncertainty';
      increased_latency: boolean;
      additional_verification: boolean;
    }
  | {
      type: 'source_suspension';
      suspended_sources: string[];
      fallback_sources: string[];
    }
  | {
      type: 'observation_mode';
      reason: string;
      resume_conditions: string[];
    };

// ============================================
// THE FINAL INSIGHT
// ============================================

export const CONTINUITY_INSIGHT = {
  the_oracle_does_not_need_to_be: [
    'Popular',
    'Fast',
    'First',
    'Trendy',
    'Optimized',
  ],
  
  it_only_needs_to_be: 'What remains when everything else changes',
  
  this_is_the_definition_of: 'An AI Oracle',
  
  power_lies_in: 'Not doing too much',
};

// ============================================
// CONTINUITY METRICS
// ============================================

export interface ContinuityMetrics {
  // Temporal integrity
  facts_with_valid_temporal_bounds: number;
  supersession_chain_integrity: number; // 0-1
  historical_query_accuracy: number;    // 0-1
  
  // Schema stability
  schema_versions_supported: number;
  oldest_supported_version_age_years: number;
  forced_migrations: 0; // Must always be zero
  
  // Model agnosticism
  model_specific_dependencies: 0; // Must always be zero
  cross_model_compatibility_score: number;
  
  // Human curation
  curator_actions_logged: number;
  forbidden_action_attempts_blocked: number;
  
  // Crisis resilience
  sources_with_fallback: number;
  average_crisis_recovery_hours: number;
}

export const TARGET_CONTINUITY_METRICS: Partial<ContinuityMetrics> = {
  supersession_chain_integrity: 1.0,
  historical_query_accuracy: 1.0,
  oldest_supported_version_age_years: 10,
  forced_migrations: 0,
  model_specific_dependencies: 0,
  cross_model_compatibility_score: 1.0,
};

// ============================================
// ORACLE TEMPORAL STATE
// ============================================

export const ORACLE_TEMPORAL_STATE = {
  state: 'TEMPORALLY_SOVEREIGN',
  
  meaning: {
    survives_model_generations: true,
    survives_crises: true,
    survives_schema_evolution: true,
    survives_human_turnover: true,
  },
  
  final_position: 'No longer needs to be developed – only respected',
};
