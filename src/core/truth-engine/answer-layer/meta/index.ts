 /**
  * META-LAYER - PUBLIC API
  * 
  * Industrial-scale Answer Layer components.
  */
 
 // Packet Generator
 export {
   DERIVABLE_TYPES,
   type DerivableType,
   type MeasureDefinition,
   type GenerationRule,
   DEFAULT_GENERATION_RULES,
   generatePacketFromMeasure,
   generateAllPacketsForMeasure,
   isDerivable,
 } from './packet-generator';
 
 // Truth Intent Classification
 export {
   TRUTH_INTENT_TYPES,
   INTENT_RISK_LEVELS,
   type TruthIntentType,
   type IntentRiskLevel,
   type IntentClassification,
   classifyIntent,
   isAnswerable,
 } from './truth-intent';
 
 // Causation Handler
 export {
   type CausationResponse,
   type Correlation,
   FORBIDDEN_CAUSAL_TERMS,
   PERMITTED_LANGUAGE,
   generateCausationResponse,
   containsCausalClaim,
 } from './causation-handler';
 
 // Scenario Handler
 export {
   type ScenarioResponse,
   type Assumption,
   type ModelDisclosure,
   type ProjectedValue,
   SCENARIO_DISCLAIMERS,
   FORBIDDEN_SCENARIO_TERMS,
   PERMITTED_SCENARIO_LANGUAGE,
   generateScenarioResponse,
   containsCertaintyClaim,
 } from './scenario-handler';
 
 // Ranking Antibodies
 export {
   RANKING_RULES,
   type RankingResponse,
   type WeightingDisclosure,
   type RankedItem,
   type SensitivityDisclosure,
   RANKING_DISCLAIMERS,
   FORBIDDEN_RANKING_TERMS,
   PERMITTED_RANKING_LANGUAGE,
   validateWeighting,
   generateSensitivityAnalysis,
   generateAlternativeRankings,
   generateRankingResponse,
   containsAbsoluteRankingClaim,
 } from './ranking-antibodies';
 
 // Feedback Loop
 export {
   FEEDBACK_EVENTS,
   type FeedbackEventType,
   type FeedbackEvent,
   type FeedbackAggregation,
   type CoverageGap,
   logFeedback,
   getRecentFeedback,
   aggregateFeedback,
   clearFeedback,
 } from './feedback-loop';
 
 // Governance
 export {
   GOVERNANCE_RULES,
   REJECTION_REASONS,
   type GovernanceRule,
   type RejectionReason,
   type GovernanceDecision,
   type GovernanceMetrics,
   checkGovernance,
   getGovernanceMetrics,
   metaSelfTest,
 } from './governance';