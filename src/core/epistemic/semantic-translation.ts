/**
 * SEMANTIC TRANSLATION LAYER
 * 
 * When language changes (it will):
 * - Concepts map ontologically
 * - Old questions can still be asked
 * - New formulations hit the same truth
 * 
 * System survives:
 * - New language models
 * - New UX paradigms
 * - New ways of asking
 */

/**
 * CONCEPT MAPPING
 */
export interface ConceptMapping {
  id: string;
  canonical_id: string;
  variant_forms: string[];
  language_code: string;
  valid_from: string;
  valid_to: string | null;
  semantic_drift_notes: string | null;
}

/**
 * QUESTION TRANSLATION
 */
export interface QuestionTranslation {
  original_form: string;
  canonical_form: string;
  language_code: string;
  confidence: number;
  ambiguity_resolved: string | null;
  maps_to_nodes: string[];
}

/**
 * ONTOLOGICAL ANCHOR
 */
export interface OntologicalAnchor {
  id: string;
  concept: string;
  definition: string;
  parent_concept: string | null;
  child_concepts: string[];
  related_concepts: string[];
  immutable: boolean;
  created_at: string;
}

/**
 * SEMANTIC TRANSLATION ENGINE
 */
class SemanticTranslationEngine {
  private mappings: Map<string, ConceptMapping[]> = new Map();
  private anchors: Map<string, OntologicalAnchor> = new Map();
  private questionCache: Map<string, QuestionTranslation> = new Map();

  /**
   * REGISTER CONCEPT MAPPING
   */
  registerMapping(mapping: ConceptMapping): void {
    const existing = this.mappings.get(mapping.canonical_id) || [];
    existing.push(mapping);
    this.mappings.set(mapping.canonical_id, existing);
    
    // Index variant forms
    for (const variant of mapping.variant_forms) {
      const variantKey = this.normalizeText(variant);
      const variantMappings = this.mappings.get(variantKey) || [];
      variantMappings.push(mapping);
      this.mappings.set(variantKey, variantMappings);
    }
  }

  /**
   * REGISTER ANCHOR
   */
  registerAnchor(anchor: OntologicalAnchor): void {
    if (this.anchors.has(anchor.id) && this.anchors.get(anchor.id)?.immutable) {
      throw new Error(`Cannot modify immutable anchor: ${anchor.id}`);
    }
    this.anchors.set(anchor.id, anchor);
  }

  /**
   * TRANSLATE CONCEPT
   */
  translateConcept(input: string, targetLanguage?: string): {
    canonical_id: string | null;
    confidence: number;
    alternatives: string[];
  } {
    const normalized = this.normalizeText(input);
    const mappings = this.mappings.get(normalized);
    
    if (!mappings || mappings.length === 0) {
      return {
        canonical_id: null,
        confidence: 0,
        alternatives: [],
      };
    }
    
    // Filter by language if specified
    const filtered = targetLanguage
      ? mappings.filter(m => m.language_code === targetLanguage || m.language_code === '*')
      : mappings;
    
    if (filtered.length === 0) {
      return {
        canonical_id: null,
        confidence: 0,
        alternatives: mappings.map(m => m.canonical_id),
      };
    }
    
    // Return highest confidence match (first in list for now)
    return {
      canonical_id: filtered[0].canonical_id,
      confidence: 0.9,
      alternatives: filtered.slice(1).map(m => m.canonical_id),
    };
  }

  /**
   * TRANSLATE QUESTION
   */
  translateQuestion(question: string, languageCode: string = 'en'): QuestionTranslation {
    const cacheKey = `${languageCode}:${question}`;
    
    if (this.questionCache.has(cacheKey)) {
      return this.questionCache.get(cacheKey)!;
    }
    
    // Extract concepts from question
    const words = question.toLowerCase().split(/\s+/);
    const mappedNodes: string[] = [];
    let confidence = 0.5;
    
    for (const word of words) {
      const translation = this.translateConcept(word, languageCode);
      if (translation.canonical_id) {
        mappedNodes.push(translation.canonical_id);
        confidence = Math.min(0.95, confidence + 0.1);
      }
    }
    
    const result: QuestionTranslation = {
      original_form: question,
      canonical_form: this.canonicalizeQuestion(question),
      language_code: languageCode,
      confidence,
      ambiguity_resolved: null,
      maps_to_nodes: [...new Set(mappedNodes)],
    };
    
    this.questionCache.set(cacheKey, result);
    return result;
  }

  /**
   * NORMALIZE TEXT
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_');
  }

  /**
   * CANONICALIZE QUESTION
   */
  private canonicalizeQuestion(question: string): string {
    return question
      .toLowerCase()
      .trim()
      .replace(/\?+$/, '')
      .replace(/\s+/g, ' ');
  }

  /**
   * GET ANCHOR HIERARCHY
   */
  getAnchorHierarchy(anchorId: string): OntologicalAnchor[] {
    const result: OntologicalAnchor[] = [];
    let current = this.anchors.get(anchorId);
    
    while (current) {
      result.push(current);
      if (current.parent_concept) {
        current = this.anchors.get(current.parent_concept);
      } else {
        break;
      }
    }
    
    return result;
  }

  /**
   * FIND RELATED CONCEPTS
   */
  findRelatedConcepts(anchorId: string): OntologicalAnchor[] {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return [];
    
    const related: OntologicalAnchor[] = [];
    
    for (const relatedId of anchor.related_concepts) {
      const relatedAnchor = this.anchors.get(relatedId);
      if (relatedAnchor) {
        related.push(relatedAnchor);
      }
    }
    
    return related;
  }

  /**
   * CHECK BACKWARD COMPATIBILITY
   */
  checkBackwardCompatibility(oldQuestion: string, newQuestion: string): {
    compatible: boolean;
    overlap_score: number;
    differences: string[];
  } {
    const oldTranslation = this.translateQuestion(oldQuestion);
    const newTranslation = this.translateQuestion(newQuestion);
    
    const oldNodes = new Set(oldTranslation.maps_to_nodes);
    const newNodes = new Set(newTranslation.maps_to_nodes);
    
    const intersection = [...oldNodes].filter(n => newNodes.has(n));
    const union = [...new Set([...oldNodes, ...newNodes])];
    
    const overlapScore = union.length > 0 ? intersection.length / union.length : 0;
    
    const differences: string[] = [];
    for (const node of oldNodes) {
      if (!newNodes.has(node)) {
        differences.push(`Lost: ${node}`);
      }
    }
    for (const node of newNodes) {
      if (!oldNodes.has(node)) {
        differences.push(`Added: ${node}`);
      }
    }
    
    return {
      compatible: overlapScore >= 0.8,
      overlap_score: overlapScore,
      differences,
    };
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_mappings: number;
    total_anchors: number;
    immutable_anchors: number;
    cached_questions: number;
  } {
    let immutableCount = 0;
    this.anchors.forEach(a => { if (a.immutable) immutableCount++; });
    
    return {
      total_mappings: this.mappings.size,
      total_anchors: this.anchors.size,
      immutable_anchors: immutableCount,
      cached_questions: this.questionCache.size,
    };
  }
}

/**
 * SINGLETON
 */
export const semanticTranslation = new SemanticTranslationEngine();

/**
 * PRINCIPLES
 */
export const SEMANTIC_TRANSLATION_PRINCIPLES = {
  ontological_mapping: true,
  old_questions_still_work: true,
  new_formulations_hit_same_truth: true,
  survives_language_model_changes: true,
  survives_ux_paradigm_changes: true,
} as const;
