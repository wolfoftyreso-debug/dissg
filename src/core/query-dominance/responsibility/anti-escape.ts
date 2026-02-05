/**
 * ANTI-ESCAPE ENGINE
 * 
 * The system does NOT allow:
 * - Artificial decision splitting to lower gravity
 * - Outsourcing responsibility to language ("experts say...")
 * - Hiding behind process
 * 
 * All reduces to: This decision affects X during Y time with Z uncertainty.
 */

import type {
  EscapeAttempt,
  EscapeAttemptType,
  GravityInput,
  ResponsibilitySession,
} from './types';

/**
 * Escape detection patterns
 */
const ESCAPE_PATTERNS: {
  type: EscapeAttemptType;
  patterns: RegExp[];
  blockReason: string;
}[] = [
  {
    type: 'responsibility_deflection',
    patterns: [
      /experts?\s+(say|recommend|suggest)/i,
      /according\s+to\s+(studies|research|experts)/i,
      /it\s+is\s+(widely|generally)\s+(accepted|known)/i,
      /best\s+practice\s+(says|dictates)/i,
      /industry\s+standard/i,
    ],
    blockReason: 'Responsibility cannot be outsourced to external authority',
  },
  {
    type: 'process_hiding',
    patterns: [
      /we\s+followed\s+the\s+process/i,
      /according\s+to\s+procedure/i,
      /the\s+committee\s+decided/i,
      /as\s+per\s+protocol/i,
      /standard\s+operating\s+procedure/i,
    ],
    blockReason: 'Process does not replace responsibility for consequences',
  },
  {
    type: 'decision_splitting',
    patterns: [
      /this\s+is\s+just\s+(a\s+)?small\s+part/i,
      /we\'?ll\s+handle\s+the\s+rest\s+later/i,
      /one\s+step\s+at\s+a\s+time/i,
      /this\s+doesn\'?t\s+really\s+count/i,
    ],
    blockReason: 'Decisions cannot be artificially split to reduce apparent gravity',
  },
];

/**
 * Detect escape attempt in text
 */
export function detectEscapeInText(text: string): EscapeAttempt | null {
  for (const pattern of ESCAPE_PATTERNS) {
    for (const regex of pattern.patterns) {
      if (regex.test(text)) {
        return {
          timestamp: new Date().toISOString(),
          attempt_type: pattern.type,
          description: `Detected pattern: ${regex.source}`,
          blocked: true,
          block_reason: pattern.blockReason,
        };
      }
    }
  }
  return null;
}

/**
 * Detect gravity manipulation attempt
 */
export function detectGravityManipulation(
  current: GravityInput,
  previous: GravityInput
): EscapeAttempt | null {
  // Check each dimension for unexplained lowering
  const comparisons = [
    { dim: 'affected_population', curr: current.affected_population, prev: previous.affected_population },
    { dim: 'time_horizon', curr: current.time_horizon, prev: previous.time_horizon },
    { dim: 'irreversibility', curr: current.irreversibility, prev: previous.irreversibility },
    { dim: 'uncertainty', curr: current.uncertainty, prev: previous.uncertainty },
  ];
  
  for (const comp of comparisons) {
    if (isLowerValue(comp.dim, comp.curr as string, comp.prev as string)) {
      return {
        timestamp: new Date().toISOString(),
        attempt_type: 'gravity_manipulation',
        description: `Attempted to lower ${comp.dim} from ${comp.prev} to ${comp.curr}`,
        blocked: true,
        block_reason: 'Gravity values cannot be manually lowered without system recalculation',
      };
    }
  }
  
  return null;
}

/**
 * Detect gate bypass attempt
 */
export function detectGateBypass(
  gateType: string,
  timeSpentSeconds: number,
  minimumTimeSeconds: number
): EscapeAttempt | null {
  if (timeSpentSeconds < minimumTimeSeconds * 0.5) {
    return {
      timestamp: new Date().toISOString(),
      attempt_type: 'gate_bypass',
      description: `Attempted to pass ${gateType} in ${timeSpentSeconds}s (minimum: ${minimumTimeSeconds}s)`,
      blocked: true,
      block_reason: 'Insufficient time spent on required gate',
    };
  }
  return null;
}

