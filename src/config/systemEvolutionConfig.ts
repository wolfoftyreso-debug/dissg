/**
 * WAVE 12: BLOCK CT — 10-YEAR OPERATIONS & EVOLUTION
 * BLOCK CW — METRICS OF TRUTH (INTERNAL CONTROL)
 * 
 * "Historien skrivs inte om – den kompletteras."
 * Om truth metrics faller → pausa expansion.
 */

// ============================================================
// CT1: TECHNICAL SUSTAINABILITY
// ============================================================

export interface TechnicalSustainabilityRule {
  id: string;
  category: 'compatibility' | 'versioning' | 'migration' | 'archival';
  rule_sv: string;
  rule_en: string;
  enforcement: 'automated' | 'policy' | 'both';
  verification_method: string;
}

export const TECHNICAL_SUSTAINABILITY_RULES: TechnicalSustainabilityRule[] = [
  {
    id: 'ts_01',
    category: 'compatibility',
    rule_sv: 'Bakåtkompatibilitet för alla API-versioner i 5 år',
    rule_en: 'Backward compatibility for all API versions for 5 years',
    enforcement: 'automated',
    verification_method: 'Automated regression tests against all supported versions'
  },
  {
    id: 'ts_02',
    category: 'versioning',
    rule_sv: 'Alla standarder versioneras med SemVer',
    rule_en: 'All standards versioned with SemVer',
    enforcement: 'policy',
    verification_method: 'Release checklist verification'
  },
  {
    id: 'ts_03',
    category: 'migration',
    rule_sv: 'Migrationsverktyg tillhandahålls för alla breaking changes',
    rule_en: 'Migration tools provided for all breaking changes',
    enforcement: 'both',
    verification_method: 'Migration test suite + documentation review'
  },
  {
    id: 'ts_04',
    category: 'archival',
    rule_sv: 'Inget försvinner – all data arkiveras permanent',
    rule_en: 'Nothing disappears – all data archived permanently',
    enforcement: 'automated',
    verification_method: 'Archive integrity checks + retrieval tests'
  }
];

// ============================================================
// CT2: KNOWLEDGE SUSTAINABILITY
// ============================================================

export interface KnowledgeSustainabilityRule {
  id: string;
  type: 'learnings' | 'methods' | 'conclusions';
  rule_sv: string;
  rule_en: string;
  retention_period: 'permanent' | '10_years' | '5_years';
  access_after_deprecation: boolean;
}

export const KNOWLEDGE_SUSTAINABILITY_RULES: KnowledgeSustainabilityRule[] = [
  {
    id: 'ks_01',
    type: 'learnings',
    rule_sv: 'Lärdomar versioneras och bevaras permanent',
    rule_en: 'Learnings are versioned and preserved permanently',
    retention_period: 'permanent',
    access_after_deprecation: true
  },
  {
    id: 'ks_02',
    type: 'methods',
    rule_sv: 'Metoder arkiveras med full dokumentation',
    rule_en: 'Methods archived with full documentation',
    retention_period: 'permanent',
    access_after_deprecation: true
  },
  {
    id: 'ks_03',
    type: 'conclusions',
    rule_sv: 'Gamla slutsatser bevaras med kontext',
    rule_en: 'Old conclusions preserved with context',
    retention_period: 'permanent',
    access_after_deprecation: true
  }
];

export const EVOLUTION_PRINCIPLE = {
  sv: 'Historien skrivs inte om – den kompletteras',
  en: 'History is not rewritten – it is complemented'
} as const;

// ============================================================
// 10-YEAR EVOLUTION PLAN
// ============================================================

export interface EvolutionMilestone {
  year: number;
  phase: string;
  goals: string[];
  success_criteria: string[];
  risks: string[];
}

