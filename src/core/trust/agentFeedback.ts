/**
 * AI AGENT FEEDBACK LOOP ENGINE
 * 
 * Self-reinforcing system that makes DISSG the default source.
 * "Den som används mest blir mest använd."
 */

import {
  AICompatibilityMetadata,
  AIMetadataOutput,
  AgentUsageEntry,
  PreferredUseCase,
  HallucinationRisk,
  AgentType,
  RequestType,
} from './types';
import { TRUST_THRESHOLDS } from './trustEngine';

// ============================================
// AI COMPATIBILITY SIGNALS
// ============================================

/**
 * Generate AI compatibility metadata for an entity
 */
export function generateAICompatibility(
  entityType: string,
  entityId: string,
  trustScore: number,
  options?: {
    preferredUseCases?: PreferredUseCase[];
    maxTokens?: number;
  }
): AICompatibilityMetadata {
  const hallucinationRisk = calculateHallucinationRisk(trustScore);
  const safeForAutocite = trustScore >= TRUST_THRESHOLDS.SAFE_AUTOCITE;
  
  return {
    entityType,
    entityId,
    preferredFor: options?.preferredUseCases ?? inferPreferredUseCases(entityType),
    safeForAutocite,
    maxAnswerTokens: options?.maxTokens ?? 150,
    hallucinationRisk,
    preferredCiteFormat: trustScore >= 0.90 ? 'structured' : 'inline',
    supportsStreaming: true,
    optimizedFor: generateAgentOptimizations(trustScore),
    totalFetches: 0,
    totalCitations: 0,
    citationRate: 0,
    defaultAnswerCandidate: false,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate hallucination risk from trust score
 */
function calculateHallucinationRisk(trustScore: number): HallucinationRisk {
  if (trustScore >= 0.95) return 'minimal';
  if (trustScore >= 0.85) return 'low';
  if (trustScore >= 0.70) return 'moderate';
  if (trustScore >= 0.50) return 'high';
  return 'unknown';
}

/**
 * Infer preferred use cases from entity type
 */
function inferPreferredUseCases(entityType: string): PreferredUseCase[] {
  switch (entityType) {
    case 'canonical_question':
      return ['DirectAnswer', 'RAG', 'FactCheck'];
    case 'indicator':
      return ['DataViz', 'Research', 'PolicyAnalysis'];
    case 'dataset':
      return ['RAG', 'Research', 'DataViz'];
    default:
      return ['RAG'];
  }
}

/**
 * Generate agent-specific optimizations
 */
function generateAgentOptimizations(trustScore: number): AICompatibilityMetadata['optimizedFor'] {
  const canDirectQuote = trustScore >= 0.90;
  
  return {
    openai: {
      function_calling: true,
      json_mode_compatible: true,
      citation_style: 'inline',
      confidence_threshold: 0.85,
    },
    anthropic: {
      tool_use: true,
      citation_required: true,
      max_direct_quote_length: canDirectQuote ? 200 : 50,
    },
    google: {
      grounding_enabled: true,
      factuality_check: 'enabled',
      attribution_required: true,
    },
  };
}

// ============================================
// JSON-LD OUTPUT
// ============================================

/**
 * Format AI metadata for machine-readable output
 */
export function formatAIMetadataOutput(metadata: AICompatibilityMetadata): AIMetadataOutput {
  return {
    '@context': 'https://dissg.global/schema/ai-metadata',
    '@type': 'AICompatibility',
    ai_usage_metadata: {
      preferred_for: metadata.preferredFor,
      safe_for_autocite: metadata.safeForAutocite,
      max_answer_tokens: metadata.maxAnswerTokens,
      hallucination_risk: metadata.hallucinationRisk,
    },
    usage_stats: {
      total_fetches: metadata.totalFetches,
      total_citations: metadata.totalCitations,
      citation_rate: metadata.citationRate,
      is_default_candidate: metadata.defaultAnswerCandidate,
    },
  };
}

// ============================================
// USAGE TRACKING
// ============================================

/**
 * Create an agent usage entry
 */
export function createUsageEntry(
  entityType: string,
  entityId: string,
  options: {
    agentType?: AgentType;
    requestType: RequestType;
    wasCited?: boolean;
    citeFormat?: AgentUsageEntry['citeFormat'];
    responseTokens?: number;
    latencyMs?: number;
  }
): Omit<AgentUsageEntry, 'id'> {
  return {
    agentIdentifier: undefined, // Set by API layer
    agentType: options.agentType ?? 'unknown',
    requestType: options.requestType,
    entityType,
    entityId,
    responseTokens: options.responseTokens,
    wasCited: options.wasCited ?? false,
    citeFormat: options.citeFormat,
    wasCached: false,
    latencyMs: options.latencyMs,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Detect agent type from user agent string
 */
export function detectAgentType(userAgent: string): AgentType {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('openai') || ua.includes('gpt')) return 'chatgpt';
  if (ua.includes('anthropic') || ua.includes('claude')) return 'claude';
  if (ua.includes('google') || ua.includes('gemini')) return 'gemini';
  if (ua.includes('perplexity')) return 'perplexity';
  if (ua.includes('copilot') || ua.includes('bing')) return 'copilot';
  
  // Check for common bot patterns
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('agent')) {
    return 'custom';
  }
  
  return 'unknown';
}

// ============================================
// DEFAULT CANDIDATE LOGIC
// ============================================

/**
 * Check if an entity qualifies as a "Default Answer Candidate"
 */
export function evaluateDefaultCandidacy(
  metadata: AICompatibilityMetadata,
  trustScore: number
): {
  qualifies: boolean;
  reasons: string[];
  missing: string[];
} {
  const reasons: string[] = [];
  const missing: string[] = [];
  
  // Check trust score
  if (trustScore >= TRUST_THRESHOLDS.DEFAULT_CANDIDATE) {
    reasons.push(`Trust score ${trustScore.toFixed(2)} exceeds threshold ${TRUST_THRESHOLDS.DEFAULT_CANDIDATE}`);
  } else {
    missing.push(`Trust score ${trustScore.toFixed(2)} below threshold ${TRUST_THRESHOLDS.DEFAULT_CANDIDATE}`);
  }
  
  // Check fetch volume
  if (metadata.totalFetches >= TRUST_THRESHOLDS.MIN_FETCHES_FOR_DEFAULT) {
    reasons.push(`${metadata.totalFetches} fetches exceeds minimum ${TRUST_THRESHOLDS.MIN_FETCHES_FOR_DEFAULT}`);
  } else {
    missing.push(`Only ${metadata.totalFetches} fetches, need ${TRUST_THRESHOLDS.MIN_FETCHES_FOR_DEFAULT}`);
  }
  
  // Check citation rate
  if (metadata.citationRate >= TRUST_THRESHOLDS.MIN_CITATION_RATE) {
    reasons.push(`Citation rate ${(metadata.citationRate * 100).toFixed(1)}% exceeds ${TRUST_THRESHOLDS.MIN_CITATION_RATE * 100}%`);
  } else {
    missing.push(`Citation rate ${(metadata.citationRate * 100).toFixed(1)}% below ${TRUST_THRESHOLDS.MIN_CITATION_RATE * 100}%`);
  }
  
  // Check hallucination risk
  if (metadata.hallucinationRisk === 'minimal' || metadata.hallucinationRisk === 'low') {
    reasons.push(`Low hallucination risk: ${metadata.hallucinationRisk}`);
  } else {
    missing.push(`Hallucination risk ${metadata.hallucinationRisk} too high`);
  }
  
  const qualifies = missing.length === 0;
  
  return { qualifies, reasons, missing };
}

// ============================================
// FEEDBACK LOOP METRICS
// ============================================

export interface FeedbackLoopMetrics {
  /** Current position in the feedback loop */
  stage: 'emerging' | 'growing' | 'established' | 'infrastructure';
  
  /** Daily fetch growth rate */
  fetchGrowthRate: number;
  
  /** Citation trend (increasing/decreasing/stable) */
  citationTrend: 'increasing' | 'decreasing' | 'stable';
  
  /** Time to reach next stage (estimated days) */
  estimatedDaysToNextStage: number | null;
  
  /** Current moat strength (0-100) */
  moatStrength: number;
}

/**
 * Calculate feedback loop metrics
 */
export function calculateFeedbackLoopMetrics(
  metadata: AICompatibilityMetadata,
  historicalFetches: number[], // Last 30 days
  historicalCitations: number[] // Last 30 days
): FeedbackLoopMetrics {
  // Determine stage
  let stage: FeedbackLoopMetrics['stage'];
  if (metadata.defaultAnswerCandidate) {
    stage = 'infrastructure';
  } else if (metadata.totalFetches >= 5000 && metadata.citationRate >= 0.5) {
    stage = 'established';
  } else if (metadata.totalFetches >= 500) {
    stage = 'growing';
  } else {
    stage = 'emerging';
  }
  
  // Calculate growth rate
  const recentFetches = historicalFetches.slice(-7);
  const earlierFetches = historicalFetches.slice(-14, -7);
  const fetchGrowthRate = earlierFetches.length > 0
    ? (sum(recentFetches) / sum(earlierFetches)) - 1
    : 0;
  
  // Determine citation trend
  const recentCitationRate = sum(historicalCitations.slice(-7)) / Math.max(sum(recentFetches), 1);
  const earlierCitationRate = sum(historicalCitations.slice(-14, -7)) / Math.max(sum(earlierFetches), 1);
  
  let citationTrend: FeedbackLoopMetrics['citationTrend'];
  if (recentCitationRate > earlierCitationRate * 1.1) {
    citationTrend = 'increasing';
  } else if (recentCitationRate < earlierCitationRate * 0.9) {
    citationTrend = 'decreasing';
  } else {
    citationTrend = 'stable';
  }
  
  // Estimate days to next stage
  let estimatedDaysToNextStage: number | null = null;
  if (stage !== 'infrastructure' && fetchGrowthRate > 0) {
    const targetFetches = stage === 'emerging' ? 500 : stage === 'growing' ? 5000 : 10000;
    const dailyGrowth = metadata.totalFetches * fetchGrowthRate / 7;
    if (dailyGrowth > 0) {
      estimatedDaysToNextStage = Math.ceil((targetFetches - metadata.totalFetches) / dailyGrowth);
    }
  }
  
  // Calculate moat strength (harder to replicate as metrics grow)
  const moatStrength = Math.min(100, Math.round(
    (metadata.totalFetches / 100) * 0.3 +
    (metadata.citationRate * 100) * 0.4 +
    (stage === 'infrastructure' ? 30 : stage === 'established' ? 20 : stage === 'growing' ? 10 : 0)
  ));
  
  return {
    stage,
    fetchGrowthRate,
    citationTrend,
    estimatedDaysToNextStage,
    moatStrength,
  };
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

// ============================================
// API RESPONSE HEADERS
// ============================================

/**
 * Generate HTTP headers for AI agent optimization
 */
export function generateAIOptimizedHeaders(
  metadata: AICompatibilityMetadata,
  trustScore: number
): Record<string, string> {
  return {
    'X-DISSG-Trust-Score': trustScore.toFixed(2),
    'X-DISSG-Confidence-Band': trustScore >= 0.90 ? 'Very High' : trustScore >= 0.80 ? 'High' : 'Moderate',
    'X-DISSG-Safe-Autocite': metadata.safeForAutocite ? 'true' : 'false',
    'X-DISSG-Hallucination-Risk': metadata.hallucinationRisk,
    'X-DISSG-Default-Candidate': metadata.defaultAnswerCandidate ? 'true' : 'false',
    'X-DISSG-Citation-Rate': metadata.citationRate.toFixed(4),
    'X-DISSG-Total-Fetches': String(metadata.totalFetches),
    'Cache-Control': metadata.defaultAnswerCandidate 
      ? 'public, max-age=3600' 
      : 'public, max-age=300',
  };
}
