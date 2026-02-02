/**
 * Simplification & Relevance Revision Configuration
 * 
 * Fewer choices, fewer words, more truths per second.
 * This is how you become the obvious first-hand source.
 */

// ============================================
// 1. STRUCTURE: LOCKED HIERARCHY
// ============================================

export const URL_HIERARCHY = {
  facts: '/facts/{domain}/{scope}/{location}/{time}',
  indicators: '/indicators/{domain}/{indicator}',
  questions: '/questions/{domain}/{question}',
  locations: '/locations/{country}/{region}/{municipality}',
  sources: '/sources/{source_id}',
  methods: '/methods/{method_id}',
  trustLog: '/trust-log/{entry_id}',
  cite: '/cite/{entity_type}/{entity_id}',
} as const;

export const MAX_NAVIGATION_DEPTH = 2; // Max clicks up (context) or down (evidence)

// ============================================
// 2. LINKING: STRICT RULES
// ============================================

export const LINK_RULES = {
  maxLinksPerPage: 12,
  
  // Only these link types allowed
  allowedLinkTypes: ['context', 'evidence', 'comparison'] as const,
  
  // FORBIDDEN patterns
  forbiddenPatterns: [
    'you might also like',
    'related articles',
    'see also',
    'read more about',
    'navigation in body text',
  ],
} as const;

export type LinkType = typeof LINK_RULES.allowedLinkTypes[number];

export interface SemanticLink {
  type: LinkType;
  url: string;
  label: string;
  reason: string; // WHY this link exists
}

// ============================================
// 3. CONTENT: TEXT REDUCTION RULES
// ============================================

export const CONTENT_RULES = {
  // Every sentence must either:
  validSentenceTypes: [
    'explains_what_data_shows',
    'explains_what_data_does_not_show',
    'describes_method',
    'describes_limitation',
  ] as const,
  
  // Length limits
  maxSummarySentences: 3,
  maxSectionLines: 5,
  
  // Forbidden patterns (remove these)
  forbiddenPatterns: [
    /detta är intressant eftersom/gi,
    /det är värt att notera/gi,
    /som vi kan se/gi,
    /enligt vår analys/gi,
    /i sammanhanget/gi,
    /ur ett perspektiv/gi,
    /i ljuset av/gi,
    /det bör påpekas/gi,
  ],
  
  // Clinical clarity > "correct" academic language
  textReductionTarget: 0.40, // Aim for 40% reduction
} as const;

// ============================================
// 4. DESIGN: PREDICTABILITY RULES
// ============================================

export const DESIGN_RULES = {
  // Core principles
  singlePrimaryColumn: true,
  strictHeadingHierarchy: true,
  noDecorativeElements: true,
  consistentLayoutPerPageType: true,
  
  // Remove these
  forbiddenElements: [
    'decorative separators',
    'spacing variations for feel',
    'icons without semantic meaning',
    'visual effects that dont carry information',
    'multiple column layouts for same content type',
  ],
  
  // Required elements per page
  requiredElements: {
    factPage: ['h1', 'summary', 'what_this_shows', 'what_this_does_not_show', 'data', 'sources'],
    indicatorPage: ['h1', 'definition', 'method', 'unit', 'data_availability'],
    questionPage: ['h1', 'ranking', 'why_ranked', 'underlying_indicators'],
    locationPage: ['h1', 'summary', 'key_indicators', 'comparison'],
  },
} as const;

// ============================================
// 5. GOOGLE: PERFECT ANSWER RULES
// ============================================

export const SEO_RULES = {
  // Each page answers exactly ONE question
  questionPatterns: [
    'How has {X} changed in {Y} over time?',
    'What does indicator {Z} measure?',
    'What data exists about {A} in {B}?',
    'What is the current {X} in {Y}?',
  ],
  
  // Checklist (all must be true)
  featuredSnippetChecklist: {
    answerInH1AndFirstParagraph: true,
    googleCanShowAsSnippet: true,
    aiCanCiteWithoutExplanation: true,
  },
  
  // Title rules
  titleRules: {
    format: '{fact} + {location} + {time}',
    maxLength: 60,
    noValueWords: true, // No "important", "key", "major"
  },
  
  // Description rules
  descriptionRules: {
    maxSentences: 1,
    format: '{what} + {where} + {time}',
    maxLength: 160,
  },
} as const;

// ============================================
// 6. METADATA: MINIMAL SCHEMA
// ============================================

export const SCHEMA_RULES = {
  // Only use these Schema.org types
  allowedSchemaTypes: [
    'Dataset',
    'StatisticalVariable', 
    'Observation',
    'BreadcrumbList',
  ] as const,
  
  // More schema ≠ better. Right schema = better.
  forbiddenSchemaTypes: [
    'Article',
    'WebPage', // too generic
    'Organization', // unless on about page
    'FAQ', // unless actual FAQ
  ],
} as const;