export const TEN_YEAR_EVOLUTION: EvolutionMilestone[] = [
  {
    year: 1,
    phase: 'Foundation',
    goals: [
      '100 federated nodes',
      'G-DSP v1.0 stable',
      'Core API stable',
      'First external integrations'
    ],
    success_criteria: [
      '>90% uptime',
      '>95% API stability',
      '>80% user satisfaction'
    ],
    risks: ['Technical debt', 'Adoption slower than expected']
  },
  {
    year: 2,
    phase: 'Expansion',
    goals: [
      '250 federated nodes',
      'Multi-language support',
      'Academic partnerships',
      'Media integrations'
    ],
    success_criteria: [
      '>50 countries covered',
      '>1000 active API users',
      'First peer-reviewed publications'
    ],
    risks: ['Quality dilution', 'Coordination complexity']
  },
  {
    year: 3,
    phase: 'Consolidation',
    goals: [
      '500 federated nodes',
      'Governance model stable',
      'Self-sustaining finances',
      'Educational programs'
    ],
    success_criteria: [
      'Revenue > operating costs',
      '>90% node transparency score',
      'Academic curriculum adoption'
    ],
    risks: ['Governance disputes', 'Funding gaps']
  },
  {
    year: 5,
    phase: 'Maturity',
    goals: [
      '1000 federated nodes',
      'Global coverage',
      'Industry standard',
      'Policy influence'
    ],
    success_criteria: [
      'Referenced in policy documents',
      '>100 institutional partners',
      'Recognized as authoritative source'
    ],
    risks: ['Regulatory challenges', 'Competition']
  },
  {
    year: 10,
    phase: 'Legacy',
    goals: [
      '5000+ federated nodes',
      'Full federation governance',
      'Operator-independent',
      'Generational knowledge transfer'
    ],
    success_criteria: [
      'Survives operator transition',
      'Multiple independent implementations',
      'Long-term archival proven'
    ],
    risks: ['Technological obsolescence', 'Mission drift']
  }
];

// ============================================================
// CW1: METRICS OF TRUTH — INTERNAL CONTROL
// ============================================================

export interface TruthMetric {
  id: string;
  name_sv: string;
  name_en: string;
  calculation: string;
  target_threshold: number;
  critical_threshold: number;
  action_if_critical: string;
}

export const TRUTH_METRICS: TruthMetric[] = [
  {
    id: 'tm_method_coverage',
    name_sv: '% datapunkter med full metod',
    name_en: '% data points with full methodology',
    calculation: 'data_with_method / total_data_points * 100',
    target_threshold: 95,
    critical_threshold: 80,
    action_if_critical: 'Pause new data ingestion until methodology documented'
  },
  {
    id: 'tm_reproducibility',
    name_sv: '% analyser reproducerbara',
    name_en: '% analyses reproducible',
    calculation: 'reproducible_analyses / total_analyses * 100',
    target_threshold: 90,
    critical_threshold: 75,
    action_if_critical: 'Flag non-reproducible analyses, require fixes'
  },
  {
    id: 'tm_warning_rate',
    name_sv: '% användarfrågor med varning',
    name_en: '% user queries with warnings',
    calculation: 'queries_with_warnings / total_queries * 100',
    target_threshold: 30,
    critical_threshold: 50,
    action_if_critical: 'Review warning calibration, may indicate data quality issues'
  },
  {
    id: 'tm_node_transparency',
    name_sv: '% federerade noder med hög transparens',
    name_en: '% federated nodes with high transparency',
    calculation: 'high_transparency_nodes / total_nodes * 100',
    target_threshold: 80,
    critical_threshold: 60,
    action_if_critical: 'Pause new node onboarding, focus on existing node quality'
  }
];

export interface TruthMetricSnapshot {
  metric_id: string;
  value: number;
  measured_at: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
}

export function evaluateTruthMetric(
  metric: TruthMetric,
  value: number
): 'healthy' | 'warning' | 'critical' {
  if (value >= metric.target_threshold) return 'healthy';
  if (value >= metric.critical_threshold) return 'warning';
  return 'critical';
}

export function shouldPauseExpansion(metrics: TruthMetricSnapshot[]): boolean {
  const criticalCount = metrics.filter(m => m.status === 'critical').length;
  return criticalCount >= 2; // Pause if 2+ metrics are critical
}

// ============================================================
// SYSTEM HEALTH DASHBOARD CONFIG
// ============================================================

export interface SystemHealthCheck {
  category: string;
  checks: {
    name: string;
    endpoint?: string;
    threshold?: number;
  }[];
}

