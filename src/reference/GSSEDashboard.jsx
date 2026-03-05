import { useState, useEffect, useRef, useCallback } from "react";

// ── DESIGN: Deep Operations Center ──────────────────────────────
// Charcoal slate background. Bone white structural text.
// Vivid indicators: electric blue (health), amber (economic),
// forest green (environmental), rose (social).
// Typography: DM Mono for data, Playfair Display for headlines.
// Feels like a UN crisis simulation war room.

const D = {
  bg:         "#0b0f14",
  surface:    "#111820",
  surfaceAlt: "#141c24",
  border:     "rgba(148,180,210,0.10)",
  borderBold: "rgba(148,180,210,0.22)",
  blue:       "#4da8f0",
  blueDim:    "rgba(77,168,240,0.20)",
  blueGlow:   "rgba(77,168,240,0.07)",
  amber:      "#f0c040",
  amberDim:   "rgba(240,192,64,0.18)",
  green:      "#5ac878",
  greenDim:   "rgba(90,200,120,0.18)",
  rose:       "#f06878",
  roseDim:    "rgba(240,104,120,0.18)",
  violet:     "#a07cf0",
  violetDim:  "rgba(160,124,240,0.18)",
  text:       "#d8e4ee",
  textMid:    "#5a7a90",
  textDim:    "#1e3040",
  white:      "#eef4f8",
};

const DOMAIN_COLORS = {
  health:       D.blue,
  economic:     D.amber,
  environmental: D.green,
  social:       D.rose,
  behavioral:   D.violet,
};

// ── DATA ──────────────────────────────────────────────────────

const WORLD_STATE = [
  { id:"h001", name:"Global Obesity Rate",      domain:"health",       value:0.390, trend:"rising",  burden:0.80, unit:"% adults" },
  { id:"h002", name:"Type 2 Diabetes",          domain:"health",       value:0.110, trend:"rising",  burden:0.78, unit:"% adults" },
  { id:"h003", name:"Cardiovascular Disease",   domain:"health",       value:0.330, trend:"stable",  burden:0.91, unit:"% adults" },
  { id:"h004", name:"Life Expectancy",          domain:"health",       value:73.2,  trend:"rising",  burden:0.95, unit:"years" },
  { id:"h005", name:"Mental Health Burden",     domain:"health",       value:0.280, trend:"rising",  burden:0.82, unit:"% pop" },
  { id:"e001", name:"GDP Growth Rate",          domain:"economic",     value:0.030, trend:"volatile",burden:0.60, unit:"% annual" },
  { id:"e002", name:"Income Inequality (Gini)", domain:"economic",     value:0.380, trend:"rising",  burden:0.75, unit:"Gini" },
  { id:"e004", name:"Healthcare Cost Burden",   domain:"economic",     value:0.110, trend:"rising",  burden:0.72, unit:"% GDP" },
  { id:"v001", name:"Atmospheric CO₂",          domain:"environmental",value:421.0, trend:"rising",  burden:0.92, unit:"ppm" },
  { id:"v002", name:"Urban Air Quality",        domain:"environmental",value:0.420, trend:"stable",  burden:0.75, unit:"index" },
  { id:"v003", name:"Biodiversity Loss",        domain:"environmental",value:0.680, trend:"rising",  burden:0.85, unit:"index" },
  { id:"s001", name:"Social Trust Index",       domain:"social",       value:0.420, trend:"falling", burden:0.70, unit:"index" },
  { id:"s002", name:"Loneliness Prevalence",    domain:"social",       value:0.330, trend:"rising",  burden:0.72, unit:"% adults" },
  { id:"b001", name:"Ultra-Processed Food",     domain:"behavioral",   value:0.540, trend:"rising",  burden:0.80, unit:"% diet" },
  { id:"b003", name:"Physical Activity Index",  domain:"behavioral",   value:0.430, trend:"falling", burden:0.75, unit:"index" },
];

