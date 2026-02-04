/**
 * System Self-Diagnosis Codes
 * 
 * Felkoder för när systemet identifierar brister i sig självt.
 * Systemet ska hellre fälla sig självt än visa osäker analys.
 */

import { formatFaultCode, type FaultSeverity } from './taxonomy';
import type { FaultCode, DataLimitation } from './structure';

// =============================================================================
// SYSTEM DOMAIN (SYS)
// =============================================================================

export const SYSTEM_SUBSYSTEMS = {
  DAT: { name: 'Datakvalitet', description: 'Datatäckning och kvalitet' },
  MOD: { name: 'Modell', description: 'Modellvaliditet och osäkerhet' },
  INT: { name: 'Integritet', description: 'Intern konsistens' },
  VAL: { name: 'Validering', description: 'Valideringsfel' },
  SRC: { name: 'Källor', description: 'Källproblem' },
  CAL: { name: 'Kalibrering', description: 'Kalibreringsbrister' },
};

// =============================================================================
// PREDEFINED SYSTEM FAULT CODES
// =============================================================================

export interface SystemDiagnosticCode {
  code: string;
  name: string;
  description: string;
  severity: FaultSeverity;
  triggerCondition: string;
  automaticAction: 'lock_parameter' | 'lock_page' | 'show_warning' | 'block_lambda';
}

export const SYSTEM_DIAGNOSTIC_CODES: SystemDiagnosticCode[] = [
  // 900-series: Unknown / Insufficient Data
  {
    code: 'SYS-DAT-COV-901',
    name: 'Otillräcklig datatäckning',
    description: 'Datatäckningen understiger minimum för tillförlitlig analys.',
    severity: 'unknown',
    triggerCondition: 'coverage_percent < 70',
    automaticAction: 'block_lambda',
  },
  {
    code: 'SYS-DAT-GAP-902',
    name: 'Tidslucka i data',
    description: 'Det finns en lucka på >12 månader i tidsserien.',
    severity: 'unknown',
    triggerCondition: 'max_gap_months > 12',
    automaticAction: 'show_warning',
  },
  {
    code: 'SYS-DAT-OLD-903',
    name: 'Föråldrad data',
    description: 'Senaste datapunkt är äldre än 24 månader.',
    severity: 'unknown',
    triggerCondition: 'months_since_update > 24',
    automaticAction: 'show_warning',
  },
  
  // Model uncertainty
  {
    code: 'SYS-MOD-UNC-911',
    name: 'Modell osäkerhet',
    description: 'Modellens osäkerhetsintervall är för brett för tillförlitligt resultat.',
    severity: 'unknown',
    triggerCondition: 'uncertainty_range > 0.30',
    automaticAction: 'show_warning',
  },
  {
    code: 'SYS-MOD-DIV-912',
    name: 'Modelldivergens',
    description: 'Olika beräkningsmetoder ger inkonsistenta resultat.',
    severity: 'unknown',
    triggerCondition: 'method_divergence > 0.15',
    automaticAction: 'lock_parameter',
  },
  
  // Internal consistency
  {
    code: 'SYS-INT-CON-921',
    name: 'Intern inkonsistens',
    description: 'Interna data är motsägelsefulla.',
    severity: 'unknown',
    triggerCondition: 'consistency_check_failed',
    automaticAction: 'lock_parameter',
  },
  {
    code: 'SYS-INT-CIR-922',
    name: 'Cirkulär referens',
    description: 'Beräkningen innehåller cirkulära beroenden.',
    severity: 'unknown',
    triggerCondition: 'circular_dependency_detected',
    automaticAction: 'lock_parameter',
  },
  
  // Validation
  {
    code: 'SYS-VAL-SET-931',
    name: 'Börvärde saknas',
    description: 'Parametern saknar definierat börvärde.',
    severity: 'unknown',
    triggerCondition: 'setpoint === null',
    automaticAction: 'lock_parameter',
  },
  {
    code: 'SYS-VAL-TOL-932',
    name: 'Tolerans saknas',
    description: 'Parametern saknar definierat toleransintervall.',
    severity: 'unknown',
    triggerCondition: 'tolerance === null',
    automaticAction: 'lock_parameter',
  },
  {
    code: 'SYS-VAL-MET-933',
    name: 'Metod saknas',
    description: 'Parametern saknar dokumenterad beräkningsmetod.',
    severity: 'unknown',
    triggerCondition: 'methodology === null',
    automaticAction: 'show_warning',
  },
  
  // Source issues
  {
    code: 'SYS-SRC-UNV-941',
    name: 'Overifierad källa',
    description: 'Datakällan är inte verifierad.',
    severity: 'unknown',
    triggerCondition: 'source_verified === false',
    automaticAction: 'lock_parameter',
  },
  {
    code: 'SYS-SRC-CON-942',
    name: 'Motstridiga källor',
    description: 'Olika källor rapporterar motstridiga värden.',
    severity: 'unknown',
    triggerCondition: 'source_divergence > 0.10',
    automaticAction: 'show_warning',
  },
  
  // Calibration
  {
    code: 'SYS-CAL-MIS-951',
    name: 'Saknad kalibrering',
    description: 'Parametern har inte kalibrerats mot verifierade referensvärden.',
    severity: 'unknown',
    triggerCondition: 'calibration_status === "missing"',
    automaticAction: 'lock_parameter',
  },
  {
    code: 'SYS-CAL-OUT-952',
    name: 'Föråldrad kalibrering',
    description: 'Kalibreringen är äldre än 36 månader.',
    severity: 'unknown',
    triggerCondition: 'months_since_calibration > 36',
    automaticAction: 'show_warning',
  },
];

