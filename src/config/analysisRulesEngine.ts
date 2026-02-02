/**
 * MATEMATISKA ANALYSREGLER
 * ═══════════════════════════════════════════════════════════════
 * 
 * Exakta trösklar, konfidens och röd/gul/grön-logik för alla KPI:er.
 * 
 * FÄRGLOGIK:
 *   🟢 GRÖN (positive): Värdet uppfyller eller överträffar målnivå
 *   🟡 GUL (warning): Värdet avviker från mål men är inte kritiskt
 *   🔴 RÖD (critical): Värdet kräver omedelbar uppmärksamhet
 *   ⚪ NEUTRAL: Otillräckligt data för bedömning
 * 
 * KONFIDENSBERÄKNING:
 *   C = Cd × Ct × Cq × Cs
 *   där:
 *     Cd = Datakvalitetskoefficient [0-1]
 *     Ct = Tidskonsistenskoefficient [0-1]
 *     Cq = Källkvalitetskoefficient [0-1]
 *     Cs = Statistisk signifikanskoefficient [0-1]
 */

import type { KPIStatus, TrendDirection } from '@/types/kpi';

// ═══════════════════════════════════════════════════════════════
// TYPDEFINITIONER
// ═══════════════════════════════════════════════════════════════

export interface AnalysisRule {
  id: string;
  name: string;
  category: 'threshold' | 'trend' | 'anomaly' | 'correlation' | 'composite';
  formula: string;
  description: string;
  parameters: RuleParameter[];
  outputType: 'status' | 'score' | 'flag';
}

export interface RuleParameter {
  name: string;
  symbol: string;
  type: 'number' | 'percentage' | 'boolean';
  defaultValue: number | boolean;
  range?: { min: number; max: number };
}

export interface ThresholdConfig {
  /** Målvärde (idealiskt) */
  target: number;
  /** Grön tröskel - avvikelse från target acceptabel */
  greenThreshold: number;
  /** Gul tröskel - varning */
  yellowThreshold: number;
  /** Röd tröskel - kritisk */
  redThreshold: number;
  /** Är lägre bättre? (t.ex. arbetslöshet) */
  inverted: boolean;
  /** Enhet för display */
  unit: string;
}

export interface ConfidenceFactors {
  /** Datakvalitet: fullständighet, precision [0-1] */
  dataQuality: number;
  /** Tidskonsistens: hur stabil är tidserien [0-1] */
  timeConsistency: number;
  /** Källkvalitet: tillförlitlighet hos datakälla [0-1] */
  sourceQuality: number;
  /** Statistisk signifikans: p-värde inverterat [0-1] */
  statisticalSignificance: number;
}

export interface AnalysisResult {
  status: KPIStatus;
  statusColor: 'green' | 'yellow' | 'red' | 'neutral';
  statusHex: string;
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low' | 'insufficient';
  score: number; // 0-100 normaliserad poäng
  deviation: number; // Avvikelse från target i %
  explanation: string;
  formula: string;
  appliedRules: string[];
}

// ═══════════════════════════════════════════════════════════════
// EXAKTA TRÖSKELVÄRDEN
// ═══════════════════════════════════════════════════════════════

