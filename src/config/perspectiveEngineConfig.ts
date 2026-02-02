// Perspective Engine (PE) Configuration
// "Visa verkligheten på rätt skala – och låt människor zooma in utan att tappa sanningen."

// === SCALE HIERARCHY ===
// Obrytbar hierarki – man kan aldrig hoppa över nivåer utan att systemet visar vad man lämnar

export type ScaleLevel = 
  | 'civilization'
  | 'continent'
  | 'nation'
  | 'region'
  | 'system'
  | 'indicator'
  | 'datapoint';

export interface ScaleLevelDefinition {
  level: ScaleLevel;
  order: number;
  name: string;
  nameSv: string;
  description: string;
  icon: string;
  typicalTimeframe: string;
  exampleScope: string;
}

export const SCALE_HIERARCHY: ScaleLevelDefinition[] = [
  {
    level: 'civilization',
    order: 1,
    name: 'Civilization',
    nameSv: 'Civilisation',
    description: 'Global, lång tid – mänsklighetens samlade tillstånd',
    icon: '🌍',
    typicalTimeframe: '100–10 000 år',
    exampleScope: 'Hela mänskligheten'
  },
  {
    level: 'continent',
    order: 2,
    name: 'Continent',
    nameSv: 'Världsdel',
    description: 'Kontinental nivå – stora regionala mönster',
    icon: '🗺️',
    typicalTimeframe: '50–500 år',
    exampleScope: 'Europa, Asien, Afrika'
  },
  {
    level: 'nation',
    order: 3,
    name: 'Nation',
    nameSv: 'Nation',
    description: 'Nationell nivå – statsbaserade system',
    icon: '🏛️',
    typicalTimeframe: '10–200 år',
    exampleScope: 'Sverige, Tyskland, Japan'
  },
  {
    level: 'region',
    order: 4,
    name: 'Region',
    nameSv: 'Region',
    description: 'Subnationell nivå – lokala variationer',
    icon: '📍',
    typicalTimeframe: '5–50 år',
    exampleScope: 'Skåne, Bayern, Hokkaido'
  },
  {
    level: 'system',
    order: 5,
    name: 'System',
    nameSv: 'System',
    description: 'Domänspecifik nivå – energi, hälsa, ekonomi',
    icon: '⚙️',
    typicalTimeframe: '1–20 år',
    exampleScope: 'Energisystem, sjukvård, utbildning'
  },
  {
    level: 'indicator',
    order: 6,
    name: 'Indicator',
    nameSv: 'Indikator',
    description: 'Enskild mätning – specifik KPI',
    icon: '📊',
    typicalTimeframe: '1 månad–5 år',
    exampleScope: 'BNP per capita, arbetslöshet'
  },
  {
    level: 'datapoint',
    order: 7,
    name: 'Data Point',
    nameSv: 'Datapunkt',
    description: 'Enskilt värde – specifik observation',
    icon: '📌',
    typicalTimeframe: 'Ögonblick',
    exampleScope: 'Q3 2024: 5.2%'
  }
];

// === TIME DEPTH ===

export type TimeDepth = 'short' | 'structural' | 'civilizational';

export interface TimeDepthDefinition {
  depth: TimeDepth;
  name: string;
  nameSv: string;
  range: string;
  description: string;
  isDefault: boolean;
}

export const TIME_DEPTHS: TimeDepthDefinition[] = [
  {
    depth: 'short',
    name: 'Short-term',
    nameSv: 'Kort sikt',
    range: '0–5 år',
    description: 'Aktuella trender och cykliska variationer',
    isDefault: false
  },
  {
    depth: 'structural',
    name: 'Structural',
    nameSv: 'Strukturell sikt',
    range: '20–50 år',
    description: 'Generationsförändringar och institutionella skiften',
    isDefault: false
  },
  {
    depth: 'civilizational',
    name: 'Civilizational',
    nameSv: 'Civilisatorisk sikt',
    range: '100+ år',
    description: 'Långsiktiga mönster och civilisatoriska cykler',
    isDefault: true
  }
];

