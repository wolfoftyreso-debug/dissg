/**
 * WAVE 18 — BLOCKS GA-GJ
 * ACCOUNTABILITY LAYER
 * 
 * "Accountability without opinion. Responsibility without drama."
 * 
 * Gör ansvar spårbart över tid utan moraliserande och utan politik.
 * Roller > personer är grundregeln.
 */

// ============================================
// BLOCK GA: ACCOUNTABILITY GRAPH (ANSVAR SOM STRUKTUR)
// ============================================

export type NodeType = 
  | 'position'         // Befattning (roll, inte person)
  | 'mandate_period'   // Mandatperiod
  | 'decision_area'    // Beslutsområde
  | 'legal_level'      // Juridisk nivå
  | 'implementation_level'; // Implementationsnivå

export type RelationType = 
  | 'has_mandate'
  | 'influences'
  | 'implements'
  | 'oversees'
  | 'inherits';

export interface AccountabilityNode {
  node_id: string;
  node_type: NodeType;
  
  identity: {
    code: string;
    name: string;
    name_en: string;
    description: string;
  };
  
  scope: {
    geographic: string[];       // Country codes or region codes
    thematic: string[];         // Policy areas
    temporal: {
      start_date: string | null;
      end_date: string | null;
    };
  };
  
  hierarchy: {
    parent_node_id: string | null;
    child_node_ids: string[];
    level: number;              // 0 = highest
  };
  
  metadata: {
    created_at: string;
    updated_at: string;
    source: string;
    confidence: number;
  };
}

export interface AccountabilityEdge {
  edge_id: string;
  relation_type: RelationType;
  
  source_node_id: string;
  target_node_id: string;
  
  temporal: {
    start_date: string;
    end_date: string | null;    // null = ongoing
  };
  
  scope: {
    areas: string[];
    strength: 'direct' | 'indirect' | 'advisory';
  };
  
  confidence: number;           // 0-1
  
  source_documentation: string | null;
}

export interface AccountabilityGraph {
  graph_id: string;
  version: string;
  generated_at: string;
  
  nodes: AccountabilityNode[];
  edges: AccountabilityEdge[];
  
  statistics: {
    total_nodes: number;
    total_edges: number;
    nodes_by_type: Record<NodeType, number>;
    edges_by_type: Record<RelationType, number>;
  };
}

export const ACCOUNTABILITY_GRAPH_CONFIG = {
  node_types: {
    position: { name: 'Befattning', principle: 'Roll, inte person' },
    mandate_period: { name: 'Mandatperiod', principle: 'Ansvar är tidsbundet' },
    decision_area: { name: 'Beslutsområde', principle: 'Tematisk avgränsning' },
    legal_level: { name: 'Juridisk nivå', principle: 'Formell behörighet' },
    implementation_level: { name: 'Implementationsnivå', principle: 'Praktiskt genomförande' },
  },
  
  relation_types: {
    has_mandate: { name: 'Har mandat', directional: true },
    influences: { name: 'Påverkar', directional: true },
    implements: { name: 'Implementerar', directional: true },
    oversees: { name: 'Övervakar', directional: true },
    inherits: { name: 'Ärver', directional: true },
  },
  
  principles: {
    roles_over_persons: 'Roller > personer är grundregeln.',
    time_bound: 'Ansvar är tidsbundet.',
  },
} as const;

// ============================================
// BLOCK GB: OUTCOME LINKING ENGINE
// ============================================

export type LinkStrength = 'direct' | 'indirect' | 'contextual';

export interface OutcomeLink {
  link_id: string;
  
  outcome: {
    kpi_id: string;
    index_code: string | null;
    metric_name: string;
    observation_period: { start: string; end: string };
    observed_change: number;
    change_direction: 'improved' | 'declined' | 'stable';
  };
  
  responsibility: {
    role_ids: string[];
    role_names: string[];
    link_strength: LinkStrength;
    active_period: { start: string; end: string };
  };
  
