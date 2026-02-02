/**
 * GLOBAL DATA MAP ENGINE (GDME)
 * 
 * "Visa strukturella skillnader mellan länder – på ett sätt som går att förstå, jämföra och ifrågasätta."
 * 
 * Detta är inte en värderingskarta. Det är en mät- och jämförelsekarta.
 */

// === 1. CORE PRINCIPLES (UNBREAKABLE) ===

export const MAP_PRINCIPLES = [
  { sv: 'Endast aggregerad data på landsnivå eller högre', en: 'Only aggregated data at country level or higher' },
  { sv: 'Endast definierade, mätbara indikatorer', en: 'Only defined, measurable indicators' },
  { sv: 'Alltid tydlig osäkerhet', en: 'Always clear uncertainty' },
  { sv: 'Inga individattribut', en: 'No individual attributes' },
  { sv: 'Ingen normativ färgsättning', en: 'No normative coloring' }
];

export const MAP_CORE_MESSAGE = {
  sv: 'Kartan visar mönster, inte människor.',
  en: 'The map shows patterns, not people.'
};

// === 2. COLOR SYSTEM (NEUTRAL GRADIENT) ===

export const COLOR_LEVELS = [
  { level: 1, label: 'Mycket låg nivå', labelEn: 'Very low level', color: 'hsl(220, 15%, 85%)' },
  { level: 2, label: 'Låg nivå', labelEn: 'Low level', color: 'hsl(220, 40%, 70%)' },
  { level: 3, label: 'Medelnivå', labelEn: 'Medium level', color: 'hsl(230, 55%, 55%)' },
  { level: 4, label: 'Hög nivå', labelEn: 'High level', color: 'hsl(260, 60%, 50%)' },
  { level: 5, label: 'Mycket hög nivå', labelEn: 'Very high level', color: 'hsl(280, 65%, 40%)' }
];

export const COLOR_FORBIDDEN = [
  { sv: 'Rött = dåligt', en: 'Red = bad' },
  { sv: 'Grönt = bra', en: 'Green = good' },
  { sv: 'Regnbågsfärger för värdering', en: 'Rainbow colors for valuation' }
];

export const COLOR_PRINCIPLE = {
  sv: 'Färg = nivå, inte värde.',
  en: 'Color = level, not value.'
};

// === 3. INDICATOR CATEGORIES ===

export type IndicatorCategory = 'economy' | 'religion' | 'lgbtq' | 'culture';

export interface MapIndicator {
  id: string;
  category: IndicatorCategory;
  label: string;
  labelSv: string;
  description: string;
  descriptionSv: string;
  unit: string;
  dataNote?: string;
  dataNoteSv?: string;
  sensitivity: 'low' | 'medium' | 'high';
  inverted?: boolean; // Higher value = lower on scale
}

export const INDICATOR_CATEGORIES: { id: IndicatorCategory; label: string; labelSv: string; icon: string }[] = [
  { id: 'economy', label: 'Economy', labelSv: 'Ekonomi', icon: '💰' },
  { id: 'religion', label: 'Religion', labelSv: 'Religion', icon: '🕊️' },
  { id: 'lgbtq', label: 'LGBTQ+ Rights & Openness', labelSv: 'HBTQ+ Rättigheter & Öppenhet', icon: '🏳️‍🌈' },
  { id: 'culture', label: 'Cultural Structures', labelSv: 'Kulturella strukturer', icon: '🏛️' }
];

