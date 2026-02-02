/**
 * ANSVARSMATRIS FÖR SVERIGE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Komplett mappning:
 * KPI → Ansvarsområde → Mandatnivå → Styrperiod → Politisk konstellation
 * 
 * Systemet visar vem som bar mandatet – utan att anklaga.
 */

export type ResponsibilityLevel = 'nationell' | 'regional' | 'kommunal';

export type ResponsibilityArea = 
  | 'halsa'
  | 'arbete'
  | 'utbildning'
  | 'trygghet'
  | 'ekonomi'
  | 'infrastruktur'
  | 'integration'
  | 'miljo';

export interface ResponsibilityMapping {
  kpiCategory: string;
  primaryArea: ResponsibilityArea;
  primaryLevel: ResponsibilityLevel;
  secondaryAreas?: ResponsibilityArea[];
  secondaryLevels?: ResponsibilityLevel[];
  description: string;
  mandateAuthority: string;
  keyActors: string[];
}

export interface GovernancePeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  level: ResponsibilityLevel;
  areas: ResponsibilityArea[];
  parties: string[];
  primeMinister?: string;
  keyMinisters?: Array<{ area: ResponsibilityArea; name: string; party: string }>;
}

export interface MandateHolder {
  id: string;
  name: string;
  party: string;
  role: string;
  areas: ResponsibilityArea[];
  level: ResponsibilityLevel;
  startDate: string;
  endDate: string | null;
  governancePeriodId: string;
}

/**
 * ANSVARSOMRÅDEN - Etiketter
 */
export const AREA_LABELS: Record<ResponsibilityArea, { sv: string; en: string; icon: string }> = {
  halsa: { sv: 'Hälsa & Sjukvård', en: 'Health & Healthcare', icon: '🏥' },
  arbete: { sv: 'Arbete & Sysselsättning', en: 'Employment', icon: '💼' },
  utbildning: { sv: 'Utbildning', en: 'Education', icon: '📚' },
  trygghet: { sv: 'Trygghet & Brottslighet', en: 'Safety & Crime', icon: '🛡️' },
  ekonomi: { sv: 'Ekonomi & Skatter', en: 'Economy & Taxes', icon: '💰' },
  infrastruktur: { sv: 'Infrastruktur & Bostad', en: 'Infrastructure & Housing', icon: '🏗️' },
  integration: { sv: 'Integration & Migration', en: 'Integration & Migration', icon: '🤝' },
  miljo: { sv: 'Miljö & Energi', en: 'Environment & Energy', icon: '🌿' },
};

/**
 * MANDATNIVÅER - Etiketter
 */
export const LEVEL_LABELS: Record<ResponsibilityLevel, { sv: string; en: string }> = {
  nationell: { sv: 'Nationell (Regering/Riksdag)', en: 'National (Government/Parliament)' },
  regional: { sv: 'Regional (Region/Landsting)', en: 'Regional' },
  kommunal: { sv: 'Kommunal (Kommun)', en: 'Municipal' },
};

/**
 * KPI-KATEGORI → ANSVARSOMRÅDE MAPPNING
 */
export const KPI_RESPONSIBILITY_MAP: ResponsibilityMapping[] = [
  {
    kpiCategory: 'demografi_halsa',
    primaryArea: 'halsa',
    primaryLevel: 'regional',
    secondaryAreas: ['arbete'],
    secondaryLevels: ['nationell'],
    description: 'Hälsa och vård är primärt regionalt ansvar, men nationell reglering påverkar starkt.',
    mandateAuthority: 'Regioner (SKR)',
    keyActors: ['Socialminister', 'Regionråd', 'Socialstyrelsen'],
  },
  {
    kpiCategory: 'arbete_produktivitet',
    primaryArea: 'arbete',
    primaryLevel: 'nationell',
    secondaryAreas: ['utbildning', 'ekonomi'],
    secondaryLevels: ['kommunal'],
    description: 'Arbetsmarknadspolitik är nationellt ansvar, men kommuner ansvarar för vuxenutbildning.',
    mandateAuthority: 'Arbetsmarknadsdepartementet',
    keyActors: ['Arbetsmarknadsminister', 'Arbetsförmedlingen', 'Kommuner'],
  },
  {
    kpiCategory: 'ekonomisk_barkraft',
    primaryArea: 'ekonomi',
    primaryLevel: 'nationell',
    secondaryAreas: [],
    secondaryLevels: ['kommunal', 'regional'],
    description: 'Finanspolitik och skatter är nationellt ansvar.',
    mandateAuthority: 'Finansdepartementet',
    keyActors: ['Finansminister', 'Riksbanken', 'ESV'],
  },
  {
    kpiCategory: 'social_stabilitet',
    primaryArea: 'trygghet',
    primaryLevel: 'nationell',
    secondaryAreas: ['integration'],
    secondaryLevels: ['kommunal'],
    description: 'Rättsväsende nationellt, men socialtjänst och integration kommunalt.',
    mandateAuthority: 'Justitiedepartementet',
    keyActors: ['Justitieminister', 'Polisen', 'Socialtjänsten'],
  },
  {
    kpiCategory: 'karnsystem_funktion',
    primaryArea: 'utbildning',
    primaryLevel: 'kommunal',
    secondaryAreas: ['halsa'],
    secondaryLevels: ['nationell', 'regional'],
    description: 'Skola är kommunalt ansvar, vård regionalt, rättsväsende nationellt.',
    mandateAuthority: 'Varierar per kärnsystem',
    keyActors: ['Utbildningsminister', 'Socialminister', 'Kommuner', 'Regioner'],
  },
  {
    kpiCategory: 'infrastruktur',
    primaryArea: 'infrastruktur',
    primaryLevel: 'nationell',
    secondaryAreas: ['miljo'],
    secondaryLevels: ['kommunal', 'regional'],
    description: 'Nationell infrastruktur statligt, bostäder kommunalt ansvar.',
    mandateAuthority: 'Infrastrukturdepartementet',
    keyActors: ['Infrastrukturminister', 'Trafikverket', 'Boverket', 'Kommuner'],
  },
  {
    kpiCategory: 'systemrisk_styrning',
    primaryArea: 'ekonomi',
    primaryLevel: 'nationell',
    secondaryAreas: ['trygghet'],
    secondaryLevels: [],
    description: 'Systemstyrning och riskhantering är nationellt ansvar.',
    mandateAuthority: 'Statsrådsberedningen',
    keyActors: ['Statsminister', 'Finansminister', 'MSB'],
  },
];

