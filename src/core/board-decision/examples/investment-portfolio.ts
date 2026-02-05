/**
 * INVESTMENT BOARD — PORTFOLIO REALLOCATION EXAMPLE
 * 
 * Complete DPD for investment committee capital allocation decision.
 * Schema-compliant, neutral, non-prescriptive.
 */

import type { DecisionPreparationDocument } from '../types';

export const INVESTMENT_PORTFOLIO_DPD: DecisionPreparationDocument = {
  dpd_id: 'inv_portfolio_realloc_2026_v1',
  generated_at: '2026-06-15T08:00:00Z',
  version: '1.0.0',
  
  overview: {
    decision_subject: 'Portfolio reallocation: Fixed income to alternative assets',
    population_affected: 45000, // beneficiaries
    time_horizon: '5-15 years',
    irreversibility: 'medium',
    organization_type: 'investment_board',
    geo_scope: 'Nordic region',
  },
  
  alternatives: [
    {
      id: 'A',
      label: 'Maintain current allocation',
      description: 'No change to existing 60/40 equity/fixed income split',
      assumptions: [
        'Current yield environment persists',
        'Liability matching remains adequate',
        'Inflation trajectory stabilizes',
      ],
      requires: ['Annual rebalancing only'],
      blocks: [],
    },
    {
      id: 'B',
      label: 'Shift 10% to infrastructure',
      description: 'Reduce fixed income by 10%, allocate to infrastructure assets',
      assumptions: [
        'Infrastructure provides inflation hedge',
        'Liquidity needs can be met with reduced fixed income',
        'Manager selection does not introduce uncompensated risk',
      ],
      requires: ['Manager due diligence', 'Liquidity stress testing', 'Board policy update'],
      blocks: ['Fixed income allocation for 24 months'],
    },
    {
      id: 'C',
      label: 'Shift 15% to alternatives mix',
      description: 'Reduce fixed income by 15%, allocate across infrastructure, private credit, real assets',
      assumptions: [
        'Diversification benefit exceeds illiquidity cost',
        'Extended liability duration acceptable',
        'Manager capacity available at target allocation',
      ],
      requires: ['Comprehensive alternatives program', 'Updated IPS', 'Custodian setup'],
      blocks: ['Fixed income allocation for 36+ months', 'Liquidity buffer reduction'],
    },
  ],
  
  relevant_data: [
    {
      source: 'market.yield_curve.v1',
      metric: '10Y government yield',
      baseline: 0.015,
      current: 0.032,
      trend: 'stable',
      uncertainty: 0.12,
      last_updated: '2026-06-01',
    },
    {
      source: 'market.inflation_expectations.v1',
      metric: '5Y breakeven inflation',
      baseline: 0.018,
      current: 0.027,
      trend: 'stable',
      uncertainty: 0.18,
      last_updated: '2026-06-01',
    },
    {
      source: 'portfolio.liquidity_ratio.v1',
      metric: 'Liquid assets / 12M liabilities',
      baseline: 1.8,
      current: 1.65,
      trend: 'declining',
      uncertainty: 0.08,
      last_updated: '2026-05-31',
    },
  ],
  
  relevant_indexes: [
    {
      index_id: 'market.volatility_regime.v1',
      index_name: 'Volatility regime indicator',
      value: 0.42,
      trend: 'stable',
      relevance: 'primary',
    },
    {
      index_id: 'pension.funding_ratio.v1',
      index_name: 'Funding ratio',
      value: 1.08,
      trend: 'improving',
      relevance: 'primary',
    },
    {
      index_id: 'market.credit_spread.v1',
      index_name: 'Investment grade spread',
      value: 1.45,
      trend: 'stable',
      relevance: 'secondary',
    },
  ],
  
  consequence_surfaces: {
    'A': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'low', time_dependency: 'continuous', notes: null },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'low', time_dependency: 'maintained', notes: null },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'medium', time_dependency: 'duration exposure', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'low', time_dependency: 'immediate', notes: null },
    ],
    'B': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'medium', time_dependency: 'long-term', notes: 'J-curve effect expected' },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'medium', time_dependency: 'reduced flexibility', notes: null },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'medium', time_dependency: 'diversification benefit', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'high', time_dependency: 'multi-year', notes: 'Secondary market dependency' },
    ],
    'C': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'high', time_dependency: 'extended', notes: 'Manager selection critical' },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'high', time_dependency: 'constrained', notes: null },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'high', time_dependency: 'complexity increase', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'high', time_dependency: '5+ years', notes: 'Limited exit options' },
    ],
  },
  
  knowledge_status: {
    known: [
      'Current portfolio composition',
      'Historical return series',
      'Liability structure and duration',
      'Regulatory constraints',
    ],
    uncertain: [
      'Future yield environment',
      'Inflation trajectory',
      'Alternative asset valuations',
      'Manager alpha persistence',
    ],
    unknown: [
      'Regulatory changes to alternatives',
      'Correlation stability in stress',
      'Secondary market liquidity in crisis',
    ],
  },
  
  disclaimers: {
    not_a_recommendation: true,
    does_not_replace_responsibility: true,
    assumes_stated_assumptions: true,
    does_not_apply_to_individuals: true,
    custom: [
      'Past performance does not indicate future results',
      'Alternative asset valuations are estimates',
      'Liquidity assumptions based on normal market conditions',
    ],
  },
  
  constraints_acknowledged: [
    'Regulatory capital requirements',
    'Minimum liquidity ratio: 1.5x',
    'Maximum alternatives allocation: 25%',
    'ESG policy compliance',
  ],
  
  assumptions_explicit: [
    'No significant liability changes',
    'Continued regulatory framework',
    'Normal market functioning',
  ],
};
