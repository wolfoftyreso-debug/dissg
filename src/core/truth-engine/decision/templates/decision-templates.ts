/**
 * DECISION GRAPH TEMPLATES
 * 
 * Predefined question structures for common decision types.
 * These are NOT recommendations - they are question frameworks.
 */

import type { DecisionGraphTemplate } from '../graph/decision-graph';

/**
 * INVESTMENT DECISION TEMPLATE
 */
export const INVESTMENT_DECISION_TEMPLATE: DecisionGraphTemplate = {
  template_id: 'investment_decision_v1',
  name: 'Investment Decision Framework',
  description: 'Question structure for evaluating investment decisions',
  domain: 'economy',
  applicable_to: ['infrastructure', 'expansion', 'acquisition', 'capital_allocation'],
  version: '1.0.0',
  node_templates: [
    // Demand Analysis
    {
      template_node_id: 'demand_trend',
      question_pattern: 'How has demand for {sector} changed over the past {time_horizon}?',
      question_type: 'trend',
      answer_type: 'TREND_CHANGE',
      required: true,
    },
    {
      template_node_id: 'demand_volatility',
      question_pattern: 'How volatile is demand in {sector}?',
      question_type: 'volatility',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      required: true,
    },
    {
      template_node_id: 'demand_regional',
      question_pattern: 'How does demand differ across regions in {country}?',
      question_type: 'comparison',
      answer_type: 'COMPARISON_CONDITIONAL',
      required: false,
    },
    // Market Conditions
    {
      template_node_id: 'market_normal',
      question_pattern: 'What is the normal range for market activity in {sector}?',
      question_type: 'normal_range',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      required: true,
    },
    {
      template_node_id: 'market_anomaly',
      question_pattern: 'Are current market conditions unusual for {sector}?',
      question_type: 'anomaly',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      required: true,
    },
    // Dependencies
    {
      template_node_id: 'dependencies',
      question_pattern: 'What economic factors does {sector} depend on?',
      question_type: 'dependency',
      answer_type: 'CORRELATION_OVERVIEW',
      required: true,
    },
    {
      template_node_id: 'sensitivity',
      question_pattern: 'How sensitive is {sector} to changes in interest rates?',
      question_type: 'sensitivity',
      answer_type: 'CORRELATION_OVERVIEW',
      required: false,
    },
    // Signals
    {
      template_node_id: 'policy_signals',
      question_pattern: 'What policy signals are relevant to {sector}?',
      question_type: 'signal',
      answer_type: 'CURRENT_STATE',
      required: false,
    },
    {
      template_node_id: 'media_signals',
      question_pattern: 'What is the media attention level for {sector}?',
      question_type: 'signal',
      answer_type: 'CURRENT_STATE',
      required: false,
    },
    // Historical Context
    {
      template_node_id: 'historical_parallel',
      question_pattern: 'When did we last see similar conditions in {sector}?',
      question_type: 'comparison',
      answer_type: 'TREND_CHANGE',
      required: false,
    },
  ],
};

/**
 * HEALTHCARE PLANNING TEMPLATE
 */
export const HEALTHCARE_PLANNING_TEMPLATE: DecisionGraphTemplate = {
  template_id: 'healthcare_planning_v1',
  name: 'Healthcare Resource Planning Framework',
  description: 'Question structure for healthcare capacity decisions',
  domain: 'healthcare',
  applicable_to: ['capacity_planning', 'resource_allocation', 'service_design'],
  version: '1.0.0',
  node_templates: [
    // Demand Analysis
    {
      template_node_id: 'demand_trend',
      question_pattern: 'How has healthcare demand changed in {region}?',
      question_type: 'trend',
      answer_type: 'TREND_CHANGE',
      required: true,
    },
    {
      template_node_id: 'demographic_trend',
      question_pattern: 'How is the population aging in {region}?',
      question_type: 'trend',
      answer_type: 'TREND_CHANGE',
      required: true,
    },
    // Current Capacity
    {
      template_node_id: 'current_load',
      question_pattern: 'What is the current healthcare load in {region}?',
      question_type: 'distribution',
      answer_type: 'CURRENT_STATE',
      required: true,
    },
    {
      template_node_id: 'wait_times',
      question_pattern: 'How do wait times compare across specialties?',
      question_type: 'comparison',
      answer_type: 'COMPARISON_CONDITIONAL',
      required: true,
    },
    {
      template_node_id: 'capacity_variance',
      question_pattern: 'How does capacity vary between regions?',
      question_type: 'comparison',
      answer_type: 'COMPARISON_CONDITIONAL',
      required: false,
    },
    // Risk Factors
    {
      template_node_id: 'staff_trend',
      question_pattern: 'How is healthcare staffing trending in {region}?',
      question_type: 'trend',
      answer_type: 'TREND_CHANGE',
      required: true,
    },
    {
      template_node_id: 'readmission_rate',
      question_pattern: 'What are the readmission rates for key conditions?',
      question_type: 'distribution',
      answer_type: 'PREVALENCE_RISK',
      required: false,
    },
    // Historical Context
    {
      template_node_id: 'historical_capacity',
      question_pattern: 'When was healthcare capacity last at current levels?',
      question_type: 'comparison',
      answer_type: 'TREND_CHANGE',
      required: false,
    },
  ],
};

