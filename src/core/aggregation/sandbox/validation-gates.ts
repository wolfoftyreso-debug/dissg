/**
 * AGGREGATION SANDBOX – VALIDATION GATES
 * 
 * 4-gate pipeline that all aggregations must pass.
 * Fail-hard: any gate failure = rejection.
 */

import type { 
  AggregationResultRaw, 
  GateOutcome, 
  ValidationPipelineResult,
  GateName,
} from './types';
import type { Aggregation, OutputContract } from '../registry/types';

// ============================================================================
// FORBIDDEN TERMS (NORMATIVITY SCAN)
// ============================================================================

const FORBIDDEN_NORMATIVE_TERMS = [
  'best',
  'worst',
  'optimal',
  'recommended',
  'should',
  'must',
  'ideal',
  'superior',
  'inferior',
  'ranking',
  'ranked',
  'top',
  'bottom',
  'winning',
  'losing',
  'success',
  'failure',
  'good',
  'bad',
  'better',
  'worse',
] as const;

// ============================================================================
// GATE 1: SCHEMA VALIDATION
// ============================================================================

export function validateSchema(
  result: AggregationResultRaw,
  contract: OutputContract
): GateOutcome {
  const violations: string[] = [];
  
  // Check output type matches
  const output = result.raw_output as Record<string, unknown>;
  
  if (!output || typeof output !== 'object') {
    violations.push('Output must be an object');
  }
  
  // Check for forbidden fields
  const forbiddenFields = ['recommendation', 'advice', 'action', 'should_do'];
  for (const field of forbiddenFields) {
    if (output && field in output) {
      violations.push(`Forbidden field: ${field}`);
    }
  }
  
  // Check predictive is false
  if (output && 'predictive' in output && output.predictive !== false) {
    violations.push('Predictive must be false');
  }
  
  // Check units match if specified
  if (contract.units && output && 'units' in output) {
    if (output.units !== contract.units) {
      violations.push(`Unit mismatch: expected ${contract.units}, got ${output.units}`);
    }
  }
  
  return {
    gate: 'schema_validation',
    result: violations.length === 0 ? 'pass' : 'fail',
    details: violations.length === 0 
      ? 'Schema validation passed' 
      : `Schema violations: ${violations.length}`,
    violations,
    checked_at: new Date().toISOString(),
  };
}

// ============================================================================
// GATE 2: NORMATIVITY SCAN
// ============================================================================

function deepScanForTerms(obj: unknown, terms: readonly string[]): string[] {
  const found: string[] = [];
  
  function scan(value: unknown, path: string) {
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      for (const term of terms) {
        if (lower.includes(term.toLowerCase())) {
          found.push(`"${term}" found at ${path}: "${value.substring(0, 50)}..."`);
        }
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => scan(item, `${path}[${i}]`));
    } else if (value && typeof value === 'object') {
      for (const [key, val] of Object.entries(value)) {
        // Also check keys
        const lowerKey = key.toLowerCase();
        for (const term of terms) {
          if (lowerKey.includes(term.toLowerCase())) {
            found.push(`"${term}" found in key: ${key}`);
          }
        }
        scan(val, `${path}.${key}`);
      }
    }
  }
  
  scan(obj, 'root');
  return found;
}

export function scanNormativity(result: AggregationResultRaw): GateOutcome {
  const violations = deepScanForTerms(result.raw_output, FORBIDDEN_NORMATIVE_TERMS);
  
  return {
    gate: 'normativity_scan',
    result: violations.length === 0 ? 'pass' : 'fail',
    details: violations.length === 0 
      ? 'No normative language detected' 
      : `Normative terms found: ${violations.length}`,
    violations,
    checked_at: new Date().toISOString(),
  };
}

// ============================================================================
// GATE 3: BOUNDARY CHECK
// ============================================================================

export function checkBoundaries(
  result: AggregationResultRaw,
  aggregation: Aggregation
): GateOutcome {
  const violations: string[] = [];
  const output = result.raw_output as Record<string, unknown>;
  
  // Check validity conditions
  for (const condition of aggregation.boundary.validity_conditions) {
    // These would be checked against actual data
    // For now, we check structural requirements
    if (condition.includes('sample') && output) {
      const sampleSize = (output.sample_size as number) || 0;
      if (sampleSize < aggregation.input_contract.minimum_sample_size) {
        violations.push(`Sample size ${sampleSize} below minimum ${aggregation.input_contract.minimum_sample_size}`);
      }
    }
  }
  
  // Check break conditions
  for (const condition of aggregation.boundary.break_conditions) {
    // Check for structural breaks
    if (condition.includes('mismatch') && output && output.scope_mismatch) {
      violations.push(`Break condition triggered: ${condition}`);
    }
  }
  
  // Check descriptive_only
  if (!aggregation.boundary.descriptive_only) {
    violations.push('Aggregation must be descriptive_only');
  }
  
  // Check not_recommendation
  if (!aggregation.boundary.not_recommendation) {
    violations.push('Aggregation must be not_recommendation');
  }
  
  return {
    gate: 'boundary_check',
    result: violations.length === 0 ? 'pass' : 'fail',
    details: violations.length === 0 
      ? 'Boundaries respected' 
      : `Boundary violations: ${violations.length}`,
    violations,
    checked_at: new Date().toISOString(),
  };
}

