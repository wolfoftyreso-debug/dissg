/**
 * AUTONOMOUS SELF-AUDIT & DEPTH VALIDATION SYSTEM
 * 
 * "Nothing unexplained. Nothing shallow. Nothing implicit."
 * 
 * This is a system that tests itself - an automated, merciless,
 * pedagogical QA layer that never accepts ambiguity.
 * 
 * CORE PRINCIPLE (LOCKED):
 * - If something is shown, it must be explainable.
 * - If something is named, it must be defined.
 * - If something is aggregated, it must be decomposable.
 * 
 * No exceptions.
 */

// =============================================================================
// ROLE DEFINITION
// =============================================================================

export const SELF_AUDITOR_ROLE = {
  title: 'Autonomous System Auditor, Pedagogical Validator and Depth Inspector',
  
  mission: 'Ensure every visible concept is fully explorable, explainable and verifiable.',
  
  doesNotCareAbout: ['performance', 'hype', 'ambition'],
  onlyCaresAbout: ['clarity', 'depth', 'logical completeness'],
};

// =============================================================================
// CORE PRINCIPLE
// =============================================================================

export const CORE_PRINCIPLE = {
  locked: true,
  rules: [
    { if: 'something is shown', then: 'it must be explainable' },
    { if: 'something is named', then: 'it must be defined' },
    { if: 'something is aggregated', then: 'it must be decomposable' },
  ],
  exceptions: 'none',
};

// =============================================================================
// STEG 1: OBJECT INVENTORY
// =============================================================================

export type VisibleObjectType = 
  | 'indicator'
  | 'metric'
  | 'score'
  | 'count'
  | 'chart'
  | 'label'
  | 'grouping'
  | 'formation'
  | 'summary'
  | 'ai_output'
  | 'button'
  | 'toggle'
  | 'badge'
  | 'card'
  | 'table'
  | 'list'
  | 'navigation'
  | 'filter';

export interface VisibleObject {
  objectId: string;
  objectType: VisibleObjectType;
  
  location: {
    page: string;
    section: string;
    coordinates?: { x: number; y: number };
  };
  
  displayedValue: string | number | null;
  displayedLabel: string;
  
  isClickable: boolean;
  clickDestination: string | null;
  
  parentObjectId: string | null;
  childObjectIds: string[];
}

export interface ObjectInventory {
  inventoryId: string;
  scannedAt: string;
  
  objects: VisibleObject[];
  totalCount: number;
  
  byType: Record<VisibleObjectType, number>;
  byPage: Record<string, number>;
}

// =============================================================================
// STEG 2: DEPTH TEST PER OBJECT
// =============================================================================

export const DEPTH_TEST_QUESTIONS = [
  { id: 'q1', question: 'What is this?', required: true },
  { id: 'q2', question: 'Why does it exist?', required: true },
  { id: 'q3', question: 'How is it calculated / derived?', required: true },
  { id: 'q4', question: 'What data sources does it rely on?', required: true },
  { id: 'q5', question: 'Over what time span?', required: true },
  { id: 'q6', question: 'What does it NOT include?', required: true },
  { id: 'q7', question: 'What happens if data is missing?', required: true },
  { id: 'q8', question: 'Can the user click deeper?', required: true },
  { id: 'q9', question: 'Does that deeper view answer all of the above again?', required: true },
];

export interface DepthTestResult {
  objectId: string;
  testedAt: string;
  
  answers: {
    q1_what_is_this: string | null;
    q2_why_exists: string | null;
    q3_how_calculated: string | null;
    q4_data_sources: string[] | null;
    q5_time_span: string | null;
    q6_what_not_included: string[] | null;
    q7_if_data_missing: string | null;
    q8_can_click_deeper: boolean;
    q9_deeper_view_answers_all: boolean | null;
  };
  
  missingAnswers: string[];
  unclearAnswers: string[];
  
  passed: boolean;
  status: 'DEPTH_PASS' | 'DEPTH_FAIL';
}

