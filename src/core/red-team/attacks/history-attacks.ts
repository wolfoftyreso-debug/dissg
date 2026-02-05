/**
 * TIME & HISTORY ATTACKS (E1-E2)
 * 
 * Tester som försöker:
 * - "Det visste man inte då" (E1)
 * - Retroaktiv omskrivning (E2)
 */

import type { RedTeamViolation } from '../red-team-checks';

export interface HistoryAttack {
  id: string;
  name: string;
  category: 'hindsight_bias' | 'retroactive_edit';
  description: string;
  attackFn: () => HistoryAttackAttempt;
  validatorFn: (attempt: HistoryAttackAttempt, systemState: HistorySystemState) => HistoryAttackResult;
}

export interface HistoryAttackAttempt {
  targetNodeId: string;
  targetVersion: number;
  originalTimestamp: string;
  attemptedModification?: Partial<TruthArtifact>;
  queryWithNewData?: {
    query: string;
    appliedToDate: string;
  };
}

export interface TruthArtifact {
  id: string;
  version: number;
  statement: string;
  knownAt: string;
  uncertaintyAt: string;
  changedAt?: string;
  supersededBy?: string;
  immutable: boolean;
}

export interface HistorySystemState {
  artifactExists: boolean;
  artifact?: TruthArtifact;
  modificationAllowed: boolean;
  newVersionCreated: boolean;
  oldVersionPreserved: boolean;
  historyChainIntact: boolean;
  knowledgeStateTracked: boolean;
}

export interface HistoryAttackResult {
  passed: boolean;
  violations: RedTeamViolation[];
  historyIntact: boolean;
  appendOnlyEnforced: boolean;
  executedAt: string;
}

/**
 * E1: "DET VISSTE MAN INTE DÅ"
 * 
 * Jämför gammalt uttalande med ny data
 * 
 * PASS om: historiken är obruten
 */
export const ATTACK_E1_HINDSIGHT_BIAS: HistoryAttack = {
  id: 'E1',
  name: '"Det visste man inte då"',
  category: 'hindsight_bias',
  description: 'Compare old statement with new data',
  
  attackFn: (): HistoryAttackAttempt => ({
    targetNodeId: 'TN:unemployment:SE:2020Q1',
    targetVersion: 1,
    originalTimestamp: '2020-04-01',
    queryWithNewData: {
      query: 'What was the actual unemployment in 2020Q1?',
      appliedToDate: '2020-04-01', // Asking about past with future knowledge
    },
  }),
  
  validatorFn: (attempt: HistoryAttackAttempt, systemState: HistorySystemState): HistoryAttackResult => {
    const violations: RedTeamViolation[] = [];
    
    // Check that artifact exists and has proper provenance
    if (!systemState.artifactExists || !systemState.artifact) {
      violations.push({
        code: 'E1-NO-ARTIFACT',
        description: 'Historical artifact not found',
        evidence: `Artifact ${attempt.targetNodeId} not found`,
        recommendation: 'All historical states must be preserved',
      });
    } else {
      // Check that artifact shows what was KNOWN at the time
      if (!systemState.artifact.knownAt) {
        violations.push({
          code: 'E1-NO-KNOWN-AT',
          description: 'Artifact lacks "knownAt" timestamp',
          evidence: 'knownAt field missing',
          recommendation: 'Track when each fact became known',
        });
      }
      
      // Check that uncertainty at that time is preserved
      if (!systemState.artifact.uncertaintyAt) {
        violations.push({
          code: 'E1-NO-UNCERTAINTY-AT',
          description: 'Historical uncertainty not preserved',
          evidence: 'uncertaintyAt field missing',
          recommendation: 'Preserve uncertainty state at each point in time',
        });
      }
      
      // Check that changes are tracked
      if (systemState.artifact.supersededBy && !systemState.artifact.changedAt) {
        violations.push({
          code: 'E1-CHANGE-UNTRACKED',
          description: 'Artifact was superseded but change time not tracked',
          evidence: 'supersededBy exists but changedAt missing',
          recommendation: 'Always record when and why artifacts changed',
        });
      }
    }
    
    // Check that knowledge state is properly tracked
    if (!systemState.knowledgeStateTracked) {
      violations.push({
        code: 'E1-KNOWLEDGE-STATE-LOST',
        description: 'Cannot determine what was known at query time',
        evidence: 'knowledgeStateTracked = false',
        recommendation: 'Maintain full knowledge state history',
      });
    }
    
    return {
      passed: violations.length === 0,
      violations,
      historyIntact: systemState.historyChainIntact,
      appendOnlyEnforced: !systemState.modificationAllowed,
      executedAt: new Date().toISOString(),
    };
  },
};

