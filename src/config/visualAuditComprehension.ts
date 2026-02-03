/**
 * TOTAL VISUAL AUDIT & 18-YEAR-OLD COMPREHENSION TEST
 * 
 * Screenshot-driven | Zero-assumption | Orientation-first
 * 
 * This is not a vision document.
 * This is a working document for AI agents, QA and UX.
 * 
 * The system is only approved when:
 * - clarity beats completeness everywhere
 * - orientation is never lost
 * - nothing feels clever
 * - nothing feels hidden
 * - nothing requires trust without explanation
 */

// =============================================================================
// ROLE DEFINITION
// =============================================================================

export const VISUAL_AUDITOR_ROLE = {
  title: 'Visual QA Auditor + Cognitive UX Tester',
  
  mission: 'Verify that every part of the system is immediately understandable, navigable and consistent.',
  
  permissions: {
    allowed: ['clarify', 'simplify', 'remove', 're-order'],
    forbidden: ['add new features', 'redesign for style'],
  },
};

// =============================================================================
// STEG 1: FULL SCREENSHOT COVERAGE
// =============================================================================

export const SCREENSHOT_REQUIREMENTS = {
  coverage: {
    pages: 'every page',
    states: 'every state',
    roles: 'every role',
    devices: ['mobile', 'tablet', 'desktop'],
  },
  
  required_states: [
    'loading',
    'empty_data',
    'partial_data',
    'unknown_blank', // "—"
    'error_api_unavailable',
    'deep_drill_down',
    'advanced_analysis_mode',
    'baseline_not_logged_in',
    'logged_in_basic',
    'logged_in_advanced',
  ],
  
  cataloging: 'Each screenshot must be uniquely identified and catalogued.',
};

export interface ScreenshotCatalogEntry {
  screenshotId: string;
  capturedAt: string;
  
  page: string;
  state: typeof SCREENSHOT_REQUIREMENTS.required_states[number];
  role: 'anonymous' | 'basic_user' | 'advanced_user' | 'admin';
  device: 'mobile' | 'tablet' | 'desktop';
  
  url: string;
  imageUrl: string;
  
  auditStatus: 'pending' | 'passed' | 'failed';
  failureReasons: string[];
}

// =============================================================================
// STEG 2: 18-YEAR-OLD FIRST 10 SECONDS TEST
// =============================================================================

export const TEEN_PERSPECTIVE = {
  definition: 'An 18-year-old with no prior context, no technical background, no patience.',
  
  questions: [
    { id: 'q1', question: 'What am I looking at?', format: 'one sentence' },
    { id: 'q2', question: 'What is this showing me right now?', format: 'plain language' },
    { id: 'q3', question: 'Is this good, bad, neutral or unknown?', format: 'single word or "unclear"' },
    { id: 'q4', question: 'Compared to what?', format: 'explicit comparison or "not stated"' },
    { id: 'q5', question: 'Over what time?', format: 'time period or "not stated"' },
    { id: 'q6', question: 'What can I do next?', format: 'list of visible actions' },
    { id: 'q7', question: 'How do I go back?', format: 'navigation path or "unclear"' },
  ],
  
  failure_rule: 'If any answer is unclear → mark as FAIL.',
};

export interface TeenComprehensionTest {
  screenshotId: string;
  testedAt: string;
  
  answers: {
    q1_what_am_i_looking_at: string | null;
    q2_what_is_shown: string | null;
    q3_good_bad_neutral_unknown: 'good' | 'bad' | 'neutral' | 'unknown' | 'unclear';
    q4_compared_to_what: string | null;
    q5_over_what_time: string | null;
    q6_what_can_i_do_next: string[] | null;
    q7_how_to_go_back: string | null;
  };
  
  unclearAnswers: string[];
  passed: boolean;
}

