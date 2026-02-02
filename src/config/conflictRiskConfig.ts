/**
 * 🌐 MASTER EXECUTION BLOCK 37
 * 
 * GLOBAL POWER, CONFLICT & RISK LAYER (NON-OPERATIVE)
 * 
 * ÖVERORDNAT SYFTE:
 * Att göra strukturella orsaker till konflikt och maktobalans begripliga,
 * INTE att simulera krig eller optimera våld.
 * 
 * Detta är geopolitisk transparens, inte militär analys.
 */

// ============================================================
// STRICT CONTENT BOUNDARIES
// ============================================================

export const ALLOWED_CONTENT = [
  'military_capacity_categories',      // Grova kategorier
  'public_defense_budgets',            // Offentliga försvarsbudgetar
  'personnel_size_historical',         // Avrundat, historiskt
  'doctrinal_orientation',             // Försvar / expeditionärt / avskräckning
  'alliances_dependencies',            // Allianser & beroenden
  'historical_conflicts_patterns',     // Historiska konflikter & mönster
  'risk_factors_structural',           // Resurser, ekonomi, demografi, geografi
] as const;

export const FORBIDDEN_CONTENT = [
  'exact_troop_movements',             // ❌ Exakta truppförflyttningar
  'operational_plans',                 // ❌ Operativa planer
  'tactical_simulations',              // ❌ Taktiska simuleringar
  'detailed_weapon_systems',           // ❌ Vapensystem på detaljnivå
  'outcome_predictions',               // ❌ "Vem vinner om…"
  'violence_optimization',             // ❌ Optimering av våld
  'sub_national_military_detail',      // ❌ Under nationell nivå
] as const;

// ============================================================
// ETHICS LAYER (MANDATORY ON ALL VIEWS)
// ============================================================

export const ETHICS_DISCLAIMER = {
  sv: {
    banner: 'Denna information tillhandahålls för att förklara strukturell risk och maktfördelning. Den är inte avsedd för militär planering eller operativt bruk.',
    limitations_title: 'Vad detta INTE visar',
    limitations: [
      'Exakta militära positioner eller förflyttningar',
      'Operativa planer eller taktiska detaljer',
      'Prognoser om konfliktutfall',
      'Information som kan användas för våld',
    ],
    purpose_title: 'Syfte',
    purpose: 'Att göra maktstrukturer och riskfaktorer begripliga för medborgare, journalister och beslutsfattare.',
  },
  en: {
    banner: 'This information is provided to explain structural risk and power distribution. It is not intended for military planning or operational use.',
    limitations_title: 'What this does NOT show',
    limitations: [
      'Exact military positions or movements',
      'Operational plans or tactical details',
      'Predictions of conflict outcomes',
      'Information that could be used for violence',
    ],
    purpose_title: 'Purpose',
    purpose: 'To make power structures and risk factors understandable for citizens, journalists, and decision-makers.',
  },
};

// ============================================================
// STRUCTURAL DRIVERS OF CONFLICT
// ============================================================

export interface ConflictDriver {
  id: string;
  category: string;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  indicators: string[];
  historical_note: { sv: string; en: string };
}

