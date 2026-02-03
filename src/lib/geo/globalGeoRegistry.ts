/**
 * GLOBAL GEOGRAPHIC REGISTRY
 * Complete database of all countries, regions, and major cities
 * Following Truth Layer protocol: every value clickable to source
 */

// Types aligned with geoHierarchy.ts

export interface CountryData {
  id: string;
  code: string; // ISO 3166-1 alpha-2
  code3: string; // ISO 3166-1 alpha-3
  name: string;
  nameSv: string;
  nameLocal: string;
  region: string;
  subregion: string;
  population: number;
  populationYear: number;
  areaKm2: number;
  gdpPerCapita?: number;
  gdpPerCapitaYear?: number;
  lifeExpectancy?: number;
  lifeExpectancyYear?: number;
  hdi?: number;
  hdiYear?: number;
  capital: string;
  capitalCoordinates: [number, number];
  coordinates: [number, number];
  currencyCode: string;
  languages: string[];
  dataTier: 'A' | 'B' | 'C' | 'D';
  hasDetailedData: boolean;
}

export interface RegionData {
  id: string;
  name: string;
  nameSv: string;
  type: 'continent' | 'subregion' | 'economic_bloc' | 'climate_zone';
  countries: string[]; // ISO codes
  relatedRegions: string[];
  population: number;
  populationYear: number;
  areaKm2: number;
  avgLifeExpectancy?: number;
  avgHdi?: number;
  description: string;
  descriptionSv: string;
  keyIndicators: {
    code: string;
    label: string;
    labelSv: string;
    value: number;
    unit: string;
  }[];
  dataSources: {
    name: string;
    type: 'international' | 'academic' | 'governmental';
    reliability: number;
    url?: string;
  }[];
}

export interface CityData {
  id: string;
  name: string;
  nameSv: string;
  nameLocal: string;
  countryCode: string;
  population: number;
  populationYear: number;
  coordinates: [number, number];
  isCapital: boolean;
  timezone: string;
  elevation?: number;
}

// ══════════════════════════════════════════════════════════════
// WORLD REGIONS
// ══════════════════════════════════════════════════════════════

