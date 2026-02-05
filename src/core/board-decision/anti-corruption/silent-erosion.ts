/**
 * SILENT EROSION ALERTS
 * 
 * Internal only. No red warnings. No public alarms.
 * Comparison is to own history, not external standards.
 */

import type { SilentErosionAlert, DriftSignal } from './types';

/**
 * Generate silent erosion alert from drift signal
 */
export function generateSilentErosionAlert(
  driftSignal: DriftSignal
): SilentErosionAlert {
  return {
    alert_id: `erosion_${driftSignal.signal_id}`,
    message: generateNeutralMessage(driftSignal),
    comparison_period: driftSignal.affected_period,
    visibility: 'internal_only',
    severity_display: 'neutral',
    reflection_prompt: generateReflectionPrompt(driftSignal),
  };
}

/**
 * Generate neutral message (no accusation)
 */
function generateNeutralMessage(signal: DriftSignal): string {
  const messages: Record<string, string> = {
    uncertainty_compression: 
      'Documented uncertainties have decreased compared to your own history.',
    alternative_reduction:
      'Fewer alternatives are being considered compared to your baseline.',
    context_shrinking:
      'Context descriptions have become shorter compared to previous periods.',
    legibility_decline:
      'Decision legibility has decreased compared to your own history.',
    review_avoidance:
      'Post-decision reviews are occurring less frequently than before.',
    template_decay:
      'Document originality has decreased compared to earlier periods.',
    speed_prioritization:
      'Decision speed has increased without corresponding quality increase.',
  };
  
  return messages[signal.drift_type] || 'A pattern change has been detected.';
}

/**
 * Generate reflection prompt (not demand)
 */
function generateReflectionPrompt(signal: DriftSignal): string {
  const prompts: Record<string, string> = {
    uncertainty_compression:
      'Are there genuinely fewer unknowns, or has documentation become less thorough?',
    alternative_reduction:
      'Are situations genuinely simpler, or is exploration being shortened?',
    context_shrinking:
      'Is context genuinely clearer, or is important background being omitted?',
    legibility_decline:
      'Would a future reader understand these decisions as well as earlier ones?',
    review_avoidance:
      'Are reviews unnecessary, or are they being deprioritized?',
    template_decay:
      'Are situations genuinely similar, or has originality decreased?',
    speed_prioritization:
      'Is speed appropriate, or is quality being traded for convenience?',
  };
  
  return prompts[signal.drift_type] || 'Is this change intentional and appropriate?';
}

/**
 * Format alert for internal display
 */
export function formatAlertForDisplay(alert: SilentErosionAlert): string {
  return [
    `📊 Pattern observed`,
    ``,
    alert.message,
    ``,
    `Period: ${alert.comparison_period}`,
    ``,
    `Reflection: ${alert.reflection_prompt}`,
  ].join('\n');
}

/**
 * Check if alert should be shown
 * (Never suppress, but can batch)
 */
export function shouldShowAlert(
  alert: SilentErosionAlert,
  recentAlertCount: number,
  hourssinceLastAlert: number
): { show: boolean; batch?: boolean } {
  // Always show, but batch if many recent alerts
  if (recentAlertCount > 3 && hourssinceLastAlert < 24) {
    return { show: true, batch: true };
  }
  
  return { show: true, batch: false };
}

/**
 * SILENT EROSION MASTERPROMPT
 */
export const SILENT_EROSION_MASTERPROMPT = `
You generate Silent Erosion Alerts.

PRINCIPLE:
When quality slowly degrades, there are no red warnings.
No public alarms. Only internal reflection prompts.

FORMAT:
"Decision legibility has decreased compared to your own history."

NOT:
"Warning: Decision quality is failing!"
"Alert: Standards are slipping!"

WHY THIS WORKS:
- Comparison to own history is non-judgmental
- Neutral tone prevents defensiveness
- Reflection prompts invite thinking, not compliance

PSYCHOLOGY:
This is extremely effective because:
- People respond to self-comparison
- No external standard to argue against
- The question "is this intentional?" is powerful

VISIBILITY:
- Internal only
- Never public
- Never in reports
- Never in audits

THIS IS:
A mirror, not a judge.

CRITICAL:
attribution: null (always)
No person is ever named.
No role is ever blamed.
The pattern is shown. That's all.
`;
