/**
 * 📜 BIG QUESTIONS LAYER - DATA CONTRACTS
 * 
 * MASTER EXECUTION BLOCK 35 — Official baseline copy.
 * Politically neutral. Humanly understandable. Translation-safe.
 * Ingen fråga utan kontrakt. Ingen rendering utan kontrakt.
 */

// ============================================================
// TYPES
// ============================================================

export type DrillScope = 'global' | 'continent' | 'country' | 'region' | 'municipality';

export type SemanticTag = 'observation' | 'context' | 'uncertainty' | 'non-causal' | 'historical';

export type DataTier = 'A' | 'B' | 'C' | 'D';

export interface LocalizedText {
  sv: string;
  en: string;
}

export interface SemanticTextBlock {
  tag: SemanticTag;
  text: LocalizedText;
  sources?: string[];
}

export interface Pattern {
  id: string;
  observation: LocalizedText;
  timeframe: string;
  geographic_scope: DrillScope[];
  uncertainty_level: 'low' | 'medium' | 'high';
  sources: string[];
  data_tier: DataTier;
}

export interface HistoricalContext {
  id: string;
  category: string;
  context_conditions: LocalizedText;
  observed_outcome: LocalizedText;
  when_it_didnt_work: LocalizedText;
  time_lag: string;
  sources: string[];
}

export interface ImpactLayer {
  level: DrillScope;
  description: LocalizedText;
  data_available: boolean;
  data_tier: DataTier;
}

export interface UncertaintyBlock {
  main_sources: LocalizedText[];
  confidence_range: {
    low: number;
    high: number;
    unit: string;
  };
  methodology_note: LocalizedText;
}

export interface SourceReference {
  id: string;
  name: string;
  type: 'official_statistics' | 'research' | 'international_org' | 'government' | 'aggregator';
  url: string;
  update_frequency: string;
  last_updated: string;
}

// ============================================================
// QUESTION CONTRACT
// ============================================================

export interface QuestionContract {
  question_id: string;
  version: string;
  last_updated: string;
  
  // Metadata
  category: string;
  icon: string;
  color: string;
  
  // Scope definition
  scope: DrillScope[];
  
  // OFFICIAL COPY (Block 35)
  title: LocalizedText;
  short_description: LocalizedText;
  what_system_shows: LocalizedText;
  what_this_means: LocalizedText;
  uncertainty_statement: LocalizedText;
  
  // Section A: Summary (semantic blocks)
  summary: {
    what_it_is: SemanticTextBlock;
    why_it_matters_now: SemanticTextBlock;
    what_data_shows: SemanticTextBlock;
  };
  
  // Section B: Patterns
  patterns: Pattern[];
  
  // Section C: Impact
  impact_layers: ImpactLayer[];
  
  // Section D: Historical context
  historical_context: HistoricalContext[];
  
  // Section E: Drill-down prompts
  drill_prompts: {
    country: LocalizedText;
    region: LocalizedText;
    municipality: LocalizedText;
  };
  
  // Uncertainty
  uncertainty: UncertaintyBlock;
  
  // Sources
  sources: SourceReference[];
  
  // Related
  related_questions: string[];
}

// ============================================================
// GLOBAL HEADER & FOOTER (OFFICIAL COPY)
// ============================================================

export const GLOBAL_HEADER = {
  title: {
    sv: 'Vad världen står inför — baserat på tillgänglig data',
    en: 'What the world is facing — based on available data',
  },
  subtitle: {
    sv: 'Denna översikt aggregerar verifierad data från flera källor för att beskriva stora strukturella utmaningar. Den föreskriver inga åtgärder eller policyer.',
    en: 'This overview aggregates verified data from multiple sources to describe major structural challenges. It does not prescribe actions or policies.',
  },
} as const;

export const GLOBAL_FOOTER = {
  disclaimer: {
    sv: 'Dessa sammanfattningar beskriver observerade mönster och samband i tillgänglig data. De fastställer inte orsakssamband och förutsäger inte framtida utfall.',
    en: 'These summaries describe observed patterns and associations in available data. They do not establish causality and do not predict future outcomes.',
  },
  actions: {
    view_sources: { sv: 'Visa källor', en: 'View sources' },
    view_uncertainty: { sv: 'Visa osäkerhet', en: 'View uncertainty' },
    change_location: { sv: 'Byt plats', en: 'Change location' },
  },
} as const;

// ============================================================
// THE 7 LOCKED QUESTION CATEGORIES
// ============================================================

export const QUESTION_CATEGORIES = [
  {
    id: 'economy_livability',
    order: 1,
    label: {
      sv: 'Global ekonomi & levnadsförmåga',
      en: 'Global economy & livability',
    },
    icon: 'trending-up',
    color: 'emerald',
  },
  {
    id: 'work_productivity_ai',
    order: 2,
    label: {
      sv: 'Arbete, produktivitet & AI',
      en: 'Work, productivity & AI',
    },
    icon: 'cpu',
    color: 'violet',
  },
  {
    id: 'energy_resources',
    order: 3,
    label: {
      sv: 'Energi, resurser & beroenden',
      en: 'Energy, resources & dependencies',
    },
    icon: 'zap',
    color: 'amber',
  },
  {
    id: 'health_demographics',
    order: 4,
    label: {
      sv: 'Hälsa, demografi & social stabilitet',
      en: 'Health, demographics & social stability',
    },
    icon: 'heart-pulse',
    color: 'rose',
  },
  {
    id: 'education_adaptation',
    order: 5,
    label: {
      sv: 'Utbildning, kompetens & anpassning',
      en: 'Education, competence & adaptation',
    },
    icon: 'graduation-cap',
    color: 'sky',
  },
  {
    id: 'institutional_capacity',
    order: 6,
    label: {
      sv: 'Institutionell kapacitet & styrning',
      en: 'Institutional capacity & governance',
    },
    icon: 'landmark',
    color: 'slate',
  },
  {
    id: 'risks_resilience',
    order: 7,
    label: {
      sv: 'Risker, resiliens & osäkerhet',
      en: 'Risks, resilience & uncertainty',
    },
    icon: 'shield-alert',
    color: 'orange',
  },
] as const;

