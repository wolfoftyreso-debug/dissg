/**
 * SEMANTIC IMPORTANCE LAYER
 * 
 * Every Answer Packet and Decision Node gets an obligatory block:
 * - why_it_matters (without advice)
 * - what_it_does_not_mean (compliance guard)
 * 
 * This ensures users understand immediately while AI models can summarize without distorting.
 */

/**
 * IMPORTANCE CATEGORY
 */
export type ImportanceCategory = 
  | 'system_capacity'
  | 'long_term_outcome'
  | 'cross_domain_effect'
  | 'population_welfare'
  | 'resource_allocation'
  | 'trend_signal'
  | 'baseline_reference';

/**
 * SEMANTIC IMPORTANCE BLOCK (REQUIRED ON ALL ANSWERS)
 */
export interface SemanticImportance {
  readonly why_it_matters: readonly ImportanceStatement[];
  readonly what_it_does_not_mean: readonly string[];
  readonly connections: readonly ConnectionStatement[];
  readonly next_valid_questions: readonly string[];
}

/**
 * IMPORTANCE STATEMENT
 */
export interface ImportanceStatement {
  readonly category: ImportanceCategory;
  readonly statement: string;
  readonly evidence_basis: string;
  readonly affected_domains?: readonly string[];
}

/**
 * CONNECTION STATEMENT
 */
export interface ConnectionStatement {
  readonly type: 'upstream' | 'downstream' | 'parallel' | 'causal_hypothesis';
  readonly target_indicator: string;
  readonly relationship: string;
  readonly strength: 'strong' | 'moderate' | 'weak' | 'hypothesized';
}

/**
 * IMPORTANCE TEMPLATES BY DOMAIN
 */
export const IMPORTANCE_TEMPLATES = {
  healthcare: {
    what_it_does_not_mean: [
      'This does not constitute medical advice',
      'This does not predict individual outcomes',
      'This is population-level data, not clinical guidance',
      'This does not recommend any treatment or action',
    ],
  },
  economy: {
    what_it_does_not_mean: [
      'This is not financial advice',
      'This does not predict market movements',
      'This does not recommend buy, sell, or hold actions',
      'Past patterns do not guarantee future results',
    ],
  },
  youth: {
    what_it_does_not_mean: [
      'This does not diagnose any condition',
      'This does not predict individual trajectories',
      'Population averages may not apply to individuals',
      'This is observational data, not intervention guidance',
    ],
  },
  medicine: {
    what_it_does_not_mean: [
      'This is not a diagnosis',
      'This does not replace clinical judgment',
      'Individual responses vary significantly',
      'Consult healthcare professionals for personal decisions',
    ],
  },
  markets: {
    what_it_does_not_mean: [
      'This is not investment advice',
      'This does not predict future prices',
      'Historical volatility does not indicate future risk',
      'No buy, sell, or hold recommendation is implied',
    ],
  },
} as const;

/**
 * GENERATE IMPORTANCE BLOCK
 */
export function generateImportanceBlock(
  domain: keyof typeof IMPORTANCE_TEMPLATES,
  statements: ImportanceStatement[],
  connections: ConnectionStatement[],
  nextQuestions: string[]
): SemanticImportance {
  const template = IMPORTANCE_TEMPLATES[domain];
  
  return {
    why_it_matters: statements,
    what_it_does_not_mean: template.what_it_does_not_mean,
    connections,
    next_valid_questions: nextQuestions,
  };
}

/**
 * EXAMPLE: YOUTH MENTAL HEALTH IMPORTANCE BLOCK
 */
export const YOUTH_MENTAL_HEALTH_EXAMPLE: SemanticImportance = {
  why_it_matters: [
    {
      category: 'population_welfare',
      statement: 'This affects a significant portion of the youth population',
      evidence_basis: 'Prevalence exceeds 15% in measured cohorts',
      affected_domains: ['healthcare', 'education'],
    },
    {
      category: 'long_term_outcome',
      statement: 'Youth mental health correlates with adult outcomes',
      evidence_basis: 'Longitudinal studies show persistent effects',
      affected_domains: ['labor', 'healthcare'],
    },
    {
      category: 'trend_signal',
      statement: 'Trend direction indicates change requiring observation',
      evidence_basis: 'Rate of change exceeds historical baseline',
    },
  ],
  what_it_does_not_mean: [
    'This does not diagnose any condition',
    'This does not predict individual trajectories',
    'Population averages may not apply to individuals',
    'This is observational data, not intervention guidance',
  ],
  connections: [
    {
      type: 'downstream',
      target_indicator: 'school_completion_rate',
      relationship: 'Mental health challenges correlate with completion rates',
      strength: 'moderate',
    },
    {
      type: 'parallel',
      target_indicator: 'sleep_patterns',
      relationship: 'Often co-occur in same populations',
      strength: 'strong',
    },
    {
      type: 'causal_hypothesis',
      target_indicator: 'social_media_usage',
      relationship: 'Association observed, causality not established',
      strength: 'hypothesized',
    },
  ],
  next_valid_questions: [
    'How has this changed over time?',
    'How does this vary by region?',
    'What is the correlation with sleep patterns?',
    'How does this compare to historical normal ranges?',
    'What is the difference between self-reported and clinical prevalence?',
  ],
};

/**
 * VALIDATE IMPORTANCE BLOCK
 */
export function validateImportanceBlock(block: SemanticImportance): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (block.why_it_matters.length === 0) {
    errors.push('At least one importance statement required');
  }
  
  if (block.what_it_does_not_mean.length === 0) {
    errors.push('At least one limitation statement required');
  }
  
  if (block.next_valid_questions.length === 0) {
    errors.push('At least one next question required');
  }
  
  // Check for forbidden patterns
  const forbiddenPatterns = [/should/i, /must/i, /recommend/i, /advise/i, /optimal/i];
  
  for (const stmt of block.why_it_matters) {
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(stmt.statement)) {
        errors.push(`Forbidden pattern in importance statement: ${pattern}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
