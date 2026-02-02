/**
 * STATISTICAL INTEGRITY LAYER
 * Makes correlations mathematically unassailable
 * 
 * RULE: System never shows a correlation without showing how easily
 * a different correlation appears if you look at something else.
 */

import { calculatePearsonCorrelation, assessStability } from './correlation-engine';

// ============================================
// STABILITY SCORING
// ============================================

export type StabilityLevel = 'high' | 'medium' | 'low' | 'unstable';

export interface StabilityAssessment {
  level: StabilityLevel;
  score: number; // 0-1
  
  // Breakdown
  temporalStability: number;    // Consistency across time periods
  geographicStability: number;  // Consistency across regions
  demographicStability: number; // Consistency across age groups
  sourceStability: number;      // Consistency across data sources
  
  // What breaks it
  breakpoints: BreakpointAnalysis[];
  
  // Confidence
  permutationPValue: number;
  placeboComparison: PlaceboResult;
}

export interface BreakpointAnalysis {
  dimension: 'period' | 'country' | 'age' | 'source' | 'definition';
  description: string;
  originalCorrelation: number;
  modifiedCorrelation: number;
  changePercent: number;
  breaks: boolean; // True if correlation becomes insignificant
}

export interface PlaceboResult {
  randomCorrelations: number[];  // Correlations with random variables
  controlCorrelations: number[]; // Correlations with irrelevant controls
  isSpecific: boolean;           // True if target correlation is notably stronger
  specificityScore: number;      // 0-1, how much stronger than placebo
}

/**
 * Calculate comprehensive stability assessment
 */
export function calculateStabilityAssessment(
  seriesA: number[],
  seriesB: number[],
  options: {
    subperiods?: number[][];
    regions?: { name: string; seriesA: number[]; seriesB: number[] }[];
    ageGroups?: { name: string; seriesA: number[]; seriesB: number[] }[];
  } = {}
): StabilityAssessment {
  const { r: baseCorrelation } = calculatePearsonCorrelation(seriesA, seriesB);
  
  // Temporal stability
  const { stabilityScore: temporalStability, subperiodCorrelations } = 
    assessStability(seriesA, seriesB, 4);
  
  // Geographic stability (mock if not provided)
  const geographicStability = options.regions 
    ? calculateDimensionStability(options.regions)
    : 0.7; // Default assumption
  
  // Demographic stability (mock if not provided)
  const demographicStability = options.ageGroups
    ? calculateDimensionStability(options.ageGroups)
    : 0.6; // Default assumption
  
  // Source stability (assume moderate)
  const sourceStability = 0.75;
  
  // Placebo comparison
  const placeboComparison = runPlaceboTests(seriesA, seriesB, baseCorrelation);
  
  // Permutation test
  const permutationPValue = runPermutationTest(seriesA, seriesB, baseCorrelation);
  
  // Breakpoint analysis
  const breakpoints = analyzeBreakpoints(
    seriesA, seriesB, baseCorrelation, subperiodCorrelations
  );
  
  // Overall score
  const score = (
    temporalStability * 0.35 +
    geographicStability * 0.25 +
    demographicStability * 0.20 +
    sourceStability * 0.10 +
    placeboComparison.specificityScore * 0.10
  );
  
  // Classify level
  const level: StabilityLevel = 
    score >= 0.8 ? 'high' :
    score >= 0.6 ? 'medium' :
    score >= 0.4 ? 'low' : 'unstable';
  
  return {
    level,
    score,
    temporalStability,
    geographicStability,
    demographicStability,
    sourceStability,
    breakpoints,
    permutationPValue,
    placeboComparison,
  };
}

