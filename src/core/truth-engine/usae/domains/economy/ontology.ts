 /**
  * ECONOMY DOMAIN ONTOLOGY
  * 
  * Defines economic concepts and answer type restrictions.
  */
 
 /**
  * ECONOMY CONCEPTS
  */
 export const ECONOMY_CONCEPTS = {
   // Indicator categories
   CATEGORIES: {
     GROWTH: 'economic_growth',
     EMPLOYMENT: 'employment',
     INFLATION: 'inflation',
     TRADE: 'trade',
     PUBLIC_FINANCE: 'public_finance',
     HOUSEHOLD: 'household_economics',
   },
   
   // Time horizons
   TIME_HORIZONS: {
     CURRENT: 'latest_period',
     SHORT_TERM: 'trailing_12m',
     MEDIUM_TERM: 'trailing_5y',
     LONG_TERM: 'trailing_10y_plus',
   },
   
   // Geographic levels
   GEO_LEVELS: {
     GLOBAL: 'global',
     REGIONAL: 'regional_bloc',
     NATIONAL: 'country',
     SUBNATIONAL: 'region',
   },
 } as const;
 
 /**
  * ECONOMY-SPECIFIC ANSWER TYPE RESTRICTIONS
  */
 export const ECONOMY_ANSWER_TYPE_RULES = {
   ALLOWED: [
     'DESCRIPTIVE_STAT',
     'TREND_CHANGE',
     'COMPARISON_CONDITIONAL',
     'DISTRIBUTION_STRUCTURE',
     'CORRELATION_OVERVIEW',
   ],
   
   CONDITIONAL: [
     {
       type: 'SCENARIO_MODEL',
       conditions: ['explicit_scenario_flag', 'model_disclosed', 'uncertainty_range'],
     },
   ],
   
   FORBIDDEN_PATTERNS: [
     'investment_advice',
     'prediction_without_scenario',
     'individual_financial_recommendation',
   ],
 } as const;