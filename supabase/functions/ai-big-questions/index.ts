/**
 * AI Big Questions Endpoint
 * 
 * Block 57: AI-Agent SDK
 * 
 * Returns auto-ranked Big Questions for AI agents.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const scope = url.searchParams.get('scope') || 'global';
    const limit = parseInt(url.searchParams.get('limit') || '5');
    const category = url.searchParams.get('category');

    // Parse scope
    let countryCode: string | null = null;
    if (scope.startsWith('country:')) {
      countryCode = scope.replace('country:', '').toUpperCase();
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch questions
    let query = supabase
      .from('big_questions')
      .select('*')
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: questions, error } = await query.limit(limit);

    if (error) {
      throw error;
    }

    // Fetch rankings
    const questionIds = questions?.map(q => q.id) || [];
    
    let rankingsQuery = supabase
      .from('big_question_rankings')
      .select('*')
      .in('question_id', questionIds)
      .order('importance_score', { ascending: false });

    if (countryCode) {
      rankingsQuery = rankingsQuery.eq('country_code', countryCode);
    } else {
      rankingsQuery = rankingsQuery.is('country_code', null);
    }

    const { data: rankings } = await rankingsQuery;

    // Combine and format for AI consumption
    const rankingsMap = new Map(rankings?.map(r => [r.question_id, r]) || []);

    const formattedQuestions = questions?.map((q, index) => {
      const ranking = rankingsMap.get(q.id);
      return {
        rank: index + 1,
        code: q.code,
        question: q.question_text,
        category: q.category,
        summary: q.short_description,
        what_this_shows: q.what_this_shows,
        what_this_does_not_show: q.what_this_does_not_show,
        importance_score: ranking?.importance_score || null,
        rank_change: ranking?.rank_change || 0,
        data_uncertainty: ranking?.data_uncertainty || null,
        citation_url: `https://example.org/big-questions/${q.code}`,
        primary_indicators: q.primary_kpi_codes,
      };
    }) || [];

    // Sort by importance score
    formattedQuestions.sort((a, b) => 
      (b.importance_score || 0) - (a.importance_score || 0)
    );

    return new Response(
      JSON.stringify({
        scope,
        period: '2024-W05',
        questions: formattedQuestions,
        metadata: {
          total_questions: formattedQuestions.length,
          ranking_method: 'trend_acceleration + cross_domain_impact + population_affected - data_uncertainty',
          last_calculated: new Date().toISOString(),
          note: 'Rankings update automatically based on data changes. No manual prioritization.',
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Big Questions API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Big Questions' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
