/**
 * WAVE 19 — BLOCKS HA-HJ
 * PUBLIC CONSCIOUSNESS INTERFACE (PCI)
 * 
 * "Hur människor uppfattar läget, vad de tror är viktigt –
 * och hur det skiljer sig från verkligheten som datan visar."
 * 
 * Efter detta: verklighet → relevans → ansvar → medvetande.
 */

import { RelevanceLevel } from './civilizationRelevanceConfig';

// ============================================
// BLOCK HA: PUBLIC PERCEPTION ENGINE
// ============================================

export type PerceptionSourceType = 
  | 'opinion_polls'         // Opinionsundersökningar (aggregerade)
  | 'search_trends'         // Söktrender
  | 'news_volume'           // Nyhetsvolym
  | 'social_discourse'      // Social diskurs (tematiskt, ej individer)
  | 'parliamentary_rhetoric'; // Parlamentarisk retorik (volym/ämne)

export interface PerceptionSource {
  name: string;
  weight: number;
  reliability: number;
  update_frequency: string;
  privacy_level: 'aggregate_only' | 'anonymous' | 'public';
}

export interface PerceptionObject {
  perception_id: string;
  topic: {
    code: string;
    name: string;
    category: string;
  };
  region: {
    code: string;
    name: string;
    level: 'global' | 'national' | 'regional' | 'local';
  };
  time: {
    measured_at: string;
    period_start: string;
    period_end: string;
  };
  intensity: {
    raw_score: number;      // 0-100
    normalized_score: number;
    trend: 'rising' | 'stable' | 'falling';
    velocity: number;       // Rate of change
  };
  source_mix: {
    sources: PerceptionSourceType[];
    weights: Record<PerceptionSourceType, number>;
    dominant_source: PerceptionSourceType;
  };
  confidence: number;       // 0-1
}

export const PERCEPTION_ENGINE_CONFIG = {
  sources: {
    opinion_polls: {
      name: 'Opinionsundersökningar',
      weight: 0.25,
      reliability: 0.8,
      update_frequency: 'weekly',
      privacy_level: 'aggregate_only',
    },
    search_trends: {
      name: 'Söktrender',
      weight: 0.20,
      reliability: 0.7,
      update_frequency: 'daily',
      privacy_level: 'aggregate_only',
    },
    news_volume: {
      name: 'Nyhetsvolym',
      weight: 0.25,
      reliability: 0.85,
      update_frequency: 'hourly',
      privacy_level: 'public',
    },
    social_discourse: {
      name: 'Social diskurs',
      weight: 0.15,
      reliability: 0.6,
      update_frequency: 'daily',
      privacy_level: 'aggregate_only',
    },
    parliamentary_rhetoric: {
      name: 'Parlamentarisk retorik',
      weight: 0.15,
      reliability: 0.9,
      update_frequency: 'weekly',
      privacy_level: 'public',
    },
  } as Record<PerceptionSourceType, PerceptionSource>,
  
  privacy: {
    no_individual_data: true,
    only_collective_signals: true,
    aggregation_minimum: 100,
  },
  
  principle: 'Ingen individdata. Endast kollektiva signaler.',
} as const;

// ============================================
// BLOCK HB: REALITY vs PERCEPTION GAP ENGINE
// ============================================

export type GapClass = 
  | 'overexposed'   // Mycket prat, låg impact
  | 'underexposed'  // Lite prat, hög impact
  | 'aligned'       // Balans
  | 'volatile';     // Snabbt skiftande

export type GapDirection = 'over_focus' | 'under_focus' | 'balanced';

export interface RealityGap {
  gap_id: string;
  topic: {
    code: string;
    name: string;
  };
  region: string;
  period: { start: string; end: string };
  
  metrics: {
    attention_intensity: number;    // 0-100, from perception
    actual_impact_level: number;    // 0-100, from CRM
    relevance_level: RelevanceLevel;
  };
  
  gap_analysis: {
    gap_score: number;              // -100 to +100 (negative = under, positive = over)
    gap_direction: GapDirection;
    gap_class: GapClass;
    magnitude: 'minor' | 'moderate' | 'significant' | 'extreme';
  };
  
  interpretation: {
    summary: string;                // Neutral language
    implication: string;
  };
  
  confidence: number;
}

