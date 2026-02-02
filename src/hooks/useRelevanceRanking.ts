// Hook för relevansstyrd prioritering av KPI:er
// Daglig auto-prioritering utan redaktör
// Integrerar relevanceRules.ts för impact/urgency-beräkningar

import { useMemo } from 'react';
import type { KPI } from '@/types/kpi';
import { 
  calculateRelevanceScore, 
  rankKPIsByRelevance,
  getDailyHighlights,
  type RelevanceInput,
  type RelevanceScore,
  DEFAULT_RELEVANCE_WEIGHTS
} from '@/config/relevanceConfig';
import {
  RELEVANCE_ENGINE,
  PRIORITY_THRESHOLDS,
  type ImpactFactors,
  type UrgencyFactors,
} from '@/config/relevanceRules';

interface UseRelevanceRankingOptions {
  kpis: KPI[];
  masterIndexWeights?: Record<string, number>;
  maxHighlights?: number;
  viewType?: 'homepage' | 'analysis' | 'alerts' | 'historical' | 'comparison';
}

interface EnhancedRelevanceScore extends RelevanceScore {
  impactScore: number;
  urgencyScore: number;
  urgencyLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

interface UseRelevanceRankingResult {
  rankedKPIs: Array<KPI & { relevance: EnhancedRelevanceScore }>;
  highlights: Array<KPI & { relevance: EnhancedRelevanceScore }>;
  todaysSummary: string;
  lastCalculated: Date;
  criticalUrgencyCount: number;
  highUrgencyCount: number;
}

/**
 * Bestäm urgency-nivå baserat på score
 */
function getUrgencyLevel(urgencyScore: number): 'none' | 'low' | 'medium' | 'high' | 'critical' {
  if (urgencyScore >= 80) return 'critical';
  if (urgencyScore >= 60) return 'high';
  if (urgencyScore >= 40) return 'medium';
  if (urgencyScore >= 20) return 'low';
  return 'none';
}

/**
 * Beräkna impact-faktorer från KPI
 */
function getImpactFactors(kpi: KPI): ImpactFactors {
  const category = kpi.category?.toLowerCase() || '';
  
  return {
    populationAffected: kpi.breakdownAvailable?.includes('region') 
      ? 10_000_000 // Nationell nivå
      : 1_000_000,  // Regional nivå
    economicMagnitude: category.includes('ekon') || category.includes('arbets')
      ? 100_000_000_000 // 100 miljarder
      : 10_000_000_000,  // 10 miljarder
    healthImplication: category.includes('hälsa') || category.includes('vård'),
    securityImplication: category.includes('trygghet') || category.includes('brott'),
    interconnectedKpis: 3, // Placeholder - kan beräknas från faktiska relationer
  };
}

/**
 * Beräkna urgency-faktorer från KPI
 */
function getUrgencyFactors(kpi: KPI): UrgencyFactors {
  const trendPercent = kpi.trendPercent ?? 0;
  const isSignificant = Math.abs(trendPercent) >= PRIORITY_THRESHOLDS.significant_change_percent;
  
  // Beräkna threshold proximity (hur nära kritiskt värde)
  let thresholdProximity = 0;
  if (kpi.status === 'critical') {
    thresholdProximity = 1.0;
  } else if (kpi.status === 'warning') {
    thresholdProximity = 0.7;
  } else if (isSignificant) {
    thresholdProximity = 0.3;
  }
  
  return {
    trendDirection: kpi.trend || 'stable',
    trendAcceleration: Math.abs(trendPercent) > 5 ? trendPercent / 5 : 0,
    daysSinceChange: isSignificant ? 7 : 30, // Placeholder
    thresholdProximity,
    isInverted: kpi.inverted ?? false,
  };
}

/**
 * Konvertera KPI till RelevanceInput med enhanced scoring
 */
function kpiToRelevanceInput(
  kpi: KPI,
  masterIndexWeight: number = 0.05
): RelevanceInput {
  const trendPercent = kpi.trendPercent ?? 0;
  const confidence = kpi.confidence ?? 80;

  return {
    kpiId: kpi.id,
    
    // Impact
    masterIndexWeight,
    masterIndexContribution: Math.abs(trendPercent) * masterIndexWeight,
    
    // Acceleration
    trendPercent,
    accelerating: Math.abs(trendPercent) > 5,
    trendDuration: 3,
    
    // Breadth
    affectedRegions: kpi.breakdownAvailable?.includes('region') ? 15 : 1,
    totalRegions: 21,
    affectedPopulationPercent: 80,
    
    // Persistence
    monthsWithIssue: kpi.status === 'critical' ? 6 : kpi.status === 'warning' ? 3 : 0,
    isRedFlag: kpi.redFlags?.some(rf => rf.condition) ?? false,
    
    // Responsibility
    hasActiveMandate: true,
    mandateLevel: 'national',
    
    // Uncertainty
    confidence,
    dataPointsLast12Months: 12,
    isProvisional: false,
  };
}

/**
 * Generera daglig sammanfattning med urgency-info
 */
function generateDailySummary(
  highlights: EnhancedRelevanceScore[],
  criticalCount: number = 0,
  highCount: number = 0
): string {
  if (highlights.length === 0) {
    return 'Inga kritiska förändringar idag.';
  }

  // Prioritera urgency-information
  if (criticalCount > 0) {
    return `${criticalCount} indikator${criticalCount > 1 ? 'er' : ''} kräver omedelbar uppmärksamhet.`;
  }
  
  if (highCount > 0) {
    return `${highCount} indikator${highCount > 1 ? 'er' : ''} med hög brådska.`;
  }

  const reasons = highlights.map(h => h.reason);
  const uniqueReasons = [...new Set(reasons)].slice(0, 2);

  if (highlights.length === 1) {
    return `1 indikator kräver uppmärksamhet: ${uniqueReasons[0]?.toLowerCase() || 'förändring pågår'}.`;
  }

  return `${highlights.length} indikatorer kräver uppmärksamhet. ${uniqueReasons.join('. ')}.`;
}

/**
 * Hook för relevansstyrd prioritering med impact/urgency från relevanceRules
 */
export function useRelevanceRanking({
  kpis,
  masterIndexWeights = {},
  maxHighlights = 5,
  viewType = 'homepage',
}: UseRelevanceRankingOptions): UseRelevanceRankingResult {
  const result = useMemo(() => {
    // Konvertera till RelevanceInput
    const inputs: RelevanceInput[] = kpis.map(kpi => 
      kpiToRelevanceInput(kpi, masterIndexWeights[kpi.id] ?? 0.05)
    );

    // Beräkna och ranka med befintlig logik
    const scores = rankKPIsByRelevance(inputs, DEFAULT_RELEVANCE_WEIGHTS);

    // Beräkna impact och urgency från relevanceRules för varje KPI
    const enhancedScores = new Map<string, EnhancedRelevanceScore>();
    
    kpis.forEach(kpi => {
      const baseScore = scores.find(s => s.kpiId === kpi.id);
      if (!baseScore) return;
      
      // Beräkna impact och urgency med relevanceRules
      const impactFactors = getImpactFactors(kpi);
      const urgencyFactors = getUrgencyFactors(kpi);
      
      const impactScore = RELEVANCE_ENGINE.calculateImpact(impactFactors);
      const urgencyScore = RELEVANCE_ENGINE.calculateUrgency(urgencyFactors);
      
      // Kombinera scores - urgency boostar prioritering
      const urgencyMultiplier = 1 + (urgencyScore / 200); // Max 1.5x boost
      const adjustedTotal = baseScore.totalScore * urgencyMultiplier;
      
      enhancedScores.set(kpi.id, {
        ...baseScore,
        totalScore: adjustedTotal,
        impactScore,
        urgencyScore,
        urgencyLevel: getUrgencyLevel(urgencyScore),
      });
    });

    // Kombinera KPI med enhanced relevans-score
    const rankedKPIs = kpis
      .map(kpi => ({
        ...kpi,
        relevance: enhancedScores.get(kpi.id)!,
      }))
      .filter(kpi => kpi.relevance)
      .sort((a, b) => b.relevance.totalScore - a.relevance.totalScore);

    // Uppdatera rank efter ny sortering
    rankedKPIs.forEach((item, index) => {
      item.relevance.rank = index + 1;
    });

    // Hämta highlights (topp N med shouldHighlight eller hög urgency)
    const highlights = rankedKPIs
      .filter(kpi => 
        kpi.relevance.shouldHighlight || 
        kpi.relevance.urgencyLevel === 'critical' ||
        kpi.relevance.urgencyLevel === 'high'
      )
      .slice(0, maxHighlights);

    // Räkna kritiska/höga urgency
    const criticalUrgencyCount = rankedKPIs.filter(
      k => k.relevance.urgencyLevel === 'critical'
    ).length;
    const highUrgencyCount = rankedKPIs.filter(
      k => k.relevance.urgencyLevel === 'high' || k.relevance.urgencyLevel === 'critical'
    ).length;

    // Generera sammanfattning med urgency-information
    const todaysSummary = generateDailySummary(
      highlights.map(h => h.relevance),
      criticalUrgencyCount,
      highUrgencyCount
    );

    return {
      rankedKPIs,
      highlights,
      todaysSummary,
      lastCalculated: new Date(),
      criticalUrgencyCount,
      highUrgencyCount,
    };
  }, [kpis, masterIndexWeights, maxHighlights, viewType]);

  return result;
}

/**
 * Vad är nytt idag?
 */
export function useWhatsNewToday(kpis: KPI[]): {
  newItems: Array<{ kpi: KPI; reason: string }>;
  summary: string;
} {
  return useMemo(() => {
    // Filtrera KPI:er med signifikanta förändringar
    const significant = kpis.filter(kpi => {
      const trendPercent = Math.abs(kpi.trendPercent ?? 0);
      return trendPercent > 3 || kpi.status === 'critical';
    });

    const newItems = significant.map(kpi => {
      let reason = '';
      if (kpi.status === 'critical') {
        reason = 'Kritisk nivå';
      } else if ((kpi.trendPercent ?? 0) > 5) {
        reason = 'Snabb ökning';
      } else if ((kpi.trendPercent ?? 0) < -5) {
        reason = 'Snabb minskning';
      } else {
        reason = 'Förändring pågår';
      }
      return { kpi, reason };
    });

    const summary = newItems.length === 0
      ? 'Inga signifikanta förändringar idag.'
      : `${newItems.length} indikator${newItems.length > 1 ? 'er' : ''} visar förändring.`;

    return { newItems, summary };
  }, [kpis]);
}
