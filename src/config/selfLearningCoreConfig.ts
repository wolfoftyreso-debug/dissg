/**
 * 🧠 MASTER EXECUTION BLOCK 54
 * 
 * SELF-LEARNING CORE + TELIA-GRADE SIMPLICITY
 * 
 * NO HARDCODING. Everything driven by data + rules + behavior.
 */

// ============================================================================
// 1. NO HARDCODE CONTRACT
// ============================================================================

export const HARDCODE_FORBIDDEN = [
  'menus',
  'page_order', 
  'heading_texts',
  'summary_length',
  'visible_blocks',
  'default_view',
] as const;

export const HARDCODE_ALLOWED = [
  'rules',
  'thresholds',
  'fallback_modes',
] as const;

// ============================================================================
// 2. DATA → SIGNAL → DECISION (CORE LOOP)
// ============================================================================

export interface CoreLoopStage {
  name: string;
  description: string;
}

export const CORE_LOOP_STAGES: CoreLoopStage[] = [
  { name: 'raw_data', description: 'Ursprunglig data från källa' },
  { name: 'aggregation', description: 'Sammanslagning och beräkning' },
  { name: 'signal', description: 'Vad händer? (trend, avvikelse)' },
  { name: 'relevance', description: 'Vem bryr sig? (prioritering)' },
  { name: 'presentation', description: 'Hur lite kan vi visa?' },
  { name: 'feedback', description: 'Förstod de? (beteendemätning)' },
];

// ============================================================================
// 3. SELF-LEARNING PRESENTATION ENGINE
// ============================================================================

export interface LearningInput {
  clicks: number;
  timeToInsight: number; // seconds
  scrollDepth: number; // 0-1
  backtracking: number; // count
  aiCitations: number;
  externalLinks: number;
}

export interface LearningOutput {
  shorterSummaries: boolean;
  fewerBlocks: boolean;
  betterHeadings: boolean;
  earlierWhatThisShows: boolean;
  earlierWhatThisDoesNotShow: boolean;
}

export const LEARNING_THRESHOLDS = {
  // Trigger simplification when:
  timeToInsightMax: 5, // seconds
  backtrackingMax: 2, // times
  scrollDepthMin: 0.3, // 30%
  
  // Target improvements:
  summaryWordReduction: 0.2, // 20% fewer words
  blockReduction: 0.15, // 15% fewer blocks
};

export function calculateLearningOutput(input: LearningInput): LearningOutput {
  const needsSimplification = 
    input.timeToInsight > LEARNING_THRESHOLDS.timeToInsightMax ||
    input.backtracking > LEARNING_THRESHOLDS.backtrackingMax ||
    input.scrollDepth < LEARNING_THRESHOLDS.scrollDepthMin;

  return {
    shorterSummaries: needsSimplification,
    fewerBlocks: needsSimplification && input.scrollDepth < 0.5,
    betterHeadings: input.backtracking > 1,
    earlierWhatThisShows: input.timeToInsight > 3,
    earlierWhatThisDoesNotShow: input.backtracking > 0,
  };
}

// ============================================================================
// 4. TELIA FEELING (TECHNICALLY DEFINED)
// ============================================================================

export const TELIA_PRINCIPLES = {
  surprises: 0,
  decisionsForUser: 0,
  obviousPathsForward: 1,
  responseTime: 'immediate',
  language: 'exact',
} as const;

export const TELIA_UI_RULES = {
  maxPrimaryActionsPerView: 1,
  clickableMustLookClickable: true,
  noDecorativeAnimations: true,
  noChoicesWithoutConsequence: true,
};

// ============================================================================
// 5. DYNAMIC MENUS (USAGE-BASED)
// ============================================================================

export interface MenuItemStats {
  id: string;
  label: string;
  visits: number;
  citations: number;
  lastUpdated: Date;
  relevanceScore: number;
}

