/**
 * THREAT MODEL
 * 
 * Realistic, not paranoid.
 * We protect against what matters.
 */

import type { Threat, ThreatCategory } from './types';

// ============================================================================
// THREATS WE PROTECT AGAINST
// ============================================================================

export const THREATS: readonly Threat[] = [
  {
    category: 'data_manipulation',
    description: 'Alter history, "clean up" uncertainty, modify locked decisions',
    severity: 'critical',
    mitigations: [
      'Append-only event store',
      'Cryptographic hash chains',
      'Periodic Merkle roots published externally',
      'No direct DB writes',
      'Full replay capability',
    ],
  },
  {
    category: 'semantic_corruption',
    description: 'Sneak in ranking, recommendation, value judgments',
    severity: 'critical',
    mitigations: [
      'Anti-summary guards (runtime + tests)',
      'Forbidden phrase detection',
      'Ontology locks with 90-day delay',
      'No admin role with full access',
    ],
  },
  {
    category: 'api_misuse',
    description: 'Write without legitimacy, bypass validation',
    severity: 'high',
    mitigations: [
      'Command validation gates',
      'Schema validation',
      'Ontology validation',
      'Legitimacy pre-check',
      'Forbidden-field scan',
    ],
  },
  {
    category: 'ai_hallucination',
    description: 'AI agents making things up, generating conclusions',
    severity: 'high',
    mitigations: [
      'AI can only read, never write',
      'AI cannot lock or create alternatives',
      'AI cannot formulate conclusions',
      'Agent rate limits per decision',
      'Gravity-based throttling',
    ],
  },
  {
    category: 'insider_risk',
    description: 'Well-meaning improvements that compromise integrity',
    severity: 'medium',
    mitigations: [
      'Role separation (no admin with everything)',
      'Ontology changes require 90-day delay',
      'All changes leave audit trail',
      'Red team testing quarterly',
    ],
  },
  {
    category: 'external_pressure',
    description: 'Legal, PR, commercial pressure to compromise',
    severity: 'high',
    mitigations: [
      'No advice = no liability',
      'Regulatory resilience by design',
      'Multi-jurisdiction mirrors',
      'Charter cannot be changed quickly',
    ],
  },
] as const;

// ============================================================================
// THREATS WE IGNORE (HANDLED ELSEWHERE)
// ============================================================================

export const IGNORED_THREATS = [
  {
    name: 'DDoS',
    reason: 'Standard infrastructure concern, not data integrity',
    handled_by: 'CDN, rate limiting, standard ops',
  },
  {
    name: 'UI defacement',
    reason: 'Superficial, does not affect data integrity',
    handled_by: 'Standard web security, CSP',
  },
] as const;

// ============================================================================
// THREAT UTILITIES
// ============================================================================

export function getThreatsByCategory(category: ThreatCategory): Threat | undefined {
  return THREATS.find(t => t.category === category);
}

export function getCriticalThreats(): readonly Threat[] {
  return THREATS.filter(t => t.severity === 'critical');
}

export function getAllMitigations(): string[] {
  return THREATS.flatMap(t => t.mitigations);
}
