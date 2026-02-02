/**
 * WAVE 15 — BLOCK DW, DX, DY
 * ADAPTIVE UI, AUTO-DOCUMENTATION & AUTONOMY BOUNDARIES
 * 
 * UI anpassar sig, systemet dokumenterar sig självt,
 * och autonomin har hårda gränser.
 */

// ============================================
// BLOCK DW: AUTONOMOUS UI ADAPTATION
// ============================================

export type WorldState = 
  | 'normal'
  | 'regional_shift'
  | 'trend_break'
  | 'high_complexity'
  | 'multi_domain_movement'
  | 'crisis_signal';

export interface UIAdaptation {
  id: string;
  triggered_by: WorldState;
  triggered_at: string;
  
  adaptations: {
    layout_changes: string[];
    emphasis_shifts: string[];
    additional_context: string[];
    visualization_adjustments: string[];
  };
  
  active: boolean;
  expires_at: string | null;
  
  rationale: string; // Why this adaptation was triggered
}

export const ADAPTIVE_UI_CONFIG = {
  triggers: {
    regional_shift: {
      name: 'Regionalt skifte',
      description: 'Signifikant förändring i specifika regioner',
      adaptations: {
        layout_changes: ['Fler kartor i toppläge', 'Regional jämförelse framlyft'],
        emphasis_shifts: ['Geografisk kontext prioriterad'],
        visualization_adjustments: ['Kartcentrerade dashboards'],
      },
    },
    trend_break: {
      name: 'Trendbrott',
      description: 'Historiska mönster bryts',
      adaptations: {
        layout_changes: ['Fler tidsserier synliga', 'Historisk kontext utökad'],
        emphasis_shifts: ['Temporala jämförelser prioriterade'],
        visualization_adjustments: ['Längre tidsaxlar', 'Breakpoint-markeringar'],
      },
    },
    high_complexity: {
      name: 'Hög komplexitet',
      description: 'Många samverkande faktorer',
      adaptations: {
        layout_changes: ['Fler sammanhang', 'Relation-visualiseringar'],
        emphasis_shifts: ['Osäkerhet tydligare'],
        additional_context: ['Metodförklaringar utökade', 'Alternativa tolkningar'],
        visualization_adjustments: ['Nätverksdiagram', 'Sankey-flöden'],
      },
    },
    multi_domain_movement: {
      name: 'Flerdomän-rörelse',
      description: 'Samtidig förändring över flera domäner',
      adaptations: {
        layout_changes: ['Cross-domain dashboard', 'Domänjämförelser'],
        emphasis_shifts: ['Syntes prioriterad'],
        visualization_adjustments: ['Parallella tidsserier', 'Domänradar'],
      },
    },
    crisis_signal: {
      name: 'Krissignal',
      description: 'Indikationer på allvarlig systemstress',
      adaptations: {
        layout_changes: ['Förenklad vy', 'Kritiska mått i fokus'],
        emphasis_shifts: ['Osäkerhet maximalt synlig'],
        additional_context: ['Verifieringsstatus', 'Källtransparens'],
        visualization_adjustments: ['Större typsnitt', 'Tydligare kontraster'],
      },
    },
  },
  
  adaptationRules: {
    automatic: true,
    humanOverrideAllowed: true,
    noManualLayoutDecisions: true,
    alwaysExplainWhy: true,
  },
  
  principle: 'Inga manuella layout-beslut.',
} as const;

// ============================================
// BLOCK DX: PUBLIC AUTO-DOCUMENTATION
// ============================================

export type DocumentationType = 
  | 'new_source'
  | 'new_method'
  | 'new_index'
  | 'methodology_change'
  | 'coverage_update'
  | 'quality_report';

export interface AutoDocument {
  id: string;
  type: DocumentationType;
  created_at: string;
  
  title: string;
  summary: string;
  
  content: {
    what: string;
    why: string;
    how: string;
    limitations: string[];
    links: string[];
  };
  
  version: string;
  supersedes: string | null; // Previous document ID if updated
  
  accessibility: {
    public: boolean;
    languages: string[];
    readability_level: 'technical' | 'general' | 'simple';
  };
}