export const MAP_INDICATORS: MapIndicator[] = [
  // ECONOMY
  {
    id: 'gdp_per_capita',
    category: 'economy',
    label: 'GDP per capita',
    labelSv: 'BNP per capita',
    description: 'Economic output per person, PPP adjusted',
    descriptionSv: 'Ekonomisk produktion per person, PPP-justerad',
    unit: 'USD',
    sensitivity: 'low'
  },
  {
    id: 'income_inequality',
    category: 'economy',
    label: 'Income inequality (Gini)',
    labelSv: 'Inkomstfördelning (Gini)',
    description: 'Distribution of income within the population',
    descriptionSv: 'Fördelning av inkomst inom befolkningen',
    unit: 'index',
    sensitivity: 'low'
  },
  {
    id: 'government_debt',
    category: 'economy',
    label: 'Government debt to GDP',
    labelSv: 'Statsskuld i förhållande till BNP',
    description: 'Total government debt as percentage of GDP',
    descriptionSv: 'Total statsskuld som andel av BNP',
    unit: '%',
    sensitivity: 'low'
  },
  {
    id: 'energy_cost',
    category: 'economy',
    label: 'Energy cost index',
    labelSv: 'Energikostnadsindex',
    description: 'Cost of energy relative to income',
    descriptionSv: 'Energikostnad relativt inkomst',
    unit: 'index',
    sensitivity: 'low'
  },
  
  // RELIGION
  {
    id: 'religious_affiliation',
    category: 'religion',
    label: 'Reported religious affiliation',
    labelSv: 'Rapporterad religiös tillhörighet',
    description: 'Share of population reporting religious affiliation in surveys',
    descriptionSv: 'Andel av befolkningen som uppger religiös tillhörighet i undersökningar',
    unit: '%',
    dataNote: 'Shows self-reported religious affiliation according to available surveys.',
    dataNoteSv: 'Visar självrapporterad religiös tillhörighet enligt tillgängliga undersökningar.',
    sensitivity: 'medium'
  },
  {
    id: 'religious_participation',
    category: 'religion',
    label: 'Religious participation',
    labelSv: 'Religionsdeltagande',
    description: 'Regular attendance at religious services (self-reported)',
    descriptionSv: 'Regelbundet deltagande i religiösa sammankomster (självrapporterat)',
    unit: '%',
    sensitivity: 'medium'
  },
  {
    id: 'religion_in_law',
    category: 'religion',
    label: 'Religion in legislation',
    labelSv: 'Religion i lagstiftning',
    description: 'Degree to which religion influences legal framework',
    descriptionSv: 'I vilken grad religion påverkar juridiskt ramverk',
    unit: 'index',
    sensitivity: 'medium'
  },
  
  // LGBTQ+ (VERY SENSITIVE)
  {
    id: 'lgbtq_openness',
    category: 'lgbtq',
    label: 'Reported openness / acceptance of same-sex orientation',
    labelSv: 'Rapporterad öppenhet / acceptans av samkönad läggning',
    description: 'Share openly identifying in surveys - NOT actual prevalence',
    descriptionSv: 'Andel som öppet identifierar sig i undersökningar – INTE faktisk förekomst',
    unit: '%',
    dataNote: 'Low values may reflect low openness rather than actual occurrence.',
    dataNoteSv: 'Låga värden kan spegla låg öppenhet snarare än faktisk förekomst.',
    sensitivity: 'high'
  },
  {
    id: 'lgbtq_legal_status',
    category: 'lgbtq',
    label: 'LGBTQ+ legal status',
    labelSv: 'HBTQ+ juridisk status',
    description: 'Legal rights and protections for LGBTQ+ individuals',
    descriptionSv: 'Juridiska rättigheter och skydd för HBTQ+-individer',
    unit: 'index',
    sensitivity: 'high'
  },
  {
    id: 'lgbtq_social_acceptance',
    category: 'lgbtq',
    label: 'Social acceptance (survey)',
    labelSv: 'Social acceptans (undersökning)',
    description: 'Public attitudes toward LGBTQ+ individuals in surveys',
    descriptionSv: 'Allmänhetens attityder gentemot HBTQ+-individer i undersökningar',
    unit: 'index',
    sensitivity: 'high'
  },
  {
    id: 'lgbtq_discrimination',
    category: 'lgbtq',
    label: 'Reported discrimination',
    labelSv: 'Rapporterad diskriminering',
    description: 'Level of reported discrimination against LGBTQ+ individuals',
    descriptionSv: 'Nivå av rapporterad diskriminering mot HBTQ+-individer',
    unit: 'index',
    inverted: true,
    sensitivity: 'high'
  },
  
  // CULTURE
  {
    id: 'individualism',
    category: 'culture',
    label: 'Individualism index',
    labelSv: 'Individualismindex',
    description: 'Degree of individualism vs collectivism (Hofstede)',
    descriptionSv: 'Grad av individualism vs kollektivism (Hofstede)',
    unit: 'index',
    sensitivity: 'low'
  },
  {
    id: 'social_trust',
    category: 'culture',
    label: 'Social trust',
    labelSv: 'Social tillit',
    description: 'General trust in other people (survey)',
    descriptionSv: 'Generellt förtroende för andra människor (undersökning)',
    unit: '%',
    sensitivity: 'low'
  },
  {
    id: 'urbanization',
    category: 'culture',
    label: 'Urbanization rate',
    labelSv: 'Urbaniseringsgrad',
    description: 'Share of population living in urban areas',
    descriptionSv: 'Andel av befolkning som bor i urbana områden',
    unit: '%',
    sensitivity: 'low'
  }
];

