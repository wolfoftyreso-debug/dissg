 /**
  * FEEDBACK LOOP
  * 
  * Logs what is requested, what fails, what is missing.
  * Uses this to improve coverage WITHOUT compromising truth.
  */
 
 /**
  * FEEDBACK EVENT TYPES
  */
 export const FEEDBACK_EVENTS = {
   PACKET_USED: 'packet_used',
   PACKET_MISSING: 'packet_missing',
   PARAMETER_MISSING: 'parameter_missing',
   INTENT_UNMATCHED: 'intent_unmatched',
   COVERAGE_INSUFFICIENT: 'coverage_insufficient',
   DEFINITION_MISMATCH: 'definition_mismatch',
   DATA_STALE: 'data_stale',
 } as const;
 
 export type FeedbackEventType = typeof FEEDBACK_EVENTS[keyof typeof FEEDBACK_EVENTS];
 
 /**
  * FEEDBACK EVENT
  */
 export interface FeedbackEvent {
   readonly id: string;
   readonly timestamp: string;
   readonly event_type: FeedbackEventType;
   readonly question: string;
   readonly packet_id: string | null;
   readonly parameters: Record<string, string>;
   readonly error: string | null;
   readonly resolution: 'answered' | 'partial' | 'failed' | 'refused';
 }
 
 /**
  * FEEDBACK AGGREGATION
  */
 export interface FeedbackAggregation {
   readonly period_start: string;
   readonly period_end: string;
   readonly total_queries: number;
   readonly by_event_type: Record<FeedbackEventType, number>;
   readonly by_domain: Record<string, number>;
   readonly top_missing_packets: readonly string[];
   readonly top_missing_parameters: readonly string[];
   readonly top_unmatched_intents: readonly string[];
   readonly coverage_gaps: readonly CoverageGap[];
 }
 
 export interface CoverageGap {
   readonly domain: string;
   readonly description: string;
   readonly frequency: number;
   readonly priority: 'high' | 'medium' | 'low';
   readonly suggested_action: string;
 }
 
 /**
  * IN-MEMORY FEEDBACK STORE
  */
 let feedbackEvents: FeedbackEvent[] = [];
 
 /**
  * LOG FEEDBACK EVENT
  */
 export function logFeedback(
   event_type: FeedbackEventType,
   question: string,
   packet_id: string | null,
   parameters: Record<string, string>,
   error: string | null,
   resolution: 'answered' | 'partial' | 'failed' | 'refused'
 ): FeedbackEvent {
   const event: FeedbackEvent = {
     id: crypto.randomUUID(),
     timestamp: new Date().toISOString(),
     event_type,
     question,
     packet_id,
     parameters,
     error,
     resolution,
   };
   
   feedbackEvents.push(event);
   
   // Keep only last 10000 events in memory
   if (feedbackEvents.length > 10000) {
     feedbackEvents = feedbackEvents.slice(-10000);
   }
   
   return event;
 }
 
 /**
  * GET RECENT FEEDBACK
  */
 export function getRecentFeedback(limit: number = 100): readonly FeedbackEvent[] {
   return feedbackEvents.slice(-limit);
 }
 
 /**
  * AGGREGATE FEEDBACK
  */
 export function aggregateFeedback(
   since: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
 ): FeedbackAggregation {
   const relevantEvents = feedbackEvents.filter(
     e => new Date(e.timestamp) >= since
   );
   
   // Count by event type
   const byEventType: Record<string, number> = {};
   for (const type of Object.values(FEEDBACK_EVENTS)) {
     byEventType[type] = relevantEvents.filter(e => e.event_type === type).length;
   }
   
   // Count by domain (extract from packet_id)
   const byDomain: Record<string, number> = {};
   for (const event of relevantEvents) {
     if (event.packet_id) {
       const domain = event.packet_id.split(':')[1]?.split('_')[0] || 'unknown';
       byDomain[domain] = (byDomain[domain] || 0) + 1;
     }
   }
   
   // Find top missing packets
   const missingPacketCounts: Record<string, number> = {};
   for (const event of relevantEvents.filter(e => e.event_type === 'packet_missing')) {
     const key = event.question.slice(0, 50);
     missingPacketCounts[key] = (missingPacketCounts[key] || 0) + 1;
   }
   const topMissingPackets = Object.entries(missingPacketCounts)
     .sort((a, b) => b[1] - a[1])
     .slice(0, 10)
     .map(([q]) => q);
   
   // Find top missing parameters
   const missingParamCounts: Record<string, number> = {};
   for (const event of relevantEvents.filter(e => e.event_type === 'parameter_missing')) {
     if (event.error) {
       missingParamCounts[event.error] = (missingParamCounts[event.error] || 0) + 1;
     }
   }
   const topMissingParams = Object.entries(missingParamCounts)
     .sort((a, b) => b[1] - a[1])
     .slice(0, 10)
     .map(([p]) => p);
   
   // Find top unmatched intents
   const unmatchedCounts: Record<string, number> = {};
   for (const event of relevantEvents.filter(e => e.event_type === 'intent_unmatched')) {
     const key = event.question.slice(0, 50);
     unmatchedCounts[key] = (unmatchedCounts[key] || 0) + 1;
   }
   const topUnmatched = Object.entries(unmatchedCounts)
     .sort((a, b) => b[1] - a[1])
     .slice(0, 10)
     .map(([q]) => q);
   
   // Identify coverage gaps
   const gaps: CoverageGap[] = [];
   const failureRate = relevantEvents.filter(e => e.resolution === 'failed').length / 
                       Math.max(relevantEvents.length, 1);
   
   if (failureRate > 0.1) {
     gaps.push({
       domain: 'general',
       description: `High failure rate: ${(failureRate * 100).toFixed(1)}%`,
       frequency: relevantEvents.filter(e => e.resolution === 'failed').length,
       priority: failureRate > 0.2 ? 'high' : 'medium',
       suggested_action: 'Review most common failed questions',
     });
   }
   
   return {
     period_start: since.toISOString(),
     period_end: new Date().toISOString(),
     total_queries: relevantEvents.length,
     by_event_type: byEventType as Record<FeedbackEventType, number>,
     by_domain: byDomain,
     top_missing_packets: topMissingPackets,
     top_missing_parameters: topMissingParams,
     top_unmatched_intents: topUnmatched,
     coverage_gaps: gaps,
   };
 }
 
 /**
  * CLEAR FEEDBACK (for testing)
  */
 export function clearFeedback(): void {
   feedbackEvents = [];
 }