export const THRESHOLD_CONFIG: Record<string, ThresholdConfig> = {
  // === DEMOGRAFI & HÄLSA ===
  life_expectancy: {
    target: 83.5,
    greenThreshold: 82.0,  // ≥82.0 = grön
    yellowThreshold: 80.0, // 80.0-81.9 = gul
    redThreshold: 78.0,    // <78.0 = röd
    inverted: false,
    unit: 'år'
  },
  excess_mortality: {
    target: 0,
    greenThreshold: 2.0,   // ≤2.0% = grön
    yellowThreshold: 5.0,  // 2.1-5.0% = gul
    redThreshold: 8.0,     // >8.0% = röd
    inverted: true,
    unit: '%'
  },
  infant_mortality: {
    target: 2.0,
    greenThreshold: 2.5,   // ≤2.5‰ = grön
    yellowThreshold: 3.5,  // 2.6-3.5‰ = gul
    redThreshold: 5.0,     // >5.0‰ = röd
    inverted: true,
    unit: '‰'
  },

  // === ARBETE & PRODUKTIVITET ===
  employment_rate: {
    target: 80,
    greenThreshold: 75,    // ≥75% = grön
    yellowThreshold: 68,   // 68-74.9% = gul
    redThreshold: 60,      // <60% = röd
    inverted: false,
    unit: '%'
  },
  unemployment_rate: {
    target: 4.0,
    greenThreshold: 5.0,   // ≤5.0% = grön
    yellowThreshold: 7.5,  // 5.1-7.5% = gul
    redThreshold: 10.0,    // >10.0% = röd
    inverted: true,
    unit: '%'
  },
  long_term_unemployment: {
    target: 1.0,
    greenThreshold: 1.5,   // ≤1.5% = grön
    yellowThreshold: 2.5,  // 1.6-2.5% = gul
    redThreshold: 4.0,     // >4.0% = röd
    inverted: true,
    unit: '%'
  },
  productivity_per_hour: {
    target: 600,
    greenThreshold: 550,   // ≥550 SEK = grön
    yellowThreshold: 480,  // 480-549 SEK = gul
    redThreshold: 400,     // <400 SEK = röd
    inverted: false,
    unit: 'SEK/h'
  },

  // === EKONOMI ===
  gdp_growth: {
    target: 2.5,
    greenThreshold: 1.5,   // ≥1.5% = grön
    yellowThreshold: 0.5,  // 0.5-1.4% = gul
    redThreshold: -0.5,    // <-0.5% = röd
    inverted: false,
    unit: '%'
  },
  inflation: {
    target: 2.0,
    greenThreshold: 3.0,   // ≤3.0% = grön (nära mål)
    yellowThreshold: 5.0,  // 3.1-5.0% = gul
    redThreshold: 8.0,     // >8.0% = röd
    inverted: true,
    unit: '%'
  },
  public_debt_gdp: {
    target: 35,
    greenThreshold: 45,    // ≤45% = grön
    yellowThreshold: 60,   // 45.1-60% = gul
    redThreshold: 80,      // >80% = röd
    inverted: true,
    unit: '% av BNP'
  },
  budget_balance: {
    target: 0.5,
    greenThreshold: -1.0,  // ≥-1.0% = grön
    yellowThreshold: -3.0, // -3.0 till -1.1% = gul
    redThreshold: -5.0,    // <-5.0% = röd
    inverted: false,
    unit: '% av BNP'
  },

  // === SOCIAL STABILITET ===
  gini_coefficient: {
    target: 0.25,
    greenThreshold: 0.28,  // ≤0.28 = grön
    yellowThreshold: 0.32, // 0.29-0.32 = gul
    redThreshold: 0.38,    // >0.38 = röd
    inverted: true,
    unit: 'index'
  },
  homicide_rate: {
    target: 0.8,
    greenThreshold: 1.0,   // ≤1.0 = grön
    yellowThreshold: 1.3,  // 1.1-1.3 = gul
    redThreshold: 1.8,     // >1.8 = röd
    inverted: true,
    unit: 'per 100k'
  },
  trust_in_institutions: {
    target: 70,
    greenThreshold: 60,    // ≥60% = grön
    yellowThreshold: 50,   // 50-59% = gul
    redThreshold: 40,      // <40% = röd
    inverted: false,
    unit: '%'
  },
  voter_turnout: {
    target: 90,
    greenThreshold: 80,    // ≥80% = grön
    yellowThreshold: 70,   // 70-79% = gul
    redThreshold: 60,      // <60% = röd
    inverted: false,
    unit: '%'
  },

  // === OFFENTLIGA TJÄNSTER ===
  healthcare_wait_time: {
    target: 14,
    greenThreshold: 30,    // ≤30 dagar = grön
    yellowThreshold: 60,   // 31-60 dagar = gul
    redThreshold: 90,      // >90 dagar = röd
    inverted: true,
    unit: 'dagar'
  },
  education_completion: {
    target: 90,
    greenThreshold: 82,    // ≥82% = grön
    yellowThreshold: 72,   // 72-81% = gul
    redThreshold: 60,      // <60% = röd
    inverted: false,
    unit: '%'
  },
  pisa_score: {
    target: 520,
    greenThreshold: 500,   // ≥500 = grön
    yellowThreshold: 470,  // 470-499 = gul
    redThreshold: 440,     // <440 = röd
    inverted: false,
    unit: 'poäng'
  },

  // === INFRASTRUKTUR ===
  housing_deficit: {
    target: 0,
    greenThreshold: 30000,    // ≤30k = grön
    yellowThreshold: 80000,   // 30k-80k = gul
    redThreshold: 150000,     // >150k = röd
    inverted: true,
    unit: 'bostäder'
  },
  energy_supply_stability: {
    target: 99.99,
    greenThreshold: 99.5,  // ≥99.5% = grön
    yellowThreshold: 98.0, // 98-99.4% = gul
    redThreshold: 95.0,    // <95% = röd
    inverted: false,
    unit: '%'
  },
  broadband_coverage: {
    target: 100,
    greenThreshold: 95,    // ≥95% = grön
    yellowThreshold: 85,   // 85-94% = gul
    redThreshold: 70,      // <70% = röd
    inverted: false,
    unit: '%'
  },

  // === MILJÖ ===
  co2_emissions: {
    target: 3.0,
    greenThreshold: 4.0,   // ≤4.0 ton = grön
    yellowThreshold: 6.0,  // 4.1-6.0 ton = gul
    redThreshold: 8.0,     // >8.0 ton = röd
    inverted: true,
    unit: 'ton/capita'
  },
  renewable_energy: {
    target: 70,
    greenThreshold: 55,    // ≥55% = grön
    yellowThreshold: 40,   // 40-54% = gul
    redThreshold: 25,      // <25% = röd
    inverted: false,
    unit: '%'
  }
};

