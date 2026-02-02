/**
 * CORRELATION LAYER - Database Queries
 */

import { supabase } from '@/integrations/supabase/client';
import type { CorrelationDomain, DomainVariable } from '@/types/correlation';

/**
 * Fetch available variables for correlation analysis
 */
export async function fetchCorrelationVariables(
  domains?: CorrelationDomain[]
): Promise<DomainVariable[]> {
  // Map domains to KPI categories
  const categoryMap: Record<CorrelationDomain, string[]> = {
    health_outcomes: ['demografi_halsa'],
    policy_actions: ['systemrisk_styrning'],
    macro_economy: ['ekonomisk_barkraft', 'arbete_produktivitet'],
    sector_economics: ['infrastruktur'],
  };

  const categories = domains 
    ? domains.flatMap(d => categoryMap[d] || [])
    : Object.values(categoryMap).flat();

  const { data, error } = await supabase
    .from('kpi_definitions')
    .select('id, code, name, description, unit, category')
    .in('category', categories as readonly ("arbete_produktivitet" | "demografi_halsa" | "ekonomisk_barkraft" | "infrastruktur" | "karnsystem_funktion" | "social_stabilitet" | "systemrisk_styrning")[])
    .eq('is_active', true);

  if (error) throw error;

  return (data || []).map(kpi => ({
    id: kpi.id,
    domain: mapCategoryToDomain(kpi.category),
    code: kpi.code,
    name: kpi.name,
    description: kpi.description || '',
    unit: kpi.unit || '',
    dataSourceCode: 'scb',
    isInverted: false,
    granularity: 'monthly' as const,
  }));
}

function mapCategoryToDomain(category: string): CorrelationDomain {
  const mapping: Record<string, CorrelationDomain> = {
    demografi_halsa: 'health_outcomes',
    systemrisk_styrning: 'policy_actions',
    ekonomisk_barkraft: 'macro_economy',
    arbete_produktivitet: 'macro_economy',
    infrastruktur: 'sector_economics',
  };
  return mapping[category] || 'macro_economy';
}

/**
 * Fetch time series data for a variable
 */
export async function fetchTimeSeries(
  kpiId: string,
  startDate: string,
  endDate: string
): Promise<{ date: string; value: number }[]> {
  const { data, error } = await supabase
    .from('kpi_values')
    .select('period_start, value')
    .eq('kpi_id', kpiId)
    .gte('period_start', startDate)
    .lte('period_start', endDate)
    .order('period_start', { ascending: true });

  if (error) throw error;

  return (data || []).map(row => ({
    date: row.period_start,
    value: Number(row.value),
  }));
}

/**
 * Store computed correlation for caching
 */
export async function storeCorrelation(
  variableAId: string,
  variableBId: string,
  _periodStart: string,
  _periodEnd: string,
  correlation: number,
  pValue: number,
  sampleSize: number,
  stabilityScore: number
): Promise<void> {
  // Store in observations or a dedicated correlations table
  // For now, we compute on-demand
  console.log('Correlation computed:', {
    variableAId,
    variableBId,
    correlation,
    pValue,
    sampleSize,
    stabilityScore,
  });
}
