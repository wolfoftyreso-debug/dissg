/**
 * CORPORATE BOARD — M&A ACQUISITION EXAMPLE
 * 
 * Complete DPD for corporate board acquisition decision.
 * Schema-compliant, neutral, non-prescriptive.
 */

import type { DecisionPreparationDocument } from '../types';

export const CORPORATE_MA_DPD: DecisionPreparationDocument = {
  dpd_id: 'corp_ma_acquisition_2026_v1',
  generated_at: '2026-07-01T10:00:00Z',
  version: '1.0.0',
  
  overview: {
    decision_subject: 'Strategic acquisition: Target company integration',
    population_affected: 2400, // employees affected
    time_horizon: '3-7 years',
    irreversibility: 'high',
    organization_type: 'corporate_board',
    geo_scope: 'EU market',
  },
  
  alternatives: [
    {
      id: 'A',
      label: 'Full acquisition at offered price',
      description: 'Acquire 100% of target at current valuation multiple',
      assumptions: [
        'Synergy estimates achievable within 24 months',
        'Key personnel retention rate >80%',
        'Integration costs within 15% of estimate',
        'No material undisclosed liabilities',
      ],
      requires: ['Board approval', 'Financing commitment', 'Regulatory clearance', 'Due diligence completion'],
      blocks: ['Alternative M&A for 18 months', 'Capital allocation flexibility'],
    },
    {
      id: 'B',
      label: 'Negotiate revised terms',
      description: 'Counter-offer with adjusted valuation and earn-out structure',
      assumptions: [
        'Seller willing to negotiate',
        'Earn-out metrics achievable',
        'Extended timeline acceptable',
      ],
      requires: ['Revised term sheet', 'Updated due diligence', 'Seller agreement'],
      blocks: ['Current timeline', 'Competitive positioning if delayed'],
    },
    {
      id: 'C',
      label: 'Strategic partnership instead',
      description: 'Pursue JV or licensing agreement without full acquisition',
      assumptions: [
        'Core value accessible through partnership',
        'Partner alignment sustainable',
        'Competitive risk manageable',
      ],
      requires: ['Partnership term negotiation', 'IP framework', 'Governance structure'],
      blocks: ['Full integration synergies', 'Complete control'],
    },
    {
      id: 'D',
      label: 'Decline and monitor',
      description: 'Pass on current opportunity, continue market monitoring',
      assumptions: [
        'Alternative targets exist',
        'Strategic gap manageable organically',
        'No competitive disadvantage from inaction',
      ],
      requires: ['Continued market surveillance', 'Organic growth investment'],
      blocks: [],
    },
  ],
  
  relevant_data: [
    {
      source: 'valuation.multiple_analysis.v1',
      metric: 'EV/EBITDA multiple',
      baseline: 8.5,
      current: 11.2,
      trend: 'stable',
      uncertainty: 0.15,
      last_updated: '2026-06-28',
    },
    {
      source: 'synergy.revenue_estimate.v1',
      metric: 'Revenue synergy estimate (M EUR)',
      baseline: null,
      current: 45,
      trend: 'unknown',
      uncertainty: 0.35,
      last_updated: '2026-06-25',
    },
    {
      source: 'synergy.cost_estimate.v1',
      metric: 'Cost synergy estimate (M EUR)',
      baseline: null,
      current: 28,
      trend: 'unknown',
      uncertainty: 0.25,
      last_updated: '2026-06-25',
    },
    {
      source: 'integration.cost_estimate.v1',
      metric: 'Integration cost estimate (M EUR)',
      baseline: null,
      current: 35,
      trend: 'unknown',
      uncertainty: 0.30,
      last_updated: '2026-06-20',
    },
  ],
  
  relevant_indexes: [
    {
      index_id: 'market.sector_ma_activity.v1',
      index_name: 'Sector M&A activity index',
      value: 0.78,
      trend: 'increasing',
      relevance: 'secondary',
    },
    {
      index_id: 'credit.leverage_capacity.v1',
      index_name: 'Available leverage capacity',
      value: 2.4,
      trend: 'stable',
      relevance: 'primary',
    },
    {
      index_id: 'integration.track_record.v1',
      index_name: 'Historical integration success rate',
      value: 0.65,
      trend: 'stable',
      relevance: 'contextual',
    },
  ],
  
  consequence_surfaces: {
    'A': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'high', time_dependency: 'front-loaded costs', notes: 'Synergy realization 18-36 months' },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'medium', time_dependency: 'immediate impact', notes: null },
      { dimension: 'operational', visible_effect: true, uncertainty: 'high', time_dependency: 'integration period', notes: 'Management attention required' },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'high', time_dependency: 'execution dependent', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'low', time_dependency: 'permanent', notes: 'Divestiture only exit' },
    ],
    'B': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'high', time_dependency: 'conditional', notes: 'Earn-out reduces upfront risk' },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'medium', time_dependency: 'staged', notes: null },
      { dimension: 'operational', visible_effect: true, uncertainty: 'medium', time_dependency: 'delayed', notes: null },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'medium', time_dependency: 'shared with seller', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'medium', time_dependency: 'conditional', notes: 'Earn-out failure scenarios' },
    ],
    'C': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'medium', time_dependency: 'limited', notes: 'Partial value capture' },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'low', time_dependency: 'preserved', notes: null },
      { dimension: 'operational', visible_effect: true, uncertainty: 'medium', time_dependency: 'ongoing governance', notes: null },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'medium', time_dependency: 'partner dependency', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'medium', time_dependency: 'contract-bound', notes: null },
    ],
    'D': [
      { dimension: 'economy', visible_effect: false, uncertainty: 'unknown', time_dependency: 'opportunity cost', notes: null },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'low', time_dependency: 'preserved', notes: null },
      { dimension: 'operational', visible_effect: true, uncertainty: 'low', time_dependency: 'unchanged', notes: null },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'medium', time_dependency: 'competitive exposure', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'low', time_dependency: 'full optionality', notes: null },
    ],
  },
  
  knowledge_status: {
    known: [
      'Target financial statements (audited)',
      'Customer concentration data',
      'Key contract terms',
      'Regulatory filing status',
    ],
    uncertain: [
      'Synergy realization timeline',
      'Key employee retention',
      'Customer churn post-acquisition',
      'Integration complexity',
    ],
    unknown: [
      'Undisclosed contingent liabilities',
      'Competitor response',
      'Regulatory approval timeline',
      'Cultural integration challenges',
    ],
  },
  
  disclaimers: {
    not_a_recommendation: true,
    does_not_replace_responsibility: true,
    assumes_stated_assumptions: true,
    does_not_apply_to_individuals: true,
    custom: [
      'Due diligence ongoing; findings may alter analysis',
      'Synergy estimates are projections, not guarantees',
      'Regulatory approval not assured',
      'Market conditions may change',
    ],
  },
  
  constraints_acknowledged: [
    'Maximum leverage ratio: 3.5x',
    'Board approval threshold',
    'Regulatory notification requirements',
    'Shareholder communication obligations',
  ],
  
  assumptions_explicit: [
    'No material adverse change before close',
    'Financing available at current terms',
    'No competing bidder emerges',
    'Key management available for integration',
  ],
};
