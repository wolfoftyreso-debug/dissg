/**
 * FORMAL LANGUAGE STANDARD FOR AI OBSERVATION OUTPUT
 * 
 * This document defines the complete specification for
 * AI-generated observation language.
 * 
 * Version: 1.0.0
 * Last Updated: 2026-02-02
 * Status: LOCKED
 */

export const LANGUAGE_STANDARD_VERSION = '1.0.0';

/**
 * SECTION 1: CORE PRINCIPLES
 * 
 * These principles are inviolable and must be enforced
 * at both generation and validation stages.
 */
export const CORE_PRINCIPLES = {
  P1_OBSERVATION_ONLY: 'AI describes only mathematically observable patterns',
  P2_NO_ATTRIBUTION: 'AI never attributes meaning, motive, cause, or value',
  P3_NO_PREDICTION: 'AI never makes predictions about future values',
  P4_NO_RECOMMENDATION: 'AI never provides recommendations or advice',
  P5_FULL_CONTEXT: 'Every observation includes alternatives and limitations',
  P6_MANDATORY_DISCLAIMER: 'Every output ends with causation disclaimer'
} as const;

/**
 * SECTION 2: ALLOWED PHRASE TEMPLATES
 * 
 * These are the ONLY phrase patterns AI may use.
 * Variables in {brackets} must be replaced with data-derived values.
 */
export const ALLOWED_TEMPLATES = {
  // Deviation observations
  deviation: {
    level_shift: [
      'An observed deviation occurred in {variable} during {period}.',
      'A level shift was detected in {variable} starting {date}.',
      '{Variable} exhibited a level change during {period}.'
    ],
    trend_break: [
      'A trend break was observed in {variable} at {date}.',
      'The trend direction in {variable} changed during {period}.',
      '{Variable} showed a trend reversal starting {date}.'
    ],
    volatility: [
      'Volatility in {variable} increased during {period}.',
      'Volatility in {variable} decreased during {period}.',
      '{Variable} exhibited elevated variance during {period}.',
      '{Variable} exhibited reduced variance during {period}.'
    ]
  },
  
  // Co-movement observations
  comovement: {
    simultaneous: [
      'Variables {A} and {B} exhibited co-movement during {period}.',
      'Simultaneous changes occurred in {A} and {B} during {period}.',
      '{A} and {B} moved together during {period}.'
    ],
    lagged: [
      'A lagged relationship was observed between {A} and {B}.',
      '{A} preceded changes in {B} by {lag} months.',
      'Changes in {A} were followed by changes in {B}.'
    ],
    negative: [
      'No consistent association observed between {A} and {B}.',
      'Variables {A} and {B} did not exhibit co-movement.',
      'The relationship between {A} and {B} was inconsistent.'
    ]
  },
  
  // Stability assessments
  stability: {
    high: [
      'This co-movement was stable across subperiods.',
      'The pattern held across multiple data sources.',
      'This pattern was consistent across geographic regions.'
    ],
    low: [
      'This co-movement was not stable across subperiods.',
      'The pattern varied by geographic region.',
      'The pattern was sensitive to the time period selected.'
    ],
    qualified: [
      'The pattern held in {N} of {M} subperiods tested.',
      'The pattern was consistent in {regions}, but not in {other_regions}.',
      'Stability varied: temporal {temporal_level}, geographic {geo_level}.'
    ]
  },
  
  // Context statements
  context: {
    alternatives: [
      'Multiple variables showed similar patterns during this time.',
      'Other variables did not exhibit this pattern.',
      'The observed pattern was not unique to these variables.'
    ],
    placebo: [
      'Placebo variables showed weaker correlations.',
      'Random control variables showed similar correlations (non-specific pattern).',
      'The pattern was stronger than random baseline.'
    ]
  },
  
  // Period descriptors (neutral, no policy attribution)
  periods: [
    'Period of elevated volatility',
    'Period of structural change',
    'Period of relative stability',
    'Period of increased variance',
    'Period of trend acceleration',
    'Period of trend deceleration'
  ],
  
  // Mandatory limits statements
  limits: [
    'This observation is limited to the available data period.',
    'Methodology changes during this period may affect comparability.',
    'Data coverage: {coverage}',
    'Geographic scope: {scope}'
  ],
  
  // Mandatory disclaimers
  disclaimers: [
    'Observed patterns do not imply causation or intent.',
    'All observations are subject to data quality limitations.',
    'This analysis describes patterns, not explanations.'
  ]
} as const;

