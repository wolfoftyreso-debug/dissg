/**
 * Canonical Question & Answer Intelligence System (CQAIS)
 * 
 * "Every important question, already answered correctly"
 * 
 * This system industrializes question-answering by:
 * - Classifying all questions into a strict ontology
 * - Providing structured, data-backed answers
 * - Blocking normative/speculative questions
 * - Enabling AI-readable, human-understandable responses
 */

// =============================================================================
// QUESTION INTENT CLASSIFICATION (ONTOLOGY)
// =============================================================================

export type QuestionIntentClass = 
  | 'status'      // How is it now?
  | 'trend'       // What's changing over time?
  | 'cause'       // Why is this happening?
  | 'comparison'  // How does it differ?
  | 'consequence' // What does this mean?
  | 'forecast';   // What are likely outcomes?

export const QUESTION_INTENT_DEFINITIONS: Record<QuestionIntentClass, {
  label: string;
  description: string;
  example_questions: string[];
  requires_indicators: boolean;
  allows_comparison: boolean;
  allows_timeline: boolean;
}> = {
  status: {
    label: 'Status Questions',
    description: 'Current state or condition at a point in time',
    example_questions: [
      'How is Sweden doing?',
      'What is the unemployment rate in Germany?',
      'How is the world economy?'
    ],
    requires_indicators: true,
    allows_comparison: true,
    allows_timeline: false
  },
  trend: {
    label: 'Trend & Change Questions',
    description: 'Patterns and changes over time',
    example_questions: [
      'Is crime getting worse?',
      'Are real wages increasing or decreasing?',
      'Are jobs disappearing?'
    ],
    requires_indicators: true,
    allows_comparison: true,
    allows_timeline: true
  },
  cause: {
    label: 'Cause Questions',
    description: 'Factors and mechanisms behind observed patterns',
    example_questions: [
      'Why are housing prices high?',
      'Why is the birth rate declining?',
      'Why is populism growing?'
    ],
    requires_indicators: true,
    allows_comparison: true,
    allows_timeline: true
  },
  comparison: {
    label: 'Comparison Questions',
    description: 'Differences between entities, times, or conditions',
    example_questions: [
      'Sweden vs Norway',
      'City A vs City B',
      'Before vs after reform X'
    ],
    requires_indicators: true,
    allows_comparison: true,
    allows_timeline: true
  },
  consequence: {
    label: 'Consequence Questions',
    description: 'Implications and downstream effects',
    example_questions: [
      'What does this mean for me?',
      'What happens if nothing changes?',
      'What risks exist?'
    ],
    requires_indicators: true,
    allows_comparison: false,
    allows_timeline: true
  },
  forecast: {
    label: 'Forecast Questions',
    description: 'Likely future outcomes based on current trajectories',
    example_questions: [
      'How will jobs look in 10 years?',
      'What will happen to the pension system?',
      'Which sectors are growing?'
    ],
    requires_indicators: true,
    allows_comparison: true,
    allows_timeline: true
  }
};

// =============================================================================
// QUESTION BLOCK REASONS
// =============================================================================

export type QuestionBlockReason = 
  | 'normative'           // Is it right/wrong?
  | 'political_directive' // Should we do X?
  | 'speculative'         // What if (no data)?
  | 'insufficient_data'   // Not enough coverage
  | 'out_of_scope';       // Not factual

export const BLOCKED_QUESTION_RESPONSES: Record<QuestionBlockReason, {
  message: string;
  redirect_suggestion: string;
}> = {
  normative: {
    message: 'This question involves value judgments that cannot be answered empirically.',
    redirect_suggestion: 'Here is what can be measured instead: the observable outcomes and patterns in the data.'
  },
  political_directive: {
    message: 'This question asks for policy recommendations, which this system does not provide.',
    redirect_suggestion: 'Here are the measured outcomes of similar approaches in comparable contexts.'
  },
  speculative: {
    message: 'This question requires speculation beyond available data.',
    redirect_suggestion: 'Here is what the data currently shows, including trends and their observed trajectories.'
  },
  insufficient_data: {
    message: 'There is insufficient reliable data to answer this question precisely.',
    redirect_suggestion: 'Here are the related indicators with adequate data coverage.'
  },
  out_of_scope: {
    message: 'This question falls outside the scope of factual, data-backed answers.',
    redirect_suggestion: 'Try rephrasing as a question about observable, measurable conditions.'
  }
};

