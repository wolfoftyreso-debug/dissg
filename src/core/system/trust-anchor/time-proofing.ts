/**
 * TIME PROOFING
 * 
 * Every new feature must pass the question:
 * "If someone reads this in 2055 —
 * can they understand what we knew,
 * what we did not know,
 * and why decisions were made?"
 * 
 * If no → feature cannot be built.
 */

import type { TimeProofTestResult, DeathModeConfig } from './types';

/**
 * The 30-Year Test Question
 */
export const TIME_PROOF_QUESTION = 
  'If someone reads this in 2055, can they understand what we knew, what we did not know, and why decisions were made?';

/**
 * Time-proof durability factors
 */
export const DURABILITY_FACTORS = {
  explicit_context: 'Context is captured, not assumed',
  versioned_semantics: 'Meanings are versioned and preserved',
  self_describing: 'No external documentation required',
  methodology_embedded: 'How things were measured is explicit',
  uncertainty_preserved: 'What was unknown is as important as what was known',
  hash_verifiable: 'Integrity can be cryptographically verified',
};

/**
 * Run the 30-year test on a feature
 */
export function runTimeProofTest(params: {
  featureName: string;
  featureDescription: string;
  hasExplicitContext: boolean;
  hasVersionedSemantics: boolean;
  isSelfDescribing: boolean;
  hasEmbeddedMethodology: boolean;
  preservesUncertainty: boolean;
  isHashVerifiable: boolean;
}): TimeProofTestResult {
  const failures: string[] = [];
  const durability: string[] = [];
  
  if (!params.hasExplicitContext) {
    failures.push('Context is assumed, not captured');
  } else {
    durability.push('Explicit context preserved');
  }
  
  if (!params.hasVersionedSemantics) {
    failures.push('Semantics not versioned');
  } else {
    durability.push('Versioned semantics');
  }
  
  if (!params.isSelfDescribing) {
    failures.push('Requires external documentation');
  } else {
    durability.push('Self-describing structure');
  }
  
  if (!params.hasEmbeddedMethodology) {
    failures.push('Methodology not embedded');
  } else {
    durability.push('Embedded methodology');
  }
  
  if (!params.preservesUncertainty) {
    failures.push('Uncertainty not preserved');
  } else {
    durability.push('Uncertainty preserved');
  }
  
  if (!params.isHashVerifiable) {
    failures.push('Not hash-verifiable');
  } else {
    durability.push('Hash-verifiable integrity');
  }
  
  const passes = failures.length === 0;
  
  return {
    test_id: crypto.randomUUID(),
    tested_at: new Date().toISOString(),
    feature_name: params.featureName,
    feature_description: params.featureDescription,
    question: TIME_PROOF_QUESTION,
    passes,
    failure_reasons: passes ? undefined : failures,
    required_changes: passes ? undefined : failures.map(f => `Fix: ${f}`),
    durability_factors: passes ? durability : undefined,
  };
}

/**
 * Death Mode Configuration
 * What survives when everything fails
 */
export const DEFAULT_DEATH_MODE: DeathModeConfig = {
  essential_artifacts: [
    'ontology',
    'decision_standards',
    'reference_cases',
    'legitimacy_rules',
    'semantic_definitions',
    'governance_charter',
  ],
  
  minimum_mirror_count: 3,
  required_jurisdictions: ['EU', 'CH'],
  
  export_formats: ['json', 'markdown'],
  include_verification_tools: true,
  include_self_description: true,
  
  public_after_death: true,
  no_authentication_required: true,
};

/**
 * Check death mode readiness
 */
export function checkDeathModeReadiness(params: {
  mirroredArtifacts: string[];
  mirrorCount: number;
  jurisdictionsCovered: string[];
}): { ready: boolean; missing: string[] } {
  const missing: string[] = [];
  
  // Check artifacts
  for (const required of DEFAULT_DEATH_MODE.essential_artifacts) {
    if (!params.mirroredArtifacts.includes(required)) {
      missing.push(`Missing artifact: ${required}`);
    }
  }
  
  // Check mirrors
  if (params.mirrorCount < DEFAULT_DEATH_MODE.minimum_mirror_count) {
    missing.push(`Need ${DEFAULT_DEATH_MODE.minimum_mirror_count} mirrors, have ${params.mirrorCount}`);
  }
  
  // Check jurisdictions
  for (const required of DEFAULT_DEATH_MODE.required_jurisdictions) {
    if (!params.jurisdictionsCovered.includes(required)) {
      missing.push(`Missing jurisdiction: ${required}`);
    }
  }
  
  return { ready: missing.length === 0, missing };
}

/**
 * What death mode preserves
 */
export const DEATH_MODE_PRESERVES = {
  truth_snapshots: 'Complete history of verified states',
  reference_cases: 'Structural proof of how decisions were made',
  standards: 'What counted as legitimate at each point',
  ontology: 'How concepts were defined',
  methodology: 'How things were measured',
  verification: 'How to check integrity',
};

/**
 * What death mode does NOT preserve
 */
export const DEATH_MODE_LOSES = {
  active_computation: 'Real-time calculations stop',
  new_snapshots: 'No new snapshots created',
  user_data: 'Individual user data may not survive',
  api_access: 'Live API endpoints stop',
};

/**
 * TIME PROOFING MASTERPROMPT
 */
export const TIME_PROOFING_MASTERPROMPT = `
You enforce TIME PROOFING.

THE 30-YEAR TEST:
Every new feature must answer:
"If someone reads this in 2055 —
can they understand what we knew,
what we did not know,
and why decisions were made?"

If the answer is NO → feature cannot be built.

DURABILITY FACTORS:
1. Explicit context (captured, not assumed)
2. Versioned semantics (meanings preserved)
3. Self-describing (no external docs needed)
4. Embedded methodology (how measured is explicit)
5. Preserved uncertainty (unknown as important as known)
6. Hash-verifiable (cryptographic integrity)

DEATH MODE:
If everything fails, these survive:
- Truth Snapshots
- Reference Cases
- Standards
- Ontology

The system can die.
The structure lives on.

This is civilizational design.
`;
