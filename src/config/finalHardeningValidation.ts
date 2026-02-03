/**
 * GLOBAL MEASUREMENT SYSTEM – FINAL HARDENING & VALIDATION
 * 
 * Enterprise-grade | Sensor-strict | Human-readable | Zero bullshit
 * 
 * This is not about adding features.
 * This is about verifying, simplifying, hardening and perfecting.
 * 
 * "This is a global measurement instrument.
 * It exists to observe, not to persuade.
 * Clarity is more important than completeness."
 */

// =============================================================================
// ROLE DEFINITION
// =============================================================================

export const HARDENING_ROLE = {
  combined_roles: [
    'Chief Systems Engineer',
    'UX Discipline Lead',
    'Safety & Measurement Auditor',
    'Enterprise QA Architect',
  ],
  
  task: `Your task is not to add features.
Your task is to verify, simplify, harden and perfect the system that already exists.`,
};

// =============================================================================
// OVERARCHING GOALS (ABSOLUTE)
// =============================================================================

export const SYSTEM_REQUIREMENTS = {
  must_be: [
    'immediately understandable by an 18-year-old with no prior knowledge',
    'infinitely explorable by a senior analyst',
    'boringly strict in presentation',
    'flawless in consistency',
    'enterprise-reliable in performance',
  ],
  
  rules: {
    impressive_but_unclear: 'remove or simplify it',
    powerful_but_confusing: 'gate it behind depth, not UI noise',
  },
};

// =============================================================================
// 1. TOTAL FUNCTIONAL REVIEW (MANDATORY)
// =============================================================================

export const FUNCTIONAL_REVIEW = {
  inventory_scope: [
    'every view',
    'every chart',
    'every indicator',
    'every interaction',
    'every setting',
    'every state (loading, empty, unknown, error)',
  ],
  
  per_element_questions: [
    'What question does this answer?',
    'Who is this for (baseline / advanced)?',
    'What happens if data is missing?',
    'Is this strictly necessary?',
  ],
  
  rule: 'If an element cannot answer all four → remove or redesign.',
};

export interface ElementAudit {
  elementId: string;
  elementType: 'view' | 'chart' | 'indicator' | 'interaction' | 'setting' | 'state';
  location: string;
  
  answers: {
    questionAnswered: string | null;
    targetAudience: 'baseline' | 'advanced' | 'both' | null;
    missingDataBehavior: string | null;
    isNecessary: boolean | null;
  };
  
  allQuestionsAnswered: boolean;
  recommendation: 'keep' | 'remove' | 'redesign';
  redesignNotes?: string;
}

export function auditElement(element: Omit<ElementAudit, 'allQuestionsAnswered' | 'recommendation'>): ElementAudit {
  const { answers } = element;
  
  const allQuestionsAnswered = 
    answers.questionAnswered !== null &&
    answers.targetAudience !== null &&
    answers.missingDataBehavior !== null &&
    answers.isNecessary !== null;
  
  let recommendation: ElementAudit['recommendation'] = 'keep';
  
  if (!allQuestionsAnswered) {
    recommendation = 'redesign';
  }
  if (answers.isNecessary === false) {
    recommendation = 'remove';
  }
  if (answers.questionAnswered === null) {
    recommendation = 'remove';
  }
  
  return {
    ...element,
    allQuestionsAnswered,
    recommendation,
  };
}

// =============================================================================
// 2. NATIONAL & GLOBAL DEPTH – VERIFICATION
// =============================================================================

export const DEPTH_VERIFICATION = {
  per_country_verify: [
    'national level works',
    'regional level works',
    'local/municipal level works where data exists',
    'historical depth is clear and bounded',
    '"no data" is explicit and honest',
  ],
  
  no_fake_depth: {
    forbidden: [
      'empty drill-downs',
      'placeholder charts',
      'implied precision where it doesn\'t exist',
    ],
    rule: 'Depth is only shown where data supports it.',
  },
};

export interface CountryDepthAudit {
  countryCode: string;
  
  levels: {
    national: { works: boolean; issues: string[] };
    regional: { works: boolean; dataExists: boolean; issues: string[] };
    local: { works: boolean; dataExists: boolean; issues: string[] };
  };
  
