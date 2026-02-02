/**
 * WRAPPED WORTHINESS ENGINE
 * =========================
 * Determines what data is worth including in a Wrapped presentation
 * 
 * PRINCIPLES:
 * - Only verified, live data
 * - Relevance over recency
 * - Signal over noise
 * - Context over raw values
 * 
 * SCORING MODEL:
 * - Relevance (CRM level): 0-40 points
 * - Change magnitude: 0-25 points
 * - Change velocity: 0-15 points
 * - Data quality: 0-10 points
 * - Cross-domain impact: 0-10 points
 * 
 * THRESHOLD: Score >= 50 = wrap-worthy
 */

import type { DataAvailability } from '@/types/realityOnly';

// ===========================================
// TYPES
// ===========================================

export type RelevanceLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export interface IndicatorSnapshot {
  id: string;
  code: string;
  name: string;
  category: string;
  
  // Current state
  currentValue: number;
  previousValue: number;
  unit: string;
  
  // Change metrics
  changePercent: number;
  changeAbsolute: number;
  periodStart: string;
  periodEnd: string;
  
  // Quality metrics
  confidence: number; // 0-1
  dataAvailability: DataAvailability;
  sourceCount: number;
  lastVerified: string;
  
  // Relevance classification
  relevanceLevel: RelevanceLevel;
  affectedPopulationPercent?: number;
  crossDomainLinks?: string[];
  
  // Trend analysis
  trendDirection: 'up' | 'down' | 'stable';
  trendAcceleration: number; // Rate of change of the rate of change
  isBreakingPattern: boolean;
  consecutiveDirectionMonths: number;
}

export interface WorthinessScore {
  indicatorId: string;
  totalScore: number;
  
  // Component scores
  relevanceScore: number;
  magnitudeScore: number;
  velocityScore: number;
  qualityScore: number;
  impactScore: number;
  
  // Decision
  isWrapWorthy: boolean;
  worthinessReason: string;
  
  // Ranking within wrap
  suggestedPriority: 'hero' | 'primary' | 'secondary' | 'mention';
  
  // Context for presentation
  narrativeHook: string;
  comparisonSuggestion?: string;
}

export interface WrapSelection {
  heroIndicators: WorthinessScore[];    // Max 1-2, shown with full animation
  primaryIndicators: WorthinessScore[]; // Max 3-5, main content
  secondaryIndicators: WorthinessScore[]; // Max 5-10, supporting
  mentionIndicators: WorthinessScore[];  // Remainder, brief list
  excludedIndicators: WorthinessScore[]; // Below threshold
  
  // Metadata
  totalEvaluated: number;
  totalIncluded: number;
  selectionTimestamp: string;
  periodCovered: string;
}

// ===========================================
// SCORING CONFIGURATION
// ===========================================

const RELEVANCE_WEIGHTS: Record<RelevanceLevel, number> = {
  L0: 0,   // Noise - never wrap
  L1: 10,  // Operational
  L2: 20,  // Tactical
  L3: 30,  // Strategic
  L4: 40,  // Civilizational
};

const WORTHINESS_THRESHOLD = 50;

const PRIORITY_THRESHOLDS = {
  hero: 85,
  primary: 70,
  secondary: 55,
  mention: 50,
};

// Change magnitude scoring (based on standard deviations from norm)
const MAGNITUDE_BREAKPOINTS = [
  { threshold: 50, score: 25 },  // Extreme change
  { threshold: 25, score: 20 },  // Major change
  { threshold: 10, score: 15 },  // Significant change
  { threshold: 5, score: 10 },   // Moderate change
  { threshold: 2, score: 5 },    // Minor change
  { threshold: 0, score: 0 },    // No change
];

// ===========================================
// CORE SCORING FUNCTIONS
// ===========================================

/**
 * Calculate relevance score based on CRM level
 */
function calculateRelevanceScore(indicator: IndicatorSnapshot): number {
  const baseScore = RELEVANCE_WEIGHTS[indicator.relevanceLevel];
  
  // Bonus for high population impact
  const populationBonus = indicator.affectedPopulationPercent 
    ? Math.min(5, indicator.affectedPopulationPercent / 20)
    : 0;
  
  return Math.min(40, baseScore + populationBonus);
}