/**
 * POLICY DECISION TEMPLATE
 */
export const POLICY_DECISION_TEMPLATE: DecisionGraphTemplate = {
  template_id: 'policy_decision_v1',
  name: 'Policy Decision Framework',
  description: 'Question structure for policy impact assessment',
  domain: 'society',
  applicable_to: ['regulation', 'legislation', 'public_program', 'tax_policy'],
  version: '1.0.0',
  node_templates: [
    // Current State
    {
      template_node_id: 'current_state',
      question_pattern: 'What is the current state of {policy_area}?',
      question_type: 'distribution',
      answer_type: 'CURRENT_STATE',
      required: true,
    },
    {
      template_node_id: 'trend',
      question_pattern: 'How has {policy_area} changed over the past decade?',
      question_type: 'trend',
      answer_type: 'TREND_CHANGE',
      required: true,
    },
    // Comparison
    {
      template_node_id: 'international_comparison',
      question_pattern: 'How does {country} compare to peers on {policy_area}?',
      question_type: 'comparison',
      answer_type: 'COMPARISON_CONDITIONAL',
      required: true,
    },
    {
      template_node_id: 'regional_variance',
      question_pattern: 'How does {policy_area} vary across regions?',
      question_type: 'comparison',
      answer_type: 'COMPARISON_CONDITIONAL',
      required: false,
    },
    // Dependencies
    {
      template_node_id: 'affected_groups',
      question_pattern: 'What population groups are most affected by {policy_area}?',
      question_type: 'distribution',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      required: true,
    },
    {
      template_node_id: 'system_dependencies',
      question_pattern: 'What systems depend on {policy_area}?',
      question_type: 'dependency',
      answer_type: 'CORRELATION_OVERVIEW',
      required: false,
    },
    // Historical Precedent
    {
      template_node_id: 'similar_policies',
      question_pattern: 'What similar policies have been implemented elsewhere?',
      question_type: 'comparison',
      answer_type: 'COMPARISON_CONDITIONAL',
      required: false,
    },
    {
      template_node_id: 'historical_changes',
      question_pattern: 'When was {policy_area} last significantly changed?',
      question_type: 'trend',
      answer_type: 'TREND_CHANGE',
      required: false,
    },
    // Signals
    {
      template_node_id: 'public_attention',
      question_pattern: 'What is the current public attention on {policy_area}?',
      question_type: 'signal',
      answer_type: 'CURRENT_STATE',
      required: false,
    },
  ],
};

/**
 * ALL TEMPLATES
 */
export const DECISION_TEMPLATES: Record<string, DecisionGraphTemplate> = {
  investment_decision_v1: INVESTMENT_DECISION_TEMPLATE,
  healthcare_planning_v1: HEALTHCARE_PLANNING_TEMPLATE,
  policy_decision_v1: POLICY_DECISION_TEMPLATE,
};

/**
 * Get template by ID
 */
export function getTemplate(templateId: string): DecisionGraphTemplate | null {
  return DECISION_TEMPLATES[templateId] || null;
}

/**
 * List all templates
 */
export function listTemplates(): readonly DecisionGraphTemplate[] {
  return Object.values(DECISION_TEMPLATES);
}

/**
 * Get templates for domain
 */
export function getTemplatesForDomain(domain: string): readonly DecisionGraphTemplate[] {
  return Object.values(DECISION_TEMPLATES).filter(t => t.domain === domain);
}

/**
 * TEMPLATE PRINCIPLES
 */
export const TEMPLATE_PRINCIPLES = {
  templates_are_question_structures: true,
  not_decision_recommendations: true,
  customizable_by_context: true,
  version_controlled: true,
  domain_specific: true,
} as const;
