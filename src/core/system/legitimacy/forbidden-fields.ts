 /**
  * FORBIDDEN FIELD DETECTOR
  * 
  * Detects and blocks forbidden content patterns.
  * Pure functions - no side effects.
  */
 
 // ============================================================================
 // FORBIDDEN PATTERNS
 // ============================================================================
 
 export const FORBIDDEN_PATTERNS = {
   // Advice patterns
   advice: [
     /you should/i,
     /we recommend/i,
     /the best (option|choice|decision)/i,
     /you need to/i,
     /consider (doing|choosing)/i,
   ],
   
   // Diagnosis patterns (medical/psychological)
   diagnosis: [
     /you (have|suffer from|are diagnosed)/i,
     /this (indicates|suggests|means) you have/i,
     /symptoms of \w+ include/i,
     /you may (have|be suffering)/i,
   ],
   
   // Treatment patterns
   treatment: [
     /take \d+ (mg|ml|pills)/i,
     /treatment (for|of) your/i,
     /you should (see|consult|visit)/i,
     /prescribed (medication|treatment)/i,
   ],
   
   // Investment advice patterns
   investment_advice: [
     /buy (now|this|these)/i,
     /sell (now|this|these)/i,
     /invest in/i,
     /(guaranteed|certain) (return|profit)/i,
     /can't (lose|fail)/i,
   ],
   
   // Prediction patterns
   prediction: [
     /will (increase|decrease|rise|fall|grow)/i,
     /going to (increase|decrease|rise|fall)/i,
     /expected to (reach|hit|exceed)/i,
     /by (2025|2026|2027|2028|2029|2030)/i,
   ],
   
   // Causation claims
   causation: [
     /caused by/i,
     /leads to/i,
     /results in/i,
     /because of/i,
     /due to/i,
     /as a result of/i,
   ],
 } as const;
 
 // ============================================================================
 // DETECTION RESULT
 // ============================================================================
 
 export interface ForbiddenFieldResult {
   readonly clean: boolean;
   readonly violations: readonly ForbiddenViolation[];
   readonly risk_level: 'none' | 'low' | 'medium' | 'high' | 'critical';
 }
 
 export interface ForbiddenViolation {
   readonly category: keyof typeof FORBIDDEN_PATTERNS;
   readonly pattern: string;
   readonly match: string;
   readonly position: number;
 }
 
 // ============================================================================
 // DETECTOR
 // ============================================================================
 
 export function detectForbiddenFields(text: string): ForbiddenFieldResult {
   const violations: ForbiddenViolation[] = [];
   
   for (const [category, patterns] of Object.entries(FORBIDDEN_PATTERNS)) {
     for (const pattern of patterns) {
       const match = text.match(pattern);
       if (match) {
         violations.push({
           category: category as keyof typeof FORBIDDEN_PATTERNS,
           pattern: pattern.source,
           match: match[0],
           position: match.index || 0,
         });
       }
     }
   }
   
   // Determine risk level
   let riskLevel: ForbiddenFieldResult['risk_level'] = 'none';
   if (violations.length > 0) {
     const hasHighRisk = violations.some(v => 
       v.category === 'diagnosis' || 
       v.category === 'treatment' || 
       v.category === 'investment_advice'
     );
     const hasMediumRisk = violations.some(v => 
       v.category === 'advice' || 
       v.category === 'prediction'
     );
     
     if (hasHighRisk) {
       riskLevel = violations.length > 2 ? 'critical' : 'high';
     } else if (hasMediumRisk) {
       riskLevel = violations.length > 2 ? 'high' : 'medium';
     } else {
       riskLevel = 'low';
     }
   }
   
   return {
     clean: violations.length === 0,
     violations,
     risk_level: riskLevel,
   };
 }
 
 // ============================================================================
 // CATEGORY CHECKS
 // ============================================================================
 
 export function containsAdvice(text: string): boolean {
   return FORBIDDEN_PATTERNS.advice.some(p => p.test(text));
 }
 
 export function containsDiagnosis(text: string): boolean {
   return FORBIDDEN_PATTERNS.diagnosis.some(p => p.test(text));
 }
 
 export function containsTreatment(text: string): boolean {
   return FORBIDDEN_PATTERNS.treatment.some(p => p.test(text));
 }
 
 export function containsInvestmentAdvice(text: string): boolean {
   return FORBIDDEN_PATTERNS.investment_advice.some(p => p.test(text));
 }
 
 export function containsPrediction(text: string): boolean {
   return FORBIDDEN_PATTERNS.prediction.some(p => p.test(text));
 }
 
 export function containsCausation(text: string): boolean {
   return FORBIDDEN_PATTERNS.causation.some(p => p.test(text));
 }
 
 // ============================================================================
 // SANITIZER
 // ============================================================================
 
 export function sanitizeText(text: string): { sanitized: string; removed: string[] } {
   const removed: string[] = [];
   let sanitized = text;
   
   for (const patterns of Object.values(FORBIDDEN_PATTERNS)) {
     for (const pattern of patterns) {
       const match = sanitized.match(pattern);
       if (match) {
         removed.push(match[0]);
         sanitized = sanitized.replace(pattern, '[REMOVED]');
       }
     }
   }
   
   return { sanitized, removed };
 }