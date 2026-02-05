/**
 * MUNICIPAL BOARD — PUBLIC SECTOR EXAMPLE
 * 
 * Complete DPD for municipal committee infrastructure decision.
 * Schema-compliant, neutral, non-prescriptive.
 */

import type { DecisionPreparationDocument } from '../types';

export const MUNICIPAL_INFRASTRUCTURE_DPD: DecisionPreparationDocument = {
  dpd_id: 'muni_infra_school_2026_v1',
  generated_at: '2026-08-01T09:00:00Z',
  version: '1.0.0',
  
  overview: {
    decision_subject: 'School infrastructure: New construction vs renovation',
    population_affected: 8500, // students + staff + families
    time_horizon: '30-50 years',
    irreversibility: 'permanent',
    organization_type: 'municipal_board',
    geo_scope: 'Municipality district',
  },
  
  alternatives: [
    {
      id: 'A',
      label: 'New construction on current site',
      description: 'Demolish existing structure, build new facility',
      assumptions: [
        'Temporary relocation feasible',
        'Construction timeline 24-30 months',
        'Population projections stable',
      ],
      requires: ['Temporary facility arrangement', 'Full budget allocation', 'Environmental permits'],
      blocks: ['Site use for 30 months', 'Alternative capital projects'],
    },
    {
      id: 'B',
      label: 'Comprehensive renovation',
      description: 'Phased renovation of existing structure',
      assumptions: [
        'Structural integrity sufficient',
        'Phased operation manageable',
        'Compliance achievable within existing footprint',
      ],
      requires: ['Detailed structural assessment', 'Phased construction plan', 'Interim arrangements'],
      blocks: ['Full capacity use during renovation'],
    },
    {
      id: 'C',
      label: 'New construction on alternate site',
      description: 'Build new facility on available municipal land',
      assumptions: [
        'Alternate site suitable for educational use',
        'Transportation access adequate',
        'Community acceptance achievable',
      ],
      requires: ['Land allocation decision', 'Zoning changes', 'Infrastructure connections'],
      blocks: ['Alternate land use', 'Extended timeline'],
    },
    {
      id: 'D',
      label: 'Defer with maintenance investment',
      description: 'Extend current facility life through targeted maintenance',
      assumptions: [
        'Structural issues addressable short-term',
        'Compliance extensions possible',
        'Future conditions more favorable',
      ],
      requires: ['Maintenance program', 'Compliance negotiation', 'Monitoring protocol'],
      blocks: [],
    },
  ],
  
  relevant_data: [
    {
      source: 'demo.school_age_population.v1',
      metric: 'School-age population projection (5Y)',
      baseline: 3200,
      current: 3450,
      trend: 'improving',
      uncertainty: 0.12,
      last_updated: '2026-07-15',
    },
    {
      source: 'facility.condition_index.v1',
      metric: 'Facility condition index',
      baseline: 0.75,
      current: 0.52,
      trend: 'declining',
      uncertainty: 0.08,
      last_updated: '2026-06-01',
    },
    {
      source: 'finance.construction_cost.v1',
      metric: 'Construction cost index',
      baseline: 100,
      current: 142,
      trend: 'stable',
      uncertainty: 0.15,
      last_updated: '2026-07-01',
    },
    {
      source: 'finance.municipal_debt.v1',
      metric: 'Municipal debt ratio',
      baseline: 0.45,
      current: 0.52,
      trend: 'stable',
      uncertainty: 0.05,
      last_updated: '2026-06-30',
    },
  ],
  
  relevant_indexes: [
    {
      index_id: 'edu.quality_index.v1',
      index_name: 'Educational facility quality index',
      value: 0.58,
      trend: 'declining',
      relevance: 'primary',
    },
    {
      index_id: 'demo.migration_pressure.v1',
      index_name: 'Net migration pressure',
      value: 0.23,
      trend: 'stable',
      relevance: 'secondary',
    },
    {
      index_id: 'finance.borrowing_capacity.v1',
      index_name: 'Available borrowing capacity',
      value: 0.68,
      trend: 'stable',
      relevance: 'primary',
    },
  ],
  
  consequence_surfaces: {
    'A': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'medium', time_dependency: 'front-loaded', notes: 'Highest upfront cost' },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'low', time_dependency: 'multi-year', notes: null },
      { dimension: 'operational', visible_effect: true, uncertainty: 'high', time_dependency: 'disruption period', notes: 'Temporary relocation required' },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'low', time_dependency: 'long-term benefit', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'low', time_dependency: 'permanent', notes: null },
    ],
    'B': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'high', time_dependency: 'phased', notes: 'Cost escalation risk in phased approach' },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'medium', time_dependency: 'staged', notes: null },
      { dimension: 'operational', visible_effect: true, uncertainty: 'high', time_dependency: 'extended disruption', notes: 'Phased operation complexity' },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'medium', time_dependency: 'structural uncertainty', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'medium', time_dependency: 'incremental', notes: null },
    ],
    'C': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'medium', time_dependency: 'extended', notes: 'Additional infrastructure costs' },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'medium', time_dependency: 'delayed start', notes: null },
      { dimension: 'operational', visible_effect: true, uncertainty: 'low', time_dependency: 'minimal disruption', notes: 'Current facility operational during construction' },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'medium', time_dependency: 'community acceptance', notes: null },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'low', time_dependency: 'permanent', notes: 'Site selection locks location' },
    ],
    'D': [
      { dimension: 'economy', visible_effect: true, uncertainty: 'low', time_dependency: 'immediate', notes: 'Lowest short-term cost' },
      { dimension: 'liquidity', visible_effect: true, uncertainty: 'low', time_dependency: 'preserved', notes: null },
      { dimension: 'operational', visible_effect: true, uncertainty: 'medium', time_dependency: 'degradation risk', notes: null },
      { dimension: 'risk_over_time', visible_effect: true, uncertainty: 'high', time_dependency: 'accumulating', notes: 'Deferred costs compound' },
      { dimension: 'reversibility', visible_effect: true, uncertainty: 'low', time_dependency: 'full optionality', notes: null },
    ],
  },
  
  knowledge_status: {
    known: [
      'Current facility condition assessment',
      'Student enrollment data',
      'Available municipal land inventory',
      'Current debt position',
    ],
    uncertain: [
      'Population growth trajectory',
      'Construction cost trajectory',
      'State/federal funding availability',
      'Interest rate environment',
    ],
    unknown: [
      'Future regulatory requirements',
      'Climate adaptation needs',
      'Technology integration requirements',
      'Community migration patterns',
    ],
  },
  
  disclaimers: {
    not_a_recommendation: true,
    does_not_replace_responsibility: true,
    assumes_stated_assumptions: true,
    does_not_apply_to_individuals: true,
    custom: [
      'Cost estimates are preliminary',
      'Population projections carry inherent uncertainty',
      'Regulatory requirements may change',
      'Public consultation not yet conducted',
    ],
  },
  
  constraints_acknowledged: [
    'Municipal debt ceiling',
    'State education facility standards',
    'Environmental regulations',
    'Public procurement requirements',
    'Accessibility compliance',
  ],
  
  assumptions_explicit: [
    'No major economic disruption',
    'Continued state funding formulas',
    'Available construction capacity',
    'Community support process completed',
  ],
};
