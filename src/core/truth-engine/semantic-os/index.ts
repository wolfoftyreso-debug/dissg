/**
 * SEMANTIC TRUTH OS — PUBLIC API
 * 
 * The operating system for comprehensible reality.
 */

// Core
export {
  SEMANTIC_TRUTH_STACK,
  STOS_CAPABILITIES,
  STOS_HARDLOCKS,
  STOS_VERSION,
} from './core';

// Universal Importance Engine
export {
  IMPORTANCE_THRESHOLDS,
  IMPORTANCE_WEIGHTS,
  calculateImportance,
  generateImportanceMap,
  formatUIEOutput,
  type ImportanceClass,
  type ImportanceFactors,
  type ImportanceScore,
  type ImportanceMap,
  type UIEOutput,
} from './importance-engine';

// Semantic Navigation
export {
  NAVIGATION_RULES,
  generateNavigation,
  getNextQuestions,
  YOUTH_ANXIETY_NAV_EXAMPLE,
  type NavDirection,
  type NavLink,
  type SemanticPosition,
  type FourWayNav,
} from './navigation';

// Guardfences
export {
  GUARDFENCE_RULES,
  checkGuardfences,
  applyGuardfences,
  generateGuardfenceReport,
  type GuardfenceType,
  type GuardfenceViolation,
  type GuardfenceReport,
} from './guardfences';

// Master Prompt
export {
  STOS_MASTER_PROMPT,
  STOS_SPECIALIZED_PROMPTS,
  STOS_PROMPT_METADATA,
  getSTOSPrompt,
  checkPromptCompliance,
} from './master-prompt';
