/**
 * DECISION BURDEN PRINCIPLE
 * 
 * The more people a decision affects,
 * the clearer the decision-bearer must show
 * they understood the reality they acted in.
 * 
 * System NEVER says what should be done.
 * System ALWAYS shows what was known/unknown/ignored.
 */

/**
 * IMPACT SCALE
 */
export type ImpactScale =
  | 'individual'      // < 100 people
  | 'local'           // 100 - 10,000
  | 'regional'        // 10,000 - 1,000,000
  | 'national'        // 1,000,000 - 100,000,000
  | 'continental'     // 100,000,000 - 1,000,000,000
  | 'global';         // > 1,000,000,000

/**
 * BURDEN LEVEL
 */
export type BurdenLevel =
  | 'minimal'         // Can decide with limited context
  | 'standard'        // Must document key factors
  | 'elevated'        // Must document all known factors
  | 'critical'        // Must document + verify understanding
  | 'maximum';        // Full context freeze required

/**
 * DECISION BURDEN CALCULATION
 */
export function calculateBurden(params: {
  affected_population: number;
  reversibility: 'fully' | 'partially' | 'irreversible';
  time_pressure: 'none' | 'moderate' | 'urgent' | 'crisis';
  uncertainty_level: number; // 0-1
}): {
  burden_level: BurdenLevel;
  impact_scale: ImpactScale;
  documentation_required: string[];
  minimum_context_elements: number;
} {
  const { affected_population, reversibility, uncertainty_level } = params;
  
  // Determine impact scale
  let impact_scale: ImpactScale;
  if (affected_population < 100) impact_scale = 'individual';
  else if (affected_population < 10000) impact_scale = 'local';
  else if (affected_population < 1000000) impact_scale = 'regional';
  else if (affected_population < 100000000) impact_scale = 'national';
  else if (affected_population < 1000000000) impact_scale = 'continental';
  else impact_scale = 'global';
  
  // Calculate burden score
  let score = 0;
  
  // Population impact
  switch (impact_scale) {
    case 'individual': score += 1; break;
    case 'local': score += 2; break;
    case 'regional': score += 3; break;
    case 'national': score += 4; break;
    case 'continental': score += 5; break;
    case 'global': score += 6; break;
  }
  
  // Reversibility
  switch (reversibility) {
    case 'fully': score += 0; break;
    case 'partially': score += 2; break;
    case 'irreversible': score += 4; break;
  }
  
  // Uncertainty penalty
  score += Math.floor(uncertainty_level * 3);
  
  // Determine burden level
  let burden_level: BurdenLevel;
  if (score <= 2) burden_level = 'minimal';
  else if (score <= 4) burden_level = 'standard';
  else if (score <= 7) burden_level = 'elevated';
  else if (score <= 10) burden_level = 'critical';
  else burden_level = 'maximum';
  
  // Documentation requirements
  const documentation_required: string[] = [];
  
  if (burden_level !== 'minimal') {
    documentation_required.push('relevant_data_sources');
  }
  if (burden_level === 'standard' || burden_level === 'elevated') {
    documentation_required.push('known_uncertainties');
    documentation_required.push('key_tradeoffs');
  }
  if (burden_level === 'elevated' || burden_level === 'critical') {
    documentation_required.push('alternative_options');
    documentation_required.push('risk_assessment');
  }
  if (burden_level === 'critical' || burden_level === 'maximum') {
    documentation_required.push('explicit_non_knowledge');
    documentation_required.push('structural_risks');
    documentation_required.push('verification_of_understanding');
  }
  if (burden_level === 'maximum') {
    documentation_required.push('full_context_freeze');
    documentation_required.push('independent_review');
  }
  
  return {
    burden_level,
    impact_scale,
    documentation_required,
    minimum_context_elements: documentation_required.length,
  };
}

/**
 * BURDEN PRINCIPLES
 */
export const BURDEN_PRINCIPLES = {
  never_prescribe: true,
  always_expose: true,
  scale_with_impact: true,
  no_moral_judgment: true,
  structural_only: true,
} as const;
