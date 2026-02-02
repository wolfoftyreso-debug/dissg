/**
 * MODULE — DECISION STRESS INDEX (DSI)
 * "Var är världen mest sårbar om inget förändras?"
 * 
 * Tryckmätaren. Inte vad man ska göra – utan hur mycket 
 * handlingsutrymme som finns kvar.
 * 
 * SYSTEMFRÅGA:
 * "Var ackumuleras systemstress snabbast givet nuvarande trender, 
 * och hur mycket tid finns innan handlingsutrymmet minskar kraftigt?"
 * 
 * FOKUS: tid, sårbarhet, irreversibilitet.
 */

import type { ImpactDomain, WorldRegion } from './globalPrioritySynthesisConfig';

// ═══════════════════════════════════════════════════════════════
// KÄRNPRINCIP (ALDRIG BRYT)
// ═══════════════════════════════════════════════════════════════

export const DSI_CORE_PRINCIPLE = {
  statement: 'DSI mäter inte rätt/fel. DSI mäter hur mycket utrymme som finns kvar att fatta beslut.',
  statementEn: 'DSI does not measure right/wrong. DSI measures how much room remains for decision-making.',
  enforced: true,
  
  system_question: {
    sv: 'Var ackumuleras systemstress snabbast givet nuvarande trender, och hur mycket tid finns innan handlingsutrymmet minskar kraftigt?',
    en: 'Where is system stress accumulating fastest given current trends, and how much time remains before decision-making capacity significantly decreases?',
  },
  
  focus: ['time', 'vulnerability', 'irreversibility'],
  
  mandatory_disclaimer: {
    text_sv: 'Hög stress innebär inte att åtgärd är definierad. Det beskriver graden av ackumulerad sårbarhet.',
    text_en: 'High stress does not mean action is defined. It describes the degree of accumulated vulnerability.',
    display: 'always_visible',
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK MA — STRESS SIGNAL INGEST
// ═══════════════════════════════════════════════════════════════

export type StressDomain = 
  | 'energy'
  | 'health'
  | 'demography'
  | 'economy'
  | 'institutions'
  | 'environment';

export interface StressSignalSource {
  domain: StressDomain;
  name: string;
  nameSv: string;
  indicators: StressIndicator[];
  dataAvailability: 'high' | 'medium' | 'low';
}

export interface StressIndicator {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  unit: string;
  direction: 'higher_is_stress' | 'lower_is_stress';
  threshold_warning?: number;
  threshold_critical?: number;
}

export const STRESS_SIGNAL_SOURCES: StressSignalSource[] = [
  {
    domain: 'energy',
    name: 'Energy System',
    nameSv: 'Energisystem',
    indicators: [
      { id: 'energy_access', name: 'Access Rate', nameSv: 'Tillgång', description: 'Population with reliable energy access', unit: '%', direction: 'lower_is_stress' },
      { id: 'price_volatility', name: 'Price Volatility', nameSv: 'Prisvolatilitet', description: 'Energy price volatility index', unit: 'index', direction: 'higher_is_stress', threshold_warning: 0.3, threshold_critical: 0.6 },
      { id: 'capacity_margin', name: 'Capacity Margin', nameSv: 'Kapacitetsmarginal', description: 'Generation capacity vs peak demand', unit: '%', direction: 'lower_is_stress', threshold_warning: 15, threshold_critical: 5 },
      { id: 'import_dependency', name: 'Import Dependency', nameSv: 'Importberoende', description: 'Energy import as share of consumption', unit: '%', direction: 'higher_is_stress' },
    ],
    dataAvailability: 'high',
  },
  {
    domain: 'health',
    name: 'Health System',
    nameSv: 'Hälsosystem',
    indicators: [
      { id: 'capacity_utilization', name: 'Capacity Utilization', nameSv: 'Kapacitetsutnyttjande', description: 'Hospital bed occupancy rate', unit: '%', direction: 'higher_is_stress', threshold_warning: 80, threshold_critical: 95 },
      { id: 'chronic_burden', name: 'Chronic Disease Burden', nameSv: 'Kronisk sjukdomsbörda', description: 'NCD prevalence trend', unit: 'DALY per 100k', direction: 'higher_is_stress' },
      { id: 'workforce_gap', name: 'Healthcare Workforce Gap', nameSv: 'Vårdpersonalgap', description: 'Healthcare workers per capita vs need', unit: 'ratio', direction: 'lower_is_stress' },
      { id: 'mental_health_burden', name: 'Mental Health Burden', nameSv: 'Psykisk hälsobörda', description: 'Mental health condition prevalence', unit: '%', direction: 'higher_is_stress' },
    ],
    dataAvailability: 'high',
  },
  {
    domain: 'demography',
    name: 'Demographic Structure',
    nameSv: 'Demografisk struktur',
    indicators: [
      { id: 'dependency_ratio', name: 'Dependency Ratio', nameSv: 'Försörjningskvot', description: 'Non-working age to working age ratio', unit: 'ratio', direction: 'higher_is_stress', threshold_warning: 0.55, threshold_critical: 0.70 },
      { id: 'migration_pressure', name: 'Migration Pressure', nameSv: 'Migrationstryck', description: 'Net migration rate relative to capacity', unit: 'index', direction: 'higher_is_stress' },
      { id: 'urbanization_speed', name: 'Urbanization Speed', nameSv: 'Urbaniseringstakt', description: 'Urban population growth rate', unit: '%/year', direction: 'higher_is_stress' },
      { id: 'youth_bulge', name: 'Youth Employment Gap', nameSv: 'Ungdomsarbetslöshetsgap', description: 'Youth unemployment vs general', unit: 'ratio', direction: 'higher_is_stress' },
    ],
    dataAvailability: 'high',
  },
  {
    domain: 'economy',
    name: 'Economic System',
    nameSv: 'Ekonomiskt system',
    indicators: [
      { id: 'debt_dynamics', name: 'Debt Dynamics', nameSv: 'Skulddynamik', description: 'Debt growth rate vs GDP growth', unit: 'ratio', direction: 'higher_is_stress', threshold_warning: 1.2, threshold_critical: 1.5 },
      { id: 'real_income_trend', name: 'Real Income Trend', nameSv: 'Realinkomsttrend', description: 'Median real income change', unit: '%/year', direction: 'lower_is_stress' },
      { id: 'inflation_volatility', name: 'Inflation Volatility', nameSv: 'Inflationsvolatilitet', description: 'Inflation rate variability', unit: 'std dev', direction: 'higher_is_stress' },
      { id: 'fiscal_space', name: 'Fiscal Space', nameSv: 'Fiskalt utrymme', description: 'Government debt service ratio', unit: '%', direction: 'higher_is_stress', threshold_warning: 15, threshold_critical: 25 },
    ],
    dataAvailability: 'high',
  },
  {
    domain: 'institutions',
    name: 'Institutional Capacity',
    nameSv: 'Institutionell kapacitet',
    indicators: [
      { id: 'implementation_capacity', name: 'Implementation Capacity', nameSv: 'Implementeringsförmåga', description: 'Policy implementation effectiveness', unit: 'index', direction: 'lower_is_stress' },
      { id: 'trust_level', name: 'Institutional Trust', nameSv: 'Institutionell tillit', description: 'Public trust in institutions', unit: '%', direction: 'lower_is_stress', threshold_warning: 40, threshold_critical: 25 },
      { id: 'coordination_capacity', name: 'Coordination Capacity', nameSv: 'Samordningskapacitet', description: 'Cross-agency coordination effectiveness', unit: 'index', direction: 'lower_is_stress' },
      { id: 'reform_velocity', name: 'Reform Velocity', nameSv: 'Reformhastighet', description: 'Speed of implementing needed changes', unit: 'index', direction: 'lower_is_stress' },
    ],
    dataAvailability: 'medium',
  },
  {
    domain: 'environment',
    name: 'Environmental System',
    nameSv: 'Miljösystem',
    indicators: [
      { id: 'threshold_proximity', name: 'Threshold Proximity', nameSv: 'Tröskelnärhet', description: 'Distance to known tipping points', unit: 'index', direction: 'higher_is_stress' },
      { id: 'extreme_events', name: 'Extreme Event Frequency', nameSv: 'Extremhändelsefrekvens', description: 'Frequency of extreme weather events', unit: 'events/year', direction: 'higher_is_stress' },
      { id: 'ecosystem_degradation', name: 'Ecosystem Degradation Rate', nameSv: 'Ekosystemförsämringstakt', description: 'Rate of ecosystem service loss', unit: '%/year', direction: 'higher_is_stress' },
      { id: 'resource_depletion', name: 'Resource Depletion Rate', nameSv: 'Resurstömningstakt', description: 'Critical resource consumption vs regeneration', unit: 'ratio', direction: 'higher_is_stress' },
    ],
    dataAvailability: 'medium',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK MB — STRESS DIMENSIONS
// ═══════════════════════════════════════════════════════════════

export interface StressDimension {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  weight: number;
  calculation: string;
}

export const STRESS_DIMENSIONS: StressDimension[] = [
  {
    id: 'load',
    name: 'Load',
    nameSv: 'Belastning',
    description: 'Current stress level on the system',
    descriptionSv: 'Nuvarande belastning på systemet',
    weight: 0.25,
    calculation: 'current_value / capacity_threshold',
  },
  {
    id: 'trend',
    name: 'Trend',
    nameSv: 'Trend',
    description: 'Rate of change (acceleration/deceleration)',
    descriptionSv: 'Förändringstakt (acceleration/deceleration)',
    weight: 0.25,
    calculation: 'rate_of_change * direction_factor',
  },
  {
    id: 'buffer',
    name: 'Buffer',
    nameSv: 'Buffert',
    description: 'Reserves and elasticity available',
    descriptionSv: 'Reserver och elasticitet tillgänglig',
    weight: 0.20,
    calculation: '1 / (available_reserves / normal_reserves)',
  },
  {
    id: 'lag',
    name: 'Lag',
    nameSv: 'Fördröjning',
    description: 'Time delay before effects materialize',
    descriptionSv: 'Tidsfördröjning innan effekter materialiseras',
    weight: 0.15,
    calculation: 'effect_delay_months / visibility_factor',
  },
  {
    id: 'reversibility',
    name: 'Reversibility',
    nameSv: 'Reversibilitet',
    description: 'Difficulty of reversing the trend',
    descriptionSv: 'Svårighetsgrad att vända trenden',
    weight: 0.15,
    calculation: '1 / (recovery_potential * intervention_effectiveness)',
  },
];

export interface StressProfile {
  domain: StressDomain;
  domainNameSv: string;
  
  dimensions: {
    load: number;         // 0-1
    trend: number;        // -1 to 1 (negative = improving)
    buffer: number;       // 0-1 (higher = less buffer)
    lag: number;          // 0-1 (higher = longer lag)
    reversibility: number; // 0-1 (higher = harder to reverse)
  };
  
  composite_stress: number; // 0-1
  
  data_quality: {
    indicator_coverage: number;
    recency_months: number;
    confidence: 'high' | 'medium' | 'low';
  };
}

// ═══════════════════════════════════════════════════════════════
// BLOCK MC — DECISION STRESS SCORE
// ═══════════════════════════════════════════════════════════════

export type StressLevel = 'low' | 'moderate' | 'elevated' | 'high' | 'critical';
export type StressDirection = 'decreasing' | 'stable' | 'increasing' | 'accelerating';
export type TimeWindow = 'short' | 'medium' | 'long';

export interface DecisionStressScore {
  domain: StressDomain;
  
  dsi: number; // 0-1, the composite score
  
  level: StressLevel;
  direction: StressDirection;
  timeWindow: TimeWindow;
  
  interpretation: {
    sv: string;
    en: string;
  };
  
  uncertainty: {
    range: [number, number];
    confidence: number;
  };
}

export const STRESS_LEVEL_THRESHOLDS: Record<StressLevel, { min: number; max: number; color: string }> = {
  low: { min: 0, max: 0.2, color: 'hsl(var(--success))' },
  moderate: { min: 0.2, max: 0.4, color: 'hsl(var(--info))' },
  elevated: { min: 0.4, max: 0.6, color: 'hsl(var(--warning))' },
  high: { min: 0.6, max: 0.8, color: 'hsl(var(--destructive) / 0.7)' },
  critical: { min: 0.8, max: 1.0, color: 'hsl(var(--destructive))' },
};

export const TIME_WINDOW_DEFINITIONS: Record<TimeWindow, { months: number; description_sv: string }> = {
  short: { months: 12, description_sv: 'Mindre än 12 månader till betydande kapacitetsminskning' },
  medium: { months: 36, description_sv: '1-3 år till betydande kapacitetsminskning' },
  long: { months: 60, description_sv: 'Mer än 3 år innan kritiska trösklar nås' },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK MD — GLOBAL & REGIONAL VIEW
// ═══════════════════════════════════════════════════════════════

export interface GlobalStressOverview {
  overall_dsi: number;
  level: StressLevel;
  direction: StressDirection;
  
  top_stress_areas: Array<{
    rank: number;
    domain: StressDomain;
    domainNameSv: string;
    dsi: number;
    level: StressLevel;
    is_cross_domain: boolean;
    affected_domains?: StressDomain[];
  }>;
  
  cross_domain_stress: Array<{
    domains: StressDomain[];
    coupling_strength: number;
    cascade_risk: 'low' | 'medium' | 'high';
    description_sv: string;
  }>;
  
  as_of: string;
}

export interface RegionalStressProfile {
  region: WorldRegion;
  regionNameSv: string;
  
  overall_dsi: number;
  level: StressLevel;
  
  domain_breakdown: Array<{
    domain: StressDomain;
    dsi: number;
    deviation_from_global: number; // positive = higher stress than global
    primary_driver: string;
    primary_driver_sv: string;
  }>;
  
  unique_stressors: string[];
  
  comparison_to_global: {
    higher_stress: StressDomain[];
    lower_stress: StressDomain[];
  };
}

export interface NationalStressProfile {
  country_code: string;
  country_name: string;
  
  overall_dsi: number;
  level: StressLevel;
  direction: StressDirection;
  
  domain_scores: Record<StressDomain, DecisionStressScore>;
  
  critical_domains: StressDomain[];
  
  time_sensitivity: {
    most_urgent: StressDomain;
    estimated_window: TimeWindow;
    description_sv: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// BLOCK ME — "IF NOTHING CHANGES"
// ═══════════════════════════════════════════════════════════════

export interface TrendProjection {
  domain: StressDomain;
  
  current_dsi: number;
  
  projected: {
    months_12: number;
    months_36: number;
    months_60: number;
  };
  
  thresholds: Array<{
    name: string;
    nameSv: string;
    type: 'capacity' | 'irreversibility' | 'cascade';
    value: number;
    projected_crossing: string | null; // Date string or null if not projected
    confidence: number;
  }>;
  
  projection_note: {
    sv: string;
    en: string;
  };
}

export const PROJECTION_FRAMING = {
  prefix_sv: 'Om observerade trender fortsätter utan strukturell förändring…',
  prefix_en: 'If observed trends continue without structural change…',
  
  disclaimer_sv: 'Detta är en trendextrapolation, inte en prognos. Faktiska utfall beror på beslut och händelser.',
  disclaimer_en: 'This is a trend extrapolation, not a forecast. Actual outcomes depend on decisions and events.',
  
  required_qualifiers: [
    'if current trends continue',
    'based on observed patterns',
    'assuming no structural change',
    'om nuvarande trender fortsätter',
    'baserat på observerade mönster',
    'givet att ingen strukturell förändring sker',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK MF — STRESS vs ATTENTION
// ═══════════════════════════════════════════════════════════════

export type StressAttentionStatus = 
  | 'critical_blind_zone'  // High stress, Low attention
  | 'active_risk'          // High stress, High attention
  | 'overfocus'            // Low stress, High attention
  | 'monitored'            // Medium stress, Medium attention
  | 'stable';              // Low stress, Low attention

export interface StressAttentionMatrix {
  domain: StressDomain;
  domainNameSv: string;
  
  stress_score: number;
  attention_score: number;
  
  status: StressAttentionStatus;
  
  gap: number; // stress - attention (positive = underattended)
}

export const STRESS_ATTENTION_DEFINITIONS: Record<StressAttentionStatus, { description_sv: string; urgency: number }> = {
  critical_blind_zone: {
    description_sv: 'Hög stress men låg uppmärksamhet – kritiskt glapp',
    urgency: 1.0,
  },
  active_risk: {
    description_sv: 'Hög stress och hög uppmärksamhet – aktivt hanterad risk',
    urgency: 0.7,
  },
  overfocus: {
    description_sv: 'Låg stress men hög uppmärksamhet – möjlig överfokusering',
    urgency: 0.2,
  },
  monitored: {
    description_sv: 'Medelhög stress och uppmärksamhet – under bevakning',
    urgency: 0.5,
  },
  stable: {
    description_sv: 'Låg stress och låg uppmärksamhet – stabilt läge',
    urgency: 0.1,
  },
};

export function determineStressAttentionStatus(
  stress: number,
  attention: number
): StressAttentionStatus {
  if (stress >= 0.6 && attention < 0.4) return 'critical_blind_zone';
  if (stress >= 0.6 && attention >= 0.6) return 'active_risk';
  if (stress < 0.4 && attention >= 0.6) return 'overfocus';
  if (stress >= 0.4 && attention >= 0.4) return 'monitored';
  return 'stable';
}

// ═══════════════════════════════════════════════════════════════
// BLOCK MG — SAFETY & NON-NORMATIVE GUARD
// ═══════════════════════════════════════════════════════════════

export const DSI_SAFETY_GUARDS = {
  mandatory_disclaimer: DSI_CORE_PRINCIPLE.mandatory_disclaimer,
  
  forbidden_terms: [
    'must act',
    'should prioritize',
    'needs intervention',
    'requires action',
    'måste agera',
    'bör prioritera',
    'kräver åtgärd',
    'behöver insats',
  ],
  
  required_framing: [
    'stress indicates',
    'data shows accumulation',
    'observed pressure',
    'measured vulnerability',
    'stress indikerar',
    'data visar ackumulering',
    'observerat tryck',
    'mätt sårbarhet',
  ],
  
  interpretation_guard: {
    text_sv: 'DSI mäter systemtryck, inte policyprioriteringar. Högt tryck beskriver sårbarhet, inte nödvändig handling.',
    text_en: 'DSI measures system pressure, not policy priorities. High pressure describes vulnerability, not required action.',
    display: 'always_visible',
  },
  
  anti_prescription_checks: [
    { check: 'no_action_recommendations', enforcement: 'block' },
    { check: 'no_priority_statements', enforcement: 'block' },
    { check: 'uncertainty_always_shown', enforcement: 'require' },
    { check: 'methodology_transparent', enforcement: 'require' },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK MH — HOMEPAGE PRESSURE GAUGE
// ═══════════════════════════════════════════════════════════════

export interface HomepagePressureGauge {
  title: string;
  titleSv: string;
  
  display: {
    show_level: boolean;
    show_direction_arrow: boolean;
    show_top_domains: number;
    clickable_to_data: boolean;
  };
  
  arrow_meaning: {
    sv: string;
    en: string;
  };
  
  disclaimer: string;
  disclaimerSv: string;
}

export const HOMEPAGE_PRESSURE_GAUGE_CONFIG: HomepagePressureGauge = {
  title: 'Global Stress Level',
  titleSv: 'Global stressnivå',
  
  display: {
    show_level: true,
    show_direction_arrow: true,
    show_top_domains: 3,
    clickable_to_data: true,
  },
  
  arrow_meaning: {
    sv: 'Pilen visar riktning för stressackumulering, inte värdering',
    en: 'Arrow shows direction of stress accumulation, not judgment',
  },
  
  disclaimer: 'Measures system pressure, not required action',
  disclaimerSv: 'Mäter systemtryck, inte nödvändig handling',
};

// ═══════════════════════════════════════════════════════════════
// CALCULATION HELPERS
// ═══════════════════════════════════════════════════════════════

export function calculateDSI(profile: StressProfile): number {
  const { load, trend, buffer, lag, reversibility } = profile.dimensions;
  
  // DSI = f(Load × Trend × (1/Buffer) × (1/Reversibility) × Lag)
  // Normalized to 0-1
  
  const trendFactor = (trend + 1) / 2; // Convert -1 to 1 range to 0 to 1
  const bufferInverse = buffer; // Already inverted in dimensions
  const reversibilityInverse = reversibility; // Already inverted
  
  // Weighted combination
  const raw = (
    load * 0.25 +
    trendFactor * 0.25 +
    bufferInverse * 0.20 +
    reversibilityInverse * 0.15 +
    lag * 0.15
  );
  
  return Math.min(1, Math.max(0, raw));
}

export function determineStressLevel(dsi: number): StressLevel {
  if (dsi >= 0.8) return 'critical';
  if (dsi >= 0.6) return 'high';
  if (dsi >= 0.4) return 'elevated';
  if (dsi >= 0.2) return 'moderate';
  return 'low';
}

export function determineStressDirection(
  currentTrend: number,
  previousTrend: number
): StressDirection {
  const acceleration = currentTrend - previousTrend;
  
  if (currentTrend < -0.1) return 'decreasing';
  if (currentTrend > 0.2 && acceleration > 0.05) return 'accelerating';
  if (currentTrend > 0.1) return 'increasing';
  return 'stable';
}

export function determineTimeWindow(
  dsi: number,
  trend: number,
  buffer: number
): TimeWindow {
  // Estimate time to critical threshold based on current stress, trend, and buffer
  const velocityTowardsCritical = trend * (1 + (1 - buffer));
  const distanceToCritical = 0.8 - dsi;
  
  if (distanceToCritical <= 0) return 'short';
  
  const monthsToThreshold = velocityTowardsCritical > 0 
    ? (distanceToCritical / velocityTowardsCritical) * 12
    : 999;
  
  if (monthsToThreshold <= 12) return 'short';
  if (monthsToThreshold <= 36) return 'medium';
  return 'long';
}

export function calculateCrossDomainCoupling(
  profiles: StressProfile[]
): Array<{ domains: StressDomain[]; strength: number }> {
  const couplings: Array<{ domains: StressDomain[]; strength: number }> = [];
  
  // Known domain couplings
  const knownCouplings: Array<{ domains: StressDomain[]; baseStrength: number }> = [
    { domains: ['energy', 'economy'], baseStrength: 0.8 },
    { domains: ['health', 'economy'], baseStrength: 0.7 },
    { domains: ['demography', 'health', 'economy'], baseStrength: 0.75 },
    { domains: ['environment', 'health'], baseStrength: 0.6 },
    { domains: ['institutions', 'economy'], baseStrength: 0.65 },
  ];
  
  for (const coupling of knownCouplings) {
    const relevantProfiles = profiles.filter(p => coupling.domains.includes(p.domain));
    const avgStress = relevantProfiles.reduce((sum, p) => sum + p.composite_stress, 0) / relevantProfiles.length;
    
    if (avgStress > 0.4) {
      couplings.push({
        domains: coupling.domains,
        strength: coupling.baseStrength * avgStress,
      });
    }
  }
  
  return couplings.sort((a, b) => b.strength - a.strength);
}

export function validateDSILanguage(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  for (const forbidden of DSI_SAFETY_GUARDS.forbidden_terms) {
    if (text.toLowerCase().includes(forbidden.toLowerCase())) {
      violations.push(`Forbidden term: "${forbidden}"`);
    }
  }
  
  return { valid: violations.length === 0, violations };
}

// ═══════════════════════════════════════════════════════════════
// EXAMPLE DATA
// ═══════════════════════════════════════════════════════════════

export const EXAMPLE_GLOBAL_STRESS: GlobalStressOverview = {
  overall_dsi: 0.52,
  level: 'elevated',
  direction: 'increasing',
  
  top_stress_areas: [
    {
      rank: 1,
      domain: 'demography',
      domainNameSv: 'Demografi',
      dsi: 0.68,
      level: 'high',
      is_cross_domain: true,
      affected_domains: ['economy', 'health', 'institutions'],
    },
    {
      rank: 2,
      domain: 'energy',
      domainNameSv: 'Energi',
      dsi: 0.62,
      level: 'high',
      is_cross_domain: true,
      affected_domains: ['economy', 'environment'],
    },
    {
      rank: 3,
      domain: 'institutions',
      domainNameSv: 'Institutioner',
      dsi: 0.55,
      level: 'elevated',
      is_cross_domain: false,
    },
    {
      rank: 4,
      domain: 'health',
      domainNameSv: 'Hälsa',
      dsi: 0.48,
      level: 'elevated',
      is_cross_domain: false,
    },
    {
      rank: 5,
      domain: 'environment',
      domainNameSv: 'Miljö',
      dsi: 0.45,
      level: 'elevated',
      is_cross_domain: false,
    },
  ],
  
  cross_domain_stress: [
    {
      domains: ['demography', 'economy', 'health'],
      coupling_strength: 0.72,
      cascade_risk: 'high',
      description_sv: 'Demografisk förändring driver samtidig stress i ekonomi och hälsosystem',
    },
    {
      domains: ['energy', 'economy'],
      coupling_strength: 0.65,
      cascade_risk: 'medium',
      description_sv: 'Energisystemets volatilitet förstärker ekonomisk stress',
    },
  ],
  
  as_of: new Date().toISOString(),
};

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const DECISION_STRESS_INDEX_SYSTEM = {
  name: 'Decision Stress Index',
  acronym: 'DSI',
  version: '1.0',
  
  system_question: DSI_CORE_PRINCIPLE.system_question,
  core_principle: DSI_CORE_PRINCIPLE,
  
  blocks: {
    MA: 'Stress Signal Ingest',
    MB: 'Stress Dimensions (Load, Trend, Buffer, Lag, Reversibility)',
    MC: 'Decision Stress Score',
    MD: 'Global & Regional View',
    ME: '"If Nothing Changes" Projections',
    MF: 'Stress vs Attention Matrix',
    MG: 'Safety & Non-Normative Guard',
    MH: 'Homepage Pressure Gauge',
  },
  
  formula: 'DSI = f(Load × Trend × (1/Buffer) × (1/Reversibility) × Lag)',
  
  stress_domains: STRESS_SIGNAL_SOURCES.length,
  stress_dimensions: STRESS_DIMENSIONS.length,
  
  outputs: {
    dsi_level: ['low', 'moderate', 'elevated', 'high', 'critical'],
    dsi_direction: ['decreasing', 'stable', 'increasing', 'accelerating'],
    time_window: ['short (<12m)', 'medium (1-3y)', 'long (>3y)'],
  },
  
  integration: {
    complements: ['Global Priority Synthesis', 'Global Blind Spot Detector'],
    homepage_widget: 'Global Stress Level gauge',
  },
  
  next_modules: [
    { name: 'Early Warning Signals', description: 'Svaga signaler innan stress syns' },
    { name: 'Trade-off Visualizer', description: 'Vad förbättras/försämras när fokus skiftar' },
    { name: 'Resilience Capacity Map', description: 'Var finns buffertar och elasticitet' },
  ],
  
  description: 'Tryckmätaren som visar var handlingsutrymmet krymper.',
} as const;
