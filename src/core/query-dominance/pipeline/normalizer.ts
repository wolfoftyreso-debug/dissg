/**
 * PIPELINE STAGE 2: QUERY NORMALIZATION
 * 
 * Text → Decision.
 * Same intention = same blueprint.
 * Different language = same structure.
 */

import type { RawSearchIntent, NormalizedIntent } from './types';
import { ALL_DECISION_TYPES } from '../decision-types';

/**
 * Normalize raw intent to decision structure
 */
export function normalizeIntent(raw: RawSearchIntent): NormalizedIntent {
  // Find matching decision type
  const matchedType = findMatchingDecisionType(raw.surface_forms);
  
  return {
    intent_id: raw.intent_id,
    decision_type: matchedType.type_id,
    alternatives_required: matchedType.alternatives_required,
    risk_exposure: matchedType.risk_exposure,
    time_horizon: matchedType.time_horizon,
    domains: extractDomains(matchedType),
    normalized_at: new Date().toISOString(),
  };
}

/**
 * Find matching decision type from surface forms
 */
function findMatchingDecisionType(surfaceForms: string[]) {
  const normalizedForms = surfaceForms.map(f => f.toLowerCase().trim());
  
  let bestMatch = ALL_DECISION_TYPES[0];
  let bestScore = 0;
  
  for (const decisionType of ALL_DECISION_TYPES) {
    for (const pattern of decisionType.query_patterns) {
      const patternNorm = pattern.toLowerCase();
      
      for (const form of normalizedForms) {
        const score = calculatePatternScore(form, patternNorm);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = decisionType;
        }
      }
    }
  }
  
  return bestMatch;
}

/**
 * Calculate pattern match score
 */
function calculatePatternScore(form: string, pattern: string): number {
  // Remove placeholder 'x' from pattern
  const patternWords = pattern.replace(/\bx\b/gi, '').trim().split(/\s+/);
  const formWords = form.split(/\s+/);
  
  let matches = 0;
  for (const pw of patternWords) {
    if (formWords.some(fw => fw.includes(pw) || pw.includes(fw))) {
      matches++;
    }
  }
  
  return patternWords.length > 0 ? matches / patternWords.length : 0;
}

/**
 * Extract domains from decision type
 */
function extractDomains(decisionType: typeof ALL_DECISION_TYPES[0]): string[] {
  const domains: string[] = [];
  
  // Map category to domains
  switch (decisionType.category) {
    case 'consumer_private':
      domains.push('consumer', 'economy');
      break;
    case 'financial':
      domains.push('finance', 'economy', 'risk');
      break;
    case 'health_life':
      domains.push('health', 'medicine');
      break;
    case 'policy_society':
      domains.push('policy', 'society', 'governance');
      break;
    case 'meta_evaluation':
      domains.push('meta', 'reliability');
      break;
  }
  
  // Add reliability domain if risk is high
  if (decisionType.risk_exposure === 'high' || decisionType.risk_exposure === 'critical') {
    if (!domains.includes('reliability')) {
      domains.push('reliability');
    }
  }
  
  return domains;
}

/**
 * Batch normalize intents
 */
export function normalizeIntents(raws: RawSearchIntent[]): NormalizedIntent[] {
  return raws.map(normalizeIntent);
}

/**
 * Check if two intents are equivalent (same blueprint)
 */
export function areIntentsEquivalent(a: NormalizedIntent, b: NormalizedIntent): boolean {
  return (
    a.decision_type === b.decision_type &&
    a.alternatives_required === b.alternatives_required &&
    a.risk_exposure === b.risk_exposure &&
    a.time_horizon === b.time_horizon
  );
}

/**
 * NORMALIZER MASTERPROMPT
 */
export const NORMALIZER_MASTERPROMPT = `
You perform QUERY NORMALIZATION.

PRINCIPLE:
All raw text reduces to Decision Blueprint.
Same intention = same blueprint.
Different language = same structure.
No language dependency in core.

INPUT:
{
  "intent_id": "consumer_product_eval",
  "surface_forms": ["is X good", "should I buy X"]
}

OUTPUT:
{
  "intent_id": "consumer_product_eval",
  "decision_type": "evaluation",
  "alternatives_required": true,
  "risk_exposure": "medium",
  "time_horizon": "multi-year",
  "domains": ["consumer", "economy", "reliability"]
}

RULES:
- Map to ~40 decision types
- Extract implicit choice
- Determine alternatives requirement
- Set risk exposure level
- Set time horizon
- Extract relevant domains

INVARIANT:
Same intention → Same blueprint
Different languages → Same structure
`;
