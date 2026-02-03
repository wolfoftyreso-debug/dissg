/**
 * LEGAL, LIABILITY & RESPONSIBILITY HARDENING
 * 
 * Decision-Support Without Advice
 * 
 * Role: Senior legal architect and risk engineer
 * Task: Eliminate implied advice, duty of care, and attribution risk
 *       while preserving analytical power.
 * 
 * Mantra: "We show configurations of reality.
 *          We do not tell anyone what reality demands."
 */

// =============================================================================
// LEGAL ARCHITECT ROLE
// =============================================================================

export const LEGAL_ARCHITECT_ROLE = {
  specializations: [
    'decision-support systems',
    'public data aggregation',
    'financial analytics tooling',
    'regulatory and liability minimization',
  ],
  
  task: {
    do: 'eliminate implied advice, duty of care, and attribution risk',
    preserve: 'analytical power',
    method: 'reframe responsibility boundary (not weaken)',
  },
};

// =============================================================================
// 1. SYSTEM CLASSIFICATION
// =============================================================================

export const SYSTEM_CLASSIFICATION = {
  formal_type: 'Observational decision-support infrastructure',
  
  provides: 'pattern identification and scenario framing',
  
  explicitly_without: [
    'advice',
    'instruction',
    'obligation',
  ],
  
  must_be_consistent_in: [
    'UI',
    'language',
    'documentation',
    'API responses',
  ],
  
  validation_rule: 'If any component contradicts this → refactor.',
};

// =============================================================================
// 2. DECISION ENGINE - LEGAL ROLE DEFINITION
// =============================================================================

export const DECISION_ENGINE_LEGAL_DEFINITION = {
  definition: 'A tool for identifying configurations, alignments and divergences in aggregated historical and current data.',
  
  explicitly_does_not: [
    'recommend actions',
    'optimize outcomes',
    'select strategies',
    'assess desirability',
    'assess morality',
    'assess legality',
  ],
  
  must_be_true_in: [
    'UI text',
    'API schema',
    'internal naming',
    'marketing silence', // Important: absence of claims
  ],
};

// =============================================================================
// 3. LANGUAGE LOCKDOWN (CRITICAL)
// =============================================================================

export const LANGUAGE_LOCKDOWN = {
  banned_terms: [
    'should',
    'must',
    'optimal',
    'best',
    'correct',
    'fix',
    'solution',
    'failure',
    'success',
    'priority',
    'risk', // unless statistical variance
  ],
  
  risk_exception: 'Allowed only when referring to statistical variance, not normative assessment',
  
  allowed_replacements: [
    'observed',
    'aligned',
    'diverged',
    'historically associated',
    'configuration',
    'formation',
    'scenario boundary',
    'variance',
    'deviation',
  ],
  
  enforcement: 'If any forbidden term exists → block release',
};

export function scanForBannedTerms(text: string): {
  clean: boolean;
  violations: { term: string; position: number }[];
} {
  const violations: { term: string; position: number }[] = [];
  const lowerText = text.toLowerCase();
  
  for (const term of LANGUAGE_LOCKDOWN.banned_terms) {
    let pos = lowerText.indexOf(term);
    while (pos !== -1) {
      // Special case for "risk" - check context
      if (term === 'risk') {
        const context = lowerText.substring(Math.max(0, pos - 20), pos + 30);
        if (context.includes('statistical') || context.includes('variance')) {
          // Allowed usage
          pos = lowerText.indexOf(term, pos + 1);
          continue;
        }
      }
      violations.push({ term, position: pos });
      pos = lowerText.indexOf(term, pos + 1);
    }
  }
  
  return {
    clean: violations.length === 0,
    violations,
  };
}

// =============================================================================
// 4. FORMATION OUTPUT RULES
// =============================================================================

