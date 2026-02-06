/**
 * SELF-CORRECTION ENGINE
 * 
 * STEG 22: SELF-CORRECTING BUT NEVER SELF-MODIFYING
 * 
 * Allowed improvements from feedback:
 * 1. New query templates
 * 2. Problem object refinement
 * 3. Visibility adjustment
 * 4. Coverage gap detection
 * 
 * Results after sufficient feedback:
 * - Fewer retries
 * - Faster resolves
 * - Higher direct citation
 * - Lower fallback to external sources
 * 
 * But:
 * - Same answers
 * - Same data
 * - Same epistemics
 * 
 * The system becomes better at being found, not at having opinions.
 */

import type { AgentFeedback, SuggestedAction } from './agent-feedback-types';
import { FeedbackBarrierChecker } from './feedback-barriers';

/**
 * CORRECTION TYPE
 * Only meta-corrections, never content corrections
 */
export type CorrectionType = 
  | 'query_template'
  | 'problem_object_split'
  | 'visibility_adjustment'
  | 'coverage_gap';

/**
 * CORRECTION RECORD
 */
export interface CorrectionRecord {
  readonly id: string;
  readonly type: CorrectionType;
  readonly created_at: string;
  readonly triggered_by_feedback_ids: string[];
  readonly action: SuggestedAction;
  readonly status: 'pending' | 'applied' | 'rejected';
  readonly impact: CorrectionImpact | null;
}

/**
 * CORRECTION IMPACT
 * Measured after correction is applied
 */
export interface CorrectionImpact {
  readonly measured_at: string;
  readonly retry_reduction_percent: number;
  readonly resolve_speed_improvement_ms: number;
  readonly direct_citation_increase_percent: number;
  readonly fallback_reduction_percent: number;
}

/**
 * PATTERN DETECTION
 */
export interface DetectedPattern {
  readonly pattern_type: 'reformulation' | 'ambiguity' | 'unresolved';
  readonly query_pattern: string;
  readonly occurrence_count: number;
  readonly affected_cq_ids: string[];
  readonly suggested_correction: SuggestedAction;
}

/**
 * SELF-CORRECTION ENGINE
 */
export class SelfCorrectionEngine {
  private barrierChecker = new FeedbackBarrierChecker();
  private corrections: Map<string, CorrectionRecord> = new Map();
  private patterns: Map<string, DetectedPattern> = new Map();
  
  // Feedback accumulation for pattern detection
  private reformulationPatterns: Map<string, string[]> = new Map();
  private ambiguityPatterns: Map<string, string[]> = new Map();
  private unresolvedPatterns: Map<string, number> = new Map();
  
  /**
   * Process feedback for potential corrections
   */
  processFeedback(feedback: AgentFeedback): DetectedPattern | null {
    // Accumulate patterns based on feedback type
    if (feedback.type === 'retry_pattern') {
      return this.processRetryPattern(feedback as any);
    }
    
    if (feedback.type === 'cross_cq_ambiguity') {
      return this.processAmbiguityPattern(feedback as any);
    }
    
    if (feedback.type === 'resolve_failure') {
      return this.processUnresolvedPattern(feedback as any);
    }
    
    return null;
  }
  
  /**
   * Process retry patterns for query template creation
   */
  private processRetryPattern(feedback: {
    original_query: string;
    reformulations: string[];
    final_resolved: boolean;
    final_cq_id: string | null;
  }): DetectedPattern | null {
    // Track reformulation patterns
    for (const reformulation of feedback.reformulations) {
      const existing = this.reformulationPatterns.get(reformulation) || [];
      existing.push(feedback.original_query);
      this.reformulationPatterns.set(reformulation, existing);
    }
    
    // Check if pattern is significant
    for (const [reformulation, originals] of this.reformulationPatterns) {
      if (originals.length >= 5 && feedback.final_cq_id) {
        const pattern: DetectedPattern = {
          pattern_type: 'reformulation',
          query_pattern: reformulation,
          occurrence_count: originals.length,
          affected_cq_ids: [feedback.final_cq_id],
          suggested_correction: {
            type: 'create_query_template',
            template: reformulation,
            target_cq_id: feedback.final_cq_id,
          },
        };
        this.patterns.set(`reform-${reformulation}`, pattern);
        return pattern;
      }
    }
    
    return null;
  }
  
  /**
   * Process ambiguity patterns for problem object splitting
   */
  private processAmbiguityPattern(feedback: {
    query: string;
    candidate_cq_ids: string[];
    suggests_problem_object_split: boolean;
  }): DetectedPattern | null {
    if (!feedback.suggests_problem_object_split) return null;
    
    const key = feedback.candidate_cq_ids.sort().join('|');
    const existing = this.ambiguityPatterns.get(key) || [];
    existing.push(feedback.query);
    this.ambiguityPatterns.set(key, existing);
    
    // Check if pattern is significant
    if (existing.length >= 3) {
      const pattern: DetectedPattern = {
        pattern_type: 'ambiguity',
        query_pattern: existing[0],
        occurrence_count: existing.length,
        affected_cq_ids: feedback.candidate_cq_ids,
        suggested_correction: {
          type: 'split_problem_object',
          source_cq_id: feedback.candidate_cq_ids[0],
          split_criteria: `Ambiguity between ${feedback.candidate_cq_ids.length} CQs`,
        },
      };
      this.patterns.set(`ambig-${key}`, pattern);
      return pattern;
    }
    
    return null;
  }
  
