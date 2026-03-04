/**
 * ONTOLOGY CORE ARCHITECTURE (OCA)
 * 
 * The anti-collapse layer. 5 fundamental object types.
 * All knowledge reduces to: ENTITY → VARIABLE → STATE
 * All causation reduces to: INTERVENTION → RELATIONSHIP → OUTCOME
 */

export type {
  OCAObjectType, OCADomain, OCAValidationStatus, OCAEvidenceLevel,
  OCAEntityCategory, OCAVariableType, OCAInterventionCategory,
  OCARelationshipType, OCAConflictType, OCAGovernanceAction,
  OCAEntity, OCAVariable, OCAState, OCAIntervention, OCARelationship,
  OCARegistryEntry, OCAConflict, OCAGovernanceEntry, OCAHealthMetrics,
  OCAGeoScope,
} from './types';

export {
  getRegistry, getRegistryByDomain, getRegistryByType, findRegistryEntry,
  proposeConcept, runFullConflictScan, getConflicts, getActiveConflicts,
  validateConcept, freezeConcept, deprecateConcept,
  getGovernanceLog, getOCAHealth,
} from './engine';

export { OCA_SEED_REGISTRY, OCA_SEED_RELATIONSHIPS } from './seed-data';
