/**
 * ANTI-CORRUPTION & DEGRADATION LAYER — TYPES
 * 
 * How good systems don't slowly become bad.
 * All great systems die not from attacks — but from small, reasonable exceptions.
 */

/**
 * Decision Drift Detection signal
 */
export interface DriftSignal {
  signal_id: string;
  drift_type: DriftType;
  trend: 'increasing' | 'stable' | 'decreasing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affected_period: string;
  
  // Metrics
  baseline_value: number;
  current_value: number;
  change_percent: number;
  
  // No blame
  attribution: null;
  detected_at: string;
}

export type DriftType =
  | 'uncertainty_compression'    // Less uncertainty documented over time
  | 'alternative_reduction'      // Fewer alternatives considered
  | 'context_shrinking'          // Shorter context descriptions
  | 'legibility_decline'         // Lower DLS scores
  | 'review_avoidance'           // Fewer post-decision reviews
  | 'template_decay'             // More copy-paste, less original content
  | 'speed_prioritization';      // Faster decisions without quality increase

/**
 * Silent Erosion Alert (internal only)
 */
export interface SilentErosionAlert {
  alert_id: string;
  
  // Comparison is to own history, not external standard
  message: string;
  comparison_period: string;
  
  // Never public
  visibility: 'internal_only';
  
  // No red warnings
  severity_display: 'neutral';
  
  // Suggested reflection
  reflection_prompt: string;
}

/**
 * Good Intentions phrases that require structure
 */
export interface GoodIntentionsViolation {
  phrase_detected: string;
  phrase_category: 'obviousness' | 'precedent' | 'consensus' | 'no_alternatives';
  
  // Not censorship — structure requirement
  required_structure: string;
  
  blocked: false; // Never blocked, just flagged
  structure_provided: boolean;
}

/**
 * Template decay detection
 */
export interface TemplateDecaySignal {
  document_id: string;
  document_type: 'dpd' | 'agenda' | 'protocol' | 'dcs';
  
  // Decay indicators
  empty_fields: string[];
  copy_paste_detected: boolean;
  copy_paste_source?: string;
  reused_formulations: Array<{
    text: string;
    original_document_id: string;
    original_date: string;
  }>;
  
  // Decay score (0 = fresh, 1 = complete copy)
  decay_score: number;
}

/**
 * Rotation context for new members
 */
export interface RotationContext {
  new_member_id: string;
  role: string;
  start_date: string;
  
  // Cannot start fresh
  visible_history: {
    decisions_count: number;
    time_span: string;
    drift_indicators: DriftSignal[];
    patterns: string[];
  };
  
  // No amnesia
  amnesia_possible: false;
}

/**
 * Hero Mode violation
 */
export interface HeroModeViolation {
  violation_id: string;
  detected_at: string;
  
  // What was detected
  hero_pattern: 'genius_attribution' | 'person_centered' | 'trust_based';
  problematic_text: string;
  
  // Required reduction
  required_structure: {
    context: true;
    alternatives: true;
    uncertainty: true;
    choice: true;
  };
}

/**
 * System Health Metrics
 */
export interface SystemHealthMetrics {
  measured_at: string;
  period: string;
  
  // Vital parameters
  average_decision_legibility: number;
  high_impact_coverage_percent: number;
  review_completion_rate: number;
  drift_frequency: number;
  
  // Trends
  trends: {
    legibility: 'improving' | 'stable' | 'declining';
    coverage: 'improving' | 'stable' | 'declining';
    review_rate: 'improving' | 'stable' | 'declining';
    drift: 'improving' | 'stable' | 'worsening';
  };
  
  // Overall health
  system_health: 'healthy' | 'attention_needed' | 'intervention_required';
}
