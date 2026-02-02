/**
 * Scenario Lab Configuration Tests
 * 
 * Verifies that probabilistic scenario lab configurations are correctly structured
 * and maintain epistemological integrity.
 */

import { describe, it, expect } from 'vitest';
import {
  SCENARIO_CORE_PRINCIPLE,
  MODE_DISTINCTION,
  SCENARIO_MODEL_TYPES,
  
  OUTPUT_RULES,
  TRACEABILITY,
  COUNTERWEIGHT_SYSTEM,
  SAFETY_RATIONALE,
  SCENARIO_COMPLETION_CRITERIA,
  SCENARIO_CONCLUSION,
} from '@/config/scenarioLabConfig';

describe('Scenario Core Principle', () => {
  it('should state platform makes NO predictions', () => {
    const statement = SCENARIO_CORE_PRINCIPLE.statement.en.toLowerCase();
    expect(statement).toContain('no prediction');
  });

  it('should state users create scenarios', () => {
    const statement = SCENARIO_CORE_PRINCIPLE.statement.en.toLowerCase();
    expect(statement).toContain('user');
    expect(statement).toContain('scenario');
  });

  it('should have all required characteristics', () => {
    const chars = SCENARIO_CORE_PRINCIPLE.characteristics.map(c => c.en.toLowerCase());
    expect(chars).toContain('user-generated');
    expect(chars).toContain('traceable');
    expect(chars).toContain('reproducible');
  });

  it('should state platform provides engine not conclusion', () => {
    const conclusion = SCENARIO_CORE_PRINCIPLE.conclusion.en.toLowerCase();
    expect(conclusion).toContain('engine');
    expect(conclusion).toContain('not');
    expect(conclusion).toContain('conclusion');
  });
});

describe('Mode Distinction', () => {
  it('should have exactly two modes', () => {
    expect(MODE_DISTINCTION.observation).toBeDefined();
    expect(MODE_DISTINCTION.scenario).toBeDefined();
  });

  it('should clearly distinguish observation from scenario', () => {
    expect(MODE_DISTINCTION.observation.description.en).toContain('platform');
    expect(MODE_DISTINCTION.scenario.description.en).toContain('user');
  });

  it('should have watermark for scenario mode only', () => {
    expect(MODE_DISTINCTION.scenario.watermark).toBeDefined();
    expect((MODE_DISTINCTION.observation as any).watermark).toBeUndefined();
  });

  it('should state no one can say "the system said"', () => {
    expect(MODE_DISTINCTION.principle.en.toLowerCase()).toContain('system said');
  });
});

describe('Scenario Model Types', () => {
  it('should have at least 4 model types', () => {
    expect(SCENARIO_MODEL_TYPES.length).toBeGreaterThanOrEqual(4);
  });

  it('should include required model types', () => {
    const modelIds = SCENARIO_MODEL_TYPES.map(m => m.id);
    expect(modelIds).toContain('historical_frequency');
    expect(modelIds).toContain('bayesian_update');
    expect(modelIds).toContain('monte_carlo');
  });

  it('should have complexity levels for each model', () => {
    SCENARIO_MODEL_TYPES.forEach(model => {
      expect(['basic', 'intermediate', 'advanced']).toContain(model.complexity);
    });
  });
});

describe('Output Rules', () => {
  it('should NEVER allow predictive language', () => {
    const neverExamples = OUTPUT_RULES.never.examples.map(e => e.en.toLowerCase());
    expect(neverExamples.some(e => e.includes('will happen'))).toBe(true);
    expect(neverExamples.some(e => e.includes('recommend'))).toBe(true);
  });

  it('should ALWAYS require conditional language', () => {
    const alwaysTemplates = OUTPUT_RULES.always.templates.map(t => t.en.toLowerCase());
    expect(alwaysTemplates.some(t => t.includes('given the selected assumptions'))).toBe(true);
    expect(alwaysTemplates.some(t => t.includes('under these conditions'))).toBe(true);
  });

  it('should have mandatory disclaimer', () => {
    const disclaimer = OUTPUT_RULES.mandatoryDisclaimer.en.toLowerCase();
    expect(disclaimer).toContain('conditional');
    expect(disclaimer).toContain('assumptions');
    expect(disclaimer).toContain('not represent');
  });
});

describe('Traceability', () => {
  it('should require all traceability fields', () => {
    const requirements = TRACEABILITY.requirements.map(r => r.en.toLowerCase());
    expect(requirements.some(r => r.includes('user id'))).toBe(true);
    expect(requirements.some(r => r.includes('timestamp'))).toBe(true);
    expect(requirements.some(r => r.includes('version'))).toBe(true);
    expect(requirements.some(r => r.includes('assumption'))).toBe(true);
  });

  it('should have standard disclaimer for sharing', () => {
    const disclaimer = TRACEABILITY.standardDisclaimer.en.toLowerCase();
    expect(disclaimer).toContain('created by the user');
    expect(disclaimer).toContain('does not validate');
  });
});

describe('Counterweight System', () => {
  it('should trigger on strong conclusions and sharing', () => {
    const triggers = COUNTERWEIGHT_SYSTEM.triggers.map(t => t.en.toLowerCase());
    expect(triggers.some(t => t.includes('conclusion'))).toBe(true);
    expect(triggers.some(t => t.includes('export'))).toBe(true);
    expect(triggers.some(t => t.includes('sharing'))).toBe(true);
  });

  it('should respond with insufficiency warning', () => {
    const response = COUNTERWEIGHT_SYSTEM.systemResponse.en.toLowerCase();
    expect(response).toContain('not sufficient');
    expect(response).toContain('standalone decision');
  });

  it('should link to broader resources', () => {
    expect(COUNTERWEIGHT_SYSTEM.linkedResources.length).toBeGreaterThan(0);
  });
});

describe('Safety Rationale', () => {
  it('should explain why this is safe', () => {
    const points = SAFETY_RATIONALE.points.map(p => p.en.toLowerCase());
    expect(points.some(p => p.includes('blame'))).toBe(true);
    expect(points.some(p => p.includes('transparent'))).toBe(true);
  });

  it('should reference professional users', () => {
    const examples = SAFETY_RATIONALE.usedBy.examples.map(e => e.en.toLowerCase());
    expect(examples.some(e => e.includes('central bank'))).toBe(true);
  });
});

describe('Completion Criteria', () => {
  it('should have all required criteria', () => {
    const criteria = SCENARIO_COMPLETION_CRITERIA.criteria.map(c => c.en.toLowerCase());
    expect(criteria.some(c => c.includes('recommendation'))).toBe(true);
    expect(criteria.some(c => c.includes('assumption'))).toBe(true);
    expect(criteria.some(c => c.includes('responsibility'))).toBe(true);
    expect(criteria.some(c => c.includes('legal'))).toBe(true);
  });
});

describe('Scenario Conclusion', () => {
  it('should state this is disciplined exploration, not speculation', () => {
    expect(SCENARIO_CONCLUSION.final.notThis.en.toLowerCase()).toContain('speculation');
    expect(SCENARIO_CONCLUSION.final.butThis.en.toLowerCase()).toContain('disciplined');
  });
});
