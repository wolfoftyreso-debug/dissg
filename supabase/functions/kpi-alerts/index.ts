import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// KPI threshold configuration for automatic alerts
interface KPIThreshold {
  kpiId: string;
  warningThreshold: number;
  criticalThreshold: number;
  direction: 'above' | 'below'; // 'above' = bad when value is above threshold, 'below' = bad when below
  velocityWarning: number; // % change per period that triggers warning
  velocityCritical: number; // % change per period that triggers critical
}

const KPI_THRESHOLDS: KPIThreshold[] = [
  // Demografi & Hälsa
  { kpiId: 'excess_mortality', warningThreshold: 3, criticalThreshold: 5, direction: 'above', velocityWarning: 20, velocityCritical: 50 },
  { kpiId: 'working_age_functional', warningThreshold: 70, criticalThreshold: 65, direction: 'below', velocityWarning: -1, velocityCritical: -2 },
  { kpiId: 'life_expectancy', warningThreshold: 82, criticalThreshold: 80, direction: 'below', velocityWarning: -0.5, velocityCritical: -1 },
  
  // Arbete & Produktivitet
  { kpiId: 'employment_rate_net', warningThreshold: 68, criticalThreshold: 65, direction: 'below', velocityWarning: -1, velocityCritical: -2 },
  { kpiId: 'long_term_exclusion', warningThreshold: 7, criticalThreshold: 10, direction: 'above', velocityWarning: 5, velocityCritical: 10 },
  
  // Ekonomisk bärkraft
  { kpiId: 'tax_base_growth', warningThreshold: 0.5, criticalThreshold: -0.5, direction: 'below', velocityWarning: -50, velocityCritical: -100 },
  { kpiId: 'dependency_ratio', warningThreshold: 1.75, criticalThreshold: 1.85, direction: 'above', velocityWarning: 2, velocityCritical: 5 },
  
  // Social stabilitet
  { kpiId: 'violent_crime_rate', warningThreshold: 40, criticalThreshold: 50, direction: 'above', velocityWarning: 10, velocityCritical: 20 },
  { kpiId: 'young_men_outside_system', warningThreshold: 12, criticalThreshold: 15, direction: 'above', velocityWarning: 5, velocityCritical: 10 },
  
  // Kärnsystem
  { kpiId: 'healthcare_queue_functional', warningThreshold: 60, criticalThreshold: 90, direction: 'above', velocityWarning: 10, velocityCritical: 20 },
  { kpiId: 'school_outcomes_grade9', warningThreshold: 75, criticalThreshold: 70, direction: 'below', velocityWarning: -2, velocityCritical: -5 },
  
  // Infrastruktur
  { kpiId: 'energy_stability', warningThreshold: 60, criticalThreshold: 40, direction: 'below', velocityWarning: -10, velocityCritical: -20 },
  { kpiId: 'housing_turnover', warningThreshold: 4, criticalThreshold: 3, direction: 'below', velocityWarning: -10, velocityCritical: -20 },
];

interface AlertResult {
  kpiId: string;
  kpiName: string;
  alertType: 'threshold_breach' | 'velocity_warning' | 'trend_reversal' | 'correlation_break';
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  currentValue: number;
  threshold: number;
  trendPercent: number;
}