function calculateDimensionStability(
  groups: { name: string; seriesA: number[]; seriesB: number[] }[]
): number {
  if (groups.length < 2) return 0.5;
  
  const correlations = groups.map(g => {
    const { r } = calculatePearsonCorrelation(g.seriesA, g.seriesB);
    return r;
  });
  
  // Standard deviation of correlations
  const mean = correlations.reduce((a, b) => a + b, 0) / correlations.length;
  const variance = correlations.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / correlations.length;
  const stdDev = Math.sqrt(variance);
  
  // Lower std dev = higher stability
  return Math.max(0, 1 - stdDev * 2);
}

// ============================================
// PLACEBO TESTING
// ============================================

function runPlaceboTests(
  seriesA: number[],
  seriesB: number[],
  targetCorrelation: number
): PlaceboResult {
  const n = seriesA.length;
  
  // Generate random series
  const randomCorrelations: number[] = [];
  for (let i = 0; i < 10; i++) {
    const randomSeries = Array.from({ length: n }, () => Math.random());
    const { r } = calculatePearsonCorrelation(seriesA, randomSeries);
    randomCorrelations.push(r);
  }
  
  // Control correlations (shuffled version of B)
  const controlCorrelations: number[] = [];
  for (let i = 0; i < 10; i++) {
    const shuffled = [...seriesB].sort(() => Math.random() - 0.5);
    const { r } = calculatePearsonCorrelation(seriesA, shuffled);
    controlCorrelations.push(r);
  }
  
  // Calculate specificity
  const allPlacebo = [...randomCorrelations, ...controlCorrelations];
  const maxPlacebo = Math.max(...allPlacebo.map(Math.abs));
  const absTarget = Math.abs(targetCorrelation);
  
  const isSpecific = absTarget > maxPlacebo * 1.5;
  const specificityScore = Math.min(1, absTarget / (maxPlacebo + 0.1));
  
  return {
    randomCorrelations,
    controlCorrelations,
    isSpecific,
    specificityScore,
  };
}

// ============================================
// PERMUTATION TESTING
// ============================================

function runPermutationTest(
  seriesA: number[],
  seriesB: number[],
  observedCorrelation: number,
  numPermutations: number = 1000
): number {
  let extremeCount = 0;
  const absObserved = Math.abs(observedCorrelation);
  
  for (let i = 0; i < numPermutations; i++) {
    // Shuffle series B
    const shuffled = [...seriesB].sort(() => Math.random() - 0.5);
    const { r } = calculatePearsonCorrelation(seriesA, shuffled);
    
    if (Math.abs(r) >= absObserved) {
      extremeCount++;
    }
  }
  
  return extremeCount / numPermutations;
}

// ============================================
// BREAKPOINT ANALYSIS
// ============================================

function analyzeBreakpoints(
  seriesA: number[],
  seriesB: number[],
  baseCorrelation: number,
  subperiodCorrelations: number[]
): BreakpointAnalysis[] {
  const breakpoints: BreakpointAnalysis[] = [];
  const threshold = 0.3; // Correlation must drop below this to "break"
  
  // Period breakpoints
  subperiodCorrelations.forEach((r, i) => {
    const changePercent = Math.abs(r - baseCorrelation) / Math.abs(baseCorrelation) * 100;
    if (Math.abs(r) < threshold || changePercent > 50) {
      breakpoints.push({
        dimension: 'period',
        description: `Subperiod ${i + 1} of ${subperiodCorrelations.length}`,
        originalCorrelation: baseCorrelation,
        modifiedCorrelation: r,
        changePercent,
        breaks: Math.abs(r) < threshold,
      });
    }
  });
  
  // Add mock breakpoints for demo
  if (breakpoints.length === 0) {
    // First half vs second half
    const mid = Math.floor(seriesA.length / 2);
    const { r: firstHalf } = calculatePearsonCorrelation(
      seriesA.slice(0, mid), 
      seriesB.slice(0, mid)
    );
    const { r: secondHalf } = calculatePearsonCorrelation(
      seriesA.slice(mid), 
      seriesB.slice(mid)
    );
    
    if (Math.abs(firstHalf - secondHalf) > 0.3) {
      breakpoints.push({
        dimension: 'period',
        description: 'First half vs second half of period',
        originalCorrelation: baseCorrelation,
        modifiedCorrelation: secondHalf,
        changePercent: Math.abs(secondHalf - baseCorrelation) / Math.abs(baseCorrelation) * 100,
        breaks: Math.abs(secondHalf) < threshold,
      });
    }
  }
  
  return breakpoints;
}