  timing: {
    expected_lag_months: number;
    observed_lag_months: number | null;
    uncertainty_range: { min: number; max: number };
    lag_confidence: number;
  };
  
  caveats: {
    confounding_factors: string[];
    external_influences: string[];
    methodology_limitations: string[];
  };
  
  display: {
    summary: string;  // Always neutral language
    detail_available: boolean;
  };
}

export interface LagModel {
  domain: string;
  typical_lag_months: number;
  variance_months: number;
  confidence: number;
  
  factors_affecting_lag: string[];
  historical_examples: Array<{
    description: string;
    actual_lag_months: number;
  }>;
}

export const OUTCOME_LINKING_CONFIG = {
  link_strength_definitions: {
    direct: {
      name: 'Direkt',
      description: 'Rollen hade primärt beslutsmandat',
      weight: 1.0,
    },
    indirect: {
      name: 'Indirekt',
      description: 'Rollen påverkade via annan aktör',
      weight: 0.5,
    },
    contextual: {
      name: 'Kontextuell',
      description: 'Rollen var aktiv under perioden',
      weight: 0.2,
    },
  },
  
  lag_models: {
    economic_policy: { typical_months: 18, variance: 12 },
    education_reform: { typical_months: 60, variance: 24 },
    health_policy: { typical_months: 24, variance: 18 },
    infrastructure: { typical_months: 48, variance: 36 },
    regulatory_change: { typical_months: 12, variance: 6 },
  },
  
  principles: {
    connection_not_blame: 'Systemet visar samband, inte skuld.',
    no_before_my_time: 'Slut på "det var innan min tid"-retorik.',
  },
} as const;

// ============================================
// BLOCK GC: ROLE PERFORMANCE HISTORY
// ============================================

export interface RolePerformanceProfile {
  role_id: string;
  role_name: string;
  role_type: string;
  
  analysis_period: { start: string; end: string };
  
  responsibility_areas: Array<{
    area_id: string;
    area_name: string;
    primary: boolean;
  }>;
  
  metrics_during_period: Array<{
    kpi_id: string;
    kpi_name: string;
    relevance_to_role: number;  // 0-1
    
    values: {
      at_period_start: number;
      at_period_end: number;
      change_percent: number;
      trend: 'improving' | 'declining' | 'stable';
    };
    
    context: {
      trend_before_period: 'improving' | 'declining' | 'stable';
      trend_after_period: 'improving' | 'declining' | 'stable' | null;
      external_factors: string[];
    };
  }>;
  
  transparency: {
    methodology_url: string;
    raw_data_url: string;
    no_personification_required: boolean;
  };
}

export const ROLE_PERFORMANCE_CONFIG = {
  display_rules: {
    show_responsibility_areas: true,
    show_metrics_development: true,
    show_before_after_trends: true,
    require_personification: false,  // Ingen personifiering krävs
  },
  
  analysis: {
    minimum_data_points: 4,
    trend_calculation: 'linear_regression',
    significance_threshold: 0.05,
  },
  
  principle: 'Ingen personifiering krävs.',
} as const;

// ============================================
// BLOCK GD: PERSON VIEW (SEKUNDÄR, FAKTISK)
// ============================================

export interface PersonView {
  person_id: string;
  
  public_identity: {
    name: string;
    verified: boolean;
    source: string;
  };
  
  public_mandates: Array<{
    role_id: string;
    role_name: string;
    institution: string;
    start_date: string;
    end_date: string | null;
    verified: boolean;
    source_documentation: string;
  }>;
  
  linked_outcomes: Array<{
    outcome_link_id: string;
    summary: string;
    role_during_period: string;
    link_strength: LinkStrength;
  }>;
  
  mandatory_disclaimer: string;  // Always shown
  
  transparency: {
    only_public_data: boolean;
    only_verified_mandates: boolean;
    factual_not_judgmental: boolean;
  };
}

