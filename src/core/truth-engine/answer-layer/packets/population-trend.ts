 /**
  * ANSWER PACKET: population_trend
  * 
  * Covers search intents #6-10
  * "Is the population increasing or decreasing?"
  */
 
 import type { AnswerPacketV2 } from '../types';
 
 export const POPULATION_TREND: AnswerPacketV2 = {
   id: 'answer:population_trend:v1',
   status: 'stable',
   version: 1,
   created_at: '2025-02-05T00:00:00Z',
   supersedes: null,
   
   intent: {
     domain: 'population',
     category: 'trend',
     question_patterns: [
       'Is the population of {country} increasing or decreasing?',
       'Is {country} population growing?',
       'Population trend in {country}',
       'How fast is {country} growing?',
       'Which countries are growing fastest?',
       'Which countries are shrinking?',
     ],
     blocked_patterns: [
       'why is population',  // Causation → different packet
       'what causes',
     ],
   },
   
   inputs: {
     required: ['entity.country'],
     optional: ['time.range'],
   },
   
   definition_requirements: [
     { measure: 'core:measure:population_resident:v1', required: true },
     { measure: 'core:measure:population_change_rate:v1', required: false },
   ],
   
   query: {
     dsl_ref: 'query.population_trend:v1',
     constraints: {
       aggregation: 'none',
       alignment: 'exact_definition',
       source_policy: 'allow_multiple',
     },
   },
   
   defaults: {
     time: { strategy: 'range_required' },
     sources: { prefer: ['core:source:un_desa:v1', 'core:source:eurostat:v1'] },
   },
   
   output: {
     formats: {
       text: {
         template: 'The population of {country} has {direction} by {magnitude}% over the past {years} years ({start_year}–{end_year}).',
         footnotes: [
           'Trend based on {data_points} annual observations.',
           'Definition: resident population.',
           'Source: {sources}',
         ],
       },
       json: {
         include: ['direction', 'magnitude', 'start_year', 'end_year', 'data_points', 'sources', 'confidence'],
       },
     },
   },
   
   confidence: {
     required: true,
     fields: ['coverage', 'source_agreement', 'trend_stability'],
     minimum_coverage: 0.8,
   },
   
   limits: {
     causal_claims: 'forbidden',
     ranking: 'with_disclaimer',
     aggregation: 'forbidden',
     extrapolation: 'forbidden',
   },
 };