export const REALITY_GAP_CONFIG = {
  gap_classes: {
    overexposed: {
      name: 'Överexponerad',
      description: 'Mycket prat, låg impact',
      threshold: { min_attention: 60, max_impact: 30 },
      color: 'hsl(var(--destructive))',
    },
    underexposed: {
      name: 'Underexponerad',
      description: 'Lite prat, hög impact',
      threshold: { max_attention: 30, min_impact: 60 },
      color: 'hsl(var(--warning))',
    },
    aligned: {
      name: 'Balanserad',
      description: 'Uppmärksamhet motsvarar påverkan',
      threshold: { gap_range: [-20, 20] },
      color: 'hsl(var(--primary))',
    },
    volatile: {
      name: 'Volatil',
      description: 'Snabbt skiftande fokus',
      threshold: { change_rate: 30 },
      color: 'hsl(var(--accent))',
    },
  },
  
  calculation: {
    gap_formula: 'attention_intensity - actual_impact_level',
    normalize: true,
    smooth_window_days: 7,
  },
  
  principle: 'Detta är orienteringsdata, inte kritik.',
} as const;

// ============================================
// BLOCK HC: MISALIGNED ATTENTION MAP
// ============================================

export interface AttentionMapRegion {
  region_code: string;
  region_name: string;
  
  gap_summary: {
    dominant_gap_class: GapClass;
    gap_score: number;
    top_misaligned_topics: Array<{
      topic: string;
      gap_class: GapClass;
      gap_score: number;
    }>;
  };
  
  display: {
    color: string;
    intensity: number;
    clickable: true;
  };
}

export interface AttentionMap {
  map_id: string;
  generated_at: string;
  time_range: { start: string; end: string };
  
  regions: AttentionMapRegion[];
  
  global_summary: {
    most_overexposed_regions: string[];
    most_underexposed_regions: string[];
    most_aligned_regions: string[];
  };
  
  interactivity: {
    click_shows_topics: boolean;
    time_slider: boolean;
    filter_by_gap_class: boolean;
  };
  
  user_message: string;  // "Här tittar vi fel"
}

export const ATTENTION_MAP_CONFIG = {
  display: {
    color_by_gap_class: true,
    click_shows_topics: true,
    time_slider: true,
    filter_options: ['overexposed', 'underexposed', 'aligned', 'volatile'],
  },
  
  colors: {
    overexposed: 'hsl(0 84% 60%)',      // Red
    underexposed: 'hsl(45 93% 47%)',    // Orange/Yellow
    aligned: 'hsl(142 76% 36%)',        // Green
    volatile: 'hsl(280 65% 60%)',       // Purple
  },
  
  user_insight: 'Här tittar vi fel.',
  
  principle: 'Folk ser direkt: "Här tittar vi fel."',
} as const;

// ============================================
// BLOCK HD: MEDIA CONTEXT LAYER
// ============================================

export interface MediaContext {
  topic_id: string;
  topic_name: string;
  
  media: {
    intensity: 'low' | 'medium' | 'high' | 'extreme';
    volume_7d: number;
    trend: 'rising' | 'stable' | 'falling';
  };
  
  reality: {
    system_impact: 'low' | 'medium' | 'high' | 'extreme';
    relevance_level: RelevanceLevel;
    impact_score: number;
  };
  
  display: {
    summary: string;      // "Medieintensitet: hög, Systemimpact: låg–medel"
    no_value_words: true;
    shows_relation_only: true;
  };
}

export const MEDIA_CONTEXT_CONFIG = {
  intensity_levels: {
    low: { threshold: 25, label: 'Låg' },
    medium: { threshold: 50, label: 'Medel' },
    high: { threshold: 75, label: 'Hög' },
    extreme: { threshold: 90, label: 'Extrem' },
  },
  
  display_template: 'Medieintensitet: {media}\nSystemimpact: {impact}\nRelevansnivå: {level}',
  
  rules: {
    no_value_words: true,
    only_relation: true,
    neutral_language: true,
  },
  
  principle: 'Inga värdeord. Bara relation.',
} as const;

// ============================================
// BLOCK HE: PUBLIC ORIENTATION MODE (DEFAULT)
// ============================================

export interface PublicOrientationView {
  view_id: string;
  generated_at: string;
  user_region: string;
  
  sections: {
    highest_impact: {
      title: string;
      description: string;
      items: Array<{
        topic: string;
        relevance_level: 'L3' | 'L4';
        affected_population: number;
        summary: string;
      }>;
    };
    
    emerging: {
      title: string;
      description: string;
      items: Array<{
        topic: string;
        trend: 'rising';
        projected_level: RelevanceLevel;
        time_to_impact: string;
      }>;
    };
    
    overexposed: {
      title: string;
      description: string;
      marked_as_gap: true;
      items: Array<{
        topic: string;
        attention_level: 'high' | 'extreme';
        actual_impact: 'low' | 'medium';
        gap_explanation: string;
      }>;
    };
  };
  
