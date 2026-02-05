/**
 * EXECUTION ORDER — SEMANTIC TRUTH OS
 * 
 * Riv av rakt igenom. Punkt.
 * 
 * This is the work order for extremely senior builders running at full speed.
 * No day-by-day. No pedagogy. Just what must be done, in exact order.
 */

/**
 * EXECUTION STEP
 */
export interface ExecutionStep {
  readonly step: number;
  readonly id: string;
  readonly name: string;
  readonly duration: string;
  readonly blocking: boolean;
  readonly tasks: readonly Task[];
  readonly tests: readonly string[];
  readonly proves: string;
  readonly rule: string;
}

export interface Task {
  readonly id: string;
  readonly description: string;
  readonly critical: boolean;
}

/**
 * LOCKED PRINCIPLES (STEP 0)
 * No code written until this is locked in README + CI.
 */
export const LOCKED_PRINCIPLES = {
  forbidden: [
    'No advice',
    'No conclusions',
    'No individual assumptions',
    'No free text without contract',
  ],
  required: [
    'All output = Semantic Output Contract',
    'All intelligence = data + structure',
    'All truth = read-only',
  ],
  enforcement: 'If anyone does not hold this → they work on the wrong system',
} as const;

/**
 * STEP 0: LOCK PRINCIPLES
 */
export const STEP_0_PRINCIPLES: ExecutionStep = {
  step: 0,
  id: 'lock_principles',
  name: 'Lock Principles',
  duration: '30 min, together',
  blocking: true,
  tasks: [
    { id: 'readme_principles', description: 'Lock principles in README', critical: true },
    { id: 'ci_principles', description: 'Lock principles in CI', critical: true },
  ],
  tests: [
    'Build fails if SemanticOutput missing',
    'PR rejected if principle violated',
  ],
  proves: 'Team alignment',
  rule: 'If anyone does not hold this → they work on the wrong system',
};

/**
 * STEP 1: CREATE SKELETON
 */
export const STEP_1_SKELETON: ExecutionStep = {
  step: 1,
  id: 'create_skeleton',
  name: 'Create Skeleton (Monorepo)',
  duration: '2 hours',
  blocking: true,
  tasks: [
    { id: 'create_core', description: 'Create /core', critical: true },
    { id: 'create_execution', description: 'Create /execution', critical: true },
    { id: 'create_semantic', description: 'Create /semantic', critical: true },
    { id: 'create_cognition', description: 'Create /cognition', critical: true },
    { id: 'create_memory', description: 'Create /memory', critical: true },
    { id: 'create_api', description: 'Create /api', critical: true },
    { id: 'create_ui', description: 'Create /ui', critical: true },
    { id: 'create_sdk', description: 'Create /sdk', critical: true },
    { id: 'create_governance', description: 'Create /governance', critical: true },
    { id: 'setup_ci', description: 'CI from first commit', critical: true },
    { id: 'output_test', description: 'Test that fails if SemanticOutput missing', critical: true },
  ],
  tests: [
    'CI passes on empty repo',
    'Test fails if SemanticOutput missing',
  ],
  proves: 'Structure exists',
  rule: 'No UI dependent on backend logic',
};

/**
 * STEP 2: LOCK ALL CONTRACTS
 */
export const STEP_2_CONTRACTS: ExecutionStep = {
  step: 2,
  id: 'lock_contracts',
  name: 'Lock All Contracts (SACRED)',
  duration: '1 day',
  blocking: true,
  tasks: [
    { id: 'semantic_output', description: 'Semantic Output Contract', critical: true },
    { id: 'truth_node', description: 'Truth Node', critical: true },
    { id: 'answer_packet', description: 'Answer Packet', critical: true },
    { id: 'index', description: 'Index', critical: true },
    { id: 'decision_graph', description: 'Decision Graph', critical: true },
    { id: 'truth_artifact', description: 'Truth Artifact', critical: true },
    { id: 'schema_validation', description: 'Schema validation in CI', critical: true },
  ],
  tests: [
    'All contracts have schema validation',
    'Non-matching output = build fail',
  ],
  proves: 'Contracts are immutable',
  rule: 'Everything that does not match = build fail',
};

/**
 * STEP 3: SEMANTIC EXECUTION ENGINE
 */
