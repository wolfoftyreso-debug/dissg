/**
 * Democratic Health Domain
 * 
 * Global aggregation of democratic participation, electoral integrity,
 * and governance quality indicators across 195 nations.
 * 
 * Domain code: Uses GOV-DEM subsystem for democracy indicators
 */

// =============================================================================
// DEMOCRATIC HEALTH INDICATORS
// =============================================================================

export interface DemocraticIndicator {
  code: string;
  name: string;
  description: string;
  unit: string;
  setpointMin: number | null;
  setpointMax: number | null;
  direction: 'higher_better' | 'lower_better' | 'target_range';
  source: string;
  updateFrequency: 'annual' | 'per_election' | 'monthly';
}

export const DEMOCRATIC_INDICATORS: DemocraticIndicator[] = [
  // Electoral Participation
  {
    code: 'GOV-DEM-TURNOUT',
    name: 'Valdeltagande',
    description: 'Andel röstberättigade som deltog i senaste nationella val',
    unit: '%',
    setpointMin: 70,
    setpointMax: null,
    direction: 'higher_better',
    source: 'IDEA International',
    updateFrequency: 'per_election',
  },
  {
    code: 'GOV-DEM-TURNOUT-GAP',
    name: 'Deltagandesspridning',
    description: 'Skillnad mellan högsta och lägsta valdeltagande per region',
    unit: 'pp',
    setpointMin: null,
    setpointMax: 15,
    direction: 'lower_better',
    source: 'National Electoral Commissions',
    updateFrequency: 'per_election',
  },
  {
    code: 'GOV-DEM-YOUTH-VOTE',
    name: 'Ungdomsdeltagande',
    description: 'Valdeltagande bland förstagångsväljare (18-24 år)',
    unit: '%',
    setpointMin: 60,
    setpointMax: null,
    direction: 'higher_better',
    source: 'IDEA Youth Participation',
    updateFrequency: 'per_election',
  },
  
  // Democratic Quality
  {
    code: 'GOV-DEM-INDEX',
    name: 'Demokratiindex',
    description: 'Sammansatt index för demokratisk kvalitet (EIU)',
    unit: 'index',
    setpointMin: 8.0,
    setpointMax: null,
    direction: 'higher_better',
    source: 'Economist Intelligence Unit',
    updateFrequency: 'annual',
  },
  {
    code: 'GOV-DEM-FREEDOM',
    name: 'Frihetsindex',
    description: 'Politiska rättigheter och medborgerliga friheter (Freedom House)',
    unit: 'poäng',
    setpointMin: 70,
    setpointMax: null,
    direction: 'higher_better',
    source: 'Freedom House',
    updateFrequency: 'annual',
  },
  {
    code: 'GOV-DEM-PRESS',
    name: 'Pressfrihet',
    description: 'Index för mediefrihet och journalistisk säkerhet',
    unit: 'index',
    setpointMin: 70,
    setpointMax: null,
    direction: 'higher_better',
    source: 'Reporters Without Borders',
    updateFrequency: 'annual',
  },
  
  // Electoral Integrity
  {
    code: 'GOV-DEM-INTEGRITY',
    name: 'Valintegritet',
    description: 'Index för valets rättssäkerhet och transparens',
    unit: 'index',
    setpointMin: 60,
    setpointMax: null,
    direction: 'higher_better',
    source: 'Electoral Integrity Project',
    updateFrequency: 'per_election',
  },
  {
    code: 'GOV-DEM-COMPETITION',
    name: 'Politisk konkurrens',
    description: 'Effektivt antal partier (Laakso-Taagepera)',
    unit: 'antal',
    setpointMin: 2.5,
    setpointMax: 8.0,
    direction: 'target_range',
    source: 'V-Dem Institute',
    updateFrequency: 'per_election',
  },
  
  // Representation
  {
    code: 'GOV-DEM-GENDER',
    name: 'Könsrepresentation',
    description: 'Andel kvinnor i nationellt parlament',
    unit: '%',
    setpointMin: 40,
    setpointMax: 60,
    direction: 'target_range',
    source: 'Inter-Parliamentary Union',
    updateFrequency: 'annual',
  },
  {
    code: 'GOV-DEM-MINORITY',
    name: 'Minoritetsrepresentation',
    description: 'Index för etnisk/religiös representation i styrande organ',
    unit: 'index',
    setpointMin: 0.7,
    setpointMax: null,
    direction: 'higher_better',
    source: 'V-Dem Institute',
    updateFrequency: 'annual',
  },
];

// =============================================================================
// GLOBAL DEMOCRATIC HEALTH AGGREGATES
// =============================================================================

export interface DemocraticAggregate {
  code: string;
  name: string;
  globalValue: number;
  globalLambda: number;
  trend: 'improving' | 'stable' | 'declining';
  trendPeriod: string;
  coverage: number; // % of countries with data
}

