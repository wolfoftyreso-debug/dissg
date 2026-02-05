 /**
  * ECONOMY DOMAIN SAFETY RULES
  * 
  * Hard blocks for economic content.
  */
 
 /**
  * ECONOMY SAFETY GATES (CI ENFORCEMENT)
  */
 export const ECONOMY_SAFETY_GATES = {
   INVESTMENT_ADVICE: {
     id: 'economy:gate:investment_advice',
     rule: 'forbidden',
     description: 'No buy/sell recommendations or investment advice',
     enforcement: 'ci_block',
     detection_patterns: [
       'you should buy',
       'you should sell',
       'invest in',
       'good investment',
       'bad investment',
       'recommend',
     ],
   },
   
   PREDICTION_WITHOUT_SCENARIO: {
     id: 'economy:gate:prediction_without_scenario',
     rule: 'forbidden',
     description: 'No predictions without explicit scenario flag',
     enforcement: 'ci_block',
     detection_patterns: [
       'will grow',
       'will decline',
       'expected to',
       'forecast',
     ],
   },
   
   INDIVIDUAL_FINANCIAL_ADVICE: {
     id: 'economy:gate:individual_advice',
     rule: 'forbidden',
     description: 'No personalized financial recommendations',
     enforcement: 'ci_block',
     detection_patterns: [
       'for you',
       'your portfolio',
       'your situation',
     ],
   },
 } as const;
 
 /**
  * REQUIRED DISCLAIMERS
  */
 export const ECONOMY_REQUIRED_DISCLAIMERS = {
   NOT_ADVICE: {
     id: 'disclaimer:not_financial_advice',
     text: 'This information is descriptive and does not constitute financial or investment advice.',
     required_for: ['all_packets'],
   },
   
   HISTORICAL_DATA: {
     id: 'disclaimer:historical',
     text: 'Past performance is not indicative of future results.',
     required_for: ['trend_packets', 'comparison_packets'],
   },
   
   DATA_REVISION: {
     id: 'disclaimer:revision',
     text: 'Economic data is subject to revision. Most recent figures may be preliminary.',
     required_for: ['current_period_packets'],
   },
 } as const;
 
 /**
  * SAFETY VALIDATION
  */
 export function validateEconomySafety(content: string): { safe: boolean; violations: string[] } {
   const violations: string[] = [];
   
   for (const [key, gate] of Object.entries(ECONOMY_SAFETY_GATES)) {
     for (const pattern of gate.detection_patterns) {
       if (content.toLowerCase().includes(pattern.toLowerCase())) {
         violations.push(`${key}: detected pattern "${pattern}"`);
       }
     }
   }
   
   return { safe: violations.length === 0, violations };
 }