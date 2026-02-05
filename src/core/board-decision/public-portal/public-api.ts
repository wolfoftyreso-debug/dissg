/**
 * PUBLIC API (READ-ONLY, RATE-LIMITED)
 * 
 * For researchers, journalists, future AI.
 * Deterministic, version-pinned, no summarizing language.
 */

import type { PublicAPIResponse, PublicDecisionView } from './types';

/**
 * API version
 */
export const PUBLIC_API_VERSION = '1.0.0';

/**
 * Rate limits
 */
const RATE_LIMITS = {
  anonymous: { requests_per_hour: 100 },
  researcher: { requests_per_hour: 1000 },
  journalist: { requests_per_hour: 500 },
  api_client: { requests_per_hour: 5000 },
} as const;

/**
 * API endpoints specification
 */
export const PUBLIC_API_ENDPOINTS = {
  list_decisions: {
    method: 'GET',
    path: '/public/decisions',
    params: ['org', 'year', 'limit', 'offset'],
    description: 'List published decisions',
  },
  get_decision_context: {
    method: 'GET',
    path: '/public/decision/{id}/context',
    params: ['id'],
    description: 'Get decision context snapshot',
  },
  get_decision_review: {
    method: 'GET',
    path: '/public/decision/{id}/review',
    params: ['id'],
    description: 'Get post-decision review if available',
  },
  get_decision_alternatives: {
    method: 'GET',
    path: '/public/decision/{id}/alternatives',
    params: ['id'],
    description: 'Get alternatives considered',
  },
} as const;

/**
 * Create API response wrapper
 */
export function createAPIResponse<T>(
  data: T,
  dataVersion: string,
  rateLimitRemaining: number,
  rateLimitReset: Date
): PublicAPIResponse<T> {
  return {
    data,
    version: {
      api_version: PUBLIC_API_VERSION,
      data_version: dataVersion,
      response_generated_at: new Date().toISOString(),
    },
    interpretation: null, // Always null
    rate_limit: {
      remaining: rateLimitRemaining,
      reset_at: rateLimitReset.toISOString(),
    },
  };
}

/**
 * Validate API request
 */
export function validateAPIRequest(
  endpoint: keyof typeof PUBLIC_API_ENDPOINTS,
  params: Record<string, string>
): { valid: boolean; errors: string[] } {
  const spec = PUBLIC_API_ENDPOINTS[endpoint];
  const errors: string[] = [];
  
  // Check required params
  for (const param of spec.params) {
    if (param !== 'limit' && param !== 'offset' && !params[param]) {
      errors.push(`Missing required parameter: ${param}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate rate limit status
 */
export function calculateRateLimit(
  accessorType: keyof typeof RATE_LIMITS,
  requestsThisHour: number
): {
  allowed: boolean;
  remaining: number;
  reset_at: Date;
} {
  const limit = RATE_LIMITS[accessorType].requests_per_hour;
  const remaining = Math.max(0, limit - requestsThisHour);
  
  // Reset at next hour
  const now = new Date();
  const resetAt = new Date(now);
  resetAt.setHours(resetAt.getHours() + 1, 0, 0, 0);
  
  return {
    allowed: remaining > 0,
    remaining,
    reset_at: resetAt,
  };
}

/**
 * Format decision for API response
 */
export function formatDecisionForAPI(
  decision: PublicDecisionView
): Record<string, unknown> {
  return {
    id: decision.decision_id,
    summary: decision.summary,
    context: decision.context_snapshot,
    alternatives: decision.alternatives_considered,
    uncertainties: decision.known_uncertainties,
    irreversibility: decision.irreversibility_level,
    legibility_score: decision.decision_legibility_score,
    review: decision.review_status,
    // Explicit null for interpretation
    interpretation: null,
    recommendation: null,
    judgment: null,
  };
}

/**
 * PUBLIC API MASTERPROMPT
 */
export const PUBLIC_API_MASTERPROMPT = `
You serve the Public Read-Only API.

ENDPOINTS:
GET /public/decisions?org=XYZ&year=2026
GET /public/decision/{id}/context
GET /public/decision/{id}/review
GET /public/decision/{id}/alternatives

ALL RESPONSES ARE:
- Deterministic (same input = same output)
- Version-pinned (can be reproduced)
- Without summarizing language

WHAT IS NEVER IN RESPONSES:
- interpretation: null
- recommendation: null
- judgment: null

RATE LIMITS:
- Anonymous: 100/hour
- Researcher: 1000/hour
- Journalist: 500/hour
- API client: 5000/hour

WHO USES THIS:
- Researchers studying governance
- Journalists investigating decisions
- Future AI systems grounding claims
- Historians documenting institutions

DESIGN PRINCIPLE:
Responses are data, not narrative.
Context is always included.
Uncertainty is never hidden.
`;
