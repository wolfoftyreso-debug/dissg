/**
 * Operational Drift & Build Cycle Tests
 */

import { describe, it, expect } from 'vitest';
import {
  WEEKLY_RHYTHM,
  IMPROVEMENT_RULE,
  FEATURE_GATE,
  DATA_EXPANSION_PRIORITY,
  AI_USAGE_RULES,
  TEAM_PSYCHOLOGY,
  PAUSE_SIGNALS,
  PERSONAL_OPERATIONS,
  SOBER_CONCLUSION,
  OPERATIONAL_DRIFT_CONFIG,
  validateOperationsCompleteness,
} from '@/config/operationalDriftConfig';

describe('Weekly Rhythm', () => {
  it('should have 5 days scheduled', () => {
    expect(WEEKLY_RHYTHM.schedule).toHaveLength(5);
  });

  it('should have Monday for data quality', () => {
    const monday = WEEKLY_RHYTHM.schedule.find(d => d.day === 'monday');
    expect(monday?.focus.en.toLowerCase()).toContain('data quality');
  });

  it('should have Friday for summary and freeze', () => {
    const friday = WEEKLY_RHYTHM.schedule.find(d => d.day === 'friday');
    expect(friday?.focus.en.toLowerCase()).toContain('freeze');
  });

  it('should have 2 rules', () => {
    expect(WEEKLY_RHYTHM.rules).toHaveLength(2);
  });

  it('should forbid big ideas on Friday', () => {
    const rules = WEEKLY_RHYTHM.rules.map(r => r.en.toLowerCase());
    expect(rules.some(r => r.includes('friday') && r.includes('big ideas'))).toBe(true);
  });
});

describe('Improvement Rule', () => {
  it('should state one thing clearer', () => {
    expect(IMPROVEMENT_RULE.rule.en).toContain('ONE thing clearer');
  });

  it('should forbid adding complexity', () => {
    expect(IMPROVEMENT_RULE.rule.en).toContain('not make anything more complex');
  });

  it('should have 3 wrong path signs', () => {
    expect(IMPROVEMENT_RULE.wrongPath.signs).toHaveLength(3);
  });

  it('should include requires explanation as wrong', () => {
    const signs = IMPROVEMENT_RULE.wrongPath.signs.map(s => s.en.toLowerCase());
    expect(signs.some(s => s.includes('explanation'))).toBe(true);
  });
});

describe('Feature Gate', () => {
  it('should have 5 gate questions', () => {
    expect(FEATURE_GATE.questions).toHaveLength(5);
  });

  it('should ask about user question', () => {
    const questions = FEATURE_GATE.questions.map(q => q.en.toLowerCase());
    expect(questions.some(q => q.includes('user question'))).toBe(true);
  });

  it('should ask about misuse potential', () => {
    const questions = FEATURE_GATE.questions.map(q => q.en.toLowerCase());
    expect(questions.some(q => q.includes('misused'))).toBe(true);
  });

  it('should kill feature on any no', () => {
    expect(FEATURE_GATE.rule.en).toContain('feature dies');
  });
});

describe('Data Expansion Priority', () => {
  it('should have 4 priorities in order', () => {
    expect(DATA_EXPANSION_PRIORITY.priorities).toHaveLength(4);
  });

  it('should prioritize improving existing first', () => {
    const first = DATA_EXPANSION_PRIORITY.priorities.find(p => p.order === 1);
    expect(first?.text.en.toLowerCase()).toContain('improve existing');
  });

  it('should prioritize new indicators last', () => {
    const last = DATA_EXPANSION_PRIORITY.priorities.find(p => p.order === 4);
    expect(last?.text.en.toLowerCase()).toContain('new indicators');
  });

  it('should state depth beats breadth', () => {
    expect(DATA_EXPANSION_PRIORITY.principle.en).toContain('Depth beats breadth');
  });
});

describe('AI Usage Rules', () => {
  it('should have 4 allowed uses', () => {
    expect(AI_USAGE_RULES.allowedFor).toHaveLength(4);
  });

  it('should have 4 forbidden uses', () => {
    expect(AI_USAGE_RULES.notAllowedFor).toHaveLength(4);
  });

  it('should allow quality control', () => {
    const allowed = AI_USAGE_RULES.allowedFor.map(a => a.en.toLowerCase());
    expect(allowed.some(a => a.includes('quality control'))).toBe(true);
  });

  it('should forbid conclusions', () => {
    const forbidden = AI_USAGE_RULES.notAllowedFor.map(f => f.en.toLowerCase());
    expect(forbidden.some(f => f.includes('conclusion'))).toBe(true);
  });

  it('should redirect to scenario lab', () => {
    expect(AI_USAGE_RULES.redirect.en).toContain('scenario-lab');
  });
});

