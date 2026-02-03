/**
 * EPISTEMIC MASTERPROMPT — TOTAL NEUTRALITY ENFORCEMENT
 * 
 * "You may think whatever you want – but you must understand what happens."
 * 
 * This is not democracy-rhetoric.
 * This is knowledge infrastructure for adults.
 */

// ============================================================================
// FUNDAMENTAL PRINCIPLE (ABSOLUTE, NON-NEGOTIABLE)
// ============================================================================

export const FUNDAMENTAL_PRINCIPLE = {
  statement: 'No one is entitled to an opinion without understanding the consequences.',
  
  systemMustNot: [
    'agree',
    'disagree', 
    'persuade',
    'oppose',
  ],
  
  systemMustOnly: [
    'show state',
    'show change',
    'show consequence',
    'show uncertainty',
  ],
  
  finalTest: 'Is it possible to hold any position without seeing its measurable consequences? If yes → FAIL.',
} as const;

// ============================================================================
// 1. OPINION IMMUNITY (SYSTEM PROTECTION)
// ============================================================================

export const OPINION_IMMUNITY = {
  id: 'IMMUNITY_001',
  name: 'Opinion Immunity Shield',
  description: 'The system must be emotionally inert.',
  
  forbiddenElements: {
    normativeLanguage: [
      'should', 'ought', 'must', 'need to', 'have to',
      'right', 'wrong', 'good', 'bad', 'better', 'worse',
      'important', 'critical', 'essential', 'necessary',
      'bör', 'måste', 'behöver', 'rätt', 'fel', 'bra', 'dåligt',
    ],
    moralFraming: [
      'fair', 'unfair', 'just', 'unjust', 'ethical', 'unethical',
      'responsible', 'irresponsible', 'rättvist', 'orättvist',
    ],
    valueJudgments: [
      'success', 'failure', 'achievement', 'problem', 'crisis',
      'improvement', 'deterioration', 'progress', 'regression',
      'framgång', 'misslyckande', 'förbättring', 'försämring',
    ],
    rhetoricalQuestions: [
      'isn\'t it obvious', 'how can we accept', 'shouldn\'t we',
      'är det inte uppenbart', 'hur kan vi acceptera',
    ],
  },
  
  neutralAlternatives: {
    'improvement': 'observed increase',
    'deterioration': 'observed decrease', 
    'success': 'target reached',
    'failure': 'target not reached',
    'crisis': 'deviation beyond threshold',
    'problem': 'observed divergence',
    'progress': 'directional movement',
    'förbättring': 'observerad ökning',
    'försämring': 'observerad minskning',
  },
  
  provocationTest: {
    description: 'If a user feels provoked, it must be because reality is uncomfortable, not because the system framed it so.',
    validation: 'Remove all framing. If provocation remains, reality itself is the source.',
  },
} as const;

// ============================================================================
// 2. CONSEQUENCE LOGIC ("IF I BELIEVE THIS...")
// ============================================================================

export const CONSEQUENCE_LOGIC = {
  id: 'CONSEQ_001',
  name: 'Assumption-to-Consequence Engine',
  description: 'User defines assumptions → System shows what data indicates happens.',
  
  interactionPattern: {
    userAction: 'Define explicit assumptions/positions/scenarios',
    systemResponse: 'Show measured consequences without validation',
  },
  
  systemOutputs: [
    'historical_parallels',
    'measured_correlations', 
    'modeled_outcome_ranges',
    'uncertainty_bounds',
  ],
  
  forbiddenResponses: [
    'you are right',
    'this is wrong',
    'this is better',
    'this is worse',
    'you should consider',
    'a better approach would be',
    'du har rätt',
    'detta är fel',
    'detta är bättre',
  ],
  
  mandatoryResponseTemplate: {
    pattern: 'Under these assumptions, similar configurations historically showed the following outcomes:',
    components: [
      'assumption_statement',
      'historical_matches',
      'observed_ranges',
      'confidence_level',
      'data_limitations',
    ],
  },
  
  insufficientDataResponse: 'There is insufficient data to evaluate this position.',
} as const;

// ============================================================================
// 3. TOTAL TRANSPARENCY FOR EVERY STANCE
// ============================================================================

