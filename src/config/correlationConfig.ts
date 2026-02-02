/**
 * KORRELATIONS-ENGINE KONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * Regler för korrelationsanalys mellan KPI:er.
 * Skyddsräcken för att undvika feltolkning.
 * 
 * KRITISK REGEL: Korrelation ≠ Orsak
 */

export type CorrelationMethod = 'pearson' | 'spearman';

export interface CorrelationInput {
  kpiId1: string;
  kpiId2: string;
  values1: number[];
  values2: number[];
  dates: string[];
}

export interface CorrelationResult {
  kpiId1: string;
  kpiId2: string;
  method: CorrelationMethod;
  coefficient: number;           // -1 till 1
  pValue: number;                // Signifikans
  lag: number;                   // Tidsförskjutning (månader)
  sampleSize: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  stability: number;             // 0-1, hur stabil är korrelationen
  interpretation: CorrelationInterpretation;
  warnings: string[];
}

export interface CorrelationInterpretation {
  strength: 'none' | 'weak' | 'moderate' | 'strong' | 'very_strong';
  direction: 'positive' | 'negative' | 'none';
  label: string;
  description: string;
}

/**
 * OBLIGATORISKA DISCLAIMERS
 */
export const CORRELATION_DISCLAIMERS = {
  primary: 'Korrelation innebär inte orsakssamband. Två variabler kan samvariera av slump, genom gemensam orsak, eller omvänd kausalitet.',
  secondary: 'Denna analys visar statistiskt samband, inte orsak och verkan.',
  methodLink: 'Klicka för att se hur detta beräknades',
  spuriousWarning: 'Var försiktig med att dra slutsatser från korrelationer utan teoretisk grund.',
} as const;

/**
 * TRÖSKEL VÄRDEN
 */
export const CORRELATION_THRESHOLDS = {
  // Styrka
  none: 0.1,
  weak: 0.3,
  moderate: 0.5,
  strong: 0.7,
  veryStrong: 0.9,
  
  // Signifikans
  significanceLevel: 0.05,
  
  // Stabilitet
  minStability: 0.6,
  
  // Lag-analys
  maxLagMonths: 24,
  minOverlap: 12, // Minsta antal gemensamma datapunkter
} as const;

/**
 * Tolka korrelationskoefficient
 */
export function interpretCorrelation(coefficient: number): CorrelationInterpretation {
  const abs = Math.abs(coefficient);
  const direction = coefficient > 0 ? 'positive' : coefficient < 0 ? 'negative' : 'none';

  if (abs < CORRELATION_THRESHOLDS.none) {
    return {
      strength: 'none',
      direction: 'none',
      label: 'Inget samband',
      description: 'Det finns inget statistiskt signifikant samband mellan dessa variabler.',
    };
  }

  if (abs < CORRELATION_THRESHOLDS.weak) {
    return {
      strength: 'weak',
      direction,
      label: 'Svagt samband',
      description: `Ett ${direction === 'positive' ? 'positivt' : 'negativt'} men svagt samband observeras.`,
    };
  }

  if (abs < CORRELATION_THRESHOLDS.moderate) {
    return {
      strength: 'moderate',
      direction,
      label: 'Måttligt samband',
      description: `Ett ${direction === 'positive' ? 'positivt' : 'negativt'} måttligt samband observeras.`,
    };
  }

  if (abs < CORRELATION_THRESHOLDS.strong) {
    return {
      strength: 'strong',
      direction,
      label: 'Starkt samband',
      description: `Ett ${direction === 'positive' ? 'positivt' : 'negativt'} starkt samband observeras.`,
    };
  }

  return {
    strength: 'very_strong',
    direction,
    label: 'Mycket starkt samband',
    description: `Ett ${direction === 'positive' ? 'positivt' : 'negativt'} mycket starkt samband observeras.`,
  };
}

/**
 * Beräkna Pearson-korrelation
 */
export function calculatePearson(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n < 2) return NaN;

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? 0 : numerator / denom;
}

/**
 * Beräkna Spearman-korrelation (rangordning)
 */
export function calculateSpearman(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n < 2) return NaN;

  // Rangordna
  const rankX = getRanks(x);
  const rankY = getRanks(y);

  // Beräkna Pearson på rangerna
  return calculatePearson(rankX, rankY);
}

/**
 * Hjälpfunktion för rangordning
 */
function getRanks(arr: number[]): number[] {
  const sorted = [...arr].map((v, i) => ({ value: v, index: i }))
    .sort((a, b) => a.value - b.value);
  
  const ranks = new Array(arr.length);
  for (let i = 0; i < sorted.length; i++) {
    ranks[sorted[i].index] = i + 1;
  }
  return ranks;
}

/**
 * Beräkna konfidensintervall med Fisher-transformation
 */
export function calculateConfidenceInterval(
  r: number, 
  n: number, 
  confidenceLevel: number = 0.95
): { lower: number; upper: number } {
  if (n < 4) return { lower: -1, upper: 1 };

  // Fisher z-transformation
  const z = 0.5 * Math.log((1 + r) / (1 - r));
  const se = 1 / Math.sqrt(n - 3);
  
  // Z-score för konfidensintervall
  const zAlpha = confidenceLevel === 0.95 ? 1.96 : 2.576;
  
  const zLower = z - zAlpha * se;
  const zUpper = z + zAlpha * se;
  
  // Tillbaka-transformera
  const lower = (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1);
  const upper = (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1);
  
  return { lower, upper };
}

