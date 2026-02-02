/**
 * PARTY STATISTICS CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * Hur partistatistik presenteras publikt utan att bli polemisk.
 * 
 * Principer:
 * - Endast aggregerade data
 * - Ingen realtidsanklagelse
 * - Samma mätetal för alla
 * - Samma tidslogik för alla
 * - All osäkerhet visas öppet
 */

export interface PartyStatistics {
  partyCode: string;
  partyName: string;
  
  // Aggregerad styrhistorik
  governingStats: {
    totalPeriods: number;
    totalMonths: number;
    asLeadParty: number;
    asJuniorPartner: number;
  };
  
  // Utfallsstatistik (endast för avslutade perioder)
  outcomeStats: {
    totalDecisionsLinked: number;
    positiveOutcomes: number;
    neutralOutcomes: number;
    negativeOutcomes: number;
    unclearOutcomes: number;
    averageConfidence: number;
  };
  
  // Per kategori
  categoryBreakdown: Record<string, {
    decisions: number;
    positiveRate: number;
    neutralRate: number;
    negativeRate: number;
  }>;
  
  // Metadata
  dataQuality: {
    completeness: number;  // 0-100%
    verificationLevel: 'full' | 'partial' | 'limited';
    lastUpdated: string;
  };
}

export interface PartyDisplayConfig {
  showOnlyCompletedPeriods: boolean;
  minimumDecisionsForDisplay: number;
  showConfidenceIntervals: boolean;
  showCategoryBreakdown: boolean;
  comparisonEnabled: boolean;
}

/**
 * Default presentation rules
 */
export const PARTY_DISPLAY_CONFIG: PartyDisplayConfig = {
  showOnlyCompletedPeriods: true,    // Aldrig pågående mandat
  minimumDecisionsForDisplay: 5,      // Minst 5 beslut för statistik
  showConfidenceIntervals: true,      // Visa osäkerhet
  showCategoryBreakdown: true,        // Visa per område
  comparisonEnabled: true,            // Tillåt jämförelse
};

/**
 * SWEDISH PARTY METADATA
 */
export const SWEDISH_PARTIES: Record<string, { name: string; color: string; founded: number }> = {
  'S': { name: 'Socialdemokraterna', color: '#E8112D', founded: 1889 },
  'M': { name: 'Moderaterna', color: '#52BDEC', founded: 1904 },
  'SD': { name: 'Sverigedemokraterna', color: '#DDDD00', founded: 1988 },
  'C': { name: 'Centerpartiet', color: '#009933', founded: 1913 },
  'V': { name: 'Vänsterpartiet', color: '#DA291C', founded: 1917 },
  'KD': { name: 'Kristdemokraterna', color: '#000077', founded: 1964 },
  'L': { name: 'Liberalerna', color: '#006AB3', founded: 1902 },
  'MP': { name: 'Miljöpartiet', color: '#83CF39', founded: 1981 },
  'FP': { name: 'Folkpartiet (nu L)', color: '#006AB3', founded: 1902 },
};

/**
 * Calculate party statistics from decision data
 */
