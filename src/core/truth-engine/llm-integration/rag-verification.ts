/**
 * RAG++ VERIFICATION LAYER
 * 
 * STEG 25: ORACLE AS EXTERNAL TRUTH CONTROL
 * 
 * Future LLMs will:
 * - Generate answers
 * - Verify answers
 * - Adjust formulation
 * - Present results
 * 
 * We position ourselves in the verification step.
 */

/**
 * THE RAG++ FLOW
 */
export const RAG_FLOW = {
  step_1: {
    actor: 'LLM',
    action: 'Generate draft answer',
    oracle_role: 'none',
  },
  step_2: {
    actor: 'LLM',
    action: 'Query oracle for verification',
    oracle_role: 'receive_query',
  },
  step_3: {
    actor: 'Oracle',
    action: 'Return verified facts',
    oracle_role: 'primary',
  },
  step_4: {
    actor: 'LLM',
    action: 'Produce final answer with verification',
    oracle_role: 'attribution',
  },
} as const;

/**
 * WHAT ORACLE DOES IN VERIFICATION
 */
export const ORACLE_VERIFICATION_ROLE = {
  does: [
    'Confirm or deny specific claims',
    'Provide verified data points',
    'Indicate uncertainty levels',
    'Supply source attribution',
    'Declare knowledge boundaries',
  ],
  
  does_not: [
    'Correct language or style',
    'Suggest better answers',
    'Generate alternative responses',
    'Evaluate quality of LLM output',
    'Provide recommendations',
  ],
  
  identity: 'Verification instance, not generator',
} as const;

/**
 * VERIFICATION REQUEST FORMAT
 */
export interface VerificationRequest {
  readonly claims: ClaimToVerify[];
  readonly context: string;
  readonly source_model: string;
  readonly request_id: string;
}

export interface ClaimToVerify {
  readonly claim_id: string;
  readonly statement: string;
  readonly domain: string;
  readonly specificity: 'exact' | 'approximate' | 'directional';
}

/**
 * VERIFICATION RESPONSE FORMAT
 */
export interface VerificationResponse {
  readonly request_id: string;
  readonly timestamp: string;
  readonly verifications: ClaimVerification[];
  readonly oracle_version: string;
  readonly data_freshness: string;
}

export interface ClaimVerification {
  readonly claim_id: string;
  readonly status: VerificationStatus;
  readonly confidence: number;
  readonly verified_value?: string | number;
  readonly source: string;
  readonly limitations: string[];
}

export type VerificationStatus = 
  | 'verified'      // Claim matches oracle data
  | 'contradicted'  // Claim conflicts with oracle data
  | 'unverifiable'  // Oracle has no data on this
  | 'partial'       // Partially correct
  | 'outdated';     // Was true, may have changed

/**
 * API SPECIFICATION
 */
export const VERIFICATION_API = {
  endpoint: '/api/v1/verify',
  method: 'POST',
  
  headers: {
    'Content-Type': 'application/json',
    'X-Verification-Mode': 'strict',
  },
  
  rate_limit: '1000 requests/minute',
  
  response_time_sla: '< 200ms for simple claims',
} as const;

/**
 * EXAMPLE FLOW
 */
export const EXAMPLE_VERIFICATION_FLOW = {
  llm_draft: 'Sweden had an unemployment rate of 7.5% in 2023',
  
  oracle_query: {
    claims: [{
      claim_id: 'c1',
      statement: 'Sweden unemployment rate 2023 = 7.5%',
      domain: 'labor_market',
      specificity: 'exact',
    }],
    context: 'labor market analysis',
    source_model: 'example-llm',
    request_id: 'req-123',
  },
  
  oracle_response: {
    request_id: 'req-123',
    timestamp: '2024-01-15T10:00:00Z',
    verifications: [{
      claim_id: 'c1',
      status: 'partial',
      confidence: 0.9,
      verified_value: '7.7%',
      source: 'SCB Labor Force Survey 2023-Q4',
      limitations: ['Annual average, quarterly variation exists'],
    }],
    oracle_version: '2.1.0',
    data_freshness: '2024-01-10',
  },
  
  llm_final: 'Sweden had an unemployment rate of 7.7% in 2023 (Source: SCB)',
} as const;
