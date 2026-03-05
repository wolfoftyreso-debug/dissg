"""
GSSE — Causal Propagation Engine
Propagates intervention effects through the causal graph with:
  - Time-delay modeling (short / medium / long term)
  - Uncertainty propagation (confidence intervals, error accumulation)
  - Multi-domain cross-effects
  - Diminishing returns at extremes
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Optional
import math


# ─────────────────────────────────────────────────────────────
# TIME MODELS
# ─────────────────────────────────────────────────────────────

class TimeHorizon:
    SHORT  = 1    # years
    MEDIUM = 5
    LONG   = 15
    VERY_LONG = 30

    ALL = [SHORT, MEDIUM, LONG, VERY_LONG]
    LABELS = {SHORT: "1 yr", MEDIUM: "5 yrs", LONG: "15 yrs", VERY_LONG: "30 yrs"}


def gompertz_ramp(t: float, lag: float, peak: float, decay: float = 0.05) -> float:
    """
    S-curve adoption / effect ramp.
    - lag: years before effect starts
    - peak: years when effect is at maximum
    - Models: slow start → rapid adoption → plateau → slow decay
    """
    if t <= lag:
        return 0.0
    t_adj = t - lag
    rise  = 1 - math.exp(-0.8 * t_adj)
    fall  = math.exp(-decay * max(t - peak, 0))
    return min(rise * fall, 1.0)


def uncertainty_accumulate(base_uncertainty: float, depth: int, years: int) -> float:
    """
    Uncertainty grows with causal chain depth and time horizon.
    base_uncertainty = 1 - confidence
    """
    depth_penalty = 1 + (depth - 1) * 0.12
    time_penalty  = 1 + years * 0.02
    accumulated   = 1 - (1 - base_uncertainty) / (depth_penalty * time_penalty)
    return round(min(accumulated, 0.92), 4)


# ─────────────────────────────────────────────────────────────
# EFFECT MODELS
# ─────────────────────────────────────────────────────────────

@dataclass
class PropagatedEffect:
    """One predicted downstream effect from a causal chain."""
    target_var:      str         # variable name or ID
    domain:          str
    delta:           float       # expected change in variable value
    delta_pct:       float       # % change relative to baseline
    confidence:      float       # 0-1
    uncertainty_lo:  float       # lower bound (pessimistic)
    uncertainty_hi:  float       # upper bound (optimistic)
    causal_depth:    int         # hops from intervention
    causal_path:     list[str]
    time_to_effect:  dict        # {horizon_years: magnitude}
    direction:       str         # "positive_impact" | "negative_impact"


@dataclass
class InterventionSpec:
    """
    Full specification of a simulation intervention.
    """
    name:            str
    target_variable: str         # which state variable changes
    magnitude:       float       # e.g. -0.20 for -20%
    unit:            str
    time_frame:      int         # years of intervention
    affected_pop:    str         # "global" | "urban" | "children" | ...
    cost_bn_usd:     float       # annual cost estimate in billion USD
    mechanism:       str         # causal mechanism description
    confidence_prior: float      # how confident in the intervention mechanism
    reversibility:   float       # 0=permanent, 1=fully reversible


# ─────────────────────────────────────────────────────────────
# CROSS-DOMAIN CAUSAL GRAPH
# Extended from causal_engine — adds time delays + domain info
# ─────────────────────────────────────────────────────────────

CROSS_DOMAIN_GRAPH = {
    # Health domain chains
    "ultra_processed_food": [
        {"target": "obesity",             "strength": 0.72, "delay_lag": 1, "delay_peak": 5,  "domain": "health",       "direction": "positive"},
        {"target": "gut_microbiome",      "strength": 0.58, "delay_lag": 0, "delay_peak": 1,  "domain": "health",       "direction": "negative"},
        {"target": "healthcare_cost",     "strength": 0.61, "delay_lag": 3, "delay_peak": 10, "domain": "economic",     "direction": "positive"},
        {"target": "food_system_cost",    "strength": 0.44, "delay_lag": 0, "delay_peak": 3,  "domain": "economic",     "direction": "positive"},
    ],
    "obesity": [
        {"target": "type2_diabetes",      "strength": 0.88, "delay_lag": 2, "delay_peak": 8,  "domain": "health",       "direction": "positive"},
        {"target": "cardiovascular",      "strength": 0.79, "delay_lag": 3, "delay_peak": 10, "domain": "health",       "direction": "negative"},
        {"target": "mental_health",       "strength": 0.52, "delay_lag": 1, "delay_peak": 4,  "domain": "health",       "direction": "negative"},
        {"target": "workforce_productivity","strength": 0.43,"delay_lag": 2, "delay_peak": 7,  "domain": "economic",     "direction": "negative"},
        {"target": "healthcare_cost",     "strength": 0.74, "delay_lag": 2, "delay_peak": 8,  "domain": "economic",     "direction": "positive"},
    ],
    "type2_diabetes": [
        {"target": "life_expectancy",     "strength": 0.71, "delay_lag": 5, "delay_peak": 15, "domain": "health",       "direction": "negative"},
        {"target": "healthcare_cost",     "strength": 0.82, "delay_lag": 1, "delay_peak": 6,  "domain": "economic",     "direction": "positive"},
        {"target": "cardiovascular",      "strength": 0.76, "delay_lag": 3, "delay_peak": 10, "domain": "health",       "direction": "negative"},
    ],
    "resistance_training": [
        {"target": "muscle_mass",         "strength": 0.82, "delay_lag": 0, "delay_peak": 1,  "domain": "health",       "direction": "positive"},
        {"target": "metabolic_rate",      "strength": 0.74, "delay_lag": 0, "delay_peak": 1,  "domain": "health",       "direction": "positive"},
        {"target": "insulin_sensitivity", "strength": 0.78, "delay_lag": 0, "delay_peak": 0,  "domain": "health",       "direction": "positive"},
        {"target": "mental_health",       "strength": 0.61, "delay_lag": 0, "delay_peak": 1,  "domain": "health",       "direction": "positive"},
        {"target": "healthcare_cost",     "strength": 0.52, "delay_lag": 5, "delay_peak": 15, "domain": "economic",     "direction": "negative"},
    ],
    "aerobic_exercise": [
        {"target": "cardiovascular",      "strength": 0.88, "delay_lag": 0, "delay_peak": 1,  "domain": "health",       "direction": "positive"},
        {"target": "mental_health",       "strength": 0.72, "delay_lag": 0, "delay_peak": 0,  "domain": "health",       "direction": "positive"},
        {"target": "air_quality",         "strength": 0.15, "delay_lag": 0, "delay_peak": 5,  "domain": "environmental","direction": "negative"},  # cars→walking
        {"target": "life_expectancy",     "strength": 0.69, "delay_lag": 3, "delay_peak": 10, "domain": "health",       "direction": "positive"},
    ],
    "nature_exposure": [
        {"target": "stress_levels",       "strength": 0.64, "delay_lag": 0, "delay_peak": 0,  "domain": "health",       "direction": "negative"},
        {"target": "mental_health",       "strength": 0.68, "delay_lag": 0, "delay_peak": 1,  "domain": "health",       "direction": "positive"},
        {"target": "physical_activity",   "strength": 0.52, "delay_lag": 0, "delay_peak": 1,  "domain": "behavioral",   "direction": "positive"},
        {"target": "biodiversity",        "strength": 0.48, "delay_lag": 1, "delay_peak": 10, "domain": "environmental","direction": "positive"},
        {"target": "air_quality",         "strength": 0.41, "delay_lag": 0, "delay_peak": 5,  "domain": "environmental","direction": "positive"},
        {"target": "social_cohesion",     "strength": 0.44, "delay_lag": 0, "delay_peak": 2,  "domain": "social",       "direction": "positive"},
    ],
    "sleep_duration": [
        {"target": "cognitive_function",  "strength": 0.78, "delay_lag": 0, "delay_peak": 0,  "domain": "health",       "direction": "positive"},
        {"target": "immune_function",     "strength": 0.65, "delay_lag": 0, "delay_peak": 0,  "domain": "health",       "direction": "positive"},
        {"target": "mental_health",       "strength": 0.74, "delay_lag": 0, "delay_peak": 1,  "domain": "health",       "direction": "positive"},
        {"target": "cortisol",            "strength": 0.81, "delay_lag": 0, "delay_peak": 0,  "domain": "health",       "direction": "negative"},
        {"target": "workforce_productivity","strength": 0.58,"delay_lag": 0, "delay_peak": 1,  "domain": "economic",     "direction": "positive"},
    ],
    "education_investment": [
        {"target": "income_level",        "strength": 0.72, "delay_lag": 5, "delay_peak": 20, "domain": "economic",     "direction": "positive"},
        {"target": "health_literacy",     "strength": 0.68, "delay_lag": 3, "delay_peak": 15, "domain": "health",       "direction": "positive"},
        {"target": "diet_quality",        "strength": 0.54, "delay_lag": 5, "delay_peak": 15, "domain": "behavioral",   "direction": "positive"},
        {"target": "inequality",          "strength": 0.61, "delay_lag": 8, "delay_peak": 25, "domain": "economic",     "direction": "negative"},
        {"target": "gdp_growth",          "strength": 0.67, "delay_lag": 10,"delay_peak": 30, "domain": "economic",     "direction": "positive"},
        {"target": "political_stability", "strength": 0.48, "delay_lag": 10,"delay_peak": 25, "domain": "social",       "direction": "positive"},
    ],
    "active_transport": [
        {"target": "physical_activity",   "strength": 0.71, "delay_lag": 0, "delay_peak": 2,  "domain": "behavioral",   "direction": "positive"},
        {"target": "air_quality",         "strength": 0.68, "delay_lag": 0, "delay_peak": 3,  "domain": "environmental","direction": "positive"},
        {"target": "co2_emissions",       "strength": 0.55, "delay_lag": 0, "delay_peak": 5,  "domain": "environmental","direction": "negative"},
        {"target": "cardiovascular",      "strength": 0.62, "delay_lag": 1, "delay_peak": 5,  "domain": "health",       "direction": "positive"},
        {"target": "social_cohesion",     "strength": 0.38, "delay_lag": 0, "delay_peak": 3,  "domain": "social",       "direction": "positive"},
        {"target": "transport_cost",      "strength": 0.52, "delay_lag": 0, "delay_peak": 2,  "domain": "economic",     "direction": "negative"},
    ],
    "renewable_energy": [
        {"target": "co2_emissions",       "strength": 0.88, "delay_lag": 0, "delay_peak": 5,  "domain": "environmental","direction": "negative"},
        {"target": "air_quality",         "strength": 0.72, "delay_lag": 0, "delay_peak": 3,  "domain": "environmental","direction": "positive"},
        {"target": "respiratory_health",  "strength": 0.58, "delay_lag": 1, "delay_peak": 5,  "domain": "health",       "direction": "positive"},
        {"target": "energy_cost",         "strength": 0.42, "delay_lag": 3, "delay_peak": 10, "domain": "economic",     "direction": "negative"},
        {"target": "energy_security",     "strength": 0.61, "delay_lag": 2, "delay_peak": 8,  "domain": "economic",     "direction": "positive"},
        {"target": "biodiversity",        "strength": 0.31, "delay_lag": 5, "delay_peak": 20, "domain": "environmental","direction": "positive"},
    ],
}


# ─────────────────────────────────────────────────────────────
# PROPAGATION ENGINE
# ─────────────────────────────────────────────────────────────

class CausalPropagationEngine:
    """
    Propagates an intervention through the cross-domain causal graph.
    Computes direct effects, indirect effects, time-series, and uncertainty.
    """

    def __init__(self, max_depth: int = 3):
        self.graph = CROSS_DOMAIN_GRAPH
        self.max_depth = max_depth

    def propagate(self, intervention: InterventionSpec) -> list[PropagatedEffect]:
        """Run full propagation for an intervention."""
        effects: list[PropagatedEffect] = []
        visited = set()
        self._bfs(
            source=intervention.target_variable,
            magnitude=intervention.magnitude,
            confidence=intervention.confidence_prior,
            depth=0,
            path=[intervention.target_variable],
            effects=effects,
            visited=visited,
            time_frame=intervention.time_frame,
        )
        # Sort by absolute expected impact × confidence
        effects.sort(key=lambda e: -abs(e.delta) * e.confidence)
        return effects

    def _bfs(self, source: str, magnitude: float, confidence: float,
             depth: int, path: list[str], effects: list, visited: set, time_frame: int):
        if depth >= self.max_depth:
            return
        for edge in self.graph.get(source, []):
            target = edge["target"]
            if target in visited:
                continue
            visited.add(target)

            path_strength  = edge["strength"] * (0.85 ** depth)   # diminishing returns
            raw_delta      = magnitude * path_strength
            base_uncertainty = 1 - confidence * edge["strength"]
            accumulated_unc = uncertainty_accumulate(base_uncertainty, depth + 1, time_frame)
            final_confidence = max(0.05, 1 - accumulated_unc)

            # Time-series effect at each horizon
            time_to_effect = {}
            for t in TimeHorizon.ALL:
                ramp = gompertz_ramp(t, edge["delay_lag"], edge["delay_peak"])
                time_to_effect[t] = round(raw_delta * ramp, 5)

            # Confidence interval
            spread = abs(raw_delta) * (1 - final_confidence)
            direction = "positive_impact" if (
                (raw_delta > 0 and edge["direction"] == "positive") or
                (raw_delta < 0 and edge["direction"] == "negative")
            ) else "negative_impact"

            delta_final = raw_delta if edge["direction"] == "positive" else -abs(raw_delta)
            delta_pct = round(delta_final / max(abs(magnitude), 1e-9) * 100, 1)

            effects.append(PropagatedEffect(
                target_var=target,
                domain=edge["domain"],
                delta=round(delta_final, 5),
                delta_pct=delta_pct,
                confidence=round(final_confidence, 3),
                uncertainty_lo=round(delta_final - spread, 5),
                uncertainty_hi=round(delta_final + spread, 5),
                causal_depth=depth + 1,
                causal_path=path + [target],
                time_to_effect=time_to_effect,
                direction=direction,
            ))

            # Recurse
            self._bfs(
                source=target,
                magnitude=raw_delta,
                confidence=final_confidence,
                depth=depth + 1,
                path=path + [target],
                effects=effects,
                visited=visited,
                time_frame=time_frame,
            )

    def compute_timeseries(self, effects: list[PropagatedEffect],
                           horizons: list[int] = None) -> dict:
        """
        Aggregate effects into domain-level time series.
        Returns: {domain: {year: cumulative_impact}}
        """
        horizons = horizons or TimeHorizon.ALL
        result = {}
        for e in effects:
            dom = e.domain
            if dom not in result:
                result[dom] = {t: 0.0 for t in horizons}
            for t in horizons:
                result[dom][t] += e.time_to_effect.get(t, 0.0) * e.confidence

        # Round
        return {
            dom: {t: round(v, 5) for t, v in series.items()}
            for dom, series in result.items()
        }
