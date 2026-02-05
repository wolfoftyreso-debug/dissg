 /**
  * QUERY TAXONOMY TYPES
  * 
  * Core type definitions for the decision-first query system.
  */
 
 // ============================================================================
 // DOMAIN CODES (14 locked domains)
 // ============================================================================
 
 export type DomainCode =
   | 'A_CONSUMER'      // Consumer Products (~180)
   | 'B_VEHICLES'      // Vehicles & Transport (~120)
   | 'C_HOUSING'       // Housing & Real Estate (~90)
   | 'D_FINANCE'       // Personal Finance (~110)
   | 'E_CAREER'        // Career & Education (~70)
   | 'F_HEALTH'        // Health (Non-diagnostic) (~80)
   | 'G_FAMILY'        // Family & Life Decisions (~60)
   | 'H_TECHNOLOGY'    // Technology & Tools (~70)
   | 'I_ENERGY'        // Energy & Environment (~40)
   | 'J_BUSINESS'      // Small Business (~50)
   | 'K_POLICY'        // Policy & Society (Read-only) (~40)
   | 'L_LEGAL'         // Legal / Compliance (Light) (~30)
   | 'M_TRAVEL'        // Travel & Living (~30)
   | 'N_META';         // Meta-decisions (~30)
 
 // ============================================================================
 // GRAVITY LEVELS
 // ============================================================================
 
 export type DecisionGravity = 'low' | 'medium' | 'high' | 'critical';
 
 // ============================================================================
 // DECISION BLUEPRINT
 // ============================================================================
 
 export interface DecisionBlueprint {
   readonly id: string;
   readonly domain: DomainCode;
   readonly name: string;
   readonly description: string;
   readonly gravity: DecisionGravity;
   readonly required_blocks: number;
   readonly alternatives_required: boolean;
   readonly uncertainty_required: boolean;
   readonly time_horizon?: 'immediate' | 'short' | 'medium' | 'long';
   readonly reversibility: 'reversible' | 'partially_reversible' | 'irreversible';
   readonly data_requirements: readonly string[];
   readonly forbidden_outputs: readonly string[];
 }
 
 // ============================================================================
 // DECISION TYPE
 // ============================================================================
 
 export interface DecisionType {
   readonly id: string;
   readonly domain: DomainCode;
   readonly blueprint_id: string;
   readonly canonical_form: string;
   readonly variants: readonly string[];
   readonly intent_keywords: readonly string[];
   readonly volume_estimate: 'low' | 'medium' | 'high' | 'very_high';
   readonly requires_personalization: boolean;
   readonly minimum_cdp_count: number;
 }
 
 // ============================================================================
 // DOMAIN DEFINITION
 // ============================================================================
 
 export interface DomainDefinition {
   readonly code: DomainCode;
   readonly name: string;
   readonly name_sv: string;
   readonly description: string;
   readonly estimated_decision_types: number;
   readonly safety_level: 'open' | 'guarded' | 'restricted';
   readonly blueprints: readonly string[];
 }
 
 // ============================================================================
 // QUERY CLASSIFICATION RESULT
 // ============================================================================
 
 export interface QueryClassification {
   readonly original_query: string;
   readonly normalized_query: string;
   readonly domain: DomainCode;
   readonly decision_type_id: string;
   readonly blueprint_id: string;
   readonly confidence: number;
   readonly intent_signals: readonly string[];
   readonly alternative_classifications?: readonly QueryClassification[];
 }
 
 // ============================================================================
 // TAXONOMY STATS
 // ============================================================================
 
 export interface TaxonomyStats {
   readonly total_domains: number;
   readonly total_blueprints: number;
   readonly total_decision_types: number;
   readonly coverage_by_domain: Record<DomainCode, number>;
 }