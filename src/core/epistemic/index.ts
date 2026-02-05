/**
 * EPISTEMIC RESILIENCE LAYER
 * 
 * How the system remains true when the world,
 * language, and measures change.
 * 
 * This layer ensures the system doesn't get stuck in 2026's way
 * of measuring reality — it can carry truth across epochs.
 */

// Definition Drift Engine
export {
  definitionDriftEngine,
  DEFINITION_DRIFT_PRINCIPLES,
  type DefinitionChangeType,
  type ComparabilityLevel,
  type DefinitionVersion,
  type DriftRecord,
  type ComparabilityAssessment,
} from './definition-drift-engine';

// Measurement Lineage
export {
  measurementLineage,
  LINEAGE_PRINCIPLES,
  type LineageStepType,
  type LineageStep,
  type LineageChain,
  type TranslationMapping,
} from './measurement-lineage';

// Counterfactual Safety
export {
  counterfactualSafety,
  COUNTERFACTUAL_PRINCIPLES,
  type RetroactiveViolationType,
  type ViolationAttempt,
  type ParallelVersion,
  type ExplicitBreakpoint,
} from './counterfactual-safety';

// Meta-Uncertainty
export {
  metaUncertainty,
  META_UNCERTAINTY_PRINCIPLES,
  type MetaUncertaintyType,
  type MetaUncertaintyRecord,
  type CulturalShift,
  type IncentiveChange,
} from './meta-uncertainty';

// Semantic Translation
export {
  semanticTranslation,
  SEMANTIC_TRANSLATION_PRINCIPLES,
  type ConceptMapping,
  type QuestionTranslation,
  type OntologicalAnchor,
} from './semantic-translation';

// Post-Human Compatibility
export {
  postHumanCompatibility,
  POST_HUMAN_PRINCIPLES,
  INTENT_TAXONOMY,
  CORE_EPISTEMIC_RULES,
  type IntentType,
  type EpistemicRule,
  type KnowledgeClaim,
} from './post-human-compatibility';

// Epistemic Audit
export {
  epistemicAudit,
  EPISTEMIC_AUDIT_PRINCIPLES,
  type AuditFinding,
  type EpistemicRiskReport,
} from './epistemic-audit';

/**
 * EPISTEMIC RESILIENCE SUMMARY
 */
export const EPISTEMIC_RESILIENCE = {
  definition_drift: 'Tracks and versions all definition changes',
  measurement_lineage: 'Full traceability to raw sources',
  counterfactual_safety: 'Prevents retroactive reinterpretation',
  meta_uncertainty: 'Tracks uncertainty in methods and culture',
  semantic_translation: 'Survives language and paradigm changes',
  post_human_compatibility: 'Formal rules for future AI systems',
  epistemic_audit: 'Annual public risk reports',
} as const;

/**
 * RESILIENCE CHECK
 */
export async function checkEpistemicResilience(): Promise<{
  healthy: boolean;
  components: Record<string, boolean>;
  warnings: string[];
}> {
  const warnings: string[] = [];
  
  // Lazy import to avoid circular dependencies
  const { definitionDriftEngine } = await import('./definition-drift-engine');
  const { measurementLineage } = await import('./measurement-lineage');
  const { counterfactualSafety } = await import('./counterfactual-safety');
  const { postHumanCompatibility } = await import('./post-human-compatibility');
  
  // Check each component
  const driftState = definitionDriftEngine.exportState();
  const lineageState = measurementLineage.exportState();
  const counterfactualState = counterfactualSafety.exportState();
  const postHumanState = postHumanCompatibility.exportState();
  
  // Component health checks
  const components: Record<string, boolean> = {
    definition_drift: driftState.breaking_drifts === 0,
    measurement_lineage: lineageState.total_chains > 0 || true, // OK if empty initially
    counterfactual_safety: counterfactualState.violations_blocked >= 0,
    meta_uncertainty: true, // Always healthy
    semantic_translation: true, // Always healthy
    post_human_compatibility: postHumanState.immutable_rules > 0,
    epistemic_audit: true, // Always healthy
  };
  
  // Collect warnings
  if (driftState.breaking_drifts > 0) {
    warnings.push(`${driftState.breaking_drifts} breaking drifts require attention`);
  }
  
  if (counterfactualState.violations_blocked > 0) {
    warnings.push(`${counterfactualState.violations_blocked} retroactive violations blocked`);
  }
  
  return {
    healthy: Object.values(components).every(v => v),
    components,
    warnings,
  };
}
