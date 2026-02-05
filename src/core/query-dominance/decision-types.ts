/**
 * MASTER TAXONOMY — TOP DECISION TYPES
 * 
 * ~40 decision types that cover ~1000 search intents.
 * This is why we scale when others drown.
 */

import type { DecisionType, DecisionCategory } from './types';

/**
 * Consumer / Private Decisions (A)
 */
export const CONSUMER_DECISION_TYPES: DecisionType[] = [
  {
    type_id: 'consumer_product_evaluation',
    category: 'consumer_private',
    name: 'Product Evaluation',
    query_patterns: ['is X good', 'X review', 'is X worth it', 'X quality'],
    implicit_choice: 'purchase_vs_not_purchase',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'medium',
    required_data_packages: ['product_specs', 'user_reviews_aggregated', 'reliability_data'],
    required_indices: ['product_index', 'review_index'],
  },
  {
    type_id: 'consumer_comparison',
    category: 'consumer_private',
    name: 'Product Comparison',
    query_patterns: ['X vs Y', 'X or Y', 'X compared to Y', 'difference between X and Y'],
    implicit_choice: 'choose_between_alternatives',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'medium',
    required_data_packages: ['product_specs', 'comparative_data', 'price_history'],
    required_indices: ['product_index', 'comparison_index'],
  },
  {
    type_id: 'consumer_problem_assessment',
    category: 'consumer_private',
    name: 'Problem Assessment',
    query_patterns: ['problem with X', 'X issues', 'X complaints', 'X breaking'],
    implicit_choice: 'keep_vs_replace_vs_repair',
    alternatives_required: true,
    time_horizon: 'short_term',
    risk_exposure: 'low',
    required_data_packages: ['defect_data', 'repair_statistics', 'warranty_data'],
    required_indices: ['problem_index', 'solution_index'],
  },
  {
    type_id: 'consumer_value_assessment',
    category: 'consumer_private',
    name: 'Value Assessment',
    query_patterns: ['is X worth the price', 'X value for money', 'X overpriced'],
    implicit_choice: 'buy_now_vs_wait_vs_alternative',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'medium',
    required_data_packages: ['price_data', 'depreciation_data', 'tco_model'],
    required_indices: ['price_index', 'value_index'],
  },
  {
    type_id: 'consumer_pros_cons',
    category: 'consumer_private',
    name: 'Pros and Cons Analysis',
    query_patterns: ['advantages of X', 'disadvantages of X', 'pros and cons of X'],
    implicit_choice: 'informed_purchase_decision',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'medium',
    required_data_packages: ['feature_analysis', 'user_feedback', 'expert_reviews'],
    required_indices: ['feature_index', 'sentiment_index'],
  },
];

/**
 * Financial Decisions (B)
 */
export const FINANCIAL_DECISION_TYPES: DecisionType[] = [
  {
    type_id: 'investment_evaluation',
    category: 'financial',
    name: 'Investment Evaluation',
    query_patterns: ['is X a good investment', 'should I invest in X', 'X investment'],
    implicit_choice: 'invest_vs_not_invest_vs_alternative',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'high',
    required_data_packages: ['historical_returns', 'risk_metrics', 'market_data'],
    required_indices: ['investment_index', 'risk_index'],
  },
  {
    type_id: 'risk_assessment_financial',
    category: 'financial',
    name: 'Financial Risk Assessment',
    query_patterns: ['risks of X', 'X risk', 'is X risky', 'X safe investment'],
    implicit_choice: 'accept_risk_vs_avoid',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'high',
    required_data_packages: ['volatility_data', 'drawdown_history', 'correlation_data'],
    required_indices: ['risk_index', 'volatility_index'],
  },
  {
    type_id: 'return_analysis',
    category: 'financial',
    name: 'Return Analysis',
    query_patterns: ['X returns', 'X performance', 'X yield', 'how much does X return'],
    implicit_choice: 'expected_return_vs_alternatives',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'high',
    required_data_packages: ['return_history', 'benchmark_comparison', 'fee_impact'],
    required_indices: ['return_index', 'benchmark_index'],
  },
  {
    type_id: 'alternative_search_financial',
    category: 'financial',
    name: 'Financial Alternative Search',
    query_patterns: ['alternative to X', 'instead of X', 'better than X investment'],
    implicit_choice: 'switch_vs_stay',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'high',
    required_data_packages: ['alternative_products', 'comparative_returns', 'switching_costs'],
    required_indices: ['alternative_index', 'comparison_index'],
  },
];

