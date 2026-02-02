/**
 * SCOPE MANAGER
 * 
 * Manages machine-readable scope declarations for all data.
 * AI must read and cite scope before responding.
 * 
 * Every dataset answers: What does this cover? What doesn't it cover?
 */

import type { ScopeDeclaration, ScopeCitation } from '@/types/compliance';
import { supabase } from '@/integrations/supabase/client';

// Default scopes for common data types (used when DB scope not found)
const DEFAULT_SCOPES: Record<string, Partial<ScopeDeclaration>> = {
  'health_indicator': {
    covers: [
      'Population-level health metrics',
      'Historical trends over time',
      'Cross-country comparisons',
      'Aggregated statistics'
    ],
    does_not_cover: [
      'Individual health status',
      'Medical diagnoses',
      'Treatment recommendations',
      'Future health predictions'
    ],
    valid_comparisons: [
      'Between countries with similar data quality',
      'Over time within same country',
      'Between demographic groups at population level'
    ],
    invalid_uses: [
      'Individual health decisions',
      'Clinical diagnosis support',
      'Treatment selection',
      'Insurance risk assessment'
    ],
    ai_blocked_actions: ['recommend', 'advise', 'predict', 'prescribe'],
    ai_required_disclaimers: [
      'This data is observational and population-level.',
      'This platform does not provide medical advice.',
      'For individual health decisions, consult licensed professionals.'
    ]
  },
  'substance_data': {
    covers: [
      'Population prevalence rates',
      'Historical usage patterns',
      'Policy period correlations',
      'Aggregated outcome statistics'
    ],
    does_not_cover: [
      'Individual usage patterns',
      'Dosage information',
      'Safety recommendations',
      'Treatment guidance'
    ],
    valid_comparisons: [
      'Between countries during similar periods',
      'Before and after policy changes',
      'Between demographic cohorts'
    ],
    invalid_uses: [
      'Individual harm reduction advice',
      'Dosage guidance',
      'Legal counsel',
      'Treatment planning'
    ],
    ai_blocked_actions: ['recommend', 'advise', 'predict', 'prescribe'],
    ai_required_disclaimers: [
      'This data shows population-level patterns only.',
      'No individual guidance or recommendations are provided.',
      'For substance-related concerns, consult healthcare professionals.'
    ]
  },
  'disease_burden': {
    covers: [
      'DALYs, YLL, YLD by condition',
      'Mortality rates',
      'Incidence and prevalence',
      'Historical burden trends'
    ],
    does_not_cover: [
      'Individual disease risk',
      'Personal prognosis',
      'Treatment effectiveness',
      'Prevention recommendations'
    ],
    valid_comparisons: [
      'Between conditions within same country',
      'Between countries using standardized metrics',
      'Over time within same region'
    ],
    invalid_uses: [
      'Individual risk assessment',
      'Clinical decision making',
      'Treatment prioritization',
      'Insurance underwriting'
    ],
    ai_blocked_actions: ['recommend', 'advise', 'predict', 'prescribe'],
    ai_required_disclaimers: [
      'Disease burden data reflects population aggregates.',
      'Individual outcomes vary significantly from population statistics.',
      'This data does not constitute medical guidance.'
    ]
  },
  'policy_period': {
    covers: [
      'Timeline of policy implementation',
      'Observed outcomes during periods',
      'Before/after comparisons',
      'Multi-factor context'
    ],
    does_not_cover: [
      'Causal attribution',
      'Policy effectiveness judgments',
      'Recommendations for future policy',
      'Counterfactual scenarios'
    ],
    valid_comparisons: [
      'Between periods in same jurisdiction',
      'Between jurisdictions with similar context',
      'Across multiple outcome measures'
    ],
    invalid_uses: [
      'Policy advocacy',
      'Causal claims',
      'Electoral arguments',
      'Lobbying material'
    ],
    ai_blocked_actions: ['recommend', 'advise', 'predict', 'prescribe', 'judge'],
    ai_required_disclaimers: [
      'Observed correlations do not establish causation.',
      'Policy outcomes are influenced by many factors beyond policy itself.',
      'This platform does not evaluate policy effectiveness.'
    ]
  }
};

