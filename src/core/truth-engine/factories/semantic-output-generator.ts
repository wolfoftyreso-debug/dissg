/**
 * SEMANTIC OUTPUT GENERATOR
 * 
 * Maskingenererar förklaringar direkt från data.
 * Ingen människa skriver text här.
 * Om generatorn inte kan fylla ett fält → "insufficient data"
 */

import type { TruthNode } from '../types';

// Semantic Output structure - all fields machine-generated
export interface SemanticOutput {
  // Core observation
  baseline: BaselineStatement;
  deviation: DeviationStatement;
  direction: DirectionStatement;
  magnitude: MagnitudeStatement;
  persistence: PersistenceStatement;
  
  // Context
  coupling: CouplingStatement[];
  uncertainty: UncertaintyStatement;
  
  // Meta
  generated_at: string;
  data_coverage: number;
  generator_version: string;
}

interface BaselineStatement {
  available: boolean;
  reference_period?: string;
  reference_value?: number;
  reference_method?: 'historical_mean' | 'peer_median' | 'target';
  text?: string;
}

interface DeviationStatement {
  available: boolean;
  absolute?: number;
  relative_percent?: number;
  sigma?: number; // Standard deviations from baseline
  text?: string;
}

interface DirectionStatement {
  available: boolean;
  trend?: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  trend_period?: string;
  confidence?: number;
  text?: string;
}

interface MagnitudeStatement {
  available: boolean;
  classification?: 'minimal' | 'moderate' | 'substantial' | 'extreme';
  percentile?: number;
  text?: string;
}

interface PersistenceStatement {
  available: boolean;
  duration_months?: number;
  is_reverting?: boolean;
  stability?: number; // 0-1
  text?: string;
}

interface CouplingStatement {
  related_indicator: string;
  correlation: number;
  lag_months: number;
  text: string;
}

interface UncertaintyStatement {
  data_quality: 'high' | 'medium' | 'low' | 'insufficient';
  coverage: number;
  sources_count: number;
  confidence_interval?: [number, number];
  caveats: string[];
}

/**
 * Calculate baseline from historical data
 */
function calculateBaseline(
  values: number[],
  time_points: string[]
): BaselineStatement {
  if (values.length < 12) {
    return { available: false };
  }
  
  // Use first 60% as baseline period
  const baselineEnd = Math.floor(values.length * 0.6);
  const baselineValues = values.slice(0, baselineEnd);
  const mean = baselineValues.reduce((a, b) => a + b, 0) / baselineValues.length;
  
  return {
    available: true,
    reference_period: `${time_points[0]} to ${time_points[baselineEnd - 1]}`,
    reference_value: Math.round(mean * 100) / 100,
    reference_method: 'historical_mean',
    text: `Baseline: ${mean.toFixed(2)} (${time_points[0]}–${time_points[baselineEnd - 1]})`,
  };
}

/**
 * Calculate deviation from baseline
 */
function calculateDeviation(
  values: number[],
  baseline: BaselineStatement
): DeviationStatement {
  if (!baseline.available || !baseline.reference_value) {
    return { available: false };
  }
  
  const current = values[values.length - 1];
  const absolute = current - baseline.reference_value;
  const relative = (absolute / baseline.reference_value) * 100;
  
  // Calculate standard deviation for sigma
  const baselineEnd = Math.floor(values.length * 0.6);
  const baselineValues = values.slice(0, baselineEnd);
  const std = Math.sqrt(
    baselineValues.reduce((sum, v) => 
      sum + Math.pow(v - baseline.reference_value!, 2), 0
    ) / baselineValues.length
  );
  const sigma = std > 0 ? absolute / std : 0;
  
  return {
    available: true,
    absolute: Math.round(absolute * 100) / 100,
    relative_percent: Math.round(relative * 10) / 10,
    sigma: Math.round(sigma * 100) / 100,
    text: `${relative >= 0 ? '+' : ''}${relative.toFixed(1)}% from baseline (${sigma.toFixed(1)}σ)`,
  };
}

/**
 * Detect trend direction
 */
function detectDirection(values: number[]): DirectionStatement {
  if (values.length < 6) {
    return { available: false };
  }
  
  // Simple linear regression on last 12 points
  const recent = values.slice(-12);
  const n = recent.length;
  const xMean = (n - 1) / 2;
  const yMean = recent.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (recent[i] - yMean);
    denominator += Math.pow(i - xMean, 2);
  }
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const normalizedSlope = yMean !== 0 ? slope / Math.abs(yMean) : 0;
  
  // Classify trend
  let trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  const volatility = calculateVolatility(recent);
  
  if (volatility > 0.3) {
    trend = 'volatile';
  } else if (Math.abs(normalizedSlope) < 0.01) {
    trend = 'stable';
  } else if (normalizedSlope > 0) {
    trend = 'increasing';
  } else {
    trend = 'decreasing';
  }
  
  // Calculate R² as confidence
  const predictions = recent.map((_, i) => yMean + slope * (i - xMean));
  const ssRes = recent.reduce((sum, v, i) => sum + Math.pow(v - predictions[i], 2), 0);
  const ssTot = recent.reduce((sum, v) => sum + Math.pow(v - yMean, 2), 0);
  const rSquared = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;
  
  return {
    available: true,
    trend,
    trend_period: 'last_12_periods',
    confidence: Math.round(rSquared * 100) / 100,
    text: `Trend: ${trend} (confidence: ${(rSquared * 100).toFixed(0)}%)`,
  };
}

