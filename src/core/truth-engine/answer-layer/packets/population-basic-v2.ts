 /**
  * ANSWER PACKET: population_basic (V2 Schema)
  * 
  * Covers search intents #1-5
  * "How many people live in X?"
  */
 
 import type { AnswerPacketV2 } from '../types';
 
 export const POPULATION_BASIC_V2: AnswerPacketV2 = {
   id: 'answer:population_basic:v1',
   status: 'stable',
   version: 1,
   created_at: '2025-02-05T00:00:00Z',
   supersedes: null,
   
   intent: {
     domain: 'population',
     category: 'quantitative',
     question_patterns: [
       'How many people live in {country}?',
       'What is the population of {country}?',
       'Population of {country}',
       '{country} population',
       'How many inhabitants in {country}?',
       'Hur många bor i {country}?',
       'Vad är befolkningen i {country}?',
     ],
     blocked_patterns: [
       'how many immigrants',
       'how many foreigners',
       'why',
     ],
   },
   
   inputs: {
     required: ['entity.country'],
     optional: ['time.point'],
   },
   
   definition_requirements: [
     { measure: 'core:measure:population_resident:v1', required: true },
   ],
   
   query: {
     dsl_ref: 'query.population_basic:v1',
     constraints: {
       aggregation: 'none',
       alignment: 'exact_definition',
       source_policy: 'allow_multiple',
     },
   },
   
   defaults: {
     time: { strategy: 'latest_available' },
     sources: { prefer: ['core:source:scb_sweden:v1', 'core:source:un_desa:v1'] },
   },
   
   output: {
     formats: {
       text: {
         template: '{value} people live in {country} as of {observed_at}.',
         footnotes: [
           'Definition: resident population.',
           'Source: {sources}',
         ],
       },
       json: {
         include: ['value', 'unit', 'observed_at', 'sources', 'confidence'],
       },
     },
   },
   
   confidence: {
     required: true,
     fields: ['coverage', 'source_agreement'],
     minimum_coverage: 0.95,
   },
   
   limits: {
     causal_claims: 'forbidden',
     ranking: 'forbidden',
     aggregation: 'forbidden',
     extrapolation: 'forbidden',
   },
 };