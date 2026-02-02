/**
 * WAVE 17 — BLOCK FD, FE, FF, FG
 * PRIORITY STACK, WHY IT MATTERS, ATTENTION MISMATCH & OVERRIDES
 * 
 * Användaren drunknar aldrig.
 * En gymnasieelev ska förstå.
 */

import { RelevanceLevel, RELEVANCE_LEVELS } from './civilizationRelevanceConfig';

// ============================================
// BLOCK FD: PRIORITY STACK (HUR DATA VISAS)
// ============================================

export interface PriorityStackItem {
  item_id: string;
  item_type: string;
  
  relevance_level: RelevanceLevel;
  impact_score: number;
  
  display_priority: number; // 1 = highest
  
  visibility: 'prominent' | 'standard' | 'collapsed' | 'hidden';
  
  requires_action_to_view: boolean;
  
  labels: {
    level_badge: string;
    impact_badge: string;
  };
}

export interface PriorityStackView {
  view_id: string;
  generated_at: string;
  
  total_items: number;
  
  stacks: {
    prominent: PriorityStackItem[];  // L3-L4, high impact
    standard: PriorityStackItem[];   // L2, medium impact
    collapsed: PriorityStackItem[];  // L1, lower impact
    hidden: PriorityStackItem[];     // L0, noise
  };
  
  user_customizations: {
    has_overrides: boolean;
    override_count: number;
  };
}

export const PRIORITY_STACK_RULES = {
  display: {
    rule_1: {
      rule: 'Visa högsta relevans först',
      implementation: 'Sort by relevance_level DESC, then impact_score DESC',
      mandatory: true,
    },
    rule_2: {
      rule: 'Kräv aktiv handling för låg relevans',
      implementation: 'L0-L1 items require click/expand to view details',
      mandatory: true,
    },
    rule_3: {
      rule: 'Märk allt med nivå + påverkan',
      implementation: 'Every item shows relevance badge and impact badge',
      mandatory: true,
    },
  },
  
  visibility_mapping: {
    L4: 'prominent',
    L3: 'prominent',
    L2: 'standard',
    L1: 'collapsed',
    L0: 'hidden',
  } as Record<RelevanceLevel, PriorityStackItem['visibility']>,
  
  principle: 'Bruset finns – men styr inte.',
} as const;

// ============================================
// BLOCK FE: "WHY THIS MATTERS" LAYER
// ============================================

export interface WhyItMattersExplanation {
  object_id: string;
  object_type: string;
  
  mandatory_answers: {
    why_shown: string;           // Varför visas detta?
    what_it_affects: string;     // Vad påverkar det?
    at_which_level: string;      // På vilken nivå?
    on_what_horizon: string;     // På vilken sikt?
  };
  
  simplified_version: string;    // En gymnasieelev ska förstå
  
  context: {
    decision_chain_position: string;
    related_higher_level: string | null;
    related_lower_level: string | null;
  };
  
  links: {
    full_analysis: string;
    raw_data: string;
    methodology: string;
  };
}

export const WHY_IT_MATTERS_CONFIG = {
  mandatory_questions: [
    { key: 'why_shown', question: 'Varför visas detta?', required: true },
    { key: 'what_it_affects', question: 'Vad påverkar det?', required: true },
    { key: 'at_which_level', question: 'På vilken nivå?', required: true },
    { key: 'on_what_horizon', question: 'På vilken sikt?', required: true },
  ],
  
  readability: {
    target_audience: 'gymnasieelev',
    max_sentence_length: 25,
    avoid_jargon: true,
    required_plain_language: true,
  },
  
  template: {
    why_shown: 'Detta visas för att {reason}.',
    what_it_affects: 'Det påverkar {effects}.',
    at_which_level: 'Detta sker på {level}-nivå.',
    on_what_horizon: 'Effekterna syns på {horizon}.',
  },
  
  principle: 'En gymnasieelev ska förstå.',
} as const;

// ============================================
// BLOCK FF: MISPLACED ATTENTION DETECTOR
// ============================================

export interface AttentionMismatch {
  mismatch_id: string;
  detected_at: string;
  
  subject: {
    id: string;
    type: string;
    title: string;
  };
  
