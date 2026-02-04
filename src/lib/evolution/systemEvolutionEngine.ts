/**
 * SYSTEM EVOLUTION ENGINE
 * 
 * Self-improving architecture based on:
 * 1. ANATOMICAL EVOLUTION - Structure optimizes based on usage patterns
 * 2. SEMANTIC EVOLUTION - Meaning expands based on query gaps
 * 3. EPISTEMIC EVOLUTION - Self-criticism improves based on misinterpretations
 * 
 * "A system that knows it doesn't know everything can learn."
 */

// =============================================================================
// ANATOMICAL EVOLUTION - Usage Pattern Analysis
// =============================================================================

export interface UsageEvent {
  eventType: 
    | 'page_view'
    | 'click'
    | 'search'
    | 'drill_down'
    | 'comparison'
    | 'export'
    | 'time_spent'
    | 'scroll_depth'
    | 'bounce';
  path: string;
  component?: string;
  entityType?: 'country' | 'region' | 'indicator' | 'question' | 'action';
  entityId?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

export interface UsagePattern {
  patternType: 'hot_path' | 'friction_point' | 'dead_end' | 'loop' | 'deep_dive';
  frequency: number;
  paths: string[];
  avgTimeSpent?: number;
  conversionRate?: number;
  recommendation: string;
}

export interface AnatomicalInsight {
  category: 'navigation' | 'content' | 'performance' | 'pedagogy';
  severity: 'info' | 'suggestion' | 'warning' | 'critical';
  insight: string;
  evidence: string[];
  recommendation: string;
  autoFixable: boolean;
  estimatedImpact: number; // 0-100
}

/**
 * Analyze usage patterns to identify structural improvements
 */
export function analyzeUsagePatterns(events: UsageEvent[]): {
  patterns: UsagePattern[];
  insights: AnatomicalInsight[];
  hotPaths: string[];
  frictionPoints: string[];
  deadEnds: string[];
} {
  const pathCounts = new Map<string, number>();
  const pathTimes = new Map<string, number[]>();
  const bounces = new Map<string, number>();
  const sequences: string[][] = [];
  
  // Group by session
  const sessions = new Map<string, UsageEvent[]>();
  for (const event of events) {
    const session = sessions.get(event.sessionId) || [];
    session.push(event);
    sessions.set(event.sessionId, session);
  }
  
  // Analyze each session
  for (const [sessionId, sessionEvents] of sessions) {
    const path: string[] = [];
    
    for (const event of sessionEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())) {
      if (event.eventType === 'page_view') {
        path.push(event.path);
        pathCounts.set(event.path, (pathCounts.get(event.path) || 0) + 1);
      }
      
      if (event.eventType === 'time_spent' && event.metadata?.seconds) {
        const times = pathTimes.get(event.path) || [];
        times.push(event.metadata.seconds as number);
        pathTimes.set(event.path, times);
      }
      
      if (event.eventType === 'bounce') {
        bounces.set(event.path, (bounces.get(event.path) || 0) + 1);
      }
    }
    
    if (path.length > 1) {
      sequences.push(path);
    }
  }
  
  // Identify patterns
  const patterns: UsagePattern[] = [];
  const insights: AnatomicalInsight[] = [];
  
  // Hot paths (most visited)
  const sortedPaths = [...pathCounts.entries()].sort((a, b) => b[1] - a[1]);
  const hotPaths = sortedPaths.slice(0, 10).map(([path]) => path);
  
  if (hotPaths.length > 0) {
    patterns.push({
      patternType: 'hot_path',
      frequency: sortedPaths[0]?.[1] || 0,
      paths: hotPaths,
      recommendation: 'Optimera dessa sidor för prestanda och pedagogik'
    });
  }
  
  // Friction points (high time spent + high bounce)
  const frictionPoints: string[] = [];
  for (const [path, times] of pathTimes) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const bounceRate = (bounces.get(path) || 0) / (pathCounts.get(path) || 1);
    
