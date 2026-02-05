 /**
  * CANNOT ANSWER YET
  * 
  * Views for questions we cannot yet answer.
  * This is a FEATURE, not a failure.
  */
 
 // ============================================================================
 // CANNOT ANSWER VIEW
 // ============================================================================
 
 export interface CannotAnswerView {
   readonly query_id: string;
   readonly original_query: string;
   readonly normalized_query: string;
   readonly domain: string;
   readonly blueprint_id: string;
   readonly reason: CannotAnswerReason;
   readonly gaps: readonly DataGap[];
   readonly what_we_need: readonly string[];
   readonly when_might_answer: string | null;
   readonly related_answerable: readonly string[];
 }
 
 export type CannotAnswerReason =
   | 'insufficient_data'
   | 'no_sources_available'
   | 'sources_conflict'
   | 'data_too_old'
   | 'coverage_below_threshold'
   | 'confidence_too_low'
   | 'question_outside_scope'
   | 'requires_speculation';
 
 export interface DataGap {
   readonly type: string;
   readonly description: string;
   readonly severity: 'minor' | 'major' | 'blocking';
   readonly resolution_path: string | null;
 }
 
 // ============================================================================
 // CANNOT ANSWER REGISTRY
 // ============================================================================
 
 const cannotAnswerRegistry: Map<string, CannotAnswerView> = new Map();
 
 export function registerCannotAnswer(view: CannotAnswerView): void {
   cannotAnswerRegistry.set(view.query_id, view);
 }
 
 export function getCannotAnswer(queryId: string): CannotAnswerView | undefined {
   return cannotAnswerRegistry.get(queryId);
 }
 
 export function getAllCannotAnswer(): CannotAnswerView[] {
   return Array.from(cannotAnswerRegistry.values());
 }
 
 export function getCannotAnswerByReason(reason: CannotAnswerReason): CannotAnswerView[] {
   return getAllCannotAnswer().filter(v => v.reason === reason);
 }
 
 // ============================================================================
 // CANNOT ANSWER RESPONSE BUILDER
 // ============================================================================
 
 export interface CannotAnswerResponse {
   readonly type: 'cannot_answer_yet';
   readonly query: string;
   readonly reason_human: string;
   readonly reason_code: CannotAnswerReason;
   readonly transparency: {
     readonly we_checked: readonly string[];
     readonly we_found: string;
     readonly we_need: readonly string[];
   };
   readonly alternatives: readonly string[];
 }
 
 export function buildCannotAnswerResponse(view: CannotAnswerView): CannotAnswerResponse {
   const reasonHumanMap: Record<CannotAnswerReason, string> = {
     insufficient_data: 'We do not have enough data points to make a reliable statement.',
     no_sources_available: 'We could not find authoritative sources for this question.',
     sources_conflict: 'Available sources provide conflicting information.',
     data_too_old: 'The available data is too old to be reliable.',
     coverage_below_threshold: 'Our coverage of this topic is below our publication threshold.',
     confidence_too_low: 'Our confidence in the available data is too low.',
     question_outside_scope: 'This question falls outside our scope of statistical observation.',
     requires_speculation: 'Answering this would require speculation, which we do not do.',
   };
   
   return {
     type: 'cannot_answer_yet',
     query: view.original_query,
     reason_human: reasonHumanMap[view.reason],
     reason_code: view.reason,
     transparency: {
       we_checked: view.gaps.map(g => g.description),
       we_found: `${view.gaps.length} data gaps identified`,
       we_need: view.what_we_need,
     },
     alternatives: view.related_answerable,
   };
 }