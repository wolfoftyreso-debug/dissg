import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ActionOption {
  id: string;
  title: string;
  description: string;
  target_kpi_ids: string[];
  category: string;
  responsible_department: string;
  estimated_cost_sek: number | null;
  estimated_timeframe_months: number | null;
}

interface KPIData {
  id: string;
  name: string;
  value: number;
  status: string;
  trend: string;
  trend_percent: number;
}

interface EvaluationResult {
  effect_score: number;
  cost_score: number;
  risk_score: number;
  reversibility_score: number;
  effect_rationale: string;
  cost_rationale: string;
  risk_rationale: string;
  reversibility_rationale: string;
  summary: string;
  recommendation: string;
  potential_side_effects: string[];
  dependencies: string[];
  kpi_impact_forecast: { kpi_id: string; expected_change_percent: number; confidence: number }[];
}

interface Weights {
  effect_weight: number;
  cost_weight: number;
  risk_weight: number;
  reversibility_weight: number;
}

function calculateWeightedScore(evaluation: EvaluationResult, weights: Weights): number {
  // Invertera risk_score (lägre risk = bättre)
  const invertedRisk = 100 - evaluation.risk_score;
  
  return (
    evaluation.effect_score * weights.effect_weight +
    evaluation.cost_score * weights.cost_weight +
    invertedRisk * weights.risk_weight +
    evaluation.reversibility_score * weights.reversibility_weight
  );
}

