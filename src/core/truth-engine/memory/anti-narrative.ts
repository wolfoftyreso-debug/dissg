/**
 * ANTI-NARRATIVE PROTECTION
 * 
 * CML stores:
 * - What was said
 * - What was data
 * - What was uncertain
 * - What changed later
 * 
 * So that no one can:
 * - Rewrite history
 * - Cherry-pick
 * - Pretend "no one knew"
 * 
 * This is extremely powerful.
 */

/**
 * NARRATIVE PROTECTION LOG
 */
export interface NarrativeProtectionLog {
  readonly log_id: string;
  readonly entity_type: 'indicator' | 'claim' | 'decision' | 'index';
  readonly entity_id: string;
  readonly timeline: NarrativeEvent[];
}

/**
 * NARRATIVE EVENT
 */
export interface NarrativeEvent {
  readonly event_id: string;
  readonly timestamp: string;
  readonly event_type: NarrativeEventType;
  readonly description: string;
  readonly evidence: NarrativeEvidence;
  readonly prior_state?: string;
  readonly new_state?: string;
}

export type NarrativeEventType =
  | 'statement_made'      // A claim was recorded
  | 'data_published'      // Data was made available
  | 'uncertainty_flagged' // Uncertainty was documented
  | 'definition_changed'  // Methodology or definition changed
  | 'correction_issued'   // Previous statement corrected
  | 'data_revised'        // Data values were revised
  | 'claim_challenged'    // External challenge to a claim
  | 'claim_confirmed'     // External confirmation of a claim
  | 'gap_identified'      // Knowledge gap documented
  | 'gap_filled';         // Knowledge gap resolved

/**
 * NARRATIVE EVIDENCE
 */
export interface NarrativeEvidence {
  readonly type: 'artifact' | 'external_source' | 'system_log' | 'audit_trail';
  readonly reference_id: string;
  readonly checksum: string;
  readonly retrievable: boolean;
}

/**
 * ANTI-REWRITE CHECK
 * Detects attempts to rewrite history
 */
export interface RewriteAttempt {
  readonly detected_at: string;
  readonly entity_id: string;
  readonly original_statement: string;
  readonly attempted_change: string;
  readonly blocked: boolean;
  readonly reason: string;
}

/**
 * CREATE NARRATIVE PROTECTION LOG
 */
export function createNarrativeProtectionLog(
  entity_type: NarrativeProtectionLog['entity_type'],
  entity_id: string
): NarrativeProtectionLog {
  return {
    log_id: `npl_${entity_id}_${Date.now()}`,
    entity_type,
    entity_id,
    timeline: [],
  };
}

/**
 * ADD NARRATIVE EVENT
 */
export function addNarrativeEvent(
  log: NarrativeProtectionLog,
  event: Omit<NarrativeEvent, 'event_id' | 'timestamp'>
): NarrativeProtectionLog {
  const newEvent: NarrativeEvent = {
    ...event,
    event_id: `ne_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  return {
    ...log,
    timeline: [...log.timeline, newEvent],
  };
}

/**
 * CHECK FOR REWRITE ATTEMPT
 */
export function checkRewriteAttempt(
  log: NarrativeProtectionLog,
  proposedChange: { statement: string; new_value: string }
): RewriteAttempt | null {
  // Find if this statement was previously made
  const originalEvent = log.timeline.find(
    e => e.event_type === 'statement_made' && e.description.includes(proposedChange.statement)
  );
  
  if (!originalEvent) {
    return null; // No rewrite, this is a new statement
  }
  
  // This is an attempt to change a recorded statement
  return {
    detected_at: new Date().toISOString(),
    entity_id: log.entity_id,
    original_statement: originalEvent.description,
    attempted_change: proposedChange.new_value,
    blocked: true,
    reason: 'Cannot modify historical record. Use correction_issued event instead.',
  };
}

/**
 * GENERATE HISTORICAL PROOF
 * Creates evidence of what was known at a specific time
 */
export interface HistoricalProof {
  readonly proof_id: string;
  readonly generated_at: string;
  readonly query_point: string; // The date being queried
  readonly entity_id: string;
  readonly what_was_known: string[];
  readonly what_was_uncertain: string[];
  readonly what_was_unknown: string[];
  readonly sources_available: string[];
  readonly methodology_in_use: string;
  readonly checksum: string;
}

export function generateHistoricalProof(
  log: NarrativeProtectionLog,
  queryDate: Date
): HistoricalProof {
  const queryPoint = queryDate.toISOString();
  
  // Filter events up to query date
  const relevantEvents = log.timeline.filter(
    e => new Date(e.timestamp) <= queryDate
  );
  
  // Extract what was known
  const known = relevantEvents
    .filter(e => e.event_type === 'statement_made' || e.event_type === 'data_published')
    .map(e => e.description);
  
  const uncertain = relevantEvents
    .filter(e => e.event_type === 'uncertainty_flagged')
    .map(e => e.description);
  
  const unknown = relevantEvents
    .filter(e => e.event_type === 'gap_identified')
    .filter(e => !relevantEvents.some(
      f => f.event_type === 'gap_filled' && 
           f.prior_state === e.description &&
           new Date(f.timestamp) <= queryDate
    ))
    .map(e => e.description);
  
  const content = JSON.stringify({ known, uncertain, unknown });
  const checksum = simpleHash(content);
  
  return {
    proof_id: `hp_${log.entity_id}_${Date.now()}`,
    generated_at: new Date().toISOString(),
    query_point: queryPoint,
    entity_id: log.entity_id,
    what_was_known: known,
    what_was_uncertain: uncertain,
    what_was_unknown: unknown,
    sources_available: relevantEvents
      .filter(e => e.evidence.type === 'external_source')
      .map(e => e.evidence.reference_id),
    methodology_in_use: relevantEvents
      .filter(e => e.event_type === 'definition_changed')
      .slice(-1)[0]?.new_state || 'original',
    checksum,
  };
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
