import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataDepthLevel, ComparabilityLevel } from '@/config/globalExpansionConfig';

export interface Country {
  id: string;
  code: string;
  code_alpha3: string;
  name: string;
  name_local: string;
  region: string;
  subregion: string;
  bloc: string | null;
  data_depth: DataDepthLevel;
  data_quality_score: number;
  population: number;
  gdp_per_capita: number;
  has_regional_data: boolean;
  has_municipal_data: boolean;
  has_responsibility_model: boolean;
  has_politician_profiles: boolean;
  has_feeds_enabled: boolean;
  has_simulation: boolean;
  is_active: boolean;
}

export interface GlobalKPIValue {
  id: string;
  country_code: string;
  region_code: string | null;
  kpi_code: string;
  gmi_component: string;
  value: number;
  value_normalized: number | null;
  unit: string;
  period_start: string;
  period_end: string;
  data_quality: DataDepthLevel;
  confidence: number;
  uncertainty_range: number | null;
  is_estimated: boolean;
  data_source_code: string;
  trend: 'up' | 'down' | 'stable' | null;
  trend_percent: number | null;
}

export interface GlobalMasterIndexValue {
  id: string;
  country_code: string;
  gmi_version: string;
  value: number;
  period_start: string;
  period_end: string;
  component_values: Record<string, unknown>;
  data_completeness: number;
  average_confidence: number | null;
  data_gaps: string[] | null;
  previous_value: number | null;
  trend: 'up' | 'down' | 'stable' | null;
  trend_percent: number | null;
  global_rank: number | null;
  regional_rank: number | null;
  bloc_rank: number | null;
  country?: Country;
}
export interface CountryComparability {
  country_a: string;
  country_b: string;
  kpi_code: string | null;
  level: ComparabilityLevel;
  score: number;
  comparability_notes: string;
  limitations: string[];
}

// Fetch all countries
export function useCountries(options?: { 
  bloc?: string; 
  region?: string; 
  dataDepth?: DataDepthLevel;
}) {
  return useQuery({
    queryKey: ['countries', options],
    queryFn: async () => {
      let query = supabase
        .from('countries')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (options?.bloc) {
        query = query.eq('bloc', options.bloc);
      }
      if (options?.region) {
        query = query.eq('region', options.region);
      }
      if (options?.dataDepth) {
        query = query.eq('data_depth', options.dataDepth);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Country[];
    },
  });
}

// Fetch single country
export function useCountry(code: string) {
  return useQuery({
    queryKey: ['country', code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('code', code)
        .single();

      if (error) throw error;
      return data as Country;
    },
    enabled: !!code,
  });
}

// Fetch global KPI values
export function useGlobalKPIValues(options?: {
  countryCode?: string;
  kpiCode?: string;
  component?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['global-kpi-values', options],
    queryFn: async () => {
      let query = supabase
        .from('global_kpi_values')
        .select('*')
        .order('period_start', { ascending: false })
        .limit(options?.limit || 100);

      if (options?.countryCode) {
        query = query.eq('country_code', options.countryCode);
      }
      if (options?.kpiCode) {
        query = query.eq('kpi_code', options.kpiCode);
      }
      if (options?.component) {
        query = query.eq('gmi_component', options.component);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as GlobalKPIValue[];
    },
  });
}

// Fetch Global Master Index values
export function useGlobalMasterIndex(options?: {
  countryCode?: string;
  version?: string;
}) {
  return useQuery({
    queryKey: ['global-master-index', options],
    queryFn: async () => {
      let query = supabase
        .from('global_master_index_values')
        .select('*')
        .order('global_rank', { ascending: true });

      if (options?.countryCode) {
        query = query.eq('country_code', options.countryCode);
      }
      if (options?.version) {
        query = query.eq('gmi_version', options.version);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as GlobalMasterIndexValue[];
    },
  });
}

// Fetch comparability between countries
export function useCountryComparability(countryA: string, countryB: string) {
  return useQuery({
    queryKey: ['country-comparability', countryA, countryB],
    queryFn: async () => {
      // Ensure consistent ordering
      const [a, b] = [countryA, countryB].sort();
      
      const { data, error } = await supabase
        .from('country_comparability')
        .select('*')
        .eq('country_a', a)
        .eq('country_b', b);

      if (error) throw error;
      return data as CountryComparability[];
    },
    enabled: !!countryA && !!countryB,
  });
}

// Fetch GMI ranking
export function useGMIRanking(options?: {
  bloc?: string;
  region?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['gmi-ranking', options],
    queryFn: async () => {
      // First get GMI values
      const { data: gmiData, error: gmiError } = await supabase
        .from('global_master_index_values')
        .select('*')
        .not('global_rank', 'is', null)
        .order('global_rank', { ascending: true })
        .limit(options?.limit || 50);

      if (gmiError) throw gmiError;

      // Get country info
      const countryCodes = gmiData?.map(g => g.country_code) || [];
      
      let countryQuery = supabase
        .from('countries')
        .select('*')
        .in('code', countryCodes);

      if (options?.bloc) {
        countryQuery = countryQuery.eq('bloc', options.bloc);
      }
      if (options?.region) {
        countryQuery = countryQuery.eq('region', options.region);
      }

      const { data: countries, error: countryError } = await countryQuery;
      if (countryError) throw countryError;

      // Combine data
      return gmiData?.map(gmi => ({
        ...gmi,
        country: countries?.find(c => c.code === gmi.country_code),
      })).filter(item => item.country) || [];
    },
  });
}

// Fetch data sources
export function useGlobalDataSources() {
  return useQuery({
    queryKey: ['global-data-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_data_sources')
        .select('*')
        .eq('is_active', true)
        .order('reliability_score', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Summary stats
export function useGlobalStats() {
  return useQuery({
    queryKey: ['global-stats'],
    queryFn: async () => {
      const { data: countries, error } = await supabase
        .from('countries')
        .select('data_depth, bloc, region')
        .eq('is_active', true);

      if (error) throw error;

      const stats = {
        totalCountries: countries?.length || 0,
        byDepth: {
          global_baseline: 0,
          regional_bloc: 0,
          national_deep: 0,
        },
        byBloc: {} as Record<string, number>,
        byRegion: {} as Record<string, number>,
      };

      countries?.forEach(c => {
        stats.byDepth[c.data_depth as DataDepthLevel]++;
        if (c.bloc) {
          stats.byBloc[c.bloc] = (stats.byBloc[c.bloc] || 0) + 1;
        }
        stats.byRegion[c.region] = (stats.byRegion[c.region] || 0) + 1;
      });

      return stats;
    },
  });
}
