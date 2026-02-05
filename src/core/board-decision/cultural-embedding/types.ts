/**
 * CULTURAL EMBEDDING & GENERATIONAL TRANSFER — TYPES
 * 
 * When decision responsibility becomes craft — not personality.
 * The system teaches HOW to think, not WHAT to think.
 */

/**
 * Decision Literacy — the new basic competency
 */
export interface DecisionLiteracy {
  competency_id: string;
  
  // The five core skills
  skills: {
    read_context: SkillLevel;
    identify_alternatives: SkillLevel;
    understand_uncertainty: SkillLevel;
    see_irreversibility: SkillLevel;
    understand_retrospective_review: SkillLevel;
  };
  
  // Exposure tracking
  exposure: {
    decisions_observed: number;
    dpds_reviewed: number;
    pdrcs_studied: number;
    crisis_decisions_observed: number;
  };
  
  // No certifications. No diplomas. Just exposure over time.
  certification: null;
}

export type SkillLevel = 'unexposed' | 'observing' | 'practicing' | 'fluent';

/**
 * Read-only Learning Mode
 * For new board members, executives, politicians
 */
export interface LearningModeSession {
  session_id: string;
  learner_id: string;
  
  started_at: string;
  
  // What they can do
  permissions: {
    can_read_dpd: true;
    can_read_agenda: true;
    can_read_protocol: true;
    can_read_dcs: true;
    can_read_pdrc: true;
    can_make_decisions: false;
    can_modify_anything: false;
  };
  
  // What they've studied
  materials_reviewed: Array<{
    type: 'dpd' | 'agenda' | 'protocol' | 'dcs' | 'pdrc';
    document_id: string;
    reviewed_at: string;
    time_spent_minutes: number;
  }>;
  
  // Practice without power
  mode: 'observation_only';
}

/**
 * Mental Model Export Tracking
 * How the system spreads between people
 */
export interface MentalModelSpread {
  organization_id: string;
  
  // Indicators of cultural adoption
  adoption_signals: {
    members_expecting_dpd: number;
    meetings_with_context: number;
    decisions_with_followup: number;
    informal_references_to_standard: number;
  };
  
  // Where former members went
  export_tracking: Array<{
    former_member_id: string;
    left_at: string;
    new_organization?: string;
    carried_practices: string[];
  }>;
  
  // System spreads between people, not via sales
  marketing_activity: 0;
}

/**
 * Generation Handover Mode
 * Showing new generations how previous ones thought
 */
export interface GenerationHandover {
  handover_id: string;
  organization_id: string;
  
  // Generation markers
  generations: Array<{
    generation_id: string;
    label: string; // e.g., "Founding board", "2020-2025 leadership"
    period_start: string;
    period_end?: string;
    key_decisions: string[];
  }>;
  
  // What new generations can see
  visibility: {
    how_they_thought: boolean;
    what_they_knew: boolean;
    what_they_could_not_know: boolean;
    what_went_wrong_and_why: boolean;
  };
  
  // Prevents
  prevents: {
    cynicism: boolean;
    historical_amnesia: boolean;
    hubris: boolean;
  };
}

/**
 * Cultural Decay Detection
 * When someone tries to bypass the system
 */
export interface CulturalDecaySignal {
  signal_id: string;
  detected_at: string;
  
  signal_type: 
    | 'context_skipped'
    | 'quick_decision_requested'
    | 'uncertainty_bypassed'
    | 'followup_dismissed'
    | 'dpd_considered_bureaucracy';
  
  // Response: Not forbidden. Professionally embarrassing.
  response: 'social_friction';
  
  // The strongest protection
  mechanism: 'peer_expectation';
}

/**
 * Organizational Culture State
 */
export interface OrganizationalCultureState {
  organization_id: string;
  assessed_at: string;
  
  // How decisions are described
  decision_language: {
    says_how_we_do_things: boolean;
    says_how_we_decide: boolean; // Target state
  };
  
  // What feels wrong
  social_norms: {
    decisions_without_context_feel_unprofessional: boolean;
    decisions_without_followup_feel_incomplete: boolean;
    uncertainty_denial_feels_dishonest: boolean;
  };
  
  // Maturity
  maturity_level: 'nascent' | 'adopting' | 'embedded' | 'self_reinforcing';
}
