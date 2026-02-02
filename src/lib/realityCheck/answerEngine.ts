/**
 * 🎯 Reality Check Answer Engine
 * 
 * Processes user responses and generates the 3-layer answer model:
 * - Layer 1: User perception
 * - Layer 2: Observed data
 * - Layer 3: Full traceability
 * 
 * NEVER says "right" or "wrong" - only shows alignment with data.
 */

import type {
  RealityCheckQuestion,
  RealityCheckAnswer,
  Layer1UserPerception,
  Layer2ObservedData,
  Layer3Traceability,
  PerceptionGap,
  QuestionCategory,
} from '@/types/realityCheck';
import { buildTraceabilityLayer } from './verificationEngine';

// ============================================
// ALIGNMENT CALCULATION
// ============================================

/**
 * Calculate alignment between perception and observation
 * Returns 0-100 where 100 = perfect alignment
 */
export function calculateAlignment(
  perception: Layer1UserPerception,
  observation: Layer2ObservedData,
  questionType: 'numeric' | 'categorical' | 'range'
): {
  score: number;
  deviation: number | null;
  direction: 'over' | 'under' | 'aligned' | null;
} {
  if (questionType === 'numeric' && perception.numericGuess !== undefined) {
    const observed = typeof observation.observedValue === 'number' 
      ? observation.observedValue 
      : parseFloat(observation.observedValue as string);
    
    const guess = perception.numericGuess;
    const deviation = guess - observed;
    const percentError = Math.abs(deviation / observed) * 100;
    
    // Score: 100 if exact, decreasing with error
    const score = Math.max(0, 100 - percentError);
    
    return {
      score: Math.round(score),
      deviation: Math.round(deviation * 10) / 10,
      direction: deviation > 0 ? 'over' : deviation < 0 ? 'under' : 'aligned',
    };
  }
  
  if (questionType === 'categorical' && perception.selectedOptionId !== undefined) {
    // For categorical, it's binary: correct option or not
    const isCorrect = perception.selectedOptionId === observation.observedValue;
    return {
      score: isCorrect ? 100 : 0,
      deviation: null,
      direction: isCorrect ? 'aligned' : null,
    };
  }
  
  // Range questions
  if (questionType === 'range' && perception.numericGuess !== undefined) {
    const observed = typeof observation.observedValue === 'number' 
      ? observation.observedValue 
      : parseFloat(observation.observedValue as string);
    const range = observation.observedRange;
    
    if (range) {
      const isInRange = perception.numericGuess >= range.min && perception.numericGuess <= range.max;
      if (isInRange) {
        return { score: 100, deviation: 0, direction: 'aligned' };
      }
      
      // Calculate how far outside range
      const deviation = perception.numericGuess < range.min 
        ? perception.numericGuess - range.min
        : perception.numericGuess - range.max;
      
      const rangeSize = range.max - range.min;
      const percentOutside = Math.abs(deviation / rangeSize) * 100;
      
      return {
        score: Math.max(0, 100 - percentOutside),
        deviation,
        direction: deviation < 0 ? 'under' : 'over',
      };
    }
    
    // Fallback to point comparison
    const deviation = perception.numericGuess - observed;
    return {
      score: Math.max(0, 100 - Math.abs(deviation / observed) * 100),
      deviation,
      direction: deviation > 0 ? 'over' : deviation < 0 ? 'under' : 'aligned',
    };
  }
  
  return { score: 0, deviation: null, direction: null };
}

// ============================================
// ANSWER BUILDING
// ============================================

interface AnswerBuilderInput {
  question: RealityCheckQuestion;
  userResponse: {
    selectedOptionId?: string;
    numericGuess?: number;
    confidence: Layer1UserPerception['confidence'];
  };
  observedData: {
    value: number | string;
    range?: { min: number; max: number };
    unit: string;
    confidence: number;
    sources: Array<{ id: string; name: string; url: string; reliability: number; lastUpdated: string }>;
    dataAsOf: string;
    latencyDays: number;
    dataPoints: number;
    comparisonBaseline?: number;
    percentilePosition?: number;
  };
  aggregationMethod: string;
  limitations: string[];
}

/**
 * Build a complete 3-layer answer
 */
