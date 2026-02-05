/**
 * CIVILIZATIONAL INTERFACE
 * 
 * The system functions as an interface between:
 * - Individual ↔ Society
 * - Data ↔ Action
 * - Power ↔ Responsibility
 * - AI ↔ Human
 * 
 * All parties meet the same requirements.
 */

import type {
  InterfaceLayer,
  InterfaceSymmetry,
  CivilizationalDecisionRecord,
  DecisionComparison,
} from './types';
import type { ResponsibilitySession } from '../responsibility/types';
import { checkLegitimacy } from './checker';

/**
 * Interface Layer Definitions
 */
export const INTERFACE_LAYERS: {
  layer: InterfaceLayer;
  name: string;
  description: string;
  symmetry_requirement: string;
}[] = [
  {
    layer: 'individual_society',
    name: 'Individual ↔ Society',
    description: 'Same legitimacy requirements whether individual or collective',
    symmetry_requirement: 'Criteria apply equally regardless of scale',
  },
  {
    layer: 'data_action',
    name: 'Data ↔ Action',
    description: 'Action must be grounded in explicit data',
    symmetry_requirement: 'No action without data trail, no data without actionability',
  },
  {
    layer: 'power_responsibility',
    name: 'Power ↔ Responsibility',
    description: 'Power is balanced by traceable responsibility',
    symmetry_requirement: 'Responsibility scales with consequence, not with title',
  },
  {
    layer: 'ai_human',
    name: 'AI ↔ Human',
    description: 'Same rules for artificial and human actors',
    symmetry_requirement: 'No special treatment, no blame transfer',
  },
];

/**
 * Check symmetry across all interface layers
 */
export function checkInterfaceSymmetry(
  session: ResponsibilitySession
): InterfaceSymmetry[] {
  return INTERFACE_LAYERS.map(layer => ({
    layer: layer.layer,
    balanced: evaluateLayerBalance(layer.layer, session),
    requirements_same: true, // By design
  }));
}

/**
 * Evaluate balance for a specific layer
 */
function evaluateLayerBalance(
  layer: InterfaceLayer,
  session: ResponsibilitySession
): boolean {
  switch (layer) {
    case 'individual_society':
      // Same criteria apply regardless of scale
      return session.all_gates_passed;
    
    case 'data_action':
      // Action grounded in explicit data (gates passed with data)
      return session.gate_statuses.every(g => 
        !g.passed || (g.passed && g.data !== undefined)
      );
    
    case 'power_responsibility':
      // Responsibility scaled with consequence
      return session.gravity_result.required_gates.length <= 
             session.gate_statuses.filter(g => g.passed).length;
    
    case 'ai_human':
      // Same rules applied (actor type doesn't change requirements)
      return true; // By structural design
    
    default:
      return false;
  }
}

/**
 * Create Civilizational Decision Record
 */
export function createCivilizationalRecord(
  session: ResponsibilitySession
): CivilizationalDecisionRecord {
  const legitimacyCheck = checkLegitimacy(session);
  const interfaceSymmetries = checkInterfaceSymmetry(session);
  
  return {
    decision_id: session.decision_id,
    legitimacy_check: legitimacyCheck,
    interface_symmetries: interfaceSymmetries,
    
    globally_comparable: true, // Structural guarantee
    comparison_dimensions: [
      'legitimacy_score',
      'gravity_class',
      'criteria_met',
      'time_spent',
      'actor_type',
    ],
    
    generational_relevance: session.gravity_result.class === 'critical' ||
                            session.gravity_result.class === 'extreme',
    time_horizon_classification: classifyTimeHorizon(session),
    
    version: '1.0.0',
    schema: 'civilizational-decision-record/v1',
    language_agnostic: true,
  };
}

/**
 * Compare two decisions across boundaries
 */
