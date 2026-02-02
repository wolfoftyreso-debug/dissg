import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  feed: string;
  event_id: string;
  severity: string;
  timestamp: string;
  scope: string;
  summary: string;
  why_now: string[];
  metrics: object[];
  confidence: string;
  links: {
    explore: string;
    method: string;
    source: string;
  };
}

// Generate HMAC signature for webhook verification
function generateSignature(payload: string, secret: string): string {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  return `sha256=${hmac.digest('hex')}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { event_id, subscription_id } = await req.json().catch(() => ({}));

    // If specific event and subscription, deliver that one
    if (event_id && subscription_id) {
      const result = await deliverWebhook(supabase, event_id, subscription_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Otherwise, process all pending deliveries
    const { data: pendingDeliveries, error: pendingError } = await supabase
      .from('feed_delivery_log')
      .select(`
        id, subscription_id, event_id, retry_count,
        feed_subscriptions!inner(
          delivery_method, webhook_url, webhook_secret, is_active, is_paused,
          user_id, feed_id
        ),
        feed_events!inner(
          id, severity, scope_type, scope_code, summary, why_now, metrics,
          confidence, explore_url, generated_at,
          feed_definitions!inner(code, name)
        )
      `)
      .eq('status', 'pending')
      .eq('feed_subscriptions.delivery_method', 'webhook')
      .eq('feed_subscriptions.is_active', true)
      .eq('feed_subscriptions.is_paused', false)
      .lt('retry_count', 3)
      .limit(50);

    if (pendingError) throw pendingError;

    const results = {
      processed: 0,
      delivered: 0,
      failed: 0,
      skipped: 0,
    };

    for (const delivery of pendingDeliveries || []) {
      results.processed++;
      
      const sub = delivery.feed_subscriptions as any;
      const event = delivery.feed_events as any;
      
      if (!sub.webhook_url) {
        await supabase
          .from('feed_delivery_log')
          .update({ status: 'skipped', error_message: 'No webhook URL configured' })
          .eq('id', delivery.id);
        results.skipped++;
        continue;
      }

      try {
        const payload: WebhookPayload = {
          feed: event.feed_definitions.code,
          event_id: event.id,
          severity: event.severity,
          timestamp: event.generated_at,
          scope: event.scope_code ? `${event.scope_type}:${event.scope_code}` : event.scope_type,
          summary: event.summary,
          why_now: event.why_now || [],
          metrics: event.metrics || [],
          confidence: event.confidence,
          links: {
            explore: event.explore_url || '',
            method: '/methodology/feeds',
            source: '/sources',
          },
        };

        const payloadString = JSON.stringify(payload);
        const signature = sub.webhook_secret 
          ? generateSignature(payloadString, sub.webhook_secret)
          : '';

        const startTime = Date.now();
        const response = await fetch(sub.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-NOGF-Signature': signature,
            'X-NOGF-Event-ID': event.id,
            'X-NOGF-Feed': event.feed_definitions.code,
          },
          body: payloadString,
        });
        const responseTime = Date.now() - startTime;

        if (response.ok) {
          await supabase
            .from('feed_delivery_log')
            .update({ 
              status: 'delivered',
              response_code: response.status,
              response_time_ms: responseTime,
            })
            .eq('id', delivery.id);
          results.delivered++;
        } else {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await supabase
          .from('feed_delivery_log')
          .update({ 
            status: delivery.retry_count >= 2 ? 'failed' : 'pending',
            error_message: errorMessage,
            retry_count: delivery.retry_count + 1,
          })
          .eq('id', delivery.id);
        results.failed++;
      }
    }

    return new Response(JSON.stringify({ success: true, ...results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in webhook delivery:', error);
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

async function deliverWebhook(supabase: any, eventId: string, subscriptionId: string) {
  const { data: sub, error: subError } = await supabase
    .from('feed_subscriptions')
    .select('*')
    .eq('id', subscriptionId)
    .single();

  if (subError || !sub) {
    return { success: false, error: 'Subscription not found' };
  }

  const { data: event, error: eventError } = await supabase
    .from('feed_events')
    .select(`
      *, feed_definitions(code, name)
    `)
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    return { success: false, error: 'Event not found' };
  }

  // Create delivery log entry
  const { error: logError } = await supabase
    .from('feed_delivery_log')
    .upsert({
      subscription_id: subscriptionId,
      event_id: eventId,
      delivery_method: 'webhook',
      status: 'pending',
    });

  if (logError) {
    return { success: false, error: 'Failed to create delivery log' };
  }

  return { success: true, message: 'Queued for delivery' };
}
