/**
 * GLOBAL RELEVANCE LAYER v2
 * Block AA: Only THE MOST IMPORTANT shows first
 * 
 * Multi-signal fusion = your secret weapon
 */

// ============================================================================
// MULTI-SIGNAL RELEVANCE MODEL
// ============================================================================

export interface RelevanceSignal {
  id: string;
  name: string;
  description: string;
  weight: number;
  source: SignalSource;
  refresh_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

export type SignalSource = 
  | 'kpi_data'
  | 'index_data'
  | 'event_graph'
  | 'news_intensity'
  | 'user_behavior'
  | 'expert_rating'
  | 'search_volume';

export const RELEVANCE_SIGNALS: RelevanceSignal[] = [
  // KPI-based signals
  {
    id: 'kpi_impact',
    name: 'KPI Impact',
    description: 'How much does this KPI affect people/systems',
    weight: 0.20,
    source: 'kpi_data',
    refresh_frequency: 'daily',
  },
  {
    id: 'kpi_acceleration',
    name: 'Change Acceleration',
    description: 'Is the rate of change speeding up or slowing down',
    weight: 0.15,
    source: 'kpi_data',
    refresh_frequency: 'daily',
  },
  {
    id: 'kpi_breadth',
    name: 'Geographic Breadth',
    description: 'How many regions/groups are affected',
    weight: 0.12,
    source: 'kpi_data',
    refresh_frequency: 'daily',
  },
  {
    id: 'kpi_persistence',
    name: 'Trend Persistence',
    description: 'How long has the trend continued',
    weight: 0.10,
    source: 'kpi_data',
    refresh_frequency: 'daily',
  },
  {
    id: 'kpi_confidence',
    name: 'Data Confidence',
    description: 'How reliable is the underlying data',
    weight: 0.08,
    source: 'kpi_data',
    refresh_frequency: 'weekly',
  },
  
  // Event-based signals
  {
    id: 'event_severity',
    name: 'Event Severity',
    description: 'Severity of related events',
    weight: 0.10,
    source: 'event_graph',
    refresh_frequency: 'hourly',
  },
  {
    id: 'event_recency',
    name: 'Event Recency',
    description: 'How recent are related events',
    weight: 0.05,
    source: 'event_graph',
    refresh_frequency: 'hourly',
  },
  
  // News-based signals
  {
    id: 'news_volume',
    name: 'News Volume',
    description: 'Volume of related news coverage',
    weight: 0.08,
    source: 'news_intensity',
    refresh_frequency: 'hourly',
  },
  {
    id: 'news_acceleration',
    name: 'News Acceleration',
    description: 'Change in news volume',
    weight: 0.05,
    source: 'news_intensity',
    refresh_frequency: 'hourly',
  },
  
  // User-based signals (anonymous)
  {
    id: 'user_interest',
    name: 'User Interest',
    description: 'Anonymous aggregate user interest',
    weight: 0.05,
    source: 'user_behavior',
    refresh_frequency: 'hourly',
  },
  
  // Search signals
  {
    id: 'search_trend',
    name: 'Search Trend',
    description: 'Public search interest trends',
    weight: 0.02,
    source: 'search_volume',
    refresh_frequency: 'daily',
  },
];

// ============================================================================
// RELEVANCE SCORING v2
// ============================================================================

export interface RelevanceInputV2 {
  object_id: string;
  object_type: 'kpi' | 'country' | 'region' | 'index' | 'event';
  
  // KPI signals
  kpi_signals?: {
    current_value: number;
    previous_value: number;
    change_percent: number;
    trend_months: number;
    affected_population?: number;
    confidence: number;
    geo_coverage: number;
  };
  
  // Event signals
  event_signals?: {
    active_events: number;
    max_severity: number;
    most_recent_days: number;
  };
  
  // News signals
  news_signals?: {
    articles_24h: number;
    articles_7d: number;
    volume_change_percent: number;
    source_diversity: number;
  };
  
  // User signals (anonymous aggregates)
  user_signals?: {
    views_24h: number;
    views_trend: number;
    saves: number;
  };
  
  // Search signals
  search_signals?: {
    search_volume: number;
    search_trend: number;
  };
}

export interface RelevanceScoreV2 {
  object_id: string;
  object_type: string;
  
