// Hook for generating and managing Wrapped presentations

import { useState, useCallback, useMemo } from 'react';
import type { 
  WrappedInput, 
  WrappedOutput, 
  WrappedValidation,
  WrappedDataPoint,
  WrappedRanking,
  WrappedTimelineMarker,
  WrappedLimitation,
  WrappedStep 
} from '@/types/wrapped';
import { WRAPPED_STYLE } from '@/config/wrappedConfig';

// Validate input completeness
function validateInput(input: Partial<WrappedInput>): WrappedValidation {
  const missingFields: string[] = [];
  const errors: string[] = [];

  if (!input.scope) missingFields.push('scope');
  if (!input.geoIds?.length) missingFields.push('geoIds');
  if (!input.timeRange) missingFields.push('timeRange');
  if (!input.indicators?.length) missingFields.push('indicators');
  if (!input.comparison?.length) missingFields.push('comparison');

  return {
    isValid: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors,
  };
}

// Classify change magnitude
function classifyChange(changePercent: number | null): 'significant' | 'minor' | 'stable' {
  if (changePercent === null) return 'stable';
  const abs = Math.abs(changePercent);
  if (abs >= WRAPPED_STYLE.significantChangePercent) return 'significant';
  if (abs >= WRAPPED_STYLE.minorChangePercent) return 'minor';
  return 'stable';
}

// Generate neutral summary text (no celebration, no doom)
function generateNeutralSummary(dataPoints: WrappedDataPoint[]): string {
  const ups = dataPoints.filter(d => d.changeDirection === 'up' && d.isPositiveChange);
  const downs = dataPoints.filter(d => d.changeDirection === 'down' && !d.isPositiveChange);
  const stable = dataPoints.filter(d => d.changeDirection === 'stable');

  const parts: string[] = [];
  
  if (ups.length > 0) {
    parts.push(`${ups.length} indikator${ups.length > 1 ? 'er' : ''} visade förbättring`);
  }
  if (downs.length > 0) {
    parts.push(`${downs.length} indikator${downs.length > 1 ? 'er' : ''} visade försämring`);
  }
  if (stable.length > 0) {
    parts.push(`${stable.length} var oförändrad${stable.length > 1 ? 'e' : ''}`);
  }

  return parts.join(', ') + '.';
}

