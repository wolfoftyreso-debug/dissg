 /**
  * EVOLUTION TYPES
  * 
  * Type definitions for the anti-entropy evolution system.
  * Every change must make the system stricter, not freer.
  */
 
 /**
  * ALLOWED EVOLUTION DIRECTIONS
  * 
  * Only these change types are permitted:
  */
 export type AllowedEvolutionDirection =
   | 'additive_semantics'      // New concepts, never changed
   | 'increased_explicitness'  // Less implicit, more formal
   | 'new_relations'           // More relations, fewer assumptions
   | 'better_self_tests'       // Improved validation
   | 'narrower_contracts';     // Stricter interfaces
 
 export const ALLOWED_EVOLUTION_DIRECTIONS: readonly AllowedEvolutionDirection[] = [
   'additive_semantics',
   'increased_explicitness',
   'new_relations',
   'better_self_tests',
   'narrower_contracts',
 ] as const;
 
 /**
  * SCHEMA OPERATIONS
  */
 export type AllowedSchemaOperation =
   | 'SPLIT'      // 1 → n, semantically cleaner
   | 'EXTEND'     // New attributes, never requirements
   | 'SUPERSEDE'  // New version, new ID
   | 'RELATE';    // New explicit relationships
 
 export type ForbiddenSchemaOperation =
   | 'MODIFY_IN_PLACE'
   | 'RENAME_WITHOUT_NEW_ID'
   | 'WIDEN_MEANING'
   | 'RELAX_CONSTRAINTS';
 
 export const ALLOWED_SCHEMA_OPERATIONS: readonly AllowedSchemaOperation[] = [
   'SPLIT',
   'EXTEND',
   'SUPERSEDE',
   'RELATE',
 ] as const;
 
 export const FORBIDDEN_SCHEMA_OPERATIONS: readonly ForbiddenSchemaOperation[] = [
   'MODIFY_IN_PLACE',
   'RENAME_WITHOUT_NEW_ID',
   'WIDEN_MEANING',
   'RELAX_CONSTRAINTS',
 ] as const;
 
 /**
  * EVOLUTION CHANGE
  */
 export interface EvolutionChange {
   id: string;
   timestamp: string;
   direction: AllowedEvolutionDirection | 'FORBIDDEN';
   schemaOperation?: AllowedSchemaOperation | ForbiddenSchemaOperation;
   description: string;
   author: string;
   commitHash?: string;
   commitMessage?: string;
   
   // Gate results
   semanticGate?: GateResult;
   temporalGate?: GateResult;
   aggregationGate?: GateResult;
   redTeamGate?: GateResult;
   
   // Final status
   approved: boolean;
   rejectionReason?: string;
 }
 
 export interface GateResult {
   gate: 'semantic' | 'temporal' | 'aggregation' | 'red_team';
   passed: boolean;
   score?: number;
   details: string;
   violations: string[];
 }
 
 /**
  * EVOLUTION METRICS
  */
 export interface EvolutionMetrics {
   timestamp: string;
   
   /** Semantic overlap and vagueness (should decrease) */
   semanticEntropy: number;
   
   /** Rules per schema (should increase) */
   constraintDensity: number;
   
   /** Implicit assumptions (should decrease) */
   assumptionCount: number;
   
   /** Work required per new feature (should increase) */
   evolutionCost: number;
   
   /** How easy to misuse (should decrease) */
   aiMisuseSurface: number;
   
   /** Health indicators */
   healthScore: number;
   trend: 'improving' | 'stable' | 'degrading';
 }
 
 /**
  * FORBIDDEN TEMPTATIONS
  */
 export const FORBIDDEN_COMMIT_PATTERNS = [
   'simplify',
   'cleanup',
   'basically same',
   'same thing',
   'just rename',
   'quick fix',
   'minor change',
   'refactor',  // Dangerous without explicit direction
   'merge',     // Semantic risk
   'combine',   // Information loss
   'consolidate',
 ] as const;
 
 /**
  * SELF-REINFORCING INDICATOR
  */
 export interface SelfReinforcingCheck {
   metric: string;
   beforeUsage: number;
   afterUsage: number;
   
   /** Did rules increase or exceptions increase? */
   result: 'more_rules' | 'more_exceptions';
   
   /** Correct answer is always 'more_rules' */
   isHealthy: boolean;
 }