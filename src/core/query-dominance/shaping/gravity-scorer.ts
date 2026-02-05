/**
 * DECISION GRAVITY SCORER
 * 
 * All questions get a Decision Gravity Score:
 * - How many are affected?
 * - How long does the decision affect?
 * - How irreversible is it?
 * - How much uncertainty exists?
 * 
 * The system adapts weight to consequence.
 */

import type {
  DecisionGravity,
  GravityComponent,
  UXBehavior,
} from './types';
import type { DecisionBlueprint } from '../types';

/**
 * Calculate Decision Gravity from query and blueprint
 */
export function calculateDecisionGravity(
  query: string,
  blueprint: DecisionBlueprint
): DecisionGravity {
  // Calculate components
  const population = calculatePopulationAffected(query, blueprint);
  const timeHorizon = calculateTimeHorizon(blueprint);
  const reversibility = calculateReversibility(query, blueprint);
  const uncertainty = calculateUncertainty(blueprint);
  const financial = calculateFinancialExposure(query, blueprint);
  
  // Weighted sum
  const numericScore = 
    population.contribution * 0.15 +
    timeHorizon.contribution * 0.25 +
    reversibility.contribution * 0.25 +
    uncertainty.contribution * 0.15 +
    financial.contribution * 0.20;
  
  // Classify
  let score: DecisionGravity['score'] = 'low';
  if (numericScore >= 75) score = 'critical';
  else if (numericScore >= 50) score = 'high';
  else if (numericScore >= 25) score = 'medium';
  
  // Collect reasons
  const reasons: string[] = [];
  if (timeHorizon.value === 'high') reasons.push('multi-year impact');
  if (financial.value === 'high') reasons.push('significant financial exposure');
  if (reversibility.value === 'high') reasons.push('difficult to reverse');
  if (population.value === 'high') reasons.push('affects multiple people');
  if (uncertainty.value === 'high') reasons.push('high uncertainty');
  
  // Determine UX behavior
  const uxBehavior = determineUXBehavior(score, numericScore);
  
  return {
    score,
    numeric_score: Math.round(numericScore),
    components: {
      population_affected: population,
      time_horizon: timeHorizon,
      reversibility: reversibility,
      uncertainty: uncertainty,
      financial_exposure: financial,
    },
    reasons,
    ux_behavior: uxBehavior,
  };
}

/**
 * Calculate population affected
 */
function calculatePopulationAffected(
  query: string,
  blueprint: DecisionBlueprint
): GravityComponent {
  const queryLower = query.toLowerCase();
  
  let value: GravityComponent['value'] = 'low';
  let contribution = 20;
  let rationale = 'Affects primarily the decision-maker';
  
  // Family/household indicators
  if (queryLower.includes('family') || queryLower.includes('kids') || queryLower.includes('household')) {
    value = 'medium';
    contribution = 50;
    rationale = 'Affects family/household members';
  }
  
  // Business/organization indicators
  if (queryLower.includes('company') || queryLower.includes('team') || queryLower.includes('business')) {
    value = 'high';
    contribution = 80;
    rationale = 'Affects organization/multiple stakeholders';
  }
  
  // Policy indicators
  if (blueprint.category === 'policy_society' || queryLower.includes('community')) {
    value = 'high';
    contribution = 90;
    rationale = 'Affects community/population';
  }
  
  return {
    dimension: 'population_affected',
    value,
    weight: 0.15,
    contribution,
    rationale,
  };
}

/**
 * Calculate time horizon gravity
 */
function calculateTimeHorizon(blueprint: DecisionBlueprint): GravityComponent {
  const horizonMap: Record<string, { value: GravityComponent['value']; contribution: number }> = {
    immediate: { value: 'low', contribution: 10 },
    short_term: { value: 'low', contribution: 25 },
    multi_year: { value: 'medium', contribution: 60 },
    lifetime: { value: 'high', contribution: 90 },
  };
  
  const mapped = horizonMap[blueprint.time_horizon] || { value: 'medium', contribution: 50 };
  
  return {
    dimension: 'time_horizon',
    value: mapped.value,
    weight: 0.25,
    contribution: mapped.contribution,
    rationale: `Decision affects ${blueprint.time_horizon.replace('_', ' ')} period`,
  };
}

/**
 * Calculate reversibility
 */
function calculateReversibility(
  query: string,
  blueprint: DecisionBlueprint
): GravityComponent {
  const queryLower = query.toLowerCase();
  
  // Low reversibility (hard to undo)
  const irreversibleTerms = ['surgery', 'tattoo', 'marriage', 'mortgage', 'house', 'career', 'degree'];
  const highReversibility = irreversibleTerms.some(term => queryLower.includes(term));
  
  // Medium reversibility
  const mediumTerms = ['car', 'lease', 'contract', 'subscription', 'job'];
  const mediumReversibility = mediumTerms.some(term => queryLower.includes(term));
  
  if (highReversibility) {
    return {
      dimension: 'reversibility',
      value: 'high',
      weight: 0.25,
      contribution: 85,
      rationale: 'Difficult or costly to reverse',
    };
  }
  
  if (mediumReversibility || blueprint.time_horizon === 'multi_year') {
    return {
      dimension: 'reversibility',
      value: 'medium',
      weight: 0.25,
      contribution: 50,
      rationale: 'Can be reversed with some cost/effort',
    };
  }
  
  return {
    dimension: 'reversibility',
    value: 'low',
    weight: 0.25,
    contribution: 15,
    rationale: 'Easily reversible',
  };
}

/**
 * Calculate uncertainty
 */
