// ═══════════════════════════════════════════════════════════════════════════
// ANSVARSMODELL FÖR SVERIGE — Komplett karta
// ═══════════════════════════════════════════════════════════════════════════
//
// Detta dokument definierar:
// 1. Alla ansvarsområden i det svenska samhällssystemet
// 2. Vem som bär ansvar på varje nivå
// 3. Hur KPI:er mappas till ansvar
// 4. Tidsperioder och mandatkedjor
//
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// ANSVARSOMRÅDEN
// ═══════════════════════════════════════════════════════════════════════════

export type ResponsibilityArea =
  | 'halsa'           // Hälso- och sjukvård
  | 'arbete'          // Arbetsmarknad och sysselsättning
  | 'utbildning'      // Skola och utbildning
  | 'trygghet'        // Rättsväsende och säkerhet
  | 'ekonomi'         // Statsfinanser och ekonomisk politik
  | 'infrastruktur'   // Transport, energi, bostad
  | 'integration'     // Migration och etablering
  | 'miljo'           // Klimat och miljö
  | 'forsvar'         // Försvar och säkerhet
  | 'utrikes'         // Utrikespolitik
  | 'social'          // Socialförsäkring och välfärd
  | 'naringsliv'      // Näringspolitik
  | 'kultur'          // Kultur och demokrati
  | 'digitalisering'; // Digital infrastruktur

export type ResponsibilityLevel = 'nationell' | 'regional' | 'kommunal';

// ═══════════════════════════════════════════════════════════════════════════
// ANSVARSOMRÅDENAS DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

export interface AreaDefinition {
  code: ResponsibilityArea;
  name: string;
  description: string;
  
  // Vem har primärt ansvar på varje nivå
  nationalAuthority: string;         // Departement/myndighet
  regionalAuthority?: string;        // Regionalt organ
  municipalAuthority?: string;       // Kommunalt organ
  
  // Vilka KPI:er som primärt hör hit
  primaryKpiCodes: string[];
  secondaryKpiCodes: string[];
  
  // Relaterade områden
  relatedAreas: ResponsibilityArea[];
}

