/**
 * STEP 5: CONTEXT SKELETON
 * 
 * Generates structure, not content.
 * Rule: Unspecified ⇒ visible as unspecified.
 */

import type { NormalizedIntent, ResolvedEntity, ContextSkeleton } from '../types';

// ═══════════════════════════════════════════════════════════════════
//                         CONTEXT BUILDER
// ═══════════════════════════════════════════════════════════════════

export function buildContextSkeleton(
  intent: NormalizedIntent,
  entity: ResolvedEntity
): ContextSkeleton {
  const description = generateDescription(intent, entity);
  const assumptions = generateAssumptions(intent, entity);
  
  return {
    description,
    affected_population: inferAffectedPopulation(intent),
    geographic_scope: 'unspecified',
    assumptions,
  };
}

function generateDescription(intent: NormalizedIntent, entity: ResolvedEntity): string {
  const descriptions: Record<string, string> = {
    consumer_product_evaluation: `Evaluation of ${entity.name} for personal use.`,
    service_comparison: `Comparison of ${entity.name} service options.`,
    location_assessment: `Assessment of ${entity.name} as a living location.`,
    investment_analysis: `Analysis of ${entity.name} as an investment.`,
    career_decision: `Career decision involving ${entity.name}.`,
    health_choice: `Health-related choice concerning ${entity.name}.`,
    educational_path: `Educational path evaluation for ${entity.name}.`,
    policy_impact: `Impact assessment of ${entity.name} policy.`,
  };
  
  return descriptions[intent.intent_id] || `Decision evaluation for ${entity.name}.`;
}

function generateAssumptions(
  intent: NormalizedIntent,
  _entity: ResolvedEntity
): ContextSkeleton['assumptions'] {
  const baseAssumptions = [
    { text: 'Usage profile unspecified', is_specified: false },
    { text: 'Budget unspecified', is_specified: false },
  ];
  
  // Add intent-specific unspecified assumptions
  const intentAssumptions: Record<string, readonly { text: string; is_specified: false }[]> = {
    consumer_product_evaluation: [
      { text: 'Annual usage unspecified', is_specified: false },
      { text: 'Ownership duration unspecified', is_specified: false },
    ],
    service_comparison: [
      { text: 'Required features unspecified', is_specified: false },
      { text: 'Contract length unspecified', is_specified: false },
    ],
    location_assessment: [
      { text: 'Family situation unspecified', is_specified: false },
      { text: 'Work arrangement unspecified', is_specified: false },
    ],
    investment_analysis: [
      { text: 'Risk tolerance unspecified', is_specified: false },
      { text: 'Investment horizon unspecified', is_specified: false },
      { text: 'Tax situation unspecified', is_specified: false },
    ],
    career_decision: [
      { text: 'Career goals unspecified', is_specified: false },
      { text: 'Work preferences unspecified', is_specified: false },
    ],
    health_choice: [
      { text: 'Medical history unspecified', is_specified: false },
      { text: 'Risk factors unspecified', is_specified: false },
    ],
    educational_path: [
      { text: 'Prior qualifications unspecified', is_specified: false },
      { text: 'Career objectives unspecified', is_specified: false },
    ],
    policy_impact: [
      { text: 'Stakeholder position unspecified', is_specified: false },
      { text: 'Implementation timeline unspecified', is_specified: false },
    ],
  };
  
  return [
    ...baseAssumptions,
    ...(intentAssumptions[intent.intent_id] || []),
  ];
}

function inferAffectedPopulation(intent: NormalizedIntent): string {
  const populationMap: Record<string, string> = {
    consumer_product_evaluation: 'individual',
    service_comparison: 'individual',
    location_assessment: 'household',
    investment_analysis: 'individual',
    career_decision: 'individual',
    health_choice: 'individual',
    educational_path: 'individual',
    policy_impact: 'population',
  };
  
  return populationMap[intent.intent_id] || 'individual';
}
