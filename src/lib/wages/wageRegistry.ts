/**
 * WAGE DATA REGISTRY
 * 
 * Standardized wage data by occupation, country, and time period.
 * All wages normalized to comparable units (PPP, nominal USD, relative).
 * 
 * SOURCE: ILO ILOSTAT, OECD, national statistics offices
 * UPDATE: Annual
 */

export type OccupationCategory = 
  | 'teacher_primary'
  | 'nurse'
  | 'engineer_civil'
  | 'construction_worker'
  | 'restaurant_service'
  | 'software_developer'
  | 'factory_worker'
  | 'retail_sales'
  | 'bus_driver'
  | 'accountant';

export type SectorCategory = 'public' | 'private' | 'industry' | 'services';

export type PercentileLevel = 'p10' | 'p25' | 'p50' | 'p75' | 'p90';

export type WageUnit = 'ppp_usd' | 'nominal_usd' | 'relative_median';

export interface WageDataPoint {
  countryCode: string;
  year: number;
  occupation: OccupationCategory;
  sector?: SectorCategory;
  
  // Wage values in different units
  monthlyWagePPP: number;     // PPP-adjusted USD
  monthlyWageNominal: number; // Nominal USD
  relativeToMedian: number;   // Percentage of country median
  
  // Percentile data (optional)
  percentiles?: Record<PercentileLevel, number>;
  
  // Metadata
  sourceCode: string;
  confidence: 'high' | 'medium' | 'low';
  isEstimated: boolean;
}

// Occupation metadata
export const OCCUPATION_METADATA: Record<OccupationCategory, {
  name: string;
  nameLocal: Record<string, string>;
  iloCode: string;
  sector: SectorCategory;
  description: string;
}> = {
  teacher_primary: {
    name: 'Primary School Teacher',
    nameLocal: { sv: 'Grundskollärare', de: 'Grundschullehrer', no: 'Grunnskolelærer' },
    iloCode: '2341',
    sector: 'public',
    description: 'Teachers in primary/elementary education (grades 1-6)',
  },
  nurse: {
    name: 'Registered Nurse',
    nameLocal: { sv: 'Sjuksköterska', de: 'Krankenschwester', no: 'Sykepleier' },
    iloCode: '2221',
    sector: 'public',
    description: 'Professional nurses in healthcare settings',
  },
  engineer_civil: {
    name: 'Civil Engineer',
    nameLocal: { sv: 'Civilingenjör', de: 'Bauingenieur', no: 'Sivilingeniør' },
    iloCode: '2142',
    sector: 'private',
    description: 'Engineers specializing in construction and infrastructure',
  },
  construction_worker: {
    name: 'Construction Worker',
    nameLocal: { sv: 'Byggnadsarbetare', de: 'Bauarbeiter', no: 'Bygningsarbeider' },
    iloCode: '7111',
    sector: 'private',
    description: 'General construction laborers and skilled trades',
  },
  restaurant_service: {
    name: 'Restaurant Staff',
    nameLocal: { sv: 'Restaurangpersonal', de: 'Restaurantpersonal', no: 'Restaurantpersonale' },
    iloCode: '5131',
    sector: 'services',
    description: 'Waiters, bartenders, and restaurant service staff',
  },
  software_developer: {
    name: 'Software Developer',
    nameLocal: { sv: 'Mjukvaruutvecklare', de: 'Softwareentwickler', no: 'Programvareutvikler' },
    iloCode: '2512',
    sector: 'private',
    description: 'Software engineers and application developers',
  },
  factory_worker: {
    name: 'Factory Worker',
    nameLocal: { sv: 'Fabriksarbetare', de: 'Fabrikarbeiter', no: 'Fabrikkarbeider' },
    iloCode: '8211',
    sector: 'industry',
    description: 'Manufacturing and assembly line workers',
  },
  retail_sales: {
    name: 'Retail Sales',
    nameLocal: { sv: 'Butiksbiträde', de: 'Verkäufer', no: 'Butikkmedarbeider' },
    iloCode: '5223',
    sector: 'services',
    description: 'Shop assistants and retail sales workers',
  },
  bus_driver: {
    name: 'Bus Driver',
    nameLocal: { sv: 'Bussförare', de: 'Busfahrer', no: 'Bussjåfør' },
    iloCode: '8331',
    sector: 'public',
    description: 'Public transport and coach bus drivers',
  },
  accountant: {
    name: 'Accountant',
    nameLocal: { sv: 'Revisor', de: 'Buchhalter', no: 'Regnskapsfører' },
    iloCode: '2411',
    sector: 'private',
    description: 'Financial accountants and auditors',
  },
};

