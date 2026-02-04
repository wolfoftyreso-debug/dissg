/**
 * PHYSICS THINKING LAYER
 * 
 * Applies physics principles to data aggregation:
 * 1. Dimensional Analysis - Units must match
 * 2. Error Propagation - Uncertainty grows through calculations
 * 3. Conservation Laws - Data must balance (In = Out + Accumulation)
 * 
 * "If the units don't match, the answer is wrong."
 */

// =============================================================================
// DIMENSIONAL ANALYSIS
// =============================================================================

/**
 * Physical dimension types following SI base units
 */
export type BaseDimension = 
  | 'count'        // dimensionless count
  | 'population'   // people
  | 'currency'     // monetary value
  | 'time'         // seconds/years
  | 'area'         // m² or km²
  | 'ratio'        // dimensionless ratio (0-1)
  | 'percentage'   // dimensionless (0-100)
  | 'rate'         // something per time
  | 'density'      // something per area
  | 'intensity'    // something per capita
  | 'index'        // normalized index value
  | 'composite';   // derived from multiple dimensions

export interface DimensionalUnit {
  /** Base dimension */
  dimension: BaseDimension;
  /** SI-style unit symbol */
  symbol: string;
  /** Numerator dimensions (for rates) */
  numerator?: BaseDimension[];
  /** Denominator dimensions (for rates) */
  denominator?: BaseDimension[];
  /** Conversion factor to base unit */
  conversionFactor?: number;
  /** Human-readable name */
  displayName: string;
}

/**
 * Standard unit definitions
 */
export const STANDARD_UNITS: Record<string, DimensionalUnit> = {
  // Base units
  count: { dimension: 'count', symbol: '', displayName: 'antal' },
  persons: { dimension: 'population', symbol: 'pers', displayName: 'personer' },
  sek: { dimension: 'currency', symbol: 'SEK', displayName: 'kronor' },
  eur: { dimension: 'currency', symbol: 'EUR', displayName: 'euro', conversionFactor: 11.5 },
  years: { dimension: 'time', symbol: 'år', displayName: 'år' },
  months: { dimension: 'time', symbol: 'mån', displayName: 'månader', conversionFactor: 1/12 },
  km2: { dimension: 'area', symbol: 'km²', displayName: 'kvadratkilometer' },
  
  // Ratios
  ratio: { dimension: 'ratio', symbol: '', displayName: 'kvot' },
  percent: { dimension: 'percentage', symbol: '%', displayName: 'procent' },
  permille: { dimension: 'percentage', symbol: '‰', displayName: 'promille', conversionFactor: 0.1 },
  
  // Rates
  per_capita: { 
    dimension: 'intensity', 
    symbol: '/cap', 
    numerator: ['count'],
    denominator: ['population'],
    displayName: 'per capita' 
  },
  per_100k: { 
    dimension: 'intensity', 
    symbol: '/100k', 
    numerator: ['count'],
    denominator: ['population'],
    displayName: 'per 100 000 invånare',
    conversionFactor: 100000
  },
  per_year: {
    dimension: 'rate',
    symbol: '/år',
    numerator: ['count'],
    denominator: ['time'],
    displayName: 'per år'
  },
  per_km2: {
    dimension: 'density',
    symbol: '/km²',
    numerator: ['population'],
    denominator: ['area'],
    displayName: 'per kvadratkilometer'
  },
  
  // Index
  index_100: { dimension: 'index', symbol: 'idx', displayName: 'index (bas=100)' },
  index_1: { dimension: 'index', symbol: 'λ', displayName: 'index (bas=1.0)' },
};

export interface DimensionalValue {
  value: number;
  unit: DimensionalUnit;
  uncertainty?: number;
}

export interface DimensionalCheckResult {
  isValid: boolean;
  dimension: BaseDimension | null;
  resultUnit: DimensionalUnit | null;
  error?: string;
  warning?: string;
}

/**
 * Check if two values can be added/subtracted
 */
