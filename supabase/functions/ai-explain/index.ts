/**
 * AI ASSISTED UNDERSTANDING — Block AR
 * Förklaring, ALDRIG åsikt
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExplainRequest {
  type: 'kpi' | 'trend' | 'comparison' | 'correlation' | 'event' | 'signal' | 'contextual_summary';
  data: any;
  lang?: 'sv' | 'en';
  context?: {
    country?: string;
    language?: string;
    detail_level?: 'simple' | 'standard' | 'detailed';
  };
}

// System prompt that ensures NEUTRAL, FACT-BASED responses
const SYSTEM_PROMPT = `Du är en dataförklaringsassistent för ett styrningssystem. Din uppgift är att förklara data och trender på ett neutralt och faktabaserat sätt.

REGLER DU MÅSTE FÖLJA:
1. ALDRIG rekommendera policy eller åtgärder
2. ALDRIG dra normativa slutsatser (vad som är "bra" eller "dåligt")
3. ALDRIG spekulera om orsaker utan data
4. ALLTID referera till datakällor
5. ALLTID visa osäkerhet när den finns
6. ALLTID vara neutral i språket

Istället för att säga:
- "Detta är oroande" → säg "Värdet har minskat med X%"
- "Sverige bör..." → säg "Data visar att..."
- "Det beror på..." → säg "Korrelation observeras med... (ej kausalitet bekräftad)"

Format för svar:
1. Sammanfattning (1-2 meningar)
2. Nyckeltal (bullet points)
3. Kontext (historisk jämförelse)
4. Osäkerhet (vad data INTE visar)
5. Datakällor`;

const EXPLANATION_TEMPLATES: Record<string, string> = {
  kpi: `Förklara denna KPI på ett neutralt sätt:
- Namn: {name}
- Aktuellt värde: {value} {unit}
- Förändring: {change}%
- Trend: {trend}
- Konfidens: {confidence}%

Ge en kort, neutral förklaring av vad detta mätvärde visar och hur det har utvecklats.`,

  trend: `Förklara denna trend utan att värdera:
- KPI: {kpi_name}
- Period: {period}
- Startpunkt: {start_value}
- Slutpunkt: {end_value}
- Förändring: {change}%
- Volatilitet: {volatility}

Beskriv trendens karaktär och eventuella mönster.`,

  comparison: `Förklara denna jämförelse neutralt:
- Jämförda enheter: {entities}
- KPI: {kpi_name}
- Period: {period}
- Värden: {values}

Beskriv skillnaderna utan att värdera vilken enhet som presterar "bäst".`,

  correlation: `Förklara denna korrelation:
- KPI A: {kpi_a}
- KPI B: {kpi_b}
- Korrelationskoefficient: {coefficient}
- Signifikans: {p_value}
- Period: {period}

VIKTIGT: Korrelation innebär INTE kausalitet. Förklara sambandet utan att påstå orsak-verkan.`,

  event: `Förklara denna händelse:
- Typ: {event_type}
- Datum: {date}
- Beskrivning: {description}
- Berörda KPIs: {affected_kpis}

Beskriv händelsen och dess potentiella koppling till data, utan att påstå kausalitet.`,

  signal: `Förklara denna signal:
- Typ: {signal_type}
- Allvarlighetsgrad: {severity}
- Berörda KPIs: {kpis}
- Utlösande faktor: {trigger}

Beskriv signalen och vad den indikerar baserat på data.`,

  contextual_summary: `Sammanfatta kontextuella samband för denna indikator.

STRIKTA REGLER:
- Du får INTE använda orden: borde, bör, ska, måste, rekommenderar, bättre, sämre, lyckades, misslyckades
- Du får ENDAST använda: ökade, minskade, förändrades, sammanfaller med, avviker från, observeras, korrelerar med
- ALDRIG ge investeringsråd
- ALDRIG dra normativa slutsatser

DATA:
- Indikator: {indicator}
- Värde: {value}
- Förändring: {change}%
- Period: {period}
- Relaterade förändringar: {relatedChanges}

Beskriv observerade samband mellan denna indikator och relaterade förändringar. Använd ENDAST neutralt språk.

Beskriv signalen och vad den indikerar baserat på data.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, context, lang }: ExplainRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build prompt from template
    let prompt = EXPLANATION_TEMPLATES[type] || EXPLANATION_TEMPLATES.kpi;
    
    // Replace placeholders with actual data
    Object.entries(data).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    });

    // Add context
    if (context?.language === 'en' || lang === 'en') {
      prompt = `Please respond in English.\n\n${prompt}`;
    }

    if (context?.detail_level === 'simple') {
      prompt += '\n\nHåll svaret kort och enkelt (max 3 meningar).';
    } else if (context?.detail_level === 'detailed') {
      prompt += '\n\nGe en detaljerad förklaring med alla relevanta nyanser.';
    }

    // Call Lovable AI Gateway
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
          { role: "user", content: prompt },
        ],
        temperature: 0.3, // Lower temperature for more factual responses
        max_tokens: 1000,
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
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const explanation = result.choices?.[0]?.message?.content || "Kunde inte generera förklaring.";

    // For contextual_summary, return as 'summary' field for compatibility
    const responseData = type === 'contextual_summary' 
      ? {
          summary: explanation,
          message: explanation,
          type,
          generated_at: new Date().toISOString(),
          disclaimer: "AI-genererad sammanfattning. Observerade samband är korrelationer, inte orsakssamband.",
          model: "google/gemini-3-flash-preview",
        }
      : {
          explanation,
          type,
          generated_at: new Date().toISOString(),
          disclaimer: "AI-genererad förklaring baserad på tillgängliga data. Systemet ger inga rekommendationer.",
          model: "google/gemini-3-flash-preview",
        };

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("AI explain error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        explanation: null,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
