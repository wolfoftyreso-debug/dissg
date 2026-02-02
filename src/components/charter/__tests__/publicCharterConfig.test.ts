/**
 * Public Charter & ToS Tests
 */

import { describe, it, expect } from 'vitest';
import {
  PUBLIC_CHARTER,
  TERMS_OF_SERVICE,
  INTERNAL_OPERATING_RULE,
  COMPLETION_CRITERIA,
  LEGAL_FRAMEWORK,
  validateCharterCompleteness,
  validateToSCompleteness,
} from '@/config/publicCharterConfig';

describe('Public Charter', () => {
  it('should have version and effective date', () => {
    expect(PUBLIC_CHARTER.version).toBe('1.0.0');
    expect(PUBLIC_CHARTER.effectiveDate).toBeDefined();
  });

  it('should have title in both languages', () => {
    expect(PUBLIC_CHARTER.title.en).toContain('Observable Reality');
    expect(PUBLIC_CHARTER.title.sv).toContain('observerbar verklighet');
  });

  it('should have purpose statement', () => {
    expect(PUBLIC_CHARTER.purpose.en).toContain('transparent');
    expect(PUBLIC_CHARTER.purpose.en).toContain('reproducible');
  });

  it('should list what platform does (4 items)', () => {
    expect(PUBLIC_CHARTER.whatPlatformDoes.items).toHaveLength(4);
  });

  it('should list what platform does NOT (4 items)', () => {
    expect(PUBLIC_CHARTER.whatPlatformDoesNot.items).toHaveLength(4);
  });

  it('should state no recommendations', () => {
    const items = PUBLIC_CHARTER.whatPlatformDoesNot.items.map(i => i.en.toLowerCase());
    expect(items.some(i => i.includes('recommend'))).toBe(true);
  });

  it('should state no predictions', () => {
    const items = PUBLIC_CHARTER.whatPlatformDoesNot.items.map(i => i.en.toLowerCase());
    expect(items.some(i => i.includes('predict'))).toBe(true);
  });

  it('should state no judgment', () => {
    const items = PUBLIC_CHARTER.whatPlatformDoesNot.items.map(i => i.en.toLowerCase());
    expect(items.some(i => i.includes('judge'))).toBe(true);
  });

  it('should have neutrality & method section', () => {
    expect(PUBLIC_CHARTER.neutralityMethod.items).toHaveLength(4);
  });

  it('should state universal methodology', () => {
    const items = PUBLIC_CHARTER.neutralityMethod.items.map(i => i.en.toLowerCase());
    expect(items.some(i => i.includes('universally'))).toBe(true);
  });

  it('should have user responsibility section', () => {
    expect(PUBLIC_CHARTER.userResponsibility.items).toHaveLength(3);
  });

  it('should state user is responsible for decisions', () => {
    const items = PUBLIC_CHARTER.userResponsibility.items.map(i => i.en.toLowerCase());
    expect(items.some(i => i.includes('responsibility of the user'))).toBe(true);
  });

  it('should have core principle statement', () => {
    expect(PUBLIC_CHARTER.corePrinciple.statement.en).toContain('does not tell anyone what to think');
  });

  it('should validate as complete', () => {
    const result = validateCharterCompleteness();
    expect(result.complete).toBe(true);
    expect(result.missing).toHaveLength(0);
  });
});

