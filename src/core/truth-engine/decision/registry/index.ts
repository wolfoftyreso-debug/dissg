/**
 * DECISION TYPE REGISTRY
 * 
 * The 10 canonical decision types.
 */

export {
  DECISION_TYPE_REGISTRY,
  REGISTRY_PRINCIPLES,
  getDecisionType,
  listDecisionTypes,
  getDecisionTypesByCategory,
  getDecisionTypesByDomain,
  detectDecisionType,
} from './decision-type-registry';

export type { DecisionType, QuestionPatternV2 } from './decision-type-registry';
