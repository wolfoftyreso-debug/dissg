/**
 * OEM-Class Fault Code Structure
 * 
 * Komplett felkodsstruktur med all obligatorisk metadata.
 */

import type { 
  FaultDomain, 
  DeviationType, 
  FaultSeverity,
  ParsedFaultCode 
} from './taxonomy';
import { parseFaultCode, formatFaultCode, getSeverityFromNumber } from './taxonomy';

// =============================================================================
// FAULT CODE STRUCTURE (OBLIGATORISK)
// =============================================================================

export interface FaultCode {
  // Identifiering
  code: string;                          // ECO-FIS-STR-342
  parsed: ParsedFaultCode;
  
  // A. Teknisk beskrivning (neutral, ingen tolkning)
  technicalDescription: string;
  
  // B. Triggerlogik
  trigger: FaultTrigger;
  
  // C. Påverkade mätblock (lista, inte text)
  affectedMeasureBlocks: string[];
  
  // D. Sannolika orsaker (rangordnade)
  probableCauses: ProbableCause[];
  
  // E. Kända historiska fall
  historicalCases: HistoricalCase[];
  
  // F. Databegränsningar (OBLIGATORISKT)
  dataLimitations: DataLimitation[];
  
  // Metadata
  createdAt: string;
  lastTriggeredAt: string | null;
  triggerCount: number;
  isActive: boolean;
  linkedFaultCodes: string[];            // En felkod kan aldrig vara ensam
}

// =============================================================================
// TRIGGER LOGIC
// =============================================================================

export interface FaultTrigger {
  // Exakt vilka mätblock
  measureBlockCodes: string[];
  
  // Vilka gränsvärden
  thresholds: FaultThreshold[];
  
  // Vilken tidsperiod
  evaluationPeriod: {
    type: 'rolling' | 'fixed';
    months: number;
    minimumDataPoints: number;
  };
  
  // Aktiveringsvillkor
  activationCondition: 'any' | 'all' | 'majority';
  
  // Persistenskrav (hur länge avvikelsen måste bestå)
  persistenceMonths: number;
}

export interface FaultThreshold {
  measureBlockCode: string;
  parameterCode: string;
  
  // Typ av tröskel
  type: 'absolute' | 'relative' | 'percentile' | 'zscore';
  
  // Värden
  warningThreshold: number | null;
  criticalThreshold: number | null;
  direction: 'above' | 'below' | 'deviation';
  
  // Referens
  referenceValue: number | null;
  referenceSource: 'historical_average' | 'peer_median' | 'scientific_target' | 'setpoint';
}

// =============================================================================
// PROBABLE CAUSES (RANGORDNADE)
// =============================================================================

export interface ProbableCause {
  rank: number;                          // 1 = mest sannolik
  description: string;
  
  // Evidens
  correlationStrength: number;           // 0-1
  timelag: number;                       // månader
  confidenceInterval: [number, number];  // t.ex. [0.25, 0.45]
  
  // Källor
  evidenceSources: string[];
  
  // Relaterade mätblock
  relatedMeasureBlocks: string[];
  
  // Osäkerhet
  uncertaintyNote: string | null;
}

// =============================================================================
// HISTORICAL CASES
// =============================================================================

export interface HistoricalCase {
  country: string;
  countryCode: string;
  period: {
    start: string;                       // YYYY-MM
    end: string;                         // YYYY-MM
  };
  
  // Vad hände
  observation: string;
  
  // Utfall
  outcome: 'resolved' | 'persisted' | 'escalated' | 'transformed';
  outcomeDescription: string;
  
  // Vad normaliserade värdet (om applicable)
  normalizationFactors: string[] | null;
  
  // Källor
  sources: string[];
}

// =============================================================================
// DATA LIMITATIONS (OBLIGATORISKT)
// =============================================================================

export interface DataLimitation {
  type: 'missing_data' | 'uncertainty' | 'methodology_change' | 'coverage_gap' | 'temporal_gap';
  description: string;
  impact: 'minor' | 'moderate' | 'significant';
  affectedParameters: string[];
}

// =============================================================================
// FAULT CODE BUILDER
// =============================================================================

