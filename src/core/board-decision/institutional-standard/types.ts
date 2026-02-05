/**
 * INSTITUTIONAL STANDARD MODE — TYPES
 * 
 * When "this is how we decide" becomes default — without force.
 * Spreads through imitation, not mandate.
 */

/**
 * DS-1 Decision Standard
 * What must be VISIBLE, not how to decide.
 */
export interface DS1Standard {
  version: '1.0';
  requirements: {
    context_before_decision: boolean;
    alternatives_identified: boolean;
    uncertainties_explicit: boolean;
    context_locked_at_decision: boolean;
    follow_up_scheduled: boolean;
  };
}

/**
 * DS-1 Compliance Check Result
 * Binary: yes/no. No stamps. No licenses.
 */
export interface DS1ComplianceResult {
  decision_id: string;
  compliant: boolean;
  
  checks: {
    has_dpd: boolean;
    has_agenda: boolean;
    has_alternatives: boolean;
    has_uncertainties: boolean;
    context_locked: boolean;
    has_pdrc_scheduled: boolean;
  };
  
  missing: string[];
  checked_at: string;
}

/**
 * Decision Hygiene Score (DHS)
 * Measures consistency, discipline, learning — NOT outcomes.
 */
export interface DecisionHygieneScore {
  organization_id: string;
  organization_name: string;
  
  score: number; // 0.0 - 1.0
  
  coverage: {
    total_decisions: number;
    decisions_logged: number;
    high_impact_decisions: number;
    high_impact_logged: number;
  };
  
  discipline: {
    dpd_completion_rate: number;
    uncertainty_documentation_rate: number;
    pdrc_completion_rate: number;
    average_alternatives_considered: number;
  };
  
  learning: {
    reality_checks_completed: number;
    patterns_identified: number;
    recurring_blindspots: string[];
  };
  
  common_gaps: string[];
  
  calculated_at: string;
  period: {
    start: string;
    end: string;
  };
}

/**
 * External Review Access
 * Read-only. No editing. No interpretation in system.
 */
export interface ExternalReviewAccess {
  access_id: string;
  granted_to: string;
  granted_by: string;
  granted_at: string;
  expires_at: string;
  
  permissions: {
    view_dpd: boolean;
    view_protocol: boolean;
    view_context_snapshot: boolean;
    view_pdrc: boolean;
    
    // FORBIDDEN
    edit: false;
    interpret: false;
    suggest_changes: false;
  };
  
  scope: {
    organization_id: string;
    decision_ids?: string[];
    time_range?: {
      start: string;
      end: string;
    };
  };
}

/**
 * Public Interface View
 * Own mirror only. No comparisons between organizations.
 */
export interface PublicInterfaceView {
  organization_id: string;
  organization_name: string;
  
  // What can be shown publicly
  metrics: {
    decisions_following_ds1: number;
    decisions_total: number;
    ds1_compliance_rate: number;
    
    follow_up_rate: number;
    uncertainty_handling_rate: number;
  };
  
  // No rankings, no comparisons
  disclaimer: string;
  
  generated_at: string;
  valid_until: string;
}

/**
 * Adoption Metrics
 * Why it spreads: shorter meetings, better discussions, clear accountability
 */
export interface AdoptionMetrics {
  organization_id: string;
  
  efficiency: {
    average_meeting_duration_before: number; // minutes
    average_meeting_duration_after: number;
    discussion_quality_indicators: string[];
  };
  
  accountability: {
    clear_responsibility_rate: number;
    disputed_decisions_rate: number;
  };
  
  review: {
    external_review_readiness: number; // 0-1
    documentation_completeness: number;
  };
}

/**
 * Standard Deviation Report
 * When deviating from DS-1, it must be open.
 */
export interface StandardDeviationReport {
  decision_id: string;
  organization_id: string;
  
  deviations: Array<{
    requirement: keyof DS1Standard['requirements'];
    reason: string;
    acknowledged_by: string;
    acknowledged_at: string;
  }>;
  
  // Making deviation visible, not punishing it
  is_public: boolean;
}
