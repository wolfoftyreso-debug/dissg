/**
 * GDG SDK
 * 
 * Partner SDK, Badge System, Reference Implementations, Adoption Metrics
 */

// Partner SDK
export {
  DecisionGraph,
  validate,
  SDK_PRINCIPLES,
  type DecisionScope,
  type QuestionNode,
} from './partner-sdk';

// Badge System
export {
  issueBadge,
  verifyBadge,
  getBadgeDisplayData,
  BADGE_REQUIREMENTS,
  type GDGBadge,
  type BadgeLevel,
} from './badge-system';

// Reference Implementations
export {
  REF_INVESTMENT_ENERGY,
  REF_HEALTHCARE_CAPACITY,
  REF_POLICY_SCHOOL,
  REF_MARKET_VOLATILITY,
  REF_ENVIRONMENT_VULNERABILITY,
  ALL_REFERENCES,
  getReferenceById,
  getReferencesByDomain,
} from './reference-implementations';

// Adoption Metrics
export {
  ADOPTION_METRICS,
  AdoptionTracker,
  adoptionTracker,
  BLOCK_METRIC_RATIONALE,
  type AdoptionMetric,
  type MetricSnapshot,
} from './adoption-metrics';
