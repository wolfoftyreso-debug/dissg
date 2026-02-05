/**
 * INITIAL 20 REFERENCE CASES
 * 
 * Covering the full spectrum:
 * - Everyday (high recognition)
 * - Board (corporate governance)
 * - Public (anonymized policy)
 * - Failed outcomes (critical for trust)
 */

import type { ReferenceCaseSummary, ReferenceCaseCategory } from './types';

/**
 * The Initial 20 Reference Cases
 * Covers entire decision spectrum
 */
export const INITIAL_REFERENCE_CASES: ReferenceCaseSummary[] = [
  // A. EVERYDAY CONSUMER (High Recognition)
  {
    case_id: 'ec-001',
    case_code: 'EC-I-VH01',
    title: 'Vehicle Selection: Compact Car Category',
    category: 'everyday_consumer',
    scope: 'individual',
    time_horizon_years: 5,
    alternatives_count: 4,
    uncertainties_count: 3,
    decision_legibility_score: 0.92,
    outcome: 'mixed',
    was_deviation_foreseeable: true,
  },
  {
    case_id: 'ec-002',
    case_code: 'EC-H-HS01',
    title: 'Housing Decision: Buy vs Rent Analysis',
    category: 'everyday_consumer',
    scope: 'household',
    time_horizon_years: 10,
    alternatives_count: 3,
    uncertainties_count: 4,
    decision_legibility_score: 0.88,
    outcome: 'positive',
    was_deviation_foreseeable: false,
  },
  {
    case_id: 'ec-003',
    case_code: 'EC-H-EN01',
    title: 'Energy Choice: Electric vs Combustion Vehicle',
    category: 'everyday_consumer',
    scope: 'household',
    time_horizon_years: 7,
    alternatives_count: 3,
    uncertainties_count: 5,
    decision_legibility_score: 0.85,
    outcome: 'too_early',
  },
  {
    case_id: 'ec-004',
    case_code: 'EC-I-ED01',
    title: 'Education Investment: Degree Program Selection',
    category: 'everyday_consumer',
    scope: 'individual',
    time_horizon_years: 4,
    alternatives_count: 5,
    uncertainties_count: 4,
    decision_legibility_score: 0.79,
    outcome: 'mixed',
    was_deviation_foreseeable: true,
  },
  {
    case_id: 'ec-005',
    case_code: 'EC-H-RE01',
    title: 'Relocation Decision: City Change for Employment',
    category: 'everyday_consumer',
    scope: 'household',
    time_horizon_years: 5,
    alternatives_count: 3,
    uncertainties_count: 6,
    decision_legibility_score: 0.82,
    outcome: 'positive',
    was_deviation_foreseeable: false,
  },

  // B. BOARD GOVERNANCE
  {
    case_id: 'bg-001',
    case_code: 'BG-O-CA01',
    title: 'Capital Allocation: Expansion vs Dividend',
    category: 'board_governance',
    scope: 'organization',
    time_horizon_years: 3,
    alternatives_count: 4,
    uncertainties_count: 5,
    decision_legibility_score: 0.94,
    outcome: 'mixed',
    was_deviation_foreseeable: true,
  },
  {
    case_id: 'bg-002',
    case_code: 'BG-O-MI01',
    title: 'Maintenance vs Investment: Infrastructure Renewal',
    category: 'board_governance',
    scope: 'organization',
    time_horizon_years: 10,
    alternatives_count: 3,
    uncertainties_count: 4,
    decision_legibility_score: 0.91,
    outcome: 'positive',
    was_deviation_foreseeable: false,
  },
  {
    case_id: 'bg-003',
    case_code: 'BG-O-RR01',
    title: 'Risk Reduction vs Return: Portfolio Rebalancing',
    category: 'board_governance',
    scope: 'organization',
    time_horizon_years: 5,
    alternatives_count: 4,
    uncertainties_count: 6,
    decision_legibility_score: 0.89,
    outcome: 'negative',
    was_deviation_foreseeable: true,
  },
  {
    case_id: 'bg-004',
    case_code: 'BG-O-AC01',
    title: 'Acquisition Assessment: Target Company Evaluation',
    category: 'board_governance',
    scope: 'organization',
    time_horizon_years: 7,
    alternatives_count: 3,
    uncertainties_count: 8,
    decision_legibility_score: 0.86,
    outcome: 'mixed',
    was_deviation_foreseeable: true,
  },
  {
    case_id: 'bg-005',
    case_code: 'BG-O-ST01',
    title: 'Strategic Pivot: Market Segment Transition',
    category: 'board_governance',
    scope: 'organization',
    time_horizon_years: 5,
    alternatives_count: 4,
    uncertainties_count: 7,
    decision_legibility_score: 0.83,
    outcome: 'too_early',
  },

  // C. PUBLIC POLICY (Anonymized)
  {
    case_id: 'pp-001',
    case_code: 'PP-M-CP01',
    title: 'Capacity Planning: Municipal Service Allocation',
    category: 'public_policy',
    scope: 'municipal',
    time_horizon_years: 5,
    alternatives_count: 4,
    uncertainties_count: 5,
    decision_legibility_score: 0.87,
    outcome: 'mixed',
    was_deviation_foreseeable: true,
  },
  {
    case_id: 'pp-002',
    case_code: 'PP-R-BP01',
    title: 'Budget Priority: Regional Infrastructure Investment',
    category: 'public_policy',
    scope: 'regional',
    time_horizon_years: 10,
    alternatives_count: 5,
    uncertainties_count: 6,
    decision_legibility_score: 0.84,
    outcome: 'positive',
    was_deviation_foreseeable: false,
  },
  {
    case_id: 'pp-003',
    case_code: 'PP-M-CR01',
    title: 'Crisis Response: Temporary Capacity Measures',
    category: 'public_policy',
    scope: 'municipal',
    time_horizon_years: 2,
    alternatives_count: 3,
    uncertainties_count: 8,
    decision_legibility_score: 0.78,
    outcome: 'mixed',
    was_deviation_foreseeable: true,
  },
  {
    case_id: 'pp-004',
    case_code: 'PP-R-ED01',
    title: 'Education Reform: Curriculum Restructuring',
    category: 'public_policy',
    scope: 'regional',
    time_horizon_years: 8,
    alternatives_count: 4,
    uncertainties_count: 7,
    decision_legibility_score: 0.81,
    outcome: 'too_early',
  },

  // D. FAILED OUTCOMES (Critical for Trust)
  {
    case_id: 'fo-001',
    case_code: 'FO-O-LE01',
    title: 'Legitimate Decision, Negative Outcome: Market Entry',
    category: 'failed_outcome',
    scope: 'organization',
    time_horizon_years: 3,
    alternatives_count: 4,
    uncertainties_count: 5,
    decision_legibility_score: 0.91,
    outcome: 'negative',
    was_deviation_foreseeable: false,
  },
  {
    case_id: 'fo-002',
    case_code: 'FO-H-IN01',
    title: 'Investment Loss: Asset Class Allocation',
    category: 'failed_outcome',
    scope: 'household',
    time_horizon_years: 5,
    alternatives_count: 3,
    uncertainties_count: 4,
    decision_legibility_score: 0.88,
    outcome: 'negative',
    was_deviation_foreseeable: true,
  },

  // E. IGNORED UNCERTAINTY
  {
    case_id: 'iu-001',
    case_code: 'IU-O-FL01',
    title: 'Flagged Risk Ignored: Supply Chain Dependency',
    category: 'ignored_uncertainty',
    scope: 'organization',
    time_horizon_years: 2,
    alternatives_count: 3,
    uncertainties_count: 6,
    decision_legibility_score: 0.85,
    outcome: 'negative',
    was_deviation_foreseeable: true,
  },
  {
    case_id: 'iu-002',
    case_code: 'IU-M-DP01',
    title: 'Demographic Shift Flagged: Service Planning',
    category: 'ignored_uncertainty',
    scope: 'municipal',
    time_horizon_years: 10,
    alternatives_count: 4,
    uncertainties_count: 5,
    decision_legibility_score: 0.82,
    outcome: 'negative',
    was_deviation_foreseeable: true,
  },

  // F. LEARNING CHANGED
  {
    case_id: 'lc-001',
    case_code: 'LC-O-FR01',
    title: 'Follow-up Revised Understanding: Technology Adoption',
    category: 'learning_changed',
    scope: 'organization',
    time_horizon_years: 3,
    alternatives_count: 4,
    uncertainties_count: 4,
    decision_legibility_score: 0.89,
    outcome: 'mixed',
    was_deviation_foreseeable: false,
  },
  {
    case_id: 'lc-002',
    case_code: 'LC-R-PO01',
    title: 'Policy Iteration: Regulatory Adjustment Post-Review',
    category: 'learning_changed',
    scope: 'regional',
    time_horizon_years: 5,
    alternatives_count: 3,
    uncertainties_count: 5,
    decision_legibility_score: 0.86,
    outcome: 'positive',
    was_deviation_foreseeable: false,
  },
];

