/**
 * DECISION TYPE REGISTRY
 * 
 * The 10 canonical decision types that define the grammar of decisions.
 * Each type has fixed node patterns, allowed answer types, and forbidden conclusions.
 * 
 * This is DECISION GRAMMAR — not recommendations.
 */

import type { DecisionDomain } from '../schema/decision-graph-schema';

/**
 * Registered Decision Type
 */
export interface DecisionType {
  readonly type_id: string;
  readonly name: string;
  readonly description: string;
  readonly category: 'strategic' | 'operational' | 'evaluative' | 'diagnostic';
  readonly domains: readonly DecisionDomain[];
  readonly required_context: readonly string[];
  readonly allowed_answer_types: readonly string[];
  readonly forbidden_conclusions: readonly string[];
  readonly typical_node_count: number;
  readonly signal_types: readonly string[];
  readonly index_types: readonly string[];
  readonly complexity: 'low' | 'medium' | 'high';
  readonly question_patterns: readonly QuestionPatternV2[];
}

export interface QuestionPatternV2 {
  readonly pattern_id: string;
  readonly question_template: string;
  readonly answer_type: string;
  readonly required: boolean;
  readonly confidence_threshold: number;
  readonly dependencies?: readonly string[];
  readonly visualization_hint: 'trend_line' | 'distribution' | 'comparison' | 'heatmap' | 'scatter' | 'table';
}

/**
 * THE 10 CANONICAL DECISION TYPES
 */
