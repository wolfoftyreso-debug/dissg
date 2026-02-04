/**
 * Mock data for Global Diagnostic Map
 */

import type { GeoEntity, LambdaOverlay, DiagnosticPanelData, GEDICodeSummary, ProbableCause, Lever } from './types';
import type { LambdaAxis } from '@/lib/lambda/lambda-1.0';

// =============================================================================
// COUNTRY DATA
// =============================================================================

export const COUNTRIES: GeoEntity[] = [
  { code: 'SE', name: { sv: 'Sverige', en: 'Sweden' }, level: 'country', parentCode: 'EU', center: [18.6435, 60.1282], population: 10500000 },
  { code: 'NO', name: { sv: 'Norge', en: 'Norway' }, level: 'country', parentCode: 'EU', center: [8.4689, 60.4720], population: 5400000 },
  { code: 'FI', name: { sv: 'Finland', en: 'Finland' }, level: 'country', parentCode: 'EU', center: [25.7482, 61.9241], population: 5500000 },
  { code: 'DK', name: { sv: 'Danmark', en: 'Denmark' }, level: 'country', parentCode: 'EU', center: [9.5018, 56.2639], population: 5900000 },
  { code: 'DE', name: { sv: 'Tyskland', en: 'Germany' }, level: 'country', parentCode: 'EU', center: [10.4515, 51.1657], population: 83000000 },
  { code: 'FR', name: { sv: 'Frankrike', en: 'France' }, level: 'country', parentCode: 'EU', center: [2.2137, 46.2276], population: 67000000 },
  { code: 'GB', name: { sv: 'Storbritannien', en: 'United Kingdom' }, level: 'country', parentCode: 'EU', center: [-3.4360, 55.3781], population: 67000000 },
  { code: 'US', name: { sv: 'USA', en: 'United States' }, level: 'country', parentCode: 'NA', center: [-95.7129, 37.0902], population: 331000000 },
  { code: 'CA', name: { sv: 'Kanada', en: 'Canada' }, level: 'country', parentCode: 'NA', center: [-106.3468, 56.1304], population: 38000000 },
  { code: 'JP', name: { sv: 'Japan', en: 'Japan' }, level: 'country', parentCode: 'AS', center: [138.2529, 36.2048], population: 125000000 },
  { code: 'KR', name: { sv: 'Sydkorea', en: 'South Korea' }, level: 'country', parentCode: 'AS', center: [127.7669, 35.9078], population: 52000000 },
  { code: 'CN', name: { sv: 'Kina', en: 'China' }, level: 'country', parentCode: 'AS', center: [104.1954, 35.8617], population: 1400000000 },
  { code: 'IN', name: { sv: 'Indien', en: 'India' }, level: 'country', parentCode: 'AS', center: [78.9629, 20.5937], population: 1400000000 },
  { code: 'AU', name: { sv: 'Australien', en: 'Australia' }, level: 'country', parentCode: 'OC', center: [133.7751, -25.2744], population: 26000000 },
  { code: 'BR', name: { sv: 'Brasilien', en: 'Brazil' }, level: 'country', parentCode: 'SA', center: [-51.9253, -14.2350], population: 215000000 },
  { code: 'ZA', name: { sv: 'Sydafrika', en: 'South Africa' }, level: 'country', parentCode: 'AF', center: [22.9375, -30.5595], population: 60000000 },
  { code: 'NG', name: { sv: 'Nigeria', en: 'Nigeria' }, level: 'country', parentCode: 'AF', center: [8.6753, 9.0820], population: 220000000 },
  { code: 'EG', name: { sv: 'Egypten', en: 'Egypt' }, level: 'country', parentCode: 'AF', center: [30.8025, 26.8206], population: 105000000 },
  { code: 'RU', name: { sv: 'Ryssland', en: 'Russia' }, level: 'country', parentCode: 'EU', center: [105.3188, 61.5240], population: 144000000 },
  { code: 'MX', name: { sv: 'Mexiko', en: 'Mexico' }, level: 'country', parentCode: 'NA', center: [-102.5528, 23.6345], population: 130000000 },
];

// =============================================================================
// LAMBDA OVERLAYS
// =============================================================================