/**
 * Health / Life Decisions (C)
 */
export const HEALTH_DECISION_TYPES: DecisionType[] = [
  {
    type_id: 'normalcy_check',
    category: 'health_life',
    name: 'Normalcy Check',
    query_patterns: ['is X normal', 'is it normal to', 'should I worry about X'],
    implicit_choice: 'seek_help_vs_wait',
    alternatives_required: false,
    time_horizon: 'immediate',
    risk_exposure: 'medium',
    required_data_packages: ['population_statistics', 'medical_thresholds', 'variance_data'],
    required_indices: ['health_index', 'population_index'],
  },
  {
    type_id: 'consequence_assessment',
    category: 'health_life',
    name: 'Consequence Assessment',
    query_patterns: ['what happens if', 'consequences of', 'effects of X on health'],
    implicit_choice: 'do_vs_not_do',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'high',
    required_data_packages: ['outcome_studies', 'risk_factors', 'mechanism_data'],
    required_indices: ['outcome_index', 'mechanism_index'],
  },
  {
    type_id: 'risk_assessment_health',
    category: 'health_life',
    name: 'Health Risk Assessment',
    query_patterns: ['risks of X', 'is X dangerous', 'X side effects', 'X health risks'],
    implicit_choice: 'accept_risk_vs_avoid_vs_mitigate',
    alternatives_required: true,
    time_horizon: 'lifetime',
    risk_exposure: 'critical',
    required_data_packages: ['risk_studies', 'dose_response', 'population_risk'],
    required_indices: ['risk_index', 'health_index'],
  },
  {
    type_id: 'prevalence_check',
    category: 'health_life',
    name: 'Prevalence Check',
    query_patterns: ['how common is X', 'X statistics', 'how many people have X'],
    implicit_choice: 'understand_baseline',
    alternatives_required: false,
    time_horizon: 'immediate',
    risk_exposure: 'low',
    required_data_packages: ['prevalence_data', 'demographic_breakdown', 'trend_data'],
    required_indices: ['prevalence_index', 'demographic_index'],
  },
];

/**
 * Policy / Society Decisions (D)
 */
export const POLICY_DECISION_TYPES: DecisionType[] = [
  {
    type_id: 'policy_effectiveness',
    category: 'policy_society',
    name: 'Policy Effectiveness',
    query_patterns: ['does X work', 'effectiveness of X', 'did X policy work'],
    implicit_choice: 'support_vs_oppose_vs_modify',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'high',
    required_data_packages: ['outcome_studies', 'causal_evidence', 'counterfactual_analysis'],
    required_indices: ['policy_index', 'outcome_index'],
  },
  {
    type_id: 'policy_effects',
    category: 'policy_society',
    name: 'Policy Effects',
    query_patterns: ['effects of X', 'impact of X', 'X consequences'],
    implicit_choice: 'accept_effects_vs_modify',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'high',
    required_data_packages: ['effect_studies', 'side_effects', 'distributional_impacts'],
    required_indices: ['effect_index', 'distribution_index'],
  },
  {
    type_id: 'policy_cost',
    category: 'policy_society',
    name: 'Policy Cost Analysis',
    query_patterns: ['cost of X', 'how much does X cost', 'X budget'],
    implicit_choice: 'cost_acceptable_vs_not',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'medium',
    required_data_packages: ['cost_data', 'cost_benefit_analysis', 'opportunity_cost'],
    required_indices: ['cost_index', 'budget_index'],
  },
  {
    type_id: 'inaction_consequences',
    category: 'policy_society',
    name: 'Inaction Consequences',
    query_patterns: ['what if we don\'t', 'consequences of not doing X', 'cost of inaction'],
    implicit_choice: 'act_vs_not_act',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'high',
    required_data_packages: ['baseline_projections', 'counterfactual_scenarios', 'risk_accumulation'],
    required_indices: ['projection_index', 'risk_index'],
  },
];

/**
 * Meta / Evaluation Decisions (E)
 */
