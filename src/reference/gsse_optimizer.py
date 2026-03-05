"""
GSSE — Strategy Optimizer
Multi-objective optimization over intervention scenarios.
Finds Pareto-optimal strategies across:
  - Health impact
  - Economic impact
  - Environmental impact
  - Cost efficiency
  - Scalability
  - Evidence quality
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Optional
import math


# ─────────────────────────────────────────────────────────────
# SCENARIO DEFINITION
# ─────────────────────────────────────────────────────────────

@dataclass
class Scenario:
    scenario_id:  str
    name:         str
    description:  str
    interventions: list  # list of InterventionSpec
    # Computed after running
    health_impact:      float = 0.0   # 0-1, higher = better
    economic_impact:    float = 0.0   # 0-1, higher = better (cost savings / growth)
    environmental_impact: float = 0.0
    social_impact:      float = 0.0
    cost_efficiency:    float = 0.0   # impact per USD
    scalability:        float = 0.0   # 0-1
    evidence_quality:   float = 0.0   # 0-1
    time_to_impact:     int   = 5     # years to meaningful effect
    total_cost_bn:      float = 0.0
    is_pareto_optimal:  bool  = False
    pareto_rank:        int   = 0
    composite_score:    float = 0.0


# ─────────────────────────────────────────────────────────────
# PRE-BUILT SCENARIOS
# ─────────────────────────────────────────────────────────────

PREDEFINED_SCENARIOS: list[Scenario] = [
    Scenario(
        scenario_id="s001", name="Sugar Reduction Package",
        description="Sugar tax + ultra-processed food labeling + school food reform",
        interventions=[],
        health_impact=0.72, economic_impact=0.58, environmental_impact=0.22,
        social_impact=0.34, cost_efficiency=0.84, scalability=0.78,
        evidence_quality=0.81, time_to_impact=4, total_cost_bn=12.0,
    ),
    Scenario(
        scenario_id="s002", name="Active City Transformation",
        description="Urban active transport + green space + walkability policy",
        interventions=[],
        health_impact=0.68, economic_impact=0.52, environmental_impact=0.71,
        social_impact=0.64, cost_efficiency=0.61, scalability=0.55,
        evidence_quality=0.74, time_to_impact=6, total_cost_bn=85.0,
    ),
    Scenario(
        scenario_id="s003", name="Sleep Health Initiative",
        description="Workplace sleep policy + school start time reform + blue light regulation",
        interventions=[],
        health_impact=0.64, economic_impact=0.62, environmental_impact=0.08,
        social_impact=0.48, cost_efficiency=0.91, scalability=0.88,
        evidence_quality=0.77, time_to_impact=2, total_cost_bn=4.0,
    ),
    Scenario(
        scenario_id="s004", name="Global Exercise Access",
        description="Resistance training subsidy + community gym program + PE mandate",
        interventions=[],
        health_impact=0.78, economic_impact=0.61, environmental_impact=0.15,
        social_impact=0.55, cost_efficiency=0.72, scalability=0.66,
        evidence_quality=0.88, time_to_impact=3, total_cost_bn=28.0,
    ),
    Scenario(
        scenario_id="s005", name="Renewable Energy Transition",
        description="Accelerated renewable buildout + fossil subsidy removal",
        interventions=[],
        health_impact=0.52, economic_impact=0.44, environmental_impact=0.94,
        social_impact=0.38, cost_efficiency=0.48, scalability=0.72,
        evidence_quality=0.85, time_to_impact=8, total_cost_bn=420.0,
    ),
    Scenario(
        scenario_id="s006", name="Education Quality Uplift",
        description="Teacher training + curriculum reform + digital equity",
        interventions=[],
        health_impact=0.45, economic_impact=0.78, environmental_impact=0.18,
        social_impact=0.82, cost_efficiency=0.56, scalability=0.61,
        evidence_quality=0.71, time_to_impact=12, total_cost_bn=95.0,
    ),
    Scenario(
        scenario_id="s007", name="Mental Health Infrastructure",
        description="Social prescribing + community mental health + loneliness programs",
        interventions=[],
        health_impact=0.66, economic_impact=0.54, environmental_impact=0.05,
        social_impact=0.78, cost_efficiency=0.79, scalability=0.71,
        evidence_quality=0.68, time_to_impact=3, total_cost_bn=18.0,
    ),
    Scenario(
        scenario_id="s008", name="Food System Reform",
        description="Ultra-processed food ad ban + school meals + agricultural policy shift",
        interventions=[],
        health_impact=0.74, economic_impact=0.42, environmental_impact=0.55,
        social_impact=0.47, cost_efficiency=0.67, scalability=0.62,
        evidence_quality=0.76, time_to_impact=7, total_cost_bn=38.0,
    ),
    Scenario(
        scenario_id="s009", name="Nature Access Program",
        description="Urban greening + national park expansion + biophilic design mandate",
        interventions=[],
        health_impact=0.58, economic_impact=0.38, environmental_impact=0.82,
        social_impact=0.66, cost_efficiency=0.55, scalability=0.50,
        evidence_quality=0.70, time_to_impact=5, total_cost_bn=52.0,
    ),
    Scenario(
        scenario_id="s010", name="Integrated Lifestyle Medicine",
        description="Combines exercise + sleep + nutrition + mental health into one framework",
        interventions=[],
        health_impact=0.88, economic_impact=0.68, environmental_impact=0.28,
        social_impact=0.61, cost_efficiency=0.65, scalability=0.52,
        evidence_quality=0.84, time_to_impact=4, total_cost_bn=62.0,
    ),
]


# ─────────────────────────────────────────────────────────────
# OBJECTIVE WEIGHTS
# ─────────────────────────────────────────────────────────────

@dataclass
class OptimizationObjectives:
    health:       float = 0.30
    economic:     float = 0.20
    environmental: float = 0.15
    social:       float = 0.15
    cost_efficiency: float = 0.12
    scalability:  float = 0.08
    evidence:     float = 0.00  # bonus, not primary

    def validate(self):
        total = self.health + self.economic + self.environmental + self.social + self.cost_efficiency + self.scalability
        assert abs(total - 1.0) < 0.01, f"Weights must sum to 1.0, got {total}"

    @classmethod
    def maximize_health(cls):
        return cls(health=0.50, economic=0.15, environmental=0.10, social=0.10, cost_efficiency=0.10, scalability=0.05)

    @classmethod
    def maximize_roi(cls):
        return cls(health=0.20, economic=0.35, environmental=0.10, social=0.10, cost_efficiency=0.20, scalability=0.05)

    @classmethod
    def sustainability_first(cls):
        return cls(health=0.20, economic=0.15, environmental=0.40, social=0.15, cost_efficiency=0.05, scalability=0.05)

    @classmethod
    def social_equity(cls):
        return cls(health=0.25, economic=0.15, environmental=0.15, social=0.35, cost_efficiency=0.05, scalability=0.05)


# ─────────────────────────────────────────────────────────────
# PARETO FRONTIER
# ─────────────────────────────────────────────────────────────

def dominates(a: Scenario, b: Scenario) -> bool:
    """True if scenario a Pareto-dominates scenario b (better or equal on all, strictly better on one)."""
    dims_a = [a.health_impact, a.economic_impact, a.environmental_impact,
              a.social_impact, a.cost_efficiency, a.scalability]
    dims_b = [b.health_impact, b.economic_impact, b.environmental_impact,
              b.social_impact, b.cost_efficiency, b.scalability]
    return all(x >= y for x, y in zip(dims_a, dims_b)) and any(x > y for x, y in zip(dims_a, dims_b))


def compute_pareto_frontier(scenarios: list[Scenario]) -> list[Scenario]:
    """Identify Pareto-optimal scenarios."""
    frontier = []
    for s in scenarios:
        dominated = False
        for other in scenarios:
            if other.scenario_id != s.scenario_id and dominates(other, s):
                dominated = True
                break
        if not dominated:
            s.is_pareto_optimal = True
            frontier.append(s)
    return frontier


# ─────────────────────────────────────────────────────────────
# STRATEGY OPTIMIZER
# ─────────────────────────────────────────────────────────────

class StrategyOptimizer:
    """
    Multi-objective scenario optimizer.
    Computes composite scores, Pareto ranks, and strategy recommendations.
    """

    def __init__(self, scenarios: list[Scenario] = None):
        self.scenarios = [Scenario(**vars(s)) for s in (scenarios or PREDEFINED_SCENARIOS)]

    def optimize(self, objectives: OptimizationObjectives = None) -> list[Scenario]:
        """Score and rank all scenarios by given objectives."""
        obj = objectives or OptimizationObjectives()

        for s in self.scenarios:
            s.composite_score = round(
                s.health_impact      * obj.health +
                s.economic_impact    * obj.economic +
                s.environmental_impact * obj.environmental +
                s.social_impact      * obj.social +
                s.cost_efficiency    * obj.cost_efficiency +
                s.scalability        * obj.scalability +
                s.evidence_quality   * obj.evidence,
                4
            )
            s.is_pareto_optimal = False  # reset

        # Pareto analysis
        compute_pareto_frontier(self.scenarios)

        # Sort by composite
        ranked = sorted(self.scenarios, key=lambda s: -s.composite_score)
        for i, s in enumerate(ranked):
            s.pareto_rank = i + 1

        return ranked

    def top_strategies(self, n: int = 5, objectives: OptimizationObjectives = None) -> list[dict]:
        ranked = self.optimize(objectives)[:n]
        return [
            {
                "rank":                s.pareto_rank,
                "name":                s.name,
                "description":         s.description,
                "composite_score":     s.composite_score,
                "is_pareto_optimal":   s.is_pareto_optimal,
                "health_impact":       s.health_impact,
                "economic_impact":     s.economic_impact,
                "environmental_impact": s.environmental_impact,
                "social_impact":       s.social_impact,
                "cost_efficiency":     s.cost_efficiency,
                "scalability":         s.scalability,
                "evidence_quality":    s.evidence_quality,
                "time_to_impact":      s.time_to_impact,
                "total_cost_bn":       s.total_cost_bn,
            }
            for s in ranked
        ]

    def radar_data(self, scenario_ids: list[str] = None) -> list[dict]:
        """Return radar chart data for selected scenarios."""
        target = self.scenarios if not scenario_ids else [
            s for s in self.scenarios if s.scenario_id in scenario_ids
        ]
        return [
            {
                "name": s.name,
                "scores": {
                    "Health":       s.health_impact,
                    "Economic":     s.economic_impact,
                    "Environment":  s.environmental_impact,
                    "Social":       s.social_impact,
                    "Efficiency":   s.cost_efficiency,
                    "Scalability":  s.scalability,
                }
            }
            for s in target
        ]

    def scenario_comparison(self, ids: list[str]) -> dict:
        """Side-by-side scenario comparison."""
        scenarios = {s.scenario_id: s for s in self.scenarios}
        return {sid: scenarios[sid] for sid in ids if sid in scenarios}

    def sensitivity_analysis(self, scenario_id: str) -> dict:
        """
        How does the ranking change under different objective profiles?
        """
        scenario = next((s for s in self.scenarios if s.scenario_id == scenario_id), None)
        if not scenario:
            return {}

        profiles = {
            "Maximize Health":       OptimizationObjectives.maximize_health(),
            "Maximize ROI":          OptimizationObjectives.maximize_roi(),
            "Sustainability First":  OptimizationObjectives.sustainability_first(),
            "Social Equity":         OptimizationObjectives.social_equity(),
            "Balanced":              OptimizationObjectives(),
        }

        result = {}
        for profile_name, obj in profiles.items():
            ranked = self.optimize(obj)
            rank = next((s.pareto_rank for s in ranked if s.scenario_id == scenario_id), None)
            result[profile_name] = {"rank": rank, "score": scenario.composite_score}

        return result
