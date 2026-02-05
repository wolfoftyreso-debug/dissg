/**
 * BRF ROOF RENOVATION — LIVE EXAMPLE
 * 
 * Complete Decision Preparation Document for housing association
 * capital expenditure decision. Schema-compliant, neutral, non-prescriptive.
 */

import type { DecisionPreparationDocument } from '../types';

export const BRF_ROOF_RENOVATION_DPD: DecisionPreparationDocument = {
  dpd_id: 'brf_roof_2026_v1',
  generated_at: '2026-05-10T09:30:00Z',
  version: '1.0.0',
  
  overview: {
    decision_subject: 'Capital expenditure for roof renovation',
    population_affected: 120,
    time_horizon: '10-30 years',
    irreversibility: 'high',
    organization_type: 'housing_association',
    geo_scope: 'Stockholm',
  },
  
  alternatives: [
    {
      id: 'A',
      label: 'Full renovation now',
      description: 'Complete roof replacement within current fiscal year',
      assumptions: [
        'Current damage is near end-of-life threshold',
        'Financing conditions remain stable',
        'Contractor availability is sufficient',
      ],
      requires: ['Board approval', 'Financing arrangement', 'Member notification'],
      blocks: ['Major capital allocation for 24 months'],
    },
    {
      id: 'B',
      label: 'Partial renovation with deferral',
      description: 'Address critical sections now, defer remaining work',
      assumptions: [
        'Damage progression is moderate and predictable',
        'Partial intervention extends serviceability',
      ],
      requires: ['Technical assessment of sections', 'Phased financing'],
      blocks: ['Full renovation option for 12-18 months'],
    },
    {
      id: 'C',
      label: 'Defer and reassess',
      description: 'Maintain monitoring, reassess in 12 months',
      assumptions: [
        'Short-term risk remains within acceptable bounds',
        'No acceleration of degradation observed',
      ],
      requires: ['Enhanced monitoring protocol', 'Contingency reserve'],
      blocks: ['None'],
    },
  ],
  
  relevant_data: [
    {
      source: 'housing.roof_failure_rates.v1',
      metric: 'Roof failure rate',
      baseline: 0.02,
      current: 0.045,
      trend: 'declining',
      uncertainty: 0.15,
      last_updated: '2026-04-01',
    },
    {
      source: 'economy.cost_pressure.v1',
      metric: 'Construction cost index',
      baseline: 100,
      current: 134,
      trend: 'stable',
      uncertainty: 0.08,
      last_updated: '2026-03-15',
    },
  ],
  
  relevant_indexes: [
    {
      index_id: 'housing.pressure_index.v1',
      index_name: 'Housing maintenance pressure',
      value: 0.72,
      trend: 'increasing',
      relevance: 'primary',
    },
    {
      index_id: 'economy.inflation_volatility.v1',
      index_name: 'Inflation volatility',
      value: 0.34,
      trend: 'stable',
      relevance: 'secondary',
    },
  ],
  
  consequence_surfaces: {
    'A': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'medium', time_dependency: 'immediate', notes: null },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'low', time_dependency: 'immediate', notes: null },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'low', time_dependency: 'long-term', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'low', time_dependency: 'permanent', notes: null },
    ],
    'B': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'high', time_dependency: 'phased', notes: null },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'medium', time_dependency: 'staged', notes: null },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'medium', time_dependency: 'medium-term', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'medium', time_dependency: 'conditional', notes: null },
    ],
    'C': [
      { dimension: 'economy', visible_effect: false, uncertainty: 'unknown', time_dependency: 'deferred', notes: null },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'low', time_dependency: 'preserved', notes: null },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'high', time_dependency: 'accumulating', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'low', time_dependency: 'maintained', notes: null },
    ],
  },
  
  knowledge_status: {
    known: [
      'Roof age and material composition',
      'Historical maintenance records',
      'Current condition assessment',
      'Contractor quotes (3 sources)',
    ],
    uncertain: [
      'Rate of degradation under varying conditions',
      'Future financing conditions',
      'Material price trajectory',
    ],
    unknown: [
      'Extreme weather event frequency',
      'Regulatory changes affecting requirements',
      'Long-term interest rate environment',
    ],
  },
  
  disclaimers: {
    not_a_recommendation: true,
    does_not_replace_responsibility: true,
    assumes_stated_assumptions: true,
    does_not_apply_to_individuals: true,
    custom: [
      'All cost estimates are based on current market conditions',
      'Technical assessments should be verified independently',
    ],
  },
  
  constraints_acknowledged: [
    'Budget ceiling',
    'Liquidity preservation requirement',
    'Regulatory compliance timeline',
  ],
  
  assumptions_explicit: [
    'No major structural damage beyond roof',
    'Association maintains adequate insurance',
    'No pending regulatory requirements',
  ],
};
