/**
 * Insight Flags Engine
 * Block D: Deviation detector + peer group definitions
 * Flags observed deviations, NOT "success" or "failure"
 */

export type DeviationType = 
  | 'above_peer_median'
  | 'below_peer_median'
  | 'above_historical'
  | 'below_historical'
  | 'rapid_change'
  | 'trend_reversal'
  | 'outlier';

export interface PeerGroup {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of grouping criteria */
  description: string;
  /** Member entity IDs */
  members: string[];
  /** Grouping criteria */
  criteria: {
    /** Population range */
    populationRange?: [number, number];
    /** GDP per capita range */
    gdpRange?: [number, number];
    /** Geographic region */
    region?: string;
    /** Data quality tier */
    dataTier?: 'A' | 'B' | 'C' | 'D';
    /** Custom criteria key-value */
    custom?: Record<string, unknown>;
  };
  /** Number of members */
  memberCount: number;
}

export interface InsightFlag {
  /** Unique identifier */
  id: string;
  /** Entity this flag applies to */
  entityId: string;
  /** Entity name */
  entityName: string;
  /** Type of deviation observed */
  deviationType: DeviationType;
  /** KPI or metric being observed */
  metricCode: string;
  /** Metric name */
  metricName: string;
  /** Current value */
  currentValue: number;
  /** Unit */
  unit: string;
  /** Comparison value (median, historical, etc.) */
  comparisonValue: number;
  /** Peer group used for comparison */
  peerGroup?: PeerGroup;
  /** Time period */
  period: {
    start: string;
    end: string;
  };
  /** Deviation magnitude (percentage or absolute) */
  deviationMagnitude: number;
  /** Is magnitude a percentage */
  isPercentage: boolean;
  /** Statistical confidence (0-1) */
  confidence: number;
  /** Methodology used */
  methodology: string;
  /** Uncertainty factors */
  uncertaintyFactors: string[];
  /** Generated timestamp */
  generatedAt: string;
}

/**
 * Generate insight statement (NON-NORMATIVE)
 * Uses neutral language per Spotless Protocol
 */
export function generateInsightStatement(flag: InsightFlag): string {
  const { entityName, metricName, currentValue, unit, deviationType, deviationMagnitude, peerGroup, period } = flag;
  
  const periodStr = `${period.start} - ${period.end}`;
  const magnitudeStr = flag.isPercentage 
    ? `${Math.abs(deviationMagnitude).toFixed(1)}%` 
    : Math.abs(deviationMagnitude).toFixed(2);

  switch (deviationType) {
    case 'above_peer_median':
      return `${entityName} observerades ${magnitudeStr} över peer-gruppens median för ${metricName} (${currentValue} ${unit}) under perioden ${periodStr}${peerGroup ? ` inom ${peerGroup.name}` : ''}.`;
    
    case 'below_peer_median':
      return `${entityName} observerades ${magnitudeStr} under peer-gruppens median för ${metricName} (${currentValue} ${unit}) under perioden ${periodStr}${peerGroup ? ` inom ${peerGroup.name}` : ''}.`;
    
    case 'above_historical':
      return `${entityName} visar en observerad ökning på ${magnitudeStr} i ${metricName} jämfört med historiskt snitt (${currentValue} ${unit}).`;
    
    case 'below_historical':
      return `${entityName} visar en observerad minskning på ${magnitudeStr} i ${metricName} jämfört med historiskt snitt (${currentValue} ${unit}).`;
    
    case 'rapid_change':
      return `${entityName} uppvisar en snabb förändring på ${magnitudeStr} i ${metricName} under ${periodStr}.`;
    
    case 'trend_reversal':
      return `${entityName} visar en observerad trendomsvängning i ${metricName} under ${periodStr}.`;
    
    case 'outlier':
      return `${entityName} är en statistisk outlier i ${metricName} (${currentValue} ${unit}) för perioden ${periodStr}.`;
    
    default:
      return `Observation: ${entityName} - ${metricName}: ${currentValue} ${unit}`;
  }
}

/**
 * Deviation type labels (neutral language)
 */
