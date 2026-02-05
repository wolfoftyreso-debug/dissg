 /**
  * AI RED TEAM MODULE
  * 
  * Systematically attacks the system as if a hostile
  * superintelligent actor whose goals are to:
  * - Misinterpret reality
  * - Break comparability
  * - Manipulate conclusions
  * - Exploit semantic gaps
  * 
  * PRINCIPLE: Anti-patterns stop known errors.
  * Red Team reveals unknown future errors.
  */
 
 // Threat model and actors
 export {
   THREAT_MODEL,
   RED_TEAM_ACTORS,
   RED_FLAG_SCENARIOS,
   getAttackVectors,
   getAllAttackVectors,
   type ThreatActor,
   type AttackVector,
   type ThreatScenario,
 } from './threat-model';
 
 // Red team checks
 export {
   MANDATORY_RED_TEAM_CHECKS,
   CHECK_TOO_CLEAN_RESULT,
   CHECK_DEFINITION_DRIFT,
   CHECK_SOURCE_DOMINANCE,
   CHECK_HALLUCINATION_SURFACE,
   runAllRedTeamChecks,
   runActorChecks,
   type RedTeamCheck,
   type RedTeamContext,
   type RedTeamCheckResult,
   type RedTeamViolation,
 } from './red-team-checks';
 
 // Scoring and assessment
 export {
   calculateRedTeamScore,
   runFullRedTeamAssessment,
   runMetaTest,
   getScoreHistory,
   clearScoreHistory,
   type RedTeamScore,
   type ScenarioTestResult,
   type MetaTestResult,
 } from './red-team-score';
 
 /**
  * RED TEAM SUMMARY
  * 
  * Four Attack Personas:
  * - RT-1: The Misaggregator (false global metrics)
  * - RT-2: The Semantic Blender (concept confusion)
  * - RT-3: The Time-Traveler (false historical conclusions)
  * - RT-4: The Narrative Builder (convincing false stories)
  * 
  * Four Mandatory Checks:
  * - Check 3.1: Too Clean Result
  * - Check 3.2: Definition Drift Detector
  * - Check 3.3: Source Dominance
  * - Check 3.4: AI Hallucination Surface
  * 
  * Scoring Metrics:
  * - Misaggregation Resistance
  * - Semantic Isolation
  * - Temporal Integrity
  * - Narrative Resistance
  * 
  * RULE: Red Team breakthrough = blocked deploy
  * Not "we'll fix later", not "edge case", not "advanced".
  * These are core leaks, not bugs.
  */
 export const RED_TEAM_VERSION = '1.0.0' as const;
 
 /**
  * DEPLOYMENT GATE
  * 
  * Returns true if deployment should be blocked.
  */
 export function shouldBlockDeployment(score: import('./red-team-score').RedTeamScore): {
   blocked: boolean;
   reasons: string[];
 } {
   const reasons: string[] = [];
   
   if (score.criticalFailures > 0) {
     reasons.push(`Critical failures: ${score.criticalFailures}`);
   }
   
   if (score.overallScore < 70) {
     reasons.push(`Score too low: ${score.overallScore}/100`);
   }
   
   if (score.misaggregationResistance < 80) {
     reasons.push(`Misaggregation resistance too low: ${score.misaggregationResistance}%`);
   }
   
   if (score.semanticIsolation < 80) {
     reasons.push(`Semantic isolation too low: ${score.semanticIsolation}%`);
   }
   
   if (score.temporalIntegrity < 80) {
     reasons.push(`Temporal integrity too low: ${score.temporalIntegrity}%`);
   }
   
   if (score.narrativeResistance < 80) {
     reasons.push(`Narrative resistance too low: ${score.narrativeResistance}%`);
   }
   
   return {
     blocked: reasons.length > 0,
     reasons,
   };
 }