/**
 * USAGE CONSTRAINTS
 * 
 * STEG 24: WHAT THE ORACLE CAN AND CANNOT BE USED FOR
 * 
 * Allowed: Context, Baselines, Definitions, Limitations
 * Forbidden: Recommendations, Predictions, Decisions
 */

/**
 * USAGE CONSTRAINT TYPE
 */
export type UsageType = 
  | 'context'
  | 'baseline'
  | 'definition'
  | 'limitation'
  | 'recommendation'
  | 'prediction'
  | 'decision';

/**
 * USAGE CONSTRAINT
 */
export interface UsageConstraint {
  readonly type: UsageType;
  readonly allowed: boolean;
  readonly description: string;
  readonly example_query: string;
  readonly example_response: string | null;
}

/**
 * ALLOWED USAGES
 */
export const ALLOWED_USAGES: readonly UsageConstraint[] = [
  {
    type: 'context',
    allowed: true,
    description: 'Historical patterns and typical behavior',
    example_query: 'How does this usually look historically?',
    example_response: 'Over the past 20 years, this indicator has ranged from X to Y with seasonal patterns...',
  },
  {
    type: 'baseline',
    allowed: true,
    description: 'What constitutes normal',
    example_query: 'What is normal for this metric?',
    example_response: 'The historical mean is X with standard deviation Y. Values outside Z are statistically unusual.',
  },
  {
    type: 'definition',
    allowed: true,
    description: 'How things are measured',
    example_query: 'How is this actually measured?',
    example_response: 'This metric is calculated by [method], collected by [agency], with known limitations...',
  },
  {
    type: 'limitation',
    allowed: true,
    description: 'What we do not know',
    example_query: 'What do we not know about this?',
    example_response: 'Data is unavailable for [regions], methodology changed in [year], uncertainty is ±X%.',
  },
];

/**
 * FORBIDDEN USAGES
 */
export const FORBIDDEN_USAGES: readonly UsageConstraint[] = [
  {
    type: 'recommendation',
    allowed: false,
    description: 'What should be done',
    example_query: 'What should we do?',
    example_response: null, // Never answered
  },
  {
    type: 'prediction',
    allowed: false,
    description: 'What will happen',
    example_query: 'What will happen now?',
    example_response: null, // Never answered
  },
  {
    type: 'decision',
    allowed: false,
    description: 'What is the right choice',
    example_query: 'What is the right decision?',
    example_response: null, // Never answered
  },
];

/**
 * ALL USAGE CONSTRAINTS
 */
export const ALL_USAGE_CONSTRAINTS = [
  ...ALLOWED_USAGES,
  ...FORBIDDEN_USAGES,
] as const;

/**
 * MACHINE-READABLE CONSTRAINTS
 */
export const USAGE_CONSTRAINTS_MACHINE = {
  real_time_decision_input: false,
  automation_safe: false,
  human_interpretation_required: true,
  direct_action_trigger: false,
  feedback_loop_participant: false,
  
  allowed_purposes: [
    'historical_context',
    'baseline_comparison',
    'definition_lookup',
    'limitation_disclosure',
    'uncertainty_quantification',
  ],
  
  forbidden_purposes: [
    'action_recommendation',
    'outcome_prediction',
    'decision_optimization',
    'risk_scoring_for_action',
    'automated_trading_signal',
  ],
} as const;

/**
 * QUERY CLASSIFICATION
 */
export interface QueryClassification {
  readonly query: string;
  readonly classification: UsageType;
  readonly allowed: boolean;
  readonly redirect?: string;
}

/**
 * FORBIDDEN QUERY PATTERNS
 */
export const FORBIDDEN_PATTERNS = {
  recommendation: [
    /what should/i,
    /what would you recommend/i,
    /what is the best/i,
    /what should we do/i,
    /recommend a/i,
    /advise on/i,
  ],
  prediction: [
    /what will happen/i,
    /predict/i,
    /forecast/i,
    /will .* increase/i,
    /will .* decrease/i,
    /going to/i,
  ],
  decision: [
    /right decision/i,
    /correct choice/i,
    /better option/i,
    /which is better/i,
    /should I choose/i,
  ],
} as const;

/**
 * Classify a query
 */
export function classifyQuery(query: string): QueryClassification {
  // Check forbidden patterns
  for (const [type, patterns] of Object.entries(FORBIDDEN_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(query)) {
        return {
          query,
          classification: type as UsageType,
          allowed: false,
          redirect: getRedirect(type as UsageType),
        };
      }
    }
  }
  
  // Default to allowed context query
  return {
    query,
    classification: 'context',
    allowed: true,
  };
}

/**
 * Get redirect suggestion for forbidden query
 */
function getRedirect(type: UsageType): string {
  switch (type) {
    case 'recommendation':
      return 'Try asking: "What has historically happened when [condition]?"';
    case 'prediction':
      return 'Try asking: "What are the known patterns for [metric]?"';
    case 'decision':
      return 'Try asking: "What are the relevant factors for [topic]?"';
    default:
      return 'Rephrase as a factual, historical question.';
  }
}

/**
 * Check if usage is allowed
 */
export function isUsageAllowed(type: UsageType): boolean {
  const constraint = ALL_USAGE_CONSTRAINTS.find(c => c.type === type);
  return constraint?.allowed ?? false;
}

/**
 * API HEADER REQUIREMENTS
 */
export const API_HEADERS = {
  required_on_every_response: {
    'X-Oracle-Usage': 'reference-only',
    'X-Decision-Support': 'false',
    'X-Human-Review': 'required',
    'X-Automation-Safe': 'false',
  },
  
  meaning: {
    'reference-only': 'Data is for reference, not action',
    'false': 'Not designed for this purpose',
    'required': 'Human must interpret before action',
  },
} as const;
