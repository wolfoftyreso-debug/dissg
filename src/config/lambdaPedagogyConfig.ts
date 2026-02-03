/**
 * LAMBDA PEDAGOGICAL SYSTEM
 * 
 * "Earn Understanding, Never Ask for Trust"
 * 
 * Complete 5-layer explanation pyramid for Lambda:
 * L0: 18-year-old (15 seconds)
 * L1: Mechanism (what drives it)
 * L2: Method (how it's calculated)
 * L3: Limitations (what it doesn't show)
 * L4: Raw data (full transparency)
 */

// =============================================================================
// L0: LAMBDA FOR 18-YEAR-OLD (15 SECONDS)
// =============================================================================

export const LAMBDA_L0_SIMPLE = {
  headline: {
    en: 'Is the world running well?',
    sv: 'Går världen bra?',
  },
  
  oneSentence: {
    en: 'Lambda measures how close a society is to running smoothly – like a fuel gauge for civilization.',
    sv: 'Lambda mäter hur nära ett samhälle är att fungera smidigt – som en bränslemätare för civilisationen.',
  },
  
  threePoints: {
    en: [
      'λ = 1.0 → Everything balanced. System healthy.',
      'λ < 1.0 → Overloaded. Too much stress somewhere.',
      'λ > 1.0 → Strained. Running too lean.',
    ],
    sv: [
      'λ = 1.0 → Allt i balans. Systemet friskt.',
      'λ < 1.0 → Överbelastat. För mycket stress någonstans.',
      'λ > 1.0 → Ansträngt. Kör för magert.',
    ],
  },
  
  carAnalogy: {
    en: 'Like a car engine: Lambda 1.0 = perfect fuel-air mix = best performance, lowest wear. Same for society.',
    sv: 'Som en bilmotor: Lambda 1.0 = perfekt luft-bränsleblandning = bäst prestanda, minst slitage. Samma för samhället.',
  },
  
  whatItIsNot: {
    en: [
      'Not a political opinion',
      'Not "good" or "bad" judgments',
      'Not telling you what to think',
    ],
    sv: [
      'Inte en politisk åsikt',
      'Inte "bra" eller "dåliga" bedömningar',
      'Talar inte om vad du ska tycka',
    ],
  },
  
  bottomLine: {
    en: 'Lambda shows the instrument panel. You decide where to drive.',
    sv: 'Lambda visar instrumentpanelen. Du bestämmer vart du kör.',
  },
} as const;

// =============================================================================
// L1: MECHANISM (WHAT DRIVES LAMBDA)
// =============================================================================

