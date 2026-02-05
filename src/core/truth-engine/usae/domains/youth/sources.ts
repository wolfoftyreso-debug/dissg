 /**
  * YOUTH DOMAIN SOURCES
  * 
  * Approved data sources for youth statistics.
  */
 
 /**
  * APPROVED SOURCES
  */
 export const YOUTH_APPROVED_SOURCES = {
   // Tier 1 - Official
   WHO_ADOLESCENT_HEALTH: {
     id: 'who_adolescent_health',
     name: 'WHO Adolescent Health',
     tier: 1 as const,
     url: 'https://www.who.int/health-topics/adolescent-health',
     geographic_scope: ['GLOBAL'],
     update_frequency: 'annual',
     age_scope: { min: 10, max: 19 },
   },
   
   UNICEF_DATA: {
     id: 'unicef_data',
     name: 'UNICEF Data',
     tier: 1 as const,
     url: 'https://data.unicef.org',
     geographic_scope: ['GLOBAL'],
     update_frequency: 'annual',
     age_scope: { min: 0, max: 18 },
   },
   
   EUROSTAT_YOUTH: {
     id: 'eurostat_youth',
     name: 'Eurostat Youth Statistics',
     tier: 1 as const,
     url: 'https://ec.europa.eu/eurostat',
     geographic_scope: ['EU', 'EEA'],
     update_frequency: 'annual',
     age_scope: { min: 15, max: 29 },
   },
   
   // Tier 2 - Research
   PISA: {
     id: 'pisa_oecd',
     name: 'OECD PISA',
     tier: 2 as const,
     url: 'https://www.oecd.org/pisa/',
     geographic_scope: ['OECD', 'PARTNER'],
     update_frequency: 'triennial',
     age_scope: { min: 15, max: 15 },
   },
   
   HBSC: {
     id: 'hbsc',
     name: 'Health Behaviour in School-aged Children',
     tier: 2 as const,
     url: 'https://hbsc.org',
     geographic_scope: ['EUROPE', 'NORTH_AMERICA'],
     update_frequency: 'quadrennial',
     age_scope: { min: 11, max: 15 },
   },
 } as const;
 
 /**
  * GET SOURCE BY ID
  */
 export function getSourceById(sourceId: string) {
   return Object.values(YOUTH_APPROVED_SOURCES).find(s => s.id === sourceId);
 }
 
 /**
  * GET SOURCES BY TIER
  */
 export function getSourcesByTier(tier: 1 | 2 | 3) {
   return Object.values(YOUTH_APPROVED_SOURCES).filter(s => s.tier === tier);
 }