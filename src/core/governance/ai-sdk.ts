/**
 * AI-AGENT SDK
 * 
 * Built explicitly for machines.
 * Strict schemas. Deterministic pagination. Version pinning.
 */

// ============================================
// SDK TYPES
// ============================================

export interface AIAgentRequest {
  node_id?: string;
  index_id?: string;
  graph_id?: string;
  depth?: number;
  relations?: ('side' | 'forward' | 'backward')[];
  version?: string;
  page?: number;
  page_size?: number;
}

export interface AIAgentResponse<T> {
  // Always present
  data: T;
  meta: ResponseMeta;
  
  // Pagination (if applicable)
  pagination?: PaginationInfo;
  
  // Graph traversal (if applicable)
  relations?: RelationInfo[];
  
  // Required context
  scope: ScopeInfo;
  uncertainty: UncertaintyInfo;
  limitations: string[];
}

export interface ResponseMeta {
  version: string;
  generated_at: string;
  cache_until: string;
  checksum: string;
  deterministic: boolean;
}

export interface PaginationInfo {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface RelationInfo {
  relation_type: 'side' | 'forward' | 'backward';
  target_id: string;
  target_type: 'node' | 'index' | 'graph';
  strength: number;
  description: string;
}

export interface ScopeInfo {
  domain: string;
  geography: string;
  population: string;
  time_range: {
    start: string;
    end: string;
  };
}

export interface UncertaintyInfo {
  confidence: number;
  data_coverage: number;
  known_biases: string[];
  missing_data: string[];
}

// ============================================
// SDK ENDPOINTS (SPECIFICATION)
// ============================================

export const SDK_ENDPOINTS = {
  // Node endpoints
  'GET /api/graph/node/:id': {
    description: 'Get a single Truth Node with optional depth traversal',
    params: ['id'],
    query: ['depth', 'relations', 'version'],
    response: 'AIAgentResponse<TruthNode>',
  },
  
  'GET /api/graph/nodes': {
    description: 'List Truth Nodes with pagination',
    query: ['domain', 'page', 'page_size', 'version'],
    response: 'AIAgentResponse<TruthNode[]>',
  },
  
  // Index endpoints
  'GET /api/index/:id': {
    description: 'Get a single Index with current state',
    params: ['id'],
    query: ['version'],
    response: 'AIAgentResponse<Index>',
  },
  
  'GET /api/indexes': {
    description: 'List all Indexes',
    query: ['domain', 'page', 'page_size'],
    response: 'AIAgentResponse<Index[]>',
  },
  
  // Decision Graph endpoints
  'GET /api/decision-graph/:id': {
    description: 'Get a Decision Graph structure',
    params: ['id'],
    query: ['resolve', 'version'],
    response: 'AIAgentResponse<DecisionGraph>',
  },
  
  // Signal endpoints
  'GET /api/signals': {
    description: 'Get current signal state',
    query: ['domain', 'index_id', 'min_zscore'],
    response: 'AIAgentResponse<Signal[]>',
  },
  
  // Traversal endpoints
  'GET /api/traverse': {
    description: 'Traverse graph from starting node',
    query: ['start_id', 'direction', 'depth', 'filter_domain'],
    response: 'AIAgentResponse<TraversalResult>',
  },
} as const;

// ============================================
// RESPONSE BUILDERS
// ============================================

export function buildAIResponse<T>(
  data: T,
  options: {
    version?: string;
    pagination?: Partial<PaginationInfo>;
    relations?: RelationInfo[];
    scope: ScopeInfo;
    uncertainty: UncertaintyInfo;
    limitations?: string[];
  }
): AIAgentResponse<T> {
  const now = new Date();
  const cacheUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 min cache
  
  return {
    data,
    meta: {
      version: options.version ?? '1.0.0',
      generated_at: now.toISOString(),
      cache_until: cacheUntil.toISOString(),
      checksum: computeResponseChecksum(data),
      deterministic: true,
    },
    pagination: options.pagination ? {
      page: options.pagination.page ?? 1,
      page_size: options.pagination.page_size ?? 20,
      total_items: options.pagination.total_items ?? 0,
      total_pages: options.pagination.total_pages ?? 1,
      has_next: options.pagination.has_next ?? false,
      has_previous: options.pagination.has_previous ?? false,
    } : undefined,
    relations: options.relations,
    scope: options.scope,
    uncertainty: options.uncertainty,
    limitations: options.limitations ?? [
      'This is observational data, not recommendations',
      'Confidence levels indicate data quality, not certainty',
      'Historical patterns do not predict future outcomes',
    ],
  };
}

function computeResponseChecksum(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// ============================================
// VERSION PINNING
// ============================================

export const SUPPORTED_VERSIONS = ['1.0.0', '1.1.0'] as const;
export const CURRENT_VERSION = '1.0.0';
export const DEPRECATED_VERSIONS: string[] = [];

export function isVersionSupported(version: string): boolean {
  return SUPPORTED_VERSIONS.includes(version as typeof SUPPORTED_VERSIONS[number]);
}

export function getVersionWarning(version: string): string | null {
  if (DEPRECATED_VERSIONS.includes(version)) {
    return `Version ${version} is deprecated. Please upgrade to ${CURRENT_VERSION}`;
  }
  if (!isVersionSupported(version)) {
    return `Version ${version} is not supported. Use one of: ${SUPPORTED_VERSIONS.join(', ')}`;
  }
  return null;
}
