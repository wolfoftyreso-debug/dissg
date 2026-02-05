 /**
  * ANSWER PACKET: age_structure
  * 
  * Covers search intents #11-15
  * "What is the age distribution?"
  */
 
 import type { AnswerPacketV2 } from '../types';
 
 export const AGE_STRUCTURE: AnswerPacketV2 = {
   id: 'answer:age_structure:v1',
   status: 'stable',
   version: 1,
   created_at: '2025-02-05T00:00:00Z',
   supersedes: null,
   
   intent: {
     domain: 'population',
     category: 'structural',
     question_patterns: [
       'What is the average age in {country}?',
       'How old is the population of {country}?',
       'Age structure of {country}',
       'What percentage is over 65 in {country}?',
       'What percentage is under 18 in {country}?',
       'Which country has the oldest population?',
       'Which country has the youngest population?',
     ],
     blocked_patterns: [],
   },
   
   inputs: {
     required: ['entity.country'],
     optional: ['time.point', 'breakdown.age_group'],
   },
   
   definition_requirements: [
     { measure: 'core:measure:median_age:v1', required: true },
     { measure: 'core:measure:dependency_ratio:v1', required: false },
   ],
   
   query: {
     dsl_ref: 'query.age_structure:v1',
     constraints: {
       aggregation: 'none',
       alignment: 'exact_definition',
       source_policy: 'allow_multiple',
     },
   },
   
   defaults: {
     time: { strategy: 'latest_available' },
     sources: { prefer: ['core:source:un_desa:v1'] },
   },
   
   output: {
     formats: {
       text: {
         template: 'The median age in {country} is {median_age} years. {pct_under_18}% are under 18, and {pct_over_65}% are 65 or older.',
         footnotes: [
           'Median age: half the population is younger, half is older.',
           'Data as of {observed_at}.',
           'Source: {sources}',
         ],
       },
       json: {
         include: ['median_age', 'pct_under_18', 'pct_over_65', 'dependency_ratio', 'observed_at', 'sources'],
       },
     },
   },
   
   confidence: {
     required: true,
     fields: ['coverage', 'source_agreement'],
     minimum_coverage: 0.9,
   },
   
   limits: {
     causal_claims: 'forbidden',
     ranking: 'with_disclaimer',
     aggregation: 'forbidden',
     extrapolation: 'forbidden',
   },
 };