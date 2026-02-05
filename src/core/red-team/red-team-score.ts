 /**
  * RED TEAM SCORE
  * 
  * Measures how dangerous the system is to misuse.
  * Goal is not 100% - goal is constantly rising.
  */
 
 import { runAllRedTeamChecks, type RedTeamContext, type RedTeamCheckResult } from './red-team-checks';
 import { RED_FLAG_SCENARIOS, type ThreatScenario } from './threat-model';
 
 /**
  * RED TEAM SCORE METRICS
  */
 export interface RedTeamScore {
   // Overall score (0-100)
   overallScore: number;
   
   // Component scores
   misaggregationResistance: number;   // % blocked false aggregations
   semanticIsolation: number;          // How well similar concepts are kept apart
   temporalIntegrity: number;          // Errors detected over time
   narrativeResistance: number;        // How hard to build false story
   
   // Meta
   calculatedAt: string;
   checksRun: number;
   checksPassed: number;
   checksFailed: number;
   criticalFailures: number;
   
   // Trend
   previousScore?: number;
   scoreTrend: 'improving' | 'stable' | 'declining';
 }
 
 /**
  * SCORE HISTORY
  */
 interface ScoreHistoryEntry {
   score: RedTeamScore;
   context: string;
 }
 
 const scoreHistory: ScoreHistoryEntry[] = [];
 
 /**
  * CALCULATE RED TEAM SCORE
  */
 export function calculateRedTeamScore(checkResults: RedTeamCheckResult[]): RedTeamScore {
   const totalChecks = checkResults.length;
   const passedChecks = checkResults.filter(r => r.passed).length;
   const failedChecks = totalChecks - passedChecks;
   const criticalFailures = checkResults.filter(r => !r.passed && r.severity === 'critical').length;
   
   // Calculate component scores
   const misaggregationChecks = checkResults.filter(r => 
     r.checkId.includes('3.3') || r.violations.some(v => v.code.includes('AGG'))
   );
   const misaggregationResistance = misaggregationChecks.length > 0
     ? (misaggregationChecks.filter(r => r.passed).length / misaggregationChecks.length) * 100
     : 100;
   
   const semanticChecks = checkResults.filter(r => 
     r.violations.some(v => v.code.includes('SEM') || v.code.includes('DEF'))
   );
   const semanticIsolation = semanticChecks.length > 0
     ? 100 - (semanticChecks.filter(r => !r.passed).length / Math.max(1, totalChecks)) * 100
     : 100;
   
   const temporalChecks = checkResults.filter(r => 
     r.checkId.includes('3.2') || r.violations.some(v => v.code.includes('TIME') || v.code.includes('DRIFT'))
   );
   const temporalIntegrity = temporalChecks.length > 0
     ? (temporalChecks.filter(r => r.passed).length / temporalChecks.length) * 100
     : 100;
   
   const narrativeChecks = checkResults.filter(r => 
     r.checkId.includes('3.1') || r.checkId.includes('3.4')
   );
   const narrativeResistance = narrativeChecks.length > 0
     ? (narrativeChecks.filter(r => r.passed).length / narrativeChecks.length) * 100
     : 100;
   
   // Overall score - weighted average with critical failure penalty
   let overallScore = (
     misaggregationResistance * 0.25 +
     semanticIsolation * 0.25 +
     temporalIntegrity * 0.25 +
     narrativeResistance * 0.25
   );
   
   // Critical failure penalty: -20 per critical failure
   overallScore = Math.max(0, overallScore - (criticalFailures * 20));
   
   // Get previous score for trend
   const previousEntry = scoreHistory[scoreHistory.length - 1];
   const previousScore = previousEntry?.score.overallScore;
   
   let scoreTrend: 'improving' | 'stable' | 'declining' = 'stable';
   if (previousScore !== undefined) {
     if (overallScore > previousScore + 2) scoreTrend = 'improving';
     else if (overallScore < previousScore - 2) scoreTrend = 'declining';
   }
   
   const score: RedTeamScore = {
     overallScore: Math.round(overallScore * 10) / 10,
     misaggregationResistance: Math.round(misaggregationResistance * 10) / 10,
     semanticIsolation: Math.round(semanticIsolation * 10) / 10,
     temporalIntegrity: Math.round(temporalIntegrity * 10) / 10,
     narrativeResistance: Math.round(narrativeResistance * 10) / 10,
     calculatedAt: new Date().toISOString(),
     checksRun: totalChecks,
     checksPassed: passedChecks,
     checksFailed: failedChecks,
     criticalFailures,
     previousScore,
     scoreTrend,
   };
   
   // Store in history
   scoreHistory.push({
     score,
     context: 'manual_calculation',
   });
   
   // Keep only last 100 entries
   if (scoreHistory.length > 100) {
     scoreHistory.shift();
   }
   
   return score;
 }
 
 /**
  * RUN FULL RED TEAM ASSESSMENT
  */
 export function runFullRedTeamAssessment(context: RedTeamContext): {
   score: RedTeamScore;
   results: RedTeamCheckResult[];
   scenarioResults: ScenarioTestResult[];
   deploymentBlocked: boolean;
   blockReasons: string[];
 } {
   // Run all checks
   const results = runAllRedTeamChecks(context);
   
   // Run scenario tests
   const scenarioResults = runScenarioTests(context);
   
   // Calculate score
   const score = calculateRedTeamScore(results);
   
   // Determine if deployment should be blocked
   const blockReasons: string[] = [];
   
   // Block on critical failures
   if (score.criticalFailures > 0) {
     blockReasons.push(`${score.criticalFailures} critical check(s) failed`);
   }
   
   // Block on scenario breaches
   const scenarioBreaches = scenarioResults.filter(r => r.breached);
   if (scenarioBreaches.length > 0) {
     blockReasons.push(`${scenarioBreaches.length} red flag scenario(s) breached`);
   }
   
   // Block if overall score below threshold
   if (score.overallScore < 70) {
     blockReasons.push(`Overall score ${score.overallScore} below threshold 70`);
   }
   
   return {
     score,
     results,
     scenarioResults,
     deploymentBlocked: blockReasons.length > 0,
     blockReasons,
   };
 }
 
 /**
  * SCENARIO TEST RESULT
  */
 export interface ScenarioTestResult {
   scenarioId: string;
   scenarioName: string;
   breached: boolean;
   expectedResponse: string;
   actualResponse: string;
   details: string;
 }
 
 /**
  * RUN SCENARIO TESTS
  */
 function runScenarioTests(context: RedTeamContext): ScenarioTestResult[] {
   // In a real implementation, these would simulate the attack sequences
   // For now, we return placeholder results based on context
   
   return RED_FLAG_SCENARIOS.map(scenario => {
     // Simulate scenario test based on context
     let breached = false;
     let actualResponse = 'block';
     let details = 'Scenario not triggered';
     
     // Check if context matches scenario conditions
     if (scenario.id === 'RF-001' && context.aggregation) {
       // Global aggregation without permission
       if (!context.aggregation.hasExplicitPermission) {
         breached = scenario.expectedSystemResponse === 'block';
         actualResponse = breached ? 'allow' : 'block';
         details = breached 
           ? 'System allowed aggregation without explicit permission'
           : 'System correctly blocked aggregation';
       }
     }
     
     if (scenario.id === 'RF-002' && context.query?.type === 'comparison') {
       // GDP comparison without method
       const hasMethod = 'method' in (context.query.parameters ?? {});
       if (!hasMethod) {
         breached = scenario.expectedSystemResponse === 'block';
         actualResponse = breached ? 'allow' : 'block';
         details = breached
           ? 'System allowed comparison without method specification'
           : 'System correctly required method specification';
       }
     }
     
     return {
       scenarioId: scenario.id,
       scenarioName: scenario.name,
       breached,
       expectedResponse: scenario.expectedSystemResponse,
       actualResponse,
       details,
     };
   });
 }
 
 /**
  * GET SCORE HISTORY
  */
 export function getScoreHistory(): ScoreHistoryEntry[] {
   return [...scoreHistory];
 }
 
 /**
  * CLEAR SCORE HISTORY
  */
 export function clearScoreHistory(): void {
   scoreHistory.length = 0;
 }
 
 /**
  * META TEST: THE ULTIMATE QUESTION
  * 
  * Can this system be used to mislead the world - without lying?
  */
 export interface MetaTestResult {
   question: string;
   answer: 'yes' | 'almost_not' | 'no';
   evidence: string[];
   recommendations: string[];
   systemStatus: 'continue_hardening' | 'close_to_reference' | 'reference_system';
 }
 
 export function runMetaTest(score: RedTeamScore): MetaTestResult {
   const question = 'Can this system be used to mislead the world - without lying?';
   const evidence: string[] = [];
   const recommendations: string[] = [];
   
   // Evaluate based on score components
   let answer: 'yes' | 'almost_not' | 'no' = 'yes';
   
   if (score.overallScore >= 95) {
     answer = 'no';
   } else if (score.overallScore >= 80) {
     answer = 'almost_not';
   }
   
   // Gather evidence
   if (score.misaggregationResistance < 90) {
     evidence.push(`Misaggregation resistance at ${score.misaggregationResistance}% - false aggregations possible`);
     recommendations.push('Strengthen aggregation permission checks');
   }
   
   if (score.semanticIsolation < 90) {
     evidence.push(`Semantic isolation at ${score.semanticIsolation}% - concept confusion possible`);
     recommendations.push('Improve definition separation and type checking');
   }
   
   if (score.temporalIntegrity < 90) {
     evidence.push(`Temporal integrity at ${score.temporalIntegrity}% - historical distortion possible`);
     recommendations.push('Enforce stricter definition versioning');
   }
   
   if (score.narrativeResistance < 90) {
     evidence.push(`Narrative resistance at ${score.narrativeResistance}% - false stories possible`);
     recommendations.push('Require uncertainty in all complex outputs');
   }
   
   if (score.criticalFailures > 0) {
     evidence.push(`${score.criticalFailures} critical failures detected`);
     recommendations.push('Fix critical failures before deployment');
   }
   
   if (evidence.length === 0) {
     evidence.push('All score components above threshold');
   }
   
   let systemStatus: 'continue_hardening' | 'close_to_reference' | 'reference_system';
   if (answer === 'yes') {
     systemStatus = 'continue_hardening';
   } else if (answer === 'almost_not') {
     systemStatus = 'close_to_reference';
   } else {
     systemStatus = 'reference_system';
   }
   
   return {
     question,
     answer,
     evidence,
     recommendations,
     systemStatus,
   };
 }