    if (avgTime > 60 && bounceRate > 0.3) {
      frictionPoints.push(path);
      insights.push({
        category: 'pedagogy',
        severity: 'warning',
        insight: `Användare spenderar lång tid på ${path} men lämnar ofta`,
        evidence: [
          `Genomsnittlig tid: ${avgTime.toFixed(0)}s`,
          `Bounce rate: ${(bounceRate * 100).toFixed(0)}%`
        ],
        recommendation: 'Förbättra pedagogisk klarhet eller navigationsalternativ',
        autoFixable: false,
        estimatedImpact: 60
      });
    }
  }
  
  // Dead ends (pages with no outbound navigation)
  const deadEnds: string[] = [];
  const outboundLinks = new Map<string, Set<string>>();
  
  for (const sequence of sequences) {
    for (let i = 0; i < sequence.length - 1; i++) {
      const links = outboundLinks.get(sequence[i]) || new Set();
      links.add(sequence[i + 1]);
      outboundLinks.set(sequence[i], links);
    }
  }
  
  for (const [path, count] of pathCounts) {
    if (!outboundLinks.has(path) && count > 5) {
      deadEnds.push(path);
      insights.push({
        category: 'navigation',
        severity: 'suggestion',
        insight: `${path} är en återvändsgränd - användare navigerar inte vidare`,
        evidence: [`${count} besök utan vidare navigation`],
        recommendation: 'Lägg till relevanta fördjupningslänkar',
        autoFixable: true,
        estimatedImpact: 40
      });
    }
  }
  
  // Navigation loops
  for (const sequence of sequences) {
    const seen = new Set<string>();
    for (const path of sequence) {
      if (seen.has(path)) {
        patterns.push({
          patternType: 'loop',
          frequency: 1,
          paths: sequence,
          recommendation: 'Användare verkar leta efter något - förbättra sökvägar'
        });
        break;
      }
      seen.add(path);
    }
  }
  
  return {
    patterns,
    insights,
    hotPaths,
    frictionPoints,
    deadEnds
  };
}

// =============================================================================
// SEMANTIC EVOLUTION - Query Gap Detection
// =============================================================================

export interface QueryAttempt {
  query: string;
  queryType: 'search' | 'question' | 'filter' | 'comparison';
  resultCount: number;
  resultsClicked: number;
  timestamp: Date;
  language: string;
}

export interface SemanticGap {
  gapType: 'missing_term' | 'missing_entity' | 'missing_relation' | 'missing_translation';
  query: string;
  frequency: number;
  relatedTerms: string[];
  suggestedAction: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SemanticExpansion {
  expansionType: 'synonym' | 'translation' | 'entity' | 'relation' | 'hierarchy';
  source: string;
  target: string;
  confidence: number;
  evidence: string[];
}

/**
 * Detect semantic gaps in the system's understanding
 */
export function detectSemanticGaps(queries: QueryAttempt[]): {
  gaps: SemanticGap[];
  expansions: SemanticExpansion[];
  unmatchedQueries: string[];
  frequentPatterns: { pattern: string; count: number }[];
} {
  const gaps: SemanticGap[] = [];
  const expansions: SemanticExpansion[] = [];
  const unmatchedQueries: string[] = [];
  const queryFrequency = new Map<string, number>();
  const noResultQueries = new Map<string, number>();
  
  // Analyze queries
  for (const q of queries) {
    const normalizedQuery = q.query.toLowerCase().trim();
    queryFrequency.set(normalizedQuery, (queryFrequency.get(normalizedQuery) || 0) + 1);
    
    if (q.resultCount === 0) {
      noResultQueries.set(normalizedQuery, (noResultQueries.get(normalizedQuery) || 0) + 1);
      unmatchedQueries.push(normalizedQuery);
    }
    
    // Low click-through = possible semantic mismatch
    if (q.resultCount > 0 && q.resultsClicked === 0) {
      gaps.push({
        gapType: 'missing_relation',
        query: normalizedQuery,
        frequency: 1,
        relatedTerms: [],
        suggestedAction: 'Resultaten matchar inte användarens intent',
        priority: 'medium'
      });
    }
  }
  
  // Identify frequent no-result queries
  for (const [query, count] of noResultQueries) {
    if (count >= 3) {
      const priority = count >= 10 ? 'critical' : count >= 5 ? 'high' : 'medium';
      gaps.push({
        gapType: 'missing_term',
        query,
        frequency: count,
        relatedTerms: findSimilarTerms(query, [...queryFrequency.keys()]),
        suggestedAction: `Lägg till "${query}" som sökbar term eller synonym`,
        priority
      });
    }
  }
  
  // Find potential synonyms from similar queries
  const queryList = [...queryFrequency.keys()];
  for (let i = 0; i < queryList.length; i++) {
    for (let j = i + 1; j < queryList.length; j++) {
      const similarity = calculateStringSimilarity(queryList[i], queryList[j]);
      if (similarity > 0.7 && similarity < 1) {
        expansions.push({
          expansionType: 'synonym',
          source: queryList[i],
          target: queryList[j],
          confidence: similarity,
          evidence: [
            `Liknande söktermer (${(similarity * 100).toFixed(0)}% likhet)`,
            `Frekvens: ${queryFrequency.get(queryList[i])} vs ${queryFrequency.get(queryList[j])}`
          ]
        });
      }
    }
  }
  
  // Frequent patterns
  const frequentPatterns = [...queryFrequency.entries()]
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([pattern, count]) => ({ pattern, count }));
  
