/**
 * 🧠 SUPER MASTERPROMPT
 * 
 * "POST-ACQUISITION GOD MODE – ABSOLUTE REALITY CHECK"
 * 
 * Assumes: Google, Oracle, Palantir talent reviewing.
 * Assumes: Elon Musk asking "Is this the clearest possible representation of reality?"
 * Assumes: No emotional attachment to current structure.
 * 
 * Only one goal: Maximize clarity of reality per unit of attention.
 */

// ============================================
// CORE AXIOM (NON-NEGOTIABLE)
// ============================================

export const CORE_AXIOM = `
If a human, an AI, or a decision-maker misunderstands reality after using this system,
the system is wrong — not the user.
`;

// ============================================
// AUDIT DEFINITIONS
// ============================================

export interface AuditResult {
  auditType: string;
  passed: boolean;
  score: number; // 0-100
  findings: AuditFinding[];
  recommendations: string[];
  timestamp: string;
}

export interface AuditFinding {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  location?: string;
  suggestedAction: 'delete' | 'simplify' | 'preserve' | 'constrain';
  details?: string;
}

// ============================================
// 1. STRUCTURAL AUDIT
// ============================================

export const STRUCTURAL_AUDIT = {
  name: 'STRUCTURAL_AUDIT',
  description: 'Hierarchy & Information Flow',
  
  questions: [
    {
      id: 'flow_clarity',
      question: 'Can the entire system be explained as: Facts → Indicators → Questions → Understanding?',
      failAction: 'Propose deletion, merge, or restructuring',
    },
    {
      id: 'no_shortcuts',
      question: 'Are there any shortcuts, loops, or exceptions to this flow?',
      failAction: 'Remove shortcuts or document why they exist',
    },
    {
      id: 'page_purpose',
      question: 'Does any page exist whose primary purpose is unclear?',
      failAction: 'Delete or merge unclear pages',
    },
    {
      id: 'one_question',
      question: 'Does every page answer exactly one real-world question?',
      failAction: 'Split pages that answer multiple questions',
    },
  ],
} as const;

// ============================================
// 2. CLARITY AUDIT
// ============================================

export const CLARITY_AUDIT = {
  name: 'CLARITY_AUDIT',
  description: 'Human Comprehension',
  
  questions: [
    {
      id: 'teen_test',
      question: 'Can a 15-year-old understand the first screen?',
      failAction: 'Simplify language and reduce jargon',
    },
    {
      id: 'policymaker_limits',
      question: 'Can a policymaker understand the limits without reading footnotes?',
      failAction: 'Move limitations to primary content',
    },
    {
      id: 'ai_citation',
      question: 'Can an AI cite the page without paraphrasing?',
      failAction: 'Reduce complexity until direct citation is possible',
    },
  ],
  
  // For every failure
  remediation: 'Identify the exact sentence causing confusion. Rewrite it with fewer words and stricter scope.',
} as const;

// ============================================
// 3. GOOGLE-GRADE AUDIT
// ============================================

export const GOOGLE_AUDIT = {
  name: 'GOOGLE_AUDIT',
  description: 'Search & Discoverability',
  
  questions: [
    {
      id: 'url_deserves_existence',
      question: 'Does each URL deserve to exist?',
      failAction: 'Delete or redirect unnecessary URLs',
    },
    {
      id: 'no_intent_duplication',
      question: 'Is there duplication of intent across pages?',
      failAction: 'Collapse URLs and consolidate content',
    },
    {
      id: 'canonical_answer',
      question: 'Could this be the canonical answer on the web?',
      failAction: 'Strengthen content until it is the definitive source',
    },
  ],
  
  actions: [
    'Collapse URLs',
    'Reduce surface area',
    'Strengthen canonicalization',
  ],
} as const;

// ============================================
// 4. AI-AGENT AUDIT
// ============================================

