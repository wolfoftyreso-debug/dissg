/**
 * RELEVANS-ENGINE HOOK
 * ═══════════════════════════════════════════════════════════════
 * 
 * Hook för att interagera med relevansmotorn.
 * Hämtar beräknade scores, snapshots och användarpreferenser.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RelevanceScore {
  id: string;
  object_type: string;
  object_id: string;
  object_code: string;
  total_score: number;
  rank: number;
  impact_raw: number;
  acceleration_raw: number;
  breadth_raw: number;
  persistence_raw: number;
  responsibility_raw: number;
  data_confidence_raw: number;
  impact_weighted: number;
  acceleration_weighted: number;
  breadth_weighted: number;
  persistence_weighted: number;
  responsibility_weighted: number;
  data_confidence_contribution: number;
  primary_reason: string;
  secondary_reasons: string[];
  should_highlight: boolean;
  calculation_details: Record<string, unknown>;
  calculated_at: string;
  weight_version_id: string;
}

interface WeightVersion {
  id: string;
  version: number;
  name: string;
  description: string | null;
  impact_weight: number;
  acceleration_weight: number;
  breadth_weight: number;
  persistence_weight: number;
  responsibility_weight: number;
  data_confidence_weight: number;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
  change_reason: string | null;
}

interface UserPreferences {
  id: string;
  user_id: string;
  preferred_regions: string[] | null;
  preferred_demographics: string[] | null;
  preferred_responsibility_areas: string[] | null;
  boost_local: boolean;
  boost_factor: number;
}

interface DailySnapshot {
  id: string;
  snapshot_date: string;
  top_relevant: Array<{ id: string; code: string; score: number; reason: string }>;
  top_improvements: Array<{ id: string; code: string; change: number; name: string }>;
  top_declines: Array<{ id: string; code: string; change: number; name: string }>;
  full_ranking: Array<{ id: string; score: number; rank: number }>;
  weight_version_id: string;
  total_objects_scored: number;
  calculation_duration_ms: number;
  created_at: string;
}

/**
 * Hämta alla relevans-scores
 */
export function useRelevanceScores(objectType: string = 'kpi', limit: number = 20) {
  return useQuery({
    queryKey: ['relevance-scores', objectType, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('relevance_scores')
        .select('*')
        .eq('object_type', objectType)
        .order('total_score', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as RelevanceScore[];
    },
  });
}

/**
 * Hämta relevans-score för ett specifikt objekt
 */
export function useObjectRelevance(objectId: string | undefined) {
  return useQuery({
    queryKey: ['relevance-score', objectId],
    queryFn: async () => {
      if (!objectId) return null;
      
      const { data, error } = await supabase
        .from('relevance_scores')
        .select('*')
        .eq('object_id', objectId)
        .maybeSingle();
      
      if (error) throw error;
      return data as RelevanceScore | null;
    },
    enabled: !!objectId,
  });
}

/**
 * Hämta aktiva vikter
 */
export function useActiveWeights() {
  return useQuery({
    queryKey: ['relevance-weights-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('relevance_weight_versions')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data as WeightVersion;
    },
  });
}

/**
 * Hämta alla viktversioner
 */
export function useWeightVersions() {
  return useQuery({
    queryKey: ['relevance-weight-versions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('relevance_weight_versions')
        .select('*')
        .order('version', { ascending: false });
      
      if (error) throw error;
      return data as WeightVersion[];
    },
  });
}

/**
 * Hämta dagens snapshot
 */
export function useTodaysSnapshot() {
  return useQuery({
    queryKey: ['daily-snapshot-today'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_priority_snapshots')
        .select('*')
        .eq('snapshot_date', today)
        .maybeSingle();
      
      if (error) throw error;
      return data as DailySnapshot | null;
    },
  });
}

/**
 * Hämta historiska snapshots
 */
export function useHistoricalSnapshots(days: number = 30) {
  return useQuery({
    queryKey: ['daily-snapshots-historical', days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('daily_priority_snapshots')
        .select('*')
        .gte('snapshot_date', startDate.toISOString().split('T')[0])
        .order('snapshot_date', { ascending: false });
      
      if (error) throw error;
      return data as DailySnapshot[];
    },
  });
}

/**
 * Hämta användarpreferenser
 */
export function useUserRelevancePreferences() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-relevance-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_relevance_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as UserPreferences | null;
    },
    enabled: !!user?.id,
  });
}

/**
 * Uppdatera användarpreferenser
 */
export function useUpdateUserPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (preferences: Partial<Omit<UserPreferences, 'id' | 'user_id'>>) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('user_relevance_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
        }, { onConflict: 'user_id' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-relevance-preferences'] });
      toast.success('Preferenser sparade');
    },
    onError: (error) => {
      toast.error(`Kunde inte spara preferenser: ${error.message}`);
    },
  });
}

/**
 * Trigger relevansberäkning
 */
export function useCalculateRelevance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke('calculate-relevance');
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['relevance-scores'] });
      queryClient.invalidateQueries({ queryKey: ['daily-snapshot-today'] });
      toast.success(`Beräknade relevans för ${data?.summary?.totalScored ?? 0} indikatorer`);
    },
    onError: (error) => {
      toast.error(`Kunde inte beräkna relevans: ${error.message}`);
    },
  });
}

/**
 * Applicera användarpreferenser på scores
 */
export function applyUserBoost(
  scores: RelevanceScore[],
  preferences: UserPreferences | null
): RelevanceScore[] {
  if (!preferences || !preferences.boost_local) {
    return scores;
  }
  
  // Här kan vi implementera boost-logik baserat på användarens preferenser
  // För nu returnerar vi bara scores oförändrade
  return scores;
}
