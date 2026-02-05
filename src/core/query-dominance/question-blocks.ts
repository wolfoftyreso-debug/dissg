/**
 * THE 50 QUESTION BLOCKS
 * 
 * Fixed template. Never ad hoc.
 * No block can be missing. Empty blocks are exposed openly.
 */

import type { QuestionBlock, BlockGroup, BlockGroupId } from './types';

/**
 * BLOCK GROUP 1: SCOPE & ASSUMPTIONS (1-5)
 */
export const SCOPE_ASSUMPTION_BLOCKS: QuestionBlock[] = [
  {
    block_id: 1,
    block_group: 'scope_assumptions',
    question: 'Who does this apply to?',
    answers_intent: 'Define the target population/user',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Applicability not yet determined. Cannot assume universal relevance.',
  },
  {
    block_id: 2,
    block_group: 'scope_assumptions',
    question: 'Under what assumptions?',
    answers_intent: 'Explicit conditions for validity',
    data_type: 'qualitative',
    requires_sources: false,
    can_be_empty: false,
    empty_display: 'Assumptions not documented. Conclusions are ungrounded.',
  },
  {
    block_id: 3,
    block_group: 'scope_assumptions',
    question: 'When does this NOT apply?',
    answers_intent: 'Boundary conditions and exceptions',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Exceptions not documented. May apply incorrectly to edge cases.',
  },
  {
    block_id: 4,
    block_group: 'scope_assumptions',
    question: 'What is the time frame of validity?',
    answers_intent: 'Temporal scope of claims',
    data_type: 'temporal',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Time frame unknown. Data may be outdated.',
  },
  {
    block_id: 5,
    block_group: 'scope_assumptions',
    question: 'What geography/context is covered?',
    answers_intent: 'Spatial and contextual scope',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Geographic scope undefined. May not apply to your location.',
  },
];

/**
 * BLOCK GROUP 2: COST & RESOURCES (6-15)
 */
export const COST_RESOURCE_BLOCKS: QuestionBlock[] = [
  {
    block_id: 6,
    block_group: 'cost_resources',
    question: 'What is the direct cost?',
    answers_intent: 'Upfront monetary cost',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Direct cost unknown.',
  },
  {
    block_id: 7,
    block_group: 'cost_resources',
    question: 'What is the total cost of ownership (TCO)?',
    answers_intent: 'Full lifecycle cost',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'TCO not calculated. Hidden costs may exist.',
  },
  {
    block_id: 8,
    block_group: 'cost_resources',
    question: 'What is the opportunity cost?',
    answers_intent: 'Value of alternatives foregone',
    data_type: 'comparative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Opportunity cost not assessed.',
  },
  {
    block_id: 9,
    block_group: 'cost_resources',
    question: 'What are the ongoing/recurring costs?',
    answers_intent: 'Maintenance, subscription, operational costs',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Recurring costs unknown.',
  },
  {
    block_id: 10,
    block_group: 'cost_resources',
    question: 'What time investment is required?',
    answers_intent: 'Time to implement, learn, maintain',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Time requirements not documented.',
  },
  {
    block_id: 11,
    block_group: 'cost_resources',
    question: 'What resources/prerequisites are needed?',
    answers_intent: 'Dependencies and requirements',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Prerequisites not listed.',
  },
  {
    block_id: 12,
    block_group: 'cost_resources',
    question: 'What are the switching costs?',
    answers_intent: 'Cost to change from/to this',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Switching costs unknown.',
  },
  {
    block_id: 13,
    block_group: 'cost_resources',
    question: 'How does cost compare to alternatives?',
    answers_intent: 'Relative cost positioning',
    data_type: 'comparative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Cost comparison not available.',
  },
  {
    block_id: 14,
    block_group: 'cost_resources',
    question: 'What is the cost trend over time?',
    answers_intent: 'Historical and projected cost changes',
    data_type: 'temporal',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Cost trends not tracked.',
  },
  {
    block_id: 15,
    block_group: 'cost_resources',
    question: 'Are there hidden or unexpected costs?',
    answers_intent: 'Non-obvious cost components',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Hidden costs not researched.',
  },
];

/**
 * BLOCK GROUP 3: PERFORMANCE & RELIABILITY (16-25)
 */
