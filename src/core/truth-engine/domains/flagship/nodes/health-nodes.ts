/**
 * HEALTH & HUMAN CONDITION — Truth Nodes
 * 
 * Population-level health indicators.
 * NO diagnosis. NO individual advice.
 * 
 * Proves: HCAL, compliance, semantic safety.
 */

import { TruthNode, createTruthNode } from '../../../ontology';

/**
 * HEALTH NODE CATEGORIES
 */
export const HEALTH_CATEGORIES = {
  mental_health: 'Mental Health (Population)',
  physical_health: 'Physical Health (Population)',
  wellbeing: 'Wellbeing & Life Satisfaction',
  lifestyle: 'Lifestyle Factors',
  access: 'Healthcare Access',
} as const;

/**
 * MENTAL HEALTH NODES
 */
export const MENTAL_HEALTH_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'demographic', definition: 'age_16_24' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.92,
      importance_rationale: 'Increasing trend affects future workforce and healthcare demand',
    },
    0.78,
    {
      node_id: 'health_anxiety_youth_se',
      label: 'Anxiety Prevalence (Youth 16-24)',
      description: 'Self-reported anxiety symptoms in population aged 16-24',
      unit: 'percent',
      category: 'mental_health',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'demographic', definition: 'age_25_64' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.85,
      importance_rationale: 'Working-age mental health affects productivity and healthcare costs',
    },
    0.82,
    {
      node_id: 'health_anxiety_adult_se',
      label: 'Anxiety Prevalence (Adults 25-64)',
      description: 'Self-reported anxiety symptoms in working-age population',
      unit: 'percent',
      category: 'mental_health',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'demographic', definition: 'age_16_29' },
      time: { type: 'trend', start: '2015-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.88,
      importance_rationale: 'Depression in young adults predicts long-term societal burden',
    },
    0.75,
    {
      node_id: 'health_depression_young_se',
      label: 'Depression Indicators (Young Adults)',
      description: 'Self-reported depression symptoms in population aged 16-29',
      unit: 'percent',
      category: 'mental_health',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.80,
      importance_rationale: 'Stress is a leading indicator of multiple health outcomes',
    },
    0.72,
    {
      node_id: 'health_stress_population_se',
      label: 'Stress Index (Population)',
      description: 'Population-level stress indicators based on surveys',
      unit: 'index',
      category: 'mental_health',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.78,
      importance_rationale: 'Sleep quality affects cognitive function and health outcomes',
    },
    0.70,
    {
      node_id: 'health_sleep_quality_se',
      label: 'Sleep Quality Index',
      description: 'Population-level sleep quality and duration indicators',
      unit: 'index',
      category: 'mental_health',
    }
  ),
];

/**
 * PHYSICAL HEALTH NODES
 */
export const PHYSICAL_HEALTH_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2000-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.95,
      importance_rationale: 'Life expectancy is the ultimate health outcome measure',
    },
    0.95,
    {
      node_id: 'health_life_expectancy_se',
      label: 'Life Expectancy at Birth',
      description: 'Expected years of life at birth, sex-aggregated',
      unit: 'years',
      category: 'physical_health',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.82,
      importance_rationale: 'Self-rated health predicts mortality and healthcare use',
    },
    0.75,
    {
      node_id: 'health_self_rated_se',
      label: 'Self-Rated Health (Good/Very Good)',
      description: 'Proportion reporting good or very good health',
      unit: 'percent',
      category: 'physical_health',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2005-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.80,
      importance_rationale: 'Obesity is a major predictor of chronic disease burden',
    },
    0.85,
    {
      node_id: 'health_obesity_prevalence_se',
      label: 'Obesity Prevalence (BMI ≥ 30)',
      description: 'Proportion of population with BMI 30 or higher',
      unit: 'percent',
      category: 'physical_health',
    }
  ),
];

/**
 * WELLBEING NODES
 */
export const WELLBEING_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.75,
      importance_rationale: 'Life satisfaction is a broad wellbeing outcome measure',
    },
    0.70,
    {
      node_id: 'health_life_satisfaction_se',
      label: 'Life Satisfaction Index',
      description: 'Average life satisfaction score (0-10 scale)',
      unit: 'score',
      category: 'wellbeing',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2015-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: false,
      acute: false,
      contextual: true,
      importance_score: 0.65,
      importance_rationale: 'Loneliness is an emerging public health concern',
    },
    0.68,
    {
      node_id: 'health_loneliness_se',
      label: 'Loneliness Prevalence',
      description: 'Proportion reporting frequent loneliness',
      unit: 'percent',
      category: 'wellbeing',
    }
  ),
];

/**
 * ALL HEALTH NODES
 */
export const ALL_HEALTH_NODES: TruthNode[] = [
  ...MENTAL_HEALTH_NODES,
  ...PHYSICAL_HEALTH_NODES,
  ...WELLBEING_NODES,
];

/**
 * GET HEALTH NODE BY ID
 */
export function getHealthNode(nodeId: string): TruthNode | undefined {
  return ALL_HEALTH_NODES.find(n => n.node_id === nodeId);
}

/**
 * GET HEALTH NODES BY CATEGORY
 */
export function getHealthNodesByCategory(category: keyof typeof HEALTH_CATEGORIES): TruthNode[] {
  return ALL_HEALTH_NODES.filter(n => 
    (n as any).category === category
  );
}
