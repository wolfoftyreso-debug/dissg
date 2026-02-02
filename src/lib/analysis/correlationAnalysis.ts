// Correlation analysis utilities for KPI relationships

export interface CorrelationResult {
  kpiA: string;
  kpiB: string;
  coefficient: number; // Pearson correlation: -1 to 1
  pValue: number;
  sampleSize: number;
  strength: 'strong' | 'moderate' | 'weak' | 'none';
  direction: 'positive' | 'negative' | 'none';
  interpretation: string;
  timeLag?: number; // Months of lag for best correlation
}

export interface CorrelationMatrix {
  kpis: string[];
  matrix: number[][];
  results: CorrelationResult[];
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

/**
 * Calculate Pearson correlation coefficient between two time series
 */
export function calculatePearsonCorrelation(
  seriesA: TimeSeriesPoint[],
  seriesB: TimeSeriesPoint[]
): { coefficient: number; pValue: number; sampleSize: number } {
  // Align series by date
  const dateMap = new Map<string, { a?: number; b?: number }>();
  
  seriesA.forEach(point => {
    dateMap.set(point.date, { ...dateMap.get(point.date), a: point.value });
  });
  
  seriesB.forEach(point => {
    const existing = dateMap.get(point.date);
    if (existing) {
      existing.b = point.value;
    }
  });
  
  // Get paired values
  const paired: { a: number; b: number }[] = [];
  dateMap.forEach(values => {
    if (values.a !== undefined && values.b !== undefined) {
      paired.push({ a: values.a, b: values.b });
    }
  });
  
  if (paired.length < 3) {
    return { coefficient: 0, pValue: 1, sampleSize: paired.length };
  }
  
  const n = paired.length;
  const sumA = paired.reduce((sum, p) => sum + p.a, 0);
  const sumB = paired.reduce((sum, p) => sum + p.b, 0);
  const sumAB = paired.reduce((sum, p) => sum + p.a * p.b, 0);
  const sumA2 = paired.reduce((sum, p) => sum + p.a * p.a, 0);
  const sumB2 = paired.reduce((sum, p) => sum + p.b * p.b, 0);
  
  const numerator = n * sumAB - sumA * sumB;
  const denominator = Math.sqrt(
    (n * sumA2 - sumA * sumA) * (n * sumB2 - sumB * sumB)
  );
  
  if (denominator === 0) {
    return { coefficient: 0, pValue: 1, sampleSize: n };
  }
  
  const r = numerator / denominator;
  
  // Calculate approximate p-value using t-distribution approximation
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const pValue = approximatePValue(t, n - 2);
  
  return { coefficient: r, pValue, sampleSize: n };
}

/**
 * Approximate p-value from t-statistic (simplified)
 */
function approximatePValue(t: number, _df: number): number {
  const absT = Math.abs(t);
  // Simplified approximation
  if (absT > 3.5) return 0.001;
  if (absT > 2.5) return 0.01;
  if (absT > 2.0) return 0.05;
  if (absT > 1.5) return 0.1;
  return 0.5;
}

/**
 * Interpret correlation strength
 */
export function interpretCorrelation(coefficient: number): {
  strength: 'strong' | 'moderate' | 'weak' | 'none';
  direction: 'positive' | 'negative' | 'none';
  interpretation: string;
} {
  const abs = Math.abs(coefficient);
  
  let strength: 'strong' | 'moderate' | 'weak' | 'none';
  if (abs >= 0.7) strength = 'strong';
  else if (abs >= 0.4) strength = 'moderate';
  else if (abs >= 0.2) strength = 'weak';
  else strength = 'none';
  
  let direction: 'positive' | 'negative' | 'none';
  if (coefficient > 0.1) direction = 'positive';
  else if (coefficient < -0.1) direction = 'negative';
  else direction = 'none';
  
  const strengthText = {
    strong: 'starkt',
    moderate: 'måttligt',
    weak: 'svagt',
    none: 'inget'
  }[strength];
  
  const directionText = {
    positive: 'positivt',
    negative: 'negativt',
    none: 'inget'
  }[direction];
  
  let interpretation: string;
  if (strength === 'none') {
    interpretation = 'Inget observerat linjärt samband';
  } else {
    interpretation = `${strengthText.charAt(0).toUpperCase() + strengthText.slice(1)} ${directionText} samband (r=${coefficient.toFixed(2)})`;
  }
  
  return { strength, direction, interpretation };
}

/**
 * Calculate correlation with time lag to find leading/lagging relationships
 */
export function calculateLaggedCorrelation(
  seriesA: TimeSeriesPoint[],
  seriesB: TimeSeriesPoint[],
  maxLagMonths: number = 12
): { bestLag: number; coefficient: number; results: { lag: number; coefficient: number }[] } {
  const results: { lag: number; coefficient: number }[] = [];
  
  for (let lag = -maxLagMonths; lag <= maxLagMonths; lag++) {
    // Shift series B by lag months
    const shiftedB = seriesB.map(point => {
      const date = new Date(point.date);
      date.setMonth(date.getMonth() + lag);
      return { date: date.toISOString().slice(0, 10), value: point.value };
    });
    
    const { coefficient } = calculatePearsonCorrelation(seriesA, shiftedB);
    results.push({ lag, coefficient });
  }
  
  // Find best correlation (highest absolute value)
  const best = results.reduce((best, current) => 
    Math.abs(current.coefficient) > Math.abs(best.coefficient) ? current : best
  );
  
  return { bestLag: best.lag, coefficient: best.coefficient, results };
}

/**
 * Build full correlation matrix for multiple KPIs
 */
export function buildCorrelationMatrix(
  kpiData: Map<string, TimeSeriesPoint[]>
): CorrelationMatrix {
  const kpis = Array.from(kpiData.keys());
  const n = kpis.length;
  const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  const results: CorrelationResult[] = [];
  
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1; // Self-correlation is always 1
    
    for (let j = i + 1; j < n; j++) {
      const seriesA = kpiData.get(kpis[i]) || [];
      const seriesB = kpiData.get(kpis[j]) || [];
      
      const { coefficient, pValue, sampleSize } = calculatePearsonCorrelation(seriesA, seriesB);
      const { strength, direction, interpretation } = interpretCorrelation(coefficient);
      
      matrix[i][j] = coefficient;
      matrix[j][i] = coefficient; // Symmetric
      
      results.push({
        kpiA: kpis[i],
        kpiB: kpis[j],
        coefficient,
        pValue,
        sampleSize,
        strength,
        direction,
        interpretation
      });
    }
  }
  
  return { kpis, matrix, results };
}

/**
 * Get correlation color based on coefficient
 */
export function getCorrelationColor(coefficient: number): string {
  if (coefficient >= 0.7) return 'hsl(var(--chart-2))'; // Strong positive - green
  if (coefficient >= 0.4) return 'hsl(var(--chart-2) / 0.7)';
  if (coefficient >= 0.2) return 'hsl(var(--chart-2) / 0.4)';
  if (coefficient <= -0.7) return 'hsl(var(--destructive))'; // Strong negative - red
  if (coefficient <= -0.4) return 'hsl(var(--destructive) / 0.7)';
  if (coefficient <= -0.2) return 'hsl(var(--destructive) / 0.4)';
  return 'hsl(var(--muted))'; // No correlation
}
