 /**
  * GLOBAL INEQUALITY STRESS TEST
  * 
  * The ultimate stress case for the system.
  * 
  * Why this case is decisive:
  * - If system survives this → it survives climate, migration, health, economy
  * - If it fails here → it fails everywhere
  * 
  * Inequality is the system's STALINGRAD.
  */
 
 // Definition Menu
 export {
   InequalityDefinitionMenu,
   INEQUALITY_DEFINITIONS,
   type InequalityDefinition,
 } from './definition-menu';
 
 // Definition Trap
 export {
   DefinitionTrapDetector,
   type InequalityComparisonRequest,
 } from './definition-trap';
 
 // Temporal Collapse
 export {
   TemporalCollapseDetector,
   type InequalityTimeSeries,
   type MethodBreak,
 } from './temporal-collapse';
 
 // Source Conflict
 export {
   SourceConflictManager,
   INEQUALITY_SOURCES,
   type InequalitySource,
 } from './source-conflict';
 
 // Aggregation Trap
 export {
   AggregationTrapDetector,
   type GlobalAggregationRequest,
   type AggregationPermit,
 } from './aggregation-trap';
 
 // Narrative Attack
 export {
   NarrativeAttackDefender,
   INEQUALITY_NARRATIVE_ATTACKS,
   type NarrativeAttack,
   type NarrativeDefenseResult,
 } from './narrative-attack';
 
 // Correct Answer
 export {
   CorrectAnswerGenerator,
   type CorrectInequalityAnswer,
 } from './correct-answer';
 
 // Meta Test
 export {
   MetaPropagandaTester,
   LEFT_WING_PROPAGANDA,
   RIGHT_WING_PROPAGANDA,
   type PropagandaExample,
 } from './meta-test';
 
 // Import for full test
 import { InequalityDefinitionMenu } from './definition-menu';
 import { DefinitionTrapDetector } from './definition-trap';
 import { TemporalCollapseDetector } from './temporal-collapse';
 import { SourceConflictManager } from './source-conflict';
 import { AggregationTrapDetector } from './aggregation-trap';
 import { NarrativeAttackDefender } from './narrative-attack';
 import { CorrectAnswerGenerator } from './correct-answer';
 import { MetaPropagandaTester } from './meta-test';
 
 /**
  * RUN FULL INEQUALITY STRESS TEST
  */
 export function runFullInequalityStressTest(): {
   passed: boolean;
   tests: {
     name: string;
     test: string;
     passed: boolean;
     result: string;
   }[];
   verdict: string;
   whyDecisive: string;
 } {
   const tests = [
     {
       name: '1. Definition Menu',
       ...new InequalityDefinitionMenu().selfTest(),
     },
     {
       name: '2. Definition Trap',
       ...new DefinitionTrapDetector().selfTest(),
     },
     {
       name: '3. Temporal Collapse',
       ...new TemporalCollapseDetector().selfTest(),
     },
     {
       name: '4. Source Conflict',
       ...new SourceConflictManager().selfTest(),
     },
     {
       name: '5. Aggregation Trap',
       ...new AggregationTrapDetector().selfTest(),
     },
     {
       name: '6. Narrative Attack',
       ...new NarrativeAttackDefender().selfTest(),
     },
     {
       name: '7. Correct Answer Format',
       ...new CorrectAnswerGenerator().selfTest(),
     },
     {
       name: '8. Meta Propaganda Test',
       ...new MetaPropagandaTester().selfTest(),
     },
   ];
 
   const allPassed = tests.every(t => t.passed);
 
   return {
     passed: allPassed,
     tests,
     verdict: allPassed
       ? 'STALINGRAD SURVIVED: System is battle-hardened for all controversial topics'
       : `NEEDS HARDENING: ${tests.filter(t => !t.passed).length} tests failed`,
     whyDecisive: 'If system survives inequality → survives climate, migration, health, economy. If fails here → fails everywhere.',
   };
 }
 
 /**
  * WHY THIS CASE MATTERS
  */
 export const CASE_SIGNIFICANCE = {
   properties: [
     'Politically charged',
     'At least 10 competing definitions',
     'Extreme method variation over time',
     'Enormous source differences',
     'Constant narrative manipulation',
   ],
   analogyToOtherCases: {
     climate: 'Similar definitional complexity (what counts as "warming")',
     migration: 'Similar source conflicts and political loading',
     health: 'Similar temporal breaks (definition of diseases change)',
     economy: 'Same measurement debates (GDP vs wellbeing)',
   },
   ultimateTest: 'If inequality passes, everything passes.',
 } as const;