function determinePriority(weightedScore: number): string {
  if (weightedScore >= 80) return 'critical';
  if (weightedScore >= 65) return 'high';
  if (weightedScore >= 45) return 'medium';
  if (weightedScore >= 25) return 'low';
  return 'monitor';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action_id, action_ids } = await req.json();
    
    // Stöd för både enskild åtgärd och batch
    const idsToProcess = action_ids || (action_id ? [action_id] : []);
    
    if (idsToProcess.length === 0) {
      return new Response(
        JSON.stringify({ error: "action_id eller action_ids krävs" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Hämta åtgärder
    const { data: actions, error: actionsError } = await supabase
      .from('action_options')
      .select('*')
      .in('id', idsToProcess);

    if (actionsError || !actions?.length) {
      return new Response(
        JSON.stringify({ error: "Kunde inte hitta åtgärder", details: actionsError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Hämta aktuella vikter
    const { data: weightsData } = await supabase
      .from('evaluation_weights')
      .select('*')
      .eq('is_active', true)
      .single();

    const weights: Weights = weightsData || {
      effect_weight: 0.40,
      cost_weight: 0.25,
      risk_weight: 0.20,
      reversibility_weight: 0.15,
    };

    // Hämta relevanta KPI:er för kontext
    const allKpiIds = [...new Set(actions.flatMap((a: ActionOption) => a.target_kpi_ids))];
    
    const { data: kpiDefinitions } = await supabase
      .from('kpi_definitions')
      .select('id, name, category, unit, rationale')
      .in('id', allKpiIds);

    const { data: kpiValues } = await supabase
      .from('kpi_values')
      .select('kpi_id, value, status, trend, trend_percent, period_end')
      .in('kpi_id', allKpiIds)
      .order('period_end', { ascending: false });

    // Bygg KPI-kontext
    const kpiContext = kpiDefinitions?.map(def => {
      const latestValue = kpiValues?.find(v => v.kpi_id === def.id);
      return {
        id: def.id,
        name: def.name,
        category: def.category,
        unit: def.unit,
        rationale: def.rationale,
        currentValue: latestValue?.value,
        status: latestValue?.status,
        trend: latestValue?.trend,
        trendPercent: latestValue?.trend_percent,
      };
    }) || [];

    const results = [];

    // Utvärdera varje åtgärd med AI
    for (const action of actions as ActionOption[]) {
      const relevantKpis = kpiContext.filter(k => action.target_kpi_ids.includes(k.id));
      
      const systemPrompt = `Du är en expert på offentlig förvaltning och policyanalys i Sverige. Din uppgift är att utvärdera föreslagna åtgärder mot fyra dimensioner:

1. EFFEKT (0-100): Hur stor positiv påverkan på målindikatorerna? Basera på evidens och logisk koppling.
2. KOSTNAD (0-100): Hur kostnadseffektiv är åtgärden? 100 = mycket kostnadseffektiv, 0 = extremt dyr relativt effekt.
3. RISK (0-100): Hur hög är risken för negativa sidoeffekter eller misslyckande? 0 = minimal risk, 100 = mycket hög risk.
4. REVERSIBILITET (0-100): Hur lätt är det att backa om åtgärden inte fungerar? 100 = helt reversibel, 0 = irreversibel.

Var objektiv, saklig och basera dina bedömningar på:
- Aktuellt tillstånd för berörda indikatorer
- Uppskattad kostnad och tidsram
- Historisk effektivitet av liknande åtgärder
- Potentiella oavsiktliga konsekvenser

Svara ENDAST med ett JSON-objekt utan extra text eller markdown.`;

      const userPrompt = `Utvärdera följande åtgärdsförslag:

## Åtgärd
**Titel:** ${action.title}
**Beskrivning:** ${action.description}
**Kategori:** ${action.category}
**Ansvarigt departement:** ${action.responsible_department}
**Uppskattad kostnad:** ${action.estimated_cost_sek ? `${(action.estimated_cost_sek / 1000000).toFixed(0)} MSEK` : 'Ej specificerad'}
**Uppskattad tid till effekt:** ${action.estimated_timeframe_months ? `${action.estimated_timeframe_months} månader` : 'Ej specificerad'}

## Berörda indikatorer (aktuellt läge)
${relevantKpis.map(k => `- **${k.name}** (${k.category})
  - Värde: ${k.currentValue} ${k.unit || ''}
  - Status: ${k.status}
  - Trend: ${k.trend} (${k.trendPercent?.toFixed(1) || '?'}%)
  - Betydelse: ${k.rationale}`).join('\n\n')}

## Viktning som används
- Effekt: ${(weights.effect_weight * 100).toFixed(0)}%
- Kostnad: ${(weights.cost_weight * 100).toFixed(0)}%
- Risk: ${(weights.risk_weight * 100).toFixed(0)}%
- Reversibilitet: ${(weights.reversibility_weight * 100).toFixed(0)}%

Returnera ett JSON-objekt med exakt denna struktur:
{
  "effect_score": <0-100>,
  "cost_score": <0-100>,
  "risk_score": <0-100>,
  "reversibility_score": <0-100>,
  "effect_rationale": "<motivering för effektpoäng, max 100 ord>",
  "cost_rationale": "<motivering för kostnadspoäng, max 100 ord>",
  "risk_rationale": "<motivering för riskpoäng, max 100 ord>",
  "reversibility_rationale": "<motivering för reversibilitetspoäng, max 100 ord>",
  "summary": "<sammanfattning av utvärderingen, max 50 ord>",
  "recommendation": "<konkret rekommendation: genomför/avvakta/avslå, max 100 ord>",
  "potential_side_effects": ["<sidoeffekt 1>", "<sidoeffekt 2>"],
  "dependencies": ["<beroende av annan åtgärd eller förutsättning>"],
  "kpi_impact_forecast": [
    {"kpi_id": "${relevantKpis[0]?.id || 'kpi-id'}", "expected_change_percent": <förväntad förändring i %>, "confidence": <0-100>}
  ]
}`;

      // Anropa Lovable AI
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
          temperature: 0.3,  // Låg temperatur för mer konsekvent output
        }),
      });

      if (!aiResponse.ok) {
        if (aiResponse.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit överskriden. Försök igen om en stund." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (aiResponse.status === 402) {
          return new Response(
            JSON.stringify({ error: "Krediter slut. Fyll på i Lovable-inställningar." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errorText = await aiResponse.text();
        console.error("AI gateway error:", aiResponse.status, errorText);
        throw new Error(`AI gateway error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Inget svar från AI");
      }

      // Parsa JSON från AI-svaret
      let evaluation: EvaluationResult;
      try {
        // Ta bort eventuell markdown-formatering
        const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
        evaluation = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error("Failed to parse AI response:", content);
        throw new Error("Kunde inte tolka AI-svaret");
      }

      // Beräkna viktad poäng
      const weightedScore = calculateWeightedScore(evaluation, weights);
      const priority = determinePriority(weightedScore);

      // Spara utvärderingen
      const { data: savedEvaluation, error: saveError } = await supabase
        .from('action_evaluations')
        .insert({
          action_id: action.id,
          effect_score: evaluation.effect_score,
          cost_score: evaluation.cost_score,
          risk_score: evaluation.risk_score,
          reversibility_score: evaluation.reversibility_score,
          weighted_score: weightedScore,
          priority: priority,
          effect_rationale: evaluation.effect_rationale,
          cost_rationale: evaluation.cost_rationale,
          risk_rationale: evaluation.risk_rationale,
          reversibility_rationale: evaluation.reversibility_rationale,
          summary: evaluation.summary,
          recommendation: evaluation.recommendation,
          potential_side_effects: evaluation.potential_side_effects || [],
          dependencies: evaluation.dependencies || [],
          kpi_impact_forecast: evaluation.kpi_impact_forecast || [],
          model_used: "google/gemini-3-flash-preview",
          evaluation_context: { kpi_context: relevantKpis, weights },
          confidence_level: 75,
        })
        .select()
        .single();

      if (saveError) {
        console.error("Failed to save evaluation:", saveError);
        throw new Error(`Kunde inte spara utvärdering: ${saveError.message}`);
      }

      results.push({
        action_id: action.id,
        action_title: action.title,
        evaluation: savedEvaluation,
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        evaluations: results,
        weights_used: weights,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("prioritize-actions error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Okänt fel",
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});