/**
 * DIAGNOSTIC TROUBLE CODES (DTC) FOR CIVILIZATION
 * 
 * Neutral status descriptions - no moral judgment, only state observation.
 * Modeled after automotive OBD-II/OEM diagnostic systems.
 * 
 * Format: [Domain][Category][Specific][Severity]
 * Example: ECO-INF-001-W = Economy, Inflation, Code 001, Warning
 */

// =============================================================================
// DTC STRUCTURE
// =============================================================================

export type DTCDomain = 
  | 'ECO'   // Economy
  | 'ENE'   // Energy
  | 'HEA'   // Health
  | 'EDU'   // Education
  | 'LAB'   // Labour
  | 'MIG'   // Migration
  | 'INF'   // Infrastructure
  | 'SEC'   // Security
  | 'ENV'   // Environment
  | 'DEM'   // Demographics
  | 'SOC'   // Social
  | 'GOV';  // Governance

export type DTCSeverity = 
  | 'I'   // Information - deviation noted
  | 'W'   // Warning - threshold exceeded
  | 'C'   // Critical - immediate attention
  | 'S';  // Systemic - cross-domain impact

export type DTCStatus = 
  | 'active'      // Currently occurring
  | 'pending'     // Detected but not confirmed
  | 'historical'  // Previously active
  | 'cleared';    // Manually acknowledged

export interface DiagnosticCode {
  code: string;
  domain: DTCDomain;
  category: string;
  severity: DTCSeverity;
  status: DTCStatus;
  
  // Description
  title_sv: string;
  title_en: string;
  description_sv: string;
  description_en: string;
  
  // Technical details
  triggering_condition: string;
  threshold_value: number;
  observed_value: number;
  unit: string;
  
  // Timing
  first_detected: string;
  last_confirmed: string;
  occurrence_count: number;
  duration_hours: number;
  
  // Related data
  related_kpi_codes: string[];
  related_dtcs: string[];
  freeze_frame?: FreezeFrame;
  
  // Confidence
  confidence: number;
  data_sources: string[];
  triangulation_status: 'confirmed' | 'partial' | 'single_source';
}

export interface FreezeFrame {
  timestamp: string;
  snapshot: Record<string, {
    value: number;
    unit: string;
    percentile: number;
  }>;
  context: string;
}

// =============================================================================
// STANDARD DTC DEFINITIONS
// =============================================================================

