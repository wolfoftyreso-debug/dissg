import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KPI, KPIStatus, TrendDirection } from '@/types/kpi';

interface DataSource {
  id: string;
  code: string;
  name: string;
  update_frequency: string;
  reliability_score: number;
  last_successful_fetch: string | null;
  last_fetch_error: string | null;
  is_active: boolean;
}

// Fetch all KPI definitions with their latest values
export function useKPIOverview() {
  return useQuery({
    queryKey: ['kpi-overview'],
    queryFn: async (): Promise<KPI[]> => {
      // Get definitions
      const { data: definitions, error: defError } = await supabase
        .from('kpi_definitions')
        .select('*')
        .eq('is_active', true)
        .order('kpi_index');

      if (defError) throw defError;

      if (!definitions || definitions.length === 0) {
        return [];
      }

      // Get latest values for each KPI
      const kpis: KPI[] = await Promise.all(
        definitions.map(async (def) => {
          const { data: latestValue } = await supabase
            .from('kpi_values')
            .select('*')
            .eq('kpi_id', def.id)
            .eq('granularity', 'national')
            .order('period_end', { ascending: false })
            .limit(1)
            .single();

          // Get data sources for this KPI
          const { data: sourceMappings } = await supabase
            .from('kpi_data_source_mapping')
            .select(`
              is_primary,
              data_sources (
                code,
                name,
                update_frequency,
                reliability_score
              )
            `)
            .eq('kpi_id', def.id);

          const dataSources = sourceMappings?.map((m: any) => ({
            name: m.data_sources?.name || 'Unknown',
            updateFrequency: m.data_sources?.update_frequency || 'monthly',
            reliability: m.data_sources?.reliability_score || 80,
          })) || [];

          // Parse red_flag_conditions safely
          let redFlags: { condition: string; threshold?: string }[] = [];
          if (def.red_flag_conditions) {
            try {
              if (typeof def.red_flag_conditions === 'string') {
                redFlags = JSON.parse(def.red_flag_conditions);
              } else if (Array.isArray(def.red_flag_conditions)) {
                redFlags = def.red_flag_conditions as { condition: string; threshold?: string }[];
              }
            } catch {
              redFlags = [];
            }
          }

          return {
            id: def.code,
            index: def.kpi_index,
            name: def.name,
            category: def.category,
            value: latestValue?.value ?? 0,
            unit: def.unit,
            previousValue: latestValue?.previous_value ?? 0,
            status: (latestValue?.status as KPIStatus) ?? 'neutral',
            trend: (latestValue?.trend as TrendDirection) ?? 'stable',
            trendPercent: latestValue?.trend_percent ?? 0,
            confidence: latestValue?.confidence ?? 50,
            lastUpdated: latestValue?.updated_at ?? new Date().toISOString().split('T')[0],
            shortTermTrend: 'Väntar på data',
            longTermTrend: 'Väntar på data',
            description: def.description,
            rationale: def.rationale,
            dataSources,
            redFlags,
            breakdownAvailable: (def.breakdown_dimensions || []) as ('region' | 'age' | 'time' | 'gender')[],
            inverted: def.is_inverted,
          };
        })
      );

      return kpis;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
}

// Fetch time series for a specific KPI
export function useKPITimeSeries(kpiCode: string, periods: number = 52) {
  return useQuery({
    queryKey: ['kpi-timeseries', kpiCode, periods],
    queryFn: async () => {
      // First get the KPI definition
      const { data: def, error: defError } = await supabase
        .from('kpi_definitions')
        .select('id')
        .eq('code', kpiCode)
        .single();

      if (defError || !def) throw new Error(`KPI not found: ${kpiCode}`);

      // Get time series values
      const { data: values, error: valError } = await supabase
        .from('kpi_values')
        .select('period_start, period_end, value, status, trend, trend_percent, confidence')
        .eq('kpi_id', def.id)
        .eq('granularity', 'national')
        .order('period_end', { ascending: false })
        .limit(periods);

      if (valError) throw valError;

      return values?.reverse() ?? [];
    },
    enabled: !!kpiCode,
  });
}

// Fetch active alerts
export function useActiveAlerts() {
  return useQuery({
    queryKey: ['kpi-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_alerts')
        .select(`
          *,
          kpi_definitions (kpi_index, name, code)
        `)
        .is('resolved_at', null)
        .order('triggered_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

// Fetch data sources status
export function useDataSources() {
  return useQuery({
    queryKey: ['data-sources'],
    queryFn: async (): Promise<DataSource[]> => {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('name');

      if (error) throw error;
      return (data as DataSource[]) ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch ingest logs
export function useIngestLogs(limit: number = 50) {
  return useQuery({
    queryKey: ['ingest-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingest_log')
        .select(`
          *,
          data_sources (code, name)
        `)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data ?? [];
    },
  });
}
