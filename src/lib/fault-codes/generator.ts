/**
 * Fault Code Generator Engine
 * 
 * Genererar potentiella felkoder baserat på parametrar.
 * Kör MASTERPROMPT: "Identifiera alla parametrar som kan avvika..."
 */

import type { FaultCode, FaultTrigger, ProbableCause, DataLimitation } from './structure';
import { buildFaultCode, validateFaultCodeStructure } from './structure';
import type { FaultDomain, DeviationType } from './taxonomy';
import { FAULT_DOMAINS, DOMAIN_SUBSYSTEMS, DEVIATION_TYPES } from './taxonomy';

// =============================================================================
// PARAMETER DEFINITION FOR GENERATION
// =============================================================================

export interface ParameterDefinition {
  code: string;
  name: string;
  domain: FaultDomain;
  subsystem: string;
  
  // Setpoint and tolerance
  setpoint: number | null;
  tolerance: { min: number; max: number } | null;
  criticalRange: { low: number | null; high: number | null } | null;
  
  // Current value
  currentValue: number | null;
  
  // Historical data
  historicalAverage: number | null;
  historicalStdDev: number | null;
  
  // Peer comparison
  peerMedian: number | null;
  
  // Data quality
  dataSource: string;
  hasVerifiedSource: boolean;
  dataAge: number;              // months since update
  coveragePercent: number;
}

// =============================================================================
// DEVIATION DETECTION
// =============================================================================

export interface DetectedDeviation {
  parameterCode: string;
  deviationType: DeviationType;
  magnitude: number;            // How far from normal (in std devs or %)
  direction: 'above' | 'below';
  description: string;
  confidence: number;           // 0-1
}

export function detectDeviations(param: ParameterDefinition): DetectedDeviation[] {
  const deviations: DetectedDeviation[] = [];
  
  if (param.currentValue === null) return deviations;
  
  // Check against setpoint/tolerance (STR - Structural)
  if (param.setpoint !== null && param.tolerance !== null) {
    if (param.currentValue < param.tolerance.min) {
      deviations.push({
        parameterCode: param.code,
        deviationType: 'STR',
        magnitude: (param.tolerance.min - param.currentValue) / Math.abs(param.setpoint),
        direction: 'below',
        description: `Värde ${param.currentValue} under tolerans ${param.tolerance.min}`,
        confidence: 0.9,
      });
    } else if (param.currentValue > param.tolerance.max) {
      deviations.push({
        parameterCode: param.code,
        deviationType: 'STR',
        magnitude: (param.currentValue - param.tolerance.max) / Math.abs(param.setpoint),
        direction: 'above',
        description: `Värde ${param.currentValue} över tolerans ${param.tolerance.max}`,
        confidence: 0.9,
      });
    }
  }
  
  // Check against historical average (TRE - Trend)
  if (param.historicalAverage !== null && param.historicalStdDev !== null) {
    const zScore = (param.currentValue - param.historicalAverage) / param.historicalStdDev;
    if (Math.abs(zScore) > 2) {
      deviations.push({
        parameterCode: param.code,
        deviationType: 'TRE',
        magnitude: Math.abs(zScore),
        direction: zScore > 0 ? 'above' : 'below',
        description: `Avviker ${Math.abs(zScore).toFixed(1)} stdavv från historiskt medel`,
        confidence: Math.min(0.95, 0.7 + Math.abs(zScore) * 0.05),
      });
    }
  }
  
  // Check against peer median (RES - Resource allocation relative to peers)
  if (param.peerMedian !== null) {
    const peerDeviation = (param.currentValue - param.peerMedian) / param.peerMedian;
    if (Math.abs(peerDeviation) > 0.3) {
      deviations.push({
        parameterCode: param.code,
        deviationType: 'RES',
        magnitude: Math.abs(peerDeviation),
        direction: peerDeviation > 0 ? 'above' : 'below',
        description: `Avviker ${(Math.abs(peerDeviation) * 100).toFixed(0)}% från peer-median`,
        confidence: 0.75,
      });
    }
  }
  
  // Check data quality (DAT)
  if (!param.hasVerifiedSource) {
    deviations.push({
      parameterCode: param.code,
      deviationType: 'DAT',
      magnitude: 1,
      direction: 'below',
      description: 'Källa ej verifierad',
      confidence: 1,
    });
  }
  
  if (param.coveragePercent < 70) {
    deviations.push({
      parameterCode: param.code,
      deviationType: 'DAT',
      magnitude: 1 - (param.coveragePercent / 100),
      direction: 'below',
      description: `Datatäckning endast ${param.coveragePercent}%`,
      confidence: 1,
    });
  }
  
  if (param.dataAge > 24) {
    deviations.push({
      parameterCode: param.code,
      deviationType: 'DAT',
      magnitude: param.dataAge / 24,
      direction: 'below',
      description: `Data ${param.dataAge} månader gammal`,
      confidence: 1,
    });
  }
  
  return deviations;
}

// =============================================================================
// FAULT CODE GENERATOR
// =============================================================================

export interface GeneratedFaultCode {
  faultCode: FaultCode;
  sourceDeviation: DetectedDeviation;
  isComplete: boolean;
  missingFields: string[];
}

let faultCodeCounter: Record<string, number> = {};

