/**
 * UNDERPERFORMANCE & WASTE DETECTOR
 * 
 * Jämför regioners resursinsats mot faktiska utfall.
 * Identifierar systematisk över-/underprestation.
 * 
 * Output är neutralt och observationsbaserat:
 * - "Underpresterar trots hög resursinsats"
 * - "Överpresterar trots låg resursinsats"
 * - "Strukturellt låst system"
 */

import type { 
  PerformanceAnalysis, 
  PerformanceClass,
  IndexValue 
} from './index-types';

// =============================================================================
// TYPES
// =============================================================================

export interface PerformanceInput {
  geo_code: string;
  sector: string;
  period: string;
  
  // Resource inputs (normalized 0-100)
  spending_per_capita: number;
  staff_per_capita: number;
  infrastructure_score: number;
  
  // Outcomes (normalized 0-100)
  outcome_metrics: {
    code: string;
    value: number;
    weight: number;
  }[];
}

export interface PeerGroup {
  name: string;
  geo_codes: string[];
  selection_criteria: string;
}

export interface HistoricalPattern {
  geo_code: string;
  period: string;
  resource_input: number;
  outcome: number;
  performance_class: PerformanceClass;
  what_followed: string;
  years_later: number;
}

// =============================================================================
// CLASSIFICATION LOGIC
// =============================================================================

const RESOURCE_THRESHOLD_HIGH = 60;
const RESOURCE_THRESHOLD_LOW = 40;
const OUTCOME_THRESHOLD_HIGH = 60;
const OUTCOME_THRESHOLD_LOW = 40;

/**
 * Classify performance based on resource input vs outcome
 */
export function classifyPerformance(
  resourcePercentile: number,
  outcomePercentile: number,
  trendYears: number = 5,
  trendDirection: 'improving' | 'stable' | 'declining' = 'stable'
): PerformanceClass {
  const highResource = resourcePercentile >= RESOURCE_THRESHOLD_HIGH;
  const lowResource = resourcePercentile <= RESOURCE_THRESHOLD_LOW;
  const highOutcome = outcomePercentile >= OUTCOME_THRESHOLD_HIGH;
  const lowOutcome = outcomePercentile <= OUTCOME_THRESHOLD_LOW;
  
  // Structural lock: high resources, low outcomes, declining for 5+ years
  if (highResource && lowOutcome && trendDirection === 'declining' && trendYears >= 5) {
    return 'structurally_locked';
  }
  
  if (highResource && lowOutcome) {
    return 'underperforming_high_resource';
  }
  
  if (lowResource && highOutcome) {
    return 'overperforming_low_resource';
  }
  
  if (highResource && highOutcome) {
    return 'overperforming_high_resource';
  }
  
  if (lowResource && lowOutcome) {
    return 'underperforming_low_resource';
  }
  
  // Default to insufficient data if in middle ranges
  return 'insufficient_data';
}

// =============================================================================
// ANALYSIS ENGINE
// =============================================================================

/**
 * Calculate efficiency ratio
 */
function calculateEfficiencyRatio(outcome: number, input: number): number {
  if (input === 0) return 0;
  return outcome / input;
}

/**
 * Find peer group statistics
 */
function calculatePeerGroupStats(
  allInputs: PerformanceInput[],
  peerGroup: PeerGroup
): {
  median_resource: number;
  median_outcome: number;
  best_performer: string;
  best_outcome: number;
} {
  const peers = allInputs.filter(i => peerGroup.geo_codes.includes(i.geo_code));
  
  if (peers.length === 0) {
    return {
      median_resource: 50,
      median_outcome: 50,
      best_performer: '',
      best_outcome: 0,
    };
  }
  
  const resources = peers.map(p => 
    (p.spending_per_capita + p.staff_per_capita + p.infrastructure_score) / 3
  ).sort((a, b) => a - b);
  
  const outcomes = peers.map(p => {
    const totalWeight = p.outcome_metrics.reduce((sum, m) => sum + m.weight, 0);
    return p.outcome_metrics.reduce((sum, m) => sum + m.value * m.weight, 0) / totalWeight;
  });
  
  const outcomesWithGeo = peers.map((p, i) => ({ geo: p.geo_code, outcome: outcomes[i] }));
  const best = outcomesWithGeo.sort((a, b) => b.outcome - a.outcome)[0];
  
  return {
    median_resource: resources[Math.floor(resources.length / 2)],
    median_outcome: outcomes.sort((a, b) => a - b)[Math.floor(outcomes.length / 2)],
    best_performer: best.geo,
    best_outcome: best.outcome,
  };
}

