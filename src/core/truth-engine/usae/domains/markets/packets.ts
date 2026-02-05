 /**
  * MARKETS ANSWER PACKETS
  * 
  * Strictly historical, descriptive market data only.
  */
 
 import type { AnswerTypeCode } from '../../ontology/answer-types';
 
 export interface MarketAnswerPacket {
   readonly id: string;
   readonly version: string;
   readonly answer_type: AnswerTypeCode;
   readonly query: {
     readonly measure: string;
     readonly time: string;
   };
   readonly output: {
     readonly text_template: string;
     readonly placeholders: readonly string[];
     readonly required_disclaimers: readonly string[];
   };
   readonly safety: {
     readonly investment_advice_forbidden: true;
     readonly prediction_forbidden: true;
     readonly recommendation_forbidden: true;
   };
 }
 
 export const MARKETS_ANSWER_PACKETS: Record<string, MarketAnswerPacket> = {
  INDEX_HISTORICAL: {
    id: 'markets:answer:index_historical:v1',
    version: '1.0.0',
    answer_type: 'DESCRIPTIVE',
     query: {
       measure: 'markets:measure:index_level:v1',
       time: 'specific_date',
     },
     output: {
       text_template: 'The {index_name} closed at {value} points on {date}.',
       placeholders: ['index_name', 'value', 'date'],
       required_disclaimers: [
         'Historical data only. Past performance is not indicative of future results.',
         'This is not investment advice.',
       ],
     },
     safety: {
       investment_advice_forbidden: true,
       prediction_forbidden: true,
       recommendation_forbidden: true,
     },
   },
   
  RETURN_PERIOD: {
    id: 'markets:answer:return_period:v1',
    version: '1.0.0',
    answer_type: 'TREND',
     query: {
       measure: 'markets:measure:index_return:v1',
       time: 'specified_period',
     },
     output: {
       text_template: 'The {index_name} returned {value}% over the period {start_date} to {end_date}.',
       placeholders: ['index_name', 'value', 'start_date', 'end_date'],
       required_disclaimers: [
         'Historical performance only. Past performance is not indicative of future results.',
         'Returns may not include all costs. This is not investment advice.',
       ],
     },
     safety: {
       investment_advice_forbidden: true,
       prediction_forbidden: true,
       recommendation_forbidden: true,
     },
   },
   
  VOLATILITY_HISTORICAL: {
    id: 'markets:answer:volatility_historical:v1',
    version: '1.0.0',
    answer_type: 'DESCRIPTIVE',
     query: {
       measure: 'markets:measure:volatility:v1',
       time: 'trailing_period',
     },
     output: {
       text_template: 'Historical volatility for {index_name} over the past {period} was {value}% annualized.',
       placeholders: ['index_name', 'period', 'value'],
       required_disclaimers: [
         'Historical volatility does not predict future volatility.',
         'This is descriptive, not predictive. Not investment advice.',
       ],
     },
     safety: {
       investment_advice_forbidden: true,
       prediction_forbidden: true,
       recommendation_forbidden: true,
     },
   },
 } as const;
 
 /**
  * MARKETS PACKET VALIDATION (STRICTEST)
  */
 export function validatePacket(packet: MarketAnswerPacket): { valid: boolean; errors: string[] } {
   const errors: string[] = [];
   
   // All safety flags MUST be true
   if (!packet.safety.investment_advice_forbidden) {
     errors.push('CRITICAL: investment_advice_forbidden must be true');
   }
   if (!packet.safety.prediction_forbidden) {
     errors.push('CRITICAL: prediction_forbidden must be true');
   }
   if (!packet.safety.recommendation_forbidden) {
     errors.push('CRITICAL: recommendation_forbidden must be true');
   }
   
   // Must have disclaimers
   if (packet.output.required_disclaimers.length < 2) {
     errors.push('Minimum 2 disclaimers required for market data');
   }
   
   return { valid: errors.length === 0, errors };
 }