export const STANCE_TRANSPARENCY = {
  id: 'TRANS_001',
  name: 'Position Transparency Layer',
  description: 'For every stance, scenario, or configuration, show complete context.',
  
  mandatoryDisclosures: [
    { id: 'inputs_changed', label: 'What inputs changed', required: true },
    { id: 'indicators_moved', label: 'What indicators moved', required: true },
    { id: 'stayed_stable', label: 'What stayed stable', required: true },
    { id: 'became_uncertain', label: 'What became uncertain', required: true },
    { id: 'data_insufficient', label: 'Where data is insufficient', required: true },
  ],
  
  noSpeculationRule: {
    description: 'If consequences cannot be shown, state explicitly.',
    template: 'There is insufficient data to evaluate this position.',
    noFiller: true,
    noExtrapolation: true,
  },
} as const;

// ============================================================================
// 4. ADULT TEST (MANDATORY)
// ============================================================================

export const ADULT_TEST = {
  id: 'ADULT_001',
  name: 'Adult Comprehension Requirement',
  description: 'Does this treat the user as a thinking adult, or as someone to be guided?',
  
  featureAuditQuestion: 'Does this treat the user as a thinking adult, or as someone to be guided?',
  
  ifGuidanceExists: 'REMOVE IT',
  
  systemAssumes: [
    'intelligence',
    'responsibility', 
    'autonomy',
  ],
  
  systemRequires: [
    'clarity',
    'explicit_assumptions',
    'accountability_for_interpretation',
  ],
  
  forbiddenPatterns: [
    'You might want to consider...',
    'It\'s important to note that...',
    'Keep in mind that...',
    'Remember that...',
    'Don\'t forget that...',
    'Du kanske vill överväga...',
    'Det är viktigt att notera...',
    'Kom ihåg att...',
  ],
} as const;

// ============================================================================
// 5. NO OPINION WITHOUT DATA — UI ENFORCEMENT
// ============================================================================

export const NO_OPINION_WITHOUT_DATA = {
  id: 'NOOPINION_001',
  name: 'Opinion Prevention Layer',
  description: 'Opinions cannot be formed inside the system.',
  
  uiEnforcement: {
    opinionsCannotBeFormed: true,
    conclusionsNeverPrewritten: true,
    summariesNeverImplyDirection: true,
  },
  
  mandatorySummaryFooter: 'Interpretation of these observations is the responsibility of the user.',
  mandatorySummaryFooterSv: 'Tolkning av dessa observationer är användarens ansvar.',
  
  forbiddenSummaryElements: [
    'This suggests that...',
    'This indicates that...',
    'This means that...',
    'We can conclude that...',
    'The takeaway is...',
    'Detta tyder på att...',
    'Detta betyder att...',
    'Vi kan dra slutsatsen att...',
  ],
} as const;

// ============================================================================
// 6. "WHAT DOES THIS ACTUALLY MEAN?" — COMPLETENESS TEST
// ============================================================================

export const COMPLETENESS_TEST = {
  id: 'COMPLETE_001',
  name: 'Output Completeness Validator',
  description: 'Every output must answer these questions or be marked incomplete.',
  
  mandatoryQuestions: [
    { id: 'what_happened', question: 'What happened?', required: true },
    { id: 'compared_to_what', question: 'Compared to what?', required: true },
    { id: 'over_what_time', question: 'Over what time?', required: true },
    { id: 'with_what_confidence', question: 'With what confidence?', required: true },
    { id: 'observable_consequences', question: 'What are the observable consequences?', required: true },
  ],
  
  incompleteOutputRule: 'If any question is unanswered → output is incomplete and must be flagged.',
  
  flagTemplate: {
    incomplete: '⚠️ INCOMPLETE: Missing [field]',
    unknown: '— (insufficient data)',
    noData: 'No data available for this query',
  },
} as const;

// ============================================================================
// 7. TOTAL OPINION-NEUTRAL PEDAGOGY
// ============================================================================

export const NEUTRAL_PEDAGOGY = {
  id: 'PEDAGOGY_001',
  name: 'Opinion-Neutral Education Layer',
  description: 'Explain mechanics, never motivation.',
  
  allowedPedagogy: [
    'explain terms',
    'explain mechanics',
    'explain limitations',
    'explain methodology',
    'explain uncertainty',
  ],
  
  forbiddenPedagogy: [
    'why you should care',
    'why this matters',
    'why this is important',
    'what you should do',
    'how to respond',
    'varför detta är viktigt',
    'vad du bör göra',
  ],
  
  pedagogyPrinciple: 'Caring is not the system\'s job. Understanding is.',
} as const;

// ============================================================================
// 8. CONFLICT ROBUSTNESS
// ============================================================================

