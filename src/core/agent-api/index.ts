/**
 * AGENT-NATIVE API
 * 
 * Machine-first. Deterministic. No guessing.
 * "AI-agenter vill inte tolka – de vill resolva."
 */

// Schemas
export {
  type ScopeEnvelope,
  type TimeScope,
  type OrientationEnvelope,
  type ImportanceEnvelope,
  type UncertaintyEnvelope,
  type RelationsEnvelope,
  type AgentResponse,
  type SemanticConflictError,
  type GraphNodeResponse,
  type GraphTraversalResponse,
  type SemanticAnswerResponse,
  type IndexResponse,
  type DecisionResolveResponse,
  validateResponseCompleteness,
  createSemanticConflict,
} from './schemas';

// Guardrails
export {
  AGENT_POLICY_HEADER,
  DEFAULT_POLICY,
  parseAgentPolicy,
  checkContentAgainstPolicy,
  runGuardrailCheck,
  createGuardrailResponse,
  requirePolicyHeader,
  type PolicyFlag,
  type AgentPolicy,
  type PolicyViolation,
  type GuardrailResult,
} from './guardrails';

// SDK
export { 
  TruthEngineSDK, 
  createAgentSDK,
  SDK_FUNCTIONS,
  SDK_CONTRACT,
  type AgentSDKConfig,
  type SDKResponse,
} from './sdk';

// Documentation
export {
  AGENT_DOCS,
  MACHINE_FIRST_DECLARATION,
  generateMarkdownDocs,
} from './docs';

/**
 * API VERSION
 */
export const AGENT_API_VERSION = '1.0.0' as const;

/**
 * ENDPOINT REGISTRY
 */
export const ENDPOINTS = {
  // Core resolve
  'POST /v1/resolve': 'Query → Canonical Answer (main method)',
  
  // Direct lookup
  'GET /v1/questions/{question_id}': 'Ultra-fast lookup by ID (<50ms)',
  
  // Graph traversal
  'GET /v1/graph/node/{node_id}': 'Get full graph node',
  'GET /v1/graph/traverse': 'Traverse graph from node',
  
  // Semantic retrieval
  'GET /v1/semantic/answer': 'Get structured answer',
  
  // Index access
  'GET /v1/index/{index_id}': 'Get computed index value',
  
  // Decision underlag
  'GET /v1/decision/{graph_id}/resolve': 'Resolve decision graph (never recommends)',
  
  // Enterprise
  'POST /v1/datasets/export': 'Export full dataset (enterprise)',
} as const;

/**
 * API RULES
 */
export const API_RULES = {
  no_free_language: true,
  no_summaries: true,
  always_schema: true,
  always_uncertainty: true,
  always_guarantees: true,
  deterministic: true,
  version_pinned: true,
  cache_stable: true,
} as const;

/**
 * RATE LIMIT TIERS
 */
export const RATE_LIMIT_TIERS = {
  free: {
    agent_type: 'general',
    requests_per_minute: 10,
    answer_depth: 'short',
    numerical_summaries: false,
    dataset_export: false,
  },
  pro: {
    agent_type: 'journalism',
    requests_per_minute: 100,
    answer_depth: 'full',
    numerical_summaries: true,
    dataset_export: false,
  },
  pro_plus: {
    agent_type: 'finance',
    requests_per_minute: 500,
    answer_depth: 'full',
    numerical_summaries: true,
    dataset_export: false,
  },
  enterprise: {
    agent_type: 'policy',
    requests_per_minute: 1000,
    answer_depth: 'full',
    numerical_summaries: true,
    dataset_export: true,
    historical_access: true,
  },
} as const;

/**
 * TRUST HANDSHAKE
 */
export const TRUST_HANDSHAKE = {
  guarantees: {
    no_opinion: true,
    no_speculation: true,
    source_traceable: true,
    revision_logged: true,
  },
  response_headers: [
    'X-DISSG-Trust-Score',
    'X-DISSG-Confidence-Band',
    'X-DISSG-Safe-Autocite',
    'X-DISSG-Hallucination-Risk',
    'X-DISSG-Request-ID',
  ],
  contract_url: 'https://dissg.global/api/contract',
} as const;

/**
 * QUICK SDK FACTORY
 */
import { TruthEngineSDK } from './sdk';

export function createSDK(baseUrl: string = 'https://api.dissg.global', apiKey?: string) {
  return new TruthEngineSDK({ baseUrl, apiKey });
}
