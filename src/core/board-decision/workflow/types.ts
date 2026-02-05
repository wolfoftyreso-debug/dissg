/**
 * BOARD DECISION WORKFLOW — TYPES
 * 
 * End-to-end automation types for DPD → Agenda → Protocol → Lock → PDRC
 */

import type { DecisionPreparationDocument } from '../types';
import type { BoardAgenda } from '../agenda-generator';
import type { RealityCheckResult } from '../reality-check';

/**
 * Workflow roles with friction levels
 */
export type WorkflowRole = 
  | 'secretary'      // Can initiate cases
  | 'chair'          // Can lock agenda
  | 'board_member'   // Can vote
  | 'system'         // Can lock context (automatic)
  | 'auditor';       // Read-only access

/**
 * Role permissions matrix
 */
export interface RolePermissions {
  can_initiate_case: boolean;
  can_edit_dpd: boolean;
  can_lock_agenda: boolean;
  can_vote: boolean;
  can_sign_protocol: boolean;
  can_lock_context: boolean;
  can_modify_history: boolean; // Always false
  can_export: boolean;
}

export const ROLE_PERMISSIONS: Record<WorkflowRole, RolePermissions> = {
  secretary: {
    can_initiate_case: true,
    can_edit_dpd: true,
    can_lock_agenda: false,
    can_vote: false,
    can_sign_protocol: true,
    can_lock_context: false,
    can_modify_history: false,
    can_export: true,
  },
  chair: {
    can_initiate_case: true,
    can_edit_dpd: true,
    can_lock_agenda: true,
    can_vote: true,
    can_sign_protocol: true,
    can_lock_context: false,
    can_modify_history: false,
    can_export: true,
  },
  board_member: {
    can_initiate_case: false,
    can_edit_dpd: false,
    can_lock_agenda: false,
    can_vote: true,
    can_sign_protocol: false,
    can_lock_context: false,
    can_modify_history: false,
    can_export: true,
  },
  system: {
    can_initiate_case: false,
    can_edit_dpd: false,
    can_lock_agenda: false,
    can_vote: false,
    can_sign_protocol: false,
    can_lock_context: true,
    can_modify_history: false,
    can_export: true,
  },
  auditor: {
    can_initiate_case: false,
    can_edit_dpd: false,
    can_lock_agenda: false,
    can_vote: false,
    can_sign_protocol: false,
    can_lock_context: false,
    can_modify_history: false,
    can_export: true,
  },
};

/**
 * Meeting pack - sent to board before meeting
 */
export interface MeetingPack {
  pack_id: string;
  generated_at: string;
  meeting_date: string;
  
  dpd: DecisionPreparationDocument;
  agenda: BoardAgenda;
  
  data_appendix: DataAppendix;
  uncertainty_overview: UncertaintyOverview;
  limitations: string[];
  
  locked: boolean;
  checksum: string;
}

export interface DataAppendix {
  sources: Array<{
    source_id: string;
    name: string;
    last_updated: string;
    version: string;
  }>;
  indexes: Array<{
    index_id: string;
    name: string;
    value: number;
    trend: string;
  }>;
}

export interface UncertaintyOverview {
  known_count: number;
  uncertain_count: number;
  unknown_count: number;
  highest_uncertainty_dimensions: string[];
  data_gaps: string[];
}

/**
 * Board protocol - structured, not narrative
 */
export interface BoardProtocol {
  protocol_id: string;
  meeting_date: string;
  meeting_type: 'board_meeting' | 'annual_meeting' | 'extraordinary';
  
  attendance: ProtocolAttendance;
  items: ProtocolItem[];
  
  signatures: ProtocolSignature[];
  context_snapshot_id: string;
  
  locked: boolean;
  locked_at: string | null;
  checksum: string;
}

export interface ProtocolAttendance {
  present: string[];
  absent: string[];
  guests: string[];
}

export interface ProtocolItem {
  item_number: number;
  title: string;
  dpd_id: string | null;
  
  alternatives_considered: string[];
  decision_taken: string | null;
  
  vote_result: VoteResult | null;
  reservations: Reservation[];
  
  notes: null; // Explicitly null - no free text
}

export interface VoteResult {
  for: number;
  against: number;
  abstain: number;
  method: 'show_of_hands' | 'roll_call' | 'secret_ballot';
}

export interface Reservation {
  member: string;
  reason: string; // Structured, not narrative
}

export interface ProtocolSignature {
  role: 'chair' | 'secretary' | 'adjuster';
  name: string;
  signed_at: string | null;
  signature_hash: string | null;
}

/**
 * Decision Context Snapshot - the decision's DNA
 */
export interface DecisionContextSnapshot {
  dcs_id: string;
  created_at: string;
  
  dpd_snapshot: DecisionPreparationDocument;
  dpd_checksum: string;
  
  index_versions: Array<{
    index_id: string;
    version: string;
    value_at_decision: number;
    timestamp: string;
  }>;
  
  signal_timestamps: Array<{
    signal_id: string;
    value: unknown;
    timestamp: string;
  }>;
  
  locked: true; // Always true
  immutable: true; // Always true
}

/**
 * Scheduled PDRC
 */
export interface ScheduledReview {
  review_id: string;
  dcs_id: string;
  dpd_id: string;
  decision_taken: string;
  
  scheduled_date: string;
  reminder_dates: string[];
  
  irreversibility_level: 'low' | 'medium' | 'high' | 'permanent';
  auto_scheduled: boolean;
  
  status: 'pending' | 'completed' | 'overdue';
  result: RealityCheckResult | null;
}

/**
 * Full workflow state
 */
export interface WorkflowState {
  workflow_id: string;
  created_at: string;
  
  stage: WorkflowStage;
  
  dpd: DecisionPreparationDocument | null;
  agenda: BoardAgenda | null;
  meeting_pack: MeetingPack | null;
  protocol: BoardProtocol | null;
  context_snapshot: DecisionContextSnapshot | null;
  scheduled_review: ScheduledReview | null;
  
  audit_log: AuditEntry[];
}

export type WorkflowStage = 
  | 'case_initiated'
  | 'dpd_generated'
  | 'agenda_created'
  | 'meeting_pack_sent'
  | 'meeting_in_progress'
  | 'protocol_drafted'
  | 'protocol_signed'
  | 'context_locked'
  | 'review_scheduled'
  | 'completed';

export interface AuditEntry {
  timestamp: string;
  action: string;
  actor: string;
  role: WorkflowRole;
  details: Record<string, unknown>;
  checksum: string;
}

/**
 * Audit export format
 */
export interface AuditExport {
  export_id: string;
  exported_at: string;
  workflow_id: string;
  
  dpd: DecisionPreparationDocument;
  agenda: BoardAgenda;
  protocol: BoardProtocol;
  context_snapshot: DecisionContextSnapshot;
  reality_check: RealityCheckResult | null;
  
  audit_log: AuditEntry[];
  
  // No interpretation, no defense
  disclaimers: string[];
}
