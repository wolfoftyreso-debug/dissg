/**
 * Predefined Societal Fault Codes
 * 
 * Konkreta felkoder för vanliga samhällsavvikelser.
 */

import type { FaultCode } from './structure';
import { buildFaultCode } from './structure';

// =============================================================================
// ECONOMY FAULT CODES (ECO)
// =============================================================================

export const ECO_FAULT_CODES: Partial<FaultCode>[] = [
  {
    code: 'ECO-FIS-STR-301',
    technicalDescription: 'Observerad avvikelse i offentlig skuld relativt BNP över definierad toleransnivå.',
    affectedMeasureBlocks: ['ECO-FIS-DEBT', 'ECO-FIS-GDP'],
    linkedFaultCodes: ['ECO-MON-TRE-102', 'ECO-FIS-RES-305'],
  },
  {
    code: 'ECO-INE-TRE-145',
    technicalDescription: 'Ökande inkomstojämlikhet över tid, mätt som Gini-koefficient.',
    affectedMeasureBlocks: ['ECO-INE-GINI', 'ECO-INE-DECILE'],
    linkedFaultCodes: ['SOC-POV-TRE-201', 'SOC-COH-SYS-401'],
  },
  {
    code: 'ECO-PRO-TRE-156',
    technicalDescription: 'Stagnerande eller negativ produktivitetstillväxt över 5+ år.',
    affectedMeasureBlocks: ['ECO-PRO-LABOR', 'ECO-PRO-TFP'],
    linkedFaultCodes: ['EDU-QUA-TRE-112', 'LAB-SKI-SYS-310'],
  },
];

// =============================================================================
// SOCIAL FAULT CODES (SOC)
// =============================================================================

export const SOC_FAULT_CODES: Partial<FaultCode>[] = [
  {
    code: 'SOC-HOU-STR-021',
    technicalDescription: 'Strukturellt bostadsproblem: bostadsbestånd understiger befolkningstillväxt.',
    affectedMeasureBlocks: ['SOC-HOU-SUPPLY', 'SOC-HOU-DEMAND', 'DEM-POP-GROWTH'],
    linkedFaultCodes: ['SOC-POV-RES-205', 'DEM-URB-TRE-115'],
  },
  {
    code: 'SOC-TRU-TRE-188',
    technicalDescription: 'Långsiktig nedgång i institutionell tillit över 10+ år.',
    affectedMeasureBlocks: ['SOC-TRU-INST', 'SOC-TRU-INTERP'],
    linkedFaultCodes: ['GOV-TRA-TRE-201', 'GOV-COR-STR-305'],
  },
  {
    code: 'SOC-CRI-TRE-245',
    technicalDescription: 'Ökande våldsbrottslighet per capita.',
    affectedMeasureBlocks: ['SOC-CRI-VIOLENT', 'SEC-VIO-RATE'],
    linkedFaultCodes: ['SOC-POV-SYS-401', 'LAB-UNE-TRE-156'],
  },
];

// =============================================================================
// HEALTH FAULT CODES (HEA)
// =============================================================================

export const HEA_FAULT_CODES: Partial<FaultCode>[] = [
  {
    code: 'HEA-SUB-SYS-402',
    technicalDescription: 'Systemiskt missbruksproblem: opioidrelaterade dödsfall överstiger historiskt normalintervall.',
    affectedMeasureBlocks: ['HEA-SUB-OPIOID', 'HEA-MOR-OVERDOSE'],
    linkedFaultCodes: ['HEA-MEN-TRE-201', 'SOC-POV-SYS-312'],
  },
  {
    code: 'HEA-MOR-TRE-003',
    technicalDescription: 'Negativ trend i förväntad livslängd över 3+ år.',
    affectedMeasureBlocks: ['HEA-LIF-EXPECT', 'HEA-MOR-ALL'],
    linkedFaultCodes: ['HEA-DIS-TRE-156', 'HEA-ACC-STR-201'],
  },
  {
    code: 'HEA-MEN-TRE-178',
    technicalDescription: 'Ökande psykisk ohälsa i arbetsför ålder.',
    affectedMeasureBlocks: ['HEA-MEN-PREV', 'HEA-MEN-SICK'],
    linkedFaultCodes: ['LAB-CON-TRE-145', 'SOC-COH-SYS-301'],
  },
];

// =============================================================================
// DEMOGRAPHY FAULT CODES (DEM)
// =============================================================================

