import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
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
  responsible_department: string | null;
  responsible_minister: string | null;
  budget_sek: number | null;
  implementation_start: string | null;
  implementation_end: string | null;
  category: string | null;
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

// Fetch complete timeline data with realtime subscription
export function useDecisionTimeline(fromDate?: string, toDate?: string) {
  const queryClient = useQueryClient();
  const queryKey = ['decision-timeline', fromDate, toDate];

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('decision-timeline-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'policy_decisions',
        },
        () => {
          // Invalidate query on any change
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'decision_timeline',
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, fromDate, toDate]);

  return useQuery({
    queryKey,
    queryFn: async (): Promise<TimelineData> => {
      const dateFilter = {
        from: fromDate || '2010-01-01',
        to: toDate || new Date().toISOString().split('T')[0],
      };

      // Fetch all data in parallel
      const [eventsResult, decisionsResult, kpiResult] = await Promise.all([
        // Fetch timeline events
        supabase
          .from('decision_timeline')
          .select('*')
          .gte('event_date', dateFilter.from)
          .lte('event_date', dateFilter.to)
          .order('event_date', { ascending: false }),

        // Fetch policy decisions with all fields
        supabase
          .from('policy_decisions')
          .select('*')
          .gte('decision_date', dateFilter.from)
          .lte('decision_date', dateFilter.to)
          .order('decision_date', { ascending: false }),

        // Fetch KPI values with significant changes
        supabase
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
          .order('period_start', { ascending: false }),
      ]);

      if (eventsResult.error) throw eventsResult.error;
      if (decisionsResult.error) throw decisionsResult.error;
      if (kpiResult.error) throw kpiResult.error;

      // Transform KPI values - only significant changes (>2%)
      const kpiChanges: KpiChangePoint[] = (kpiResult.data || [])
        .filter((v: any) => Math.abs(v.trend_percent || 0) > 2)
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
        events: eventsResult.data || [],
        decisions: decisionsResult.data || [],
        kpiChanges,
      };
    },
    staleTime: 1000 * 60, // Consider fresh for 1 minute
    refetchOnWindowFocus: true,
  });
}

// Fetch decisions related to a specific KPI
export function useKpiDecisions(kpiId: string | null) {
  return useQuery({
    queryKey: ['kpi-decisions', kpiId],
    queryFn: async () => {
      if (!kpiId) return [];

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

// Fetch single decision with milestones and outcomes
export function useDecisionDetail(decisionId: string | null) {
  return useQuery({
    queryKey: ['decision-detail', decisionId],
    queryFn: async () => {
      if (!decisionId) return null;

      const [decisionResult, milestonesResult, outcomesResult] = await Promise.all([
        supabase
          .from('policy_decisions')
          .select('*')
          .eq('id', decisionId)
          .single(),
        supabase
          .from('decision_milestones')
          .select('*')
          .eq('decision_id', decisionId)
          .order('target_date', { ascending: true }),
        supabase
          .from('decision_outcomes')
          .select('*, kpi_definitions(name, code)')
          .eq('decision_id', decisionId)
          .order('measurement_date', { ascending: false }),
      ]);

      if (decisionResult.error) throw decisionResult.error;

      return {
        decision: decisionResult.data,
        milestones: milestonesResult.data || [],
        outcomes: outcomesResult.data || [],
      };
    },
    enabled: !!decisionId,
  });
}

// Calculate decision effectiveness
export function calculateEffectiveness(
  decision: PolicyDecision,
  kpiChanges: KpiChangePoint[]
): { score: number; analysis: string } {
  const targetKpis = decision.target_kpis || [];
  
  const relevantChanges = kpiChanges.filter(
    (change) =>
      targetKpis.includes(change.kpi_id) &&
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
    analysis = `Positiv utveckling i ${improvements.length} av ${relevantChanges.length} mätpunkter`;
  } else if (score >= 40) {
    analysis = `Blandad utveckling: ${improvements.length} förbättringar, ${declines.length} försämringar`;
  } else {
    analysis = `Begränsad positiv effekt observerad`;
  }

  return { score, analysis };
}
