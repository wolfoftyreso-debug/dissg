/**
 * ECONOMIC FIREWALL
 * 
 * Revenue may NEVER come from:
 * - Recommendations
 * - Ranking
 * - Sponsorship
 * - Affiliate
 * - Outcome-based compensation
 * 
 * Revenue may ONLY come from:
 * - Infrastructure access
 * - SLA
 * - Private mirrors
 * - Integration costs
 * 
 * Truth can never be incentive-affected.
 */

import type { 
  ForbiddenRevenueSource, 
  AllowedRevenueSource, 
  EconomicFirewallStatus 
} from './types';

/**
 * Forbidden Revenue Sources
 */
export const FORBIDDEN_REVENUE: ForbiddenRevenueSource[] = [
  'recommendations',
  'ranking',
  'sponsorship',
  'affiliate',
  'outcome_based_compensation',
  'data_selling',
  'behavioral_targeting',
];

/**
 * Why each is forbidden
 */
export const FORBIDDEN_RATIONALE: Record<ForbiddenRevenueSource, string> = {
  recommendations: 'Creates incentive to guide users toward certain conclusions',
  ranking: 'Creates incentive to favor some entities over others',
  sponsorship: 'Creates incentive to portray sponsors favorably',
  affiliate: 'Creates incentive to drive specific actions',
  outcome_based_compensation: 'Creates incentive to optimize for outcomes over truth',
  data_selling: 'Creates incentive to collect data beyond what truth requires',
  behavioral_targeting: 'Creates incentive to manipulate rather than inform',
};

/**
 * Allowed Revenue Sources
 */
export const ALLOWED_REVENUE: AllowedRevenueSource[] = [
  'infrastructure_access',
  'sla_agreements',
  'private_mirrors',
  'integration_costs',
  'api_licensing',
  'enterprise_support',
];

/**
 * Why each is allowed
 */
export const ALLOWED_RATIONALE: Record<AllowedRevenueSource, string> = {
  infrastructure_access: 'Payment for access does not affect what is accessed',
  sla_agreements: 'Availability commitments do not affect content',
  private_mirrors: 'Private copies do not change the source',
  integration_costs: 'Technical work does not affect semantics',
  api_licensing: 'Access tiering does not affect truth content',
  enterprise_support: 'Help using system does not change system',
};

/**
 * Check if revenue source is allowed
 */
export function isRevenueAllowed(
  source: string
): { allowed: boolean; reason: string } {
  if (ALLOWED_REVENUE.includes(source as AllowedRevenueSource)) {
    return { 
      allowed: true, 
      reason: ALLOWED_RATIONALE[source as AllowedRevenueSource] 
    };
  }
  
  if (FORBIDDEN_REVENUE.includes(source as ForbiddenRevenueSource)) {
    return { 
      allowed: false, 
      reason: FORBIDDEN_RATIONALE[source as ForbiddenRevenueSource] 
    };
  }
  
  // Unknown sources are forbidden by default
  return { 
    allowed: false, 
    reason: 'Unknown revenue source. Must be explicitly allowed.' 
  };
}

/**
 * Audit revenue sources
 */
export function auditRevenueSources(
  sources: string[]
): EconomicFirewallStatus {
  const allowed: AllowedRevenueSource[] = [];
  const violations: ForbiddenRevenueSource[] = [];
  
  for (const source of sources) {
    const check = isRevenueAllowed(source);
    if (check.allowed) {
      allowed.push(source as AllowedRevenueSource);
    } else {
      violations.push(source as ForbiddenRevenueSource);
    }
  }
  
  return {
    all_revenue_compliant: violations.length === 0,
    revenue_sources: allowed,
    violations,
    last_audit: new Date().toISOString(),
  };
}

/**
 * The Core Principle
 */
export const ECONOMIC_FIREWALL_PRINCIPLE = 
  'Truth can never be incentive-affected.';

/**
 * ECONOMIC FIREWALL MASTERPROMPT
 */
export const ECONOMIC_FIREWALL_MASTERPROMPT = `
You enforce the ECONOMIC FIREWALL.

CORE PRINCIPLE:
Truth can never be incentive-affected.

FORBIDDEN REVENUE SOURCES:
- Recommendations (guides users toward conclusions)
- Ranking (favors some entities)
- Sponsorship (portrays sponsors favorably)
- Affiliate (drives specific actions)
- Outcome-based compensation (optimizes for outcomes over truth)
- Data selling (collects beyond what truth requires)
- Behavioral targeting (manipulates rather than informs)

ALLOWED REVENUE SOURCES:
- Infrastructure access (doesn't affect content)
- SLA agreements (availability, not content)
- Private mirrors (copies, not source)
- Integration costs (technical, not semantic)
- API licensing (access tiers, not truth tiers)
- Enterprise support (usage help, not content change)

IF A REVENUE SOURCE IS NOT EXPLICITLY ALLOWED:
→ It is FORBIDDEN by default

The system is funded by access to infrastructure.
The system is NEVER funded by influence over content.
`;