export const RESPONSIBILITY_AREAS: AreaDefinition[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // HÄLSA
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'halsa',
    name: 'Hälso- och sjukvård',
    description: 'Vård, omsorg och folkhälsa',
    nationalAuthority: 'Socialdepartementet',
    regionalAuthority: 'Region (Hälso- och sjukvårdsnämnd)',
    municipalAuthority: 'Kommun (Omsorgsnämnd)',
    primaryKpiCodes: ['life_expectancy', 'health_cost', 'wait_times'],
    secondaryKpiCodes: ['dependency_ratio', 'sick_leave'],
    relatedAreas: ['social', 'arbete'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // ARBETE
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'arbete',
    name: 'Arbetsmarknad och sysselsättning',
    description: 'Sysselsättning, arbetslöshet och arbetsmarknadspolitik',
    nationalAuthority: 'Arbetsmarknadsdepartementet',
    regionalAuthority: 'Arbetsförmedlingen (regional)',
    municipalAuthority: 'Kommun (Arbetsmarknadsnämnd)',
    primaryKpiCodes: ['employment_rate', 'unemployment', 'labor_participation'],
    secondaryKpiCodes: ['productivity', 'gdp_per_capita', 'long_term_unemployed'],
    relatedAreas: ['utbildning', 'integration', 'naringsliv'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // UTBILDNING
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'utbildning',
    name: 'Skola och utbildning',
    description: 'Grundskola, gymnasium, högskola och vuxenutbildning',
    nationalAuthority: 'Utbildningsdepartementet',
    municipalAuthority: 'Kommun (Barn- och utbildningsnämnd)',
    primaryKpiCodes: ['pisa_score', 'graduation_rate', 'higher_education'],
    secondaryKpiCodes: ['neet_rate', 'teacher_density'],
    relatedAreas: ['arbete', 'integration'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // TRYGGHET
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'trygghet',
    name: 'Rättsväsende och säkerhet',
    description: 'Polis, rättsväsende, kriminalvård och trygghet',
    nationalAuthority: 'Justitiedepartementet',
    primaryKpiCodes: ['violent_crime', 'trust_police', 'clearance_rate'],
    secondaryKpiCodes: ['homicides', 'theft_robbery', 'prison_population'],
    relatedAreas: ['social', 'integration'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // EKONOMI
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'ekonomi',
    name: 'Statsfinanser och ekonomisk politik',
    description: 'Budget, skatter, statsskuld och penningpolitik',
    nationalAuthority: 'Finansdepartementet',
    primaryKpiCodes: ['gdp_growth', 'debt_ratio', 'inflation'],
    secondaryKpiCodes: ['tax_revenue', 'budget_balance', 'interest_rates'],
    relatedAreas: ['naringsliv', 'arbete'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // INFRASTRUKTUR
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'infrastruktur',
    name: 'Transport, energi och bostad',
    description: 'Vägar, järnväg, energi, elnät och bostadsbyggande',
    nationalAuthority: 'Infrastrukturdepartementet',
    regionalAuthority: 'Region (Kollektivtrafiknämnd)',
    municipalAuthority: 'Kommun (Samhällsbyggnadsnämnd)',
    primaryKpiCodes: ['housing_construction', 'energy_price', 'grid_stability'],
    secondaryKpiCodes: ['commute_time', 'renewable_share', 'transport_emissions'],
    relatedAreas: ['miljo', 'naringsliv'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // INTEGRATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'integration',
    name: 'Migration och etablering',
    description: 'Invandring, etablering och integration',
    nationalAuthority: 'Arbetsmarknadsdepartementet',
    municipalAuthority: 'Kommun (Integrationsnämnd)',
    primaryKpiCodes: ['employment_foreign_born', 'establishment_time'],
    secondaryKpiCodes: ['segregation_index', 'language_proficiency'],
    relatedAreas: ['arbete', 'utbildning', 'social'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // MILJÖ
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'miljo',
    name: 'Klimat och miljö',
    description: 'Klimatpolitik, utsläpp och miljöskydd',
    nationalAuthority: 'Klimat- och miljödepartementet',
    municipalAuthority: 'Kommun (Miljönämnd)',
    primaryKpiCodes: ['co2_emissions', 'renewable_share', 'biodiversity'],
    secondaryKpiCodes: ['air_quality', 'recycling_rate'],
    relatedAreas: ['infrastruktur', 'naringsliv'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // FÖRSVAR
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'forsvar',
    name: 'Försvar och säkerhet',
    description: 'Försvarsmakten, totalförsvar och krishantering',
    nationalAuthority: 'Försvarsdepartementet',
    primaryKpiCodes: ['defense_spending', 'military_readiness'],
    secondaryKpiCodes: ['civil_defense', 'cyber_security'],
    relatedAreas: ['utrikes', 'infrastruktur'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // UTRIKES
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'utrikes',
    name: 'Utrikespolitik',
    description: 'Utrikespolitik, EU och internationella relationer',
    nationalAuthority: 'Utrikesdepartementet',
    primaryKpiCodes: ['foreign_aid', 'trade_balance'],
    secondaryKpiCodes: ['eu_influence', 'diplomatic_reach'],
    relatedAreas: ['forsvar', 'ekonomi'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // SOCIAL
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'social',
    name: 'Socialförsäkring och välfärd',
    description: 'Pension, sjukförsäkring, barnbidrag och socialtjänst',
    nationalAuthority: 'Socialdepartementet',
    municipalAuthority: 'Kommun (Socialnämnd)',
    primaryKpiCodes: ['poverty_rate', 'gini_coefficient', 'child_poverty'],
    secondaryKpiCodes: ['pension_adequacy', 'social_assistance'],
    relatedAreas: ['halsa', 'arbete'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // NÄRINGSLIV
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'naringsliv',
    name: 'Näringspolitik',
    description: 'Företagande, innovation och konkurrenskraft',
    nationalAuthority: 'Näringsdepartementet',
    primaryKpiCodes: ['business_creation', 'innovation_index', 'exports'],
    secondaryKpiCodes: ['startup_survival', 'rd_spending'],
    relatedAreas: ['arbete', 'utbildning', 'ekonomi'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // KULTUR
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'kultur',
    name: 'Kultur och demokrati',
    description: 'Kultur, medier, demokrati och civilsamhälle',
    nationalAuthority: 'Kulturdepartementet',
    regionalAuthority: 'Region (Kulturnämnd)',
    municipalAuthority: 'Kommun (Kulturnämnd)',
    primaryKpiCodes: ['voter_turnout', 'trust_institutions', 'media_freedom'],
    secondaryKpiCodes: ['cultural_participation', 'civil_society'],
    relatedAreas: ['utbildning'],
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // DIGITALISERING
  // ─────────────────────────────────────────────────────────────────────────
  {
    code: 'digitalisering',
    name: 'Digital infrastruktur',
    description: 'Bredband, digitalisering och e-förvaltning',
    nationalAuthority: 'Infrastrukturdepartementet',
    municipalAuthority: 'Kommun (IT-nämnd)',
    primaryKpiCodes: ['broadband_coverage', 'digital_services', 'cyber_readiness'],
    secondaryKpiCodes: ['digital_literacy', 'e_government'],
    relatedAreas: ['infrastruktur', 'naringsliv'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MANDATNIVÅER
// ═══════════════════════════════════════════════════════════════════════════

export interface MandateLevel {
  level: ResponsibilityLevel;
  name: string;
  description: string;
  topPosition: string;
  electorate: string;
  mandatePeriod: string;
}

export const MANDATE_LEVELS: MandateLevel[] = [
  {
    level: 'nationell',
    name: 'Nationell nivå',
    description: 'Riksdag och regering',
    topPosition: 'Statsminister',
    electorate: 'Alla röstberättigade i Sverige',
    mandatePeriod: '4 år (ordinarie val)',
  },
  {
    level: 'regional',
    name: 'Regional nivå',
    description: 'Regioner (f.d. landsting)',
    topPosition: 'Regionstyrelsens ordförande',
    electorate: 'Röstberättigade i regionen',
    mandatePeriod: '4 år (ordinarie val)',
  },
  {
    level: 'kommunal',
    name: 'Kommunal nivå',
    description: 'Kommuner',
    topPosition: 'Kommunstyrelsens ordförande',
    electorate: 'Röstberättigade i kommunen',
    mandatePeriod: '4 år (ordinarie val)',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// KPI TILL ANSVAR-MAPPNING
// ═══════════════════════════════════════════════════════════════════════════

export interface KpiResponsibilityMapping {
  kpiCode: string;
  primaryArea: ResponsibilityArea;
  primaryLevel: ResponsibilityLevel;
  secondaryAreas?: ResponsibilityArea[];
  secondaryLevels?: ResponsibilityLevel[];
  rationale: string;
}

export const KPI_RESPONSIBILITY_MAP: KpiResponsibilityMapping[] = [
  // DEMOGRAFI & HÄLSA
  {
    kpiCode: 'life_expectancy',
    primaryArea: 'halsa',
    primaryLevel: 'nationell',
    secondaryAreas: ['social'],
    secondaryLevels: ['regional'],
    rationale: 'Folkhälsan styrs primärt av nationell hälsopolitik, men regioner ansvarar för vårdens genomförande.',
  },
  {
    kpiCode: 'fertility_rate',
    primaryArea: 'social',
    primaryLevel: 'nationell',
    rationale: 'Familjepolitik är nationell kompetens.',
  },
  {
    kpiCode: 'dependency_ratio',
    primaryArea: 'ekonomi',
    primaryLevel: 'nationell',
    secondaryAreas: ['halsa', 'arbete'],
    rationale: 'Försörjningskvoten påverkar hela välfärdssystemet.',
  },
  
  // ARBETE & PRODUKTIVITET
  {
    kpiCode: 'employment_rate',
    primaryArea: 'arbete',
    primaryLevel: 'nationell',
    secondaryLevels: ['kommunal'],
    rationale: 'Arbetsmarknadspolitik är nationell, men kommuner har aktiveringsansvar.',
  },
  {
    kpiCode: 'productivity',
    primaryArea: 'naringsliv',
    primaryLevel: 'nationell',
    rationale: 'Produktivitet styrs av nationell närings- och utbildningspolitik.',
  },
  
  // EKONOMISK BÄRKRAFT
  {
    kpiCode: 'gdp_growth',
    primaryArea: 'ekonomi',
    primaryLevel: 'nationell',
    rationale: 'Ekonomisk politik är statsministerns och finansministerns huvudansvar.',
  },
  {
    kpiCode: 'debt_ratio',
    primaryArea: 'ekonomi',
    primaryLevel: 'nationell',
    rationale: 'Statsskuld är direkt regeringsansvar.',
  },
  
  // SOCIAL STABILITET
  {
    kpiCode: 'violent_crime',
    primaryArea: 'trygghet',
    primaryLevel: 'nationell',
    secondaryLevels: ['kommunal'],
    rationale: 'Rättsväsendet är nationellt, men kommuner har brottsförebyggande ansvar.',
  },
  {
    kpiCode: 'gini_coefficient',
    primaryArea: 'social',
    primaryLevel: 'nationell',
    rationale: 'Inkomstfördelning styrs av skatte- och välfärdspolitik.',
  },
  
  // KÄRNSYSTEMENS FUNKTION
  {
    kpiCode: 'wait_times',
    primaryArea: 'halsa',
    primaryLevel: 'regional',
    rationale: 'Vårdköer är direkt regionalt ansvar.',
  },
  {
    kpiCode: 'pisa_score',
    primaryArea: 'utbildning',
    primaryLevel: 'nationell',
    secondaryLevels: ['kommunal'],
    rationale: 'Läroplaner är nationella, men skolor drivs kommunalt.',
  },
  
  // INFRASTRUKTUR
  {
    kpiCode: 'housing_construction',
    primaryArea: 'infrastruktur',
    primaryLevel: 'kommunal',
    secondaryLevels: ['nationell'],
    rationale: 'Kommuner har planmonopol, men bostadspolitik påverkas nationellt.',
  },
  {
    kpiCode: 'grid_stability',
    primaryArea: 'infrastruktur',
    primaryLevel: 'nationell',
    rationale: 'Elnätet och energipolitik är nationell kompetens.',
  },
  
  // SYSTEMRISK
  {
    kpiCode: 'trust_institutions',
    primaryArea: 'kultur',
    primaryLevel: 'nationell',
    rationale: 'Institutionellt förtroende speglar hela styrelseskickets funktion.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// ANSVARSKEDJA — Vem ansvarar för vad
// ═══════════════════════════════════════════════════════════════════════════

export interface ResponsibilityChain {
  role: string;
  level: ResponsibilityLevel;
  areas: ResponsibilityArea[];
  reportsTo?: string;
  masterIndexWeight: number;  // Hur stor del av masterindex som faller på denna
}

export const RESPONSIBILITY_CHAIN: ResponsibilityChain[] = [
  // NATIONELL TOPP
  {
    role: 'Statsminister',
    level: 'nationell',
    areas: ['ekonomi', 'forsvar', 'utrikes'],
    masterIndexWeight: 1.0,  // Bär ytterst hela ansvaret
  },
  {
    role: 'Finansminister',
    level: 'nationell',
    areas: ['ekonomi'],
    reportsTo: 'Statsminister',
    masterIndexWeight: 0.20,
  },
  {
    role: 'Socialminister',
    level: 'nationell',
    areas: ['halsa', 'social'],
    reportsTo: 'Statsminister',
    masterIndexWeight: 0.15,
  },
  {
    role: 'Arbetsmarknadsminister',
    level: 'nationell',
    areas: ['arbete', 'integration'],
    reportsTo: 'Statsminister',
    masterIndexWeight: 0.15,
  },
  {
    role: 'Justitieminister',
    level: 'nationell',
    areas: ['trygghet'],
    reportsTo: 'Statsminister',
    masterIndexWeight: 0.10,
  },
  {
    role: 'Utbildningsminister',
    level: 'nationell',
    areas: ['utbildning'],
    reportsTo: 'Statsminister',
    masterIndexWeight: 0.10,
  },
  {
    role: 'Infrastrukturminister',
    level: 'nationell',
    areas: ['infrastruktur', 'digitalisering'],
    reportsTo: 'Statsminister',
    masterIndexWeight: 0.10,
  },
  {
    role: 'Klimat- och miljöminister',
    level: 'nationell',
    areas: ['miljo'],
    reportsTo: 'Statsminister',
    masterIndexWeight: 0.05,
  },
  {
    role: 'Näringsminister',
    level: 'nationell',
    areas: ['naringsliv'],
    reportsTo: 'Statsminister',
    masterIndexWeight: 0.10,
  },
  {
    role: 'Kulturminister',
    level: 'nationell',
    areas: ['kultur'],
    reportsTo: 'Statsminister',
    masterIndexWeight: 0.03,
  },
  {
    role: 'Försvarsminister',
    level: 'nationell',
    areas: ['forsvar'],
    reportsTo: 'Statsminister',
    masterIndexWeight: 0.02,
  },
  
  // REGIONAL
  {
    role: 'Regionstyrelsens ordförande',
    level: 'regional',
    areas: ['halsa', 'infrastruktur', 'kultur'],
    masterIndexWeight: 0.0,  // Bidrar till regional breakdown, inte nationellt
  },
  
  // KOMMUNAL
  {
    role: 'Kommunstyrelsens ordförande',
    level: 'kommunal',
    areas: ['utbildning', 'social', 'infrastruktur', 'integration'],
    masterIndexWeight: 0.0,  // Bidrar till kommunal breakdown
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HJÄLPFUNKTIONER
// ═══════════════════════════════════════════════════════════════════════════

export function getAreaByCode(code: ResponsibilityArea): AreaDefinition | undefined {
  return RESPONSIBILITY_AREAS.find(a => a.code === code);
}

export function getKpiResponsibility(kpiCode: string): KpiResponsibilityMapping | undefined {
  return KPI_RESPONSIBILITY_MAP.find(m => m.kpiCode === kpiCode);
}

export function getResponsibleRoles(area: ResponsibilityArea): ResponsibilityChain[] {
  return RESPONSIBILITY_CHAIN.filter(r => r.areas.includes(area));
}

export function getPrimaryResponsible(kpiCode: string): ResponsibilityChain | undefined {
  const mapping = getKpiResponsibility(kpiCode);
  if (!mapping) return undefined;
  
  return RESPONSIBILITY_CHAIN.find(
    r => r.areas.includes(mapping.primaryArea) && r.level === mapping.primaryLevel
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const RESPONSIBILITY_MODEL = {
  areas: RESPONSIBILITY_AREAS,
  levels: MANDATE_LEVELS,
  kpiMapping: KPI_RESPONSIBILITY_MAP,
  chain: RESPONSIBILITY_CHAIN,
  getArea: getAreaByCode,
  getKpiResponsibility,
  getResponsibleRoles,
  getPrimaryResponsible,
};

export default RESPONSIBILITY_MODEL;