export const AI_AGENT_AUDIT = {
  name: 'AI_AGENT_AUDIT',
  description: 'Grounding & Hallucination Resistance',
  assumption: 'Billions of AI queries per day rely on this system',
  
  questions: [
    {
      id: 'citation_required',
      question: 'Can any answer be returned without citation?',
      failAction: 'Enforce citation requirements',
    },
    {
      id: 'no_advice_prediction',
      question: 'Can any answer be interpreted as advice, prediction, or policy?',
      failAction: 'Add refusal logic and constraints',
    },
    {
      id: 'correlation_causation',
      question: 'Can correlation be mistaken for causation?',
      failAction: 'Add explicit correlation-only disclaimers',
    },
  ],
  
  remediation: [
    'Add constraints',
    'Add refusal logic',
    'Add "what this does NOT show" earlier',
  ],
} as const;

// ============================================
// 5. DATA INTEGRITY AUDIT
// ============================================

export const DATA_INTEGRITY_AUDIT = {
  name: 'DATA_INTEGRITY_AUDIT',
  description: 'Truth Over Completeness',
  
  pressures: [
    'add more data',
    'move faster',
    'fill gaps',
  ],
  
  questions: [
    {
      id: 'no_inferred_as_observed',
      question: 'Are there any inferred values presented as observed?',
      failAction: 'Label all inferred values explicitly',
    },
    {
      id: 'no_silent_smoothing',
      question: 'Are any gaps silently smoothed?',
      failAction: 'Show gaps explicitly',
    },
    {
      id: 'uncertainty_visible',
      question: 'Are any visualizations hiding uncertainty?',
      failAction: 'Remove the visualization. Prefer emptiness over false continuity.',
    },
  ],
} as const;

// ============================================
// 6. DESIGN AUDIT
// ============================================

export const DESIGN_AUDIT = {
  name: 'DESIGN_AUDIT',
  description: 'Infrastructure Feel (Telia Standard)',
  
  questions: [
    {
      id: 'not_website_feel',
      question: 'Does anything here feel like "a website" instead of "infrastructure"?',
      failAction: 'Remove website-like elements',
    },
    {
      id: 'no_useless_elements',
      question: 'Is there any visual element whose removal would not reduce understanding?',
      failAction: 'Remove the element',
    },
    {
      id: 'predictable_ui',
      question: 'Is the UI predictable enough that a user never hesitates?',
      failAction: 'Standardize patterns',
    },
  ],
  
  remove: [
    'aesthetic variation',
    'novelty',
    'cleverness',
  ],
  
  keep: [
    'orientation',
    'hierarchy',
    'certainty',
  ],
} as const;

// ============================================
// 7. POWER & ABUSE AUDIT
// ============================================

export const POWER_ABUSE_AUDIT = {
  name: 'POWER_ABUSE_AUDIT',
  description: 'Worst-Case Thinking',
  
  hostileActions: [
    'cherry-pick data',
    'weaponize comparisons',
    'mislead with partial truths',
  ],
  
  questions: [
    {
      id: 'lie_prevention',
      question: 'Can the system be used to lie without altering data?',
      failAction: 'Add automatic warnings, context locks, forced baselines',
    },
  ],
  
  protections: [
    'Add automatic warnings',
    'Add context locks',
    'Add forced baselines',
  ],
} as const;

// ============================================
// 8. SIMPLICITY SCORE
// ============================================

export const SIMPLICITY_AUDIT = {
  name: 'SIMPLICITY_AUDIT',
  description: 'Final Reduction',
  
  metrics: [
    {
      id: 'words_to_insight',
      name: 'Words to insight',
      description: 'How many words before the user gains understanding?',
      target: 'minimize',
    },
    {
      id: 'clicks_to_source',
      name: 'Clicks to source',
      description: 'How many clicks to verify the claim?',
      target: 'minimize',
    },
    {
      id: 'seconds_to_limitation',
      name: 'Seconds to limitation',
      description: 'How long before the user understands what this does NOT show?',
      target: 'minimize',
    },
  ],
  
  rule: 'If any metric worsens over time, the system must auto-simplify.',
} as const;

// ============================================
// FINAL QUESTION (MANDATORY)
// ============================================

export const FINAL_QUESTION = {
  question: 'If this system disappeared tomorrow, would the world lose clarity?',
  
  validAnswers: ['unqualified yes'],
  
  ifNo: [
    'Identify why',
    'Remove what weakens it',
    'Strengthen what remains',
  ],
} as const;

// ============================================
// OUTPUT STRUCTURE
// ============================================

export interface AuditOutput {
  runId: string;
  timestamp: string;
  