// === 4. COMPARISON MODES ===

export interface ComparisonMode {
  id: string;
  label: string;
  labelSv: string;
  description: string;
  descriptionSv: string;
}

export const COMPARISON_MODES: ComparisonMode[] = [
  {
    id: 'absolute',
    label: 'Absolute level',
    labelSv: 'Absolut nivå',
    description: 'Actual values',
    descriptionSv: 'Faktiska värden'
  },
  {
    id: 'relative_global',
    label: 'Relative to global average',
    labelSv: 'Relativt globalt snitt',
    description: 'Difference from world average',
    descriptionSv: 'Skillnad från världsgenomsnittet'
  },
  {
    id: 'change_over_time',
    label: 'Change over time',
    labelSv: 'Förändring över tid',
    description: 'How values have changed',
    descriptionSv: 'Hur värden har förändrats'
  }
];

// === 5. COUNTRY DATA ===

export interface CountryMapData {
  code: string;
  name: string;
  nameSv: string;
  region: string;
  regionSv: string;
  indicators: Record<string, {
    value: number;
    year: number;
    uncertainty: number; // 0-100
    source: string;
    coverage: 'full' | 'partial' | 'estimated';
    notes?: string;
  }>;
}

export const REGIONS = [
  { id: 'europe', label: 'Europe', labelSv: 'Europa' },
  { id: 'north_america', label: 'North America', labelSv: 'Nordamerika' },
  { id: 'south_america', label: 'South America', labelSv: 'Sydamerika' },
  { id: 'asia', label: 'Asia', labelSv: 'Asien' },
  { id: 'africa', label: 'Africa', labelSv: 'Afrika' },
  { id: 'oceania', label: 'Oceania', labelSv: 'Oceanien' }
];

