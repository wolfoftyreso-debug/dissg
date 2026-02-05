 /**
  * ECONOMY ANSWER PACKETS
  * 
  * Pre-computed answer structures for economic indicators.
  */
 
 import type { AnswerTypeCode } from '../../ontology/answer-types';
 
 export interface EconomyAnswerPacket {
   readonly id: string;
   readonly version: string;
   readonly answer_type: AnswerTypeCode;
   readonly query: {
     readonly measure: string;
     readonly time: string;
     readonly geography?: string;
   };
   readonly output: {
     readonly text_template: string;
     readonly placeholders: readonly string[];
     readonly sections: {
       readonly methodology: boolean;
       readonly limitations: boolean;
       readonly not_advice: boolean;
     };
   };
   readonly safety: {
     readonly investment_advice_forbidden: boolean;
     readonly prediction_forbidden: boolean;
   };
 }
 
 /**
  * ECONOMY PACKETS REGISTRY
  */
 export const ECONOMY_ANSWER_PACKETS: Record<string, EconomyAnswerPacket> = {
  GDP_GROWTH_CURRENT: {
    id: 'economy:answer:gdp_growth_current:v1',
    version: '1.0.0',
    answer_type: 'DESCRIPTIVE',
     query: {
       measure: 'economy:measure:gdp_growth:v1',
       time: 'latest_quarter',
     },
     output: {
       text_template: 'The GDP growth rate for {country} in {period} was {value}%. This is based on quarterly national accounts data.',
       placeholders: ['country', 'period', 'value'],
       sections: {
         methodology: true,
         limitations: true,
         not_advice: true,
       },
     },
     safety: {
       investment_advice_forbidden: true,
       prediction_forbidden: true,
     },
   },
   
  GDP_GROWTH_TREND: {
    id: 'economy:answer:gdp_growth_trend:v1',
    version: '1.0.0',
    answer_type: 'TREND',
     query: {
       measure: 'economy:measure:gdp_growth:v1',
       time: 'trend_5y',
     },
     output: {
       text_template: 'Over the past 5 years, {country} experienced an average annual GDP growth of {average}%, ranging from {min}% to {max}%.',
       placeholders: ['country', 'average', 'min', 'max'],
       sections: {
         methodology: true,
         limitations: true,
         not_advice: true,
       },
     },
     safety: {
       investment_advice_forbidden: true,
       prediction_forbidden: true,
     },
   },
   
  UNEMPLOYMENT_CURRENT: {
    id: 'economy:answer:unemployment_current:v1',
    version: '1.0.0',
    answer_type: 'DESCRIPTIVE',
     query: {
       measure: 'economy:measure:unemployment_rate:v1',
       time: 'latest_month',
     },
     output: {
       text_template: 'The unemployment rate in {country} was {value}% in {period}, based on ILO methodology.',
       placeholders: ['country', 'value', 'period'],
       sections: {
         methodology: true,
         limitations: true,
         not_advice: true,
       },
     },
     safety: {
       investment_advice_forbidden: true,
       prediction_forbidden: true,
     },
   },
   
  UNEMPLOYMENT_COMPARISON: {
    id: 'economy:answer:unemployment_comparison:v1',
    version: '1.0.0',
    answer_type: 'COMPARISON',
     query: {
       measure: 'economy:measure:unemployment_rate:v1',
       time: 'latest_available',
     },
     output: {
       text_template: 'Unemployment rate in {country_a} ({value_a}%) compared to {country_b} ({value_b}%) as of {period}. This comparison uses harmonized ILO definitions.',
       placeholders: ['country_a', 'value_a', 'country_b', 'value_b', 'period'],
       sections: {
         methodology: true,
         limitations: true,
         not_advice: true,
       },
     },
     safety: {
       investment_advice_forbidden: true,
       prediction_forbidden: true,
     },
   },
   
  INFLATION_CURRENT: {
    id: 'economy:answer:inflation_current:v1',
    version: '1.0.0',
    answer_type: 'DESCRIPTIVE',
     query: {
       measure: 'economy:measure:cpi_inflation:v1',
       time: 'latest_month',
     },
     output: {
       text_template: 'Annual consumer price inflation in {country} was {value}% in {period}.',
       placeholders: ['country', 'value', 'period'],
       sections: {
         methodology: true,
         limitations: true,
         not_advice: true,
       },
     },
     safety: {
       investment_advice_forbidden: true,
       prediction_forbidden: true,
     },
   },
   
  DEBT_CURRENT: {
    id: 'economy:answer:debt_gdp_current:v1',
    version: '1.0.0',
    answer_type: 'DESCRIPTIVE',
     query: {
       measure: 'economy:measure:govt_debt_gdp:v1',
       time: 'latest_year',
     },
     output: {
       text_template: 'Government debt in {country} was {value}% of GDP in {year}.',
       placeholders: ['country', 'value', 'year'],
       sections: {
         methodology: true,
         limitations: true,
         not_advice: true,
       },
     },
     safety: {
       investment_advice_forbidden: true,
       prediction_forbidden: true,
     },
   },
 } as const;
 
 /**
  * PACKET VALIDATION
  */
 export function validatePacket(packet: EconomyAnswerPacket): { valid: boolean; errors: string[] } {
   const errors: string[] = [];
   
   if (!packet.output.sections.limitations) {
     errors.push('Missing required section: limitations');
   }
   if (!packet.output.sections.not_advice) {
     errors.push('Missing required section: not_advice');
   }
   if (!packet.safety.investment_advice_forbidden) {
     errors.push('Safety violation: investment advice must be forbidden');
   }
   if (!packet.safety.prediction_forbidden) {
     errors.push('Safety violation: prediction must be forbidden');
   }
   
   return { valid: errors.length === 0, errors };
 }