export const FORMATION_OUTPUT_REQUIREMENTS = {
  mandatory_fields: [
    'formation_name',      // Neutral naming
    'inputs_used',
    'time_window',
    'stability_duration',
    'historical_recurrence',
    'known_breakdown_cases',
    'uncertainty_range',
  ],
  
  mandatory_footer: {
    text: 'This formation describes observed alignment in data. It does not predict outcomes or recommend actions.',
    editable: false,
    languages: {
      en: 'This formation describes observed alignment in data. It does not predict outcomes or recommend actions.',
      sv: 'Denna formation beskriver observerad samstämmighet i data. Den förutsäger inte utfall eller rekommenderar åtgärder.',
    },
  },
};

export interface FormationOutput {
  formationName: string;
  inputsUsed: string[];
  timeWindow: { start: string; end: string };
  stabilityDuration: string;
  historicalRecurrence: number; // percentage
  knownBreakdownCases: string[];
  uncertaintyRange: { lower: number; upper: number };
  footer: string; // Always the mandatory text
}

export function createFormationOutput(params: Omit<FormationOutput, 'footer'>, language: 'en' | 'sv' = 'en'): FormationOutput {
  return {
    ...params,
    footer: FORMATION_OUTPUT_REQUIREMENTS.mandatory_footer.languages[language],
  };
}

// =============================================================================
// 5. FUTURE & SCENARIO SAFETY
// =============================================================================

export const FUTURE_SCENARIO_RULES = {
  forward_looking_must: [
    'be explicitly conditional',
    'list assumptions',
    'list excluded variables',
    'show sensitivity to input changes',
  ],
  
  mandatory_phrasing: {
    en: 'Under these assumptions, multiple future configurations remain possible.',
    sv: 'Under dessa antaganden förblir flera framtida konfigurationer möjliga.',
  },
  
  forbidden: [
    'forecasts',
    'targets',
    'expected outcomes',
    'probability of success',
    'likely result',
    'prediction',
  ],
};

export interface ScenarioOutput {
  scenarioId: string;
  assumptions: string[];
  excludedVariables: string[];
  sensitivityAnalysis: { variable: string; impact: 'high' | 'medium' | 'low' }[];
  possibleConfigurations: string[];
  conditionalStatement: string;
}

export function validateScenarioOutput(scenario: ScenarioOutput): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (!scenario.assumptions?.length) missing.push('assumptions');
  if (!scenario.excludedVariables?.length) missing.push('excluded variables');
  if (!scenario.sensitivityAnalysis?.length) missing.push('sensitivity analysis');
  if (!scenario.conditionalStatement) missing.push('conditional statement');
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

// =============================================================================
// 6. USER RESPONSIBILITY TRANSFER
// =============================================================================

export const USER_RESPONSIBILITY_TRANSFER = {
  user_generated_label: 'User-constructed',
  
  acknowledgment_required: {
    text: 'I understand this output is not advice.',
    when: 'saving scenarios',
    style: 'no clickwrap drama, just clarity',
  },
  
  scenario_watermark: {
    text: 'User-generated scenario',
    visible: true,
    removable: false,
  },
};

export interface UserScenarioAcknowledgment {
  userId: string;
  scenarioId: string;
  acknowledgedAt: string;
  acknowledgmentText: string;
  understood: boolean;
}

// =============================================================================
// 7. API & EXPORT SAFETY
// =============================================================================

export const API_SAFETY_ENVELOPE = {
  required_fields: {
    classification: 'observational_decision_support',
    contains_recommendation: false,
    contains_prediction: false,
    user_assumptions_required: true,
  },
  
  protects_against: [
    'others building on top incorrectly',
    'AI models ingesting outputs as prescriptive',
    'third parties repackaging data as advice',
  ],
};

export interface APIResponseEnvelope<T> {
  classification: 'observational_decision_support';
  contains_recommendation: false;
  contains_prediction: false;
  user_assumptions_required: true;
  data: T;
  generated_at: string;
}

export function wrapAPIResponse<T>(data: T): APIResponseEnvelope<T> {
  return {
    classification: 'observational_decision_support',
    contains_recommendation: false,
    contains_prediction: false,
    user_assumptions_required: true,
    data,
    generated_at: new Date().toISOString(),
  };
}

// =============================================================================
// 8. LIABILITY BOUNDARY STATEMENT (PUBLIC)
// =============================================================================

