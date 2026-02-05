 /**
  * EVOLUTION ENGINE
  * 
  * Orchestrates all evolution validation, gates, and metrics.
  * Enforces the anti-entropy laws.
  */
 
 import type { EvolutionChange, EvolutionMetrics, SelfReinforcingCheck } from './evolution-types';
 import { runAllEvolutionGates, GATE_INVARIANTS } from './evolution-gates';
 import { validateEvolutionChange, EVOLUTION_LAWS, EVOLUTION_SELF_TESTS } from './evolution-validator';
 import { calculateEvolutionMetrics, compareMetrics, checkSelfReinforcing, METRIC_TARGETS } from './evolution-metrics';
 
 /**
  * EVOLUTION ENGINE
  */
 export class EvolutionEngine {
   private metricsHistory: EvolutionMetrics[] = [];
   private changeHistory: EvolutionChange[] = [];
   
   /**
    * PROCESS EVOLUTION CHANGE
    * 
    * Main entry point for any system change.
    */
   processChange(change: EvolutionChange): {
     approved: boolean;
     change: EvolutionChange;
     report: EvolutionReport;
   } {
     // Step 1: Validate evolution direction and schema operation
     const validation = validateEvolutionChange(change);
     
     // Step 2: Run all gates
     const gateResults = runAllEvolutionGates(change);
     
     // Update change with gate results
     change.semanticGate = gateResults.gates.find(g => g.gate === 'semantic');
     change.temporalGate = gateResults.gates.find(g => g.gate === 'temporal');
     change.aggregationGate = gateResults.gates.find(g => g.gate === 'aggregation');
     change.redTeamGate = gateResults.gates.find(g => g.gate === 'red_team');
     
     // Step 3: Final approval
     const approved = validation.valid && gateResults.passed;
     change.approved = approved;
     
     if (!approved) {
       change.rejectionReason = [
         ...validation.violations,
         gateResults.blockedBy ? `Blocked by ${gateResults.blockedBy} gate` : '',
       ].filter(Boolean).join('; ');
     }
     
     // Store in history
     this.changeHistory.push(change);
     
     // Generate report
     const report = this.generateReport(change, validation, gateResults);
     
     return { approved, change, report };
   }
   
   /**
    * CALCULATE CURRENT METRICS
    */
   calculateMetrics(
     schemaCount: number,
     totalConstraints: number,
     explicitRelations: number,
     implicitAssumptions: number
   ): EvolutionMetrics {
     const recentChanges = this.changeHistory.filter(c => 
       new Date(c.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
     ).length;
     
     const recentViolations = this.changeHistory.filter(c =>
       !c.approved &&
       new Date(c.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
     ).length;
     
     const metrics = calculateEvolutionMetrics(
       schemaCount,
       totalConstraints,
       explicitRelations,
       implicitAssumptions,
       recentChanges,
       recentViolations
     );
     
     this.metricsHistory.push(metrics);
     
     return metrics;
   }
   
   /**
    * COMPARE WITH PREVIOUS
    */
   compareWithPrevious(): ReturnType<typeof compareMetrics> | null {
     if (this.metricsHistory.length < 2) {
       return null;
     }
     
     const current = this.metricsHistory[this.metricsHistory.length - 1];
     const previous = this.metricsHistory[this.metricsHistory.length - 2];
     
     return compareMetrics(previous, current);
   }
   
   /**
    * RUN SELF-REINFORCING CHECK
    */
   checkSelfReinforcing(
     metric: string,
     ruleCountBefore: number,
     ruleCountAfter: number,
     exceptionCountBefore: number,
     exceptionCountAfter: number
   ): SelfReinforcingCheck {
     return checkSelfReinforcing(
       metric,
       ruleCountBefore,
       ruleCountAfter,
       exceptionCountBefore,
       exceptionCountAfter
     );
   }
   
   /**
    * YEARLY META-TEST
    */
   runYearlyMetaTest(): YearlyMetaTestResult {
     const question = `If this system survives us – 
       will future intelligence see it as an archive of truth 
       or as an artifact of our time?`;
     
     // Analyze metrics trend
     const improving = this.metricsHistory.length >= 2 &&
       this.metricsHistory[this.metricsHistory.length - 1].healthScore >
       this.metricsHistory[0].healthScore;
     
     // Count rejected changes (discipline maintained)
     const rejectionRate = this.changeHistory.length > 0
       ? this.changeHistory.filter(c => !c.approved).length / this.changeHistory.length
       : 0;
     
     // High rejection rate = discipline maintained
     const disciplineMaintained = rejectionRate > 0.2;
     
     const assessment = improving && disciplineMaintained
       ? 'archive_of_truth'
       : 'artifact_of_time';
     
     return {
       question,
       assessment,
       improving,
       rejectionRate,
       disciplineMaintained,
       recommendation: assessment === 'archive_of_truth'
         ? 'System aging well - maintain discipline'
         : 'Too much contemporaneity, not enough structure - increase rigor',
     };
   }
   
   /**
    * GENERATE REPORT
    */
   private generateReport(
     change: EvolutionChange,
     validation: ReturnType<typeof validateEvolutionChange>,
     gateResults: ReturnType<typeof runAllEvolutionGates>
   ): EvolutionReport {
     return {
       changeId: change.id,
       timestamp: new Date().toISOString(),
       approved: change.approved,
       
       validation: {
         valid: validation.valid,
         violations: validation.violations,
         warnings: validation.warnings,
       },
       
       gates: {
         passed: gateResults.passed,
         blockedBy: gateResults.blockedBy,
         results: gateResults.gates,
       },
       
       recommendation: validation.recommendation,
       
       laws: EVOLUTION_LAWS,
       invariants: GATE_INVARIANTS,
       selfTests: EVOLUTION_SELF_TESTS,
       metricTargets: METRIC_TARGETS,
     };
   }
 }
 
 /**
  * TYPES
  */
 export interface EvolutionReport {
   changeId: string;
   timestamp: string;
   approved: boolean;
   
   validation: {
     valid: boolean;
     violations: string[];
     warnings: string[];
   };
   
   gates: {
     passed: boolean;
     blockedBy?: string;
     results: any[];
   };
   
   recommendation: string;
   
   laws: typeof EVOLUTION_LAWS;
   invariants: typeof GATE_INVARIANTS;
   selfTests: typeof EVOLUTION_SELF_TESTS;
   metricTargets: typeof METRIC_TARGETS;
 }
 
 export interface YearlyMetaTestResult {
   question: string;
   assessment: 'archive_of_truth' | 'artifact_of_time';
   improving: boolean;
   rejectionRate: number;
   disciplineMaintained: boolean;
   recommendation: string;
 }
 
 /**
  * CREATE ENGINE INSTANCE
  */
 export function createEvolutionEngine(): EvolutionEngine {
   return new EvolutionEngine();
 }