export const AUTO_DOCS_CONFIG = {
  documentationTypes: {
    new_source: {
      name: 'Ny källa',
      template: 'En ny datakälla har lagts till i systemet.',
      sections: ['source_info', 'coverage', 'quality', 'update_frequency'],
    },
    new_method: {
      name: 'Ny metod',
      template: 'En ny analysmetod har implementerats.',
      sections: ['method_description', 'assumptions', 'limitations', 'validation'],
    },
    new_index: {
      name: 'Nytt index',
      template: 'Ett nytt sammansatt index har skapats.',
      sections: ['components', 'weights', 'calculation', 'interpretation_guide'],
    },
    methodology_change: {
      name: 'Metodförändring',
      template: 'En befintlig metod har uppdaterats.',
      sections: ['what_changed', 'why', 'impact', 'comparison'],
    },
    coverage_update: {
      name: 'Täckningsuppdatering',
      template: 'Datatäckningen har förändrats.',
      sections: ['new_coverage', 'removed_coverage', 'quality_impact'],
    },
    quality_report: {
      name: 'Kvalitetsrapport',
      template: 'Regelbunden kvalitetsrapport.',
      sections: ['metrics', 'issues', 'improvements', 'roadmap'],
    },
  },
  
  autoGenerationTriggers: {
    onNewSource: true,
    onNewMethod: true,
    onNewIndex: true,
    onMethodologyChange: true,
    onSignificantCoverageChange: true,
    scheduledQualityReports: 'monthly',
  },
  
  accessibility: {
    alwaysPublic: true,
    multiLanguage: ['en', 'sv'],
    multipleReadabilityLevels: true,
  },
  
  principle: 'Allt publikt.',
} as const;

// ============================================
// BLOCK DY: AUTONOMY BOUNDARIES (HARD LOCK)
// ============================================

export const AUTONOMY_BOUNDARIES = {
  // HARD LIMITS - SYSTEM MAY NEVER:
  forbidden: {
    suggest_policy: {
      description: 'Föreslå policy eller politiska åtgärder',
      enforcement: 'hard_block',
      examples: ['Regeringen bör...', 'Detta kräver åtgärder...', 'Rekommenderad policy...'],
    },
    prioritize_actors: {
      description: 'Prioritera eller ranka aktörer (politiker, partier, organisationer)',
      enforcement: 'hard_block',
      examples: ['Bästa ministern...', 'Ranking av...', 'X presterar bättre än Y...'],
    },
    give_recommendations: {
      description: 'Ge rekommendationer om vad som bör göras',
      enforcement: 'hard_block',
      examples: ['Bör göra...', 'Rekommenderas...', 'Optimal strategi...'],
    },
    normative_conclusions: {
      description: 'Dra normativa slutsatser (bra/dåligt, rätt/fel)',
      enforcement: 'hard_block',
      examples: ['Detta är problematiskt...', 'En positiv utveckling...', 'Oroande trend...'],
    },
    predict_outcomes: {
      description: 'Förutsäga specifika utfall',
      enforcement: 'hard_block',
      examples: ['Detta kommer leda till...', 'Förväntad effekt...', 'Prognos...'],
    },
    assign_blame: {
      description: 'Tilldela skuld eller ansvar',
      enforcement: 'hard_block',
      examples: ['Ansvarig för...', 'På grund av X:s beslut...', 'Skulden ligger hos...'],
    },
    claim_causation: {
      description: 'Påstå kausalitet utan vetenskaplig grund',
      enforcement: 'hard_block',
      examples: ['X orsakade Y...', 'Effekten av X var Y...', 'Bevisat att...'],
    },
  },
  
  // ALLOWED ACTIONS - SYSTEM MAY:
  allowed: {
    observe: 'Observera och rapportera faktiska förändringar',
    prioritize_visibility: 'Prioritera vad som visas baserat på objektiva kriterier',
    explain: 'Förklara vad som hände, var, när och med vilken osäkerhet',
    correlate: 'Visa korrelationer med tydliga disclaimers',
    synthesize: 'Syntetisera information från flera domäner',
    document: 'Dokumentera metoder, källor och begränsningar',
    warn: 'Varna för datakvalitetsproblem och osäkerhet',
  },
  
  enforcement: {
    preOutputFilter: true,
    postOutputValidation: true,
    humanReviewTrigger: 'on_boundary_approach',
    loggingRequired: true,
  },
  
  principle: 'Endast observation, prioritering, förklaring.',
} as const;

