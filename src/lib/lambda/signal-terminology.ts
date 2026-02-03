/**
 * SIGNAL TERMINOLOGY FOR SOCIETAL SYSTEMS
 * 
 * Formalisering av oscilloskop-terminologi översatt till samhällskontext.
 * Alla termer är tekniskt precisa, inte metaforiska.
 */

// =============================================================================
// SIGNAL TYPES
// =============================================================================

export type SignalType = 
  | 'amplitude'      // Styrka/magnitud av förändring
  | 'frequency'      // Hur ofta mönstret återkommer
  | 'phase'          // Tidsfördröjning mellan orsak och effekt
  | 'noise'          // Brus som döljer verklig signal
  | 'resonance'      // Förstärkning genom systemkoppling
  | 'damping'        // Dämpning/motverkande krafter
  | 'oscillation'    // Pendling kring jämvikt
  | 'drift'          // Långsam förändring av baseline
  | 'spike'          // Plötslig avvikelse
  | 'flatline';      // Ingen respons (död zon)

export type SignalQuality = 'strong' | 'moderate' | 'weak' | 'undetectable';

export interface SignalReading {
  type: SignalType;
  strength: number;           // 0-100
  quality: SignalQuality;
  noise_ratio: number;        // Signal-to-noise ratio (higher = cleaner)
  confidence: number;         // 0-1
  source_count: number;
  measurement_timestamp: string;
}

// =============================================================================
// SIGNAL DEFINITIONS IN SOCIETAL CONTEXT
// =============================================================================

export interface SignalDefinition {
  type: SignalType;
  technical_definition: string;
  societal_meaning_sv: string;
  societal_meaning_en: string;
  examples_sv: string[];
  examples_en: string[];
  measurement_indicators: string[];
  warning_threshold: number;  // When to flag as concerning
  critical_threshold: number; // When to flag as critical
}

