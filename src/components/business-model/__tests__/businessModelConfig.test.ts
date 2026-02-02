/**
 * Business Model Configuration Tests — Final Form
 * 
 * Verifies license structure, responsibility model, and export protection.
 */

import { describe, it, expect } from 'vitest';
import {
  LAYER_ARCHITECTURE,
  LICENSE_TIERS,
  RESPONSIBILITY_MODEL,
  IDENTITY_PROTECTION,
  PRICING_RATIONALE,
  EXPORT_PROTECTION,
  BUSINESS_MODEL_SUMMARY,
  PUBLIC_PREMIUM_DISTINCTION,
  VALUE_PROPOSITION,
  INDUSTRY_STANDARD,
} from '@/config/businessModelConfig';

describe('Layer Architecture', () => {
  it('should have Open Reference layer that is always free', () => {
    expect(LAYER_ARCHITECTURE.openReference.price.en.toLowerCase()).toContain('free');
    expect(LAYER_ARCHITECTURE.openReference.price.en.toLowerCase()).toContain('always');
  });

  it('should have Professional Analysis layer that is paid', () => {
    expect(LAYER_ARCHITECTURE.professionalAnalysis.price.en.toLowerCase()).toContain('paid');
  });

  it('should state Open Reference is the democratic floor', () => {
    expect(LAYER_ARCHITECTURE.openReference.principle.en.toLowerCase()).toContain('democratic floor');
    expect(LAYER_ARCHITECTURE.openReference.principle.en.toLowerCase()).toContain('no paywall');
  });

  it('should state Professional layer is work tools, not information', () => {
    expect(LAYER_ARCHITECTURE.professionalAnalysis.principle.en.toLowerCase()).toContain('work tools');
    expect(LAYER_ARCHITECTURE.professionalAnalysis.principle.en.toLowerCase()).toContain('not information');
  });
});

describe('License Tiers', () => {
  it('should have exactly 3 tiers: Observer, Analyst, Institutional', () => {
    expect(LICENSE_TIERS).toHaveLength(3);
    expect(LICENSE_TIERS.map(t => t.id)).toEqual(['observer', 'analyst', 'institutional']);
  });

  it('should have Observer tier as free', () => {
    const observer = LICENSE_TIERS.find(t => t.id === 'observer');
    expect(observer).toBeDefined();
    expect(observer?.price.level).toBe('free');
    expect(observer?.layer).toBe('open_reference');
  });

  it('should have Analyst tier as professional paid', () => {
    const analyst = LICENSE_TIERS.find(t => t.id === 'analyst');
    expect(analyst?.price.level).toBe('professional');
    expect(analyst?.layer).toBe('professional_analysis');
  });

  it('should have Institutional tier as high priced', () => {
    const institutional = LICENSE_TIERS.find(t => t.id === 'institutional');
    expect(institutional?.price.level).toBe('high');
    expect(institutional?.layer).toBe('professional_analysis');
  });

  it('should have no scenario analysis in Observer tier', () => {
    const observer = LICENSE_TIERS.find(t => t.id === 'observer');
    const limitations = observer?.limitations.map(l => l.en.toLowerCase()) || [];
    expect(limitations.some(l => l.includes('no scenario'))).toBe(true);
  });

  it('should have all required fields for each tier', () => {
    LICENSE_TIERS.forEach(tier => {
      expect(tier.id).toBeDefined();
      expect(tier.name.en).toBeDefined();
      expect(tier.name.sv).toBeDefined();
      expect(tier.layer).toBeDefined();
      expect(tier.price.display.en).toBeDefined();
      expect(tier.features.length).toBeGreaterThan(0);
    });
  });
});

describe('Responsibility Model', () => {
  it('should have platform responsible for data integrity and methodology', () => {
    const items = RESPONSIBILITY_MODEL.platformResponsibleFor.items.map(i => i.en.toLowerCase());
    expect(items.some(i => i.includes('data integrity'))).toBe(true);
    expect(items.some(i => i.includes('methodology'))).toBe(true);
    expect(items.some(i => i.includes('traceability'))).toBe(true);
  });

  it('should have platform NOT responsible for user decisions', () => {
    const items = RESPONSIBILITY_MODEL.platformNotResponsibleFor.items.map(i => i.en.toLowerCase());
    expect(items.some(i => i.includes('user assumptions'))).toBe(true);
    expect(items.some(i => i.includes('user conclusions'))).toBe(true);
    expect(items.some(i => i.includes('user decisions'))).toBe(true);
  });

  it('should have legal statement about sole user responsibility', () => {
    const statement = RESPONSIBILITY_MODEL.legalStatement.en.toLowerCase();
    expect(statement).toContain('platform provides tools and data');
    expect(statement).toContain('sole responsibility of the user');
  });

  it('should state this is industry standard', () => {
    expect(RESPONSIBILITY_MODEL.industryStandard.en.toLowerCase()).toContain('industry standard');
  });

  it('should have legacy compatibility fields', () => {
    expect(RESPONSIBILITY_MODEL.platformProvides).toBeDefined();
    expect(RESPONSIBILITY_MODEL.platformDoesNot).toBeDefined();
    expect(RESPONSIBILITY_MODEL.userResponsibility).toBeDefined();
  });
});

