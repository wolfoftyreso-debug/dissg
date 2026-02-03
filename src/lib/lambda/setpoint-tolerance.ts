/**
 * SETPOINT & TOLERANCE SYSTEM
 * 
 * Defines optimal ranges, acceptable tolerances, and deviation zones
 * for all societal indicators. Like automotive ECU calibration data.
 * 
 * Each indicator has:
 * - Setpoint (optimal target)
 * - Green zone (acceptable tolerance)
 * - Yellow zone (warning)
 * - Red zone (critical)
 * 
 * Setpoints are derived from:
 * - Historical baselines
 * - Peer comparisons
 * - Empirical stability thresholds
 */

// =============================================================================
// TYPES
// =============================================================================

export type ZoneStatus = 'optimal' | 'acceptable' | 'warning' | 'critical' | 'unknown';

export interface ToleranceBand {
  lower: number;
  upper: number;
}

export interface SetpointDefinition {
  code: string;
  name_sv: string;
  name_en: string;
  unit: string;
  
  // The setpoint (optimal value)
  setpoint: number;
  setpoint_type: 'target' | 'minimum' | 'maximum' | 'range';
  
  // Tolerance bands
  optimal_band: ToleranceBand;      // Green - no concern
  acceptable_band: ToleranceBand;   // Light blue - acceptable deviation
  warning_band: ToleranceBand;      // Yellow/amber - attention needed
  critical_band: ToleranceBand;     // Red - critical deviation
  
  // Direction preference
  direction: 'higher_better' | 'lower_better' | 'target_optimal';
  
  // How setpoint was determined
  derivation_method: SetpointDerivation;
  derivation_source: string;
  derivation_date: string;
  
  // Confidence in the setpoint
  setpoint_confidence: number; // 0-1
  
  // Notes
  methodology_note_sv: string;
  methodology_note_en: string;
}

export interface SetpointDerivation {
  method: 'historical_baseline' | 'peer_median' | 'empirical_threshold' | 'theoretical' | 'policy_target';
  baseline_period?: string;
  peer_group?: string;
  sample_size?: number;
}

export interface ZoneAssessment {
  indicator_code: string;
  current_value: number;
  zone: ZoneStatus;
  deviation_percent: number;
  deviation_absolute: number;
  band_description_sv: string;
  band_description_en: string;
}

// =============================================================================
// SETPOINT DATABASE
// =============================================================================

