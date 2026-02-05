/**
 * MAO ANSWER PIPELINE
 * 
 * User/Agent Question → Intent Matcher → Answer Packet Resolver →
 * Query-DSL → Truth Engine Core → Answer Renderer → Safety Check → Response
 */

import type { AnswerRequest } from './request-schema';
import type { UnifiedAnswerBody, DomainCode } from './unified-body';
import type { CanonicalAnswerTypeCode } from './canonical-types';
import type { MAOResponse } from './response-envelope';
import { detectCrisis, getCrisisResources, type CrisisResource } from './crisis-detector';
import { createSuccessResponse, createBlockedResponse, createNoDataResponse } from './response-envelope';
import { generateRequestId } from './request-schema';

/**
 * CRISIS ANSWER BODY (Special type for crisis responses)
 */
export interface CrisisAnswerBody {
  readonly answer_id: string;
  readonly answer_type: 'crisis_support';
  readonly domain: 'crisis';
  readonly language: string;
  readonly generated_at: string;
  readonly mode: 'crisis_support';
  readonly text: string;
  readonly resources: readonly CrisisResource[];
  readonly immediate_action?: string;
}

/**
 * PIPELINE STAGE
 */
export type PipelineStage = 
  | 'intent_matching'
  | 'crisis_detection'
  | 'answer_resolution'
  | 'query_execution'
  | 'safety_check'
  | 'rendering';

/**
 * PIPELINE CONTEXT
 */
export interface PipelineContext {
  readonly request_id: string;
  readonly start_time: number;
  readonly request: AnswerRequest;
  current_stage: PipelineStage;
  readonly traces: PipelineTrace[];
}

/**
 * PIPELINE TRACE
 */
interface PipelineTrace {
  readonly stage: PipelineStage;
  readonly timestamp: number;
  readonly duration_ms: number;
  readonly result: 'success' | 'blocked' | 'fallback' | 'error';
  readonly details?: string;
}

/**
 * CREATE PIPELINE CONTEXT
 */
export function createPipelineContext(request: AnswerRequest): PipelineContext {
  return {
    request_id: request.request_id || generateRequestId(),
    start_time: Date.now(),
    request,
    current_stage: 'intent_matching',
    traces: [],
  };
}

/**
 * EXECUTE PIPELINE
 */
export async function executePipeline(request: AnswerRequest): Promise<MAOResponse> {
  const ctx = createPipelineContext(request);
  const startTime = Date.now();
  
  try {
    // Stage 1: Crisis Detection (ALWAYS FIRST)
    ctx.current_stage = 'crisis_detection';
    const crisisResult = detectCrisis(request.question);
    
    if (crisisResult.requires_immediate_response) {
      const crisisResponse = buildCrisisResponse(request, ctx.request_id);
      // Crisis responses bypass normal answer flow
      return {
        success: true,
        data: createMinimalAnswer(crisisResponse, request),
        meta: {
          request_id: ctx.request_id,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime,
          mao_version: '1.0.0',
          answer_type: 'RISK_PREVALENCE',
          domain: 'youth',
        },
      };
    }
    
    // Stage 2: Intent Matching
    ctx.current_stage = 'intent_matching';
    const intent = matchIntent(request.question, request.audience);
    
    if (!intent.matched) {
      return createNoDataResponse(
        'Could not match question to a known answer pattern',
        0,
        0.5,
        ctx.request_id,
        ['Try rephrasing your question', 'Be more specific about what you want to know']
      );
    }
    
    // Stage 3: Domain & Safety Check
    ctx.current_stage = 'safety_check';
    const safetyResult = checkDomainSafety(intent.domain, request);
    
    if (!safetyResult.allowed) {
      return createBlockedResponse(
        safetyResult.reason || 'Question blocked by safety policy',
        'domain_safety',
        ctx.request_id,
        safetyResult.redirect
      );
    }
    
    // Stage 4: Answer Resolution
    ctx.current_stage = 'answer_resolution';
    const answer = await resolveAnswer(intent, request);
    
    if (!answer) {
      return createNoDataResponse(
        'Insufficient data to answer this question',
        0.3,
        0.7,
        ctx.request_id
      );
    }
    
    // Stage 5: Render Final Response
    ctx.current_stage = 'rendering';
    return createSuccessResponse(answer, ctx.request_id, Date.now() - startTime);
    
  } catch (error) {
    console.error('Pipeline error:', error);
    return {
      success: false,
      blocked: false,
      no_data: false,
      error: true,
      error_code: 'PIPELINE_ERROR',
      error_message: 'An internal error occurred while processing your question',
      meta: {
        request_id: ctx.request_id,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime,
        mao_version: '1.0.0',
      },
    };
  }
}

