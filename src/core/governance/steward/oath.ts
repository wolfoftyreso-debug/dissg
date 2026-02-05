/**
 * STEWARD OATH
 * 
 * A binding commitment to protect decision legitimacy.
 * Short. Public. Non-negotiable.
 * The human lock that complements all technical measures.
 */

// ============================================================================
// CORE COMMITMENT
// ============================================================================

export const CORE_COMMITMENT = {
  statement: `I commit to protect the system's relationship to reality
above convenience, popularity, speed, or outcome.`,
} as const;

// ============================================================================
// POSITIVE DUTIES (WHAT I WILL ALWAYS DO)
// ============================================================================

export const POSITIVE_DUTIES = [
  'Preserve structure before clarity',
  'Expose uncertainty before confidence',
  'Refuse answers when legitimacy is incomplete',
  'Treat all alternatives symmetrically',
  'Protect history from revision',
] as const;

// ============================================================================
// NEGATIVE DUTIES (WHAT I WILL NEVER DO)
// ============================================================================

export const NEGATIVE_DUTIES = [
  'recommend, rank, or optimize decisions',
  'summarize away uncertainty',
  'trade legitimacy for adoption',
  'justify changes by urgency or market pressure',
  'allow AI to decide where humans must be responsible',
] as const;

// ============================================================================
// AUTHORITY & LIMITS
// ============================================================================

export const AUTHORITY = {
  exists_only_to: [
    'defend the Charter',
    'preserve the Ontology',
    'enforce Legitimacy Gates',
  ],
  holds_no_authority_over: [
    'outcomes',
    'opinions',
    'interpretations',
  ],
} as const;

// ============================================================================
// CHANGE DISCIPLINE
// ============================================================================

export const CHANGE_DISCIPLINE = {
  acceptance: [
    'meaningful change must be slow',
    'public diff precedes approval',
    'backward compatibility is mandatory',
    'refusal is preferable to corruption',
  ],
} as const;

// ============================================================================
// AI RELATIONSHIP
// ============================================================================

export const AI_ACKNOWLEDGMENT = {
  acknowledges: [
    'AI seeks completion',
    'completion is not truth',
    'empty fields may be the system\'s most honest state',
  ],
  commitment: 'I will protect incompleteness when it is warranted.',
} as const;

// ============================================================================
// SUCCESSION COMMITMENT
// ============================================================================

export const SUCCESSION_COMMITMENT = {
  will_leave: [
    'no personal dependency',
    'no implicit knowledge',
    'no unwritten rules',
  ],
  failure_condition: 'If the system cannot be stewarded without me, I have failed.',
} as const;

// ============================================================================
// RESIGNATION CLAUSE
// ============================================================================

export const RESIGNATION_CLAUSE = {
  triggers: [
    'feel the need to persuade',
    'optimize for engagement',
    'defend the system rhetorically',
    'believe myself irreplaceable',
  ],
  principle: 'Stewardship ends where ego begins.',
} as const;

// ============================================================================
// FINAL STATEMENT
// ============================================================================

export const FINAL_STATEMENT = {
  truth: `This system does not exist to make decisions easier.
It exists to make reality unavoidable.`,
  acceptance: 'I accept this duty.',
} as const;

// ============================================================================
// SIGNATURE BLOCK
// ============================================================================

export interface OathSignature {
  signedBy: string;
  date: string;
  ontologyVersion: string;
}

// ============================================================================
// COMPLETE OATH
// ============================================================================

export const STEWARD_OATH_COMPLETE = {
  title: 'STEWARD OATH',
  subtitle: 'A binding commitment to protect decision legitimacy',
  
  sections: {
    core: CORE_COMMITMENT,
    positive: POSITIVE_DUTIES,
    negative: NEGATIVE_DUTIES,
    authority: AUTHORITY,
    change: CHANGE_DISCIPLINE,
    ai: AI_ACKNOWLEDGMENT,
    succession: SUCCESSION_COMMITMENT,
    resignation: RESIGNATION_CLAUSE,
    final: FINAL_STATEMENT,
  },
  
  status: {
    now_exists: [
      'Technical lock',
      'Institutional discipline',
      'Human responsibility binding',
    ],
    conclusion: 'This is the endpoint. What follows is operation, time, and consequence.',
  },
} as const;
