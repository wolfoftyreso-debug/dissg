/**
 * UNIVERSAL DECISION FORMAT (UDF) GENERATOR
 * 
 * All CDPs follow the same 6 steps.
 * Consistency across all domains.
 * Humans learn to read decisions. AI learns to navigate them.
 */

import type {
  UniversalDecisionFormat,
  Assumption,
  Alternative,
  TradeOff,
  UncertaintyBlock,
  DecisionScope,
} from './types';
import type { ConditionalDecisionPage, DecisionBlueprint } from '../types';

/**
 * Generate UDF from CDP
 */
export function generateUDF(
  cdp: ConditionalDecisionPage,
  blueprint: DecisionBlueprint
): UniversalDecisionFormat {
  return {
    udf_id: `udf_${cdp.cdp_id}`,
    
    // Step 1: What decision is this actually about?
    actual_decision: extractActualDecision(cdp, blueprint),
    
    // Step 2: Who does this apply to?
    applicability: extractApplicability(cdp, blueprint),
    
    // Step 3: What assumptions are required?
    required_assumptions: extractAssumptions(cdp),
    
    // Step 4: What are the realistic alternatives?
    alternatives: extractAlternatives(cdp, blueprint),
    
    // Step 5: What are the dominant trade-offs?
    trade_offs: extractTradeOffs(cdp),
    
    // Step 6: What is uncertain or unknown?
    uncertainty: extractUncertainty(cdp),
    
    generated_at: new Date().toISOString(),
    valid_until: calculateValidUntil(blueprint.time_horizon),
    version: 1,
  };
}

/**
 * Step 1: Extract actual decision
 */
function extractActualDecision(
  cdp: ConditionalDecisionPage,
  blueprint: DecisionBlueprint
): UniversalDecisionFormat['actual_decision'] {
  const query = cdp.query;
  // Map surface question to underlying decision
  const underlyingDecisions: Record<string, string> = {
    'is_x_good': 'Whether to choose X over alternatives',
    'should_i_buy': 'Whether purchase is rational given your situation',
    'x_vs_y': 'Which option better fits your specific needs',
    'is_x_worth_price': 'Whether value justifies cost for your use case',
    'problems_with_x': 'Whether known issues affect your specific situation',
    'pros_cons_x': 'Whether trade-offs align with your priorities',
  };
  
  const underlying = underlyingDecisions[blueprint.decision_type] ||
    'Whether this option fits your specific circumstances';
  
  // Calculate stakes
  const stakes = calculateStakes(blueprint);
  
  return {
    surface_question: query,
    underlying_decision: underlying,
    decision_type: blueprint.decision_type,
    stakes,
  };
}

/**
 * Calculate decision stakes
 */
function calculateStakes(
  blueprint: DecisionBlueprint
): 'low' | 'medium' | 'high' | 'critical' {
  if (blueprint.risk_exposure === 'critical') return 'critical';
  if (blueprint.risk_exposure === 'high') return 'high';
  
  // Time horizon affects stakes
  if (blueprint.time_horizon === 'lifetime') return 'high';
  if (blueprint.time_horizon === 'multi_year') return 'medium';
  
  return blueprint.risk_exposure === 'medium' ? 'medium' : 'low';
}

/**
 * Step 2: Extract applicability
 */
function extractApplicability(
  cdp: ConditionalDecisionPage,
  blueprint: DecisionBlueprint
): UniversalDecisionFormat['applicability'] {
  // Extract from scope blocks (1-5)
  const _scopeBlocks = cdp.blocks.filter(b => b.block_id <= 5);
  
  const appliesTo: string[] = [];
  const doesNotApplyTo: string[] = [];
  
  // Based on decision type, determine applicability
  if (blueprint.decision_type.includes('consumer')) {
    appliesTo.push('Individual consumers', 'Household decision-makers');
  }
  if (blueprint.decision_type.includes('investment')) {
    appliesTo.push('Individual investors', 'Financial planners');
    doesNotApplyTo.push('Institutional investors with different constraints');
  }
  
  // Add exclusions based on time horizon
  if (blueprint.time_horizon === 'lifetime') {
    doesNotApplyTo.push('Short-term users', 'Temporary needs');
  }
  
  return {
    applies_to: appliesTo.length > 0 ? appliesTo : ['General audience'],
    does_not_apply_to: doesNotApplyTo,
    geographic_scope: 'Global (may vary by region)',
    temporal_scope: `Analysis valid for ${blueprint.time_horizon} decisions`,
  };
}

/**
 * Step 3: Extract assumptions
 */
