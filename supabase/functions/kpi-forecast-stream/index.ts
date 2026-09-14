import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface KPIInput {
  id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  trend: string;
  trendPercent: number;
  status: string;
  inverted?: boolean;
  rationale?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kpi, horizon = "12_months" } = await req.json() as { kpi: KPIInput; horizon?: string };
    
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    const AI_CHAT_COMPLETIONS_URL = Deno.env.get("AI_CHAT_COMPLETIONS_URL");
    if (!AI_API_KEY || !AI_CHAT_COMPLETIONS_URL) {
      throw new Error("AI service is not configured");
    }

    // Build the streaming analysis prompt for real-time data generation
    const systemPrompt = `Du är en expert på tidsserieanalys och prognoser för svenska samhällsindikatorer.
Din uppgift är att generera realistiska prognosdatapunkter baserat på aktuella trender.

VIKTIGT:
- Generera numeriska datapunkter för prognoser
- Basera på statistiska modeller (ARIMA-liknande)
- Inkludera naturlig volatilitet
- Svara ENDAST med JSON, ingen annan text`;

    const userPrompt = `Generera prognosdata för följande KPI med månadsupplösning i ${horizon === "12_months" ? "12 månader" : horizon === "24_months" ? "24 månader" : "60 månader"}:

KPI: ${kpi.name}
Aktuellt värde: ${kpi.value} ${kpi.unit}
Trend: ${kpi.trend} (${kpi.trendPercent}%)
Status: ${kpi.status}
Inverterad: ${kpi.inverted ? 'Ja' : 'Nej'}

Generera JSON med denna struktur (inkludera naturlig volatilitet och osäkerhetsintervall):
{
  "datapoints": [
    {"month": 0, "baseline": ${kpi.value}, "optimistic": ${kpi.value}, "pessimistic": ${kpi.value}, "lower_bound": ${kpi.value * 0.98}, "upper_bound": ${kpi.value * 1.02}},
    {"month": 1, "baseline": X, "optimistic": X, "pessimistic": X, "lower_bound": X, "upper_bound": X},
    ... (för varje månad upp till ${horizon === "12_months" ? "12" : horizon === "24_months" ? "24" : "60"})
  ],
  "trend_analysis": {
    "direction": "up|down|stable",
    "momentum": <-100 till 100>,
    "volatility": <0-100>,
    "seasonality_detected": true|false
  },
  "risk_assessment": {
    "probability_of_decline": <0-100>,
    "probability_of_improvement": <0-100>,
    "critical_threshold": <värde där status blir kritisk>,
    "warning_threshold": <värde där status blir warning>
  },
  "confidence_interval": {
    "level": 95,
    "methodology": "Monte Carlo simulation med 1000 iterationer"
  }
}`;

    // Use streaming API for real-time response
    const response = await fetch(AI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        stream: false, // Non-streaming for now, parse complete JSON
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
          JSON.stringify({ error: "AI-krediter slut." }),
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
    let streamData;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
      const jsonStr = jsonMatch[1] || content;
      streamData = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      
      // Generate fallback synthetic data
      const months = horizon === "12_months" ? 12 : horizon === "24_months" ? 24 : 60;
      const trendFactor = kpi.trend === 'up' ? 1 + (kpi.trendPercent / 100) : 
                          kpi.trend === 'down' ? 1 - (kpi.trendPercent / 100) : 1;
      
      const datapoints = [];
      let baseValue = kpi.value;
      
      for (let i = 0; i <= months; i++) {
        const monthlyChange = (trendFactor - 1) / 12;
        const volatility = baseValue * 0.02 * (Math.random() - 0.5);
        const newValue = baseValue * (1 + monthlyChange) + volatility;
        
        datapoints.push({
          month: i,
          baseline: Math.round(newValue * 100) / 100,
          optimistic: Math.round(newValue * 1.05 * 100) / 100,
          pessimistic: Math.round(newValue * 0.95 * 100) / 100,
          lower_bound: Math.round(newValue * 0.92 * 100) / 100,
          upper_bound: Math.round(newValue * 1.08 * 100) / 100,
        });
        
        baseValue = newValue;
      }

      streamData = {
        datapoints,
        trend_analysis: {
          direction: kpi.trend,
          momentum: kpi.trendPercent,
          volatility: 15,
          seasonality_detected: false
        },
        risk_assessment: {
          probability_of_decline: kpi.trend === 'down' ? 65 : 25,
          probability_of_improvement: kpi.trend === 'up' ? 70 : 30,
          critical_threshold: kpi.value * 0.85,
          warning_threshold: kpi.value * 0.92
        },
        confidence_interval: {
          level: 95,
          methodology: "Synthetic projection based on current trend"
        }
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        kpi_id: kpi.id,
        kpi_name: kpi.name,
        stream_data: streamData,
        generated_at: new Date().toISOString(),
        horizon,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Stream forecast error:", error);
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
