/**
 * 🧠 CORE PRINCIPLE: INFINITE DEPTH, ZERO CONFUSION
 * 
 * All understanding is clickable downward — without ever becoming messy upward.
 * 
 * Axiom (locked):
 * - No explanation is final
 * - Every statement is an entrance, not a wall
 * - User never has to go deeper
 * - System must always be able to go deeper
 */

// ============================================
// EXPLANATION LEVELS (0-4)
// ============================================

export const EXPLANATION_LEVELS = {
  0: {
    name: 'OBSERVATION',
    description: 'What 90% see',
    rules: [
      '1-2 sentences only',
      'What the data shows',
      'No method',
      'No theory',
      'No history',
    ],
    template: 'Observed data shows that {subject} has {direction} in {location} over {period}.',
    nextPrompt: 'Why does the data show this?',
    maxSentences: 2,
    maxWords: 40,
  },
  
  1: {
    name: 'MECHANISM',
    description: 'For those who want to understand how',
    rules: [
      'What is measured',
      'Which indicators are included',
      'How they are aggregated',
    ],
    template: 'This observation is based on indicators {indicators}, aggregated at {level} level.',
    nextPrompt: 'How are these indicators built?',
    maxSentences: 4,
    maxWords: 80,
  },
  
  2: {
    name: 'METHOD',
    description: 'For those who want to understand exactly how',
    rules: [
      'Data sources',
      'Definitions',
      'Calculations',
      'Uncertainty',
    ],
    template: 'Indicator {indicator} is calculated from source {source} using method {method}.',
    nextPrompt: 'What are the limitations of this method?',
    maxSentences: 6,
    maxWords: 120,
  },
  
  3: {
    name: 'LIMITATIONS',
    description: 'For the critical thinker',
    rules: [
      'What is missing',
      'What is not measured',
      'What can be misinterpreted',
    ],
    template: 'This data does not capture {exclusions}.',
    nextPrompt: 'What would be required to measure this better?',
    maxSentences: 5,
    maxWords: 100,
  },
  
  4: {
    name: 'RAW_DATA',
    description: 'For researchers, AI, reviewers',
    rules: [
      'Raw data access',
      'API endpoints',
      'Version history',
      'Trust log',
    ],
    template: 'Raw data available via {api_endpoint}. Last updated: {timestamp}.',
    nextPrompt: 'View raw data / cite / reproduce',
    maxSentences: null, // No limit at this level
    maxWords: null,
  },
} as const;

export type ExplanationLevel = keyof typeof EXPLANATION_LEVELS;

// ============================================
// EXPLANATION NODE STRUCTURE
// ============================================

export interface ExplanationNode {
  node_id: string;
  explains: string | null; // Parent node ID (null if root)
  level: ExplanationLevel;
  scope: string;
  content: string;
  sources: string[];
  limitations: string[];
  children: string[]; // Child node IDs
  
  // Metadata
  created_at: string;
  version: number;
  
  // URLs for each level (for SEO)
  url: string;
  breadcrumb: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  url: string;
  level: ExplanationLevel;
}

// ============================================
// ANTI-BULLSHIT LOCK
// ============================================

export const FORBIDDEN_PATTERNS = {
  conclusions: [
    /this means/i,
    /therefore/i,
    /we can conclude/i,
    /this proves/i,
    /clearly shows/i,
  ],
  suggestions: [
    /should/i,
    /must/i,
    /ought to/i,
    /recommend/i,
    /consider doing/i,
  ],
  speculation: [
    /might/i,
    /could potentially/i,
    /may indicate/i,
    /suggests that/i,
    /probably/i,
  ],
  normative: [
    /good/i,
    /bad/i,
    /better/i,
    /worse/i,
    /successful/i,
    /failed/i,
    /important/i,
  ],
} as const;

