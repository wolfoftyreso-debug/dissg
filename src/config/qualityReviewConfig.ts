/**
 * 🧠 MASTER EXECUTION BLOCK 52
 * 
 * DESIGN, UX, PERFORMANCE & LEARNING LOOP
 * 
 * Hard review mode configuration.
 * Lock quality before building more.
 * 
 * CORE RULE:
 * If something needs explanation → it's too complicated.
 */

// ============================================================
// DESIGN PHILOSOPHY (LOCKED)
// ============================================================

export const DESIGN_PHILOSOPHY = {
  /** Core feeling targets */
  mustFeel: [
    'authoritative',  // myndig
    'calm',           // lugn
    'self-evident',   // självklar
  ] as const,
  
  /** Forbidden feelings */
  mustNotFeel: [
    'impressive',     // ska aldrig imponera
    'distracting',    // ska aldrig distrahera
    'clever',         // ska aldrig kännas smart
    'trendy',         // ska aldrig följa trender
  ] as const,
  
  /** The goal */
  goal: 'Trust, not engagement.',
  
  /** Removal test */
  removalTest: 'Can this be removed without reducing truth value? If yes → remove.',
} as const;

// ============================================================
// TTI (TIME TO INSIGHT) TARGETS
// ============================================================

export const TTI_TARGETS = {
  /** Desktop: max 5 seconds to first meaningful insight */
  desktop: 5000,
  /** Mobile: max 7 seconds to first meaningful insight */
  mobile: 7000,
  /** Anything over this = friction */
  maxAcceptable: 7000,
} as const;

export const CLICK_TARGETS = {
  /** Max clicks to reach facts */
  toFacts: 2,
  /** Max clicks to reach source */
  toSource: 2,
  /** Max clicks to reach method */
  toMethod: 3,
  /** Max clicks to reach uncertainty info */
  toUncertainty: 2,
} as const;

// ============================================================
// UX CRITICAL FLOWS
// ============================================================

export interface UXFlow {
  id: string;
  name: string;
  description: string;
  steps: string[];
  maxClicks: number;
  maxSeconds: number;
}

export const CRITICAL_FLOWS: UXFlow[] = [
  {
    id: 'understand',
    name: 'I want to understand',
    description: 'User wants a quick understanding of a topic',
    steps: [
      'Land on page',
      'See data status',
      'Read summary',
      'See sources',
    ],
    maxClicks: 1,
    maxSeconds: 10,
  },
  {
    id: 'verify',
    name: 'I want to verify',
    description: 'User wants to check the data and methodology',
    steps: [
      'Land on page',
      'Show data',
      'View method',
      'See uncertainty',
    ],
    maxClicks: 2,
    maxSeconds: 15,
  },
  {
    id: 'explore',
    name: 'I want to explore deeper',
    description: 'User wants to understand related patterns',
    steps: [
      'Land on page',
      'Click indicator',
      'View history',
      'See related facts',
    ],
    maxClicks: 3,
    maxSeconds: 20,
  },
];

// ============================================================
// PERFORMANCE REQUIREMENTS (NON-NEGOTIABLE)
// ============================================================

export const PERFORMANCE_REQUIREMENTS = {
  /** HTML response size limit */
  htmlSizeKb: 30,
  /** Time to first byte */
  ttfbMs: 100,
  /** Cumulative layout shift */
  cls: 0,
  /** Render-blocking resources */
  renderBlockers: 0,
  /** JS required for content */
  jsRequiredForContent: false,
} as const;

// ============================================================
// GOOGLE-FIRST CHECKLIST
// ============================================================

export interface SEOCheckItem {
  id: string;
  check: string;
  severity: 'critical' | 'warning' | 'info';
}

export const SEO_CHECKLIST: SEOCheckItem[] = [
  { id: 'single-h1', check: 'Exactly 1 H1 per page', severity: 'critical' },
  { id: 'h2-structure', check: 'Correct H2 hierarchy', severity: 'critical' },
  { id: 'no-empty-headings', check: 'No empty headings', severity: 'critical' },
  { id: 'canonical', check: 'Correct canonical URL', severity: 'critical' },
  { id: 'schema-valid', check: 'Schema.org validates', severity: 'critical' },
  { id: 'unique-titles', check: 'No duplicate titles', severity: 'warning' },
  { id: 'no-keyword-stuffing', check: 'No over-optimized text', severity: 'warning' },
  { id: 'meta-description', check: 'Meta description < 160 chars', severity: 'info' },
  { id: 'title-length', check: 'Title < 60 chars', severity: 'info' },
];

// ============================================================
// TEXT QUALITY RULES
// ============================================================

/** Phrases that should be replaced with clearer alternatives */
export const TEXT_REPLACEMENTS: Record<string, string> = {
  // Academic → Clinical
  'may indicate': 'observed data shows',
  'it appears that': 'data shows',
  'it is possible that': 'in some cases',
  'one might argue': '[remove - no arguments]',
  'it could be said': '[remove - just say it]',
  'in terms of': 'for',
  'with respect to': 'for',
  'in order to': 'to',
  'due to the fact that': 'because',
  'at this point in time': 'now',
  'in the event that': 'if',
  'prior to': 'before',
  'subsequent to': 'after',
  'in the context of': 'in',
  'with regard to': 'about',
  'a number of': 'some',
  'the majority of': 'most',
  'a significant number': 'many',
  'it is important to note': '[remove - just state it]',
  'it should be noted': '[remove - just state it]',
  'needless to say': '[remove - then don\'t say it]',
};