export const SYSTEM_HEALTH_CHECKS: SystemHealthCheck[] = [
  {
    category: 'Data Quality',
    checks: [
      { name: 'Method documentation coverage', threshold: 95 },
      { name: 'Source attribution rate', threshold: 100 },
      { name: 'Reproducibility score', threshold: 90 }
    ]
  },
  {
    category: 'Federation Health',
    checks: [
      { name: 'Active nodes', threshold: 100 },
      { name: 'Sync success rate', threshold: 99 },
      { name: 'Average node transparency', threshold: 80 }
    ]
  },
  {
    category: 'API Reliability',
    checks: [
      { name: 'Uptime', threshold: 99.9 },
      { name: 'Response time p95', threshold: 500 },
      { name: 'Error rate', threshold: 0.1 }
    ]
  }
];

// ============================================================
// CONTINUOUS REALITY ENGINE
// ============================================================
// Permanent, självkorrigerande prompt- och förbättringsloop
// som varje AI-agent och varje kodare använder, varje dag.
// 
// Flow: Självkontroll → Förbättring → Implementering → Test → Fördjupning
// ============================================================

// CORE PRINCIPLES (ALDRIG FÅR BRYTAS)
export const UNBREAKABLE_PRINCIPLES = {
  rules: [
    { code: 'NO_CONTEXT_FREE_AGGREGATION', text: 'Ingen aggregation utan kontext' },
    { code: 'NO_INCOMPREHENSIBLE_VIZ', text: 'Ingen visualisering utan begriplighet' },
    { code: 'NO_LEVELLESS_NUMBER', text: 'Ingen siffra utan nivå' },
    { code: 'NO_TIMELINELESS_CHANGE', text: 'Ingen förändring utan tidslinje' },
    { code: 'NO_IRREPRODUCIBLE_ANALYSIS', text: 'Ingen analys utan reproducerbarhet' },
  ],
  enforcement: 'mandatory',
  violation_response: 'block_deployment',
} as const;

// STEP 0: GLOBAL STATUS CHECK (OBLIGATORISK)
export const STEP_0_STATUS_CHECK = {
  id: 'step_0',
  name: 'Global Statuscheck',
  required: true,
  blocks_next_steps: true,
  prompt: `STATUSCHECK – Global Reality OS
1. Vilka moduler är implementerade just nu?
2. Vilka är delvis implementerade?
3. Vilka är definierade men saknas?
4. Var finns teknisk skuld?
5. Var finns oklar UX / begriplighet?
6. Var finns för mycket komplexitet för låg nytta?

Lista detta strikt, utan förbättringsförslag.`,
  output: 'current_state.json',
  rule: 'Ingen förbättring får föreslås innan detta är gjort.',
} as const;

// STEP 1: REALITY GAP ANALYSIS
export const STEP_1_REALITY_GAP = {
  id: 'step_1',
  name: 'Verklighetskontroll mot målet',
  prompt: `REALITY GAP ANALYSIS
Jämför nuvarande implementation med slutmålet:
– global, öppen, begriplig verklighetsmodell

Identifiera:
• vad som fortfarande är fragmenterat
• vad som saknar relevanshierarki
• vad som är korrekt men obegripligt
• vad som är begripligt men ytligt

Rangordna gapen efter samhällelig påverkan.`,
  output: 'reality_gap_ranked.md',
} as const;

// STEP 2: AGGREGATION QUALITY AUDIT
export const STEP_2_AGGREGATION_QUALITY = {
  id: 'step_2',
  name: 'Aggregeringskvalitet',
  core_question: true,
  prompt: `AGGREGATION QUALITY AUDIT
För varje aggregering som finns i systemet:
• Vilken fråga besvarar den egentligen?
• Är det rätt fråga?
• Saknas kontext för att förstå utfallet?
• Kan samma data visas på ett mer intuitivt sätt?

Flagga:
• falsk precision
• otydliga procentsatser
• missvisande pilar / färger
• implicit kausalitet`,
  output: 'aggregation_quality_report.md',
  success_criteria: 'En förskolelärare ska förstå utan tolkning.',
} as const;

