 /**
  * YOUTH DOMAIN ONTOLOGY
  * 
  * Defines what concepts exist in the youth domain.
  */
 
 /**
  * YOUTH CONCEPTS
  */
 export const YOUTH_CONCEPTS = {
   // Age groups
   AGE_GROUPS: {
     EARLY_ADOLESCENT: { min: 10, max: 14, label: 'Early adolescent' },
     ADOLESCENT: { min: 15, max: 19, label: 'Adolescent' },
     YOUNG_ADULT: { min: 20, max: 24, label: 'Young adult' },
     YOUTH_BROAD: { min: 12, max: 25, label: 'Youth (broad)' },
   },
   
   // Topic areas
   TOPICS: {
     MENTAL_HEALTH: 'mental_health',
     PHYSICAL_HEALTH: 'physical_health',
     EDUCATION: 'education',
     SOCIAL: 'social',
     IDENTITY: 'identity',
     NORMALITY: 'normality',
   },
   
   // Risk levels
   RISK_LEVELS: {
     LOW: 'low',
     MEDIUM: 'medium',
     HIGH: 'high',
     CRISIS: 'crisis',
   },
 } as const;
 
 /**
  * YOUTH-SPECIFIC ANSWER TYPE RESTRICTIONS
  */
 export const YOUTH_ANSWER_TYPE_RULES = {
   ALLOWED: [
     'DESCRIPTIVE_STAT',
     'TREND_CHANGE',
     'COMPARISON_CONDITIONAL',
     'DISTRIBUTION_STRUCTURE',
     'RISK_PREVALENCE',
   ],
   
   FORBIDDEN: [
     'SCENARIO_MODEL', // No projections about youth outcomes
   ],
   
   CONDITIONAL: [
     {
       type: 'CORRELATION_OVERVIEW',
       conditions: ['requires_academic_source', 'no_lifestyle_causation'],
     },
   ],
 } as const;