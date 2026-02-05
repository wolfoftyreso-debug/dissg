/**
 * REGULATORY RESILIENCE
 * 
 * The system can always show:
 * - No advice is given
 * - No choices are influenced
 * - Uncertainty is not hidden
 * - Responsibility is not delegated to AI
 * 
 * This is your legal armor.
 */

// ============================================================================
// LEGAL POSITION
// ============================================================================

export const LEGAL_POSITION = {
  classification: 'Observational decision-support infrastructure',
  
  core_statement: 'We do not tell anyone what to do. We show what must be known.',
  
  what_system_does: [
    'Shows how decisions are structured',
    'Shows what was known and uncertain',
    'Enables verification over time',
    'Provides pattern identification',
    'Provides scenario framing',
  ],
  
  what_system_does_not: [
    'Give advice',
    'Make recommendations',
    'Influence choices',
    'Hide uncertainty',
    'Delegate responsibility to AI',
    'Simplify to conclusions',
  ],
} as const;

// ============================================================================
// REGULATORY EVIDENCE
// ============================================================================

export interface RegulatoryEvidence {
  claim: string;
  evidence_type: 'structural' | 'technical' | 'auditable';
  proof: string;
}

export const REGULATORY_EVIDENCE: readonly RegulatoryEvidence[] = [
  {
    claim: 'No advice is given',
    evidence_type: 'structural',
    proof: 'Anti-summary guards block all recommendation language. Audit logs prove no recommendations were ever issued.',
  },
  {
    claim: 'No choices are influenced',
    evidence_type: 'structural',
    proof: 'Alternatives are always symmetric. No ranking, no scoring, no "best option" field exists in schema.',
  },
  {
    claim: 'Uncertainty is not hidden',
    evidence_type: 'technical',
    proof: 'Decisions cannot be locked without uncertainty block. Validation gate enforces this at write time.',
  },
  {
    claim: 'Responsibility is not delegated to AI',
    evidence_type: 'technical',
    proof: 'AI can only read, never write. AI cannot lock decisions or create alternatives. Rate limits prevent spam.',
  },
] as const;

// ============================================================================
// COMPLIANCE ARTIFACTS
// ============================================================================

export const COMPLIANCE_ARTIFACTS = {
  audit_log: {
    available: true,
    format: 'immutable_append_only',
    retention: 'permanent',
    third_party_verifiable: true,
  },
  
  system_design: {
    documented: true,
    public: true,
    versioned: true,
  },
  
  data_lineage: {
    complete: true,
    cryptographically_verified: true,
    reproducible: true,
  },
} as const;

// ============================================================================
// REGULATORY DOMAINS
// ============================================================================

export const REGULATORY_POSITIONS = {
  financial_services: {
    position: 'Not financial advice. Structure only.',
    evidence: 'No buy/sell/hold recommendations. No portfolio allocation.',
  },
  
  healthcare: {
    position: 'Not medical advice. Observation only.',
    evidence: 'No diagnosis. No treatment recommendations. Only data structure.',
  },
  
  legal: {
    position: 'Not legal advice. Reference only.',
    evidence: 'No specific legal guidance. Only case structure.',
  },
  
  consumer: {
    position: 'Not product recommendation. Comparison framework.',
    evidence: 'No "best" products. Only structured alternatives.',
  },
} as const;

// ============================================================================
// FAIL-SILENT BEHAVIOR
// ============================================================================

export const FAIL_SILENT_BEHAVIOR = {
  enabled: true,
  
  triggers: [
    'Data coverage below 70%',
    'Fewer than 3 data points',
    'Uncertainty too high to be useful',
    'Definition mismatch detected',
  ],
  
  behavior: 'Refuse to generate output',
  
  rationale: 'Better to say nothing than to mislead',
  
  liability_protection: 'Duty of care minimized by refusing to speculate',
} as const;
