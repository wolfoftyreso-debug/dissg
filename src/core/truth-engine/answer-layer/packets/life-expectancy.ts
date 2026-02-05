 /**
  * ANSWER PACKET: life_expectancy
  * 
  * Covers search intents #51-55
  * "How long do people live in X?"
  */
 
 import type { AnswerPacketV2 } from '../types';
 
 export const LIFE_EXPECTANCY: AnswerPacketV2 = {
   id: 'answer:life_expectancy:v1',
   status: 'stable',
   version: 1,
   created_at: '2025-02-05T00:00:00Z',
   supersedes: null,
   
   intent: {
     domain: 'health',
     category: 'quantitative',
     question_patterns: [
       'What is life expectancy in {country}?',
       'How long do people live in {country}?',
       'Average lifespan in {country}',
       'Life expectancy at birth in {country}',
     ],
     blocked_patterns: [
       'why do people live longer',
       'what causes',
     ],
   },
   
   inputs: {
     required: ['entity.country'],
     optional: ['time.point', 'breakdown.sex'],
   },
   
   definition_requirements: [
     { measure: 'core:measure:life_expectancy_at_birth:v1', required: true },
   ],
   
   query: {
     dsl_ref: 'query.life_expectancy:v1',
     constraints: {
       aggregation: 'none',
       alignment: 'exact_definition',
       source_policy: 'allow_multiple',
     },
   },
   
   defaults: {
     time: { strategy: 'latest_available' },
     sources: { prefer: ['core:source:who:v1', 'core:source:un_desa:v1'] },
   },
   
   output: {
     formats: {
       text: {
         template: 'Life expectancy at birth in {country} is {value} years ({sex_breakdown}) as of {observed_at}.',
         footnotes: [
           'Life expectancy at birth: expected years of life for a newborn under current mortality rates.',
           'This is a period measure, not a cohort projection.',
           'Source: {sources}',
         ],
       },
       json: {
         include: ['value', 'male', 'female', 'observed_at', 'sources', 'confidence'],
       },
     },
   },
   
   confidence: {
     required: true,
     fields: ['coverage', 'vital_registration_quality'],
     minimum_coverage: 0.9,
   },
   
   limits: {
     causal_claims: 'forbidden',
     ranking: 'with_disclaimer',
     aggregation: 'forbidden',
     extrapolation: 'forbidden',
   },
 };