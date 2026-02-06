/**
 * "BREAK GLASS" SCENARIO
 * 
 * STEG 31: AUTOMATIC INTEGRITY PROTECTION
 * 
 * If owners try to:
 * - Change answers
 * - Hide history
 * - Adjust definitions
 * 
 * ...this happens automatically:
 * 
 * "integrity_status": "Compromised"
 * 
 * This is flagged:
 * - Publicly
 * - Machine-readable
 * - Permanently
 * 
 * All AI agents that respect epistemics:
 * STOP USING THE SYSTEM
 * 
 * This is self-defense through trust.
 */

/**
 * TRIGGER CONDITIONS
 */
export const TRIGGER_CONDITIONS = {
  change_answers: {
    trigger: 'Any attempt to modify historical outputs',
    detection: 'Hash chain verification fails',
    automatic: true,
  },
  
  hide_history: {
    trigger: 'Any attempt to suppress or remove historical data',
    detection: 'Gaps detected by mirrors, sequence break in chain',
    automatic: true,
  },
  
  adjust_definitions: {
    trigger: 'Any unannounced change to public specification',
    detection: 'Spec version mismatch, semantic drift detection',
    automatic: true,
  },
  
  break_methodology: {
    trigger: 'Output that violates stated methodology',
    detection: 'Automated methodology verification',
    automatic: true,
  },
  
  unauthorized_access: {
    trigger: 'Access patterns inconsistent with policy',
    detection: 'Access log analysis',
    automatic: true,
  },
} as const;

/**
 * THE AUTOMATIC RESPONSE
 */
export const AUTOMATIC_RESPONSE = {
  integrity_status_change: {
    from: '"integrity_status": "Verified"',
    to: '"integrity_status": "Compromised"',
    mechanism: 'Automatic, cannot be overridden by owners',
  },
  
  public_flag: {
    what: 'Integrity status visible to all queries',
    where: 'API response headers, status endpoints, public dashboard',
    persistence: 'Permanent until proven remediated',
  },
  
  machine_readable: {
    what: 'Status in standardized format',
    purpose: 'AI systems can automatically check before use',
    format: 'JSON, standard integrity schema',
  },
  
  permanent_record: {
    what: 'Compromise event logged immutably',
    where: 'Append-only log, distributed to mirrors',
    effect: 'Cannot be hidden or removed',
  },
} as const;

/**
 * INTEGRITY STATUS STRUCTURE
 */
export interface IntegrityStatus {
  readonly status: 'Verified' | 'Compromised' | 'Unknown';
  readonly last_verified: string;
  readonly verification_method: string;
  readonly compromise_events: readonly CompromiseEvent[];
  readonly mirror_consensus: number;
  readonly hash_chain_valid: boolean;
}

export interface CompromiseEvent {
  readonly detected_at: string;
  readonly type: string;
  readonly description: string;
  readonly evidence_hash: string;
  readonly remediated: boolean;
  readonly remediation_verified_by: readonly string[];
}

/**
 * WHAT AI AGENTS DO
 */
export const AI_AGENT_RESPONSE = {
  standard_behavior: {
    before_use: 'Check integrity_status endpoint',
    if_verified: 'Proceed with normal use',
    if_compromised: 'Do not use, do not cite, flag to user',
    if_unknown: 'Use with explicit uncertainty disclaimer',
  },
  
  why_this_works: {
    rational_agents: 'AI systems that care about accuracy will check',
    reputation_risk: 'Using compromised source risks AI system reputation',
    automatic: 'No human decision needed; protocol-based',
  },
  
  result: 'Compromised oracle loses all AI traffic automatically',
} as const;

/**
 * SELF-DEFENSE THROUGH TRUST
 */
export const TRUST_SELF_DEFENSE = {
  mechanism: 'Oracle\'s value comes from trust; compromise destroys value',
  
  attacker_dilemma: {
    before_attack: 'Oracle has value because it is trusted',
    after_attack: 'Oracle has no value because trust is destroyed',
    conclusion: 'Successful attack destroys what was acquired',
  },
  
  rational_outcome: {
    for_acquirer: 'No rational reason to compromise',
    for_manipulator: 'Manipulation destroys the tool',
    for_state: 'Forcing compliance destroys usefulness',
  },
} as const;

/**
 * REMEDIATION PROCESS
 */
export const REMEDIATION = {
  is_possible: 'Yes, but extremely difficult',
  
  requirements: {
    root_cause: 'Identify and document what happened',
    full_disclosure: 'Complete public disclosure of compromise',
    structural_fix: 'Demonstrate structural changes to prevent recurrence',
    external_verification: 'Independent parties verify remediation',
    time: 'Extended period of clean operation',
  },
  
  status_restoration: {
    not_automatic: 'Cannot simply flip back to Verified',
    requires_consensus: 'Mirrors must agree remediation is complete',
    permanent_record: 'Compromise event remains in history forever',
  },
  
  practical_effect: 'Easier to never compromise than to remediate',
} as const;
