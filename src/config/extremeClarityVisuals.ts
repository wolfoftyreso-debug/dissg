/**
 * 📊 EXTREME CLARITY VISUAL SYSTEM
 * 
 * GRAFER · RAPPORTER · ÅRSSAMMANFATTNINGAR · GLOBAL JÄMFÖRBARHET
 * 
 * Core Principle (locked):
 * A graph must be understood correctly in 3 seconds –
 * and fully explained in 3 clicks.
 * If not → the graph is wrong.
 */

// ============================================
// GRAPH RULES (Non-negotiable)
// ============================================

export const GRAPH_RULES = {
  /**
   * 1.1 One graph = one question
   */
  fundamental: {
    oneQuestion: 'Every graph answers exactly ONE question',
    noOverview: 'Never "overview graphs" that try to show everything',
    noMultipleMessages: 'Never multiple messages in the same graph',
  },

  /**
   * 1.2 Mandatory elements (always)
   */
  mandatoryElements: [
    'whatIsMeasured',      // Not just label, but definition
    'comparedToWhat',      // Time, average, baseline
    'uncertainty',         // Interval, source, method
    'whatThisDoesNotMean', // Critical for avoiding misinterpretation
  ] as const,

  /**
   * 1.3 Visual rules (non-negotiable)
   */
  visualRules: {
    maxOneColorPerVariable: true,
    grayForHistory: true,
    colorForFocus: true,
    never3D: true,
    neverDualAxes: true,
    neverLogScaleWithoutWarning: true,
  },

  /**
   * Allowed narrative markers (factual only)
   */
  allowedMarkers: [
    'Policy X introduced here',
    'Data source changed here',
    'Trend shift observed',
    'Methodology changed',
    'Definition updated',
  ] as const,

  /**
   * Forbidden language
   */
  forbiddenLanguage: [
    'This shows that...',
    'This is because...',
    'This proves...',
    'Clearly...',
    'Obviously...',
    'This means...',
  ] as const,
} as const;

// ============================================
// GRAPH DEPTH STRUCTURE
// ============================================

export interface GraphDepthLevel {
  level: 1 | 2 | 3 | 4;
  name: 'explanation' | 'method' | 'limitations' | 'rawData';
  label: string;
  labelSv: string;
  content: string[];
}

export const GRAPH_DEPTH_LEVELS: Record<1 | 2 | 3 | 4, Omit<GraphDepthLevel, 'content'>> = {
  1: {
    level: 1,
    name: 'explanation',
    label: 'What do I see?',
    labelSv: 'Vad ser jag?',
  },
  2: {
    level: 2,
    name: 'method',
    label: 'How is it calculated?',
    labelSv: 'Hur räknas det?',
  },
  3: {
    level: 3,
    name: 'limitations',
    label: 'What is missing?',
    labelSv: 'Vad saknas?',
  },
  4: {
    level: 4,
    name: 'rawData',
    label: 'Raw data',
    labelSv: 'Rådata',
  },
};

// ============================================
// ANNUAL REPORT STRUCTURE ("COUNTRY WRAPPED")
// ============================================

export interface AnnualReportSection {
  id: string;
  type: 'opening' | 'timeline' | 'comparison' | 'changes' | 'stable' | 'limitations';
  title: string;
  titleSv: string;
  required: boolean;
}

export const ANNUAL_REPORT_SECTIONS: AnnualReportSection[] = [
  {
    id: 'opening',
    type: 'opening',
    title: 'This is how it went',
    titleSv: 'Så gick det',
    required: true,
  },
  {
    id: 'timeline',
    type: 'timeline',
    title: "Year's curve",
    titleSv: 'Årets kurva',
    required: true,
  },
  {
    id: 'comparison',
    type: 'comparison',
    title: 'Comparison',
    titleSv: 'Jämförelse',
    required: true,
  },
  {
    id: 'most-changed',
    type: 'changes',
    title: 'What changed most',
    titleSv: 'Vad förändrades mest',
    required: true,
  },
  {
    id: 'stable',
    type: 'stable',
    title: 'What stayed the same',
    titleSv: 'Vad låg still',
    required: true,
  },
  {
    id: 'limitations',
    type: 'limitations',
    title: 'What the data does not say',
    titleSv: 'Vad datan inte säger',
    required: true,
  },
];

// ============================================
// COMPARISON RULES
// ============================================

export const COMPARISON_RULES = {
  /**
   * User can select 2-5 countries/cities
   */
  selectionLimits: {
    min: 2,
    max: 5,
  },

  /**
   * Requirements for valid comparison
   */
  requirements: {
    sameScale: true,
    sameTimePeriod: true,
    sameMethod: true,
    sameDefinition: true,
  },

  /**
   * System must block these comparisons
   */
  mustBlock: [
    'Different definitions',
    'Different time resolution',
    'Different methodology',
    'Incompatible units',
  ] as const,

  /**
   * Principle: Better to say "cannot compare" than show wrong
   */
  principle: 'Rather say "cannot compare" than show incorrect comparison',
} as const;

