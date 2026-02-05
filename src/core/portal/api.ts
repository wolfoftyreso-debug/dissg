/**
 * PUBLIC API SPECIFICATION (READ-ONLY)
 * 
 * Strict JSON, version-pinned, without summarizing language.
 */

import type { PublicAPIEndpoint, ExportRequirements } from './types';

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const PUBLIC_API_ENDPOINTS: readonly PublicAPIEndpoint[] = [
  {
    method: 'GET',
    path: '/public/decisions',
    description: 'List all published decisions. Filterable by domain, status, date.',
    response_type: 'PublicDecision[]',
  },
  {
    method: 'GET',
    path: '/public/decisions/{id}',
    description: 'Get full decision detail view.',
    response_type: 'DecisionDetailView',
  },
  {
    method: 'GET',
    path: '/public/decisions/{id}/context',
    description: 'Get decision context block only.',
    response_type: 'DecisionContext',
  },
  {
    method: 'GET',
    path: '/public/decisions/{id}/assumptions',
    description: 'Get decision assumptions.',
    response_type: 'DecisionAssumption[]',
  },
  {
    method: 'GET',
    path: '/public/decisions/{id}/alternatives',
    description: 'Get decision alternatives (symmetric, no ranking).',
    response_type: 'DecisionAlternative[]',
  },
  {
    method: 'GET',
    path: '/public/decisions/{id}/uncertainties',
    description: 'Get known uncertainties.',
    response_type: 'DecisionUncertainty[]',
  },
  {
    method: 'GET',
    path: '/public/decisions/{id}/evidence',
    description: 'Get evidence references.',
    response_type: 'DecisionEvidence[]',
  },
  {
    method: 'GET',
    path: '/public/decisions/{id}/review',
    description: 'Get review status if available.',
    response_type: 'DecisionReview | null',
  },
  {
    method: 'GET',
    path: '/public/reference-cases',
    description: 'List all reference cases.',
    response_type: 'ReferenceCase[]',
  },
  {
    method: 'GET',
    path: '/public/reference-cases/{id}',
    description: 'Get reference case detail.',
    response_type: 'ReferenceCase',
  },
  {
    method: 'GET',
    path: '/public/cannot-answer',
    description: 'List all unanswerable queries.',
    response_type: 'CannotAnswerEntry[]',
  },
  {
    method: 'GET',
    path: '/public/method',
    description: 'List method documents.',
    response_type: 'MethodDocument[]',
  },
  {
    method: 'GET',
    path: '/public/method/{id}',
    description: 'Get method document content.',
    response_type: 'MethodDocument',
  },
  {
    method: 'GET',
    path: '/public/trust-anchors',
    description: 'List all trust anchors with checksums.',
    response_type: 'TrustAnchor[]',
  },
] as const;

// ============================================================================
// EXPORT REQUIREMENTS (MEDIA-SAFE)
// ============================================================================

export const EXPORT_REQUIREMENTS: ExportRequirements = {
  requires_scope: true,
  requires_time_horizon: true,
  requires_uncertainty_block: true,
  prevents_isolated_quotes: true,
  prevents_numbers_without_baseline: true,
} as const;

// ============================================================================
// API RESPONSE HEADERS
// ============================================================================

export const API_RESPONSE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-API-Version': '1.0',
  'X-Read-Only': 'true',
  'X-No-Personalization': 'true',
  'Cache-Control': 'public, max-age=3600',
} as const;

// ============================================================================
// API CONSTRAINTS
// ============================================================================

export const API_CONSTRAINTS = {
  // No summarizing language in responses
  forbidden_response_fields: [
    'summary',
    'conclusion',
    'recommendation',
    'best_option',
    'ranking',
    'score_comparison',
  ],
  
  // Required context in all responses
  required_context_fields: [
    'decision_id',
    'scope',
    'uncertainties_count',
    'locked_at',
  ],
  
  // Version pinning
  api_version: '1.0',
  breaking_changes_locked: true,
} as const;

// ============================================================================
// UTILITIES
// ============================================================================

export function getEndpointByPath(path: string): PublicAPIEndpoint | undefined {
  // Normalize path for pattern matching
  const normalizedPath = path.replace(/\/[a-zA-Z0-9-]+$/, '/{id}');
  return PUBLIC_API_ENDPOINTS.find(e => e.path === path || e.path === normalizedPath);
}

export function isReadOnlyEndpoint(path: string): boolean {
  const endpoint = getEndpointByPath(path);
  return endpoint?.method === 'GET';
}

export function validateExportRequest(request: {
  scope?: string;
  time_horizon?: string;
  uncertainty_block?: boolean;
}): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!request.scope) missing.push('scope');
  if (!request.time_horizon) missing.push('time_horizon');
  if (!request.uncertainty_block) missing.push('uncertainty_block');
  
  return {
    valid: missing.length === 0,
    missing,
  };
}