export const SETPOINT_DEFINITIONS: Record<string, SetpointDefinition> = {
  // === DEMOGRAPHICS ===
  'TFR': {
    code: 'TFR',
    name_sv: 'Total fertilitetstal',
    name_en: 'Total Fertility Rate',
    unit: 'barn per kvinna',
    setpoint: 2.1,
    setpoint_type: 'minimum',
    optimal_band: { lower: 2.0, upper: 2.4 },
    acceptable_band: { lower: 1.8, upper: 2.6 },
    warning_band: { lower: 1.5, upper: 3.0 },
    critical_band: { lower: 0, upper: 5.0 },
    direction: 'target_optimal',
    derivation_method: {
      method: 'theoretical',
      sample_size: 195,
    },
    derivation_source: 'UN Population Division replacement level definition',
    derivation_date: '2023-01-01',
    setpoint_confidence: 0.95,
    methodology_note_sv: 'Ersättningsnivå för befolkningsstabilitet utan migration. Baseras på mortalitetsstatistik.',
    methodology_note_en: 'Replacement level for population stability without migration. Based on mortality statistics.',
  },
  
  'DEPENDENCY_RATIO': {
    code: 'DEPENDENCY_RATIO',
    name_sv: 'Försörjningskvot',
    name_en: 'Dependency Ratio',
    unit: '%',
    setpoint: 50,
    setpoint_type: 'maximum',
    optimal_band: { lower: 35, upper: 50 },
    acceptable_band: { lower: 30, upper: 55 },
    warning_band: { lower: 25, upper: 65 },
    critical_band: { lower: 0, upper: 100 },
    direction: 'lower_better',
    derivation_method: {
      method: 'empirical_threshold',
      peer_group: 'OECD',
      sample_size: 38,
    },
    derivation_source: 'OECD historical stability analysis',
    derivation_date: '2023-06-01',
    setpoint_confidence: 0.8,
    methodology_note_sv: 'Kvot av icke-arbetande (0-14 + 65+) till arbetande (15-64). Nivåer över 60% korrelerar med ökad systemstress.',
    methodology_note_en: 'Ratio of non-working (0-14 + 65+) to working (15-64). Levels above 60% correlate with increased system stress.',
  },
  
  'MEDIAN_AGE': {
    code: 'MEDIAN_AGE',
    name_sv: 'Medianålder',
    name_en: 'Median Age',
    unit: 'år',
    setpoint: 38,
    setpoint_type: 'range',
    optimal_band: { lower: 32, upper: 40 },
    acceptable_band: { lower: 28, upper: 44 },
    warning_band: { lower: 24, upper: 48 },
    critical_band: { lower: 15, upper: 55 },
    direction: 'target_optimal',
    derivation_method: {
      method: 'peer_median',
      peer_group: 'Stable high-income economies',
      sample_size: 35,
    },
    derivation_source: 'Analysis of economically stable nations 1990-2020',
    derivation_date: '2022-12-01',
    setpoint_confidence: 0.7,
    methodology_note_sv: 'Medelmedianålder för stabila höginkomstekonomier. Extremer i båda riktningar medför utmaningar.',
    methodology_note_en: 'Average median age of stable high-income economies. Extremes in either direction pose challenges.',
  },
  
  // === ECONOMY ===
  'INFLATION_CPI': {
    code: 'INFLATION_CPI',
    name_sv: 'Inflation (KPI)',
    name_en: 'Inflation (CPI)',
    unit: '% YoY',
    setpoint: 2.0,
    setpoint_type: 'target',
    optimal_band: { lower: 1.5, upper: 2.5 },
    acceptable_band: { lower: 0.5, upper: 3.5 },
    warning_band: { lower: -1, upper: 6 },
    critical_band: { lower: -5, upper: 15 },
    direction: 'target_optimal',
    derivation_method: {
      method: 'policy_target',
      sample_size: 42,
    },
    derivation_source: 'Central bank inflation targets consensus',
    derivation_date: '2024-01-01',
    setpoint_confidence: 0.85,
    methodology_note_sv: 'Standard centralbanksmål. Deflation och hög inflation anses båda problematiska.',
    methodology_note_en: 'Standard central bank target. Both deflation and high inflation considered problematic.',
  },
  
  'UNEMPLOYMENT': {
    code: 'UNEMPLOYMENT',
    name_sv: 'Arbetslöshet',
    name_en: 'Unemployment Rate',
    unit: '%',
    setpoint: 4.5,
    setpoint_type: 'minimum',
    optimal_band: { lower: 3, upper: 5 },
    acceptable_band: { lower: 2, upper: 7 },
    warning_band: { lower: 1, upper: 10 },
    critical_band: { lower: 0, upper: 30 },
    direction: 'lower_better',
    derivation_method: {
      method: 'empirical_threshold',
      peer_group: 'OECD',
      sample_size: 38,
    },
    derivation_source: 'NAIRU estimates and labor market research',
    derivation_date: '2023-01-01',
    setpoint_confidence: 0.75,
    methodology_note_sv: 'Friktionsarbetslöshet omkring 3-5% anses normal. Mycket låg arbetslöshet kan indikera överhettning.',
    methodology_note_en: 'Frictional unemployment around 3-5% considered normal. Very low unemployment may indicate overheating.',
  },
  
  'DEBT_TO_GDP': {
    code: 'DEBT_TO_GDP',
    name_sv: 'Statsskuld/BNP',
    name_en: 'Government Debt to GDP',
    unit: '%',
    setpoint: 60,
    setpoint_type: 'maximum',
    optimal_band: { lower: 0, upper: 60 },
    acceptable_band: { lower: 0, upper: 90 },
    warning_band: { lower: 0, upper: 120 },
    critical_band: { lower: 0, upper: 250 },
    direction: 'lower_better',
    derivation_method: {
      method: 'policy_target',
    },
    derivation_source: 'Maastricht criteria and empirical research',
    derivation_date: '1992-02-07',
    setpoint_confidence: 0.6,
    methodology_note_sv: 'Maastricht-kriterium 60%. Gränsen är omdebatterad. Beror på tillväxt, räntor, valutastatus.',
    methodology_note_en: 'Maastricht criterion 60%. Threshold is debated. Depends on growth, interest rates, currency status.',
  },
  
  // === HEALTH ===
  'LIFE_EXPECTANCY': {
    code: 'LIFE_EXPECTANCY',
    name_sv: 'Förväntad livslängd',
    name_en: 'Life Expectancy at Birth',
    unit: 'år',
    setpoint: 82,
    setpoint_type: 'minimum',
    optimal_band: { lower: 80, upper: 90 },
    acceptable_band: { lower: 75, upper: 90 },
    warning_band: { lower: 70, upper: 90 },
    critical_band: { lower: 40, upper: 95 },
    direction: 'higher_better',
    derivation_method: {
      method: 'peer_median',
      peer_group: 'High-income countries',
      sample_size: 56,
    },
    derivation_source: 'WHO data for high-income countries',
    derivation_date: '2023-01-01',
    setpoint_confidence: 0.9,
    methodology_note_sv: 'Medelvärde för höginkomstländer. Biologisk gräns uppskattad till ca 85-90 år på befolkningsnivå.',
    methodology_note_en: 'Average for high-income countries. Biological limit estimated at ~85-90 years at population level.',
  },
  
  'INFANT_MORTALITY': {
    code: 'INFANT_MORTALITY',
    name_sv: 'Spädbarnsdödlighet',
    name_en: 'Infant Mortality Rate',
    unit: 'per 1000',
    setpoint: 3,
    setpoint_type: 'maximum',
    optimal_band: { lower: 0, upper: 4 },
    acceptable_band: { lower: 0, upper: 7 },
    warning_band: { lower: 0, upper: 15 },
    critical_band: { lower: 0, upper: 100 },
    direction: 'lower_better',
    derivation_method: {
      method: 'peer_median',
      peer_group: 'Top-performing countries',
      sample_size: 20,
    },
    derivation_source: 'Best-performing countries average (Nordic, Japan, Singapore)',
    derivation_date: '2023-01-01',
    setpoint_confidence: 0.95,
    methodology_note_sv: 'Baserat på bäst presterande länder. Nivåer under 5 kräver avancerad sjukvård.',
    methodology_note_en: 'Based on best-performing countries. Levels below 5 require advanced healthcare.',
  },
  
  // === SOCIAL ===
  'GINI_COEFFICIENT': {
    code: 'GINI_COEFFICIENT',
    name_sv: 'Gini-koefficient',
    name_en: 'Gini Coefficient',
    unit: '0-1',
    setpoint: 0.30,
    setpoint_type: 'range',
    optimal_band: { lower: 0.25, upper: 0.32 },
    acceptable_band: { lower: 0.22, upper: 0.38 },
    warning_band: { lower: 0.15, upper: 0.45 },
    critical_band: { lower: 0, upper: 0.70 },
    direction: 'target_optimal',
    derivation_method: {
      method: 'empirical_threshold',
      peer_group: 'Stable democracies',
      sample_size: 30,
    },
    derivation_source: 'Analysis of social stability and inequality levels',
    derivation_date: '2023-01-01',
    setpoint_confidence: 0.65,
    methodology_note_sv: 'Extremer åt båda håll korrelerar med instabilitet. Låg olikhet kan dämpa innovation, hög skapar spänningar.',
    methodology_note_en: 'Extremes in either direction correlate with instability. Low inequality may dampen innovation, high creates tensions.',
  },
  
  'SOCIAL_TRUST': {
    code: 'SOCIAL_TRUST',
    name_sv: 'Social tillit',
    name_en: 'Social Trust Index',
    unit: 'index 0-100',
    setpoint: 65,
    setpoint_type: 'minimum',
    optimal_band: { lower: 60, upper: 100 },
    acceptable_band: { lower: 50, upper: 100 },
    warning_band: { lower: 35, upper: 100 },
    critical_band: { lower: 0, upper: 100 },
    direction: 'higher_better',
    derivation_method: {
      method: 'empirical_threshold',
      peer_group: 'High-functioning societies',
      sample_size: 25,
    },
    derivation_source: 'World Values Survey analysis',
    derivation_date: '2022-01-01',
    setpoint_confidence: 0.7,
    methodology_note_sv: 'Nordiska länder ligger runt 65-75. Under 50 korrelerar med ökade transaktionskostnader.',
    methodology_note_en: 'Nordic countries around 65-75. Below 50 correlates with increased transaction costs.',
  },
};

