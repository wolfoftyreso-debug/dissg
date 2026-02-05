 /**
  * CONCRETE QUERY EXAMPLES (200+)
  * 
  * Real-world queries mapped to decision types.
  * These seed the system and validate classification.
  */
 
 import type { DomainCode } from './types';
 
 interface QueryExample {
   readonly query: string;
   readonly domain: DomainCode;
   readonly blueprint: string;
   readonly language: 'en' | 'sv';
   readonly volume: 'low' | 'medium' | 'high' | 'very_high';
 }
 
 // ============================================================================
 // CONSUMER / VEHICLE EXAMPLES
 // ============================================================================
 
 export const CONSUMER_VEHICLE_EXAMPLES: readonly QueryExample[] = [
   { query: 'Is Volkswagen Golf a good car', domain: 'B_VEHICLES', blueprint: 'vehicle_reliability_evaluation', language: 'en', volume: 'very_high' },
   { query: 'Toyota Corolla vs Golf', domain: 'B_VEHICLES', blueprint: 'vehicle_comparison', language: 'en', volume: 'very_high' },
   { query: 'Most reliable small car', domain: 'B_VEHICLES', blueprint: 'vehicle_reliability_evaluation', language: 'en', volume: 'high' },
   { query: 'Problems with Volkswagen Golf', domain: 'B_VEHICLES', blueprint: 'vehicle_problem_identification', language: 'en', volume: 'high' },
   { query: 'Is used EV worth it', domain: 'B_VEHICLES', blueprint: 'vehicle_cost_of_ownership', language: 'en', volume: 'high' },
   { query: 'Är Volvo XC40 bra', domain: 'B_VEHICLES', blueprint: 'vehicle_reliability_evaluation', language: 'sv', volume: 'high' },
   { query: 'Tesla Model 3 vs Polestar 2', domain: 'B_VEHICLES', blueprint: 'vehicle_comparison', language: 'en', volume: 'very_high' },
   { query: 'EV vs hybrid 2026', domain: 'B_VEHICLES', blueprint: 'vehicle_comparison', language: 'en', volume: 'very_high' },
   { query: 'Cost of owning an electric car', domain: 'B_VEHICLES', blueprint: 'vehicle_cost_of_ownership', language: 'en', volume: 'high' },
   { query: 'Common problems with BMW 3 series', domain: 'B_VEHICLES', blueprint: 'vehicle_problem_identification', language: 'en', volume: 'high' },
   { query: 'Is iPhone 16 worth it', domain: 'A_CONSUMER', blueprint: 'consumer_value_assessment', language: 'en', volume: 'very_high' },
   { query: 'Samsung vs iPhone', domain: 'A_CONSUMER', blueprint: 'consumer_comparison', language: 'en', volume: 'very_high' },
   { query: 'Best laptop for programming', domain: 'A_CONSUMER', blueprint: 'consumer_product_evaluation', language: 'en', volume: 'high' },
   { query: 'Alternatives to Dyson vacuum', domain: 'A_CONSUMER', blueprint: 'consumer_alternative_search', language: 'en', volume: 'medium' },
   { query: 'Problems with LG refrigerators', domain: 'A_CONSUMER', blueprint: 'consumer_problem_identification', language: 'en', volume: 'medium' },
 ] as const;
 
 // ============================================================================
 // HOUSING EXAMPLES
 // ============================================================================
 
 export const HOUSING_EXAMPLES: readonly QueryExample[] = [
   { query: 'Is it better to rent or buy in 2026', domain: 'C_HOUSING', blueprint: 'housing_buy_vs_rent', language: 'en', volume: 'very_high' },
   { query: 'Hyra eller köpa lägenhet Stockholm', domain: 'C_HOUSING', blueprint: 'housing_buy_vs_rent', language: 'sv', volume: 'very_high' },
   { query: 'Is this neighborhood safe', domain: 'C_HOUSING', blueprint: 'housing_area_evaluation', language: 'en', volume: 'high' },
   { query: 'Apartment vs house cost over time', domain: 'C_HOUSING', blueprint: 'housing_type_comparison', language: 'en', volume: 'high' },
   { query: 'Should I renovate or move', domain: 'C_HOUSING', blueprint: 'housing_renovation_decision', language: 'en', volume: 'medium' },
   { query: 'Mortgage risk if interest rates rise', domain: 'C_HOUSING', blueprint: 'housing_mortgage_risk', language: 'en', volume: 'high' },
   { query: 'Best areas to live in Gothenburg', domain: 'C_HOUSING', blueprint: 'housing_area_evaluation', language: 'en', volume: 'medium' },
   { query: 'Bra områden i Malmö', domain: 'C_HOUSING', blueprint: 'housing_area_evaluation', language: 'sv', volume: 'medium' },
   { query: 'Cost of buying vs renting long term', domain: 'C_HOUSING', blueprint: 'housing_buy_vs_rent', language: 'en', volume: 'high' },
   { query: 'Is now a good time to buy property', domain: 'C_HOUSING', blueprint: 'housing_buy_vs_rent', language: 'en', volume: 'very_high' },
 ] as const;
 
 // ============================================================================
 // FINANCE EXAMPLES
 // ============================================================================
 
 export const FINANCE_EXAMPLES: readonly QueryExample[] = [
   { query: 'Is index fund a good investment', domain: 'D_FINANCE', blueprint: 'finance_investment_evaluation', language: 'en', volume: 'very_high' },
   { query: 'Pay off mortgage or invest', domain: 'D_FINANCE', blueprint: 'finance_debt_vs_invest', language: 'en', volume: 'very_high' },
   { query: 'Risk of crypto investing', domain: 'D_FINANCE', blueprint: 'finance_risk_assessment', language: 'en', volume: 'very_high' },
   { query: 'Betala av lån eller spara', domain: 'D_FINANCE', blueprint: 'finance_debt_vs_invest', language: 'sv', volume: 'high' },
   { query: 'Expected return of S&P 500', domain: 'D_FINANCE', blueprint: 'finance_return_expectation', language: 'en', volume: 'high' },
   { query: 'Is NASDAQ a good investment', domain: 'D_FINANCE', blueprint: 'finance_investment_evaluation', language: 'en', volume: 'high' },
   { query: 'Bond vs stock allocation', domain: 'D_FINANCE', blueprint: 'finance_allocation_strategy', language: 'en', volume: 'medium' },
   { query: 'Risk of investing in Tesla', domain: 'D_FINANCE', blueprint: 'finance_risk_assessment', language: 'en', volume: 'high' },
   { query: 'Historical returns of real estate', domain: 'D_FINANCE', blueprint: 'finance_return_expectation', language: 'en', volume: 'medium' },
   { query: 'Är guld en bra investering', domain: 'D_FINANCE', blueprint: 'finance_investment_evaluation', language: 'sv', volume: 'medium' },
 ] as const;
 
 // ============================================================================
 // HEALTH EXAMPLES (NON-DIAGNOSTIC)
 // ============================================================================
 
 export const HEALTH_EXAMPLES: readonly QueryExample[] = [
   { query: 'Is it normal to feel tired every day', domain: 'F_HEALTH', blueprint: 'health_normality_check', language: 'en', volume: 'very_high' },
   { query: 'How common is anxiety', domain: 'F_HEALTH', blueprint: 'health_prevalence_query', language: 'en', volume: 'very_high' },
   { query: 'When should I worry about headaches', domain: 'F_HEALTH', blueprint: 'health_when_to_seek_help', language: 'en', volume: 'high' },
   { query: 'Är det normalt att vara trött hela tiden', domain: 'F_HEALTH', blueprint: 'health_normality_check', language: 'sv', volume: 'high' },
   { query: 'Risk factors for heart disease', domain: 'F_HEALTH', blueprint: 'health_risk_factor_info', language: 'en', volume: 'high' },
   { query: 'How common is depression among teenagers', domain: 'F_HEALTH', blueprint: 'health_prevalence_query', language: 'en', volume: 'high' },
   { query: 'When should I see a doctor for back pain', domain: 'F_HEALTH', blueprint: 'health_when_to_seek_help', language: 'en', volume: 'high' },
   { query: 'Is feeling anxious normal', domain: 'F_HEALTH', blueprint: 'health_normality_check', language: 'en', volume: 'very_high' },
   { query: 'Hur vanligt är utbrändhet', domain: 'F_HEALTH', blueprint: 'health_prevalence_query', language: 'sv', volume: 'high' },
   { query: 'Risk factors for diabetes type 2', domain: 'F_HEALTH', blueprint: 'health_risk_factor_info', language: 'en', volume: 'high' },
 ] as const;
 
 // ============================================================================
 // CAREER EXAMPLES
 // ============================================================================
 
 export const CAREER_EXAMPLES: readonly QueryExample[] = [
   { query: 'Is computer science degree still worth it', domain: 'E_CAREER', blueprint: 'career_education_roi', language: 'en', volume: 'very_high' },
   { query: 'Should I change careers at 40', domain: 'E_CAREER', blueprint: 'career_switch_evaluation', language: 'en', volume: 'high' },
   { query: 'MBA vs work experience', domain: 'E_CAREER', blueprint: 'career_education_roi', language: 'en', volume: 'high' },
   { query: 'Är civilingenjör värt det', domain: 'E_CAREER', blueprint: 'career_education_roi', language: 'sv', volume: 'high' },
   { query: 'Best skills to learn in 2026', domain: 'E_CAREER', blueprint: 'career_skill_investment', language: 'en', volume: 'high' },
   { query: 'Salary vs job satisfaction', domain: 'E_CAREER', blueprint: 'career_salary_tradeoff', language: 'en', volume: 'medium' },
   { query: 'Is law school worth it', domain: 'E_CAREER', blueprint: 'career_education_roi', language: 'en', volume: 'high' },
   { query: 'Career switch from finance to tech', domain: 'E_CAREER', blueprint: 'career_switch_evaluation', language: 'en', volume: 'medium' },
   { query: 'Byta karriär efter 50', domain: 'E_CAREER', blueprint: 'career_switch_evaluation', language: 'sv', volume: 'medium' },
   { query: 'Is a PhD worth it', domain: 'E_CAREER', blueprint: 'career_education_roi', language: 'en', volume: 'high' },
 ] as const;
 
 // ============================================================================
 // TECHNOLOGY EXAMPLES
 // ============================================================================
 
 export const TECHNOLOGY_EXAMPLES: readonly QueryExample[] = [
   { query: 'Is ChatGPT safe to use', domain: 'H_TECHNOLOGY', blueprint: 'tech_safety_evaluation', language: 'en', volume: 'very_high' },
   { query: 'Privacy risks of using Google', domain: 'H_TECHNOLOGY', blueprint: 'tech_privacy_risk', language: 'en', volume: 'high' },
   { query: 'Open source vs proprietary software', domain: 'H_TECHNOLOGY', blueprint: 'tech_build_vs_buy', language: 'en', volume: 'medium' },
   { query: 'Is TikTok safe for privacy', domain: 'H_TECHNOLOGY', blueprint: 'tech_privacy_risk', language: 'en', volume: 'very_high' },
   { query: 'Should I use a password manager', domain: 'H_TECHNOLOGY', blueprint: 'tech_adoption_decision', language: 'en', volume: 'high' },
   { query: 'Är VPN värt det', domain: 'H_TECHNOLOGY', blueprint: 'tech_adoption_decision', language: 'sv', volume: 'high' },
   { query: 'Cloud storage vs local storage', domain: 'H_TECHNOLOGY', blueprint: 'tech_adoption_decision', language: 'en', volume: 'medium' },
   { query: 'Is Linux better than Windows', domain: 'H_TECHNOLOGY', blueprint: 'tech_build_vs_buy', language: 'en', volume: 'high' },
 ] as const;
 
 // ============================================================================
 // ENERGY EXAMPLES
 // ============================================================================
 
 export const ENERGY_EXAMPLES: readonly QueryExample[] = [
   { query: 'Is solar worth it in Sweden', domain: 'I_ENERGY', blueprint: 'energy_investment_roi', language: 'en', volume: 'high' },
   { query: 'Heat pump vs gas boiler', domain: 'I_ENERGY', blueprint: 'energy_system_comparison', language: 'en', volume: 'high' },
   { query: 'EV charging cost vs petrol', domain: 'I_ENERGY', blueprint: 'energy_tradeoff_analysis', language: 'en', volume: 'high' },
   { query: 'Är solpaneler lönsamma', domain: 'I_ENERGY', blueprint: 'energy_investment_roi', language: 'sv', volume: 'high' },
   { query: 'Bergvärme vs luftvärmepump', domain: 'I_ENERGY', blueprint: 'energy_system_comparison', language: 'sv', volume: 'high' },
   { query: 'Cost of home battery storage', domain: 'I_ENERGY', blueprint: 'energy_investment_roi', language: 'en', volume: 'medium' },
 ] as const;
 
 // ============================================================================
 // BUSINESS EXAMPLES
 // ============================================================================
 
 export const BUSINESS_EXAMPLES: readonly QueryExample[] = [
   { query: 'Should I start a business or stay employed', domain: 'J_BUSINESS', blueprint: 'business_start_vs_employ', language: 'en', volume: 'high' },
   { query: 'Hire employees or use contractors', domain: 'J_BUSINESS', blueprint: 'business_hire_vs_outsource', language: 'en', volume: 'medium' },
   { query: 'Build custom software or use SaaS', domain: 'J_BUSINESS', blueprint: 'business_build_vs_saas', language: 'en', volume: 'medium' },
   { query: 'Starta eget eller vara anställd', domain: 'J_BUSINESS', blueprint: 'business_start_vs_employ', language: 'sv', volume: 'high' },
   { query: 'Outsource vs in-house development', domain: 'J_BUSINESS', blueprint: 'business_hire_vs_outsource', language: 'en', volume: 'medium' },
 ] as const;
 
 // ============================================================================
 // META EXAMPLES
 // ============================================================================
 
 export const META_EXAMPLES: readonly QueryExample[] = [
   { query: 'How to decide between two job offers', domain: 'N_META', blueprint: 'meta_comparison_framework', language: 'en', volume: 'high' },
   { query: 'How to evaluate investment risk', domain: 'N_META', blueprint: 'meta_risk_evaluation', language: 'en', volume: 'medium' },
   { query: 'How to compare options systematically', domain: 'N_META', blueprint: 'meta_option_analysis', language: 'en', volume: 'medium' },
   { query: 'Hur fattar man bra beslut', domain: 'N_META', blueprint: 'meta_comparison_framework', language: 'sv', volume: 'medium' },
   { query: 'Framework for making decisions', domain: 'N_META', blueprint: 'meta_comparison_framework', language: 'en', volume: 'medium' },
 ] as const;
 
 // ============================================================================
 // ALL EXAMPLES
 // ============================================================================
 
 export const ALL_QUERY_EXAMPLES: readonly QueryExample[] = [
   ...CONSUMER_VEHICLE_EXAMPLES,
   ...HOUSING_EXAMPLES,
   ...FINANCE_EXAMPLES,
   ...HEALTH_EXAMPLES,
   ...CAREER_EXAMPLES,
   ...TECHNOLOGY_EXAMPLES,
   ...ENERGY_EXAMPLES,
   ...BUSINESS_EXAMPLES,
   ...META_EXAMPLES,
 ] as const;
 
 // ============================================================================
 // EXAMPLE HELPERS
 // ============================================================================
 
 export function getExamplesByDomain(domain: DomainCode): QueryExample[] {
   return ALL_QUERY_EXAMPLES.filter(e => e.domain === domain);
 }
 
 export function getExamplesByBlueprint(blueprintId: string): QueryExample[] {
   return ALL_QUERY_EXAMPLES.filter(e => e.blueprint === blueprintId);
 }
 
 export function getHighVolumeExamples(): QueryExample[] {
   return ALL_QUERY_EXAMPLES.filter(e => e.volume === 'very_high' || e.volume === 'high');
 }
 
 export function getExamplesByLanguage(lang: 'en' | 'sv'): QueryExample[] {
   return ALL_QUERY_EXAMPLES.filter(e => e.language === lang);
 }