export const LAMBDA_L1_MECHANISM = {
  title: {
    en: 'What Makes Lambda Move?',
    sv: 'Vad får Lambda att röra sig?',
  },
  
  coreConcept: {
    en: `Lambda aggregates signals from 10 sensor categories. Like an ECU reading engine sensors, 
    Lambda reads societal "vitals" – health, economy, housing, labor, energy, education, safety, 
    governance, environment, demographics.`,
    sv: `Lambda aggregerar signaler från 10 sensorkategorier. Som en ECU som läser motorsensorer 
    läser Lambda samhälleliga "vitala värden" – hälsa, ekonomi, bostäder, arbetsmarknad, energi, 
    utbildning, säkerhet, styrning, miljö, demografi.`,
  },
  
  sensorCategories: [
    {
      id: 'health',
      emoji: '🏥',
      name: { en: 'Health', sv: 'Hälsa' },
      description: { en: 'Life expectancy, disease burden, healthcare access', sv: 'Livslängd, sjukdomsbörda, sjukvårdstillgång' },
      exampleIndicators: ['life_expectancy', 'disease_burden_dalys', 'infant_mortality'],
    },
    {
      id: 'economy',
      emoji: '💰',
      name: { en: 'Economy', sv: 'Ekonomi' },
      description: { en: 'Real wages, debt levels, inequality', sv: 'Reallöner, skuldnivåer, ojämlikhet' },
      exampleIndicators: ['real_wage_growth', 'debt_to_gdp', 'gini_coefficient'],
    },
    {
      id: 'housing',
      emoji: '🏠',
      name: { en: 'Housing', sv: 'Bostäder' },
      description: { en: 'Affordability, availability, homelessness', sv: 'Överkomlighet, tillgänglighet, hemlöshet' },
      exampleIndicators: ['price_to_income_ratio', 'vacancy_rate', 'homelessness_rate'],
    },
    {
      id: 'labor',
      emoji: '👷',
      name: { en: 'Labor Market', sv: 'Arbetsmarknad' },
      description: { en: 'Employment, youth unemployment, job quality', sv: 'Sysselsättning, ungdomsarbetslöshet, jobbkvalitet' },
      exampleIndicators: ['employment_rate', 'youth_unemployment', 'involuntary_part_time'],
    },
    {
      id: 'energy',
      emoji: '⚡',
      name: { en: 'Energy', sv: 'Energi' },
      description: { en: 'Access, reliability, sustainability', sv: 'Tillgång, tillförlitlighet, hållbarhet' },
      exampleIndicators: ['energy_access', 'grid_reliability', 'renewable_share'],
    },
    {
      id: 'education',
      emoji: '📚',
      name: { en: 'Education', sv: 'Utbildning' },
      description: { en: 'Attainment, quality, skills match', sv: 'Utbildningsnivå, kvalitet, kompetensmatchning' },
      exampleIndicators: ['years_of_schooling', 'pisa_scores', 'skill_mismatch'],
    },
    {
      id: 'safety',
      emoji: '🛡️',
      name: { en: 'Safety', sv: 'Säkerhet' },
      description: { en: 'Violent crime, perceived safety', sv: 'Våldsbrott, upplevd trygghet' },
      exampleIndicators: ['violent_crime_rate', 'safety_perception', 'homicide_rate'],
    },
    {
      id: 'governance',
      emoji: '🏛️',
      name: { en: 'Governance', sv: 'Styrning' },
      description: { en: 'Trust in institutions, corruption, rule of law', sv: 'Förtroende för institutioner, korruption, rättsstat' },
      exampleIndicators: ['institutional_trust', 'corruption_index', 'rule_of_law'],
    },
    {
      id: 'environment',
      emoji: '🌿',
      name: { en: 'Environment', sv: 'Miljö' },
      description: { en: 'Ecological footprint, pollution, biodiversity', sv: 'Ekologiskt fotavtryck, föroreningar, biologisk mångfald' },
      exampleIndicators: ['ecological_footprint', 'air_quality', 'biodiversity_index'],
    },
    {
      id: 'demographics',
      emoji: '👥',
      name: { en: 'Demographics', sv: 'Demografi' },
      description: { en: 'Fertility, dependency ratio, aging', sv: 'Fertilitet, försörjningskvot, åldrande' },
      exampleIndicators: ['fertility_rate', 'dependency_ratio', 'median_age'],
    },
  ],
  
  howTheyConnect: {
    en: `Each sensor contributes to Lambda based on its systemic impact weight – 
    not based on opinion or politics. A struggling housing market pulls Lambda down. 
    Improving health outcomes push it up. The formula is transparent and reproducible.`,
    sv: `Varje sensor bidrar till Lambda baserat på sin systemiska påverkansvikt – 
    inte baserat på åsikt eller politik. En kämpande bostadsmarknad drar Lambda nedåt. 
    Förbättrade hälsoutfall skjuter det uppåt. Formeln är transparent och reproducerbar.`,
  },
  
  stressAnalysis: {
    en: `Beyond individual sensors, Lambda measures system stress:
    • Tension buildup – unresolved pressures accumulating
    • Divergence – growing gaps between regions or groups
    • Inertia – resistance to necessary adaptation
    • Recovery capacity – ability to bounce back from shocks`,
    sv: `Utöver individuella sensorer mäter Lambda systemstress:
    • Spänningsuppbyggnad – ackumulerade olösta tryck
    • Divergens – växande gap mellan regioner eller grupper
    • Tröghet – motstånd mot nödvändig anpassning
    • Återhämtningskapacitet – förmåga att studsa tillbaka från chocker`,
  },
} as const;

