 /**
  * LEGITIMACY VALIDATOR
  * 
  * Pure functions for validating outputs before publication.
  */
 
 import { enforceCharterOnContent, enforceCharterOnData, type EnforcementResult } from '../charter/enforcement';
 import { validateLanguage, DATA_CONSTRAINTS } from '../ontology/constraints';
 
 // ============================================================================
 // VALIDATION RESULT
 // ============================================================================
 
 export interface ValidationResult {
   readonly valid: boolean;
   readonly legitimacy_score: number; // 0.0 - 1.0
   readonly charter_check: EnforcementResult;
   readonly field_violations: readonly string[];
   readonly coverage_check: CoverageResult;
   readonly can_publish: boolean;
   readonly must_show_gaps: boolean;
 }
 
 export interface CoverageResult {
   readonly percent: number;
   readonly meets_threshold: boolean;
   readonly gaps: readonly string[];
 }
 
 // ============================================================================
 // OUTPUT VALIDATOR
 // ============================================================================
 
 export interface OutputToValidate {
   readonly content: string;
   readonly hasProvenance: boolean;
   readonly hasUncertainty: boolean;
   readonly coverage: number;
   readonly dataPoints: number;
   readonly confidence: number;
   readonly fields: Record<string, unknown>;
 }
 
 export function validateOutput(output: OutputToValidate): ValidationResult {
   // Charter enforcement on content
   const charterCheck = enforceCharterOnContent(output.content);
   
   // Charter enforcement on data
   const dataCheck = enforceCharterOnData({
     hasProvenance: output.hasProvenance,
     hasUncertainty: output.hasUncertainty,
     coverage: output.coverage,
     dataPoints: output.dataPoints,
     confidence: output.confidence,
   });
   
   // Field validation
   const fieldViolations = validateFields(output.fields);
   
   // Coverage check
   const coverageCheck: CoverageResult = {
     percent: output.coverage,
     meets_threshold: output.coverage >= DATA_CONSTRAINTS.min_coverage_percent,
     gaps: output.coverage < 100 ? [`Coverage at ${output.coverage}%`] : [],
   };
   
   // Calculate legitimacy score
   let score = 1.0;
   if (!charterCheck.passed) score -= 0.4;
   if (!dataCheck.passed) score -= 0.3;
   if (fieldViolations.length > 0) score -= 0.2;
   if (!coverageCheck.meets_threshold) score -= 0.1;
   score = Math.max(0, score);
   
   // Determine publishability
   const canPublish = charterCheck.passed && dataCheck.passed && fieldViolations.length === 0;
   
   return {
     valid: canPublish && coverageCheck.meets_threshold,
     legitimacy_score: score,
     charter_check: charterCheck,
     field_violations: fieldViolations,
     coverage_check: coverageCheck,
     can_publish: canPublish,
     must_show_gaps: !coverageCheck.meets_threshold || output.confidence < 0.8,
   };
 }
 
 // ============================================================================
 // FIELD VALIDATOR
 // ============================================================================
 
 function validateFields(fields: Record<string, unknown>): string[] {
   const violations: string[] = [];
   
   for (const [key, value] of Object.entries(fields)) {
     if (typeof value === 'string') {
       const langCheck = validateLanguage(value);
       if (!langCheck.valid) {
         violations.push(`Field "${key}": ${langCheck.violations.join(', ')}`);
       }
     }
   }
   
   return violations;
 }
 
 // ============================================================================
 // QUICK VALIDATORS
 // ============================================================================
 
 export function isLegitimate(output: OutputToValidate): boolean {
   return validateOutput(output).valid;
 }
 
 export function getLegitimacyScore(output: OutputToValidate): number {
   return validateOutput(output).legitimacy_score;
 }
 
 export function canPublish(output: OutputToValidate): boolean {
   return validateOutput(output).can_publish;
 }