// === PERSPECTIVE LENSES ===

export type PerspectiveLens = 'global' | 'national' | 'personal' | 'generational';

export interface PerspectiveLensDefinition {
  lens: PerspectiveLens;
  name: string;
  nameSv: string;
  question: string;
  description: string;
}

export const PERSPECTIVE_LENSES: PerspectiveLensDefinition[] = [
  {
    lens: 'global',
    name: 'Global',
    nameSv: 'Globalt',
    question: 'Hur påverkar detta mänskligheten som helhet?',
    description: 'Samma data sedd från civilisatorisk nivå'
  },
  {
    lens: 'national',
    name: 'National',
    nameSv: 'Nationellt',
    question: 'Vad betyder detta för vårt land?',
    description: 'Samma data sedd från nationens perspektiv'
  },
  {
    lens: 'personal',
    name: 'Personal',
    nameSv: 'Personligt',
    question: 'Hur påverkar detta mitt liv?',
    description: 'Samma data sedd från individens perspektiv'
  },
  {
    lens: 'generational',
    name: 'Generational',
    nameSv: 'Generationsperspektiv',
    question: 'Vad ärver nästa generation?',
    description: 'Samma data sedd över generationsgränser'
  }
];

// === SIGNIFICANCE MARKERS ===

export type SignificanceLevel = 'local' | 'systemic' | 'civilizational';

export interface SignificanceMarker {
  level: SignificanceLevel;
  name: string;
  nameSv: string;
  description: string;
  examples: string[];
}

export const SIGNIFICANCE_LEVELS: SignificanceMarker[] = [
  {
    level: 'local',
    name: 'Local significance',
    nameSv: 'Lokal betydelse',
    description: 'Viktig lokalt – begränsad global effekt',
    examples: ['Regional arbetslöshet', 'Kommunal budget', 'Lokal miljöpåverkan']
  },
  {
    level: 'systemic',
    name: 'Systemic significance',
    nameSv: 'Systemisk betydelse',
    description: 'Påverkar hela system eller sektorer',
    examples: ['Energipriser', 'Inflationstakt', 'Demografisk förändring']
  },
  {
    level: 'civilizational',
    name: 'Civilizational significance',
    nameSv: 'Civilisatorisk betydelse',
    description: 'Liten absolut förändring – stor strukturell effekt',
    examples: ['Klimatförändring', 'AI-utveckling', 'Fertilitetstal under 2.1']
  }
];

// === BIG TRUTHS ===
// Inte åsikter. Observationer över 25 000 generationer.

export interface BigTruth {
  id: string;
  statement: string;
  explanation: string;
  evidenceHorizon: string;
}

export const BIG_TRUTHS: BigTruth[] = [
  {
    id: 'energy-requirement',
    statement: 'Energi krävs för värme, mat, transport',
    explanation: 'Utan tillräcklig energi per capita upphör komplexitet och välbefinnande',
    evidenceHorizon: 'Hela mänsklig historia'
  },
  {
    id: 'complexity-surplus',
    statement: 'Komplexa samhällen kräver överskott',
    explanation: 'Civilisationer kollapsar när energi- och resursöverskottet försvinner',
    evidenceHorizon: 'Alla kända civilisationer'
  },
  {
    id: 'debt-future-labor',
    statement: 'Skuld är framtida arbete',
    explanation: 'Varje skuld måste betalas med framtida produktion eller avskrivas med förlust',
    evidenceHorizon: '5000 års ekonomisk historia'
  },
  {
    id: 'resilience-asymmetry',
    statement: 'Resiliens byggs långsamt, förstörs snabbt',
    explanation: 'Institutioner, tillit och infrastruktur tar decennier att bygga men kan raseras på år',
    evidenceHorizon: 'Institutionell historia'
  },
  {
    id: 'institutions-beat-ideology',
    statement: 'Institutioner slår ideologi över tid',
    explanation: 'Långsiktig samhällsutveckling avgörs av institutionell kvalitet, inte politisk färg',
    evidenceHorizon: '500 års jämförande statsvetenskap'
  },
  {
    id: 'population-carrying-capacity',
    statement: 'Befolkning kan inte permanent överstiga bärkraft',
    explanation: 'Kortsiktigt kan teknik förskjuta gränser, långsiktigt gäller fysiska lagar',
    evidenceHorizon: 'Ekologisk historia'
  },
  {
    id: 'cognitive-limits',
    statement: 'Mänsklig kognition har fasta begränsningar',
    explanation: 'Dunbar-tal, uppmärksamhetsspann och minneskapacitet förändras inte med teknik',
    evidenceHorizon: '300 000 år biologisk konstans'
  },
  {
    id: 'cycles-repeat',
    statement: 'Historiska cykler upprepas',
    explanation: 'Expansion, mognad, överbelastning och omställning återkommer i alla civilisationer',
    evidenceHorizon: 'Arkeologisk och historisk analys'
  }
];

