/**
 * FEEDBACK BARRIERS
 * 
 * STEG 22: HARD ARCHITECTURAL BARRIERS
 * 
 * What feedback can NEVER do:
 * - Change answer formulation
 * - Affect values
 * - Prioritize narrative
 * - Merge facts
 * 
 * This is hard-blocked in architecture.
 * 
 * Feedback → routing ✓
 * Feedback → coverage ✓
 * Feedback → visibility ✓
 * Feedback → content ❌
 */

import type { SuggestedAction } from './agent-feedback-types';

/**
 * BARRIER TYPE
 */
export type BarrierType = 
  | 'content_modification'
  | 'value_change'
  | 'narrative_priority'
  | 'fact_merging'
  | 'source_manipulation'
  | 'confidence_override'
  | 'methodology_change';

/**
 * BARRIER VIOLATION
 */
export interface BarrierViolation {
  readonly barrier_type: BarrierType;
  readonly attempted_action: string;
  readonly blocked: true;
  readonly reason: string;
  readonly timestamp: string;
}

/**
 * BARRIER CHECK RESULT
 */
export interface BarrierCheckResult {
  readonly passed: boolean;
  readonly violations: BarrierViolation[];
  readonly allowed_actions: SuggestedAction[];
  readonly blocked_actions: string[];
}

/**
 * FEEDBACK BARRIERS
 * Immutable architectural constraints
 */
export const FEEDBACK_BARRIERS: Record<BarrierType, {
  readonly description: string;
  readonly blocked_patterns: readonly string[];
  readonly severity: 'critical';
}> = {
  content_modification: {
    description: 'Feedback cannot modify answer content or formulation',
    blocked_patterns: [
      'change_answer_text',
      'rephrase_answer',
      'simplify_answer',
      'expand_answer',
      'modify_wording',
    ],
    severity: 'critical',
  },
  value_change: {
    description: 'Feedback cannot change data values or numbers',
    blocked_patterns: [
      'adjust_value',
      'correct_number',
      'update_statistic',
      'modify_figure',
      'change_percentage',
    ],
    severity: 'critical',
  },
  narrative_priority: {
    description: 'Feedback cannot prioritize certain narratives over others',
    blocked_patterns: [
      'prioritize_interpretation',
      'emphasize_angle',
      'highlight_narrative',
      'de_emphasize_fact',
      'reorder_by_preference',
    ],
    severity: 'critical',
  },
  fact_merging: {
    description: 'Feedback cannot merge or combine separate facts',
    blocked_patterns: [
      'merge_facts',
      'combine_observations',
      'aggregate_without_method',
      'synthesize_conclusion',
    ],
    severity: 'critical',
  },
  source_manipulation: {
    description: 'Feedback cannot manipulate source selection or ranking',
    blocked_patterns: [
      'prefer_source',
      'demote_source',
      'hide_source',
      'reorder_sources',
    ],
    severity: 'critical',
  },
  confidence_override: {
    description: 'Feedback cannot override confidence or uncertainty levels',
    blocked_patterns: [
      'increase_confidence',
      'decrease_uncertainty',
      'hide_uncertainty',
      'boost_reliability',
    ],
    severity: 'critical',
  },
  methodology_change: {
    description: 'Feedback cannot change calculation or analysis methodology',
    blocked_patterns: [
      'change_calculation',
      'modify_formula',
      'adjust_baseline',
      'alter_comparison',
    ],
    severity: 'critical',
  },
};

/**
 * FEEDBACK BARRIER CHECKER
 * Validates that feedback actions don't violate barriers
 */
export class FeedbackBarrierChecker {
  private violations: BarrierViolation[] = [];
  
  /**
   * Check if an action violates any barriers
   */
  checkAction(action: SuggestedAction): BarrierCheckResult {
    this.violations = [];
    const blockedActions: string[] = [];
    const allowedActions: SuggestedAction[] = [];
    
    // Check against all barriers
    for (const [barrierType, barrier] of Object.entries(FEEDBACK_BARRIERS)) {
      const actionString = JSON.stringify(action).toLowerCase();
      
      for (const pattern of barrier.blocked_patterns) {
        if (actionString.includes(pattern.toLowerCase())) {
          const violation: BarrierViolation = {
            barrier_type: barrierType as BarrierType,
            attempted_action: action.type,
            blocked: true,
            reason: barrier.description,
            timestamp: new Date().toISOString(),
          };
          this.violations.push(violation);
          blockedActions.push(action.type);
        }
      }
    }
    
    // Only allowed actions pass through
    if (this.violations.length === 0) {
      // Verify action is in allowed list
      if (this.isAllowedActionType(action.type)) {
        allowedActions.push(action);
      } else {
        blockedActions.push(action.type);
      }
    }
    
    return {
      passed: this.violations.length === 0 && allowedActions.length > 0,
      violations: [...this.violations],
      allowed_actions: allowedActions,
      blocked_actions: blockedActions,
    };
  }
  
  /**
   * Check if action type is in allowed list
   */
  private isAllowedActionType(actionType: string): boolean {
    const allowedTypes = [
      'create_query_template',
      'split_problem_object',
      'adjust_visibility',
      'flag_coverage_gap',
    ];
    return allowedTypes.includes(actionType);
  }
  
  /**
   * Batch check multiple actions
   */
  checkActions(actions: SuggestedAction[]): BarrierCheckResult {
    const allViolations: BarrierViolation[] = [];
    const allAllowed: SuggestedAction[] = [];
    const allBlocked: string[] = [];
    
    for (const action of actions) {
      const result = this.checkAction(action);
      allViolations.push(...result.violations);
      allAllowed.push(...result.allowed_actions);
      allBlocked.push(...result.blocked_actions);
    }
    
    return {
      passed: allViolations.length === 0,
      violations: allViolations,
      allowed_actions: allAllowed,
      blocked_actions: allBlocked,
    };
  }
  
  /**
   * Get violation statistics
   */
  getViolationStats(): Record<BarrierType, number> {
    const stats: Record<BarrierType, number> = {
      content_modification: 0,
      value_change: 0,
      narrative_priority: 0,
      fact_merging: 0,
      source_manipulation: 0,
      confidence_override: 0,
      methodology_change: 0,
    };
    
    for (const violation of this.violations) {
      stats[violation.barrier_type]++;
    }
    
    return stats;
  }
}

/**
 * ALLOWED VS BLOCKED SUMMARY
 */
export const ALLOWED_VS_BLOCKED = {
  // What feedback CAN do
  feedback_can: {
    routing: true,
    coverage: true,
    visibility: true,
    query_templates: true,
    problem_object_structure: true,
    cache_priority: true,
    latency_optimization: true,
  },
  
  // What feedback CANNOT do
  feedback_cannot: {
    answer_formulation: true,
    data_values: true,
    narrative_priority: true,
    fact_merging: true,
    source_selection: true,
    confidence_scores: true,
    uncertainty_levels: true,
    methodology: true,
  },
} as const;

/**
 * Create singleton checker
 */
export function createFeedbackBarrierChecker(): FeedbackBarrierChecker {
  return new FeedbackBarrierChecker();
}
