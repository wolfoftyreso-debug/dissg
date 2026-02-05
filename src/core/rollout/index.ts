/**
 * GLOBAL ROLLOUT PLAN — PUBLIC API
 * 
 * Decision Legitimacy System — planetary scale
 * 
 * Strategy:
 * - Launch structure, not opinion
 * - Launch readability, not "answers"
 * - Launch tools for thinking, not truths
 */

// Types
export type {
  RolloutWave,
  WaveDefinition,
  LanguagePriority,
  LanguageConfig,
  RegionCode,
  RegionConfig,
  SEOPhase,
  SEOPhaseConfig,
  AdoptionMetrics,
  TierType,
  BusinessModelItem,
  RiskMitigation,
  RolloutStatus,
} from './types';

// Waves
export {
  WAVE_1_UNIVERSAL,
  WAVE_2_INSTITUTIONAL,
  WAVE_3_GLOBAL_SOUTH,
  ALL_WAVES,
  getWaveById,
  getCurrentWave,
  getWaveProgress,
} from './waves';

// Languages
export {
  LANGUAGE_CONFIGS,
  LOCALIZATION_RULES,
  createLocalizedEntity,
  getLanguageByCode,
  getLanguagesByWave,
  getTotalPopulationReach,
  getCanonicalOntologyRef,
} from './languages';

// Regions
export {
  REGION_CONFIGS,
  getRegionByCode,
  getRegionsByWave,
  getGDPRRegions,
  getCCPARegions,
  getRegionPriorityOrder,
} from './regions';

// SEO Phases
export {
  PHASE_A_INDEX_SEED,
  PHASE_B_AUTHORITY_ACCRUAL,
  PHASE_C_DOMINANCE,
  ALL_SEO_PHASES,
  getSEOPhaseByName,
  getCurrentSEOPhase,
  getSEOPhaseProgress,
} from './seo-phases';

// Business Model
export {
  FREE_FEATURES,
  PAID_FEATURES,
  FORBIDDEN_FEATURES,
  ALL_BUSINESS_MODEL_ITEMS,
  getFeaturesByTier,
  isFeatureFree,
  isFeatureForbidden,
} from './business-model';

// Risks
export {
  RISK_MITIGATIONS,
  LEGAL_POSITION,
  getRisksBySeverity,
  getHighSeverityRisks,
  getAllRisks,
} from './risks';

// Metrics
export {
  TRACKED_METRICS,
  IGNORED_METRICS,
  FIVE_YEAR_EFFECTS,
  createEmptyMetrics,
  calculateMetricScore,
  isMetricTracked,
  isMetricIgnored,
} from './metrics';

// ============================================================================
// VERSION & STATUS
// ============================================================================

export const ROLLOUT_PLAN_VERSION = {
  version: '1.0',
  status: 'ready_for_launch',
  created: '2025-01-01',
  strategy: 'Structure, not opinion. Readability, not answers.',
} as const;
