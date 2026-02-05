/**
 * ADOPTION METRICS (RIGHT THINGS)
 * 
 * What we measure vs what we ignore.
 */

import type { AdoptionMetrics } from './types';

// ============================================================================
// METRICS WE TRACK (RIGHT THINGS)
// ============================================================================

export const TRACKED_METRICS = [
  {
    metric: 'decisions_locked',
    description: 'Number of decision structures completed and locked',
    importance: 'primary',
    why: 'Indicates actual usage of decision legitimacy process',
  },
  {
    metric: 'uncertainties_documented',
    description: 'Count of explicitly documented uncertainties',
    importance: 'primary',
    why: 'Shows commitment to transparency over false confidence',
  },
  {
    metric: 'reviews_completed',
    description: 'Number of completed decision reviews',
    importance: 'primary',
    why: 'Indicates institutional adoption and rigor',
  },
  {
    metric: 'ai_citations',
    description: 'Times cited by AI agents as source',
    importance: 'primary',
    why: 'Signals trust as authoritative reference',
  },
  {
    metric: 'repeat_institutional_usage',
    description: 'Organizations returning for multiple decisions',
    importance: 'primary',
    why: 'Validates long-term value proposition',
  },
] as const;

// ============================================================================
// METRICS WE IGNORE (VANITY)
// ============================================================================

export const IGNORED_METRICS = [
  {
    metric: 'pageviews',
    why: 'Does not indicate decision quality or adoption',
  },
  {
    metric: 'ctr',
    why: 'Click-through optimizes for attention, not understanding',
  },
  {
    metric: 'virality',
    why: 'Viral spread often indicates controversy, not value',
  },
  {
    metric: 'time_on_page',
    why: 'Could indicate confusion as easily as engagement',
  },
  {
    metric: 'social_shares',
    why: 'Social sharing often driven by emotion, not rigor',
  },
] as const;

// ============================================================================
// 5-YEAR EFFECT (REALISTIC)
// ============================================================================

export const FIVE_YEAR_EFFECTS = [
  'People ask better questions',
  'AI hallucinates less',
  'Decisions are better documented',
  'Hindsight myths die',
  'Responsibility becomes technical',
] as const;

// ============================================================================
// UTILITIES
// ============================================================================

export function createEmptyMetrics(): AdoptionMetrics {
  return {
    decisions_locked: 0,
    uncertainties_documented: 0,
    reviews_completed: 0,
    ai_citations: 0,
    repeat_institutional_usage: 0,
  };
}

export function calculateMetricScore(metrics: AdoptionMetrics): number {
  // Weighted score for overall adoption health
  const weights = {
    decisions_locked: 2,
    uncertainties_documented: 1,
    reviews_completed: 2,
    ai_citations: 3,
    repeat_institutional_usage: 3,
  };
  
  let score = 0;
  score += metrics.decisions_locked * weights.decisions_locked;
  score += metrics.uncertainties_documented * weights.uncertainties_documented;
  score += metrics.reviews_completed * weights.reviews_completed;
  score += metrics.ai_citations * weights.ai_citations;
  score += metrics.repeat_institutional_usage * weights.repeat_institutional_usage;
  
  return score;
}

export function isMetricTracked(metric: string): boolean {
  return TRACKED_METRICS.some(m => m.metric === metric);
}

export function isMetricIgnored(metric: string): boolean {
  return IGNORED_METRICS.some(m => m.metric === metric);
}
