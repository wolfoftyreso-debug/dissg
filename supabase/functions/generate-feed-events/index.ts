import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeedDefinition {
  id: string;
  code: string;
  name: string;
  tier: string;
  min_effect_threshold: number;
  min_duration_periods: number;
  min_confidence: number;
  max_events_per_day: number;
}

interface GeneratedEvent {
  feed_id: string;
  severity: string;
  scope_type: string;
  scope_code: string | null;
  summary: string;
  why_now: string[];
  metrics: object[];
  kpi_ids: string[];
  confidence: string;
  data_sources: string[];
  explore_url: string;
  checksum: string;
}

// Compute SHA-256 checksum for deduplication
async function computeChecksum(data: object): Promise<string> {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


// Generate "why now" reasons
function generateWhyNow(context: {
  trendAccelerating: boolean;
  affectsMasterIndex: boolean;
  hasResponsibleEntity: boolean;
  persistentTrend: boolean;
  crossesThreshold: boolean;
  correlatesWithOthers: boolean;
}): string[] {
  const reasons: string[] = [];
  
  if (context.trendAccelerating) reasons.push('Acceleration över tröskel');
  if (context.affectsMasterIndex) reasons.push('Påverkar masterindex');
  if (context.hasResponsibleEntity) reasons.push('Mandat identifierat');
  if (context.persistentTrend) reasons.push('Ihållande trend över tid');
  if (context.crossesThreshold) reasons.push('Passerar kritiskt tröskelvärde');
  if (context.correlatesWithOthers) reasons.push('Korrelerar med andra signaler');
  
  return reasons;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { feed_code, force_generation } = await req.json().catch(() => ({}));

    // Get active feed definitions
    let feedQuery = supabase
      .from('feed_definitions')
      .select('*')
      .eq('is_active', true);
    
    if (feed_code) {
      feedQuery = feedQuery.eq('code', feed_code);
    }

    const { data: feeds, error: feedsError } = await feedQuery;
    if (feedsError) throw feedsError;

    const generatedEvents: GeneratedEvent[] = [];
    const today = new Date().toISOString().split('T')[0];

    for (const feed of feeds as FeedDefinition[]) {
      // Check anti-spam limit
      if (!force_generation) {
        const { count } = await supabase
          .from('feed_events')
          .select('*', { count: 'exact', head: true })
          .eq('feed_id', feed.id)
          .gte('generated_at', `${today}T00:00:00Z`);

        if ((count || 0) >= feed.max_events_per_day) {
          console.log(`Skipping ${feed.code}: max events reached for today`);
          continue;
        }
      }

      // Generate events based on feed type
      const events = await generateEventsForFeed(supabase, feed);
      
      for (const event of events) {
        // Check for duplicates using checksum
        const { data: existing } = await supabase
          .from('feed_events')
          .select('id')
          .eq('feed_id', feed.id)
          .eq('checksum', event.checksum)
          .single();

        if (!existing) {
          const { error: insertError } = await supabase
            .from('feed_events')
            .insert(event);

          if (!insertError) {
            generatedEvents.push(event);
          }
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      events_generated: generatedEvents.length,
      events: generatedEvents.map(e => ({
        feed_id: e.feed_id,
        severity: e.severity,
        summary: e.summary.slice(0, 100) + '...',
      })),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error generating feed events:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateEventsForFeed(supabase: any, feed: FeedDefinition): Promise<GeneratedEvent[]> {
  const events: GeneratedEvent[] = [];
  
  switch (feed.code) {
    case 'daily_top_changes':
      events.push(...await generateDailyTopChanges(supabase, feed));
      break;
    case 'emerging_trends':
      events.push(...await generateEmergingTrends(supabase, feed));
      break;
    case 'regional_anomalies':
      events.push(...await generateRegionalAnomalies(supabase, feed));
      break;
    case 'priority_alerts':
      events.push(...await generatePriorityAlerts(supabase, feed));
      break;
    case 'structural_decline':
      events.push(...await generateStructuralDecline(supabase, feed));
      break;
    case 'early_warning':
      events.push(...await generateEarlyWarning(supabase, feed));
      break;
    default:
      // Generic generation for other feeds
      break;
  }

  return events;
}

// DAILY TOP CHANGES
async function generateDailyTopChanges(supabase: any, feed: FeedDefinition): Promise<GeneratedEvent[]> {
  const { data: changes } = await supabase
    .from('kpi_values')
    .select(`
      id, kpi_id, value, previous_value, trend, trend_percent, status,
      kpi_definitions(name, code, category)
    `)
    .not('trend_percent', 'is', null)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('trend_percent', { ascending: false })
    .limit(10);

  if (!changes || changes.length === 0) return [];

  const topImprovements = changes.filter((c: any) => (c.trend_percent || 0) > feed.min_effect_threshold);
  const topDeclines = changes.filter((c: any) => (c.trend_percent || 0) < -feed.min_effect_threshold);

  const events: GeneratedEvent[] = [];

  if (topImprovements.length > 0 || topDeclines.length > 0) {
    const checksum = await computeChecksum({
      date: new Date().toISOString().split('T')[0],
      improvements: topImprovements.map((c: any) => c.kpi_id),
      declines: topDeclines.map((c: any) => c.kpi_id),
    });

    const summary = `Dagens ${topImprovements.length} största förbättringar och ${topDeclines.length} försämringar registrerade.`;
    
    events.push({
      feed_id: feed.id,
      severity: topDeclines.some((c: any) => Math.abs(c.trend_percent) >= 5) ? 'high' : 'medium',
      scope_type: 'national',
      scope_code: null,
      summary,
      why_now: ['Daglig sammanställning', 'Signifikanta förändringar observerade'],
      metrics: [...topImprovements, ...topDeclines].slice(0, 5).map((c: any) => ({
        kpi: c.kpi_definitions?.code || 'unknown',
        name: c.kpi_definitions?.name || 'Okänd',
        delta: `${c.trend_percent > 0 ? '+' : ''}${c.trend_percent?.toFixed(1)}%`,
        period: '24h',
      })),
      kpi_ids: changes.map((c: any) => c.kpi_id),
      confidence: 'high',
      data_sources: ['SCB', 'Kolada'],
      explore_url: '/public?view=changes',
      checksum,
    });
  }

  return events;
}

// EMERGING TRENDS
async function generateEmergingTrends(supabase: any, feed: FeedDefinition): Promise<GeneratedEvent[]> {
  // Look for KPIs with consistent direction over multiple periods
  const { data: trends } = await supabase
    .from('kpi_values')
    .select(`
      kpi_id, trend, trend_percent,
      kpi_definitions(name, code)
    `)
    .eq('trend', 'up')
    .gte('trend_percent', feed.min_effect_threshold)
    .gte('period_start', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
    .order('trend_percent', { ascending: false })
    .limit(20);

  if (!trends || trends.length < 3) return [];

  // Group by KPI to find consistent trends
  const kpiCounts = new Map<string, { count: number; name: string; avgChange: number }>();
  for (const t of trends) {
    const existing = kpiCounts.get(t.kpi_id) || { count: 0, name: t.kpi_definitions?.name, avgChange: 0 };
    existing.count++;
    existing.avgChange += t.trend_percent || 0;
    kpiCounts.set(t.kpi_id, existing);
  }

  const emergingKpis = Array.from(kpiCounts.entries())
    .filter(([_, v]) => v.count >= feed.min_duration_periods)
    .map(([kpiId, v]) => ({
      kpi_id: kpiId,
      name: v.name,
      avgChange: v.avgChange / v.count,
      periods: v.count,
    }));

  if (emergingKpis.length === 0) return [];

  const checksum = await computeChecksum({
    date: new Date().toISOString().split('T')[0],
    kpis: emergingKpis.map(k => k.kpi_id),
  });

  return [{
    feed_id: feed.id,
    severity: 'medium',
    scope_type: 'national',
    scope_code: null,
    summary: `${emergingKpis.length} framväxande positiva trender identifierade i data.`,
    why_now: generateWhyNow({
      trendAccelerating: true,
      affectsMasterIndex: false,
      hasResponsibleEntity: false,
      persistentTrend: true,
      crossesThreshold: false,
      correlatesWithOthers: emergingKpis.length > 2,
    }),
    metrics: emergingKpis.slice(0, 5).map(k => ({
      kpi: k.name,
      delta: `+${k.avgChange.toFixed(1)}%`,
      period: `${k.periods} periods`,
    })),
    kpi_ids: emergingKpis.map(k => k.kpi_id),
    confidence: 'medium',
    data_sources: ['SCB'],
    explore_url: '/public?view=trends',
    checksum,
  }];
}

// REGIONAL ANOMALIES
async function generateRegionalAnomalies(supabase: any, feed: FeedDefinition): Promise<GeneratedEvent[]> {
  const { data: regionalData } = await supabase
    .from('kpi_values')
    .select(`
      kpi_id, region_code, value, trend_percent,
      kpi_definitions(name, code)
    `)
    .not('region_code', 'is', null)
    .not('trend_percent', 'is', null)
    .gte('period_start', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (!regionalData || regionalData.length === 0) return [];

  // Find regions that deviate significantly from national average
  const events: GeneratedEvent[] = [];
  const anomalies = regionalData.filter((r: any) => 
    Math.abs(r.trend_percent || 0) >= feed.min_effect_threshold
  );

  if (anomalies.length > 0) {
    const byRegion = new Map<string, any[]>();
    for (const a of anomalies) {
      const list = byRegion.get(a.region_code) || [];
      list.push(a);
      byRegion.set(a.region_code, list);
    }

    for (const [regionCode, items] of byRegion.entries()) {
      if (items.length >= 2) {
        const checksum = await computeChecksum({
          date: new Date().toISOString().split('T')[0],
          region: regionCode,
          kpis: items.map((i: any) => i.kpi_id),
        });

        events.push({
          feed_id: feed.id,
          severity: items.some((i: any) => Math.abs(i.trend_percent) >= 10) ? 'high' : 'medium',
          scope_type: 'regional',
          scope_code: regionCode,
          summary: `Region ${regionCode}: ${items.length} indikatorer avviker signifikant från riksgenomsnittet.`,
          why_now: ['Regional avvikelse detekterad', 'Flera indikatorer samvarierar'],
          metrics: items.slice(0, 3).map((i: any) => ({
            kpi: i.kpi_definitions?.name || 'Okänd',
            delta: `${i.trend_percent > 0 ? '+' : ''}${i.trend_percent?.toFixed(1)}%`,
            period: '30 dagar',
          })),
          kpi_ids: items.map((i: any) => i.kpi_id),
          confidence: 'medium',
          data_sources: ['SCB', 'Kolada'],
          explore_url: `/regional?region=${regionCode}`,
          checksum,
        });
      }
    }
  }

  return events.slice(0, feed.max_events_per_day);
}

// PRIORITY ALERTS
async function generatePriorityAlerts(supabase: any, feed: FeedDefinition): Promise<GeneratedEvent[]> {
  // Get high-relevance observations
  const { data: observations } = await supabase
    .from('observations')
    .select(`
      id, title, description, observation_type, confidence_level, signal_strength,
      kpi_id, kpi_definitions(name, code)
    `)
    .eq('status', 'new')
    .gte('signal_strength', 0.7)
    .gte('confidence_level', feed.min_confidence)
    .order('signal_strength', { ascending: false })
    .limit(5);

  if (!observations || observations.length === 0) return [];

  const events: GeneratedEvent[] = [];

  for (const obs of observations) {
    const checksum = await computeChecksum({
      observation_id: obs.id,
      date: new Date().toISOString().split('T')[0],
    });

    events.push({
      feed_id: feed.id,
      severity: obs.signal_strength >= 0.9 ? 'critical' : 'high',
      scope_type: 'national',
      scope_code: null,
      summary: obs.title,
      why_now: generateWhyNow({
        trendAccelerating: obs.observation_type === 'acceleration',
        affectsMasterIndex: obs.signal_strength >= 0.8,
        hasResponsibleEntity: true,
        persistentTrend: obs.observation_type === 'persistent_trend',
        crossesThreshold: obs.observation_type === 'threshold_breach',
        correlatesWithOthers: false,
      }),
      metrics: [{
        kpi: obs.kpi_definitions?.name || 'Okänd',
        signal_strength: obs.signal_strength,
        confidence: obs.confidence_level,
      }],
      kpi_ids: [obs.kpi_id],
      confidence: obs.confidence_level >= 0.9 ? 'high' : 'medium',
      data_sources: ['Analysmotor'],
      explore_url: `/public?observation=${obs.id}`,
      checksum,
    });
  }

  return events;
}

// STRUCTURAL DECLINE
async function generateStructuralDecline(supabase: any, feed: FeedDefinition): Promise<GeneratedEvent[]> {
  // Look for KPIs with sustained negative trends
  const { data: declines } = await supabase
    .from('kpi_values')
    .select(`
      kpi_id, trend_percent,
      kpi_definitions(name, code, category)
    `)
    .eq('trend', 'down')
    .lte('trend_percent', -2)
    .gte('period_start', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())
    .order('trend_percent', { ascending: true });

  if (!declines || declines.length === 0) return [];

  // Count consistent declines per KPI
  const kpiDeclines = new Map<string, { count: number; name: string; totalDecline: number }>();
  for (const d of declines) {
    const existing = kpiDeclines.get(d.kpi_id) || { count: 0, name: d.kpi_definitions?.name, totalDecline: 0 };
    existing.count++;
    existing.totalDecline += d.trend_percent || 0;
    kpiDeclines.set(d.kpi_id, existing);
  }

  const structural = Array.from(kpiDeclines.entries())
    .filter(([_, v]) => v.count >= 3) // At least 3 periods of decline
    .map(([kpiId, v]) => ({
      kpi_id: kpiId,
      name: v.name,
      totalDecline: v.totalDecline,
      periods: v.count,
    }))
    .sort((a, b) => a.totalDecline - b.totalDecline);

  if (structural.length === 0) return [];

  const checksum = await computeChecksum({
    date: new Date().toISOString().split('T')[0],
    kpis: structural.map(s => s.kpi_id),
  });

  return [{
    feed_id: feed.id,
    severity: structural.some(s => s.totalDecline <= -15) ? 'critical' : 'high',
    scope_type: 'national',
    scope_code: null,
    summary: `${structural.length} indikatorer visar tecken på strukturell nedgång över minst 6 månader.`,
    why_now: generateWhyNow({
      trendAccelerating: false,
      affectsMasterIndex: true,
      hasResponsibleEntity: true,
      persistentTrend: true,
      crossesThreshold: structural.some(s => s.totalDecline <= -10),
      correlatesWithOthers: structural.length > 2,
    }),
    metrics: structural.slice(0, 5).map(s => ({
      kpi: s.name,
      delta: `${s.totalDecline.toFixed(1)}%`,
      period: `${s.periods} perioder`,
    })),
    kpi_ids: structural.map(s => s.kpi_id),
    confidence: 'high',
    data_sources: ['SCB', 'Kolada'],
    explore_url: '/public?view=declines',
    checksum,
  }];
}

// EARLY WARNING
async function generateEarlyWarning(supabase: any, feed: FeedDefinition): Promise<GeneratedEvent[]> {
  // Look for multiple converging signals
  const { data: recentAlerts } = await supabase
    .from('kpi_alerts')
    .select(`
      id, kpi_id, title, severity, alert_type,
      kpi_definitions(name, code, category)
    `)
    .is('resolved_at', null)
    .gte('triggered_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .in('severity', ['warning', 'critical']);

  if (!recentAlerts || recentAlerts.length < 2) return [];

  // Group by category to find converging signals
  const byCategory = new Map<string, any[]>();
  for (const alert of recentAlerts) {
    const cat = alert.kpi_definitions?.category || 'unknown';
    const list = byCategory.get(cat) || [];
    list.push(alert);
    byCategory.set(cat, list);
  }

  const events: GeneratedEvent[] = [];

  for (const [category, alerts] of byCategory.entries()) {
    if (alerts.length >= 2) {
      const checksum = await computeChecksum({
        date: new Date().toISOString().split('T')[0],
        category,
        alerts: alerts.map(a => a.id),
      });

      events.push({
        feed_id: feed.id,
        severity: alerts.some(a => a.severity === 'critical') ? 'critical' : 'high',
        scope_type: 'national',
        scope_code: null,
        summary: `Tidig varning: ${alerts.length} sammanfallande signaler inom ${category}.`,
        why_now: generateWhyNow({
          trendAccelerating: true,
          affectsMasterIndex: true,
          hasResponsibleEntity: false,
          persistentTrend: false,
          crossesThreshold: true,
          correlatesWithOthers: true,
        }),
        metrics: alerts.map(a => ({
          kpi: a.kpi_definitions?.name || 'Okänd',
          alert_type: a.alert_type,
          severity: a.severity,
        })),
        kpi_ids: alerts.map(a => a.kpi_id),
        confidence: 'medium',
        data_sources: ['Analysmotor'],
        explore_url: `/public?category=${category}`,
        checksum,
      });
    }
  }

  return events;
}
