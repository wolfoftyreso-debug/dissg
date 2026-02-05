/**
 * ONTOLOGY LOCKS
 * 
 * Ontology versions are immutable.
 * New version requires:
 * - Public diff
 * - Backward compatibility
 * - Delay (minimum 90 days)
 * 
 * API version is bound to ontology version.
 * 
 * "It should be easier to read the ontology than to change it."
 */

import type { OntologyVersion, OntologyChangeRequest } from './types';

// ============================================================================
// ONTOLOGY CHANGE CONSTRAINTS
// ============================================================================

export const ONTOLOGY_CHANGE_CONSTRAINTS = {
  minimum_delay_days: 90,
  requires_public_diff: true,
  requires_backward_compatibility: true,
  requires_steward_approval: true,
  max_changes_per_year: 4, // Quarterly at most
} as const;

// ============================================================================
// VERSION MANAGEMENT
// ============================================================================

export function createOntologyVersion(
  version: string,
  apiVersion: string
): OntologyVersion {
  const now = new Date().toISOString();
  return {
    version,
    immutable: true,
    created_at: now,
    locked_at: now,
    api_version: apiVersion,
  };
}

export function validateOntologyChangeRequest(
  request: Omit<OntologyChangeRequest, 'status'>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (request.delay_days < ONTOLOGY_CHANGE_CONSTRAINTS.minimum_delay_days) {
    errors.push(
      `Delay must be at least ${ONTOLOGY_CHANGE_CONSTRAINTS.minimum_delay_days} days, got ${request.delay_days}`
    );
  }
  
  if (!request.public_diff_url) {
    errors.push('Public diff URL is required');
  }
  
  if (!request.backward_compatible) {
    errors.push('Breaking changes are not allowed. Ontology changes must be backward compatible.');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// API VERSION BINDING
// ============================================================================

export interface APIVersionBinding {
  api_version: string;
  ontology_version: string;
  bound_at: string;
  immutable: true;
}

export function bindAPIVersion(
  apiVersion: string,
  ontologyVersion: string
): APIVersionBinding {
  return {
    api_version: apiVersion,
    ontology_version: ontologyVersion,
    bound_at: new Date().toISOString(),
    immutable: true,
  };
}

export function validateAPIVersionBinding(
  requestedApiVersion: string,
  requestedOntologyVersion: string,
  bindings: APIVersionBinding[]
): { valid: boolean; error: string | null } {
  const binding = bindings.find(b => b.api_version === requestedApiVersion);
  
  if (!binding) {
    return { valid: false, error: `API version ${requestedApiVersion} not found` };
  }
  
  if (binding.ontology_version !== requestedOntologyVersion) {
    return {
      valid: false,
      error: `API version ${requestedApiVersion} is bound to ontology ${binding.ontology_version}, not ${requestedOntologyVersion}`,
    };
  }
  
  return { valid: true, error: null };
}

// ============================================================================
// LOCK STATUS
// ============================================================================

export const ONTOLOGY_LOCK_PRINCIPLE = {
  statement: 'It should be easier to read the ontology than to change it.',
  enforcement: 'technical',
  
  reading: {
    access: 'public',
    authentication: 'none',
    rate_limit: 'generous',
  },
  
  changing: {
    access: 'steward_only',
    delay: '90_days_minimum',
    approval: 'multi_party',
    reversibility: 'not_possible',
  },
} as const;