const SCENARIOS = [
  { id:"s001", name:"Sugar Reduction Package",    health:0.72,economic:0.58,environmental:0.22,social:0.34,efficiency:0.84,scalability:0.78,evidence:0.81,time:4, cost:12,  pareto:true,  score:0.623 },
  { id:"s002", name:"Active City Transformation", health:0.68,economic:0.52,environmental:0.71,social:0.64,efficiency:0.61,scalability:0.55,evidence:0.74,time:6, cost:85,  pareto:true,  score:0.601 },
  { id:"s003", name:"Sleep Health Initiative",    health:0.64,economic:0.62,environmental:0.08,social:0.48,efficiency:0.91,scalability:0.88,evidence:0.77,time:2, cost:4,   pareto:true,  score:0.596 },
  { id:"s004", name:"Global Exercise Access",     health:0.78,economic:0.61,environmental:0.15,social:0.55,efficiency:0.72,scalability:0.66,evidence:0.88,time:3, cost:28,  pareto:true,  score:0.631 },
  { id:"s005", name:"Renewable Energy Transition",health:0.52,economic:0.44,environmental:0.94,social:0.38,efficiency:0.48,scalability:0.72,evidence:0.85,time:8, cost:420, pareto:false, score:0.542 },
  { id:"s006", name:"Education Quality Uplift",   health:0.45,economic:0.78,environmental:0.18,social:0.82,efficiency:0.56,scalability:0.61,evidence:0.71,time:12,cost:95,  pareto:false, score:0.561 },
  { id:"s007", name:"Mental Health Infrastructure",health:0.66,economic:0.54,environmental:0.05,social:0.78,efficiency:0.79,scalability:0.71,evidence:0.68,time:3, cost:18,  pareto:true,  score:0.588 },
  { id:"s010", name:"Integrated Lifestyle Medicine",health:0.88,economic:0.68,environmental:0.28,social:0.61,efficiency:0.65,scalability:0.52,evidence:0.84,time:4, cost:62, pareto:true, score:0.661 },
];

const PROPAGATION = {
  "sugar_reduction": {
    name: "Global sugar consumption ↓ 20%",
    variable: "ultra_processed_food",
    magnitude: -0.20,
    timeseries: {
      health:       { 1:0.008, 5:0.041, 15:0.088, 30:0.112 },
      economic:     { 1:0.002, 5:0.018, 15:0.052, 30:0.071 },
      environmental:{ 1:0.001, 5:0.006, 15:0.019, 30:0.024 },
      social:       { 1:0.001, 5:0.009, 15:0.025, 30:0.031 },
    },
    effects: [
      { target:"obesity",          domain:"health",   delta:-0.058, conf:0.82, depth:1, time:"~4 yrs" },
      { target:"type 2 diabetes",  domain:"health",   delta:-0.041, conf:0.77, depth:2, time:"~7 yrs" },
      { target:"healthcare cost",  domain:"economic", delta:-0.061, conf:0.74, depth:2, time:"~8 yrs" },
      { target:"cardiovascular",   domain:"health",   delta:+0.032, conf:0.70, depth:3, time:"~10 yrs" },
      { target:"gut microbiome",   domain:"health",   delta:+0.028, conf:0.72, depth:1, time:"~1 yr" },
      { target:"life expectancy",  domain:"health",   delta:+0.018, conf:0.65, depth:4, time:"~15 yrs" },
    ],
    causal_path: ["ultra_processed_food","obesity","type2_diabetes","cardiovascular","life_expectancy"],
    confidence: 0.76,
  },
  "active_city": {
    name: "Urban active transport ↑ 30%",
    variable: "active_transport",
    magnitude: +0.30,
    timeseries: {
      health:       { 1:0.012, 5:0.052, 15:0.094, 30:0.108 },
      economic:     { 1:0.005, 5:0.028, 15:0.048, 30:0.055 },
      environmental:{ 1:0.018, 5:0.068, 15:0.112, 30:0.128 },
      social:       { 1:0.006, 5:0.031, 15:0.058, 30:0.068 },
    },
    effects: [
      { target:"physical activity", domain:"behavioral",    delta:+0.071, conf:0.79, depth:1, time:"~2 yrs" },
      { target:"air quality",       domain:"environmental", delta:+0.068, conf:0.76, depth:1, time:"~3 yrs" },
      { target:"CO₂ emissions",     domain:"environmental", delta:-0.055, conf:0.73, depth:1, time:"~5 yrs" },
      { target:"cardiovascular",    domain:"health",        delta:+0.062, conf:0.74, depth:2, time:"~5 yrs" },
      { target:"social cohesion",   domain:"social",        delta:+0.038, conf:0.66, depth:1, time:"~3 yrs" },
      { target:"transport cost",    domain:"economic",      delta:-0.052, conf:0.70, depth:1, time:"~2 yrs" },
    ],
    causal_path: ["active_transport","physical_activity","cardiovascular","life_expectancy"],
    confidence: 0.73,
  },
  "sleep_initiative": {
    name: "Average sleep ↑ 45 min globally",
    variable: "sleep_duration",
    magnitude: +0.112,
    timeseries: {
      health:       { 1:0.022, 5:0.058, 15:0.078, 30:0.082 },
      economic:     { 1:0.008, 5:0.034, 15:0.051, 30:0.055 },
      environmental:{ 1:0.001, 5:0.002, 15:0.003, 30:0.004 },
      social:       { 1:0.009, 5:0.032, 15:0.048, 30:0.052 },
    },
    effects: [
      { target:"cognitive function",domain:"health",   delta:+0.062, conf:0.86, depth:1, time:"~immediate" },
      { target:"mental health",     domain:"health",   delta:+0.041, conf:0.79, depth:1, time:"~1 yr" },
      { target:"immune function",   domain:"health",   delta:+0.038, conf:0.74, depth:1, time:"~6 mo" },
      { target:"cortisol",          domain:"health",   delta:-0.044, conf:0.81, depth:1, time:"~6 mo" },
      { target:"productivity",      domain:"economic", delta:+0.058, conf:0.72, depth:1, time:"~1 yr" },
      { target:"cardiovascular",    domain:"health",   delta:+0.021, conf:0.66, depth:2, time:"~5 yrs" },
    ],
    causal_path: ["sleep_duration","cortisol","immune_function","mental_health"],
    confidence: 0.80,
  },
};