function getNextFaultCodeNumber(domain: FaultDomain, subsystem: string, type: DeviationType): number {
  const key = `${domain}-${subsystem}-${type}`;
  const current = faultCodeCounter[key] || 0;
  
  // Determine base number by type
  let baseNumber: number;
  switch (type) {
    case 'DAT': baseNumber = 900; break;  // Data issues are always "unknown"
    default: baseNumber = 300;            // Default to critical
  }
  
  const next = baseNumber + (current % 100);
  faultCodeCounter[key] = current + 1;
  return next;
}

export function generateFaultCode(
  param: ParameterDefinition,
  deviation: DetectedDeviation
): GeneratedFaultCode {
  const number = getNextFaultCodeNumber(
    param.domain,
    param.subsystem,
    deviation.deviationType
  );
  
  // Build trigger
  const trigger: FaultTrigger = {
    measureBlockCodes: [param.code],
    thresholds: [{
      measureBlockCode: param.code,
      parameterCode: param.code,
      type: deviation.deviationType === 'TRE' ? 'zscore' : 'absolute',
      warningThreshold: param.tolerance?.min ?? null,
      criticalThreshold: param.criticalRange?.low ?? null,
      direction: deviation.direction === 'above' ? 'above' : 'below',
      referenceValue: param.setpoint,
      referenceSource: 'setpoint',
    }],
    evaluationPeriod: {
      type: 'rolling',
      months: 12,
      minimumDataPoints: 6,
    },
    activationCondition: 'any',
    persistenceMonths: 3,
  };
  
  // Build probable causes (placeholder - would be populated from correlation analysis)
  const probableCauses: ProbableCause[] = [{
    rank: 1,
    description: 'Orsak under utredning',
    correlationStrength: 0,
    timelag: 0,
    confidenceInterval: [0, 0],
    evidenceSources: [],
    relatedMeasureBlocks: [],
    uncertaintyNote: 'Korrelationsanalys ej genomförd',
  }];
  
  // Build data limitations (MANDATORY)
  const dataLimitations: DataLimitation[] = [];
  
  if (!param.hasVerifiedSource) {
    dataLimitations.push({
      type: 'missing_data',
      description: 'Datakällan är inte verifierad',
      impact: 'significant',
      affectedParameters: [param.code],
    });
  }
  
  if (param.coveragePercent < 100) {
    dataLimitations.push({
      type: 'coverage_gap',
      description: `Datatäckning är ${param.coveragePercent}%`,
      impact: param.coveragePercent < 70 ? 'significant' : 'moderate',
      affectedParameters: [param.code],
    });
  }
  
  if (param.setpoint === null) {
    dataLimitations.push({
      type: 'missing_data',
      description: 'Börvärde saknas - parameter låst',
      impact: 'significant',
      affectedParameters: [param.code],
    });
  }
  
  // Build fault code
  const faultCode = buildFaultCode({
    domain: param.domain,
    subsystem: param.subsystem,
    deviationType: deviation.deviationType,
    number,
    technicalDescription: `Observerad avvikelse från historiskt och jämförbart normalintervall i ${param.name}. ${deviation.description}`,
    trigger,
    affectedMeasureBlocks: [param.code],
    probableCauses,
    historicalCases: [],
    dataLimitations,
    linkedFaultCodes: [],
  });
  
  // Validate
  const validation = validateFaultCodeStructure(faultCode);
  
  return {
    faultCode,
    sourceDeviation: deviation,
    isComplete: validation.isValid,
    missingFields: validation.errors,
  };
}

// =============================================================================
// BATCH GENERATION
// =============================================================================

export interface FaultCodeGenerationReport {
  parameters: number;
  deviationsDetected: number;
  faultCodesGenerated: number;
  completeCodesCount: number;
  incompleteCodesCount: number;
  dataQualityIssues: number;
  generatedCodes: GeneratedFaultCode[];
  lockedParameters: string[];           // Parameters locked due to missing setpoint
  generatedAt: string;
}

export function generateFaultCodesFromParameters(
  parameters: ParameterDefinition[]
): FaultCodeGenerationReport {
  const generatedCodes: GeneratedFaultCode[] = [];
  const lockedParameters: string[] = [];
  let deviationsDetected = 0;
  let dataQualityIssues = 0;
  
  for (const param of parameters) {
    // Check if parameter should be locked
    if (param.setpoint === null) {
      lockedParameters.push(param.code);
      // Generate DAT fault code for locked parameter
      const datDeviation: DetectedDeviation = {
        parameterCode: param.code,
        deviationType: 'DAT',
        magnitude: 1,
        direction: 'below',
        description: 'Börvärde saknas - parameter låst för diagnos',
        confidence: 1,
      };
      generatedCodes.push(generateFaultCode(param, datDeviation));
      dataQualityIssues++;
      continue;
    }
    
    const deviations = detectDeviations(param);
    deviationsDetected += deviations.length;
    
    for (const deviation of deviations) {
      if (deviation.deviationType === 'DAT') {
        dataQualityIssues++;
      }
      generatedCodes.push(generateFaultCode(param, deviation));
    }
  }
  
  return {
    parameters: parameters.length,
    deviationsDetected,
    faultCodesGenerated: generatedCodes.length,
    completeCodesCount: generatedCodes.filter(g => g.isComplete).length,
    incompleteCodesCount: generatedCodes.filter(g => !g.isComplete).length,
    dataQualityIssues,
    generatedCodes,
    lockedParameters,
    generatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// RESET (FOR TESTING)
// =============================================================================

export function resetFaultCodeCounter(): void {
  faultCodeCounter = {};
}
