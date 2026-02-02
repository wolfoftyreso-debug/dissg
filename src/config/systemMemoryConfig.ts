/**
 * MODULE — SYSTEM MEMORY & HISTORICAL PATTERN ARCHIVE (SMA)
 * "Systemet minns hur världen förändrats och feltolkats"
 * 
 * Långtidsminne för mönster, händelser och feltolkningar.
 */

// ═══════════════════════════════════════════════════════════════
// CORE PRINCIPLE
// ═══════════════════════════════════════════════════════════════

export const SMA_CORE_PRINCIPLE = {
  statement: 'Historia är inte det förflutna – det är mönster som riskerar att upprepas.',
  statementEn: 'History is not the past – it is patterns that risk being repeated.',
  enforced: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// HISTORICAL PATTERNS
// ═══════════════════════════════════════════════════════════════

export interface HistoricalPattern {
  id: string;
  code: string;
  title: string;
  titleSv: string;
  description: string;
  descriptionSv: string;
  category: 'economic' | 'political' | 'social' | 'environmental' | 'technological';
  firstInstance: HistoricalInstance;
  subsequentInstances: HistoricalInstance[];
  averageCycleYears: number;
  warningIndicators: string[];
  warningIndicatorsSv: string[];
  currentRiskLevel: 'dormant' | 'low' | 'elevated' | 'high' | 'imminent';
  lastAssessed: string;
}

export interface HistoricalInstance {
  id: string;
  location: string;
  startYear: string;
  endYear: string;
  severity: number; // 1-10
  outcome: string;
  outcomeSv: string;
  keyFactors: string[];
  keyFactorsSv: string[];
}

// ═══════════════════════════════════════════════════════════════
// MISINTERPRETATION ARCHIVE
// ═══════════════════════════════════════════════════════════════

export interface HistoricalMisinterpretation {
  id: string;
  event: string;
  eventSv: string;
  year: string;
  originalInterpretation: string;
  originalInterpretationSv: string;
  actualCause: string;
  actualCauseSv: string;
  howLongToCorrect: string;
  lessonsLearned: string[];
  lessonsLearnedSv: string[];
  stillRepeated: boolean;
}

// ═══════════════════════════════════════════════════════════════
// TIMELINE MEMORY
// ═══════════════════════════════════════════════════════════════

export interface MemoryTimeline {
  decade: string;
  majorEvents: TimelineEvent[];
  dominantNarratives: string[];
  dominantNarrativesSv: string[];
  laterRevisions: string[];
  laterRevisionsSv: string[];
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  titleSv: string;
  category: string;
  impact: 'local' | 'regional' | 'global';
  impactScore: number;
  linkedPatterns: string[]; // Pattern IDs
}

// ═══════════════════════════════════════════════════════════════
// PREDICTION ARCHIVE
// ═══════════════════════════════════════════════════════════════

export interface HistoricalPrediction {
  id: string;
  madeBy: string;
  madeIn: string;
  prediction: string;
  predictionSv: string;
  targetYear: string;
  outcome: 'accurate' | 'partially_accurate' | 'wrong' | 'pending';
  actualResult?: string;
  actualResultSv?: string;
  lessonsForForecasting: string;
  lessonsForForecastingSv: string;
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

export const MOCK_PATTERNS: HistoricalPattern[] = [
  {
    id: 'hp-1',
    code: 'DEBT-CRISIS-CYCLE',
    title: 'Sovereign Debt Crisis Cycle',
    titleSv: 'Statsskuldskriscykel',
    description: 'Pattern of excessive borrowing during growth, followed by crisis during downturn',
    descriptionSv: 'Mönster av överdriven upplåning under tillväxt, följt av kris under nedgång',
    category: 'economic',
    firstInstance: {
      id: 'hi-1',
      location: 'Latin America',
      startYear: '1982',
      endYear: '1989',
      severity: 8,
      outcome: 'Lost decade of development',
      outcomeSv: 'Förlorat decennium av utveckling',
      keyFactors: ['High interest rates', 'Commodity price drops', 'Dollar strengthening'],
      keyFactorsSv: ['Höga räntor', 'Råvaruprisfall', 'Dollarstärkning'],
    },
    subsequentInstances: [
      {
        id: 'hi-2',
        location: 'Asia',
        startYear: '1997',
        endYear: '1999',
        severity: 7,
        outcome: 'Regional contagion and IMF interventions',
        outcomeSv: 'Regional spridning och IMF-interventioner',
        keyFactors: ['Currency pegs', 'Short-term debt', 'Contagion'],
        keyFactorsSv: ['Valutakopplingar', 'Kortfristiga skulder', 'Spridning'],
      },
      {
        id: 'hi-3',
        location: 'Eurozone',
        startYear: '2010',
        endYear: '2015',
        severity: 8,
        outcome: 'Euro crisis, austerity, political instability',
        outcomeSv: 'Eurokris, åtstramning, politisk instabilitet',
        keyFactors: ['Monetary union without fiscal union', 'Banking exposure', 'Sovereign-bank loop'],
        keyFactorsSv: ['Monetär union utan fiskal union', 'Bankexponering', 'Stat-bank-loop'],
      },
    ],
    averageCycleYears: 12,
    warningIndicators: ['Debt-to-GDP above 100%', 'Current account deficits', 'Yield spread widening'],
    warningIndicatorsSv: ['Skuld-till-BNP över 100%', 'Bytesbalansunderskott', 'Räntespreadökning'],
    currentRiskLevel: 'elevated',
    lastAssessed: '2024-11-01',
  },
];

export const MOCK_MISINTERPRETATIONS: HistoricalMisinterpretation[] = [
  {
    id: 'hm-1',
    event: '2008 Financial Crisis',
    eventSv: 'Finanskrisen 2008',
    year: '2008',
    originalInterpretation: 'Black swan event, unpredictable',
    originalInterpretationSv: 'Svart svan-händelse, oförutsägbar',
    actualCause: 'Systemic risks were visible in housing data, debt ratios, and derivative exposure years before',
    actualCauseSv: 'Systemiska risker var synliga i bostadsdata, skuldkvoter och derivatexponering år innan',
    howLongToCorrect: '2-3 years',
    lessonsLearned: ['Warning signs existed', 'Incentive structures matter', 'Complexity hides risk'],
    lessonsLearnedSv: ['Varningssignaler fanns', 'Incitamentsstrukturer spelar roll', 'Komplexitet döljer risk'],
    stillRepeated: true,
  },
  {
    id: 'hm-2',
    event: 'Japanese Asset Bubble',
    eventSv: 'Japanska tillgångsbubblan',
    year: '1991',
    originalInterpretation: 'Japan will surpass the US economy',
    originalInterpretationSv: 'Japan kommer överträffa USA:s ekonomi',
    actualCause: 'Asset prices were driven by speculation and easy credit, not fundamental growth',
    actualCauseSv: 'Tillgångspriser drevs av spekulation och lätta krediter, inte fundamental tillväxt',
    howLongToCorrect: '3-5 years',
    lessonsLearned: ['Price-to-fundamentals matter', 'Credit-driven growth is fragile', 'Demographic factors compound'],
    lessonsLearnedSv: ['Pris-till-fundamenta spelar roll', 'Kreditdriven tillväxt är bräcklig', 'Demografiska faktorer förstärker'],
    stillRepeated: true,
  },
];

export const MOCK_PREDICTIONS: HistoricalPrediction[] = [
  {
    id: 'pred-1',
    madeBy: 'Club of Rome',
    madeIn: '1972',
    prediction: 'Resource depletion will halt growth by 2000',
    predictionSv: 'Resursbrist kommer stoppa tillväxt år 2000',
    targetYear: '2000',
    outcome: 'wrong',
    actualResult: 'Growth continued, but model timing was off, not core logic',
    actualResultSv: 'Tillväxten fortsatte, men modellens timing var fel, inte kärnlogiken',
    lessonsForForecasting: 'Complex systems adapt; timing is harder than direction',
    lessonsForForecastingSv: 'Komplexa system anpassar sig; timing är svårare än riktning',
  },
];

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const SYSTEM_MEMORY_ARCHIVE = {
  name: 'System Memory & Historical Pattern Archive',
  acronym: 'SMA',
  version: '1.0',
  core_principle: SMA_CORE_PRINCIPLE,
  result: 'Systemet minns – så att mänskligheten inte behöver upprepa.',
} as const;