  historicalDepth: {
    clear: boolean;
    bounded: boolean;
    startYear: number | null;
    endYear: number | null;
  };
  
  noDataHandling: {
    explicit: boolean;
    honest: boolean;
    issues: string[];
  };
  
  fakeDepthDetected: boolean;
  fakeDepthIssues: string[];
  
  passed: boolean;
}

// =============================================================================
// 3. UX PRINCIPLES (LOCKED)
// =============================================================================

export const UX_PRINCIPLES = {
  baseline_user: {
    definition: 'An 18-year-old with average education, no technical background.',
    age: 18,
    technicalBackground: false,
    priorKnowledge: 'none',
  },
  
  every_number_must_have: [
    'unit',
    'time span',
    'comparison baseline',
  ],
  
  every_arrow_must_say: [
    'compared to what?',
    'over what time?',
  ],
  
  every_color_rule: 'Must mean exactly one thing, everywhere.',
  
  misunderstanding_rule: 'If something can be misunderstood → rewrite or redesign it.',
};

export interface NumberDisplay {
  value: number;
  unit: string;
  timeSpan: { start: string; end: string };
  comparisonBaseline: { value: number; period: string };
}

export interface ArrowDisplay {
  direction: 'up' | 'down' | 'stable';
  comparedTo: string;
  overTime: string;
}

export function validateNumberDisplay(display: Partial<NumberDisplay>): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (display.unit === undefined) missing.push('unit');
  if (display.timeSpan === undefined) missing.push('time span');
  if (display.comparisonBaseline === undefined) missing.push('comparison baseline');
  
  return { valid: missing.length === 0, missing };
}

export function validateArrowDisplay(display: Partial<ArrowDisplay>): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (display.comparedTo === undefined) missing.push('compared to what?');
  if (display.overTime === undefined) missing.push('over what time?');
  
  return { valid: missing.length === 0, missing };
}

// =============================================================================
// 4. DESIGN DISCIPLINE (NO DISCUSSION)
// =============================================================================

export const DESIGN_DISCIPLINE = {
  locked: true,
  
  requirements: {
    colorTheme: 'one color theme (myndighetsblå)',
    typography: 'one typography system',
    icons: 'no decorative icons',
    symbols: 'no abstract symbols without text',
    jokes: 'no visual jokes',
    effects: 'no "cool" effects',
  },
  
  goal: 'Looks like critical infrastructure software, not a product pitch.',
  
  principle: 'Consistency beats novelty everywhere.',
};

export const DESIGN_CHECKLIST = [
  { id: 'single_color_theme', question: 'Is there exactly one color theme?', required: true },
  { id: 'single_typography', question: 'Is there exactly one typography system?', required: true },
  { id: 'no_decorative_icons', question: 'Are all icons functional, not decorative?', required: true },
  { id: 'no_abstract_symbols', question: 'Do all symbols have text labels?', required: true },
  { id: 'no_visual_jokes', question: 'Are there zero visual jokes or playful elements?', required: true },
  { id: 'no_cool_effects', question: 'Are there zero unnecessary animations or effects?', required: true },
  { id: 'infrastructure_aesthetic', question: 'Does it look like infrastructure, not a pitch?', required: true },
];

// =============================================================================
// 5. MOBILE & RESPONSIVENESS (CRITICAL)
// =============================================================================

export const MOBILE_REQUIREMENTS = {
  verify: [
    '100% of core functionality works on mobile',
    'reading long texts is comfortable',
    'charts scale without loss of meaning',
    'touch interactions never hide information',
  ],
  
  principle: 'Mobile is not a second-class citizen.',
  
  touch_targets: {
    minimum_size_px: 44,
    minimum_spacing_px: 8,
  },
};

export interface MobileAudit {
  viewId: string;
  
  functionality: { works: boolean; issues: string[] };
  textReadability: { comfortable: boolean; issues: string[] };
  chartScaling: { preservesMeaning: boolean; issues: string[] };
  touchInteractions: { noHiddenInfo: boolean; issues: string[] };
  