export const DTC_DEFINITIONS: Record<string, Omit<DiagnosticCode, 'status' | 'observed_value' | 'first_detected' | 'last_confirmed' | 'occurrence_count' | 'duration_hours' | 'freeze_frame' | 'confidence' | 'data_sources' | 'triangulation_status'>> = {
  // ECONOMY
  'ECO-INF-001': {
    code: 'ECO-INF-001',
    domain: 'ECO',
    category: 'INFLATION',
    severity: 'W',
    title_sv: 'Inflationsavvikelse',
    title_en: 'Inflation Deviation',
    description_sv: 'Konsumentprisindex överstiger målintervall',
    description_en: 'Consumer price index exceeds target range',
    triggering_condition: 'CPI_YOY > TARGET + 1.0',
    threshold_value: 3.0,
    unit: '%',
    related_kpi_codes: ['CPI', 'PPI', 'CORE_INF'],
    related_dtcs: ['ECO-INT-001', 'ECO-WAG-001'],
  },
  
  'ECO-UNE-001': {
    code: 'ECO-UNE-001',
    domain: 'ECO',
    category: 'UNEMPLOYMENT',
    severity: 'W',
    title_sv: 'Strukturell arbetslöshet',
    title_en: 'Structural Unemployment',
    description_sv: 'Arbetslöshet kvarstår trots ekonomisk tillväxt',
    description_en: 'Unemployment persists despite economic growth',
    triggering_condition: 'UNEMPLOYMENT > 5% AND GDP_GROWTH > 2%',
    threshold_value: 5.0,
    unit: '%',
    related_kpi_codes: ['UNEMPLOYMENT', 'GDP_GROWTH', 'LABOR_PARTICIPATION'],
    related_dtcs: ['LAB-MIS-001', 'EDU-MIS-001'],
  },
  
  'ECO-EFF-001': {
    code: 'ECO-EFF-001',
    domain: 'ECO',
    category: 'EFFICIENCY',
    severity: 'I',
    title_sv: 'Resursineffektivitet',
    title_en: 'Resource Inefficiency',
    description_sv: 'Resursinsats överstiger jämförbara regioners utfall',
    description_en: 'Resource input exceeds comparable regions\' outcomes',
    triggering_condition: 'COST_PER_OUTCOME > PEER_MEDIAN * 1.3',
    threshold_value: 130,
    unit: '% av peer-median',
    related_kpi_codes: ['PUBLIC_SPEND', 'OUTCOME_INDEX'],
    related_dtcs: ['GOV-EFF-001'],
  },
  
  // HEALTH
  'HEA-MOR-001': {
    code: 'HEA-MOR-001',
    domain: 'HEA',
    category: 'MORTALITY',
    severity: 'C',
    title_sv: 'Överdödlighet detekterad',
    title_en: 'Excess Mortality Detected',
    description_sv: 'Observerad mortalitet överstiger förväntat intervall',
    description_en: 'Observed mortality exceeds expected range',
    triggering_condition: 'OBSERVED_DEATHS > EXPECTED_UPPER_CI',
    threshold_value: 105,
    unit: '% av förväntat',
    related_kpi_codes: ['MORTALITY_RATE', 'LIFE_EXPECTANCY'],
    related_dtcs: ['HEA-CAP-001', 'HEA-ACC-001'],
  },
  
  'HEA-MEN-001': {
    code: 'HEA-MEN-001',
    domain: 'HEA',
    category: 'MENTAL',
    severity: 'W',
    title_sv: 'Psykisk ohälsa över tröskelvärde',
    title_en: 'Mental Health Above Threshold',
    description_sv: 'Prevalens av diagnostiserad psykisk ohälsa överstiger baseline',
    description_en: 'Prevalence of diagnosed mental health conditions exceeds baseline',
    triggering_condition: 'MENTAL_HEALTH_PREVALENCE > BASELINE * 1.2',
    threshold_value: 120,
    unit: '% av baseline',
    related_kpi_codes: ['DEPRESSION_RATE', 'ANXIETY_RATE', 'SUICIDE_RATE'],
    related_dtcs: ['SOC-ISO-001', 'LAB-STR-001'],
  },
  
  'HEA-SUB-001': {
    code: 'HEA-SUB-001',
    domain: 'HEA',
    category: 'SUBSTANCE',
    severity: 'W',
    title_sv: 'Substansanvändning förhöjd',
    title_en: 'Substance Use Elevated',
    description_sv: 'Indikatorer för substansanvändning överskrider varningsnivå',
    description_en: 'Substance use indicators exceed warning level',
    triggering_condition: 'SUBSTANCE_INDEX > WARNING_THRESHOLD',
    threshold_value: 115,
    unit: 'index (100 = baseline)',
    related_kpi_codes: ['DRUG_MORTALITY', 'ALCOHOL_CONSUMPTION', 'OPIOID_PRESCRIPTIONS'],
    related_dtcs: ['HEA-MEN-001', 'ECO-UNE-001'],
  },
  
  // SOCIAL
  'SOC-TRU-001': {
    code: 'SOC-TRU-001',
    domain: 'SOC',
    category: 'TRUST',
    severity: 'W',
    title_sv: 'Social tillit under tröskelvärde',
    title_en: 'Social Trust Below Threshold',
    description_sv: 'Mätningar av institutionellt förtroende under kritisk nivå',
    description_en: 'Institutional trust measurements below critical level',
    triggering_condition: 'TRUST_INDEX < 50',
    threshold_value: 50,
    unit: 'index (0-100)',
    related_kpi_codes: ['GOVT_TRUST', 'MEDIA_TRUST', 'INTERPERSONAL_TRUST'],
    related_dtcs: ['GOV-LEG-001', 'SOC-POL-001'],
  },
  
  'SOC-ISO-001': {
    code: 'SOC-ISO-001',
    domain: 'SOC',
    category: 'ISOLATION',
    severity: 'I',
    title_sv: 'Social isolering förhöjd',
    title_en: 'Social Isolation Elevated',
    description_sv: 'Andel ensamboende och social kontaktfrekvens avviker',
    description_en: 'Single-person households and social contact frequency deviating',
    triggering_condition: 'ISOLATION_INDEX > PEER_MEDIAN * 1.15',
    threshold_value: 115,
    unit: '% av peer-median',
    related_kpi_codes: ['SINGLE_HOUSEHOLDS', 'SOCIAL_CONTACT_FREQ', 'LONELINESS_SURVEY'],
    related_dtcs: ['HEA-MEN-001', 'DEM-FAM-001'],
  },
  
  // DEMOGRAPHICS
  'DEM-FER-001': {
    code: 'DEM-FER-001',
    domain: 'DEM',
    category: 'FERTILITY',
    severity: 'S',
    title_sv: 'Fertilitet under ersättningsnivå',
    title_en: 'Fertility Below Replacement',
    description_sv: 'Total fertilitetstal under 2.1 i minst 5 år',
    description_en: 'Total fertility rate below 2.1 for at least 5 years',
    triggering_condition: 'TFR < 2.1 FOR 5+ YEARS',
    threshold_value: 2.1,
    unit: 'barn per kvinna',
    related_kpi_codes: ['TFR', 'BIRTH_RATE', 'MARRIAGE_RATE'],
    related_dtcs: ['ECO-HOU-001', 'SOC-ISO-001'],
  },
  
  'DEM-AGE-001': {
    code: 'DEM-AGE-001',
    domain: 'DEM',
    category: 'AGING',
    severity: 'S',
    title_sv: 'Demografisk obalans',
    title_en: 'Demographic Imbalance',
    description_sv: 'Försörjningskvot överstiger hållbarhetsnivå',
    description_en: 'Dependency ratio exceeds sustainability level',
    triggering_condition: 'DEPENDENCY_RATIO > 0.6',
    threshold_value: 60,
    unit: '%',
    related_kpi_codes: ['DEPENDENCY_RATIO', 'MEDIAN_AGE', 'WORKING_AGE_POP'],
    related_dtcs: ['ECO-TAX-001', 'HEA-CAP-001'],
  },
  
  // GOVERNANCE
  'GOV-EFF-001': {
    code: 'GOV-EFF-001',
    domain: 'GOV',
    category: 'EFFICIENCY',
    severity: 'I',
    title_sv: 'Administrativ friktion',
    title_en: 'Administrative Friction',
    description_sv: 'Administrativ kostnad per utfall överstiger jämförbara system',
    description_en: 'Administrative cost per outcome exceeds comparable systems',
    triggering_condition: 'ADMIN_COST_RATIO > PEER_P75',
    threshold_value: 125,
    unit: '% av peer P75',
    related_kpi_codes: ['ADMIN_SPEND', 'PUBLIC_SECTOR_SIZE', 'BUREAUCRACY_INDEX'],
    related_dtcs: ['ECO-EFF-001', 'GOV-DEL-001'],
  },
  
  'GOV-GAP-001': {
    code: 'GOV-GAP-001',
    domain: 'GOV',
    category: 'INTENTION_OUTCOME_GAP',
    severity: 'W',
    title_sv: 'Mål-utfall-diskrepans',
    title_en: 'Intention-Outcome Discrepancy',
    description_sv: 'Deklarerade mål och observerade utfall divergerar signifikant',
    description_en: 'Declared objectives and observed outcomes diverge significantly',
    triggering_condition: 'OUTCOME_DEVIATION > GOAL * 0.3',
    threshold_value: 30,
    unit: '% avvikelse',
    related_kpi_codes: ['POLICY_OUTCOME', 'DECLARED_TARGET'],
    related_dtcs: ['GOV-EFF-001'],
  },
  
  // SHADOW ECONOMY
  'ECO-SHA-001': {
    code: 'ECO-SHA-001',
    domain: 'ECO',
    category: 'SHADOW',
    severity: 'W',
    title_sv: 'Parallell ekonomi förhöjd',
    title_en: 'Parallel Economy Elevated',
    description_sv: 'Indikatorer för informell/svart ekonomi överstiger normal nivå',
    description_en: 'Informal/shadow economy indicators exceed normal level',
    triggering_condition: 'SHADOW_ECONOMY_INDEX > BASELINE * 1.2',
    threshold_value: 120,
    unit: '% av baseline',
    related_kpi_codes: ['CASH_RATIO', 'TAX_GAP', 'INFORMAL_EMPLOYMENT'],
    related_dtcs: ['ECO-UNE-001', 'SEC-CRI-001'],
  },
  
  // SYSTEMIC
  'SYS-FBK-001': {
    code: 'SYS-FBK-001',
    domain: 'GOV',
    category: 'FEEDBACK',
    severity: 'C',
    title_sv: 'Instabil feedback detekterad',
    title_en: 'Unstable Feedback Detected',
    description_sv: 'Åtgärder korrelerar med försämrat utfall',
    description_en: 'Interventions correlate with worsened outcomes',
    triggering_condition: 'INTERVENTION_OUTCOME_CORRELATION < -0.3',
    threshold_value: -0.3,
    unit: 'korrelation',
    related_kpi_codes: [],
    related_dtcs: [],
  },
  
  'SYS-DZN-001': {
    code: 'SYS-DZN-001',
    domain: 'GOV',
    category: 'DEAD_ZONE',
    severity: 'C',
    title_sv: 'Död zon identifierad',
    title_en: 'Dead Zone Identified',
    description_sv: 'System svarar inte på åtgärder under minst 3 år',
    description_en: 'System unresponsive to interventions for at least 3 years',
    triggering_condition: 'RESPONSE_ELASTICITY < 0.1 FOR 3+ YEARS',
    threshold_value: 0.1,
    unit: 'elasticitet',
    related_kpi_codes: [],
    related_dtcs: [],
  },
};

