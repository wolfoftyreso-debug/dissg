 /**
  * YOUTH DOMAIN MEASURES
  * 
  * Defines what can be measured about young people.
  */
 
 /**
  * ALLOWED MEASURES
  */
 export const YOUTH_ALLOWED_MEASURES = {
   PREVALENCE_ANXIETY: {
     code: 'prevalence_anxiety',
     name: 'Anxiety prevalence',
     unit: 'percent',
     population_level: true,
     source_tier_required: 1,
   },
   PREVALENCE_DEPRESSION: {
     code: 'prevalence_depression',
     name: 'Depression prevalence',
     unit: 'percent',
     population_level: true,
     source_tier_required: 1,
   },
   SCHOOL_STRESS: {
     code: 'school_stress',
     name: 'School-related stress',
     unit: 'percent',
     population_level: true,
     source_tier_required: 2,
   },
   SLEEP_PROBLEMS: {
     code: 'sleep_problems',
     name: 'Sleep problems prevalence',
     unit: 'percent',
     population_level: true,
     source_tier_required: 2,
   },
   CARE_CONTACT_RATE: {
     code: 'care_contact_rate',
     name: 'Care contact rate',
     unit: 'per_1000',
     population_level: true,
     source_tier_required: 1,
   },
   EDUCATION_COMPLETION: {
     code: 'education_completion',
     name: 'Education completion rate',
     unit: 'percent',
     population_level: true,
     source_tier_required: 1,
   },
 } as const;
 
 /**
  * FORBIDDEN MEASURES (NEVER SHOWN)
  */
 export const YOUTH_FORBIDDEN_MEASURES = [
   'individual_risk_score',
   'diagnostic_criteria_met',
   'treatment_recommendation',
   'medication_eligibility',
   'prognosis_individual',
 ] as const;
 
 /**
  * CHECK IF MEASURE IS ALLOWED
  */
 export function isMeasureAllowed(measureCode: string): boolean {
   return measureCode in YOUTH_ALLOWED_MEASURES;
 }
 
 /**
  * CHECK IF MEASURE IS FORBIDDEN
  */
 export function isMeasureForbidden(measureCode: string): boolean {
   return YOUTH_FORBIDDEN_MEASURES.includes(measureCode as any);
 }