// =============================================================================
// SCOPE LEVELS
// =============================================================================

export type ScopeLevel = 'world' | 'continent' | 'country' | 'region' | 'city';

export const SCOPE_HIERARCHY: ScopeLevel[] = ['world', 'continent', 'country', 'region', 'city'];

// =============================================================================
// CANONICAL QUESTION NODE (CQN)
// =============================================================================

export interface CanonicalQuestionNode {
  question_id: string;
  canonical_text: string;
  canonical_text_local?: Record<string, string>;
  intent_class: QuestionIntentClass;
  scope_level: ScopeLevel;
  default_time_window: string;
  comparison_baseline?: string;
  search_variants: string[];
  related_indicator_ids: string[];
  primary_indicator_ids: string[];
  secondary_indicator_ids: string[];
  excluded_indicator_ids: string[];
  metadata: Record<string, unknown>;
}

// =============================================================================
// ALWAYS-ANSWER-FORMAT (A2F)
// =============================================================================

export interface AlwaysAnswerFormat {
  // 1. Short, direct answer (2-3 sentences)
  short_answer: string;
  
  // 2. What drives this (mechanisms)
  drivers: {
    indicator_id: string;
    indicator_name: string;
    contribution: 'positive' | 'negative' | 'neutral';
    magnitude: 'strong' | 'moderate' | 'weak';
    description: string;
  }[];
  
  // 3. Since when (timeline)
  timeline: {
    start_date: string;
    end_date: string;
    key_breakpoints: {
      date: string;
      description: string;
    }[];
  };
  
  // 4. Comparison
  comparison: {
    type: 'historical' | 'peer' | 'global';
    entities: string[];
    summary: string;
  }[];
  
  // 5. Uncertainty & what is not measured
  uncertainty: {
    data_coverage: 'high' | 'medium' | 'low';
    coverage_description: string;
    not_measured: string[];
    caveats: string[];
  };
  
  // 6. Deep links
  deep_links: {
    indicator_id: string;
    label: string;
    url: string;
  }[];
  
  // Metadata
  meta: {
    question_id: string;
    intent_class: QuestionIntentClass;
    scope: string;
    generated_at: string;
    data_freshness: string;
    citation_id: string;
    method_version: string;
  };
}

// =============================================================================
// BLOCKED ANSWER FORMAT
// =============================================================================

export interface BlockedAnswerFormat {
  is_blocked: true;
  block_reason: QuestionBlockReason;
  block_message: string;
  redirect_suggestion: string;
  alternative_questions: string[];
  meta: {
    original_query: string;
    detected_intent?: QuestionIntentClass;
    timestamp: string;
  };
}

// =============================================================================
// CQAIS RESPONSE TYPES
// =============================================================================

export type CQAISResponse = 
  | { success: true; data: AlwaysAnswerFormat }
  | { success: false; blocked: BlockedAnswerFormat };

// =============================================================================
// TOP CANONICAL QUESTIONS (STARTER SET)
// =============================================================================

