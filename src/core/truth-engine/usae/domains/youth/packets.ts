 /**
  * YOUTH DOMAIN ANSWER PACKETS
  * 
  * Pre-built answers for common youth questions.
  */
 
 import type { UnifiedAnswerBody } from '../../mao/unified-body';
 
 /**
  * PACKET: Is this normal for my age?
  */
 export function createNormalityPacket(
   ageRange: string,
   measure: string,
   prevalence: number,
   sources: Array<{ id: string; name: string; tier: 1 | 2 | 3 }>
 ): UnifiedAnswerBody {
   return {
     answer_id: `youth_normality_${measure}_${Date.now()}`,
     answer_type: 'RISK_PREVALENCE',
     domain: 'youth',
     version: 1,
     generated_at: new Date().toISOString(),
     
     population_scope: {
       defined: true,
       description: `Young people aged ${ageRange}`,
     },
     
     time_scope: {
       explicit: true,
       granularity: 'year',
     },
     
     definition_scope: {
       explicit: true,
       definition_id: `def_${measure}`,
       definition_source: sources[0]?.name || 'Unknown',
       definition_text: `Prevalence of ${measure} in population surveys`,
     },
     
     geographic_scope: {
       level: 'national',
       entities: [],
       entity_type: 'country',
     },
     
     sources: sources.map(s => ({
       source_id: s.id,
       source_name: s.name,
       tier: s.tier,
       retrieved_at: new Date().toISOString(),
     })),
     
     confidence: {
       coverage: 0.85,
       source_agreement: 0.90,
       recency_days: 365,
       methodology_stability: 0.95,
     },
     
     limitations: [
       'This describes a population, not an individual.',
       'Survey methodology may vary between countries.',
       'Self-reported data may underestimate actual prevalence.',
     ],
     
     what_this_does_not_show: [
       'Whether you personally have this condition',
       'What you should do about it',
       'How this compares to your specific situation',
     ],
     
     output: {
       text: `Among people aged ${ageRange}, approximately ${prevalence}% report experiencing ${measure}. This is a common experience during this life stage. If you are concerned, speaking with a trusted adult or healthcare provider is a good step.`,
       
       structured: {
         primary_value: prevalence,
         unit: 'percent',
         entity: ageRange,
         time: 'latest available',
       },
       
       footnotes: [
         'This information describes populations, not individuals.',
         'If you are struggling, please reach out to a trusted adult or helpline.',
       ],
       
       citation: {
         cite_id: `cite:youth:${measure}`,
         cite_url: `/cite/youth/${measure}`,
       },
     },
   };
 }
 
 /**
  * PACKET: Trend over time
  */
 export function createTrendPacket(
   measure: string,
   startYear: number,
   endYear: number,
   startValue: number,
   endValue: number,
   direction: 'increased' | 'decreased' | 'stable'
 ): Partial<UnifiedAnswerBody> {
   const change = Math.abs(endValue - startValue);
   
   return {
     answer_id: `youth_trend_${measure}_${Date.now()}`,
     answer_type: 'TREND_CHANGE',
     domain: 'youth',
     version: 1,
     generated_at: new Date().toISOString(),
     
     output: {
       text: `${measure} among young people has ${direction} from ${startValue}% in ${startYear} to ${endValue}% in ${endYear}, a change of ${change} percentage points.`,
       
       structured: {
         primary_value: endValue,
         unit: 'percent',
         entity: 'youth population',
         time: `${startYear}-${endYear}`,
         secondary_values: {
           start_value: startValue,
           end_value: endValue,
           change: change,
         },
       },
       
       footnotes: [
         'Trend data is observational and does not imply causation.',
         'Methodology may have changed during this period.',
       ],
       
       citation: {
         cite_id: `cite:youth:trend:${measure}`,
         cite_url: `/cite/youth/trend/${measure}`,
       },
     },
   };
 }