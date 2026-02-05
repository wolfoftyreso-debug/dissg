/**
 * STEP 3: DECISION BLUEPRINT SELECTION
 * 
 * Maps intent → Decision Type + required fields.
 */

import type { NormalizedIntent, DecisionBlueprint } from '../types';

// ═══════════════════════════════════════════════════════════════════
//                         BLUEPRINTS REGISTRY
// ═══════════════════════════════════════════════════════════════════

const BLUEPRINTS: Record<string, DecisionBlueprint> = {
  consumer_product_evaluation: {
    decision_type: 'consumer_product_evaluation',
    required: {
      alternatives: 2,
      uncertainties: 1,
      scope: true,
      time_horizon: true,
    },
    suggested_dimensions: [
      'cost',
      'reliability',
      'resale_value',
      'maintenance',
      'performance',
    ],
  },
  
  service_comparison: {
    decision_type: 'service_comparison',
    required: {
      alternatives: 2,
      uncertainties: 1,
      scope: true,
      time_horizon: true,
    },
    suggested_dimensions: [
      'price',
      'features',
      'availability',
      'support',
      'lock_in',
    ],
  },
  
  location_assessment: {
    decision_type: 'location_assessment',
    required: {
      alternatives: 2,
      uncertainties: 1,
      scope: true,
      time_horizon: true,
    },
    suggested_dimensions: [
      'cost_of_living',
      'employment',
      'quality_of_life',
      'climate',
      'social_network',
    ],
  },
  
  investment_analysis: {
    decision_type: 'investment_analysis',
    required: {
      alternatives: 2,
      uncertainties: 2, // Higher uncertainty requirement
      scope: true,
      time_horizon: true,
    },
    suggested_dimensions: [
      'expected_return',
      'volatility',
      'liquidity',
      'tax_implications',
      'correlation',
    ],
  },
  
  career_decision: {
    decision_type: 'career_decision',
    required: {
      alternatives: 2,
      uncertainties: 1,
      scope: true,
      time_horizon: true,
    },
    suggested_dimensions: [
      'compensation',
      'growth_potential',
      'work_life_balance',
      'skill_development',
      'job_security',
    ],
  },
  
  health_choice: {
    decision_type: 'health_choice',
    required: {
      alternatives: 2,
      uncertainties: 2, // Higher uncertainty requirement
      scope: true,
      time_horizon: true,
    },
    suggested_dimensions: [
      'efficacy',
      'side_effects',
      'cost',
      'accessibility',
      'evidence_quality',
    ],
  },
  
  educational_path: {
    decision_type: 'educational_path',
    required: {
      alternatives: 2,
      uncertainties: 1,
      scope: true,
      time_horizon: true,
    },
    suggested_dimensions: [
      'cost',
      'duration',
      'reputation',
      'career_outcomes',
      'flexibility',
    ],
  },
  
  policy_impact: {
    decision_type: 'policy_impact',
    required: {
      alternatives: 2,
      uncertainties: 2,
      scope: true,
      time_horizon: true,
    },
    suggested_dimensions: [
      'affected_population',
      'economic_impact',
      'implementation_cost',
      'equity',
      'reversibility',
    ],
  },
};

const DEFAULT_BLUEPRINT: DecisionBlueprint = {
  decision_type: 'generic_evaluation',
  required: {
    alternatives: 2,
    uncertainties: 1,
    scope: true,
    time_horizon: true,
  },
  suggested_dimensions: [
    'cost',
    'benefit',
    'risk',
    'timing',
  ],
};

// ═══════════════════════════════════════════════════════════════════
//                         SELECTOR
// ═══════════════════════════════════════════════════════════════════

export function selectBlueprint(intent: NormalizedIntent): DecisionBlueprint {
  return BLUEPRINTS[intent.intent_id] || DEFAULT_BLUEPRINT;
}

export function getBlueprint(blueprintId: string): DecisionBlueprint | undefined {
  return BLUEPRINTS[blueprintId];
}

export function getAllBlueprints(): readonly DecisionBlueprint[] {
  return Object.values(BLUEPRINTS);
}
