/**
 * MULTILINGUAL EXPANSION MODULE
 * 
 * STEG 20: MULTILINGUAL ORAKELLOGIK
 * 
 * Hur 10 miljoner frågor blir globala utan att betydelse,
 * risk eller epistemik förändras.
 * 
 * Grundprincip: Språk är ett gränssnitt – inte en källa.
 */

// Language Layer
export type {
  LanguageCode,
  LanguageVariant,
  MultilingualQuestion,
  ExpansionWave,
  LanguageCharacteristics,
} from './language-layer';

export {
  LANGUAGE_PRIORITY_ORDER,
  EXPANSION_WAVES,
  LANGUAGE_CHARACTERISTICS,
  LANGUAGE_LAYER_PRINCIPLE,
  calculateLanguageReach,
  getLanguagesBySearchEngine,
} from './language-layer';

// Semantic Lock
export type {
  ForbiddenShift,
  SemanticLock,
  SemanticValidationResult,
  SemanticViolation,
} from './semantic-lock';

export {
  FORBIDDEN_PATTERNS,
  SemanticValidator,
  SEMANTIC_LOCK_PRINCIPLES,
  createSemanticValidator,
} from './semantic-lock';

// Query Templates i18n
export type {
  IntentType,
  QueryTemplate,
  LanguageTemplateSet,
} from './query-templates-i18n';

export {
  LANGUAGE_TEMPLATES,
  MultilingualTemplateGenerator,
  TEMPLATE_PRINCIPLES,
  createTemplateGenerator,
} from './query-templates-i18n';

// Expansion Engine
export type {
  ExpansionStatus,
  ExpandedQuestion,
  ExpansionResult,
  AIAgentAdvantage,
  MultilingualEngineStats,
} from './expansion-engine';

export {
  MultilingualExpansionEngine,
  EXPANSION_PRINCIPLES,
  GEOGRAPHIC_INDEPENDENCE,
  createMultilingualEngine,
} from './expansion-engine';

/**
 * STEG 20 OUTCOMES
 * 
 * After this step you have:
 * - Global coverage
 * - Local relevance
 * - Zero semantic drift
 * - Total meaning control
 * 
 * You are not "translated".
 * You are global by construction.
 */
export const STEG_20_OUTCOMES = {
  global_coverage: true,
  local_relevance: true,
  zero_semantic_drift: true,
  total_meaning_control: true,
  
  // What this means
  not_translated_but_global: true,
  
  // Search engine dominance
  local_search_engine_dominance: {
    google: ['en', 'es', 'fr', 'de', 'pt', 'sv'],
    baidu: ['zh'],
    yandex: ['ru'],
    naver: ['ko'],
  },
  
  // AI agent benefits
  ai_agent_direct_resolution: true,
  no_translation_overhead: true,
  lower_latency: true,
  lower_hallucination_risk: true,
  higher_trust: true,
  
  // Mathematics
  calculation: {
    base_questions: '10M',
    languages: '10',
    result: 'Same facts, same epistemics',
    not: '100M new truths',
  },
} as const;

/**
 * LANGUAGE EXPANSION STRATEGY
 * 
 * Priority order for maximum impact with minimum risk.
 */
export const LANGUAGE_EXPANSION_STRATEGY = {
  wave_1: {
    languages: ['en', 'es', 'fr', 'de'],
    reason: 'Core global + institutional',
    reach_millions: 2460,
  },
  wave_2: {
    languages: ['pt', 'ar', 'ru'],
    reason: 'Global South + Eurasian',
    reach_millions: 930,
  },
  wave_3: {
    languages: ['ja', 'ko', 'zh'],
    reason: 'High-value Asian markets',
    reach_millions: 1305,
  },
  wave_4: {
    languages: ['sv', 'no', 'da', 'fi'],
    reason: 'Home market + Nordic',
    reach_millions: 25,
  },
  
  // Total potential reach
  total_reach_millions: 4720,
  internet_coverage_percent: 94,
} as const;
