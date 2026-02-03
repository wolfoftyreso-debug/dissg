/**
 * OEM-Class Diagnostic Structure
 * 
 * Strikt hierarki: System → Subsystem → Mätblock → Parameter
 * Allt innehåll måste placeras i denna struktur.
 */

// =============================================================================
// STRUCTURE DEFINITIONS (LOCKED)
// =============================================================================

export interface DiagnosticSystem {
  code: string;
  name: string;
  description: string;
  level: 'global' | 'continental' | 'national' | 'regional' | 'local';
  subsystems: DiagnosticSubsystem[];
}

export interface DiagnosticSubsystem {
  code: string;
  name: string;
  systemCode: string;
  description: string;
  category: SubsystemCategory;
  measureBlocks: MeasureBlock[];
}

export type SubsystemCategory = 
  | 'health'       // Hälsa & livslängd
  | 'economy'      // Ekonomisk bärkraft
  | 'social'       // Social stabilitet
  | 'energy'       // Energi & resursbalans
  | 'environment'  // Ekologisk belastning
  | 'governance'   // Institutionell tillit
  | 'knowledge';   // Kunskap & kompetens

export interface MeasureBlock {
  code: string;
  name: string;
  subsystemCode: string;
  description: string;
  parameters: DiagnosticParameter[];
  updateFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  primarySource: string;
}

export interface DiagnosticParameter {
  code: string;
  name: string;
  measureBlockCode: string;
  unit: string;
  
  // Diagnostic requirements
  setpoint: number | null;
  tolerance: ToleranceRange | null;
  criticalRange: CriticalRange | null;
  
  // Data quality
  uncertainty: number | null;       // ±%
  dataSource: string;
  methodology: string | null;
  lastUpdated: string | null;
  
  // Diagnostic status
  isDiagnosticReady: boolean;
  lockReason: string | null;
}

export interface ToleranceRange {
  min: number;
  max: number;
  unit: string;
}

export interface CriticalRange {
  criticalLow: number | null;
  criticalHigh: number | null;
  unit: string;
}

// =============================================================================
// GLOBAL STRUCTURE DEFINITION
// =============================================================================

export const DIAGNOSTIC_SYSTEMS: DiagnosticSystem[] = [
  {
    code: 'GLOBAL',
    name: 'Globalt System',
    description: 'Civilisationens totala tillstånd',
    level: 'global',
    subsystems: [],
  },
];

export const SUBSYSTEM_DEFINITIONS: Record<SubsystemCategory, { name: string; icon: string; code: string }> = {
  health: { name: 'Hälsa & Livslängd', icon: '⚕️', code: 'HLT' },
  economy: { name: 'Ekonomisk Bärkraft', icon: '💰', code: 'ECO' },
  social: { name: 'Social Stabilitet', icon: '🧠', code: 'SOC' },
  energy: { name: 'Energi & Resursbalans', icon: '⚡', code: 'ENE' },
  environment: { name: 'Ekologisk Belastning', icon: '🌱', code: 'ENV' },
  governance: { name: 'Institutionell Tillit', icon: '🔐', code: 'GOV' },
  knowledge: { name: 'Kunskap & Kompetens', icon: '📚', code: 'KNW' },
};

// =============================================================================
// PATH GENERATION
// =============================================================================

export function generateDiagnosticPath(
  system: string,
  subsystem: string,
  measureBlock: string,
  parameter: string
): string {
  return `${system} → ${subsystem} → ${measureBlock} → ${parameter}`;
}

export function parseDiagnosticPath(path: string): {
  system: string;
  subsystem: string;
  measureBlock: string;
  parameter: string;
} | null {
  const parts = path.split(' → ');
  if (parts.length !== 4) return null;
  
  return {
    system: parts[0],
    subsystem: parts[1],
    measureBlock: parts[2],
    parameter: parts[3],
  };
}

// =============================================================================
// PARAMETER VALIDATION
// =============================================================================

export interface ParameterValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canUseInDiagnosis: boolean;
  canUseInLambda: boolean;
  canTriggerFaultCode: boolean;
}

export function validateParameter(param: DiagnosticParameter): ParameterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required for any use
  if (!param.dataSource) errors.push('Datakälla saknas');
  if (param.unit === '') errors.push('Enhet saknas');

  // Required for diagnosis
  if (param.setpoint === null) errors.push('Börvärde saknas');
  if (param.tolerance === null) errors.push('Toleransintervall saknas');
  if (param.methodology === null) warnings.push('Metod/definition saknas');

  // Required for Lambda
  if (param.uncertainty === null) warnings.push('Osäkerhetsmarginal saknas');
  if (param.criticalRange === null) warnings.push('Kritiskt intervall saknas');

  const canUseInDiagnosis = errors.length === 0 && 
    param.setpoint !== null && 
    param.tolerance !== null;

  const canUseInLambda = canUseInDiagnosis && 
    param.methodology !== null && 
    param.uncertainty !== null;

  const canTriggerFaultCode = canUseInDiagnosis && 
    param.criticalRange !== null;

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    canUseInDiagnosis,
    canUseInLambda,
    canTriggerFaultCode,
  };
}

// =============================================================================
// STRUCTURE PLACEMENT
// =============================================================================

export interface PlacementResult {
  success: boolean;
  path: string | null;
  error: string | null;
  suggestion?: string;
}

export function placeInStructure(
  systemCode: string,
  subsystemCategory: SubsystemCategory,
  measureBlockName: string,
  parameterName: string
): PlacementResult {
  const subsystemDef = SUBSYSTEM_DEFINITIONS[subsystemCategory];
  if (!subsystemDef) {
    return {
      success: false,
      path: null,
      error: `Okänd subsystem-kategori: ${subsystemCategory}`,
    };
  }

  const path = generateDiagnosticPath(
    systemCode,
    subsystemDef.name,
    measureBlockName,
    parameterName
  );

  return {
    success: true,
    path,
    error: null,
  };
}

// =============================================================================
// STRUCTURE INTEGRITY CHECK
// =============================================================================

export interface StructureIntegrityReport {
  totalSystems: number;
  totalSubsystems: number;
  totalMeasureBlocks: number;
  totalParameters: number;
  unplacedItems: string[];
  orphanedParameters: string[];
  missingSubsystems: SubsystemCategory[];
  structureComplete: boolean;
  generatedAt: string;
}

export function checkStructureIntegrity(
  systems: DiagnosticSystem[]
): StructureIntegrityReport {
  let totalSubsystems = 0;
  let totalMeasureBlocks = 0;
  let totalParameters = 0;
  const foundCategories = new Set<SubsystemCategory>();

  for (const system of systems) {
    for (const subsystem of system.subsystems) {
      totalSubsystems++;
      foundCategories.add(subsystem.category);
      
      for (const block of subsystem.measureBlocks) {
        totalMeasureBlocks++;
        totalParameters += block.parameters.length;
      }
    }
  }

  const allCategories = Object.keys(SUBSYSTEM_DEFINITIONS) as SubsystemCategory[];
  const missingSubsystems = allCategories.filter(c => !foundCategories.has(c));

  return {
    totalSystems: systems.length,
    totalSubsystems,
    totalMeasureBlocks,
    totalParameters,
    unplacedItems: [],
    orphanedParameters: [],
    missingSubsystems,
    structureComplete: missingSubsystems.length === 0,
    generatedAt: new Date().toISOString(),
  };
}
