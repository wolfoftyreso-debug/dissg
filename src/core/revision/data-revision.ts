 /**
  * DATA REVISION LAYER
  * 
  * Detects when numbers change in abnormal ways.
  * Anomalies are EVENTS, not errors.
  */
 
 import type { RevisionEvent, RevisionEvidence, RevisionAction } from './revision-types';
 
 /**
  * TIME SERIES DATA POINT
  */
 export interface TimeSeriesPoint {
   timestamp: string;
   value: number;
   sourceId: string;
   methodVersion?: string;
 }
 
 /**
  * EXPECTED VARIANCE CONFIG
  */
 export interface VarianceConfig {
   metricId: string;
   expectedVariance: number;      // Normal max change
   criticalVariance: number;      // Definitely abnormal
   seasonalFactors?: Record<string, number>; // Month adjustments
 }
 
 /**
  * TEST DR-1: TIME DISCONTINUITY
  * 
  * FOR EACH time_series:
  *   IF delta(value_t, value_t-1) > expected_variance:
  *     FLAG anomaly
  */
 export function detectTimeDiscontinuity(
   series: TimeSeriesPoint[],
   config: VarianceConfig
 ): RevisionEvent | null {
   if (series.length < 2) return null;
   
   // Sort by timestamp
   const sorted = [...series].sort((a, b) => 
     new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
   );
   
   for (let i = 1; i < sorted.length; i++) {
     const prev = sorted[i - 1];
     const curr = sorted[i];
     const delta = Math.abs(curr.value - prev.value);
     const percentChange = prev.value !== 0 ? (delta / Math.abs(prev.value)) * 100 : delta;
     
     // Check against variance thresholds
     if (percentChange > config.criticalVariance) {
       return createDataRevisionEvent({
         type: 'time_discontinuity',
         severity: 'critical',
         entityId: config.metricId,
         description: `Critical discontinuity detected: ${percentChange.toFixed(1)}% change exceeds threshold ${config.criticalVariance}%`,
         evidence: {
           before: { timestamp: prev.timestamp, value: prev.value },
           after: { timestamp: curr.timestamp, value: curr.value },
           delta: percentChange,
           threshold: config.criticalVariance,
         },
         action: { required: 'flag_review', automatic: false, executed: false },
       });
     }
     
     if (percentChange > config.expectedVariance) {
       return createDataRevisionEvent({
         type: 'time_discontinuity',
         severity: 'warning',
         entityId: config.metricId,
         description: `Discontinuity detected: ${percentChange.toFixed(1)}% change exceeds expected variance ${config.expectedVariance}%`,
         evidence: {
           before: { timestamp: prev.timestamp, value: prev.value },
           after: { timestamp: curr.timestamp, value: curr.value },
           delta: percentChange,
           threshold: config.expectedVariance,
         },
         action: { required: 'flag_review', automatic: false, executed: false },
       });
     }
   }
   
   return null;
 }
 
 /**
  * TEST DR-2: METHOD BREAK
  * 
  * IF value_changes AND source_notes_method_change:
  *   REQUIRE new_measure_version
  * 
  * System shall NEVER let method changes slip through.
  */
 export interface MethodChangeNote {
   timestamp: string;
   previousMethod: string;
   newMethod: string;
   description: string;
   sourceDocumentation?: string;
 }
 
 export function detectMethodBreak(
   series: TimeSeriesPoint[],
   methodChanges: MethodChangeNote[],
   metricId: string
 ): RevisionEvent | null {
   if (methodChanges.length === 0) return null;
   
   for (const change of methodChanges) {
     const changeTime = new Date(change.timestamp).getTime();
     
     // Find data points around the method change
     const before = series.filter(p => new Date(p.timestamp).getTime() < changeTime);
     const after = series.filter(p => new Date(p.timestamp).getTime() >= changeTime);
     
     if (before.length > 0 && after.length > 0) {
       const lastBefore = before[before.length - 1];
       const firstAfter = after[0];
       
       // Method change with data continuing → requires new version
       return createDataRevisionEvent({
         type: 'method_break',
         severity: 'critical',
         entityId: metricId,
         description: `Method change detected: "${change.previousMethod}" → "${change.newMethod}". New measure version required.`,
         evidence: {
           before: { method: change.previousMethod, lastValue: lastBefore.value },
           after: { method: change.newMethod, firstValue: firstAfter.value },
           affectedPeriod: {
             start: change.timestamp,
             end: after[after.length - 1]?.timestamp ?? change.timestamp,
           },
         },
         action: { required: 'new_version', automatic: false, executed: false },
       });
     }
   }
   
   return null;
 }
 
 /**
  * TEST DR-3: REVISED HISTORY
  * 
  * IF source_updates_past_values:
  *   STORE as new_version
  *   LINK revision_reason
  * 
  * History is NEVER overwritten.
  */
 export interface HistoricalRevision {
   timestamp: string;       // When the revision occurred
   affectedPeriod: {
     start: string;
     end: string;
   };
   originalValues: Record<string, number>;  // timestamp → value
   revisedValues: Record<string, number>;   // timestamp → value
   revisionReason: string;
   sourceDocumentation?: string;
 }
 
 export function detectRevisedHistory(
   revision: HistoricalRevision,
   metricId: string
 ): RevisionEvent {
   const changedPoints = Object.keys(revision.originalValues).length;
   
   return createDataRevisionEvent({
     type: 'revised_history',
     severity: 'warning',
     entityId: metricId,
     description: `Historical values revised: ${changedPoints} data points affected. Reason: ${revision.revisionReason}`,
     evidence: {
       before: revision.originalValues,
       after: revision.revisedValues,
       affectedPeriod: revision.affectedPeriod,
     },
     action: { required: 'new_version', automatic: true, executed: false },
   });
 }
 
 /**
  * Helper to create data revision events
  */
 function createDataRevisionEvent(params: {
   type: 'time_discontinuity' | 'method_break' | 'revised_history';
   severity: 'info' | 'warning' | 'critical';
   entityId: string;
   description: string;
   evidence: RevisionEvidence;
   action: RevisionAction;
 }): RevisionEvent {
   return {
     id: `DR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
     layer: 'data',
     type: params.type,
     severity: params.severity,
     detectedAt: new Date().toISOString(),
     entityId: params.entityId,
     entityType: 'metric',
     description: params.description,
     evidence: params.evidence,
     action: params.action,
     resolved: false,
   };
 }
 
 /**
  * RUN ALL DATA REVISION TESTS
  */
 export function runDataRevisionTests(
   metricId: string,
   series: TimeSeriesPoint[],
   config: VarianceConfig,
   methodChanges: MethodChangeNote[] = [],
   historicalRevisions: HistoricalRevision[] = []
 ): RevisionEvent[] {
   const events: RevisionEvent[] = [];
   
   // DR-1: Time discontinuity
   const discontinuity = detectTimeDiscontinuity(series, config);
   if (discontinuity) events.push(discontinuity);
   
   // DR-2: Method break
   const methodBreak = detectMethodBreak(series, methodChanges, metricId);
   if (methodBreak) events.push(methodBreak);
   
   // DR-3: Revised history
   for (const revision of historicalRevisions) {
     events.push(detectRevisedHistory(revision, metricId));
   }
   
   return events;
 }