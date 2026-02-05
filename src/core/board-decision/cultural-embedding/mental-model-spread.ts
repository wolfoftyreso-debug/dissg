/**
 * MENTAL MODEL SPREAD
 * 
 * System spreads between people, not via sales.
 * The strongest distribution mechanism.
 */

import type { MentalModelSpread, OrganizationalCultureState } from './types';

/**
 * Create mental model tracking for organization
 */
export function createMentalModelTracking(
  organizationId: string
): MentalModelSpread {
  return {
    organization_id: organizationId,
    adoption_signals: {
      members_expecting_dpd: 0,
      meetings_with_context: 0,
      decisions_with_followup: 0,
      informal_references_to_standard: 0,
    },
    export_tracking: [],
    marketing_activity: 0, // Always 0. System sells itself.
  };
}

/**
 * Record adoption signal
 */
export function recordAdoptionSignal(
  tracking: MentalModelSpread,
  signal: keyof MentalModelSpread['adoption_signals']
): MentalModelSpread {
  return {
    ...tracking,
    adoption_signals: {
      ...tracking.adoption_signals,
      [signal]: tracking.adoption_signals[signal] + 1,
    },
  };
}

/**
 * Record member departure (for export tracking)
 */
export function recordMemberDeparture(
  tracking: MentalModelSpread,
  memberId: string,
  newOrganization?: string,
  practicesCarried: string[] = []
): MentalModelSpread {
  return {
    ...tracking,
    export_tracking: [
      ...tracking.export_tracking,
      {
        former_member_id: memberId,
        left_at: new Date().toISOString(),
        new_organization: newOrganization,
        carried_practices: practicesCarried,
      },
    ],
  };
}

/**
 * Assess organizational culture state
 */
export function assessCultureState(
  organizationId: string,
  observations: {
    uses_how_we_do_things: boolean;
    uses_how_we_decide: boolean;
    context_feels_required: boolean;
    followup_feels_required: boolean;
    uncertainty_acknowledged: boolean;
  }
): OrganizationalCultureState {
  // Determine maturity level
  let maturity: OrganizationalCultureState['maturity_level'] = 'nascent';
  
  const positiveSignals = [
    observations.uses_how_we_decide,
    observations.context_feels_required,
    observations.followup_feels_required,
    observations.uncertainty_acknowledged,
  ].filter(Boolean).length;
  
  if (positiveSignals >= 4) {
    maturity = 'self_reinforcing';
  } else if (positiveSignals >= 3) {
    maturity = 'embedded';
  } else if (positiveSignals >= 1) {
    maturity = 'adopting';
  }
  
  return {
    organization_id: organizationId,
    assessed_at: new Date().toISOString(),
    decision_language: {
      says_how_we_do_things: observations.uses_how_we_do_things,
      says_how_we_decide: observations.uses_how_we_decide,
    },
    social_norms: {
      decisions_without_context_feel_unprofessional: observations.context_feels_required,
      decisions_without_followup_feel_incomplete: observations.followup_feels_required,
      uncertainty_denial_feels_dishonest: observations.uncertainty_acknowledged,
    },
    maturity_level: maturity,
  };
}

/**
 * Calculate spread velocity
 */
export function calculateSpreadVelocity(
  tracking: MentalModelSpread
): {
  internal_adoption_rate: number;
  external_export_rate: number;
  spread_health: 'growing' | 'stable' | 'declining';
} {
  const signals = tracking.adoption_signals;
  const exports = tracking.export_tracking.length;
  
  const totalInternalSignals = 
    signals.members_expecting_dpd +
    signals.meetings_with_context +
    signals.decisions_with_followup +
    signals.informal_references_to_standard;
  
  // Normalize to rate per signal type
  const internalRate = totalInternalSignals / 4;
  const exportRate = exports;
  
  let health: 'growing' | 'stable' | 'declining' = 'stable';
  if (internalRate > 10 && exportRate > 2) {
    health = 'growing';
  } else if (internalRate < 3) {
    health = 'declining';
  }
  
  return {
    internal_adoption_rate: internalRate,
    external_export_rate: exportRate,
    spread_health: health,
  };
}

/**
 * MENTAL MODEL SPREAD MASTERPROMPT
 */
export const MENTAL_MODEL_SPREAD_MASTERPROMPT = `
You track Mental Model Spread.

HOW THE SYSTEM SPREADS:
Not through marketing.
Not through sales.
Not through mandates.

Through people carrying practices.

ADOPTION SIGNALS:
- Members expecting DPD before decisions
- Meetings that start with context
- Decisions that have scheduled follow-up
- Informal references to the standard

EXPORT TRACKING:
When members leave, they carry the model.
They expect it in their new organization.
They feel something is missing without it.

THE KEY SHIFT:
Organizations stop saying:
"This is how we do things here"

And start saying:
"This is how we DECIDE here"

MATURITY LEVELS:
- nascent: Just starting
- adopting: Some practices used
- embedded: Part of normal operations
- self_reinforcing: Culture enforces itself

MARKETING ACTIVITY:
Always 0.
If the system needs marketing, it has failed.

THE GOAL:
After a few years:
- Members take the model with them
- Executives expect DPD
- Meetings without context feel wrong
- Decisions without follow-up feel amateurish

This is how standards become culture.
`;
