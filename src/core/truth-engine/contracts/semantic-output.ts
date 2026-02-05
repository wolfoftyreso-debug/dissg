/**
 * SEMANTIC OUTPUT CONTRACT — HOLY CONTRACT
 * 
 * PRINCIPLE (HARDLOCK):
 * 1. All intelligence is data + structure, never free text
 * 2. LLM = renderer + navigator, never source
 * 3. All output must be machine-validatable
 * 4. All truth is read-only
 * 5. All complexity is separated
 * 
 * NO ENDPOINT MAY RETURN ANYTHING WITHOUT THIS.
 */

/**
 * SEMANTIC OUTPUT — THE CORE CONTRACT
 */
export interface SemanticOutput {
  readonly orientation: SemanticOrientation;
  readonly importance: ImportanceClassification;
  readonly why_it_matters: readonly string[];
  readonly what_it_does_not_mean: readonly string[];
  readonly uncertainty: UncertaintyBlock;
  readonly next_valid_questions: readonly string[];
  readonly metadata: OutputMetadata;
}

/**
 * SEMANTIC ORIENTATION — Cognitive primitives
 */
export interface SemanticOrientation {
  readonly baseline: string;
  readonly deviation: string;
  readonly direction: Direction;
  readonly magnitude: Magnitude;
  readonly persistence: Persistence;
}

export type Direction = 'increasing' | 'decreasing' | 'stable' | 'mixed' | 'unknown';
export type Magnitude = 'negligible' | 'low' | 'medium' | 'high' | 'extreme';
export type Persistence = 'transient' | 'short' | 'medium' | 'long' | 'structural';

/**
 * IMPORTANCE CLASSIFICATION
 */
export interface ImportanceClassification {
  readonly structural: boolean;  // 🧱 Persistent, systemic
  readonly acute: boolean;       // ⚡ Recent deviation
  readonly contextual: boolean;  // 🌊 Normal variation
  readonly rationale: readonly string[];
  readonly score: number;        // 0-1
}

/**
 * UNCERTAINTY BLOCK — Always required
 */
export interface UncertaintyBlock {
  readonly sources: readonly UncertaintySource[];
  readonly data_gaps: readonly string[];
  readonly confidence: number;   // 0-1
  readonly methodology_notes: readonly string[];
}

export interface UncertaintySource {
  readonly type: 'measurement' | 'sampling' | 'definition' | 'coverage' | 'temporal';
  readonly description: string;
  readonly impact: 'low' | 'medium' | 'high';
}

/**
 * OUTPUT METADATA
 */
export interface OutputMetadata {
  readonly generated_at: string;
  readonly node_ids: readonly string[];
  readonly data_freshness: string;
  readonly methodology_version: string;
  readonly checksum: string;
}

/**
 * CREATE EMPTY OUTPUT — For initialization
 */
export function createEmptyOutput(): SemanticOutput {
  return {
    orientation: {
      baseline: '',
      deviation: '',
      direction: 'unknown',
      magnitude: 'low',
      persistence: 'short',
    },
    importance: {
      structural: false,
      acute: false,
      contextual: true,
      rationale: [],
      score: 0,
    },
    why_it_matters: [],
    what_it_does_not_mean: [],
    uncertainty: {
      sources: [],
      data_gaps: [],
      confidence: 0,
      methodology_notes: [],
    },
    next_valid_questions: [],
    metadata: {
      generated_at: new Date().toISOString(),
      node_ids: [],
      data_freshness: 'unknown',
      methodology_version: '1.0.0',
      checksum: '',
    },
  };
}

/**
 * VALIDATE OUTPUT — Machine validation
 */
export function validateSemanticOutput(output: Partial<SemanticOutput>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!output.orientation) errors.push('Missing orientation block');
  if (!output.importance) errors.push('Missing importance block');
  if (!output.uncertainty) errors.push('Missing uncertainty block');
  if (!output.next_valid_questions?.length) {
    errors.push('Must have at least one next_valid_question (no dead ends)');
  }

  // Orientation validation
  if (output.orientation) {
    if (!output.orientation.baseline) errors.push('Missing baseline in orientation');
    if (!output.orientation.deviation) errors.push('Missing deviation in orientation');
  }

  // Importance validation
  if (output.importance) {
    if (!output.importance.rationale?.length) {
      warnings.push('Importance should have rationale');
    }
  }

  // Uncertainty validation
  if (output.uncertainty) {
    if (output.uncertainty.confidence === undefined) {
      errors.push('Missing confidence in uncertainty');
    }
    if (output.uncertainty.confidence < 0 || output.uncertainty.confidence > 1) {
      errors.push('Confidence must be between 0 and 1');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}