/**
 * Get cases by category
 */
export function getCasesByCategory(
  category: ReferenceCaseCategory
): ReferenceCaseSummary[] {
  return INITIAL_REFERENCE_CASES.filter(c => c.category === category);
}

/**
 * Get cases with failed outcomes (critical for trust)
 */
export function getFailedOutcomeCases(): ReferenceCaseSummary[] {
  return INITIAL_REFERENCE_CASES.filter(
    c => c.outcome === 'negative' || c.category === 'failed_outcome'
  );
}

/**
 * Get cases where deviation was foreseeable
 */
export function getForeseeableDeviationCases(): ReferenceCaseSummary[] {
  return INITIAL_REFERENCE_CASES.filter(c => c.was_deviation_foreseeable === true);
}

/**
 * Category distribution
 */
export const CATEGORY_DISTRIBUTION = {
  everyday_consumer: 5,
  board_governance: 5,
  public_policy: 4,
  failed_outcome: 2,
  ignored_uncertainty: 2,
  learning_changed: 2,
  total: 20,
};

/**
 * Why this mix matters
 */
export const MIX_RATIONALE = {
  everyday_consumer: 'High recognition. Everyone can relate.',
  board_governance: 'High stakes. Professional applicability.',
  public_policy: 'Public interest. Anonymized for safety.',
  failed_outcome: 'Critical for trust. Shows system is honest.',
  ignored_uncertainty: 'Shows what happens when warnings are ignored.',
  learning_changed: 'Shows value of follow-up and iteration.',
};
