/**
 * COVID-19 REALITY LAYER - Type Definitions
 * Raw data, method tracking, sensitivity analysis
 */

export interface CovidRawDataPoint {
  id: string;
  countryCode: string;
  regionCode?: string;
  dataType: CovidDataType;
  periodDate: string;
  value: number;
  valuePer100k?: number;
  ageGroup?: string;
  definitionVersion: string;
  reporter: string;
  reportingLagDays?: number;
  isPreliminary: boolean;
  revisionNumber: number;
  confidenceIntervalLower?: number;
  confidenceIntervalUpper?: number;
  dataSourceCode: string;
}

export type CovidDataType = 
  | 'confirmed_cases'
  | 'deaths'
  | 'hospitalizations'
  | 'icu'
  | 'tests'
  | 'positivity'
  | 'vaccinations';

export interface CovidMethodChange {
  id: string;
  countryCode: string;
  dataType: CovidDataType;
  changeDate: string;
  previousDefinition: string;
  newDefinition: string;
  changeType: MethodChangeType;
  impactSeverity: ImpactSeverity;
  comparabilityNote: string;
  sourceUrl?: string;
}

export type MethodChangeType = 
  | 'test_strategy'
  | 'death_definition'
  | 'reporting_frequency'
  | 'case_definition';

export type ImpactSeverity = 
  | 'minor'
  | 'moderate'
  | 'major'
  | 'breaks_comparability';

export interface CovidExcessMortality {
  id: string;
  countryCode: string;
  periodStart: string;
  periodEnd: string;
  observedDeaths: number;
  expectedDeaths: number;
  expectedDeathsLower?: number;
  expectedDeathsUpper?: number;
  excessDeaths: number;
  excessPercent?: number;
  ageStandardized: boolean;
  seasonAdjusted: boolean;
  baselinePeriod?: string;
  methodology: string;
  dataSourceCode: string;
}

export interface CovidPolicyPeriod {
  id: string;
  countryCode: string;
  regionCode?: string;
  policyType: PolicyType;
  startDate: string;
  endDate?: string;
  stringencyLevel?: number;
  description?: string;
  sourceUrl?: string;
  isVerified: boolean;
}

export type PolicyType = 
  | 'lockdown'
  | 'school_closure'
  | 'mask_mandate'
  | 'travel_restriction'
  | 'gathering_limit'
  | 'business_closure'
  | 'curfew';

export interface CovidComparisonValidity {
  id: string;
  countryA: string;
  countryB: string;
  dataType: CovidDataType;
  periodStart: string;
  periodEnd: string;
  isValid: boolean;
  validityScore?: number;
  invalidityReasons?: string[];
  methodologyMatch: boolean;
  definitionMatch: boolean;
  reportingMatch: boolean;
}

export interface CovidSensitivityResult {
  id: string;
  analysisCode: string;
  baseQueryParams: Record<string, unknown>;
  variationsTested: SensitivityVariation[];
  results: SensitivityOutcome[];
  stabilityScore: number;
  stabilityClassification: StabilityClassification;
  keySensitivities: string[];
}

export interface SensitivityVariation {
  parameter: string;
  originalValue: unknown;
  testedValues: unknown[];
}

export interface SensitivityOutcome {
  variationId: string;
  parameterChanged: string;
  newValue: unknown;
  resultChange: number;
  resultChangePercent: number;
}

export type StabilityClassification = 
  | 'robust'
  | 'moderate'
  | 'sensitive'
  | 'unstable';

export interface CovidConclusionType {
  id: string;
  conclusionType: string;
  isAllowed: boolean;
  templateText: string;
  requiresConditions: string[];
  forbiddenPhrases: string[];
}

// View state types
export interface CovidRawDataView {
  selectedCountry: string;
  selectedDataTypes: CovidDataType[];
  dateRange: { start: string; end: string };
  showMethodChanges: boolean;
  showPolicyPeriods: boolean;
  ageGroup?: string;
}

export interface CovidComparisonRequest {
  countryA: string;
  countryB: string;
  dataType: CovidDataType;
  dateRange: { start: string; end: string };
}

export interface CovidComparisonResult {
  isValid: boolean;
  validityScore: number;
  invalidityReasons: string[];
  data?: {
    countryA: CovidRawDataPoint[];
    countryB: CovidRawDataPoint[];
  };
  methodChangesInPeriod: CovidMethodChange[];
  warningMessage?: string;
}