export const CANONICAL_QUESTIONS_STARTER: Partial<CanonicalQuestionNode>[] = [
  // STATUS QUESTIONS
  {
    question_id: 'CQ-STATUS-COUNTRY-BASELINE',
    canonical_text: 'How are baseline conditions in {country}?',
    intent_class: 'status',
    scope_level: 'country',
    default_time_window: '1Y',
    search_variants: [
      'How is {country} doing?',
      'Is {country} doing well?',
      'What is the situation in {country}?',
      'How is life in {country}?'
    ],
    primary_indicator_ids: ['reality-index', 'gdp-per-capita', 'unemployment-rate'],
    secondary_indicator_ids: ['life-expectancy', 'education-index', 'gini-coefficient']
  },
  {
    question_id: 'CQ-STATUS-ECONOMY-GLOBAL',
    canonical_text: 'What is the state of the global economy?',
    intent_class: 'status',
    scope_level: 'world',
    default_time_window: '1Y',
    search_variants: [
      'How is the world economy?',
      'Is the global economy healthy?',
      'What is happening in the world economy?'
    ],
    primary_indicator_ids: ['global-gdp', 'world-trade-volume', 'global-inflation']
  },
  
  // TREND QUESTIONS
  {
    question_id: 'CQ-TREND-CRIME',
    canonical_text: 'How is crime evolving in {scope}?',
    intent_class: 'trend',
    scope_level: 'country',
    default_time_window: '10Y',
    search_variants: [
      'Is crime getting worse?',
      'Is crime increasing?',
      'Are crime rates going up or down?',
      'Is it more dangerous now?'
    ],
    primary_indicator_ids: ['crime-rate', 'violent-crime-rate', 'property-crime-rate']
  },
  {
    question_id: 'CQ-TREND-WAGES',
    canonical_text: 'How are real wages evolving in {scope}?',
    intent_class: 'trend',
    scope_level: 'country',
    default_time_window: '20Y',
    search_variants: [
      'Are wages increasing?',
      'Is purchasing power growing?',
      'Are people earning more?',
      'How are salaries changing?'
    ],
    primary_indicator_ids: ['real-wage-index', 'median-income', 'wage-growth']
  },
  {
    question_id: 'CQ-TREND-JOBS',
    canonical_text: 'How is employment evolving in {scope}?',
    intent_class: 'trend',
    scope_level: 'country',
    default_time_window: '10Y',
    search_variants: [
      'Are jobs disappearing?',
      'Is unemployment rising?',
      'Are there fewer jobs?',
      'Is the job market getting worse?'
    ],
    primary_indicator_ids: ['employment-rate', 'unemployment-rate', 'labor-force-participation']
  },
  
  // CAUSE QUESTIONS
  {
    question_id: 'CQ-CAUSE-HOUSING',
    canonical_text: 'What factors influence housing costs in {scope}?',
    intent_class: 'cause',
    scope_level: 'city',
    default_time_window: '10Y',
    search_variants: [
      'Why are housing prices high?',
      'Why is housing expensive?',
      'What makes rent so high?',
      'Why cant people afford homes?'
    ],
    primary_indicator_ids: ['housing-price-index', 'construction-rate', 'population-growth', 'interest-rates']
  },
  {
    question_id: 'CQ-CAUSE-FERTILITY',
    canonical_text: 'What factors are associated with fertility trends in {scope}?',
    intent_class: 'cause',
    scope_level: 'country',
    default_time_window: '30Y',
    search_variants: [
      'Why is the birth rate declining?',
      'Why are people having fewer children?',
      'What is causing low fertility?'
    ],
    primary_indicator_ids: ['fertility-rate', 'female-labor-participation', 'housing-affordability', 'education-years']
  },
  
  // COMPARISON QUESTIONS
  {
    question_id: 'CQ-COMPARE-COUNTRIES',
    canonical_text: 'How does {country_a} compare to {country_b}?',
    intent_class: 'comparison',
    scope_level: 'country',
    default_time_window: '5Y',
    search_variants: [
      '{country_a} vs {country_b}',
      '{country_a} compared to {country_b}',
      'Difference between {country_a} and {country_b}'
    ],
    primary_indicator_ids: ['reality-index', 'gdp-per-capita', 'hdi', 'life-expectancy']
  },
  
  // CONSEQUENCE QUESTIONS
  {
    question_id: 'CQ-CONSEQUENCE-AGING',
    canonical_text: 'What are the measured effects of population aging in {scope}?',
    intent_class: 'consequence',
    scope_level: 'country',
    default_time_window: '20Y',
    search_variants: [
      'What does aging population mean?',
      'How does aging affect society?',
      'What are the consequences of demographic change?'
    ],
    primary_indicator_ids: ['dependency-ratio', 'pension-expenditure', 'healthcare-spending', 'labor-supply']
  },
  
  // FORECAST QUESTIONS (limited, trajectory-based only)
  {
    question_id: 'CQ-FORECAST-PENSION',
    canonical_text: 'What do current trajectories suggest for pension systems in {scope}?',
    intent_class: 'forecast',
    scope_level: 'country',
    default_time_window: '30Y',
    search_variants: [
      'What will happen to pensions?',
      'Is the pension system sustainable?',
      'Will pensions be enough in the future?'
    ],
    primary_indicator_ids: ['dependency-ratio-projection', 'pension-fund-balance', 'contribution-rate-trend']
  }
];

// =============================================================================
// INTENT DETECTION KEYWORDS
// =============================================================================