// =============================================================================
// ASSESSMENT FUNCTIONS
// =============================================================================

/**
 * Assess which zone a value falls into
 */
export function assessZone(code: string, value: number): ZoneAssessment {
  const definition = SETPOINT_DEFINITIONS[code];
  
  if (!definition) {
    return {
      indicator_code: code,
      current_value: value,
      zone: 'unknown',
      deviation_percent: 0,
      deviation_absolute: 0,
      band_description_sv: 'Inget börvärde definierat',
      band_description_en: 'No setpoint defined',
    };
  }
  
  // Determine zone
  let zone: ZoneStatus = 'critical';
  let band_description_sv = 'Kritisk avvikelse';
  let band_description_en = 'Critical deviation';
  
  if (value >= definition.optimal_band.lower && value <= definition.optimal_band.upper) {
    zone = 'optimal';
    band_description_sv = 'Inom optimalt intervall';
    band_description_en = 'Within optimal range';
  } else if (value >= definition.acceptable_band.lower && value <= definition.acceptable_band.upper) {
    zone = 'acceptable';
    band_description_sv = 'Acceptabel avvikelse';
    band_description_en = 'Acceptable deviation';
  } else if (value >= definition.warning_band.lower && value <= definition.warning_band.upper) {
    zone = 'warning';
    band_description_sv = 'Varningsnivå';
    band_description_en = 'Warning level';
  }
  
  // Calculate deviation
  const deviation_absolute = value - definition.setpoint;
  const deviation_percent = definition.setpoint !== 0 
    ? ((value - definition.setpoint) / Math.abs(definition.setpoint)) * 100
    : 0;
  
  return {
    indicator_code: code,
    current_value: value,
    zone,
    deviation_percent,
    deviation_absolute,
    band_description_sv,
    band_description_en,
  };
}

