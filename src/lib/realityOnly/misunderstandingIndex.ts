/**
 * 🔒 Misunderstanding Index
 * 
 * "Var är världen oftast missförstådd?"
 * 
 * Live index baserat på verifierad data om perception vs verklighet.
 */

import type {
  MisunderstandingEntry,
  MisunderstandingIndex,
  DataAvailability,
} from '@/types/realityOnly';
import { generateVerificationProof, shouldBlockContent } from './dataValidator';

// ============================================
// PERCEPTION DATA STRUCTURE
// ============================================

interface PerceptionDataPoint {
  indicatorId: string;
  questionId: string;
  userGuess: number;
  actualValue: number;
  answeredAt: string;
  userRegion?: string;
  userAge?: string;
  userEducation?: string;
}

interface IndicatorInfo {
  id: string;
  name: { en: string; sv: string };
  category: string;
  unit: string;
}

// ============================================
// MISUNDERSTANDING CALCULATION
// ============================================

/**
 * Calculate misunderstanding entry for a single indicator
 */
export function calculateMisunderstanding(
  indicator: IndicatorInfo,
  perceptionData: PerceptionDataPoint[],
  currentActualValue: number,
  sources: Array<{ id: string; name: string; url: string; reliability: number; lastUpdated: string }>
): MisunderstandingEntry | null {
  // Need minimum sample size
  if (perceptionData.length < 30) {
    return null; // Insufficient data
  }
  
  // Calculate average perception
  const guesses = perceptionData.map(p => p.userGuess);
  const avgPerception = guesses.reduce((a, b) => a + b, 0) / guesses.length;
  
  // Calculate gap
  const gapPercent = ((avgPerception - currentActualValue) / currentActualValue) * 100;
  const gapDirection: 'overestimate' | 'underestimate' = gapPercent > 0 ? 'overestimate' : 'underestimate';
  
  // Calculate confidence (based on sample size and consistency)
  const stdDev = Math.sqrt(
    guesses.reduce((sum, g) => sum + Math.pow(g - avgPerception, 2), 0) / guesses.length
  );
  const cv = stdDev / Math.abs(avgPerception); // Coefficient of variation
  const confidence = Math.max(0, Math.min(100, 100 - cv * 50));
  
  // Calculate demographic breakdowns
  const gapByDemographic: Record<string, number> = {};
  
  // By region
  const byRegion = perceptionData.filter(p => p.userRegion);
  const regionGroups = new Set(byRegion.map(p => p.userRegion));
  regionGroups.forEach(region => {
    if (!region) return;
    const regionGuesses = byRegion.filter(p => p.userRegion === region).map(p => p.userGuess);
    const regionAvg = regionGuesses.reduce((a, b) => a + b, 0) / regionGuesses.length;
    gapByDemographic[`region:${region}`] = ((regionAvg - currentActualValue) / currentActualValue) * 100;
  });
  
  // Generate possible reasons (algorithmic, not speculative)
  const possibleReasons = generatePossibleReasons(indicator.category, gapDirection, Math.abs(gapPercent));
  
  // Generate verification
  const verification = generateVerificationProof({
    entityId: `misunderstanding_${indicator.id}`,
    sources: sources.map(s => ({ ...s, dataPoints: 1, coverage: 100 })),
    aggregationLogic: `Mean perception calculated from ${perceptionData.length} responses, compared to verified actual value.`,
  });
  
  return {
    indicatorId: indicator.id,
    indicatorName: indicator.name.en,
    indicatorNameLocal: indicator.name,
    category: indicator.category,
    averagePerception: Math.round(avgPerception * 10) / 10,
    actualValue: currentActualValue,
    gapPercent: Math.round(gapPercent * 10) / 10,
    gapDirection,
    sampleSize: perceptionData.length,
    confidence: Math.round(confidence),
    gapByDemographic: Object.keys(gapByDemographic).length > 0 ? gapByDemographic : undefined,
    possibleReasons,
    dataAvailability: 'verified',
    verification,
  };
}

/**
 * Generate possible reasons (pattern-based, not speculative)
 */
