/**
 * STEP 7: UNCERTAINTY SEEDING
 * 
 * At least one uncertainty is always created.
 */

import type { NormalizedIntent, DecisionBlueprint, UncertaintySeed, UncertaintyType } from '../types';

// ═══════════════════════════════════════════════════════════════════
//                         UNCERTAINTY PATTERNS
// ═══════════════════════════════════════════════════════════════════

interface UncertaintyPattern {
  readonly description: string;
  readonly uncertainty_type: UncertaintyType;
  readonly impact_range: 'low' | 'medium' | 'high';
}

const INTENT_UNCERTAINTIES: Record<string, readonly UncertaintyPattern[]> = {
  consumer_product_evaluation: [
    {
      description: 'Total cost of ownership varies with usage patterns and market prices.',
      uncertainty_type: 'future_variability',
      impact_range: 'medium',
    },
    {
      description: 'Long-term reliability data may not reflect recent model changes.',
      uncertainty_type: 'measurement_error',
      impact_range: 'medium',
    },
  ],
  
  service_comparison: [
    {
      description: 'Service quality and pricing may change during subscription period.',
      uncertainty_type: 'future_variability',
      impact_range: 'medium',
    },
    {
      description: 'User reviews may not represent typical experience.',
      uncertainty_type: 'measurement_error',
      impact_range: 'low',
    },
  ],
  
  location_assessment: [
    {
      description: 'Economic and social conditions may change significantly over time.',
      uncertainty_type: 'future_variability',
      impact_range: 'high',
    },
    {
      description: 'Personal adaptation to new environment is unpredictable.',
      uncertainty_type: 'behavioral_unknown',
      impact_range: 'medium',
    },
  ],
  
  investment_analysis: [
    {
      description: 'Future returns cannot be reliably predicted from historical data.',
      uncertainty_type: 'future_variability',
      impact_range: 'high',
    },
    {
      description: 'Market conditions depend on numerous external factors.',
      uncertainty_type: 'external_dependency',
      impact_range: 'high',
    },
    {
      description: 'Valuation models have inherent limitations.',
      uncertainty_type: 'model_limitation',
      impact_range: 'medium',
    },
  ],
  
  career_decision: [
    {
      description: 'Industry and role demand may change over career span.',
      uncertainty_type: 'future_variability',
      impact_range: 'medium',
    },
    {
      description: 'Personal satisfaction is difficult to predict in advance.',
      uncertainty_type: 'behavioral_unknown',
      impact_range: 'medium',
    },
  ],
  
  health_choice: [
    {
      description: 'Individual response to treatment varies significantly.',
      uncertainty_type: 'behavioral_unknown',
      impact_range: 'high',
    },
    {
      description: 'Long-term effects may not be fully understood.',
      uncertainty_type: 'measurement_error',
      impact_range: 'high',
    },
  ],
  
  educational_path: [
    {
      description: 'Future job market relevance of qualifications is uncertain.',
      uncertainty_type: 'future_variability',
      impact_range: 'medium',
    },
    {
      description: 'Return on educational investment varies by individual.',
      uncertainty_type: 'behavioral_unknown',
      impact_range: 'medium',
    },
  ],
  
  policy_impact: [
    {
      description: 'Implementation effectiveness depends on numerous factors.',
      uncertainty_type: 'external_dependency',
      impact_range: 'high',
    },
    {
      description: 'Unintended consequences are difficult to predict.',
      uncertainty_type: 'model_limitation',
      impact_range: 'high',
    },
  ],
};

const DEFAULT_UNCERTAINTY: UncertaintyPattern = {
  description: 'Future conditions may differ from current expectations.',
  uncertainty_type: 'future_variability',
  impact_range: 'medium',
};

// ═══════════════════════════════════════════════════════════════════
//                         SEEDER
// ═══════════════════════════════════════════════════════════════════

export function seedUncertainties(
  intent: NormalizedIntent,
  blueprint: DecisionBlueprint
): readonly UncertaintySeed[] {
  const patterns = INTENT_UNCERTAINTIES[intent.intent_id] || [DEFAULT_UNCERTAINTY];
  
  // Take required number of uncertainties
  const count = Math.min(patterns.length, Math.max(blueprint.required.uncertainties, 1));
  
  return patterns.slice(0, count).map(pattern => ({
    description: pattern.description,
    uncertainty_type: pattern.uncertainty_type,
    impact_range: pattern.impact_range,
  }));
}
