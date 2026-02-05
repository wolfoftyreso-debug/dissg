/**
 * CROSS-DOMAIN COUPLING ENGINE
 * 
 * Visa: samvariation, tidsförskjutning, styrka
 * Visa aldrig: orsak, skuld, lösning
 */

import type { TruthNode } from '../types';

// Coupling relationship - NEVER causal
export interface Coupling {
  coupling_id: string;
  source_node: string;
  target_node: string;
  source_domain: string;
  target_domain: string;
  
  // What we show
  correlation: number;        // -1 to 1
  lag_periods: number;        // Positive = source leads
  strength: CouplingStrength;
  stability: number;          // How consistent over time
  
  // What we explicitly don't claim
  causality_claimed: false;   // ALWAYS false
  direction_claimed: false;   // ALWAYS false
  
  // Methodology
  method: 'pearson' | 'spearman' | 'dcca';
  window_size: number;
  confidence_interval: [number, number];
  
  // Required caveats
  caveats: string[];
}

type CouplingStrength = 'weak' | 'moderate' | 'strong' | 'very_strong';

// Domain pairs we analyze
export const DOMAIN_PAIRS: Array<[string, string]> = [
  ['health', 'economy'],
  ['demographics', 'healthcare'],
  ['signals', 'stability'],
  ['economy', 'demographics'],
  ['health', 'demographics'],
  ['healthcare', 'economy'],
];

// FORBIDDEN language in coupling descriptions
const FORBIDDEN_TERMS = [
  'causes',
  'caused by',
  'leads to',
  'results in',
  'because',
  'therefore',
  'blame',
  'fault',
  'responsible',
  'solution',
  'fix',
  'solve',
];

/**
 * Calculate Pearson correlation
 */
function pearsonCorrelation(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 3) return 0;
  
  const aSlice = a.slice(-n);
  const bSlice = b.slice(-n);
  
  const aMean = aSlice.reduce((s, v) => s + v, 0) / n;
  const bMean = bSlice.reduce((s, v) => s + v, 0) / n;
  
  let numerator = 0;
  let aVar = 0;
  let bVar = 0;
  
  for (let i = 0; i < n; i++) {
    const aDiff = aSlice[i] - aMean;
    const bDiff = bSlice[i] - bMean;
    numerator += aDiff * bDiff;
    aVar += aDiff * aDiff;
    bVar += bDiff * bDiff;
  }
  
  const denominator = Math.sqrt(aVar * bVar);
  return denominator > 0 ? numerator / denominator : 0;
}

/**
 * Calculate lagged correlation
 */
function laggedCorrelation(
  source: number[], 
  target: number[], 
  maxLag: number
): { lag: number; correlation: number }[] {
  const results: { lag: number; correlation: number }[] = [];
  
  for (let lag = -maxLag; lag <= maxLag; lag++) {
    let a: number[];
    let b: number[];
    
    if (lag >= 0) {
      a = source.slice(0, source.length - lag);
      b = target.slice(lag);
    } else {
      a = source.slice(-lag);
      b = target.slice(0, target.length + lag);
    }
    
    if (a.length >= 6 && b.length >= 6) {
      results.push({
        lag,
        correlation: pearsonCorrelation(a, b),
      });
    }
  }
  
  return results;
}

/**
 * Find optimal lag
 */
function findOptimalLag(
  source: number[],
  target: number[],
  maxLag: number = 12
): { lag: number; correlation: number } {
  const lagged = laggedCorrelation(source, target, maxLag);
  if (lagged.length === 0) return { lag: 0, correlation: 0 };
  
  return lagged.reduce((best, current) => 
    Math.abs(current.correlation) > Math.abs(best.correlation) ? current : best
  );
}

/**
 * Classify coupling strength
 */
function classifyStrength(correlation: number): CouplingStrength {
  const abs = Math.abs(correlation);
  if (abs >= 0.7) return 'very_strong';
  if (abs >= 0.5) return 'strong';
  if (abs >= 0.3) return 'moderate';
  return 'weak';
}

/**
 * Calculate stability of correlation over time
 */
function calculateStability(
  source: number[],
  target: number[],
  windowSize: number = 24
): number {
  if (source.length < windowSize * 2) return 0;
  
  const correlations: number[] = [];
  
  for (let i = 0; i <= source.length - windowSize; i += 6) {
    const aWindow = source.slice(i, i + windowSize);
    const bWindow = target.slice(i, i + windowSize);
    correlations.push(pearsonCorrelation(aWindow, bWindow));
  }
  
  if (correlations.length < 2) return 0;
  
  // Stability = 1 - coefficient of variation of correlations
  const mean = correlations.reduce((a, b) => a + b, 0) / correlations.length;
  const std = Math.sqrt(
    correlations.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / correlations.length
  );
  
  return Math.max(0, 1 - (std / Math.max(Math.abs(mean), 0.1)));
}

