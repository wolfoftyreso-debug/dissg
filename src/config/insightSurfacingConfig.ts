/**
 * WAVE 6 — BLOCK BA: INSIGHT SURFACING
 * 
 * De viktigaste insikterna flyter upp.
 * Allt annat finns, men djupare ner.
 */

export type InsightSourceType = 'learning' | 'effect' | 'pattern' | 'trend';
export type VisualizationType = 'line_chart' | 'bar_chart' | 'comparison' | 'map' | 'timeline' | 'distribution';

export interface SurfacedInsight {
  id: string;
  insightCode: string;
  
  // Content
  summaryLine: string; // Max 150 tecken
  visualizationType: VisualizationType;
  visualizationConfig: Record<string, unknown>;
  
  // Surfacing criteria
  populationAffected: number;
  isNew: boolean;
  isStable: boolean;
  isReplicated: boolean;
  dataQualityScore: number;
  
  // Priority
  priorityScore: number;
  displayTier: 1 | 2 | 3 | 4 | 5;
  
  // Source
  sourceType: InsightSourceType;
  sourceId: string;
  
  // Links
  whyExplanationId?: string;
  methodDescription: string;
  similarCaseIds: string[];
  
  // Status
  isActive: boolean;
  surfacedAt: string;
  expiresAt?: string;
}

/**
 * Insight surfacing criteria
 */
export interface SurfacingCriteria {
  minPopulationAffected: number;
  minDataQuality: number;
  requireReplication: boolean;
  maxAge: number; // days
  minPriorityScore: number;
}

export const SURFACING_TIERS: Record<number, SurfacingCriteria> = {
  1: {
    minPopulationAffected: 1000000,
    minDataQuality: 0.85,
    requireReplication: true,
    maxAge: 30,
    minPriorityScore: 80
  },
  2: {
    minPopulationAffected: 100000,
    minDataQuality: 0.75,
    requireReplication: true,
    maxAge: 60,
    minPriorityScore: 60
  },
  3: {
    minPopulationAffected: 10000,
    minDataQuality: 0.65,
    requireReplication: false,
    maxAge: 90,
    minPriorityScore: 40
  },
  4: {
    minPopulationAffected: 1000,
    minDataQuality: 0.50,
    requireReplication: false,
    maxAge: 180,
    minPriorityScore: 20
  },
  5: {
    minPopulationAffected: 0,
    minDataQuality: 0.30,
    requireReplication: false,
    maxAge: 365,
    minPriorityScore: 0
  }
};

/**
 * Calculate priority score for an insight
 */
export function calculatePriorityScore(insight: Partial<SurfacedInsight>): number {
  let score = 0;
  
  // Population impact (0-30 points)
  const pop = insight.populationAffected || 0;
  if (pop >= 10000000) score += 30;
  else if (pop >= 1000000) score += 25;
  else if (pop >= 100000) score += 15;
  else if (pop >= 10000) score += 5;
  
  // Novelty (0-20 points)
  if (insight.isNew) score += 20;
  
  // Stability (0-20 points)
  if (insight.isStable) score += 20;
  
  // Replication (0-20 points)
  if (insight.isReplicated) score += 20;
  
  // Data quality (0-10 points)
  score += (insight.dataQualityScore || 0) * 10;
  
  return Math.min(100, score);
}

/**
 * Determine display tier based on priority score and criteria
 */
export function determineDisplayTier(insight: Partial<SurfacedInsight>): 1 | 2 | 3 | 4 | 5 {
  const score = calculatePriorityScore(insight);
  
  for (const [tier, criteria] of Object.entries(SURFACING_TIERS)) {
    if (
      score >= criteria.minPriorityScore &&
      (insight.populationAffected || 0) >= criteria.minPopulationAffected &&
      (insight.dataQualityScore || 0) >= criteria.minDataQuality &&
      (!criteria.requireReplication || insight.isReplicated)
    ) {
      return parseInt(tier) as 1 | 2 | 3 | 4 | 5;
    }
  }
  
  return 5;
}

/**
 * Insight format structure for UI
 */
export interface InsightDisplayFormat {
  summaryLine: string;
  graph: {
    type: VisualizationType;
    config: Record<string, unknown>;
  };
  actions: {
    showWhy: boolean;
    showMethod: boolean;
    showSimilar: boolean;
  };
  metadata: {
    tier: number;
    quality: string;
    lastUpdated: string;
  };
}

export function formatInsightForDisplay(insight: SurfacedInsight): InsightDisplayFormat {
  return {
    summaryLine: insight.summaryLine,
    graph: {
      type: insight.visualizationType,
      config: insight.visualizationConfig
    },
    actions: {
      showWhy: !!insight.whyExplanationId,
      showMethod: !!insight.methodDescription,
      showSimilar: insight.similarCaseIds.length > 0
    },
    metadata: {
      tier: insight.displayTier,
      quality: insight.dataQualityScore >= 0.8 ? 'Hög' : 
               insight.dataQualityScore >= 0.6 ? 'God' : 
               insight.dataQualityScore >= 0.4 ? 'Acceptabel' : 'Låg',
      lastUpdated: insight.surfacedAt
    }
  };
}

/**
 * Insight categories for grouping
 */
export const INSIGHT_CATEGORIES = {
  economic: { label: 'Ekonomi', icon: 'TrendingUp' },
  social: { label: 'Samhälle', icon: 'Users' },
  environmental: { label: 'Miljö', icon: 'Leaf' },
  governance: { label: 'Styrning', icon: 'Building' },
  health: { label: 'Hälsa', icon: 'Heart' },
  education: { label: 'Utbildning', icon: 'GraduationCap' },
  security: { label: 'Säkerhet', icon: 'Shield' }
} as const;

/**
 * Visualization type recommendations based on insight type
 */
export const VISUALIZATION_RECOMMENDATIONS: Record<InsightSourceType, VisualizationType[]> = {
  learning: ['comparison', 'bar_chart', 'map'],
  effect: ['line_chart', 'timeline', 'comparison'],
  pattern: ['distribution', 'map', 'line_chart'],
  trend: ['line_chart', 'bar_chart', 'timeline']
};
