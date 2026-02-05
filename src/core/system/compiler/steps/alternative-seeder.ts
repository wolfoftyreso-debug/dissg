/**
 * STEP 6: ALTERNATIVE SEEDING (SYMMETRICAL)
 * 
 * At least two reasonable alternatives are seeded (not ranked).
 * Exact alternatives can be swapped when data exists; symmetry is maintained.
 */

import type { NormalizedIntent, ResolvedEntity, DecisionBlueprint, AlternativeSeed } from '../types';

// ═══════════════════════════════════════════════════════════════════
//                         ALTERNATIVE SEEDER
// ═══════════════════════════════════════════════════════════════════

export function seedAlternatives(
  intent: NormalizedIntent,
  entity: ResolvedEntity,
  blueprint: DecisionBlueprint
): readonly AlternativeSeed[] {
  const alternatives: AlternativeSeed[] = [];
  
  // Primary alternative: the queried entity
  alternatives.push({
    label: entity.name,
    description: `The specifically queried option.`,
    required_assumptions: [],
    is_placeholder: entity.is_stub,
  });
  
  // Secondary alternative: comparable category
  const categoryAlternative = generateCategoryAlternative(intent, entity);
  alternatives.push(categoryAlternative);
  
  // Ensure minimum alternatives
  while (alternatives.length < blueprint.required.alternatives) {
    alternatives.push({
      label: `Alternative ${alternatives.length + 1}`,
      description: 'Unspecified alternative for comparison.',
      required_assumptions: [],
      is_placeholder: true,
    });
  }
  
  return alternatives;
}

function generateCategoryAlternative(
  intent: NormalizedIntent,
  entity: ResolvedEntity
): AlternativeSeed {
  const categoryLabels: Record<string, string> = {
    vehicle_model: 'Comparable vehicles in the same class',
    product: 'Comparable products in the same category',
    service: 'Alternative service providers',
    location: 'Comparable locations with similar characteristics',
    organization: 'Comparable organizations',
    investment: 'Alternative investment vehicles',
    career_path: 'Alternative career paths',
    health_intervention: 'Alternative treatment options',
    educational_program: 'Alternative educational programs',
    policy: 'Alternative policy approaches',
  };
  
  const categoryDescriptions: Record<string, string> = {
    vehicle_model: 'Other vehicles in the compact class for comparison.',
    product: 'Other products serving similar needs.',
    service: 'Other providers offering comparable service.',
    location: 'Other locations meeting similar criteria.',
    organization: 'Other organizations in the same sector.',
    investment: 'Other investment options with comparable profiles.',
    career_path: 'Other career directions with similar requirements.',
    health_intervention: 'Other interventions targeting similar outcomes.',
    educational_program: 'Other programs with similar scope.',
    policy: 'Other policy options addressing similar issues.',
  };
  
  return {
    label: categoryLabels[entity.type] || 'Comparable alternatives',
    description: categoryDescriptions[entity.type] || 'Alternative options for comparison.',
    required_assumptions: [],
    is_placeholder: true,
  };
}
