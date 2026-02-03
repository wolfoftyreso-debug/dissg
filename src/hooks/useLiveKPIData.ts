/**
 * LIVE KPI DATA HOOK
 * 
 * Central hook för att hämta live-data från databasen.
 * Ersätter alla mock-funktioner i systemet.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// === TYPES ===

export interface KPIDefinition {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  description?: string;
  isActive: boolean;
}

export interface KPIValue {
  id: string;
  kpiId: string;
  value: number;
  periodStart: string;
  periodEnd: string;
  trend: string | null;
  confidence: number | null;
}

export interface KPIWithLatestValue extends KPIDefinition {
  latestValue: number | null;
  latestTrend: string | null;
  valueCount: number;
}

export interface TimeSeriesPoint {
  period: string;
  year: number;
  month: number;
  value: number;
  trend: string | null;
}

export interface CategoryAggregate {
  category: string;
  kpiCount: number;
  improvingCount: number;
  decliningCount: number;
  stableCount: number;
  averageValue: number;
}

// === FETCH FUNCTIONS ===

const fetchAllKPIs = async (): Promise<KPIDefinition[]> => {
  const { data, error } = await supabase
    .from('kpi_definitions')
    .select('id, code, name, category, unit, description, is_active')
    .eq('is_active', true)
    .order('category', { ascending: true });

  if (error) throw error;

  return (data || []).map(kpi => ({
    id: kpi.id,
    code: kpi.code,
    name: kpi.name,
    category: kpi.category,
    unit: kpi.unit || '',
    description: kpi.description || '',
    isActive: kpi.is_active,
  }));
};

const fetchKPIValues = async (kpiId: string): Promise<KPIValue[]> => {
  const { data, error } = await supabase
    .from('kpi_values')
    .select('id, kpi_id, value, period_start, period_end, trend, confidence')
    .eq('kpi_id', kpiId)
    .order('period_start', { ascending: true });

  if (error) throw error;

  return (data || []).map(v => ({
    id: v.id,
    kpiId: v.kpi_id,
    value: Number(v.value),
    periodStart: v.period_start,
    periodEnd: v.period_end,
    trend: v.trend,
    confidence: v.confidence,
  }));
};

const fetchKPIsWithLatestValues = async (): Promise<KPIWithLatestValue[]> => {
  const { data: kpis, error: kpiError } = await supabase
    .from('kpi_definitions')
    .select('id, code, name, category, unit, description, is_active')
    .eq('is_active', true)
    .order('category', { ascending: true });

  if (kpiError) throw kpiError;

  // Get all values with their KPI info
  const { data: values, error: valError } = await supabase
    .from('kpi_values')
    .select('kpi_id, value, trend, period_start')
    .order('period_start', { ascending: false });

  if (valError) throw valError;

  // Group values by KPI
  const valuesByKpi = (values || []).reduce((acc, v) => {
    if (!acc[v.kpi_id]) acc[v.kpi_id] = [];
    acc[v.kpi_id].push(v);
    return acc;
  }, {} as Record<string, typeof values>);

  return (kpis || []).map(kpi => {
    const kpiValues = valuesByKpi[kpi.id] || [];
    const latest = kpiValues[0];
    
    return {
      id: kpi.id,
      code: kpi.code,
      name: kpi.name,
      category: kpi.category,
      unit: kpi.unit || '',
      description: kpi.description || '',
      isActive: kpi.is_active,
      latestValue: latest ? Number(latest.value) : null,
      latestTrend: latest?.trend || null,
      valueCount: kpiValues.length,
    };
  });
};

const fetchTimeSeriesForKPI = async (kpiId: string): Promise<TimeSeriesPoint[]> => {
  const { data, error } = await supabase
    .from('kpi_values')
    .select('value, period_start, trend')
    .eq('kpi_id', kpiId)
    .order('period_start', { ascending: true });

  if (error) throw error;

  return (data || []).map(v => {
    const date = new Date(v.period_start);
    return {
      period: v.period_start,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      value: Number(v.value),
      trend: v.trend,
    };
  });
};

const fetchCategoryAggregates = async (): Promise<CategoryAggregate[]> => {
  const kpisWithValues = await fetchKPIsWithLatestValues();
  
  const byCategory = kpisWithValues.reduce((acc, kpi) => {
    if (!acc[kpi.category]) {
      acc[kpi.category] = {
        category: kpi.category,
        kpiCount: 0,
        improvingCount: 0,
        decliningCount: 0,
        stableCount: 0,
        averageValue: 0,
        totalValue: 0,
        valueCount: 0,
      };
    }
    
    acc[kpi.category].kpiCount++;
    
    if (kpi.latestTrend === 'up') acc[kpi.category].improvingCount++;
    else if (kpi.latestTrend === 'down') acc[kpi.category].decliningCount++;
    else acc[kpi.category].stableCount++;
    
    if (kpi.latestValue !== null) {
      acc[kpi.category].totalValue += kpi.latestValue;
      acc[kpi.category].valueCount++;
    }
    
    return acc;
  }, {} as Record<string, CategoryAggregate & { totalValue: number; valueCount: number }>);

  return Object.values(byCategory).map(cat => ({
    category: cat.category,
    kpiCount: cat.kpiCount,
    improvingCount: cat.improvingCount,
    decliningCount: cat.decliningCount,
    stableCount: cat.stableCount,
    averageValue: cat.valueCount > 0 ? cat.totalValue / cat.valueCount : 0,
  }));
};

const fetchMultipleTimeSeries = async (kpiIds: string[]): Promise<Record<string, TimeSeriesPoint[]>> => {
  const { data, error } = await supabase
    .from('kpi_values')
    .select('kpi_id, value, period_start, trend')
    .in('kpi_id', kpiIds)
    .order('period_start', { ascending: true });

  if (error) throw error;

  const result: Record<string, TimeSeriesPoint[]> = {};
  
  for (const v of data || []) {
    if (!result[v.kpi_id]) result[v.kpi_id] = [];
    const date = new Date(v.period_start);
    result[v.kpi_id].push({
      period: v.period_start,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      value: Number(v.value),
      trend: v.trend,
    });
  }

  return result;
};

// === HOOKS ===

export const useAllKPIs = () => {
  return useQuery({
    queryKey: ['kpi-definitions'],
    queryFn: fetchAllKPIs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useKPIValues = (kpiId: string | null) => {
  return useQuery({
    queryKey: ['kpi-values', kpiId],
    queryFn: () => fetchKPIValues(kpiId!),
    enabled: !!kpiId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useKPIsWithLatestValues = () => {
  return useQuery({
    queryKey: ['kpis-with-values'],
    queryFn: fetchKPIsWithLatestValues,
    staleTime: 2 * 60 * 1000,
  });
};

export const useKPITimeSeries = (kpiId: string | null) => {
  return useQuery({
    queryKey: ['kpi-timeseries', kpiId],
    queryFn: () => fetchTimeSeriesForKPI(kpiId!),
    enabled: !!kpiId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCategoryAggregates = () => {
  return useQuery({
    queryKey: ['category-aggregates'],
    queryFn: fetchCategoryAggregates,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMultipleTimeSeries = (kpiIds: string[]) => {
  return useQuery({
    queryKey: ['multiple-timeseries', kpiIds],
    queryFn: () => fetchMultipleTimeSeries(kpiIds),
    enabled: kpiIds.length > 0,
    staleTime: 2 * 60 * 1000,
  });
};

// === HELPER FUNCTIONS ===

export const CATEGORY_LABELS: Record<string, string> = {
  demografi_halsa: 'Demografi & Hälsa',
  arbete_produktivitet: 'Arbete & Produktivitet',
  ekonomisk_barkraft: 'Ekonomisk Bärkraft',
  social_stabilitet: 'Social Stabilitet',
  systemrisk_styrning: 'Systemrisk & Styrning',
  infrastruktur: 'Infrastruktur',
  karnsystem_funktion: 'Kärnsystem Funktion',
};

export const getTrendDirection = (trend: string | null): 'improving' | 'declining' | 'stable' => {
  if (trend === 'up') return 'improving';
  if (trend === 'down') return 'declining';
  return 'stable';
};

export const calculateTrendFromValues = (values: number[]): 'up' | 'down' | 'stable' => {
  if (values.length < 2) return 'stable';
  
  const recent = values.slice(-3);
  const older = values.slice(-6, -3);
  
  if (recent.length === 0 || older.length === 0) {
    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;
    
    if (change > 2) return 'up';
    if (change < -2) return 'down';
    return 'stable';
  }
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (change > 2) return 'up';
  if (change < -2) return 'down';
  return 'stable';
};
