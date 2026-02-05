/**
 * BOARD DECISION PREP ENGINE (BDPE)
 * 
 * Decision preparation that makes ignorance visible.
 * System EXPOSES reality, never RECOMMENDS.
 * 
 * For: BRF, Investment Boards, Corporate Boards, 
 *      Foundations, Public Committees, Municipal Boards
 */

// Types
export type {
  OrganizationType,
  DecisionInput,
  DecisionAlternative,
  ConsequenceDimension,
  ConsequenceDimensionType,
  RelevantDataPoint,
  KnowledgeStatus,
  IrreversibilityLevel,
  DecisionPreparationDocument,
  PostDecisionLock,
} from './types';

// DPD Generator
export { dpdGenerator } from './dpd-generator';

// Post-Decision Lock
export { postDecisionLock } from './post-decision-lock';

// Protocol Binding
export { 
  createProtocolBinding, 
  validateDecisionAgainstDPD,
  BRF_PROTOCOL_BINDING_EXAMPLE,
  type ProtocolBinding,
  type VotingRecord,
} from './protocol-binding';

// Agenda Generator
export {
  generateAgenda,
  validateAgendaCoverage,
  AGENDA_GENERATOR_MASTERPROMPT,
  type AgendaItem,
  type BoardAgenda,
  type AgendaInput,
} from './agenda-generator';

// Reality Check
export {
  performRealityCheck,
  extractExpectedRanges,
  REALITY_CHECK_MASTERPROMPT,
  type ExpectedRange,
  type ObservedOutcome,
  type Deviation,
  type LearningPoint,
  type RealityCheckResult,
  type RealityCheckInput,
} from './reality-check';

// Examples
export { 
  BRF_ROOF_RENOVATION_DPD,
  INVESTMENT_PORTFOLIO_DPD,
  CORPORATE_MA_DPD,
  MUNICIPAL_INFRASTRUCTURE_DPD,
  DPD_EXAMPLES,
} from './examples';

// Workflow (End-to-End Automation)
export {
  // Types
  type WorkflowRole,
  type RolePermissions,
  type MeetingPack,
  type BoardProtocol,
  type DecisionContextSnapshot,
  type ScheduledReview,
  type WorkflowState,
  type WorkflowStage,
  type AuditEntry,
  ROLE_PERMISSIONS,
  // Meeting Pack
  generateMeetingPack,
  lockMeetingPack,
  validateMeetingPack,
  MEETING_PACK_MASTERPROMPT,
  // Protocol
  createProtocol,
  addProtocolItem,
  recordVote,
  signProtocol,
  lockProtocol,
  validateProtocol,
  PROTOCOL_GENERATOR_MASTERPROMPT,
  // Context Snapshot
  createContextSnapshot,
  verifySnapshotIntegrity,
  scheduleReview,
  compareSnapshotToCurrentState,
  // Orchestrator
  initializeWorkflow,
  attachDPD,
  generateWorkflowAgenda,
  generateWorkflowMeetingPack,
  startMeeting,
  finalizeProtocol,
  exportAuditTrail,
  ORCHESTRATOR_MASTERPROMPT,
  // Utils
  generateChecksum,
} from './workflow';

// Masterprompt
export {
  BOARD_DECISION_MASTERPROMPT,
  ORGANIZATION_PROMPTS,
  FORBIDDEN_PHRASES,
  REQUIRED_PHRASES,
} from './masterprompt';

// Legibility Layer
export {
  // Types
  type DecisionLegibilityScore,
  type LegibilityGap,
  type DecisionSummary,
  type TimelineEvent,
  type TimelineEventType,
  type DecisionTimeline,
  type CollectiveMemoryPattern,
  type CollectiveMemoryResult,
  type LegibilityAudit,
  type MythIndicator,
  // Scorer
  calculateLegibilityScore,
  LEGIBILITY_SCORER_MASTERPROMPT,
  // Summary
  generateDecisionSummary,
  validateSummaryImmutability,
  SUMMARY_GENERATOR_MASTERPROMPT,
  // Timeline
  createTimeline,
  addTimelineEvent,
  buildTimelineFromDPD,
  lockDecisionInTimeline,
  recordOutcomeInTimeline,
  validateTimelineIntegrity,
  TIMELINE_BUILDER_MASTERPROMPT,
  // Collective Memory
  addToCollectiveMemory,
  queryHowDidWeDecide,
  queryWhatDidWeMiss,
  queryRecurringUncertainties,
  COLLECTIVE_MEMORY_MASTERPROMPT,
  // Myth Detector
  detectMythIndicators,
  sanitizeMythLanguage,
  validateMythFree,
  MYTH_DETECTOR_MASTERPROMPT,
  // Master
  LEGIBILITY_LAYER_MASTERPROMPT,
} from './legibility';