/**
 * SVENSKA STYRPERIODER (Historiska + nuvarande)
 */
export const SWEDISH_GOVERNANCE_PERIODS: GovernancePeriod[] = [
  {
    id: 'kristersson_2022',
    name: 'Regeringen Kristersson',
    startDate: '2022-10-18',
    endDate: null,
    level: 'nationell',
    areas: ['halsa', 'arbete', 'utbildning', 'trygghet', 'ekonomi', 'infrastruktur', 'integration', 'miljo'],
    parties: ['M', 'KD', 'L'],
    primeMinister: 'Ulf Kristersson',
    keyMinisters: [
      { area: 'ekonomi', name: 'Elisabeth Svantesson', party: 'M' },
      { area: 'arbete', name: 'Johan Pehrson', party: 'L' },
      { area: 'trygghet', name: 'Gunnar Strömmer', party: 'M' },
      { area: 'halsa', name: 'Acko Ankarberg Johansson', party: 'KD' },
      { area: 'utbildning', name: 'Lotta Edholm', party: 'L' },
    ],
  },
  {
    id: 'andersson_2021',
    name: 'Regeringen Andersson',
    startDate: '2021-11-30',
    endDate: '2022-10-17',
    level: 'nationell',
    areas: ['halsa', 'arbete', 'utbildning', 'trygghet', 'ekonomi', 'infrastruktur', 'integration', 'miljo'],
    parties: ['S'],
    primeMinister: 'Magdalena Andersson',
    keyMinisters: [
      { area: 'ekonomi', name: 'Mikael Damberg', party: 'S' },
      { area: 'arbete', name: 'Eva Nordmark', party: 'S' },
    ],
  },
  {
    id: 'lofven_2019',
    name: 'Regeringen Löfven III',
    startDate: '2019-01-21',
    endDate: '2021-11-29',
    level: 'nationell',
    areas: ['halsa', 'arbete', 'utbildning', 'trygghet', 'ekonomi', 'infrastruktur', 'integration', 'miljo'],
    parties: ['S', 'MP'],
    primeMinister: 'Stefan Löfven',
    keyMinisters: [
      { area: 'ekonomi', name: 'Magdalena Andersson', party: 'S' },
    ],
  },
  {
    id: 'lofven_2014',
    name: 'Regeringen Löfven I',
    startDate: '2014-10-03',
    endDate: '2019-01-20',
    level: 'nationell',
    areas: ['halsa', 'arbete', 'utbildning', 'trygghet', 'ekonomi', 'infrastruktur', 'integration', 'miljo'],
    parties: ['S', 'MP'],
    primeMinister: 'Stefan Löfven',
    keyMinisters: [
      { area: 'ekonomi', name: 'Magdalena Andersson', party: 'S' },
      { area: 'integration', name: 'Morgan Johansson', party: 'S' },
    ],
  },
  {
    id: 'reinfeldt_2010',
    name: 'Regeringen Reinfeldt II',
    startDate: '2010-10-05',
    endDate: '2014-10-02',
    level: 'nationell',
    areas: ['halsa', 'arbete', 'utbildning', 'trygghet', 'ekonomi', 'infrastruktur', 'integration', 'miljo'],
    parties: ['M', 'C', 'FP', 'KD'],
    primeMinister: 'Fredrik Reinfeldt',
    keyMinisters: [
      { area: 'ekonomi', name: 'Anders Borg', party: 'M' },
      { area: 'arbete', name: 'Hillevi Engström', party: 'M' },
    ],
  },
  {
    id: 'reinfeldt_2006',
    name: 'Regeringen Reinfeldt I',
    startDate: '2006-10-06',
    endDate: '2010-10-04',
    level: 'nationell',
    areas: ['halsa', 'arbete', 'utbildning', 'trygghet', 'ekonomi', 'infrastruktur', 'integration', 'miljo'],
    parties: ['M', 'C', 'FP', 'KD'],
    primeMinister: 'Fredrik Reinfeldt',
    keyMinisters: [
      { area: 'ekonomi', name: 'Anders Borg', party: 'M' },
    ],
  },
];