function generatePossibleReasons(
  category: string,
  direction: 'overestimate' | 'underestimate',
  magnitude: number
): string[] {
  const reasons: string[] = [];
  
  // Large gaps
  if (magnitude > 50) {
    reasons.push('Significant media attention may create skewed perception.');
    reasons.push('Historical trends may not reflect recent changes.');
  }
  
  // Direction-specific
  if (direction === 'overestimate') {
    reasons.push('Negative events often receive more media coverage than positive trends.');
  } else {
    reasons.push('Gradual improvements may go unnoticed in news coverage.');
  }
  
  // Category-specific
  if (category === 'health') {
    reasons.push('Health metrics often improve faster than public awareness.');
  } else if (category === 'economy') {
    reasons.push('Economic perceptions are often influenced by recent events rather than long-term data.');
  } else if (category === 'environment') {
    reasons.push('Environmental changes may be difficult to perceive directly.');
  }
  
  return reasons.slice(0, 3);
}

// ============================================
// INDEX BUILDING
// ============================================

interface IndexInput {
  indicators: IndicatorInfo[];
  perceptionData: Record<string, PerceptionDataPoint[]>;
  actualValues: Record<string, number>;
  sources: Record<string, Array<{ id: string; name: string; url: string; reliability: number; lastUpdated: string }>>;
  period: { start: string; end: string };
}

/**
 * Build the full Misunderstanding Index
 */
export function buildMisunderstandingIndex(input: IndexInput): MisunderstandingIndex | null {
  const { indicators, perceptionData, actualValues, sources, period } = input;
  
  const entries: MisunderstandingEntry[] = [];
  
  for (const indicator of indicators) {
    const data = perceptionData[indicator.id];
    const actual = actualValues[indicator.id];
    const indicatorSources = sources[indicator.id] || [];
    
    if (!data || actual === undefined) continue;
    
    const entry = calculateMisunderstanding(indicator, data, actual, indicatorSources);
    if (entry) {
      entries.push(entry);
    }
  }
  
  if (entries.length === 0) {
    return null; // No sufficient data for any indicator
  }
  
  // Sort by gap magnitude
  const sorted = [...entries].sort((a, b) => Math.abs(b.gapPercent) - Math.abs(a.gapPercent));
  
  // Split by direction
  const overestimated = sorted.filter(e => e.gapDirection === 'overestimate');
  const underestimated = sorted.filter(e => e.gapDirection === 'underestimate');
  
  // Calculate overall bias
  const avgGap = entries.reduce((sum, e) => sum + e.gapPercent, 0) / entries.length;
  const overallBias: 'pessimistic' | 'optimistic' | 'neutral' = 
    avgGap > 5 ? 'pessimistic' : avgGap < -5 ? 'optimistic' : 'neutral';
  
  // Master verification
  const verification = generateVerificationProof({
    entityId: `misunderstanding_index_${period.start}_${period.end}`,
    sources: Object.values(sources).flat().slice(0, 10).map(s => ({ ...s, dataPoints: 1, coverage: 100 })),
    aggregationLogic: `Aggregated perception gaps from ${entries.length} indicators with minimum 30 responses each.`,
  });
  
  return {
    calculatedAt: new Date().toISOString(),
    period,
    mostOverestimated: overestimated.slice(0, 10),
    mostUnderestimated: underestimated.slice(0, 10),
    overallBias,
    biasStrength: Math.abs(avgGap),
    verification,
  };
}

// ============================================
// LIVE INDEX UPDATES
// ============================================

/**
 * Check if index needs recalculation
 */
export function shouldRecalculateIndex(
  lastCalculated: string,
  minResponses: number = 100
): boolean {
  const hoursSinceCalc = (Date.now() - new Date(lastCalculated).getTime()) / (1000 * 60 * 60);
  return hoursSinceCalc > 24; // Recalculate daily
}

/**
 * Get top misunderstandings for display
 */
export function getTopMisunderstandings(
  index: MisunderstandingIndex,
  count: number = 5
): MisunderstandingEntry[] {
  const all = [...index.mostOverestimated, ...index.mostUnderestimated];
  return all
    .sort((a, b) => Math.abs(b.gapPercent) - Math.abs(a.gapPercent))
    .slice(0, count);
}
