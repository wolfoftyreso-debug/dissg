/**
 * AI Ask Endpoint
 * 
 * Block 57: AI-Agent SDK — Default Grounding
 * 
 * Accepts natural language questions, returns only data-grounded answers.
 * Strict mode by default: no assumptions, no predictions, no recommendations.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

// Fail-safe blocked patterns
const BLOCKED_PATTERNS = [
  { pattern: /should|ought|must|recommend/i, reason: 'Normative question - requires value judgment' },
  { pattern: /will happen|forecast|predict|future/i, reason: 'Predictive question - system only provides historical data' },
  { pattern: /best|worst|optimal|ideal/i, reason: 'Value judgment required - no objective answer possible' },
  { pattern: /for me|my situation|individual|personal/i, reason: 'Individual-level question - outside data scope' },
  { pattern: /what to do|how to fix|solution/i, reason: 'Policy recommendation requested - system only describes' },
];

interface GroundedResponse {
  answer: string | null;
  scope: string;
  time_span: string;
  uncertainty: 'low' | 'medium' | 'high' | 'unknown';
  citations: string[];
  metadata?: {
    query_type: string;
    data_sources: string[];
    last_updated: string;
  };
}

interface FailedResponse {
  answer: null;
  reason: string;
  suggestion?: string;
  related_queries?: string[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, mode = 'strict', scope } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ 
          answer: null, 
          reason: 'Query parameter is required and must be a string.' 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for blocked patterns (fail-safe)
    for (const { pattern, reason } of BLOCKED_PATTERNS) {
      if (pattern.test(query)) {
        const response: FailedResponse = {
          answer: null,
          reason,
          suggestion: 'Rephrase as a descriptive question about observed data.',
          related_queries: [
            'What does the data show about...?',
            'How has X changed over time?',
            'What is the current level of X?',
          ],
        };
        return new Response(
          JSON.stringify(response),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse query to extract potential indicators
    const queryLower = query.toLowerCase();
    
    // Determine query type
    let queryType = 'factual';
    if (queryLower.includes('change') || queryLower.includes('trend') || queryLower.includes('since')) {
      queryType = 'trend';
    } else if (queryLower.includes('compare') || queryLower.includes('versus') || queryLower.includes('vs')) {
      queryType = 'comparison';
    } else if (queryLower.includes('structural') || queryLower.includes('big question')) {
      queryType = 'structural';
    }

    // Try to find relevant Big Questions
    const { data: bigQuestions } = await supabase
      .from('big_questions')
      .select('*')
      .eq('is_active', true)
      .limit(5);

    // Try to find relevant KPIs based on query keywords
    const { data: kpis } = await supabase
      .from('kpi_definitions')
      .select('id, code, name, category')
      .eq('is_active', true)
      .limit(10);

    // Build response based on available data
    const citations: string[] = [];
    let answer: string | null = null;
    let uncertainty: 'low' | 'medium' | 'high' | 'unknown' = 'unknown';

    // Check if we have relevant data
    const hasRelevantData = (bigQuestions && bigQuestions.length > 0) || (kpis && kpis.length > 0);

    if (!hasRelevantData) {
      const response: FailedResponse = {
        answer: null,
        reason: 'No verified data available for this question.',
        suggestion: 'Try a more specific query about employment, demographics, or economic indicators.',
      };
      return new Response(
        JSON.stringify(response),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find matching Big Question
    const matchingQuestion = bigQuestions?.find(q => 
      q.question_text.toLowerCase().includes(queryLower.split(' ').slice(0, 3).join(' ')) ||
      queryLower.includes(q.code.toLowerCase())
    );

    if (matchingQuestion) {
      answer = `Observed data addresses: "${matchingQuestion.question_text}". ${matchingQuestion.what_this_shows}`;
      citations.push(`https://example.org/big-questions/${matchingQuestion.code}`);
      uncertainty = 'medium';
    } else if (kpis && kpis.length > 0) {
      // Generic response based on available KPIs
      answer = `Available data covers ${kpis.length} indicators in categories including: ${[...new Set(kpis.map(k => k.category))].slice(0, 3).join(', ')}. Specific query refinement recommended.`;
      uncertainty = 'high';
    }

    // Build grounded response
    const response: GroundedResponse = {
      answer,
      scope: scope || 'global',
      time_span: '1990-2024',
      uncertainty,
      citations,
      metadata: {
        query_type: queryType,
        data_sources: ['official_statistics', 'eurostat', 'national_agencies'],
        last_updated: new Date().toISOString(),
      },
    };

    // In strict mode, fail if no citations
    if (mode === 'strict' && citations.length === 0) {
      const failResponse: FailedResponse = {
        answer: null,
        reason: 'Strict mode requires citations. No verified data sources found for this query.',
        suggestion: 'Try asking about specific indicators or Big Questions.',
      };
      return new Response(
        JSON.stringify(failResponse),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('AI Ask error:', error);
    return new Response(
      JSON.stringify({ 
        answer: null, 
        reason: 'Internal error processing query.',
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
