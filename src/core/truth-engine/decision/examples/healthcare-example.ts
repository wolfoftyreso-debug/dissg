/**
 * HEALTHCARE PLANNING EXAMPLE
 * "Kapacitetsbehov kommande 12 mån"
 * 
 * Complete decision graph for healthcare capacity planning.
 * Provides structured answers, NOT capacity recommendations.
 */

import type { DecisionGraphSchemaV1 } from '../schema/decision-graph-schema';

export const HEALTHCARE_CAPACITY_GRAPH: DecisionGraphSchemaV1 = {
  decision_graph_id: 'healthcare_capacity_v1',
  version: 'v1',
  title: 'Healthcare Capacity Analysis: 12-Month Outlook',
  description: 'Structured question framework for healthcare capacity planning. Provides historical data, trends, and scenario parameters. Does NOT recommend staffing levels or capacity targets.',
  
  scope: {
    domain: ['healthcare'],
    geography: 'SE',
    population: 'general_population',
    time_horizon: '12_months',
  },
  
  nodes: [
    // HISTORICAL UTILIZATION
    {
      node_id: 'historical_occupancy',
      question: 'What has been the historical bed occupancy rate?',
      answer_type: 'DESCRIPTIVE_STAT',
      required: true,
      answer_packet_ref: 'answer:healthcare:bed_occupancy:v1',
      params: { region: '{region}', period: '5y' },
      status: 'resolved',
      confidence_threshold: 0.8,
      resolved_answer: {
        answer_packet_id: 'ap_hc_occ_001',
        summary: 'Mean occupancy 87% over 5 years. Range 72%-98%. Peak occupancy typically December-February.',
        data: {
          mean_occupancy: 0.87,
          min: 0.72,
          max: 0.98,
          std_dev: 0.06,
          peak_months: [12, 1, 2],
        },
        confidence: 0.91,
        data_coverage: 0.98,
        source_count: 2,
        freshness_days: 30,
        limitations: [
          'Aggregated across all departments',
          'Does not separate planned vs emergency admissions',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // WAIT TIME TRENDS
    {
      node_id: 'wait_time_trend',
      question: 'How have wait times trended over the past 3 years?',
      answer_type: 'TREND_CHANGE',
      required: true,
      answer_packet_ref: 'answer:healthcare:wait_times_trend:v1',
      params: { region: '{region}' },
      status: 'resolved',
      confidence_threshold: 0.7,
      resolved_answer: {
        answer_packet_id: 'ap_hc_wait_001',
        summary: 'Median wait time increased 22% over 3 years. Emergency department wait stable. Elective procedures +35%.',
        data: {
          overall_change: 0.22,
          emergency_change: 0.03,
          elective_change: 0.35,
          current_median_days: 45,
        },
        confidence: 0.84,
        data_coverage: 0.92,
        source_count: 3,
        freshness_days: 45,
        limitations: [
          'Wait time definitions vary by specialty',
          'Patient-initiated delays not separated',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // REGIONAL VARIATION
    {
      node_id: 'regional_variation',
      question: 'How does capacity utilization vary by region?',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      required: true,
      answer_packet_ref: 'answer:healthcare:regional_capacity:v1',
      params: { country: 'SE' },
      status: 'resolved',
      confidence_threshold: 0.7,
      resolved_answer: {
        answer_packet_id: 'ap_hc_region_001',
        summary: 'Coefficient of variation 0.15 across regions. Urban areas run 8-12% higher occupancy than rural.',
        data: {
          cv: 0.15,
          urban_premium: 0.10,
          most_stressed: ['Stockholm', 'Gothenburg'],
          least_stressed: ['Norrbotten', 'Jämtland'],
        },
        confidence: 0.78,
        data_coverage: 0.88,
        source_count: 2,
        freshness_days: 60,
        limitations: [
          'Based on official reporting only',
          'Private capacity not included',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // SEASONAL PATTERNS
    {
      node_id: 'seasonal_patterns',
      question: 'What are the seasonal demand patterns?',
      answer_type: 'CORRELATION_OVERVIEW',
      required: true,
      answer_packet_ref: 'answer:healthcare:seasonal_demand:v1',
      params: { region: '{region}' },
      status: 'resolved',
      confidence_threshold: 0.8,
      resolved_answer: {
        answer_packet_id: 'ap_hc_season_001',
        summary: 'Strong seasonality (amplitude 18%). Peak Dec-Feb, trough Jun-Aug. Pattern stable over 5 years.',
        data: {
          amplitude: 0.18,
          peak_index: 1.12,
          trough_index: 0.88,
          peak_months: [12, 1, 2],
          trough_months: [6, 7, 8],
        },
        confidence: 0.89,
        data_coverage: 0.95,
        source_count: 2,
        freshness_days: 30,
        limitations: [
          'Based on historical patterns',
          'Pandemic years excluded from calculation',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // STAFFING TREND
    {
      node_id: 'staffing_trend',
      question: 'How is healthcare staffing trending?',
      answer_type: 'TREND_CHANGE',
      required: true,
      answer_packet_ref: 'answer:healthcare:staffing_trend:v1',
      params: { region: '{region}' },
      status: 'resolved',
      confidence_threshold: 0.6,
      resolved_answer: {
        answer_packet_id: 'ap_hc_staff_001',
        summary: 'FTE per bed declined 4% over 3 years. Nursing shortage acute. Physician levels stable.',
        data: {
          fte_change: -0.04,
          nursing_vacancy_rate: 0.12,
          physician_vacancy_rate: 0.05,
          turnover_rate: 0.08,
        },
        confidence: 0.72,
        data_coverage: 0.80,
        source_count: 3,
        freshness_days: 90,
        limitations: [
          'Agency staff not consistently reported',
          'Part-time FTE conversion varies',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // SCENARIO MODELING
    {
      node_id: 'scenario_plus10',
      question: 'What would +10% demand change mean for capacity?',
      answer_type: 'SCENARIO_MODEL',
      required: false,
      answer_packet_ref: 'answer:healthcare:demand_scenario:v1',
      params: { change: '+10%' },
      status: 'resolved',
      confidence_threshold: 0.5,
      resolved_answer: {
        answer_packet_id: 'ap_hc_scenario_001',
        summary: 'HYPOTHETICAL: +10% demand would push mean occupancy to 96%. Wait times projected +40-60%.',
        data: {
          scenario_type: 'hypothetical',
          new_occupancy: 0.96,
          wait_time_change_range: [0.40, 0.60],
          stress_threshold_breached: true,
        },
        confidence: 0.55,
        data_coverage: 0.70,
        source_count: 1,
        freshness_days: 30,
        limitations: [
          'THIS IS A SCENARIO, NOT A PREDICTION',
          'Assumes no capacity response',
          'Linear extrapolation only',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    {
      node_id: 'readmission_rate',
      question: 'What are the current readmission rates?',
      answer_type: 'RISK_PREVALENCE',
      required: false,
      answer_packet_ref: 'answer:healthcare:readmission:v1',
      status: 'insufficient_data',
      confidence_threshold: 0.7,
    },
  ],
  
  assumptions: [
    {
      assumption_id: 'baseline_population',
      description: 'Population growth follows official projections (0.8%/year)',
      impact_level: 'medium',
      required: true,
    },
    {
      assumption_id: 'no_pandemic',
      description: 'No major pandemic event in analysis period',
      impact_level: 'high',
      required: true,
    },
    {
      assumption_id: 'staffing_constant',
      description: 'Staffing levels remain at current trajectory',
      impact_level: 'high',
      required: false,
    },
  ],
  
  signals: [
    {
      signal_type: 'events',
      index_ref: 'index:healthcare:flu_activity:v1',
      current_value: 35,
      trend: 'stable',
      interpretation: 'Pre-season flu activity at baseline',
    },
  ],
  
  outputs: {
    charts: true,
    tables: true,
    download: ['json', 'csv', 'pdf'],
  },
  
  governance: {
    no_recommendation: true,
    read_only: true,
    audit_trail: true,
    version_locked: true,
  },
  
  created_at: '2024-01-15T09:00:00Z',
  resolved_at: '2024-01-15T11:00:00Z',
};

/**
 * Chart specifications for Healthcare Planning
 */
export const HEALTHCARE_CHART_SPECS = {
  capacity_timeline: {
    type: 'area',
    title: 'Bed Occupancy Over Time',
    x_axis: 'Month',
    y_axis: 'Occupancy %',
    threshold_line: 0.95,
  },
  seasonal_component: {
    type: 'line',
    title: 'Seasonal Demand Pattern',
    x_axis: 'Month',
    y_axis: 'Demand Index',
  },
  regional_comparison: {
    type: 'bar',
    title: 'Regional Capacity Utilization',
    x_axis: 'Region',
    y_axis: 'Occupancy %',
  },
  scenario_fan: {
    type: 'fan_chart',
    title: 'Scenario Analysis (HYPOTHETICAL)',
    scenarios: ['-10%', 'baseline', '+10%', '+20%'],
    warning: 'Scenarios are NOT predictions',
  },
  wait_time_heatmap: {
    type: 'heatmap',
    title: 'Wait Times by Specialty & Region',
    x_axis: 'Specialty',
    y_axis: 'Region',
  },
} as const;
