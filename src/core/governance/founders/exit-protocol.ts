/**
 * FOUNDERS EXIT PROTOCOL
 * 
 * How to leave without breaking the system.
 * The founder's most important act is to disappear correctly.
 */

// ============================================================================
// CORE PRINCIPLE
// ============================================================================

export const EXIT_PRINCIPLE = {
  statement: "The founder's most important act is to disappear correctly.",
  test: 'If the system needs you to function, you built it wrong.',
} as const;

// ============================================================================
// EXIT TRIGGERS
// ============================================================================

export const EXIT_TRIGGERS = {
  should_initiate_when: {
    minimum_conditions: 2,
    conditions: [
      'System is used without founder presence',
      'Ontology changes occur via process, not person',
      'Reference cases are used externally without explanation',
      '"Cannot answer yet" is accepted as an endpoint',
      'AI agents follow prompt-spec without adaptation',
    ],
  },
  
  must_not_be_triggered_by: [
    'exhaustion',
    'conflict',
    'external pressure',
    'economic incentive',
  ],
} as const;

// ============================================================================
// EXIT PHASES
// ============================================================================

export interface ExitPhase {
  readonly id: 'I' | 'II' | 'III';
  readonly name: string;
  readonly duration?: string;
  readonly actions: readonly string[];
  readonly goal?: string;
  readonly restrictions?: readonly string[];
}

export const EXIT_PHASES: readonly ExitPhase[] = [
  {
    id: 'I',
    name: 'DETACHMENT',
    duration: '6–12 months',
    actions: [
      'Stop participating in daily decisions',
      'Stop being the "explaining voice"',
      'Respond only to structural questions',
      'Document all implicit decisions',
    ],
    goal: 'The system should function worse socially – but equally well structurally.',
  },
  {
    id: 'II',
    name: 'TRANSFER OF AUTHORITY',
    actions: [
      'Formal handover of Ontology Stewardship',
      'Formal handover of Charter Guardianship',
      'Formal handover of Trust Anchor Keys (multi-sig)',
    ],
    restrictions: [
      'No veto retained',
      'No special role retained',
      'No informal shortcut retained',
      'All permissions removed publicly',
    ],
  },
  {
    id: 'III',
    name: 'SILENCE',
    actions: [
      'Does not comment on decisions',
      'Does not interpret reference cases',
      'Does not defend the system',
      'Does not participate in debate',
    ],
    goal: 'The only permitted statement: "The system speaks for itself."',
  },
] as const;

// ============================================================================
// PUBLIC EXIT DECLARATION
// ============================================================================

export const EXIT_DECLARATION = {
  instruction: 'Published exactly once.',
  
  statement: `This system no longer depends on its founders.
Its standards, ontology, and history are sufficient.
From this point forward, all legitimacy derives from structure, not authorship.`,
  
  prohibited: [
    'No interviews',
    'No retrospectives',
  ],
} as const;

// ============================================================================
// ECONOMIC SEPARATION
// ============================================================================

export const ECONOMIC_SEPARATION = {
  label: 'CRITICAL',
  
  founder_receives_no_compensation_tied_to: [
    'adoption',
    'usage',
    'influence',
  ],
  
  prohibited: [
    'Advisory fees',
    'Options with governance rights',
  ],
  
  principle: 'Economy must not be interpretable as influence.',
} as const;

// ============================================================================
// POST-EXIT RULES
// ============================================================================

export const POST_EXIT_RULES = {
  if_system_changes: {
    founder_has: [
      'no opinion',
      'no right',
      'no channel',
    ],
    
    if_change_is_wrong: 'History will show it.',
    sufficiency: 'That is enough.',
  },
} as const;

// ============================================================================
// FAILURE MODE
// ============================================================================

export const EXIT_FAILURE_MODE = {
  indicators: [
    'People continue asking the founder',
    'Decisions are legitimized by name',
    'Ontology is interpreted through person',
  ],
  
  diagnosis: [
    'Exit was too early',
    'Structure was not ready',
    'Responsibility was not transferred',
  ],
  
  remedy: 'Withdraw even further.',
} as const;

// ============================================================================
// FINAL TRUTH
// ============================================================================

export const EXIT_FINAL_TRUTH = {
  statement: `Building the system requires intelligence.
Leaving it requires discipline.`,
  
  warning: 'Most people fail here.',
} as const;

// ============================================================================
// COMPLETE PROTOCOL
// ============================================================================

export const FOUNDERS_EXIT_PROTOCOL = {
  title: 'FOUNDERS EXIT PROTOCOL',
  subtitle: 'How to leave without breaking the system',
  
  sections: {
    principle: EXIT_PRINCIPLE,
    triggers: EXIT_TRIGGERS,
    phases: EXIT_PHASES,
    declaration: EXIT_DECLARATION,
    economic: ECONOMIC_SEPARATION,
    post_exit: POST_EXIT_RULES,
    failure: EXIT_FAILURE_MODE,
    final: EXIT_FINAL_TRUTH,
  },
  
  status: {
    now_exists: [
      'Technical architecture',
      'Institutional discipline',
      'Human oath',
      'Founder-less survival',
    ],
    
    system_is_now: 'Autonomous in relation to humans',
    level: 'This is the highest level of design.',
    
    remaining: {
      nothing_to_add: true,
      only: 'Not to add.',
    },
  },
} as const;
