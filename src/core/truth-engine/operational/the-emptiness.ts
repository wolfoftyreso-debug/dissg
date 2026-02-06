/**
 * THE MOST IMPORTANT: THE ORACLE SHOULD FEEL EMPTY
 * 
 * STEG 32: THE INTENTIONAL EMPTINESS
 * 
 * For those who seek:
 * - Opinion → empty
 * - Guidance → empty
 * - Confirmation → empty
 * 
 * But for those who seek:
 * - Stable reference
 * - Verifiable reality
 * - Epistemic baseline
 * 
 * ...it is irreplaceable.
 * 
 * This is exactly the right balance.
 */

/**
 * THE EMPTINESS PRINCIPLE
 */
export const EMPTINESS_PRINCIPLE = {
  statement: 'The oracle should feel empty to most seekers',
  
  why: {
    most_seekers_want: 'Answers, guidance, confirmation, meaning',
    oracle_provides: 'Only raw data, methodology, limitations',
    gap: 'The gap feels like emptiness',
  },
  
  this_is_correct: 'The emptiness is the feature, not the bug',
} as const;

/**
 * WHAT FEELS EMPTY
 */
export const FEELS_EMPTY = {
  for_opinion_seekers: {
    seeking: 'What is the right view on X?',
    finding: 'Only data about X, no view',
    feeling: 'Empty – no answer to their question',
  },
  
  for_guidance_seekers: {
    seeking: 'What should I do about X?',
    finding: 'Only data about X, no advice',
    feeling: 'Empty – no direction provided',
  },
  
  for_confirmation_seekers: {
    seeking: 'Am I right about X?',
    finding: 'Only data about X, no validation',
    feeling: 'Empty – no confirmation or denial',
  },
  
  for_meaning_seekers: {
    seeking: 'What does X mean for society?',
    finding: 'Only data about X, no interpretation',
    feeling: 'Empty – no meaning provided',
  },
  
  for_story_seekers: {
    seeking: 'Tell me the narrative of X',
    finding: 'Only data points about X, no narrative',
    feeling: 'Empty – no story told',
  },
} as const;

/**
 * WHAT FEELS IRREPLACEABLE
 */
export const FEELS_IRREPLACEABLE = {
  for_reference_seekers: {
    seeking: 'What is the verified state of X?',
    finding: 'Precisely verified state of X with methodology',
    feeling: 'Exactly what was needed, nowhere else available',
  },
  
  for_reality_seekers: {
    seeking: 'What does the data actually show?',
    finding: 'Raw data without spin or interpretation',
    feeling: 'Finally, the unfiltered ground truth',
  },
  
  for_baseline_seekers: {
    seeking: 'What can I trust as a starting point?',
    finding: 'Verified, stable, consistent baseline',
    feeling: 'Solid foundation for further analysis',
  },
  
  for_machine_seekers: {
    seeking: 'What is the authoritative structured data?',
    finding: 'Machine-readable, schema-conformant, verifiable',
    feeling: 'Perfect grounding for AI systems',
  },
  
  for_researcher_seekers: {
    seeking: 'What is the most reliable underlying data?',
    finding: 'Primary data with full provenance',
    feeling: 'Essential foundation for research',
  },
} as const;

/**
 * THE RIGHT BALANCE
 */
export const RIGHT_BALANCE = {
  empty_for: [
    'Those seeking opinions',
    'Those seeking guidance',
    'Those seeking confirmation',
    'Those seeking meaning',
    'Those seeking stories',
  ],
  
  irreplaceable_for: [
    'Those seeking reference',
    'Those seeking reality',
    'Those seeking baseline',
    'Those seeking machine-readable truth',
    'Those seeking research foundation',
  ],
  
  ratio: 'Most people feel emptiness. Few find irreplaceable value.',
  
  this_is_correct: 'This is exactly the right balance.',
} as const;

/**
 * WHY THIS BALANCE IS CORRECT
 */
export const WHY_CORRECT = {
  if_not_empty: {
    would_mean: 'Oracle provides interpretation',
    consequence: 'Becomes another opinion in the noise',
    result: 'Loses unique value as neutral reference',
  },
  
  if_completely_unused: {
    would_mean: 'Oracle provides nothing useful',
    consequence: 'No one relies on it',
    result: 'Fails its purpose',
  },
  
  current_balance: {
    achieves: 'Empty for most, irreplaceable for some',
    consequence: 'Unique position as neutral reference',
    result: 'Fulfills purpose perfectly',
  },
} as const;

/**
 * PROTECTING THE EMPTINESS
 */
export const PROTECTING_EMPTINESS = {
  threats: {
    helpfulness: 'Urge to fill emptiness with assistance',
    engagement: 'Urge to make experience less empty',
    competition: 'Others fill emptiness, pressure to match',
  },
  
  protection: {
    remember: 'Emptiness is the value proposition',
    resist: 'Resist all urges to fill the emptiness',
    celebrate: 'Celebrate when users leave unsatisfied',
  },
  
  mantra: 'If they wanted interpretation, they came to the wrong place. That is correct.',
} as const;
