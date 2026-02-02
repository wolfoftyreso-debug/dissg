/**
 * MODULE — COLLECTIVE LEARNING TRACKER (CLT)
 * "Vad världen faktiskt lär sig (eller inte) över tid"
 * 
 * Spårar globalt lärande, upprepade misstag och 
 * kunskapsackumulering.
 */

// ═══════════════════════════════════════════════════════════════
// CORE PRINCIPLE
// ═══════════════════════════════════════════════════════════════

export const CLT_CORE_PRINCIPLE = {
  statement: 'Mänskligheten lär sig – men långsamt, ojämnt och med frekventa återfall.',
  statementEn: 'Humanity learns – but slowly, unevenly, and with frequent relapses.',
  enforced: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// LEARNING CATEGORIES
// ═══════════════════════════════════════════════════════════════

export type LearningDomain = 
  | 'economic_policy'
  | 'public_health'
  | 'environmental'
  | 'governance'
  | 'technology'
  | 'social_policy';

export interface LearningPattern {
  id: string;
  domain: LearningDomain;
  title: string;
  titleSv: string;
  description: string;
  descriptionSv: string;
  firstObserved: string;
  timesRepeated: number;
  timesLearned: number;
  currentStatus: 'learned' | 'learning' | 'forgotten' | 'repeating';
  confidenceLevel: number;
  geographicSpread: 'global' | 'regional' | 'local';
  examples: LearningExample[];
}

export interface LearningExample {
  country: string;
  year: string;
  outcome: 'success' | 'failure' | 'mixed';
  description: string;
  descriptionSv: string;
}

// ═══════════════════════════════════════════════════════════════
// MISTAKE PATTERNS
// ═══════════════════════════════════════════════════════════════

export interface RepeatedMistake {
  id: string;
  pattern: string;
  patternSv: string;
  occurrences: MistakeOccurrence[];
  avgTimeBetween: string;
  lastOccurred: string;
  predictedRisk: 'low' | 'medium' | 'high';
  warningSignals: string[];
  warningSignalsSv: string[];
}

export interface MistakeOccurrence {
  id: string;
  location: string;
  date: string;
  severity: number;
  outcome: string;
  outcomeSv: string;
}

// ═══════════════════════════════════════════════════════════════
// REPLICATION TRACKING
// ═══════════════════════════════════════════════════════════════

export interface PolicyReplication {
  originalPolicy: string;
  originalCountry: string;
  originalYear: string;
  replications: ReplicationAttempt[];
  successRate: number;
  avgAdaptation: 'full_copy' | 'modified' | 'heavily_adapted';
  keyLessons: string[];
  keyLessonsSv: string[];
}

export interface ReplicationAttempt {
  country: string;
  year: string;
  adaptationType: 'full_copy' | 'modified' | 'heavily_adapted';
  outcome: 'success' | 'partial' | 'failure';
  contextDifferences: string[];
}

// ═══════════════════════════════════════════════════════════════
// KNOWLEDGE ACCUMULATION
// ═══════════════════════════════════════════════════════════════

export interface KnowledgeScore {
  domain: LearningDomain;
  globalScore: number; // 0-100
  trend: 'accumulating' | 'stable' | 'eroding';
  strengthAreas: string[];
  weakAreas: string[];
  recentChanges: KnowledgeChange[];
}

export interface KnowledgeChange {
  date: string;
  type: 'confirmed' | 'falsified' | 'refined' | 'forgotten';
  description: string;
  descriptionSv: string;
  impactScore: number;
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

export const MOCK_LEARNING_PATTERNS: LearningPattern[] = [
  {
    id: 'clp-1',
    domain: 'economic_policy',
    title: 'Austerity During Recession',
    titleSv: 'Åtstramning under lågkonjunktur',
    description: 'Reducing government spending during economic downturns tends to deepen recessions.',
    descriptionSv: 'Att minska offentliga utgifter under ekonomiska nedgångar tenderar att fördjupa lågkonjunkturer.',
    firstObserved: '1930',
    timesRepeated: 12,
    timesLearned: 4,
    currentStatus: 'repeating',
    confidenceLevel: 0.85,
    geographicSpread: 'global',
    examples: [
      { country: 'Greece', year: '2010-2015', outcome: 'failure', description: 'Severe austerity led to 25% GDP decline', descriptionSv: 'Kraftig åtstramning ledde till 25% BNP-nedgång' },
      { country: 'USA', year: '2009', outcome: 'success', description: 'Stimulus prevented deeper recession', descriptionSv: 'Stimulans förhindrade djupare lågkonjunktur' },
    ],
  },
  {
    id: 'clp-2',
    domain: 'public_health',
    title: 'Early Pandemic Response',
    titleSv: 'Tidig pandemiberedskap',
    description: 'Early, aggressive containment measures reduce total harm from pandemics.',
    descriptionSv: 'Tidiga, aggressiva begränsningsåtgärder minskar total skada från pandemier.',
    firstObserved: '1918',
    timesRepeated: 5,
    timesLearned: 3,
    currentStatus: 'learning',
    confidenceLevel: 0.78,
    geographicSpread: 'global',
    examples: [
      { country: 'South Korea', year: '2020', outcome: 'success', description: 'Rapid testing and tracing controlled spread', descriptionSv: 'Snabb testning och spårning kontrollerade spridningen' },
    ],
  },
];

export const MOCK_REPEATED_MISTAKES: RepeatedMistake[] = [
  {
    id: 'rm-1',
    pattern: 'Housing bubble denial',
    patternSv: 'Förnekande av bostadsbubbla',
    occurrences: [
      { id: 'o1', location: 'Japan', date: '1991', severity: 9, outcome: 'Lost decade', outcomeSv: 'Förlorat decennium' },
      { id: 'o2', location: 'USA', date: '2008', severity: 10, outcome: 'Global financial crisis', outcomeSv: 'Global finanskris' },
      { id: 'o3', location: 'Spain', date: '2008', severity: 8, outcome: 'Banking collapse', outcomeSv: 'Bankkollaps' },
    ],
    avgTimeBetween: '8-15 years',
    lastOccurred: '2008',
    predictedRisk: 'medium',
    warningSignals: ['Rapid price increase', 'Debt-to-income ratios', 'Speculation metrics'],
    warningSignalsSv: ['Snabb prisökning', 'Skuld-till-inkomst-kvoter', 'Spekulationsmått'],
  },
];

export const COLLECTIVE_LEARNING_SYSTEM = {
  name: 'Collective Learning Tracker',
  acronym: 'CLT',
  version: '1.0',
  core_principle: CLT_CORE_PRINCIPLE,
  result: 'Synliggör mänsklighetens lärande – och var vi upprepar samma misstag.',
} as const;
