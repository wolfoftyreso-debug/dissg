/**
 * 🌍 SYSTEMETS HÖGSTA LAGER
 * THE BIG QUESTIONS LAYER (BQL)
 * 
 * "Vad står världen inför – och vad visar datan faktiskt?"
 * 
 * Ett globalt, gemensamt orienteringssystem för mänskligheten
 * i en tid av snabb förändring.
 * 
 * Gratis att förstå.
 * Kraftfullt att använda.
 * Svårt att missbruka.
 */

// ============================================================
// TYPES
// ============================================================

export type QuestionDomain = 
  | 'structural_challenges'
  | 'global_economy'
  | 'ai_and_work'
  | 'regional_impact'
  | 'historical_interventions'
  | 'technological_transition';

export type DrillDownLevel = 'world' | 'country' | 'region' | 'municipality';

export type SemanticCategory = 
  | 'livability'
  | 'stability'
  | 'adaptability'
  | 'future_agency';

export interface BigQuestion {
  readonly id: string;
  readonly domain: QuestionDomain;
  readonly question_sv: string;
  readonly question_en: string;
  readonly always_visible: boolean;
  readonly always_clickable: boolean;
  readonly always_updated: boolean;
  readonly drill_down_enabled: boolean;
}

export interface MissionDefinition {
  readonly id: string;
  readonly user_id: string;
  readonly focus_type: 'municipality' | 'region' | 'country' | 'topic';
  readonly focus_id: string;
  readonly topic?: string;
  readonly created_at: string;
  readonly tracking_enabled: boolean;
}

// ============================================================
// 1. THE BIG QUESTIONS (PERMANENT STRUCTURE)
// ============================================================

export const BIG_QUESTIONS: readonly BigQuestion[] = [
  {
    id: 'structural_challenges',
    domain: 'structural_challenges',
    question_sv: 'Vad är världens största strukturella utmaningar just nu?',
    question_en: 'What are the world\'s biggest structural challenges right now?',
    always_visible: true,
    always_clickable: true,
    always_updated: true,
    drill_down_enabled: true,
  },
  {
    id: 'global_economy_reality',
    domain: 'global_economy',
    question_sv: 'Hur ser den globala ekonomin faktiskt ut – bortom rubriker?',
    question_en: 'What does the global economy actually look like – beyond headlines?',
    always_visible: true,
    always_clickable: true,
    always_updated: true,
    drill_down_enabled: true,
  },
  {
    id: 'ai_scaling_impact',
    domain: 'ai_and_work',
    question_sv: 'Vad händer med arbete, produktivitet och försörjning när AI skalar?',
    question_en: 'What happens to work, productivity, and livelihoods as AI scales?',
    always_visible: true,
    always_clickable: true,
    always_updated: true,
    drill_down_enabled: true,
  },
  {
    id: 'regional_impact',
    domain: 'regional_impact',
    question_sv: 'Vilka grupper, regioner och kommuner påverkas mest – och varför?',
    question_en: 'Which groups, regions, and municipalities are most affected – and why?',
    always_visible: true,
    always_clickable: true,
    always_updated: true,
    drill_down_enabled: true,
  },
  {
    id: 'historical_interventions',
    domain: 'historical_interventions',
    question_sv: 'Vilka åtgärdstyper har historiskt haft störst effekt i liknande lägen?',
    question_en: 'Which types of interventions have historically had the greatest effect in similar situations?',
    always_visible: true,
    always_clickable: true,
    always_updated: true,
    drill_down_enabled: true,
  },
  {
    id: 'technological_transition',
    domain: 'technological_transition',
    question_sv: 'Vad krävs för att teknisk omställning ska leda till ett bättre samhälle, inte ett hårdare?',
    question_en: 'What is required for technological transition to lead to a better society, not a harsher one?',
    always_visible: true,
    always_clickable: true,
    always_updated: true,
    drill_down_enabled: true,
  },
] as const;

// ============================================================
// 2. WHAT THE SYSTEM CAN AND CANNOT SAY
// ============================================================