// ============================================
// GRAPH COLORS (Semantic, not decorative)
// ============================================

export const GRAPH_COLORS = {
  /**
   * Primary palette - functional meaning only
   */
  primary: {
    focus: 'hsl(var(--primary))',           // Current focus
    history: 'hsl(var(--muted-foreground))', // Historical data
    comparison: 'hsl(var(--secondary))',     // Comparison baseline
  },

  /**
   * Status colors - never for "good" or "bad"
   */
  status: {
    warning: 'hsl(var(--status-warning))',   // Only for data quality warnings
    dataGap: 'hsl(var(--status-neutral))',   // Missing data
    methodChange: 'hsl(var(--accent))',       // Methodology changed
  },

  /**
   * NEVER use for value judgments
   */
  forbidden: [
    'Green for "good"',
    'Red for "bad"',
    'Gradient for emphasis',
    'Multiple bright colors',
  ],
} as const;

// ============================================
// QUALITY VALIDATION
// ============================================

export interface GraphQualityCheck {
  id: string;
  question: string;
  questionSv: string;
  required: boolean;
}

export const GRAPH_QUALITY_CHECKS: GraphQualityCheck[] = [
  {
    id: 'understand-without-legend',
    question: 'Can it be understood without a legend?',
    questionSv: 'Kan den förstås utan förklaring?',
    required: true,
  },
  {
    id: 'cite-without-context',
    question: 'Can it be cited without context?',
    questionSv: 'Kan den citeras utan sammanhang?',
    required: true,
  },
  {
    id: 'political-misunderstanding',
    question: 'Can it be politically misunderstood?',
    questionSv: 'Kan den missförstås politiskt?',
    required: true,
  },
  {
    id: 'click-stops-misunderstanding',
    question: 'Is there a click that stops misunderstanding?',
    questionSv: 'Finns det ett klick som stoppar missförstånd?',
    required: true,
  },
];

/**
 * Validate a graph against quality checks
 */
export function validateGraphQuality(graph: {
  hasDefinition: boolean;
  hasComparison: boolean;
  hasUncertainty: boolean;
  hasLimitations: boolean;
  hasSingleQuestion: boolean;
  hasClickDepth: boolean;
}): {
  isValid: boolean;
  failures: string[];
  suggestions: string[];
} {
  const failures: string[] = [];
  const suggestions: string[] = [];

  if (!graph.hasDefinition) {
    failures.push('Missing definition of what is measured');
    suggestions.push('Add clickable definition explaining the metric');
  }

  if (!graph.hasComparison) {
    failures.push('Missing comparison baseline');
    suggestions.push('Add what this is compared to (time, average, baseline)');
  }

  if (!graph.hasUncertainty) {
    failures.push('Missing uncertainty indication');
    suggestions.push('Add confidence interval or data quality indicator');
  }

  if (!graph.hasLimitations) {
    failures.push('Missing limitations section');
    suggestions.push('Add "What this does not show" section');
  }

  if (!graph.hasSingleQuestion) {
    failures.push('Graph answers multiple questions');
    suggestions.push('Split into separate graphs, one question each');
  }

  if (!graph.hasClickDepth) {
    failures.push('Missing click depth (4 levels)');
    suggestions.push('Add clickable depth: Explanation → Method → Limitations → Raw Data');
  }

  return {
    isValid: failures.length === 0,
    failures,
    suggestions,
  };
}

// ============================================
// DESIGN PRINCIPLES
// ============================================

export const DESIGN_PRINCIPLES = {
  feel: 'Infrastructure, not media',
  
  rules: {
    noDistractingAnimation: true,
    noInterpretiveIllustrations: true,
    onlyDataAndStructure: true,
  },

  typography: {
    neutral: true,
    highContrast: true,
    consistentEverywhere: true,
  },

  essence: 'This is how the world is accounted for.',
} as const;

// ============================================
// REPORT URL STRUCTURE
// ============================================

export const REPORT_URL_PATTERNS = {
  countryAnnual: '/reports/{year}/{countryCode}',
  cityAnnual: '/reports/{year}/{countryCode}/{cityCode}',
  indicator: '/reports/{year}/{countryCode}/{indicatorCode}',
  comparison: '/compare/{indicatorCode}?entities={codes}',
} as const;

/**
 * Generate stable URL for a report
 */
export function generateReportUrl(
  type: 'country' | 'city' | 'indicator' | 'comparison',
  params: {
    year?: number;
    countryCode?: string;
    cityCode?: string;
    indicatorCode?: string;
    entities?: string[];
  }
): string {
  switch (type) {
    case 'country':
      return `/reports/${params.year}/${params.countryCode}`;
    case 'city':
      return `/reports/${params.year}/${params.countryCode}/${params.cityCode}`;
    case 'indicator':
      return `/reports/${params.year}/${params.countryCode}/${params.indicatorCode}`;
    case 'comparison':
      return `/compare/${params.indicatorCode}?entities=${params.entities?.join(',')}`;
    default:
      return '/reports';
  }
}
