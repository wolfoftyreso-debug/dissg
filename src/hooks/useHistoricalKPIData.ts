import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subYears } from 'date-fns';

export interface HistoricalDataPoint {
  date: string;
  value: number;
  previousValue: number | null;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number | null;
  confidence: number;
  status: 'positive' | 'warning' | 'critical' | 'neutral';
  isProvisional: boolean;
  projected?: boolean;
}

export interface KPIHistoricalData {
  kpiId: string;
  kpiName: string;
  kpiCode: string;
  unit: string;
  data: HistoricalDataPoint[];
  stats: {
    min: number;
    max: number;
    avg: number;
    first: number;
    last: number;
    change: number;
  };
}

type TimeRange = '1y' | '3y' | '5y' | '10y';

function getStartDate(timeRange: TimeRange): Date {
  const now = new Date();
  switch (timeRange) {
    case '1y': return subYears(now, 1);
    case '3y': return subYears(now, 3);
    case '5y': return subYears(now, 5);
    case '10y': return subYears(now, 10);
    default: return subYears(now, 5);
  }
}

export function useHistoricalKPIData(kpiId: string | undefined, timeRange: TimeRange = '5y') {
  return useQuery({
    queryKey: ['kpi-historical', kpiId, timeRange],
    queryFn: async (): Promise<KPIHistoricalData | null> => {
      if (!kpiId) return null;
      
      const startDate = getStartDate(timeRange);
      
      // Fetch KPI definition
      const { data: kpiDef, error: defError } = await supabase
        .from('kpi_definitions')
        .select('id, name, code, unit')
        .eq('id', kpiId)
        .single();
      
      if (defError || !kpiDef) {
        console.error('Error fetching KPI definition:', defError);
        return null;
      }
      
      // Fetch historical values
      const { data: values, error: valuesError } = await supabase
        .from('kpi_values')
        .select('*')
        .eq('kpi_id', kpiId)
        .gte('period_start', format(startDate, 'yyyy-MM-dd'))
        .order('period_start', { ascending: true });
      
      if (valuesError) {
        console.error('Error fetching KPI values:', valuesError);
        return null;
      }
      
      if (!values || values.length === 0) {
        // No data found, return empty result
        return {
          kpiId,
          kpiName: kpiDef.name,
          kpiCode: kpiDef.code,
          unit: kpiDef.unit,
          data: [],
          stats: { min: 0, max: 0, avg: 0, first: 0, last: 0, change: 0 },
        };
      }
      
      const dataPoints: HistoricalDataPoint[] = values.map(v => ({
        date: v.period_start,
        value: Number(v.value),
        previousValue: v.previous_value ? Number(v.previous_value) : null,
        trend: v.trend as 'up' | 'down' | 'stable',
        trendPercent: v.trend_percent ? Number(v.trend_percent) : null,
        confidence: v.confidence,
        status: v.status as 'positive' | 'warning' | 'critical' | 'neutral',
        isProvisional: v.is_provisional,
        projected: false,
      }));
      
      // Calculate stats
      const numericValues = dataPoints.map(d => d.value);
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      const first = numericValues[0];
      const last = numericValues[numericValues.length - 1];
      const change = first !== 0 ? ((last - first) / first) * 100 : 0;
      
      return {
        kpiId,
        kpiName: kpiDef.name,
        kpiCode: kpiDef.code,
        unit: kpiDef.unit,
        data: dataPoints,
        stats: { min, max, avg, first, last, change },
      };
    },
    enabled: !!kpiId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMultipleKPIHistoricalData(kpiIds: string[], timeRange: TimeRange = '3y') {
  return useQuery({
    queryKey: ['kpi-historical-multi', kpiIds.join(','), timeRange],
    queryFn: async (): Promise<{
      chartData: Array<{ date: string; [key: string]: string | number }>;
      kpiMap: Record<string, { id: string; name: string; code: string; unit: string }>;
      kpiDefs: Array<{ id: string; name: string; code: string; unit: string }>;
    }> => {
      if (kpiIds.length === 0) return { chartData: [], kpiMap: {}, kpiDefs: [] };
      
      const startDate = getStartDate(timeRange);
      
      // Fetch all KPI definitions
      const { data: kpiDefs, error: defError } = await supabase
        .from('kpi_definitions')
        .select('id, name, code, unit')
        .in('id', kpiIds);
      
      if (defError || !kpiDefs) {
        console.error('Error fetching KPI definitions:', defError);
        return { chartData: [], kpiMap: {}, kpiDefs: [] };
      }
      
      // Fetch all historical values for the selected KPIs
      const { data: values, error: valuesError } = await supabase
        .from('kpi_values')
        .select('*')
        .in('kpi_id', kpiIds)
        .gte('period_start', format(startDate, 'yyyy-MM-dd'))
        .order('period_start', { ascending: true });
      
      if (valuesError) {
        console.error('Error fetching KPI values:', valuesError);
        return { chartData: [], kpiMap: {}, kpiDefs: [] };
      }
      
      // Group data by date for chart consumption
      const dataByDate = new Map<string, { date: string; [key: string]: string | number }>();
      
      values?.forEach(v => {
        const existing = dataByDate.get(v.period_start) || { date: v.period_start };
        existing[v.kpi_id] = Number(v.value);
        dataByDate.set(v.period_start, existing);
      });
      
      // Convert to sorted array
      const chartData = Array.from(dataByDate.values())
        .sort((a, b) => String(a.date).localeCompare(String(b.date)));
      
      // Create KPI map for tooltip lookups
      const kpiMap = kpiDefs.reduce((acc, kpi) => {
        acc[kpi.id] = kpi;
        return acc;
      }, {} as Record<string, typeof kpiDefs[0]>);
      
      return {
        chartData,
        kpiMap,
        kpiDefs,
      };
    },
    enabled: kpiIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to get all available KPIs for selection
export function useAvailableKPIs() {
  return useQuery({
    queryKey: ['kpi-definitions-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_definitions')
        .select('id, name, code, category, unit, kpi_index')
        .eq('is_active', true)
        .order('kpi_index', { ascending: true });
      
      if (error) {
        console.error('Error fetching KPI definitions:', error);
        return [];
      }
      
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
