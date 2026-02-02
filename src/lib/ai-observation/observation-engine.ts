/**
 * OBSERVATION ENGINE
 * 
 * Orchestrates AI observations with strict neutrality constraints.
 * Combines deviation detection, co-movement analysis, and language validation.
 */

import type {
  ObservationCard,
  ObservationType,
  AlternativeContext,
  ObservationLimits,
  StabilityLevel,
  AIObservationRequest,
  AIObservationResponse,
  PERIOD_DESCRIPTORS
} from '@/types/ai-observation';
import { validateObservationLanguage, appendMandatoryDisclaimer, validateCompleteness } from './language-validator';

// Simplified correlation result type for this module
interface CorrelationResult {
  variable_a_id: string;
  variable_b_id: string;
  pearson_r: number;
}

// Period descriptor based on volatility/change characteristics
type PeriodDescriptor = typeof PERIOD_DESCRIPTORS[number];

/**
 * Generate a neutral period descriptor based on data characteristics
 */
function describePeriod(
  volatilityChange: number,
  trendChange: number,
  levelShiftCount: number
): PeriodDescriptor {
  if (volatilityChange > 0.5) return 'period_of_elevated_volatility';
  if (levelShiftCount > 2) return 'period_of_structural_change';
  if (Math.abs(trendChange) > 0.3) {
    return trendChange > 0 ? 'period_of_trend_acceleration' : 'period_of_trend_deceleration';
  }
  if (volatilityChange > 0.2) return 'period_of_increased_variance';
  return 'period_of_relative_stability';
}

/**
 * Format period descriptor for display
 */
function formatPeriodDescriptor(descriptor: PeriodDescriptor): string {
  return descriptor
    .replace(/_/g, ' ')
    .replace('period of', 'Period of');
}

/**
 * Generate a unique observation ID
 */
