/**
 * DESIGN SYSTEM TOKENS — APPLE + NASA + MYNDIGHET
 * Block T: Design Lead
 * 
 * Visual language for Global Infinity System.
 * Nothing should look "BI". Everything institutional, precise, trustworthy.
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const COLORS = {
  // Core Brand Colors
  primary: {
    deep: 'hsl(220, 26%, 14%)',      // Near-black institutional
    default: 'hsl(220, 20%, 22%)',   // Dark charcoal
    muted: 'hsl(220, 15%, 35%)',     // Muted slate
    subtle: 'hsl(220, 12%, 55%)',    // Light slate
    faint: 'hsl(220, 10%, 85%)',     // Very light
    surface: 'hsl(220, 8%, 96%)',    // Background surface
    white: 'hsl(0, 0%, 100%)',       // Pure white
  },
  
  // Semantic Colors (Status)
  signal: {
    positive: 'hsl(152, 60%, 42%)',     // Growth/improvement
    positiveSubtle: 'hsl(152, 50%, 92%)',
    negative: 'hsl(0, 65%, 50%)',       // Decline/concern
    negativeSubtle: 'hsl(0, 60%, 94%)',
    neutral: 'hsl(220, 10%, 60%)',      // Stable/unchanged
    neutralSubtle: 'hsl(220, 8%, 94%)',
    warning: 'hsl(38, 92%, 50%)',       // Attention needed
    warningSubtle: 'hsl(38, 90%, 94%)',
    unknown: 'hsl(220, 5%, 70%)',       // Insufficient data
  },
  
  // Confidence Gradient
  confidence: {
    high: 'hsl(220, 26%, 14%)',      // Full opacity
    medium: 'hsl(220, 20%, 14%, 0.7)',
    low: 'hsl(220, 15%, 14%, 0.4)',
    veryLow: 'hsl(220, 10%, 14%, 0.2)',
  },
  
  // Chart Palette (12 distinct, colorblind-safe)
  chart: {
    series01: 'hsl(220, 70%, 50%)',   // Primary blue
    series02: 'hsl(152, 60%, 42%)',   // Green
    series03: 'hsl(280, 65%, 55%)',   // Purple
    series04: 'hsl(38, 85%, 50%)',    // Orange
    series05: 'hsl(340, 70%, 55%)',   // Pink
    series06: 'hsl(180, 55%, 45%)',   // Teal
    series07: 'hsl(60, 65%, 45%)',    // Yellow
    series08: 'hsl(200, 70%, 55%)',   // Sky
    series09: 'hsl(0, 70%, 55%)',     // Red
    series10: 'hsl(120, 50%, 45%)',   // Forest
    series11: 'hsl(260, 60%, 60%)',   // Lavender
    series12: 'hsl(20, 75%, 55%)',    // Coral
  },
  
  // Dark Mode Variants
  dark: {
    background: 'hsl(220, 26%, 8%)',
    surface: 'hsl(220, 22%, 12%)',
    surfaceElevated: 'hsl(220, 20%, 16%)',
    border: 'hsl(220, 15%, 22%)',
    textPrimary: 'hsl(220, 8%, 95%)',
    textSecondary: 'hsl(220, 10%, 70%)',
    textMuted: 'hsl(220, 8%, 50%)',
  },
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    display: '"SF Pro Display", "Inter", system-ui, sans-serif',
    body: '"SF Pro Text", "Inter", system-ui, sans-serif',
    mono: '"SF Mono", "JetBrains Mono", monospace',
    data: '"Tabular Figures", "SF Pro Text", monospace', // For numbers
  },
  
  // Font Sizes (rem-based for accessibility)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    data: '2rem',       // Large numbers
    dataLarge: '3.5rem', // Hero numbers
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const SPACING = {
  // Base scale (4px increments)
  0: '0',
  px: '1px',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem',       // 384px
} as const;

// ============================================================================
// MOTION TOKENS
// ============================================================================

export const MOTION = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '700ms',
    page: '400ms',
  },
  
  // Easing Functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Apple-style spring
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Animation Presets
  animation: {
    fadeIn: 'fadeIn 200ms ease-out',
    fadeOut: 'fadeOut 200ms ease-in',
    slideUp: 'slideUp 300ms ease-out',
    slideDown: 'slideDown 300ms ease-out',
    scaleIn: 'scaleIn 200ms ease-out',
    pulse: 'pulse 2s ease-in-out infinite',
    shimmer: 'shimmer 2s linear infinite',
  },
} as const;

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Elevated cards
  card: '0 2px 8px -2px rgb(0 0 0 / 0.08), 0 4px 16px -4px rgb(0 0 0 / 0.06)',
  cardHover: '0 4px 12px -2px rgb(0 0 0 / 0.12), 0 8px 24px -4px rgb(0 0 0 / 0.08)',
} as const;

// ============================================================================
// BORDER TOKENS
// ============================================================================

export const BORDERS = {
  // Border Width
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
  
  // Border Radius
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
} as const;

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================

export const Z_INDEX = {
  auto: 'auto',
  base: '0',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modalBackdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
  toast: '1080',
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
} as const;

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const COMPONENTS = {
  // Cards
  card: {
    padding: SPACING[6],
    paddingCompact: SPACING[4],
    borderRadius: BORDERS.radius.xl,
    shadow: SHADOWS.card,
    shadowHover: SHADOWS.cardHover,
    background: COLORS.primary.white,
    backgroundDark: COLORS.dark.surface,
  },
  
  // Charts
  chart: {
    height: {
      sm: '200px',
      md: '300px',
      lg: '400px',
      xl: '500px',
    },
    gridColor: COLORS.primary.faint,
    axisColor: COLORS.primary.subtle,
    labelColor: COLORS.primary.muted,
    strokeWidth: {
      thin: 1.5,
      normal: 2,
      thick: 3,
    },
    dotRadius: {
      sm: 3,
      md: 4,
      lg: 6,
    },
  },
  
  // Data Display
  dataDisplay: {
    valueSize: TYPOGRAPHY.fontSize.dataLarge,
    labelSize: TYPOGRAPHY.fontSize.sm,
    unitSize: TYPOGRAPHY.fontSize.base,
    spacing: SPACING[2],
  },
  
  // Navigation
  nav: {
    height: '64px',
    heightMobile: '56px',
    background: COLORS.primary.white,
    backgroundDark: COLORS.dark.surface,
    shadow: SHADOWS.sm,
  },
  
  // Sidebar
  sidebar: {
    width: '280px',
    widthCollapsed: '64px',
    background: COLORS.primary.surface,
    backgroundDark: COLORS.dark.surface,
  },
  
  // Buttons
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    padding: {
      sm: SPACING[3],
      md: SPACING[4],
      lg: SPACING[6],
    },
    borderRadius: BORDERS.radius.lg,
  },
  
  // Inputs
  input: {
    height: '40px',
    padding: SPACING[3],
    borderRadius: BORDERS.radius.lg,
    borderColor: COLORS.primary.faint,
    focusColor: COLORS.chart.series01,
  },
  
  // Tooltips
  tooltip: {
    padding: `${SPACING[2]} ${SPACING[3]}`,
    borderRadius: BORDERS.radius.md,
    background: COLORS.primary.deep,
    color: COLORS.primary.white,
    maxWidth: '320px',
  },
  
  // Badges
  badge: {
    padding: `${SPACING[0.5]} ${SPACING[2]}`,
    borderRadius: BORDERS.radius.full,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
} as const;

// ============================================================================
// CSS VARIABLE GENERATOR
// ============================================================================

export function generateCSSVariables(): string {
  return `
:root {
  /* Primary Colors */
  --color-primary-deep: ${COLORS.primary.deep};
  --color-primary-default: ${COLORS.primary.default};
  --color-primary-muted: ${COLORS.primary.muted};
  --color-primary-subtle: ${COLORS.primary.subtle};
  --color-primary-faint: ${COLORS.primary.faint};
  --color-primary-surface: ${COLORS.primary.surface};
  --color-primary-white: ${COLORS.primary.white};
  
  /* Signal Colors */
  --color-signal-positive: ${COLORS.signal.positive};
  --color-signal-negative: ${COLORS.signal.negative};
  --color-signal-neutral: ${COLORS.signal.neutral};
  --color-signal-warning: ${COLORS.signal.warning};
  --color-signal-unknown: ${COLORS.signal.unknown};
  
  /* Typography */
  --font-display: ${TYPOGRAPHY.fontFamily.display};
  --font-body: ${TYPOGRAPHY.fontFamily.body};
  --font-mono: ${TYPOGRAPHY.fontFamily.mono};
  
  /* Motion */
  --duration-fast: ${MOTION.duration.fast};
  --duration-normal: ${MOTION.duration.normal};
  --duration-slow: ${MOTION.duration.slow};
  --easing-spring: ${MOTION.easing.spring};
  
  /* Shadows */
  --shadow-card: ${SHADOWS.card};
  --shadow-card-hover: ${SHADOWS.cardHover};
  
  /* Borders */
  --radius-lg: ${BORDERS.radius.lg};
  --radius-xl: ${BORDERS.radius.xl};
}

.dark {
  --color-background: ${COLORS.dark.background};
  --color-surface: ${COLORS.dark.surface};
  --color-surface-elevated: ${COLORS.dark.surfaceElevated};
  --color-border: ${COLORS.dark.border};
  --color-text-primary: ${COLORS.dark.textPrimary};
  --color-text-secondary: ${COLORS.dark.textSecondary};
  --color-text-muted: ${COLORS.dark.textMuted};
}
`;
}

export type ColorToken = typeof COLORS;
export type TypographyToken = typeof TYPOGRAPHY;
export type SpacingToken = typeof SPACING;
export type MotionToken = typeof MOTION;
