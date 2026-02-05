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

// Decision Graph Types
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
  // Core insight
  core_insight: 'Decisions are structured question trees against reality',
  
  // What we own
  we_own: {
    language_for_decisions: true,
    question_structure: true,
    answers: true,
    indices: true,
    uncertainty: true,
  },
  
  // What others build
  others_build: {
    apps: true,
    ai_agents: true,
    interfaces: true,
  },
  
  // But they must
  they_must: 'Get reality from us',
  
  // AI role (strictly limited)
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
  
  // Responsibility
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
  
  // Infrastructure + intellectual dominance
  not_media: true,
  not_recommendations: true,
  pure_decision_substrate: true,
} as const;
