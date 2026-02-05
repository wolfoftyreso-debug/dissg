 /**
  * TRUTH ENGINE SPEC - SECTION 0
  * 
  * PURPOSE (LOCKED)
  * 
  * Truth Engine is a machine-readable reference system whose SOLE purpose
  * is to preserve, structure, and expose verifiable reality over time
  * – WITHOUT ASSUMPTIONS.
  * 
  * Everything that does not serve this purpose is FORBIDDEN.
  */
 
 /**
  * THE LOCKED PURPOSE
  */
 export const TRUTH_ENGINE_PURPOSE = {
   version: '1.0',
   immutable: true,
   locked: true,
   
   statement: `Truth Engine is a machine-readable reference system whose sole purpose 
 is to preserve, structure, and expose verifiable reality over time – without assumptions.`,
   
   corollary: 'Everything that does not serve this purpose is FORBIDDEN.',
   
   serves: [
     'Preserve verifiable reality',
     'Structure observations formally',
     'Expose uncertainty explicitly',
     'Enable machine-to-machine truth verification',
   ],
   
   forbidden: [
     'Assumptions',
     'Implicit knowledge',
     'Normative statements',
     'Recommendations',
     'Predictions without explicit uncertainty',
   ],
 } as const;
 
 /**
  * Purpose validator
  */
 export function validatePurposeAlignment(action: string): {
   aligned: boolean;
   reason: string;
 } {
   const forbiddenPatterns = [
     /recommend/i,
     /should/i,
     /must do/i,
     /best practice/i,
     /optimal/i,
     /assume/i,
   ];
   
   for (const pattern of forbiddenPatterns) {
     if (pattern.test(action)) {
       return {
         aligned: false,
         reason: `Action contains forbidden pattern: ${pattern}`,
       };
     }
   }
   
   return {
     aligned: true,
     reason: 'Action aligns with Truth Engine purpose',
   };
 }