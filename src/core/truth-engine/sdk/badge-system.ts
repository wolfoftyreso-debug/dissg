/**
 * GDG BADGE SYSTEM
 * 
 * No marketing, just signal.
 * Badges are earned, not given.
 */

import { validateGDG, type GDGValidationResult, type GDGDecisionInput } from '../standards/global-decision-grammar';

/**
 * BADGE LEVELS
 */
export type BadgeLevel = 'compliant' | 'partial' | 'non_compliant' | 'pending';

/**
 * BADGE DEFINITION
 */
export interface GDGBadge {
  level: BadgeLevel;
  version: '1.0';
  issued_at: string;
  expires_at: string;
  decision_id: string;
  validation_hash: string;
  
  // What was validated
  scope_valid: boolean;
  nodes_valid: boolean;
  no_recommendations: boolean;
  limitations_present: boolean;
  confidence_present: boolean;
  
  // Public display
  display_text: string;
  display_icon: '✅' | '⚠️' | '❌' | '⏳';
}

/**
 * BADGE REQUIREMENTS (STRICT)
 */
export const BADGE_REQUIREMENTS = {
  compliant: {
    description: 'Full GDG v1.0 compliance',
    requirements: [
      'Validator must pass (100% critical checks)',
      'Public scope & limitations',
      'No hidden conclusions',
      'All nodes have valid answer types',
      'Confidence summary present',
    ],
    validity_days: 30,
  },
  partial: {
    description: 'Partial compliance with warnings',
    requirements: [
      'No critical failures',
      'At least 70% compliance score',
      'Major warnings documented',
    ],
    validity_days: 14,
  },
  non_compliant: {
    description: 'Does not meet GDG standards',
    requirements: [
      'One or more critical failures',
      'Forbidden patterns detected',
      'Missing required elements',
    ],
    validity_days: 0,
  },
} as const;

/**
 * GENERATE VALIDATION HASH
 */
function generateValidationHash(result: GDGValidationResult): string {
  const content = JSON.stringify({
    valid: result.valid,
    score: result.compliance_score,
    checks: result.passed.length + result.failed.length,
    timestamp: result.timestamp,
  });
  
  // Simple hash for demo (in production, use crypto)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `gdg_${Math.abs(hash).toString(36)}`;
}

/**
 * ISSUE BADGE
 */
export function issueBadge(input: GDGDecisionInput): GDGBadge {
  const result = validateGDG(input);
  const now = new Date();
  
  let level: BadgeLevel;
  let display_icon: GDGBadge['display_icon'];
  let display_text: string;
  let validity_days: number;
  
  if (result.valid && result.compliance_score >= 90) {
    level = 'compliant';
    display_icon = '✅';
    display_text = 'GDG v1.0 — Compliant';
    validity_days = BADGE_REQUIREMENTS.compliant.validity_days;
  } else if (result.compliance_score >= 70) {
    level = 'partial';
    display_icon = '⚠️';
    display_text = 'GDG v1.0 — Partial';
    validity_days = BADGE_REQUIREMENTS.partial.validity_days;
  } else {
    level = 'non_compliant';
    display_icon = '❌';
    display_text = 'Not GDG Compliant';
    validity_days = BADGE_REQUIREMENTS.non_compliant.validity_days;
  }
  
  const expires_at = new Date(now.getTime() + validity_days * 24 * 60 * 60 * 1000);
  
  return {
    level,
    version: '1.0',
    issued_at: now.toISOString(),
    expires_at: expires_at.toISOString(),
    decision_id: input.decision_id,
    validation_hash: generateValidationHash(result),
    
    scope_valid: result.passed.some(c => c.check_id.includes('scope')),
    nodes_valid: result.passed.some(c => c.check_id.includes('nodes')),
    no_recommendations: result.passed.some(c => c.check_id === 'no_recommendation'),
    limitations_present: result.passed.some(c => c.check_id === 'limitations_present'),
    confidence_present: result.passed.some(c => c.check_id === 'confidence_present'),
    
    display_text,
    display_icon,
  };
}

/**
 * VERIFY BADGE (check if still valid)
 */
export function verifyBadge(badge: GDGBadge): {
  valid: boolean;
  reason?: string;
} {
  const now = new Date();
  const expires = new Date(badge.expires_at);
  
  if (now > expires) {
    return { valid: false, reason: 'Badge expired' };
  }
  
  if (badge.level === 'non_compliant') {
    return { valid: false, reason: 'Badge indicates non-compliance' };
  }
  
  return { valid: true };
}

/**
 * BADGE DISPLAY COMPONENT DATA
 */
export function getBadgeDisplayData(badge: GDGBadge) {
  const colors = {
    compliant: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    partial: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    non_compliant: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    pending: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
  };
  
  return {
    ...badge,
    colors: colors[badge.level],
    formatted_issued: new Date(badge.issued_at).toLocaleDateString(),
    formatted_expires: new Date(badge.expires_at).toLocaleDateString(),
  };
}