export const STATEMENT_RULES = {
  allowed: [
    {
      type: 'forecast_compilation',
      description: 'Sammanställning av etablerade prognoser från flera källor',
      example_sv: 'IMF, Världsbanken och OECD anger X–Y%.',
    },
    {
      type: 'forecast_comparison',
      description: 'Jämförelse mellan olika framtidsbedömningar',
      example_sv: 'Bedömningarna varierar mellan X% (källa A) och Y% (källa B).',
    },
    {
      type: 'uncertainty_disclosure',
      description: 'Visa osäkerhet, spridning och antaganden',
      example_sv: 'Detta bygger på antagandet att... Osäkerheten är hög.',
    },
    {
      type: 'historical_parallels',
      description: 'Historiska paralleller',
      example_sv: 'När X hände, såg vi Y.',
    },
    {
      type: 'scenario_intervals',
      description: 'Scenariointervall (optimistiskt / neutralt / pessimistiskt)',
      example_sv: 'I ett optimistiskt scenario: X. I ett pessimistiskt: Y.',
    },
  ] as const,
  
  forbidden: [
    {
      type: 'own_forecasts',
      description: 'Egna framtidsprognoser',
      forbidden_phrases: ['vi tror att', 'vi förutspår', 'kommer att bli'],
    },
    {
      type: 'certainty_claims',
      description: '"Detta kommer att hända"',
      forbidden_phrases: ['kommer att hända', 'är säkert att', 'kommer definitivt'],
    },
    {
      type: 'policy_imperatives',
      description: 'Policyrekommendationer i imperativ form',
      forbidden_phrases: ['bör genomföra', 'måste göra', 'ska implementera'],
    },
  ] as const,
  
  principle: 'Systemet visar vad världen tror och varför, inte vad som "är rätt".',
} as const;

// ============================================================
// 3. ECONOMY – HUMAN-CENTERED
// ============================================================

export const ECONOMY_VIEW_CONFIG = {
  global_dimensions: [
    { id: 'growth', name_sv: 'Tillväxt', name_en: 'Growth' },
    { id: 'productivity', name_sv: 'Produktivitet', name_en: 'Productivity' },
    { id: 'debt', name_sv: 'Skuldsättning', name_en: 'Debt levels' },
    { id: 'distribution_income', name_sv: 'Inkomstfördelning', name_en: 'Income distribution' },
    { id: 'distribution_capital', name_sv: 'Kapitalfördelning', name_en: 'Capital distribution' },
    { id: 'distribution_regional', name_sv: 'Regional fördelning', name_en: 'Regional distribution' },
    { id: 'public_finance', name_sv: 'Offentliga finanser', name_en: 'Public finance' },
    { id: 'energy_dependency', name_sv: 'Energiberoende', name_en: 'Energy dependency' },
    { id: 'resource_flows', name_sv: 'Resursflöden', name_en: 'Resource flows' },
  ] as const,
  
  always_include: [
    {
      id: 'everyday_meaning',
      description_sv: 'Vad detta betyder för vardagsliv',
      description_en: 'What this means for everyday life',
    },
    {
      id: 'affected_levels',
      description_sv: 'Vilka nivåer som påverkas (nation → kommun)',
      description_en: 'Which levels are affected (nation → municipality)',
    },
    {
      id: 'structural_vs_cyclical',
      description_sv: 'Vad som är strukturellt vs cykliskt',
      description_en: 'What is structural vs cyclical',
    },
  ] as const,
  
  principle: 'Ekonomi visas inte som "marknad", utan som levnadsvillkor.',
} as const;

// ============================================================
// 4. AI & WORK – NO PANIC, NO NAIVETY
// ============================================================