export const PERSON_VIEW_CONFIG = {
  data_requirements: {
    only_public_assignments: true,
    only_verified_mandates: true,
    require_time_specifications: true,
  },
  
  mandatory_disclaimer: 'Utfallet påverkas av flera faktorer och roller.',
  
  display_principles: {
    factual_page: true,
    not_judgment: true,
    context_always_shown: true,
  },
  
  principle: 'Faktasida, inte dom.',
} as const;

// ============================================
// BLOCK GE: COLLECTIVE RESPONSIBILITY VIEW
// ============================================

export type CollectiveType = 
  | 'government'
  | 'agency_chain'
  | 'coalition'
  | 'multi_year_period';

export interface CollectiveResponsibilityView {
  collective_id: string;
  collective_type: CollectiveType;
  name: string;
  
  composition: {
    member_roles: string[];
    member_count: number;
    period: { start: string; end: string };
  };
  
  shared_outcomes: Array<{
    kpi_id: string;
    kpi_name: string;
    change_during_period: number;
    attribution_distribution: Record<string, number>;  // role_id -> weight
  }>;
  
  systemic_analysis: {
    is_systemic_outcome: boolean;
    requires_collective_view: boolean;
    rationale: string;
  };
  
  display: {
    show_as_collective: boolean;
    individual_breakdown_available: boolean;
  };
}

export const COLLECTIVE_RESPONSIBILITY_CONFIG = {
  collective_types: {
    government: { name: 'Regering som helhet', typical_period: '4 years' },
    agency_chain: { name: 'Myndighetskedjor', typical_period: 'ongoing' },
    coalition: { name: 'Koalitioner', typical_period: 'mandate period' },
    multi_year_period: { name: 'Flerårsperioder', typical_period: '8-12 years' },
  },
  
  systemic_detection: {
    min_actors_for_systemic: 3,
    min_years_for_long_term: 8,
  },
  
  principle: 'Många beslut är systemiska.',
} as const;

// ============================================
// BLOCK GF: ACCOUNTABILITY SCORE (DESKRIPTIVT)
// ============================================

export interface AccountabilityScore {
  entity_id: string;
  entity_type: 'role' | 'collective' | 'institution';
  entity_name: string;
  
  period: { start: string; end: string };
  
  dimensions: {
    coverage: {
      score: number;          // 0-100
      description: string;    // Tog man ansvar?
      data_points: number;
    };
    continuity: {
      score: number;          // 0-100
      description: string;
      gaps_detected: number;
    };
    response_speed: {
      score: number;          // 0-100
      description: string;
      average_response_days: number;
    };
    follow_up: {
      score: number;          // 0-100
      description: string;
      follow_up_rate: number;
    };
  };
  
  overall: {
    score: number;            // 0-100
    interpretation: string;   // Neutral language only
  };
  
  what_this_measures: {
    measures: 'governance_capability';  // Styrningsförmåga
    does_not_measure: 'good_or_bad';    // Inte "bra/dåligt"
  };
  
  methodology: {
    version: string;
    transparency_url: string;
  };
}

export const ACCOUNTABILITY_SCORE_CONFIG = {
  dimensions: {
    coverage: { weight: 0.30, name: 'Täckning', question: 'Tog man ansvar?' },
    continuity: { weight: 0.25, name: 'Kontinuitet', question: 'Var ansvaret obrutet?' },
    response_speed: { weight: 0.25, name: 'Reaktionshastighet', question: 'Hur snabbt reagerade man?' },
    follow_up: { weight: 0.20, name: 'Uppföljning', question: 'Följde man upp?' },
  },
  
  interpretation: {
    what_it_measures: 'Styrningsförmåga',
    what_it_does_not_measure: 'Bra/dåligt',
  },
  
  scoring: {
    scale: { min: 0, max: 100 },
  },
  
  principle: 'Mäter inte "bra/dåligt" — Mäter styrningsförmåga.',
} as const;