export function rankMenuItems(items: MenuItemStats[]): MenuItemStats[] {
  return [...items].sort((a, b) => {
    // Priority: visits > citations > recency
    const visitScore = (b.visits - a.visits) * 3;
    const citationScore = (b.citations - a.citations) * 2;
    const recencyScore = (b.lastUpdated.getTime() - a.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    
    return visitScore + citationScore + recencyScore;
  });
}

export const MENU_CONFIG = {
  maxVisibleItems: 6,
  minVisitsToShow: 1,
  hideAfterDaysInactive: 30,
};

// ============================================================================
// 6. COPY = DATA-DERIVATIVE
// ============================================================================

export const COPY_RULES = {
  fewerWordsAlwaysWins: true,
  shorterSentencesAlwaysWins: true,
  concreteWordsAlwaysWins: true,
  showUncertaintyEarly: true,
  
  maxWordsPerSentence: 20,
  maxSentencesPerParagraph: 3,
  maxParagraphsPerSection: 2,
};

export interface CopyMetrics {
  wordCount: number;
  avgWordsPerSentence: number;
  readabilityScore: number; // 0-100, higher = simpler
  uncertaintyPosition: number; // 0-1, lower = earlier
}

export function analyzeCopy(text: string): CopyMetrics {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const words = text.split(/\s+/).filter(w => w.trim());
  
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  
  // Simple readability: shorter sentences = higher score
  const readabilityScore = Math.max(0, 100 - (avgWordsPerSentence - 10) * 5);
  
  // Find uncertainty markers
  const uncertaintyMarkers = ['kanske', 'möjligen', 'osäker', 'kan', 'approximately', 'about'];
  let uncertaintyPosition = 1;
  for (const marker of uncertaintyMarkers) {
    const pos = text.toLowerCase().indexOf(marker);
    if (pos !== -1) {
      uncertaintyPosition = Math.min(uncertaintyPosition, pos / text.length);
    }
  }
  
  return {
    wordCount: words.length,
    avgWordsPerSentence,
    readabilityScore,
    uncertaintyPosition,
  };
}

// ============================================================================
// 7. VISUAL MINIMALISM (ENFORCED)
// ============================================================================

export const VISUAL_CONSTRAINTS = {
  maxFonts: 2,
  maxColors: 2, // + grayscale
  noImagesInFactViews: true,
  noIconsWithoutSemantics: true,
};

export const ALLOWED_FONTS = ['Inter', 'system-ui'] as const;

export const ALLOWED_COLORS = {
  primary: 'hsl(var(--primary))',
  accent: 'hsl(var(--accent))',
  grayscale: [
    'hsl(var(--background))',
    'hsl(var(--foreground))',
    'hsl(var(--muted))',
    'hsl(var(--muted-foreground))',
  ],
};

// ============================================================================
// 8. AUTOMATIC SIMPLICITY SCORE
// ============================================================================

export interface SimplicityScore {
  wordsPerInsight: number;
  clicksPerSource: number;
  timeToUnderstanding: number; // seconds
  overallScore: number; // 0-100
}

export function calculateSimplicityScore(metrics: {
  wordCount: number;
  insightCount: number;
  clicksToSource: number;
  timeToUnderstanding: number;
}): SimplicityScore {
  const wordsPerInsight = metrics.wordCount / Math.max(metrics.insightCount, 1);
  const clicksPerSource = metrics.clicksToSource;
  
  // Score: lower is better for words/clicks/time, so invert
  const wordScore = Math.max(0, 100 - wordsPerInsight);
  const clickScore = Math.max(0, 100 - clicksPerSource * 20);
  const timeScore = Math.max(0, 100 - metrics.timeToUnderstanding * 10);
  
  const overallScore = (wordScore + clickScore + timeScore) / 3;
  
  return {
    wordsPerInsight,
    clicksPerSource,
    timeToUnderstanding: metrics.timeToUnderstanding,
    overallScore,
  };
}

export const SIMPLICITY_THRESHOLDS = {
  minScore: 60, // Block deploy if below
  targetScore: 80,
  excellentScore: 90,
};

// ============================================================================
// 9. SYSTEM-LEVEL LEARNING (WEEKLY)
// ============================================================================

export interface WeeklyLearningReport {
  pagesImproved: string[];
  pagesWorsened: string[];
  recurringQuestions: string[];
  unusedViews: string[];
  recommendations: LearningRecommendation[];
}

export interface LearningRecommendation {
  type: 'remove' | 'merge' | 'simplify';
  target: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export const WEEKLY_LEARNING_CONFIG = {
  minPageViewsToEvaluate: 10,
  unusedThresholdDays: 14,
  worseningThreshold: -0.1, // 10% decline
  improvementThreshold: 0.05, // 5% improvement
};

// ============================================================================
// 10. DEFINITION OF DONE
// ============================================================================

export const DONE_CRITERIA = {
  noOneAsksHowItWorks: true,
  usersClickLessUnderstandMore: true,
  aiCitesWithoutMisinterpretation: true,
  textsShorterEveryWeek: true,
  siteFeelsSelfEvident: true,
};

export function checkDoneCriteria(metrics: {
  confusionQuestions: number;
  avgClicks: number;
  avgUnderstanding: number;
  aiMisinterpretations: number;
  textLengthTrend: number; // negative = getting shorter
}): { passed: boolean; failures: string[] } {
  const failures: string[] = [];
  
  if (metrics.confusionQuestions > 0) {
    failures.push('Users still asking "how does this work?"');
  }
  if (metrics.avgClicks > 3) {
    failures.push('Too many clicks to reach insight');
  }
  if (metrics.aiMisinterpretations > 0) {
    failures.push('AI still misinterpreting content');
  }
  if (metrics.textLengthTrend >= 0) {
    failures.push('Texts not getting shorter over time');
  }
  
  return {
    passed: failures.length === 0,
    failures,
  };
}
