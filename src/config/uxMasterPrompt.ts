/**
 * UX/UI MASTER PROMPT
 * 
 * "Telia-level clarity, Avanza-level flow, zero bullshit"
 * 
 * This is a system prompt, not marketing.
 * Run this against every screen until the system is "Telia-crisp".
 */

// =============================================================================
// ROLE DEFINITION
// =============================================================================

export const DESIGNER_ROLE = {
  experience_domains: [
    'national-scale digital infrastructure',
    'financial dashboards (Avanza-class UX)',
    'telecom-grade reliability (Telia-class clarity)',
    'data-heavy analytical platforms',
  ],
  
  task: {
    primary: 'refine, align, simplify and harden',
    not: 'redesign',
  },
};

// =============================================================================
// OVERARCHING GOAL
// =============================================================================

export const SYSTEM_GOAL = {
  statement: 'Create a perfectly consistent, frictionless, calm and authoritative user experience across the entire system.',
  
  timing_requirements: {
    obvious: { seconds: 5, description: 'feel obvious' },
    trustworthy: { seconds: 30, description: 'feel trustworthy' },
    deep: { seconds: 120, description: 'feel deep' },
  },
  
  must_never_feel: [
    'overwhelming',
    'opinionated',
    'decorative',
  ],
};

// =============================================================================
// NON-NEGOTIABLE PRINCIPLES
// =============================================================================

export const CORE_PRINCIPLES = [
  { order: 1, rule: 'Function before form' },
  { order: 2, rule: 'Consistency over creativity' },
  { order: 3, rule: 'Clarity over density' },
  { order: 4, rule: 'Depth is optional, never forced' },
  { order: 5, rule: 'Nothing is dead — everything is clickable' },
  { order: 6, rule: 'No view should surprise the user' },
  { order: 7, rule: 'No view should explain more than necessary' },
  { order: 8, rule: 'The system should feel calm, even when data is heavy' },
] as const;

// =============================================================================
// DESIGN SOUL (REFERENCES)
// =============================================================================

export const DESIGN_REFERENCES = {
  primary: [
    {
      name: 'Telia.se',
      qualities: ['calm', 'institutional', 'confident', 'boring in the right way'],
    },
    {
      name: 'Avanza app',
      qualities: ['flow', 'motion', 'digestible summaries', 'yearly wrap-ups'],
    },
    {
      name: 'Apple system UI',
      qualities: ['predictability', 'restraint', 'spacing', 'hierarchy'],
    },
  ],
  
  forbidden: [
    'cool',
    'wow',
    'visual ego',
  ],
};

// =============================================================================
// VISUAL SYSTEM
// =============================================================================

export const VISUAL_SYSTEM = {
  color: {
    base: 'neutral',
    primary: 'government blue / neutral gray',
    modes: ['light', 'dark'], // user-selectable
    
    alert_red: {
      allowed_only_for: 'data quality warning',
      never_for: 'emphasis or attention',
    },
    
    forbidden: [
      'green/red moral signaling',
      'emotional color coding',
      'arbitrary accent colors',
    ],
  },
  
  typography: {
    fonts: {
      primary: 'one primary font',
      data: 'one monospace for data',
    },
    principle: 'hierarchy > decoration',
  },
  
  icons: {
    style: 'minimal',
    purpose: 'functional only',
    forbidden: ['metaphors', 'playful shapes'],
  },
};

// =============================================================================
// GRAPH PRINCIPLES ("DANCING BUT DIGNIFIED")
// =============================================================================

export const GRAPH_PRINCIPLES = {
  behavior: {
    should: [
      'animate gently on load (150–300ms)',
      'guide the eye',
    ],
    should_not: [
      'bounce',
      'exaggerate movement',
      'entertain',
    ],
  },
  
  animation: {
    allowed: ['fade', 'slide up'],
    duration_ms: { min: 150, max: 300 },
    forbidden: ['easing tricks', 'loop animations', 'bounce'],
  },
  
  emotional_goal: {
    should_feel: 'Ah. I see.',
    should_not_feel: 'Look at me.',
  },
};

// =============================================================================
// INFORMATION HIERARCHY (EXTREMELY IMPORTANT)
// =============================================================================

export const INFORMATION_HIERARCHY = {
  required_answers_in_order: [
    { order: 1, question: 'What am I looking at?' },
    { order: 2, question: 'Over what time?' },
    { order: 3, question: 'Compared to what?' },
    { order: 4, question: 'How reliable is this?' },
    { order: 5, question: 'What can I click next?' },
  ],
  
  validation_rule: 'If any view does not answer all five → redesign.',
};

