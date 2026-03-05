/**
 * GSSE — Strategy Optimizer
 * Multi-objective optimization with Pareto frontier
 */

import type { Scenario, OptimizationObjectives, ObjectiveProfile } from './types';

// ── Pre-built scenarios ──

export const PREDEFINED_SCENARIOS: Scenario[] = [
  { scenarioId: "s001", name: "Sugar Reduction Package",     description: "Sugar tax + ultra-processed food labeling + school food reform",
    healthImpact: 0.72, economicImpact: 0.58, environmentalImpact: 0.22, socialImpact: 0.34, costEfficiency: 0.84, scalability: 0.78, evidenceQuality: 0.81, timeToImpact: 4, totalCostBn: 12, isParetoOptimal: false, paretoRank: 0, compositeScore: 0 },
  { scenarioId: "s002", name: "Active City Transformation",  description: "Urban active transport + green space + walkability policy",
    healthImpact: 0.68, economicImpact: 0.52, environmentalImpact: 0.71, socialImpact: 0.64, costEfficiency: 0.61, scalability: 0.55, evidenceQuality: 0.74, timeToImpact: 6, totalCostBn: 85, isParetoOptimal: false, paretoRank: 0, compositeScore: 0 },
  { scenarioId: "s003", name: "Sleep Health Initiative",     description: "Workplace sleep policy + school start time reform + blue light regulation",
    healthImpact: 0.64, economicImpact: 0.62, environmentalImpact: 0.08, socialImpact: 0.48, costEfficiency: 0.91, scalability: 0.88, evidenceQuality: 0.77, timeToImpact: 2, totalCostBn: 4, isParetoOptimal: false, paretoRank: 0, compositeScore: 0 },
  { scenarioId: "s004", name: "Global Exercise Access",      description: "Resistance training subsidy + community gym program + PE mandate",
    healthImpact: 0.78, economicImpact: 0.61, environmentalImpact: 0.15, socialImpact: 0.55, costEfficiency: 0.72, scalability: 0.66, evidenceQuality: 0.88, timeToImpact: 3, totalCostBn: 28, isParetoOptimal: false, paretoRank: 0, compositeScore: 0 },
  { scenarioId: "s005", name: "Renewable Energy Transition", description: "Accelerated renewable buildout + fossil subsidy removal",
    healthImpact: 0.52, economicImpact: 0.44, environmentalImpact: 0.94, socialImpact: 0.38, costEfficiency: 0.48, scalability: 0.72, evidenceQuality: 0.85, timeToImpact: 8, totalCostBn: 420, isParetoOptimal: false, paretoRank: 0, compositeScore: 0 },
  { scenarioId: "s006", name: "Education Quality Uplift",    description: "Teacher training + curriculum reform + digital equity",
    healthImpact: 0.45, economicImpact: 0.78, environmentalImpact: 0.18, socialImpact: 0.82, costEfficiency: 0.56, scalability: 0.61, evidenceQuality: 0.71, timeToImpact: 12, totalCostBn: 95, isParetoOptimal: false, paretoRank: 0, compositeScore: 0 },
  { scenarioId: "s007", name: "Mental Health Infrastructure", description: "Social prescribing + community mental health + loneliness programs",
    healthImpact: 0.66, economicImpact: 0.54, environmentalImpact: 0.05, socialImpact: 0.78, costEfficiency: 0.79, scalability: 0.71, evidenceQuality: 0.68, timeToImpact: 3, totalCostBn: 18, isParetoOptimal: false, paretoRank: 0, compositeScore: 0 },
  { scenarioId: "s008", name: "Food System Reform",          description: "Ultra-processed food ad ban + school meals + agricultural policy shift",
    healthImpact: 0.74, economicImpact: 0.42, environmentalImpact: 0.55, socialImpact: 0.47, costEfficiency: 0.67, scalability: 0.62, evidenceQuality: 0.76, timeToImpact: 7, totalCostBn: 38, isParetoOptimal: false, paretoRank: 0, compositeScore: 0 },
  { scenarioId: "s009", name: "Nature Access Program",       description: "Urban greening + national park expansion + biophilic design mandate",
    healthImpact: 0.58, economicImpact: 0.38, environmentalImpact: 0.82, socialImpact: 0.66, costEfficiency: 0.55, scalability: 0.50, evidenceQuality: 0.70, timeToImpact: 5, totalCostBn: 52, isParetoOptimal: false, paretoRank: 0, compositeScore: 0 },
  { scenarioId: "s010", name: "Integrated Lifestyle Medicine", description: "Combines exercise + sleep + nutrition + mental health into one framework",
    healthImpact: 0.88, economicImpact: 0.68, environmentalImpact: 0.28, socialImpact: 0.61, costEfficiency: 0.65, scalability: 0.52, evidenceQuality: 0.84, timeToImpact: 4, totalCostBn: 62, isParetoOptimal: false, paretoRank: 0, compositeScore: 0 },
];

