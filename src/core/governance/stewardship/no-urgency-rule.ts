/**
 * NO URGENCY RULE
 * 
 * No change may be motivated by:
 * - "The market demands"
 * - "Competitors are doing"
 * - "Technology enables"
 * 
 * The ONLY valid motivation:
 * "This increases decision legibility without reducing uncertainty visibility."
 */

import type { ChangeRequest } from './types';

/**
 * Forbidden Justifications
 */
export const FORBIDDEN_JUSTIFICATIONS = [
  'market demands',
  'market requires',
  'competitors',
  'competitive pressure',
  'industry standard',
  'technology enables',
  'technology allows',
  'users expect',
  'users want',
  'growth requires',
  'scale requires',
  'investors',
  'funding',
  'revenue',
  'conversion',
  'engagement',
  'retention',
  'viral',
  'trending',
  'urgent',
  'emergency',
  'immediately',
  'asap',
  'deadline',
];

/**
 * The Only Valid Motivation
 */
export const VALID_MOTIVATION = 
  'This increases decision legibility without reducing uncertainty visibility.';

/**
 * Check if justification contains forbidden terms
 */
export function checkNoUrgencyRule(
  justification: string
): { passes: boolean; violations: string[] } {
  const violations: string[] = [];
  const lower = justification.toLowerCase();
  
  for (const forbidden of FORBIDDEN_JUSTIFICATIONS) {
    if (lower.includes(forbidden)) {
      violations.push(`Contains forbidden term: "${forbidden}"`);
    }
  }
  
  return { passes: violations.length === 0, violations };
}

/**
 * Validate change motivation
 */
export function validateMotivation(
  request: ChangeRequest
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for forbidden justifications
  const urgencyCheck = checkNoUrgencyRule(request.rationale);
  if (!urgencyCheck.passes) {
    issues.push(...urgencyCheck.violations);
  }
  
  // Check if valid motivation is present
  if (!request.increases_decision_legibility) {
    issues.push('Does not increase decision legibility');
  }
  
  if (!request.maintains_uncertainty_visibility) {
    issues.push('Does not maintain uncertainty visibility');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Examples of Invalid vs Valid Motivations
 */
export const MOTIVATION_EXAMPLES = {
  invalid: [
    {
      motivation: 'The market demands faster onboarding',
      why_invalid: 'Market pressure is not a valid motivation',
    },
    {
      motivation: 'Competitors show simplified dashboards',
      why_invalid: 'Competitive pressure is not a valid motivation',
    },
    {
      motivation: 'Users expect AI recommendations',
      why_invalid: 'User expectations do not override system principles',
    },
    {
      motivation: 'We need this for Q3 investor presentation',
      why_invalid: 'Investor/funding pressure is not valid',
    },
  ],
  valid: [
    {
      motivation: 'Adding explicit uncertainty bands increases decision legibility',
      why_valid: 'Directly improves core mission without hiding complexity',
    },
    {
      motivation: 'Restructuring data hierarchy makes comparisons more transparent',
      why_valid: 'Improves understanding while maintaining all information',
    },
    {
      motivation: 'Adding source lineage display keeps uncertainty visible during analysis',
      why_valid: 'Enhances both legibility and uncertainty visibility',
    },
  ],
};

/**
 * Rejection templates
 */
export const REJECTION_TEMPLATES = {
  market_pressure: 
    'Market pressure is not a valid motivation. The system serves truth, not markets.',
  
  competitive_pressure:
    'Competitive pressure is not a valid motivation. If competitors simplify away complexity, that is their failure to protect.',
  
  user_expectations:
    'User expectations do not override system principles. The system teaches users, not follows them.',
  
  investor_pressure:
    'Investor/funding pressure is not a valid motivation. Economic interests cannot influence semantic structure.',
  
  urgency:
    'Urgency is not a valid motivation. All changes require latency. This is non-negotiable.',
};

/**
 * NO URGENCY MASTERPROMPT
 */
export const NO_URGENCY_MASTERPROMPT = `
You enforce the NO URGENCY RULE.

NO CHANGE MAY BE MOTIVATED BY:
- "The market demands"
- "Competitors are doing"
- "Technology enables"
- "Users expect"
- "Investors require"
- "This is urgent"

THE ONLY VALID MOTIVATION:
"This increases decision legibility without reducing uncertainty visibility."

FORBIDDEN TERMS IN JUSTIFICATIONS:
- market, competitive, industry standard
- users want/expect
- growth, scale, revenue
- conversion, engagement
- urgent, emergency, asap
- deadline, immediately

If a proposal contains any of these:
→ AUTOMATIC REJECTION

The system serves truth.
The system does not serve markets, competitors, users, or investors.

No exception. No urgency. No pressure.
`;