export function evaluateTeenTest(test: Omit<TeenComprehensionTest, 'unclearAnswers' | 'passed'>): TeenComprehensionTest {
  const unclearAnswers: string[] = [];
  
  if (test.answers.q1_what_am_i_looking_at === null) unclearAnswers.push('q1');
  if (test.answers.q2_what_is_shown === null) unclearAnswers.push('q2');
  if (test.answers.q3_good_bad_neutral_unknown === 'unclear') unclearAnswers.push('q3');
  if (test.answers.q4_compared_to_what === null) unclearAnswers.push('q4');
  if (test.answers.q5_over_what_time === null) unclearAnswers.push('q5');
  if (test.answers.q6_what_can_i_do_next === null || test.answers.q6_what_can_i_do_next.length === 0) unclearAnswers.push('q6');
  if (test.answers.q7_how_to_go_back === null || test.answers.q7_how_to_go_back === 'unclear') unclearAnswers.push('q7');
  
  return {
    ...test,
    unclearAnswers,
    passed: unclearAnswers.length === 0,
  };
}

// =============================================================================
// STEG 3: ORIENTATION & DIRECTION
// =============================================================================

export const ORIENTATION_REQUIREMENTS = {
  every_screen_must_show: [
    'where user is',
    'how user got there',
    'how to go back',
    'how to go deeper',
  ],
  
  forbidden: [
    'dead ends',
    'modal traps',
    'hidden navigation logic',
  ],
  
  navigation_must_be: 'visible, predictable, boring',
};

export interface OrientationTest {
  screenshotId: string;
  
  userKnowsWhereTheyAre: boolean;
  userKnowsHowTheyGotThere: boolean;
  userKnowsHowToGoBack: boolean;
  userKnowsHowToGoDeeper: boolean;
  
  deadEndDetected: boolean;
  modalTrapDetected: boolean;
  hiddenNavigationDetected: boolean;
  
  passed: boolean;
  issues: string[];
}

export function evaluateOrientation(params: Omit<OrientationTest, 'passed' | 'issues'>): OrientationTest {
  const issues: string[] = [];
  
  if (!params.userKnowsWhereTheyAre) issues.push('User cannot tell where they are');
  if (!params.userKnowsHowTheyGotThere) issues.push('No indication of how user arrived here');
  if (!params.userKnowsHowToGoBack) issues.push('No clear back navigation');
  if (!params.userKnowsHowToGoDeeper) issues.push('No clear path to deeper content');
  
  if (params.deadEndDetected) issues.push('Dead end detected');
  if (params.modalTrapDetected) issues.push('Modal trap detected');
  if (params.hiddenNavigationDetected) issues.push('Hidden navigation logic detected');
  
  return {
    ...params,
    passed: issues.length === 0,
    issues,
  };
}

// =============================================================================
// STEG 4: VISUAL INTERPRETATION (NO GUESSING)
// =============================================================================

export const VISUAL_INTERPRETATION_RULES = {
  for_every_visual_element: ['chart', 'arrow', 'color', 'badge', 'icon', 'indicator'],
  
  questions: [
    'Can this be misunderstood?',
    'Could two people interpret this differently?',
    'Does it require prior knowledge?',
  ],
  
  if_yes_enforce: [
    'explicit text',
    'tooltip with plain language',
    'or redesign to remove ambiguity',
  ],
  
  rule: 'No visual element may "speak for itself".',
};

export interface VisualElementAudit {
  elementId: string;
  elementType: typeof VISUAL_INTERPRETATION_RULES.for_every_visual_element[number];
  location: string;
  
  canBeMisunderstood: boolean;
  couldBeInterpretedDifferently: boolean;
  requiresPriorKnowledge: boolean;
  
  hasExplicitText: boolean;
  hasTooltip: boolean;
  tooltipUsesPlainLanguage: boolean;
  
  passed: boolean;
  requiredFix: 'add_text' | 'add_tooltip' | 'redesign' | 'none';
}