export const AI_WORK_VIEW_CONFIG = {
  shows: [
    {
      id: 'historical_automation',
      description_sv: 'Vilka yrkestyper som historiskt påverkats av automatisering',
      description_en: 'Which job types have historically been affected by automation',
    },
    {
      id: 'competencies_replaced',
      description_sv: 'Vilka kompetenser som ersatts',
      description_en: 'Which competencies have been replaced',
    },
    {
      id: 'competencies_amplified',
      description_sv: 'Vilka kompetenser som förstärkts',
      description_en: 'Which competencies have been amplified',
    },
    {
      id: 'competencies_emerged',
      description_sv: 'Vilka kompetenser som uppstått',
      description_en: 'Which competencies have emerged',
    },
    {
      id: 'regional_change_rate',
      description_sv: 'Hur snabbt förändringen sker i olika regioner',
      description_en: 'How fast change is happening in different regions',
    },
    {
      id: 'possibility_vs_implementation',
      description_sv: 'Skillnad mellan teknisk möjlighet och faktisk implementering',
      description_en: 'Difference between technical possibility and actual implementation',
    },
  ] as const,
  
  forbidden_statements: [
    {
      type: 'job_loss_percentages',
      forbidden: 'X % kommer förlora jobbet',
      alternative_sv: 'I regioner med dessa egenskaper har denna typ av arbete minskat/ökat över tid.',
      alternative_en: 'In regions with these characteristics, this type of work has decreased/increased over time.',
    },
  ] as const,
  
  focus: 'anpassning, inte skrämsel',
  principle: 'Utan panik, utan naivitet.',
} as const;

// ============================================================
// 5. DECISIONS THAT MATTER (WITHOUT IMPERATIVES)
// ============================================================

export const INTERVENTION_VIEW_CONFIG = {
  can_show: [
    {
      id: 'effective_categories',
      description_sv: 'Vilka åtgärdskategorier som historiskt haft stor effekt',
      examples: ['utbildningsreformer', 'infrastruktur', 'social trygghet', 'lokal självförsörjning'],
    },
    {
      id: 'preconditions',
      description_sv: 'Under vilka förutsättningar de fungerat',
    },
    {
      id: 'failures',
      description_sv: 'När de inte fungerat',
    },
  ] as const,
  
  formulation_template: {
    sv: 'I sammanhang där {förutsättning_1} och {förutsättning_2} var uppfyllda, sammanföll detta med förbättring i {utfall}.',
    en: 'In contexts where {precondition_1} and {precondition_2} were met, this coincided with improvement in {outcome}.',
  },
  
  principle: 'Användaren drar slutsatsen själv.',
} as const;

// ============================================================
// 6. DRILL-DOWN: WORLD → COUNTRY → REGION → MUNICIPALITY
// ============================================================

export const DRILL_DOWN_CONFIG = {
  levels: ['world', 'country', 'region', 'municipality'] as const,
  
  behavior: {
    same_question_all_levels: true,
    same_semantics_all_levels: true,
    different_data_per_level: true,
  },
  
  example: {
    question: 'Hur påverkar AI sysselsättning globalt?',
    drill_path: ['World', 'Sverige', 'Västra Götaland', 'Borås kommun'],
  },
  
  ui_behavior: {
    clickable_breadcrumb: true,
    show_current_level: true,
    show_available_sublevels: true,
  },
} as const;

// ============================================================
// 7. HUMAN-CENTERED SEMANTICS
// ============================================================

export const SEMANTIC_FRAMEWORK = {
  allowed_terms: [
    {
      category: 'livability',
      terms_sv: ['levnadsförmåga', 'levnadsvillkor', 'vardagsekonomi'],
      terms_en: ['livability', 'living conditions', 'everyday economy'],
    },
    {
      category: 'stability',
      terms_sv: ['stabilitet', 'trygghet', 'förutsägbarhet'],
      terms_en: ['stability', 'security', 'predictability'],
    },
    {
      category: 'adaptability',
      terms_sv: ['anpassningsförmåga', 'omställningskapacitet', 'resiliens'],
      terms_en: ['adaptability', 'transition capacity', 'resilience'],
    },
    {
      category: 'future_agency',
      terms_sv: ['framtida handlingsutrymme', 'möjligheter', 'valmöjligheter'],
      terms_en: ['future agency', 'opportunities', 'options'],
    },
  ] as const,
  
  forbidden_terms: [
    {
      category: 'ideology',
      terms: ['vänster', 'höger', 'socialist', 'kapitalist', 'left', 'right'],
    },
    {
      category: 'party_politics',
      terms: ['parti', 'politisk', 'party', 'political agenda'],
    },
    {
      category: 'moralizing',
      terms: ['borde skämmas', 'oansvarigt', 'should be ashamed', 'irresponsible'],
    },
  ] as const,
  
  principle: 'Människan i centrum, utan att bli sentimental.',
} as const;

