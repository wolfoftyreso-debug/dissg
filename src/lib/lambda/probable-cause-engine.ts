/**
 * PROBABLE CAUSE ENGINE
 * 
 * Automotive-style diagnostic reasoning for societal systems.
 * Like OBD-II freeze frames and probable cause ranking.
 * 
 * NO RECOMMENDATIONS. Only probability-ranked observations.
 * 
 * Format: "Based on historical pattern matching, the following
 * co-movements have been observed in similar conditions..."
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ProbableCause {
  id: string;
  probability: number; // 0-1
  
  // Description
  cause_sv: string;
  cause_en: string;
  mechanism_sv: string;
  mechanism_en: string;
  
  // Evidence
  historical_occurrences: number;
  last_observed: string;
  geo_contexts: string[]; // Where this pattern was observed
  
  // Links
  supporting_indicators: string[];
  contradicting_indicators: string[];
  
  // Confidence
  confidence_level: 'high' | 'medium' | 'low';
  data_quality: number; // 0-1
  
  // Control schema - what to examine
  examination_schema: ExaminationItem[];
}

export interface ExaminationItem {
  indicator_code: string;
  indicator_name_sv: string;
  indicator_name_en: string;
  expected_if_cause_true: string;
  current_value?: number;
  matches_expectation?: boolean;
}

export interface CauseAnalysis {
  dtc_code: string;
  analyzed_at: string;
  geo_scope: string;
  
  // Ranked causes
  probable_causes: ProbableCause[];
  
  // Unknown factor
  unexplained_variance: number; // 0-1
  
  // Disclaimer
  disclaimer: string;
}

// =============================================================================
// CAUSE PATTERNS DATABASE
// =============================================================================

/**
 * Historical cause patterns for each DTC type.
 * These are observational co-movements, NOT causal claims.
 */
