 /**
  * DOMAIN SAFETY RULES
  * 
  * Universal safety enforcement across all domains.
  */
 
 import type { PlaybookSafetyRule } from '../playbooks/types';
 
 /**
  * UNIVERSAL SAFETY RULES (ALL DOMAINS)
  */
 export const UNIVERSAL_SAFETY_RULES: PlaybookSafetyRule[] = [
   {
     rule_id: 'universal_no_individual_advice',
     name: 'No Individual Advice',
     pattern: /you should|you must|you need to|i recommend you/i,
     action: 'block',
     message: 'Individual advice is not provided. This system provides population-level statistics only.',
   },
   {
     rule_id: 'universal_no_causation',
     name: 'No Causal Claims',
     pattern: /caused by|because of|leads to|results in|due to/i,
     action: 'warn',
     message: 'Causal claims require explicit qualification. Consider using "associated with" or "correlated with".',
   },
   {
     rule_id: 'universal_no_certainty',
     name: 'No Certainty Claims',
     pattern: /will definitely|guaranteed|always|never|certainly|undoubtedly/i,
     action: 'block',
     message: 'Certainty claims are not appropriate for statistical data.',
   },
 ];
 
 /**
  * VALIDATE INPUT AGAINST SAFETY RULES
  */
 export function validateAgainstSafetyRules(
   input: string,
   rules: PlaybookSafetyRule[]
 ): { 
   passed: boolean; 
   violations: Array<{ rule_id: string; message: string; action: 'block' | 'warn' | 'redirect' }>;
 } {
   const violations: Array<{ rule_id: string; message: string; action: 'block' | 'warn' | 'redirect' }> = [];
   
   for (const rule of rules) {
     if (rule.pattern.test(input)) {
       violations.push({
         rule_id: rule.rule_id,
         message: rule.message,
         action: rule.action,
       });
     }
   }
   
   const hasBlockingViolation = violations.some(v => v.action === 'block');
   
   return {
     passed: !hasBlockingViolation,
     violations,
   };
 }
 
 /**
  * GET ALL RULES FOR DOMAIN (Universal + Domain-specific)
  */
 export function getRulesForDomain(domainRules: PlaybookSafetyRule[]): PlaybookSafetyRule[] {
   return [...UNIVERSAL_SAFETY_RULES, ...domainRules];
 }