/**
 * SCALE MODE
 * 
 * Precompute structural/historical.
 * Compute on-demand for signals/latest.
 * Response times: boringly fast.
 */

// ============================================
// CACHE LAYERS
// ============================================

export type CacheLayer = 'cold' | 'warm' | 'hot' | 'edge';

export interface CacheConfig {
  layer: CacheLayer;
  ttl_seconds: number;
  precompute: boolean;
  invalidation_trigger: string[];
}

export const CACHE_STRATEGY: Record<string, CacheConfig> = {
  // Cold storage - truth artifacts (immutable)
  truth_nodes: {
    layer: 'cold',
    ttl_seconds: 86400 * 365, // 1 year
    precompute: true,
    invalidation_trigger: ['never'], // immutable
  },
  
  historical_data: {
    layer: 'cold',
    ttl_seconds: 86400 * 365,
    precompute: true,
    invalidation_trigger: ['never'],
  },
  
  // Warm cache - indexes and graphs
  indexes: {
    layer: 'warm',
    ttl_seconds: 3600, // 1 hour
    precompute: true,
    invalidation_trigger: ['new_data', 'version_update'],
  },
  
  decision_graphs: {
    layer: 'warm',
    ttl_seconds: 3600,
    precompute: true,
    invalidation_trigger: ['graph_update'],
  },
  
  // Hot cache - frequently accessed
  top_nodes: {
    layer: 'hot',
    ttl_seconds: 300, // 5 minutes
    precompute: true,
    invalidation_trigger: ['any'],
  },
  
  top_indexes: {
    layer: 'hot',
    ttl_seconds: 300,
    precompute: true,
    invalidation_trigger: ['any'],
  },
  
  // Edge delivery - explorer
  explorer_views: {
    layer: 'edge',
    ttl_seconds: 60, // 1 minute
    precompute: false,
    invalidation_trigger: ['request'],
  },
  
  // On-demand only
  signal_overlays: {
    layer: 'edge',
    ttl_seconds: 30,
    precompute: false,
    invalidation_trigger: ['realtime'],
  },
  
  comparisons: {
    layer: 'edge',
    ttl_seconds: 60,
    precompute: false,
    invalidation_trigger: ['request'],
  },
};

// ============================================
// PRECOMPUTE SCHEDULER
// ============================================

export interface PrecomputeJob {
  job_id: string;
  entity_type: string;
  schedule: 'hourly' | 'daily' | 'weekly' | 'on_change';
  last_run: string | null;
  next_run: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

const PRECOMPUTE_JOBS: PrecomputeJob[] = [
  {
    job_id: 'precompute_indexes',
    entity_type: 'indexes',
    schedule: 'hourly',
    last_run: null,
    next_run: new Date().toISOString(),
    status: 'pending',
  },
  {
    job_id: 'precompute_top_nodes',
    entity_type: 'top_nodes',
    schedule: 'hourly',
    last_run: null,
    next_run: new Date().toISOString(),
    status: 'pending',
  },
  {
    job_id: 'precompute_graphs',
    entity_type: 'decision_graphs',
    schedule: 'daily',
    last_run: null,
    next_run: new Date().toISOString(),
    status: 'pending',
  },
];

export function getPrecomputeJobs(): readonly PrecomputeJob[] {
  return PRECOMPUTE_JOBS;
}

// ============================================
// CACHE INTERFACE
// ============================================

interface CacheEntry<T> {
  data: T;
  cached_at: number;
  ttl: number;
  layer: CacheLayer;
}

const CACHE: Map<string, CacheEntry<unknown>> = new Map();

export function cacheGet<T>(key: string): T | null {
  const entry = CACHE.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.cached_at > entry.ttl * 1000) {
    CACHE.delete(key);
    return null;
  }
  
  return entry.data;
}

export function cacheSet<T>(
  key: string,
  data: T,
  config: CacheConfig
): void {
  CACHE.set(key, {
    data,
    cached_at: Date.now(),
    ttl: config.ttl_seconds,
    layer: config.layer,
  });
}

export function cacheInvalidate(trigger: string): number {
  let invalidated = 0;
  
  for (const [entityType, config] of Object.entries(CACHE_STRATEGY)) {
    if (config.invalidation_trigger.includes(trigger) || 
        config.invalidation_trigger.includes('any')) {
      // Invalidate all keys for this entity type
      for (const key of CACHE.keys()) {
        if (key.startsWith(entityType)) {
          CACHE.delete(key);
          invalidated++;
        }
      }
    }
  }
  
  return invalidated;
}

// ============================================
// PERFORMANCE METRICS
// ============================================

interface PerformanceMetric {
  endpoint: string;
  p50_ms: number;
  p95_ms: number;
  p99_ms: number;
  cache_hit_rate: number;
}

const PERFORMANCE_TARGETS: Record<string, number> = {
  'GET /api/graph/node/:id': 50,    // 50ms target
  'GET /api/graph/nodes': 100,       // 100ms target
  'GET /api/index/:id': 50,
  'GET /api/indexes': 100,
  'GET /api/decision-graph/:id': 100,
  'GET /api/signals': 200,           // signals can be slower
  'GET /api/traverse': 200,
};

export function getPerformanceTargets(): Record<string, number> {
  return { ...PERFORMANCE_TARGETS };
}

// ============================================
// CACHE STATS
// ============================================

export function getCacheStats(): {
  total_entries: number;
  by_layer: Record<CacheLayer, number>;
  memory_estimate_kb: number;
} {
  const byLayer: Record<CacheLayer, number> = {
    cold: 0,
    warm: 0,
    hot: 0,
    edge: 0,
  };
  
  let memoryEstimate = 0;
  
  for (const entry of CACHE.values()) {
    const e = entry as CacheEntry<unknown>;
    byLayer[e.layer]++;
    memoryEstimate += JSON.stringify(e.data).length;
  }
  
  return {
    total_entries: CACHE.size,
    by_layer: byLayer,
    memory_estimate_kb: Math.round(memoryEstimate / 1024),
  };
}
