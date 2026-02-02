/**
 * System Architecture Tests — Complete Verification
 * 
 * Ensures all 13 modules are properly defined and locked.
 */

import { describe, it, expect } from 'vitest';
import {
  SYSTEM_ARCHITECTURE,
  CORE_PRINCIPLES,
  DATA_INGESTION_LAYER,
  OBSERVATION_LAYER,
  INCONSISTENCY_LAYER,
  SCENARIO_LAB,
  REPORT_EXPORT_SYSTEM,
  AI_LAYER,
  UI_UX_LAYER,
  USER_LICENSE_MODEL,
  LEGAL_GOVERNANCE,
  ADOPTION_LAYER,
  OPERATIONS_FUTURE,
  IDENTITY_SUMMARY,
  validateArchitectureCompleteness,
  getPrincipleById,
  getModuleByNumber,
} from '@/config/systemArchitecture';

describe('System Architecture Completeness', () => {
  it('should have exactly 13 modules', () => {
    expect(SYSTEM_ARCHITECTURE.totalModules).toBe(13);
    expect(Object.keys(SYSTEM_ARCHITECTURE.modules)).toHaveLength(13);
  });

  it('should validate as complete', () => {
    const result = validateArchitectureCompleteness();
    expect(result.complete).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('should be locked', () => {
    expect(SYSTEM_ARCHITECTURE.locked).toBe(true);
  });
});

describe('I. Core Principles', () => {
  it('should have exactly 10 principles', () => {
    expect(CORE_PRINCIPLES.principles).toHaveLength(10);
  });

  it('should have principle P01: Observation before interpretation', () => {
    const p01 = getPrincipleById('P01');
    expect(p01?.en.toLowerCase()).toContain('observation');
    expect(p01?.en.toLowerCase()).toContain('interpretation');
  });

  it('should have principle P02: No recommendation', () => {
    const p02 = getPrincipleById('P02');
    expect(p02?.en.toLowerCase()).toContain('no recommendation');
  });

  it('should have principle P05: User responsible for conclusions', () => {
    const p05 = getPrincipleById('P05');
    expect(p05?.en.toLowerCase()).toContain('user');
    expect(p05?.en.toLowerCase()).toContain('responsible');
  });

  it('should have principle P07: Rather nothing than wrong', () => {
    const p07 = getPrincipleById('P07');
    expect(p07?.en.toLowerCase()).toContain('nothing');
    expect(p07?.en.toLowerCase()).toContain('wrong');
  });

  it('should be locked', () => {
    expect(CORE_PRINCIPLES.locked).toBe(true);
  });
});

describe('II. Data & Ingestion Layer', () => {
  it('should list data sources', () => {
    expect(DATA_INGESTION_LAYER.sources.categories.length).toBeGreaterThan(5);
  });

  it('should include major international sources', () => {
    const sources = DATA_INGESTION_LAYER.sources.categories.map(s => s.en.toLowerCase());
    expect(sources.some(s => s.includes('who') || s.includes('oecd') || s.includes('imf'))).toBe(true);
  });

  it('should have ingestion methods', () => {
    expect(DATA_INGESTION_LAYER.ingestion.methods.length).toBeGreaterThan(0);
  });

  it('should have data hygiene requirements', () => {
    expect(DATA_INGESTION_LAYER.dataHygiene.requirements.length).toBeGreaterThan(0);
  });
});

describe('III. Observation Layer', () => {
  it('should be free/open', () => {
    expect(OBSERVATION_LAYER.access.en.toLowerCase()).toContain('free');
  });

  it('should have observation functions', () => {
    expect(OBSERVATION_LAYER.functions.items.length).toBeGreaterThan(5);
  });

  it('should forbid conclusions', () => {
    const forbidden = OBSERVATION_LAYER.forbidden.items.map(i => i.en.toLowerCase());
    expect(forbidden.some(f => f.includes('conclusion'))).toBe(true);
  });

  it('should forbid evaluative colors', () => {
    const forbidden = OBSERVATION_LAYER.forbidden.items.map(i => i.en.toLowerCase());
    expect(forbidden.some(f => f.includes('color') && f.includes('evaluat'))).toBe(true);
  });
});

describe('IV. Inconsistency Layer', () => {
  it('should have input types', () => {
    expect(INCONSISTENCY_LAYER.input.items.length).toBe(3);
  });

  it('should have classification types', () => {
    expect(INCONSISTENCY_LAYER.classification.types).toHaveLength(4);
  });

  it('should require neutral presentation', () => {
    const reqs = INCONSISTENCY_LAYER.presentation.requirements.map(r => r.en.toLowerCase());
    expect(reqs.some(r => r.includes('neutral'))).toBe(true);
    expect(reqs.some(r => r.includes('no blame'))).toBe(true);
  });
});

describe('V. Scenario Lab', () => {
  it('should be paid', () => {
    expect(SCENARIO_LAB.access.en.toLowerCase()).toContain('paid');
  });

  it('should have 5 model types', () => {
    expect(SCENARIO_LAB.modelTypes.items).toHaveLength(5);
  });

  it('should require interval output, not point', () => {
    const outputs = SCENARIO_LAB.output.requirements.map(r => r.en.toLowerCase());
    expect(outputs.some(o => o.includes('interval') && o.includes('not point'))).toBe(true);
  });

  it('should have protection requirements', () => {
    const protection = SCENARIO_LAB.protection.requirements.map(p => p.en.toLowerCase());
    expect(protection.some(p => p.includes('user-generated'))).toBe(true);
    expect(protection.some(p => p.includes('responsibility'))).toBe(true);
  });
});

describe('VI. Report & Export System', () => {
  it('should have export functions', () => {
    expect(REPORT_EXPORT_SYSTEM.functions.items.length).toBeGreaterThan(3);
  });

  it('should prevent export without method', () => {
    const limits = REPORT_EXPORT_SYSTEM.limitations.items.map(l => l.en.toLowerCase());
    expect(limits.some(l => l.includes('no export without method'))).toBe(true);
  });

  it('should prevent export without uncertainty', () => {
    const limits = REPORT_EXPORT_SYSTEM.limitations.items.map(l => l.en.toLowerCase());
    expect(limits.some(l => l.includes('no export without uncertainty'))).toBe(true);
  });
});

describe('VII. AI Layer', () => {
  it('should allow pattern discovery', () => {
    const allowed = AI_LAYER.allowed.items.map(a => a.en.toLowerCase());
    expect(allowed.some(a => a.includes('pattern'))).toBe(true);
  });

  it('should forbid conclusions', () => {
    const forbidden = AI_LAYER.forbidden.items.map(f => f.en.toLowerCase());
    expect(forbidden.some(f => f.includes('conclusion'))).toBe(true);
  });

  it('should forbid recommendations', () => {
    const forbidden = AI_LAYER.forbidden.items.map(f => f.en.toLowerCase());
    expect(forbidden.some(f => f.includes('recommend'))).toBe(true);
  });

  it('should forbid speculation', () => {
    const forbidden = AI_LAYER.forbidden.items.map(f => f.en.toLowerCase());
    expect(forbidden.some(f => f.includes('speculat'))).toBe(true);
  });
});

describe('VIII. UI/UX Layer', () => {
  it('should have design principles', () => {
    expect(UI_UX_LAYER.designPrinciples.items.length).toBeGreaterThan(3);
  });

  it('should be mobile first', () => {
    const principles = UI_UX_LAYER.designPrinciples.items.map(p => p.en.toLowerCase());
    expect(principles.some(p => p.includes('mobile first'))).toBe(true);
  });

  it('should have view hierarchy', () => {
    expect(UI_UX_LAYER.views.hierarchy).toContain('Global');
    expect(UI_UX_LAYER.views.hierarchy).toContain('Nation');
  });
});

describe('IX. User & License Model', () => {
  it('should have 4 roles', () => {
    expect(USER_LICENSE_MODEL.roles.items).toHaveLength(4);
  });

  it('should include Guest, Observer, Analyst, Institutional', () => {
    expect(USER_LICENSE_MODEL.roles.items).toContain('Guest');
    expect(USER_LICENSE_MODEL.roles.items).toContain('Observer');
    expect(USER_LICENSE_MODEL.roles.items).toContain('Analyst');
    expect(USER_LICENSE_MODEL.roles.items).toContain('Institutional');
  });

  it('should state free = facts, paid = calculation', () => {
    expect(USER_LICENSE_MODEL.functionsPerLevel.free.en.toLowerCase()).toContain('facts');
    expect(USER_LICENSE_MODEL.functionsPerLevel.paid.en.toLowerCase()).toContain('calculation');
  });
});

describe('X. Legal & Governance', () => {
  it('should state platform responsible for operations and data quality', () => {
    const responsible = LEGAL_GOVERNANCE.platformResponsibleFor.items.map(i => i.en.toLowerCase());
    expect(responsible.some(r => r.includes('operations'))).toBe(true);
    expect(responsible.some(r => r.includes('data quality'))).toBe(true);
  });

  it('should state platform NOT responsible for interpretation and decisions', () => {
    const notResponsible = LEGAL_GOVERNANCE.platformNotResponsibleFor.items.map(i => i.en.toLowerCase());
    expect(notResponsible.some(r => r.includes('interpretation'))).toBe(true);
    expect(notResponsible.some(r => r.includes('decision'))).toBe(true);
  });

  it('should require safe-harbor text', () => {
    expect(LEGAL_GOVERNANCE.safeHarbor.en.toLowerCase()).toContain('safe-harbor');
  });
});

describe('XI. Adoption Layer', () => {
  it('should be built for citation and linking', () => {
    const builtFor = ADOPTION_LAYER.builtFor.items.map(i => i.en.toLowerCase());
    expect(builtFor.some(b => b.includes('cited'))).toBe(true);
    expect(builtFor.some(b => b.includes('linked'))).toBe(true);
  });

  it('should state no PR, only usage', () => {
    const noPR = ADOPTION_LAYER.noPR.items.map(i => i.en.toLowerCase());
    expect(noPR.some(n => n.includes('usage'))).toBe(true);
  });
});

describe('XII. Operations & Future', () => {
  it('should require serverless', () => {
    const reqs = OPERATIONS_FUTURE.requirements.map(r => r.en.toLowerCase());
    expect(reqs.some(r => r.includes('serverless'))).toBe(true);
  });

  it('should require read-only fallback', () => {
    const reqs = OPERATIONS_FUTURE.requirements.map(r => r.en.toLowerCase());
    expect(reqs.some(r => r.includes('read-only'))).toBe(true);
  });

  it('should require immutable principles', () => {
    const reqs = OPERATIONS_FUTURE.requirements.map(r => r.en.toLowerCase());
    expect(reqs.some(r => r.includes('immutable'))).toBe(true);
  });
});

describe('XIII. Identity Summary', () => {
  it('should state what we are NOT', () => {
    expect(IDENTITY_SUMMARY.notThis.length).toBe(3);
  });

  it('should state we are global decision infrastructure', () => {
    expect(IDENTITY_SUMMARY.butThis.en.toLowerCase()).toContain('global');
    expect(IDENTITY_SUMMARY.butThis.en.toLowerCase()).toContain('infrastructure');
  });

  it('should be inevitable, unassailable, necessary', () => {
    const chars = IDENTITY_SUMMARY.characteristics.map(c => c.en.toLowerCase());
    expect(chars).toContain('inevitable');
    expect(chars).toContain('unassailable');
    expect(chars).toContain('necessary');
  });
});

describe('Module Access Functions', () => {
  it('should get module by number', () => {
    const module1 = getModuleByNumber('I');
    expect(module1).toBe(CORE_PRINCIPLES);

    const module5 = getModuleByNumber('V');
    expect(module5).toBe(SCENARIO_LAB);
  });

  it('should get principle by ID', () => {
    const p03 = getPrincipleById('P03');
    expect(p03?.en.toLowerCase()).toContain('traceable');
  });
});
