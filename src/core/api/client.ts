/**
 * API CLIENT
 * 
 * Type-safe client for Decision Legitimacy API.
 * Matches the API-SPEC v1.0 exactly.
 */

import type {
  CreateDecisionRequest,
  CreateDecisionResponse,
  GetDecisionResponse,
  LockDecisionResponse,
  LegitimacyCheckResponse,
  CreateContextRequest,
  CreateAlternativeRequest,
  CreateUncertaintyRequest,
  CreateEvidenceRequest,
  CreateReviewRequest,
  ResourceCreatedResponse,
  ApiError,
} from './types';
import { API_ROUTES } from './types';
import {
  validateCreateDecision,
  validateCreateContext,
  validateCreateAlternative,
  validateCreateUncertainty,
  validateCreateEvidence,
  validateCreateReview,
  isForbiddenEndpoint,
  createValidationError,
} from './validation';

/**
 * API response wrapper
 */
export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError };

/**
 * Base API client configuration
 */
export interface ApiClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
}

/**
 * Decision Legitimacy API Client
 */
export class DecisionLegitimacyApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Internal request method
   */
  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    // Check for forbidden endpoints
    if (isForbiddenEndpoint(path)) {
      return {
        success: false,
        error: {
          code: 'FORBIDDEN_CONCEPT',
          message: 'This endpoint is forbidden by design',
          status: 403,
        },
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: this.headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data as ApiError,
        };
      }

      return { success: true, data: data as T };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          status: 500,
        },
      };
    }
  }

  // ════════════════════════════════════════════════════════════════
  //                         DECISIONS
  // ════════════════════════════════════════════════════════════════

  /**
   * POST /v1/decisions
   * Creates a draft decision
   */
  async createDecision(
    req: CreateDecisionRequest
  ): Promise<ApiResponse<CreateDecisionResponse>> {
    const validation = validateCreateDecision(req);
    if (!validation.valid) {
      return {
        success: false,
        error: createValidationError(validation.errors),
      };
    }
    return this.request('POST', API_ROUTES.DECISIONS, req);
  }

  /**
   * GET /v1/decisions/{id}
   * Returns current decision state
   */
  async getDecision(id: string): Promise<ApiResponse<GetDecisionResponse>> {
    return this.request('GET', API_ROUTES.DECISION(id));
  }

  /**
   * POST /v1/decisions/{id}/lock
   * Attempts to lock the decision
   */
  async lockDecision(id: string): Promise<ApiResponse<LockDecisionResponse>> {
    return this.request('POST', API_ROUTES.DECISION_LOCK(id));
  }

  /**
   * GET /v1/decisions/{id}/legitimacy
   * Returns legitimacy check result
   */
  async checkLegitimacy(id: string): Promise<ApiResponse<LegitimacyCheckResponse>> {
    return this.request('GET', API_ROUTES.DECISION_LEGITIMACY(id));
  }

  // ════════════════════════════════════════════════════════════════
  //                         CONTEXTS
  // ════════════════════════════════════════════════════════════════

  /**
   * POST /v1/contexts
   */
  async createContext(
    req: CreateContextRequest
  ): Promise<ApiResponse<ResourceCreatedResponse>> {
    const validation = validateCreateContext(req);
    if (!validation.valid) {
      return {
        success: false,
        error: createValidationError(validation.errors),
      };
    }
    return this.request('POST', API_ROUTES.CONTEXTS, req);
  }

  // ════════════════════════════════════════════════════════════════
  //                         ALTERNATIVES
  // ════════════════════════════════════════════════════════════════

  /**
   * POST /v1/alternatives
   */
  async createAlternative(
    req: CreateAlternativeRequest
  ): Promise<ApiResponse<ResourceCreatedResponse>> {
    const validation = validateCreateAlternative(req);
    if (!validation.valid) {
      return {
        success: false,
        error: createValidationError(validation.errors),
      };
    }
    return this.request('POST', API_ROUTES.ALTERNATIVES, req);
  }

  // ════════════════════════════════════════════════════════════════
  //                         UNCERTAINTIES
  // ════════════════════════════════════════════════════════════════

  /**
   * POST /v1/uncertainties
   */
  async createUncertainty(
    req: CreateUncertaintyRequest
  ): Promise<ApiResponse<ResourceCreatedResponse>> {
    const validation = validateCreateUncertainty(req);
    if (!validation.valid) {
      return {
        success: false,
        error: createValidationError(validation.errors),
      };
    }
    return this.request('POST', API_ROUTES.UNCERTAINTIES, req);
  }

  // ════════════════════════════════════════════════════════════════
  //                         EVIDENCE
  // ════════════════════════════════════════════════════════════════

  /**
   * POST /v1/evidence
   */
  async createEvidence(
    req: CreateEvidenceRequest
  ): Promise<ApiResponse<ResourceCreatedResponse>> {
    const validation = validateCreateEvidence(req);
    if (!validation.valid) {
      return {
        success: false,
        error: createValidationError(validation.errors),
      };
    }
    return this.request('POST', API_ROUTES.EVIDENCE, req);
  }

  // ════════════════════════════════════════════════════════════════
  //                         REVIEWS
  // ════════════════════════════════════════════════════════════════

  /**
   * POST /v1/reviews
   */
  async createReview(
    req: CreateReviewRequest
  ): Promise<ApiResponse<ResourceCreatedResponse>> {
    const validation = validateCreateReview(req);
    if (!validation.valid) {
      return {
        success: false,
        error: createValidationError(validation.errors),
      };
    }
    return this.request('POST', API_ROUTES.REVIEWS, req);
  }

  // ════════════════════════════════════════════════════════════════
  //                         PUBLIC (READ-ONLY)
  // ════════════════════════════════════════════════════════════════

  /**
   * GET /v1/public/decisions/{id}
   * Only available after lock
   */
  async getPublicDecision(id: string): Promise<ApiResponse<GetDecisionResponse>> {
    return this.request('GET', API_ROUTES.PUBLIC_DECISION(id));
  }
}

/**
 * Create API client instance
 */
export function createApiClient(config?: ApiClientConfig): DecisionLegitimacyApiClient {
  return new DecisionLegitimacyApiClient(config);
}