// ── Objective profiles ──

export const OBJECTIVE_PROFILES: ObjectiveProfile[] = [
  { label: "Balanced",          weights: { health: 0.30, economic: 0.20, environmental: 0.15, social: 0.15, costEfficiency: 0.12, scalability: 0.08 } },
  { label: "Max Health",        weights: { health: 0.50, economic: 0.15, environmental: 0.10, social: 0.10, costEfficiency: 0.10, scalability: 0.05 } },
  { label: "Max ROI",           weights: { health: 0.20, economic: 0.35, environmental: 0.10, social: 0.10, costEfficiency: 0.20, scalability: 0.05 } },
  { label: "Sustainability",    weights: { health: 0.20, economic: 0.15, environmental: 0.40, social: 0.15, costEfficiency: 0.05, scalability: 0.05 } },
  { label: "Social Equity",     weights: { health: 0.25, economic: 0.15, environmental: 0.15, social: 0.35, costEfficiency: 0.05, scalability: 0.05 } },
];

const OBJ_DIMS = ["Health", "Economic", "Environment", "Social", "Efficiency", "Scalability"] as const;

function dominates(a: Scenario, b: Scenario): boolean {
  const da = [a.healthImpact, a.economicImpact, a.environmentalImpact, a.socialImpact, a.costEfficiency, a.scalability];
  const db = [b.healthImpact, b.economicImpact, b.environmentalImpact, b.socialImpact, b.costEfficiency, b.scalability];
  return da.every((v, i) => v >= db[i]) && da.some((v, i) => v > db[i]);
}

export class StrategyOptimizer {
  private scenarios: Scenario[];

  constructor(scenarios?: Scenario[]) {
    this.scenarios = (scenarios || PREDEFINED_SCENARIOS).map(s => ({ ...s }));
  }

  optimize(objectives?: OptimizationObjectives): Scenario[] {
    const obj = objectives || OBJECTIVE_PROFILES[0].weights;

    for (const s of this.scenarios) {
      s.compositeScore = Math.round((
        s.healthImpact * obj.health +
        s.economicImpact * obj.economic +
        s.environmentalImpact * obj.environmental +
        s.socialImpact * obj.social +
        s.costEfficiency * obj.costEfficiency +
        s.scalability * obj.scalability
      ) * 10000) / 10000;
      s.isParetoOptimal = false;
    }

    // Pareto analysis
    for (const s of this.scenarios) {
      const dominated = this.scenarios.some(
        other => other.scenarioId !== s.scenarioId && dominates(other, s)
      );
      if (!dominated) s.isParetoOptimal = true;
    }

    const ranked = [...this.scenarios].sort((a, b) => b.compositeScore - a.compositeScore);
    ranked.forEach((s, i) => { s.paretoRank = i + 1; });
    return ranked;
  }

  getScenarios(): Scenario[] {
    return this.scenarios;
  }
}