  return {
    gaps,
    expansions,
    unmatchedQueries: [...new Set(unmatchedQueries)],
    frequentPatterns
  };
}

function findSimilarTerms(query: string, allTerms: string[]): string[] {
  return allTerms
    .filter(term => term !== query && calculateStringSimilarity(query, term) > 0.5)
    .slice(0, 5);
}

function calculateStringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  
  // Simple Jaccard similarity on character bigrams
  const bigramsA = new Set<string>();
  const bigramsB = new Set<string>();
  
  for (let i = 0; i < a.length - 1; i++) {
    bigramsA.add(a.slice(i, i + 2));
  }
  for (let i = 0; i < b.length - 1; i++) {
    bigramsB.add(b.slice(i, i + 2));
  }
  
  let intersection = 0;
  for (const bigram of bigramsA) {
    if (bigramsB.has(bigram)) intersection++;
  }
  
  const union = bigramsA.size + bigramsB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

// =============================================================================
// EPISTEMIC EVOLUTION - Misinterpretation Detection
// =============================================================================

export interface InterpretationEvent {
  eventType: 
    | 'hover_uncertainty'  // User hovered over uncertainty indicator
    | 'click_methodology'  // User clicked to see method
    | 'dismiss_warning'    // User dismissed a warning
    | 'comparison_blocked' // System blocked invalid comparison
    | 'export_raw'         // User exported raw data
    | 'share_chart'        // User shared a visualization
    | 'incorrect_citation' // External citation didn't match source
    | 'feedback_negative'  // User gave negative feedback
    | 'return_to_check';   // User returned to verify data
  entityId: string;
  entityType: string;
  context?: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
}

export interface EpistemicWeakness {
  weaknessType: 
    | 'unclear_uncertainty'
    | 'missing_context'
    | 'misleading_visualization'
    | 'insufficient_warning'
    | 'pedagogy_failure';
  location: string;
  frequency: number;
  evidence: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedFix: string;
}

export interface EpistemicStrength {
  strengthType: 'effective_warning' | 'clear_methodology' | 'good_pedagogy';
  location: string;
  frequency: number;
  evidence: string[];
}

/**
 * Detect where users misinterpret or struggle with data
 */
