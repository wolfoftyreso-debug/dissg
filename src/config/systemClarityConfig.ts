// System Clarity Architecture Configuration
// "Ett översättningslager mellan verkligheten och mänskligt tänkande"

// === 1. INFORMATION ARCHITECTURE ===

export type DomainFolder = 
  | 'humanity'
  | 'energy'
  | 'population'
  | 'health'
  | 'economy'
  | 'institutions'
  | 'environment'
  | 'learning';

export interface FolderDefinition {
  id: DomainFolder;
  icon: string;
  name: string;
  nameSv: string;
  description: string;
  keyIndicators: string[];
}

export const LEVEL_1_FOLDERS: FolderDefinition[] = [
  {
    id: 'humanity',
    icon: '🌍',
    name: 'Humanity',
    nameSv: 'Mänskligheten',
    description: 'Mänskligt välbefinnande som helhet',
    keyIndicators: ['HWI', 'livskvalitet', 'grundbehov', 'framtidsutsikter']
  },
  {
    id: 'energy',
    icon: '⚡',
    name: 'Energy',
    nameSv: 'Energi',
    description: 'Civilisationens blodomlopp',
    keyIndicators: ['energi_per_capita', 'energikällor', 'energikostnad', 'energisäkerhet']
  },
  {
    id: 'population',
    icon: '👥',
    name: 'Population & Demography',
    nameSv: 'Befolkning & Demografi',
    description: 'Människor, åldersstruktur, rörlighet',
    keyIndicators: ['befolkning', 'fertilitetstal', 'försörjningskvot', 'urbanisering']
  },
  {
    id: 'health',
    icon: '🏥',
    name: 'Health',
    nameSv: 'Hälsa',
    description: 'Fysisk och psykisk hälsa',
    keyIndicators: ['livslängd', 'sjukdomsbörda', 'vårdtillgång', 'psykisk_ohälsa']
  },
  {
    id: 'economy',
    icon: '💰',
    name: 'Economy',
    nameSv: 'Ekonomi',
    description: 'Resurser, arbete, fördelning',
    keyIndicators: ['bnp_per_capita', 'sysselsättning', 'skuld', 'ojämlikhet']
  },
  {
    id: 'institutions',
    icon: '🏛️',
    name: 'Institutions & Governance',
    nameSv: 'Institutioner & Styrning',
    description: 'Hur samhället organiseras',
    keyIndicators: ['institutionell_kvalitet', 'tillit', 'korruption', 'rättsstat']
  },
  {
    id: 'environment',
    icon: '🌱',
    name: 'Environment & Resources',
    nameSv: 'Miljö & Resurser',
    description: 'Planetens fysiska gränser',
    keyIndicators: ['resursanvändning', 'utsläpp', 'biologisk_mångfald', 'vattenförsörjning']
  },
  {
    id: 'learning',
    icon: '🧠',
    name: 'Learning & Memory',
    nameSv: 'Lärande & Minne',
    description: 'Historik, mönster, lärdomar',
    keyIndicators: ['historiska_cykler', 'systemminne', 'bekräftade_mönster', 'kollektivt_lärande']
  }
];

export type PerspectiveLevel = 'global' | 'region' | 'nation' | 'longterm' | 'current' | 'direction';

export interface PerspectiveDefinition {
  id: PerspectiveLevel;
  name: string;
  nameSv: string;
  question: string;
}

export const LEVEL_2_PERSPECTIVES: PerspectiveDefinition[] = [
  { id: 'global', name: 'Global', nameSv: 'Globalt', question: 'Hur ser det ut i världen?' },
  { id: 'region', name: 'Region', nameSv: 'Region', question: 'Hur varierar det geografiskt?' },
  { id: 'nation', name: 'Nation', nameSv: 'Nation', question: 'Hur ser det ut i specifika länder?' },
  { id: 'longterm', name: 'Long Arc', nameSv: 'Lång tid', question: 'Hur har det utvecklats historiskt?' },
  { id: 'current', name: 'Current State', nameSv: 'Nuvarande läge', question: 'Var står vi nu?' },
  { id: 'direction', name: 'Direction', nameSv: 'Riktning', question: 'Vart är vi på väg?' }
];

// === 2. GRAPH GRAMMAR ===

export interface GraphMetadata {
  title: string;
  whatAreYouLookingAt: string;
  whyIsThisShown: string;
  howToInterpret: string;
  timePeriod: { start: string; end: string };
  geographicLevel: string;
  dataSource: string;
  lastUpdated: string;
  uncertainty?: string;
}

export const GRAPH_REQUIRED_ELEMENTS = [
  'Titel i klartext',
  'Tidsperiod (tydligt)',
  'Geografisk nivå',
  'Datakälla',
  'Senast uppdaterad',
  'Osäkerhet (om relevant)'
] as const;

export interface GraphColors {
  level: string;      // Blå - visar nivå
  comparison: string; // Grå - jämförelse
  change: string;     // Orange - förändring
  warning: string;    // Röd - endast teknisk varning
}

export const GRAPH_COLOR_PALETTE: GraphColors = {
  level: 'hsl(var(--primary))',
  comparison: 'hsl(var(--muted-foreground))',
  change: 'hsl(var(--warning))',
  warning: 'hsl(var(--destructive))'
};

export const COLOR_RULES = {
  never: 'Aldrig rött = dåligt, grönt = bra',
  blue: 'Blå = nivå',
  gray: 'Grå = jämförelse',
  orange: 'Orange = förändring',
  red: 'Röd = endast teknisk varning (saknad data, brutna serier)'
};

// === 3. AGGREGATION RULES ===