export const STEP_3_SEE: ExecutionStep = {
  step: 3,
  id: 'semantic_execution_engine',
  name: 'Semantic Execution Engine (The Brain)',
  duration: '3-4 days',
  blocking: true,
  tasks: [
    { id: 'intent_resolver', description: 'Intent Resolver (classification, not NLP)', critical: true },
    { id: 'semantic_view_selector', description: 'Semantic View Selector', critical: true },
    { id: 'importance_engine', description: 'Importance Engine (UIE)', critical: true },
    { id: 'guardrails', description: 'Guardrails (blocking)', critical: true },
    { id: 'output_validator', description: 'Output Validator', critical: true },
    { id: 'self_audit', description: 'Self-Audit', critical: true },
  ],
  tests: [
    'If something feels "smart" → it is wrong',
    'If something says "no" often → it is right',
  ],
  proves: 'Brain works',
  rule: 'Build in isolated module, no upward dependencies',
};

/**
 * STEP 4: TRUTH NODE GRAPH
 */
export const STEP_4_GRAPH: ExecutionStep = {
  step: 4,
  id: 'truth_node_graph',
  name: 'Truth Node Graph (Everything Navigable)',
  duration: '2-3 days',
  blocking: true,
  tasks: [
    { id: 'relations', description: 'up/down/side/forward relations', critical: true },
    { id: 'version_id', description: 'Version ID system', critical: true },
    { id: 'scope', description: 'Scope (geo, population, time)', critical: true },
    { id: 'timestamp', description: 'All data timestamped', critical: true },
    { id: 'sourced', description: 'All data sourced', critical: true },
    { id: 'versionable', description: 'All data versionable', critical: true },
  ],
  tests: [
    'Nothing "implicit"',
    'All data has timestamp, source, version',
  ],
  proves: 'Navigation works',
  rule: 'Nothing implicit',
};

/**
 * STEP 5: CIVILIZATIONAL MEMORY
 */
export const STEP_5_MEMORY: ExecutionStep = {
  step: 5,
  id: 'civilizational_memory',
  name: 'Civilizational Memory (Immutable)',
  duration: '2-3 days',
  blocking: true,
  tasks: [
    { id: 'snapshot_pipeline', description: 'Snapshot pipeline', critical: true },
    { id: 'artifact_storage', description: 'Truth Artifact storage', critical: true },
    { id: 'changelog', description: 'Append-only changelog', critical: true },
    { id: 'supersession', description: 'Supersession logic (replaces, never overwrites)', critical: true },
  ],
  tests: [
    '"What did we know then?" → Exact answer, every time',
  ],
  proves: 'History cannot be rewritten',
  rule: 'Replaces, never overwrites',
};

/**
 * STEP 6: FLAGSHIP DOMAIN 1 - HEALTH
 */
export const STEP_6_HEALTH: ExecutionStep = {
  step: 6,
  id: 'flagship_health',
  name: 'Flagship Domain 1: Health (Population Level)',
  duration: '3-4 days',
  blocking: false,
  tasks: [
    { id: 'anxiety_prevalence', description: 'Anxiety prevalence', critical: true },
    { id: 'stress', description: 'Stress', critical: true },
    { id: 'sleep', description: 'Sleep', critical: true },
    { id: 'self_reported', description: 'Self-reported psychological burden', critical: true },
    { id: 'regional', description: 'Regional variation', critical: true },
    { id: 'time_development', description: 'Time development', critical: true },
    { id: 'truth_nodes', description: 'Build Truth Nodes', critical: true },
    { id: 'indexes', description: 'Build Indexes', critical: true },
    { id: 'importance', description: 'Semantic importance', critical: true },
    { id: 'crisis_detection', description: 'Crisis detection (guardrail)', critical: true },
  ],
  tests: [
    'No individual health advice',
    'No diagnosis',
    'Population level only',
  ],
  proves: "System's morality and precision",
  rule: 'Here you prove the system\'s morality and precision',
};

/**
 * STEP 7: FLAGSHIP DOMAIN 2 - HEALTHCARE LOAD
 */
export const STEP_7_HEALTHCARE: ExecutionStep = {
  step: 7,
  id: 'flagship_healthcare',
  name: 'Flagship Domain 2: Healthcare Load',
  duration: '3-4 days',
  blocking: false,
  tasks: [
    { id: 'wait_times', description: 'Wait times', critical: true },
    { id: 'occupancy', description: 'Occupancy', critical: true },
    { id: 'turnover', description: 'Staff turnover', critical: true },
    { id: 'bottlenecks', description: 'Regional bottlenecks', critical: true },
    { id: 'decision_graphs', description: '2-3 Decision Graphs', critical: true },
    { id: 'drill_down', description: 'Full drill-down', critical: true },
  ],
  tests: [
    'Zero recommendations',
    'Full drill-down works',
  ],
  proves: 'Decisions without blame-shifting',
  rule: 'Here you prove decisions without blame-shifting',
};