export function buildAnswer(input: AnswerBuilderInput): RealityCheckAnswer {
  const { question, userResponse, observedData, aggregationMethod, limitations } = input;
  
  // Layer 1: User perception
  const layer1: Layer1UserPerception = {
    questionId: question.id,
    selectedOptionId: userResponse.selectedOptionId,
    numericGuess: userResponse.numericGuess,
    answeredAt: new Date().toISOString(),
    confidence: userResponse.confidence,
  };
  
  // Layer 2: Observed data
  const layer2: Layer2ObservedData = {
    questionId: question.id,
    observedValue: observedData.value,
    observedRange: observedData.range,
    unit: observedData.unit,
    confidence: observedData.confidence,
    uncertainty: observedData.confidence >= 80 ? 'low' : observedData.confidence >= 60 ? 'medium' : 'high',
    dataPoints: observedData.dataPoints,
    dataAsOf: observedData.dataAsOf,
    latencyDays: observedData.latencyDays,
    comparisonBaseline: observedData.comparisonBaseline,
    percentilePosition: observedData.percentilePosition,
  };
  
  // Layer 3: Traceability
  const layer3: Layer3Traceability = buildTraceabilityLayer(
    question.id,
    observedData.sources,
    aggregationMethod,
    limitations
  );
  
  // Calculate alignment
  const questionType = question.options ? 'categorical' : 'numeric';
  const alignment = calculateAlignment(layer1, layer2, questionType);
  
  return {
    layer1,
    layer2,
    layer3,
    alignmentScore: alignment.score,
    deviation: alignment.deviation,
    deviationDirection: alignment.direction,
  };
}

// ============================================
// NEUTRAL TEXT GENERATION
// ============================================

/**
 * Generate neutral comparison text (never "right" or "wrong")
 */
export function generateComparisonText(
  answer: RealityCheckAnswer,
  language: 'en' | 'sv' = 'en'
): string {
  const { layer1, layer2, alignmentScore, deviation, deviationDirection } = answer;
  
  if (language === 'sv') {
    if (alignmentScore >= 90) {
      return `Din uppskattning (${layer1.numericGuess}) ligger nära observerade data (${layer2.observedValue} ${layer2.unit}).`;
    }
    
    if (deviationDirection === 'over') {
      return `Din uppskattning (${layer1.numericGuess}) var ${Math.abs(deviation || 0)} ${layer2.unit} högre än observerade data (${layer2.observedValue} ${layer2.unit}).`;
    }
    
    if (deviationDirection === 'under') {
      return `Din uppskattning (${layer1.numericGuess}) var ${Math.abs(deviation || 0)} ${layer2.unit} lägre än observerade data (${layer2.observedValue} ${layer2.unit}).`;
    }
    
    return `Observerade data visar: ${layer2.observedValue} ${layer2.unit}.`;
  }
  
  // English
  if (alignmentScore >= 90) {
    return `Your estimate (${layer1.numericGuess}) aligns closely with observed data (${layer2.observedValue} ${layer2.unit}).`;
  }
  
  if (deviationDirection === 'over') {
    return `Your estimate (${layer1.numericGuess}) was ${Math.abs(deviation || 0)} ${layer2.unit} higher than observed data (${layer2.observedValue} ${layer2.unit}).`;
  }
  
  if (deviationDirection === 'under') {
    return `Your estimate (${layer1.numericGuess}) was ${Math.abs(deviation || 0)} ${layer2.unit} lower than observed data (${layer2.observedValue} ${layer2.unit}).`;
  }
  
  return `Observed data shows: ${layer2.observedValue} ${layer2.unit}.`;
}

// ============================================
// PERCEPTION GAP ANALYSIS
// ============================================

/**
 * Calculate perception gap for a question across multiple responses
 */
