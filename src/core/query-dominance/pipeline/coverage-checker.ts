/**
 * PIPELINE STAGE 4: DATA COVERAGE CHECK
 * 
 * Stops garbage before it gets built.
 * If build_allowed = false → "This cannot yet be answered reliably"
 * (That is also dominance.)
 */

import type {
  CoverageCheck,
  DataGap,
  ResolvedEntity,
  NormalizedIntent,
} from './types';
import { BLOCK_GROUPS } from '../question-blocks';

/**
 * Check data coverage for entity + intent combination
 */
export function checkCoverage(
  entity: ResolvedEntity,
  intent: NormalizedIntent,
  availableData: AvailableDataSummary
): CoverageCheck {
  const gaps: DataGap[] = [];
  
  // Check each block group for coverage
  for (const group of BLOCK_GROUPS) {
    const groupGaps = checkBlockGroupCoverage(group.group_id, entity, intent, availableData);
    gaps.push(...groupGaps);
  }
  
  // Check alternatives requirement
  if (intent.alternatives_required && availableData.comparableAlternatives < 2) {
    gaps.push({
      gap_id: 'gap_alternatives',
      block_group: 'dominance_tradeoffs',
      description: 'Fewer than 2 comparable alternatives available',
      severity: 'blocking',
      can_proceed_without: false,
      potential_sources: ['product_databases', 'market_research', 'official_registries'],
    });
  }
  
  // Calculate coverage level
  const blockingGaps = gaps.filter(g => g.severity === 'blocking');
  const degradingGaps = gaps.filter(g => g.severity === 'degrading');
  
  let coverage: CoverageCheck['coverage'];
  let buildAllowed: boolean;
  let reason: string | undefined;
  
  if (blockingGaps.length > 0) {
    coverage = 'insufficient';
    buildAllowed = false;
    reason = `Blocking gaps: ${blockingGaps.map(g => g.description).join('; ')}`;
  } else if (degradingGaps.length > 3) {
    coverage = 'partial';
    buildAllowed = true;
    reason = `Multiple degrading gaps will limit analysis quality`;
  } else {
    coverage = 'sufficient';
    buildAllowed = true;
  }
  
  return {
    entity_id: entity.entity_id,
    intent_id: intent.intent_id,
    coverage,
    gaps,
    build_allowed: buildAllowed,
    reason,
    checked_at: new Date().toISOString(),
  };
}

/**
 * Check coverage for a specific block group
 */
function checkBlockGroupCoverage(
  groupId: string,
  entity: ResolvedEntity,
  intent: NormalizedIntent,
  data: AvailableDataSummary
): DataGap[] {
  const gaps: DataGap[] = [];
  
  switch (groupId) {
    case 'scope_assumptions':
      if (!data.hasBasicInfo) {
        gaps.push({
          gap_id: `gap_${groupId}_basic`,
          block_group: groupId,
          description: 'Basic entity information missing',
          severity: 'blocking',
          can_proceed_without: false,
          potential_sources: ['official_databases', 'manufacturer_data'],
        });
      }
      break;
      
    case 'cost_resources':
      if (!data.hasCostData) {
        gaps.push({
          gap_id: `gap_${groupId}_cost`,
          block_group: groupId,
          description: 'Cost/pricing data unavailable',
          severity: intent.decision_type.includes('value') ? 'blocking' : 'degrading',
          can_proceed_without: !intent.decision_type.includes('value'),
          potential_sources: ['price_aggregators', 'market_data', 'official_price_lists'],
        });
      }
      if (!data.hasTCOData && intent.time_horizon === 'multi_year') {
        gaps.push({
          gap_id: `gap_${groupId}_tco`,
          block_group: groupId,
          description: 'Total cost of ownership data missing',
          severity: 'degrading',
          can_proceed_without: true,
          potential_sources: ['industry_reports', 'user_surveys', 'maintenance_databases'],
        });
      }
      break;
      
    case 'performance_reliability':
      if (!data.hasReliabilityData) {
        gaps.push({
          gap_id: `gap_${groupId}_reliability`,
          block_group: groupId,
          description: 'Reliability/failure statistics unavailable',
          severity: intent.risk_exposure === 'high' ? 'blocking' : 'degrading',
          can_proceed_without: intent.risk_exposure !== 'high',
          potential_sources: ['quality_surveys', 'warranty_data', 'user_reports'],
        });
      }
      break;
      
    case 'risk_failure_modes':
      if (!data.hasRiskData && (intent.risk_exposure === 'high' || intent.risk_exposure === 'critical')) {
        gaps.push({
          gap_id: `gap_${groupId}_risk`,
          block_group: groupId,
          description: 'Risk/failure mode data missing for high-risk decision',
          severity: 'blocking',
          can_proceed_without: false,
          potential_sources: ['safety_databases', 'incident_reports', 'regulatory_data'],
        });
      }
      break;
      
    case 'dominance_tradeoffs':
      if (!data.hasComparativeData) {
        gaps.push({
          gap_id: `gap_${groupId}_comparative`,
          block_group: groupId,
          description: 'Comparative analysis data unavailable',
          severity: intent.alternatives_required ? 'blocking' : 'degrading',
          can_proceed_without: !intent.alternatives_required,
          potential_sources: ['comparison_studies', 'benchmark_tests', 'market_analysis'],
        });
      }
      break;
      
    case 'uncertainty_nonknowledge':
      // This group is always fillable (with "we don't know" statements)
      break;
  }
  
  return gaps;
}

/**
 * Available data summary (input to coverage check)
 */
export interface AvailableDataSummary {
  hasBasicInfo: boolean;
  hasCostData: boolean;
  hasTCOData: boolean;
  hasReliabilityData: boolean;
  hasRiskData: boolean;
  hasComparativeData: boolean;
  comparableAlternatives: number;
  dataFreshness: 'current' | 'stale' | 'unknown';
  sourceCount: number;
}

/**
 * Create "cannot yet be answered" response
 */
export function createCannotAnswerResponse(
  check: CoverageCheck
): {
  message: string;
  gaps: string[];
  what_would_help: string[];
} {
  return {
    message: 'This cannot yet be answered reliably.',
    gaps: check.gaps.filter(g => g.severity === 'blocking').map(g => g.description),
    what_would_help: check.gaps.flatMap(g => g.potential_sources),
  };
}

/**
 * COVERAGE CHECKER MASTERPROMPT
 */
export const COVERAGE_CHECKER_MASTERPROMPT = `
You perform DATA COVERAGE CHECK.

PRINCIPLE:
Stops garbage before it gets built.
"Cannot answer reliably" is also dominance.

BEFORE BUILDING, CHECK:
- Sufficient historical data?
- At least 2 comparable alternatives?
- Cost, risk, and performance data available?

OUTPUT:
{
  "coverage": "sufficient",
  "gaps": ["long-term EV battery degradation"],
  "build_allowed": true
}

IF build_allowed = false:
→ Publish "This cannot yet be answered reliably"
→ List gaps clearly
→ Show what would help

GAP SEVERITIES:
- blocking: Cannot proceed, essential data missing
- degrading: Can proceed but quality limited
- cosmetic: Nice to have, not essential

RULES:
- Never build on insufficient data
- Always show gaps openly
- Blocking gaps stop the pipeline
- "Cannot answer" is a valid output
- Transparency about limitations builds trust
`;