// =============================================================================
// DTC FUNCTIONS
// =============================================================================

/**
 * Generate a DTC from observed data
 */
export function generateDTC(
  definitionCode: string,
  observedValue: number,
  dataSources: string[],
  triangulationStatus: 'confirmed' | 'partial' | 'single_source'
): DiagnosticCode | null {
  const def = DTC_DEFINITIONS[definitionCode];
  if (!def) return null;
  
  // Determine if threshold is exceeded
  const isActive = observedValue > def.threshold_value;
  
  return {
    ...def,
    observed_value: observedValue,
    status: isActive ? 'active' : 'pending',
    first_detected: new Date().toISOString(),
    last_confirmed: new Date().toISOString(),
    occurrence_count: 1,
    duration_hours: 0,
    confidence: triangulationStatus === 'confirmed' ? 0.9 : 
                triangulationStatus === 'partial' ? 0.7 : 0.5,
    data_sources: dataSources,
    triangulation_status: triangulationStatus,
  };
}

/**
 * Get severity color (clinical, not moral)
 */
export function getSeverityColor(severity: DTCSeverity): string {
  switch (severity) {
    case 'I': return '#3b82f6';  // Blue - information
    case 'W': return '#f59e0b';  // Amber - warning
    case 'C': return '#dc2626';  // Red - critical
    case 'S': return '#7c3aed';  // Purple - systemic
    default: return '#6b7280';   // Gray
  }
}