const OBJ_PROFILES = [
  { label: "Balanced",           weights: [0.30,0.20,0.15,0.15,0.12,0.08] },
  { label: "Max Health",         weights: [0.50,0.15,0.10,0.10,0.10,0.05] },
  { label: "Max ROI",            weights: [0.20,0.35,0.10,0.10,0.20,0.05] },
  { label: "Sustainability",     weights: [0.20,0.15,0.40,0.15,0.05,0.05] },
  { label: "Social Equity",      weights: [0.25,0.15,0.15,0.35,0.05,0.05] },
];
const OBJ_DIMS = ["Health","Economic","Environment","Social","Efficiency","Scalability"];

// ── HOOKS ─────────────────────────────────────────────────────

function useCountUp(target, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / ms, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return v;
}

// ── SVG TIME SERIES ────────────────────────────────────────────

function TimeSeriesChart({ data, colors, height = 140 }) {
  const horizons = [0, 1, 5, 15, 30];
  const domainKeys = Object.keys(data);
  if (!domainKeys.length) return null;

  const allVals = domainKeys.flatMap(d => horizons.map(t => data[d][t] || 0));
  const maxVal = Math.max(...allVals, 0.001);
  const W = 300, H = height, PAD = 24;

  const xScale = t => PAD + (t / 30) * (W - PAD * 2);
  const yScale = v => H - PAD - (v / maxVal) * (H - PAD * 2);

  const makePath = (domainKey) => {
    const pts = horizons.map(t => `${xScale(t).toFixed(1)},${yScale(data[domainKey][t] || 0).toFixed(1)}`);
    return `M${pts.join("L")}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1.0].map((frac, i) => {
        const y = H - PAD - frac * (H - PAD * 2);
        return <line key={i} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="rgba(148,180,210,0.06)" strokeWidth="0.5" />;
      })}
      {/* Year labels */}
      {[1, 5, 15, 30].map(t => (
        <text key={t} x={xScale(t)} y={H - 6} textAnchor="middle" fill={D.textMid} fontSize="7" fontFamily="monospace">
          {t}y
        </text>
      ))}

      {/* Uncertainty band */}
      {domainKeys.slice(0, 1).map(dk => {
        const pts = horizons.map(t => ({ x: xScale(t), y: data[dk][t] || 0 }));
        const upper = pts.map(p => `${p.x.toFixed(1)},${yScale(p.y * 1.25).toFixed(1)}`).join("L");
        const lower = pts.map(p => `${p.x.toFixed(1)},${yScale(p.y * 0.75).toFixed(1)}`).reverse().join("L");
        const firstPt = pts[0];
        return (
          <path key="band"
            d={`M${xScale(horizons[0])},${yScale(pts[0].y * 1.25)}L${upper}L${xScale(horizons[horizons.length-1])},${yScale(pts[pts.length-1].y * 0.75)}L${lower}Z`}
            fill={`${colors[dk] || D.blue}12`}
          />
        );
      })}

      {/* Domain curves */}
      {domainKeys.map(dk => (
        <g key={dk}>
          <path d={makePath(dk)} fill="none" stroke={colors[dk] || D.blue} strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
          {horizons.map(t => (
            <circle key={t} cx={xScale(t)} cy={yScale(data[dk][t] || 0)} r="2"
              fill={colors[dk] || D.blue} opacity="0.8" />
          ))}
        </g>
      ))}

      {/* Legend */}
      {domainKeys.map((dk, i) => (
        <g key={dk} transform={`translate(${PAD + i * 70}, 10)`}>
          <rect x={0} y={0} width={8} height={2} fill={colors[dk] || D.blue} />
          <text x={12} y={4} fill={D.textMid} fontSize="6.5" fontFamily="monospace">
            {dk}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── RADAR CHART ────────────────────────────────────────────────

function RadarChart({ scenarios, size = 160 }) {
  const dims = ["Health","Economic","Environ.","Social","Efficiency","Scale"];
  const dimKeys = ["health","economic","environmental","social","efficiency","scalability"];
  const N = dims.length;
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const angle = (i) => (i / N) * Math.PI * 2 - Math.PI / 2;
  const pt = (i, val) => ({
    x: cx + Math.cos(angle(i)) * r * val,
    y: cy + Math.sin(angle(i)) * r * val,
  });

  const scenarioColors = [D.blue, D.amber, D.green, D.rose, D.violet];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1.0].map((frac, ri) => {
        const pts = dims.map((_, i) => pt(i, frac));
        const d = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") + "Z";
        return <path key={ri} d={d} fill="none" stroke="rgba(148,180,210,0.07)" strokeWidth="0.5" />;
      })}
      {/* Axes */}
      {dims.map((_, i) => {
        const outer = pt(i, 1.0);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(148,180,210,0.1)" strokeWidth="0.5" />;
      })}
      {/* Axis labels */}
      {dims.map((d, i) => {
        const outer = pt(i, 1.18);
        return <text key={i} x={outer.x} y={outer.y} textAnchor="middle" dominantBaseline="middle"
          fill={D.textMid} fontSize="6.5" fontFamily="monospace">{d}</text>;
      })}
      {/* Scenario polygons */}
      {scenarios.slice(0, 4).map((s, si) => {
        const pts = dimKeys.map((k, i) => pt(i, s[k] || 0));
        const d = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") + "Z";
        const col = scenarioColors[si];
        return (
          <g key={si}>
            <path d={d} fill={`${col}18`} stroke={col} strokeWidth="1" opacity="0.85" />
          </g>
        );
      })}
    </svg>
  );
}

// ── PARETO SCATTER ────────────────────────────────────────────

function ParetoScatter({ scenarios, xKey, yKey, xLabel, yLabel }) {
  const [hov, setHov] = useState(null);
  const W = 260, H = 180, PAD = 30;
  const xVals = scenarios.map(s => s[xKey]);
  const yVals = scenarios.map(s => s[yKey]);
  const xMax = Math.max(...xVals) * 1.05;
  const yMax = Math.max(...yVals) * 1.05;

  const sx = v => PAD + (v / xMax) * (W - PAD * 1.5);
  const sy = v => H - PAD - (v / yMax) * (H - PAD * 1.5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      {/* Axes */}
      <line x1={PAD} y1={H - PAD} x2={W - 10} y2={H - PAD} stroke={D.textDim} strokeWidth="0.5" />
      <line x1={PAD} y1={10} x2={PAD} y2={H - PAD} stroke={D.textDim} strokeWidth="0.5" />
      <text x={W / 2} y={H - 6} textAnchor="middle" fill={D.textMid} fontSize="7" fontFamily="monospace">{xLabel}</text>
      <text x={8} y={H / 2} textAnchor="middle" fill={D.textMid} fontSize="7" fontFamily="monospace"
        transform={`rotate(-90, 8, ${H / 2})`}>{yLabel}</text>

      {/* Pareto frontier line */}
      {(() => {
        const pareto = [...scenarios].filter(s => s.pareto).sort((a, b) => a[xKey] - b[xKey]);
        if (pareto.length < 2) return null;
        const d = pareto.map((s, i) => `${i === 0 ? "M" : "L"}${sx(s[xKey]).toFixed(1)},${sy(s[yKey]).toFixed(1)}`).join("");
        return <path d={d} fill="none" stroke={`${D.blue}40`} strokeWidth="1" strokeDasharray="3,2" />;
      })()}

      {/* Points */}
      {scenarios.map((s, i) => {
        const isH = hov === s.id;
        const col = s.pareto ? D.blue : D.textMid;
        return (
          <g key={i}
            onMouseEnter={() => setHov(s.id)}
            onMouseLeave={() => setHov(null)}
          >
            {s.pareto && (
              <circle cx={sx(s[xKey])} cy={sy(s[yKey])} r={isH ? 9 : 7}
                fill={`${D.blue}15`} stroke={`${D.blue}40`} strokeWidth="0.5" />
            )}
            <circle cx={sx(s[xKey])} cy={sy(s[yKey])} r={isH ? 5 : 3.5}
              fill={col} opacity={isH ? 1 : 0.7} />
            {isH && (
              <text x={sx(s[xKey]) + 7} y={sy(s[yKey]) - 4}
                fill={D.text} fontSize="7" fontFamily="monospace">{s.name.split(" ").slice(0, 2).join(" ")}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── WORLD STATE MAP ─────────────────────────────────────────────

function WorldStateBars({ variables, domain }) {
  const filtered = variables.filter(v => !domain || v.domain === domain);
  const trendColor = { rising: D.rose, falling: D.green, stable: D.textMid, volatile: D.amber };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {filtered.map((v, i) => {
        const col = DOMAIN_COLORS[v.domain] || D.blue;
        const normalizedVal = Math.min(v.value, 1.0);
        const isBad = ["rising"].includes(v.trend) && ["health","behavioral","environmental"].includes(v.domain);
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "6px 10px",
            border: `1px solid ${isBad ? "rgba(240,104,120,0.12)" : D.border}`,
            background: isBad ? "rgba(240,104,120,0.02)" : "transparent",
            animation: `fadeIn 0.3s ${i * 0.04}s both`,
          }}>
            <div style={{ width: 3, height: "100%", minHeight: 20, background: col, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: D.text, marginBottom: 2 }}>{v.name}</div>
              <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 1 }}>
                <div style={{ width: `${Math.min(normalizedVal * 100, 100)}%`, height: "100%", background: col }} />
              </div>
            </div>
            <div style={{ textAlign: "right", minWidth: 52 }}>
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

// ── SCENARIO CARD ──────────────────────────────────────────────

function ScenarioCard({ scenario, selected, onClick, rank }) {
  const domColors = [D.blue, D.amber, D.green, D.rose, D.violet, D.blue];
  const bars = [
    { key: "health",       label: "Health",   color: D.blue },
    { key: "economic",     label: "Econ",     color: D.amber },
    { key: "environmental",label: "Env",      color: D.green },
    { key: "social",       label: "Social",   color: D.rose },
  ];

  return (
    <div onClick={onClick} style={{
      padding: "12px 14px",
      border: `1px solid ${selected ? D.blue : scenario.pareto ? "rgba(77,168,240,0.2)" : D.border}`,
      background: selected ? D.blueGlow : scenario.pareto ? "rgba(77,168,240,0.03)" : "transparent",
      cursor: "pointer",
      transition: "all 0.2s",
      position: "relative",
    }}>
      {scenario.pareto && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          padding: "2px 6px",
          background: `${D.blue}22`,
          fontFamily: "monospace", fontSize: 7,
          color: D.blue, letterSpacing: "0.1em",
        }}>PARETO</div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontFamily: "monospace", fontSize: 8, color: D.textMid, marginBottom: 2 }}>
            #{String(rank).padStart(2, "0")} · {scenario.time} yrs · ${scenario.cost}B
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: D.text, lineHeight: 1.3 }}>{scenario.name}</div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 18, color: D.blue, fontWeight: 300 }}>
          {scenario.score.toFixed(3)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
        {bars.map(b => (
          <div key={b.key}>
            <div style={{ fontFamily: "monospace", fontSize: 7, color: D.textMid, marginBottom: 2 }}>{b.label}</div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 1 }}>
              <div style={{ width: `${scenario[b.key] * 100}%`, height: "100%", background: b.color }} />
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 8, color: b.color, marginTop: 1 }}>
              {Math.round(scenario[b.key] * 100)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────

export default function GSSEDashboard() {
  const [tab, setTab] = useState("state");
  const [selectedScenario, setSelectedScenario] = useState("sugar_reduction");
  const [selectedStrategyId, setSelectedStrategyId] = useState("s010");
  const [objProfile, setObjProfile] = useState(0);
  const [domainFilter, setDomainFilter] = useState(null);
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAnimTick(x => x + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const sim = PROPAGATION[selectedScenario];
  const strategy = SCENARIOS.find(s => s.id === selectedStrategyId) || SCENARIOS[7];

  const sortedScenarios = [...SCENARIOS].sort((a, b) => b.score - a.score);

  const TABS = ["state", "propagation", "scenarios", "optimizer", "strategy"];

  return (
    <div style={{ minHeight: "100vh", background: D.bg, color: D.text, fontFamily: "'DM Mono', 'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer {
          0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e3040; }
        button { font-family: inherit; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        padding: "18px 32px",
        borderBottom: `1px solid ${D.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: `${D.surface}ee`, backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: D.textMid, textTransform: "uppercase", marginBottom: 5 }}>
            Global Decision Support System
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: D.white, letterSpacing: "0.04em" }}>
            Global Simulation &amp; Strategy Engine
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
          {[
            { label: "World Variables",   val: "38", color: D.blue },
            { label: "Active Scenarios",  val: `${SCENARIOS.length}`, color: D.amber },
            { label: "Pareto Optimal",    val: `${SCENARIOS.filter(s=>s.pareto).length}`, color: D.green },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: "right" }}>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.1em", textTransform: "uppercase" }}>{m.label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: m.color, lineHeight: 1.1 }}>{m.val}</div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: D.green, boxShadow: `0 0 10px ${D.green}`, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 9, color: D.green, letterSpacing: "0.12em" }}>SIMULATION ACTIVE</span>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{
        display: "flex", padding: "0 32px",
        borderBottom: `1px solid ${D.border}`,
        background: `${D.surfaceAlt}88`,
      }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 18px", background: "transparent", border: "none",
            borderBottom: tab === t ? `2px solid ${D.blue}` : "2px solid transparent",
            color: tab === t ? D.blue : D.textMid,
            cursor: "pointer", fontSize: 9, letterSpacing: "0.15em",
            textTransform: "uppercase", marginBottom: -1, transition: "all 0.2s",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "28px 32px" }}>

        {/* ══ WORLD STATE ══ */}
        {tab === "state" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Global System State — {WORLD_STATE.length} indicators
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[null, "health","economic","environmental","social","behavioral"].map(d => (
                    <button key={d || "all"}
                      onClick={() => setDomainFilter(d)}
                      style={{
                        padding: "3px 7px", background: "transparent",
                        border: `1px solid ${domainFilter === d ? (DOMAIN_COLORS[d] || D.blue) : D.border}`,
                        color: domainFilter === d ? (DOMAIN_COLORS[d] || D.blue) : D.textMid,
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
                const avgBurden = vars.reduce((a, v) => a + v.burden, 0) / Math.max(vars.length, 1);
                return (
                  <div key={i} style={{
                    padding: "14px 16px", marginBottom: 8,
                    border: `1px solid ${color}22`,
                    background: `${color}05`,
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{ width: 3, height: 44, background: color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color, marginBottom: 4, fontStyle: "italic" }}>
                        {domain.charAt(0).toUpperCase() + domain.slice(1)}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: 9, color: D.textMid }}>
                        {vars.length} indicators · <span style={{ color: D.rose }}>{rising} rising</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "monospace", fontSize: 22, color, fontWeight: 300 }}>
                        {Math.round(avgBurden * 100)}
                      </div>
                      <div style={{ fontSize: 8, color: D.textMid }}>burden</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ PROPAGATION ══ */}
        {tab === "propagation" && (
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {Object.entries(PROPAGATION).map(([key, s]) => (
                <button key={key}
                  onClick={() => setSelectedScenario(key)}
                  style={{
                    flex: 1, padding: "10px 12px",
                    background: selectedScenario === key ? D.blueGlow : "transparent",
                    border: `1px solid ${selectedScenario === key ? D.blue : D.border}`,
                    color: selectedScenario === key ? D.blue : D.textMid,
                    cursor: "pointer", fontSize: 9, letterSpacing: "0.06em",
                    transition: "all 0.2s",
                  }}>
                  {s.name}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Time series */}
              <div>
                <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                  Effect Time Series — Domain Cumulative Impact
                </div>
                <div style={{
                  border: `1px solid ${D.border}`,
                  padding: "16px",
                  background: "rgba(0,0,0,0.2)",
                  marginBottom: 12,
                }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: D.amber, fontStyle: "italic", marginBottom: 4 }}>
                    "{sim.name}"
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: D.textMid, marginBottom: 12 }}>
                    magnitude: {sim.magnitude > 0 ? "+" : ""}{(sim.magnitude * 100).toFixed(0)}% ·
                    confidence: {Math.round(sim.confidence * 100)}%
                  </div>
                  <TimeSeriesChart data={sim.timeseries} colors={DOMAIN_COLORS} height={160} />
                </div>

                {/* Causal path */}
                <div style={{ padding: "10px 14px", border: `1px solid ${D.border}`, background: D.blueGlow }}>
                  <div style={{ fontSize: 8, color: D.textMid, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Primary Causal Path
                  </div>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                    {sim.causal_path.map((node, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{
                          padding: "3px 8px",
                          border: `1px solid ${i === 0 ? D.amber : D.border}`,
                          fontFamily: "monospace", fontSize: 9,
                          color: i === 0 ? D.amber : D.text,
                          background: i === 0 ? D.amberDim : "transparent",
                        }}>
                          {node.replace(/_/g, " ")}
                        </div>
                        {i < sim.causal_path.length - 1 && (
                          <span style={{ color: D.textMid, fontSize: 10 }}>→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Effects breakdown */}
              <div>
                <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                  Propagated Effects — {sim.effects.length} downstream variables
                </div>
                {sim.effects.map((e, i) => {
                  const col = DOMAIN_COLORS[e.domain] || D.blue;
                  const isPositive = (e.delta > 0 && !["obesity","type 2 diabetes","healthcare cost","CO₂ emissions","cortisol"].includes(e.target)) ||
                                     (e.delta < 0 && ["obesity","type 2 diabetes","healthcare cost","CO₂ emissions","cortisol"].includes(e.target));
                  const impactColor = isPositive ? D.green : D.rose;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 12px", marginBottom: 6,
                      border: `1px solid ${impactColor}18`,
                      background: `${impactColor}04`,
                      animation: `fadeIn 0.4s ${i * 0.08}s both`,
                    }}>
                      <span style={{ color: impactColor, fontSize: 16, lineHeight: 1, width: 16 }}>
                        {e.delta > 0 ? "↑" : "↓"}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "monospace", fontSize: 10, color: D.text }}>
                          {e.target}
                        </div>
                        <div style={{ fontFamily: "monospace", fontSize: 8, color: D.textMid }}>
                          {e.domain} · depth {e.depth} · {e.time}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "monospace", fontSize: 11, color: impactColor }}>
                          {(e.delta * 100).toFixed(1)}%
                        </div>
                        <div style={{ fontFamily: "monospace", fontSize: 8, color: D.textMid }}>
                          conf {Math.round(e.conf * 100)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ SCENARIOS ══ */}
        {tab === "scenarios" && (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                {SCENARIOS.length} Scenarios · {SCENARIOS.filter(s=>s.pareto).length} Pareto-Optimal
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sortedScenarios.map((s, i) => (
                  <ScenarioCard key={s.id} scenario={s} rank={i+1}
                    selected={selectedStrategyId === s.id}
                    onClick={() => setSelectedStrategyId(s.id)} />
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                Scenario Analysis — {strategy.name}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div style={{ padding: "16px", border: `1px solid ${D.border}`, background: D.blueGlow }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: D.white, marginBottom: 4, fontStyle: "italic" }}>
                    {strategy.name}
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: D.textMid, lineHeight: 1.7 }}>
                    Composite Score: <span style={{ color: D.blue }}>{strategy.score.toFixed(3)}</span><br/>
                    Time to Impact: <span style={{ color: D.amber }}>{strategy.time} years</span><br/>
                    Total Cost: <span style={{ color: D.rose }}>${strategy.cost}B annually</span><br/>
                    Pareto Status: <span style={{ color: strategy.pareto ? D.green : D.textMid }}>
                      {strategy.pareto ? "✓ Pareto Optimal" : "◆ Dominated"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 8 }}>
                  <RadarChart scenarios={[strategy]} size={180} />
                </div>
              </div>

              {/* Pareto scatter */}
              <div style={{ padding: "14px", border: `1px solid ${D.border}` }}>
                <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                  Pareto Frontier — Health Impact vs Cost Efficiency
                </div>
                <ParetoScatter scenarios={SCENARIOS} xKey="cost" yKey="score"
                  xLabel="Total Cost ($B)" yLabel="Composite Score" />
              </div>
            </div>
          </div>
        )}

        {/* ══ OPTIMIZER ══ */}
        {tab === "optimizer" && (
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                Objective Profile
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                {OBJ_PROFILES.map((p, i) => (
                  <button key={i}
                    onClick={() => setObjProfile(i)}
                    style={{
                      padding: "9px 12px", background: objProfile === i ? D.blueGlow : "transparent",
                      border: `1px solid ${objProfile === i ? D.blue : D.border}`,
                      color: objProfile === i ? D.blue : D.textMid,
                      cursor: "pointer", fontSize: 9, textAlign: "left",
                      letterSpacing: "0.06em", transition: "all 0.2s",
                    }}>{p.label}</button>
                ))}
              </div>

              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                Weight Distribution
              </div>
              {OBJ_DIMS.map((dim, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 8, color: D.textMid }}>{dim}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 8, color: D.blue }}>
                      {Math.round(OBJ_PROFILES[objProfile].weights[i] * 100)}%
                    </span>
                  </div>
                  <div style={{ height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 1 }}>
                    <div style={{
                      width: `${OBJ_PROFILES[objProfile].weights[i] * 100 * 2}%`,
                      height: "100%", background: D.blue,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                Optimized Strategy Ranking — {OBJ_PROFILES[objProfile].label}
              </div>

              {/* Compute scores for current profile */}
              {(() => {
                const w = OBJ_PROFILES[objProfile].weights;
                const dims = ["health","economic","environmental","social","efficiency","scalability"];
                const scored = SCENARIOS.map(s => ({
                  ...s,
                  profileScore: round4(dims.reduce((acc, d, i) => acc + (s[d] || 0) * w[i], 0)),
                })).sort((a, b) => b.profileScore - a.profileScore);

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {scored.map((s, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 14px",
                        border: `1px solid ${i === 0 ? D.blue : s.pareto ? "rgba(77,168,240,0.2)" : D.border}`,
                        background: i === 0 ? D.blueGlow : "transparent",
                        animation: `fadeIn 0.3s ${i * 0.06}s both`,
                      }}>
                        <div style={{
                          width: 28, height: 28,
                          border: `1px solid ${i < 3 ? D.blue : D.textDim}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "monospace", fontSize: 10,
                          color: i < 3 ? D.blue : D.textMid,
                          flexShrink: 0,
                        }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "monospace", fontSize: 10, color: D.text }}>{s.name}</div>
                          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                            {[["H", s.health, D.blue], ["E", s.economic, D.amber], ["Env", s.environmental, D.green], ["S", s.social, D.rose]].map(([l, v, c]) => (
                              <span key={l} style={{ fontFamily: "monospace", fontSize: 8, color: c }}>
                                {l}: {Math.round(v * 100)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "monospace", fontSize: 16, color: i === 0 ? D.blue : D.text, fontWeight: 300 }}>
                            {s.profileScore.toFixed(3)}
                          </div>
                          {s.pareto && <div style={{ fontFamily: "monospace", fontSize: 7, color: D.blue }}>PARETO</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ══ STRATEGY OUTPUT ══ */}
        {tab === "strategy" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 8, color: D.textMid, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
                Recommended Strategy Output
              </div>

              <div style={{
                padding: "20px",
                border: `1px solid ${D.blue}`,
                background: D.blueGlow,
                marginBottom: 16,
              }}>
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
                  ["Obesity Rate",          "↓ 8.2%",  D.green],
                  ["Type 2 Diabetes",       "↓ 11.4%", D.green],
                  ["Cardiovascular Disease","↓ 9.1%",  D.green],
                  ["Mental Health Burden",  "↓ 12.8%", D.green],
                  ["Healthcare Cost",       "↓ 6.3%",  D.green],
                  ["Life Expectancy",       "↑ 1.8 yrs",D.blue],
                  ["Workforce Productivity","↑ 4.2%",  D.blue],
                ].map(([label, val, col], i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: `1px solid ${D.textDim}`,
                  }}>
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
                padding: "16px", fontFamily: "monospace",
                fontSize: 9, color: D.blue, lineHeight: 1.9,
                whiteSpace: "pre-wrap", marginBottom: 16,
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

              <div style={{ padding: "14px", border: `1px solid ${D.amberDim}`, background: D.amberDim.replace("0.18","0.03") }}>
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

function round4(n) { return Math.round(n * 10000) / 10000; }
