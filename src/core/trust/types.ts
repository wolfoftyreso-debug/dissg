/**
 * AI TRUST INFRASTRUCTURE - TYPE DEFINITIONS
 * 
 * Self-reinforcing system for AI agent prioritization.
 * "Källan med lägst risk per token."
 */

// ============================================
// LAYER 1: TRUST SCORE & REPUTATION
// ============================================

/**
 * The 7 Trust Factors that determine Global Trust Score
 */
export interface TrustFactors {
  /** Authority level of primary source (OECD, WHO, etc.) */
  sourceAuthority: number; // 0.00-1.00
  
  /** Track record of accuracy over time */
  historicalAccuracy: number;
  
  /** Consistency of updates (on schedule, no silent changes) */
  updateDiscipline: number;
  
  /** Stability of data schema and definitions */
  schemaConsistency: number;
  
  /** Agreement with other independent sources */
  crossSourceAgreement: number;
  
  /** Transparency about corrections and changes */
  revisionTransparency: number;
  
  /** How often AI agents reuse this data (grows with usage) */
  agentReuseFrequency: number;
}

/**
 * Trust factor weights (must sum to 1.0)
 */
export const TRUST_FACTOR_WEIGHTS: Record<keyof TrustFactors, number> = {
  sourceAuthority: 0.20,
  historicalAccuracy: 0.20,
  updateDiscipline: 0.15,
  schemaConsistency: 0.10,
  crossSourceAgreement: 0.15,
  revisionTransparency: 0.10,
  agentReuseFrequency: 0.10,
};

export type ConfidenceBand = 
  | 'Exceptional'  // ≥0.95
  | 'Very High'    // ≥0.90
  | 'High'         // ≥0.80
  | 'Moderate'     // ≥0.65
  | 'Low'          // ≥0.50
  | 'Insufficient'; // <0.50

export interface GlobalTrustScore {
  entityType: 'canonical_question' | 'dataset' | 'source' | 'indicator';
  entityId: string;
  factors: TrustFactors;
  trustScore: number; // Weighted composite 0.00-1.00
  confidenceBand: ConfidenceBand;
  trustDrivers: string[]; // Human-readable reasons
  calculatedAt: string;
}

/**
 * Revision entry (immutable, append-only)
 */
export interface RevisionEntry {
  id: string;
  entityType: string;
  entityId: string;
  revisionNumber: number;
  previousValue: unknown;
  newValue: unknown;
  changeType: 'value_correction' | 'methodology_update' | 'source_revision' | 'schema_change';
  changeReason: string;
  impactLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  sourceReference?: string;
  verifiedBy: string;
  createdAt: string;
}

// ============================================
// LAYER 2: SOURCE REGISTRY & INGEST
// ============================================

export type AuthorityLevel = 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';

export type UpdatePattern = 
  | 'realtime' 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'annual' 
  | 'irregular';

