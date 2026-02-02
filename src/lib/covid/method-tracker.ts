/**
 * COVID-19 REALITY LAYER - Method Tracker
 * Tracks and displays methodology changes over time
 */

import type { CovidMethodChange, ImpactSeverity } from '@/types/covid';

export interface MethodChangeMarker {
  date: string;
  type: string;
  severity: ImpactSeverity;
  description: string;
  warning: string;
}

/**
 * Convert method changes to timeline markers
 */
export function createMethodChangeMarkers(
  changes: CovidMethodChange[]
): MethodChangeMarker[] {
  return changes.map(change => ({
    date: change.changeDate,
    type: formatChangeType(change.changeType),
    severity: change.impactSeverity,
    description: `${change.previousDefinition} → ${change.newDefinition}`,
    warning: getWarningText(change.impactSeverity),
  }));
}

function formatChangeType(type: string): string {
  const typeMap: Record<string, string> = {
    test_strategy: 'Testing Strategy',
    death_definition: 'Death Definition',
    reporting_frequency: 'Reporting Frequency',
    case_definition: 'Case Definition',
  };
  return typeMap[type] || type;
}

function getWarningText(severity: ImpactSeverity): string {
  const warnings: Record<ImpactSeverity, string> = {
    minor: 'Minor change – comparison generally valid',
    moderate: 'Moderate change – use caution when comparing across this date',
    major: 'Major change – comparisons across this point may be misleading',
    breaks_comparability: '⚠️ Method change here – comparisons across this point require caution',
  };
  return warnings[severity];
}

/**
 * Check if a date range spans a comparability-breaking change
 */
export function hasComparabilityBreak(
  changes: CovidMethodChange[],
  startDate: string,
  endDate: string
): boolean {
  return changes.some(
    c => 
      c.impactSeverity === 'breaks_comparability' &&
      c.changeDate >= startDate &&
      c.changeDate <= endDate
  );
}

/**
 * Get all method changes that affect a date range
 */
export function getRelevantMethodChanges(
  changes: CovidMethodChange[],
  startDate: string,
  endDate: string
): CovidMethodChange[] {
  return changes.filter(
    c => c.changeDate >= startDate && c.changeDate <= endDate
  );
}

/**
 * Severity display configuration
 */
export const SEVERITY_DISPLAY = {
  minor: {
    color: 'blue',
    icon: 'ℹ',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-500',
  },
  moderate: {
    color: 'yellow',
    icon: '○',
    bgClass: 'bg-yellow-500/10',
    textClass: 'text-yellow-500',
  },
  major: {
    color: 'orange',
    icon: '△',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-500',
  },
  breaks_comparability: {
    color: 'red',
    icon: '⚠',
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
  },
};

/**
 * Standard method change disclaimer
 */
export const METHOD_CHANGE_DISCLAIMER = {
  sv: 'Metodförändringar påverkar jämförbarhet över tid. Data före och efter en förändring mäter inte nödvändigtvis samma sak.',
  en: 'Methodology changes affect comparability over time. Data before and after a change may not measure the same thing.',
};
