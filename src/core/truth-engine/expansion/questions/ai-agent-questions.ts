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

// ============================================================
// AI AGENT SEGMENTATION LAYER
// ============================================================

/**
 * Primary AI Agent Classes
 */
export type AIAgentClass = 
  | 'policy'      // Government, policy-AI, investigations
  | 'journalism'  // Journalists, research, fact-checking
  | 'finance'     // Investors, banks, macro analysis
  | 'corporate'   // Companies, consultants, M&A
  | 'health'      // Healthcare AI, NGOs, social systems
  | 'legal'       // Legal AI, compliance systems
  | 'general';    // Public AI assistants, search engines

/**
 * Intent Layer Classification
 */
export type IntentLayer = 
  | 'descriptive'   // What is X?
  | 'comparative'   // How does X compare to Y?
  | 'trend'         // How has X changed?
  | 'structural'    // How is X organized/built?
  | 'allocation';   // How is X distributed?

/**
 * Misinterpretation Risk Level
 */
export type MisinterpretationRisk = 'low' | 'medium' | 'high';

/**
 * Agent Class Metadata
 */
export interface AgentClassInfo {
  code: AIAgentClass;
  name_en: string;
  name_sv: string;
  description: string;
  icon: string;
  color: string;
  primary_domains: string[];
  optimization_focus: string[];
  target_users: string[];
  expected_question_count: number;
}

/**
 * All 7 Agent Classes with Full Metadata
 */
export const AI_AGENT_CLASSES: AgentClassInfo[] = [
  {
    code: 'policy',
    name_en: 'Policy & Government',
    name_sv: 'Policy & Regering',
    description: 'Structural, long-term, systemic questions for government and policy AI',
    icon: 'Landmark',
    color: 'blue',
    primary_domains: ['DEMO', 'GOV', 'TAX', 'WELFARE', 'EDU', 'MIGRATION', 'CLIMATE'],
    optimization_focus: ['Time series', 'Regional comparability', 'Definitions', 'Regulations'],
    target_users: ['Myndigheter', 'Policy-AI', 'Beslutsstöd', 'Utredningar'],
    expected_question_count: 700,
  },
  {
    code: 'journalism',
    name_en: 'Journalism & Research',
    name_sv: 'Journalistik & Forskning',
    description: 'Comparative questions, deviations, patterns for investigative purposes',
    icon: 'Newspaper',
    color: 'amber',
    primary_domains: ['CRIME', 'INEQUALITY', 'GOV', 'HEALTH'],
    optimization_focus: ['Rankings', 'Before/after', 'Normalized statistics', 'Method transparency'],
    target_users: ['Journalister', 'Dokumentärer', 'Granskning', 'Forskare'],
    expected_question_count: 600,
  },
  {
    code: 'finance',
    name_en: 'Finance & Macro',
    name_sv: 'Finans & Makro',
    description: 'Quantitative, forecast-adjacent (not speculative) for financial analysis',
    icon: 'TrendingUp',
    color: 'emerald',
    primary_domains: ['ECON', 'LABOR', 'HOUSING', 'TRADE', 'CONSUME', 'PENSION', 'CRYPTO'],
    optimization_focus: ['Indices', 'Growth rates', 'Relative weights', 'International comparability'],
    target_users: ['Investerare', 'Banker', 'Hedgefonder', 'Analys-AI'],
    expected_question_count: 500,
  },
  {
    code: 'corporate',
    name_en: 'Corporate & Strategy',
    name_sv: 'Företag & Strategi',
    description: 'Market size, structure, regulatory environment for business decisions',
    icon: 'Building2',
    color: 'purple',
    primary_domains: ['BUSINESS', 'ENERGY', 'TECH', 'TRANSPORT', 'RND'],
    optimization_focus: ['Jurisdiction comparisons', 'Cost indices', 'Risk indicators'],
    target_users: ['Företag', 'Konsulter', 'M&A-AI', 'Strategirådgivare'],
    expected_question_count: 400,
  },
  {
    code: 'health',
    name_en: 'Health & Social Systems',
    name_sv: 'Hälsa & Sociala System',
    description: 'System capacity, outcomes, load for healthcare and social services',
    icon: 'Heart',
    color: 'red',
    primary_domains: ['HEALTH', 'WELFARE', 'FOOD', 'ADDICTION'],
    optimization_focus: ['Per capita', 'Age adjustment', 'Regional access', 'Outcomes per cost'],
    target_users: ['Vård-AI', 'Stiftelser', 'NGO:er', 'Folkhälsomyndigheter'],
    expected_question_count: 350,
  },
  {
    code: 'legal',
    name_en: 'Legal & Compliance',
    name_sv: 'Juridik & Compliance',
    description: 'Structural facts, not interpretation, for legal and compliance systems',
    icon: 'Scale',
    color: 'slate',
    primary_domains: ['TAX', 'CRIME', 'GOV', 'PROCUREMENT'],
    optimization_focus: ['Jurisdictions', 'Validity periods', 'Official definitions'],
    target_users: ['Jurist-AI', 'Compliance-system', 'Regulatorer'],
    expected_question_count: 250,
  },
  {
    code: 'general',
    name_en: 'General / Public AI',
    name_sv: 'Allmän / Publik AI',
    description: 'How does it look? questions for broad AI assistants and search engines',
    icon: 'Globe',
    color: 'zinc',
    primary_domains: ['DEMO', 'EDU', 'CONSUME', 'INTERNET'],
    optimization_focus: ['Simple structure', 'Clear comparisons', 'Visual readability'],
    target_users: ['AI-assistenter', 'Sökmotorer', 'Chatbots', 'Allmänheten'],
    expected_question_count: 200,
  },
];