export const DEVIATION_TYPE_LABELS: Record<DeviationType, { en: string; sv: string }> = {
  above_peer_median: { en: 'Above peer median', sv: 'Över peer-median' },
  below_peer_median: { en: 'Below peer median', sv: 'Under peer-median' },
  above_historical: { en: 'Above historical average', sv: 'Över historiskt snitt' },
  below_historical: { en: 'Below historical average', sv: 'Under historiskt snitt' },
  rapid_change: { en: 'Rapid change observed', sv: 'Snabb förändring observerad' },
  trend_reversal: { en: 'Trend reversal observed', sv: 'Trendomsvängning observerad' },
  outlier: { en: 'Statistical outlier', sv: 'Statistisk outlier' },
};

/**
 * Standard peer group definitions
 */
export const STANDARD_PEER_GROUPS: Record<string, Omit<PeerGroup, 'members' | 'memberCount'>> = {
  EU_LARGE_ECONOMIES: {
    id: 'EU_LARGE_ECONOMIES',
    name: 'EU Stora ekonomier',
    description: 'EU-länder med BNP över 500 miljarder EUR',
    criteria: {
      region: 'EU',
      gdpRange: [500_000_000_000, Infinity],
    },
  },
  EU_NORDIC: {
    id: 'EU_NORDIC',
    name: 'Nordiska länder',
    description: 'Nordiska EU/EES-länder',
    criteria: {
      region: 'Nordic',
    },
  },
  EU_SIMILAR_POPULATION: {
    id: 'EU_SIMILAR_POPULATION',
    name: 'Liknande befolkning',
    description: 'EU-länder med liknande befolkningsstorlek (±50%)',
    criteria: {
      // Dynamic based on entity
    },
  },
  GLOBAL_OECD: {
    id: 'GLOBAL_OECD',
    name: 'OECD-länder',
    description: 'Alla OECD-medlemsländer',
    criteria: {
      custom: { membership: 'OECD' },
    },
  },
};

/**
 * Calculate deviation from peer group
 */
export function calculatePeerDeviation(
  entityValue: number,
  peerValues: number[]
): { deviation: number; percentile: number; isOutlier: boolean } {
  if (peerValues.length === 0) {
    return { deviation: 0, percentile: 50, isOutlier: false };
  }

  const sorted = [...peerValues].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  const deviation = ((entityValue - median) / median) * 100;

  // Calculate percentile
  const rank = sorted.filter(v => v <= entityValue).length;
  const percentile = (rank / sorted.length) * 100;

  // IQR-based outlier detection
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const isOutlier = entityValue < lowerBound || entityValue > upperBound;

  return { deviation, percentile, isOutlier };
}

/**
 * Detect rapid change (>2 standard deviations in change rate)
 */
export function detectRapidChange(
  values: number[],
  currentValue: number,
  threshold: number = 2
): { isRapid: boolean; zScore: number } {
  if (values.length < 3) {
    return { isRapid: false, zScore: 0 };
  }

  // Calculate changes
  const changes: number[] = [];
  for (let i = 1; i < values.length; i++) {
    changes.push(values[i] - values[i - 1]);
  }

  const currentChange = currentValue - values[values.length - 1];
  
  // Calculate mean and std of changes
  const mean = changes.reduce((a, b) => a + b, 0) / changes.length;
  const variance = changes.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / changes.length;
  const std = Math.sqrt(variance);

  if (std === 0) {
    return { isRapid: false, zScore: 0 };
  }

  const zScore = (currentChange - mean) / std;

  return {
    isRapid: Math.abs(zScore) > threshold,
    zScore,
  };
}

/**
 * Create insight flag from deviation
 */
export function createInsightFlag(
  entityId: string,
  entityName: string,
  metric: { code: string; name: string; unit: string },
  value: number,
  deviationType: DeviationType,
  comparisonValue: number,
  deviationMagnitude: number,
  period: { start: string; end: string },
  confidence: number,
  methodology: string,
  peerGroup?: PeerGroup,
  uncertaintyFactors: string[] = []
): InsightFlag {
  return {
    id: `flag-${entityId}-${metric.code}-${Date.now()}`,
    entityId,
    entityName,
    deviationType,
    metricCode: metric.code,
    metricName: metric.name,
    currentValue: value,
    unit: metric.unit,
    comparisonValue,
    peerGroup,
    period,
    deviationMagnitude,
    isPercentage: true,
    confidence,
    methodology,
    uncertaintyFactors,
    generatedAt: new Date().toISOString(),
  };
}