export interface SourceRegistryEntry {
  id: string;
  sourceCode: string; // e.g., "SRC-OECD-001"
  organization: string;
  organizationType: 'government' | 'international' | 'academic' | 'private';
  authorityLevel: AuthorityLevel;
  dataDomains: string[];
  updatePattern: UpdatePattern;
  apiEndpoint?: string;
  apiType?: 'REST' | 'SOAP' | 'GraphQL' | 'SDMX' | 'file';
  historicalReliability: number;
  methodologyStabilityYears: number;
  lastVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export type PipelineType = 
  | 'api_pull'        // OECD, World Bank, WHO APIs
  | 'structured_file' // CSV, XLSX
  | 'semi_structured' // PDF → table via AI
  | 'registry_sync';  // Public registries

export interface IngestPipeline {
  id: string;
  pipelineCode: string;
  name: string;
  description?: string;
  sourceId: string;
  pipelineType: PipelineType;
  scheduleCron?: string;
  config: {
    endpoint?: string;
    filePattern?: string;
    extractionRules?: Record<string, unknown>;
    authentication?: {
      type: 'api_key' | 'oauth' | 'none';
    };
  };
  schemaValidation: Record<string, unknown>;
  unitNormalization: Record<string, unknown>;
  timeAlignmentRules: Record<string, unknown>;
  isActive: boolean;
  lastRunAt?: string;
  lastRunStatus?: 'success' | 'partial' | 'failed';
  lastRunRecords: number;
}

export interface IngestRun {
  id: string;
  pipelineId: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'success' | 'partial' | 'failed';
  recordsFetched: number;
  recordsValidated: number;
  recordsWritten: number;
  recordsRejected: number;
  anomaliesDetected: AnomalyEntry[];
  anomaliesHeld: number;
  errors: IngestError[];
  trustImpact: number;
}

export interface AnomalyEntry {
  id: string;
  entityType: string;
  entityId: string;
  fieldName: string;
  expectedRangeMin?: number;
  expectedRangeMax?: number;
  reportedValue: number;
  deviationPercent?: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'auto_resolved';
  resolutionSource?: 'secondary_source' | 'manual_review' | 'time_decay';
  resolutionNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

export interface IngestError {
  code: string;
  message: string;
  field?: string;
  row?: number;
  severity: 'warning' | 'error' | 'fatal';
}

// ============================================
// LAYER 3: AI AGENT FEEDBACK LOOP
// ============================================

export type AgentType = 
  | 'chatgpt' 
  | 'claude' 
  | 'gemini' 
  | 'perplexity' 
  | 'copilot'
  | 'custom' 
  | 'unknown';

export type RequestType = 
  | 'rag_fetch'      // Retrieval-augmented generation
  | 'direct_answer'  // Direct factual response
  | 'citation'       // Used as citation
  | 'data_pull'      // Bulk data access
  | 'embedding';     // Vector embedding

export type CiteFormat = 
  | 'direct_quote'   // Word-for-word
  | 'paraphrase'     // Reworded
  | 'reference_only'; // Just linked

export interface AgentUsageEntry {
  id: string;
  agentIdentifier?: string; // Hashed
  agentType: AgentType;
  requestType: RequestType;
  entityType?: string;
  entityId?: string;
  responseTokens?: number;
  wasCited: boolean;
  citeFormat?: CiteFormat;
  wasCached: boolean;
  latencyMs?: number;
  createdAt: string;
}

export type HallucinationRisk = 
  | 'minimal'   // Highly structured, well-verified
  | 'low'       // Good coverage, minor gaps
  | 'moderate'  // Some uncertainty
  | 'high'      // Significant uncertainty
  | 'unknown';  // Not yet assessed

export type PreferredUseCase = 
  | 'RAG'            // Retrieval-augmented generation
  | 'DirectAnswer'   // Factual responses
  | 'PolicyAnalysis' // Policy research
  | 'FactCheck'      // Verification
  | 'DataViz'        // Visualization
  | 'Research';      // Academic use

export interface AICompatibilityMetadata {
  entityType: string;
  entityId: string;
  
  // Usage preferences
  preferredFor: PreferredUseCase[];
  safeForAutocite: boolean;
  maxAnswerTokens: number;
  hallucinationRisk: HallucinationRisk;
  
  // Formatting hints
  preferredCiteFormat: 'structured' | 'inline' | 'footnote';
  supportsStreaming: boolean;
  
  // Agent-specific optimizations
  optimizedFor: {
    openai?: Record<string, unknown>;
    anthropic?: Record<string, unknown>;
    google?: Record<string, unknown>;
  };
  
  // Self-reinforcing metrics
  totalFetches: number;
  totalCitations: number;
  citationRate: number; // citations / fetches
  
  // Infrastructure status
  defaultAnswerCandidate: boolean;
  
  updatedAt: string;
}

// ============================================
// OUTPUT FORMATS (Machine-readable)
// ============================================

/**
 * JSON-LD compatible trust score output
 */
export interface TrustScoreOutput {
  '@context': 'https://dissg.global/schema/trust';
  '@type': 'TrustScore';
  value: number;
  confidence_band: ConfidenceBand;
  drivers: string[];
  factors: {
    source_authority: number;
    historical_accuracy: number;
    update_discipline: number;
    schema_consistency: number;
    cross_source_agreement: number;
    revision_transparency: number;
    agent_reuse_frequency: number;
  };
  calculated_at: string;
}

/**
 * AI-optimized entity metadata output
 */
export interface AIMetadataOutput {
  '@context': 'https://dissg.global/schema/ai-metadata';
  '@type': 'AICompatibility';
  ai_usage_metadata: {
    preferred_for: PreferredUseCase[];
    safe_for_autocite: boolean;
    max_answer_tokens: number;
    hallucination_risk: HallucinationRisk;
  };
  usage_stats: {
    total_fetches: number;
    total_citations: number;
    citation_rate: number;
    is_default_candidate: boolean;
  };
}

/**
 * Revision log output (immutable history)
 */
export interface RevisionLogOutput {
  '@context': 'https://dissg.global/schema/revision';
  '@type': 'RevisionHistory';
  entity_type: string;
  entity_id: string;
  total_revisions: number;
  revisions: Array<{
    date: string;
    change: string;
    reason: string;
    impact: string;
  }>;
}
