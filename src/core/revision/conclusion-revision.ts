 /**
  * CONCLUSION REVISION LAYER
  * 
  * THE EXTREME LAYER - where you are alone in the world.
  * 
  * Detects when conclusions that were previously true
  * are no longer defensible.
  * 
  * Conclusions have EXPIRATION DATES.
  */
 
 import type { 
   RevisionEvent, 
   RevisionEvidence, 
   RevisionAction,
   ConclusionStaleness 
 } from './revision-types';
 
 /**
  * STORED CONCLUSION
  */
 export interface StoredConclusion {
   id: string;
   statement: string;
   createdAt: string;
   validUntil?: string;
   confidence: number; // 0-100
   underlyingData: {
     metricIds: string[];
     schemaIds: string[];
     sourceIds: string[];
     timeRange: {
       start: string;
       end: string;
     };
   };
   methodology: string;
   caveats: string[];
   lastValidated: string;
 }
 
 /**
  * DATA CHANGE LOG
  */
 export interface DataChangeLog {
   metricId: string;
   changedAt: string;
   changeType: 'value' | 'method' | 'revision';
   magnitude: 'minor' | 'significant' | 'major';
 }
 
 export interface DefinitionChangeLog {
   schemaId: string;
   changedAt: string;
   changeType: 'text' | 'scope' | 'version';
   magnitude: 'minor' | 'significant' | 'major';
 }
 
 export interface SourceChangeLog {
   sourceId: string;
   changedAt: string;
   changeType: 'behavior' | 'institutional' | 'reliability';
   magnitude: 'minor' | 'significant' | 'major';
 }
 
 /**
  * TEST CR-1: STALE CONCLUSIONS
  * 
  * FOR EACH stored_conclusion:
  *   IF underlying_data OR definitions changed:
  *     MARK conclusion AS stale
  * 
  * Conclusions have best-before dates.
  */
 export function detectStaleConclusionsByChange(
   conclusion: StoredConclusion,
   dataChanges: DataChangeLog[],
   definitionChanges: DefinitionChangeLog[],
   sourceChanges: SourceChangeLog[]
 ): { staleness: ConclusionStaleness; event: RevisionEvent | null } {
   const conclusionDate = new Date(conclusion.createdAt);
   
   // Find relevant changes after conclusion was created
   const relevantDataChanges = dataChanges.filter(c => 
     conclusion.underlyingData.metricIds.includes(c.metricId) &&
     new Date(c.changedAt) > conclusionDate
   );
   
   const relevantDefChanges = definitionChanges.filter(c =>
     conclusion.underlyingData.schemaIds.includes(c.schemaId) &&
     new Date(c.changedAt) > conclusionDate
   );
   
   const relevantSourceChanges = sourceChanges.filter(c =>
     conclusion.underlyingData.sourceIds.includes(c.sourceId) &&
     new Date(c.changedAt) > conclusionDate
   );
   
   // Calculate staleness
   const majorDataChanges = relevantDataChanges.filter(c => c.magnitude === 'major').length;
   const majorDefChanges = relevantDefChanges.filter(c => c.magnitude === 'major').length;
   const majorSourceChanges = relevantSourceChanges.filter(c => c.magnitude === 'major').length;
   
   const significantChanges = 
     relevantDataChanges.filter(c => c.magnitude === 'significant').length +
     relevantDefChanges.filter(c => c.magnitude === 'significant').length +
     relevantSourceChanges.filter(c => c.magnitude === 'significant').length;
   
   // Determine status
   let status: 'fresh' | 'aging' | 'stale' | 'invalid';
   if (majorDataChanges > 0 || majorDefChanges > 0 || majorSourceChanges > 0) {
     status = 'invalid';
   } else if (significantChanges > 2) {
     status = 'stale';
   } else if (significantChanges > 0 || relevantDataChanges.length > 3) {
     status = 'aging';
   } else {
     status = 'fresh';
   }
   
   // Calculate expiration
   const ageInDays = (Date.now() - conclusionDate.getTime()) / (1000 * 60 * 60 * 24);
   const baseExpirationDays = 365; // 1 year base
   const adjustedExpiration = baseExpirationDays - (significantChanges * 30) - (majorDataChanges * 90);
   const expiresAt = new Date(conclusionDate.getTime() + Math.max(30, adjustedExpiration) * 24 * 60 * 60 * 1000);
   
   const staleness: ConclusionStaleness = {
     conclusionId: conclusion.id,
     createdAt: conclusion.createdAt,
     lastValidated: conclusion.lastValidated,
     status,
     underlyingChanges: {
       dataChanges: relevantDataChanges.length,
       definitionChanges: relevantDefChanges.length,
       sourceChanges: relevantSourceChanges.length,
     },
     expiresAt: expiresAt.toISOString(),
     requiresReEvaluation: status === 'stale' || status === 'invalid',
   };
   
   // Create event if stale or invalid
   let event: RevisionEvent | null = null;
   if (status === 'stale' || status === 'invalid') {
     event = createConclusionRevisionEvent({
       type: 'stale_conclusion',
       severity: status === 'invalid' ? 'critical' : 'warning',
       entityId: conclusion.id,
       description: `Conclusion ${status}: ${relevantDataChanges.length} data, ${relevantDefChanges.length} definition, ${relevantSourceChanges.length} source changes since creation`,
       evidence: {
         before: {
           status: 'fresh',
           createdAt: conclusion.createdAt,
         },
         after: {
           status,
           changes: staleness.underlyingChanges,
         },
       },
       action: { 
         required: status === 'invalid' ? 'block_usage' : 'mark_stale', 
         automatic: true, 
         executed: false 
       },
     });
   }
   
   return { staleness, event };
 }
 
 /**
  * TEST CR-2: NEW DATA, NEW WORLD
  * 
  * IF new_data contradicts prior trend:
  *   REQUIRE re-evaluation
  * 
  * System shall NEVER defend old narratives.
  */
 export interface TrendAnalysis {
   metricId: string;
   priorTrend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
   priorTrendConfidence: number;
   priorTrendPeriod: { start: string; end: string };
   newDataTrend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
   newDataPeriod: { start: string; end: string };
   contradiction: boolean;
 }
 
 export function detectContradictingData(
   conclusion: StoredConclusion,
   trendAnalyses: TrendAnalysis[]
 ): RevisionEvent | null {
   // Find trends for metrics underlying this conclusion
   const relevantTrends = trendAnalyses.filter(t => 
     conclusion.underlyingData.metricIds.includes(t.metricId) &&
     t.contradiction
   );
   
   if (relevantTrends.length === 0) return null;
   
   // High confidence contradictions are critical
   const highConfidenceContradictions = relevantTrends.filter(t => t.priorTrendConfidence > 80);
   
   return createConclusionRevisionEvent({
     type: 'contradicting_data',
     severity: highConfidenceContradictions.length > 0 ? 'critical' : 'warning',
     entityId: conclusion.id,
     description: `New data contradicts prior trend for ${relevantTrends.length} underlying metric(s)`,
     evidence: {
       before: relevantTrends.map(t => ({
         metricId: t.metricId,
         trend: t.priorTrend,
         confidence: t.priorTrendConfidence,
       })),
       after: relevantTrends.map(t => ({
         metricId: t.metricId,
         trend: t.newDataTrend,
         period: t.newDataPeriod,
       })),
     },
     action: { required: 'flag_review', automatic: false, executed: false },
   });
 }
 
 /**
  * Helper to create conclusion revision events
  */
 function createConclusionRevisionEvent(params: {
   type: 'stale_conclusion' | 'contradicting_data';
   severity: 'info' | 'warning' | 'critical';
   entityId: string;
   description: string;
   evidence: RevisionEvidence;
   action: RevisionAction;
 }): RevisionEvent {
   return {
     id: `CR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
     layer: 'conclusion',
     type: params.type,
     severity: params.severity,
     detectedAt: new Date().toISOString(),
     entityId: params.entityId,
     entityType: 'conclusion',
     description: params.description,
     evidence: params.evidence,
     action: params.action,
     resolved: false,
   };
 }
 
 /**
  * RUN ALL CONCLUSION REVISION TESTS
  */
 export function runConclusionRevisionTests(
   conclusions: StoredConclusion[],
   dataChanges: DataChangeLog[],
   definitionChanges: DefinitionChangeLog[],
   sourceChanges: SourceChangeLog[],
   trendAnalyses: TrendAnalysis[]
 ): { events: RevisionEvent[]; stalenessMap: Map<string, ConclusionStaleness> } {
   const events: RevisionEvent[] = [];
   const stalenessMap = new Map<string, ConclusionStaleness>();
   
   for (const conclusion of conclusions) {
     // CR-1: Stale conclusions
     const { staleness, event } = detectStaleConclusionsByChange(
       conclusion,
       dataChanges,
       definitionChanges,
       sourceChanges
     );
     stalenessMap.set(conclusion.id, staleness);
     if (event) events.push(event);
     
     // CR-2: Contradicting data
     const contradictionEvent = detectContradictingData(conclusion, trendAnalyses);
     if (contradictionEvent) events.push(contradictionEvent);
   }
   
   return { events, stalenessMap };
 }