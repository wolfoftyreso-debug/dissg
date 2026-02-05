/**
 * SEMANTIC NAVIGATION
 * 
 * Four-way navigation through infinite depth:
 * 1. UP — why this exists
 * 2. DOWN — more granular data
 * 3. LATERAL — related systems
 * 4. FORWARD — natural next questions
 * 
 * This is cognition as UI.
 */

/**
 * NAVIGATION DIRECTION
 */
export type NavDirection = 'up' | 'down' | 'lateral' | 'forward';

/**
 * NAVIGATION LINK
 */
export interface NavLink {
  readonly direction: NavDirection;
  readonly target_id: string;
  readonly label: string;
  readonly description: string;
  readonly data_available: boolean;
  readonly relevance_score?: number;
}

/**
 * SEMANTIC POSITION
 */
export interface SemanticPosition {
  readonly node_id: string;
  readonly node_type: 'indicator' | 'answer' | 'question' | 'domain' | 'index';
  readonly depth_level: number; // 0 = most abstract
  readonly path: readonly string[]; // Breadcrumb of node_ids
  
  // Context
  readonly domain: string;
  readonly geographic_scope: string;
  readonly time_scope: string;
  
  // Current content summary
  readonly summary: string;
  readonly importance_class: 'structural' | 'acute' | 'emerging' | 'contextual';
}

/**
 * FOUR-WAY NAVIGATION STATE
 */
export interface FourWayNav {
  readonly current: SemanticPosition;
  
  // Navigation options
  readonly up: readonly NavLink[];      // Why this exists
  readonly down: readonly NavLink[];    // More granular
  readonly lateral: readonly NavLink[]; // Related systems
  readonly forward: readonly NavLink[]; // Next questions
  
  // Meta
  readonly dead_ends: readonly string[]; // Directions with no data
}

/**
 * NAVIGATION RULES (LOCKED)
 */
export const NAVIGATION_RULES = {
  up: {
    description: 'Shows why this exists in the larger system',
    always_available: true,
    examples: [
      'This indicator is part of...',
      'This is measured because...',
      'This contributes to understanding of...',
    ],
  },
  down: {
    description: 'Shows more granular breakdown',
    dimensions: ['temporal', 'geographic', 'demographic', 'methodological'],
    examples: [
      'By year / month / week',
      'By region / municipality',
      'By age group / gender',
      'By measurement method',
    ],
  },
  lateral: {
    description: 'Shows related systems and indicators',
    relationship_types: ['correlates', 'influences', 'measured_together', 'same_domain'],
    examples: [
      'Often co-occurs with...',
      'Part of the same system as...',
      'Related policy area...',
    ],
  },
  forward: {
    description: 'Shows natural next questions (not conclusions)',
    always_questions: true,
    examples: [
      'How has this changed over time?',
      'How does this compare to...?',
      'What correlates with this?',
      'What are the data gaps?',
    ],
  },
} as const;

/**
 * GENERATE NAVIGATION STATE
 */
export function generateNavigation(position: SemanticPosition): FourWayNav {
  // Generate contextual navigation based on position
  const up: NavLink[] = [
    {
      direction: 'up',
      target_id: `domain_${position.domain}`,
      label: `${position.domain} overview`,
      description: 'See this in broader domain context',
      data_available: true,
    },
  ];

  const down: NavLink[] = [
    {
      direction: 'down',
      target_id: `${position.node_id}_temporal`,
      label: 'Over time',
      description: 'How has this changed?',
      data_available: true,
    },
    {
      direction: 'down',
      target_id: `${position.node_id}_geographic`,
      label: 'By region',
      description: 'Geographic variation',
      data_available: true,
    },
    {
      direction: 'down',
      target_id: `${position.node_id}_demographic`,
      label: 'By demographic',
      description: 'Population segment differences',
      data_available: true,
    },
  ];

  const lateral: NavLink[] = [
    {
      direction: 'lateral',
      target_id: `${position.node_id}_correlates`,
      label: 'Related indicators',
      description: 'What often moves together',
      data_available: true,
    },
  ];

  const forward: NavLink[] = [
    {
      direction: 'forward',
      target_id: `${position.node_id}_comparison`,
      label: 'Compare to baseline',
      description: 'How does this compare to historical norms?',
      data_available: true,
    },
    {
      direction: 'forward',
      target_id: `${position.node_id}_gaps`,
      label: 'Data gaps',
      description: 'What is unknown or unmeasured?',
      data_available: true,
    },
  ];

  return {
    current: position,
    up,
    down,
    lateral,
    forward,
    dead_ends: [],
  };
}

