/**
 * OEM Diagnostic System - Core Index
 * 
 * VIDA/ODIS-class diagnostic infrastructure for societal data.
 */

// Classification
export {
  type ContentClassification,
  type ClassificationCriteria,
  type ClassifiedContent,
  type DiagnosticPlacement,
  type ClassificationReport,
  classifyContent,
  canUseInDiagnosis,
  canUseInLambda,
  canTriggerFaultCode,
  getClassificationColor,
  getClassificationLabel,
  generateClassificationReport,
} from './content-classifier';

// Structure
export {
  type DiagnosticSystem,
  type DiagnosticSubsystem,
  type SubsystemCategory,
  type MeasureBlock,
  type DiagnosticParameter,
  type ToleranceRange,
  type CriticalRange,
  type ParameterValidation,
  type PlacementResult,
  type StructureIntegrityReport,
  DIAGNOSTIC_SYSTEMS,
  SUBSYSTEM_DEFINITIONS,
  generateDiagnosticPath,
  parseDiagnosticPath,
  validateParameter,
  placeInStructure,
  checkStructureIntegrity,
} from './diagnostic-structure';

// Audit
export {
  type AuditSeverity,
  type AuditFinding,
  type AuditCategory,
  type SystemHealthReport,
  type SystemSelfDiagnosisCode,
  type LambdaEligibilityReport,
  runAudit,
  generateSystemHealthReport,
  auditLambdaEligibility,
} from './system-audit';

// Validation
export {
  type ValidationLevel,
  type OEMRequirements,
  type PageValidationResult,
  type PageValidationRules,
  type IndexValidationResult,
  type DataDisplayValidation,
  type DiagnosticFlowGate,
  type SpeculativeContentCheck,
  validatePage,
  validateIndex,
  validateDataDisplay,
  checkDiagnosticFlowGate,
  checkForSpeculativeContent,
} from './oem-validator';
