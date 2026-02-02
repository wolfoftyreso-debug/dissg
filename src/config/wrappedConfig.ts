// Wrapped Engine Configuration - Visual & behavioral rules

import type { WrappedScope, WrappedTheme, ComparisonType } from '@/types/wrapped';

// Scope labels
export const SCOPE_LABELS: Record<WrappedScope, { sv: string; en: string }> = {
  world: { sv: 'Världen', en: 'World' },
  region: { sv: 'Region', en: 'Region' },
  country: { sv: 'Land', en: 'Country' },
  city: { sv: 'Stad', en: 'City' },
  municipality: { sv: 'Kommun', en: 'Municipality' },
  custom: { sv: 'Anpassat urval', en: 'Custom selection' },
};

// Theme labels
export const THEME_LABELS: Record<WrappedTheme, { sv: string; en: string; icon: string }> = {
  economy: { sv: 'Ekonomi', en: 'Economy', icon: '📊' },
  health: { sv: 'Hälsa', en: 'Health', icon: '🏥' },
  employment: { sv: 'Arbete', en: 'Employment', icon: '💼' },
  energy: { sv: 'Energi', en: 'Energy', icon: '⚡' },
  demographics: { sv: 'Demografi', en: 'Demographics', icon: '👥' },
  education: { sv: 'Utbildning', en: 'Education', icon: '📚' },
  infrastructure: { sv: 'Infrastruktur', en: 'Infrastructure', icon: '🏗️' },
  social_stability: { sv: 'Social stabilitet', en: 'Social Stability', icon: '🤝' },
};

// Comparison type labels
export const COMPARISON_LABELS: Record<ComparisonType, { sv: string; en: string }> = {
  previous_year: { sv: 'Föregående år', en: 'Previous year' },
  previous_period: { sv: 'Föregående period', en: 'Previous period' },
  regional_average: { sv: 'Regionalt genomsnitt', en: 'Regional average' },
  national_average: { sv: 'Nationellt genomsnitt', en: 'National average' },
  global_average: { sv: 'Globalt genomsnitt', en: 'Global average' },
  peer_group: { sv: 'Jämförelsegrupp', en: 'Peer group' },
};

// Visual style configuration
export const WRAPPED_STYLE = {
  // Animation timings (in ms)
  stepTransitionDuration: 600,
  elementFadeInDelay: 100,
  chartAnimationDuration: 800,
  
  // Change thresholds
  significantChangePercent: 5, // Above this is "significant"
  minorChangePercent: 1, // Below this is "stable"
  
  // Colors use CSS variables - no direct colors here
  // Positive changes use chart-2 (subtle green accent)
  // Negative changes use chart-5 (subtle amber/warning)
  // Neutral uses muted-foreground
  
  // Typography hierarchy
  headingSize: 'text-2xl font-semibold',
  subheadingSize: 'text-lg font-medium',
  bodySize: 'text-base',
  captionSize: 'text-sm text-muted-foreground',
  
  // Forbidden elements (for validation)
  forbiddenWords: [
    'fantastiskt', 'succé', 'stort steg', 'amazing', 'incredible',
    'breakthrough', 'celebration', 'proud', 'stolt', 'firande'
  ],
  
  // Required disclaimers
  correlationDisclaimer: 'Korrelation innebär inte orsakssamband',
  projectionDisclaimer: 'Historiska data säger inget om framtiden',
  aiDisclaimer: 'Systemgenererad sammanfattning',
} as const;

// Demo mode restrictions
export const DEMO_MODE = {
  canGenerate: true,
  canView: true,
  canSave: false,
  canShare: false,
  canExport: false,
  canAutomate: false,
  watermarkText: 'DEMO – Begränsad funktionalitet',
} as const;

// Quality control checklist
export const QUALITY_CHECKS = [
  { id: 'understandable', label: 'Kan förstås utan bakgrund' },
  { id: 'non_political', label: 'Går inte att feltolka politiskt' },
  { id: 'clickable', label: 'Varje steg går att klicka upp' },
  { id: 'limitations_visible', label: 'Begränsningar alltid synliga' },
] as const;

// Default Swedish geo IDs for demo
export const DEMO_GEO_IDS = {
  sweden: 'SE',
  stockholm: 'SE-AB',
  gothenburg: 'SE-O',
  malmo: 'SE-M',
} as const;