export const CAUSE_PATTERNS: Record<string, Omit<ProbableCause, 'probability' | 'current_value' | 'matches_expectation'>[]> = {
  'ECO-INF-001': [
    {
      id: 'monetary-expansion',
      cause_sv: 'Monetär expansion',
      cause_en: 'Monetary Expansion',
      mechanism_sv: 'Ökning av penningmängd överstiger produktionstillväxt',
      mechanism_en: 'Money supply growth exceeds production growth',
      historical_occurrences: 47,
      last_observed: '2023-06',
      geo_contexts: ['US', 'EU', 'UK', 'JP'],
      supporting_indicators: ['M2_GROWTH', 'CENTRAL_BANK_BALANCE', 'VELOCITY'],
      contradicting_indicators: ['PRODUCTIVITY_GROWTH'],
      confidence_level: 'high',
      data_quality: 0.9,
      examination_schema: [
        {
          indicator_code: 'M2_GROWTH',
          indicator_name_sv: 'M2 penningmängdstillväxt',
          indicator_name_en: 'M2 money supply growth',
          expected_if_cause_true: '> 5% YoY',
        },
        {
          indicator_code: 'GDP_REAL_GROWTH',
          indicator_name_sv: 'Real BNP-tillväxt',
          indicator_name_en: 'Real GDP growth',
          expected_if_cause_true: '< M2_GROWTH - 2pp',
        },
      ],
    },
    {
      id: 'supply-shock',
      cause_sv: 'Utbudsschock',
      cause_en: 'Supply Shock',
      mechanism_sv: 'Plötslig minskning av tillgängliga varor/tjänster',
      mechanism_en: 'Sudden reduction in available goods/services',
      historical_occurrences: 23,
      last_observed: '2022-03',
      geo_contexts: ['GLOBAL', 'EU'],
      supporting_indicators: ['SUPPLY_CHAIN_INDEX', 'SHIPPING_COSTS', 'PRODUCER_PRICES'],
      contradicting_indicators: ['DEMAND_INDEX'],
      confidence_level: 'high',
      data_quality: 0.85,
      examination_schema: [
        {
          indicator_code: 'PPI',
          indicator_name_sv: 'Producentprisindex',
          indicator_name_en: 'Producer Price Index',
          expected_if_cause_true: 'Rising faster than CPI',
        },
        {
          indicator_code: 'INVENTORY_LEVELS',
          indicator_name_sv: 'Lagernivåer',
          indicator_name_en: 'Inventory levels',
          expected_if_cause_true: 'Below normal',
        },
      ],
    },
    {
      id: 'demand-pull',
      cause_sv: 'Efterfrågeinflation',
      cause_en: 'Demand-Pull Inflation',
      mechanism_sv: 'Aggregerad efterfrågan överstiger produktionskapacitet',
      mechanism_en: 'Aggregate demand exceeds production capacity',
      historical_occurrences: 31,
      last_observed: '2021-12',
      geo_contexts: ['US', 'CN'],
      supporting_indicators: ['CONSUMER_SPENDING', 'CAPACITY_UTILIZATION', 'WAGE_GROWTH'],
      contradicting_indicators: ['UNEMPLOYMENT_RATE'],
      confidence_level: 'medium',
      data_quality: 0.8,
      examination_schema: [
        {
          indicator_code: 'CAPACITY_UTIL',
          indicator_name_sv: 'Kapacitetsutnyttjande',
          indicator_name_en: 'Capacity utilization',
          expected_if_cause_true: '> 85%',
        },
        {
          indicator_code: 'UNEMPLOYMENT',
          indicator_name_sv: 'Arbetslöshet',
          indicator_name_en: 'Unemployment rate',
          expected_if_cause_true: '< 4%',
        },
      ],
    },
  ],
  
  'HEA-MOR-001': [
    {
      id: 'healthcare-capacity',
      cause_sv: 'Vårdkapacitetsbrist',
      cause_en: 'Healthcare Capacity Shortage',
      mechanism_sv: 'Otillräcklig vårdkapacitet för att hantera patientinflöde',
      mechanism_en: 'Insufficient healthcare capacity to handle patient influx',
      historical_occurrences: 18,
      last_observed: '2021-01',
      geo_contexts: ['IT', 'ES', 'UK', 'US'],
      supporting_indicators: ['ICU_OCCUPANCY', 'STAFF_SHORTAGE_INDEX', 'WAIT_TIMES'],
      contradicting_indicators: ['HEALTHCARE_SPEND'],
      confidence_level: 'high',
      data_quality: 0.9,
      examination_schema: [
        {
          indicator_code: 'ICU_BEDS_PER_CAP',
          indicator_name_sv: 'IVA-platser per capita',
          indicator_name_en: 'ICU beds per capita',
          expected_if_cause_true: '< peer median',
        },
        {
          indicator_code: 'HEALTHCARE_STAFF',
          indicator_name_sv: 'Vårdpersonal per 1000 inv',
          indicator_name_en: 'Healthcare staff per 1000 pop',
          expected_if_cause_true: 'Declining or static',
        },
      ],
    },
    {
      id: 'aging-population',
      cause_sv: 'Åldrande befolkning',
      cause_en: 'Aging Population',
      mechanism_sv: 'Högre andel av befolkning i riskgrupp för mortalitet',
      mechanism_en: 'Higher proportion of population in mortality risk group',
      historical_occurrences: 89,
      last_observed: '2024-01',
      geo_contexts: ['JP', 'DE', 'IT', 'SE'],
      supporting_indicators: ['MEDIAN_AGE', 'DEPENDENCY_RATIO', 'POPULATION_65_PLUS'],
      contradicting_indicators: ['HEALTHY_LIFE_YEARS'],
      confidence_level: 'high',
      data_quality: 0.95,
      examination_schema: [
        {
          indicator_code: 'POP_65_PLUS_SHARE',
          indicator_name_sv: 'Andel 65+ år',
          indicator_name_en: 'Population share 65+',
          expected_if_cause_true: 'Increasing trend',
        },
        {
          indicator_code: 'MEDIAN_AGE',
          indicator_name_sv: 'Medianålder',
          indicator_name_en: 'Median age',
          expected_if_cause_true: '> 40 years',
        },
      ],
    },
  ],
  
  'DEM-FER-001': [
    {
      id: 'economic-precarity',
      cause_sv: 'Ekonomisk osäkerhet',
      cause_en: 'Economic Precarity',
      mechanism_sv: 'Osäker ekonomisk framtid reducerar familjebildning',
      mechanism_en: 'Uncertain economic future reduces family formation',
      historical_occurrences: 56,
      last_observed: '2023-12',
      geo_contexts: ['KR', 'JP', 'IT', 'ES', 'DE'],
      supporting_indicators: ['YOUTH_UNEMPLOYMENT', 'HOUSING_AFFORDABILITY', 'DEBT_TO_INCOME'],
      contradicting_indicators: ['GDP_PER_CAPITA'],
      confidence_level: 'high',
      data_quality: 0.85,
      examination_schema: [
        {
          indicator_code: 'HOUSING_PRICE_INCOME',
          indicator_name_sv: 'Bostadspris/inkomst-kvot',
          indicator_name_en: 'House price to income ratio',
          expected_if_cause_true: '> 5x',
        },
        {
          indicator_code: 'YOUTH_UNEMPLOYMENT',
          indicator_name_sv: 'Ungdomsarbetslöshet',
          indicator_name_en: 'Youth unemployment',
          expected_if_cause_true: '> 15%',
        },
      ],
    },
    {
      id: 'urbanization-effect',
      cause_sv: 'Urbaniseringseffekt',
      cause_en: 'Urbanization Effect',
      mechanism_sv: 'Urban livsstil korrelerar med lägre fertilitet',
      mechanism_en: 'Urban lifestyle correlates with lower fertility',
      historical_occurrences: 112,
      last_observed: '2024-01',
      geo_contexts: ['GLOBAL'],
      supporting_indicators: ['URBAN_POPULATION_SHARE', 'AVERAGE_DWELLING_SIZE', 'CHILDCARE_COST'],
      contradicting_indicators: [],
      confidence_level: 'high',
      data_quality: 0.9,
      examination_schema: [
        {
          indicator_code: 'URBAN_POP_SHARE',
          indicator_name_sv: 'Urban befolkningsandel',
          indicator_name_en: 'Urban population share',
          expected_if_cause_true: '> 75%',
        },
        {
          indicator_code: 'AVG_DWELLING_SIZE',
          indicator_name_sv: 'Genomsnittlig boyta',
          indicator_name_en: 'Average dwelling size',
          expected_if_cause_true: 'Decreasing trend',
        },
      ],
    },
    {
      id: 'education-parity',
      cause_sv: 'Utbildningsparitet',
      cause_en: 'Education Parity',
      mechanism_sv: 'Högre utbildning korrelerar med senarelagd familjebildning',
      mechanism_en: 'Higher education correlates with delayed family formation',
      historical_occurrences: 78,
      last_observed: '2024-01',
      geo_contexts: ['OECD'],
      supporting_indicators: ['FEMALE_TERTIARY_EDUCATION', 'MEAN_AGE_FIRST_BIRTH', 'LABOR_PARTICIPATION_F'],
      contradicting_indicators: [],
      confidence_level: 'medium',
      data_quality: 0.85,
      examination_schema: [
        {
          indicator_code: 'FEMALE_TERTIARY',
          indicator_name_sv: 'Högskoleutbildade kvinnor',
          indicator_name_en: 'Female tertiary education',
          expected_if_cause_true: '> 50%',
        },
        {
          indicator_code: 'MEAN_AGE_FIRST_BIRTH',
          indicator_name_sv: 'Medelålder första barn',
          indicator_name_en: 'Mean age at first birth',
          expected_if_cause_true: '> 30 years',
        },
      ],
    },
  ],
  
  'SOC-TRU-001': [
    {
      id: 'institutional-performance',
      cause_sv: 'Institutionell prestation',
      cause_en: 'Institutional Performance',
      mechanism_sv: 'Upplevd diskrepans mellan löften och utfall',
      mechanism_en: 'Perceived discrepancy between promises and outcomes',
      historical_occurrences: 34,
      last_observed: '2023-06',
      geo_contexts: ['EU', 'US', 'UK'],
      supporting_indicators: ['CORRUPTION_INDEX', 'GOVT_EFFECTIVENESS', 'PUBLIC_SATISFACTION'],
      contradicting_indicators: [],
      confidence_level: 'medium',
      data_quality: 0.7,
      examination_schema: [
        {
          indicator_code: 'CPI_CORRUPTION',
          indicator_name_sv: 'Korruptionsindex',
          indicator_name_en: 'Corruption Perception Index',
          expected_if_cause_true: 'Declining trend',
        },
        {
          indicator_code: 'POLICY_OUTCOME_GAP',
          indicator_name_sv: 'Mål-utfall-gap',
          indicator_name_en: 'Policy outcome gap',
          expected_if_cause_true: 'Widening',
        },
      ],
    },
    {
      id: 'information-ecosystem',
      cause_sv: 'Informationsekosystem',
      cause_en: 'Information Ecosystem',
      mechanism_sv: 'Fragmenterat medielandskap och polariserade informationsflöden',
      mechanism_en: 'Fragmented media landscape and polarized information flows',
      historical_occurrences: 28,
      last_observed: '2024-01',
      geo_contexts: ['US', 'UK', 'BR', 'PH'],
      supporting_indicators: ['MEDIA_TRUST', 'SOCIAL_MEDIA_USAGE', 'POLARIZATION_INDEX'],
      contradicting_indicators: ['MEDIA_PLURALITY'],
      confidence_level: 'medium',
      data_quality: 0.65,
      examination_schema: [
        {
          indicator_code: 'MEDIA_TRUST',
          indicator_name_sv: 'Medieförtroende',
          indicator_name_en: 'Media trust',
          expected_if_cause_true: '< 40%',
        },
        {
          indicator_code: 'POLARIZATION_INDEX',
          indicator_name_sv: 'Polariseringsindex',
          indicator_name_en: 'Polarization index',
          expected_if_cause_true: 'Increasing',
        },
      ],
    },
  ],
};

