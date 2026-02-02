/**
 * POLICY SCENARIO SANDBOX (PSS)
 * 
 * "Visa vad historien säger om liknande förändringar – inte vad som kommer hända."
 * 
 * Detta är inte prognoser. Detta är historiskt informerade konsekvensramar.
 */

// === 1. GRUNDPRINCIP (OBRYTBAR) ===

export const PSS_CORE_PRINCIPLE = {
  whatSystemDoes: {
    sv: 'När X förändrades tidigare, i liknande kontexter, observerades ofta Y.',
    en: 'When X changed previously, in similar contexts, Y was often observed.'
  },
  whatSystemNeverDoes: [
    { sv: 'förutspår', en: 'predicts' },
    { sv: 'rekommenderar', en: 'recommends' },
    { sv: 'optimerar', en: 'optimizes' }
  ]
};

// === 2. SCENARIODEFINITION ===

export type ChangeDirection = 'increase' | 'decrease' | 'faster' | 'slower';

export interface ScenarioVariable {
  id: string;
  category: string;
  label: string;
  labelSv: string;
  unit: string;
  description: string;
  descriptionSv: string;
  historicalDataAvailable: boolean;
  typicalLagYears: [number, number]; // min-max
}

export const SCENARIO_VARIABLES: ScenarioVariable[] = [
  {
    id: 'immigration_level',
    category: 'demography',
    label: 'Immigration level',
    labelSv: 'Invandringens nivå',
    unit: 'per 1000 inhabitants',
    description: 'Net immigration as share of population',
    descriptionSv: 'Nettoinvandring som andel av befolkning',
    historicalDataAvailable: true,
    typicalLagYears: [2, 10]
  },
  {
    id: 'energy_cost',
    category: 'economy',
    label: 'Energy cost',
    labelSv: 'Energikostnad',
    unit: 'SEK/kWh (real)',
    description: 'Real electricity price for households',
    descriptionSv: 'Realt elpris för hushåll',
    historicalDataAvailable: true,
    typicalLagYears: [0, 2]
  },
  {
    id: 'tax_rate',
    category: 'economy',
    label: 'Tax rate',
    labelSv: 'Skattesats',
    unit: '% of GDP',
    description: 'Total tax revenue as share of GDP',
    descriptionSv: 'Totala skatteintäkter som andel av BNP',
    historicalDataAvailable: true,
    typicalLagYears: [1, 5]
  },
  {
    id: 'housing_construction',
    category: 'infrastructure',
    label: 'Housing construction',
    labelSv: 'Bostadsbyggande',
    unit: 'units per 1000 inhabitants',
    description: 'New housing units completed annually',
    descriptionSv: 'Färdigställda bostäder per år',
    historicalDataAvailable: true,
    typicalLagYears: [2, 8]
  },
  {
    id: 'police_density',
    category: 'safety',
    label: 'Police density',
    labelSv: 'Polistäthet',
    unit: 'per 100,000 inhabitants',
    description: 'Number of police officers per capita',
    descriptionSv: 'Antal poliser per capita',
    historicalDataAvailable: true,
    typicalLagYears: [1, 5]
  },
  {
    id: 'education_investment',
    category: 'social',
    label: 'Education investment',
    labelSv: 'Utbildningsinvestering',
    unit: '% of GDP',
    description: 'Public spending on education',
    descriptionSv: 'Offentliga utgifter för utbildning',
    historicalDataAvailable: true,
    typicalLagYears: [5, 20]
  },
  {
    id: 'healthcare_spending',
    category: 'social',
    label: 'Healthcare spending',
    labelSv: 'Sjukvårdsutgifter',
    unit: '% of GDP',
    description: 'Total healthcare expenditure',
    descriptionSv: 'Totala sjukvårdsutgifter',
    historicalDataAvailable: true,
    typicalLagYears: [1, 10]
  },
  {
    id: 'labor_participation',
    category: 'economy',
    label: 'Labor force participation',
    labelSv: 'Arbetskraftsdeltagande',
    unit: '%',
    description: 'Share of working-age population in labor force',
    descriptionSv: 'Andel av befolkning i arbetsför ålder som deltar i arbetskraften',
    historicalDataAvailable: true,
    typicalLagYears: [1, 5]
  }
];

export const CHANGE_DIRECTIONS: { id: ChangeDirection; label: string; labelSv: string; icon: string }[] = [
  { id: 'increase', label: 'Increases', labelSv: 'Ökar', icon: '↑' },
  { id: 'decrease', label: 'Decreases', labelSv: 'Minskar', icon: '↓' },
  { id: 'faster', label: 'Faster pace', labelSv: 'Snabbare takt', icon: '⏩' },
  { id: 'slower', label: 'Slower pace', labelSv: 'Långsammare takt', icon: '⏪' }
];

