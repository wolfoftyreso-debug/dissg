import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TimelineEvent {
  id: string;
  event_date: string;
  event_title: string;
  event_description: string | null;
  event_type: string | null;
  responsible_entity: string | null;
  responsible_level: string | null;
  source_document: string | null;
  source_url: string | null;
  affected_kpi_ids: string[];
  decision_id: string | null;
  action_id: string | null;
}

export interface PolicyDecision {
  id: string;
  title: string;
  description: string | null;
  decision_date: string;
  status: string;
  target_kpis: string[];
  expected_effect: string | null;
  measured_effect: string | null;
  effectiveness_score: number | null;
}

export interface KpiChangePoint {
  kpi_id: string;
  kpi_name: string;
  kpi_code: string;
  period_start: string;
  value: number;
  previous_value: number | null;
  trend: string;
  trend_percent: number | null;
  status: string;
}

export interface TimelineData {
  events: TimelineEvent[];
  decisions: PolicyDecision[];
  kpiChanges: KpiChangePoint[];
}

// Fetch complete timeline data
export function useDecisionTimeline(fromDate?: string, toDate?: string) {
  return useQuery({
    queryKey: ['decision-timeline', fromDate, toDate],
    queryFn: async (): Promise<TimelineData> => {
      const dateFilter = {
        from: fromDate || '2010-01-01',
        to: toDate || new Date().toISOString().split('T')[0],
      };

      // Fetch timeline events
      const { data: events, error: eventsError } = await supabase
        .from('decision_timeline')
        .select('*')
        .gte('event_date', dateFilter.from)
        .lte('event_date', dateFilter.to)
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch policy decisions
      const { data: decisions, error: decisionsError } = await supabase
        .from('policy_decisions')
        .select('*')
        .gte('decision_date', dateFilter.from)
        .lte('decision_date', dateFilter.to)
        .order('decision_date', { ascending: true });

      if (decisionsError) throw decisionsError;

      // Fetch KPI values with significant changes
      const { data: kpiValues, error: kpiError } = await supabase
        .from('kpi_values')
        .select(`
          id,
          kpi_id,
          period_start,
          value,
          previous_value,
          trend,
          trend_percent,
          status,
          kpi_definitions!inner(name, code)
        `)
        .gte('period_start', dateFilter.from)
        .lte('period_start', dateFilter.to)
        .not('trend_percent', 'is', null)
        .order('period_start', { ascending: true });

      if (kpiError) throw kpiError;

      // Transform KPI values
      const kpiChanges: KpiChangePoint[] = (kpiValues || [])
        .filter((v: any) => Math.abs(v.trend_percent || 0) > 2) // Only significant changes
        .map((v: any) => ({
          kpi_id: v.kpi_id,
          kpi_name: v.kpi_definitions?.name || 'Okänd',
          kpi_code: v.kpi_definitions?.code || '',
          period_start: v.period_start,
          value: v.value,
          previous_value: v.previous_value,
          trend: v.trend,
          trend_percent: v.trend_percent,
          status: v.status,
        }));

      return {
        events: events || [],
        decisions: decisions || [],
        kpiChanges,
      };
    },
  });
}

// Fetch decisions related to a specific KPI
export function useKpiDecisions(kpiId: string | null) {
  return useQuery({
    queryKey: ['kpi-decisions', kpiId],
    queryFn: async () => {
      if (!kpiId) return [];

      // Find timeline events affecting this KPI
      const { data: events, error } = await supabase
        .from('decision_timeline')
        .select('*')
        .contains('affected_kpi_ids', [kpiId])
        .order('event_date', { ascending: false });

      if (error) throw error;
      return events || [];
    },
    enabled: !!kpiId,
  });
}

// Calculate decision effectiveness
export function calculateEffectiveness(
  decision: PolicyDecision,
  kpiChanges: KpiChangePoint[]
): { score: number; analysis: string } {
  const relevantChanges = kpiChanges.filter(
    (change) =>
      decision.target_kpis.includes(change.kpi_id) &&
      new Date(change.period_start) > new Date(decision.decision_date)
  );

  if (relevantChanges.length === 0) {
    return { score: 0, analysis: 'Ingen mätbar effekt ännu' };
  }

  const improvements = relevantChanges.filter(
    (c) => c.trend === 'up' && (c.trend_percent || 0) > 0
  );
  const declines = relevantChanges.filter(
    (c) => c.trend === 'down' && (c.trend_percent || 0) < 0
  );

  const score = (improvements.length / relevantChanges.length) * 100;

  let analysis = '';
  if (score >= 70) {
    analysis = `Positiv utveckling observerad i ${improvements.length} av ${relevantChanges.length} mätpunkter`;
  } else if (score >= 40) {
    analysis = `Blandad utveckling: ${improvements.length} förbättringar, ${declines.length} försämringar`;
  } else {
    analysis = `Begränsad positiv effekt observerad`;
  }

  return { score, analysis };
}
