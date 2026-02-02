/**
 * Living Standards Module - Types & Definitions
 * Human-readable indicators for comparing quality of life across time and place
 */

/**
 * The 9 core human indicators that anyone can understand
 * These form the "Human Base Layer" - never hidden, never mixed with analytics
 */
export interface HumanBaseLayerIndicators {
  lifeExpectancy: number | null;        // Years
  infantMortality: number | null;       // Deaths per 1,000 live births
  incomePerPerson: number | null;       // PPP-adjusted USD
  livingSpacePerPerson: number | null;  // Square meters
  electricityAccess: number | null;     // % of population
  cleanWaterAccess: number | null;      // % of population
  yearsOfEducation: number | null;      // Average years
  workingHoursPerWeek: number | null;   // Average hours
  dailyCalories: number | null;         // kcal per person
  violentDeathRate: number | null;      // Deaths per 100,000
}

/**
 * Analytical layer - only shown on explicit user request
 */
export interface AnalyticalLayerIndicators {
  pppAdjustment: {
    factor: number;
    baseYear: number;
    method: string;
  };
  incomeDistribution: {
    median: number;
    mean: number;
    giniCoefficient: number;
    bottomDecile: number;
    topDecile: number;
  };
  regionalVariation: {
    urbanRural: { urban: number; rural: number };
    byRegion: Record<string, number>;
  };
  demographicBreakdown?: {
    byGender?: { male: number; female: number };
    byAge?: Record<string, number>;
  };
}

/**
 * A snapshot of living standards at a specific place and time
 */
export interface LivingStandardsSnapshot {
  id: string;
  countryCode: string;
  countryName: string;
  year: number;
  
  // Human layer (always visible)
  indicators: HumanBaseLayerIndicators;
  
  // Analytical layer (on demand)
  analytics?: AnalyticalLayerIndicators;
  
  // Data quality metadata (always visible)
  coverage: {
    indicatorsAvailable: number;
    indicatorsTotal: number;
    percentage: number;
  };
  
  uncertainty: {
    level: 'low' | 'medium' | 'high' | 'very_high';
    sources: string[];
  };
  
  // Source transparency
  sources: {
    indicatorId: string;
    sourceName: string;
    sourceUrl?: string;
    collectionYear: number;
    methodology?: string;
  }[];
}

/**
 * Comparison between two snapshots
 */
export interface LivingStandardsComparison {
  snapshotA: LivingStandardsSnapshot;
  snapshotB: LivingStandardsSnapshot;
  
  // Per-indicator comparison
  differences: {
    indicatorId: keyof HumanBaseLayerIndicators;
    valueA: number | null;
    valueB: number | null;
    absoluteDiff: number | null;
    percentDiff: number | null;
    direction: 'higher_in_a' | 'higher_in_b' | 'equal' | 'incomparable';
  }[];
  
  // Comparability assessment
  comparability: {
    score: number; // 0-100
    warnings: string[];
    limitations: string[];
  };
}

/**
 * Historical timeline for a country
 */
export interface HistoricalTimeline {
  countryCode: string;
  countryName: string;
  periodStart: number;
  periodEnd: number;
  
  // Time series for each indicator
  series: {
    indicatorId: keyof HumanBaseLayerIndicators;
    points: {
      year: number;
      value: number;
      isEstimate: boolean;
      confidence: number;
    }[];
  }[];
  
  // Historical markers (clickable events)
  markers: HistoricalMarker[];
}

export interface HistoricalMarker {
  id: string;
  year: number;
  type: 'war' | 'reform' | 'crisis' | 'transition' | 'other';
  title: string;
  description: string;
  
  // What moved after this event
  indicatorChanges: {
    indicatorId: keyof HumanBaseLayerIndicators;
    changePercent: number;
    yearsToChange: number;
  }[];
  
  // What did NOT move
  indicatorsUnchanged: (keyof HumanBaseLayerIndicators)[];
  
  sources: string[];
}

/**
 * Indicator metadata with human-friendly descriptions
 */