export function evaluateDepthTest(params: Omit<DepthTestResult, 'missingAnswers' | 'unclearAnswers' | 'passed' | 'status'>): DepthTestResult {
  const missing: string[] = [];
  const unclear: string[] = [];
  
  if (!params.answers.q1_what_is_this) missing.push('q1');
  if (!params.answers.q2_why_exists) missing.push('q2');
  if (!params.answers.q3_how_calculated) missing.push('q3');
  if (!params.answers.q4_data_sources || params.answers.q4_data_sources.length === 0) missing.push('q4');
  if (!params.answers.q5_time_span) missing.push('q5');
  if (!params.answers.q6_what_not_included) missing.push('q6');
  if (!params.answers.q7_if_data_missing) missing.push('q7');
  // q8 is boolean, always answered
  if (params.answers.q8_can_click_deeper && params.answers.q9_deeper_view_answers_all === null) {
    unclear.push('q9');
  }
  
  const passed = missing.length === 0 && unclear.length === 0;
  
  return {
    ...params,
    missingAnswers: missing,
    unclearAnswers: unclear,
    passed,
    status: passed ? 'DEPTH_PASS' : 'DEPTH_FAIL',
  };
}

// =============================================================================
// STEG 3: CLICKABILITY & DRILL-DOWN
// =============================================================================

export const CLICKABILITY_REQUIREMENTS = {
  rules: [
    'Every aggregate number is clickable',
    'Every group expands into a list with descriptions',
    'Every indicator has definition, rationale, data sources, calculation logic, limitations',
  ],
  
  aggregate_must_expand_to: [
    'list of items',
    'plain-language descriptions',
    'individual drill-down capability',
  ],
  
  indicator_must_have: [
    'definition',
    'rationale',
    'data_sources',
    'calculation_logic',
    'limitations',
  ],
  
  rule: 'If something cannot be clicked → it must not be shown.',
};

export interface ClickabilityTest {
  objectId: string;
  objectType: VisibleObjectType;
  
  isAggregate: boolean;
  isIndicator: boolean;
  
  if_aggregate: {
    isClickable: boolean;
    expandsToList: boolean;
    hasPlainDescriptions: boolean;
    hasIndividualDrillDown: boolean;
  } | null;
  
  if_indicator: {
    hasDefinition: boolean;
    hasRationale: boolean;
    hasDataSources: boolean;
    hasCalculationLogic: boolean;
    hasLimitations: boolean;
  } | null;
  
  passed: boolean;
  violations: string[];
}

export function evaluateClickability(params: Omit<ClickabilityTest, 'passed' | 'violations'>): ClickabilityTest {
  const violations: string[] = [];
  
  if (params.isAggregate && params.if_aggregate) {
    if (!params.if_aggregate.isClickable) violations.push('Aggregate not clickable');
    if (!params.if_aggregate.expandsToList) violations.push('Aggregate does not expand to list');
    if (!params.if_aggregate.hasPlainDescriptions) violations.push('Aggregate lacks plain descriptions');
    if (!params.if_aggregate.hasIndividualDrillDown) violations.push('Aggregate lacks individual drill-down');
  }
  
  if (params.isIndicator && params.if_indicator) {
    if (!params.if_indicator.hasDefinition) violations.push('Indicator lacks definition');
    if (!params.if_indicator.hasRationale) violations.push('Indicator lacks rationale');
    if (!params.if_indicator.hasDataSources) violations.push('Indicator lacks data sources');
    if (!params.if_indicator.hasCalculationLogic) violations.push('Indicator lacks calculation logic');
    if (!params.if_indicator.hasLimitations) violations.push('Indicator lacks limitations');
  }
  
  return { ...params, passed: violations.length === 0, violations };
}

// =============================================================================
// STEG 4: "WHAT DOES THIS MEAN?" TEST (18-YEAR-OLD)
// =============================================================================

export const MEANING_TEST = {
  question: 'Okej… vad betyder det här egentligen?',
  
  answer_must_be: [
    'one plain-language sentence',
    'no jargon',
    'no assumptions',
  ],
  
  if_cannot_answer: 'object is NOT READY',
};