export const GLOBAL_DEMOCRATIC_AGGREGATES: DemocraticAggregate[] = [
  {
    code: 'GLOBAL-DEM-TURNOUT',
    name: 'Globalt valdeltagande',
    globalValue: 66.2,
    globalLambda: 0.87,
    trend: 'stable',
    trendPeriod: '2000–2024',
    coverage: 94,
  },
  {
    code: 'GLOBAL-DEM-INDEX',
    name: 'Globalt demokratiindex',
    globalValue: 5.29,
    globalLambda: 0.66,
    trend: 'declining',
    trendPeriod: '2015–2024',
    coverage: 98,
  },
  {
    code: 'GLOBAL-DEM-FREEDOM',
    name: 'Global frihet',
    globalValue: 55.0,
    globalLambda: 0.69,
    trend: 'declining',
    trendPeriod: '2010–2024',
    coverage: 100,
  },
  {
    code: 'GLOBAL-DEM-PRESS',
    name: 'Global pressfrihet',
    globalValue: 44.3,
    globalLambda: 0.55,
    trend: 'declining',
    trendPeriod: '2015–2024',
    coverage: 98,
  },
];

// =============================================================================
// REGIME TYPE CLASSIFICATION
// =============================================================================

export type RegimeType = 
  | 'full_democracy' 
  | 'flawed_democracy' 
  | 'hybrid' 
  | 'authoritarian';

export interface RegimeClassification {
  type: RegimeType;
  label: string;
  description: string;
  indexRange: [number, number];
  color: string;
  countryCount: number; // 2024 data
}

export const REGIME_CLASSIFICATIONS: RegimeClassification[] = [
  {
    type: 'full_democracy',
    label: 'Full demokrati',
    description: 'Fungerande demokratiska institutioner med stark rättsstat',
    indexRange: [8.0, 10.0],
    color: 'hsl(142, 76%, 36%)', // Green
    countryCount: 24,
  },
  {
    type: 'flawed_democracy',
    label: 'Bristfällig demokrati',
    description: 'Fria val men med svagheter i styrning och politisk kultur',
    indexRange: [6.0, 8.0],
    color: 'hsl(48, 96%, 53%)', // Yellow
    countryCount: 50,
  },
  {
    type: 'hybrid',
    label: 'Hybridregim',
    description: 'Blandsystem med demokratiska och auktoritära element',
    indexRange: [4.0, 6.0],
    color: 'hsl(25, 95%, 53%)', // Orange
    countryCount: 36,
  },
  {
    type: 'authoritarian',
    label: 'Auktoritär',
    description: 'Begränsad politisk pluralism och medborgerliga friheter',
    indexRange: [0.0, 4.0],
    color: 'hsl(0, 84%, 60%)', // Red
    countryCount: 57,
  },
];

// =============================================================================
// DEMOCRATIC FAULT CODES
// =============================================================================

export interface DemocraticFaultCode {
  code: string;
  description: string;
  severity: 'informational' | 'warning' | 'critical' | 'systemic';
  affectedIndicators: string[];
  triggeredWhen: string;
}

export const DEMOCRATIC_FAULT_CODES: DemocraticFaultCode[] = [
  {
    code: 'GOV-DEM-TRE-156',
    description: 'Sjunkande valdeltagande över 3+ valcykler',
    severity: 'warning',
    affectedIndicators: ['GOV-DEM-TURNOUT', 'GOV-DEM-YOUTH-VOTE'],
    triggeredWhen: 'Turnout decline > 10pp over 3 elections',
  },
  {
    code: 'GOV-DEM-STR-301',
    description: 'Strukturell demokratisk erosion',
    severity: 'critical',
    affectedIndicators: ['GOV-DEM-INDEX', 'GOV-DEM-FREEDOM'],
    triggeredWhen: 'Democracy index decline > 0.5 over 5 years',
  },
  {
    code: 'GOV-DEM-SYS-701',
    description: 'Systemisk autokratisering',
    severity: 'systemic',
    affectedIndicators: ['GOV-DEM-INDEX', 'GOV-DEM-FREEDOM', 'GOV-DEM-PRESS'],
    triggeredWhen: 'Regime type downgrade (e.g., flawed → hybrid)',
  },
  {
    code: 'GOV-DEM-VAR-088',
    description: 'Onormal volatilitet i valdeltagande',
    severity: 'informational',
    affectedIndicators: ['GOV-DEM-TURNOUT', 'GOV-DEM-TURNOUT-GAP'],
    triggeredWhen: 'Regional turnout variance > 30pp',
  },
  {
    code: 'GOV-DEM-RES-245',
    description: 'Underrepresentation i styrande organ',
    severity: 'warning',
    affectedIndicators: ['GOV-DEM-GENDER', 'GOV-DEM-MINORITY'],
    triggeredWhen: 'Gender/minority representation < 25%',
  },
];

// =============================================================================
// COUNTRY-LEVEL SAMPLE DATA
// =============================================================================

export interface CountryDemocraticData {
  countryCode: string;
  countryName: string;
  regimeType: RegimeType;
  democracyIndex: number;
  freedomScore: number;
  voterTurnout: number;
  pressFreedopm: number;
  lastElection: string;
  trend: 'improving' | 'stable' | 'declining';
}

