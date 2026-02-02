/**
 * COVID-19 REALITY LAYER - Database Queries
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  CovidRawDataPoint, 
  CovidMethodChange, 
  CovidExcessMortality,
  CovidPolicyPeriod,
  CovidDataType 
} from '@/types/covid';

export async function fetchCovidRawData(
  countryCode: string,
  dataTypes: CovidDataType[],
  startDate: string,
  endDate: string,
  ageGroup?: string
): Promise<CovidRawDataPoint[]> {
  let query = supabase
    .from('covid_raw_data')
    .select('*')
    .eq('country_code', countryCode)
    .in('data_type', dataTypes)
    .gte('period_date', startDate)
    .lte('period_date', endDate)
    .order('period_date', { ascending: true });

  if (ageGroup) {
    query = query.eq('age_group', ageGroup);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  
  return (data || []).map(row => ({
    id: row.id,
    countryCode: row.country_code,
    regionCode: row.region_code,
    dataType: row.data_type as CovidDataType,
    periodDate: row.period_date,
    value: Number(row.value),
    valuePer100k: row.value_per_100k ? Number(row.value_per_100k) : undefined,
    ageGroup: row.age_group,
    definitionVersion: row.definition_version,
    reporter: row.reporter,
    reportingLagDays: row.reporting_lag_days,
    isPreliminary: row.is_preliminary,
    revisionNumber: row.revision_number,
    confidenceIntervalLower: row.confidence_interval_lower ? Number(row.confidence_interval_lower) : undefined,
    confidenceIntervalUpper: row.confidence_interval_upper ? Number(row.confidence_interval_upper) : undefined,
    dataSourceCode: row.data_source_code,
  }));
}

export async function fetchMethodChanges(
  countryCode: string,
  dataType?: CovidDataType,
  startDate?: string,
  endDate?: string
): Promise<CovidMethodChange[]> {
  let query = supabase
    .from('covid_method_changes')
    .select('*')
    .eq('country_code', countryCode)
    .order('change_date', { ascending: true });

  if (dataType) {
    query = query.eq('data_type', dataType);
  }
  if (startDate) {
    query = query.gte('change_date', startDate);
  }
  if (endDate) {
    query = query.lte('change_date', endDate);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  
  return (data || []).map(row => ({
    id: row.id,
    countryCode: row.country_code,
    dataType: row.data_type as CovidDataType,
    changeDate: row.change_date,
    previousDefinition: row.previous_definition,
    newDefinition: row.new_definition,
    changeType: row.change_type as any,
    impactSeverity: row.impact_severity as any,
    comparabilityNote: row.comparability_note,
    sourceUrl: row.source_url,
  }));
}

export async function fetchExcessMortality(
  countryCode: string,
  startDate: string,
  endDate: string
): Promise<CovidExcessMortality[]> {
  const { data, error } = await supabase
    .from('covid_excess_mortality')
    .select('*')
    .eq('country_code', countryCode)
    .gte('period_start', startDate)
    .lte('period_end', endDate)
    .order('period_start', { ascending: true });

  if (error) throw error;
  
  return (data || []).map(row => ({
    id: row.id,
    countryCode: row.country_code,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    observedDeaths: row.observed_deaths,
    expectedDeaths: Number(row.expected_deaths),
    expectedDeathsLower: row.expected_deaths_lower ? Number(row.expected_deaths_lower) : undefined,
    expectedDeathsUpper: row.expected_deaths_upper ? Number(row.expected_deaths_upper) : undefined,
    excessDeaths: Number(row.excess_deaths),
    excessPercent: row.excess_percent ? Number(row.excess_percent) : undefined,
    ageStandardized: row.age_standardized,
    seasonAdjusted: row.season_adjusted,
    baselinePeriod: row.baseline_period,
    methodology: row.methodology,
    dataSourceCode: row.data_source_code,
  }));
}

export async function fetchPolicyPeriods(
  countryCode: string,
  startDate?: string,
  endDate?: string
): Promise<CovidPolicyPeriod[]> {
  let query = supabase
    .from('covid_policy_periods')
    .select('*')
    .eq('country_code', countryCode)
    .order('start_date', { ascending: true });

  if (startDate) {
    query = query.gte('start_date', startDate);
  }
  if (endDate) {
    query = query.or(`end_date.is.null,end_date.lte.${endDate}`);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  
  return (data || []).map(row => ({
    id: row.id,
    countryCode: row.country_code,
    regionCode: row.region_code,
    policyType: row.policy_type as any,
    startDate: row.start_date,
    endDate: row.end_date,
    stringencyLevel: row.stringency_level,
    description: row.description,
    sourceUrl: row.source_url,
    isVerified: row.is_verified,
  }));
}
