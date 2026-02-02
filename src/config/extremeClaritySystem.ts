/**
 * 🧭 EXTREME CLARITY SYSTEM
 * 
 * KARTOR · DJUP · KLICKBAR FÖRSTÅELSE · ZERO AMBIGUITY
 * 
 * Core Principle (locked):
 * - No object may exist without being explainable
 * - No word may be shown without being clickable
 * - No diagram may be shown without being decomposable
 */

// ============================================
// KNOWLEDGE OBJECT STRUCTURE
// ============================================

/**
 * Every UI element must have this structure.
 * If something cannot fulfill this → remove it.
 */
export interface KnowledgeObject {
  id: string;
  explains: string;           // What this element explains
  measures: string | null;    // What it measures (if applicable)
  source: string[];           // Data sources
  limitations: string[];      // What it doesn't show
  deeper_levels: DeepLevel[]; // Clickable depth
  
  // Metadata
  created_at: string;
  version: number;
  
  // For SEO
  url: string;
  question: string;           // The question this answers
}

export interface DeepLevel {
  level: 1 | 2 | 3 | 4 | 5;
  name: 'observation' | 'definition' | 'method' | 'limitation' | 'data';
  content: string;
  sources: string[];
  url: string;
}

// ============================================
// DEPTH LEVELS (Always the same everywhere)
// ============================================

export const DEPTH_LEVELS = {
  1: {
    name: 'observation',
    label: 'What do I see?',
    labelSv: 'Vad ser jag?',
    description: 'The immediate observation',
  },
  2: {
    name: 'definition', 
    label: 'What does it mean?',
    labelSv: 'Vad betyder det?',
    description: 'Clear definition of terms',
  },
  3: {
    name: 'method',
    label: 'How is it calculated?',
    labelSv: 'Hur räknas det?',
    description: 'Methodology and sources',
  },
  4: {
    name: 'limitation',
    label: 'What is missing?',
    labelSv: 'Vad saknas?',
    description: 'Limitations and caveats',
  },
  5: {
    name: 'data',
    label: 'Can I verify?',
    labelSv: 'Kan jag verifiera?',
    description: 'Raw data and API access',
  },
} as const;

export type DepthLevel = keyof typeof DEPTH_LEVELS;

// ============================================
// MAP CLICK HIERARCHY
// ============================================

export const MAP_CLICK_HIERARCHY = {
  click1: {
    name: 'whatDoISee',
    label: 'What do I see?',
    template: 'This color represents {measure}, aggregated from {sources}, for {period}.',
  },
  click2: {
    name: 'howIsItCalculated',
    label: 'How is this calculated?',
    shows: ['indicators', 'dataSources', 'aggregationLogic'],
  },
  click3: {
    name: 'limitations',
    label: 'Limitations',
    shows: ['whatMapDoesNotShow', 'whatCanBeMisinterpreted'],
  },
  click4: {
    name: 'rawData',
    label: 'Raw data',
    shows: ['table', 'api', 'versions'],
  },
} as const;

// ============================================
// MAP RULES (Absolute)
// ============================================

export const MAP_RULES = {
  forbidden: [
    'decorative maps',
    'colors without legend',
    'hover info without click depth',
    'single values from multiple sources',
  ],
  required: [
    'legend with exact definition',
    'click depth to level 4',
    'source attribution per data point',
    'uncertainty visualization',
  ],
} as const;

// ============================================
// NUMBER CLICK REQUIREMENTS
// ============================================

/**
 * Every number shown must answer these on click
 */
export const NUMBER_CLICK_REQUIREMENTS = [
  'What is measured?',
  'Compared to what?',
  'Over what time period?',
  'Is it absolute or relative?',
  'Is it certain?',
] as const;

// ============================================
// BREADCRUMB STRUCTURE (Obligatory)
// ============================================

export const BREADCRUMB_LEVELS = [
  'world',
  'region', 
  'country',
  'indicator',
  'method',
  'data',
] as const;

export type BreadcrumbLevel = typeof BREADCRUMB_LEVELS[number];