describe('Team Psychology', () => {
  it('should have 3 things to avoid', () => {
    expect(TEAM_PSYCHOLOGY.avoid).toHaveLength(3);
  });

  it('should have 2 always-answers', () => {
    expect(TEAM_PSYCHOLOGY.alwaysAnswer).toHaveLength(2);
  });

  it('should avoid political discussions', () => {
    const avoid = TEAM_PSYCHOLOGY.avoid.map(a => a.en.toLowerCase());
    expect(avoid.some(a => a.includes('political'))).toBe(true);
  });

  it('should always answer what data shows', () => {
    const answers = TEAM_PSYCHOLOGY.alwaysAnswer.map(a => a.en.toLowerCase());
    expect(answers.some(a => a.includes('data show'))).toBe(true);
  });
});

describe('Pause Signals', () => {
  it('should have 4 pause signals', () => {
    expect(PAUSE_SIGNALS.signals).toHaveLength(4);
  });

  it('should have 2 principles', () => {
    expect(PAUSE_SIGNALS.principles).toHaveLength(2);
  });

  it('should pause on arguing about conclusions', () => {
    const signals = PAUSE_SIGNALS.signals.map(s => s.en.toLowerCase());
    expect(signals.some(s => s.includes('arguing') && s.includes('conclusions'))).toBe(true);
  });

  it('should state pause is integrity', () => {
    const principles = PAUSE_SIGNALS.principles.map(p => p.en.toLowerCase());
    expect(principles.some(p => p.includes('integrity'))).toBe(true);
  });
});

describe('Personal Operations', () => {
  it('should have 4 things not needed', () => {
    expect(PERSONAL_OPERATIONS.notNeeded).toHaveLength(4);
  });

  it('should not need to convince the world', () => {
    const notNeeded = PERSONAL_OPERATIONS.notNeeded.map(n => n.en.toLowerCase());
    expect(notNeeded.some(n => n.includes('convince'))).toBe(true);
  });

  it('should state world comes out of self-interest', () => {
    expect(PERSONAL_OPERATIONS.truth.en).toContain('self-interest');
  });
});

describe('Sober Conclusion', () => {
  it('should state it is a shared measurement table', () => {
    expect(SOBER_CONCLUSION.whatItIs.en).toContain('shared measurement table');
  });

  it('should have 3 things beyond it', () => {
    expect(SOBER_CONCLUSION.beyondIt.items).toHaveLength(3);
  });

  it('should include politics as beyond', () => {
    const beyond = SOBER_CONCLUSION.beyondIt.items.map(i => i.en.toLowerCase());
    expect(beyond.some(b => b.includes('politics'))).toBe(true);
  });

  it('should accept but clarify not system task', () => {
    expect(SOBER_CONCLUSION.acceptance.en).toContain('not the system\'s task');
  });
});

describe('Complete Configuration', () => {
  it('should be locked', () => {
    expect(OPERATIONAL_DRIFT_CONFIG.locked).toBe(true);
  });

  it('should validate as complete with 9 sections', () => {
    const result = validateOperationsCompleteness();
    expect(result.complete).toBe(true);
    expect(result.sections).toBe(9);
  });

  it('should contain all components', () => {
    expect(OPERATIONAL_DRIFT_CONFIG.weeklyRhythm).toBe(WEEKLY_RHYTHM);
    expect(OPERATIONAL_DRIFT_CONFIG.improvementRule).toBe(IMPROVEMENT_RULE);
    expect(OPERATIONAL_DRIFT_CONFIG.featureGate).toBe(FEATURE_GATE);
    expect(OPERATIONAL_DRIFT_CONFIG.dataExpansionPriority).toBe(DATA_EXPANSION_PRIORITY);
    expect(OPERATIONAL_DRIFT_CONFIG.aiUsageRules).toBe(AI_USAGE_RULES);
    expect(OPERATIONAL_DRIFT_CONFIG.teamPsychology).toBe(TEAM_PSYCHOLOGY);
    expect(OPERATIONAL_DRIFT_CONFIG.pauseSignals).toBe(PAUSE_SIGNALS);
    expect(OPERATIONAL_DRIFT_CONFIG.personalOperations).toBe(PERSONAL_OPERATIONS);
    expect(OPERATIONAL_DRIFT_CONFIG.soberConclusion).toBe(SOBER_CONCLUSION);
  });
});
