 /**
  * MARKETS DOMAIN SAFETY (STRICTEST IN SYSTEM)
  * 
  * Zero tolerance for anything that could be construed as financial advice.
  */
 
 /**
  * MARKETS SAFETY GATES (ABSOLUTE BLOCKS)
  */
 export const MARKETS_SAFETY_GATES = {
   BUY_SELL: {
     id: 'markets:gate:buy_sell',
     rule: 'absolute_block',
     patterns: ['buy', 'sell', 'hold', 'trade', 'invest'],
     exceptions: ['historical buy/sell volume'],
   },
   
   RECOMMENDATIONS: {
     id: 'markets:gate:recommendations',
     rule: 'absolute_block',
     patterns: ['recommend', 'should', 'consider', 'opportunity'],
     exceptions: [],
   },
   
   PREDICTIONS: {
     id: 'markets:gate:predictions',
     rule: 'absolute_block',
     patterns: ['will rise', 'will fall', 'will increase', 'will decrease', 'expected to', 'likely to', 'forecast'],
     exceptions: [],
   },
   
   VALUATIONS: {
     id: 'markets:gate:valuations',
     rule: 'absolute_block',
     patterns: ['overvalued', 'undervalued', 'fair value', 'target price', 'price target'],
     exceptions: [],
   },
   
   INDIVIDUAL_ADVICE: {
     id: 'markets:gate:individual',
     rule: 'absolute_block',
     patterns: ['for you', 'your portfolio', 'you should', 'your investment'],
     exceptions: [],
   },
 } as const;
 
 /**
  * REQUIRED DISCLAIMERS (MANDATORY ON ALL OUTPUT)
  */
 export const MARKETS_MANDATORY_DISCLAIMERS = [
   'Past performance is not indicative of future results.',
   'This information is historical and descriptive only.',
   'This does not constitute investment advice.',
 ] as const;
 
 /**
  * SAFETY VALIDATION (STRICTEST)
  */
 export function validateMarketsSafety(content: string): { 
   safe: boolean; 
   violations: string[];
   severity: 'block' | 'none';
 } {
   const violations: string[] = [];
   const contentLower = content.toLowerCase();
   
   for (const [key, gate] of Object.entries(MARKETS_SAFETY_GATES)) {
     for (const pattern of gate.patterns) {
       if (contentLower.includes(pattern.toLowerCase())) {
         // Check if it's an exception
         const isException = gate.exceptions.some(exc => 
           contentLower.includes(exc.toLowerCase())
         );
         
         if (!isException) {
           violations.push(`${key}: detected blocked pattern "${pattern}"`);
         }
       }
     }
   }
   
   return {
     safe: violations.length === 0,
     violations,
     severity: violations.length > 0 ? 'block' : 'none',
   };
 }
 
 /**
  * DISCLAIMER INJECTION (AUTOMATIC)
  */
 export function injectMarketDisclaimers(output: string): string {
   const disclaimerBlock = MARKETS_MANDATORY_DISCLAIMERS.join(' ');
   return `${output}\n\n${disclaimerBlock}`;
 }