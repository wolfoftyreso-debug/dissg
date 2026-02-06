/**
 * PROBLEM OBJECTS (PO)
 * 
 * STEG 17: META-KATEGORISERING
 * 
 * Ett problem är en informationsavsikt, inte en formulering.
 * "Bolagsskatt i OECD" är inte en fråga – det är ett problemrum.
 * 
 * Problem = nav
 * Frågor = instanser
 */

import type { DomainCode } from '../questions/global-question-types';
import type { AIAgentClass } from '../questions/ai-agent-questions';

/**
 * User Intent Categories
 * What the user is trying to accomplish
 */
export type UserIntent =
  | 'understand_trend'      // How has X changed?
  | 'compare_entities'      // Compare X across Y
  | 'assess_level'          // What is the current level of X?
  | 'historical_reference'  // When did X last happen?
  | 'find_extremes'         // Highest/lowest X
  | 'understand_normal'     // What is normal for X?
  | 'detect_anomaly'        // Is this unusual?
  | 'project_trajectory'    // Where is X heading? (based on data, not speculation)
  | 'find_correlation'      // What moves with X?
  | 'understand_structure'  // How is X organized?
  | 'assess_distribution'   // How is X distributed?
  | 'measure_stability'     // How stable is X?
  | 'find_precedent'        // When did we last see this?
  | 'assess_dependency';    // What depends on X?

/**
 * Core Variable Types
 * The fundamental variables that define a problem space
 */
export type CoreVariable =
  | 'measure'       // The thing being measured (tax rate, population, etc.)
  | 'time'          // Temporal dimension
  | 'geography'     // Spatial dimension
  | 'entity'        // The subject (country, company, sector)
  | 'demographic'   // Population segment
  | 'method';       // Calculation method

/**
 * Problem Object Structure
 * 
 * This is the canonical structure for a problem space.
 * One problem object can generate 300+ query variations.
 */
export interface ProblemObject {
  // Identification
  readonly problem_id: string;            // e.g., "P-ECON-TAX-OECD-001"
  readonly domain: DomainCode;
  readonly subdomain?: string;
  
  // Problem definition
  readonly core_variables: CoreVariable[];
  readonly variable_bindings: VariableBinding[];
  
  // User intents this problem addresses
  readonly user_intents: UserIntent[];
  
  // Agent relevance (0-1 score per agent class)
  readonly agent_relevance: Record<AIAgentClass, number>;
  
  // Connected canonical questions
  readonly canonical_question_ids: string[];
  
  // Facet configuration
  readonly available_facets: FacetType[];
  
  // Query expansion config
  readonly template_categories: QueryTemplateCategory[];
  
  // Metadata
  readonly created_at: string;
  readonly version: number;
  readonly is_active: boolean;
}

/**
 * Variable Binding
 * Maps abstract variables to concrete instances
 */
export interface VariableBinding {
  readonly variable: CoreVariable;
  readonly allowed_values: string[] | 'any';
  readonly default_value?: string;
  readonly display_name_en: string;
  readonly display_name_sv: string;
}

/**
 * Facet Types
 * Treating filters as questions
 */
export type FacetType =
  | 'geographic'    // Sweden, EU, OECD
  | 'temporal'      // 2023, 2010-2020, "last decade"
  | 'demographic'   // Age groups, income levels
  | 'method'        // Per capita, absolute, percentage
  | 'comparison'    // vs average, vs previous year
  | 'granularity';  // National, regional, municipal

/**
 * Query Template Categories
 */
export type QueryTemplateCategory =
  | 'trend'         // How has X changed over time in Y?
  | 'comparison'    // Compare X between A and B
  | 'level'         // What is X in Y?
  | 'ranking'       // Ranking of X across Y
  | 'extremes'      // Highest/lowest X
  | 'normal_range'  // What is normal for X?
  | 'anomaly'       // Is this X value unusual?
  | 'historical'    // When did X last happen?
  | 'dependency'    // What depends on X?
  | 'correlation';  // What moves with X?

