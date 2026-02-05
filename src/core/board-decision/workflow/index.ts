/**
 * BOARD DECISION WORKFLOW — INDEX
 * 
 * End-to-end automation: DPD → Agenda → Protocol → Lock → PDRC
 */

// Types
export type {
  WorkflowRole,
  RolePermissions,
  MeetingPack,
  DataAppendix,
  UncertaintyOverview,
  BoardProtocol,
  ProtocolAttendance,
  ProtocolItem,
  VoteResult,
  Reservation,
  ProtocolSignature,
  DecisionContextSnapshot,
  ScheduledReview,
  WorkflowState,
  WorkflowStage,
  AuditEntry,
  AuditExport,
} from './types';

export { ROLE_PERMISSIONS } from './types';

// Meeting Pack Generator
export {
  generateMeetingPack,
  lockMeetingPack,
  validateMeetingPack,
  MEETING_PACK_MASTERPROMPT,
} from './meeting-pack-generator';

// Protocol Generator
export {
  createProtocol,
  addProtocolItem,
  recordVote,
  addReservation,
  signProtocol,
  lockProtocol,
  validateProtocol,
  PROTOCOL_GENERATOR_MASTERPROMPT,
} from './protocol-generator';

// Context Snapshot
export {
  createContextSnapshot,
  verifySnapshotIntegrity,
  scheduleReview,
  compareSnapshotToCurrentState,
} from './context-snapshot';

// Orchestrator
export {
  initializeWorkflow,
  attachDPD,
  generateWorkflowAgenda,
  generateWorkflowMeetingPack,
  startMeeting,
  finalizeProtocol,
  exportAuditTrail,
  ORCHESTRATOR_MASTERPROMPT,
} from './orchestrator';

// Utilities
export {
  generateChecksum,
  validatePermission,
  formatDate,
  formatTimestamp,
  generateId,
} from './utils';
