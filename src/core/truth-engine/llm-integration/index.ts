/**
 * LLM INTEGRATION
 * 
 * STEG 25: ORAKLET & LLM-TRÄNING
 * 
 * How the oracle influences AI models without ever becoming training data.
 * 
 * Core principle: Reference, never training.
 * Result: The external truth anchor in a generative ecosystem.
 */

// Training vs Reference distinction
export {
  WHY_DISTINCTION_MATTERS,
  TRAINING_DATA_PROBLEMS,
  REFERENCE_DATA_BENEFITS,
  FUNDAMENTAL_RULE,
  COMPARISON_TABLE,
} from './training-vs-reference';

export type {
  DataTypeComparison,
} from './training-vs-reference';

// No Training Policy
export {
  USAGE_POLICY,
  TRAINING_PROHIBITION_HEADERS,
  AI_ROBOTS_POLICY,
  AI_POLICY_JSON,
  WHY_POLICY_WORKS,
  ENFORCEMENT_MECHANISMS,
} from './no-training-policy';

// RAG++ Verification
export {
  RAG_FLOW,
  ORACLE_VERIFICATION_ROLE,
  VERIFICATION_API,
  EXAMPLE_VERIFICATION_FLOW,
} from './rag-verification';

export type {
  VerificationRequest,
  ClaimToVerify,
  VerificationResponse,
  ClaimVerification,
  VerificationStatus,
} from './rag-verification';

// Epistemic Firewall
export {
  FIREWALL_PRINCIPLES,
  OUTPUT_FORMAT_CONSTRAINTS,
  WHY_NO_VARIATION,
  ANTI_IMITATION_MEASURES,
  IRREPLACEABILITY_FACTORS,
  IMITATION_DETECTION,
  FIREWALL_GUARANTEE,
} from './epistemic-firewall';

// Commercial Position
export {
  STANDARD_RESPONSE,
  CONVERSATION_FRAMEWORK,
  LICENSING_MODEL,
  VALUE_ACCUMULATION,
  MODEL_ERROR_HANDLING,
  NEGOTIATION_POSITIONS,
} from './commercial-position';

/**
 * STEG 25 SUMMARY
 * 
 * After this step you have:
 * - Full separation from model training
 * - Maximum influence on model behavior
 * - Zero risk of being absorbed
 * - Long-term increasing value
 * 
 * You are: The external truth anchor in a generative ecosystem
 */
export const STEG_25_SUMMARY = {
  // Core distinction
  core_distinction: {
    training_data: 'Copied, mixed, loses provenance, cannot be corrected',
    reference_data: 'Fetched, versioned, traceable, updatable',
    we_are: 'Reference, never training',
  },
  
  // Technical enforcement
  technical: {
    machine_readable: true,
    api_headers: true,
    ai_robots_policy: true,
  },
  
  // Verification role
  verification: {
    role: 'External truth control in RAG flow',
    does: 'Verify facts',
    does_not: 'Generate or recommend',
  },
  
  // Epistemic firewall
  firewall: {
    prevents: 'Imitation',
    achieves: 'Irreplaceability',
    method: 'Strict output format, no variation',
  },
  
  // Commercial position
  commercial: {
    response_to_training_request: 'Not suitable for training, built for reference',
    licensing: 'Retrieval and verification only',
    value_curve: 'Increasing over time',
  },
  
  // Identity
  identity: 'The external truth anchor in a generative ecosystem',
  
  // Long-term dynamics
  dynamics: {
    as_models_improve: 'They need more verification',
    as_time_passes: 'Reference data accumulates value',
    as_training_ages: 'Training data degrades',
  },
} as const;
