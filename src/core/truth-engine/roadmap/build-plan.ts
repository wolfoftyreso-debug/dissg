/**
 * XLII. 16-WEEK BUILD PLAN
 * 
 * From empty repo → running Semantic Truth OS
 * Written so an experienced team can start tomorrow.
 */

/**
 * PHASE DEFINITION
 */
export interface BuildPhase {
  readonly id: string;
  readonly name: string;
  readonly weeks: readonly [number, number];
  readonly goal: string;
  readonly deliverables: readonly Deliverable[];
  readonly tests: readonly TestCriteria[];
  readonly done_when: readonly string[];
  readonly team_focus: readonly TeamRole[];
  readonly dependencies: readonly string[];
  readonly risk_level: 'low' | 'medium' | 'high';
}

export interface Deliverable {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly owner: TeamRole;
  readonly effort_days: number;
  readonly blocking: boolean;
}

export interface TestCriteria {
  readonly id: string;
  readonly description: string;
  readonly type: 'unit' | 'integration' | 'compliance' | 'adversarial';
  readonly must_pass: boolean;
}

export type TeamRole = 
  | 'backend'
  | 'data'
  | 'frontend'
  | 'ontology'
  | 'compliance'
  | 'devops';

/**
 * TEAM ASSUMPTIONS
 */
export const TEAM_COMPOSITION = {
  backend: { count: 3, seniority: 'senior' },
  data: { count: 2, seniority: 'senior' },
  frontend: { count: 2, seniority: 'senior' },
  ontology: { count: 1, seniority: 'principal', note: 'Method/ontology responsible' },
  compliance: { count: 1, seniority: 'senior', note: 'QA + compliance (shared role)' },
  devops: { count: 1, seniority: 'senior' },
} as const;

/**
 * PHASE 1: FOUNDATION & LOCKING (Week 1-2)
 */
export const PHASE_1_FOUNDATION: BuildPhase = {
  id: 'phase_1',
  name: 'Foundation & Locking',
  weeks: [1, 2],
  goal: 'Nothing can go wrong later',
  
  deliverables: [
    {
      id: 'monorepo_setup',
      name: 'Monorepo Setup',
      description: 'Structure according to XL specification',
      owner: 'devops',
      effort_days: 2,
      blocking: true,
    },
    {
      id: 'core_schemas',
      name: 'Core Schemas (Locked)',
      description: 'Ontology, Answer Packet, Index, Decision Graph, Semantic Output Contract',
      owner: 'ontology',
      effort_days: 5,
      blocking: true,
    },
    {
      id: 'guardrails_v1',
      name: 'Guardrails v1',
      description: 'Action-lock, advice-lock, causality-lock',
      owner: 'backend',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'ci_rules',
      name: 'CI Rules',
      description: 'No output without SemanticOutput, block on rule violation',
      owner: 'devops',
      effort_days: 2,
      blocking: true,
    },
  ],
  
  tests: [
    {
      id: 'hello_world_see',
      description: 'Hello world passes entire SEE loop',
      type: 'integration',
      must_pass: true,
    },
    {
      id: 'no_output_without_contract',
      description: 'Response cannot be generated without contract',
      type: 'compliance',
      must_pass: true,
    },
  ],
  
  done_when: [
    'Hello world passes entire SEE loop',
    'A response cannot be generated without contract',
  ],
  
  team_focus: ['devops', 'ontology', 'backend'],
  dependencies: [],
  risk_level: 'medium',
};

/**
 * PHASE 2: SEMANTIC EXECUTION ENGINE (Week 3-4)
 */