export const SIGNAL_DEFINITIONS: Record<SignalType, SignalDefinition> = {
  amplitude: {
    type: 'amplitude',
    technical_definition: 'Peak-to-peak magnitude of signal variation',
    societal_meaning_sv: 'Styrkan i en förändring. Hur stor avvikelsen är från normalt tillstånd.',
    societal_meaning_en: 'The strength of a change. How large the deviation is from normal state.',
    examples_sv: [
      'BNP-förändring på +5% = hög amplitud',
      'Arbetslöshet ±0.2% = låg amplitud',
      'Bostadspriser +30% på ett år = extrem amplitud',
    ],
    examples_en: [
      'GDP change of +5% = high amplitude',
      'Unemployment ±0.2% = low amplitude',
      'Housing prices +30% in one year = extreme amplitude',
    ],
    measurement_indicators: ['kpi_change_percent', 'volatility', 'z_score'],
    warning_threshold: 2.0,  // Standard deviations
    critical_threshold: 3.5,
  },

  frequency: {
    type: 'frequency',
    technical_definition: 'Number of oscillations per time unit',
    societal_meaning_sv: 'Hur ofta ett mönster återkommer. Cykliskhet i systemet.',
    societal_meaning_en: 'How often a pattern recurs. Cyclicality in the system.',
    examples_sv: [
      'Konjunkturcykler (7-10 år)',
      'Säsongsvariation i arbetslöshet (årlig)',
      'Politiska cykler (4-åriga)',
    ],
    examples_en: [
      'Business cycles (7-10 years)',
      'Seasonal unemployment variation (annual)',
      'Political cycles (4-year)',
    ],
    measurement_indicators: ['cycle_length', 'periodicity', 'fourier_components'],
    warning_threshold: 0.5,   // Frequency doubling
    critical_threshold: 2.0,  // Chaotic frequency
  },

  phase: {
    type: 'phase',
    technical_definition: 'Time delay between correlated signals',
    societal_meaning_sv: 'Tidsfördröjning mellan handling och effekt. Hur lång tid innan en åtgärd syns i data.',
    societal_meaning_en: 'Time delay between action and effect. How long before an intervention shows in data.',
    examples_sv: [
      'Penningpolitik → Inflation: 12-18 månader',
      'Utbildningsinvestering → Produktivitet: 5-15 år',
      'Pandemiåtgärd → Smittspridning: 2-3 veckor',
    ],
    examples_en: [
      'Monetary policy → Inflation: 12-18 months',
      'Education investment → Productivity: 5-15 years',
      'Pandemic measures → Transmission: 2-3 weeks',
    ],
    measurement_indicators: ['lag_correlation', 'granger_causality', 'cross_correlation'],
    warning_threshold: 0.3,   // Phase uncertainty
    critical_threshold: 0.7,
  },

  noise: {
    type: 'noise',
    technical_definition: 'Random variation obscuring true signal',
    societal_meaning_sv: 'Brus som döljer verkliga mönster. Symbolpolitik, administrativ aktivitet utan effekt, mediabubblo.',
    societal_meaning_en: 'Noise obscuring real patterns. Symbolic policy, administrative activity without effect, media bubbles.',
    examples_sv: [
      'Pressmeddelanden utan åtföljande handling',
      'Omorganisationer som inte förändrar utfall',
      'KPI-mätningar som flukturer dagligen utan trend',
    ],
    examples_en: [
      'Press releases without accompanying action',
      'Reorganizations that don\'t change outcomes',
      'KPI measurements fluctuating daily without trend',
    ],
    measurement_indicators: ['variance_residual', 'entropy', 'random_walk_test'],
    warning_threshold: 0.5,   // Noise exceeds signal
    critical_threshold: 0.8,  // Signal buried in noise
  },

  resonance: {
    type: 'resonance',
    technical_definition: 'Amplification through system coupling',
    societal_meaning_sv: 'Förstärkning när system kopplas. En förändring i ett område förstärks genom andra.',
    societal_meaning_en: 'Amplification when systems couple. A change in one area amplified through others.',
    examples_sv: [
      'Finanskris → Arbetslöshet → Konsumtionsfall → Djupare kris',
      'Utbildning → Produktivitet → Löner → Skatteintäkter',
      'Bostadspriser → Byggaktivitet → Sysselsättning',
    ],
    examples_en: [
      'Financial crisis → Unemployment → Consumption drop → Deeper crisis',
      'Education → Productivity → Wages → Tax revenue',
      'Housing prices → Construction → Employment',
    ],
    measurement_indicators: ['cross_elasticity', 'multiplier_effect', 'system_correlation'],
    warning_threshold: 1.5,   // Moderate resonance
    critical_threshold: 3.0,  // Dangerous amplification
  },

  damping: {
    type: 'damping',
    technical_definition: 'Energy dissipation reducing oscillation',
    societal_meaning_sv: 'Dämpande krafter som stabiliserar systemet. Institutioner, regleringar, buffertar.',
    societal_meaning_en: 'Dampening forces stabilizing the system. Institutions, regulations, buffers.',
    examples_sv: [
      'Automatiska stabilisatorer (a-kassa)',
      'Centralbanksinterventioner',
      'Lagstiftning som begränsar spekulation',
    ],
    examples_en: [
      'Automatic stabilizers (unemployment insurance)',
      'Central bank interventions',
      'Legislation limiting speculation',
    ],
    measurement_indicators: ['decay_rate', 'stabilizer_effectiveness', 'shock_absorption'],
    warning_threshold: 0.3,   // Weak damping
    critical_threshold: 0.1,  // No damping (system can run away)
  },

  oscillation: {
    type: 'oscillation',
    technical_definition: 'Periodic variation around equilibrium',
    societal_meaning_sv: 'Pendling kring jämvikt. Naturlig variation som inte nödvändigtvis är problematisk.',
    societal_meaning_en: 'Swinging around equilibrium. Natural variation not necessarily problematic.',
    examples_sv: [
      'Normal konjunkturvariation',
      'Säsongsjusterad arbetslöshet',
      'Politisk pendel höger-vänster',
    ],
    examples_en: [
      'Normal business cycle variation',
      'Seasonally adjusted unemployment',
      'Political pendulum left-right',
    ],
    measurement_indicators: ['oscillation_amplitude', 'period_stability', 'mean_reversion'],
    warning_threshold: 2.0,   // Widening oscillation
    critical_threshold: 4.0,  // Unstable oscillation
  },

  drift: {
    type: 'drift',
    technical_definition: 'Slow secular change in baseline',
    societal_meaning_sv: 'Långsam förändring av grundnivån. Strukturella skiften som sker över decennier.',
    societal_meaning_en: 'Slow change in baseline. Structural shifts occurring over decades.',
    examples_sv: [
      'Demografisk förändring (åldrande befolkning)',
      'Produktivitetstillväxt (långsam nedgång sedan 1970)',
      'Klimatförändringar (temperaturtrend)',
    ],
    examples_en: [
      'Demographic change (aging population)',
      'Productivity growth (slow decline since 1970)',
      'Climate change (temperature trend)',
    ],
    measurement_indicators: ['trend_component', 'structural_break', 'long_term_average'],
    warning_threshold: 0.5,   // Accelerating drift
    critical_threshold: 1.0,  // Rapid structural change
  },

  spike: {
    type: 'spike',
    technical_definition: 'Sudden transient deviation',
    societal_meaning_sv: 'Plötslig avvikelse. Chock eller händelse som bryter normalt mönster.',
    societal_meaning_en: 'Sudden deviation. Shock or event breaking normal pattern.',
    examples_sv: [
      'Pandemiutbrott (mars 2020)',
      'Finanskris (september 2008)',
      'Naturkatastrof',
    ],
    examples_en: [
      'Pandemic outbreak (March 2020)',
      'Financial crisis (September 2008)',
      'Natural disaster',
    ],
    measurement_indicators: ['outlier_detection', 'changepoint_analysis', 'shock_magnitude'],
    warning_threshold: 3.0,   // Standard deviations
    critical_threshold: 5.0,
  },

  flatline: {
    type: 'flatline',
    technical_definition: 'Zero or minimal response to stimulus',
    societal_meaning_sv: 'Ingen respons. Död zon där systemet slutat reagera på åtgärder.',
    societal_meaning_en: 'No response. Dead zone where system stopped responding to interventions.',
    examples_sv: [
      'Likviditetsfälla (räntor på noll utan effekt)',
      'Strukturell arbetslöshet (utbildning hjälper inte)',
      'Politisk apati (valdeltagande faller oavsett)',
    ],
    examples_en: [
      'Liquidity trap (zero rates with no effect)',
      'Structural unemployment (education doesn\'t help)',
      'Political apathy (turnout falls regardless)',
    ],
    measurement_indicators: ['response_elasticity', 'intervention_effectiveness', 'correlation_decay'],
    warning_threshold: 0.2,   // Weak response
    critical_threshold: 0.05, // Effectively dead
  },
};