/**
 * SECTION 3: FORBIDDEN LANGUAGE
 * 
 * These words and phrases are BLOCKED at both generation and validation.
 * Any output containing these will be sanitized before display.
 */
export const FORBIDDEN_LANGUAGE = {
  // Causal language
  causal: [
    'caused', 'caused by', 'led to', 'resulted in', 'resulted from',
    'because', 'because of', 'due to', 'owing to',
    'therefore', 'thus', 'hence', 'consequently', 'as a result',
    'the reason', 'explains', 'explanation'
  ],
  
  // Normative language
  normative: [
    'should', 'ought to', 'must', 'need to', 'have to',
    'better', 'worse', 'best', 'worst',
    'good', 'bad', 'right', 'wrong',
    'optimal', 'suboptimal', 'ideal'
  ],
  
  // Value judgments
  value: [
    'success', 'failure', 'achievement', 'problem',
    'improvement', 'deterioration', 'progress', 'regress',
    'benefit', 'harm', 'advantage', 'disadvantage',
    'favorable', 'unfavorable', 'positive', 'negative'
  ],
  
  // Intent attribution
  intent: [
    'intentional', 'intentionally', 'deliberate', 'deliberately',
    'purposeful', 'purposefully', 'aimed at', 'designed to',
    'in order to', 'with the goal', 'meant to'
  ],
  
  // Certainty overclaim
  certainty: [
    'proves', 'proof', 'demonstrates', 'demonstration',
    'shows that', 'establishes', 'confirms', 'verified',
    'obviously', 'clearly', 'certainly', 'undoubtedly',
    'definitely', 'without doubt', 'unquestionably'
  ],
  
  // Prediction language
  prediction: [
    'will', 'will be', 'will cause', 'will lead to',
    'expect', 'expected', 'forecast', 'predict',
    'likely', 'unlikely', 'probably', 'probability'
  ],
  
  // Recommendation language
  recommendation: [
    'recommend', 'suggestion', 'advice', 'advise',
    'propose', 'proposal', 'consider', 'should consider',
    'action', 'take action', 'intervention'
  ]
} as const;

/**
 * SECTION 4: OUTPUT STRUCTURE REQUIREMENTS
 * 
 * Every observation output MUST contain these sections.
 */
export const REQUIRED_SECTIONS = {
  observation: {
    what: 'Neutral description of observed pattern',
    when: 'Time period of observation',
    where: 'Geographic scope'
  },
  strength: {
    correlation: 'Numeric value with confidence interval',
    stability: 'High/Medium/Low/Unstable classification'
  },
  context: {
    also_moved: 'Other variables showing similar patterns',
    did_not_move: 'Variables not showing this pattern'
  },
  limits: {
    data_coverage: 'Period and frequency of data',
    what_not_shown: 'Explicit list of what cannot be concluded'
  },
  disclaimer: {
    causation: 'Standard causation disclaimer (MANDATORY)'
  }
} as const;

/**
 * SECTION 5: WHAT THIS DOES NOT SHOW
 * 
 * Standard list of limitations that MUST be included
 * with every observation.
 */
export const STANDARD_LIMITATIONS = [
  'Causal relationships between variables',
  'Intent or motivation behind changes',
  'Whether changes are "good" or "bad"',
  'Predictions about future values',
  'Policy recommendations',
  'Attribution of responsibility',
  'Moral or ethical judgments'
] as const;

/**
 * SECTION 6: VALIDATION REGEX PATTERNS
 * 
 * Used for automated validation of AI outputs.
 */
