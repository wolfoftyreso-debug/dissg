/**
 * Hook för att använda analysregler i komponenter
 */

import { useMemo } from 'react';
import {
  calculateStatus,
  calculateZScore,
  calculateCorrelation,
  calculateConfidence,
  classifyConfidence,
  THRESHOLD_CONFIG,
  ANOMALY_RULES,
  TREND_RULES,
  SOURCE_CONFIDENCE,
  type AnalysisResult,
  type ConfidenceFactors,
  type CorrelationResult,
  type ThresholdConfig
} from '@/config/analysisRulesEngine';
import type { KPI } from '@/types/kpi';

/**
 * Hook för att beräkna status för en KPI
 */
export function useKPIAnalysis(
  kpiId: string,
  value: number,
  previousValue?: number,
  sourceCode?: string
): AnalysisResult {
  return useMemo(() => {
    const sourceQuality = sourceCode 
      ? SOURCE_CONFIDENCE[sourceCode.toLowerCase()] ?? SOURCE_CONFIDENCE.unknown
      : SOURCE_CONFIDENCE.unknown;

    return calculateStatus(kpiId, value, previousValue, {
      sourceQuality,
      dataQuality: 0.90,
      timeConsistency: 0.85,
      statisticalSignificance: 0.80
    });
  }, [kpiId, value, previousValue, sourceCode]);
}

/**
 * Hook för att analysera flera KPI:er samtidigt
 */
export function useMultiKPIAnalysis(
  kpis: Array<{ id: string; value: number; previousValue?: number; source?: string }>
): Record<string, AnalysisResult> {
  return useMemo(() => {
    const results: Record<string, AnalysisResult> = {};
    
    for (const kpi of kpis) {
      const sourceQuality = kpi.source
        ? SOURCE_CONFIDENCE[kpi.source.toLowerCase()] ?? SOURCE_CONFIDENCE.unknown
        : SOURCE_CONFIDENCE.unknown;

      results[kpi.id] = calculateStatus(kpi.id, kpi.value, kpi.previousValue, {
        sourceQuality
      });
    }
    
    return results;
  }, [kpis]);
}

/**
 * Hook för anomalidetektering
 */
export function useAnomalyDetection(
  value: number,
  historicalValues: number[]
): {
  zScore: number;
  isAnomaly: boolean;
  severity: 'normal' | 'warning' | 'critical';
  description: string;
} {
  return useMemo(() => {
    const result = calculateZScore(value, historicalValues);
    
    let description: string;
    if (result.severity === 'critical') {
      description = `Kritisk anomali: z-score ${result.zScore.toFixed(2)} (>${ANOMALY_RULES[0].sigmaCritical}σ)`;
    } else if (result.severity === 'warning') {
      description = `Möjlig anomali: z-score ${result.zScore.toFixed(2)} (>${ANOMALY_RULES[0].sigmaWarning}σ)`;
    } else {
      description = `Normal variation: z-score ${result.zScore.toFixed(2)}`;
    }
    
    return { ...result, description };
  }, [value, historicalValues]);
}

/**
 * Hook för korrelationsanalys
 */
export function useCorrelation(
  xValues: number[],
  yValues: number[]
): CorrelationResult & { description: string } {
  return useMemo(() => {
    const result = calculateCorrelation(xValues, yValues);
    
    const direction = result.direction === 'positive' ? 'positiv' : 'negativ';
    const significance = result.significant ? 'signifikant' : 'ej signifikant';
    
    let description: string;
    switch (result.strength) {
      case 'strong':
        description = `Stark ${direction} korrelation (r=${result.coefficient.toFixed(2)}, ${significance})`;
        break;
      case 'moderate':
        description = `Måttlig ${direction} korrelation (r=${result.coefficient.toFixed(2)}, ${significance})`;
        break;
      case 'weak':
        description = `Svag ${direction} korrelation (r=${result.coefficient.toFixed(2)}, ${significance})`;
        break;
      default:
        description = `Ingen signifikant korrelation (r=${result.coefficient.toFixed(2)})`;
    }
    
    return { ...result, description };
  }, [xValues, yValues]);
}

/**
 * Hook för konfidensberäkning
 */