// ============================================================
// 8. FREE KNOWLEDGE, PAID TOOLS
// ============================================================

export const ACCESS_MODEL = {
  free_globally: [
    'all_big_questions',
    'all_explanations',
    'all_levels',
    'all_languages',
    'basic_comparisons',
    'historical_data',
  ] as const,
  
  paid: [
    {
      feature: 'missions',
      description_sv: 'Spara missions ("detta vill jag förbättra")',
      tier: 'pro',
    },
    {
      feature: 'custom_dashboards',
      description_sv: 'Skapa egna dashboards',
      tier: 'pro',
    },
    {
      feature: 'deep_analysis',
      description_sv: 'Djupanalys & rapporter',
      tier: 'pro',
    },
    {
      feature: 'api_export',
      description_sv: 'API / export',
      tier: 'org',
    },
    {
      feature: 'decision_support',
      description_sv: 'Beslutsstöd i organisationer',
      tier: 'org',
    },
  ] as const,
  
  principle: 'Kunskap är fri. Verktyg kostar.',
} as const;

// ============================================================
// 9. PERSONAL "MISSIONS" (ENGAGEMENT)
// ============================================================

export const MISSIONS_CONFIG = {
  user_can: [
    'create_profile',
    'define_focus',
    'follow_development',
    'see_direction', // rätt eller fel håll
  ] as const,
  
  focus_types: [
    {
      type: 'municipality',
      description_sv: 'Sin kommun',
      description_en: 'Their municipality',
    },
    {
      type: 'region',
      description_sv: 'Sin region',
      description_en: 'Their region',
    },
    {
      type: 'country',
      description_sv: 'Sitt land',
      description_en: 'Their country',
    },
    {
      type: 'topic',
      description_sv: 'En fråga (t.ex. arbete, utbildning)',
      description_en: 'A topic (e.g., work, education)',
      examples: ['arbete', 'utbildning', 'hälsa', 'klimat'],
    },
  ] as const,
  
  tracking: {
    over_time: true,
    direction_indicator: true, // rätt/fel håll
    notifications: true,
  },
  
  principle: 'Detta skapar ansvar utan skuld.',
} as const;

// ============================================================
// 10. DEFINITION OF DONE
// ============================================================

