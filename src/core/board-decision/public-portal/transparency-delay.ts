/**
 * TRANSPARENCY DELAY
 * 
 * For sensitive decisions: publication with delay.
 * Delay is visible and timestamped — no silent secrets.
 */

import type { TransparencyDelay } from './types';

/**
 * Valid delay reasons
 */
export const VALID_DELAY_REASONS = [
  'commercial_sensitivity',
  'personnel_matter',
  'ongoing_negotiation',
  'legal_process',
] as const;

/**
 * Maximum delay periods by reason
 */
const MAX_DELAY_MONTHS: Record<TransparencyDelay['delay_reason'], number> = {
  commercial_sensitivity: 24,
  personnel_matter: 36,
  ongoing_negotiation: 12,
  legal_process: 60,
};

/**
 * Create transparency delay
 */
export function createTransparencyDelay(
  decisionId: string,
  decisionDate: string,
  delayMonths: number,
  reason: TransparencyDelay['delay_reason']
): { success: boolean; delay?: TransparencyDelay; error?: string } {
  // Validate delay duration
  const maxDelay = MAX_DELAY_MONTHS[reason];
  if (delayMonths > maxDelay) {
    return {
      success: false,
      error: `Maximum delay for ${reason} is ${maxDelay} months`,
    };
  }
  
  // Calculate publication date
  const decisionDateObj = new Date(decisionDate);
  const publicationDate = new Date(decisionDateObj);
  publicationDate.setMonth(publicationDate.getMonth() + delayMonths);
  
  return {
    success: true,
    delay: {
      decision_id: decisionId,
      delay_months: delayMonths,
      delay_reason: reason,
      decision_date: decisionDate,
      scheduled_publication: publicationDate.toISOString(),
      delay_visible: true, // Always true
    },
  };
}

/**
 * Check if delay period has passed
 */
export function isDelayExpired(delay: TransparencyDelay): boolean {
  return new Date(delay.scheduled_publication) <= new Date();
}

/**
 * Get public disclosure status
 */
export function getDisclosureStatus(delay: TransparencyDelay): {
  status: 'delayed' | 'published' | 'overdue';
  days_remaining?: number;
  days_overdue?: number;
} {
  const now = new Date();
  const publicationDate = new Date(delay.scheduled_publication);
  
  if (now < publicationDate) {
    const daysRemaining = Math.ceil(
      (publicationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      status: 'delayed',
      days_remaining: daysRemaining,
    };
  }
  
  // Check if it should be published
  return {
    status: 'published',
  };
}

/**
 * Format delay for public display
 * The delay itself is never hidden
 */
export function formatDelayForPublic(delay: TransparencyDelay): string {
  const status = getDisclosureStatus(delay);
  
  if (status.status === 'delayed') {
    return `Decision made on ${formatDate(delay.decision_date)}. ` +
           `Scheduled for publication: ${formatDate(delay.scheduled_publication)}. ` +
           `Reason: ${formatReason(delay.delay_reason)}.`;
  }
  
  return `Decision published after ${delay.delay_months} month delay. ` +
         `Original decision date: ${formatDate(delay.decision_date)}.`;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toISOString().split('T')[0];
}

function formatReason(reason: TransparencyDelay['delay_reason']): string {
  const labels: Record<TransparencyDelay['delay_reason'], string> = {
    commercial_sensitivity: 'Commercial sensitivity',
    personnel_matter: 'Personnel matter',
    ongoing_negotiation: 'Ongoing negotiation',
    legal_process: 'Legal process',
  };
  return labels[reason];
}

/**
 * TRANSPARENCY DELAY MASTERPROMPT
 */
export const TRANSPARENCY_DELAY_MASTERPROMPT = `
You manage Transparency Delays.

PRINCIPLE:
Some decisions need delayed publication.
But the delay itself is NEVER hidden.

VALID REASONS:
- Commercial sensitivity (max 24 months)
- Personnel matter (max 36 months)
- Ongoing negotiation (max 12 months)
- Legal process (max 60 months)

WHAT IS VISIBLE DURING DELAY:
- That a decision was made
- When it was made
- When it will be published
- Why it is delayed

WHAT IS NOT VISIBLE:
- The decision content itself

THIS BALANCES:
- Room to maneuver (during delay)
- Future accountability (after publication)

NO SILENT SECRETS:
Every delay is timestamped.
Everyone knows something is coming.

WHEN DELAY EXPIRES:
Publication is automatic.
No one needs to approve.
The system publishes itself.
`;