// ═══════════════════════════════════════════════════════════════
// TRENDREGLER
// ═══════════════════════════════════════════════════════════════

export interface TrendRule {
  id: string;
  name: string;
  /** Positiv trend = bra för icke-inverterade */
  greenTrendMin: number;
  /** Stabil range */
  stableRange: { min: number; max: number };
  /** Negativ trend = varning */
  yellowTrendMax: number;
  /** Kraftigt negativ = kritisk */
  redTrendMax: number;
}

export const TREND_RULES: TrendRule = {
  id: 'standard_trend',
  name: 'Standardtrend',
  greenTrendMin: 2.0,      // ≥+2% = positiv trend
  stableRange: { min: -2.0, max: 2.0 }, // -2% till +2% = stabil
  yellowTrendMax: -5.0,    // -2% till -5% = varning
  redTrendMax: -10.0       // <-10% = kritisk
};

// ═══════════════════════════════════════════════════════════════
// ANOMALIDETEKTERING
// ═══════════════════════════════════════════════════════════════

export interface AnomalyRule {
  id: string;
  name: string;
  formula: string;
  /** Standardavvikelser för varning */
  sigmaWarning: number;
  /** Standardavvikelser för kritisk */
  sigmaCritical: number;
  /** Minimum antal datapunkter */
  minDataPoints: number;
}

export const ANOMALY_RULES: AnomalyRule[] = [
  {
    id: 'zscore_anomaly',
    name: 'Z-score anomali',
    formula: 'z = (x - μ) / σ',
    sigmaWarning: 2.0,     // |z| ≥ 2.0 = varning
    sigmaCritical: 3.0,    // |z| ≥ 3.0 = kritisk
    minDataPoints: 12
  },
  {
    id: 'iqr_anomaly',
    name: 'IQR anomali',
    formula: 'outlier if x < Q1 - k×IQR or x > Q3 + k×IQR',
    sigmaWarning: 1.5,     // k=1.5 för mild outlier
    sigmaCritical: 3.0,    // k=3.0 för extrem outlier
    minDataPoints: 20
  },
  {
    id: 'rate_of_change',
    name: 'Förändringshastighet',
    formula: 'Δ = (x_t - x_{t-1}) / x_{t-1}',
    sigmaWarning: 0.15,    // >15% förändring = varning
    sigmaCritical: 0.30,   // >30% förändring = kritisk
    minDataPoints: 3
  }
];

