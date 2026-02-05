/**
 * GLOBAL ROLLOUT PLAN — TYPES
 * 
 * Decision Legitimacy System — planetary scale
 * 
 * Strategy: Launch structure, not opinion.
 * Launch readability, not "answers".
 * Launch tools for thinking, not truths.
 */

// ============================================================================
// ROLLOUT WAVES
// ============================================================================

export type RolloutWave = 'wave_1_universal' | 'wave_2_institutional' | 'wave_3_global_south';

export interface WaveDefinition {
  readonly id: RolloutWave;
  readonly name: string;
  readonly goal: string;
  readonly timeline_months: readonly [number, number]; // [start, end]
  readonly focus_domains: readonly string[];
  readonly target_regions: readonly string[];
  readonly target_cdp_count: readonly [number, number]; // [min, max]
  readonly success_criteria: readonly string[];
}

// ============================================================================
// LANGUAGE STRATEGY
// ============================================================================

export type LanguagePriority = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface LanguageConfig {
  readonly code: string;
  readonly name: string;
  readonly priority: LanguagePriority;
  readonly population_reach_millions: number;
  readonly wave: RolloutWave;
  readonly localization_scope: 'ui_only' | 'ui_and_examples' | 'full';
}

// ============================================================================
// REGIONAL STRATEGY
// ============================================================================

export type RegionCode = 'eu' | 'uk' | 'us' | 'ca' | 'au' | 'jp' | 'latam' | 'mena' | 'africa' | 'asia' | 'global';

export interface RegionConfig {
  readonly code: RegionCode;
  readonly name: string;
  readonly wave: RolloutWave;
  readonly priority: number;
  readonly regulatory_notes: string;
  readonly primary_languages: readonly string[];
  readonly gdpr_applicable: boolean;
  readonly ccpa_applicable: boolean;
}

// ============================================================================
// SEO ROLLOUT PHASES
// ============================================================================

export type SEOPhase = 'index_seed' | 'authority_accrual' | 'dominance';

export interface SEOPhaseConfig {
  readonly phase: SEOPhase;
  readonly name: string;
  readonly cdp_target: readonly [number, number];
  readonly strategy: readonly string[];
  readonly success_signals: readonly string[];
}

// ============================================================================
// ADOPTION METRICS
// ============================================================================

export interface AdoptionMetrics {
  // What we measure (RIGHT things)
  readonly decisions_locked: number;
  readonly uncertainties_documented: number;
  readonly reviews_completed: number;
  readonly ai_citations: number;
  readonly repeat_institutional_usage: number;
  
  // What we ignore (vanity metrics)
  // pageviews, CTR, virality - NOT TRACKED
}

// ============================================================================
// BUSINESS MODEL
// ============================================================================

export type TierType = 'free' | 'paid' | 'forbidden';

export interface BusinessModelItem {
  readonly feature: string;
  readonly tier: TierType;
  readonly description: string;
}

// ============================================================================
// RISK MANAGEMENT
// ============================================================================

export interface RiskMitigation {
  readonly risk: string;
  readonly description: string;
  readonly countermeasure: string;
  readonly severity: 'low' | 'medium' | 'high';
}

// ============================================================================
// ROLLOUT STATUS
// ============================================================================

export interface RolloutStatus {
  readonly current_wave: RolloutWave;
  readonly current_seo_phase: SEOPhase;
  readonly cdp_count: number;
  readonly languages_active: readonly string[];
  readonly regions_active: readonly RegionCode[];
  readonly metrics: AdoptionMetrics;
}
