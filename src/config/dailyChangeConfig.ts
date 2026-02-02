/**
 * WAVE 9: BLOCK BU — "WHAT ACTUALLY CHANGED?" ENGINE
 * 
 * Daglig sammanfattning av verkliga förändringar.
 * Inga rubriker. Bara förändring.
 */

// ============================================================
// BU1: DAGLIG SCAN
// ============================================================

export interface DailyScanConfig {
  scanTargets: ScanTarget[];
  thresholds: ChangeThresholds;
  schedule: {
    runTime: string;
    timezone: string;
    retryOnFailure: boolean;
  };
}

export interface ScanTarget {
  type: 'kpi' | 'index' | 'event' | 'media' | 'policy';
  scope: 'global' | 'regional' | 'national';
  priority: 'critical' | 'high' | 'normal' | 'low';
  filters?: Record<string, unknown>;
}

export interface ChangeThresholds {
  trendBreak: {
    minMagnitude: number;
    minPersistence: number;
    confidenceRequired: number;
  };
  acceleration: {
    minAcceleration: number;
    lookbackDays: number;
  };
  unusualCovariation: {
    minCorrelationShift: number;
    baselinePeriodDays: number;
  };
}

export const DEFAULT_SCAN_CONFIG: DailyScanConfig = {
  scanTargets: [
    { type: 'kpi', scope: 'global', priority: 'critical' },
    { type: 'kpi', scope: 'national', priority: 'high' },
    { type: 'index', scope: 'global', priority: 'high' },
    { type: 'event', scope: 'global', priority: 'critical' },
    { type: 'media', scope: 'global', priority: 'normal' },
    { type: 'policy', scope: 'national', priority: 'high' }
  ],
  thresholds: {
    trendBreak: {
      minMagnitude: 5,
      minPersistence: 3,
      confidenceRequired: 0.7
    },
    acceleration: {
      minAcceleration: 1.5,
      lookbackDays: 30
    },
    unusualCovariation: {
      minCorrelationShift: 0.3,
      baselinePeriodDays: 365
    }
  },
  schedule: {
    runTime: '05:00',
    timezone: 'Europe/Stockholm',
    retryOnFailure: true
  }
};

// ============================================================
// BU2: CHANGE OBJECT
// ============================================================

export type ChangeType = 
  | 'trend_break'
  | 'acceleration'
  | 'deceleration'
  | 'reversal'
  | 'new_high'
  | 'new_low'
  | 'unusual_covariation'
  | 'threshold_crossed'
  | 'pattern_emergence'
  | 'pattern_dissolution';

export interface ChangeObject {
  changeId: string;
  
  // Vad förändrades
  whatChanged: {
    entityType: 'kpi' | 'index' | 'event' | 'policy' | 'correlation';
    entityId: string;
    entityLabel: string;
    previousValue?: number;
    currentValue?: number;
    changeType: ChangeType;
  };
  
  // Var
  where: {
    scope: 'global' | 'regional' | 'national' | 'local';
    countryCode?: string;
    regionCode?: string;
    label: string;
  };
  
  // När
  when: {
    detectedAt: string;
    occurredAt: string;
    period?: string;
  };
  
  // Storlek
  magnitude: {
    absolute?: number;
    relative?: number;
    percentile?: number;
    severity: 'minimal' | 'notable' | 'significant' | 'major' | 'extreme';
  };
  
  // Relaterade faktorer (INTE orsaker!)
  relatedFactors: {
    factorId: string;
    factorType: string;
    factorLabel: string;
    relationship: 'coincides' | 'precedes' | 'follows' | 'correlated';
    strength?: number;
    lag?: number;
    confidence: number;
    neutralDescription: string;
  }[];
  
  // Kvalitet
  confidence: number;
  
  // Länkar till data
  linksToData: {
    type: 'raw_data' | 'source' | 'methodology' | 'related_analysis';
    url: string;
    label: string;
  }[];
  
  generatedAt: string;
  method: string;
}

// ============================================================
// BU3: FEED-NIVÅER
// ============================================================

export type FeedLevel = 'global' | 'regional' | 'national' | 'thematic';

export type ThemeFilter = 
  | 'economy'
  | 'labour'
  | 'health'
  | 'energy'
  | 'education'
  | 'housing'
  | 'demographics'
  | 'environment'
  | 'governance'
  | 'security';

export interface FeedConfiguration {
  level: FeedLevel;
  filters: {
    countries?: string[];
    regions?: string[];
    themes?: ThemeFilter[];
    minConfidence?: number;
    minSeverity?: 'minimal' | 'notable' | 'significant' | 'major' | 'extreme';
    maxAge?: number;
  };
  presentation: {
    format: 'cards' | 'timeline' | 'compact';
    groupBy?: 'theme' | 'geography' | 'severity' | 'time';
    maxItems?: number;
    includeContext: boolean;
    includeRelated: boolean;
  };
}

