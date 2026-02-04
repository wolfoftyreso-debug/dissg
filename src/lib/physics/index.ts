/**
 * PHYSICS LAYER EXPORTS
 * 
 * Applies physics principles to data aggregation:
 * - Dimensional Analysis
 * - Error Propagation
 * - Conservation Laws
 */

export {
  // Types
  type BaseDimension,
  type DimensionalUnit,
  type DimensionalValue,
  type DimensionalCheckResult,
  type UncertaintyValue,
  type ConservationCheck,
  type FlowData,
  type PhysicsValidation,
  
  // Dimensional Analysis
  STANDARD_UNITS,
  checkDimensionalCompatibility,
  validateAggregationChain,
  
  // Error Propagation
  createUncertaintyValue,
  propagateUncertaintyAdditive,
  propagateUncertaintyMultiplicative,
  propagateUncertaintyAverage,
  calculateUncertaintyChain,
  
  // Conservation Laws
  checkConservation,
  validateBudgetIdentity,
  
  // Complete Validation
  validateAggregationPhysics,
  PhysicsLayer
} from './physicsLayer';
