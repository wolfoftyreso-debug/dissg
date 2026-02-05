/**
 * ORGANIZATION AT SCALE
 * 
 * Grow functions, not teams.
 */

import type { ScalingRole, RevenueStream, PublicContentPolicy, CompletionSignal, DestructionRisk } from './types';

// ============================================================================
// ORGANIZATION PRINCIPLE
// ============================================================================

export const ORGANIZATION_PRINCIPLE = {
  rule: 'Grow functions, not teams',
  implication: 'Everything else is replaceable',
} as const;

// ============================================================================
// PERMANENT ROLES
// ============================================================================

export const PERMANENT_ROLES: readonly ScalingRole[] = [
  { title: 'Ontology Steward', count: '1-2', permanent: true },
  { title: 'Infra Lead', count: '1', permanent: true },
  { title: 'Compiler Lead', count: '1', permanent: true },
  { title: 'Public Archive Curator', count: '1', permanent: true },
];

// ============================================================================
// ECONOMICS AT SCALE
// ============================================================================

export const REVENUE_STREAMS: readonly RevenueStream[] = [
  { source: 'Private mirrors', scales_with: 'enterprise count' },
  { source: 'Enterprise ingestion', scales_with: 'data volume' },
  { source: 'AI-agent SLA', scales_with: 'agent count' },
  { source: 'Historical snapshots', scales_with: 'archive depth' },
];

export const PUBLIC_CONTENT_POLICY: PublicContentPolicy = {
  free: true,
  complete: true,
  non_commercially_influenced: true,
  reason: 'This is why trust holds',
};

// ============================================================================
// COMPLETION SIGNALS
// ============================================================================

export const COMPLETION_SIGNALS: readonly CompletionSignal[] = [
  {
    indicator: 'Other systems start mapping to your ontology',
    meaning: 'You have become the standard',
  },
  {
    indicator: 'Decisions referenced by structure, not name',
    meaning: 'Format has replaced personality',
  },
  {
    indicator: '"Cannot answer yet" cited as authority',
    meaning: 'Gaps are valued as much as answers',
  },
  {
    indicator: 'New AI models trained to fit your format',
    meaning: 'Machine learning adapts to you',
  },
];

export const COMPLETION_EFFECT = {
  when_all_signals_present: 'Competition ends',
  mechanism: 'There is nothing to compete with',
} as const;

// ============================================================================
// DESTRUCTION RISK
// ============================================================================

export const DESTRUCTION_RISK: DestructionRisk = {
  not_from: [
    'Technology',
    'Regulation',
    'Competition',
  ],
  from: 'Someone starting to "help the user a little more"',
};

export const SURVIVAL_CONDITION = {
  if_avoided: 'System holds',
  what_to_avoid: DESTRUCTION_RISK.from,
  enforcement: 'cultural + technical',
} as const;