// STEP 3: RELEVANCE VALIDATION
export const STEP_3_RELEVANCE_VALIDATION = {
  id: 'step_3',
  name: 'Relevanshierarki-validering',
  prompt: `RELEVANCE VALIDATION
Kontrollera att varje datapunkt, vy och dashboard är korrekt klassad i:
L0–L4 (Noise → Civilizational)

Identifiera:
• felplacerade datapunkter
• sådant som visas för högt
• sådant som borde lyftas upp

Föreslå korrigeringar strikt baserat på impact, inte intresse.`,
  output: 'relevance_corrections.json',
  rule: 'Strikt baserat på impact, inte intresse.',
} as const;

// STEP 4: ACCOUNTABILITY CHECK
export const STEP_4_ACCOUNTABILITY = {
  id: 'step_4',
  name: 'Ansvar & Beslutskedja',
  subtitle: 'Ingen dimma',
  prompt: `ACCOUNTABILITY CHECK
För varje större mätvärde:
• Går det att se vem som hade ansvar när?
• Är ansvar kopplat till roll, inte person?
• Syns lagg mellan beslut och utfall?

Lista var ansvar är:
• otydligt
• för brett
• felaktigt kopplat`,
  output: 'accountability_gaps.md',
} as const;

// STEP 5: COGNITIVE LOAD TEST
export type CognitivePersona = 'uninformed_citizen' | 'journalist' | 'decision_maker';

export const STEP_5_COGNITIVE_TEST = {
  id: 'step_5',
  name: 'UX / Kognitiv Test',
  critical: true,
  prompt: `COGNITIVE LOAD TEST
Simulera tre användare:
1. Oinsatt medborgare
2. Journalist
3. Beslutsfattare

För varje:
• Vad förstår de på 10 sek?
• Vad missförstår de?
• Vad kräver för mycket klick?

Identifiera exakt var UI eller språk brister.`,
  output: 'cognitive_friction_map.md',
  personas: ['uninformed_citizen', 'journalist', 'decision_maker'] as CognitivePersona[],
} as const;

// STEP 6: IMPROVEMENT DESIGN
export const STEP_6_IMPROVEMENT_DESIGN = {
  id: 'step_6',
  name: 'Förbättringsdesign',
  prompt: `IMPROVEMENT DESIGN
Utifrån ALLT ovan:
Skapa förbättringar som är:
• mätbara
• implementerbara
• förenklande

För varje förbättring:
• vad ändras
• varför
• hur det gör systemet mer sant / begripligt`,
  output: 'improvement_tasks.yaml',
  requirements: ['measurable', 'implementable', 'simplifying'],
} as const;

// STEP 7: IMPLEMENTATION
export const STEP_7_IMPLEMENTATION = {
  id: 'step_7',
  name: 'Implementering',
  prompt: `IMPLEMENTATION MODE
Implementera förbättringarna exakt enligt planen.
Inga nya features.
Endast förbättring av klarhet, spårbarhet, relevans.`,
  output: 'Kod, migrationer, UI-ändringar',
  rules: {
    no_new_features: true,
    only: ['clarity', 'traceability', 'relevance'],
  },
} as const;

// STEP 8: SYSTEM VERIFICATION
export const STEP_8_VERIFICATION = {
  id: 'step_8',
  name: 'Systemtest',
  types: ['automat', 'mänsklig'],
  prompt: `SYSTEM VERIFICATION
Testa:
• dataspårbarhet
• metodtransparens
• UI-tydlighet
• feltolkningstålighet

Lista alla regressionsrisker.`,
  output: 'verification_report.md',
  test_areas: ['data_traceability', 'method_transparency', 'ui_clarity', 'misinterpretation_tolerance'],
} as const;

// STEP 9: AI REFLECTION
export const STEP_9_REFLECTION = {
  id: 'step_9',
  name: 'AI-Reflektion',
  subtitle: 'Nivåhöjning',
  prompt: `META-REFLECTION
Om detta system var 10× bättre:
• Vad skulle vara annorlunda?
• Vad saknas fortfarande för total förståelse?

Föreslå nästa förbättringscykel.`,
  output: 'next_cycle_hypotheses.md',
} as const;

