/**
 * RESPONSIBILITY UX WEIGHT
 * 
 * When gravity is high:
 * - Colors dampen
 * - Tempo slows
 * - Scroll is forced
 * - Confirmations are required
 * 
 * No text says "Be careful" — the system FEELS heavy.
 */

import type { ResponsibilityUX, GravityResult } from './types';

/**
 * Forbidden phrases in responsibility UI
 * We never use moral/warning language
 */
export const FORBIDDEN_PHRASES = [
  'be careful',
  'warning',
  'danger',
  'caution',
  'think twice',
  'are you sure',
  'this is risky',
  'you should reconsider',
  'expert advice',
  'recommended',
  'suggested',
  'best practice',
];

/**
 * Calculate UX weight from gravity
 */
export function calculateUXWeight(gravity: GravityResult): ResponsibilityUX {
  const numericGravity = gravity.decision_gravity;
  
  // Color saturation: 100 (full) for trivial, 30 (muted) for extreme
  const colorSaturation = Math.max(30, 100 - (numericGravity * 70));
  
  // Tempo multiplier: 1.0 (normal) for trivial, 0.4 (slow) for extreme
  const tempoMultiplier = Math.max(0.4, 1 - (numericGravity * 0.6));
  
  // Forced scroll for high gravity and above
  const forcedScroll = gravity.class === 'high' || 
                       gravity.class === 'critical' || 
                       gravity.class === 'extreme';
  
  // Confirmation requirements
  const confirmationRequired = gravity.class !== 'trivial' && gravity.class !== 'low';
  const doubleConfirmationRequired = gravity.class === 'critical' || gravity.class === 'extreme';
  
  // Tone
  let tone: ResponsibilityUX['tone'] = 'neutral';
  if (gravity.class === 'high' || gravity.class === 'critical') {
    tone = 'measured';
  } else if (gravity.class === 'extreme') {
    tone = 'grave';
  }
  
  return {
    color_saturation: Math.round(colorSaturation),
    tempo_multiplier: Math.round(tempoMultiplier * 100) / 100,
    forced_scroll: forcedScroll,
    confirmation_required: confirmationRequired,
    double_confirmation_required: doubleConfirmationRequired,
    tone,
    forbidden_phrases: FORBIDDEN_PHRASES,
  };
}

/**
 * Get CSS variables for gravity-based styling
 */
export function getGravityCSS(ux: ResponsibilityUX): Record<string, string> {
  return {
    '--gravity-saturation': `${ux.color_saturation}%`,
    '--gravity-tempo': `${ux.tempo_multiplier}`,
    '--gravity-transition': `${0.3 / ux.tempo_multiplier}s`,
    '--gravity-opacity': `${0.5 + (ux.color_saturation / 200)}`,
  };
}

/**
 * Get gravity-based animation timing
 */
export function getGravityAnimation(ux: ResponsibilityUX): {
  duration: number;
  delay: number;
  easing: string;
} {
  return {
    duration: 300 / ux.tempo_multiplier,
    delay: ux.tempo_multiplier < 0.7 ? 100 : 0,
    easing: ux.tempo_multiplier < 0.5 ? 'ease-out' : 'ease-in-out',
  };
}

/**
 * Get scroll behavior for gravity
 */
export function getScrollBehavior(ux: ResponsibilityUX): {
  behavior: 'smooth' | 'auto';
  block: 'start' | 'center';
  requiresManualScroll: boolean;
} {
  return {
    behavior: ux.tempo_multiplier < 0.7 ? 'smooth' : 'auto',
    block: ux.forced_scroll ? 'start' : 'center',
    requiresManualScroll: ux.forced_scroll,
  };
}

/**
 * Get confirmation configuration
 */
export function getConfirmationConfig(ux: ResponsibilityUX, gravityClass: string): {
  required: boolean;
  type: 'none' | 'single' | 'double';
  checkboxes: string[];
  buttonDelay: number;
} {
  if (!ux.confirmation_required) {
    return {
      required: false,
      type: 'none',
      checkboxes: [],
      buttonDelay: 0,
    };
  }
  
  const checkboxes: string[] = [];
  
  if (gravityClass === 'medium' || gravityClass === 'high') {
    checkboxes.push('I have reviewed the scope of this decision');
  }
  
  if (gravityClass === 'high' || gravityClass === 'critical') {
    checkboxes.push('I have considered the alternatives');
    checkboxes.push('I acknowledge the uncertainties involved');
  }
  
  if (gravityClass === 'critical' || gravityClass === 'extreme') {
    checkboxes.push('I have reviewed all consequence scenarios');
    checkboxes.push('I accept responsibility for this decision');
  }
  
  return {
    required: true,
    type: ux.double_confirmation_required ? 'double' : 'single',
    checkboxes,
    buttonDelay: ux.double_confirmation_required ? 5000 : 2000,
  };
}

/**
 * Validate text against forbidden phrases
 */
export function validateText(text: string): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const phrase of FORBIDDEN_PHRASES) {
    if (lowerText.includes(phrase)) {
      violations.push(phrase);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * UX WEIGHT MASTERPROMPT
 */
export const UX_WEIGHT_MASTERPROMPT = `
You apply UX WEIGHT based on decision gravity.

WHEN GRAVITY IS HIGH:

1. COLORS DAMPEN
   - Saturation decreases
   - Contrast reduces
   - Visual weight increases

2. TEMPO SLOWS
   - Animations decelerate
   - Transitions lengthen
   - Responses delay

3. SCROLL IS FORCED
   - Cannot skip sections
   - Must view all content
   - Manual scrolling required

4. CONFIRMATIONS REQUIRED
   - Checkboxes for acknowledgment
   - Button delays
   - Double confirmation for extreme

FORBIDDEN LANGUAGE:
Never use:
- "Be careful"
- "Warning"
- "Danger"
- "Think twice"
- "Are you sure"

The system FEELS heavy.
No text warns — weight is infrastructural.

GRAVITY → UX MAPPING:
- Trivial: Full color, normal speed, no friction
- Low: Slight desaturation, normal speed, basic confirmation
- Medium: Moderate desaturation, slower, checkbox required
- High: Significant desaturation, slow, forced scroll, multiple checkboxes
- Critical: Muted colors, very slow, mandatory review, double confirm
- Extreme: Near grayscale, deliberate pace, cooling-off required

Weight scales with consequence.
`;
