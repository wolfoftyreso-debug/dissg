 /**
  * MARKETS DOMAIN SOURCES
  * 
  * Approved sources for market data.
  */
 
 export interface MarketSource {
   readonly id: string;
   readonly name: string;
   readonly tier: 1 | 2;
   readonly coverage: string;
   readonly data_types: readonly string[];
   readonly status: 'active' | 'degraded' | 'killed';
 }
 
 export const MARKETS_APPROVED_SOURCES: Record<string, MarketSource> = {
   EXCHANGE_OFFICIAL: {
     id: 'EXCHANGE_OFFICIAL',
     name: 'Official Exchange Data',
     tier: 1,
     coverage: 'Listed securities on major exchanges',
     data_types: ['price', 'volume', 'index_levels'],
     status: 'active',
   },
   
   INDEX_PROVIDERS: {
     id: 'INDEX_PROVIDERS',
     name: 'Index Calculation Agents',
     tier: 1,
     coverage: 'Major market indices (S&P, MSCI, FTSE)',
     data_types: ['index_levels', 'returns', 'constituents'],
     status: 'active',
   },
   
   CENTRAL_BANKS: {
     id: 'CENTRAL_BANKS',
     name: 'Central Bank Statistics',
     tier: 1,
     coverage: 'Interest rates, exchange rates',
     data_types: ['rates', 'fx'],
     status: 'active',
   },
 } as const;