 /**
  * CAUSATION HANDLER ("WHY" QUESTIONS)
  * 
  * Truth Engine NEVER gives a "why" as fact.
  * Instead, it provides structured uncertainty.
  */
 
 /**
  * CAUSATION RESPONSE STRUCTURE
  */
 export interface CausationResponse {
   readonly question_type: 'why';
   readonly response_mode: 'explanatory';
   readonly output: {
     readonly known_correlations: readonly Correlation[];
     readonly unsupported_claims: readonly string[];
     readonly data_limits: readonly string[];
     readonly what_we_cannot_say: readonly string[];
     readonly alternative_explanations: readonly string[];
   };
   readonly confidence: {
     readonly correlation_strength: number;  // 0-1
     readonly causal_evidence: 'none' | 'weak' | 'moderate' | 'strong';
   };
   readonly text_output: string;
 }
 
 export interface Correlation {
   readonly variable_a: string;
   readonly variable_b: string;
   readonly direction: 'positive' | 'negative' | 'nonlinear';
   readonly strength: number;  // 0-1
   readonly time_lag: string | null;
   readonly confounders: readonly string[];
   readonly source: string;
 }
 
 /**
  * FORBIDDEN CAUSAL LANGUAGE
  */
 export const FORBIDDEN_CAUSAL_TERMS = [
   'causes',
   'caused by',
   'because',
   'therefore',
   'results in',
   'leads to',
   'due to',
   'explains',
   'the reason is',
   'proves',
 ] as const;
 
 /**
  * PERMITTED CORRELATIONAL LANGUAGE
  */
 export const PERMITTED_LANGUAGE = [
   'is associated with',
   'correlates with',
   'tends to occur alongside',
   'data shows co-movement',
   'observed correlation',
   'pattern suggests relationship',
   'linked in data but not proven causal',
 ] as const;
 
 /**
  * GENERATE CAUSATION RESPONSE
  */
 export function generateCausationResponse(
   question: string,
   correlations: Correlation[],
   dataLimits: string[]
 ): CausationResponse {
   // Build list of what we CANNOT say
   const cannotSay = [
     'We cannot confirm causal direction without controlled experiments.',
     'Correlation does not imply causation.',
     'Multiple confounding factors may explain the observed relationship.',
     'Historical patterns may not predict future relationships.',
   ];
   
   // Build list of unsupported claims
   const unsupportedClaims = correlations.map(c => 
     `"${c.variable_a} causes ${c.variable_b}" — not supported by observational data alone`
   );
   
   // Build text output
   let textOutput = '';
   
   if (correlations.length === 0) {
     textOutput = 'No statistically significant correlations found in available data.';
   } else {
     const mainCorrelation = correlations[0];
     textOutput = `Data shows that ${mainCorrelation.variable_a} ${PERMITTED_LANGUAGE[1]} ` +
       `${mainCorrelation.variable_b} (correlation strength: ${(mainCorrelation.strength * 100).toFixed(0)}%). `;
     
     if (mainCorrelation.confounders.length > 0) {
       textOutput += `However, this relationship may be confounded by: ${mainCorrelation.confounders.join(', ')}. `;
     }
     
     textOutput += 'This is correlation, not proven causation.';
   }
   
   // Calculate causal evidence level
   let causalEvidence: 'none' | 'weak' | 'moderate' | 'strong' = 'none';
   if (correlations.length > 0) {
     const avgStrength = correlations.reduce((sum, c) => sum + c.strength, 0) / correlations.length;
     if (avgStrength > 0.8 && correlations.every(c => c.confounders.length === 0)) {
       causalEvidence = 'moderate';  // Never 'strong' from observational data
     } else if (avgStrength > 0.5) {
       causalEvidence = 'weak';
     }
   }
   
   return {
     question_type: 'why',
     response_mode: 'explanatory',
     output: {
       known_correlations: correlations,
       unsupported_claims: unsupportedClaims,
       data_limits: dataLimits,
       what_we_cannot_say: cannotSay,
       alternative_explanations: [
         'Reverse causation (B might cause A)',
         'Third variable explanation',
         'Coincidental timing',
         'Measurement artifacts',
       ],
     },
     confidence: {
       correlation_strength: correlations.length > 0 
         ? correlations.reduce((sum, c) => sum + c.strength, 0) / correlations.length 
         : 0,
       causal_evidence: causalEvidence,
     },
     text_output: textOutput,
   };
 }
 
 /**
  * VALIDATE NO CAUSAL CLAIMS
  */
 export function containsCausalClaim(text: string): {
   hasClaim: boolean;
   violations: string[];
 } {
   const violations: string[] = [];
   const lowerText = text.toLowerCase();
   
   for (const term of FORBIDDEN_CAUSAL_TERMS) {
     if (lowerText.includes(term.toLowerCase())) {
       violations.push(term);
     }
   }
   
   return {
     hasClaim: violations.length > 0,
     violations,
   };
 }