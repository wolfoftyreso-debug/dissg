/**
 * DEMOGRAPHICS & LONG-TERM STRUCTURE — Truth Nodes
 * 
 * Population structure and civilizational timescales.
 * Long horizon required. Structural focus.
 * 
 * Proves: Civilizational Memory + Long Horizon.
 */

import { TruthNode, createTruthNode } from '../../../ontology';

/**
 * DEMOGRAPHICS CATEGORIES
 */
export const DEMOGRAPHICS_CATEGORIES = {
  age_structure: 'Age Structure',
  population_change: 'Population Change',
  migration: 'Migration Patterns',
  urbanization: 'Urbanization',
  dependency: 'Dependency Ratios',
} as const;

/**
 * AGE STRUCTURE NODES
 */
export const AGE_STRUCTURE_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1900-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.95,
      importance_rationale: 'Median age is the single most important demographic indicator',
    },
    0.98,
    {
      node_id: 'demo_median_age_se',
      label: 'Median Age',
      description: 'Age that divides population into two equal halves',
      unit: 'years',
      category: 'age_structure',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1950-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.88,
      importance_rationale: 'Youth share determines future workforce and innovation capacity',
    },
    0.95,
    {
      node_id: 'demo_youth_share_se',
      label: 'Youth Share (0-14)',
      description: 'Proportion of population aged 0-14',
      unit: 'percent',
      category: 'age_structure',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1950-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.90,
      importance_rationale: 'Working-age share determines economic capacity',
    },
    0.95,
    {
      node_id: 'demo_working_age_share_se',
      label: 'Working-Age Share (15-64)',
      description: 'Proportion of population aged 15-64',
      unit: 'percent',
      category: 'age_structure',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1950-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.92,
      importance_rationale: 'Elderly share determines healthcare and pension demand',
    },
    0.95,
    {
      node_id: 'demo_elderly_share_se',
      label: 'Elderly Share (65+)',
      description: 'Proportion of population aged 65 and over',
      unit: 'percent',
      category: 'age_structure',
    }
  ),
];

/**
 * POPULATION CHANGE NODES
 */
export const POPULATION_CHANGE_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1749-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.98,
      importance_rationale: 'Total population is the foundational demographic measure',
    },
    0.99,
    {
      node_id: 'demo_total_population_se',
      label: 'Total Population',
      description: 'Total resident population count',
      unit: 'persons',
      category: 'population_change',
      historical_note: 'Sweden has continuous population statistics since 1749',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1900-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.92,
      importance_rationale: 'Fertility rate determines long-term population trajectory',
    },
    0.95,
    {
      node_id: 'demo_fertility_rate_se',
      label: 'Total Fertility Rate',
      description: 'Average number of children per woman',
      unit: 'children_per_woman',
      category: 'population_change',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1900-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.85,
      importance_rationale: 'Birth rate affects age structure with 20+ year lag',
    },
    0.95,
    {
      node_id: 'demo_birth_rate_se',
      label: 'Crude Birth Rate',
      description: 'Live births per 1,000 population',
      unit: 'per_1000',
      category: 'population_change',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1900-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.82,
      importance_rationale: 'Death rate reflects health system and age structure',
    },
    0.95,
    {
      node_id: 'demo_death_rate_se',
      label: 'Crude Death Rate',
      description: 'Deaths per 1,000 population',
      unit: 'per_1000',
      category: 'population_change',
    }
  ),
];

/**
 * DEPENDENCY NODES
 */
export const DEPENDENCY_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1950-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.92,
      importance_rationale: 'Dependency ratio determines fiscal sustainability',
    },
    0.95,
    {
      node_id: 'demo_dependency_ratio_total_se',
      label: 'Total Dependency Ratio',
      description: 'Non-working age per 100 working-age population',
      unit: 'ratio',
      category: 'dependency',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1950-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.90,
      importance_rationale: 'Old-age dependency drives pension and healthcare costs',
    },
    0.95,
    {
      node_id: 'demo_dependency_ratio_old_se',
      label: 'Old-Age Dependency Ratio',
      description: 'Population 65+ per 100 working-age population',
      unit: 'ratio',
      category: 'dependency',
    }
  ),
];

/**
 * MIGRATION NODES
 */
export const MIGRATION_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1950-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.85,
      importance_rationale: 'Net migration affects population growth and composition',
    },
    0.88,
    {
      node_id: 'demo_net_migration_se',
      label: 'Net Migration',
      description: 'Immigration minus emigration',
      unit: 'persons',
      category: 'migration',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1970-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.78,
      importance_rationale: 'Foreign-born share indicates demographic composition',
    },
    0.90,
    {
      node_id: 'demo_foreign_born_share_se',
      label: 'Foreign-Born Share',
      description: 'Proportion of population born abroad',
      unit: 'percent',
      category: 'migration',
    }
  ),
];

/**
 * URBANIZATION NODES
 */
export const URBANIZATION_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '1800-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.88,
      importance_rationale: 'Urbanization is one of the most profound structural changes',
    },
    0.92,
    {
      node_id: 'demo_urban_share_se',
      label: 'Urban Population Share',
      description: 'Proportion living in urban areas',
      unit: 'percent',
      category: 'urbanization',
      historical_note: 'Pre-1850 estimates based on historical reconstructions',
    }
  ),
];

/**
 * ALL DEMOGRAPHICS NODES
 */
export const ALL_DEMOGRAPHICS_NODES: TruthNode[] = [
  ...AGE_STRUCTURE_NODES,
  ...POPULATION_CHANGE_NODES,
  ...DEPENDENCY_NODES,
  ...MIGRATION_NODES,
  ...URBANIZATION_NODES,
];

/**
 * GET NODE BY ID
 */
export function getDemographicsNode(nodeId: string): TruthNode | undefined {
  return ALL_DEMOGRAPHICS_NODES.find(n => n.node_id === nodeId);
}
