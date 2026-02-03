/**
 * CONTINUOUS IMPROVEMENT, AI READINESS & GENERATIVE PRESENTATION LAYER
 * 
 * "Show reality clearly, repeatedly, and safely"
 * 
 * Creates generative summaries of what happened, how things compare,
 * what changed, and patterns observed - always respecting uncertainty.
 * 
 * The system must feel like: "A calm annual report for the planet."
 * 
 * Mantra: "Summarize reality. Never decorate it."
 */

// =============================================================================
// ROLE DEFINITION
// =============================================================================

export const PRINCIPAL_ARCHITECT_ROLE = {
  title: 'Principal Product Architect, AI Systems Designer & Information Presentation Specialist',
  
  experience: [
    'generative systems for analytics (non-creative, non-persuasive)',
    'financial year-in-review products (Avanza, Bloomberg summaries)',
    'large-scale global dashboards',
    'AI-first platforms that expose structure, not opinion',
  ],
  
  task: ['refine', 'standardize', 'future-proof', 'present'],
  
  never: ['persuade', 'predict', 'recommend'],
};

// =============================================================================
// OVERALL GOAL
// =============================================================================

export const PRESENTATION_GOAL = {
  description: 'Generative Presentation Layer',
  
  capabilities: [
    'summarizes what happened',
    'shows how things compare',
    'explains what changed',
    'highlights patterns',
    'always respects uncertainty',
  ],
  
  feeling: 'A calm annual report for the planet.',
};

// =============================================================================
// 1. AI-READINESS (FUNDAMENTAL REQUIREMENTS)
// =============================================================================

export const AI_READINESS = {
  system_must_be: [
    'fully machine-readable',
    'fully human-understandable',
    'consistently structured',
    'versioned',
  ],
  
  ai_used_for: [
    'summarization',
    'structuring',
    'orientation',
    'explanation',
  ],
  
  ai_not_used_for: [
    'conclusions',
    'prioritizations',
    'value judgments',
    'future promises',
  ],
};

export function validateAIUsage(usage: string): { valid: boolean; reason?: string } {
  const allowed = AI_READINESS.ai_used_for;
  const forbidden = AI_READINESS.ai_not_used_for;
  
  for (const f of forbidden) {
    if (usage.toLowerCase().includes(f)) {
      return { valid: false, reason: `AI cannot be used for: ${f}` };
    }
  }
  
  return { valid: true };
}

// =============================================================================
// 2. GENERATIVE PRESENTATION - CORE PRINCIPLE
// =============================================================================

export const GENERATIVE_PRESENTATION_CORE = {
  principle: 'AI may generate summaries of observed outcomes - never interpretations.',
  
  all_presentations_must: [
    'build only on already visible data',
    'be deterministic (same input → same output)',
    'be pre-generated, not live-chat',
  ],
  
  forbidden: [
    'live generation in front of user',
    'non-deterministic outputs',
    'hidden data references',
  ],
};

export interface GenerativeOutput {
  inputDataHash: string;
  outputText: string;
  generatedAt: string;
  isPreGenerated: boolean;
  isDeterministic: boolean;
  visibleDataOnly: boolean;
}

export function validateGenerativeOutput(output: GenerativeOutput): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!output.isPreGenerated) issues.push('Output must be pre-generated');
  if (!output.isDeterministic) issues.push('Output must be deterministic');
  if (!output.visibleDataOnly) issues.push('Output must only reference visible data');
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 3. "YEAR IN REVIEW" - GLOBAL / NATIONAL / REGIONAL
// =============================================================================

export const GEOGRAPHIC_LEVELS = [
  'world',
  'continent',
  'country',
  'region',
  'city_municipality',
] as const;

export type GeographicLevel = typeof GEOGRAPHIC_LEVELS[number];

