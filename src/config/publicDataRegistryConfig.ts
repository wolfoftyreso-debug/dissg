/**
 * WAVE 6 — BLOCK AV: TOTAL PUBLIC DATA EXTRACTION
 * 
 * Allt som är öppet publicerat, lagligt åtkomligt, icke-personidentifierande.
 * Regel: Om det är offentligt → in.
 */

export type DataCategory =
  | 'government_statistics'
  | 'international_org'
  | 'municipal_portal'
  | 'national_open_data'
  | 'parliament'
  | 'budget'
  | 'legislation'
  | 'procurement'
  | 'policy_document'
  | 'press_release'
  | 'news'
  | 'scientific_metadata'
  | 'geodata'
  | 'infrastructure'
  | 'market_macro';

export type ExtractionMode =
  | 'api'
  | 'rss'
  | 'html_scrape'
  | 'pdf_extract'
  | 'bulk_csv'
  | 'json_feed';

export interface PublicDataSource {
  code: string;
  name: string;
  category: DataCategory;
  extractionMode: ExtractionMode;
  countryCode?: string;
  baseUrl?: string;
  apiEndpoint?: string;
  updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  qualityScore: number;
  isActive: boolean;
}

/**
 * Data category definitions with metadata
 */
export const DATA_CATEGORIES: Record<DataCategory, {
  label: string;
  description: string;
  typicalSources: string[];
  updateFrequency: string;
}> = {
  government_statistics: {
    label: 'Myndighetsstatistik',
    description: 'Officiell statistik från nationella statistikbyråer',
    typicalSources: ['SCB', 'Eurostat', 'UN Statistics'],
    updateFrequency: 'Månadsvis till årligen'
  },
  international_org: {
    label: 'Internationella organisationer',
    description: 'Data från globala institutioner',
    typicalSources: ['World Bank', 'IMF', 'OECD', 'WHO', 'ILO'],
    updateFrequency: 'Årligen till kvartalsvis'
  },
  municipal_portal: {
    label: 'Kommunala dataportaler',
    description: 'Öppen data från kommuner och regioner',
    typicalSources: ['Kommunala API:er', 'Regiondata'],
    updateFrequency: 'Dagligen till månadsvis'
  },
  national_open_data: {
    label: 'Nationella öppna data-portaler',
    description: 'Centrala öppna data-resurser',
    typicalSources: ['data.gov', 'oppnadata.se', 'EU Open Data Portal'],
    updateFrequency: 'Varierande'
  },
  parliament: {
    label: 'Parlament & regeringar',
    description: 'Riksdagsbeslut, propositioner, utskottsbetänkanden',
    typicalSources: ['Riksdagen', 'Regeringskansliet', 'EUR-Lex'],
    updateFrequency: 'Dagligen'
  },
  budget: {
    label: 'Budgetar & utfall',
    description: 'Offentliga finanser, statsbudget, utfall',
    typicalSources: ['Ekonomistyrningsverket', 'Finansdepartementet'],
    updateFrequency: 'Månadsvis till årligen'
  },
  legislation: {
    label: 'Regler & lagar',
    description: 'Lagstiftning, förordningar, föreskrifter',
    typicalSources: ['Lagrummet', 'EUR-Lex', 'SFS'],
    updateFrequency: 'Löpande'
  },
  procurement: {
    label: 'Upphandlingar',
    description: 'Offentlig upphandling, tilldelningsbeslut',
    typicalSources: ['TED', 'Konkurrensverket', 'SIMAP'],
    updateFrequency: 'Dagligen'
  },
  policy_document: {
    label: 'Policy-dokument',
    description: 'Utredningar, strategier, handlingsplaner',
    typicalSources: ['SOU', 'Ds', 'Myndighetspublikationer'],
    updateFrequency: 'Löpande'
  },
  press_release: {
    label: 'Pressmeddelanden',
    description: 'Officiella kommunikéer från myndigheter',
    typicalSources: ['Regeringen.se', 'Myndigheter'],
    updateFrequency: 'Dagligen'
  },
  news: {
    label: 'Nyheter',
    description: 'Nyhetsartiklar och mediabevakning',
    typicalSources: ['Nyhetsbyråer', 'Dagstidningar'],
    updateFrequency: 'Realtid'
  },
  scientific_metadata: {
    label: 'Vetenskapliga sammanfattningar',
    description: 'Metadata och abstracts från forskning',
    typicalSources: ['OpenAlex', 'PubMed', 'arXiv'],
    updateFrequency: 'Dagligen'
  },
  geodata: {
    label: 'Geodata',
    description: 'Satellitdata, kartor, geografisk information',
    typicalSources: ['Copernicus', 'Lantmäteriet', 'OSM'],
    updateFrequency: 'Dagligen till veckovis'
  },
  infrastructure: {
    label: 'Infrastrukturdata',
    description: 'Transport, energi, kommunikation',
    typicalSources: ['Trafikverket', 'Svenska kraftnät', 'PTS'],
    updateFrequency: 'Dagligen till månadsvis'
  },
  market_macro: {
    label: 'Marknadsdata (makro)',
    description: 'Aggregerad marknadsstatistik',
    typicalSources: ['Riksbanken', 'ECB', 'Bloomberg (öppen)'],
    updateFrequency: 'Dagligen till månadsvis'
  }
};

/**
 * Extraction mode specifications
 */