export function calculatePerceptionGap(
  questionId: string,
  category: QuestionCategory,
  responses: Array<{ guess: number; region?: string; age?: string; education?: string }>,
  actualValue: number
): PerceptionGap {
  if (responses.length === 0) {
  return {
    questionId,
    questionCategory: category,
    averagePerception: 0,
    actualValue,
    gapPercent: 0,
    gapDirection: 'over' as const, // Default to 'over' when no data
    sampleSize: 0,
      calculatedAt: new Date().toISOString(),
    };
  }
  
  const averagePerception = responses.reduce((sum, r) => sum + r.guess, 0) / responses.length;
  const gapPercent = ((averagePerception - actualValue) / actualValue) * 100;
  
  // Calculate gaps by demographic
  const gapByRegion: Record<string, number> = {};
  const gapByAge: Record<string, number> = {};
  const gapByEducation: Record<string, number> = {};
  
  // Group by region
  const byRegion = responses.filter(r => r.region).reduce((acc, r) => {
    if (!acc[r.region!]) acc[r.region!] = [];
    acc[r.region!].push(r.guess);
    return acc;
  }, {} as Record<string, number[]>);
  
  for (const [region, guesses] of Object.entries(byRegion)) {
    const avg = guesses.reduce((a, b) => a + b, 0) / guesses.length;
    gapByRegion[region] = ((avg - actualValue) / actualValue) * 100;
  }
  
  // Similar for age and education...
  
  return {
    questionId,
    questionCategory: category,
    averagePerception: Math.round(averagePerception * 10) / 10,
    actualValue,
    gapPercent: Math.round(gapPercent * 10) / 10,
    gapDirection: gapPercent > 0 ? 'over' : 'under',
    gapByRegion: Object.keys(gapByRegion).length > 0 ? gapByRegion : undefined,
    gapByAge: Object.keys(gapByAge).length > 0 ? gapByAge : undefined,
    gapByEducation: Object.keys(gapByEducation).length > 0 ? gapByEducation : undefined,
    sampleSize: responses.length,
    calculatedAt: new Date().toISOString(),
  };
}

// ============================================
// SESSION SCORING
// ============================================

/**
 * Calculate overall session alignment score
 */
export function calculateSessionScore(answers: RealityCheckAnswer[]): {
  overallScore: number;
  strongCategories: QuestionCategory[];
  weakCategories: QuestionCategory[];
  totalQuestions: number;
  answeredQuestions: number;
} {
  if (answers.length === 0) {
    return {
      overallScore: 0,
      strongCategories: [],
      weakCategories: [],
      totalQuestions: 0,
      answeredQuestions: 0,
    };
  }
  
  const overallScore = answers.reduce((sum, a) => sum + a.alignmentScore, 0) / answers.length;
  
  // Group by category (would need category info in answers)
  // For now, return simple result
  
  return {
    overallScore: Math.round(overallScore),
    strongCategories: [],
    weakCategories: [],
    totalQuestions: answers.length,
    answeredQuestions: answers.length,
  };
}

// ============================================
// DATA REFUSAL
// ============================================

/**
 * Check if question can be answered with current data
 * Returns refusal message if not
 */
export function checkDataAvailability(
  question: RealityCheckQuestion,
  availableData: {
    indicators: string[];
    regions: string[];
    dataRange: { start: string; end: string };
    confidenceThreshold: number;
  }
): {
  canAnswer: boolean;
  refusalReason?: string;
  missingElements?: string[];
} {
  const missing: string[] = [];
  
  // Check indicators
  for (const id of question.indicatorIds) {
    if (!availableData.indicators.includes(id)) {
      missing.push(`Indicator ${id} not available`);
    }
  }
  
  // Check regions
  if (Array.isArray(question.geoScope)) {
    for (const geo of question.geoScope) {
      if (!availableData.regions.includes(geo)) {
        missing.push(`Region ${geo} not in data`);
      }
    }
  }
  
  // Check time range
  const qStart = new Date(question.timeRange.start);
  const qEnd = new Date(question.timeRange.end);
  const dStart = new Date(availableData.dataRange.start);
  const dEnd = new Date(availableData.dataRange.end);
  
  if (qStart < dStart || qEnd > dEnd) {
    missing.push(`Time range ${question.timeRange.start}-${question.timeRange.end} not fully covered`);
  }
  
  if (missing.length > 0) {
    return {
      canAnswer: false,
      refusalReason: 'Cannot evaluate: insufficient data',
      missingElements: missing,
    };
  }
  
  return { canAnswer: true };
}
