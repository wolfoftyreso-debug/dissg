/**
 * 🧠 Reality Check Question Generator
 * 
 * Automatisk generering av verifierbara frågor
 * baserade på tillgänglig live-data.
 * 
 * Principer:
 * - Endast frågor som kan besvaras med data
 * - Ingen fråga utan verifierbart facit
 * - Ingen fråga utan tidsbundenhet och geografisk definition
 */

import type {
  RealityCheckQuestion,
  QuestionCategory,
  QuestionDifficulty,
} from '@/types/realityCheck';
import { REALITY_CHECK_FORBIDDEN_PHRASES } from '@/types/realityCheck';

// ============================================
// QUESTION TEMPLATES
// ============================================

export interface QuestionTemplate {
  id: string;
  category: QuestionCategory;
  template: string; // Uses {indicator}, {region}, {year}, etc.
  templateSv: string;
  requiredParams: string[];
  optionGenerator?: (data: TemplateData) => QuestionOption[];
}

interface TemplateData {
  indicator: {
    id: string;
    name: string;
    nameSv: string;
    unit: string;
    currentValue: number;
    previousValue: number | null;
  };
  region?: {
    code: string;
    name: string;
    nameSv: string;
  };
  timeRange?: {
    start: string;
    end: string;
  };
  comparison?: {
    values: Array<{ label: string; value: number }>;
  };
}

interface QuestionOption {
  id: string;
  label: string;
  value: number | string;
}

// ============================================
// STANDARD TEMPLATES
// ============================================

export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  // TREND questions
  {
    id: 'trend_direction',
    category: 'trend',
    template: 'How has {indicator} changed in {region} since {startYear}?',
    templateSv: 'Hur har {indicator} förändrats i {region} sedan {startYear}?',
    requiredParams: ['indicator', 'region', 'startYear'],
    optionGenerator: () => [
      { id: 'increased', label: 'Increased significantly', value: 'increased' },
      { id: 'stable', label: 'Stayed roughly the same', value: 'stable' },
      { id: 'decreased', label: 'Decreased significantly', value: 'decreased' },
    ],
  },
  {
    id: 'trend_magnitude',
    category: 'trend',
    template: 'By how much has {indicator} changed in {region} between {startYear} and {endYear}?',
    templateSv: 'Hur mycket har {indicator} förändrats i {region} mellan {startYear} och {endYear}?',
    requiredParams: ['indicator', 'region', 'startYear', 'endYear'],
  },
  
  // COMPARISON questions
  {
    id: 'comparison_highest',
    category: 'comparison',
    template: 'Which region has the highest {indicator} as of {year}?',
    templateSv: 'Vilken region har högst {indicator} per {year}?',
    requiredParams: ['indicator', 'year', 'regions'],
  },
  {
    id: 'comparison_lowest',
    category: 'comparison',
    template: 'Which region has the lowest {indicator} as of {year}?',
    templateSv: 'Vilken region har lägst {indicator} per {year}?',
    requiredParams: ['indicator', 'year', 'regions'],
  },
  
  // DISTRIBUTION questions
  {
    id: 'distribution_percentage',
    category: 'distribution',
    template: 'What percentage of {population} in {region} has {characteristic} as of {year}?',
    templateSv: 'Hur stor andel av {population} i {region} har {characteristic} per {year}?',
    requiredParams: ['population', 'region', 'characteristic', 'year'],
  },
  
  // MAGNITUDE questions
  {
    id: 'magnitude_absolute',
    category: 'magnitude',
    template: 'What is the {indicator} in {region} as of {year}?',
    templateSv: 'Vad är {indicator} i {region} per {year}?',
    requiredParams: ['indicator', 'region', 'year'],
  },
  
  // RANKING questions
  {
    id: 'ranking_position',
    category: 'ranking',
    template: 'Where does {region} rank in {indicator} among {referenceGroup} as of {year}?',
    templateSv: 'Var rankas {region} i {indicator} bland {referenceGroup} per {year}?',
    requiredParams: ['region', 'indicator', 'referenceGroup', 'year'],
  },
  
  // CORRELATION questions (with strict disclaimers)
  {
    id: 'correlation_direction',
    category: 'correlation',
    template: 'In {region}, is there an observed correlation between {indicatorA} and {indicatorB} during {period}?',
    templateSv: 'I {region}, finns det en observerad korrelation mellan {indicatorA} och {indicatorB} under {period}?',
    requiredParams: ['region', 'indicatorA', 'indicatorB', 'period'],
    optionGenerator: () => [
      { id: 'positive', label: 'Positive correlation', value: 'positive' },
      { id: 'negative', label: 'Negative correlation', value: 'negative' },
      { id: 'none', label: 'No significant correlation', value: 'none' },
    ],
  },
];

