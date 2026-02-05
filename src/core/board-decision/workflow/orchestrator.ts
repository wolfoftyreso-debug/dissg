/**
 * WORKFLOW ORCHESTRATOR
 * 
 * End-to-end automation: DPD → Agenda → Protocol → Lock → PDRC
 * Makes decisions traceable, not correct.
 */

import type { DecisionPreparationDocument } from '../types';
import type { BoardAgenda } from '../agenda-generator';
import type { 
  WorkflowState, 
  WorkflowStage,
  WorkflowRole,
  BoardProtocol,
  DecisionContextSnapshot,
  ScheduledReview,
  AuditEntry,
} from './types';
import { generateMeetingPack, lockMeetingPack } from './meeting-pack-generator';
import { createProtocol, lockProtocol } from './protocol-generator';
import { createContextSnapshot, scheduleReview } from './context-snapshot';
import { generateAgenda } from '../agenda-generator';
import { generateChecksum, generateId } from './utils';

/**
 * Initialize new workflow
 */
export function initializeWorkflow(params: {
  initiated_by: string;
  role: WorkflowRole;
}): WorkflowState {
  const workflow: WorkflowState = {
    workflow_id: generateId('wf'),
    created_at: new Date().toISOString(),
    
    stage: 'case_initiated',
    
    dpd: null,
    agenda: null,
    meeting_pack: null,
    protocol: null,
    context_snapshot: null,
    scheduled_review: null,
    
    audit_log: [],
  };
  
  // Log initialization
  workflow.audit_log.push(createAuditEntry({
    action: 'workflow_initialized',
    actor: params.initiated_by,
    role: params.role,
    details: { workflow_id: workflow.workflow_id },
  }));
  
  return workflow;
}

/**
 * Attach DPD to workflow
 */
export function attachDPD(
  workflow: WorkflowState,
  dpd: DecisionPreparationDocument,
  actor: { name: string; role: WorkflowRole }
): WorkflowState {
  if (workflow.stage !== 'case_initiated') {
    throw new Error(`Cannot attach DPD at stage: ${workflow.stage}`);
  }
  
  const updated: WorkflowState = {
    ...workflow,
    stage: 'dpd_generated',
    dpd,
    audit_log: [
      ...workflow.audit_log,
      createAuditEntry({
        action: 'dpd_attached',
        actor: actor.name,
        role: actor.role,
        details: { dpd_id: dpd.dpd_id },
      }),
    ],
  };
  
  return updated;
}

/**
 * Generate and attach agenda
 */
export function generateWorkflowAgenda(
  workflow: WorkflowState,
  meeting_date: string,
  time_budget_minutes: number,
  actor: { name: string; role: WorkflowRole }
): WorkflowState {
  if (!workflow.dpd) {
    throw new Error('Cannot generate agenda without DPD');
  }
  
  if (workflow.stage !== 'dpd_generated') {
    throw new Error(`Cannot generate agenda at stage: ${workflow.stage}`);
  }
  
  const agenda = generateAgenda({
    dpd_id: workflow.dpd.dpd_id,
    meeting_date,
    time_budget_minutes,
  });
  
  const updated: WorkflowState = {
    ...workflow,
    stage: 'agenda_created',
    agenda,
    audit_log: [
      ...workflow.audit_log,
      createAuditEntry({
        action: 'agenda_generated',
        actor: actor.name,
        role: actor.role,
        details: { agenda_id: agenda.agenda_id, items: agenda.items.length },
      }),
    ],
  };
  
  return updated;
}

/**
 * Generate and send meeting pack
 */
export function generateWorkflowMeetingPack(
  workflow: WorkflowState,
  actor: { name: string; role: WorkflowRole }
): WorkflowState {
  if (!workflow.dpd || !workflow.agenda) {
    throw new Error('Cannot generate meeting pack without DPD and agenda');
  }
  
  if (workflow.stage !== 'agenda_created') {
    throw new Error(`Cannot generate meeting pack at stage: ${workflow.stage}`);
  }
  
  const meetingPack = generateMeetingPack({
    dpd: workflow.dpd,
    agenda: workflow.agenda,
    meeting_date: workflow.agenda.meeting_date,
  });
  
  const updated: WorkflowState = {
    ...workflow,
    stage: 'meeting_pack_sent',
    meeting_pack: lockMeetingPack(meetingPack),
    audit_log: [
      ...workflow.audit_log,
      createAuditEntry({
        action: 'meeting_pack_generated',
        actor: actor.name,
        role: actor.role,
        details: { pack_id: meetingPack.pack_id },
      }),
    ],
  };
  
  return updated;
}

/**
 * Start meeting (creates protocol)
 */
