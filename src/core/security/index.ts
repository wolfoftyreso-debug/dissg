/**
 * SYSTEM HARDENING & SECURITY v1
 * 
 * Defense-in-depth for decision truth.
 * 
 * Protects against:
 * 1. Data manipulation
 * 2. Semantic corruption
 * 3. API misuse
 * 4. AI hallucination
 * 5. Insider risk
 * 6. External pressure
 * 
 * "This holds for 50 years because it protects against both technology and humans."
 */

// Types
export type {
  ThreatCategory,
  Threat,
  HashableEvent,
  MerkleRoot,
  SystemRole,
  RolePermissions,
  OntologyVersion,
  OntologyChangeRequest,
  AIAllowedAction,
  AIForbiddenAction,
  AgentRateLimit,
  ForbiddenPhrase,
  AuditEvent,
  TamperAlert,
  DisasterMode,
  DisasterResponse,
  RedTeamTest,
  ValidationGate,
  WriteAttempt,
} from './types';

// Threat Model
export {
  THREATS,
  IGNORED_THREATS,
  getThreatsByCategory,
  getCriticalThreats,
  getAllMitigations,
} from './threat-model';

// Cryptographic Integrity
export {
  hashEvent,
  computeHash,
  verifyChain,
  computeMerkleRoot,
  createMerkleRoot,
  MERKLE_PUBLICATION_TARGETS,
  validateEventChain,
  type ChainValidationResult,
} from './crypto-integrity';

// Role Separation
export {
  ROLE_PERMISSIONS,
  canRead,
  canWrite,
  canLock,
  canChangeOntology,
  validateAction,
  NO_ADMIN_CONSTRAINT,
} from './role-separation';

// Write Hardening
export {
  VALIDATION_GATES,
  FORBIDDEN_FIELDS,
  validateSchema,
  scanForbiddenFields,
  processWriteAttempt,
  DB_ACCESS_CONSTRAINT,
} from './write-hardening';

// AI Safety
export {
  AI_ALLOWED_ACTIONS,
  AI_FORBIDDEN_ACTIONS,
  isAIActionAllowed,
  isAIActionForbidden,
  validateAIAction,
  DEFAULT_AGENT_RATE_LIMITS,
  GRAVITY_BASED_LIMITS,
  getAgentRateLimit,
  validateAIOutput,
} from './ai-safety';

// Anti-Summary Guard
export {
  FORBIDDEN_PHRASES,
  checkForForbiddenPhrases,
  guardAPIResponse,
  ANTI_SUMMARY_CONFIG,
  type SummaryGuardResult,
} from './anti-summary-guard';

// Ontology Locks
export {
  ONTOLOGY_CHANGE_CONSTRAINTS,
  createOntologyVersion,
  validateOntologyChangeRequest,
  bindAPIVersion,
  validateAPIVersionBinding,
  ONTOLOGY_LOCK_PRINCIPLE,
  type APIVersionBinding,
} from './ontology-locks';

// Audit & Forensics
export {
  createAuditEvent,
  createTamperAlert,
  TAMPER_ALERT_TYPES,
  replayToTimestamp,
  computeStructuralDiff,
  AUDIT_CAPABILITIES,
  type ReplayState,
  type StructuralDiff,
} from './audit-forensics';

// Disaster Modes
export {
  DISASTER_RESPONSES,
  KEY_RECOVERY_PROTOCOL,
  RESILIENCE_GUARANTEES,
  NUCLEAR_OPTION,
} from './disaster-modes';

// Red Team
export {
  RED_TEAM_TESTS,
  evaluateRedTeamTest,
  RED_TEAM_SCHEDULE,
  checkRedTeamCompliance,
  type RedTeamResult,
} from './red-team';

// Regulatory Resilience
export {
  LEGAL_POSITION,
  REGULATORY_EVIDENCE,
  COMPLIANCE_ARTIFACTS,
  REGULATORY_POSITIONS,
  FAIL_SILENT_BEHAVIOR,
  type RegulatoryEvidence,
} from './regulatory-resilience';

// ============================================================================
// SECURITY STATUS
// ============================================================================

export const SECURITY_STATUS = {
  version: '1.0',
  status: 'hardened',
  
  layers: [
    'Cryptographic integrity (hash chains + Merkle roots)',
    'Write path hardening (validation gates)',
    'Role separation (no admin with all permissions)',
    'Ontology locks (90-day delay)',
    'AI safety boundary (read-only)',
    'Anti-summary guard (runtime checks)',
    'Audit & forensics (full replay)',
    'Disaster modes (designed resilience)',
    'Red team (quarterly testing)',
    'Regulatory resilience (legal armor)',
  ],
  
  guarantees: {
    technically_hardened: true,
    semantically_locked: true,
    legally_defensive: true,
    ai_safe: true,
    future_proof: true,
  },
  
  longevity: '50 years',
  
  why_it_holds: [
    'Protects against both technology and humans',
    'Slow where it should be slow',
    'Open where it should be open',
    'Makes fraud visible instead of forbidden',
  ],
} as const;
