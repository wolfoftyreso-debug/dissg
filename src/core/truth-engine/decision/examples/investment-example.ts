/**
 * INVESTMENT DECISION EXAMPLE
 * "Bygga ny anläggning"
 * 
 * Complete decision graph for infrastructure investment analysis.
 * This provides QUESTIONS and ANSWERS, never RECOMMENDATIONS.
 */

import type { DecisionGraphSchemaV1 } from '../schema/decision-graph-schema';

export const INVESTMENT_FACILITY_GRAPH: DecisionGraphSchemaV1 = {
  decision_graph_id: 'investment_facility_v1',
  version: 'v1',
  title: 'Investment Analysis: New Facility',
  description: 'Structured question framework for evaluating infrastructure investment decisions. Provides data-driven answers to key questions. Does NOT recommend whether to invest.',
  
  scope: {
    domain: ['economy', 'infrastructure', 'markets'],
    geography: 'SE',
    population: 'industrial_sector',
    time_horizon: '5_years',
  },
  
  nodes: [
    // DEMAND ANALYSIS
    {
      node_id: 'demand_trend',
      question: 'How has demand for this sector changed over the past 10 years?',
      answer_type: 'TREND_CHANGE',
      required: true,
      answer_packet_ref: 'answer:economy:sector_demand_trend:v1',
      params: { sector: '{sector}', period: '10y' },
      status: 'resolved',
      confidence_threshold: 0.7,
      resolved_answer: {
        answer_packet_id: 'ap_demand_001',
        summary: 'Demand increased 34% over 10 years with CAGR of 3.0%. Peak growth 2015-2019, moderation 2020+.',
        data: {
          trend: 'increasing',
          cagr: 0.030,
          periods: [
            { range: '2014-2019', growth: 0.22 },
            { range: '2020-2024', growth: 0.10 },
          ],
        },
        confidence: 0.87,
        data_coverage: 0.95,
        source_count: 4,
        freshness_days: 45,
        limitations: [
          'Does not include unregistered demand',
          'Assumes consistent sector definition across period',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    {
      node_id: 'demand_volatility',
      question: 'How volatile is demand in this sector?',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      required: true,
      answer_packet_ref: 'answer:economy:sector_demand_volatility:v1',
      params: { sector: '{sector}' },
      status: 'resolved',
      confidence_threshold: 0.7,
      resolved_answer: {
        answer_packet_id: 'ap_volatility_001',
        summary: 'Standard deviation of 12% annually. Max drawdown 18% (2020). Volatility within normal industrial range.',
        data: {
          std_dev: 0.12,
          max_drawdown: -0.18,
          volatility_percentile: 45,
        },
        confidence: 0.82,
        data_coverage: 0.90,
        source_count: 3,
        freshness_days: 60,
        limitations: [
          'Based on aggregate sector data',
          'May not reflect subsector variation',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    {
      node_id: 'regional_difference',
      question: 'How does demand differ across regions?',
      answer_type: 'COMPARISON_CONDITIONAL',
      required: true,
      answer_packet_ref: 'answer:economy:sector_regional_comparison:v1',
      params: { sector: '{sector}', country: 'SE' },
      status: 'resolved',
      confidence_threshold: 0.7,
      resolved_answer: {
        answer_packet_id: 'ap_regional_001',
        summary: 'Stockholm region 40% of national demand. Southern regions growing fastest (+5.2% CAGR). Northern regions stable.',
        data: {
          regions: [
            { name: 'Stockholm', share: 0.40, growth: 0.028 },
            { name: 'Västra Götaland', share: 0.22, growth: 0.035 },
            { name: 'Skåne', share: 0.18, growth: 0.052 },
            { name: 'Other', share: 0.20, growth: 0.015 },
          ],
        },
        confidence: 0.79,
        data_coverage: 0.85,
        source_count: 2,
        freshness_days: 90,
        limitations: [
          'Municipal-level data not available',
          'Based on registered transactions only',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // MARKET CONDITIONS
    {
      node_id: 'correlation_rates',
      question: 'How does this sector correlate with interest rates?',
      answer_type: 'CORRELATION_OVERVIEW',
      required: true,
      answer_packet_ref: 'answer:economy:sector_rate_correlation:v1',
      params: { sector: '{sector}' },
      status: 'resolved',
      confidence_threshold: 0.6,
      resolved_answer: {
        answer_packet_id: 'ap_correlation_001',
        summary: 'Negative correlation (-0.45) with rates. Demand typically lags rate changes by 6-12 months.',
        data: {
          correlation: -0.45,
          lag_months: 9,
          significance: 0.95,
        },
        confidence: 0.74,
        data_coverage: 0.80,
        source_count: 3,
        freshness_days: 30,
        limitations: [
          'Correlation does not imply causation',
          'Relationship may differ in extreme scenarios',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    {
      node_id: 'correlation_energy',
      question: 'What is the relationship with energy prices?',
      answer_type: 'CORRELATION_OVERVIEW',
      required: false,
      answer_packet_ref: 'answer:economy:sector_energy_correlation:v1',
      params: { sector: '{sector}' },
      status: 'resolved',
      confidence_threshold: 0.6,
      resolved_answer: {
        answer_packet_id: 'ap_energy_001',
        summary: 'Moderate negative correlation (-0.32). Energy represents 15-20% of operating costs.',
        data: {
          correlation: -0.32,
          cost_share: 0.175,
        },
        confidence: 0.71,
        data_coverage: 0.75,
        source_count: 2,
        freshness_days: 60,
        limitations: [
          'Based on aggregate industry data',
          'Hedging strategies not accounted for',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // SIGNALS
    {
      node_id: 'policy_signal',
      question: 'What policy signals are relevant to this sector?',
      answer_type: 'DESCRIPTIVE_STAT',
      required: false,
      answer_packet_ref: 'answer:signals:policy_volatility:v1',
      params: { sector: '{sector}' },
      status: 'resolved',
      confidence_threshold: 0.5,
      resolved_answer: {
        answer_packet_id: 'ap_policy_001',
        summary: 'Policy Volatility Index at 62 (elevated). 3 major regulatory changes in past 24 months. EU directives pending.',
        data: {
          volatility_index: 62,
          recent_changes: 3,
          pending_regulations: ['EU_Directive_2024_1', 'National_Subsidy_Reform'],
        },
        confidence: 0.68,
        data_coverage: 0.70,
        source_count: 5,
        freshness_days: 14,
        limitations: [
          'Policy outcomes are inherently uncertain',
          'Does not predict implementation timeline',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
  ],
  
  assumptions: [
    {
      assumption_id: 'time_horizon',
      description: 'Analysis assumes 5-year investment horizon',
      impact_level: 'high',
      options: ['3 years', '5 years', '10 years', '15+ years'],
      selected_option: '5 years',
      required: true,
    },
    {
      assumption_id: 'baseline_scenario',
      description: 'Economic conditions remain within historical range',
      impact_level: 'medium',
      required: true,
    },
    {
      assumption_id: 'regulatory_stability',
      description: 'No major regulatory disruption assumed',
      impact_level: 'high',
      required: false,
    },
  ],
  
  signals: [
    {
      signal_type: 'policy',
      index_ref: 'index:signals:policy_volatility:v1',
      current_value: 62,
      trend: 'increasing',
      interpretation: 'Above-normal policy activity detected',
    },
    {
      signal_type: 'media',
      index_ref: 'index:signals:media_attention:v1',
      current_value: 48,
      trend: 'stable',
      interpretation: 'Normal media coverage levels',
    },
  ],
  
  outputs: {
    charts: true,
    tables: true,
    download: ['json', 'csv'],
  },
  
  governance: {
    no_recommendation: true,
    read_only: true,
    audit_trail: true,
    version_locked: true,
  },
  
  created_at: '2024-01-15T09:00:00Z',
  resolved_at: '2024-01-15T10:30:00Z',
};

/**
 * Chart specifications for Investment Decision
 */
export const INVESTMENT_CHART_SPECS = {
  demand_trend: {
    type: 'line',
    title: 'Sector Demand Trend (10Y)',
    x_axis: 'Year',
    y_axis: 'Index (2014=100)',
    annotations: ['Highlight growth phases'],
  },
  volatility_distribution: {
    type: 'boxplot',
    title: 'Demand Volatility Distribution',
    x_axis: 'Year',
    y_axis: 'Annual Change %',
  },
  regional_comparison: {
    type: 'small_multiples',
    title: 'Regional Demand Shares',
    layout: '2x2 grid',
  },
  correlation_matrix: {
    type: 'heatmap',
    title: 'Factor Correlations',
    factors: ['Demand', 'Rates', 'Energy', 'Policy'],
  },
  signal_sparklines: {
    type: 'sparkline_grid',
    title: 'Signal Activity',
    signals: ['policy', 'media', 'events'],
  },
} as const;
