 /**
  * EVOLUTION GATES
  * 
  * Nothing passes for free.
  * Every change must pass four gates.
  * One failure = change dies.
  */
 
 import type { GateResult, EvolutionChange } from './evolution-types';
 
 /**
  * SEMANTIC GATE
  * 
  * Question: Does this concept make the world clearer or fuzzier?
  * ASSERT semantic_entropy_after < semantic_entropy_before
  */
 export function runSemanticGate(change: EvolutionChange): GateResult {
   const violations: string[] = [];
   
   // Check for semantic widening
   if (change.schemaOperation === 'WIDEN_MEANING') {
     violations.push('FORBIDDEN: Widening meaning increases semantic entropy');
   }
   
   // Check for vague language in description
   const vagueTerms = ['flexible', 'general', 'various', 'etc', 'and more'];
   for (const term of vagueTerms) {
     if (change.description.toLowerCase().includes(term)) {
       violations.push(`WARNING: Vague term "${term}" suggests semantic fuzziness`);
     }
   }
   
   // Check commit message for forbidden patterns
   if (change.commitMessage) {
     const msg = change.commitMessage.toLowerCase();
     if (msg.includes('basically') || msg.includes('essentially')) {
       violations.push('FORBIDDEN: "Basically/essentially" indicates semantic approximation');
     }
   }
   
   return {
     gate: 'semantic',
     passed: violations.length === 0,
     details: violations.length === 0 
       ? 'Semantic entropy maintained or reduced'
       : 'Semantic clarity compromised',
     violations,
   };
 }
 
 /**
  * TEMPORAL GATE
  * 
  * Question: Can this change be applied backwards without history loss?
  * ASSERT historical_data IS NOT invalidated
  */
 export function runTemporalGate(change: EvolutionChange): GateResult {
   const violations: string[] = [];
   
   // Check for breaking changes
   if (change.schemaOperation === 'MODIFY_IN_PLACE') {
     violations.push('FORBIDDEN: In-place modification invalidates historical data');
   }
   
   if (change.schemaOperation === 'RENAME_WITHOUT_NEW_ID') {
     violations.push('FORBIDDEN: Renaming without new ID breaks temporal consistency');
   }
   
   // Check if change requires historical reinterpretation
   const temporalRisks = ['redefine', 'reinterpret', 'was actually', 'should have been'];
   for (const risk of temporalRisks) {
     if (change.description.toLowerCase().includes(risk)) {
       violations.push(`WARNING: "${risk}" suggests historical revisionism`);
     }
   }
   
   return {
     gate: 'temporal',
     passed: violations.length === 0,
     details: violations.length === 0
       ? 'Historical data integrity preserved'
       : 'Historical data at risk',
     violations,
   };
 }
 
 /**
  * AGGREGATION GATE
  * 
  * Question: Does this create new false global numbers?
  * ASSERT no_new_implicit_aggregation_paths
  */
 export function runAggregationGate(change: EvolutionChange): GateResult {
   const violations: string[] = [];
   
   // Check for implicit aggregation risks
   const aggregationRisks = ['total', 'sum', 'average', 'aggregate', 'combined'];
   for (const risk of aggregationRisks) {
     if (change.description.toLowerCase().includes(risk)) {
       violations.push(`WARNING: "${risk}" may create implicit aggregation path - requires explicit validation`);
     }
   }
   
   // Check for cross-definition mixing
   if (change.schemaOperation === 'RELATE') {
     // Relations are allowed but must be explicit
     // This would check if the relation crosses definition boundaries
   }
   
   return {
     gate: 'aggregation',
     passed: violations.filter(v => v.startsWith('FORBIDDEN')).length === 0,
     details: violations.length === 0
       ? 'No new implicit aggregation paths'
       : 'Aggregation paths require validation',
     violations,
   };
 }
 
 /**
  * RED TEAM GATE
  * 
  * Question: Can a hostile AI exploit this for misinterpretation?
  * RUN red_team_scenarios
  * ASSERT no_new_attack_surface
  */
 export function runRedTeamGate(change: EvolutionChange): GateResult {
   const violations: string[] = [];
   
   // Simulate red team scenarios
   const redTeamScenarios = [
     {
       name: 'cherry_picking',
       check: () => change.schemaOperation === 'EXTEND' && 
         change.description.includes('optional'),
       violation: 'New optional field could enable selective data presentation',
     },
     {
       name: 'false_equivalence',
       check: () => change.schemaOperation === 'RELATE' &&
         !change.description.includes('explicit'),
       violation: 'Implicit relation could be misused for false equivalence',
     },
     {
       name: 'scope_confusion',
       check: () => change.description.toLowerCase().includes('general') ||
         change.description.toLowerCase().includes('broad'),
       violation: 'Broad scope increases misinterpretation surface',
     },
   ];
   
   for (const scenario of redTeamScenarios) {
     if (scenario.check()) {
       violations.push(`RED TEAM [${scenario.name}]: ${scenario.violation}`);
     }
   }
   
   return {
     gate: 'red_team',
     passed: violations.length === 0,
     details: violations.length === 0
       ? 'No new attack surface detected'
       : 'Potential misuse vectors identified',
     violations,
   };
 }
 
 /**
  * RUN ALL GATES
  */
 export function runAllEvolutionGates(change: EvolutionChange): {
   passed: boolean;
   gates: GateResult[];
   blockedBy?: string;
 } {
   const semanticResult = runSemanticGate(change);
   const temporalResult = runTemporalGate(change);
   const aggregationResult = runAggregationGate(change);
   const redTeamResult = runRedTeamGate(change);
   
   const gates = [semanticResult, temporalResult, aggregationResult, redTeamResult];
   const failed = gates.find(g => !g.passed);
   
   return {
     passed: !failed,
     gates,
     blockedBy: failed?.gate,
   };
 }
 
 /**
  * GATE INVARIANTS
  */
 export const GATE_INVARIANTS = {
   semantic: 'semantic_entropy_after < semantic_entropy_before',
   temporal: 'historical_data IS NOT invalidated',
   aggregation: 'no_new_implicit_aggregation_paths',
   redTeam: 'no_new_attack_surface',
 } as const;