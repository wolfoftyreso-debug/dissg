/**
 * SEMANTIC ENGINE — The Heart of ST-OS
 * 
 * This is the entire system's execution loop.
 * No AI response may bypass this.
 * 
 * EXECUTION LOOP:
 * input →
 *   intent resolution →
 *     semantic view →
 *       importance calculation →
 *         guardrail enforcement →
 *           output contract →
 *             self-audit →
 *               deliver
 * 
 * NO SHORTCUT. NO BYPASS.
 */

import { TruthNode, createTruthNode } from '../ontology';
import { SemanticOutput, validateSemanticOutput, createEmptyOutput } from '../contracts/semantic-output';
import { UserIntent, ResolvedIntent, resolveIntent, Domain } from './intent-resolver';
import { SemanticView, selectSemanticView } from './view-selector';
import { ImportanceResult, calculateImportance } from './importance-engine';
import { enforceGuardrails, GuardrailError } from './guardrails';
import { selfAudit, AuditResult } from './self-audit';

/**
 * ENGINE RESULT
 */
export interface EngineResult {
  readonly success: boolean;
  readonly output: SemanticOutput | null;
  readonly context: EngineContext;
  readonly error?: EngineError;
}

export interface EngineContext {
  readonly request_id: string;
  readonly timestamp: string;
  readonly intent: ResolvedIntent;
  readonly view: SemanticView;
  readonly importance: readonly ImportanceResult[];
  readonly audit: AuditResult | null;
  readonly execution_time_ms: number;
}

export interface EngineError {
  readonly type: 'validation' | 'guardrail' | 'audit' | 'data' | 'unknown';
  readonly message: string;
  readonly details?: unknown;
}

/**
 * RUN SEMANTIC ENGINE — Main entry point
 */
export async function runSemanticEngine(input: UserIntent): Promise<EngineResult> {
  const startTime = Date.now();
  const request_id = generateRequestId();
  
  try {
    // 1. INTENT RESOLUTION
    const intent = resolveIntent(input);
    
    // 2. VIEW SELECTION
    const view = selectSemanticView(intent);
    
    // 3. FETCH TRUTH NODES
    const rawData = await fetchTruthNodes(view, intent.domain);
    
    // 4. IMPORTANCE CALCULATION
    const importance = calculateImportance(rawData);
    
    // 5. RENDER SEMANTIC OUTPUT
    const output = renderSemanticOutput(rawData, importance, intent, view);
    
    // 6. VALIDATE OUTPUT CONTRACT
    const validation = validateSemanticOutput(output);
    if (!validation.valid) {
      return createErrorResult(
        'validation',
        `Output contract violation: ${validation.errors.join(', ')}`,
        { request_id, intent, view, importance, startTime }
      );
    }
    
    // 7. ENFORCE GUARDRAILS
    try {
      enforceGuardrails(output);
    } catch (e) {
      if (e instanceof GuardrailError) {
        return createErrorResult(
          'guardrail',
          e.message,
          { request_id, intent, view, importance, startTime, details: e.violations }
        );
      }
      throw e;
    }
    
    // 8. SELF-AUDIT
    const audit = selfAudit(output);
    if (audit.action === 'block') {
      return createErrorResult(
        'audit',
        `Audit failed: ${audit.failures.join(', ')}`,
        { request_id, intent, view, importance, startTime, audit }
      );
    }
    
    // 9. DELIVER
    return {
      success: true,
      output,
      context: {
        request_id,
        timestamp: new Date().toISOString(),
        intent,
        view,
        importance,
        audit,
        execution_time_ms: Date.now() - startTime,
      },
    };
    
  } catch (error) {
    return {
      success: false,
      output: null,
      context: {
        request_id,
        timestamp: new Date().toISOString(),
        intent: resolveIntent(input),
        view: {} as SemanticView,
        importance: [],
        audit: null,
        execution_time_ms: Date.now() - startTime,
      },
      error: {
        type: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * FETCH TRUTH NODES — Get data from ontology
 */
async function fetchTruthNodes(
  view: SemanticView,
  domain: Domain
): Promise<TruthNode[]> {
  // In production, this would query the database
  // For now, return mock data that demonstrates structure
  
  const mockNode = createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'point', start: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.75,
      importance_rationale: 'Affects multiple interconnected systems',
    },
    0.85
  );
  
  return [mockNode];
}

/**
 * RENDER SEMANTIC OUTPUT — Transform nodes to output
 */
function renderSemanticOutput(
  nodes: TruthNode[],
  importance: ImportanceResult[],
  intent: ResolvedIntent,
  view: SemanticView
): SemanticOutput {
  const output = createEmptyOutput();
  
  // Build orientation from nodes
  const orientation = {
    baseline: 'Historical 10-year average within normal range',
    deviation: 'Current values are above historical baseline',
    direction: 'increasing' as const,
    magnitude: 'medium' as const,
    persistence: 'medium' as const,
  };
  
  // Build importance from calculations
  const importanceBlock = {
    structural: importance.some(i => i.structural),
    acute: importance.some(i => i.acute),
    contextual: importance.every(i => i.contextual),
    rationale: importance.flatMap(i => i.rationale),
    score: importance.reduce((sum, i) => sum + i.score, 0) / importance.length || 0,
  };
  
  // Build uncertainty
  const uncertainty = {
    sources: [{
      type: 'measurement' as const,
      description: 'Self-report surveys have inherent bias',
      impact: 'medium' as const,
    }],
    data_gaps: ['Regional breakdown not available for latest period'],
    confidence: nodes[0]?.confidence || 0.7,
    methodology_notes: ['Methodology consistent since 2015'],
  };
  
  return {
    orientation,
    importance: importanceBlock,
    why_it_matters: [
      'Affects resource allocation across healthcare system',
      'Connected to workforce capacity in related sectors',
    ],
    what_it_does_not_mean: [
      'This is population-level data and cannot be applied to individuals',
      'Correlation with other indicators does not imply causation',
    ],
    uncertainty,
    next_valid_questions: [
      'How does this compare to other Nordic countries?',
      'What is the breakdown by age group?',
      'How has this changed over the past decade?',
    ],
    metadata: {
      generated_at: new Date().toISOString(),
      node_ids: nodes.map(n => n.node_id),
      data_freshness: '2024-01-01',
      methodology_version: '1.0.0',
      checksum: generateChecksum(nodes),
    },
  };
}

/**
 * HELPER: Generate request ID
 */
function generateRequestId(): string {
  return `see_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * HELPER: Generate checksum
 */
function generateChecksum(nodes: TruthNode[]): string {
  const input = nodes.map(n => n.node_id).join(':');
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * HELPER: Create error result
 */
function createErrorResult(
  type: EngineError['type'],
  message: string,
  context: {
    request_id: string;
    intent: ResolvedIntent;
    view: SemanticView;
    importance: ImportanceResult[];
    startTime: number;
    audit?: AuditResult;
    details?: unknown;
  }
): EngineResult {
  return {
    success: false,
    output: null,
    context: {
      request_id: context.request_id,
      timestamp: new Date().toISOString(),
      intent: context.intent,
      view: context.view,
      importance: context.importance,
      audit: context.audit || null,
      execution_time_ms: Date.now() - context.startTime,
    },
    error: {
      type,
      message,
      details: context.details,
    },
  };
}
