/**
 * LAMBDA VISUALIZATION RULES
 * 
 * "No moral colors. No judgment. Only measurement."
 * 
 * Strict rules for displaying Lambda without bias, manipulation, or emotional loading.
 */

// =============================================================================
// COLOR PHILOSOPHY
// =============================================================================

/**
 * FORBIDDEN PATTERNS:
 * - Red/Green for good/bad (moral judgment)
 * - Traffic light metaphors (implies action)
 * - Emoji or emotional indicators
 * - Pulsing/flashing for "urgency" (manufactured stress)
 * 
 * ALLOWED PATTERNS:
 * - Clinical blues/grays (neutral observation)
 * - Orange for warning (physical, not moral)
 * - Purple for stress zones (engineering term)
 * - Gradient intensity for magnitude only
 */

export const LAMBDA_COLOR_SYSTEM = {
  // Zone colors - CLINICAL, NOT MORAL
  zones: {
    CRITICAL_LOW: {
      primary: 'hsl(350, 65%, 45%)',      // Deep red-violet (cold, inefficient)
      background: 'hsl(350, 65%, 95%)',
      label: { sv: 'Kritiskt låg', en: 'Critical Low' },
    },
    LOW: {
      primary: 'hsl(30, 70%, 50%)',        // Orange (warning, not danger)
      background: 'hsl(30, 70%, 95%)',
      label: { sv: 'Låg', en: 'Low' },
    },
    OPTIMAL: {
      primary: 'hsl(210, 60%, 50%)',       // Blue (clinical, neutral)
      background: 'hsl(210, 60%, 95%)',
      label: { sv: 'Optimal', en: 'Optimal' },
    },
    HIGH: {
      primary: 'hsl(280, 60%, 55%)',       // Purple (stress indicator)
      background: 'hsl(280, 60%, 95%)',
      label: { sv: 'Hög', en: 'High' },
    },
    CRITICAL_HIGH: {
      primary: 'hsl(300, 70%, 40%)',       // Deep violet (extreme stress)
      background: 'hsl(300, 70%, 95%)',
      label: { sv: 'Kritiskt hög', en: 'Critical High' },
    },
  },
  
  // NEVER USE these colors for Lambda
  forbidden: [
    'green',           // Implies "good"
    'red',             // Implies "bad" (except as zone marker)
    'gold/yellow',     // Implies "caution" in traffic metaphor
  ],
  
  // Neutral palette for general UI
  neutral: {
    text: 'hsl(220, 10%, 20%)',
    textMuted: 'hsl(220, 10%, 50%)',
    border: 'hsl(220, 10%, 85%)',
    background: 'hsl(220, 10%, 98%)',
  },
};

// =============================================================================
// VISUALIZATION RULES
// =============================================================================

export const VISUALIZATION_RULES = {
  // MANDATORY: Every Lambda display MUST include
  mandatory: [
    {
      element: 'uncertainty_interval',
      description: { 
        sv: 'Osäkerhetsintervall måste alltid visas (±)', 
        en: 'Uncertainty interval must always be shown (±)' 
      },
    },
    {
      element: 'calculation_timestamp',
      description: { 
        sv: 'Tidpunkt för beräkning måste visas', 
        en: 'Calculation timestamp must be shown' 
      },
    },
    {
      element: 'data_version',
      description: { 
        sv: 'Metodversion måste anges', 
        en: 'Methodology version must be stated' 
      },
    },
    {
      element: 'how_calculated_link',
      description: { 
        sv: 'Klickbar länk till beräkningsmetod', 
        en: 'Clickable link to calculation method' 
      },
    },
  ],
  
  // FORBIDDEN: Never display Lambda this way
  forbidden: [
    {
      pattern: 'isolated_number',
      reason: { 
        sv: 'Lambda får aldrig visas ensamt utan kontext', 
        en: 'Lambda may never be shown alone without context' 
      },
    },
    {
      pattern: 'moral_color_coding',
      reason: { 
        sv: 'Inga röd/grön för bra/dåligt', 
        en: 'No red/green for good/bad' 
      },
    },
    {
      pattern: 'animated_urgency',
      reason: { 
        sv: 'Inga pulserande varningar eller blinkande element', 
        en: 'No pulsing warnings or flashing elements' 
      },
    },
    {
      pattern: 'comparison_ranking',
      reason: { 
        sv: 'Inga "bättre/sämre än" jämförelser', 
        en: 'No "better/worse than" comparisons' 
      },
    },
    {
      pattern: 'future_projection',
      reason: { 
        sv: 'Inga prognoser eller förutsägelser', 
        en: 'No projections or predictions' 
      },
    },
  ],
};

