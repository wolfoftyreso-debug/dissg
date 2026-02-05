/**
 * LANGUAGE STRATEGY (CRITICAL)
 * 
 * - Ontology = always English (canonical)
 * - UI = translated
 * - Structured data = always canonical + locale
 * 
 * NO "local truth". Only local reading.
 */

import type { LanguageConfig, LanguagePriority } from './types';

// ============================================================================
// LANGUAGE PRIORITY ORDER
// ============================================================================

export const LANGUAGE_CONFIGS: readonly LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    priority: 1 as LanguagePriority,
    population_reach_millions: 1500,
    wave: 'wave_1_universal',
    localization_scope: 'full',
  },
  {
    code: 'es',
    name: 'Spanish',
    priority: 2 as LanguagePriority,
    population_reach_millions: 550,
    wave: 'wave_3_global_south',
    localization_scope: 'ui_and_examples',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    priority: 3 as LanguagePriority,
    population_reach_millions: 260,
    wave: 'wave_3_global_south',
    localization_scope: 'ui_and_examples',
  },
  {
    code: 'fr',
    name: 'French',
    priority: 4 as LanguagePriority,
    population_reach_millions: 280,
    wave: 'wave_2_institutional',
    localization_scope: 'ui_and_examples',
  },
  {
    code: 'de',
    name: 'German',
    priority: 5 as LanguagePriority,
    population_reach_millions: 130,
    wave: 'wave_2_institutional',
    localization_scope: 'ui_and_examples',
  },
  {
    code: 'ar',
    name: 'Arabic',
    priority: 6 as LanguagePriority,
    population_reach_millions: 420,
    wave: 'wave_3_global_south',
    localization_scope: 'ui_and_examples',
  },
  {
    code: 'hi',
    name: 'Hindi',
    priority: 7 as LanguagePriority,
    population_reach_millions: 600,
    wave: 'wave_3_global_south',
    localization_scope: 'ui_and_examples',
  },
  {
    code: 'zh',
    name: 'Mandarin (Simplified)',
    priority: 8 as LanguagePriority,
    population_reach_millions: 1100,
    wave: 'wave_3_global_south',
    localization_scope: 'ui_and_examples',
  },
] as const;

// ============================================================================
// LOCALIZATION RULES (ABSOLUTE)
// ============================================================================

export const LOCALIZATION_RULES = {
  // NEVER localized
  canonical: {
    ontology: 'en-US',
    entity_ids: 'en-US',
    decision_types: 'en-US',
    structured_data_core: 'en-US',
  },
  
  // ALWAYS localized
  localized: {
    ui_labels: true,
    examples: true,
    units: true,
    date_formats: true,
    number_formats: true,
  },
  
  // NEVER
  forbidden: {
    local_truth: false,
    local_ontology: false,
    local_recommendations: false,
  },
} as const;

// ============================================================================
// LOCALE ENTITY EXAMPLE
// ============================================================================

export interface LocalizedEntity {
  entity: string;              // Always canonical
  decision_type: string;       // Always canonical
  locale: string;              // e.g., 'sv-SE'
  ontology_ref: 'en-US';       // Always en-US
}

export function createLocalizedEntity(
  entity: string,
  decisionType: string,
  locale: string
): LocalizedEntity {
  return {
    entity,
    decision_type: decisionType,
    locale,
    ontology_ref: 'en-US',
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

export function getLanguageByCode(code: string): LanguageConfig | undefined {
  return LANGUAGE_CONFIGS.find(l => l.code === code);
}

export function getLanguagesByWave(wave: string): readonly LanguageConfig[] {
  return LANGUAGE_CONFIGS.filter(l => l.wave === wave);
}

export function getTotalPopulationReach(): number {
  return LANGUAGE_CONFIGS.reduce((sum, l) => sum + l.population_reach_millions, 0);
}

export function getCanonicalOntologyRef(): string {
  return LOCALIZATION_RULES.canonical.ontology;
}
