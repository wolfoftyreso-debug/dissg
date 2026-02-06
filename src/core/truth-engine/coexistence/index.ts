/**
 * COEXISTENCE WITH REAL-TIME DECISION SYSTEMS
 * 
 * STEG 24: SAMEXISTENS MED REAL-TIME BESLUTSSYSTEM
 * 
 * How the AI oracle lives alongside systems that must act quickly
 * - without becoming responsible for their decisions.
 * 
 * We are: That which stands still when everything else rushes.
 */

// Coexistence Principles
export {
  WHAT_WE_ARE_NOT,
  FUNDAMENTAL_PROBLEM,
  CORE_PRINCIPLE,
  SYSTEM_COMPARISONS,
  COEXISTENCE_MODEL,
  IDENTITY,
} from './coexistence-principles';

export type {
  SystemComparison,
} from './coexistence-principles';

// Usage Constraints
export {
  ALLOWED_USAGES,
  FORBIDDEN_USAGES,
  ALL_USAGE_CONSTRAINTS,
  USAGE_CONSTRAINTS_MACHINE,
  FORBIDDEN_PATTERNS,
  API_HEADERS,
  classifyQuery,
  isUsageAllowed,
} from './usage-constraints';

export type {
  UsageType,
  UsageConstraint,
  QueryClassification,
} from './usage-constraints';

// Temporal Isolation
export {
  TEMPORAL_POLICY,
  WHY_TEMPORAL_ISOLATION,
  FRESHNESS_CONSTRAINTS,
  STALENESS_AS_FEATURE,
  TIMESTAMP_POLICY,
  TEMPORAL_HEADERS,
  TEMPORAL_SHIELD,
  checkTemporalCompliance,
  getFreshnessLevel,
} from './temporal-isolation';

export type {
  TemporalPolicy,
  FreshnessLevel,
  TimestampRequirements,
} from './temporal-isolation';

// Known-Unknown API
export {
  KNOWLEDGE_STATE_DEFINITIONS,
  VALUE_PROPOSITION,
  KNOWN_UNKNOWN_API,
  CRISIS_VALUE,
  createKnownUnknownResponse,
  createKnowledgeItem,
} from './known-unknown-api';

export type {
  KnowledgeState,
  KnowledgeItem,
  KnownUnknownResponse,
  KnowledgeSummary,
} from './known-unknown-api';

// Legal Protection
export {
  LEGAL_CLASSIFICATION,
  REQUIRED_DISCLAIMERS,
  LEGAL_HEADERS,
  REQUIRED_CLAUSES,
  PROTECTION_SCENARIOS,
  METADATA_REQUIREMENTS,
  checkLegalCompliance,
} from './legal-protection';

export type {
  ContractClause,
  ProtectionScenario,
} from './legal-protection';

/**
 * STEG 24 SUMMARY
 * 
 * After this step you have:
 * - Full compatibility with real-time systems
 * - Zero responsibility for their decisions
 * - Maximum utility in crises
 * - Maximum epistemic integrity
 * 
 * You are: That which stands still when everything else rushes.
 */
export const STEG_24_SUMMARY = {
  // Core principle
  core_principle: 'Oracle is NEVER in loop with decisions',
  
  // Allowed usage
  allowed: {
    context: 'How does this usually look historically?',
    baselines: 'What is normal?',
    definitions: 'How is this measured?',
    limitations: 'What do we not know?',
  },
  
  // Forbidden usage
  forbidden: {
    recommendations: 'What should we do?',
    predictions: 'What will happen now?',
    decisions: 'What is the right decision?',
  },
  
  // Temporal isolation
  temporal_policy: {
    min_latency: 'hours',
    real_time_claims: false,
    staleness_is_feature: true,
  },
  
  // Known-Unknown API
  known_unknown: {
    known: 'Verified facts',
    unknown: 'Cannot answer',
    unverifiable: 'Cannot check',
    value: 'Maximum information, zero opinion',
  },
  
  // Legal protection
  legal: {
    we_deliver: 'information',
    not: ['decision_support', 'advice', 'optimization'],
    liability: 'information_accuracy_only',
  },
  
  // Identity
  identity: 'That which stands still when everything else rushes',
  
  // What real-time systems learn
  they_learn: [
    'Use oracle BEFORE decision',
    'Never use oracle AS trigger',
    'Build own models on top',
    'Point back for baseline',
  ],
} as const;
