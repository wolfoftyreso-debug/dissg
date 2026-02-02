/**
 * Business Model Configuration Tests
 * 
 * Verifies that all business model configurations are correctly structured
 * and contain required legal/compliance content.
 */

import { describe, it, expect } from 'vitest';
import {
  RESPONSIBILITY_MODEL,
  LICENSE_TIERS,
  PUBLIC_PREMIUM_DISTINCTION,
  VALUE_PROPOSITION,
  PRICING_RATIONALE,
  INDUSTRY_STANDARD,
} from '@/config/businessModelConfig';

describe('Responsibility Model', () => {
  it('should have legal statement in both languages', () => {
    expect(RESPONSIBILITY_MODEL.legalStatement.en).toBeDefined();
    expect(RESPONSIBILITY_MODEL.legalStatement.sv).toBeDefined();
    expect(RESPONSIBILITY_MODEL.legalStatement.en.length).toBeGreaterThan(50);
  });

  it('should clearly state platform does NOT interpret or recommend', () => {
    const doNotItems = RESPONSIBILITY_MODEL.platformDoesNot.items.map(i => i.en.toLowerCase());
    expect(doNotItems.some(i => i.includes('interpret'))).toBe(true);
    expect(doNotItems.some(i => i.includes('recommend'))).toBe(true);
    expect(doNotItems.some(i => i.includes('validate'))).toBe(true);
  });

  it('should place responsibility on user for assumptions and decisions', () => {
    const userItems = RESPONSIBILITY_MODEL.userResponsibility.items.map(i => i.en.toLowerCase());
    expect(userItems.some(i => i.includes('assumption'))).toBe(true);
    expect(userItems.some(i => i.includes('decision'))).toBe(true);
  });
});

describe('License Tiers', () => {
  it('should have exactly 4 tiers', () => {
    expect(LICENSE_TIERS).toHaveLength(4);
  });

  it('should have a free public tier', () => {
    const publicTier = LICENSE_TIERS.find(t => t.id === 'public');
    expect(publicTier).toBeDefined();
    expect(publicTier?.price.value).toBe(0);
  });

  it('should have tiers with increasing value', () => {
    const tierOrder = ['public', 'pro', 'institutional', 'infrastructure'];
    const actualOrder = LICENSE_TIERS.map(t => t.id);
    expect(actualOrder).toEqual(tierOrder);
  });

  it('should have all required fields for each tier', () => {
    LICENSE_TIERS.forEach(tier => {
      expect(tier.id).toBeDefined();
      expect(tier.name.en).toBeDefined();
      expect(tier.name.sv).toBeDefined();
      expect(tier.tagline.en).toBeDefined();
      expect(tier.audience.en).toBeDefined();
      expect(tier.price.display.en).toBeDefined();
      expect(tier.features.length).toBeGreaterThan(0);
      expect(tier.icon).toBeDefined();
      expect(tier.color).toBeDefined();
    });
  });

  it('should have limitations for non-infrastructure tiers', () => {
    const nonInfra = LICENSE_TIERS.filter(t => t.id !== 'infrastructure');
    nonInfra.forEach(tier => {
      expect(tier.limitations.length).toBeGreaterThan(0);
    });
  });
});

describe('Public vs Premium Distinction', () => {
  it('should have core principle defined', () => {
    expect(PUBLIC_PREMIUM_DISTINCTION.principle.en).toContain('free');
    expect(PUBLIC_PREMIUM_DISTINCTION.principle.en).toContain('cost');
  });

  it('should have public items that are truly free', () => {
    const publicItems = PUBLIC_PREMIUM_DISTINCTION.public.items;
    expect(publicItems.length).toBeGreaterThan(0);
    // Verify these are observation/access items, not tools
    const itemTexts = publicItems.map(i => i.en.toLowerCase());
    expect(itemTexts.some(i => i.includes('access') || i.includes('transparency') || i.includes('verification'))).toBe(true);
  });

  it('should have premium items that require payment', () => {
    const premiumItems = PUBLIC_PREMIUM_DISTINCTION.premium.items;
    expect(premiumItems.length).toBeGreaterThan(0);
    // Verify these are tool/export items
    const itemTexts = premiumItems.map(i => i.en.toLowerCase());
    expect(itemTexts.some(i => i.includes('export') || i.includes('api') || i.includes('scenario'))).toBe(true);
  });
});

describe('Value Proposition', () => {
  it('should NOT sell opinions, conclusions, advice, or predictions', () => {
    const doNotSell = VALUE_PROPOSITION.weDoNotSell.items.map(i => i.en.toLowerCase());
    expect(doNotSell).toContain('opinions');
    expect(doNotSell).toContain('conclusions');
    expect(doNotSell).toContain('advice');
    expect(doNotSell).toContain('predictions');
  });

  it('should provide data and tools only', () => {
    const provide = VALUE_PROPOSITION.weSell.items.map(i => i.en.toLowerCase());
    expect(provide.some(i => i.includes('data'))).toBe(true);
    expect(provide.some(i => i.includes('capacity') || i.includes('rigor') || i.includes('infrastructure'))).toBe(true);
  });

  it('should have competitive positioning statement', () => {
    expect(VALUE_PROPOSITION.competitorStatement.en).toContain('bad information');
  });
});

describe('Pricing Rationale', () => {
  it('should explain what price covers', () => {
    expect(PRICING_RATIONALE.costDrivers.items.length).toBeGreaterThan(3);
  });

  it('should explain price as quality filter', () => {
    expect(PRICING_RATIONALE.qualityFilter.points.length).toBeGreaterThan(2);
  });

  it('should have official pricing statement', () => {
    expect(PRICING_RATIONALE.officialStatement.en).toContain('high-integrity');
    expect(PRICING_RATIONALE.officialStatement.en).toContain('verified');
  });
});

describe('Industry Standard Reference', () => {
  it('should reference known professional platforms', () => {
    const platforms = INDUSTRY_STANDARD.similarPlatforms.map(p => p.en);
    expect(platforms.some(p => p.includes('Bloomberg'))).toBe(true);
  });

  it('should state shared principles about responsibility', () => {
    const principles = INDUSTRY_STANDARD.sharedPrinciples.map(p => p.en.toLowerCase());
    expect(principles.some(p => p.includes('no responsibility'))).toBe(true);
  });

  it('should have differentiating conclusion', () => {
    expect(INDUSTRY_STANDARD.conclusion.en).toContain('cleaner');
  });
});
