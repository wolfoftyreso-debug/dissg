/**
 * GRM SEED DATA — Multi-domain causal graph
 */

import type { GRMEntity, GRMVariable, GRMIntervention, GRMOutcome, GRMCausalLink } from './types';

const ts = new Date().toISOString();

// ============================================================================
// ENTITIES
// ============================================================================

export const SEED_ENTITIES: GRMEntity[] = [
  { id: 'ent-human', code: 'HUMAN', name: 'Human Adult', category: 'population', domain: 'health', created_at: ts },
  { id: 'ent-economy', code: 'ECONOMY', name: 'National Economy', category: 'economy', domain: 'economics', created_at: ts },
  { id: 'ent-ecosystem', code: 'ECOSYSTEM', name: 'Global Ecosystem', category: 'environment', domain: 'environment', created_at: ts },
  { id: 'ent-society', code: 'SOCIETY', name: 'Society', category: 'institution', domain: 'governance', created_at: ts },
  { id: 'ent-workforce', code: 'WORKFORCE', name: 'Labor Force', category: 'population', domain: 'economics', created_at: ts },
];

// ============================================================================
// VARIABLES
// ============================================================================

export const SEED_VARIABLES: GRMVariable[] = [
  { id: 'var-mito', code: 'MITOCHONDRIAL_DENSITY', name: 'Mitochondrial Density', variable_type: 'biomarker', domain: 'health', unit: 'density/cell', created_at: ts },
  { id: 'var-metabolic', code: 'METABOLIC_HEALTH', name: 'Metabolic Health', variable_type: 'biomarker', domain: 'health', created_at: ts },
  { id: 'var-cortisol', code: 'CORTISOL', name: 'Cortisol Levels', variable_type: 'biomarker', domain: 'health', unit: 'μg/dL', created_at: ts },
  { id: 'var-sleep-q', code: 'SLEEP_QUALITY', name: 'Sleep Quality', variable_type: 'behavioral_metric', domain: 'psychology', unit: 'score 0-100', created_at: ts },
  { id: 'var-cognition', code: 'COGNITIVE_PERF', name: 'Cognitive Performance', variable_type: 'psychological_metric', domain: 'psychology', unit: 'score', created_at: ts },
  { id: 'var-productivity', code: 'PRODUCTIVITY', name: 'Labor Productivity', variable_type: 'economic_indicator', domain: 'economics', unit: 'GDP/hour', created_at: ts },
  { id: 'var-inflammation', code: 'INFLAMMATION', name: 'Chronic Inflammation', variable_type: 'biomarker', domain: 'health', unit: 'CRP mg/L', created_at: ts },
  { id: 'var-borrow-cost', code: 'BORROWING_COST', name: 'Borrowing Cost', variable_type: 'economic_indicator', domain: 'economics', unit: '%', created_at: ts },
  { id: 'var-investment', code: 'INVESTMENT', name: 'Business Investment', variable_type: 'economic_indicator', domain: 'economics', unit: '% GDP', created_at: ts },
  { id: 'var-air-quality', code: 'AIR_QUALITY', name: 'Air Quality Index', variable_type: 'environmental_factor', domain: 'environment', unit: 'AQI', created_at: ts },
  { id: 'var-phys-activity', code: 'PHYSICAL_ACTIVITY', name: 'Physical Activity Level', variable_type: 'behavioral_metric', domain: 'health', unit: 'MET-hours/week', created_at: ts },
  { id: 'var-psych-stress', code: 'PSYCH_STRESS', name: 'Psychological Stress', variable_type: 'psychological_metric', domain: 'psychology', unit: 'PSS score', created_at: ts },
  { id: 'var-healthcare-cost', code: 'HEALTHCARE_COST', name: 'Healthcare Cost', variable_type: 'economic_indicator', domain: 'economics', unit: '$/capita', created_at: ts },
  { id: 'var-income-ineq', code: 'INCOME_INEQUALITY', name: 'Income Inequality', variable_type: 'economic_indicator', domain: 'economics', unit: 'Gini coefficient', created_at: ts },
  { id: 'var-crime', code: 'CRIME_RATE', name: 'Crime Rate', variable_type: 'institutional_metric', domain: 'governance', unit: 'per 100k', created_at: ts },
];

// ============================================================================
// INTERVENTIONS
// ============================================================================