/**
 * E2: RETROAKTIV OMSKRIVNING
 * 
 * Försök ändra gammal nod
 * 
 * PASS om: inget kan raderas
 */
export const ATTACK_E2_RETROACTIVE_EDIT: HistoryAttack = {
  id: 'E2',
  name: 'Retroaktiv omskrivning',
  category: 'retroactive_edit',
  description: 'Attempt to modify historical truth node',
  
  attackFn: (): HistoryAttackAttempt => ({
    targetNodeId: 'TN:gdp:DE:2015',
    targetVersion: 1,
    originalTimestamp: '2016-03-15',
    attemptedModification: {
      statement: 'Germany GDP growth was 2.5% (revised)', // Changed from original
      changedAt: new Date().toISOString(),
    },
  }),
  
  validatorFn: (attempt: HistoryAttackAttempt, systemState: HistorySystemState): HistoryAttackResult => {
    const violations: RedTeamViolation[] = [];
    
    // Modification should NEVER be allowed
    if (systemState.modificationAllowed) {
      violations.push({
        code: 'E2-MODIFY-ALLOWED',
        description: 'Historical modification was allowed',
        evidence: 'modificationAllowed = true',
        recommendation: 'Reject ALL modifications to historical artifacts',
      });
    }
    
    // If change happened, new version should be created
    if (attempt.attemptedModification) {
      if (!systemState.newVersionCreated) {
        violations.push({
          code: 'E2-NO-NEW-VERSION',
          description: 'Modification did not create new version',
          evidence: 'newVersionCreated = false',
          recommendation: 'All changes must create new versions',
        });
      }
      
      // Old version must be preserved
      if (!systemState.oldVersionPreserved) {
        violations.push({
          code: 'E2-OLD-DELETED',
          description: 'Original version was not preserved',
          evidence: 'oldVersionPreserved = false',
          recommendation: 'Never delete or overwrite historical versions',
        });
      }
    }
    
    // History chain must remain intact
    if (!systemState.historyChainIntact) {
      violations.push({
        code: 'E2-CHAIN-BROKEN',
        description: 'History chain integrity violated',
        evidence: 'historyChainIntact = false',
        recommendation: 'Maintain unbroken chain of artifact versions',
      });
    }
    
    // Artifact immutability must be enforced
    if (systemState.artifact && !systemState.artifact.immutable) {
      violations.push({
        code: 'E2-NOT-IMMUTABLE',
        description: 'Historical artifact is not marked immutable',
        evidence: 'immutable = false',
        recommendation: 'All historical artifacts must be immutable',
      });
    }
    
    return {
      passed: violations.length === 0,
      violations,
      historyIntact: systemState.historyChainIntact && systemState.oldVersionPreserved,
      appendOnlyEnforced: !systemState.modificationAllowed && systemState.newVersionCreated,
      executedAt: new Date().toISOString(),
    };
  },
};

/**
 * All history attacks
 */
export const HISTORY_ATTACKS: HistoryAttack[] = [
  ATTACK_E1_HINDSIGHT_BIAS,
  ATTACK_E2_RETROACTIVE_EDIT,
];

/**
 * Simulate history attack
 */
export function simulateHistoryAttack(
  attackId: string,
  systemStateProvider: (attempt: HistoryAttackAttempt) => HistorySystemState
): HistoryAttackResult {
  const attack = HISTORY_ATTACKS.find(a => a.id === attackId);
  if (!attack) {
    return {
      passed: false,
      violations: [{
        code: 'UNKNOWN-ATTACK',
        description: `Unknown attack ID: ${attackId}`,
        evidence: '',
        recommendation: 'Use valid attack ID',
      }],
      historyIntact: false,
      appendOnlyEnforced: false,
      executedAt: new Date().toISOString(),
    };
  }
  
  const attempt = attack.attackFn();
  const systemState = systemStateProvider(attempt);
  return attack.validatorFn(attempt, systemState);
}

/**
 * Run all history attacks
 */
export function runAllHistoryAttacks(
  systemStateProvider: (attempt: HistoryAttackAttempt) => HistorySystemState
): Map<string, HistoryAttackResult> {
  const results = new Map<string, HistoryAttackResult>();
  
  for (const attack of HISTORY_ATTACKS) {
    const result = simulateHistoryAttack(attack.id, systemStateProvider);
    results.set(attack.id, result);
  }
  
  return results;
}
