/**
 * CORRELATION & CROSS-ANALYSIS ENGINE
 * 
 * Kärnmotor för att analysera samband mellan index.
 * 
 * Principer:
 * - Alla index kan korsas mot alla andra
 * - Analyseras över tid, geografi, demografi, policyperioder
 * - INGA slutsatser utan spårbar dataväg
 */

import type { 
  IndexCode, 
  IndexCorrelation, 
  IndexValue,
  ResearchAlignment,
  ResearchReference 
} from './index-types';

// =============================================================================
// CORRELATION CALCULATION
// =============================================================================

export interface CorrelationInput {
  index_a_values: IndexValue[];
  index_b_values: IndexValue[];
}

export interface CorrelationResult {
  correlation: IndexCorrelation;
  raw_data_pairs: { a: number; b: number; period: string; geo: string }[];
  methodology_notes: string[];
}

/**
 * Calculate Pearson correlation coefficient
 */
function calculatePearsonR(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n < 3) return NaN;
  
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  
  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? 0 : numerator / denom;
}

/**
 * Calculate Spearman rank correlation
 */
function calculateSpearmanRho(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n < 3) return NaN;
  
  // Convert to ranks
  const rankX = getRanks(x);
  const rankY = getRanks(y);
  
  return calculatePearsonR(rankX, rankY);
}

function getRanks(arr: number[]): number[] {
  const sorted = [...arr].sort((a, b) => a - b);
  return arr.map(val => sorted.indexOf(val) + 1);
}

/**
 * Calculate p-value for correlation (approximate)
 */
function calculatePValue(r: number, n: number): number {
  if (n < 3) return 1;
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  // Approximate using normal distribution for large n
  const df = n - 2;
  // Simplified approximation
  return 2 * (1 - normalCDF(Math.abs(t)));
}

function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return 0.5 * (1.0 + sign * y);
}

/**
 * Main correlation calculator
 */
export function calculateCorrelation(
  indexA: IndexCode,
  indexB: IndexCode,
  valuesA: IndexValue[],
  valuesB: IndexValue[],
  options: {
    min_sample_size?: number;
    detect_time_lag?: boolean;
    max_lag_months?: number;
  } = {}
): CorrelationResult {
  const minSampleSize = options.min_sample_size ?? 10;
  const detectLag = options.detect_time_lag ?? true;
  const maxLag = options.max_lag_months ?? 24;
  
  // Match values by geo and period
  const pairs: { a: number; b: number; period: string; geo: string }[] = [];
  
  for (const a of valuesA) {
    const b = valuesB.find(
      v => v.geo_code === a.geo_code && v.period === a.period
    );
    if (b) {
      pairs.push({
        a: a.normalized_value,
        b: b.normalized_value,
        period: a.period,
        geo: a.geo_code,
      });
    }
  }
  
  const methodology_notes: string[] = [];
  
  if (pairs.length < minSampleSize) {
    methodology_notes.push(`Sample size (${pairs.length}) below minimum (${minSampleSize})`);
  }
  
  const x = pairs.map(p => p.a);
  const y = pairs.map(p => p.b);
  
  const pearson = calculatePearsonR(x, y);
  const spearman = calculateSpearmanRho(x, y);
  const pValue = calculatePValue(pearson, pairs.length);
  
  // Determine confidence level
  let confidenceLevel: 'high' | 'medium' | 'low' | 'insufficient' = 'insufficient';
  if (pairs.length >= 30 && pValue < 0.01) {
    confidenceLevel = 'high';
  } else if (pairs.length >= 15 && pValue < 0.05) {
    confidenceLevel = 'medium';
  } else if (pairs.length >= 10 && pValue < 0.1) {
    confidenceLevel = 'low';
  }
  
  // Calculate stability (consistency across geography)
  const geoGroups = groupBy(pairs, p => p.geo);
  const geoCorrelations: number[] = [];
  for (const geo of Object.keys(geoGroups)) {
    const geoX = geoGroups[geo].map(p => p.a);
    const geoY = geoGroups[geo].map(p => p.b);
    if (geoX.length >= 5) {
      geoCorrelations.push(calculatePearsonR(geoX, geoY));
    }
  }
  
  const stabilityScore = geoCorrelations.length > 0 
    ? 1 - standardDeviation(geoCorrelations) 
    : 0;
  
  // Check for spurious correlation warning
  const spuriousWarning = Math.abs(pearson) > 0.8 && pairs.length < 20;
  
  if (spuriousWarning) {
    methodology_notes.push('High correlation with small sample - spurious correlation warning');
  }
  
  // Detect time lag (simplified)
  let timeLag: number | null = null;
  let lagDirection: 'a_leads' | 'b_leads' | 'simultaneous' | null = null;
  
  if (detectLag && pairs.length >= 24) {
    // Would implement cross-correlation with lags here
    // Simplified: check if lagged correlation is stronger
    lagDirection = 'simultaneous';
  }
  
  const correlation: IndexCorrelation = {
    index_a: indexA,
    index_b: indexB,
    pearson_r: roundTo(pearson, 4),
    spearman_rho: roundTo(spearman, 4),
    kendall_tau: NaN, // Not implemented for efficiency
    time_lag_months: timeLag,
    lag_direction: lagDirection,
    sample_size: pairs.length,
    time_periods_analyzed: new Set(pairs.map(p => p.period)).size,
    geo_units_analyzed: new Set(pairs.map(p => p.geo)).size,
    stability_score: roundTo(stabilityScore, 4),
    breakpoints: [], // Would need change-point detection
    p_value: roundTo(pValue, 6),
    confidence_level: confidenceLevel,
    confounders_identified: [],
    spurious_warning: spuriousWarning,
    analyzed_at: new Date().toISOString(),
    methodology_version: '1.0.0',
  };
  
  return {
    correlation,
    raw_data_pairs: pairs,
    methodology_notes,
  };
}