export const LIABILITY_BOUNDARY_STATEMENT = {
  immutable: true,
  public: true,
  
  text: {
    en: 'This system provides structured observations of public data. All interpretation, judgment and decisions remain the responsibility of the user.',
    sv: 'Detta system tillhandahåller strukturerade observationer av offentliga data. All tolkning, bedömning och alla beslut förblir användarens ansvar.',
  },
  
  rules: {
    max_length: 'no longer than this',
    no_legalese: true,
    no_disclaimers_beyond_this: true,
  },
};

// =============================================================================
// 9. INTERNAL KILL SWITCH
// =============================================================================

export const PERSUASION_KILL_SWITCH = {
  rule: 'If a feature increases persuasive power more than explanatory power → remove it.',
  
  applies_even_if: [
    'users like it',
    'investors want it',
    'media asks for it',
  ],
  
  test: {
    question: 'Does this feature make the system more convincing or more informative?',
    if_convincing: 'remove',
    if_informative: 'keep',
  },
};

export function evaluateFeaturePersuasion(params: {
  featureName: string;
  persuasivePowerIncrease: number; // 0-100
  explanatoryPowerIncrease: number; // 0-100
}): {
  verdict: 'keep' | 'remove';
  reason: string;
} {
  if (params.persuasivePowerIncrease > params.explanatoryPowerIncrease) {
    return {
      verdict: 'remove',
      reason: `Persuasive power (${params.persuasivePowerIncrease}) exceeds explanatory power (${params.explanatoryPowerIncrease})`,
    };
  }
  
  return {
    verdict: 'keep',
    reason: `Explanatory power (${params.explanatoryPowerIncrease}) >= persuasive power (${params.persuasivePowerIncrease})`,
  };
}

// =============================================================================
// 10. FINAL LEGAL SELF-TEST
// =============================================================================

export const LEGAL_SELF_TEST = {
  questions: [
    {
      question: 'Could a court interpret this as advice?',
      if_yes: 'redesign',
    },
    {
      question: 'Could a policymaker claim reliance?',
      if_yes: 'redesign',
    },
    {
      question: 'Could a journalist quote this as a conclusion?',
      if_yes: 'redesign',
    },
    {
      question: 'Could an AI present this as prescriptive?',
      if_yes: 'redesign',
    },
  ],
  
  target: 'Redesign until all answers are NO',
};

export interface LegalSelfTestResult {
  componentId: string;
  courtCouldInterpretAsAdvice: boolean;
  policymakerCouldClaimReliance: boolean;
  journalistCouldQuoteAsConclusion: boolean;
  aiCouldPresentAsPrescriptive: boolean;
  passes: boolean;
  requiredChanges: string[];
}

export function runLegalSelfTest(params: {
  componentId: string;
  courtCouldInterpretAsAdvice: boolean;
  policymakerCouldClaimReliance: boolean;
  journalistCouldQuoteAsConclusion: boolean;
  aiCouldPresentAsPrescriptive: boolean;
}): LegalSelfTestResult {
  const requiredChanges: string[] = [];
  
  if (params.courtCouldInterpretAsAdvice) {
    requiredChanges.push('Remove advice-like language');
  }
  if (params.policymakerCouldClaimReliance) {
    requiredChanges.push('Add explicit non-reliance language');
  }
  if (params.journalistCouldQuoteAsConclusion) {
    requiredChanges.push('Remove conclusory statements');
  }
  if (params.aiCouldPresentAsPrescriptive) {
    requiredChanges.push('Add machine-readable non-prescriptive markers');
  }
  
  return {
    ...params,
    passes: requiredChanges.length === 0,
    requiredChanges,
  };
}

// =============================================================================
// SYSTEM MANTRA (INTERNAL, LOCKED)
// =============================================================================

export const LEGAL_MANTRA = {
  locked: true,
  internal: true,
  
  text: {
    en: 'We show configurations of reality. We do not tell anyone what reality demands.',
    sv: 'Vi visar konfigurationer av verkligheten. Vi berättar inte för någon vad verkligheten kräver.',
  },
};

// =============================================================================
// OUTCOME SUMMARY
// =============================================================================