describe('Terms of Service', () => {
  it('should have version and effective date', () => {
    expect(TERMS_OF_SERVICE.version).toBe('1.0.0');
    expect(TERMS_OF_SERVICE.effectiveDate).toBeDefined();
  });

  it('should have exactly 6 clauses', () => {
    expect(TERMS_OF_SERVICE.clauses).toHaveLength(6);
  });

  it('should have clause IDs TOS01-TOS06', () => {
    for (let i = 1; i <= 6; i++) {
      const id = `TOS0${i}`;
      expect(TERMS_OF_SERVICE.clauses.some(c => c.id === id)).toBe(true);
    }
  });

  it('TOS01 should define scope of service', () => {
    const clause = TERMS_OF_SERVICE.clauses.find(c => c.id === 'TOS01');
    expect(clause?.title.en).toBe('Scope of Service');
    expect(clause?.text.en).toContain('does not provide advice');
  });

  it('TOS02 should define data sources', () => {
    const clause = TERMS_OF_SERVICE.clauses.find(c => c.id === 'TOS02');
    expect(clause?.title.en).toBe('Data Sources');
    expect(clause?.text.en).toContain('transparency');
  });

  it('TOS03 should define user-generated content', () => {
    const clause = TERMS_OF_SERVICE.clauses.find(c => c.id === 'TOS03');
    expect(clause?.title.en).toBe('User-Generated Content');
    expect(clause?.text.en).toContain('sole responsibility');
  });

  it('TOS04 should state no reliance', () => {
    const clause = TERMS_OF_SERVICE.clauses.find(c => c.id === 'TOS04');
    expect(clause?.title.en).toBe('No Reliance');
    expect(clause?.text.en).toContain('not intended to be relied upon');
  });

  it('TOS05 should limit liability', () => {
    const clause = TERMS_OF_SERVICE.clauses.find(c => c.id === 'TOS05');
    expect(clause?.title.en).toBe('Liability');
    expect(clause?.text.en).toContain('not liable');
  });

  it('TOS06 should define integrity & access', () => {
    const clause = TERMS_OF_SERVICE.clauses.find(c => c.id === 'TOS06');
    expect(clause?.title.en).toBe('Integrity & Access');
    expect(clause?.text.en).toContain('read-only mode');
  });

  it('should validate as complete', () => {
    const result = validateToSCompleteness();
    expect(result.complete).toBe(true);
    expect(result.clauseCount).toBe(6);
  });
});

describe('Internal Operating Rule', () => {
  it('should have the one rule that matters', () => {
    expect(INTERNAL_OPERATING_RULE.rule.en).toContain('advice');
    expect(INTERNAL_OPERATING_RULE.rule.en).toContain('judgment');
    expect(INTERNAL_OPERATING_RULE.rule.en).toContain('recommendation');
    expect(INTERNAL_OPERATING_RULE.rule.en).toContain('does not ship');
  });
});

describe('Completion Criteria', () => {
  it('should have 6 criteria', () => {
    expect(COMPLETION_CRITERIA.criteria).toHaveLength(6);
  });

  it('should include self-explanation', () => {
    const criteria = COMPLETION_CRITERIA.criteria.map(c => c.en.toLowerCase());
    expect(criteria.some(c => c.includes('explains itself without you'))).toBe(true);
  });

  it('should include audit resistance', () => {
    const criteria = COMPLETION_CRITERIA.criteria.map(c => c.en.toLowerCase());
    expect(criteria.some(c => c.includes('audit') && c.includes('corner'))).toBe(true);
  });

  it('should include institutional usability', () => {
    const criteria = COMPLETION_CRITERIA.criteria.map(c => c.en.toLowerCase());
    expect(criteria.some(c => c.includes('institution'))).toBe(true);
  });

  it('should include media citability', () => {
    const criteria = COMPLETION_CRITERIA.criteria.map(c => c.en.toLowerCase());
    expect(criteria.some(c => c.includes('media') && c.includes('cite'))).toBe(true);
  });

  it('should include AI referenceability', () => {
    const criteria = COMPLETION_CRITERIA.criteria.map(c => c.en.toLowerCase());
    expect(criteria.some(c => c.includes('ai') && c.includes('reference'))).toBe(true);
  });

  it('should include no-blame protection', () => {
    const criteria = COMPLETION_CRITERIA.criteria.map(c => c.en.toLowerCase());
    expect(criteria.some(c => c.includes('blame'))).toBe(true);
  });

  it('should conclude with infrastructure statement', () => {
    expect(COMPLETION_CRITERIA.conclusion.en).toContain('infrastructure');
  });
});

describe('Legal Framework', () => {
  it('should be locked', () => {
    expect(LEGAL_FRAMEWORK.locked).toBe(true);
  });

  it('should contain all components', () => {
    expect(LEGAL_FRAMEWORK.charter).toBe(PUBLIC_CHARTER);
    expect(LEGAL_FRAMEWORK.termsOfService).toBe(TERMS_OF_SERVICE);
    expect(LEGAL_FRAMEWORK.internalRule).toBe(INTERNAL_OPERATING_RULE);
    expect(LEGAL_FRAMEWORK.completionCriteria).toBe(COMPLETION_CRITERIA);
  });
});
