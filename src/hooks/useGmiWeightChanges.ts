/**
 * GMI Weight Changes Hook
 * 
 * Fetches and manages weight change history from the database.
 * Factory diagnostic protocol: All changes are immutable and audited.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GmiWeightChange {
  id: string;
  dimension_id: string;
  dimension_name: string;
  previous_weight: number;
  new_weight: number;
  reason: string;
  version: string;
  author: string;
  country_code: string | null;
  created_at: string;
}

export interface NewWeightChange {
  dimension_id: string;
  dimension_name: string;
  previous_weight: number;
  new_weight: number;
  reason: string;
  version: string;
  author?: string;
  country_code?: string;
}

/**
 * Fetch all weight changes from the database
 * Ordered by created_at DESC (most recent first)
 */
export function useGmiWeightChanges(countryCode?: string) {
  return useQuery({
    queryKey: ['gmi-weight-changes', countryCode],
    queryFn: async (): Promise<GmiWeightChange[]> => {
      let query = supabase
        .from('gmi_weight_changes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (countryCode) {
        query = query.eq('country_code', countryCode);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching weight changes:', error);
        throw error;
      }
      
      return (data || []) as GmiWeightChange[];
    },
  });
}

/**
 * Fetch the latest version number
 */
export function useLatestGmiVersion() {
  return useQuery({
    queryKey: ['gmi-latest-version'],
    queryFn: async (): Promise<string> => {
      const { data, error } = await supabase
        .from('gmi_weight_changes')
        .select('version')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching latest version:', error);
        return '2.0.0';
      }
      
      if (data && data.length > 0) {
        return data[0].version;
      }
      
      return '2.0.0';
    },
  });
}

/**
 * Generate next version number (increment patch)
 */
export function incrementVersion(currentVersion: string): string {
  const parts = currentVersion.split('.').map(Number);
  if (parts.length === 3) {
    parts[2] += 1;
    return parts.join('.');
  }
  return currentVersion;
}

/**
 * Insert a new weight change (immutable audit log)
 */
export function useInsertWeightChange() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (changes: NewWeightChange[]) => {
      const { data, error } = await supabase
        .from('gmi_weight_changes')
        .insert(changes.map(change => ({
          dimension_id: change.dimension_id,
          dimension_name: change.dimension_name,
          previous_weight: change.previous_weight,
          new_weight: change.new_weight,
          reason: change.reason,
          version: change.version,
          author: change.author || 'methodology_board',
          country_code: change.country_code || null,
        })))
        .select();
      
      if (error) {
        console.error('Error inserting weight changes:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gmi-weight-changes'] });
      queryClient.invalidateQueries({ queryKey: ['gmi-latest-version'] });
    },
  });
}

/**
 * Get current weights by aggregating changes
 * Starting from default weights and applying all changes
 */
export function useCurrentGmiWeights(defaultWeights: Record<string, number>) {
  const { data: changes, isLoading, error } = useGmiWeightChanges();
  
  if (isLoading || !changes) {
    return { weights: defaultWeights, isLoading, error };
  }
  
  // Start with defaults
  const currentWeights = { ...defaultWeights };
  
  // Apply changes in chronological order (oldest first)
  const sortedChanges = [...changes].reverse();
  for (const change of sortedChanges) {
    if (change.dimension_id in currentWeights) {
      currentWeights[change.dimension_id] = change.new_weight;
    }
  }
  
  return { weights: currentWeights, isLoading, error };
}
