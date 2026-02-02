/**
 * 🚀 MASTER EXECUTION BLOCK 44
 * 
 * AI + GOOGLE DOMINANCE — FAST, STRUCTURED, BORING (PERFECT)
 * 
 * Goals:
 * - AI agents can look up facts, get stable answers, get citable URLs
 * - Google understands structure, relationships, indexes deeply
 * - System feels: boring, fast, technical, reliable
 * 
 * 📌 No design. No marketing. Just structure.
 */

// ============================================================
// URL STRUCTURE (MUST BE PERFECT)
// ============================================================

export const URL_RULES = {
  absolute: [
    'No query URLs for indexing',
    'No sessions',
    'No JS dependencies for content',
    'Everything server-side rendered',
    'Every URL = one stable claim/view',
  ],
  
  patterns: {
    facts: '/facts/{domain}/{country?}/{region?}/{year?}',
    indicators: '/indicators/{indicator_id}/{country?}/{year_range?}',
    questions: '/questions/{question_slug}',
    sources: '/sources/{source_id}',
    cite: '/cite/{fact_id}',
    methodology: '/methodology/{topic?}',
  },
};

// Canonical URL examples
export const URL_EXAMPLES = [
  '/facts/',
  '/facts/global-economy/',
  '/facts/work-and-ai/',
  '/facts/work-and-ai/sweden/',
  '/facts/work-and-ai/sweden/stockholm/',
  '/facts/work-and-ai/sweden/stockholm/2024',
  '/indicators/gdp-per-capita/',
  '/indicators/gdp-per-capita/sweden/',
  '/indicators/gdp-per-capita/sweden/1900-2024',
  '/questions/can-ai-replace-most-jobs/',
  '/sources/world-bank/',
  '/cite/FACT-abc123',
];

// ============================================================
// PAGE TYPES (STANDARDIZED)
// ============================================================

export interface FactPageStructure {
  // Required elements
  h1: string;                    // Short fact statement
  summary: string;               // 2-4 sentences
  timeSpan: string;              // "YYYY–YYYY"
  geographicLevel: string;       // global/country/region/municipality
  sources: string[];             // Source IDs
  uncertainty: 'low' | 'medium' | 'high';
  
  // Links (REQUIRED)
  links: {
    indicator: string;           // Link to indicator page
    question: string;            // Link to Big Question
    history: string;             // Link to historical view
    parent: string;              // Link to parent level
    children?: string[];         // Links to child levels
    related: string[];           // Related facts
  };
  
  // Citation
  citationUrl: string;           // Permanent citation URL
  factId: string;                // FACT-{uuid}
}

export interface IndicatorPageStructure {
  h1: string;
  whatThisMeasures: string;      // Brief explanation
  timeSeries: boolean;
  historicalDepth: string;       // "1900–2024"
  comparability: 'full' | 'partial' | 'limited';
  sources: string[];
  methodology: string;
}

export interface BigQuestionPageStructure {
  h1: string;
  summary: string;               // 3-5 sentences
  structuralPatterns: string[];  // Key patterns observed
  linkedFacts: string[];         // Fact IDs
  linkedIndicators: string[];    // Indicator IDs
  historicalContext: string;
  whatWeDoNotKnow: string;       // Explicit uncertainty
}

// ============================================================
// STRUCTURED DATA (SCHEMA.ORG)
// ============================================================

export interface DatasetSchema {
  '@context': 'https://schema.org';
  '@type': 'Dataset';
  name: string;
  description: string;
  temporalCoverage: string;      // "1900-01-01/2024-12-31"
  spatialCoverage: string;       // "Global" or country name
  creator: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  license: string;               // License URL
  distribution: {
    '@type': 'DataDownload';
    encodingFormat: string;      // "application/json"
    contentUrl: string;
  };
  measurementTechnique?: string;
  variableMeasured?: string;
}

export interface StatisticalObservationSchema {
  '@context': 'https://schema.org';
  '@type': 'Observation';
  name: string;
  observationDate: string;
  measuredProperty: {
    '@type': 'StatisticalVariable';
    name: string;
  };
  measuredValue: number;
  unitCode?: string;
  observationAbout: {
    '@type': 'Place';
    name: string;
  };
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

// Factory functions for schema generation
export function createDatasetSchema(data: {
  name: string;
  description: string;
  startYear: number;
  endYear: number;
  spatialCoverage: string;
  license: string;
  contentUrl: string;
}): DatasetSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: data.name,
    description: data.description,
    temporalCoverage: `${data.startYear}-01-01/${data.endYear}-12-31`,
    spatialCoverage: data.spatialCoverage,
    creator: {
      '@type': 'Organization',
      name: 'Global Reality Index',
      url: 'https://globalrealityindex.org',
    },
    license: data.license,
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: data.contentUrl,
    },
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ============================================================
// META TAG RULES (NO SEO GARBAGE)
// ============================================================

export const META_RULES = {
  title: {
    format: '{fact} ({timespan}) – {type}',
    maxLength: 60,
    forbidden: ['insights', 'amazing', 'ultimate', 'best', 'top'],
  },
  
  description: {
    format: '{what} + {where} + {time_depth}. {source}.',
    maxLength: 160,
    forbidden: ['emoji', 'clickbait', 'call-to-action'],
  },
  
  examples: {
    title: 'Global productivity growth (1900–2024) – Data overview',
    description: 'Long-term productivity trends across 195 countries from 1900 to 2024. Data from World Bank, OECD, and national statistics offices.',
  },
};