/**
 * Main performance analysis
 */
export function analyzePerformance(
  input: PerformanceInput,
  allInputs: PerformanceInput[],
  peerGroup: PeerGroup,
  historicalPatterns: HistoricalPattern[] = []
): PerformanceAnalysis {
  // Calculate resource input index (average of normalized inputs)
  const resourceIndex = (
    input.spending_per_capita + 
    input.staff_per_capita + 
    input.infrastructure_score
  ) / 3;
  
  // Calculate outcome index (weighted average)
  const totalWeight = input.outcome_metrics.reduce((sum, m) => sum + m.weight, 0);
  const outcomeIndex = input.outcome_metrics.reduce(
    (sum, m) => sum + m.value * m.weight, 0
  ) / totalWeight;
  
  // Calculate percentiles globally
  const allResources = allInputs.map(i => 
    (i.spending_per_capita + i.staff_per_capita + i.infrastructure_score) / 3
  ).sort((a, b) => a - b);
  
  const allOutcomes = allInputs.map(i => {
    const tw = i.outcome_metrics.reduce((sum, m) => sum + m.weight, 0);
    return i.outcome_metrics.reduce((sum, m) => sum + m.value * m.weight, 0) / tw;
  }).sort((a, b) => a - b);
  
  const resourcePercentile = (allResources.filter(r => r < resourceIndex).length / allResources.length) * 100;
  const outcomePercentile = (allOutcomes.filter(o => o < outcomeIndex).length / allOutcomes.length) * 100;
  
  // Peer group analysis
  const peerStats = calculatePeerGroupStats(allInputs, peerGroup);
  
  // Calculate global median
  const globalMedianResource = allResources[Math.floor(allResources.length / 2)];
  const globalMedianOutcome = allOutcomes[Math.floor(allOutcomes.length / 2)];
  
  // Performance classification
  const performanceClass = classifyPerformance(resourcePercentile, outcomePercentile);
  
  // Efficiency ratio
  const efficiencyRatio = calculateEfficiencyRatio(outcomeIndex, resourceIndex);
  
  // Find similar historical patterns
  const similarPatterns = historicalPatterns
    .filter(hp => 
      Math.abs(hp.resource_input - resourceIndex) < 10 &&
      Math.abs(hp.outcome - outcomeIndex) < 10
    )
    .slice(0, 5);
  
  return {
    geo_code: input.geo_code,
    sector: input.sector,
    period: input.period,
    
    resource_input_index: roundTo(resourceIndex, 2),
    resource_percentile: roundTo(resourcePercentile, 1),
    
    outcome_index: roundTo(outcomeIndex, 2),
    outcome_percentile: roundTo(outcomePercentile, 1),
    
    performance_class: performanceClass,
    efficiency_ratio: roundTo(efficiencyRatio, 3),
    
    vs_global_median: roundTo(outcomeIndex - globalMedianOutcome, 2),
    vs_peer_group_median: roundTo(outcomeIndex - peerStats.median_outcome, 2),
    peer_group: peerGroup.geo_codes,
    best_performer_in_peer_group: peerStats.best_performer,
    
    outcome_gap_to_best: roundTo(peerStats.best_outcome - outcomeIndex, 2),
    resource_gap_to_best: 0, // Would need best performer's resource data
    
    performance_trend_5y: 'stable', // Would need historical data
    similar_historical_patterns: similarPatterns.map(hp => ({
      geo_code: hp.geo_code,
      period: hp.period,
      eventual_outcome: hp.what_followed,
    })),
    
    analyzed_at: new Date().toISOString(),
    methodology_version: '1.0.0',
  };
}

// =============================================================================
// BATCH ANALYSIS
// =============================================================================

export interface SectorAnalysis {
  sector: string;
  period: string;
  
  // Aggregated findings
  total_regions_analyzed: number;
  underperforming_high_resource_count: number;
  overperforming_low_resource_count: number;
  structurally_locked_count: number;
  
