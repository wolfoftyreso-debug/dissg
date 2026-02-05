/**
 * GLOBAL DECISION GRAMMAR (GDG)
 * 
 * Public standard for structuring decisions.
 */

export {
  GDG_VERSION,
  GDG_AXIOMS,
  GDG_FORBIDDEN,
  GDG_REQUIRED,
  GDG_JSON_SCHEMA,
  GDG_HUMAN_READABLE,
  GDG_YAML_SPEC,
} from './gdg-spec';

export type {
  GDGDecision,
  GDGQuestionNode,
  GDGAnswerType,
  GDGAnswer,
  GDGConfidence,
  GDGLimitation,
  GDGAssumption,
  GDGSource,
  GDGGovernance,
} from './gdg-spec';