// ============================================
// VALIDATION
// ============================================

/**
 * Validate that a question text contains no forbidden phrases
 */
export function validateQuestionText(text: string): {
  isValid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  for (const phrase of REALITY_CHECK_FORBIDDEN_PHRASES) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      violations.push(phrase);
    }
  }
  
  return {
    isValid: violations.length === 0,
    violations,
  };
}

/**
 * Check if question can be answered with available data
 */
export function canQuestionBeAnswered(
  question: Partial<RealityCheckQuestion>,
  availableIndicators: string[],
  availableRegions: string[],
  dataRange: { earliest: string; latest: string }
): {
  canAnswer: boolean;
  missingData: string[];
} {
  const missing: string[] = [];
  
  // Check indicators
  if (question.indicatorIds) {
    for (const id of question.indicatorIds) {
      if (!availableIndicators.includes(id)) {
        missing.push(`Indicator: ${id}`);
      }
    }
  }
  
  // Check geo scope
  if (question.geoScope && Array.isArray(question.geoScope)) {
    for (const geo of question.geoScope) {
      if (!availableRegions.includes(geo)) {
        missing.push(`Region: ${geo}`);
      }
    }
  }
  
  // Check time range
  if (question.timeRange) {
    const questionStart = new Date(question.timeRange.start);
    const dataStart = new Date(dataRange.earliest);
    const questionEnd = new Date(question.timeRange.end);
    const dataEnd = new Date(dataRange.latest);
    
    if (questionStart < dataStart) {
      missing.push(`Time range starts before available data (${dataRange.earliest})`);
    }
    if (questionEnd > dataEnd) {
      missing.push(`Time range ends after available data (${dataRange.latest})`);
    }
  }
  
  return {
    canAnswer: missing.length === 0,
    missingData: missing,
  };
}

// ============================================
// QUESTION GENERATION
// ============================================

interface GeneratorInput {
  indicators: Array<{
    id: string;
    name: string;
    nameSv: string;
    unit: string;
    category: string;
  }>;
  regions: Array<{
    code: string;
    name: string;
    nameSv: string;
  }>;
  dataRange: { start: string; end: string };
  targetDifficulty?: QuestionDifficulty;
  targetCategory?: QuestionCategory;
  maxQuestions?: number;
}

/**
 * Generate questions from available data
 */
export function generateQuestions(input: GeneratorInput): RealityCheckQuestion[] {
  const questions: RealityCheckQuestion[] = [];
  const { indicators, regions, dataRange, targetCategory, maxQuestions = 10 } = input;
  
  // Filter templates by category if specified
  const templates = targetCategory
    ? QUESTION_TEMPLATES.filter(t => t.category === targetCategory)
    : QUESTION_TEMPLATES;
  
  for (const template of templates) {
    if (questions.length >= maxQuestions) break;
    
    // Generate questions for trend templates
    if (template.category === 'trend') {
      for (const indicator of indicators.slice(0, 3)) {
        for (const region of regions.slice(0, 2)) {
          const questionText = template.template
            .replace('{indicator}', indicator.name)
            .replace('{region}', region.name)
            .replace('{startYear}', dataRange.start.slice(0, 4))
            .replace('{endYear}', dataRange.end.slice(0, 4));
          
          const questionTextSv = template.templateSv
            .replace('{indicator}', indicator.nameSv)
            .replace('{region}', region.nameSv)
            .replace('{startYear}', dataRange.start.slice(0, 4))
            .replace('{endYear}', dataRange.end.slice(0, 4));
          
          questions.push({
            id: `${template.id}_${indicator.id}_${region.code}`,
            code: `RC_${template.id.toUpperCase()}_${indicator.id}_${region.code}`,
            questionText,
            questionTextLocal: { sv: questionTextSv },
            category: template.category,
            difficulty: 'medium',
            indicatorIds: [indicator.id],
            geoScope: [region.code],
            timeRange: { start: dataRange.start, end: dataRange.end },
            options: template.optionGenerator?.({}  as TemplateData),
            requiresLiveData: true,
            minimumConfidence: 70,
            sources: [],
            lastVerified: new Date().toISOString(),
            isActive: true,
          });
          
          if (questions.length >= maxQuestions) break;
        }
        if (questions.length >= maxQuestions) break;
      }
    }
    
    // Generate comparison questions
    if (template.category === 'comparison' && regions.length >= 2) {
      for (const indicator of indicators.slice(0, 2)) {
        const questionText = template.template
          .replace('{indicator}', indicator.name)
          .replace('{year}', dataRange.end.slice(0, 4));
        
        const questionTextSv = template.templateSv
          .replace('{indicator}', indicator.nameSv)
          .replace('{year}', dataRange.end.slice(0, 4));
        
        questions.push({
          id: `${template.id}_${indicator.id}`,
          code: `RC_${template.id.toUpperCase()}_${indicator.id}`,
          questionText,
          questionTextLocal: { sv: questionTextSv },
          category: template.category,
          difficulty: 'hard',
          indicatorIds: [indicator.id],
          geoScope: regions.map(r => r.code),
          timeRange: { start: dataRange.end, end: dataRange.end },
          options: regions.map(r => ({ id: r.code, label: r.name, value: r.code })),
          requiresLiveData: true,
          minimumConfidence: 80,
          sources: [],
          lastVerified: new Date().toISOString(),
          isActive: true,
        });
        
        if (questions.length >= maxQuestions) break;
      }
    }
  }
  
  return questions;
}

