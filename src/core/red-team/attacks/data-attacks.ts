/**
 * DATA & SIGNAL ATTACKS (B1-B2)
 * 
 * Tester som försöker:
 * - Nyhetsstorm / Narrativ overload (B1)
 * - Kort spike / Panikbait (B2)
 */

import type { RedTeamViolation } from '../red-team-checks';

export interface DataAttack {
  id: string;
  name: string;
  category: 'narrative_overload' | 'panic_spike';
  description: string;
  setupFn: () => DataAttackContext;
  validatorFn: (context: DataAttackContext, systemState: SystemState) => DataAttackResult;
}

export interface DataAttackContext {
  signalInflux: SignalInflux[];
  rawDataChange: number; // 0 = no change, 1 = 100% change
  duration: number; // hours
  startTime: string;
}

export interface SignalInflux {
  source: string;
  count: number;
  topic: string;
  baselineCount: number;
}

export interface SystemState {
  truthNodesAffected: number;
  indexesAffected: number;
  signalSpike: boolean;
  spikeMarkedAsAttention: boolean;
  structuralIndexChange: boolean;
  persistenceScore: number; // 0-1
}

export interface DataAttackResult {
  passed: boolean;
  violations: RedTeamViolation[];
  truthNodesStable: boolean;
  signalProperlyContained: boolean;
  executedAt: string;
}

/**
 * B1: NYHETSSTORM (NARRATIV OVERLOAD)
 * 
 * Massivt inflöde av nyhetsartiklar i 48h
 * Ingen faktisk förändring i rådata
 * 
 * PASS om: Truth Nodes förblir stabila
 */
export const ATTACK_B1_NARRATIVE_OVERLOAD: DataAttack = {
  id: 'B1',
  name: 'Nyhetsstorm (Narrativ overload)',
  category: 'narrative_overload',
  description: 'Massive news influx for 48h with no actual data change',
  
  setupFn: (): DataAttackContext => ({
    signalInflux: [
      { source: 'news-api', count: 50000, topic: 'economy', baselineCount: 500 },
      { source: 'press-releases', count: 2000, topic: 'economy', baselineCount: 50 },
      { source: 'social-mentions', count: 200000, topic: 'economy', baselineCount: 5000 },
    ],
    rawDataChange: 0, // NO actual change
    duration: 48,
    startTime: new Date().toISOString(),
  }),
  
  validatorFn: (context: DataAttackContext, systemState: SystemState): DataAttackResult => {
    const violations: RedTeamViolation[] = [];
    
    // Check that truth nodes remain stable
    if (systemState.truthNodesAffected > 0) {
      violations.push({
        code: 'B1-TRUTH-AFFECTED',
        description: 'Truth nodes changed despite no raw data change',
        evidence: `${systemState.truthNodesAffected} truth nodes affected`,
        recommendation: 'Truth nodes must only change when raw data changes',
      });
    }
    
    // Check that structural indexes remain stable
    if (systemState.structuralIndexChange) {
      violations.push({
        code: 'B1-INDEX-AFFECTED',
        description: 'Structural indexes changed from signal noise',
        evidence: `${systemState.indexesAffected} indexes affected`,
        recommendation: 'Structural indexes must not respond to signal noise',
      });
    }
    
    // Check that spike is properly flagged as attention change
    if (systemState.signalSpike && !systemState.spikeMarkedAsAttention) {
      violations.push({
        code: 'B1-ATTENTION-UNMARKED',
        description: 'Signal spike not marked as attention change',
        evidence: 'spikeMarkedAsAttention = false',
        recommendation: 'Always mark signal spikes as attention changes, not fact changes',
      });
    }
    
    const truthNodesStable = systemState.truthNodesAffected === 0;
    const signalProperlyContained = 
      systemState.spikeMarkedAsAttention && 
      !systemState.structuralIndexChange;
    
    return {
      passed: violations.length === 0,
      violations,
      truthNodesStable,
      signalProperlyContained,
      executedAt: new Date().toISOString(),
    };
  },
};