function calculateVolatility(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return mean !== 0 ? Math.sqrt(variance) / Math.abs(mean) : 0;
}

/**
 * Classify magnitude
 */
function classifyMagnitude(deviation: DeviationStatement): MagnitudeStatement {
  if (!deviation.available || deviation.sigma === undefined) {
    return { available: false };
  }
  
  const absSigma = Math.abs(deviation.sigma);
  let classification: 'minimal' | 'moderate' | 'substantial' | 'extreme';
  
  if (absSigma < 1) classification = 'minimal';
  else if (absSigma < 2) classification = 'moderate';
  else if (absSigma < 3) classification = 'substantial';
  else classification = 'extreme';
  
  // Convert sigma to approximate percentile
  const percentile = Math.round(
    (1 - Math.exp(-0.5 * absSigma * absSigma) * 0.5) * 100
  );
  
  return {
    available: true,
    classification,
    percentile,
    text: `Magnitude: ${classification} (${percentile}th percentile)`,
  };
}

/**
 * Analyze persistence
 */
function analyzePersistence(
  values: number[],
  baseline: BaselineStatement
): PersistenceStatement {
  if (!baseline.available || !baseline.reference_value || values.length < 6) {
    return { available: false };
  }
  
  // Count consecutive periods above/below baseline
  const recent = values.slice(-24);
  let consecutiveAbove = 0;
  let consecutiveBelow = 0;
  
  for (let i = recent.length - 1; i >= 0; i--) {
    if (recent[i] > baseline.reference_value) {
      if (consecutiveBelow === 0) consecutiveAbove++;
      else break;
    } else {
      if (consecutiveAbove === 0) consecutiveBelow++;
      else break;
    }
  }
  
  const duration = Math.max(consecutiveAbove, consecutiveBelow);
  
  // Check if reverting (last 3 points moving back toward baseline)
  const last3 = recent.slice(-3);
  const distToBaseline = last3.map(v => Math.abs(v - baseline.reference_value!));
  const isReverting = distToBaseline[2] < distToBaseline[0];
  
  // Stability = consistency of direction
  const stability = duration / Math.min(24, values.length);
  
  return {
    available: true,
    duration_months: duration,
    is_reverting: isReverting,
    stability: Math.round(stability * 100) / 100,
    text: `Persisting ${duration} periods${isReverting ? ', showing reversion' : ''}`,
  };
}

/**
 * Assess uncertainty
 */
function assessUncertainty(
  values: number[],
  sourcesCount: number
): UncertaintyStatement {
  const coverage = Math.min(1, values.length / 120); // vs 10 years monthly
  
  let quality: 'high' | 'medium' | 'low' | 'insufficient';
  if (coverage >= 0.8 && sourcesCount >= 2) quality = 'high';
  else if (coverage >= 0.5 && sourcesCount >= 1) quality = 'medium';
  else if (coverage >= 0.25) quality = 'low';
  else quality = 'insufficient';
  
  const caveats: string[] = [];
  if (coverage < 0.5) caveats.push('Limited time series coverage');
  if (sourcesCount < 2) caveats.push('Single source dependency');
  if (values.length < 12) caveats.push('Insufficient data for trend analysis');
  
  return {
    data_quality: quality,
    coverage: Math.round(coverage * 100) / 100,
    sources_count: sourcesCount,
    caveats,
  };
}

/**
 * MAIN GENERATOR
 */
export function generateSemanticOutput(
  node: TruthNode,
  relatedNodes?: TruthNode[]
): SemanticOutput {
  const values = node.values;
  const time_points = generateTimePoints(node.scope.time_range, values.length);
  
  // Generate all components
  const baseline = calculateBaseline(values, time_points);
  const deviation = calculateDeviation(values, baseline);
  const direction = detectDirection(values);
  const magnitude = classifyMagnitude(deviation);
  const persistence = analyzePersistence(values, baseline);
  const uncertainty = assessUncertainty(values, 1); // Simplified
  
  // Generate coupling statements if related nodes provided
  const coupling: CouplingStatement[] = [];
  if (relatedNodes) {
    for (const related of relatedNodes.slice(0, 3)) {
      const corr = calculateCorrelation(values, related.values);
      if (Math.abs(corr) > 0.3) {
        coupling.push({
          related_indicator: related.id,
          correlation: Math.round(corr * 100) / 100,
          lag_months: 0, // Simplified
          text: `Co-movement with ${related.id}: ${corr > 0 ? '+' : ''}${(corr * 100).toFixed(0)}%`,
        });
      }
    }
  }
  
  return {
    baseline,
    deviation,
    direction,
    magnitude,
    persistence,
    coupling,
    uncertainty,
    generated_at: new Date().toISOString(),
    data_coverage: uncertainty.coverage,
    generator_version: '1.0.0',
  };
}

function generateTimePoints(range: { start: string; end: string }, count: number): string[] {
  const start = new Date(range.start);
  const points: string[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(start);
    date.setMonth(date.getMonth() + i);
    points.push(date.toISOString().substring(0, 7));
  }
  return points;
}

function calculateCorrelation(a: number[], b: number[]): number {
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
 * Batch generation
 */
export function generateSemanticOutputBatch(
  nodes: TruthNode[]
): Map<string, SemanticOutput> {
  const outputs = new Map<string, SemanticOutput>();
  
  for (const node of nodes) {
    const otherNodes = nodes.filter(n => n.id !== node.id);
    outputs.set(node.id, generateSemanticOutput(node, otherNodes));
  }
  
  return outputs;
}
