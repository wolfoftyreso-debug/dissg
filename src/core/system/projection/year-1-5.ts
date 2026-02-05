/**
 * YEAR 1-5 PROJECTION PHASES
 * 
 * Early adoption simulation: friction, reference status, norm shift, infrastructure, invisibility.
 * Not vision. Actual behavior.
 */

import type { ProjectionPhase, PhaseState, PhaseEffect, PhaseMetric } from './types';

// ============================================================================
// YEAR 1 — FRICTION & CURIOSITY
// ============================================================================

export const YEAR_1: ProjectionPhase = {
  year: 1,
  title: 'FRICTION & CURIOSITY',
  subtitle: '"Why doesn\'t it answer?"',
  
  state: {
    what_happens: [
      'System indexed quickly (CDP + Cannot-answer-yet)',
      'AI agents begin linking to structure as source',
      'Users encounter friction: must specify assumptions',
    ],
    friction_points: [
      '30-40% bounce on first visit',
      'Users expect answers, get structure',
      'Assumption declaration feels like work',
    ],
    adoption_pattern: 'High friction, high return rate (60-70%)',
  },
  
  reactions: [
    '30-40% bounce on first encounter',
    '60-70% return (unusually high)',
    '"Cannot answer yet" pages cited in forums and Reddit',
    'Questions begin reformulating',
  ],
  
  effects: [
    {
      description: 'Questions reformulate: "Is X good?" → "Given X, Y, Z – what does it look like?"',
      domain: 'behavior',
      permanence: 'lasting',
    },
    {
      description: 'Users learn to separate assumption from question',
      domain: 'perception',
      permanence: 'lasting',
    },
  ],
  
  metrics: [
    { name: 'Locked decisions', trend: 'stable', significance: 'Low volume, high quality' },
    { name: 'AI citations', trend: 'up', significance: 'Beginning to appear' },
    { name: 'Bounce rate', trend: 'down', significance: 'Initial friction decreasing' },
    { name: 'Return rate', trend: 'up', significance: 'Structure creates stickiness' },
  ],
};

// ============================================================================
// YEAR 2 — REFERENCE STATUS
// ============================================================================

export const YEAR_2: ProjectionPhase = {
  year: 2,
  title: 'REFERENCE STATUS',
  subtitle: '"This is how you do it when you want to be serious"',
  
  state: {
    what_happens: [
      'Media links to structure, not quotes',
      'Companies use system internally "just for one meeting"',
      'Auditors and lawyers mention the format in passing',
    ],
    friction_points: [
      'Competitors try to copy UI → fail',
      'Criticism: "It\'s too complicated" (sign of right friction)',
    ],
    adoption_pattern: 'Institutional discovery phase',
  },
  
  reactions: [
    'Competitors attempt UI copy → fail on depth',
    'Criticism: "Too complicated" (correct friction signal)',
    'Early adopters become advocates',
    'Professional communities start discussing format',
  ],
  
  effects: [
    {
      description: 'Decisions documented more frequently',
      domain: 'behavior',
      permanence: 'lasting',
    },
    {
      description: 'Uncertainty written openly without shame',
      domain: 'perception',
      permanence: 'irreversible',
    },
    {
      description: 'Post-hoc explanations lose power',
      domain: 'power',
      permanence: 'lasting',
    },
  ],
  
  metrics: [
    { name: 'Locked decisions', trend: 'up', significance: 'Stable growth' },
    { name: 'Reference cases', trend: 'up', significance: '50-150 curated' },
    { name: 'Institutional reuse', trend: 'up', significance: 'Format spreading internally' },
  ],
};

// ============================================================================
// YEAR 3 — NORM SHIFT
// ============================================================================

export const YEAR_3: ProjectionPhase = {
  year: 3,
  title: 'NORM SHIFT',
  subtitle: '"Where is the decision basis?"',
  
  state: {
    what_happens: [
      'Boards start requiring structure before decisions',
      'AI systems query for Decision and Context objects',
      '"Decision ID" used in presentations',
    ],
    friction_points: [
      'Resistance from those who thrived on intuition/rhetoric',
      'Support from those who bear responsibility but lacked protection',
    ],
    adoption_pattern: 'Expectation inversion begins',
  },
  
  reactions: [
    'Resistance from intuition/rhetoric-dependent actors',
    'Support from responsibility-bearers who lacked protection',
    'Decision ID becomes professional shorthand',
    'Structured basis becomes expected, not exceptional',
  ],
  
  effects: [
    {
      description: 'Decisions without documented uncertainty questioned',
      domain: 'structure',
      permanence: 'irreversible',
    },
    {
      description: '"We didn\'t know" becomes weak argument',
      domain: 'power',
      permanence: 'irreversible',
    },
    {
      description: 'AI hallucinations decrease in covered domains',
      domain: 'behavior',
      permanence: 'lasting',
    },
  ],
  
  metrics: [
    { name: 'Decision Legibility Score', trend: 'up', significance: 'Quality improving over time' },
    { name: 'Post-hoc reviews', trend: 'up', significance: 'Accountability loop closing' },
    { name: 'AI hallucinations', trend: 'down', significance: 'In domains with coverage' },
  ],
};

// ============================================================================
// YEAR 4 — INSTITUTIONAL INFRASTRUCTURE
// ============================================================================

