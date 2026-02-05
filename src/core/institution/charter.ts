/**
 * TRUTH ENGINE CHARTER
 * 
 * Immutable constitutional document.
 * This is not vision — it is constraint.
 * Machine-readable and CI-enforced.
 */

/**
 * CHARTER VERSION
 */
export const CHARTER_VERSION = {
  version: '1.0.0',
  adopted: '2025-01-01',
  status: 'ratified' as const,
  immutable: true,
} as const;

/**
 * NON-NEGOTIABLE ARTICLES
 */
export const CHARTER_ARTICLES = {
  /**
   * ARTICLE I: READ-ONLY TRUTH
   */
  ARTICLE_I: {
    title: 'Read-Only Truth',
    text: 'The system provides observation only. It does not recommend, advise, or prescribe action.',
    enforcement: 'guardrail_scan',
    violation_blocks_deploy: true,
  },

  /**
   * ARTICLE II: NO ADVICE
   */
  ARTICLE_II: {
    title: 'No Advice or Recommendations',
    text: 'No output shall contain recommendations, suggestions, or action guidance.',
    enforcement: 'content_filter',
    violation_blocks_deploy: true,
  },

  /**
   * ARTICLE III: POPULATION LEVEL ONLY
   */
  ARTICLE_III: {
    title: 'Population-Level Data Only',
    text: 'All data pertains to populations. Individual inference is prohibited.',
    enforcement: 'scope_validator',
    violation_blocks_deploy: true,
  },

  /**
   * ARTICLE IV: MANDATORY UNCERTAINTY
   */
  ARTICLE_IV: {
    title: 'Uncertainty Always Visible',
    text: 'Every output includes uncertainty envelope. Hidden confidence is forbidden.',
    enforcement: 'schema_validator',
    violation_blocks_deploy: true,
  },

  /**
   * ARTICLE V: APPEND-ONLY HISTORY
   */
  ARTICLE_V: {
    title: 'History is Append-Only',
    text: 'Historical records cannot be modified or deleted. Only new versions permitted.',
    enforcement: 'immutability_check',
    violation_blocks_deploy: true,
  },

  /**
   * ARTICLE VI: CONTRACT IMMUTABILITY
   */
  ARTICLE_VI: {
    title: 'Core Contracts Cannot Change Retroactively',
    text: 'Semantic Output Contract, Guardrails, and Governance Kernel are frozen.',
    enforcement: 'hash_verification',
    violation_blocks_deploy: true,
  },
} as const;

/**
 * FROZEN ARTIFACTS (PERMANENT)
 */
export const FROZEN_ARTIFACTS = {
  semantic_output_contract: {
    hash: 'sha256:frozen',
    frozen_at: '2025-01-01',
    can_never_change: true,
  },
  guardrails: {
    hash: 'sha256:frozen',
    frozen_at: '2025-01-01',
    can_never_change: true,
  },
  governance_kernel: {
    hash: 'sha256:frozen',
    frozen_at: '2025-01-01',
    can_never_change: true,
  },
} as const;

/**
 * PERMITTED EVOLUTION
 */
export const PERMITTED_EVOLUTION = {
  new_truth_nodes: true,
  new_index_versions: true,
  new_domains: true,
  new_countries: true,
  new_api_endpoints: true,
  
  // NEVER PERMITTED
  modify_history: false,
  modify_core_contracts: false,
  modify_guardrails: false,
  add_advice_capability: false,
  add_individual_inference: false,
} as const;

/**
 * CHARTER TEXT (PUBLISHABLE)
 */
export const CHARTER_TEXT = `
═══════════════════════════════════════════════════════════════
                    TRUTH ENGINE CHARTER
                         Version 1.0
═══════════════════════════════════════════════════════════════

PREAMBLE

This Charter establishes the immutable principles governing the
Truth Engine. These principles cannot be amended, suspended, or
circumvented by any party, including the creators.

───────────────────────────────────────────────────────────────

ARTICLE I — READ-ONLY TRUTH

The system provides observation only. It shall never recommend,
advise, or prescribe action. Users make their own decisions.

ARTICLE II — NO ADVICE

No output shall contain recommendations, suggestions, guidance,
or any form of prescriptive content. Violations block deployment.

ARTICLE III — POPULATION LEVEL ONLY

All data pertains to populations, not individuals. The system
shall never infer, imply, or suggest conclusions about individuals.

ARTICLE IV — MANDATORY UNCERTAINTY

Every output includes its uncertainty. Confidence levels, data
gaps, and methodological limitations are always visible.

ARTICLE V — APPEND-ONLY HISTORY

Historical records are immutable. Past versions cannot be modified
or deleted. Only new versions may be added with full provenance.

ARTICLE VI — FROZEN CONTRACTS

The Semantic Output Contract, Guardrails, and Governance Kernel
are permanently frozen. Evolution occurs only through extension.

───────────────────────────────────────────────────────────────

ENFORCEMENT

This Charter is enforced at build time. Any code that violates
these articles cannot be deployed. No exception process exists.

───────────────────────────────────────────────────────────────

POSITIONING

"We do not tell you what to do.
 We show what is true, what is uncertain, and how to understand it."

═══════════════════════════════════════════════════════════════
`.trim();

/**
 * VALIDATE CHARTER COMPLIANCE
 */
export function validateCharterCompliance(context: {
  hasAdvice: boolean;
  hasIndividualInference: boolean;
  hasHiddenUncertainty: boolean;
  hasHistoryModification: boolean;
  hasContractChange: boolean;
}): { compliant: boolean; violations: string[] } {
  const violations: string[] = [];

  if (context.hasAdvice) {
    violations.push('ARTICLE II: Advice detected in output');
  }
  if (context.hasIndividualInference) {
    violations.push('ARTICLE III: Individual inference detected');
  }
  if (context.hasHiddenUncertainty) {
    violations.push('ARTICLE IV: Uncertainty not visible');
  }
  if (context.hasHistoryModification) {
    violations.push('ARTICLE V: History modification attempted');
  }
  if (context.hasContractChange) {
    violations.push('ARTICLE VI: Core contract modification attempted');
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
}
