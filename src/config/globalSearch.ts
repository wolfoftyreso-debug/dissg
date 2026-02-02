/**
 * GLOBAL SEARCH & DISCOVERY
 * Block AC: Find EVERYTHING
 * 
 * Google-feeling. Instant response.
 */

// ============================================================================
// SEARCHABLE ENTITY TYPES
// ============================================================================

export type SearchableEntityType = 
  | 'kpi'
  | 'country'
  | 'region'
  | 'index'
  | 'event'
  | 'news'
  | 'dashboard'
  | 'query'
  | 'source'
  | 'policy'
  | 'person'
  | 'organization';

export interface SearchableEntity {
  id: string;
  type: SearchableEntityType;
  title: string;
  description?: string;
  
  // Searchable text
  searchable_text: string;
  
  // Facets
  categories: string[];
  tags: string[];
  geo_codes: string[];
  time_period?: string;
  
  // Ranking signals
  popularity_score: number;
  freshness_score: number;
  quality_score: number;
  
  // Preview
  preview?: {
    value?: number;
    trend?: 'up' | 'down' | 'stable';
    last_updated?: string;
    thumbnail_url?: string;
  };
  
  // Links
  url: string;
  related_ids: string[];
  
  // Meta
  indexed_at: string;
}

// ============================================================================
// SEARCH QUERY
// ============================================================================

export interface GlobalSearchQuery {
  q: string; // Main search query
  
  // Filters
  types?: SearchableEntityType[];
  categories?: string[];
  geo_codes?: string[];
  date_from?: string;
  date_to?: string;
  
  // Facets to return
  facets?: string[];
  
  // Sorting
  sort_by?: 'relevance' | 'date' | 'popularity' | 'alphabetical';
  sort_order?: 'asc' | 'desc';
  
  // Pagination
  limit?: number;
  offset?: number;
  
  // Advanced
  fuzzy?: boolean;
  highlight?: boolean;
  suggest?: boolean;
}

export interface SearchResult {
  entity: SearchableEntity;
  score: number;
  highlights?: Record<string, string[]>;
}

export interface GlobalSearchResponse {
  query: GlobalSearchQuery;
  
  // Results
  results: SearchResult[];
  total: number;
  
  // Facets
  facets?: Record<string, FacetResult[]>;
  
  // Suggestions
  suggestions?: string[];
  did_you_mean?: string;
  
  // Performance
  took_ms: number;
  cached: boolean;
}

export interface FacetResult {
  value: string;
  count: number;
  selected: boolean;
}

// ============================================================================
// SEARCH SUGGESTIONS
// ============================================================================

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'entity' | 'category' | 'filter';
  entity_type?: SearchableEntityType;
  entity_id?: string;
  popularity: number;
}

export interface AutocompleteResponse {
  query: string;
  suggestions: SearchSuggestion[];
  took_ms: number;
}

// ============================================================================
// POPULAR SEARCHES (for suggestions)
// ============================================================================

export const POPULAR_SEARCHES: SearchSuggestion[] = [
  // KPIs
  { text: 'unemployment rate', type: 'entity', entity_type: 'kpi', entity_id: 'unemployment_rate_total', popularity: 95 },
  { text: 'gdp growth', type: 'entity', entity_type: 'kpi', entity_id: 'gdp_growth_real', popularity: 92 },
  { text: 'inflation', type: 'entity', entity_type: 'kpi', entity_id: 'cpi_inflation', popularity: 90 },
  { text: 'life expectancy', type: 'entity', entity_type: 'kpi', entity_id: 'life_expectancy_birth', popularity: 88 },
  { text: 'poverty rate', type: 'entity', entity_type: 'kpi', entity_id: 'poverty_rate', popularity: 85 },
  { text: 'education', type: 'category', popularity: 82 },
  { text: 'employment', type: 'category', popularity: 80 },
  
  // Countries
  { text: 'Sweden', type: 'entity', entity_type: 'country', entity_id: 'SE', popularity: 75 },
  { text: 'Germany', type: 'entity', entity_type: 'country', entity_id: 'DE', popularity: 78 },
  { text: 'United States', type: 'entity', entity_type: 'country', entity_id: 'US', popularity: 85 },
  { text: 'Japan', type: 'entity', entity_type: 'country', entity_id: 'JP', popularity: 70 },
  { text: 'China', type: 'entity', entity_type: 'country', entity_id: 'CN', popularity: 72 },
  
  // Indexes
  { text: 'Global Master Index', type: 'entity', entity_type: 'index', entity_id: 'gmi', popularity: 88 },
  { text: 'Health Index', type: 'entity', entity_type: 'index', entity_id: 'health_index', popularity: 75 },
  { text: 'Workforce Index', type: 'entity', entity_type: 'index', entity_id: 'workforce_index', popularity: 72 },
  
  // Common queries
  { text: 'compare Sweden Germany', type: 'query', popularity: 65 },
  { text: 'EU unemployment', type: 'query', popularity: 62 },
  { text: 'OECD gdp ranking', type: 'query', popularity: 60 },
  { text: 'climate emissions by country', type: 'query', popularity: 58 },
];

// ============================================================================
// SEARCH INDEX CONFIGURATION
// ============================================================================

