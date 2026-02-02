/**
 * useWrapWorthiness Hook
 * ======================
 * React hook for automatic wrap selection based on worthiness scoring
 */

import { useState, useCallback, useMemo } from 'react';
import {
  selectForWrap,
  calculateWorthinessScore,
  getSelectionStats,
  type IndicatorSnapshot,
  type WrapSelection,
  type WorthinessScore,
  type RelevanceLevel,
} from '@/lib/wrapped/worthinessEngine';

interface UseWrapWorthinessOptions {
  maxHero?: number;
  maxPrimary?: number;
  maxSecondary?: number;
  maxMention?: number;
  autoRefresh?: boolean;
}

interface UseWrapWorthinessResult {
  // Selection results
  selection: WrapSelection | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  evaluateIndicators: (indicators: IndicatorSnapshot[], periodLabel?: string) => void;
  evaluateSingle: (indicator: IndicatorSnapshot) => WorthinessScore;
  reset: () => void;
  
  // Stats
  stats: ReturnType<typeof getSelectionStats> | null;
  
  // Helpers
  isWrapWorthy: (indicatorId: string) => boolean;
  getIndicatorScore: (indicatorId: string) => WorthinessScore | undefined;
  getIndicatorsByPriority: (priority: WorthinessScore['suggestedPriority']) => WorthinessScore[];
}

export function useWrapWorthiness(
  options: UseWrapWorthinessOptions = {}
): UseWrapWorthinessResult {
  const {
    maxHero = 2,
    maxPrimary = 5,
    maxSecondary = 10,
    maxMention = 20,
  } = options;
  
  const [selection, setSelection] = useState<WrapSelection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Evaluate all indicators
  const evaluateIndicators = useCallback((
    indicators: IndicatorSnapshot[],
    periodLabel?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = selectForWrap(indicators, {
        maxHero,
        maxPrimary,
        maxSecondary,
        maxMention,
        periodLabel,
      });
      
      setSelection(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to evaluate indicators');
    } finally {
      setIsLoading(false);
    }
  }, [maxHero, maxPrimary, maxSecondary, maxMention]);
  
  // Evaluate a single indicator
  const evaluateSingle = useCallback((indicator: IndicatorSnapshot): WorthinessScore => {
    return calculateWorthinessScore(indicator);
  }, []);
  
  // Reset state
  const reset = useCallback(() => {
    setSelection(null);
    setError(null);
    setIsLoading(false);
  }, []);
  
  // Calculate stats when selection changes
  const stats = useMemo(() => {
    if (!selection) return null;
    return getSelectionStats(selection);
  }, [selection]);
  
  // Helper: check if indicator is wrap-worthy
  const isWrapWorthy = useCallback((indicatorId: string): boolean => {
    if (!selection) return false;
    
    const allIncluded = [
      ...selection.heroIndicators,
      ...selection.primaryIndicators,
      ...selection.secondaryIndicators,
      ...selection.mentionIndicators,
    ];
    
    return allIncluded.some(s => s.indicatorId === indicatorId);
  }, [selection]);
  
  // Helper: get score for specific indicator
  const getIndicatorScore = useCallback((indicatorId: string): WorthinessScore | undefined => {
    if (!selection) return undefined;
    
    const all = [
      ...selection.heroIndicators,
      ...selection.primaryIndicators,
      ...selection.secondaryIndicators,
      ...selection.mentionIndicators,
      ...selection.excludedIndicators,
    ];
    
    return all.find(s => s.indicatorId === indicatorId);
  }, [selection]);
  
  // Helper: get indicators by priority
  const getIndicatorsByPriority = useCallback((
    priority: WorthinessScore['suggestedPriority']
  ): WorthinessScore[] => {
    if (!selection) return [];
    
    switch (priority) {
      case 'hero':
        return selection.heroIndicators;
      case 'primary':
        return selection.primaryIndicators;
      case 'secondary':
        return selection.secondaryIndicators;
      case 'mention':
        return selection.mentionIndicators;
      default:
        return [];
    }
  }, [selection]);
  
  return {
    selection,
    isLoading,
    error,
    evaluateIndicators,
    evaluateSingle,
    reset,
    stats,
    isWrapWorthy,
    getIndicatorScore,
    getIndicatorsByPriority,
  };
}

// ===========================================
// MOCK DATA GENERATOR (for testing)
// ===========================================

export function generateMockIndicators(count: number = 20): IndicatorSnapshot[] {
  const categories = ['economy', 'health', 'environment', 'education', 'security'];
  const relevanceLevels: RelevanceLevel[] = ['L0', 'L1', 'L2', 'L3', 'L4'];
  
  return Array.from({ length: count }, (_, i) => {
    const relevanceLevel = relevanceLevels[Math.floor(Math.random() * relevanceLevels.length)];
    const changePercent = (Math.random() - 0.5) * 60; // -30% to +30%
    const isBreaking = Math.random() > 0.85;
    
    return {
      id: `indicator-${i + 1}`,
      code: `KPI_${String(i + 1).padStart(3, '0')}`,
      name: `Indicator ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      currentValue: 100 + Math.random() * 50,
      previousValue: 100,
      unit: '%',
      changePercent,
      changeAbsolute: changePercent,
      periodStart: '2024-01-01',
      periodEnd: '2024-12-31',
      confidence: 0.5 + Math.random() * 0.5,
      dataAvailability: Math.random() > 0.1 ? 'verified' : 'partial',
      sourceCount: Math.floor(Math.random() * 5) + 1,
      lastVerified: new Date().toISOString(),
      relevanceLevel,
      affectedPopulationPercent: Math.random() * 100,
      crossDomainLinks: Math.random() > 0.5 
        ? categories.slice(0, Math.floor(Math.random() * 3) + 1)
        : undefined,
      trendDirection: changePercent > 2 ? 'up' : changePercent < -2 ? 'down' : 'stable',
      trendAcceleration: (Math.random() - 0.5) * 2,
      isBreakingPattern: isBreaking,
      consecutiveDirectionMonths: Math.floor(Math.random() * 12) + 1,
    } as IndicatorSnapshot;
  });
}