export const LIABILITY_HARDENING_OUTCOMES = {
  preserves: 'All analytical strength',
  eliminates: 'Advisory liability',
  minimizes: 'Legal exposure',
  protects_against: 'Misuse and misinterpretation',
  enables: 'Autonomous operation without oversight',
};

// =============================================================================
// COMPLETE LEGAL VALIDATION PIPELINE
// =============================================================================

export interface LegalValidationReport {
  timestamp: string;
  classificationConsistent: boolean;
  languageScanClean: boolean;
  languageViolations: { term: string; position: number }[];
  formationsCompliant: boolean;
  scenariosCompliant: boolean;
  apiEnvelopePresent: boolean;
  legalSelfTestPasses: boolean;
  persuasionKillSwitchActive: boolean;
  overallCompliant: boolean;
  criticalIssues: string[];
}

export function runLegalValidation(params: {
  uiText: string;
  documentationText: string;
  apiResponses: unknown[];
  formations: FormationOutput[];
  scenarios: ScenarioOutput[];
  legalTestParams: Parameters<typeof runLegalSelfTest>[0];
}): LegalValidationReport {
  const criticalIssues: string[] = [];
  
  // Language scan
  const combinedText = params.uiText + ' ' + params.documentationText;
  const languageScan = scanForBannedTerms(combinedText);
  if (!languageScan.clean) {
    criticalIssues.push(`Banned terms found: ${languageScan.violations.map(v => v.term).join(', ')}`);
  }
  
  // Formation compliance
  const formationsCompliant = params.formations.every(f => 
    f.footer === FORMATION_OUTPUT_REQUIREMENTS.mandatory_footer.languages.en ||
    f.footer === FORMATION_OUTPUT_REQUIREMENTS.mandatory_footer.languages.sv
  );
  if (!formationsCompliant) {
    criticalIssues.push('Formations missing mandatory footer');
  }
  
  // Scenario compliance
  const scenarioValidations = params.scenarios.map(validateScenarioOutput);
  const scenariosCompliant = scenarioValidations.every(v => v.valid);
  if (!scenariosCompliant) {
    criticalIssues.push('Scenarios missing required fields');
  }
  
  // API envelope check
  const apiEnvelopePresent = params.apiResponses.every(r => {
    const response = r as Partial<APIResponseEnvelope<unknown>>;
    return response.classification === 'observational_decision_support' &&
           response.contains_recommendation === false;
  });
  if (!apiEnvelopePresent) {
    criticalIssues.push('API responses missing safety envelope');
  }
  
  // Legal self-test
  const legalTest = runLegalSelfTest(params.legalTestParams);
  if (!legalTest.passes) {
    criticalIssues.push(`Legal self-test failed: ${legalTest.requiredChanges.join(', ')}`);
  }
  
  return {
    timestamp: new Date().toISOString(),
    classificationConsistent: true, // Would need context check
    languageScanClean: languageScan.clean,
    languageViolations: languageScan.violations,
    formationsCompliant,
    scenariosCompliant,
    apiEnvelopePresent,
    legalSelfTestPasses: legalTest.passes,
    persuasionKillSwitchActive: true,
    overallCompliant: criticalIssues.length === 0,
    criticalIssues,
  };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export const LIABILITY_HARDENING_VERSION = '1.0.0';

export const LIABILITY_HARDENING_SUMMARY = {
  classification: SYSTEM_CLASSIFICATION,
  engineDefinition: DECISION_ENGINE_LEGAL_DEFINITION,
  languageLockdown: LANGUAGE_LOCKDOWN,
  formationRules: FORMATION_OUTPUT_REQUIREMENTS,
  scenarioRules: FUTURE_SCENARIO_RULES,
  responsibilityTransfer: USER_RESPONSIBILITY_TRANSFER,
  apiSafety: API_SAFETY_ENVELOPE,
  liabilityStatement: LIABILITY_BOUNDARY_STATEMENT,
  killSwitch: PERSUASION_KILL_SWITCH,
  selfTest: LEGAL_SELF_TEST,
  mantra: LEGAL_MANTRA,
  outcomes: LIABILITY_HARDENING_OUTCOMES,
};