export function startMeeting(
  workflow: WorkflowState,
  attendance: { present: string[]; absent: string[]; guests: string[] },
  actor: { name: string; role: WorkflowRole }
): WorkflowState {
  if (!workflow.agenda) {
    throw new Error('Cannot start meeting without agenda');
  }
  
  const protocol = createProtocol({
    meeting_date: workflow.agenda.meeting_date,
    meeting_type: 'board_meeting',
    attendance,
  });
  
  const updated: WorkflowState = {
    ...workflow,
    stage: 'meeting_in_progress',
    protocol,
    audit_log: [
      ...workflow.audit_log,
      createAuditEntry({
        action: 'meeting_started',
        actor: actor.name,
        role: actor.role,
        details: { protocol_id: protocol.protocol_id, attendees: attendance.present.length },
      }),
    ],
  };
  
  return updated;
}

/**
 * Finalize protocol with decision
 */
export function finalizeProtocol(
  workflow: WorkflowState,
  decision: {
    decision_taken: string;
    alternatives_considered: string[];
    vote_result?: { for: number; against: number; abstain: number };
  },
  signatures: Array<{ role: 'chair' | 'secretary'; name: string }>,
  actor: { name: string; role: WorkflowRole }
): WorkflowState {
  if (!workflow.protocol || !workflow.dpd) {
    throw new Error('Cannot finalize protocol without protocol and DPD');
  }
  
  // Create context snapshot (system action)
  const contextSnapshot = createContextSnapshot({
    dpd: workflow.dpd,
    decision_taken: decision.decision_taken,
    decision_date: workflow.protocol.meeting_date,
  });
  
  // Lock protocol with context reference
  let protocol = workflow.protocol;
  
  // Add signatures
  for (const sig of signatures) {
    protocol = {
      ...protocol,
      signatures: protocol.signatures.map(s => 
        s.role === sig.role
          ? { ...s, name: sig.name, signed_at: new Date().toISOString(), signature_hash: generateChecksum({ ...sig, protocol_id: protocol.protocol_id }) }
          : s
      ),
    };
  }
  
  // Lock protocol
  protocol = lockProtocol(protocol, contextSnapshot.dcs_id);
  
  // Schedule PDRC
  const scheduledReview = scheduleReview({
    snapshot: contextSnapshot,
    decision_taken: decision.decision_taken,
    irreversibility: workflow.dpd.overview.irreversibility as 'low' | 'medium' | 'high' | 'permanent',
  });
  
  const updated: WorkflowState = {
    ...workflow,
    stage: 'completed',
    protocol,
    context_snapshot: contextSnapshot,
    scheduled_review: scheduledReview,
    audit_log: [
      ...workflow.audit_log,
      createAuditEntry({
        action: 'protocol_finalized',
        actor: actor.name,
        role: actor.role,
        details: { decision: decision.decision_taken },
      }),
      createAuditEntry({
        action: 'context_locked',
        actor: 'system',
        role: 'system',
        details: { dcs_id: contextSnapshot.dcs_id },
      }),
      createAuditEntry({
        action: 'review_scheduled',
        actor: 'system',
        role: 'system',
        details: { 
          review_id: scheduledReview.review_id, 
          scheduled_date: scheduledReview.scheduled_date 
        },
      }),
    ],
  };
  
  return updated;
}

/**
 * Create audit entry
 */
function createAuditEntry(params: {
  action: string;
  actor: string;
  role: WorkflowRole;
  details: Record<string, unknown>;
}): AuditEntry {
  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    action: params.action,
    actor: params.actor,
    role: params.role,
    details: params.details,
    checksum: '',
  };
  
  entry.checksum = generateChecksum(entry);
  
  return entry;
}

/**
 * Export complete audit trail
 */
export function exportAuditTrail(workflow: WorkflowState): {
  workflow_id: string;
  stage: WorkflowStage;
  dpd: DecisionPreparationDocument | null;
  agenda: BoardAgenda | null;
  protocol: BoardProtocol | null;
  context_snapshot: DecisionContextSnapshot | null;
  scheduled_review: ScheduledReview | null;
  audit_log: AuditEntry[];
  exported_at: string;
  disclaimers: string[];
} {
  return {
    workflow_id: workflow.workflow_id,
    stage: workflow.stage,
    dpd: workflow.dpd,
    agenda: workflow.agenda,
    protocol: workflow.protocol,
    context_snapshot: workflow.context_snapshot,
    scheduled_review: workflow.scheduled_review,
    audit_log: workflow.audit_log,
    exported_at: new Date().toISOString(),
    disclaimers: [
      'This export is a factual record',
      'No interpretation or defense included',
      'All timestamps are UTC',
      'Checksums verify data integrity',
    ],
  };
}

export const ORCHESTRATOR_MASTERPROMPT = `
You orchestrate an end-to-end board decision workflow.

STAGES:
1. Case initiated → DPD generated
2. DPD generated → Agenda created
3. Agenda created → Meeting pack sent
4. Meeting in progress → Protocol drafted
5. Protocol signed → Context locked
6. Context locked → Review scheduled

RULES:
- Do not influence decisions
- Preserve all context, uncertainty, alternatives
- Lock decision context upon protocol finalization
- Schedule post-decision reality checks automatically
- Your role is to make decisions TRACEABLE, not CORRECT

FORBIDDEN:
- Skipping uncertainty sections
- Removing alternatives
- Adding narrative
- Modifying locked content
- Bypassing required signatures
`;