/**
 * Get severity label
 */
export function getSeverityLabel(severity: DTCSeverity, language: 'sv' | 'en'): string {
  const labels: Record<DTCSeverity, { sv: string; en: string }> = {
    'I': { sv: 'Information', en: 'Information' },
    'W': { sv: 'Varning', en: 'Warning' },
    'C': { sv: 'Kritisk', en: 'Critical' },
    'S': { sv: 'Systemisk', en: 'Systemic' },
  };
  return labels[severity][language];
}

/**
 * Get domain label
 */
export function getDomainLabel(domain: DTCDomain, language: 'sv' | 'en'): string {
  const labels: Record<DTCDomain, { sv: string; en: string }> = {
    'ECO': { sv: 'Ekonomi', en: 'Economy' },
    'ENE': { sv: 'Energi', en: 'Energy' },
    'HEA': { sv: 'Hälsa', en: 'Health' },
    'EDU': { sv: 'Utbildning', en: 'Education' },
    'LAB': { sv: 'Arbetsmarknad', en: 'Labour' },
    'MIG': { sv: 'Migration', en: 'Migration' },
    'INF': { sv: 'Infrastruktur', en: 'Infrastructure' },
    'SEC': { sv: 'Säkerhet', en: 'Security' },
    'ENV': { sv: 'Miljö', en: 'Environment' },
    'DEM': { sv: 'Demografi', en: 'Demographics' },
    'SOC': { sv: 'Socialt', en: 'Social' },
    'GOV': { sv: 'Styrning', en: 'Governance' },
  };
  return labels[domain][language];
}

/**
 * Format DTC code for display
 */
export function formatDTCCode(code: string): string {
  return code.replace(/-/g, '·');
}
