/**
 * ECONOMY & COST OF LIVING — Truth Nodes
 * 
 * Economic indicators without advice.
 * NO investment advice. NO prediction. Scenario only.
 * 
 * Proves: Guardrails + Anti-advice + Anti-narrative.
 */

import { TruthNode, createTruthNode } from '../../../ontology';

/**
 * ECONOMY CATEGORIES
 */
export const ECONOMY_CATEGORIES = {
  inflation: 'Inflation & Prices',
  housing: 'Housing Costs',
  income: 'Income & Purchasing Power',
  interest: 'Interest Rates & Debt',
  employment: 'Employment & Labor',
} as const;

/**
 * INFLATION NODES
 */
export const INFLATION_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2000-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.92,
      importance_rationale: 'CPI affects all household purchasing power',
    },
    0.95,
    {
      node_id: 'econ_cpi_total_se',
      label: 'Consumer Price Index (Total)',
      description: 'Overall inflation rate year-over-year',
      unit: 'percent_change',
      category: 'inflation',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.88,
      importance_rationale: 'Food prices affect all households, especially lower income',
    },
    0.92,
    {
      node_id: 'econ_cpi_food_se',
      label: 'Food Price Index',
      description: 'Food and beverage price changes year-over-year',
      unit: 'percent_change',
      category: 'inflation',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.90,
      importance_rationale: 'Energy prices drive significant household cost variation',
    },
    0.90,
    {
      node_id: 'econ_cpi_energy_se',
      label: 'Energy Price Index',
      description: 'Energy price changes year-over-year',
      unit: 'percent_change',
      category: 'inflation',
    }
  ),
];

/**
 * HOUSING NODES
 */
export const HOUSING_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2005-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.88,
      importance_rationale: 'Housing prices determine wealth and affordability',
    },
    0.92,
    {
      node_id: 'econ_housing_price_index_se',
      label: 'Housing Price Index',
      description: 'Real estate price development',
      unit: 'index',
      category: 'housing',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'quarter' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.85,
      importance_rationale: 'Rent levels affect housing affordability',
    },
    0.88,
    {
      node_id: 'econ_rent_index_se',
      label: 'Rent Price Index',
      description: 'Rental price development',
      unit: 'index',
      category: 'housing',
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
      importance_rationale: 'Housing cost burden indicates affordability stress',
    },
    0.80,
    {
      node_id: 'econ_housing_cost_burden_se',
      label: 'Housing Cost Burden',
      description: 'Housing costs as share of household income',
      unit: 'percent',
      category: 'housing',
    }
  ),
];

/**
 * INCOME NODES
 */
export const INCOME_NODES: TruthNode[] = [
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
      importance_score: 0.85,
      importance_rationale: 'Real wage growth determines living standard changes',
    },
    0.88,
    {
      node_id: 'econ_real_wage_growth_se',
      label: 'Real Wage Growth',
      description: 'Wage growth adjusted for inflation',
      unit: 'percent_change',
      category: 'income',
    }
  ),

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
      importance_score: 0.88,
      importance_rationale: 'Median income reflects typical household situation',
    },
    0.90,
    {
      node_id: 'econ_median_income_se',
      label: 'Median Household Income',
      description: 'Median disposable household income',
      unit: 'sek',
      category: 'income',
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
      importance_score: 0.78,
      importance_rationale: 'Income inequality affects social cohesion',
    },
    0.85,
    {
      node_id: 'econ_gini_coefficient_se',
      label: 'Income Inequality (Gini)',
      description: 'Gini coefficient for disposable income',
      unit: 'coefficient',
      category: 'income',
    }
  ),
];

/**
 * INTEREST RATE NODES
 */
export const INTEREST_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2000-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.90,
      importance_rationale: 'Policy rate affects all borrowing costs',
    },
    0.98,
    {
      node_id: 'econ_policy_rate_se',
      label: 'Riksbank Policy Rate',
      description: 'Central bank policy interest rate',
      unit: 'percent',
      category: 'interest',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.88,
      importance_rationale: 'Mortgage rates directly affect household costs',
    },
    0.92,
    {
      node_id: 'econ_mortgage_rate_se',
      label: 'Average Mortgage Rate',
      description: 'Average interest rate on new mortgages',
      unit: 'percent',
      category: 'interest',
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
      importance_score: 0.85,
      importance_rationale: 'Household debt levels indicate financial vulnerability',
    },
    0.88,
    {
      node_id: 'econ_household_debt_ratio_se',
      label: 'Household Debt-to-Income Ratio',
      description: 'Household debt relative to disposable income',
      unit: 'percent',
      category: 'interest',
    }
  ),
];

/**
 * ALL ECONOMY NODES
 */
export const ALL_ECONOMY_NODES: TruthNode[] = [
  ...INFLATION_NODES,
  ...HOUSING_NODES,
  ...INCOME_NODES,
  ...INTEREST_NODES,
];

/**
 * GET NODE BY ID
 */
export function getEconomyNode(nodeId: string): TruthNode | undefined {
  return ALL_ECONOMY_NODES.find(n => n.node_id === nodeId);
}
