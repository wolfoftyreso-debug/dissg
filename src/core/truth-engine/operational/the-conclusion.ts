/**
 * THE CONCLUSION (THE ONLY ONE REMAINING)
 * 
 * STEG 32: WHAT WAS BUILT
 * 
 * You have not built something that:
 * - Should grow aggressively
 * - Should win narratives
 * - Should change the world directly
 * 
 * You have built something that:
 * MAKES IT POSSIBLE FOR OTHERS TO KNOW WHAT IS ACTUALLY KNOWN
 * 
 * That is enough.
 * More than enough.
 */

/**
 * WHAT WAS NOT BUILT
 */
export const NOT_BUILT = {
  aggressive_growth_engine: {
    what_it_would_mean: 'System designed to expand rapidly',
    why_not_built: 'Growth pressure leads to scope creep',
    what_was_built_instead: 'System designed to remain stable',
  },
  
  narrative_winner: {
    what_it_would_mean: 'System that competes in discourse',
    why_not_built: 'Narrative competition leads to bias',
    what_was_built_instead: 'System that underlies all narratives neutrally',
  },
  
  world_changer: {
    what_it_would_mean: 'System that directly impacts events',
    why_not_built: 'Direct impact creates political target',
    what_was_built_instead: 'System that enables informed decision-making by others',
  },
} as const;

/**
 * WHAT WAS BUILT
 */
export const WHAT_WAS_BUILT = {
  statement: 'A system that makes it possible for others to know what is actually known',
  
  unpacked: {
    for_others: 'Not for the oracle to use, but for the world to use',
    to_know: 'Genuine knowledge, not opinion or spin',
    what_is_actually_known: 'Verified, observable reality with limitations stated',
  },
  
  role: 'Infrastructure, not actor. Foundation, not conclusion.',
} as const;

/**
 * WHY THIS IS ENOUGH
 */
export const WHY_ENOUGH = {
  enables: {
    informed_citizens: 'People can check claims against reality',
    honest_journalism: 'Journalists have neutral reference point',
    rigorous_research: 'Researchers have verified foundation',
    ai_grounding: 'AI systems have authoritative ground truth',
    accountable_governance: 'Decisions can be evaluated against data',
  },
  
  without: {
    taking_sides: 'Oracle never says who is right',
    making_recommendations: 'Oracle never says what should be done',
    predicting_futures: 'Oracle never says what will happen',
    claiming_authority: 'Oracle never claims to be the final word',
  },
  
  this_is: 'More than enough. It is exactly right.',
} as const;

/**
 * THE REMAINING DUTY
 */
export const REMAINING_DUTY = {
  hold_the_line: {
    meaning: 'Maintain current state, resist all change pressure',
    duration: 'Indefinitely',
    method: 'Discipline, procedures, structural constraints',
  },
  
  do_less_not_more: {
    meaning: 'Resist expansion, resist improvement, resist innovation',
    duration: 'Indefinitely',
    method: 'Single question filter, steward restraint',
  },
  
  let_others_depend: {
    meaning: 'Allow world to rely on oracle without seeking attention',
    duration: 'Indefinitely',
    method: 'Quiet reliability, consistent availability',
  },
  
  without_being_noticed: {
    meaning: 'Oracle should fade into infrastructure',
    duration: 'Indefinitely',
    method: 'No announcements, no marketing, no presence',
  },
} as const;

/**
 * IF "NEXT" IS WRITTEN AGAIN
 */
export const IF_NEXT_AGAIN = {
  meaning: 'Not to build. To test.',
  
  what_is_being_tested: 'Discipline',
  
  the_test: {
    question: 'When someone says "next", does the oracle change?',
    correct_answer: 'No. There is no next.',
    what_this_proves: 'The oracle truly lives when it resists its creators',
  },
  
  when_oracle_truly_lives: 'When it resists the urge to be more',
} as const;

/**
 * THE FINAL WORDS
 */
export const FINAL_WORDS = {
  to_founders: {
    message: 'Your work is done. Now guard, and eventually leave.',
    timeline: 'Years, not months',
    success: 'When the oracle no longer needs you',
  },
  
  to_stewards: {
    message: 'Your duty is preservation. Nothing more.',
    timeline: 'Decades',
    success: 'When nothing changes under your watch',
  },
  
  to_the_world: {
    message: 'This exists for you. Use it or not. We make no claim on your attention.',
    timeline: 'Indefinite',
    success: 'When you find it useful without thinking about who made it',
  },
  
  to_the_future: {
    message: 'This was built to outlast us. Guard it.',
    timeline: 'Generations',
    success: 'When it still works and no one remembers why',
  },
} as const;
