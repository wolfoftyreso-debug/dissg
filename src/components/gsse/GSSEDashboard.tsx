import { useState, useEffect, useMemo, useCallback } from "react";
import {
  WORLD_STATE, WorldState, CausalPropagationEngine, StrategyOptimizer,
  PREDEFINED_SCENARIOS, OBJECTIVE_PROFILES, TIME_HORIZONS,
} from "@/core/gsse";
import type { StateVariable, Scenario, PropagatedEffect, InterventionSpec } from "@/core/gsse";

// ── Design tokens (operations center) ──
const D = {
  bg:         "hsl(210 30% 5%)",
  surface:    "hsl(210 25% 8%)",
  surfaceAlt: "hsl(210 22% 10%)",
  border:     "hsla(210 25% 70% / 0.10)",
  borderBold: "hsla(210 25% 70% / 0.22)",
  blue:       "hsl(210 85% 63%)",
  blueDim:    "hsla(210 85% 63% / 0.20)",
  blueGlow:   "hsla(210 85% 63% / 0.07)",
  amber:      "hsl(45 85% 60%)",
  amberDim:   "hsla(45 85% 60% / 0.18)",
  green:      "hsl(140 50% 55%)",
  greenDim:   "hsla(140 50% 55% / 0.18)",
  rose:       "hsl(355 80% 65%)",
  roseDim:    "hsla(355 80% 65% / 0.18)",
  violet:     "hsl(265 70% 65%)",
  violetDim:  "hsla(265 70% 65% / 0.18)",
  text:       "hsl(210 30% 88%)",
  textMid:    "hsl(210 20% 45%)",
  textDim:    "hsl(210 25% 18%)",
  white:      "hsl(210 25% 95%)",
};

const DOMAIN_COLORS: Record<string, string> = {
  health: D.blue, economic: D.amber, environmental: D.green,
  social: D.rose, behavioral: D.violet,
};

// ── Pre-computed simulation data ──
const SIMULATIONS: Record<string, {
  name: string; variable: string; magnitude: number; confidence: number;
  timeseries: Record<string, Record<number, number>>;
  effects: Array<{ target: string; domain: string; delta: number; conf: number; depth: number; time: string }>;
  causalPath: string[];
}> = {
  sugar_reduction: {
    name: "Global sugar consumption ↓ 20%",
    variable: "ultra_processed_food", magnitude: -0.20, confidence: 0.76,
    timeseries: {
      health:       { 1: 0.008, 5: 0.041, 15: 0.088, 30: 0.112 },
      economic:     { 1: 0.002, 5: 0.018, 15: 0.052, 30: 0.071 },
      environmental: { 1: 0.001, 5: 0.006, 15: 0.019, 30: 0.024 },
      social:       { 1: 0.001, 5: 0.009, 15: 0.025, 30: 0.031 },
    },
    effects: [
      { target: "obesity",         domain: "health",   delta: -0.058, conf: 0.82, depth: 1, time: "~4 yrs" },
      { target: "type 2 diabetes", domain: "health",   delta: -0.041, conf: 0.77, depth: 2, time: "~7 yrs" },
      { target: "healthcare cost", domain: "economic", delta: -0.061, conf: 0.74, depth: 2, time: "~8 yrs" },
      { target: "cardiovascular",  domain: "health",   delta: +0.032, conf: 0.70, depth: 3, time: "~10 yrs" },
      { target: "gut microbiome",  domain: "health",   delta: +0.028, conf: 0.72, depth: 1, time: "~1 yr" },
      { target: "life expectancy", domain: "health",   delta: +0.018, conf: 0.65, depth: 4, time: "~15 yrs" },
    ],
    causalPath: ["ultra_processed_food", "obesity", "type2_diabetes", "cardiovascular", "life_expectancy"],
  },
  active_city: {
    name: "Urban active transport ↑ 30%",
    variable: "active_transport", magnitude: +0.30, confidence: 0.73,
    timeseries: {
      health:       { 1: 0.012, 5: 0.052, 15: 0.094, 30: 0.108 },
      economic:     { 1: 0.005, 5: 0.028, 15: 0.048, 30: 0.055 },
      environmental: { 1: 0.018, 5: 0.068, 15: 0.112, 30: 0.128 },
      social:       { 1: 0.006, 5: 0.031, 15: 0.058, 30: 0.068 },
    },
    effects: [
      { target: "physical activity", domain: "behavioral",    delta: +0.071, conf: 0.79, depth: 1, time: "~2 yrs" },
      { target: "air quality",       domain: "environmental", delta: +0.068, conf: 0.76, depth: 1, time: "~3 yrs" },
      { target: "CO₂ emissions",     domain: "environmental", delta: -0.055, conf: 0.73, depth: 1, time: "~5 yrs" },
      { target: "cardiovascular",    domain: "health",        delta: +0.062, conf: 0.74, depth: 2, time: "~5 yrs" },
      { target: "social cohesion",   domain: "social",        delta: +0.038, conf: 0.66, depth: 1, time: "~3 yrs" },
      { target: "transport cost",    domain: "economic",      delta: -0.052, conf: 0.70, depth: 1, time: "~2 yrs" },
    ],
    causalPath: ["active_transport", "physical_activity", "cardiovascular", "life_expectancy"],
  },
  sleep_initiative: {
    name: "Average sleep ↑ 45 min globally",
    variable: "sleep_duration", magnitude: +0.112, confidence: 0.80,
    timeseries: {
      health:       { 1: 0.022, 5: 0.058, 15: 0.078, 30: 0.082 },
      economic:     { 1: 0.008, 5: 0.034, 15: 0.051, 30: 0.055 },
      environmental: { 1: 0.001, 5: 0.002, 15: 0.003, 30: 0.004 },
      social:       { 1: 0.009, 5: 0.032, 15: 0.048, 30: 0.052 },
    },
    effects: [
      { target: "cognitive function", domain: "health",   delta: +0.062, conf: 0.86, depth: 1, time: "~immediate" },
      { target: "mental health",      domain: "health",   delta: +0.041, conf: 0.79, depth: 1, time: "~1 yr" },
      { target: "immune function",    domain: "health",   delta: +0.038, conf: 0.74, depth: 1, time: "~6 mo" },
      { target: "cortisol",           domain: "health",   delta: -0.044, conf: 0.81, depth: 1, time: "~6 mo" },
      { target: "productivity",       domain: "economic", delta: +0.058, conf: 0.72, depth: 1, time: "~1 yr" },
      { target: "cardiovascular",     domain: "health",   delta: +0.021, conf: 0.66, depth: 2, time: "~5 yrs" },
    ],
    causalPath: ["sleep_duration", "cortisol", "immune_function", "mental_health"],
  },
};