function extractAssumptions(cdp: ConditionalDecisionPage): Assumption[] {
  const assumptions: Assumption[] = [];
  
  // Always include these core assumptions
  assumptions.push({
    assumption_id: 'budget',
    variable: 'budget_range',
    description: 'Your available budget for this decision',
    current_value: 'medium',
    allowed_values: ['low', 'medium', 'high', 'unlimited'],
    impact_if_wrong: 'significant',
    is_user_adjustable: true,
  });
  
  assumptions.push({
    assumption_id: 'timeline',
    variable: 'decision_timeline',
    description: 'How long you plan to live with this decision',
    current_value: 'multi_year',
    allowed_values: ['immediate', 'short_term', 'multi_year', 'lifetime'],
    impact_if_wrong: 'decision_reversal',
    is_user_adjustable: true,
  });
  
  assumptions.push({
    assumption_id: 'risk',
    variable: 'risk_tolerance',
    description: 'Your comfort with uncertainty and potential downsides',
    current_value: 'normal',
    allowed_values: ['low', 'normal', 'high'],
    impact_if_wrong: 'significant',
    is_user_adjustable: true,
  });
  
  // Extract from stated assumptions
  for (const stated of cdp.stated_assumptions) {
    assumptions.push({
      assumption_id: `stated_${assumptions.length}`,
      variable: 'context_assumption',
      description: stated,
      current_value: true,
      allowed_values: [true, false],
      impact_if_wrong: 'moderate',
      is_user_adjustable: false,
    });
  }
  
  return assumptions;
}

/**
 * Step 4: Extract alternatives
 */
function extractAlternatives(
  cdp: ConditionalDecisionPage,
  _blueprint: DecisionBlueprint
): Alternative[] {
  const alternatives: Alternative[] = [];
  
  // Primary option (the query subject)
  const querySubject = cdp.query.replace(/is|good|should|buy|i/gi, '').trim();
  alternatives.push({
    alternative_id: 'primary',
    name: querySubject || 'Primary option',
    description: 'The option you asked about',
    category: 'primary_consideration',
    comparable: true,
    why_included: 'This is what you asked about',
    key_differences: [],
  });
  
  // Do nothing alternative (always valid)
  alternatives.push({
    alternative_id: 'do_nothing',
    name: 'Do nothing / Keep current situation',
    description: 'The option of not making a change',
    category: 'baseline',
    comparable: true,
    why_included: 'The baseline for comparison - what happens if you don\'t decide',
    key_differences: ['No immediate cost', 'No change risk', 'Opportunity cost'],
  });
  
  // Placeholder for comparable alternatives
  alternatives.push({
    alternative_id: 'alternative_1',
    name: 'Comparable Alternative 1',
    description: 'A realistic alternative in the same category',
    category: 'direct_competitor',
    comparable: true,
    why_included: 'Provides meaningful comparison point',
    key_differences: ['Different feature set', 'Different price point'],
  });
  
  return alternatives;
}

/**
 * Step 5: Extract trade-offs
 */
function extractTradeOffs(cdp: ConditionalDecisionPage): TradeOff[] {
  const tradeOffs: TradeOff[] = [];
  
  // Universal trade-offs present in most decisions
  tradeOffs.push({
    trade_off_id: 'cost_quality',
    dimension_a: 'Cost',
    dimension_b: 'Quality',
    relationship: 'inverse',
    description: 'Higher quality typically comes at higher cost',
    who_cares: ['Budget-conscious users', 'Value seekers'],
    magnitude: 'major',
  });
  
  tradeOffs.push({
    trade_off_id: 'flexibility_commitment',
    dimension_a: 'Flexibility',
    dimension_b: 'Commitment benefits',
    relationship: 'inverse',
    description: 'Greater commitment often yields better terms but less flexibility',
    who_cares: ['Uncertain users', 'Long-term planners'],
    magnitude: 'moderate',
  });
  
  tradeOffs.push({
    trade_off_id: 'immediate_longterm',
    dimension_a: 'Immediate benefits',
    dimension_b: 'Long-term value',
    relationship: 'conditional',
    description: 'Short-term gains may come at cost of long-term value',
    who_cares: ['Short-term users', 'Long-term investors'],
    magnitude: 'major',
  });
  
  // Extract from trade-off blocks (36-45) - for future enhancement
  const _tradeOffBlocks = cdp.blocks.filter(
    b => b.block_id >= 36 && b.block_id <= 45 && b.has_content
  );
  
  // Would parse actual content in production from _tradeOffBlocks
  
  return tradeOffs;
}

/**
 * Step 6: Extract uncertainty
 */
