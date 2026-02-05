/**
 * SEMANTIC TRUTH UNIVERSE (STU)
 * 
 * When knowledge becomes navigable reality, not content.
 * 
 * Core Principle (locked):
 * Truth is not an answer.
 * Truth is a directed, explained, and continuable structure.
 */

// Priority Layer
export {
  PRIORITY_CALCULATION_RULES,
  DOMAIN_PRIORITY_MAPS,
  getPriorityMap,
  getTopPriorities,
  type PriorityClass,
  type PriorityItem,
  type DomainPriorityMap,
} from './priority-layer';

// Semantic Importance
export {
  IMPORTANCE_TEMPLATES,
  generateImportanceBlock,
  validateImportanceBlock,
  YOUTH_MENTAL_HEALTH_EXAMPLE,
  type ImportanceCategory,
  type SemanticImportance,
  type ImportanceStatement,
  type ConnectionStatement,
} from './semantic-importance';

// Depth Navigator
export {
  DEPTH_NAVIGATION_RULES,
  YOUTH_ANXIETY_EXAMPLE,
  generateNextQuestions,
  getNavigationOptions,
  type NavigationDirection,
  type SemanticNode,
  type ContextLink,
  type RelatedLink,
  type DeeperLink,
  type ParallelView,
} from './depth-navigator';

// Master Prompts
export {
  MASTER_PROMPTS,
  PROMPT_SEMANTIC_GUIDE,
  PROMPT_PRIORITY_EXPLAINER,
  PROMPT_DEPTH_NAVIGATOR,
  PROMPT_COMPLIANCE_GUARD,
  PROMPT_CRISIS_FALLBACK,
  FORBIDDEN_PATTERNS,
  getPromptForContext,
  checkOutputCompliance,
} from './master-prompts';

// Domain Compliance
export {
  DOMAIN_COMPLIANCE,
  MEDICINE_COMPLIANCE,
  MARKETS_COMPLIANCE,
  YOUTH_COMPLIANCE,
  ECONOMY_COMPLIANCE,
  getComplianceConfig,
  checkDomainCompliance,
  type ComplianceRule,
  type DomainComplianceConfig,
} from './domain-compliance';