export const DEM_FAULT_CODES: Partial<FaultCode>[] = [
  {
    code: 'DEM-AGE-SYS-701',
    technicalDescription: 'Systemisk åldersstrukturförändring: försörjningskvot överstiger kritisk nivå.',
    affectedMeasureBlocks: ['DEM-AGE-RATIO', 'DEM-DEP-OLD'],
    linkedFaultCodes: ['ECO-FIS-SYS-710', 'HEA-ACC-RES-320'],
  },
  {
    code: 'DEM-FER-TRE-156',
    technicalDescription: 'Fertilitet under ersättningsnivå (2.1) i 20+ år.',
    affectedMeasureBlocks: ['DEM-FER-RATE', 'DEM-POP-PROJ'],
    linkedFaultCodes: ['DEM-AGE-SYS-701', 'LAB-PAR-TRE-201'],
  },
];

// =============================================================================
// ENERGY FAULT CODES (ENE)
// =============================================================================

export const ENE_FAULT_CODES: Partial<FaultCode>[] = [
  {
    code: 'ENE-SEC-RES-314',
    technicalDescription: 'Energiimportberoende överstiger kritisk nivå (>70%).',
    affectedMeasureBlocks: ['ENE-SEC-IMPORT', 'ENE-SUP-DOM'],
    linkedFaultCodes: ['ECO-TRD-RES-245', 'SEC-DIS-SYS-401'],
  },
  {
    code: 'ENE-PRI-VAR-088',
    technicalDescription: 'Onormal prisvolatilitet i energimarknaden.',
    affectedMeasureBlocks: ['ENE-PRI-ELEC', 'ENE-PRI-GAS'],
    linkedFaultCodes: ['ECO-MON-VAR-156', 'SOC-POV-RES-212'],
  },
];

// =============================================================================
// ENVIRONMENT FAULT CODES (ENV)
// =============================================================================

export const ENV_FAULT_CODES: Partial<FaultCode>[] = [
  {
    code: 'ENV-EMI-TRE-312',
    technicalDescription: 'CO2-utsläpp per capita avviker uppåt från Paris-kompatibel bana.',
    affectedMeasureBlocks: ['ENV-EMI-CO2', 'ENV-EMI-TARGET'],
    linkedFaultCodes: ['ENE-MIX-TRE-201', 'ECO-PRO-RES-145'],
  },
  {
    code: 'ENV-BIO-SYS-756',
    technicalDescription: 'Systemisk nedgång i biologisk mångfald: artindex under kritisk nivå.',
    affectedMeasureBlocks: ['ENV-BIO-INDEX', 'ENV-LAN-USE'],
    linkedFaultCodes: ['ENV-LAN-TRE-301', 'ENV-WAT-STR-212'],
  },
];

// =============================================================================
// GOVERNANCE FAULT CODES (GOV)
// =============================================================================

export const GOV_FAULT_CODES: Partial<FaultCode>[] = [
  {
    code: 'GOV-COR-STR-305',
    technicalDescription: 'Korruptionsindex understiger OECD-median.',
    affectedMeasureBlocks: ['GOV-COR-CPI', 'GOV-TRA-INDEX'],
    linkedFaultCodes: ['SOC-TRU-TRE-188', 'ECO-CAP-SYS-401'],
  },
  {
    code: 'GOV-EFF-TRE-201',
    technicalDescription: 'Sjunkande förvaltningseffektivitet mätt som tjänsteleverans per kostnad.',
    affectedMeasureBlocks: ['GOV-EFF-INDEX', 'ECO-FIS-SPEND'],
    linkedFaultCodes: ['ECO-FIS-RES-312', 'SOC-TRU-TRE-188'],
  },
];

// =============================================================================
// AGGREGATED EXPORT
// =============================================================================

export const ALL_PREDEFINED_FAULT_CODES = [
  ...ECO_FAULT_CODES,
  ...SOC_FAULT_CODES,
  ...HEA_FAULT_CODES,
  ...DEM_FAULT_CODES,
  ...ENE_FAULT_CODES,
  ...ENV_FAULT_CODES,
  ...GOV_FAULT_CODES,
];

export function getFaultCodesByDomain(domain: string): Partial<FaultCode>[] {
  switch (domain) {
    case 'ECO': return ECO_FAULT_CODES;
    case 'SOC': return SOC_FAULT_CODES;
    case 'HEA': return HEA_FAULT_CODES;
    case 'DEM': return DEM_FAULT_CODES;
    case 'ENE': return ENE_FAULT_CODES;
    case 'ENV': return ENV_FAULT_CODES;
    case 'GOV': return GOV_FAULT_CODES;
    default: return [];
  }
}
