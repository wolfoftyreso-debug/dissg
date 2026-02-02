/**
 * MODULE — SYSTEM MEMORY & LONG ARC ARCHIVE (LAA)
 * "Sätt dagens händelser i ett 50–100-årigt sammanhang."
 * 
 * BLOCK XA–XI: Tidens ryggrad + Historical Pattern Archive
 * 
 * OBRYTBAR PRINCIP:
 * Utan historiskt djup ser varje våg ut som en tsunami.
 * Systemets jobb är att visa havet.
 */

// ═══════════════════════════════════════════════════════════════
// CORE PRINCIPLES (MERGED)
// ═══════════════════════════════════════════════════════════════

export const SMA_CORE_PRINCIPLE = {
  statement: 'Historia är inte det förflutna – det är mönster som riskerar att upprepas.',
  statementEn: 'History is not the past – it is patterns that risk being repeated.',
  enforced: true,
} as const;

export const LAA_CORE_PRINCIPLE = {
  systemQuestion: 'Hur passar dagens mönster in i längre historiska cykler, strukturella skiften och återkommande faser?',
  focus: 'proportion, kontinuitet, brytpunkter',
  statement: 'Utan historiskt djup ser varje våg ut som en tsunami. Systemets jobb är att visa havet.',
  statementSv: 'Utan historiskt djup ser varje våg ut som en tsunami. Systemets jobb är att visa havet.',
  enforced: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK XA — LONG ARC ENGINE
// ═══════════════════════════════════════════════════════════════

export type TimeBlock = '10y' | '25y' | '50y' | '100y';
export type HistoricalDomain = 'energy' | 'economy' | 'health' | 'demographics' | 'institutions' | 'education' | 'environment';

export const DOMAIN_LABELS: Record<HistoricalDomain, { en: string; sv: string }> = {
  energy: { en: 'Energy', sv: 'Energi' },
  economy: { en: 'Economy', sv: 'Ekonomi' },
  health: { en: 'Health', sv: 'Hälsa' },
  demographics: { en: 'Demographics', sv: 'Demografi' },
  institutions: { en: 'Institutions', sv: 'Institutioner' },
  education: { en: 'Education', sv: 'Utbildning' },
  environment: { en: 'Environment', sv: 'Miljö' },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK XB — STRUCTURAL PHASE DETECTION
// ═══════════════════════════════════════════════════════════════

export type StructuralPhase = 'expansion' | 'maturity' | 'overload' | 'transition' | 'reconstruction';

export interface PhaseDefinition {
  phase: StructuralPhase;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  typicalIndicators: string[];
  historicalExamples: string[];
}

export const PHASE_DEFINITIONS: Record<StructuralPhase, PhaseDefinition> = {
  expansion: {
    phase: 'expansion',
    name: 'Expansion',
    nameSv: 'Expansion',
    description: 'Period of growth, increasing capacity, and rising metrics across domains.',
    descriptionSv: 'Period av tillväxt, ökande kapacitet och stigande mätvärden över domäner.',
    typicalIndicators: ['Rising GDP', 'Population growth', 'Infrastructure investment'],
    historicalExamples: ['Post-WWII boom (1945-1970)', 'Digital expansion (1995-2015)'],
  },
  maturity: {
    phase: 'maturity',
    name: 'Maturity',
    nameSv: 'Mognad',
    description: 'Period of stabilization where growth slows and systems optimize.',
    descriptionSv: 'Period av stabilisering där tillväxt avtar och system optimeras.',
    typicalIndicators: ['Slower growth rates', 'Institutional consolidation', 'Efficiency focus'],
    historicalExamples: ['Late Victorian era', 'Post-2008 Western economies'],
  },
  overload: {
    phase: 'overload',
    name: 'Overload',
    nameSv: 'Överbelastning',
    description: 'Period where existing systems strain under accumulated pressures.',
    descriptionSv: 'Period där befintliga system belastas under ackumulerade påfrestningar.',
    typicalIndicators: ['Debt accumulation', 'Resource constraints', 'Institutional stress'],
    historicalExamples: ['1970s stagflation', 'Pre-2008 financial buildup'],
  },
  transition: {
    phase: 'transition',
    name: 'Transition',
    nameSv: 'Omställning',
    description: 'Period of active change from one system configuration to another.',
    descriptionSv: 'Period av aktiv förändring från en systemkonfiguration till en annan.',
    typicalIndicators: ['Rapid policy changes', 'Technology shifts', 'Institutional reform'],
    historicalExamples: ['Energy transitions', 'Post-communist transitions'],
  },
  reconstruction: {
    phase: 'reconstruction',
    name: 'Reconstruction',
    nameSv: 'Återuppbyggnad',
    description: 'Period of rebuilding after disruption or collapse.',
    descriptionSv: 'Period av återuppbyggnad efter störning eller kollaps.',
    typicalIndicators: ['Infrastructure investment', 'Institutional redesign', 'Population recovery'],
    historicalExamples: ['Post-WWII Marshall Plan era', 'Post-crisis financial reforms'],
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK XC — "THIS HAS HAPPENED BEFORE?"
// ═══════════════════════════════════════════════════════════════

export interface HistoricalParallel {
  id: string;
  currentSituation: string;
  currentSituationSv: string;
  historicalPeriods: {
    period: string;
    years: string;
    similarities: string[];
    differences: string[];
    outcome: string;
    outcomeSv: string;
  }[];
  conclusion: string;
  conclusionSv: string;
}

export const HISTORICAL_PARALLELS: HistoricalParallel[] = [
  {
    id: 'hp-1',
    currentSituation: 'Rapid inflation following supply disruption',
    currentSituationSv: 'Snabb inflation efter leveransstörning',
    historicalPeriods: [
      {
        period: '1970s Oil Crisis',
        years: '1973-1982',
        similarities: ['Supply-driven shock', 'Energy price spike', 'Global scope'],
        differences: ['Different monetary frameworks', 'Higher labor power then'],
        outcome: 'Inflation eventually controlled through aggressive monetary policy over ~10 years',
        outcomeSv: 'Inflationen kontrollerades slutligen genom aggressiv penningpolitik under ~10 år',
      },
    ],
    conclusion: 'Supply-driven inflation episodes historically resolve over 5-15 years with varied outcomes.',
    conclusionSv: 'Utbudsdriven inflation har historiskt lösts över 5-15 år med varierade utfall.',
  },
  {
    id: 'hp-2',
    currentSituation: 'Technology-driven labor market disruption',
    currentSituationSv: 'Teknikdriven arbetsmarknadsstörning',
    historicalPeriods: [
      {
        period: 'Industrial Revolution',
        years: '1760-1840',
        similarities: ['Automation concerns', 'Job displacement', 'Skill obsolescence'],
        differences: ['Slower pace', 'Different education systems'],
        outcome: 'Net job creation but with 2-3 generation transition period',
        outcomeSv: 'Nettoskapande av jobb men med 2-3 generationers övergångsperiod',
      },
    ],
    conclusion: 'Technology disruptions historically create long-term prosperity but with uneven distribution.',
    conclusionSv: 'Teknikstörningar har historiskt skapat långsiktig välstånd men med ojämn fördelning.',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK XD — SCALE NORMALIZATION VIEW
// ═══════════════════════════════════════════════════════════════

export interface ScaleNormalization {
  metric: string;
  metricSv: string;
  currentValue: number;
  historicalRange: { min: number; max: number; median: number; periodCovered: string };
  percentilePosition: number;
  isExceptional: boolean;
  interpretationSv: string;
}

export const SCALE_NORMALIZATIONS: ScaleNormalization[] = [
  {
    metric: 'Annual GDP growth volatility',
    metricSv: 'Årlig BNP-tillväxtvolatilitet',
    currentValue: 4.2,
    historicalRange: { min: 0.5, max: 12.3, median: 2.8, periodCovered: '1870-2024' },
    percentilePosition: 72,
    isExceptional: false,
    interpretationSv: 'Denna förändring ligger i övre 28% av observerad historisk variation.',
  },
  {
    metric: 'Energy transition speed',
    metricSv: 'Energiomställningshastighet',
    currentValue: 3.2,
    historicalRange: { min: 0.2, max: 2.1, median: 0.8, periodCovered: '1850-2024' },
    percentilePosition: 95,
    isExceptional: true,
    interpretationSv: 'Den nuvarande energiomställningen är genuint snabbare än något tidigare skiftet.',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK XE — NARRATIVE DRIFT TRACKER
// ═══════════════════════════════════════════════════════════════

export interface NarrativeDrift {
  topic: string;
  topicSv: string;
  periods: { era: string; years: string; typicalLanguage: string[]; dramaticIntensity: number; actualSeverity: number }[];
  drift: 'increasing_dramatization' | 'stable' | 'decreasing_dramatization';
  insightSv: string;
}

export const NARRATIVE_DRIFTS: NarrativeDrift[] = [
  {
    topic: 'Economic recession coverage',
    topicSv: 'Recession-bevakning',
    periods: [
      { era: '1970s', years: '1970-1979', typicalLanguage: ['downturn', 'slowdown'], dramaticIntensity: 4, actualSeverity: 6 },
      { era: '2020s', years: '2020-2024', typicalLanguage: ['catastrophe', 'historic crisis'], dramaticIntensity: 9, actualSeverity: 5 },
    ],
    drift: 'increasing_dramatization',
    insightSv: 'Språkintensiteten har ökat snabbare än faktisk ekonomisk svårighet.',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK XF — GENERATIONAL MEMORY VIEW
// ═══════════════════════════════════════════════════════════════

export interface GenerationalView {
  generationName: string;
  birthYears: string;
  formativeYears: string;
  majorEventsExperienced: string[];
  majorEventsNotExperienced: string[];
  likelyPerspectiveSv: string;
}

export const GENERATIONAL_VIEWS: GenerationalView[] = [
  {
    generationName: 'Baby Boomers',
    birthYears: '1946-1964',
    formativeYears: '1960-1980',
    majorEventsExperienced: ['Vietnam War', '1970s oil crisis', 'Cold War'],
    majorEventsNotExperienced: ['WWII (directly)', 'Digital native experience'],
    likelyPerspectiveSv: 'Referenspunkt är expansion och optimism.',
  },
  {
    generationName: 'Millennials',
    birthYears: '1981-1996',
    formativeYears: '2000-2020',
    majorEventsExperienced: ['9/11', 'Great Recession', 'COVID-19'],
    majorEventsNotExperienced: ['Cold War', 'Pre-digital era'],
    likelyPerspectiveSv: 'Referenspunkt inkluderar större störningar. Kan förvänta sig instabilitet.',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK XG — "WHAT IS ACTUALLY NEW?"
// ═══════════════════════════════════════════════════════════════

export type NoveltyType = 'new_scale' | 'new_speed' | 'new_combination' | 'new_scope';

export interface GenuineNovelty {
  phenomenon: string;
  phenomenonSv: string;
  noveltyTypes: NoveltyType[];
  whyNewSv: string;
  whatIsNotNewSv: string;
  implicationsSv: string[];
  confidence: number;
}

export const GENUINE_NOVELTIES: GenuineNovelty[] = [
  {
    phenomenon: 'AI capability jump (2020s)',
    phenomenonSv: 'AI-kapacitetssprång (2020-tal)',
    noveltyTypes: ['new_speed', 'new_combination'],
    whyNewSv: 'Förbättringstakten och bredden av tillämpning överstiger tidigare automatiseringsvågor.',
    whatIsNotNewSv: 'Automationsoro, arbetsdisplacering, produktivitetsvinster.',
    implicationsSv: ['Arbetsmarknadsomstrukturering', 'Kognitiv arbetets transformation'],
    confidence: 85,
  },
  {
    phenomenon: 'Global information instantaneity',
    phenomenonSv: 'Global informationsinstantanitet',
    noveltyTypes: ['new_speed', 'new_scope'],
    whyNewSv: 'Realtids global informationsflöde på befolkningsskala är historiskt utan motstycke.',
    whatIsNotNewSv: 'Informationsnätverk, nyhetscykler, social koordination.',
    implicationsSv: ['Uppmärksamhetsekonomiska effekter', 'Narrativhastighet'],
    confidence: 95,
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK XH — ARCHIVAL INTEGRITY
// ═══════════════════════════════════════════════════════════════

export interface ArchivalIntegrity {
  datasetNameSv: string;
  periodCovered: string;
  sources: string[];
  knownMethodologyBreaks: { year: number; descriptionSv: string; impact: 'minor' | 'moderate' | 'significant' }[];
  confidence: number;
}

export const ARCHIVAL_INTEGRITY_SAMPLES: ArchivalIntegrity[] = [
  {
    datasetNameSv: 'Historisk BNP-serie',
    periodCovered: '1870-2024',
    sources: ['Maddison Project', 'World Bank', 'National statistics'],
    knownMethodologyBreaks: [
      { year: 1945, descriptionSv: 'Efterkrigstids statistisk rekonstruktion', impact: 'moderate' },
      { year: 2008, descriptionSv: 'Uppdatering av mätning av digital ekonomi', impact: 'moderate' },
    ],
    confidence: 78,
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK XI — LONG VIEW WIDGET
// ═══════════════════════════════════════════════════════════════

export type LongViewStatus = 'stable_cycle' | 'breakpoint' | 'transition_phase' | 'uncertain';

export interface LongViewSummary {
  overallStatus: LongViewStatus;
  statusLabelSv: string;
  shortDescriptionSv: string;
  keyDomainPhases: { domain: HistoricalDomain; phase: StructuralPhase; confidence: number }[];
  lastUpdated: string;
}

export const CURRENT_LONG_VIEW: LongViewSummary = {
  overallStatus: 'transition_phase',
  statusLabelSv: 'Övergångsfas',
  shortDescriptionSv: 'Flera domäner visar övergångskaraktäristika. Energi och teknologi i aktivt skifte, ekonomi i sencykel.',
  keyDomainPhases: [
    { domain: 'energy', phase: 'transition', confidence: 85 },
    { domain: 'economy', phase: 'overload', confidence: 72 },
    { domain: 'demographics', phase: 'maturity', confidence: 90 },
    { domain: 'institutions', phase: 'overload', confidence: 68 },
  ],
  lastUpdated: '2024-12-01',
};

// ═══════════════════════════════════════════════════════════════
// HISTORICAL PATTERNS (ORIGINAL SMA)
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
  severity: number;
  outcome: string;
  outcomeSv: string;
  keyFactors: string[];
  keyFactorsSv: string[];
}

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
      keyFactors: ['High interest rates', 'Commodity price drops'],
      keyFactorsSv: ['Höga räntor', 'Råvaruprisfall'],
    },
    subsequentInstances: [
      {
        id: 'hi-3',
        location: 'Eurozone',
        startYear: '2010',
        endYear: '2015',
        severity: 8,
        outcome: 'Euro crisis, austerity, political instability',
        outcomeSv: 'Eurokris, åtstramning, politisk instabilitet',
        keyFactors: ['Monetary union without fiscal union', 'Banking exposure'],
        keyFactorsSv: ['Monetär union utan fiskal union', 'Bankexponering'],
      },
    ],
    averageCycleYears: 12,
    warningIndicators: ['Debt-to-GDP above 100%', 'Current account deficits'],
    warningIndicatorsSv: ['Skuld-till-BNP över 100%', 'Bytesbalansunderskott'],
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
    actualCause: 'Systemic risks were visible in housing data years before',
    actualCauseSv: 'Systemiska risker var synliga i bostadsdata år innan',
    howLongToCorrect: '2-3 years',
    lessonsLearned: ['Warning signs existed', 'Complexity hides risk'],
    lessonsLearnedSv: ['Varningssignaler fanns', 'Komplexitet döljer risk'],
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
    actualResult: 'Growth continued, but model timing was off',
    actualResultSv: 'Tillväxten fortsatte, men modellens timing var fel',
    lessonsForForecasting: 'Complex systems adapt; timing is harder than direction',
    lessonsForForecastingSv: 'Komplexa system anpassar sig; timing är svårare än riktning',
  },
];

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const SYSTEM_MEMORY_ARCHIVE = {
  name: 'System Memory & Long Arc Archive',
  acronym: 'LAA',
  version: '2.0',
  blocks: ['XA', 'XB', 'XC', 'XD', 'XE', 'XF', 'XG', 'XH', 'XI'],
  core_principle: LAA_CORE_PRINCIPLE,
  result: 'Ger historiskt djup så att dagens händelser kan bedömas i 50–100 års perspektiv.',
} as const;
