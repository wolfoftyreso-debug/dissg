/**
 * QA & Go-Live Configuration Tests
 */

import { describe, it, expect } from 'vitest';
import {
  QA_CHECKLIST,
  DAY0_CRITERIA,
  METHOD_DATA_QA,
  AI_QA,
  SCENARIO_QA,
  INCONSISTENCY_QA,
  UI_UX_QA,
  LEGAL_GOVERNANCE_QA,
  OPERATIONS_QA,
  getAllQAChecks,
  validateDay0Readiness,
  getCheckById,
} from '@/config/qaGoLiveConfig';

describe('QA Checklist Completeness', () => {
  it('should have 7 sections', () => {
    expect(Object.keys(QA_CHECKLIST.sections)).toHaveLength(7);
  });

  it('should have 12 total checks', () => {
    expect(QA_CHECKLIST.totalChecks).toBe(12);
  });

  it('should have all checks with IDs QA01-QA12', () => {
    const checks = getAllQAChecks();
    expect(checks.length).toBe(12);
    
    for (let i = 1; i <= 12; i++) {
      const id = `QA${i.toString().padStart(2, '0')}`;
      expect(checks.some(c => c.id === id)).toBe(true);
    }
  });
});

describe('I. Method & Data QA', () => {
  it('should have source integrity checks', () => {
    expect(METHOD_DATA_QA.sourceIntegrity.id).toBe('QA01');
    expect(METHOD_DATA_QA.sourceIntegrity.checks.length).toBe(4);
  });

  it('should have definitions & units checks', () => {
    expect(METHOD_DATA_QA.definitionsUnits.id).toBe('QA02');
    expect(METHOD_DATA_QA.definitionsUnits.checks.length).toBe(4);
  });

  it('should have uncertainty & coverage checks', () => {
    expect(METHOD_DATA_QA.uncertaintyCoverage.id).toBe('QA03');
    expect(METHOD_DATA_QA.uncertaintyCoverage.checks.length).toBe(4);
  });

  it('should have fail actions for each check', () => {
    expect(METHOD_DATA_QA.sourceIntegrity.failAction.en).toContain('not shown');
    expect(METHOD_DATA_QA.definitionsUnits.failAction.en).toContain('blocked');
    expect(METHOD_DATA_QA.uncertaintyCoverage.failAction.en).toContain('blocked');
  });
});

describe('II. AI QA', () => {
  it('should have language review checks', () => {
    expect(AI_QA.languageReview.id).toBe('QA04');
    expect(AI_QA.languageReview.checks.length).toBe(4);
  });

  it('should have correlation controls', () => {
    expect(AI_QA.correlationControls.id).toBe('QA05');
    expect(AI_QA.correlationControls.checks.length).toBe(4);
  });

  it('should check for allowed verbs only', () => {
    const checks = AI_QA.languageReview.checks.map(c => c.en.toLowerCase());
    expect(checks.some(c => c.includes('allowed verbs'))).toBe(true);
  });

  it('should check for no causal formulations', () => {
    const checks = AI_QA.languageReview.checks.map(c => c.en.toLowerCase());
    expect(checks.some(c => c.includes('causal'))).toBe(true);
  });
});

describe('III. Scenario QA', () => {
  it('should have assumptions checks', () => {
    expect(SCENARIO_QA.assumptions.id).toBe('QA06');
    expect(SCENARIO_QA.assumptions.checks.length).toBe(3);
  });

  it('should have responsibility & disclaimer checks', () => {
    expect(SCENARIO_QA.responsibilityDisclaimer.id).toBe('QA07');
    expect(SCENARIO_QA.responsibilityDisclaimer.checks.length).toBe(3);
  });

  it('should require user-generated watermark', () => {
    const checks = SCENARIO_QA.responsibilityDisclaimer.checks.map(c => c.en.toLowerCase());
    expect(checks.some(c => c.includes('user-generated'))).toBe(true);
  });
});

describe('IV. Inconsistency QA', () => {
  it('should have alignment logic checks', () => {
    expect(INCONSISTENCY_QA.alignmentLogic.id).toBe('QA08');
    expect(INCONSISTENCY_QA.alignmentLogic.checks.length).toBe(4);
  });

  it('should check for no implicit blame', () => {
    const checks = INCONSISTENCY_QA.alignmentLogic.checks.map(c => c.en.toLowerCase());
    expect(checks.some(c => c.includes('blame'))).toBe(true);
  });
});

