/**
 * RISKS & COUNTERMEASURES
 * 
 * Proactive risk management for global rollout.
 */

import type { RiskMitigation } from './types';

// ============================================================================
// IDENTIFIED RISKS
// ============================================================================

export const RISK_MITIGATIONS: readonly RiskMitigation[] = [
  {
    risk: 'too_complex',
    description: 'Users find the system too complex to use',
    countermeasure: 'Question Shaping + Gravity scaling. Progressive disclosure of complexity.',
    severity: 'medium',
  },
  {
    risk: 'people_want_answers',
    description: 'Users expect direct answers, not conditional structures',
    countermeasure: 'Conditional answers + trust over time. Show value of structure.',
    severity: 'high',
  },
  {
    risk: 'big_tech_copies',
    description: 'Large platforms attempt to copy the system',
    countermeasure: 'Ontology + history + legitimacy lock. Structure is harder to copy than content.',
    severity: 'medium',
  },
  {
    risk: 'regulatory_friction',
    description: 'Regulators attempt to classify as advice',
    countermeasure: 'Clear legal position: "We do not tell anyone what to do. We show what must be known."',
    severity: 'low',
  },
  {
    risk: 'ai_misuse',
    description: 'AI agents cite incorrectly or hallucinate',
    countermeasure: 'Strict schema + deterministic outputs + hallucination-resistant structure.',
    severity: 'medium',
  },
  {
    risk: 'adoption_slowness',
    description: 'Institutional adoption slower than expected',
    countermeasure: 'Focus on AI citation first. Institutions follow trusted sources.',
    severity: 'medium',
  },
  {
    risk: 'localization_drift',
    description: 'Local versions diverge from canonical ontology',
    countermeasure: 'Ontology always English. Only UI/examples/units localized.',
    severity: 'high',
  },
  {
    risk: 'monetization_pressure',
    description: 'Pressure to add forbidden revenue streams',
    countermeasure: 'Constitutional lock on forbidden features. Public commitment.',
    severity: 'high',
  },
] as const;

// ============================================================================
// LEGAL POSITION (CRITICAL)
// ============================================================================

export const LEGAL_POSITION = {
  statement: 'We do not tell anyone what to do. We show what must be known.',
  classification: 'Observational decision-support infrastructure',
  
  we_do: [
    'Show decision structure',
    'Document assumptions',
    'Expose alternatives',
    'Acknowledge uncertainties',
    'Provide transparency',
  ],
  
  we_never: [
    'Give advice',
    'Make recommendations',
    'Influence choices',
    'Rank options',
    'Simplify away uncertainty',
  ],
} as const;

// ============================================================================
// UTILITIES
// ============================================================================

export function getRisksBySeverity(severity: 'low' | 'medium' | 'high'): readonly RiskMitigation[] {
  return RISK_MITIGATIONS.filter(r => r.severity === severity);
}

export function getHighSeverityRisks(): readonly RiskMitigation[] {
  return getRisksBySeverity('high');
}

export function getAllRisks(): readonly RiskMitigation[] {
  return RISK_MITIGATIONS;
}
