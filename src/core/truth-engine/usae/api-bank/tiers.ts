 /**
  * API TIER SYSTEM
  * 
  * Tier 1: Official government/international sources (WHO, national statistics)
  * Tier 2: Academic and research institutions
  * Tier 3: Commercial and aggregated sources
  */
 
 export const API_TIER_LEVELS = {
   TIER_1: {
     level: 1,
     name: 'Official Sources',
     description: 'Government, international organizations, official statistics',
     examples: ['WHO', 'CDC', 'Eurostat', 'National statistics offices'],
     trust_weight: 1.0,
     citation_required: true,
     can_be_sole_source: true,
   },
   TIER_2: {
     level: 2,
     name: 'Research Sources',
     description: 'Peer-reviewed academic, research institutions',
     examples: ['Cochrane', 'LANCET aggregated', 'University research'],
     trust_weight: 0.85,
     citation_required: true,
     can_be_sole_source: true,
   },
   TIER_3: {
     level: 3,
     name: 'Commercial Sources',
     description: 'Commercial data providers, aggregated datasets',
     examples: ['Bloomberg', 'Reuters', 'Financial data providers'],
     trust_weight: 0.70,
     citation_required: true,
     can_be_sole_source: false, // Requires corroboration
   },
 } as const;
 
 export type ApiTier = 1 | 2 | 3;
 
 /**
  * VALIDATE API TIER
  */
 export function validateApiTier(tier: number): tier is ApiTier {
   return tier >= 1 && tier <= 3;
 }
 
 /**
  * GET TIER CONFIG
  */
 export function getTierConfig(tier: ApiTier) {
   return Object.values(API_TIER_LEVELS).find(t => t.level === tier);
 }