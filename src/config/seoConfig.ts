/**
 * BLOCK 19: SEO & INDEXING – SEN, MEN RÄTT
 * 
 * "Indexering sist. Integritet först."
 * 
 * Förbered nu:
 * - Canonical URLs
 * - Stable slugs
 * - Structured data (schema.org)
 * - OpenGraph korrekt
 * - Noindex på WIP
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
}

// Default SEO values
export const DEFAULT_SEO: SeoConfig = {
  title: 'NOGF – Nationellt Operativt Guidande Faktasystem',
  description: 'Öppen verklighet. Betald förståelse. En global infrastruktur för hur samhällen mäts och förstås.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

// Pages that should NOT be indexed (WIP, internal, etc.)
export const NOINDEX_ROUTES: string[] = [
  '/admin',
  '/admin/*',
  '/smoke-test',
  '/debug/*',
  '/demo/*',
  '/sandbox',
  '/internal/*',
];

// Route-specific SEO configs
export const ROUTE_SEO: Record<string, SeoConfig> = {
  '/': {
    title: 'NOGF – Global Reality Dashboard',
    description: 'Se världen som den är. Data från officiella källor, aggregerad och förklarad.',
    ogType: 'website',
  },
  '/reality': {
    title: 'Global Reality Index (GRI) – NOGF',
    description: 'Hur mår världen just nu? Sex pelare, realtidsdata, full transparens.',
    ogType: 'website',
  },
  '/sweden': {
    title: 'Sverige Dashboard – NOGF',
    description: 'Sveriges nyckelindikatorer: ekonomi, demografi, hälsa, energi. Uppdateras dagligen.',
    ogType: 'website',
  },
  '/eu': {
    title: 'EU Dashboard – NOGF',
    description: 'EU27 och NUTS-regioner. Jämför länder, se trender, förstå skillnader.',
    ogType: 'website',
  },
  '/map': {
    title: 'Global Karta – NOGF',
    description: 'Choropleth-kartor för alla indikatorer. Klicka för tidsserie och korrelation.',
    ogType: 'website',
  },
  '/correlation': {
    title: 'Korrelationsanalys – NOGF',
    description: 'Analysera samband mellan indikatorer. Transparenta metoder, tydliga varningar.',
    ogType: 'website',
  },
  '/indices': {
    title: 'Index Engine – NOGF',
    description: 'Alla systemindex: GRI, HWI, Resilience, Fairness, Institutional, Energy.',
    ogType: 'website',
  },
  '/profiles': {
    title: 'Politikerprofiler – NOGF',
    description: 'Ansvarsspårning utan anklagelse. Se vem som var ansvarig när.',
    ogType: 'website',
  },
  '/api-licensing': {
    title: 'API & Licensing – NOGF',
    description: 'Developer portal, API-dokumentation, prissättning. REST + GraphQL.',
    ogType: 'website',
  },
  '/about': {
    title: 'Om NOGF – Metodik & Transparens',
    description: 'Hur systemet fungerar. Metoder, källor, vikter, begränsningar.',
    ogType: 'website',
  },
};

// Structured data templates (Schema.org)
export const STRUCTURED_DATA = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NOGF',
    url: 'https://nogf.se',
    description: 'Nationellt Operativt Guidande Faktasystem',
    sameAs: [],
  },
  
  dataset: (name: string, description: string, dateModified: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    dateModified,
    license: 'https://nogf.se/license',
    creator: {
      '@type': 'Organization',
      name: 'NOGF',
    },
  }),
  
  webApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NOGF',
    applicationCategory: 'DataVisualization',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'SEK',
      description: 'Free tier with full data visibility',
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
  const baseUrl = 'https://nogf.se';
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

// Generate meta tags
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
  }
  
  // OpenGraph
  tags['og:title'] = config.title;
  tags['og:description'] = config.description;
  tags['og:type'] = config.ogType || 'website';
  if (config.ogImage) {
    tags['og:image'] = config.ogImage;
  }
  
  // Twitter
  tags['twitter:card'] = config.twitterCard || 'summary';
  tags['twitter:title'] = config.title;
  tags['twitter:description'] = config.description;
  
  return tags;
}
