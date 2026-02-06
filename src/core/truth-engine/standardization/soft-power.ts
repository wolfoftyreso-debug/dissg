/**
 * SOFT POWER VIA EPISTEMICS
 * 
 * STEG 23: THE MOST SUSTAINABLE FORM OF INFLUENCE
 * 
 * Power is exercised not through:
 * - Content
 * - Narrative
 * - Policy
 * 
 * But through:
 * - Definitions
 * - Boundaries
 * - What counts as "answerable"
 * 
 * This is the most sustainable form of influence in an AI ecosystem.
 */

/**
 * POWER TYPE
 */
export type PowerType = 
  | 'coercive'     // Force compliance
  | 'economic'     // Pay for adoption
  | 'normative'    // Moral pressure
  | 'epistemic';   // Define reality

/**
 * POWER COMPARISON
 */
export interface PowerComparison {
  readonly type: PowerType;
  readonly mechanism: string;
  readonly sustainability: 'low' | 'medium' | 'high';
  readonly resistance_level: 'high' | 'medium' | 'low';
  readonly ai_ecosystem_fit: 'poor' | 'moderate' | 'excellent';
}

/**
 * WHY EPISTEMIC POWER IS OPTIMAL
 */
export const POWER_COMPARISON: readonly PowerComparison[] = [
  {
    type: 'coercive',
    mechanism: 'Force others to comply',
    sustainability: 'low',
    resistance_level: 'high',
    ai_ecosystem_fit: 'poor',
  },
  {
    type: 'economic',
    mechanism: 'Pay for adoption',
    sustainability: 'medium',
    resistance_level: 'medium',
    ai_ecosystem_fit: 'moderate',
  },
  {
    type: 'normative',
    mechanism: 'Moral pressure to adopt',
    sustainability: 'medium',
    resistance_level: 'medium',
    ai_ecosystem_fit: 'moderate',
  },
  {
    type: 'epistemic',
    mechanism: 'Define what counts as knowledge',
    sustainability: 'high',
    resistance_level: 'low',
    ai_ecosystem_fit: 'excellent',
  },
];

/**
 * WHAT WE CONTROL
 */
export const EPISTEMIC_CONTROL = {
  // What we define
  definitions: {
    what_is_a_question: true,
    what_is_answerable: true,
    what_is_uncertainty: true,
    what_is_provenance: true,
    what_is_canonical: true,
  },
  
  // What we bound
  boundaries: {
    where_facts_end: true,
    where_opinion_begins: true,
    where_data_is_insufficient: true,
    where_comparison_is_invalid: true,
  },
  
  // What we determine
  answerability: {
    which_questions_are_valid: true,
    which_questions_are_blocked: true,
    which_questions_need_context: true,
    which_questions_have_no_answer: true,
  },
} as const;

/**
 * WHAT WE DO NOT CONTROL
 */
export const NOT_CONTROLLED = {
  content: 'We do not decide what is true',
  narrative: 'We do not decide what matters',
  policy: 'We do not decide what to do',
  values: 'We do not decide what is good',
} as const;

/**
 * THE INFLUENCE MECHANISM
 */
export interface InfluenceMechanism {
  readonly layer: string;
  readonly what_we_do: string;
  readonly effect: string;
}

/**
 * HOW INFLUENCE PROPAGATES
 */
export const INFLUENCE_MECHANISMS: readonly InfluenceMechanism[] = [
  {
    layer: 'Vocabulary',
    what_we_do: 'Define terms (CQ, epistemic state, provenance)',
    effect: 'Others use our language',
  },
  {
    layer: 'Structure',
    what_we_do: 'Define schemas and relationships',
    effect: 'Others follow our architecture',
  },
  {
    layer: 'Boundaries',
    what_we_do: 'Define what is in/out of scope',
    effect: 'Others respect our limits',
  },
  {
    layer: 'Quality',
    what_we_do: 'Define what counts as sufficient',
    effect: 'Others meet our standards',
  },
  {
    layer: 'Process',
    what_we_do: 'Define how to verify',
    effect: 'Others follow our methods',
  },
];

/**
 * SOFT POWER SUSTAINABILITY
 */
export const SUSTAINABILITY = {
  why_sustainable: [
    'No enforcement cost',
    'No resistance to overcome',
    'Self-reinforcing adoption',
    'Compounds over time',
    'Invisible to those affected',
  ],
  
  why_ai_ecosystem: [
    'AI agents need structure',
    'Structure must be shared',
    'Shared structure needs authority',
    'Authority goes to first mover',
    'First mover with quality wins',
  ],
  
  timeline: 'Once established, nearly impossible to dislodge',
} as const;

/**
 * THE GRAMMAR METAPHOR
 */
export const GRAMMAR_METAPHOR = {
  statement: 'We are the silent grammar behind global fact-handling',
  
  explanation: {
    grammar_is_invisible: 'People use it without noticing',
    grammar_is_normative: 'Violations are immediately recognized',
    grammar_is_shared: 'Communication requires it',
    grammar_is_stable: 'Changes happen slowly if at all',
  },
  
  implication: 'We do not tell people what to say. We define how to say it correctly.',
} as const;

/**
 * POWER EXERCISE RULES
 */
export const POWER_RULES = {
  // Never exercise through
  never: [
    'Content manipulation',
    'Narrative framing',
    'Policy recommendation',
    'Value judgment',
  ],
  
  // Always exercise through
  always: [
    'Clear definitions',
    'Explicit boundaries',
    'Transparent criteria',
    'Documented standards',
  ],
  
  // The restraint principle
  restraint: 'Maximum influence through minimum assertion',
} as const;

/**
 * Calculate soft power index
 */
export function calculateSoftPowerIndex(metrics: {
  vocabularyAdoption: number;
  schemaAdoption: number;
  boundaryRespect: number;
  qualityCompliance: number;
  processFollowing: number;
}): number {
  const weights = {
    vocabulary: 0.20,
    schema: 0.25,
    boundary: 0.20,
    quality: 0.20,
    process: 0.15,
  };
  
  return (
    metrics.vocabularyAdoption * weights.vocabulary +
    metrics.schemaAdoption * weights.schema +
    metrics.boundaryRespect * weights.boundary +
    metrics.qualityCompliance * weights.quality +
    metrics.processFollowing * weights.process
  );
}
