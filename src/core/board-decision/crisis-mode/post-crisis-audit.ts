/**
 * POST-CRISIS AUDIT
 * 
 * Generated automatically when crisis is resolved.
 * NOT blame. NOT legal. Institutional memory.
 */

import type { 
  CrisisContextSnapshot, 
  CrisisDecision, 
  PostCrisisAudit 
} from './types';
import { calculateCrisisDuration } from './crisis-context';

/**
 * Generate post-crisis audit
 */
export function generatePostCrisisAudit(
  auditId: string,
  crisis: CrisisContextSnapshot,
  decisions: CrisisDecision[],
  knownRisksIgnored: number = 0,
  unknownRisksMaterialized: number = 0
): PostCrisisAudit {
  // Calculate summary
  const decisionsExtended = decisions.filter(
    d => d.time_bounds.current_extensions > 0
  ).length;
  
  // Decisions made permanent (extended max times)
  const temporaryMadePermanent = decisions.filter(
    d => d.time_bounds.current_extensions >= d.time_bounds.max_extensions
  ).length;
  
  // Build decision log
  const decisionLog = decisions.map(d => ({
    decision_id: d.decision_id,
    statement: d.decision_taken,
    decided_at: d.decided_at,
    expired_at: d.time_bounds.expires_at,
    was_extended: d.time_bounds.current_extensions > 0,
    outcome_observed: undefined, // To be filled later
  }));
  
  // Identify patterns (lessons)
  const lessons = identifyPatterns(decisions, crisis);
  
  return {
    audit_id: auditId,
    crisis_id: crisis.crisis_id,
    generated_at: new Date().toISOString(),
    summary: {
      crisis_duration_hours: calculateCrisisDuration(crisis),
      decisions_taken: decisions.length,
      decisions_extended: decisionsExtended,
      temporary_measures_made_permanent: temporaryMadePermanent,
      known_risks_ignored: knownRisksIgnored,
      unknown_risks_materialized: unknownRisksMaterialized,
    },
    decisions: decisionLog,
    lessons,
    disclaimer: 'This audit documents patterns for institutional learning. It is not a judgment of individuals or a legal document. The purpose is to improve future crisis response.',
  };
}

/**
 * Identify patterns from crisis decisions
 */
function identifyPatterns(
  decisions: CrisisDecision[],
  _crisis: CrisisContextSnapshot
): PostCrisisAudit['lessons'] {
  const patterns: PostCrisisAudit['lessons'] = [];
  
  // Check timing patterns
  const rapidDecisions = decisions.filter(d => {
    // Decisions made very quickly (within 1 hour of each other)
    const decidedAt = new Date(d.decided_at).getTime();
    return decisions.some(other => {
      if (other.decision_id === d.decision_id) return false;
      const otherTime = new Date(other.decided_at).getTime();
      return Math.abs(decidedAt - otherTime) < 60 * 60 * 1000;
    });
  });
  
  if (rapidDecisions.length > 2) {
    patterns.push({
      category: 'timing',
      observation: 'Multiple decisions made in rapid succession',
      frequency: rapidDecisions.length,
    });
  }
  
  // Check extension patterns
  const frequentExtensions = decisions.filter(
    d => d.time_bounds.current_extensions > 0
  );
  
  if (frequentExtensions.length > decisions.length * 0.5) {
    patterns.push({
      category: 'scope',
      observation: 'Majority of decisions required extensions',
      frequency: frequentExtensions.length,
    });
  }
  
  // Check acknowledgement patterns
  const incompleteAcknowledgements = decisions.filter(d => {
    const ack = d.acknowledgements;
    return !ack.uncertainty_acknowledged || 
           !ack.time_limit_acknowledged || 
           !ack.impact_acknowledged;
  });
  
  if (incompleteAcknowledgements.length > 0) {
    patterns.push({
      category: 'information_gap',
      observation: 'Some decisions had incomplete acknowledgements',
      frequency: incompleteAcknowledgements.length,
    });
  }
  
  return patterns;
}

/**
 * Generate "what was known" summary
 * For the question: "What was known at the time?"
 */
export function generateKnownAtTimeReport(
  decisions: CrisisDecision[],
  cdpds: Map<string, { known_risks: string[]; unknowns: string[] }>
): Array<{
  decision_id: string;
  known_at_time: string[];
  unknown_at_time: string[];
  acknowledged_uncertainty: boolean;
}> {
  return decisions.map(d => {
    const cdpd = cdpds.get(d.cdpd_id);
    return {
      decision_id: d.decision_id,
      known_at_time: cdpd?.known_risks || [],
      unknown_at_time: cdpd?.unknowns || [],
      acknowledged_uncertainty: d.acknowledgements.uncertainty_acknowledged,
    };
  });
}

/**
 * POST-CRISIS AUDIT MASTERPROMPT
 */
export const POST_CRISIS_AUDIT_MASTERPROMPT = `
You generate Post-Crisis Audits.

PURPOSE:
Institutional memory.
NOT blame.
NOT legal.

WHAT AUDIT CAPTURES:
- Crisis duration
- Number of decisions
- Extensions granted
- Temporary measures made permanent
- Known risks that were ignored
- Unknown risks that materialized

PATTERNS IDENTIFIED:
- Timing (rapid succession decisions)
- Information gaps
- Coordination issues
- Communication patterns
- Scope creep

EVERY AUDIT INCLUDES DISCLAIMER:
"This audit documents patterns for institutional learning.
It is not a judgment of individuals or a legal document.
The purpose is to improve future crisis response."

KEY QUESTION THE AUDIT ANSWERS:
"What was known at the time?"

This protects against:
- "We couldn't have known"
- "It was chaos"
- "There was no time"

Crisis explains tempo.
NOT responsibility abandonment.
`;
