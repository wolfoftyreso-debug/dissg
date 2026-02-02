// Wrapped Engine Types - Generiska, datadrivna årssammanfattningar

export type WrappedScope = 'world' | 'region' | 'country' | 'city' | 'municipality' | 'custom';

export type WrappedTheme = 
  | 'economy' 
  | 'health' 
  | 'employment' 
  | 'energy' 
  | 'demographics' 
  | 'education'
  | 'infrastructure'
  | 'social_stability';

export type ComparisonType = 
  | 'previous_year' 
  | 'previous_period' 
  | 'regional_average' 
  | 'national_average'
  | 'global_average'
  | 'peer_group';

// Input model - strict requirements
export interface WrappedInput {
  scope: WrappedScope;
  geoIds: string[];
  timeRange: string; // e.g., "2025" or "2020-2025"
  indicators: string[];
  comparison: ComparisonType[];
}

// Data point with change tracking
export interface WrappedDataPoint {
  indicatorId: string;
  indicatorName: string;
  value: number;
  previousValue: number | null;
  unit: string;
  changePercent: number | null;
  changeDirection: 'up' | 'down' | 'stable';
  isPositiveChange: boolean; // Based on indicator's inverted flag
  confidence: number;
  dataSource: string;
  lastUpdated: string;
}

// Ranking/comparison data
export interface WrappedRanking {
  indicatorId: string;
  rank: number;
  total: number;
  percentile: number;
  referenceGroup: string;
  referenceGroupDescription: string;
}

// Timeline marker
export interface WrappedTimelineMarker {
  date: string;
  indicatorId: string;
  value: number;
  isSignificant: boolean;
  description?: string;
}

// Limitation/caveat
export interface WrappedLimitation {
  type: 'data_gap' | 'methodology' | 'scope' | 'temporal' | 'causation';
  description: string;
  severity: 'minor' | 'moderate' | 'significant';
}

// Complete Wrapped output
export interface WrappedOutput {
  id: string;
  generatedAt: string;
  input: WrappedInput;
  
  // Step 1: Overview
  overview: {
    title: string;
    subtitle: string;
    mainIndicators: WrappedDataPoint[];
    summaryText: string; // Neutral, factual
  };
  
  // Step 2: Biggest changes
  biggestChanges: {
    changes: WrappedDataPoint[];
    analysisText: string;
  };
  
  // Step 3: Timeline
  timeline: {
    markers: WrappedTimelineMarker[];
    periodStart: string;
    periodEnd: string;
  };
  
  // Step 4: Comparisons
  comparisons: {
    rankings: WrappedRanking[];
    comparisonText: string;
  };
  
  // Step 5: What stayed the same
  unchanged: {
    stableIndicators: WrappedDataPoint[];
    stabilityText: string;
  };
  
  // Step 6: Limitations
  limitations: {
    items: WrappedLimitation[];
    disclaimerText: string;
  };
  
  // Step 7: Deep dive links
  deepDive: {
    availableViews: Array<{
      type: 'full_graph' | 'methodology' | 'raw_data' | 'sources';
      label: string;
      url: string;
    }>;
  };
  
  // Metadata
  isDemo: boolean;
  shareableUrl: string | null;
  version: string;
}

// Validation result
export interface WrappedValidation {
  isValid: boolean;
  missingFields: string[];
  errors: string[];
}

// Step navigation
export type WrappedStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const WRAPPED_STEP_TITLES: Record<WrappedStep, { sv: string; en: string }> = {
  1: { sv: 'Så här såg året ut', en: 'This is how the year looked' },
  2: { sv: 'Det här förändrades mest', en: 'These changed the most' },
  3: { sv: 'När hände det?', en: 'When did it happen?' },
  4: { sv: 'Hur stod det sig?', en: 'How did it compare?' },
  5: { sv: 'Vad låg still?', en: 'What stayed the same?' },
  6: { sv: 'Vad detta inte säger', en: 'What this doesn\'t tell you' },
  7: { sv: 'Vill du gå djupare?', en: 'Want to go deeper?' },
};