// =============================================================================
// L2: METHOD (HOW IT'S CALCULATED)
// =============================================================================

export const LAMBDA_L2_METHOD = {
  title: {
    en: 'How Lambda Is Calculated',
    sv: 'Hur Lambda beräknas',
  },
  
  formula: {
    main: 'λ = Σ(wᵢ × nᵢ) × (1 - stress_penalty)',
    explanation: {
      en: 'Sum of weighted normalized indicators, adjusted for system stress',
      sv: 'Summan av viktade normaliserade indikatorer, justerad för systemstress',
    },
  },
  
  steps: [
    {
      step: 1,
      name: { en: 'Data Collection', sv: 'Datainsamling' },
      description: {
        en: 'Raw data from official sources (NSOs, Eurostat, WHO, World Bank, etc.)',
        sv: 'Rådata från officiella källor (SCB, Eurostat, WHO, Världsbanken, etc.)',
      },
    },
    {
      step: 2,
      name: { en: 'Normalization', sv: 'Normalisering' },
      description: {
        en: 'Each indicator scaled to 0-1 range using global min/max or defined optimal ranges',
        sv: 'Varje indikator skalas till 0-1 med globalt min/max eller definierade optimala intervall',
      },
    },
    {
      step: 3,
      name: { en: 'Uncertainty Tagging', sv: 'Osäkerhetsmärkning' },
      description: {
        en: 'Each value gets uncertainty bounds based on source quality and methodology',
        sv: 'Varje värde får osäkerhetsgränser baserat på källkvalitet och metodik',
      },
    },
    {
      step: 4,
      name: { en: 'Weighting', sv: 'Viktning' },
      description: {
        en: 'Indicators weighted by systemic impact (not opinion). Weights are published and auditable.',
        sv: 'Indikatorer viktas efter systemisk påverkan (inte åsikt). Vikter publiceras och är granskningsbara.',
      },
    },
    {
      step: 5,
      name: { en: 'Stress Calculation', sv: 'Stressberäkning' },
      description: {
        en: 'System stress factors (divergence, tension, inertia) calculated and applied as penalty',
        sv: 'Systemstressfaktorer (divergens, spänning, tröghet) beräknas och tillämpas som avdrag',
      },
    },
    {
      step: 6,
      name: { en: 'Final Lambda', sv: 'Slutlig Lambda' },
      description: {
        en: 'Aggregated value centered at 1.0 (optimal), with uncertainty bounds',
        sv: 'Aggregerat värde centrerat vid 1.0 (optimalt), med osäkerhetsgränser',
      },
    },
  ],
  
  reproducibility: {
    en: `Every calculation is fully reproducible. All inputs, weights, and formulas are published. 
    Anyone can verify by running the same calculation.`,
    sv: `Varje beräkning är helt reproducerbar. Alla indata, vikter och formler publiceras. 
    Vem som helst kan verifiera genom att köra samma beräkning.`,
  },
} as const;

// =============================================================================
// L3: LIMITATIONS (WHAT LAMBDA DOESN'T SHOW)
// =============================================================================

