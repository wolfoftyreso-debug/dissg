 /**
  * EXPANSION LAYER
  * 
  * Safe Growth Model
  * 
  * Core (Charter, Ontology, Legitimacy Engine) is NEVER touched.
  * Everything here is additive.
  */
 
 // Aggregation System
 export {
   type AggregationType,
   type AggregationClass,
   type AggregationResult,
   ALLOWED_AGGREGATIONS,
   FORBIDDEN_AGGREGATIONS,
   AggregationRegistry,
   createAggregationRegistry,
 } from './aggregation/registry';
 
 export {
   type PrevalenceAggregate,
   type DecisionPatternAggregate,
   type OutcomeVarianceAggregate,
   AGGREGATION_CLASSES,
 } from './aggregation/classes';
 
 export {
   type SandboxConfig,
   type SandboxResult,
   AggregationSandbox,
   createSandbox,
 } from './aggregation/sandbox';
 
 // Integration System
 export {
   type IntegrationSource,
   type IntegrationTarget,
   type IntegrationRegistry,
   INTEGRATION_SOURCES,
   INTEGRATION_TARGETS,
   createIntegrationRegistry,
 } from './integration/registry';
 
 // Conditional Answers
 export {
   type ConditionalAnswer,
   type BoundaryAnswer,
   type NonAnswer,
   ANSWER_TYPES,
   validateAnswer,
 } from './answers/conditional';
 
 // UI Presentation
 export {
   type AggregationDisplay,
   type DisplayConstraints,
   DISPLAY_RULES,
   renderAggregation,
 } from './display/rules';
 
 export const EXPANSION_VERSION = '1.0.0' as const;
 
 /**
  * EXPANSION PRINCIPLES
  * 
  * 1. Aggregations are never conclusions
  * 2. Answers are always conditional
  * 3. Data sources are always annotated
  * 4. Nothing modifies the core
  */
 export const EXPANSION_PRINCIPLES = {
   aggregations_not_conclusions: true,
   answers_always_conditional: true,
   sources_always_annotated: true,
   core_immutable: true,
 } as const;