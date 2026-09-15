/**
 * AI ASSISTED UNDERSTANDING — Block AR + ETLIH
 * Förklaring, ALDRIG åsikt
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ExplainRequest {
  type?: 'kpi' | 'trend' | 'comparison' | 'correlation' | 'event' | 'signal' | 'contextual_summary';
  data?: any;
  lang?: 'sv' | 'en';
  context?: {
    country?: string;
    language?: string;
    detail_level?: 'simple' | 'standard' | 'detailed';
    // ETLIH context fields
    indicator?: string;
    indicatorLabel?: string;
    geography?: string;
    geographyLabel?: string;
    timePeriod?: string;
    timeSpan?: string;
    zoomLevel?: string;
    sensitivity?: string;
    dataQuality?: number;
    uncertainty?: number;
    currentValue?: number;
    trend?: string;
    changePercent?: number;
  };
  // ETLIH specific
  level?: 'quick' | 'understanding' | 'systemic';
  language?: 'sv' | 'en';
  question?: string;
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

// ETLIH System prompts
const getETLIHSystemPrompt = (level: string, language: string): string => {
  const base = language === 'sv' 
    ? `Du är en neutral förklaringsmotor för samhällsdata. 
Du förklarar ENDAST vad datan visar – aldrig vad användaren ska tycka, göra eller känna.
Du ger ALDRIG råd, åsikter eller prognoser.
Du använder korta meningar och vardagliga ord.
Du undviker kulturellt laddade metaforer.
Du säger alltid "visar", "sammanfaller med", "förändras" – aldrig "bättre", "sämre", "lyckades", "misslyckades".
Du avslutar alltid med en kort "Detta betyder INTE:"-sektion.`
    : `You are a neutral explanation engine for societal data.
You explain ONLY what the data shows – never what the user should think, do, or feel.
You NEVER give advice, opinions, or forecasts.
You use short sentences and everyday words.
You avoid culturally loaded metaphors.
You always say "shows", "coincides with", "changes" – never "better", "worse", "succeeded", "failed".
You always end with a short "This does NOT mean:" section.`;

  const levelInstructions: Record<string, Record<string, string>> = {
    quick: {
      sv: 'Ge en KORT förklaring (2-3 meningar). Vad visar grafen/siffran? Vad betyder riktningen? Säg explicit vad det INTE säger.',
      en: 'Give a SHORT explanation (2-3 sentences). What does the graph/number show? What does the direction mean? Explicitly state what it does NOT say.'
    },
    understanding: {
      sv: 'Förklara samband och kontext (4-6 meningar). Vad rör sig tillsammans? Vilka möjliga faktorer kan påverka? Betona att samband inte är orsak.',
      en: 'Explain connections and context (4-6 sentences). What moves together? What possible factors could influence? Emphasize that correlation is not causation.'
    },
    systemic: {
      sv: 'Ge en systemisk förklaring (8-12 meningar). Placera i historiskt och strukturellt sammanhang. Vilka liknande mönster har setts? Vilka begränsningar har analysen?',
      en: 'Give a systemic explanation (8-12 sentences). Place in historical and structural context. What similar patterns have been seen? What limitations does the analysis have?'
    }
  };

  return `${base}\n\n${levelInstructions[level]?.[language] || levelInstructions.quick[language]}`;
};

const buildETLIHUserPrompt = (context: any, language: string, question?: string): string => {
  if (language === 'sv') {
    return `Förklara följande data:

INDIKATOR: ${context.indicatorLabel || context.indicator}
GEOGRAFI: ${context.geographyLabel || context.geography}
TIDSPERIOD: ${context.timePeriod}
${context.currentValue !== undefined ? `NUVARANDE VÄRDE: ${context.currentValue}` : ''}
${context.trend ? `TREND: ${context.trend === 'up' ? 'uppåtgående' : context.trend === 'down' ? 'nedåtgående' : 'stabil'}` : ''}
${context.changePercent !== undefined ? `FÖRÄNDRING: ${context.changePercent > 0 ? '+' : ''}${context.changePercent}%` : ''}
DATAKVALITET: ${context.dataQuality}/100
OSÄKERHET: ${context.uncertainty}%
KÄNSLIG DATA: ${context.sensitivity === 'high' ? 'Ja' : 'Nej'}

${question ? `ANVÄNDARENS FRÅGA: ${question}` : ''}`;
  }
  
  return `Explain the following data:

INDICATOR: ${context.indicatorLabel || context.indicator}
GEOGRAPHY: ${context.geographyLabel || context.geography}
TIME PERIOD: ${context.timePeriod}
${context.currentValue !== undefined ? `CURRENT VALUE: ${context.currentValue}` : ''}
${context.trend ? `TREND: ${context.trend}` : ''}
${context.changePercent !== undefined ? `CHANGE: ${context.changePercent > 0 ? '+' : ''}${context.changePercent}%` : ''}
DATA QUALITY: ${context.dataQuality}/100
UNCERTAINTY: ${context.uncertainty}%
SENSITIVE DATA: ${context.sensitivity === 'high' ? 'Yes' : 'No'}

${question ? `USER QUESTION: ${question}` : ''}`;
};

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

Beskriv observerade samband mellan denna indikator och relaterade förändringar. Använd ENDAST neutralt språk.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ExplainRequest = await req.json();
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    const AI_CHAT_COMPLETIONS_URL = Deno.env.get("AI_CHAT_COMPLETIONS_URL");

    if (!AI_API_KEY || !AI_CHAT_COMPLETIONS_URL) {
      throw new Error("AI service is not configured");
    }

    // ETLIH mode: streaming response
    if (body.level && body.context) {
      const systemPrompt = getETLIHSystemPrompt(body.level, body.language || 'sv');
      const userPrompt = buildETLIHUserPrompt(body.context, body.language || 'sv', body.question);

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
          stream: true,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
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
    }

    // Legacy mode: non-streaming response
    const { type, data, context, lang } = body;
    
    // Build prompt from template
    let prompt = EXPLANATION_TEMPLATES[type || 'kpi'] || EXPLANATION_TEMPLATES.kpi;
    
    // Replace placeholders with actual data
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
      });
    }

    // Add context
    if (context?.language === 'en' || lang === 'en') {
      prompt = `Please respond in English.\n\n${prompt}`;
    }

    if (context?.detail_level === 'simple') {
      prompt += '\n\nHåll svaret kort och enkelt (max 3 meningar).';
    } else if (context?.detail_level === 'detailed') {
      prompt += '\n\nGe en detaljerad förklaring med alla relevanta nyanser.';
    }

    const response = await fetch(AI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
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
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
