 /**
  * CONTROLLER SYSTEM INDEX
  * 
  * Unified export for all 5 controller modules.
  * Machine-executable control and revision infrastructure.
  */
 
 // Types
 export type {
   ControllerDomain,
   ControllerStatus,
   ControlCheck,
   ControlCheckResult,
   ControllerResult,
   ControllerFinding,
   ControllerSuite,
   SelfRevisionQuestion,
   SelfRevisionResult,
   SystemAuditState,
 } from './types';
 
 export { SELF_REVISION_QUESTIONS } from './types';
 
 // Controllers
 export { 
   DATA_INTEGRITY_CONTROLLER, 
   runDataIntegrityAudit 
 } from './data-integrity-controller';
 
 export { 
   NAVIGATION_CONTROLLER, 
   runNavigationAudit 
 } from './navigation-controller';
 
 export { 
   UI_CONTROLLER, 
   runUIAudit 
 } from './ui-controller';
 
 export { 
   CHART_CONTROLLER, 
   runChartAudit 
 } from './chart-controller';
 
 export { 
   COGNITION_CONTROLLER,
   COGNITION_THRESHOLDS,
   runCognitionAudit 
 } from './cognition-controller';
 
 // =============================================================================
 // ALL CONTROLLERS
 // =============================================================================
 
 import { DATA_INTEGRITY_CONTROLLER, runDataIntegrityAudit } from './data-integrity-controller';
 import { NAVIGATION_CONTROLLER, runNavigationAudit } from './navigation-controller';
 import { UI_CONTROLLER, runUIAudit } from './ui-controller';
 import { CHART_CONTROLLER, runChartAudit } from './chart-controller';
 import { COGNITION_CONTROLLER, runCognitionAudit } from './cognition-controller';
 import type { ControllerSuite, ControllerResult, ControllerDomain, SelfRevisionResult } from './types';
 import { SELF_REVISION_QUESTIONS } from './types';
 
 export const ALL_CONTROLLERS: ControllerSuite[] = [
   DATA_INTEGRITY_CONTROLLER,
   NAVIGATION_CONTROLLER,
   UI_CONTROLLER,
   CHART_CONTROLLER,
   COGNITION_CONTROLLER,
 ];
 
 // =============================================================================
 // FULL SYSTEM AUDIT
 // =============================================================================
 
 export interface FullAuditReport {
   timestamp: string;
   overallStatus: 'healthy' | 'degraded' | 'critical';
   totalChecks: number;
   totalPassed: number;
   totalFailed: number;
   totalWarnings: number;
   executionTimeMs: number;
   controllerResults: ControllerResult[];
   selfRevisionResults: SelfRevisionResult[];
   criticalFindings: number;
   recommendations: string[];
 }
 
 export async function runFullSystemAudit(): Promise<FullAuditReport> {
   const startTime = Date.now();
   
   // Run all controller audits in parallel
   const [dataResult, navResult, uiResult, chartResult, cogResult] = await Promise.all([
     runDataIntegrityAudit(),
     runNavigationAudit(),
     runUIAudit(),
     runChartAudit(),
     runCognitionAudit(),
   ]);
   
   const controllerResults = [dataResult, navResult, uiResult, chartResult, cogResult];
   
   // Run self-revision questions
   const selfRevisionResults: SelfRevisionResult[] = await Promise.all(
     SELF_REVISION_QUESTIONS.map(async (q) => ({
       questionId: q.id,
       passed: await q.checkFn(),
       lastChecked: new Date().toISOString(),
       improvementInitiated: false,
     }))
   );
   
   // Calculate totals
   const totalChecks = controllerResults.reduce((sum, r) => sum + r.checksRun, 0);
   const totalPassed = controllerResults.reduce((sum, r) => sum + r.checksPassed, 0);
   const totalFailed = controllerResults.reduce((sum, r) => sum + r.checksFailed, 0);
   const totalWarnings = controllerResults.reduce((sum, r) => sum + r.checksWarning, 0);
   
   // Count critical findings
   const criticalFindings = controllerResults.reduce((sum, r) => 
     sum + r.findings.filter(f => f.severity === 'critical').length, 0
   );
   
   // Determine overall status
   let overallStatus: 'healthy' | 'degraded' | 'critical' = 'healthy';
   if (totalWarnings > 0) overallStatus = 'degraded';
   if (totalFailed > 0 || criticalFindings > 0) overallStatus = 'critical';
   
   // Generate recommendations
   const recommendations: string[] = [];
   
   for (const result of controllerResults) {
     if (result.status === 'failing') {
       recommendations.push(`[${result.domain}] ${result.findings[0]?.recommendation || 'Åtgärda kritiska problem'}`);
     }
   }
   
   for (const srResult of selfRevisionResults) {
     if (!srResult.passed) {
       const question = SELF_REVISION_QUESTIONS.find(q => q.id === srResult.questionId);
       if (question) {
         recommendations.push(`[REVISION] ${question.improvementAction}`);
       }
     }
   }
   
   return {
     timestamp: new Date().toISOString(),
     overallStatus,
     totalChecks,
     totalPassed,
     totalFailed,
     totalWarnings,
     executionTimeMs: Date.now() - startTime,
     controllerResults,
     selfRevisionResults,
     criticalFindings,
     recommendations,
   };
 }
 
 // =============================================================================
 // CONTINUOUS SELF-AUDIT LOOP
 // =============================================================================
 
 let auditInterval: ReturnType<typeof setInterval> | null = null;
 let latestAuditReport: FullAuditReport | null = null;
 
 export function startContinuousAudit(intervalMs: number = 60000): void {
   if (auditInterval) {
     console.warn('[AUDIT] Continuous audit already running');
     return;
   }
   
   console.log(`[AUDIT] Starting continuous self-audit (interval: ${intervalMs}ms)`);
   
   // Run immediately
   runFullSystemAudit().then(report => {
     latestAuditReport = report;
     console.log(`[AUDIT] Initial audit complete: ${report.overallStatus}`);
   });
   
   // Set up interval
   auditInterval = setInterval(async () => {
     const report = await runFullSystemAudit();
     latestAuditReport = report;
     
     if (report.overallStatus === 'critical') {
       console.error('[AUDIT] CRITICAL: System health degraded');
     }
   }, intervalMs);
 }
 
 export function stopContinuousAudit(): void {
   if (auditInterval) {
     clearInterval(auditInterval);
     auditInterval = null;
     console.log('[AUDIT] Continuous audit stopped');
   }
 }
 
 export function getLatestAuditReport(): FullAuditReport | null {
   return latestAuditReport;
 }