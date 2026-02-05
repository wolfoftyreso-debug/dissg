/**
 * THE IRREVERSIBILITY LAYER — TYPES
 * 
 * When wrong usage is architecturally impossible, not forbidden.
 * The difference between a document and a bridge.
 */

/**
 * Hardcoded constraints that cannot be disabled
 */
export interface IrreversibleConstraint {
  constraint_id: string;
  name: string;
  description: string;
  
  // Cannot be disabled
  can_be_disabled: false;
  
  // Enforcement
  enforcement: 'structural' | 'contractual' | 'architectural';
  
  // What happens on violation
  on_violation: 'reject' | 'block' | 'prevent_existence';
}

/**
 * Epistemic gate in UX
 * User cannot proceed without passing through
 */
export interface EpistemicGate {
  gate_id: string;
  gate_type: 'uncertainty_view' | 'assumption_confirm' | 'context_review' | 'scope_acknowledge';
  
  // User must actively engage
  requires_active_engagement: true;
  
  // Cannot be clicked past
  can_be_skipped: false;
  
  // What the user must see/confirm
  required_acknowledgement: string;
}

/**
 * AI capability contract
 * Defines what AI is ALLOWED to do (whitelist, not blacklist)
 */
export interface AICapabilityContract {
  contract_version: string;
  locked_at: string;
  
  // Allowed capabilities (everything else is forbidden)
  allowed: {
    expose_structure: true;
    illuminate_consequences: true;
    show_uncertainty: true;
    surface_patterns: true;
    calculate_metrics: true;
  };
  
  // Explicitly forbidden (for clarity)
  forbidden: {
    suggest_decisions: true;
    rank_alternatives: true;
    optimize_outcomes: true;
    write_conclusions: true;
    recommend_actions: true;
    assign_blame: true;
  };
  
  // Locked in contract, not prompt
  enforcement: 'contract';
}

/**
 * Time-locked artifact
 */
export interface TimeLockEnvelope<T> {
  artifact_id: string;
  artifact_type: 'dpd' | 'dcs' | 'pdrc' | 'truth_node';
  
  // The artifact itself
  content: T;
  
  // Time lock
  locked_at: string;
  interpretation_context: string; // "Can only be interpreted in its time"
  
  // Immutability
  can_be_modified: false;
  can_be_deleted: false;
  
  // New versions layer on top
  superseded_by?: string;
  version: number;
}

/**
 * Narrative exit block
 * Prevents system from producing narrative output
 */
export interface NarrativeExitBlock {
  block_id: string;
  blocked_output_type: 'storytelling' | 'summary_dashboard' | 'key_takeaways' | 'colored_conclusions' | 'recommendations';
  
  // Always blocked
  is_active: true;
  
  // What user gets instead
  alternative: 'raw_structure' | 'drill_down_interface' | 'question_prompt';
}

/**
 * Failure mode specification
 * How the system is ALLOWED to fail
 */
export interface FailureMode {
  mode_id: string;
  
  // Correct failure direction
  allowed_failures: {
    stop_accepting_decisions: true;
    require_more_context: true;
    become_slower: true;
  };
  
  // Forbidden failure modes
  forbidden_failures: {
    simplify: true;
    assume: true;
    guess: true;
    interpolate: true;
    extrapolate: true;
  };
}

/**
 * Abuse test result
 */
export interface AbuseTestResult {
  function_id: string;
  function_name: string;
  tested_at: string;
  
  // The question
  test_question: 'Can this be used to legitimize a bad decision?';
  
  // Result
  can_be_abused: boolean;
  abuse_vector?: string;
  
  // Action
  action: 'keep' | 'remove' | 'rebuild';
  rebuild_requirement?: string;
}