// Sample country data
export const COUNTRY_MAP_DATA: CountryMapData[] = [
  {
    code: 'SE',
    name: 'Sweden',
    nameSv: 'Sverige',
    region: 'europe',
    regionSv: 'Europa',
    indicators: {
      gdp_per_capita: { value: 55000, year: 2023, uncertainty: 5, source: 'World Bank', coverage: 'full' },
      income_inequality: { value: 27, year: 2022, uncertainty: 8, source: 'OECD', coverage: 'full' },
      religious_affiliation: { value: 52, year: 2021, uncertainty: 12, source: 'Eurobarometer', coverage: 'full' },
      lgbtq_openness: { value: 72, year: 2022, uncertainty: 15, source: 'ILGA-Europe', coverage: 'full' },
      lgbtq_legal_status: { value: 92, year: 2023, uncertainty: 5, source: 'ILGA', coverage: 'full' },
      social_trust: { value: 64, year: 2022, uncertainty: 10, source: 'World Values Survey', coverage: 'full' },
      individualism: { value: 71, year: 2020, uncertainty: 8, source: 'Hofstede', coverage: 'full' }
    }
  },
  {
    code: 'US',
    name: 'United States',
    nameSv: 'USA',
    region: 'north_america',
    regionSv: 'Nordamerika',
    indicators: {
      gdp_per_capita: { value: 76000, year: 2023, uncertainty: 5, source: 'World Bank', coverage: 'full' },
      income_inequality: { value: 41, year: 2022, uncertainty: 6, source: 'Census Bureau', coverage: 'full' },
      religious_affiliation: { value: 73, year: 2021, uncertainty: 10, source: 'Pew Research', coverage: 'full' },
      lgbtq_openness: { value: 58, year: 2022, uncertainty: 18, source: 'Gallup', coverage: 'full' },
      lgbtq_legal_status: { value: 68, year: 2023, uncertainty: 10, source: 'ILGA', coverage: 'full' },
      social_trust: { value: 38, year: 2022, uncertainty: 12, source: 'GSS', coverage: 'full' },
      individualism: { value: 91, year: 2020, uncertainty: 5, source: 'Hofstede', coverage: 'full' }
    }
  },
  {
    code: 'JP',
    name: 'Japan',
    nameSv: 'Japan',
    region: 'asia',
    regionSv: 'Asien',
    indicators: {
      gdp_per_capita: { value: 42000, year: 2023, uncertainty: 5, source: 'World Bank', coverage: 'full' },
      income_inequality: { value: 33, year: 2022, uncertainty: 8, source: 'OECD', coverage: 'full' },
      religious_affiliation: { value: 36, year: 2021, uncertainty: 15, source: 'NHK Survey', coverage: 'full' },
      lgbtq_openness: { value: 32, year: 2022, uncertainty: 25, source: 'Dentsu', coverage: 'partial', notes: 'Social stigma may affect reporting' },
      lgbtq_legal_status: { value: 42, year: 2023, uncertainty: 8, source: 'ILGA', coverage: 'full' },
      social_trust: { value: 42, year: 2022, uncertainty: 12, source: 'World Values Survey', coverage: 'full' },
      individualism: { value: 46, year: 2020, uncertainty: 8, source: 'Hofstede', coverage: 'full' }
    }
  },
  {
    code: 'BR',
    name: 'Brazil',
    nameSv: 'Brasilien',
    region: 'south_america',
    regionSv: 'Sydamerika',
    indicators: {
      gdp_per_capita: { value: 15000, year: 2023, uncertainty: 8, source: 'World Bank', coverage: 'full' },
      income_inequality: { value: 53, year: 2022, uncertainty: 10, source: 'IBGE', coverage: 'full' },
      religious_affiliation: { value: 88, year: 2021, uncertainty: 8, source: 'IBGE Census', coverage: 'full' },
      lgbtq_openness: { value: 48, year: 2022, uncertainty: 22, source: 'Datafolha', coverage: 'partial' },
      lgbtq_legal_status: { value: 55, year: 2023, uncertainty: 12, source: 'ILGA', coverage: 'full' },
      social_trust: { value: 18, year: 2022, uncertainty: 15, source: 'Latinobarómetro', coverage: 'full' },
      individualism: { value: 38, year: 2020, uncertainty: 10, source: 'Hofstede', coverage: 'full' }
    }
  },
  {
    code: 'NG',
    name: 'Nigeria',
    nameSv: 'Nigeria',
    region: 'africa',
    regionSv: 'Afrika',
    indicators: {
      gdp_per_capita: { value: 5200, year: 2023, uncertainty: 15, source: 'World Bank', coverage: 'partial' },
      income_inequality: { value: 35, year: 2022, uncertainty: 20, source: 'World Bank', coverage: 'estimated' },
      religious_affiliation: { value: 97, year: 2021, uncertainty: 8, source: 'Pew Research', coverage: 'partial' },
      lgbtq_openness: { value: 5, year: 2022, uncertainty: 40, source: 'ILGA', coverage: 'estimated', notes: 'Criminalization severely limits data collection' },
      lgbtq_legal_status: { value: 8, year: 2023, uncertainty: 5, source: 'ILGA', coverage: 'full' },
      social_trust: { value: 22, year: 2022, uncertainty: 18, source: 'Afrobarometer', coverage: 'partial' },
      individualism: { value: 30, year: 2020, uncertainty: 15, source: 'Hofstede', coverage: 'estimated' }
    }
  },
  {
    code: 'DE',
    name: 'Germany',
    nameSv: 'Tyskland',
    region: 'europe',
    regionSv: 'Europa',
    indicators: {
      gdp_per_capita: { value: 52000, year: 2023, uncertainty: 5, source: 'World Bank', coverage: 'full' },
      income_inequality: { value: 32, year: 2022, uncertainty: 6, source: 'Eurostat', coverage: 'full' },
      religious_affiliation: { value: 58, year: 2021, uncertainty: 10, source: 'Eurobarometer', coverage: 'full' },
      lgbtq_openness: { value: 68, year: 2022, uncertainty: 15, source: 'ILGA-Europe', coverage: 'full' },
      lgbtq_legal_status: { value: 88, year: 2023, uncertainty: 5, source: 'ILGA', coverage: 'full' },
      social_trust: { value: 48, year: 2022, uncertainty: 10, source: 'ESS', coverage: 'full' },
      individualism: { value: 67, year: 2020, uncertainty: 6, source: 'Hofstede', coverage: 'full' }
    }
  },
  {
    code: 'IN',
    name: 'India',
    nameSv: 'Indien',
    region: 'asia',
    regionSv: 'Asien',
    indicators: {
      gdp_per_capita: { value: 8400, year: 2023, uncertainty: 10, source: 'World Bank', coverage: 'full' },
      income_inequality: { value: 35, year: 2022, uncertainty: 15, source: 'World Bank', coverage: 'partial' },
      religious_affiliation: { value: 99, year: 2021, uncertainty: 5, source: 'Census', coverage: 'full' },
      lgbtq_openness: { value: 15, year: 2022, uncertainty: 35, source: 'ILGA', coverage: 'estimated', notes: 'Social stigma limits open identification' },
      lgbtq_legal_status: { value: 35, year: 2023, uncertainty: 10, source: 'ILGA', coverage: 'full' },
      social_trust: { value: 32, year: 2022, uncertainty: 15, source: 'World Values Survey', coverage: 'partial' },
      individualism: { value: 48, year: 2020, uncertainty: 10, source: 'Hofstede', coverage: 'full' }
    }
  },
  {
    code: 'AU',
    name: 'Australia',
    nameSv: 'Australien',
    region: 'oceania',
    regionSv: 'Oceanien',
    indicators: {
      gdp_per_capita: { value: 58000, year: 2023, uncertainty: 5, source: 'World Bank', coverage: 'full' },
      income_inequality: { value: 34, year: 2022, uncertainty: 8, source: 'ABS', coverage: 'full' },
      religious_affiliation: { value: 44, year: 2021, uncertainty: 10, source: 'ABS Census', coverage: 'full' },
      lgbtq_openness: { value: 65, year: 2022, uncertainty: 15, source: 'ABS', coverage: 'full' },
      lgbtq_legal_status: { value: 85, year: 2023, uncertainty: 5, source: 'ILGA', coverage: 'full' },
      social_trust: { value: 52, year: 2022, uncertainty: 10, source: 'World Values Survey', coverage: 'full' },
      individualism: { value: 90, year: 2020, uncertainty: 5, source: 'Hofstede', coverage: 'full' }
    }
  }
];

