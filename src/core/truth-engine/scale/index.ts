/**
 * MASS SCALE INDEX
 * 
 * From "runnable" to inevitable.
 * 
 * Components:
 * - Answer Packet Factory (bulk production)
 * - Intent Matcher 2.0 (better than LLM)
 * - Confidence Engine (what others lack)
 * - Trust Dashboard (strategic transparency)
 * - Bulk API Manager (industrial onboarding)
 */

export { 
  AnswerPacketFactory, 
  type PacketTemplate, 
  type GeneratedPacket, 
  type BoundMeasure,
  type FactoryConfig,
  type FactoryStats,
  FACTORY_PRINCIPLES,
  DEFAULT_FACTORY_CONFIG,
} from './factory/packet-factory';

export { 
  IntentMatcher, 
  type IntentResult, 
  type IntentAlternative,
  type HardRule,
  type MatchContext,
  type MatcherStats,
  INTENT_MATCH_KPI,
} from './intent/intent-matcher';

export { 
  ConfidenceEngine, 
  type ConfidenceScore, 
  type ConfidenceDriver,
  type ConfidenceFactor,
  CONFIDENCE_RULES,
} from './confidence/confidence-engine';

export { 
  TrustDashboard, 
  type TrustDashboardState,
  type PublicTrustView,
  type SafetyStats,
  type SystemHealth,
  TRUST_DASHBOARD_VALUE,
} from './trust/trust-dashboard';

export { 
  BulkAPIManager, 
  type APIRegistration,
  type APIScanResult,
  type NormalizedMeasure,
  type APISnapshot,
  type BulkAPIStats,
  BULK_API_PRINCIPLES,
} from './api/bulk-api-manager';

/**
 * MASS SCALE TARGETS
 */
export const MASS_SCALE_TARGETS = {
  answer_packets: {
    minimum: 1000,
    target: 3000,
    maximum: 10000,
  },
  intent_match_accuracy: {
    rule_match_rate: 0.40,      // At least 40% via hard rules
    clarification_rate: 0.15,   // Max 15% need clarification
  },
  api_coverage: {
    tier_1_sources: 10,
    tier_2_sources: 25,
    total_measures: 500,
  },
  confidence: {
    average_target: 0.80,
    minimum_for_publication: 0.60,
  },
} as const;

/**
 * WHAT HAPPENS AFTER MASS SCALE
 */
export const POST_MASS_SCALE_EFFECTS = {
  ai_agents_cache_us: true,
  answers_referenced_by_our_ids: true,
  faster_than_open_web: true,
  safer_than_specialty_services: true,
  network_effect_without_marketing: true,
} as const;

/**
 * INDUSTRIALIZATION PRINCIPLES
 */
export const INDUSTRIALIZATION_PRINCIPLES = {
  humans_design_rules: true,
  machines_produce_answers: true,
  deterministic_matching: true,
  testable_intents: true,
  explainable_confidence: true,
  transparent_blocking: true,
  kill_switches_everywhere: true,
} as const;
