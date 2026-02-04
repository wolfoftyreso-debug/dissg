/**
 * Regional Demographics Hook
 * 
 * Hämtar demografisk data från databasen:
 * - Befolkningspyramid (ålder/kön)
 * - Befolkningshistorik
 * - Livslängdshistorik
 * - Landsdata per region
 * 
 * INGEN MOCK-DATA - allt kommer från databasen
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface RegionalDemographic {
  id: string;
  region_code: string;
  region_name: string;
  age_group: string;
  male_percent: number;
  female_percent: number;
  year: number;
  data_source: string;
}

export interface PopulationHistory {
  id: string;
  region_code: string;
  region_name: string;
  year: number;
  population_millions: number;
  growth_rate_percent: number | null;
  median_age: number | null;
  data_source: string;
}

export interface LifeExpectancyHistory {
  id: string;
  region_code: string;
  region_name: string;
  year: number;
  life_expectancy_overall: number;
  life_expectancy_male: number | null;
  life_expectancy_female: number | null;
  healthy_life_years: number | null;
  data_source: string;
}

export interface RegionalCountryData {
  id: string;
  region_code: string;
  country_code: string;
  country_name: string;
  population_millions: number;
  hdi: number | null;
  life_expectancy: number | null;
  gdp_per_capita: number | null;
  year: number;
  data_source: string;
}

// Region code mapping from region names
const REGION_CODE_MAP: Record<string, string> = {
  'mellanöstern & nordafrika': 'mena',
  'mellanöstern': 'mena',
  'nordafrika': 'mena',
  'mena': 'mena',
  'subsahariska afrika': 'ssa',
  'sahel': 'ssa',
  'afrika': 'ssa',
  'ssa': 'ssa',
  'europa': 'eu',
  'eu': 'eu',
  'asien-stillahavsområdet': 'apac',
  'asien': 'apac',
  'apac': 'apac',
  'amerika': 'americas',
  'americas': 'americas',
  'nordamerika': 'americas',
  'sydamerika': 'americas',
};

export function getRegionCode(regionName: string): string {
  const normalized = regionName.toLowerCase().trim();
  return REGION_CODE_MAP[normalized] || normalized;
}

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Fetch population pyramid (age/gender distribution) for a region
 */
export function useRegionalDemographics(regionName: string, year: number = 2024) {
  const regionCode = getRegionCode(regionName);
  
  return useQuery({
    queryKey: ['regional-demographics', regionCode, year],
    queryFn: async (): Promise<RegionalDemographic[]> => {
      const { data, error } = await supabase
        .from('regional_demographics')
        .select('*')
        .eq('region_code', regionCode)
        .eq('year', year)
        .order('age_group');
      
      if (error) {
        console.error('Error fetching regional demographics:', error);
        throw error;
      }
      
      return (data || []) as RegionalDemographic[];
    },
    enabled: !!regionCode,
  });
}

/**
 * Fetch population history for a region
 */
export function usePopulationHistory(regionName: string) {
  const regionCode = getRegionCode(regionName);
  
  return useQuery({
    queryKey: ['population-history', regionCode],
    queryFn: async (): Promise<PopulationHistory[]> => {
      const { data, error } = await supabase
        .from('regional_population_history')
        .select('*')
        .eq('region_code', regionCode)
        .order('year', { ascending: true });
      
      if (error) {
        console.error('Error fetching population history:', error);
        throw error;
      }
      
      return (data || []) as PopulationHistory[];
    },
    enabled: !!regionCode,
  });
}

/**
 * Fetch life expectancy history for a region
 */
export function useLifeExpectancyHistory(regionName: string) {
  const regionCode = getRegionCode(regionName);
  
  return useQuery({
    queryKey: ['life-expectancy-history', regionCode],
    queryFn: async (): Promise<LifeExpectancyHistory[]> => {
      const { data, error } = await supabase
        .from('regional_life_expectancy')
        .select('*')
        .eq('region_code', regionCode)
        .order('year', { ascending: true });
      
      if (error) {
        console.error('Error fetching life expectancy history:', error);
        throw error;
      }
      
      return (data || []) as LifeExpectancyHistory[];
    },
    enabled: !!regionCode,
  });
}

/**
 * Fetch country data for a region
 */
export function useRegionalCountries(regionName: string, year: number = 2024) {
  const regionCode = getRegionCode(regionName);
  
  return useQuery({
    queryKey: ['regional-countries', regionCode, year],
    queryFn: async (): Promise<RegionalCountryData[]> => {
      const { data, error } = await supabase
        .from('regional_country_data')
        .select('*')
        .eq('region_code', regionCode)
        .eq('year', year)
        .order('population_millions', { ascending: false });
      
      if (error) {
        console.error('Error fetching regional countries:', error);
        throw error;
      }
      
      return (data || []) as RegionalCountryData[];
    },
    enabled: !!regionCode,
  });
}

/**
 * Fetch latest stats for a region (current year data)
 */
export function useRegionalStats(regionName: string) {
  const regionCode = getRegionCode(regionName);
  
  return useQuery({
    queryKey: ['regional-stats', regionCode],
    queryFn: async () => {
      // Get latest population data
      const { data: popData, error: popError } = await supabase
        .from('regional_population_history')
        .select('*')
        .eq('region_code', regionCode)
        .order('year', { ascending: false })
        .limit(1);
      
      if (popError) throw popError;
      
      // Get latest life expectancy
      const { data: lifeData, error: lifeError } = await supabase
        .from('regional_life_expectancy')
        .select('*')
        .eq('region_code', regionCode)
        .order('year', { ascending: false })
        .limit(1);
      
      if (lifeError) throw lifeError;
      
      // Get country count
      const { data: countryData, error: countryError } = await supabase
        .from('regional_country_data')
        .select('country_code')
        .eq('region_code', regionCode)
        .order('year', { ascending: false });
      
      if (countryError) throw countryError;
      
      const latestPop = popData?.[0] as PopulationHistory | undefined;
      const latestLife = lifeData?.[0] as LifeExpectancyHistory | undefined;
      const uniqueCountries = new Set(countryData?.map(c => c.country_code)).size;
      
      return {
        population: latestPop?.population_millions || 0,
        growthRate: latestPop?.growth_rate_percent || 0,
        medianAge: latestPop?.median_age || 0,
        lifeExpectancy: latestLife?.life_expectancy_overall || 0,
        lifeExpectancyMale: latestLife?.life_expectancy_male || 0,
        lifeExpectancyFemale: latestLife?.life_expectancy_female || 0,
        healthyLifeYears: latestLife?.healthy_life_years || 0,
        countryCount: uniqueCountries,
        dataYear: latestPop?.year || 2024,
      };
    },
    enabled: !!regionCode,
  });
}

/**
 * Fetch life expectancy comparison across regions
 */
export function useLifeExpectancyComparison(year: number = 2024) {
  return useQuery({
    queryKey: ['life-expectancy-comparison', year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regional_life_expectancy')
        .select('region_code, region_name, life_expectancy_overall')
        .eq('year', year)
        .order('life_expectancy_overall', { ascending: false });
      
      if (error) {
        console.error('Error fetching life expectancy comparison:', error);
        throw error;
      }
      
      // Calculate global average
      const values = data?.map(d => d.life_expectancy_overall) || [];
      const globalAvg = values.length > 0 
        ? values.reduce((a, b) => a + b, 0) / values.length 
        : 73.4;
      
      return {
        regions: data || [],
        globalAverage: globalAvg,
      };
    },
  });
}
