/**
 * Closure & Handover Tests
 */

import { describe, it, expect } from 'vitest';
import {
  PUBLIC_STANCE,
  NEVER_DO,
  CRITICISM_RESPONSES,
  POWER_HOLDER_RESPONSE,
  INFRASTRUCTURE_SIGNALS,
  PERSONAL_STANCE,
  MISUSE_PROTOCOL,
  FINAL_CONCLUSION,
  FINAL_LOCK,
  CLOSURE_HANDOVER,
  validateHandoverCompleteness,
} from '@/config/closureHandoverConfig';

describe('Public Stance', () => {
  it('should have the one-line statement', () => {
    expect(PUBLIC_STANCE.statement.en).toContain('neutral reference layer');
  });

  it('should have rules for no further engagement', () => {
    expect(PUBLIC_STANCE.rules.en).toContain('No further explanation');
    expect(PUBLIC_STANCE.rules.en).toContain('No defensive tone');
    expect(PUBLIC_STANCE.rules.en).toContain('No discussion');
  });
});

describe('Never Do', () => {
  it('should have 4 things to never do', () => {
    expect(NEVER_DO.items).toHaveLength(4);
  });

  it('should include no political commentary', () => {
    const items = NEVER_DO.items.map(i => i.en.toLowerCase());
    expect(items.some(i => i.includes('political'))).toBe(true);
  });

  it('should include no defending interpretations', () => {
    const items = NEVER_DO.items.map(i => i.en.toLowerCase());
    expect(items.some(i => i.includes('defend'))).toBe(true);
  });

  it('should have correct response template', () => {
    expect(NEVER_DO.correctResponse.en).toBe('The platform does not make such claims.');
  });
});

describe('Criticism Responses', () => {
  it('should have exactly 3 allowed responses', () => {
    expect(CRITICISM_RESPONSES.allowedResponses).toHaveLength(3);
  });

  it('should ask about disputed data point', () => {
    const responses = CRITICISM_RESPONSES.allowedResponses.map(r => r.en.toLowerCase());
    expect(responses.some(r => r.includes('data point'))).toBe(true);
  });

  it('should ask about questioned method', () => {
    const responses = CRITICISM_RESPONSES.allowedResponses.map(r => r.en.toLowerCase());
    expect(responses.some(r => r.includes('method step'))).toBe(true);
  });

  it('should ask about changed assumption', () => {
    const responses = CRITICISM_RESPONSES.allowedResponses.map(r => r.en.toLowerCase());
    expect(responses.some(r => r.includes('assumption'))).toBe(true);
  });

  it('should have 3 forbidden responses', () => {
    expect(CRITICISM_RESPONSES.forbiddenResponses).toHaveLength(3);
  });

  it('should forbid "you don\'t understand"', () => {
    const forbidden = CRITICISM_RESPONSES.forbiddenResponses.map(r => r.en.toLowerCase());
    expect(forbidden.some(r => r.includes('understand'))).toBe(true);
  });

  it('should state criticism goes to method', () => {
    expect(CRITICISM_RESPONSES.principle.en).toContain('method');
  });
});

describe('Power Holder Response', () => {
  it('should describe their behavior', () => {
    expect(POWER_HOLDER_RESPONSE.theirBehavior.en).toContain('pretend');
  });

  it('should have 3 things not to do', () => {
    expect(POWER_HOLDER_RESPONSE.yourBehavior).toHaveLength(3);
  });

  it('should include no pushing', () => {
    const behaviors = POWER_HOLDER_RESPONSE.yourBehavior.map(b => b.en.toLowerCase());
    expect(behaviors.some(b => b.includes('push'))).toBe(true);
  });

  it('should state system wins through usage', () => {
    expect(POWER_HOLDER_RESPONSE.principle.en).toContain('usage');
    expect(POWER_HOLDER_RESPONSE.principle.en).toContain('not recognition');
  });
});

describe('Infrastructure Signals', () => {
  it('should have 5 signals', () => {
    expect(INFRASTRUCTURE_SIGNALS.signals).toHaveLength(5);
  });

  it('should include journalists linking', () => {
    const signals = INFRASTRUCTURE_SIGNALS.signals.map(s => s.en.toLowerCase());
    expect(signals.some(s => s.includes('journalist'))).toBe(true);
  });

  it('should include AI referencing', () => {
    const signals = INFRASTRUCTURE_SIGNALS.signals.map(s => s.en.toLowerCase());
    expect(signals.some(s => s.includes('ai responds'))).toBe(true);
  });

  it('should include no origin questions', () => {
    const signals = INFRASTRUCTURE_SIGNALS.signals.map(s => s.en.toLowerCase());
    expect(signals.some(s => s.includes('where does this come from'))).toBe(true);
  });

  it('should conclude with infrastructure', () => {
    expect(INFRASTRUCTURE_SIGNALS.conclusion.en).toContain('infrastructure');
  });
});