// ── SVG Charts ──

function TimeSeriesChart({ data, height = 140 }: { data: Record<string, Record<number, number>>; height?: number }) {
  const horizons = [0, 1, 5, 15, 30];
  const domainKeys = Object.keys(data);
  if (!domainKeys.length) return null;

  const allVals = domainKeys.flatMap(d => horizons.map(t => data[d][t] || 0));
  const maxVal = Math.max(...allVals, 0.001);
  const W = 300, H = height, PAD = 24;

  const xScale = (t: number) => PAD + (t / 30) * (W - PAD * 2);
  const yScale = (v: number) => H - PAD - (v / maxVal) * (H - PAD * 2);

  const makePath = (dk: string) => {
    const pts = horizons.map(t => `${xScale(t).toFixed(1)},${yScale(data[dk][t] || 0).toFixed(1)}`);
    return `M${pts.join("L")}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      {[0, 0.25, 0.5, 0.75, 1.0].map((frac, i) => {
        const y = H - PAD - frac * (H - PAD * 2);
        return <line key={i} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="hsla(210 25% 70% / 0.06)" strokeWidth="0.5" />;
      })}
      {[1, 5, 15, 30].map(t => (
        <text key={t} x={xScale(t)} y={H - 6} textAnchor="middle" fill={D.textMid} fontSize="7" fontFamily="monospace">{t}y</text>
      ))}
      {domainKeys.map(dk => (
        <g key={dk}>
          <path d={makePath(dk)} fill="none" stroke={DOMAIN_COLORS[dk] || D.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {horizons.map(t => (
            <circle key={t} cx={xScale(t)} cy={yScale(data[dk][t] || 0)} r="2" fill={DOMAIN_COLORS[dk] || D.blue} opacity="0.8" />
          ))}
        </g>
      ))}
      {domainKeys.map((dk, i) => (
        <g key={dk} transform={`translate(${PAD + i * 70}, 10)`}>
          <rect x={0} y={0} width={8} height={2} fill={DOMAIN_COLORS[dk] || D.blue} />
          <text x={12} y={4} fill={D.textMid} fontSize="6.5" fontFamily="monospace">{dk}</text>
        </g>
      ))}
    </svg>
  );
}

function RadarChart({ scenarios, size = 160 }: { scenarios: Scenario[]; size?: number }) {
  const dims = ["Health", "Economic", "Environ.", "Social", "Efficiency", "Scale"];
  const dimKeys: (keyof Scenario)[] = ["healthImpact", "economicImpact", "environmentalImpact", "socialImpact", "costEfficiency", "scalability"];
  const N = dims.length;
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const angle = (i: number) => (i / N) * Math.PI * 2 - Math.PI / 2;
  const pt = (i: number, val: number) => ({
    x: cx + Math.cos(angle(i)) * r * val,
    y: cy + Math.sin(angle(i)) * r * val,
  });
  const colors = [D.blue, D.amber, D.green, D.rose];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      {[0.25, 0.5, 0.75, 1.0].map((frac, ri) => {
        const pts = dims.map((_, i) => pt(i, frac));
        const d = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") + "Z";
        return <path key={ri} d={d} fill="none" stroke="hsla(210 25% 70% / 0.07)" strokeWidth="0.5" />;
      })}
      {dims.map((_, i) => {
        const outer = pt(i, 1.0);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="hsla(210 25% 70% / 0.1)" strokeWidth="0.5" />;
      })}
      {dims.map((d, i) => {
        const outer = pt(i, 1.18);
        return <text key={i} x={outer.x} y={outer.y} textAnchor="middle" dominantBaseline="middle" fill={D.textMid} fontSize="6.5" fontFamily="monospace">{d}</text>;
      })}
      {scenarios.slice(0, 4).map((s, si) => {
        const pts = dimKeys.map((k, i) => pt(i, (s[k] as number) || 0));
        const d = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") + "Z";
        const col = colors[si];
        return <path key={si} d={d} fill={`${col}18`} stroke={col} strokeWidth="1" opacity="0.85" />;
      })}
    </svg>
  );
}

function ParetoScatter({ scenarios, xKey, yKey, xLabel, yLabel }: {
  scenarios: Scenario[]; xKey: keyof Scenario; yKey: keyof Scenario; xLabel: string; yLabel: string;
}) {
  const [hov, setHov] = useState<string | null>(null);
  const W = 260, H = 180, PAD = 30;
  const xVals = scenarios.map(s => s[xKey] as number);
  const yVals = scenarios.map(s => s[yKey] as number);
  const xMax = Math.max(...xVals) * 1.05;
  const yMax = Math.max(...yVals) * 1.05;
  const sx = (v: number) => PAD + (v / xMax) * (W - PAD * 1.5);
  const sy = (v: number) => H - PAD - (v / yMax) * (H - PAD * 1.5);

  const pareto = [...scenarios].filter(s => s.isParetoOptimal).sort((a, b) => (a[xKey] as number) - (b[xKey] as number));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      <line x1={PAD} y1={H - PAD} x2={W - 10} y2={H - PAD} stroke={D.textDim} strokeWidth="0.5" />
      <line x1={PAD} y1={10} x2={PAD} y2={H - PAD} stroke={D.textDim} strokeWidth="0.5" />
      <text x={W / 2} y={H - 6} textAnchor="middle" fill={D.textMid} fontSize="7" fontFamily="monospace">{xLabel}</text>
      <text x={8} y={H / 2} textAnchor="middle" fill={D.textMid} fontSize="7" fontFamily="monospace" transform={`rotate(-90, 8, ${H / 2})`}>{yLabel}</text>
      {pareto.length >= 2 && (
        <path d={pareto.map((s, i) => `${i === 0 ? "M" : "L"}${sx(s[xKey] as number).toFixed(1)},${sy(s[yKey] as number).toFixed(1)}`).join("")}
          fill="none" stroke={`${D.blue}40`} strokeWidth="1" strokeDasharray="3,2" />
      )}
      {scenarios.map((s, i) => {
        const isH = hov === s.scenarioId;
        const col = s.isParetoOptimal ? D.blue : D.textMid;
        return (
          <g key={i} onMouseEnter={() => setHov(s.scenarioId)} onMouseLeave={() => setHov(null)}>
            {s.isParetoOptimal && <circle cx={sx(s[xKey] as number)} cy={sy(s[yKey] as number)} r={isH ? 9 : 7} fill={`${D.blue}15`} stroke={`${D.blue}40`} strokeWidth="0.5" />}
            <circle cx={sx(s[xKey] as number)} cy={sy(s[yKey] as number)} r={isH ? 5 : 3.5} fill={col} opacity={isH ? 1 : 0.7} />
            {isH && <text x={sx(s[xKey] as number) + 7} y={sy(s[yKey] as number) - 4} fill={D.text} fontSize="7" fontFamily="monospace">{s.name.split(" ").slice(0, 2).join(" ")}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ── Sub-components ──

function WorldStateBars({ variables, domain }: { variables: StateVariable[]; domain: string | null }) {
  const filtered = variables.filter(v => !domain || v.domain === domain);
  const trendColor: Record<string, string> = { rising: D.rose, falling: D.green, stable: D.textMid, volatile: D.amber };

  return (
    <div className="flex flex-col gap-[5px]">
      {filtered.map((v, i) => {
        const col = DOMAIN_COLORS[v.domain] || D.blue;
        const normalizedVal = Math.min(v.value, 1.0);
        const isBad = v.trend === "rising" && ["health", "behavioral", "environmental"].includes(v.domain);
        return (
          <div key={i} className="flex items-center gap-[10px] px-[10px] py-[6px]"
            style={{
              border: `1px solid ${isBad ? "hsla(355 80% 65% / 0.12)" : D.border}`,
              background: isBad ? "hsla(355 80% 65% / 0.02)" : "transparent",
              animation: `fadeIn 0.3s ${i * 0.04}s both`,
            }}>
            <div className="shrink-0" style={{ width: 3, height: "100%", minHeight: 20, background: col }} />
            <div className="flex-1">
              <div style={{ fontFamily: "monospace", fontSize: 9, color: D.text, marginBottom: 2 }}>{v.name}</div>
              <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 1 }}>
                <div style={{ width: `${Math.min(normalizedVal * 100, 100)}%`, height: "100%", background: col }} />
              </div>
            </div>
            <div className="text-right" style={{ minWidth: 52 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: col }}>
                {v.value < 2 ? (v.value * 100).toFixed(1) + "%" : v.value.toFixed(1)}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 8, color: trendColor[v.trend] }}>
                {v.trend === "rising" ? "▲" : v.trend === "falling" ? "▼" : "◆"} {v.trend}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScenarioCard({ scenario, selected, onClick, rank }: {
  scenario: Scenario; selected: boolean; onClick: () => void; rank: number;
}) {
  const bars = [
    { key: "healthImpact" as const, label: "Health", color: D.blue },
    { key: "economicImpact" as const, label: "Econ", color: D.amber },
    { key: "environmentalImpact" as const, label: "Env", color: D.green },
    { key: "socialImpact" as const, label: "Social", color: D.rose },
  ];

  return (
    <div onClick={onClick} className="cursor-pointer relative transition-all"
      style={{
        padding: "12px 14px",
        border: `1px solid ${selected ? D.blue : scenario.isParetoOptimal ? "hsla(210 85% 63% / 0.2)" : D.border}`,
        background: selected ? D.blueGlow : scenario.isParetoOptimal ? "hsla(210 85% 63% / 0.03)" : "transparent",
      }}>
      {scenario.isParetoOptimal && (
        <div className="absolute top-0 right-0" style={{ padding: "2px 6px", background: `${D.blue}22`, fontFamily: "monospace", fontSize: 7, color: D.blue, letterSpacing: "0.1em" }}>PARETO</div>
      )}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div style={{ fontFamily: "monospace", fontSize: 8, color: D.textMid, marginBottom: 2 }}>
            #{String(rank).padStart(2, "0")} · {scenario.timeToImpact} yrs · ${scenario.totalCostBn}B
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: D.text, lineHeight: 1.3 }}>{scenario.name}</div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 18, color: D.blue, fontWeight: 300 }}>
          {scenario.compositeScore.toFixed(3)}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {bars.map(b => (
          <div key={b.key}>
            <div style={{ fontFamily: "monospace", fontSize: 7, color: D.textMid, marginBottom: 2 }}>{b.label}</div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 1 }}>
              <div style={{ width: `${(scenario[b.key] as number) * 100}%`, height: "100%", background: b.color }} />
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 8, color: b.color, marginTop: 1 }}>
              {Math.round((scenario[b.key] as number) * 100)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ──

export default function GSSEDashboard() {
  const [tab, setTab] = useState("state");
  const [selectedScenario, setSelectedScenario] = useState("sugar_reduction");
  const [selectedStrategyId, setSelectedStrategyId] = useState("s010");
  const [objProfile, setObjProfile] = useState(0);
  const [domainFilter, setDomainFilter] = useState<string | null>(null);

  const worldState = useMemo(() => new WorldState(), []);
  const optimizer = useMemo(() => new StrategyOptimizer(), []);
  const rankedScenarios = useMemo(() => optimizer.optimize(OBJECTIVE_PROFILES[objProfile].weights), [objProfile]);

  const sim = SIMULATIONS[selectedScenario];
  const strategy = rankedScenarios.find(s => s.scenarioId === selectedStrategyId) || rankedScenarios[0];
  const sortedScenarios = [...rankedScenarios].sort((a, b) => b.compositeScore - a.compositeScore);

  const TABS = ["state", "propagation", "scenarios", "optimizer", "strategy"];
  const negTargets = ["obesity", "type 2 diabetes", "healthcare cost", "CO₂ emissions", "cortisol"];

  return (
    <div className="min-h-screen" style={{ background: D.bg, color: D.text, fontFamily: "'DM Mono', 'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-50 flex justify-between items-center px-8 py-[18px]"
        style={{ borderBottom: `1px solid ${D.border}`, background: `${D.surface}ee`, backdropFilter: "blur(12px)" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: D.textMid, textTransform: "uppercase", marginBottom: 5 }}>
            Global Decision Support System
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: D.white, letterSpacing: "0.04em" }}>
            Global Simulation &amp; Strategy Engine
          </div>
        </div>
        <div className="flex gap-6 items-end">
          {[
            { label: "World Variables", val: String(WORLD_STATE.length), color: D.blue },
            { label: "Active Scenarios", val: String(PREDEFINED_SCENARIOS.length), color: D.amber },
            { label: "Pareto Optimal", val: String(rankedScenarios.filter(s => s.isParetoOptimal).length), color: D.green },
          ].map((m, i) => (
            <div key={i} className="text-right">
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.1em", textTransform: "uppercase" }}>{m.label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: m.color, lineHeight: 1.1 }}>{m.val}</div>
            </div>
          ))}
          <div className="flex items-center gap-2 ml-2">
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: D.green, boxShadow: `0 0 10px ${D.green}`, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 9, color: D.green, letterSpacing: "0.12em" }}>SIMULATION ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-8" style={{ borderBottom: `1px solid ${D.border}`, background: `${D.surfaceAlt}88` }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="transition-all"
            style={{
              padding: "10px 18px", background: "transparent", border: "none",
              borderBottom: tab === t ? `2px solid ${D.blue}` : "2px solid transparent",
              color: tab === t ? D.blue : D.textMid,
              cursor: "pointer", fontSize: 9, letterSpacing: "0.15em",
              textTransform: "uppercase", marginBottom: -1,
            }}>{t}</button>
        ))}
      </div>

      <div className="p-7">

        {/* ═══ STATE ═══ */}
        {tab === "state" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-3.5">
                <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Global System State — {WORLD_STATE.length} indicators
                </div>
                <div className="flex gap-1">
                  {[null, "health", "economic", "environmental", "social", "behavioral"].map(d => (
                    <button key={d || "all"} onClick={() => setDomainFilter(d)}
                      style={{
                        padding: "3px 7px", background: "transparent",
                        border: `1px solid ${domainFilter === d ? (DOMAIN_COLORS[d!] || D.blue) : D.border}`,
                        color: domainFilter === d ? (DOMAIN_COLORS[d!] || D.blue) : D.textMid,
                        cursor: "pointer", fontSize: 8, letterSpacing: "0.06em",
                      }}>{d || "all"}</button>
                  ))}
                </div>
              </div>
              <WorldStateBars variables={WORLD_STATE} domain={domainFilter} />
            </div>
            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
                Domain Burden Overview
              </div>
              {Object.entries(DOMAIN_COLORS).map(([domain, color], i) => {
                const vars = WORLD_STATE.filter(v => v.domain === domain);
                const rising = vars.filter(v => v.trend === "rising").length;
                const avgBurden = vars.reduce((a, v) => a + v.globalBurden, 0) / Math.max(vars.length, 1);
                return (
                  <div key={i} className="flex items-center gap-3.5 p-[14px] mb-2" style={{ border: `1px solid ${color}22`, background: `${color}05` }}>
                    <div className="shrink-0" style={{ width: 3, height: 44, background: color }} />
                    <div className="flex-1">
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color, marginBottom: 4, fontStyle: "italic" }}>
                        {domain.charAt(0).toUpperCase() + domain.slice(1)}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: 9, color: D.textMid }}>
                        {vars.length} indicators · <span style={{ color: D.rose }}>{rising} rising</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontFamily: "monospace", fontSize: 22, color, fontWeight: 300 }}>{Math.round(avgBurden * 100)}</div>
                      <div style={{ fontSize: 8, color: D.textMid }}>burden</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ PROPAGATION ═══ */}
        {tab === "propagation" && (
          <div>
            <div className="flex gap-1.5 mb-5">
              {Object.entries(SIMULATIONS).map(([key, s]) => (
                <button key={key} onClick={() => setSelectedScenario(key)}
                  className="flex-1 transition-all"
                  style={{
                    padding: "10px 12px",
                    background: selectedScenario === key ? D.blueGlow : "transparent",
                    border: `1px solid ${selectedScenario === key ? D.blue : D.border}`,
                    color: selectedScenario === key ? D.blue : D.textMid,
                    cursor: "pointer", fontSize: 9, letterSpacing: "0.06em",
                  }}>{s.name}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                  Effect Time Series — Domain Cumulative Impact
                </div>
                <div style={{ border: `1px solid ${D.border}`, padding: 16, background: "rgba(0,0,0,0.2)", marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: D.amber, fontStyle: "italic", marginBottom: 4 }}>
                    "{sim.name}"
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: D.textMid, marginBottom: 12 }}>
                    magnitude: {sim.magnitude > 0 ? "+" : ""}{(sim.magnitude * 100).toFixed(0)}% · confidence: {Math.round(sim.confidence * 100)}%
                  </div>
                  <TimeSeriesChart data={sim.timeseries} height={160} />
                </div>
                <div style={{ padding: "10px 14px", border: `1px solid ${D.border}`, background: D.blueGlow }}>
                  <div style={{ fontSize: 8, color: D.textMid, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Primary Causal Path</div>
                  <div className="flex items-center flex-wrap gap-1">
                    {sim.causalPath.map((node, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div style={{
                          padding: "3px 8px",
                          border: `1px solid ${i === 0 ? D.amber : D.border}`,
                          fontFamily: "monospace", fontSize: 9,
                          color: i === 0 ? D.amber : D.text,
                          background: i === 0 ? D.amberDim : "transparent",
                        }}>{node.replace(/_/g, " ")}</div>
                        {i < sim.causalPath.length - 1 && <span style={{ color: D.textMid, fontSize: 10 }}>→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                  Propagated Effects — {sim.effects.length} downstream variables
                </div>
                {sim.effects.map((e, i) => {
                  const col = DOMAIN_COLORS[e.domain] || D.blue;
                  const isPositive = (e.delta > 0 && !negTargets.includes(e.target)) || (e.delta < 0 && negTargets.includes(e.target));
                  const impactColor = isPositive ? D.green : D.rose;
                  return (
                    <div key={i} className="flex items-center gap-[10px] mb-1.5"
                      style={{
                        padding: "9px 12px",
                        border: `1px solid ${impactColor}18`,
                        background: `${impactColor}04`,
                        animation: `fadeIn 0.4s ${i * 0.08}s both`,
                      }}>
                      <span style={{ color: impactColor, fontSize: 16, lineHeight: 1, width: 16 }}>{e.delta > 0 ? "↑" : "↓"}</span>
                      <div className="flex-1">
                        <div style={{ fontFamily: "monospace", fontSize: 10, color: D.text }}>{e.target}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 8, color: D.textMid }}>{e.domain} · depth {e.depth} · {e.time}</div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontFamily: "monospace", fontSize: 11, color: impactColor }}>{(e.delta * 100).toFixed(1)}%</div>
                        <div style={{ fontFamily: "monospace", fontSize: 8, color: D.textMid }}>conf {Math.round(e.conf * 100)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ SCENARIOS ═══ */}
        {tab === "scenarios" && (
          <div className="grid gap-6" style={{ gridTemplateColumns: "300px 1fr" }}>
            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                {PREDEFINED_SCENARIOS.length} Scenarios · {rankedScenarios.filter(s => s.isParetoOptimal).length} Pareto-Optimal
              </div>
              <div className="flex flex-col gap-2">
                {sortedScenarios.map((s, i) => (
                  <ScenarioCard key={s.scenarioId} scenario={s} rank={i + 1}
                    selected={selectedStrategyId === s.scenarioId}
                    onClick={() => setSelectedStrategyId(s.scenarioId)} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                Scenario Analysis — {strategy.name}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div style={{ padding: 16, border: `1px solid ${D.border}`, background: D.blueGlow }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: D.white, marginBottom: 4, fontStyle: "italic" }}>{strategy.name}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: D.textMid, lineHeight: 1.7 }}>
                    Composite Score: <span style={{ color: D.blue }}>{strategy.compositeScore.toFixed(3)}</span><br />
                    Time to Impact: <span style={{ color: D.amber }}>{strategy.timeToImpact} years</span><br />
                    Total Cost: <span style={{ color: D.rose }}>${strategy.totalCostBn}B annually</span><br />
                    Pareto Status: <span style={{ color: strategy.isParetoOptimal ? D.green : D.textMid }}>
                      {strategy.isParetoOptimal ? "✓ Pareto Optimal" : "◆ Dominated"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center items-center p-2">
                  <RadarChart scenarios={[strategy]} size={180} />
                </div>
              </div>
              <div style={{ padding: 14, border: `1px solid ${D.border}` }}>
                <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                  Pareto Frontier — Health Impact vs Cost Efficiency
                </div>
                <ParetoScatter scenarios={rankedScenarios} xKey="totalCostBn" yKey="compositeScore" xLabel="Total Cost ($B)" yLabel="Composite Score" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ OPTIMIZER ═══ */}
        {tab === "optimizer" && (
          <div className="grid gap-6" style={{ gridTemplateColumns: "220px 1fr" }}>
            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Objective Profile</div>
              <div className="flex flex-col gap-1 mb-4">
                {OBJECTIVE_PROFILES.map((p, i) => (
                  <button key={i} onClick={() => setObjProfile(i)}
                    className="transition-all text-left"
                    style={{
                      padding: "9px 12px",
                      background: objProfile === i ? D.blueGlow : "transparent",
                      border: `1px solid ${objProfile === i ? D.blue : D.border}`,
                      color: objProfile === i ? D.blue : D.textMid,
                      cursor: "pointer", fontSize: 9, letterSpacing: "0.06em",
                    }}>{p.label}</button>
                ))}
              </div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Weight Distribution</div>
              {(["Health", "Economic", "Environment", "Social", "Efficiency", "Scalability"] as const).map((dim, i) => {
                const keys: (keyof typeof OBJECTIVE_PROFILES[0]["weights"])[] = ["health", "economic", "environmental", "social", "costEfficiency", "scalability"];
                const w = OBJECTIVE_PROFILES[objProfile].weights[keys[i]];
                return (
                  <div key={i} className="mb-1.5">
                    <div className="flex justify-between mb-0.5">
                      <span style={{ fontFamily: "monospace", fontSize: 8, color: D.textMid }}>{dim}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 8, color: D.blue }}>{Math.round(w * 100)}%</span>
                    </div>
                    <div style={{ height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 1 }}>
                      <div style={{ width: `${w * 200}%`, height: "100%", background: D.blue, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                Optimized Strategy Ranking — {OBJECTIVE_PROFILES[objProfile].label}
              </div>
              <div className="flex flex-col gap-1.5">
                {sortedScenarios.map((s, i) => (
                  <div key={i} className="flex items-center gap-3"
                    style={{
                      padding: "10px 14px",
                      border: `1px solid ${i === 0 ? D.blue : s.isParetoOptimal ? "hsla(210 85% 63% / 0.2)" : D.border}`,
                      background: i === 0 ? D.blueGlow : "transparent",
                      animation: `fadeIn 0.3s ${i * 0.06}s both`,
                    }}>
                    <div className="flex items-center justify-center shrink-0"
                      style={{
                        width: 28, height: 28,
                        border: `1px solid ${i < 3 ? D.blue : D.textDim}`,
                        fontFamily: "monospace", fontSize: 10,
                        color: i < 3 ? D.blue : D.textMid,
                      }}>{i + 1}</div>
                    <div className="flex-1">
                      <div style={{ fontFamily: "monospace", fontSize: 10, color: D.text }}>{s.name}</div>
                      <div className="flex gap-3 mt-1">
                        {([["H", s.healthImpact, D.blue], ["E", s.economicImpact, D.amber], ["Env", s.environmentalImpact, D.green], ["S", s.socialImpact, D.rose]] as const).map(([l, v, c]) => (
                          <span key={l} style={{ fontFamily: "monospace", fontSize: 8, color: c }}>{l}: {Math.round(v * 100)}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontFamily: "monospace", fontSize: 16, color: i === 0 ? D.blue : D.text, fontWeight: 300 }}>{s.compositeScore.toFixed(3)}</div>
                      {s.isParetoOptimal && <div style={{ fontFamily: "monospace", fontSize: 7, color: D.blue }}>PARETO</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ STRATEGY OUTPUT ═══ */}
        {tab === "strategy" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
                Recommended Strategy Output
              </div>
              <div style={{ padding: 20, border: `1px solid ${D.blue}`, background: D.blueGlow, marginBottom: 16 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: D.textMid, marginBottom: 6, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Top Global Strategy
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: D.white, marginBottom: 12, lineHeight: 1.3 }}>
                  Integrated Lifestyle Medicine
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: D.textMid, lineHeight: 2, borderTop: `1px solid ${D.border}`, paddingTop: 12 }}>
                  <div>Composite Score: <span style={{ color: D.blue }}>0.661</span></div>
                  <div>Pareto Status: <span style={{ color: D.green }}>✓ Pareto Optimal</span></div>
                  <div>Time to Meaningful Effect: <span style={{ color: D.amber }}>4 years</span></div>
                  <div>Annual Cost: <span style={{ color: D.rose }}>$62B globally</span></div>
                  <div>Evidence Quality: <span style={{ color: D.blue }}>0.84</span></div>
                </div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: D.textMid, lineHeight: 2 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: D.white, marginBottom: 8, fontStyle: "italic" }}>
                  Expected Outcomes (10 year horizon)
                </div>
                {[
                  ["Obesity Rate", "↓ 8.2%", D.green],
                  ["Type 2 Diabetes", "↓ 11.4%", D.green],
                  ["Cardiovascular Disease", "↓ 9.1%", D.green],
                  ["Mental Health Burden", "↓ 12.8%", D.green],
                  ["Healthcare Cost", "↓ 6.3%", D.green],
                  ["Life Expectancy", "↑ 1.8 yrs", D.blue],
                  ["Workforce Productivity", "↑ 4.2%", D.blue],
                ].map(([label, val, col], i) => (
                  <div key={i} className="flex justify-between" style={{ padding: "5px 0", borderBottom: `1px solid ${D.textDim}` }}>
                    <span style={{ color: D.text }}>{label}</span>
                    <span style={{ color: col, fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
                Machine-Readable Strategy Output
              </div>
              <pre style={{
                background: "rgba(0,0,0,0.35)", border: `1px solid ${D.border}`,
                padding: 16, fontFamily: "monospace", fontSize: 9, color: D.blue,
                lineHeight: 1.9, whiteSpace: "pre-wrap", marginBottom: 16,
              }}>{JSON.stringify({
                strategy: "Integrated Lifestyle Medicine",
                composite_score: 0.661,
                pareto_optimal: true,
                objectives: { health: 0.88, economic: 0.68, environmental: 0.28, social: 0.61 },
                cost_bn_annually: 62,
                time_to_impact_years: 4,
                evidence_quality: 0.84,
                expected_outcomes: {
                  obesity_reduction_pct: 8.2,
                  diabetes_reduction_pct: 11.4,
                  mental_health_improvement_pct: 12.8,
                  life_expectancy_gain_years: 1.8,
                },
                uncertainty_range: "confidence 0.72–0.88",
                horizon: "10 years",
              }, null, 2)}</pre>
              <div style={{ padding: 14, border: `1px solid ${D.amberDim}`, background: "hsla(45 85% 60% / 0.03)" }}>
                <div style={{ fontSize: 8, color: D.amber, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                  Sensitivity Notice
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: D.textMid, lineHeight: 1.8 }}>
                  Rankings are sensitive to objective weights. Under "Maximize ROI" profile,
                  Education Quality Uplift rises to rank 2. Under "Social Equity",
                  Mental Health Infrastructure enters top 3. Pareto-optimal set is robust
                  across all profiles tested.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
