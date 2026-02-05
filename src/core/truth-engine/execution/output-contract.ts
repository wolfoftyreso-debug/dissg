/**
 * SEMANTIC OUTPUT CONTRACT
 * 
 * Every output MUST contain all required fields.
 * If something is missing → output is rejected.
 * 
 * This is not validation — it's architecture.
 */

/**
 * SEMANTIC OUTPUT (FULL CONTRACT)
 */
export interface SemanticOutputContract {
  // REQUIRED: Semantic Orientation Block
  readonly semantic_orientation: {
    readonly what_is_normal: string;    // Historical baseline or reference
    readonly what_is_changing: string;  // Current movement or deviation
    readonly what_is_important: string; // Why this matters systemically
  };
  
  // REQUIRED: Importance Justification
  readonly why_it_matters: readonly ImportanceClaim[];
  
  // REQUIRED: Misinterpretation Prevention
  readonly what_it_does_not_mean: readonly Disclaimer[];
  
  // REQUIRED: Uncertainty Declaration
  readonly uncertainties: readonly UncertaintyItem[];
  
  // REQUIRED: Forward Navigation
  readonly next_valid_questions: readonly ValidQuestion[];
  
  // REQUIRED: Provenance
  readonly data_sources: readonly SourceReference[];
  
  // REQUIRED: Meta
  readonly confidence: number; // 0-1
  readonly generated_at: string;
  readonly methodology_version: string;
}

/**
 * IMPORTANCE CLAIM
 */
export interface ImportanceClaim {
  readonly claim: string;
  readonly evidence_basis: string;
  readonly affected_systems: readonly string[];
  readonly importance_class: 'structural' | 'acute' | 'contextual';
}

/**
 * DISCLAIMER
 */
export interface Disclaimer {
  readonly misconception: string;  // What people might wrongly think
  readonly clarification: string;  // Why that's wrong
  readonly severity: 'critical' | 'significant' | 'minor';
}

/**
 * UNCERTAINTY ITEM
 */
export interface UncertaintyItem {
  readonly type: 'data_gap' | 'methodology_limit' | 'measurement_error' | 'coverage' | 'definition';
  readonly description: string;
  readonly impact: string;
  readonly resolvable: boolean;
}

/**
 * VALID QUESTION
 */
export interface ValidQuestion {
  readonly question: string;
  readonly direction: 'deeper' | 'broader' | 'lateral' | 'historical';
  readonly data_available: boolean;
  readonly estimated_complexity: 'simple' | 'moderate' | 'complex';
}

/**
 * SOURCE REFERENCE
 */
export interface SourceReference {
  readonly source_id: string;
  readonly name: string;
  readonly organization: string;
  readonly date: string;
  readonly url?: string;
}

/**
 * CONTRACT VALIDATION
 */
export interface ContractValidation {
  readonly valid: boolean;
  readonly missing_fields: readonly string[];
  readonly empty_required: readonly string[];
  readonly structural_issues: readonly string[];
}

/**
 * VALIDATE CONTRACT
 */
export function validateContract(output: Partial<SemanticOutputContract>): ContractValidation {
  const missing: string[] = [];
  const empty: string[] = [];
  const issues: string[] = [];
  
  // Check top-level required fields
  if (!output.semantic_orientation) {
    missing.push('semantic_orientation');
  } else {
    if (!output.semantic_orientation.what_is_normal) empty.push('semantic_orientation.what_is_normal');
    if (!output.semantic_orientation.what_is_changing) empty.push('semantic_orientation.what_is_changing');
    if (!output.semantic_orientation.what_is_important) empty.push('semantic_orientation.what_is_important');
  }
  
  if (!output.why_it_matters) {
    missing.push('why_it_matters');
  } else if (output.why_it_matters.length === 0) {
    issues.push('why_it_matters must contain at least one claim');
  }
  
  if (!output.what_it_does_not_mean) {
    missing.push('what_it_does_not_mean');
  }
  
  if (!output.uncertainties) {
    missing.push('uncertainties');
  }
  
  if (!output.next_valid_questions) {
    missing.push('next_valid_questions');
  } else if (output.next_valid_questions.length === 0) {
    issues.push('next_valid_questions must contain at least one question (dead ends forbidden)');
  }
  
  if (!output.data_sources) {
    missing.push('data_sources');
  } else if (output.data_sources.length === 0) {
    issues.push('data_sources must contain at least one source');
  }
  
  if (output.confidence === undefined) {
    missing.push('confidence');
  } else if (output.confidence < 0 || output.confidence > 1) {
    issues.push('confidence must be between 0 and 1');
  }
  
  return {
    valid: missing.length === 0 && empty.length === 0 && issues.length === 0,
    missing_fields: missing,
    empty_required: empty,
    structural_issues: issues,
  };
}

/**
 * CREATE EMPTY CONTRACT (FOR TEMPLATES)
 */
export function createEmptyContract(): SemanticOutputContract {
  return {
    semantic_orientation: {
      what_is_normal: '',
      what_is_changing: '',
      what_is_important: '',
    },
    why_it_matters: [],
    what_it_does_not_mean: [],
    uncertainties: [],
    next_valid_questions: [],
    data_sources: [],
    confidence: 0,
    generated_at: new Date().toISOString(),
    methodology_version: '1.0.0',
  };
}

/**
 * CONTRACT BUILDER
 */
export class ContractBuilder {
  private contract: SemanticOutputContract;
  
  constructor() {
    this.contract = createEmptyContract();
  }
  
  setOrientation(normal: string, changing: string, important: string): this {
    this.contract = {
      ...this.contract,
      semantic_orientation: {
        what_is_normal: normal,
        what_is_changing: changing,
        what_is_important: important,
      },
    };
    return this;
  }
  
  addImportanceClaim(claim: ImportanceClaim): this {
    this.contract = {
      ...this.contract,
      why_it_matters: [...this.contract.why_it_matters, claim],
    };
    return this;
  }
  
  addDisclaimer(disclaimer: Disclaimer): this {
    this.contract = {
      ...this.contract,
      what_it_does_not_mean: [...this.contract.what_it_does_not_mean, disclaimer],
    };
    return this;
  }
  
  addUncertainty(item: UncertaintyItem): this {
    this.contract = {
      ...this.contract,
      uncertainties: [...this.contract.uncertainties, item],
    };
    return this;
  }
  
  addNextQuestion(question: ValidQuestion): this {
    this.contract = {
      ...this.contract,
      next_valid_questions: [...this.contract.next_valid_questions, question],
    };
    return this;
  }
  
  addSource(source: SourceReference): this {
    this.contract = {
      ...this.contract,
      data_sources: [...this.contract.data_sources, source],
    };
    return this;
  }
  
  setConfidence(confidence: number): this {
    this.contract = {
      ...this.contract,
      confidence: Math.max(0, Math.min(1, confidence)),
    };
    return this;
  }
  
  build(): { contract: SemanticOutputContract; validation: ContractValidation } {
    const validation = validateContract(this.contract);
    return {
      contract: this.contract,
      validation,
    };
  }
}