export function useConfidenceCalculation(
  factors: Partial<ConfidenceFactors>
): {
  confidence: number;
  level: 'high' | 'medium' | 'low' | 'insufficient';
  factors: ConfidenceFactors;
  description: string;
} {
  return useMemo(() => {
    const fullFactors: ConfidenceFactors = {
      dataQuality: factors.dataQuality ?? 0.80,
      timeConsistency: factors.timeConsistency ?? 0.80,
      sourceQuality: factors.sourceQuality ?? 0.80,
      statisticalSignificance: factors.statisticalSignificance ?? 0.80
    };
    
    const confidence = calculateConfidence(fullFactors);
    const level = classifyConfidence(confidence);
    
    const descriptions = {
      high: 'Hög tillförlitlighet - data kan användas för beslutsunderlag',
      medium: 'Medel tillförlitlighet - använd med viss försiktighet',
      low: 'Låg tillförlitlighet - verifiera med andra källor',
      insufficient: 'Otillräcklig data - kan ej användas för slutsatser'
    };
    
    return {
      confidence,
      level,
      factors: fullFactors,
      description: descriptions[level]
    };
  }, [factors]);
}

/**
 * Hook för att hämta tröskelvärden
 */
export function useThresholdConfig(kpiId: string): ThresholdConfig | undefined {
  return useMemo(() => THRESHOLD_CONFIG[kpiId], [kpiId]);
}

/**
 * Hook för att klassificera trend
 */
export function useTrendClassification(
  currentValue: number,
  previousValue: number,
  inverted: boolean = false
): {
  trendPercent: number;
  direction: 'up' | 'down' | 'stable';
  isPositive: boolean;
  severity: 'positive' | 'neutral' | 'warning' | 'critical';
  description: string;
} {
  return useMemo(() => {
    if (previousValue === 0) {
      return {
        trendPercent: 0,
        direction: 'stable' as const,
        isPositive: true,
        severity: 'neutral' as const,
        description: 'Ingen föregående data'
      };
    }

    const trendPercent = ((currentValue - previousValue) / previousValue) * 100;
    const effectiveTrend = inverted ? -trendPercent : trendPercent;
    
    let direction: 'up' | 'down' | 'stable';
    if (Math.abs(trendPercent) < 0.5) {
      direction = 'stable';
    } else {
      direction = trendPercent > 0 ? 'up' : 'down';
    }
    
    let severity: 'positive' | 'neutral' | 'warning' | 'critical';
    let isPositive: boolean;
    
    if (effectiveTrend >= TREND_RULES.greenTrendMin) {
      severity = 'positive';
      isPositive = true;
    } else if (effectiveTrend >= TREND_RULES.stableRange.min) {
      severity = 'neutral';
      isPositive = true;
    } else if (effectiveTrend >= TREND_RULES.redTrendMax) {
      severity = 'warning';
      isPositive = false;
    } else {
      severity = 'critical';
      isPositive = false;
    }
    
    const descriptions = {
      positive: `Positiv trend: ${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%`,
      neutral: `Stabil: ${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%`,
      warning: `Negativ trend: ${trendPercent.toFixed(1)}%`,
      critical: `Kritisk nedgång: ${trendPercent.toFixed(1)}%`
    };
    
    return {
      trendPercent: Math.round(trendPercent * 100) / 100,
      direction,
      isPositive,
      severity,
      description: descriptions[severity]
    };
  }, [currentValue, previousValue, inverted]);
}

/**
 * Hook för att få sammanfattande statistik för en grupp KPI:er
 */
export function useKPISummary(
  results: Record<string, AnalysisResult>
): {
  total: number;
  green: number;
  yellow: number;
  red: number;
  neutral: number;
  averageConfidence: number;
  averageScore: number;
  criticalKpis: string[];
  warningKpis: string[];
} {
  return useMemo(() => {
    const entries = Object.entries(results);
    const total = entries.length;
    
    if (total === 0) {
      return {
        total: 0,
        green: 0,
        yellow: 0,
        red: 0,
        neutral: 0,
        averageConfidence: 0,
        averageScore: 0,
        criticalKpis: [],
        warningKpis: []
      };
    }
    
    let green = 0, yellow = 0, red = 0, neutral = 0;
    let totalConfidence = 0, totalScore = 0;
    const criticalKpis: string[] = [];
    const warningKpis: string[] = [];
    
    for (const [id, result] of entries) {
      switch (result.statusColor) {
        case 'green': green++; break;
        case 'yellow': 
          yellow++; 
          warningKpis.push(id);
          break;
        case 'red': 
          red++; 
          criticalKpis.push(id);
          break;
        default: neutral++; break;
      }
      
      totalConfidence += result.confidence;
      totalScore += result.score;
    }
    
    return {
      total,
      green,
      yellow,
      red,
      neutral,
      averageConfidence: Math.round((totalConfidence / total) * 100) / 100,
      averageScore: Math.round(totalScore / total),
      criticalKpis,
      warningKpis
    };
  }, [results]);
}