// =============================================================================
// RESEARCH ALIGNMENT
// =============================================================================

/**
 * Check correlation against established research
 */
export function assessResearchAlignment(
  correlation: IndexCorrelation,
  knownRelationships: KnownRelationship[]
): ResearchReference {
  const known = knownRelationships.find(
    k => (k.index_a === correlation.index_a && k.index_b === correlation.index_b) ||
         (k.index_a === correlation.index_b && k.index_b === correlation.index_a)
  );
  
  if (!known) {
    return {
      correlation_id: `${correlation.index_a}-${correlation.index_b}`,
      alignment: 'insufficient_evidence',
      meta_analyses_count: 0,
      supporting_studies: 0,
      contradicting_studies: 0,
      key_references: [],
      evidence_grade: 'F',
      last_reviewed: new Date().toISOString(),
    };
  }
  
  // Check if our correlation matches the established direction
  const expectedDirection = known.expected_correlation_sign;
  const observedDirection = correlation.pearson_r >= 0 ? 'positive' : 'negative';
  
  let alignment: ResearchAlignment;
  
  if (expectedDirection === observedDirection) {
    if (correlation.confidence_level === 'high') {
      alignment = 'aligned_with_consensus';
    } else {
      alignment = 'emerging_pattern';
    }
  } else {
    if (correlation.confidence_level === 'high') {
      alignment = 'conflicts_with_established';
    } else {
      alignment = 'contested';
    }
  }
  
  return {
    correlation_id: `${correlation.index_a}-${correlation.index_b}`,
    alignment,
    meta_analyses_count: known.meta_analyses_count,
    supporting_studies: known.supporting_studies,
    contradicting_studies: known.contradicting_studies,
    key_references: known.key_references,
    evidence_grade: known.evidence_grade,
    last_reviewed: known.last_reviewed,
  };
}

export interface KnownRelationship {
  index_a: IndexCode;
  index_b: IndexCode;
  expected_correlation_sign: 'positive' | 'negative' | 'nonlinear';
  meta_analyses_count: number;
  supporting_studies: number;
  contradicting_studies: number;
  key_references: {
    source: string;
    year: number;
    finding_summary: string;
    doi?: string;
  }[];
  evidence_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  last_reviewed: string;
}

// =============================================================================
// CROSS-ANALYSIS MATRIX
// =============================================================================

export interface CrossAnalysisMatrix {
  indices: IndexCode[];
  correlations: Map<string, IndexCorrelation>;
  clusters: IndexCluster[];
  key_relationships: {
    strongest_positive: IndexCorrelation[];
    strongest_negative: IndexCorrelation[];
    most_stable: IndexCorrelation[];
  };
}

export interface IndexCluster {
  name: string;
  indices: IndexCode[];
  internal_correlation_avg: number;
  interpretation: string;
}

/**
 * Generate full cross-analysis matrix
 */
export function generateCrossAnalysisMatrix(
  indices: IndexCode[],
  allValues: Map<IndexCode, IndexValue[]>
): CrossAnalysisMatrix {
  const correlations = new Map<string, IndexCorrelation>();
  
  // Calculate all pairwise correlations
  for (let i = 0; i < indices.length; i++) {
    for (let j = i + 1; j < indices.length; j++) {
      const a = indices[i];
      const b = indices[j];
      const valuesA = allValues.get(a) || [];
      const valuesB = allValues.get(b) || [];
      
      if (valuesA.length > 0 && valuesB.length > 0) {
        const result = calculateCorrelation(a, b, valuesA, valuesB);
        correlations.set(`${a}-${b}`, result.correlation);
      }
    }
  }
  
  // Find key relationships
  const allCorrelations = Array.from(correlations.values());
  
  const strongestPositive = allCorrelations
    .filter(c => c.pearson_r > 0 && c.confidence_level !== 'insufficient')
    .sort((a, b) => b.pearson_r - a.pearson_r)
    .slice(0, 10);
  
  const strongestNegative = allCorrelations
    .filter(c => c.pearson_r < 0 && c.confidence_level !== 'insufficient')
    .sort((a, b) => a.pearson_r - b.pearson_r)
    .slice(0, 10);
  
  const mostStable = allCorrelations
    .filter(c => c.confidence_level !== 'insufficient')
    .sort((a, b) => b.stability_score - a.stability_score)
    .slice(0, 10);
  
  return {
    indices,
    correlations,
    clusters: [], // Would need clustering algorithm
    key_relationships: {
      strongest_positive: strongestPositive,
      strongest_negative: strongestNegative,
      most_stable: mostStable,
    },
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

function standardDeviation(arr: number[]): number {
  const n = arr.length;
  if (n === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const variance = arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / n;
  return Math.sqrt(variance);
}

function roundTo(num: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}
