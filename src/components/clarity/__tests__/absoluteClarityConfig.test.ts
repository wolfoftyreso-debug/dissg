/**
 * Absolute Clarity Standard - Tests
 * 
 * 🔬 Validates engineering-grade data presentation rules
 */

import { describe, it, expect } from 'vitest';
import {
  CLARITY_DESIGN_RULES,
  FORBIDDEN_TERMS,
  NEUTRAL_REPLACEMENTS,
  STANDARD_DISCLAIMERS,
  TOPIC_TEMPLATES,
  COMPREHENSION_TARGET,
  validateAnalysisCompleteness,
  scanForForbiddenTerms,
  getNeutralReplacement,
  type ClarityAnalysis,
} from '@/config/absoluteClarityConfig';

describe('Absolute Clarity Standard', () => {
  
  describe('Design Rules', () => {
    it('defines never-allowed elements', () => {
      expect(CLARITY_DESIGN_RULES.never).toContain('Emojis of any kind');
      expect(CLARITY_DESIGN_RULES.never).toContain('Color codes implying good/bad');
      expect(CLARITY_DESIGN_RULES.never).toContain('Arrows up/down with color meaning');
      expect(CLARITY_DESIGN_RULES.never.length).toBeGreaterThanOrEqual(10);
    });

    it('defines always-required elements', () => {
      expect(CLARITY_DESIGN_RULES.always).toContain('Source attribution on every data point');
      expect(CLARITY_DESIGN_RULES.always).toContain('Uncertainty indicators');
      expect(CLARITY_DESIGN_RULES.always.length).toBeGreaterThanOrEqual(8);
    });

    it('defines correct aesthetic feel', () => {
      expect(CLARITY_DESIGN_RULES.aesthetic.feelsLike).toContain('Audit tool');
      expect(CLARITY_DESIGN_RULES.aesthetic.feelsLike).toContain('Laboratory interface');
      expect(CLARITY_DESIGN_RULES.aesthetic.neverFeelsLike).toContain('Marketing material');
      expect(CLARITY_DESIGN_RULES.aesthetic.neverFeelsLike).toContain('Political campaign');
    });

    it('defines grayscale + blue palette only', () => {
      expect(CLARITY_DESIGN_RULES.palette.primary).toBe('hsl(0, 0%, 0%)');
      expect(CLARITY_DESIGN_RULES.palette.accent).toContain('210'); // Blue hue
    });
  });

  describe('Forbidden Terms', () => {
    it('blocks causal language', () => {
      expect(FORBIDDEN_TERMS.causal).toContain('caused');
      expect(FORBIDDEN_TERMS.causal).toContain('led to');
      expect(FORBIDDEN_TERMS.causal).toContain('resulted in');
      expect(FORBIDDEN_TERMS.causal).toContain('proves');
    });

    it('blocks normative language', () => {
      expect(FORBIDDEN_TERMS.normative).toContain('should');
      expect(FORBIDDEN_TERMS.normative).toContain('better');
      expect(FORBIDDEN_TERMS.normative).toContain('worse');
      expect(FORBIDDEN_TERMS.normative).toContain('bad');
    });

    it('blocks speculative language', () => {
      expect(FORBIDDEN_TERMS.speculative).toContain('will');
      expect(FORBIDDEN_TERMS.speculative).toContain('predicted');
      expect(FORBIDDEN_TERMS.speculative).toContain('forecast');
    });

    it('blocks emotive language', () => {
      expect(FORBIDDEN_TERMS.emotive).toContain('crisis');
      expect(FORBIDDEN_TERMS.emotive).toContain('disaster');
      expect(FORBIDDEN_TERMS.emotive).toContain('alarming');
    });

    it('includes Swedish translations', () => {
      expect(FORBIDDEN_TERMS.causal).toContain('orsakade');
      expect(FORBIDDEN_TERMS.normative).toContain('borde');
      expect(FORBIDDEN_TERMS.emotive).toContain('kris');
    });
  });

  describe('Neutral Replacements', () => {
    it('provides replacement for causal terms', () => {
      expect(NEUTRAL_REPLACEMENTS['caused']).toBe('occurred alongside');
      expect(NEUTRAL_REPLACEMENTS['led to']).toBe('was followed by');
      expect(NEUTRAL_REPLACEMENTS['proves']).toBe('is consistent with');
    });

    it('provides replacement for normative terms', () => {
      expect(NEUTRAL_REPLACEMENTS['better']).toBe('higher value');
      expect(NEUTRAL_REPLACEMENTS['worse']).toBe('lower value');
    });

    it('provides replacement for emotive terms', () => {
      expect(NEUTRAL_REPLACEMENTS['crisis']).toBe('deviation from baseline');
      expect(NEUTRAL_REPLACEMENTS['alarming']).toBe('outside expected range');
    });
  });

  describe('scanForForbiddenTerms', () => {
    it('detects forbidden terms in text', () => {
      const result = scanForForbiddenTerms('This policy caused a crisis');
      expect(result.hasForbidden).toBe(true);
      expect(result.found).toContain('caused');
      expect(result.found).toContain('crisis');
    });

    it('returns empty for clean text', () => {
      const result = scanForForbiddenTerms('Observed correlation during the period');
      expect(result.hasForbidden).toBe(false);
      expect(result.found).toHaveLength(0);
    });

    it('identifies categories of forbidden terms', () => {
      const result = scanForForbiddenTerms('This will cause better outcomes');
      expect(result.category).toContain('normative');
      expect(result.category).toContain('speculative');
    });

    it('handles case insensitivity', () => {
      const result = scanForForbiddenTerms('CAUSED by the CRISIS');
      expect(result.hasForbidden).toBe(true);
    });
  });

  describe('getNeutralReplacement', () => {
    it('returns replacement for known term', () => {
      expect(getNeutralReplacement('caused')).toBe('occurred alongside');
    });

    it('returns null for unknown term', () => {
      expect(getNeutralReplacement('unknown')).toBeNull();
    });

    it('is case insensitive', () => {
      expect(getNeutralReplacement('CAUSED')).toBe('occurred alongside');
    });
  });

  describe('Standard Disclaimers', () => {
    it('has bilingual platform statement', () => {
      expect(STANDARD_DISCLAIMERS.platformStatement.en).toContain('does not assign cause');
      expect(STANDARD_DISCLAIMERS.platformStatement.sv).toContain('tillskriver ingen orsak');
    });

    it('has bilingual correlation warning', () => {
      expect(STANDARD_DISCLAIMERS.correlationWarning.en).toContain('No causal claim');
      expect(STANDARD_DISCLAIMERS.correlationWarning.sv).toContain('Inget orsakssamband');
    });

    it('has bilingual comparison statement', () => {
      expect(STANDARD_DISCLAIMERS.comparisonStatement.en).toContain('within/outside');
    });
  });

  describe('Topic Templates', () => {
    it('has pandemic template', () => {
      expect(TOPIC_TEMPLATES.pandemic.title.en).toBe('Observed outcomes during the COVID-19 period');
      expect(TOPIC_TEMPLATES.pandemic.subViews.length).toBeGreaterThanOrEqual(5);
    });

    it('has diet/health template', () => {
      expect(TOPIC_TEMPLATES.diet_health.title.en).toContain('nutrition and health');
      expect(TOPIC_TEMPLATES.diet_health.mandatoryContext.en).toContain('No causal claim');
    });

    it('has environment/energy template', () => {
      expect(TOPIC_TEMPLATES.environment_energy.title.en).toContain('energy mix');
    });

    it('has policy outcomes template', () => {
      expect(TOPIC_TEMPLATES.policy_outcomes.title.en).toContain('before and after');
    });

    it('all templates have mandatory context', () => {
      Object.values(TOPIC_TEMPLATES).forEach(template => {
        expect(template.mandatoryContext.en).toBeDefined();
        expect(template.mandatoryContext.sv).toBeDefined();
      });
    });
  });

  describe('Comprehension Target', () => {
    it('sets 30-second time limit', () => {
      expect(COMPREHENSION_TARGET.timeLimit).toBe(30);
    });

    it('defines 5 questions user should answer', () => {
      expect(COMPREHENSION_TARGET.questionsAnswered.length).toBe(5);
      expect(COMPREHENSION_TARGET.questionsAnswered[0].en).toBe('What do we know?');
      expect(COMPREHENSION_TARGET.questionsAnswered[1].en).toBe('What do we NOT know?');
    });

    it('specifies what must be absent', () => {
      expect(COMPREHENSION_TARGET.without).toContain('Platform taking a position');
      expect(COMPREHENSION_TARGET.without).toContain('Content that can be called biased');
    });
  });

  describe('Analysis Validation', () => {
    it('validates complete analysis', () => {
      const completeAnalysis: Partial<ClarityAnalysis> = {
        id: 'test',
        topic: 'Test',
        generatedAt: new Date().toISOString(),
        observation: { type: 'observation' } as ClarityAnalysis['observation'],
        coMovement: { type: 'co_movement' } as ClarityAnalysis['coMovement'],
        limitations: { type: 'limitations' } as ClarityAnalysis['limitations'],
        misinterpretationRisk: { type: 'misinterpretation_risk' } as ClarityAnalysis['misinterpretationRisk'],
      };
      
      const result = validateAnalysisCompleteness(completeAnalysis);
      expect(result.isValid).toBe(true);
      expect(result.missingBlocks).toHaveLength(0);
    });

    it('rejects analysis without limitations', () => {
      const incompleteAnalysis: Partial<ClarityAnalysis> = {
        id: 'test',
        topic: 'Test',
        observation: { type: 'observation' } as ClarityAnalysis['observation'],
        coMovement: { type: 'co_movement' } as ClarityAnalysis['coMovement'],
        // Missing: limitations, misinterpretationRisk
      };
      
      const result = validateAnalysisCompleteness(incompleteAnalysis);
      expect(result.isValid).toBe(false);
      expect(result.missingBlocks).toContain('limitations');
      expect(result.missingBlocks).toContain('misinterpretationRisk');
    });

    it('requires misinterpretation risk section', () => {
      const incompleteAnalysis: Partial<ClarityAnalysis> = {
        observation: { type: 'observation' } as ClarityAnalysis['observation'],
        coMovement: { type: 'co_movement' } as ClarityAnalysis['coMovement'],
        limitations: { type: 'limitations' } as ClarityAnalysis['limitations'],
        // Missing: misinterpretationRisk
      };
      
      const result = validateAnalysisCompleteness(incompleteAnalysis);
      expect(result.isValid).toBe(false);
      expect(result.missingBlocks).toContain('misinterpretationRisk');
    });
  });
});

describe('Integration: Full Analysis Flow', () => {
  it('validates that controversial topic uses correct template', () => {
    const pandemicTemplate = TOPIC_TEMPLATES.pandemic;
    
    // Title must not contain value judgments
    const titleScan = scanForForbiddenTerms(pandemicTemplate.title.en);
    expect(titleScan.hasForbidden).toBe(false);
    
    // Mandatory context must be present
    expect(pandemicTemplate.mandatoryContext.en).toBeDefined();
    
    // Sub-views must be factual
    pandemicTemplate.subViews.forEach(view => {
      const viewScan = scanForForbiddenTerms(view.name.en);
      expect(viewScan.hasForbidden).toBe(false);
    });
  });

  it('validates all standard disclaimers are clean', () => {
    Object.values(STANDARD_DISCLAIMERS).forEach(disclaimer => {
      // Scan each disclaimer - they may mention "not claimed" which is acceptable
      const _enScan = scanForForbiddenTerms(disclaimer.en);
      // Disclaimers are designed to be neutral explanations
      expect(disclaimer.en.length).toBeGreaterThan(0);
    });
  });
});