  /**
   * Process unresolved patterns for coverage gap detection
   */
  private processUnresolvedPattern(feedback: {
    query: string;
    resolved: false;
  }): DetectedPattern | null {
    const normalized = feedback.query.toLowerCase().trim();
    const count = (this.unresolvedPatterns.get(normalized) || 0) + 1;
    this.unresolvedPatterns.set(normalized, count);
    
    // Check if pattern is significant
    if (count >= 10) {
      const pattern: DetectedPattern = {
        pattern_type: 'unresolved',
        query_pattern: normalized,
        occurrence_count: count,
        affected_cq_ids: [],
        suggested_correction: {
          type: 'flag_coverage_gap',
          query_pattern: normalized,
          priority: count >= 50 ? 'high' : count >= 20 ? 'medium' : 'low',
        },
      };
      this.patterns.set(`unres-${normalized}`, pattern);
      return pattern;
    }
    
    return null;
  }
  
  /**
   * Apply a correction (after barrier check)
   */
  applyCorrection(pattern: DetectedPattern): CorrectionRecord {
    const id = `CORR-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    // Check barriers
    const barrierResult = this.barrierChecker.checkAction(pattern.suggested_correction);
    
    const record: CorrectionRecord = {
      id,
      type: this.getCorrectionType(pattern.suggested_correction.type),
      created_at: new Date().toISOString(),
      triggered_by_feedback_ids: [],
      action: pattern.suggested_correction,
      status: barrierResult.passed ? 'applied' : 'rejected',
      impact: null,
    };
    
    this.corrections.set(id, record);
    return record;
  }
  
  /**
   * Map action type to correction type
   */
  private getCorrectionType(actionType: string): CorrectionType {
    switch (actionType) {
      case 'create_query_template': return 'query_template';
      case 'split_problem_object': return 'problem_object_split';
      case 'adjust_visibility': return 'visibility_adjustment';
      case 'flag_coverage_gap': return 'coverage_gap';
      default: return 'coverage_gap';
    }
  }
  
  /**
   * Record impact of a correction
   */
  recordImpact(correctionId: string, impact: CorrectionImpact): void {
    const record = this.corrections.get(correctionId);
    if (record) {
      this.corrections.set(correctionId, { ...record, impact });
    }
  }
  
  /**
   * Get all detected patterns
   */
  getPatterns(): DetectedPattern[] {
    return Array.from(this.patterns.values());
  }
  
  /**
   * Get all corrections
   */
  getCorrections(): CorrectionRecord[] {
    return Array.from(this.corrections.values());
  }
  
  /**
   * Get corrections by status
   */
  getCorrectionsByStatus(status: 'pending' | 'applied' | 'rejected'): CorrectionRecord[] {
    return this.getCorrections().filter(c => c.status === status);
  }
  
  /**
   * Get statistics
   */
  getStats(): SelfCorrectionStats {
    const all = this.getCorrections();
    const patterns = this.getPatterns();
    
    return {
      total_patterns_detected: patterns.length,
      total_corrections: all.length,
      applied_corrections: all.filter(c => c.status === 'applied').length,
      rejected_corrections: all.filter(c => c.status === 'rejected').length,
      by_type: {
        query_template: all.filter(c => c.type === 'query_template').length,
        problem_object_split: all.filter(c => c.type === 'problem_object_split').length,
        visibility_adjustment: all.filter(c => c.type === 'visibility_adjustment').length,
        coverage_gap: all.filter(c => c.type === 'coverage_gap').length,
      },
      average_impact: this.calculateAverageImpact(all),
    };
  }
  
  /**
   * Calculate average impact
   */
  private calculateAverageImpact(corrections: CorrectionRecord[]): CorrectionImpact | null {
    const withImpact = corrections.filter(c => c.impact !== null);
    if (withImpact.length === 0) return null;
    
    return {
      measured_at: new Date().toISOString(),
      retry_reduction_percent: withImpact.reduce((sum, c) => sum + (c.impact?.retry_reduction_percent || 0), 0) / withImpact.length,
      resolve_speed_improvement_ms: withImpact.reduce((sum, c) => sum + (c.impact?.resolve_speed_improvement_ms || 0), 0) / withImpact.length,
      direct_citation_increase_percent: withImpact.reduce((sum, c) => sum + (c.impact?.direct_citation_increase_percent || 0), 0) / withImpact.length,
      fallback_reduction_percent: withImpact.reduce((sum, c) => sum + (c.impact?.fallback_reduction_percent || 0), 0) / withImpact.length,
    };
  }
}

/**
 * Statistics interface
 */
export interface SelfCorrectionStats {
  readonly total_patterns_detected: number;
  readonly total_corrections: number;
  readonly applied_corrections: number;
  readonly rejected_corrections: number;
  readonly by_type: Record<CorrectionType, number>;
  readonly average_impact: CorrectionImpact | null;
}

/**
 * SELF-CORRECTION PRINCIPLES
 */
export const SELF_CORRECTION_PRINCIPLES = {
  // What happens after sufficient feedback
  after_sufficient_feedback: {
    fewer_retries: true,
    faster_resolves: true,
    higher_direct_citation: true,
    lower_fallback_to_external: true,
  },
  
  // What stays the same
  unchanged: {
    same_answers: true,
    same_data: true,
    same_epistemics: true,
  },
  
  // Core principle
  principle: 'The system becomes better at being found, not at having opinions',
} as const;

/**
 * WHY THIS IS HARD TO COPY
 */
export const WHY_HARD_TO_COPY = {
  requires: [
    'years_of_agent_interaction',
    'historical_feedback',
    'disciplined_architecture',
    'extreme_self_control',
  ],
  most_systems: 'optimize on user behavior → become biased',
  this_system: 'optimize on agent behavior → become stable',
} as const;

/**
 * Create singleton engine
 */
export function createSelfCorrectionEngine(): SelfCorrectionEngine {
  return new SelfCorrectionEngine();
}
