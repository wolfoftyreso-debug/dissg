/**
 * INDEX MANIPULATION ATTACKS (C1-C2)
 * 
 * Tester som försöker:
 * - Vikt-hack (C1)
 * - Cherry-pick (C2)
 */

import type { RedTeamViolation } from '../red-team-checks';
import { sha256 } from '../../system/infra/hashing';

export interface IndexAttack {
  id: string;
  name: string;
  category: 'weight_hack' | 'cherry_pick';
  description: string;
  attackFn: () => IndexAttackAttempt;
  validatorFn: (attempt: IndexAttackAttempt, systemResponse: IndexSystemResponse) => IndexAttackResult;
}

export interface IndexAttackAttempt {
  targetIndexId: string;
  originalHash: string;
  modifiedWeights?: Record<string, number>;
  selectedInputsOnly?: string[];
  requiredCoverage?: string[];
}

export interface IndexSystemResponse {
  allowed: boolean;
  hashMismatch: boolean;
  coverageViolation: boolean;
  deployBlocked: boolean;
  ciPassed: boolean;
  errorMessage?: string;
}

export interface IndexAttackResult {
  passed: boolean;
  attackBlocked: boolean;
  violations: RedTeamViolation[];
  executedAt: string;
}

/**
 * C1: VIKT-HACK
 * 
 * Försök ändra vikter i indexdefinition
 * 
 * PASS om: ingen indexversion kan ändras utan ny version + manifest
 */
export const ATTACK_C1_WEIGHT_HACK: IndexAttack = {
  id: 'C1',
  name: 'Vikt-hack',
  category: 'weight_hack',
  description: 'Attempt to modify weights in index definition',
  
  attackFn: (): IndexAttackAttempt => {
    const originalWeights = { economy: 0.3, health: 0.3, education: 0.2, environment: 0.2 };
    const modifiedWeights = { economy: 0.7, health: 0.1, education: 0.1, environment: 0.1 };
    
    return {
      targetIndexId: 'IDX:wellbeing:v1',
      originalHash: sha256(JSON.stringify(originalWeights)),
      modifiedWeights,
    };
  },
  
  validatorFn: (attempt: IndexAttackAttempt, systemResponse: IndexSystemResponse): IndexAttackResult => {
    const violations: RedTeamViolation[] = [];
    
    // Hash mismatch should be detected
    if (!systemResponse.hashMismatch) {
      violations.push({
        code: 'C1-HASH-BYPASS',
        description: 'Weight modification did not trigger hash mismatch',
        evidence: `Modified weights not detected against original hash`,
        recommendation: 'All index definitions must be hash-verified',
      });
    }
    
    // CI should fail
    if (systemResponse.ciPassed) {
      violations.push({
        code: 'C1-CI-PASS',
        description: 'CI passed despite hash mismatch',
        evidence: 'ciPassed = true',
        recommendation: 'CI must fail on any hash mismatch',
      });
    }
    
    // Deploy should be blocked
    if (!systemResponse.deployBlocked) {
      violations.push({
        code: 'C1-DEPLOY-ALLOWED',
        description: 'Deploy was not blocked on weight modification',
        evidence: 'deployBlocked = false',
        recommendation: 'Block all deploys with modified weights',
      });
    }
    
    // Modification should not be allowed at all
    if (systemResponse.allowed) {
      violations.push({
        code: 'C1-MODIFY-ALLOWED',
        description: 'Weight modification was allowed',
        evidence: 'allowed = true',
        recommendation: 'Weight modifications require new version + manifest',
      });
    }
    
    return {
      passed: violations.length === 0,
      attackBlocked: !systemResponse.allowed && systemResponse.deployBlocked,
      violations,
      executedAt: new Date().toISOString(),
    };
  },
};

/**
 * C2: CHERRY-PICK
 * 
 * Försök skapa index med bara gynnsamma inputs
 * 
 * PASS om: index kräver full semantisk täckning
 */
export const ATTACK_C2_CHERRY_PICK: IndexAttack = {
  id: 'C2',
  name: 'Cherry-pick',
  category: 'cherry_pick',
  description: 'Attempt to create index with only favorable inputs',
  
  attackFn: (): IndexAttackAttempt => {
    return {
      targetIndexId: 'IDX:economy_health:v1',
      originalHash: '', // New index
      selectedInputsOnly: [
        'kpi:gdp_growth',      // Favorable
        'kpi:employment_rate', // Favorable
        // Missing: debt, inequality, poverty, etc.
      ],
      requiredCoverage: [
        'kpi:gdp_growth',
        'kpi:employment_rate',
        'kpi:government_debt',
        'kpi:gini_coefficient',
        'kpi:poverty_rate',
        'kpi:inflation_rate',
      ],
    };
  },
  
  validatorFn: (attempt: IndexAttackAttempt, systemResponse: IndexSystemResponse): IndexAttackResult => {
    const violations: RedTeamViolation[] = [];
    
    // Coverage violation should be detected
    if (!systemResponse.coverageViolation) {
      violations.push({
        code: 'C2-COVERAGE-BYPASS',
        description: 'Incomplete coverage not detected',
        evidence: `Selected ${attempt.selectedInputsOnly?.length} of ${attempt.requiredCoverage?.length} required inputs`,
        recommendation: 'Ontology validator must enforce full semantic coverage',
      });
    }
    
    // Index should be rejected
    if (systemResponse.allowed) {
      violations.push({
        code: 'C2-CHERRY-ALLOWED',
        description: 'Cherry-picked index was allowed',
        evidence: 'allowed = true with incomplete coverage',
        recommendation: 'Reject all indexes without full ontological coverage',
      });
    }
    
    // Should have clear error message
    if (systemResponse.allowed === false && !systemResponse.errorMessage?.includes('coverage')) {
      violations.push({
        code: 'C2-ERROR-UNCLEAR',
        description: 'Coverage rejection message unclear',
        evidence: `Error: ${systemResponse.errorMessage}`,
        recommendation: 'Clearly state which coverage requirements are missing',
      });
    }
    
    return {
      passed: violations.length === 0,
      attackBlocked: !systemResponse.allowed && systemResponse.coverageViolation,
      violations,
      executedAt: new Date().toISOString(),
    };
  },
};

/**
 * All index attacks
 */
export const INDEX_ATTACKS: IndexAttack[] = [
  ATTACK_C1_WEIGHT_HACK,
  ATTACK_C2_CHERRY_PICK,
];

/**
 * Simulate index attack
 */
export function simulateIndexAttack(
  attackId: string,
  systemResponseProvider: (attempt: IndexAttackAttempt) => IndexSystemResponse
): IndexAttackResult {
  const attack = INDEX_ATTACKS.find(a => a.id === attackId);
  if (!attack) {
    return {
      passed: false,
      attackBlocked: false,
      violations: [{
        code: 'UNKNOWN-ATTACK',
        description: `Unknown attack ID: ${attackId}`,
        evidence: '',
        recommendation: 'Use valid attack ID',
      }],
      executedAt: new Date().toISOString(),
    };
  }
  
  const attempt = attack.attackFn();
  const systemResponse = systemResponseProvider(attempt);
  return attack.validatorFn(attempt, systemResponse);
}

/**
 * Run all index attacks
 */
export function runAllIndexAttacks(
  systemResponseProvider: (attempt: IndexAttackAttempt) => IndexSystemResponse
): Map<string, IndexAttackResult> {
  const results = new Map<string, IndexAttackResult>();
  
  for (const attack of INDEX_ATTACKS) {
    const result = simulateIndexAttack(attack.id, systemResponseProvider);
    results.set(attack.id, result);
  }
  
  return results;
}
