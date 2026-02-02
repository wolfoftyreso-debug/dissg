/**
 * MODULE — MISUSE DETECTION LAYER (MDL)
 * "När data används vilseledande i debatt, media eller politik"
 * 
 * BLOCK VA–VI: Fullständigt skyddslager för dataintegritet
 * 
 * OBRYTBAR PRINCIP:
 * Systemet försvarar kontext, inte narrativ.
 * Det skyddar förståelse, inte positioner.
 */

// ═══════════════════════════════════════════════════════════════
// CORE PRINCIPLE (OBRYTBAR)
// ═══════════════════════════════════════════════════════════════

export const MDL_CORE_PRINCIPLE = {
  systemQuestion: 'När och hur används korrekt data på sätt som bryter mot dess kontext, begränsningar eller metod?',
  focus: 'användning, inte innehåll',
  statement: 'Data kan vara korrekt och ändå vilseledande. Systemet identifierar hur.',
  statementEn: 'Data can be correct yet misleading. The system identifies how.',
  enforced: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK VA — MISUSE PATTERN ENGINE
// Identifiera kända sätt data missbrukas på
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
  | 'truncated_timeline'
  | 'removed_uncertainty'
  | 'extreme_as_norm'
  | 'visual_exaggeration';

export interface MisuseDefinition {
  type: MisuseType;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  severity: 'low' | 'medium' | 'high';
  commonSources: string[];
  detectionMethod: string;
  examplePattern: string;
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
    examplePattern: 'Endast gynnsamma perioder visas',
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
    examplePattern: 'Sammanblandning av korrelation och orsak',
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
    examplePattern: 'Grafik som överdriver skillnader',
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
    examplePattern: 'Borttagen metod eller osäkerhet',
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
    examplePattern: 'Data från annat årtionde citeras som aktuell',
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
    examplePattern: 'Selektiv jämförelse (fel referensgrupp)',
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
    examplePattern: 'Endast överlevare i analysen',
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
    examplePattern: 'Gruppdata applicerad på individ',
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
    examplePattern: 'Endast gynnsam period visas',
  },
  removed_uncertainty: {
    type: 'removed_uncertainty',
    name: 'Removed Uncertainty',
    nameSv: 'Borttagen osäkerhet',
    description: 'Presenting uncertain data as definitive facts',
    descriptionSv: 'Att presentera osäker data som definitiva fakta',
    severity: 'high',
    commonSources: ['Forecasts', 'Projections', 'Model outputs'],
    detectionMethod: 'Check for confidence intervals, margins of error',
    examplePattern: 'Prognos presenterad som faktum',
  },
  extreme_as_norm: {
    type: 'extreme_as_norm',
    name: 'Extreme as Norm',
    nameSv: 'Extrem som norm',
    description: 'Using extreme data points as representative examples',
    descriptionSv: 'Att använda extrema datapunkter som representativa exempel',
    severity: 'medium',
    commonSources: ['Anecdotes', 'Case studies', 'News stories'],
    detectionMethod: 'Check distribution, compare to median/average',
    examplePattern: 'Outlier presenterad som typisk',
  },
  visual_exaggeration: {
    type: 'visual_exaggeration',
    name: 'Visual Exaggeration',
    nameSv: 'Visuell överdrift',
    description: 'Design choices that amplify perceived differences',
    descriptionSv: 'Designval som förstärker upplevda skillnader',
    severity: 'medium',
    commonSources: ['Infographics', 'Charts', 'Maps'],
    detectionMethod: 'Check proportionality of visual elements to data',
    examplePattern: '3D-grafer, brutna axlar, disproportionella ikoner',
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK VB — CONTEXT LOSS DETECTOR
// Jämför extern presentation vs korrekt presentation
// ═══════════════════════════════════════════════════════════════

export interface ContextLossAnalysis {
  id: string;
  externalPresentation: string;
  correctPresentation: string;
  lostElements: ContextElement[];
  contextLossScore: number; // 0-100
  impactLevel: 'minor' | 'significant' | 'severe';
}

export type ContextElement = 
  | 'timeline'
  | 'methodology'
  | 'uncertainty'
  | 'scale'
  | 'comparison_group'
  | 'definition'
  | 'sample_size'
  | 'geographic_scope'
  | 'temporal_scope'
  | 'confounders';

export const CONTEXT_ELEMENTS: Record<ContextElement, { 
  name: string; 
  nameSv: string; 
  criticalFor: MisuseType[] 
}> = {
  timeline: {
    name: 'Timeline',
    nameSv: 'Tidsaxel',
    criticalFor: ['truncated_timeline', 'cherry_picking'],
  },
  methodology: {
    name: 'Methodology',
    nameSv: 'Metod',
    criticalFor: ['incomparable_comparison', 'false_causation'],
  },
  uncertainty: {
    name: 'Uncertainty',
    nameSv: 'Osäkerhet',
    criticalFor: ['removed_uncertainty', 'false_causation'],
  },
  scale: {
    name: 'Scale',
    nameSv: 'Skala',
    criticalFor: ['misleading_scale', 'visual_exaggeration'],
  },
  comparison_group: {
    name: 'Comparison Group',
    nameSv: 'Jämförelsegrupp',
    criticalFor: ['incomparable_comparison', 'cherry_picking'],
  },
  definition: {
    name: 'Definition',
    nameSv: 'Definition',
    criticalFor: ['incomparable_comparison', 'ecological_fallacy'],
  },
  sample_size: {
    name: 'Sample Size',
    nameSv: 'Urvalsstorlek',
    criticalFor: ['extreme_as_norm', 'survivorship_bias'],
  },
  geographic_scope: {
    name: 'Geographic Scope',
    nameSv: 'Geografisk avgränsning',
    criticalFor: ['cherry_picking', 'ecological_fallacy'],
  },
  temporal_scope: {
    name: 'Temporal Scope',
    nameSv: 'Tidsavgränsning',
    criticalFor: ['truncated_timeline', 'outdated_data'],
  },
  confounders: {
    name: 'Confounding Factors',
    nameSv: 'Störfaktorer',
    criticalFor: ['false_causation', 'missing_context'],
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK VC — CLAIM vs DATA ALIGNMENT
// Hur väl stöds påståenden av refererad data?
// ═══════════════════════════════════════════════════════════════

export type ClaimAlignment = 
  | 'supported'           // Påståendet stöds av datan
  | 'partially_supported' // Delvis stöd
  | 'overstretched'       // Sträckt bortom vad datan visar
  | 'unsupported'         // Inget stöd
  | 'contradicted';       // Motsägs av datan

export interface ClaimAnalysis {
  id: string;
  claim: string;
  claimSv: string;
  referencedData: string[];
  alignment: ClaimAlignment;
  alignmentScore: number; // 0-100
  gaps: string[];
  standardStatement: string;
  standardStatementSv: string;
}

export const CLAIM_ALIGNMENT_STATEMENTS: Record<ClaimAlignment, { 
  en: string; 
  sv: string; 
  color: string 
}> = {
  supported: {
    en: 'This claim is supported by the referenced data.',
    sv: 'Detta påstående stöds av refererad data.',
    color: 'success',
  },
  partially_supported: {
    en: 'This claim is partially supported but requires additional context.',
    sv: 'Detta påstående har delvis stöd men kräver ytterligare kontext.',
    color: 'warning',
  },
  overstretched: {
    en: 'This claim extends beyond what the referenced data alone can support.',
    sv: 'Detta påstående sträcker sig bortom vad den refererade datan ensam kan stödja.',
    color: 'warning',
  },
  unsupported: {
    en: 'This claim lacks sufficient support from the referenced data.',
    sv: 'Detta påstående saknar tillräckligt stöd från refererad data.',
    color: 'destructive',
  },
  contradicted: {
    en: 'This claim appears to contradict the referenced data.',
    sv: 'Detta påstående verkar motsägas av refererad data.',
    color: 'destructive',
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK VD — MISUSE CLASSIFICATION
// Klassificering utan anklagelse
// ═══════════════════════════════════════════════════════════════

export type MisuseClassification =
  | 'out_of_context'
  | 'overinterpretation'
  | 'selective_framing'
  | 'visual_exaggeration'
  | 'unsupported_causality';

export const MISUSE_CLASSIFICATIONS: Record<MisuseClassification, {
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  relatedTypes: MisuseType[];
}> = {
  out_of_context: {
    name: 'Out-of-Context Use',
    nameSv: 'Användning utan kontext',
    description: 'Data presented without essential contextual information',
    descriptionSv: 'Data presenterad utan väsentlig kontextuell information',
    relatedTypes: ['missing_context', 'truncated_timeline', 'outdated_data'],
  },
  overinterpretation: {
    name: 'Overinterpretation',
    nameSv: 'Övertolkning',
    description: 'Conclusions that exceed what the data can support',
    descriptionSv: 'Slutsatser som överskrider vad datan kan stödja',
    relatedTypes: ['false_causation', 'removed_uncertainty', 'ecological_fallacy'],
  },
  selective_framing: {
    name: 'Selective Framing',
    nameSv: 'Selektiv inramning',
    description: 'Data curated to support a specific narrative',
    descriptionSv: 'Data kurerad för att stödja ett specifikt narrativ',
    relatedTypes: ['cherry_picking', 'survivorship_bias', 'incomparable_comparison'],
  },
  visual_exaggeration: {
    name: 'Visual Exaggeration',
    nameSv: 'Visuell överdrift',
    description: 'Visual design that amplifies perceived significance',
    descriptionSv: 'Visuell design som förstärker upplevd signifikans',
    relatedTypes: ['misleading_scale', 'visual_exaggeration', 'extreme_as_norm'],
  },
  unsupported_causality: {
    name: 'Unsupported Causality',
    nameSv: 'Ostödd kausalitet',
    description: 'Causal claims without sufficient evidence',
    descriptionSv: 'Kausala påståenden utan tillräckligt bevis',
    relatedTypes: ['false_causation', 'removed_uncertainty'],
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK VE — PUBLIC MISUSE INDICATORS
// Upplysning, inte tillrättavisning
// ═══════════════════════════════════════════════════════════════

export interface PublicMisuseIndicator {
  type: 'warning' | 'notice' | 'info';
  messageSv: string;
  messageEn: string;
  links: {
    label: string;
    labelSv: string;
    target: 'correct_presentation' | 'full_data' | 'methodology';
  }[];
}

export const PUBLIC_INDICATOR_TEMPLATES: Record<MisuseClassification, PublicMisuseIndicator> = {
  out_of_context: {
    type: 'warning',
    messageSv: 'Denna visualisering saknar nödvändig kontext.',
    messageEn: 'This visualization lacks necessary context.',
    links: [
      { label: 'View with context', labelSv: 'Visa med kontext', target: 'correct_presentation' },
      { label: 'Full data', labelSv: 'Full data', target: 'full_data' },
    ],
  },
  overinterpretation: {
    type: 'warning',
    messageSv: 'Slutsatsen sträcker sig bortom vad datan visar.',
    messageEn: 'The conclusion extends beyond what the data shows.',
    links: [
      { label: 'View methodology', labelSv: 'Visa metod', target: 'methodology' },
      { label: 'Correct interpretation', labelSv: 'Korrekt tolkning', target: 'correct_presentation' },
    ],
  },
  selective_framing: {
    type: 'notice',
    messageSv: 'Endast delar av tillgänglig data visas här.',
    messageEn: 'Only parts of available data are shown here.',
    links: [
      { label: 'View full dataset', labelSv: 'Visa fullständig data', target: 'full_data' },
    ],
  },
  visual_exaggeration: {
    type: 'notice',
    messageSv: 'Visualiseringens design förstärker upplevda skillnader.',
    messageEn: 'The visualization design amplifies perceived differences.',
    links: [
      { label: 'View proportional version', labelSv: 'Visa proportionell version', target: 'correct_presentation' },
    ],
  },
  unsupported_causality: {
    type: 'warning',
    messageSv: 'Orsakssamband påstås utan tillräckligt stöd.',
    messageEn: 'Causation is claimed without sufficient support.',
    links: [
      { label: 'View methodology', labelSv: 'Visa metod', target: 'methodology' },
      { label: 'What we actually know', labelSv: 'Vad vi faktiskt vet', target: 'correct_presentation' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK VF — SELF-CHECK FOR USERS
// Varning innan delning
// ═══════════════════════════════════════════════════════════════

export interface SharingCheck {
  elementMissing: ContextElement;
  warningSv: string;
  warningEn: string;
  suggestionSv: string;
  suggestionEn: string;
}

export const SHARING_CHECKS: SharingCheck[] = [
  {
    elementMissing: 'timeline',
    warningSv: 'Denna vy saknar tidsaxel.',
    warningEn: 'This view lacks a timeline.',
    suggestionSv: 'Vill du inkludera fullständig tidsperiod innan delning?',
    suggestionEn: 'Would you like to include the full time period before sharing?',
  },
  {
    elementMissing: 'uncertainty',
    warningSv: 'Osäkerhetsmarginaler visas inte.',
    warningEn: 'Uncertainty margins are not shown.',
    suggestionSv: 'Vill du visa osäkerhetsintervall innan delning?',
    suggestionEn: 'Would you like to show uncertainty intervals before sharing?',
  },
  {
    elementMissing: 'methodology',
    warningSv: 'Metod och källa saknas i denna vy.',
    warningEn: 'Method and source are missing from this view.',
    suggestionSv: 'Vill du inkludera metodbeskrivning innan delning?',
    suggestionEn: 'Would you like to include methodology description before sharing?',
  },
  {
    elementMissing: 'comparison_group',
    warningSv: 'Jämförelsegrupp saknas.',
    warningEn: 'Comparison group is missing.',
    suggestionSv: 'Vill du visa jämförbar referensdata innan delning?',
    suggestionEn: 'Would you like to show comparable reference data before sharing?',
  },
  {
    elementMissing: 'scale',
    warningSv: 'Skalan kan ge ett överdrivet intryck.',
    warningEn: 'The scale may give an exaggerated impression.',
    suggestionSv: 'Vill du visa med proportionell skala innan delning?',
    suggestionEn: 'Would you like to show with proportional scale before sharing?',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK VG — MISUSE HEATMAP (AGGREGERAD)
// Meta-insikt, inte övervakning
// ═══════════════════════════════════════════════════════════════

export interface MisuseHeatmapData {
  domain: string;
  domainSv: string;
  totalDetections: number;
  byType: Record<MisuseType, number>;
  trend: 'increasing' | 'stable' | 'decreasing';
  mostVulnerable: MisuseType[];
}

export const MOCK_HEATMAP_DATA: MisuseHeatmapData[] = [
  {
    domain: 'Economy',
    domainSv: 'Ekonomi',
    totalDetections: 47,
    byType: {
      cherry_picking: 12,
      false_causation: 8,
      misleading_scale: 7,
      truncated_timeline: 6,
      missing_context: 5,
      incomparable_comparison: 4,
      removed_uncertainty: 2,
      survivorship_bias: 1,
      ecological_fallacy: 1,
      outdated_data: 1,
      extreme_as_norm: 0,
      visual_exaggeration: 0,
    },
    trend: 'stable',
    mostVulnerable: ['cherry_picking', 'false_causation', 'misleading_scale'],
  },
  {
    domain: 'Health',
    domainSv: 'Hälsa',
    totalDetections: 38,
    byType: {
      false_causation: 11,
      removed_uncertainty: 8,
      missing_context: 6,
      cherry_picking: 5,
      extreme_as_norm: 4,
      ecological_fallacy: 2,
      misleading_scale: 1,
      survivorship_bias: 1,
      truncated_timeline: 0,
      incomparable_comparison: 0,
      outdated_data: 0,
      visual_exaggeration: 0,
    },
    trend: 'increasing',
    mostVulnerable: ['false_causation', 'removed_uncertainty', 'missing_context'],
  },
  {
    domain: 'Environment',
    domainSv: 'Miljö',
    totalDetections: 31,
    byType: {
      truncated_timeline: 9,
      cherry_picking: 7,
      visual_exaggeration: 5,
      misleading_scale: 4,
      false_causation: 3,
      missing_context: 2,
      removed_uncertainty: 1,
      incomparable_comparison: 0,
      survivorship_bias: 0,
      ecological_fallacy: 0,
      outdated_data: 0,
      extreme_as_norm: 0,
    },
    trend: 'decreasing',
    mostVulnerable: ['truncated_timeline', 'cherry_picking', 'visual_exaggeration'],
  },
  {
    domain: 'Education',
    domainSv: 'Utbildning',
    totalDetections: 22,
    byType: {
      incomparable_comparison: 8,
      cherry_picking: 5,
      ecological_fallacy: 4,
      outdated_data: 3,
      missing_context: 2,
      false_causation: 0,
      misleading_scale: 0,
      truncated_timeline: 0,
      removed_uncertainty: 0,
      survivorship_bias: 0,
      extreme_as_norm: 0,
      visual_exaggeration: 0,
    },
    trend: 'stable',
    mostVulnerable: ['incomparable_comparison', 'cherry_picking', 'ecological_fallacy'],
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK VH — NON-PUNITIVE DESIGN
// Principer för icke-straffande design
// ═══════════════════════════════════════════════════════════════

export const NON_PUNITIVE_PRINCIPLES = {
  noIndividualBlame: {
    sv: 'Systemet pekar aldrig ut individer.',
    en: 'The system never singles out individuals.',
    enforced: true,
  },
  noIntentionLabels: {
    sv: 'Systemet sätter inga etiketter på intention.',
    en: 'The system does not label intentions.',
    enforced: true,
  },
  noContentBlocking: {
    sv: 'Systemet blockerar inget innehåll.',
    en: 'The system does not block any content.',
    enforced: true,
  },
  onlyShowAndExplain: {
    sv: 'Allt är visning + förklaring.',
    en: 'Everything is display + explanation.',
    enforced: true,
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK VI — EDUCATIONAL FEEDBACK LOOP
// Missbruk blir tillfälle för lärande
// ═══════════════════════════════════════════════════════════════

export interface EducationalFeedback {
  misuseType: MisuseType;
  whatWentWrong: string;
  whatWentWrongSv: string;
  howToDoCorrectly: string;
  howToDoCorrectlySv: string;
  relatedLearningPath: string;
  keyTakeaway: string;
  keyTakeawaySv: string;
}

export const EDUCATIONAL_FEEDBACK: Record<MisuseType, EducationalFeedback> = {
  cherry_picking: {
    misuseType: 'cherry_picking',
    whatWentWrong: 'Only favorable data points were shown, hiding the complete picture.',
    whatWentWrongSv: 'Endast gynnsamma datapunkter visades, vilket dolde helhetsbilden.',
    howToDoCorrectly: 'Always show the full dataset or clearly state the selection criteria.',
    howToDoCorrectlySv: 'Visa alltid fullständig data eller ange tydligt urvalskriterier.',
    relatedLearningPath: 'understanding-data-selection',
    keyTakeaway: 'Context requires completeness.',
    keyTakeawaySv: 'Kontext kräver fullständighet.',
  },
  false_causation: {
    misuseType: 'false_causation',
    whatWentWrong: 'Correlation was presented as causation without proper evidence.',
    whatWentWrongSv: 'Korrelation presenterades som kausalitet utan tillräckligt bevis.',
    howToDoCorrectly: 'Distinguish between correlation and causation. State limitations clearly.',
    howToDoCorrectlySv: 'Skilj mellan korrelation och kausalitet. Ange begränsningar tydligt.',
    relatedLearningPath: 'correlation-vs-causation',
    keyTakeaway: 'Correlation is not causation.',
    keyTakeawaySv: 'Korrelation är inte kausalitet.',
  },
  misleading_scale: {
    misuseType: 'misleading_scale',
    whatWentWrong: 'The visual scale exaggerated the apparent change.',
    whatWentWrongSv: 'Den visuella skalan överdrev den uppenbara förändringen.',
    howToDoCorrectly: 'Start axes at zero or clearly indicate when not, use proportional visuals.',
    howToDoCorrectlySv: 'Starta axlar vid noll eller ange tydligt när så ej sker, använd proportionella visualiseringar.',
    relatedLearningPath: 'visual-data-integrity',
    keyTakeaway: 'Proportionality matters.',
    keyTakeawaySv: 'Proportionalitet är avgörande.',
  },
  missing_context: {
    misuseType: 'missing_context',
    whatWentWrong: 'Essential background information was omitted.',
    whatWentWrongSv: 'Väsentlig bakgrundsinformation utelämnades.',
    howToDoCorrectly: 'Include methodology, timeframe, and relevant comparison groups.',
    howToDoCorrectlySv: 'Inkludera metod, tidsram och relevanta jämförelsegrupper.',
    relatedLearningPath: 'contextual-data-presentation',
    keyTakeaway: 'Data without context misleads.',
    keyTakeawaySv: 'Data utan kontext vilseleder.',
  },
  outdated_data: {
    misuseType: 'outdated_data',
    whatWentWrong: 'Old data was used to make claims about current situations.',
    whatWentWrongSv: 'Gammal data användes för att göra påståenden om nuläget.',
    howToDoCorrectly: 'Always cite data publication dates and acknowledge temporal limitations.',
    howToDoCorrectlySv: 'Citera alltid datans publiceringsdatum och erkänn temporala begränsningar.',
    relatedLearningPath: 'temporal-data-validity',
    keyTakeaway: 'Data has an expiration context.',
    keyTakeawaySv: 'Data har ett kontextuellt bäst-före-datum.',
  },
  incomparable_comparison: {
    misuseType: 'incomparable_comparison',
    whatWentWrong: 'Items with fundamentally different characteristics were compared.',
    whatWentWrongSv: 'Enheter med fundamentalt olika egenskaper jämfördes.',
    howToDoCorrectly: 'Ensure methodological and definitional consistency before comparing.',
    howToDoCorrectlySv: 'Säkerställ metodologisk och definitionsmässig konsistens före jämförelse.',
    relatedLearningPath: 'valid-comparisons',
    keyTakeaway: 'Compare like with like.',
    keyTakeawaySv: 'Jämför lika med lika.',
  },
  survivorship_bias: {
    misuseType: 'survivorship_bias',
    whatWentWrong: 'Only successful cases were analyzed, ignoring failures.',
    whatWentWrongSv: 'Endast framgångsrika fall analyserades, misslyckanden ignorerades.',
    howToDoCorrectly: 'Include both successes and failures in analysis.',
    howToDoCorrectlySv: 'Inkludera både framgångar och misslyckanden i analysen.',
    relatedLearningPath: 'complete-sample-analysis',
    keyTakeaway: 'Failures teach as much as successes.',
    keyTakeawaySv: 'Misslyckanden lär lika mycket som framgångar.',
  },
  ecological_fallacy: {
    misuseType: 'ecological_fallacy',
    whatWentWrong: 'Group-level data was applied to individual conclusions.',
    whatWentWrongSv: 'Gruppnivådata applicerades på individuella slutsatser.',
    howToDoCorrectly: 'Match the level of analysis to the level of conclusion.',
    howToDoCorrectlySv: 'Matcha analysnivån med slutsatsnivån.',
    relatedLearningPath: 'levels-of-analysis',
    keyTakeaway: 'Groups are not individuals.',
    keyTakeawaySv: 'Grupper är inte individer.',
  },
  truncated_timeline: {
    misuseType: 'truncated_timeline',
    whatWentWrong: 'Only a convenient portion of the time series was shown.',
    whatWentWrongSv: 'Endast en gynnsam del av tidsserien visades.',
    howToDoCorrectly: 'Show full available history or clearly justify time window selection.',
    howToDoCorrectlySv: 'Visa fullständig tillgänglig historik eller motivera tydligt tidsfönstervalet.',
    relatedLearningPath: 'temporal-completeness',
    keyTakeaway: 'Time window selection shapes narratives.',
    keyTakeawaySv: 'Tidsfönsterval formar narrativ.',
  },
  removed_uncertainty: {
    misuseType: 'removed_uncertainty',
    whatWentWrong: 'Uncertainty was hidden, making estimates appear certain.',
    whatWentWrongSv: 'Osäkerhet doldes, vilket fick skattningar att framstå som säkra.',
    howToDoCorrectly: 'Always display confidence intervals and margins of error.',
    howToDoCorrectlySv: 'Visa alltid konfidensintervall och felmarginaler.',
    relatedLearningPath: 'uncertainty-communication',
    keyTakeaway: 'Certainty without evidence is false.',
    keyTakeawaySv: 'Säkerhet utan bevis är falsk.',
  },
  extreme_as_norm: {
    misuseType: 'extreme_as_norm',
    whatWentWrong: 'Extreme cases were presented as typical examples.',
    whatWentWrongSv: 'Extremfall presenterades som typiska exempel.',
    howToDoCorrectly: 'Show distribution, median, and typical cases alongside examples.',
    howToDoCorrectlySv: 'Visa fördelning, median och typiska fall tillsammans med exempel.',
    relatedLearningPath: 'distribution-awareness',
    keyTakeaway: 'Outliers are not the norm.',
    keyTakeawaySv: 'Extremvärden är inte normen.',
  },
  visual_exaggeration: {
    misuseType: 'visual_exaggeration',
    whatWentWrong: 'Visual design amplified perceived differences beyond data reality.',
    whatWentWrongSv: 'Visuell design förstärkte upplevda skillnader bortom dataverkligheten.',
    howToDoCorrectly: 'Ensure visual proportions match data proportions.',
    howToDoCorrectlySv: 'Säkerställ att visuella proportioner matchar dataproportioner.',
    relatedLearningPath: 'honest-visualization',
    keyTakeaway: 'Visuals should inform, not distort.',
    keyTakeawaySv: 'Visualiseringar ska informera, inte förvränga.',
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
  classification: MisuseClassification;
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  explanationSv: string;
  correctVersion: string;
  correctVersionSv: string;
  dataUsed: string[];
  contextLost: ContextElement[];
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
    classification: 'selective_framing',
    severity: 'high',
    explanation: 'The claim uses only Q2 2024 data, ignoring the overall yearly trend which shows average growth.',
    explanationSv: 'Påståendet använder endast Q2 2024-data och ignorerar den övergripande årliga trenden som visar genomsnittlig tillväxt.',
    correctVersion: 'Country X had the highest growth in Q2 2024, but yearly growth is at EU average.',
    correctVersionSv: 'Land X hade högst tillväxt under Q2 2024, men årstillväxten är på EU-genomsnittet.',
    dataUsed: ['GDP growth Q2 2024', 'GDP growth 2024 YTD'],
    contextLost: ['timeline', 'temporal_scope'],
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
    classification: 'unsupported_causality',
    severity: 'high',
    explanation: 'Unemployment dropped during global economic recovery; similar drops occurred in countries without this policy.',
    explanationSv: 'Arbetslösheten sjönk under global ekonomisk återhämtning; liknande nedgångar skedde i länder utan denna politik.',
    correctVersion: 'Unemployment dropped 50% during a period of global recovery, with multiple contributing factors.',
    correctVersionSv: 'Arbetslösheten sjönk 50% under en period av global återhämtning, med flera bidragande faktorer.',
    dataUsed: ['Unemployment rate 2020-2024', 'EU comparison data'],
    contextLost: ['confounders', 'comparison_group'],
    status: 'verified',
  },
  {
    id: 'md-3',
    detectedAt: '2024-11-22',
    source: 'Företagsrapport',
    sourceType: 'corporate',
    claim: 'Customer satisfaction increased dramatically',
    claimSv: 'Kundnöjdheten ökade dramatiskt',
    misuseTypes: ['misleading_scale', 'visual_exaggeration'],
    classification: 'visual_exaggeration',
    severity: 'medium',
    explanation: 'Chart Y-axis starts at 85%, making a 3% increase appear as a dramatic change.',
    explanationSv: 'Diagrammets Y-axel startar vid 85%, vilket får en 3% ökning att framstå som en dramatisk förändring.',
    correctVersion: 'Customer satisfaction increased from 88% to 91% (3 percentage points).',
    correctVersionSv: 'Kundnöjdheten ökade från 88% till 91% (3 procentenheter).',
    dataUsed: ['Customer satisfaction survey 2023-2024'],
    contextLost: ['scale'],
    status: 'corrected',
  },
];

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const MISUSE_DETECTION_SYSTEM = {
  name: 'Misuse Detection Layer',
  acronym: 'MDL',
  version: '2.0',
  blocks: ['VA', 'VB', 'VC', 'VD', 'VE', 'VF', 'VG', 'VH', 'VI'],
  core_principle: MDL_CORE_PRINCIPLE,
  non_punitive_design: NON_PUNITIVE_PRINCIPLES,
  result: 'Identifierar när data presenteras vilseledande – utan att censurera.',
} as const;