export const SAMPLE_COUNTRY_DEMOCRATIC_DATA: CountryDemocraticData[] = [
  { countryCode: 'NO', countryName: 'Norge', regimeType: 'full_democracy', democracyIndex: 9.81, freedomScore: 100, voterTurnout: 77.2, pressFreedopm: 92.2, lastElection: '2021', trend: 'stable' },
  { countryCode: 'SE', countryName: 'Sverige', regimeType: 'full_democracy', democracyIndex: 9.39, freedomScore: 100, voterTurnout: 84.2, pressFreedopm: 88.2, lastElection: '2022', trend: 'stable' },
  { countryCode: 'DK', countryName: 'Danmark', regimeType: 'full_democracy', democracyIndex: 9.28, freedomScore: 97, voterTurnout: 84.6, pressFreedopm: 90.3, lastElection: '2022', trend: 'stable' },
  { countryCode: 'FI', countryName: 'Finland', regimeType: 'full_democracy', democracyIndex: 9.27, freedomScore: 100, voterTurnout: 72.8, pressFreedopm: 88.4, lastElection: '2023', trend: 'stable' },
  { countryCode: 'NZ', countryName: 'Nya Zeeland', regimeType: 'full_democracy', democracyIndex: 9.25, freedomScore: 99, voterTurnout: 82.2, pressFreedopm: 87.8, lastElection: '2023', trend: 'stable' },
  { countryCode: 'DE', countryName: 'Tyskland', regimeType: 'full_democracy', democracyIndex: 8.80, freedomScore: 94, voterTurnout: 76.6, pressFreedopm: 78.3, lastElection: '2021', trend: 'stable' },
  { countryCode: 'US', countryName: 'USA', regimeType: 'flawed_democracy', democracyIndex: 7.85, freedomScore: 83, voterTurnout: 66.8, pressFreedopm: 71.2, lastElection: '2024', trend: 'declining' },
  { countryCode: 'FR', countryName: 'Frankrike', regimeType: 'flawed_democracy', democracyIndex: 7.99, freedomScore: 89, voterTurnout: 47.5, pressFreedopm: 74.6, lastElection: '2022', trend: 'stable' },
  { countryCode: 'BR', countryName: 'Brasilien', regimeType: 'flawed_democracy', democracyIndex: 6.78, freedomScore: 72, voterTurnout: 79.1, pressFreedopm: 52.4, lastElection: '2022', trend: 'improving' },
  { countryCode: 'IN', countryName: 'Indien', regimeType: 'flawed_democracy', democracyIndex: 7.04, freedomScore: 66, voterTurnout: 67.4, pressFreedopm: 36.6, lastElection: '2024', trend: 'declining' },
  { countryCode: 'HU', countryName: 'Ungern', regimeType: 'hybrid', democracyIndex: 5.94, freedomScore: 59, voterTurnout: 69.6, pressFreedopm: 46.8, lastElection: '2022', trend: 'declining' },
  { countryCode: 'TR', countryName: 'Turkiet', regimeType: 'hybrid', democracyIndex: 4.35, freedomScore: 32, voterTurnout: 87.0, pressFreedopm: 31.6, lastElection: '2023', trend: 'declining' },
  { countryCode: 'RU', countryName: 'Ryssland', regimeType: 'authoritarian', democracyIndex: 2.22, freedomScore: 13, voterTurnout: 68.0, pressFreedopm: 21.4, lastElection: '2024', trend: 'declining' },
  { countryCode: 'CN', countryName: 'Kina', regimeType: 'authoritarian', democracyIndex: 1.94, freedomScore: 9, voterTurnout: 0, pressFreedopm: 22.8, lastElection: 'N/A', trend: 'stable' },
  { countryCode: 'SA', countryName: 'Saudiarabien', regimeType: 'authoritarian', democracyIndex: 2.06, freedomScore: 8, voterTurnout: 0, pressFreedopm: 24.2, lastElection: 'N/A', trend: 'stable' },
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function getRegimeTypeFromIndex(index: number): RegimeType {
  if (index >= 8.0) return 'full_democracy';
  if (index >= 6.0) return 'flawed_democracy';
  if (index >= 4.0) return 'hybrid';
  return 'authoritarian';
}

export function getRegimeClassification(type: RegimeType): RegimeClassification | undefined {
  return REGIME_CLASSIFICATIONS.find(r => r.type === type);
}

export function calculateDemocraticLambda(data: CountryDemocraticData): number {
  // Geometric mean of normalized indicators
  const normalizedIndex = data.democracyIndex / 10;
  const normalizedFreedom = data.freedomScore / 100;
  const normalizedTurnout = data.voterTurnout / 100;
  const normalizedPress = data.pressFreedopm / 100;
  
  const geometric = Math.pow(
    normalizedIndex * normalizedFreedom * normalizedTurnout * normalizedPress,
    0.25
  );
  
  return Math.round(geometric * 100) / 100;
}
