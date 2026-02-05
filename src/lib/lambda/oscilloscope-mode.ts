/**
 * OSCILLOSCOPE MODE
 * 
 * Formaliserat UI-koncept för realtidsinsyn i samhällssignaler.
 * 
 * Tre funktioner:
 * 1. Mäter verkliga signaler
 * 2. Visar dem utan tolkning
 * 3. Gör det omöjligt att ljuga om vad som händer
 */

import type { SignalType, SignalReading, SignalQuality } from './signal-terminology';
import { SIGNAL_DEFINITIONS, assessSignalHealth, classifySignalQuality } from './signal-terminology';

// =============================================================================
// OSCILLOSCOPE MODE TYPES
// =============================================================================

export type OscilloscopeViewMode = 
  | 'realtime'       // Live signal monitoring
  | 'historical'     // Historical trace analysis
  | 'spectral'       // Frequency domain view
  | 'correlation';   // Cross-signal correlation

 // Extended time base - from real-time to century
 export type TimeBase = 
   | 'live'    // Real-time (senaste minuter)
   | '1h'      // 1 timme
   | '1d'      // 1 dag
   | '1w'      // 1 vecka
   | '1m'      // 1 månad
   | '3m'      // 1 kvartal
   | '1y'      // 1 år
   | '5y'      // 5 år
   | '10y'     // 1 decennium
   | '25y'     // 25 år (generation)
   | '50y'     // Halvsekel
   | '100y'    // 1 sekel
   | 'max';    // All tillgänglig data
 
 // All time base options for UI
 export const TIME_BASE_OPTIONS: TimeBase[] = [
   'live', '1h', '1d', '1w', '1m', '3m', '1y', '5y', '10y', '25y', '50y', '100y', 'max'
 ];

export interface OscilloscopeChannel {
  id: string;
  label: string;
  signal_type: SignalType;
  source_kpi_code: string;
  color: string;
  visible: boolean;
  scale: 'auto' | 'fixed';
  scale_min?: number;
  scale_max?: number;
}

export interface OscilloscopeConfig {
  channels: OscilloscopeChannel[];
  time_base: TimeBase;
  view_mode: OscilloscopeViewMode;
  show_grid: boolean;
  show_noise_floor: boolean;
  show_warning_thresholds: boolean;
  trigger_level?: number;
  trigger_channel?: string;
}

export interface SignalTrace {
  channel_id: string;
  timestamps: string[];
  values: number[];
  noise_floor: number[];
  quality_markers: SignalQuality[];
}

export interface OscilloscopeSnapshot {
  timestamp: string;
  config: OscilloscopeConfig;
  traces: SignalTrace[];
  active_warnings: SignalWarning[];
  system_status: SystemStatus;
}

export interface SignalWarning {
  channel_id: string;
  signal_type: SignalType;
  status: 'warning' | 'critical';
  value: number;
  threshold: number;
  message_sv: string;
  message_en: string;
  first_detected: string;
  duration_hours: number;
}

export interface SystemStatus {
  overall_health: 'stable' | 'elevated' | 'warning' | 'critical';
  clarity_score: number;  // 0-100
  active_channels: number;
  data_freshness_hours: number;
  noise_level: 'low' | 'moderate' | 'high' | 'severe';
}

// =============================================================================
// OSCILLOSCOPE MODE CORE FUNCTIONS
// =============================================================================

/**
 * Create default oscilloscope configuration
 */
export function createDefaultConfig(): OscilloscopeConfig {
  return {
    channels: [],
    time_base: '1y',
    view_mode: 'realtime',
    show_grid: true,
    show_noise_floor: true,
    show_warning_thresholds: true,
  };
}

/**
 * Add a channel to the oscilloscope
 */
export function addChannel(
  config: OscilloscopeConfig,
  kpiCode: string,
  signalType: SignalType,
  label: string,
  color: string
): OscilloscopeConfig {
  const newChannel: OscilloscopeChannel = {
    id: `ch_${config.channels.length + 1}`,
    label,
    signal_type: signalType,
    source_kpi_code: kpiCode,
    color,
    visible: true,
    scale: 'auto',
  };
  
  return {
    ...config,
    channels: [...config.channels, newChannel],
  };
}

/**
 * Analyze traces for warnings
 */
export function analyzeTraces(traces: SignalTrace[]): SignalWarning[] {
  const warnings: SignalWarning[] = [];
  
  for (const trace of traces) {
    if (trace.values.length === 0) continue;
    
    const latestValue = trace.values[trace.values.length - 1];
    const channelSignalType = getChannelSignalType(trace.channel_id);
    
    if (!channelSignalType) continue;
    
    const health = assessSignalHealth(channelSignalType, Math.abs(latestValue));
    
    if (health.status !== 'normal') {
      const def = SIGNAL_DEFINITIONS[channelSignalType];
      warnings.push({
        channel_id: trace.channel_id,
        signal_type: channelSignalType,
        status: health.status,
        value: latestValue,
        threshold: health.status === 'critical' ? def.critical_threshold : def.warning_threshold,
        message_sv: health.message_sv,
        message_en: health.message_en,
        first_detected: new Date().toISOString(),
        duration_hours: 0,
      });
    }
  }
  
  return warnings;
}

/**
 * Calculate system status from traces
 */
