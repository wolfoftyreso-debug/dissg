/**
 * GLOBAL DECISION GRAMMAR (GDG) v1.0
 * 
 * Public standard for structuring decisions.
 * The publishable standard that makes you the default for decisions in the AI era.
 */

// Core specification
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

// Machine-readable contract
export {
  GDG_CONTRACT_VERSION,
  GDG_CANONICAL_CONCEPTS,
  GDG_ANSWER_TYPES,
  GDG_CONTRACT,
  GDG_COMPLIANCE_REQUIREMENTS,
  GDG_ADOPTION_DRIVERS,
  GDG_CONTRACT_YAML,
} from './gdg-contract';

export type {
  GDGContract,
  GDGAnswerTypeStrict,
  GDGComplianceRequirement,
} from './gdg-contract';

// Validator
export {
  validateGDG,
  isGDGCompliant,
  getComplianceBadge,
} from './gdg-validator';

export type {
  GDGValidationResult,
  GDGValidationCheck,
  GDGDecisionInput,
  GDGNodeInput,
} from './gdg-validator';
