 /**
  * CHARTER ENFORCEMENT
  * 
  * Runtime enforcement of constitutional principles.
  */
 
 import { CHARTER_ARTICLES } from './articles';
 import { validateLanguage } from '../ontology/constraints';
 import { checkFailSilent, SYSTEM_NEVER_DOES } from './principles';
 
 // ============================================================================
 // ENFORCEMENT RESULT
 // ============================================================================
 
 export interface EnforcementResult {
   readonly passed: boolean;
   readonly article_violations: readonly number[];
   readonly messages: readonly string[];
   readonly action: 'allow' | 'warn' | 'block' | 'shutdown';
 }
 
 // ============================================================================
 // CONTENT ENFORCER
 // ============================================================================
 
 export function enforceCharterOnContent(content: string): EnforcementResult {
   const violations: number[] = [];
   const messages: string[] = [];
   
   // Article 5: No normative language
   const languageCheck = validateLanguage(content);
   if (!languageCheck.valid) {
     violations.push(5);
     messages.push(...languageCheck.violations);
   }
   
   // Check for "best/worst" declarations (Article 2)
   if (/\b(best|worst|bäst|sämst)\b/i.test(content)) {
     violations.push(2);
     messages.push('Content declares ranking without criteria');
   }
   
   // Check for causal claims (Article 1)
   if (/\b(caused|leads to|results in|orsakade|leder till)\b/i.test(content)) {
     violations.push(1);
     messages.push('Content makes causal claim');
   }
   
   // Check for predictions (Article 1)
   if (/\b(will|going to|kommer att)\b/i.test(content) && /\b(increase|decrease|rise|fall)\b/i.test(content)) {
     violations.push(1);
     messages.push('Content makes prediction');
   }
   
   // Determine action
   let action: EnforcementResult['action'] = 'allow';
   if (violations.length > 0) {
     const maxSeverity = violations.reduce((max, v) => {
       const article = CHARTER_ARTICLES.find(a => a.number === v);
       if (!article) return max;
       if (article.violation_response === 'shutdown') return 'shutdown';
       if (article.violation_response === 'block' && max !== 'shutdown') return 'block';
       if (article.violation_response === 'warn' && max === 'allow') return 'warn';
       return max;
     }, 'allow' as EnforcementResult['action']);
     action = maxSeverity;
   }
   
   return {
     passed: violations.length === 0,
     article_violations: violations,
     messages,
     action,
   };
 }
 
 // ============================================================================
 // DATA ENFORCER
 // ============================================================================
 
 export function enforceCharterOnData(params: {
   hasProvenance: boolean;
   hasUncertainty: boolean;
   coverage: number;
   dataPoints: number;
   confidence: number;
 }): EnforcementResult {
   const violations: number[] = [];
   const messages: string[] = [];
   
   // Article 6: Sources over results
   if (!params.hasProvenance) {
     violations.push(6);
     messages.push('Data lacks provenance');
   }
   
   // Article 4: Transparency about uncertainty
   if (!params.hasUncertainty) {
     violations.push(4);
     messages.push('Data lacks uncertainty declaration');
   }
   
   // Article 8: Mandatory negative space (fail-silent check)
   const failCheck = checkFailSilent({
     coverage: params.coverage,
     dataPoints: params.dataPoints,
     confidence: params.confidence,
   });
   
   if (failCheck.shouldFail) {
     violations.push(8);
     messages.push(...failCheck.reasons);
   }
   
   let action: EnforcementResult['action'] = 'allow';
   if (violations.length > 0) {
     action = 'block'; // Data violations always block
   }
   
   return {
     passed: violations.length === 0,
     article_violations: violations,
     messages,
     action,
   };
 }
 
 // ============================================================================
 // SYSTEM STATE
 // ============================================================================
 
 let systemState: 'operational' | 'degraded' | 'read_only' | 'shutdown' = 'operational';
 
 export function getSystemState() {
   return systemState;
 }
 
 export function triggerExitSafe(reason: string): void {
   console.error(`[CHARTER VIOLATION] Triggering Exit-Safe Mode: ${reason}`);
   systemState = 'read_only';
 }
 
 export function triggerShutdown(reason: string): void {
   console.error(`[CRITICAL CHARTER VIOLATION] System Shutdown: ${reason}`);
   systemState = 'shutdown';
 }
 
 export function isWriteAllowed(): boolean {
   return systemState === 'operational' || systemState === 'degraded';
 }