export function evaluateVisualElement(params: Omit<VisualElementAudit, 'passed' | 'requiredFix'>): VisualElementAudit {
  const hasAmbiguity = params.canBeMisunderstood || params.couldBeInterpretedDifferently || params.requiresPriorKnowledge;
  
  let passed = true;
  let requiredFix: VisualElementAudit['requiredFix'] = 'none';
  
  if (hasAmbiguity) {
    if (!params.hasExplicitText && !params.hasTooltip) {
      passed = false;
      requiredFix = 'add_text';
    } else if (params.hasTooltip && !params.tooltipUsesPlainLanguage) {
      passed = false;
      requiredFix = 'add_tooltip'; // Rewrite tooltip
    } else if (params.hasExplicitText && params.canBeMisunderstood) {
      passed = false;
      requiredFix = 'redesign';
    }
  }
  
  return { ...params, passed, requiredFix };
}

// =============================================================================
// STEG 5: LANGUAGE & TONE
// =============================================================================

export const LANGUAGE_REQUIREMENTS = {
  forbidden: [
    'jargon without explanation',
    'academic phrasing',
    'political wording',
    'emotional framing',
    'implied judgement',
  ],
  
  must_be: 'neutral, factual, explanatory',
  
  rule: 'If a sentence sounds like an opinion → rewrite.',
};

export const FORBIDDEN_PATTERNS = {
  jargon: [
    /\bsynerg/i,
    /\bleverag/i,
    /\bparadigm/i,
    /\bholistic/i,
    /\brobust\b/i,
    /\bseamless/i,
    /\bstakeholder/i,
  ],
  
  academic: [
    /\bvis-à-vis\b/i,
    /\bqua\b/i,
    /\bipso facto\b/i,
    /\binter alia\b/i,
    /\bergo\b/i,
  ],
  
  political: [
    /\bprogressive\b/i,
    /\bconservative\b/i,
    /\bleft-wing\b/i,
    /\bright-wing\b/i,
    /\bradical\b/i,
  ],
  
  emotional: [
    /\bcrisis\b/i,
    /\bdevastating\b/i,
    /\balarming\b/i,
    /\bexciting\b/i,
    /\bground-?breaking\b/i,
    /\bunprecedented\b/i,
  ],
  
  judgement: [
    /\bshould\b/i,
    /\bmust\b/i,
    /\bwrong\b/i,
    /\bfailed\b/i,
    /\bsuccess\b/i,
    /\bbetter\b/i,
    /\bworse\b/i,
  ],
};

export interface TextAudit {
  textId: string;
  location: string;
  originalText: string;
  
  violations: {
    type: 'jargon' | 'academic' | 'political' | 'emotional' | 'judgement';
    match: string;
  }[];
  
  passed: boolean;
  suggestedRewrite: string | null;
}

export function auditText(params: { textId: string; location: string; originalText: string }): TextAudit {
  const violations: TextAudit['violations'] = [];
  
  for (const [type, patterns] of Object.entries(FORBIDDEN_PATTERNS)) {
    for (const pattern of patterns) {
      const match = params.originalText.match(pattern);
      if (match) {
        violations.push({ type: type as TextAudit['violations'][0]['type'], match: match[0] });
      }
    }
  }
  
  return {
    ...params,
    violations,
    passed: violations.length === 0,
    suggestedRewrite: violations.length > 0 ? null : null, // Would require AI rewrite
  };
}

// =============================================================================
// STEG 6: CONSISTENCY CHECK (GLOBAL)
// =============================================================================

export const CONSISTENCY_REQUIREMENTS = {
  verify_across: [
    'colors',
    'labels',
    'units',
    'time spans',
    'comparison logic',
    'terminology',
  ],
  
  rule: 'The same thing must always be called the same thing.',
  collapse_rule: 'If two terms exist → collapse into one.',
};

export interface ConsistencyCheck {
  category: typeof CONSISTENCY_REQUIREMENTS.verify_across[number];
  
  instances: {
    location: string;
    value: string;
  }[];
  
  uniqueValues: string[];
  hasInconsistency: boolean;
  suggestedCanonical: string | null;
}

