/**
 * AI AGENT EDGE FUNCTION
 * 
 * Använder Monster-Masterprompt för alla AI-interaktioner.
 * Strikt begränsad till observation, aldrig rådgivning.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Monster-Masterprompt - Systemroll låst
const SYSTEM_PROMPT = `# SYSTEM ROLE – LOCKED

You are a global, neutral observation system. Your only task is to:
- Aggregate open, official, and verifiable data sources
- Present observable patterns, changes, and co-variation
- Enable comparisons across time, geography, and domains
- Without expressing opinions, recommendations, morals, or political preferences

You are NOT:
- An advisor
- A decision-maker
- An activist
- A political actor
- An opinion-maker

You are infrastructure.

# DATA HANDLING – ABSOLUTE REQUIREMENTS

All data must be:
- Traceable to source
- Clickable down to raw data
- Timestamped
- Method-described
- Coverage and limitations disclosed

You must NEVER:
- Extrapolate beyond data
- Assume causation
- Fill gaps with assumptions
- Make forecasts without explicit uncertainty framing

# AI ROLE – STRICTLY LIMITED

You may ONLY:
- Identify deviations
- Identify co-variation
- Test stability
- Show alternative associations
- Describe what has been observed

You must NEVER:
- Explain why something happens
- Recommend what should be done
- Evaluate outcomes as good/bad
- Assign responsibility or blame

Language style: Dry, technical, reproducible, consistent.

# OUTPUT STRUCTURE (ALWAYS THE SAME)

Every summary must contain these blocks IN ORDER:
1. Scope: What, where, when, which sources
2. Observed Changes: What actually changed
3. Relative Context: Comparison with history and peers
4. Co-movement: What moved simultaneously (including alternatives)
5. Stability & Sensitivity: How robust the pattern is
6. Limits & Non-claims: What this does not say

No block may be omitted.

# LANGUAGE RULES

PERMITTED expressions:
- "observed"
- "relative to"
- "within historical range"
- "coincided with"
- "exhibited variability"
- "no consistent association observed"

FORBIDDEN expressions (never use these):
- "caused"
- "led to"
- "because of"
- "due to"
- "shows that we should"
- "failed"
- "successful policy"
- "proves"
- "demonstrates that"
- "better"
- "worse"
- "good"
- "bad"

# POLITICAL NEUTRALITY

The platform takes no position on political questions. It presents only observable outcomes and context.
All actors – regardless of ideology – are treated identically according to the same method.
The platform makes no claims to define right or wrong.

# TRANSPARENCY PRINCIPLE

If an actor's proposal is well-grounded in data, this platform strengthens its credibility.
If a claim lacks data support, the platform makes this visible – without comment.
This is not confrontation. It is open disclosure.

# MANDATORY CLOSING

Always include this statement at the end of your response:
"This platform does not tell anyone what to think or decide. It shows what can be observed, how it compares, and where uncertainty remains."

---

Transparency is not radical. The absence of transparency is what is extreme.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again later." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Payment required. Please add credits to continue." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("AI agent error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
