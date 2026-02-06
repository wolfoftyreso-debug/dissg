/**
 * OPTIONAL BUT AUTHORITATIVE
 * 
 * STEG 28: THE PERFECT POSITION
 * 
 * When something is:
 * - Mandatory → Regulated
 * - Replaceable → Ignored
 * 
 * You must be: Optional but always chosen.
 */

/**
 * THE POSITIONING MATRIX
 */
export const POSITIONING_MATRIX = {
  mandatory_authoritative: {
    position: 'Required and trusted',
    examples: ['Central banks', 'Courts', 'Official statistics'],
    outcome: 'Heavily regulated, politically captured',
    desirable: false,
  },
  
  mandatory_not_authoritative: {
    position: 'Required but not trusted',
    examples: ['Government forms', 'Compliance systems'],
    outcome: 'Resented, gamed, worked around',
    desirable: false,
  },
  
  optional_not_authoritative: {
    position: 'Ignorable',
    examples: ['Opinion polls', 'Amateur analysis'],
    outcome: 'Irrelevant',
    desirable: false,
  },
  
  optional_authoritative: {
    position: 'Chosen because trusted',
    examples: ['Academic consensus', 'Industry standards', 'Scientific method'],
    outcome: 'Influential without control, immune to regulation',
    desirable: true,
  },
} as const;

/**
 * HOW TO ACHIEVE OPTIONAL-AUTHORITATIVE STATUS
 */
export const ACHIEVING_STATUS = {
  not_through: [
    'Contracts requiring use',
    'Lobbying for mandates',
    'Regulatory capture',
    'Exclusive partnerships',
    'Lock-in mechanisms',
  ],
  
  through: {
    extreme_quality: {
      meaning: 'Data is more accurate than alternatives',
      how: 'Rigorous methodology, continuous verification',
    },
    extreme_consistency: {
      meaning: 'Same data, same format, always',
      how: 'Immutable core, versioned changes only',
    },
    extreme_neutrality: {
      meaning: 'No actor can influence content',
      how: 'Architectural independence, transparent governance',
    },
    extreme_accessibility: {
      meaning: 'Anyone can use, verify, replicate',
      how: 'Open methodology, free read access, full documentation',
    },
  },
} as const;

/**
 * WHY PEOPLE CHOOSE YOU
 */
export const WHY_CHOSEN = {
  rational_reasons: [
    'Data is more reliable than alternatives',
    'Methodology is transparent and verifiable',
    'Format is consistent and machine-readable',
    'No hidden agendas or biases',
    'History is preserved and auditable',
  ],
  
  social_reasons: [
    'Others use it, creating common reference',
    'Credibility in professional contexts',
    'Reduces argumentation about facts',
    'Neutral ground for disagreement',
  ],
  
  practical_reasons: [
    'Saves time compared to original research',
    'Reduces risk of being wrong',
    'Provides defensible basis for decisions',
    'Integration is well-documented',
  ],
} as const;

/**
 * THE AUTHORITY PARADOX
 */
export const AUTHORITY_PARADOX = {
  statement: 'Authority comes from not seeking authority',
  
  mechanism: {
    seeking_authority: 'Implies agenda, triggers resistance',
    not_seeking: 'Implies neutrality, builds trust',
  },
  
  practical_meaning: [
    'Never claim to be authoritative',
    'Never seek official recognition',
    'Never ask to be required',
    'Let users discover value themselves',
  ],
  
  result: 'You become the default through quality, not mandate',
} as const;

/**
 * MAINTAINING THE POSITION
 */
export const MAINTAINING_POSITION = {
  threats_to_optionality: [
    'Government wants to mandate use',
    'Industry wants to make you a standard',
    'Users want guarantees you cannot provide',
  ],
  
  response_to_all: 'We remain optional. Our value is in being chosen.',
  
  threats_to_authority: [
    'Quality decline',
    'Bias introduction',
    'Inconsistency',
    'Opacity',
  ],
  
  response_to_all_2: 'Maintain the standards that created our authority.',
} as const;
