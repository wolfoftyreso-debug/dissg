 /**
  * MASTER TAXONOMY - 14 LOCKED DOMAINS
  * 
  * Each domain contains decision patterns, not topics.
  * Total: ~1000 decision types
  */
 
 import type { DomainDefinition, DomainCode } from './types';
 
 // ============================================================================
 // DOMAIN DEFINITIONS
 // ============================================================================
 
 export const TAXONOMY_DOMAINS: Record<DomainCode, DomainDefinition> = {
   A_CONSUMER: {
     code: 'A_CONSUMER',
     name: 'Consumer Products',
     name_sv: 'Konsumentprodukter',
     description: 'Product evaluation, comparison, and purchase decisions',
     estimated_decision_types: 180,
     safety_level: 'open',
     blueprints: [
       'consumer_product_evaluation',
       'consumer_comparison',
       'consumer_value_assessment',
       'consumer_problem_identification',
       'consumer_alternative_search',
     ],
   },
 
   B_VEHICLES: {
     code: 'B_VEHICLES',
     name: 'Vehicles & Transport',
     name_sv: 'Fordon & Transport',
     description: 'Vehicle reliability, cost of ownership, and transport decisions',
     estimated_decision_types: 120,
     safety_level: 'open',
     blueprints: [
       'vehicle_reliability_evaluation',
       'vehicle_comparison',
       'vehicle_cost_of_ownership',
       'vehicle_problem_identification',
       'vehicle_type_selection',
     ],
   },
 
   C_HOUSING: {
     code: 'C_HOUSING',
     name: 'Housing & Real Estate',
     name_sv: 'Bostad & Fastigheter',
     description: 'Housing decisions, area evaluation, long-term commitments',
     estimated_decision_types: 90,
     safety_level: 'guarded',
     blueprints: [
       'housing_buy_vs_rent',
       'housing_area_evaluation',
       'housing_type_comparison',
       'housing_renovation_decision',
       'housing_mortgage_risk',
     ],
   },
 
   D_FINANCE: {
     code: 'D_FINANCE',
     name: 'Personal Finance',
     name_sv: 'Privatekonomi',
     description: 'Investment decisions, capital allocation, risk assessment',
     estimated_decision_types: 110,
     safety_level: 'guarded',
     blueprints: [
       'finance_investment_evaluation',
       'finance_debt_vs_invest',
       'finance_risk_assessment',
       'finance_return_expectation',
       'finance_allocation_strategy',
     ],
   },
 
   E_CAREER: {
     code: 'E_CAREER',
     name: 'Career & Education',
     name_sv: 'Karriär & Utbildning',
     description: 'Education investment, career path, skill development decisions',
     estimated_decision_types: 70,
     safety_level: 'open',
     blueprints: [
       'career_education_roi',
       'career_switch_evaluation',
       'career_skill_investment',
       'career_salary_tradeoff',
     ],
   },
 
   F_HEALTH: {
     code: 'F_HEALTH',
     name: 'Health (Non-diagnostic)',
     name_sv: 'Hälsa (Icke-diagnostisk)',
     description: 'Normality framing, prevalence, risk factors - NO diagnosis',
     estimated_decision_types: 80,
     safety_level: 'restricted',
     blueprints: [
       'health_normality_check',
       'health_prevalence_query',
       'health_risk_factor_info',
       'health_when_to_seek_help',
     ],
   },
 
   G_FAMILY: {
     code: 'G_FAMILY',
     name: 'Family & Life Decisions',
     name_sv: 'Familj & Livsbeslut',
     description: 'High-gravity life decisions: family, relocation, relationships',
     estimated_decision_types: 60,
     safety_level: 'guarded',
     blueprints: [
       'family_timing_decision',
       'family_relocation_decision',
       'family_relationship_evaluation',
     ],
   },
 
   H_TECHNOLOGY: {
     code: 'H_TECHNOLOGY',
     name: 'Technology & Tools',
     name_sv: 'Teknologi & Verktyg',
     description: 'Tool adoption, safety, privacy decisions',
     estimated_decision_types: 70,
     safety_level: 'open',
     blueprints: [
       'tech_safety_evaluation',
       'tech_privacy_risk',
       'tech_adoption_decision',
       'tech_build_vs_buy',
     ],
   },
 
   I_ENERGY: {
     code: 'I_ENERGY',
     name: 'Energy & Environment',
     name_sv: 'Energi & Miljö',
     description: 'Energy investment, environmental trade-offs',
     estimated_decision_types: 40,
     safety_level: 'open',
     blueprints: [
       'energy_investment_roi',
       'energy_system_comparison',
       'energy_tradeoff_analysis',
     ],
   },
 
   J_BUSINESS: {
     code: 'J_BUSINESS',
     name: 'Small Business',
     name_sv: 'Småföretag',
     description: 'Entrepreneurship, hiring, build vs buy decisions',
     estimated_decision_types: 50,
     safety_level: 'open',
     blueprints: [
       'business_start_vs_employ',
       'business_hire_vs_outsource',
       'business_build_vs_saas',
     ],
   },
 
   K_POLICY: {
     code: 'K_POLICY',
     name: 'Policy & Society (Read-only)',
     name_sv: 'Politik & Samhälle (Läs-läge)',
     description: 'Policy effectiveness, consequences - STRICTLY OBSERVATIONAL',
     estimated_decision_types: 40,
     safety_level: 'restricted',
     blueprints: [
       'policy_effectiveness_query',
       'policy_consequence_analysis',
       'policy_tradeoff_overview',
     ],
   },
 
   L_LEGAL: {
     code: 'L_LEGAL',
     name: 'Legal / Compliance (Light)',
     name_sv: 'Juridik / Efterlevnad (Lätt)',
     description: 'Risk exposure, compliance options - NO legal advice',
     estimated_decision_types: 30,
     safety_level: 'restricted',
     blueprints: [
       'legal_risk_exposure',
       'legal_compliance_options',
     ],
   },
 
   M_TRAVEL: {
     code: 'M_TRAVEL',
     name: 'Travel & Living',
     name_sv: 'Resor & Boende',
     description: 'Living abroad, cost vs quality of life, visa decisions',
     estimated_decision_types: 30,
     safety_level: 'open',
     blueprints: [
       'travel_relocation_evaluation',
       'travel_cost_quality_comparison',
       'travel_visa_options',
     ],
   },
 
   N_META: {
     code: 'N_META',
     name: 'Meta-decisions',
     name_sv: 'Metabeslut',
     description: 'How to decide, how to evaluate, how to compare',
     estimated_decision_types: 30,
     safety_level: 'open',
     blueprints: [
       'meta_comparison_framework',
       'meta_risk_evaluation',
       'meta_option_analysis',
     ],
   },
 } as const;
 
 // ============================================================================
 // DOMAIN HELPERS
 // ============================================================================
 
 export function getDomain(code: DomainCode): DomainDefinition {
   return TAXONOMY_DOMAINS[code];
 }
 
 export function getAllDomains(): DomainDefinition[] {
   return Object.values(TAXONOMY_DOMAINS);
 }
 
 export function getDomainsByCategory(safety: 'open' | 'guarded' | 'restricted'): DomainDefinition[] {
   return getAllDomains().filter(d => d.safety_level === safety);
 }
 
 export function getTotalEstimatedDecisionTypes(): number {
   return getAllDomains().reduce((sum, d) => sum + d.estimated_decision_types, 0);
 }