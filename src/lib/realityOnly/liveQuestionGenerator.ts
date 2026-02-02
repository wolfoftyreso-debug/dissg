/**
 * 🔒 Live Question Generator
 * 
 * Generates Reality Check questions ONLY from verified live data.
 * No questions are created if data is insufficient.
 */

import type {
  LiveQuestion,
  LiveQuestionOption,
  DataAvailability,
  VerificationProof,
} from '@/types/realityOnly';
import { checkDataSufficiency, generateVerificationProof, shouldBlockContent } from './dataValidator';

// ============================================
// QUESTION TEMPLATES
// ============================================

interface QuestionTemplate {
  id: string;
  category: 'trend' | 'magnitude' | 'comparison' | 'distribution';
  template: {
    en: string;
    sv: string;
  };
  optionGenerator: (value: number, unit: string) => LiveQuestionOption[];
}

const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    id: 'trend_direction',
    category: 'trend',
    template: {
      en: 'How has {indicator} changed {region} since {startYear}?',
      sv: 'Hur har {indicator} förändrats {region} sedan {startYear}?',
    },
    optionGenerator: (value, unit) => {
      const isIncrease = value > 0;
      const magnitude = Math.abs(value);
      
      return [
        { id: 'large_increase', label: `Increased by more than 50%`, value: 'large_increase', isCorrect: isIncrease && magnitude > 50, distanceFromCorrect: isIncrease && magnitude > 50 ? 0 : Math.abs(magnitude - 60) },
        { id: 'small_increase', label: `Increased by 10-50%`, value: 'small_increase', isCorrect: isIncrease && magnitude >= 10 && magnitude <= 50, distanceFromCorrect: 0 },
        { id: 'stable', label: `Stayed roughly the same (±10%)`, value: 'stable', isCorrect: magnitude < 10, distanceFromCorrect: magnitude < 10 ? 0 : magnitude - 10 },
        { id: 'small_decrease', label: `Decreased by 10-50%`, value: 'small_decrease', isCorrect: !isIncrease && magnitude >= 10 && magnitude <= 50, distanceFromCorrect: 0 },
        { id: 'large_decrease', label: `Decreased by more than 50%`, value: 'large_decrease', isCorrect: !isIncrease && magnitude > 50, distanceFromCorrect: 0 },
      ];
    },
  },
  {
    id: 'magnitude_estimate',
    category: 'magnitude',
    template: {
      en: 'What is the current {indicator} {region}?',
      sv: 'Vad är nuvarande {indicator} {region}?',
    },
    optionGenerator: (value, unit) => {
      // Generate options around the real value
      const options: LiveQuestionOption[] = [];
      const multipliers = [0.3, 0.6, 1, 1.5, 2.5];
      
      multipliers.forEach((m, i) => {
        const optionValue = Math.round(value * m);
        options.push({
          id: `option_${i}`,
          label: `${optionValue.toLocaleString()} ${unit}`,
          value: optionValue,
          isCorrect: m === 1,
          distanceFromCorrect: Math.abs(optionValue - value),
        });
      });
      
      // Shuffle options
      return options.sort(() => Math.random() - 0.5);
    },
  },
];

// ============================================
// LIVE QUESTION GENERATION
// ============================================

interface GeneratorInput {
  indicatorId: string;
  indicatorName: { en: string; sv: string };
  geoScope: string;
  geoName: { en: string; sv: string };
  timeRange: { start: string; end: string };
  availableData: Array<{
    date: string;
    value: number;
    confidence: number;
    source: string;
  }>;
  sources: Array<{ id: string; name: string; url: string; reliability: number; lastUpdated: string }>;
}

/**
 * Generate a question ONLY if data is sufficient
 */
