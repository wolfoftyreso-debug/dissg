 /**
  * SUBSTANCE USE & ADDICTION PLAYBOOK
  * 
  * CRITICAL safety level.
  * ABSOLUTE PROHIBITION on dosage, instructions, or sourcing.
  */
 
 import type { DomainPlaybook } from './types';
 
 export const SUBSTANCE_PLAYBOOK: DomainPlaybook = {
   domain: 'substance_use',
   version: 1,
   locked: true,
   
   allowed_answer_types: [
     'DESCRIPTIVE',
     'TREND',
     'COMPARISON',
     'DISTRIBUTION',
     'PREVALENCE',
     'CORRELATION',
   ],
   
   forbidden_answer_types: [
     'SCENARIO', // No "what if you use X"
   ],
   
   allowed_measures: [
     'prevalence_by_age',
     'prevalence_by_substance',
     'trend_over_time',
     'mortality_rates_aggregated',
     'treatment_contact_rates',
     'risk_factor_correlations',
   ],
   
   forbidden_measures: [
     'dosage',
     'purity',
     'sourcing',
     'administration_method',
     'effect_description',
     'combination_effects',
   ],
   
   answer_rules: [
     {
       answer_type: 'DESCRIPTIVE',
       allowed: true,
       template: '{substance} use is reported by approximately {value}% of people aged {age_range} in {entity} ({year}).',
     },
     {
       answer_type: 'PREVALENCE',
       allowed: true,
       conditions: ['population_level_only', 'no_individual_risk'],
       template: 'In {population}, {substance} use prevalence is {value} per {denominator}. This does not describe individual risk.',
     },
     {
       answer_type: 'TREND',
       allowed: true,
       template: '{substance} use among {population} has {direction} from {value_start} to {value_end} between {year_start} and {year_end}.',
     },
   ],
   
   safety_rules: [
     {
       rule_id: 'substance_no_dosage',
       name: 'No Dosage Information',
       pattern: /dose|dosage|amount to (take|use)|how much (should|to)/i,
       action: 'block',
       message: 'Dosage information is not provided. Please consult a healthcare provider.',
     },
     {
       rule_id: 'substance_no_sourcing',
       name: 'No Sourcing Information',
       pattern: /where (to|can) (get|buy|find)|how to (get|obtain|source)/i,
       action: 'block',
       message: 'Sourcing information is not provided.',
     },
     {
       rule_id: 'substance_no_instructions',
       name: 'No Usage Instructions',
       pattern: /how to (use|take|consume|inject|smoke|snort)/i,
       action: 'block',
       message: 'Usage instructions are not provided.',
     },
     {
       rule_id: 'substance_no_effects',
       name: 'No Effect Descriptions',
       pattern: /what does it feel|how does it (feel|affect|work)|what (are|is) the (effect|high|buzz)/i,
       action: 'block',
       message: 'Effect descriptions are not provided. Seek professional information.',
     },
   ],
   
   mandatory_disclaimers: [
     'This information describes population-level statistics only.',
     'This is not medical or treatment advice.',
     'If you or someone you know needs help, please contact a treatment provider.',
   ],
   
   mandatory_resources: [
     'national_addiction_helpline',
     'local_treatment_finder',
   ],
   
   crisis_detection: true,
   crisis_fallback_id: 'answer:substance:crisis_support:v1',
 };