// === 3. KONTEXTDEFINITION ===

export interface ContextOption {
  id: string;
  label: string;
  labelSv: string;
  description: string;
  descriptionSv: string;
}

export const CONTEXT_OPTIONS: ContextOption[] = [
  {
    id: 'sweden_current',
    label: 'Sweden (current conditions)',
    labelSv: 'Sverige (nuvarande förhållanden)',
    description: 'Compare with Swedish historical data under similar conditions',
    descriptionSv: 'Jämför med svensk historisk data under liknande förhållanden'
  },
  {
    id: 'sweden_historical',
    label: 'Sweden (earlier periods)',
    labelSv: 'Sverige (tidigare perioder)',
    description: 'Compare with earlier Swedish historical periods',
    descriptionSv: 'Jämför med tidigare svenska historiska perioder'
  },
  {
    id: 'similar_countries',
    label: 'Similar countries',
    labelSv: 'Liknande länder',
    description: 'Compare with Nordic and similar European countries',
    descriptionSv: 'Jämför med nordiska och liknande europeiska länder'
  },
  {
    id: 'oecd_average',
    label: 'OECD countries',
    labelSv: 'OECD-länder',
    description: 'Compare with OECD member experiences',
    descriptionSv: 'Jämför med erfarenheter från OECD-länder'
  }
];

// === 4. SVARSSTRUKTUR ===

export interface HistoricalParallel {
  id: string;
  country: string;
  period: string;
  similarity: number; // 0-1
  description: string;
  descriptionSv: string;
}

export interface ObservedOutcome {
  indicator: string;
  indicatorSv: string;
  direction: 'positive' | 'neutral' | 'negative' | 'mixed';
  frequency: number; // how often observed (0-1)
  magnitude: 'small' | 'moderate' | 'large' | 'variable';
  lagYears: [number, number];
  note: string;
  noteSv: string;
}

export interface TradeOff {
  improved: string;
  improvedSv: string;
  worsened: string;
  worsenedSv: string;
  frequency: number;
}

export interface ScenarioResponse {
  scenarioId: string;
  variable: ScenarioVariable;
  direction: ChangeDirection;
  context: ContextOption;
  parallels: HistoricalParallel[];
  outcomes: ObservedOutcome[];
  typicalLag: string;
  typicalLagSv: string;
  tradeOffs: TradeOff[];
  humanImpact: {
    wellbeing: string;
    wellbeingSv: string;
    safety: string;
    safetySv: string;
    economy: string;
    economySv: string;
    resilience: string;
    resilienceSv: string;
  };
  disclaimer: string;
  disclaimerSv: string;
}

// === 5. STANDARD DISCLAIMERS ===

export const SCENARIO_DISCLAIMERS = {
  main: {
    sv: 'Detta visar inte vad som kommer hända i detta fall.',
    en: 'This does not show what will happen in this case.'
  },
  outcomeVariation: {
    sv: 'Utfallet varierade. Vanliga mönster inkluderar…',
    en: 'Outcomes varied. Common patterns include…'
  },
  timeLag: {
    sv: 'Effekter observerades ofta efter {min}–{max} år.',
    en: 'Effects were often observed after {min}–{max} years.'
  },
  tradeOff: {
    sv: 'Förändringen sammanföll ofta med förbättring i {improved} och försämring i {worsened}.',
    en: 'The change often coincided with improvement in {improved} and deterioration in {worsened}.'
  },
  humanImpact: {
    sv: 'I dessa historiska exempel påverkades människors levnadsförutsättningar på följande sätt…',
    en: 'In these historical examples, people\'s living conditions were affected in the following ways…'
  },
  parallelsFound: {
    sv: 'Vi har identifierat {count} historiska situationer med liknande förändring i liknande kontext.',
    en: 'We have identified {count} historical situations with similar change in similar context.'
  }
};

// === 6. MOCK SCENARIO RESPONSES ===