export const FEED_TEMPLATES: Record<string, FeedConfiguration> = {
  global_critical: {
    level: 'global',
    filters: {
      minSeverity: 'significant',
      minConfidence: 0.7
    },
    presentation: {
      format: 'cards',
      groupBy: 'theme',
      maxItems: 20,
      includeContext: true,
      includeRelated: true
    }
  },
  sweden_all: {
    level: 'national',
    filters: {
      countries: ['SE'],
      minSeverity: 'notable',
      minConfidence: 0.6
    },
    presentation: {
      format: 'timeline',
      groupBy: 'time',
      maxItems: 50,
      includeContext: true,
      includeRelated: true
    }
  },
  economy_focus: {
    level: 'thematic',
    filters: {
      themes: ['economy', 'labour', 'energy'],
      minSeverity: 'notable'
    },
    presentation: {
      format: 'cards',
      groupBy: 'geography',
      maxItems: 30,
      includeContext: true,
      includeRelated: false
    }
  },
  nordic_overview: {
    level: 'regional',
    filters: {
      countries: ['SE', 'NO', 'DK', 'FI', 'IS'],
      minSeverity: 'notable'
    },
    presentation: {
      format: 'compact',
      groupBy: 'geography',
      maxItems: 40,
      includeContext: false,
      includeRelated: false
    }
  }
};

// ============================================================
// NEUTRAL LANGUAGE FOR CHANGES
// ============================================================

export const CHANGE_LANGUAGE: Record<ChangeType, {
  sv: string;
  en: string;
  description: string;
}> = {
  trend_break: {
    sv: 'Trenden bröts',
    en: 'Trend break observed',
    description: 'Previous trend direction changed'
  },
  acceleration: {
    sv: 'Takten ökade',
    en: 'Rate accelerated',
    description: 'Change happening faster than before'
  },
  deceleration: {
    sv: 'Takten minskade',
    en: 'Rate decelerated',
    description: 'Change happening slower than before'
  },
  reversal: {
    sv: 'Riktningen vände',
    en: 'Direction reversed',
    description: 'Movement changed to opposite direction'
  },
  new_high: {
    sv: 'Ny högsta nivå',
    en: 'New high recorded',
    description: 'Highest value in observation period'
  },
  new_low: {
    sv: 'Ny lägsta nivå',
    en: 'New low recorded',
    description: 'Lowest value in observation period'
  },
  unusual_covariation: {
    sv: 'Ovanlig samvariation',
    en: 'Unusual covariation',
    description: 'Indicators moved together in unexpected way'
  },
  threshold_crossed: {
    sv: 'Tröskel passerad',
    en: 'Threshold crossed',
    description: 'Value crossed a defined threshold'
  },
  pattern_emergence: {
    sv: 'Nytt mönster observerat',
    en: 'New pattern emerged',
    description: 'Previously unseen pattern detected'
  },
  pattern_dissolution: {
    sv: 'Mönster upphört',
    en: 'Pattern dissolved',
    description: 'Previously observed pattern no longer holds'
  }
};

// ============================================================
// EXAMPLE CHANGE DATA
// ============================================================

export const EXAMPLE_CHANGES: ChangeObject[] = [
  {
    changeId: 'chg_se_unemp_2024',
    whatChanged: {
      entityType: 'kpi',
      entityId: 'kpi_unemployment',
      entityLabel: 'Arbetslöshet',
      previousValue: 7.2,
      currentValue: 7.8,
      changeType: 'acceleration'
    },
    where: {
      scope: 'national',
      countryCode: 'SE',
      label: 'Sverige'
    },
    when: {
      detectedAt: '2024-01-15T06:00:00Z',
      occurredAt: '2024-01-01',
      period: '2024-Q1'
    },
    magnitude: {
      absolute: 0.6,
      relative: 8.3,
      percentile: 85,
      severity: 'notable'
    },
    relatedFactors: [
      {
        factorId: 'policy_rate',
        factorType: 'economic_variable',
        factorLabel: 'Styrränta',
        relationship: 'precedes',
        strength: 0.45,
        lag: 9,
        confidence: 0.72,
        neutralDescription: 'Räntehöjningarna under 2023 föregick förändringen'
      }
    ],
    confidence: 0.88,
    linksToData: [
      {
        type: 'source',
        url: 'https://scb.se/hitta-statistik/statistik-efter-amne/arbetsmarknad/',
        label: 'SCB Arbetsmarknadsstatistik'
      }
    ],
    generatedAt: '2024-01-15T06:15:00Z',
    method: 'time_series_analysis'
  }
];
