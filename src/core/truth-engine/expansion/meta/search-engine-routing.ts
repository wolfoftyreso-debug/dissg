/**
 * SEARCH ENGINE ROUTING
 * 
 * STEG 19: SEARCH ENGINE-SPECIFIK ROUTING
 * 
 * Exponerar olika frågeytor till olika sökmotorer
 * men alla pekar till samma Canonical Question.
 */

import type { ExposureTarget } from './visibility-engine';

/**
 * SEARCH ENGINE PROFILE
 * Characteristics of each search engine
 */
export interface SearchEngineProfile {
  readonly engine_id: ExposureTarget;
  readonly name: string;
  readonly type: 'traditional' | 'ai_integrated' | 'ai_native';
  
  // Preferences
  readonly prefers: {
    readonly direct_answers: boolean;
    readonly structured_data: boolean;
    readonly long_form: boolean;
    readonly citations: boolean;
    readonly paa_format: boolean;  // People Also Ask
  };
  
  // Query patterns
  readonly typical_query_length: 'short' | 'medium' | 'long' | 'natural';
  readonly supports_conversational: boolean;
  
  // Technical
  readonly respects_canonical: boolean;
  readonly citation_format: 'url' | 'structured' | 'inline';
  readonly max_snippet_length: number;
}

/**
 * SEARCH ENGINE PROFILES
 */
export const SEARCH_ENGINE_PROFILES: Record<string, SearchEngineProfile> = {
  google: {
    engine_id: 'google',
    name: 'Google Search',
    type: 'traditional',
    prefers: {
      direct_answers: true,
      structured_data: true,
      long_form: false,
      citations: false,
      paa_format: true,
    },
    typical_query_length: 'short',
    supports_conversational: false,
    respects_canonical: true,
    citation_format: 'url',
    max_snippet_length: 160,
  },
  
  bing: {
    engine_id: 'bing',
    name: 'Bing / Copilot',
    type: 'ai_integrated',
    prefers: {
      direct_answers: true,
      structured_data: true,
      long_form: true,
      citations: true,
      paa_format: true,
    },
    typical_query_length: 'medium',
    supports_conversational: true,
    respects_canonical: true,
    citation_format: 'structured',
    max_snippet_length: 300,
  },
  
  perplexity: {
    engine_id: 'perplexity',
    name: 'Perplexity AI',
    type: 'ai_native',
    prefers: {
      direct_answers: true,
      structured_data: true,
      long_form: true,
      citations: true,
      paa_format: false,
    },
    typical_query_length: 'natural',
    supports_conversational: true,
    respects_canonical: true,
    citation_format: 'inline',
    max_snippet_length: 500,
  },
};

/**
 * ROUTING RULE
 * How to route a question to a specific engine
 */
export interface RoutingRule {
  readonly engine_id: string;
  readonly expose_variants: number;      // How many variants to expose
  readonly canonical_priority: boolean;  // Prioritize canonical form
  readonly include_paa: boolean;         // Include PAA-formatted variants
  readonly structured_data_type: 'none' | 'faq' | 'howto' | 'qna';
  readonly max_exposure: number;         // Maximum URLs to expose
}

/**
 * DEFAULT ROUTING RULES
 */
export const DEFAULT_ROUTING_RULES: Record<string, RoutingRule> = {
  google: {
    engine_id: 'google',
    expose_variants: 50,
    canonical_priority: true,
    include_paa: true,
    structured_data_type: 'faq',
    max_exposure: 100,
  },
  
  bing: {
    engine_id: 'bing',
    expose_variants: 80,
    canonical_priority: true,
    include_paa: true,
    structured_data_type: 'qna',
    max_exposure: 150,
  },
  
  perplexity: {
    engine_id: 'perplexity',
    expose_variants: 100,
    canonical_priority: true,
    include_paa: false,
    structured_data_type: 'none',
    max_exposure: 200,
  },
};

/**
 * ROUTED QUESTION
 * A question formatted for a specific engine
 */
export interface RoutedQuestion {
  readonly question_id: string;
  readonly canonical_question_id: string;
  readonly target_engine: string;
  
  // URLs
  readonly canonical_url: string;
  readonly exposed_urls: string[];
  
  // Formatting
  readonly title: string;
  readonly meta_description: string;
  readonly structured_data: object | null;
  
  // PAA (People Also Ask)
  readonly paa_questions: string[];
  
  // Internal tracking
  readonly routing_rule_applied: string;
  readonly variants_exposed: number;
}

/**
 * SEARCH ENGINE ROUTER
 */
export class SearchEngineRouter {
  private routingRules: Map<string, RoutingRule> = new Map();
  private routedQuestions: Map<string, RoutedQuestion[]> = new Map();
  
  constructor(customRules?: Record<string, RoutingRule>) {
    // Initialize with default rules
    for (const [engine, rule] of Object.entries(DEFAULT_ROUTING_RULES)) {
      this.routingRules.set(engine, rule);
    }
    
    // Apply custom overrides
    if (customRules) {
      for (const [engine, rule] of Object.entries(customRules)) {
        this.routingRules.set(engine, rule);
      }
    }
  }
  
  /**
   * Route a question to all applicable engines
   */
  routeQuestion(
    questionId: string,
    canonicalUrl: string,
    variants: string[],
    paaQuestions: string[],
    targetEngines: string[]
  ): RoutedQuestion[] {
    const routed: RoutedQuestion[] = [];
    
    for (const engine of targetEngines) {
      const rule = this.routingRules.get(engine);
      if (!rule) continue;
      
      const profile = SEARCH_ENGINE_PROFILES[engine];
      if (!profile) continue;
      
      const routedQuestion = this.createRoutedQuestion(
        questionId,
        canonicalUrl,
        variants,
        paaQuestions,
        engine,
        rule,
        profile
      );
      
      routed.push(routedQuestion);
    }
    
    this.routedQuestions.set(questionId, routed);
    return routed;
  }
  