// === 6. DISCLAIMERS ===

export const MAP_DISCLAIMERS = {
  doesNotShow: {
    sv: [
      'Individuella beteenden',
      'Orsaker',
      'Värderingar',
      'Framtida utveckling'
    ],
    en: [
      'Individual behaviors',
      'Causes',
      'Values',
      'Future developments'
    ]
  },
  dataHonestyWarnings: {
    lowCoverage: {
      sv: 'Låg datatäckning i vissa regioner',
      en: 'Low data coverage in some regions'
    },
    censorshipImpact: {
      sv: 'Censur kan påverka rapporterade värden',
      en: 'Censorship may affect reported values'
    },
    surveyBias: {
      sv: 'Undersökningsmetodik kan påverka resultat',
      en: 'Survey methodology may affect results'
    },
    opennessVsOccurrence: {
      sv: 'Låga värden kan spegla låg öppenhet snarare än faktisk förekomst.',
      en: 'Low values may reflect low openness rather than actual occurrence.'
    }
  },
  periodWarning: {
    sv: 'Kortare perioder kan ge missvisande bild.',
    en: 'Shorter periods may give a misleading picture.'
  }
};

// === 7. WHAT THE SYSTEM NEVER DOES ===

export const SYSTEM_NEVER_DOES = [
  { sv: 'Rankar människor', en: 'Ranks people' },
  { sv: 'Pekar ut grupper', en: 'Points out groups' },
  { sv: 'Sätter etiketter på värde', en: 'Labels value' },
  { sv: 'Påstår biologiska skillnader', en: 'Claims biological differences' }
];

export const SYSTEM_IDENTITY = {
  sv: 'Det är ett struktursystem, inte ett identitetssystem.',
  en: 'It is a structure system, not an identity system.'
};

// === 8. HELPER FUNCTIONS ===

export const getColorForValue = (value: number, min: number, max: number): string => {
  const normalized = (value - min) / (max - min);
  const level = Math.min(5, Math.max(1, Math.ceil(normalized * 5)));
  return COLOR_LEVELS[level - 1].color;
};

export const getLevelForValue = (value: number, min: number, max: number): typeof COLOR_LEVELS[0] => {
  const normalized = (value - min) / (max - min);
  const level = Math.min(5, Math.max(1, Math.ceil(normalized * 5)));
  return COLOR_LEVELS[level - 1];
};

export const getIndicatorById = (id: string): MapIndicator | undefined => {
  return MAP_INDICATORS.find(ind => ind.id === id);
};
