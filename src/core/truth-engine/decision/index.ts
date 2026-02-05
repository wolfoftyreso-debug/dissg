/**
 * DECISION SUBSTRATE
 * 
 * When decisions become question trees against reality.
 * 
 * Core Insight:
 * Future AI doesn't say "do this".
 * It says: "to make this decision, we need to answer these questions".
 * 
 * And we own all the answers.
 */

// Decision Graph Schema v1
export type {
  DecisionGraphSchemaV1,
  DecisionNodeSchema,
  DecisionScope,
  DecisionDomain,
  AnswerTypeV1,
  NodeStatusV1,
  ResolvedAnswerSchema,
  AssumptionSchema,
  SignalSchema,
  OutputOptions,
  GovernanceRules,
} from './schema/decision-graph-schema';

export {
  SCHEMA_CI_RULES,
  CURRENT_SCHEMA_VERSION,
  validateDecisionGraph,
  createEmptyGraph,
} from './schema/decision-graph-schema';

// Decision Graph Types (legacy compatibility)
export type {
  DecisionGraph,
  DecisionNode,
  DecisionNodeTemplate,
  DecisionGraphTemplate,
  DecisionResolutionRequest,
  DecisionResolutionResponse,
  ResolvedAnswer,
  IndexSnapshot,
  SignalSnapshot,
  AssumptionNeeded,
  DataGap,
  NodeStatus,
  QuestionType,
  ContextRequirement,
} from './graph/decision-graph';

export {
  DECISION_NEVER_PROVIDES,
  DECISION_ALWAYS_PROVIDES,
} from './graph/decision-graph';

// Decision Resolver
export { DecisionResolver, RESOLVER_PRINCIPLE } from './graph/decision-resolver';

// Decision Templates
export {
  INVESTMENT_DECISION_TEMPLATE,
  HEALTHCARE_PLANNING_TEMPLATE,
  POLICY_DECISION_TEMPLATE,
  DECISION_TEMPLATES,
  getTemplate,
  listTemplates,
  getTemplatesForDomain,
  TEMPLATE_PRINCIPLES,
} from './templates/decision-templates';

// Decision Factory
export {
  DecisionGraphFactory,
  DECISION_BLUEPRINTS,
  FACTORY_PRINCIPLES,
} from './factory';

export type { DecisionBlueprint } from './factory';

// Decision Type Registry (10 canonical types)
export {
  DECISION_TYPE_REGISTRY,
  REGISTRY_PRINCIPLES,
  getDecisionType,
  listDecisionTypes,
  getDecisionTypesByCategory,
  getDecisionTypesByDomain,
  detectDecisionType,
} from './registry';

export type { DecisionType, QuestionPatternV2 } from './registry';

// Precompute & Cache
export {
  PrecomputeCache,
  precomputeCache,
  generateCacheKey,
  PRECOMPUTE_PRIORITIES,
  INDEX_WARM_CONFIG,
  DEFAULT_CACHE_CONFIG,
  CACHE_PRINCIPLES,
} from './cache';

export type {
  CacheConfig,
  PrecomputePriority,
  IndexWarmConfig,
} from './cache';

// Decision Examples
export {
  INVESTMENT_FACILITY_GRAPH,
  INVESTMENT_CHART_SPECS,
  HEALTHCARE_CAPACITY_GRAPH,
  HEALTHCARE_CHART_SPECS,
  POLICY_SCHOOL_REFORM_GRAPH,
  POLICY_CHART_SPECS,
  ALL_EXAMPLE_GRAPHS,
} from './examples';

// Visualization
export {
  generateSpec,
  generateSpecFromAnswerType,
  VISUALIZATION_PRINCIPLES,
  CHART_CONFIGS,
} from './visualization';

export type { VegaLiteSpec, ChartType } from './visualization';

// AI Constraints
export {
  AI_ALLOWED_ACTIONS,
  AI_FORBIDDEN_ACTIONS,
  AI_DECISION_SYSTEM_PROMPT,
  AI_FORBIDDEN_PHRASES,
  AI_REQUIRED_PHRASES,
  validateAIOutput,
  AI_ROLE_DEFINITION,
} from './ai/ai-constraints';

export type { AIAllowedAction, AIForbiddenAction } from './ai/ai-constraints';

// Decision API Types
export type {
  ResolveDecisionRequest,
  ResolveDecisionResponse,
  DecisionSummary,
  AnswerSummary,
  IndexContext,
  SignalContext,
  AssumptionContext,
  GapContext,
  ListTemplatesRequest,
  ListTemplatesResponse,
  TemplateSummary,
} from './api/decision-api';

export {
  DECISION_API_ENDPOINTS,
  DECISION_API_PRINCIPLES,
} from './api/decision-api';

/**
 * DECISION SUBSTRATE PRINCIPLES
 */
export const DECISION_SUBSTRATE_PRINCIPLES = {
  core_insight: 'Decisions are structured question trees against reality',
  
  we_own: {
    language_for_decisions: true,
    question_structure: true,
    answers: true,
    indices: true,
    uncertainty: true,
  },
  
  others_build: {
    apps: true,
    ai_agents: true,
    interfaces: true,
  },
  
  they_must: 'Get reality from us',
  
  ai_role: {
    allowed: [
      'Formulate question trees',
      'Suggest relevant Answer Packets',
      'Identify uncertainties',
      'Point out data gaps',
    ],
    forbidden: [
      'Weigh values',
      'Recommend decisions',
      'Optimize outcomes',
    ],
  },
  
  responsibility: 'Always lies with user/organization, never with AI, never with us',
} as const;

/**
 * WHY THIS IS UNSTOPPABLE
 */
export const WHY_UNSTOPPABLE = {
  ai_models_need_this: 'To not hallucinate decisions',
  organizations_need_this: 'For responsibility transfer',
  regulators_accept_this: {
    we_decide_nothing: true,
    we_recommend_nothing: true,
    we_hide_nothing: true,
  },
  result: 'We become the operating system for decision foundations',
} as const;

/**
 * WHAT WE OWN IN PRACTICE
 */
export const WHAT_WE_OWN = {
  language_for_decisions: true,
  question_structure: true,
  answers: true,
  indices: true,
  uncertainty: true,
  
  not_media: true,
  not_recommendations: true,
  pure_decision_substrate: true,
} as const;