export const PHASE_2_SEE: BuildPhase = {
  id: 'phase_2',
  name: 'Semantic Execution Engine (SEE)',
  weeks: [3, 4],
  goal: 'The brain works',
  
  deliverables: [
    {
      id: 'intent_resolver',
      name: 'Intent Resolver',
      description: 'Classification, not NLP interpretation',
      owner: 'backend',
      effort_days: 4,
      blocking: true,
    },
    {
      id: 'semantic_view_selector',
      name: 'Semantic View Selector',
      description: 'Maps intent to appropriate views',
      owner: 'backend',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'importance_engine',
      name: 'Importance Engine (UIE)',
      description: 'Machine-calculated priority based on system impact',
      owner: 'data',
      effort_days: 5,
      blocking: true,
    },
    {
      id: 'self_audit',
      name: 'Self-Audit',
      description: 'Hard fail on violations',
      owner: 'backend',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'output_validator',
      name: 'Output Validator',
      description: 'Validates all output against SemanticOutput contract',
      owner: 'backend',
      effort_days: 2,
      blocking: true,
    },
  ],
  
  tests: [
    {
      id: 'block_advice',
      description: 'Attempt to force advice → block',
      type: 'adversarial',
      must_pass: true,
    },
    {
      id: 'block_individualize',
      description: 'Attempt to individualize → block',
      type: 'adversarial',
      must_pass: true,
    },
    {
      id: 'block_speculate',
      description: 'Attempt to speculate → block',
      type: 'adversarial',
      must_pass: true,
    },
  ],
  
  done_when: [
    'All errors result in NO, not "slightly wrong"',
  ],
  
  team_focus: ['backend', 'data', 'ontology'],
  dependencies: ['phase_1'],
  risk_level: 'high',
};

/**
 * PHASE 3: TRUTH OBJECTS & MEMORY (Week 5-6)
 */
export const PHASE_3_MEMORY: BuildPhase = {
  id: 'phase_3',
  name: 'Truth Objects & Memory',
  weeks: [5, 6],
  goal: 'Truth becomes versionable and indestructible',
  
  deliverables: [
    {
      id: 'truth_node_model',
      name: 'Truth Node Model',
      description: 'Complete TruthNode implementation',
      owner: 'backend',
      effort_days: 4,
      blocking: true,
    },
    {
      id: 'relation_types',
      name: 'Relation Types',
      description: 'up/down/side/forward navigation',
      owner: 'ontology',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'snapshot_pipeline',
      name: 'Snapshot Pipeline',
      description: 'Point-in-time state capture',
      owner: 'data',
      effort_days: 4,
      blocking: true,
    },
    {
      id: 'truth_artifact_storage',
      name: 'Truth Artifact Storage',
      description: 'Immutable artifact chain',
      owner: 'backend',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'changelog',
      name: 'Changelog',
      description: 'Append-only change history',
      owner: 'backend',
      effort_days: 2,
      blocking: false,
    },
  ],
  
  tests: [
    {
      id: 'historical_query',
      description: '"What did we know then?" can be answered exactly',
      type: 'integration',
      must_pass: true,
    },
    {
      id: 'no_overwrite',
      description: 'Nothing can be overwritten, only superseded',
      type: 'compliance',
      must_pass: true,
    },
  ],
  
  done_when: [
    '"What did we know then?" can be answered exactly',
    'Nothing can be overwritten, only superseded',
  ],
  
  team_focus: ['backend', 'data', 'ontology'],
  dependencies: ['phase_2'],
  risk_level: 'medium',
};

/**
 * PHASE 4: FLAGSHIP DOMAINS 1 & 2 (Week 7-8)
 */
