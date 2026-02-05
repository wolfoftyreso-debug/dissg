 /**
  * MARKETS DOMAIN MEASURES
  * 
  * Financial market indicators - historical data only.
  */
 
 export interface MarketMeasure {
   readonly id: string;
   readonly version: string;
   readonly name: string;
   readonly unit: MeasureUnit;
   readonly definition: string;
   readonly sources: readonly string[];
   readonly update_frequency: UpdateFrequency;
   readonly historical_only: boolean;
   readonly limitations: readonly string[];
 }
 
 export type MeasureUnit = 
   | 'index_points'
   | 'percent_change'
   | 'currency'
   | 'ratio'
   | 'volatility_pct';
 
 export type UpdateFrequency = 'realtime' | 'daily' | 'weekly' | 'monthly';
 
 export const MARKETS_MEASURES: Record<string, MarketMeasure> = {
   INDEX_LEVEL: {
     id: 'markets:measure:index_level:v1',
     version: '1.0.0',
     name: 'Market Index Level',
     unit: 'index_points',
     definition: 'Closing value of market index on specified date.',
     sources: ['market_data_providers', 'exchanges'],
     update_frequency: 'daily',
     historical_only: true,
     limitations: [
       'End-of-day values only',
       'Does not reflect intraday movements',
     ],
   },
   
   INDEX_RETURN: {
     id: 'markets:measure:index_return:v1',
     version: '1.0.0',
     name: 'Index Total Return',
     unit: 'percent_change',
     definition: 'Total return including dividends over specified period.',
     sources: ['index_providers', 'financial_databases'],
     update_frequency: 'daily',
     historical_only: true,
     limitations: [
       'Past performance is not indicative of future results',
       'Does not account for transaction costs',
     ],
   },
   
   VOLATILITY: {
     id: 'markets:measure:volatility:v1',
     version: '1.0.0',
     name: 'Historical Volatility',
     unit: 'volatility_pct',
     definition: 'Annualized standard deviation of returns over specified period.',
     sources: ['calculated_from_price_data'],
     update_frequency: 'daily',
     historical_only: true,
     limitations: [
       'Based on historical data only',
       'Does not predict future volatility',
       'Calculation period affects result',
     ],
   },
   
   SECTOR_WEIGHT: {
     id: 'markets:measure:sector_weight:v1',
     version: '1.0.0',
     name: 'Sector Weight in Index',
     unit: 'percent_change',
     definition: 'Percentage weight of sector in market index.',
     sources: ['index_providers'],
     update_frequency: 'monthly',
     historical_only: true,
     limitations: [
       'Sector classifications may vary',
       'Weights change with market movements',
     ],
   },
 } as const;