export const BQL_DEFINITION_OF_DONE = {
  criteria: [
    {
      id: 'big_questions_always_visible',
      description: 'Stora frågor alltid synliga och klickbara',
      verification: 'ui_test',
    },
    {
      id: 'drill_down_works',
      description: 'Drill-down från värld till kommun fungerar',
      verification: 'integration_test',
    },
    {
      id: 'no_forbidden_statements',
      description: 'Inga förbjudna påståenden i systemet',
      verification: 'automated_check',
    },
    {
      id: 'human_centered_language',
      description: 'Människocentrerat språk genomgående',
      verification: 'content_review',
    },
    {
      id: 'free_knowledge_accessible',
      description: 'All kunskap fri, verktyg tydligt betalda',
      verification: 'access_test',
    },
    {
      id: 'missions_functional',
      description: 'Missions skapar engagemang utan skuld',
      verification: 'ux_test',
    },
  ] as const,
  
  identity: {
    not_a: ['nyhetsplattform', 'analysverktyg', 'politiskt system'],
    is_a: 'ett globalt, gemensamt orienteringssystem för mänskligheten i en tid av snabb förändring',
  },
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getBigQuestion(id: string): BigQuestion | undefined {
  return BIG_QUESTIONS.find(q => q.id === id);
}

export function getBigQuestionsByDomain(domain: QuestionDomain): readonly BigQuestion[] {
  return BIG_QUESTIONS.filter(q => q.domain === domain);
}

export function isStatementAllowed(
  statementType: string
): { allowed: boolean; reason?: string } {
  const allowed = STATEMENT_RULES.allowed.find(a => a.type === statementType);
  if (allowed) return { allowed: true };
  
  const forbidden = STATEMENT_RULES.forbidden.find(f => f.type === statementType);
  if (forbidden) return { allowed: false, reason: forbidden.description };
  
  return { allowed: false, reason: 'Unknown statement type' };
}

export function checkForbiddenPhrases(
  text: string,
  language: 'sv' | 'en'
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Check forbidden statement phrases
  for (const rule of STATEMENT_RULES.forbidden) {
    for (const phrase of rule.forbidden_phrases) {
      if (lowerText.includes(phrase.toLowerCase())) {
        violations.push(`Forbidden phrase: "${phrase}" (${rule.description})`);
      }
    }
  }
  
  // Check forbidden semantic terms
  for (const category of SEMANTIC_FRAMEWORK.forbidden_terms) {
    for (const term of category.terms) {
      if (lowerText.includes(term.toLowerCase())) {
        violations.push(`Forbidden term: "${term}" (${category.category})`);
      }
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

export function formatInterventionStatement(
  preconditions: string[],
  outcome: string,
  language: 'sv' | 'en'
): string {
  const template = INTERVENTION_VIEW_CONFIG.formulation_template[language];
  
  if (preconditions.length === 0) {
    return language === 'sv' 
      ? `Detta sammanföll med förbättring i ${outcome}.`
      : `This coincided with improvement in ${outcome}.`;
  }
  
  if (preconditions.length === 1) {
    return language === 'sv'
      ? `I sammanhang där ${preconditions[0]} var uppfyllt, sammanföll detta med förbättring i ${outcome}.`
      : `In contexts where ${preconditions[0]} was met, this coincided with improvement in ${outcome}.`;
  }
  
  const lastPrecondition = preconditions[preconditions.length - 1];
  const otherPreconditions = preconditions.slice(0, -1).join(', ');
  
  return language === 'sv'
    ? `I sammanhang där ${otherPreconditions} och ${lastPrecondition} var uppfyllda, sammanföll detta med förbättring i ${outcome}.`
    : `In contexts where ${otherPreconditions} and ${lastPrecondition} were met, this coincided with improvement in ${outcome}.`;
}

export function getDrillDownPath(
  question: BigQuestion,
  currentLevel: DrillDownLevel,
  locationIds: Record<DrillDownLevel, string>
): { level: DrillDownLevel; id: string; name: string }[] {
  const levels = DRILL_DOWN_CONFIG.levels;
  const currentIndex = levels.indexOf(currentLevel);
  
  return levels.slice(0, currentIndex + 1).map(level => ({
    level,
    id: locationIds[level] || '',
    name: locationIds[level] || level,
  }));
}

// ============================================================
// COMPLETE EXPORT
// ============================================================

export const BIG_QUESTIONS_LAYER_COMPLETE = {
  bigQuestions: BIG_QUESTIONS,
  statementRules: STATEMENT_RULES,
  economyView: ECONOMY_VIEW_CONFIG,
  aiWorkView: AI_WORK_VIEW_CONFIG,
  interventionView: INTERVENTION_VIEW_CONFIG,
  drillDown: DRILL_DOWN_CONFIG,
  semanticFramework: SEMANTIC_FRAMEWORK,
  accessModel: ACCESS_MODEL,
  missions: MISSIONS_CONFIG,
  definitionOfDone: BQL_DEFINITION_OF_DONE,
} as const;

// ============================================================
// BLOCK 56: AUTO-RANKED QUESTION CATEGORIES
// ============================================================

export const QUESTION_CATEGORIES = {
  demography_work: {
    code: 'DEM',
    label: 'Demografi & Arbete',
    labelEn: 'Demography & Work',
    icon: 'Users',
    color: 'text-blue-600',
  },
  economic_capacity: {
    code: 'ECO',
    label: 'Ekonomisk kapacitet',
    labelEn: 'Economic Capacity',
    icon: 'TrendingUp',
    color: 'text-green-600',
  },
  health_longevity: {
    code: 'HEA',
    label: 'Hälsa & Livslängd',
    labelEn: 'Health & Longevity',
    icon: 'Heart',
    color: 'text-red-600',
  },
  energy_resources: {
    code: 'ENE',
    label: 'Energi & Resurser',
    labelEn: 'Energy & Resources',
    icon: 'Zap',
    color: 'text-yellow-600',
  },
  food_supply: {
    code: 'FOO',
    label: 'Mat & Försörjning',
    labelEn: 'Food & Supply',
    icon: 'Wheat',
    color: 'text-orange-600',
  },
  institutional_resilience: {
    code: 'INS',
    label: 'Institutionell resiliens',
    labelEn: 'Institutional Resilience',
    icon: 'Building',
    color: 'text-purple-600',
  },
} as const;

export type QuestionCategory = keyof typeof QUESTION_CATEGORIES;

// ============================================================
// BLOCK 56: RANKING FORMULA
// ============================================================

export const RANKING_WEIGHTS = {
  trend_acceleration: 1.0,
  cross_domain_impact: 1.0,
  population_affected: 1.0,
  data_uncertainty: -1.0,
} as const;

export interface RankingMetrics {
  trend_acceleration: number;
  cross_domain_impact: number;
  population_affected: number;
  data_uncertainty: number;
}

export function calculateImportanceScore(metrics: RankingMetrics): number {
  return (
    metrics.trend_acceleration * RANKING_WEIGHTS.trend_acceleration +
    metrics.cross_domain_impact * RANKING_WEIGHTS.cross_domain_impact +
    metrics.population_affected * RANKING_WEIGHTS.population_affected +
    metrics.data_uncertainty * RANKING_WEIGHTS.data_uncertainty
  );
}

// ============================================================
// BLOCK 56: ANTI-MISUSE RULES
// ============================================================

export const ANTI_MISUSE_RULES = {
  forbiddenPatterns: [
    /crisis/i, /catastrophe/i, /disaster/i, /emergency/i,
    /must act/i, /should do/i, /recommend/i, /predict/i,
    /will happen/i, /forecast/i,
  ],
  requiredElements: [
    'what_this_shows', 'what_this_does_not_show',
    'source_links', 'uncertainty_disclosure',
  ],
  textRequirements: {
    descriptive: true,
    bounded: true,
    linked: true,
    noNormative: true,
  },
};

// ============================================================
// BLOCK 56: VIEW CONFIG
// ============================================================

export const VIEW_CONFIG = {
  global: { maxQuestions: 5, summaryMaxWords: 25, showRankChange: true },
  national: { maxQuestions: 5, summaryMaxWords: 30, showRankChange: true, showGlobalComparison: true },
  detail: { showFullDescription: true, showIndicatorLinks: true, showHistory: true, showWhatNotShown: true },
};

// ============================================================
// BLOCK 56: DATABASE INTERFACES
// ============================================================

export interface BigQuestionDB {
  id: string;
  code: string;
  category: QuestionCategory;
  question_text: string;
  question_text_local?: Record<string, string>;
  short_description: string;
  what_this_shows: string;
  what_this_does_not_show: string[];
  primary_kpi_codes: string[];
  secondary_kpi_codes?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BigQuestionRanking {
  id: string;
  question_id: string;
  country_code: string | null;
  region_code: string | null;
  trend_acceleration: number;
  cross_domain_impact: number;
  population_affected: number;
  data_uncertainty: number;
  importance_score: number;
  rank_position: number | null;
  rank_change: number;
  period_start: string;
  period_end: string;
  calculated_at: string;
}

export interface BigQuestionWithRanking extends BigQuestionDB {
  ranking?: BigQuestionRanking;
}

// ============================================================
// BLOCK 56: DISPLAY HELPERS
// ============================================================

export function getRankChangeIndicator(change: number): {
  icon: string;
  color: string;
  label: string;
} {
  if (change > 0) return { icon: 'ArrowUp', color: 'text-status-critical', label: `+${change} ranking` };
  if (change < 0) return { icon: 'ArrowDown', color: 'text-status-positive', label: `${change} ranking` };
  return { icon: 'Minus', color: 'text-muted-foreground', label: 'Unchanged' };
}

export function formatImportanceScore(score: number): string {
  return score.toFixed(1);
}

// ============================================================
// BLOCK 56: DEFINITION OF DONE
// ============================================================

export const BIG_QUESTIONS_DONE_CRITERIA = {
  everyCountryHasView: true,
  rankingChangesOverTime: true,
  usersStopAskingWhatsImportant: true,
  aiAgentsCiteCorrectly: true,
};
