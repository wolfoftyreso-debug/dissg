/**
 * GSSE — Global Simulation & Strategy Engine
 * Type definitions for world state, propagation, and optimization
 */

export type GSSEDomain = 'health' | 'economic' | 'environmental' | 'social' | 'behavioral';
export type GSSETrend = 'rising' | 'falling' | 'stable' | 'volatile';

export interface StateVariable {
  varId: string;
  name: string;
  domain: GSSEDomain;
  value: number;
  unit: string;
  trend: GSSETrend;
  confidence: number;
  globalBurden: number;       // 0–1 weight in burden-of-world index
  naturalRange: [number, number];
  description?: string;
  dataSource?: string;
}

export interface CausalEdge {
  target: string;
  strength: number;       // 0–1
  delayLag: number;       // years before effect starts
  delayPeak: number;      // years at max effect
  domain: GSSEDomain;
  direction: 'positive' | 'negative';
}

export type CausalGraph = Record<string, CausalEdge[]>;

export interface PropagatedEffect {
  targetVar: string;
  domain: string;
  delta: number;
  deltaPct: number;
  confidence: number;
  uncertaintyLo: number;
  uncertaintyHi: number;
  causalDepth: number;
  causalPath: string[];
  timeToEffect: Record<number, number>;
  direction: 'positive_impact' | 'negative_impact';
}

export interface InterventionSpec {
  name: string;
  targetVariable: string;
  magnitude: number;
  unit: string;
  timeFrame: number;
  affectedPop: string;
  costBnUsd: number;
  mechanism: string;
  confidencePrior: number;
  reversibility: number;
}

export interface Scenario {
  scenarioId: string;
  name: string;
  description: string;
  healthImpact: number;
  economicImpact: number;
  environmentalImpact: number;
  socialImpact: number;
  costEfficiency: number;
  scalability: number;
  evidenceQuality: number;
  timeToImpact: number;
  totalCostBn: number;
  isParetoOptimal: boolean;
  paretoRank: number;
  compositeScore: number;
}

export interface OptimizationObjectives {
  health: number;
  economic: number;
  environmental: number;
  social: number;
  costEfficiency: number;
  scalability: number;
}

export interface ObjectiveProfile {
  label: string;
  weights: OptimizationObjectives;
}

export interface SimulationResult {
  scenario: string;
  variable: string;
  magnitude: number;
  timeFrame: string;
  nEffects: number;
  topEffects: PropagatedEffect[];
  timeseries: Record<string, Record<number, number>>;
  costBnUsd: number;
}