export function calculateSystemStatus(
  traces: SignalTrace[],
  warnings: SignalWarning[]
): SystemStatus {
  // Calculate average noise floor
  const avgNoise = traces.reduce((sum, t) => {
    const avgTraceNoise = t.noise_floor.reduce((s, n) => s + n, 0) / t.noise_floor.length;
    return sum + avgTraceNoise;
  }, 0) / traces.length;
  
  // Determine noise level
  let noiseLevel: 'low' | 'moderate' | 'high' | 'severe';
  if (avgNoise < 0.1) noiseLevel = 'low';
  else if (avgNoise < 0.3) noiseLevel = 'moderate';
  else if (avgNoise < 0.6) noiseLevel = 'high';
  else noiseLevel = 'severe';
  
  // Determine overall health
  const criticalCount = warnings.filter(w => w.status === 'critical').length;
  const warningCount = warnings.filter(w => w.status === 'warning').length;
  
  let overallHealth: 'stable' | 'elevated' | 'warning' | 'critical';
  if (criticalCount > 0) overallHealth = 'critical';
  else if (warningCount > 2) overallHealth = 'warning';
  else if (warningCount > 0) overallHealth = 'elevated';
  else overallHealth = 'stable';
  
  // Calculate clarity score (inverse of noise)
  const clarityScore = Math.max(0, Math.min(100, (1 - avgNoise) * 100));
  
  return {
    overall_health: overallHealth,
    clarity_score: clarityScore,
    active_channels: traces.length,
    data_freshness_hours: 0, // Would be calculated from actual timestamps
    noise_level: noiseLevel,
  };
}

// Helper to get signal type from channel ID (would be implemented with actual channel lookup)
function getChannelSignalType(channelId: string): SignalType | null {
  // This would look up the channel configuration
  return 'amplitude'; // Placeholder
}

// =============================================================================
// OSCILLOSCOPE DISPLAY HELPERS
// =============================================================================

/**
 * Get color for system status
 */
export function getStatusColor(status: SystemStatus['overall_health']): string {
  switch (status) {
    case 'stable': return '#3b82f6';     // Blue
    case 'elevated': return '#f59e0b';   // Amber
    case 'warning': return '#f97316';    // Orange
    case 'critical': return '#dc2626';   // Red
    default: return '#6b7280';           // Gray
  }
}

/**
 * Get display text for status
 */
export function getStatusLabel(
  status: SystemStatus['overall_health'],
  language: 'sv' | 'en'
): string {
  const labels = {
    stable: { sv: 'Stabilt', en: 'Stable' },
    elevated: { sv: 'Förhöjt', en: 'Elevated' },
    warning: { sv: 'Varning', en: 'Warning' },
    critical: { sv: 'Kritiskt', en: 'Critical' },
  };
  return labels[status][language];
}

/**
 * Format time base for display
 */
export function formatTimeBase(timeBase: TimeBase, language: 'sv' | 'en'): string {
  const formats = {
     'live': { sv: 'Nu', en: 'Live' },
    '1h': { sv: '1 timme', en: '1 hour' },
    '1d': { sv: '1 dag', en: '1 day' },
    '1w': { sv: '1 vecka', en: '1 week' },
    '1m': { sv: '1 månad', en: '1 month' },
    '3m': { sv: '3 månader', en: '3 months' },
    '1y': { sv: '1 år', en: '1 year' },
    '5y': { sv: '5 år', en: '5 years' },
     '10y': { sv: '1 decennium', en: '1 decade' },
     '25y': { sv: '25 år', en: '25 years' },
     '50y': { sv: 'Halvsekel', en: 'Half century' },
     '100y': { sv: '1 sekel', en: '1 century' },
    'max': { sv: 'Max', en: 'Max' },
  };
  return formats[timeBase][language];
}

// =============================================================================
// OSCILLOSCOPE MODE UI CONFIGURATION
// =============================================================================

export const OSCILLOSCOPE_UI_CONFIG = {
  // Grid appearance
  grid: {
    major_divisions: 8,
    minor_divisions: 4,
    major_color: 'hsl(var(--border))',
    minor_color: 'hsl(var(--border) / 0.3)',
  },
  
  // Trace rendering
  trace: {
    line_width: 2,
    glow_enabled: true,
    glow_blur: 4,
    antialiasing: true,
  },
  
  // Noise floor visualization
  noise_floor: {
    fill_opacity: 0.15,
    border_style: 'dashed',
  },
  
  // Warning thresholds
  thresholds: {
    warning_color: '#f97316',
    critical_color: '#dc2626',
    line_style: 'dotted',
  },
  
  // Colors (clinical, no moral implications)
  channel_colors: [
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#10b981', // Emerald (used for neutral, not "good")
    '#6366f1', // Indigo
    '#f97316', // Orange
  ],
  
  // Typography
  typography: {
    label_font: 'font-mono',
    value_font: 'font-mono',
    label_size: 'text-xs',
    value_size: 'text-sm',
  },
};

/**
 * The Three Principles of Oscilloscope Mode
 * (Displayed in UI header)
 */
export const OSCILLOSCOPE_PRINCIPLES = {
  sv: [
    'Mäter verkliga signaler',
    'Visar dem utan tolkning',
    'Gör det omöjligt att ljuga',
  ],
  en: [
    'Measures real signals',
    'Displays without interpretation',
    'Makes lying impossible',
  ],
};