export const HUMAN_INDICATORS: Record<keyof HumanBaseLayerIndicators, {
  id: keyof HumanBaseLayerIndicators;
  name: string;
  nameShort: string;
  unit: string;
  description: string;
  higherIsBetter: boolean;
  globalMin: number;
  globalMax: number;
}> = {
  lifeExpectancy: {
    id: 'lifeExpectancy',
    name: 'Förväntad livslängd',
    nameShort: 'Livslängd',
    unit: 'år',
    description: 'Genomsnittligt antal år en nyfödd förväntas leva',
    higherIsBetter: true,
    globalMin: 25,
    globalMax: 90
  },
  infantMortality: {
    id: 'infantMortality',
    name: 'Barnadödlighet',
    nameShort: 'Barnadöd',
    unit: 'per 1000',
    description: 'Dödsfall bland barn under 1 år per 1000 levande födda',
    higherIsBetter: false,
    globalMin: 0,
    globalMax: 300
  },
  incomePerPerson: {
    id: 'incomePerPerson',
    name: 'Inkomst per person',
    nameShort: 'Inkomst',
    unit: 'USD/år',
    description: 'BNP per capita justerat för köpkraft (PPP)',
    higherIsBetter: true,
    globalMin: 200,
    globalMax: 100000
  },
  livingSpacePerPerson: {
    id: 'livingSpacePerPerson',
    name: 'Bostadsyta per person',
    nameShort: 'Boyta',
    unit: 'm²',
    description: 'Genomsnittlig bostadsyta per person',
    higherIsBetter: true,
    globalMin: 3,
    globalMax: 80
  },
  electricityAccess: {
    id: 'electricityAccess',
    name: 'Tillgång till el',
    nameShort: 'El',
    unit: '%',
    description: 'Andel av befolkningen med tillgång till elektricitet',
    higherIsBetter: true,
    globalMin: 0,
    globalMax: 100
  },
  cleanWaterAccess: {
    id: 'cleanWaterAccess',
    name: 'Tillgång till rent vatten',
    nameShort: 'Vatten',
    unit: '%',
    description: 'Andel av befolkningen med tillgång till säkert dricksvatten',
    higherIsBetter: true,
    globalMin: 0,
    globalMax: 100
  },
  yearsOfEducation: {
    id: 'yearsOfEducation',
    name: 'Utbildningsår',
    nameShort: 'Utbildning',
    unit: 'år',
    description: 'Genomsnittligt antal år i formell utbildning',
    higherIsBetter: true,
    globalMin: 0,
    globalMax: 20
  },
  workingHoursPerWeek: {
    id: 'workingHoursPerWeek',
    name: 'Arbetstid per vecka',
    nameShort: 'Arbetstid',
    unit: 'tim/vecka',
    description: 'Genomsnittlig arbetstid per vecka',
    higherIsBetter: false, // Lower is typically better for quality of life
    globalMin: 20,
    globalMax: 80
  },
  dailyCalories: {
    id: 'dailyCalories',
    name: 'Matenergi per dag',
    nameShort: 'Kalorier',
    unit: 'kcal/dag',
    description: 'Genomsnittligt dagligt kaloriintag per person',
    higherIsBetter: true, // Up to a point
    globalMin: 1000,
    globalMax: 4000
  },
  violentDeathRate: {
    id: 'violentDeathRate',
    name: 'Dödligt våld',
    nameShort: 'Våld',
    unit: 'per 100k',
    description: 'Dödsfall genom våld per 100 000 invånare',
    higherIsBetter: false,
    globalMin: 0,
    globalMax: 100
  }
};

/**
 * Get ordered list of indicators for display
 */
export function getOrderedIndicators(): (keyof HumanBaseLayerIndicators)[] {
  return [
    'lifeExpectancy',
    'infantMortality',
    'incomePerPerson',
    'livingSpacePerPerson',
    'electricityAccess',
    'cleanWaterAccess',
    'yearsOfEducation',
    'workingHoursPerWeek',
    'dailyCalories',
    'violentDeathRate'
  ];
}