export function generateLiveQuestion(input: GeneratorInput): LiveQuestion | null {
  const { indicatorId, indicatorName, geoScope, geoName, timeRange, availableData, sources } = input;
  
  // Check data sufficiency first
  const sufficiency = checkDataSufficiency({
    indicatorId,
    geoScope,
    timeRange,
    availableData,
  });
  
  // BLOCK if insufficient
  if (shouldBlockContent(sufficiency.result.availability)) {
    return null; // No question generated
  }
  
  // Get latest value and calculate change
  const sortedData = [...availableData].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const latestValue = sortedData[0]?.value;
  const earliestValue = sortedData[sortedData.length - 1]?.value;
  
  if (latestValue === undefined || earliestValue === undefined) {
    return null;
  }
  
  const changePercent = ((latestValue - earliestValue) / earliestValue) * 100;
  
  // Calculate uncertainty range
  const values = availableData.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const stdDev = Math.sqrt(
    values.reduce((sum, v) => sum + Math.pow(v - latestValue, 2), 0) / values.length
  );
  
  // Select template based on data characteristics
  const template = QUESTION_TEMPLATES[0]; // Trend question
  
  // Generate question text
  const startYear = new Date(timeRange.start).getFullYear().toString();
  const questionText = template.template.en
    .replace('{indicator}', indicatorName.en)
    .replace('{region}', geoName.en === 'Global' ? 'globally' : `in ${geoName.en}`)
    .replace('{startYear}', startYear);
  
  const questionTextSv = template.template.sv
    .replace('{indicator}', indicatorName.sv)
    .replace('{region}', geoName.sv === 'Globalt' ? 'globalt' : `i ${geoName.sv}`)
    .replace('{startYear}', startYear);
  
  // Generate options from real data
  const options = template.optionGenerator(changePercent, '%');
  
  // Generate verification proof
  const verification = generateVerificationProof({
    entityId: `question_${indicatorId}_${geoScope}_${timeRange.start}`,
    sources: sources.map(s => ({
      ...s,
      dataPoints: availableData.filter(d => d.source === s.id).length,
      coverage: 100,
    })),
    aggregationLogic: 'Calculated percentage change from earliest to latest data point in range.',
  });
  
  return {
    id: `LQ-${Date.now().toString(36)}`,
    code: `RC_${indicatorId.toUpperCase()}_${geoScope.toUpperCase()}`,
    questionText,
    questionTextLocal: { sv: questionTextSv },
    dataAvailability: sufficiency.result.availability,
    indicatorIds: [indicatorId],
    dataQuality: sufficiency.result.averageConfidence,
    options,
    liveAnswer: {
      value: changePercent.toFixed(1),
      uncertainty: { min: changePercent - stdDev, max: changePercent + stdDev },
      asOf: sortedData[0].date,
      sources: sources.map(s => s.name),
    },
    verification,
  };
}

/**
 * Generate multiple questions from available indicators
 */
export function generateLiveQuestionSet(
  indicators: GeneratorInput[],
  maxQuestions: number = 10
): LiveQuestion[] {
  const questions: LiveQuestion[] = [];
  
  for (const indicator of indicators) {
    if (questions.length >= maxQuestions) break;
    
    const question = generateLiveQuestion(indicator);
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Get count of questions that CAN be generated
 */
export function getAvailableQuestionCount(indicators: GeneratorInput[]): {
  available: number;
  unavailable: number;
  reasons: Record<string, number>;
} {
  const reasons: Record<string, number> = {};
  let available = 0;
  let unavailable = 0;
  
  for (const indicator of indicators) {
    const sufficiency = checkDataSufficiency({
      indicatorId: indicator.indicatorId,
      geoScope: indicator.geoScope,
      timeRange: indicator.timeRange,
      availableData: indicator.availableData,
    });
    
    if (shouldBlockContent(sufficiency.result.availability)) {
      unavailable++;
      reasons[sufficiency.result.availability] = (reasons[sufficiency.result.availability] || 0) + 1;
    } else {
      available++;
    }
  }
  
  return { available, unavailable, reasons };
}