export const DECISION_TYPE_REGISTRY: Record<string, DecisionType> = {
  // 1. INVESTMENT FEASIBILITY
  investment_feasibility: {
    type_id: 'investment_feasibility',
    name: 'Investment Feasibility',
    description: 'Capital allocation and infrastructure investment evaluation',
    category: 'strategic',
    domains: ['economy', 'markets', 'infrastructure'],
    required_context: ['sector', 'country', 'investment_horizon'],
    allowed_answer_types: ['TREND_CHANGE', 'DISTRIBUTION_STRUCTURE', 'COMPARISON_CONDITIONAL', 'CORRELATION_OVERVIEW', 'DESCRIPTIVE_STAT'],
    forbidden_conclusions: ['invest', 'do not invest', 'best option', 'recommended'],
    typical_node_count: 7,
    signal_types: ['policy', 'media', 'events'],
    index_types: ['stability', 'volatility', 'growth'],
    complexity: 'high',
    question_patterns: [
      { pattern_id: 'demand_trend', question_template: 'How has demand for {sector} changed over {time_horizon}?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, visualization_hint: 'trend_line' },
      { pattern_id: 'volatility', question_template: 'How volatile is demand in {sector}?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, visualization_hint: 'distribution' },
      { pattern_id: 'regional_diff', question_template: 'How does demand differ across regions in {country}?', answer_type: 'COMPARISON_CONDITIONAL', required: true, confidence_threshold: 0.7, visualization_hint: 'comparison' },
      { pattern_id: 'rate_correlation', question_template: 'How does {sector} correlate with interest rates?', answer_type: 'CORRELATION_OVERVIEW', required: true, confidence_threshold: 0.6, visualization_hint: 'heatmap' },
      { pattern_id: 'energy_correlation', question_template: 'What is the relationship with energy prices?', answer_type: 'CORRELATION_OVERVIEW', required: false, confidence_threshold: 0.6, visualization_hint: 'scatter' },
      { pattern_id: 'policy_signals', question_template: 'What policy signals are relevant to {sector}?', answer_type: 'DESCRIPTIVE_STAT', required: false, confidence_threshold: 0.5, visualization_hint: 'table' },
      { pattern_id: 'competition', question_template: 'How has competitive landscape changed?', answer_type: 'TREND_CHANGE', required: false, confidence_threshold: 0.6, visualization_hint: 'trend_line' },
    ],
  },

  // 2. CAPACITY PLANNING
  capacity_planning: {
    type_id: 'capacity_planning',
    name: 'Capacity Planning',
    description: 'Resource capacity and load forecasting',
    category: 'operational',
    domains: ['healthcare', 'infrastructure', 'society'],
    required_context: ['region', 'facility_type', 'time_horizon'],
    allowed_answer_types: ['DESCRIPTIVE_STAT', 'TREND_CHANGE', 'DISTRIBUTION_STRUCTURE', 'CORRELATION_OVERVIEW', 'SCENARIO_MODEL'],
    forbidden_conclusions: ['increase capacity', 'reduce staffing', 'optimal level'],
    typical_node_count: 7,
    signal_types: ['events', 'policy'],
    index_types: ['load', 'stress', 'seasonal'],
    complexity: 'medium',
    question_patterns: [
      { pattern_id: 'current_load', question_template: 'What is the current occupancy/load in {region}?', answer_type: 'DESCRIPTIVE_STAT', required: true, confidence_threshold: 0.8, visualization_hint: 'distribution' },
      { pattern_id: 'wait_time_trend', question_template: 'How have wait times trended over the past 3 years?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, visualization_hint: 'trend_line' },
      { pattern_id: 'regional_variance', question_template: 'How does utilization vary by region?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, visualization_hint: 'comparison' },
      { pattern_id: 'seasonal_pattern', question_template: 'What are the seasonal demand patterns?', answer_type: 'CORRELATION_OVERVIEW', required: true, confidence_threshold: 0.8, visualization_hint: 'trend_line' },
      { pattern_id: 'staffing_trend', question_template: 'How is staffing trending?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.6, visualization_hint: 'trend_line' },
      { pattern_id: 'scenario_up', question_template: 'What if demand increases 10%?', answer_type: 'SCENARIO_MODEL', required: false, confidence_threshold: 0.5, visualization_hint: 'trend_line' },
      { pattern_id: 'scenario_down', question_template: 'What if demand decreases 10%?', answer_type: 'SCENARIO_MODEL', required: false, confidence_threshold: 0.5, visualization_hint: 'trend_line' },
    ],
  },

  // 3. POLICY IMPACT / RISK
  policy_impact: {
    type_id: 'policy_impact',
    name: 'Policy Impact Assessment',
    description: 'Reform outcomes and system impact evaluation',
    category: 'evaluative',
    domains: ['society', 'education', 'healthcare'],
    required_context: ['country', 'policy_area'],
    allowed_answer_types: ['COMPARISON_CONDITIONAL', 'DISTRIBUTION_STRUCTURE', 'CORRELATION_OVERVIEW', 'TREND_CHANGE'],
    forbidden_conclusions: ['support', 'oppose', 'effective', 'ineffective'],
    typical_node_count: 6,
    signal_types: ['policy', 'media', 'events'],
    index_types: ['stability', 'coverage', 'equity'],
    complexity: 'high',
    question_patterns: [
      { pattern_id: 'historical_outcomes', question_template: 'What outcomes have similar reforms had historically?', answer_type: 'COMPARISON_CONDITIONAL', required: true, confidence_threshold: 0.6, visualization_hint: 'comparison' },
      { pattern_id: 'outcome_variance', question_template: 'What is the normal variation in {policy_area} outcomes?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, visualization_hint: 'distribution' },
      { pattern_id: 'factor_correlation', question_template: 'How do outcomes correlate with key input factors?', answer_type: 'CORRELATION_OVERVIEW', required: true, confidence_threshold: 0.6, visualization_hint: 'heatmap' },
      { pattern_id: 'affected_groups', question_template: 'Which groups are most affected?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, visualization_hint: 'comparison' },
      { pattern_id: 'system_dependencies', question_template: 'What other systems depend on current structure?', answer_type: 'CORRELATION_OVERVIEW', required: false, confidence_threshold: 0.5, visualization_hint: 'heatmap' },
      { pattern_id: 'implementation_timeline', question_template: 'What is the typical implementation timeline?', answer_type: 'DESCRIPTIVE_STAT', required: false, confidence_threshold: 0.6, visualization_hint: 'table' },
    ],
  },

  // 4. MARKET EXPOSURE
  market_exposure: {
    type_id: 'market_exposure',
    name: 'Market Exposure Analysis',
    description: 'Market risk and position evaluation',
    category: 'diagnostic',
    domains: ['markets', 'economy'],
    required_context: ['market', 'sector', 'country'],
    allowed_answer_types: ['DISTRIBUTION_STRUCTURE', 'CORRELATION_OVERVIEW', 'TREND_CHANGE', 'RISK_PREVALENCE'],
    forbidden_conclusions: ['buy', 'sell', 'hedge', 'optimal exposure'],
    typical_node_count: 6,
    signal_types: ['media', 'events', 'volatility'],
    index_types: ['volatility', 'correlation', 'concentration'],
    complexity: 'high',
    question_patterns: [
      { pattern_id: 'concentration', question_template: 'What is the current market concentration in {sector}?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, visualization_hint: 'distribution' },
      { pattern_id: 'volatility_regime', question_template: 'What is the current volatility regime?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, visualization_hint: 'trend_line' },
      { pattern_id: 'cross_correlation', question_template: 'How correlated are exposures across sectors?', answer_type: 'CORRELATION_OVERVIEW', required: true, confidence_threshold: 0.6, visualization_hint: 'heatmap' },
      { pattern_id: 'tail_risk', question_template: 'What is the tail risk profile?', answer_type: 'RISK_PREVALENCE', required: true, confidence_threshold: 0.6, visualization_hint: 'distribution' },
      { pattern_id: 'historical_drawdowns', question_template: 'What have historical drawdowns looked like?', answer_type: 'TREND_CHANGE', required: false, confidence_threshold: 0.7, visualization_hint: 'trend_line' },
      { pattern_id: 'liquidity', question_template: 'What is the liquidity profile?', answer_type: 'DESCRIPTIVE_STAT', required: false, confidence_threshold: 0.6, visualization_hint: 'distribution' },
    ],
  },

  // 5. RESOURCE ALLOCATION
  resource_allocation: {
    type_id: 'resource_allocation',
    name: 'Resource Allocation',
    description: 'Budget and resource distribution analysis',
    category: 'operational',
    domains: ['economy', 'society', 'healthcare'],
    required_context: ['organization_type', 'resource_type'],
    allowed_answer_types: ['DESCRIPTIVE_STAT', 'DISTRIBUTION_STRUCTURE', 'TREND_CHANGE', 'COMPARISON_CONDITIONAL'],
    forbidden_conclusions: ['allocate more', 'reduce funding', 'optimal split'],
    typical_node_count: 5,
    signal_types: ['policy'],
    index_types: ['efficiency', 'utilization'],
    complexity: 'medium',
    question_patterns: [
      { pattern_id: 'current_allocation', question_template: 'What is the current allocation of {resource_type}?', answer_type: 'DESCRIPTIVE_STAT', required: true, confidence_threshold: 0.8, visualization_hint: 'distribution' },
      { pattern_id: 'efficiency_variance', question_template: 'How does efficiency vary across targets?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, visualization_hint: 'comparison' },
      { pattern_id: 'allocation_trend', question_template: 'How has allocation changed over time?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, visualization_hint: 'trend_line' },
      { pattern_id: 'peer_comparison', question_template: 'How does this compare to peers?', answer_type: 'COMPARISON_CONDITIONAL', required: false, confidence_threshold: 0.6, visualization_hint: 'comparison' },
      { pattern_id: 'constraints', question_template: 'What are the binding constraints?', answer_type: 'DESCRIPTIVE_STAT', required: false, confidence_threshold: 0.6, visualization_hint: 'table' },
    ],
  },

  // 6. OPERATIONAL BOTTLENECK
  operational_bottleneck: {
    type_id: 'operational_bottleneck',
    name: 'Operational Bottleneck',
    description: 'Process constraint and flow analysis',
    category: 'diagnostic',
    domains: ['infrastructure', 'healthcare', 'society'],
    required_context: ['process', 'system'],
    allowed_answer_types: ['DESCRIPTIVE_STAT', 'DISTRIBUTION_STRUCTURE', 'TREND_CHANGE', 'CORRELATION_OVERVIEW'],
    forbidden_conclusions: ['fix', 'remove bottleneck', 'priority action'],
    typical_node_count: 5,
    signal_types: ['events'],
    index_types: ['throughput', 'wait_time', 'utilization'],
    complexity: 'medium',
    question_patterns: [
      { pattern_id: 'throughput', question_template: 'What is the current throughput at each stage?', answer_type: 'DESCRIPTIVE_STAT', required: true, confidence_threshold: 0.8, visualization_hint: 'comparison' },
      { pattern_id: 'queue_distribution', question_template: 'Where do queues form?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, visualization_hint: 'distribution' },
      { pattern_id: 'wait_time_pattern', question_template: 'How do wait times vary by time/location?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, visualization_hint: 'trend_line' },
      { pattern_id: 'dependency_chain', question_template: 'What is the dependency chain?', answer_type: 'CORRELATION_OVERVIEW', required: false, confidence_threshold: 0.6, visualization_hint: 'heatmap' },
      { pattern_id: 'historical_issues', question_template: 'What bottlenecks have occurred historically?', answer_type: 'TREND_CHANGE', required: false, confidence_threshold: 0.6, visualization_hint: 'trend_line' },
    ],
  },

  // 7. DEMAND FORECAST (SCENARIO)
  demand_forecast: {
    type_id: 'demand_forecast',
    name: 'Demand Forecast',
    description: 'Scenario-based demand projection',
    category: 'strategic',
    domains: ['economy', 'markets', 'healthcare'],
    required_context: ['sector', 'time_horizon'],
    allowed_answer_types: ['TREND_CHANGE', 'SCENARIO_MODEL', 'DISTRIBUTION_STRUCTURE', 'CORRELATION_OVERVIEW'],
    forbidden_conclusions: ['will happen', 'prediction', 'forecast'],
    typical_node_count: 6,
    signal_types: ['policy', 'media', 'events'],
    index_types: ['growth', 'seasonality', 'volatility'],
    complexity: 'high',
    question_patterns: [
      { pattern_id: 'historical_trend', question_template: 'What has been the historical demand trend for {sector}?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, visualization_hint: 'trend_line' },
      { pattern_id: 'drivers', question_template: 'What factors drive demand?', answer_type: 'CORRELATION_OVERVIEW', required: true, confidence_threshold: 0.6, visualization_hint: 'heatmap' },
      { pattern_id: 'scenario_base', question_template: 'What does the baseline scenario look like?', answer_type: 'SCENARIO_MODEL', required: true, confidence_threshold: 0.5, visualization_hint: 'trend_line' },
      { pattern_id: 'scenario_up', question_template: 'What does an optimistic scenario look like?', answer_type: 'SCENARIO_MODEL', required: true, confidence_threshold: 0.5, visualization_hint: 'trend_line' },
      { pattern_id: 'scenario_down', question_template: 'What does a pessimistic scenario look like?', answer_type: 'SCENARIO_MODEL', required: true, confidence_threshold: 0.5, visualization_hint: 'trend_line' },
      { pattern_id: 'seasonality', question_template: 'What seasonal patterns exist?', answer_type: 'DISTRIBUTION_STRUCTURE', required: false, confidence_threshold: 0.7, visualization_hint: 'trend_line' },
    ],
  },

  // 8. SYSTEM STABILITY CHECK
  system_stability: {
    type_id: 'system_stability',
    name: 'System Stability Check',
    description: 'System health and stability assessment',
    category: 'diagnostic',
    domains: ['infrastructure', 'economy', 'society'],
    required_context: ['system', 'country'],
    allowed_answer_types: ['DESCRIPTIVE_STAT', 'TREND_CHANGE', 'DISTRIBUTION_STRUCTURE', 'RISK_PREVALENCE'],
    forbidden_conclusions: ['stable', 'unstable', 'at risk', 'safe'],
    typical_node_count: 5,
    signal_types: ['events', 'volatility'],
    index_types: ['stability', 'volatility', 'stress'],
    complexity: 'medium',
    question_patterns: [
      { pattern_id: 'current_state', question_template: 'What is the current state of {system}?', answer_type: 'DESCRIPTIVE_STAT', required: true, confidence_threshold: 0.8, visualization_hint: 'distribution' },
      { pattern_id: 'volatility_trend', question_template: 'How has volatility changed over time?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, visualization_hint: 'trend_line' },
      { pattern_id: 'stress_distribution', question_template: 'How is stress distributed across the system?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, visualization_hint: 'distribution' },
      { pattern_id: 'failure_risk', question_template: 'What is the current failure risk profile?', answer_type: 'RISK_PREVALENCE', required: false, confidence_threshold: 0.6, visualization_hint: 'distribution' },
      { pattern_id: 'historical_events', question_template: 'What stress events have occurred historically?', answer_type: 'TREND_CHANGE', required: false, confidence_threshold: 0.6, visualization_hint: 'trend_line' },
    ],
  },

  // 9. REGIONAL COMPARISON
  regional_comparison: {
    type_id: 'regional_comparison',
    name: 'Regional Comparison',
    description: 'Cross-region performance and condition analysis',
    category: 'evaluative',
    domains: ['society', 'economy', 'healthcare', 'education'],
    required_context: ['metric', 'country'],
    allowed_answer_types: ['COMPARISON_CONDITIONAL', 'DISTRIBUTION_STRUCTURE', 'TREND_CHANGE', 'CORRELATION_OVERVIEW'],
    forbidden_conclusions: ['best region', 'worst region', 'winner', 'loser'],
    typical_node_count: 5,
    signal_types: ['policy'],
    index_types: ['disparity', 'convergence'],
    complexity: 'medium',
    question_patterns: [
      { pattern_id: 'current_comparison', question_template: 'How do regions compare on {metric}?', answer_type: 'COMPARISON_CONDITIONAL', required: true, confidence_threshold: 0.7, visualization_hint: 'comparison' },
      { pattern_id: 'disparity_trend', question_template: 'Is regional disparity growing or shrinking?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, visualization_hint: 'trend_line' },
      { pattern_id: 'distribution', question_template: 'What is the distribution of {metric} across regions?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, visualization_hint: 'distribution' },
      { pattern_id: 'factor_correlation', question_template: 'What factors correlate with regional differences?', answer_type: 'CORRELATION_OVERVIEW', required: false, confidence_threshold: 0.6, visualization_hint: 'heatmap' },
      { pattern_id: 'outliers', question_template: 'Which regions are outliers?', answer_type: 'DISTRIBUTION_STRUCTURE', required: false, confidence_threshold: 0.6, visualization_hint: 'distribution' },
    ],
  },

  // 10. INTERVENTION EVALUATION
  intervention_evaluation: {
    type_id: 'intervention_evaluation',
    name: 'Intervention Evaluation',
    description: 'Post-intervention outcome and effect analysis',
    category: 'evaluative',
    domains: ['society', 'healthcare', 'education'],
    required_context: ['intervention', 'target_metric', 'time_since'],
    allowed_answer_types: ['COMPARISON_CONDITIONAL', 'TREND_CHANGE', 'DISTRIBUTION_STRUCTURE', 'CORRELATION_OVERVIEW'],
    forbidden_conclusions: ['successful', 'failed', 'effective', 'ineffective'],
    typical_node_count: 6,
    signal_types: ['policy', 'media'],
    index_types: ['effect_size', 'coverage'],
    complexity: 'high',
    question_patterns: [
      { pattern_id: 'before_after', question_template: 'How do outcomes compare before vs after {intervention}?', answer_type: 'COMPARISON_CONDITIONAL', required: true, confidence_threshold: 0.7, visualization_hint: 'comparison' },
      { pattern_id: 'treated_control', question_template: 'How do treated vs untreated groups compare?', answer_type: 'COMPARISON_CONDITIONAL', required: true, confidence_threshold: 0.6, visualization_hint: 'comparison' },
      { pattern_id: 'trend_change', question_template: 'Did the trend change after intervention?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.6, visualization_hint: 'trend_line' },
      { pattern_id: 'heterogeneity', question_template: 'Do effects vary across subgroups?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.6, visualization_hint: 'comparison' },
      { pattern_id: 'confounders', question_template: 'What other factors changed during the period?', answer_type: 'CORRELATION_OVERVIEW', required: false, confidence_threshold: 0.5, visualization_hint: 'heatmap' },
      { pattern_id: 'sustainability', question_template: 'How have effects evolved over time?', answer_type: 'TREND_CHANGE', required: false, confidence_threshold: 0.6, visualization_hint: 'trend_line' },
    ],
  },
};

/**
 * Registry utilities
 */
export function getDecisionType(typeId: string): DecisionType | null {
  return DECISION_TYPE_REGISTRY[typeId] || null;
}

export function listDecisionTypes(): DecisionType[] {
  return Object.values(DECISION_TYPE_REGISTRY);
}

export function getDecisionTypesByCategory(category: DecisionType['category']): DecisionType[] {
  return Object.values(DECISION_TYPE_REGISTRY).filter(t => t.category === category);
}

export function getDecisionTypesByDomain(domain: DecisionDomain): DecisionType[] {
  return Object.values(DECISION_TYPE_REGISTRY).filter(t => t.domains.includes(domain));
}

export function detectDecisionType(description: string): DecisionType | null {
  const lower = description.toLowerCase();
  
  // Match patterns
  const patterns: [string[], string][] = [
    [['invest', 'capital', 'infrastructure', 'build'], 'investment_feasibility'],
    [['capacity', 'staffing', 'resource plan', 'forecast demand'], 'capacity_planning'],
    [['policy', 'reform', 'legislation', 'regulation'], 'policy_impact'],
    [['market', 'exposure', 'risk position'], 'market_exposure'],
    [['allocat', 'budget', 'distribute'], 'resource_allocation'],
    [['bottleneck', 'throughput', 'queue', 'flow'], 'operational_bottleneck'],
    [['demand', 'scenario', 'projection'], 'demand_forecast'],
    [['stability', 'health', 'stress'], 'system_stability'],
    [['region', 'compare', 'across'], 'regional_comparison'],
    [['intervention', 'evaluate', 'effect', 'outcome'], 'intervention_evaluation'],
  ];
  
  for (const [keywords, typeId] of patterns) {
    if (keywords.some(kw => lower.includes(kw))) {
      return DECISION_TYPE_REGISTRY[typeId];
    }
  }
  
  return null;
}

/**
 * REGISTRY PRINCIPLES (LOCKED)
 */
export const REGISTRY_PRINCIPLES = {
  canonical_types: 10,
  each_type_has: {
    fixed_node_patterns: true,
    allowed_answer_types: true,
    forbidden_conclusions: true,
    required_context: true,
  },
  never_contains: {
    recommendations: true,
    value_judgments: true,
    optimal_choices: true,
  },
  this_is: 'Decision grammar',
} as const;