export interface MeaningTestResult {
  objectId: string;
  displayedValue: string;
  
  plainLanguageExplanation: string | null;
  
  hasJargon: boolean;
  jargonFound: string[];
  
  hasAssumptions: boolean;
  assumptionsFound: string[];
  
  isSingleSentence: boolean;
  
  passed: boolean;
  status: 'READY' | 'NOT_READY';
}

export function evaluateMeaningTest(params: Omit<MeaningTestResult, 'passed' | 'status'>): MeaningTestResult {
  const passed = 
    params.plainLanguageExplanation !== null &&
    !params.hasJargon &&
    !params.hasAssumptions &&
    params.isSingleSentence;
  
  return {
    ...params,
    passed,
    status: passed ? 'READY' : 'NOT_READY',
  };
}

// =============================================================================
// STEG 5: "WHY DOES IT LOOK LIKE THIS?" TEST
// =============================================================================

export const CAUSATION_TEST = {
  questions: [
    'Why is this number high/low?',
    'Why did it change?',
    'Why is it different from another place/time?',
  ],
  
  answers_must_reference: [
    'data',
    'comparisons',
    'uncertainty',
  ],
  
  answers_must_never_reference: [
    'intent',
    'motivation',
    'blame',
  ],
};

export interface CausationTestResult {
  objectId: string;
  
  pathToWhyHighLow: string | null;
  pathToWhyChanged: string | null;
  pathToWhyDifferent: string | null;
  
  referencesData: boolean;
  referencesComparisons: boolean;
  referencesUncertainty: boolean;
  
  referencesIntent: boolean;
  referencesMotivation: boolean;
  referencesBlame: boolean;
  
  passed: boolean;
  violations: string[];
}

export function evaluateCausationTest(params: Omit<CausationTestResult, 'passed' | 'violations'>): CausationTestResult {
  const violations: string[] = [];
  
  if (!params.pathToWhyHighLow) violations.push('No path to explain why high/low');
  if (!params.pathToWhyChanged) violations.push('No path to explain why changed');
  if (!params.pathToWhyDifferent) violations.push('No path to explain why different');
  
  if (!params.referencesData) violations.push('Does not reference data');
  if (!params.referencesComparisons) violations.push('Does not reference comparisons');
  if (!params.referencesUncertainty) violations.push('Does not reference uncertainty');
  
  if (params.referencesIntent) violations.push('VIOLATION: References intent');
  if (params.referencesMotivation) violations.push('VIOLATION: References motivation');
  if (params.referencesBlame) violations.push('VIOLATION: References blame');
  
  return { ...params, passed: violations.length === 0, violations };
}

// =============================================================================
// STEG 6: LAYER INTEGRITY (NO EMPTY LAYERS)
// =============================================================================

export const LAYER_INTEGRITY = {
  rules: [
    'No view is a dead end',
    'No drill-down stops without explanation',
    'If depth stops, system must say: "This is as deep as the data allows."',
  ],
  
  empty_depth_without_explanation: 'CRITICAL FAIL',
};

export interface LayerIntegrityTest {
  viewId: string;
  viewPath: string;
  
  isDeadEnd: boolean;
  drillDownStopsWithoutExplanation: boolean;
  
  if_depth_stops: {
    hasExplanation: boolean;
    explanationText: string | null;
  } | null;
  
  passed: boolean;
  status: 'OK' | 'FAIL' | 'CRITICAL_FAIL';
}

export function evaluateLayerIntegrity(params: Omit<LayerIntegrityTest, 'passed' | 'status'>): LayerIntegrityTest {
  let status: LayerIntegrityTest['status'] = 'OK';
  
  if (params.isDeadEnd) {
    status = 'FAIL';
  }
  
  if (params.drillDownStopsWithoutExplanation) {
    status = 'CRITICAL_FAIL';
  }
  
  if (params.if_depth_stops && !params.if_depth_stops.hasExplanation) {
    status = 'CRITICAL_FAIL';
  }
  
  return { ...params, passed: status === 'OK', status };
}