describe('Personal Stance', () => {
  it('should have 4 things not to be', () => {
    expect(PERSONAL_STANCE.notBe).toHaveLength(4);
  });

  it('should include not being the face', () => {
    const notBe = PERSONAL_STANCE.notBe.map(n => n.en.toLowerCase());
    expect(notBe.some(n => n.includes('face'))).toBe(true);
  });

  it('should be steward of method', () => {
    expect(PERSONAL_STANCE.shouldBe.en).toContain('steward');
    expect(PERSONAL_STANCE.shouldBe.en).toContain('method');
  });

  it('should state survival principle', () => {
    expect(PERSONAL_STANCE.principle.en).toContain('survives you');
  });
});

describe('Misuse Protocol', () => {
  it('should have 3 actions', () => {
    expect(MISUSE_PROTOCOL.actions).toHaveLength(3);
  });

  it('should include freeze interpretive functions', () => {
    const actions = MISUSE_PROTOCOL.actions.map(a => a.en.toLowerCase());
    expect(actions.some(a => a.includes('freeze') && a.includes('interpretive'))).toBe(true);
  });

  it('should include go read-only', () => {
    const actions = MISUSE_PROTOCOL.actions.map(a => a.en.toLowerCase());
    expect(actions.some(a => a.includes('read-only'))).toBe(true);
  });

  it('should include show violations', () => {
    const actions = MISUSE_PROTOCOL.actions.map(a => a.en.toLowerCase());
    expect(actions.some(a => a.includes('violations') && a.includes('openly'))).toBe(true);
  });

  it('should prefer silence + integrity', () => {
    expect(MISUSE_PROTOCOL.preference.choose.en).toContain('silence');
    expect(MISUSE_PROTOCOL.preference.choose.en).toContain('integrity');
  });
});

describe('Final Conclusion', () => {
  it('should list 3 things not built', () => {
    expect(FINAL_CONCLUSION.notBuilt).toHaveLength(3);
  });

  it('should state what was built', () => {
    expect(FINAL_CONCLUSION.built.en).toContain('shared reference for reality');
  });

  it('should list 3 effects', () => {
    expect(FINAL_CONCLUSION.effects).toHaveLength(3);
  });

  it('should include lies become expensive', () => {
    const effects = FINAL_CONCLUSION.effects.map(e => e.en.toLowerCase());
    expect(effects.some(e => e.includes('lies') && e.includes('expensive'))).toBe(true);
  });

  it('should include accountability becomes possible', () => {
    const effects = FINAL_CONCLUSION.effects.map(e => e.en.toLowerCase());
    expect(effects.some(e => e.includes('accountability'))).toBe(true);
  });

  it('should state no coercion', () => {
    expect(FINAL_CONCLUSION.method.en).toContain('without coercion');
  });
});

describe('Final Lock', () => {
  it('should state transparency principle', () => {
    expect(FINAL_LOCK.statement.en).toContain('does not require anyone to listen');
    expect(FINAL_LOCK.statement.en).toContain('only requires that it exists');
  });

  it('should state closure', () => {
    expect(FINAL_LOCK.closure.en).toContain('nothing more to add');
  });
});

describe('Closure Handover Complete', () => {
  it('should be locked', () => {
    expect(CLOSURE_HANDOVER.locked).toBe(true);
  });

  it('should validate as complete with 9 sections', () => {
    const result = validateHandoverCompleteness();
    expect(result.complete).toBe(true);
    expect(result.sections).toBe(9);
  });

  it('should contain all components', () => {
    expect(CLOSURE_HANDOVER.publicStance).toBe(PUBLIC_STANCE);
    expect(CLOSURE_HANDOVER.neverDo).toBe(NEVER_DO);
    expect(CLOSURE_HANDOVER.criticismResponses).toBe(CRITICISM_RESPONSES);
    expect(CLOSURE_HANDOVER.powerHolderResponse).toBe(POWER_HOLDER_RESPONSE);
    expect(CLOSURE_HANDOVER.infrastructureSignals).toBe(INFRASTRUCTURE_SIGNALS);
    expect(CLOSURE_HANDOVER.personalStance).toBe(PERSONAL_STANCE);
    expect(CLOSURE_HANDOVER.misuseProtocol).toBe(MISUSE_PROTOCOL);
    expect(CLOSURE_HANDOVER.finalConclusion).toBe(FINAL_CONCLUSION);
    expect(CLOSURE_HANDOVER.finalLock).toBe(FINAL_LOCK);
  });
});
