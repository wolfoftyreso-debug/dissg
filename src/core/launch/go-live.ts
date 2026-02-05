/**
 * GO-LIVE CRITERIA & POST-LAUNCH RULES
 * 
 * The system works even if no one likes it.
 */

import type { GoLiveCriteria, PostLaunchRule, SeedContentSpec, SoftLaunchConfig } from './types';

// ============================================================================
// GO-LIVE CRITERIA
// ============================================================================

export const GO_LIVE_CRITERIA: readonly GoLiveCriteria[] = [
  {
    id: 'GL-001',
    description: 'A decision can be created, validated, locked – and cannot be destroyed',
    week: 1,
    verified: false,
    verification_method: 'End-to-end test: create → validate → lock → attempt modify',
  },
  {
    id: 'GL-002',
    description: 'A Google query can become an ontologically correct draft – without answering',
    week: 2,
    verified: false,
    verification_method: 'Query compiler test: input → draft → gaps list',
  },
  {
    id: 'GL-003',
    description: 'An external party can verify a decision without asking you',
    week: 3,
    verified: false,
    verification_method: 'Third-party verification: hash + mirror + signature',
  },
  {
    id: 'GL-004',
    description: 'The system works even if no one likes it',
    week: 4,
    verified: false,
    verification_method: 'System functions with zero external dependencies on approval',
  },
] as const;

// ============================================================================
// FINAL GO-LIVE CHECK
// ============================================================================

export const FINAL_GO_LIVE_CRITERION = {
  statement: 'The system works even if no one likes it.',
  meaning: [
    'No dependency on user approval',
    'No dependency on press coverage',
    'No dependency on investor sentiment',
    'No dependency on competitor behavior',
    'No dependency on platform goodwill',
  ],
} as const;

// ============================================================================
// POST-LAUNCH RULES (CRITICAL)
// ============================================================================

export const POST_LAUNCH_RULES: PostLaunchRule = {
  do_not: [
    'Add features',
    'Optimize UX',
    'Explain more',
    'Market aggressively',
    'Chase metrics',
    'Respond to critics',
    'Simplify for adoption',
  ],
  do: [
    'Let the system be used',
    'Let the structure speak',
    'Let adoption happen through necessity',
    'Monitor legitimacy events',
    'Track AI citations',
    'Publish weekly snapshots',
    'Maintain trust anchors',
  ],
} as const;

// ============================================================================
// SEED CONTENT SPECIFICATION
// ============================================================================

export const SEED_CONTENT_SPEC: SeedContentSpec = {
  cdp_count: { min: 50, target: 100 },
  reference_cases: { min: 5, target: 10 },
  cannot_answer_yet: { min: 20, target: 50 },
} as const;

// ============================================================================
// SOFT LAUNCH CONFIGURATION
// ============================================================================

export const SOFT_LAUNCH_CONFIG: SoftLaunchConfig = {
  indexing_allowed: true,
  marketing: false,
  observability_enabled: true,
  ai_citation_logging: true,
} as const;

// ============================================================================
// DAY 30 STATUS
// ============================================================================

export const DAY_30_STATUS = {
  achieved: [
    'A decision operating system',
    'Global SEO dominance without content',
    'AI-compatible truth',
    'Legal protection',
    'Historical memory',
    'Zero dependency on narrative',
  ],
  
  not_a_product: true,
  what_it_is: 'Infrastructure for human decision-making',
} as const;
