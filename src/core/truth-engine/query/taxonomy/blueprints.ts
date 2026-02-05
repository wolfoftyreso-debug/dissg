 /**
  * DECISION BLUEPRINTS
  * 
  * ~45 total blueprints that map all 1000 decision types.
  * Each blueprint defines the structure of a valid answer.
  */
 
 import type { DecisionBlueprint, DomainCode } from './types';
 
 // ============================================================================
 // CONSUMER BLUEPRINTS (A)
 // ============================================================================
 
 const CONSUMER_BLUEPRINTS: DecisionBlueprint[] = [
   {
     id: 'consumer_product_evaluation',
     domain: 'A_CONSUMER',
     name: 'Product Evaluation',
     description: 'Is X good? Should I buy X?',
     gravity: 'low',
     required_blocks: 50,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'short',
     reversibility: 'reversible',
     data_requirements: ['product_specs', 'user_reviews_aggregate', 'price_history'],
     forbidden_outputs: ['affiliate_links', 'sponsored_content'],
   },
   {
     id: 'consumer_comparison',
     domain: 'A_CONSUMER',
     name: 'Product Comparison',
     description: 'X vs Y comparisons',
     gravity: 'low',
     required_blocks: 60,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'short',
     reversibility: 'reversible',
     data_requirements: ['product_specs_a', 'product_specs_b', 'price_comparison'],
     forbidden_outputs: ['ranking', 'best_choice_declaration'],
   },
   {
     id: 'consumer_value_assessment',
     domain: 'A_CONSUMER',
     name: 'Value Assessment',
     description: 'Is X worth the money?',
     gravity: 'medium',
     required_blocks: 45,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'medium',
     reversibility: 'reversible',
     data_requirements: ['price_history', 'resale_value', 'longevity_data'],
     forbidden_outputs: ['buy_recommendation'],
   },
   {
     id: 'consumer_problem_identification',
     domain: 'A_CONSUMER',
     name: 'Problem Identification',
     description: 'Problems with X, issues, complaints',
     gravity: 'low',
     required_blocks: 40,
     alternatives_required: false,
     uncertainty_required: true,
     time_horizon: 'immediate',
     reversibility: 'reversible',
     data_requirements: ['complaint_aggregates', 'recall_data', 'warranty_claims'],
     forbidden_outputs: ['legal_advice'],
   },
   {
     id: 'consumer_alternative_search',
     domain: 'A_CONSUMER',
     name: 'Alternative Search',
     description: 'Alternatives to X',
     gravity: 'low',
     required_blocks: 55,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'short',
     reversibility: 'reversible',
     data_requirements: ['category_products', 'feature_matrix'],
     forbidden_outputs: ['best_alternative_declaration'],
   },
 ];
 
 // ============================================================================
 // VEHICLE BLUEPRINTS (B)
 // ============================================================================
 
 const VEHICLE_BLUEPRINTS: DecisionBlueprint[] = [
   {
     id: 'vehicle_reliability_evaluation',
     domain: 'B_VEHICLES',
     name: 'Reliability Evaluation',
     description: 'Is this car reliable?',
     gravity: 'medium',
     required_blocks: 65,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'partially_reversible',
     data_requirements: ['reliability_ratings', 'recall_history', 'owner_surveys'],
     forbidden_outputs: ['buy_recommendation'],
   },
   {
     id: 'vehicle_comparison',
     domain: 'B_VEHICLES',
     name: 'Vehicle Comparison',
     description: 'EV vs hybrid vs ICE, Model A vs Model B',
     gravity: 'medium',
     required_blocks: 70,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'partially_reversible',
     data_requirements: ['vehicle_specs', 'running_costs', 'resale_projections'],
     forbidden_outputs: ['winner_declaration'],
   },
   {
     id: 'vehicle_cost_of_ownership',
     domain: 'B_VEHICLES',
     name: 'Cost of Ownership',
     description: 'Total cost analysis over time',
     gravity: 'medium',
     required_blocks: 60,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'reversible',
     data_requirements: ['depreciation_curves', 'maintenance_costs', 'fuel_costs', 'insurance_rates'],
     forbidden_outputs: ['financial_advice'],
   },
   {
     id: 'vehicle_problem_identification',
     domain: 'B_VEHICLES',
     name: 'Common Issues',
     description: 'Problems and common issues with specific models',
     gravity: 'low',
     required_blocks: 45,
     alternatives_required: false,
     uncertainty_required: true,
     time_horizon: 'immediate',
     reversibility: 'reversible',
     data_requirements: ['recall_data', 'tsb_data', 'owner_complaints'],
     forbidden_outputs: ['legal_advice'],
   },
   {
     id: 'vehicle_type_selection',
     domain: 'B_VEHICLES',
     name: 'Type Selection',
     description: 'Best option for usage profile',
     gravity: 'medium',
     required_blocks: 55,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'partially_reversible',
     data_requirements: ['usage_scenarios', 'vehicle_categories', 'cost_projections'],
     forbidden_outputs: ['definitive_recommendation'],
   },
 ];
 
 // ============================================================================
 // HOUSING BLUEPRINTS (C)
 // ============================================================================
 
 const HOUSING_BLUEPRINTS: DecisionBlueprint[] = [
   {
     id: 'housing_buy_vs_rent',
     domain: 'C_HOUSING',
     name: 'Buy vs Rent',
     description: 'Rent or buy decision analysis',
     gravity: 'critical',
     required_blocks: 80,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'partially_reversible',
     data_requirements: ['local_prices', 'rent_levels', 'interest_rates', 'tax_rules'],
     forbidden_outputs: ['financial_advice', 'definitive_recommendation'],
   },
   {
     id: 'housing_area_evaluation',
     domain: 'C_HOUSING',
     name: 'Area Evaluation',
     description: 'Is this a good area? Safety, amenities, trends',
     gravity: 'high',
     required_blocks: 70,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'partially_reversible',
     data_requirements: ['crime_stats', 'school_ratings', 'transport_access', 'price_trends'],
     forbidden_outputs: ['safety_guarantee', 'investment_advice'],
   },
   {
     id: 'housing_type_comparison',
     domain: 'C_HOUSING',
     name: 'Housing Type Comparison',
     description: 'House vs apartment analysis',
     gravity: 'high',
     required_blocks: 65,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'partially_reversible',
     data_requirements: ['ownership_costs', 'maintenance_requirements', 'appreciation_data'],
     forbidden_outputs: ['definitive_recommendation'],
   },
   {
     id: 'housing_renovation_decision',
     domain: 'C_HOUSING',
     name: 'Renovate vs Move',
     description: 'Should I renovate or relocate?',
     gravity: 'high',
     required_blocks: 60,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'medium',
     reversibility: 'partially_reversible',
     data_requirements: ['renovation_costs', 'local_market', 'moving_costs'],
     forbidden_outputs: ['definitive_recommendation'],
   },
   {
     id: 'housing_mortgage_risk',
     domain: 'C_HOUSING',
     name: 'Mortgage Risk',
     description: 'Risk scenarios for mortgage decisions',
     gravity: 'critical',
     required_blocks: 75,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'irreversible',
     data_requirements: ['interest_rate_scenarios', 'income_stability', 'market_scenarios'],
     forbidden_outputs: ['financial_advice', 'prediction'],
   },
 ];
 
 // ============================================================================
 // FINANCE BLUEPRINTS (D)
 // ============================================================================
 
 const FINANCE_BLUEPRINTS: DecisionBlueprint[] = [
   {
     id: 'finance_investment_evaluation',
     domain: 'D_FINANCE',
     name: 'Investment Evaluation',
     description: 'Is X a good investment? Historical analysis only.',
     gravity: 'high',
     required_blocks: 70,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'reversible',
     data_requirements: ['historical_returns', 'volatility', 'fee_structure'],
     forbidden_outputs: ['investment_advice', 'prediction', 'recommendation'],
   },
   {
     id: 'finance_debt_vs_invest',
     domain: 'D_FINANCE',
     name: 'Debt vs Invest',
     description: 'Pay off debt or invest analysis',
     gravity: 'high',
     required_blocks: 65,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'reversible',
     data_requirements: ['interest_rates', 'expected_returns_historical', 'tax_implications'],
     forbidden_outputs: ['financial_advice', 'recommendation'],
   },
   {
     id: 'finance_risk_assessment',
     domain: 'D_FINANCE',
     name: 'Risk Assessment',
     description: 'Risk profile of investment types',
     gravity: 'high',
     required_blocks: 60,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'reversible',
     data_requirements: ['volatility_history', 'drawdown_data', 'correlation_matrix'],
     forbidden_outputs: ['risk_rating', 'suitability_advice'],
   },
   {
     id: 'finance_return_expectation',
     domain: 'D_FINANCE',
     name: 'Return Expectation',
     description: 'Historical return patterns - NOT predictions',
     gravity: 'high',
     required_blocks: 55,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'reversible',
     data_requirements: ['historical_returns', 'rolling_returns', 'distribution_data'],
     forbidden_outputs: ['prediction', 'expected_future_returns'],
   },
   {
     id: 'finance_allocation_strategy',
     domain: 'D_FINANCE',
     name: 'Allocation Overview',
     description: 'Historical asset allocation patterns',
     gravity: 'high',
     required_blocks: 65,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'long',
     reversibility: 'reversible',
     data_requirements: ['allocation_models', 'historical_performance', 'rebalancing_data'],
     forbidden_outputs: ['recommendation', 'optimal_allocation'],
   },
 ];
 
 // ============================================================================
 // HEALTH BLUEPRINTS (F) - STRICTLY NON-DIAGNOSTIC
 // ============================================================================
 
 const HEALTH_BLUEPRINTS: DecisionBlueprint[] = [
   {
     id: 'health_normality_check',
     domain: 'F_HEALTH',
     name: 'Normality Check',
     description: 'Is this normal? Population prevalence only.',
     gravity: 'medium',
     required_blocks: 45,
     alternatives_required: false,
     uncertainty_required: true,
     time_horizon: 'immediate',
     reversibility: 'reversible',
     data_requirements: ['prevalence_data', 'population_studies'],
     forbidden_outputs: ['diagnosis', 'treatment', 'medical_advice'],
   },
   {
     id: 'health_prevalence_query',
     domain: 'F_HEALTH',
     name: 'Prevalence Query',
     description: 'How common is X? Statistical only.',
     gravity: 'medium',
     required_blocks: 40,
     alternatives_required: false,
     uncertainty_required: true,
     time_horizon: 'immediate',
     reversibility: 'reversible',
     data_requirements: ['prevalence_studies', 'demographic_data'],
     forbidden_outputs: ['diagnosis', 'treatment', 'individual_risk'],
   },
   {
     id: 'health_risk_factor_info',
     domain: 'F_HEALTH',
     name: 'Risk Factor Information',
     description: 'Known risk factors - population level only',
     gravity: 'medium',
     required_blocks: 50,
     alternatives_required: false,
     uncertainty_required: true,
     time_horizon: 'immediate',
     reversibility: 'reversible',
     data_requirements: ['epidemiological_studies', 'risk_factor_data'],
     forbidden_outputs: ['diagnosis', 'personal_risk_assessment', 'treatment'],
   },
   {
     id: 'health_when_to_seek_help',
     domain: 'F_HEALTH',
     name: 'When to Seek Help',
     description: 'General guidance on seeking professional help',
     gravity: 'high',
     required_blocks: 35,
     alternatives_required: false,
     uncertainty_required: true,
     time_horizon: 'immediate',
     reversibility: 'reversible',
     data_requirements: ['clinical_guidelines', 'referral_criteria'],
     forbidden_outputs: ['diagnosis', 'treatment', 'urgency_assessment'],
   },
 ];
 
 // ============================================================================
 // META BLUEPRINTS (N)
 // ============================================================================
 
 const META_BLUEPRINTS: DecisionBlueprint[] = [
   {
     id: 'meta_comparison_framework',
     domain: 'N_META',
     name: 'Comparison Framework',
     description: 'How to decide between X and Y',
     gravity: 'low',
     required_blocks: 40,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'immediate',
     reversibility: 'reversible',
     data_requirements: ['decision_frameworks', 'criteria_templates'],
     forbidden_outputs: ['definitive_answer'],
   },
   {
     id: 'meta_risk_evaluation',
     domain: 'N_META',
     name: 'Risk Evaluation Method',
     description: 'How to evaluate risk in decisions',
     gravity: 'low',
     required_blocks: 45,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'immediate',
     reversibility: 'reversible',
     data_requirements: ['risk_frameworks', 'evaluation_methods'],
     forbidden_outputs: ['risk_rating'],
   },
   {
     id: 'meta_option_analysis',
     domain: 'N_META',
     name: 'Option Analysis',
     description: 'How to compare options systematically',
     gravity: 'low',
     required_blocks: 40,
     alternatives_required: true,
     uncertainty_required: true,
     time_horizon: 'immediate',
     reversibility: 'reversible',
     data_requirements: ['analysis_frameworks', 'comparison_templates'],
     forbidden_outputs: ['best_option'],
   },
 ];
 
 // ============================================================================
 // ALL BLUEPRINTS REGISTRY
 // ============================================================================
 
 export const ALL_BLUEPRINTS: readonly DecisionBlueprint[] = [
   ...CONSUMER_BLUEPRINTS,
   ...VEHICLE_BLUEPRINTS,
   ...HOUSING_BLUEPRINTS,
   ...FINANCE_BLUEPRINTS,
   ...HEALTH_BLUEPRINTS,
   ...META_BLUEPRINTS,
 ] as const;
 
 // ============================================================================
 // BLUEPRINT HELPERS
 // ============================================================================
 
 export function getBlueprint(id: string): DecisionBlueprint | undefined {
   return ALL_BLUEPRINTS.find(b => b.id === id);
 }
 
 export function getBlueprintsByDomain(domain: DomainCode): DecisionBlueprint[] {
   return ALL_BLUEPRINTS.filter(b => b.domain === domain);
 }
 
 export function getBlueprintsByGravity(gravity: DecisionBlueprint['gravity']): DecisionBlueprint[] {
   return ALL_BLUEPRINTS.filter(b => b.gravity === gravity);
 }
 
 export function getCriticalBlueprints(): DecisionBlueprint[] {
   return ALL_BLUEPRINTS.filter(b => b.gravity === 'critical' || b.gravity === 'high');
 }