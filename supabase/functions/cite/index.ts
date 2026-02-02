/**
 * 🤖 MASTER EXECUTION BLOCK 46
 * 
 * /cite/{fact_id} — AI-OPTIMAL CITATION ENDPOINT
 * 
 * Purpose:
 * - Returns a verifiable fact statement
 * - With sources, uncertainty, and URL
 * - In the format AI wants
 * - In <50 ms
 * 
 * 📌 1 request = 1 citable truth
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

// ============================================================
// TYPES — CANONICAL RESPONSE FORMAT (DO NOT CHANGE)
// ============================================================

interface CitationResponse {
  fact_id: string;
  statement: string;
  scope: {
    geography: string;
    level: 'global' | 'country' | 'region' | 'municipality';
    time_span: string;
  };
  methodology: {
    type: string;
    causality: 'none' | 'suggested' | 'established';
    notes: string;
  };
  uncertainty: {
    level: 'low' | 'medium' | 'high';
    description: string;
  };
  sources: Array<{
    source_id: string;
    name: string;
    type: string;
  }>;
  canonical_url: string;
  citation: string;
  version: string;
  last_verified: string;
}

interface ErrorResponse {
  error: string;
  message: string;
  suggestions?: string[];
  new_fact_id?: string;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function generateTextFormat(fact: CitationResponse): string {
  const sourceNames = fact.sources.map(s => s.name).join('; ');
  return `${fact.statement}
Source: ${sourceNames}.
Scope: ${fact.scope.geography}, ${fact.scope.time_span}.
${fact.methodology.notes}
${fact.canonical_url}`;
}

function getCacheHeaders(maxAge: number = 86400): Record<string, string> {
  return {
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=3600`,
    'CDN-Cache-Control': `public, max-age=${maxAge}`,
    'Vary': 'Accept',
  };
}

// ============================================================
// MOCK DATA (Replace with database lookup)
// ============================================================

function getMockFact(factId: string): CitationResponse | null {
  // Parse fact ID to extract components
  // Format: FACT-{TOPIC}-{LOCATION}-{YEARS}
  const parts = factId.toUpperCase().split('-');
  
  if (parts.length < 4 || parts[0] !== 'FACT') {
    return null;
  }

  // Example mock data for demonstration
  const mockFacts: Record<string, CitationResponse> = {
    'FACT-WORK-AI-SE-1990-2024': {
      fact_id: 'FACT-WORK-AI-SE-1990-2024',
      statement: 'Observed data indicates that changes in work structure in Sweden since 1990 coincide with increased automation across multiple sectors.',
      scope: {
        geography: 'Sweden',
        level: 'country',
        time_span: '1990–2024',
      },
      methodology: {
        type: 'observed and estimated data',
        causality: 'none',
        notes: 'Associations only. No causal claims.',
      },
      uncertainty: {
        level: 'medium',
        description: 'Early-period data has lower sectoral resolution.',
      },
      sources: [
        {
          source_id: 'SRC-SCB-EMP-001',
          name: 'Statistics Sweden',
          type: 'national statistics',
        },
        {
          source_id: 'SRC-OECD-PROD-002',
          name: 'OECD',
          type: 'international organization',
        },
      ],
      canonical_url: 'https://globalrealityindex.org/facts/work-and-ai/country/sweden/1990-2024',
      citation: 'Global Reality Index. Work and AI in Sweden (1990–2024). Aggregated open data.',
      version: 'v1.0.0',
      last_verified: '2026-02-01',
    },
    'FACT-GDP-GLOBAL-1900-2024': {
      fact_id: 'FACT-GDP-GLOBAL-1900-2024',
      statement: 'Global GDP per capita increased approximately 15-fold between 1900 and 2024, with significant regional variation.',
      scope: {
        geography: 'Global',
        level: 'global',
        time_span: '1900–2024',
      },
      methodology: {
        type: 'observed and estimated data',
        causality: 'none',
        notes: 'Long-term trends based on historical reconstructions and national accounts.',
      },
      uncertainty: {
        level: 'medium',
        description: 'Pre-1950 data relies on historical estimates with wider confidence intervals.',
      },
      sources: [
        {
          source_id: 'SRC-MADDISON-001',
          name: 'Maddison Project Database',
          type: 'academic research',
        },
        {
          source_id: 'SRC-WB-GDP-001',
          name: 'World Bank',
          type: 'international organization',
        },
      ],
      canonical_url: 'https://globalrealityindex.org/facts/global-economy/global/1900-2024',
      citation: 'Global Reality Index. Global GDP per capita (1900–2024). Aggregated open data.',
      version: 'v1.0.0',
      last_verified: '2026-02-01',
    },
    'FACT-UNEMPLOYMENT-SE-2024': {
      fact_id: 'FACT-UNEMPLOYMENT-SE-2024',
      statement: 'The unemployment rate in Sweden was 7.5% in December 2024, according to Statistics Sweden.',
      scope: {
        geography: 'Sweden',
        level: 'country',
        time_span: '2024',
      },
      methodology: {
        type: 'observed data',
        causality: 'none',
        notes: 'Monthly labor force survey data.',
      },
      uncertainty: {
        level: 'low',
        description: 'Based on standardized ILO methodology with representative sampling.',
      },
      sources: [
        {
          source_id: 'SRC-SCB-LFS-001',
          name: 'Statistics Sweden',
          type: 'national statistics',
        },
      ],
      canonical_url: 'https://globalrealityindex.org/facts/employment/country/sweden/2024',
      citation: 'Global Reality Index. Unemployment in Sweden (2024). Statistics Sweden.',
      version: 'v1.0.0',
      last_verified: '2026-02-01',
    },
  };

  return mockFacts[factId.toUpperCase()] || null;
}

// Deprecated facts mapping
const deprecatedFacts: Record<string, string> = {
  'FACT-WORK-AI-SE-1990-2023': 'FACT-WORK-AI-SE-1990-2024',
};

// ============================================================
// MAIN HANDLER
// ============================================================

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'method_not_allowed', message: 'Only GET requests are supported.' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Extract fact_id from path: /cite/{fact_id}
    // The function is mounted at /cite, so we look for the fact_id
    const factId = pathParts[pathParts.length - 1];
    
    if (!factId || factId === 'cite') {
      return new Response(
        JSON.stringify({
          error: 'missing_fact_id',
          message: 'Please provide a fact identifier. Example: /cite/FACT-WORK-AI-SE-1990-2024',
          suggestions: [
            '/facts/',
            '/facts/work-and-ai/',
            '/facts/global-economy/',
          ],
        } as ErrorResponse),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check for deprecated facts
    const normalizedFactId = factId.toUpperCase();
    if (deprecatedFacts[normalizedFactId]) {
      return new Response(
        JSON.stringify({
          error: 'fact_deprecated',
          message: 'This fact has been replaced by a newer version.',
          new_fact_id: deprecatedFacts[normalizedFactId],
        } as ErrorResponse),
        { 
          status: 410, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Query parameters
    const format = url.searchParams.get('format') || 'json';
    const requestedVersion = url.searchParams.get('v');

    // Get fact data (replace with database lookup in production)
    const fact = getMockFact(factId);

    if (!fact) {
      return new Response(
        JSON.stringify({
          error: 'fact_not_found',
          message: 'This fact identifier does not exist or is deprecated.',
          suggestions: [
            '/facts/work-and-ai/',
            '/facts/global-economy/',
            '/facts/',
          ],
        } as ErrorResponse),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json', ...getCacheHeaders(300) } 
        }
      );
    }

    // Version check (if specific version requested)
    if (requestedVersion && requestedVersion !== fact.version) {
      // In production, look up historical version
      // For now, return current if version not found
    }

    // Generate ETag for caching
    const etag = `"${fact.fact_id}-${fact.version}"`;
    const ifNoneMatch = req.headers.get('If-None-Match');
    
    if (ifNoneMatch === etag) {
      return new Response(null, { 
        status: 304, 
        headers: { ...corsHeaders, 'ETag': etag } 
      });
    }

    // Return response based on format
    if (format === 'text') {
      const textResponse = generateTextFormat(fact);
      return new Response(textResponse, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain; charset=utf-8',
          'ETag': etag,
          ...getCacheHeaders(),
        },
      });
    }

    // Default: JSON response
    return new Response(JSON.stringify(fact, null, 2), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'ETag': etag,
        ...getCacheHeaders(),
      },
    });

  } catch (error) {
    console.error('Citation endpoint error:', error);
    return new Response(
      JSON.stringify({
        error: 'internal_error',
        message: 'An unexpected error occurred. Please try again.',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
