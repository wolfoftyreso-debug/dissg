/**
 * AUTOMATED INGEST PIPELINE ENGINE
 * 
 * Scales to millions of datapoints without human bottlenecks.
 * "Endast konflikter kräver mänsklig översyn."
 */

import {
  IngestPipeline,
  IngestRun,
  AnomalyEntry,
  IngestError,
  PipelineType,
} from './types';

// ============================================
// PIPELINE STEP DEFINITIONS
// ============================================

export interface PipelineStep {
  name: string;
  execute: (data: unknown[], context: PipelineContext) => Promise<StepResult>;
}

export interface PipelineContext {
  pipelineId: string;
  runId: string;
  sourceCode: string;
  config: IngestPipeline['config'];
  schemaValidation: Record<string, unknown>;
  unitNormalization: Record<string, unknown>;
  timeAlignmentRules: Record<string, unknown>;
}

export interface StepResult {
  success: boolean;
  data: unknown[];
  errors: IngestError[];
  anomalies: AnomalyEntry[];
  metrics: {
    inputCount: number;
    outputCount: number;
    durationMs: number;
  };
}

// ============================================
// SCHEMA VALIDATION
// ============================================

export interface SchemaRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array';
  required: boolean;
  constraints?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: unknown[];
  };
}

export function validateSchema(
  record: Record<string, unknown>,
  rules: SchemaRule[],
  rowIndex: number
): IngestError[] {
  const errors: IngestError[] = [];
  
  for (const rule of rules) {
    const value = record[rule.field];
    
    // Required check
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        code: 'MISSING_REQUIRED_FIELD',
        message: `Required field '${rule.field}' is missing`,
        field: rule.field,
        row: rowIndex,
        severity: 'error',
      });
      continue;
    }
    
    if (value === undefined || value === null) continue;
    
    // Type check
    const actualType = getValueType(value);
    if (actualType !== rule.type) {
      errors.push({
        code: 'TYPE_MISMATCH',
        message: `Field '${rule.field}' expected ${rule.type}, got ${actualType}`,
        field: rule.field,
        row: rowIndex,
        severity: 'error',
      });
      continue;
    }
    
    // Constraint checks
    if (rule.constraints) {
      const constraintErrors = validateConstraints(value, rule, rowIndex);
      errors.push(...constraintErrors);
    }
  }
  
  return errors;
}

function getValueType(value: unknown): string {
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (typeof value === 'string' && !isNaN(Date.parse(value))) return 'date';
  return typeof value;
}

function validateConstraints(
  value: unknown,
  rule: SchemaRule,
  rowIndex: number
): IngestError[] {
  const errors: IngestError[] = [];
  const { constraints } = rule;
  
  if (!constraints) return errors;
  
  if (typeof value === 'number') {
    if (constraints.min !== undefined && value < constraints.min) {
      errors.push({
        code: 'CONSTRAINT_VIOLATION',
        message: `Field '${rule.field}' value ${value} below minimum ${constraints.min}`,
        field: rule.field,
        row: rowIndex,
        severity: 'warning',
      });
    }
    if (constraints.max !== undefined && value > constraints.max) {
      errors.push({
        code: 'CONSTRAINT_VIOLATION',
        message: `Field '${rule.field}' value ${value} above maximum ${constraints.max}`,
        field: rule.field,
        row: rowIndex,
        severity: 'warning',
      });
    }
  }
  
  if (typeof value === 'string' && constraints.pattern) {
    const regex = new RegExp(constraints.pattern);
    if (!regex.test(value)) {
      errors.push({
        code: 'PATTERN_MISMATCH',
        message: `Field '${rule.field}' does not match required pattern`,
        field: rule.field,
        row: rowIndex,
        severity: 'warning',
      });
    }
  }
  
  if (constraints.enum && !constraints.enum.includes(value)) {
    errors.push({
      code: 'ENUM_VIOLATION',
      message: `Field '${rule.field}' value not in allowed set`,
      field: rule.field,
      row: rowIndex,
      severity: 'error',
    });
  }
  
  return errors;
}

// ============================================
// UNIT NORMALIZATION
// ============================================

export interface UnitConversion {
  fromUnit: string;
  toUnit: string;
  factor: number;
  offset?: number;
}

