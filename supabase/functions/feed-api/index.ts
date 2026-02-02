import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace('/feed-api', '');

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Check authorization
  const authHeader = req.headers.get('Authorization');
  const apiKey = req.headers.get('X-API-Key');

  let supabase;
  let userId: string | null = null;

  if (authHeader) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id || null;
  } else if (apiKey) {
    // API key authentication (for machine-to-machine)
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    // In production, validate API key and get associated user/org
  } else {
    // Public access - only open feeds
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  try {
    // Route handling
    switch (true) {
      // GET /feeds - List available feeds
      case path === '/feeds' && req.method === 'GET': {
        const { data: feeds, error } = await supabase
          .from('feed_definitions')
          .select('code, name, description, tier, category, default_frequency')
          .eq('is_active', true)
          .order('tier', { ascending: true });

        if (error) throw error;

        // Filter based on access level
        const accessibleFeeds = feeds?.filter(f => {
          if (f.tier === 'open') return true;
          if (!userId) return false;
          // In production, check user's subscription tier
          return true;
        });

        return new Response(JSON.stringify({ 
          feeds: accessibleFeeds,
          access_level: userId ? 'authenticated' : 'public',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // GET /feeds/:code/events - Get events from a feed
      case path.match(/^\/feeds\/[^/]+\/events$/) && req.method === 'GET': {
        const feedCode = path.split('/')[2];
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const since = url.searchParams.get('since');
        const severity = url.searchParams.get('severity');
        const region = url.searchParams.get('region');

        // Get feed definition
        const { data: feed, error: feedError } = await supabase
          .from('feed_definitions')
          .select('id, tier')
          .eq('code', feedCode)
          .single();

        if (feedError || !feed) {
          return new Response(JSON.stringify({ error: 'Feed not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Check access
        if (feed.tier !== 'open' && !userId) {
          return new Response(JSON.stringify({ 
            error: 'Authentication required for this feed tier',
            tier: feed.tier,
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        let query = supabase
          .from('feed_events')
          .select('id, severity, scope_type, scope_code, summary, why_now, metrics, confidence, generated_at, explore_url')
          .eq('feed_id', feed.id)
          .order('generated_at', { ascending: false })
          .limit(Math.min(limit, 100));

        if (since) {
          query = query.gte('generated_at', since);
        }
        if (severity) {
          query = query.eq('severity', severity);
        }
        if (region) {
          query = query.eq('scope_code', region);
        }

        const { data: events, error } = await query;
        if (error) throw error;

        // Log interaction if authenticated
        if (userId && events && events.length > 0) {
          await supabase.from('feed_event_interactions').insert(
            events.slice(0, 10).map(e => ({
              event_id: e.id,
              user_id: userId,
              interaction_type: 'viewed',
            }))
          );
        }

        return new Response(JSON.stringify({ 
          feed: feedCode,
          events: events?.map(e => ({
            id: e.id,
            severity: e.severity,
            scope: e.scope_code ? `${e.scope_type}:${e.scope_code}` : e.scope_type,
            summary: e.summary,
            why_now: e.why_now,
            metrics: e.metrics,
            confidence: e.confidence,
            timestamp: e.generated_at,
            links: {
              explore: e.explore_url,
            },
          })),
          count: events?.length || 0,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // POST /subscriptions - Create a subscription
      case path === '/subscriptions' && req.method === 'POST': {
        if (!userId) {
          return new Response(JSON.stringify({ error: 'Authentication required' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const body = await req.json();
        const { feed_code, delivery_method, webhook_url, filters } = body;

        // Get feed
        const { data: feed, error: feedError } = await supabase
          .from('feed_definitions')
          .select('id, tier')
          .eq('code', feed_code)
          .single();

        if (feedError || !feed) {
          return new Response(JSON.stringify({ error: 'Feed not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Create subscription
        const { data: subscription, error } = await supabase
          .from('feed_subscriptions')
          .insert({
            user_id: userId,
            feed_id: feed.id,
            delivery_method: delivery_method || 'api',
            webhook_url: webhook_url,
            region_filter: filters?.regions,
            kpi_category_filter: filters?.categories,
            min_severity: filters?.min_severity || 'low',
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return new Response(JSON.stringify({ error: 'Already subscribed to this feed' }), {
              status: 409,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          throw error;
        }

        return new Response(JSON.stringify({ 
          success: true,
          subscription: {
            id: subscription.id,
            feed: feed_code,
            delivery_method: subscription.delivery_method,
            is_active: subscription.is_active,
          },
        }), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // GET /subscriptions - List user's subscriptions
      case path === '/subscriptions' && req.method === 'GET': {
        if (!userId) {
          return new Response(JSON.stringify({ error: 'Authentication required' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: subscriptions, error } = await supabase
          .from('feed_subscriptions')
          .select(`
            id, delivery_method, is_active, is_paused, created_at,
            region_filter, kpi_category_filter, min_severity,
            feed_definitions(code, name, tier)
          `)
          .eq('user_id', userId);

        if (error) throw error;

        return new Response(JSON.stringify({ 
          subscriptions: subscriptions?.map((s: any) => ({
            id: s.id,
            feed: s.feed_definitions?.code,
            feed_name: s.feed_definitions?.name,
            tier: s.feed_definitions?.tier,
            delivery_method: s.delivery_method,
            is_active: s.is_active,
            is_paused: s.is_paused,
            filters: {
              regions: s.region_filter,
              categories: s.kpi_category_filter,
              min_severity: s.min_severity,
            },
            created_at: s.created_at,
          })),
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // DELETE /subscriptions/:id - Unsubscribe
      case path.match(/^\/subscriptions\/[^/]+$/) && req.method === 'DELETE': {
        if (!userId) {
          return new Response(JSON.stringify({ error: 'Authentication required' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const subscriptionId = path.split('/')[2];

        const { error } = await supabase
          .from('feed_subscriptions')
          .delete()
          .eq('id', subscriptionId)
          .eq('user_id', userId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // POST /events/:id/interact - Log interaction
      case path.match(/^\/events\/[^/]+\/interact$/) && req.method === 'POST': {
        const eventId = path.split('/')[2];
        const body = await req.json();
        const { interaction_type, context } = body;

        if (!userId) {
          return new Response(JSON.stringify({ error: 'Authentication required' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error } = await supabase
          .from('feed_event_interactions')
          .insert({
            event_id: eventId,
            user_id: userId,
            interaction_type: interaction_type || 'viewed',
            interaction_context: context,
          });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ 
          error: 'Not found',
          available_endpoints: [
            'GET /feeds',
            'GET /feeds/:code/events',
            'GET /subscriptions',
            'POST /subscriptions',
            'DELETE /subscriptions/:id',
            'POST /events/:id/interact',
          ],
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error: unknown) {
    console.error('Feed API error:', error);
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