export const CONFLICT_DRIVERS: ConflictDriver[] = [
  {
    id: 'resource_stress',
    category: 'economic',
    name: {
      sv: 'Resursstress',
      en: 'Resource stress',
    },
    description: {
      sv: 'Konkurrens om energi, vatten, mat och kritiska råvaror.',
      en: 'Competition over energy, water, food, and critical raw materials.',
    },
    indicators: ['energy_dependency', 'water_scarcity', 'food_security_index', 'critical_mineral_access'],
    historical_note: {
      sv: 'Historisk data visar att resursknapphet sällan orsakar konflikt ensamt, men ofta förstärker existerande spänningar.',
      en: 'Historical data shows that resource scarcity rarely causes conflict alone, but often amplifies existing tensions.',
    },
  },
  {
    id: 'economic_collapse',
    category: 'economic',
    name: {
      sv: 'Ekonomisk kollaps & skuldkriser',
      en: 'Economic collapse & debt crises',
    },
    description: {
      sv: 'Plötsliga ekonomiska nedgångar, hyperinflation eller ohållbar skuldsättning.',
      en: 'Sudden economic downturns, hyperinflation, or unsustainable debt levels.',
    },
    indicators: ['gdp_change_rate', 'inflation_rate', 'debt_to_gdp', 'currency_stability'],
    historical_note: {
      sv: 'Ekonomiska kriser har historiskt korrelerat med ökad politisk instabilitet och i vissa fall väpnade konflikter.',
      en: 'Economic crises have historically correlated with increased political instability and in some cases armed conflict.',
    },
  },
  {
    id: 'institutional_weakness',
    category: 'governance',
    name: {
      sv: 'Institutionell svaghet',
      en: 'Institutional weakness',
    },
    description: {
      sv: 'Svaga eller korrupta institutioner som inte kan hantera samhälleliga spänningar.',
      en: 'Weak or corrupt institutions unable to manage societal tensions.',
    },
    indicators: ['governance_effectiveness', 'rule_of_law_index', 'corruption_perception', 'state_fragility'],
    historical_note: {
      sv: 'Starka institutioner fungerar som buffertar mot eskalering; svaga institutioner ökar risken för att spänningar övergår i våld.',
      en: 'Strong institutions act as buffers against escalation; weak institutions increase the risk of tensions turning violent.',
    },
  },
  {
    id: 'demographic_imbalance',
    category: 'social',
    name: {
      sv: 'Demografiska obalanser',
      en: 'Demographic imbalances',
    },
    description: {
      sv: 'Snabba befolkningsförändringar, ungdomsbulor, eller etniska/religiösa spänningar.',
      en: 'Rapid population changes, youth bulges, or ethnic/religious tensions.',
    },
    indicators: ['youth_unemployment', 'population_growth_rate', 'ethnic_fractionalization', 'migration_pressure'],
    historical_note: {
      sv: 'Hög ungdomsarbetslöshet i kombination med svaga institutioner har historiskt ökat risken för interna konflikter.',
      en: 'High youth unemployment combined with weak institutions has historically increased the risk of internal conflicts.',
    },
  },
  {
    id: 'geographic_chokepoints',
    category: 'strategic',
    name: {
      sv: 'Geografiska flaskhalsar',
      en: 'Geographic chokepoints',
    },
    description: {
      sv: 'Strategiska platser som kontrollerar handel, energiflöden eller militär tillgång.',
      en: 'Strategic locations controlling trade, energy flows, or military access.',
    },
    indicators: ['trade_route_dependency', 'energy_transit', 'strategic_location_index'],
    historical_note: {
      sv: 'Historiskt har kontroll över flaskhalsar (sund, kanaler, pass) varit en återkommande källa till geopolitisk spänning.',
      en: 'Historically, control over chokepoints (straits, canals, passes) has been a recurring source of geopolitical tension.',
    },
  },
  {
    id: 'security_dilemma',
    category: 'strategic',
    name: {
      sv: 'Säkerhetsdilemman',
      en: 'Security dilemmas',
    },
    description: {
      sv: 'Upprustning som svar på upplevt hot, vilket skapar spiral av misstro.',
      en: 'Arms buildup in response to perceived threat, creating spirals of mistrust.',
    },
    indicators: ['military_spending_change', 'arms_imports', 'alliance_shifts', 'border_militarization'],
    historical_note: {
      sv: 'Klassiska säkerhetsdilemman har föregått flera historiska konflikter, inklusive Första världskriget.',
      en: 'Classic security dilemmas have preceded several historical conflicts, including World War I.',
    },
  },
];

// ============================================================
// MILITARY CAPACITY CATEGORIES (INDEXED, NOT ABSOLUTE)
// ============================================================

export interface CapacityCategory {
  id: string;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  what_it_measures: { sv: string; en: string };
  limitations: { sv: string; en: string };
}

export const CAPACITY_CATEGORIES: CapacityCategory[] = [
  {
    id: 'personnel_index',
    name: { sv: 'Personalstyrka (index)', en: 'Personnel strength (index)' },
    description: {
      sv: 'Relativ storlek på aktiv militär personal, indexerat mot globalt genomsnitt.',
      en: 'Relative size of active military personnel, indexed against global average.',
    },
    what_it_measures: {
      sv: 'Numerisk kapacitet, inte kvalitet eller effektivitet.',
      en: 'Numerical capacity, not quality or effectiveness.',
    },
    limitations: {
      sv: 'Säger inget om träning, moral, utrustning eller doktrin.',
      en: 'Says nothing about training, morale, equipment, or doctrine.',
    },
  },
  {
    id: 'budget_ppp',
    name: { sv: 'Försvarsbudget (PPP)', en: 'Defense budget (PPP)' },
    description: {
      sv: 'Försvarsutgifter justerade för köpkraftsparitet.',
      en: 'Defense spending adjusted for purchasing power parity.',
    },
    what_it_measures: {
      sv: 'Ekonomiska resurser allokerade till försvar.',
      en: 'Economic resources allocated to defense.',
    },
    limitations: {
      sv: 'Höga utgifter garanterar inte effektivitet; korruption och ineffektivitet varierar.',
      en: 'High spending does not guarantee effectiveness; corruption and inefficiency vary.',
    },
  },
  {
    id: 'tech_breadth',
    name: { sv: 'Teknologisk bredd', en: 'Technological breadth' },
    description: {
      sv: 'Tillgång till olika teknologiska domäner (cyber, rymd, precision, etc.).',
      en: 'Access to various technological domains (cyber, space, precision, etc.).',
    },
    what_it_measures: {
      sv: 'Förmåga att verka i flera domäner samtidigt.',
      en: 'Ability to operate across multiple domains simultaneously.',
    },
    limitations: {
      sv: 'Mäter bredd, inte djup eller integration.',
      en: 'Measures breadth, not depth or integration.',
    },
  },
  {
    id: 'global_reach',
    name: { sv: 'Global räckvidd', en: 'Global reach' },
    description: {
      sv: 'Kapacitet att projicera makt bortom egna gränser.',
      en: 'Capacity to project power beyond own borders.',
    },
    what_it_measures: {
      sv: 'Strategisk mobilitet och expeditionär förmåga.',
      en: 'Strategic mobility and expeditionary capability.',
    },
    limitations: {
      sv: 'Räckvidd säger inget om politisk vilja eller uthållighet.',
      en: 'Reach says nothing about political will or sustainability.',
    },
  },
  {
    id: 'logistic_endurance',
    name: { sv: 'Logistisk uthållighet', en: 'Logistic endurance' },
    description: {
      sv: 'Förmåga att upprätthålla operationer över tid.',
      en: 'Ability to sustain operations over time.',
    },
    what_it_measures: {
      sv: 'Försörjningskedjor, lager, industriell bas.',
      en: 'Supply chains, stockpiles, industrial base.',
    },
    limitations: {
      sv: 'Svårt att mäta exakt; baseras på indikatorer.',
      en: 'Difficult to measure precisely; based on indicators.',
    },
  },
];

