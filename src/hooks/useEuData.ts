/**
 * Hook för att hämta EU-data från backend
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { NutsLevel } from '@/config/euConfig';

export interface EuKpiDefinition {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  eurostat_indicator_code: string | null;
  unit: string;
  is_inverted: boolean;
  gmi_component: string | null;
  comparability_score: number;
  min_nuts_level: number;
  max_nuts_level: number;
}

export interface NutsRegion {
  id: string;
  code: string;
  name: string;
  name_local: string | null;
  country_code: string;
  nuts_level: number;
  parent_code: string | null;
  population: number | null;
}

export interface EuKpiValue {
  id: string;
  kpi_id: string;
  nuts_code: string;
  country_code: string;
  period_start: string;
  period_end: string;
  value: number;
  value_normalized: number | null;
  trend: string | null;
  trend_percent: number | null;
  confidence: number;
  is_estimated: boolean;
}

export interface EuCluster {
  id: string;
  code: string;
  name: string;
  description: string | null;
  cluster_type: string;
  member_count: number | null;
  centroid_values: Record<string, number>;
}

export interface EuCorrelation {
  id: string;
  kpi_a_id: string;
  kpi_b_id: string;
  correlation_coefficient: number;
  time_lag_months: number;
  stability_score: number | null;
  is_significant: boolean;
  interpretation: string | null;
}

// Hämta EU-länder
export function useEuCountries() {
  return useQuery({
    queryKey: ['eu-countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('bloc', 'EU')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
}

// Hämta NUTS-regioner
export function useNutsRegions(countryCode?: string, nutsLevel?: NutsLevel) {
  return useQuery({
    queryKey: ['nuts-regions', countryCode, nutsLevel],
    queryFn: async () => {
      let query = supabase
        .from('nuts_regions')
        .select('*')
        .eq('is_active', true);
      
      if (countryCode) {
        query = query.eq('country_code', countryCode);
      }
      
      if (nutsLevel !== undefined) {
        query = query.eq('nuts_level', nutsLevel);
      }
      
      const { data, error } = await query.order('code');
      
      if (error) throw error;
      return data as NutsRegion[];
    },
  });
}

// Hämta EU KPI-definitioner
export function useEuKpiDefinitions(category?: string) {
  return useQuery({
    queryKey: ['eu-kpi-definitions', category],
    queryFn: async () => {
      let query = supabase
        .from('eu_kpi_definitions')
        .select('*')
        .eq('is_active', true);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('gmi_weight', { ascending: false });
      
      if (error) throw error;
      return data as EuKpiDefinition[];
    },
  });
}

// Hämta EU KPI-värden
export function useEuKpiValues(kpiCode?: string, nutsCode?: string, nutsLevel?: NutsLevel) {
  return useQuery({
    queryKey: ['eu-kpi-values', kpiCode, nutsCode, nutsLevel],
    queryFn: async () => {
      let query = supabase
        .from('eu_kpi_values')
        .select(`
          *,
          eu_kpi_definitions!inner(code, name, category, unit, is_inverted)
        `)
        .order('period_start', { ascending: false });
      
      if (kpiCode) {
        query = query.eq('eu_kpi_definitions.code', kpiCode);
      }
      
      if (nutsCode) {
        query = query.eq('nuts_code', nutsCode);
      }
      
      if (nutsLevel !== undefined) {
        // Filter by NUTS level (based on code length)
        const nutsCodeLength = 2 + nutsLevel;
        query = query.like('nuts_code', `${'_'.repeat(nutsCodeLength)}`);
      }
      
      const { data, error } = await query.limit(500);
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(kpiCode || nutsCode),
  });
}

// Hämta EU-kluster
export function useEuClusters(clusterType?: string) {
  return useQuery({
    queryKey: ['eu-clusters', clusterType],
    queryFn: async () => {
      let query = supabase
        .from('eu_clusters')
        .select('*')
        .eq('is_active', true);
      
      if (clusterType) {
        query = query.eq('cluster_type', clusterType);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as EuCluster[];
    },
  });
}

// Hämta klustermedlemmar
export function useEuClusterMembers(clusterId?: string) {
  return useQuery({
    queryKey: ['eu-cluster-members', clusterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eu_cluster_members')
        .select(`
          *,
          eu_clusters(name, cluster_type)
        `)
        .eq('cluster_id', clusterId!)
        .order('membership_score', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(clusterId),
  });
}

// Hämta EU-korrelationer
export function useEuCorrelations(kpiId?: string, nutsLevel?: NutsLevel) {
  return useQuery({
    queryKey: ['eu-correlations', kpiId, nutsLevel],
    queryFn: async () => {
      let query = supabase
        .from('eu_correlations')
        .select(`
          *,
          kpi_a:eu_kpi_definitions!kpi_a_id(code, name, category),
          kpi_b:eu_kpi_definitions!kpi_b_id(code, name, category)
        `)
        .eq('is_significant', true)
        .order('correlation_coefficient', { ascending: false });
      
      if (kpiId) {
        query = query.or(`kpi_a_id.eq.${kpiId},kpi_b_id.eq.${kpiId}`);
      }
      
      if (nutsLevel !== undefined) {
        query = query.eq('nuts_level', nutsLevel);
      }
      
      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      return data;
    },
  });
}

// Hämta EU-datakällor
export function useEuDataSources() {
  return useQuery({
    queryKey: ['eu-data-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eu_data_sources')
        .select('*')
        .eq('is_active', true)
        .order('reliability_score', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// Hämta EU-feeds
export function useEuFeeds(tier?: 'open' | 'plus' | 'pro') {
  return useQuery({
    queryKey: ['eu-feeds', tier],
    queryFn: async () => {
      let query = supabase
        .from('eu_feed_definitions')
        .select('*')
        .eq('is_active', true);
      
      if (tier) {
        query = query.eq('tier', tier);
      }
      
      const { data, error } = await query.order('category');
      
      if (error) throw error;
      return data;
    },
  });
}
