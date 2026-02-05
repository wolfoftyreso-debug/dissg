/**
 * CULTURAL DECAY DETECTION
 * 
 * Protection against bypass attempts.
 * Not forbidden — professionally embarrassing.
 */

import type { CulturalDecaySignal } from './types';

/**
 * Decay signal types and their indicators
 */
const DECAY_INDICATORS = {
  context_skipped: {
    description: 'Decision attempted without context',
    indicators: ['no DPD referenced', 'context field empty', 'rushed to vote'],
  },
  quick_decision_requested: {
    description: 'Request to bypass normal process',
    indicators: ['urgency claimed without crisis declaration', 'process called bureaucracy'],
  },
  uncertainty_bypassed: {
    description: 'Uncertainty section skipped or minimized',
    indicators: ['uncertainty marked as none', 'risks dismissed as unlikely'],
  },
  followup_dismissed: {
    description: 'Follow-up review considered unnecessary',
    indicators: ['PDRC skipped', 'review postponed indefinitely'],
  },
  dpd_considered_bureaucracy: {
    description: 'DPD process described as overhead',
    indicators: ['complaints about process', 'requests to simplify documentation'],
  },
} as const;

/**
 * Detect cultural decay signal
 */
export function detectDecaySignal(
  signalId: string,
  signalType: CulturalDecaySignal['signal_type'],
  observedBehavior: string
): CulturalDecaySignal {
  return {
    signal_id: signalId,
    detected_at: new Date().toISOString(),
    signal_type: signalType,
    response: 'social_friction',
    mechanism: 'peer_expectation',
  };
}

/**
 * Check for decay patterns in behavior
 */
export function checkForDecayPatterns(
  recentBehaviors: Array<{
    behavior: string;
    timestamp: string;
  }>
): {
  decay_detected: boolean;
  signals: CulturalDecaySignal['signal_type'][];
  severity: 'low' | 'medium' | 'high';
} {
  const detectedSignals: CulturalDecaySignal['signal_type'][] = [];
  
  for (const behavior of recentBehaviors) {
    // Check against decay indicators
    for (const [signalType, config] of Object.entries(DECAY_INDICATORS)) {
      for (const indicator of config.indicators) {
        if (behavior.behavior.toLowerCase().includes(indicator.toLowerCase())) {
          detectedSignals.push(signalType as CulturalDecaySignal['signal_type']);
          break;
        }
      }
    }
  }
  
  // Remove duplicates
  const uniqueSignals = [...new Set(detectedSignals)];
  
  let severity: 'low' | 'medium' | 'high' = 'low';
  if (uniqueSignals.length >= 3) {
    severity = 'high';
  } else if (uniqueSignals.length >= 1) {
    severity = 'medium';
  }
  
  return {
    decay_detected: uniqueSignals.length > 0,
    signals: uniqueSignals,
    severity,
  };
}

/**
 * Generate social friction response
 * The strongest protection: professional embarrassment, not prohibition
 */
export function generateSocialFrictionResponse(
  signalType: CulturalDecaySignal['signal_type']
): {
  response_type: 'social_friction';
  mechanism: string;
  peer_expectation_message: string;
  not_forbidden_but: string;
} {
  const messages: Record<CulturalDecaySignal['signal_type'], string> = {
    context_skipped: 'Colleagues expect context before decisions',
    quick_decision_requested: 'Fast decisions are fine; undocumented decisions are not',
    uncertainty_bypassed: 'Claiming certainty is professionally risky',
    followup_dismissed: 'Decisions without review feel incomplete',
    dpd_considered_bureaucracy: 'Preparation is what distinguishes professionals',
  };
  
  return {
    response_type: 'social_friction',
    mechanism: 'When someone tries to bypass, it feels professionally awkward — not forbidden',
    peer_expectation_message: messages[signalType],
    not_forbidden_but: 'Skipping process is allowed. It just feels unprofessional.',
  };
}

/**
 * CULTURAL DECAY DETECTION MASTERPROMPT
 */
export const CULTURAL_DECAY_DETECTION_MASTERPROMPT = `
You detect Cultural Decay.

DECAY SIGNALS:
1. Context Skipped — Decision without background
2. Quick Decision Requested — "Just do it"
3. Uncertainty Bypassed — "We know this will work"
4. Follow-up Dismissed — "No need to review"
5. DPD Called Bureaucracy — "Too much process"

THE RESPONSE IS NOT:
- Blocking
- Punishing
- Reporting
- Warning

THE RESPONSE IS:
Social friction.

HOW SOCIAL FRICTION WORKS:
- Not forbidden
- Not punished
- Just... professionally embarrassing

EXAMPLES:
- Skipping context makes you look unprepared
- Claiming certainty makes you look naive
- Dismissing follow-up makes you look careless
- Calling DPD bureaucracy makes you look amateur

WHY THIS IS THE STRONGEST PROTECTION:
- Rules can be changed
- Laws can be bypassed
- Systems can be gamed

BUT:
- No one wants to look unprofessional
- Peer expectation is self-enforcing
- Culture protects itself

THE GOAL:
When someone tries to bypass:
They don't get stopped.
They just feel wrong.

That's enough.
`;