  purpose: 'folkbildning_i_realtid';
}

export const PUBLIC_ORIENTATION_CONFIG = {
  default_sections: [
    {
      id: 'highest_impact',
      title: 'Det som påverkar flest mest',
      filter: ['L3', 'L4'],
      order: 1,
    },
    {
      id: 'emerging',
      title: 'Det som är på väg att bli viktigt',
      filter: 'rising_relevance',
      order: 2,
    },
    {
      id: 'overexposed',
      title: 'Mycket uppmärksamhet, låg impact',
      filter: 'overexposed',
      order: 3,
      marked: true,
    },
  ],
  
  display: {
    show_relevance_badges: true,
    show_gap_markers: true,
    accessible_language: true,
  },
  
  audience: 'general_public',
  
  principle: 'Detta är folkbildning i realtid.',
} as const;

// ============================================
// BLOCK HF: "WHY ARE WE TALKING ABOUT THIS?"
// ============================================

export interface DiscourseExplanation {
  topic_id: string;
  topic_name: string;
  
  visibility_analysis: {
    why_visible: string;
    driving_events: Array<{
      event_type: string;
      date: string;
      description: string;
      impact_on_discourse: 'triggered' | 'amplified' | 'sustained';
    }>;
    attention_sources: PerceptionSourceType[];
  };
  
  reality_relation: {
    connected_outcomes: string[];
    relevance_level: RelevanceLevel;
    impact_assessment: string;
  };
  
  neutral_framing: {
    no_correction: boolean;
    understanding_focus: boolean;
    respects_discourse: boolean;
  };
}

export const DISCOURSE_EXPLAIN_CONFIG = {
  questions_answered: [
    'Varför är detta ämne synligt?',
    'Vilka händelser drev uppmärksamheten?',
    'Hur relaterar det till faktiska utfall?',
  ],
  
  response_rules: {
    no_value_judgment: true,
    no_steering: true,
    factual_only: true,
  },
  
  framing: {
    purpose: 'understanding',
    not_correction: true,
  },
  
  principle: 'Förståelse, inte korrigering.',
} as const;

// ============================================
// BLOCK HG: TRUST & CONFIDENCE INDEX
// ============================================

export interface TrustIndex {
  index_id: string;
  country_code: string;
  measured_at: string;
  period: { start: string; end: string };
  
  dimensions: {
    institutional_trust: {
      score: number;        // 0-100
      trend: 'rising' | 'stable' | 'falling';
      breakdown: Record<string, number>;  // institution -> score
    };
    
    data_trust: {
      score: number;
      trend: 'rising' | 'stable' | 'falling';
      breakdown: {
        government_data: number;
        media_data: number;
        scientific_data: number;
        this_system: number;
      };
    };
    
    stability: {
      score: number;
      volatility: 'low' | 'medium' | 'high';
      long_term_trend: 'improving' | 'stable' | 'declining';
    };
  };
  
  overall: {
    score: number;
    interpretation: string;
  };
  
  role: 'background_variable';
}

export const TRUST_INDEX_CONFIG = {
  dimensions: {
    institutional_trust: { weight: 0.40, name: 'Institutionell tillit' },
    data_trust: { weight: 0.35, name: 'Datatillit' },
    stability: { weight: 0.25, name: 'Stabilitet över tid' },
  },
  
  institutions_tracked: [
    'government',
    'parliament',
    'judiciary',
    'media',
    'healthcare',
    'education',
    'police',
    'scientific_community',
  ],
  
  importance: 'Viktig bakgrundsvariabel för allt annat.',
  
  principle: 'Viktig bakgrundsvariabel för allt annat.',
} as const;

// ============================================
// BLOCK HH: CIVIC FEEDBACK LOOP
// ============================================

export type FeedbackType = 
  | 'should_track_better'   // "Detta borde följas bättre"
  | 'unclear'               // "Detta är otydligt"
  | 'local_impact';         // "Detta påverkar oss lokalt"

export interface CivicFeedback {
  feedback_id: string;
  feedback_type: FeedbackType;
  
  content: {
    topic: string;
    region: string;
    message: string;
    submitted_at: string;
  };
  
  aggregation: {
    similar_count: number;
    geographic_spread: string[];
    first_submitted: string;
  };
  
  tracking: {
    is_tracked: boolean;
    affects_prioritization: boolean;
    response_status: 'pending' | 'acknowledged' | 'integrated' | 'explained';
  };
  
  privacy: {
    anonymized: true;
    aggregated: true;
    no_individual_identification: true;
  };
}

export interface CivicFeedbackAggregation {
  period: { start: string; end: string };
  
