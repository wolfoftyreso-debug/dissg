/**
 * Create Checkout Session
 * 
 * 🔥 MONSTER CHECKOUT
 * Creates Stripe checkout session with legal requirements
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { priceId, successUrl, cancelUrl, legalAcceptance } = await req.json();

    // Validate legal acceptance (REQUIRED)
    if (!legalAcceptance?.termsOfService || 
        !legalAcceptance?.responsibilityClause || 
        !legalAcceptance?.dataUsagePolicy) {
      return new Response(
        JSON.stringify({ 
          error: 'Legal acceptance required',
          required: ['termsOfService', 'responsibilityClause', 'dataUsagePolicy']
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For analyst tier, also require scenario disclaimer
    if (priceId?.includes('analyst') && !legalAcceptance?.scenarioDisclaimer) {
      return new Response(
        JSON.stringify({ 
          error: 'Scenario disclaimer acceptance required for Analyst tier',
          required: ['scenarioDisclaimer']
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store legal acceptance
    const now = new Date().toISOString();
    await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: user.id,
        tier: 'observer', // Will be upgraded after payment
        status: 'incomplete',
        terms_accepted_at: now,
        responsibility_accepted_at: now,
        scenario_disclaimer_accepted_at: legalAcceptance.scenarioDisclaimer ? now : null,
        data_usage_policy_accepted_at: now,
      }, {
        onConflict: 'user_id',
      });

    // If Stripe is not configured, return mock response
    if (!stripeSecretKey) {
      console.log('Stripe not configured - returning mock checkout URL');
      return new Response(
        JSON.stringify({ 
          url: `${successUrl}?session_id=mock_session_${Date.now()}`,
          mock: true,
          message: 'Stripe not configured. In production, this would redirect to Stripe Checkout.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'success_url': successUrl,
        'cancel_url': cancelUrl,
        'customer_email': user.email || '',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'metadata[user_id]': user.id,
        'metadata[price_id]': priceId,
        'subscription_data[metadata][user_id]': user.id,
      }),
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error('Stripe error:', session);
      return new Response(
        JSON.stringify({ error: 'Failed to create checkout session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
