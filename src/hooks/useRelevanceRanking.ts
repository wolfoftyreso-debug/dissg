// Hook för relevansstyrd prioritering av KPI:er
// Daglig auto-prioritering utan redaktör

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

interface UseRelevanceRankingOptions {
  kpis: KPI[];
  masterIndexWeights?: Record<string, number>;
  maxHighlights?: number;
}

interface UseRelevanceRankingResult {
  rankedKPIs: Array<KPI & { relevance: RelevanceScore }>;
  highlights: Array<KPI & { relevance: RelevanceScore }>;
  todaysSummary: string;
  lastCalculated: Date;
}

/**
 * Konvertera KPI till RelevanceInput
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
    accelerating: Math.abs(trendPercent) > 5, // Förenklad acceleration-check
    trendDuration: 3, // Placeholder - behöver historisk data
    
    // Breadth
    affectedRegions: kpi.breakdownAvailable?.includes('region') ? 15 : 1,
    totalRegions: 21, // Svenska regioner
    affectedPopulationPercent: 80, // Placeholder
    
    // Persistence
    monthsWithIssue: kpi.status === 'critical' ? 6 : kpi.status === 'warning' ? 3 : 0,
    isRedFlag: kpi.redFlags?.some(rf => rf.condition) ?? false,
    
    // Responsibility
    hasActiveMandate: true, // Alla KPI:er har någon form av mandat
    mandateLevel: 'national',
    
    // Uncertainty
    confidence,
    dataPointsLast12Months: 12, // Placeholder
    isProvisional: false,
  };
}

/**
 * Generera daglig sammanfattning
 */
function generateDailySummary(highlights: RelevanceScore[]): string {
  if (highlights.length === 0) {
    return 'Inga kritiska förändringar idag.';
  }

  const reasons = highlights.map(h => h.reason);
  const uniqueReasons = [...new Set(reasons)].slice(0, 2);

  if (highlights.length === 1) {
    return `1 indikator kräver uppmärksamhet: ${uniqueReasons[0]?.toLowerCase() || 'förändring pågår'}.`;
  }

  return `${highlights.length} indikatorer kräver uppmärksamhet. ${uniqueReasons.join('. ')}.`;
}

/**
 * Hook för relevansstyrd prioritering
 */
export function useRelevanceRanking({
  kpis,
  masterIndexWeights = {},
  maxHighlights = 5,
}: UseRelevanceRankingOptions): UseRelevanceRankingResult {
  const result = useMemo(() => {
    // Konvertera till RelevanceInput
    const inputs: RelevanceInput[] = kpis.map(kpi => 
      kpiToRelevanceInput(kpi, masterIndexWeights[kpi.id] ?? 0.05)
    );

    // Beräkna och ranka
    const scores = rankKPIsByRelevance(inputs, DEFAULT_RELEVANCE_WEIGHTS);

    // Skapa mappning
    const scoreMap = new Map(scores.map(s => [s.kpiId, s]));

    // Kombinera KPI med relevans-score
    const rankedKPIs = kpis
      .map(kpi => ({
        ...kpi,
        relevance: scoreMap.get(kpi.id)!,
      }))
      .filter(kpi => kpi.relevance)
      .sort((a, b) => b.relevance.totalScore - a.relevance.totalScore);

    // Hämta highlights
    const highlightScores = getDailyHighlights(scores, maxHighlights);
    const highlightIds = new Set(highlightScores.map(s => s.kpiId));
    const highlights = rankedKPIs.filter(kpi => highlightIds.has(kpi.id));

    // Generera sammanfattning
    const todaysSummary = generateDailySummary(highlightScores);

    return {
      rankedKPIs,
      highlights,
      todaysSummary,
      lastCalculated: new Date(),
    };
  }, [kpis, masterIndexWeights, maxHighlights]);

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
