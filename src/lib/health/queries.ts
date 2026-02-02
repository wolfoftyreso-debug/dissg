/**
 * Health & Substance Data Queries
 * All data is aggregated, population-level only
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  HealthIndicator,
  HealthValue,
  SubstanceProfile,
  SubstanceData,
  SubstanceLegalStatus,
  DiseaseBurden,
  HealthcareCapacity,
  LifeExpectancy,
  HealthPolicyPeriod
} from '@/types/health';

// ===== HEALTH INDICATORS =====

export async function getHealthIndicators(category?: string) {
  let query = supabase
    .from('health_indicators')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('name');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as HealthIndicator[];
}

export async function getHealthValues(
  indicatorId: string,
  countryCode?: string,
  startYear?: number,
  endYear?: number
) {
  let query = supabase
    .from('health_values')
    .select('*')
    .eq('indicator_id', indicatorId)
    .order('period_start', { ascending: false });
  
  if (countryCode) {
    query = query.eq('country_code', countryCode);
  }
  
  if (startYear) {
    query = query.gte('period_start', `${startYear}-01-01`);
  }
  
  if (endYear) {
    query = query.lte('period_end', `${endYear}-12-31`);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as HealthValue[];
}

// ===== DISEASE BURDEN =====

export async function getDiseaseBurden(
  countryCode: string,
  year?: number,
  causeLevel?: number
) {
  let query = supabase
    .from('disease_burden')
    .select('*')
    .eq('country_code', countryCode)
    .order('dalys_per_100k', { ascending: false, nullsFirst: false });
  
  if (year) {
    query = query.eq('period_year', year);
  }
  
  if (causeLevel) {
    query = query.eq('cause_level', causeLevel);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as DiseaseBurden[];
}

export async function getTopDiseaseCauses(
  countryCode: string,
  year: number,
  limit: number = 10
) {
  const { data, error } = await supabase
    .from('disease_burden')
    .select('*')
    .eq('country_code', countryCode)
    .eq('period_year', year)
    .eq('cause_level', 2) // Level 2 = main categories
    .eq('age_group', 'all')
    .eq('sex', 'both')
    .order('dalys_per_100k', { ascending: false, nullsFirst: false })
    .limit(limit);
  
  if (error) throw error;
  return data as DiseaseBurden[];
}

// ===== LIFE EXPECTANCY =====

export async function getLifeExpectancy(
  countryCode: string,
  startYear?: number,
  endYear?: number
) {
  let query = supabase
    .from('life_expectancy')
    .select('*')
    .eq('country_code', countryCode)
    .order('period_year', { ascending: false });
  
  if (startYear) {
    query = query.gte('period_year', startYear);
  }
  
  if (endYear) {
    query = query.lte('period_year', endYear);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as LifeExpectancy[];
}

export async function getLifeExpectancyComparison(
  countryCodes: string[],
  year: number
) {
  const { data, error } = await supabase
    .from('life_expectancy')
    .select('*')
    .in('country_code', countryCodes)
    .eq('period_year', year)
    .order('life_expectancy_total', { ascending: false });
  
  if (error) throw error;
  return data as LifeExpectancy[];
}

// ===== HEALTHCARE CAPACITY =====

export async function getHealthcareCapacity(
  countryCode: string,
  year?: number
) {
  let query = supabase
    .from('healthcare_capacity')
    .select('*')
    .eq('country_code', countryCode)
    .order('period_year', { ascending: false });
  
  if (year) {
    query = query.eq('period_year', year);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as HealthcareCapacity[];
}

// ===== SUBSTANCE DATA =====

export async function getSubstanceProfiles(chemicalClass?: string) {
  let query = supabase
    .from('substance_profiles')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (chemicalClass) {
    query = query.eq('chemical_class', chemicalClass);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as SubstanceProfile[];
}

export async function getSubstanceData(
  substanceId: string,
  countryCode?: string,
  measureType?: string
) {
  let query = supabase
    .from('substance_data')
    .select('*')
    .eq('substance_id', substanceId)
    .order('period_start', { ascending: false });
  
  if (countryCode) {
    query = query.eq('country_code', countryCode);
  }
  
  if (measureType) {
    query = query.eq('measure_type', measureType);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as SubstanceData[];
}

export async function getSubstanceLegalHistory(
  substanceId: string,
  countryCode: string
) {
  const { data, error } = await supabase
    .from('substance_legal_status')
    .select('*')
    .eq('substance_id', substanceId)
    .eq('country_code', countryCode)
    .order('effective_from', { ascending: true });
  
  if (error) throw error;
  return data as SubstanceLegalStatus[];
}

// ===== POLICY PERIODS =====

export async function getHealthPolicyPeriods(
  countryCode: string,
  category?: string
) {
  let query = supabase
    .from('health_policy_periods')
    .select('*')
    .eq('country_code', countryCode)
    .eq('is_active', true)
    .order('start_date', { ascending: true });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as HealthPolicyPeriod[];
}

// ===== AGGREGATED QUERIES =====

export async function getHealthOverview(countryCode: string, year: number) {
  const [lifeExp, capacity, topCauses] = await Promise.all([
    getLifeExpectancy(countryCode, year, year),
    getHealthcareCapacity(countryCode, year),
    getTopDiseaseCauses(countryCode, year, 5)
  ]);
  
  return {
    life_expectancy: lifeExp[0] || null,
    healthcare_capacity: capacity[0] || null,
    top_disease_causes: topCauses
  };
}

export async function getSubstanceOverview(
  substanceCode: string,
  countryCode: string
) {
  // First get the substance profile
  const { data: profile, error: profileError } = await supabase
    .from('substance_profiles')
    .select('*')
    .eq('code', substanceCode)
    .single();
  
  if (profileError) throw profileError;
  if (!profile) return null;
  
  const [prevalenceData, mortalityData, legalHistory, policies] = await Promise.all([
    getSubstanceData(profile.id, countryCode, 'prevalence'),
    getSubstanceData(profile.id, countryCode, 'mortality'),
    getSubstanceLegalHistory(profile.id, countryCode),
    supabase
      .from('health_policy_periods')
      .select('*')
      .eq('country_code', countryCode)
      .contains('affected_substances', [substanceCode])
      .order('start_date')
  ]);
  
  return {
    profile: profile as SubstanceProfile,
    latest_prevalence: prevalenceData[0] || null,
    latest_mortality: mortalityData[0] || null,
    legal_history: legalHistory,
    current_legal_status: legalHistory.find(s => !s.effective_to) || null,
    policy_periods: policies.data || []
  };
}
