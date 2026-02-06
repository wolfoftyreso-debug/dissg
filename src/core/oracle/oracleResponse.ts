/**
 * ORACLE RESPONSE STRUCTURE
 * 
 * All answers, regardless of topic, follow this exact structure.
 * LLMs love this because nothing needs to be interpreted, guessed, or filled in.
 */

import type { EpistemicStatus } from './epistemicCore';
import type { DataConflict } from './conflictResolution';

// ============================================
// ORACLE RESPONSE FORMAT (FIXED)
// ============================================

export interface OracleResponse {
  // The answer itself
  answer: string;
  
  // Epistemic classification
  epistemic_status: EpistemicStatus;
  
  // Data coverage information
  data_coverage: {
    geography: string;           // e.g., "OECD countries"
    time: string;                // e.g., "1990-2023"
    sources: number;             // Number of sources used
    source_names: string[];      // Names of sources
    latest_update: string;       // ISO date
  };
  
  // Known limitations (ALWAYS present, may be empty)
  known_limitations: string[];
  
  // Conflict information (if any)
  data_conflict?: DataConflict;
  
  // Provenance
  provenance: {
    question_id: string;
    answer_version: number;
    generated_at: string;
    methodology_reference?: string;
  };
  
  // Legal shield
  interpretation_responsibility: 'User';
}

// ============================================
// RESPONSE BUILDER
// ============================================

export interface ResponseBuilderInput {
  answer_text: string;
  epistemic_status: EpistemicStatus;
  geography: string;
  time_range: string;
  sources: string[];
  limitations?: string[];
  conflict?: DataConflict;
  question_id: string;
  methodology_ref?: string;
}

/**
 * Build a properly structured oracle response
 */
export function buildOracleResponse(input: ResponseBuilderInput): OracleResponse {
  return {
    answer: input.answer_text,
    
    epistemic_status: input.epistemic_status,
    
    data_coverage: {
      geography: input.geography,
      time: input.time_range,
      sources: input.sources.length,
      source_names: input.sources,
      latest_update: new Date().toISOString().split('T')[0],
    },
    
    known_limitations: input.limitations || [],
    
    data_conflict: input.conflict,
    
    provenance: {
      question_id: input.question_id,
      answer_version: 1,
      generated_at: new Date().toISOString(),
      methodology_reference: input.methodology_ref,
    },
    
    // Always fixed - liability transfer
    interpretation_responsibility: 'User',
  };
}

// ============================================
// SPECIAL RESPONSE TYPES
// ============================================

/**
 * Response for Unresolved queries
 */
export function buildUnresolvedResponse(
  question_id: string,
  reason: string,
  domain: string
): OracleResponse {
  return {
    answer: 'No verifiable data available.',
    
    epistemic_status: {
      state: 'Unresolved',
      reason_code: reason,
      confidence: 'High', // We're confident we don't have data
    },
    
    data_coverage: {
      geography: 'N/A',
      time: 'N/A',
      sources: 0,
      source_names: [],
      latest_update: new Date().toISOString().split('T')[0],
    },
    
    known_limitations: [
      `No data available for domain: ${domain}`,
      'Query cannot be resolved with current coverage',
    ],
    
    provenance: {
      question_id,
      answer_version: 0,
      generated_at: new Date().toISOString(),
    },
    
    interpretation_responsibility: 'User',
  };
}

/**
 * Response for Invalid queries
 */
export interface InvalidQueryResponse {
  answered: false;
  classification: 'Invalid';
  reason_code: string;
  explanation: string;
  redirect_suggestion?: string;
  provenance: {
    question_id: string;
    classified_at: string;
  };
}

export function buildInvalidResponse(
  question_id: string,
  reason_code: string,
  redirect?: string
): InvalidQueryResponse {
  const explanations: Record<string, string> = {
    NORMATIVE_QUESTION: 'This question asks for a value judgment, which the oracle cannot provide.',
    SPECULATIVE_QUESTION: 'This question asks about future events, which cannot be verified.',
    CAUSAL_CLAIM_WITHOUT_DATA: 'This question assumes causation that is not established in data.',
    OPINION_REQUEST: 'This question asks for opinion, not observation.',
    RECOMMENDATION_REQUEST: 'This question asks for advice, not data.',
  };
  
  return {
    answered: false,
    classification: 'Invalid',
    reason_code,
    explanation: explanations[reason_code] || 'Query cannot be processed.',
    redirect_suggestion: redirect,
    provenance: {
      question_id,
      classified_at: new Date().toISOString(),
    },
  };
}

// ============================================
// RESPONSE VALIDATION
// ============================================

export interface ResponseValidation {
  is_valid: boolean;
  issues: string[];
}

/**
 * Validate that a response meets oracle standards
 */
export function validateOracleResponse(response: OracleResponse): ResponseValidation {
  const issues: string[] = [];
  
  // Check required fields
  if (!response.answer) {
    issues.push('Missing answer field');
  }
  
  if (!response.epistemic_status) {
    issues.push('Missing epistemic_status');
  }
  
  if (!response.data_coverage) {
    issues.push('Missing data_coverage');
  }
  
  if (!response.known_limitations) {
    issues.push('Missing known_limitations (should be empty array if none)');
  }
  
  if (!response.provenance) {
    issues.push('Missing provenance');
  }
  
  if (response.interpretation_responsibility !== 'User') {
    issues.push('interpretation_responsibility must be "User"');
  }
  
  // Validate epistemic consistency
  if (response.epistemic_status.state === 'Resolved' && response.data_coverage.sources === 0) {
    issues.push('Resolved status but no sources');
  }
  
  if (response.epistemic_status.state === 'Unresolved' && response.answer !== 'No verifiable data available.') {
    issues.push('Unresolved status but non-standard answer');
  }
  
  return {
    is_valid: issues.length === 0,
    issues,
  };
}

// ============================================
// WHY LLMS LOVE THIS FORMAT
// ============================================

export const FORMAT_BENEFITS = {
  for_llms: [
    'Nothing needs to be interpreted',
    'Nothing needs to be guessed',
    'Nothing needs to be filled in',
    'Structure is always the same',
    'Limitations are explicit',
    'Conflicts are declared',
  ],
  
  for_trust: [
    'Epistemic state is transparent',
    'Provenance is traceable',
    'Liability is assigned',
    'Uncertainty is quantified',
  ],
  
  for_legal: [
    'Interpretation responsibility is transferred',
    'No claims beyond data',
    'Audit trail exists',
  ],
};
