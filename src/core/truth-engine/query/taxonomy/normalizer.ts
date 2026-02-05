 /**
  * QUERY NORMALIZER
  * 
  * Transforms raw user queries into classified decision types.
  * 1 blueprint = 1,000,000 questions (via normalization)
  */
 
 import type { QueryClassification, DomainCode, DecisionType } from './types';
 import { TAXONOMY_DOMAINS } from './domains';
 import { getBlueprint, ALL_BLUEPRINTS } from './blueprints';
 
 // ============================================================================
 // INTENT PATTERNS
 // ============================================================================
 
 const INTENT_PATTERNS: Record<string, { domain: DomainCode; blueprint: string; weight: number }[]> = {
   // Consumer patterns
   'is .* good': [{ domain: 'A_CONSUMER', blueprint: 'consumer_product_evaluation', weight: 0.8 }],
   'should i buy': [{ domain: 'A_CONSUMER', blueprint: 'consumer_product_evaluation', weight: 0.9 }],
   'vs': [{ domain: 'A_CONSUMER', blueprint: 'consumer_comparison', weight: 0.7 }],
   'worth (the|it|my) money': [{ domain: 'A_CONSUMER', blueprint: 'consumer_value_assessment', weight: 0.85 }],
   'problems with': [{ domain: 'A_CONSUMER', blueprint: 'consumer_problem_identification', weight: 0.9 }],
   'issues with': [{ domain: 'A_CONSUMER', blueprint: 'consumer_problem_identification', weight: 0.85 }],
   'alternatives to': [{ domain: 'A_CONSUMER', blueprint: 'consumer_alternative_search', weight: 0.9 }],
   
   // Vehicle patterns
   'reliable car': [{ domain: 'B_VEHICLES', blueprint: 'vehicle_reliability_evaluation', weight: 0.9 }],
   'is .* reliable': [{ domain: 'B_VEHICLES', blueprint: 'vehicle_reliability_evaluation', weight: 0.85 }],
   'ev vs|hybrid vs|electric vs': [{ domain: 'B_VEHICLES', blueprint: 'vehicle_comparison', weight: 0.95 }],
   'cost of ownership': [{ domain: 'B_VEHICLES', blueprint: 'vehicle_cost_of_ownership', weight: 0.95 }],
   'common issues': [{ domain: 'B_VEHICLES', blueprint: 'vehicle_problem_identification', weight: 0.8 }],
   
   // Housing patterns
   'rent or buy|buy or rent': [{ domain: 'C_HOUSING', blueprint: 'housing_buy_vs_rent', weight: 0.95 }],
   'good (area|neighborhood|neighbourhood)': [{ domain: 'C_HOUSING', blueprint: 'housing_area_evaluation', weight: 0.9 }],
   'safe (area|neighborhood|neighbourhood)': [{ domain: 'C_HOUSING', blueprint: 'housing_area_evaluation', weight: 0.85 }],
   'house vs apartment': [{ domain: 'C_HOUSING', blueprint: 'housing_type_comparison', weight: 0.9 }],
   'renovate or move': [{ domain: 'C_HOUSING', blueprint: 'housing_renovation_decision', weight: 0.95 }],
   'mortgage risk': [{ domain: 'C_HOUSING', blueprint: 'housing_mortgage_risk', weight: 0.9 }],
   
   // Finance patterns
   'good investment': [{ domain: 'D_FINANCE', blueprint: 'finance_investment_evaluation', weight: 0.85 }],
   'pay off debt|debt or invest': [{ domain: 'D_FINANCE', blueprint: 'finance_debt_vs_invest', weight: 0.95 }],
   'risk of (investing|crypto|stock)': [{ domain: 'D_FINANCE', blueprint: 'finance_risk_assessment', weight: 0.9 }],
   'expected return': [{ domain: 'D_FINANCE', blueprint: 'finance_return_expectation', weight: 0.85 }],
   
   // Health patterns (NON-DIAGNOSTIC)
   'is it normal': [{ domain: 'F_HEALTH', blueprint: 'health_normality_check', weight: 0.9 }],
   'how common is': [{ domain: 'F_HEALTH', blueprint: 'health_prevalence_query', weight: 0.95 }],
   'risk factors for': [{ domain: 'F_HEALTH', blueprint: 'health_risk_factor_info', weight: 0.9 }],
   'when should i (see|visit|go to) (a |the )?(doctor|physician)': [{ domain: 'F_HEALTH', blueprint: 'health_when_to_seek_help', weight: 0.95 }],
   'should i worry': [{ domain: 'F_HEALTH', blueprint: 'health_when_to_seek_help', weight: 0.8 }],
   
   // Career patterns
   'worth it .* degree': [{ domain: 'E_CAREER', blueprint: 'career_education_roi', weight: 0.85 }],
   'change career': [{ domain: 'E_CAREER', blueprint: 'career_switch_evaluation', weight: 0.9 }],
   'switch career': [{ domain: 'E_CAREER', blueprint: 'career_switch_evaluation', weight: 0.9 }],
   
   // Meta patterns
   'how to decide': [{ domain: 'N_META', blueprint: 'meta_comparison_framework', weight: 0.95 }],
   'how to evaluate': [{ domain: 'N_META', blueprint: 'meta_risk_evaluation', weight: 0.9 }],
   'how to compare': [{ domain: 'N_META', blueprint: 'meta_option_analysis', weight: 0.9 }],
 };
 
 // ============================================================================
 // DOMAIN KEYWORDS
 // ============================================================================
 
 const DOMAIN_KEYWORDS: Record<DomainCode, readonly string[]> = {
   A_CONSUMER: ['product', 'buy', 'purchase', 'shop', 'brand', 'quality', 'review'],
   B_VEHICLES: ['car', 'vehicle', 'truck', 'suv', 'sedan', 'ev', 'electric', 'hybrid', 'motorcycle'],
   C_HOUSING: ['house', 'apartment', 'rent', 'mortgage', 'property', 'real estate', 'neighborhood'],
   D_FINANCE: ['invest', 'investment', 'stock', 'fund', 'crypto', 'savings', 'debt', 'loan'],
   E_CAREER: ['job', 'career', 'degree', 'salary', 'profession', 'education', 'skill'],
   F_HEALTH: ['health', 'symptom', 'normal', 'common', 'condition', 'doctor'],
   G_FAMILY: ['family', 'children', 'marriage', 'relationship', 'relocate', 'move'],
   H_TECHNOLOGY: ['software', 'app', 'tool', 'privacy', 'security', 'open source'],
   I_ENERGY: ['solar', 'energy', 'heat pump', 'electric', 'environment', 'charging'],
   J_BUSINESS: ['business', 'startup', 'hire', 'employee', 'outsource', 'saas'],
   K_POLICY: ['policy', 'regulation', 'law', 'government', 'tax'],
   L_LEGAL: ['legal', 'compliance', 'liability', 'contract', 'risk'],
   M_TRAVEL: ['country', 'abroad', 'visa', 'emigrate', 'relocate', 'cost of living'],
   N_META: ['decide', 'evaluate', 'compare', 'choose', 'option', 'framework'],
 };
 
 // ============================================================================
 // QUERY NORMALIZER
 // ============================================================================
 
 export class QueryNormalizer {
   /**
    * Normalize a raw query string
    */
   static normalize(query: string): string {
     return query
       .toLowerCase()
       .trim()
       .replace(/[^\w\s]/g, ' ')
       .replace(/\s+/g, ' ');
   }
 
   /**
    * Classify a query into a decision type
    */
   static classify(rawQuery: string): QueryClassification {
     const normalized = this.normalize(rawQuery);
     const intentSignals: string[] = [];
     
     // Find matching intent patterns
     let bestMatch: { domain: DomainCode; blueprint: string; confidence: number } | null = null;
     
     for (const [pattern, matches] of Object.entries(INTENT_PATTERNS)) {
       const regex = new RegExp(pattern, 'i');
       if (regex.test(normalized)) {
         for (const match of matches) {
           intentSignals.push(pattern);
           if (!bestMatch || match.weight > bestMatch.confidence) {
             bestMatch = {
               domain: match.domain,
               blueprint: match.blueprint,
               confidence: match.weight,
             };
           }
         }
       }
     }
     
     // Fallback: domain keyword matching
     if (!bestMatch) {
       const domainScore = this.scoreDomainKeywords(normalized);
       if (domainScore.domain && domainScore.score > 0) {
         const domainBlueprints = TAXONOMY_DOMAINS[domainScore.domain].blueprints;
         bestMatch = {
           domain: domainScore.domain,
           blueprint: domainBlueprints[0] || 'unknown',
           confidence: Math.min(domainScore.score * 0.3, 0.6),
         };
       }
     }
     
     // Final fallback
     if (!bestMatch) {
       bestMatch = {
         domain: 'N_META',
         blueprint: 'meta_comparison_framework',
         confidence: 0.1,
       };
     }
     
     return {
       original_query: rawQuery,
       normalized_query: normalized,
       domain: bestMatch.domain,
       decision_type_id: `${bestMatch.blueprint}:auto`,
       blueprint_id: bestMatch.blueprint,
       confidence: bestMatch.confidence,
       intent_signals: intentSignals,
     };
   }
 
   /**
    * Score domain keywords in a query
    */
   private static scoreDomainKeywords(query: string): { domain: DomainCode | null; score: number } {
     let bestDomain: DomainCode | null = null;
     let bestScore = 0;
     
     for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
       let score = 0;
       for (const keyword of keywords) {
         if (query.includes(keyword)) {
           score += 1;
         }
       }
       if (score > bestScore) {
         bestScore = score;
         bestDomain = domain as DomainCode;
       }
     }
     
     return { domain: bestDomain, score: bestScore };
   }
 
   /**
    * Batch classify multiple queries
    */
   static classifyBatch(queries: string[]): QueryClassification[] {
     return queries.map(q => this.classify(q));
   }
 
   /**
    * Get blueprint requirements for a classified query
    */
   static getBlueprintRequirements(classification: QueryClassification) {
     const blueprint = getBlueprint(classification.blueprint_id);
     if (!blueprint) {
       return null;
     }
     
     return {
       blueprint,
       canAnswer: classification.confidence >= 0.5,
       requiresMoreContext: classification.confidence < 0.7,
       dataNeeded: blueprint.data_requirements,
       forbidden: blueprint.forbidden_outputs,
     };
   }
 }
 
 // ============================================================================
 // TAXONOMY STATS
 // ============================================================================
 
 export function getTaxonomyStats() {
   const domains = Object.keys(TAXONOMY_DOMAINS) as DomainCode[];
   
   return {
     total_domains: domains.length,
     total_blueprints: ALL_BLUEPRINTS.length,
     total_decision_types: domains.reduce(
       (sum, d) => sum + TAXONOMY_DOMAINS[d].estimated_decision_types,
       0
     ),
     coverage_by_domain: domains.reduce(
       (acc, d) => ({ ...acc, [d]: TAXONOMY_DOMAINS[d].estimated_decision_types }),
       {} as Record<DomainCode, number>
     ),
   };
 }