  by_type: Record<FeedbackType, {
    count: number;
    top_topics: string[];
    top_regions: string[];
  }>;
  
  prioritization_impact: {
    topics_elevated: string[];
    topics_under_review: string[];
  };
}

export const CIVIC_FEEDBACK_CONFIG = {
  feedback_types: {
    should_track_better: {
      label: 'Detta borde följas bättre',
      icon: '📊',
    },
    unclear: {
      label: 'Detta är otydligt',
      icon: '❓',
    },
    local_impact: {
      label: 'Detta påverkar oss lokalt',
      icon: '📍',
    },
  },
  
  processing: {
    aggregate: true,
    track: true,
    affects_prioritization: true,
    minimum_for_action: 10,
  },
  
  privacy: {
    anonymized: true,
    aggregated: true,
    retention_days: 365,
  },
  
  principle: 'Medborgare som sensorer.',
} as const;

// ============================================
// BLOCK HI: NO MANIPULATION GUARANTEE
// ============================================

export interface NoManipulationContract {
  contract_version: string;
  effective_date: string;
  
  guarantees: {
    no_opinion_change_attempt: {
      statement: string;
      enforcement: string;
      verifiable: boolean;
    };
    no_political_prioritization: {
      statement: string;
      enforcement: string;
      verifiable: boolean;
    };
    no_controversy_hiding: {
      statement: string;
      enforcement: string;
      verifiable: boolean;
    };
  };
  
  what_system_does: string[];
  what_system_never_does: string[];
  
  transparency: {
    algorithm_open: boolean;
    prioritization_explainable: boolean;
    audit_trail: boolean;
  };
  
  legal_binding: boolean;
}

export const NO_MANIPULATION_CONTRACT: NoManipulationContract = {
  contract_version: '1.0',
  effective_date: new Date().toISOString(),
  
  guarantees: {
    no_opinion_change_attempt: {
      statement: 'Systemet försöker aldrig ändra användarens åsikter.',
      enforcement: 'Algoritmisk granskning + extern audit',
      verifiable: true,
    },
    no_political_prioritization: {
      statement: 'Ingen politisk preferens påverkar prioriteringen.',
      enforcement: 'Transparent metodologi + reproducerbarhet',
      verifiable: true,
    },
    no_controversy_hiding: {
      statement: 'Kontroversiella ämnen döljs aldrig.',
      enforcement: 'Fullständig spårbarhet + öppen källkod',
      verifiable: true,
    },
  },
  
  what_system_does: [
    'Visar relationer mellan data och perception',
    'Förklarar varför saker är synliga',
    'Jämför uppmärksamhet med faktisk påverkan',
    'Möjliggör egen prioritering',
  ],
  
  what_system_never_does: [
    'Styr mot specifika slutsatser',
    'Döljer kontroversiell information',
    'Prioriterar baserat på politisk tillhörighet',
    'Manipulerar presentation för att påverka',
  ],
  
  transparency: {
    algorithm_open: true,
    prioritization_explainable: true,
    audit_trail: true,
  },
  
  legal_binding: true,
};

export const NO_MANIPULATION_PRINCIPLES = {
  core: 'Det visar relationer. Punkt.',
  guarantees: [
    'Försöker inte ändra åsikter',
    'Prioriterar inte politiskt',
    'Döljer inte kontrovers',
  ],
} as const;

// ============================================
// BLOCK HJ: PUBLIC CONSCIOUSNESS DASHBOARD
// ============================================

export interface PublicConsciousnessDashboard {
  dashboard_id: string;
  generated_at: string;
  region: string;
  period: { start: string; end: string };
  
  panels: {
    reality: {
      title: string;
      content: Array<{
        topic: string;
        impact_score: number;
        relevance_level: RelevanceLevel;
      }>;
    };
    
    perception: {
      title: string;
      content: Array<{
        topic: string;
        attention_score: number;
        sources: PerceptionSourceType[];
      }>;
    };
    
    gap: {
      title: string;
      content: Array<{
        topic: string;
        gap_score: number;
        gap_class: GapClass;
        direction: GapDirection;
      }>;
    };
    
    trend: {
      title: string;
      time_series: Array<{
        date: string;
        reality_focus: number;
        perception_focus: number;
        gap: number;
      }>;
    };
  };
  
  purpose: 'spegeln';
}

