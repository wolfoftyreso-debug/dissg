/**
 * Global Diagnostic Map (GDM) Types
 * 
 * The oscilloscope for civilization.
 */

import type { LambdaInterpretation, LambdaAxis } from '@/lib/lambda/lambda-1.0';

// =============================================================================
// GEOGRAPHY TYPES
// =============================================================================

export type GeoLevel = 'global' | 'continent' | 'country' | 'region' | 'municipality';

export interface GeoEntity {
  code: string;
  name: { sv: string; en: string };
  level: GeoLevel;
  parentCode?: string;
  center: [number, number]; // [lng, lat]
  bounds?: [[number, number], [number, number]]; // [[sw], [ne]]
  population?: number;
  area?: number;
}

// =============================================================================
// LAMBDA STATUS
// =============================================================================

export type SystemStatus = 'BALANCED' | 'STRAINED' | 'FAULT_DETECTED';

export interface LambdaOverlay {
  geoCode: string;
  lambda: number;
  interpretation: LambdaInterpretation;
  trend: 'improving' | 'stable' | 'declining';
  activeGEDICodes: string[];
  topDrivers: LambdaAxis[];
  weakestAxes: LambdaAxis[];
  confidence: number;
}

// =============================================================================
// MAP LAYERS
// =============================================================================

export type MapLayerId = 
  | 'lambda'
  | 'rpi'
  | 'labor'
  | 'health'
  | 'climate'
  | 'migration'
  | 'education'
  | 'energy'
  | 'shadow_economy';

export interface MapLayer {
  id: MapLayerId;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  icon: string;
  colorScale: string[];
  unit: string;
  isComparable: boolean;
  incompatibleWith?: MapLayerId[];
  proOnly?: boolean;
}

export const MAP_LAYERS: Record<MapLayerId, MapLayer> = {
  lambda: {
    id: 'lambda',
    name: { sv: 'Lambda (Systembalans)', en: 'Lambda (System Balance)' },
    description: { sv: 'Aggregerat balansmått för alla 8 axlar', en: 'Aggregated balance measure across all 8 axes' },
    icon: '[λ]',
    colorScale: ['#64748b', '#78716c', '#1e40af', '#475569', '#57534e'],
    unit: 'λ',
    isComparable: true,
  },
  rpi: {
    id: 'rpi',
    name: { sv: 'Reality Performance Index', en: 'Reality Performance Index' },
    description: { sv: 'Sammansatt välfärdsindex', en: 'Composite welfare index' },
    icon: '[RPI]',
    colorScale: ['#64748b', '#78716c', '#475569'],
    unit: 'index',
    isComparable: true,
  },
  labor: {
    id: 'labor',
    name: { sv: 'Arbete', en: 'Labor' },
    description: { sv: 'Sysselsättning och arbetsmarknadsbalans', en: 'Employment and labor market balance' },
    icon: '[ARB]',
    colorScale: ['#64748b', '#78716c', '#475569'],
    unit: '%',
    isComparable: true,
  },
  health: {
    id: 'health',
    name: { sv: 'Hälsa', en: 'Health' },
    description: { sv: 'Livslängd och vårdeffektivitet', en: 'Life expectancy and healthcare efficiency' },
    icon: '[HÄL]',
    colorScale: ['#64748b', '#78716c', '#475569'],
    unit: 'år',
    isComparable: true,
  },
  climate: {
    id: 'climate',
    name: { sv: 'Miljö', en: 'Climate' },
    description: { sv: 'Utsläpp och resursutnyttjande', en: 'Emissions and resource utilization' },
    icon: '[MIL]',
    colorScale: ['#475569', '#78716c', '#64748b'], // Inverted - low is good
    unit: 'ton CO₂',
    isComparable: true,
  },
  migration: {
    id: 'migration',
    name: { sv: 'Migration', en: 'Migration' },
    description: { sv: 'Nettomigration och rörelsemönster', en: 'Net migration and movement patterns' },
    icon: '[MIG]',
    colorScale: ['#1e40af', '#64748b', '#78716c'],
    unit: 'per 1000',
    isComparable: false, // Context-dependent
    incompatibleWith: ['shadow_economy'],
  },
  education: {
    id: 'education',
    name: { sv: 'Utbildning', en: 'Education' },
    description: { sv: 'Kompetens och utbildningsutfall', en: 'Skills and education outcomes' },
    icon: '[UTB]',
    colorScale: ['#64748b', '#78716c', '#475569'],
    unit: 'poäng',
    isComparable: true,
  },
  energy: {
    id: 'energy',
    name: { sv: 'Energi', en: 'Energy' },
    description: { sv: 'Förnybar andel och effektivitet', en: 'Renewable share and efficiency' },
    icon: '[ENE]',
    colorScale: ['#64748b', '#78716c', '#475569'],
    unit: '%',
    isComparable: true,
  },
  shadow_economy: {
    id: 'shadow_economy',
    name: { sv: 'Skuggekonomi', en: 'Shadow Economy' },
    description: { sv: 'Uppskattad informell ekonomi', en: 'Estimated informal economy' },
    icon: '[SKG]',
    colorScale: ['#475569', '#78716c', '#64748b'],
    unit: '% av BNP',
    isComparable: false,
    proOnly: true,
  },
};

// =============================================================================
// SIDE PANEL
// =============================================================================

export interface DiagnosticPanelData {
  geo: GeoEntity;
  lambda: LambdaOverlay;
  gediCodes: GEDICodeSummary[];
  topCauses: ProbableCause[];
  topLevers: Lever[];
  historicalLambda: { year: number; value: number }[];
}

export interface GEDICodeSummary {
  code: string;
  name: string;
  severity: 'INFO' | 'WARN' | 'MAJOR' | 'CRITICAL';
  status: 'ACTIVE' | 'HISTORICAL' | 'PENDING';
  firstTriggered: string;
  description: string;
}

export interface ProbableCause {
  id: string;
  label: { sv: string; en: string };
  probability: number; // 0-100
  indicators: string[];
}

export interface Lever {
  id: string;
  label: { sv: string; en: string };
  impact: number; // Expected impact on Lambda
  axis: LambdaAxis;
  difficulty: 'low' | 'medium' | 'high';
}

// =============================================================================
// USER PREFERENCES
// =============================================================================

export interface MapPreferences {
  theme: 'dark' | 'light';
  activeLayers: MapLayerId[];
  showLabels: boolean;
  show3D: boolean;
  timeSliderYear: number;
  isPro: boolean;
}

// =============================================================================
// AI SIGNALS (DISCRETE)
// =============================================================================

export type AISignalType = 'deviation' | 'explanation' | 'prognosis';

export interface AISignal {
  type: AISignalType;
  geoCode: string;
  message: { sv: string; en: string };
  severity: 'info' | 'warning' | 'critical';
  action?: { label: string; onClick: () => void };
}
