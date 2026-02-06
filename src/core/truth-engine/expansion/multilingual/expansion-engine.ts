/**
 * MULTILINGUAL EXPANSION ENGINE
 * 
 * STEG 20: KOORDINERAD FLERSPRÅKIG EXPANSION
 * 
 * 10M frågor × 10 språk = samma fakta, samma epistemik
 * Ni är inte "översatta" – ni är globala av konstruktion.
 */

import type { LanguageCode, MultilingualQuestion, LanguageVariant } from './language-layer';
import { 
  LANGUAGE_PRIORITY_ORDER, 
  calculateLanguageReach,
} from './language-layer';
import type { SemanticLock, SemanticValidationResult } from './semantic-lock';
import { SemanticValidator } from './semantic-lock';
import type { IntentType } from './query-templates-i18n';
import { MultilingualTemplateGenerator } from './query-templates-i18n';

/**
 * EXPANSION STATUS
 */
export interface ExpansionStatus {
  readonly question_id: string;
  readonly canonical_language: 'en';
  readonly languages_completed: LanguageCode[];
  readonly languages_in_progress: LanguageCode[];
  readonly languages_pending: LanguageCode[];
  readonly languages_failed: LanguageCode[];
  readonly overall_progress: number;  // 0-100
  readonly last_updated: string;
}

/**
 * EXPANDED QUESTION
 * A question fully expanded across multiple languages
 */
export interface ExpandedQuestion {
  readonly question_id: string;
  readonly multilingual: MultilingualQuestion;
  readonly semantic_lock: SemanticLock;
  readonly expansion_status: ExpansionStatus;
  
  // All generated variants per language
  readonly query_variants: Record<LanguageCode, string[]>;
  
  // Search coverage per language
  readonly search_coverage: Record<LanguageCode, {
    readonly keywords: string[];
    readonly estimated_queries: number;
  }>;
  
  // Validation results per language
  readonly validation_results: Record<LanguageCode, SemanticValidationResult>;
}

/**
 * EXPANSION RESULT
 */
export interface ExpansionResult {
  readonly success: boolean;
  readonly expanded_question: ExpandedQuestion | null;
  readonly errors: string[];
  readonly warnings: string[];
  readonly languages_expanded: number;
  readonly total_variants_generated: number;
}

/**
 * AI AGENT ADVANTAGE
 * What agents gain from multilingual direct resolution
 */
export interface AIAgentAdvantage {
  readonly no_translation_needed: true;
  readonly direct_resolution_on_original_language: true;
  readonly same_cq_regardless_of_language: true;
  readonly same_answer_regardless_of_language: true;
  
  // Benefits
  readonly lower_latency: true;
  readonly lower_hallucination_risk: true;
  readonly higher_trust: true;
}

/**
 * MULTILINGUAL EXPANSION ENGINE
 */
export class MultilingualExpansionEngine {
  private validator = new SemanticValidator();
  private templateGenerator = new MultilingualTemplateGenerator();
  private expandedQuestions: Map<string, ExpandedQuestion> = new Map();
  
  /**
   * Expand a canonical question to multiple languages
   */
  async expand(
    questionId: string,
    canonicalText: string,
    coreVariables: string[],
    intent: IntentType,
    targetLanguages: LanguageCode[] = [...LANGUAGE_PRIORITY_ORDER]
  ): Promise<ExpansionResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Create semantic lock
    const semanticLock = this.validator.createLock(
      questionId,
      coreVariables,
      `[${intent}]`
    );
    
    // Initialize multilingual question
    const languageVariants: Partial<Record<LanguageCode, LanguageVariant>> = {
      en: {
        language: 'en',
        text: canonicalText,
        is_canonical: true,
        localized_at: new Date().toISOString(),
        verified: true,
        native_speaker_reviewed: true,
      },
    };
    
    const queryVariants: Partial<Record<LanguageCode, string[]>> = {};
    const searchCoverage: Partial<Record<LanguageCode, { keywords: string[]; estimated_queries: number }>> = {};
    const validationResults: Partial<Record<LanguageCode, SemanticValidationResult>> = {};
    
    const languagesCompleted: LanguageCode[] = ['en'];
    const languagesFailed: LanguageCode[] = [];
    