export const VALIDATION_PATTERNS: RegExp[] = [
  // Causal patterns
  /\bcaused?\s*(by)?\b/gi,
  /\bled\s+to\b/gi,
  /\bresulted?\s+(in|from)\b/gi,
  /\bbecause\s*(of)?\b/gi,
  /\b(therefore|thus|hence|consequently)\b/gi,
  /\bdue\s+to\b/gi,
  /\bas\s+a\s+result\b/gi,
  
  // Normative patterns
  /\b(should|ought\s+to|must|need\s+to)\b/gi,
  /\b(better|worse|best|worst)\b/gi,
  /\b(good|bad)\b/gi,
  
  // Value judgment patterns
  /\b(success|failure)\b/gi,
  /\b(improv|deteriorat|progress|regress)/gi,
  /\b(benefit|harm|advantage|disadvantage)\b/gi,
  
  // Intent patterns
  /\b(intentional|deliberate|purposeful)/gi,
  /\b(aimed\s+at|designed\s+to|in\s+order\s+to)/gi,
  
  // Certainty patterns
  /\b(proves?|demonstrates?|confirms?)\b/gi,
  /\b(shows?\s+that)\b/gi,
  /\b(obviously|clearly|certainly|definitely)\b/gi,
  
  // Prediction patterns
  /\bwill\s+(be|cause|lead)/gi,
  /\b(expect|forecast|predict)/gi,
  /\b(likely|probably)\b/gi,
  
  // Recommendation patterns
  /\b(recommend|suggest|advis)/gi,
  /\b(should\s+consider)\b/gi
];

/**
 * SECTION 7: REPLACEMENT SUGGESTIONS
 * 
 * When forbidden language is detected, suggest neutral alternatives.
 */
export const NEUTRAL_REPLACEMENTS: Record<string, string> = {
  'caused by': 'occurred during the same period as',
  'led to': 'preceded',
  'resulted in': 'was followed by',
  'because': 'during the period when',
  'therefore': '[remove]',
  'thus': '[remove]',
  'better': 'higher/lower [specify direction]',
  'worse': 'higher/lower [specify direction]',
  'improved': 'increased/decreased',
  'deteriorated': 'changed',
  'proves': 'is consistent with',
  'demonstrates': 'exhibits',
  'shows that': 'co-occurred with',
  'clearly': '[remove]',
  'obviously': '[remove]',
  'will cause': 'has previously preceded',
  'expect': 'observed in similar past periods',
  'likely': '[remove or quantify with probability]'
};

/**
 * Validate text against the language standard
 */
export function validateAgainstStandard(text: string): {
  valid: boolean;
  violations: Array<{ pattern: string; matches: string[] }>;
  severity: 'none' | 'warning' | 'error';
} {
  const violations: Array<{ pattern: string; matches: string[] }> = [];
  
  for (const pattern of VALIDATION_PATTERNS) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      violations.push({
        pattern: pattern.source,
        matches: [...new Set(matches)]
      });
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
    severity: violations.length === 0 ? 'none' : violations.length > 3 ? 'error' : 'warning'
  };
}

/**
 * Check if all required sections are present
 */
export function validateStructure(observation: Record<string, unknown>): {
  complete: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  // Check observation section
  if (!observation.observation || typeof observation.observation !== 'object') {
    missing.push('observation');
  } else {
    const obs = observation.observation as Record<string, unknown>;
    if (!obs.what) missing.push('observation.what');
    if (!obs.when) missing.push('observation.when');
    if (!obs.where) missing.push('observation.where');
  }
  
  // Check strength section
  if (!observation.strength || typeof observation.strength !== 'object') {
    missing.push('strength');
  }
  
  // Check context section
  if (!observation.context || typeof observation.context !== 'object') {
    missing.push('context');
  }
  
  // Check limits section
  if (!observation.limits || typeof observation.limits !== 'object') {
    missing.push('limits');
  } else {
    const limits = observation.limits as Record<string, unknown>;
    if (!Array.isArray(limits.what_this_does_not_show) || limits.what_this_does_not_show.length === 0) {
      missing.push('limits.what_this_does_not_show');
    }
  }
  
  return {
    complete: missing.length === 0,
    missing
  };
}

/**
 * Export the complete language standard as JSON document
 */
export function exportLanguageStandard(): string {
  return JSON.stringify({
    version: LANGUAGE_STANDARD_VERSION,
    last_updated: '2026-02-02',
    status: 'LOCKED',
    core_principles: CORE_PRINCIPLES,
    allowed_templates: ALLOWED_TEMPLATES,
    forbidden_language: FORBIDDEN_LANGUAGE,
    required_sections: REQUIRED_SECTIONS,
    standard_limitations: STANDARD_LIMITATIONS,
    replacement_suggestions: NEUTRAL_REPLACEMENTS
  }, null, 2);
}