  // Individual signal scores (0-100)
  signal_scores: Record<string, number>;
  
  // Weighted total (0-100)
  total_score: number;
  
  // Percentile rank
  percentile: number;
  
  // Tier classification
  tier: 'critical' | 'high' | 'medium' | 'low' | 'background';
  
  // Explanation
  top_factors: { signal: string; contribution: number; explanation: string }[];
  
  // Meta
  calculated_at: string;
  signal_version: string;
  data_freshness: Record<string, string>;
}

export function calculateRelevanceV2(input: RelevanceInputV2): RelevanceScoreV2 {
  const signal_scores: Record<string, number> = {};
  const contributions: { signal: string; contribution: number; explanation: string }[] = [];
  
  // Calculate KPI signals
  if (input.kpi_signals) {
    const kpi = input.kpi_signals;
    
    // Impact score
    const impactScore = Math.min(100, 
      50 + (kpi.affected_population || 0) / 1000000 * 5 + 
      Math.abs(kpi.change_percent) * 2
    );
    signal_scores['kpi_impact'] = impactScore;
    
    // Acceleration score
    const accelerationScore = Math.min(100, 50 + Math.abs(kpi.change_percent) * 3);
    signal_scores['kpi_acceleration'] = accelerationScore;
    
    // Breadth score
    const breadthScore = kpi.geo_coverage * 100;
    signal_scores['kpi_breadth'] = breadthScore;
    
    // Persistence score
    const persistenceScore = Math.min(100, kpi.trend_months * 8);
    signal_scores['kpi_persistence'] = persistenceScore;
    
    // Confidence score
    signal_scores['kpi_confidence'] = kpi.confidence * 100;
  }
  
  // Calculate event signals
  if (input.event_signals) {
    const events = input.event_signals;
    
    // Event severity
    signal_scores['event_severity'] = events.max_severity * 10;
    
    // Event recency (higher score for more recent)
    signal_scores['event_recency'] = Math.max(0, 100 - events.most_recent_days * 5);
  }
  
  // Calculate news signals
  if (input.news_signals) {
    const news = input.news_signals;
    
    // News volume (log scale)
    signal_scores['news_volume'] = Math.min(100, Math.log10(news.articles_7d + 1) * 25);
    
    // News acceleration
    signal_scores['news_acceleration'] = Math.min(100, 50 + news.volume_change_percent / 2);
  }
  
  // Calculate user signals
  if (input.user_signals) {
    const user = input.user_signals;
    signal_scores['user_interest'] = Math.min(100, Math.log10(user.views_24h + 1) * 20);
  }
  
  // Calculate search signals
  if (input.search_signals) {
    const search = input.search_signals;
    signal_scores['search_trend'] = Math.min(100, search.search_trend * 10);
  }
  
  // Fill missing signals with neutral value
  for (const signal of RELEVANCE_SIGNALS) {
    if (signal_scores[signal.id] === undefined) {
      signal_scores[signal.id] = 50;
    }
  }
  
  // Calculate weighted total
  let total_score = 0;
  for (const signal of RELEVANCE_SIGNALS) {
    const score = signal_scores[signal.id] || 50;
    const contribution = score * signal.weight;
    total_score += contribution;
    
    contributions.push({
      signal: signal.name,
      contribution,
      explanation: `${signal.name}: ${score.toFixed(0)} × ${(signal.weight * 100).toFixed(0)}% = ${contribution.toFixed(1)}`,
    });
  }
  
  // Sort contributions by impact
  contributions.sort((a, b) => b.contribution - a.contribution);
  
  // Determine tier
  let tier: 'critical' | 'high' | 'medium' | 'low' | 'background';
  if (total_score >= 80) tier = 'critical';
  else if (total_score >= 65) tier = 'high';
  else if (total_score >= 50) tier = 'medium';
  else if (total_score >= 35) tier = 'low';
  else tier = 'background';
  
  return {
    object_id: input.object_id,
    object_type: input.object_type,
    signal_scores,
    total_score: Math.round(total_score * 10) / 10,
    percentile: 0, // Would be calculated across all objects
    tier,
    top_factors: contributions.slice(0, 5),
    calculated_at: new Date().toISOString(),
    signal_version: '2.0.0',
    data_freshness: {},
  };
}

// ============================================================================
// FRONT PAGE PRIORITIZATION
// ============================================================================

export interface FrontPageConfig {
  max_critical_items: number;
  max_high_items: number;
  max_medium_items: number;
  refresh_interval_ms: number;
  personalization_weight: number;
}

export const DEFAULT_FRONT_PAGE_CONFIG: FrontPageConfig = {
  max_critical_items: 3,
  max_high_items: 7,
  max_medium_items: 10,
  refresh_interval_ms: 60000, // 1 minute
  personalization_weight: 0.2,
};

export interface FrontPageContent {
  critical: RelevanceScoreV2[];
  high: RelevanceScoreV2[];
  medium: RelevanceScoreV2[];
  