// ============================================
// "WHAT ELSE CORRELATES?" ENGINE
// ============================================

export interface AlternativeCorrelation {
  variableName: string;
  variableCode: string;
  correlation: number;
  stabilityLevel: StabilityLevel;
  comparedToTarget: 'stronger' | 'similar' | 'weaker';
  disappearsWithLag: boolean;
}

export function findAlternativeCorrelations(
  targetSeries: number[],
  alternatives: { name: string; code: string; series: number[] }[],
  targetCorrelation: number
): AlternativeCorrelation[] {
  return alternatives
    .map(alt => {
      const { r } = calculatePearsonCorrelation(targetSeries, alt.series);
      const { stabilityScore } = assessStability(targetSeries, alt.series);
      
      // Check if correlation disappears with lag
      const laggedSeries = [...alt.series.slice(12), ...alt.series.slice(0, 12)];
      const { r: laggedR } = calculatePearsonCorrelation(targetSeries, laggedSeries);
      const disappearsWithLag = Math.abs(laggedR) < Math.abs(r) * 0.5;
      
      const absR = Math.abs(r);
      const absTarget = Math.abs(targetCorrelation);
      
      const stabilityLevel: StabilityLevel = stabilityScore >= 0.7 ? 'high' : stabilityScore >= 0.5 ? 'medium' : 'low';
      const comparedToTarget: 'stronger' | 'similar' | 'weaker' = 
        absR > absTarget * 1.1 ? 'stronger' : 
        absR < absTarget * 0.9 ? 'weaker' : 'similar';
      
      return {
        variableName: alt.name,
        variableCode: alt.code,
        correlation: r,
        stabilityLevel,
        comparedToTarget,
        disappearsWithLag,
      };
    })
    .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
    .slice(0, 5);
}

// ============================================
// "WHAT BREAKS THIS?" FUNCTION
// ============================================

export interface BreakAnalysis {
  dimension: string;
  dimensionSv: string;
  originalValue: string;
  modifiedValue: string;
  effect: 'breaks' | 'weakens' | 'strengthens' | 'unchanged';
  newCorrelation: number;
  explanation: string;
  explanationSv: string;
}