/** Passive voice patterns to flag */
export const PASSIVE_VOICE_PATTERNS = [
  /\b(is|are|was|were|been|being)\s+\w+ed\b/gi,
  /\b(is|are|was|were)\s+being\s+\w+ed\b/gi,
];

/** Maximum sentence length (words) */
export const MAX_SENTENCE_LENGTH = 20;

/** Maximum paragraph length (sentences) */
export const MAX_PARAGRAPH_LENGTH = 4;

// ============================================================
// QUALITY GATE REQUIREMENTS
// ============================================================

export interface QualityGate {
  id: string;
  requirement: string;
  test: string;
  blocking: boolean;
}

export const QUALITY_GATES: QualityGate[] = [
  {
    id: 'non-expert-understands',
    requirement: 'Non-expert understands the summary',
    test: 'Show to someone outside the field. Can they explain it back?',
    blocking: true,
  },
  {
    id: 'no-interpretation-room',
    requirement: 'Zero interpretation room',
    test: 'Can two people read this and reach different conclusions?',
    blocking: true,
  },
  {
    id: 'uncertainty-clear',
    requirement: 'Uncertainty is obvious',
    test: 'Is the confidence level visible within 2 seconds?',
    blocking: true,
  },
  {
    id: 'no-unsupported-conclusions',
    requirement: 'No unsupported conclusions possible',
    test: 'Does the text allow any claim not backed by shown data?',
    blocking: true,
  },
  {
    id: 'loads-fast',
    requirement: 'Page loads instantly',
    test: 'TTFB < 100ms, HTML < 30KB',
    blocking: true,
  },
  {
    id: 'no-instructions-needed',
    requirement: 'No instructions needed',
    test: 'Can a new user navigate without any guidance?',
    blocking: false,
  },
];

// ============================================================
// LOGGING EVENTS (LEARNING LOOP)
// ============================================================

export type UserBehaviorEvent =
  | 'page_view'
  | 'fact_click'
  | 'source_open'
  | 'indicator_click'
  | 'show_data_click'
  | 'back_navigation'
  | 'scroll_depth'
  | 'time_on_page'
  | 'exit';

export interface BehaviorLog {
  event: UserBehaviorEvent;
  pageId: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// ============================================================
// WEEKLY FEEDBACK LOOP
// ============================================================

export const WEEKLY_REVIEW_CHECKLIST = [
  'Summarize what users actually do (from logs)',
  'Identify where users get stuck (high back-navigation)',
  'Simplify problematic areas',
  'Deploy changes',
  'Measure impact',
] as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Check text for quality issues
 */
export function analyzeTextQuality(text: string): {
  issues: string[];
  suggestions: string[];
  score: number;
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check for replaceable phrases
  for (const [phrase, replacement] of Object.entries(TEXT_REPLACEMENTS)) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(`Found "${phrase}"`);
      suggestions.push(`Replace with: ${replacement}`);
      score -= 5;
    }
  }

  // Check sentence length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  for (const sentence of sentences) {
    const wordCount = sentence.trim().split(/\s+/).length;
    if (wordCount > MAX_SENTENCE_LENGTH) {
      issues.push(`Sentence too long: ${wordCount} words`);
      suggestions.push('Break into shorter sentences');
      score -= 3;
    }
  }

  // Check for passive voice
  for (const pattern of PASSIVE_VOICE_PATTERNS) {
    const matches = text.match(pattern);
    if (matches && matches.length > 2) {
      issues.push(`Passive voice detected (${matches.length} instances)`);
      suggestions.push('Convert to active voice where possible');
      score -= 2;
    }
  }

  return {
    issues,
    suggestions,
    score: Math.max(0, score),
  };
}

/**
 * Check if page meets performance requirements
 */
export function checkPerformance(metrics: {
  htmlSizeKb: number;
  ttfbMs: number;
  cls: number;
  renderBlockers: number;
}): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  if (metrics.htmlSizeKb > PERFORMANCE_REQUIREMENTS.htmlSizeKb) {
    failures.push(`HTML size ${metrics.htmlSizeKb}KB > ${PERFORMANCE_REQUIREMENTS.htmlSizeKb}KB limit`);
  }
  if (metrics.ttfbMs > PERFORMANCE_REQUIREMENTS.ttfbMs) {
    failures.push(`TTFB ${metrics.ttfbMs}ms > ${PERFORMANCE_REQUIREMENTS.ttfbMs}ms limit`);
  }
  if (metrics.cls > PERFORMANCE_REQUIREMENTS.cls) {
    failures.push(`CLS ${metrics.cls} > ${PERFORMANCE_REQUIREMENTS.cls} limit`);
  }
  if (metrics.renderBlockers > PERFORMANCE_REQUIREMENTS.renderBlockers) {
    failures.push(`${metrics.renderBlockers} render-blocking resources`);
  }

  return {
    passed: failures.length === 0,
    failures,
  };
}

/**
 * Log user behavior event
 */
export function createBehaviorLog(
  event: UserBehaviorEvent,
  pageId: string,
  metadata?: Record<string, unknown>
): BehaviorLog {
  return {
    event,
    pageId,
    timestamp: Date.now(),
    metadata,
  };
}