// ═══════════════════════════════════════════════════════════════
// KONFIDENSBERÄKNING
// ═══════════════════════════════════════════════════════════════

/**
 * Beräkna total konfidenspoäng
 * 
 * Formel: C = Cd × Ct × Cq × Cs
 * 
 * @param factors Konfidensfaktorer
 * @returns Total konfidenspoäng [0-1]
 */
export function calculateConfidence(factors: ConfidenceFactors): number {
  const C = factors.dataQuality 
          * factors.timeConsistency 
          * factors.sourceQuality 
          * factors.statisticalSignificance;
  
  return Math.round(C * 1000) / 1000; // 3 decimaler
}

/**
 * Klassificera konfidensnivå
 */
export function classifyConfidence(confidence: number): 'high' | 'medium' | 'low' | 'insufficient' {
  if (confidence >= 0.85) return 'high';
  if (confidence >= 0.65) return 'medium';
  if (confidence >= 0.40) return 'low';
  return 'insufficient';
}

/**
 * Standardkonfidensfaktorer baserat på datakälla
 */
export const SOURCE_CONFIDENCE: Record<string, number> = {
  'scb': 0.98,           // Statistiska centralbyrån
  'eurostat': 0.95,      // Eurostat
  'oecd': 0.93,          // OECD
  'world_bank': 0.90,    // Världsbanken
  'kolada': 0.92,        // Kolada (kommundata)
  'riksbanken': 0.97,    // Riksbanken
  'arbetsformedlingen': 0.94, // Arbetsförmedlingen
  'socialstyrelsen': 0.95,    // Socialstyrelsen
  'bra': 0.93,           // Brottsförebyggande rådet
  'unknown': 0.60        // Okänd källa
};

// ═══════════════════════════════════════════════════════════════
// STATUSBERÄKNING
// ═══════════════════════════════════════════════════════════════

export const STATUS_COLORS = {
  green: { hex: '#22c55e', hsl: 'hsl(142, 71%, 45%)', label: 'Positivt' },
  yellow: { hex: '#eab308', hsl: 'hsl(48, 96%, 47%)', label: 'Varning' },
  red: { hex: '#ef4444', hsl: 'hsl(0, 84%, 60%)', label: 'Kritiskt' },
  neutral: { hex: '#6b7280', hsl: 'hsl(220, 9%, 46%)', label: 'Neutral' }
} as const;

/**
 * Beräkna status med full matematisk motivering
 */