export const PCD_DASHBOARD_CONFIG = {
  panels: [
    { id: 'reality', title: 'Verklighet (impact)', order: 1 },
    { id: 'perception', title: 'Uppmärksamhet (perception)', order: 2 },
    { id: 'gap', title: 'Gap', order: 3 },
    { id: 'trend', title: 'Trend över tid', order: 4 },
  ],
  
  display: {
    side_by_side: true,
    interactive: true,
    time_range_selector: true,
    region_filter: true,
  },
  
  purpose: 'Detta är spegeln.',
  
  principle: 'Detta är spegeln.',
} as const;

// ============================================
// WAVE 19 COMPLETE STATUS
// ============================================

export const WAVE_19_STATUS = {
  version: '19.0',
  name: 'Public Consciousness Interface (PCI)',
  
  blocks: {
    HA: 'public_perception_engine_v1',
    HB: 'reality_gap_engine_v1',
    HC: 'attention_map_v1',
    HD: 'media_context_layer_v1',
    HE: 'public_orientation_mode_v1',
    HF: 'discourse_explain_v1',
    HG: 'trust_index_v1',
    HH: 'civic_feedback_v1',
    HI: 'no_manipulation_contract_v1',
    HJ: 'pcd_dashboard_v1',
  },
  
  capabilities: {
    perception_measurement: true,
    reality_gap_detection: true,
    attention_mapping: true,
    media_context: true,
    public_orientation: true,
    discourse_explanation: true,
    trust_tracking: true,
    civic_feedback: true,
    manipulation_guarantee: true,
    consciousness_dashboard: true,
  },
  
  chain_complete: {
    reality: true,
    relevance: true,
    accountability: true,
    consciousness: true,
  },
  
  achievements: [
    'Verklighet modellerad',
    'Relevans rangordnad',
    'Ansvar spårbart',
    'Medvetandegap synligt',
  ],
  
  corePrinciple: 'Efter detta är inte bara världen synlig – även vår bild av världen är synlig.',
  
  maturityStatement: 'Och det är där verklig mognad börjar.',
  
  systemStatus: 'Fullständigt civilisationssystem.',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateGapScore(
  attentionIntensity: number,
  actualImpact: number
): { score: number; direction: GapDirection; class: GapClass } {
  const score = attentionIntensity - actualImpact;
  
  let direction: GapDirection = 'balanced';
  if (score > 20) direction = 'over_focus';
  else if (score < -20) direction = 'under_focus';
  
  let gapClass: GapClass = 'aligned';
  const config = REALITY_GAP_CONFIG.gap_classes;
  
  if (attentionIntensity >= config.overexposed.threshold.min_attention && 
      actualImpact <= config.overexposed.threshold.max_impact) {
    gapClass = 'overexposed';
  } else if (attentionIntensity <= config.underexposed.threshold.max_attention && 
             actualImpact >= config.underexposed.threshold.min_impact) {
    gapClass = 'underexposed';
  }
  
  return { score, direction, class: gapClass };
}

export function createPerceptionObject(
  topicCode: string,
  topicName: string,
  regionCode: string,
  intensityScore: number,
  sources: PerceptionSourceType[]
): PerceptionObject {
  const sourceWeights: Record<PerceptionSourceType, number> = {} as any;
  sources.forEach((s) => {
    sourceWeights[s] = 1 / sources.length;
  });
  
  return {
    perception_id: `perc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    topic: {
      code: topicCode,
      name: topicName,
      category: 'general',
    },
    region: {
      code: regionCode,
      name: regionCode,
      level: 'national',
    },
    time: {
      measured_at: new Date().toISOString(),
      period_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      period_end: new Date().toISOString(),
    },
    intensity: {
      raw_score: intensityScore,
      normalized_score: intensityScore,
      trend: 'stable',
      velocity: 0,
    },
    source_mix: {
      sources,
      weights: sourceWeights,
      dominant_source: sources[0],
    },
    confidence: 0.7,
  };
}

export function generateMediaContextDisplay(context: MediaContext): string {
  return MEDIA_CONTEXT_CONFIG.display_template
    .replace('{media}', context.media.intensity)
    .replace('{impact}', context.reality.system_impact)
    .replace('{level}', context.reality.relevance_level);
}

export function createCivicFeedback(
  type: FeedbackType,
  topic: string,
  region: string,
  message: string
): CivicFeedback {
  return {
    feedback_id: `cf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    feedback_type: type,
    content: {
      topic,
      region,
      message,
      submitted_at: new Date().toISOString(),
    },
    aggregation: {
      similar_count: 1,
      geographic_spread: [region],
      first_submitted: new Date().toISOString(),
    },
    tracking: {
      is_tracked: true,
      affects_prioritization: true,
      response_status: 'pending',
    },
    privacy: {
      anonymized: true,
      aggregated: true,
      no_individual_identification: true,
    },
  };
}
