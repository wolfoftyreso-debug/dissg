/**
 * ORACLE STEWARDSHIP
 * 
 * The art of not destroying what has been built.
 * 
 * This is where almost everyone who reaches this position fails.
 */

// ============================================
// THE GREATEST THREAT IS INTERNAL
// ============================================

export const INTERNAL_THREAT = {
  not_external_attacks: true,
  but_internal_improvements: true,
  
  common_proposals: [
    'Can we add some context?',
    'Can we explain more?',
    'Can we help with conclusions?',
    'Can we make it more user-friendly?',
    'Can we add insights?',
  ],
  
  every_such_change: {
    reduces_epistemic_purity: true,
    increases_liability: true,
    reduces_authority: true,
  },
  
  fundamental_rule: {
    oracle_must_never_become: 'Helpful',
    oracle_must_remain: 'Reliable',
  },
};

// ============================================
// ORACLE ASCETICISM
// ============================================

/**
 * This is a rule, not an attitude.
 */
export const ORACLE_ASCETICISM = {
  core_principle: 'If something does not increase precision, it likely decreases trust',
  
  therefore: {
    fewer_answers_over_more: true,
    fewer_fields_over_more: true,
    slower_over_faster: true,
  },
  
  growth_happens_through: 'Coverage, not features',
  
  forbidden_growth_vectors: [
    'New analysis types',
    'Insight layers',
    'Explainers',
    'Recommendations',
    'Forecasts',
    'Opinions',
  ],
  
  allowed_growth_vectors: [
    'New verified sources',
    'Extended time coverage',
    'Additional geographies',
    'Improved provenance tracking',
    'Enhanced uncertainty quantification',
  ],
};

// ============================================
// THE INVISIBLE OWNER ROLE
// ============================================

export const OWNER_ROLE = {
  owners_may_never: [
    'Comment on oracle content',
    'Use oracle in debate',
    'Reference oracle as argument',
    'Interpret oracle output',
    'Advocate positions based on oracle',
    'Defend oracle conclusions',
  ],
  
  owner_is: 'Guardian, not spokesperson',
  
  the_moment_owner_uses_oracle: {
    neutrality_questioned: true,
    intention_suspected: true,
    attack_surface_opened: true,
  },
  
  correct_owner_posture: {
    statement: 'The data is publicly available for inspection',
    never: 'Defense, interpretation, or commentary',
  },
};

// ============================================
// INTERNAL STRUCTURE: WHO TOUCHES WHAT
// ============================================

export const PERMISSION_MATRIX = {
  no_one_has_right_to: [
    'Change answers',
    'Improve language',
    'Weigh sources subjectively',
    'Add context',
    'Simplify output',
    'Create summaries',
  ],
  
  only_allowed_actions: [
    'Add new verified source',
    'Verify unchanged state',
    'Log revision with full trail',
    'Flag anomaly for review',
    'Document methodology change',
  ],
  
  everything_else: 'Forbidden by design',
};

export type AllowedStewardAction =
  | 'add_verified_source'
  | 'verify_state'
  | 'log_revision'
  | 'flag_anomaly'
  | 'document_methodology_change';

export type ForbiddenStewardAction =
  | 'change_answer'
  | 'improve_language'
  | 'weigh_sources_subjectively'
  | 'add_context'
  | 'simplify_output'
  | 'create_summary'
  | 'add_insight'
  | 'interpret_data';

export function validateStewardAction(
  action: string
): { permitted: boolean; reason?: string } {
  const allowed: AllowedStewardAction[] = [
    'add_verified_source',
    'verify_state',
    'log_revision',
    'flag_anomaly',
    'document_methodology_change',
  ];
  
  const forbidden: ForbiddenStewardAction[] = [
    'change_answer',
    'improve_language',
    'weigh_sources_subjectively',
    'add_context',
    'simplify_output',
    'create_summary',
    'add_insight',
    'interpret_data',
  ];
  
  if (allowed.includes(action as AllowedStewardAction)) {
    return { permitted: true };
  }
  
  if (forbidden.includes(action as ForbiddenStewardAction)) {
    return {
      permitted: false,
      reason: `Action "${action}" violates oracle stewardship principles`,
    };
  }
  
  // Default deny for unknown actions
  return {
    permitted: false,
    reason: `Unknown action "${action}" - default deny policy`,
  };
}

// ============================================
// ORACLE AND SUCCESS
// ============================================

export const SUCCESS_TEMPTATIONS = {
  when_oracle_becomes_important: [
    'Power holders cite it',
    'Companies lean on it',
    'AI systems use it silently',
    'Media references it',
    'Policies align with it',
  ],
  
  temptation_arises_to: [
    'Take a position',
    'Show leadership',
    'Become visible',
    'Claim credit',
    'Expand influence',
  ],
  
  antidote: {
    oracle_may_never_answer: 'Why something is important',
    oracle_may_only_answer: 'How it looks',
  },
};

// ============================================
// THE HARDEST DISCIPLINE
// ============================================

export const LETTING_ERRORS_STAND = {
  people_will: [
    'Draw bad conclusions',
    'Misinterpret data',
    'Use fragments',
    'Cherry-pick',
    'Make false claims citing oracle',
  ],
  
  oracle: {
    does_not_correct_conclusions: true,
    does_not_participate_in_debate: true,
    does_not_publish_counter_posts: true,
    does_not_clarify_interpretations: true,
  },
  
  only_permitted_response: 'That is not what the complete data shows.',
  
  nothing_more: true,
  
  why: {
    engaging_with_interpretation: 'Creates interpretive precedent',
    correcting_once: 'Creates obligation to correct always',
    staying_silent: 'Maintains structural authority',
  },
};