function generateObservationId(): string {
  return `obs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create SHA-256 hash for data verification
 */
async function createVerificationHash(data: unknown): Promise<string> {
  const text = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Build alternative context (what else moved / didn't move)
 */
function buildAlternativeContext(
  primaryCorrelation: CorrelationResult,
  allCorrelations: CorrelationResult[],
  targetVariableId: string
): AlternativeContext {
  const alsoMoved = allCorrelations
    .filter(c => 
      c.variable_a_id !== targetVariableId && 
      c.variable_b_id !== targetVariableId &&
      Math.abs(c.pearson_r) > 0.3
    )
    .slice(0, 5)
    .map(c => ({
      variable_id: c.variable_a_id,
      variable_name: c.variable_a_id, // Would be replaced with actual name
      correlation: c.pearson_r,
      direction: c.pearson_r > 0 ? 'same' as const : 'opposite' as const
    }));
  
  const didNotMove = allCorrelations
    .filter(c => Math.abs(c.pearson_r) < 0.1)
    .slice(0, 5)
    .map(c => ({
      variable_id: c.variable_a_id,
      variable_name: c.variable_a_id
    }));
  
  // Placebo test: check if random correlations are similar
  const randomCorrelations = allCorrelations.slice(-5);
  const avgRandomCorr = randomCorrelations.length > 0
    ? randomCorrelations.reduce((sum, c) => sum + Math.abs(c.pearson_r), 0) / randomCorrelations.length
    : 0;
  
  return {
    also_moved: alsoMoved,
    did_not_move: didNotMove,
    placebo_test_passed: avgRandomCorr < Math.abs(primaryCorrelation.pearson_r) * 0.5,
    placebo_correlation: avgRandomCorr
  };
}

/**
 * Build observation limits section
 */
function buildLimits(
  periodStart: string,
  periodEnd: string,
  geoScope: string,
  methodologyChanges: string[] = []
): ObservationLimits {
  return {
    data_coverage: `${periodStart} to ${periodEnd}`,
    geographic_scope: geoScope,
    known_methodology_changes: methodologyChanges,
    missing_data_periods: [],
    what_this_does_not_show: [
      'Causal relationships between variables',
      'Intent or motivation behind changes',
      'Whether changes are "good" or "bad"',
      'Predictions about future values',
      'Policy recommendations'
    ]
  };
}

/**
 * Generate neutral observation text
 */
function generateObservationText(
  type: ObservationType,
  variableNames: string[],
  period: string,
  correlation?: number,
  stabilityLevel?: StabilityLevel
): string {
  let text = '';
  
  switch (type) {
    case 'deviation':
      text = `An observed deviation occurred in ${variableNames[0]} during ${period}.`;
      break;
    case 'comovement':
      if (correlation !== undefined && Math.abs(correlation) > 0.3) {
        text = `Variables ${variableNames[0]} and ${variableNames[1]} exhibited co-movement during ${period}.`;
        if (stabilityLevel === 'unstable' || stabilityLevel === 'low') {
          text += ` This co-movement was not stable across subperiods.`;
        }
      } else {
        text = `No consistent association observed between ${variableNames[0]} and ${variableNames[1]}.`;
      }
      break;
    case 'stability':
      text = stabilityLevel === 'high' || stabilityLevel === 'medium'
        ? `The pattern was consistent across subperiods and data sources.`
        : `The pattern varied significantly across subperiods.`;
      break;
    case 'alternative':
      text = `Multiple variables showed similar patterns during this time.`;
      break;
  }
  
  // Validate the generated text
  const validation = validateObservationLanguage(text);
  if (!validation.is_valid) {
    console.error('Generated text failed validation:', validation.violations);
    return validation.sanitized_text;
  }
  
  return text;
}

/**
 * Create a complete Observation Card
 */
export async function createObservationCard(
  type: ObservationType,
  variableIds: string[],
  variableNames: string[],
  periodStart: string,
  periodEnd: string,
  geoScope: string,
  correlation?: CorrelationResult,
  stabilityScore?: number,
  stabilityLevel?: StabilityLevel,
  context?: AlternativeContext
): Promise<ObservationCard> {
  const period = `${periodStart} to ${periodEnd}`;
  const observationText = generateObservationText(
    type,
    variableNames,
    period,
    correlation?.pearson_r,
    stabilityLevel
  );
  
  const rawData = { variableIds, periodStart, periodEnd, correlation };
  const verificationHash = await createVerificationHash(rawData);
  
  const card: ObservationCard = {
    id: generateObservationId(),
    created_at: new Date().toISOString(),
    observation_type: type,
    observation: {
      what: observationText,
      when: period,
      where: geoScope
    },
    strength: {
      correlation: correlation?.pearson_r,
      correlation_interval: correlation ? [
        correlation.pearson_r - 0.1, // Simplified CI
        correlation.pearson_r + 0.1
      ] : undefined,
      stability_score: stabilityScore ?? 0,
      stability_level: stabilityLevel ?? 'unstable'
    },
    context: context ?? {
      also_moved: [],
      did_not_move: [],
      placebo_test_passed: false,
      placebo_correlation: 0
    },
    limits: buildLimits(periodStart, periodEnd, geoScope),
    data_reference: {
      source_ids: variableIds,
      verification_hash: verificationHash,
      raw_data_url: `/api/raw-data?ids=${variableIds.join(',')}&start=${periodStart}&end=${periodEnd}`
    }
  };
  
  // Validate completeness
  const completeness = validateCompleteness({
    what: card.observation.what,
    when: card.observation.when,
    where: card.observation.where,
    alternatives_shown: card.context.also_moved.length > 0 || card.context.did_not_move.length > 0,
    limits_shown: card.limits.what_this_does_not_show.length > 0
  });
  
  if (!completeness.is_complete) {
    console.warn('Observation card missing elements:', completeness.missing);
  }
  
  return card;
}

/**
 * Process an AI observation request
 */
export async function processObservationRequest(
  request: AIObservationRequest
): Promise<AIObservationResponse> {
  const startTime = Date.now();
  const observations: ObservationCard[] = [];
  
  // Note: In production, this would fetch real data from the database
  // For now, we create placeholder observations
  
  const disclaimers = [
    'Observed patterns do not imply causation or intent.',
    'This analysis is limited to the available data period.',
    'Multiple variables showed similar patterns during this time.',
    'All observations are subject to data quality limitations.'
  ];
  
  // Create sample observation cards for each variable pair
  for (let i = 0; i < request.variable_ids.length; i++) {
    for (let j = i + 1; j < request.variable_ids.length; j++) {
      const card = await createObservationCard(
        'comovement',
        [request.variable_ids[i], request.variable_ids[j]],
        [request.variable_ids[i], request.variable_ids[j]], // Would use actual names
        request.period_start,
        request.period_end,
        request.geographic_scope?.join(', ') ?? 'SE',
        undefined,
        0.5,
        'medium'
      );
      observations.push(card);
    }
  }
  
  return {
    observations,
    metadata: {
      generated_at: new Date().toISOString(),
      model_version: '1.0.0',
      data_freshness: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    },
    disclaimers
  };
}

/**
 * Format observation for display with mandatory disclaimer
 */
export function formatObservationForDisplay(card: ObservationCard): string {
  let output = `## Observation\n\n`;
  output += `**What:** ${card.observation.what}\n`;
  output += `**When:** ${card.observation.when}\n`;
  output += `**Where:** ${card.observation.where}\n\n`;
  
  output += `### Strength\n`;
  if (card.strength.correlation !== undefined) {
    output += `- Correlation: ${card.strength.correlation.toFixed(3)} [${card.strength.correlation_interval?.[0].toFixed(3)}, ${card.strength.correlation_interval?.[1].toFixed(3)}]\n`;
  }
  output += `- Stability: ${card.strength.stability_level} (${(card.strength.stability_score * 100).toFixed(0)}%)\n\n`;
  
  output += `### Context\n`;
  if (card.context.also_moved.length > 0) {
    output += `**Also moved:** ${card.context.also_moved.map(v => v.variable_name).join(', ')}\n`;
  }
  if (card.context.did_not_move.length > 0) {
    output += `**Did not move:** ${card.context.did_not_move.map(v => v.variable_name).join(', ')}\n`;
  }
  output += `\n`;
  
  output += `### Limits\n`;
  for (const limit of card.limits.what_this_does_not_show) {
    output += `- ${limit}\n`;
  }
  
  return appendMandatoryDisclaimer(output);
}