export const META_DECISION_TYPES: DecisionType[] = [
  {
    type_id: 'safety_assessment',
    category: 'meta_evaluation',
    name: 'Safety Assessment',
    query_patterns: ['is X safe', 'X safety', 'is X dangerous'],
    implicit_choice: 'use_vs_not_use',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'critical',
    required_data_packages: ['safety_data', 'incident_reports', 'regulatory_status'],
    required_indices: ['safety_index', 'incident_index'],
  },
  {
    type_id: 'reliability_assessment',
    category: 'meta_evaluation',
    name: 'Reliability Assessment',
    query_patterns: ['how reliable is X', 'X reliability', 'can I trust X'],
    implicit_choice: 'trust_vs_not_trust',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'medium',
    required_data_packages: ['reliability_data', 'failure_statistics', 'track_record'],
    required_indices: ['reliability_index', 'failure_index'],
  },
  {
    type_id: 'statistics_lookup',
    category: 'meta_evaluation',
    name: 'Statistics Lookup',
    query_patterns: ['X statistics', 'X data', 'X numbers', 'facts about X'],
    implicit_choice: 'inform_decision',
    alternatives_required: false,
    time_horizon: 'immediate',
    risk_exposure: 'low',
    required_data_packages: ['statistical_data', 'source_metadata', 'methodology'],
    required_indices: ['statistics_index', 'source_index'],
  },
  {
    type_id: 'common_problems',
    category: 'meta_evaluation',
    name: 'Common Problems',
    query_patterns: ['common problems with X', 'X issues', 'what goes wrong with X'],
    implicit_choice: 'anticipate_issues',
    alternatives_required: true,
    time_horizon: 'multi_year',
    risk_exposure: 'medium',
    required_data_packages: ['problem_frequency', 'resolution_data', 'prevention_strategies'],
    required_indices: ['problem_index', 'solution_index'],
  },
];

/**
 * All decision types
 */
export const ALL_DECISION_TYPES: DecisionType[] = [
  ...CONSUMER_DECISION_TYPES,
  ...FINANCIAL_DECISION_TYPES,
  ...HEALTH_DECISION_TYPES,
  ...POLICY_DECISION_TYPES,
  ...META_DECISION_TYPES,
];

/**
 * Get decision type by ID
 */
export function getDecisionType(typeId: string): DecisionType | undefined {
  return ALL_DECISION_TYPES.find(dt => dt.type_id === typeId);
}

/**
 * Get decision types by category
 */
export function getDecisionTypesByCategory(category: DecisionCategory): DecisionType[] {
  return ALL_DECISION_TYPES.filter(dt => dt.category === category);
}

/**
 * DECISION TYPES MASTERPROMPT
 */
export const DECISION_TYPES_MASTERPROMPT = `
You classify queries into Decision Types.

PRINCIPLE:
We don't index words. We index decision intentions.
~1000 queries reduce to ~40 decision types.
This is why we scale.

CATEGORIES:

A. CONSUMER / PRIVATE DECISIONS
- Is X good? → consumer_product_evaluation
- X vs Y → consumer_comparison
- Problems with X → consumer_problem_assessment
- Is X worth the price? → consumer_value_assessment
- Pros/cons of X → consumer_pros_cons

B. FINANCIAL DECISIONS
- Is X a good investment? → investment_evaluation
- Risks of X → risk_assessment_financial
- X returns → return_analysis
- Alternative to X → alternative_search_financial

C. HEALTH / LIFE DECISIONS
- Is X normal? → normalcy_check
- What happens if... → consequence_assessment
- Risks of... → risk_assessment_health
- How common is... → prevalence_check

D. POLICY / SOCIETY
- Does X work? → policy_effectiveness
- Effects of X → policy_effects
- Cost of X → policy_cost
- What if we don't... → inaction_consequences

E. META / EVALUATION
- Is X safe? → safety_assessment
- How reliable is X? → reliability_assessment
- Statistics about X → statistics_lookup
- Common problems with X → common_problems

EVERY QUERY MAPS TO:
- A decision type
- An implicit choice
- Required alternatives
- Time horizon
- Risk exposure

This mapping determines:
- What data packages are loaded
- What blocks must be shown
- What the CDP contains
`;
