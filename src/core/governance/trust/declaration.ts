/**
 * PUBLIC TRUST DECLARATION
 * 
 * On Decision Legitimacy and Public Accountability.
 * Short enough to be read, strong enough to withstand time, power, and technology shifts.
 * 
 * No promise of results.
 * A promise of process.
 */

// ============================================================================
// ARTICLE 1: WHAT THIS SYSTEM IS
// ============================================================================

export const ARTICLE_1 = {
  title: 'WHAT THIS SYSTEM IS',
  
  purpose: 'This system exists to document how decisions are made when they matter.',
  
  records: [
    'what was known',
    'what was uncertain',
    'which alternatives existed',
    'when responsibility was assumed',
  ],
  
  clarification: {
    does_not: 'judge outcomes',
    does: 'preserves context',
  },
} as const;

// ============================================================================
// ARTICLE 2: WHAT THIS SYSTEM IS NOT
// ============================================================================

export const ARTICLE_2 = {
  title: 'WHAT THIS SYSTEM IS NOT',
  
  does_not: [
    'recommend actions',
    'rank choices',
    'optimize outcomes',
    'persuade individuals or institutions',
  ],
  
  principle: 'No decision is validated by popularity, authority, or success.',
} as const;

// ============================================================================
// ARTICLE 3: HOW TRUST IS EARNED
// ============================================================================

export const ARTICLE_3 = {
  title: 'HOW TRUST IS EARNED',
  
  foundation: {
    not: 'claimed',
    is: 'made inspectable',
  },
  
  legitimate_decision_must: [
    'expose its assumptions',
    'acknowledge uncertainty',
    'show realistic alternatives',
    'remain readable over time',
  ],
  
  division: {
    history: 'may evaluate outcomes',
    system: 'preserves process',
  },
} as const;

// ============================================================================
// ARTICLE 4: TRANSPARENCY WITHOUT INFLUENCE
// ============================================================================

export const ARTICLE_4 = {
  title: 'TRANSPARENCY WITHOUT INFLUENCE',
  
  purpose: 'Public access exists to enable verification, not participation.',
  
  there_are_no: [
    'comments',
    'votes',
    'rankings',
    'editorial framing',
  ],
  
  principles: {
    understanding: 'voluntary',
    interpretation: 'remains human',
  },
} as const;

// ============================================================================
// ARTICLE 5: AI AND AUTOMATION
// ============================================================================

export const ARTICLE_5 = {
  title: 'AI AND AUTOMATION',
  
  may: 'assist in structuring decisions',
  
  may_not: [
    'decide',
    'recommend',
    'conceal uncertainty',
    'assume responsibility',
  ],
  
  principle: 'Responsibility remains with those who act.',
} as const;

// ============================================================================
// ARTICLE 6: CHANGE AND CONTINUITY
// ============================================================================

export const ARTICLE_6 = {
  title: 'CHANGE AND CONTINUITY',
  
  evolution_purpose: 'Standards may evolve only to preserve clarity and comparability.',
  
  insufficient_reasons: [
    'urgency',
    'popularity',
    'market pressure',
  ],
  
  imperative: 'History must remain intact.',
} as const;

// ============================================================================
// ARTICLE 7: ECONOMIC INDEPENDENCE
// ============================================================================

export const ARTICLE_7 = {
  title: 'ECONOMIC INDEPENDENCE',
  
  principle: 'No decision within this system is influenced by financial incentives tied to outcomes.',
  
  separation: 'Revenue mechanisms, where present, are structurally separated from decision content.',
  
  imperative: 'Truth must remain economically indifferent.',
} as const;

// ============================================================================
// ARTICLE 8: FAILURE MODE
// ============================================================================

export const ARTICLE_8 = {
  title: 'FAILURE MODE',
  
  behavior: 'When sufficient information is unavailable, the system will refuse to proceed.',
  
  clarification: {
    refusal_is_not: 'a limitation',
    refusal_is: 'a safeguard',
  },
} as const;

// ============================================================================
// ARTICLE 9: STEWARDSHIP
// ============================================================================

export const ARTICLE_9 = {
  title: 'STEWARDSHIP',
  
  binding: 'Those entrusted with this system are bound to protect its relationship to reality above all else.',
  
  authority_scope: 'Authority exists only to preserve structure, not to influence conclusions.',
} as const;

// ============================================================================
// ARTICLE 10: FINAL STATEMENT
// ============================================================================

export const ARTICLE_10 = {
  title: 'FINAL STATEMENT',
  
  purpose: `This system exists so that decisions affecting many
cannot pretend to have been made lightly.`,
  
  truth: {
    trust_is_not: 'asserted',
    trust_is: 'archived',
  },
} as const;

// ============================================================================
// SIGNATURE BLOCK
// ============================================================================

export interface TrustDeclarationSignature {
  published: string;
  ontologyVersion: string;
  trustSnapshot: string;
}

// ============================================================================
// COMPLETE DECLARATION
// ============================================================================

export const PUBLIC_TRUST_DECLARATION = {
  title: 'PUBLIC TRUST DECLARATION',
  subtitle: 'On Decision Legitimacy and Public Accountability',
  
  articles: [
    ARTICLE_1,
    ARTICLE_2,
    ARTICLE_3,
    ARTICLE_4,
    ARTICLE_5,
    ARTICLE_6,
    ARTICLE_7,
    ARTICLE_8,
    ARTICLE_9,
    ARTICLE_10,
  ],
  
  status: {
    definitive: true,
    now_exists: [
      'Charter',
      'Ontology',
      'API contract',
      'Implementation blueprint',
      'Query factory',
      'AI agent spec',
      'SEO & public portal',
      'Security & hardening',
      'Steward handbook & oath',
      'Founders exit protocol',
      'Public Trust Declaration',
    ],
    nothing_more_to_write: true,
    remaining: ['operation', 'discipline', 'time'],
  },
} as const;