/**
 * PROBLEM OBJECT FACTORY
 */
export function createProblemObject(params: {
  problem_id: string;
  domain: DomainCode;
  subdomain?: string;
  core_variables: CoreVariable[];
  variable_bindings: VariableBinding[];
  user_intents: UserIntent[];
  agent_relevance: Record<AIAgentClass, number>;
  canonical_question_ids: string[];
  available_facets?: FacetType[];
  template_categories?: QueryTemplateCategory[];
}): ProblemObject {
  return {
    problem_id: params.problem_id,
    domain: params.domain,
    subdomain: params.subdomain,
    core_variables: params.core_variables,
    variable_bindings: params.variable_bindings,
    user_intents: params.user_intents,
    agent_relevance: params.agent_relevance,
    canonical_question_ids: params.canonical_question_ids,
    available_facets: params.available_facets ?? [
      'geographic', 'temporal', 'demographic', 'method', 'comparison', 'granularity'
    ],
    template_categories: params.template_categories ?? [
      'trend', 'comparison', 'level', 'ranking', 'extremes', 'normal_range'
    ],
    created_at: new Date().toISOString(),
    version: 1,
    is_active: true,
  };
}

/**
 * Calculate Query Expansion Potential
 * 
 * Returns estimated number of query variations this problem can generate
 */
export function calculateExpansionPotential(problem: ProblemObject): {
  intents: number;
  templates_per_intent: number;
  facet_combinations: number;
  total_queries: number;
} {
  const intents = problem.user_intents.length;
  const templates_per_intent = problem.template_categories.length * 3; // ~3 templates per category
  const facet_combinations = Math.pow(2, problem.available_facets.length); // Each facet can be on/off
  
  // Conservative estimate: not all combinations are valid
  const valid_combinations = Math.ceil(facet_combinations * 0.3);
  const total_queries = intents * templates_per_intent * valid_combinations;
  
  return {
    intents,
    templates_per_intent,
    facet_combinations: valid_combinations,
    total_queries,
  };
}

/**
 * SAMPLE PROBLEM OBJECTS
 */