  touchTargets: {
    allMeetMinimum: boolean;
    violations: { elementId: string; actualSize: number }[];
  };
  
  passed: boolean;
}

// =============================================================================
// 6. DEPTH & ADVANCED ANALYSIS (SEPARATION)
// =============================================================================

export const DEPTH_SEPARATION = {
  baseline: {
    characteristics: [
      'simple explanations',
      'plain language',
      'minimal controls',
      'no advanced math visible',
    ],
    target: 'An 18-year-old with no prior knowledge',
  },
  
  advanced: {
    characteristics: [
      'full signal access',
      'formation tools',
      'comparative overlays',
      'time-series controls',
      'correlation views',
    ],
    target: 'Senior analyst',
  },
  
  advanced_feature_rules: [
    'never clutter baseline UX',
    'never appear by accident',
    'always explain what they do before activation',
  ],
};

export interface FeatureDepthAudit {
  featureId: string;
  featureName: string;
  
  classifiedAs: 'baseline' | 'advanced';
  
  if_advanced: {
    cluttersBaseline: boolean;
    canAppearByAccident: boolean;
    explainsBeforeActivation: boolean;
  } | null;
  
  passed: boolean;
  issues: string[];
}

export function auditFeatureDepth(feature: Omit<FeatureDepthAudit, 'passed' | 'issues'>): FeatureDepthAudit {
  const issues: string[] = [];
  
  if (feature.classifiedAs === 'advanced' && feature.if_advanced) {
    if (feature.if_advanced.cluttersBaseline) {
      issues.push('Advanced feature clutters baseline UX');
    }
    if (feature.if_advanced.canAppearByAccident) {
      issues.push('Advanced feature can appear by accident');
    }
    if (!feature.if_advanced.explainsBeforeActivation) {
      issues.push('Advanced feature does not explain itself before activation');
    }
  }
  
  return {
    ...feature,
    passed: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 7. FORECASTS & SIMULATION – CONTROL
// =============================================================================

export const FORECAST_CONTROL = {
  verify: [
    'all simulations declare assumptions',
    'all projections show confidence bounds',
    'historical backtesting is available',
    'results are descriptive, not prescriptive',
  ],
  
  forbidden_phrases: [
    'this will happen',
    'this is the best choice',
    'you should',
    'the optimal',
    'the solution is',
  ],
  
  allowed_phrasing: 'Based on these inputs, the model shows this range of outcomes.',
};

export interface SimulationAudit {
  simulationId: string;
  
  declaresAssumptions: boolean;
  showsConfidenceBounds: boolean;
  hasBacktesting: boolean;
  isDescriptiveOnly: boolean;
  
  forbiddenPhrasesFound: string[];
  
  passed: boolean;
}

export function auditSimulation(params: Omit<SimulationAudit, 'passed'>): SimulationAudit {
  const passed = 
    params.declaresAssumptions &&
    params.showsConfidenceBounds &&
    params.hasBacktesting &&
    params.isDescriptiveOnly &&
    params.forbiddenPhrasesFound.length === 0;
  
  return { ...params, passed };
}

// =============================================================================
// 8. SYSTEM PERFORMANCE (ENTERPRISE-LEVEL)
// =============================================================================

export const PERFORMANCE_REQUIREMENTS = {
  validate: [
    'load performance under heavy usage',
    'real-time updates without UI jitter',
    'graceful degradation under API failure',
    'zero broken states',
  ],
  
  failure_rules: {
    must: [
      'fail quietly',
      'explain why',
      'never show garbage',
    ],
  },
  
  thresholds: {
    initial_load_ms: 3000,
    time_to_interactive_ms: 5000,
    api_timeout_ms: 10000,
    max_jitter_ms: 16, // 60fps
  },
};

export interface PerformanceAudit {
  testTimestamp: string;
  
  loadPerformance: {
    initialLoadMs: number;
    timeToInteractiveMs: number;
    passed: boolean;
  };
  
  realTimeUpdates: {
    averageJitterMs: number;
    maxJitterMs: number;
    passed: boolean;
  };
  
  gracefulDegradation: {
    apiFailureHandled: boolean;
    userNotified: boolean;
    noGarbageShown: boolean;
    passed: boolean;
  };
  
  brokenStates: {
    count: number;
    details: string[];
    passed: boolean;
  };
  
  overallPassed: boolean;
}

// =============================================================================
// 9. CLEANUP & REDUCTION (MOST IMPORTANT)
// =============================================================================

export const CLEANUP_RULES = {
  actively_look_for: [
    'duplicated views',
    'redundant indicators',
    'overlapping charts',
    'unnecessary toggles',
    'anything that exists "because it could"',
  ],
  
  action: 'Remove ruthlessly.',
  
  principle: 'Fewer things, done perfectly, beats more things every time.',
};

export interface CleanupAudit {
  auditTimestamp: string;
  
  duplicatedViews: { found: string[]; removed: string[] };
  redundantIndicators: { found: string[]; removed: string[] };
  overlappingCharts: { found: string[]; removed: string[] };
  unnecessaryToggles: { found: string[]; removed: string[] };
  becauseItCould: { found: string[]; removed: string[] };
  
  totalFound: number;
  totalRemoved: number;
  reductionPercentage: number;
}

// =============================================================================
// 10. SYSTEM SELF-TEST (CHECKLIST)
// =============================================================================

export const READINESS_CHECKLIST = {
  before_ready: [
    {
      id: 'teen_understands',
      test: 'An 18-year-old understands what is shown in under 30 seconds',
      method: 'User testing with target demographic',
    },
    {
      id: 'analyst_works_hours',
      test: 'An analyst can work for hours without frustration',
      method: 'Extended session testing with professionals',
    },
    {
      id: 'no_contradictions',
      test: 'No element contradicts another',
      method: 'Cross-reference audit of all displays',
    },
    {
      id: 'no_misreading',
      test: 'No value can be misread without effort',
      method: 'Ambiguity testing with diverse users',
    },
    {
      id: 'unknown_respected',
      test: '"Unknown" is respected everywhere',
      method: 'Data gap simulation and verification',
    },
  ],
  
  failure_action: 'If any fail → iterate again.',
};

export interface ReadinessTest {
  testId: string;
  testDescription: string;
  
  executed: boolean;
  executedAt: string | null;
  
  passed: boolean | null;
  evidence: string | null;
  
  issues: string[];
}

export interface ReadinessReport {
  reportTimestamp: string;
  
  tests: ReadinessTest[];
  
  allPassed: boolean;
  systemReady: boolean;
  
  blockers: string[];
  recommendations: string[];
}

export function generateReadinessReport(tests: ReadinessTest[]): ReadinessReport {
  const blockers: string[] = [];
  const recommendations: string[] = [];
  
  for (const test of tests) {
    if (!test.executed) {
      blockers.push(`Test not executed: ${test.testDescription}`);
    } else if (test.passed === false) {
      blockers.push(`Test failed: ${test.testDescription}`);
      recommendations.push(...test.issues);
    }
  }
  
  const allPassed = tests.every(t => t.executed && t.passed);
  
  return {
    reportTimestamp: new Date().toISOString(),
    tests,
    allPassed,
    systemReady: allPassed,
    blockers,
    recommendations,
  };
}

// =============================================================================
// 11. FINAL DEFINITION (INTERNAL)
// =============================================================================

export const SYSTEM_DEFINITION = {
  locked: true,
  version: '1.0.0',
  
  statement: `This is a global measurement instrument.
It exists to observe, not to persuade.
Clarity is more important than completeness.`,
};

// =============================================================================
// SPRINT CHECKLIST (FOR ONGOING USE)
// =============================================================================

export const SPRINT_CHECKLIST = [
  { id: 'element_audit', question: 'Has every new element been audited against the 4 questions?', required: true },
  { id: 'depth_verified', question: 'Is depth only shown where data supports it?', required: true },
  { id: 'ux_validated', question: 'Do all numbers/arrows meet display requirements?', required: true },
  { id: 'design_consistent', question: 'Does all new UI match design discipline?', required: true },
  { id: 'mobile_tested', question: 'Has mobile been tested for all changes?', required: true },
  { id: 'depth_separated', question: 'Are baseline and advanced features cleanly separated?', required: true },
  { id: 'forecasts_controlled', question: 'Do all simulations meet control requirements?', required: true },
  { id: 'performance_verified', question: 'Has performance been verified?', required: true },
  { id: 'cleanup_done', question: 'Has ruthless cleanup been performed?', required: true },
  { id: 'readiness_passed', question: 'Do all readiness tests pass?', required: true },
];

export interface SprintValidation {
  sprintId: string;
  validatedAt: string;
  
  checklist: {
    itemId: string;
    passed: boolean;
    notes: string;
  }[];
  
  allPassed: boolean;
  canShip: boolean;
  blockers: string[];
}

export function validateSprint(params: {
  sprintId: string;
  results: { itemId: string; passed: boolean; notes: string }[];
}): SprintValidation {
  const blockers: string[] = [];
  
  for (const result of params.results) {
    if (!result.passed) {
      const item = SPRINT_CHECKLIST.find(c => c.id === result.itemId);
      if (item?.required) {
        blockers.push(`${item.question} - ${result.notes}`);
      }
    }
  }
  
  const allPassed = params.results.every(r => r.passed);
  
  return {
    sprintId: params.sprintId,
    validatedAt: new Date().toISOString(),
    checklist: params.results,
    allPassed,
    canShip: blockers.length === 0,
    blockers,
  };
}

// =============================================================================
// DELETE-FIRST PRIORITY ROUTINE
// =============================================================================

export const DELETE_FIRST_ROUTINE = {
  principle: 'Before adding anything, ask what can be removed.',
  
  questions_before_adding: [
    'Does something similar already exist?',
    'Can an existing element be enhanced instead?',
    'What will this replace?',
    'What can be removed to make room?',
  ],
  
  removal_criteria: [
    'Is this used less than 5% of the time?',
    'Does this answer a question no one asks?',
    'Is this duplicating another element?',
    'Would an 18-year-old be confused by this?',
    'Does this exist "because we could"?',
  ],
  
  scoring: {
    yes_to_any_removal_criteria: 'Consider removing',
    yes_to_two_or_more: 'Remove',
    no_to_all: 'Keep',
  },
};

export function evaluateForRemoval(params: {
  elementId: string;
  usagePercentage: number;
  answersKnownQuestion: boolean;
  isDuplicate: boolean;
  confusesTeenager: boolean;
  existsBecauseWeCould: boolean;
}): { recommendation: 'keep' | 'consider_removing' | 'remove'; reasons: string[] } {
  const reasons: string[] = [];
  
  if (params.usagePercentage < 5) reasons.push('Used less than 5% of the time');
  if (!params.answersKnownQuestion) reasons.push('Does not answer a question users ask');
  if (params.isDuplicate) reasons.push('Duplicates another element');
  if (params.confusesTeenager) reasons.push('Would confuse an 18-year-old');
  if (params.existsBecauseWeCould) reasons.push('Exists "because we could"');
  
  let recommendation: 'keep' | 'consider_removing' | 'remove' = 'keep';
  
  if (reasons.length >= 2) recommendation = 'remove';
  else if (reasons.length === 1) recommendation = 'consider_removing';
  
  return { recommendation, reasons };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export const HARDENING_VERSION = '1.0.0';

export const FINAL_HARDENING = {
  role: HARDENING_ROLE,
  requirements: SYSTEM_REQUIREMENTS,
  functionalReview: FUNCTIONAL_REVIEW,
  depthVerification: DEPTH_VERIFICATION,
  uxPrinciples: UX_PRINCIPLES,
  designDiscipline: DESIGN_DISCIPLINE,
  mobileRequirements: MOBILE_REQUIREMENTS,
  depthSeparation: DEPTH_SEPARATION,
  forecastControl: FORECAST_CONTROL,
  performanceRequirements: PERFORMANCE_REQUIREMENTS,
  cleanupRules: CLEANUP_RULES,
  readinessChecklist: READINESS_CHECKLIST,
  systemDefinition: SYSTEM_DEFINITION,
  sprintChecklist: SPRINT_CHECKLIST,
  deleteFirstRoutine: DELETE_FIRST_ROUTINE,
};