export const PERFORMANCE_RELIABILITY_BLOCKS: QuestionBlock[] = [
  {
    block_id: 16,
    block_group: 'performance_reliability',
    question: 'What is the aggregate failure rate?',
    answers_intent: 'Overall reliability statistics',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Failure rate data not available.',
  },
  {
    block_id: 17,
    block_group: 'performance_reliability',
    question: 'What is the variance in performance?',
    answers_intent: 'Consistency and spread of outcomes',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Performance variance unknown.',
  },
  {
    block_id: 18,
    block_group: 'performance_reliability',
    question: 'How does it compare within its class?',
    answers_intent: 'Relative performance ranking',
    data_type: 'comparative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Class comparison not available.',
  },
  {
    block_id: 19,
    block_group: 'performance_reliability',
    question: 'What is the expected lifespan/duration?',
    answers_intent: 'Durability and longevity',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Lifespan data not available.',
  },
  {
    block_id: 20,
    block_group: 'performance_reliability',
    question: 'How has performance changed over time?',
    answers_intent: 'Historical performance trends',
    data_type: 'temporal',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Performance history not tracked.',
  },
  {
    block_id: 21,
    block_group: 'performance_reliability',
    question: 'What is the typical user experience?',
    answers_intent: 'Aggregated user feedback',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'User experience data not aggregated.',
  },
  {
    block_id: 22,
    block_group: 'performance_reliability',
    question: 'What are the performance benchmarks?',
    answers_intent: 'Standardized test results',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Benchmark data not available.',
  },
  {
    block_id: 23,
    block_group: 'performance_reliability',
    question: 'What conditions affect performance?',
    answers_intent: 'Environmental/contextual factors',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Performance conditions not documented.',
  },
  {
    block_id: 24,
    block_group: 'performance_reliability',
    question: 'What is the maintenance requirement?',
    answers_intent: 'Upkeep needed for sustained performance',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Maintenance requirements unknown.',
  },
  {
    block_id: 25,
    block_group: 'performance_reliability',
    question: 'What is the degradation pattern?',
    answers_intent: 'How performance declines over time',
    data_type: 'temporal',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Degradation pattern not studied.',
  },
];

/**
 * BLOCK GROUP 4: RISK & FAILURE MODES (26-35)
 */
export const RISK_FAILURE_BLOCKS: QuestionBlock[] = [
  {
    block_id: 26,
    block_group: 'risk_failure_modes',
    question: 'What are the common problems?',
    answers_intent: 'Frequent issues encountered',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Common problems not documented.',
  },
  {
    block_id: 27,
    block_group: 'risk_failure_modes',
    question: 'What are the worst-case scenarios?',
    answers_intent: 'Maximum downside potential',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Worst cases not analyzed.',
  },
  {
    block_id: 28,
    block_group: 'risk_failure_modes',
    question: 'What is the frequency of problems?',
    answers_intent: 'How often issues occur',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Problem frequency unknown.',
  },
  {
    block_id: 29,
    block_group: 'risk_failure_modes',
    question: 'What is the severity of problems?',
    answers_intent: 'Impact when issues occur',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Problem severity not assessed.',
  },
  {
    block_id: 30,
    block_group: 'risk_failure_modes',
    question: 'What is the risk of irreversible harm?',
    answers_intent: 'Permanent damage potential',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Irreversibility risk not evaluated.',
  },
  {
    block_id: 31,
    block_group: 'risk_failure_modes',
    question: 'What are the early warning signs?',
    answers_intent: 'Indicators of emerging problems',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Warning signs not identified.',
  },
  {
    block_id: 32,
    block_group: 'risk_failure_modes',
    question: 'What are the mitigation options?',
    answers_intent: 'Ways to reduce risk',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Mitigation strategies not documented.',
  },
  {
    block_id: 33,
    block_group: 'risk_failure_modes',
    question: 'What is the recovery path?',
    answers_intent: 'How to recover from failure',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Recovery paths not defined.',
  },
  {
    block_id: 34,
    block_group: 'risk_failure_modes',
    question: 'Who bears the risk?',
    answers_intent: 'Risk distribution among parties',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Risk allocation unclear.',
  },
  {
    block_id: 35,
    block_group: 'risk_failure_modes',
    question: 'What is the risk compared to alternatives?',
    answers_intent: 'Relative risk positioning',
    data_type: 'comparative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Comparative risk not assessed.',
  },
];

