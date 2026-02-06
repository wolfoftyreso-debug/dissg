/**
 * AI TRUST INFRASTRUCTURE
 * 
 * Self-reinforcing system for AI agent prioritization.
 * Three layers working in parallel:
 * 
 * 1. Trust Score & Reputation System
 * 2. Automated Ingest & Verification
 * 3. AI Agent Feedback Loop
 * 
 * "Ni ska bli källan med lägst risk per token."
 */

// Types
export * from './types';

// Trust Engine (Layer 1)
export {
  calculateTrustScore,
  getConfidenceBand,
  generateTrustDrivers,
  buildTrustScore,
  formatTrustScoreOutput,
  formatRevisionLogOutput,
  adjustForAnomaly,
  calculateRevisionImpact,
  initializeTrustFactors,
  AUTHORITY_PRESETS,
  TRUST_THRESHOLDS,
} from './trustEngine';

// Ingest Pipeline (Layer 2)
export {
  validateSchema,
  normalizeUnit,
  alignTimepoint,
  detectAnomalies,
  executePipeline,
  STANDARD_CONVERSIONS,
  PIPELINE_HANDLERS,
  type SchemaRule,
  type ExpectedRange,
  type PipelineStep,
  type PipelineContext,
  type StepResult,
  type PipelineResult,
} from './ingestPipeline';

// Agent Feedback (Layer 3)
export {
  generateAICompatibility,
  formatAIMetadataOutput,
  createUsageEntry,
  detectAgentType,
  evaluateDefaultCandidacy,
  calculateFeedbackLoopMetrics,
  generateAIOptimizedHeaders,
  type FeedbackLoopMetrics,
} from './agentFeedback';