/**
 * Calculate magnitude score based on change percentage
 */
function calculateMagnitudeScore(indicator: IndicatorSnapshot): number {
  const absChange = Math.abs(indicator.changePercent);
  
  for (const bp of MAGNITUDE_BREAKPOINTS) {
    if (absChange >= bp.threshold) {
      return bp.score;
    }
  }
  
  return 0;
}

/**
 * Calculate velocity score based on rate of change acceleration
 */
function calculateVelocityScore(indicator: IndicatorSnapshot): number {
  let score = 0;
  
  // Acceleration bonus (change is speeding up)
  if (Math.abs(indicator.trendAcceleration) > 0.5) {
    score += 5;
  }
  
  // Pattern break bonus (significant)
  if (indicator.isBreakingPattern) {
    score += 7;
  }
  
  // Consecutive direction bonus (sustained trend)
  if (indicator.consecutiveDirectionMonths >= 6) {
    score += 3;
  } else if (indicator.consecutiveDirectionMonths >= 3) {
    score += 1;
  }
  
  return Math.min(15, score);
}

/**
 * Calculate quality score based on data reliability
 */
function calculateQualityScore(indicator: IndicatorSnapshot): number {
  let score = 0;
  
  // Confidence level (0-1 → 0-5 points)
  score += indicator.confidence * 5;
  
  // Data availability
  if (indicator.dataAvailability === 'verified') {
    score += 3;
  } else if (indicator.dataAvailability === 'partial') {
    score += 1;
  }
  // No points for insufficient, stale, or conflicting
  
  // Multiple sources bonus
  if (indicator.sourceCount >= 3) {
    score += 2;
  } else if (indicator.sourceCount >= 2) {
    score += 1;
  }
  
  return Math.min(10, score);
}

/**
 * Calculate cross-domain impact score
 */
function calculateImpactScore(indicator: IndicatorSnapshot): number {
  const links = indicator.crossDomainLinks?.length ?? 0;
  
  // More cross-domain connections = higher impact
  if (links >= 5) return 10;
  if (links >= 3) return 7;
  if (links >= 2) return 4;
  if (links >= 1) return 2;
  
  return 0;
}

/**
 * Generate narrative hook for the indicator
 */
function generateNarrativeHook(indicator: IndicatorSnapshot, score: number): string {
  const direction = indicator.trendDirection === 'up' ? 'increased' : 
                   indicator.trendDirection === 'down' ? 'decreased' : 'remained stable';
  
  const magnitude = Math.abs(indicator.changePercent);
  
  if (indicator.isBreakingPattern) {
    return `${indicator.name} broke its historical pattern, ${direction} by ${magnitude.toFixed(1)}%`;
  }
  
  if (magnitude >= 25) {
    return `Significant shift: ${indicator.name} ${direction} by ${magnitude.toFixed(1)}%`;
  }
  
  if (indicator.consecutiveDirectionMonths >= 6) {
    return `${indicator.name} continued its ${indicator.consecutiveDirectionMonths}-month trend`;
  }
  
  if (score >= PRIORITY_THRESHOLDS.hero) {
    return `Key development: ${indicator.name} ${direction}`;
  }
  
  return `${indicator.name} ${direction} by ${magnitude.toFixed(1)}%`;
}

/**
 * Generate comparison suggestion
 */
function generateComparisonSuggestion(indicator: IndicatorSnapshot): string | undefined {
  if (indicator.relevanceLevel === 'L4' || indicator.relevanceLevel === 'L3') {
    return 'Compare with global/regional peers';
  }
  
  if (indicator.crossDomainLinks && indicator.crossDomainLinks.length > 0) {
    return `Correlates with: ${indicator.crossDomainLinks.slice(0, 2).join(', ')}`;
  }
  
  if (indicator.consecutiveDirectionMonths >= 12) {
    return 'Long-term trend - historical comparison recommended';
  }
  
  return undefined;
}

/**
 * Determine worthiness reason
 */
