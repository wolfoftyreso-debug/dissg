 /**
  * AUTOMATED SELF-REVISION TYPES
  * 
  * The system's long-term nervous system.
  * Never assumes the world is stable.
  * Continuously suspects it has changed.
  */
 
 /**
  * REVISION LAYERS
  * All four are required. None may be missing.
  */
 export type RevisionLayer = 
   | 'data'        // Numerical reality
   | 'definition'  // Semantic reality
   | 'source'      // Institutional reality
   | 'conclusion'; // Derived truth
 
 /**
  * REVISION EVENT
  */
 export interface RevisionEvent {
   id: string;
   layer: RevisionLayer;
   type: RevisionEventType;
   severity: 'info' | 'warning' | 'critical';
   detectedAt: string;
   entityId: string;
   entityType: string;
   description: string;
   evidence: RevisionEvidence;
   action: RevisionAction;
   resolved: boolean;
   resolvedAt?: string;
   resolvedBy?: string;
   resolutionNotes?: string;
 }
 
 export type RevisionEventType =
   // Data layer
   | 'time_discontinuity'
   | 'method_break'
   | 'revised_history'
   // Definition layer
   | 'definition_drift'
   | 'context_expansion'
   | 'semantic_narrowing'
   // Source layer
   | 'source_behavior_change'
   | 'institutional_change'
   | 'single_source_fragility'
   // Conclusion layer
   | 'stale_conclusion'
   | 'contradicting_data';
 
 export interface RevisionEvidence {
   before: unknown;
   after: unknown;
   delta?: number;
   threshold?: number;
   affectedPeriod?: {
     start: string;
     end: string;
   };
   relatedEntities?: string[];
 }
 
 export interface RevisionAction {
   required: 'new_version' | 'flag_review' | 'block_usage' | 'mark_stale' | 'none';
   automatic: boolean;
   executed: boolean;
   executedAt?: string;
 }
 
 /**
  * REVISION REPORT
  */
 export interface RevisionReport {
   id: string;
   generatedAt: string;
   period: {
     start: string;
     end: string;
   };
   layers: {
     data: LayerRevisionSummary;
     definition: LayerRevisionSummary;
     source: LayerRevisionSummary;
     conclusion: LayerRevisionSummary;
   };
   totalEvents: number;
   criticalEvents: number;
   unresolvedEvents: number;
   deploymentBlocked: boolean;
   blockReasons: string[];
 }
 
 export interface LayerRevisionSummary {
   layer: RevisionLayer;
   eventsDetected: number;
   criticalCount: number;
   warningCount: number;
   infoCount: number;
   automaticActionsExecuted: number;
   pendingReview: number;
 }
 
 /**
  * EXTREME TRUTH RULES (LOCKED)
  */
 export const EXTREME_TRUTH_RULES = {
   rule1: {
     statement: 'No truth is eternal',
     implication: 'All conclusions have expiration',
     enforcement: 'automatic_staleness_detection',
   },
   rule2: {
     statement: 'No definition is final',
     implication: 'All schemas may require versioning',
     enforcement: 'semantic_drift_detection',
   },
   rule3: {
     statement: 'No source is sacred',
     implication: 'All sources may degrade or change',
     enforcement: 'source_stability_scoring',
   },
   rule4: {
     statement: 'No conclusion is permanent',
     implication: 'All derived truths require re-evaluation',
     enforcement: 'conclusion_revision_loop',
   },
   exception: {
     statement: 'History is absolute',
     implication: 'Past states are never overwritten, only versioned',
     enforcement: 'immutable_history_with_versions',
   },
 } as const;
 
 /**
  * SOURCE STABILITY SCORE
  */
 export interface SourceStabilityScore {
   sourceId: string;
   score: number; // 0-100
   components: {
     consistency: number;        // How consistent over time
     revisionRate: number;       // How often revisions occur
     volatility: number;         // How much values fluctuate
     methodStability: number;    // How stable methodology is
     institutionalHealth: number; // Organizational stability
   };
   trend: 'improving' | 'stable' | 'degrading';
   lastAssessed: string;
   flags: string[];
 }
 
 /**
  * CONCLUSION STALENESS
  */
 export interface ConclusionStaleness {
   conclusionId: string;
   createdAt: string;
   lastValidated: string;
   status: 'fresh' | 'aging' | 'stale' | 'invalid';
   underlyingChanges: {
     dataChanges: number;
     definitionChanges: number;
     sourceChanges: number;
   };
   expiresAt: string;
   requiresReEvaluation: boolean;
 }