export interface FaultCodeBuilder {
  domain: FaultDomain;
  subsystem: string;
  deviationType: DeviationType;
  number: number;
  technicalDescription: string;
  trigger: FaultTrigger;
  affectedMeasureBlocks: string[];
  probableCauses: ProbableCause[];
  historicalCases: HistoricalCase[];
  dataLimitations: DataLimitation[];
  linkedFaultCodes: string[];
}

export function buildFaultCode(builder: FaultCodeBuilder): FaultCode {
  const code = formatFaultCode(
    builder.domain,
    builder.subsystem,
    builder.deviationType,
    builder.number
  );
  
  const parsed = parseFaultCode(code);
  if (!parsed) {
    throw new Error(`Invalid fault code generated: ${code}`);
  }
  
  return {
    code,
    parsed,
    technicalDescription: builder.technicalDescription,
    trigger: builder.trigger,
    affectedMeasureBlocks: builder.affectedMeasureBlocks,
    probableCauses: builder.probableCauses,
    historicalCases: builder.historicalCases,
    dataLimitations: builder.dataLimitations,
    createdAt: new Date().toISOString(),
    lastTriggeredAt: null,
    triggerCount: 0,
    isActive: false,
    linkedFaultCodes: builder.linkedFaultCodes,
  };
}

// =============================================================================
// VALIDATION
// =============================================================================

export interface FaultCodeValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateFaultCodeStructure(fc: FaultCode): FaultCodeValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!fc.technicalDescription || fc.technicalDescription.length < 20) {
    errors.push('Teknisk beskrivning saknas eller är för kort');
  }
  
  if (!fc.trigger.measureBlockCodes.length) {
    errors.push('Inga mätblock definierade i triggerlogik');
  }
  
  if (!fc.trigger.thresholds.length) {
    errors.push('Inga tröskelvärden definierade');
  }
  
  if (!fc.affectedMeasureBlocks.length) {
    errors.push('Inga påverkade mätblock listade');
  }
  
  if (!fc.probableCauses.length) {
    warnings.push('Inga sannolika orsaker definierade');
  }
  
  // OBLIGATORISKT: Databegränsningar
  if (!fc.dataLimitations.length) {
    errors.push('Databegränsningar MÅSTE definieras');
  }
  
  // En felkod kan aldrig vara ensam
  if (!fc.linkedFaultCodes.length) {
    warnings.push('Felkod saknar koppling till andra felkoder');
  }
  
  // Validate probable causes ranking
  const ranks = fc.probableCauses.map(c => c.rank);
  if (ranks.length !== new Set(ranks).size) {
    errors.push('Sannolika orsaker har duplicerade ranker');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// FAULT CODE REGISTRY
// =============================================================================

export interface FaultCodeRegistry {
  codes: Map<string, FaultCode>;
  byDomain: Map<FaultDomain, FaultCode[]>;
  bySeverity: Map<FaultSeverity, FaultCode[]>;
  active: FaultCode[];
}

export function createFaultCodeRegistry(): FaultCodeRegistry {
  return {
    codes: new Map(),
    byDomain: new Map(),
    bySeverity: new Map(),
    active: [],
  };
}

export function registerFaultCode(registry: FaultCodeRegistry, fc: FaultCode): void {
  registry.codes.set(fc.code, fc);
  
  // Index by domain
  const domainCodes = registry.byDomain.get(fc.parsed.domain) || [];
  domainCodes.push(fc);
  registry.byDomain.set(fc.parsed.domain, domainCodes);
  
  // Index by severity
  const severityCodes = registry.bySeverity.get(fc.parsed.severity) || [];
  severityCodes.push(fc);
  registry.bySeverity.set(fc.parsed.severity, severityCodes);
  
  // Track active
  if (fc.isActive) {
    registry.active.push(fc);
  }
}

export function activateFaultCode(registry: FaultCodeRegistry, code: string): void {
  const fc = registry.codes.get(code);
  if (fc && !fc.isActive) {
    fc.isActive = true;
    fc.lastTriggeredAt = new Date().toISOString();
    fc.triggerCount++;
    registry.active.push(fc);
  }
}

export function deactivateFaultCode(registry: FaultCodeRegistry, code: string): void {
  const fc = registry.codes.get(code);
  if (fc && fc.isActive) {
    fc.isActive = false;
    registry.active = registry.active.filter(f => f.code !== code);
  }
}
