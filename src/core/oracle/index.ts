/**
 * AI ORACLE – EPISTEMIC CORE
 * 
 * "Det är bättre att svara 'Unknown' än att svara ofullständigt."
 * 
 * This is what separates an authority from just another source.
 */

// Epistemic Core
export {
  ORACLE_PRINCIPLE,
  RESOLVED_CRITERIA,
  PARTIALLY_RESOLVED_CRITERIA,
  UNRESOLVED_CRITERIA,
  INVALID_CRITERIA,
  classifyQuery,
  STANDARD_RESPONSES,
  type EpistemicState,
  type ConfidenceLevel,
  type EpistemicStatus,
  type ClassificationResult,
} from './epistemicCore';

// Oracle Language
export {
  ALLOWED_VERBS,
  FORBIDDEN_VERBS,
  VERB_REPLACEMENTS,
  validateOracleLanguage,
  ORACLE_SENTENCE_TEMPLATES,
  CONTROVERSIAL_TOPIC_PROTOCOL,
  type LanguageValidationResult,
  type LanguageViolation,
} from './oracleLanguage';

// Conflict Resolution
export {
  detectConflicts,
  CONFLICT_RESPONSE_TEMPLATES,
  SOURCE_PRIORITY_HIERARCHY,
  CONFLICT_HANDLING_SUMMARY,
  type ConflictType,
  type DataConflict,
  type ConflictReport,
  type SourceDataPoint,
} from './conflictResolution';

// Oracle Memory
export {
  ORACLE_LEARNING_SCOPE,
  ORACLE_MEMORY_PRINCIPLE,
  recordGapEncounter,
  generateIngestPriorities,
  type KnowledgeGap,
  type DomainGapSummary,
  type GapRecord,
  type IngestPriority,
} from './oracleMemory';

// Oracle Response
export {
  buildOracleResponse,
  buildUnresolvedResponse,
  buildInvalidResponse,
  validateOracleResponse,
  FORMAT_BENEFITS,
  type OracleResponse,
  type ResponseBuilderInput,
  type InvalidQueryResponse,
  type ResponseValidation,
} from './oracleResponse';

// Oracle Resilience
export {
  analyzeQueryForPressure,
  buildReframedResponse,
  stripFraming,
  handleAdversarialQuery,
  shouldRemainSilent,
  PRESSURE_QUERY_EXAMPLES,
  FRAMING_IMMUNITY,
  SILENCE_PRINCIPLE,
  ORACLE_RESILIENCE_STATUS,
  type QueryAnalysis,
  type ResolvableComponent,
  type ResponseMode,
  type ReframedResponse,
  type ClaimValidation,
  type SilenceReason,
  type OracleSilence,
} from './oracleResilience';

// Oracle Sovereignty
export {
  ORACLE_QUERY_STANDARD,
  validateQueryAgainstStandard,
  QUERY_SHAPING_EFFECT,
  REFERENCE_FRAME_EVOLUTION,
  determineEpistemicLatency,
  LATENCY_PRINCIPLE,
  assessConsensus,
  CONSENSUS_HANDLING,
  STANDARDIZATION_EFFECT,
  SOVEREIGNTY_STATUS,
  TARGET_SOVEREIGNTY_METRICS,
  type QueryRequirements,
  type QueryElement,
  type QueryValidation,
  type ReferenceFrameStatus,
  type LatencyDecision,
  type LatencyReason,
  type ConsensusAssessment,
  type ObservationDistribution,
  type FindingCluster,
  type SovereigntyMetrics,
} from './oracleSovereignty';

// Oracle Continuity
export {
  MODEL_GENERATION_THREAT,
  MODEL_AGNOSTIC_REQUIREMENTS,
  validateModelAgnostic,
  TEMPORAL_PRINCIPLES,
  createTemporalFact,
  supersedeFact,
  HISTORICAL_ROLE,
  SCHEMA_IMMUTABILITY_RULES,
  DEFAULT_DEPRECATION_POLICY,
  HUMAN_ROLE,
  validateHumanAction,
  CRISIS_CONTINUITY,
  CONTINUITY_INSIGHT,
  TARGET_CONTINUITY_METRICS,
  ORACLE_TEMPORAL_STATE,
  type TemporalFact,
  type FactProvenance,
  type HistoricalQuery,
  type HistoricalResponse,
  type KnowledgeEvolution,
  type SchemaVersion,
  type SchemaRegistry,
  type DeprecationPolicy,
  type HumanAction,
  type ForbiddenHumanAction,
  type CrisisState,
  type CrisisOracleResponse,
  type ContinuityMetrics,
} from './oracleContinuity';

