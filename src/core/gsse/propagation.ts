/**
 * GSSE — Causal Propagation Engine
 * Propagates intervention effects through the causal graph with:
 *   - Gompertz S-curve time modeling
 *   - Uncertainty accumulation
 *   - Multi-domain cross-effects
 *   - Diminishing returns
 */

import type { PropagatedEffect, InterventionSpec, CausalGraph, CausalEdge } from './types';
import { CROSS_DOMAIN_GRAPH } from './causal-graph';

export const TIME_HORIZONS = [1, 5, 15, 30] as const;
export const TIME_LABELS: Record<number, string> = { 1: "1 yr", 5: "5 yrs", 15: "15 yrs", 30: "30 yrs" };

/** S-curve adoption / effect ramp */
function gompertzRamp(t: number, lag: number, peak: number, decay = 0.05): number {
  if (t <= lag) return 0;
  const tAdj = t - lag;
  const rise = 1 - Math.exp(-0.8 * tAdj);
  const fall = Math.exp(-decay * Math.max(t - peak, 0));
  return Math.min(rise * fall, 1.0);
}

/** Uncertainty grows with causal chain depth and time horizon */
function uncertaintyAccumulate(baseUncertainty: number, depth: number, years: number): number {
  const depthPenalty = 1 + (depth - 1) * 0.12;
  const timePenalty = 1 + years * 0.02;
  const accumulated = 1 - (1 - baseUncertainty) / (depthPenalty * timePenalty);
  return Math.min(Math.round(accumulated * 10000) / 10000, 0.92);
}

export class CausalPropagationEngine {
  private graph: CausalGraph;
  private maxDepth: number;

  constructor(maxDepth = 3) {
    this.graph = CROSS_DOMAIN_GRAPH;
    this.maxDepth = maxDepth;
  }

  propagate(intervention: InterventionSpec): PropagatedEffect[] {
    const effects: PropagatedEffect[] = [];
    const visited = new Set<string>();
    this.bfs(
      intervention.targetVariable,
      intervention.magnitude,
      intervention.confidencePrior,
      0, [intervention.targetVariable],
      effects, visited, intervention.timeFrame,
    );
    effects.sort((a, b) => Math.abs(b.delta) * b.confidence - Math.abs(a.delta) * a.confidence);
    return effects;
  }

  private bfs(
    source: string, magnitude: number, confidence: number,
    depth: number, path: string[],
    effects: PropagatedEffect[], visited: Set<string>, timeFrame: number,
  ) {
    if (depth >= this.maxDepth) return;
    const edges = this.graph[source] || [];

    for (const edge of edges) {
      if (visited.has(edge.target)) continue;
      visited.add(edge.target);

      const pathStrength = edge.strength * (0.85 ** depth);
      const rawDelta = magnitude * pathStrength;
      const baseUncertainty = 1 - confidence * edge.strength;
      const accumulatedUnc = uncertaintyAccumulate(baseUncertainty, depth + 1, timeFrame);
      const finalConfidence = Math.max(0.05, 1 - accumulatedUnc);

      const timeToEffect: Record<number, number> = {};
      for (const t of TIME_HORIZONS) {
        const ramp = gompertzRamp(t, edge.delayLag, edge.delayPeak);
        timeToEffect[t] = Math.round(rawDelta * ramp * 100000) / 100000;
      }

      const spread = Math.abs(rawDelta) * (1 - finalConfidence);
      const direction: 'positive_impact' | 'negative_impact' =
        (rawDelta > 0 && edge.direction === 'positive') ||
        (rawDelta < 0 && edge.direction === 'negative')
          ? 'positive_impact' : 'negative_impact';

      const deltaFinal = edge.direction === 'positive' ? rawDelta : -Math.abs(rawDelta);
      const deltaPct = Math.round(deltaFinal / Math.max(Math.abs(magnitude), 1e-9) * 1000) / 10;

      effects.push({
        targetVar: edge.target,
        domain: edge.domain,
        delta: Math.round(deltaFinal * 100000) / 100000,
        deltaPct,
        confidence: Math.round(finalConfidence * 1000) / 1000,
        uncertaintyLo: Math.round((deltaFinal - spread) * 100000) / 100000,
        uncertaintyHi: Math.round((deltaFinal + spread) * 100000) / 100000,
        causalDepth: depth + 1,
        causalPath: [...path, edge.target],
        timeToEffect,
        direction,
      });

      this.bfs(
        edge.target, rawDelta, finalConfidence,
        depth + 1, [...path, edge.target],
        effects, visited, timeFrame,
      );
    }
  }

  computeTimeseries(effects: PropagatedEffect[]): Record<string, Record<number, number>> {
    const result: Record<string, Record<number, number>> = {};
    for (const e of effects) {
      if (!result[e.domain]) {
        result[e.domain] = Object.fromEntries(TIME_HORIZONS.map(t => [t, 0]));
      }
      for (const t of TIME_HORIZONS) {
        result[e.domain][t] += (e.timeToEffect[t] || 0) * e.confidence;
      }
    }
    for (const dom of Object.keys(result)) {
      for (const t of TIME_HORIZONS) {
        result[dom][t] = Math.round(result[dom][t] * 100000) / 100000;
      }
    }
    return result;
  }
}
