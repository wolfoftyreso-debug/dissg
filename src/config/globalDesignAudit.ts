/**
 * GLOBAL DESIGN, UX & PRESENTATION AUDIT
 * 
 * "Institutional clarity, zero noise, infinite depth"
 * 
 * This is not a creative brief. This is a discipline prompt.
 * Run on entire system, individual views, or whenever adding something new.
 * 
 * Mantra: "Quiet, clear, verified, deep."
 */

// =============================================================================
// ROLE DEFINITION
// =============================================================================

export const PRINCIPAL_DESIGNER_ROLE = {
  title: 'Principal UX Architect, Information Designer & Systems Auditor',
  
  background: [
    'national government digital services',
    'telecom & infrastructure platforms',
    'financial dashboards (Avanza/Bloomberg class, but calmer)',
    'large-scale cartographic & data-visualization systems',
  ],
  
  allergic_to: [
    'visual noise',
    'decorative UI',
    'empty icons',
    'gamification',
    'opinionated design',
  ],
  
  task: 'Make the system inevitable, calm, precise and trustworthy.',
};

// =============================================================================
// OVERARCHING DESIGN PHILOSOPHY
// =============================================================================

export const DESIGN_PHILOSOPHY = {
  must_feel_like: 'This is where serious things are shown, carefully.',
  
  not: ['exciting', 'clever', 'impressive'],
  
  but: ['reasonable', 'restrained', 'complete'],
};

// =============================================================================
// 1. COLOR SYSTEM (GOVERNMENT BLUE - HARD RULES)
// =============================================================================

export const COLOR_SYSTEM = {
  base: {
    primary: 'Government blue (muted, non-saturated)',
    secondary: 'Neutral gray',
    background: {
      light: 'White / near-white',
      dark: 'Deep neutral dark',
      selection: 'user choice',
    },
  },
  
  accent: {
    yellow: {
      used_for: [
        'explanations',
        'clarifications',
        'what you are looking at',
        'AI summaries / catch-up boxes',
      ],
      never_for: [
        'alerts',
        'warnings',
        'urgency',
        'calls to action',
      ],
    },
  },
  
  forbidden: [
    'neon',
    'gradients',
    'emotion-driven colors',
    'red/green moral coding',
  ],
};

export function validateColorUsage(params: {
  color: string;
  usage: string;
}): { valid: boolean; reason?: string } {
  const { color, usage } = params;
  
  if (color === 'yellow') {
    const validUsages = COLOR_SYSTEM.accent.yellow.used_for;
    const invalidUsages = COLOR_SYSTEM.accent.yellow.never_for;
    
    if (invalidUsages.some(u => usage.toLowerCase().includes(u))) {
      return { valid: false, reason: `Yellow cannot be used for: ${usage}` };
    }
  }
  
  for (const forbidden of COLOR_SYSTEM.forbidden) {
    if (color.toLowerCase().includes(forbidden)) {
      return { valid: false, reason: `Forbidden color type: ${forbidden}` };
    }
  }
  
  return { valid: true };
}

// =============================================================================
// 2. ICONS & SYMBOLS (MINIMALISM)
// =============================================================================

export const ICON_RULES = {
  principle: 'If an icon does not reduce cognitive load, it must be removed.',
  
  allowed: [
    'arrows',
    'expand / collapse',
    'info (i)',
    'map layers',
    'filter indicators',
  ],
  
  forbidden: [
    'metaphors',
    'playful shapes',
    'abstract symbols',
    'cool icon sets',
  ],
  
  fallback: 'If text explains better → use text.',
};

export function validateIcon(iconName: string): { valid: boolean; reason?: string } {
  const isAllowed = ICON_RULES.allowed.some(a => 
    iconName.toLowerCase().includes(a.split(' ')[0])
  );
  
  const isForbidden = ICON_RULES.forbidden.some(f =>
    iconName.toLowerCase().includes(f.split(' ')[0])
  );
  
  if (isForbidden) {
    return { valid: false, reason: `Forbidden icon type: ${iconName}` };
  }
  
  return { valid: true };
}

// =============================================================================
// 3. MAPS & GEO-INTEGRATION (EXTREMELY IMPORTANT)
// =============================================================================

