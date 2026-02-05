 /**
  * ANSWER PACKET: gdp_basic
  * 
  * Covers search intents #26-30
  * "How rich is country X?"
  */
 
 import type { AnswerPacketV2 } from '../types';
 
 export const GDP_BASIC: AnswerPacketV2 = {
   id: 'answer:gdp_basic:v1',
   status: 'stable',
   version: 1,
   created_at: '2025-02-05T00:00:00Z',
   supersedes: null,
   
   intent: {
     domain: 'economy',
     category: 'quantitative',
     question_patterns: [
       'What is the GDP of {country}?',
       'GDP per capita in {country}',
       'How rich is {country}?',
       'Average income in {country}',
       'Median income in {country}',
     ],
     blocked_patterns: [
       'why is {country} rich',
       'why is {country} poor',
     ],
   },
   
   inputs: {
     required: ['entity.country'],
     optional: ['time.point', 'adjustment.ppp'],
   },
   
   definition_requirements: [
     { measure: 'core:measure:gdp_per_capita_ppp:v1', required: true },
     { measure: 'core:measure:gdp_nominal:v1', required: false },
   ],
   
   query: {
     dsl_ref: 'query.gdp_basic:v1',
     constraints: {
       aggregation: 'none',
       alignment: 'exact_definition',
       source_policy: 'allow_multiple',
     },
   },
   
   defaults: {
     time: { strategy: 'latest_available' },
     sources: { prefer: ['core:source:world_bank:v1', 'core:source:imf:v1'] },
   },
   
   output: {
     formats: {
       text: {
         template: 'GDP per capita in {country} is {value} {currency} ({adjustment}) as of {observed_at}.',
         footnotes: [
           'GDP per capita measures economic output per person.',
           'PPP adjustment accounts for price differences between countries.',
           'Source: {sources}',
         ],
       },
       json: {
         include: ['value', 'currency', 'adjustment', 'observed_at', 'sources', 'confidence'],
       },
     },
   },
   
   confidence: {
     required: true,
     fields: ['coverage', 'source_agreement', 'methodology_consistency'],
     minimum_coverage: 0.85,
   },
   
   limits: {
     causal_claims: 'forbidden',
     ranking: 'with_disclaimer',
     aggregation: 'forbidden',
     extrapolation: 'forbidden',
   },
 };