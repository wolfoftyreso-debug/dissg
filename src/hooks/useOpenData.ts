/**
 * OPEN DATA HOOK
 * 
 * Universal hook for fetching data from open sources.
 * Part of Data Channel B: Semi-official/Aggregated Sources.
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type OpenDataCategory = 'news' | 'weather' | 'finance' | 'sports' | 'transport' | 'government' | 'social';

export interface OpenDataResult<T = unknown> {
  success: boolean;
  category: OpenDataCategory;
  source: string;
  source_url: string;
  license: string;
  updated_at: string;
  data: T[];
  meta: {
    fetched_at: string;
    data_layer: string;
    is_empirical: boolean;
    aggregation_type: string;
  };
}

export interface WeatherDataPoint {
  timestamp: string;
  temperature: number;
  precipitation: number;
  wind_speed: number;
}

export interface NewsDataPoint {
  title: string;
  summary: string;
  published_at: string;
  url: string;
  category: string;
}

export interface FinanceDataPoint {
  currency: string;
  rate: number;
}

export interface SportsDataPoint {
  id: string;
  date: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  venue: string;
  league: string;
}

export interface GovernmentDataPoint {
  id: string;
  title: string;
  description: string;
  publisher: string;
  modified: string;
  formats: string[];
}

interface UseOpenDataOptions {
  category: OpenDataCategory;
  source?: string;
  params?: Record<string, string>;
  geo?: { lat: number; lon: number };
  autoFetch?: boolean;
}

export function useOpenData<T = unknown>({ 
  category, 
  source, 
  params, 
  geo,
  autoFetch: _autoFetch = false 
}: UseOpenDataOptions) {
  const [data, setData] = useState<OpenDataResult<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: result, error: fetchError } = await supabase.functions.invoke(
        'open-data-aggregator',
        {
          body: { category, source, params, geo }
        }
      );
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }
      
      setData(result as OpenDataResult<T>);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error(`[OPEN-DATA] Error fetching ${category}:`, message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [category, source, params, geo]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    refetch: fetchData,
  };
}

// Typed convenience hooks
export function useWeatherData(geo?: { lat: number; lon: number }) {
  return useOpenData<WeatherDataPoint>({ category: 'weather', geo });
}

export function useNewsData(source?: string) {
  return useOpenData<NewsDataPoint>({ category: 'news', source });
}

export function useFinanceData(currency?: string) {
  return useOpenData<FinanceDataPoint>({ 
    category: 'finance', 
    params: currency ? { currency } : undefined 
  });
}

export function useSportsData(league?: string) {
  return useOpenData<SportsDataPoint>({ 
    category: 'sports', 
    params: league ? { league } : undefined 
  });
}

export function useGovernmentData(query?: string) {
  return useOpenData<GovernmentDataPoint>({ 
    category: 'government', 
    params: query ? { query } : undefined 
  });
}
