import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KPI } from '@/types/kpi';

export interface LiveDataPoint {
  month: number;
  baseline: number;
  optimistic: number;
  pessimistic: number;
  lower_bound: number;
  upper_bound: number;
}

export interface TrendAnalysis {
  direction: 'up' | 'down' | 'stable';
  momentum: number;
  volatility: number;
  seasonality_detected: boolean;
}

export interface RiskAssessment {
  probability_of_decline: number;
  probability_of_improvement: number;
  critical_threshold: number;
  warning_threshold: number;
}

export interface LiveForecastData {
  datapoints: LiveDataPoint[];
  trend_analysis: TrendAnalysis;
  risk_assessment: RiskAssessment;
  confidence_interval: {
    level: number;
    methodology: string;
  };
}

interface UseLiveForecastOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  horizon?: '12_months' | '24_months' | '60_months';
}

export function useLiveForecast(
  kpi: KPI | null,
  options: UseLiveForecastOptions = {}
) {
  const { 
    autoRefresh = false, 
    refreshInterval = 30000,
    horizon = '12_months'
  } = options;

  const [data, setData] = useState<LiveForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [animatedData, setAnimatedData] = useState<LiveDataPoint[]>([]);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchForecast = useCallback(async () => {
    if (!kpi) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data: responseData, error: fnError } = await supabase.functions.invoke('kpi-forecast-stream', {
        body: {
          kpi: {
            id: kpi.id,
            name: kpi.name,
            category: kpi.category,
            value: kpi.value,
            unit: kpi.unit,
            trend: kpi.trend,
            trendPercent: kpi.trendPercent,
            status: kpi.status,
            inverted: kpi.inverted,
            rationale: kpi.rationale,
          },
          horizon,
        },
      });

      if (fnError) throw fnError;

      if (responseData?.stream_data) {
        setData(responseData.stream_data);
        setLastUpdated(new Date());
        
        // Animate data points appearing one by one
        animateDataPoints(responseData.stream_data.datapoints);
      } else {
        throw new Error('Ingen prognosdata mottagen');
      }
    } catch (err) {
      console.error('Live forecast error:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte hämta prognos');
    } finally {
      setIsLoading(false);
    }
  }, [kpi, horizon]);

  // Animate data points appearing progressively
  const animateDataPoints = useCallback((points: LiveDataPoint[]) => {
    setAnimatedData([]);
    
    // Cancel any ongoing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    // Add points one by one with delay
    points.forEach((point, index) => {
      animationRef.current = setTimeout(() => {
        setAnimatedData(prev => [...prev, point]);
      }, index * 80); // 80ms delay between each point
    });
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && kpi) {
      fetchForecast();
      
      intervalRef.current = setInterval(fetchForecast, refreshInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchForecast, kpi]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const refresh = useCallback(() => {
    fetchForecast();
  }, [fetchForecast]);

  return {
    data,
    animatedData,
    isLoading,
    error,
    lastUpdated,
    refresh,
    isLive: autoRefresh,
  };
}
