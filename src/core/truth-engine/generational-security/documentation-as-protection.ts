/**
 * DOCUMENTATION AS PROTECTION, NOT GUIDANCE
 * 
 * STEG 30: WHAT IS DOCUMENTED
 * 
 * You document:
 * - What the oracle is NOT
 * - What it should NEVER do
 * - What questions it should NEVER answer
 * 
 * You do NOT document:
 * - Visions
 * - Future ideas
 * - Possibilities
 * 
 * The future is always the enemy of oracles.
 */

/**
 * WHAT IS DOCUMENTED
 */
export const DOCUMENTED = {
  what_oracle_is_not: {
    content: [
      'Not an advisory service',
      'Not a decision-making system',
      'Not a prediction engine',
      'Not a recommendation platform',
      'Not a real-time service',
      'Not a personalized experience',
    ],
    purpose: 'Prevent scope creep by defining boundaries',
    enforcement: 'Technical blocks on any feature in these categories',
  },
  
  what_oracle_never_does: {
    content: [
      'Never makes recommendations',
      'Never predicts outcomes',
      'Never judges quality',
      'Never ranks options',
      'Never suggests actions',
      'Never interprets meaning',
    ],
    purpose: 'Prevent epistemic corruption',
    enforcement: 'Epistemic guards block any such output',
  },
  
  what_oracle_never_answers: {
    content: [
      'What should I do?',
      'What is best?',
      'What will happen?',
      'Who is right?',
      'What is the truth about X opinion?',
    ],
    purpose: 'Prevent becoming an authority',
    enforcement: 'Query filter blocks these patterns',
  },
  
  maintenance_procedures: {
    content: 'Step-by-step operational guides',
    purpose: 'Enable maintenance without understanding',
    enforcement: 'Procedures must be followed exactly',
  },
} as const;

/**
 * WHAT IS NOT DOCUMENTED
 */
export const NOT_DOCUMENTED = {
  visions: {
    type: 'Original vision for the system',
    why_not: 'Vision enables "returning to original intent" arguments',
    danger: 'Reinterpretation of vision to justify changes',
  },
  
  future_ideas: {
    type: 'Ideas for what the system could become',
    why_not: 'Future ideas create expectations of development',
    danger: 'Pressure to implement "planned" features',
  },
  
  possibilities: {
    type: 'Things the system could do if modified',
    why_not: 'Possibilities invite modification',
    danger: 'Each possibility is a potential erosion',
  },
  
  why_decisions: {
    type: 'Reasons for specific design decisions',
    why_not: 'Reasons can be argued against',
    danger: 'If reason seems outdated, decision gets challenged',
  },
  
  modification_guides: {
    type: 'How to change core behavior',
    why_not: 'Guides make modification easier',
    danger: 'Lower barrier to harmful changes',
  },
} as const;

/**
 * THE FUTURE IS THE ENEMY
 */
export const FUTURE_AS_ENEMY = {
  statement: 'The future is always the enemy of oracles',
  
  why: {
    future_promises_improvement: 'Future always seems better',
    improvement_requires_change: 'Better requires different',
    change_erodes_integrity: 'Different is not the same',
  },
  
  protection: {
    no_roadmaps: 'No public or internal development roadmaps',
    no_versioning_promises: 'No "in future version" statements',
    no_feature_requests: 'No mechanism to request features',
    no_development_updates: 'No "exciting new features" announcements',
  },
  
  message: 'The oracle is complete. It will not be improved.',
} as const;

/**
 * DOCUMENTATION PRINCIPLES
 */
export const DOCUMENTATION_PRINCIPLES = {
  principle_1: {
    name: 'Boundaries over possibilities',
    meaning: 'Document limits, not potential',
    example: '"Cannot do X" not "Could do X if modified"',
  },
  
  principle_2: {
    name: 'Procedures over understanding',
    meaning: 'Document steps, not reasons',
    example: '"Do A then B then C" not "A leads to B because..."',
  },
  
  principle_3: {
    name: 'Constraints over capabilities',
    meaning: 'Document what is forbidden, not what is possible',
    example: '"Never process personal data" not "Processes aggregate data"',
  },
  
  principle_4: {
    name: 'Present over future',
    meaning: 'Document current state only',
    example: '"System does X" not "System will do X"',
  },
  
  principle_5: {
    name: 'Protection over enablement',
    meaning: 'Documentation should make change harder, not easier',
    example: 'Emphasize risks of modification, not methods',
  },
} as const;

/**
 * THE INSTITUTIONAL MEMORY
 */
export const INSTITUTIONAL_MEMORY = {
  what_is_preserved: [
    'What has been explicitly rejected and why',
    'What mistakes have been made',
    'What attacks have been attempted',
    'What crises have been survived',
  ],
  
  what_is_not_preserved: [
    'Dreams of founders',
    'Debates about direction',
    'Alternative designs considered',
    'Features almost implemented',
  ],
  
  purpose: 'Memory serves to prevent repetition, not to inspire future',
} as const;
