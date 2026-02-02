/**
 * Aggregation Guard
 * Block C: Comparability lint + uncertainty indicators
 * Ensures data is only compared when methodologically valid
 */

export type NormalizationType = 'per_capita' | 'per_area' | 'per_time' | 'absolute' | 'percentage';
export type UncertaintyLevel = 'low' | 'medium' | 'high' | 'unknown';

export interface DataDefinition {
  /** Unique identifier */
  id: string;
  /** What is being measured */
  measurementType: string;
  /** Unit of measurement */
  unit: string;
  /** Collection method */
  collectionMethod: 'survey' | 'register' | 'estimate' | 'composite';
  /** How data is normalized */
  normalization: NormalizationType;
  /** Time granularity */
  timeGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  /** Geographic coverage */
  geoCoverage: string;
  /** Source organization */
  source: string;
  /** Version/methodology year */
  methodologyVersion?: string;
}

export interface ComparabilityCheck {
  /** Can these be compared? */
  isComparable: boolean;
  /** Confidence in comparability (0-1) */
  confidence: number;
  /** Blocking issues that prevent comparison */
  blockingIssues: string[];
  /** Warnings that don't block but should be shown */
  warnings: string[];
  /** Suggested alternatives if not comparable */
  alternatives?: string[];
}

export interface UncertaintyIndicator {
  level: UncertaintyLevel;
  /** Numeric uncertainty range (±) */
  range?: number;
  /** Percentage confidence interval */
  confidenceInterval?: number;
  /** Factors contributing to uncertainty */
  factors: string[];
  /** Human-readable explanation */
  explanation: string;
}

/**
 * Check if two data definitions are comparable
 */
export function checkComparability(
  defA: DataDefinition,
  defB: DataDefinition
): ComparabilityCheck {
  const blockingIssues: string[] = [];
  const warnings: string[] = [];
  let confidence = 1.0;

  // Check measurement type match
  if (defA.measurementType !== defB.measurementType) {
    blockingIssues.push(
      `Olika mättyper: "${defA.measurementType}" vs "${defB.measurementType}"`
    );
  }

  // Check unit match
  if (defA.unit !== defB.unit) {
    blockingIssues.push(
      `Olika enheter: "${defA.unit}" vs "${defB.unit}"`
    );
  }

  // Check normalization match
  if (defA.normalization !== defB.normalization) {
    blockingIssues.push(
      `Olika normaliseringsmetoder: ${getNormalizationLabel(defA.normalization)} vs ${getNormalizationLabel(defB.normalization)}`
    );
  }

  // Check time granularity
  if (defA.timeGranularity !== defB.timeGranularity) {
    warnings.push(
      `Olika tidsupplösning: ${defA.timeGranularity} vs ${defB.timeGranularity}`
    );
    confidence *= 0.8;
  }

  // Check collection method
  if (defA.collectionMethod !== defB.collectionMethod) {
    warnings.push(
      `Olika insamlingsmetoder: ${getMethodLabel(defA.collectionMethod)} vs ${getMethodLabel(defB.collectionMethod)}`
    );
    confidence *= 0.9;
  }

  // Check methodology version
  if (defA.methodologyVersion && defB.methodologyVersion && 
      defA.methodologyVersion !== defB.methodologyVersion) {
    warnings.push(
      `Olika metodversion: ${defA.methodologyVersion} vs ${defB.methodologyVersion}`
    );
    confidence *= 0.95;
  }

  // Check source
  if (defA.source !== defB.source) {
    warnings.push(
      `Olika källor: ${defA.source} vs ${defB.source}`
    );
    confidence *= 0.85;
  }

  return {
    isComparable: blockingIssues.length === 0,
    confidence,
    blockingIssues,
    warnings,
    alternatives: blockingIssues.length > 0 
      ? ['Använd samma datakälla för båda', 'Jämför trender istället för absoluta värden']
      : undefined,
  };
}

/**
 * Validate time period alignment
 */
