import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const feedCodes = url.searchParams.get('feeds')?.split(',') || [];
  const minSeverity = url.searchParams.get('min_severity') || 'low';
  const regionFilter = url.searchParams.get('region');

  // Get authorization
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: authHeader } },
  });

  // Verify user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Severity ordering
  const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
  const minSeverityLevel = severityOrder[minSeverity as keyof typeof severityOrder] || 0;

  // Set up SSE stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // Send initial connection event
      controller.enqueue(encoder.encode(`event: connected\ndata: ${JSON.stringify({ 
        user_id: user.id,
        feeds: feedCodes,
        min_severity: minSeverity,
      })}\n\n`));

      // Use service role for realtime subscription
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const adminClient = createClient(supabaseUrl, serviceKey);

      // Subscribe to feed events
      const channel = adminClient
        .channel('feed-events-sse')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'feed_events',
          },
          async (payload) => {
            const event = payload.new;
            
            // Check severity filter
            const eventSeverity = severityOrder[event.severity as keyof typeof severityOrder] || 0;
            if (eventSeverity < minSeverityLevel) return;

            // Check region filter
            if (regionFilter && event.scope_code !== regionFilter) return;

            // Get feed details
            const { data: feed } = await adminClient
              .from('feed_definitions')
              .select('code, name, tier')
              .eq('id', event.feed_id)
              .single();

            if (!feed) return;

            // Check feed filter
            if (feedCodes.length > 0 && !feedCodes.includes(feed.code)) return;

            // Check user has access to this tier
            // (In production, check user's subscription level)
            
            const sseEvent = {
              id: event.id,
              feed: feed.code,
              feed_name: feed.name,
              tier: feed.tier,
              severity: event.severity,
              scope: event.scope_code ? `${event.scope_type}:${event.scope_code}` : event.scope_type,
              summary: event.summary,
              why_now: event.why_now,
              metrics: event.metrics,
              confidence: event.confidence,
              timestamp: event.generated_at,
              links: {
                explore: event.explore_url,
              },
            };

            controller.enqueue(encoder.encode(
              `event: feed_event\ndata: ${JSON.stringify(sseEvent)}\n\n`
            ));
          }
        )
        .subscribe();

      // Keep-alive ping every 30 seconds
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keep-alive\n\n`));
        } catch {
          clearInterval(keepAlive);
          channel.unsubscribe();
        }
      }, 30000);

      // Clean up on close
      req.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        channel.unsubscribe();
      });
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
});
