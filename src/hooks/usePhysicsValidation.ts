/**
 * usePhysicsValidation Hook
 * 
 * Validates data aggregations against physics principles:
 * - Dimensional consistency
 * - Error propagation
 * - Conservation laws
 */

import { useMemo } from 'react';
import {
  validateAggregationPhysics,
  createUncertaintyValue,
  STANDARD_UNITS,
  type PhysicsValidation,
  type DimensionalUnit,
  type FlowData
} from '@/lib/physics';

interface AggregationInput {
  value: number;
  uncertainty?: number;
  unit?: string;
  sources?: string[];
}

interface AggregationStep {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'average' | 'sum';
  inputs: AggregationInput[];
  description: string;
}

interface UsePhysicsValidationOptions {
  steps: AggregationStep[];
  conservationFlow?: FlowData;
}

export function usePhysicsValidation(options: UsePhysicsValidationOptions): PhysicsValidation {
  const { steps, conservationFlow } = options;
  
  return useMemo(() => {
    // Convert inputs to full physics format
    const physicsSteps = steps.map(step => ({
      operation: step.operation,
      inputs: step.inputs.map(input => ({
        value: input.value,
        uncertainty: input.uncertainty ?? Math.abs(input.value) * 0.01, // Default 1% uncertainty
        unit: getUnit(input.unit),
        sources: input.sources ?? ['unknown']
      })),
      description: step.description
    }));
    
    return validateAggregationPhysics({
      steps: physicsSteps,
      conservationFlow
    });
  }, [steps, conservationFlow]);
}

function getUnit(unitKey?: string): DimensionalUnit {
  if (!unitKey) return STANDARD_UNITS.count;
  return STANDARD_UNITS[unitKey] ?? STANDARD_UNITS.count;
}

/**
 * Simple hook for validating a single calculation
 */
export function useSimplePhysicsCheck(
  values: Array<{ value: number; unit?: string; uncertainty?: number }>,
  operation: 'add' | 'multiply' | 'average'
) {
  return usePhysicsValidation({
    steps: [{
      operation,
      inputs: values.map(v => ({
        value: v.value,
        uncertainty: v.uncertainty,
        unit: v.unit
      })),
      description: 'Beräkning'
    }]
  });
}

/**
 * Hook for validating conservation/balance
 */
export function useConservationCheck(flow: FlowData) {
  return useMemo(() => {
    return validateAggregationPhysics({
      steps: [],
      conservationFlow: flow
    });
  }, [flow]);
}