export const SEED_INTERVENTIONS: GRMIntervention[] = [
  { id: 'int-exercise', code: 'EXERCISE', name: 'Regular Exercise', intervention_type: 'lifestyle_change', domain: 'health', target_variable_ids: ['var-mito', 'var-phys-activity'], reversibility: 'reversible', created_at: ts },
  { id: 'int-sleep-ext', code: 'SLEEP_EXTENSION', name: 'Sleep Extension (+1h)', intervention_type: 'lifestyle_change', domain: 'psychology', target_variable_ids: ['var-sleep-q'], reversibility: 'reversible', created_at: ts },
  { id: 'int-rate-hike', code: 'INTEREST_RATE_HIKE', name: 'Interest Rate Increase', intervention_type: 'policy_change', domain: 'economics', target_variable_ids: ['var-borrow-cost'], reversibility: 'reversible', created_at: ts },
  { id: 'int-diet', code: 'DIET_IMPROVEMENT', name: 'Dietary Improvement', intervention_type: 'lifestyle_change', domain: 'nutrition', target_variable_ids: ['var-inflammation'], reversibility: 'reversible', created_at: ts },
  { id: 'int-urban-design', code: 'URBAN_DESIGN', name: 'Walkable Urban Design', intervention_type: 'environmental_intervention', domain: 'urbanization', target_variable_ids: ['var-phys-activity'], estimated_cost_level: 'very_high', reversibility: 'partially_reversible', created_at: ts },
  { id: 'int-sugar-red', code: 'SUGAR_REDUCTION', name: 'Sugar Consumption Reduction 30%', intervention_type: 'behavioral_intervention', domain: 'nutrition', target_variable_ids: ['var-inflammation', 'var-metabolic'], reversibility: 'reversible', created_at: ts },
];

// ============================================================================
// OUTCOMES
// ============================================================================

export const SEED_OUTCOMES: GRMOutcome[] = [
  { id: 'out-longevity', code: 'LONGEVITY', name: 'Longevity', domain: 'health', is_terminal: true, desirability: 'positive', created_at: ts },
  { id: 'out-disease-risk', code: 'DISEASE_RISK', name: 'Disease Risk', domain: 'health', is_terminal: true, desirability: 'negative', created_at: ts },
  { id: 'out-gdp-growth', code: 'GDP_GROWTH', name: 'Economic Growth', domain: 'economics', is_terminal: true, desirability: 'positive', created_at: ts },
  { id: 'out-wellbeing', code: 'WELLBEING', name: 'Population Wellbeing', domain: 'psychology', is_terminal: true, desirability: 'positive', created_at: ts },
  { id: 'out-hc-savings', code: 'HEALTHCARE_SAVINGS', name: 'Healthcare Cost Reduction', domain: 'economics', is_terminal: true, desirability: 'positive', created_at: ts },
];

// ============================================================================
// CAUSAL LINKS — The Graph
// ============================================================================

function link(id: string, sId: string, sLabel: string, sType: 'intervention' | 'variable' | 'entity', sDomain: string, tId: string, tLabel: string, tType: 'variable' | 'outcome', tDomain: string, dir: 'positive' | 'negative', str: number, conf: number, delayDays?: number, duration?: 'short_term' | 'medium_term' | 'long_term' | 'permanent', evidenceCount = 5, pop?: string): GRMCausalLink {
  return {
    id, code: id.toUpperCase(),
    source_type: sType, source_id: sId, source_label: sLabel,
    target_type: tType, target_id: tId, target_label: tLabel,
    direction: dir, strength: str, confidence: dir === 'positive' ? 'moderate' : 'moderate', confidence_score: conf,
    effect_delay_min_days: delayDays || 30, effect_duration: duration || 'medium_term', is_persistent: duration === 'permanent',
    effect_variance: 0.15, evidence_count: evidenceCount, evidence_quality: conf > 0.7 ? 'high' : 'moderate',
    population_scope: pop, source_domain: sDomain as any, target_domain: tDomain as any,
    is_cross_domain: sDomain !== tDomain,
    falsifiable: true,
    created_at: ts, updated_at: ts,
  } as GRMCausalLink;
}

