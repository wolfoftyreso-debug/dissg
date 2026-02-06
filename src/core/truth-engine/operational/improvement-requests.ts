/**
 * WHEN SOMEONE WANTS TO "IMPROVE" THE ORACLE
 * 
 * STEG 32: THE IMPROVEMENT RESPONSE
 * 
 * This will happen, sooner or later.
 * 
 * The answer is always:
 * "Improvements happen through coverage, not interpretation."
 * 
 * Then point to:
 * - More data points
 * - Longer time series
 * - Better metadata
 * - Clearer provenance
 * 
 * Never:
 * - Better language
 * - Smarter summaries
 * - More pedagogy
 */

/**
 * THE STANDARD IMPROVEMENT RESPONSE
 */
export const IMPROVEMENT_RESPONSE = {
  statement: 'Improvements happen through coverage, not interpretation.',
  
  meaning: {
    coverage: 'More data, longer history, better sourcing',
    interpretation: 'Better explanations, smarter summaries, clearer language',
    allowed: 'Coverage improvements',
    forbidden: 'Interpretation improvements',
  },
} as const;

/**
 * ALLOWED IMPROVEMENTS
 */
export const ALLOWED_IMPROVEMENTS = {
  more_data_points: {
    what: 'Additional observable data',
    example: 'Adding data for more countries, more indicators',
    why_allowed: 'Expands what can be answered without changing how',
    process: 'Standard ingest with quality verification',
  },
  
  longer_time_series: {
    what: 'Historical data extending further back',
    example: 'Adding data from 1900 to existing 1950-present series',
    why_allowed: 'Deepens context without adding interpretation',
    process: 'Historical data verification, source validation',
  },
  
  better_metadata: {
    what: 'More complete information about data',
    example: 'Adding collection methodology, sample sizes, confidence intervals',
    why_allowed: 'Improves transparency without adding interpretation',
    process: 'Metadata schema extension, source verification',
  },
  
  clearer_provenance: {
    what: 'Better documentation of data sources',
    example: 'More detailed source attribution, chain of custody',
    why_allowed: 'Improves verifiability without adding interpretation',
    process: 'Provenance documentation, source verification',
  },
  
  more_granularity: {
    what: 'Finer-grained data breakdowns',
    example: 'Regional data where only national existed',
    why_allowed: 'Enables more specific queries without interpretation',
    process: 'Granularity extension, consistency verification',
  },
} as const;

/**
 * FORBIDDEN IMPROVEMENTS
 */
export const FORBIDDEN_IMPROVEMENTS = {
  better_language: {
    what: 'More accessible, clearer wording',
    example: 'Rewriting data descriptions to be more readable',
    why_forbidden: 'Accessibility improvements often require interpretation',
    response: 'External tools may provide translation layers',
  },
  
  smarter_summaries: {
    what: 'Automatic summary generation',
    example: 'AI-generated summaries of data trends',
    why_forbidden: 'Summaries require selection and interpretation',
    response: 'External tools may generate summaries from raw data',
  },
  
  more_pedagogy: {
    what: 'Educational explanations of data',
    example: 'Explanatory text about what data means',
    why_forbidden: 'Pedagogy is interpretation in educational form',
    response: 'External educational resources may interpret data',
  },
  
  visualization_improvements: {
    what: 'Better charts, graphs, visual presentations',
    example: 'Interactive dashboards, trend visualizations',
    why_forbidden: 'Visualization choices imply interpretation',
    response: 'External tools may visualize raw data',
  },
  
  natural_language_responses: {
    what: 'Conversational answers to queries',
    example: 'AI-generated natural language responses',
    why_forbidden: 'Natural language requires interpretation of relevance',
    response: 'External interfaces may provide conversational layer',
  },
} as const;

/**
 * COMMON IMPROVEMENT ARGUMENTS AND RESPONSES
 */
export const ARGUMENT_RESPONSES = {
  accessibility: {
    argument: '"But the data is too hard to understand!"',
    response: 'Understanding is the user\'s responsibility. External tools may help.',
    principle: 'Accessibility cannot come at cost of accuracy.',
  },
  
  competition: {
    argument: '"But competitors have better summaries!"',
    response: 'Competitors may interpret. We provide the ground truth they summarize.',
    principle: 'We are not competing on interpretation.',
  },
  
  user_demand: {
    argument: '"But users want explanations!"',
    response: 'User wants do not override epistemic discipline.',
    principle: 'We serve accuracy, not preferences.',
  },
  
  modernization: {
    argument: '"But modern systems are more user-friendly!"',
    response: 'User-friendliness often requires interpretation.',
    principle: 'We are not a modern system. We are a reference system.',
  },
} as const;

/**
 * THE REDIRECT
 */
export const IMPROVEMENT_REDIRECT = {
  when_someone_wants_interpretation: {
    step_1: 'Acknowledge the need',
    step_2: 'Explain why we cannot provide it',
    step_3: 'Redirect to coverage improvements',
    step_4: 'Suggest external tools for interpretation',
  },
  
  script: {
    acknowledge: 'We understand the desire for more accessible presentation.',
    explain: 'Interpretation would compromise our role as neutral reference.',
    redirect: 'We can improve by expanding coverage – more data, longer history, better sourcing.',
    suggest: 'External tools are free to build interpretation layers on our data.',
  },
} as const;