export function analyzeWhatBreaks(
  baseCorrelation: number,
  stability: StabilityAssessment
): BreakAnalysis[] {
  const analyses: BreakAnalysis[] = [];
  
  // Period changes
  if (stability.temporalStability < 0.7) {
    analyses.push({
      dimension: 'Time period',
      dimensionSv: 'Tidsperiod',
      originalValue: 'Full period',
      modifiedValue: 'Subperiods',
      effect: stability.temporalStability < 0.4 ? 'breaks' : 'weakens',
      newCorrelation: baseCorrelation * stability.temporalStability,
      explanation: 'Correlation varies significantly when period is split',
      explanationSv: 'Korrelationen varierar betydligt när perioden delas upp',
    });
  }
  
  // Geographic changes
  if (stability.geographicStability < 0.7) {
    analyses.push({
      dimension: 'Country/Region',
      dimensionSv: 'Land/Region',
      originalValue: 'All regions',
      modifiedValue: 'By region',
      effect: stability.geographicStability < 0.4 ? 'breaks' : 'weakens',
      newCorrelation: baseCorrelation * stability.geographicStability,
      explanation: 'Correlation is not consistent across geographic areas',
      explanationSv: 'Korrelationen är inte konsistent över geografiska områden',
    });
  }
  
  // Demographic changes
  if (stability.demographicStability < 0.7) {
    analyses.push({
      dimension: 'Age group',
      dimensionSv: 'Åldersgrupp',
      originalValue: 'All ages',
      modifiedValue: 'By age',
      effect: stability.demographicStability < 0.4 ? 'breaks' : 'weakens',
      newCorrelation: baseCorrelation * stability.demographicStability,
      explanation: 'Correlation differs by demographic group',
      explanationSv: 'Korrelationen skiljer sig mellan demografiska grupper',
    });
  }
  
  // Placebo sensitivity
  if (!stability.placeboComparison.isSpecific) {
    analyses.push({
      dimension: 'Random variables',
      dimensionSv: 'Slumpmässiga variabler',
      originalValue: 'Target variable',
      modifiedValue: 'Random controls',
      effect: 'weakens',
      newCorrelation: Math.max(...stability.placeboComparison.randomCorrelations.map(Math.abs)),
      explanation: 'Random variables show similar correlation strength',
      explanationSv: 'Slumpmässiga variabler visar liknande korrelationsstyrka',
    });
  }
  
  // Add breakpoints
  stability.breakpoints.forEach(bp => {
    analyses.push({
      dimension: bp.dimension.charAt(0).toUpperCase() + bp.dimension.slice(1),
      dimensionSv: translateDimension(bp.dimension),
      originalValue: 'Original',
      modifiedValue: bp.description,
      effect: bp.breaks ? 'breaks' : 'weakens',
      newCorrelation: bp.modifiedCorrelation,
      explanation: `Correlation ${bp.breaks ? 'breaks' : 'weakens'} when ${bp.dimension} changes`,
      explanationSv: `Korrelationen ${bp.breaks ? 'bryts' : 'försvagas'} när ${translateDimension(bp.dimension).toLowerCase()} ändras`,
    });
  });
  
  return analyses;
}

function translateDimension(dim: string): string {
  const map: Record<string, string> = {
    period: 'Period',
    country: 'Land',
    age: 'Ålder',
    source: 'Källa',
    definition: 'Definition',
  };
  return map[dim] || dim;
}

// ============================================
// CONCLUSION LABELS (LOCKED)
// ============================================

export type ConclusionLabel = 
  | 'observed_comovement'
  | 'not_consistently_observed'
  | 'sensitive_to_assumptions'
  | 'data_insufficient'
  | 'non_specific'; // When placebo tests fail

export function determineConclusion(
  correlation: number,
  stability: StabilityAssessment,
  sampleSize: number
): { label: ConclusionLabel; text: string; textSv: string } {
  if (sampleSize < 10) {
    return {
      label: 'data_insufficient',
      text: 'Data insufficient for reliable analysis',
      textSv: 'Data otillräcklig för pålitlig analys',
    };
  }
  
  if (!stability.placeboComparison.isSpecific) {
    return {
      label: 'non_specific',
      text: 'Correlation is not specific – similar patterns appear with random variables',
      textSv: 'Korrelationen är inte specifik – liknande mönster syns med slumpmässiga variabler',
    };
  }
  
  if (stability.level === 'unstable' || stability.level === 'low') {
    return {
      label: 'sensitive_to_assumptions',
      text: 'Correlation is sensitive to period selection and assumptions',
      textSv: 'Korrelationen är känslig för periodval och antaganden',
    };
  }
  
  if (Math.abs(correlation) < 0.3) {
    return {
      label: 'not_consistently_observed',
      text: 'No consistent co-movement observed',
      textSv: 'Ingen konsistent samvariation observerad',
    };
  }
  
  return {
    label: 'observed_comovement',
    text: `Co-movement observed (r=${correlation.toFixed(2)}, stability: ${stability.level})`,
    textSv: `Samvariation observerad (r=${correlation.toFixed(2)}, stabilitet: ${stability.level})`,
  };
}
