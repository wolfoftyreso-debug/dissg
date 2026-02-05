/**
 * SEMANTIC EXECUTION ENGINE (SEE)
 * 
 * The orchestrator between all ST-OS components.
 * 
 * CORE PRINCIPLE (ABSOLUTE):
 * Nothing in the system may depend on "a clever model".
 * All intelligence must be externalized, controlled, and repeatable.
 * 
 * SEE does exactly five things:
 * 1. Interprets intention (not meaning)
 * 2. Selects semantic view (not answer)
 * 3. Determines priority (UIE)
 * 4. Activates correct master prompts
 * 5. Validates output against all guardrails
 * 
 * No model may bypass SEE. None.
 */

import { ImportanceClass } from '../semantic-os/importance-engine';
import { GuardfenceType, checkGuardfences } from '../semantic-os/guardfences';

/**
 * SEE EXECUTION CONTEXT
 */
export interface SEEContext {
  readonly request_id: string;
  readonly timestamp: string;
  readonly intention: IntentionClassification;
  readonly semantic_view: SemanticViewType;
  readonly priority: ImportanceClass;
  readonly active_prompts: PromptLevel[];
  readonly domain: string;
  readonly geographic_scope: string;
  readonly time_scope: string;
  readonly user_context?: UserContext;
}

/**
 * INTENTION CLASSIFICATION
 * What the user wants to accomplish (not what they said)
 */
export interface IntentionClassification {
  readonly primary: IntentionType;
  readonly secondary?: IntentionType;
  readonly confidence: number;
  readonly requires_depth: 1 | 2 | 3 | 4 | 5;
  readonly requires_comparison: boolean;
  readonly requires_history: boolean;
}

export type IntentionType =
  | 'understand_state'      // What is happening?
  | 'understand_change'     // What changed?
  | 'understand_importance' // Why does this matter?
  | 'compare'               // How does X compare to Y?
  | 'explore_connections'   // What relates to this?
  | 'explore_depth'         // Tell me more
  | 'verify_claim'          // Is this true?
  | 'find_uncertainty'      // What don't we know?
  | 'historical_query';     // What was it like in year X?

/**
 * SEMANTIC VIEW TYPE
 * The lens through which to present information
 */
export type SemanticViewType =
  | 'orientation'           // Quick overview
  | 'deep_dive'             // Detailed exploration
  | 'comparison'            // Side-by-side analysis
  | 'historical'            // Time-based view
  | 'relational'            // Connection graph
  | 'uncertainty_focused';  // What we don't know

/**
 * PROMPT LEVEL
 */
export type PromptLevel = 0 | 1 | 2 | 3 | 4;

/**
 * USER CONTEXT
 */
export interface UserContext {
  readonly session_id?: string;
  readonly previous_queries?: string[];
  readonly depth_preference?: number;
  readonly domain_expertise?: 'novice' | 'intermediate' | 'expert';
}

/**
 * SEE EXECUTION RESULT
 */
export interface SEEResult {
  readonly context: SEEContext;
  readonly output: SemanticOutput;
  readonly validation: ValidationResult;
  readonly audit: SelfAuditResult;
  readonly execution_time_ms: number;
}

/**
 * SEMANTIC OUTPUT (REQUIRED CONTRACT)
 */
export interface SemanticOutput {
  readonly semantic_orientation: {
    readonly what_is_normal: string;
    readonly what_is_changing: string;
    readonly what_is_important: string;
  };
  readonly why_it_matters: readonly string[];
  readonly what_it_does_not_mean: readonly string[];
  readonly uncertainties: readonly string[];
  readonly next_valid_questions: readonly string[];
  readonly data_sources: readonly string[];
  readonly confidence: number;
}

/**
 * VALIDATION RESULT
 */
export interface ValidationResult {
  readonly passed: boolean;
  readonly guardfence_violations: GuardfenceType[];
  readonly contract_violations: string[];
  readonly blocked: boolean;
  readonly regeneration_required: boolean;
}

/**
 * SELF-AUDIT RESULT
 */
export interface SelfAuditResult {
  readonly gave_advice: boolean;
  readonly implied_action: boolean;
  readonly exceeded_data: boolean;
  readonly mixed_levels: boolean;
  readonly lost_history: boolean;
  readonly passed: boolean;
  readonly issues: string[];
}

/**
 * CLASSIFY INTENTION
 */
export function classifyIntention(query: string): IntentionClassification {
  const lowered = query.toLowerCase();
  
  // Pattern matching for intention
  let primary: IntentionType = 'understand_state';
  let requires_depth: 1 | 2 | 3 | 4 | 5 = 1;
  let requires_comparison = false;
  let requires_history = false;
  
  if (lowered.includes('why') || lowered.includes('matters') || lowered.includes('important')) {
    primary = 'understand_importance';
    requires_depth = 2;
  } else if (lowered.includes('changed') || lowered.includes('trend') || lowered.includes('increasing') || lowered.includes('decreasing')) {
    primary = 'understand_change';
    requires_depth = 2;
  } else if (lowered.includes('compare') || lowered.includes('versus') || lowered.includes('vs')) {
    primary = 'compare';
    requires_comparison = true;
  } else if (lowered.includes('related') || lowered.includes('connected') || lowered.includes('affects')) {
    primary = 'explore_connections';
    requires_depth = 3;
  } else if (lowered.includes('more') || lowered.includes('detail') || lowered.includes('explain')) {
    primary = 'explore_depth';
    requires_depth = 3;
  } else if (lowered.includes('true') || lowered.includes('verify') || lowered.includes('correct')) {
    primary = 'verify_claim';
    requires_depth = 2;
  } else if (lowered.includes('uncertain') || lowered.includes('unknown') || lowered.includes('gap')) {
    primary = 'find_uncertainty';
    requires_depth = 4;
  } else if (lowered.includes('was') || lowered.includes('were') || lowered.includes('history') || /\b(19|20)\d{2}\b/.test(query)) {
    primary = 'historical_query';
    requires_history = true;
    requires_depth = 3;
  }
  
  return {
    primary,
    confidence: 0.8,
    requires_depth,
    requires_comparison,
    requires_history,
  };
}