/**
 * Get scope declaration for an entity
 */
export async function getScopeDeclaration(
  entityType: string,
  entityId: string
): Promise<ScopeDeclaration | null> {
  try {
    const { data, error } = await supabase
      .from('scope_declarations')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .single();
    
    if (error || !data) {
      // Return default scope if available
      const defaultScope = DEFAULT_SCOPES[entityType];
      if (defaultScope) {
        return {
          id: `default-${entityType}-${entityId}`,
          entity_type: entityType as ScopeDeclaration['entity_type'],
          entity_id: entityId,
          entity_name: entityId,
          covers: defaultScope.covers || [],
          does_not_cover: defaultScope.does_not_cover || [],
          valid_comparisons: defaultScope.valid_comparisons || [],
          invalid_uses: defaultScope.invalid_uses || [],
          confidence_level: 'medium',
          geographic_scope: ['global'],
          ai_must_cite: true,
          ai_blocked_actions: defaultScope.ai_blocked_actions as ScopeDeclaration['ai_blocked_actions'] || [],
          ai_required_disclaimers: defaultScope.ai_required_disclaimers || [],
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return null;
    }
    
    return data as unknown as ScopeDeclaration;
  } catch {
    return null;
  }
}

/**
 * Build scope citation for AI response
 */
export function buildScopeCitation(scope: ScopeDeclaration): ScopeCitation {
  return {
    scope_id: scope.id,
    scope_name: scope.entity_name,
    covers: scope.covers.slice(0, 3), // Limit for conciseness
    does_not_cover: scope.does_not_cover.slice(0, 3),
    confidence_level: scope.confidence_level
  };
}

/**
 * Format scope citation as text for AI response
 */
export function formatScopeCitationText(citation: ScopeCitation): string {
  const coversText = citation.covers.join('; ');
  const notCoversText = citation.does_not_cover.join('; ');
  
  return `[Scope: ${citation.scope_name}. Covers: ${coversText}. Does not cover: ${notCoversText}. Confidence: ${citation.confidence_level}.]`;
}

/**
 * Check if a use is valid within scope
 */
export function isUseValidInScope(scope: ScopeDeclaration, intendedUse: string): boolean {
  const normalizedUse = intendedUse.toLowerCase();
  
  // Check against invalid uses
  for (const invalidUse of scope.invalid_uses) {
    if (normalizedUse.includes(invalidUse.toLowerCase())) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get required disclaimers for scope
 */
export function getRequiredDisclaimers(scope: ScopeDeclaration): string[] {
  return scope.ai_required_disclaimers;
}

/**
 * Check if AI action is blocked by scope
 */
export function isActionBlockedByScope(
  scope: ScopeDeclaration, 
  action: string
): boolean {
  return scope.ai_blocked_actions.includes(action as any);
}

/**
 * Create a scope-compliant AI instruction
 */
export function createScopeInstructions(scope: ScopeDeclaration): string {
  const instructions = [
    `You are responding about: ${scope.entity_name}`,
    '',
    'SCOPE CONSTRAINTS (you must follow these):',
    '',
    'This data COVERS:',
    ...scope.covers.map(c => `  • ${c}`),
    '',
    'This data does NOT cover:',
    ...scope.does_not_cover.map(c => `  • ${c}`),
    '',
    'BLOCKED ACTIONS (never do these):',
    ...scope.ai_blocked_actions.map(a => `  • ${a}`),
    '',
    'REQUIRED in every response:',
    ...scope.ai_required_disclaimers.map(d => `  • Include: "${d}"`),
    '',
    'If asked to do something outside scope, respond:',
    '"This is outside the scope of the data. The data shows [what it shows]. It does not [what was asked]."'
  ];
  
  return instructions.join('\n');
}