// Institutional Standard Mode
export {
  // Types
  type DS1Standard,
  type DS1ComplianceResult,
  type DecisionHygieneScore,
  type ExternalReviewAccess,
  type PublicInterfaceView,
  type AdoptionMetrics,
  type StandardDeviationReport,
  // DS-1 Standard
  DS1_STANDARD,
  checkDS1Compliance,
  generateComplianceStatement,
  DS1_STANDARD_MASTERPROMPT,
  // Hygiene Score
  calculateDecisionHygieneScore,
  HYGIENE_SCORE_MASTERPROMPT,
  // External Review
  grantExternalReviewAccess,
  validateExternalAccess,
  generatePublicView,
  EXTERNAL_REVIEW_MASTERPROMPT,
  // Deviation Tracking
  recordDeviation,
  addDeviation,
  validateDeviationReport,
  summarizeDeviations,
  DEVIATION_TRACKING_MASTERPROMPT,
  // Master
  INSTITUTIONAL_STANDARD_MASTERPROMPT,
} from './institutional-standard';

// Crisis-Mode Decision Engine
export {
  // Types
  type CrisisSeverity,
  type CrisisTimeHorizon,
  type CrisisContextSnapshot,
  type CompressedDPD,
  type CrisisDecision,
  type CrisisExtensionRequest,
  type PostCrisisAudit,
  type CrisisFrictionCheckpoint,
  // Crisis Context
  declareCrisis,
  escalateCrisis,
  resolveCrisis,
  calculateCrisisDuration,
  CRISIS_CONTEXT_MASTERPROMPT,
  // Compressed DPD
  createCompressedDPD,
  validateCompressedDPD,
  prepareForFullDocumentation,
  COMPRESSED_DPD_MASTERPROMPT,
  // Time-bound Decisions
  createCrisisDecision,
  generateCrisisFrictionCheckpoints,
  acknowledgeFrictionCheckpoint,
  allCheckpointsAcknowledged,
  lockCrisisDecision,
  isDecisionExpired,
  requestExtension,
  approveExtension,
  TIME_BOUND_DECISIONS_MASTERPROMPT,
  // Post-Crisis Audit
  generatePostCrisisAudit,
  generateKnownAtTimeReport,
  POST_CRISIS_AUDIT_MASTERPROMPT,
  // Master
  CRISIS_MODE_MASTERPROMPT,
} from './crisis-mode';

// Cultural Embedding & Generational Transfer
export {
  // Types
  type DecisionLiteracy,
  type SkillLevel,
  type LearningModeSession,
  type MentalModelSpread,
  type GenerationHandover,
  type CulturalDecaySignal,
  type OrganizationalCultureState,
  // Decision Literacy
  DECISION_LITERACY_SKILLS,
  createDecisionLiteracyProfile,
  recordLiteracyExposure,
  assessOverallLiteracy,
  DECISION_LITERACY_MASTERPROMPT,
  // Learning Mode
  createLearningSession,
  recordMaterialReview,
  getLearningProgress,
  validateLearningModeAction,
  LEARNING_MODE_MASTERPROMPT,
  // Mental Model Spread
  createMentalModelTracking,
  recordAdoptionSignal,
  recordMemberDeparture,
  assessCultureState,
  calculateSpreadVelocity,
  MENTAL_MODEL_SPREAD_MASTERPROMPT,
  // Generation Handover
  createGenerationHandover,
  recordGeneration,
  closeGeneration,
  generateWhatTheyKnewReport,
  generateAntiHubrisPerspective,
  GENERATION_HANDOVER_MASTERPROMPT,
  // Cultural Decay Detection
  detectDecaySignal,
  checkForDecayPatterns,
  generateSocialFrictionResponse,
  CULTURAL_DECAY_DETECTION_MASTERPROMPT,
  // Master
  CULTURAL_EMBEDDING_MASTERPROMPT,
} from './cultural-embedding';

// Public Read-Only Portal
export {
  // Types
  type PublicDecisionView,
  type TransparencyDelay,
  type PublicAPIResponse,
  type MediaSafeWrapper,
  type PublicAccessLog,
  type AntiPopulismGuard,
  // Public Decision View
  generatePublicDecisionView,
  wrapMediaSafe,
  formatPublicDecisionDisplay,
  validatePublicViewCompleteness,
  PUBLIC_DECISION_VIEW_MASTERPROMPT,
  // Transparency Delay
  VALID_DELAY_REASONS,
  createTransparencyDelay,
  isDelayExpired,
  getDisclosureStatus,
  formatDelayForPublic,
  TRANSPARENCY_DELAY_MASTERPROMPT,
  // Public API
  PUBLIC_API_VERSION,
  PUBLIC_API_ENDPOINTS,
  createAPIResponse,
  validateAPIRequest,
  calculateRateLimit,
  formatDecisionForAPI,
  PUBLIC_API_MASTERPROMPT,
  // Anti-Populism
  NEVER_ANSWERS,
  FORBIDDEN_SIMPLIFICATIONS,
  createAntiPopulismGuard,
  checkQueryViolation,
  generateAntiPopulismResponse,
  validateOutputForPopulism,
  ANTI_POPULISM_MASTERPROMPT,
  // Master
  PUBLIC_PORTAL_MASTERPROMPT,
} from './public-portal';