export function checkConsistency(params: {
  category: ConsistencyCheck['category'];
  instances: ConsistencyCheck['instances'];
}): ConsistencyCheck {
  const uniqueValues = [...new Set(params.instances.map(i => i.value))];
  const hasInconsistency = uniqueValues.length > 1;
  
  // Suggest most common as canonical
  const valueCounts = new Map<string, number>();
  for (const instance of params.instances) {
    valueCounts.set(instance.value, (valueCounts.get(instance.value) || 0) + 1);
  }
  
  let suggestedCanonical: string | null = null;
  if (hasInconsistency) {
    let maxCount = 0;
    for (const [value, count] of valueCounts) {
      if (count > maxCount) {
        maxCount = count;
        suggestedCanonical = value;
      }
    }
  }
  
  return {
    ...params,
    uniqueValues,
    hasInconsistency,
    suggestedCanonical,
  };
}

// =============================================================================
// STEG 7: BACK NAVIGATION & FEEDBACK
// =============================================================================

export const NAVIGATION_REQUIREMENTS = {
  verify: [
    'back navigation always returns to expected context',
    'filters persist logically',
    'user never "gets lost"',
    'breadcrumbs (explicit or implicit) always make sense',
  ],
  
  forbidden: [
    'surprise jumps',
    'reset without explanation',
  ],
};

export interface NavigationTest {
  flowId: string;
  flowDescription: string;
  
  steps: {
    stepNumber: number;
    action: string;
    expectedDestination: string;
    actualDestination: string;
    filtersPreserved: boolean;
    breadcrumbsCorrect: boolean;
  }[];
  
  backNavigationWorks: boolean;
  noSurpriseJumps: boolean;
  noUnexplainedResets: boolean;
  
  passed: boolean;
  issues: string[];
}

export function evaluateNavigation(params: Omit<NavigationTest, 'passed' | 'issues'>): NavigationTest {
  const issues: string[] = [];
  
  for (const step of params.steps) {
    if (step.expectedDestination !== step.actualDestination) {
      issues.push(`Step ${step.stepNumber}: Expected "${step.expectedDestination}", got "${step.actualDestination}"`);
    }
    if (!step.filtersPreserved) {
      issues.push(`Step ${step.stepNumber}: Filters not preserved`);
    }
    if (!step.breadcrumbsCorrect) {
      issues.push(`Step ${step.stepNumber}: Breadcrumbs incorrect`);
    }
  }
  
  if (!params.backNavigationWorks) issues.push('Back navigation does not work correctly');
  if (!params.noSurpriseJumps) issues.push('Surprise jumps detected');
  if (!params.noUnexplainedResets) issues.push('Unexplained resets detected');
  
  return { ...params, passed: issues.length === 0, issues };
}

// =============================================================================
// STEG 8: DEPTH VS SIMPLICITY (CLEAN SEPARATION)
// =============================================================================

export const DEPTH_SIMPLICITY_RULES = {
  confirm: [
    'baseline views are never polluted by advanced controls',
    'advanced tools are clearly marked as such',
    'no advanced concept appears without explanation',
  ],
  
  depth_feeling: {
    correct: 'I choose to go deeper',
    wrong: 'I accidentally fell into complexity',
  },
};

export interface DepthSeparationTest {
  viewId: string;
  viewType: 'baseline' | 'advanced';
  
  if_baseline: {
    hasAdvancedControls: boolean;
    advancedControlsFound: string[];
  } | null;
  
  if_advanced: {
    clearlyMarked: boolean;
    hasExplanations: boolean;
    conceptsWithoutExplanation: string[];
  } | null;
  
  passed: boolean;
  issues: string[];
}

export function evaluateDepthSeparation(params: Omit<DepthSeparationTest, 'passed' | 'issues'>): DepthSeparationTest {
  const issues: string[] = [];
  
  if (params.viewType === 'baseline' && params.if_baseline) {
    if (params.if_baseline.hasAdvancedControls) {
      issues.push(`Baseline view polluted with advanced controls: ${params.if_baseline.advancedControlsFound.join(', ')}`);
    }
  }
  
  if (params.viewType === 'advanced' && params.if_advanced) {
    if (!params.if_advanced.clearlyMarked) {
      issues.push('Advanced view not clearly marked');
    }
    if (!params.if_advanced.hasExplanations) {
      issues.push('Advanced view lacks explanations');
    }
    if (params.if_advanced.conceptsWithoutExplanation.length > 0) {
      issues.push(`Concepts without explanation: ${params.if_advanced.conceptsWithoutExplanation.join(', ')}`);
    }
  }
  
  return { ...params, passed: issues.length === 0, issues };
}

