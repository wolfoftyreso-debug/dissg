 /**
  * ANSWER PACKET: population_comparison
  * 
  * Covers search intents #21-25
  * "How does X compare to Y?"
  */
 
 import type { AnswerPacketV2 } from '../types';
 
 export const POPULATION_COMPARISON: AnswerPacketV2 = {
   id: 'answer:population_comparison:v1',
   status: 'stable',
   version: 1,
   created_at: '2025-02-05T00:00:00Z',
   supersedes: null,
   
   intent: {
     domain: 'population',
     category: 'comparative',
     question_patterns: [
       'How does {country_a} compare to {country_b}?',
       '{country_a} vs {country_b} population',
       'Compare population of {country_a} and {country_b}',
       'Which is bigger, {country_a} or {country_b}?',
       'How does {country} compare to EU average?',
     ],
     blocked_patterns: [
       'which is better',  // Normative
       'which is best',
     ],
   },
   
   inputs: {
     required: ['entity.country_a', 'entity.country_b'],
     optional: ['time.point'],
   },
   
   definition_requirements: [
     { measure: 'core:measure:population_resident:v1', required: true },
   ],
   
   query: {
     dsl_ref: 'query.population_comparison:v1',
     constraints: {
       aggregation: 'none',
       alignment: 'exact_definition',
       source_policy: 'consensus_required',
     },
   },
   
   defaults: {
     time: { strategy: 'latest_available' },
     sources: { prefer: ['core:source:un_desa:v1'] },
   },
   
   output: {
     formats: {
       text: {
         template: '{country_a} has a population of {value_a} compared to {value_b} in {country_b}. {country_a} is {ratio_description} the size of {country_b}.',
         footnotes: [
           'Comparison uses identical definition: resident population.',
           'Data from same reference period: {observed_at}.',
           'Source: {sources}',
         ],
       },
       json: {
         include: ['country_a', 'value_a', 'country_b', 'value_b', 'ratio', 'observed_at', 'sources'],
       },
     },
   },
   
   confidence: {
     required: true,
     fields: ['definition_match', 'temporal_alignment', 'source_agreement'],
     minimum_coverage: 0.95,
   },
   
   limits: {
     causal_claims: 'forbidden',
     ranking: 'with_disclaimer',
     aggregation: 'forbidden',
     extrapolation: 'forbidden',
   },
 };