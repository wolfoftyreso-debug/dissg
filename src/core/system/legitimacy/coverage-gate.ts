 /**
  * COVERAGE GATE
  * 
  * Determines if we have enough data to answer.
  * If not, we fail silent - never guess.
  */
 
 import { DATA_CONSTRAINTS } from '../ontology/constraints';
 import { checkFailSilent } from '../charter/principles';
 
 // ============================================================================
 // COVERAGE CHECK RESULT
 // ============================================================================
 
 export interface CoverageGateResult {
   readonly can_answer: boolean;
   readonly coverage_percent: number;
   readonly data_points: number;
   readonly confidence: number;
   readonly gaps: readonly CoverageGap[];
   readonly recommendation: 'answer' | 'partial_answer' | 'cannot_answer_yet';
 }
 
 export interface CoverageGap {
   readonly type: 'missing_data' | 'stale_data' | 'low_confidence' | 'source_conflict';
   readonly description: string;
   readonly severity: 'minor' | 'major' | 'blocking';
 }
 
 // ============================================================================
 // COVERAGE GATE
 // ============================================================================
 
 export interface CoverageInput {
   readonly available_data_points: number;
   readonly required_data_points: number;
   readonly confidence_scores: readonly number[];
   readonly source_ages_days: readonly number[];
   readonly source_agreement: number; // 0.0 - 1.0
 }
 
 export function checkCoverageGate(input: CoverageInput): CoverageGateResult {
   const gaps: CoverageGap[] = [];
   
   // Calculate coverage
   const coveragePercent = Math.round(
     (input.available_data_points / input.required_data_points) * 100
   );
   
   // Calculate average confidence
   const avgConfidence = input.confidence_scores.length > 0
     ? input.confidence_scores.reduce((a, b) => a + b, 0) / input.confidence_scores.length
     : 0;
   
   // Check data point threshold
   if (input.available_data_points < DATA_CONSTRAINTS.min_data_points) {
     gaps.push({
       type: 'missing_data',
       description: `Only ${input.available_data_points} data points (need ${DATA_CONSTRAINTS.min_data_points})`,
       severity: 'blocking',
     });
   }
   
   // Check coverage threshold
   if (coveragePercent < DATA_CONSTRAINTS.min_coverage_percent) {
     gaps.push({
       type: 'missing_data',
       description: `Coverage at ${coveragePercent}% (need ${DATA_CONSTRAINTS.min_coverage_percent}%)`,
       severity: coveragePercent < 50 ? 'blocking' : 'major',
     });
   }
   
   // Check confidence threshold
   if (avgConfidence < DATA_CONSTRAINTS.min_confidence) {
     gaps.push({
       type: 'low_confidence',
       description: `Confidence at ${(avgConfidence * 100).toFixed(0)}% (need ${DATA_CONSTRAINTS.min_confidence * 100}%)`,
       severity: avgConfidence < 0.3 ? 'blocking' : 'major',
     });
   }
   
   // Check data freshness
   const maxAge = Math.max(...input.source_ages_days, 0);
   if (maxAge > DATA_CONSTRAINTS.max_data_age_days) {
     gaps.push({
       type: 'stale_data',
       description: `Data is ${maxAge} days old (threshold: ${DATA_CONSTRAINTS.max_data_age_days})`,
       severity: 'major',
     });
   }
   
   // Check source agreement
   if (input.source_agreement < 0.7) {
     gaps.push({
       type: 'source_conflict',
       description: `Sources disagree (agreement: ${(input.source_agreement * 100).toFixed(0)}%)`,
       severity: input.source_agreement < 0.5 ? 'blocking' : 'major',
     });
   }
   
   // Determine recommendation
   const hasBlockingGap = gaps.some(g => g.severity === 'blocking');
   const hasMajorGap = gaps.some(g => g.severity === 'major');
   
   let recommendation: CoverageGateResult['recommendation'];
   if (hasBlockingGap) {
     recommendation = 'cannot_answer_yet';
   } else if (hasMajorGap) {
     recommendation = 'partial_answer';
   } else {
     recommendation = 'answer';
   }
   
   return {
     can_answer: recommendation !== 'cannot_answer_yet',
     coverage_percent: coveragePercent,
     data_points: input.available_data_points,
     confidence: avgConfidence,
     gaps,
     recommendation,
   };
 }
 
 // ============================================================================
 // CANNOT ANSWER YET RESPONSE
 // ============================================================================
 
 export interface CannotAnswerYetResponse {
   readonly type: 'cannot_answer_yet';
   readonly reason: string;
   readonly gaps: readonly CoverageGap[];
   readonly what_we_need: readonly string[];
   readonly estimated_availability?: string;
 }
 
 export function createCannotAnswerYetResponse(
   gateResult: CoverageGateResult,
   questionContext: string
 ): CannotAnswerYetResponse {
   const whatWeNeed: string[] = [];
   
   for (const gap of gateResult.gaps) {
     if (gap.severity === 'blocking') {
       whatWeNeed.push(gap.description);
     }
   }
   
   return {
     type: 'cannot_answer_yet',
     reason: `Insufficient data to answer: "${questionContext}"`,
     gaps: gateResult.gaps,
     what_we_need: whatWeNeed,
   };
 }