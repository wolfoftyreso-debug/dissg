/**
 * Longevity & Anti-Corruption Tests
 */

import { describe, it, expect } from 'vitest';
import {
  PRINCIPLED_IMMUNITY,
  POWER_PRESSURE_HANDLING,
  FORKABILITY,
  AI_AGENT_RULES,
  SCALING_RULES,
  ECONOMIC_SUSTAINABILITY,
  SUCCESS_SIGNALS,
  FINAL_TRUTH,
  LONGEVITY_ENDPOINT,
  LONGEVITY_ANTI_CORRUPTION,
  validateLongevityCompleteness,
} from '@/config/longevityAntiCorruptionConfig';

describe('Principled Immunity', () => {
  it('should have 7 immutable principles', () => {
    expect(PRINCIPLED_IMMUNITY.principles).toHaveLength(7);
  });

  it('should include same method for all', () => {
    const principles = PRINCIPLED_IMMUNITY.principles.map(p => p.en.toLowerCase());
    expect(principles.some(p => p.includes('same method'))).toBe(true);
  });

  it('should include no recommendations', () => {
    const principles = PRINCIPLED_IMMUNITY.principles.map(p => p.en.toLowerCase());
    expect(principles.some(p => p.includes('no recommendation'))).toBe(true);
  });

  it('should include read-only on violation', () => {
    const principles = PRINCIPLED_IMMUNITY.principles.map(p => p.en.toLowerCase());
    expect(principles.some(p => p.includes('read-only'))).toBe(true);
  });

  it('should state system is expensive to capture', () => {
    expect(PRINCIPLED_IMMUNITY.effect.en).toContain('expensive to capture');
  });
});

describe('Power Pressure Handling', () => {
  it('should list 4 pressure types', () => {
    expect(POWER_PRESSURE_HANDLING.pressureTypes).toHaveLength(4);
  });

  it('should have 4 system responses', () => {
    expect(POWER_PRESSURE_HANDLING.systemResponse).toHaveLength(4);
  });

  it('should require public method change', () => {
    const responses = POWER_PRESSURE_HANDLING.systemResponse.map(r => r.en.toLowerCase());
    expect(responses.some(r => r.includes('public method change'))).toBe(true);
  });

  it('should keep history in parallel', () => {
    const responses = POWER_PRESSURE_HANDLING.systemResponse.map(r => r.en.toLowerCase());
    expect(responses.some(r => r.includes('history') && r.includes('parallel'))).toBe(true);
  });

  it('should guarantee no silent adjustment', () => {
    expect(POWER_PRESSURE_HANDLING.guarantee.en).toContain('No "silent adjustment"');
  });
});

describe('Forkability', () => {
  it('should have 4 open elements', () => {
    expect(FORKABILITY.openElements).toHaveLength(4);
  });

  it('should include open methods', () => {
    const elements = FORKABILITY.openElements.map(e => e.en.toLowerCase());
    expect(elements.some(e => e.includes('method') && e.includes('open'))).toBe(true);
  });

  it('should include documented APIs', () => {
    const elements = FORKABILITY.openElements.map(e => e.en.toLowerCase());
    expect(elements.some(e => e.includes('api') && e.includes('documented'))).toBe(true);
  });

  it('should state world can copy and compare', () => {
    expect(FORKABILITY.protection.en).toContain('copy');
    expect(FORKABILITY.protection.en).toContain('compare');
  });

  it('should be stronger than ownership', () => {
    expect(FORKABILITY.principle.en).toContain('stronger than ownership');
  });
});

describe('AI Agent Rules', () => {
  it('should have 3 allowed actions', () => {
    expect(AI_AGENT_RULES.allowed).toHaveLength(3);
  });

  it('should have 3 forbidden actions', () => {
    expect(AI_AGENT_RULES.forbidden).toHaveLength(3);
  });

  it('should allow reading', () => {
    const allowed = AI_AGENT_RULES.allowed.map(a => a.en.toLowerCase());
    expect(allowed.some(a => a.includes('read'))).toBe(true);
  });

  it('should forbid writing back', () => {
    const forbidden = AI_AGENT_RULES.forbidden.map(f => f.en.toLowerCase());
    expect(forbidden.some(f => f.includes('write back'))).toBe(true);
  });

  it('should forbid drawing conclusions', () => {
    const forbidden = AI_AGENT_RULES.forbidden.map(f => f.en.toLowerCase());
    expect(forbidden.some(f => f.includes('conclusions'))).toBe(true);
  });

  it('should state system is reference, not participant', () => {
    expect(AI_AGENT_RULES.principle.en).toContain('reference');
    expect(AI_AGENT_RULES.principle.en).toContain('not a participant');
  });
});

describe('Scaling Rules', () => {
  it('should have 3 expansion methods', () => {
    expect(SCALING_RULES.expansionThrough).toHaveLength(3);
  });

  it('should have 3 anti-patterns', () => {
    expect(SCALING_RULES.notThrough).toHaveLength(3);
  });

  it('should have 4 requirements for new measures', () => {
    expect(SCALING_RULES.newMeasureRequirements).toHaveLength(4);
  });

  it('should expand through more data sources', () => {
    const expansion = SCALING_RULES.expansionThrough.map(e => e.en.toLowerCase());
    expect(expansion.some(e => e.includes('data sources'))).toBe(true);
  });

  it('should not expand through more opinions', () => {
    const notThrough = SCALING_RULES.notThrough.map(n => n.en.toLowerCase());
    expect(notThrough.some(n => n.includes('opinions'))).toBe(true);
  });

  it('should require new measures to answer real questions', () => {
    const requirements = SCALING_RULES.newMeasureRequirements.map(r => r.en.toLowerCase());
    expect(requirements.some(r => r.includes('real question'))).toBe(true);
  });
});