/**
 * BLOCK GROUP 5: DOMINANCE & TRADE-OFFS (36-45)
 */
export const DOMINANCE_TRADEOFF_BLOCKS: QuestionBlock[] = [
  {
    block_id: 36,
    block_group: 'dominance_tradeoffs',
    question: 'When does this option dominate?',
    answers_intent: 'Conditions where this is clearly best',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Dominance conditions not identified.',
  },
  {
    block_id: 37,
    block_group: 'dominance_tradeoffs',
    question: 'When does this option lose?',
    answers_intent: 'Conditions where alternatives are better',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Loss conditions not documented.',
  },
  {
    block_id: 38,
    block_group: 'dominance_tradeoffs',
    question: 'What is traded off for what?',
    answers_intent: 'Explicit trade-off structure',
    data_type: 'comparative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Trade-offs not articulated.',
  },
  {
    block_id: 39,
    block_group: 'dominance_tradeoffs',
    question: 'How sensitive is the outcome to assumptions?',
    answers_intent: 'Robustness of conclusions',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Sensitivity not analyzed.',
  },
  {
    block_id: 40,
    block_group: 'dominance_tradeoffs',
    question: 'What are the second-order effects?',
    answers_intent: 'Indirect and downstream impacts',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Second-order effects not considered.',
  },
  {
    block_id: 41,
    block_group: 'dominance_tradeoffs',
    question: 'Who wins and who loses?',
    answers_intent: 'Distributional impact',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Winners/losers not identified.',
  },
  {
    block_id: 42,
    block_group: 'dominance_tradeoffs',
    question: 'What is optimized vs. sacrificed?',
    answers_intent: 'Optimization trade-offs',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Optimization trade-offs unclear.',
  },
  {
    block_id: 43,
    block_group: 'dominance_tradeoffs',
    question: 'Is there a clearly dominant option?',
    answers_intent: 'Pareto dominance assessment',
    data_type: 'comparative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Dominance not determined.',
  },
  {
    block_id: 44,
    block_group: 'dominance_tradeoffs',
    question: 'What would change the conclusion?',
    answers_intent: 'Tipping points and thresholds',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Tipping points not identified.',
  },
  {
    block_id: 45,
    block_group: 'dominance_tradeoffs',
    question: 'Is this decision reversible?',
    answers_intent: 'Ability to change course',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Reversibility not assessed.',
  },
];

/**
 * BLOCK GROUP 6: UNCERTAINTY & NON-KNOWLEDGE (46-50)
 */
export const UNCERTAINTY_BLOCKS: QuestionBlock[] = [
  {
    block_id: 46,
    block_group: 'uncertainty_nonknowledge',
    question: 'What do we not know?',
    answers_intent: 'Explicit knowledge gaps',
    data_type: 'qualitative',
    requires_sources: false,
    can_be_empty: false,
    empty_display: 'Knowledge gaps not acknowledged.',
  },
  {
    block_id: 47,
    block_group: 'uncertainty_nonknowledge',
    question: 'What varies most?',
    answers_intent: 'Highest variance factors',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Variance sources not identified.',
  },
  {
    block_id: 48,
    block_group: 'uncertainty_nonknowledge',
    question: 'What could change over time?',
    answers_intent: 'Temporal instability factors',
    data_type: 'qualitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Change factors not considered.',
  },
  {
    block_id: 49,
    block_group: 'uncertainty_nonknowledge',
    question: 'How confident are we in this data?',
    answers_intent: 'Epistemic confidence assessment',
    data_type: 'quantitative',
    requires_sources: true,
    can_be_empty: false,
    empty_display: 'Confidence level not assessed.',
  },
  {
    block_id: 50,
    block_group: 'uncertainty_nonknowledge',
    question: 'What would invalidate this analysis?',
    answers_intent: 'Falsification conditions',
    data_type: 'qualitative',
    requires_sources: false,
    can_be_empty: false,
    empty_display: 'Invalidation conditions not stated.',
  },
];

/**
 * All blocks
 */