/**
 * PARTIFÄRGER
 */
export const PARTY_COLORS: Record<string, string> = {
  'S': '#ED1C24',
  'M': '#52BDEC',
  'SD': '#DDDD00',
  'C': '#009933',
  'V': '#DA291C',
  'KD': '#000077',
  'L': '#006AB3',
  'MP': '#83CF39',
  'FP': '#006AB3', // Gamla Folkpartiet
};

/**
 * Hitta styrperiod för ett datum
 */
export function getGovernancePeriodForDate(
  date: Date,
  level: ResponsibilityLevel = 'nationell'
): GovernancePeriod | null {
  return SWEDISH_GOVERNANCE_PERIODS.find(period => {
    if (period.level !== level) return false;
    const start = new Date(period.startDate);
    const end = period.endDate ? new Date(period.endDate) : new Date();
    return date >= start && date <= end;
  }) || null;
}

/**
 * Hitta ansvarig minister för ett område vid ett datum
 */
export function getResponsibleMinister(
  area: ResponsibilityArea,
  date: Date
): { name: string; party: string; period: string } | null {
  const period = getGovernancePeriodForDate(date, 'nationell');
  if (!period) return null;

  const minister = period.keyMinisters?.find(m => m.area === area);
  if (minister) {
    return {
      name: minister.name,
      party: minister.party,
      period: period.name,
    };
  }

  // Fallback till statsminister
  if (period.primeMinister) {
    return {
      name: period.primeMinister,
      party: period.parties[0],
      period: period.name,
    };
  }

  return null;
}

/**
 * Hämta ansvarskedja för en KPI-kategori
 */
export function getResponsibilityChain(kpiCategory: string): {
  primary: ResponsibilityMapping;
  periods: GovernancePeriod[];
  currentPeriod: GovernancePeriod | null;
} | null {
  const mapping = KPI_RESPONSIBILITY_MAP.find(m => m.kpiCategory === kpiCategory);
  if (!mapping) return null;

  const now = new Date();
  const currentPeriod = getGovernancePeriodForDate(now, mapping.primaryLevel);
  
  // Hämta relevanta perioder för detta ansvarsområde
  const periods = SWEDISH_GOVERNANCE_PERIODS.filter(p => 
    p.areas.includes(mapping.primaryArea)
  );

  return {
    primary: mapping,
    periods,
    currentPeriod,
  };
}

/**
 * Generera ansvarssträng för visning
 */
export function formatResponsibilityText(
  kpiCategory: string,
  date: Date = new Date()
): string {
  const chain = getResponsibilityChain(kpiCategory);
  if (!chain) return 'Ansvar oklart';

  const { primary, currentPeriod } = chain;
  const levelLabel = LEVEL_LABELS[primary.primaryLevel].sv;
  const areaLabel = AREA_LABELS[primary.primaryArea].sv;

  let text = `${areaLabel} (${levelLabel})`;
  
  if (currentPeriod) {
    text += ` – ${currentPeriod.name}`;
  }

  return text;
}

/**
 * UTFALLSKLASSIFICERING
 */
export type OutcomeType = 'positive' | 'neutral' | 'negative' | 'unclear';

export interface OutcomeClassification {
  type: OutcomeType;
  label: { sv: string; en: string };
  description: { sv: string; en: string };
  color: string;
}

export const OUTCOME_CLASSIFICATIONS: Record<OutcomeType, OutcomeClassification> = {
  positive: {
    type: 'positive',
    label: { sv: 'Förbättring', en: 'Improvement' },
    description: { sv: 'Mätbar förbättring inom rimligt lag-fönster', en: 'Measurable improvement within reasonable lag window' },
    color: 'text-chart-2',
  },
  neutral: {
    type: 'neutral',
    label: { sv: 'Ingen effekt', en: 'No effect' },
    description: { sv: 'Ingen tydlig förändring', en: 'No clear change' },
    color: 'text-muted-foreground',
  },
  negative: {
    type: 'negative',
    label: { sv: 'Försämring', en: 'Decline' },
    description: { sv: 'Försämring eller accelererad negativ trend', en: 'Decline or accelerated negative trend' },
    color: 'text-chart-5',
  },
  unclear: {
    type: 'unclear',
    label: { sv: 'Oklart', en: 'Unclear' },
    description: { sv: 'För tidigt att bedöma eller otillräckliga data', en: 'Too early to assess or insufficient data' },
    color: 'text-muted-foreground',
  },
};