  /**
   * Create a routed question for a specific engine
   */
  private createRoutedQuestion(
    questionId: string,
    canonicalUrl: string,
    variants: string[],
    paaQuestions: string[],
    engine: string,
    rule: RoutingRule,
    profile: SearchEngineProfile
  ): RoutedQuestion {
    // Select variants to expose
    const exposedVariants = variants.slice(0, rule.expose_variants);
    
    // Create URLs for variants
    const exposedUrls = [canonicalUrl];
    for (const variant of exposedVariants) {
      const variantSlug = variant.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      exposedUrls.push(`${canonicalUrl}?q=${variantSlug}`);
    }
    
    // Limit to max exposure
    const limitedUrls = exposedUrls.slice(0, rule.max_exposure);
    
    // Create structured data if needed
    const structuredData = rule.structured_data_type !== 'none'
      ? this.createStructuredData(questionId, rule.structured_data_type, paaQuestions)
      : null;
    
    // Select PAA questions based on rule
    const selectedPaa = rule.include_paa ? paaQuestions.slice(0, 5) : [];
    
    return {
      question_id: questionId,
      canonical_question_id: questionId.split('-variant')[0],
      target_engine: engine,
      canonical_url: canonicalUrl,
      exposed_urls: limitedUrls,
      title: this.createTitle(questionId, profile),
      meta_description: this.createMetaDescription(questionId, profile),
      structured_data: structuredData,
      paa_questions: selectedPaa,
      routing_rule_applied: rule.engine_id,
      variants_exposed: exposedVariants.length,
    };
  }
  
  /**
   * Create structured data
   */
  private createStructuredData(
    questionId: string,
    type: 'faq' | 'howto' | 'qna',
    paaQuestions: string[]
  ): object {
    switch (type) {
      case 'faq':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': paaQuestions.slice(0, 5).map(q => ({
            '@type': 'Question',
            'name': q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `See full answer at canonical URL for ${questionId}`,
            },
          })),
        };
      
      case 'qna':
        return {
          '@context': 'https://schema.org',
          '@type': 'QAPage',
          'mainEntity': {
            '@type': 'Question',
            'name': questionId,
            'answerCount': 1,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Verified statistical answer',
            },
          },
        };
      
      case 'howto':
        return {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          'name': `Understanding ${questionId}`,
          'step': [
            { '@type': 'HowToStep', 'text': 'View current data' },
            { '@type': 'HowToStep', 'text': 'Compare across regions' },
            { '@type': 'HowToStep', 'text': 'Analyze trends' },
          ],
        };
    }
  }
  
  /**
   * Create optimized title
   */
  private createTitle(questionId: string, profile: SearchEngineProfile): string {
    // Format based on engine preferences
    const baseTitle = questionId.replace(/-/g, ' ').replace(/Q /i, '');
    
    if (profile.max_snippet_length <= 160) {
      // Short title for Google
      return baseTitle.slice(0, 55) + ' | Global Index';
    }
    
    return baseTitle + ' - Verified Data & Statistics | Global Index';
  }
  
  /**
   * Create optimized meta description
   */
  private createMetaDescription(questionId: string, profile: SearchEngineProfile): string {
    const maxLength = Math.min(profile.max_snippet_length, 160);
    const base = `Verified answer with data from official sources. Updated regularly. `;
    
    return (base + questionId.replace(/-/g, ' ')).slice(0, maxLength);
  }
  
  /**
   * Get all routed questions for an engine
   */
  getRoutedForEngine(engine: string): RoutedQuestion[] {
    const results: RoutedQuestion[] = [];
    
    for (const questions of this.routedQuestions.values()) {
      for (const q of questions) {
        if (q.target_engine === engine) {
          results.push(q);
        }
      }
    }
    
    return results;
  }
  
  /**
   * Get routing statistics
   */
  getStats(): SearchRoutingStats {
    const byEngine: Record<string, number> = {};
    let totalRouted = 0;
    let totalUrls = 0;
    
    for (const questions of this.routedQuestions.values()) {
      for (const q of questions) {
        byEngine[q.target_engine] = (byEngine[q.target_engine] || 0) + 1;
        totalRouted++;
        totalUrls += q.exposed_urls.length;
      }
    }
    
    return {
      total_questions_routed: this.routedQuestions.size,
      total_engine_routings: totalRouted,
      total_urls_exposed: totalUrls,
      by_engine: byEngine,
    };
  }
}

/**
 * Routing Statistics
 */
export interface SearchRoutingStats {
  readonly total_questions_routed: number;
  readonly total_engine_routings: number;
  readonly total_urls_exposed: number;
  readonly by_engine: Record<string, number>;
}

/**
 * ROUTING PRINCIPLES
 */
export const ROUTING_PRINCIPLES = {
  // Different surfaces, same answer
  different_surfaces_same_cq: true,
  
  // Elimination goals
  eliminates: {
    cannibalization: true,
    duplicate_content: true,
    ranking_conflicts: true,
  },
  
  // All URLs point to same canonical
  canonical_consistency: true,
  
  // Structured data for rich results
  structured_data_enabled: true,
} as const;

/**
 * Create a singleton router instance
 */
export function createSearchRouter(customRules?: Record<string, RoutingRule>): SearchEngineRouter {
  return new SearchEngineRouter(customRules);
}