export const LAMBDA_OVERLAYS: Record<string, LambdaOverlay> = {
  SE: { geoCode: 'SE', lambda: 1.02, interpretation: 'OPTIMAL_BALANCE', trend: 'stable', activeGEDICodes: [], topDrivers: ['GOV', 'HEALTH'], weakestAxes: ['DEMO'], confidence: 92 },
  NO: { geoCode: 'NO', lambda: 1.05, interpretation: 'OPTIMAL_BALANCE', trend: 'improving', activeGEDICodes: [], topDrivers: ['ECON', 'GOV'], weakestAxes: ['DEMO'], confidence: 94 },
  FI: { geoCode: 'FI', lambda: 0.99, interpretation: 'OPTIMAL_BALANCE', trend: 'stable', activeGEDICodes: [], topDrivers: ['EDUC', 'SOCIAL'], weakestAxes: ['DEMO', 'LABOR'], confidence: 91 },
  DK: { geoCode: 'DK', lambda: 1.03, interpretation: 'OPTIMAL_BALANCE', trend: 'stable', activeGEDICodes: [], topDrivers: ['SOCIAL', 'GOV'], weakestAxes: ['CLIMATE'], confidence: 93 },
  DE: { geoCode: 'DE', lambda: 0.94, interpretation: 'STRUCTURAL_WEAK', trend: 'declining', activeGEDICodes: ['GEDI-001'], topDrivers: ['ECON'], weakestAxes: ['DEMO', 'CLIMATE'], confidence: 89 },
  FR: { geoCode: 'FR', lambda: 0.91, interpretation: 'STRUCTURAL_WEAK', trend: 'declining', activeGEDICodes: ['GEDI-003', 'GEDI-006'], topDrivers: ['HEALTH'], weakestAxes: ['SOCIAL', 'LABOR'], confidence: 87 },
  GB: { geoCode: 'GB', lambda: 0.89, interpretation: 'STRUCTURAL_WEAK', trend: 'declining', activeGEDICodes: ['GEDI-001', 'GEDI-004'], topDrivers: ['ECON'], weakestAxes: ['HEALTH', 'SOCIAL'], confidence: 86 },
  US: { geoCode: 'US', lambda: 0.82, interpretation: 'CRITICAL_LOW', trend: 'declining', activeGEDICodes: ['GEDI-001', 'GEDI-003', 'GEDI-004', 'GEDI-005'], topDrivers: ['ECON'], weakestAxes: ['HEALTH', 'SOCIAL', 'CLIMATE'], confidence: 88 },
  CA: { geoCode: 'CA', lambda: 0.96, interpretation: 'OPTIMAL_BALANCE', trend: 'stable', activeGEDICodes: [], topDrivers: ['GOV', 'EDUC'], weakestAxes: ['CLIMATE'], confidence: 90 },
  JP: { geoCode: 'JP', lambda: 0.88, interpretation: 'STRUCTURAL_WEAK', trend: 'declining', activeGEDICodes: ['GEDI-001'], topDrivers: ['HEALTH', 'EDUC'], weakestAxes: ['DEMO', 'LABOR'], confidence: 91 },
  KR: { geoCode: 'KR', lambda: 0.93, interpretation: 'STRUCTURAL_WEAK', trend: 'stable', activeGEDICodes: [], topDrivers: ['EDUC', 'ECON'], weakestAxes: ['DEMO', 'SOCIAL'], confidence: 88 },
  CN: { geoCode: 'CN', lambda: 0.85, interpretation: 'CRITICAL_LOW', trend: 'stable', activeGEDICodes: ['GEDI-005', 'GEDI-006'], topDrivers: ['ECON'], weakestAxes: ['GOV', 'CLIMATE'], confidence: 72 },
  IN: { geoCode: 'IN', lambda: 0.78, interpretation: 'CRITICAL_LOW', trend: 'improving', activeGEDICodes: ['GEDI-001', 'GEDI-003', 'GEDI-004'], topDrivers: ['DEMO'], weakestAxes: ['HEALTH', 'EDUC', 'SOCIAL'], confidence: 68 },
  AU: { geoCode: 'AU', lambda: 0.97, interpretation: 'OPTIMAL_BALANCE', trend: 'stable', activeGEDICodes: [], topDrivers: ['ECON', 'GOV'], weakestAxes: ['CLIMATE'], confidence: 91 },
  BR: { geoCode: 'BR', lambda: 0.79, interpretation: 'CRITICAL_LOW', trend: 'stable', activeGEDICodes: ['GEDI-003', 'GEDI-007'], topDrivers: [], weakestAxes: ['GOV', 'SOCIAL', 'EDUC'], confidence: 75 },
  ZA: { geoCode: 'ZA', lambda: 0.72, interpretation: 'CRITICAL_LOW', trend: 'declining', activeGEDICodes: ['GEDI-001', 'GEDI-003', 'GEDI-004'], topDrivers: [], weakestAxes: ['LABOR', 'SOCIAL', 'EDUC'], confidence: 70 },
  NG: { geoCode: 'NG', lambda: 0.68, interpretation: 'CRITICAL_LOW', trend: 'stable', activeGEDICodes: ['GEDI-001', 'GEDI-004', 'GEDI-007'], topDrivers: ['DEMO'], weakestAxes: ['GOV', 'HEALTH', 'EDUC'], confidence: 55 },
  EG: { geoCode: 'EG', lambda: 0.75, interpretation: 'CRITICAL_LOW', trend: 'stable', activeGEDICodes: ['GEDI-003', 'GEDI-006'], topDrivers: ['DEMO'], weakestAxes: ['GOV', 'SOCIAL'], confidence: 65 },
  RU: { geoCode: 'RU', lambda: 0.76, interpretation: 'CRITICAL_LOW', trend: 'declining', activeGEDICodes: ['GEDI-004', 'GEDI-006', 'GEDI-007'], topDrivers: [], weakestAxes: ['GOV', 'HEALTH', 'SOCIAL'], confidence: 60 },
  MX: { geoCode: 'MX', lambda: 0.81, interpretation: 'CRITICAL_LOW', trend: 'stable', activeGEDICodes: ['GEDI-003', 'GEDI-007'], topDrivers: ['DEMO'], weakestAxes: ['GOV', 'SOCIAL'], confidence: 72 },
  GLOBAL: { geoCode: 'GLOBAL', lambda: 0.86, interpretation: 'STRUCTURAL_WEAK', trend: 'stable', activeGEDICodes: ['GEDI-001', 'GEDI-005'], topDrivers: [], weakestAxes: ['CLIMATE', 'SOCIAL'], confidence: 78 },
};