export interface AggregationRule {
  id: string;
  rule: string;
  wrongExample: string;
  correctExample: string;
  principle: string;
}

export const AGGREGATION_RULES: AggregationRule[] = [
  {
    id: 'explain-composition',
    rule: 'Ingen aggregation utan förklaring',
    wrongExample: 'Index: 72',
    correctExample: 'Index: 72\n\nDetta värde är sammansatt av:\n• Hälsa (30%): 78\n• Trygghet (25%): 65\n• Autonomi (25%): 71\n• Framtid (20%): 68',
    principle: 'Användaren ska alltid kunna förstå vad ett sammansatt värde består av'
  },
  {
    id: 'level-and-direction',
    rule: 'Alltid visa både nivå och riktning',
    wrongExample: 'Energi per capita har ökat',
    correctExample: 'Energi per capita: 3 200 kWh/person\nRiktning: svagt nedåt senaste 5 åren',
    principle: 'Folk blandar annars ihop nivå och trend'
  },
  {
    id: 'always-compare',
    rule: 'Jämför alltid mot något',
    wrongExample: 'X har ökat',
    correctExample: 'X har ökat med 12% jämfört med föregående år\nX ligger 8% under genomsnittet för jämförbara länder',
    principle: 'Absoluta tal utan kontext är meningslösa'
  },
  {
    id: 'explain-correlation',
    rule: 'Förklara korrelation i ord',
    wrongExample: 'Korrelation: 0.63',
    correctExample: 'När X ökade under denna period ökade Y ofta samtidigt.\nSambandet är inte konstant och varierar över tid.\n\nTekniskt: korrelationskoefficient 0.63',
    principle: 'Ord > matte för förståelse'
  }
];

// === 4. GLOBAL CLARITY RULES (UNBREAKABLE) ===

export interface ClarityRule {
  id: string;
  code: string;
  title: string;
  titleSv: string;
  rule: string;
  test: string;
  consequence: string;
}

export const UNBREAKABLE_RULES: ClarityRule[] = [
  {
    id: 'language',
    code: 'A',
    title: 'Language',
    titleSv: 'Språk',
    rule: 'Inga facktermer utan förklaring. Inga antaganden om förkunskap. Samma ord betyder alltid samma sak.',
    test: 'En 19-åring i ett annat land ska förstå',
    consequence: 'Text som inte klarar testet måste skrivas om'
  },
  {
    id: 'data-identity',
    code: 'B',
    title: 'Data Identity',
    titleSv: 'Dataidentitet',
    rule: 'Användaren ska alltid veta: vilken data, från vem, från när, på vilken nivå',
    test: 'Om användaren inte vet = systemfel',
    consequence: 'Data utan identitet får inte visas'
  },
  {
    id: 'scale',
    code: 'C',
    title: 'Scale',
    titleSv: 'Skala',
    rule: 'Systemet måste alltid säga: "Detta är stort/litet i förhållande till helheten"',
    test: 'Kan användaren förstå proportionen?',
    consequence: 'Utan skala skapas illusioner'
  },
  {
    id: 'global-default',
    code: 'D',
    title: 'Global Default',
    titleSv: 'Global standard',
    rule: 'Allt visas först globalt och över längre tid. Zoom är ett aktivt val.',
    test: 'Startar vyn på civilisationsnivå?',
    consequence: 'Lokalt perspektiv som default skapar tunnelseende'
  }
];

// === 5. USER EXPERIENCE GOALS ===

export interface UXGoal {
  feeling: string;
  feelingSv: string;
  achieved: boolean;
}

export const UX_GOALS: UXGoal[] = [
  { feeling: 'I understand more than before', feelingSv: 'Jag förstår mer än innan', achieved: false },
  { feeling: 'This is not opinions', feelingSv: 'Det här är inte åsikter', achieved: false },
  { feeling: 'This can be trusted', feelingSv: 'Det här går att lita på', achieved: false },
  { feeling: 'I see connections', feelingSv: 'Jag ser samband', achieved: false },
  { feeling: 'I understand why things are as they are', feelingSv: 'Jag fattar varför läget är som det är', achieved: false }
];

export const UX_PRINCIPLES = {
  notStress: 'Inte stress',
  notGuilt: 'Inte skuld',
  understanding: 'Förståelse'
};

// === SYSTEM IDENTITY ===

export const SYSTEM_IDENTITY = {
  whatItIs: 'Ett översättningslager mellan verkligheten och mänskligt tänkande',
  whatItIsNot: 'Ett analysverktyg',
  requirement: 'Det måste vara brutalt tydligt, annars är det värdelöst'
};

// === HELPER FUNCTIONS ===

export const generateGraphIntroText = (metadata: GraphMetadata): string => {
  return `**Vad tittar jag på?**
${metadata.whatAreYouLookingAt}

**Varför visas detta?**
${metadata.whyIsThisShown}

**Hur ska jag tolka rörelsen?**
${metadata.howToInterpret}`;
};

export const validateDataIdentity = (data: {
  what?: string;
  source?: string;
  when?: string;
  level?: string;
}): { valid: boolean; missing: string[] } => {
  const missing: string[] = [];
  if (!data.what) missing.push('vilken data');
  if (!data.source) missing.push('från vem');
  if (!data.when) missing.push('från när');
  if (!data.level) missing.push('på vilken nivå');
  
  return { valid: missing.length === 0, missing };
};

export const formatScaleContext = (
  value: number,
  globalTotal: number,
  unit: string
): string => {
  const percentage = ((value / globalTotal) * 100).toFixed(1);
  return `${value.toLocaleString()} ${unit} (${percentage}% av global helhet)`;
};