// ============================================
// BLOCK GG: "WHO WAS RESPONSIBLE WHEN?"
// ============================================

export interface ResponsibilityTimeline {
  timeline_id: string;
  subject: {
    type: 'kpi' | 'index' | 'policy_area';
    id: string;
    name: string;
  };
  
  period: { start: string; end: string };
  
  data_series: Array<{
    date: string;
    value: number;
  }>;
  
  responsibility_periods: Array<{
    period_id: string;
    start_date: string;
    end_date: string;
    
    active_roles: Array<{
      role_id: string;
      role_name: string;
      institution: string;
      link_strength: LinkStrength;
      mandate_description_url: string;
    }>;
    
    is_clickable: true;
  }>;
  
  user_guidance: {
    message: string;  // "Ingen kan säga 'jag vet inte'"
  };
}

export const RESPONSIBILITY_TIMELINE_CONFIG = {
  display: {
    show_active_roles: true,
    make_clickable: true,
    link_to_mandate_description: true,
  },
  
  interactivity: {
    hover_shows_roles: true,
    click_opens_detail: true,
    timeline_zoomable: true,
  },
  
  user_message: 'Ingen kan säga "jag vet inte".',
  
  principle: 'Ingen kan säga "jag vet inte".',
} as const;

// ============================================
// BLOCK GH: BLAME-PROOFING LAYER
// ============================================

export interface BlameProofingRules {
  forbidden_terms: string[];
  required_substitutions: Record<string, string>;
  mandatory_qualifiers: string[];
  
  language_principles: {
    no_value_words: boolean;
    no_causation_claims: boolean;
    use_correlation_language: boolean;
  };
}

export const BLAME_PROOFING_CONFIG: BlameProofingRules = {
  forbidden_terms: [
    'orsakade',
    'förstörde',
    'misslyckades',
    'skuld',
    'ansvarig för',
    'på grund av',
    'fel',
    'dåligt',
    'bra',
    'framgång',
    'misslyckande',
  ],
  
  required_substitutions: {
    'orsakade': 'sammanföll med',
    'på grund av': 'under perioden för',
    'ansvarig för': 'hade mandat för',
    'misslyckades': 'nådde inte målet',
    'framgång': 'måluppfyllelse',
    'fel': 'avvikelse',
  },
  
  mandatory_qualifiers: [
    'under perioden',
    'sammanfaller med',
    'korrelerar med',
    'under mandatet för',
    'i kontexten av',
  ],
  
  language_principles: {
    no_value_words: true,
    no_causation_claims: true,
    use_correlation_language: true,
  },
};

export const BLAME_PROOFING_PRINCIPLES = {
  never_use: ['värdeord', '"orsakade"'],
  always_use: ['"sammanfaller med"', '"under perioden"'],
  core_principle: 'Rättssäkerhet by design.',
} as const;

// ============================================
// BLOCK GI: PUBLIC ACCOUNTABILITY INDEX (PAI)
// ============================================

export interface PublicAccountabilityIndex {
  index_id: string;
  country_code: string;
  period: { start: string; end: string };
  calculated_at: string;
  
  overall_score: number;  // 0-100
  
  components: {
    follow_up_quality: {
      score: number;
      description: string;
    };
    clarity_of_responsibility: {
      score: number;
      areas_unclear: string[];
    };
    tracking_completeness: {
      score: number;
      gaps: string[];
    };
  };
  
  findings: {
    where_responsibility_unclear: string[];
    where_follow_up_missing: string[];
    systemic_issues: string[];
  };
  
  transparency: {
    methodology_url: string;
    raw_data_url: string;
    public_facing: boolean;
  };
  
  display_principle: string;  // "Transparens utan skam"
}