// ============================================
// ROSLING-STYLE PRESET QUESTIONS
// ============================================

export const ROSLING_STYLE_PRESETS: Partial<RealityCheckQuestion>[] = [
  {
    code: 'ROSLING_CHILD_MORTALITY',
    questionText: 'How has global child mortality (under 5) changed since 1990?',
    questionTextLocal: { sv: 'Hur har global barnadödlighet (under 5) förändrats sedan 1990?' },
    category: 'trend',
    difficulty: 'easy',
    indicatorIds: ['child_mortality_u5'],
    geoScope: 'global',
    options: [
      { id: 'halved', label: 'Decreased by more than half', value: 'halved' },
      { id: 'decreased', label: 'Decreased by less than half', value: 'decreased' },
      { id: 'same', label: 'Stayed about the same', value: 'same' },
      { id: 'increased', label: 'Increased', value: 'increased' },
    ],
  },
  {
    code: 'ROSLING_EXTREME_POVERTY',
    questionText: 'What share of the world population lives in extreme poverty today, compared to 1990?',
    questionTextLocal: { sv: 'Vilken andel av världens befolkning lever i extrem fattigdom idag, jämfört med 1990?' },
    category: 'trend',
    difficulty: 'medium',
    indicatorIds: ['extreme_poverty_rate'],
    geoScope: 'global',
  },
  {
    code: 'ROSLING_LIFE_EXPECTANCY',
    questionText: 'What is the average life expectancy worldwide today?',
    questionTextLocal: { sv: 'Vad är medellivslängden i världen idag?' },
    category: 'magnitude',
    difficulty: 'easy',
    indicatorIds: ['life_expectancy'],
    geoScope: 'global',
    options: [
      { id: '50', label: 'Around 50 years', value: 50 },
      { id: '60', label: 'Around 60 years', value: 60 },
      { id: '70', label: 'Around 70 years', value: 70 },
      { id: '80', label: 'Around 80 years', value: 80 },
    ],
  },
  {
    code: 'ROSLING_GIRLS_SCHOOL',
    questionText: 'In low-income countries, what percentage of girls finish primary school?',
    questionTextLocal: { sv: 'I låginkomstländer, hur stor andel av flickorna avslutar grundskolan?' },
    category: 'distribution',
    difficulty: 'hard',
    indicatorIds: ['primary_completion_female'],
    geoScope: 'global',
    options: [
      { id: '20', label: '20%', value: 20 },
      { id: '40', label: '40%', value: 40 },
      { id: '60', label: '60%', value: 60 },
      { id: '80', label: '80%', value: 80 },
    ],
  },
];

/**
 * Determine difficulty based on question characteristics
 */
export function calculateDifficulty(
  category: QuestionCategory,
  optionSpread: number, // How close the options are
  commonMisperception: boolean // Is this a commonly misunderstood fact?
): QuestionDifficulty {
  let score = 0;
  
  // Category difficulty
  const categoryScores: Record<QuestionCategory, number> = {
    magnitude: 1,
    trend: 2,
    distribution: 2,
    ranking: 3,
    comparison: 3,
    correlation: 4,
  };
  score += categoryScores[category];
  
  // Option spread
  if (optionSpread < 10) score += 2; // Very close options
  else if (optionSpread < 25) score += 1;
  
  // Common misperception
  if (commonMisperception) score += 1;
  
  // Map score to difficulty
  if (score <= 2) return 'easy';
  if (score <= 4) return 'medium';
  if (score <= 6) return 'hard';
  return 'expert';
}
