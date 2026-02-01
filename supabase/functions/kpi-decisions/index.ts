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
    const { kpi, forecastData, constraints } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Du är en svensk samhällsanalytiker och policyexpert med djup kunskap om statsförvaltning, ekonomi och samhällsstyrning.
Din uppgift är att generera konkreta, genomförbara åtgärdsförslag för beslutsfattare på regeringsnivå.

VIKTIGT:
- Var saklig och neutral. Ingen politisk färgning.
- Fokusera på evidensbaserade åtgärder.
- Ange alltid osäkerhet och bieffekter.
- Svara ALLTID på svenska.
- Prioritera åtgärder som kan genomföras inom mandatperioden.
- Inkludera både kortsiktiga och långsiktiga åtgärder.`;

    const constraintsText = constraints ? `
Budget: ${constraints.budget || 'Ej specificerad'}
Tidhorisont: ${constraints.timeframe || '12 månader'}
Politiska begränsningar: ${constraints.political || 'Inga specifika'}
` : '';

    const userPrompt = `Analysera följande KPI och generera konkreta åtgärdsförslag.

KPI: ${kpi.name}
Kategori: ${kpi.category}
Aktuellt värde: ${kpi.value} ${kpi.unit}
Trend: ${kpi.trend === 'up' ? 'Uppåtgående' : kpi.trend === 'down' ? 'Nedåtgående' : 'Stabil'} (${kpi.trendPercent}%)
Status: ${kpi.status}
Inverterad: ${kpi.inverted ? 'Ja (lägre är bättre)' : 'Nej (högre är bättre)'}
Rationale: ${kpi.rationale}

${forecastData ? `Prognosdata: ${JSON.stringify(forecastData)}` : ''}
${constraintsText}

Generera 3-5 åtgärdsförslag i följande JSON-format:
{
  "actions": [
    {
      "id": "<unikt id>",
      "title": "<kort titel, max 50 tecken>",
      "description": "<beskrivning, 1-2 meningar>",
      "category": "<policy|investment|regulation|organizational|communication>",
      "timeframe": "<immediate|short_term|medium_term|long_term>",
      "effect": {
        "score": <1-10>,
        "description": "<förväntad effekt på KPI>",
        "magnitude": "<procent eller absolut förändring>",
        "confidence": <0-100>
      },
      "cost": {
        "score": <1-10 där 10 är dyrast>,
        "estimate": "<kostnad i SEK eller relativt>",
        "type": "<one_time|recurring|mixed>"
      },
      "risk": {
        "score": <1-10>,
        "factors": ["<risk 1>", "<risk 2>"],
        "mitigation": "<hur risker kan minskas>"
      },
      "implementation": {
        "complexity": "<low|medium|high>",
        "responsible_ministry": "<departement>",
        "key_stakeholders": ["<aktör 1>", "<aktör 2>"],
        "first_steps": ["<steg 1>", "<steg 2>"]
      },
      "dependencies": ["<beroende åtgärd eller förutsättning>"],
      "side_effects": {
        "positive": ["<positiv bieffekt>"],
        "negative": ["<negativ bieffekt>"]
      },
      "priority_score": <beräknad totalpoäng baserat på effekt/kostnad/risk>
    }
  ],
  "summary": {
    "recommended_action": "<id för rekommenderad åtgärd>",
    "rationale": "<varför denna rekommenderas>",
    "alternative_approach": "<alternativ strategi om huvudförslaget inte genomförs>",
    "warning": "<eventuell varning eller kritisk faktor>"
  },
  "quick_wins": ["<snabb åtgärd som kan göras omedelbart>"],
  "requires_legislation": ["<åtgärd som kräver lagändring>"]
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
        temperature: 0.4,
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

    let analysisResult;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
      const jsonStr = jsonMatch[1] || content;
      analysisResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      analysisResult = {
        error: "Could not parse analysis",
        raw_response: content,
        actions: []
      };
    }

    // Sort actions by priority score
    if (analysisResult.actions) {
      analysisResult.actions.sort((a: any, b: any) => 
        (b.priority_score || 0) - (a.priority_score || 0)
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        kpi_id: kpi.id,
        kpi_name: kpi.name,
        decisions: analysisResult,
        generated_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Decision support error:", error);
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
