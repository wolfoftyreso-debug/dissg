/**
 * COGNITIVE DEPTH CONTROL (ANTI-INFODUMP)
 * 
 * Depth is progressive, never overwhelming.
 * - Level 1: Orientation
 * - Level 2: Relationships
 * - Level 3: Mechanisms
 * - Level 4: History
 * - Level 5: Uncertainties & Gaps
 * 
 * The user chooses the pace. The system never loses structure.
 */

/**
 * DEPTH LEVELS
 */
export type DepthLevel = 1 | 2 | 3 | 4 | 5;

export interface DepthLevelDefinition {
  readonly level: DepthLevel;
  readonly name: string;
  readonly purpose: string;
  readonly content_types: readonly string[];
  readonly cognitive_load: 'low' | 'medium' | 'high';
  readonly typical_time: string;
}

export const DEPTH_LEVELS: Record<DepthLevel, DepthLevelDefinition> = {
  1: {
    level: 1,
    name: 'Orientation',
    purpose: 'Where am I? What is this?',
    content_types: ['current_state', 'attention_marker', 'one_sentence_summary'],
    cognitive_load: 'low',
    typical_time: '5 seconds',
  },
  2: {
    level: 2,
    name: 'Relationships',
    purpose: 'How does this connect to other things?',
    content_types: ['couplings', 'context', 'comparisons'],
    cognitive_load: 'low',
    typical_time: '30 seconds',
  },
  3: {
    level: 3,
    name: 'Mechanisms',
    purpose: 'How does this work? What drives it?',
    content_types: ['contributing_factors', 'system_dynamics', 'causal_hypotheses'],
    cognitive_load: 'medium',
    typical_time: '2 minutes',
  },
  4: {
    level: 4,
    name: 'History',
    purpose: 'How did we get here? What changed?',
    content_types: ['time_series', 'trend_changes', 'events', 'methodology_changes'],
    cognitive_load: 'medium',
    typical_time: '5 minutes',
  },
  5: {
    level: 5,
    name: 'Uncertainties & Gaps',
    purpose: 'What don\'t we know? What limits this?',
    content_types: ['data_gaps', 'methodology_limits', 'alternative_interpretations', 'confidence_bounds'],
    cognitive_load: 'high',
    typical_time: '10 minutes',
  },
} as const;

/**
 * DEPTH CONTENT STRUCTURE
 */
export interface DepthContent {
  readonly level: DepthLevel;
  readonly content: unknown;
  readonly has_deeper: boolean;
  readonly next_level_preview?: string;
  readonly estimated_time?: string;
}

export interface ProgressiveDisclosure {
  readonly topic_id: string;
  readonly current_level: DepthLevel;
  readonly levels: Record<DepthLevel, DepthContent | null>;
  readonly max_available_depth: DepthLevel;
  readonly navigation: {
    can_go_deeper: boolean;
    can_go_shallower: boolean;
    deeper_preview?: string;
    shallower_summary?: string;
  };
}

/**
 * BUILD PROGRESSIVE DISCLOSURE
 */
export function buildProgressiveDisclosure(
  topic_id: string,
  levels: Partial<Record<DepthLevel, unknown>>
): ProgressiveDisclosure {
  const availableLevels = Object.keys(levels).map(Number) as DepthLevel[];
  const maxDepth = Math.max(...availableLevels) as DepthLevel;
  
  const depthContents: Record<DepthLevel, DepthContent | null> = {
    1: null, 2: null, 3: null, 4: null, 5: null,
  };
  
  for (const level of availableLevels) {
    const hasDeeper = availableLevels.includes((level + 1) as DepthLevel);
    depthContents[level] = {
      level,
      content: levels[level],
      has_deeper: hasDeeper,
      next_level_preview: hasDeeper ? DEPTH_LEVELS[(level + 1) as DepthLevel]?.purpose : undefined,
      estimated_time: DEPTH_LEVELS[level].typical_time,
    };
  }
  
  const currentLevel = Math.min(...availableLevels) as DepthLevel;
  
  return {
    topic_id,
    current_level: currentLevel,
    levels: depthContents,
    max_available_depth: maxDepth,
    navigation: {
      can_go_deeper: currentLevel < maxDepth,
      can_go_shallower: currentLevel > 1,
      deeper_preview: DEPTH_LEVELS[(currentLevel + 1) as DepthLevel]?.purpose,
      shallower_summary: currentLevel > 1 ? DEPTH_LEVELS[(currentLevel - 1) as DepthLevel]?.purpose : undefined,
    },
  };
}

/**
 * DEPTH NAVIGATION
 */
export function navigateDepth(
  disclosure: ProgressiveDisclosure,
  direction: 'deeper' | 'shallower'
): ProgressiveDisclosure {
  const currentLevel = disclosure.current_level;
  let newLevel: DepthLevel;
  
  if (direction === 'deeper') {
    newLevel = Math.min(currentLevel + 1, disclosure.max_available_depth) as DepthLevel;
  } else {
    newLevel = Math.max(currentLevel - 1, 1) as DepthLevel;
  }
  
  return {
    ...disclosure,
    current_level: newLevel,
    navigation: {
      can_go_deeper: newLevel < disclosure.max_available_depth,
      can_go_shallower: newLevel > 1,
      deeper_preview: DEPTH_LEVELS[(newLevel + 1) as DepthLevel]?.purpose,
      shallower_summary: newLevel > 1 ? DEPTH_LEVELS[(newLevel - 1) as DepthLevel]?.purpose : undefined,
    },
  };
}

/**
 * ANTI-INFODUMP CHECK
 * Ensures content is appropriate for the depth level
 */
export function validateDepthContent(
  level: DepthLevel,
  content: Record<string, unknown>
): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const levelDef = DEPTH_LEVELS[level];
  
  // Check cognitive load
  const contentSize = JSON.stringify(content).length;
  const maxSize = level === 1 ? 500 : level === 2 ? 2000 : level === 3 ? 5000 : level === 4 ? 10000 : 20000;
  
  if (contentSize > maxSize) {
    issues.push(`Content exceeds recommended size for level ${level} (${levelDef.name})`);
  }
  
  // Check for appropriate content types
  const hasAppropriateContent = levelDef.content_types.some(type => 
    Object.keys(content).some(key => key.toLowerCase().includes(type.replace('_', '')))
  );
  
  if (!hasAppropriateContent) {
    issues.push(`Content may not match expected types for level ${level}`);
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}