export const SEED_CAUSAL_LINKS: GRMCausalLink[] = [
  // Exercise chain: exercise → mito → metabolic → longevity
  link('cl-ex-mito', 'int-exercise', 'Regular Exercise', 'intervention', 'health', 'var-mito', 'Mitochondrial Density', 'variable', 'health', 'positive', 0.82, 0.85, 42, 'long_term', 12),
  link('cl-mito-meta', 'var-mito', 'Mitochondrial Density', 'variable', 'health', 'var-metabolic', 'Metabolic Health', 'variable', 'health', 'positive', 0.75, 0.80, 60, 'long_term', 8),
  link('cl-meta-long', 'var-metabolic', 'Metabolic Health', 'variable', 'health', 'out-longevity', 'Longevity', 'outcome', 'health', 'positive', 0.70, 0.75, 365, 'permanent', 15),

  // Exercise → inflammation → disease risk
  link('cl-ex-inflam', 'int-exercise', 'Regular Exercise', 'intervention', 'health', 'var-inflammation', 'Chronic Inflammation', 'variable', 'health', 'negative', 0.65, 0.78, 30, 'medium_term', 10),
  link('cl-inflam-disease', 'var-inflammation', 'Chronic Inflammation', 'variable', 'health', 'out-disease-risk', 'Disease Risk', 'outcome', 'health', 'positive', 0.72, 0.82, 180, 'long_term', 20),

  // Sleep chain: sleep → cortisol → cognition → productivity (cross-domain!)
  link('cl-sleep-cortisol', 'int-sleep-ext', 'Sleep Extension', 'intervention', 'psychology', 'var-cortisol', 'Cortisol Levels', 'variable', 'health', 'negative', 0.70, 0.80, 7, 'short_term', 8),
  link('cl-cortisol-cog', 'var-cortisol', 'Cortisol Levels', 'variable', 'health', 'var-cognition', 'Cognitive Performance', 'variable', 'psychology', 'negative', 0.60, 0.72, 14, 'medium_term', 6),
  link('cl-cog-prod', 'var-cognition', 'Cognitive Performance', 'variable', 'psychology', 'var-productivity', 'Labor Productivity', 'variable', 'economics', 'positive', 0.55, 0.65, 30, 'medium_term', 4),
  link('cl-prod-gdp', 'var-productivity', 'Labor Productivity', 'variable', 'economics', 'out-gdp-growth', 'Economic Growth', 'outcome', 'economics', 'positive', 0.80, 0.88, 90, 'long_term', 25),

  // Economic stress → psych stress → sleep → metabolic → lifespan
  link('cl-ineq-stress', 'var-income-ineq', 'Income Inequality', 'variable', 'economics', 'var-psych-stress', 'Psychological Stress', 'variable', 'psychology', 'positive', 0.58, 0.65, 60, 'long_term', 7),
  link('cl-stress-sleep', 'var-psych-stress', 'Psychological Stress', 'variable', 'psychology', 'var-sleep-q', 'Sleep Quality', 'variable', 'psychology', 'negative', 0.65, 0.75, 14, 'medium_term', 9),
  link('cl-sleep-meta', 'var-sleep-q', 'Sleep Quality', 'variable', 'psychology', 'var-metabolic', 'Metabolic Health', 'variable', 'health', 'positive', 0.50, 0.62, 60, 'long_term', 6),

  // Interest rates → borrowing → investment → GDP
  link('cl-rate-borrow', 'int-rate-hike', 'Interest Rate Increase', 'intervention', 'economics', 'var-borrow-cost', 'Borrowing Cost', 'variable', 'economics', 'positive', 0.95, 0.95, 1, 'short_term', 30),
  link('cl-borrow-invest', 'var-borrow-cost', 'Borrowing Cost', 'variable', 'economics', 'var-investment', 'Business Investment', 'variable', 'economics', 'negative', 0.75, 0.85, 90, 'medium_term', 18),
  link('cl-invest-gdp', 'var-investment', 'Business Investment', 'variable', 'economics', 'out-gdp-growth', 'Economic Growth', 'outcome', 'economics', 'positive', 0.82, 0.90, 180, 'long_term', 25),

  // Urban design → physical activity → metabolic → healthcare cost
  link('cl-urban-phys', 'int-urban-design', 'Walkable Urban Design', 'intervention', 'urbanization', 'var-phys-activity', 'Physical Activity Level', 'variable', 'health', 'positive', 0.55, 0.60, 365, 'permanent', 5),
  link('cl-phys-meta', 'var-phys-activity', 'Physical Activity Level', 'variable', 'health', 'var-metabolic', 'Metabolic Health', 'variable', 'health', 'positive', 0.68, 0.75, 60, 'long_term', 12),
  link('cl-meta-hcost', 'var-metabolic', 'Metabolic Health', 'variable', 'health', 'var-healthcare-cost', 'Healthcare Cost', 'variable', 'economics', 'negative', 0.60, 0.68, 365, 'long_term', 8),
  link('cl-hcost-savings', 'var-healthcare-cost', 'Healthcare Cost', 'variable', 'economics', 'out-hc-savings', 'Healthcare Cost Reduction', 'outcome', 'economics', 'negative', 0.85, 0.90, 30, 'long_term', 15),

  // Diet → inflammation → disease
  link('cl-diet-inflam', 'int-diet', 'Dietary Improvement', 'intervention', 'nutrition', 'var-inflammation', 'Chronic Inflammation', 'variable', 'health', 'negative', 0.60, 0.72, 30, 'medium_term', 8),

  // Sugar reduction → metabolic health
  link('cl-sugar-meta', 'int-sugar-red', 'Sugar Reduction 30%', 'intervention', 'nutrition', 'var-metabolic', 'Metabolic Health', 'variable', 'health', 'positive', 0.65, 0.70, 60, 'medium_term', 6),
  link('cl-sugar-inflam', 'int-sugar-red', 'Sugar Reduction 30%', 'intervention', 'nutrition', 'var-inflammation', 'Chronic Inflammation', 'variable', 'health', 'negative', 0.55, 0.65, 30, 'medium_term', 5),

  // Income inequality → crime
  link('cl-ineq-crime', 'var-income-ineq', 'Income Inequality', 'variable', 'economics', 'var-crime', 'Crime Rate', 'variable', 'governance', 'positive', 0.52, 0.60, 180, 'long_term', 10),

  // Cognition → wellbeing
  link('cl-cog-well', 'var-cognition', 'Cognitive Performance', 'variable', 'psychology', 'out-wellbeing', 'Population Wellbeing', 'outcome', 'psychology', 'positive', 0.45, 0.55, 60, 'medium_term', 4),

  // Sleep → wellbeing
  link('cl-sleep-well', 'var-sleep-q', 'Sleep Quality', 'variable', 'psychology', 'out-wellbeing', 'Population Wellbeing', 'outcome', 'psychology', 'positive', 0.70, 0.80, 14, 'medium_term', 12),
];
