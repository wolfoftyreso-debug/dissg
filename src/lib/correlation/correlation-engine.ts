/**
 * CORRELATION ENGINE
 * Pure mathematics – no narratives
 */

import type { 
  CorrelationPair, 
  SystemStatement 
} from '@/types/correlation';

/**
 * Calculate Pearson correlation coefficient
 */
export function calculatePearsonCorrelation(
  seriesA: number[],
  seriesB: number[]
): { r: number; pValue: number; n: number } {
  if (seriesA.length !== seriesB.length || seriesA.length < 3) {
    return { r: 0, pValue: 1, n: seriesA.length };
  }

  const n = seriesA.length;
  const meanA = seriesA.reduce((a, b) => a + b, 0) / n;
  const meanB = seriesB.reduce((a, b) => a + b, 0) / n;

  let sumAB = 0;
  let sumA2 = 0;
  let sumB2 = 0;

  for (let i = 0; i < n; i++) {
    const devA = seriesA[i] - meanA;
    const devB = seriesB[i] - meanB;
    sumAB += devA * devB;
    sumA2 += devA * devA;
    sumB2 += devB * devB;
  }

  const denominator = Math.sqrt(sumA2 * sumB2);
  if (denominator === 0) return { r: 0, pValue: 1, n };

  const r = sumAB / denominator;
  
  // Approximate p-value using t-distribution
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const df = n - 2;
  const pValue = approximatePValue(t, df);

  return { r, pValue, n };
}

/**
 * Calculate Spearman rank correlation
 */
export function calculateSpearmanCorrelation(
  seriesA: number[],
  seriesB: number[]
): number {
  if (seriesA.length !== seriesB.length || seriesA.length < 3) {
    return 0;
  }

  const ranksA = getRanks(seriesA);
  const ranksB = getRanks(seriesB);
  
  const { r } = calculatePearsonCorrelation(ranksA, ranksB);
  return r;
}

function getRanks(values: number[]): number[] {
  const indexed = values.map((v, i) => ({ v, i }));
  indexed.sort((a, b) => a.v - b.v);
  
  const ranks = Array.from({ length: values.length }, () => 0);
  for (let i = 0; i < indexed.length; i++) {
    ranks[indexed[i].i] = i + 1;
  }
  return ranks;
}

function approximatePValue(t: number, _df: number): number {
  // Simplified approximation
  const absT = Math.abs(t);
  if (absT < 0.5) return 0.6;
  if (absT < 1) return 0.3;
  if (absT < 2) return 0.1;
  if (absT < 3) return 0.01;
  if (absT < 4) return 0.001;
  return 0.0001;
}

/**
 * Assess correlation stability across subperiods
 */
export function assessStability(
  seriesA: number[],
  seriesB: number[],
  numSubperiods: number = 4
): { stabilityScore: number; subperiodCorrelations: number[] } {
  if (seriesA.length < numSubperiods * 3) {
    return { stabilityScore: 0, subperiodCorrelations: [] };
  }

  const chunkSize = Math.floor(seriesA.length / numSubperiods);
  const subperiodCorrelations: number[] = [];

  for (let i = 0; i < numSubperiods; i++) {
    const start = i * chunkSize;
    const end = i === numSubperiods - 1 ? seriesA.length : (i + 1) * chunkSize;
    
    const chunkA = seriesA.slice(start, end);
    const chunkB = seriesB.slice(start, end);
    
    const { r } = calculatePearsonCorrelation(chunkA, chunkB);
    subperiodCorrelations.push(r);
  }

  // Stability = how consistent the correlation is across subperiods
  const meanR = subperiodCorrelations.reduce((a, b) => a + b, 0) / subperiodCorrelations.length;
  const variance = subperiodCorrelations.reduce((sum, r) => sum + Math.pow(r - meanR, 2), 0) / subperiodCorrelations.length;
  const stdDev = Math.sqrt(variance);

  // High stability = low variance
  const stabilityScore = Math.max(0, 1 - stdDev);

  return { stabilityScore, subperiodCorrelations };
}

/**
 * Detect lead/lag relationship using cross-correlation
 */
export function detectLeadLag(
  seriesA: number[],
  seriesB: number[],
  maxLagDays: number = 90
): { lagDays: number; direction: 'A_leads' | 'B_leads' | 'simultaneous' | 'unclear'; maxCorrelation: number } {
  let maxCorr = -2;
  let bestLag = 0;

  // Test different lags
  for (let lag = -maxLagDays; lag <= maxLagDays; lag += 7) {
    let shiftedA: number[];
    let shiftedB: number[];

    if (lag > 0) {
      shiftedA = seriesA.slice(lag);
      shiftedB = seriesB.slice(0, seriesB.length - lag);
    } else if (lag < 0) {
      shiftedA = seriesA.slice(0, seriesA.length + lag);
      shiftedB = seriesB.slice(-lag);
    } else {
      shiftedA = seriesA;
      shiftedB = seriesB;
    }

    if (shiftedA.length < 10) continue;

    const { r } = calculatePearsonCorrelation(shiftedA, shiftedB);
    if (Math.abs(r) > Math.abs(maxCorr)) {
      maxCorr = r;
      bestLag = lag;
    }
  }

  let direction: 'A_leads' | 'B_leads' | 'simultaneous' | 'unclear';
  if (Math.abs(bestLag) < 14) {
    direction = 'simultaneous';
  } else if (bestLag > 0) {
    direction = 'A_leads';
  } else {
    direction = 'B_leads';
  }

  // If correlation is weak, direction is unclear
  if (Math.abs(maxCorr) < 0.3) {
    direction = 'unclear';
  }

  return { lagDays: bestLag, direction, maxCorrelation: maxCorr };
}

/**
 * Generate system statement (locked vocabulary)
 */
export function generateSystemStatement(pair: CorrelationPair): SystemStatement {
  const absR = Math.abs(pair.correlation);

  // Insufficient data
  if (pair.sampleSize < 10) {
    return { type: 'insufficient_data', reason: `Only ${pair.sampleSize} observations available` };
  }

  // No correlation
  if (absR < 0.2) {
    return { type: 'correlation_absent' };
  }

  // Unstable correlation
  if (pair.stabilityScore < 0.5) {
    return { 
      type: 'correlation_unstable', 
      description: 'Correlation varies significantly across subperiods' 
    };
  }

  // Present correlation
  const strength: 'strong' | 'moderate' | 'weak' = 
    absR >= 0.7 ? 'strong' : 
    absR >= 0.4 ? 'moderate' : 'weak';

  return { 
    type: 'correlation_present', 
    strength, 
    stable: pair.stabilityScore >= 0.7 
  };
}

/**
 * Format correlation for display
 */
export function formatCorrelation(r: number): string {
  const sign = r >= 0 ? '+' : '';
  return `${sign}${r.toFixed(2)}`;
}

/**
 * Classify confidence level
 */
export function classifyConfidence(
  pValue: number,
  sampleSize: number,
  stability: number
): 'high' | 'medium' | 'low' | 'insufficient' {
  if (sampleSize < 10) return 'insufficient';
  if (pValue > 0.1) return 'low';
  if (pValue > 0.05 || stability < 0.5) return 'medium';
  if (pValue <= 0.01 && stability >= 0.7 && sampleSize >= 30) return 'high';
  return 'medium';
}