// ============================================
// SILENT POWER FACTOR
// ============================================

export const SILENT_POWER = {
  at_full_maturity: [
    'Decisions are taken "in line with the data"',
    'Reports are written "with reference to the index"',
    'AI systems are trained "with verified source"',
    'Policies cite "according to established metrics"',
  ],
  
  you_notice_this_through: {
    fewer_questions_about: 'Legitimacy',
    more_questions_about: 'Coverage',
    almost_no_questions_about: 'Opinion',
  },
  
  this_is: 'The endpoint',
};

// ============================================
// THE ULTIMATE MISTAKE
// ============================================

export const ULTIMATE_MISTAKE = {
  never: [
    'Start "insight reports"',
    'Offer "analysis layers"',
    'Build "explainers"',
    'Create "recommendation engines"',
    'Add "AI-powered insights"',
    'Develop "trend analysis"',
  ],
  
  why: 'This is how all previous knowledge institutions lost their authority',
  
  oracle_must_never: 'Interpret the world',
  oracle_must: 'Fix it',
  
  fix_means: {
    establish_what_is_known: true,
    establish_what_is_not_known: true,
    nothing_more: true,
  },
};

// ============================================
// STEWARDSHIP ROLES
// ============================================

export interface StewardshipRole {
  role: string;
  permitted_actions: AllowedStewardAction[];
  explicitly_forbidden: string[];
  accountability: string;
}

export const STEWARDSHIP_ROLES: StewardshipRole[] = [
  {
    role: 'Source Curator',
    permitted_actions: ['add_verified_source', 'flag_anomaly'],
    explicitly_forbidden: ['interpret', 'summarize', 'recommend'],
    accountability: 'Provenance integrity',
  },
  {
    role: 'State Verifier',
    permitted_actions: ['verify_state', 'flag_anomaly'],
    explicitly_forbidden: ['modify', 'correct', 'enhance'],
    accountability: 'System integrity',
  },
  {
    role: 'Revision Logger',
    permitted_actions: ['log_revision', 'document_methodology_change'],
    explicitly_forbidden: ['retroactive changes', 'silent updates'],
    accountability: 'Historical integrity',
  },
  {
    role: 'Anomaly Handler',
    permitted_actions: ['flag_anomaly', 'verify_state'],
    explicitly_forbidden: ['resolve without trace', 'suppress'],
    accountability: 'Transparency',
  },
];

// ============================================
// CORRUPTION DETECTION
// ============================================

export interface CorruptionSignal {
  signal: string;
  severity: 'warning' | 'critical' | 'terminal';
  response: string;
}

export const CORRUPTION_SIGNALS: CorruptionSignal[] = [
  {
    signal: 'Request to "add context" to raw data',
    severity: 'critical',
    response: 'Reject immediately',
  },
  {
    signal: 'Proposal for "insight layer"',
    severity: 'terminal',
    response: 'Reject and log as existential threat',
  },
  {
    signal: 'Owner uses oracle in public argument',
    severity: 'critical',
    response: 'Immediate governance review',
  },
  {
    signal: 'Request to "simplify for users"',
    severity: 'warning',
    response: 'Review for precision impact',
  },
  {
    signal: 'Proposal to "help users understand"',
    severity: 'critical',
    response: 'Reject - oracle documents, does not teach',
  },
  {
    signal: 'Request to respond to criticism',
    severity: 'critical',
    response: 'Maintain silence - data speaks for itself',
  },
  {
    signal: 'Proposal for faster updates',
    severity: 'warning',
    response: 'Evaluate against verification requirements',
  },
  {
    signal: 'Request to weigh sources differently',
    severity: 'critical',
    response: 'Reject subjective weighting',
  },
];

export function detectCorruption(
  proposal: string
): CorruptionSignal | null {
  const lowerProposal = proposal.toLowerCase();
  
  for (const signal of CORRUPTION_SIGNALS) {
    const signalKeywords = signal.signal.toLowerCase().split(' ');
    const matchCount = signalKeywords.filter(kw => 
      lowerProposal.includes(kw) && kw.length > 3
    ).length;
    
    if (matchCount >= 2) {
      return signal;
    }
  }
  
  return null;
}

// ============================================
// STEWARDSHIP OATH
// ============================================

export const STEWARDSHIP_OATH = {
  preamble: 'As steward of the oracle, I commit to:',
  
  commitments: [
    'Never improve what does not need improvement',
    'Never explain what should remain raw',
    'Never interpret what should remain neutral',
    'Never engage what should remain silent',
    'Never accelerate what should remain patient',
    'Never expand what should remain focused',
  ],
  
  understanding: [
    'The oracle is not mine to enhance',
    'The oracle is mine to preserve',
    'My success is measured by what I did not change',
    'My legacy is the oracle unchanged',
  ],
  
  acceptance: 'I accept that doing less is doing more',
};

// ============================================
// FINAL STEWARDSHIP STATE
// ============================================

export const STEWARDSHIP_STATE = {
  nothing_more_to_build: true,
  
  there_is_only: [
    'Coverage growing slowly',
    'Trust accumulating',
    'Power never visible',
  ],
  
  this_is: 'The highest form of long-term strength in an AI ecosystem',
  
  state: 'STEWARDED',
};
