/**
 * API-SPEC v1.0 — DECISION LEGITIMACY CORE
 * 
 * Read / Write / Lock / Verify
 * Standard: REST + JSON, deterministic, version-locked
 * Base URL: /v1/
 * 
 * DESIGN PRINCIPLES (ABSOLUTE):
 * - API does NOT accept incomplete decisions
 * - API does NO inference
 * - API returns NO recommendations
 * - API is append-only
 * - API can refuse response rather than simplify
 */

import type {
  DecisionType,
  Scope,
  TimeRange,
  AffectedPopulation,
  GeographicScope,
  UncertaintyType,
  ImpactRange,
  SourceType,
  LegitimacyStatus,
} from '../ontology/types';

// ═══════════════════════════════════════════════════════════════════
//                         API VERSION
// ═══════════════════════════════════════════════════════════════════

export const API_VERSION = 'v1' as const;
export const API_BASE_PATH = `/${API_VERSION}` as const;

// ═══════════════════════════════════════════════════════════════════
//                         STATUS TYPES
// ═══════════════════════════════════════════════════════════════════

export type DecisionStatus = 'draft' | 'locked';
export type LockResult = 'locked' | 'rejected';

// ═══════════════════════════════════════════════════════════════════
//                         REQUEST TYPES
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /v1/decisions
 */
export interface CreateDecisionRequest {
  decision_type: DecisionType;
  scope: Scope;
  time_horizon: TimeRange;
}

/**
 * POST /v1/contexts
 */
export interface CreateContextRequest {
  decision_id: string;
  description: string;
  affected_population: AffectedPopulation;
  geographic_scope: GeographicScope;
  assumptions?: Array<{
    text: string;
    is_testable?: boolean;
  }>;
}

/**
 * POST /v1/alternatives
 */
export interface CreateAlternativeRequest {
  decision_id: string;
  label: string;
  description: string;
  trade_offs?: Array<{
    dimension: string;
    effect: 'positive' | 'negative' | 'uncertain';
  }>;
  required_assumptions?: string[];
}

/**
 * POST /v1/uncertainties
 */
export interface CreateUncertaintyRequest {
  decision_id: string;
  description: string;
  uncertainty_type: UncertaintyType;
  impact_range: ImpactRange;
}

/**
 * POST /v1/evidence
 */
export interface CreateEvidenceRequest {
  decision_id: string;
  source_type: SourceType;
  reference: string;
  validity_period: TimeRange;
}

/**
 * POST /v1/reviews
 */
export interface CreateReviewRequest {
  decision_id: string;
  expected_vs_observed: string;
  foreseeable_deviation: boolean;
  learnings?: string[];
}

// ═══════════════════════════════════════════════════════════════════
//                         RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /v1/decisions response
 */
export interface CreateDecisionResponse {
  decision_id: string;
  status: 'draft';
}

/**
 * GET /v1/decisions/{id} response
 */
export interface GetDecisionResponse {
  decision_id: string;
  status: DecisionStatus;
  legitimacy_status: LegitimacyStatus;
  gravity_score: number;
  created_at: string;
  locked_at: string | null;
}

/**
 * POST /v1/decisions/{id}/lock response - SUCCESS
 */
export interface LockDecisionSuccessResponse {
  status: 'locked';
  locked_at: string;
}

/**
 * POST /v1/decisions/{id}/lock response - FAIL
 */
export interface LockDecisionFailResponse {
  status: 'rejected';
  missing: string[];
}

export type LockDecisionResponse = LockDecisionSuccessResponse | LockDecisionFailResponse;

/**
 * GET /v1/decisions/{id}/legitimacy response
 */
export interface LegitimacyCheckResponse {
  legitimate: boolean;
  checks: {
    context_present: boolean;
    alternatives_exposed: boolean;
    uncertainties_acknowledged: boolean;
    scope_defined: boolean;
    time_defined: boolean;
  };
}

/**
 * Resource created response
 */
export interface ResourceCreatedResponse {
  id: string;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════════
//                         ERROR TYPES
// ═══════════════════════════════════════════════════════════════════

export type ApiErrorCode =
  | 'DECISION_NOT_FOUND'
  | 'DECISION_LOCKED'
  | 'UNPROCESSABLE_DECISION'
  | 'VALIDATION_ERROR'
  | 'FORBIDDEN_CONCEPT'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_STATE';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: string[];
  status: number;
}

/**
 * 422 Unprocessable Decision
 */
export interface UnprocessableDecisionError extends ApiError {
  code: 'UNPROCESSABLE_DECISION';
  status: 422;
  missing: string[];
}

// ═══════════════════════════════════════════════════════════════════
//                         ROUTE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

export const API_ROUTES = {
  // Core resources
  DECISIONS: `${API_BASE_PATH}/decisions`,
  DECISION: (id: string) => `${API_BASE_PATH}/decisions/${id}`,
  DECISION_LOCK: (id: string) => `${API_BASE_PATH}/decisions/${id}/lock`,
  DECISION_LEGITIMACY: (id: string) => `${API_BASE_PATH}/decisions/${id}/legitimacy`,
  
  CONTEXTS: `${API_BASE_PATH}/contexts`,
  ALTERNATIVES: `${API_BASE_PATH}/alternatives`,
  UNCERTAINTIES: `${API_BASE_PATH}/uncertainties`,
  EVIDENCE: `${API_BASE_PATH}/evidence`,
  REVIEWS: `${API_BASE_PATH}/reviews`,
  
  // Public read-only (after lock)
  PUBLIC_DECISION: (id: string) => `${API_BASE_PATH}/public/decisions/${id}`,
  PUBLIC_CONTEXT: (id: string) => `${API_BASE_PATH}/public/decisions/${id}/context`,
  PUBLIC_REVIEW: (id: string) => `${API_BASE_PATH}/public/decisions/${id}/review`,
} as const;

// ═══════════════════════════════════════════════════════════════════
//                         FORBIDDEN ENDPOINTS
// ═══════════════════════════════════════════════════════════════════

/**
 * These endpoints may NEVER exist.
 * If anyone proposes them → they have not understood the system.
 */
export const FORBIDDEN_ENDPOINTS = [
  '/recommend',
  '/rank',
  '/optimize',
  '/summary',
  '/confidence',
  '/best',
  '/score',
  '/suggestion',
] as const;

export type ForbiddenEndpoint = typeof FORBIDDEN_ENDPOINTS[number];
