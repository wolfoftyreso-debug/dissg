/**
 * PUBLIC READ-ONLY PORTAL — TYPES
 * 
 * Everything that affects many should be visible to many.
 * But: No comments. No voting. No interpretation in the system.
 */

/**
 * Public Decision View
 * Shows exactly the same artifacts the board saw
 */
export interface PublicDecisionView {
  decision_id: string;
  
  // Core visible elements
  summary: {
    statement: string; // Max 6 lines, neutral
    scope: string;
    population_affected: string;
    time_horizon: string;
  };
  
  // Decision Context Snapshot (public version)
  context_snapshot: {
    what_was_known: string[];
    what_was_uncertain: string[];
    constraints: string[];
  };
  
  // Alternatives considered (without internal discussion)
  alternatives_considered: Array<{
    id: string;
    label: string;
    key_tradeoff: string;
  }>;
  
  // Uncertainty visibility
  known_uncertainties: string[];
  
  // Irreversibility
  irreversibility_level: 'low' | 'medium' | 'high' | 'extreme';
  
  // Quality scores
  decision_legibility_score: number;
  
  // Review status
  review_status: {
    scheduled: boolean;
    scheduled_date?: string;
    completed: boolean;
    completed_date?: string;
  };
  
  // Never shown
  private_elements: null; // Explicitly null - no internal discussions
}

/**
 * Transparency delay configuration
 */
export interface TransparencyDelay {
  decision_id: string;
  
  // Delay settings
  delay_months: number;
  delay_reason: 'commercial_sensitivity' | 'personnel_matter' | 'ongoing_negotiation' | 'legal_process';
  
  // Timestamps
  decision_date: string;
  scheduled_publication: string;
  
  // Visibility of the delay itself
  delay_visible: true; // Always true - no silent secrets
}

/**
 * Public API Response structure
 */
export interface PublicAPIResponse<T> {
  data: T;
  
  // Versioning for reproducibility
  version: {
    api_version: string;
    data_version: string;
    response_generated_at: string;
  };
  
  // No summarizing language
  interpretation: null;
  
  // Rate limiting info
  rate_limit: {
    remaining: number;
    reset_at: string;
  };
}

/**
 * Media-safe data wrapper
 * Ensures context is always present
 */
export interface MediaSafeWrapper<T> {
  data: T;
  
  // Always visible
  required_context: {
    baseline: string;
    time_period: string;
    scope: string;
    uncertainties: string[];
  };
  
  // Cannot be stripped
  inseparable: true;
}

/**
 * Public portal access log
 */
export interface PublicAccessLog {
  access_id: string;
  accessed_at: string;
  
  resource_type: 'decision' | 'context' | 'review' | 'api';
  resource_id: string;
  
  // No personally identifying info
  accessor_type: 'anonymous' | 'researcher' | 'journalist' | 'api_client';
  
  // Rate limiting
  rate_limited: boolean;
}

/**
 * Anti-populism safeguards
 */
export interface AntiPopulismGuard {
  prevents: {
    simplification: true;
    slogans: true;
    blame_assignment: true;
    outcome_judgment: true;
  };
  
  shows_only: {
    structure: true;
    context: true;
    responsibility: true;
    process: true;
  };
  
  never_answers: string[]; // "Who was wrong?", "Was this good?", etc.
}
