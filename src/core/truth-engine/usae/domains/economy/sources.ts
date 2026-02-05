 /**
  * ECONOMY DOMAIN SOURCES
  * 
  * Approved data sources for economic indicators.
  */
 
 export interface EconomySource {
   readonly id: string;
   readonly name: string;
   readonly tier: 1 | 2 | 3;
   readonly url: string;
   readonly api_endpoint: string | null;
   readonly coverage: 'global' | 'regional' | 'national';
   readonly update_frequency: string;
   readonly quality_score: number;
   readonly status: 'active' | 'degraded' | 'killed';
   readonly measures_provided: readonly string[];
   readonly citation_format: string;
 }
 
 /**
  * ECONOMY SOURCE TIERS
  */
 export const ECONOMY_SOURCE_TIERS = {
   TIER_1: {
     description: 'International organizations with standardized methodology',
     sources: ['IMF_WEO', 'WORLD_BANK', 'OECD', 'ILO'],
     trust_level: 'highest',
   },
   TIER_2: {
     description: 'Regional organizations and major national offices',
     sources: ['EUROSTAT', 'ECB', 'FED', 'national_statistics'],
     trust_level: 'high',
   },
   TIER_3: {
     description: 'Research institutions and aggregators',
     sources: ['academic_datasets', 'commercial_providers'],
     trust_level: 'medium',
   },
 } as const;
 
 /**
  * APPROVED SOURCES REGISTRY
  */
 export const ECONOMY_APPROVED_SOURCES: Record<string, EconomySource> = {
   IMF_WEO: {
     id: 'IMF_WEO',
     name: 'IMF World Economic Outlook',
     tier: 1,
     url: 'https://www.imf.org/en/Publications/WEO',
     api_endpoint: 'https://www.imf.org/external/datamapper/api/v1/',
     coverage: 'global',
     update_frequency: 'biannual',
     quality_score: 98,
     status: 'active',
     measures_provided: [
       'economy:measure:gdp_growth:v1',
       'economy:measure:gdp_per_capita:v1',
       'economy:measure:cpi_inflation:v1',
       'economy:measure:govt_debt_gdp:v1',
     ],
     citation_format: 'International Monetary Fund. World Economic Outlook Database. Washington, DC: IMF; {year}.',
   },
   
   WORLD_BANK: {
     id: 'WORLD_BANK',
     name: 'World Bank Open Data',
     tier: 1,
     url: 'https://data.worldbank.org/',
     api_endpoint: 'https://api.worldbank.org/v2/',
     coverage: 'global',
     update_frequency: 'continuous',
     quality_score: 96,
     status: 'active',
     measures_provided: [
       'economy:measure:gdp_per_capita:v1',
       'economy:measure:unemployment_rate:v1',
     ],
     citation_format: 'World Bank. World Development Indicators. Washington, DC: The World Bank; {year}.',
   },
   
   OECD: {
     id: 'OECD',
     name: 'OECD Statistics',
     tier: 1,
     url: 'https://stats.oecd.org/',
     api_endpoint: 'https://stats.oecd.org/SDMX-JSON/',
     coverage: 'regional',
     update_frequency: 'monthly',
     quality_score: 95,
     status: 'active',
     measures_provided: [
       'economy:measure:gdp_growth:v1',
       'economy:measure:unemployment_rate:v1',
       'economy:measure:youth_unemployment:v1',
       'economy:measure:cpi_inflation:v1',
     ],
     citation_format: 'OECD. Main Economic Indicators. Paris: OECD Publishing; {year}.',
   },
   
   ILO: {
     id: 'ILO',
     name: 'ILO ILOSTAT',
     tier: 1,
     url: 'https://ilostat.ilo.org/',
     api_endpoint: 'https://www.ilo.org/ilostat-files/WEB_bulk_download/',
     coverage: 'global',
     update_frequency: 'monthly',
     quality_score: 94,
     status: 'active',
     measures_provided: [
       'economy:measure:unemployment_rate:v1',
       'economy:measure:youth_unemployment:v1',
     ],
     citation_format: 'International Labour Organization. ILOSTAT database. Geneva: ILO; {year}.',
   },
   
   EUROSTAT: {
     id: 'EUROSTAT',
     name: 'Eurostat Database',
     tier: 2,
     url: 'https://ec.europa.eu/eurostat/',
     api_endpoint: 'https://ec.europa.eu/eurostat/api/dissemination/',
     coverage: 'regional',
     update_frequency: 'monthly',
     quality_score: 93,
     status: 'active',
     measures_provided: [
       'economy:measure:gdp_growth:v1',
       'economy:measure:unemployment_rate:v1',
       'economy:measure:cpi_inflation:v1',
       'economy:measure:govt_debt_gdp:v1',
     ],
     citation_format: 'Eurostat. European Statistics. Luxembourg: Publications Office of the European Union; {year}.',
   },
 } as const;
 
 /**
  * SOURCE LOOKUP
  */
 export function getSource(sourceId: string): EconomySource | undefined {
   return ECONOMY_APPROVED_SOURCES[sourceId];
 }
 
 export function getActiveSourcesForMeasure(measureId: string): EconomySource[] {
   return Object.values(ECONOMY_APPROVED_SOURCES).filter(
     s => s.status === 'active' && s.measures_provided.includes(measureId)
   );
 }