// ============================================
// 7. NAVIGATION: DATA-DRIVEN
// ============================================

export const NAVIGATION_RULES = {
  // Menus built by:
  menuCriteria: [
    'most_visited',
    'most_cited', 
    'most_current',
  ] as const,
  
  // NOT by:
  forbiddenMenuCriteria: [
    'what_you_think_is_important',
    'what_should_be_visible',
    'editorial_preference',
  ],
  
  // Menu is a mirror of usage, not a map
  maxTopLevelItems: 7,
  maxSecondLevelItems: 5,
} as const;

// ============================================
// 8. FACT LAYER REQUIREMENTS
// ============================================

export const FACT_LAYER_REQUIREMENTS = {
  // Must be true to be indispensable
  urlsAreStable: true,
  answersAreShort: true,
  limitationsAreClear: true,
  citationsAreReadyToUse: true,
  
  // Extra requirements
  citeEndpointFastest: true,
  methodsExtremelyShort: true,
  sourcesMachineReadable: true,
} as const;

// ============================================
// 9. SIMPLIFICATION CHECKLIST
// ============================================

export const SIMPLIFICATION_CHECKLIST = [
  { id: 'remove_section', question: 'Can we remove 1 section?', target: 1 },
  { id: 'remove_sentences', question: 'Can we remove 3 sentences?', target: 3 },
  { id: 'move_shows_up', question: 'Can we move "what this shows" up?', target: true },
  { id: 'move_not_shows_up', question: 'Can we move "what this does not show" up?', target: true },
  { id: 'remove_links', question: 'Can we remove 2 links?', target: 2 },
] as const;

// ============================================
// 10. DONE CRITERIA
// ============================================

export const SIMPLIFICATION_DONE_CRITERIA = [
  'Every page understood in 15 seconds',
  'Google can index without interpretation',
  'AI can cite without rewriting',
  'Users click less but learn more',
  'Site feels quiet, stable, and obvious',
] as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Validates if a sentence is allowed (references data, method, or limitation)
 */
export function isValidSentence(sentence: string): boolean {
  const dataPatterns = [
    /data visar/i, /data indicates/i, /observed/i, /measured/i,
    /ökade/i, /minskade/i, /increased/i, /decreased/i,
    /från \d/i, /from \d/i, /till \d/i, /to \d/i,
  ];
  
  const methodPatterns = [
    /metod/i, /method/i, /beräknas/i, /calculated/i,
    /källa/i, /source/i, /mäts/i, /measured by/i,
  ];
  
  const limitationPatterns = [
    /inte visar/i, /does not show/i, /begränsning/i, /limitation/i,
    /osäkerhet/i, /uncertainty/i, /exkluderar/i, /excludes/i,
  ];
  
  return (
    dataPatterns.some(p => p.test(sentence)) ||
    methodPatterns.some(p => p.test(sentence)) ||
    limitationPatterns.some(p => p.test(sentence))
  );
}

/**
 * Counts internal links on a page
 */
export function countInternalLinks(html: string): number {
  const linkPattern = /<a[^>]+href=["'][^"']*["'][^>]*>/gi;
  const matches = html.match(linkPattern) || [];
  return matches.filter(link => !link.includes('http')).length;
}

/**
 * Validates link is of allowed type
 */
export function validateLink(link: SemanticLink): { valid: boolean; error?: string } {
  if (!LINK_RULES.allowedLinkTypes.includes(link.type)) {
    return { valid: false, error: `Link type "${link.type}" not allowed` };
  }
  
  if (!link.reason || link.reason.length < 10) {
    return { valid: false, error: 'Link must have a reason explaining why it exists' };
  }
  
  const forbiddenMatch = LINK_RULES.forbiddenPatterns.find(
    pattern => link.label.toLowerCase().includes(pattern.toLowerCase())
  );
  
  if (forbiddenMatch) {
    return { valid: false, error: `Forbidden link pattern: "${forbiddenMatch}"` };
  }
  
  return { valid: true };
}

/**
 * Generates SEO-optimized title
 */
export function generateOptimizedTitle(
  fact: string,
  location: string,
  timeRange: string
): string {
  const title = `${fact} in ${location} (${timeRange})`;
  return title.length > 60 ? title.substring(0, 57) + '...' : title;
}

/**
 * Generates SEO-optimized description
 */
export function generateOptimizedDescription(
  what: string,
  where: string,
  time: string
): string {
  const desc = `${what} in ${where} during ${time}.`;
  return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
}

/**
 * Validates page structure against rules
 */
export function validatePageStructure(
  pageType: keyof typeof DESIGN_RULES.requiredElements,
  elements: string[]
): { valid: boolean; missing: string[] } {
  const required = DESIGN_RULES.requiredElements[pageType] || [];
  const missing = required.filter(el => !elements.includes(el));
  return { valid: missing.length === 0, missing };
}