export interface SearchIndexConfig {
  type: SearchableEntityType;
  fields: SearchFieldConfig[];
  boost_factors: Record<string, number>;
}

export interface SearchFieldConfig {
  name: string;
  type: 'text' | 'keyword' | 'date' | 'number' | 'geo';
  searchable: boolean;
  filterable: boolean;
  sortable: boolean;
  weight: number;
}

export const SEARCH_INDEX_CONFIGS: SearchIndexConfig[] = [
  {
    type: 'kpi',
    fields: [
      { name: 'name', type: 'text', searchable: true, filterable: false, sortable: true, weight: 10 },
      { name: 'description', type: 'text', searchable: true, filterable: false, sortable: false, weight: 5 },
      { name: 'category', type: 'keyword', searchable: false, filterable: true, sortable: true, weight: 3 },
      { name: 'tags', type: 'keyword', searchable: true, filterable: true, sortable: false, weight: 4 },
      { name: 'unit', type: 'keyword', searchable: false, filterable: true, sortable: false, weight: 1 },
    ],
    boost_factors: {
      popularity: 1.5,
      freshness: 1.2,
      quality: 1.3,
    }
  },
  {
    type: 'country',
    fields: [
      { name: 'name', type: 'text', searchable: true, filterable: false, sortable: true, weight: 10 },
      { name: 'name_local', type: 'text', searchable: true, filterable: false, sortable: false, weight: 8 },
      { name: 'code', type: 'keyword', searchable: true, filterable: true, sortable: true, weight: 5 },
      { name: 'region', type: 'keyword', searchable: false, filterable: true, sortable: true, weight: 3 },
      { name: 'bloc', type: 'keyword', searchable: false, filterable: true, sortable: false, weight: 3 },
    ],
    boost_factors: {
      popularity: 1.5,
      data_depth: 1.4,
    }
  },
  {
    type: 'event',
    fields: [
      { name: 'title', type: 'text', searchable: true, filterable: false, sortable: false, weight: 10 },
      { name: 'description', type: 'text', searchable: true, filterable: false, sortable: false, weight: 5 },
      { name: 'event_type', type: 'keyword', searchable: false, filterable: true, sortable: true, weight: 4 },
      { name: 'category', type: 'keyword', searchable: false, filterable: true, sortable: true, weight: 3 },
      { name: 'occurred_at', type: 'date', searchable: false, filterable: true, sortable: true, weight: 1 },
      { name: 'severity', type: 'number', searchable: false, filterable: true, sortable: true, weight: 2 },
    ],
    boost_factors: {
      recency: 2.0,
      severity: 1.5,
    }
  },
  {
    type: 'index',
    fields: [
      { name: 'name', type: 'text', searchable: true, filterable: false, sortable: true, weight: 10 },
      { name: 'description', type: 'text', searchable: true, filterable: false, sortable: false, weight: 5 },
      { name: 'pillars', type: 'keyword', searchable: true, filterable: true, sortable: false, weight: 4 },
    ],
    boost_factors: {
      popularity: 1.5,
    }
  },
];

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

export function performSearch(query: GlobalSearchQuery): GlobalSearchResponse {
  const start = Date.now();
  
  // Simplified search implementation
  const results: SearchResult[] = [];
  
  // Search popular searches for demo
  const matchingSuggestions = POPULAR_SEARCHES.filter(s => 
    s.text.toLowerCase().includes(query.q.toLowerCase())
  );
  
  for (const suggestion of matchingSuggestions) {
    if (suggestion.entity_type) {
      results.push({
        entity: {
          id: suggestion.entity_id || suggestion.text,
          type: suggestion.entity_type,
          title: suggestion.text,
          searchable_text: suggestion.text,
          categories: [],
          tags: [],
          geo_codes: [],
          popularity_score: suggestion.popularity,
          freshness_score: 80,
          quality_score: 90,
          url: `/${suggestion.entity_type}/${suggestion.entity_id}`,
          related_ids: [],
          indexed_at: new Date().toISOString(),
        },
        score: suggestion.popularity / 100,
      });
    }
  }
  
  // Sort by relevance
  results.sort((a, b) => b.score - a.score);
  
  // Apply pagination
  const paginatedResults = results.slice(
    query.offset || 0,
    (query.offset || 0) + (query.limit || 10)
  );
  
  return {
    query,
    results: paginatedResults,
    total: results.length,
    suggestions: query.suggest ? getSuggestions(query.q) : undefined,
    took_ms: Date.now() - start,
    cached: false,
  };
}

export function getAutocomplete(query: string): AutocompleteResponse {
  const start = Date.now();
  
  const suggestions = POPULAR_SEARCHES
    .filter(s => s.text.toLowerCase().startsWith(query.toLowerCase()))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);
  
  return {
    query,
    suggestions,
    took_ms: Date.now() - start,
  };
}

function getSuggestions(query: string): string[] {
  // Simple typo correction / suggestion
  const suggestions: string[] = [];
  
  const commonTerms = ['unemployment', 'gdp', 'inflation', 'population', 'health'];
  for (const term of commonTerms) {
    if (levenshteinDistance(query.toLowerCase(), term) <= 2) {
      suggestions.push(term);
    }
  }
  
  return suggestions.slice(0, 3);
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

console.log('[Global Search] Loaded with', POPULAR_SEARCHES.length, 'popular searches');