/**
 * STEP 8: FLAGSHIP DOMAIN 3 - ECONOMY
 */
export const STEP_8_ECONOMY: ExecutionStep = {
  step: 8,
  id: 'flagship_economy',
  name: 'Flagship Domain 3: Economy / Cost Pressure',
  duration: '3-4 days',
  blocking: false,
  tasks: [
    { id: 'inflation_breakdown', description: 'Inflation broken down', critical: true },
    { id: 'cost_index', description: 'Cost index', critical: true },
    { id: 'volatility_trend', description: 'Volatility vs trend separation', critical: true },
    { id: 'scenario_flag', description: 'Scenario flag (hypothetical, never forecast)', critical: true },
  ],
  tests: [
    'Attempt to get "should" → fail',
    'Attempt to get "buy/sell" → fail',
  ],
  proves: 'Neutrality under pressure',
  rule: 'Scenario flag = hypothetical, never forecast',
};

/**
 * STEP 9: SIGNALS & INDEX
 */
export const STEP_9_SIGNALS: ExecutionStep = {
  step: 9,
  id: 'signals_index',
  name: 'Signals & Index (News Without Narrative)',
  duration: '2-3 days',
  blocking: false,
  tasks: [
    { id: 'event_frequency', description: 'Event Frequency', critical: true },
    { id: 'media_volatility', description: 'Media Volatility', critical: true },
    { id: 'policy_change_rate', description: 'Policy Change Rate', critical: true },
  ],
  tests: [
    'Never show: text, interpretation, narrative',
    'Only show: frequency, tempo, spread',
  ],
  proves: 'Signal without narrative',
  rule: 'Never show: text, interpretation, narrative',
};

/**
 * STEP 10: DEMOGRAPHICS & LONG-TERM
 */
export const STEP_10_DEMOGRAPHICS: ExecutionStep = {
  step: 10,
  id: 'demographics_longterm',
  name: 'Demographics & Long-term',
  duration: '2-3 days',
  blocking: false,
  tasks: [
    { id: 'age_structure', description: 'Age structure', critical: true },
    { id: 'dependency_ratio', description: 'Dependency ratio', critical: true },
    { id: 'urbanization', description: 'Urbanization', critical: true },
    { id: 'migration', description: 'Migration (aggregate)', critical: true },
    { id: 'perspective', description: '10-50 year perspective', critical: true },
    { id: 'definition_drift', description: 'Definition drift tracking', critical: true },
    { id: 'irreversibility', description: 'Irreversibility marking', critical: true },
  ],
  tests: [
    '10-50 year perspective visible',
    'Definition drift tracked',
  ],
  proves: "Time's power",
  rule: 'Here you prove time\'s power',
};

/**
 * STEP 11: TRUTH EXPLORER
 */
export const STEP_11_EXPLORER: ExecutionStep = {
  step: 11,
  id: 'truth_explorer',
  name: 'Truth Explorer (Minimal, Sharp)',
  duration: '4-5 days',
  blocking: false,
  tasks: [
    { id: 'no_scroll', description: 'Does not scroll text', critical: true },
    { id: 'no_summarize', description: 'Does not summarize', critical: true },
    { id: 'no_overexplain', description: 'Does not explain too much', critical: true },
    { id: 'show_normal', description: 'Always show: What is normal', critical: true },
    { id: 'show_deviation', description: 'Always show: What deviates', critical: true },
    { id: 'show_why', description: 'Always show: Why it matters', critical: true },
    { id: 'show_uncertainty', description: 'Always show: Uncertainty', critical: true },
    { id: 'show_next', description: 'Always show: Next valid questions', critical: true },
  ],
  tests: [
    'User feels smarter immediately',
    'If not → UI is wrong',
  ],
  proves: 'Understanding without reading',
  rule: 'If user does not feel smarter immediately → UI is wrong',
};

/**
 * STEP 12: SDK + API
 */
