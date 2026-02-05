/**
 * PROTOCOL BINDING — POST-DECISION ACCOUNTABILITY
 * 
 * Connects Decision Preparation Documents to board meeting minutes.
 * Creates immutable audit trail without moral judgment.
 */

import type { PostDecisionLock } from './types';

/**
 * Protocol binding record
 */
export interface ProtocolBinding {
  binding_id: string;
  dpd_id: string;
  protocol_reference: string;
  meeting_date: string;
  decision_taken: string;
  voting_record: VotingRecord | null;
  context_snapshot_locked: true;
  locked_at: string;
  locked_by: string;
}

/**
 * Voting record (optional, for transparency)
 */
export interface VotingRecord {
  for: number;
  against: number;
  abstain: number;
  total_eligible: number;
  quorum_met: boolean;
}

/**
 * Creates a protocol binding that links a DPD to meeting minutes
 */
export function createProtocolBinding(
  dpdId: string,
  protocolReference: string,
  meetingDate: string,
  decisionTaken: string,
  lockedBy: string,
  votingRecord?: VotingRecord
): ProtocolBinding {
  return {
    binding_id: `pb_${dpdId}_${Date.now()}`,
    dpd_id: dpdId,
    protocol_reference: protocolReference,
    meeting_date: meetingDate,
    decision_taken: decisionTaken,
    voting_record: votingRecord ?? null,
    context_snapshot_locked: true,
    locked_at: new Date().toISOString(),
    locked_by: lockedBy,
  };
}

/**
 * Validates that a decision matches a valid alternative in the DPD
 */
export function validateDecisionAgainstDPD(
  decisionTaken: string,
  validAlternatives: string[]
): { valid: boolean; message: string } {
  const isValid = validAlternatives.includes(decisionTaken);
  
  return {
    valid: isValid,
    message: isValid
      ? `Decision "${decisionTaken}" matches registered alternative`
      : `Decision "${decisionTaken}" not found in DPD alternatives: ${validAlternatives.join(', ')}`,
  };
}

/**
 * Example: BRF protocol binding
 */
export const BRF_PROTOCOL_BINDING_EXAMPLE: ProtocolBinding = {
  binding_id: 'pb_brf_roof_2026_v1_1716192000000',
  dpd_id: 'brf_roof_2026_v1',
  protocol_reference: 'Protokoll styrelsemöte 2026-05-20 §12',
  meeting_date: '2026-05-20',
  decision_taken: 'B',
  voting_record: {
    for: 4,
    against: 1,
    abstain: 0,
    total_eligible: 5,
    quorum_met: true,
  },
  context_snapshot_locked: true,
  locked_at: '2026-05-20T16:45:00Z',
  locked_by: 'board_secretary',
};
