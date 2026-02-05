/**
 * DECISION LEGIBILITY LAYER — TYPES
 * 
 * Decisions that can be understood in 30 years.
 * Not traceability. Cognitive clarity in hindsight.
 */

/**
 * Decision Legibility Score (DLS)
 * Measures if decision was DEFENSIBLE, not if it was RIGHT.
 */
export interface DecisionLegibilityScore {
  decision_id: string;
  score: number; // 0.0 - 1.0
  
  // Component scores
  components: {
    alternative_coverage: number;      // Were relevant alternatives covered?
    uncertainty_visibility: number;    // Were uncertainties surfaced?
    assumption_explicitness: number;   // Were assumptions stated?
    scope_correctness: number;         // Was scope appropriate?
    timeframe_correctness: number;     // Was timeframe realistic?
  };
  
  missing_elements: LegibilityGap[];
  
  // Reasonable person test
  reasonable_person_test: {
    new_board_member_understands: boolean;
    external_auditor_understands: boolean;
    future_ai_understands: boolean;
    test_passed: boolean;
  };
  
  calculated_at: string;
  notes: string;
}

/**
 * Gap in legibility
 */
export interface LegibilityGap {
  element: string;
  severity: 'minor' | 'moderate' | 'critical';
  description: string;
  recommendation: string;
}

/**
 * Anti-narrative decision summary
 * Max 6 lines. No adjectives. No retrospective explanations.
 */
export interface DecisionSummary {
  decision_id: string;
  
  // Structured, neutral summary
  context: string;
  alternatives_considered: string[];
  known_risks: string[];
  flagged_uncertainties: string[];
  decision_taken: string;
  
  // Generated summary (max 6 lines, no adjectives)
  summary_text: string;
  
  // Lock status
  locked_at: string;
  locked_by: string;
  
  // Forbidden: cannot be modified after outcome observed
  is_immutable: boolean;
}

/**
 * Decision timeline event
 */
export type TimelineEventType = 
  | 'context_established'
  | 'alternatives_identified'
  | 'uncertainties_surfaced'
  | 'decision_locked'
  | 'outcome_observed';

export interface TimelineEvent {
  event_type: TimelineEventType;
  timestamp: string;
  description: string;
  actor: string;
  checksum: string;
}

/**
 * Decision timeline (time is linear and irrevocable)
 */
export interface DecisionTimeline {
  decision_id: string;
  events: TimelineEvent[];
  
  // Validation
  is_complete: boolean;
  missing_stages: TimelineEventType[];
}

/**
 * Collective memory pattern
 */
export interface CollectiveMemoryPattern {
  pattern_id: string;
  pattern_type: 
    | 'recurring_uncertainty'
    | 'common_assumption_failure'
    | 'systematic_blind_spot'
    | 'successful_framework';
  
  description: string;
  frequency: number;
  first_observed: string;
  last_observed: string;
  
  affected_decisions: string[];
  
  // Not opinion, just pattern
  statistical_significance: number;
}

/**
 * Collective memory query result
 */
export interface CollectiveMemoryResult {
  query: string;
  query_type: 
    | 'how_did_we_decide'
    | 'what_did_we_miss'
    | 'recurring_uncertainties';
  
  patterns: CollectiveMemoryPattern[];
  decision_count_analyzed: number;
  time_range_analyzed: {
    start: string;
    end: string;
  };
  
  // Anti-myth disclaimer
  disclaimer: string;
}

/**
 * Legibility audit result
 */
export interface LegibilityAudit {
  audit_id: string;
  decision_id: string;
  audited_at: string;
  
  legibility_score: DecisionLegibilityScore;
  timeline: DecisionTimeline;
  summary: DecisionSummary;
  
  // Myth-building detection
  myth_indicators: MythIndicator[];
  
  overall_assessment: 'legible' | 'partially_legible' | 'illegible';
}

/**
 * Myth indicator (protection against hero stories, blame, romanticization)
 */
export interface MythIndicator {
  indicator_type: 
    | 'hero_narrative'
    | 'individual_blame'
    | 'romanticized_risk'
    | 'retrospective_wisdom';
  
  description: string;
  source: string;
  detected_at: string;
}
