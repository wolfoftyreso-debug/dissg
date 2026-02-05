/**
 * API-SPEC v1.0 — DECISION LEGITIMACY CORE
 * 
 * Read / Write / Lock / Verify
 * Standard: REST + JSON, deterministic, version-locked
 * 
 * DESIGN PRINCIPLES (ABSOLUTE):
 * - API does NOT accept incomplete decisions
 * - API does NO inference
 * - API returns NO recommendations
 * - API is append-only
 * - API can refuse response rather than simplify
 */

// Types
export type {
  // Status
  DecisionStatus,
  LockResult,
  
  // Request types
  CreateDecisionRequest,
  CreateContextRequest,
  CreateAlternativeRequest,
  CreateUncertaintyRequest,
  CreateEvidenceRequest,
  CreateReviewRequest,
  
  // Response types
  CreateDecisionResponse,
  GetDecisionResponse,
  LockDecisionSuccessResponse,
  LockDecisionFailResponse,
  LockDecisionResponse,
  LegitimacyCheckResponse,
  ResourceCreatedResponse,
  
  // Error types
  ApiErrorCode,
  ApiError,
  UnprocessableDecisionError,
  
  // Forbidden
  ForbiddenEndpoint,
} from './types';

export {
  API_VERSION,
  API_BASE_PATH,
  API_ROUTES,
  FORBIDDEN_ENDPOINTS,
} from './types';

// Validation
export {
  validateCreateDecision,
  validateCreateContext,
  validateCreateAlternative,
  validateCreateUncertainty,
  validateCreateEvidence,
  validateCreateReview,
  isForbiddenEndpoint,
  createUnprocessableError,
  createValidationError,
  createForbiddenConceptError,
  type ValidationResult,
} from './validation';

// Client
export {
  DecisionLegitimacyApiClient,
  createApiClient,
  type ApiResponse,
  type ApiClientConfig,
} from './client';

/**
 * API-SPEC v1.0 MASTERPROMPT
 */
export const API_SPEC_MASTERPROMPT = `
═══════════════════════════════════════════════════════════════════
                    API-SPEC v1.0
              DECISION LEGITIMACY CORE
                Read / Write / Lock / Verify
═══════════════════════════════════════════════════════════════════

Standard: REST + JSON, deterministic, version-locked
Base URL: /v1/

═══════════════════════════════════════════════════════════════════
                    DESIGN PRINCIPLES (ABSOLUTE)
═══════════════════════════════════════════════════════════════════

  • API does NOT accept incomplete decisions
  • API does NO inference
  • API returns NO recommendations
  • API is append-only
  • API can refuse response rather than simplify

═══════════════════════════════════════════════════════════════════
                    VERSIONING
═══════════════════════════════════════════════════════════════════

All resources are version-pinned:

  /v1/decisions
  /v1/contexts
  /v1/reviews

Breaking changes → /v2/
Old versions never die, only freeze.

═══════════════════════════════════════════════════════════════════
                    CORE ENDPOINTS
═══════════════════════════════════════════════════════════════════

DECISIONS:
  POST   /v1/decisions              Create draft decision
  GET    /v1/decisions/{id}         Get decision state
  POST   /v1/decisions/{id}/lock    Attempt lock (runs LegitimacyCheck)
  GET    /v1/decisions/{id}/legitimacy   Get legitimacy check

RESOURCES:
  POST   /v1/contexts               Create context
  POST   /v1/alternatives           Create alternative
  POST   /v1/uncertainties          Create uncertainty
  POST   /v1/evidence               Create evidence
  POST   /v1/reviews                Create review

PUBLIC (READ-ONLY, after lock):
  GET    /v1/public/decisions/{id}
  GET    /v1/public/decisions/{id}/context
  GET    /v1/public/decisions/{id}/review

═══════════════════════════════════════════════════════════════════
                    LOCK BEHAVIOR
═══════════════════════════════════════════════════════════════════

POST /v1/decisions/{id}/lock

API runs LegitimacyCheck.

SUCCESS:
  { "status": "locked", "locked_at": "timestamp" }

FAIL:
  { "status": "rejected", "missing": ["alternatives < 2", ...] }

NO OVERRIDE. EVER.

═══════════════════════════════════════════════════════════════════
                    FORBIDDEN ENDPOINTS
═══════════════════════════════════════════════════════════════════

These endpoints may NEVER exist:

  ❌ /recommend
  ❌ /rank
  ❌ /optimize
  ❌ /summary
  ❌ /confidence

If anyone proposes these → they have not understood the system.

═══════════════════════════════════════════════════════════════════
                    FAILURE MODE
═══════════════════════════════════════════════════════════════════

When data is missing:

  • API responds 422 Unprocessable Decision
  • With exactly what's missing
  • NEVER with fallback text
  • NEVER with "best guess"

═══════════════════════════════════════════════════════════════════
                    WHY THIS API IS HARD TO ABUSE
═══════════════════════════════════════════════════════════════════

  • It requires reality
  • It allows no shortcuts
  • It rewards structure
  • It punishes sloppiness through blocking

This is responsibility in machine form.

═══════════════════════════════════════════════════════════════════
`;