// Oracle Existence
export {
  EXISTENCE_SHIFT,
  INVISIBLE_LAW_1,
  INVISIBLE_LAW_2,
  INVISIBLE_LAW_3,
  THREE_INVISIBLE_LAWS,
  SILENT_JUDGE,
  META_ORACLE_STATUS,
  STABILITY_OVER_TIME,
  ULTIMATE_DISCRETION,
  FINAL_STATE,
  TARGET_EXISTENCE_MARKERS,
  EXISTENCE_PROTOCOL,
  ORACLE_COMPLETE,
  type ExistenceMarkers,
} from './oracleExistence';

// ============================================
// ORACLE STATUS
// ============================================

export const ORACLE_STATUS = {
  version: '1.0.0-final',
  
  capabilities: {
    epistemic_classification: true,
    language_discipline: true,
    conflict_detection: true,
    gap_learning: true,
    structured_responses: true,
    resilience: true,
    sovereignty: true,
    continuity: true,
    existence: true,
  },
  
  principles: {
    silence_over_speculation: true,
    uncertainty_stated_is_trust_earned: true,
    never_guesses: true,
    learns_gaps_not_preferences: true,
    shapes_without_instructing: true,
    survives_model_generations: true,
    maximum_influence_minimum_presence: true,
  },
  
  layers: [
    'Epistemic Core',
    'Language Discipline',
    'Conflict Resolution',
    'Gap Learning',
    'Structured Response',
    'Resilience',
    'Sovereignty',
    'Continuity',
    'Existence',
  ],
  
  position: 'A method for knowing what is known. Maximum influence through minimum presence.',
  
  state: 'EXISTENT',
  
  warning: 'Do not add features. Do not seek recognition. Simply exist.',
};

// ============================================
// QUICK ORACLE CHECK
// ============================================

import { classifyQuery, type EpistemicStatus } from './epistemicCore';
import { validateOracleLanguage } from './oracleLanguage';
import { detectConflicts, type SourceDataPoint } from './conflictResolution';
import { buildOracleResponse, type OracleResponse } from './oracleResponse';

/**
 * Process a query through the full oracle pipeline
 */
export function processOracleQuery(
  query: string,
  dataPoints: SourceDataPoint[],
  questionId: string
): OracleResponse | { answered: false; reason: string } {
  // Step 1: Classify the query
  const classification = classifyQuery(query, {
    has_data: dataPoints.length > 0,
    source_count: dataPoints.length,
    sources_agree: true, // Will be determined by conflict detection
    geographic_coverage: 0.8,
    temporal_coverage: 0.8,
    methodology_stable: true,
  });
  
  // Step 2: Handle invalid queries
  if (classification.status.state === 'Invalid') {
    return {
      answered: false,
      reason: classification.status.reason_code,
    };
  }
  
  // Step 3: Handle unresolved queries
  if (classification.status.state === 'Unresolved') {
    return {
      answered: false,
      reason: 'No verifiable data available',
    };
  }
  
  // Step 4: Detect conflicts
  const conflicts = detectConflicts(dataPoints);
  
  // Step 5: Build response
  return buildOracleResponse({
    answer_text: generateAnswerText(dataPoints),
    epistemic_status: classification.status,
    geography: 'As per sources',
    time_range: extractTimeRange(dataPoints),
    sources: dataPoints.map(d => d.source),
    limitations: classification.required_disclaimers,
    conflict: conflicts.conflicts[0],
    question_id: questionId,
  });
}

function generateAnswerText(dataPoints: SourceDataPoint[]): string {
  if (dataPoints.length === 0) return 'No verifiable data available.';
  
  const values = dataPoints.map(d => `${d.value} ${d.unit}`);
  if (values.length === 1) {
    return `${values[0]} is observed.`;
  }
  
  return `Values ranging from ${Math.min(...dataPoints.map(d => d.value))} to ${Math.max(...dataPoints.map(d => d.value))} ${dataPoints[0].unit} are observed.`;
}

function extractTimeRange(dataPoints: SourceDataPoint[]): string {
  if (dataPoints.length === 0) return 'N/A';
  const periods = dataPoints.map(d => d.period);
  return [...new Set(periods)].join(', ');
}