/**
 * EXAMPLE: YOUTH ANXIETY NAVIGATION
 */
export const YOUTH_ANXIETY_NAV_EXAMPLE: FourWayNav = {
  current: {
    node_id: 'youth_anxiety_se_2024',
    node_type: 'indicator',
    depth_level: 2,
    path: ['healthcare', 'mental_health', 'youth_anxiety'],
    domain: 'healthcare',
    geographic_scope: 'SE',
    time_scope: '2024',
    summary: 'Self-reported anxiety prevalence among youth (15-24) in Sweden',
    importance_class: 'structural',
  },
  up: [
    {
      direction: 'up',
      target_id: 'youth_mental_health_overview',
      label: 'Youth mental health',
      description: 'Anxiety is one component of youth mental health monitoring',
      data_available: true,
    },
    {
      direction: 'up',
      target_id: 'public_health_se',
      label: 'Public health overview',
      description: 'Part of national public health surveillance',
      data_available: true,
    },
  ],
  down: [
    {
      direction: 'down',
      target_id: 'youth_anxiety_trend_se',
      label: 'Over time (2010-2024)',
      description: 'How has prevalence changed?',
      data_available: true,
    },
    {
      direction: 'down',
      target_id: 'youth_anxiety_by_region_se',
      label: 'By region',
      description: 'County-level variation',
      data_available: true,
    },
    {
      direction: 'down',
      target_id: 'youth_anxiety_by_gender',
      label: 'By gender',
      description: 'Reported differences by gender',
      data_available: true,
    },
    {
      direction: 'down',
      target_id: 'youth_anxiety_clinical_vs_survey',
      label: 'Self-reported vs clinical',
      description: 'Difference between survey and diagnosis data',
      data_available: true,
    },
  ],
  lateral: [
    {
      direction: 'lateral',
      target_id: 'youth_depression_se_2024',
      label: 'Depression',
      description: 'Often co-occurs with anxiety',
      data_available: true,
      relevance_score: 0.85,
    },
    {
      direction: 'lateral',
      target_id: 'youth_sleep_se_2024',
      label: 'Sleep patterns',
      description: 'Associated with mental health outcomes',
      data_available: true,
      relevance_score: 0.72,
    },
    {
      direction: 'lateral',
      target_id: 'school_completion_se_2024',
      label: 'School completion',
      description: 'Downstream educational outcome',
      data_available: true,
      relevance_score: 0.65,
    },
  ],
  forward: [
    {
      direction: 'forward',
      target_id: 'youth_anxiety_historical_comparison',
      label: 'Is this unusual?',
      description: 'Compare to pre-2015 baseline',
      data_available: true,
    },
    {
      direction: 'forward',
      target_id: 'youth_anxiety_international',
      label: 'How does Sweden compare?',
      description: 'Nordic and EU comparison',
      data_available: true,
    },
    {
      direction: 'forward',
      target_id: 'youth_anxiety_gaps',
      label: 'What is unmeasured?',
      description: 'Known data limitations',
      data_available: true,
    },
  ],
  dead_ends: [],
};

/**
 * GET NEXT QUESTIONS (FOR AI)
 */
export function getNextQuestions(nav: FourWayNav): string[] {
  return nav.forward
    .filter(link => link.data_available)
    .map(link => link.description);
}