export const YEAR_IN_REVIEW_STRUCTURE = {
  sections: {
    A_OVERVIEW: {
      name: 'Overview',
      required_fields: [
        'time_period',
        'coverage_rate',
        'data_sources',
      ],
    },
    
    B_MAJOR_CHANGES: {
      name: 'Major Observed Changes',
      required_fields: [
        'indicators_that_changed_pattern',
      ],
      forbidden: [
        'value words',
        'conclusions',
      ],
    },
    
    C_COMPARISONS: {
      name: 'Comparisons',
      required_fields: [
        'vs_previous_years',
        'vs_comparable_peers',
      ],
    },
    
    D_STABILITY_UNCERTAINTY: {
      name: 'Stability & Uncertainty',
      required_fields: [
        'what_was_stable',
        'where_variation_increased',
        'where_data_is_weak',
      ],
    },
    
    E_LIMITATIONS: {
      name: 'What This Does Not Say',
      required_fields: [
        'explicit_limitations_box',
      ],
    },
  },
  
  structure_is_always_same: true,
};

export interface YearInReviewReport {
  geoLevel: GeographicLevel;
  geoCode: string;
  geoName: string;
  year: number;
  
  overview: {
    timePeriod: { start: string; end: string };
    coverageRate: number;
    dataSources: string[];
  };
  
  majorChanges: {
    indicatorCode: string;
    indicatorName: string;
    changeDescription: string; // No value words
    magnitude: number;
    direction: 'increased' | 'decreased' | 'pattern_shift';
  }[];
  
  comparisons: {
    vsPreviousYears: {
      year: number;
      differencePercent: number;
      description: string;
    }[];
    vsComparablePeers: {
      peerCode: string;
      peerName: string;
      differencePercent: number;
      description: string;
    }[];
  };
  
  stabilityUncertainty: {
    stable: string[];
    increasedVariation: string[];
    weakData: string[];
  };
  
  limitations: string[];
}

export function validateYearInReview(report: YearInReviewReport): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check overview
  if (!report.overview.timePeriod.start || !report.overview.timePeriod.end) {
    issues.push('Missing time period');
  }
  if (report.overview.coverageRate === undefined) {
    issues.push('Missing coverage rate');
  }
  if (!report.overview.dataSources?.length) {
    issues.push('Missing data sources');
  }
  
  // Check for value words in changes
  const valueWords = ['good', 'bad', 'better', 'worse', 'success', 'failure', 'best', 'worst'];
  for (const change of report.majorChanges) {
    for (const word of valueWords) {
      if (change.changeDescription.toLowerCase().includes(word)) {
        issues.push(`Value word "${word}" found in change description`);
      }
    }
  }
  
  // Check limitations exist
  if (!report.limitations?.length) {
    issues.push('Missing limitations section');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 4. PRESENTATION FORM (AVANZA / SPOTIFY INSPIRATION)
// =============================================================================

export const PRESENTATION_UX = {
  principles: [
    'sequential scroll',
    'clear chapters',
    'calm animation',
    'no effects that imply valuation',
  ],
  
  tone: [
    'factual',
    'neutral',
    'easy to absorb',
    'never peppy',
  ],
  
  graphics: {
    transitions: 'soft between views',
    focus: 'comparison, not performance',
    color_theme: 'government blue + neutral',
  },
  
  animation: {
    timing_ms: { min: 200, max: 400 },
    easing: 'ease-out',
    no_bounce: true,
    no_celebration: true,
  },
};

// =============================================================================
// 5. GLOBE & MAP VIEW
// =============================================================================

export const GLOBE_RULES = {
  must_be: ['slow', 'clear', 'never dominant'],
  
  used_for: [
    'comparisons',
    'overview',
    'pattern recognition',
  ],
  
  never_for: [
    'drama',
    'storytelling',
    'heat maps without context',
  ],
  
  all_colors_require: [
    'scale',
    'legend',
    'time filter',
  ],
  
  default_state: {
    rotation: 'stopped',
    zoom: 'overview',
    animation: 'none until user initiated',
  },
};

export interface GlobeViewConfig {
  hasScale: boolean;
  hasLegend: boolean;
  hasTimeFilter: boolean;
  isSlow: boolean;
  isNotDominant: boolean;
  noAutoRotation: boolean;
  noDrama: boolean;
}

export function validateGlobeView(config: GlobeViewConfig): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!config.hasScale) issues.push('Globe missing scale');
  if (!config.hasLegend) issues.push('Globe missing legend');
  if (!config.hasTimeFilter) issues.push('Globe missing time filter');
  if (!config.isSlow) issues.push('Globe too fast');
  if (!config.isNotDominant) issues.push('Globe is dominant (should be subtle)');
  if (!config.noAutoRotation) issues.push('Globe has auto-rotation');
  if (!config.noDrama) issues.push('Globe has dramatic elements');
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 6. RANKINGS (EXTREMELY SENSITIVE - HARD RULES)
// =============================================================================

