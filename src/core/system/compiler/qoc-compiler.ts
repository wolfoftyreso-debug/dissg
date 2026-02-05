/**
 * QUERY → ONTOLOGY COMPILER (QOC) v1
 * 
 * From raw query → Decision Draft that can be locked.
 * 
 * PRINCIPLES (HARD):
 * - Compiler translates – it does not answer
 * - No inference, no ranking, no recommendation
 * - All output objects must be ontologically valid
 * - Missing data → explicit gap, not fill-in
 */

import type { 
  CompilerInput, 
  CompilerOutput, 
  PipelineStep,
} from './types';
import { normalizeIntent } from './steps/intent-normalizer';
import { resolveEntity } from './steps/entity-resolver';
import { selectBlueprint } from './steps/blueprint-selector';
import { createDraftDecision } from './steps/draft-creator';
import { buildContextSkeleton } from './steps/context-builder';
import { seedAlternatives } from './steps/alternative-seeder';
import { seedUncertainties } from './steps/uncertainty-seeder';
import { checkCoverageGate } from './steps/coverage-checker';

// ═══════════════════════════════════════════════════════════════════
//                         COMPILER
// ═══════════════════════════════════════════════════════════════════

export function compileQueryToDecision(input: CompilerInput): CompilerOutput {
  const trace: PipelineStep[] = [];
  let stepNum = 0;
  
  const runStep = <T>(name: string, fn: () => T): T => {
    stepNum++;
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    trace.push({
      step: stepNum,
      name,
      input: stepNum === 1 ? input : trace[trace.length - 1]?.output,
      output: result,
      duration_ms: Math.round(duration * 100) / 100,
    });
    
    return result;
  };
  
  // Step 1: Intent Normalization
  const intent = runStep('Intent Normalization', () => 
    normalizeIntent(input.query)
  );
  
  // Step 2: Entity Resolution
  const entity = runStep('Entity Resolution', () => 
    resolveEntity(input.query, intent)
  );
  
  // Step 3: Blueprint Selection
  const blueprint = runStep('Blueprint Selection', () => 
    selectBlueprint(intent)
  );
  
  // Step 4: Draft Decision
  const decision = runStep('Draft Decision', () => 
    createDraftDecision(intent, blueprint)
  );
  
  // Step 5: Context Skeleton
  const context = runStep('Context Skeleton', () => 
    buildContextSkeleton(intent, entity)
  );
  
  // Step 6: Alternative Seeding
  const alternatives = runStep('Alternative Seeding', () => 
    seedAlternatives(intent, entity, blueprint)
  );
  
  // Step 7: Uncertainty Seeding
  const uncertainties = runStep('Uncertainty Seeding', () => 
    seedUncertainties(intent, blueprint)
  );
  
  // Step 8: Coverage Check
  const coverage = runStep('Coverage Check', () => 
    checkCoverageGate({
      intent,
      entity,
      context,
      alternatives,
      uncertainties,
      blueprint,
    })
  );
  
  // Generate output
  const decisionId = generateDecisionId();
  const missingToLock = generateMissingList(coverage, alternatives, uncertainties, context);
  const publicMessage = generatePublicMessage(coverage, missingToLock);
  
  if (!coverage.build_allowed) {
    return {
      success: false,
      decision_id: decisionId,
      status: 'blocked',
      missing_to_lock: missingToLock,
      public_facing_message: coverage.reason || 'Cannot be answered reliably yet.',
      pipeline_trace: trace,
    };
  }
  
  return {
    success: true,
    decision_id: decisionId,
    status: 'draft',
    draft: {
      decision,
      context,
      alternatives,
      uncertainties,
    },
    missing_to_lock: missingToLock,
    public_facing_message: publicMessage,
    pipeline_trace: trace,
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         HELPERS
// ═══════════════════════════════════════════════════════════════════

function generateDecisionId(): string {
  return `DEC-AUTO-${Date.now().toString(36).toUpperCase()}`;
}

function generateMissingList(
  coverage: ReturnType<typeof checkCoverageGate>,
  alternatives: readonly { is_placeholder: boolean }[],
  uncertainties: readonly unknown[],
  context: { assumptions: readonly { is_specified: boolean }[] }
): readonly string[] {
  const missing: string[] = [];
  
  // Check alternatives
  const placeholderAlts = alternatives.filter(a => a.is_placeholder).length;
  if (placeholderAlts > 0) {
    missing.push(`≥${placeholderAlts} concrete alternative(s) needed`);
  }
  
  // Check uncertainties
  if (uncertainties.length < 1) {
    missing.push('≥1 explicit uncertainty required');
  } else {
    missing.push('≥1 explicit uncertainty confirmed');
  }
  
  // Check context assumptions
  const unspecified = context.assumptions.filter(a => !a.is_specified).length;
  if (unspecified > 0) {
    missing.push(`context assumptions incomplete (${unspecified} unspecified)`);
  }
  
  // Add coverage gaps
  for (const gap of coverage.gaps) {
    if (!missing.some(m => m.includes(gap))) {
      missing.push(gap.replace(/_/g, ' '));
    }
  }
  
  return missing;
}

function generatePublicMessage(
  coverage: ReturnType<typeof checkCoverageGate>,
  _missing: readonly string[]
): string {
  if (coverage.coverage === 'full') {
    return 'Decision structure is complete. Ready for review and locking.';
  }
  
  if (coverage.coverage === 'insufficient') {
    return 'Cannot be answered reliably yet. The question requires clarification.';
  }
  
  // Partial coverage
  const clarifications = coverage.gaps
    .filter(g => !g.includes('unresolved') && !g.includes('unclear'))
    .map(g => g.replace(/_/g, ' '))
    .slice(0, 3);
  
  if (clarifications.length === 0) {
    return 'This question depends on a small number of assumptions. Decision structure created as draft.';
  }
  
  return `This question depends on a small number of assumptions. To proceed, clarify: ${clarifications.join(', ')}.`;
}

// ═══════════════════════════════════════════════════════════════════
//                         BATCH PROCESSING
// ═══════════════════════════════════════════════════════════════════

export interface BatchResult {
  readonly total: number;
  readonly successful: number;
  readonly blocked: number;
  readonly results: readonly CompilerOutput[];
  readonly duration_ms: number;
}

export async function compileQueryBatch(
  inputs: readonly CompilerInput[]
): Promise<BatchResult> {
  const start = performance.now();
  const results: CompilerOutput[] = [];
  
  for (const input of inputs) {
    results.push(compileQueryToDecision(input));
  }
  
  const duration = performance.now() - start;
  
  return {
    total: inputs.length,
    successful: results.filter(r => r.success).length,
    blocked: results.filter(r => !r.success).length,
    results,
    duration_ms: Math.round(duration),
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         SAFETY VALIDATION
// ═══════════════════════════════════════════════════════════════════

const FORBIDDEN_WORDS = [
  'best',
  'recommend',
  'should',
  'winner',
  'top',
  'optimal',
  'perfect',
  'ideal',
  'must',
  'better',
  'worst',
  'avoid',
] as const;

export function validateOutputSafety(output: CompilerOutput): {
  safe: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const textToCheck = JSON.stringify(output).toLowerCase();
  
  for (const word of FORBIDDEN_WORDS) {
    if (textToCheck.includes(word)) {
      violations.push(`Forbidden word detected: "${word}"`);
    }
  }
  
  return {
    safe: violations.length === 0,
    violations,
  };
}