  // Rankings
  most_efficient: { geo_code: string; efficiency_ratio: number }[];
  least_efficient: { geo_code: string; efficiency_ratio: number }[];
  
  // Total waste estimate
  estimated_resource_waste_percent: number;
}

/**
 * Analyze entire sector across regions
 */
export function analyzeSector(
  inputs: PerformanceInput[],
  sector: string,
  peerGroups: Map<string, PeerGroup>
): SectorAnalysis {
  const sectorInputs = inputs.filter(i => i.sector === sector);
  
  const analyses = sectorInputs.map(input => {
    const peerGroup = peerGroups.get(input.geo_code) || {
      name: 'global',
      geo_codes: inputs.map(i => i.geo_code),
      selection_criteria: 'all regions',
    };
    return analyzePerformance(input, inputs, peerGroup);
  });
  
  const underperformingHighResource = analyses.filter(
    a => a.performance_class === 'underperforming_high_resource'
  );
  
  const overperformingLowResource = analyses.filter(
    a => a.performance_class === 'overperforming_low_resource'
  );
  
  const structurallyLocked = analyses.filter(
    a => a.performance_class === 'structurally_locked'
  );
  
  // Sort by efficiency
  const byEfficiency = [...analyses].sort(
    (a, b) => b.efficiency_ratio - a.efficiency_ratio
  );
  
  // Estimate waste (simplified)
  const avgEfficiency = analyses.reduce((sum, a) => sum + a.efficiency_ratio, 0) / analyses.length;
  const maxEfficiency = Math.max(...analyses.map(a => a.efficiency_ratio));
  const wastePercent = maxEfficiency > 0 ? ((maxEfficiency - avgEfficiency) / maxEfficiency) * 100 : 0;
  
  return {
    sector,
    period: sectorInputs[0]?.period || '',
    
    total_regions_analyzed: analyses.length,
    underperforming_high_resource_count: underperformingHighResource.length,
    overperforming_low_resource_count: overperformingLowResource.length,
    structurally_locked_count: structurallyLocked.length,
    
    most_efficient: byEfficiency.slice(0, 5).map(a => ({
      geo_code: a.geo_code,
      efficiency_ratio: a.efficiency_ratio,
    })),
    least_efficient: byEfficiency.slice(-5).reverse().map(a => ({
      geo_code: a.geo_code,
      efficiency_ratio: a.efficiency_ratio,
    })),
    
    estimated_resource_waste_percent: roundTo(wastePercent, 1),
  };
}

// =============================================================================
// PRESENTATION HELPERS
// =============================================================================

export function getPerformanceClassLabel(
  performanceClass: PerformanceClass,
  language: 'sv' | 'en' = 'sv'
): string {
  const labels: Record<PerformanceClass, { sv: string; en: string }> = {
    'overperforming_low_resource': {
      sv: 'Överpresterar trots låg resursinsats',
      en: 'Overperforming despite low resource input',
    },
    'overperforming_high_resource': {
      sv: 'Presterar enligt förväntan med hög insats',
      en: 'Performing as expected with high input',
    },
    'underperforming_high_resource': {
      sv: 'Underpresterar trots hög resursinsats',
      en: 'Underperforming despite high resource input',
    },
    'underperforming_low_resource': {
      sv: 'Underpresterar med låg resursinsats',
      en: 'Underperforming with low resource input',
    },
    'structurally_locked': {
      sv: 'Strukturellt låst system',
      en: 'Structurally locked system',
    },
    'insufficient_data': {
      sv: 'Otillräcklig data för klassificering',
      en: 'Insufficient data for classification',
    },
  };
  
  return labels[performanceClass][language];
}

export function getPerformanceColor(performanceClass: PerformanceClass): string {
  const colors: Record<PerformanceClass, string> = {
    'overperforming_low_resource': '#22c55e', // green
    'overperforming_high_resource': '#3b82f6', // blue
    'underperforming_high_resource': '#ef4444', // red
    'underperforming_low_resource': '#f97316', // orange
    'structurally_locked': '#7c3aed', // purple
    'insufficient_data': '#6b7280', // gray
  };
  
  return colors[performanceClass];
}

// =============================================================================
// UTILITIES
// =============================================================================

function roundTo(num: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}
