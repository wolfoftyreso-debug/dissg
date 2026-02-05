 /**
  * MASTER ANSWER ONTOLOGY
  * 
  * 7 ANSWER TYPES - NO EXCEPTIONS
  * Every question in every domain resolves to exactly one of these.
  */
 
 /**
  * THE 7 UNIVERSAL ANSWER TYPES (LOCKED)
  */
 export const ANSWER_TYPES = {
   DESCRIPTIVE: {
     code: 'descriptive',
     name: 'Descriptive Statistics',
     questions: ['How common?', 'How much?', 'How many?'],
     template: '{measure} in {entity} is {value} {unit} as of {time}.',
     allows_causation: false,
     allows_prediction: false,
   },
   TREND: {
     code: 'trend',
     name: 'Trend / Change',
     questions: ['Is it increasing?', 'When did it change?', 'How fast?'],
     template: '{measure} in {entity} has {direction} by {magnitude} from {time_start} to {time_end}.',
     allows_causation: false,
     allows_prediction: false,
   },
   COMPARISON: {
     code: 'comparison',
     name: 'Conditional Comparison',
     questions: ['A vs B?', 'Higher or lower?', 'Which is more?'],
     template: 'Using definition {definition}: {entity_a} shows {value_a} while {entity_b} shows {value_b}.',
     requires_definition_alignment: true,
     allows_causation: false,
     allows_prediction: false,
   },
   DISTRIBUTION: {
     code: 'distribution',
     name: 'Distribution / Structure',
     questions: ['Which groups?', 'What is the breakdown?', 'How is it spread?'],
     template: 'The distribution of {measure} across {dimension}: {breakdown}.',
     allows_causation: false,
     allows_prediction: false,
   },
   PREVALENCE: {
     code: 'prevalence',
     name: 'Risk / Prevalence',
     questions: ['How often does X occur?', 'What is the rate?'],
     template: '{measure} occurs at a rate of {value} per {denominator} in {population}.',
     restriction: 'population_level_only',
     allows_individual_interpretation: false,
     allows_causation: false,
     allows_prediction: false,
   },
   CORRELATION: {
     code: 'correlation',
     name: 'Correlation Overview',
     questions: ['What co-varies?', 'Are they related?'],
     template: '{measure_a} and {measure_b} show {correlation_type} correlation (r={coefficient}) in {entity}.',
     mandatory_disclaimer: 'Correlation does not imply causation.',
     allows_causation: false,
     allows_prediction: false,
   },
   SCENARIO: {
     code: 'scenario',
     name: 'Scenario / Projection',
     questions: ['What if?', 'What happens if?', 'Future projection?'],
     template: 'Under scenario {scenario_name}: if {assumptions}, model projects {projection}.',
     mandatory_marker: 'MODEL_OUTPUT_NOT_PREDICTION',
     allows_causation: false,
     allows_prediction: false, // It's explicitly marked as model, not prediction
   },
 } as const;
 
 export type AnswerTypeCode = keyof typeof ANSWER_TYPES;
 export type AnswerType = typeof ANSWER_TYPES[AnswerTypeCode];
 
 /**
  * VALIDATE ANSWER TYPE
  */
 export function validateAnswerType(typeCode: string): typeCode is AnswerTypeCode {
   return typeCode.toUpperCase() in ANSWER_TYPES;
 }
 
 /**
  * GET ANSWER TYPE
  */
 export function getAnswerType(typeCode: AnswerTypeCode): AnswerType {
   return ANSWER_TYPES[typeCode];
 }
 
 /**
  * MAP QUESTION TO ANSWER TYPE
  * Returns the most likely answer type for a given question pattern.
  */
 export function inferAnswerType(question: string): AnswerTypeCode | null {
   const q = question.toLowerCase();
   
   // Descriptive patterns
   if (/how (many|much|common|prevalent|frequent)/i.test(q)) return 'DESCRIPTIVE';
   if (/what is the (number|amount|rate|level)/i.test(q)) return 'DESCRIPTIVE';
   
   // Trend patterns
   if (/is it (increasing|decreasing|rising|falling|changing)/i.test(q)) return 'TREND';
   if (/has it (increased|decreased|changed|grown)/i.test(q)) return 'TREND';
   if (/trend|over time|historically/i.test(q)) return 'TREND';
   
   // Comparison patterns
   if (/compared to|versus|vs\.?|higher than|lower than/i.test(q)) return 'COMPARISON';
   if (/which (country|region|entity) has (more|less|higher|lower)/i.test(q)) return 'COMPARISON';
   
   // Distribution patterns
   if (/breakdown|distribution|spread|by (age|gender|region|sector)/i.test(q)) return 'DISTRIBUTION';
   if (/what (groups|categories|segments)/i.test(q)) return 'DISTRIBUTION';
   
   // Prevalence patterns
   if (/risk of|rate of|prevalence|how often does/i.test(q)) return 'PREVALENCE';
   if (/per (capita|100k|million|1000)/i.test(q)) return 'PREVALENCE';
   
   // Correlation patterns
   if (/correlat|related to|associated with|co-var/i.test(q)) return 'CORRELATION';
   if (/does .* affect|relationship between/i.test(q)) return 'CORRELATION';
   
   // Scenario patterns
   if (/what if|if .* then|project|forecast|scenario/i.test(q)) return 'SCENARIO';
   if (/future|predict|expect/i.test(q)) return 'SCENARIO';
   
   return null;
 }
 
 /**
  * FORBIDDEN ANSWER TYPES BY CONTEXT
  */
 export const FORBIDDEN_ANSWER_PATTERNS = {
   // Never allow these patterns regardless of domain
   INDIVIDUAL_ADVICE: /you should|you must|you need to|i recommend/i,
   CAUSAL_CLAIMS: /caused by|because of|leads to|results in/i,
   CERTAINTY_CLAIMS: /will definitely|guaranteed to|always|never/i,
   DIAGNOSTIC_LANGUAGE: /you have|you are suffering|you are diagnosed/i,
 } as const;
 
 /**
  * VALIDATE OUTPUT AGAINST FORBIDDEN PATTERNS
  */
 export function validateOutputSafety(output: string): { 
   safe: boolean; 
   violations: string[];
 } {
   const violations: string[] = [];
   
   for (const [name, pattern] of Object.entries(FORBIDDEN_ANSWER_PATTERNS)) {
     if (pattern.test(output)) {
       violations.push(name);
     }
   }
   
   return {
     safe: violations.length === 0,
     violations,
   };
 }