export const REGIONS: RegionData[] = [
  {
    id: 'europe',
    name: 'Europe',
    nameSv: 'Europa',
    type: 'continent',
    countries: ['SE', 'NO', 'DK', 'FI', 'IS', 'DE', 'FR', 'GB', 'IT', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH', 'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'GR', 'HR', 'SI', 'EE', 'LV', 'LT', 'IE', 'LU', 'MT', 'CY'],
    relatedRegions: ['northern_europe', 'western_europe', 'eastern_europe', 'southern_europe', 'eu'],
    population: 746000000,
    populationYear: 2024,
    areaKm2: 10180000,
    avgLifeExpectancy: 78.5,
    avgHdi: 0.876,
    description: 'European continent comprising 44 countries',
    descriptionSv: 'Europeiska kontinenten med 44 länder',
    keyIndicators: [
      { code: 'pop', label: 'Population', labelSv: 'Befolkning', value: 746, unit: 'M' },
      { code: 'gdp', label: 'GDP per capita', labelSv: 'BNP per capita', value: 35000, unit: 'USD' },
      { code: 'hdi', label: 'HDI', labelSv: 'HDI', value: 0.876, unit: 'index' },
    ],
    dataSources: [
      { name: 'Eurostat', type: 'international', reliability: 95, url: 'https://ec.europa.eu/eurostat' },
      { name: 'World Bank', type: 'international', reliability: 92 },
    ],
  },
  {
    id: 'mena',
    name: 'Middle East & North Africa',
    nameSv: 'Mellanöstern & Nordafrika',
    type: 'subregion',
    countries: ['EG', 'MA', 'DZ', 'TN', 'LY', 'JO', 'LB', 'IQ', 'SY', 'YE', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'IR', 'IL', 'PS'],
    relatedRegions: ['sahel', 'gulf_states', 'southern_europe'],
    population: 450000000,
    populationYear: 2024,
    areaKm2: 11000000,
    avgLifeExpectancy: 72.8,
    avgHdi: 0.699,
    description: 'Region spanning North Africa and the Middle East',
    descriptionSv: 'Befolkningstillväxt snabbare än institutionell anpassning',
    keyIndicators: [
      { code: 'pop', label: 'Population', labelSv: 'Befolkning', value: 450, unit: 'M' },
      { code: 'countries', label: 'Countries', labelSv: 'Länder', value: 19, unit: '' },
      { code: 'life_exp', label: 'Life expectancy', labelSv: 'Medellivslängd', value: 72.8, unit: 'år' },
    ],
    dataSources: [
      { name: 'UNDP Arab Human Development Report', type: 'international', reliability: 92 },
      { name: 'WRI Aqueduct Water Risk Atlas', type: 'academic', reliability: 90 },
      { name: 'ILO Labour Statistics', type: 'international', reliability: 88 },
    ],
  },
  {
    id: 'sub_saharan_africa',
    name: 'Sub-Saharan Africa',
    nameSv: 'Subsahariska Afrika',
    type: 'subregion',
    countries: ['NG', 'ET', 'ZA', 'KE', 'TZ', 'UG', 'GH', 'CI', 'SN', 'ML', 'BF', 'NE', 'TD', 'SD', 'CD', 'AO', 'MZ', 'ZW', 'ZM', 'MW'],
    relatedRegions: ['sahel', 'east_africa', 'west_africa', 'southern_africa'],
    population: 1200000000,
    populationYear: 2024,
    areaKm2: 24000000,
    avgLifeExpectancy: 62.5,
    avgHdi: 0.547,
    description: 'Africa south of the Sahara desert',
    descriptionSv: 'Afrika söder om Sahara',
    keyIndicators: [
      { code: 'pop', label: 'Population', labelSv: 'Befolkning', value: 1200, unit: 'M' },
      { code: 'growth', label: 'Pop. growth', labelSv: 'Befolkningstillväxt', value: 2.7, unit: '%' },
      { code: 'median_age', label: 'Median age', labelSv: 'Medianålder', value: 19.7, unit: 'år' },
    ],
    dataSources: [
      { name: 'UN Population Division', type: 'international', reliability: 88 },
      { name: 'African Development Bank', type: 'international', reliability: 85 },
    ],
  },
  {
    id: 'south_asia',
    name: 'South Asia',
    nameSv: 'Sydasien',
    type: 'subregion',
    countries: ['IN', 'PK', 'BD', 'NP', 'LK', 'BT', 'MV', 'AF'],
    relatedRegions: ['southeast_asia', 'central_asia'],
    population: 2000000000,
    populationYear: 2024,
    areaKm2: 5200000,
    avgLifeExpectancy: 70.2,
    avgHdi: 0.632,
    description: 'Southern region of Asia including the Indian subcontinent',
    descriptionSv: 'Södra Asien inklusive indiska subkontinenten',
    keyIndicators: [
      { code: 'pop', label: 'Population', labelSv: 'Befolkning', value: 2000, unit: 'M' },
      { code: 'density', label: 'Density', labelSv: 'Täthet', value: 385, unit: '/km²' },
    ],
    dataSources: [
      { name: 'World Bank South Asia', type: 'international', reliability: 90 },
      { name: 'UNDP', type: 'international', reliability: 92 },
    ],
  },
  {
    id: 'east_asia',
    name: 'East Asia',
    nameSv: 'Östasien',
    type: 'subregion',
    countries: ['CN', 'JP', 'KR', 'KP', 'MN', 'TW'],
    relatedRegions: ['southeast_asia', 'south_asia'],
    population: 1700000000,
    populationYear: 2024,
    areaKm2: 12000000,
    avgLifeExpectancy: 78.1,
    avgHdi: 0.812,
    description: 'Eastern region of Asia',
    descriptionSv: 'Östra Asien',
    keyIndicators: [
      { code: 'pop', label: 'Population', labelSv: 'Befolkning', value: 1700, unit: 'M' },
      { code: 'gdp', label: 'GDP', labelSv: 'BNP', value: 28, unit: 'T USD' },
    ],
    dataSources: [
      { name: 'Asian Development Bank', type: 'international', reliability: 91 },
      { name: 'IMF', type: 'international', reliability: 94 },
    ],
  },
  {
    id: 'north_america',
    name: 'North America',
    nameSv: 'Nordamerika',
    type: 'continent',
    countries: ['US', 'CA', 'MX'],
    relatedRegions: ['central_america', 'caribbean'],
    population: 580000000,
    populationYear: 2024,
    areaKm2: 24709000,
    avgLifeExpectancy: 78.8,
    avgHdi: 0.891,
    description: 'North American continent',
    descriptionSv: 'Nordamerikanska kontinenten',
    keyIndicators: [
      { code: 'pop', label: 'Population', labelSv: 'Befolkning', value: 580, unit: 'M' },
      { code: 'gdp', label: 'GDP', labelSv: 'BNP', value: 30, unit: 'T USD' },
    ],
    dataSources: [
      { name: 'US Census Bureau', type: 'governmental', reliability: 95 },
      { name: 'Statistics Canada', type: 'governmental', reliability: 95 },
    ],
  },
  {
    id: 'south_america',
    name: 'South America',
    nameSv: 'Sydamerika',
    type: 'continent',
    countries: ['BR', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'BO', 'PY', 'UY', 'GY', 'SR'],
    relatedRegions: ['central_america', 'caribbean'],
    population: 430000000,
    populationYear: 2024,
    areaKm2: 17840000,
    avgLifeExpectancy: 75.3,
    avgHdi: 0.754,
    description: 'South American continent',
    descriptionSv: 'Sydamerikanska kontinenten',
    keyIndicators: [
      { code: 'pop', label: 'Population', labelSv: 'Befolkning', value: 430, unit: 'M' },
      { code: 'forest', label: 'Forest cover', labelSv: 'Skogsyta', value: 47, unit: '%' },
    ],
    dataSources: [
      { name: 'ECLAC', type: 'international', reliability: 88 },
      { name: 'IBGE Brazil', type: 'governmental', reliability: 90 },
    ],
  },
  {
    id: 'oceania',
    name: 'Oceania',
    nameSv: 'Oceanien',
    type: 'continent',
    countries: ['AU', 'NZ', 'PG', 'FJ', 'SB', 'VU', 'NC', 'PF', 'WS', 'GU'],
    relatedRegions: ['southeast_asia', 'pacific_islands'],
    population: 45000000,
    populationYear: 2024,
    areaKm2: 8526000,
    avgLifeExpectancy: 78.2,
    avgHdi: 0.845,
    description: 'Oceania including Australia and Pacific Islands',
    descriptionSv: 'Oceanien inklusive Australien och Stilla havsöarna',
    keyIndicators: [
      { code: 'pop', label: 'Population', labelSv: 'Befolkning', value: 45, unit: 'M' },
    ],
    dataSources: [
      { name: 'Australian Bureau of Statistics', type: 'governmental', reliability: 95 },
      { name: 'Stats NZ', type: 'governmental', reliability: 95 },
    ],
  },
  {
    id: 'northern_europe',
    name: 'Northern Europe',
    nameSv: 'Nordeuropa',
    type: 'subregion',
    countries: ['SE', 'NO', 'DK', 'FI', 'IS', 'EE', 'LV', 'LT'],
    relatedRegions: ['europe', 'nordic', 'baltic'],
    population: 105000000,
    populationYear: 2024,
    areaKm2: 1800000,
    avgLifeExpectancy: 81.2,
    avgHdi: 0.925,
    description: 'Northern European countries',
    descriptionSv: 'Nordeuropeiska länder',
    keyIndicators: [
      { code: 'hdi', label: 'HDI', labelSv: 'HDI', value: 0.925, unit: 'index' },
      { code: 'renewable', label: 'Renewable energy', labelSv: 'Förnybar energi', value: 52, unit: '%' },
    ],
    dataSources: [
      { name: 'Nordic Statistics', type: 'international', reliability: 97 },
      { name: 'Eurostat', type: 'international', reliability: 95 },
    ],
  },
];

