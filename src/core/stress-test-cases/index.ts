 /**
  * STRESS TEST CASES
  * 
  * Extreme verification through controversial, politically-loaded cases.
  * 
  * If the system survives these → it survives everything.
  * If it fails → fundamental hardening needed.
  */
 
 // Global Inequality - The Stalingrad test
 export * from './global-inequality';
 
 // Re-export the main runner
 export { runFullInequalityStressTest, CASE_SIGNIFICANCE } from './global-inequality';
 
 /**
  * FUTURE STRESS CASES
  * 
  * When inequality passes, add:
  * - Climate Change (similar definitional complexity)
  * - Migration (similar source conflicts)
  * - Healthcare Systems (similar temporal breaks)
  * - Economic Measurement (GDP vs wellbeing debates)
  */
 export const FUTURE_STRESS_CASES = [
   {
     name: 'Climate Change',
     analogy: 'Same definitional complexity (what counts as "warming")',
     readyWhen: 'Inequality stress test passes',
   },
   {
     name: 'Migration',
     analogy: 'Same source conflicts and political loading',
     readyWhen: 'Inequality stress test passes',
   },
   {
     name: 'Healthcare Systems',
     analogy: 'Same temporal breaks (definition of diseases change)',
     readyWhen: 'Inequality stress test passes',
   },
   {
     name: 'Economic Measurement',
     analogy: 'Same measurement debates (GDP vs wellbeing)',
     readyWhen: 'Inequality stress test passes',
   },
 ] as const;