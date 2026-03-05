/**
 * GSSE — World State Model
 * 40 variables across 5 domains
 */

import type { StateVariable, GSSEDomain, GSSETrend } from './types';

export const WORLD_STATE: StateVariable[] = [
  // ── HEALTH ───
  { varId: "h001", name: "Global Obesity Rate",          domain: "health",        value: 0.390, unit: "% adults",       trend: "rising",   confidence: 0.88, globalBurden: 0.80, naturalRange: [0, 1],     dataSource: "WHO 2023" },
  { varId: "h002", name: "Type 2 Diabetes Prevalence",   domain: "health",        value: 0.110, unit: "% adults",       trend: "rising",   confidence: 0.90, globalBurden: 0.78, naturalRange: [0, 0.5],   dataSource: "IDF 2023" },
  { varId: "h003", name: "Cardiovascular Disease Index",  domain: "health",        value: 0.330, unit: "% adults",       trend: "stable",   confidence: 0.87, globalBurden: 0.91, naturalRange: [0, 1],     dataSource: "GBD 2023" },
  { varId: "h004", name: "Global Life Expectancy",        domain: "health",        value: 73.2,  unit: "years",          trend: "rising",   confidence: 0.95, globalBurden: 0.95, naturalRange: [60, 90],   dataSource: "UN 2023" },
  { varId: "h005", name: "Mental Health Burden",          domain: "health",        value: 0.280, unit: "% population",   trend: "rising",   confidence: 0.75, globalBurden: 0.82, naturalRange: [0, 1],     dataSource: "WHO 2023" },
  { varId: "h006", name: "Average Sleep Duration",        domain: "health",        value: 6.8,   unit: "hours/night",    trend: "falling",  confidence: 0.78, globalBurden: 0.65, naturalRange: [4, 9],     dataSource: "NSF 2023" },
  { varId: "h007", name: "Physical Inactivity Rate",      domain: "health",        value: 0.270, unit: "% adults",       trend: "rising",   confidence: 0.85, globalBurden: 0.72, naturalRange: [0, 1],     dataSource: "Lancet 2022" },
  { varId: "h008", name: "Antibiotic Resistance Index",   domain: "health",        value: 0.420, unit: "index 0-1",      trend: "rising",   confidence: 0.71, globalBurden: 0.88, naturalRange: [0, 1],     dataSource: "WHO AMR 2023" },
  { varId: "h009", name: "Child Malnutrition Rate",       domain: "health",        value: 0.220, unit: "% under-5",      trend: "falling",  confidence: 0.82, globalBurden: 0.85, naturalRange: [0, 1],     dataSource: "UNICEF 2023" },
  { varId: "h010", name: "Healthcare Access Index",       domain: "health",        value: 0.620, unit: "index 0-1",      trend: "rising",   confidence: 0.79, globalBurden: 0.80, naturalRange: [0, 1],     dataSource: "HAQ Index" },

  // ── ECONOMIC ───
  { varId: "e001", name: "Global GDP Growth Rate",        domain: "economic",      value: 0.030, unit: "% annual",       trend: "volatile", confidence: 0.80, globalBurden: 0.60, naturalRange: [-0.1, 0.15], dataSource: "IMF 2024" },
  { varId: "e002", name: "Income Inequality (Gini)",      domain: "economic",      value: 0.380, unit: "Gini index",     trend: "rising",   confidence: 0.85, globalBurden: 0.75, naturalRange: [0.2, 0.8],  dataSource: "WB 2023" },
  { varId: "e003", name: "Global Poverty Rate",           domain: "economic",      value: 0.090, unit: "% < $2.15/day",  trend: "falling",  confidence: 0.88, globalBurden: 0.88, naturalRange: [0, 1],      dataSource: "WB 2023" },
  { varId: "e004", name: "Healthcare Cost Burden",        domain: "economic",      value: 0.110, unit: "% of GDP",       trend: "rising",   confidence: 0.82, globalBurden: 0.72, naturalRange: [0, 0.25],   dataSource: "OECD 2023" },
  { varId: "e005", name: "Education Investment",          domain: "economic",      value: 0.042, unit: "% of GDP",       trend: "stable",   confidence: 0.84, globalBurden: 0.70, naturalRange: [0, 0.12],   dataSource: "UNESCO 2023" },
  { varId: "e006", name: "Unemployment Rate",             domain: "economic",      value: 0.052, unit: "% labor force",  trend: "stable",   confidence: 0.90, globalBurden: 0.65, naturalRange: [0, 0.3],    dataSource: "ILO 2024" },
  { varId: "e007", name: "R&D Investment",                domain: "economic",      value: 0.023, unit: "% of GDP",       trend: "rising",   confidence: 0.80, globalBurden: 0.55, naturalRange: [0, 0.08],   dataSource: "OECD 2023" },
  { varId: "e008", name: "Food System Cost",              domain: "economic",      value: 0.190, unit: "% household",    trend: "rising",   confidence: 0.75, globalBurden: 0.68, naturalRange: [0, 0.6],    dataSource: "FAO 2023" },

  // ── ENVIRONMENTAL ───
  { varId: "v001", name: "Atmospheric CO₂",               domain: "environmental", value: 421.0, unit: "ppm",            trend: "rising",   confidence: 0.99, globalBurden: 0.92, naturalRange: [280, 600], dataSource: "NOAA 2024" },
  { varId: "v002", name: "Urban Air Quality Index",        domain: "environmental", value: 0.420, unit: "index 0-1",      trend: "stable",   confidence: 0.80, globalBurden: 0.75, naturalRange: [0, 1],     dataSource: "WHO AQI" },
  { varId: "v003", name: "Biodiversity Loss Rate",         domain: "environmental", value: 0.680, unit: "index 0-1",      trend: "rising",   confidence: 0.75, globalBurden: 0.85, naturalRange: [0, 1],     dataSource: "IPBES 2023" },
  { varId: "v004", name: "Deforestation Rate",             domain: "environmental", value: 0.043, unit: "Mha/year",       trend: "falling",  confidence: 0.78, globalBurden: 0.80, naturalRange: [0, 0.2],   dataSource: "FAO 2022" },
  { varId: "v005", name: "Plastic Pollution Index",        domain: "environmental", value: 0.610, unit: "index 0-1",      trend: "rising",   confidence: 0.70, globalBurden: 0.72, naturalRange: [0, 1],     dataSource: "UNEP 2023" },
  { varId: "v006", name: "Renewable Energy Share",         domain: "environmental", value: 0.300, unit: "% total",        trend: "rising",   confidence: 0.92, globalBurden: 0.70, naturalRange: [0, 1],     dataSource: "IEA 2024" },
  { varId: "v007", name: "Urban Green Space Coverage",     domain: "environmental", value: 0.180, unit: "% city area",    trend: "stable",   confidence: 0.72, globalBurden: 0.58, naturalRange: [0, 0.5],   dataSource: "UN-Habitat" },
  { varId: "v008", name: "Ocean Health Index",             domain: "environmental", value: 0.480, unit: "index 0-1",      trend: "falling",  confidence: 0.77, globalBurden: 0.78, naturalRange: [0, 1],     dataSource: "OHI 2023" },

  // ── SOCIAL ───
  { varId: "s001", name: "Social Trust Index",             domain: "social",        value: 0.420, unit: "index 0-1",      trend: "falling",  confidence: 0.72, globalBurden: 0.70, naturalRange: [0, 1],     dataSource: "WVS 2023" },
  { varId: "s002", name: "Loneliness Prevalence",          domain: "social",        value: 0.330, unit: "% adults",       trend: "rising",   confidence: 0.75, globalBurden: 0.72, naturalRange: [0, 1],     dataSource: "Gallup 2023" },
  { varId: "s003", name: "Education Quality Index",        domain: "social",        value: 0.580, unit: "index 0-1",      trend: "rising",   confidence: 0.80, globalBurden: 0.75, naturalRange: [0, 1],     dataSource: "PISA 2022" },
  { varId: "s004", name: "Gender Equality Index",          domain: "social",        value: 0.680, unit: "index 0-1",      trend: "rising",   confidence: 0.83, globalBurden: 0.72, naturalRange: [0, 1],     dataSource: "WEF 2023" },
  { varId: "s005", name: "Urban-Rural Divide",             domain: "social",        value: 0.410, unit: "index 0-1",      trend: "rising",   confidence: 0.70, globalBurden: 0.65, naturalRange: [0, 1],     dataSource: "WB 2023" },
  { varId: "s006", name: "Political Polarization",         domain: "social",        value: 0.620, unit: "index 0-1",      trend: "rising",   confidence: 0.68, globalBurden: 0.60, naturalRange: [0, 1],     dataSource: "V-Dem 2023" },

  // ── BEHAVIORAL ───
  { varId: "b001", name: "Ultra-Processed Food Share",     domain: "behavioral",    value: 0.540, unit: "% diet",         trend: "rising",   confidence: 0.82, globalBurden: 0.80, naturalRange: [0, 1],     dataSource: "Lancet 2023" },
  { varId: "b002", name: "Daily Screen Time",              domain: "behavioral",    value: 7.2,   unit: "hours/day",      trend: "rising",   confidence: 0.75, globalBurden: 0.60, naturalRange: [0, 18],    dataSource: "DataReportal" },
  { varId: "b003", name: "Physical Activity Index",        domain: "behavioral",    value: 0.430, unit: "index 0-1",      trend: "falling",  confidence: 0.80, globalBurden: 0.75, naturalRange: [0, 1],     dataSource: "Lancet 2022" },
  { varId: "b004", name: "Fruit & Veg Consumption",        domain: "behavioral",    value: 0.380, unit: "index 0-1",      trend: "stable",   confidence: 0.77, globalBurden: 0.68, naturalRange: [0, 1],     dataSource: "FAO 2023" },
  { varId: "b005", name: "Smoking Prevalence",             domain: "behavioral",    value: 0.220, unit: "% adults",       trend: "falling",  confidence: 0.88, globalBurden: 0.78, naturalRange: [0, 1],     dataSource: "WHO 2023" },
  { varId: "b006", name: "Alcohol Consumption",            domain: "behavioral",    value: 0.180, unit: "index 0-1",      trend: "stable",   confidence: 0.80, globalBurden: 0.65, naturalRange: [0, 1],     dataSource: "WHO 2023" },
];