// =============================================================================
// GEDI CODE DATA
// =============================================================================

export const GEDI_CODES: Record<string, GEDICodeSummary> = {
  'GEDI-001': { code: 'GEDI-001', name: 'Systemic Underperformance', severity: 'MAJOR', status: 'ACTIVE', firstTriggered: '2019-Q3', description: 'System outputs below scientific consensus baseline' },
  'GEDI-002': { code: 'GEDI-002', name: 'Sustainability Deviation', severity: 'WARN', status: 'ACTIVE', firstTriggered: '2015-Q1', description: 'Resource balance outside sustainable corridor' },
  'GEDI-003': { code: 'GEDI-003', name: 'Inequality Breach', severity: 'MAJOR', status: 'ACTIVE', firstTriggered: '2020-Q2', description: 'Distribution metrics exceed international norms' },
  'GEDI-004': { code: 'GEDI-004', name: 'Health Paradox', severity: 'CRITICAL', status: 'ACTIVE', firstTriggered: '2018-Q4', description: 'Health outcomes declining despite resource increases' },
  'GEDI-005': { code: 'GEDI-005', name: 'Climate Trajectory', severity: 'CRITICAL', status: 'ACTIVE', firstTriggered: '2016-Q1', description: 'Emissions trajectory exceeds Paris commitments' },
  'GEDI-006': { code: 'GEDI-006', name: 'Democratic Friction', severity: 'WARN', status: 'ACTIVE', firstTriggered: '2021-Q1', description: 'Governance effectiveness declining' },
  'GEDI-007': { code: 'GEDI-007', name: 'Integrity Risk', severity: 'MAJOR', status: 'ACTIVE', firstTriggered: '2017-Q2', description: 'Corruption indicators above tolerance threshold' },
};

// =============================================================================
// PROBABLE CAUSES
// =============================================================================

export const PROBABLE_CAUSES: Record<string, ProbableCause[]> = {
  SE: [
    { id: 'demo_aging', label: { sv: 'Demografisk åldrande', en: 'Demographic aging' }, probability: 78, indicators: ['dependency_ratio', 'median_age'] },
    { id: 'housing_mismatch', label: { sv: 'Bostadsmarknad obalans', en: 'Housing market imbalance' }, probability: 65, indicators: ['housing_price_income', 'construction_rate'] },
    { id: 'labor_mismatch', label: { sv: 'Arbetsmarknads-mismatch', en: 'Labor market mismatch' }, probability: 52, indicators: ['skill_gap', 'vacancy_rate'] },
  ],
  US: [
    { id: 'health_cost', label: { sv: 'Vård-kostnadsineffektivitet', en: 'Healthcare cost inefficiency' }, probability: 89, indicators: ['health_spend_gdp', 'life_expectancy'] },
    { id: 'inequality', label: { sv: 'Inkomst-ojämlikhet', en: 'Income inequality' }, probability: 85, indicators: ['gini', 'top_10_share'] },
    { id: 'social_cohesion', label: { sv: 'Social sammanhållning', en: 'Social cohesion' }, probability: 78, indicators: ['trust_index', 'polarization'] },
    { id: 'climate_policy', label: { sv: 'Klimatpolicy-gap', en: 'Climate policy gap' }, probability: 72, indicators: ['co2_per_capita', 'renewable_share'] },
  ],
  GLOBAL: [
    { id: 'climate_trajectory', label: { sv: 'Klimatbana', en: 'Climate trajectory' }, probability: 92, indicators: ['global_temp', 'co2_concentration'] },
    { id: 'inequality_global', label: { sv: 'Global ojämlikhet', en: 'Global inequality' }, probability: 75, indicators: ['between_country_gini', 'extreme_poverty'] },
  ],
};