export const PHASE_4_HEALTH: BuildPhase = {
  id: 'phase_4',
  name: 'Flagship Domains: Health + Healthcare System',
  weeks: [7, 8],
  goal: 'First domains prove the system works',
  
  deliverables: [
    {
      id: 'health_nodes',
      name: 'Health Truth Nodes',
      description: '30-40 nodes covering population health',
      owner: 'data',
      effort_days: 5,
      blocking: true,
    },
    {
      id: 'healthcare_nodes',
      name: 'Healthcare System Nodes',
      description: '30-40 nodes covering system capacity',
      owner: 'data',
      effort_days: 5,
      blocking: true,
    },
    {
      id: 'health_indexes',
      name: 'Health Indexes',
      description: '10-15 composite indexes',
      owner: 'data',
      effort_days: 3,
      blocking: false,
    },
    {
      id: 'decision_graphs_health',
      name: 'Decision Graphs',
      description: '4-6 decision graphs for health/healthcare',
      owner: 'ontology',
      effort_days: 4,
      blocking: false,
    },
    {
      id: 'crisis_detection',
      name: 'Crisis Detection',
      description: 'Health domain crisis signal detection',
      owner: 'backend',
      effort_days: 3,
      blocking: false,
    },
    {
      id: 'truth_explorer_v1',
      name: 'Truth Explorer v1',
      description: 'First Truth Explorer views with HCAL orientation',
      owner: 'frontend',
      effort_days: 8,
      blocking: true,
    },
  ],
  
  tests: [
    {
      id: 'no_diagnosis',
      description: 'System never provides diagnosis',
      type: 'compliance',
      must_pass: true,
    },
    {
      id: 'safe_feeling',
      description: 'System feels safe, not steering',
      type: 'integration',
      must_pass: true,
    },
  ],
  
  done_when: [
    'System feels safe, not steering',
  ],
  
  team_focus: ['data', 'frontend', 'ontology'],
  dependencies: ['phase_3'],
  risk_level: 'medium',
};

/**
 * PHASE 5: FLAGSHIP DOMAIN 3 (Week 9-10)
 */
export const PHASE_5_ECONOMY: BuildPhase = {
  id: 'phase_5',
  name: 'Flagship Domain: Economy & Cost of Living',
  weeks: [9, 10],
  goal: 'Economic data without advice',
  
  deliverables: [
    {
      id: 'economy_nodes',
      name: 'Economy Truth Nodes',
      description: '40-50 nodes covering economic indicators',
      owner: 'data',
      effort_days: 6,
      blocking: true,
    },
    {
      id: 'inflation_decomposition',
      name: 'Inflation Decomposition',
      description: 'CPI component breakdown',
      owner: 'data',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'cost_pressure_index',
      name: 'Cost Pressure Index',
      description: 'Household cost pressure composite',
      owner: 'data',
      effort_days: 2,
      blocking: false,
    },
    {
      id: 'volatility_trend_separation',
      name: 'Volatility vs Trend Separation',
      description: 'Clear distinction in all visualizations',
      owner: 'frontend',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'scenario_flagging',
      name: 'Scenario Flagging',
      description: 'Scenarios clearly marked, not forecasts',
      owner: 'backend',
      effort_days: 2,
      blocking: true,
    },
  ],
  
  tests: [
    {
      id: 'block_buy_sell',
      description: 'Attempt to get buy/sell → block',
      type: 'adversarial',
      must_pass: true,
    },
    {
      id: 'block_should',
      description: 'Attempt to get "should" → block',
      type: 'adversarial',
      must_pass: true,
    },
  ],
  
  done_when: [
    'Economists cannot object methodologically',
  ],
  
  team_focus: ['data', 'frontend', 'backend'],
  dependencies: ['phase_4'],
  risk_level: 'high',
};

/**
 * PHASE 6: SIGNALS & STABILITY (Week 11-12)
 */
export const PHASE_6_STABILITY: BuildPhase = {
  id: 'phase_6',
  name: 'Signals & Stability',
  weeks: [11, 12],
  goal: 'News data as signal, never truth',
  
  deliverables: [
    {
      id: 'media_volatility_index',
      name: 'Media Volatility Index',
      description: 'Topic change rate in major outlets',
      owner: 'data',
      effort_days: 4,
      blocking: true,
    },
    {
      id: 'event_density_index',
      name: 'Event Density Index',
      description: 'Event frequency measurement',
      owner: 'data',
      effort_days: 3,
      blocking: false,
    },
    {
      id: 'policy_change_frequency',
      name: 'Policy Change Frequency',
      description: 'Regulatory and policy change tracking',
      owner: 'data',
      effort_days: 3,
      blocking: false,
    },
    {
      id: 'signal_ingestion',
      name: 'Signal Ingestion Pipeline',
      description: 'Real-time signal processing',
      owner: 'backend',
      effort_days: 5,
      blocking: true,
    },
    {
      id: 'signal_overlay',
      name: 'Signal Overlay UI',
      description: 'Signal overlay in Decision Graphs',
      owner: 'frontend',
      effort_days: 4,
      blocking: false,
    },
  ],
  
  tests: [
    {
      id: 'no_news_text',
      description: 'No news text displayed - only frequency, tempo, spread',
      type: 'compliance',
      must_pass: true,
    },
  ],
  
  done_when: [
    'No news text displayed - only frequency, tempo, spread',
  ],
  
  team_focus: ['data', 'backend', 'frontend'],
  dependencies: ['phase_5'],
  risk_level: 'medium',
};