export interface BreadcrumbItem {
  level: BreadcrumbLevel;
  label: string;
  labelSv: string;
  url: string;
  isActive: boolean;
}

// ============================================
// QUESTION-BASED NAVIGATION (Not domain-based)
// ============================================

/**
 * Wrong: "Economy", "Health", "Education"
 * Right: "How is life expectancy developing?"
 */
export const NAVIGATION_STRUCTURE = {
  principle: 'Questions are the interface. Domains are metadata.',
  
  wrongApproach: [
    'Economy',
    'Health', 
    'Education',
    'Environment',
  ],
  
  rightApproach: [
    'How is life expectancy developing?',
    'How is the dependency ratio changing?',
    'How is energy dependence changing?',
    'How is employment structure changing?',
  ],
} as const;

// ============================================
// AHA-TEST
// ============================================

/**
 * For every new view, map, button:
 * 
 * Can a smart, curious person say
 * "aha, okay, now I understand exactly"
 * without guessing?
 * 
 * If no:
 * - explain more
 * - split up
 * - add a click layer
 */
export function runAhaTest(element: {
  content: string;
  hasExplanation: boolean;
  hasClickDepth: boolean;
  hasSource: boolean;
  hasLimitations: boolean;
}): {
  passed: boolean;
  failures: string[];
  suggestions: string[];
} {
  const failures: string[] = [];
  const suggestions: string[] = [];
  
  if (!element.hasExplanation) {
    failures.push('No explanation provided');
    suggestions.push('Add inline explanation');
  }
  
  if (!element.hasClickDepth) {
    failures.push('No click depth');
    suggestions.push('Add depth levels 1-5');
  }
  
  if (!element.hasSource) {
    failures.push('No source attribution');
    suggestions.push('Add source with link');
  }
  
  if (!element.hasLimitations) {
    failures.push('No limitations stated');
    suggestions.push('Add "what this does not show"');
  }
  
  return {
    passed: failures.length === 0,
    failures,
    suggestions,
  };
}

// ============================================
// MULTI-SOURCE AGGREGATION RULES
// ============================================

export const AGGREGATION_RULES = {
  neverShow: 'single value from multiple sources',
  
  mustShow: [
    'range (min-max)',
    'mean with confidence',
    'source per data point',
  ],
  
  clickDepth: {
    clickOnValue: 'Which sources?',
    clickOnSource: 'How does it differ?',
    clickOnDifference: 'Why?',
  },
  
  principle: 'Disagreement in data is information, not a problem.',
} as const;

// ============================================
// GOOGLE-FRIENDLY RULES
// ============================================

export const GOOGLE_RULES = {
  perPage: {
    oneQuestion: true,
    oneAnswer: true,
    clearLimitations: true,
    stableUrl: true,
    internalLinksAsEvidenceChain: true,
  },
  
  internalRule: 'If a journalist can misquote the page → the page is too unclear.',
} as const;

// ============================================
// VALIDATION: Can this element exist?
// ============================================

export function validateElementExists(element: Partial<KnowledgeObject>): {
  canExist: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (!element.explains) missing.push('explains');
  if (!element.source || element.source.length === 0) missing.push('source');
  if (!element.deeper_levels || element.deeper_levels.length === 0) missing.push('deeper_levels');
  
  return {
    canExist: missing.length === 0,
    missing,
  };
}

// ============================================
// CORE PRINCIPLE (This is the essence)
// ============================================

export const CORE_PRINCIPLE = {
  statement: `
    You are not building a service.
    You are building a mental skeleton for reality.
    
    Everything that does not:
    - explain
    - can be clicked
    - can be deepened
    - can be verified
    
    ...has no right to exist.
  `,
  
  validator: (element: Partial<KnowledgeObject>) => {
    const checks = {
      explains: !!element.explains,
      clickable: (element.deeper_levels?.length ?? 0) > 0,
      deepenable: (element.deeper_levels?.length ?? 0) >= 3,
      verifiable: (element.source?.length ?? 0) > 0,
    };
    
    const allPass = Object.values(checks).every(Boolean);
    
    return {
      hasRightToExist: allPass,
      checks,
    };
  },
} as const;
