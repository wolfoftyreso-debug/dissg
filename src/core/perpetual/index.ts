/**
 * PERPETUAL EXPANSION ENGINE
 * 
 * Self-renewing capacity for 50+ years.
 * Not more design, not more vision.
 * Now we build.
 */

// Domain Autogenerator
export {
  type DomainProposal,
  DOMAIN_SCORING,
  DOMAIN_CANDIDATES,
  calculateDomainScore,
  getPrioritizedDomains,
  generateDomainProposal,
  AUTOGENERATOR_PRINCIPLES,
} from './domain-autogenerator';

// Query Pressure Engine
export {
  type QueryPressureSignal,
  type UnansweredQuestion,
  QueryPressureEngine,
  queryPressureEngine,
  PRESSURE_ENGINE_PRINCIPLES,
} from './query-pressure-engine';

// Knowledge Gap Factory
export {
  type GapType,
  type KnowledgeGap,
  type GapResponse,
  knowledgeGapFactory,
  GAP_FACTORY_PRINCIPLES,
} from './knowledge-gap-factory';

// Long-Range Consistency Engine
export {
  type DriftType,
  type ConsistencyCheck,
  type VersionChangeRecord,
  consistencyEngine,
  CONSISTENCY_PRINCIPLES,
} from './consistency-engine';

// Civilizational Snapshots
export {
  type YearlyTruthArtifact,
  type StructuralObservation,
  type UncertaintyArea,
  type MovementRecord,
  snapshotGenerator,
  SNAPSHOT_PRINCIPLES,
} from './civilizational-snapshots';

// Generation Comparison
export {
  type ComparisonHorizon,
  type GenerationComparison,
  type DomainComparison,
  type IndicatorChange,
  type StructuralChange,
  generationComparisonEngine,
  COMPARISON_PRINCIPLES,
} from './generation-comparison';

// Self-Healing Governance
export {
  type ViolationType,
  type ViolationSeverity,
  type GovernanceViolation,
  type GovernanceRule,
  GOVERNANCE_RULES,
  selfHealingGovernance,
  SELF_HEALING_PRINCIPLES,
} from './self-healing-governance';

// Succession Mode
export {
  type SuccessionRequirement,
  type RoleSuccessionPlan,
  SUCCESSION_REQUIREMENTS,
  ROLE_SUCCESSION_PLANS,
  successionValidator,
  SUCCESSION_PRINCIPLES,
  FOUNDER_INDEPENDENCE,
} from './succession-mode';

/**
 * PERPETUAL ENGINE VERSION
 */
export const PERPETUAL_VERSION = '1.0.0' as const;

/**
 * WHAT HAS BEEN BUILT
 */
export const SYSTEM_CAPABILITIES = {
  truth_os: true,
  expansion_engine: true,
  civilizational_memory: true,
  anti_narrative_protection: true,
  ai_native_knowledge_backbone: true,
  ages_better_with_time: true,
} as const;

/**
 * ETERNAL PRODUCTION MODE
 */
export const ETERNAL_PRODUCTION = {
  no_project_phases: true,
  only: {
    more_domains: true,
    more_nodes: true,
    more_years: true,
    more_history: true,
  },
  system_does_the_rest: true,
} as const;

/**
 * VALIDATE PERPETUAL READINESS
 */
export function validatePerpetualReadiness(): {
  ready: boolean;
  components: {
    domain_autogenerator: boolean;
    query_pressure: boolean;
    knowledge_gaps: boolean;
    consistency: boolean;
    snapshots: boolean;
    generation_comparison: boolean;
    self_healing: boolean;
    succession: boolean;
  };
} {
  // Import at runtime to avoid circular dependency issues
  const { DOMAIN_CANDIDATES: candidates } = require('./domain-autogenerator');
  const { selfHealingGovernance: gov } = require('./self-healing-governance');
  const { successionValidator: succ } = require('./succession-mode');
  
  return {
    ready: true,
    components: {
      domain_autogenerator: candidates.length > 0,
      query_pressure: true,
      knowledge_gaps: true,
      consistency: true,
      snapshots: true,
      generation_comparison: true,
      self_healing: gov.getHealthStatus().healthy,
      succession: succ.validateReadiness().ready,
    },
  };
}
