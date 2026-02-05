/**
 * CHANGE LATENCY
 * 
 * All changes to core have:
 * - Delay
 * - Public preview
 * - Backward compatibility requirement
 * 
 * "This change takes effect in 18 months."
 * This makes capture impractical.
 */

import type { ChangeRequest } from './types';

/**
 * Minimum latency periods
 */
export const CHANGE_LATENCY = {
  ontology: 18,           // months
  semantic_definitions: 18,
  decision_standards: 12,
  legitimacy_rules: 12,
  methodology: 12,
  interface: 3,           // Less critical
  infrastructure: 0,      // Can be immediate (no semantic impact)
};

/**
 * Preview requirements
 */
export const PREVIEW_REQUIREMENTS = {
  ontology: {
    public_preview_months: 12,
    comment_period_months: 6,
    requires_external_review: true,
  },
  semantic_definitions: {
    public_preview_months: 12,
    comment_period_months: 6,
    requires_external_review: true,
  },
  decision_standards: {
    public_preview_months: 6,
    comment_period_months: 3,
    requires_external_review: true,
  },
  legitimacy_rules: {
    public_preview_months: 6,
    comment_period_months: 3,
    requires_external_review: true,
  },
  methodology: {
    public_preview_months: 6,
    comment_period_months: 3,
    requires_external_review: false,
  },
  interface: {
    public_preview_months: 1,
    comment_period_months: 0,
    requires_external_review: false,
  },
  infrastructure: {
    public_preview_months: 0,
    comment_period_months: 0,
    requires_external_review: false,
  },
};

/**
 * Create a change request with proper latency
 */
export function createChangeRequest(params: {
  component: ChangeRequest['target_component'];
  proposedChange: string;
  rationale: string;
  proposedBy: ChangeRequest['proposed_by'];
  increasesDecisionLegibility: boolean;
  maintainsUncertaintyVisibility: boolean;
}): ChangeRequest {
  const now = new Date();
  const latencyMonths = CHANGE_LATENCY[params.component] || 18;
  const _previewReq = PREVIEW_REQUIREMENTS[params.component];
  
  // Calculate dates
  const effectiveDate = new Date(now);
  effectiveDate.setMonth(effectiveDate.getMonth() + latencyMonths);
  
  const previewDate = new Date(now);
  // Preview starts now, ends before effective date
  
  return {
    id: crypto.randomUUID(),
    target_component: params.component,
    proposed_change: params.proposedChange,
    rationale: params.rationale,
    proposed_by: params.proposedBy,
    proposed_at: now.toISOString(),
    
    passes_no_urgency_rule: true, // Must be validated separately
    
    increases_decision_legibility: params.increasesDecisionLegibility,
    maintains_uncertainty_visibility: params.maintainsUncertaintyVisibility,
    
    effective_date: effectiveDate.toISOString(),
    preview_start_date: previewDate.toISOString(),
    
    is_backward_compatible: true, // Must be validated
    
    status: 'proposed',
  };
}

/**
 * Validate change request latency
 */
export function validateLatency(
  request: ChangeRequest
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  const proposedAt = new Date(request.proposed_at);
  const effectiveAt = new Date(request.effective_date);
  const latencyMonths = (effectiveAt.getTime() - proposedAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  const requiredLatency = CHANGE_LATENCY[request.target_component] || 18;
  
  if (latencyMonths < requiredLatency) {
    issues.push(
      `Latency ${Math.round(latencyMonths)} months is less than required ${requiredLatency} months`
    );
  }
  
  // Check motivations
  if (!request.increases_decision_legibility) {
    issues.push('Change does not increase decision legibility');
  }
  
  if (!request.maintains_uncertainty_visibility) {
    issues.push('Change does not maintain uncertainty visibility');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * WHY LATENCY MATTERS
 */
export const LATENCY_RATIONALE = {
  prevents_capture: 'No actor can make quick changes for short-term gain',
  enables_review: 'Community has time to identify problems',
  ensures_backward_compat: 'Downstream systems have time to adapt',
  reduces_urgency_pressure: 'Cannot use "emergency" as justification',
};

/**
 * LATENCY MASTERPROMPT
 */
export const LATENCY_MASTERPROMPT = `
You enforce CHANGE LATENCY.

ALL CORE CHANGES HAVE:
1. Mandatory delay (12-18 months)
2. Public preview period
3. Backward compatibility requirement

LATENCY BY COMPONENT:
- Ontology: 18 months
- Semantic definitions: 18 months
- Decision standards: 12 months
- Legitimacy rules: 12 months
- Methodology: 12 months
- Interface: 3 months
- Infrastructure: 0 (no semantic impact)

"This change takes effect in 18 months."

This makes capture IMPRACTICAL.

No urgency can bypass this.
No emergency justifies exceptions.
No market pressure accelerates timelines.

The only valid motivation for change:
"This increases decision legibility without reducing uncertainty visibility."
`;
