import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DecisionOutcome {
  id: string;
  decision_id: string;
  kpi_id: string;
  measurement_date: string;
  baseline_value: number | null;
  baseline_date: string | null;
  current_value: number;
  change_absolute: number | null;
  change_percent: number | null;
  target_value: number | null;
  target_achieved: boolean;
  confidence_level: number;
  attribution_score: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  kpi_name?: string;
  kpi_code?: string;
  kpi_unit?: string;
}

export interface DecisionMilestone {
  id: string;
  decision_id: string;
  title: string;
  description: string | null;
  target_date: string;
  completed_date: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  responsible_entity: string | null;
  created_at: string;
  updated_at: string;
}

type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';

const isValidMilestoneStatus = (status: string): status is MilestoneStatus => {
  return ['pending', 'in_progress', 'completed', 'delayed', 'cancelled'].includes(status);
};

export interface DecisionEffectiveness {
  total_kpis: number;
  improved_kpis: number;
  declined_kpis: number;
  unchanged_kpis: number;
  avg_change_percent: number;
  overall_score: number;
}

// Fetch outcomes for a specific decision
export function useDecisionOutcomes(decisionId: string | null) {
  return useQuery({
    queryKey: ['decision-outcomes', decisionId],
    queryFn: async (): Promise<DecisionOutcome[]> => {
      if (!decisionId) return [];

      const { data, error } = await supabase
        .from('decision_outcomes')
        .select(`
          *,
          kpi_definitions:kpi_id (name, code, unit)
        `)
        .eq('decision_id', decisionId)
        .order('measurement_date', { ascending: false });

      if (error) throw error;

      return (data || []).map((item: any) => ({
        ...item,
        kpi_name: item.kpi_definitions?.name,
        kpi_code: item.kpi_definitions?.code,
        kpi_unit: item.kpi_definitions?.unit,
      }));
    },
    enabled: !!decisionId,
  });
}

// Fetch milestones for a specific decision
export function useDecisionMilestones(decisionId: string | null) {
  return useQuery({
    queryKey: ['decision-milestones', decisionId],
    queryFn: async (): Promise<DecisionMilestone[]> => {
      if (!decisionId) return [];

      const { data, error } = await supabase
        .from('decision_milestones')
        .select('*')
        .eq('decision_id', decisionId)
        .order('target_date', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        status: isValidMilestoneStatus(item.status) ? item.status : 'pending',
      }));
    },
    enabled: !!decisionId,
  });
}

// Fetch effectiveness calculation
export function useDecisionEffectiveness(decisionId: string | null) {
  return useQuery({
    queryKey: ['decision-effectiveness', decisionId],
    queryFn: async (): Promise<DecisionEffectiveness | null> => {
      if (!decisionId) return null;

      const { data, error } = await supabase
        .rpc('calculate_decision_effectiveness', { p_decision_id: decisionId });

      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!decisionId,
  });
}

// Add outcome mutation
export function useAddDecisionOutcome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (outcome: Omit<DecisionOutcome, 'id' | 'created_at' | 'updated_at' | 'kpi_name' | 'kpi_code' | 'kpi_unit'>) => {
      const { data, error } = await supabase
        .from('decision_outcomes')
        .insert(outcome)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['decision-outcomes', variables.decision_id] });
      queryClient.invalidateQueries({ queryKey: ['decision-effectiveness', variables.decision_id] });
      queryClient.invalidateQueries({ queryKey: ['policy_decisions'] });
    },
  });
}

// Update milestone mutation
export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DecisionMilestone> & { id: string }) => {
      const { data, error } = await supabase
        .from('decision_milestones')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['decision-milestones', data.decision_id] });
    },
  });
}

// Add milestone mutation
export function useAddMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (milestone: Omit<DecisionMilestone, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('decision_milestones')
        .insert(milestone)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['decision-milestones', variables.decision_id] });
    },
  });
}

// Fetch all decisions with outcomes summary
export function useDecisionsWithOutcomes() {
  return useQuery({
    queryKey: ['decisions-with-outcomes'],
    queryFn: async () => {
      const { data: decisions, error } = await supabase
        .from('policy_decisions')
        .select('*')
        .order('decision_date', { ascending: false });

      if (error) throw error;

      // Get milestone counts for each decision
      const { data: milestones } = await supabase
        .from('decision_milestones')
        .select('decision_id, status');

      const milestonesByDecision = (milestones || []).reduce((acc: Record<string, { total: number; completed: number }>, m) => {
        if (!acc[m.decision_id]) {
          acc[m.decision_id] = { total: 0, completed: 0 };
        }
        acc[m.decision_id].total++;
        if (m.status === 'completed') {
          acc[m.decision_id].completed++;
        }
        return acc;
      }, {});

      return (decisions || []).map(d => ({
        ...d,
        target_kpis: d.target_kpis || [],
        milestones: milestonesByDecision[d.id] || { total: 0, completed: 0 },
      }));
    },
  });
}