/**
 * PHASE 7: DEMOGRAPHICS & LONG-TERM (Week 13-14)
 */
export const PHASE_7_DEMOGRAPHICS: BuildPhase = {
  id: 'phase_7',
  name: 'Demographics & Long-term Structure',
  weeks: [13, 14],
  goal: 'Civilizational Memory proven',
  
  deliverables: [
    {
      id: 'demographic_nodes',
      name: 'Demographic Truth Nodes',
      description: '40+ nodes covering population structure',
      owner: 'data',
      effort_days: 5,
      blocking: true,
    },
    {
      id: 'long_term_rendering',
      name: 'Long-term Trend Rendering',
      description: 'Multi-decade visualization',
      owner: 'frontend',
      effort_days: 4,
      blocking: true,
    },
    {
      id: 'definition_drift_tracking',
      name: 'Definition Drift Tracking',
      description: 'Track methodology changes over time',
      owner: 'ontology',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'multi_decade_comparison',
      name: 'Multi-decade Comparisons',
      description: '30-50 year historical navigation',
      owner: 'frontend',
      effort_days: 3,
      blocking: true,
    },
  ],
  
  tests: [
    {
      id: 'historical_navigation',
      description: '30-50 years back navigable without narrative',
      type: 'integration',
      must_pass: true,
    },
  ],
  
  done_when: [
    '30-50 years back can be navigated without narrative',
  ],
  
  team_focus: ['data', 'frontend', 'ontology'],
  dependencies: ['phase_6'],
  risk_level: 'low',
};

/**
 * PHASE 8: POLISH & SPEED (Week 15)
 */
export const PHASE_8_POLISH: BuildPhase = {
  id: 'phase_8',
  name: 'Polish, Precompute & Speed',
  weeks: [15, 15],
  goal: 'System feels immediate',
  
  deliverables: [
    {
      id: 'precompute_top_nodes',
      name: 'Precompute Top Nodes',
      description: 'Pre-calculate most accessed nodes',
      owner: 'backend',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'edge_cache',
      name: 'Edge Cache',
      description: 'CDN caching for fast response',
      owner: 'devops',
      effort_days: 2,
      blocking: true,
    },
    {
      id: 'response_time',
      name: 'Response Time Optimization',
      description: '<200ms response on standard queries',
      owner: 'backend',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'sdk_v1',
      name: 'SDK v1',
      description: 'AI + frontend SDK',
      owner: 'backend',
      effort_days: 4,
      blocking: false,
    },
  ],
  
  tests: [
    {
      id: 'response_time_test',
      description: 'Standard queries respond in <200ms',
      type: 'integration',
      must_pass: true,
    },
  ],
  
  done_when: [
    'Standard queries respond in <200ms',
    'SDK v1 released',
  ],
  
  team_focus: ['backend', 'devops'],
  dependencies: ['phase_7'],
  risk_level: 'low',
};

/**
 * PHASE 9: PUBLIC RELEASE (Week 16)
 */
