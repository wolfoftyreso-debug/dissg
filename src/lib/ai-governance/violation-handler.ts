/**
 * AI GOVERNANCE: Violation Handler
 * 
 * Self-locking mechanism for AI rule violations.
 * Logs all incidents. Blocks invalid responses.
 */

import { validateAIOutput, type ViolationReport } from './forbidden-patterns';

// =============================================================================
// TYPES
// =============================================================================

export type ViolationSeverity = 'warning' | 'critical' | 'lockout';

export interface AIViolationIncident {
  id: string;
  timestamp: string;
  sessionId: string;
  violationType: ViolationReport['violations'][0]['type'];
  violationText: string;
  fullResponse: string;
  severity: ViolationSeverity;
  action: 'blocked' | 'warned' | 'logged';
  context: {
    activeFaultCode?: string;
    activeMeasureBlock?: string;
    userQuery?: string;
  };
}

export interface AIGovernanceState {
  isLocked: boolean;
  lockReason: string | null;
  lockTimestamp: string | null;
  violationCount: number;
  recentViolations: AIViolationIncident[];
  canUnlock: boolean;
}

// =============================================================================
// VIOLATION LOG (In-memory for demo, would be persisted in production)
// =============================================================================

let violationLog: AIViolationIncident[] = [];
let governanceState: AIGovernanceState = {
  isLocked: false,
  lockReason: null,
  lockTimestamp: null,
  violationCount: 0,
  recentViolations: [],
  canUnlock: true,
};

// =============================================================================
// CONSTANTS
// =============================================================================

const LOCKOUT_THRESHOLD = 3; // Critical violations before lockout
const VIOLATION_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

// =============================================================================
// HANDLER FUNCTIONS
// =============================================================================

export function processAIResponse(
  response: string,
  context: AIViolationIncident['context']
): { isValid: boolean; processedResponse: string | null; violations: ViolationReport } {
  const validation = validateAIOutput(response);
  
  if (!validation.hasViolation) {
    return {
      isValid: true,
      processedResponse: response,
      violations: validation,
    };
  }
  
  // Log violations
  const incidents: AIViolationIncident[] = validation.violations.map((v, index) => ({
    id: `vio-${Date.now()}-${index}`,
    timestamp: new Date().toISOString(),
    sessionId: context.activeFaultCode || 'unknown',
    violationType: v.type,
    violationText: v.match,
    fullResponse: response,
    severity: v.severity === 'critical' ? 'critical' : 'warning',
    action: v.severity === 'critical' ? 'blocked' : 'warned',
    context,
  }));
  
  violationLog.push(...incidents);
  governanceState.violationCount += incidents.length;
  governanceState.recentViolations = incidents;
  
  // Check for lockout condition
  const recentCritical = violationLog.filter(
    v => v.severity === 'critical' && 
    Date.now() - new Date(v.timestamp).getTime() < VIOLATION_WINDOW_MS
  ).length;
  
  if (recentCritical >= LOCKOUT_THRESHOLD) {
    governanceState.isLocked = true;
    governanceState.lockReason = `${LOCKOUT_THRESHOLD} kritiska regelbrott inom 1 timme`;
    governanceState.lockTimestamp = new Date().toISOString();
  }
  
  return {
    isValid: false,
    processedResponse: null,
    violations: validation,
  };
}

export function getGovernanceState(): AIGovernanceState {
  return { ...governanceState };
}

export function getViolationLog(): AIViolationIncident[] {
  return [...violationLog];
}

export function clearViolationLog(): void {
  violationLog = [];
  governanceState = {
    isLocked: false,
    lockReason: null,
    lockTimestamp: null,
    violationCount: 0,
    recentViolations: [],
    canUnlock: true,
  };
}

// =============================================================================
// REJECTION MESSAGES
// =============================================================================

export const REJECTION_MESSAGES = {
  value_word: {
    sv: 'AI-regelbrott: Värdeord detekterat. Svar ogiltigt.',
    en: 'AI rule violation: Value word detected. Response invalid.',
  },
  normative: {
    sv: 'AI-regelbrott: Normativt uttryck detekterat. Svar ogiltigt.',
    en: 'AI rule violation: Normative expression detected. Response invalid.',
  },
  intent: {
    sv: 'AI-regelbrott: Intentionstolkning detekterad. Svar ogiltigt.',
    en: 'AI rule violation: Intent interpretation detected. Response invalid.',
  },
  future_claim: {
    sv: 'AI-regelbrott: Framtidspåstående utan modellstöd. Svar ogiltigt.',
    en: 'AI rule violation: Future claim without model support. Response invalid.',
  },
  locked: {
    sv: 'AI-system låst på grund av upprepade regelbrott. Manuell granskning krävs.',
    en: 'AI system locked due to repeated rule violations. Manual review required.',
  },
  cannot_express: {
    sv: 'Systemet kan inte uttrycka detta. Endast diagnostisk data finns.',
    en: 'The system cannot express this. Only diagnostic data is available.',
  },
} as const;

// =============================================================================
// SAFE RESPONSE WRAPPER
// =============================================================================

export interface SafeAIResponse {
  success: boolean;
  response: string | null;
  rejection: {
    code: keyof typeof REJECTION_MESSAGES;
    message: string;
    violations: ViolationReport['violations'];
  } | null;
  governance: AIGovernanceState;
}

export function createSafeAIResponse(
  rawResponse: string,
  context: AIViolationIncident['context'],
  language: 'sv' | 'en' = 'sv'
): SafeAIResponse {
  // Check if system is locked
  if (governanceState.isLocked) {
    return {
      success: false,
      response: null,
      rejection: {
        code: 'locked',
        message: REJECTION_MESSAGES.locked[language],
        violations: [],
      },
      governance: getGovernanceState(),
    };
  }
  
  // Process the response
  const result = processAIResponse(rawResponse, context);
  
  if (result.isValid) {
    return {
      success: true,
      response: result.processedResponse,
      rejection: null,
      governance: getGovernanceState(),
    };
  }
  
  // Get the most severe violation type for the rejection message
  const primaryViolation = result.violations.violations[0];
  
  return {
    success: false,
    response: null,
    rejection: {
      code: primaryViolation.type,
      message: REJECTION_MESSAGES[primaryViolation.type][language],
      violations: result.violations.violations,
    },
    governance: getGovernanceState(),
  };
}