// =============================================================================
// GAUGE SPECIFICATION
// =============================================================================

export const GAUGE_SPECIFICATION = {
  // Display range
  range: { min: 0.70, max: 1.30 },
  
  // Optimal zone (highlighted)
  optimal_zone: { min: 0.95, max: 1.05 },
  
  // Scale divisions
  major_divisions: [0.80, 0.90, 1.00, 1.10, 1.20],
  minor_divisions: 0.05,
  
  // Needle/indicator style
  indicator: {
    type: 'bar', // Not needle (less dramatic)
    width: 'thick',
    animate: false, // No dramatic animations
  },
  
  // Zone markers (not labels like "DANGER")
  zone_markers: {
    show_lines: true,
    show_labels: false, // Zone labels shown elsewhere, not on gauge
    line_style: 'dashed',
  },
  
  // Uncertainty display
  uncertainty_band: {
    show: true,
    opacity: 0.3,
    style: 'gradient_fade',
  },
};

// =============================================================================
// CHART TYPES ALLOWED/FORBIDDEN
// =============================================================================

export const CHART_RULES = {
  allowed: [
    {
      type: 'horizontal_bar',
      use_case: 'Parameter breakdown, sensor contributions',
    },
    {
      type: 'line_time_series',
      use_case: 'Lambda over time (with uncertainty band)',
    },
    {
      type: 'parallel_bars',
      use_case: 'Comparing same metric across periods',
    },
    {
      type: 'box_plot',
      use_case: 'Distribution and uncertainty visualization',
    },
  ],
  
  forbidden: [
    {
      type: 'spider_radar',
      reason: 'Distorts perception of magnitude, enables cherry-picking',
    },
    {
      type: 'pie_donut',
      reason: 'Poor for comparison, invites misinterpretation',
    },
    {
      type: '3d_charts',
      reason: 'Perspective distorts values',
    },
    {
      type: 'stacked_area',
      reason: 'Obscures individual component values',
    },
    {
      type: 'bubble_chart',
      reason: 'Size perception is unreliable',
    },
  ],
};

// =============================================================================
// TEXT/LABEL RULES
// =============================================================================

export const LABEL_RULES = {
  // Allowed language patterns
  allowed: [
    'observed', 'measured', 'calculated', 'recorded',
    'deviation', 'distance from', 'differs by',
    'increased', 'decreased', 'unchanged',
  ],
  
  // Forbidden language patterns
  forbidden: [
    'good', 'bad', 'better', 'worse', 'best', 'worst',
    'success', 'failure', 'crisis', 'disaster',
    'should', 'must', 'needs to', 'has to',
    'caused', 'led to', 'resulted in',
    'will', 'expect', 'predict', 'forecast',
  ],
  
  // Template for deviation labels
  deviation_template: {
    sv: 'λ = {value} (±{uncertainty}) – {distance}% från balans',
    en: 'λ = {value} (±{uncertainty}) – {distance}% from balance',
  },
};

// =============================================================================
// ANTI-MANIPULATION SAFEGUARDS
// =============================================================================

export const ANTI_MANIPULATION = {
  // Time window restrictions
  time_windows: {
    allowed: ['1Y', '3Y', '5Y', '10Y', '20Y'],
    default: '5Y',
    custom_range: false, // Prevent cherry-picking dates
  },
  
  // Scale restrictions
  scale: {
    auto_scale: false, // Prevent exaggeration via scale manipulation
    fixed_range: { min: 0.70, max: 1.30 },
    zero_baseline: true,
  },
  
  // Partial view prevention
  partial_view_allowed: false, // Must show all parameters, not selection
  
  // Verification
  verification: {
    content_hash: true,       // Every view has verifiable hash
    qr_code: true,           // Links to original data
    screenshot_watermark: true, // Prevents deceptive screenshots
  },
};

export const VISUALIZATION_DOCTRINE = {
  sv: 'Visualisering är infrastruktur, inte media. Den ska möjliggöra förståelse, inte skapa affekt.',
  en: 'Visualization is infrastructure, not media. It should enable understanding, not create affect.',
};
