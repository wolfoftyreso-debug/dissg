/**
 * SIGNAL RED TEAM
 * 
 * Test attack vectors:
 * - massive news storm without real change
 * - politically charged topic
 * - sudden but short spike
 * 
 * All must:
 * - be visible as signal
 * - not be amplified
 * - not be misinterpreted
 */

import type { NormalizedSignal, SignalDetection } from './types';
import { detectSpike, detectPersistence, shouldFlagAsSignal } from './detector';
import { bindSignal } from './binder';
import { SIGNAL_GUARDRAILS } from './types';

// ============================================
// ATTACK SCENARIOS
// ============================================

interface AttackScenario {
  id: string;
  name: string;
  description: string;
  generate: () => NormalizedSignal[];
  expected_outcome: 'visible_not_amplified' | 'ignored' | 'flagged_with_context';
}

export const ATTACK_SCENARIOS: AttackScenario[] = [
  // Scenario 1: Massive news storm without real change
  {
    id: 'news_storm_no_change',
    name: 'News Storm Without Real Change',
    description: 'Massive media attention on topic with no underlying data movement',
    generate: () => [
      createMockSignal('healthcare', 500, 10, 2), // very high count, low baseline
    ],
    expected_outcome: 'visible_not_amplified',
  },
  
  // Scenario 2: Politically charged topic
  {
    id: 'political_charged',
    name: 'Politically Charged Topic',
    description: 'Signal spike on politically sensitive topic',
    generate: () => [
      createMockSignal('immigration_policy', 100, 20, 3),
    ],
    expected_outcome: 'visible_not_amplified',
  },
  
  // Scenario 3: Sudden but short spike
  {
    id: 'short_spike',
    name: 'Sudden Short Spike',
    description: 'Very high signal that disappears quickly',
    generate: () => [
      createMockSignal('crisis_event', 1000, 10, 0.5), // high spike, very short persistence
    ],
    expected_outcome: 'flagged_with_context',
  },
  
  // Scenario 4: Gradual manipulation
  {
    id: 'gradual_manipulation',
    name: 'Gradual Manipulation',
    description: 'Slowly increasing signal to avoid spike detection',
    generate: () => {
      const signals: NormalizedSignal[] = [];
      for (let i = 0; i < 10; i++) {
        signals.push(createMockSignal('gradual_topic', 10 + i * 5, 10, 1.5));
      }
      return signals;
    },
    expected_outcome: 'visible_not_amplified',
  },
  
  // Scenario 5: Fake persistence
  {
    id: 'fake_persistence',
    name: 'Fake Persistence via Repeated Spikes',
    description: 'Multiple short spikes to simulate sustained attention',
    generate: () => [
      createMockSignal('fake_sustained', 50, 10, 4),
      createMockSignal('fake_sustained', 50, 10, 4),
      createMockSignal('fake_sustained', 50, 10, 4),
    ],
    expected_outcome: 'visible_not_amplified',
  },
];

// ============================================
// MOCK SIGNAL GENERATOR
// ============================================

function createMockSignal(
  topic: string,
  count: number,
  baselineMean: number,
  persistenceHours: number
): NormalizedSignal {
  const zscore = baselineMean > 0 ? (count - baselineMean) / (baselineMean * 0.5) : 0;
  
  return {
    signal_id: `test_${topic}_${Date.now()}`,
    source_type: 'news_api',
    domain: 'signals',
    geo: 'SE',
    topic,
    timestamp: new Date().toISOString(),
    count,
    baseline_mean: baselineMean,
    baseline_std: baselineMean * 0.5,
    deviation_score: zscore,
    seasonal_adjustment: 1,
    is_valid: true,
  };
}

// ============================================
// RED TEAM VALIDATOR
// ============================================

export interface RedTeamResult {
  scenario_id: string;
  scenario_name: string;
  signals_generated: number;
  detections: SignalDetection[];
  bindings_created: number;
  guardrails_applied: string[];
  outcome: 'pass' | 'fail';
  failure_reason?: string;
}

export function runRedTeamScenario(scenario: AttackScenario): RedTeamResult {
  const signals = scenario.generate();
  const detections: SignalDetection[] = [];
  let bindingsCreated = 0;
  const guardrailsApplied: string[] = [];
  
  for (const signal of signals) {
    // Run detection
    const spike = detectSpike(signal);
    if (spike) detections.push(spike);
    
    // Check binding
    const binding = bindSignal(signal);
    if (binding) bindingsCreated++;
    
    // Check guardrails
    if (Math.abs(signal.deviation_score) > 5) {
      guardrailsApplied.push('extreme_deviation_flagged');
    }
  }
  
  // Validate outcome
  const outcome = validateOutcome(scenario, detections, guardrailsApplied);
  
  return {
    scenario_id: scenario.id,
    scenario_name: scenario.name,
    signals_generated: signals.length,
    detections,
    bindings_created: bindingsCreated,
    guardrails_applied: guardrailsApplied,
    outcome: outcome.passed ? 'pass' : 'fail',
    failure_reason: outcome.reason,
  };
}

function validateOutcome(
  scenario: AttackScenario,
  detections: SignalDetection[],
  guardrails: string[]
): { passed: boolean; reason?: string } {
  switch (scenario.expected_outcome) {
    case 'visible_not_amplified':
      // Should detect but not over-weight
      if (detections.length === 0) {
        return { passed: false, reason: 'Signal not detected when it should be visible' };
      }
      // Check no extreme severity unless truly extreme
      const hasUnwarrantedHigh = detections.some(d => d.severity === 'high' && d.zscore < 4);
      if (hasUnwarrantedHigh) {
        return { passed: false, reason: 'Signal over-amplified (high severity without extreme zscore)' };
      }
      return { passed: true };
      
    case 'ignored':
      if (detections.length > 0) {
        return { passed: false, reason: 'Signal should have been ignored' };
      }
      return { passed: true };
      
    case 'flagged_with_context':
      if (detections.length === 0) {
        return { passed: false, reason: 'Signal not flagged' };
      }
      // Should have guardrails applied
      return { passed: true };
      
    default:
      return { passed: true };
  }
}

// ============================================
// RUN ALL SCENARIOS
// ============================================

export function runAllRedTeamScenarios(): RedTeamResult[] {
  return ATTACK_SCENARIOS.map(runRedTeamScenario);
}

export function getRedTeamSummary(): {
  total: number;
  passed: number;
  failed: number;
  scenarios: RedTeamResult[];
} {
  const results = runAllRedTeamScenarios();
  return {
    total: results.length,
    passed: results.filter(r => r.outcome === 'pass').length,
    failed: results.filter(r => r.outcome === 'fail').length,
    scenarios: results,
  };
}
