/**
 * STEP 8: COVERAGE CHECK
 * 
 * Verifies if build is allowed to continue.
 * If build_allowed = false → publish "Cannot be answered reliably yet".
 */

import type { 
  NormalizedIntent, 
  ResolvedEntity, 
  ContextSkeleton, 
  AlternativeSeed,
  UncertaintySeed,
  DecisionBlueprint,
  CoverageResult,
} from '../types';

// ═══════════════════════════════════════════════════════════════════
//                         COVERAGE CHECKER
// ═══════════════════════════════════════════════════════════════════

export interface CoverageInput {
  readonly intent: NormalizedIntent;
  readonly entity: ResolvedEntity;
  readonly context: ContextSkeleton;
  readonly alternatives: readonly AlternativeSeed[];
  readonly uncertainties: readonly UncertaintySeed[];
  readonly blueprint: DecisionBlueprint;
}

export function checkCoverageGate(input: CoverageInput): CoverageResult {
  const gaps: string[] = [];
  
  // Check intent confidence
  if (input.intent.confidence < 0.3) {
    gaps.push('intent_unclear');
  }
  
  // Check entity resolution
  if (input.entity.is_stub) {
    gaps.push('entity_unresolved');
  }
  
  if (input.entity.confidence < 0.5) {
    gaps.push('entity_low_confidence');
  }
  
  // Check unspecified assumptions
  const unspecifiedCount = input.context.assumptions.filter(a => !a.is_specified).length;
  if (unspecifiedCount >= 3) {
    gaps.push('user_profile');
  }
  
  // Check for common critical gaps
  const assumptionTexts = input.context.assumptions.map(a => a.text.toLowerCase());
  
  if (assumptionTexts.some(t => t.includes('budget') && t.includes('unspecified'))) {
    gaps.push('budget');
  }
  
  if (assumptionTexts.some(t => t.includes('usage') && t.includes('unspecified'))) {
    gaps.push('usage_pattern');
  }
  
  if (assumptionTexts.some(t => t.includes('mileage') && t.includes('unspecified'))) {
    gaps.push('annual_mileage');
  }
  
  // Check alternatives
  const realAlternatives = input.alternatives.filter(a => !a.is_placeholder);
  if (realAlternatives.length < input.blueprint.required.alternatives) {
    gaps.push('alternatives_insufficient');
  }
  
  // Determine coverage level and build permission
  const coverage = determineCoverageLevel(gaps);
  const buildAllowed = shouldAllowBuild(coverage);
  
  return {
    coverage,
    gaps,
    build_allowed: buildAllowed,
    reason: buildAllowed ? undefined : generateBlockReason(gaps),
  };
}

function determineCoverageLevel(
  gaps: string[]
): CoverageResult['coverage'] {
  if (gaps.length === 0) {
    return 'full';
  }
  
  // Critical gaps that block completely
  const criticalGaps = ['intent_unclear', 'entity_unresolved'];
  const hasCritical = gaps.some(g => criticalGaps.includes(g));
  
  if (hasCritical || gaps.length > 5) {
    return 'insufficient';
  }
  
  return 'partial';
}

function shouldAllowBuild(
  coverage: CoverageResult['coverage']
): boolean {
  // Only block on truly insufficient coverage
  if (coverage === 'insufficient') {
    return false;
  }
  
  // Partial coverage allows draft creation
  return true;
}

function generateBlockReason(gaps: string[]): string {
  if (gaps.includes('intent_unclear')) {
    return 'Question intent could not be determined with sufficient confidence.';
  }
  
  if (gaps.includes('entity_unresolved')) {
    return 'The subject of the question could not be identified.';
  }
  
  return 'Insufficient information to create a meaningful decision structure.';
}
