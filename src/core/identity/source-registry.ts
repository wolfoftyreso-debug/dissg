 /**
  * SOURCE REGISTRY
  * 
  * Every source is a first-class object with its own ID.
  * Contradicting data is information, not error.
  */
 
 import { generateCanonicalId, type SemanticHashInput } from './id-strategy';
 
 // =============================================================================
 // SOURCE ID GENERATION
 // =============================================================================
 
 export interface SourceDefinition {
   /** Organization name */
   organization: string;
   
   /** Source type */
   sourceType: 'official' | 'academic' | 'ngo' | 'derived' | 'aggregator';
   
   /** Primary URL */
   url?: string;
   
   /** Geographic scope */
   geographicScope: string[];
   
   /** Thematic scope */
   thematicScope: string[];
 }
 
 /**
  * Generate a canonical source ID
  */
 export async function generateSourceId(source: SourceDefinition): Promise<string> {
   const hashInput: SemanticHashInput = {
     canonicalName: source.organization,
     definition: `${source.sourceType} source covering ${source.geographicScope.join(', ')} for ${source.thematicScope.join(', ')}`,
   };
   
   return generateCanonicalId('source', hashInput);
 }
 
 // =============================================================================
 // WELL-KNOWN SOURCES (pre-registered)
 // =============================================================================
 
 export const WELL_KNOWN_SOURCES = {
   // International organizations
   WORLD_BANK: 'core:source:world_bank_b3f2a1:v1',
   UN_DATA: 'core:source:un_data_division_e7c4d2:v1',
   IMF: 'core:source:international_monetary_fund_a1b2c3:v1',
   WHO: 'core:source:world_health_organization_d4e5f6:v1',
   ILO: 'core:source:international_labour_organization_g7h8i9:v1',
   OECD: 'core:source:oecd_j0k1l2:v1',
   EUROSTAT: 'core:source:eurostat_m3n4o5:v1',
   
   // European national statistical offices
   SCB_SWEDEN: 'core:source:statistics_sweden_p6q7r8:v1',
   SSB_NORWAY: 'core:source:statistics_norway_s9t0u1:v1',
   DST_DENMARK: 'core:source:statistics_denmark_v2w3x4:v1',
   TILASTOKESKUS_FINLAND: 'core:source:statistics_finland_y5z6a7:v1',
   DESTATIS_GERMANY: 'core:source:federal_statistical_office_germany_b8c9d0:v1',
   INSEE_FRANCE: 'core:source:insee_france_e1f2g3:v1',
   ONS_UK: 'core:source:office_national_statistics_uk_h4i5j6:v1',
   CBS_NETHERLANDS: 'core:source:statistics_netherlands_k7l8m9:v1',
   
   // Academic/Research
   GAPMINDER: 'core:source:gapminder_n0o1p2:v1',
   OUR_WORLD_IN_DATA: 'core:source:our_world_in_data_q3r4s5:v1',
   
   // System sources
   DISSG_DERIVED: 'core:source:dissg_derived_t6u7v8:v1',
   DISSG_AGGREGATED: 'core:source:dissg_aggregated_w9x0y1:v1',
 } as const;
 
 // =============================================================================
 // SOURCE CHAIN (provenance)
 // =============================================================================
 
 export interface SourceChainLink {
   sourceId: string;
   role: 'primary' | 'transformer' | 'aggregator' | 'validator';
   transformationApplied?: string;
   timestamp: string;
 }
 
 export interface SourceChain {
   /** Final source in chain */
   finalSourceId: string;
   
   /** Complete chain from primary to final */
   chain: SourceChainLink[];
   
   /** Primary source (first in chain) */
   primarySourceId: string;
 }
 
 /**
  * Build source chain for derived data
  */
 export function buildSourceChain(links: SourceChainLink[]): SourceChain {
   if (links.length === 0) {
     throw new Error('Source chain cannot be empty');
   }
   
   return {
     finalSourceId: links[links.length - 1].sourceId,
     chain: links,
     primarySourceId: links[0].sourceId,
   };
 }
 
 /**
  * Validate that source chain is complete
  */
 export function validateSourceChain(chain: SourceChain): { valid: boolean; errors: string[] } {
   const errors: string[] = [];
   
   if (chain.chain.length === 0) {
     errors.push('Source chain is empty');
   }
   
   // First link must be primary
   if (chain.chain[0]?.role !== 'primary') {
     errors.push('First link in chain must have role "primary"');
   }
   
   // Check for gaps
   for (let i = 0; i < chain.chain.length; i++) {
     if (!chain.chain[i].sourceId) {
       errors.push(`Link ${i} missing sourceId`);
     }
     if (!chain.chain[i].timestamp) {
       errors.push(`Link ${i} missing timestamp`);
     }
   }
   
   return {
     valid: errors.length === 0,
     errors,
   };
 }