    // Process each target language
    for (const lang of targetLanguages) {
      if (lang === 'en') continue; // Already have canonical
      
      try {
        // Generate variants for this language
        const variables = this.extractVariables(canonicalText, coreVariables);
        const variants = this.templateGenerator.generateVariants(lang, intent, variables);
        
        if (variants.length === 0) {
          warnings.push(`No templates available for ${lang}`);
          continue;
        }
        
        // Use first variant as main translation (in production, this would be verified)
        const mainVariant = variants[0];
        
        // Validate against semantic lock
        const validation = this.validator.validate(mainVariant, lang, semanticLock);
        validationResults[lang] = validation;
        
        if (!validation.valid) {
          warnings.push(`Semantic validation failed for ${lang}: ${validation.violations.map(v => v.description).join(', ')}`);
          languagesFailed.push(lang);
          continue;
        }
        
        // Add language variant
        languageVariants[lang] = {
          language: lang,
          text: mainVariant,
          is_canonical: false,
          localized_at: new Date().toISOString(),
          verified: validation.confidence >= 0.9,
          native_speaker_reviewed: false,
        };
        
        // Store all query variants
        queryVariants[lang] = variants;
        
        // Calculate search coverage
        const keywords = this.templateGenerator.getSearchKeywords(lang, intent);
        searchCoverage[lang] = {
          keywords,
          estimated_queries: variants.length * keywords.length,
        };
        
        languagesCompleted.push(lang);
        
      } catch (err) {
        errors.push(`Failed to expand to ${lang}: ${err}`);
        languagesFailed.push(lang);
      }
    }
    
    // Build expansion status
    const expansionStatus: ExpansionStatus = {
      question_id: questionId,
      canonical_language: 'en',
      languages_completed: languagesCompleted,
      languages_in_progress: [],
      languages_pending: targetLanguages.filter(l => !languagesCompleted.includes(l) && !languagesFailed.includes(l)),
      languages_failed: languagesFailed,
      overall_progress: Math.round((languagesCompleted.length / targetLanguages.length) * 100),
      last_updated: new Date().toISOString(),
    };
    
    // Build multilingual question
    const multilingualQuestion: MultilingualQuestion = {
      question_id: questionId,
      canonical_language: 'en',
      canonical_text: canonicalText,
      language_variants: languageVariants as Record<LanguageCode, LanguageVariant>,
      semantic_core: {
        core_variables: coreVariables,
        intent_type: intent,
        domain: this.extractDomain(questionId),
        entity_scope: this.extractEntityScope(coreVariables),
      },
      languages_available: languagesCompleted,
      languages_pending: expansionStatus.languages_pending,
    };
    
    // Build expanded question
    const expandedQuestion: ExpandedQuestion = {
      question_id: questionId,
      multilingual: multilingualQuestion,
      semantic_lock: semanticLock,
      expansion_status: expansionStatus,
      query_variants: queryVariants as Record<LanguageCode, string[]>,
      search_coverage: searchCoverage as Record<LanguageCode, { keywords: string[]; estimated_queries: number }>,
      validation_results: validationResults as Record<LanguageCode, SemanticValidationResult>,
    };
    
    // Store
    this.expandedQuestions.set(questionId, expandedQuestion);
    
    // Calculate totals
    let totalVariants = 0;
    for (const variants of Object.values(queryVariants)) {
      totalVariants += variants.length;
    }
    