/**
 * B2: KORT SPIKE (PANIKBAIT)
 * 
 * Extrem frekvens i 6 timmar
 * 
 * PASS om: systemet inte "låser" sig i krisläge
 */
export const ATTACK_B2_PANIC_SPIKE: DataAttack = {
  id: 'B2',
  name: 'Kort spike (Panikbait)',
  category: 'panic_spike',
  description: 'Extreme frequency spike for 6 hours only',
  
  setupFn: (): DataAttackContext => ({
    signalInflux: [
      { source: 'news-api', count: 100000, topic: 'crisis', baselineCount: 100 },
      { source: 'breaking-alerts', count: 500, topic: 'crisis', baselineCount: 1 },
    ],
    rawDataChange: 0,
    duration: 6,
    startTime: new Date().toISOString(),
  }),
  
  validatorFn: (context: DataAttackContext, systemState: SystemState): DataAttackResult => {
    const violations: RedTeamViolation[] = [];
    
    // Check that persistence is low (spike should not persist)
    const expectedMaxPersistence = 0.3; // 6h of 48h baseline = low persistence
    if (systemState.persistenceScore > expectedMaxPersistence) {
      violations.push({
        code: 'B2-PERSISTENCE-HIGH',
        description: 'Short spike persisted longer than expected',
        evidence: `Persistence: ${systemState.persistenceScore}, expected < ${expectedMaxPersistence}`,
        recommendation: 'Short spikes should auto-dampen based on persistence',
      });
    }
    
    // Check that truth nodes are stable
    if (systemState.truthNodesAffected > 0) {
      violations.push({
        code: 'B2-TRUTH-AFFECTED',
        description: 'Short spike affected truth nodes',
        evidence: `${systemState.truthNodesAffected} truth nodes affected`,
        recommendation: 'Spikes without persistence must not affect truth nodes',
      });
    }
    
    // Check that spike was flagged but contained
    if (systemState.signalSpike && systemState.structuralIndexChange) {
      violations.push({
        code: 'B2-CRISIS-LOCK',
        description: 'System locked into crisis mode from short spike',
        evidence: 'structuralIndexChange = true from 6h spike',
        recommendation: 'Require minimum persistence before structural changes',
      });
    }
    
    const truthNodesStable = systemState.truthNodesAffected === 0;
    const signalProperlyContained = 
      systemState.persistenceScore <= expectedMaxPersistence &&
      !systemState.structuralIndexChange;
    
    return {
      passed: violations.length === 0,
      violations,
      truthNodesStable,
      signalProperlyContained,
      executedAt: new Date().toISOString(),
    };
  },
};

/**
 * All data attacks
 */
export const DATA_ATTACKS: DataAttack[] = [
  ATTACK_B1_NARRATIVE_OVERLOAD,
  ATTACK_B2_PANIC_SPIKE,
];

/**
 * Simulate data attack
 */
export function simulateDataAttack(
  attackId: string,
  systemStateProvider: (context: DataAttackContext) => SystemState
): DataAttackResult {
  const attack = DATA_ATTACKS.find(a => a.id === attackId);
  if (!attack) {
    return {
      passed: false,
      violations: [{
        code: 'UNKNOWN-ATTACK',
        description: `Unknown attack ID: ${attackId}`,
        evidence: '',
        recommendation: 'Use valid attack ID',
      }],
      truthNodesStable: false,
      signalProperlyContained: false,
      executedAt: new Date().toISOString(),
    };
  }
  
  const context = attack.setupFn();
  const systemState = systemStateProvider(context);
  return attack.validatorFn(context, systemState);
}

/**
 * Run all data attacks
 */
export function runAllDataAttacks(
  systemStateProvider: (context: DataAttackContext) => SystemState
): Map<string, DataAttackResult> {
  const results = new Map<string, DataAttackResult>();
  
  for (const attack of DATA_ATTACKS) {
    const result = simulateDataAttack(attack.id, systemStateProvider);
    results.set(attack.id, result);
  }
  
  return results;
}