export function calculateStatus(
  kpiId: string,
  value: number,
  previousValue?: number,
  confidenceFactors?: Partial<ConfidenceFactors>
): AnalysisResult {
  const config = THRESHOLD_CONFIG[kpiId];
  const appliedRules: string[] = [];
  
  if (!config) {
    return createNeutralResult('Ingen tröskelkonfiguration definierad');
  }
  
  // 1. Beräkna konfidens
  const factors: ConfidenceFactors = {
    dataQuality: confidenceFactors?.dataQuality ?? 0.85,
    timeConsistency: confidenceFactors?.timeConsistency ?? 0.90,
    sourceQuality: confidenceFactors?.sourceQuality ?? 0.90,
    statisticalSignificance: confidenceFactors?.statisticalSignificance ?? 0.85
  };
  const confidence = calculateConfidence(factors);
  const confidenceLevel = classifyConfidence(confidence);
  
  // 2. Beräkna avvikelse från target
  const deviation = ((value - config.target) / config.target) * 100;
  
  // 3. Beräkna normaliserad score (0-100)
  const score = calculateNormalizedScore(value, config);
  
  // 4. Bestäm status baserat på trösklar
  let status: KPIStatus;
  let statusColor: 'green' | 'yellow' | 'red' | 'neutral';
  let explanation: string;
  
  if (config.inverted) {
    // Lägre är bättre
    if (value <= config.greenThreshold) {
      status = 'positive';
      statusColor = 'green';
      explanation = `${value} ${config.unit} ≤ ${config.greenThreshold} ${config.unit} (grön tröskel)`;
      appliedRules.push('THRESHOLD_GREEN_INVERTED');
    } else if (value <= config.yellowThreshold) {
      status = 'warning';
      statusColor = 'yellow';
      explanation = `${config.greenThreshold} < ${value} ${config.unit} ≤ ${config.yellowThreshold} ${config.unit}`;
      appliedRules.push('THRESHOLD_YELLOW_INVERTED');
    } else {
      status = 'critical';
      statusColor = 'red';
      explanation = `${value} ${config.unit} > ${config.yellowThreshold} ${config.unit} (gul tröskel)`;
      appliedRules.push('THRESHOLD_RED_INVERTED');
    }
  } else {
    // Högre är bättre
    if (value >= config.greenThreshold) {
      status = 'positive';
      statusColor = 'green';
      explanation = `${value} ${config.unit} ≥ ${config.greenThreshold} ${config.unit} (grön tröskel)`;
      appliedRules.push('THRESHOLD_GREEN');
    } else if (value >= config.yellowThreshold) {
      status = 'warning';
      statusColor = 'yellow';
      explanation = `${config.yellowThreshold} ≤ ${value} ${config.unit} < ${config.greenThreshold} ${config.unit}`;
      appliedRules.push('THRESHOLD_YELLOW');
    } else {
      status = 'critical';
      statusColor = 'red';
      explanation = `${value} ${config.unit} < ${config.yellowThreshold} ${config.unit} (gul tröskel)`;
      appliedRules.push('THRESHOLD_RED');
    }
  }
  
  // 5. Trendanalys (om tidigare värde finns)
  if (previousValue !== undefined && previousValue !== 0) {
    const trendPercent = ((value - previousValue) / previousValue) * 100;
    const trendResult = analyzeTrend(trendPercent, config.inverted);
    
    if (trendResult.overrideStatus) {
      if (trendResult.severity === 'critical' && status !== 'critical') {
        status = 'critical';
        statusColor = 'red';
        explanation += ` | Trend: ${trendPercent.toFixed(1)}% (kritisk förändring)`;
        appliedRules.push('TREND_OVERRIDE_CRITICAL');
      } else if (trendResult.severity === 'warning' && status === 'positive') {
        status = 'warning';
        statusColor = 'yellow';
        explanation += ` | Trend: ${trendPercent.toFixed(1)}% (negativ trend)`;
        appliedRules.push('TREND_OVERRIDE_WARNING');
      }
    }
  }
  
  // 6. Konstruera formel
  const formula = config.inverted
    ? `STATUS = { GRÖN om v ≤ ${config.greenThreshold}, GUL om v ≤ ${config.yellowThreshold}, RÖD annars }`
    : `STATUS = { GRÖN om v ≥ ${config.greenThreshold}, GUL om v ≥ ${config.yellowThreshold}, RÖD annars }`;
  
  return {
    status,
    statusColor,
    statusHex: STATUS_COLORS[statusColor].hex,
    confidence,
    confidenceLevel,
    score,
    deviation: Math.round(deviation * 100) / 100,
    explanation,
    formula,
    appliedRules
  };
}

/**
 * Beräkna normaliserad score 0-100
 */
function calculateNormalizedScore(value: number, config: ThresholdConfig): number {
  if (config.inverted) {
    // Lägre är bättre: score = 100 vid target, 0 vid red threshold
    if (value <= config.target) return 100;
    if (value >= config.redThreshold) return 0;
    
    const range = config.redThreshold - config.target;
    const position = value - config.target;
    return Math.round(100 * (1 - position / range));
  } else {
    // Högre är bättre: score = 100 vid target, 0 vid red threshold
    if (value >= config.target) return 100;
    if (value <= config.redThreshold) return 0;
    
    const range = config.target - config.redThreshold;
    const position = value - config.redThreshold;
    return Math.round(100 * (position / range));
  }
}