// =============================================================================
// LEVERS (What can move Lambda)
// =============================================================================

export const LEVERS: Record<string, Lever[]> = {
  SE: [
    { id: 'immigration_policy', label: { sv: 'Arbetskraftsinvandring', en: 'Labor immigration' }, impact: 0.03, axis: 'DEMO', difficulty: 'medium' },
    { id: 'pension_reform', label: { sv: 'Pensionsreform', en: 'Pension reform' }, impact: 0.02, axis: 'DEMO', difficulty: 'high' },
    { id: 'housing_deregulation', label: { sv: 'Bostadsmarknadsreform', en: 'Housing market reform' }, impact: 0.015, axis: 'LABOR', difficulty: 'high' },
  ],
  US: [
    { id: 'healthcare_reform', label: { sv: 'Vårdreform', en: 'Healthcare reform' }, impact: 0.08, axis: 'HEALTH', difficulty: 'high' },
    { id: 'education_investment', label: { sv: 'Utbildningsinvestering', en: 'Education investment' }, impact: 0.04, axis: 'EDUC', difficulty: 'medium' },
    { id: 'carbon_pricing', label: { sv: 'Koldioxidprissättning', en: 'Carbon pricing' }, impact: 0.03, axis: 'CLIMATE', difficulty: 'high' },
    { id: 'minimum_wage', label: { sv: 'Minimilön', en: 'Minimum wage' }, impact: 0.02, axis: 'SOCIAL', difficulty: 'medium' },
  ],
};

// =============================================================================
// HISTORICAL DATA
// =============================================================================

export function getHistoricalLambda(geoCode: string): { year: number; value: number }[] {
  const base = LAMBDA_OVERLAYS[geoCode]?.lambda || 0.85;
  const trend = LAMBDA_OVERLAYS[geoCode]?.trend || 'stable';
  
  return Array.from({ length: 25 }, (_, i) => {
    const year = 2000 + i;
    let drift = 0;
    if (trend === 'declining') drift = -0.008 * i;
    else if (trend === 'improving') drift = 0.004 * i;
    
    const noise = (Math.random() - 0.5) * 0.04;
    return { year, value: Math.max(0.6, Math.min(1.2, base - drift + noise)) };
  });
}

// =============================================================================
// HELPER: Get Diagnostic Panel Data
// =============================================================================

export function getDiagnosticPanelData(geoCode: string): DiagnosticPanelData | null {
  const geo = COUNTRIES.find(c => c.code === geoCode);
  const lambda = LAMBDA_OVERLAYS[geoCode];
  
  if (!geo || !lambda) return null;
  
  const gediCodes = lambda.activeGEDICodes
    .map(code => GEDI_CODES[code])
    .filter(Boolean);
  
  const topCauses = PROBABLE_CAUSES[geoCode] || PROBABLE_CAUSES['GLOBAL'] || [];
  const topLevers = LEVERS[geoCode] || [];
  const historicalLambda = getHistoricalLambda(geoCode);
  
  return { geo, lambda, gediCodes, topCauses, topLevers, historicalLambda };
}

// =============================================================================
// LAMBDA COLOR SCALE
// =============================================================================

export function getLambdaColor(lambda: number): string {
  if (lambda < 0.85) return '#dc2626';      // red - critical
  if (lambda < 0.95) return '#f97316';      // orange - structural weak
  if (lambda <= 1.05) return '#3b82f6';     // blue - optimal
  if (lambda <= 1.15) return '#a855f7';     // purple - overheat
  return '#be123c';                          // rose - critical high
}

export function getSystemStatus(lambda: number): { status: string; color: string; label: { sv: string; en: string } } {
  if (lambda >= 0.95 && lambda <= 1.05) {
    return { status: 'BALANCED', color: '#3b82f6', label: { sv: '🟢 Balanserat', en: '🟢 Balanced' } };
  }
  if (lambda >= 0.85 && lambda <= 1.15) {
    return { status: 'STRAINED', color: '#f97316', label: { sv: '🟡 Ansträngt', en: '🟡 Strained' } };
  }
  return { status: 'FAULT_DETECTED', color: '#dc2626', label: { sv: '🔴 Fel detekterat', en: '🔴 Fault Detected' } };
}