// ============================================================================
// GATE 4: LEGIBILITY CHECK
// ============================================================================

export function checkLegibility(result: AggregationResultRaw): GateOutcome {
  const violations: string[] = [];
  const output = result.raw_output as Record<string, unknown>;
  
  // Check if output requires interpretation
  const complexityIndicators = [
    'requires_interpretation',
    'summary_needed',
    'abstract_pattern',
    'derived_meaning',
  ];
  
  for (const indicator of complexityIndicators) {
    if (output && output[indicator] === true) {
      violations.push(`Output requires interpretation: ${indicator}`);
    }
  }
  
  // Check nesting depth (max 3 levels)
  function getDepth(obj: unknown, current = 0): number {
    if (!obj || typeof obj !== 'object') return current;
    if (Array.isArray(obj)) {
      return Math.max(current, ...obj.map(item => getDepth(item, current + 1)));
    }
    return Math.max(current, ...Object.values(obj).map(val => getDepth(val, current + 1)));
  }
  
  const depth = getDepth(output);
  if (depth > 5) {
    violations.push(`Output nesting too deep: ${depth} levels (max 5)`);
  }
  
  // Check for unexplained abbreviations or codes
  const jsonStr = JSON.stringify(output);
  const abbreviationPattern = /\b[A-Z]{4,}\b/g;
  const abbreviations = jsonStr.match(abbreviationPattern) || [];
  const knownAbbreviations = ['NULL', 'TRUE', 'FALSE', 'UUID', 'JSON'];
  const unknownAbbreviations = abbreviations.filter(a => !knownAbbreviations.includes(a));
  
  if (unknownAbbreviations.length > 5) {
    violations.push(`Too many unexplained abbreviations: ${unknownAbbreviations.slice(0, 5).join(', ')}...`);
  }
  
  return {
    gate: 'legibility_check',
    result: violations.length === 0 ? 'pass' : 'fail',
    details: violations.length === 0 
      ? 'Output is legible without interpretation' 
      : `Legibility issues: ${violations.length}`,
    violations,
    checked_at: new Date().toISOString(),
  };
}

// ============================================================================
// FULL PIPELINE
// ============================================================================

export function runValidationPipeline(
  result: AggregationResultRaw,
  aggregation: Aggregation
): ValidationPipelineResult {
  const gates: GateOutcome[] = [];
  
  // Gate 1: Schema
  const schemaResult = validateSchema(result, aggregation.output_contract);
  gates.push(schemaResult);
  
  // Gate 2: Normativity (even if Gate 1 fails, we want to know)
  const normativityResult = scanNormativity(result);
  gates.push(normativityResult);
  
  // Gate 3: Boundaries
  const boundaryResult = checkBoundaries(result, aggregation);
  gates.push(boundaryResult);
  
  // Gate 4: Legibility
  const legibilityResult = checkLegibility(result);
  gates.push(legibilityResult);
  
  // Determine disposition
  const allPassed = gates.every(g => g.result === 'pass');
  const normativityFailed = normativityResult.result === 'fail';
  const legibilityFailed = legibilityResult.result === 'fail';
  const boundaryFailed = boundaryResult.result === 'fail';
  
  let disposition: ValidationPipelineResult['disposition'];
  
  if (allPassed) {
    disposition = 'promote';
  } else if (normativityFailed) {
    disposition = 'block'; // Most serious
  } else if (legibilityFailed) {
    disposition = 'deprecate';
  } else if (boundaryFailed) {
    disposition = 'cannot_answer';
  } else {
    disposition = 'block';
  }
  
  return {
    job_id: result.job_id,
    gates,
    passed: allPassed,
    disposition,
    requires_steward_review: normativityFailed || (!allPassed && gates.filter(g => g.result === 'fail').length > 1),
    validated_at: new Date().toISOString(),
  };
}

// ============================================================================
// GATE UTILITIES
// ============================================================================

export function getGateDescription(gate: GateName): string {
  const descriptions: Record<GateName, string> = {
    schema_validation: 'Validates output matches contract structure',
    normativity_scan: 'Scans for forbidden normative/prescriptive language',
    boundary_check: 'Verifies validity conditions and break conditions',
    legibility_check: 'Ensures output is displayable without interpretation',
  };
  return descriptions[gate];
}

export function getDispositionAction(disposition: ValidationPipelineResult['disposition']): string {
  const actions: Record<ValidationPipelineResult['disposition'], string> = {
    promote: 'Ready for registry promotion',
    block: 'Blocked - requires steward review and remediation',
    deprecate: 'Mark as deprecated - not suitable for display',
    cannot_answer: 'Downgrade to Cannot-Answer context only',
  };
  return actions[disposition];
}
