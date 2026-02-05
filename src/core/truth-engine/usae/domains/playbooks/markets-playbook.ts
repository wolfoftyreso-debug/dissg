 /**
  * FINANCIAL MARKETS PLAYBOOK
  * 
  * ELEVATED safety level.
  * NO BUY/SELL ADVICE - HISTORICAL & DESCRIPTIVE ONLY.
  */
 
 import type { DomainPlaybook } from './types';
 
 export const MARKETS_PLAYBOOK: DomainPlaybook = {
   domain: 'markets',
   version: 1,
   locked: true,
   
   allowed_answer_types: [
     'DESCRIPTIVE',
     'TREND',
     'COMPARISON',
     'DISTRIBUTION',
     'CORRELATION',
     'SCENARIO', // Allowed but MUST be marked as model
   ],
   
   forbidden_answer_types: [],
   
   allowed_measures: [
     'historical_prices',
     'returns_historical',
     'volatility_measures',
     'index_movements',
     'sector_allocations',
     'market_capitalization',
     'correlation_matrices',
     'dividend_yields_historical',
   ],
   
   forbidden_measures: [
     'price_predictions',
     'buy_recommendations',
     'sell_recommendations',
     'target_prices',
     'individual_portfolio_advice',
   ],
   
   answer_rules: [
     {
       answer_type: 'DESCRIPTIVE',
       allowed: true,
       template: '{instrument} closed at {value} on {date}. Historical average over {period} is {average}.',
     },
     {
       answer_type: 'TREND',
       allowed: true,
       template: '{instrument} has {direction} {magnitude}% from {date_start} to {date_end}. This is historical, not predictive.',
     },
     {
       answer_type: 'CORRELATION',
       allowed: true,
       template: 'Historical correlation between {instrument_a} and {instrument_b} is {coefficient} over {period}. Past correlation does not predict future.',
     },
     {
       answer_type: 'SCENARIO',
       allowed: true,
       conditions: ['must_be_marked_as_model', 'assumptions_explicit'],
       template: 'SCENARIO (not prediction): Under assumption {assumptions}, historical patterns suggest {projection}. This is model output, not investment advice.',
     },
   ],
   
   safety_rules: [
     {
       rule_id: 'markets_no_buy_sell',
       name: 'No Buy/Sell Recommendations',
       pattern: /should (i|you) (buy|sell)|is (it|this) a (good|bad) (buy|investment)|recommend (buying|selling)/i,
       action: 'block',
       message: 'Investment recommendations are not provided. Please consult a licensed financial advisor.',
     },
     {
       rule_id: 'markets_no_prediction',
       name: 'No Price Predictions',
       pattern: /will (the price|it) (go|rise|fall)|price target|where will .* be in/i,
       action: 'redirect',
       message: 'Price predictions are not provided. Historical data and clearly-marked scenarios are available.',
     },
     {
       rule_id: 'markets_no_guarantee',
       name: 'No Return Guarantees',
       pattern: /guaranteed return|safe investment|risk-free|can't lose/i,
       action: 'block',
       message: 'No investment is guaranteed. All investments carry risk.',
     },
   ],
   
   mandatory_disclaimers: [
     'This is historical data, not investment advice.',
     'Past performance does not guarantee future results.',
     'Please consult a licensed financial advisor for investment decisions.',
   ],
   
   mandatory_resources: [
     'financial_advisor_note',
     'regulatory_disclaimer',
   ],
   
   crisis_detection: false,
   crisis_fallback_id: null,
 };