// Anti-Corruption & Degradation Layer
export {
  // Types
  type DriftSignal,
  type DriftType,
  type SilentErosionAlert,
  type GoodIntentionsViolation,
  type TemplateDecaySignal,
  type RotationContext,
  type HeroModeViolation,
  type SystemHealthMetrics,
  // Drift Detection
  analyzeDecisionDrift,
  DRIFT_DETECTION_MASTERPROMPT,
  // Silent Erosion
  generateSilentErosionAlert,
  formatAlertForDisplay,
  shouldShowAlert,
  SILENT_EROSION_MASTERPROMPT,
  // Good Intentions Filter
  checkGoodIntentions,
  validateStructureProvided,
  generateStructurePrompt,
  GOOD_INTENTIONS_FILTER_MASTERPROMPT,
  // Template Decay
  checkTemplateDecay,
  canApproveDocument,
  TEMPLATE_DECAY_MASTERPROMPT,
  // No Hero Mode
  checkHeroMode,
  reduceToStructure,
  generateReductionPrompt,
  NO_HERO_MODE_RATIONALE,
  NO_HERO_MODE_MASTERPROMPT,
  // System Health
  calculateSystemHealth,
  formatHealthReport,
  SYSTEM_HEALTH_MASTERPROMPT,
  // Master
  ANTI_CORRUPTION_MASTERPROMPT,
} from './anti-corruption';

// The Irreversibility Layer
export {
  // Types
  type IrreversibleConstraint,
  type EpistemicGate,
  type AICapabilityContract,
  type TimeLockEnvelope,
  type NarrativeExitBlock,
  type FailureMode,
  type AbuseTestResult,
  // Irreversible Constraints
  IRREVERSIBLE_CONSTRAINTS,
  validateIrreversibleConstraints,
  canDisableConstraint,
  attemptDisableConstraint,
  IRREVERSIBLE_CONSTRAINTS_MASTERPROMPT,
  // Epistemic Gates
  EPISTEMIC_GATES,
  canProceedToDecision,
  passGate,
  canSkipGate,
  getRequiredGates,
  formatGateForUI,
  EPISTEMIC_GATES_MASTERPROMPT,
  // AI Contract
  AI_CAPABILITY_CONTRACT,
  validateAIOperation,
  isAICapabilityAllowed,
  getAllowedAIOperations,
  getForbiddenAIOperations,
  validateAIOutput,
  AI_CONTRACT_MASTERPROMPT,
  // Time Lock
  createTimeLockEnvelope,
  attemptModify,
  attemptDelete,
  supersede,
  getInterpretationContext,
  validateTimeLockIntegrity,
  TIME_LOCK_MASTERPROMPT,
  // Narrative Block
  NARRATIVE_BLOCKS,
  isNarrativeBlocked,
  getAlternativeOutput,
  validateNoNarrative,
  transformNarrativeRequest,
  NO_NARRATIVE_MASTERPROMPT,
  // Failure Modes
  FAILURE_MODE_SPEC,
  isFailureModeAllowed,
  handleDegradation,
  validateFailureResponse,
  getCorrectFailureDirection,
  FAILURE_MODES_MASTERPROMPT,
  // Abuse Test
  ABUSE_TEST_QUESTION,
  runAbuseTest,
  validateAgainstAbuseTest,
  generateAbuseTestReport,
  ABUSE_TEST_MASTERPROMPT,
  // Master
  IRREVERSIBILITY_LAYER_MASTERPROMPT,
} from './irreversibility';

/**
 * BDPE SUMMARY
 */
export const BDPE_SUMMARY = {
  purpose: 'Make ignorance visible before decisions',
  never: [
    'Recommend actions',
    'Rank alternatives',
    'Choose for the board',
    'Optimize outcomes',
  ],
  always: [
    'Show alternatives neutrally',
    'Expose known/uncertain/unknown',
    'Map consequence surfaces',
    'Preserve accountability',
  ],
} as const;

/**
 * QUICK START
 */
export function prepareDecision(input: {
  organization_type: 'housing_association' | 'investment_board' | 'corporate_board' | 'foundation' | 'public_committee' | 'municipal_board';
  decision_context: string;
  geo: string;
  population_affected: number;
  time_horizon: string;
  constraints: string[];
}): import('./types').DecisionPreparationDocument {
  const { dpdGenerator } = require('./dpd-generator');
  
  return dpdGenerator.generateDPD({
    organization_type: input.organization_type,
    decision_context: input.decision_context,
    scope: {
      geo: input.geo,
      population_affected: input.population_affected,
      time_horizon: input.time_horizon,
    },
    constraints: input.constraints,
  });
}

/**
 * LOCK DECISION
 */
export function lockDecisionForAccountability(params: {
  dpd_id: string;
  decision_taken: string;
  decision_date: string;
  locked_by: string;
}): import('./types').PostDecisionLock | null {
  const { postDecisionLock } = require('./post-decision-lock');
  return postDecisionLock.lockDecision(params);
}
