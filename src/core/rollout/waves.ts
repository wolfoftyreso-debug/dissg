/**
 * ROLLOUT WAVES CONFIGURATION
 * 
 * Three waves over 12-24 months:
 * 1. Universal Decisions (Global, English)
 * 2. Institutional Decisions (Regions)
 * 3. Mass Language + Global South
 */

import type { WaveDefinition } from './types';

// ============================================================================
// WAVE 1 — UNIVERSAL DECISIONS (GLOBAL, ENGLISH)
// ============================================================================

export const WAVE_1_UNIVERSAL: WaveDefinition = {
  id: 'wave_1_universal',
  name: 'Universal Decisions',
  goal: 'Become reference in search + AI',
  timeline_months: [0, 6],
  focus_domains: [
    'consumer_decisions',      // cars, housing, education
    'finance_light',           // personal economy (not trading advice)
    'health_light',            // normality, prevalence, risk framing (not diagnosis)
  ],
  target_regions: ['global'],
  target_cdp_count: [1000, 5000],
  success_criteria: [
    'Query Compiler in full operation',
    'AI agents begin citing',
    'High search volume capture',
    'Low regulatory friction confirmed',
  ],
} as const;

// ============================================================================
// WAVE 2 — INSTITUTIONAL DECISIONS (REGIONS)
// ============================================================================

export const WAVE_2_INSTITUTIONAL: WaveDefinition = {
  id: 'wave_2_institutional',
  name: 'Institutional Decisions',
  goal: 'Become standard for serious decisions',
  timeline_months: [6, 12],
  focus_domains: [
    'board_decisions',
    'capital_allocation',
    'public_policy_reference',  // read-only reference cases
  ],
  target_regions: ['eu', 'uk', 'ca', 'au', 'jp'],
  target_cdp_count: [5000, 15000],
  success_criteria: [
    'Reference case library established',
    'Compliance adoption (without certification)',
    'Audit interest from institutions',
    'Enterprise pilot programs',
  ],
} as const;

// ============================================================================
// WAVE 3 — MASS LANGUAGE + GLOBAL SOUTH
// ============================================================================

export const WAVE_3_GLOBAL_SOUTH: WaveDefinition = {
  id: 'wave_3_global_south',
  name: 'Mass Language + Global South',
  goal: 'Become cognitive infrastructure',
  timeline_months: [12, 24],
  focus_domains: [
    'all_domains',
    'localized_examples',
    'regional_units',
  ],
  target_regions: ['latam', 'mena', 'africa', 'asia'],
  target_cdp_count: [15000, 50000],
  success_criteria: [
    'Global interoperability without culture war',
    'Same ontology across all languages',
    'No localization of truth',
    'Only language, examples, units localized',
  ],
} as const;

// ============================================================================
// ALL WAVES
// ============================================================================

export const ALL_WAVES: readonly WaveDefinition[] = [
  WAVE_1_UNIVERSAL,
  WAVE_2_INSTITUTIONAL,
  WAVE_3_GLOBAL_SOUTH,
] as const;

// ============================================================================
// WAVE UTILITIES
// ============================================================================

export function getWaveById(id: string): WaveDefinition | undefined {
  return ALL_WAVES.find(w => w.id === id);
}

export function getCurrentWave(monthsSinceLaunch: number): WaveDefinition {
  for (const wave of ALL_WAVES) {
    if (monthsSinceLaunch >= wave.timeline_months[0] && 
        monthsSinceLaunch < wave.timeline_months[1]) {
      return wave;
    }
  }
  return WAVE_3_GLOBAL_SOUTH; // Default to final wave
}

export function getWaveProgress(wave: WaveDefinition, cdpCount: number): number {
  const [min, _max] = wave.target_cdp_count;
  return Math.min(100, Math.round((cdpCount / min) * 100));
}
