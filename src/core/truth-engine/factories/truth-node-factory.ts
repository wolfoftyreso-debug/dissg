/**
 * TRUTH NODE FACTORY
 * 
 * Autogenerering av validerade Truth Nodes.
 * Ingen handbyggd data efter detta.
 */

import type { TruthNode, Scope, TimeRange } from '../types';

// Pipeline stages
type PipelineStage = 'raw' | 'normalized' | 'mapped' | 'scoped' | 'scored' | 'validated' | 'persisted';

interface RawSource {
  source_id: string;
  source_type: 'api' | 'document' | 'aggregator';
  payload: unknown;
  fetched_at: string;
  checksum: string;
}

interface NormalizedData {
  values: number[];
  unit: string;
  time_points: string[];
  geo_code: string;
  source_ref: string;
}

interface FactoryConfig {
  ontology_version: string;
  validation_strictness: 'strict' | 'fail_hard';
  allow_partial: false; // ALWAYS false
}

interface FactoryResult {
  success: boolean;
  node?: TruthNode;
  stage_failed?: PipelineStage;
  error?: string;
}

// PIPELINE: raw → normalize → map → scope → score → validate → persist
const _PIPELINE: PipelineStage[] = [
  'raw',
  'normalized', 
  'mapped',
  'scoped',
  'scored',
  'validated',
  'persisted'
];

/**
 * Normalize raw source to standard format
 */
function normalize(raw: RawSource): NormalizedData | null {
  // Extract based on source type
  // Returns null if normalization fails
  try {
    const payload = raw.payload as Record<string, unknown>;
    return {
      values: payload.values as number[] || [],
      unit: payload.unit as string || 'unknown',
      time_points: payload.time_points as string[] || [],
      geo_code: payload.geo_code as string || '',
      source_ref: raw.source_id,
    };
  } catch {
    return null;
  }
}

/**
 * Map to ontology class
 */
function mapToOntology(
  data: NormalizedData, 
  ontology_version: string
): { class: string; attributes: Record<string, unknown> } | null {
  // Must match exactly one ontology class
  // No fuzzy matching, no guessing
  if (!data.unit || !data.geo_code) return null;
  
  return {
    class: 'MEASURE',
    attributes: {
      unit: data.unit,
      geo_code: data.geo_code,
      ontology_version,
    }
  };
}

/**
 * Attach scope (geo + population + time)
 */
function attachScope(
  data: NormalizedData,
  _mapping: { class: string; attributes: Record<string, unknown> }
): Scope | null {
  if (data.time_points.length < 2) return null;
  
  return {
    geo_level: inferGeoLevel(data.geo_code),
    geo_code: data.geo_code,
    time_range: {
      start: data.time_points[0],
      end: data.time_points[data.time_points.length - 1],
    },
    population_scope: 'total', // Can be refined
  };
}

function inferGeoLevel(code: string): Scope['geo_level'] {
  if (code === 'GLOBAL') return 'global';
  if (code.length === 2) return 'country';
  if (code.length === 5) return 'nuts2';
  return 'unknown';
}

/**
 * Compute importance score
 */
function computeImportance(
  data: NormalizedData,
  scope: Scope
): number {
  // Based on: variance, recency, coverage
  const variance = calculateVariance(data.values);
  const recency = calculateRecency(scope.time_range);
  const coverage = data.values.length / 120; // vs 10 years monthly
  
  return Math.min(1, (variance * 0.4) + (recency * 0.3) + (coverage * 0.3));
}

function calculateVariance(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.min(1, Math.sqrt(variance) / mean);
}

function calculateRecency(range: TimeRange): number {
  const endDate = new Date(range.end);
  const now = new Date();
  const monthsAgo = (now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  return Math.max(0, 1 - (monthsAgo / 24)); // Decay over 2 years
}

/**
 * Validate node - HARD FAIL
 */
function validate(
  data: NormalizedData,
  scope: Scope,
  _importance: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Mandatory fields
  if (!data.source_ref) errors.push('missing:source');
  if (!data.unit) errors.push('missing:unit');
  if (!scope.geo_code) errors.push('missing:geo_code');
  if (!scope.time_range.start) errors.push('missing:time_start');
  if (!scope.time_range.end) errors.push('missing:time_end');
  if (data.values.length < 3) errors.push('insufficient:data_points');
  
  // Semantic rules
  if (data.values.some(v => isNaN(v))) errors.push('invalid:nan_values');
  if (new Date(scope.time_range.start) > new Date(scope.time_range.end)) {
    errors.push('invalid:time_range');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Generate deterministic node ID
 */
function generateNodeId(
  data: NormalizedData,
  scope: Scope,
  version: string
): string {
  const hash = simpleHash(`${data.source_ref}:${scope.geo_code}:${scope.time_range.start}`);
  return `tn:measure:${hash}:${version}`;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

/**
 * MAIN FACTORY FUNCTION
 * 
 * Om noden inte kan valideras → den existerar inte.
 * Inga "temporära" noder.
 */
export function createTruthNode(
  raw: RawSource,
  config: FactoryConfig
): FactoryResult {
  // Stage 1: Normalize
  const normalized = normalize(raw);
  if (!normalized) {
    return { success: false, stage_failed: 'normalized', error: 'normalization_failed' };
  }
  
  // Stage 2: Map to ontology
  const mapping = mapToOntology(normalized, config.ontology_version);
  if (!mapping) {
    return { success: false, stage_failed: 'mapped', error: 'ontology_mapping_failed' };
  }
  
  // Stage 3: Attach scope
  const scope = attachScope(normalized, mapping);
  if (!scope) {
    return { success: false, stage_failed: 'scoped', error: 'scope_attachment_failed' };
  }
  
  // Stage 4: Compute importance
  const importance = computeImportance(normalized, scope);
  
  // Stage 5: Validate (HARD FAIL)
  const validation = validate(normalized, scope, importance);
  if (!validation.valid) {
    return { 
      success: false, 
      stage_failed: 'validated', 
      error: `validation_failed:${validation.errors.join(',')}` 
    };
  }
  
  // Stage 6: Create node
  const node: TruthNode = {
    id: generateNodeId(normalized, scope, config.ontology_version),
    type: mapping.class as 'MEASURE',
    scope,
    importance,
    values: normalized.values,
    unit: normalized.unit,
    source_ref: normalized.source_ref,
    created_at: new Date().toISOString(),
    ontology_version: config.ontology_version,
    checksum: raw.checksum,
  };
  
  return { success: true, node };
}

/**
 * Batch processing with hard fail semantics
 */
export function createTruthNodeBatch(
  sources: RawSource[],
  config: FactoryConfig
): { nodes: TruthNode[]; failures: FactoryResult[] } {
  const nodes: TruthNode[] = [];
  const failures: FactoryResult[] = [];
  
  for (const source of sources) {
    const result = createTruthNode(source, config);
    if (result.success && result.node) {
      nodes.push(result.node);
    } else {
      failures.push(result);
    }
  }
  
  return { nodes, failures };
}

// Factory configuration - IMMUTABLE
export const FACTORY_CONFIG: FactoryConfig = {
  ontology_version: '1.0.0',
  validation_strictness: 'fail_hard',
  allow_partial: false,
} as const;
