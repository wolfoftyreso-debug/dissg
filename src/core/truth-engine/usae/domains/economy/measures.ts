 /**
  * ECONOMY DOMAIN MEASURES
  * 
  * Standardized economic indicators with full metadata.
  */
 
 export interface EconomyMeasure {
   readonly id: string;
   readonly version: string;
   readonly name: string;
   readonly unit: MeasureUnit;
   readonly definition: string;
   readonly methodology: string;
   readonly sources: readonly string[];
   readonly update_frequency: UpdateFrequency;
   readonly seasonal_adjustment: boolean;
   readonly comparability: ComparabilityLevel;
   readonly limitations: readonly string[];
 }
 
 export type MeasureUnit = 
   | 'percent'
   | 'percent_change'
   | 'index_100'
   | 'currency_usd'
   | 'currency_local'
   | 'ratio'
   | 'per_capita';
 
 export type UpdateFrequency = 'monthly' | 'quarterly' | 'annual';
 export type ComparabilityLevel = 'high' | 'medium' | 'low';
 
 /**
  * ECONOMY MEASURES REGISTRY
  */
 export const ECONOMY_MEASURES: Record<string, EconomyMeasure> = {
   // === GROWTH ===
   GDP_GROWTH: {
     id: 'economy:measure:gdp_growth:v1',
     version: '1.0.0',
     name: 'GDP Growth Rate',
     unit: 'percent_change',
     definition: 'Percentage change in real Gross Domestic Product from previous period.',
     methodology: 'Quarterly national accounts, seasonally adjusted, chain-linked volumes.',
     sources: ['IMF_WEO', 'OECD_MEI', 'EUROSTAT', 'national_statistics'],
     update_frequency: 'quarterly',
     seasonal_adjustment: true,
     comparability: 'high',
     limitations: [
       'Revisions common for recent periods',
       'Seasonal adjustment methods vary',
       'Base year differences affect comparisons',
     ],
   },
   
   GDP_PER_CAPITA: {
     id: 'economy:measure:gdp_per_capita:v1',
     version: '1.0.0',
     name: 'GDP per Capita',
     unit: 'currency_usd',
     definition: 'GDP divided by population, expressed in current US dollars or PPP.',
     methodology: 'National accounts GDP divided by mid-year population estimate.',
     sources: ['WORLD_BANK', 'IMF_WEO', 'OECD'],
     update_frequency: 'annual',
     seasonal_adjustment: false,
     comparability: 'medium',
     limitations: [
       'PPP vs market exchange rate affects ranking',
       'Does not capture income distribution',
       'Population estimates vary in accuracy',
     ],
   },
   
   // === EMPLOYMENT ===
   UNEMPLOYMENT_RATE: {
     id: 'economy:measure:unemployment_rate:v1',
     version: '1.0.0',
     name: 'Unemployment Rate',
     unit: 'percent',
     definition: 'Share of labor force that is unemployed and actively seeking work.',
     methodology: 'ILO definition: without work, available, actively seeking.',
     sources: ['ILO', 'OECD_MEI', 'EUROSTAT', 'national_labor_surveys'],
     update_frequency: 'monthly',
     seasonal_adjustment: true,
     comparability: 'high',
     limitations: [
       'Excludes discouraged workers',
       'Part-time/underemployment not captured',
       'Labor force participation affects interpretation',
     ],
   },
   
   YOUTH_UNEMPLOYMENT: {
     id: 'economy:measure:youth_unemployment:v1',
     version: '1.0.0',
     name: 'Youth Unemployment Rate',
     unit: 'percent',
     definition: 'Unemployment rate for population aged 15-24.',
     methodology: 'ILO definition applied to 15-24 age group.',
     sources: ['ILO', 'OECD', 'EUROSTAT'],
     update_frequency: 'quarterly',
     seasonal_adjustment: true,
     comparability: 'high',
     limitations: [
       'Students in labor force affect interpretation',
       'NEET rate may be more informative',
       'Age definition varies (15-24 vs 16-24)',
     ],
   },
   
   // === INFLATION ===
   CPI_INFLATION: {
     id: 'economy:measure:cpi_inflation:v1',
     version: '1.0.0',
     name: 'Consumer Price Inflation',
     unit: 'percent_change',
     definition: 'Annual percentage change in Consumer Price Index.',
     methodology: 'Weighted basket of consumer goods and services.',
     sources: ['IMF_IFS', 'OECD_MEI', 'national_statistics'],
     update_frequency: 'monthly',
     seasonal_adjustment: false,
     comparability: 'medium',
     limitations: [
       'Basket composition varies by country',
       'Quality adjustments differ',
       'Housing cost treatment varies',
     ],
   },
   
   // === PUBLIC FINANCE ===
   GOVT_DEBT_GDP: {
     id: 'economy:measure:govt_debt_gdp:v1',
     version: '1.0.0',
     name: 'Government Debt to GDP',
     unit: 'percent',
     definition: 'General government gross debt as percentage of GDP.',
     methodology: 'Maastricht definition or national definition.',
     sources: ['IMF_WEO', 'OECD', 'EUROSTAT'],
     update_frequency: 'annual',
     seasonal_adjustment: false,
     comparability: 'medium',
     limitations: [
       'Gross vs net debt definitions vary',
       'Government perimeter definitions differ',
       'Contingent liabilities excluded',
     ],
   },
 } as const;
 
 /**
  * MEASURE LOOKUP
  */
 export function getMeasure(measureId: string): EconomyMeasure | undefined {
   return Object.values(ECONOMY_MEASURES).find(m => m.id === measureId);
 }
 
 export function getMeasuresByCategory(category: string): EconomyMeasure[] {
   const categoryMap: Record<string, string[]> = {
     growth: ['gdp_growth', 'gdp_per_capita'],
     employment: ['unemployment_rate', 'youth_unemployment'],
     inflation: ['cpi_inflation'],
     public_finance: ['govt_debt_gdp'],
   };
   
   const ids = categoryMap[category] || [];
   return Object.values(ECONOMY_MEASURES).filter(m => 
     ids.some(id => m.id.includes(id))
   );
 }