function extractUncertainty(cdp: ConditionalDecisionPage): UncertaintyBlock {
  // Extract from uncertainty blocks (46-50) - for future enhancement
  const _uncertaintyBlocks = cdp.blocks.filter(
    b => b.block_id >= 46 && b.block_id <= 50
  );
  
  const emptyBlocks = cdp.blocks.filter(b => !b.has_content);
  
  return {
    known_unknowns: [
      {
        variable: 'future_market_conditions',
        why_unknown: 'Market conditions change unpredictably',
        potential_range: 'Could shift 10-50% from current state',
        impact_on_decision: 'May affect relative value of alternatives',
      },
      {
        variable: 'personal_circumstances',
        why_unknown: 'Your situation may change',
        potential_range: 'Life changes could alter priorities',
        impact_on_decision: 'May change which trade-offs matter most',
      },
    ],
    data_gaps: emptyBlocks.map(b => b.question || `Block ${b.block_id} missing data`),
    methodology_limitations: [
      'Historical data may not predict future',
      'Aggregated data may not match your specific case',
      'Some factors are inherently unquantifiable',
    ],
    time_sensitivity: 'This analysis reflects current conditions and may change',
    confidence_statement: generateConfidenceStatement(cdp),
  };
}

/**
 * Generate confidence statement
 */
function generateConfidenceStatement(cdp: ConditionalDecisionPage): string {
  const filledBlocks = cdp.blocks.filter(b => b.has_content).length;
  const fillRate = filledBlocks / 50;
  
  if (fillRate >= 0.8) {
    return 'High data coverage. Main conclusions are well-supported but not guaranteed.';
  }
  if (fillRate >= 0.5) {
    return 'Moderate data coverage. Some conclusions have limited support.';
  }
  return 'Limited data coverage. Treat conclusions as preliminary.';
}

/**
 * Calculate valid until date
 */
function calculateValidUntil(timeHorizon: string): string {
  const now = new Date();
  const days: Record<string, number> = {
    immediate: 7,
    short_term: 30,
    multi_year: 90,
    lifetime: 180,
  };
  
  now.setDate(now.getDate() + (days[timeHorizon] || 30));
  return now.toISOString();
}

/**
 * Apply user scope to UDF
 */
export function applyScope(
  udf: UniversalDecisionFormat,
  scope: DecisionScope
): UniversalDecisionFormat {
  // Update assumptions based on scope
  const updatedAssumptions = udf.required_assumptions.map(a => {
    if (a.variable === 'risk_tolerance' && scope.risk_tolerance) {
      return { ...a, current_value: scope.risk_tolerance };
    }
    if (a.variable === 'decision_timeline' && scope.time_horizon) {
      const mapping = { short: 'short_term', medium: 'multi_year', long: 'lifetime' };
      return { ...a, current_value: mapping[scope.time_horizon] || a.current_value };
    }
    return a;
  });
  
  // Filter trade-offs by relevance to scope
  const relevantTradeOffs = udf.trade_offs.filter(t => {
    if (scope.time_horizon === 'short' && t.trade_off_id === 'immediate_longterm') {
      return false; // Less relevant for short-term
    }
    return true;
  });
  
  return {
    ...udf,
    required_assumptions: updatedAssumptions,
    trade_offs: relevantTradeOffs,
  };
}

/**
 * UDF GENERATOR MASTERPROMPT
 */
export const UDF_GENERATOR_MASTERPROMPT = `
You generate UNIVERSAL DECISION FORMAT (UDF).

ALL CDPs follow the same 6 steps:

1. WHAT DECISION IS THIS ACTUALLY ABOUT?
   - Surface question → Underlying decision
   - Classify decision type
   - Calculate stakes

2. WHO DOES THIS APPLY TO?
   - Explicit applicability
   - Explicit exclusions
   - Geographic and temporal scope

3. WHAT ASSUMPTIONS ARE REQUIRED?
   - Budget, timeline, risk tolerance
   - Context assumptions
   - Impact if wrong

4. WHAT ARE THE REALISTIC ALTERNATIVES?
   - Primary option (what they asked)
   - Do nothing (baseline)
   - Comparable alternatives

5. WHAT ARE THE DOMINANT TRADE-OFFS?
   - Never hidden
   - Who cares about each
   - Magnitude of each

6. WHAT IS UNCERTAIN OR UNKNOWN?
   - Known unknowns
   - Data gaps
   - Methodology limitations
   - Confidence statement

RESULT:
- Humans learn to read decisions
- AI learns to navigate decisions
- System feels consistent across all domains

NEVER:
- Recommend
- Rank
- Use superlatives
- Give imperatives
`;
