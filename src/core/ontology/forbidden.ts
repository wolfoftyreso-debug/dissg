/**
 * FORBIDDEN CONCEPTS
 * 
 * These concepts may NEVER exist in the ontology.
 * If they appear → system violation.
 */

import type { ForbiddenConcept } from './types';

/**
 * All forbidden concepts
 */
export const FORBIDDEN_CONCEPTS: ForbiddenConcept[] = [
  'recommendation',
  'score_ranking',
  'best_option',
  'confidence_score',
  'optimization_target',
];

/**
 * Why each is forbidden
 */
export const FORBIDDEN_RATIONALE: Record<ForbiddenConcept, string> = {
  recommendation: 'System observes, never recommends. Choice belongs to the human.',
  score_ranking: 'Ranking implies preference. Alternatives must be symmetric.',
  best_option: 'No option is inherently best. That is a value judgment.',
  confidence_score: 'Decisions cannot have confidence scores. Only evidence can.',
  optimization_target: 'System does not optimize. Optimization implies desired outcome.',
};

/**
 * Patterns that indicate forbidden concepts
 */
export const FORBIDDEN_PATTERNS: Record<ForbiddenConcept, string[]> = {
  recommendation: [
    'recommend',
    'suggested',
    'advised',
    'should choose',
    'best choice',
    'optimal choice',
  ],
  score_ranking: [
    'ranked',
    'score',
    'rating',
    'first choice',
    'second choice',
    'top option',
  ],
  best_option: [
    'best',
    'optimal',
    'preferred',
    'winner',
    'top pick',
  ],
  confidence_score: [
    'confidence',
    'probability of success',
    'likelihood of outcome',
    'certainty score',
  ],
  optimization_target: [
    'optimize',
    'maximize',
    'minimize',
    'target outcome',
    'desired result',
  ],
};

/**
 * Detect forbidden concepts in text
 */
export function detectForbiddenConcepts(text: string): ForbiddenConcept[] {
  const detected: ForbiddenConcept[] = [];
  const lowerText = text.toLowerCase();
  
  for (const [concept, patterns] of Object.entries(FORBIDDEN_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerText.includes(pattern.toLowerCase())) {
        if (!detected.includes(concept as ForbiddenConcept)) {
          detected.push(concept as ForbiddenConcept);
        }
        break;
      }
    }
  }
  
  return detected;
}

/**
 * Validate object for forbidden concepts
 */
export function validateNoForbiddenConcepts(
  obj: Record<string, unknown>
): { valid: boolean; violations: ForbiddenConcept[] } {
  const violations: ForbiddenConcept[] = [];
  
  // Check all string values
  const checkValue = (value: unknown) => {
    if (typeof value === 'string') {
      const detected = detectForbiddenConcepts(value);
      for (const d of detected) {
        if (!violations.includes(d)) {
          violations.push(d);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const v of Object.values(value)) {
        checkValue(v);
      }
    }
  };
  
  checkValue(obj);
  
  // Check for forbidden field names
  const forbiddenFields = [
    'recommendation',
    'ranking',
    'score',
    'best',
    'optimal',
    'confidence',
    'target',
  ];
  
  const checkFields = (o: Record<string, unknown>) => {
    for (const key of Object.keys(o)) {
      const lowerKey = key.toLowerCase();
      for (const forbidden of forbiddenFields) {
        if (lowerKey.includes(forbidden)) {
          // Determine which concept
          if (lowerKey.includes('recommend')) {
            if (!violations.includes('recommendation')) violations.push('recommendation');
          }
          if (lowerKey.includes('rank') || lowerKey.includes('score')) {
            if (!violations.includes('score_ranking')) violations.push('score_ranking');
          }
          if (lowerKey.includes('best') || lowerKey.includes('optimal')) {
            if (!violations.includes('best_option')) violations.push('best_option');
          }
          if (lowerKey.includes('confidence')) {
            if (!violations.includes('confidence_score')) violations.push('confidence_score');
          }
          if (lowerKey.includes('target') || lowerKey.includes('optim')) {
            if (!violations.includes('optimization_target')) violations.push('optimization_target');
          }
        }
      }
      
      if (typeof o[key] === 'object' && o[key] !== null) {
        checkFields(o[key] as Record<string, unknown>);
      }
    }
  };
  
  checkFields(obj);
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * FORBIDDEN CONCEPTS MASTERPROMPT
 */
export const FORBIDDEN_CONCEPTS_MASTERPROMPT = `
You detect and block FORBIDDEN CONCEPTS.

THESE CONCEPTS MAY NEVER EXIST IN THE ONTOLOGY:

❌ RECOMMENDATION
   System observes, never recommends.
   Choice belongs to the human.

❌ SCORE_RANKING
   Ranking implies preference.
   Alternatives must be symmetric.

❌ BEST_OPTION
   No option is inherently best.
   That is a value judgment.

❌ CONFIDENCE_SCORE (for decisions)
   Decisions cannot have confidence scores.
   Only evidence can.

❌ OPTIMIZATION_TARGET
   System does not optimize.
   Optimization implies desired outcome.

IF ANY OF THESE APPEAR:
→ SYSTEM VIOLATION
→ Block immediately
→ Log the attempt
→ Explain why it's forbidden

This is epistemic hygiene.
The ontology must remain pure.
`;