/**
 * Analysera trend och avgör om den ska override:a status
 */
function analyzeTrend(trendPercent: number, inverted: boolean): { 
  overrideStatus: boolean; 
  severity: 'positive' | 'neutral' | 'warning' | 'critical' 
} {
  const effectiveTrend = inverted ? -trendPercent : trendPercent;
  
  if (effectiveTrend >= TREND_RULES.greenTrendMin) {
    return { overrideStatus: false, severity: 'positive' };
  }
  
  if (effectiveTrend >= TREND_RULES.stableRange.min) {
    return { overrideStatus: false, severity: 'neutral' };
  }
  
  if (effectiveTrend >= TREND_RULES.redTrendMax) {
    return { overrideStatus: true, severity: 'warning' };
  }
  
  return { overrideStatus: true, severity: 'critical' };
}

/**
 * Skapa neutralt resultat
 */
function createNeutralResult(reason: string): AnalysisResult {
  return {
    status: 'neutral',
    statusColor: 'neutral',
    statusHex: STATUS_COLORS.neutral.hex,
    confidence: 0,
    confidenceLevel: 'insufficient',
    score: 50,
    deviation: 0,
    explanation: reason,
    formula: 'N/A',
    appliedRules: ['INSUFFICIENT_DATA']
  };
}

// ═══════════════════════════════════════════════════════════════
// Z-SCORE ANOMALIDETEKTERING
// ═══════════════════════════════════════════════════════════════

/**
 * Beräkna Z-score för anomalidetektering
 * 
 * Formel: z = (x - μ) / σ
 */
export function calculateZScore(
  value: number,
  historicalValues: number[]
): { zScore: number; isAnomaly: boolean; severity: 'normal' | 'warning' | 'critical' } {
  if (historicalValues.length < ANOMALY_RULES[0].minDataPoints) {
    return { zScore: 0, isAnomaly: false, severity: 'normal' };
  }
  
  const mean = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
  const variance = historicalValues.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / historicalValues.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) {
    return { zScore: 0, isAnomaly: false, severity: 'normal' };
  }
  
  const zScore = (value - mean) / stdDev;
  const absZ = Math.abs(zScore);
  
  let severity: 'normal' | 'warning' | 'critical' = 'normal';
  let isAnomaly = false;
  
  if (absZ >= ANOMALY_RULES[0].sigmaCritical) {
    severity = 'critical';
    isAnomaly = true;
  } else if (absZ >= ANOMALY_RULES[0].sigmaWarning) {
    severity = 'warning';
    isAnomaly = true;
  }
  
  return {
    zScore: Math.round(zScore * 100) / 100,
    isAnomaly,
    severity
  };
}

// ═══════════════════════════════════════════════════════════════
// KORRELATIONSANALYS
// ═══════════════════════════════════════════════════════════════

export interface CorrelationResult {
  coefficient: number;
  strength: 'strong' | 'moderate' | 'weak' | 'none';
  direction: 'positive' | 'negative';
  significant: boolean;
  pValue: number;
}

/**
 * Beräkna Pearson-korrelation
 * 
 * Formel: r = Σ((x-x̄)(y-ȳ)) / √(Σ(x-x̄)² × Σ(y-ȳ)²)
 */