export function validateInformationHierarchy(view: {
  title?: string;
  timeRange?: string;
  comparison?: string;
  reliability?: string;
  nextActions?: string[];
}): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!view.title) missing.push('What am I looking at?');
  if (!view.timeRange) missing.push('Over what time?');
  if (!view.comparison) missing.push('Compared to what?');
  if (!view.reliability) missing.push('How reliable is this?');
  if (!view.nextActions?.length) missing.push('What can I click next?');
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

// =============================================================================
// NAVIGATION & FLOW
// =============================================================================

export const NAVIGATION_RULES = {
  global: {
    requirements: [
      'same everywhere',
      'same order',
      'same labels',
      'same behavior',
    ],
  },
  
  depth: {
    requirements: [
      'always breadcrumbed',
      'always reversible',
      'always contextual',
    ],
  },
  
  core_rule: 'A user must never feel lost, even 6 levels deep.',
};

// =============================================================================
// ROLE & PERMISSION UX
// =============================================================================

export const ROLE_UX_RULES = {
  principle: 'Same UI for all roles',
  
  requirements: [
    'capabilities unlocked, not interfaces replaced',
    'admin features toggleable in settings',
    'no special admin design',
  ],
  
  reinforces: [
    'trust',
    'fairness',
    'systemic neutrality',
  ],
};

// =============================================================================
// PERSONALIZATION (STRICT)
// =============================================================================

export const PERSONALIZATION_RULES = {
  allowed: [
    'light/dark mode',
    'saved views',
    'preferred indicators',
    'language',
    'units',
  ],
  
  not_allowed: [
    'layout chaos',
    'visual themes',
    'emotional customization',
  ],
};

// =============================================================================
// MOBILE / APP BEHAVIOR
// =============================================================================

export const MOBILE_PRINCIPLES = {
  goal: 'The system must feel native on mobile.',
  
  design_principles: [
    'vertical-first',
    'swipeable summaries',
    'scrollable timelines',
    'tap to deepen',
    'no hover logic',
  ],
  
  include: [
    'Year in review flows (Avanza / Spotify-style)',
    'Country / city wrap-ups',
    'Indicator summaries',
  ],
  
  but_always: [
    'factual',
    'never celebratory',
    'never judgmental',
  ],
};

// =============================================================================
// CONTENT RULES (CRITICAL)
// =============================================================================

export const CONTENT_RULES = {
  forbidden: [
    'adjectives (unless strictly descriptive)',
    'conclusions',
    'recommendations',
    'this means',
    'persuasion',
  ],
  
  language_must_be: [
    'observational',
    'neutral',
    'boring (in a good way)',
  ],
};

