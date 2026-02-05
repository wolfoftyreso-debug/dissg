/**
 * SCALING AXES
 * 
 * Three axes in correct order: Questions, Domains, Languages.
 */

import type { 
  QuestionScaling, 
  DomainScaling, 
  LanguageScaling,
  DomainPriority 
} from './types';

// ============================================================================
// AXIS A: QUESTIONS (x100 → x1000)
// ============================================================================

export const QUESTION_SCALING: QuestionScaling = {
  input: [
    'Google Top queries',
    'Long-tail search queries',
    'User-submitted questions',
  ],
  mechanism: 'Query → Ontology Compiler (batch)',
  output: {
    cdp_percentage: 70,
    cannot_answer_percentage: 30,
  },
  key_principle: 'Publish gaps as aggressively as structure',
};

// ============================================================================
// AXIS B: DOMAINS (HORIZONTAL)
// ============================================================================

export const DOMAIN_REQUIREMENTS = [
  'Can be kept non-normative',
  'Can bear uncertainty openly',
  'Does not require advice',
] as const;

export const DOMAIN_PRIORITY_ORDER: readonly DomainPriority[] = [
  { rank: 1, name: 'Consumer & Everyday' },
  { rank: 2, name: 'Capital & Governance' },
  { rank: 3, name: 'Infrastructure & Energy' },
  { rank: 4, name: 'Policy', notes: 'read-only' },
  { rank: 5, name: 'Health', notes: 'prevalence/normality, never diagnosis' },
];

export const NEW_DOMAIN_REQUIRES = [
  'Decision Blueprint',
  'Uncertainty taxonomy',
  'Reference case (minimum 2)',
] as const;

export const DOMAIN_SCALING: DomainScaling = {
  requirements: DOMAIN_REQUIREMENTS,
  priority_order: DOMAIN_PRIORITY_ORDER,
  new_domain_requires: NEW_DOMAIN_REQUIRES,
};

// ============================================================================
// AXIS C: LANGUAGES (VERTICAL)
// ============================================================================

export const LANGUAGE_SCALING: LanguageScaling = {
  canonical_language: 'EN',
  compiler_output: 'structurally_identical',
  ui_texts: 'translated',
  requirement: 'Same question in two languages → same Decision Draft (hash-match)',
};

// ============================================================================
// AXIS ORDER (CRITICAL)
// ============================================================================

export const SCALING_AXIS_ORDER = [
  { axis: 'questions', priority: 1, multiplier: 'x100 → x1000' },
  { axis: 'domains', priority: 2, direction: 'horizontal' },
  { axis: 'languages', priority: 3, direction: 'vertical' },
] as const;
