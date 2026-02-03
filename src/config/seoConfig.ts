/**
 * SEO & INDEXING CONFIGURATION
 * 
 * Enterprise-grade search engine optimization for global data intelligence platform.
 * Structured data, canonical URLs, and comprehensive metadata.
 */

export interface SeoConfig {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: object;
  keywords?: string[];
}

// Default SEO values - optimized for enterprise search
export const DEFAULT_SEO: SeoConfig = {
  title: 'STRIM – Global Data Intelligence Platform | Real-Time Societal Analytics',
  description: 'Enterprise data intelligence platform providing real-time societal analytics, transparent methodologies, and actionable insights from verified public sources across 195 countries.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  keywords: [
    'data intelligence',
    'societal analytics',
    'real-time data',
    'public data aggregation',
    'global statistics',
    'policy analytics',
    'enterprise data platform',
    'transparent methodology'
  ],
};

// Pages that should NOT be indexed (internal, development, etc.)
export const NOINDEX_ROUTES: string[] = [
  '/admin',
  '/admin/*',
  '/smoke-test',
  '/debug/*',
  '/demo/*',
  '/sandbox',
  '/internal/*',
];

// Route-specific SEO configs - enterprise language, keyword-rich
export const ROUTE_SEO: Record<string, SeoConfig> = {
  '/': {
    title: 'STRIM – Global Societal Data Intelligence | Enterprise Analytics Platform',
    description: 'Access verified data from 195 countries. Real-time societal indicators, transparent aggregation methods, and enterprise-grade analytics for informed decision-making.',
    ogType: 'website',
    keywords: ['global data', 'societal indicators', 'enterprise analytics', 'data aggregation'],
  },
  '/reality': {
    title: 'Global Reality Index | Composite Societal Measurement Framework',
    description: 'Comprehensive baseline index measuring societal conditions across five fundamental domains: health, livelihood, knowledge, stability, and sustainability. Fully decomposable methodology.',
    ogType: 'website',
    keywords: ['reality index', 'composite index', 'societal measurement', 'global baseline'],
  },
  '/sweden': {
    title: 'Sweden Data Dashboard | National Indicator Analytics',
    description: 'Real-time Swedish national indicators: economic performance, demographic trends, public health metrics, and energy statistics. Daily updates from official sources.',
    ogType: 'website',
    keywords: ['Sweden data', 'Swedish statistics', 'national indicators', 'SCB data'],
  },
  '/eu': {
    title: 'European Union Data Dashboard | EU27 Regional Analytics',
    description: 'EU27 and NUTS-classified regional data. Cross-country comparisons, temporal trend analysis, and Eurostat-harmonized statistical coverage.',
    ogType: 'website',
    keywords: ['EU data', 'Eurostat', 'NUTS regions', 'European statistics', 'EU27'],
  },
  '/map': {
    title: 'Global Data Visualization | Interactive Choropleth Maps',
    description: 'Interactive geographic visualization of global indicators. Choropleth maps with temporal drill-down, correlation analysis, and export capabilities.',
    ogType: 'website',
    keywords: ['data visualization', 'choropleth map', 'global map', 'geographic data'],
  },
  '/correlation': {
    title: 'Correlation Analysis Engine | Statistical Pattern Detection',
    description: 'Advanced correlation analysis with transparent methodology, confidence intervals, and stability testing. Clear distinction between correlation and causation.',
    ogType: 'website',
    keywords: ['correlation analysis', 'statistical patterns', 'data correlation', 'covariation'],
  },
  '/indices': {
    title: 'Composite Index Library | Decomposable Analytics Framework',
    description: 'Complete library of composite indices: Reality Index, Resilience Capacity, Intergenerational Fairness, and Institutional Stability. Every weight visible, every calculation traceable.',
    ogType: 'website',
    keywords: ['composite index', 'data indices', 'analytics framework', 'index methodology'],
  },
  '/profiles': {
    title: 'Accountability Mapping | Decision Timeline Documentation',
    description: 'Systematic documentation of decision-maker responsibilities and outcome correlations. Temporal alignment without attribution claims.',
    ogType: 'website',
    keywords: ['accountability', 'decision tracking', 'responsibility mapping', 'governance'],
  },
  '/api-licensing': {
    title: 'API Access & Licensing | Enterprise Data Integration',
    description: 'RESTful and GraphQL APIs for enterprise integration. Tiered licensing from open access to white-label solutions. Complete documentation and SLA options.',
    ogType: 'website',
    keywords: ['API', 'data API', 'enterprise integration', 'data licensing', 'REST API'],
  },
  '/about': {
    title: 'Methodology & Governance | Platform Documentation',
    description: 'Complete methodological documentation: data sources, aggregation procedures, weighting rationale, and limitation disclosures. Full transparency by design.',
    ogType: 'website',
    keywords: ['methodology', 'data governance', 'transparency', 'documentation'],
  },
  '/demography': {
    title: 'Demographic Correlation Engine | Societal Covariation Analysis',
    description: 'Rigorous analysis of demographic indicators and societal outcomes. Extended historical data from 1800, transparent control variables, mandatory causation disclaimers.',
    ogType: 'website',
    keywords: ['demographic analysis', 'societal correlation', 'population data', 'migration statistics'],
  },
  '/capacity': {
    title: 'Global Carrying Capacity Analysis | Resource Sustainability Metrics',
    description: 'Systematic assessment of resource capacity, population sustainability, and long-term viability indicators across geographic regions.',
    ogType: 'website',
    keywords: ['carrying capacity', 'sustainability', 'resource analysis', 'viability metrics'],
  },
  '/fairness': {
    title: 'Intergenerational Fairness Index | Long-Term Equity Measurement',
    description: 'Quantified assessment of resource allocation equity across generations. Environmental debt, pension sustainability, and infrastructure investment analysis.',
    ogType: 'website',
    keywords: ['intergenerational fairness', 'equity measurement', 'generational analysis'],
  },
  '/resilience': {
    title: 'Resilience Capacity Dashboard | Systemic Stability Assessment',
    description: 'Multi-domain resilience measurement: institutional capacity, supply chain robustness, financial buffers, and adaptive capability indicators.',
    ogType: 'website',
    keywords: ['resilience', 'systemic stability', 'risk assessment', 'capacity analysis'],
  },
};

