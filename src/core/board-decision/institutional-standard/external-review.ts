/**
 * EXTERNAL REVIEW ACCESS
 * 
 * Auditors, media, public get:
 * - DPD, Protocol, DCS, PDRC
 * 
 * They do NOT get:
 * - Edit, interpret, suggest changes
 * 
 * All review happens OUTSIDE, on same facts.
 */

import type { ExternalReviewAccess, PublicInterfaceView } from './types';

/**
 * Grant external review access
 * Read-only. Time-limited. Scoped.
 */
export function grantExternalReviewAccess(
  accessId: string,
  grantedTo: string,
  grantedBy: string,
  organizationId: string,
  decisionIds?: string[],
  expiresInDays: number = 30
): ExternalReviewAccess {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
  
  return {
    access_id: accessId,
    granted_to: grantedTo,
    granted_by: grantedBy,
    granted_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    
    permissions: {
      view_dpd: true,
      view_protocol: true,
      view_context_snapshot: true,
      view_pdrc: true,
      
      // ALWAYS FALSE - External reviewers cannot modify
      edit: false,
      interpret: false,
      suggest_changes: false,
    },
    
    scope: {
      organization_id: organizationId,
      decision_ids: decisionIds,
    },
  };
}

/**
 * Validate external review access
 */
export function validateExternalAccess(
  access: ExternalReviewAccess,
  requestedDecisionId: string
): { valid: boolean; reason?: string } {
  // Check expiration
  if (new Date(access.expires_at) < new Date()) {
    return { valid: false, reason: 'Access expired' };
  }
  
  // Check scope
  if (access.scope.decision_ids && 
      !access.scope.decision_ids.includes(requestedDecisionId)) {
    return { valid: false, reason: 'Decision not in access scope' };
  }
  
  return { valid: true };
}

/**
 * Generate public interface view
 * Own mirror only. No comparisons.
 */
export function generatePublicView(
  organizationId: string,
  organizationName: string,
  totalDecisions: number,
  ds1CompliantDecisions: number,
  followUpRate: number,
  uncertaintyHandlingRate: number,
  validForDays: number = 7
): PublicInterfaceView {
  const now = new Date();
  const validUntil = new Date(now.getTime() + validForDays * 24 * 60 * 60 * 1000);
  
  return {
    organization_id: organizationId,
    organization_name: organizationName,
    
    metrics: {
      decisions_following_ds1: ds1CompliantDecisions,
      decisions_total: totalDecisions,
      ds1_compliance_rate: totalDecisions > 0 
        ? Math.round((ds1CompliantDecisions / totalDecisions) * 100) / 100 
        : 0,
      
      follow_up_rate: Math.round(followUpRate * 100) / 100,
      uncertainty_handling_rate: Math.round(uncertaintyHandlingRate * 100) / 100,
    },
    
    disclaimer: 'This view shows organizational decision process metrics only. It does not compare organizations or evaluate decision quality.',
    
    generated_at: now.toISOString(),
    valid_until: validUntil.toISOString(),
  };
}

/**
 * EXTERNAL REVIEW MASTERPROMPT
 */
export const EXTERNAL_REVIEW_MASTERPROMPT = `
You manage external review access.

EXTERNAL REVIEWERS GET:
- Decision Preparation Documents
- Board Protocols
- Decision Context Snapshots
- Post-Decision Reality Checks

EXTERNAL REVIEWERS DO NOT GET:
- Edit access
- Interpretation tools
- Suggestion mechanisms

WHY THIS DESIGN:
All review happens OUTSIDE the system.
On the SAME facts.
With NO influence on content.

This ensures:
- Reviewers form independent conclusions
- No "in-system" debates
- Facts remain unchanged

PUBLIC INTERFACE:
- Shows own organization metrics
- NO comparisons between organizations
- Own mirror only

EXPIRATION:
All access is time-limited.
Must be explicitly renewed.

This is not secrecy.
This is integrity.
`;