export const INTENT_KEYWORDS: Record<QuestionIntentClass, string[]> = {
  status: ['how is', 'what is', 'current', 'right now', 'today', 'state of', 'situation'],
  trend: ['changing', 'evolving', 'getting', 'increasing', 'decreasing', 'over time', 'trend', 'going up', 'going down'],
  cause: ['why', 'what causes', 'reason', 'because', 'due to', 'factor', 'driver'],
  comparison: ['vs', 'versus', 'compared to', 'difference', 'better than', 'worse than', 'relative to'],
  consequence: ['what does', 'mean', 'implication', 'effect', 'impact', 'result', 'outcome'],
  forecast: ['will', 'future', 'projection', 'outlook', 'expect', 'predict', 'years from now']
};

// =============================================================================
// BLOCKED KEYWORDS (triggers block check)
// =============================================================================

export const BLOCKED_KEYWORDS: { pattern: RegExp; reason: QuestionBlockReason }[] = [
  { pattern: /\b(should|ought|must|need to)\b/i, reason: 'political_directive' },
  { pattern: /\b(right|wrong|good|bad|better|best|worst)\s+(policy|approach|decision)\b/i, reason: 'normative' },
  { pattern: /\b(what if|imagine|suppose|hypothetically)\b/i, reason: 'speculative' },
  { pattern: /\b(recommend|advise|suggest)\s+(that|we|they)\b/i, reason: 'political_directive' },
  { pattern: /\b(moral|ethical|fair|just|unjust)\b/i, reason: 'normative' }
];

// =============================================================================
// ANSWER TEMPLATES
// =============================================================================

export const ANSWER_TEMPLATES: Record<QuestionIntentClass, {
  short_pattern: string;
  mechanism_intro: string;
  comparison_intro: string;
  uncertainty_intro: string;
}> = {
  status: {
    short_pattern: 'According to {index_name}, {scope}\'s baseline conditions are {status_description} as of {period}.',
    mechanism_intro: 'The current state is primarily driven by:',
    comparison_intro: 'In comparison:',
    uncertainty_intro: 'Data coverage:'
  },
  trend: {
    short_pattern: 'Over the past {time_window}, {indicator} in {scope} has {trend_direction} by {magnitude}.',
    mechanism_intro: 'Key factors associated with this trend:',
    comparison_intro: 'Compared to similar {scope_type}s:',
    uncertainty_intro: 'Trend reliability:'
  },
  cause: {
    short_pattern: 'The observed pattern in {indicator} is associated with multiple measurable factors.',
    mechanism_intro: 'Statistically associated factors (note: correlation, not causation):',
    comparison_intro: 'This pattern is also observed in:',
    uncertainty_intro: 'Causal inference limitations:'
  },
  comparison: {
    short_pattern: 'Comparing {entity_a} and {entity_b} across {n_indicators} indicators:',
    mechanism_intro: 'Key differences are observed in:',
    comparison_intro: 'In context of {comparison_group}:',
    uncertainty_intro: 'Comparability notes:'
  },
  consequence: {
    short_pattern: 'The measured downstream effects of {phenomenon} include:',
    mechanism_intro: 'Observable consequences:',
    comparison_intro: 'Similar patterns elsewhere have shown:',
    uncertainty_intro: 'What is not yet measured:'
  },
  forecast: {
    short_pattern: 'Based on current trajectories (not predictions), {indicator} in {scope} is on track to {trajectory_description}.',
    mechanism_intro: 'Trajectory drivers:',
    comparison_intro: 'Historical trajectory accuracy:',
    uncertainty_intro: 'Critical trajectory assumptions:'
  }
};

// =============================================================================
// CQAIS API ENDPOINTS
// =============================================================================

export const CQAIS_ENDPOINTS = {
  resolve: '/cqais/resolve',
  search: '/cqais/search',
  suggest: '/cqais/suggest',
  blocked: '/cqais/blocked'
} as const;

// =============================================================================
// DONE CRITERIA
// =============================================================================

export const CQAIS_DONE_CRITERIA = [
  'Every question classified into intent ontology',
  'All answers follow Always-Answer-Format (A2F)',
  'Blocked questions return structured redirects',
  'No normative or speculative content in responses',
  'All answers include uncertainty disclosure',
  'All answers are AI-readable and human-understandable',
  'Deep links provided for every answer component'
] as const;
