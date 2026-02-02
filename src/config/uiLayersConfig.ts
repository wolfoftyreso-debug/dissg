/**
 * BLOCK AL — GLOBAL UI STATES & LAYERS
 * Configuration for progressive disclosure UI system
 */

// AL1: UI Layers
export interface UILayerConfig {
  code: 'overview' | 'focus' | 'explore' | 'build' | 'simulate' | 'api';
  name: string;
  description: string;
  icon: string;
  features: string[];
  complexity: 1 | 2 | 3 | 4 | 5;
  requiredTier: 'public' | 'pro' | 'enterprise';
  defaultForNewUsers: boolean;
  transitionsTo: string[]; // Which layers can be reached from here
}

export const UI_LAYERS: UILayerConfig[] = [
  {
    code: 'overview',
    name: 'Översikt',
    description: 'Snabb sammanfattning av systemets tillstånd',
    icon: 'LayoutDashboard',
    features: [
      'Huvudindikatorer',
      'Toppförändringar',
      'Systemstatus',
      'Snabblänkar till djupare analys'
    ],
    complexity: 1,
    requiredTier: 'public',
    defaultForNewUsers: true,
    transitionsTo: ['focus', 'explore']
  },
  {
    code: 'focus',
    name: 'Fokus',
    description: 'Relevanta data baserat på roll och preferenser',
    icon: 'Target',
    features: [
      'Rollbaserad filtrering',
      'Personliga favoriter',
      'Prioriterade beslut',
      'Relevansrangordning'
    ],
    complexity: 2,
    requiredTier: 'public',
    defaultForNewUsers: false,
    transitionsTo: ['overview', 'explore', 'build']
  },
  {
    code: 'explore',
    name: 'Utforska',
    description: 'Djupdyk i data och relationer',
    icon: 'Search',
    features: [
      'Korrelationsanalys',
      'Historisk jämförelse',
      'Regionala nedbrytningar',
      'Kunskapsgraf-navigering'
    ],
    complexity: 3,
    requiredTier: 'public',
    defaultForNewUsers: false,
    transitionsTo: ['focus', 'build', 'simulate']
  },
  {
    code: 'build',
    name: 'Bygg',
    description: 'Skapa egna vyer och analyser',
    icon: 'Wrench',
    features: [
      'Anpassade dashboards',
      'Egna index',
      'Sparade filter',
      'Exportpaket'
    ],
    complexity: 4,
    requiredTier: 'pro',
    defaultForNewUsers: false,
    transitionsTo: ['explore', 'simulate', 'api']
  },
  {
    code: 'simulate',
    name: 'Simulera',
    description: 'Testa scenarier och prognoser',
    icon: 'FlaskConical',
    features: [
      'KPI-känslighet',
      'Scenariojämförelse',
      'Stresstester',
      'Fördröjningseffekter'
    ],
    complexity: 4,
    requiredTier: 'pro',
    defaultForNewUsers: false,
    transitionsTo: ['explore', 'build', 'api']
  },
  {
    code: 'api',
    name: 'API',
    description: 'Programmatisk åtkomst och automation',
    icon: 'Code',
    features: [
      'REST API-åtkomst',
      'Webhooks',
      'Bulk-export',
      'Automatiserade feeds'
    ],
    complexity: 5,
    requiredTier: 'pro',
    defaultForNewUsers: false,
    transitionsTo: ['build', 'simulate']
  }
];

// Progressive Disclosure Rules
export interface DisclosureRule {
  id: string;
  name: string;
  description: string;
  triggerCondition: 'time_spent' | 'feature_used' | 'complexity_requested' | 'explicit_request';
  threshold: number | string;
  suggestedLayer: string;
  message: string;
}

export const DISCLOSURE_RULES: DisclosureRule[] = [
  {
    id: 'time_on_overview',
    name: 'Tid på översikt',
    description: 'Användare har tillbringat mycket tid på översikten',
    triggerCondition: 'time_spent',
    threshold: 300, // 5 minutes
    suggestedLayer: 'focus',
    message: 'Vill du se data som är mest relevant för din roll?'
  },
  {
    id: 'correlation_interest',
    name: 'Korrelationsintresse',
    description: 'Användare har klickat på korrelationsdata',
    triggerCondition: 'feature_used',
    threshold: 'correlation_click',
    suggestedLayer: 'explore',
    message: 'Det finns mer att utforska - vill du gå djupare?'
  },
  {
    id: 'repeated_filter',
    name: 'Upprepade filter',
    description: 'Användare filtrerar ofta på samma sätt',
    triggerCondition: 'feature_used',
    threshold: 'filter_repeated_3x',
    suggestedLayer: 'build',
    message: 'Spara dina filter som en anpassad vy?'
  },
  {
    id: 'what_if_question',
    name: '"Vad händer om"-fråga',
    description: 'Användare ställer hypotetiska frågor',
    triggerCondition: 'complexity_requested',
    threshold: 'scenario_question',
    suggestedLayer: 'simulate',
    message: 'Testa ditt scenario med simuleringsverktyget'
  }
];

// Layer Transition Animations
export const LAYER_TRANSITIONS = {
  overview_to_focus: 'slide-right',
  overview_to_explore: 'zoom-in',
  focus_to_explore: 'slide-right',
  explore_to_build: 'slide-up',
  explore_to_simulate: 'fade',
  build_to_api: 'slide-right'
} as const;

// Complexity Indicators
export const COMPLEXITY_LABELS = {
  1: { label: 'Enkel', description: 'Perfekt för att komma igång' },
  2: { label: 'Standard', description: 'Vanliga funktioner' },
  3: { label: 'Avancerad', description: 'Mer djupgående analys' },
  4: { label: 'Expert', description: 'Kraftfulla verktyg' },
  5: { label: 'Utvecklare', description: 'Programmatisk åtkomst' }
} as const;

// Helper functions
export function getLayerConfig(code: string): UILayerConfig | undefined {
  return UI_LAYERS.find(l => l.code === code);
}

export function getNextSuggestedLayer(
  currentLayer: string,
  userActions: { type: string; count: number }[]
): UILayerConfig | null {
  const current = getLayerConfig(currentLayer);
  if (!current) return null;
  
  // Check disclosure rules
  for (const rule of DISCLOSURE_RULES) {
    if (current.transitionsTo.includes(rule.suggestedLayer)) {
      const action = userActions.find(a => a.type === rule.threshold);
      if (action && action.count >= 3) {
        return getLayerConfig(rule.suggestedLayer) || null;
      }
    }
  }
  
  return null;
}

export function canAccessLayer(
  layer: UILayerConfig,
  userTier: 'public' | 'pro' | 'enterprise'
): boolean {
  const tierHierarchy = { public: 0, pro: 1, enterprise: 2 };
  return tierHierarchy[userTier] >= tierHierarchy[layer.requiredTier];
}

export function getAvailableLayers(userTier: 'public' | 'pro' | 'enterprise'): UILayerConfig[] {
  return UI_LAYERS.filter(layer => canAccessLayer(layer, userTier));
}
