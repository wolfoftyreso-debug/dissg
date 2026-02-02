/**
 * AI Grounding Documentation Endpoint
 * 
 * Block 57: AI-Agent SDK
 * 
 * Returns machine-readable documentation for AI agents.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

const GROUNDING_DOCUMENTATION = {
  name: "Fact Grounding API",
  version: "1.0.0",
  description: "AI grounding source for verified, data-backed answers. Zero hallucination by design.",
  
  philosophy: {
    principle: "AI should not think up answers. AI should ask the data.",
    mode: "Strict by default - no assumptions, no predictions, no recommendations.",
    fail_safe: "If data is insufficient, return null answer with explanation.",
  },

  endpoints: {
    ask: {
      method: "POST",
      path: "/ai/ask",
      description: "Natural language query with grounded response",
      request: {
        query: "string (required) - Natural language question",
        mode: "string (optional) - 'strict' (default) or 'relaxed'",
        scope: "string (optional) - 'global' or 'country:XX'",
      },
      response: {
        answer: "string | null - Data-grounded answer or null if unavailable",
        scope: "string - Geographic scope of answer",
        time_span: "string - Time period covered",
        uncertainty: "'low' | 'medium' | 'high' | 'unknown'",
        citations: "string[] - URLs to source data",
      },
    },
    
    bigQuestions: {
      method: "GET",
      path: "/ai/big-questions",
      description: "Get auto-ranked structural questions",
      parameters: {
        scope: "string - 'global' or 'country:XX'",
        limit: "number - Max questions to return (default 5)",
        category: "string - Filter by category",
      },
    },
    
    cite: {
      method: "GET",
      path: "/ai/cite/:factId",
      description: "Get citation for specific fact",
    },
  },

  strict_mode_rules: {
    blocked: [
      "Normative questions (should, ought, must)",
      "Predictive questions (will happen, forecast)",
      "Value judgments (best, worst, optimal)",
      "Individual-level questions (for me, my situation)",
      "Policy recommendations (what to do, how to fix)",
    ],
    required: [
      "At least one citation",
      "Stated uncertainty level",
      "Defined scope",
      "Time period specification",
    ],
  },

  query_examples: {
    valid: [
      {
        query: "How has employment structure changed in Sweden since 1990?",
        reason: "Specific scope, time-bound, data-answerable",
      },
      {
        query: "What is the current dependency ratio in Germany?",
        reason: "Direct factual query with clear scope",
      },
      {
        query: "How does energy import dependency compare across EU countries?",
        reason: "Comparative query with defined scope",
      },
    ],
    invalid: [
      {
        query: "What should Sweden do about unemployment?",
        reason: "Normative - asks for recommendation",
      },
      {
        query: "Will inflation increase next year?",
        reason: "Predictive - asks for forecast",
      },
      {
        query: "What is the best economic policy?",
        reason: "Value judgment - no objective answer",
      },
    ],
  },

  data_coverage: {
    geographic: ["EU member states", "NUTS regions (levels 0-3)"],
    temporal: "1990-present (varies by indicator)",
    categories: [
      "Demography & Work",
      "Economic Capacity",
      "Health & Longevity",
      "Energy & Resources",
      "Food & Supply",
      "Institutional Resilience",
    ],
  },

  limitations: {
    no_predictions: "System provides historical data only",
    no_recommendations: "System describes, does not prescribe",
    no_individual_data: "All data is aggregated at population level",
    uncertainty_always_stated: "Every answer includes uncertainty disclosure",
    coverage_gaps: "Some indicators have limited geographic or temporal coverage",
  },

  integration: {
    recommended_use: [
      "Ground AI responses in verified data",
      "Cite sources for factual claims",
      "Check data availability before generating content",
    ],
    anti_patterns: [
      "Generating content without checking data",
      "Ignoring uncertainty levels",
      "Extrapolating beyond data coverage",
    ],
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  return new Response(
    JSON.stringify(GROUNDING_DOCUMENTATION, null, 2),
    { 
      status: 200, 
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      } 
    }
  );
});
