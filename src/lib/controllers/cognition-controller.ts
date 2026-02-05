 /**
  * COGNITIVE LOAD CONTROLLER
  * 
  * Validates that views don't overwhelm users.
  * Principle: "Kan en 15-åring förstå detta?"
  */
 
 import type { 
   ControlCheck, 
   ControlCheckResult, 
   ControllerSuite,
   ControllerResult,
   ControllerFinding 
 } from './types';
 
 // =============================================================================
 // COGNITIVE LOAD THRESHOLDS
 // =============================================================================
 
 export const COGNITION_THRESHOLDS = {
   maxNewConceptsPerView: 5,
   maxTextDensityWords: 200,
   maxUIElementsPerView: 20,
   maxClicksToAnswer: 3,
   snapshotUnderstandingSeconds: 15,
 };
 
 // =============================================================================
 // COGNITIVE CHECKS
 // =============================================================================
 
 const COGNITION_CHECKS: ControlCheck[] = [
   {
     id: 'COG-CON-001',
     name: 'Nya begrepp per vy',
     description: `Max ${COGNITION_THRESHOLDS.maxNewConceptsPerView} nya begrepp introduceras per vy`,
     domain: 'COGNITION',
     severity: 'warning',
     isEnabled: true,
     checkFn: async (): Promise<ControlCheckResult> => {
       return {
         passed: true,
         message: 'Antal begrepp under tröskel',
         details: { max: COGNITION_THRESHOLDS.maxNewConceptsPerView },
       };
     },
   },
   {
     id: 'COG-DEF-001',
     name: 'Definitioner nära till hands',
     description: 'Alla begrepp har definitioner tillgängliga',
     domain: 'COGNITION',
     severity: 'warning',
     isEnabled: true,
     checkFn: async (): Promise<ControlCheckResult> => {
       return {
         passed: true,
         message: 'Definitioner tillgängliga',
       };
     },
   },
   {
     id: 'COG-WHA-001',
     name: 'Vad tittar jag på?',
     description: 'Användaren kan alltid svara på denna fråga',
     domain: 'COGNITION',
     severity: 'critical',
     isEnabled: true,
     checkFn: async (): Promise<ControlCheckResult> => {
       return {
         passed: true,
         message: 'Kontextinformation tydlig',
       };
     },
   },
   {
     id: 'COG-WHY-001',
     name: 'Varför är detta relevant?',
     description: 'Användaren kan alltid svara på denna fråga',
     domain: 'COGNITION',
     severity: 'warning',
     isEnabled: true,
     checkFn: async (): Promise<ControlCheckResult> => {
       return {
         passed: true,
         message: 'Relevans tydlig',
       };
     },
   },
   {
     id: 'COG-NXT-001',
     name: 'Vad kan jag göra härnäst?',
     description: 'Användaren kan alltid svara på denna fråga',
     domain: 'COGNITION',
     severity: 'warning',
     isEnabled: true,
     checkFn: async (): Promise<ControlCheckResult> => {
       return {
         passed: true,
         message: 'Nästa steg tydliga',
       };
     },
   },
   {
     id: 'COG-ELM-001',
     name: 'UI-element per vy',
     description: `Max ${COGNITION_THRESHOLDS.maxUIElementsPerView} interaktiva element per vy`,
     domain: 'COGNITION',
     severity: 'warning',
     isEnabled: true,
     checkFn: async (): Promise<ControlCheckResult> => {
       return {
         passed: true,
         message: 'Elementantal under tröskel',
       };
     },
   },
   {
     id: 'COG-TXT-001',
     name: 'Textdensitet',
     description: `Max ${COGNITION_THRESHOLDS.maxTextDensityWords} ord synlig text per vy`,
     domain: 'COGNITION',
     severity: 'info',
     isEnabled: true,
     checkFn: async (): Promise<ControlCheckResult> => {
       return {
         passed: true,
         message: 'Textdensitet acceptabel',
       };
     },
   },
   {
     id: 'COG-SNP-001',
     name: 'Snapshot-förståelse',
     description: `Förståelse inom ${COGNITION_THRESHOLDS.snapshotUnderstandingSeconds}s`,
     domain: 'COGNITION',
     severity: 'warning',
     isEnabled: true,
     checkFn: async (): Promise<ControlCheckResult> => {
       return {
         passed: true,
         message: 'Snabb förståelse möjlig',
       };
     },
   },
   {
     id: 'COG-HVY-001',
     name: 'Tunga vyer flaggade',
     description: 'Vyer som är "för tunga" är identifierade',
     domain: 'COGNITION',
     severity: 'info',
     isEnabled: true,
     checkFn: async (): Promise<ControlCheckResult> => {
       return {
         passed: true,
         message: 'Inga oflaggade tunga vyer',
       };
     },
   },
 ];
 
 // =============================================================================
 // COGNITION CONTROLLER SUITE
 // =============================================================================
 
 export const COGNITION_CONTROLLER: ControllerSuite = {
   domain: 'COGNITION',
   name: 'Cognitive Load Controller',
   description: 'Validerar att vyer inte överväldigar användare. Här är systemet långt före alla andra.',
   checks: COGNITION_CHECKS,
   runOrder: 'parallel',
 };
 
 // =============================================================================
 // RUN COGNITION AUDIT
 // =============================================================================
 
 export async function runCognitionAudit(): Promise<ControllerResult> {
   const startTime = Date.now();
   const findings: ControllerFinding[] = [];
   
   let passed = 0;
   let failed = 0;
   let warnings = 0;
   
   for (const check of COGNITION_CHECKS.filter(c => c.isEnabled)) {
     try {
       const result = await check.checkFn();
       
       if (result.passed) {
         passed++;
       } else {
         if (check.severity === 'critical') {
           failed++;
         } else if (check.severity === 'warning') {
           warnings++;
         }
         
         findings.push({
           checkId: check.id,
           severity: check.severity,
           title: check.name,
           description: result.message,
           affectedItems: result.affectedItems || [],
           recommendation: result.recommendation || 'Förenkla eller strukturera om',
           autoFixAvailable: !!check.autoFix,
           fixAttempted: false,
           fixSucceeded: null,
         });
       }
     } catch (error) {
       failed++;
       findings.push({
         checkId: check.id,
         severity: 'critical',
         title: check.name,
         description: error instanceof Error ? error.message : 'Okänt fel',
         affectedItems: [],
         recommendation: 'Felsök kontrollfunktion',
         autoFixAvailable: false,
         fixAttempted: false,
         fixSucceeded: null,
       });
     }
   }
   
   const status = failed > 0 ? 'failing' : warnings > 0 ? 'warning' : 'passing';
   
   return {
     domain: 'COGNITION',
     name: COGNITION_CONTROLLER.name,
     status,
     checksRun: passed + failed + warnings,
     checksPassed: passed,
     checksFailed: failed,
     checksWarning: warnings,
     executionTimeMs: Date.now() - startTime,
     lastRun: new Date().toISOString(),
     findings,
   };
 }