export const PAI_CONFIG = {
  components: {
    follow_up_quality: { weight: 0.35, name: 'Uppföljningskvalitet' },
    clarity_of_responsibility: { weight: 0.35, name: 'Ansvarsklarhet' },
    tracking_completeness: { weight: 0.30, name: 'Spårbarhet' },
  },
  
  display: {
    show_where_unclear: true,
    show_where_missing: true,
    show_systemic_issues: true,
  },
  
  audience: 'public',
  
  principle: 'Transparens utan skam.',
} as const;

// ============================================
// BLOCK GJ: FEEDBACK INTO GOVERNANCE LOOP
// ============================================

export type GovernanceSignalType = 
  | 'unclear_responsibility'
  | 'long_lag'
  | 'low_follow_up'
  | 'systemic_gap';

export interface GovernanceFeedbackSignal {
  signal_id: string;
  signal_type: GovernanceSignalType;
  
  detection: {
    detected_at: string;
    recurrence_count: number;
    first_detected_at: string;
  };
  
  context: {
    affected_areas: string[];
    affected_roles: string[];
    severity: 'info' | 'warning' | 'critical';
  };
  
  analysis: {
    pattern_description: string;
    structural_implication: string;
    suggested_review_areas: string[];
  };
  
  is_flagged: boolean;
  flag_reason: string | null;
}

export interface GovernanceFeedbackLoop {
  loop_id: string;
  analysis_period: { start: string; end: string };
  
  signals: GovernanceFeedbackSignal[];
  
  patterns: {
    recurring_unclear_responsibility: Array<{ area: string; count: number }>;
    structural_lag_issues: Array<{ domain: string; average_lag_months: number }>;
    systematic_follow_up_gaps: Array<{ area: string; gap_rate: number }>;
  };
  
  recommendations: {
    areas_for_structural_review: string[];
    suggested_governance_improvements: string[];
  };
  
  learning: {
    system_learns_governance: boolean;
    feeds_into_future_analysis: boolean;
  };
}

export const GOVERNANCE_FEEDBACK_CONFIG = {
  signal_types: {
    unclear_responsibility: {
      name: 'Otydligt ansvar',
      trigger: 'Återkommande otydlighet i ansvarsfördelning',
      action: 'flagga',
    },
    long_lag: {
      name: 'Lång lagg',
      trigger: 'Konsekvent längre laggar än förväntat',
      action: 'strukturell varning',
    },
    low_follow_up: {
      name: 'Låg uppföljning',
      trigger: 'Systematiskt låg uppföljningsgrad',
      action: 'systemrisk',
    },
    systemic_gap: {
      name: 'Systemisk lucka',
      trigger: 'Strukturella brister i styrning',
      action: 'eskalera',
    },
  },
  
  thresholds: {
    recurrence_for_flag: 3,
    lag_deviation_for_warning: 1.5,  // 50% longer than expected
    follow_up_rate_critical: 0.3,    // Below 30%
  },
  
  principle: 'Systemet lär sig hur styrning fungerar.',
} as const;

// ============================================
// WAVE 18 COMPLETE STATUS
// ============================================

