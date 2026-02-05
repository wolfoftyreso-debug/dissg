/**
 * QUERY CLASSIFIER
 * 
 * Classifies every prompt into exactly one of:
 * - informational → facts, definitions (ok)
 * - decision_relevant → affects choice (structure required)
 * - decision_critical → high gravity (full gates)
 */

import type { QueryClass, ClassifiedQuery } from './types';

// ═══════════════════════════════════════════════════════════════════
//                         CLASSIFICATION PATTERNS
// ═══════════════════════════════════════════════════════════════════

interface ClassificationPattern {
  readonly keywords: readonly string[];
  readonly query_class: QueryClass;
  readonly gravity_modifier: number;
}

const INFORMATIONAL_PATTERNS: readonly string[] = [
  'what is',
  'what are',
  'define',
  'definition',
  'who is',
  'when was',
  'where is',
  'how does',
  'explain',
  'describe',
  'history of',
  'meaning of',
];

const DECISION_RELEVANT_PATTERNS: readonly string[] = [
  'is it good',
  'is it worth',
  'good or bad',
  'pros and cons',
  'advantages',
  'disadvantages',
  'compare',
  'versus',
  'vs',
  'which is better',
  'review',
  'rating',
  'reliable',
  'quality',
];

const DECISION_CRITICAL_PATTERNS: readonly string[] = [
  'should i',
  'should we',
  'should one',
  'would you recommend',
  'do you recommend',
  'is it safe to',
  'can i trust',
  'instead of',
  'switch from',
  'buy or',
  'invest in',
  'move to',
  'quit',
  'change career',
  'marry',
  'divorce',
];

// ═══════════════════════════════════════════════════════════════════
//                         CLASSIFIER
// ═══════════════════════════════════════════════════════════════════

export function classifyQuery(queryText: string): ClassifiedQuery {
  const text = queryText.toLowerCase().trim();
  const indicators: string[] = [];
  
  // Check for decision_critical first (highest priority)
  for (const pattern of DECISION_CRITICAL_PATTERNS) {
    if (text.includes(pattern)) {
      indicators.push(`critical: "${pattern}"`);
    }
  }
  
  if (indicators.length > 0) {
    return {
      query_text: queryText,
      query_class: 'decision_critical',
      confidence: Math.min(0.5 + indicators.length * 0.15, 0.95),
      gravity: calculateGravity(text, 'decision_critical'),
      indicators,
    };
  }
  
  // Check for decision_relevant
  for (const pattern of DECISION_RELEVANT_PATTERNS) {
    if (text.includes(pattern)) {
      indicators.push(`relevant: "${pattern}"`);
    }
  }
  
  if (indicators.length > 0) {
    return {
      query_text: queryText,
      query_class: 'decision_relevant',
      confidence: Math.min(0.5 + indicators.length * 0.15, 0.9),
      gravity: calculateGravity(text, 'decision_relevant'),
      indicators,
    };
  }
  
  // Check for informational
  for (const pattern of INFORMATIONAL_PATTERNS) {
    if (text.includes(pattern)) {
      indicators.push(`info: "${pattern}"`);
    }
  }
  
  if (indicators.length > 0) {
    return {
      query_text: queryText,
      query_class: 'informational',
      confidence: Math.min(0.6 + indicators.length * 0.1, 0.95),
      gravity: 0,
      indicators,
    };
  }
  
  // Default to decision_relevant if unclear (safer)
  return {
    query_text: queryText,
    query_class: 'decision_relevant',
    confidence: 0.4,
    gravity: 0.5,
    indicators: ['default: no clear pattern matched'],
  };
}

function calculateGravity(text: string, queryClass: QueryClass): number {
  if (queryClass === 'informational') return 0;
  
  let gravity = queryClass === 'decision_critical' ? 0.7 : 0.4;
  
  // High gravity modifiers
  const highGravityTerms = [
    'health', 'medical', 'invest', 'money', 'career', 'job',
    'move', 'relocate', 'marriage', 'divorce', 'child', 'children',
    'legal', 'lawsuit', 'surgery', 'treatment', 'mortgage', 'loan',
  ];
  
  for (const term of highGravityTerms) {
    if (text.includes(term)) {
      gravity += 0.1;
    }
  }
  
  return Math.min(gravity, 1.0);
}