export function detectEpistemicWeaknesses(events: InterpretationEvent[]): {
  weaknesses: EpistemicWeakness[];
  strengths: EpistemicStrength[];
  warningEffectiveness: Map<string, number>;
  pedagogyScores: Map<string, number>;
} {
  const weaknesses: EpistemicWeakness[] = [];
  const strengths: EpistemicStrength[] = [];
  const warningDismissals = new Map<string, number>();
  const warningHeeds = new Map<string, number>();
  const uncertaintyHovers = new Map<string, number>();
  const methodologyClicks = new Map<string, number>();
  const returnVisits = new Map<string, number>();
  const negFeedback = new Map<string, number>();
  
  // Count events by location
  for (const event of events) {
    const location = `${event.entityType}:${event.entityId}`;
    
    switch (event.eventType) {
      case 'dismiss_warning':
        warningDismissals.set(location, (warningDismissals.get(location) || 0) + 1);
        break;
      case 'comparison_blocked':
        warningHeeds.set(location, (warningHeeds.get(location) || 0) + 1);
        break;
      case 'hover_uncertainty':
        uncertaintyHovers.set(location, (uncertaintyHovers.get(location) || 0) + 1);
        break;
      case 'click_methodology':
        methodologyClicks.set(location, (methodologyClicks.get(location) || 0) + 1);
        break;
      case 'return_to_check':
        returnVisits.set(location, (returnVisits.get(location) || 0) + 1);
        break;
      case 'feedback_negative':
        negFeedback.set(location, (negFeedback.get(location) || 0) + 1);
        break;
    }
  }
  
  // Analyze warning effectiveness
  const warningEffectiveness = new Map<string, number>();
  const allWarningLocations = new Set([...warningDismissals.keys(), ...warningHeeds.keys()]);
  
  for (const location of allWarningLocations) {
    const dismissed = warningDismissals.get(location) || 0;
    const heeded = warningHeeds.get(location) || 0;
    const total = dismissed + heeded;
    
    if (total > 0) {
      const effectiveness = heeded / total;
      warningEffectiveness.set(location, effectiveness);
      
      if (effectiveness < 0.3 && total >= 5) {
        weaknesses.push({
          weaknessType: 'insufficient_warning',
          location,
          frequency: total,
          evidence: [
            `${(effectiveness * 100).toFixed(0)}% effektivitet`,
            `${dismissed} avfärdade vs ${heeded} respekterade`
          ],
          severity: effectiveness < 0.1 ? 'critical' : 'high',
          suggestedFix: 'Förstärk varningen eller gör den mer pedagogisk'
        });
      } else if (effectiveness > 0.7 && total >= 5) {
        strengths.push({
          strengthType: 'effective_warning',
          location,
          frequency: total,
          evidence: [`${(effectiveness * 100).toFixed(0)}% effektivitet`]
        });
      }
    }
  }
  
  // High return visits = uncertainty in understanding
  for (const [location, count] of returnVisits) {
    if (count >= 3) {
      weaknesses.push({
        weaknessType: 'unclear_uncertainty',
        location,
        frequency: count,
        evidence: [`${count} återbesök för att kontrollera data`],
        severity: count >= 10 ? 'high' : 'medium',
        suggestedFix: 'Förbättra tydligheten i osäkerhetsvisning'
      });
    }
  }
  
  // High negative feedback
  for (const [location, count] of negFeedback) {
    if (count >= 2) {
      weaknesses.push({
        weaknessType: 'pedagogy_failure',
        location,
        frequency: count,
        evidence: [`${count} negativa feedback-händelser`],
        severity: count >= 5 ? 'critical' : 'high',
        suggestedFix: 'Granska och förbättra presentation'
      });
    }
  }
  
  // Calculate pedagogy scores
  const pedagogyScores = new Map<string, number>();
  const allLocations = new Set([
    ...uncertaintyHovers.keys(),
    ...methodologyClicks.keys(),
    ...returnVisits.keys(),
    ...negFeedback.keys()
  ]);
  
  for (const location of allLocations) {
    // Higher methodology clicks = good (curious users)
    // High uncertainty hovers = good (careful users)
    // High returns = bad (confusion)
    // High negative feedback = bad
    const methodClicks = methodologyClicks.get(location) || 0;
    const uncertHovers = uncertaintyHovers.get(location) || 0;
    const returns = returnVisits.get(location) || 0;
    const negFb = negFeedback.get(location) || 0;
    
    const positiveSignals = methodClicks + uncertHovers;
    const negativeSignals = returns + negFb * 3; // Weight negative feedback more
    
    const total = positiveSignals + negativeSignals;
    if (total > 0) {
      const score = positiveSignals / total;
      pedagogyScores.set(location, score);
    }
  }
  
  return {
    weaknesses,
    strengths,
    warningEffectiveness,
    pedagogyScores
  };
}

// =============================================================================
// EVOLUTION SYNTHESIS - Combine All Insights
// =============================================================================

export interface EvolutionRecommendation {
  id: string;
  category: 'anatomical' | 'semantic' | 'epistemic';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence: string[];
  suggestedAction: string;
  autoImplementable: boolean;
  estimatedEffort: 'trivial' | 'small' | 'medium' | 'large';
  estimatedImpact: number; // 0-100
}

export interface EvolutionReport {
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  
  // Summaries
  anatomicalHealth: number; // 0-100
  semanticCoverage: number; // 0-100
  epistemicIntegrity: number; // 0-100
  overallScore: number; // 0-100
  
  // Details
  recommendations: EvolutionRecommendation[];
  hotPaths: string[];
  frictionPoints: string[];
  semanticGaps: SemanticGap[];
  epistemicWeaknesses: EpistemicWeakness[];
  
  // Trends
  weekOverWeekChange: {
    anatomical: number;
    semantic: number;
    epistemic: number;
  };
}

/**
 * Generate comprehensive evolution report
 */
