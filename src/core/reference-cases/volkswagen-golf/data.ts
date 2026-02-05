/**
 * REFERENCE CASE #1 — VOLKSWAGEN GOLF
 * 
 * Consumer Vehicle Evaluation
 * 
 * This is the CANONICAL case. All future cases must be comparable to this.
 * Shows everyday decision without simplification.
 * Shows that the system gives NO recommendations.
 * Shows how uncertainty is documented.
 * Shows how learning happens without rewriting.
 */

// ═══════════════════════════════════════════════════════════════════
//                         DECISION
// ═══════════════════════════════════════════════════════════════════

export const DECISION_CREATE_REQUEST = {
  decision_type: 'consumer_vehicle_evaluation',
  scope: {
    population_size: 'individual',
    reversibility: 'medium',
  },
  time_horizon: {
    start: '2026-01-01',
    end: '2031-01-01',
  },
} as const;

export const DECISION_CREATE_RESPONSE = {
  decision_id: 'DEC-001',
  status: 'draft',
} as const;

// ═══════════════════════════════════════════════════════════════════
//                         CONTEXT
// ═══════════════════════════════════════════════════════════════════

export const CONTEXT_ATTACH_REQUEST = {
  decision_id: 'DEC-001',
  description: 'Private vehicle selection for mixed urban/suburban use.',
  affected_population: 'individual',
  geographic_scope: 'EU',
  decision_motivation: 'Replace aging vehicle with lower operating cost and acceptable reliability.',
  assumptions: [
    { text: 'Annual mileage ≤ 15,000 km', is_testable: true },
    { text: 'Mixed city/highway usage', is_testable: true },
    { text: 'Ownership horizon ~5 years', is_testable: true },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════
//                         ALTERNATIVES (≥2, SYMMETRICAL)
// ═══════════════════════════════════════════════════════════════════

export const ALTERNATIVE_A = {
  decision_id: 'DEC-001',
  label: 'Volkswagen Golf',
  description: 'Compact hatchback, ICE/hybrid variants.',
  trade_offs: [
    { dimension: 'cost', effect: 'medium' },
    { dimension: 'reliability', effect: 'medium' },
    { dimension: 'resale_value', effect: 'medium' },
  ],
  required_assumptions: ['Access to authorized service network'],
} as const;

export const ALTERNATIVE_B = {
  decision_id: 'DEC-001',
  label: 'Toyota Corolla',
  description: 'Compact sedan/hatchback, ICE/hybrid variants.',
  trade_offs: [
    { dimension: 'cost', effect: 'medium' },
    { dimension: 'reliability', effect: 'high' },
    { dimension: 'driving_dynamics', effect: 'medium' },
  ],
  required_assumptions: ['Preference for conservative tuning'],
} as const;

export const ALTERNATIVE_C = {
  decision_id: 'DEC-001',
  label: 'Used EV (compact class)',
  description: 'Second-hand battery electric vehicle.',
  trade_offs: [
    { dimension: 'energy_cost', effect: 'low' },
    { dimension: 'battery_risk', effect: 'medium' },
    { dimension: 'charging_dependency', effect: 'high' },
  ],
  required_assumptions: ['Home or workplace charging available'],
} as const;

export const ALTERNATIVES = [ALTERNATIVE_A, ALTERNATIVE_B, ALTERNATIVE_C] as const;

// ═══════════════════════════════════════════════════════════════════
//                         UNCERTAINTIES (≥1, EXPLICIT)
// ═══════════════════════════════════════════════════════════════════

export const UNCERTAINTY_A = {
  decision_id: 'DEC-001',
  description: 'Long-term maintenance variance across model years.',
  uncertainty_type: 'future_variability',
  impact_range: 'medium',
} as const;

export const UNCERTAINTY_B = {
  decision_id: 'DEC-001',
  description: 'Fuel and energy price volatility over 5-year horizon.',
  uncertainty_type: 'external_dependency',
  impact_range: 'medium',
} as const;

export const UNCERTAINTIES = [UNCERTAINTY_A, UNCERTAINTY_B] as const;

// ═══════════════════════════════════════════════════════════════════
//                         EVIDENCE (SUPPORTING, NOT DECIDING)
// ═══════════════════════════════════════════════════════════════════

export const EVIDENCE_A = {
  decision_id: 'DEC-001',
  source_type: 'public_data',
  reference: 'https://example.org/vehicle-reliability-aggregates',
  validity_period: {
    start: '2021-01-01',
    end: '2025-12-31',
  },
} as const;

export const EVIDENCE = [EVIDENCE_A] as const;

// ═══════════════════════════════════════════════════════════════════
//                         LEGITIMACY CHECK (PRE-LOCK)
// ═══════════════════════════════════════════════════════════════════

export const LEGITIMACY_CHECK_RESPONSE = {
  legitimate: true,
  checks: {
    context_present: true,
    alternatives_exposed: true,
    uncertainties_acknowledged: true,
    scope_defined: true,
    time_defined: true,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════
//                         LOCK (COMMIT)
// ═══════════════════════════════════════════════════════════════════

export const LOCK_RESPONSE = {
  status: 'locked',
  locked_at: '2026-01-15T10:00:00Z',
} as const;

// ═══════════════════════════════════════════════════════════════════
//                         PUBLIC READ-ONLY VIEW
// ═══════════════════════════════════════════════════════════════════

export const PUBLIC_VIEW = {
  title: 'Vehicle Selection (Consumer)',
  scope: 'Individual | EU | 5 years',
  alternatives_count: 3,
  uncertainties_count: 2,
  legibility_score: 0.93,
  post_decision_review_scheduled: '2031-01-15',
  note: 'All clickable to raw structure. No summaries. No recommendations.',
} as const;

// ═══════════════════════════════════════════════════════════════════
//                         POST-DECISION REVIEW (AFTER 5 YEARS)
// ═══════════════════════════════════════════════════════════════════

export const REVIEW_REQUEST = {
  decision_id: 'DEC-001',
  expected_vs_observed: 'Operating costs higher than expected due to fuel price increases.',
  foreseeable_deviation: true,
  learnings: [
    'Energy price volatility had greater impact than maintenance variance.',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════
//                         COMPLETE CASE BUNDLE
// ═══════════════════════════════════════════════════════════════════

export const VOLKSWAGEN_GOLF_CASE = {
  case_id: 'REF-001',
  case_name: 'Volkswagen Golf Consumer Evaluation',
  version: '1.0.0',
  canonical: true,
  
  decision: DECISION_CREATE_REQUEST,
  context: CONTEXT_ATTACH_REQUEST,
  alternatives: ALTERNATIVES,
  uncertainties: UNCERTAINTIES,
  evidence: EVIDENCE,
  legitimacy: LEGITIMACY_CHECK_RESPONSE,
  lock: LOCK_RESPONSE,
  public_view: PUBLIC_VIEW,
  review: REVIEW_REQUEST,
} as const;
