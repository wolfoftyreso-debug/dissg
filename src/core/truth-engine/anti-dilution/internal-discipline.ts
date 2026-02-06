/**
 * INTERNAL DISCIPLINE
 * 
 * STEG 26: THE HARDEST PART
 * 
 * The greatest threat comes from within:
 * - New teams
 * - New leaders
 * - New ambitions
 * 
 * The core is owned by: no one - it is stewarded.
 */

/**
 * INTERNAL THREATS
 */
export const INTERNAL_THREATS = {
  new_teams: {
    pattern: 'Want to make their mark',
    pressure: 'Add features, improve, modernize',
    defense: 'Core is off-limits for improvement',
  },
  
  new_leaders: {
    pattern: 'Want to show results',
    pressure: 'Demonstrate change and progress',
    defense: 'Progress measured by stability, not change',
  },
  
  new_ambitions: {
    pattern: 'Want to expand scope',
    pressure: 'Add capabilities, enter new domains',
    defense: 'Expansion only through extension layers',
  },
  
  growth_pressure: {
    pattern: 'Revenue targets require features',
    pressure: 'Modify to capture market segments',
    defense: 'Revenue from licensing, not modification',
  },
  
  competitive_pressure: {
    pattern: 'Competitors have X feature',
    pressure: 'Match features to stay relevant',
    defense: 'Our feature is stability',
  },
} as const;

/**
 * ACCESS CONTROL
 */
export const ACCESS_CONTROL = {
  write_access: {
    to_core: 'Extremely limited',
    holders: ['Truth Stewards only'],
    process: 'Unanimous approval + 18 month delay',
  },
  
  read_access: {
    to_core: 'Universal',
    holders: ['Everyone'],
    process: 'No restrictions',
  },
  
  extension_access: {
    to_extensions: 'Permissive',
    holders: ['Verified developers'],
    process: 'Standard review',
  },
} as const;

/**
 * STEWARDSHIP MODEL
 */
export const STEWARDSHIP_MODEL = {
  principle: 'Core is owned by no one - it is stewarded',
  
  roles: {
    truth_stewards: {
      responsibility: 'Guard ontology and semantics',
      power: 'Veto on any core change',
      term: 'Lifetime or voluntary resignation',
    },
    system_operators: {
      responsibility: 'Maintain infrastructure',
      power: 'None over core semantics',
      term: 'Standard employment',
    },
    interface_designers: {
      responsibility: 'Create extension layers',
      power: 'None over core',
      term: 'Standard employment',
    },
  },
  
  no_product_owner: {
    statement: 'Core has no product owner',
    reason: 'Product ownership implies change authority',
    alternative: 'Stewardship implies preservation duty',
  },
} as const;

/**
 * CHANGE PROCESS
 */
export const CHANGE_PROCESS = {
  for_core_changes: {
    step_1: 'Proposal must be public',
    step_2: 'Eighteen month review period',
    step_3: 'Unanimous steward approval',
    step_4: 'Reversibility proof required',
    step_5: 'Public announcement 6 months before',
    step_6: 'Implementation only adds, never modifies',
  },
  
  for_extension_changes: {
    step_1: 'Standard code review',
    step_2: 'Verify no core impact',
    step_3: 'Deploy to extension layer',
  },
  
  emergency_changes: {
    allowed_for: 'Security vulnerabilities only',
    requires: 'Cryptographic proof of exploit',
    still_requires: 'Public disclosure within 30 days',
  },
} as const;

/**
 * ORGANIZATIONAL SAFEGUARDS
 */
export const ORGANIZATIONAL_SAFEGUARDS = {
  separation_of_concerns: {
    core_team: 'Separate from product team',
    core_budget: 'Separate from growth budget',
    core_metrics: 'Stability, not adoption',
  },
  
  incentive_alignment: {
    core_team_rewarded_for: 'Zero changes',
    extension_team_rewarded_for: 'Innovation',
    leadership_rewarded_for: 'Long-term trust',
  },
  
  succession_planning: {
    steward_succession: 'Apprenticeship model',
    knowledge_transfer: '5 year minimum overlap',
    documentation: 'Self-sufficient for reconstruction',
  },
} as const;

/**
 * THE STEWARD OATH
 */
export const STEWARD_OATH = {
  text: `I accept stewardship of the core.
I will not modify what I do not fully understand.
I will not simplify what must remain complex.
I will not accelerate what must remain slow.
I will resist all pressure to make the core "better".
I understand that my role is preservation, not improvement.
I accept that my success is measured by nothing changing.`,
  
  binding: 'Morally, not legally',
  violation_consequence: 'Removal from stewardship',
} as const;

/**
 * FOUNDERS EXIT PROTOCOL
 */
export const FOUNDERS_EXIT = {
  phase_1_detachment: {
    duration: '12 months',
    action: 'Reduce operational involvement',
    maintain: 'Advisory role only',
  },
  
  phase_2_transfer: {
    duration: '12 months',
    action: 'Transfer all authority to stewards',
    maintain: 'Observer status only',
  },
  
  phase_3_silence: {
    duration: 'Permanent',
    action: 'Complete withdrawal',
    maintain: 'Nothing',
  },
  
  purpose: 'System must be independent of any individual',
} as const;