// === CIVILIZATION VIEW (DEFAULT) ===

export interface CivilizationViewData {
  humanWellbeingIndex: number;
  trend: 'improving' | 'stable' | 'declining';
  energyPerCapita: number;
  energyTrend: 'improving' | 'stable' | 'declining';
  population: number;
  populationTrend: 'growing' | 'stable' | 'declining';
  resilienceIndex: number;
  stressIndex: number;
  longArcPhase: 'expansion' | 'maturity' | 'strain' | 'transition';
  headline: string;
}

export const EXAMPLE_CIVILIZATION_VIEW: CivilizationViewData = {
  humanWellbeingIndex: 62,
  trend: 'stable',
  energyPerCapita: 22000, // kWh/year global average
  energyTrend: 'improving',
  population: 8.1,
  populationTrend: 'growing',
  resilienceIndex: 58,
  stressIndex: 67,
  longArcPhase: 'strain',
  headline: 'Så här mår mänskligheten just nu, i ett långt tidsperspektiv.'
};

// === ZOOM CONTEXT ===

export interface ZoomContext {
  currentScale: ScaleLevel;
  currentTimeDepth: TimeDepth;
  globalPercentage: number; // "Detta du tittar på är X% av det globala systemet"
  preservedContext: string;
  realityCheck: string | null;
}

export const generateZoomInContext = (scale: ScaleLevel, scope: string): string => {
  const percentages: Record<ScaleLevel, string> = {
    civilization: '100%',
    continent: '15–25%',
    nation: '0.1–5%',
    region: '0.01–0.5%',
    system: '5–15% av nationell',
    indicator: '1–5% av system',
    datapoint: 'enskild observation'
  };
  
  return `Detta du tittar på (${scope}) representerar ${percentages[scale]} av det globala systemet.`;
};

export const generateZoomOutRealityCheck = (
  localTrend: 'up' | 'down' | 'stable',
  globalTrend: 'up' | 'down' | 'stable',
  significance: SignificanceLevel
): string => {
  if (significance === 'local' && localTrend !== globalTrend) {
    return 'Detta lokala fenomen förändrar inte den övergripande trenden.';
  }
  if (significance === 'civilizational') {
    return 'Trots liten skala har detta ovanligt stor systempåverkan.';
  }
  if (localTrend === globalTrend) {
    return 'Lokal trend följer global utveckling.';
  }
  return 'Lokal avvikelse från global trend observerad.';
};

// === CORE PRINCIPLE ===

export const PERSPECTIVE_PRINCIPLE = {
  problem: 'Små perspektiv skapar stora illusioner.',
  solution: 'Stora perspektiv skapar lugn, ansvar och realism.',
  method: 'Alltid börja på civilisationell nivå. All detalj är en nedbrytning, aldrig huvudbilden.'
};

// === SYSTEM DIFFERENCE ===

export const SYSTEM_DIFFERENTIATION = {
  mostSystems: 'Vad händer?',
  thisSystem: 'Vad händer – i förhållande till mänsklighetens faktiska villkor?',
  userOutcome: ['förstå', 'diskutera', 'ta ansvar']
};
