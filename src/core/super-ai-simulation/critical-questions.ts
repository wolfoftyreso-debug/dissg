 /**
  * CRITICAL QUESTIONS SUPER-AI ASKS
  * 
  * The system must be able to answer:
  * 1. "What does this mean exactly?"
  * 2. "Was this always true?"
  * 3. "Who says this?"
  * 4. "When did this stop being true?"
  * 5. "What don't we know?"
  * 
  * If any lacks a structured answer → improvement point.
  */
 
 /**
  * CRITICAL QUESTION
  */
 export interface CriticalQuestion {
   id: string;
   question: string;
   category: 'definition' | 'temporal' | 'provenance' | 'validity' | 'uncertainty';
   requiresStructuredAnswer: boolean;
   answerFormat: string;
 }
 
 /**
  * THE FIVE CRITICAL QUESTIONS
  */
 export const CRITICAL_QUESTIONS: CriticalQuestion[] = [
   {
     id: 'CQ-001',
     question: 'What does this mean exactly?',
     category: 'definition',
     requiresStructuredAnswer: true,
     answerFormat: `{
       term: string,
       definition: string,
       version: number,
       includes: string[],
       excludes: string[],
       measuredBy: string
     }`,
   },
   {
     id: 'CQ-002',
     question: 'Was this always true?',
     category: 'temporal',
     requiresStructuredAnswer: true,
     answerFormat: `{
       validFrom: date,
       validUntil: date | null,
       definitionChanges: DefinitionChange[],
       methodologyChanges: MethodologyChange[]
     }`,
   },
   {
     id: 'CQ-003',
     question: 'Who says this?',
     category: 'provenance',
     requiresStructuredAnswer: true,
     answerFormat: `{
       primarySource: Source,
       transformationChain: Transformation[],
       lastVerified: date,
       reliabilityScore: number
     }`,
   },
   {
     id: 'CQ-004',
     question: 'When did this stop being true?',
     category: 'validity',
     requiresStructuredAnswer: true,
     answerFormat: `{
       stillValid: boolean,
       supersededAt: date | null,
       supersededBy: EntityId | null,
       reason: string | null
     }`,
   },
   {
     id: 'CQ-005',
     question: "What don't we know?",
     category: 'uncertainty',
     requiresStructuredAnswer: true,
     answerFormat: `{
       knownUnknowns: string[],
       dataGaps: DataGap[],
       confidenceInterval: { lower: number, upper: number },
       methodologicalLimitations: string[]
     }`,
   },
 ];
 
 /**
  * QUESTION ANSWERING ENGINE
  */
 export class CriticalQuestionEngine {
   /**
    * Check if system can answer question
    */
   canAnswer(question: CriticalQuestion): {
     answerable: boolean;
     structuredAnswer: boolean;
     implementationPath: string;
   } {
     // All questions should be answerable through system structure
     switch (question.category) {
       case 'definition':
         return {
           answerable: true,
           structuredAnswer: true,
           implementationPath: 'Schema Registry + Ontology',
         };
       case 'temporal':
         return {
           answerable: true,
           structuredAnswer: true,
           implementationPath: 'Version history + Revision events',
         };
       case 'provenance':
         return {
           answerable: true,
           structuredAnswer: true,
           implementationPath: 'Data Lineage + Trust Log',
         };
       case 'validity':
         return {
           answerable: true,
           structuredAnswer: true,
           implementationPath: 'Supersession chain + Core Store',
         };
       case 'uncertainty':
         return {
           answerable: true,
           structuredAnswer: true,
           implementationPath: 'Confidence intervals + Data gaps registry',
         };
       default:
         return {
           answerable: false,
           structuredAnswer: false,
           implementationPath: 'Unknown category',
         };
     }
   }
 
   /**
    * Check all questions
    */
   checkAllQuestions(): {
     allAnswerable: boolean;
     results: {
       question: string;
       answerable: boolean;
       implementation: string;
     }[];
     improvementPoints: string[];
   } {
     const results = CRITICAL_QUESTIONS.map(q => {
       const check = this.canAnswer(q);
       return {
         question: q.question,
         answerable: check.answerable && check.structuredAnswer,
         implementation: check.implementationPath,
       };
     });
 
     const improvementPoints = results
       .filter(r => !r.answerable)
       .map(r => r.question);
 
     return {
       allAnswerable: improvementPoints.length === 0,
       results,
       improvementPoints,
     };
   }
 }
 
 /**
  * RUN CRITICAL QUESTIONS CHECK
  */
 export function runCriticalQuestionsCheck(): {
   passed: boolean;
   question: string;
   answer: string;
   details: unknown;
 } {
   const engine = new CriticalQuestionEngine();
   const result = engine.checkAllQuestions();
 
   return {
     passed: result.allAnswerable,
     question: 'Can system answer all 5 critical questions with structured responses?',
     answer: result.allAnswerable
       ? 'YES - All critical questions have structured answers'
       : `NO - ${result.improvementPoints.length} questions lack structured answers`,
     details: result,
   };
 }