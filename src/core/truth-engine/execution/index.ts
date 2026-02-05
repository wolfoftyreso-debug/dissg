/**
 * EXECUTION ENGINE — PUBLIC API
 * 
 * The brain that makes ST-OS run consistently, safely, and at infinite scale.
 */

// Semantic Execution Engine
export {
  executeSEE,
  classifyIntention,
  selectSemanticView,
  determineActivePrompts,
  validateOutputContract,
  selfAudit,
  type SEEContext,
  type SEEResult,
  type IntentionClassification,
  type IntentionType,
  type SemanticViewType,
  type SemanticOutput,
  type ValidationResult,
  type SelfAuditResult,
} from './semantic-execution-engine';

// Master Prompt Hierarchy
export {
  CONSTITUTION_PROMPT,
  SEMANTIC_TRUTH_OS_PROMPT,
  COGNITION_PROMPT,
  DOMAIN_PROMPTS,
  INTERACTION_PROMPTS,
  PROMPT_LEVELS,
  PROMPT_METADATA,
  getPromptStack,
  compilePromptStack,
} from './master-prompt-hierarchy';

// Output Contract
export {
  validateContract,
  createEmptyContract,
  ContractBuilder,
  type SemanticOutputContract,
  type ImportanceClaim,
  type Disclaimer,
  type UncertaintyItem,
  type ValidQuestion,
  type SourceReference,
  type ContractValidation,
} from './output-contract';

// Controlled Exploration
export {
  SPECULATION_PATTERNS,
  NARRATIVE_PATTERNS,
  CONCLUSION_PATTERNS,
  validateExplorationRequest,
  generateValidPaths,
  checkDeadEnd,
  createExplorationState,
  type ExplorationBoundary,
  type ExplorationDirection,
  type ExplorationRequest,
  type ExplorationValidation,
  type ExplorationPath,
  type ExplorationState,
} from './controlled-exploration';