export const STANDARD_CONVERSIONS: UnitConversion[] = [
  { fromUnit: 'km', toUnit: 'm', factor: 1000 },
  { fromUnit: 'mi', toUnit: 'km', factor: 1.60934 },
  { fromUnit: 'lb', toUnit: 'kg', factor: 0.453592 },
  { fromUnit: 'F', toUnit: 'C', factor: 5/9, offset: -32 },
  { fromUnit: 'billion', toUnit: 'unit', factor: 1e9 },
  { fromUnit: 'million', toUnit: 'unit', factor: 1e6 },
  { fromUnit: 'thousand', toUnit: 'unit', factor: 1e3 },
  { fromUnit: '%', toUnit: 'ratio', factor: 0.01 },
  { fromUnit: 'per_1000', toUnit: 'per_capita', factor: 0.001 },
  { fromUnit: 'per_100000', toUnit: 'per_capita', factor: 0.00001 },
];

export function normalizeUnit(
  value: number,
  fromUnit: string,
  toUnit: string
): number | null {
  if (fromUnit === toUnit) return value;
  
  const conversion = STANDARD_CONVERSIONS.find(
    c => c.fromUnit === fromUnit && c.toUnit === toUnit
  );
  
  if (!conversion) return null;
  
  if (conversion.offset !== undefined) {
    return (value + conversion.offset) * conversion.factor;
  }
  
  return value * conversion.factor;
}

// ============================================
// TIME ALIGNMENT
// ============================================

export type TimeGranularity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';

export interface TimeAlignmentConfig {
  sourceGranularity: TimeGranularity;
  targetGranularity: TimeGranularity;
  aggregationMethod: 'first' | 'last' | 'mean' | 'sum' | 'median';
  timezone: string;
}

export function alignTimepoint(
  date: Date,
  granularity: TimeGranularity
): Date {
  const aligned = new Date(date);
  
  switch (granularity) {
    case 'daily':
      aligned.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      const day = aligned.getDay();
      aligned.setDate(aligned.getDate() - day);
      aligned.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      aligned.setDate(1);
      aligned.setHours(0, 0, 0, 0);
      break;
    case 'quarterly':
      const quarter = Math.floor(aligned.getMonth() / 3);
      aligned.setMonth(quarter * 3);
      aligned.setDate(1);
      aligned.setHours(0, 0, 0, 0);
      break;
    case 'annual':
      aligned.setMonth(0);
      aligned.setDate(1);
      aligned.setHours(0, 0, 0, 0);
      break;
  }
  
  return aligned;
}

// ============================================
// ANOMALY DETECTION
// ============================================

export interface ExpectedRange {
  field: string;
  min?: number;
  max?: number;
  historicalMean?: number;
  historicalStdDev?: number;
  maxDeviationSigmas?: number;
}