// =============================================================================
// SIGNAL ANALYSIS FUNCTIONS
// =============================================================================

/**
 * Classify signal quality based on noise ratio
 */
export function classifySignalQuality(noiseRatio: number): SignalQuality {
  if (noiseRatio >= 10) return 'strong';
  if (noiseRatio >= 3) return 'moderate';
  if (noiseRatio >= 1) return 'weak';
  return 'undetectable';
}

/**
 * Assess signal health against thresholds
 */
export function assessSignalHealth(
  signalType: SignalType,
  value: number
): { status: 'normal' | 'warning' | 'critical'; message_sv: string; message_en: string } {
  const def = SIGNAL_DEFINITIONS[signalType];
  
  if (value >= def.critical_threshold) {
    return {
      status: 'critical',
      message_sv: `Kritisk nivå för ${signalType}`,
      message_en: `Critical level for ${signalType}`,
    };
  }
  
  if (value >= def.warning_threshold) {
    return {
      status: 'warning',
      message_sv: `Förhöjd nivå för ${signalType}`,
      message_en: `Elevated level for ${signalType}`,
    };
  }
  
  return {
    status: 'normal',
    message_sv: `Normal nivå för ${signalType}`,
    message_en: `Normal level for ${signalType}`,
  };
}

/**
 * Calculate overall system signal clarity
 */
export function calculateSystemClarity(readings: SignalReading[]): {
  overall_clarity: number;
  dominant_noise_sources: SignalType[];
  cleanest_signals: SignalType[];
} {
  const noiseReadings = readings.filter(r => r.type === 'noise');
  const avgNoiseRatio = readings.reduce((sum, r) => sum + r.noise_ratio, 0) / readings.length;
  
  // Find problematic signals (high noise)
  const noisySorted = readings.sort((a, b) => a.noise_ratio - b.noise_ratio);
  const dominant_noise_sources = noisySorted.slice(0, 3).map(r => r.type);
  
  // Find cleanest signals
  const cleanSorted = readings.sort((a, b) => b.noise_ratio - a.noise_ratio);
  const cleanest_signals = cleanSorted.slice(0, 3).map(r => r.type);
  
  return {
    overall_clarity: Math.min(100, avgNoiseRatio * 10),
    dominant_noise_sources,
    cleanest_signals,
  };
}