export function checkDimensionalCompatibility(
  a: DimensionalValue,
  b: DimensionalValue,
  operation: 'add' | 'subtract' | 'multiply' | 'divide'
): DimensionalCheckResult {
  // Addition/subtraction requires same dimensions
  if (operation === 'add' || operation === 'subtract') {
    if (a.unit.dimension !== b.unit.dimension) {
      return {
        isValid: false,
        dimension: null,
        resultUnit: null,
        error: `[DIMENSIONSFEL] Kan inte ${operation === 'add' ? 'addera' : 'subtrahera'} ` +
               `${a.unit.displayName} (${a.unit.dimension}) ` +
               `med ${b.unit.displayName} (${b.unit.dimension})`
      };
    }
    
    // Same dimension, check unit compatibility
    if (a.unit.symbol !== b.unit.symbol) {
      return {
        isValid: true,
        dimension: a.unit.dimension,
        resultUnit: a.unit,
        warning: `[ENHETSVARNING] Olika enheter: ${a.unit.symbol} och ${b.unit.symbol}. ` +
                 `Konvertering krävs.`
      };
    }
    
    return {
      isValid: true,
      dimension: a.unit.dimension,
      resultUnit: a.unit
    };
  }
  
  // Multiplication creates new dimensions
  if (operation === 'multiply') {
    // Special case: multiplying by dimensionless
    if (a.unit.dimension === 'count' || a.unit.dimension === 'ratio') {
      return { isValid: true, dimension: b.unit.dimension, resultUnit: b.unit };
    }
    if (b.unit.dimension === 'count' || b.unit.dimension === 'ratio') {
      return { isValid: true, dimension: a.unit.dimension, resultUnit: a.unit };
    }
    
    return {
      isValid: true,
      dimension: 'composite',
      resultUnit: {
        dimension: 'composite',
        symbol: `${a.unit.symbol}·${b.unit.symbol}`,
        displayName: `${a.unit.displayName} × ${b.unit.displayName}`
      }
    };
  }
  
  // Division
  if (operation === 'divide') {
    // Dividing same dimensions gives ratio
    if (a.unit.dimension === b.unit.dimension) {
      return {
        isValid: true,
        dimension: 'ratio',
        resultUnit: STANDARD_UNITS.ratio
      };
    }
    
    // Create rate
    return {
      isValid: true,
      dimension: 'rate',
      resultUnit: {
        dimension: 'rate',
        symbol: `${a.unit.symbol}/${b.unit.symbol}`,
        numerator: [a.unit.dimension],
        denominator: [b.unit.dimension],
        displayName: `${a.unit.displayName} per ${b.unit.displayName}`
      }
    };
  }
  
  return { isValid: false, dimension: null, resultUnit: null, error: 'Okänd operation' };
}

/**
 * Validate a complete aggregation chain for dimensional consistency
 */