// ============================================================
// FULL QUESTION CONTRACTS — OFFICIAL COPY (BLOCK 35)
// ============================================================

export const QUESTION_CONTRACTS: QuestionContract[] = [
  // ──────────────────────────────────────────────────────────
  // 1. GLOBAL EKONOMI & LEVNADSFÖRMÅGA
  // ──────────────────────────────────────────────────────────
  {
    question_id: 'economy_livability',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'economy_livability',
    icon: 'trending-up',
    color: 'emerald',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    
    // OFFICIAL COPY
    title: {
      sv: 'Ekonomisk kapacitet och levnadsvillkor',
      en: 'Economic capacity and living conditions',
    },
    short_description: {
      sv: 'Hur ekonomiska resurser, produktivitet och fördelning påverkar människors förmåga att leva stabila och förutsägbara liv.',
      en: 'How economic resources, productivity, and distribution affect people\'s ability to live stable and predictable lives.',
    },
    what_system_shows: {
      sv: 'Data indikerar ökande skillnader i ekonomisk kapacitet mellan regioner, tillsammans med stigande kostnader för basbehov i många delar av världen. Tillväxt, där den finns, är ojämnt fördelad.',
      en: 'Data indicates increasing differences in economic capacity between regions, alongside rising costs for basic needs in many parts of the world. Growth, where it exists, is unevenly distributed.',
    },
    what_this_means: {
      sv: 'Ekonomisk prestation översätts inte automatiskt till förbättrade levnadsvillkor. Lokal kontext, institutioner och fördelningsmekanismer spelar roll.',
      en: 'Economic performance does not automatically translate into improved living conditions. Local context, institutions, and distribution mechanisms matter.',
    },
    uncertainty_statement: {
      sv: 'Ekonomisk data varierar i precision mellan länder och över tid. Informella ekonomier är ofta underrepresenterade.',
      en: 'Economic data varies in precision between countries and over time. Informal economies are often underrepresented.',
    },
    
    summary: {
      what_it_is: {
        tag: 'observation',
        text: {
          sv: 'Denna vy sammanställer ekonomiska indikatorer som direkt påverkar människors levnadsförmåga: tillväxt, produktivitet, skuldsättning, fördelning och offentliga finanser.',
          en: 'This view compiles economic indicators that directly affect people\'s livability: growth, productivity, debt, distribution, and public finances.',
        },
        sources: ['imf', 'world_bank', 'oecd'],
      },
      why_it_matters_now: {
        tag: 'context',
        text: {
          sv: 'Data indikerar ökande skillnader i ekonomisk kapacitet mellan regioner, tillsammans med stigande kostnader för basbehov.',
          en: 'Data indicates increasing differences in economic capacity between regions, alongside rising costs for basic needs.',
        },
        sources: ['imf', 'oecd'],
      },
      what_data_shows: {
        tag: 'observation',
        text: {
          sv: 'Ekonomisk prestation översätts inte automatiskt till förbättrade levnadsvillkor. Lokal kontext, institutioner och fördelningsmekanismer spelar roll.',
          en: 'Economic performance does not automatically translate into improved living conditions. Local context, institutions, and distribution mechanisms matter.',
        },
        sources: ['world_bank', 'eurostat'],
      },
    },
    
    patterns: [
      {
        id: 'regional_divergence',
        observation: {
          sv: 'Skillnader i ekonomisk kapacitet mellan regioner ökar i många länder.',
          en: 'Differences in economic capacity between regions are increasing in many countries.',
        },
        timeframe: '2000-2025',
        geographic_scope: ['global', 'continent', 'country', 'region'],
        uncertainty_level: 'medium',
        sources: ['oecd', 'world_bank'],
        data_tier: 'A',
      },
      {
        id: 'cost_of_living',
        observation: {
          sv: 'Kostnader för basbehov (boende, energi, mat) har ökat snabbare än genomsnittsinkomster i många regioner.',
          en: 'Costs for basic needs (housing, energy, food) have increased faster than average incomes in many regions.',
        },
        timeframe: '2015-2025',
        geographic_scope: ['global', 'country', 'region', 'municipality'],
        uncertainty_level: 'low',
        sources: ['eurostat', 'oecd', 'national_statistics'],
        data_tier: 'A',
      },
    ],
    
    impact_layers: [
      { level: 'global', description: { sv: 'Globala ekonomiska trender', en: 'Global economic trends' }, data_available: true, data_tier: 'A' },
      { level: 'continent', description: { sv: 'Kontinentala mönster', en: 'Continental patterns' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationella indikatorer', en: 'National indicators' }, data_available: true, data_tier: 'A' },
      { level: 'region', description: { sv: 'Regional ekonomisk data', en: 'Regional economic data' }, data_available: true, data_tier: 'B' },
      { level: 'municipality', description: { sv: 'Kommunal ekonomi', en: 'Municipal economy' }, data_available: true, data_tier: 'C' },
    ],
    
    historical_context: [
      {
        id: 'postwar_convergence',
        category: 'economic_policy',
        context_conditions: {
          sv: 'I sammanhang där infrastrukturinvesteringar, utbildningsexpansion och stabila institutioner var på plats (1945-1980)...',
          en: 'In contexts where infrastructure investment, education expansion, and stable institutions were in place (1945-1980)...',
        },
        observed_outcome: {
          sv: '...sammanföll detta med minskande ekonomiska skillnader mellan regioner.',
          en: '...this coincided with decreasing economic differences between regions.',
        },
        when_it_didnt_work: {
          sv: 'Effekten var svagare i ekonomier med svaga institutioner eller där investeringar koncentrerades till vissa områden.',
          en: 'The effect was weaker in economies with weak institutions or where investments were concentrated in certain areas.',
        },
        time_lag: '10-20 år',
        sources: ['economic_history_review', 'nber'],
      },
    ],
    
    drill_prompts: {
      country: { sv: 'Välj land för nationella ekonomiska indikatorer', en: 'Select country for national economic indicators' },
      region: { sv: 'Välj region för lokal ekonomisk data', en: 'Select region for local economic data' },
      municipality: { sv: 'Välj kommun för kommunal ekonomi', en: 'Select municipality for municipal economy' },
    },
    
    uncertainty: {
      main_sources: [
        { sv: 'Ekonomisk data varierar i precision mellan länder', en: 'Economic data varies in precision between countries' },
        { sv: 'Informella ekonomier är ofta underrepresenterade', en: 'Informal economies are often underrepresented' },
        { sv: 'Revideringar av preliminära siffror', en: 'Revisions of preliminary figures' },
      ],
      confidence_range: { low: 60, high: 95, unit: '%' },
      methodology_note: {
        sv: 'Jämförbarhet mellan länder påverkas av olika definitioner och mätmetoder.',
        en: 'Comparability between countries is affected by different definitions and measurement methods.',
      },
    },
    
    sources: [
      { id: 'imf', name: 'International Monetary Fund', type: 'international_org', url: 'https://www.imf.org/en/Data', update_frequency: 'quarterly', last_updated: '2026-01-15' },
      { id: 'world_bank', name: 'World Bank', type: 'international_org', url: 'https://data.worldbank.org/', update_frequency: 'annual', last_updated: '2025-12-01' },
      { id: 'oecd', name: 'OECD', type: 'international_org', url: 'https://data.oecd.org/', update_frequency: 'monthly', last_updated: '2026-01-20' },
    ],
    
    related_questions: ['work_productivity_ai', 'institutional_capacity'],
  },
  
  // ──────────────────────────────────────────────────────────
  // 2. ARBETE, PRODUKTIVITET & AI
  // ──────────────────────────────────────────────────────────
  {
    question_id: 'work_productivity_ai',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'work_productivity_ai',
    icon: 'cpu',
    color: 'violet',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    
    // OFFICIAL COPY
    title: {
      sv: 'Arbete, produktivitet och teknologisk förändring',
      en: 'Work, productivity, and technological change',
    },
    short_description: {
      sv: 'Hur automatisering och artificiell intelligens interagerar med sysselsättning, kompetens och produktivitet.',
      en: 'How automation and artificial intelligence interact with employment, skills, and productivity.',
    },
    what_system_shows: {
      sv: 'Data visar att teknologisk förändring historiskt omformat arbete snarare än eliminerat det helt. Förändringens takt skiljer sig avsevärt mellan sektorer och regioner.',
      en: 'Data shows that technological change historically reshapes work rather than eliminating it outright. The pace of change differs significantly between sectors and regions.',
    },
    what_this_means: {
      sv: 'Vissa typer av arbete minskar medan andra expanderar. Påverkan beror på utbildningssystem, arbetsmarknadsstruktur och anpassningskapacitet.',
      en: 'Some types of work decline while others expand. The impact depends on education systems, labor market structure, and adaptation capacity.',
    },
    uncertainty_statement: {
      sv: 'Framtida AI-adoptionstakt varierar kraftigt. Nuvarande data speglar trender, inte säkerheter.',
      en: 'Future adoption rates of AI vary widely. Current data reflects trends, not certainties.',
    },
    
    summary: {
      what_it_is: {
        tag: 'observation',
        text: {
          sv: 'Historiska mönster för hur automatisering och teknologisk förändring påverkat arbetsmarknader, vilka kompetenser som ersatts, förstärkts eller uppstått.',
          en: 'Historical patterns for how automation and technological change have affected labor markets, which competencies have been replaced, amplified, or emerged.',
        },
        sources: ['ilo', 'oecd', 'stanford_ai_index'],
      },
      why_it_matters_now: {
        tag: 'context',
        text: {
          sv: 'AI-teknologier implementeras i accelererande takt. Skillnaden mellan teknisk möjlighet och faktisk adoption varierar kraftigt mellan sektorer och regioner.',
          en: 'AI technologies are being implemented at an accelerating pace. The difference between technical possibility and actual adoption varies significantly between sectors and regions.',
        },
        sources: ['stanford_ai_index', 'oecd_ai_observatory'],
      },
      what_data_shows: {
        tag: 'observation',
        text: {
          sv: 'Teknologisk förändring omformar arbete snarare än eliminerar det. Förändringens takt skiljer sig avsevärt mellan sektorer och regioner.',
          en: 'Technological change reshapes work rather than eliminating it. The pace of change differs significantly between sectors and regions.',
        },
        sources: ['eurostat_lfs', 'bls', 'ilo'],
      },
    },
    
    patterns: [
      {
        id: 'task_transformation',
        observation: {
          sv: 'Arbetsuppgifter med hög grad av rutinmässighet har minskat som andel av sysselsättningen i industrialiserade länder.',
          en: 'Tasks with a high degree of routine have decreased as a share of employment in industrialized countries.',
        },
        timeframe: '1980-2025',
        geographic_scope: ['global', 'continent', 'country'],
        uncertainty_level: 'low',
        sources: ['autor_2015', 'oecd_skills'],
        data_tier: 'A',
      },
      {
        id: 'adoption_variance',
        observation: {
          sv: 'Teknologiadoption varierar kraftigt: ledande regioner ligger 5-10 år före eftersläpande.',
          en: 'Technology adoption varies significantly: leading regions are 5-10 years ahead of lagging ones.',
        },
        timeframe: '2015-2025',
        geographic_scope: ['global', 'country', 'region'],
        uncertainty_level: 'high',
        sources: ['mckinsey_ai', 'stanford_ai_index'],
        data_tier: 'B',
      },
    ],
    
    impact_layers: [
      { level: 'global', description: { sv: 'Globala arbetsmarknadstrender', en: 'Global labor market trends' }, data_available: true, data_tier: 'A' },
      { level: 'continent', description: { sv: 'Kontinentala automationsmönster', en: 'Continental automation patterns' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationell sysselsättning per sektor', en: 'National employment by sector' }, data_available: true, data_tier: 'A' },
      { level: 'region', description: { sv: 'Regional branschstruktur', en: 'Regional industry structure' }, data_available: true, data_tier: 'B' },
      { level: 'municipality', description: { sv: 'Lokal arbetsmarknad', en: 'Local labor market' }, data_available: true, data_tier: 'C' },
    ],
    
    historical_context: [
      {
        id: 'past_transitions',
        category: 'technological_change',
        context_conditions: {
          sv: 'Vid tidigare teknologiska skiften där utbildningssystem anpassades och övergångsperioder var längre...',
          en: 'In previous technological shifts where education systems adapted and transition periods were longer...',
        },
        observed_outcome: {
          sv: '...sammanföll detta med bredare spridning av produktivitetsvinster över befolkningen.',
          en: '...this coincided with broader distribution of productivity gains across the population.',
        },
        when_it_didnt_work: {
          sv: 'Vid snabba skiften utan anpassningstid observerades längre perioder av strukturell arbetslöshet.',
          en: 'In rapid shifts without adaptation time, longer periods of structural unemployment were observed.',
        },
        time_lag: '10-30 år',
        sources: ['economic_history_review', 'acemoglu_restrepo'],
      },
    ],
    
    drill_prompts: {
      country: { sv: 'Välj land för nationella arbetsmarknadsindikatorer', en: 'Select country for national labor market indicators' },
      region: { sv: 'Välj region för lokal branschstruktur', en: 'Select region for local industry structure' },
      municipality: { sv: 'Välj kommun för lokal arbetsmarknad', en: 'Select municipality for local labor market' },
    },
    
    uncertainty: {
      main_sources: [
        { sv: 'AI-adoptionshastighet är osäker', en: 'AI adoption speed is uncertain' },
        { sv: 'Expertbedömningar varierar kraftigt', en: 'Expert assessments vary widely' },
        { sv: 'Nuvarande data speglar trender, inte säkerheter', en: 'Current data reflects trends, not certainties' },
      ],
      confidence_range: { low: 40, high: 80, unit: '%' },
      methodology_note: {
        sv: 'Vi visar spridningen mellan olika bedömningar, inte en enskild prognos.',
        en: 'We show the spread between different assessments, not a single forecast.',
      },
    },
    
    sources: [
      { id: 'ilo', name: 'International Labour Organization', type: 'international_org', url: 'https://ilostat.ilo.org/', update_frequency: 'annual', last_updated: '2025-11-01' },
      { id: 'stanford_ai_index', name: 'Stanford AI Index', type: 'research', url: 'https://aiindex.stanford.edu/', update_frequency: 'annual', last_updated: '2026-01-01' },
      { id: 'oecd_ai_observatory', name: 'OECD AI Policy Observatory', type: 'international_org', url: 'https://oecd.ai/', update_frequency: 'monthly', last_updated: '2026-01-15' },
    ],
    
    related_questions: ['economy_livability', 'education_adaptation', 'risks_resilience'],
  },
  
  // ──────────────────────────────────────────────────────────
  // 3. ENERGI, RESURSER & BEROENDEN
  // ──────────────────────────────────────────────────────────
  {
    question_id: 'energy_resources',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'energy_resources',
    icon: 'zap',
    color: 'amber',
    scope: ['global', 'continent', 'country', 'region'],
    
    // OFFICIAL COPY
    title: {
      sv: 'Energisystem och resursberoenden',
      en: 'Energy systems and resource dependency',
    },
    short_description: {
      sv: 'Hur samhällen producerar, distribuerar och är beroende av energi och naturresurser.',
      en: 'How societies produce, distribute, and depend on energy and natural resources.',
    },
    what_system_shows: {
      sv: 'Många regioner förblir beroende av koncentrerade energikällor och långa leveranskedjor. Omställningar mot alternativa system är ojämna och begränsade av infrastruktur.',
      en: 'Many regions remain dependent on concentrated energy sources and long supply chains. Transitions toward alternative systems are uneven and constrained by infrastructure.',
    },
    what_this_means: {
      sv: 'Energiberoende påverkar ekonomisk resiliens, kostnadsstabilitet och politisk exponering.',
      en: 'Energy dependency affects economic resilience, cost stability, and political exposure.',
    },
    uncertainty_statement: {
      sv: 'Energidata är känslig för rapporteringsstandarder och geopolitiska förhållanden.',
      en: 'Energy data is sensitive to reporting standards and geopolitical conditions.',
    },
    
    summary: {
      what_it_is: {
        tag: 'observation',
        text: {
          sv: 'Energisystem, resursberoenden och omställning – från fossil till förnybar energi.',
          en: 'Energy systems, resource dependencies, and transition – from fossil to renewable energy.',
        },
        sources: ['iea', 'irena'],
      },
      why_it_matters_now: {
        tag: 'context',
        text: {
          sv: 'Många regioner förblir beroende av koncentrerade energikällor. Omställningar är ojämna och begränsade av infrastruktur.',
          en: 'Many regions remain dependent on concentrated energy sources. Transitions are uneven and constrained by infrastructure.',
        },
        sources: ['iea', 'bnef'],
      },
      what_data_shows: {
        tag: 'observation',
        text: {
          sv: 'Energiberoende påverkar ekonomisk resiliens, kostnadsstabilitet och politisk exponering.',
          en: 'Energy dependency affects economic resilience, cost stability, and political exposure.',
        },
        sources: ['iea', 'eurostat_energy'],
      },
    },
    
    patterns: [
      {
        id: 'renewable_investment',
        observation: {
          sv: 'Investeringar i förnybar energi överstiger nu fossila bränslen globalt, men implementering varierar kraftigt.',
          en: 'Renewable energy investments now exceed fossil fuels globally, but implementation varies significantly.',
        },
        timeframe: '2020-2025',
        geographic_scope: ['global', 'continent', 'country'],
        uncertainty_level: 'medium',
        sources: ['iea', 'bnef'],
        data_tier: 'A',
      },
    ],
    
    impact_layers: [
      { level: 'global', description: { sv: 'Global energimix', en: 'Global energy mix' }, data_available: true, data_tier: 'A' },
      { level: 'continent', description: { sv: 'Kontinentala energimönster', en: 'Continental energy patterns' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationell energiförsörjning', en: 'National energy supply' }, data_available: true, data_tier: 'A' },
      { level: 'region', description: { sv: 'Regional energiproduktion', en: 'Regional energy production' }, data_available: true, data_tier: 'B' },
    ],
    
    historical_context: [],
    
    drill_prompts: {
      country: { sv: 'Välj land för nationell energidata', en: 'Select country for national energy data' },
      region: { sv: 'Välj region för lokal energiproduktion', en: 'Select region for local energy production' },
      municipality: { sv: 'Välj kommun för lokal energianvändning', en: 'Select municipality for local energy usage' },
    },
    
    uncertainty: {
      main_sources: [
        { sv: 'Energidata känslig för rapporteringsstandarder', en: 'Energy data sensitive to reporting standards' },
        { sv: 'Geopolitiska förhållanden påverkar tillgänglighet', en: 'Geopolitical conditions affect availability' },
      ],
      confidence_range: { low: 50, high: 90, unit: '%' },
      methodology_note: {
        sv: 'Jämförbarhet påverkas av olika nationella definitioner.',
        en: 'Comparability is affected by different national definitions.',
      },
    },
    
    sources: [
      { id: 'iea', name: 'International Energy Agency', type: 'international_org', url: 'https://www.iea.org/', update_frequency: 'monthly', last_updated: '2026-01-20' },
      { id: 'irena', name: 'IRENA', type: 'international_org', url: 'https://www.irena.org/', update_frequency: 'annual', last_updated: '2025-12-01' },
    ],
    
    related_questions: ['economy_livability', 'risks_resilience'],
  },
  
  // ──────────────────────────────────────────────────────────
  // 4. HÄLSA, DEMOGRAFI & SOCIAL STABILITET
  // ──────────────────────────────────────────────────────────
  {
    question_id: 'health_demographics',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'health_demographics',
    icon: 'heart-pulse',
    color: 'rose',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    
    // OFFICIAL COPY
    title: {
      sv: 'Hälsa, befolkningsförändring och social stabilitet',
      en: 'Health, population change, and social stability',
    },
    short_description: {
      sv: 'Hur demografiska trender och hälsoutfall påverkar långsiktig samhällskapacitet.',
      en: 'How demographic trends and health outcomes influence long-term societal capacity.',
    },
    what_system_shows: {
      sv: 'Data indikerar åldrande befolkningar i vissa regioner och snabb befolkningstillväxt i andra. Hälsoutfall korrelerar med inkomst, utbildning och tillgång till tjänster.',
      en: 'Data indicates aging populations in some regions and rapid population growth in others. Health outcomes correlate with income, education, and access to services.',
    },
    what_this_means: {
      sv: 'Demografisk förändring påverkar arbetskraftsutbud, offentliga finanser och social sammanhållning över långa tidshorisonter.',
      en: 'Demographic change affects labor supply, public finances, and social cohesion over long time horizons.',
    },
    uncertainty_statement: {
      sv: 'Hälsodatas tillgänglighet varierar, särskilt på lokala nivåer.',
      en: 'Health data availability varies, especially at local levels.',
    },
    
    summary: {
      what_it_is: {
        tag: 'observation',
        text: {
          sv: 'Hälsoutfall, demografiska skiften och social sammanhållning.',
          en: 'Health outcomes, demographic shifts, and social cohesion.',
        },
        sources: ['who', 'un_pop'],
      },
      why_it_matters_now: {
        tag: 'context',
        text: {
          sv: 'Åldrande befolkningar i många länder skapar nya krav på hälso- och omsorgssystem.',
          en: 'Aging populations in many countries create new demands on health and care systems.',
        },
        sources: ['who', 'un_pop'],
      },
      what_data_shows: {
        tag: 'observation',
        text: {
          sv: 'Demografisk förändring påverkar arbetskraftsutbud, offentliga finanser och social sammanhållning.',
          en: 'Demographic change affects labor supply, public finances, and social cohesion.',
        },
        sources: ['who', 'oecd_health'],
      },
    },
    
    patterns: [
      {
        id: 'aging_populations',
        observation: {
          sv: 'Andelen befolkning över 65 år ökar i de flesta industrialiserade länder.',
          en: 'The share of population over 65 is increasing in most industrialized countries.',
        },
        timeframe: '1990-2050',
        geographic_scope: ['global', 'continent', 'country'],
        uncertainty_level: 'low',
        sources: ['un_pop', 'eurostat'],
        data_tier: 'A',
      },
    ],
    
    impact_layers: [
      { level: 'global', description: { sv: 'Globala hälsoindikatorer', en: 'Global health indicators' }, data_available: true, data_tier: 'A' },
      { level: 'continent', description: { sv: 'Kontinentala demografiska trender', en: 'Continental demographic trends' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationell folkhälsostatistik', en: 'National public health statistics' }, data_available: true, data_tier: 'A' },
      { level: 'region', description: { sv: 'Regional hälsodata', en: 'Regional health data' }, data_available: true, data_tier: 'B' },
      { level: 'municipality', description: { sv: 'Lokal folkhälsa', en: 'Local public health' }, data_available: true, data_tier: 'C' },
    ],
    
    historical_context: [],
    
    drill_prompts: {
      country: { sv: 'Välj land för nationell hälsostatistik', en: 'Select country for national health statistics' },
      region: { sv: 'Välj region för regional hälsodata', en: 'Select region for regional health data' },
      municipality: { sv: 'Välj kommun för lokal folkhälsa', en: 'Select municipality for local public health' },
    },
    
    uncertainty: {
      main_sources: [
        { sv: 'Hälsodatas tillgänglighet varierar', en: 'Health data availability varies' },
        { sv: 'Särskilt begränsad på lokala nivåer', en: 'Especially limited at local levels' },
      ],
      confidence_range: { low: 60, high: 95, unit: '%' },
      methodology_note: {
        sv: 'Hälsodefinitioner varierar mellan länder.',
        en: 'Health definitions vary between countries.',
      },
    },
    
    sources: [
      { id: 'who', name: 'World Health Organization', type: 'international_org', url: 'https://www.who.int/data', update_frequency: 'annual', last_updated: '2025-12-01' },
      { id: 'un_pop', name: 'UN Population Division', type: 'international_org', url: 'https://population.un.org/', update_frequency: 'biennial', last_updated: '2024-07-01' },
    ],
    
    related_questions: ['education_adaptation', 'institutional_capacity'],
  },
  
  // ──────────────────────────────────────────────────────────
  // 5. UTBILDNING, KOMPETENS & ANPASSNING
  // ──────────────────────────────────────────────────────────
  {
    question_id: 'education_adaptation',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'education_adaptation',
    icon: 'graduation-cap',
    color: 'sky',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    
    // OFFICIAL COPY
    title: {
      sv: 'Utbildning, kompetens och anpassningsförmåga',
      en: 'Education, skills, and adaptive capacity',
    },
    short_description: {
      sv: 'Hur utbildningssystem förbereder befolkningar för ekonomisk och teknologisk förändring.',
      en: 'How education systems prepare populations for economic and technological change.',
    },
    what_system_shows: {
      sv: 'Utbildningsresultat skiljer sig kraftigt mellan regioner och släpar ofta efter arbetsmarknadens skiftningar.',
      en: 'Educational outcomes differ widely between regions and often lag behind labor market shifts.',
    },
    what_this_means: {
      sv: 'Bristande matchning mellan kompetens och ekonomisk efterfrågan kan begränsa anpassning, även där tillväxtpotential finns.',
      en: 'Mismatch between skills and economic demand can limit adaptation, even where growth potential exists.',
    },
    uncertainty_statement: {
      sv: 'Utbildningskvalitet är svår att jämföra mellan system.',
      en: 'Educational quality is difficult to compare across systems.',
    },
    
    summary: {
      what_it_is: {
        tag: 'observation',
        text: {
          sv: 'Utbildningssystem, kompetensutveckling och samhällets anpassningsförmåga.',
          en: 'Education systems, skill development, and societal adaptability.',
        },
        sources: ['unesco', 'oecd_pisa'],
      },
      why_it_matters_now: {
        tag: 'context',
        text: {
          sv: 'Snabb teknologisk förändring kräver kontinuerlig kompetensutveckling genom hela livet.',
          en: 'Rapid technological change requires continuous skill development throughout life.',
        },
        sources: ['wef', 'oecd'],
      },
      what_data_shows: {
        tag: 'observation',
        text: {
          sv: 'Utbildningsresultat skiljer sig kraftigt mellan regioner och släpar ofta efter arbetsmarknadens skiftningar.',
          en: 'Educational outcomes differ widely between regions and often lag behind labor market shifts.',
        },
        sources: ['unesco', 'world_bank'],
      },
    },
    
    patterns: [
      {
        id: 'skills_mismatch',
        observation: {
          sv: 'Kompetensglapp mellan utbildning och arbetsmarknad observeras i många regioner.',
          en: 'Skills gaps between education and labor market are observed in many regions.',
        },
        timeframe: '2010-2025',
        geographic_scope: ['global', 'country', 'region'],
        uncertainty_level: 'medium',
        sources: ['oecd', 'wef'],
        data_tier: 'B',
      },
    ],
    
    impact_layers: [
      { level: 'global', description: { sv: 'Globala utbildningsindikatorer', en: 'Global education indicators' }, data_available: true, data_tier: 'A' },
      { level: 'continent', description: { sv: 'Kontinentala utbildningsmönster', en: 'Continental education patterns' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationell utbildningsstatistik', en: 'National education statistics' }, data_available: true, data_tier: 'A' },
      { level: 'region', description: { sv: 'Regional utbildningsdata', en: 'Regional education data' }, data_available: true, data_tier: 'B' },
      { level: 'municipality', description: { sv: 'Lokal utbildningsstatistik', en: 'Local education statistics' }, data_available: true, data_tier: 'B' },
    ],
    
    historical_context: [],
    
    drill_prompts: {
      country: { sv: 'Välj land för nationell utbildningsdata', en: 'Select country for national education data' },
      region: { sv: 'Välj region för regional utbildningsstatistik', en: 'Select region for regional education statistics' },
      municipality: { sv: 'Välj kommun för lokal utbildningsdata', en: 'Select municipality for local education data' },
    },
    
    uncertainty: {
      main_sources: [
        { sv: 'Utbildningskvalitet svår att jämföra mellan system', en: 'Educational quality difficult to compare across systems' },
        { sv: 'Olika definitioner av utbildningsnivåer', en: 'Different definitions of education levels' },
      ],
      confidence_range: { low: 55, high: 90, unit: '%' },
      methodology_note: {
        sv: 'PISA och liknande mätningar täcker inte alla dimensioner av utbildning.',
        en: 'PISA and similar measurements do not cover all dimensions of education.',
      },
    },
    
    sources: [
      { id: 'unesco', name: 'UNESCO', type: 'international_org', url: 'https://data.unesco.org/', update_frequency: 'annual', last_updated: '2025-11-01' },
      { id: 'oecd_pisa', name: 'OECD PISA', type: 'international_org', url: 'https://www.oecd.org/pisa/', update_frequency: 'triennial', last_updated: '2023-12-01' },
    ],
    
    related_questions: ['work_productivity_ai', 'health_demographics'],
  },
  
  // ──────────────────────────────────────────────────────────
  // 6. INSTITUTIONELL KAPACITET & STYRNING
  // ──────────────────────────────────────────────────────────
  {
    question_id: 'institutional_capacity',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'institutional_capacity',
    icon: 'landmark',
    color: 'slate',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    
    // OFFICIAL COPY
    title: {
      sv: 'Institutionell kapacitet och styrning',
      en: 'Institutional capacity and governance',
    },
    short_description: {
      sv: 'Hur offentliga institutioner hanterar resurser, ansvar och långsiktig planering.',
      en: 'How public institutions manage resources, responsibilities, and long-term planning.',
    },
    what_system_shows: {
      sv: 'Starka institutioner korrelerar med stabila utfall, men institutionell kapacitet varierar kraftigt mellan och inom länder.',
      en: 'Strong institutions correlate with stable outcomes, but institutional capacity varies significantly between and within countries.',
    },
    what_this_means: {
      sv: 'Styrningskvalitet påverkar hur effektivt samhällen svarar på förändring.',
      en: 'Governance quality influences how effectively societies respond to change.',
    },
    uncertainty_statement: {
      sv: 'Institutionell prestation är komplex och fångas inte fullt ut av kvantitativa indikatorer.',
      en: 'Institutional performance is complex and not fully captured by quantitative indicators.',
    },
    
    summary: {
      what_it_is: {
        tag: 'observation',
        text: {
          sv: 'Institutioners förmåga att leverera, anpassa sig och upprätthålla legitimitet.',
          en: 'Institutions\' ability to deliver, adapt, and maintain legitimacy.',
        },
        sources: ['world_bank_governance', 'transparency_international'],
      },
      why_it_matters_now: {
        tag: 'context',
        text: {
          sv: 'Förtroende för institutioner varierar kraftigt och påverkar samhällens förmåga att hantera kriser.',
          en: 'Trust in institutions varies significantly and affects societies\' ability to handle crises.',
        },
        sources: ['edelman_trust', 'eurobarometer'],
      },
      what_data_shows: {
        tag: 'observation',
        text: {
          sv: 'Starka institutioner korrelerar med stabila utfall, men institutionell kapacitet varierar kraftigt.',
          en: 'Strong institutions correlate with stable outcomes, but institutional capacity varies significantly.',
        },
        sources: ['world_bank_governance'],
      },
    },
    
    patterns: [
      {
        id: 'trust_variation',
        observation: {
          sv: 'Förtroendet för offentliga institutioner varierar kraftigt mellan länder och har minskat i flera under det senaste decenniet.',
          en: 'Trust in public institutions varies significantly between countries and has declined in several over the past decade.',
        },
        timeframe: '2010-2025',
        geographic_scope: ['global', 'country'],
        uncertainty_level: 'medium',
        sources: ['edelman_trust', 'eurobarometer'],
        data_tier: 'B',
      },
    ],
    
    impact_layers: [
      { level: 'global', description: { sv: 'Globala styrningsindikatorer', en: 'Global governance indicators' }, data_available: true, data_tier: 'A' },
      { level: 'continent', description: { sv: 'Kontinentala institutionella mönster', en: 'Continental institutional patterns' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationell institutionell kapacitet', en: 'National institutional capacity' }, data_available: true, data_tier: 'A' },
      { level: 'region', description: { sv: 'Regional styrningskapacitet', en: 'Regional governance capacity' }, data_available: true, data_tier: 'B' },
      { level: 'municipality', description: { sv: 'Kommunal förvaltningskapacitet', en: 'Municipal administrative capacity' }, data_available: true, data_tier: 'C' },
    ],
    
    historical_context: [],
    
    drill_prompts: {
      country: { sv: 'Välj land för nationella styrningsindikatorer', en: 'Select country for national governance indicators' },
      region: { sv: 'Välj region för regional styrningsdata', en: 'Select region for regional governance data' },
      municipality: { sv: 'Välj kommun för kommunal förvaltningsdata', en: 'Select municipality for municipal administrative data' },
    },
    
    uncertainty: {
      main_sources: [
        { sv: 'Institutionell prestation fångas inte fullt av kvantitativa mått', en: 'Institutional performance not fully captured by quantitative measures' },
        { sv: 'Subjektiva bedömningar ingår i många index', en: 'Subjective assessments are part of many indices' },
      ],
      confidence_range: { low: 50, high: 85, unit: '%' },
      methodology_note: {
        sv: 'Institutionell kvalitet är komplex och mångdimensionell.',
        en: 'Institutional quality is complex and multidimensional.',
      },
    },
    
    sources: [
      { id: 'world_bank_governance', name: 'World Bank Governance Indicators', type: 'international_org', url: 'https://info.worldbank.org/governance/wgi/', update_frequency: 'annual', last_updated: '2025-10-01' },
      { id: 'transparency_international', name: 'Transparency International', type: 'research', url: 'https://www.transparency.org/', update_frequency: 'annual', last_updated: '2026-01-15' },
    ],
    
    related_questions: ['economy_livability', 'risks_resilience'],
  },
  
  // ──────────────────────────────────────────────────────────
  // 7. RISKER, RESILIENS & OSÄKERHET
  // ──────────────────────────────────────────────────────────
  {
    question_id: 'risks_resilience',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'risks_resilience',
    icon: 'shield-alert',
    color: 'orange',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    
    // OFFICIAL COPY
    title: {
      sv: 'Riskexponering och samhällelig resiliens',
      en: 'Risk exposure and societal resilience',
    },
    short_description: {
      sv: 'Hur samhällen absorberar chocker och återhämtar sig från störningar.',
      en: 'How societies absorb shocks and recover from disruptions.',
    },
    what_system_shows: {
      sv: 'Regioner med diversifierade ekonomier, starka institutioner och socialt förtroende tenderar att återhämta sig snabbare från kriser.',
      en: 'Regions with diversified economies, strong institutions, and social trust tend to recover faster from crises.',
    },
    what_this_means: {
      sv: 'Resiliens byggs över tid och kan inte skapas omedelbart under kriser.',
      en: 'Resilience is built over time and cannot be created instantly during crises.',
    },
    uncertainty_statement: {
      sv: 'Sällsynta händelser och systemchocker är svåra att modellera exakt.',
      en: 'Rare events and systemic shocks are difficult to model precisely.',
    },
    
    summary: {
      what_it_is: {
        tag: 'observation',
        text: {
          sv: 'Systemrisker, sårbarhet och samhällens förmåga att hantera chocker.',
          en: 'Systemic risks, vulnerability, and societies\' ability to handle shocks.',
        },
        sources: ['wef_global_risks', 'un_ocha'],
      },
      why_it_matters_now: {
        tag: 'context',
        text: {
          sv: 'Klimatrisker, pandemier och geopolitisk osäkerhet skapar sammankopplade sårbarheter.',
          en: 'Climate risks, pandemics, and geopolitical uncertainty create interconnected vulnerabilities.',
        },
        sources: ['ipcc', 'wef'],
      },
      what_data_shows: {
        tag: 'observation',
        text: {
          sv: 'Regioner med diversifierade ekonomier och starka institutioner tenderar att återhämta sig snabbare.',
          en: 'Regions with diversified economies and strong institutions tend to recover faster.',
        },
        sources: ['em_dat', 'un_ocha'],
      },
    },
    
    patterns: [
      {
        id: 'extreme_events',
        observation: {
          sv: 'Frekvensen av rapporterade extrema händelser har ökat. Beredskap och återhämtningsförmåga varierar kraftigt.',
          en: 'Frequency of reported extreme events has increased. Preparedness and recovery capacity vary significantly.',
        },
        timeframe: '1990-2025',
        geographic_scope: ['global', 'continent', 'country'],
        uncertainty_level: 'medium',
        sources: ['em_dat', 'ipcc'],
        data_tier: 'A',
      },
    ],
    
    impact_layers: [
      { level: 'global', description: { sv: 'Globala riskindikatorer', en: 'Global risk indicators' }, data_available: true, data_tier: 'A' },
      { level: 'continent', description: { sv: 'Kontinentala riskprofiler', en: 'Continental risk profiles' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationell riskbedömning', en: 'National risk assessment' }, data_available: true, data_tier: 'A' },
      { level: 'region', description: { sv: 'Regional sårbarhet', en: 'Regional vulnerability' }, data_available: true, data_tier: 'B' },
      { level: 'municipality', description: { sv: 'Lokal sårbarhet', en: 'Local vulnerability' }, data_available: true, data_tier: 'C' },
    ],
    
    historical_context: [],
    
    drill_prompts: {
      country: { sv: 'Välj land för nationell riskprofil', en: 'Select country for national risk profile' },
      region: { sv: 'Välj region för regional sårbarhet', en: 'Select region for regional vulnerability' },
      municipality: { sv: 'Välj kommun för lokal sårbarhet', en: 'Select municipality for local vulnerability' },
    },
    
    uncertainty: {
      main_sources: [
        { sv: 'Sällsynta händelser svåra att modellera', en: 'Rare events difficult to model' },
        { sv: 'Systemchocker har komplexa kedjereaktioner', en: 'Systemic shocks have complex chain reactions' },
        { sv: 'Framtida risker är per definition osäkra', en: 'Future risks are by definition uncertain' },
      ],
      confidence_range: { low: 30, high: 70, unit: '%' },
      methodology_note: {
        sv: 'Vi visar spridningen i riskbedömningar, inte en enskild prognos.',
        en: 'We show the spread in risk assessments, not a single forecast.',
      },
    },
    
    sources: [
      { id: 'wef_global_risks', name: 'World Economic Forum Global Risks Report', type: 'research', url: 'https://www.weforum.org/reports/', update_frequency: 'annual', last_updated: '2026-01-10' },
      { id: 'em_dat', name: 'EM-DAT International Disaster Database', type: 'research', url: 'https://www.emdat.be/', update_frequency: 'continuous', last_updated: '2026-01-25' },
    ],
    
    related_questions: ['energy_resources', 'institutional_capacity'],
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getQuestionContract(questionId: string): QuestionContract | undefined {
  return QUESTION_CONTRACTS.find(q => q.question_id === questionId);
}

export function getCategory(categoryId: string) {
  return QUESTION_CATEGORIES.find(c => c.id === categoryId);
}

export function getAllCategories() {
  return [...QUESTION_CATEGORIES].sort((a, b) => a.order - b.order);
}