  // Meta
  generated_at: string;
  next_refresh: string;
  total_scored: number;
}

export function generateFrontPage(
  scores: RelevanceScoreV2[],
  config: FrontPageConfig = DEFAULT_FRONT_PAGE_CONFIG
): FrontPageContent {
  // Sort by total score
  const sorted = [...scores].sort((a, b) => b.total_score - a.total_score);
  
  // Filter by tier
  const critical = sorted.filter(s => s.tier === 'critical').slice(0, config.max_critical_items);
  const high = sorted.filter(s => s.tier === 'high').slice(0, config.max_high_items);
  const medium = sorted.filter(s => s.tier === 'medium').slice(0, config.max_medium_items);
  
  const now = new Date();
  const nextRefresh = new Date(now.getTime() + config.refresh_interval_ms);
  
  return {
    critical,
    high,
    medium,
    generated_at: now.toISOString(),
    next_refresh: nextRefresh.toISOString(),
    total_scored: scores.length,
  };
}

// ============================================================================
// PERSONALIZATION (ANONYMOUS)
// ============================================================================

export interface UserContext {
  // Anonymous preferences
  preferred_geo_codes?: string[];
  preferred_categories?: string[];
  preferred_kpis?: string[];
  
  // Interaction history (anonymous)
  recent_views?: { object_id: string; timestamp: string }[];
  
  // Role-based
  role?: 'citizen' | 'analyst' | 'policy_maker' | 'journalist' | 'researcher';
}

export function applyPersonalization(
  scores: RelevanceScoreV2[],
  context: UserContext,
  weight: number = 0.2
): RelevanceScoreV2[] {
  return scores.map(score => {
    let boost = 0;
    
    // Boost preferred geo
    if (context.preferred_geo_codes?.some(geo => score.object_id.includes(geo))) {
      boost += 10;
    }
    
    // Boost preferred categories
    if (context.preferred_categories?.some(cat => score.object_id.includes(cat))) {
      boost += 10;
    }
    
    // Role-based boosts
    if (context.role === 'policy_maker') {
      // Boost policy-relevant items
      if (score.object_type === 'index') boost += 5;
    }
    
    const adjustedScore = score.total_score + boost * weight;
    
    return {
      ...score,
      total_score: Math.min(100, adjustedScore),
    };
  });
}

// ============================================================================
// REAL-TIME UPDATES
// ============================================================================

export interface RelevanceUpdate {
  object_id: string;
  signal_id: string;
  old_value: number;
  new_value: number;
  timestamp: string;
}

export interface RelevanceStream {
  subscribe: (callback: (update: RelevanceUpdate) => void) => () => void;
  getLatest: (object_id: string) => RelevanceScoreV2 | undefined;
}

// Stream would be implemented with WebSocket or SSE in practice
export function createRelevanceStream(): RelevanceStream {
  const subscribers: ((update: RelevanceUpdate) => void)[] = [];
  const cache = new Map<string, RelevanceScoreV2>();
  
  return {
    subscribe: (callback) => {
      subscribers.push(callback);
      return () => {
        const index = subscribers.indexOf(callback);
        if (index > -1) subscribers.splice(index, 1);
      };
    },
    getLatest: (object_id) => cache.get(object_id),
  };
}

console.log('[Relevance Layer v2] Loaded with', RELEVANCE_SIGNALS.length, 'signals');