/**
 * Beräkna korrelationsstabilitet över fönster
 */
export function calculateStability(
  x: number[], 
  y: number[], 
  windowSize: number = 12
): number {
  if (x.length < windowSize * 2) return 0;

  const correlations: number[] = [];
  
  for (let i = 0; i <= x.length - windowSize; i += 3) {
    const windowX = x.slice(i, i + windowSize);
    const windowY = y.slice(i, i + windowSize);
    correlations.push(calculatePearson(windowX, windowY));
  }

  if (correlations.length < 2) return 1;

  // Beräkna standardavvikelse av korrelationerna
  const mean = correlations.reduce((a, b) => a + b, 0) / correlations.length;
  const variance = correlations.reduce((a, b) => a + (b - mean) ** 2, 0) / correlations.length;
  const stdDev = Math.sqrt(variance);

  // Stabilitet = 1 - normaliserad standardavvikelse
  return Math.max(0, 1 - stdDev * 2);
}

/**
 * Hitta optimal lag (tidsförskjutning)
 */
export function findOptimalLag(
  x: number[], 
  y: number[], 
  maxLag: number = CORRELATION_THRESHOLDS.maxLagMonths
): { lag: number; correlation: number } {
  let bestLag = 0;
  let bestCorr = calculatePearson(x, y);

  for (let lag = 1; lag <= maxLag; lag++) {
    // Positiv lag: y lagar x
    if (x.length > lag) {
      const xTrimmed = x.slice(lag);
      const yTrimmed = y.slice(0, -lag);
      const corr = calculatePearson(xTrimmed, yTrimmed);
      if (Math.abs(corr) > Math.abs(bestCorr)) {
        bestCorr = corr;
        bestLag = lag;
      }
    }

    // Negativ lag: x lagar y
    if (y.length > lag) {
      const xTrimmed = x.slice(0, -lag);
      const yTrimmed = y.slice(lag);
      const corr = calculatePearson(xTrimmed, yTrimmed);
      if (Math.abs(corr) > Math.abs(bestCorr)) {
        bestCorr = corr;
        bestLag = -lag;
      }
    }
  }

  return { lag: bestLag, correlation: bestCorr };
}

/**
 * Generera varningar för korrelationsresultat
 */
export function generateWarnings(result: Partial<CorrelationResult>): string[] {
  const warnings: string[] = [];

  if (result.sampleSize && result.sampleSize < 30) {
    warnings.push('Litet urval – tolka med försiktighet');
  }

  if (result.stability && result.stability < CORRELATION_THRESHOLDS.minStability) {
    warnings.push('Sambandet är instabilt över tid');
  }

  if (result.pValue && result.pValue > CORRELATION_THRESHOLDS.significanceLevel) {
    warnings.push('Sambandet är inte statistiskt signifikant');
  }

  if (result.lag && Math.abs(result.lag) > 12) {
    warnings.push('Lång tidsförskjutning – osäkrare resultat');
  }

  if (result.confidenceInterval) {
    const range = result.confidenceInterval.upper - result.confidenceInterval.lower;
    if (range > 0.5) {
      warnings.push('Brett konfidensintervall – stor osäkerhet');
    }
  }

  return warnings;
}

/**
 * KOMPLETT KORRELATIONSANALYS
 */
export function analyzeCorrelation(
  input: CorrelationInput,
  method: CorrelationMethod = 'pearson'
): CorrelationResult {
  const { kpiId1, kpiId2, values1, values2 } = input;

  // Hitta optimal lag
  const { lag, correlation: lagCorrelation } = findOptimalLag(values1, values2);

  // Applicera lag
  let v1 = values1;
  let v2 = values2;
  if (lag > 0) {
    v1 = values1.slice(lag);
    v2 = values2.slice(0, -lag);
  } else if (lag < 0) {
    v1 = values1.slice(0, lag);
    v2 = values2.slice(-lag);
  }

  // Beräkna korrelation
  const coefficient = method === 'pearson' 
    ? calculatePearson(v1, v2)
    : calculateSpearman(v1, v2);

  // Beräkna konfidensintervall
  const confidenceInterval = calculateConfidenceInterval(coefficient, v1.length);

  // Beräkna stabilitet
  const stability = calculateStability(v1, v2);

  // Tolka resultat
  const interpretation = interpretCorrelation(coefficient);

  // Ungefärlig p-värde (förenklad)
  const t = coefficient * Math.sqrt((v1.length - 2) / (1 - coefficient ** 2));
  const pValue = Math.min(1, 2 * Math.exp(-0.717 * Math.abs(t)));

  const result: CorrelationResult = {
    kpiId1,
    kpiId2,
    method,
    coefficient,
    pValue,
    lag,
    sampleSize: v1.length,
    confidenceInterval,
    stability,
    interpretation,
    warnings: [],
  };

  result.warnings = generateWarnings(result);

  return result;
}

/**
 * UI-KONFIGURATION
 */
export const CORRELATION_UI_CONFIG = {
  // Färger för styrka
  strengthColors: {
    none: 'text-muted-foreground',
    weak: 'text-chart-4',
    moderate: 'text-chart-3',
    strong: 'text-chart-2',
    very_strong: 'text-chart-1',
  },
  
  // Alltid visa disclaimer
  alwaysShowDisclaimer: true,
  
  // Metod-val
  defaultMethod: 'pearson' as CorrelationMethod,
  allowMethodChange: true,
  
  // Lag-analys
  showLagAnalysis: true,
  showStability: true,
} as const;
