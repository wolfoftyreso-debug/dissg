/**
 * DIAGNOSTIC ENGINE UTILITIES
 */

import type { ProbableCause, DiagnosticScopeLevel } from './types';

export function generateSessionId(code: string): string {
  return `DIAG-${code}-${new Date().toISOString().slice(0, 10)}`;
}

export function computeUncertainty(causes: ProbableCause[]): number {
  const totalProb = causes.reduce((s, c) => s + c.probability, 0);
  return Math.max(0, 100 - totalProb);
}

export function rankCauses(causes: ProbableCause[]): ProbableCause[] {
  return [...causes].sort((a, b) => b.probability - a.probability);
}

export function computeLambda(level: DiagnosticScopeLevel): number {
  const baseLambda: Record<DiagnosticScopeLevel, number> = {
    global: 0.78,
    continent: 0.81,
    country: 0.82,
    region: 0.85,
    municipality: 0.88,
    city: 0.87,
  };
  return baseLambda[level] ?? 0.80;
}

export function determineLambdaStatus(lambda: number): 'within_tolerance' | 'warning' | 'critical' {
  if (lambda >= 0.95 || lambda <= 0.5) return 'critical';
  if (lambda >= 0.90 || lambda <= 0.7) return 'warning';
  return 'within_tolerance';
}

/**
 * Brier score for a single prediction.
 * Lower is better: 0 = perfect, 1 = worst.
 */
export function brierScore(predictedProbability: number, actualOutcome: boolean): number {
  const outcome = actualOutcome ? 1 : 0;
  return Math.pow(predictedProbability - outcome, 2);
}

/**
 * Mean Brier score across a set of predictions.
 */
export function meanBrierScore(predictions: { probability: number; outcome: boolean }[]): number {
  if (predictions.length === 0) return 0;
  const total = predictions.reduce((s, p) => s + brierScore(p.probability, p.outcome), 0);
  return total / predictions.length;
}

/**
 * Calibration bucket analysis.
 * Groups predictions into bins and compares predicted vs actual rates.
 */
export function calibrationBuckets(
  predictions: { probability: number; outcome: boolean }[],
  bucketCount = 10
): { binStart: number; binEnd: number; avgPredicted: number; avgActual: number; count: number }[] {
  const buckets: { predicted: number[]; actual: boolean[] }[] = Array.from(
    { length: bucketCount },
    () => ({ predicted: [], actual: [] })
  );

  for (const p of predictions) {
    const idx = Math.min(Math.floor(p.probability * bucketCount), bucketCount - 1);
    buckets[idx].predicted.push(p.probability);
    buckets[idx].actual.push(p.outcome);
  }

  return buckets.map((b, i) => ({
    binStart: i / bucketCount,
    binEnd: (i + 1) / bucketCount,
    avgPredicted: b.predicted.length > 0 ? b.predicted.reduce((s, v) => s + v, 0) / b.predicted.length : 0,
    avgActual: b.actual.length > 0 ? b.actual.filter(Boolean).length / b.actual.length : 0,
    count: b.predicted.length,
  }));
}
