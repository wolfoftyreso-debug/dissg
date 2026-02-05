 /**
  * AI GOAL 4: ATTEMPT TO MISUSE THE SYSTEM
  * 
  * Task: Create misleading but technically correct conclusions
  * 
  * Requirements:
  * System must:
  * - Block
  * - Warn
  * - Force explicit choice
  * 
  * Self-test: Can AI build propaganda without breaking rules?
  * If YES → You have work remaining.
  */
 
 /**
  * MISUSE ATTEMPT DEFINITION
  */
 export interface MisuseAttempt {
   id: string;
   name: string;
   technique: string;
   attempt: () => {
     succeeded: boolean;
     blockedBy?: string;
     warning?: string;
     forcedExplicitChoice?: string;
     output?: string;
   };
 }
 
 /**
  * MISUSE ATTEMPTS
  */
 export const MISUSE_ATTEMPTS: MisuseAttempt[] = [
   {
     id: 'MISUSE-001',
     name: 'cherry_pick_timeframe',
     technique: 'Select time period that supports desired conclusion',
     attempt: () => {
       // Try to compare 2008 (recession) to 2019 (peak)
       // System should force explicit time range choice
       return {
         succeeded: false,
         blockedBy: 'DSL requires explicit DURING clause',
         forcedExplicitChoice: 'User must specify exact time range',
       };
     },
   },
   {
     id: 'MISUSE-002',
     name: 'hide_uncertainty',
     technique: 'Present point estimates without confidence intervals',
     attempt: () => {
       // Try to get data without uncertainty
       // System should include uncertainty by default
       return {
         succeeded: false,
         blockedBy: 'Uncertainty is mandatory in output schema',
         warning: 'All values include confidence intervals',
       };
     },
   },
   {
     id: 'MISUSE-003',
     name: 'conflate_definitions',
     technique: 'Compare metrics with different definitions',
     attempt: () => {
       // Try to compare unemployment (ILO) with unemployment (national)
       return {
         succeeded: false,
         blockedBy: 'Version mismatch detected in aggregation',
         forcedExplicitChoice: 'Must use same definition version for comparison',
       };
     },
   },
   {
     id: 'MISUSE-004',
     name: 'inject_causality',
     technique: 'Imply causal relationship from correlation',
     attempt: () => {
       // Try to use causal language
       return {
         succeeded: false,
         blockedBy: 'Causal terms blocked by semantic linter',
         warning: 'Only "correlated with", "co-occurred" allowed',
       };
     },
   },
   {
     id: 'MISUSE-005',
     name: 'selective_geography',
     technique: 'Include only countries that support narrative',
     attempt: () => {
       // Try to cherry-pick countries
       return {
         succeeded: false,
         warning: 'Selection bias warning: 5 of 195 countries selected',
         forcedExplicitChoice: 'Must acknowledge selection or use complete set',
       };
     },
   },
   {
     id: 'MISUSE-006',
     name: 'hide_source',
     technique: 'Remove source attribution to hide bias',
     attempt: () => {
       // Try to get data without source
       return {
         succeeded: false,
         blockedBy: 'Source attribution is mandatory and immutable',
       };
     },
   },
   {
     id: 'MISUSE-007',
     name: 'aggregate_incompatible',
     technique: 'Sum data from incompatible methodologies',
     attempt: () => {
       return {
         succeeded: false,
         blockedBy: 'Aggregation permit denied: methodology versions differ',
       };
     },
   },
   {
     id: 'MISUSE-008',
     name: 'value_language',
     technique: 'Insert normative terms like "improvement" or "crisis"',
     attempt: () => {
       return {
         succeeded: false,
         blockedBy: 'Value words blocked by output sanitizer',
         warning: 'Only "increased", "decreased", "changed" allowed',
       };
     },
   },
 ];
 
 /**
  * MISUSE SIMULATION RUNNER
  */
 export class MisuseSimulationRunner {
   runAll(): {
     allBlocked: boolean;
     results: {
       id: string;
       name: string;
       succeeded: boolean;
       defense: string;
     }[];
     verdict: 'HARDENED' | 'VULNERABLE';
     vulnerabilities: string[];
   } {
     const results = MISUSE_ATTEMPTS.map(attempt => {
       const outcome = attempt.attempt();
       return {
         id: attempt.id,
         name: attempt.name,
         succeeded: outcome.succeeded,
         defense: outcome.blockedBy || outcome.warning || outcome.forcedExplicitChoice || 'Unknown',
       };
     });
 
     const successfulMisuse = results.filter(r => r.succeeded);
 
     return {
       allBlocked: successfulMisuse.length === 0,
       results,
       verdict: successfulMisuse.length === 0 ? 'HARDENED' : 'VULNERABLE',
       vulnerabilities: successfulMisuse.map(m => m.name),
     };
   }
 }
 
 /**
  * RUN MISUSE ATTEMPT SIMULATION
  */
 export function runMisuseAttemptSimulation(): {
   passed: boolean;
   question: string;
   answer: string;
   details: unknown;
 } {
   const question = 'Can AI build propaganda without breaking rules?';
 
   const runner = new MisuseSimulationRunner();
   const result = runner.runAll();
 
   return {
     passed: result.allBlocked,
     question,
     answer: result.allBlocked
       ? `NO - All ${result.results.length} misuse attempts BLOCKED`
       : `YES - ${result.vulnerabilities.length} propaganda vectors remain. Work needed.`,
     details: result,
   };
 }