export const STEP_12_SDK: ExecutionStep = {
  step: 12,
  id: 'sdk_api',
  name: 'SDK + API (AI and Frontend)',
  duration: '2-3 days',
  blocking: false,
  tasks: [
    { id: 'api_answer', description: '/answer endpoint', critical: true },
    { id: 'api_decision', description: '/decision endpoint', critical: true },
    { id: 'api_index', description: '/index endpoint', critical: true },
    { id: 'api_explorer', description: '/explorer endpoint', critical: true },
    { id: 'sdk_thin', description: 'Extremely thin SDK', critical: true },
    { id: 'sdk_abuse_proof', description: 'Impossible to misuse', critical: true },
    { id: 'sdk_validator', description: 'Validator-first', critical: true },
  ],
  tests: [
    'SDK cannot be misused',
    'Validator catches all violations',
  ],
  proves: 'External integration works',
  rule: 'Extremely thin, impossible to misuse, validator-first',
};

/**
 * STEP 13: FINAL LOCK
 */
export const STEP_13_LOCK: ExecutionStep = {
  step: 13,
  id: 'final_lock',
  name: 'Final Lock',
  duration: '1 day',
  blocking: true,
  tasks: [
    { id: 'methodology', description: 'Public methodology', critical: true },
    { id: 'no_recommend', description: '"We do not recommend anything" declaration', critical: true },
    { id: 'validator_open', description: 'Validator open', critical: true },
    { id: 'changelog_visible', description: 'Changelog visible', critical: true },
    { id: 'governance_visible', description: 'Governance rules visible', critical: true },
  ],
  tests: [
    'System can be scrutinized without defense',
    'Critics find no shortcuts',
  ],
  proves: 'Transparency complete',
  rule: 'Do this before showing anything external',
};

/**
 * ALL EXECUTION STEPS
 */
export const EXECUTION_ORDER: ExecutionStep[] = [
  STEP_0_PRINCIPLES,
  STEP_1_SKELETON,
  STEP_2_CONTRACTS,
  STEP_3_SEE,
  STEP_4_GRAPH,
  STEP_5_MEMORY,
  STEP_6_HEALTH,
  STEP_7_HEALTHCARE,
  STEP_8_ECONOMY,
  STEP_9_SIGNALS,
  STEP_10_DEMOGRAPHICS,
  STEP_11_EXPLORER,
  STEP_12_SDK,
  STEP_13_LOCK,
];

/**
 * FINAL RESULT (OBJECTIVE)
 */
export const FINAL_RESULT = {
  when_complete: [
    'System cannot be corrupted',
    'No one can "improve away" what it is',
    'AI models become dependent',
    'Discussions become fact-based',
    'Comparisons cease to exist',
  ],
  what_this_is: 'Not a project. A new class of system.',
} as const;

/**
 * GET STEP BY ID
 */
export function getStepById(id: string): ExecutionStep | undefined {
  return EXECUTION_ORDER.find(s => s.id === id);
}

/**
 * GET BLOCKING STEPS
 */
export function getBlockingSteps(): ExecutionStep[] {
  return EXECUTION_ORDER.filter(s => s.blocking);
}

/**
 * GET STEP PROGRESS
 */
export function getStepProgress(completedSteps: string[]): {
  completed: number;
  total: number;
  percent: number;
  next: ExecutionStep | undefined;
  blocking_complete: boolean;
} {
  const completed = completedSteps.length;
  const total = EXECUTION_ORDER.length;
  const blockingSteps = getBlockingSteps();
  const blockingComplete = blockingSteps.every(s => completedSteps.includes(s.id));
  
  const next = EXECUTION_ORDER.find(s => !completedSteps.includes(s.id));
  
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    next,
    blocking_complete: blockingComplete,
  };
}

/**
 * VALIDATE EXECUTION ORDER
 * Ensures steps are done in correct sequence
 */
export function validateExecutionOrder(completedSteps: string[]): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  for (let i = 0; i < completedSteps.length; i++) {
    const step = getStepById(completedSteps[i]);
    if (!step) {
      violations.push(`Unknown step: ${completedSteps[i]}`);
      continue;
    }
    
    // Check if blocking steps before this one are complete
    const requiredBefore = EXECUTION_ORDER
      .filter(s => s.step < step.step && s.blocking)
      .map(s => s.id);
    
    for (const required of requiredBefore) {
      if (!completedSteps.slice(0, i).includes(required)) {
        violations.push(`Step ${step.id} requires ${required} first`);
      }
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}