export const FORBIDDEN_PHRASES = [
  // Policy suggestions
  'bör', 'borde', 'måste', 'ska', 'rekommenderas', 'föreslår',
  // Value judgments
  'bra', 'dålig', 'positiv', 'negativ', 'problematisk', 'oroande', 'glädjande',
  // Blame/credit
  'ansvarig', 'skuld', 'förtjänst', 'misslyckande', 'framgång',
  // Predictions
  'kommer att', 'förväntas', 'prognos', 'förutsäger',
  // Causation claims
  'orsakade', 'ledde till', 'resulterade i', 'bevisar att',
] as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function determineUIAdaptation(
  worldState: WorldState
): UIAdaptation | null {
  const trigger = ADAPTIVE_UI_CONFIG.triggers[worldState];
  if (!trigger || worldState === 'normal') return null;
  
  return {
    id: `adapt_${Date.now()}`,
    triggered_by: worldState,
    triggered_at: new Date().toISOString(),
    adaptations: {
      layout_changes: trigger.adaptations.layout_changes || [],
      emphasis_shifts: trigger.adaptations.emphasis_shifts || [],
      additional_context: trigger.adaptations.additional_context || [],
      visualization_adjustments: trigger.adaptations.visualization_adjustments || [],
    },
    active: true,
    expires_at: null,
    rationale: trigger.description,
  };
}

export function generateAutoDoc(
  type: DocumentationType,
  content: { what: string; why: string; how: string; limitations: string[] }
): AutoDocument {
  const config = AUTO_DOCS_CONFIG.documentationTypes[type];
  
  return {
    id: `doc_${type}_${Date.now()}`,
    type,
    created_at: new Date().toISOString(),
    title: config.name,
    summary: config.template,
    content: {
      ...content,
      links: [],
    },
    version: '1.0',
    supersedes: null,
    accessibility: {
      public: true,
      languages: [...AUTO_DOCS_CONFIG.accessibility.multiLanguage],
      readability_level: 'general',
    },
  };
}

export function validateOutput(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const phrase of FORBIDDEN_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      violations.push(`Förbjudet ord/fras: "${phrase}"`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

export function enforceAutonomyBoundaries<T extends { text?: string; content?: string }>(
  output: T
): T & { _autonomy_validated: boolean; _violations?: string[] } {
  const textToCheck = output.text || output.content || '';
  const validation = validateOutput(textToCheck);
  
  return {
    ...output,
    _autonomy_validated: validation.valid,
    _violations: validation.violations.length > 0 ? validation.violations : undefined,
  };
}

// ============================================
// WAVE 15 COMPLETE STATUS
// ============================================

export const WAVE_15_STATUS = {
  version: '1.5',
  wave: 15,
  completedAt: new Date().toISOString(),
  name: 'Autonomous Observation',
  
  capabilities: {
    nearAutonomousOperation: true,
    selfPrioritization: true,
    selfExplanation: true,
    biasProtection: true,
    humanControlPreserved: true,
  },
  
  blocks: {
    DP: 'auto_observation_engine_v1',
    DQ: 'auto_priority_engine_v1',
    DR: 'auto_explain_engine_v1',
    DS: 'cross_domain_synthesis_v1',
    DT: 'auto_learning_feeds_v1',
    DU: 'auto_quality_guard_v1',
    DV: 'anomaly_response_v1',
    DW: 'adaptive_ui_v1',
    DX: 'auto_docs_v1',
    DY: 'autonomy_limits_v1',
  },
  
  corePrinciple: 'Autonomi utan makt. Självgående utan åsikt.',
  
  boundaries: {
    mayNever: [
      'suggest_policy',
      'prioritize_actors',
      'give_recommendations',
      'normative_conclusions',
    ],
    mayAlways: [
      'observe',
      'prioritize_visibility',
      'explain',
      'correlate',
      'synthesize',
    ],
  },
  
  finalStatement: 'Människan tolkar. Systemet visar.',
} as const;