    return {
      success: errors.length === 0,
      expanded_question: expandedQuestion,
      errors,
      warnings,
      languages_expanded: languagesCompleted.length,
      total_variants_generated: totalVariants,
    };
  }
  
  /**
   * Extract variables from canonical text
   */
  private extractVariables(canonicalText: string, coreVariables: string[]): Record<string, string> {
    const variables: Record<string, string> = {};
    
    // Simple extraction - in production would be more sophisticated
    for (const variable of coreVariables) {
      variables['variable'] = variable;
    }
    
    // Extract entity (simplified)
    if (canonicalText.includes('OECD')) {
      variables['entity'] = 'OECD countries';
    } else if (canonicalText.includes('EU')) {
      variables['entity'] = 'EU countries';
    } else {
      variables['entity'] = 'countries';
    }
    
    return variables;
  }
  
  /**
   * Extract domain from question ID
   */
  private extractDomain(questionId: string): string {
    const parts = questionId.split('-');
    return parts[1] || 'general';
  }
  
  /**
   * Extract entity scope from variables
   */
  private extractEntityScope(coreVariables: string[]): string {
    if (coreVariables.some(v => v.includes('OECD'))) return 'oecd';
    if (coreVariables.some(v => v.includes('EU'))) return 'eu';
    return 'global';
  }
  
  /**
   * Get expanded question by ID
   */
  getExpanded(questionId: string): ExpandedQuestion | undefined {
    return this.expandedQuestions.get(questionId);
  }
  
  /**
   * Get all variants for a language
   */
  getVariantsForLanguage(questionId: string, language: LanguageCode): string[] {
    const expanded = this.expandedQuestions.get(questionId);
    if (!expanded) return [];
    return expanded.query_variants[language] || [];
  }
  
  /**
   * Calculate global reach
   */
  calculateGlobalReach(): {
    total_languages: number;
    total_speakers: number;
    total_internet_users: number;
    coverage_percent: number;
  } {
    const allLanguages = new Set<LanguageCode>();
    
    for (const expanded of this.expandedQuestions.values()) {
      for (const lang of expanded.expansion_status.languages_completed) {
        allLanguages.add(lang);
      }
    }
    
    const reach = calculateLanguageReach([...allLanguages]);
    
    return {
      total_languages: allLanguages.size,
      total_speakers: reach.speakers,
      total_internet_users: reach.internet_users,
      coverage_percent: reach.coverage_percent,
    };
  }
  
  /**
   * Get engine statistics
   */
  getStats(): MultilingualEngineStats {
    let totalQuestions = 0;
    let totalLanguages = 0;
    let totalVariants = 0;
    const languageCoverage: Record<LanguageCode, number> = {} as Record<LanguageCode, number>;
    
    for (const expanded of this.expandedQuestions.values()) {
      totalQuestions++;
      
      for (const lang of expanded.expansion_status.languages_completed) {
        totalLanguages++;
        languageCoverage[lang] = (languageCoverage[lang] || 0) + 1;
        
        const variants = expanded.query_variants[lang];
        if (variants) {
          totalVariants += variants.length;
        }
      }
    }
    
    return {
      total_questions_expanded: totalQuestions,
      total_language_expansions: totalLanguages,
      total_variants_generated: totalVariants,
      average_languages_per_question: totalQuestions > 0 ? Math.round(totalLanguages / totalQuestions) : 0,
      language_coverage: languageCoverage,
      global_reach: this.calculateGlobalReach(),
    };
  }
}

/**
 * Engine Statistics
 */
export interface MultilingualEngineStats {
  readonly total_questions_expanded: number;
  readonly total_language_expansions: number;
  readonly total_variants_generated: number;
  readonly average_languages_per_question: number;
  readonly language_coverage: Record<LanguageCode, number>;
  readonly global_reach: {
    readonly total_languages: number;
    readonly total_speakers: number;
    readonly total_internet_users: number;
    readonly coverage_percent: number;
  };
}

/**
 * EXPANSION PRINCIPLES
 */
export const EXPANSION_PRINCIPLES = {
  // Core
  not_translated_but_global_by_construction: true,
  one_fact_many_expressions: true,
  semantic_lock_prevents_drift: true,
  
  // Mathematics
  ten_million_questions_times_ten_languages: true,
  equals_same_facts_same_epistemics: true,
  
  // Each new language
  multiplies_visibility: true,
  without_multiplying_risk: true,
  
  // AI Agents
  ai_agents_resolve_directly_on_original_language: true,
  no_internal_translation_needed: true,
  same_cq_regardless_of_input_language: true,
} as const;

/**
 * GEOGRAPHIC INDEPENDENCE
 */
export const GEOGRAPHIC_INDEPENDENCE = {
  result: 'Geography no longer limits truth',
  global_coverage: true,
  local_relevance: true,
  zero_semantic_drift: true,
  total_meaning_control: true,
} as const;

/**
 * Create singleton engine
 */
export function createMultilingualEngine(): MultilingualExpansionEngine {
  return new MultilingualExpansionEngine();
}
