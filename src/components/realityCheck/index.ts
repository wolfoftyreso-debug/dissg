/**
 * 🧠 REALITY CHECK ENGINE
 * 
 * Rosling-style calibration system with:
 * - Live data as the ONLY answer key
 * - 3-layer answer model
 * - Full verification and traceability
 */

// UI Components
export { RealityCheckViewer } from './RealityCheckViewer';
export { CorrelationExplorer } from './CorrelationExplorer';
export { PerceptionHeatmap } from './PerceptionHeatmap';

// Types
export type {
  RealityCheckQuestion,
  RealityCheckAnswer,
  Layer1UserPerception,
  Layer2ObservedData,
  Layer3Traceability,
  SourceSignature,
  CorrelationRequest,
  CorrelationResult,
  PerceptionGap,
  VerificationRecord,
  QuestionCategory,
  QuestionDifficulty,
  UsageMode,
} from '@/types/realityCheck';

export {
  REALITY_CHECK_FORBIDDEN_PHRASES,
  REALITY_CHECK_ALLOWED_PHRASES,
  USAGE_MODE_CONFIGS,
} from '@/types/realityCheck';

// Question generation
export {
  generateQuestions,
  validateQuestionText,
  canQuestionBeAnswered,
  calculateDifficulty,
  QUESTION_TEMPLATES,
  ROSLING_STYLE_PRESETS,
} from '@/lib/realityCheck/questionGenerator';

// Answer engine
export {
  buildAnswer,
  calculateAlignment,
  generateComparisonText,
  calculatePerceptionGap,
  calculateSessionScore,
  checkDataAvailability,
} from '@/lib/realityCheck/answerEngine';

// Verification
export {
  generateVerificationHash,
  generateCompactHash,
  createVerificationRecord,
  createSourceSignature,
  buildTraceabilityLayer,
  validateAnswerTraceability,
  generateQRCodeData,
  verifyHash,
  exportVerificationJSON,
  generateCitation,
} from '@/lib/realityCheck/verificationEngine';
