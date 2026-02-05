 /**
  * MARKETS DOMAIN ONTOLOGY
  * 
  * Financial market concepts with strict boundaries.
  */
 
 export const MARKETS_CONCEPTS = {
   ASSET_CLASSES: {
     EQUITY: 'equities',
     FIXED_INCOME: 'fixed_income',
     COMMODITIES: 'commodities',
     CURRENCIES: 'currencies',
     INDICES: 'market_indices',
   },
   
   DATA_TYPES: {
     PRICE: 'price_data',
     VOLUME: 'volume_data',
     VOLATILITY: 'volatility_measures',
     RETURNS: 'return_calculations',
   },
   
   TIME_HORIZONS: {
     INTRADAY: 'intraday',
     DAILY: 'daily',
     WEEKLY: 'weekly',
     MONTHLY: 'monthly',
     ANNUAL: 'annual',
   },
 } as const;
 
 /**
  * MARKETS ANSWER TYPE RULES (STRICTEST)
  */
 export const MARKETS_ANSWER_TYPE_RULES = {
   ALLOWED: [
     'DESCRIPTIVE_STAT',
     'TREND_CHANGE',
     'DISTRIBUTION_STRUCTURE',
     'CORRELATION_OVERVIEW',
   ],
   
   CONDITIONAL: [
     {
       type: 'COMPARISON_CONDITIONAL',
       conditions: ['historical_only', 'explicit_period', 'methodology_disclosed'],
     },
   ],
   
   STRICTLY_FORBIDDEN: [
     'SCENARIO_MODEL', // No market predictions
     'RISK_PREVALENCE', // No probability statements about markets
   ],
   
   FORBIDDEN_PATTERNS: [
     'buy',
     'sell',
     'hold',
     'overvalued',
     'undervalued',
     'will rise',
     'will fall',
     'target price',
     'recommend',
   ],
 } as const;