/**
 * Intent Layer Metadata
 */
export const INTENT_LAYERS: { code: IntentLayer; name_en: string; name_sv: string; description: string }[] = [
  { code: 'descriptive', name_en: 'Descriptive', name_sv: 'Beskrivande', description: 'What is X?' },
  { code: 'comparative', name_en: 'Comparative', name_sv: 'Jämförande', description: 'How does X compare to Y?' },
  { code: 'trend', name_en: 'Trend', name_sv: 'Trend', description: 'How has X changed over time?' },
  { code: 'structural', name_en: 'Structural', name_sv: 'Strukturell', description: 'How is X organized/built?' },
  { code: 'allocation', name_en: 'Allocation', name_sv: 'Fördelning', description: 'How is X distributed?' },
];

/**
 * Risk Level Descriptions
 */
export const RISK_LEVELS: { code: MisinterpretationRisk; name_en: string; name_sv: string; color: string }[] = [
  { code: 'low', name_en: 'Low Risk', name_sv: 'Låg risk', color: 'emerald' },
  { code: 'medium', name_en: 'Medium Risk', name_sv: 'Medel risk', color: 'amber' },
  { code: 'high', name_en: 'High Risk', name_sv: 'Hög risk', color: 'red' },
];

/**
 * Domain to Primary Agent Mapping
 */
export const DOMAIN_AGENT_MAP: Record<string, { primary: AIAgentClass; secondary: AIAgentClass[] }> = {
  'DEMO': { primary: 'policy', secondary: ['general', 'journalism'] },
  'ECON': { primary: 'finance', secondary: ['policy', 'corporate'] },
  'TAX': { primary: 'legal', secondary: ['corporate', 'finance'] },
  'HEALTH': { primary: 'health', secondary: ['policy', 'journalism'] },
  'EDU': { primary: 'policy', secondary: ['general', 'journalism'] },
  'LABOR': { primary: 'finance', secondary: ['corporate', 'policy'] },
  'CRIME': { primary: 'journalism', secondary: ['policy', 'legal'] },
  'ENERGY': { primary: 'corporate', secondary: ['policy', 'finance'] },
  'HOUSING': { primary: 'finance', secondary: ['corporate', 'general'] },
  'TRANSPORT': { primary: 'corporate', secondary: ['policy', 'general'] },
  'MIGRATION': { primary: 'policy', secondary: ['journalism', 'health'] },
  'BUSINESS': { primary: 'corporate', secondary: ['finance', 'legal'] },
  'TRADE': { primary: 'finance', secondary: ['corporate', 'policy'] },
  'TECH': { primary: 'corporate', secondary: ['general', 'finance'] },
  'INTERNET': { primary: 'corporate', secondary: ['general', 'finance'] },
  'MEDIA': { primary: 'journalism', secondary: ['general', 'policy'] },
  'GOV': { primary: 'policy', secondary: ['legal', 'journalism'] },
  'WELFARE': { primary: 'health', secondary: ['policy', 'journalism'] },
  'PENSION': { primary: 'finance', secondary: ['policy', 'health'] },
  'INTL': { primary: 'policy', secondary: ['journalism', 'finance'] },
  'CONSUME': { primary: 'finance', secondary: ['general', 'corporate'] },
  'FOOD': { primary: 'health', secondary: ['policy', 'journalism'] },
  'URBAN': { primary: 'policy', secondary: ['corporate', 'general'] },
  'RELIGION': { primary: 'general', secondary: ['journalism', 'policy'] },
  'ADDICTION': { primary: 'health', secondary: ['policy', 'journalism'] },
  'CLIMATE': { primary: 'policy', secondary: ['journalism', 'general'] },
  'RND': { primary: 'corporate', secondary: ['policy', 'finance'] },
  'CRYPTO': { primary: 'finance', secondary: ['legal', 'corporate'] },
  'PROCUREMENT': { primary: 'legal', secondary: ['policy', 'corporate'] },
  'INEQUALITY': { primary: 'journalism', secondary: ['policy', 'health'] },
};

/**
 * Get agent info by code
 */
export function getAgentInfo(code: AIAgentClass): AgentClassInfo | undefined {
  return AI_AGENT_CLASSES.find(a => a.code === code);
}

/**
 * Get recommended agents for a domain
 */
export function getAgentsForDomain(domainCode: string): { primary: AIAgentClass; secondary: AIAgentClass[] } {
  return DOMAIN_AGENT_MAP[domainCode] || { primary: 'general', secondary: [] };
}