export function checkTimePeriodAlignment(
  periodA: { start: Date; end: Date },
  periodB: { start: Date; end: Date }
): { aligned: boolean; overlap: number; warning?: string } {
  const startA = periodA.start.getTime();
  const endA = periodA.end.getTime();
  const startB = periodB.start.getTime();
  const endB = periodB.end.getTime();

  // Calculate overlap
  const overlapStart = Math.max(startA, startB);
  const overlapEnd = Math.min(endA, endB);
  const overlap = Math.max(0, overlapEnd - overlapStart);
  
  const durationA = endA - startA;
  const durationB = endB - startB;
  const avgDuration = (durationA + durationB) / 2;
  
  const overlapPercent = overlap / avgDuration;

  // Perfect alignment
  if (startA === startB && endA === endB) {
    return { aligned: true, overlap: 1 };
  }

  // Significant overlap (>80%)
  if (overlapPercent >= 0.8) {
    return {
      aligned: true,
      overlap: overlapPercent,
      warning: `Tidsperioderna överlappar till ${Math.round(overlapPercent * 100)}%`,
    };
  }

  // Some overlap
  if (overlapPercent > 0) {
    return {
      aligned: false,
      overlap: overlapPercent,
      warning: `Begränsad överlappning (${Math.round(overlapPercent * 100)}%) - jämförelse rekommenderas ej`,
    };
  }

  // No overlap
  return {
    aligned: false,
    overlap: 0,
    warning: 'Tidsperioderna överlappar inte',
  };
}

/**
 * Calculate uncertainty indicator
 */
export function calculateUncertainty(
  dataTier: 'A' | 'B' | 'C' | 'D',
  sampleSize?: number,
  collectionMethod?: DataDefinition['collectionMethod'],
  additionalFactors?: string[]
): UncertaintyIndicator {
  const factors: string[] = [];
  let level: UncertaintyLevel = 'low';

  // Data tier contribution
  switch (dataTier) {
    case 'A':
      // Low uncertainty from tier
      break;
    case 'B':
      factors.push('Vissa dataluckor i källan');
      level = 'low';
      break;
    case 'C':
      factors.push('Betydande dataluckor');
      level = 'medium';
      break;
    case 'D':
      factors.push('Mycket begränsad data');
      level = 'high';
      break;
  }

  // Sample size contribution
  if (sampleSize !== undefined) {
    if (sampleSize < 100) {
      factors.push('Liten urvalsstorlek');
      level = level === 'low' ? 'medium' : 'high';
    } else if (sampleSize < 1000) {
      factors.push('Begränsad urvalsstorlek');
    }
  }

  // Collection method contribution
  if (collectionMethod === 'estimate') {
    factors.push('Uppskattade värden');
    level = level === 'low' ? 'medium' : level;
  } else if (collectionMethod === 'composite') {
    factors.push('Sammansatt från flera källor');
  }

  // Additional factors
  if (additionalFactors) {
    factors.push(...additionalFactors);
  }

  // Calculate confidence interval based on level
  const confidenceIntervals: Record<UncertaintyLevel, number> = {
    low: 5,
    medium: 15,
    high: 30,
    unknown: 50,
  };

  return {
    level,
    confidenceInterval: confidenceIntervals[level],
    factors,
    explanation: generateUncertaintyExplanation(level, factors),
  };
}

/**
 * Standard message for blocked comparison
 */
export const COMPARISON_BLOCKED_MESSAGE = 
  'This view cannot be presented reliably with available data.';

export const COMPARISON_BLOCKED_MESSAGE_SV = 
  'Denna vy kan inte visas tillförlitligt med tillgänglig data.';

// Helper functions
function getNormalizationLabel(norm: NormalizationType): string {
  const labels: Record<NormalizationType, string> = {
    per_capita: 'per capita',
    per_area: 'per yta',
    per_time: 'per tidsenhet',
    absolute: 'absolut',
    percentage: 'procent',
  };
  return labels[norm];
}

function getMethodLabel(method: DataDefinition['collectionMethod']): string {
  const labels = {
    survey: 'enkät',
    register: 'register',
    estimate: 'uppskattning',
    composite: 'sammansatt',
  };
  return labels[method];
}

function generateUncertaintyExplanation(level: UncertaintyLevel, factors: string[]): string {
  if (factors.length === 0) {
    return 'Hög datatillförlitlighet';
  }

  const prefix = {
    low: 'Låg osäkerhet',
    medium: 'Måttlig osäkerhet',
    high: 'Hög osäkerhet',
    unknown: 'Okänd osäkerhet',
  }[level];

  return `${prefix} på grund av: ${factors.join(', ')}`;
}