export function detectAnomalies(
  record: Record<string, unknown>,
  ranges: ExpectedRange[],
  entityType: string,
  entityId: string
): AnomalyEntry[] {
  const anomalies: AnomalyEntry[] = [];
  
  for (const range of ranges) {
    const value = record[range.field];
    if (typeof value !== 'number') continue;
    
    let isAnomaly = false;
    let deviationPercent: number | undefined;
    
    // Static range check
    if (range.min !== undefined && value < range.min) {
      isAnomaly = true;
      deviationPercent = ((range.min - value) / range.min) * 100;
    }
    
    if (range.max !== undefined && value > range.max) {
      isAnomaly = true;
      deviationPercent = ((value - range.max) / range.max) * 100;
    }
    
    // Statistical deviation check
    if (!isAnomaly && range.historicalMean !== undefined && range.historicalStdDev !== undefined) {
      const maxSigmas = range.maxDeviationSigmas ?? 3;
      const deviation = Math.abs(value - range.historicalMean) / range.historicalStdDev;
      
      if (deviation > maxSigmas) {
        isAnomaly = true;
        deviationPercent = ((value - range.historicalMean) / range.historicalMean) * 100;
      }
    }
    
    if (isAnomaly) {
      anomalies.push({
        id: crypto.randomUUID(),
        entityType,
        entityId,
        fieldName: range.field,
        expectedRangeMin: range.min,
        expectedRangeMax: range.max,
        reportedValue: value,
        deviationPercent,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  return anomalies;
}

// ============================================
// PIPELINE EXECUTION
// ============================================

export interface PipelineResult {
  run: Partial<IngestRun>;
  trustImpact: number;
  requiresReview: boolean;
}

/**
 * Execute a full ingest pipeline
 */
export async function executePipeline(
  pipeline: IngestPipeline,
  rawData: unknown[],
  schemaRules: SchemaRule[],
  expectedRanges: ExpectedRange[]
): Promise<PipelineResult> {
  const startTime = Date.now();
  const runId = crypto.randomUUID();
  
  const allErrors: IngestError[] = [];
  const allAnomalies: AnomalyEntry[] = [];
  let validatedData: Record<string, unknown>[] = [];
  let recordsRejected = 0;
  
  // Step 1: Schema validation
  for (let i = 0; i < rawData.length; i++) {
    const record = rawData[i] as Record<string, unknown>;
    const errors = validateSchema(record, schemaRules, i);
    
    const fatalErrors = errors.filter(e => e.severity === 'error' || e.severity === 'fatal');
    
    if (fatalErrors.length > 0) {
      allErrors.push(...fatalErrors);
      recordsRejected++;
    } else {
      allErrors.push(...errors.filter(e => e.severity === 'warning'));
      validatedData.push(record);
    }
  }
  
  // Step 2: Anomaly detection
  for (const record of validatedData) {
    const anomalies = detectAnomalies(
      record,
      expectedRanges,
      'indicator_value',
      String(record['id'] || record['indicator_id'] || 'unknown')
    );
    allAnomalies.push(...anomalies);
  }
  
  // Step 3: Calculate trust impact
  const trustImpact = calculateTrustImpact(
    rawData.length,
    validatedData.length,
    allAnomalies.length
  );
  
  const completedAt = new Date().toISOString();
  const hasPendingAnomalies = allAnomalies.some(a => a.status === 'pending');
  
  return {
    run: {
      id: runId,
      pipelineId: pipeline.id,
      startedAt: new Date(startTime).toISOString(),
      completedAt,
      status: hasPendingAnomalies ? 'partial' : 'success',
      recordsFetched: rawData.length,
      recordsValidated: validatedData.length,
      recordsWritten: validatedData.length - allAnomalies.filter(a => a.status === 'pending').length,
      recordsRejected,
      anomaliesDetected: allAnomalies,
      anomaliesHeld: allAnomalies.filter(a => a.status === 'pending').length,
      errors: allErrors,
      trustImpact,
    },
    trustImpact,
    requiresReview: hasPendingAnomalies,
  };
}

function calculateTrustImpact(
  totalRecords: number,
  validRecords: number,
  anomalyCount: number
): number {
  if (totalRecords === 0) return 0;
  
  const validationRate = validRecords / totalRecords;
  const anomalyRate = anomalyCount / validRecords;
  
  // Positive impact for high validation rate
  let impact = (validationRate - 0.9) * 0.1;
  
  // Negative impact for anomalies
  impact -= anomalyRate * 0.05;
  
  // Clamp to reasonable range
  return Math.max(-0.1, Math.min(0.05, impact));
}

// ============================================
// PIPELINE TYPE HANDLERS
// ============================================

export const PIPELINE_HANDLERS: Record<PipelineType, {
  description: string;
  requiredConfig: string[];
  steps: string[];
}> = {
  api_pull: {
    description: 'Pull data from REST/GraphQL APIs (OECD, World Bank, WHO)',
    requiredConfig: ['endpoint', 'authentication'],
    steps: ['fetch', 'parse', 'validate', 'normalize', 'detect_anomalies', 'write'],
  },
  structured_file: {
    description: 'Process structured files (CSV, XLSX)',
    requiredConfig: ['filePattern'],
    steps: ['read_file', 'parse', 'validate', 'normalize', 'detect_anomalies', 'write'],
  },
  semi_structured: {
    description: 'Extract tables from documents (PDF → table via AI)',
    requiredConfig: ['extractionRules'],
    steps: ['read_document', 'extract_tables', 'validate', 'normalize', 'detect_anomalies', 'write'],
  },
  registry_sync: {
    description: 'Sync with public registries',
    requiredConfig: ['endpoint'],
    steps: ['fetch_registry', 'diff', 'validate', 'normalize', 'detect_anomalies', 'write'],
  },
};
