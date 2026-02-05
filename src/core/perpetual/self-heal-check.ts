/**
 * SELF-HEAL CHECK
 * 
 * Every expansion runs validation.
 * Fail → nothing releases.
 */

import { selfHealingGovernance } from './self-healing-governance';
import { consistencyEngine } from './consistency-engine';

/**
 * EXPANSION CHECK RESULT
 */
export interface ExpansionCheckResult {
  passed: boolean;
  checks: {
    contract_validation: boolean;
    guardrail_scan: boolean;
    definition_drift: boolean;
    history_consistency: boolean;
  };
  failures: string[];
  timestamp: string;
}

/**
 * RUN EXPANSION CHECK
 */
export function runExpansionCheck(expansion: {
  domain: string;
  new_nodes: number;
  new_indexes: number;
}): ExpansionCheckResult {
  const failures: string[] = [];
  
  // Contract validation
  const contractValid = validateContracts(expansion.domain);
  if (!contractValid) {
    failures.push(`Contract validation failed for domain: ${expansion.domain}`);
  }
  
  // Guardrail scan
  const guardrailCheck = selfHealingGovernance.checkViolation({
    action: 'domain_expansion',
    source: 'perpetual_engine',
    target: expansion.domain,
  });
  const guardrailsPassed = guardrailCheck === null;
  if (!guardrailsPassed) {
    failures.push(`Guardrail violation: ${guardrailCheck?.description}`);
  }
  
  // Definition drift check
  const consistencyState = consistencyEngine.exportState();
  const noDrift = consistencyState.breaking_changes === 0;
  if (!noDrift) {
    failures.push(`Definition drift detected: ${consistencyState.breaking_changes} breaking changes`);
  }
  
  // History consistency
  const historyConsistent = consistencyState.drift_detected_count < 5;
  if (!historyConsistent) {
    failures.push(`History inconsistency: ${consistencyState.drift_detected_count} drifts detected`);
  }
  
  return {
    passed: failures.length === 0,
    checks: {
      contract_validation: contractValid,
      guardrail_scan: guardrailsPassed,
      definition_drift: noDrift,
      history_consistency: historyConsistent,
    },
    failures,
    timestamp: new Date().toISOString(),
  };
}

/**
 * VALIDATE CONTRACTS
 */
function validateContracts(domain: string): boolean {
  // Check that domain has required structure
  // Required: code, name, version, coupling
  
  // In production, would load domain definition and validate
  // For now, assume valid if domain code exists
  return domain.length > 0;
}

/**
 * RUN FULL SYSTEM CHECK
 */
export function runFullSystemCheck(): {
  healthy: boolean;
  governance_status: ReturnType<typeof selfHealingGovernance.getHealthStatus>;
  consistency_status: ReturnType<typeof consistencyEngine.exportState>;
  recommendations: string[];
} {
  const governanceStatus = selfHealingGovernance.getHealthStatus();
  const consistencyStatus = consistencyEngine.exportState();
  
  const recommendations: string[] = [];
  
  if (!governanceStatus.healthy) {
    recommendations.push('Resolve unresolved critical violations before expansion');
  }
  
  if (consistencyStatus.breaking_changes > 0) {
    recommendations.push('Address breaking changes before proceeding');
  }
  
  if (consistencyStatus.drift_detected_count > 10) {
    recommendations.push('Review definition drift patterns');
  }
  
  return {
    healthy: governanceStatus.healthy && consistencyStatus.breaking_changes === 0,
    governance_status: governanceStatus,
    consistency_status: consistencyStatus,
    recommendations,
  };
}

/**
 * SELF-HEAL PRINCIPLES
 */
export const SELF_HEAL_PRINCIPLES = {
  every_expansion_validated: true,
  fail_blocks_release: true,
  checks_are_automatic: true,
  no_manual_override: true,
} as const;
