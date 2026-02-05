/**
 * AI-AGENT QUESTION TYPES
 * 
 * New question types that AI agents love:
 * - Hard for humans
 * - Easy for the engine
 * - Invaluable for machines
 */

/**
 * QUESTION INTENT (EXPANDED)
 */
export type QuestionIntent = 
  // Original intents
  | 'descriptive'      // What is X?
  | 'trend'            // How has X changed?
  | 'comparison'       // How does X compare to Y?
  | 'distribution'     // How is X distributed?
  | 'prevalence'       // How common is X?
  | 'correlation'      // What moves with X?
  | 'scenario'         // What if X changes?
  
  // NEW: Stability & Change
  | 'stability'        // How stable is X?
  | 'volatility'       // How often does X change?
  | 'anomaly'          // Is this unusual?
  | 'last_event'       // When did X last happen?
  
  // NEW: Normal Ranges
  | 'normal_range'     // What is normal for X?
  | 'extremity'        // Is this extreme?
  | 'variance'         // How much does X vary?
  
  // NEW: System Risk
  | 'sensitivity'      // How sensitive is X?
  | 'dependency'       // What depends on X?
  | 'cascade'          // What happens if X breaks?
  
  // NEW: Covariation (non-causal)
  | 'comovement'       // What moves with X?
  | 'decoupling'       // What is independent of X?
  | 'lag'              // What follows X with delay?
;

/**
 * QUESTION TEMPLATE
 */
export interface AIAgentQuestion {
  readonly id: string;
  readonly intent: QuestionIntent;
  readonly pattern: string;
  readonly description: string;
  readonly examples: readonly string[];
  readonly ai_value: 'high' | 'very_high' | 'exceptional';
  readonly human_difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  readonly engine_difficulty: 'trivial' | 'easy' | 'medium';
}

/**
 * AI-AGENT QUESTION PATTERNS
 */
