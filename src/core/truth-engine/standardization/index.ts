/**
 * GLOBAL STANDARDIZATION (UTAN STANDARDORGAN)
 * 
 * STEG 23: HOW THE SYSTEM BECOMES THE DE FACTO STANDARD
 * 
 * Transition from dominant system to de facto standard.
 * The point where you no longer compete – others adapt to you.
 * 
 * The silent grammar behind global fact-handling.
 */

// Standardization Principles
export {
  HOW_STANDARDS_WIN,
  ADOPTION_SIGNALS,
  FRICTION_REDUCTIONS,
  MATURITY_THRESHOLDS,
  CORE_TRUTH,
  calculateMaturity,
} from './standardization-principles';

export type {
  AdoptionPhase,
  AdoptionIndicator,
  FrictionComparison,
  StandardMaturity,
} from './standardization-principles';

// Public Schemas
export {
  PUBLIC_SCHEMAS,
  PUBLICATION_PRINCIPLES,
  SCHEMA_DISCOVERY,
  ECOSYSTEM_EFFECT,
  getAllPublicSchemas,
  getSchemaByType,
  isSchemaStable,
} from './public-schemas';

export type {
  PublicSchemaType,
  PublicSchema,
  SchemaDiscovery,
} from './public-schemas';

// Reference Implementation
export {
  REFERENCE_DOMAINS,
  REFERENCE_CHARACTERISTICS,
  ADOPTION_PATHWAY,
  WHO_ASKS,
  REFERENCE_EFFECT,
  calculateReferenceStatus,
} from './reference-implementation';

export type {
  ReferenceStatus,
  ReferenceDomain,
  AdoptionPathway,
} from './reference-implementation';

// Soft Power
export {
  POWER_COMPARISON,
  EPISTEMIC_CONTROL,
  NOT_CONTROLLED,
  INFLUENCE_MECHANISMS,
  SUSTAINABILITY,
  GRAMMAR_METAPHOR,
  POWER_RULES,
  calculateSoftPowerIndex,
} from './soft-power';

export type {
  PowerType,
  PowerComparison,
  InfluenceMechanism,
} from './soft-power';

// Unforkable
export {
  COPYABLE,
  UNCOPYABLE,
  TRUST_FACTORS,
  FORK_FAILURES,
  THE_MOAT,
  CORE_TRUTH as UNFORKABLE_TRUTH,
  TIME_UNFORKABILITY,
  calculateForkViability,
} from './unforkable';

export type {
  TrustFactor,
  ForkFailure,
} from './unforkable';

// Institutional Response
export {
  INSTITUTIONAL_REQUESTS,
  THE_ONE_RULE,
  RESPONSE_PROTOCOLS,
  WHY_ALTERNATIVE_IS_WORSE,
  NEGOTIATION_STANCE,
  PRESSURE_RESISTANCE,
  FINAL_TRUTH,
  calculatePressureResponse,
} from './institutional-response';

export type {
  InstitutionalActor,
  InstitutionalRequest,
  ResponseProtocol,
} from './institutional-response';

/**
 * STEG 23 SUMMARY
 * 
 * After this step you have:
 * - A system that others mirror
 * - A structure that reproduces
 * - A language for facts that spreads
 * - Zero need for evangelism
 * 
 * You are:
 * The silent grammar behind global fact-handling.
 */
export const STEG_23_SUMMARY = {
  // What others start doing (automatically)
  automatic_adoption: {
    ai_platforms_reference_question_ids: true,
    data_providers_map_to_variables: true,
    analysis_tools_mirror_schema: true,
    legal_accepts_provenance_format: true,
  },
  
  // What we publish openly
  published_openly: [
    'CQ-schema (read-only)',
    'Problem Object-schema',
    'Intent Matrix',
    'Provenance model',
    'Epistemic states',
  ],
  
  // Soft power via
  soft_power_through: {
    definitions: true,
    boundaries: true,
    what_counts_as_answerable: true,
  },
  
  // Not through
  not_through: {
    content: true,
    narrative: true,
    policy: true,
  },
  
  // Why unforkable
  unforkable_because: [
    'historical_trust',
    'feedback_loops',
    'epistemic_discipline',
    'agent_behavior_over_time',
  ],
  
  // The one rule for institutions
  institutional_rule: 'We do not change structure. You adapt to it.',
  
  // Core identity
  identity: 'The silent grammar behind global fact-handling',
  
  // Principle
  principle: 'Standards are not code. Standards are accumulated trust.',
} as const;