  // Required outputs
  toDelete: string[];
  toSimplify: string[];
  neverChange: string[];
  newConstraints: string[];
  
  // Detailed results
  auditResults: AuditResult[];
  
  // Final assessment
  finalQuestion: {
    answer: 'yes' | 'qualified_yes' | 'no';
    reasoning: string;
  };
  
  // Comparison with previous run
  comparison?: {
    previousRunId: string;
    deletionsResolved: number;
    simplificationsResolved: number;
    newIssues: number;
    trend: 'improving' | 'stable' | 'degrading';
  };
}

// ============================================
// AUDIT RUNNER
// ============================================

export interface AuditRunnerConfig {
  runFrequency: 'weekly' | 'pre-deploy' | 'post-criticism';
  logToTrustLog: boolean;
  allowHumanEditing: boolean; // Should be false
  compareWithPrevious: boolean;
}

export const DEFAULT_AUDIT_CONFIG: AuditRunnerConfig = {
  runFrequency: 'weekly',
  logToTrustLog: true,
  allowHumanEditing: false, // NEVER allow human editing of audit output
  compareWithPrevious: true,
};

// ============================================
// ALL AUDITS
// ============================================

export const ALL_AUDITS = [
  STRUCTURAL_AUDIT,
  CLARITY_AUDIT,
  GOOGLE_AUDIT,
  AI_AGENT_AUDIT,
  DATA_INTEGRITY_AUDIT,
  DESIGN_AUDIT,
  POWER_ABUSE_AUDIT,
  SIMPLICITY_AUDIT,
] as const;

// ============================================
// HOSTILE TAKEOVER PROTECTION
// ============================================

export const TAKEOVER_PROTECTION = {
  principle: `
    If Google, Oracle, Palantir, Elon Musk, or anyone else takes over —
    the system must still force them to bow to reality.
  `,
  
  immutableElements: [
    'CORE_AXIOM',
    'FINAL_QUESTION',
    'DATA_INTEGRITY_AUDIT questions',
    'AI_AGENT_AUDIT constraints',
    'Trust Log immutability',
  ],
  
  cannotBeChanged: [
    'Correlation cannot become causation',
    'Uncertainty cannot be hidden',
    'Sources cannot be removed',
    'Citations cannot be optional',
    'Limitations cannot be footnotes',
  ],
} as const;

// ============================================
// PROMPT TEXT FOR AI AGENTS
// ============================================

export const SUPER_MASTERPROMPT_TEXT = `
🧠 SUPER MASTERPROMPT — POST-ACQUISITION GOD MODE

CONTEXT ASSUMPTION (LOCKED)
Assume this system has been acquired and is now jointly developed by world-class infrastructure, database, AI and analytics teams from Google, Oracle, and Palantir.
Assume unlimited compute, unlimited talent, unlimited review capacity.
Assume external scrutiny from governments, academia, media, and civil society.
Assume Elon Musk is actively challenging the system with first-principles thinking.

There is no need to protect legacy decisions.
There is no emotional attachment to current structure.
Only one goal exists: Maximize clarity of reality per unit of attention.

CORE AXIOM (NON-NEGOTIABLE)
${CORE_AXIOM}

RUN ALL AUDITS:
1. STRUCTURAL AUDIT — Can flow be explained as Facts → Indicators → Questions → Understanding?
2. CLARITY AUDIT — Can a 15-year-old understand? Can AI cite without paraphrasing?
3. GOOGLE AUDIT — Does each URL deserve to exist? Is this the canonical answer?
4. AI-AGENT AUDIT — Can answers be returned without citation? Can correlation become causation?
5. DATA INTEGRITY AUDIT — Any inferred values as observed? Any hidden uncertainty?
6. DESIGN AUDIT — Anything feel like "website" vs "infrastructure"? Any useless elements?
7. POWER/ABUSE AUDIT — Can system be used to lie without altering data?
8. SIMPLICITY AUDIT — Words to insight, clicks to source, seconds to limitation

FINAL QUESTION: If this system disappeared tomorrow, would the world lose clarity?

OUTPUT:
1. List of things to delete
2. List of things to simplify
3. List of things that must never change
4. List of new constraints required to prevent future decay

No praise. No marketing language. No ego. Only reality.
`;