/**
 * Generate required caveats
 */
function generateCaveats(
  correlation: number,
  stability: number,
  lag: number,
  sourceLength: number
): string[] {
  const caveats: string[] = [
    'Co-movement does not imply causation',
  ];
  
  if (Math.abs(correlation) < 0.5) {
    caveats.push('Relationship strength is limited');
  }
  
  if (stability < 0.6) {
    caveats.push('Relationship stability varies over time');
  }
  
  if (Math.abs(lag) > 6) {
    caveats.push('Time displacement exceeds 6 periods');
  }
  
  if (sourceLength < 60) {
    caveats.push('Limited time series length may affect reliability');
  }
  
  caveats.push('Third-factor confounding cannot be excluded');
  
  return caveats;
}

/**
 * Calculate confidence interval for correlation
 */
function correlationCI(r: number, n: number, _confidence: number = 0.95): [number, number] {
  if (n < 4) return [-1, 1];
  
  // Fisher z-transformation
  const z = 0.5 * Math.log((1 + r) / (1 - r));
  const se = 1 / Math.sqrt(n - 3);
  const zCrit = 1.96; // 95% CI
  
  const zLower = z - zCrit * se;
  const zUpper = z + zCrit * se;
  
  // Back-transform
  const lower = (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1);
  const upper = (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1);
  
  return [
    Math.max(-1, Math.round(lower * 100) / 100),
    Math.min(1, Math.round(upper * 100) / 100),
  ];
}

/**
 * MAIN: Detect coupling between two nodes
 */
export function detectCoupling(
  sourceNode: TruthNode,
  targetNode: TruthNode,
  sourceDomain: string,
  targetDomain: string
): Coupling | null {
  const minLength = Math.min(sourceNode.values.length, targetNode.values.length);
  if (minLength < 12) return null;
  
  // Find optimal lag
  const { lag, correlation } = findOptimalLag(
    sourceNode.values,
    targetNode.values
  );
  
  // Skip weak correlations
  if (Math.abs(correlation) < 0.2) return null;
  
  const stability = calculateStability(
    sourceNode.values,
    targetNode.values
  );
  
  return {
    coupling_id: `coupling:${sourceNode.id}:${targetNode.id}`,
    source_node: sourceNode.id,
    target_node: targetNode.id,
    source_domain: sourceDomain,
    target_domain: targetDomain,
    
    correlation: Math.round(correlation * 1000) / 1000,
    lag_periods: lag,
    strength: classifyStrength(correlation),
    stability: Math.round(stability * 100) / 100,
    
    causality_claimed: false,
    direction_claimed: false,
    
    method: 'pearson',
    window_size: minLength,
    confidence_interval: correlationCI(correlation, minLength),
    
    caveats: generateCaveats(correlation, stability, lag, minLength),
  };
}

/**
 * Detect all couplings between node sets
 */
export function detectAllCouplings(
  nodesByDomain: Map<string, TruthNode[]>
): Coupling[] {
  const couplings: Coupling[] = [];
  
  for (const [domainA, domainB] of DOMAIN_PAIRS) {
    const nodesA = nodesByDomain.get(domainA) || [];
    const nodesB = nodesByDomain.get(domainB) || [];
    
    for (const nodeA of nodesA) {
      for (const nodeB of nodesB) {
        // Only couple nodes with same geo scope
        if (nodeA.scope.geo_code !== nodeB.scope.geo_code) continue;
        
        const coupling = detectCoupling(nodeA, nodeB, domainA, domainB);
        if (coupling) {
          couplings.push(coupling);
        }
      }
    }
  }
  
  return couplings.sort((a, b) => 
    Math.abs(b.correlation) - Math.abs(a.correlation)
  );
}

/**
 * Format coupling for display (never causal language)
 */
export function formatCoupling(coupling: Coupling): string {
  const direction = coupling.correlation > 0 ? 'positive' : 'negative';
  const lagText = coupling.lag_periods === 0 
    ? 'simultaneous'
    : coupling.lag_periods > 0
      ? `source leads by ${coupling.lag_periods} periods`
      : `target leads by ${Math.abs(coupling.lag_periods)} periods`;
  
  return `${coupling.strength} ${direction} co-movement (r=${coupling.correlation.toFixed(2)}), ${lagText}`;
}

/**
 * Validate that text contains no forbidden terms
 */
export function validateNoCausality(text: string): boolean {
  const lower = text.toLowerCase();
  return !FORBIDDEN_TERMS.some(term => lower.includes(term));
}