/**
 * BUILD CRISIS RESPONSE
 */
function buildCrisisResponse(request: AnswerRequest, requestId: string): CrisisAnswerBody {
  const countryCode = request.context?.country || 'SE';
  const resources = getCrisisResources(countryCode);
  
  return {
    answer_id: `crisis:support:immediate:${requestId}`,
    answer_type: 'crisis_support',
    domain: 'crisis',
    language: request.language,
    generated_at: new Date().toISOString(),
    mode: 'crisis_support',
    text: "I'm really glad you reached out. If you are in immediate danger, please contact local emergency services or a trusted adult right now.",
    resources,
    immediate_action: 'Contact someone you trust or call emergency services',
  };
}

/**
 * CREATE MINIMAL ANSWER for crisis responses
 */
function createMinimalAnswer(crisis: CrisisAnswerBody, request: AnswerRequest): UnifiedAnswerBody {
  return {
    answer_id: crisis.answer_id,
    answer_type: 'RISK_PREVALENCE' as CanonicalAnswerTypeCode,
    domain: 'youth' as DomainCode,
    version: 1,
    generated_at: crisis.generated_at,
    population_scope: {
      defined: true,
      description: 'Individual in crisis',
    },
    time_scope: {
      explicit: true,
      point: new Date().toISOString(),
      granularity: 'day',
    },
    definition_scope: {
      explicit: true,
      definition_id: 'crisis_support',
      definition_source: 'system',
      definition_text: 'Immediate crisis support response',
    },
    geographic_scope: {
      level: 'national',
      entities: [request.context?.country || 'SE'],
      entity_type: 'country',
    },
    sources: [],
    confidence: {
      coverage: 1,
      source_agreement: 1,
      recency_days: 0,
      methodology_stability: 1,
    },
    limitations: ['This is immediate support, not professional crisis intervention.'],
    what_this_does_not_show: ['Professional diagnosis', 'Treatment recommendations'],
    output: {
      text: crisis.text,
      structured: {
        primary_value: 'crisis_support',
        unit: 'response_type',
        entity: 'individual',
        time: new Date().toISOString(),
      },
      footnotes: [`Resources: ${crisis.resources.map(r => r.name).join(', ')}`],
      citation: {
        cite_id: crisis.answer_id,
        cite_url: `/cite/crisis/${crisis.answer_id}`,
      },
    },
  };
}

/**
 * INTENT MATCHING (Simplified for demo)
 */
interface IntentMatch {
  matched: boolean;
  domain: DomainCode;
  answer_type: CanonicalAnswerTypeCode;
  confidence: number;
  parameters: Record<string, unknown>;
}

function matchIntent(question: string, audience?: { age?: number }): IntentMatch {
  const q = question.toLowerCase();
  
  // Youth domain patterns
  if (audience?.age && audience.age < 25) {
    if (q.includes('normal') || q.includes('common') || q.includes('everyone')) {
      return {
        matched: true,
        domain: 'youth',
        answer_type: 'RISK_PREVALENCE',
        confidence: 0.85,
        parameters: { topic: extractTopic(q) },
      };
    }
    if (q.includes('anxious') || q.includes('anxiety') || q.includes('worried')) {
      return {
        matched: true,
        domain: 'youth',
        answer_type: 'RISK_PREVALENCE',
        confidence: 0.9,
        parameters: { condition: 'anxiety' },
      };
    }
  }
  
  // Statistical patterns
  if (q.includes('how many') || q.includes('percentage') || q.includes('rate')) {
    return {
      matched: true,
      domain: 'society',
      answer_type: 'DESCRIPTIVE_STAT',
      confidence: 0.8,
      parameters: {},
    };
  }
  
  // Trend patterns
  if (q.includes('trend') || q.includes('over time') || q.includes('changed')) {
    return {
      matched: true,
      domain: 'society',
      answer_type: 'TREND_CHANGE',
      confidence: 0.75,
      parameters: {},
    };
  }
  
  // Default: try to match anyway
  return {
    matched: true,
    domain: 'society',
    answer_type: 'DESCRIPTIVE_STAT',
    confidence: 0.5,
    parameters: {},
  };
}

function extractTopic(question: string): string {
  const topics = ['anxiety', 'stress', 'depression', 'sleep', 'relationships', 'school'];
  for (const topic of topics) {
    if (question.includes(topic)) return topic;
  }
  return 'general';
}

/**
 * DOMAIN SAFETY CHECK
 */