// =============================================================================
// SYSTEM DIAGNOSTIC EVALUATOR
// =============================================================================

export interface SystemDiagnosticResult {
  triggered: SystemDiagnosticCode[];
  blocked: string[];                     // Parameters that should be locked
  warnings: string[];                    // Warnings to display
  lambdaBlocked: boolean;
  summary: string;
}

export interface ParameterDiagnosticInput {
  parameterCode: string;
  
  // Coverage
  coveragePercent: number;
  maxGapMonths: number;
  monthsSinceUpdate: number;
  
  // Model
  uncertaintyRange: number;
  methodDivergence: number;
  
  // Validation
  hasSetpoint: boolean;
  hasTolerance: boolean;
  hasMethodology: boolean;
  
  // Source
  sourceVerified: boolean;
  sourceDivergence: number;
  
  // Calibration
  calibrationStatus: 'valid' | 'outdated' | 'missing';
  monthsSinceCalibration: number;
  
  // Integrity
  consistencyCheckPassed: boolean;
  hasCircularDependency: boolean;
}

export function evaluateSystemDiagnostics(
  inputs: ParameterDiagnosticInput[]
): SystemDiagnosticResult {
  const triggered: SystemDiagnosticCode[] = [];
  const blocked: string[] = [];
  const warnings: string[] = [];
  let lambdaBlocked = false;

  for (const input of inputs) {
    // Check each diagnostic code
    for (const diag of SYSTEM_DIAGNOSTIC_CODES) {
      let shouldTrigger = false;
      
      switch (diag.code) {
        case 'SYS-DAT-COV-901':
          shouldTrigger = input.coveragePercent < 70;
          break;
        case 'SYS-DAT-GAP-902':
          shouldTrigger = input.maxGapMonths > 12;
          break;
        case 'SYS-DAT-OLD-903':
          shouldTrigger = input.monthsSinceUpdate > 24;
          break;
        case 'SYS-MOD-UNC-911':
          shouldTrigger = input.uncertaintyRange > 0.30;
          break;
        case 'SYS-MOD-DIV-912':
          shouldTrigger = input.methodDivergence > 0.15;
          break;
        case 'SYS-INT-CON-921':
          shouldTrigger = !input.consistencyCheckPassed;
          break;
        case 'SYS-INT-CIR-922':
          shouldTrigger = input.hasCircularDependency;
          break;
        case 'SYS-VAL-SET-931':
          shouldTrigger = !input.hasSetpoint;
          break;
        case 'SYS-VAL-TOL-932':
          shouldTrigger = !input.hasTolerance;
          break;
        case 'SYS-VAL-MET-933':
          shouldTrigger = !input.hasMethodology;
          break;
        case 'SYS-SRC-UNV-941':
          shouldTrigger = !input.sourceVerified;
          break;
        case 'SYS-SRC-CON-942':
          shouldTrigger = input.sourceDivergence > 0.10;
          break;
        case 'SYS-CAL-MIS-951':
          shouldTrigger = input.calibrationStatus === 'missing';
          break;
        case 'SYS-CAL-OUT-952':
          shouldTrigger = input.monthsSinceCalibration > 36;
          break;
      }

      if (shouldTrigger) {
        if (!triggered.find(t => t.code === diag.code)) {
          triggered.push(diag);
        }
        
        switch (diag.automaticAction) {
          case 'lock_parameter':
            if (!blocked.includes(input.parameterCode)) {
              blocked.push(input.parameterCode);
            }
            break;
          case 'block_lambda':
            lambdaBlocked = true;
            break;
          case 'show_warning':
            warnings.push(`${input.parameterCode}: ${diag.name}`);
            break;
        }
      }
    }
  }

  const criticalCount = triggered.filter(t => 
    t.automaticAction === 'lock_parameter' || t.automaticAction === 'block_lambda'
  ).length;

  let summary: string;
  if (triggered.length === 0) {
    summary = 'Alla systemdiagnostiska kontroller passerade.';
  } else if (criticalCount === 0) {
    summary = `${triggered.length} varningar identifierade. Systemet operativt.`;
  } else {
    summary = `${criticalCount} kritiska problem. ${blocked.length} parametrar låsta.`;
    if (lambdaBlocked) {
      summary += ' Lambda-beräkning blockerad.';
    }
  }

  return {
    triggered,
    blocked,
    warnings,
    lambdaBlocked,
    summary,
  };
}

// =============================================================================
// EXPORT HELPERS
// =============================================================================

export function getSystemDiagnosticCode(code: string): SystemDiagnosticCode | undefined {
  return SYSTEM_DIAGNOSTIC_CODES.find(d => d.code === code);
}

export function getSystemDiagnosticsByAction(
  action: SystemDiagnosticCode['automaticAction']
): SystemDiagnosticCode[] {
  return SYSTEM_DIAGNOSTIC_CODES.filter(d => d.automaticAction === action);
}