export const YEAR_4: ProjectionPhase = {
  year: 4,
  title: 'INSTITUTIONAL INFRASTRUCTURE',
  subtitle: '"This is how it\'s done"',
  
  state: {
    what_happens: [
      'Public organizations reference read-only cases',
      'Universities use reference cases in teaching',
      'AI policy mentions need for "structured decision context"',
    ],
    friction_points: [
      'Attempts to politicize → fail (no opinion)',
      'Attempts to regulate → difficult (no advice)',
    ],
    adoption_pattern: 'Infrastructure status achieved',
  },
  
  reactions: [
    'Politicization attempts fail (system has no opinion)',
    'Regulation attempts difficult (no advice given)',
    'Academic integration accelerates',
    'Cross-language standardization begins',
  ],
  
  effects: [
    {
      description: 'Decision-making slows where it should slow',
      domain: 'structure',
      permanence: 'irreversible',
    },
    {
      description: 'Decision-making speeds where it should speed',
      domain: 'structure',
      permanence: 'irreversible',
    },
    {
      description: 'Responsibility distributed more clearly',
      domain: 'power',
      permanence: 'irreversible',
    },
  ],
  
  metrics: [
    { name: 'Public mirrors', trend: 'up', significance: 'Decentralization increasing' },
    { name: 'Trust snapshots cited', trend: 'up', significance: 'Verification becoming routine' },
    { name: 'Language coverage', trend: 'up', significance: 'Standardization across languages' },
  ],
};

// ============================================================================
// YEAR 5 — INVISIBLE STANDARD
// ============================================================================

export const YEAR_5: ProjectionPhase = {
  year: 5,
  title: 'INVISIBLE STANDARD',
  subtitle: '"It just exists"',
  
  state: {
    what_happens: [
      'New AI models trained with format in mind',
      'Decisions compared across time and regions',
      'Historians and researchers use data as primary source',
    ],
    friction_points: [
      'None visible — friction has been absorbed',
      'System is expected, not discussed',
    ],
    adoption_pattern: 'Invisibility achieved (highest success state)',
  },
  
  reactions: [
    'No one talks about the system anymore',
    'People talk about how decisions were made, not who said what',
    'Power without structure becomes suspicious',
    'Format treated as obvious, not innovative',
  ],
  
  effects: [
    {
      description: 'Civilizational memory emerges in real-time',
      domain: 'structure',
      permanence: 'irreversible',
    },
    {
      description: 'Systemic mistakes become harder to repeat',
      domain: 'behavior',
      permanence: 'irreversible',
    },
    {
      description: 'Power without structure becomes suspect',
      domain: 'power',
      permanence: 'irreversible',
    },
  ],
  
  metrics: [
    { name: 'Global adoption', trend: 'stable', significance: 'Without campaign' },
    { name: 'Decision-maker retention', trend: 'up', significance: 'High and stable' },
    { name: 'Churn', trend: 'down', significance: 'No alternative exists' },
  ],
};

// ============================================================================
// YEAR 1-5 PHASES
// ============================================================================

export const YEAR_1_5_PHASES: readonly ProjectionPhase[] = [
  YEAR_1, 
  YEAR_2, 
  YEAR_3, 
  YEAR_4, 
  YEAR_5
] as const;

export const YEAR_1_5_TIMELINE = {
  year_1: { start: 0, end: 12, phase: 'friction_curiosity' },
  year_2: { start: 12, end: 24, phase: 'reference_status' },
  year_3: { start: 24, end: 36, phase: 'norm_shift' },
  year_4: { start: 36, end: 48, phase: 'institutional_infrastructure' },
  year_5: { start: 48, end: 60, phase: 'invisible_standard' },
} as const;

// ============================================================================
// EARLY PHASE BALANCE
// ============================================================================

export const EARLY_FINAL_BALANCE = {
  what_you_have_not: [
    '"Won the market"',
    '"Disrupted an industry"',
    'Viral adoption',
    'Mass consumer appeal',
    'Simple onboarding',
    'Frictionless UX',
  ],
  
  what_you_have: 'Changed what counts as a legitimate decision',
  
  why_it_survives: [
    'Survives you (the founders)',
    'Survives the company',
    'Survives the technology',
    'Survives the trends',
    'Survives because structure cannot be un-learned',
  ],
} as const;

// ============================================================================
// EARLY INVISIBILITY MARKERS
// ============================================================================

export interface EarlyInvisibilityMarker {
  readonly indicator: string;
  readonly meaning: string;
  readonly year_expected: number;
}

export const EARLY_INVISIBILITY_MARKERS: readonly EarlyInvisibilityMarker[] = [
  {
    indicator: 'No one talks about the system',
    meaning: 'It has become assumed infrastructure',
    year_expected: 5,
  },
  {
    indicator: 'Competitors stop trying to copy',
    meaning: 'Depth cannot be replicated without principles',
    year_expected: 3,
  },
  {
    indicator: '"Decision ID" used without explanation',
    meaning: 'Format has become professional shorthand',
    year_expected: 3,
  },
  {
    indicator: 'AI models trained with format in mind',
    meaning: 'Structure has influenced machine learning',
    year_expected: 5,
  },
  {
    indicator: 'Historians cite as primary source',
    meaning: 'Temporal legitimacy achieved',
    year_expected: 5,
  },
  {
    indicator: 'Power without structure becomes suspicious',
    meaning: 'Cultural norm has shifted',
    year_expected: 5,
  },
  {
    indicator: 'Universities teach with reference cases',
    meaning: 'Educational integration complete',
    year_expected: 4,
  },
  {
    indicator: 'No marketing needed for adoption',
    meaning: 'Necessity drives use, not persuasion',
    year_expected: 4,
  },
];