  analysis: {
    actual_impact_score: number;
    actual_relevance_level: RelevanceLevel;
    
    attention_metrics: {
      media_mentions: number;
      search_volume: number;
      social_activity: number;
      political_mentions: number;
    };
    
    attention_score: number; // 0-100 normalized
    
    mismatch_ratio: number; // attention / impact
    mismatch_direction: 'over_attention' | 'under_attention' | 'balanced';
  };
  
  display: {
    message: string;
    severity: 'info' | 'notable' | 'significant';
  };
}

export const ATTENTION_MISMATCH_CONFIG = {
  thresholds: {
    over_attention: 2.0,   // attention/impact > 2 = getting too much attention
    under_attention: 0.5,  // attention/impact < 0.5 = getting too little attention
  },
  
  display_templates: {
    over_attention: 'Detta får oproportionerligt mycket uppmärksamhet i förhållande till påverkan.',
    under_attention: 'Detta har högre påverkan än uppmärksamheten antyder.',
    balanced: 'Uppmärksamhet och påverkan är i balans.',
  },
  
  severity_mapping: {
    minor: { ratio_threshold: 1.5, severity: 'info' },
    moderate: { ratio_threshold: 2.5, severity: 'notable' },
    major: { ratio_threshold: 4.0, severity: 'significant' },
  },
  
  principle: 'Detta är revolutionerande – och korrekt.',
} as const;

// ============================================
// BLOCK FG: USER RELEVANCE OVERRIDES
// ============================================

export interface RelevanceOverride {
  override_id: string;
  user_id: string;
  created_at: string;
  
  target: {
    object_id: string;
    object_type: string;
  };
  
  override: {
    original_level: RelevanceLevel;
    user_level: RelevanceLevel;
    reason: string | null;
  };
  
  transparency: {
    deviation_shown: boolean;
    deviation_magnitude: number; // -4 to +4 levels
    affects_sharing: boolean;
  };
  
  sharing_behavior: {
    shared_views_show_override: boolean;
    shared_views_show_deviation: boolean;
  };
}

export interface OverrideTransparency {
  has_overrides: boolean;
  override_count: number;
  deviation_summary: {
    elevated_count: number;
    lowered_count: number;
    average_deviation: number;
  };
  
  display_message: string | null;
}