/**
 * Get zone color (clinical palette)
 */
export function getZoneColor(zone: ZoneStatus): string {
  switch (zone) {
    case 'optimal': return '#3b82f6';     // Blue
    case 'acceptable': return '#06b6d4';   // Cyan
    case 'warning': return '#f59e0b';      // Amber
    case 'critical': return '#dc2626';     // Red
    case 'unknown': return '#6b7280';      // Gray
    default: return '#6b7280';
  }
}

/**
 * Get zone label
 */
export function getZoneLabel(zone: ZoneStatus, language: 'sv' | 'en'): string {
  const labels: Record<ZoneStatus, { sv: string; en: string }> = {
    optimal: { sv: 'Optimal', en: 'Optimal' },
    acceptable: { sv: 'Acceptabel', en: 'Acceptable' },
    warning: { sv: 'Varning', en: 'Warning' },
    critical: { sv: 'Kritisk', en: 'Critical' },
    unknown: { sv: 'Okänd', en: 'Unknown' },
  };
  return labels[zone][language];
}

/**
 * Get setpoint definition
 */
export function getSetpointDefinition(code: string): SetpointDefinition | null {
  return SETPOINT_DEFINITIONS[code] || null;
}

/**
 * List all defined setpoints
 */
export function listSetpoints(): SetpointDefinition[] {
  return Object.values(SETPOINT_DEFINITIONS);
}
