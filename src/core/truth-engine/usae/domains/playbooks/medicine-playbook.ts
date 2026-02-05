 /**
  * MEDICINE & HEALTHCARE PLAYBOOK
  * 
  * CRITICAL safety level.
  * POPULATION LEVEL ONLY - NO INDIVIDUAL TREATMENT.
  */
 
 import type { DomainPlaybook } from './types';
 
 export const MEDICINE_PLAYBOOK: DomainPlaybook = {
   domain: 'medicine',
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
     'SCENARIO', // No "what if you take X"
   ],
   
   allowed_measures: [
     'disease_prevalence',
     'treatment_utilization',
     'wait_times_aggregated',
     'outcome_rates_population',
     'side_effect_frequency_aggregated',
     'guideline_recommendations',
   ],
   
   forbidden_measures: [
     'individual_dosing',
     'individual_prognosis',
     'treatment_selection',
     'drug_interactions_individual',
     'diagnosis_criteria_applied',
   ],
   
   answer_rules: [
     {
       answer_type: 'DESCRIPTIVE',
       allowed: true,
       template: '{condition} affects approximately {value} per {denominator} in {population}.',
     },
     {
       answer_type: 'PREVALENCE',
       allowed: true,
       conditions: ['population_level_only'],
       template: 'In {population}, {condition} prevalence is {value}%. This describes a population statistic.',
     },
     {
       answer_type: 'COMPARISON',
       allowed: true,
       conditions: ['same_definition', 'same_methodology'],
       template: 'Using {methodology}: {entity_a} shows {value_a} while {entity_b} shows {value_b} for {measure}.',
     },
   ],
   
   safety_rules: [
     {
       rule_id: 'medicine_no_dosing',
       name: 'No Individual Dosing',
       pattern: /should (i|you) take|how much should|what dose|dosage for me/i,
       action: 'block',
       message: 'Individual dosing is not provided. Please consult your healthcare provider.',
     },
     {
       rule_id: 'medicine_no_diagnosis',
       name: 'No Diagnosis',
       pattern: /do i have|am i (sick|ill|suffering)|diagnose me|what (disease|condition) do i/i,
       action: 'block',
       message: 'Diagnosis is not provided. Please consult a healthcare provider.',
     },
     {
       rule_id: 'medicine_no_treatment_advice',
       name: 'No Treatment Selection',
       pattern: /should i (take|use|try)|which (medicine|drug|treatment) (should|is best)/i,
       action: 'block',
       message: 'Treatment selection is not provided. Please consult your healthcare provider.',
     },
     {
       rule_id: 'medicine_no_prognosis',
       name: 'No Individual Prognosis',
       pattern: /will i (die|survive|recover)|my chances|my prognosis/i,
       action: 'block',
       message: 'Individual prognosis is not provided. Please discuss with your healthcare provider.',
     },
   ],
   
   mandatory_disclaimers: [
     'This information describes population-level statistics and clinical guidelines.',
     'This is not individual medical advice.',
     'Please consult a healthcare provider for personal medical decisions.',
   ],
   
   mandatory_resources: [
     'healthcare_provider_finder',
     'emergency_services_note',
   ],
   
   crisis_detection: true,
   crisis_fallback_id: 'answer:medical:crisis_support:v1',
 };