export function validateAggregationChain(
  steps: Array<{
    operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'average' | 'sum';
    inputs: DimensionalValue[];
    description: string;
  }>
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  for (const step of steps) {
    // Sum/average requires all same dimension
    if (step.operation === 'sum' || step.operation === 'average') {
      const firstDim = step.inputs[0]?.unit.dimension;
      for (let i = 1; i < step.inputs.length; i++) {
        if (step.inputs[i].unit.dimension !== firstDim) {
          errors.push(
            `[STEG: ${step.description}] Dimensionskonflikt vid ${step.operation}: ` +
            `Blandar ${firstDim} med ${step.inputs[i].unit.dimension}`
          );
        }
      }
    }
    
    // Binary operations
    if (step.inputs.length === 2) {
      const op = step.operation === 'sum' ? 'add' : 
                 step.operation === 'average' ? 'add' : step.operation;
      const check = checkDimensionalCompatibility(
        step.inputs[0], 
        step.inputs[1], 
        op as 'add' | 'subtract' | 'multiply' | 'divide'
      );
      
      if (!check.isValid) {
        errors.push(`[STEG: ${step.description}] ${check.error}`);
      }
      if (check.warning) {
        warnings.push(`[STEG: ${step.description}] ${check.warning}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// =============================================================================
// ERROR PROPAGATION
// =============================================================================

export interface UncertaintyValue {
  /** Central value */
  value: number;
  /** Absolute uncertainty (±) */
  uncertainty: number;
  /** Relative uncertainty (fraction) */
  relativeUncertainty: number;
  /** Confidence level (typically 0.95 for 95%) */
  confidenceLevel: number;
  /** Degrees of freedom (for t-distribution) */
  degreesOfFreedom?: number;
  /** Sources of uncertainty */
  sources: string[];
}

/**
 * Create an uncertainty value
 */
export function createUncertaintyValue(
  value: number,
  uncertainty: number,
  sources: string[] = [],
  confidenceLevel = 0.95
): UncertaintyValue {
  return {
    value,
    uncertainty: Math.abs(uncertainty),
    relativeUncertainty: value !== 0 ? Math.abs(uncertainty / value) : 0,
    confidenceLevel,
    sources
  };
}

/**
 * Propagate uncertainty through addition/subtraction
 * σ_total = √(σ₁² + σ₂² + ...)
 */
export function propagateUncertaintyAdditive(
  values: UncertaintyValue[]
): UncertaintyValue {
  const sum = values.reduce((acc, v) => acc + v.value, 0);
  const combinedUncertainty = Math.sqrt(
    values.reduce((acc, v) => acc + v.uncertainty ** 2, 0)
  );
  
  return {
    value: sum,
    uncertainty: combinedUncertainty,
    relativeUncertainty: sum !== 0 ? combinedUncertainty / Math.abs(sum) : 0,
    confidenceLevel: Math.min(...values.map(v => v.confidenceLevel)),
    sources: [...new Set(values.flatMap(v => v.sources))]
  };
}

/**
 * Propagate uncertainty through multiplication/division
 * (σ_r/r)² = (σ_a/a)² + (σ_b/b)²
 */
export function propagateUncertaintyMultiplicative(
  a: UncertaintyValue,
  b: UncertaintyValue,
  operation: 'multiply' | 'divide'
): UncertaintyValue {
  const result = operation === 'multiply' 
    ? a.value * b.value 
    : a.value / b.value;
  
  // Relative uncertainty combines in quadrature
  const relativeUncertainty = Math.sqrt(
    a.relativeUncertainty ** 2 + b.relativeUncertainty ** 2
  );
  
  return {
    value: result,
    uncertainty: Math.abs(result) * relativeUncertainty,
    relativeUncertainty,
    confidenceLevel: Math.min(a.confidenceLevel, b.confidenceLevel),
    sources: [...new Set([...a.sources, ...b.sources])]
  };
}

/**
 * Propagate uncertainty through averaging
 * σ_mean = σ / √n
 */
export function propagateUncertaintyAverage(
  values: UncertaintyValue[]
): UncertaintyValue {
  const n = values.length;
  if (n === 0) {
    return createUncertaintyValue(0, 0, ['Ingen data']);
  }
  
  const mean = values.reduce((acc, v) => acc + v.value, 0) / n;
  
  // Standard error of the mean
  const variance = values.reduce((acc, v) => acc + (v.value - mean) ** 2, 0) / (n - 1);
  const standardError = Math.sqrt(variance / n);
  
  // Also consider input uncertainties
  const inputUncertainty = Math.sqrt(
    values.reduce((acc, v) => acc + v.uncertainty ** 2, 0)
  ) / n;
  
  // Combined uncertainty (whichever is larger)
  const totalUncertainty = Math.max(standardError, inputUncertainty);
  
  return {
    value: mean,
    uncertainty: totalUncertainty,
    relativeUncertainty: mean !== 0 ? totalUncertainty / Math.abs(mean) : 0,
    confidenceLevel: Math.min(...values.map(v => v.confidenceLevel)),
    degreesOfFreedom: n - 1,
    sources: [...new Set(values.flatMap(v => v.sources))]
  };
}

/**
 * Calculate uncertainty chain through aggregation
 */
export function calculateUncertaintyChain(
  steps: Array<{
    operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'average';
    inputs: UncertaintyValue[];
  }>
): UncertaintyValue {
  let result: UncertaintyValue | null = null;
  
  for (const step of steps) {
    if (step.operation === 'average') {
      result = propagateUncertaintyAverage(step.inputs);
    } else if (step.operation === 'add' || step.operation === 'subtract') {
      result = propagateUncertaintyAdditive(step.inputs);
      if (step.operation === 'subtract' && step.inputs.length === 2) {
        result = { ...result, value: step.inputs[0].value - step.inputs[1].value };
      }
    } else if (step.operation === 'multiply' || step.operation === 'divide') {
      if (step.inputs.length !== 2) {
        throw new Error('Multiplication/division requires exactly 2 inputs');
      }
      result = propagateUncertaintyMultiplicative(step.inputs[0], step.inputs[1], step.operation);
    }
  }
  
  return result || createUncertaintyValue(0, 0, ['Ingen beräkning']);
}

// =============================================================================
// CONSERVATION LAWS
// =============================================================================

export interface ConservationCheck {
  /** Is the system balanced? */
  isBalanced: boolean;
  /** Imbalance amount */
  imbalance: number;
  /** Imbalance as percentage */
  imbalancePercent: number;
  /** Is imbalance within tolerance? */
  withinTolerance: boolean;
  /** Applied tolerance */
  tolerance: number;
  /** Human-readable explanation */
  explanation: string;
  /** Flagged anomalies */
  anomalies: string[];
}

export interface FlowData {
  /** Inflows */
  inputs: Array<{ label: string; value: number; uncertainty?: number }>;
  /** Outflows */
  outputs: Array<{ label: string; value: number; uncertainty?: number }>;
  /** Stock changes (accumulation) */
  stockChange?: { label: string; value: number; uncertainty?: number };
}

/**
 * Check conservation: Sum(inputs) = Sum(outputs) + ΔStock
 */
export function checkConservation(
  flow: FlowData,
  tolerancePercent = 1.0
): ConservationCheck {
  const totalInputs = flow.inputs.reduce((acc, i) => acc + i.value, 0);
  const totalOutputs = flow.outputs.reduce((acc, o) => acc + o.value, 0);
  const stockChange = flow.stockChange?.value || 0;
  
  // Conservation equation: In = Out + ΔStock
  const expected = totalOutputs + stockChange;
  const imbalance = totalInputs - expected;
  const imbalancePercent = totalInputs !== 0 
    ? (imbalance / totalInputs) * 100 
    : (expected !== 0 ? Infinity : 0);
  
  const withinTolerance = Math.abs(imbalancePercent) <= tolerancePercent;
  const anomalies: string[] = [];
  
  // Flag specific anomalies
  if (Math.abs(imbalancePercent) > 10) {
    anomalies.push(`[KRITISK] Obalans ${imbalancePercent.toFixed(1)}% överskrider 10%`);
  }
  if (totalInputs < 0 || totalOutputs < 0) {
    anomalies.push('[VARNING] Negativa flöden detekterade');
  }
  if (totalInputs === 0 && totalOutputs > 0) {
    anomalies.push('[VARNING] Utflöden utan inflöden');
  }
  
  // Check individual uncertainties
  const inputUncertainty = Math.sqrt(
    flow.inputs.reduce((acc, i) => acc + (i.uncertainty || 0) ** 2, 0)
  );
  const outputUncertainty = Math.sqrt(
    flow.outputs.reduce((acc, o) => acc + (o.uncertainty || 0) ** 2, 0)
  );
  const totalUncertainty = Math.sqrt(inputUncertainty ** 2 + outputUncertainty ** 2);
  
  if (Math.abs(imbalance) <= totalUncertainty) {
    // Imbalance is within uncertainty bounds - acceptable
  } else if (Math.abs(imbalance) > 2 * totalUncertainty) {
    anomalies.push('[VARNING] Obalans överskrider osäkerhetsintervallet');
  }
  
  return {
    isBalanced: withinTolerance,
    imbalance,
    imbalancePercent: Math.abs(imbalancePercent),
    withinTolerance,
    tolerance: tolerancePercent,
    explanation: withinTolerance
      ? `[OK] System i balans (obalans ${imbalancePercent.toFixed(2)}% inom tolerans ${tolerancePercent}%)`
      : `[!] Obalanserad: In=${totalInputs.toFixed(2)}, Ut+Δ=${expected.toFixed(2)}, ` +
        `differens=${imbalance.toFixed(2)} (${imbalancePercent.toFixed(1)}%)`,
    anomalies
  };
}

/**
 * Validate a budget/accounting identity
 */
export function validateBudgetIdentity(
  items: Array<{ label: string; value: number; expected: number; uncertainty?: number }>
): { isValid: boolean; violations: string[]; totalDeviation: number } {
  const violations: string[] = [];
  let totalDeviation = 0;
  
  for (const item of items) {
    const deviation = item.value - item.expected;
    const deviationPercent = item.expected !== 0 
      ? (deviation / item.expected) * 100 
      : (item.value !== 0 ? Infinity : 0);
    
    totalDeviation += Math.abs(deviation);
    
    // Check if deviation is significant
    const uncertainty = item.uncertainty || Math.abs(item.expected) * 0.01;
    if (Math.abs(deviation) > 2 * uncertainty) {
      violations.push(
        `[${item.label}] Avvikelse ${deviation.toFixed(2)} (${deviationPercent.toFixed(1)}%) ` +
        `överskrider 2σ (±${uncertainty.toFixed(2)})`
      );
    }
  }
  
  return {
    isValid: violations.length === 0,
    violations,
    totalDeviation
  };
}

// =============================================================================
// AGGREGATION PHYSICS VALIDATOR
// =============================================================================

export interface PhysicsValidation {
  /** Overall validity */
  isValid: boolean;
  /** Dimensional analysis results */
  dimensional: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  /** Error propagation results */
  uncertainty: UncertaintyValue;
  /** Conservation check results */
  conservation?: ConservationCheck;
  /** Human-readable summary */
  summary: string;
  /** Recommendation */
  recommendation: 'PROCEED' | 'CAUTION' | 'BLOCK';
}

/**
 * Complete physics validation for an aggregation
 */
export function validateAggregationPhysics(
  aggregation: {
    steps: Array<{
      operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'average' | 'sum';
      inputs: Array<{ value: number; uncertainty: number; unit: DimensionalUnit; sources: string[] }>;
      description: string;
    }>;
    conservationFlow?: FlowData;
  }
): PhysicsValidation {
  // 1. Dimensional analysis
  const dimensionalInputs = aggregation.steps.map(step => ({
    operation: step.operation,
    inputs: step.inputs.map(i => ({ value: i.value, unit: i.unit })),
    description: step.description
  }));
  const dimensional = validateAggregationChain(dimensionalInputs);
  
  // 2. Error propagation
  const uncertaintySteps = aggregation.steps.map(step => ({
    operation: step.operation === 'sum' ? 'add' as const : step.operation,
    inputs: step.inputs.map(i => createUncertaintyValue(i.value, i.uncertainty, i.sources))
  }));
  const uncertainty = uncertaintySteps.length > 0 
    ? calculateUncertaintyChain(uncertaintySteps)
    : createUncertaintyValue(0, 0);
  
  // 3. Conservation laws (if flow data provided)
  const conservation = aggregation.conservationFlow 
    ? checkConservation(aggregation.conservationFlow)
    : undefined;
  
  // Determine overall validity and recommendation
  const hasBlockingErrors = !dimensional.isValid || 
    (conservation && !conservation.isBalanced && conservation.imbalancePercent > 10);
  
  const hasCautions = dimensional.warnings.length > 0 ||
    uncertainty.relativeUncertainty > 0.2 ||
    (conservation && !conservation.withinTolerance);
  
  return {
    isValid: !hasBlockingErrors,
    dimensional,
    uncertainty,
    conservation,
    summary: generatePhysicsSummary(dimensional, uncertainty, conservation),
    recommendation: hasBlockingErrors ? 'BLOCK' : (hasCautions ? 'CAUTION' : 'PROCEED')
  };
}

function generatePhysicsSummary(
  dimensional: { isValid: boolean; errors: string[]; warnings: string[] },
  uncertainty: UncertaintyValue,
  conservation?: ConservationCheck
): string {
  const parts: string[] = [];
  
  if (!dimensional.isValid) {
    parts.push(`[DIMENSION] ${dimensional.errors.length} fel: ${dimensional.errors[0]}`);
  } else if (dimensional.warnings.length > 0) {
    parts.push(`[DIMENSION] ${dimensional.warnings.length} varningar`);
  } else {
    parts.push('[DIMENSION] OK');
  }
  
  parts.push(
    `[OSÄKERHET] ±${(uncertainty.relativeUncertainty * 100).toFixed(1)}% ` +
    `(${uncertainty.sources.length} källor)`
  );
  
  if (conservation) {
    if (conservation.isBalanced) {
      parts.push('[BEVARANDE] Balanserad');
    } else {
      parts.push(`[BEVARANDE] Obalans ${conservation.imbalancePercent.toFixed(1)}%`);
    }
  }
  
  return parts.join(' | ');
}

// =============================================================================
// EXPORTS
// =============================================================================

export const PhysicsLayer = {
  // Dimensional Analysis
  checkDimensionalCompatibility,
  validateAggregationChain,
  STANDARD_UNITS,
  
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
  validateAggregationPhysics
};
