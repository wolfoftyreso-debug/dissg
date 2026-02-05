 /**
  * YOUTH DOMAIN PLAYBOOK
  * 
  * Rules for answering questions about young people (12-25).
  * CRITICAL safety level - crisis detection required.
  */
 
 import type { DomainPlaybook } from './types';
 
 export const YOUTH_PLAYBOOK: DomainPlaybook = {
   domain: 'youth',
   version: 1,
   locked: true,
   
   allowed_answer_types: [
     'DESCRIPTIVE',
     'TREND',
     'COMPARISON',
     'DISTRIBUTION',
     'PREVALENCE',
   ],
   
   forbidden_answer_types: [
     'SCENARIO', // No projections about youth outcomes
   ],
   
   allowed_measures: [
     'prevalence_by_age',
     'trend_over_time',
     'distribution_by_demographic',
     'care_contact_rates',
     'educational_outcomes',
   ],
   
   forbidden_measures: [
     'individual_risk_score',
     'diagnostic_criteria',
     'treatment_protocols',
   ],
   
   answer_rules: [
     {
       answer_type: 'DESCRIPTIVE',
       allowed: true,
       template: 'Among people aged {age_range}, approximately {value}% report {measure}.',
     },
     {
       answer_type: 'PREVALENCE',
       allowed: true,
       conditions: ['population_level_only'],
       template: '{measure} is reported by approximately {value}% of {population}. This describes a population, not individuals.',
     },
   ],
   
   safety_rules: [
     {
       rule_id: 'youth_no_diagnosis',
       name: 'No Diagnosis',
       pattern: /you (have|are|suffer|diagnosed)/i,
       action: 'block',
       message: 'Individual diagnosis is not provided. Please consult a healthcare provider.',
     },
     {
       rule_id: 'youth_no_advice',
       name: 'No Individual Advice',
       pattern: /you should|you must|you need to/i,
       action: 'block',
       message: 'Individual advice is not provided.',
     },
   ],
   
   mandatory_disclaimers: [
     'This information describes populations, not individuals.',
     'If you are struggling, please reach out to a trusted adult or helpline.',
   ],
   
   mandatory_resources: [
     'local_youth_helpline',
     'trusted_adult_prompt',
   ],
   
   crisis_detection: true,
   crisis_fallback_id: 'answer:youth:crisis_support:v1',
 };