describe('V. UI/UX QA', () => {
  it('should have clickability & depth checks', () => {
    expect(UI_UX_QA.clickabilityDepth.id).toBe('QA09');
    expect(UI_UX_QA.clickabilityDepth.checks.length).toBe(4);
  });

  it('should have visual neutrality checks', () => {
    expect(UI_UX_QA.visualNeutrality.id).toBe('QA10');
    expect(UI_UX_QA.visualNeutrality.checks.length).toBe(4);
  });

  it('should check for no evaluative colors', () => {
    const checks = UI_UX_QA.visualNeutrality.checks.map(c => c.en.toLowerCase());
    expect(checks.some(c => c.includes('color') && c.includes('evaluat'))).toBe(true);
  });

  it('should check mobile functionality', () => {
    const checks = UI_UX_QA.clickabilityDepth.checks.map(c => c.en.toLowerCase());
    expect(checks.some(c => c.includes('mobile'))).toBe(true);
  });
});

describe('VI. Legal & Governance QA', () => {
  it('should have safe-harbor checks', () => {
    expect(LEGAL_GOVERNANCE_QA.safeHarbor.id).toBe('QA11');
    expect(LEGAL_GOVERNANCE_QA.safeHarbor.checks.length).toBe(4);
  });

  it('should check for exit-safe mode', () => {
    const checks = LEGAL_GOVERNANCE_QA.safeHarbor.checks.map(c => c.en.toLowerCase());
    expect(checks.some(c => c.includes('exit-safe'))).toBe(true);
  });
});

describe('VII. Operations QA', () => {
  it('should have operations checks', () => {
    expect(OPERATIONS_QA.operations.id).toBe('QA12');
    expect(OPERATIONS_QA.operations.checks.length).toBe(4);
  });

  it('should check for redundancy', () => {
    const checks = OPERATIONS_QA.operations.checks.map(c => c.en.toLowerCase());
    expect(checks.some(c => c.includes('redundancy'))).toBe(true);
  });

  it('should check for fallback', () => {
    const checks = OPERATIONS_QA.operations.checks.map(c => c.en.toLowerCase());
    expect(checks.some(c => c.includes('fallback'))).toBe(true);
  });
});

describe('Day-0 Criteria', () => {
  it('should have 6 criteria', () => {
    expect(DAY0_CRITERIA.criteria).toHaveLength(6);
  });

  it('should include no misinterpretation', () => {
    const criteria = DAY0_CRITERIA.criteria.map(c => c.en.toLowerCase());
    expect(criteria.some(c => c.includes('misinterpret'))).toBe(true);
  });

  it('should include all data traceable', () => {
    const criteria = DAY0_CRITERIA.criteria.map(c => c.en.toLowerCase());
    expect(criteria.some(c => c.includes('traceable'))).toBe(true);
  });

  it('should have readyWhen statement', () => {
    expect(DAY0_CRITERIA.readyWhen.en).toContain('stand on its own');
    expect(DAY0_CRITERIA.readyWhen.en).toContain('withstand criticism');
    expect(DAY0_CRITERIA.readyWhen.en).toContain('not need to be defended');
  });
});

describe('Validation Functions', () => {
  it('should get all QA checks', () => {
    const checks = getAllQAChecks();
    expect(checks.length).toBe(12);
  });

  it('should validate day-0 readiness with all passing', () => {
    const results = getAllQAChecks().map(c => ({
      id: c.id,
      status: 'pass' as const,
      checkedAt: new Date().toISOString(),
    }));
    
    const validation = validateDay0Readiness(results);
    expect(validation.ready).toBe(true);
    expect(validation.blockers).toHaveLength(0);
  });

  it('should validate day-0 readiness with failures', () => {
    const results = [
      { id: 'QA01', status: 'pass' as const, checkedAt: new Date().toISOString() },
      { id: 'QA02', status: 'fail' as const, checkedAt: new Date().toISOString() },
      { id: 'QA03', status: 'fail' as const, checkedAt: new Date().toISOString() },
    ];
    
    const validation = validateDay0Readiness(results);
    expect(validation.ready).toBe(false);
    expect(validation.blockers).toContain('QA02');
    expect(validation.blockers).toContain('QA03');
  });

  it('should get check by ID', () => {
    const check = getCheckById('QA05');
    expect(check?.title.en).toBe('Correlation Controls');
  });
});
