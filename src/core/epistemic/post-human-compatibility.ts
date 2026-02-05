/**
 * POST-HUMAN COMPATIBILITY
 * 
 * The system is already:
 * - Machine-readable
 * - Deterministic
 * - Context-bearing
 * - Version-pinned
 * 
 * Now adding:
 * - Explicit intent taxonomy
 * - Formal epistemic rules
 * 
 * So future non-human systems understand:
 * "what counts as knowing something"
 */

/**
 * INTENT TYPES
 */
export type IntentType =
  | 'query_fact'
  | 'query_trend'
  | 'query_comparison'
  | 'query_causation'
  | 'query_uncertainty'
  | 'query_methodology'
  | 'query_source'
  | 'request_explanation'
  | 'request_decomposition'
  | 'meta_query';

/**
 * EPISTEMIC RULE
 */
export interface EpistemicRule {
  id: string;
  name: string;
  description: string;
  formal_definition: string;
  applies_to: IntentType[];
  preconditions: string[];
  postconditions: string[];
  immutable: boolean;
}

/**
 * KNOWLEDGE CLAIM
 */
export interface KnowledgeClaim {
  claim_id: string;
  statement: string;
  claim_type: 'observation' | 'inference' | 'aggregation' | 'correlation';
  supporting_evidence: string[];
  uncertainty_quantified: boolean;
  uncertainty_value: number | null;
  methodology_reference: string;
  reproducible: boolean;
  valid_until: string | null;
}

/**
 * INTENT TAXONOMY
 */
export const INTENT_TAXONOMY: Record<IntentType, {
  description: string;
  valid_responses: string[];
  forbidden_responses: string[];
}> = {
  query_fact: {
    description: 'Request for a specific factual observation',
    valid_responses: ['observation', 'uncertainty_bound', 'not_available'],
    forbidden_responses: ['opinion', 'recommendation', 'prediction'],
  },
  query_trend: {
    description: 'Request for change over time',
    valid_responses: ['direction', 'magnitude', 'uncertainty', 'methodology'],
    forbidden_responses: ['future_prediction', 'causation_claim'],
  },
  query_comparison: {
    description: 'Request to compare entities or periods',
    valid_responses: ['difference', 'comparability_caveat', 'methodology_difference'],
    forbidden_responses: ['ranking_by_value', 'better_worse_judgment'],
  },
  query_causation: {
    description: 'Request for causal explanation',
    valid_responses: ['correlation_only', 'mechanism_hypothesis', 'insufficient_evidence'],
    forbidden_responses: ['definitive_cause', 'policy_recommendation'],
  },
  query_uncertainty: {
    description: 'Request for uncertainty information',
    valid_responses: ['confidence_interval', 'sources_of_uncertainty', 'meta_uncertainty'],
    forbidden_responses: ['false_precision', 'hidden_uncertainty'],
  },
  query_methodology: {
    description: 'Request for methodology details',
    valid_responses: ['full_methodology', 'limitations', 'alternatives'],
    forbidden_responses: ['black_box', 'incomplete_disclosure'],
  },
  query_source: {
    description: 'Request for data source information',
    valid_responses: ['source_chain', 'reliability_assessment', 'access_method'],
    forbidden_responses: ['hidden_source', 'unverifiable_claim'],
  },
  request_explanation: {
    description: 'Request to explain a concept or finding',
    valid_responses: ['decomposition', 'context', 'limitations'],
    forbidden_responses: ['simplification_without_caveat', 'narrative'],
  },
  request_decomposition: {
    description: 'Request to break down an aggregate',
    valid_responses: ['components', 'weights', 'methodology'],
    forbidden_responses: ['opaque_aggregate', 'unexplained_calculation'],
  },
  meta_query: {
    description: 'Query about the system itself',
    valid_responses: ['system_capability', 'limitation', 'governance'],
    forbidden_responses: ['marketing', 'overstatement'],
  },
};

/**
 * CORE EPISTEMIC RULES
 */
export const CORE_EPISTEMIC_RULES: EpistemicRule[] = [
  {
    id: 'ER001',
    name: 'Observation Primacy',
    description: 'Observations precede all interpretations',
    formal_definition: '∀ claim ∈ Knowledge: ∃ observation ∈ Data: claim.basis = observation',
    applies_to: ['query_fact', 'query_trend'],
    preconditions: ['data_exists', 'methodology_defined'],
    postconditions: ['claim_has_basis', 'uncertainty_quantified'],
    immutable: true,
  },
  {
    id: 'ER002',
    name: 'Uncertainty Disclosure',
    description: 'All claims must quantify uncertainty',
    formal_definition: '∀ claim ∈ Output: claim.uncertainty ≠ null',
    applies_to: ['query_fact', 'query_trend', 'query_comparison'],
    preconditions: ['claim_generated'],
    postconditions: ['uncertainty_attached'],
    immutable: true,
  },
  {
    id: 'ER003',
    name: 'Source Traceability',
    description: 'All data must trace to original source',
    formal_definition: '∀ datum ∈ Data: ∃ source ∈ Sources: datum.origin = source',
    applies_to: ['query_source', 'query_methodology'],
    preconditions: ['datum_exists'],
    postconditions: ['source_chain_complete'],
    immutable: true,
  },
  {
    id: 'ER004',
    name: 'No Hidden Causation',
    description: 'Correlation must not imply causation',
    formal_definition: '∀ correlation ∈ Output: ¬(correlation → causation) unless explicit_evidence',
    applies_to: ['query_causation', 'query_comparison'],
    preconditions: ['relationship_identified'],
    postconditions: ['causation_explicitly_disclaimed'],
    immutable: true,
  },
  {
    id: 'ER005',
    name: 'Reproducibility Requirement',
    description: 'All computations must be reproducible',
    formal_definition: '∀ computation ∈ System: reproducible(computation) = true',
    applies_to: ['query_methodology', 'request_decomposition'],
    preconditions: ['computation_defined'],
    postconditions: ['methodology_documented', 'inputs_recorded'],
    immutable: true,
  },
  {
    id: 'ER006',
    name: 'Version Determinism',
    description: 'Same query, same version, same result',
    formal_definition: 'query(x, v) = query(x, v) ∀ x, v',
    applies_to: ['query_fact', 'query_trend', 'query_comparison'],
    preconditions: ['query_valid', 'version_specified'],
    postconditions: ['result_deterministic'],
    immutable: true,
  },
];

