/**
 * LAMBDA FIRST GLOBAL INDEX
 * 
 * "The first measurement. Not the first announcement."
 * 
 * How the first global Lambda value is set without hype, without fanfare.
 * Silent, methodical, reproducible.
 */

// =============================================================================
// CORE PHILOSOPHY
// =============================================================================

export const FIRST_INDEX_PHILOSOPHY = {
  principle: {
    sv: 'Första mätningen. Inte första annonseringen.',
    en: 'The first measurement. Not the first announcement.',
  },
  anti_pattern: {
    sv: 'Ingen countdown. Ingen livestream. Ingen hype.',
    en: 'No countdown. No livestream. No hype.',
  },
};

// =============================================================================
// PRE-LAUNCH REQUIREMENTS
// =============================================================================

export interface PreLaunchRequirement {
  category: string;
  requirement: { sv: string; en: string };
  threshold: string;
  mandatory: boolean;
}

export const PRE_LAUNCH_REQUIREMENTS: PreLaunchRequirement[] = [
  {
    category: 'data_coverage',
    requirement: {
      sv: 'Minimum 70% täckning av kärnindikatorer',
      en: 'Minimum 70% coverage of core indicators',
    },
    threshold: '≥70%',
    mandatory: true,
  },
  {
    category: 'data_coverage',
    requirement: {
      sv: 'Data från minst 50 länder',
      en: 'Data from at least 50 countries',
    },
    threshold: '≥50 countries',
    mandatory: true,
  },
  {
    category: 'methodology',
    requirement: {
      sv: 'Fullständig metoddokumentation publicerad',
      en: 'Complete methodology documentation published',
    },
    threshold: '100%',
    mandatory: true,
  },
  {
    category: 'methodology',
    requirement: {
      sv: 'Extern metodgranskning genomförd',
      en: 'External methodology review completed',
    },
    threshold: '≥2 reviewers',
    mandatory: true,
  },
  {
    category: 'validation',
    requirement: {
      sv: 'Intern backtest på 5 års historik',
      en: 'Internal backtest on 5 years of history',
    },
    threshold: 'passed',
    mandatory: true,
  },
  {
    category: 'validation',
    requirement: {
      sv: 'Oberoende replikering av minst en extern part',
      en: 'Independent replication by at least one external party',
    },
    threshold: '≥1',
    mandatory: true,
  },
  {
    category: 'infrastructure',
    requirement: {
      sv: 'API tillgängligt och dokumenterat',
      en: 'API available and documented',
    },
    threshold: 'operational',
    mandatory: true,
  },
  {
    category: 'infrastructure',
    requirement: {
      sv: 'Kill switch testad och funktionell',
      en: 'Kill switch tested and functional',
    },
    threshold: 'verified',
    mandatory: true,
  },
  {
    category: 'governance',
    requirement: {
      sv: 'Tre-lagers styrning etablerad',
      en: 'Three-layer governance established',
    },
    threshold: 'active',
    mandatory: true,
  },
  {
    category: 'governance',
    requirement: {
      sv: 'Metodråd utsett med minst 3 medlemmar',
      en: 'Method council appointed with at least 3 members',
    },
    threshold: '≥3',
    mandatory: true,
  },
];

// =============================================================================
// FIRST MEASUREMENT PROTOCOL
// =============================================================================

export interface MeasurementStep {
  order: number;
  action: { sv: string; en: string };
  duration: string;
  output: string;
  publiclyVisible: boolean;
}

export const FIRST_MEASUREMENT_STEPS: MeasurementStep[] = [
  {
    order: 1,
    action: {
      sv: 'Samla alla kärnindikatorer för referensperiod',
      en: 'Gather all core indicators for reference period',
    },
    duration: '1 week',
    output: 'raw_data_snapshot',
    publiclyVisible: false,
  },
  {
    order: 2,
    action: {
      sv: 'Kör normalisering och kvalitetskontroller',
      en: 'Run normalization and quality checks',
    },
    duration: '2-3 days',
    output: 'normalized_dataset',
    publiclyVisible: false,
  },
  {
    order: 3,
    action: {
      sv: 'Beräkna Lambda med dokumenterad viktsättning',
      en: 'Calculate Lambda with documented weighting',
    },
    duration: '1 day',
    output: 'lambda_v0.1',
    publiclyVisible: false,
  },
  {
    order: 4,
    action: {
      sv: 'Intern validering mot förväntat intervall',
      en: 'Internal validation against expected range',
    },
    duration: '2 days',
    output: 'validation_report',
    publiclyVisible: false,
  },
  {
    order: 5,
    action: {
      sv: 'Extern granskning av beräkning',
      en: 'External review of calculation',
    },
    duration: '1-2 weeks',
    output: 'external_review',
    publiclyVisible: false,
  },
  {
    order: 6,
    action: {
      sv: 'Publicera metoddokumentation',
      en: 'Publish methodology documentation',
    },
    duration: '1 day',
    output: 'public_methodology',
    publiclyVisible: true,
  },
  {
    order: 7,
    action: {
      sv: 'Aktivera Lambda-endpoint utan annonsering',
      en: 'Activate Lambda endpoint without announcement',
    },
    duration: '1 hour',
    output: 'live_endpoint',
    publiclyVisible: true,
  },
  {
    order: 8,
    action: {
      sv: 'Meddela metodråd och första validatorer',
      en: 'Notify method council and first validators',
    },
    duration: '1 day',
    output: 'stakeholder_notification',
    publiclyVisible: false,
  },
];