export function calculatePartyStatistics(
  partyCode: string,
  decisions: Array<{
    decisionId: string;
    kpiCategory: string;
    outcomeType: 'positive' | 'neutral' | 'negative' | 'unclear';
    confidence: number;
    governingPeriodId: string;
  }>,
  governingPeriods: Array<{
    id: string;
    parties: string[];
    startDate: string;
    endDate: string | null;
    totalMonths: number;
  }>
): PartyStatistics {
  const partyMeta = SWEDISH_PARTIES[partyCode];
  
  // Filter to periods where this party was involved
  const relevantPeriods = governingPeriods.filter(p => 
    p.parties.includes(partyCode) && p.endDate !== null
  );
  
  // Filter decisions to completed periods only
  const relevantDecisions = decisions.filter(d =>
    relevantPeriods.some(p => p.id === d.governingPeriodId)
  );
  
  // Calculate outcome stats
  const positiveOutcomes = relevantDecisions.filter(d => d.outcomeType === 'positive').length;
  const neutralOutcomes = relevantDecisions.filter(d => d.outcomeType === 'neutral').length;
  const negativeOutcomes = relevantDecisions.filter(d => d.outcomeType === 'negative').length;
  const unclearOutcomes = relevantDecisions.filter(d => d.outcomeType === 'unclear').length;
  
  const avgConfidence = relevantDecisions.length > 0
    ? relevantDecisions.reduce((sum, d) => sum + d.confidence, 0) / relevantDecisions.length
    : 0;
  
  // Category breakdown
  const categories = [...new Set(relevantDecisions.map(d => d.kpiCategory))];
  const categoryBreakdown: PartyStatistics['categoryBreakdown'] = {};
  
  for (const cat of categories) {
    const catDecisions = relevantDecisions.filter(d => d.kpiCategory === cat);
    const total = catDecisions.length;
    if (total > 0) {
      categoryBreakdown[cat] = {
        decisions: total,
        positiveRate: catDecisions.filter(d => d.outcomeType === 'positive').length / total,
        neutralRate: catDecisions.filter(d => d.outcomeType === 'neutral').length / total,
        negativeRate: catDecisions.filter(d => d.outcomeType === 'negative').length / total,
      };
    }
  }
  
  return {
    partyCode,
    partyName: partyMeta?.name || partyCode,
    governingStats: {
      totalPeriods: relevantPeriods.length,
      totalMonths: relevantPeriods.reduce((sum, p) => sum + p.totalMonths, 0),
      asLeadParty: relevantPeriods.filter(p => p.parties[0] === partyCode).length,
      asJuniorPartner: relevantPeriods.filter(p => p.parties[0] !== partyCode).length,
    },
    outcomeStats: {
      totalDecisionsLinked: relevantDecisions.length,
      positiveOutcomes,
      neutralOutcomes,
      negativeOutcomes,
      unclearOutcomes,
      averageConfidence: avgConfidence,
    },
    categoryBreakdown,
    dataQuality: {
      completeness: Math.min(100, (relevantDecisions.length / (relevantPeriods.length * 10)) * 100),
      verificationLevel: relevantDecisions.length > 20 ? 'full' : relevantDecisions.length > 5 ? 'partial' : 'limited',
      lastUpdated: new Date().toISOString(),
    },
  };
}

/**
 * Format statistics for public display
 */
export function formatPartyStatisticsForDisplay(stats: PartyStatistics): {
  headline: string;
  summary: string;
  caveat: string;
} {
  const total = stats.outcomeStats.totalDecisionsLinked;
  const positive = stats.outcomeStats.positiveOutcomes;
  const neutral = stats.outcomeStats.neutralOutcomes;
  const negative = stats.outcomeStats.negativeOutcomes;
  
  if (total < PARTY_DISPLAY_CONFIG.minimumDecisionsForDisplay) {
    return {
      headline: 'Otillräckliga data',
      summary: `Endast ${total} beslut kan kopplas till mätbara utfall. Minst ${PARTY_DISPLAY_CONFIG.minimumDecisionsForDisplay} krävs för statistik.`,
      caveat: 'Statistiken är inte representativ.',
    };
  }
  
  const positiveRate = ((positive / total) * 100).toFixed(0);
  const neutralRate = ((neutral / total) * 100).toFixed(0);
  const negativeRate = ((negative / total) * 100).toFixed(0);
  
  return {
    headline: `${stats.partyName}`,
    summary: `Positivt: ${positiveRate}% | Neutralt: ${neutralRate}% | Negativt: ${negativeRate}%\n(baserat på ${total} beslut med mätbara utfall)`,
    caveat: `Konfidensnivå: ${(stats.outcomeStats.averageConfidence * 100).toFixed(0)}%. Data omfattar ${stats.governingStats.totalPeriods} avslutade styrperioder.`,
  };
}