/**
 * POST-HUMAN COMPATIBILITY ENGINE
 */
class PostHumanCompatibilityEngine {
  private claims: Map<string, KnowledgeClaim> = new Map();
  private customRules: EpistemicRule[] = [];

  /**
   * REGISTER CLAIM
   */
  registerClaim(claim: KnowledgeClaim): void {
    // Validate against epistemic rules
    const validation = this.validateClaim(claim);
    if (!validation.valid) {
      throw new Error(`Claim violates epistemic rules: ${validation.violations.join(', ')}`);
    }
    
    this.claims.set(claim.claim_id, claim);
  }

  /**
   * VALIDATE CLAIM
   */
  validateClaim(claim: KnowledgeClaim): {
    valid: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    
    // ER002: Uncertainty Disclosure
    if (!claim.uncertainty_quantified) {
      violations.push('ER002: Uncertainty not quantified');
    }
    
    // ER003: Source Traceability
    if (claim.supporting_evidence.length === 0) {
      violations.push('ER003: No supporting evidence');
    }
    
    // ER005: Reproducibility
    if (!claim.reproducible) {
      violations.push('ER005: Claim not reproducible');
    }
    
    return {
      valid: violations.length === 0,
      violations,
    };
  }

  /**
   * CLASSIFY INTENT
   */
  classifyIntent(query: string): {
    intent: IntentType;
    confidence: number;
    valid_responses: string[];
  } {
    // Simple keyword-based classification
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('how') && queryLower.includes('measured')) {
      return {
        intent: 'query_methodology',
        confidence: 0.9,
        valid_responses: INTENT_TAXONOMY.query_methodology.valid_responses,
      };
    }
    
    if (queryLower.includes('source') || queryLower.includes('where')) {
      return {
        intent: 'query_source',
        confidence: 0.85,
        valid_responses: INTENT_TAXONOMY.query_source.valid_responses,
      };
    }
    
    if (queryLower.includes('trend') || queryLower.includes('over time')) {
      return {
        intent: 'query_trend',
        confidence: 0.9,
        valid_responses: INTENT_TAXONOMY.query_trend.valid_responses,
      };
    }
    
    if (queryLower.includes('compare') || queryLower.includes('difference')) {
      return {
        intent: 'query_comparison',
        confidence: 0.9,
        valid_responses: INTENT_TAXONOMY.query_comparison.valid_responses,
      };
    }
    
    if (queryLower.includes('cause') || queryLower.includes('why')) {
      return {
        intent: 'query_causation',
        confidence: 0.85,
        valid_responses: INTENT_TAXONOMY.query_causation.valid_responses,
      };
    }
    
    if (queryLower.includes('uncertain') || queryLower.includes('confidence')) {
      return {
        intent: 'query_uncertainty',
        confidence: 0.9,
        valid_responses: INTENT_TAXONOMY.query_uncertainty.valid_responses,
      };
    }
    
    // Default to query_fact
    return {
      intent: 'query_fact',
      confidence: 0.7,
      valid_responses: INTENT_TAXONOMY.query_fact.valid_responses,
    };
  }

  /**
   * GET EPISTEMIC RULES
   */
  getEpistemicRules(): EpistemicRule[] {
    return [...CORE_EPISTEMIC_RULES, ...this.customRules];
  }

  /**
   * GET IMMUTABLE RULES
   */
  getImmutableRules(): EpistemicRule[] {
    return this.getEpistemicRules().filter(r => r.immutable);
  }

  /**
   * GENERATE MACHINE-READABLE SPEC
   */
  generateMachineSpec(): object {
    return {
      version: '1.0.0',
      generated_at: new Date().toISOString(),
      intent_taxonomy: INTENT_TAXONOMY,
      epistemic_rules: this.getEpistemicRules(),
      claim_schema: {
        required_fields: [
          'claim_id',
          'statement',
          'claim_type',
          'supporting_evidence',
          'uncertainty_quantified',
          'methodology_reference',
          'reproducible',
        ],
      },
      compatibility: {
        machine_readable: true,
        deterministic: true,
        context_bearing: true,
        version_pinned: true,
      },
    };
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_claims: number;
    epistemic_rules: number;
    immutable_rules: number;
  } {
    return {
      total_claims: this.claims.size,
      epistemic_rules: this.getEpistemicRules().length,
      immutable_rules: this.getImmutableRules().length,
    };
  }
}

/**
 * SINGLETON
 */
export const postHumanCompatibility = new PostHumanCompatibilityEngine();

/**
 * PRINCIPLES
 */
export const POST_HUMAN_PRINCIPLES = {
  explicit_intent_taxonomy: true,
  formal_epistemic_rules: true,
  machine_understandable: true,
  defines_what_knowing_means: true,
  future_ai_compatible: true,
} as const;