// =============================================================================
// EXPECTED FIRST VALUE
// =============================================================================

export const FIRST_VALUE_EXPECTATIONS = {
  expected_range: {
    min: 0.85,
    max: 1.05,
    explanation: {
      sv: 'Första globala Lambda förväntas ligga nära 1.0 (balans) med osäkerhet ±0.05-0.10',
      en: 'First global Lambda expected near 1.0 (balance) with uncertainty ±0.05-0.10',
    },
  },
  if_outside_range: {
    sv: 'Granska metodologi innan publicering. Verifiera indikatorval och viktning.',
    en: 'Review methodology before publishing. Verify indicator selection and weighting.',
  },
  uncertainty_target: {
    value: 0.05,
    note: {
      sv: 'Första versionen kommer ha högre osäkerhet. Detta är förväntad och kommuniceras öppet.',
      en: 'First version will have higher uncertainty. This is expected and communicated openly.',
    },
  },
};

// =============================================================================
// COMMUNICATION AFTER FIRST VALUE
// =============================================================================

export const POST_LAUNCH_COMMUNICATION = {
  allowed: [
    {
      sv: 'Svar på direkta förfrågningar',
      en: 'Responses to direct inquiries',
    },
    {
      sv: 'Teknisk dokumentation',
      en: 'Technical documentation',
    },
    {
      sv: 'Akademiska presentationer på begäran',
      en: 'Academic presentations on request',
    },
  ],
  forbidden: [
    {
      sv: 'Pressmeddelanden om "lansering"',
      en: 'Press releases about "launch"',
    },
    {
      sv: 'Sociala medier-annonsering',
      en: 'Social media announcements',
    },
    {
      sv: 'Tolkning av vad värdet "betyder"',
      en: 'Interpretation of what the value "means"',
    },
    {
      sv: 'Jämförelser med andra index',
      en: 'Comparisons with other indices',
    },
  ],
  template_response: {
    sv: 'Lambda Global v1.0 är nu tillgänglig. Metodik och data är fullständigt dokumenterade på [URL]. Vi välkomnar validering och feedback.',
    en: 'Lambda Global v1.0 is now available. Methodology and data are fully documented at [URL]. We welcome validation and feedback.',
  },
};

// =============================================================================
// FIRST MONTH MONITORING
// =============================================================================

export const FIRST_MONTH_PROTOCOL = {
  daily_checks: [
    'data_freshness',
    'calculation_stability',
    'api_availability',
    'error_logs',
  ],
  weekly_reviews: [
    'user_feedback',
    'methodology_questions',
    'replication_attempts',
    'media_mentions',
  ],
  response_to_criticism: {
    sv: 'Tack för feedback. Visa gärna specifik datapunkt eller metodsteg. Vi uppdaterar dokumentationen om förtydligande behövs.',
    en: 'Thank you for feedback. Please show specific data point or method step. We will update documentation if clarification needed.',
  },
};

// =============================================================================
// VERSION ROADMAP
// =============================================================================

export const VERSION_ROADMAP = [
  {
    version: 'v1.0',
    scope: 'Global only',
    indicators: '~50 core',
    coverage: '50+ countries',
    timeline: 'Launch',
  },
  {
    version: 'v1.1',
    scope: 'Global + Major regions',
    indicators: '~75',
    coverage: '80+ countries',
    timeline: '+3 months',
  },
  {
    version: 'v1.2',
    scope: '+ National (G20)',
    indicators: '~100',
    coverage: '100+ countries',
    timeline: '+6 months',
  },
  {
    version: 'v2.0',
    scope: '+ Subnational (select)',
    indicators: '~150',
    coverage: 'Full OECD + major economies',
    timeline: '+12 months',
  },
];

export const FIRST_INDEX_DOCTRINE = {
  sv: 'Det första talet publiceras utan fanfar. Kvaliteten talar för sig själv.',
  en: 'The first number is published without fanfare. Quality speaks for itself.',
};