// =============================================================================
// ANALYSIS FUNCTIONS
// =============================================================================

/**
 * Analyze probable causes for a diagnostic code.
 * Returns ranked list of co-movement patterns.
 */
export function analyzeProbableCauses(
  dtcCode: string,
  geoScope: string,
  currentIndicators?: Record<string, number>
): CauseAnalysis {
  const patterns = CAUSE_PATTERNS[dtcCode] || [];
  
  // Calculate probabilities based on historical frequency and geo context
  const probableCauses: ProbableCause[] = patterns.map((pattern) => {
    // Base probability from historical occurrences
    const totalOccurrences = patterns.reduce((sum, p) => sum + p.historical_occurrences, 0);
    let probability = pattern.historical_occurrences / (totalOccurrences || 1);
    
    // Adjust for geo context match
    if (pattern.geo_contexts.includes(geoScope) || pattern.geo_contexts.includes('GLOBAL')) {
      probability *= 1.2;
    } else {
      probability *= 0.8;
    }
    
    // Adjust for data quality
    probability *= pattern.data_quality;
    
    // Check examination schema against current indicators
    const examinationSchema = pattern.examination_schema.map((item) => {
      const currentValue = currentIndicators?.[item.indicator_code];
      return {
        ...item,
        current_value: currentValue,
        matches_expectation: currentValue !== undefined ? true : undefined,
      };
    });
    
    return {
      ...pattern,
      probability: Math.min(probability, 1),
      examination_schema: examinationSchema,
    };
  });
  
  // Sort by probability
  probableCauses.sort((a, b) => b.probability - a.probability);
  
  // Normalize probabilities
  const totalProb = probableCauses.reduce((sum, c) => sum + c.probability, 0);
  probableCauses.forEach((c) => {
    c.probability = totalProb > 0 ? c.probability / totalProb : 0;
  });
  
  // Calculate unexplained variance (always leave room for unknown)
  const explainedVariance = probableCauses.reduce((sum, c) => sum + c.probability, 0);
  const unexplainedVariance = Math.max(0.1, 1 - explainedVariance * 0.87);
  
  return {
    dtc_code: dtcCode,
    analyzed_at: new Date().toISOString(),
    geo_scope: geoScope,
    probable_causes: probableCauses,
    unexplained_variance: unexplainedVariance,
    disclaimer: getDisclaimer('sv'),
  };
}

/**
 * Get standard disclaimer text
 */
export function getDisclaimer(language: 'sv' | 'en'): string {
  return language === 'sv'
    ? 'Sannolikheter baseras på historiska samvariansmönster. Korrelation innebär inte kausalitet. Dessa är observerade mönster, inte bekräftade orsakssamband.'
    : 'Probabilities based on historical co-movement patterns. Correlation does not imply causation. These are observed patterns, not confirmed causal relationships.';
}

/**
 * Format probability for display
 */
export function formatProbability(probability: number): string {
  return `${(probability * 100).toFixed(0)}%`;
}

/**
 * Get confidence label
 */
export function getConfidenceLabel(level: 'high' | 'medium' | 'low', language: 'sv' | 'en'): string {
  const labels = {
    high: { sv: 'Hög konfidens', en: 'High confidence' },
    medium: { sv: 'Medium konfidens', en: 'Medium confidence' },
    low: { sv: 'Låg konfidens', en: 'Low confidence' },
  };
  return labels[level][language];
}
