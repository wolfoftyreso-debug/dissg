/**
 * API VALIDATION
 * 
 * Validates requests against ontology rules.
 * No inference. No fallback. No best guess.
 */

import type {
  CreateDecisionRequest,
  CreateContextRequest,
  CreateAlternativeRequest,
  CreateUncertaintyRequest,
  CreateEvidenceRequest,
  CreateReviewRequest,
  ApiError,
  UnprocessableDecisionError,
} from './types';
import { FORBIDDEN_ENDPOINTS } from './types';
import { detectForbiddenConcepts } from '../ontology/forbidden';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate decision creation request
 */
export function validateCreateDecision(req: CreateDecisionRequest): ValidationResult {
  const errors: string[] = [];
  
  if (!req.decision_type) {
    errors.push('decision_type is required');
  }
  
  if (!req.scope) {
    errors.push('scope is required');
  } else {
    if (!req.scope.population_size) {
      errors.push('scope.population_size is required');
    }
    if (!req.scope.reversibility) {
      errors.push('scope.reversibility is required');
    }
  }
  
  if (!req.time_horizon) {
    errors.push('time_horizon is required');
  } else {
    if (!req.time_horizon.start) {
      errors.push('time_horizon.start is required');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate context creation request
 */
export function validateCreateContext(req: CreateContextRequest): ValidationResult {
  const errors: string[] = [];
  
  if (!req.decision_id) {
    errors.push('decision_id is required');
  }
  
  if (!req.description) {
    errors.push('description is required');
  } else {
    // Check for forbidden concepts
    const forbidden = detectForbiddenConcepts(req.description);
    if (forbidden.length > 0) {
      errors.push(`Forbidden concepts detected: ${forbidden.join(', ')}`);
    }
  }
  
  if (!req.affected_population) {
    errors.push('affected_population is required');
  }
  
  if (!req.geographic_scope) {
    errors.push('geographic_scope is required');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate alternative creation request
 */
export function validateCreateAlternative(req: CreateAlternativeRequest): ValidationResult {
  const errors: string[] = [];
  
  if (!req.decision_id) {
    errors.push('decision_id is required');
  }
  
  if (!req.label) {
    errors.push('label is required');
  }
  
  if (!req.description) {
    errors.push('description is required');
  } else {
    // Check for forbidden concepts
    const forbidden = detectForbiddenConcepts(req.description);
    if (forbidden.length > 0) {
      errors.push(`Forbidden concepts detected: ${forbidden.join(', ')}`);
    }
    
    // Check for ranking language
    const rankingPatterns = ['best', 'recommended', 'optimal', 'preferred', 'first choice'];
    const lower = req.description.toLowerCase();
    for (const pattern of rankingPatterns) {
      if (lower.includes(pattern)) {
        errors.push(`Ranking language not allowed: "${pattern}"`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate uncertainty creation request
 */
export function validateCreateUncertainty(req: CreateUncertaintyRequest): ValidationResult {
  const errors: string[] = [];
  
  if (!req.decision_id) {
    errors.push('decision_id is required');
  }
  
  if (!req.description) {
    errors.push('description is required');
  }
  
  if (!req.uncertainty_type) {
    errors.push('uncertainty_type is required');
  }
  
  if (!req.impact_range) {
    errors.push('impact_range is required');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate evidence creation request
 */
export function validateCreateEvidence(req: CreateEvidenceRequest): ValidationResult {
  const errors: string[] = [];
  
  if (!req.decision_id) {
    errors.push('decision_id is required');
  }
  
  if (!req.source_type) {
    errors.push('source_type is required');
  }
  
  if (!req.reference) {
    errors.push('reference is required');
  }
  
  if (!req.validity_period) {
    errors.push('validity_period is required');
  } else {
    if (!req.validity_period.start) {
      errors.push('validity_period.start is required');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate review creation request
 */
export function validateCreateReview(req: CreateReviewRequest): ValidationResult {
  const errors: string[] = [];
  
  if (!req.decision_id) {
    errors.push('decision_id is required');
  }
  
  if (!req.expected_vs_observed) {
    errors.push('expected_vs_observed is required');
  }
  
  if (typeof req.foreseeable_deviation !== 'boolean') {
    errors.push('foreseeable_deviation is required');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Check if endpoint is forbidden
 */
export function isForbiddenEndpoint(path: string): boolean {
  const normalizedPath = path.toLowerCase();
  return FORBIDDEN_ENDPOINTS.some(forbidden => 
    normalizedPath.includes(forbidden)
  );
}

/**
 * Create 422 Unprocessable Decision error
 */
export function createUnprocessableError(missing: string[]): UnprocessableDecisionError {
  return {
    code: 'UNPROCESSABLE_DECISION',
    message: 'Decision cannot be processed due to missing requirements',
    status: 422,
    missing,
    details: missing,
  };
}

/**
 * Create validation error
 */
export function createValidationError(errors: string[]): ApiError {
  return {
    code: 'VALIDATION_ERROR',
    message: 'Request validation failed',
    status: 400,
    details: errors,
  };
}

/**
 * Create forbidden concept error
 */
export function createForbiddenConceptError(concepts: string[]): ApiError {
  return {
    code: 'FORBIDDEN_CONCEPT',
    message: 'Request contains forbidden concepts',
    status: 400,
    details: concepts.map(c => `Forbidden concept: ${c}`),
  };
}