export const WAVE_18_STATUS = {
  version: '18.0',
  name: 'Accountability Layer',
  motto: 'Accountability without opinion. Responsibility without drama.',
  
  blocks: {
    GA: 'accountability_graph_v1',
    GB: 'outcome_link_engine_v1',
    GC: 'role_performance_v1',
    GD: 'person_view_v1',
    GE: 'collective_responsibility_v1',
    GF: 'accountability_score_v1',
    GG: 'responsibility_timeline_v1',
    GH: 'blame_proof_layer_v1',
    GI: 'pai_public_index_v1',
    GJ: 'governance_feedback_loop_v1',
  },
  
  capabilities: {
    accountability_graph: true,
    outcome_linking: true,
    lag_modeling: true,
    role_performance: true,
    person_view: true,
    collective_responsibility: true,
    accountability_score: true,
    responsibility_timeline: true,
    blame_proofing: true,
    public_accountability_index: true,
    governance_feedback_loop: true,
  },
  
  achievements: [
    'Ansvar tidsatt',
    'Roller > personer',
    'Utfallslogik korrekt',
    'Rättssäkerhet',
    'Allmän förståelse',
  ],
  
  corePrinciple: 'Efter detta finns det inte längre en klyfta mellan beslut, ansvar och verklighet.',
  
  legalSafety: {
    no_value_words: true,
    no_causation_claims: true,
    correlation_language: true,
    mandatory_disclaimers: true,
  },
  
  finalStatement: 'Inte för att någon pekar finger – utan för att strukturen är synlig.',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function blameProofText(text: string): string {
  let result = text;
  
  for (const [forbidden, replacement] of Object.entries(BLAME_PROOFING_CONFIG.required_substitutions)) {
    const regex = new RegExp(forbidden, 'gi');
    result = result.replace(regex, replacement);
  }
  
  return result;
}

export function calculateAccountabilityScore(dimensions: AccountabilityScore['dimensions']): number {
  const weights = ACCOUNTABILITY_SCORE_CONFIG.dimensions;
  
  const weighted = 
    dimensions.coverage.score * weights.coverage.weight +
    dimensions.continuity.score * weights.continuity.weight +
    dimensions.response_speed.score * weights.response_speed.weight +
    dimensions.follow_up.score * weights.follow_up.weight;
  
  return Math.round(weighted);
}

export function detectGovernanceSignal(
  type: GovernanceSignalType,
  affectedAreas: string[],
  affectedRoles: string[],
  recurrenceCount: number
): GovernanceFeedbackSignal {
  const config = GOVERNANCE_FEEDBACK_CONFIG.signal_types[type];
  const severity = recurrenceCount >= 5 ? 'critical' : recurrenceCount >= 3 ? 'warning' : 'info';
  
  return {
    signal_id: `gfs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    signal_type: type,
    detection: {
      detected_at: new Date().toISOString(),
      recurrence_count: recurrenceCount,
      first_detected_at: new Date().toISOString(),
    },
    context: {
      affected_areas: affectedAreas,
      affected_roles: affectedRoles,
      severity,
    },
    analysis: {
      pattern_description: config.trigger,
      structural_implication: config.action,
      suggested_review_areas: affectedAreas,
    },
    is_flagged: recurrenceCount >= GOVERNANCE_FEEDBACK_CONFIG.thresholds.recurrence_for_flag,
    flag_reason: recurrenceCount >= GOVERNANCE_FEEDBACK_CONFIG.thresholds.recurrence_for_flag
      ? `Återkommande ${config.name.toLowerCase()} (${recurrenceCount} gånger)`
      : null,
  };
}

export function createOutcomeLink(
  kpiId: string,
  kpiName: string,
  roleIds: string[],
  roleNames: string[],
  observedChange: number,
  expectedLagMonths: number
): OutcomeLink {
  return {
    link_id: `ol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    outcome: {
      kpi_id: kpiId,
      index_code: null,
      metric_name: kpiName,
      observation_period: { start: '', end: '' },
      observed_change: observedChange,
      change_direction: observedChange > 0 ? 'improved' : observedChange < 0 ? 'declined' : 'stable',
    },
    responsibility: {
      role_ids: roleIds,
      role_names: roleNames,
      link_strength: 'direct',
      active_period: { start: '', end: '' },
    },
    timing: {
      expected_lag_months: expectedLagMonths,
      observed_lag_months: null,
      uncertainty_range: { 
        min: expectedLagMonths * 0.5, 
        max: expectedLagMonths * 1.5 
      },
      lag_confidence: 0.7,
    },
    caveats: {
      confounding_factors: [],
      external_influences: [],
      methodology_limitations: [],
    },
    display: {
      summary: blameProofText(`Värdet förändrades under perioden för dessa roller.`),
      detail_available: true,
    },
  };
}
