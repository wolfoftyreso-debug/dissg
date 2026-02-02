/**
 * COVID-19 REALITY LAYER - Comparison Validator
 * Prevents methodologically invalid comparisons
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  CovidComparisonRequest, 
  CovidComparisonResult 
} from '@/types/covid';
import { fetchMethodChanges, fetchCovidRawData } from './queries';

export interface ComparisonValidation {
  isValid: boolean;
  validityScore: number;
  reasons: string[];
  warnings: string[];
}

/**
 * Validate whether a comparison between two countries is methodologically valid
 */
export async function validateComparison(
  request: CovidComparisonRequest
): Promise<ComparisonValidation> {
  const reasons: string[] = [];
  const warnings: string[] = [];
  let validityScore = 1.0;

  // Check cached validity
  const { data: cached } = await supabase
    .from('covid_comparison_validity')
    .select('*')
    .eq('country_a', request.countryA)
    .eq('country_b', request.countryB)
    .eq('data_type', request.dataType)
    .gte('period_start', request.dateRange.start)
    .lte('period_end', request.dateRange.end)
    .single();

  if (cached && !cached.is_valid) {
    return {
      isValid: false,
      validityScore: cached.validity_score || 0,
      reasons: cached.invalidity_reasons || ['Comparison previously marked as invalid'],
      warnings: [],
    };
  }

  // Check for method changes in the period for both countries
  const [changesA, changesB] = await Promise.all([
    fetchMethodChanges(request.countryA, request.dataType, request.dateRange.start, request.dateRange.end),
    fetchMethodChanges(request.countryB, request.dataType, request.dateRange.start, request.dateRange.end),
  ]);

  // Check for comparability-breaking changes
  const breakingChangesA = changesA.filter(c => c.impactSeverity === 'breaks_comparability');
  const breakingChangesB = changesB.filter(c => c.impactSeverity === 'breaks_comparability');

  if (breakingChangesA.length > 0 || breakingChangesB.length > 0) {
    reasons.push('One or both countries had definition changes that break comparability during this period');
    validityScore = 0;
  }

  // Check for major changes
  const majorChangesA = changesA.filter(c => c.impactSeverity === 'major');
  const majorChangesB = changesB.filter(c => c.impactSeverity === 'major');

  if (majorChangesA.length > 0 || majorChangesB.length > 0) {
    warnings.push(`Major method changes occurred: ${majorChangesA.length} in ${request.countryA}, ${majorChangesB.length} in ${request.countryB}`);
    validityScore *= 0.7;
  }

  // Check for different definition versions
  const [dataA, dataB] = await Promise.all([
    fetchCovidRawData(request.countryA, [request.dataType], request.dateRange.start, request.dateRange.end),
    fetchCovidRawData(request.countryB, [request.dataType], request.dateRange.start, request.dateRange.end),
  ]);

  const versionsA = new Set(dataA.map(d => d.definitionVersion));
  const versionsB = new Set(dataB.map(d => d.definitionVersion));

  // Simple check: if version sets don't overlap, definitions differ
  const commonVersions = [...versionsA].filter(v => versionsB.has(v));
  if (commonVersions.length === 0 && versionsA.size > 0 && versionsB.size > 0) {
    warnings.push('Countries use different definition versions for this data type');
    validityScore *= 0.8;
  }

  // Check for different reporters
  const reportersA = new Set(dataA.map(d => d.reporter));
  const reportersB = new Set(dataB.map(d => d.reporter));
  
  if (![...reportersA].some(r => reportersB.has(r))) {
    warnings.push('Data comes from different reporting sources, which may affect comparability');
    validityScore *= 0.9;
  }

  return {
    isValid: validityScore > 0.5,
    validityScore,
    reasons,
    warnings,
  };
}

/**
 * Get full comparison result with data if valid
 */
export async function getComparisonWithValidation(
  request: CovidComparisonRequest
): Promise<CovidComparisonResult> {
  const validation = await validateComparison(request);

  if (!validation.isValid) {
    return {
      isValid: false,
      validityScore: validation.validityScore,
      invalidityReasons: validation.reasons,
      methodChangesInPeriod: [],
      warningMessage: 'This comparison is not methodologically valid. ' + validation.reasons.join(' '),
    };
  }

  // Fetch data for both countries
  const [dataA, dataB, changesA, changesB] = await Promise.all([
    fetchCovidRawData(request.countryA, [request.dataType], request.dateRange.start, request.dateRange.end),
    fetchCovidRawData(request.countryB, [request.dataType], request.dateRange.start, request.dateRange.end),
    fetchMethodChanges(request.countryA, request.dataType, request.dateRange.start, request.dateRange.end),
    fetchMethodChanges(request.countryB, request.dataType, request.dateRange.start, request.dateRange.end),
  ]);

  return {
    isValid: true,
    validityScore: validation.validityScore,
    invalidityReasons: [],
    data: {
      countryA: dataA,
      countryB: dataB,
    },
    methodChangesInPeriod: [...changesA, ...changesB],
    warningMessage: validation.warnings.length > 0 
      ? 'Caution: ' + validation.warnings.join(' ') 
      : undefined,
  };
}

/**
 * Standard response for blocked comparisons
 */
export const BLOCKED_COMPARISON_RESPONSE = {
  sv: 'Denna jämförelse är inte metodologiskt giltig. Länderna använder olika definitioner, teststrategier eller rapporteringsmetoder under den valda perioden.',
  en: 'This comparison is not methodologically valid. The countries use different definitions, testing strategies, or reporting methods during the selected period.',
};