// Structured data templates (Schema.org) - enterprise-grade
export const STRUCTURED_DATA = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'STRIM',
    url: 'https://strim.se',
    description: 'Global data intelligence platform for societal analytics',
    foundingDate: '2024',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'enterprise sales',
      availableLanguage: ['Swedish', 'English'],
    },
  },
  
  dataset: (name: string, description: string, dateModified: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    dateModified,
    license: 'https://strim.se/license',
    creator: {
      '@type': 'Organization',
      name: 'STRIM',
      url: 'https://strim.se',
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://api.strim.se/v1/',
    },
  }),
  
  webApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'STRIM Data Intelligence Platform',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    applicationSubCategory: 'Data Analytics',
    offers: [
      {
        '@type': 'Offer',
        name: 'Open Access',
        price: '0',
        priceCurrency: 'SEK',
        description: 'Full data visibility with attribution requirement',
      },
      {
        '@type': 'Offer',
        name: 'Enterprise',
        price: '14900',
        priceCurrency: 'SEK',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          billingDuration: 'P1M',
        },
        description: 'Full API access, white-label rights, SLA',
      },
    ],
  },

  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'STRIM API',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'SEK',
    },
  },
};

// OpenGraph image generator config
export const OG_IMAGE_CONFIG = {
  width: 1200,
  height: 630,
  defaultBackground: '#0f172a',
  defaultTextColor: '#f8fafc',
  logoPath: '/og-logo.png',
};

// Canonical URL generator
export function getCanonicalUrl(path: string): string {
  const baseUrl = 'https://strim.se';
  // Remove trailing slashes and query params
  const cleanPath = path.split('?')[0].replace(/\/+$/, '');
  return `${baseUrl}${cleanPath || '/'}`;
}

// Check if route should be noindexed
export function shouldNoindex(path: string): boolean {
  return NOINDEX_ROUTES.some(pattern => {
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -2);
      return path.startsWith(prefix);
    }
    return path === pattern;
  });
}

// Get SEO config for route
export function getSeoConfig(path: string): SeoConfig {
  const routeConfig = ROUTE_SEO[path];
  const noindex = shouldNoindex(path);
  
  return {
    ...DEFAULT_SEO,
    ...routeConfig,
    canonical: getCanonicalUrl(path),
    noindex,
  };
}

// Generate meta tags - complete set for enterprise SEO
export function generateMetaTags(config: SeoConfig): Record<string, string> {
  const tags: Record<string, string> = {
    title: config.title,
    description: config.description,
  };
  
  if (config.canonical) {
    tags['canonical'] = config.canonical;
  }
  
  if (config.noindex) {
    tags['robots'] = 'noindex, nofollow';
  } else {
    tags['robots'] = 'index, follow, max-snippet:-1, max-image-preview:large';
  }
  
  // Keywords (still used by some engines)
  if (config.keywords) {
    tags['keywords'] = config.keywords.join(', ');
  }
  
  // OpenGraph
  tags['og:title'] = config.title;
  tags['og:description'] = config.description;
  tags['og:type'] = config.ogType || 'website';
  tags['og:site_name'] = 'STRIM';
  if (config.ogImage) {
    tags['og:image'] = config.ogImage;
  }
  
  // Twitter
  tags['twitter:card'] = config.twitterCard || 'summary_large_image';
  tags['twitter:title'] = config.title;
  tags['twitter:description'] = config.description;
  
  return tags;
}
