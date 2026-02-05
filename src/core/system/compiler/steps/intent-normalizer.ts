/**
 * STEP 1: INTENT NORMALIZATION
 * 
 * Reduces text → decision intention (language-agnostic).
 * Same intent ⇒ same structure, regardless of language.
 */

import type { RawQuery, NormalizedIntent, IntentClass } from '../types';

// ═══════════════════════════════════════════════════════════════════
//                         INTENT PATTERNS
// ═══════════════════════════════════════════════════════════════════

interface IntentPattern {
  readonly keywords: readonly string[];
  readonly intent_id: IntentClass;
  readonly implicit_choice: string;
  readonly risk_exposure: 'low' | 'medium' | 'high';
  readonly time_horizon_hint: 'immediate' | 'short_term' | 'multi_year' | 'long_term';
}

const INTENT_PATTERNS: readonly IntentPattern[] = [
  // Vehicle / Product evaluation
  {
    keywords: ['car', 'vehicle', 'buy', 'purchase', 'good', 'worth', 'reliable', 'model'],
    intent_id: 'consumer_product_evaluation',
    implicit_choice: 'purchase_vs_not',
    risk_exposure: 'medium',
    time_horizon_hint: 'multi_year',
  },
  // Service comparison
  {
    keywords: ['service', 'provider', 'subscription', 'plan', 'switch'],
    intent_id: 'service_comparison',
    implicit_choice: 'switch_vs_stay',
    risk_exposure: 'low',
    time_horizon_hint: 'short_term',
  },
  // Location assessment
  {
    keywords: ['live', 'move', 'city', 'country', 'relocate', 'neighborhood'],
    intent_id: 'location_assessment',
    implicit_choice: 'relocate_vs_stay',
    risk_exposure: 'high',
    time_horizon_hint: 'long_term',
  },
  // Investment analysis
  {
    keywords: ['invest', 'stock', 'crypto', 'fund', 'portfolio', 'return'],
    intent_id: 'investment_analysis',
    implicit_choice: 'invest_vs_not',
    risk_exposure: 'high',
    time_horizon_hint: 'multi_year',
  },
  // Career decision
  {
    keywords: ['job', 'career', 'profession', 'work', 'salary', 'employer'],
    intent_id: 'career_decision',
    implicit_choice: 'change_vs_stay',
    risk_exposure: 'high',
    time_horizon_hint: 'multi_year',
  },
  // Health choice
  {
    keywords: ['health', 'treatment', 'doctor', 'medicine', 'therapy', 'diet'],
    intent_id: 'health_choice',
    implicit_choice: 'treat_vs_not',
    risk_exposure: 'high',
    time_horizon_hint: 'multi_year',
  },
  // Educational path
  {
    keywords: ['university', 'degree', 'study', 'course', 'school', 'education'],
    intent_id: 'educational_path',
    implicit_choice: 'pursue_vs_not',
    risk_exposure: 'medium',
    time_horizon_hint: 'long_term',
  },
  // Policy impact
  {
    keywords: ['policy', 'law', 'regulation', 'government', 'reform'],
    intent_id: 'policy_impact',
    implicit_choice: 'support_vs_oppose',
    risk_exposure: 'medium',
    time_horizon_hint: 'long_term',
  },
] as const;

// ═══════════════════════════════════════════════════════════════════
//                         NORMALIZER
// ═══════════════════════════════════════════════════════════════════

export function normalizeIntent(query: RawQuery): NormalizedIntent {
  const text = query.query_text.toLowerCase();
  
  let bestMatch: IntentPattern | null = null;
  let bestScore = 0;
  
  for (const pattern of INTENT_PATTERNS) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (text.includes(keyword)) {
        score++;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pattern;
    }
  }
  
  if (bestMatch && bestScore >= 1) {
    return {
      intent_id: bestMatch.intent_id,
      implicit_choice: bestMatch.implicit_choice,
      risk_exposure: bestMatch.risk_exposure,
      time_horizon_hint: bestMatch.time_horizon_hint,
      confidence: Math.min(bestScore / 3, 1),
    };
  }
  
  // Unknown intent
  return {
    intent_id: 'unknown',
    implicit_choice: 'unspecified',
    risk_exposure: 'medium',
    time_horizon_hint: 'multi_year',
    confidence: 0,
  };
}