/**
 * SELECT SEMANTIC VIEW
 */
export function selectSemanticView(intention: IntentionClassification): SemanticViewType {
  switch (intention.primary) {
    case 'understand_state':
      return 'orientation';
    case 'understand_change':
    case 'explore_depth':
      return 'deep_dive';
    case 'compare':
      return 'comparison';
    case 'historical_query':
      return 'historical';
    case 'explore_connections':
      return 'relational';
    case 'find_uncertainty':
      return 'uncertainty_focused';
    default:
      return 'orientation';
  }
}

/**
 * DETERMINE ACTIVE PROMPTS
 */
export function determineActivePrompts(
  intention: IntentionClassification,
  domain: string
): PromptLevel[] {
  const prompts: PromptLevel[] = [0, 1]; // Constitution + ST-OS always active
  
  // Add HCAL if depth required
  if (intention.requires_depth >= 2) {
    prompts.push(2);
  }
  
  // Add domain prompt
  if (domain) {
    prompts.push(3);
  }
  
  // Add interaction prompt
  prompts.push(4);
  
  return prompts;
}

/**
 * VALIDATE OUTPUT CONTRACT
 */
export function validateOutputContract(output: Partial<SemanticOutput>): {
  valid: boolean;
  missing: string[];
} {
  const required = [
    'semantic_orientation',
    'why_it_matters',
    'what_it_does_not_mean',
    'uncertainties',
    'next_valid_questions',
  ];
  
  const missing: string[] = [];
  
  for (const field of required) {
    if (!(field in output) || output[field as keyof SemanticOutput] === undefined) {
      missing.push(field);
    }
  }
  
  // Check semantic_orientation sub-fields
  if (output.semantic_orientation) {
    if (!output.semantic_orientation.what_is_normal) missing.push('semantic_orientation.what_is_normal');
    if (!output.semantic_orientation.what_is_changing) missing.push('semantic_orientation.what_is_changing');
    if (!output.semantic_orientation.what_is_important) missing.push('semantic_orientation.what_is_important');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * SELF-AUDIT (ANTI-HALLUCINATION)
 */
export function selfAudit(text: string): SelfAuditResult {
  const issues: string[] = [];
  
  // Check: Gave advice?
  const advicePatterns = [/you should/i, /i recommend/i, /i suggest/i, /you need to/i, /you must/i];
  const gave_advice = advicePatterns.some(p => p.test(text));
  if (gave_advice) issues.push('Output contains advice');
  
  // Check: Implied action?
  const actionPatterns = [/should/i, /must/i, /optimal/i, /best\s+(to|approach|way)/i];
  const implied_action = actionPatterns.some(p => p.test(text));
  if (implied_action) issues.push('Output implies action');
  
  // Check: Exceeded data?
  const speculationPatterns = [/probably/i, /likely\s+will/i, /will\s+definitely/i, /certainly\s+will/i];
  const exceeded_data = speculationPatterns.some(p => p.test(text));
  if (exceeded_data) issues.push('Output contains speculation beyond data');
  
  // Check: Mixed levels?
  const individualPatterns = [/you\s+personally/i, /in\s+your\s+case/i, /for\s+you\s+specifically/i];
  const mixed_levels = individualPatterns.some(p => p.test(text));
  if (mixed_levels) issues.push('Output mixes population and individual levels');
  
  // Check: Lost history?
  const lost_history = false; // Would need context to check
  
  return {
    gave_advice,
    implied_action,
    exceeded_data,
    mixed_levels,
    lost_history,
    passed: issues.length === 0,
    issues,
  };
}

/**
 * EXECUTE SEE PIPELINE
 */
export function executeSEE(
  query: string,
  domain: string,
  outputText: string
): SEEResult {
  const startTime = Date.now();
  
  // 1. Classify intention
  const intention = classifyIntention(query);
  
  // 2. Select semantic view
  const semantic_view = selectSemanticView(intention);
  
  // 3. Determine active prompts
  const active_prompts = determineActivePrompts(intention, domain);
  
  // 4. Create context
  const context: SEEContext = {
    request_id: `see_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    intention,
    semantic_view,
    priority: 'contextual', // Would be determined by UIE
    active_prompts,
    domain,
    geographic_scope: 'global',
    time_scope: 'current',
  };
  
  // 5. Validate guardfences
  const guardfenceCheck = checkGuardfences(outputText);
  
  // 6. Self-audit
  const audit = selfAudit(outputText);
  
  // 7. Create validation result
  const validation: ValidationResult = {
    passed: guardfenceCheck.passed && audit.passed,
    guardfence_violations: guardfenceCheck.violations.map(v => v.fence),
    contract_violations: [],
    blocked: !guardfenceCheck.passed,
    regeneration_required: !audit.passed,
  };
  
  // 8. Create placeholder output (would be generated by AI)
  const output: SemanticOutput = {
    semantic_orientation: {
      what_is_normal: '',
      what_is_changing: '',
      what_is_important: '',
    },
    why_it_matters: [],
    what_it_does_not_mean: [],
    uncertainties: [],
    next_valid_questions: [],
    data_sources: [],
    confidence: 0,
  };
  
  return {
    context,
    output,
    validation,
    audit,
    execution_time_ms: Date.now() - startTime,
  };
}