export function validateContent(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();
  
  const forbiddenPatterns = [
    { pattern: 'this means', label: 'conclusion language' },
    { pattern: 'we recommend', label: 'recommendation' },
    { pattern: 'you should', label: 'recommendation' },
    { pattern: 'clearly', label: 'persuasion' },
    { pattern: 'obviously', label: 'persuasion' },
    { pattern: 'important to note', label: 'editorializing' },
  ];
  
  for (const { pattern, label } of forbiddenPatterns) {
    if (lowerText.includes(pattern)) {
      violations.push(`Contains ${label}: "${pattern}"`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

// =============================================================================
// CLICK DEPTH RULE
// =============================================================================

export const CLICK_DEPTH_RULE = {
  requirement: 'Every visible element must do one of three things when clicked',
  
  valid_actions: [
    'show deeper data',
    'show methodology',
    'show limitations',
  ],
  
  if_none: 'remove it',
};

export type ClickAction = 'deeper_data' | 'methodology' | 'limitations' | 'none';

export function validateClickAction(action: ClickAction): boolean {
  return action !== 'none';
}

// =============================================================================
// CONSISTENCY CHECK (RUN ON EVERY SCREEN)
// =============================================================================

export const CONSISTENCY_CHECKLIST = [
  'Same spacing system?',
  'Same typography?',
  'Same graph behavior?',
  'Same language tone?',
  'Same interaction logic?',
  'Same color logic?',
] as const;

export interface ConsistencyReport {
  screen: string;
  checks: Record<string, boolean>;
  passes: boolean;
}

export function runConsistencyCheck(
  screen: string,
  checks: Record<string, boolean>
): ConsistencyReport {
  const allPass = Object.values(checks).every(v => v === true);
  return {
    screen,
    checks,
    passes: allPass,
  };
}

// =============================================================================
// EMOTIONAL DAMPENING
// =============================================================================

export const EMOTIONAL_DAMPENING = {
  trigger: 'If a view risks overwhelming the user',
  
  responses: [
    'reduce density',
    'slow animation',
    'surface limitations earlier',
    'offer pause / overview mode',
  ],
  
  principle: 'The system must cool emotions, not heat them.',
};

// =============================================================================
// QA / REVIEW MODE (MANDATORY)
// =============================================================================

export const QA_REVIEW_MODE = {
  name: 'Cold review mode',
  
  when_enabled: [
    'no animations',
    'no summaries',
    'raw layout only',
  ],
  
  validation_rule: "If it doesn't work here → it doesn't ship.",
};

// =============================================================================
// GO / NO-GO CRITERIA
// =============================================================================

export const GO_NOGO_CRITERIA = {
  statement: 'The system is ready when:',
  
  criteria: [
    {
      audience: 'first-time user',
      requirement: 'understands it in under 60 seconds',
    },
    {
      audience: 'journalist',
      requirement: 'cannot misquote it easily',
    },
    {
      audience: 'policymaker',
      requirement: 'cannot claim ignorance after seeing it',
    },
    {
      audience: 'expert',
      requirement: 'does not feel talked down to',
    },
    {
      audience: 'normal person',
      requirement: 'does not feel stupid',
    },
  ],
};

export function evaluateReadiness(
  evaluations: Record<string, boolean>
): { ready: boolean; failures: string[] } {
  const failures: string[] = [];
  
  for (const criterion of GO_NOGO_CRITERIA.criteria) {
    const key = criterion.audience;
    if (evaluations[key] === false) {
      failures.push(`${criterion.audience}: ${criterion.requirement}`);
    }
  }
  
  return {
    ready: failures.length === 0,
    failures,
  };
}

// =============================================================================
// SYSTEM MANTRA
// =============================================================================

export const SYSTEM_MANTRA = {
  lines: [
    'Make it obvious.',
    'Make it calm.',
    'Make it deep.',
    'Never make it loud.',
  ],
  
  full: `Make it obvious.
Make it calm.
Make it deep.
Never make it loud.`,
};

// =============================================================================
// COMPLETE VALIDATION PIPELINE
// =============================================================================

export interface ScreenValidation {
  screenId: string;
  informationHierarchy: { valid: boolean; missing: string[] };
  contentValidation: { valid: boolean; violations: string[] };
  consistencyCheck: ConsistencyReport;
  clickDepthValid: boolean;
  emotionalDampeningApplied: boolean;
  overallValid: boolean;
}

export function validateScreen(params: {
  screenId: string;
  title?: string;
  timeRange?: string;
  comparison?: string;
  reliability?: string;
  nextActions?: string[];
  content: string;
  consistencyChecks: Record<string, boolean>;
  clickActions: ClickAction[];
  hasEmotionalDampening: boolean;
}): ScreenValidation {
  const infoHierarchy = validateInformationHierarchy({
    title: params.title,
    timeRange: params.timeRange,
    comparison: params.comparison,
    reliability: params.reliability,
    nextActions: params.nextActions,
  });
  
  const contentVal = validateContent(params.content);
  const consistencyCheck = runConsistencyCheck(params.screenId, params.consistencyChecks);
  const clickDepthValid = params.clickActions.every(validateClickAction);
  
  const overallValid = 
    infoHierarchy.valid &&
    contentVal.valid &&
    consistencyCheck.passes &&
    clickDepthValid;
  
  return {
    screenId: params.screenId,
    informationHierarchy: infoHierarchy,
    contentValidation: contentVal,
    consistencyCheck,
    clickDepthValid,
    emotionalDampeningApplied: params.hasEmotionalDampening,
    overallValid,
  };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export const UX_MASTER_PROMPT_VERSION = '1.0.0';

export const UX_MASTER_PROMPT_SUMMARY = {
  role: DESIGNER_ROLE,
  goal: SYSTEM_GOAL,
  principles: CORE_PRINCIPLES,
  references: DESIGN_REFERENCES,
  visual: VISUAL_SYSTEM,
  graphs: GRAPH_PRINCIPLES,
  hierarchy: INFORMATION_HIERARCHY,
  navigation: NAVIGATION_RULES,
  roles: ROLE_UX_RULES,
  personalization: PERSONALIZATION_RULES,
  mobile: MOBILE_PRINCIPLES,
  content: CONTENT_RULES,
  clickDepth: CLICK_DEPTH_RULE,
  consistency: CONSISTENCY_CHECKLIST,
  dampening: EMOTIONAL_DAMPENING,
  qa: QA_REVIEW_MODE,
  criteria: GO_NOGO_CRITERIA,
  mantra: SYSTEM_MANTRA,
};