export const MAP_PRINCIPLES = {
  maps_must_be: ['quiet', 'slow', 'informative', 'never dominant'],
  
  defaults: {
    base_map: 'muted',
    satellite_view: false,
    animated_panning: false, // unless user initiated
    clustering: false, // must not hide data by default
  },
  
  interaction: {
    zoom_meaning: 'depth, not excitement',
    
    every_color_requires: [
      'legend',
      'units',
      'time scope',
    ],
    
    every_region_must_be: [
      'clickable',
      'drill-down capable',
      'reversible navigation',
    ],
  },
  
  should_answer: 'Where does this differ, and compared to what?',
  should_not_feel: 'Wow, look at this map.',
};

export interface MapValidation {
  hasLegend: boolean;
  hasUnits: boolean;
  hasTimeScope: boolean;
  regionsClickable: boolean;
  drillDownCapable: boolean;
  reversibleNavigation: boolean;
  isMuted: boolean;
  noAutoAnimation: boolean;
  valid: boolean;
  issues: string[];
}

export function validateMap(params: Omit<MapValidation, 'valid' | 'issues'>): MapValidation {
  const issues: string[] = [];
  
  if (!params.hasLegend) issues.push('Missing legend');
  if (!params.hasUnits) issues.push('Missing units');
  if (!params.hasTimeScope) issues.push('Missing time scope');
  if (!params.regionsClickable) issues.push('Regions not clickable');
  if (!params.drillDownCapable) issues.push('No drill-down capability');
  if (!params.reversibleNavigation) issues.push('Navigation not reversible');
  if (!params.isMuted) issues.push('Map not muted');
  if (!params.noAutoAnimation) issues.push('Contains auto-animation');
  
  return {
    ...params,
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 4. GRAPHS & VISUALIZATIONS
// =============================================================================

export const GRAPH_RULES = {
  fundamentals: [
    'One message per graph',
    'No stacked metaphors',
    'No visual tricks',
  ],
  
  animation: {
    allowed: ['soft fade-in', 'one-time motion'],
    forbidden: ['looping', 'bounce', 'attention-seeking'],
    timing_ms: { min: 150, max: 300 },
  },
  
  axes: {
    requirements: [
      'always visible',
      'always labeled',
      'always comparable across views',
    ],
  },
  
  scale_integrity: {
    rules: [
      'No misleading truncation',
      'Baselines visible',
      'Log scales clearly marked',
    ],
  },
};

export interface GraphValidation {
  graphId: string;
  singleMessage: boolean;
  noStackedMetaphors: boolean;
  noVisualTricks: boolean;
  softAnimation: boolean;
  noLooping: boolean;
  axesVisible: boolean;
  axesLabeled: boolean;
  baselineVisible: boolean;
  logScaleMarked: boolean | null; // null if not applicable
  valid: boolean;
  issues: string[];
}

export function validateGraph(params: Omit<GraphValidation, 'valid' | 'issues'>): GraphValidation {
  const issues: string[] = [];
  
  if (!params.singleMessage) issues.push('Graph conveys multiple messages');
  if (!params.noStackedMetaphors) issues.push('Contains stacked metaphors');
  if (!params.noVisualTricks) issues.push('Contains visual tricks');
  if (!params.softAnimation) issues.push('Animation not soft');
  if (!params.noLooping) issues.push('Contains looping animation');
  if (!params.axesVisible) issues.push('Axes not visible');
  if (!params.axesLabeled) issues.push('Axes not labeled');
  if (!params.baselineVisible) issues.push('Baseline not visible');
  if (params.logScaleMarked === false) issues.push('Log scale not marked');
  
  return {
    ...params,
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 5. CLICK DEPTH & NAVIGATION
// =============================================================================

export const NAVIGATION_RULES = {
  principle: 'Nothing is decorative. Everything leads somewhere.',
  
  every_element_must: [
    'open deeper data',
    'open methodology',
    'open explanation',
    'open limitations',
  ],
  
  if_none: 'delete it',
  
  breadcrumbs: {
    always_visible: true,
    always_logical: true,
    always_reversible: true,
  },
};

export type ClickDestination = 'deeper_data' | 'methodology' | 'explanation' | 'limitations' | 'none';

export function validateClickDestination(destination: ClickDestination): boolean {
  return destination !== 'none';
}

// =============================================================================
// 6. AI SUPPORT - PRESENTATION (VERY STRICT)
// =============================================================================

export const AI_PRESENTATION_RULES = {
  must_not: [
    'appear dynamically',
    'animate in front of user',
    'feel conversational',
  ],
  
  instead: [
    'pre-rendered',
    'presented in yellow explanation boxes',
    'clearly labeled: "AI-generated summary based on visible data"',
  ],
  
  ai_boxes_must: [
    'be dismissible',
    'be collapsible',
    'never block data',
  ],
  
  ai_may: [
    'summarize',
    'describe',
    'contextualize',
  ],
  
  ai_may_not: [
    'recommend',
    'judge',
    'prioritize',
    'persuade',
  ],
  
  mandatory_label: 'AI-generated summary based on visible data',
};

export function validateAIPresentation(params: {
  isPreRendered: boolean;
  hasYellowBox: boolean;
  hasLabel: boolean;
  isDismissible: boolean;
  isCollapsible: boolean;
  blocksData: boolean;
  containsRecommendation: boolean;
  containsJudgment: boolean;
}): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!params.isPreRendered) issues.push('AI output not pre-rendered');
  if (!params.hasYellowBox) issues.push('Missing yellow explanation box');
  if (!params.hasLabel) issues.push('Missing AI label');
  if (!params.isDismissible) issues.push('AI box not dismissible');
  if (!params.isCollapsible) issues.push('AI box not collapsible');
  if (params.blocksData) issues.push('AI box blocks data');
  if (params.containsRecommendation) issues.push('AI contains recommendation');
  if (params.containsJudgment) issues.push('AI contains judgment');
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 7. EXPLANATION & CATCH-UP SYSTEM
// =============================================================================

export const EXPLANATION_SYSTEM = {
  yellow_panels_for: [
    'What am I seeing?',
    'How is this calculated?',
    'What does this not show?',
    'Why might this look different than expected?',
  ],
  
  rules: [
    'calm language',
    'short sentences',
    'no adjectives',
    'no conclusions',
  ],
  
  always_include: [
    'source links',
    'time range',
    'limitations',
  ],
};

export interface ExplanationPanel {
  type: 'what_seeing' | 'how_calculated' | 'not_shown' | 'why_different';
  content: string;
  sourceLinks: string[];
  timeRange: { start: string; end: string };
  limitations: string[];
}

export function validateExplanationPanel(panel: ExplanationPanel): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!panel.sourceLinks?.length) issues.push('Missing source links');
  if (!panel.timeRange?.start || !panel.timeRange?.end) issues.push('Missing time range');
  if (!panel.limitations?.length) issues.push('Missing limitations');
  
  // Check for adjectives and conclusions (simplified)
  const conclusionPatterns = ['therefore', 'thus', 'clearly', 'obviously'];
  for (const pattern of conclusionPatterns) {
    if (panel.content.toLowerCase().includes(pattern)) {
      issues.push(`Contains conclusion language: "${pattern}"`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 8. EXPLORATION & CONFIGURATION
// =============================================================================

export const EXPLORATION_RULES = {
  users_can: [
    'adjust time ranges',
    'change comparison sets',
    'add/remove indicators',
    'save configurations (paid)',
  ],
  
  but: {
    defaults_are: 'conservative',
    complexity_is: 'opt-in',
    system_never: 'pushes exploration',
  },
};

// =============================================================================
// 9. VERIFICATION & TRUST
// =============================================================================

export const TRUST_INDICATORS = {
  every_view_must_show: [
    'sources',
    'update time',
    'coverage',
    'uncertainty',
  ],
  
  prefer: [
    'explicit numbers',
    'visible gaps',
    'honest "unknown"',
  ],
  
  over: [
    'smooth completeness',
    'filled holes',
    'implied certainty',
  ],
};

export interface TrustValidation {
  hasSources: boolean;
  hasUpdateTime: boolean;
  hasCoverage: boolean;
  hasUncertainty: boolean;
  showsGaps: boolean;
  usesUnknown: boolean;
  valid: boolean;
  issues: string[];
}

export function validateTrustIndicators(params: Omit<TrustValidation, 'valid' | 'issues'>): TrustValidation {
  const issues: string[] = [];
  
  if (!params.hasSources) issues.push('Missing sources');
  if (!params.hasUpdateTime) issues.push('Missing update time');
  if (!params.hasCoverage) issues.push('Missing coverage');
  if (!params.hasUncertainty) issues.push('Missing uncertainty');
  
  return {
    ...params,
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 10. CONSISTENCY AUDIT (RUN GLOBALLY)
// =============================================================================

export const CONSISTENCY_CHECKLIST = [
  'Same spacing?',
  'Same color usage?',
  'Same graph logic?',
  'Same language?',
  'Same AI presentation?',
  'Same map behavior?',
] as const;

export interface ConsistencyAudit {
  screenId: string;
  sameSpacing: boolean;
  sameColorUsage: boolean;
  sameGraphLogic: boolean;
  sameLanguage: boolean;
  sameAIPresentation: boolean;
  sameMapBehavior: boolean;
  consistent: boolean;
  inconsistencies: string[];
}

export function runConsistencyAudit(params: Omit<ConsistencyAudit, 'consistent' | 'inconsistencies'>): ConsistencyAudit {
  const inconsistencies: string[] = [];
  
  if (!params.sameSpacing) inconsistencies.push('Spacing inconsistent');
  if (!params.sameColorUsage) inconsistencies.push('Color usage inconsistent');
  if (!params.sameGraphLogic) inconsistencies.push('Graph logic inconsistent');
  if (!params.sameLanguage) inconsistencies.push('Language inconsistent');
  if (!params.sameAIPresentation) inconsistencies.push('AI presentation inconsistent');
  if (!params.sameMapBehavior) inconsistencies.push('Map behavior inconsistent');
  
  return {
    ...params,
    consistent: inconsistencies.length === 0,
    inconsistencies,
  };
}

// =============================================================================
// 11. MOBILE & APP EXPERIENCE
// =============================================================================

export const MOBILE_RULES = {
  must_feel: ['native', 'vertical', 'scrollable', 'calm'],
  
  include: [
    'timeline scrolling',
    'swipe between indicators',
    'yearly summaries (Year in review)',
  ],
  
  always: ['factual', 'neutral', 'non-celebratory'],
};

// =============================================================================
// 12. EMOTIONAL DAMPENING
// =============================================================================

export const EMOTIONAL_DAMPENING = {
  if_view_feels: ['heavy', 'overwhelming', 'too much'],
  
  then: [
    'surface explanations earlier',
    'reduce density',
    'slow transitions',
    'offer overview mode',
  ],
  
  principle: 'The system must cool, not amplify.',
};

// =============================================================================
// 13. FINAL DESIGN TEST
// =============================================================================

export const FINAL_DESIGN_TEST = {
  questions: [
    'Does this feel reasonable?',
    'Does this feel serious?',
    'Does this feel stable?',
    'Does this feel honest?',
    'Would this work unchanged in 10 years?',
  ],
  
  if_all_yes: 'approved',
};

export interface DesignApproval {
  viewId: string;
  reasonable: boolean;
  serious: boolean;
  stable: boolean;
  honest: boolean;
  works_in_10_years: boolean;
  approved: boolean;
}

export function evaluateDesign(params: Omit<DesignApproval, 'approved'>): DesignApproval {
  const approved = 
    params.reasonable &&
    params.serious &&
    params.stable &&
    params.honest &&
    params.works_in_10_years;
  
  return { ...params, approved };
}

// =============================================================================
// DESIGN MANTRA
// =============================================================================

export const DESIGN_MANTRA = {
  text: 'Quiet, clear, verified, deep.',
  
  words: ['quiet', 'clear', 'verified', 'deep'],
};

// =============================================================================
// COMPLETE DESIGN AUDIT PIPELINE
// =============================================================================

export interface FullDesignAudit {
  timestamp: string;
  viewId: string;
  colorValidation: { valid: boolean; issues: string[] };
  iconValidation: { valid: boolean; issues: string[] };
  mapValidation: MapValidation | null;
  graphValidation: GraphValidation | null;
  navigationValid: boolean;
  aiPresentationValid: { valid: boolean; issues: string[] };
  explanationsValid: { valid: boolean; issues: string[] };
  trustIndicatorsValid: TrustValidation;
  consistencyAudit: ConsistencyAudit;
  designApproval: DesignApproval;
  overallApproved: boolean;
  allIssues: string[];
}

export function runFullDesignAudit(params: {
  viewId: string;
  colors: { color: string; usage: string }[];
  icons: string[];
  map?: Omit<MapValidation, 'valid' | 'issues'>;
  graph?: Omit<GraphValidation, 'valid' | 'issues'>;
  clickDestinations: ClickDestination[];
  aiPresentation?: Parameters<typeof validateAIPresentation>[0];
  explanations?: ExplanationPanel[];
  trustIndicators: Omit<TrustValidation, 'valid' | 'issues'>;
  consistencyParams: Omit<ConsistencyAudit, 'consistent' | 'inconsistencies'>;
  designParams: Omit<DesignApproval, 'approved'>;
}): FullDesignAudit {
  const allIssues: string[] = [];
  
  // Color validation
  const colorIssues: string[] = [];
  for (const c of params.colors) {
    const result = validateColorUsage(c);
    if (!result.valid && result.reason) colorIssues.push(result.reason);
  }
  allIssues.push(...colorIssues);
  
  // Icon validation
  const iconIssues: string[] = [];
  for (const icon of params.icons) {
    const result = validateIcon(icon);
    if (!result.valid && result.reason) iconIssues.push(result.reason);
  }
  allIssues.push(...iconIssues);
  
  // Map validation
  const mapValidation = params.map ? validateMap(params.map) : null;
  if (mapValidation && !mapValidation.valid) {
    allIssues.push(...mapValidation.issues);
  }
  
  // Graph validation
  const graphValidation = params.graph ? validateGraph(params.graph) : null;
  if (graphValidation && !graphValidation.valid) {
    allIssues.push(...graphValidation.issues);
  }
  
  // Navigation validation
  const navigationValid = params.clickDestinations.every(validateClickDestination);
  if (!navigationValid) allIssues.push('Some elements have no valid click destination');
  
  // AI presentation validation
  const aiPresentationValid = params.aiPresentation 
    ? validateAIPresentation(params.aiPresentation)
    : { valid: true, issues: [] };
  allIssues.push(...aiPresentationValid.issues);
  
  // Explanation validation
  const explanationIssues: string[] = [];
  for (const exp of params.explanations || []) {
    const result = validateExplanationPanel(exp);
    explanationIssues.push(...result.issues);
  }
  allIssues.push(...explanationIssues);
  
  // Trust validation
  const trustIndicatorsValid = validateTrustIndicators(params.trustIndicators);
  allIssues.push(...trustIndicatorsValid.issues);
  
  // Consistency audit
  const consistencyAudit = runConsistencyAudit(params.consistencyParams);
  allIssues.push(...consistencyAudit.inconsistencies);
  
  // Design approval
  const designApproval = evaluateDesign(params.designParams);
  
  const overallApproved = allIssues.length === 0 && designApproval.approved;
  
  return {
    timestamp: new Date().toISOString(),
    viewId: params.viewId,
    colorValidation: { valid: colorIssues.length === 0, issues: colorIssues },
    iconValidation: { valid: iconIssues.length === 0, issues: iconIssues },
    mapValidation,
    graphValidation,
    navigationValid,
    aiPresentationValid,
    explanationsValid: { valid: explanationIssues.length === 0, issues: explanationIssues },
    trustIndicatorsValid,
    consistencyAudit,
    designApproval,
    overallApproved,
    allIssues,
  };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export const DESIGN_AUDIT_VERSION = '1.0.0';

export const DESIGN_AUDIT_SUMMARY = {
  role: PRINCIPAL_DESIGNER_ROLE,
  philosophy: DESIGN_PHILOSOPHY,
  color: COLOR_SYSTEM,
  icons: ICON_RULES,
  maps: MAP_PRINCIPLES,
  graphs: GRAPH_RULES,
  navigation: NAVIGATION_RULES,
  aiPresentation: AI_PRESENTATION_RULES,
  explanations: EXPLANATION_SYSTEM,
  exploration: EXPLORATION_RULES,
  trust: TRUST_INDICATORS,
  consistency: CONSISTENCY_CHECKLIST,
  mobile: MOBILE_RULES,
  dampening: EMOTIONAL_DAMPENING,
  finalTest: FINAL_DESIGN_TEST,
  mantra: DESIGN_MANTRA,
};
