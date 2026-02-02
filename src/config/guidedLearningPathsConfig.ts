/**
 * MODULE — GUIDED LEARNING PATHS (GLP)
 * "Hjälp mig förstå världen, steg för steg – med data som grund."
 * 
 * Pedagogik utan åsikt.
 * Inga budskap. Inga svar i förväg. Bara progressiv förståelse.
 * 
 * GRUNDPRINCIP:
 * Människor lär sig inte av dashboards.
 * De lär sig av sekvenser av insikter.
 * GLP bygger mentala modeller, inte "takeaways".
 */

// ═══════════════════════════════════════════════════════════════
// KÄRNPRINCIP
// ═══════════════════════════════════════════════════════════════

export const GLP_CORE_PRINCIPLE = {
  statement: 'Systemet lär inte ut svar. Systemet lär ut hur man ser.',
  statementEn: 'The system doesn\'t teach answers. It teaches how to see.',
  enforced: true,
  
  pedagogical_rules: {
    no_predetermined_conclusions: true,
    no_value_judgments: true,
    progressive_complexity: true,
    user_driven_pace: true,
    always_show_uncertainty: true,
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK QA — LEARNING PATH ENGINE
// ═══════════════════════════════════════════════════════════════

export interface LearningPath {
  id: string;
  title: string;
  titleSv: string;
  description: string;
  descriptionSv: string;
  icon: string;
  category: string;
  level: PathLevel;
  estimatedMinutes: number;
  steps: LearningStep[];
  prerequisites?: string[];
  relatedPaths?: string[];
}

export type PathLevel = 'quick' | 'foundation' | 'deep';

export const PATH_LEVELS: Record<PathLevel, { label: string; labelSv: string; duration: string }> = {
  quick: { 
    label: 'Quick orientation', 
    labelSv: 'Snabb orientering', 
    duration: '5–10 min' 
  },
  foundation: { 
    label: 'Foundation understanding', 
    labelSv: 'Grundförståelse', 
    duration: '30 min' 
  },
  deep: { 
    label: 'Deep dive', 
    labelSv: 'Djupdykning', 
    duration: 'Fri tid' 
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK QB — PATH STRUCTURE (ALLTID LIKADAN)
// ═══════════════════════════════════════════════════════════════

export interface LearningStep {
  id: string;
  order: number;
  type: StepType;
  title: string;
  titleSv: string;
  content: StepContent;
  interaction?: InteractionType;
  microInsights?: MicroInsight[];
  reflection?: ReflectionPrompt;
  canSkip: boolean;
}

export type StepType = 
  | 'what_is_this'        // Vad är detta system?
  | 'how_measured'        // Hur mäts det?
  | 'historical_view'     // Hur har det förändrats över tid?
  | 'correlations'        // Vad rör sig tillsammans med detta?
  | 'regional_comparison' // Hur skiljer det sig mellan länder/regioner?
  | 'trade_offs'          // Vilka trade-offs är vanliga?
  | 'misunderstandings'   // Vad är ofta missförstått?
  | 'local_connection';   // Global → Lokal koppling

export const STEP_TYPE_ORDER: StepType[] = [
  'what_is_this',
  'how_measured',
  'historical_view',
  'correlations',
  'regional_comparison',
  'trade_offs',
  'misunderstandings',
  'local_connection',
];

export const STEP_TYPE_LABELS: Record<StepType, { en: string; sv: string }> = {
  what_is_this: { en: 'What is this system?', sv: 'Vad är detta system?' },
  how_measured: { en: 'How is it measured?', sv: 'Hur mäts det?' },
  historical_view: { en: 'How has it changed over time?', sv: 'Hur har det förändrats över tid?' },
  correlations: { en: 'What moves together with this?', sv: 'Vad rör sig tillsammans med detta?' },
  regional_comparison: { en: 'How does it differ between regions?', sv: 'Hur skiljer det sig mellan regioner?' },
  trade_offs: { en: 'What trade-offs are common?', sv: 'Vilka trade-offs är vanliga?' },
  misunderstandings: { en: 'What is often misunderstood?', sv: 'Vad är ofta missförstått?' },
  local_connection: { en: 'From global to local', sv: 'Från globalt till lokalt' },
};

export interface StepContent {
  text: string;
  textSv: string;
  dataPoints?: string[];
  visualizationType?: 'chart' | 'comparison' | 'map' | 'timeline' | 'canvas';
  sourceReferences?: string[];
}

// ═══════════════════════════════════════════════════════════════
// BLOCK QC — MICRO-INSIGHTS (MYCKET VIKTIGT)
// ═══════════════════════════════════════════════════════════════

export interface MicroInsight {
  id: string;
  type: 'notice' | 'observe' | 'pattern';
  text: string;
  textSv: string;
  triggerCondition?: string;
}

// Cognitive pointers, NOT conclusions
export const MICRO_INSIGHT_PREFIXES = {
  notice: {
    en: 'Notice that...',
    sv: 'Lägg märke till att...',
  },
  observe: {
    en: 'Observe how...',
    sv: 'Notera hur...',
  },
  pattern: {
    en: 'Here we often see that...',
    sv: 'Här ser vi ofta att...',
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK QD — INTERAKTIVT LÄRANDE
// ═══════════════════════════════════════════════════════════════

export type InteractionType = 
  | 'click_explore'     // Klicka för att utforska
  | 'drag_compare'      // Dra för att jämföra
  | 'select_region'     // Välj region
  | 'change_period'     // Ändra tidsperiod
  | 'toggle_layer';     // Växla datalager

export const INTERACTION_PROMPTS: Record<InteractionType, { en: string; sv: string }> = {
  click_explore: { 
    en: 'Click any data point to explore further', 
    sv: 'Klicka på valfri datapunkt för att utforska vidare' 
  },
  drag_compare: { 
    en: 'Drag to compare different values', 
    sv: 'Dra för att jämföra olika värden' 
  },
  select_region: { 
    en: 'Select a region to see local data', 
    sv: 'Välj en region för att se lokal data' 
  },
  change_period: { 
    en: 'Change the time period to see trends', 
    sv: 'Ändra tidsperiod för att se trender' 
  },
  toggle_layer: { 
    en: 'Toggle data layers to see relationships', 
    sv: 'Växla datalager för att se samband' 
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK QE — "STOP & REFLECT"
// ═══════════════════════════════════════════════════════════════

export interface ReflectionPrompt {
  question: string;
  questionSv: string;
  followUp: string;
  followUpSv: string;
  // No answers provided - just reflection
}

export const REFLECTION_FRAMEWORK = {
  intro_sv: 'Vad tror du hände här?',
  intro_en: 'What do you think happened here?',
  
  follow_up_sv: 'Låt oss titta på datan.',
  follow_up_en: 'Let\'s look at the data.',
  
  purpose: 'Builds critical thinking by prompting reflection before revealing data',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK QF — COMMON MISINTERPRETATIONS
// ═══════════════════════════════════════════════════════════════

export interface Misinterpretation {
  id: string;
  title: string;
  titleSv: string;
  description: string;
  descriptionSv: string;
  category: 'timing' | 'aggregation' | 'causation' | 'selection' | 'context';
  example?: string;
  exampleSv?: string;
}

export const COMMON_MISINTERPRETATIONS: Misinterpretation[] = [
  {
    id: 'short_vs_long',
    title: 'Short-term vs long-term effects',
    titleSv: 'Kortsiktiga vs långsiktiga effekter',
    description: 'Initial changes often look different from final outcomes',
    descriptionSv: 'Initiala förändringar ser ofta annorlunda ut än slutresultatet',
    category: 'timing',
    example: 'A policy may cause short-term disruption but long-term improvement',
    exampleSv: 'En policy kan orsaka kortsiktig störning men långsiktig förbättring',
  },
  {
    id: 'average_vs_spread',
    title: 'Average vs distribution',
    titleSv: 'Genomsnitt vs spridning',
    description: 'Averages hide important differences between groups',
    descriptionSv: 'Genomsnitt döljer viktiga skillnader mellan grupper',
    category: 'aggregation',
    example: 'Average income can stay stable while inequality increases',
    exampleSv: 'Genomsnittlig inkomst kan vara stabil medan ojämlikheten ökar',
  },
  {
    id: 'correlation_causation',
    title: 'Correlation vs causation',
    titleSv: 'Samtidighet vs orsak',
    description: 'Things that move together don\'t necessarily cause each other',
    descriptionSv: 'Saker som rör sig tillsammans orsakar inte nödvändigtvis varandra',
    category: 'causation',
    example: 'Ice cream sales and drownings both increase in summer',
    exampleSv: 'Glassförsäljning och drunkningar ökar båda på sommaren',
  },
  {
    id: 'cherry_picking',
    title: 'Selected time periods',
    titleSv: 'Utvalda tidsperioder',
    description: 'Different start/end dates can tell different stories',
    descriptionSv: 'Olika start-/slutdatum kan berätta olika historier',
    category: 'selection',
    example: 'Starting from a peak vs a trough changes the narrative',
    exampleSv: 'Att börja från en topp vs en dal ändrar berättelsen',
  },
  {
    id: 'missing_context',
    title: 'Missing context',
    titleSv: 'Saknad kontext',
    description: 'Numbers without context can be misleading',
    descriptionSv: 'Siffror utan kontext kan vara vilseledande',
    category: 'context',
    example: 'A 10% increase means different things in different situations',
    exampleSv: 'En 10% ökning betyder olika saker i olika situationer',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK QG — PATHS BY LEVEL
// ═══════════════════════════════════════════════════════════════

// Same data, different tempo
export function getStepsForLevel(allSteps: LearningStep[], level: PathLevel): LearningStep[] {
  switch (level) {
    case 'quick':
      // Only essential steps: what, historical, local
      return allSteps.filter(s => 
        ['what_is_this', 'historical_view', 'local_connection'].includes(s.type)
      );
    case 'foundation':
      // Skip deep trade-offs and misunderstandings for now
      return allSteps.filter(s => 
        s.type !== 'trade_offs'
      );
    case 'deep':
      // All steps
      return allSteps;
    default:
      return allSteps;
  }
}

// ═══════════════════════════════════════════════════════════════
// BLOCK QH — GLOBAL → LOKAL KOPPLING
// ═══════════════════════════════════════════════════════════════

export const LOCAL_CONNECTION_FRAMEWORK = {
  global_intro_sv: 'Så här ser detta ut globalt',
  global_intro_en: 'This is how it looks globally',
  
  local_intro_sv: 'och så här ser det ut där du bor.',
  local_intro_en: 'and this is how it looks where you live.',
  
  prompt_sv: 'Välj din region för att se lokal data',
  prompt_en: 'Select your region to see local data',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK QI — SHAREABLE LEARNING (UTAN MANIPULATION)
// ═══════════════════════════════════════════════════════════════

export interface ShareableLearning {
  pathId: string;
  stepId: string;
  observations: string[];
  context: {
    dataPoints: string[];
    timeRange: [number, number];
    regions: string[];
  };
  methodology: string;
  uncertaintyNote: string;
  generatedAt: string;
}

export const SHARE_REQUIREMENTS = {
  must_include: [
    'full_context',
    'methodology',
    'uncertainty',
    'data_sources',
  ],
  
  share_template_sv: `Jag utforskade: {topic}
Observation: {observation}
Period: {timeRange}
⚠️ Detta visar mönster, inte slutsatser.`,

  share_template_en: `I explored: {topic}
Observation: {observation}
Period: {timeRange}
⚠️ This shows patterns, not conclusions.`,

  anti_manipulation: 'No screenshot without context',
} as const;

// ═══════════════════════════════════════════════════════════════
// EXAMPLE LEARNING PATHS
// ═══════════════════════════════════════════════════════════════

export const EXAMPLE_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'energy-system',
    title: 'Understanding the Energy System',
    titleSv: 'Förstå energisystemet',
    description: 'How energy production, consumption, and prices connect',
    descriptionSv: 'Hur energiproduktion, konsumtion och priser hänger ihop',
    icon: '⚡',
    category: 'systems',
    level: 'foundation',
    estimatedMinutes: 30,
    steps: [
      {
        id: 'energy-what',
        order: 1,
        type: 'what_is_this',
        title: 'What is the energy system?',
        titleSv: 'Vad är energisystemet?',
        content: {
          text: 'The energy system encompasses all processes from production to consumption of energy in society.',
          textSv: 'Energisystemet omfattar alla processer från produktion till konsumtion av energi i samhället.',
          dataPoints: ['energy_production', 'energy_consumption', 'energy_price'],
          visualizationType: 'chart',
        },
        microInsights: [
          {
            id: 'energy-intro-1',
            type: 'notice',
            text: 'energy systems include both electricity and heating',
            textSv: 'energisystem inkluderar både el och värme',
          },
        ],
        canSkip: false,
      },
      {
        id: 'energy-measured',
        order: 2,
        type: 'how_measured',
        title: 'How is energy measured?',
        titleSv: 'Hur mäts energi?',
        content: {
          text: 'Energy is measured in different units depending on context: kWh for households, TWh for national statistics.',
          textSv: 'Energi mäts i olika enheter beroende på sammanhang: kWh för hushåll, TWh för nationell statistik.',
          dataPoints: ['energy_kwh', 'energy_twh'],
          sourceReferences: ['Energimyndigheten', 'SCB'],
        },
        interaction: 'click_explore',
        canSkip: true,
      },
      {
        id: 'energy-historical',
        order: 3,
        type: 'historical_view',
        title: 'Energy over the decades',
        titleSv: 'Energi genom decennierna',
        content: {
          text: 'See how energy production and consumption has evolved.',
          textSv: 'Se hur energiproduktion och konsumtion har utvecklats.',
          visualizationType: 'timeline',
        },
        reflection: {
          question: 'What major events do you think affected energy use?',
          questionSv: 'Vilka stora händelser tror du påverkade energianvändningen?',
          followUp: 'Let\'s see what the data shows.',
          followUpSv: 'Låt oss se vad datan visar.',
        },
        canSkip: false,
      },
      {
        id: 'energy-correlations',
        order: 4,
        type: 'correlations',
        title: 'What moves with energy prices?',
        titleSv: 'Vad rör sig med energipriserna?',
        content: {
          text: 'Explore what tends to change when energy prices change.',
          textSv: 'Utforska vad som tenderar att förändras när energipriserna förändras.',
          visualizationType: 'canvas',
        },
        interaction: 'drag_compare',
        microInsights: [
          {
            id: 'energy-corr-1',
            type: 'pattern',
            text: 'energy prices and household costs often move together, but with delay',
            textSv: 'energipriser och hushållskostnader rör sig ofta tillsammans, men med fördröjning',
          },
        ],
        canSkip: true,
      },
      {
        id: 'energy-regional',
        order: 5,
        type: 'regional_comparison',
        title: 'Energy across regions',
        titleSv: 'Energi i olika regioner',
        content: {
          text: 'Energy systems differ significantly between regions.',
          textSv: 'Energisystem skiljer sig betydligt mellan regioner.',
          visualizationType: 'map',
        },
        interaction: 'select_region',
        canSkip: true,
      },
      {
        id: 'energy-tradeoffs',
        order: 6,
        type: 'trade_offs',
        title: 'Energy trade-offs',
        titleSv: 'Energins avvägningar',
        content: {
          text: 'Different energy sources come with different trade-offs.',
          textSv: 'Olika energikällor kommer med olika avvägningar.',
        },
        canSkip: true,
      },
      {
        id: 'energy-misunderstandings',
        order: 7,
        type: 'misunderstandings',
        title: 'Common energy misconceptions',
        titleSv: 'Vanliga missförstånd om energi',
        content: {
          text: 'Some aspects of energy systems are often misunderstood.',
          textSv: 'Vissa aspekter av energisystem missförstås ofta.',
        },
        canSkip: true,
      },
      {
        id: 'energy-local',
        order: 8,
        type: 'local_connection',
        title: 'Energy where you live',
        titleSv: 'Energi där du bor',
        content: {
          text: 'See how your region compares to the national picture.',
          textSv: 'Se hur din region jämförs med den nationella bilden.',
          visualizationType: 'comparison',
        },
        interaction: 'select_region',
        canSkip: false,
      },
    ],
  },
  {
    id: 'healthcare-system',
    title: 'Understanding Healthcare',
    titleSv: 'Förstå sjukvårdssystemet',
    description: 'How healthcare capacity, outcomes, and spending connect',
    descriptionSv: 'Hur vårdkapacitet, resultat och utgifter hänger ihop',
    icon: '🏥',
    category: 'systems',
    level: 'foundation',
    estimatedMinutes: 35,
    steps: [
      {
        id: 'health-what',
        order: 1,
        type: 'what_is_this',
        title: 'What is the healthcare system?',
        titleSv: 'Vad är sjukvårdssystemet?',
        content: {
          text: 'The healthcare system includes all services and institutions that promote health.',
          textSv: 'Sjukvårdssystemet inkluderar alla tjänster och institutioner som främjar hälsa.',
        },
        canSkip: false,
      },
      {
        id: 'health-measured',
        order: 2,
        type: 'how_measured',
        title: 'How is health measured?',
        titleSv: 'Hur mäts hälsa?',
        content: {
          text: 'Health outcomes are measured through various indicators like life expectancy and disease rates.',
          textSv: 'Hälsoutfall mäts genom olika indikatorer som förväntad livslängd och sjukdomsfrekvens.',
        },
        canSkip: true,
      },
      {
        id: 'health-historical',
        order: 3,
        type: 'historical_view',
        title: 'Health through the decades',
        titleSv: 'Hälsa genom decennierna',
        content: {
          text: 'See how health outcomes have evolved over time.',
          textSv: 'Se hur hälsoutfall har utvecklats över tid.',
          visualizationType: 'timeline',
        },
        canSkip: false,
      },
      {
        id: 'health-local',
        order: 4,
        type: 'local_connection',
        title: 'Health where you live',
        titleSv: 'Hälsa där du bor',
        content: {
          text: 'Compare your region to the national average.',
          textSv: 'Jämför din region med riksgenomsnittet.',
        },
        canSkip: false,
      },
    ],
  },
  {
    id: 'economy-basics',
    title: 'Understanding the Economy',
    titleSv: 'Förstå ekonomin',
    description: 'How economic indicators relate to everyday life',
    descriptionSv: 'Hur ekonomiska indikatorer relaterar till vardagen',
    icon: '💰',
    category: 'systems',
    level: 'quick',
    estimatedMinutes: 10,
    steps: [
      {
        id: 'econ-what',
        order: 1,
        type: 'what_is_this',
        title: 'What is the economy?',
        titleSv: 'Vad är ekonomin?',
        content: {
          text: 'The economy encompasses all production, distribution, and consumption of goods and services.',
          textSv: 'Ekonomin omfattar all produktion, distribution och konsumtion av varor och tjänster.',
        },
        canSkip: false,
      },
      {
        id: 'econ-historical',
        order: 2,
        type: 'historical_view',
        title: 'Economic cycles',
        titleSv: 'Ekonomiska cykler',
        content: {
          text: 'See how the economy has grown and contracted over time.',
          textSv: 'Se hur ekonomin har växt och krympt över tid.',
          visualizationType: 'timeline',
        },
        canSkip: false,
      },
      {
        id: 'econ-local',
        order: 3,
        type: 'local_connection',
        title: 'Economy where you live',
        titleSv: 'Ekonomi där du bor',
        content: {
          text: 'How does your region compare economically?',
          textSv: 'Hur jämförs din region ekonomiskt?',
        },
        canSkip: false,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const GUIDED_LEARNING_PATHS_SYSTEM = {
  name: 'Guided Learning Paths',
  acronym: 'GLP',
  version: '1.0',
  
  core_principle: GLP_CORE_PRINCIPLE,
  
  blocks: {
    QA: 'Learning Path Engine',
    QB: 'Path Structure (always the same)',
    QC: 'Micro-Insights (cognitive pointers)',
    QD: 'Interactive Learning',
    QE: '"Stop & Reflect"',
    QF: 'Common Misinterpretations',
    QG: 'Paths by Level',
    QH: 'Global → Local Connection',
    QI: 'Shareable Learning (without manipulation)',
  },
  
  pedagogical_features: {
    no_predetermined_conclusions: true,
    progressive_complexity: true,
    reflection_prompts: true,
    interactive_exploration: true,
  },
  
  description: 'Folkbildning i realtid, byggd på data.',
} as const;
