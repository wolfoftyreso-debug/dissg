/**
 * AI Governance Module Index
 * 
 * OEM-class AI rules for diagnostic system.
 * Prevents speculation, enforces diagnostic-only responses.
 */

// Forbidden patterns and validation
export {
  FORBIDDEN_VALUE_WORDS,
  FORBIDDEN_NORMATIVE_EXPRESSIONS,
  FORBIDDEN_INTENT_PATTERNS,
  FORBIDDEN_FUTURE_PATTERNS,
  validateAIOutput,
  type ViolationReport,
} from './forbidden-patterns';

// Allowed patterns and response structure
export {
  ALLOWED_EXPRESSION_TEMPLATES,
  ALLOWED_SENTENCE_STARTERS,
  validateLayeredResponse,
  type AllowedExpressionType,
  type LayeredResponse,
} from './allowed-patterns';

// Master prompt system
export {
  MASTER_PROMPT_SV,
  MASTER_PROMPT_EN,
  FAULT_CODE_CONTEXT_PROMPT,
  MEASURE_BLOCK_CONTEXT_PROMPT,
  UNCERTAINTY_THRESHOLD_PROMPT,
  getSystemPrompt,
  type PromptLanguage,
  type AIContextConfig,
} from './master-prompt';

// Violation handling
export {
  processAIResponse,
  getGovernanceState,
  getViolationLog,
  clearViolationLog,
  createSafeAIResponse,
  REJECTION_MESSAGES,
  type AIViolationIncident,
  type AIGovernanceState,
  type ViolationSeverity,
  type SafeAIResponse,
} from './violation-handler';

// Response builder
export {
  buildDiagnosticResponse,
  buildStructuredResponse,
  type DiagnosticObservation,
  type DiagnosticRelationship,
  type DiagnosticLimitation,
  type DiagnosticResponseInput,
} from './response-builder';
