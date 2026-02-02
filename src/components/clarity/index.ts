// System Clarity Architecture (original)
export { default as SystemClarityArchitecture } from './SystemClarityArchitecture';

// Extreme Clarity System Components
export { KnowledgeWrapper, ClickableNumber, ClickableLabel } from './KnowledgeWrapper';
export { ClarityMap, ClarityMapDemo } from './ClarityMap';
export { QuestionNavigation, QuestionNavigationDemo } from './QuestionNavigation';

// Re-export configuration
export {
  DEPTH_LEVELS,
  MAP_CLICK_HIERARCHY,
  MAP_RULES,
  NUMBER_CLICK_REQUIREMENTS,
  BREADCRUMB_LEVELS,
  NAVIGATION_STRUCTURE,
  AGGREGATION_RULES,
  GOOGLE_RULES,
  CORE_PRINCIPLE,
  runAhaTest,
  validateElementExists,
  type KnowledgeObject,
  type DeepLevel,
  type DepthLevel,
  type BreadcrumbLevel,
} from '@/config/extremeClaritySystem';
