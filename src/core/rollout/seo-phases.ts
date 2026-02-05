/**
 * SEO ROLLOUT TACTICS
 * 
 * Three phases:
 * A. Index Seed
 * B. Authority Accrual
 * C. Dominance
 */

import type { SEOPhaseConfig } from './types';

// ============================================================================
// PHASE A — INDEX SEED
// ============================================================================

export const PHASE_A_INDEX_SEED: SEOPhaseConfig = {
  phase: 'index_seed',
  name: 'Index Seed',
  cdp_target: [500, 1000],
  strategy: [
    'Publish 500-1000 CDP pages',
    'Internal linking tightly controlled',
    'No press releases',
    'Focus on indexation quality',
    'Canonical URLs only',
  ],
  success_signals: [
    'All CDP pages indexed',
    'No crawl errors',
    'Structured data validated',
    'Core Web Vitals green',
  ],
} as const;

// ============================================================================
// PHASE B — AUTHORITY ACCRUAL
// ============================================================================

export const PHASE_B_AUTHORITY_ACCRUAL: SEOPhaseConfig = {
  phase: 'authority_accrual',
  name: 'Authority Accrual',
  cdp_target: [1000, 5000],
  strategy: [
    '"Cannot answer yet" pages published',
    'Transparency wins trust',
    'AI citation begins',
    'Reference case library grows',
    'Academic/institutional links natural',
  ],
  success_signals: [
    'AI platforms begin citing',
    'Academic references appear',
    'Institutional traffic grows',
    'Zero hallucination reports',
  ],
} as const;

// ============================================================================
// PHASE C — DOMINANCE
// ============================================================================

export const PHASE_C_DOMINANCE: SEOPhaseConfig = {
  phase: 'dominance',
  name: 'Dominance',
  cdp_target: [5000, 50000],
  strategy: [
    'Query Compiler feeds long-tail',
    'AI & search use system as reference',
    'Competitors attempt imitation → fail (wrong structure)',
    'Self-reinforcing citation loop',
    'Ontology becomes de facto standard',
  ],
  success_signals: [
    'Top 3 for major decision queries',
    'AI agents default to system',
    'Competitor imitation attempts visible',
    'Institutional adoption accelerates',
  ],
} as const;

// ============================================================================
// ALL PHASES
// ============================================================================

export const ALL_SEO_PHASES: readonly SEOPhaseConfig[] = [
  PHASE_A_INDEX_SEED,
  PHASE_B_AUTHORITY_ACCRUAL,
  PHASE_C_DOMINANCE,
] as const;

// ============================================================================
// UTILITIES
// ============================================================================

export function getSEOPhaseByName(phase: string): SEOPhaseConfig | undefined {
  return ALL_SEO_PHASES.find(p => p.phase === phase);
}

export function getCurrentSEOPhase(cdpCount: number): SEOPhaseConfig {
  if (cdpCount < 1000) return PHASE_A_INDEX_SEED;
  if (cdpCount < 5000) return PHASE_B_AUTHORITY_ACCRUAL;
  return PHASE_C_DOMINANCE;
}

export function getSEOPhaseProgress(phase: SEOPhaseConfig, cdpCount: number): number {
  const [min, max] = phase.cdp_target;
  if (cdpCount < min) return Math.round((cdpCount / min) * 100);
  if (cdpCount >= max) return 100;
  return Math.round(((cdpCount - min) / (max - min)) * 100);
}