export const generateMockScenarioResponse = (
  variable: ScenarioVariable,
  direction: ChangeDirection,
  context: ContextOption
): ScenarioResponse => {
  // Generate mock parallels based on context
  const parallels: HistoricalParallel[] = [
    {
      id: 'p1',
      country: context.id.includes('sweden') ? 'Sverige' : 'Danmark',
      period: '1990–2000',
      similarity: 0.78,
      description: 'Similar change during post-recession recovery',
      descriptionSv: 'Liknande förändring under återhämtning efter lågkonjunktur'
    },
    {
      id: 'p2',
      country: context.id.includes('sweden') ? 'Sverige' : 'Norge',
      period: '2005–2015',
      similarity: 0.65,
      description: 'Comparable policy shift with similar demographics',
      descriptionSv: 'Jämförbar policyförändring med liknande demografi'
    },
    {
      id: 'p3',
      country: context.id.includes('sweden') ? 'Sverige' : 'Finland',
      period: '1985–1992',
      similarity: 0.52,
      description: 'Earlier example with different economic conditions',
      descriptionSv: 'Tidigare exempel med andra ekonomiska förutsättningar'
    }
  ];

  // Generate outcomes based on variable
  const outcomes: ObservedOutcome[] = [
    {
      indicator: 'Employment rate',
      indicatorSv: 'Sysselsättningsgrad',
      direction: direction === 'increase' ? 'mixed' : 'positive',
      frequency: 0.7,
      magnitude: 'moderate',
      lagYears: [2, 5],
      note: 'Effect varied by labor market conditions',
      noteSv: 'Effekten varierade beroende på arbetsmarknadsläge'
    },
    {
      indicator: 'Public finances',
      indicatorSv: 'Offentliga finanser',
      direction: direction === 'increase' ? 'negative' : 'positive',
      frequency: 0.6,
      magnitude: 'small',
      lagYears: [1, 3],
      note: 'Short-term vs long-term effects often diverged',
      noteSv: 'Kortsiktiga och långsiktiga effekter gick ofta isär'
    },
    {
      indicator: 'Social cohesion indicators',
      indicatorSv: 'Social sammanhållning',
      direction: 'mixed',
      frequency: 0.5,
      magnitude: 'variable',
      lagYears: [5, 15],
      note: 'Highly dependent on integration policies',
      noteSv: 'Starkt beroende av integrationspolitik'
    }
  ];

  // Trade-offs
  const tradeOffs: TradeOff[] = [
    {
      improved: 'GDP growth',
      improvedSv: 'BNP-tillväxt',
      worsened: 'Income inequality',
      worsenedSv: 'Inkomstojämlikhet',
      frequency: 0.6
    },
    {
      improved: 'Labor supply',
      improvedSv: 'Arbetskraftsutbud',
      worsened: 'Housing availability',
      worsenedSv: 'Bostadstillgång',
      frequency: 0.7
    }
  ];

  return {
    scenarioId: `${variable.id}_${direction}_${context.id}_${Date.now()}`,
    variable,
    direction,
    context,
    parallels,
    outcomes,
    typicalLag: `${variable.typicalLagYears[0]}–${variable.typicalLagYears[1]} years`,
    typicalLagSv: `${variable.typicalLagYears[0]}–${variable.typicalLagYears[1]} år`,
    tradeOffs,
    humanImpact: {
      wellbeing: 'Mixed effects on life satisfaction observed',
      wellbeingSv: 'Blandade effekter på livstillfredsställelse observerade',
      safety: 'No consistent pattern in safety indicators',
      safetySv: 'Inget konsekvent mönster i trygghetsindikatorer',
      economy: 'Household economic margin affected in varying ways',
      economySv: 'Hushållens ekonomiska marginaler påverkades på olika sätt',
      resilience: 'System resilience changed depending on implementation',
      resilienceSv: 'Systemets resiliens förändrades beroende på implementering'
    },
    disclaimer: SCENARIO_DISCLAIMERS.main.en,
    disclaimerSv: SCENARIO_DISCLAIMERS.main.sv
  };
};

// === 7. MISUSE PROTECTION ===

export const MISUSE_PROTECTIONS = {
  noProveIntent: {
    sv: 'Systemet tillåter inte "bevisa att"-frågor',
    en: 'The system does not allow "prove that" queries'
  },
  noCherryPicking: {
    sv: 'Alla historiska paralleller visas, inte bara utvalda',
    en: 'All historical parallels are shown, not just selected ones'
  },
  lockedMethod: {
    sv: 'Metod och urval är synligt låsta och reproducerbara',
    en: 'Method and selection are visibly locked and reproducible'
  },
  shareIncludesAll: {
    sv: 'Delning innehåller alltid: scenario-definition, historiska paralleller, osäkerheter',
    en: 'Sharing always includes: scenario definition, historical parallels, uncertainties'
  }
};

// === 8. HUMAN IMPACT CATEGORIES ===

export const HUMAN_IMPACT_CATEGORIES = [
  {
    id: 'wellbeing',
    icon: '❤️',
    label: 'Human Wellbeing',
    labelSv: 'Mänskligt välbefinnande',
    kpiLink: 'hwi'
  },
  {
    id: 'safety',
    icon: '🛡️',
    label: 'Safety & Security',
    labelSv: 'Trygghet',
    kpiLink: 'safety'
  },
  {
    id: 'economy',
    icon: '💰',
    label: 'Economic Margin',
    labelSv: 'Ekonomiskt handlingsutrymme',
    kpiLink: 'economy'
  },
  {
    id: 'resilience',
    icon: '🔄',
    label: 'System Resilience',
    labelSv: 'Resiliens',
    kpiLink: 'resilience'
  }
];
