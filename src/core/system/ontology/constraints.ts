 /**
  * ONTOLOGY CONSTRAINTS
  * 
  * Rules that MUST be enforced. Violations = build failure.
  */
 
 // ============================================================================
 // LANGUAGE CONSTRAINTS (EPISTEMIC)
 // ============================================================================
 
 export const FORBIDDEN_LANGUAGE = {
   // Value words - NEVER use
   value_words: [
     'good', 'bad', 'best', 'worst',
     'success', 'failure', 'crisis',
     'excellent', 'terrible', 'amazing',
     'bra', 'dålig', 'bäst', 'sämst', // Swedish
   ],
   
   // Causal claims - NEVER use without explicit caveats
   causal_words: [
     'caused', 'leads to', 'results in', 'because of',
     'due to', 'therefore', 'consequently',
     'orsakade', 'leder till', 'beror på', // Swedish
   ],
   
   // Imperatives - NEVER use
   imperative_words: [
     'should', 'must', 'need to', 'have to',
     'ought to', 'recommended',
     'bör', 'måste', 'ska', // Swedish
   ],
   
   // Predictions - NEVER use
   prediction_words: [
     'will', 'going to', 'expected to',
     'predicted', 'forecasted',
     'kommer att', 'förväntas', // Swedish
   ],
 } as const;
 
 // ============================================================================
 // DATA CONSTRAINTS
 // ============================================================================
 
 export const DATA_CONSTRAINTS = {
   // Minimum data points for any statement
   min_data_points: 3,
   
   // Minimum coverage for answering
   min_coverage_percent: 70,
   
   // Maximum age of data before staleness warning
   max_data_age_days: 365,
   
   // Minimum confidence for publication
   min_confidence: 0.5,
   
   // Maximum uncertainty before fail-silent
   max_uncertainty_severity: 'high' as const,
 } as const;
 
 // ============================================================================
 // STRUCTURAL CONSTRAINTS
 // ============================================================================
 
 export const STRUCTURAL_CONSTRAINTS = {
   // Every observation must have provenance
   observation_requires_provenance: true,
   
   // Every statement must have uncertainty declaration
   statement_requires_uncertainty: true,
   
   // Every view must have limitations section
   view_requires_limitations: true,
   
   // No aggregation without decomposability
   aggregation_requires_drill_down: true,
   
   // No ranking without explicit criteria
   ranking_requires_criteria: true,
 } as const;
 
 // ============================================================================
 // CONSTRAINT VALIDATOR
 // ============================================================================
 
 export function validateLanguage(text: string): { valid: boolean; violations: string[] } {
   const violations: string[] = [];
   const lowerText = text.toLowerCase();
   
   for (const word of FORBIDDEN_LANGUAGE.value_words) {
     if (lowerText.includes(word.toLowerCase())) {
       violations.push(`Forbidden value word: "${word}"`);
     }
   }
   
   for (const word of FORBIDDEN_LANGUAGE.imperative_words) {
     if (lowerText.includes(word.toLowerCase())) {
       violations.push(`Forbidden imperative: "${word}"`);
     }
   }
   
   for (const word of FORBIDDEN_LANGUAGE.prediction_words) {
     if (lowerText.includes(word.toLowerCase())) {
       violations.push(`Forbidden prediction: "${word}"`);
     }
   }
   
   return {
     valid: violations.length === 0,
     violations,
   };
 }
 
 export function validateDataCoverage(coverage: number): boolean {
   return coverage >= DATA_CONSTRAINTS.min_coverage_percent;
 }
 
 export function validateDataPoints(count: number): boolean {
   return count >= DATA_CONSTRAINTS.min_data_points;
 }