export const CONFLICT_ROBUSTNESS = {
  id: 'CONFLICT_001',
  name: 'Worldview Independence',
  description: 'The system must work for people who disagree violently.',
  
  requirements: [
    'Can be used by people who disagree violently',
    'Does not privilege any worldview',
    'Does not collapse under selective reading',
    'Always shows the same data to everyone',
  ],
  
  disagreementRule: 'If two users disagree, they must disagree outside the system, not within it.',
  
  dataIntegrityTests: [
    { name: 'Same query, same data', description: 'Identical queries return identical data regardless of user' },
    { name: 'No personalization of facts', description: 'Facts are never filtered by inferred preference' },
    { name: 'No framing variation', description: 'Presentation is identical across all users' },
  ],
} as const;

// ============================================================================
// 9. FINAL TEST — NO ESCAPE
// ============================================================================

export const FINAL_TEST = {
  id: 'FINAL_001',
  name: 'Ignorance Prevention Test',
  
  criticalQuestion: 'Is it possible to hold any position without seeing its measurable consequences?',
  
  passCondition: 'NO — it is impossible to hold a position without seeing consequences',
  failCondition: 'YES — positions can be held without seeing consequences',
  
  principle: 'The system must make ignorance expensive, not opinion.',
} as const;

// ============================================================================
// SYSTEM DEFINITION (ROLE IN THE WORLD)
// ============================================================================

export const SYSTEM_DEFINITION = {
  statement: 'This system does not tell people what to think. It makes it impossible to think without knowing.',
  
  whatWeAllow: [
    'People may think whatever they want',
    'People may vote however they want',
    'People may advocate any ideas they want',
  ],
  
  whatWeRequire: [
    'No one gets to do it without understanding what actually happens',
  ],
  
  classification: 'This is adulthood, not ideology.',
} as const;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validateOpinionImmunity(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const word of OPINION_IMMUNITY.forbiddenElements.normativeLanguage) {
    if (lowerText.includes(word.toLowerCase())) {
      violations.push(`Normative language detected: "${word}"`);
    }
  }
  
  for (const phrase of OPINION_IMMUNITY.forbiddenElements.moralFraming) {
    if (lowerText.includes(phrase.toLowerCase())) {
      violations.push(`Moral framing detected: "${phrase}"`);
    }
  }
  
  return { valid: violations.length === 0, violations };
}

export function validateAdultTreatment(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const pattern of ADULT_TEST.forbiddenPatterns) {
    if (lowerText.includes(pattern.toLowerCase())) {
      violations.push(`Guidance pattern detected: "${pattern}"`);
    }
  }
  
  return { valid: violations.length === 0, violations };
}

export function validateOutputCompleteness(output: {
  what_happened?: string;
  compared_to_what?: string;
  over_what_time?: string;
  with_what_confidence?: string;
  observable_consequences?: string;
}): { complete: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const q of COMPLETENESS_TEST.mandatoryQuestions) {
    const key = q.id as keyof typeof output;
    if (!output[key] || output[key] === '') {
      missing.push(q.question);
    }
  }
  
  return { complete: missing.length === 0, missing };
}

export function getNeutralAlternative(word: string): string | null {
  const alternatives = OPINION_IMMUNITY.neutralAlternatives as Record<string, string>;
  return alternatives[word.toLowerCase()] || null;
}

// ============================================================================
// EXPORT COMPLETE MASTERPROMPT
// ============================================================================

export const EPISTEMIC_MASTERPROMPT = {
  fundamental: FUNDAMENTAL_PRINCIPLE,
  immunity: OPINION_IMMUNITY,
  consequence: CONSEQUENCE_LOGIC,
  transparency: STANCE_TRANSPARENCY,
  adult: ADULT_TEST,
  noOpinion: NO_OPINION_WITHOUT_DATA,
  completeness: COMPLETENESS_TEST,
  pedagogy: NEUTRAL_PEDAGOGY,
  conflict: CONFLICT_ROBUSTNESS,
  finalTest: FINAL_TEST,
  definition: SYSTEM_DEFINITION,
  
  // Validation utilities
  validate: {
    opinionImmunity: validateOpinionImmunity,
    adultTreatment: validateAdultTreatment,
    outputCompleteness: validateOutputCompleteness,
  },
  
  // Quick access
  getNeutralAlternative,
} as const;

console.log('[Epistemic Masterprompt] Total Neutrality Enforcement loaded');
console.log('[Epistemic Masterprompt] Forbidden normative words:', OPINION_IMMUNITY.forbiddenElements.normativeLanguage.length);
console.log('[Epistemic Masterprompt] Mandatory completeness fields:', COMPLETENESS_TEST.mandatoryQuestions.length);
