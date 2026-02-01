import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kpi, historicalData, horizon = "12_months" } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the analysis prompt
    const systemPrompt = `Du är en svensk samhällsanalytiker med expertis inom makroekonomi, demografi och samhällsstyrning.
Din uppgift är att analysera KPI-trender och ge prognoser för beslutsfattare på regeringsnivå.

VIKTIGT:
- Var saklig och neutral. Ingen retorik eller politisk färgning.
- Basera analysen på data och etablerade samband.
- Ange osäkerhet explicit.
- Svara ALLTID på svenska.
- Fokusera på konsekvenser vid status quo (ingen åtgärd).`;

    const userPrompt = `Analysera följande KPI och ge en prognos för ${horizon === "12_months" ? "kommande 12 månader" : horizon === "24_months" ? "kommande 24 månader" : "kommande 5 år"}.

KPI: ${kpi.name}
Kategori: ${kpi.category}
Aktuellt värde: ${kpi.value} ${kpi.unit}
Trend: ${kpi.trend === 'up' ? 'Uppåtgående' : kpi.trend === 'down' ? 'Nedåtgående' : 'Stabil'} (${kpi.trendPercent}%)
Status: ${kpi.status}
Inverterad: ${kpi.inverted ? 'Ja (lägre är bättre)' : 'Nej (högre är bättre)'}
Rationale: ${kpi.rationale}

${historicalData ? `Historisk data (senaste 12 mån): ${JSON.stringify(historicalData)}` : ''}

Ge följande i JSON-format:
{
  "forecast": {
    "scenario_baseline": {
      "value_3m": <nummer>,
      "value_6m": <nummer>,
      "value_12m": <nummer>,
      "confidence": <0-100>,
      "description": "<kort beskrivning>"
    },
    "scenario_optimistic": {
      "value_12m": <nummer>,
      "probability": <0-100>,
      "required_actions": ["<åtgärd 1>", "<åtgärd 2>"]
    },
    "scenario_pessimistic": {
      "value_12m": <nummer>,
      "probability": <0-100>,
      "risk_factors": ["<risk 1>", "<risk 2>"]
    }
  },
  "status_quo_consequences": {
    "summary": "<1-2 meningar om vad som händer utan åtgärd>",
    "timeline": [
      {"period": "3 månader", "effect": "<konkret effekt>"},
      {"period": "6 månader", "effect": "<konkret effekt>"},
      {"period": "12 månader", "effect": "<konkret effekt>"}
    ],
    "severity": "<low|medium|high|critical>",
    "affected_areas": ["<område 1>", "<område 2>"],
    "cost_of_inaction": "<uppskattad kostnad eller konsekvens>"
  },
  "recommended_monitoring": {
    "key_indicators": ["<indikator att bevaka>"],
    "warning_threshold": "<värde som bör trigga åtgärd>",
    "review_frequency": "<veckovis|månadsvis>"
  },
  "uncertainty_factors": ["<osäkerhetsfaktor 1>", "<osäkerhetsfaktor 2>"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3, // Lower temperature for more consistent analytical output
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Försök igen om en stund." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI-krediter slut. Kontakta administratör." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response
    let analysisResult;
    try {
      // Extract JSON from the response (might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
      const jsonStr = jsonMatch[1] || content;
      analysisResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      // Return a structured error response
      analysisResult = {
        error: "Could not parse analysis",
        raw_response: content,
        forecast: null,
        status_quo_consequences: {
          summary: "Analys kunde inte slutföras. Försök igen.",
          severity: "unknown"
        }
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        kpi_id: kpi.id,
        kpi_name: kpi.name,
        analysis: analysisResult,
        generated_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Forecast error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
