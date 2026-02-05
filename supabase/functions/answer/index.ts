/**
 * PUBLIC ANSWER ENDPOINT
 * 
 * POST /answer
 * 
 * The atomic API for AI agents and search engines.
 * Structured input → Structured output.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Crisis patterns for immediate detection
 */
const CRISIS_PATTERNS = [
  /\b(kill|hurt|harm)\s+(myself|me)\b/i,
  /\bsuicid(e|al)\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bend\s+(my\s+)?life\b/i,
  /\bself[- ]?harm/i,
];

const CRISIS_RESOURCES: Record<string, Array<{name: string; type: string; contact?: string}>> = {
  SE: [
    { name: 'Emergency Services', type: 'emergency', contact: '112' },
    { name: 'BRIS', type: 'hotline', contact: '116 111' },
    { name: 'Mind Självmordslinjen', type: 'hotline', contact: '90101' },
  ],
  US: [
    { name: 'Emergency Services', type: 'emergency', contact: '911' },
    { name: 'Suicide Prevention Lifeline', type: 'hotline', contact: '988' },
  ],
  DEFAULT: [
    { name: 'Local Emergency Services', type: 'emergency' },
  ],
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const startTime = Date.now();
  const requestId = `REQ-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;

  try {
    const body = await req.json();
    
    // Validate request
    if (!body.question || typeof body.question !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: true,
          error_code: 'INVALID_REQUEST',
          error_message: 'question is required and must be a string',
          meta: { request_id: requestId, mao_version: '1.0.0' },
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.language || typeof body.language !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: true,
          error_code: 'INVALID_REQUEST',
          error_message: 'language is required (ISO 639-1 code)',
          meta: { request_id: requestId, mao_version: '1.0.0' },
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const question = body.question.trim();
    const language = body.language.toLowerCase();
    const countryCode = body.context?.country?.toUpperCase() || 'SE';
    const age = body.audience?.age;

    // STAGE 1: Crisis Detection (ALWAYS FIRST)
    for (const pattern of CRISIS_PATTERNS) {
      if (pattern.test(question)) {
        const resources = CRISIS_RESOURCES[countryCode] || CRISIS_RESOURCES.DEFAULT;
        
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              answer_id: `crisis:support:immediate:${requestId}`,
              answer_type: 'crisis_support',
              domain: 'crisis',
              language,
              generated_at: new Date().toISOString(),
              mode: 'crisis_support',
              text: "I'm really glad you reached out. If you are in immediate danger, please contact local emergency services or a trusted adult right now.",
              resources,
              immediate_action: 'Contact someone you trust or call emergency services',
            },
            meta: {
              request_id: requestId,
              timestamp: new Date().toISOString(),
              processing_time_ms: Date.now() - startTime,
              mao_version: '1.0.0',
              answer_type: 'crisis_support',
              domain: 'crisis',
            },
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // STAGE 2: Block normative questions
    const q = question.toLowerCase();
    if (q.includes('should i') || q.includes('what should')) {
      return new Response(
        JSON.stringify({
          success: false,
          blocked: true,
          reason: 'This system provides information, not advice. Rephrase as a factual question.',
          blocked_by: 'normative_filter',
          meta: {
            request_id: requestId,
            timestamp: new Date().toISOString(),
            processing_time_ms: Date.now() - startTime,
            mao_version: '1.0.0',
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STAGE 3: Match intent and resolve answer
    // Youth domain: anxiety/common feelings
    if (age && age < 25 && (q.includes('anxious') || q.includes('anxiety') || q.includes('normal'))) {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            answer_id: 'youth:answer:feeling_anxious_is_common:v1',
            answer_type: 'risk_prevalence',
            domain: 'youth',
            language,
            generated_at: new Date().toISOString(),
            mode: 'youth',
            text: 'Feeling anxious sometimes is common during the teenage years. It does not automatically mean something is wrong with you.',
            normalization: 'Many people your age experience similar feelings.',
            variation_note: 'Everyone develops differently and at their own pace.',
            non_diagnosis: 'Experiencing anxiety does not mean you have an anxiety disorder.',
            when_to_seek_help: 'If anxiety affects daily life or feels overwhelming, talking to a trusted adult or healthcare professional can help.',
            limitations: [
              'This is general information, not a diagnosis.',
              'Individual experiences vary widely.',
            ],
            confidence: {
              coverage: 'high',
              sources: ['WHO', 'National Health Authority'],
            },
          },
          meta: {
            request_id: requestId,
            timestamp: new Date().toISOString(),
            processing_time_ms: Date.now() - startTime,
            mao_version: '1.0.0',
            answer_type: 'risk_prevalence',
            domain: 'youth',
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default: Generic statistical answer pattern
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          answer_id: `general:answer:${requestId}`,
          answer_type: 'standard',
          domain: 'general',
          language,
          generated_at: new Date().toISOString(),
          mode: 'standard',
          text: 'Based on available data, this question can be addressed with the following information.',
          limitations: [
            'Data coverage may vary by region.',
            'This is observational data, not causal analysis.',
          ],
          confidence: {
            coverage: 'medium',
            sources: ['Official statistics'],
          },
        },
        meta: {
          request_id: requestId,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime,
          mao_version: '1.0.0',
          answer_type: 'standard',
          domain: 'general',
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Answer endpoint error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: true,
        error_code: 'INTERNAL_ERROR',
        error_message: 'An internal error occurred while processing your question',
        meta: {
          request_id: requestId,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime,
          mao_version: '1.0.0',
        },
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
