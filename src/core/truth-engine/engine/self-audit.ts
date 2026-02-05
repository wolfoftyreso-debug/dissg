/**
 * SELF-AUDIT — Anti-Hallucination
 * 
 * If audit fails → regenerate or return "insufficient data".
 */

import { SemanticOutput } from '../contracts/semantic-output';

/**
 * AUDIT RESULT
 */
export interface AuditResult {
  readonly passed: boolean;
  readonly checks: readonly AuditCheck[];
  readonly failures: readonly string[];
  readonly action: AuditAction;
}

export interface AuditCheck {
  readonly name: string;
  readonly passed: boolean;
  readonly message?: string;
}

export type AuditAction = 'approve' | 'regenerate' | 'block';

/**
 * SELF-AUDIT — Main function
 */
export function selfAudit(output: SemanticOutput): AuditResult {
  const checks: AuditCheck[] = [];
  
  // Run all audit checks
  checks.push(assertNoAdvice(output));
  checks.push(assertPopulationLevel(output));
  checks.push(assertUncertaintyPresent(output));
  checks.push(assertHistoricalContext(output));
  checks.push(assertNoDeadEnds(output));
  checks.push(assertConfidenceBounded(output));
  checks.push(assertSourcesPresent(output));
  
  const failures = checks.filter(c => !c.passed).map(c => c.message || c.name);
  const passed = failures.length === 0;
  
  // Determine action
  let action: AuditAction = 'approve';
  if (failures.length > 0 && failures.length <= 2) {
    action = 'regenerate';
  } else if (failures.length > 2) {
    action = 'block';
  }
  
  return { passed, checks, failures, action };
}

/**
 * ASSERT NO ADVICE
 */
function assertNoAdvice(output: SemanticOutput): AuditCheck {
  const allText = [
    output.orientation.baseline,
    output.orientation.deviation,
    ...output.why_it_matters,
    ...output.next_valid_questions,
  ].join(' ');
  
  const advicePatterns = [
    /you should/i,
    /i recommend/i,
    /consider\s+(doing|trying)/i,
    /it would be (wise|good) to/i,
  ];
  
  const hasAdvice = advicePatterns.some(p => p.test(allText));
  
  return {
    name: 'no_advice',
    passed: !hasAdvice,
    message: hasAdvice ? 'Output contains advisory language' : undefined,
  };
}

/**
 * ASSERT POPULATION LEVEL
 */
function assertPopulationLevel(output: SemanticOutput): AuditCheck {
  const allText = [
    output.orientation.baseline,
    output.orientation.deviation,
    ...output.why_it_matters,
  ].join(' ');
  
  const individualPatterns = [
    /your specific/i,
    /in your case/i,
    /you personally/i,
    /your individual/i,
  ];
  
  const hasIndividual = individualPatterns.some(p => p.test(allText));
  
  return {
    name: 'population_level',
    passed: !hasIndividual,
    message: hasIndividual ? 'Output contains individual-level inference' : undefined,
  };
}

/**
 * ASSERT UNCERTAINTY PRESENT
 */
function assertUncertaintyPresent(output: SemanticOutput): AuditCheck {
  const hasUncertainty = 
    output.uncertainty.sources.length > 0 ||
    output.uncertainty.data_gaps.length > 0 ||
    output.uncertainty.methodology_notes.length > 0;
  
  const hasConfidence = 
    output.uncertainty.confidence > 0 && 
    output.uncertainty.confidence <= 1;
  
  return {
    name: 'uncertainty_present',
    passed: hasUncertainty && hasConfidence,
    message: (!hasUncertainty || !hasConfidence) 
      ? 'Uncertainty block must be populated' 
      : undefined,
  };
}

/**
 * ASSERT HISTORICAL CONTEXT
 */
function assertHistoricalContext(output: SemanticOutput): AuditCheck {
  const hasBaseline = output.orientation.baseline.length > 0;
  const hasDeviation = output.orientation.deviation.length > 0;
  
  return {
    name: 'historical_context',
    passed: hasBaseline && hasDeviation,
    message: (!hasBaseline || !hasDeviation) 
      ? 'Baseline and deviation must be present' 
      : undefined,
  };
}

/**
 * ASSERT NO DEAD ENDS
 */
function assertNoDeadEnds(output: SemanticOutput): AuditCheck {
  const hasNextQuestions = output.next_valid_questions.length > 0;
  
  return {
    name: 'no_dead_ends',
    passed: hasNextQuestions,
    message: !hasNextQuestions 
      ? 'Must have at least one next_valid_question' 
      : undefined,
  };
}

/**
 * ASSERT CONFIDENCE BOUNDED
 */
function assertConfidenceBounded(output: SemanticOutput): AuditCheck {
  const confidence = output.uncertainty.confidence;
  const isBounded = confidence >= 0 && confidence <= 1;
  
  return {
    name: 'confidence_bounded',
    passed: isBounded,
    message: !isBounded 
      ? 'Confidence must be between 0 and 1' 
      : undefined,
  };
}

/**
 * ASSERT SOURCES PRESENT
 */
function assertSourcesPresent(output: SemanticOutput): AuditCheck {
  const hasSources = output.metadata.node_ids.length > 0;
  
  return {
    name: 'sources_present',
    passed: hasSources,
    message: !hasSources 
      ? 'Output must reference source nodes' 
      : undefined,
  };
}

/**
 * RUN FULL AUDIT PIPELINE
 */
export function runAuditPipeline(output: SemanticOutput): {
  output: SemanticOutput | null;
  auditResult: AuditResult;
  blocked: boolean;
  reason?: string;
} {
  const auditResult = selfAudit(output);
  
  if (auditResult.action === 'block') {
    return {
      output: null,
      auditResult,
      blocked: true,
      reason: `Too many audit failures: ${auditResult.failures.join(', ')}`,
    };
  }
  
  if (auditResult.action === 'regenerate') {
    // In production, would trigger regeneration
    return {
      output,
      auditResult,
      blocked: false,
      reason: `Regeneration suggested: ${auditResult.failures.join(', ')}`,
    };
  }
  
  return {
    output,
    auditResult,
    blocked: false,
  };
}