// ── WorldState class ──

export class WorldState {
  private vars: Map<string, StateVariable>;

  constructor(variables: StateVariable[] = WORLD_STATE) {
    this.vars = new Map();
    for (const v of variables) {
      this.vars.set(v.varId, { ...v });
    }
  }

  get(varId: string): StateVariable | undefined {
    return this.vars.get(varId);
  }

  byDomain(domain: GSSEDomain): StateVariable[] {
    return [...this.vars.values()].filter(v => v.domain === domain);
  }

  allVariables(): StateVariable[] {
    return [...this.vars.values()];
  }

  risingConcerns(): StateVariable[] {
    const harmfulDomains: GSSEDomain[] = ['health', 'environmental', 'behavioral'];
    return [...this.vars.values()]
      .filter(v =>
        (v.trend === 'rising' && harmfulDomains.includes(v.domain)) ||
        (v.trend === 'falling' && v.domain === 'social')
      )
      .sort((a, b) => b.globalBurden - a.globalBurden);
  }

  globalBurdenIndex(): number {
    const all = [...this.vars.values()];
    const totalWeight = all.reduce((s, v) => s + v.globalBurden, 0);
    const weightedSum = all.reduce((s, v) => {
      const [lo, hi] = v.naturalRange;
      const norm = (v.value - lo) / Math.max(hi - lo, 1e-9);
      return s + norm * v.globalBurden;
    }, 0);
    return Math.round((weightedSum / Math.max(totalWeight, 1e-9)) * 10000) / 10000;
  }

  domainSummary(): Record<string, { count: number; risingConcerns: number; avgBurden: number }> {
    const domains: GSSEDomain[] = ['health', 'economic', 'environmental', 'social', 'behavioral'];
    const result: Record<string, any> = {};
    for (const d of domains) {
      const vars = this.byDomain(d);
      result[d] = {
        count: vars.length,
        risingConcerns: vars.filter(v => v.trend === 'rising').length,
        avgBurden: Math.round(vars.reduce((s, v) => s + v.globalBurden, 0) / Math.max(vars.length, 1) * 1000) / 1000,
      };
    }
    return result;
  }
}