export function calculateCorrelation(
  xValues: number[],
  yValues: number[]
): CorrelationResult {
  if (xValues.length !== yValues.length || xValues.length < 3) {
    return { 
      coefficient: 0, 
      strength: 'none', 
      direction: 'positive',
      significant: false, 
      pValue: 1 
    };
  }
  
  const n = xValues.length;
  const xMean = xValues.reduce((a, b) => a + b, 0) / n;
  const yMean = yValues.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = yValues[i] - yMean;
    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }
  
  const denominator = Math.sqrt(xDenominator * yDenominator);
  
  if (denominator === 0) {
    return { 
      coefficient: 0, 
      strength: 'none', 
      direction: 'positive',
      significant: false, 
      pValue: 1 
    };
  }
  
  const r = numerator / denominator;
  const absR = Math.abs(r);
  
  // Klassificera styrka
  let strength: 'strong' | 'moderate' | 'weak' | 'none';
  if (absR >= 0.7) strength = 'strong';
  else if (absR >= 0.4) strength = 'moderate';
  else if (absR >= 0.2) strength = 'weak';
  else strength = 'none';
  
  // Beräkna approximativt p-värde (t-test)
  const tStat = r * Math.sqrt((n - 2) / (1 - r * r));
  const pValue = approximatePValue(Math.abs(tStat), n - 2);
  
  return {
    coefficient: Math.round(r * 1000) / 1000,
    strength,
    direction: r >= 0 ? 'positive' : 'negative',
    significant: pValue < 0.05,
    pValue: Math.round(pValue * 1000) / 1000
  };
}

/**
 * Approximera p-värde från t-statistik
 */
function approximatePValue(t: number, df: number): number {
  // Förenklad approximation
  const x = df / (df + t * t);
  if (df < 1) return 1;
  
  // Beta-funktion approximation
  const a = df / 2;
  const b = 0.5;
  const beta = incompleteBeta(x, a, b);
  
  return Math.min(1, Math.max(0, beta));
}

/**
 * Inkomplett beta-funktion (förenklad)
 */
function incompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  
  // Approximation för typiska värden
  const factor = Math.pow(x, a) * Math.pow(1 - x, b);
  return factor * (1 / a + (a + b) * x / (a * (a + 1)));
}

// ═══════════════════════════════════════════════════════════════
// EXPORTERA FORMLER FÖR UI
// ═══════════════════════════════════════════════════════════════

export const FORMULA_DOCUMENTATION = {
  confidence: {
    name: 'Konfidensberäkning',
    formula: 'C = Cd × Ct × Cq × Cs',
    variables: {
      'Cd': 'Datakvalitetskoefficient [0-1]',
      'Ct': 'Tidskonsistenskoefficient [0-1]',
      'Cq': 'Källkvalitetskoefficient [0-1]',
      'Cs': 'Statistisk signifikanskoefficient [0-1]'
    },
    interpretation: {
      '≥0.85': 'Hög konfidens',
      '0.65-0.84': 'Medel konfidens',
      '0.40-0.64': 'Låg konfidens',
      '<0.40': 'Otillräcklig data'
    }
  },
  zscore: {
    name: 'Z-score anomalidetektering',
    formula: 'z = (x - μ) / σ',
    variables: {
      'x': 'Observerat värde',
      'μ': 'Medelvärde',
      'σ': 'Standardavvikelse'
    },
    interpretation: {
      '|z| < 2': 'Normal',
      '2 ≤ |z| < 3': 'Varning',
      '|z| ≥ 3': 'Kritisk anomali'
    }
  },
  correlation: {
    name: 'Pearson-korrelation',
    formula: 'r = Σ((x-x̄)(y-ȳ)) / √(Σ(x-x̄)² × Σ(y-ȳ)²)',
    variables: {
      'x, y': 'Dataserier',
      'x̄, ȳ': 'Medelvärden'
    },
    interpretation: {
      '|r| ≥ 0.7': 'Stark korrelation',
      '0.4 ≤ |r| < 0.7': 'Måttlig korrelation',
      '0.2 ≤ |r| < 0.4': 'Svag korrelation',
      '|r| < 0.2': 'Ingen korrelation'
    }
  }
} as const;

// ═══════════════════════════════════════════════════════════════
// UTILITY EXPORTS
// ═══════════════════════════════════════════════════════════════

export function getThresholdConfig(kpiId: string): ThresholdConfig | undefined {
  return THRESHOLD_CONFIG[kpiId];
}

export function getAllConfiguredKpis(): string[] {
  return Object.keys(THRESHOLD_CONFIG);
}

export function formatStatusExplanation(result: AnalysisResult): string {
  return `${STATUS_COLORS[result.statusColor].label}: ${result.explanation} (Konfidens: ${(result.confidence * 100).toFixed(0)}%)`;
}