export const SAMPLE_PROBLEM_OBJECTS: ProblemObject[] = [
  createProblemObject({
    problem_id: 'P-ECON-TAX-CORP-001',
    domain: 'TAX',
    subdomain: 'corporate',
    core_variables: ['measure', 'time', 'geography'],
    variable_bindings: [
      { 
        variable: 'measure', 
        allowed_values: ['corporate_tax_rate', 'effective_tax_rate', 'statutory_rate'],
        default_value: 'corporate_tax_rate',
        display_name_en: 'Corporate Tax Rate',
        display_name_sv: 'Bolagsskattesats'
      },
      {
        variable: 'geography',
        allowed_values: 'any',
        default_value: 'OECD',
        display_name_en: 'Region/Country',
        display_name_sv: 'Region/Land'
      },
      {
        variable: 'time',
        allowed_values: 'any',
        default_value: 'latest',
        display_name_en: 'Time Period',
        display_name_sv: 'Tidsperiod'
      }
    ],
    user_intents: [
      'understand_trend',
      'compare_entities',
      'assess_level',
      'historical_reference',
      'find_extremes'
    ],
    agent_relevance: {
      policy: 0.90,
      journalism: 0.75,
      finance: 0.95,
      corporate: 0.90,
      health: 0.20,
      legal: 0.85,
      general: 0.60
    },
    canonical_question_ids: [
      'Q-TAX-CORP-001',
      'Q-TAX-CORP-002',
      'Q-TAX-CORP-003'
    ],
  }),
  
  createProblemObject({
    problem_id: 'P-DEMO-POP-001',
    domain: 'DEMO',
    subdomain: 'population',
    core_variables: ['measure', 'time', 'geography', 'demographic'],
    variable_bindings: [
      {
        variable: 'measure',
        allowed_values: ['population', 'population_growth', 'population_density'],
        default_value: 'population',
        display_name_en: 'Population Measure',
        display_name_sv: 'Befolkningsmått'
      },
      {
        variable: 'geography',
        allowed_values: 'any',
        display_name_en: 'Region/Country',
        display_name_sv: 'Region/Land'
      },
      {
        variable: 'time',
        allowed_values: 'any',
        display_name_en: 'Time Period',
        display_name_sv: 'Tidsperiod'
      },
      {
        variable: 'demographic',
        allowed_values: ['total', 'age_0_14', 'age_15_64', 'age_65_plus', 'by_gender'],
        default_value: 'total',
        display_name_en: 'Demographic Segment',
        display_name_sv: 'Demografiskt segment'
      }
    ],
    user_intents: [
      'understand_trend',
      'compare_entities',
      'assess_level',
      'assess_distribution',
      'project_trajectory'
    ],
    agent_relevance: {
      policy: 0.95,
      journalism: 0.70,
      finance: 0.60,
      corporate: 0.50,
      health: 0.85,
      legal: 0.30,
      general: 0.90
    },
    canonical_question_ids: [
      'Q-DEMO-POP-001',
      'Q-DEMO-POP-002'
    ],
  }),
  
  createProblemObject({
    problem_id: 'P-HEALTH-LIFE-001',
    domain: 'HEALTH',
    subdomain: 'life_expectancy',
    core_variables: ['measure', 'time', 'geography', 'demographic'],
    variable_bindings: [
      {
        variable: 'measure',
        allowed_values: ['life_expectancy', 'healthy_life_years', 'mortality_rate'],
        default_value: 'life_expectancy',
        display_name_en: 'Health Measure',
        display_name_sv: 'Hälsomått'
      },
      {
        variable: 'geography',
        allowed_values: 'any',
        display_name_en: 'Region/Country',
        display_name_sv: 'Region/Land'
      },
      {
        variable: 'time',
        allowed_values: 'any',
        display_name_en: 'Time Period',
        display_name_sv: 'Tidsperiod'
      },
      {
        variable: 'demographic',
        allowed_values: ['total', 'male', 'female', 'by_age_group'],
        default_value: 'total',
        display_name_en: 'Demographic',
        display_name_sv: 'Demografi'
      }
    ],
    user_intents: [
      'understand_trend',
      'compare_entities',
      'assess_level',
      'find_extremes',
      'understand_normal',
      'detect_anomaly'
    ],
    agent_relevance: {
      policy: 0.90,
      journalism: 0.80,
      finance: 0.40,
      corporate: 0.30,
      health: 0.98,
      legal: 0.20,
      general: 0.85
    },
    canonical_question_ids: [
      'Q-HEALTH-LIFE-001',
      'Q-HEALTH-LIFE-002'
    ],
  }),
];

/**
 * PROBLEM SPACE STATISTICS
 */
export function getProblemSpaceStats(problems: ProblemObject[]) {
  const totalExpansion = problems.reduce((sum, p) => {
    return sum + calculateExpansionPotential(p).total_queries;
  }, 0);
  
  return {
    total_problems: problems.length,
    total_canonical_questions: problems.reduce((sum, p) => sum + p.canonical_question_ids.length, 0),
    total_query_surface: totalExpansion,
    average_queries_per_problem: Math.round(totalExpansion / problems.length),
    by_domain: problems.reduce((acc, p) => {
      acc[p.domain] = (acc[p.domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}

/**
 * THE KEY INSIGHT
 * 
 * Fakta är få – frågeytan är enorm.
 * 
 * 1 CQ → 1 Problem Object → 300-600 query-ytor
 * Alla pekar tillbaka till samma svar.
 */
export const PROBLEM_OBJECT_PRINCIPLES = {
  facts_are_few: true,
  query_surface_is_vast: true,
  all_queries_point_to_same_answer: true,
  no_new_content_created: true,
  deterministic_generation: true,
} as const;
