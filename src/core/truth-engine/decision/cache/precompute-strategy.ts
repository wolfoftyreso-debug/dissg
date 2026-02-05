/**
 * PRECOMPUTE & CACHE STRATEGY
 * 
 * Speed = Power. Sub-200ms responses make us default.
 * 
 * Strategy:
 * - Precompute popular Answer Packets
 * - Cache Decision Graphs per context
 * - Warm indices (rolling windows)
 * - Edge-cache diagram specs
 */

/**
 * Cache configuration
 */
export interface CacheConfig {
  /** TTL for Answer Packets in seconds */
  answer_packet_ttl: number;
  /** TTL for Decision Graph results in seconds */
  decision_graph_ttl: number;
  /** TTL for Index values in seconds */
  index_ttl: number;
  /** TTL for diagram specs in seconds */
  chart_spec_ttl: number;
  /** Max cache entries */
  max_entries: number;
}

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  answer_packet_ttl: 3600, // 1 hour
  decision_graph_ttl: 1800, // 30 minutes
  index_ttl: 300, // 5 minutes
  chart_spec_ttl: 7200, // 2 hours
  max_entries: 10000,
};

/**
 * Precompute priorities
 */
export interface PrecomputePriority {
  decision_type: string;
  contexts: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  refresh_interval_minutes: number;
}

export const PRECOMPUTE_PRIORITIES: PrecomputePriority[] = [
  // Critical: Always fresh
  {
    decision_type: 'system_stability',
    contexts: ['SE', 'NO', 'DK', 'FI'],
    priority: 'critical',
    refresh_interval_minutes: 5,
  },
  {
    decision_type: 'capacity_planning',
    contexts: ['healthcare:SE', 'healthcare:NO'],
    priority: 'critical',
    refresh_interval_minutes: 15,
  },
  
  // High: Refresh hourly
  {
    decision_type: 'investment_feasibility',
    contexts: ['energy:SE', 'tech:SE', 'infrastructure:SE'],
    priority: 'high',
    refresh_interval_minutes: 60,
  },
  {
    decision_type: 'market_exposure',
    contexts: ['equities:global', 'bonds:EU'],
    priority: 'high',
    refresh_interval_minutes: 30,
  },
  
  // Medium: Refresh every 4 hours
  {
    decision_type: 'policy_impact',
    contexts: ['education:SE', 'healthcare:SE'],
    priority: 'medium',
    refresh_interval_minutes: 240,
  },
  {
    decision_type: 'regional_comparison',
    contexts: ['SE', 'NO', 'DK'],
    priority: 'medium',
    refresh_interval_minutes: 240,
  },
  
  // Low: Refresh daily
  {
    decision_type: 'intervention_evaluation',
    contexts: ['*'],
    priority: 'low',
    refresh_interval_minutes: 1440,
  },
];

/**
 * Index warming configuration
 */
export interface IndexWarmConfig {
  index_type: string;
  rolling_window_days: number;
  granularity: 'hourly' | 'daily' | 'weekly';
  precompute_aggregations: ('mean' | 'std' | 'percentiles' | 'trend')[];
}

export const INDEX_WARM_CONFIG: IndexWarmConfig[] = [
  {
    index_type: 'stability',
    rolling_window_days: 90,
    granularity: 'daily',
    precompute_aggregations: ['mean', 'std', 'percentiles', 'trend'],
  },
  {
    index_type: 'volatility',
    rolling_window_days: 30,
    granularity: 'hourly',
    precompute_aggregations: ['mean', 'std', 'percentiles'],
  },
  {
    index_type: 'load',
    rolling_window_days: 7,
    granularity: 'hourly',
    precompute_aggregations: ['mean', 'percentiles', 'trend'],
  },
  {
    index_type: 'growth',
    rolling_window_days: 365,
    granularity: 'daily',
    precompute_aggregations: ['mean', 'trend'],
  },
];

/**
 * Cache key generation
 */
export function generateCacheKey(
  type: 'answer_packet' | 'decision_graph' | 'index' | 'chart_spec',
  ...parts: string[]
): string {
  return `${type}:${parts.join(':')}`;
}

/**
 * In-memory cache implementation (simple LRU)
 */
export class PrecomputeCache {
  private cache = new Map<string, { value: unknown; expires: number }>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
  }

  set(key: string, value: unknown, ttl?: number): void {
    // Evict if at capacity
    if (this.cache.size >= this.config.max_entries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    const expires = Date.now() + (ttl || this.config.answer_packet_ttl) * 1000;
    this.cache.set(key, { value, expires });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  invalidate(pattern: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  clear(): void {
    this.cache.clear();
  }

  stats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0, // Would track hits/misses in production
    };
  }
}

/**
 * Global cache instance
 */
export const precomputeCache = new PrecomputeCache();

/**
 * CACHE STRATEGY PRINCIPLES
 */
export const CACHE_PRINCIPLES = {
  goal: 'Sub-200ms responses',
  why: 'Speed = Power. Faster than thinking makes us default.',
  
  strategy: {
    precompute: 'Popular Answer Packets',
    cache: 'Decision Graphs per context',
    warm: 'Indices with rolling windows',
    edge: 'Diagram specs at edge',
  },
  
  never_cache: [
    'User-specific preferences',
    'Real-time trading data',
    'Authentication tokens',
  ],
  
  invalidation: {
    on_data_update: true,
    on_schema_change: true,
    max_staleness_seconds: 3600,
  },
} as const;