describe('Economic Sustainability', () => {
  it('should have 5 revenue sources', () => {
    expect(ECONOMIC_SUSTAINABILITY.revenueFrom).toHaveLength(5);
  });

  it('should have 4 forbidden revenue sources', () => {
    expect(ECONOMIC_SUSTAINABILITY.neverFrom).toHaveLength(4);
  });

  it('should include API as revenue', () => {
    const revenue = ECONOMIC_SUSTAINABILITY.revenueFrom.map(r => r.en.toLowerCase());
    expect(revenue.some(r => r.includes('api'))).toBe(true);
  });

  it('should forbid advertisements', () => {
    const forbidden = ECONOMIC_SUSTAINABILITY.neverFrom.map(f => f.en.toLowerCase());
    expect(forbidden.some(f => f.includes('advertisement'))).toBe(true);
  });

  it('should forbid sponsorship', () => {
    const forbidden = ECONOMIC_SUSTAINABILITY.neverFrom.map(f => f.en.toLowerCase());
    expect(forbidden.some(f => f.includes('sponsorship'))).toBe(true);
  });

  it('should state money may never steer content', () => {
    expect(ECONOMIC_SUSTAINABILITY.principle.en).toContain('Money may never steer');
  });
});

describe('Success Signals', () => {
  it('should have 5 success signals', () => {
    expect(SUCCESS_SIGNALS.signals).toHaveLength(5);
  });

  it('should include no one talks about platform', () => {
    const signals = SUCCESS_SIGNALS.signals.map(s => s.en.toLowerCase());
    expect(signals.some(s => s.includes('no one talks'))).toBe(true);
  });

  it('should include everyone uses numbers', () => {
    const signals = SUCCESS_SIGNALS.signals.map(s => s.en.toLowerCase());
    expect(signals.some(s => s.includes('everyone uses'))).toBe(true);
  });

  it('should include debates start with "according to"', () => {
    const signals = SUCCESS_SIGNALS.signals.map(s => s.en.toLowerCase());
    expect(signals.some(s => s.includes('according to'))).toBe(true);
  });

  it('should conclude boring = foundation', () => {
    expect(SUCCESS_SIGNALS.conclusion.en).toContain('boring');
    expect(SUCCESS_SIGNALS.conclusion.en).toContain('foundation');
  });
});

describe('Final Truth', () => {
  it('should list 3 things not needed', () => {
    expect(FINAL_TRUTH.notNeeded).toHaveLength(3);
  });

  it('should describe the system fault seen', () => {
    expect(FINAL_TRUTH.systemFaultSeen.en).toContain('shared reference layer');
  });

  it('should state built as structure, not opinion', () => {
    expect(FINAL_TRUTH.whatWasBuilt.en).toContain('structure');
    expect(FINAL_TRUTH.whatWasBuilt.en).toContain('Not as opinion');
  });
});

describe('Longevity Endpoint', () => {
  it('should state nothing more to build conceptually', () => {
    expect(LONGEVITY_ENDPOINT.statement.en).toContain('nothing more to build conceptually');
  });

  it('should list 4 remaining tasks', () => {
    expect(LONGEVITY_ENDPOINT.whatRemains).toHaveLength(4);
  });

  it('should state this is as it should be', () => {
    expect(LONGEVITY_ENDPOINT.acceptance.en).toContain('exactly as it should be');
  });
});

describe('Complete Configuration', () => {
  it('should be locked', () => {
    expect(LONGEVITY_ANTI_CORRUPTION.locked).toBe(true);
  });

  it('should validate as complete with 9 sections', () => {
    const result = validateLongevityCompleteness();
    expect(result.complete).toBe(true);
    expect(result.sections).toBe(9);
  });

  it('should contain all components', () => {
    expect(LONGEVITY_ANTI_CORRUPTION.principledImmunity).toBe(PRINCIPLED_IMMUNITY);
    expect(LONGEVITY_ANTI_CORRUPTION.powerPressureHandling).toBe(POWER_PRESSURE_HANDLING);
    expect(LONGEVITY_ANTI_CORRUPTION.forkability).toBe(FORKABILITY);
    expect(LONGEVITY_ANTI_CORRUPTION.aiAgentRules).toBe(AI_AGENT_RULES);
    expect(LONGEVITY_ANTI_CORRUPTION.scalingRules).toBe(SCALING_RULES);
    expect(LONGEVITY_ANTI_CORRUPTION.economicSustainability).toBe(ECONOMIC_SUSTAINABILITY);
    expect(LONGEVITY_ANTI_CORRUPTION.successSignals).toBe(SUCCESS_SIGNALS);
    expect(LONGEVITY_ANTI_CORRUPTION.finalTruth).toBe(FINAL_TRUTH);
    expect(LONGEVITY_ANTI_CORRUPTION.endpoint).toBe(LONGEVITY_ENDPOINT);
  });
});
