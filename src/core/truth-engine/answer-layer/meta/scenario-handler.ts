 /**
  * SCENARIO HANDLER ("WHAT IF" QUESTIONS)
  * 
  * Scenarios are models, not prophecy.
  * Always marked as hypothetical, model-dependent, non-truth.
  */
 
 /**
  * SCENARIO RESPONSE STRUCTURE
  */
 export interface ScenarioResponse {
   readonly question_type: 'what_if';
   readonly response_mode: 'conditional';
   readonly assumptions: readonly Assumption[];
   readonly model: ModelDisclosure;
   readonly output: {
     readonly projected_values: readonly ProjectedValue[];
     readonly sensitivity_analysis: SensitivityAnalysis;
     readonly what_this_is_not: readonly string[];
   };
   readonly confidence: {
     readonly level: 'very_low' | 'low' | 'medium';  // Never 'high' for scenarios
     readonly degrades_over_time: boolean;
   };
   readonly disclaimers: readonly string[];
   readonly text_output: string;
 }
 
 export interface Assumption {
   readonly id: string;
   readonly description: string;
   readonly value: number | string;
   readonly source: 'user_provided' | 'historical_extrapolation' | 'model_default';
   readonly sensitivity: 'low' | 'medium' | 'high';
 }
 
 export interface ModelDisclosure {
   readonly model_name: string;
   readonly model_type: 'linear_extrapolation' | 'exponential' | 'cohort_component' | 'custom';
   readonly known_limitations: readonly string[];
   readonly historical_accuracy: number | null;  // If backtested
 }
 
 export interface ProjectedValue {
   readonly year: number;
   readonly value: number;
   readonly confidence_interval: [number, number];
   readonly is_extrapolation: boolean;
 }
 
 export interface SensitivityAnalysis {
   readonly most_sensitive_assumption: string;
   readonly if_assumption_changes: string;
   readonly range_of_outcomes: [number, number];
 }
 
 /**
  * MANDATORY SCENARIO DISCLAIMERS
  */
 export const SCENARIO_DISCLAIMERS = [
   'This is a projection, not a prediction.',
   'Actual outcomes depend on assumptions that may not hold.',
   'This model cannot account for unprecedented events.',
   'Confidence degrades significantly beyond 5 years.',
   'Past patterns do not guarantee future results.',
 ] as const;
 
 /**
  * FORBIDDEN SCENARIO LANGUAGE
  */
 export const FORBIDDEN_SCENARIO_TERMS = [
   'will be',
   'will happen',
   'is going to',
   'definitely',
   'certainly',
   'inevitably',
   'guaranteed',
   'for sure',
 ] as const;
 
 /**
  * PERMITTED SCENARIO LANGUAGE
  */
 export const PERMITTED_SCENARIO_LANGUAGE = [
   'if current trends continue',
   'under these assumptions',
   'the model projects',
   'this scenario suggests',
   'given the stated parameters',
   'with this configuration',
   'hypothetically',
 ] as const;
 
 /**
  * GENERATE SCENARIO RESPONSE
  */
 export function generateScenarioResponse(
   question: string,
   assumptions: Assumption[],
   model: ModelDisclosure,
   projections: ProjectedValue[]
 ): ScenarioResponse {
   // Validate: must have assumptions
   if (assumptions.length === 0) {
     throw new Error('SCENARIO-ERR-01: Cannot generate scenario without explicit assumptions');
   }
   
   // Find most sensitive assumption
   const highSensitivity = assumptions.filter(a => a.sensitivity === 'high');
   const mostSensitive = highSensitivity[0] || assumptions[0];
   
   // Calculate confidence
   const maxYear = Math.max(...projections.map(p => p.year));
   const currentYear = new Date().getFullYear();
   const yearsOut = maxYear - currentYear;
   
   let confidenceLevel: 'very_low' | 'low' | 'medium' = 'medium';
   if (yearsOut > 20) confidenceLevel = 'very_low';
   else if (yearsOut > 10) confidenceLevel = 'low';
   
   // Build text output
   const firstProjection = projections[0];
   const lastProjection = projections[projections.length - 1];
   
   let textOutput = `${PERMITTED_SCENARIO_LANGUAGE[0]}, the model projects `;
   textOutput += `a change from ${firstProjection.value.toLocaleString()} `;
   textOutput += `to ${lastProjection.value.toLocaleString()} by ${lastProjection.year}. `;
   textOutput += `\n\nKEY ASSUMPTIONS:\n`;
   
   for (const assumption of assumptions) {
     textOutput += `- ${assumption.description}: ${assumption.value}\n`;
   }
   
   textOutput += `\n⚠️ ${SCENARIO_DISCLAIMERS[0]}`;
   
   return {
     question_type: 'what_if',
     response_mode: 'conditional',
     assumptions,
     model,
     output: {
       projected_values: projections,
       sensitivity_analysis: {
         most_sensitive_assumption: mostSensitive.description,
         if_assumption_changes: `If ${mostSensitive.description} differs, outcomes could vary significantly`,
         range_of_outcomes: [
           Math.min(...projections.map(p => p.confidence_interval[0])),
           Math.max(...projections.map(p => p.confidence_interval[1])),
         ],
       },
       what_this_is_not: [
         'This is NOT a prediction of what WILL happen.',
         'This is NOT based on complete information.',
         'This does NOT account for policy changes or shocks.',
         'This is NOT more certain than historical data.',
       ],
     },
     confidence: {
       level: confidenceLevel,
       degrades_over_time: true,
     },
     disclaimers: [...SCENARIO_DISCLAIMERS],
     text_output: textOutput,
   };
 }
 
 /**
  * VALIDATE NO CERTAINTY CLAIMS
  */
 export function containsCertaintyClaim(text: string): {
   hasClaim: boolean;
   violations: string[];
 } {
   const violations: string[] = [];
   const lowerText = text.toLowerCase();
   
   for (const term of FORBIDDEN_SCENARIO_TERMS) {
     if (lowerText.includes(term.toLowerCase())) {
       violations.push(term);
     }
   }
   
   return {
     hasClaim: violations.length > 0,
     violations,
   };
 }