export const RANKING_RULES = {
  may_only_show: [
    'ranking on a single indicator',
    'clear time period',
    'clear definition',
  ],
  
  may_not: [
    'combine into total score',
    'use words like best/worst',
    'imply quality or value',
  ],
  
  standard_header: 'Relative position by indicator (no overall assessment)',
  
  forbidden_words: [
    'best',
    'worst',
    'top performer',
    'bottom performer',
    'winner',
    'loser',
    'leader',
    'laggard',
    'champion',
    'failure',
  ],
  
  allowed_words: [
    'highest value',
    'lowest value',
    'above median',
    'below median',
    'relative position',
    'rank',
  ],
};

export interface RankingDisplay {
  indicatorCode: string;
  indicatorName: string;
  timePeriod: { start: string; end: string };
  definition: string;
  rankings: {
    entityCode: string;
    entityName: string;
    value: number;
    rank: number;
  }[];
  header: string;
  isSingleIndicator: boolean;
  noCompositeScore: boolean;
}

export function validateRanking(ranking: RankingDisplay): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!ranking.isSingleIndicator) {
    issues.push('Rankings must be for single indicator only');
  }
  
  if (!ranking.noCompositeScore) {
    issues.push('Composite scores are forbidden');
  }
  
  if (!ranking.definition) {
    issues.push('Missing indicator definition');
  }
  
  // Check header for forbidden words
  for (const word of RANKING_RULES.forbidden_words) {
    if (ranking.header.toLowerCase().includes(word)) {
      issues.push(`Forbidden word in header: "${word}"`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 7. "OVERALL ASSESSMENTS" - STRICT DEFINITION
// =============================================================================

export const ASSESSMENT_RULES = {
  definition: 'Summary of observed patterns and comparisons.',
  
  never_means: [
    'recommendation',
    'valuation',
    'suggestion',
  ],
  
  allowed_language: [
    'shows',
    'indicates',
    'has changed relative to',
    'observed',
    'measured',
  ],
  
  forbidden_language: [
    'suggests that we should',
    'points to the need for',
    'requires action',
    'must be addressed',
    'clearly needs',
  ],
};

export function validateAssessmentLanguage(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  for (const forbidden of ASSESSMENT_RULES.forbidden_language) {
    if (text.toLowerCase().includes(forbidden)) {
      issues.push(`Forbidden phrase: "${forbidden}"`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 8. SELF-IMPROVING SYSTEM (META)
// =============================================================================

export const SELF_IMPROVEMENT_LOOPS = {
  internal_loops_for: [
    'UX feedback',
    'misunderstanding analysis',
    'click depth analysis',
    'where users get stuck',
  ],
  
  ai_used_for: [
    'suggest simplification',
    'identify ambiguity',
    'point out overload',
  ],
  
  ai_may_not: [
    'optimize engagement',
    'increase stickiness',
    'amplify emotion',
  ],
};

export interface SelfImprovementMetrics {
  viewId: string;
  period: { start: string; end: string };
  
  uxFeedback: {
    satisfactionScore: number;
    confusionPoints: string[];
  };
  
  misunderstandings: {
    type: string;
    frequency: number;
    suggestedFix: string;
  }[];
  
  clickDepth: {
    averageDepth: number;
    dropOffPoints: string[];
  };
  
  stuckPoints: {
    element: string;
    avgTimeSpent: number;
    exitRate: number;
  }[];
}

export function analyzeForSimplification(metrics: SelfImprovementMetrics): {
  suggestions: string[];
  ambiguities: string[];
  overloadAreas: string[];
} {
  const suggestions: string[] = [];
  const ambiguities: string[] = [];
  const overloadAreas: string[] = [];
  
  // High confusion = ambiguity
  if (metrics.uxFeedback.confusionPoints.length > 0) {
    ambiguities.push(...metrics.uxFeedback.confusionPoints);
  }
  
  // High drop-off = overload
  for (const point of metrics.clickDepth.dropOffPoints) {
    overloadAreas.push(`High drop-off at: ${point}`);
  }
  
  // Long time spent = stuck = needs simplification
  for (const stuck of metrics.stuckPoints) {
    if (stuck.avgTimeSpent > 30) { // seconds
      suggestions.push(`Simplify: ${stuck.element} (avg ${stuck.avgTimeSpent}s spent)`);
    }
  }
  
  return { suggestions, ambiguities, overloadAreas };
}

// =============================================================================
// 9. GENERATIVE USER SUPPORT
// =============================================================================

export const GENERATIVE_SUPPORT = {
  presentation: {
    type: 'yellow explanation box',
    style: ['short', 'fact-based', 'clickable for depth', 'dismissible'],
  },
  
  mandatory_prefix: 'Based on the data shown here…',
  
  content_rules: [
    'factual only',
    'no opinion',
    'no recommendation',
    'always link to source',
  ],
};

export interface ExplanationBox {
  content: string;
  sourceLinks: string[];
  isDismissible: boolean;
  isClickableForDepth: boolean;
  startsWithPrefix: boolean;
}

export function validateExplanationBox(box: ExplanationBox): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!box.startsWithPrefix) {
    issues.push('Must start with "Based on the data shown here…"');
  }
  
  if (!box.isDismissible) {
    issues.push('Explanation box must be dismissible');
  }
  
  if (!box.isClickableForDepth) {
    issues.push('Explanation box must be clickable for more depth');
  }
  
  if (!box.sourceLinks?.length) {
    issues.push('Missing source links');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 10. CONSISTENCY OVER TIME (CRITICAL)
// =============================================================================

export const TEMPORAL_CONSISTENCY = {
  principle: 'Year in Review for 2026 must feel the same as 2032.',
  
  requirements: [
    'same structure',
    'same language',
    'same UX logic',
  ],
  
  goal: 'The system must age well.',
  
  versioning: {
    structure_version: '1.0',
    language_version: '1.0',
    ux_version: '1.0',
  },
};

// =============================================================================
// 11. FINAL TEST - REALITY CHECK
// =============================================================================

export const GENERATIVE_VIEW_TEST = {
  questions: [
    'Would this work in an annual report?',
    'Could this be quoted without misinterpretation?',
    'Would this feel reasonable to someone who disagrees?',
  ],
  
  if_all_yes: 'approved',
};

export interface GenerativeViewApproval {
  viewId: string;
  worksInAnnualReport: boolean;
  canBeQuotedSafely: boolean;
  reasonableToDisagreers: boolean;
  approved: boolean;
}

export function evaluateGenerativeView(params: Omit<GenerativeViewApproval, 'approved'>): GenerativeViewApproval {
  const approved = 
    params.worksInAnnualReport &&
    params.canBeQuotedSafely &&
    params.reasonableToDisagreers;
  
  return { ...params, approved };
}

// =============================================================================
// MANTRA
// =============================================================================

export const GENERATIVE_MANTRA = {
  text: 'Summarize reality. Never decorate it.',
  
  words: ['summarize', 'reality', 'never', 'decorate'],
};

// =============================================================================
// COMPLETE GENERATIVE AUDIT PIPELINE
// =============================================================================

export interface FullGenerativeAudit {
  timestamp: string;
  viewId: string;
  
  aiUsageValid: { valid: boolean; issues: string[] };
  generativeOutputValid: { valid: boolean; issues: string[] };
  yearInReviewValid: { valid: boolean; issues: string[] } | null;
  globeViewValid: { valid: boolean; issues: string[] } | null;
  rankingValid: { valid: boolean; issues: string[] } | null;
  assessmentLanguageValid: { valid: boolean; issues: string[] };
  explanationBoxValid: { valid: boolean; issues: string[] } | null;
  viewApproval: GenerativeViewApproval;
  
  overallApproved: boolean;
  allIssues: string[];
}

export function runFullGenerativeAudit(params: {
  viewId: string;
  aiUsages: string[];
  generativeOutput?: GenerativeOutput;
  yearInReview?: YearInReviewReport;
  globeView?: GlobeViewConfig;
  ranking?: RankingDisplay;
  assessmentTexts: string[];
  explanationBox?: ExplanationBox;
  viewApprovalParams: Omit<GenerativeViewApproval, 'approved'>;
}): FullGenerativeAudit {
  const allIssues: string[] = [];
  
  // AI usage validation
  const aiIssues: string[] = [];
  for (const usage of params.aiUsages) {
    const result = validateAIUsage(usage);
    if (!result.valid && result.reason) aiIssues.push(result.reason);
  }
  allIssues.push(...aiIssues);
  
  // Generative output validation
  const generativeOutputValid = params.generativeOutput
    ? validateGenerativeOutput(params.generativeOutput)
    : { valid: true, issues: [] };
  allIssues.push(...generativeOutputValid.issues);
  
  // Year in review validation
  const yearInReviewValid = params.yearInReview
    ? validateYearInReview(params.yearInReview)
    : null;
  if (yearInReviewValid && !yearInReviewValid.valid) {
    allIssues.push(...yearInReviewValid.issues);
  }
  
  // Globe view validation
  const globeViewValid = params.globeView
    ? validateGlobeView(params.globeView)
    : null;
  if (globeViewValid && !globeViewValid.valid) {
    allIssues.push(...globeViewValid.issues);
  }
  
  // Ranking validation
  const rankingValid = params.ranking
    ? validateRanking(params.ranking)
    : null;
  if (rankingValid && !rankingValid.valid) {
    allIssues.push(...rankingValid.issues);
  }
  
  // Assessment language validation
  const assessmentIssues: string[] = [];
  for (const text of params.assessmentTexts) {
    const result = validateAssessmentLanguage(text);
    assessmentIssues.push(...result.issues);
  }
  allIssues.push(...assessmentIssues);
  
  // Explanation box validation
  const explanationBoxValid = params.explanationBox
    ? validateExplanationBox(params.explanationBox)
    : null;
  if (explanationBoxValid && !explanationBoxValid.valid) {
    allIssues.push(...explanationBoxValid.issues);
  }
  
  // View approval
  const viewApproval = evaluateGenerativeView(params.viewApprovalParams);
  
  const overallApproved = allIssues.length === 0 && viewApproval.approved;
  
  return {
    timestamp: new Date().toISOString(),
    viewId: params.viewId,
    aiUsageValid: { valid: aiIssues.length === 0, issues: aiIssues },
    generativeOutputValid,
    yearInReviewValid,
    globeViewValid,
    rankingValid,
    assessmentLanguageValid: { valid: assessmentIssues.length === 0, issues: assessmentIssues },
    explanationBoxValid,
    viewApproval,
    overallApproved,
    allIssues,
  };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export const GENERATIVE_LAYER_VERSION = '1.0.0';

export const GENERATIVE_LAYER_SUMMARY = {
  role: PRINCIPAL_ARCHITECT_ROLE,
  goal: PRESENTATION_GOAL,
  aiReadiness: AI_READINESS,
  corePresentation: GENERATIVE_PRESENTATION_CORE,
  geographicLevels: GEOGRAPHIC_LEVELS,
  yearInReview: YEAR_IN_REVIEW_STRUCTURE,
  uxRules: PRESENTATION_UX,
  globeRules: GLOBE_RULES,
  rankingRules: RANKING_RULES,
  assessmentRules: ASSESSMENT_RULES,
  selfImprovement: SELF_IMPROVEMENT_LOOPS,
  generativeSupport: GENERATIVE_SUPPORT,
  temporalConsistency: TEMPORAL_CONSISTENCY,
  finalTest: GENERATIVE_VIEW_TEST,
  mantra: GENERATIVE_MANTRA,
};