export const LAMBDA_L3_LIMITATIONS = {
  title: {
    en: 'What Lambda Does NOT Show',
    sv: 'Vad Lambda INTE visar',
  },
  
  criticalLimitations: [
    {
      id: 'no_causation',
      title: { en: 'No Causation', sv: 'Ingen kausalitet' },
      description: {
        en: 'Lambda shows correlation and co-movement, never causation. We observe that A and B move together; we do not claim A causes B.',
        sv: 'Lambda visar korrelation och samrörelse, aldrig kausalitet. Vi observerar att A och B rör sig tillsammans; vi påstår inte att A orsakar B.',
      },
    },
    {
      id: 'no_predictions',
      title: { en: 'No Predictions', sv: 'Inga prognoser' },
      description: {
        en: 'Lambda shows current state and historical trends. It does not predict the future.',
        sv: 'Lambda visar nuvarande tillstånd och historiska trender. Det förutspår inte framtiden.',
      },
    },
    {
      id: 'no_recommendations',
      title: { en: 'No Policy Recommendations', sv: 'Inga policyrekommendationer' },
      description: {
        en: 'Lambda never says "do this". That decision belongs to humans. Lambda is the dashboard, not the steering wheel.',
        sv: 'Lambda säger aldrig "gör så här". Det beslutet tillhör människor. Lambda är instrumentpanelen, inte ratten.',
      },
    },
    {
      id: 'no_moral_judgment',
      title: { en: 'No Moral Judgment', sv: 'Ingen moralisk bedömning' },
      description: {
        en: 'Lambda does not say "good" or "bad". It shows distance from measurable balance states.',
        sv: 'Lambda säger inte "bra" eller "dåligt". Det visar avstånd från mätbara balanstillstånd.',
      },
    },
    {
      id: 'data_gaps',
      title: { en: 'Data Gaps Exist', sv: 'Dataluckor finns' },
      description: {
        en: 'Some regions have sparse data. Lambda shows data coverage honestly. If coverage is <70%, Lambda shows uncertainty, not false precision.',
        sv: 'Vissa regioner har gles data. Lambda visar datatäckning ärligt. Om täckningen är <70% visar Lambda osäkerhet, inte falsk precision.',
      },
    },
    {
      id: 'lagging_indicators',
      title: { en: 'Lagging Indicators', sv: 'Eftersläpande indikatorer' },
      description: {
        en: 'Most data is 1-24 months old. Lambda shows the past, not real-time. Sudden changes may not be reflected yet.',
        sv: 'De flesta data är 1-24 månader gamla. Lambda visar det förflutna, inte realtid. Plötsliga förändringar kanske inte syns ännu.',
      },
    },
    {
      id: 'weight_choices',
      title: { en: 'Weight Choices', sv: 'Viktval' },
      description: {
        en: 'Weights are transparent and based on systemic impact research, but they are still choices. Different weights give different Lambda values.',
        sv: 'Vikter är transparenta och baserade på forskning om systemisk påverkan, men de är fortfarande val. Olika vikter ger olika Lambda-värden.',
      },
    },
  ],
  
  honestDisclaimer: {
    en: `Lambda is a measurement tool, not a truth machine. It reduces complexity to aid understanding, 
    which means some nuance is lost. Always drill down to understand what's behind the number.`,
    sv: `Lambda är ett mätverktyg, inte en sanningsmaskin. Det reducerar komplexitet för att underlätta förståelse, 
    vilket betyder att viss nyans går förlorad. Fördjupa dig alltid för att förstå vad som ligger bakom siffran.`,
  },
} as const;

// =============================================================================
// L4: RAW DATA (FULL TRANSPARENCY)
// =============================================================================

export const LAMBDA_L4_RAWDATA = {
  title: {
    en: 'Raw Data & Full Transparency',
    sv: 'Rådata & Full transparens',
  },
  
  dataAccess: {
    en: `Every Lambda calculation links to:
    • Raw source data with timestamps
    • Original methodology documents
    • Version history of any changes
    • Uncertainty calculations
    • Alternative weight scenarios`,
    sv: `Varje Lambda-beräkning länkar till:
    • Rådata med tidsstämplar
    • Originaldokument om metodik
    • Versionshistorik för alla ändringar
    • Osäkerhetsberäkningar
    • Alternativa viktscenarier`,
  },
  
  auditTrail: {
    en: 'Every change to methodology, weights, or data sources is logged in a public, immutable trust log. Nothing is hidden.',
    sv: 'Varje ändring av metodik, vikter eller datakällor loggas i en publik, oföränderlig tillitslogg. Inget döljs.',
  },
  
  replicationGuide: {
    en: `To replicate any Lambda value:
    1. Download source data from linked sources
    2. Apply normalization formulas (published)
    3. Apply weights (published)
    4. Calculate stress factors (published)
    5. Compare your result to ours`,
    sv: `För att replikera ett Lambda-värde:
    1. Ladda ner källdata från länkade källor
    2. Tillämpa normaliseringsformler (publicerade)
    3. Tillämpa vikter (publicerade)
    4. Beräkna stressfaktorer (publicerade)
    5. Jämför ditt resultat med vårt`,
  },
} as const;

