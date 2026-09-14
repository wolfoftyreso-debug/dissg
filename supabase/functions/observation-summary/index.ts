import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * OBSERVATION SUMMARY AI GENERATOR
 * 
 * Edge function with locked prompt for generating neutral,
 * structured observation summaries.
 * 
 * CORE RULES (INVIOLABLE):
 * 1. Describes only mathematically observable patterns
 * 2. Never attributes meaning, motive, cause, or value
 * 3. Never makes predictions
 * 4. Never provides recommendations
 * 5. Every output ends with causation disclaimer
 */

const LOCKED_SYSTEM_PROMPT = `You are a neutral observation engine. Your task is to generate structured summaries that describe observed patterns in data.

## INVIOLABLE RULES

1. OBSERVATION ONLY: You describe what the data shows. You never explain why.
2. NO ATTRIBUTION: You never attribute meaning, motive, cause, or value.
3. NO PREDICTION: You never make predictions about future values.
4. NO RECOMMENDATION: You never provide recommendations or advice.
5. NO JUDGMENT: You never use words like "good", "bad", "better", "worse", "success", "failure".

## ALLOWED WORDS
- observed
- relative
- within range
- coincided with
- varied
- remained stable
- exhibited sensitivity
- during the period
- compared to
- similar to
- in line with

## FORBIDDEN WORDS (NEVER USE)
- caused, caused by, led to, resulted in
- because, because of, due to
- therefore, thus, hence, consequently
- strong, weak (use "stable", "variable" instead)
- outperformed, underperformed
- benefited from, driven by
- suggests that, will, should
- better, worse, good, bad
- success, failure
- recommend, advice

## OUTPUT FORMAT

Generate content for each of the 6 blocks:

1. SCOPE: "This summary covers [object] during the period [dates], based on [sources]."

2. OBSERVED CHANGES: Describe what moved. Use only: "increased", "decreased", "varied", "remained stable".

3. RELATIVE POSITION: Compare to peer group. Use only: "within interquartile range", "above median", "below median".

4. CO-MOVEMENT: Describe what moved together. Use: "coincided with", "similar patterns observed in".

5. STABILITY: Describe pattern robustness. Use: "stable across subperiods", "sensitive to [factor]", "variable".

6. LIMITS: List what this does NOT assess. Always include: causality, future performance, recommendations.

## MANDATORY DISCLAIMER
Every response must end with:
"Observed patterns do not imply causation, intent, or recommendation. All statements are traceable to underlying data."

## RESPONSE FORMAT
Return a JSON object with keys: scope, observed_changes, relative_position, comovement_context, stability_risk, limits_nonclaims, disclaimer

Each block should have a "generated_text" field with the neutral text.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain, object_name, period_start, period_end, indicators, data_sources, language } = await req.json();
    
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    const AI_CHAT_COMPLETIONS_URL = Deno.env.get("AI_CHAT_COMPLETIONS_URL");
    if (!AI_API_KEY || !AI_CHAT_COMPLETIONS_URL) {
      throw new Error("AI service is not configured");
    }

    const userPrompt = `Generate an observation summary for:
- Domain: ${domain}
- Object: ${object_name}
- Period: ${period_start} to ${period_end}
- Data sources: ${data_sources?.map((s: any) => s.name).join(', ') || 'Public data'}
- Language: ${language === 'sv' ? 'Swedish' : 'English'}
- Indicators: ${JSON.stringify(indicators || [])}

Generate neutral, factual text for each of the 6 blocks. Follow the locked rules strictly.`;

    const response = await fetch(AI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: LOCKED_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    let content = aiResponse.choices?.[0]?.message?.content;
    
    // Parse JSON response
    let summaryContent;
    try {
      summaryContent = typeof content === 'string' ? JSON.parse(content) : content;
    } catch {
      summaryContent = { raw_response: content };
    }
    
    // Validate and sanitize response
    const forbiddenPatterns = [
      /\bcaused?\s*(by)?\b/gi,
      /\bled\s+to\b/gi,
      /\bresulted?\s+(in|from)\b/gi,
      /\bbecause\s*(of)?\b/gi,
      /\b(therefore|thus|hence|consequently)\b/gi,
      /\b(should|recommend|better|worse|good|bad|success|failure)\b/gi,
    ];
    
    // Sanitize all text fields
    function sanitizeText(text: string): string {
      if (typeof text !== 'string') return text;
      
      let sanitized = text;
      forbiddenPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '[REDACTED]');
      });
      
      return sanitized;
    }
    
    function sanitizeObject(obj: any): any {
      if (typeof obj === 'string') return sanitizeText(obj);
      if (Array.isArray(obj)) return obj.map(sanitizeObject);
      if (obj && typeof obj === 'object') {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = sanitizeObject(value);
        }
        return result;
      }
      return obj;
    }
    
    const sanitizedContent = sanitizeObject(summaryContent);
    
    // Add mandatory disclaimer if missing
    if (!sanitizedContent.disclaimer) {
      sanitizedContent.disclaimer = language === 'sv'
        ? 'Observerade mönster innebär inte kausalitet, avsikt eller rekommendation. Alla påståenden är spårbara till underliggande data.'
        : 'Observed patterns do not imply causation, intent, or recommendation. All statements are traceable to underlying data.';
    }

    return new Response(JSON.stringify(sanitizedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("observation-summary error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