// Mock data generator for demo purposes
function generateMockWrapped(input: WrappedInput): WrappedOutput {
  const mockDataPoints: WrappedDataPoint[] = [
    {
      indicatorId: 'employment_rate',
      indicatorName: 'Sysselsättningsgrad',
      value: 78.2,
      previousValue: 76.8,
      unit: '%',
      changePercent: 1.8,
      changeDirection: 'up',
      isPositiveChange: true,
      confidence: 92,
      dataSource: 'SCB',
      lastUpdated: '2025-01-15',
    },
    {
      indicatorId: 'life_expectancy',
      indicatorName: 'Medellivslängd',
      value: 83.1,
      previousValue: 82.9,
      unit: 'år',
      changePercent: 0.2,
      changeDirection: 'stable',
      isPositiveChange: true,
      confidence: 95,
      dataSource: 'Socialstyrelsen',
      lastUpdated: '2025-01-10',
    },
    {
      indicatorId: 'gdp_per_capita',
      indicatorName: 'BNP per capita',
      value: 548000,
      previousValue: 532000,
      unit: 'SEK',
      changePercent: 3.0,
      changeDirection: 'up',
      isPositiveChange: true,
      confidence: 88,
      dataSource: 'SCB',
      lastUpdated: '2025-01-20',
    },
    {
      indicatorId: 'crime_rate',
      indicatorName: 'Anmälda brott per 100k',
      value: 14200,
      previousValue: 13800,
      unit: 'per 100k',
      changePercent: 2.9,
      changeDirection: 'up',
      isPositiveChange: false, // Inverted - up is bad
      confidence: 90,
      dataSource: 'BRÅ',
      lastUpdated: '2025-01-18',
    },
  ];

  const rankings: WrappedRanking[] = [
    {
      indicatorId: 'employment_rate',
      rank: 8,
      total: 27,
      percentile: 70,
      referenceGroup: 'EU-27',
      referenceGroupDescription: 'Jämförbara EU-länder',
    },
    {
      indicatorId: 'life_expectancy',
      rank: 5,
      total: 27,
      percentile: 81,
      referenceGroup: 'EU-27',
      referenceGroupDescription: 'Jämförbara EU-länder',
    },
  ];

  const timelineMarkers: WrappedTimelineMarker[] = [
    { date: '2025-03-01', indicatorId: 'employment_rate', value: 77.1, isSignificant: false },
    { date: '2025-06-01', indicatorId: 'employment_rate', value: 77.8, isSignificant: true },
    { date: '2025-09-01', indicatorId: 'employment_rate', value: 78.0, isSignificant: false },
    { date: '2025-12-01', indicatorId: 'employment_rate', value: 78.2, isSignificant: false },
  ];

  const limitations: WrappedLimitation[] = [
    {
      type: 'causation',
      description: 'Korrelationer mellan indikatorer innebär inte orsakssamband.',
      severity: 'significant',
    },
    {
      type: 'temporal',
      description: 'Viss data uppdateras med fördröjning och kan justeras i efterhand.',
      severity: 'moderate',
    },
    {
      type: 'scope',
      description: 'Regionala variationer kan dölja lokala avvikelser.',
      severity: 'minor',
    },
  ];

  const biggestChanges = [...mockDataPoints]
    .filter(d => classifyChange(d.changePercent) === 'significant')
    .sort((a, b) => Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0))
    .slice(0, 3);

  const stableIndicators = mockDataPoints.filter(d => classifyChange(d.changePercent) === 'stable');

  return {
    id: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    input,
    overview: {
      title: `${input.timeRange} i översikt`,
      subtitle: `${input.geoIds.join(', ')} – ${input.indicators.length} indikatorer`,
      mainIndicators: mockDataPoints.slice(0, 2),
      summaryText: generateNeutralSummary(mockDataPoints),
    },
    biggestChanges: {
      changes: biggestChanges,
      analysisText: biggestChanges.length > 0 
        ? `Under perioden förändrades ${biggestChanges.length} indikatorer mer än ${WRAPPED_STYLE.significantChangePercent}%.`
        : 'Inga indikatorer visade signifikanta förändringar under perioden.',
    },
    timeline: {
      markers: timelineMarkers,
      periodStart: '2025-01-01',
      periodEnd: '2025-12-31',
    },
    comparisons: {
      rankings,
      comparisonText: `Rankad ${rankings[0]?.rank} av ${rankings[0]?.total} bland ${rankings[0]?.referenceGroupDescription?.toLowerCase() || 'jämförbara länder'}.`,
    },
    unchanged: {
      stableIndicators,
      stabilityText: stableIndicators.length > 0
        ? 'Flera nyckelindikatorer visade ingen signifikant förändring.'
        : 'Alla indikatorer visade mätbar förändring under perioden.',
    },
    limitations: {
      items: limitations,
      disclaimerText: 'Denna sammanfattning baseras på tillgängliga data och innebär inte prognos eller orsaksanalys.',
    },
    deepDive: {
      availableViews: [
        { type: 'full_graph', label: 'Fullständiga grafer', url: '/dashboard' },
        { type: 'methodology', label: 'Metod och beräkningar', url: '/methodology' },
        { type: 'raw_data', label: 'Rådata', url: '/data' },
        { type: 'sources', label: 'Källor', url: '/sources' },
      ],
    },
    isDemo: true,
    shareableUrl: null,
    version: '1.0.0',
  };
}

export function useWrappedEngine() {
  const [currentStep, setCurrentStep] = useState<WrappedStep>(1);
  const [wrapped, setWrapped] = useState<WrappedOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (input: WrappedInput): Promise<WrappedOutput | null> => {
    const validation = validateInput(input);
    
    if (!validation.isValid) {
      setError(`Saknade fält: ${validation.missingFields.join(', ')}`);
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // In production, this would call the backend
      // For now, generate mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const result = generateMockWrapped(input);
      setWrapped(result);
      setCurrentStep(1);
      return result;
    } catch (err) {
      setError('Kunde inte generera sammanfattning');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(7, prev + 1) as WrappedStep);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1) as WrappedStep);
  }, []);

  const goToStep = useCallback((step: WrappedStep) => {
    setCurrentStep(step);
  }, []);

  const reset = useCallback(() => {
    setWrapped(null);
    setCurrentStep(1);
    setError(null);
  }, []);

  const stepData = useMemo(() => {
    if (!wrapped) return null;
    
    switch (currentStep) {
      case 1: return wrapped.overview;
      case 2: return wrapped.biggestChanges;
      case 3: return wrapped.timeline;
      case 4: return wrapped.comparisons;
      case 5: return wrapped.unchanged;
      case 6: return wrapped.limitations;
      case 7: return wrapped.deepDive;
      default: return null;
    }
  }, [wrapped, currentStep]);

  return {
    // State
    wrapped,
    currentStep,
    stepData,
    isGenerating,
    error,
    
    // Actions
    generate,
    nextStep,
    prevStep,
    goToStep,
    reset,
    
    // Utilities
    validateInput,
    classifyChange,
    totalSteps: 7 as const,
  };
}
