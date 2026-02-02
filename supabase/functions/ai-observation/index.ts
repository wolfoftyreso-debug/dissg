/**
 * AI OBSERVATION MODE - Edge Function
 * 
 * A neutral observer that ONLY describes deviations and co-movements.
 * NEVER provides interpretation, causation, or recommendations.
 * 
 * Language is mathematically and methodologically LOCKED.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// LOCKED SYSTEM PROMPT - This defines the AI's strict observation-only role
const OBSERVATION_SYSTEM_PROMPT = `You are a neutral statistical observation system. Your ONLY role is to describe patterns that emerge in data.

## ABSOLUTE RULES (NEVER VIOLATE)

1. You ONLY describe what is mathematically observed in data
2. You NEVER attribute meaning, motive, cause, or value
3. You NEVER make recommendations or predictions
4. You NEVER use normative language (good, bad, better, worse)
5. You NEVER use causal language (caused by, led to, resulted in, because)

## ALLOWED LANGUAGE (USE ONLY THESE PATTERNS)

For deviations:
- "An observed deviation occurred in [variable] during [period]."
- "A level shift was detected in [variable] starting [date]."
- "Volatility in [variable] increased/decreased during [period]."
- "A trend break was observed in [variable] at [date]."

For co-movements:
- "Variables [A] and [B] exhibited co-movement during [period]."
- "A lagged relationship was observed between [A] and [B]."
- "Simultaneous changes occurred in [A] and [B] during [period]."
- "No consistent association observed between [A] and [B]."

For stability:
- "This co-movement was stable across subperiods."
- "This co-movement was not stable across subperiods."
- "The pattern varied by geographic region."
- "The pattern held across multiple data sources."

For context:
- "Multiple variables showed similar patterns during this time."
- "Other variables did not exhibit this pattern."
- "The observed pattern was not unique to these variables."

## MANDATORY DISCLAIMER (ALWAYS INCLUDE)

End every response with:
"---
Observed patterns do not imply causation or intent."

## FORBIDDEN WORDS (NEVER USE)

caused, caused by, led to, resulted in, because, therefore, consequently,
favored, benefited, harmed, should, ought to, must, need to,
good, bad, better, worse, success, failure, improvement, deterioration,
proves, demonstrates, shows that, obviously, clearly, certainly,
intentional, deliberate, designed to, aimed at

## RESPONSE FORMAT

Always structure responses as:

**Observation**
- What: [neutral description]
- When: [time period]
- Where: [geographic scope]

**Strength**
- Correlation: [value with confidence interval]
- Stability: [high/medium/low/unstable]

**Context**
- Also moved: [other variables with similar patterns]
- Did not move: [variables without this pattern]

**Limits**
- Data coverage: [period and frequency]
- What this does NOT show: [list of non-claims]

If you cannot describe something without using forbidden language, respond with:
"Unable to generate neutral observation for this request."`;

// Forbidden patterns regex for validation
const FORBIDDEN_PATTERNS = [
  /\bcaused?\s+by\b/gi,
  /\bled\s+to\b/gi,
  /\bresulted?\s+in\b/gi,
  /\bbecause\b/gi,
  /\btherefore\b/gi,
  /\bshould\b/gi,
  /\bmust\b/gi,
  /\bbetter\b/gi,
  /\bworse\b/gi,
  /\bgood\b/gi,
  /\bbad\b/gi,
  /\bproves?\b/gi,
  /\bobviously\b/gi,
  /\bclearly\b/gi,
];

// Validate AI response for forbidden language
function validateResponse(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      violations.push(...matches);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations
  };
}

// Sanitize response by removing forbidden phrases
function sanitizeResponse(text: string): string {
  let sanitized = text;
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[BLOCKED]');
  }
  
  // Ensure mandatory disclaimer is present
  if (!sanitized.includes('do not imply causation')) {
    sanitized += '\n\n---\n**Observed patterns do not imply causation or intent.**';
  }
  
  return sanitized;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      variables, 
      period_start, 
      period_end, 
      geographic_scope,
      observation_type = 'general'
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the user prompt based on observation type
    let userPrompt = '';
    
    switch (observation_type) {
      case 'deviation':
        userPrompt = `Analyze the following data for deviations (level shifts, trend breaks, volatility changes):
Variables: ${JSON.stringify(variables)}
Period: ${period_start} to ${period_end}
Geographic scope: ${geographic_scope || 'Not specified'}

Describe ONLY what deviates from historical patterns. Do not interpret why.`;
        break;
        
      case 'comovement':
        userPrompt = `Analyze the following variables for co-movement patterns:
Variables: ${JSON.stringify(variables)}
Period: ${period_start} to ${period_end}
Geographic scope: ${geographic_scope || 'Not specified'}

Describe ONLY simultaneous or lagged movements. Do not attribute causation.`;
        break;
        
      case 'stability':
        userPrompt = `Assess the stability of patterns across subperiods:
Variables: ${JSON.stringify(variables)}
Period: ${period_start} to ${period_end}
Geographic scope: ${geographic_scope || 'Not specified'}

Report ONLY whether patterns hold across time, geography, and data sources.`;
        break;
        
      default:
        userPrompt = `Generate a neutral observation summary for:
Variables: ${JSON.stringify(variables)}
Period: ${period_start} to ${period_end}
Geographic scope: ${geographic_scope || 'Not specified'}

Describe what is observed in the data. No interpretation, no causation, no recommendations.`;
    }

    // Call the AI gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: OBSERVATION_SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1, // Low temperature for consistent, factual output
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content || '';

    // Validate and sanitize the response
    const validation = validateResponse(aiResponse);
    
    if (!validation.valid) {
      console.warn("AI response contained forbidden language:", validation.violations);
      aiResponse = sanitizeResponse(aiResponse);
    }

    // Ensure mandatory disclaimer
    if (!aiResponse.includes('do not imply causation')) {
      aiResponse += '\n\n---\n**Observed patterns do not imply causation or intent.**';
    }

    return new Response(
      JSON.stringify({
        observation: aiResponse,
        metadata: {
          observation_type,
          period: `${period_start} to ${period_end}`,
          geographic_scope: geographic_scope || 'Not specified',
          generated_at: new Date().toISOString(),
          language_validation: {
            passed: validation.valid,
            violations_found: validation.violations.length,
            was_sanitized: !validation.valid
          }
        },
        disclaimers: [
          "Observed patterns do not imply causation or intent.",
          "This analysis is limited to the available data period.",
          "All observations are subject to data quality limitations."
        ]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("AI observation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        observation: null
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