function evaluateKPI(kpi: {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  trendPercent: number;
  status: string;
}): AlertResult | null {
  const threshold = KPI_THRESHOLDS.find(t => t.kpiId === kpi.id);
  if (!threshold) return null;
  
  const alerts: AlertResult[] = [];
  
  // Check absolute threshold breach
  const isAboveThreshold = threshold.direction === 'above';
  const isCritical = isAboveThreshold 
    ? kpi.value >= threshold.criticalThreshold
    : kpi.value <= threshold.criticalThreshold;
  const isWarning = isAboveThreshold
    ? kpi.value >= threshold.warningThreshold
    : kpi.value <= threshold.warningThreshold;
  
  if (isCritical) {
    return {
      kpiId: kpi.id,
      kpiName: kpi.name,
      alertType: 'threshold_breach',
      severity: 'critical',
      title: `KRITISK: ${kpi.name} har nått kritisk nivå`,
      description: `Värdet ${kpi.value} har passerat den kritiska tröskeln på ${threshold.criticalThreshold}. Omedelbar uppmärksamhet krävs.`,
      currentValue: kpi.value,
      threshold: threshold.criticalThreshold,
      trendPercent: kpi.trendPercent,
    };
  }
  
  if (isWarning) {
    return {
      kpiId: kpi.id,
      kpiName: kpi.name,
      alertType: 'threshold_breach',
      severity: 'warning',
      title: `VARNING: ${kpi.name} närmar sig kritisk nivå`,
      description: `Värdet ${kpi.value} har passerat varningströskeln på ${threshold.warningThreshold}. Övervakning rekommenderas.`,
      currentValue: kpi.value,
      threshold: threshold.warningThreshold,
      trendPercent: kpi.trendPercent,
    };
  }
  
  // Check velocity (rate of change)
  const velocity = kpi.trendPercent;
  const isCriticalVelocity = isAboveThreshold
    ? velocity >= threshold.velocityCritical
    : velocity <= threshold.velocityCritical;
  const isWarningVelocity = isAboveThreshold
    ? velocity >= threshold.velocityWarning
    : velocity <= threshold.velocityWarning;
  
  if (isCriticalVelocity) {
    return {
      kpiId: kpi.id,
      kpiName: kpi.name,
      alertType: 'velocity_warning',
      severity: 'critical',
      title: `KRITISK TREND: ${kpi.name} förändras snabbt`,
      description: `Förändringshastigheten på ${velocity.toFixed(1)}% överskrider den kritiska gränsen. Accelererande problem.`,
      currentValue: kpi.value,
      threshold: threshold.velocityCritical,
      trendPercent: velocity,
    };
  }
  
  if (isWarningVelocity) {
    return {
      kpiId: kpi.id,
      kpiName: kpi.name,
      alertType: 'velocity_warning',
      severity: 'warning',
      title: `VARNING: ${kpi.name} visar oroväckande trend`,
      description: `Förändringshastigheten på ${velocity.toFixed(1)}% indikerar negativ utveckling.`,
      currentValue: kpi.value,
      threshold: threshold.velocityWarning,
      trendPercent: velocity,
    };
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, kpis } = await req.json();

    if (action === "analyze") {
      // Analyze provided KPIs for alerts
      const alerts: AlertResult[] = [];
      
      for (const kpi of kpis) {
        const alert = evaluateKPI(kpi);
        if (alert) {
          alerts.push(alert);
        }
      }
      
      // Sort by severity (critical first)
      alerts.sort((a, b) => {
        if (a.severity === 'critical' && b.severity !== 'critical') return -1;
        if (a.severity !== 'critical' && b.severity === 'critical') return 1;
        return 0;
      });

      return new Response(JSON.stringify({ alerts, analyzed: kpis.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "store") {
      // Store alerts in the database
      const { alerts } = await req.json();
      
      for (const alert of alerts) {
        // Check if similar alert already exists (within last 24 hours)
        const { data: existing } = await supabase
          .from("kpi_alerts")
          .select("id")
          .eq("kpi_id", alert.kpiId)
          .eq("alert_type", alert.alertType)
          .gte("triggered_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .limit(1);
        
        if (!existing || existing.length === 0) {
          // Get the KPI definition ID
          const { data: kpiDef } = await supabase
            .from("kpi_definitions")
            .select("id")
            .eq("code", alert.kpiId)
            .single();
          
          if (kpiDef) {
            await supabase.from("kpi_alerts").insert({
              kpi_id: kpiDef.id,
              alert_type: alert.alertType,
              severity: alert.severity,
              title: alert.title,
              description: alert.description,
              metadata: {
                currentValue: alert.currentValue,
                threshold: alert.threshold,
                trendPercent: alert.trendPercent,
              },
            });
          }
        }
      }

      return new Response(JSON.stringify({ stored: alerts.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "fetch") {
      // Fetch recent alerts
      const { data: alerts, error } = await supabase
        .from("kpi_alerts")
        .select(`
          *,
          kpi_definitions (
            code,
            name,
            category
          )
        `)
        .is("acknowledged_at", null)
        .order("triggered_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return new Response(JSON.stringify({ alerts }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "acknowledge") {
      const { alertId, userId } = await req.json();
      
      const { error } = await supabase
        .from("kpi_alerts")
        .update({
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: userId,
        })
        .eq("id", alertId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("kpi-alerts error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
