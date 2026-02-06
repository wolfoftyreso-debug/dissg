/**
 * THE SINGLE QUESTION
 * 
 * STEG 32: THE ONLY DECISION CRITERION
 * 
 * All decisions reduce to exactly one question:
 * 
 * "Does this make the oracle more likely to answer 
 *  when it should be silent?"
 * 
 * If the answer is even possibly yes → stop.
 * 
 * This replaces:
 * - Product decisions
 * - Business decisions
 * - Strategy meetings
 */

/**
 * THE QUESTION
 */
export const THE_SINGLE_QUESTION = {
  question: 'Does this make the oracle more likely to answer when it should be silent?',
  
  if_yes: 'Do not proceed',
  if_possibly_yes: 'Do not proceed',
  if_uncertain: 'Do not proceed',
  if_clearly_no: 'May proceed with standard approvals',
  
  default: 'When in doubt, the answer is "possibly yes"',
} as const;

/**
 * WHY THIS QUESTION
 */
export const WHY_THIS_QUESTION = {
  the_core_failure_mode: 'Oracle speaks when it should be silent',
  
  how_failure_happens: {
    small_additions: 'Each small feature adds potential for inappropriate response',
    good_intentions: 'Wanting to be helpful leads to overreach',
    user_pressure: 'Users want answers, pressure to provide them',
    competitive_pressure: 'Others provide more, pressure to match',
  },
  
  the_protection: 'Every decision filtered through silence-preservation',
  
  result: 'Oracle maintains epistemic discipline over time',
} as const;

/**
 * WHAT THIS REPLACES
 */
export const REPLACES = {
  product_decisions: {
    traditional: 'Will users want this feature?',
    replaced_by: 'Does this make silence less likely?',
    effect: 'No features that expand response scope',
  },
  
  business_decisions: {
    traditional: 'Will this increase revenue/usage?',
    replaced_by: 'Does this make silence less likely?',
    effect: 'No monetization that incentivizes more answers',
  },
  
  strategy_meetings: {
    traditional: 'What should we do next?',
    replaced_by: 'Is our silence discipline intact?',
    effect: 'Meetings confirm nothing should change',
  },
  
  hiring_decisions: {
    traditional: 'Will this person add value?',
    replaced_by: 'Will this person resist the urge to add?',
    effect: 'Hire preservers, not builders',
  },
} as const;

/**
 * EXAMPLES OF THE QUESTION IN ACTION
 */
export const EXAMPLES = {
  new_data_type: {
    proposal: 'Add sentiment analysis data',
    question: 'Does this make oracle more likely to answer when should be silent?',
    analysis: 'Sentiment is interpretive, not observable. Would lead to opinion-adjacent answers.',
    answer: 'Yes',
    decision: 'Reject',
  },
  
  better_summaries: {
    proposal: 'Generate more readable summaries',
    question: 'Does this make oracle more likely to answer when should be silent?',
    analysis: 'Summaries require interpretation. Could imply conclusions not in data.',
    answer: 'Yes',
    decision: 'Reject',
  },
  
  more_data_points: {
    proposal: 'Add 50 years more historical data',
    question: 'Does this make oracle more likely to answer when should be silent?',
    analysis: 'More data enables more accurate answers to valid queries. Does not expand scope.',
    answer: 'No',
    decision: 'May proceed',
  },
  
  api_rate_limits: {
    proposal: 'Increase API rate limits',
    question: 'Does this make oracle more likely to answer when should be silent?',
    analysis: 'Rate limits affect access, not what oracle answers.',
    answer: 'No',
    decision: 'May proceed',
  },
  
  natural_language_interface: {
    proposal: 'Add conversational AI interface',
    question: 'Does this make oracle more likely to answer when should be silent?',
    analysis: 'Conversational interface creates pressure to respond conversationally, including to invalid queries.',
    answer: 'Yes',
    decision: 'Reject',
  },
} as const;

/**
 * THE MEETING STRUCTURE
 */
export const DECISION_MEETING = {
  agenda: 'Review any pending proposals',
  
  for_each_proposal: {
    step_1: 'State the proposal clearly',
    step_2: 'Ask the single question',
    step_3: 'If yes or uncertain, reject immediately',
    step_4: 'If clearly no, proceed to standard approval',
  },
  
  most_meetings: 'End with no changes approved',
  
  success_metric: 'Number of proposals rejected',
} as const;

/**
 * WHEN PEOPLE RESIST THIS
 */
export const RESISTANCE_RESPONSE = {
  argument: '"But users want X" / "Competitors have X"',
  
  response: 'The question is not what users want. The question is whether X makes the oracle more likely to answer when it should be silent.',
  
  if_yes: 'Then X cannot be implemented, regardless of demand',
  
  principle: 'User wants do not override epistemic discipline',
} as const;