export const ALL_QUESTION_BLOCKS: QuestionBlock[] = [
  ...SCOPE_ASSUMPTION_BLOCKS,
  ...COST_RESOURCE_BLOCKS,
  ...PERFORMANCE_RELIABILITY_BLOCKS,
  ...RISK_FAILURE_BLOCKS,
  ...DOMINANCE_TRADEOFF_BLOCKS,
  ...UNCERTAINTY_BLOCKS,
];

/**
 * Block groups
 */
export const BLOCK_GROUPS: BlockGroup[] = [
  {
    group_id: 'scope_assumptions',
    name: 'Scope & Assumptions',
    block_range: [1, 5],
    purpose: 'Define who this applies to, under what assumptions, and when it does not apply',
    blocks: SCOPE_ASSUMPTION_BLOCKS,
  },
  {
    group_id: 'cost_resources',
    name: 'Cost & Resources',
    block_range: [6, 15],
    purpose: 'Direct cost, TCO, opportunity cost, and resource requirements',
    blocks: COST_RESOURCE_BLOCKS,
  },
  {
    group_id: 'performance_reliability',
    name: 'Performance & Reliability',
    block_range: [16, 25],
    purpose: 'Failure statistics, variance, comparison within class',
    blocks: PERFORMANCE_RELIABILITY_BLOCKS,
  },
  {
    group_id: 'risk_failure_modes',
    name: 'Risk & Failure Modes',
    block_range: [26, 35],
    purpose: 'Common problems, worst cases, frequency and consequence',
    blocks: RISK_FAILURE_BLOCKS,
  },
  {
    group_id: 'dominance_tradeoffs',
    name: 'Dominance & Trade-offs',
    block_range: [36, 45],
    purpose: 'When X dominates, when X loses, sensitivity analysis',
    blocks: DOMINANCE_TRADEOFF_BLOCKS,
  },
  {
    group_id: 'uncertainty_nonknowledge',
    name: 'Uncertainty & Non-Knowledge',
    block_range: [46, 50],
    purpose: 'What we do not know, what varies most, what can change',
    blocks: UNCERTAINTY_BLOCKS,
  },
];

/**
 * Get block by ID
 */
export function getBlock(blockId: number): QuestionBlock | undefined {
  return ALL_QUESTION_BLOCKS.find(b => b.block_id === blockId);
}

/**
 * Get blocks by group
 */
export function getBlocksByGroup(groupId: BlockGroupId): QuestionBlock[] {
  return ALL_QUESTION_BLOCKS.filter(b => b.block_group === groupId);
}

/**
 * QUESTION BLOCKS MASTERPROMPT
 */
export const QUESTION_BLOCKS_MASTERPROMPT = `
You populate the 50 Question Blocks.

FIXED TEMPLATE. NEVER AD HOC.
No block can be missing. Empty blocks are exposed openly.

BLOCK GROUPS:

1. SCOPE & ASSUMPTIONS (1-5)
- Who does this apply to?
- Under what assumptions?
- When does this NOT apply?
- Time frame of validity?
- Geography/context covered?

2. COST & RESOURCES (6-15)
- Direct cost
- TCO over time
- Opportunity cost
- Recurring costs
- Time investment
- Prerequisites
- Switching costs
- Cost comparison
- Cost trends
- Hidden costs

3. PERFORMANCE & RELIABILITY (16-25)
- Failure rate (aggregate)
- Variance
- Comparison within class
- Expected lifespan
- Performance history
- User experience
- Benchmarks
- Conditions affecting performance
- Maintenance requirements
- Degradation pattern

4. RISK & FAILURE MODES (26-35)
- Common problems
- Worst-case scenarios
- Frequency of problems
- Severity of problems
- Irreversible harm risk
- Early warning signs
- Mitigation options
- Recovery path
- Who bears risk
- Comparative risk

5. DOMINANCE & TRADE-OFFS (36-45)
- When X dominates
- When X loses
- Trade-off structure
- Sensitivity analysis
- Second-order effects
- Winners and losers
- Optimization vs. sacrifice
- Dominant option assessment
- Tipping points
- Reversibility

6. UNCERTAINTY & NON-KNOWLEDGE (46-50)
- What we don't know
- What varies most
- What can change
- Confidence level
- Invalidation conditions

⚠️ NO BLOCK CAN BE MISSING
⚠️ EMPTY BLOCKS ARE EXPOSED OPENLY

For empty blocks, show:
- "No verified data available for this question"
- Why it's empty
- What would fill it
`;