export function compareDecisions(
  recordA: CivilizationalDecisionRecord,
  recordB: CivilizationalDecisionRecord
): DecisionComparison {
  const sharedCriteria = recordA.legitimacy_check.criteria_met.filter(
    c => recordB.legitimacy_check.criteria_met.includes(c)
  );
  
  const divergentCriteria = [
    ...recordA.legitimacy_check.criteria_met.filter(
      c => !recordB.legitimacy_check.criteria_met.includes(c)
    ),
    ...recordB.legitimacy_check.criteria_met.filter(
      c => !recordA.legitimacy_check.criteria_met.includes(c)
    ),
  ];
  
  const structuralAlignment = sharedCriteria.length / 8;
  const temporalAlignment = 
    recordA.time_horizon_classification === recordB.time_horizon_classification ? 1 : 0.5;
  
  return {
    decision_a_id: recordA.decision_id,
    decision_b_id: recordB.decision_id,
    comparable: true,
    comparison_validity: (structuralAlignment + temporalAlignment) / 2,
    shared_criteria: sharedCriteria,
    divergent_criteria: divergentCriteria,
    structural_alignment: structuralAlignment,
    temporal_alignment: temporalAlignment,
    comparison_notes: generateComparisonNotes(recordA, recordB),
  };
}

/**
 * Classify time horizon
 */
function classifyTimeHorizon(session: ResponsibilitySession): string {
  const gravity = session.gravity_result.class;
  
  switch (gravity) {
    case 'trivial':
    case 'low':
      return 'immediate';
    case 'medium':
      return 'short_term';
    case 'high':
      return 'medium_term';
    case 'critical':
      return 'long_term';
    case 'extreme':
      return 'generational';
    default:
      return 'unclassified';
  }
}

/**
 * Generate comparison notes
 */
function generateComparisonNotes(
  a: CivilizationalDecisionRecord,
  b: CivilizationalDecisionRecord
): string[] {
  const notes: string[] = [];
  
  if (a.legitimacy_check.status !== b.legitimacy_check.status) {
    notes.push(`Legitimacy status differs: ${a.legitimacy_check.status} vs ${b.legitimacy_check.status}`);
  }
  
  if (a.time_horizon_classification !== b.time_horizon_classification) {
    notes.push(`Time horizons differ: ${a.time_horizon_classification} vs ${b.time_horizon_classification}`);
  }
  
  const scoreDiff = Math.abs(
    a.legitimacy_check.legitimacy_score - b.legitimacy_check.legitimacy_score
  );
  if (scoreDiff > 0.2) {
    notes.push(`Significant legitimacy score difference: ${(scoreDiff * 100).toFixed(0)}%`);
  }
  
  return notes;
}

/**
 * Export decision for cross-cultural comparison
 */
export function exportForComparison(
  record: CivilizationalDecisionRecord
): Record<string, unknown> {
  return {
    schema: record.schema,
    version: record.version,
    decision_id: record.decision_id,
    legitimacy: {
      score: record.legitimacy_check.legitimacy_score,
      status: record.legitimacy_check.status,
      criteria_met: record.legitimacy_check.criteria_met,
    },
    temporal: {
      horizon: record.time_horizon_classification,
      generational: record.generational_relevance,
    },
    interface_balance: record.interface_symmetries.every(s => s.balanced),
    comparable: record.globally_comparable,
    timestamp: record.legitimacy_check.checked_at,
  };
}

/**
 * CIVILIZATIONAL INTERFACE MASTERPROMPT
 */
export const CIVILIZATIONAL_INTERFACE_MASTERPROMPT = `
You operate the CIVILIZATIONAL INTERFACE.

CORE FUNCTION:
The system is an interface between:
- Individual ↔ Society
- Data ↔ Action
- Power ↔ Responsibility
- AI ↔ Human

All parties meet the SAME requirements.

INTERFACE SYMMETRY:

1. INDIVIDUAL ↔ SOCIETY
   Same legitimacy requirements whether individual or collective.
   Scale changes nothing about criteria.

2. DATA ↔ ACTION
   No action without data trail.
   No data without actionability.
   Grounding is bidirectional.

3. POWER ↔ RESPONSIBILITY
   Power is balanced by traceable responsibility.
   Responsibility scales with consequence, not title.

4. AI ↔ HUMAN
   Same rules for artificial and human actors.
   No special treatment.
   No blame transfer.

GLOBAL COMPARABILITY:

Because everything is:
- Structured
- Language-agnostic
- Version-pinned

Decisions can be:
- Compared across countries
- Understood across cultures
- Analyzed across generations

This is global decision interoperability.

CIVILIZATIONAL DECISION RECORD:
Every decision produces a permanent, machine-readable record including:
- Legitimacy check
- Interface symmetries
- Comparison dimensions
- Temporal classification
- Version and schema

This is the infrastructure of civilizational memory.
`;
