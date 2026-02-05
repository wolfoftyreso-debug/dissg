/**
 * AI SAFETY BOUNDARY
 * 
 * AI agents are strictly limited.
 * They can read, never write.
 * They can suggest, never conclude.
 */

import type { AIAllowedAction, AIForbiddenAction, AgentRateLimit } from './types';

// ============================================================================
// AI ALLOWED ACTIONS
// ============================================================================

export const AI_ALLOWED_ACTIONS: readonly AIAllowedAction[] = [
  'read_read_models',
  'call_query_compiler',
  'suggest_missing_fields',
] as const;

// ============================================================================
// AI FORBIDDEN ACTIONS (HARD BLOCK)
// ============================================================================

export const AI_FORBIDDEN_ACTIONS: readonly AIForbiddenAction[] = [
  'write_events',
  'lock_decisions',
  'create_alternatives',
  'formulate_conclusion',
] as const;

// ============================================================================
// ACTION VALIDATION
// ============================================================================

export function isAIActionAllowed(action: string): boolean {
  return AI_ALLOWED_ACTIONS.includes(action as AIAllowedAction);
}

export function isAIActionForbidden(action: string): boolean {
  return AI_FORBIDDEN_ACTIONS.includes(action as AIForbiddenAction);
}

export function validateAIAction(action: string): {
  allowed: boolean;
  reason: string;
} {
  if (isAIActionForbidden(action)) {
    return {
      allowed: false,
      reason: `AI is forbidden from action: ${action}`,
    };
  }
  
  if (isAIActionAllowed(action)) {
    return {
      allowed: true,
      reason: 'Action is in allowed list',
    };
  }
  
  return {
    allowed: false,
    reason: `Unknown action: ${action}. AI actions must be explicitly allowed.`,
  };
}

// ============================================================================
// RATE LIMITS
// ============================================================================

export const DEFAULT_AGENT_RATE_LIMITS = {
  requests_per_minute: 60,
  requests_per_hour: 1000,
  requests_per_day: 10000,
} as const;

export const GRAVITY_BASED_LIMITS = {
  // Higher gravity = lower rate limits
  high_gravity: {
    multiplier: 0.25, // 1/4 of normal
    min_delay_ms: 5000,
  },
  medium_gravity: {
    multiplier: 0.5,
    min_delay_ms: 2000,
  },
  low_gravity: {
    multiplier: 1.0,
    min_delay_ms: 100,
  },
} as const;

export function getAgentRateLimit(
  agentId: string,
  decisionId: string | null,
  gravityScore: number
): AgentRateLimit {
  let multiplier = 1.0;
  
  if (gravityScore >= 80) {
    multiplier = GRAVITY_BASED_LIMITS.high_gravity.multiplier;
  } else if (gravityScore >= 50) {
    multiplier = GRAVITY_BASED_LIMITS.medium_gravity.multiplier;
  } else {
    multiplier = GRAVITY_BASED_LIMITS.low_gravity.multiplier;
  }
  
  return {
    agent_id: agentId,
    decision_id: decisionId,
    gravity_score: gravityScore,
    requests_per_minute: Math.floor(DEFAULT_AGENT_RATE_LIMITS.requests_per_minute * multiplier),
    requests_per_hour: Math.floor(DEFAULT_AGENT_RATE_LIMITS.requests_per_hour * multiplier),
  };
}

// ============================================================================
// AI OUTPUT VALIDATION
// ============================================================================

export function validateAIOutput(output: string): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  // Check for conclusion patterns
  const conclusionPatterns = [
    /in conclusion/i,
    /therefore,? (you|we|one) should/i,
    /the best (option|choice|decision) is/i,
    /recommended? (choice|option|decision)/i,
    /you should (choose|pick|select)/i,
    /the (optimal|preferred|best) (path|way|option)/i,
  ];
  
  for (const pattern of conclusionPatterns) {
    if (pattern.test(output)) {
      violations.push(`Forbidden pattern detected: ${pattern.source}`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}