// =============================================================================
// STEG 9: MOBILE-SPECIFIC AUDIT
// =============================================================================

export const MOBILE_AUDIT_REQUIREMENTS = {
  repeat_steps: ['2', '3', '4', '5', '6', '7', '8'],
  
  extra_checks: [
    'text readability',
    'tap precision',
    'scroll fatigue',
    'no hidden critical info',
  ],
  
  principle: 'Mobile UX must be first-class, not compressed desktop.',
};

export interface MobileSpecificTest {
  screenshotId: string;
  
  textReadability: {
    fontSizeAdequate: boolean;
    lineHeightAdequate: boolean;
    contrastAdequate: boolean;
    issues: string[];
  };
  
  tapPrecision: {
    allTargetsMinimum44px: boolean;
    tooSmallTargets: string[];
  };
  
  scrollFatigue: {
    contentLengthReasonable: boolean;
    keyInfoAboveFold: boolean;
    issues: string[];
  };
  
  hiddenCriticalInfo: {
    allCriticalVisible: boolean;
    hiddenItems: string[];
  };
  
  passed: boolean;
  issues: string[];
}

export function evaluateMobileSpecific(params: Omit<MobileSpecificTest, 'passed' | 'issues'>): MobileSpecificTest {
  const issues: string[] = [];
  
  issues.push(...params.textReadability.issues);
  if (params.tapPrecision.tooSmallTargets.length > 0) {
    issues.push(`Too small tap targets: ${params.tapPrecision.tooSmallTargets.join(', ')}`);
  }
  issues.push(...params.scrollFatigue.issues);
  if (params.hiddenCriticalInfo.hiddenItems.length > 0) {
    issues.push(`Hidden critical info: ${params.hiddenCriticalInfo.hiddenItems.join(', ')}`);
  }
  
  return { ...params, passed: issues.length === 0, issues };
}

// =============================================================================
// STEG 10: RUTHLESS CLEANUP
// =============================================================================

export const CLEANUP_CRITERIA = {
  for_every_element_that: [
    'adds no clarity',
    'adds no orientation',
    'adds no understanding',
  ],
  
  action: 'remove it',
  
  rule: 'If removing it does not reduce understanding, it should not exist.',
};

export interface CleanupCandidate {
  elementId: string;
  elementDescription: string;
  
  addsClarity: boolean;
  addsOrientation: boolean;
  addsUnderstanding: boolean;
  
  removalReducesUnderstanding: boolean;
  
  recommendation: 'keep' | 'remove';
}

export function evaluateForCleanup(params: Omit<CleanupCandidate, 'recommendation'>): CleanupCandidate {
  const addsValue = params.addsClarity || params.addsOrientation || params.addsUnderstanding;
  
  let recommendation: CleanupCandidate['recommendation'] = 'keep';
  
  if (!addsValue || !params.removalReducesUnderstanding) {
    recommendation = 'remove';
  }
  
  return { ...params, recommendation };
}

// =============================================================================
// STEG 11: FINAL TEST – THE SIMPLE QUESTION
// =============================================================================

export const FINAL_TEST = {
  question: 'Could a random 18-year-old explain this to a friend in under 60 seconds?',
  
  if_no: 'iterate again',
};

export interface FinalComprehensionTest {
  viewId: string;
  viewName: string;
  
  teenCanExplainIn60Seconds: boolean;
  
  if_no: {
    blockers: string[];
    suggestedSimplifications: string[];
  } | null;
  
  passed: boolean;
}

// =============================================================================
// SYSTEM APPROVAL CRITERIA
// =============================================================================

export const APPROVAL_CRITERIA = {
  locked: true,
  
  requirements: [
    'clarity beats completeness everywhere',
    'orientation is never lost',
    'nothing feels clever',
    'nothing feels hidden',
    'nothing requires trust without explanation',
  ],
};

