 /**
  * THE 7 CANONICAL ANSWER TYPES (FORMALIZED)
  * 
  * ABSOLUTE RULE: If an answer doesn't fit one of these → it cannot exist.
  */
 
 /**
  * CANONICAL ANSWER TYPE ENUM
  */
 export const CANONICAL_ANSWER_TYPES = {
   DESCRIPTIVE_STAT: {
     code: 'DESCRIPTIVE_STAT',
     name: 'Descriptive Statistics',
     description: 'How common? How much? How many?',
     examples: [
       'The population of Sweden is 10.5 million.',
       'Unemployment rate in Germany is 3.2%.',
     ],
     template: '{measure} in {entity} is {value} {unit} as of {time}.',
     constraints: {
       allows_causation: false,
       allows_prediction: false,
       allows_advice: false,
       requires_time: true,
       requires_source: true,
     },
   },
   
   TREND_CHANGE: {
     code: 'TREND_CHANGE',
     name: 'Trend / Change Over Time',
     description: 'Is it increasing? When did it change? How fast?',
     examples: [
       'GDP growth has increased from 2.1% to 3.4% since 2020.',
       'Crime rates have decreased by 15% over the past decade.',
     ],
     template: '{measure} in {entity} has {direction} by {magnitude} from {time_start} to {time_end}.',
     constraints: {
       allows_causation: false,
       allows_prediction: false,
       allows_advice: false,
       requires_time_range: true,
       minimum_data_points: 2,
     },
   },
   
   DISTRIBUTION_STRUCTURE: {
     code: 'DISTRIBUTION_STRUCTURE',
     name: 'Distribution / Structure',
     description: 'Which groups? What is the breakdown? How is it spread?',
     examples: [
       'Age distribution: 0-14 (17%), 15-64 (62%), 65+ (21%).',
       'Income quintiles show 40% of wealth in top 10%.',
     ],
     template: 'The distribution of {measure} across {dimension}: {breakdown}.',
     constraints: {
       allows_causation: false,
       allows_prediction: false,
       allows_advice: false,
       must_sum_to_total: true,
     },
   },
   
   COMPARISON_CONDITIONAL: {
     code: 'COMPARISON_CONDITIONAL',
     name: 'Conditional Comparison',
     description: 'A vs B – given explicit definition X',
     examples: [
       'Using OECD definition: Sweden (7.2) vs. US (6.1) on healthcare access.',
       'Under EU methodology: Germany exports more than France in manufacturing.',
     ],
     template: 'Using {definition}: {entity_a} shows {value_a} while {entity_b} shows {value_b}.',
     constraints: {
       allows_causation: false,
       allows_prediction: false,
       allows_advice: false,
       requires_definition_alignment: true,
       requires_methodology_disclosure: true,
     },
   },
   
   RISK_PREVALENCE: {
     code: 'RISK_PREVALENCE',
     name: 'Risk / Prevalence (Population Level)',
     description: 'How often does X occur in population Y?',
     examples: [
       'Diabetes prevalence is 8.5% among adults in the EU.',
       'Workplace injuries occur at 2.3 per 1,000 workers annually.',
     ],
     template: '{condition} occurs at a rate of {value} per {denominator} in {population}.',
     constraints: {
       allows_causation: false,
       allows_prediction: false,
       allows_advice: false,
       allows_individual_interpretation: false,
       population_level_only: true,
     },
   },
   
   CORRELATION_OVERVIEW: {
     code: 'CORRELATION_OVERVIEW',
     name: 'Correlation Overview (No Causation)',
     description: 'What co-varies? Statistical association only.',
     examples: [
       'Education level and income show positive correlation (r=0.65).',
       'Smoking rates and lung cancer incidence move together historically.',
     ],
     template: '{measure_a} and {measure_b} show {correlation_type} correlation (r={coefficient}).',
     constraints: {
       allows_causation: false, // ABSOLUTE
       allows_prediction: false,
       allows_advice: false,
       mandatory_disclaimer: 'Correlation does not imply causation.',
     },
   },
   
   SCENARIO_MODEL: {
     code: 'SCENARIO_MODEL',
     name: 'Scenario / Model Projection',
     description: 'What if X? Model output, explicitly not prediction.',
     examples: [
       'SCENARIO: If interest rates rise 1%, model projects GDP -0.3%.',
       'Under high-migration scenario, population reaches 12M by 2040.',
     ],
     template: 'SCENARIO ({scenario_name}): Under assumption {assumptions}, model projects {projection}.',
     constraints: {
       allows_causation: false,
       allows_prediction: false, // It's scenario, not prediction
       allows_advice: false,
       mandatory_marker: 'MODEL_OUTPUT_NOT_PREDICTION',
       requires_assumptions_explicit: true,
     },
   },
 } as const;
 
 export type CanonicalAnswerTypeCode = keyof typeof CANONICAL_ANSWER_TYPES;
 export type CanonicalAnswerType = typeof CANONICAL_ANSWER_TYPES[CanonicalAnswerTypeCode];
 
 /**
  * GET ALL ANSWER TYPE CODES
  */
 export function getAllAnswerTypeCodes(): CanonicalAnswerTypeCode[] {
   return Object.keys(CANONICAL_ANSWER_TYPES) as CanonicalAnswerTypeCode[];
 }
 
 /**
  * VALIDATE ANSWER TYPE CODE
  */
 export function isValidAnswerType(code: string): code is CanonicalAnswerTypeCode {
   return code in CANONICAL_ANSWER_TYPES;
 }
 
 /**
  * GET ANSWER TYPE CONFIG
  */
 export function getAnswerTypeConfig(code: CanonicalAnswerTypeCode): CanonicalAnswerType {
   return CANONICAL_ANSWER_TYPES[code];
 }