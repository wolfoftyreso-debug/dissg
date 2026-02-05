/**
 * DECISION GRAPH EXAMPLES
 * 
 * Three complete, production-ready decision graphs demonstrating
 * the Decision Substrate pattern.
 * 
 * Each provides QUESTIONS and ANSWERS, never RECOMMENDATIONS.
 */

export { 
  INVESTMENT_FACILITY_GRAPH,
  INVESTMENT_CHART_SPECS,
} from './investment-example';

export { 
  HEALTHCARE_CAPACITY_GRAPH,
  HEALTHCARE_CHART_SPECS,
} from './healthcare-example';

export { 
  POLICY_SCHOOL_REFORM_GRAPH,
  POLICY_CHART_SPECS,
} from './policy-example';

/**
 * All example graphs
 */
export const ALL_EXAMPLE_GRAPHS = {
  investment_facility_v1: 'investment-example',
  healthcare_capacity_v1: 'healthcare-example',
  policy_school_reform_v1: 'policy-example',
} as const;
