"""
GSSE — Master Orchestrator
Integrates with the Autonomous Knowledge Engine and exposes
the complete Global Simulation & Strategy Engine API.
"""

from __future__ import annotations
from gsse_state_model import WorldState, Domain, WORLD_STATE
from gsse_propagation import CausalPropagationEngine, InterventionSpec, TimeHorizon
from gsse_optimizer import StrategyOptimizer, OptimizationObjectives, PREDEFINED_SCENARIOS


class GlobalSimulationStrategyEngine:
    """
    Top-level GSSE orchestrator.
    Connects world state → propagation → optimization → output.
    """

    def __init__(self):
        self.world_state = WorldState()
        self.propagation = CausalPropagationEngine(max_depth=3)
        self.optimizer   = StrategyOptimizer()
        print("[GSSE] Global Simulation & Strategy Engine initialized")
        print(f"[GSSE] World state: {len(WORLD_STATE)} variables across {len(Domain)} domains")

    # ── SIMULATION API ─────────────────────────────────────────

    def simulate(self,
                 name: str,
                 target_variable: str,
                 magnitude: float,
                 time_frame: int = 10,
                 cost_bn_usd: float = 0.0,
                 mechanism: str = "") -> dict:
        """
        Run a full simulation: propagate intervention through causal graph.
        Returns structured output with timeseries, effects, uncertainty.
        """
        spec = InterventionSpec(
            name=name,
            target_variable=target_variable,
            magnitude=magnitude,
            unit="index change",
            time_frame=time_frame,
            affected_pop="global",
            cost_bn_usd=cost_bn_usd,
            mechanism=mechanism,
            confidence_prior=0.80,
            reversibility=0.5,
        )
        effects = self.propagation.propagate(spec)
        timeseries = self.propagation.compute_timeseries(effects)
        top_effects = effects[:8]

        return {
            "scenario":      name,
            "variable":      target_variable,
            "magnitude":     magnitude,
            "time_frame":    f"{time_frame} years",
            "n_effects":     len(effects),
            "top_effects": [
                {
                    "target":     e.target_var,
                    "domain":     e.domain,
                    "delta":      e.delta,
                    "confidence": e.confidence,
                    "ci_lo":      e.uncertainty_lo,
                    "ci_hi":      e.uncertainty_hi,
                    "path":       e.causal_path,
                    "depth":      e.causal_depth,
                }
                for e in top_effects
            ],
            "timeseries":  timeseries,
            "cost_bn_usd": cost_bn_usd,
        }

    def compare_scenarios(self, scenarios: list[dict]) -> list[dict]:
        """
        Run multiple simulation scenarios and rank by total impact.
        scenarios: [{"name":"...", "variable":"...", "magnitude":..., "time_frame":...}]
        """
        results = []
        for s in scenarios:
            result = self.simulate(**s)
            # Aggregate total burden impact
            total_impact = sum(abs(e["delta"]) * e["confidence"] for e in result["top_effects"])
            results.append({**result, "total_impact": round(total_impact, 4)})
        return sorted(results, key=lambda r: -r["total_impact"])

    # ── STRATEGY API ───────────────────────────────────────────

    def optimize_strategies(self, profile: str = "balanced") -> list[dict]:
        """
        Return ranked strategies for a given objective profile.
        profile: "balanced" | "maximize_health" | "maximize_roi" |
                 "sustainability_first" | "social_equity"
        """
        obj_map = {
            "balanced":           OptimizationObjectives(),
            "maximize_health":    OptimizationObjectives.maximize_health(),
            "maximize_roi":       OptimizationObjectives.maximize_roi(),
            "sustainability_first": OptimizationObjectives.sustainability_first(),
            "social_equity":      OptimizationObjectives.social_equity(),
        }
        obj = obj_map.get(profile, OptimizationObjectives())
        return self.optimizer.top_strategies(n=10, objectives=obj)

    def pareto_frontier(self) -> list[dict]:
        """Return all Pareto-optimal strategies."""
        ranked = self.optimizer.optimize()
        return [
            {
                "name":             s.name,
                "composite_score":  s.composite_score,
                "health_impact":    s.health_impact,
                "economic_impact":  s.economic_impact,
                "env_impact":       s.environmental_impact,
                "social_impact":    s.social_impact,
                "cost_efficiency":  s.cost_efficiency,
                "time_to_impact":   s.time_to_impact,
                "total_cost_bn":    s.total_cost_bn,
            }
            for s in ranked if s.is_pareto_optimal
        ]

    def sensitivity_analysis(self, scenario_id: str) -> dict:
        return self.optimizer.sensitivity_analysis(scenario_id)

    # ── WORLD STATE API ────────────────────────────────────────

    def world_state_summary(self) -> dict:
        return {
            "domain_summary":     self.world_state.domain_summary(),
            "global_burden":      self.world_state.global_burden_index(),
            "rising_concerns":    [
                {"name": v.name, "domain": v.domain.value, "burden": v.global_burden}
                for v in self.world_state.rising_concerns()[:8]
            ],
        }

    def apply_intervention_to_state(self, var_id: str, delta: float) -> dict:
        """Apply a change to the world state and return updated variable."""
        updated = self.world_state.apply_state_update(var_id, delta)
        return {"var_id": var_id, "new_value": updated.value, "delta": delta}


# ─────────────────────────────────────────────────────────────
# DEMO
# ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import json

    gsse = GlobalSimulationStrategyEngine()

    print("\n" + "="*60)
    print("WORLD STATE SUMMARY")
    print("="*60)
    ws = gsse.world_state_summary()
    print(f"Global Burden Index: {ws['global_burden']}")
    print("Rising Concerns:")
    for c in ws["rising_concerns"][:5]:
        print(f"  ▲ {c['name']} ({c['domain']}) burden={c['burden']}")

    print("\n" + "="*60)
    print("SIMULATION: Sugar consumption -20%")
    print("="*60)
    result = gsse.simulate(
        name="Sugar Reduction 20%",
        target_variable="ultra_processed_food",
        magnitude=-0.20,
        time_frame=10,
        cost_bn_usd=12.0,
        mechanism="Price signal via sugar tax reduces UPF consumption",
    )
    print(f"Downstream effects found: {result['n_effects']}")
    for e in result["top_effects"][:4]:
        print(f"  {e['target']}: {e['delta']:+.4f} (conf {e['confidence']:.2f})")
    print("Timeseries (health domain):", result["timeseries"].get("health", {}))

    print("\n" + "="*60)
    print("TOP STRATEGIES (Balanced)")
    print("="*60)
    for s in gsse.optimize_strategies("balanced")[:5]:
        print(f"  #{s['rank']} {s['name']} — score {s['composite_score']}")

    print("\n" + "="*60)
    print("PARETO FRONTIER")
    print("="*60)
    for s in gsse.pareto_frontier():
        print(f"  ◆ {s['name']} — H:{s['health_impact']:.2f} E:{s['economic_impact']:.2f} Env:{s['env_impact']:.2f}")