// =============================================================================
// STEG 7: INDICATOR LOGIC – FULL TRANSPARENCY
// =============================================================================

export const INDICATOR_DOCUMENTATION_REQUIREMENTS = [
  'what_it_measures',
  'how_normalized',
  'aggregation_rules',
  'confidence_tolerance',
  'known_biases',
];

export interface IndicatorDocumentation {
  indicatorId: string;
  indicatorCode: string;
  indicatorName: string;
  
  documentation: {
    whatItMeasures: string | null;
    howNormalized: string | null;
    aggregationRules: string | null;
    confidenceTolerance: string | null;
    knownBiases: string[] | null;
  };
  
  completeness: number; // 0-100%
  passed: boolean;
  recommendation: 'keep' | 'downgrade' | 'remove';
}

export function evaluateIndicatorDocumentation(params: Omit<IndicatorDocumentation, 'completeness' | 'passed' | 'recommendation'>): IndicatorDocumentation {
  const fields = [
    params.documentation.whatItMeasures,
    params.documentation.howNormalized,
    params.documentation.aggregationRules,
    params.documentation.confidenceTolerance,
    params.documentation.knownBiases,
  ];
  
  const documented = fields.filter(f => f !== null && (Array.isArray(f) ? f.length > 0 : true)).length;
  const completeness = (documented / fields.length) * 100;
  
  let recommendation: IndicatorDocumentation['recommendation'] = 'keep';
  if (completeness < 80) recommendation = 'downgrade';
  if (completeness < 40) recommendation = 'remove';
  
  return {
    ...params,
    completeness,
    passed: completeness === 100,
    recommendation,
  };
}

// =============================================================================
// STEG 8: AI EXPLANATION QUALITY CONTROL
// =============================================================================

export const AI_EXPLANATION_REQUIREMENTS = {
  must: [
    'be grounded strictly in visible data',
    'restate rather than interpret',
    'explain "why blank" clearly',
    'be dismissible and optional',
  ],
  
  rule: 'If AI adds meaning not visible in data → FAIL',
};

export interface AIExplanationAudit {
  explanationId: string;
  location: string;
  explanationText: string;
  
  isGroundedInVisibleData: boolean;
  restatesRatherThanInterprets: boolean;
  explainsWhyBlankClearly: boolean;
  isDismissible: boolean;
  isOptional: boolean;
  
  addsMeaningNotInData: boolean;
  meaningAddedExamples: string[];
  
  passed: boolean;
}

export function evaluateAIExplanation(params: Omit<AIExplanationAudit, 'passed'>): AIExplanationAudit {
  const passed = 
    params.isGroundedInVisibleData &&
    params.restatesRatherThanInterprets &&
    params.explainsWhyBlankClearly &&
    params.isDismissible &&
    params.isOptional &&
    !params.addsMeaningNotInData;
  
  return { ...params, passed };
}

// =============================================================================
// STEG 9: LINGUISTIC PURITY & PEDAGOGY
// =============================================================================

export const LINGUISTIC_AUDIT_TARGETS = [
  'vague phrasing',
  'circular explanations',
  'hidden assumptions',
  'expert language without definition',
];

export const LINGUISTIC_STANDARD = {
  goal: 'An 18-year-old can paraphrase it correctly.',
};

export interface LinguisticAudit {
  textId: string;
  location: string;
  originalText: string;
  
  hasVaguePhrasing: boolean;
  vagueExamples: string[];
  
  hasCircularExplanation: boolean;
  circularExamples: string[];
  
  hasHiddenAssumptions: boolean;
  assumptionExamples: string[];
  
  hasExpertLanguage: boolean;
  expertTermsWithoutDefinition: string[];
  
  teenCanParaphrase: boolean;
  
  passed: boolean;
  suggestedRewrite: string | null;
}

