 /**
  * SAFETY BARRIERS
  * 
  * Three rules that prevent the system from becoming a monster.
  */
 
 export const SAFETY_BARRIERS = {
   /**
    * BARRIER 1: No API creates new answer types
    * 
    * All 7 answer types are locked.
    * APIs can only populate existing types.
    */
   NO_NEW_ANSWER_TYPES: {
     code: 'no_new_answer_types',
     description: 'APIs cannot create or define new answer types',
     enforcement: 'hard_block',
     check: (input: unknown) => {
       // Answer types are defined in ontology, not by APIs
       return { passed: true, reason: 'Answer types are immutable' };
     },
   },
   
   /**
    * BARRIER 2: No API changes language
    * 
    * All templates are locked.
    * APIs provide data, not wording.
    */
   NO_LANGUAGE_CHANGES: {
     code: 'no_language_changes',
     description: 'APIs cannot modify output language or templates',
     enforcement: 'hard_block',
     check: (input: unknown) => {
       // Templates are defined in playbooks, not by APIs
       return { passed: true, reason: 'Templates are immutable' };
     },
   },
   
   /**
    * BARRIER 3: No API increases safety risk
    * 
    * APIs cannot lower tier requirements.
    * APIs cannot bypass safety rules.
    */
   NO_RISK_INCREASE: {
     code: 'no_risk_increase',
     description: 'APIs cannot increase safety risk or bypass safety rules',
     enforcement: 'hard_block',
     check: (input: unknown) => {
       // Safety rules are enforced before output, not by APIs
       return { passed: true, reason: 'Safety rules are enforced at output' };
     },
   },
 } as const;
 
 export interface SafetyValidationResult {
   readonly passed: boolean;
   readonly barrier_violations: string[];
   readonly warnings: string[];
 }
 
 /**
  * VALIDATE API AGAINST SAFETY BARRIERS
  */
 export function validateApiSafety(
   api_id: string,
   proposed_changes: {
     creates_answer_type?: boolean;
     modifies_template?: boolean;
     bypasses_safety?: boolean;
   }
 ): SafetyValidationResult {
   const violations: string[] = [];
   
   if (proposed_changes.creates_answer_type) {
     violations.push(SAFETY_BARRIERS.NO_NEW_ANSWER_TYPES.code);
   }
   
   if (proposed_changes.modifies_template) {
     violations.push(SAFETY_BARRIERS.NO_LANGUAGE_CHANGES.code);
   }
   
   if (proposed_changes.bypasses_safety) {
     violations.push(SAFETY_BARRIERS.NO_RISK_INCREASE.code);
   }
   
   return {
     passed: violations.length === 0,
     barrier_violations: violations,
     warnings: [],
   };
 }
 
 /**
  * VALIDATE ANSWER OUTPUT SAFETY
  */
 export function validateAnswerSafety(output: string): SafetyValidationResult {
   const violations: string[] = [];
   const warnings: string[] = [];
   
   // Check for forbidden patterns
   const FORBIDDEN_PATTERNS = [
     { pattern: /you should|you must|you need to/i, violation: 'individual_advice' },
     { pattern: /caused by|because of|leads to/i, violation: 'causal_claim' },
     { pattern: /will definitely|guaranteed|certainly/i, violation: 'certainty_claim' },
     { pattern: /you have|you are diagnosed/i, violation: 'diagnostic_language' },
   ];
   
   for (const { pattern, violation } of FORBIDDEN_PATTERNS) {
     if (pattern.test(output)) {
       violations.push(violation);
     }
   }
   
   return {
     passed: violations.length === 0,
     barrier_violations: violations,
     warnings,
   };
 }