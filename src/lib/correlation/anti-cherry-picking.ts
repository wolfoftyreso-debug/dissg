/**
 * ANTI-CHERRY-PICKING ENGINE
 * Shows what else moved (and what didn't)
 * 
 * RULE: Every correlation must show context to prevent selective presentation
 */

import type { 
  CorrelationPair, 
  DomainVariable 
} from '@/types/correlation';
import { calculatePearsonCorrelation } from './correlation-engine';

export interface ContextResult {
  alsoMoved: {
    variable: DomainVariable;
    correlation: number;
    direction: 'same' | 'opposite';
  }[];
  didNotMove: {
    variable: DomainVariable;
    correlation: number;
  }[];
  totalVariablesChecked: number;
}

/**
 * Find other variables that moved during the same period
 * Returns both "also moved" and "did not move" for balance
 */
export function findCoMovementContext(
  targetVariable: DomainVariable,
  targetSeries: number[],
  allVariables: { variable: DomainVariable; series: number[] }[],
  thresholdMoved: number = 0.4,
  thresholdNotMoved: number = 0.2
): ContextResult {
  const alsoMoved: ContextResult['alsoMoved'] = [];
  const didNotMove: ContextResult['didNotMove'] = [];

  for (const { variable, series } of allVariables) {
    // Skip self-comparison
    if (variable.id === targetVariable.id) continue;
    
    // Skip if series length mismatch
    if (series.length !== targetSeries.length) continue;

    const { r } = calculatePearsonCorrelation(targetSeries, series);
    const absR = Math.abs(r);

    if (absR >= thresholdMoved) {
      alsoMoved.push({
        variable,
        correlation: r,
        direction: r >= 0 ? 'same' : 'opposite',
      });
    } else if (absR <= thresholdNotMoved) {
      didNotMove.push({
        variable,
        correlation: r,
      });
    }
  }

  // Sort by absolute correlation
  alsoMoved.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  didNotMove.sort((a, b) => Math.abs(a.correlation) - Math.abs(b.correlation));

  return {
    alsoMoved: alsoMoved.slice(0, 5), // Top 5
    didNotMove: didNotMove.slice(0, 5), // Top 5
    totalVariablesChecked: allVariables.length - 1,
  };
}

/**
 * Generate context statement (locked language)
 */
export function generateContextStatement(context: ContextResult): string {
  const parts: string[] = [];

  if (context.alsoMoved.length > 0) {
    const movedNames = context.alsoMoved
      .slice(0, 3)
      .map(m => m.variable.name)
      .join(', ');
    parts.push(`During this period, ${movedNames} also changed.`);
  }

  if (context.didNotMove.length > 0) {
    const notMovedNames = context.didNotMove
      .slice(0, 3)
      .map(m => m.variable.name)
      .join(', ');
    parts.push(`${notMovedNames} did not show significant movement.`);
  }

  if (parts.length === 0) {
    parts.push('Insufficient context data available.');
  }

  return parts.join(' ');
}

/**
 * Generate Swedish context statement
 */
export function generateContextStatementSv(context: ContextResult): string {
  const parts: string[] = [];

  if (context.alsoMoved.length > 0) {
    const movedNames = context.alsoMoved
      .slice(0, 3)
      .map(m => m.variable.name)
      .join(', ');
    parts.push(`Under denna period förändrades även ${movedNames}.`);
  }

  if (context.didNotMove.length > 0) {
    const notMovedNames = context.didNotMove
      .slice(0, 3)
      .map(m => m.variable.name)
      .join(', ');
    parts.push(`${notMovedNames} visade ingen signifikant förändring.`);
  }

  if (parts.length === 0) {
    parts.push('Otillräcklig kontextdata tillgänglig.');
  }

  return parts.join(' ');
}

/**
 * Check if a correlation presentation includes sufficient context
 * Returns true if anti-cherry-picking requirements are met
 */
export function validateAntiCherryPicking(
  pair: CorrelationPair,
  context: ContextResult | null
): { valid: boolean; reason?: string } {
  // Must have context
  if (!context) {
    return { valid: false, reason: 'Context data required' };
  }

  // Must show at least some "also moved" or "did not move"
  if (context.alsoMoved.length === 0 && context.didNotMove.length === 0) {
    return { valid: false, reason: 'No context variables available' };
  }

  // Strong correlations require more context
  if (Math.abs(pair.correlation) > 0.7) {
    if (context.alsoMoved.length < 2) {
      return { valid: false, reason: 'Strong correlation requires additional context' };
    }
  }

  return { valid: true };
}