export function generateEvolutionReport(
  usageEvents: UsageEvent[],
  queryAttempts: QueryAttempt[],
  interpretationEvents: InterpretationEvent[],
  periodStart: Date,
  periodEnd: Date
): EvolutionReport {
  // Analyze each dimension
  const anatomical = analyzeUsagePatterns(usageEvents);
  const semantic = detectSemanticGaps(queryAttempts);
  const epistemic = detectEpistemicWeaknesses(interpretationEvents);
  
  // Calculate health scores
  const anatomicalHealth = calculateAnatomicalHealth(anatomical);
  const semanticCoverage = calculateSemanticCoverage(semantic);
  const epistemicIntegrity = calculateEpistemicIntegrity(epistemic);
  const overallScore = (anatomicalHealth + semanticCoverage + epistemicIntegrity) / 3;
  
  // Generate recommendations
  const recommendations: EvolutionRecommendation[] = [];
  
  // From anatomical insights
  for (const insight of anatomical.insights) {
    recommendations.push({
      id: `anat-${recommendations.length}`,
      category: 'anatomical',
      priority: insight.severity === 'critical' ? 'critical' : 
                insight.severity === 'warning' ? 'high' : 'medium',
      title: insight.insight,
      description: insight.recommendation,
      evidence: insight.evidence,
      suggestedAction: insight.recommendation,
      autoImplementable: insight.autoFixable,
      estimatedEffort: insight.autoFixable ? 'trivial' : 'medium',
      estimatedImpact: insight.estimatedImpact
    });
  }
  
  // From semantic gaps
  for (const gap of semantic.gaps.filter(g => g.priority !== 'low')) {
    recommendations.push({
      id: `sem-${recommendations.length}`,
      category: 'semantic',
      priority: gap.priority,
      title: `Saknad term: "${gap.query}"`,
      description: gap.suggestedAction,
      evidence: [
        `Söktes ${gap.frequency} gånger utan resultat`,
        gap.relatedTerms.length > 0 ? `Relaterade termer: ${gap.relatedTerms.join(', ')}` : ''
      ].filter(Boolean),
      suggestedAction: gap.suggestedAction,
      autoImplementable: gap.gapType === 'missing_term',
      estimatedEffort: 'small',
      estimatedImpact: Math.min(100, gap.frequency * 10)
    });
  }
  
  // From epistemic weaknesses
  for (const weakness of epistemic.weaknesses) {
    recommendations.push({
      id: `epist-${recommendations.length}`,
      category: 'epistemic',
      priority: weakness.severity,
      title: getWeaknessTitle(weakness.weaknessType),
      description: `Plats: ${weakness.location}`,
      evidence: weakness.evidence,
      suggestedAction: weakness.suggestedFix,
      autoImplementable: false,
      estimatedEffort: 'medium',
      estimatedImpact: weakness.severity === 'critical' ? 90 :
                       weakness.severity === 'high' ? 70 : 50
    });
  }
  
  // Sort by priority and impact
  recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.estimatedImpact - a.estimatedImpact;
  });
  
  return {
    generatedAt: new Date(),
    periodStart,
    periodEnd,
    anatomicalHealth,
    semanticCoverage,
    epistemicIntegrity,
    overallScore,
    recommendations: recommendations.slice(0, 20), // Top 20
    hotPaths: anatomical.hotPaths,
    frictionPoints: anatomical.frictionPoints,
    semanticGaps: semantic.gaps,
    epistemicWeaknesses: epistemic.weaknesses,
    weekOverWeekChange: {
      anatomical: 0, // Would compare with previous period
      semantic: 0,
      epistemic: 0
    }
  };
}

function calculateAnatomicalHealth(analysis: ReturnType<typeof analyzeUsagePatterns>): number {
  const maxIssues = 10;
  const issues = analysis.frictionPoints.length + analysis.deadEnds.length;
  return Math.max(0, 100 - (issues / maxIssues) * 100);
}

function calculateSemanticCoverage(analysis: ReturnType<typeof detectSemanticGaps>): number {
  const criticalGaps = analysis.gaps.filter(g => g.priority === 'critical' || g.priority === 'high').length;
  return Math.max(0, 100 - criticalGaps * 15);
}

function calculateEpistemicIntegrity(analysis: ReturnType<typeof detectEpistemicWeaknesses>): number {
  const criticalWeaknesses = analysis.weaknesses.filter(w => w.severity === 'critical' || w.severity === 'high').length;
  return Math.max(0, 100 - criticalWeaknesses * 20);
}

function getWeaknessTitle(type: EpistemicWeakness['weaknessType']): string {
  const titles: Record<typeof type, string> = {
    unclear_uncertainty: 'Otydlig osäkerhetsvisning',
    missing_context: 'Saknad kontext',
    misleading_visualization: 'Potentiellt vilseledande visualisering',
    insufficient_warning: 'Ineffektiv varning',
    pedagogy_failure: 'Pedagogiskt misslyckande'
  };
  return titles[type];
}

// =============================================================================
// EXPORTS
// =============================================================================

export const SystemEvolution = {
  // Anatomical
  analyzeUsagePatterns,
  
  // Semantic
  detectSemanticGaps,
  
  // Epistemic
  detectEpistemicWeaknesses,
  
  // Synthesis
  generateEvolutionReport
};