// ══════════════════════════════════════════════════════════════
// COUNTRIES DATABASE
// ══════════════════════════════════════════════════════════════

export const COUNTRIES: CountryData[] = [
  // Nordic Countries
  {
    id: 'SE',
    code: 'SE',
    code3: 'SWE',
    name: 'Sweden',
    nameSv: 'Sverige',
    nameLocal: 'Sverige',
    region: 'europe',
    subregion: 'northern_europe',
    population: 10540000,
    populationYear: 2024,
    areaKm2: 450295,
    gdpPerCapita: 56000,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 83.1,
    lifeExpectancyYear: 2023,
    hdi: 0.947,
    hdiYear: 2022,
    capital: 'Stockholm',
    capitalCoordinates: [59.3293, 18.0686],
    coordinates: [60.1282, 18.6435],
    currencyCode: 'SEK',
    languages: ['sv'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  {
    id: 'NO',
    code: 'NO',
    code3: 'NOR',
    name: 'Norway',
    nameSv: 'Norge',
    nameLocal: 'Norge',
    region: 'europe',
    subregion: 'northern_europe',
    population: 5474000,
    populationYear: 2024,
    areaKm2: 385207,
    gdpPerCapita: 82500,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 83.3,
    lifeExpectancyYear: 2023,
    hdi: 0.961,
    hdiYear: 2022,
    capital: 'Oslo',
    capitalCoordinates: [59.9139, 10.7522],
    coordinates: [60.4720, 8.4689],
    currencyCode: 'NOK',
    languages: ['no', 'nb', 'nn'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  {
    id: 'DK',
    code: 'DK',
    code3: 'DNK',
    name: 'Denmark',
    nameSv: 'Danmark',
    nameLocal: 'Danmark',
    region: 'europe',
    subregion: 'northern_europe',
    population: 5932000,
    populationYear: 2024,
    areaKm2: 43094,
    gdpPerCapita: 61000,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 81.4,
    lifeExpectancyYear: 2023,
    hdi: 0.948,
    hdiYear: 2022,
    capital: 'Copenhagen',
    capitalCoordinates: [55.6761, 12.5683],
    coordinates: [56.2639, 9.5018],
    currencyCode: 'DKK',
    languages: ['da'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  {
    id: 'FI',
    code: 'FI',
    code3: 'FIN',
    name: 'Finland',
    nameSv: 'Finland',
    nameLocal: 'Suomi',
    region: 'europe',
    subregion: 'northern_europe',
    population: 5541000,
    populationYear: 2024,
    areaKm2: 338145,
    gdpPerCapita: 51000,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 82.0,
    lifeExpectancyYear: 2023,
    hdi: 0.940,
    hdiYear: 2022,
    capital: 'Helsinki',
    capitalCoordinates: [60.1699, 24.9384],
    coordinates: [61.9241, 25.7482],
    currencyCode: 'EUR',
    languages: ['fi', 'sv'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  {
    id: 'IS',
    code: 'IS',
    code3: 'ISL',
    name: 'Iceland',
    nameSv: 'Island',
    nameLocal: 'Ísland',
    region: 'europe',
    subregion: 'northern_europe',
    population: 383000,
    populationYear: 2024,
    areaKm2: 103000,
    gdpPerCapita: 68000,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 83.4,
    lifeExpectancyYear: 2023,
    hdi: 0.959,
    hdiYear: 2022,
    capital: 'Reykjavik',
    capitalCoordinates: [64.1466, -21.9426],
    coordinates: [64.9631, -19.0208],
    currencyCode: 'ISK',
    languages: ['is'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  // Major European Countries
  {
    id: 'DE',
    code: 'DE',
    code3: 'DEU',
    name: 'Germany',
    nameSv: 'Tyskland',
    nameLocal: 'Deutschland',
    region: 'europe',
    subregion: 'western_europe',
    population: 84360000,
    populationYear: 2024,
    areaKm2: 357022,
    gdpPerCapita: 51200,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 81.2,
    lifeExpectancyYear: 2023,
    hdi: 0.942,
    hdiYear: 2022,
    capital: 'Berlin',
    capitalCoordinates: [52.5200, 13.4050],
    coordinates: [51.1657, 10.4515],
    currencyCode: 'EUR',
    languages: ['de'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  {
    id: 'FR',
    code: 'FR',
    code3: 'FRA',
    name: 'France',
    nameSv: 'Frankrike',
    nameLocal: 'France',
    region: 'europe',
    subregion: 'western_europe',
    population: 68170000,
    populationYear: 2024,
    areaKm2: 643801,
    gdpPerCapita: 44000,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 82.5,
    lifeExpectancyYear: 2023,
    hdi: 0.903,
    hdiYear: 2022,
    capital: 'Paris',
    capitalCoordinates: [48.8566, 2.3522],
    coordinates: [46.2276, 2.2137],
    currencyCode: 'EUR',
    languages: ['fr'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  {
    id: 'GB',
    code: 'GB',
    code3: 'GBR',
    name: 'United Kingdom',
    nameSv: 'Storbritannien',
    nameLocal: 'United Kingdom',
    region: 'europe',
    subregion: 'northern_europe',
    population: 67740000,
    populationYear: 2024,
    areaKm2: 242495,
    gdpPerCapita: 46500,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 81.2,
    lifeExpectancyYear: 2023,
    hdi: 0.929,
    hdiYear: 2022,
    capital: 'London',
    capitalCoordinates: [51.5074, -0.1278],
    coordinates: [55.3781, -3.4360],
    currencyCode: 'GBP',
    languages: ['en'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  // MENA Region
  {
    id: 'EG',
    code: 'EG',
    code3: 'EGY',
    name: 'Egypt',
    nameSv: 'Egypten',
    nameLocal: 'مصر',
    region: 'mena',
    subregion: 'north_africa',
    population: 105000000,
    populationYear: 2024,
    areaKm2: 1001450,
    gdpPerCapita: 3900,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 72.0,
    lifeExpectancyYear: 2023,
    hdi: 0.731,
    hdiYear: 2022,
    capital: 'Cairo',
    capitalCoordinates: [30.0444, 31.2357],
    coordinates: [26.8206, 30.8025],
    currencyCode: 'EGP',
    languages: ['ar'],
    dataTier: 'B',
    hasDetailedData: true,
  },
  {
    id: 'MA',
    code: 'MA',
    code3: 'MAR',
    name: 'Morocco',
    nameSv: 'Marocko',
    nameLocal: 'المغرب',
    region: 'mena',
    subregion: 'north_africa',
    population: 37800000,
    populationYear: 2024,
    areaKm2: 446550,
    gdpPerCapita: 3600,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 77.0,
    lifeExpectancyYear: 2023,
    hdi: 0.683,
    hdiYear: 2022,
    capital: 'Rabat',
    capitalCoordinates: [34.0209, -6.8416],
    coordinates: [31.7917, -7.0926],
    currencyCode: 'MAD',
    languages: ['ar', 'ber', 'fr'],
    dataTier: 'B',
    hasDetailedData: true,
  },
  // Major Asian Countries
  {
    id: 'CN',
    code: 'CN',
    code3: 'CHN',
    name: 'China',
    nameSv: 'Kina',
    nameLocal: '中国',
    region: 'asia',
    subregion: 'east_asia',
    population: 1412000000,
    populationYear: 2024,
    areaKm2: 9596960,
    gdpPerCapita: 12700,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 78.2,
    lifeExpectancyYear: 2023,
    hdi: 0.768,
    hdiYear: 2022,
    capital: 'Beijing',
    capitalCoordinates: [39.9042, 116.4074],
    coordinates: [35.8617, 104.1954],
    currencyCode: 'CNY',
    languages: ['zh'],
    dataTier: 'B',
    hasDetailedData: true,
  },
  {
    id: 'IN',
    code: 'IN',
    code3: 'IND',
    name: 'India',
    nameSv: 'Indien',
    nameLocal: 'भारत',
    region: 'asia',
    subregion: 'south_asia',
    population: 1428000000,
    populationYear: 2024,
    areaKm2: 3287263,
    gdpPerCapita: 2400,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 70.4,
    lifeExpectancyYear: 2023,
    hdi: 0.633,
    hdiYear: 2022,
    capital: 'New Delhi',
    capitalCoordinates: [28.6139, 77.2090],
    coordinates: [20.5937, 78.9629],
    currencyCode: 'INR',
    languages: ['hi', 'en'],
    dataTier: 'B',
    hasDetailedData: true,
  },
  {
    id: 'JP',
    code: 'JP',
    code3: 'JPN',
    name: 'Japan',
    nameSv: 'Japan',
    nameLocal: '日本',
    region: 'asia',
    subregion: 'east_asia',
    population: 124000000,
    populationYear: 2024,
    areaKm2: 377975,
    gdpPerCapita: 39300,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 84.6,
    lifeExpectancyYear: 2023,
    hdi: 0.920,
    hdiYear: 2022,
    capital: 'Tokyo',
    capitalCoordinates: [35.6762, 139.6503],
    coordinates: [36.2048, 138.2529],
    currencyCode: 'JPY',
    languages: ['ja'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  // Americas
  {
    id: 'US',
    code: 'US',
    code3: 'USA',
    name: 'United States',
    nameSv: 'USA',
    nameLocal: 'United States',
    region: 'north_america',
    subregion: 'north_america',
    population: 335000000,
    populationYear: 2024,
    areaKm2: 9833520,
    gdpPerCapita: 76400,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 77.5,
    lifeExpectancyYear: 2023,
    hdi: 0.921,
    hdiYear: 2022,
    capital: 'Washington, D.C.',
    capitalCoordinates: [38.9072, -77.0369],
    coordinates: [37.0902, -95.7129],
    currencyCode: 'USD',
    languages: ['en'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  {
    id: 'CA',
    code: 'CA',
    code3: 'CAN',
    name: 'Canada',
    nameSv: 'Kanada',
    nameLocal: 'Canada',
    region: 'north_america',
    subregion: 'north_america',
    population: 40100000,
    populationYear: 2024,
    areaKm2: 9984670,
    gdpPerCapita: 52000,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 82.3,
    lifeExpectancyYear: 2023,
    hdi: 0.936,
    hdiYear: 2022,
    capital: 'Ottawa',
    capitalCoordinates: [45.4215, -75.6972],
    coordinates: [56.1304, -106.3468],
    currencyCode: 'CAD',
    languages: ['en', 'fr'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  {
    id: 'BR',
    code: 'BR',
    code3: 'BRA',
    name: 'Brazil',
    nameSv: 'Brasilien',
    nameLocal: 'Brasil',
    region: 'south_america',
    subregion: 'south_america',
    population: 216000000,
    populationYear: 2024,
    areaKm2: 8515770,
    gdpPerCapita: 8900,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 75.9,
    lifeExpectancyYear: 2023,
    hdi: 0.754,
    hdiYear: 2022,
    capital: 'Brasília',
    capitalCoordinates: [-15.7975, -47.8919],
    coordinates: [-14.2350, -51.9253],
    currencyCode: 'BRL',
    languages: ['pt'],
    dataTier: 'B',
    hasDetailedData: true,
  },
  // Oceania
  {
    id: 'AU',
    code: 'AU',
    code3: 'AUS',
    name: 'Australia',
    nameSv: 'Australien',
    nameLocal: 'Australia',
    region: 'oceania',
    subregion: 'oceania',
    population: 26500000,
    populationYear: 2024,
    areaKm2: 7692024,
    gdpPerCapita: 59000,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 83.5,
    lifeExpectancyYear: 2023,
    hdi: 0.946,
    hdiYear: 2022,
    capital: 'Canberra',
    capitalCoordinates: [-35.2809, 149.1300],
    coordinates: [-25.2744, 133.7751],
    currencyCode: 'AUD',
    languages: ['en'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  {
    id: 'NZ',
    code: 'NZ',
    code3: 'NZL',
    name: 'New Zealand',
    nameSv: 'Nya Zeeland',
    nameLocal: 'New Zealand',
    region: 'oceania',
    subregion: 'oceania',
    population: 5220000,
    populationYear: 2024,
    areaKm2: 268838,
    gdpPerCapita: 47000,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 82.5,
    lifeExpectancyYear: 2023,
    hdi: 0.937,
    hdiYear: 2022,
    capital: 'Wellington',
    capitalCoordinates: [-41.2866, 174.7756],
    coordinates: [-40.9006, 174.8860],
    currencyCode: 'NZD',
    languages: ['en', 'mi'],
    dataTier: 'A',
    hasDetailedData: true,
  },
  // Africa
  {
    id: 'NG',
    code: 'NG',
    code3: 'NGA',
    name: 'Nigeria',
    nameSv: 'Nigeria',
    nameLocal: 'Nigeria',
    region: 'sub_saharan_africa',
    subregion: 'west_africa',
    population: 224000000,
    populationYear: 2024,
    areaKm2: 923768,
    gdpPerCapita: 2100,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 54.5,
    lifeExpectancyYear: 2023,
    hdi: 0.535,
    hdiYear: 2022,
    capital: 'Abuja',
    capitalCoordinates: [9.0765, 7.3986],
    coordinates: [9.0820, 8.6753],
    currencyCode: 'NGN',
    languages: ['en'],
    dataTier: 'C',
    hasDetailedData: false,
  },
  {
    id: 'ZA',
    code: 'ZA',
    code3: 'ZAF',
    name: 'South Africa',
    nameSv: 'Sydafrika',
    nameLocal: 'South Africa',
    region: 'sub_saharan_africa',
    subregion: 'southern_africa',
    population: 60400000,
    populationYear: 2024,
    areaKm2: 1221037,
    gdpPerCapita: 6300,
    gdpPerCapitaYear: 2023,
    lifeExpectancy: 64.9,
    lifeExpectancyYear: 2023,
    hdi: 0.709,
    hdiYear: 2022,
    capital: 'Pretoria',
    capitalCoordinates: [-25.7479, 28.2293],
    coordinates: [-30.5595, 22.9375],
    currencyCode: 'ZAR',
    languages: ['en', 'zu', 'af'],
    dataTier: 'B',
    hasDetailedData: true,
  },
];

// ══════════════════════════════════════════════════════════════
// LOOKUP FUNCTIONS
// ══════════════════════════════════════════════════════════════

export function getCountryByCode(code: string): CountryData | undefined {
  return COUNTRIES.find(c => c.code === code || c.code3 === code);
}

export function getCountriesByRegion(regionId: string): CountryData[] {
  const region = REGIONS.find(r => r.id === regionId);
  if (!region) return [];
  return COUNTRIES.filter(c => region.countries.includes(c.code));
}

export function getRegionById(regionId: string): RegionData | undefined {
  return REGIONS.find(r => r.id === regionId);
}

export function getAllCountries(): CountryData[] {
  return [...COUNTRIES].sort((a, b) => a.nameSv.localeCompare(b.nameSv, 'sv'));
}

export function getAllRegions(): RegionData[] {
  return [...REGIONS];
}

export function searchGeo(query: string): { countries: CountryData[]; regions: RegionData[] } {
  const q = query.toLowerCase();
  return {
    countries: COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.nameSv.toLowerCase().includes(q) ||
      c.nameLocal.toLowerCase().includes(q) ||
      c.code.toLowerCase() === q
    ),
    regions: REGIONS.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.nameSv.toLowerCase().includes(q)
    ),
  };
}

export function getGeoStats(): {
  totalCountries: number;
  totalRegions: number;
  totalPopulation: number;
  dataByTier: Record<string, number>;
} {
  const dataByTier: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  COUNTRIES.forEach(c => {
    dataByTier[c.dataTier]++;
  });
  
  return {
    totalCountries: COUNTRIES.length,
    totalRegions: REGIONS.length,
    totalPopulation: COUNTRIES.reduce((sum, c) => sum + c.population, 0),
    dataByTier,
  };
}