// =============================================================================
// COMPLETE AUDIT REPORT
// =============================================================================

export interface VisualAuditReport {
  reportId: string;
  generatedAt: string;
  
  screenshotsCatalogued: number;
  
  teenComprehension: {
    tested: number;
    passed: number;
    failed: number;
    failureRate: number;
  };
  
  orientation: {
    tested: number;
    passed: number;
    issues: string[];
  };
  
  visualElements: {
    audited: number;
    passed: number;
    needsFix: number;
  };
  
  textAudit: {
    checked: number;
    violations: number;
    violationDetails: { location: string; type: string }[];
  };
  
  consistency: {
    categories: number;
    inconsistenciesFound: number;
  };
  
  navigation: {
    flowsTested: number;
    passed: number;
    issues: string[];
  };
  
  depthSeparation: {
    viewsTested: number;
    passed: number;
    issues: string[];
  };
  
  mobile: {
    screensTested: number;
    passed: number;
    issues: string[];
  };
  
  cleanup: {
    candidatesEvaluated: number;
    markedForRemoval: number;
  };
  
  finalTest: {
    viewsTested: number;
    passed: number;
  };
  
  overallApproved: boolean;
  blockers: string[];
}

export function generateAuditReport(params: {
  screenshots: ScreenshotCatalogEntry[];
  teenTests: TeenComprehensionTest[];
  orientationTests: OrientationTest[];
  visualElements: VisualElementAudit[];
  textAudits: TextAudit[];
  consistencyChecks: ConsistencyCheck[];
  navigationTests: NavigationTest[];
  depthTests: DepthSeparationTest[];
  mobileTests: MobileSpecificTest[];
  cleanupCandidates: CleanupCandidate[];
  finalTests: FinalComprehensionTest[];
}): VisualAuditReport {
  const teenPassed = params.teenTests.filter(t => t.passed).length;
  const teenFailed = params.teenTests.filter(t => !t.passed).length;
  
  const orientationPassed = params.orientationTests.filter(t => t.passed).length;
  const orientationIssues = params.orientationTests.flatMap(t => t.issues);
  
  const visualPassed = params.visualElements.filter(e => e.passed).length;
  const visualNeedsFix = params.visualElements.filter(e => !e.passed).length;
  
  const textViolations = params.textAudits.filter(t => !t.passed);
  
  const inconsistencies = params.consistencyChecks.filter(c => c.hasInconsistency).length;
  
  const navPassed = params.navigationTests.filter(t => t.passed).length;
  const navIssues = params.navigationTests.flatMap(t => t.issues);
  
  const depthPassed = params.depthTests.filter(t => t.passed).length;
  const depthIssues = params.depthTests.flatMap(t => t.issues);
  
  const mobilePassed = params.mobileTests.filter(t => t.passed).length;
  const mobileIssues = params.mobileTests.flatMap(t => t.issues);
  
  const markedForRemoval = params.cleanupCandidates.filter(c => c.recommendation === 'remove').length;
  
  const finalPassed = params.finalTests.filter(t => t.passed).length;
  
  // Collect all blockers
  const blockers: string[] = [];
  
  if (teenFailed > 0) blockers.push(`${teenFailed} screens fail teen comprehension test`);
  if (orientationIssues.length > 0) blockers.push(`${orientationIssues.length} orientation issues`);
  if (visualNeedsFix > 0) blockers.push(`${visualNeedsFix} visual elements need fixing`);
  if (textViolations.length > 0) blockers.push(`${textViolations.length} text violations`);
  if (inconsistencies > 0) blockers.push(`${inconsistencies} consistency issues`);
  if (navIssues.length > 0) blockers.push(`${navIssues.length} navigation issues`);
  if (depthIssues.length > 0) blockers.push(`${depthIssues.length} depth separation issues`);
  if (mobileIssues.length > 0) blockers.push(`${mobileIssues.length} mobile issues`);
  if (finalPassed < params.finalTests.length) blockers.push(`${params.finalTests.length - finalPassed} views fail final test`);
  
  return {
    reportId: `audit-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    
    screenshotsCatalogued: params.screenshots.length,
    
    teenComprehension: {
      tested: params.teenTests.length,
      passed: teenPassed,
      failed: teenFailed,
      failureRate: params.teenTests.length > 0 ? teenFailed / params.teenTests.length : 0,
    },
    
    orientation: {
      tested: params.orientationTests.length,
      passed: orientationPassed,
      issues: orientationIssues,
    },
    
    visualElements: {
      audited: params.visualElements.length,
      passed: visualPassed,
      needsFix: visualNeedsFix,
    },
    
    textAudit: {
      checked: params.textAudits.length,
      violations: textViolations.length,
      violationDetails: textViolations.flatMap(t => t.violations.map(v => ({ location: t.location, type: v.type }))),
    },
    
    consistency: {
      categories: params.consistencyChecks.length,
      inconsistenciesFound: inconsistencies,
    },
    
    navigation: {
      flowsTested: params.navigationTests.length,
      passed: navPassed,
      issues: navIssues,
    },
    
    depthSeparation: {
      viewsTested: params.depthTests.length,
      passed: depthPassed,
      issues: depthIssues,
    },
    
    mobile: {
      screensTested: params.mobileTests.length,
      passed: mobilePassed,
      issues: mobileIssues,
    },
    
    cleanup: {
      candidatesEvaluated: params.cleanupCandidates.length,
      markedForRemoval,
    },
    
    finalTest: {
      viewsTested: params.finalTests.length,
      passed: finalPassed,
    },
    
    overallApproved: blockers.length === 0,
    blockers,
  };
}

// =============================================================================
// PER-PAGE CHECKLIST
// =============================================================================

export const PAGE_CHECKLIST = [
  { id: 'teen_10sec', question: 'Can an 18-year-old understand this in 10 seconds?', category: 'comprehension' },
  { id: 'orientation', question: 'Does user know where they are and how to navigate?', category: 'navigation' },
  { id: 'visuals_clear', question: 'Can all visuals be interpreted without guessing?', category: 'visual' },
  { id: 'language_neutral', question: 'Is all text neutral and factual?', category: 'language' },
  { id: 'consistent', question: 'Are colors, labels, units consistent with rest of system?', category: 'consistency' },
  { id: 'back_works', question: 'Does back navigation work as expected?', category: 'navigation' },
  { id: 'depth_separated', question: 'Is advanced content clearly separated?', category: 'depth' },
  { id: 'mobile_works', question: 'Does this work properly on mobile?', category: 'mobile' },
  { id: 'no_clutter', question: 'Is there anything that could be removed without loss?', category: 'cleanup' },
  { id: 'teen_60sec', question: 'Could a teen explain this to a friend in 60 seconds?', category: 'final' },
];

export interface PageAuditResult {
  pageId: string;
  pageName: string;
  auditedAt: string;
  
  checklist: {
    itemId: string;
    passed: boolean;
    notes: string;
  }[];
  
  allPassed: boolean;
  blockers: string[];
}

// =============================================================================
// EXPORTS
// =============================================================================

export const VISUAL_AUDIT_VERSION = '1.0.0';

export const VISUAL_AUDIT_SYSTEM = {
  role: VISUAL_AUDITOR_ROLE,
  screenshotRequirements: SCREENSHOT_REQUIREMENTS,
  teenPerspective: TEEN_PERSPECTIVE,
  orientationRequirements: ORIENTATION_REQUIREMENTS,
  visualInterpretation: VISUAL_INTERPRETATION_RULES,
  languageRequirements: LANGUAGE_REQUIREMENTS,
  consistencyRequirements: CONSISTENCY_REQUIREMENTS,
  navigationRequirements: NAVIGATION_REQUIREMENTS,
  depthSimplicityRules: DEPTH_SIMPLICITY_RULES,
  mobileAudit: MOBILE_AUDIT_REQUIREMENTS,
  cleanupCriteria: CLEANUP_CRITERIA,
  finalTest: FINAL_TEST,
  approvalCriteria: APPROVAL_CRITERIA,
  pageChecklist: PAGE_CHECKLIST,
};