export function validateExplanationContent(content: string, level: ExplanationLevel): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  // Check all forbidden patterns
  Object.entries(FORBIDDEN_PATTERNS).forEach(([category, patterns]) => {
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        violations.push(`${category}: "${content.match(pattern)?.[0]}"`);
      }
    });
  });
  
  // Check level-specific rules
  const levelConfig = EXPLANATION_LEVELS[level];
  
  if (levelConfig.maxSentences) {
    const sentenceCount = content.split(/[.!?]/).filter(Boolean).length;
    if (sentenceCount > levelConfig.maxSentences) {
      violations.push(`Too many sentences: ${sentenceCount} > ${levelConfig.maxSentences}`);
    }
  }
  
  if (levelConfig.maxWords) {
    const wordCount = content.split(/\s+/).length;
    if (wordCount > levelConfig.maxWords) {
      violations.push(`Too many words: ${wordCount} > ${levelConfig.maxWords}`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

// ============================================
// URL GENERATION FOR EACH LEVEL
// ============================================

export function generateLevelUrl(
  baseSlug: string,
  level: ExplanationLevel
): string {
  const levelSlugs: Record<ExplanationLevel, string> = {
    0: '',
    1: '/mechanism',
    2: '/method',
    3: '/limitations',
    4: '/data',
  };
  
  return `/explain/${baseSlug}${levelSlugs[level]}`;
}

export function generateBreadcrumb(
  baseSlug: string,
  baseName: string,
  currentLevel: ExplanationLevel
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];
  
  for (let i = 0; i <= currentLevel; i++) {
    const level = i as ExplanationLevel;
    items.push({
      label: EXPLANATION_LEVELS[level].name,
      url: generateLevelUrl(baseSlug, level),
      level,
    });
  }
  
  return items;
}

// ============================================
// QUALITY TEST (MANDATORY)
// ============================================

export interface QualityTestResult {
  passed: boolean;
  checks: {
    canUnderstandAtLevel0: boolean;
    canReproduceAtLevel4: boolean;
    noTrustRequired: boolean;
  };
  failures: string[];
}

export function runQualityTest(nodes: ExplanationNode[]): QualityTestResult {
  const failures: string[] = [];
  
  // Check 1: Can I stay at level 0 and still understand?
  const level0Nodes = nodes.filter(n => n.level === 0);
  const canUnderstandAtLevel0 = level0Nodes.every(n => {
    const wordCount = n.content.split(/\s+/).length;
    return wordCount <= 40 && n.content.length > 0;
  });
  
  if (!canUnderstandAtLevel0) {
    failures.push('Level 0 nodes are not self-contained or too long');
  }
  
  // Check 2: Can I go to level 4 and reproduce?
  const level4Nodes = nodes.filter(n => n.level === 4);
  const canReproduceAtLevel4 = level4Nodes.every(n => 
    n.sources.length > 0 || n.content.includes('api') || n.content.includes('data')
  );
  
  if (!canReproduceAtLevel4) {
    failures.push('Level 4 nodes lack reproducibility (no sources or API)');
  }
  
  // Check 3: Is there any point where the system asks me to trust it?
  const noTrustRequired = nodes.every(n => {
    const trustPatterns = [
      /trust us/i,
      /believe/i,
      /take our word/i,
      /we know/i,
      /experts say/i,
    ];
    return !trustPatterns.some(p => p.test(n.content));
  });
  
  if (!noTrustRequired) {
    failures.push('Some nodes require trust instead of evidence');
  }
  
  return {
    passed: failures.length === 0,
    checks: {
      canUnderstandAtLevel0,
      canReproduceAtLevel4,
      noTrustRequired,
    },
    failures,
  };
}

// ============================================
// DEPTH ANALYTICS (SELF-LEARNING)
// ============================================

export interface DepthAnalytics {
  node_id: string;
  clicks_to_deeper: number;
  time_on_level_ms: number;
  backs_from_level: number;
  confusion_signals: number; // Re-reads, rapid scrolling, etc.
}

export function analyzeDepthUsage(analytics: DepthAnalytics[]): {
  levelsToClarify: ExplanationLevel[];
  levelsToShorten: ExplanationLevel[];
  microExplanationsNeeded: string[];
} {
  const levelStats = new Map<ExplanationLevel, {
    avgTime: number;
    backRate: number;
    confusionRate: number;
  }>();
  
  // Group by level and compute stats
  // (In real implementation, this would use the analytics data)
  
  return {
    levelsToClarify: [], // Levels where people get stuck
    levelsToShorten: [], // Levels people skip quickly
    microExplanationsNeeded: [], // Specific nodes needing inline help
  };
}

// ============================================
// PROMPT LABELS (UX)
// ============================================

export const DEPTH_PROMPTS = {
  goDeeper: [
    'Explain more',
    'Show how this is built',
    'Show method',
    'Show limitations',
    'View raw data',
  ],
  
  goShallower: [
    'Back to summary',
    'Back to overview',
  ],
  
  actions: {
    cite: 'Cite this',
    reproduce: 'Reproduce',
    download: 'Download data',
    api: 'API access',
  },
} as const;
