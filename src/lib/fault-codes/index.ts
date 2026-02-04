/**
 * Fault Codes Index
 * 
 * OEM-class fault code system for societal diagnostics.
 */

// Taxonomy
export {
  type FaultDomain,
  type DeviationType,
  type FaultSeverity,
  type ParsedFaultCode,
  FAULT_DOMAINS,
  DOMAIN_SUBSYSTEMS,
  DEVIATION_TYPES,
  SEVERITY_CONFIG,
  getSeverityFromNumber,
  parseFaultCode,
  formatFaultCode,
  validateFaultCode,
} from './taxonomy';

// Structure
export {
  type FaultCode,
  type FaultTrigger,
  type FaultThreshold,
  type ProbableCause,
  type HistoricalCase,
  type DataLimitation,
  type FaultCodeBuilder,
  type FaultCodeValidation,
  type FaultCodeRegistry,
  buildFaultCode,
  validateFaultCodeStructure,
  createFaultCodeRegistry,
  registerFaultCode,
  activateFaultCode,
  deactivateFaultCode,
} from './structure';

// System Diagnostics
export {
  SYSTEM_SUBSYSTEMS,
  SYSTEM_DIAGNOSTIC_CODES,
  type SystemDiagnosticCode,
  type SystemDiagnosticResult,
  type ParameterDiagnosticInput,
  evaluateSystemDiagnostics,
  getSystemDiagnosticCode,
  getSystemDiagnosticsByAction,
} from './system-diagnostics';

// Generator
export {
  type ParameterDefinition,
  type DetectedDeviation,
  type GeneratedFaultCode,
  type FaultCodeGenerationReport,
  detectDeviations,
  generateFaultCode,
  generateFaultCodesFromParameters,
  resetFaultCodeCounter,
} from './generator';

// Predefined Codes
export {
  ECO_FAULT_CODES,
  SOC_FAULT_CODES,
  HEA_FAULT_CODES,
  DEM_FAULT_CODES,
  ENE_FAULT_CODES,
  ENV_FAULT_CODES,
  GOV_FAULT_CODES,
  ALL_PREDEFINED_FAULT_CODES,
  getFaultCodesByDomain,
} from './predefined-codes';
