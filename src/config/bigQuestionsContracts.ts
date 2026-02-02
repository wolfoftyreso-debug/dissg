/**
 * 📜 BIG QUESTIONS LAYER - DATA CONTRACTS
 * 
 * Formella datakontrakt för varje Big Question.
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
  
  // Section A: Summary
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
// FULL QUESTION CONTRACTS
// ============================================================

export const QUESTION_CONTRACTS: QuestionContract[] = [
  // 1. GLOBAL ECONOMY & LIVABILITY
  {
    question_id: 'economy_livability',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'economy_livability',
    icon: 'trending-up',
    color: 'emerald',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    
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
          sv: 'Data från flera oberoende källor visar förändringar i ekonomiska mönster som sammanfaller med skiften i levnadsvillkor för stora befolkningsgrupper.',
          en: 'Data from multiple independent sources shows changes in economic patterns that coincide with shifts in living conditions for large population groups.',
        },
        sources: ['imf', 'oecd'],
      },
      what_data_shows: {
        tag: 'observation',
        text: {
          sv: 'Osäkerheten är störst kring produktivitetsutveckling och dess relation till lönetillväxt. Regionala skillnader observeras inom samtliga mätvärden.',
          en: 'Uncertainty is greatest around productivity development and its relation to wage growth. Regional differences are observed across all metrics.',
        },
        sources: ['eurostat', 'bis'],
      },
    },
    
    patterns: [
      {
        id: 'productivity_wage_gap',
        observation: {
          sv: 'I flera OECD-länder observeras en skillnad mellan produktivitetstillväxt och reallöneutveckling sedan 1970-talet.',
          en: 'In several OECD countries, a gap between productivity growth and real wage development has been observed since the 1970s.',
        },
        timeframe: '1970-2025',
        geographic_scope: ['global', 'continent', 'country'],
        uncertainty_level: 'medium',
        sources: ['oecd', 'ilo'],
        data_tier: 'A',
      },
      {
        id: 'debt_levels',
        observation: {
          sv: 'Global skuldsättning (offentlig och privat) har ökat som andel av BNP sedan 2008.',
          en: 'Global debt levels (public and private) have increased as a share of GDP since 2008.',
        },
        timeframe: '2008-2025',
        geographic_scope: ['global', 'country'],
        uncertainty_level: 'low',
        sources: ['imf', 'bis'],
        data_tier: 'A',
      },
      {
        id: 'wealth_concentration',
        observation: {
          sv: 'Förmögenhetskoncentration har ökat i de flesta mätta ekonomier under de senaste två decennierna.',
          en: 'Wealth concentration has increased in most measured economies over the past two decades.',
        },
        timeframe: '2000-2025',
        geographic_scope: ['global', 'country', 'region'],
        uncertainty_level: 'medium',
        sources: ['world_inequality_database', 'credit_suisse'],
        data_tier: 'B',
      },
    ],
    
    impact_layers: [
      { level: 'global', description: { sv: 'Globala trender och jämförelser', en: 'Global trends and comparisons' }, data_available: true, data_tier: 'A' },
      { level: 'continent', description: { sv: 'Kontinentala mönster', en: 'Continental patterns' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationella indikatorer', en: 'National indicators' }, data_available: true, data_tier: 'A' },
      { level: 'region', description: { sv: 'Regional ekonomisk data', en: 'Regional economic data' }, data_available: true, data_tier: 'B' },
      { level: 'municipality', description: { sv: 'Kommunal ekonomi', en: 'Municipal economy' }, data_available: true, data_tier: 'C' },
    ],
    
    historical_context: [
      {
        id: 'postwar_growth',
        category: 'economic_policy',
        context_conditions: {
          sv: 'I sammanhang där stabil infrastrukturinvestering, utbildningsexpansion och handelsavtal var uppfyllda (1945-1975)...',
          en: 'In contexts where stable infrastructure investment, education expansion, and trade agreements were in place (1945-1975)...',
        },
        observed_outcome: {
          sv: '...sammanföll detta med bred inkomsttillväxt över befolkningsskikt.',
          en: '...this coincided with broad income growth across population segments.',
        },
        when_it_didnt_work: {
          sv: 'Effekten var svagare i ekonomier med svaga institutioner eller hög korruption.',
          en: 'The effect was weaker in economies with weak institutions or high corruption.',
        },
        time_lag: '5-15 år',
        sources: ['economic_history_review', 'nber'],
      },
    ],
    
    drill_prompts: {
      country: { sv: 'Välj land för att se nationella ekonomiska indikatorer', en: 'Select country to see national economic indicators' },
      region: { sv: 'Välj region för lokal ekonomisk data', en: 'Select region for local economic data' },
      municipality: { sv: 'Välj kommun för kommunal ekonomi', en: 'Select municipality for municipal economy' },
    },
    
    uncertainty: {
      main_sources: [
        { sv: 'Metodskillnader mellan länder', en: 'Methodological differences between countries' },
        { sv: 'Fördröjning i data (1-6 månader)', en: 'Data lag (1-6 months)' },
        { sv: 'Revideringar av preliminära siffror', en: 'Revisions of preliminary figures' },
      ],
      confidence_range: { low: 60, high: 95, unit: '%' },
      methodology_note: {
        sv: 'Jämförbarhet mellan länder påverkas av olika definitioner av arbetslöshet, inflation och produktivitet.',
        en: 'Comparability between countries is affected by different definitions of unemployment, inflation, and productivity.',
      },
    },
    
    sources: [
      { id: 'imf', name: 'International Monetary Fund', type: 'international_org', url: 'https://www.imf.org/en/Data', update_frequency: 'quarterly', last_updated: '2026-01-15' },
      { id: 'world_bank', name: 'World Bank', type: 'international_org', url: 'https://data.worldbank.org/', update_frequency: 'annual', last_updated: '2025-12-01' },
      { id: 'oecd', name: 'OECD', type: 'international_org', url: 'https://data.oecd.org/', update_frequency: 'monthly', last_updated: '2026-01-20' },
      { id: 'eurostat', name: 'Eurostat', type: 'official_statistics', url: 'https://ec.europa.eu/eurostat', update_frequency: 'monthly', last_updated: '2026-01-25' },
    ],
    
    related_questions: ['work_productivity_ai', 'institutional_capacity'],
  },
  
  // 2. WORK, PRODUCTIVITY & AI
  {
    question_id: 'work_productivity_ai',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'work_productivity_ai',
    icon: 'cpu',
    color: 'violet',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    
    summary: {
      what_it_is: {
        tag: 'observation',
        text: {
          sv: 'Historiska mönster för hur automatisering och teknologisk förändring påverkat arbetsmarknader, vilka kompetenser som ersatts, förstärkts eller uppstått.',
          en: 'Historical patterns for how automation and technological change have affected labor markets, which competencies have been replaced, amplified, or emerged.',
        },
        sources: ['ilo', 'oecd', 'mckinsey'],
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
          sv: 'Vi säger aldrig "X% kommer att förlora jobbet". Vi visar istället: "I regioner med dessa egenskaper har denna typ av arbete minskat/ökat över tid."',
          en: 'We never say "X% will lose their jobs." Instead, we show: "In regions with these characteristics, this type of work has decreased/increased over time."',
        },
        sources: ['eurostat_lfs', 'bls'],
      },
    },
    
    patterns: [
      {
        id: 'routine_task_decline',
        observation: {
          sv: 'Arbetsuppgifter med hög grad av rutinmässighet (både kognitiva och manuella) har minskat som andel av sysselsättningen i industrialiserade länder sedan 1980-talet.',
          en: 'Tasks with a high degree of routine (both cognitive and manual) have decreased as a share of employment in industrialized countries since the 1980s.',
        },
        timeframe: '1980-2025',
        geographic_scope: ['global', 'continent', 'country'],
        uncertainty_level: 'low',
        sources: ['autor_2015', 'oecd_skills'],
        data_tier: 'A',
      },
      {
        id: 'ai_adoption_variance',
        observation: {
          sv: 'AI-adoption varierar kraftigt: ledande regioner 5-10 år före eftersläpande. Implementeringstakten är långsammare än teknisk kapacitet.',
          en: 'AI adoption varies significantly: leading regions 5-10 years ahead of lagging ones. Implementation pace is slower than technical capability.',
        },
        timeframe: '2015-2025',
        geographic_scope: ['global', 'country', 'region'],
        uncertainty_level: 'high',
        sources: ['mckinsey_ai', 'stanford_ai_index'],
        data_tier: 'B',
      },
      {
        id: 'skill_complementarity',
        observation: {
          sv: 'Kompetenser som kompletterar automatisering (kreativitet, social interaktion, beslutsfattande under osäkerhet) har ökat i efterfrågan.',
          en: 'Competencies that complement automation (creativity, social interaction, decision-making under uncertainty) have increased in demand.',
        },
        timeframe: '2000-2025',
        geographic_scope: ['global', 'country'],
        uncertainty_level: 'medium',
        sources: ['wef_future_of_jobs', 'linkedin_skills'],
        data_tier: 'B',
      },
    ],
    
    impact_layers: [
      { level: 'global', description: { sv: 'Globala arbetsmarknadstrender', en: 'Global labor market trends' }, data_available: true, data_tier: 'A' },
      { level: 'continent', description: { sv: 'Regional automatiseringsgrad', en: 'Regional automation levels' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationell sysselsättning per sektor', en: 'National employment by sector' }, data_available: true, data_tier: 'A' },
      { level: 'region', description: { sv: 'Regional branschstruktur', en: 'Regional industry structure' }, data_available: true, data_tier: 'B' },
      { level: 'municipality', description: { sv: 'Lokal arbetsmarknad', en: 'Local labor market' }, data_available: true, data_tier: 'C' },
    ],
    
    historical_context: [
      {
        id: 'industrial_transition',
        category: 'technological_change',
        context_conditions: {
          sv: 'Vid tidigare teknologiska skiften (industrialisering, elektrifiering, digitalisering) där utbildningssystem anpassades och övergångsperioder var längre...',
          en: 'In previous technological shifts (industrialization, electrification, digitization) where education systems adapted and transition periods were longer...',
        },
        observed_outcome: {
          sv: '...sammanföll detta med bredare spridning av produktivitetsvinster över befolkningen.',
          en: '...this coincided with broader distribution of productivity gains across the population.',
        },
        when_it_didnt_work: {
          sv: 'Vid snabba skiften utan anpassningstid observerades längre perioder av strukturell arbetslöshet i drabbade regioner.',
          en: 'In rapid shifts without adaptation time, longer periods of structural unemployment were observed in affected regions.',
        },
        time_lag: '10-30 år',
        sources: ['economic_history_review', 'acemoglu_restrepo'],
      },
    ],
    
    drill_prompts: {
      country: { sv: 'Välj land för nationella arbetsmarknadsindikatorer', en: 'Select country for national labor market indicators' },
      region: { sv: 'Välj region för lokal branschstruktur', en: 'Select region for local industry structure' },
      municipality: { sv: 'Välj kommun för kommunal arbetsmarknad', en: 'Select municipality for local labor market' },
    },
    
    uncertainty: {
      main_sources: [
        { sv: 'AI-adoptionshastighet osäker', en: 'AI adoption speed uncertain' },
        { sv: 'Expertbedömningar varierar kraftigt', en: 'Expert assessments vary widely' },
        { sv: 'Historiska paralleller har begränsningar', en: 'Historical parallels have limitations' },
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
  
  // Abbreviated contracts for remaining 5 categories...
  {
    question_id: 'energy_resources',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'energy_resources',
    icon: 'zap',
    color: 'amber',
    scope: ['global', 'continent', 'country', 'region'],
    summary: {
      what_it_is: { tag: 'observation', text: { sv: 'Energisystem, resursberoenden och omställning – från fossil till förnybar energi.', en: 'Energy systems, resource dependencies, and transition – from fossil to renewable energy.' }, sources: ['iea', 'irena'] },
      why_it_matters_now: { tag: 'context', text: { sv: 'Energiomställningen accelererar globalt. Regionala skillnader i beroenden skapar olika sårbarheter.', en: 'Energy transition is accelerating globally. Regional differences in dependencies create different vulnerabilities.' }, sources: ['iea'] },
      what_data_shows: { tag: 'observation', text: { sv: 'Investeringar i förnybar energi översteg fossila bränslen 2023, men implementering varierar kraftigt.', en: 'Renewable energy investments exceeded fossil fuels in 2023, but implementation varies significantly.' }, sources: ['iea', 'bnef'] },
    },
    patterns: [],
    impact_layers: [
      { level: 'global', description: { sv: 'Global energimix', en: 'Global energy mix' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationell energiförsörjning', en: 'National energy supply' }, data_available: true, data_tier: 'A' },
    ],
    historical_context: [],
    drill_prompts: { country: { sv: 'Välj land', en: 'Select country' }, region: { sv: 'Välj region', en: 'Select region' }, municipality: { sv: 'Välj kommun', en: 'Select municipality' } },
    uncertainty: { main_sources: [], confidence_range: { low: 50, high: 90, unit: '%' }, methodology_note: { sv: '', en: '' } },
    sources: [{ id: 'iea', name: 'International Energy Agency', type: 'international_org', url: 'https://www.iea.org/', update_frequency: 'monthly', last_updated: '2026-01-20' }],
    related_questions: ['economy_livability', 'risks_resilience'],
  },
  {
    question_id: 'health_demographics',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'health_demographics',
    icon: 'heart-pulse',
    color: 'rose',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    summary: {
      what_it_is: { tag: 'observation', text: { sv: 'Hälsoutfall, demografiska skiften och social sammanhållning.', en: 'Health outcomes, demographic shifts, and social cohesion.' }, sources: ['who', 'un_pop'] },
      why_it_matters_now: { tag: 'context', text: { sv: 'Åldrande befolkningar i många länder skapar nya krav på hälso- och omsorgssystem.', en: 'Aging populations in many countries create new demands on health and care systems.' }, sources: ['who'] },
      what_data_shows: { tag: 'observation', text: { sv: 'Livslängden ökar globalt men ojämnt. Skillnader mellan och inom länder består.', en: 'Life expectancy increases globally but unevenly. Differences between and within countries persist.' }, sources: ['who', 'ihme'] },
    },
    patterns: [],
    impact_layers: [
      { level: 'global', description: { sv: 'Globala hälsoindikatorer', en: 'Global health indicators' }, data_available: true, data_tier: 'A' },
      { level: 'municipality', description: { sv: 'Lokal folkhälsa', en: 'Local public health' }, data_available: true, data_tier: 'B' },
    ],
    historical_context: [],
    drill_prompts: { country: { sv: 'Välj land', en: 'Select country' }, region: { sv: 'Välj region', en: 'Select region' }, municipality: { sv: 'Välj kommun', en: 'Select municipality' } },
    uncertainty: { main_sources: [], confidence_range: { low: 60, high: 95, unit: '%' }, methodology_note: { sv: '', en: '' } },
    sources: [{ id: 'who', name: 'World Health Organization', type: 'international_org', url: 'https://www.who.int/data', update_frequency: 'annual', last_updated: '2025-12-01' }],
    related_questions: ['education_adaptation', 'institutional_capacity'],
  },
  {
    question_id: 'education_adaptation',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'education_adaptation',
    icon: 'graduation-cap',
    color: 'sky',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    summary: {
      what_it_is: { tag: 'observation', text: { sv: 'Utbildningssystem, kompetensutveckling och samhällets anpassningsförmåga.', en: 'Education systems, skill development, and societal adaptability.' }, sources: ['unesco', 'oecd_pisa'] },
      why_it_matters_now: { tag: 'context', text: { sv: 'Snabb teknologisk förändring kräver kontinuerlig kompetensutveckling genom hela livet.', en: 'Rapid technological change requires continuous skill development throughout life.' }, sources: ['wef'] },
      what_data_shows: { tag: 'observation', text: { sv: 'Tillgång till utbildning har ökat globalt, men kvalitet och relevans varierar kraftigt.', en: 'Access to education has increased globally, but quality and relevance vary significantly.' }, sources: ['unesco', 'world_bank'] },
    },
    patterns: [],
    impact_layers: [
      { level: 'global', description: { sv: 'Globala utbildningsindikatorer', en: 'Global education indicators' }, data_available: true, data_tier: 'A' },
      { level: 'municipality', description: { sv: 'Lokal utbildningsstatistik', en: 'Local education statistics' }, data_available: true, data_tier: 'B' },
    ],
    historical_context: [],
    drill_prompts: { country: { sv: 'Välj land', en: 'Select country' }, region: { sv: 'Välj region', en: 'Select region' }, municipality: { sv: 'Välj kommun', en: 'Select municipality' } },
    uncertainty: { main_sources: [], confidence_range: { low: 55, high: 90, unit: '%' }, methodology_note: { sv: '', en: '' } },
    sources: [{ id: 'unesco', name: 'UNESCO', type: 'international_org', url: 'https://data.unesco.org/', update_frequency: 'annual', last_updated: '2025-11-01' }],
    related_questions: ['work_productivity_ai', 'health_demographics'],
  },
  {
    question_id: 'institutional_capacity',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'institutional_capacity',
    icon: 'landmark',
    color: 'slate',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    summary: {
      what_it_is: { tag: 'observation', text: { sv: 'Institutioners förmåga att leverera, anpassa sig och upprätthålla legitimitet.', en: 'Institutions\' ability to deliver, adapt, and maintain legitimacy.' }, sources: ['world_bank_governance', 'transparency_international'] },
      why_it_matters_now: { tag: 'context', text: { sv: 'Förtroende för institutioner varierar kraftigt och påverkar samhällens förmåga att hantera kriser.', en: 'Trust in institutions varies significantly and affects societies\' ability to handle crises.' }, sources: ['edelman_trust', 'eurobarometer'] },
      what_data_shows: { tag: 'observation', text: { sv: 'Institutionell kvalitet korrelerar med ekonomisk utveckling, men kausaliteten är komplex.', en: 'Institutional quality correlates with economic development, but causality is complex.' }, sources: ['world_bank_governance'] },
    },
    patterns: [],
    impact_layers: [
      { level: 'global', description: { sv: 'Globala styrningsindikatorer', en: 'Global governance indicators' }, data_available: true, data_tier: 'A' },
      { level: 'country', description: { sv: 'Nationell institutionell kapacitet', en: 'National institutional capacity' }, data_available: true, data_tier: 'A' },
    ],
    historical_context: [],
    drill_prompts: { country: { sv: 'Välj land', en: 'Select country' }, region: { sv: 'Välj region', en: 'Select region' }, municipality: { sv: 'Välj kommun', en: 'Select municipality' } },
    uncertainty: { main_sources: [], confidence_range: { low: 50, high: 85, unit: '%' }, methodology_note: { sv: '', en: '' } },
    sources: [{ id: 'world_bank_governance', name: 'World Bank Governance Indicators', type: 'international_org', url: 'https://info.worldbank.org/governance/wgi/', update_frequency: 'annual', last_updated: '2025-10-01' }],
    related_questions: ['economy_livability', 'risks_resilience'],
  },
  {
    question_id: 'risks_resilience',
    version: '1.0.0',
    last_updated: '2026-02-02',
    category: 'risks_resilience',
    icon: 'shield-alert',
    color: 'orange',
    scope: ['global', 'continent', 'country', 'region', 'municipality'],
    summary: {
      what_it_is: { tag: 'observation', text: { sv: 'Systemrisker, sårbarhet och samhällens förmåga att hantera chocker.', en: 'Systemic risks, vulnerability, and societies\' ability to handle shocks.' }, sources: ['wef_global_risks', 'un_ocha'] },
      why_it_matters_now: { tag: 'context', text: { sv: 'Klimatrisker, pandemier och geopolitisk osäkerhet skapar sammankopplade sårbarheter.', en: 'Climate risks, pandemics, and geopolitical uncertainty create interconnected vulnerabilities.' }, sources: ['ipcc', 'wef'] },
      what_data_shows: { tag: 'observation', text: { sv: 'Frekvensen av extrema händelser ökar. Beredskap och återhämtningsförmåga varierar kraftigt.', en: 'Frequency of extreme events is increasing. Preparedness and recovery capacity vary significantly.' }, sources: ['em_dat', 'un_ocha'] },
    },
    patterns: [],
    impact_layers: [
      { level: 'global', description: { sv: 'Globala riskindikatorer', en: 'Global risk indicators' }, data_available: true, data_tier: 'A' },
      { level: 'municipality', description: { sv: 'Lokal sårbarhet', en: 'Local vulnerability' }, data_available: true, data_tier: 'C' },
    ],
    historical_context: [],
    drill_prompts: { country: { sv: 'Välj land', en: 'Select country' }, region: { sv: 'Välj region', en: 'Select region' }, municipality: { sv: 'Välj kommun', en: 'Select municipality' } },
    uncertainty: { main_sources: [], confidence_range: { low: 30, high: 70, unit: '%' }, methodology_note: { sv: 'Framtida risker är per definition osäkra. Vi visar spridningen i bedömningar.', en: 'Future risks are by definition uncertain. We show the spread in assessments.' } },
    sources: [{ id: 'wef_global_risks', name: 'World Economic Forum Global Risks Report', type: 'research', url: 'https://www.weforum.org/reports/', update_frequency: 'annual', last_updated: '2026-01-10' }],
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