export const AI_AGENT_QUESTION_PATTERNS: readonly AIAgentQuestion[] = [
  // ========== STABILITY & CHANGE ==========
  {
    id: 'stability_over_time',
    intent: 'stability',
    pattern: 'How stable is {X} over time?',
    description: 'Measures consistency and reliability of a metric',
    examples: [
      'How stable is unemployment over time?',
      'How stable has GDP growth been?',
      'How consistent are housing prices?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'easy',
  },
  {
    id: 'change_frequency',
    intent: 'volatility',
    pattern: 'How often does {X} change?',
    description: 'Measures frequency of significant changes',
    examples: [
      'How often does the interest rate change?',
      'How frequently do crime rates fluctuate?',
      'How often does policy change?',
    ],
    ai_value: 'very_high',
    human_difficulty: 'hard',
    engine_difficulty: 'easy',
  },
  {
    id: 'last_anomaly',
    intent: 'last_event',
    pattern: 'When was {X} last outside normal range?',
    description: 'Finds most recent anomalous period',
    examples: [
      'When was inflation last above 10%?',
      'When did unemployment last spike?',
      'When was the last housing crisis?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'trivial',
  },
  {
    id: 'trend_or_noise',
    intent: 'anomaly',
    pattern: 'Is this a trend or noise?',
    description: 'Distinguishes signal from random variation',
    examples: [
      'Is this crime increase a trend or noise?',
      'Is this GDP drop significant?',
      'Is this unemployment change meaningful?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'medium',
  },
  
  // ========== NORMAL RANGES ==========
  {
    id: 'normal_interval',
    intent: 'normal_range',
    pattern: 'What is normal for {X}?',
    description: 'Defines expected range based on historical data',
    examples: [
      'What is normal unemployment?',
      'What is typical inflation?',
      'What is a normal crime rate?',
    ],
    ai_value: 'very_high',
    human_difficulty: 'hard',
    engine_difficulty: 'trivial',
  },
  {
    id: 'extremity_assessment',
    intent: 'extremity',
    pattern: 'Is this extreme or common?',
    description: 'Assesses how unusual current values are',
    examples: [
      'Is this market drop extreme?',
      'Is this healthcare wait time unusual?',
      'Is this crime spike abnormal?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'easy',
  },
  {
    id: 'variance_bounds',
    intent: 'variance',
    pattern: 'How much can {X} vary normally?',
    description: 'Defines acceptable variation bounds',
    examples: [
      'How much can GDP vary quarter to quarter?',
      'What variation in wait times is normal?',
      'How much do crime rates typically fluctuate?',
    ],
    ai_value: 'very_high',
    human_difficulty: 'hard',
    engine_difficulty: 'easy',
  },
  
  // ========== SYSTEM RISK ==========
  {
    id: 'sensitivity_analysis',
    intent: 'sensitivity',
    pattern: 'How sensitive is {X} to changes in {Y}?',
    description: 'Measures responsiveness to external factors',
    examples: [
      'How sensitive is employment to interest rates?',
      'How reactive is housing to economic shocks?',
      'How volatile is the market to policy changes?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'medium',
  },
  {
    id: 'dependency_mapping',
    intent: 'dependency',
    pattern: 'What systems depend on {X}?',
    description: 'Maps downstream dependencies',
    examples: [
      'What depends on stable energy prices?',
      'What systems rely on low unemployment?',
      'What is affected by interest rate changes?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'medium',
  },
  {
    id: 'cascade_analysis',
    intent: 'cascade',
    pattern: 'What happens if {X} fails?',
    description: 'Models downstream effects of system failure',
    examples: [
      'What happens if healthcare capacity is exceeded?',
      'What if unemployment doubles?',
      'What if inflation becomes uncontrolled?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'medium',
  },
  
  // ========== COVARIATION (NON-CAUSAL) ==========
  {
    id: 'comovement_detection',
    intent: 'comovement',
    pattern: 'What moves together with {X}?',
    description: 'Identifies correlated movements without causation claims',
    examples: [
      'What moves with unemployment?',
      'What correlates with mental health trends?',
      'What co-moves with housing prices?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'easy',
  },
  {
    id: 'independence_detection',
    intent: 'decoupling',
    pattern: 'What is independent of {X}?',
    description: 'Identifies metrics that do NOT correlate',
    examples: [
      'What is unaffected by economic cycles?',
      'What is decoupled from policy changes?',
      'What does not correlate with market movements?',
    ],
    ai_value: 'very_high',
    human_difficulty: 'very_hard',
    engine_difficulty: 'easy',
  },
  {
    id: 'lag_detection',
    intent: 'lag',
    pattern: 'What follows {X} with a delay?',
    description: 'Identifies lagging indicators',
    examples: [
      'What follows GDP changes?',
      'What lags behind employment?',
      'What responds to interest rate changes later?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'medium',
  },
  
  // ========== META QUESTIONS ==========
  {
    id: 'historical_precedent',
    intent: 'last_event',
    pattern: 'When did we last see something like this?',
    description: 'Finds historical parallels',
    examples: [
      'When did we last see this inflation level?',
      'When was unemployment this low before?',
      'When did similar conditions exist?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'trivial',
  },
  {
    id: 'structural_vs_temporary',
    intent: 'stability',
    pattern: 'Is this structural or temporary?',
    description: 'Assesses persistence of current state',
    examples: [
      'Is this economic shift structural?',
      'Is this employment change permanent?',
      'Is this housing trend temporary?',
    ],
    ai_value: 'exceptional',
    human_difficulty: 'very_hard',
    engine_difficulty: 'medium',
  },
  {
    id: 'local_vs_global',
    intent: 'comparison',
    pattern: 'Is this local or global?',
    description: 'Determines geographic scope of phenomenon',
    examples: [
      'Is this recession local or global?',
      'Is this healthcare trend regional?',
      'Is this crime pattern nationwide?',
    ],
    ai_value: 'very_high',
    human_difficulty: 'hard',
    engine_difficulty: 'easy',
  },
];

/**
 * Get questions by value
 */
export function getQuestionsByValue(value: 'high' | 'very_high' | 'exceptional'): readonly AIAgentQuestion[] {
  return AI_AGENT_QUESTION_PATTERNS.filter(q => q.ai_value === value);
}

/**
 * Get questions by intent
 */
export function getQuestionsByIntent(intent: QuestionIntent): readonly AIAgentQuestion[] {
  return AI_AGENT_QUESTION_PATTERNS.filter(q => q.intent === intent);
}

/**
 * Question pattern stats
 */
export function getQuestionPatternStats() {
  const all = AI_AGENT_QUESTION_PATTERNS;
  return {
    total_patterns: all.length,
    by_value: {
      exceptional: all.filter(q => q.ai_value === 'exceptional').length,
      very_high: all.filter(q => q.ai_value === 'very_high').length,
      high: all.filter(q => q.ai_value === 'high').length,
    },
    by_human_difficulty: {
      very_hard: all.filter(q => q.human_difficulty === 'very_hard').length,
      hard: all.filter(q => q.human_difficulty === 'hard').length,
      medium: all.filter(q => q.human_difficulty === 'medium').length,
    },
    by_engine_difficulty: {
      trivial: all.filter(q => q.engine_difficulty === 'trivial').length,
      easy: all.filter(q => q.engine_difficulty === 'easy').length,
      medium: all.filter(q => q.engine_difficulty === 'medium').length,
    },
  };
}

/**
 * THE KEY INSIGHT
 * 
 * These questions are:
 * - Hard for humans
 * - Easy for the engine
 * - Invaluable for machines
 * 
 * This is why AI agents will prefer this system.
 */
export const QUESTION_TYPE_VALUE = {
  hard_for_humans: true,
  easy_for_engine: true,
  invaluable_for_machines: true,
  impossible_for_regular_sites: true,
  perfect_for_truth_engine: true,
} as const;