function determineWorthinessReason(
  indicator: IndicatorSnapshot,
  scores: Omit<WorthinessScore, 'indicatorId' | 'isWrapWorthy' | 'worthinessReason' | 'suggestedPriority' | 'narrativeHook' | 'comparisonSuggestion'>
): string {
  const reasons: string[] = [];
  
  if (scores.relevanceScore >= 30) {
    reasons.push(`High relevance (${indicator.relevanceLevel})`);
  }
  
  if (scores.magnitudeScore >= 15) {
    reasons.push(`Significant change (${indicator.changePercent.toFixed(1)}%)`);
  }
  
  if (indicator.isBreakingPattern) {
    reasons.push('Pattern break detected');
  }
  
  if (scores.velocityScore >= 10) {
    reasons.push('Accelerating trend');
  }
  
  if (scores.impactScore >= 7) {
    reasons.push('Cross-domain impact');
  }
  
  if (reasons.length === 0) {
    if (scores.totalScore >= WORTHINESS_THRESHOLD) {
      reasons.push('Cumulative significance');
    } else {
      reasons.push('Below significance threshold');
    }
  }
  
  return reasons.join('; ');
}

// ===========================================
// MAIN SCORING FUNCTION
// ===========================================

/**
 * Calculate worthiness score for a single indicator
 */
export function calculateWorthinessScore(indicator: IndicatorSnapshot): WorthinessScore {
  // L0 (Noise) indicators are automatically excluded
  if (indicator.relevanceLevel === 'L0') {
    return {
      indicatorId: indicator.id,
      totalScore: 0,
      relevanceScore: 0,
      magnitudeScore: 0,
      velocityScore: 0,
      qualityScore: 0,
      impactScore: 0,
      isWrapWorthy: false,
      worthinessReason: 'Classified as noise (L0)',
      suggestedPriority: 'mention',
      narrativeHook: '',
    };
  }
  
  // Insufficient data = excluded
  if (indicator.dataAvailability === 'insufficient') {
    return {
      indicatorId: indicator.id,
      totalScore: 0,
      relevanceScore: 0,
      magnitudeScore: 0,
      velocityScore: 0,
      qualityScore: 0,
      impactScore: 0,
      isWrapWorthy: false,
      worthinessReason: 'Insufficient verified data',
      suggestedPriority: 'mention',
      narrativeHook: '',
    };
  }
  
  // Calculate component scores
  const relevanceScore = calculateRelevanceScore(indicator);
  const magnitudeScore = calculateMagnitudeScore(indicator);
  const velocityScore = calculateVelocityScore(indicator);
  const qualityScore = calculateQualityScore(indicator);
  const impactScore = calculateImpactScore(indicator);
  
  const totalScore = relevanceScore + magnitudeScore + velocityScore + qualityScore + impactScore;
  const isWrapWorthy = totalScore >= WORTHINESS_THRESHOLD;
  
  // Determine priority
  let suggestedPriority: WorthinessScore['suggestedPriority'] = 'mention';
  if (totalScore >= PRIORITY_THRESHOLDS.hero) {
    suggestedPriority = 'hero';
  } else if (totalScore >= PRIORITY_THRESHOLDS.primary) {
    suggestedPriority = 'primary';
  } else if (totalScore >= PRIORITY_THRESHOLDS.secondary) {
    suggestedPriority = 'secondary';
  }
  
  const scores = {
    totalScore,
    relevanceScore,
    magnitudeScore,
    velocityScore,
    qualityScore,
    impactScore,
  };
  
  return {
    indicatorId: indicator.id,
    ...scores,
    isWrapWorthy,
    worthinessReason: determineWorthinessReason(indicator, scores),
    suggestedPriority,
    narrativeHook: generateNarrativeHook(indicator, totalScore),
    comparisonSuggestion: generateComparisonSuggestion(indicator),
  };
}

// ===========================================
// SELECTION ENGINE
// ===========================================

/**
 * Select indicators for Wrapped based on worthiness scores
 */