describe('Identity Protection', () => {
  it('should clearly state what we are NOT', () => {
    const notItems = IDENTITY_PROTECTION.weAreNot.items.map(i => i.en.toLowerCase());
    expect(notItems).toContain('advisory firm');
    expect(notItems).toContain('consultant');
    expect(notItems).toContain('political actor');
  });

  it('should clearly state what we do NOT do', () => {
    const doNotItems = IDENTITY_PROTECTION.weDoNot.items.map(i => i.en.toLowerCase());
    expect(doNotItems.some(i => i.includes('recommendation'))).toBe(true);
    expect(doNotItems.some(i => i.includes('conclusions for clients'))).toBe(true);
    expect(doNotItems.some(i => i.includes('responsibility for decisions'))).toBe(true);
  });

  it('should state we are infrastructure provider', () => {
    const statement = IDENTITY_PROTECTION.weAre.statement.en.toLowerCase();
    expect(statement).toContain('infrastructure');
  });

  it('should list benefits of this positioning', () => {
    const benefits = IDENTITY_PROTECTION.benefits.items.map(i => i.en.toLowerCase());
    expect(benefits.some(i => i.includes('never become political'))).toBe(true);
    expect(benefits.some(i => i.includes('legally exposed'))).toBe(true);
  });
});

describe('Pricing Rationale', () => {
  it('should explain benefits of high price', () => {
    const benefits = PRICING_RATIONALE.benefits.map(b => b.en.toLowerCase());
    expect(benefits.some(b => b.includes('signals seriousness'))).toBe(true);
    expect(benefits.some(b => b.includes('filters'))).toBe(true);
    expect(benefits.some(b => b.includes('misuse'))).toBe(true);
  });

  it('should state we sell peace of work, not insights', () => {
    expect(PRICING_RATIONALE.positioning.weDoNotSell.en.toLowerCase()).toContain('insights');
    expect(PRICING_RATIONALE.positioning.weSell.en.toLowerCase()).toContain('peace');
  });

  it('should conclude it is cheaper to use us', () => {
    expect(PRICING_RATIONALE.conclusion.en.toLowerCase()).toContain('cheaper to use us');
  });

  it('should have legacy compatibility fields', () => {
    expect(PRICING_RATIONALE.costDrivers).toBeDefined();
    expect(PRICING_RATIONALE.qualityFilter).toBeDefined();
    expect(PRICING_RATIONALE.officialStatement).toBeDefined();
  });
});

describe('Export Protection', () => {
  it('should require all exports to contain disclaimer elements', () => {
    const items = EXPORT_PROTECTION.allExportsContain.items.map(i => i.en.toLowerCase());
    expect(items.some(i => i.includes('user-generated'))).toBe(true);
    expect(items.some(i => i.includes('assumptions'))).toBe(true);
    expect(items.some(i => i.includes('uncertainty'))).toBe(true);
    expect(items.some(i => i.includes('methodology'))).toBe(true);
    expect(items.some(i => i.includes('responsibility clause'))).toBe(true);
  });

  it('should prevent export without disclaimer', () => {
    const prevents = EXPORT_PROTECTION.systemPrevents.items.map(i => i.en.toLowerCase());
    expect(prevents.some(i => i.includes('without disclaimer'))).toBe(true);
    expect(prevents.some(i => i.includes('removal of methodology'))).toBe(true);
    expect(prevents.some(i => i.includes('simplification'))).toBe(true);
  });

  it('should state this protects both platform and user', () => {
    expect(EXPORT_PROTECTION.principle.en.toLowerCase()).toContain('protects both');
  });
});

describe('Business Model Summary', () => {
  it('should clearly state what we are NOT', () => {
    const notThis = BUSINESS_MODEL_SUMMARY.notThis.map(n => n.en.toLowerCase());
    expect(notThis.some(n => n.includes('advisory'))).toBe(true);
  });

  it('should state we are neutral, professional, expensive and clean', () => {
    const statement = BUSINESS_MODEL_SUMMARY.butThis.en.toLowerCase();
    expect(statement).toContain('neutral');
    expect(statement).toContain('professional');
    expect(statement).toContain('expensive');
    expect(statement).toContain('clean');
  });

  it('should require it to be expensive, demanding, and serious', () => {
    const requirements = BUSINESS_MODEL_SUMMARY.requirements.map(r => r.en.toLowerCase());
    expect(requirements.some(r => r.includes('expensive'))).toBe(true);
    expect(requirements.some(r => r.includes('demanding'))).toBe(true);
    expect(requirements.some(r => r.includes('serious'))).toBe(true);
  });
});

describe('Legacy Compatibility', () => {
  it('should maintain PUBLIC_PREMIUM_DISTINCTION', () => {
    expect(PUBLIC_PREMIUM_DISTINCTION.principle.en).toContain('free');
    expect(PUBLIC_PREMIUM_DISTINCTION.public.items.length).toBeGreaterThan(0);
  });

  it('should maintain VALUE_PROPOSITION', () => {
    expect(VALUE_PROPOSITION.weDoNotSell.items.map(i => i.en.toLowerCase())).toContain('opinions');
    expect(VALUE_PROPOSITION.competitorStatement.en).toContain('bad information');
  });

  it('should maintain INDUSTRY_STANDARD', () => {
    expect(INDUSTRY_STANDARD.similarPlatforms.some(p => p.en.includes('Bloomberg'))).toBe(true);
    expect(INDUSTRY_STANDARD.conclusion.en).toContain('cleaner');
  });
});
