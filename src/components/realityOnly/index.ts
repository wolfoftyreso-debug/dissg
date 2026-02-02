/**
 * 🔒 Reality Only Components
 * 
 * INGEN SANDBOX · INGEN LEK · BARA VERKLIGHET
 */

// UI Components
export { InsufficientDataDisplay } from './InsufficientDataDisplay';
export { VerificationBadge } from './VerificationBadge';
export { ShareValidator } from './ShareValidator';
export { MisunderstandingIndexViewer } from './MisunderstandingIndexViewer';

// Types
export type {
  DataAvailability,
  VerificationProof,
  SourceDetail,
  ExclusionDetail,
  RealityWrappedStep,
  RealityWrappedReport,
  LiveQuestion,
  MisunderstandingEntry,
  MisunderstandingIndex,
  ShareValidation,
  EmbedRules,
  AIDataFilter,
  AIClaimValidation,
} from '@/types/realityOnly';

export {
  INSUFFICIENT_DATA_MESSAGE,
  AI_RESPONSE_PATTERNS,
  canDisplayContent,
  getUnavailableMessage,
} from '@/types/realityOnly';

// Data validation
export {
  checkDataSufficiency,
  generateVerificationProof,
  shouldBlockContent,
  shouldWarnContent,
  getBlockingReason,
  SUFFICIENCY_THRESHOLDS,
} from '@/lib/realityOnly/dataValidator';

// Live question generation
export {
  generateLiveQuestion,
  generateLiveQuestionSet,
  getAvailableQuestionCount,
} from '@/lib/realityOnly/liveQuestionGenerator';

// Misunderstanding index
export {
  calculateMisunderstanding,
  buildMisunderstandingIndex,
  shouldRecalculateIndex,
  getTopMisunderstandings,
} from '@/lib/realityOnly/misunderstandingIndex';

// Sharing blocker
export {
  validateSharing,
  getEmbedRules,
  generateScreenshotWatermark,
  isForbiddenContext,
  generateShareLink,
  MANDATORY_SHARE_ELEMENTS,
} from '@/lib/realityOnly/sharingBlocker';

// AI data filter
export {
  extractClaims,
  containsForbiddenPatterns,
  followsAllowedPatterns,
  validateClaim,
  filterAIResponse,
  generateResponseRequirements,
  wrapWithDisclaimers,
} from '@/lib/realityOnly/aiDataFilter';