// ============================================================
// RISK LEVELS (SCENARIO WITHOUT WAR GAMES)
// ============================================================

export interface RiskIndicator {
  id: string;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  weight_range: [number, number]; // 0-100
  data_sources: string[];
}

export const RISK_INDICATORS: RiskIndicator[] = [
  {
    id: 'military_budget_surge',
    name: { sv: 'Militär budgetökning', en: 'Military budget surge' },
    description: {
      sv: 'Snabb ökning av försvarsutgifter relativt ekonomisk kapacitet.',
      en: 'Rapid increase in defense spending relative to economic capacity.',
    },
    weight_range: [0, 25],
    data_sources: ['SIPRI', 'World Bank', 'IMF'],
  },
  {
    id: 'economic_decline',
    name: { sv: 'Ekonomisk nedgång', en: 'Economic decline' },
    description: {
      sv: 'BNP-kontraktion, stigande arbetslöshet, valutakris.',
      en: 'GDP contraction, rising unemployment, currency crisis.',
    },
    weight_range: [0, 25],
    data_sources: ['World Bank', 'IMF', 'National statistics'],
  },
  {
    id: 'demographic_pressure',
    name: { sv: 'Demografiskt tryck', en: 'Demographic pressure' },
    description: {
      sv: 'Snabb befolkningsförändring kombinerat med låg institutionell kapacitet.',
      en: 'Rapid population change combined with low institutional capacity.',
    },
    weight_range: [0, 20],
    data_sources: ['UN Population Division', 'World Bank'],
  },
  {
    id: 'resource_dependency',
    name: { sv: 'Resursberoende', en: 'Resource dependency' },
    description: {
      sv: 'Hög beroendegrad av externa resurser (energi, mat, mineraler).',
      en: 'High dependency on external resources (energy, food, minerals).',
    },
    weight_range: [0, 15],
    data_sources: ['IEA', 'FAO', 'USGS'],
  },
  {
    id: 'institutional_fragility',
    name: { sv: 'Institutionell bräcklighet', en: 'Institutional fragility' },
    description: {
      sv: 'Svag styrning, låg rättssäkerhet, hög korruption.',
      en: 'Weak governance, low rule of law, high corruption.',
    },
    weight_range: [0, 15],
    data_sources: ['World Bank Governance Indicators', 'Transparency International'],
  },
];

// ============================================================
// GLOBAL HEADER & FOOTER FOR CONFLICT LAYER
// ============================================================

export const CONFLICT_LAYER_HEADER = {
  title: {
    sv: 'Makt, konflikt & strukturell risk',
    en: 'Power, conflict & structural risk',
  },
  subtitle: {
    sv: 'Strategisk översikt baserad på offentlig data. Icke-operativ.',
    en: 'Strategic overview based on public data. Non-operative.',
  },
};

export const CONFLICT_LAYER_FOOTER = {
  disclaimer: {
    sv: 'Denna analys beskriver observerade mönster och strukturella faktorer. Den förutsäger inte utfall, rekommenderar inga åtgärder och kan inte användas för militär planering.',
    en: 'This analysis describes observed patterns and structural factors. It does not predict outcomes, recommend actions, or support military planning.',
  },
};

// ============================================================
// DRILL-DOWN LIMITS (STRICT)
// ============================================================

export const DRILL_DOWN_LIMITS = {
  allowed: ['global', 'region', 'country'] as const,
  forbidden: ['municipality', 'city', 'base', 'exact_location'] as const,
  reason: {
    sv: 'Militär analys stannar alltid över kommunnivå för att förhindra operativt missbruk.',
    en: 'Military analysis always stops above municipal level to prevent operational misuse.',
  },
};

export type AllowedDrillLevel = typeof DRILL_DOWN_LIMITS.allowed[number];
