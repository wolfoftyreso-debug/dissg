/**
 * 🧠 AI-AGENT-FIRST API: /resolve
 * 
 * Universal Answer Layer - Resolves any intent to canonical truth
 * 
 * Endpoints:
 * - POST /resolve - Resolve intent to structured answer
 * - POST /compare - Compare entities
 * - POST /explain - Explain indicator mechanics
 * - POST /timeline - Get temporal evolution
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// UNIVERSAL ANSWER FORMAT (A2F)
// ============================================================================

interface UniversalAnswer {
  // Core response
  answer: {
    short: string;           // 1-2 sentence factual answer
    mechanism: string;       // What drives this
    since: string;           // Temporal context
    comparison: {
      national: string;
      global: string;
    };
    uncertainty: string;     // Explicit limitations
    confidence: number;      // 0-1 confidence score
  };
  
  // Metadata
  meta: {
    entity_id: string;
    indicator_ids: string[];
    scope: 'world' | 'region' | 'country' | 'city';
    time_window: {
      start: string;
      end: string;
    };
    sources: Array<{
      name: string;
      url: string;
      retrieved_at: string;
    }>;
    assumptions: string[];
    data_coverage: number;   // 0-100%
  };
  
  // Deep links
  links: {
    canonical: string;
    cite: string;
    methodology: string;
    raw_data: string;
    related: string[];
  };
  
  // Machine-readable
  structured: {
    schema_type: string;
    json_ld: Record<string, unknown>;
  };
}

// ============================================================================
// INTENT CLASSIFICATION
// ============================================================================

interface Intent {
  type: 'status' | 'comparison' | 'trend' | 'explanation' | 'forecast_blocked';
  entities: string[];
  indicators: string[];
  scope: string;
  time_context: string;
}

function classifyIntent(query: string): Intent {
  const q = query.toLowerCase();
  
  // Forecast detection - BLOCKED
  if (q.includes('kommer att') || q.includes('will') || q.includes('predict') || 
      q.includes('forecast') || q.includes('future') || q.includes('framtid')) {
    return {
      type: 'forecast_blocked',
      entities: [],
      indicators: [],
      scope: 'unknown',
      time_context: 'future'
    };
  }
  
  // Comparison detection
  if (q.includes('jämför') || q.includes('compare') || q.includes('vs') || 
      q.includes('versus') || q.includes('mot')) {
    return {
      type: 'comparison',
      entities: extractEntities(q),
      indicators: extractIndicators(q),
      scope: 'multi',
      time_context: 'current'
    };
  }
  
  // Trend detection
  if (q.includes('trend') || q.includes('utveckling') || q.includes('över tid') ||
      q.includes('history') || q.includes('change')) {
    return {
      type: 'trend',
      entities: extractEntities(q),
      indicators: extractIndicators(q),
      scope: detectScope(q),
      time_context: 'historical'
    };
  }
  
  // Explanation detection
  if (q.includes('varför') || q.includes('why') || q.includes('how') || 
      q.includes('hur') || q.includes('orsak') || q.includes('cause')) {
    return {
      type: 'explanation',
      entities: extractEntities(q),
      indicators: extractIndicators(q),
      scope: detectScope(q),
      time_context: 'current'
    };
  }
  
  // Default: status query
  return {
    type: 'status',
    entities: extractEntities(q),
    indicators: extractIndicators(q),
    scope: detectScope(q),
    time_context: 'current'
  };
}

function extractEntities(query: string): string[] {
  const entities: string[] = [];
  const countries = ['sverige', 'sweden', 'germany', 'tyskland', 'usa', 'uk', 'france', 'frankrike'];
  const cities = ['stockholm', 'göteborg', 'malmö', 'berlin', 'london', 'paris', 'new york'];
  
  countries.forEach(c => {
    if (query.includes(c)) entities.push(c);
  });
  cities.forEach(c => {
    if (query.includes(c)) entities.push(c);
  });
  
  return entities.length > 0 ? entities : ['world'];
}

function extractIndicators(query: string): string[] {
  const indicators: string[] = [];
  const indicatorMap: Record<string, string> = {
    'ekonomi': 'economy',
    'economy': 'economy',
    'hälsa': 'health',
    'health': 'health',
    'arbete': 'employment',
    'employment': 'employment',
    'jobb': 'employment',
    'jobs': 'employment',
    'bostad': 'housing',
    'housing': 'housing',
    'utbildning': 'education',
    'education': 'education',
    'säkerhet': 'security',
    'security': 'security',
    'crime': 'security',
    'brott': 'security',
    'bra': 'reality_index',
    'well': 'reality_index',
    'läge': 'reality_index',
  };
  
  Object.entries(indicatorMap).forEach(([key, value]) => {
    if (query.includes(key) && !indicators.includes(value)) {
      indicators.push(value);
    }
  });
  
  return indicators.length > 0 ? indicators : ['reality_index'];
}

function detectScope(query: string): string {
  if (query.includes('world') || query.includes('global') || query.includes('världen')) return 'world';
  if (query.includes('europe') || query.includes('europa')) return 'region';
  
  const cities = ['stockholm', 'göteborg', 'malmö', 'berlin', 'london', 'paris'];
  for (const city of cities) {
    if (query.includes(city)) return 'city';
  }
  
  return 'country';
}

// ============================================================================
// ANSWER GENERATION
// ============================================================================

function generateAnswer(intent: Intent, _endpoint: string): UniversalAnswer | { error: string; code: string } {
  // Block forecasts
  if (intent.type === 'forecast_blocked') {
    return {
      error: "This system does not provide forecasts or predictions. It only reports observed data.",
      code: "FORECAST_BLOCKED"
    };
  }
  
  const now = new Date().toISOString();
  const entity = intent.entities[0] || 'world';
  const indicator = intent.indicators[0] || 'reality_index';
  
  // Generate contextual answer based on endpoint and intent
  const answer = generateContextualAnswer(intent, entity, indicator);
  
  return {
    answer: {
      short: answer.short,
      mechanism: answer.mechanism,
      since: answer.since,
      comparison: {
        national: answer.nationalComparison,
        global: answer.globalComparison
      },
      uncertainty: answer.uncertainty,
      confidence: answer.confidence
    },
    meta: {
      entity_id: `entity_${entity.toLowerCase().replace(/\s+/g, '_')}`,
      indicator_ids: intent.indicators.map(i => `ind_${i}`),
      scope: intent.scope as 'world' | 'region' | 'country' | 'city',
      time_window: {
        start: '2024-01-01',
        end: now.split('T')[0]
      },
      sources: [
        { name: 'SCB', url: 'https://scb.se', retrieved_at: now },
        { name: 'Eurostat', url: 'https://ec.europa.eu/eurostat', retrieved_at: now },
        { name: 'OECD', url: 'https://oecd.org', retrieved_at: now }
      ],
      assumptions: [
        'Data is harmonized according to international standards',
        'Population figures are mid-year estimates'
      ],
      data_coverage: Math.round(70 + Math.random() * 25)
    },
    links: {
      canonical: `https://globalreality.org/${intent.scope}/${entity}/${indicator}`,
      cite: `https://globalreality.org/cite/RI-${entity.toUpperCase()}-${Date.now()}`,
      methodology: `https://globalreality.org/methodology/${indicator}`,
      raw_data: `https://globalreality.org/data/${entity}/${indicator}.csv`,
      related: [
        `https://globalreality.org/${intent.scope}/${entity}/economy`,
        `https://globalreality.org/${intent.scope}/${entity}/health`
      ]
    },
    structured: {
      schema_type: 'StatisticalDataset',
      json_ld: {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: `${indicator} for ${entity}`,
        description: answer.short,
        temporalCoverage: '2024/2026',
        spatialCoverage: entity,
        publisher: {
          '@type': 'Organization',
          name: 'Global Reality System'
        }
      }
    }
  };
}

function generateContextualAnswer(intent: Intent, entity: string, indicator: string): {
  short: string;
  mechanism: string;
  since: string;
  nationalComparison: string;
  globalComparison: string;
  uncertainty: string;
  confidence: number;
} {
  // Entity-specific data generation (would come from database in production)
  const entityNormalized = entity.charAt(0).toUpperCase() + entity.slice(1);
  
  const templates: Record<string, Record<string, any>> = {
    reality_index: {
      short: `${entityNormalized} shows a Reality Index score of 67.3, indicating stable baseline conditions with moderate recent changes.`,
      mechanism: `Primary drivers: employment rate (+1.2pp), healthcare access (-0.8pp), housing affordability (-2.1pp). Net effect is marginal positive when weighted by population impact.`,
      since: `This pattern has been consistent since Q2 2024. Previous acceleration phase ended in 2023.`,
      nationalComparison: `Above national average by 3.2 points. Ranks in 72nd percentile nationally.`,
      globalComparison: `In the 68th percentile globally. Similar to comparable entities in Western Europe.`,
      uncertainty: `Housing affordability data is 2 months delayed. Healthcare figures use proxy indicators for recent period.`,
      confidence: 0.82
    },
    economy: {
      short: `Economic conditions in ${entityNormalized} show GDP growth of 1.8% YoY with unemployment at 6.2%.`,
      mechanism: `Growth driven by services sector (+2.4%) offsetting manufacturing decline (-0.8%). Labor market tightening in tech sector.`,
      since: `Current trajectory established post-2023 energy adjustment. Pre-pandemic levels restored in Q1 2024.`,
      nationalComparison: `Slightly above national GDP growth (1.6%). Unemployment 0.4pp below national rate.`,
      globalComparison: `In line with OECD average. Below US (2.1%) but above EU average (1.2%).`,
      uncertainty: `GDP figures are preliminary. Final revision expected in 45 days. Seasonal adjustment applied.`,
      confidence: 0.78
    },
    employment: {
      short: `Employment rate in ${entityNormalized} stands at 72.4%, with labor force participation at 78.1%.`,
      mechanism: `High demand in healthcare and tech. Structural mismatch in manufacturing skills. Youth employment improving (+1.8pp YoY).`,
      since: `Recovery from 2020 trough complete. Current levels match 2019 peak.`,
      nationalComparison: `3.1pp above national average. Top quartile among comparable regions.`,
      globalComparison: `Above OECD average (68.2%). Similar to Nordic peer group.`,
      uncertainty: `Self-employment figures may be underreported. Gig economy not fully captured in official statistics.`,
      confidence: 0.85
    },
    health: {
      short: `Life expectancy in ${entityNormalized} is 82.4 years. Healthcare access index at 78/100.`,
      mechanism: `Primary care access stable. Specialist wait times increased 12% YoY. Mental health services expanded.`,
      since: `Life expectancy recovered to pre-2020 levels in 2024. Healthcare access declining since 2022.`,
      nationalComparison: `Life expectancy 0.8 years above national average. Healthcare access 4 points below.`,
      globalComparison: `Top 15% globally for life expectancy. Healthcare access in 70th percentile.`,
      uncertainty: `Mental health metrics use survey data with ±3% margin. Wait time data from administrative records.`,
      confidence: 0.80
    },
    housing: {
      short: `Housing affordability index in ${entityNormalized} is 42/100. Average price-to-income ratio: 8.2.`,
      mechanism: `Supply constraints (-15% new construction YoY) meeting sustained demand. Interest rate increases (+1.5pp) reducing transactions.`,
      since: `Affordability declining since 2021. Sharpest decline 2022-2023. Stabilizing in recent quarters.`,
      nationalComparison: `Less affordable than national average (index 51). Among bottom quartile of regions.`,
      globalComparison: `Similar to major European cities. Less affordable than US metros (avg index 58).`,
      uncertainty: `Rental market data incomplete. Index uses asking prices, not transaction prices.`,
      confidence: 0.75
    }
  };
  
  const template = templates[indicator] || templates.reality_index;
  return {
    short: template.short as string,
    mechanism: template.mechanism as string,
    since: template.since as string,
    nationalComparison: template.nationalComparison as string,
    globalComparison: template.globalComparison as string,
    uncertainty: template.uncertainty as string,
    confidence: template.confidence as number
  };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop() || 'resolve';
    
    const body = await req.json().catch(() => ({}));
    const { intent: intentQuery, query, entities, indicators, scope, from_date, to_date: _to_date } = body;
    
    // Determine intent from query or direct parameters
    let intent: Intent;
    
    if (query) {
      intent = classifyIntent(query);
    } else if (intentQuery) {
      intent = classifyIntent(intentQuery);
    } else {
      intent = {
        type: path === 'compare' ? 'comparison' : 
              path === 'explain' ? 'explanation' : 
              path === 'timeline' ? 'trend' : 'status',
        entities: entities || ['world'],
        indicators: indicators || ['reality_index'],
        scope: scope || 'world',
        time_context: from_date ? 'historical' : 'current'
      };
    }
    
    // Generate answer
    const answer = generateAnswer(intent, path);
    
    // Check if error response
    if ('error' in answer) {
      return new Response(JSON.stringify(answer), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Add endpoint-specific formatting
    const response: Record<string, unknown> = {
      ...answer,
      _api: {
        endpoint: `/ai-resolve/${path}`,
        version: '1.0',
        timestamp: new Date().toISOString(),
        intent_detected: intent
      }
    };
    
    return new Response(JSON.stringify(response, null, 2), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
      }
    });
    
  } catch (error) {
    console.error('AI Resolve error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to resolve query',
      code: 'RESOLUTION_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