export const RELEVANCE_OVERRIDE_CONFIG = {
  rules: {
    user_can_override: true,
    must_show_deviation: true,
    sharing_shows_override: true,
  },
  
  transparency: {
    deviation_display: {
      template: 'Du har prioriterat detta {direction} ({original} → {user})',
      direction_up: 'högre',
      direction_down: 'lägre',
    },
    
    sharing_notice: 'Din vy använder anpassad prioritering som avviker från standardvyn.',
    
    comparison_available: true,
    comparison_label: 'Jämför med standardprioritering',
  },
  
  principles: {
    agenda_prevention: 'Ingen kan smyga in agenda.',
    user_control: 'Användaren kan ändra',
    consequence_visibility: 'men ser konsekvensen',
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createPriorityStackItem(
  itemId: string,
  itemType: string,
  relevanceLevel: RelevanceLevel,
  impactScore: number
): PriorityStackItem {
  const visibility = PRIORITY_STACK_RULES.visibility_mapping[relevanceLevel];
  const levelDef = RELEVANCE_LEVELS[relevanceLevel];
  
  // Calculate display priority (lower = higher priority)
  const levelPriority = { L4: 0, L3: 1, L2: 2, L1: 3, L0: 4 };
  const displayPriority = levelPriority[relevanceLevel] * 100 + (100 - impactScore);
  
  return {
    item_id: itemId,
    item_type: itemType,
    relevance_level: relevanceLevel,
    impact_score: impactScore,
    display_priority: displayPriority,
    visibility,
    requires_action_to_view: visibility === 'collapsed' || visibility === 'hidden',
    labels: {
      level_badge: `${levelDef.icon} ${levelDef.name}`,
      impact_badge: `Påverkan: ${impactScore}%`,
    },
  };
}

export function generateWhyItMatters(
  objectId: string,
  objectType: string,
  relevanceLevel: RelevanceLevel,
  impactDescription: string,
  horizon: string
): WhyItMattersExplanation {
  const levelDef = RELEVANCE_LEVELS[relevanceLevel];
  
  return {
    object_id: objectId,
    object_type: objectType,
    mandatory_answers: {
      why_shown: `det ligger på ${levelDef.name}-nivå med ${levelDef.characteristics.scope}`,
      what_it_affects: impactDescription,
      at_which_level: levelDef.name,
      on_what_horizon: horizon,
    },
    simplified_version: `Detta är ${levelDef.name.toLowerCase()}-nivå. ${impactDescription}. Effekterna syns ${horizon}.`,
    context: {
      decision_chain_position: levelDef.characteristics.scope,
      related_higher_level: relevanceLevel !== 'L4' ? RELEVANCE_LEVELS[`L${parseInt(relevanceLevel[1]) + 1}` as RelevanceLevel]?.name || null : null,
      related_lower_level: relevanceLevel !== 'L0' ? RELEVANCE_LEVELS[`L${parseInt(relevanceLevel[1]) - 1}` as RelevanceLevel]?.name || null : null,
    },
    links: {
      full_analysis: `/analysis/${objectId}`,
      raw_data: `/data/${objectId}`,
      methodology: `/methodology/${objectType}`,
    },
  };
}

export function detectAttentionMismatch(
  objectId: string,
  objectType: string,
  title: string,
  impactScore: number,
  relevanceLevel: RelevanceLevel,
  attentionMetrics: AttentionMismatch['analysis']['attention_metrics']
): AttentionMismatch {
  // Calculate normalized attention score
  const attentionScore = Math.min(100, (
    attentionMetrics.media_mentions * 0.3 +
    attentionMetrics.search_volume * 0.25 +
    attentionMetrics.social_activity * 0.25 +
    attentionMetrics.political_mentions * 0.2
  ) / 10);
  
  const ratio = impactScore > 0 ? attentionScore / impactScore : 0;
  
  let direction: AttentionMismatch['analysis']['mismatch_direction'] = 'balanced';
  let message: string = ATTENTION_MISMATCH_CONFIG.display_templates.balanced;
  let severity: AttentionMismatch['display']['severity'] = 'info';
  
  if (ratio > ATTENTION_MISMATCH_CONFIG.thresholds.over_attention) {
    direction = 'over_attention';
    message = ATTENTION_MISMATCH_CONFIG.display_templates.over_attention as string;
    severity = ratio > 4 ? 'significant' : ratio > 2.5 ? 'notable' : 'info';
  } else if (ratio < ATTENTION_MISMATCH_CONFIG.thresholds.under_attention) {
    direction = 'under_attention';
    message = ATTENTION_MISMATCH_CONFIG.display_templates.under_attention as string;
    severity = ratio < 0.25 ? 'significant' : ratio < 0.4 ? 'notable' : 'info';
  }
  
  return {
    mismatch_id: `mismatch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    detected_at: new Date().toISOString(),
    subject: { id: objectId, type: objectType, title },
    analysis: {
      actual_impact_score: impactScore,
      actual_relevance_level: relevanceLevel,
      attention_metrics: attentionMetrics,
      attention_score: attentionScore,
      mismatch_ratio: ratio,
      mismatch_direction: direction,
    },
    display: { message, severity },
  };
}

export function createRelevanceOverride(
  userId: string,
  objectId: string,
  objectType: string,
  originalLevel: RelevanceLevel,
  userLevel: RelevanceLevel,
  reason?: string
): RelevanceOverride {
  const levelToNum = { L0: 0, L1: 1, L2: 2, L3: 3, L4: 4 };
  const deviation = levelToNum[userLevel] - levelToNum[originalLevel];
  
  return {
    override_id: `override_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId,
    created_at: new Date().toISOString(),
    target: { object_id: objectId, object_type: objectType },
    override: {
      original_level: originalLevel,
      user_level: userLevel,
      reason: reason || null,
    },
    transparency: {
      deviation_shown: true,
      deviation_magnitude: deviation,
      affects_sharing: true,
    },
    sharing_behavior: {
      shared_views_show_override: true,
      shared_views_show_deviation: true,
    },
  };
}

export const PRIORITY_STACK_STATUS = {
  version: '17.0',
  blocks: ['FD', 'FE', 'FF', 'FG'],
  outputs: [
    'priority_stack_v1',
    'why_it_matters_v1',
    'attention_mismatch_engine_v1',
    'relevance_override_v1',
  ],
  principles: [
    'Användaren drunknar aldrig.',
    'En gymnasieelev ska förstå.',
    'Detta är revolutionerande – och korrekt.',
    'Ingen kan smyga in agenda.',
  ],
} as const;