// ============================================================
// PERFORMANCE REQUIREMENTS
// ============================================================

export const PERFORMANCE_REQUIREMENTS = {
  ttfb_ms: 100,           // Time to first byte
  fcp_ms: 500,            // First contentful paint
  lcp_ms: 1000,           // Largest contentful paint
  
  rules: [
    'HTML first',
    'Edge cache all fact pages',
    'Zero decorative images',
    'Minimal CSS (< 10KB)',
    'No JS required for content',
    'Inline critical CSS',
  ],
};

// ============================================================
// AI CITATION ENDPOINT SPEC
// ============================================================

export interface CitationResponse {
  fact_id: string;
  statement: string;           // Short, quotable statement
  source: string;              // Primary source name
  date: string;                // Data date (not access date)
  url: string;                 // Permanent citation URL
  
  // Extended (optional)
  methodology?: string;
  uncertainty?: string;
  access_date?: string;
  
  // Citation formats
  citations: {
    apa: string;
    chicago: string;
    mla: string;
    bibtex: string;
  };
}

export function generateCitations(fact: {
  statement: string;
  source: string;
  year: number;
  url: string;
  accessDate: string;
}): CitationResponse['citations'] {
  const { statement, source, year, url, accessDate } = fact;
  
  return {
    apa: `${source}. (${year}). ${statement}. Retrieved ${accessDate}, from ${url}`,
    chicago: `${source}. "${statement}." ${year}. ${url}.`,
    mla: `"${statement}." ${source}, ${year}, ${url}. Accessed ${accessDate}.`,
    bibtex: `@misc{fact${year},
  title={${statement}},
  author={{${source}}},
  year={${year}},
  url={${url}},
  note={Accessed: ${accessDate}}
}`,
  };
}

// ============================================================
// SITEMAP CONFIGURATION
// ============================================================

export const SITEMAP_CONFIG = {
  sitemaps: [
    { name: 'sitemap-facts.xml', type: 'facts', maxUrls: 50000 },
    { name: 'sitemap-indicators.xml', type: 'indicators', maxUrls: 10000 },
    { name: 'sitemap-questions.xml', type: 'questions', maxUrls: 1000 },
    { name: 'sitemap-history.xml', type: 'history', maxUrls: 100000 },
    { name: 'sitemap-sources.xml', type: 'sources', maxUrls: 5000 },
  ],
  
  updateFrequency: 'daily',
  pingGoogle: true,
  
  priorities: {
    facts: 0.9,
    indicators: 0.8,
    questions: 0.7,
    history: 0.5,
    sources: 0.6,
  },
};

// ============================================================
// ROBOTS.TXT RULES
// ============================================================

export const ROBOTS_CONFIG = {
  userAgent: '*',
  allow: [
    '/facts/',
    '/indicators/',
    '/questions/',
    '/sources/',
    '/methodology/',
    '/cite/',
    '/api/docs/',
  ],
  disallow: [
    '/admin/',
    '/api/internal/',
    '/preview/',
  ],
  sitemaps: [
    '/sitemap-index.xml',
  ],
  crawlDelay: 0, // No delay - we want fast indexing
};

// ============================================================
// 7-DAY CHECKLIST
// ============================================================

export const SEVEN_DAY_CHECKLIST = {
  day_1_2: {
    name: 'URL Skeleton',
    tasks: [
      'URL structure finalized',
      'Fact Pages live (first 100)',
      'Sitemap generated',
      'robots.txt deployed',
      'Basic structured data',
    ],
  },
  
  day_3_4: {
    name: 'Structure & Links',
    tasks: [
      'Full structured data (schema.org)',
      'Internal linking complete',
      'Sources registry public',
      'Breadcrumbs on all pages',
      'Canonical URLs verified',
    ],
  },
  
  day_5: {
    name: 'AI Endpoints',
    tasks: [
      '/cite/ endpoint live',
      '/api/docs/ public',
      'Citation format generation',
      'JSON-LD verified',
    ],
  },
  
  day_6: {
    name: 'Performance',
    tasks: [
      'SSR verification',
      'TTFB < 100ms verified',
      'Edge cache warm',
      'Lighthouse score > 95',
    ],
  },
  
  day_7: {
    name: 'Launch',
    tasks: [
      'Google Search Console index request',
      'Sitemap ping',
      'Monitor: Googlebot access logs',
      'Monitor: AI agent referrers',
      'First external citations tracked',
    ],
  },
};

// ============================================================
// INTERNAL LINKING RULES
// ============================================================

export const LINKING_RULES = {
  required: [
    'Link to parent level (always)',
    'Link to child levels (if exist)',
    'Link to related facts (3-5)',
    'Link to source indicator',
    'Link to Big Question (if applicable)',
  ],
  
  semanticHierarchy: [
    'Global → Continental → National → Regional → Municipal',
    'Question → Pattern → Indicator → Fact → Data point',
    'Current → Historical → Projected',
  ],
  
  // Links are semantics, not navigation
  principle: 'Every link must mean something. No decorative links.',
};

// ============================================================
// INDEXING PRINCIPLES
// ============================================================

export const INDEXING_PRINCIPLES = [
  'Nothing behind login',
  'No blocked JS',
  'No dynamic content for crawlers',
  'Canonical URLs everywhere',
  'Google should never be confused',
  'Prefer static over dynamic',
  'Cache everything aggressively',
];
