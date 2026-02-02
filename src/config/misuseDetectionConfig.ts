/**
 * MODULE — MISUSE DETECTION LAYER (MDL)
 * "När data används vilseledande i debatt, media eller politik"
 * 
 * Identifierar och flaggar när data presenteras vilseledande.
 */

// ═══════════════════════════════════════════════════════════════
// CORE PRINCIPLE
// ═══════════════════════════════════════════════════════════════

export const MDL_CORE_PRINCIPLE = {
  statement: 'Data kan vara korrekt och ändå vilseledande. Systemet identifierar hur.',
  statementEn: 'Data can be correct yet misleading. The system identifies how.',
  enforced: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// MISUSE TYPES
// ═══════════════════════════════════════════════════════════════

export type MisuseType = 
  | 'cherry_picking'
  | 'false_causation'
  | 'misleading_scale'
  | 'missing_context'
  | 'outdated_data'
  | 'incomparable_comparison'
  | 'survivorship_bias'
  | 'ecological_fallacy'
  | 'truncated_timeline';

export interface MisuseDefinition {
  type: MisuseType;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  severity: 'low' | 'medium' | 'high';
  commonSources: string[];
  detectionMethod: string;
}

export const MISUSE_DEFINITIONS: Record<MisuseType, MisuseDefinition> = {
  cherry_picking: {
    type: 'cherry_picking',
    name: 'Cherry Picking',
    nameSv: 'Selektivt urval',
    description: 'Selecting only data points that support a predetermined conclusion',
    descriptionSv: 'Att välja endast datapunkter som stödjer en förutbestämd slutsats',
    severity: 'high',
    commonSources: ['Political speeches', 'Opinion pieces', 'Social media'],
    detectionMethod: 'Compare shown data to full dataset',
  },
  false_causation: {
    type: 'false_causation',
    name: 'False Causation',
    nameSv: 'Falsk kausalitet',
    description: 'Claiming cause-effect relationship from correlation alone',
    descriptionSv: 'Att hävda orsakssamband från enbart korrelation',
    severity: 'high',
    commonSources: ['News headlines', 'Research summaries', 'Marketing'],
    detectionMethod: 'Check for controlled studies or confounders',
  },
  misleading_scale: {
    type: 'misleading_scale',
    name: 'Misleading Scale',
    nameSv: 'Vilseledande skala',
    description: 'Using axis manipulation to exaggerate or minimize changes',
    descriptionSv: 'Att använda axelmanipulation för att överdriva eller minimera förändringar',
    severity: 'medium',
    commonSources: ['Charts in media', 'Corporate reports', 'Presentations'],
    detectionMethod: 'Check if Y-axis starts at zero, proportionality',
  },
  missing_context: {
    type: 'missing_context',
    name: 'Missing Context',
    nameSv: 'Saknad kontext',
    description: 'Presenting data without essential background information',
    descriptionSv: 'Att presentera data utan nödvändig bakgrundsinformation',
    severity: 'medium',
    commonSources: ['Social media', 'Quick news', 'Infographics'],
    detectionMethod: 'Check for baseline, comparison groups, timeframe',
  },
  outdated_data: {
    type: 'outdated_data',
    name: 'Outdated Data',
    nameSv: 'Föråldrad data',
    description: 'Using old data to draw conclusions about current state',
    descriptionSv: 'Att använda gammal data för att dra slutsatser om nuläget',
    severity: 'medium',
    commonSources: ['Research citations', 'Policy debates', 'General claims'],
    detectionMethod: 'Check publication date vs claim date',
  },
  incomparable_comparison: {
    type: 'incomparable_comparison',
    name: 'Incomparable Comparison',
    nameSv: 'Ojämförbar jämförelse',
    description: 'Comparing entities with fundamentally different characteristics',
    descriptionSv: 'Att jämföra enheter med fundamentalt olika egenskaper',
    severity: 'high',
    commonSources: ['Country comparisons', 'Before/after claims', 'Benchmarking'],
    detectionMethod: 'Check structural similarity, definitions, methodology',
  },
  survivorship_bias: {
    type: 'survivorship_bias',
    name: 'Survivorship Bias',
    nameSv: 'Överlevnadsbias',
    description: 'Only looking at successes while ignoring failures',
    descriptionSv: 'Att endast titta på framgångar medan misslyckanden ignoreras',
    severity: 'high',
    commonSources: ['Success stories', 'Best practices', 'Investment advice'],
    detectionMethod: 'Ask: what about those who didnt succeed?',
  },
  ecological_fallacy: {
    type: 'ecological_fallacy',
    name: 'Ecological Fallacy',
    nameSv: 'Ekologisk felslutning',
    description: 'Applying group-level conclusions to individuals',
    descriptionSv: 'Att tillämpa gruppnivåslutsatser på individer',
    severity: 'medium',
    commonSources: ['Demographic analysis', 'Regional data', 'Surveys'],
    detectionMethod: 'Check if claim level matches data level',
  },
  truncated_timeline: {
    type: 'truncated_timeline',
    name: 'Truncated Timeline',
    nameSv: 'Avkortad tidslinje',
    description: 'Showing only a portion of time series to create false narrative',
    descriptionSv: 'Att visa endast en del av tidsserier för att skapa falsk berättelse',
    severity: 'high',
    commonSources: ['Market analysis', 'Trend claims', 'Progress reports'],
    detectionMethod: 'Request full historical data',
  },
};

// ═══════════════════════════════════════════════════════════════
// DETECTION RESULTS
// ═══════════════════════════════════════════════════════════════

export interface MisuseDetection {
  id: string;
  detectedAt: string;
  source: string;
  sourceType: 'media' | 'political' | 'academic' | 'corporate' | 'social';
  claim: string;
  claimSv: string;
  misuseTypes: MisuseType[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  explanationSv: string;
  correctVersion: string;
  correctVersionSv: string;
  dataUsed: string[];
  status: 'flagged' | 'verified' | 'disputed' | 'corrected';
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

export const MOCK_DETECTIONS: MisuseDetection[] = [
  {
    id: 'md-1',
    detectedAt: '2024-11-28',
    source: 'Exempeltidning',
    sourceType: 'media',
    claim: 'Country X has the fastest growing economy in Europe',
    claimSv: 'Land X har den snabbast växande ekonomin i Europa',
    misuseTypes: ['cherry_picking', 'truncated_timeline'],
    severity: 'high',
    explanation: 'The claim uses only Q2 2024 data, ignoring the overall yearly trend which shows average growth.',
    explanationSv: 'Påståendet använder endast Q2 2024-data och ignorerar den övergripande årliga trenden som visar genomsnittlig tillväxt.',
    correctVersion: 'Country X had the highest growth in Q2 2024, but yearly growth is at EU average.',
    correctVersionSv: 'Land X hade högst tillväxt under Q2 2024, men årstillväxten är på EU-genomsnittet.',
    dataUsed: ['GDP growth Q2 2024', 'GDP growth 2024 YTD'],
    status: 'flagged',
  },
  {
    id: 'md-2',
    detectedAt: '2024-11-25',
    source: 'Politisk debatt',
    sourceType: 'political',
    claim: 'Our policy reduced unemployment by 50%',
    claimSv: 'Vår politik minskade arbetslösheten med 50%',
    misuseTypes: ['false_causation', 'missing_context'],
    severity: 'high',
    explanation: 'Unemployment dropped during global economic recovery; similar drops occurred in countries without this policy.',
    explanationSv: 'Arbetslösheten sjönk under global ekonomisk återhämtning; liknande nedgångar skedde i länder utan denna politik.',
    correctVersion: 'Unemployment dropped 50% during a period of global recovery, with multiple contributing factors.',
    correctVersionSv: 'Arbetslösheten sjönk 50% under en period av global återhämtning, med flera bidragande faktorer.',
    dataUsed: ['Unemployment rate 2020-2024', 'EU comparison data'],
    status: 'verified',
  },
];

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const MISUSE_DETECTION_SYSTEM = {
  name: 'Misuse Detection Layer',
  acronym: 'MDL',
  version: '1.0',
  core_principle: MDL_CORE_PRINCIPLE,
  result: 'Identifierar när data presenteras vilseledande – utan att censurera.',
} as const;
