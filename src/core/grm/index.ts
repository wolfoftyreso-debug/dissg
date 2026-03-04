/**
 * GLOBAL REALITY MODEL (GRM)
 * 
 * Superstructure connecting all domains into a single causal system.
 * ENTITY → STATE → INTERVENTION → EFFECT
 */

export { GlobalRealityModel, createGlobalRealityModel } from './engine';
export type {
  GRMEntity, GRMVariable, GRMIntervention, GRMOutcome,
  GRMCausalLink, GRMDiscovery, GRMSimulationQuery, GRMSimulationResult,
  GRMStats, GRMDomain, GRMEntityCategory, GRMVariableType,
  GRMInterventionType, GRMEffectDuration, GRMConfidenceLevel,
  GRMCausalDirection, GRMPopulationModifier, GRMOutcome as GRMOutcomeType,
} from './types';
export {
  SEED_ENTITIES, SEED_VARIABLES, SEED_INTERVENTIONS,
  SEED_OUTCOMES, SEED_CAUSAL_LINKS,
} from './seed-data';