// Sample wage data (in production this would come from database)
export const WAGE_DATA: WageDataPoint[] = [
  // Sweden
  { countryCode: 'SE', year: 2023, occupation: 'teacher_primary', monthlyWagePPP: 4200, monthlyWageNominal: 4800, relativeToMedian: 105, sourceCode: 'SCB-WAGE-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2022, occupation: 'teacher_primary', monthlyWagePPP: 4100, monthlyWageNominal: 4600, relativeToMedian: 104, sourceCode: 'SCB-WAGE-2022', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2021, occupation: 'teacher_primary', monthlyWagePPP: 4000, monthlyWageNominal: 4500, relativeToMedian: 103, sourceCode: 'SCB-WAGE-2021', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2020, occupation: 'teacher_primary', monthlyWagePPP: 3900, monthlyWageNominal: 4400, relativeToMedian: 102, sourceCode: 'SCB-WAGE-2020', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2015, occupation: 'teacher_primary', monthlyWagePPP: 3600, monthlyWageNominal: 4000, relativeToMedian: 100, sourceCode: 'SCB-WAGE-2015', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2010, occupation: 'teacher_primary', monthlyWagePPP: 3200, monthlyWageNominal: 3500, relativeToMedian: 98, sourceCode: 'SCB-WAGE-2010', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2005, occupation: 'teacher_primary', monthlyWagePPP: 2800, monthlyWageNominal: 3000, relativeToMedian: 95, sourceCode: 'SCB-WAGE-2005', confidence: 'high', isEstimated: false },
  
  { countryCode: 'SE', year: 2023, occupation: 'nurse', monthlyWagePPP: 4000, monthlyWageNominal: 4600, relativeToMedian: 100, sourceCode: 'SCB-WAGE-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2022, occupation: 'nurse', monthlyWagePPP: 3900, monthlyWageNominal: 4400, relativeToMedian: 99, sourceCode: 'SCB-WAGE-2022', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2021, occupation: 'nurse', monthlyWagePPP: 3800, monthlyWageNominal: 4300, relativeToMedian: 98, sourceCode: 'SCB-WAGE-2021', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2020, occupation: 'nurse', monthlyWagePPP: 3700, monthlyWageNominal: 4200, relativeToMedian: 97, sourceCode: 'SCB-WAGE-2020', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2015, occupation: 'nurse', monthlyWagePPP: 3400, monthlyWageNominal: 3800, relativeToMedian: 95, sourceCode: 'SCB-WAGE-2015', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2010, occupation: 'nurse', monthlyWagePPP: 3000, monthlyWageNominal: 3300, relativeToMedian: 93, sourceCode: 'SCB-WAGE-2010', confidence: 'high', isEstimated: false },
  
  { countryCode: 'SE', year: 2023, occupation: 'software_developer', monthlyWagePPP: 5800, monthlyWageNominal: 6600, relativeToMedian: 145, sourceCode: 'SCB-WAGE-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2020, occupation: 'software_developer', monthlyWagePPP: 5200, monthlyWageNominal: 5900, relativeToMedian: 140, sourceCode: 'SCB-WAGE-2020', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2015, occupation: 'software_developer', monthlyWagePPP: 4600, monthlyWageNominal: 5100, relativeToMedian: 130, sourceCode: 'SCB-WAGE-2015', confidence: 'high', isEstimated: false },
  
  { countryCode: 'SE', year: 2023, occupation: 'construction_worker', monthlyWagePPP: 3800, monthlyWageNominal: 4300, relativeToMedian: 95, sourceCode: 'SCB-WAGE-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2020, occupation: 'construction_worker', monthlyWagePPP: 3500, monthlyWageNominal: 4000, relativeToMedian: 92, sourceCode: 'SCB-WAGE-2020', confidence: 'high', isEstimated: false },
  { countryCode: 'SE', year: 2015, occupation: 'construction_worker', monthlyWagePPP: 3200, monthlyWageNominal: 3600, relativeToMedian: 90, sourceCode: 'SCB-WAGE-2015', confidence: 'high', isEstimated: false },
  
  // Germany
  { countryCode: 'DE', year: 2023, occupation: 'teacher_primary', monthlyWagePPP: 4800, monthlyWageNominal: 5400, relativeToMedian: 115, sourceCode: 'DESTATIS-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'DE', year: 2022, occupation: 'teacher_primary', monthlyWagePPP: 4700, monthlyWageNominal: 5200, relativeToMedian: 114, sourceCode: 'DESTATIS-2022', confidence: 'high', isEstimated: false },
  { countryCode: 'DE', year: 2021, occupation: 'teacher_primary', monthlyWagePPP: 4600, monthlyWageNominal: 5100, relativeToMedian: 113, sourceCode: 'DESTATIS-2021', confidence: 'high', isEstimated: false },
  { countryCode: 'DE', year: 2020, occupation: 'teacher_primary', monthlyWagePPP: 4500, monthlyWageNominal: 5000, relativeToMedian: 112, sourceCode: 'DESTATIS-2020', confidence: 'high', isEstimated: false },
  { countryCode: 'DE', year: 2015, occupation: 'teacher_primary', monthlyWagePPP: 4100, monthlyWageNominal: 4500, relativeToMedian: 110, sourceCode: 'DESTATIS-2015', confidence: 'high', isEstimated: false },
  { countryCode: 'DE', year: 2010, occupation: 'teacher_primary', monthlyWagePPP: 3700, monthlyWageNominal: 4000, relativeToMedian: 108, sourceCode: 'DESTATIS-2010', confidence: 'high', isEstimated: false },
  
  { countryCode: 'DE', year: 2023, occupation: 'nurse', monthlyWagePPP: 3600, monthlyWageNominal: 4000, relativeToMedian: 87, sourceCode: 'DESTATIS-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'DE', year: 2020, occupation: 'nurse', monthlyWagePPP: 3300, monthlyWageNominal: 3700, relativeToMedian: 85, sourceCode: 'DESTATIS-2020', confidence: 'high', isEstimated: false },
  { countryCode: 'DE', year: 2015, occupation: 'nurse', monthlyWagePPP: 3000, monthlyWageNominal: 3300, relativeToMedian: 82, sourceCode: 'DESTATIS-2015', confidence: 'high', isEstimated: false },
  
  { countryCode: 'DE', year: 2023, occupation: 'software_developer', monthlyWagePPP: 5500, monthlyWageNominal: 6100, relativeToMedian: 132, sourceCode: 'DESTATIS-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'DE', year: 2020, occupation: 'software_developer', monthlyWagePPP: 5000, monthlyWageNominal: 5600, relativeToMedian: 128, sourceCode: 'DESTATIS-2020', confidence: 'high', isEstimated: false },
  
  { countryCode: 'DE', year: 2023, occupation: 'construction_worker', monthlyWagePPP: 3200, monthlyWageNominal: 3600, relativeToMedian: 77, sourceCode: 'DESTATIS-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'DE', year: 2020, occupation: 'construction_worker', monthlyWagePPP: 2900, monthlyWageNominal: 3200, relativeToMedian: 74, sourceCode: 'DESTATIS-2020', confidence: 'high', isEstimated: false },
  
  // USA
  { countryCode: 'US', year: 2023, occupation: 'teacher_primary', monthlyWagePPP: 5200, monthlyWageNominal: 5200, relativeToMedian: 95, sourceCode: 'BLS-OES-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'US', year: 2020, occupation: 'teacher_primary', monthlyWagePPP: 4800, monthlyWageNominal: 4800, relativeToMedian: 93, sourceCode: 'BLS-OES-2020', confidence: 'high', isEstimated: false },
  { countryCode: 'US', year: 2015, occupation: 'teacher_primary', monthlyWagePPP: 4400, monthlyWageNominal: 4400, relativeToMedian: 90, sourceCode: 'BLS-OES-2015', confidence: 'high', isEstimated: false },
  
  { countryCode: 'US', year: 2023, occupation: 'nurse', monthlyWagePPP: 7200, monthlyWageNominal: 7200, relativeToMedian: 132, sourceCode: 'BLS-OES-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'US', year: 2020, occupation: 'nurse', monthlyWagePPP: 6500, monthlyWageNominal: 6500, relativeToMedian: 125, sourceCode: 'BLS-OES-2020', confidence: 'high', isEstimated: false },
  { countryCode: 'US', year: 2015, occupation: 'nurse', monthlyWagePPP: 5800, monthlyWageNominal: 5800, relativeToMedian: 120, sourceCode: 'BLS-OES-2015', confidence: 'high', isEstimated: false },
  
  { countryCode: 'US', year: 2023, occupation: 'software_developer', monthlyWagePPP: 10500, monthlyWageNominal: 10500, relativeToMedian: 192, sourceCode: 'BLS-OES-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'US', year: 2020, occupation: 'software_developer', monthlyWagePPP: 9200, monthlyWageNominal: 9200, relativeToMedian: 178, sourceCode: 'BLS-OES-2020', confidence: 'high', isEstimated: false },
  { countryCode: 'US', year: 2015, occupation: 'software_developer', monthlyWagePPP: 7800, monthlyWageNominal: 7800, relativeToMedian: 160, sourceCode: 'BLS-OES-2015', confidence: 'high', isEstimated: false },
  
  { countryCode: 'US', year: 2023, occupation: 'construction_worker', monthlyWagePPP: 4200, monthlyWageNominal: 4200, relativeToMedian: 77, sourceCode: 'BLS-OES-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'US', year: 2020, occupation: 'construction_worker', monthlyWagePPP: 3800, monthlyWageNominal: 3800, relativeToMedian: 73, sourceCode: 'BLS-OES-2020', confidence: 'high', isEstimated: false },
  
  // Norway
  { countryCode: 'NO', year: 2023, occupation: 'teacher_primary', monthlyWagePPP: 4500, monthlyWageNominal: 6000, relativeToMedian: 95, sourceCode: 'SSB-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'NO', year: 2020, occupation: 'teacher_primary', monthlyWagePPP: 4200, monthlyWageNominal: 5600, relativeToMedian: 93, sourceCode: 'SSB-2020', confidence: 'high', isEstimated: false },
  
  { countryCode: 'NO', year: 2023, occupation: 'nurse', monthlyWagePPP: 4600, monthlyWageNominal: 6200, relativeToMedian: 97, sourceCode: 'SSB-2023', confidence: 'high', isEstimated: false },
  { countryCode: 'NO', year: 2020, occupation: 'nurse', monthlyWagePPP: 4300, monthlyWageNominal: 5800, relativeToMedian: 95, sourceCode: 'SSB-2020', confidence: 'high', isEstimated: false },
  
  { countryCode: 'NO', year: 2023, occupation: 'software_developer', monthlyWagePPP: 5800, monthlyWageNominal: 7800, relativeToMedian: 122, sourceCode: 'SSB-2023', confidence: 'high', isEstimated: false },
  
  { countryCode: 'NO', year: 2023, occupation: 'construction_worker', monthlyWagePPP: 4000, monthlyWageNominal: 5400, relativeToMedian: 85, sourceCode: 'SSB-2023', confidence: 'high', isEstimated: false },
];

// Helper functions
export function getWageData(
  countryCode: string,
  occupation: OccupationCategory,
  startYear?: number,
  endYear?: number
): WageDataPoint[] {
  return WAGE_DATA.filter(d => 
    d.countryCode === countryCode &&
    d.occupation === occupation &&
    (!startYear || d.year >= startYear) &&
    (!endYear || d.year <= endYear)
  ).sort((a, b) => a.year - b.year);
}

export function getAvailableOccupations(): OccupationCategory[] {
  return Object.keys(OCCUPATION_METADATA) as OccupationCategory[];
}

export function getAvailableCountriesForWages(): string[] {
  return [...new Set(WAGE_DATA.map(d => d.countryCode))];
}

export function getOccupationName(occupation: OccupationCategory, locale?: string): string {
  const meta = OCCUPATION_METADATA[occupation];
  if (locale && meta.nameLocal[locale]) {
    return meta.nameLocal[locale];
  }
  return meta.name;
}