export function selectForWrap(
  indicators: IndicatorSnapshot[],
  options: {
    maxHero?: number;
    maxPrimary?: number;
    maxSecondary?: number;
    maxMention?: number;
    periodLabel?: string;
  } = {}
): WrapSelection {
  const {
    maxHero = 2,
    maxPrimary = 5,
    maxSecondary = 10,
    maxMention = 20,
    periodLabel = 'Unknown period',
  } = options;
  
  // Score all indicators
  const scored = indicators.map(calculateWorthinessScore);
  
  // Sort by total score descending
  const sorted = [...scored].sort((a, b) => b.totalScore - a.totalScore);
  
  // Separate into categories
  const heroIndicators: WorthinessScore[] = [];
  const primaryIndicators: WorthinessScore[] = [];
  const secondaryIndicators: WorthinessScore[] = [];
  const mentionIndicators: WorthinessScore[] = [];
  const excludedIndicators: WorthinessScore[] = [];
  
  for (const score of sorted) {
    if (!score.isWrapWorthy) {
      excludedIndicators.push(score);
      continue;
    }
    
    if (score.suggestedPriority === 'hero' && heroIndicators.length < maxHero) {
      heroIndicators.push(score);
    } else if (score.suggestedPriority === 'primary' && primaryIndicators.length < maxPrimary) {
      primaryIndicators.push(score);
    } else if (score.suggestedPriority === 'secondary' && secondaryIndicators.length < maxSecondary) {
      secondaryIndicators.push(score);
    } else if (mentionIndicators.length < maxMention) {
      mentionIndicators.push(score);
    }
    // Beyond maxMention, they get excluded even if wrap-worthy
  }
  
  return {
    heroIndicators,
    primaryIndicators,
    secondaryIndicators,
    mentionIndicators,
    excludedIndicators,
    totalEvaluated: indicators.length,
    totalIncluded: heroIndicators.length + primaryIndicators.length + secondaryIndicators.length + mentionIndicators.length,
    selectionTimestamp: new Date().toISOString(),
    periodCovered: periodLabel,
  };
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Get summary statistics for a selection
 */
export function getSelectionStats(selection: WrapSelection): {
  inclusionRate: number;
  avgHeroScore: number;
  avgPrimaryScore: number;
  topCategory: string;
  topRelevanceLevel: RelevanceLevel;
} {
  const inclusionRate = selection.totalIncluded / selection.totalEvaluated;
  
  const avgHeroScore = selection.heroIndicators.length > 0
    ? selection.heroIndicators.reduce((sum, s) => sum + s.totalScore, 0) / selection.heroIndicators.length
    : 0;
    
  const avgPrimaryScore = selection.primaryIndicators.length > 0
    ? selection.primaryIndicators.reduce((sum, s) => sum + s.totalScore, 0) / selection.primaryIndicators.length
    : 0;
  
  // These would need the original indicators to calculate properly
  // Placeholder for now
  return {
    inclusionRate,
    avgHeroScore,
    avgPrimaryScore,
    topCategory: 'Unknown',
    topRelevanceLevel: 'L3',
  };
}

/**
 * Check if an indicator meets minimum quality for inclusion
 */
export function meetsMinimumQuality(indicator: IndicatorSnapshot): boolean {
  return (
    indicator.dataAvailability === 'verified' ||
    indicator.dataAvailability === 'partial'
  ) && indicator.confidence >= 0.5;
}

/**
 * Calculate change velocity (rate of change over time)
 */
export function calculateChangeVelocity(
  values: { value: number; date: string }[]
): number {
  if (values.length < 2) return 0;
  
  // Sort by date
  const sorted = [...values].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate month-over-month changes
  const changes: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const change = (sorted[i].value - sorted[i - 1].value) / sorted[i - 1].value * 100;
    changes.push(change);
  }
  
  if (changes.length < 2) return 0;
  
  // Calculate acceleration (change in change rate)
  let accelerationSum = 0;
  for (let i = 1; i < changes.length; i++) {
    accelerationSum += changes[i] - changes[i - 1];
  }
  
  return accelerationSum / (changes.length - 1);
}

/**
 * Detect if current value breaks historical pattern
 */
export function detectPatternBreak(
  currentValue: number,
  historicalValues: number[],
  stdDevThreshold: number = 2
): boolean {
  if (historicalValues.length < 6) return false;
  
  const mean = historicalValues.reduce((sum, v) => sum + v, 0) / historicalValues.length;
  const variance = historicalValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / historicalValues.length;
  const stdDev = Math.sqrt(variance);
  
  // Check if current value is outside 2 standard deviations
  return Math.abs(currentValue - mean) > stdDevThreshold * stdDev;
}