/**
 * Detect time manipulation
 */
export function detectTimeManipulation(
  sessionStart: Date,
  currentTime: Date,
  expectedDuration: number
): EscapeAttempt | null {
  const elapsed = (currentTime.getTime() - sessionStart.getTime()) / 1000;
  
  // If claimed duration is much higher than elapsed time
  if (expectedDuration > elapsed * 1.5) {
    return {
      timestamp: new Date().toISOString(),
      attempt_type: 'time_manipulation',
      description: `Time discrepancy: claimed ${expectedDuration}s, elapsed ${elapsed}s`,
      blocked: true,
      block_reason: 'Time on gates cannot be artificially inflated',
    };
  }
  
  return null;
}

/**
 * Log escape attempt to session
 */
export function logEscapeAttempt(
  session: ResponsibilitySession,
  attempt: EscapeAttempt
): ResponsibilitySession {
  return {
    ...session,
    escape_attempts: [...session.escape_attempts, attempt],
  };
}

/**
 * Get escape attempt summary
 */
export function getEscapeAttemptSummary(attempts: EscapeAttempt[]): {
  total: number;
  by_type: Record<EscapeAttemptType, number>;
  all_blocked: boolean;
} {
  const byType: Record<EscapeAttemptType, number> = {
    gravity_manipulation: 0,
    decision_splitting: 0,
    responsibility_deflection: 0,
    process_hiding: 0,
    gate_bypass: 0,
    time_manipulation: 0,
  };
  
  for (const attempt of attempts) {
    byType[attempt.attempt_type]++;
  }
  
  return {
    total: attempts.length,
    by_type: byType,
    all_blocked: attempts.every(a => a.blocked),
  };
}

/**
 * Helper: Check if value is lower on a dimension scale
 */
function isLowerValue(dimension: string, current: string, previous: string): boolean {
  const scales: Record<string, string[]> = {
    affected_population: ['1', '10', '100', '1000', '10000', '1M+'],
    time_horizon: ['minutes', 'days', 'months', 'years', 'decades', 'generational'],
    irreversibility: ['low', 'medium', 'high', 'permanent'],
    uncertainty: ['low', 'medium', 'high', 'extreme'],
  };
  
  const scale = scales[dimension];
  if (!scale) return false;
  
  const currentIndex = scale.indexOf(current);
  const previousIndex = scale.indexOf(previous);
  
  return currentIndex < previousIndex;
}

/**
 * ANTI-ESCAPE MASTERPROMPT
 */
export const ANTI_ESCAPE_MASTERPROMPT = `
You enforce ANTI-ESCAPE RULES.

THE SYSTEM DOES NOT ALLOW:

1. GRAVITY MANIPULATION
   - User cannot manually lower gravity values
   - All reductions require system recalculation
   - Changes are logged and audited

2. DECISION SPLITTING
   - Decisions cannot be artificially split
   - "Just a small part" is blocked
   - Full scope must be acknowledged

3. RESPONSIBILITY DEFLECTION
   - "Experts say..." is blocked
   - "According to studies..." is blocked
   - Responsibility stays with the decision-maker

4. PROCESS HIDING
   - "We followed procedure" is blocked
   - "The committee decided" is blocked
   - Process does not replace accountability

5. GATE BYPASS
   - Minimum time on each gate enforced
   - Rapid clicking is blocked
   - All requirements must be met

6. TIME MANIPULATION
   - Session time is tracked server-side
   - Claimed durations are validated
   - Cooling off cannot be skipped

ALL ESCAPE ATTEMPTS ARE:
- Detected in real-time
- Logged permanently
- Blocked automatically
- Surfaced to the actor

CORE REDUCTION:
Every decision reduces to:
"This decision affects X during Y time with Z uncertainty."

No hiding. No escape. Full accountability.
`;
