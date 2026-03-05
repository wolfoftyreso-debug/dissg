"""
GSSE — Global System State Model
Multi-domain world state: health, economic, environmental, social.
Each variable carries a current value, trend, confidence, and domain.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional
import math


class Domain(str, Enum):
    HEALTH       = "health"
    ECONOMIC     = "economic"
    ENVIRONMENTAL = "environmental"
    SOCIAL       = "social"
    BEHAVIORAL   = "behavioral"


class Trend(str, Enum):
    RISING   = "rising"
    FALLING  = "falling"
    STABLE   = "stable"
    VOLATILE = "volatile"


@dataclass
class StateVariable:
    """
    A single tracked variable in the global system state.
    value is normalized 0–1 where meaningful (e.g. prevalence, index)
    or in natural units where noted.
    """
    var_id:       str
    name:         str
    domain:       Domain
    value:        float          # current state
    unit:         str            # "% adults", "index 0-1", "ppm", "USD"
    trend:        Trend
    confidence:   float          # how reliable is this measurement
    global_burden: float         # 0-1 weight in burden-of-world index
    natural_range: tuple         # (min_possible, max_possible) in value units
    description:  str = ""
    data_source:  str = ""
    last_updated: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def normalized(self) -> float:
        lo, hi = self.natural_range
        return (self.value - lo) / max(hi - lo, 1e-9)

    def apply_delta(self, delta: float) -> float:
        """Return new value after applying delta, clamped to natural range."""
        lo, hi = self.natural_range
        return max(lo, min(hi, self.value + delta))


# ─────────────────────────────────────────────────────────────
# WORLD STATE REGISTRY
# 40 variables across 5 domains
# ─────────────────────────────────────────────────────────────

WORLD_STATE: list[StateVariable] = [

    # ── HEALTH ───────────────────────────────────────────────
    StateVariable("h001", "Global Obesity Rate",          Domain.HEALTH, 0.390, "% adults",       Trend.RISING,   0.88, 0.80, (0.0, 1.0),   "WHO 2023"),
    StateVariable("h002", "Type 2 Diabetes Prevalence",   Domain.HEALTH, 0.110, "% adults",       Trend.RISING,   0.90, 0.78, (0.0, 0.5),   "IDF 2023"),
    StateVariable("h003", "Cardiovascular Disease Index", Domain.HEALTH, 0.330, "% adults",       Trend.STABLE,   0.87, 0.91, (0.0, 1.0),   "GBD 2023"),
    StateVariable("h004", "Global Life Expectancy",       Domain.HEALTH, 73.2,  "years",          Trend.RISING,   0.95, 0.95, (60.0, 90.0), "UN 2023"),
    StateVariable("h005", "Mental Health Burden",         Domain.HEALTH, 0.280, "% population",   Trend.RISING,   0.75, 0.82, (0.0, 1.0),   "WHO 2023"),
    StateVariable("h006", "Average Sleep Duration",       Domain.HEALTH, 6.8,   "hours/night",    Trend.FALLING,  0.78, 0.65, (4.0, 9.0),   "NSF 2023"),
    StateVariable("h007", "Physical Inactivity Rate",     Domain.HEALTH, 0.270, "% adults",       Trend.RISING,   0.85, 0.72, (0.0, 1.0),   "Lancet 2022"),
    StateVariable("h008", "Antibiotic Resistance Index",  Domain.HEALTH, 0.420, "index 0-1",      Trend.RISING,   0.71, 0.88, (0.0, 1.0),   "WHO AMR 2023"),
    StateVariable("h009", "Child Malnutrition Rate",      Domain.HEALTH, 0.220, "% under-5",      Trend.FALLING,  0.82, 0.85, (0.0, 1.0),   "UNICEF 2023"),
    StateVariable("h010", "Healthcare Access Index",      Domain.HEALTH, 0.620, "index 0-1",      Trend.RISING,   0.79, 0.80, (0.0, 1.0),   "HAQ Index"),

    # ── ECONOMIC ─────────────────────────────────────────────
    StateVariable("e001", "Global GDP Growth Rate",       Domain.ECONOMIC, 0.030, "% annual",     Trend.VOLATILE, 0.80, 0.60, (-0.1, 0.15), "IMF 2024"),
    StateVariable("e002", "Income Inequality (Gini)",     Domain.ECONOMIC, 0.380, "Gini index",   Trend.RISING,   0.85, 0.75, (0.2, 0.8),   "WB 2023"),
    StateVariable("e003", "Global Poverty Rate",          Domain.ECONOMIC, 0.090, "% < $2.15/day",Trend.FALLING,  0.88, 0.88, (0.0, 1.0),   "WB 2023"),
    StateVariable("e004", "Healthcare Cost Burden",       Domain.ECONOMIC, 0.110, "% of GDP",     Trend.RISING,   0.82, 0.72, (0.0, 0.25),  "OECD 2023"),
    StateVariable("e005", "Education Investment",         Domain.ECONOMIC, 0.042, "% of GDP",     Trend.STABLE,   0.84, 0.70, (0.0, 0.12),  "UNESCO 2023"),
    StateVariable("e006", "Unemployment Rate",            Domain.ECONOMIC, 0.052, "% labor force",Trend.STABLE,   0.90, 0.65, (0.0, 0.3),   "ILO 2024"),
    StateVariable("e007", "R&D Investment",               Domain.ECONOMIC, 0.023, "% of GDP",     Trend.RISING,   0.80, 0.55, (0.0, 0.08),  "OECD 2023"),
    StateVariable("e008", "Food System Cost",             Domain.ECONOMIC, 0.190, "% household",  Trend.RISING,   0.75, 0.68, (0.0, 0.6),   "FAO 2023"),

    # ── ENVIRONMENTAL ────────────────────────────────────────
    StateVariable("v001", "Atmospheric CO2",              Domain.ENVIRONMENTAL, 421.0, "ppm",     Trend.RISING,   0.99, 0.92, (280.0, 600.0),"NOAA 2024"),
    StateVariable("v002", "Urban Air Quality Index",      Domain.ENVIRONMENTAL, 0.420, "index 0-1",Trend.STABLE,  0.80, 0.75, (0.0, 1.0),   "WHO AQI"),
    StateVariable("v003", "Biodiversity Loss Rate",       Domain.ENVIRONMENTAL, 0.680, "index 0-1",Trend.RISING,  0.75, 0.85, (0.0, 1.0),   "IPBES 2023"),
    StateVariable("v004", "Deforestation Rate",           Domain.ENVIRONMENTAL, 0.043, "Mha/year", Trend.FALLING,  0.78, 0.80, (0.0, 0.2),   "FAO 2022"),
    StateVariable("v005", "Plastic Pollution Index",      Domain.ENVIRONMENTAL, 0.610, "index 0-1",Trend.RISING,  0.70, 0.72, (0.0, 1.0),   "UNEP 2023"),
    StateVariable("v006", "Renewable Energy Share",       Domain.ENVIRONMENTAL, 0.300, "% total",  Trend.RISING,  0.92, 0.70, (0.0, 1.0),   "IEA 2024"),
    StateVariable("v007", "Urban Green Space Coverage",   Domain.ENVIRONMENTAL, 0.180, "% city area",Trend.STABLE,0.72, 0.58, (0.0, 0.5),   "UN-Habitat"),
    StateVariable("v008", "Ocean Health Index",           Domain.ENVIRONMENTAL, 0.480, "index 0-1",Trend.FALLING,  0.77, 0.78, (0.0, 1.0),   "OHI 2023"),

    # ── SOCIAL ───────────────────────────────────────────────
    StateVariable("s001", "Social Trust Index",           Domain.SOCIAL, 0.420, "index 0-1",      Trend.FALLING,  0.72, 0.70, (0.0, 1.0),   "WVS 2023"),
    StateVariable("s002", "Loneliness Prevalence",        Domain.SOCIAL, 0.330, "% adults",       Trend.RISING,   0.75, 0.72, (0.0, 1.0),   "Gallup 2023"),
    StateVariable("s003", "Education Quality Index",      Domain.SOCIAL, 0.580, "index 0-1",      Trend.RISING,   0.80, 0.75, (0.0, 1.0),   "PISA 2022"),
    StateVariable("s004", "Gender Equality Index",        Domain.SOCIAL, 0.680, "index 0-1",      Trend.RISING,   0.83, 0.72, (0.0, 1.0),   "WEF 2023"),
    StateVariable("s005", "Urban-Rural Divide",           Domain.SOCIAL, 0.410, "index 0-1",      Trend.RISING,   0.70, 0.65, (0.0, 1.0),   "WB 2023"),
    StateVariable("s006", "Political Polarization",       Domain.SOCIAL, 0.620, "index 0-1",      Trend.RISING,   0.68, 0.60, (0.0, 1.0),   "V-Dem 2023"),

    # ── BEHAVIORAL ───────────────────────────────────────────
    StateVariable("b001", "Ultra-Processed Food Share",   Domain.BEHAVIORAL, 0.540, "% diet",     Trend.RISING,   0.82, 0.80, (0.0, 1.0),   "Lancet 2023"),
    StateVariable("b002", "Daily Screen Time",            Domain.BEHAVIORAL, 7.2,   "hours/day",  Trend.RISING,   0.75, 0.60, (0.0, 18.0),  "DataReportal"),
    StateVariable("b003", "Physical Activity Index",      Domain.BEHAVIORAL, 0.430, "index 0-1",  Trend.FALLING,  0.80, 0.75, (0.0, 1.0),   "Lancet 2022"),
    StateVariable("b004", "Fruit & Veg Consumption",      Domain.BEHAVIORAL, 0.380, "index 0-1",  Trend.STABLE,   0.77, 0.68, (0.0, 1.0),   "FAO 2023"),
    StateVariable("b005", "Smoking Prevalence",           Domain.BEHAVIORAL, 0.220, "% adults",   Trend.FALLING,  0.88, 0.78, (0.0, 1.0),   "WHO 2023"),
    StateVariable("b006", "Alcohol Consumption",          Domain.BEHAVIORAL, 0.180, "index 0-1",  Trend.STABLE,   0.80, 0.65, (0.0, 1.0),   "WHO 2023"),
]


# ─────────────────────────────────────────────────────────────
# WORLD STATE CLASS
# ─────────────────────────────────────────────────────────────

class WorldState:
    """
    Live snapshot of all global system variables.
    Supports domain queries, burden scoring, and state updates.
    """

    def __init__(self, variables: list[StateVariable] = None):
        self._vars: dict[str, StateVariable] = {}
        for v in (variables or WORLD_STATE):
            self._vars[v.var_id] = v
        # Also index by normalized name for lookup
        self._name_index: dict[str, str] = {
            v.name.lower(): v.var_id for v in self._vars.values()
        }

    def get(self, var_id: str) -> Optional[StateVariable]:
        return self._vars.get(var_id)

    def get_by_name(self, name: str) -> Optional[StateVariable]:
        vid = self._name_index.get(name.lower())
        return self._vars.get(vid) if vid else None

    def by_domain(self, domain: Domain) -> list[StateVariable]:
        return [v for v in self._vars.values() if v.domain == domain]

    def rising_concerns(self) -> list[StateVariable]:
        """Variables trending in the wrong direction (rising harm OR falling benefit)."""
        harmful_domains = {Domain.HEALTH, Domain.ENVIRONMENTAL, Domain.BEHAVIORAL}
        results = []
        for v in self._vars.values():
            if v.trend == Trend.RISING and v.domain in harmful_domains:
                results.append(v)
            elif v.trend == Trend.FALLING and v.domain == Domain.SOCIAL:
                results.append(v)
        return sorted(results, key=lambda x: -x.global_burden)

    def global_burden_index(self) -> float:
        """Weighted composite burden score 0–1."""
        total_weight = sum(v.global_burden for v in self._vars.values())
        weighted_sum = sum(v.normalized() * v.global_burden for v in self._vars.values())
        return round(weighted_sum / max(total_weight, 1e-9), 4)

    def apply_state_update(self, var_id: str, delta: float, confidence: float = 1.0) -> StateVariable:
        """Update a variable's value, returns modified copy."""
        var = self._vars.get(var_id)
        if not var:
            raise KeyError(f"Variable {var_id} not found")
        import copy
        updated = copy.copy(var)
        updated.value = updated.apply_delta(delta)
        updated.confidence = round(var.confidence * confidence, 3)
        updated.last_updated = datetime.utcnow().isoformat()
        self._vars[var_id] = updated
        return updated

    def snapshot(self) -> dict:
        return {v.var_id: {"name": v.name, "value": v.value, "domain": v.domain.value, "trend": v.trend.value}
                for v in self._vars.values()}

    def domain_summary(self) -> dict:
        summary = {}
        for domain in Domain:
            vars_in_domain = self.by_domain(domain)
            summary[domain.value] = {
                "count": len(vars_in_domain),
                "rising_concerns": sum(1 for v in vars_in_domain if v.trend == Trend.RISING),
                "avg_burden": round(sum(v.global_burden for v in vars_in_domain) / max(len(vars_in_domain), 1), 3),
            }
        return summary
