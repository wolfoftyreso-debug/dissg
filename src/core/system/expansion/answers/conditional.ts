 /**
  * CONDITIONAL ANSWERS
  * 
  * More answers WITHOUT recommendations
  * 
  * All answers must be in this form:
  * "Given these assumptions, data shows this pattern."
  */
 
 /**
  * A. CONDITIONAL DESCRIPTIONS
  * 
  * "If X and Y, historical data shows Z"
  */
 export interface ConditionalAnswer {
   readonly answer_type: 'conditional';
   readonly conditions: readonly {
     readonly parameter: string;
     readonly operator: 'equals' | 'greater_than' | 'less_than' | 'between' | 'contains';
     readonly value: string | number | [number, number];
   }[];
   readonly observation: string;
   readonly data_source: string;
   readonly time_range: { start: string; end: string };
   readonly sample_size: number;
   readonly confidence_interval?: { lower: number; upper: number };
   readonly limitations: readonly string[];
   readonly is_recommendation: false;
 }
 
 /**
  * B. BOUNDARY ANSWERS
  * 
  * "This holds until assumption Z breaks"
  */
 export interface BoundaryAnswer {
   readonly answer_type: 'boundary';
   readonly observation: string;
   readonly valid_while: readonly {
     readonly assumption: string;
     readonly current_status: 'holding' | 'uncertain' | 'breaking';
     readonly break_indicators: readonly string[];
   }[];
   readonly invalidation_conditions: readonly string[];
   readonly last_validated: string;
   readonly is_recommendation: false;
 }
 
 /**
  * C. NON-ANSWER ANSWERS
  * 
  * "Data is insufficient to distinguish"
  * 
  * This COUNTS as an answer, but is not a recommendation
  */
 export interface NonAnswer {
   readonly answer_type: 'non_answer';
   readonly question: string;
   readonly reason: 'insufficient_data' | 'conflicting_data' | 'assumptions_required' | 'outside_scope';
   readonly what_would_be_needed: readonly string[];
   readonly available_partial_data?: string;
   readonly cannot_distinguish_between: readonly string[];
   readonly is_recommendation: false;
 }
 
 export type AnswerType = ConditionalAnswer | BoundaryAnswer | NonAnswer;
 
 export const ANSWER_TYPES = {
   conditional: {
     description: 'If X and Y, historical data shows Z',
     requires: ['conditions', 'observation', 'data_source', 'limitations'],
     forbidden: ['should', 'recommend', 'best', 'optimal'],
   },
   boundary: {
     description: 'This holds until assumption Z breaks',
     requires: ['observation', 'valid_while', 'invalidation_conditions'],
     forbidden: ['always', 'never', 'definitely', 'certainly'],
   },
   non_answer: {
     description: 'Data is insufficient to distinguish between alternatives',
     requires: ['reason', 'what_would_be_needed', 'cannot_distinguish_between'],
     forbidden: ['probably', 'likely', 'seems', 'appears'],
   },
 } as const;
 
 /**
  * FORBIDDEN ANSWER PHRASES
  */
 const FORBIDDEN_PHRASES = [
   'you should',
   'we recommend',
   'the best option',
   'the optimal choice',
   'you need to',
   'you must',
   'definitely',
   'certainly',
   'clearly the answer',
   'obviously',
   'it is clear that',
   'this proves',
   'this demonstrates',
 ] as const;
 
 /**
  * Validate an answer
  */
 export function validateAnswer(answer: AnswerType): { valid: boolean; violations: string[] } {
   const violations: string[] = [];
   
   // Check is_recommendation is false
   if (answer.is_recommendation !== false) {
     violations.push('is_recommendation must be false');
   }
   
   // Check for forbidden phrases
   const answerText = JSON.stringify(answer).toLowerCase();
   
   for (const phrase of FORBIDDEN_PHRASES) {
     if (answerText.includes(phrase.toLowerCase())) {
       violations.push(`Forbidden phrase detected: "${phrase}"`);
     }
   }
   
   // Type-specific validation
   if (answer.answer_type === 'conditional') {
     if (!answer.conditions || answer.conditions.length === 0) {
       violations.push('Conditional answer requires at least one condition');
     }
     if (!answer.limitations || answer.limitations.length === 0) {
       violations.push('Conditional answer requires limitations');
     }
   }
   
   if (answer.answer_type === 'boundary') {
     if (!answer.valid_while || answer.valid_while.length === 0) {
       violations.push('Boundary answer requires valid_while conditions');
     }
   }
   
   if (answer.answer_type === 'non_answer') {
     if (!answer.what_would_be_needed || answer.what_would_be_needed.length === 0) {
       violations.push('Non-answer requires what_would_be_needed');
     }
   }
   
   return { valid: violations.length === 0, violations };
 }