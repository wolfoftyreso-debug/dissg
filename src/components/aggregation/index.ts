/**
 * Aggregation Layer Exports
 * 
 * Block C: Comparability lint and uncertainty indicators
 * PHYSICS LAYER: Dimensional analysis, error propagation, conservation laws
 */

export * from '@/lib/aggregation/aggregationGuard';
export * from './AggregationGuard';

// Physics Layer
export * from '@/lib/physics';
export { PhysicsValidationDisplay, PhysicsStatusBadge } from './PhysicsValidationDisplay';
export { usePhysicsValidation, useSimplePhysicsCheck, useConservationCheck } from '@/hooks/usePhysicsValidation';
