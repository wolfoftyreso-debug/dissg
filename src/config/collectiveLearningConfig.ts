/**
 * MODULE — COLLECTIVE LEARNING TRACKER (CLT)
 * "Vad har världen lärt sig – och vad upprepar den?"
 * 
 * Systemets långminne. Inte moral. Inte skuld.
 * Observerad förändring i beteende, fokus och resultat över tid.
 */

// ═══════════════════════════════════════════════════════════════
// CORE PRINCIPLE
// ═══════════════════════════════════════════════════════════════

export const CLT_CORE_PRINCIPLE = {
  statement: 'Lärande mäts i förändrat beteende och utfall – inte i ambitioner.',
  statementEn: 'Learning is measured in changed behavior and outcomes – not in ambitions.',
  systemQuestion: 'När liknande situationer uppstår över tid, förändras beteenden, beslut och utfall – eller upprepas samma mönster?',
  systemQuestionEn: 'When similar situations arise over time, do behaviors, decisions and outcomes change – or are the same patterns repeated?',
  enforced: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK UA — PATTERN MEMORY ENGINE
// ═══════════════════════════════════════════════════════════════

export type PatternCategory = 
  | 'crisis_response'
  | 'reform_cycle'
  | 'policy_wave'
  | 'attention_wave'
  | 'warning_to_action';

export interface HistoricalPattern {
  id: string;
  code: string;
  category: PatternCategory;
  title: string;
  titleSv: string;
  description: string;
  descriptionSv: string;
  firstObserved: string;
  occurrences: PatternOccurrence[];
  situationType: string;
  situationTypeSv: string;
}

export interface PatternOccurrence {
  id: string;
  location: string;
  period: string;
  triggerEvent: string;
  triggerEventSv: string;
  responseType: string;
  responseTypeSv: string;
  outcome: string;
  outcomeSv: string;
  recognitionSpeedDays: number;
  learningClassification: LearningClassification;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK UB — LEARNING SIGNALS
// ═══════════════════════════════════════════════════════════════

export interface LearningSignals {
  patternId: string;
  recognitionSpeed: SignalMeasurement;
  responseChange: SignalMeasurement;
  outcomeShift: SignalMeasurement;
  narrativeEvolution: SignalMeasurement;
}

export interface SignalMeasurement {
  currentValue: number;
  historicalAverage: number;
  trend: 'improving' | 'stable' | 'declining';
  comparisonText: string;
  comparisonTextSv: string;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK UC — LEARNING CLASSIFICATION
// ═══════════════════════════════════════════════════════════════

export type LearningClassification = 
  | 'adaptive'
  | 'partial'
  | 'stagnation'
  | 'regression';

export const LEARNING_CLASSIFICATION_LABELS: Record<LearningClassification, { en: string; sv: string; description: string; descriptionSv: string }> = {
  adaptive: {
    en: 'Adaptive Learning',
    sv: 'Adaptiv inlärning',
    description: 'Behavior changes, outcome improves',
    descriptionSv: 'Beteende ändras, utfall förbättras',
  },
  partial: {
    en: 'Partial Learning',
    sv: 'Partiell inlärning',
    description: 'Problem recognized but not solved',
    descriptionSv: 'Problemet känns igen men löses inte',
  },
  stagnation: {
    en: 'Stagnation',
    sv: 'Stagnation',
    description: 'Same response, same outcome',
    descriptionSv: 'Samma respons, samma utfall',
  },
  regression: {
    en: 'Regression',
    sv: 'Regression',
    description: 'Worse response over time',
    descriptionSv: 'Sämre respons över tid',
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK UD — GLOBAL LEARNING DASHBOARD
// ═══════════════════════════════════════════════════════════════

export type LearningDomain = 
  | 'energy'
  | 'health'
  | 'economy'
  | 'environment'
  | 'governance'
  | 'technology'
  | 'social';

export interface DomainLearningStatus {
  domain: LearningDomain;
  domainName: string;
  domainNameSv: string;
  learningScore: number;
  trend: 'improving' | 'stable' | 'declining';
  timespan: string;
  keyPatterns: string[];
  regionalVariation: RegionalVariation[];
}

export interface RegionalVariation {
  region: string;
  regionSv: string;
  deviation: number;
  note: string;
  noteSv: string;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK UE — "WHAT WE KEEP REPEATING"
// ═══════════════════════════════════════════════════════════════

export interface RepeatedPattern {
  id: string;
  pattern: string;
  patternSv: string;
  occurrenceCount: number;
  domains: LearningDomain[];
  examples: RepeatedExample[];
  rootCauses: string[];
  rootCausesSv: string[];
  noImprovementObserved: boolean;
}

export interface RepeatedExample {
  period: string;
  location: string;
  description: string;
  descriptionSv: string;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK UF — SCIENCE vs ACTION GAP
// ═══════════════════════════════════════════════════════════════

export interface ScienceActionGap {
  id: string;
  topic: string;
  topicSv: string;
  scientificConsensusYear: string;
  consensusDescription: string;
  consensusDescriptionSv: string;
  firstMajorActionYear: string | null;
  actionDescription: string | null;
  actionDescriptionSv: string | null;
  gapYears: number | null;
  status: 'acted' | 'partial_action' | 'no_action';
  ongoingGap: boolean;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK UG — POSITIVE DEVIATION
// ═══════════════════════════════════════════════════════════════

export interface PositiveDeviation {
  id: string;
  title: string;
  titleSv: string;
  description: string;
  descriptionSv: string;
  domain: LearningDomain;
  historicalAverageLag: number;
  actualLag: number;
  improvementFactor: number;
  enablingFactors: string[];
  enablingFactorsSv: string[];
  structuralConditions: string[];
  structuralConditionsSv: string[];
}

// ═══════════════════════════════════════════════════════════════
// BLOCK UH — LEARNING vs ATTENTION
// ═══════════════════════════════════════════════════════════════

export type AttentionLearningQuadrant = 
  | 'high_attention_high_learning'
  | 'high_attention_low_learning'
  | 'low_attention_high_learning'
  | 'low_attention_low_learning';

export interface AttentionLearningItem {
  id: string;
  topic: string;
  topicSv: string;
  attentionScore: number;
  learningScore: number;
  quadrant: AttentionLearningQuadrant;
  interpretation: string;
  interpretationSv: string;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK UI — COLLECTIVE MEMORY WIDGET
// ═══════════════════════════════════════════════════════════════

export interface CollectiveMemoryStatus {
  overallTrend: 'improving' | 'stable' | 'declining';
  patternAwareness: number;
  lastUpdated: string;
  keyInsight: string;
  keyInsightSv: string;
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

export const MOCK_PATTERNS: HistoricalPattern[] = [
  {
    id: 'hp-1',
    code: 'CRISIS-DELAY',
    category: 'crisis_response',
    title: 'Delayed Crisis Response',
    titleSv: 'Försenad krisrespons',
    description: 'Pattern of delayed response to slow-building crises',
    descriptionSv: 'Mönster av försenad respons på långsamt byggande kriser',
    firstObserved: '1930s',
    situationType: 'Slow-onset systemic risk',
    situationTypeSv: 'Långsam systemisk risk',
    occurrences: [
      {
        id: 'o1',
        location: 'Global',
        period: '2007-2008',
        triggerEvent: 'Financial system instability',
        triggerEventSv: 'Finansiell systeminstabilitet',
        responseType: 'Reactive bailouts',
        responseTypeSv: 'Reaktiva räddningspaket',
        outcome: 'Crisis contained but repeated pattern',
        outcomeSv: 'Krisen begränsades men mönstret upprepades',
        recognitionSpeedDays: 540,
        learningClassification: 'partial',
      },
      {
        id: 'o2',
        location: 'Europe',
        period: '2010-2012',
        triggerEvent: 'Sovereign debt accumulation',
        triggerEventSv: 'Statsskuldsackumulering',
        responseType: 'Delayed coordinated response',
        responseTypeSv: 'Försenad koordinerad respons',
        outcome: 'Prolonged crisis, political instability',
        outcomeSv: 'Utdragen kris, politisk instabilitet',
        recognitionSpeedDays: 720,
        learningClassification: 'stagnation',
      },
    ],
  },
  {
    id: 'hp-2',
    code: 'PANDEMIC-PREP',
    category: 'warning_to_action',
    title: 'Pandemic Preparedness Gap',
    titleSv: 'Pandemiberedskapsgap',
    description: 'Gap between warning and actual preparation',
    descriptionSv: 'Gap mellan varning och faktisk förberedelse',
    firstObserved: '1918',
    situationType: 'Known but underestimated risk',
    situationTypeSv: 'Känd men underskattad risk',
    occurrences: [
      {
        id: 'o3',
        location: 'Global',
        period: '2002-2003',
        triggerEvent: 'SARS outbreak',
        triggerEventSv: 'SARS-utbrott',
        responseType: 'Rapid containment, some preparation',
        responseTypeSv: 'Snabb begränsning, viss förberedelse',
        outcome: 'Contained, but preparation faded',
        outcomeSv: 'Begränsad, men förberedelse avtog',
        recognitionSpeedDays: 90,
        learningClassification: 'partial',
      },
      {
        id: 'o4',
        location: 'Global',
        period: '2020',
        triggerEvent: 'COVID-19 pandemic',
        triggerEventSv: 'COVID-19-pandemi',
        responseType: 'Variable, often delayed',
        responseTypeSv: 'Varierande, ofta försenad',
        outcome: 'Major global impact despite warnings',
        outcomeSv: 'Stor global påverkan trots varningar',
        recognitionSpeedDays: 60,
        learningClassification: 'partial',
      },
    ],
  },
];

export const MOCK_DOMAIN_STATUS: DomainLearningStatus[] = [
  {
    domain: 'health',
    domainName: 'Public Health',
    domainNameSv: 'Folkhälsa',
    learningScore: 62,
    trend: 'improving',
    timespan: '1950-2024',
    keyPatterns: ['Vaccination adoption', 'Pandemic response'],
    regionalVariation: [
      { region: 'Northern Europe', regionSv: 'Nordeuropa', deviation: 12, note: 'Strong public health systems', noteSv: 'Starka folkhälsosystem' },
      { region: 'Sub-Saharan Africa', regionSv: 'Afrika söder om Sahara', deviation: -18, note: 'Resource constraints', noteSv: 'Resursbegränsningar' },
    ],
  },
  {
    domain: 'economy',
    domainName: 'Economic Policy',
    domainNameSv: 'Ekonomisk politik',
    learningScore: 45,
    trend: 'stable',
    timespan: '1970-2024',
    keyPatterns: ['Crisis response cycles', 'Debt management'],
    regionalVariation: [
      { region: 'East Asia', regionSv: 'Östasien', deviation: 8, note: 'Post-1997 reforms', noteSv: 'Reformer efter 1997' },
    ],
  },
  {
    domain: 'environment',
    domainName: 'Environmental',
    domainNameSv: 'Miljö',
    learningScore: 38,
    trend: 'stable',
    timespan: '1970-2024',
    keyPatterns: ['Ozone response', 'Climate action gap'],
    regionalVariation: [],
  },
  {
    domain: 'governance',
    domainName: 'Governance',
    domainNameSv: 'Styrning',
    learningScore: 51,
    trend: 'declining',
    timespan: '1990-2024',
    keyPatterns: ['Democratic backsliding', 'Institutional erosion'],
    regionalVariation: [],
  },
  {
    domain: 'technology',
    domainName: 'Technology',
    domainNameSv: 'Teknologi',
    learningScore: 71,
    trend: 'improving',
    timespan: '1980-2024',
    keyPatterns: ['Rapid adoption', 'Unintended consequences'],
    regionalVariation: [],
  },
];

export const MOCK_REPEATED_PATTERNS: RepeatedPattern[] = [
  {
    id: 'rp-1',
    pattern: 'Late reaction to slow-building risks',
    patternSv: 'Sen reaktion på långsamt växande risker',
    occurrenceCount: 8,
    domains: ['economy', 'environment', 'health'],
    examples: [
      { period: '2008', location: 'Global', description: 'Financial crisis signals ignored', descriptionSv: 'Finanskrisens signaler ignorerades' },
      { period: '2020', location: 'Global', description: 'Pandemic warnings underacted', descriptionSv: 'Pandemivarningar underagerades' },
    ],
    rootCauses: ['Short-term incentives', 'Optimism bias', 'Diffuse responsibility'],
    rootCausesSv: ['Kortsiktiga incitament', 'Optimism-bias', 'Diffust ansvar'],
    noImprovementObserved: true,
  },
  {
    id: 'rp-2',
    pattern: 'Underestimation of exponential growth',
    patternSv: 'Underskattning av exponentiell tillväxt',
    occurrenceCount: 6,
    domains: ['health', 'technology', 'environment'],
    examples: [
      { period: 'Early 2020', location: 'Europe/US', description: 'COVID-19 spread underestimated', descriptionSv: 'COVID-19-spridning underskattades' },
    ],
    rootCauses: ['Linear mental models', 'Lack of systems thinking'],
    rootCausesSv: ['Linjära mentala modeller', 'Brist på systemtänkande'],
    noImprovementObserved: true,
  },
  {
    id: 'rp-3',
    pattern: 'Overfocus on short-term relief',
    patternSv: 'Överfokus på kortsiktig lindring',
    occurrenceCount: 12,
    domains: ['economy', 'social', 'governance'],
    examples: [
      { period: '2010-2015', location: 'Eurozone', description: 'Austerity prioritized over structural reform', descriptionSv: 'Åtstramning prioriterades över strukturell reform' },
    ],
    rootCauses: ['Electoral cycles', 'Visible vs invisible outcomes'],
    rootCausesSv: ['Valcykler', 'Synliga vs osynliga utfall'],
    noImprovementObserved: false,
  },
];

export const MOCK_SCIENCE_GAPS: ScienceActionGap[] = [
  {
    id: 'sg-1',
    topic: 'Tobacco and Cancer',
    topicSv: 'Tobak och cancer',
    scientificConsensusYear: '1964',
    consensusDescription: 'US Surgeon General report confirmed link',
    consensusDescriptionSv: 'US Surgeon General-rapport bekräftade samband',
    firstMajorActionYear: '1998',
    actionDescription: 'Master Settlement Agreement in US',
    actionDescriptionSv: 'Master Settlement Agreement i USA',
    gapYears: 34,
    status: 'acted',
    ongoingGap: false,
  },
  {
    id: 'sg-2',
    topic: 'Ozone Depletion',
    topicSv: 'Ozonnedbrytning',
    scientificConsensusYear: '1976',
    consensusDescription: 'CFCs identified as cause',
    consensusDescriptionSv: 'CFC identifierades som orsak',
    firstMajorActionYear: '1987',
    actionDescription: 'Montreal Protocol signed',
    actionDescriptionSv: 'Montrealprotokollet undertecknades',
    gapYears: 11,
    status: 'acted',
    ongoingGap: false,
  },
  {
    id: 'sg-3',
    topic: 'Climate Change',
    topicSv: 'Klimatförändring',
    scientificConsensusYear: '1990',
    consensusDescription: 'IPCC First Assessment Report',
    consensusDescriptionSv: 'IPCC:s första utvärderingsrapport',
    firstMajorActionYear: '2015',
    actionDescription: 'Paris Agreement',
    actionDescriptionSv: 'Parisavtalet',
    gapYears: 25,
    status: 'partial_action',
    ongoingGap: true,
  },
  {
    id: 'sg-4',
    topic: 'Antibiotic Resistance',
    topicSv: 'Antibiotikaresistens',
    scientificConsensusYear: '1990s',
    consensusDescription: 'Growing resistance patterns documented',
    consensusDescriptionSv: 'Växande resistensmönster dokumenterade',
    firstMajorActionYear: null,
    actionDescription: null,
    actionDescriptionSv: null,
    gapYears: null,
    status: 'no_action',
    ongoingGap: true,
  },
];

export const MOCK_POSITIVE_DEVIATIONS: PositiveDeviation[] = [
  {
    id: 'pd-1',
    title: 'Ozone Layer Recovery',
    titleSv: 'Ozonlagrets återhämtning',
    description: 'Faster-than-average response to scientific warning',
    descriptionSv: 'Snabbare än genomsnittlig respons på vetenskaplig varning',
    domain: 'environment',
    historicalAverageLag: 25,
    actualLag: 11,
    improvementFactor: 2.3,
    enablingFactors: ['Clear causation', 'Available alternatives', 'Industry cooperation'],
    enablingFactorsSv: ['Tydligt orsakssamband', 'Tillgängliga alternativ', 'Branschsamarbete'],
    structuralConditions: ['Limited number of producers', 'Non-essential consumer product', 'Global coordination mechanism'],
    structuralConditionsSv: ['Begränsat antal producenter', 'Icke-essentiell konsumentprodukt', 'Global koordineringsmekanism'],
  },
  {
    id: 'pd-2',
    title: 'COVID-19 Vaccine Development',
    titleSv: 'COVID-19-vaccinutveckling',
    description: 'Record-breaking vaccine development timeline',
    descriptionSv: 'Rekordslagen vaccinutvecklingstidslinje',
    domain: 'health',
    historicalAverageLag: 120,
    actualLag: 11,
    improvementFactor: 11,
    enablingFactors: ['Prior mRNA research', 'Global urgency', 'Unprecedented funding'],
    enablingFactorsSv: ['Tidigare mRNA-forskning', 'Global brådska', 'Oöverträffad finansiering'],
    structuralConditions: ['Pre-existing platform technology', 'Regulatory flexibility', 'Global manufacturing capacity'],
    structuralConditionsSv: ['Befintlig plattformsteknologi', 'Regulatorisk flexibilitet', 'Global tillverkningskapacitet'],
  },
];

export const MOCK_ATTENTION_LEARNING: AttentionLearningItem[] = [
  {
    id: 'al-1',
    topic: 'Climate Policy',
    topicSv: 'Klimatpolitik',
    attentionScore: 85,
    learningScore: 32,
    quadrant: 'high_attention_low_learning',
    interpretation: 'High public discourse, limited behavioral change',
    interpretationSv: 'Hög offentlig diskurs, begränsad beteendeförändring',
  },
  {
    id: 'al-2',
    topic: 'Childhood Vaccination',
    topicSv: 'Barnvaccination',
    attentionScore: 35,
    learningScore: 78,
    quadrant: 'low_attention_high_learning',
    interpretation: 'Quiet progress through institutional learning',
    interpretationSv: 'Tyst framsteg genom institutionellt lärande',
  },
  {
    id: 'al-3',
    topic: 'Antibiotic Stewardship',
    topicSv: 'Antibiotikaförvaltning',
    attentionScore: 22,
    learningScore: 28,
    quadrant: 'low_attention_low_learning',
    interpretation: 'Neglected issue with limited action',
    interpretationSv: 'Försummat problem med begränsad åtgärd',
  },
  {
    id: 'al-4',
    topic: 'Traffic Safety',
    topicSv: 'Trafiksäkerhet',
    attentionScore: 55,
    learningScore: 72,
    quadrant: 'high_attention_high_learning',
    interpretation: 'Sustained attention with measurable improvements',
    interpretationSv: 'Ihållande uppmärksamhet med mätbara förbättringar',
  },
];

export const MOCK_COLLECTIVE_MEMORY: CollectiveMemoryStatus = {
  overallTrend: 'stable',
  patternAwareness: 54,
  lastUpdated: '2024-11-28',
  keyInsight: 'Recognition of problems has improved, but response speed remains unchanged.',
  keyInsightSv: 'Igenkänning av problem har förbättrats, men responshastighet förblir oförändrad.',
};

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const COLLECTIVE_LEARNING_SYSTEM = {
  name: 'Collective Learning Tracker',
  acronym: 'CLT',
  version: '2.0',
  core_principle: CLT_CORE_PRINCIPLE,
  result: 'Civilisationens minne, byggt på data – inte åsikt.',
} as const;
