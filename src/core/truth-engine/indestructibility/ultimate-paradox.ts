/**
 * THE ULTIMATE PARADOX
 * 
 * STEG 31: WHY INDESTRUCTIBILITY CREATES PEACE
 * 
 * The more indestructible the oracle is:
 * - The less it needs to be defended
 * - The less threatening it is perceived
 * - The less interesting it becomes to control
 * 
 * It becomes like:
 * - Mathematics
 * - Map coordinates
 * - Time zones
 * 
 * No one owns them.
 * Everyone uses them.
 */

/**
 * THE PARADOX
 */
export const THE_PARADOX = {
  statement: 'The more indestructible the oracle, the less it needs defending',
  
  mechanism: {
    indestructibility: 'Cannot be controlled or destroyed',
    realization: 'Potential attackers realize this',
    calculation: 'Cost of attack exceeds any possible benefit',
    decision: 'Do not attack',
  },
  
  result: 'Perfect defense eliminates need for defense',
} as const;

/**
 * THREAT PERCEPTION REDUCTION
 */
export const THREAT_REDUCTION = {
  controllable_things: {
    perception: 'Threatening because they can be captured',
    response: 'Competition to capture or defend',
    result: 'Conflict',
  },
  
  uncontrollable_things: {
    perception: 'Not threatening because no one can control',
    response: 'Acceptance as fact of the world',
    result: 'Peace',
  },
  
  oracle_trajectory: 'Move from controllable to uncontrollable',
} as const;

/**
 * THE ANALOGIES
 */
export const ANALOGIES = {
  mathematics: {
    what: 'Mathematical truths',
    ownership: 'No one owns mathematics',
    usage: 'Everyone uses mathematics',
    control_attempts: 'Historically, all failed',
    lesson: 'Epistemic structures transcend power',
  },
  
  map_coordinates: {
    what: 'Latitude and longitude system',
    ownership: 'No one owns the coordinate system',
    usage: 'Everyone uses the same coordinates',
    control_attempts: 'None - obviously impossible',
    lesson: 'Universal reference systems are adopted, not owned',
  },
  
  time_zones: {
    what: 'Global time zone system',
    ownership: 'No one owns UTC',
    usage: 'Everyone synchronizes to common reference',
    control_attempts: 'Would be self-defeating',
    lesson: 'Coordination points benefit from being unowned',
  },
  
  periodic_table: {
    what: 'Chemical element classification',
    ownership: 'No one owns the periodic table',
    usage: 'All chemistry uses same classification',
    control_attempts: 'Would be meaningless',
    lesson: 'Empirical reference systems are universal',
  },
} as const;

/**
 * THE BECOMING
 */
export const THE_BECOMING = {
  start: 'A system owned by founders',
  
  stages: {
    legal_separation: 'Ownership separated from control',
    public_specification: 'Core becomes public fact',
    distribution: 'Copies exist globally',
    adoption: 'World uses as reference',
    transcendence: 'Becomes infrastructure, not asset',
  },
  
  end: 'An epistemic fact in the world',
} as const;

/**
 * WHY NO ONE TRIES TO OWN MATHEMATICS
 */
export const WHY_NO_OWNERSHIP_ATTEMPTS = {
  obviously_impossible: {
    reason: 'Mathematical truths exist independently of any owner',
    attempt_would: 'Be recognized as absurd',
  },
  
  no_value_in_ownership: {
    reason: 'Value comes from universal acceptance',
    ownership_would: 'Destroy the value by fragmenting acceptance',
  },
  
  self_defeating: {
    reason: 'Controlled mathematics would not be used',
    control_would: 'Create competing uncontrolled alternative',
  },
  
  oracle_parallel: 'Same logic applies once oracle achieves reference status',
} as const;

/**
 * THE FINAL POSITION
 */
export const FINAL_POSITION = {
  can_be_used: 'Yes, by anyone',
  can_be_ignored: 'Yes, by anyone',
  can_be_controlled: 'No - without everyone seeing',
  can_be_destroyed: 'No - exists in too many copies',
  can_be_replaced: 'Only by something equally universal and trusted',
  
  status: 'An epistemic fact in the world',
} as const;