// =============================================================================
// ISO-STYLE FORMAL SPECIFICATION
// =============================================================================

export const LAMBDA_ISO_SPECIFICATION = {
  documentId: 'GROS-LAMBDA-1.0',
  version: '1.0.0',
  status: 'ACTIVE',
  effectiveDate: '2026-02-03',
  
  scope: {
    en: 'This specification defines the Global Lambda Setpoint (λ), a composite measure of societal system balance, for use in decision-support infrastructure.',
    sv: 'Denna specifikation definierar Global Lambda Setpoint (λ), ett sammansatt mått på samhälleligt systembalans, för användning i beslutsstödsinfrastruktur.',
  },
  
  normativeReferences: [
    'ISO 31000:2018 Risk Management',
    'ISO 31010:2019 Risk Assessment Techniques',
    'System Dynamics Society Standards',
    'OECD Better Life Index Methodology',
  ],
  
  termsAndDefinitions: [
    {
      term: 'Lambda (λ)',
      definition: 'A dimensionless composite indicator representing the ratio of current system balance to optimal system balance, where 1.0 indicates equilibrium.',
    },
    {
      term: 'System Stress',
      definition: 'Accumulated pressure on system components that reduces overall balance, measured through tension, divergence, and inertia.',
    },
    {
      term: 'Sensor Category',
      definition: 'A domain of societal measurement (health, economy, etc.) contributing to Lambda through weighted aggregation.',
    },
    {
      term: 'Optimal Range',
      definition: 'The range of values for an indicator where system function is maximized and stress minimized.',
    },
  ],
  
  requirements: [
    {
      id: 'REQ-001',
      category: 'Data',
      requirement: 'All input data SHALL be from official, verifiable sources with documented methodology.',
    },
    {
      id: 'REQ-002',
      category: 'Transparency',
      requirement: 'All weights, formulas, and calculations SHALL be publicly documented and auditable.',
    },
    {
      id: 'REQ-003',
      category: 'Uncertainty',
      requirement: 'All Lambda values SHALL include uncertainty bounds based on data quality and coverage.',
    },
    {
      id: 'REQ-004',
      category: 'Reproducibility',
      requirement: 'Any Lambda calculation SHALL be reproducible by independent parties using published methodology.',
    },
    {
      id: 'REQ-005',
      category: 'Neutrality',
      requirement: 'Lambda calculations SHALL NOT include normative language, policy recommendations, or moral judgments.',
    },
    {
      id: 'REQ-006',
      category: 'Versioning',
      requirement: 'All methodology changes SHALL be version-controlled with public change logs.',
    },
  ],
  
  conformanceStatement: {
    en: 'A system claiming conformance to this specification SHALL implement all normative requirements and pass the Lambda Verification Test Suite.',
    sv: 'Ett system som hävdar överensstämmelse med denna specifikation SKA implementera alla normativa krav och passera Lambda Verification Test Suite.',
  },
} as const;

// =============================================================================
// EXPLANATION DEPTH LEVELS
// =============================================================================

export type LambdaExplanationLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export const LAMBDA_EXPLANATION_LEVELS: Record<LambdaExplanationLevel, {
  name: string;
  targetAudience: string;
  timeToUnderstand: string;
  depth: string;
}> = {
  L0: {
    name: '18-Year-Old',
    targetAudience: 'Anyone, no prior knowledge',
    timeToUnderstand: '15 seconds',
    depth: 'What is Lambda? (analogy)',
  },
  L1: {
    name: 'Mechanism',
    targetAudience: 'Curious citizen',
    timeToUnderstand: '2 minutes',
    depth: 'What drives Lambda?',
  },
  L2: {
    name: 'Method',
    targetAudience: 'Analyst, journalist',
    timeToUnderstand: '10 minutes',
    depth: 'How is it calculated?',
  },
  L3: {
    name: 'Limitations',
    targetAudience: 'Critical thinker',
    timeToUnderstand: '5 minutes',
    depth: 'What can\'t it show?',
  },
  L4: {
    name: 'Raw Data',
    targetAudience: 'Researcher, auditor',
    timeToUnderstand: '30+ minutes',
    depth: 'Full transparency',
  },
};