function calculateUncertainty(blueprint: DecisionBlueprint): GravityComponent {
  // Higher risk exposure = higher uncertainty contribution
  const riskMap: Record<string, { value: GravityComponent['value']; contribution: number }> = {
    low: { value: 'low', contribution: 15 },
    medium: { value: 'medium', contribution: 45 },
    high: { value: 'high', contribution: 75 },
    critical: { value: 'high', contribution: 95 },
  };
  
  const mapped = riskMap[blueprint.risk_exposure] || { value: 'medium', contribution: 50 };
  
  return {
    dimension: 'uncertainty',
    value: mapped.value,
    weight: 0.15,
    contribution: mapped.contribution,
    rationale: `${blueprint.risk_exposure} uncertainty in outcomes`,
  };
}

/**
 * Calculate financial exposure
 */
function calculateFinancialExposure(
  query: string,
  blueprint: DecisionBlueprint
): GravityComponent {
  const queryLower = query.toLowerCase();
  
  // High financial exposure indicators
  const highFinancialTerms = ['house', 'mortgage', 'investment', 'retirement', 'business', 'startup'];
  const mediumFinancialTerms = ['car', 'furniture', 'appliance', 'vacation', 'renovation'];
  
  if (highFinancialTerms.some(term => queryLower.includes(term))) {
    return {
      dimension: 'financial_exposure',
      value: 'high',
      weight: 0.20,
      contribution: 85,
      rationale: 'Major financial commitment',
    };
  }
  
  if (mediumFinancialTerms.some(term => queryLower.includes(term))) {
    return {
      dimension: 'financial_exposure',
      value: 'medium',
      weight: 0.20,
      contribution: 50,
      rationale: 'Moderate financial commitment',
    };
  }
  
  // Check category for financial implications
  if (blueprint.category === 'financial') {
    return {
      dimension: 'financial_exposure',
      value: 'medium',
      weight: 0.20,
      contribution: 55,
      rationale: 'Financial implications present',
    };
  }
  
  return {
    dimension: 'financial_exposure',
    value: 'low',
    weight: 0.20,
    contribution: 15,
    rationale: 'Limited financial exposure',
  };
}

/**
 * Determine UX behavior based on gravity
 */
function determineUXBehavior(
  score: DecisionGravity['score'],
  _numericScore: number
): UXBehavior {
  switch (score) {
    case 'critical':
      return {
        response_type: 'mandatory_review',
        friction_level: 5,
        required_acknowledgments: [
          'I understand this is a high-stakes decision',
          'I have reviewed the trade-offs',
          'I acknowledge the uncertainties',
        ],
        cooling_off_suggested: true,
        minimum_time_on_page: 120,
      };
    
    case 'high':
      return {
        response_type: 'full_udf',
        friction_level: 4,
        required_acknowledgments: [
          'I have reviewed the key trade-offs',
        ],
        cooling_off_suggested: true,
        minimum_time_on_page: 60,
      };
    
    case 'medium':
      return {
        response_type: 'scope_selection',
        friction_level: 2,
        required_acknowledgments: [],
        cooling_off_suggested: false,
        minimum_time_on_page: 15,
      };
    
    case 'low':
    default:
      return {
        response_type: 'direct',
        friction_level: 1,
        required_acknowledgments: [],
        cooling_off_suggested: false,
        minimum_time_on_page: 0,
      };
  }
}

/**
 * Get gravity summary for display
 */
export function getGravitySummary(gravity: DecisionGravity): {
  badge: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
  description: string;
  recommendation: string;
} {
  switch (gravity.score) {
    case 'critical':
      return {
        badge: 'Critical Decision',
        color: 'red',
        description: 'This decision has significant long-term consequences.',
        recommendation: 'Take time to review all trade-offs and uncertainties carefully.',
      };
    
    case 'high':
      return {
        badge: 'High Stakes',
        color: 'orange',
        description: 'This decision has notable consequences.',
        recommendation: 'Review the key trade-offs before proceeding.',
      };
    
    case 'medium':
      return {
        badge: 'Moderate',
        color: 'yellow',
        description: 'This decision has some meaningful impact.',
        recommendation: 'Consider your specific situation and priorities.',
      };
    
    case 'low':
    default:
      return {
        badge: 'Low Stakes',
        color: 'green',
        description: 'This decision has limited long-term impact.',
        recommendation: 'You can proceed with confidence.',
      };
  }
}

/**
 * GRAVITY SCORER MASTERPROMPT
 */
export const GRAVITY_SCORER_MASTERPROMPT = `
You calculate DECISION GRAVITY SCORES.

ALL QUESTIONS GET A SCORE:
- How many are affected?
- How long does the decision affect?
- How irreversible is it?
- How much uncertainty exists?
- What financial exposure?

GRAVITY LEVELS:

LOW (0-24):
- UX: Direct answer
- Friction: Minimal
- Time: No minimum

MEDIUM (25-49):
- UX: Scope selection
- Friction: Light
- Time: 15 seconds

HIGH (50-74):
- UX: Full UDF + uncertainty
- Friction: Moderate
- Time: 60 seconds minimum
- Cooling-off: Suggested

CRITICAL (75-100):
- UX: Mandatory review
- Friction: High
- Time: 120 seconds minimum
- Acknowledgments: Required
- Cooling-off: Strongly suggested

KEY PRINCIPLE:
No one clicks "quickly" through a heavy decision.
The system makes it physically difficult.

FRICTION IS A FEATURE:
Decision Gravity | UX Behavior
Low              | Direct answer
Medium           | Scope selection
High             | Full UDF + uncertainty
Critical         | Mandatory review + cooling-off

The system adapts weight to consequence.
`;