export const EXTRACTION_MODES: Record<ExtractionMode, {
  label: string;
  description: string;
  requirements: string[];
  reliability: number;
}> = {
  api: {
    label: 'API',
    description: 'Strukturerat API-anrop',
    requirements: ['API-dokumentation', 'Eventuell nyckel'],
    reliability: 0.95
  },
  rss: {
    label: 'RSS/Atom',
    description: 'Feed-prenumeration',
    requirements: ['Feed-URL'],
    reliability: 0.90
  },
  html_scrape: {
    label: 'HTML-skrapning',
    description: 'Extraktion från webbsidor',
    requirements: ['Stabil sidstruktur', 'robots.txt-tillåtelse'],
    reliability: 0.70
  },
  pdf_extract: {
    label: 'PDF-extraktion',
    description: 'Textextraktion från PDF-dokument',
    requirements: ['Sökbar PDF', 'Konsekvent format'],
    reliability: 0.65
  },
  bulk_csv: {
    label: 'Bulk CSV/Excel',
    description: 'Nedladdning av datafiler',
    requirements: ['Fil-URL', 'Konsekvent format'],
    reliability: 0.85
  },
  json_feed: {
    label: 'JSON-feed',
    description: 'Strukturerad JSON-data',
    requirements: ['Endpoint-URL', 'Schema-dokumentation'],
    reliability: 0.92
  }
};

/**
 * Ingest rules - all data goes through same pipeline
 */
export const INGEST_RULES = {
  appendOnly: true,
  versioned: true,
  timestamped: true,
  checksumRequired: true,
  
  validation: {
    schemaCheck: true,
    duplicateDetection: true,
    outlierFlagging: true
  },
  
  metadata: {
    sourceUrl: 'required',
    extractionTime: 'required',
    extractionMode: 'required',
    originalFormat: 'required'
  }
} as const;

/**
 * Swedish key data sources (prioritized)
 */
export const SWEDISH_PRIORITY_SOURCES: PublicDataSource[] = [
  {
    code: 'scb-api',
    name: 'Statistiska centralbyrån (SCB)',
    category: 'government_statistics',
    extractionMode: 'api',
    countryCode: 'SE',
    baseUrl: 'https://api.scb.se',
    updateFrequency: 'monthly',
    qualityScore: 0.95,
    isActive: true
  },
  {
    code: 'kolada-api',
    name: 'Kolada (RKA)',
    category: 'municipal_portal',
    extractionMode: 'api',
    countryCode: 'SE',
    baseUrl: 'https://api.kolada.se',
    updateFrequency: 'monthly',
    qualityScore: 0.90,
    isActive: true
  },
  {
    code: 'riksdagen-api',
    name: 'Riksdagens öppna data',
    category: 'parliament',
    extractionMode: 'api',
    countryCode: 'SE',
    baseUrl: 'https://data.riksdagen.se',
    updateFrequency: 'daily',
    qualityScore: 0.92,
    isActive: true
  },
  {
    code: 'esv-api',
    name: 'Ekonomistyrningsverket',
    category: 'budget',
    extractionMode: 'api',
    countryCode: 'SE',
    baseUrl: 'https://www.esv.se/statsliggaren',
    updateFrequency: 'monthly',
    qualityScore: 0.88,
    isActive: true
  },
  {
    code: 'riksbanken-api',
    name: 'Riksbanken',
    category: 'market_macro',
    extractionMode: 'api',
    countryCode: 'SE',
    baseUrl: 'https://api.riksbank.se',
    updateFrequency: 'daily',
    qualityScore: 0.95,
    isActive: true
  }
];

/**
 * EU/International priority sources
 */
export const EU_PRIORITY_SOURCES: PublicDataSource[] = [
  {
    code: 'eurostat-api',
    name: 'Eurostat',
    category: 'government_statistics',
    extractionMode: 'api',
    baseUrl: 'https://ec.europa.eu/eurostat/api',
    updateFrequency: 'monthly',
    qualityScore: 0.93,
    isActive: true
  },
  {
    code: 'ecb-sdw',
    name: 'ECB Statistical Data Warehouse',
    category: 'market_macro',
    extractionMode: 'api',
    baseUrl: 'https://sdw-wsrest.ecb.europa.eu',
    updateFrequency: 'daily',
    qualityScore: 0.95,
    isActive: true
  },
  {
    code: 'oecd-api',
    name: 'OECD.Stat',
    category: 'international_org',
    extractionMode: 'api',
    baseUrl: 'https://stats.oecd.org/SDMX-JSON',
    updateFrequency: 'monthly',
    qualityScore: 0.90,
    isActive: true
  },
  {
    code: 'worldbank-api',
    name: 'World Bank Open Data',
    category: 'international_org',
    extractionMode: 'api',
    baseUrl: 'https://api.worldbank.org/v2',
    updateFrequency: 'annual',
    qualityScore: 0.88,
    isActive: true
  }
];

/**
 * Calculate overall data coverage for a geography
 */
export function calculateDataCoverage(
  sources: PublicDataSource[],
  geography: string
): {
  categoriesCovered: DataCategory[];
  coveragePercent: number;
  gaps: DataCategory[];
} {
  const allCategories = Object.keys(DATA_CATEGORIES) as DataCategory[];
  const activeSources = sources.filter(s => 
    s.isActive && (!s.countryCode || s.countryCode === geography)
  );
  
  const covered = new Set(activeSources.map(s => s.category));
  const gaps = allCategories.filter(c => !covered.has(c));
  
  return {
    categoriesCovered: Array.from(covered),
    coveragePercent: (covered.size / allCategories.length) * 100,
    gaps
  };
}
