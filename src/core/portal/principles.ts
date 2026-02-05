/**
 * PORTAL PRINCIPLES (HARD-LOCKED)
 * 
 * Access & UX principles that make this portal irreplaceable.
 */

// ============================================================================
// ACCESS PRINCIPLES
// ============================================================================

export const ACCESS_PRINCIPLES = {
  read_only: true,
  no_login: true,
  no_personalization: true,
  no_interaction: true, // No comments, likes, votes
  
  statement: 'All power lies in the structure, not in the audience.',
} as const;

// ============================================================================
// UX PRINCIPLES
// ============================================================================

export const UX_PRINCIPLES = {
  typography: 'neutral',
  color_signaling: false, // No colors that signal "good/bad"
  palette: 'grayscale_plus_structure',
  readability_horizon_years: 30,
  
  statement: 'It should feel like an archive, not an app.',
} as const;

// ============================================================================
// CONTENT PRINCIPLES
// ============================================================================

export const CONTENT_PRINCIPLES = {
  // What the portal shows
  shows: [
    'How decisions are structured',
    'What was known and uncertain',
    'Verification over time',
  ],
  
  // What the portal does NOT do
  does_not: [
    'Influence decisions',
    'Interpret outcomes',
    'Simplify to conclusions',
    'Create debate or ranking',
  ],
  
  statement: 'Transparency without narrative. Insight without influence.',
} as const;

// ============================================================================
// PUBLICATION PRINCIPLES
// ============================================================================

export const PUBLICATION_PRINCIPLES = {
  // Time-delayed publication
  delay_allowed: true,
  delay_visible: true, // Delay is openly shown
  delay_verifiable: true, // Timestamp is verifiable
  no_secret_publication: true,
  
  // Long-term archiving
  trust_anchors: true,
  checksums_visible: true,
  third_party_verification: true,
  
  statement: 'The portal can die. The history does not.',
} as const;

// ============================================================================
// MEDIA-SAFE PRINCIPLES
// ============================================================================

export const MEDIA_SAFE_PRINCIPLES = {
  prevents_isolated_quotes: true, // Context always included
  prevents_numbers_without_baseline: true,
  prevents_hidden_uncertainty: true,
  
  export_requires: [
    'scope',
    'time_horizon',
    'uncertainty_block',
  ],
  
  statement: 'Every export includes the context needed to prevent misuse.',
} as const;

// ============================================================================
// WHY THIS PORTAL IS IRREPLACEABLE
// ============================================================================

export const IRREPLACEABILITY = {
  reasons: [
    'It does not argue',
    'It does not convince',
    'It does not sell',
  ],
  
  what_it_shows: 'How responsibility looked in reality',
  
  attack_resistance: 'Extremely hard to attack because it makes no claims.',
} as const;

// ============================================================================
// FORBIDDEN ELEMENTS
// ============================================================================

export const FORBIDDEN_ELEMENTS = [
  'Rankings',
  'Recommendations',
  'Best of lists',
  'Conclusions',
  'Summaries that reduce complexity',
  'Opinion pieces',
  'Comments',
  'Likes',
  'Shares',
  'Social buttons',
  'Personalization',
  'User tracking',
  'Marketing language',
  'Mission statements',
  'Success stories',
  'Testimonials',
] as const;

// ============================================================================
// ALLOWED ELEMENTS
// ============================================================================

export const ALLOWED_ELEMENTS = [
  'Decision structure',
  'Assumptions (explicit)',
  'Alternatives (symmetric)',
  'Trade-offs',
  'Uncertainties',
  'Evidence references',
  'Review status',
  'Timestamps',
  'Checksums',
  'Version numbers',
  'Method documentation',
] as const;