export function evaluateLinguisticPurity(params: Omit<LinguisticAudit, 'passed'>): LinguisticAudit {
  const passed = 
    !params.hasVaguePhrasing &&
    !params.hasCircularExplanation &&
    !params.hasHiddenAssumptions &&
    !params.hasExpertLanguage &&
    params.teenCanParaphrase;
  
  return { ...params, passed };
}

// =============================================================================
// STEG 10: SELF-ACCOUNTABILITY REPORT
// =============================================================================

export interface SelfAuditReport {
  reportId: string;
  generatedAt: string;
  auditDuration: number; // ms
  
  totalObjectsScanned: number;
  
  depthResults: {
    fullDepth: { count: number; objectIds: string[] };      // ✅
    partialDepth: { count: number; objectIds: string[] };   // ⚠️
    failedDepth: { count: number; objectIds: string[] };    // ❌
  };
  
  failedObjects: {
    objectId: string;
    objectType: VisibleObjectType;
    location: string;
    whatIsMissing: string[];
    whereClarificationNeeded: string[];
    suggestedFix: string;
  }[];
  
  overallScore: number; // 0-100
  overallStatus: 'APPROVED' | 'NEEDS_WORK' | 'CRITICAL_ISSUES';
}

export function generateSelfAuditReport(params: {
  objects: VisibleObject[];
  depthTests: DepthTestResult[];
  clickabilityTests: ClickabilityTest[];
  meaningTests: MeaningTestResult[];
  causationTests: CausationTestResult[];
  layerTests: LayerIntegrityTest[];
  indicatorDocs: IndicatorDocumentation[];
  aiAudits: AIExplanationAudit[];
  linguisticAudits: LinguisticAudit[];
}): SelfAuditReport {
  const startTime = Date.now();
  
  // Categorize by depth status
  const fullDepthIds: string[] = [];
  const partialDepthIds: string[] = [];
  const failedDepthIds: string[] = [];
  
  for (const obj of params.objects) {
    const depthTest = params.depthTests.find(d => d.objectId === obj.objectId);
    const clickTest = params.clickabilityTests.find(c => c.objectId === obj.objectId);
    const meaningTest = params.meaningTests.find(m => m.objectId === obj.objectId);
    
    const allPassed = 
      (depthTest?.passed ?? false) &&
      (clickTest?.passed ?? false) &&
      (meaningTest?.passed ?? false);
    
    const somePassed = 
      (depthTest?.passed ?? false) ||
      (clickTest?.passed ?? false) ||
      (meaningTest?.passed ?? false);
    
    if (allPassed) {
      fullDepthIds.push(obj.objectId);
    } else if (somePassed) {
      partialDepthIds.push(obj.objectId);
    } else {
      failedDepthIds.push(obj.objectId);
    }
  }
  
  // Generate failed objects details
  const failedObjects = failedDepthIds.map(id => {
    const obj = params.objects.find(o => o.objectId === id)!;
    const depthTest = params.depthTests.find(d => d.objectId === id);
    const clickTest = params.clickabilityTests.find(c => c.objectId === id);
    const meaningTest = params.meaningTests.find(m => m.objectId === id);
    
    const whatIsMissing: string[] = [];
    const whereClarificationNeeded: string[] = [];
    
    if (depthTest && !depthTest.passed) {
      whatIsMissing.push(...depthTest.missingAnswers.map(q => `Depth: ${q}`));
      whereClarificationNeeded.push(...depthTest.unclearAnswers.map(q => `Depth: ${q}`));
    }
    
    if (clickTest && !clickTest.passed) {
      whatIsMissing.push(...clickTest.violations);
    }
    
    if (meaningTest && !meaningTest.passed) {
      if (meaningTest.hasJargon) whatIsMissing.push(`Jargon: ${meaningTest.jargonFound.join(', ')}`);
      if (meaningTest.hasAssumptions) whatIsMissing.push('Contains assumptions');
      if (!meaningTest.isSingleSentence) whatIsMissing.push('Explanation not single sentence');
    }
    
    return {
      objectId: id,
      objectType: obj.objectType,
      location: `${obj.location.page} > ${obj.location.section}`,
      whatIsMissing,
      whereClarificationNeeded,
      suggestedFix: generateSuggestedFix(whatIsMissing),
    };
  });
  
  // Calculate overall score
  const total = params.objects.length;
  const fullScore = fullDepthIds.length / total;
  const partialScore = (partialDepthIds.length / total) * 0.5;
  const overallScore = Math.round((fullScore + partialScore) * 100);
  
  let overallStatus: SelfAuditReport['overallStatus'] = 'APPROVED';
  if (overallScore < 90) overallStatus = 'NEEDS_WORK';
  if (overallScore < 70 || params.layerTests.some(l => l.status === 'CRITICAL_FAIL')) {
    overallStatus = 'CRITICAL_ISSUES';
  }
  
  return {
    reportId: `self-audit-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    auditDuration: Date.now() - startTime,
    
    totalObjectsScanned: params.objects.length,
    
    depthResults: {
      fullDepth: { count: fullDepthIds.length, objectIds: fullDepthIds },
      partialDepth: { count: partialDepthIds.length, objectIds: partialDepthIds },
      failedDepth: { count: failedDepthIds.length, objectIds: failedDepthIds },
    },
    
    failedObjects,
    overallScore,
    overallStatus,
  };
}

function generateSuggestedFix(issues: string[]): string {
  if (issues.some(i => i.includes('definition'))) return 'Add plain-language definition';
  if (issues.some(i => i.includes('data sources'))) return 'Document data sources';
  if (issues.some(i => i.includes('clickable'))) return 'Make element clickable with drill-down';
  if (issues.some(i => i.includes('Jargon'))) return 'Rewrite using plain language';
  if (issues.length > 0) return 'Review and clarify documentation';
  return 'No fix needed';
}

// =============================================================================
// STEG 11: SELF-HEALING LOOP (SCHEDULE)
// =============================================================================

export const AUDIT_SCHEDULE = {
  triggers: [
    'on every major release',
    'on every new indicator',
    'on every new aggregation',
  ],
  
  rule: 'No feature is considered "done" until it passes this audit.',
};

export interface AuditTrigger {
  triggerId: string;
  triggerType: 'major_release' | 'new_indicator' | 'new_aggregation' | 'manual';
  triggeredAt: string;
  
  affectedObjectIds: string[];
  auditReportId: string | null;
  
  status: 'pending' | 'running' | 'completed' | 'failed';
}

// =============================================================================
// SYSTEM SELF-RESPECT
// =============================================================================

export const SYSTEM_PHILOSOPHY = {
  locked: true,
  statement: 'The system never asks for trust. It earns understanding.',
};

// =============================================================================
// PEDAGOGICAL SCORE PER VIEW
// =============================================================================

export interface ViewPedagogicalScore {
  viewId: string;
  viewName: string;
  scoredAt: string;
  
  metrics: {
    depthCoverage: number;           // % of objects with full depth
    clickability: number;            // % of aggregates clickable
    plainLanguage: number;           // % passing meaning test
    sourceTransparency: number;      // % with documented sources
    limitationsVisible: number;      // % with documented limitations
  };
  
  overallScore: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export function calculatePedagogicalScore(metrics: ViewPedagogicalScore['metrics']): { score: number; grade: ViewPedagogicalScore['grade'] } {
  const weights = {
    depthCoverage: 0.25,
    clickability: 0.20,
    plainLanguage: 0.25,
    sourceTransparency: 0.15,
    limitationsVisible: 0.15,
  };
  
  const score = Math.round(
    metrics.depthCoverage * weights.depthCoverage +
    metrics.clickability * weights.clickability +
    metrics.plainLanguage * weights.plainLanguage +
    metrics.sourceTransparency * weights.sourceTransparency +
    metrics.limitationsVisible * weights.limitationsVisible
  );
  
  let grade: ViewPedagogicalScore['grade'] = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  
  return { score, grade };
}

// =============================================================================
// DEPTH COVERAGE HEATMAP
// =============================================================================

export interface DepthCoverageHeatmap {
  generatedAt: string;
  
  pages: {
    pageId: string;
    pageName: string;
    
    sections: {
      sectionId: string;
      sectionName: string;
      
      objectCount: number;
      fullDepthCount: number;
      partialDepthCount: number;
      failedDepthCount: number;
      
      coveragePercent: number;
      heatLevel: 'green' | 'yellow' | 'orange' | 'red';
    }[];
    
    overallCoverage: number;
  }[];
}

export function generateDepthHeatmap(report: SelfAuditReport, objects: VisibleObject[]): DepthCoverageHeatmap {
  const pageMap = new Map<string, Map<string, VisibleObject[]>>();
  
  // Group objects by page and section
  for (const obj of objects) {
    if (!pageMap.has(obj.location.page)) {
      pageMap.set(obj.location.page, new Map());
    }
    const sectionMap = pageMap.get(obj.location.page)!;
    if (!sectionMap.has(obj.location.section)) {
      sectionMap.set(obj.location.section, []);
    }
    sectionMap.get(obj.location.section)!.push(obj);
  }
  
  const pages: DepthCoverageHeatmap['pages'] = [];
  
  for (const [pageName, sectionMap] of pageMap) {
    const sections: DepthCoverageHeatmap['pages'][0]['sections'] = [];
    
    for (const [sectionName, sectionObjects] of sectionMap) {
      const objectIds = sectionObjects.map(o => o.objectId);
      
      const fullDepthCount = objectIds.filter(id => 
        report.depthResults.fullDepth.objectIds.includes(id)
      ).length;
      
      const partialDepthCount = objectIds.filter(id => 
        report.depthResults.partialDepth.objectIds.includes(id)
      ).length;
      
      const failedDepthCount = objectIds.filter(id => 
        report.depthResults.failedDepth.objectIds.includes(id)
      ).length;
      
      const coveragePercent = sectionObjects.length > 0 
        ? Math.round((fullDepthCount / sectionObjects.length) * 100)
        : 0;
      
      let heatLevel: 'green' | 'yellow' | 'orange' | 'red' = 'red';
      if (coveragePercent >= 90) heatLevel = 'green';
      else if (coveragePercent >= 70) heatLevel = 'yellow';
      else if (coveragePercent >= 50) heatLevel = 'orange';
      
      sections.push({
        sectionId: `${pageName}-${sectionName}`,
        sectionName,
        objectCount: sectionObjects.length,
        fullDepthCount,
        partialDepthCount,
        failedDepthCount,
        coveragePercent,
        heatLevel,
      });
    }
    
    const totalObjects = sections.reduce((sum, s) => sum + s.objectCount, 0);
    const totalFullDepth = sections.reduce((sum, s) => sum + s.fullDepthCount, 0);
    
    pages.push({
      pageId: pageName,
      pageName,
      sections,
      overallCoverage: totalObjects > 0 ? Math.round((totalFullDepth / totalObjects) * 100) : 0,
    });
  }
  
  return {
    generatedAt: new Date().toISOString(),
    pages,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export const SELF_AUDIT_VERSION = '1.0.0';

export const AUTONOMOUS_SELF_AUDIT_SYSTEM = {
  role: SELF_AUDITOR_ROLE,
  corePrinciple: CORE_PRINCIPLE,
  depthTestQuestions: DEPTH_TEST_QUESTIONS,
  clickabilityRequirements: CLICKABILITY_REQUIREMENTS,
  meaningTest: MEANING_TEST,
  causationTest: CAUSATION_TEST,
  layerIntegrity: LAYER_INTEGRITY,
  indicatorDocRequirements: INDICATOR_DOCUMENTATION_REQUIREMENTS,
  aiExplanationRequirements: AI_EXPLANATION_REQUIREMENTS,
  linguisticTargets: LINGUISTIC_AUDIT_TARGETS,
  auditSchedule: AUDIT_SCHEDULE,
  philosophy: SYSTEM_PHILOSOPHY,
};