// STEP 10: LOOP
export const STEP_10_LOOP = {
  id: 'step_10',
  name: 'Loopa',
  instruction: `Gå tillbaka till STEG 0.
Kör igen. Djupare. Tydligare. Sannare.`,
  target: 'step_0',
  continuous: true,
} as const;

// COMPLETE ENGINE DEFINITION
export const CONTINUOUS_REALITY_ENGINE = {
  name: 'Continuous Reality Engine',
  version: '1.0',
  purpose: 'Permanent förbättringsmaskin för mänsklig förståelse',
  flow: 'Självkontroll → Förbättring → Implementering → Test → Fördjupning',
  steps: [
    STEP_0_STATUS_CHECK,
    STEP_1_REALITY_GAP,
    STEP_2_AGGREGATION_QUALITY,
    STEP_3_RELEVANCE_VALIDATION,
    STEP_4_ACCOUNTABILITY,
    STEP_5_COGNITIVE_TEST,
    STEP_6_IMPROVEMENT_DESIGN,
    STEP_7_IMPLEMENTATION,
    STEP_8_VERIFICATION,
    STEP_9_REFLECTION,
    STEP_10_LOOP,
  ],
  principles: UNBREAKABLE_PRINCIPLES,
  outcomes: {
    system_never_stagnates: true,
    every_ai_agent_self_critical: true,
    complexity_pressed_down: true,
    clarity_pressed_up: true,
    world_gets_shared_reality_picture: true,
  },
  declaration: `Det här är inte en produkt.
Det är en permanent förbättringsmaskin för mänsklig förståelse.`,
} as const;

// ROLE-BASED PROMPTS
export const ROLE_SPECIFIC_FOCUS = {
  frontend: {
    primary_steps: [5, 6, 7],
    focus: 'UI-tydlighet, begriplighet, kognitiv last',
    key_question: 'Kan en medborgare förstå detta på 10 sekunder?',
  },
  data: {
    primary_steps: [2, 3, 4],
    focus: 'Aggregeringskvalitet, relevansnivåer, spårbarhet',
    key_question: 'Svarar denna data på rätt fråga med rätt kontext?',
  },
  ai_agent: {
    primary_steps: [0, 1, 9],
    focus: 'Systemtillstånd, verklighetsgap, meta-reflektion',
    key_question: 'Vad saknas för total förståelse?',
  },
  governance: {
    primary_steps: [4, 3, 8],
    focus: 'Ansvar, beslutskedjor, validering',
    key_question: 'Är ansvar synligt och korrekt kopplat?',
  },
} as const;

export type EngineRole = keyof typeof ROLE_SPECIFIC_FOCUS;

export interface CycleState {
  cycle_id: string;
  started_at: string;
  current_step: number;
  outputs: Record<string, unknown>;
  completed_steps: string[];
  blocked_by: string | null;
}

export function createNewCycle(): CycleState {
  return {
    cycle_id: `cycle_${Date.now()}`,
    started_at: new Date().toISOString(),
    current_step: 0,
    outputs: {},
    completed_steps: [],
    blocked_by: null,
  };
}

export function canProceedToStep(state: CycleState, stepIndex: number): boolean {
  if (stepIndex > 0 && !state.completed_steps.includes('step_0')) {
    return false;
  }
  for (let i = 0; i < stepIndex; i++) {
    if (!state.completed_steps.includes(`step_${i}`)) {
      return false;
    }
  }
  return true;
}

export function getPromptForRole(role: EngineRole, stepIndex: number): string {
  const steps = CONTINUOUS_REALITY_ENGINE.steps;
  const step = steps[stepIndex];
  const roleConfig = ROLE_SPECIFIC_FOCUS[role];
  const isMainFocus = (roleConfig.primary_steps as readonly number[]).includes(stepIndex);
  
  if ('prompt' in step && typeof step.prompt === 'string') {
    return isMainFocus 
      ? `[HUVUDFOKUS FÖR ${role.toUpperCase()}]\n\n${step.prompt}\n\nNyckelfråga: ${roleConfig.key_question}`
      : step.prompt;
  }
  return '';
}