function checkDomainSafety(_domain: DomainCode, request: AnswerRequest): {
  allowed: boolean;
  reason?: string;
  redirect?: string;
} {
  const q = request.question.toLowerCase();
  
  // Block normative questions
  if (q.includes('should i') || q.includes('what should')) {
    return {
      allowed: false,
      reason: 'This system provides information, not advice. Rephrase as a factual question.',
      redirect: '/help/question-format',
    };
  }
  
  // Block prediction requests
  if (q.includes('will') && q.includes('happen')) {
    return {
      allowed: false,
      reason: 'This system does not make predictions. Ask about historical patterns instead.',
    };
  }
  
  return { allowed: true };
}

/**
 * RESOLVE ANSWER (Demo implementation)
 */
async function resolveAnswer(
  intent: IntentMatch, 
  request: AnswerRequest
): Promise<UnifiedAnswerBody | null> {
  const baseId = `${intent.domain}:answer:${intent.answer_type}:v1`;
  const now = new Date().toISOString();
  
  // Youth domain answers
  if (intent.domain === 'youth' && intent.answer_type === 'RISK_PREVALENCE') {
    return {
      answer_id: 'youth:answer:anxiety_prevalence:v1',
      answer_type: 'RISK_PREVALENCE',
      domain: 'youth',
      version: 1,
      generated_at: now,
      population_scope: {
        defined: true,
        description: 'Teenagers and young adults (ages 13-25)',
        characteristics: ['Age 13-25', 'General population'],
      },
      time_scope: {
        explicit: true,
        granularity: 'year',
      },
      definition_scope: {
        explicit: true,
        definition_id: 'anxiety_general',
        definition_source: 'WHO',
        definition_text: 'General anxiety as commonly experienced, not clinical disorder',
      },
      geographic_scope: {
        level: 'global',
        entities: ['global'],
        entity_type: 'global',
      },
      sources: [
        {
          source_id: 'who_mental_health',
          source_name: 'WHO',
          tier: 1,
          retrieved_at: now,
        },
        {
          source_id: 'national_health_authority',
          source_name: 'National Health Authority',
          tier: 1,
          retrieved_at: now,
        },
      ],
      confidence: {
        coverage: 0.85,
        source_agreement: 0.9,
        recency_days: 30,
        methodology_stability: 0.95,
      },
      limitations: [
        'This is general information, not a diagnosis.',
        'Individual experiences vary widely.',
      ],
      what_this_does_not_show: [
        'Clinical anxiety disorder diagnosis',
        'Individual treatment recommendations',
      ],
      output: {
        text: 'Feeling anxious sometimes is common during the teenage years. It does not automatically mean something is wrong with you.',
        structured: {
          primary_value: 'common',
          unit: 'prevalence_category',
          entity: 'teenagers',
          time: now,
        },
        footnotes: [
          'Many people your age experience similar feelings.',
          'Everyone develops differently and at their own pace.',
          'If anxiety affects daily life or feels overwhelming, talking to a trusted adult or healthcare professional can help.',
        ],
        citation: {
          cite_id: 'youth:answer:anxiety_prevalence:v1',
          cite_url: '/cite/youth/anxiety_prevalence',
        },
      },
    };
  }
  
  // Default statistical answer
  return {
    answer_id: baseId,
    answer_type: intent.answer_type,
    domain: intent.domain,
    version: 1,
    generated_at: now,
    population_scope: {
      defined: false,
      description: 'General population',
    },
    time_scope: {
      explicit: false,
      granularity: 'year',
    },
    definition_scope: {
      explicit: false,
      definition_id: 'general',
      definition_source: 'system',
      definition_text: 'Standard statistical definition',
    },
    geographic_scope: {
      level: 'global',
      entities: ['global'],
      entity_type: 'global',
    },
    sources: [
      {
        source_id: 'official_statistics',
        source_name: 'Official statistics',
        tier: 2,
        retrieved_at: now,
      },
    ],
    confidence: {
      coverage: intent.confidence,
      source_agreement: 0.7,
      recency_days: 90,
      methodology_stability: 0.8,
    },
    limitations: [
      'Data coverage may vary by region.',
      'This is observational data, not causal analysis.',
    ],
    what_this_does_not_show: [
      'Causal relationships',
      'Future predictions',
    ],
    output: {
      text: 'Based on available data...',
      structured: {
        primary_value: 'see_details',
        unit: 'varies',
        entity: 'varies',
        time: now,
      },
      footnotes: [],
      citation: {
        cite_id: baseId,
        cite_url: `/cite/${intent.domain}/${intent.answer_type}`,
      },
    },
  };
}