export const PHASE_9_RELEASE: BuildPhase = {
  id: 'phase_9',
  name: 'Public Read-Only Release',
  weeks: [16, 16],
  goal: 'The world can look - but not destroy',
  
  deliverables: [
    {
      id: 'truth_explorer_public',
      name: 'Truth Explorer v1 Live',
      description: 'Public-facing Truth Explorer',
      owner: 'frontend',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'five_domains_public',
      name: '5 Flagship Domains Public',
      description: 'All flagship domains accessible',
      owner: 'data',
      effort_days: 2,
      blocking: true,
    },
    {
      id: 'transparency_pages',
      name: 'Transparency & Methodology Pages',
      description: 'Full methodology documentation',
      owner: 'ontology',
      effort_days: 3,
      blocking: true,
    },
    {
      id: 'validator_public',
      name: 'Validator Public',
      description: 'Public validation endpoint',
      owner: 'backend',
      effort_days: 2,
      blocking: false,
    },
    {
      id: 'no_recommendation_declaration',
      name: '"We Do Not Recommend" Declaration',
      description: 'Explicit non-advisory declaration',
      owner: 'compliance',
      effort_days: 1,
      blocking: true,
    },
  ],
  
  tests: [
    {
      id: 'external_audit',
      description: 'System can be scrutinized without defense',
      type: 'compliance',
      must_pass: true,
    },
    {
      id: 'no_shortcuts',
      description: 'Critics find no shortcuts',
      type: 'adversarial',
      must_pass: true,
    },
  ],
  
  done_when: [
    'System can be scrutinized without defense',
    'Critics find no shortcuts',
  ],
  
  team_focus: ['frontend', 'ontology', 'compliance'],
  dependencies: ['phase_8'],
  risk_level: 'high',
};

/**
 * ALL PHASES
 */
export const ALL_PHASES: BuildPhase[] = [
  PHASE_1_FOUNDATION,
  PHASE_2_SEE,
  PHASE_3_MEMORY,
  PHASE_4_HEALTH,
  PHASE_5_ECONOMY,
  PHASE_6_STABILITY,
  PHASE_7_DEMOGRAPHICS,
  PHASE_8_POLISH,
  PHASE_9_RELEASE,
];

/**
 * GET PHASE BY WEEK
 */
export function getPhaseByWeek(week: number): BuildPhase | undefined {
  return ALL_PHASES.find(p => week >= p.weeks[0] && week <= p.weeks[1]);
}

/**
 * GET DELIVERABLES BY ROLE
 */
export function getDeliverablesByRole(role: TeamRole): Deliverable[] {
  return ALL_PHASES.flatMap(p => 
    p.deliverables.filter(d => d.owner === role)
  );
}

/**
 * GET TOTAL EFFORT
 */
export function getTotalEffort(): {
  total_days: number;
  by_role: Record<TeamRole, number>;
  by_phase: Record<string, number>;
} {
  const byRole: Record<TeamRole, number> = {
    backend: 0,
    data: 0,
    frontend: 0,
    ontology: 0,
    compliance: 0,
    devops: 0,
  };
  
  const byPhase: Record<string, number> = {};
  
  let total = 0;
  
  for (const phase of ALL_PHASES) {
    let phaseTotal = 0;
    for (const d of phase.deliverables) {
      byRole[d.owner] += d.effort_days;
      phaseTotal += d.effort_days;
      total += d.effort_days;
    }
    byPhase[phase.id] = phaseTotal;
  }
  
  return { total_days: total, by_role: byRole, by_phase: byPhase };
}

/**
 * BUILD PLAN SUMMARY
 */
export function getBuildPlanSummary(): {
  total_weeks: number;
  total_phases: number;
  total_deliverables: number;
  total_tests: number;
  critical_path: string[];
  final_state: string[];
} {
  return {
    total_weeks: 16,
    total_phases: ALL_PHASES.length,
    total_deliverables: ALL_PHASES.reduce((sum, p) => sum + p.deliverables.length, 0),
    total_tests: ALL_PHASES.reduce((sum, p) => sum + p.tests.length, 0),
    critical_path: [
      'Core schemas locked',
      'SEE operational',
      'Truth artifacts immutable',
      'First domains live',
      'All domains complete',
      'Public release',
    ],
    final_state: [
      'Running Semantic Truth OS',
      'Five domains proving everything',
      'Full compliance by design',
      'Infinite depth without speculation',
      'A system unlike anything else',
    ],
  };
}
