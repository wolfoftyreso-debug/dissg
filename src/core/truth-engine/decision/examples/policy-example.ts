/**
 * POLICY DECISION EXAMPLE
 * "Skolreform – riskbild"
 * 
 * Complete decision graph for policy impact assessment.
 * Provides historical context and data patterns, NOT policy recommendations.
 */

import type { DecisionGraphSchemaV1 } from '../schema/decision-graph-schema';

export const POLICY_SCHOOL_REFORM_GRAPH: DecisionGraphSchemaV1 = {
  decision_graph_id: 'policy_school_reform_v1',
  version: 'v1',
  title: 'Policy Assessment: School Reform Risk Profile',
  description: 'Structured question framework for assessing education policy changes. Provides historical data on similar reforms and current system state. Does NOT recommend for or against the policy.',
  
  scope: {
    domain: ['education', 'society'],
    geography: 'SE',
    population: 'school_age_cohort',
    time_horizon: '10_years',
  },
  
  nodes: [
    // HISTORICAL PRECEDENT
    {
      node_id: 'historical_reforms',
      question: 'What outcomes have similar reforms had historically?',
      answer_type: 'COMPARISON_CONDITIONAL',
      required: true,
      answer_packet_ref: 'answer:education:reform_outcomes:v1',
      params: { reform_type: 'structural', countries: 'nordic' },
      status: 'resolved',
      confidence_threshold: 0.6,
      resolved_answer: {
        answer_packet_id: 'ap_edu_reform_001',
        summary: 'Of 8 comparable Nordic reforms since 1990: 3 achieved stated goals, 2 neutral, 3 reversed. Mean implementation lag: 5 years.',
        data: {
          comparable_reforms: 8,
          success_count: 3,
          neutral_count: 2,
          reversed_count: 3,
          mean_implementation_years: 5,
          assessment_methodology: 'OECD_defined_metrics',
        },
        confidence: 0.68,
        data_coverage: 0.75,
        source_count: 4,
        freshness_days: 180,
        limitations: [
          'Success definitions vary by country',
          'Context-dependent outcomes',
          'Long-term effects still emerging for recent reforms',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // CURRENT VARIATION
    {
      node_id: 'result_variation',
      question: 'What is the normal variation in education outcomes?',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      required: true,
      answer_packet_ref: 'answer:education:outcome_distribution:v1',
      params: { country: 'SE', metric: 'achievement_scores' },
      status: 'resolved',
      confidence_threshold: 0.7,
      resolved_answer: {
        answer_packet_id: 'ap_edu_var_001',
        summary: 'Achievement score std dev: 85 points. Top decile vs bottom decile gap: 180 points. Regional variation: ±12%.',
        data: {
          std_dev: 85,
          decile_gap: 180,
          regional_cv: 0.12,
          urban_rural_gap: 25,
        },
        confidence: 0.82,
        data_coverage: 0.90,
        source_count: 2,
        freshness_days: 120,
        limitations: [
          'Based on standardized testing only',
          'Does not capture non-cognitive outcomes',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // CORRELATION WITH TEACHER DENSITY
    {
      node_id: 'teacher_correlation',
      question: 'How do outcomes correlate with teacher density?',
      answer_type: 'CORRELATION_OVERVIEW',
      required: true,
      answer_packet_ref: 'answer:education:teacher_outcomes:v1',
      params: { country: 'SE' },
      status: 'resolved',
      confidence_threshold: 0.6,
      resolved_answer: {
        answer_packet_id: 'ap_edu_teach_001',
        summary: 'Positive correlation (r=0.42) between teacher-student ratio and outcomes. Effect stronger in lower SES areas.',
        data: {
          correlation: 0.42,
          ses_interaction: 'stronger_for_low_ses',
          threshold_effect: 'below_1:20_ratio',
          significance: 0.99,
        },
        confidence: 0.76,
        data_coverage: 0.85,
        source_count: 3,
        freshness_days: 90,
        limitations: [
          'Correlation does not establish causation',
          'Teacher quality not controlled for',
          'School selection effects possible',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // AFFECTED POPULATIONS
    {
      node_id: 'affected_groups',
      question: 'Which student groups are most affected by system changes?',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      required: true,
      answer_packet_ref: 'answer:education:sensitivity_groups:v1',
      params: { country: 'SE' },
      status: 'resolved',
      confidence_threshold: 0.7,
      resolved_answer: {
        answer_packet_id: 'ap_edu_groups_001',
        summary: 'Historical sensitivity highest for: special needs students, newly arrived immigrants, low-SES urban areas.',
        data: {
          high_sensitivity_groups: [
            'special_needs',
            'newly_arrived',
            'low_ses_urban',
          ],
          medium_sensitivity_groups: [
            'rural_students',
            'vocational_track',
          ],
          sensitivity_index_range: [0.3, 0.8],
        },
        confidence: 0.74,
        data_coverage: 0.80,
        source_count: 4,
        freshness_days: 60,
        limitations: [
          'Based on historical reform responses',
          'Group definitions may shift over time',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
    
    // SYSTEM DEPENDENCIES
    {
      node_id: 'system_dependencies',
      question: 'What other systems depend on current education structure?',
      answer_type: 'CORRELATION_OVERVIEW',
      required: false,
      answer_packet_ref: 'answer:education:system_dependencies:v1',
      params: { country: 'SE' },
      status: 'insufficient_data',
      confidence_threshold: 0.5,
    },
    
    // NEWS/EVENT SIGNALS
    {
      node_id: 'media_signal',
      question: 'What is current media attention on education reform?',
      answer_type: 'DESCRIPTIVE_STAT',
      required: false,
      answer_packet_ref: 'answer:signals:education_attention:v1',
      status: 'resolved',
      confidence_threshold: 0.5,
      resolved_answer: {
        answer_packet_id: 'ap_edu_media_001',
        summary: 'Media Attention Index at 72 (elevated). 15% above 5-year average. Peak attention during election cycles.',
        data: {
          attention_index: 72,
          vs_average: 0.15,
          volatility: 'high',
          driver: 'election_proximity',
        },
        confidence: 0.65,
        data_coverage: 0.85,
        source_count: 5,
        freshness_days: 7,
        limitations: [
          'Media attention ≠ policy importance',
          'Does not predict policy outcomes',
        ],
        resolved_at: '2024-01-15T10:00:00Z',
      },
    },
  ],
  
  assumptions: [
    {
      assumption_id: 'implementation_fidelity',
      description: 'Reform implemented as designed (no major modifications)',
      impact_level: 'high',
      required: true,
    },
    {
      assumption_id: 'funding_maintained',
      description: 'Funding levels maintained during transition',
      impact_level: 'high',
      required: true,
    },
    {
      assumption_id: 'teacher_retention',
      description: 'No significant teacher exodus during transition',
      impact_level: 'medium',
      required: false,
    },
  ],
  
  signals: [
    {
      signal_type: 'policy',
      index_ref: 'index:signals:policy_volatility_education:v1',
      current_value: 58,
      trend: 'increasing',
      interpretation: 'Above-baseline policy activity in education sector',
    },
    {
      signal_type: 'media',
      index_ref: 'index:signals:education_attention:v1',
      current_value: 72,
      trend: 'increasing',
      interpretation: 'Elevated media focus on education topics',
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
  resolved_at: '2024-01-15T11:30:00Z',
};

/**
 * Chart specifications for Policy Assessment
 */
export const POLICY_CHART_SPECS = {
  reform_outcomes_comparison: {
    type: 'grouped_bar',
    title: 'Historical Reform Outcomes (Nordic Countries)',
    x_axis: 'Reform',
    y_axis: 'Outcome Category',
    categories: ['Achieved', 'Neutral', 'Reversed'],
  },
  variation_distribution: {
    type: 'violin',
    title: 'Achievement Score Distribution',
    x_axis: 'Region',
    y_axis: 'Score',
  },
  teacher_scatter: {
    type: 'scatter',
    title: 'Teacher Ratio vs Outcomes',
    x_axis: 'Teacher-Student Ratio',
    y_axis: 'Achievement Score',
    regression_line: true,
    note: 'Correlation ≠ Causation',
  },
  sensitivity_heatmap: {
    type: 'heatmap',
    title: 'Group Sensitivity to System Changes',
    x_axis: 'Reform Type',
    y_axis: 'Student Group',
  },
  timeline_comparison: {
    type: 'multi_line',
    title: 'Reform Implementation Timeline (Historical)',
    x_axis: 'Years Since Implementation',
    y_axis: 'Outcome Index',
    series: ['Reform A', 'Reform B', 'Reform C'],
  },
} as const;
