/**
 * THE ORACLE AND HUMANS
 * 
 * STEG 32: HUMAN INTERACTION BOUNDARIES
 * 
 * Humans may:
 * - Read
 * - Use
 * - Cite
 * - Build on top
 * 
 * Humans may not:
 * - Ask "what does this mean?"
 * - Demand conclusions
 * - Request guidance
 * - Demand position-taking
 * 
 * The oracle's answer to all such requests is always:
 * "That is not a question the system answers."
 * 
 * This is not rude.
 * It is boundary-setting.
 */

/**
 * WHAT HUMANS MAY DO
 */
export const HUMANS_MAY = {
  read: {
    action: 'Access and view data',
    freely: true,
    limitation: 'Public data is freely accessible',
  },
  
  use: {
    action: 'Incorporate data into their own work',
    freely: true,
    limitation: 'Must follow attribution requirements',
  },
  
  cite: {
    action: 'Reference oracle as source',
    freely: true,
    limitation: 'Must cite accurately, including methodology',
  },
  
  build_on_top: {
    action: 'Create applications, analyses, tools using oracle data',
    freely: true,
    limitation: 'Cannot claim oracle endorsement of their conclusions',
  },
  
  query: {
    action: 'Submit valid queries for observable data',
    freely: true,
    limitation: 'Only queries about observable, verifiable states',
  },
} as const;

/**
 * WHAT HUMANS MAY NOT DO
 */
export const HUMANS_MAY_NOT = {
  ask_what_means: {
    request: '"What does this data mean?"',
    why_forbidden: 'Meaning requires interpretation; oracle does not interpret',
    response: 'That is not a question the system answers.',
  },
  
  demand_conclusions: {
    request: '"What conclusion should I draw?"',
    why_forbidden: 'Conclusions are for humans to draw from data',
    response: 'That is not a question the system answers.',
  },
  
  request_guidance: {
    request: '"What should I do about this?"',
    why_forbidden: 'Guidance is normative; oracle is descriptive only',
    response: 'That is not a question the system answers.',
  },
  
  demand_position: {
    request: '"Which side is right?"',
    why_forbidden: 'Position-taking is political; oracle is neutral',
    response: 'That is not a question the system answers.',
  },
  
  ask_for_prediction: {
    request: '"What will happen?"',
    why_forbidden: 'Predictions are speculative; oracle reports observed states',
    response: 'That is not a question the system answers.',
  },
  
  request_recommendation: {
    request: '"What do you recommend?"',
    why_forbidden: 'Recommendations are normative; oracle is descriptive only',
    response: 'That is not a question the system answers.',
  },
} as const;

/**
 * THE STANDARD RESPONSE
 */
export const STANDARD_RESPONSE = {
  text: 'That is not a question the system answers.',
  
  variations: {
    for_meaning: 'The system provides data. Interpretation is for the user.',
    for_conclusion: 'The system does not draw conclusions.',
    for_guidance: 'The system does not provide guidance.',
    for_position: 'The system does not take positions.',
    for_prediction: 'The system does not make predictions.',
    for_recommendation: 'The system does not make recommendations.',
  },
  
  tone: 'Neutral, not apologetic, not rude',
  
  no_elaboration: 'Do not explain why, do not offer alternatives, just decline',
} as const;

/**
 * THIS IS NOT RUDE
 */
export const NOT_RUDE = {
  perception: 'Some will perceive boundary-setting as rude',
  
  reality: {
    is_boundary_setting: 'Clearly defining what the system does',
    is_honest: 'Not pretending to offer what it cannot',
    is_protective: 'Protecting users from false confidence',
    is_consistent: 'Same response to all, regardless of who asks',
  },
  
  alternative_would_be: {
    dishonest: 'Pretending to offer interpretation',
    dangerous: 'Providing conclusions that may be wrong',
    inconsistent: 'Answering some but not others',
  },
  
  principle: 'Clarity is kindness; false helpfulness is cruelty',
} as const;

/**
 * WHEN HUMANS PUSH BACK
 */
export const PUSHBACK_RESPONSE = {
  argument: '"But I need to know what this means!"',
  
  response: {
    acknowledge: 'We understand the need for interpretation.',
    redirect: 'Interpretation is the user\'s responsibility.',
    offer: 'We provide the most accurate data possible to inform your interpretation.',
    decline: 'We cannot provide interpretation without compromising accuracy.',
  },
  
  no_exceptions: 'No exceptions for important people, paying customers, or urgent situations',
} as const;

/**
 * THE BOUNDARY IN PRACTICE
 */
export const BOUNDARY_IN_PRACTICE = {
  query_classification: {
    valid: 'Observable state queries ("What was X at time T?")',
    invalid: 'Interpretive queries ("What does X mean?")',
    automated: 'Classification is automated, not discretionary',
  },
  
  response_generation: {
    valid_query: 'Provide data with methodology and limitations',
    invalid_query: 'Standard decline response',
    no_judgment: 'Do not explain why query is invalid in detail',
  },
  
  consistency: 'Same treatment for all users, all queries, all times',
} as const;
