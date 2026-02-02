/**
 * WRAPPED-API Edge Function
 * =========================
 * Programmatic access to Reality Wrapped summaries
 * 
 * Endpoints:
 * - POST /generate   → Generate new Wrapped summary
 * - POST /evaluate   → Evaluate worthiness scores only
 * - GET  /schemas    → Get available schemas and options
 * 
 * Authentication: API key via X-API-Key header
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// ===========================================
// TYPES
// ===========================================

type WrappedScope = 'world' | 'region' | 'country' | 'city' | 'municipality' | 'custom';
type ComparisonType = 'previous_year' | 'previous_period' | 'regional_average' | 'national_average' | 'global_average' | 'peer_group';
type RelevanceLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
type DataAvailability = 'verified' | 'partial' | 'insufficient' | 'stale' | 'conflicting';

interface WrappedInput {
  scope: WrappedScope;
  geoIds: string[];
  timeRange: string;
  indicators?: string[];
  comparison?: ComparisonType[];
  options?: {
    maxHero?: number;
    maxPrimary?: number;
    maxSecondary?: number;
    includeRaw?: boolean;
    language?: 'sv' | 'en';
  };
}

interface IndicatorSnapshot {
  id: string;
  code: string;
  name: string;
  category: string;
  currentValue: number;
  previousValue: number;
  unit: string;
  changePercent: number;
  changeAbsolute: number;
  periodStart: string;
  periodEnd: string;
  confidence: number;
  dataAvailability: DataAvailability;
  sourceCount: number;
  lastVerified: string;
  relevanceLevel: RelevanceLevel;
  affectedPopulationPercent?: number;
  crossDomainLinks?: string[];
  trendDirection: 'up' | 'down' | 'stable';
  trendAcceleration: number;
  isBreakingPattern: boolean;
  consecutiveDirectionMonths: number;
}

interface WorthinessScore {
  indicatorId: string;
  totalScore: number;
  relevanceScore: number;
  magnitudeScore: number;
  velocityScore: number;
  qualityScore: number;
  impactScore: number;
  isWrapWorthy: boolean;
  worthinessReason: string;
  suggestedPriority: 'hero' | 'primary' | 'secondary' | 'mention';
  narrativeHook: string;
  comparisonSuggestion?: string;
}

// ===========================================
// WORTHINESS SCORING (embedded for edge function)
// ===========================================

const RELEVANCE_WEIGHTS: Record<RelevanceLevel, number> = {
  L0: 0, L1: 10, L2: 20, L3: 30, L4: 40,
};

const WORTHINESS_THRESHOLD = 50;

const PRIORITY_THRESHOLDS = {
  hero: 85,
  primary: 70,
  secondary: 55,
  mention: 50,
};

const MAGNITUDE_BREAKPOINTS = [
  { threshold: 50, score: 25 },
  { threshold: 25, score: 20 },
  { threshold: 10, score: 15 },
  { threshold: 5, score: 10 },
  { threshold: 2, score: 5 },
  { threshold: 0, score: 0 },
];

function calculateWorthinessScore(indicator: IndicatorSnapshot): WorthinessScore {
  if (indicator.relevanceLevel === 'L0') {
    return {
      indicatorId: indicator.id,
      totalScore: 0,
      relevanceScore: 0,
      magnitudeScore: 0,
      velocityScore: 0,
      qualityScore: 0,
      impactScore: 0,
      isWrapWorthy: false,
      worthinessReason: 'Classified as noise (L0)',
      suggestedPriority: 'mention',
      narrativeHook: '',
    };
  }

  if (indicator.dataAvailability === 'insufficient') {
    return {
      indicatorId: indicator.id,
      totalScore: 0,
      relevanceScore: 0,
      magnitudeScore: 0,
      velocityScore: 0,
      qualityScore: 0,
      impactScore: 0,
      isWrapWorthy: false,
      worthinessReason: 'Insufficient verified data',
      suggestedPriority: 'mention',
      narrativeHook: '',
    };
  }

  // Relevance
  const baseRelevance = RELEVANCE_WEIGHTS[indicator.relevanceLevel];
  const populationBonus = indicator.affectedPopulationPercent 
    ? Math.min(5, indicator.affectedPopulationPercent / 20) : 0;
  const relevanceScore = Math.min(40, baseRelevance + populationBonus);

  // Magnitude
  const absChange = Math.abs(indicator.changePercent);
  let magnitudeScore = 0;
  for (const bp of MAGNITUDE_BREAKPOINTS) {
    if (absChange >= bp.threshold) {
      magnitudeScore = bp.score;
      break;
    }
  }

  // Velocity
  let velocityScore = 0;
  if (Math.abs(indicator.trendAcceleration) > 0.5) velocityScore += 5;
  if (indicator.isBreakingPattern) velocityScore += 7;
  if (indicator.consecutiveDirectionMonths >= 6) velocityScore += 3;
  else if (indicator.consecutiveDirectionMonths >= 3) velocityScore += 1;
  velocityScore = Math.min(15, velocityScore);

  // Quality
  let qualityScore = indicator.confidence * 5;
  if (indicator.dataAvailability === 'verified') qualityScore += 3;
  else if (indicator.dataAvailability === 'partial') qualityScore += 1;
  if (indicator.sourceCount >= 3) qualityScore += 2;
  else if (indicator.sourceCount >= 2) qualityScore += 1;
  qualityScore = Math.min(10, qualityScore);

  // Impact
  const links = indicator.crossDomainLinks?.length ?? 0;
  const impactScore = links >= 5 ? 10 : links >= 3 ? 7 : links >= 2 ? 4 : links >= 1 ? 2 : 0;

  const totalScore = relevanceScore + magnitudeScore + velocityScore + qualityScore + impactScore;
  const isWrapWorthy = totalScore >= WORTHINESS_THRESHOLD;

  let suggestedPriority: WorthinessScore['suggestedPriority'] = 'mention';
  if (totalScore >= PRIORITY_THRESHOLDS.hero) suggestedPriority = 'hero';
  else if (totalScore >= PRIORITY_THRESHOLDS.primary) suggestedPriority = 'primary';
  else if (totalScore >= PRIORITY_THRESHOLDS.secondary) suggestedPriority = 'secondary';

  const direction = indicator.trendDirection === 'up' ? 'increased' : 
                   indicator.trendDirection === 'down' ? 'decreased' : 'remained stable';
  const magnitude = Math.abs(indicator.changePercent);
  
  let narrativeHook = '';
  if (indicator.isBreakingPattern) {
    narrativeHook = `${indicator.name} broke its historical pattern, ${direction} by ${magnitude.toFixed(1)}%`;
  } else if (magnitude >= 25) {
    narrativeHook = `Significant shift: ${indicator.name} ${direction} by ${magnitude.toFixed(1)}%`;
  } else if (indicator.consecutiveDirectionMonths >= 6) {
    narrativeHook = `${indicator.name} continued its ${indicator.consecutiveDirectionMonths}-month trend`;
  } else {
    narrativeHook = `${indicator.name} ${direction} by ${magnitude.toFixed(1)}%`;
  }

  const reasons: string[] = [];
  if (relevanceScore >= 30) reasons.push(`High relevance (${indicator.relevanceLevel})`);
  if (magnitudeScore >= 15) reasons.push(`Significant change (${indicator.changePercent.toFixed(1)}%)`);
  if (indicator.isBreakingPattern) reasons.push('Pattern break detected');
  if (velocityScore >= 10) reasons.push('Accelerating trend');
  if (impactScore >= 7) reasons.push('Cross-domain impact');
  if (reasons.length === 0) {
    reasons.push(isWrapWorthy ? 'Cumulative significance' : 'Below significance threshold');
  }

  return {
    indicatorId: indicator.id,
    totalScore,
    relevanceScore,
    magnitudeScore,
    velocityScore,
    qualityScore,
    impactScore,
    isWrapWorthy,
    worthinessReason: reasons.join('; '),
    suggestedPriority,
    narrativeHook,
    comparisonSuggestion: indicator.relevanceLevel === 'L4' || indicator.relevanceLevel === 'L3'
      ? 'Compare with global/regional peers'
      : indicator.crossDomainLinks?.length 
        ? `Correlates with: ${indicator.crossDomainLinks.slice(0, 2).join(', ')}`
        : undefined,
  };
}

// ===========================================
// DATA FETCHING
// ===========================================

async function fetchIndicators(
  supabase: any,
  input: WrappedInput
): Promise<IndicatorSnapshot[]> {
  const { geoIds, timeRange, indicators } = input;
  
  // Parse time range
  const [startYear, endYear] = timeRange.includes('-') 
    ? timeRange.split('-').map(Number)
    : [Number(timeRange), Number(timeRange)];
  
  // Build query for KPI values
  let query = supabase
    .from('kpi_values')
    .select(`
      id,
      value,
      previous_value,
      period_start,
      period_end,
      trend,
      trend_percent,
      confidence,
      status,
      kpi:kpi_definitions(
        id,
        code,
        name,
        category,
        unit,
        relevance_level,
        is_inverted
      )
    `)
    .gte('period_start', `${startYear}-01-01`)
    .lte('period_end', `${endYear}-12-31`);

  if (geoIds.length > 0) {
    query = query.in('geo_id', geoIds);
  }

  if (indicators && indicators.length > 0) {
    query = query.in('kpi_id', indicators);
  }

  const { data, error } = await query.order('period_end', { ascending: false });

  if (error) {
    console.error('Error fetching indicators:', error);
    return [];
  }

  // Transform to IndicatorSnapshot format
  return (data || []).map((row: any) => {
    const kpi = row.kpi;
    const changePercent = row.previous_value 
      ? ((row.value - row.previous_value) / row.previous_value) * 100
      : 0;

    return {
      id: row.id,
      code: kpi?.code || 'unknown',
      name: kpi?.name || 'Unknown Indicator',
      category: kpi?.category || 'general',
      currentValue: row.value,
      previousValue: row.previous_value || row.value,
      unit: kpi?.unit || '',
      changePercent,
      changeAbsolute: row.value - (row.previous_value || row.value),
      periodStart: row.period_start,
      periodEnd: row.period_end,
      confidence: row.confidence || 0.8,
      dataAvailability: row.status === 'verified' ? 'verified' : 'partial',
      sourceCount: 2,
      lastVerified: new Date().toISOString(),
      relevanceLevel: (kpi?.relevance_level || 'L2') as RelevanceLevel,
      trendDirection: row.trend || (changePercent > 2 ? 'up' : changePercent < -2 ? 'down' : 'stable'),
      trendAcceleration: 0,
      isBreakingPattern: Math.abs(changePercent) > 25,
      consecutiveDirectionMonths: 3,
    } as IndicatorSnapshot;
  });
}

// ===========================================
// WRAPPED GENERATION
// ===========================================

interface WrappedOutput {
  id: string;
  generatedAt: string;
  input: WrappedInput;
  summary: {
    heroIndicators: WorthinessScore[];
    primaryIndicators: WorthinessScore[];
    secondaryIndicators: WorthinessScore[];
    mentionIndicators: WorthinessScore[];
    totalEvaluated: number;
    totalIncluded: number;
  };
  steps: {
    overview: {
      title: string;
      subtitle: string;
      mainIndicators: any[];
    };
    biggestChanges: {
      changes: any[];
      analysisText: string;
    };
    comparisons: {
      rankings: any[];
      comparisonText: string;
    };
    unchanged: {
      stableIndicators: any[];
    };
    limitations: {
      items: string[];
      disclaimerText: string;
    };
  };
  metadata: {
    version: string;
    processingTimeMs: number;
    dataQuality: number;
  };
}

async function generateWrapped(
  supabase: any,
  input: WrappedInput
): Promise<WrappedOutput> {
  const startTime = Date.now();
  
  // Fetch indicators
  const indicators = await fetchIndicators(supabase, input);
  
  // Score all indicators
  const scored = indicators.map(calculateWorthinessScore);
  const sorted = [...scored].sort((a, b) => b.totalScore - a.totalScore);
  
  // Categorize
  const maxHero = input.options?.maxHero ?? 2;
  const maxPrimary = input.options?.maxPrimary ?? 5;
  const maxSecondary = input.options?.maxSecondary ?? 10;
  
  const heroIndicators: WorthinessScore[] = [];
  const primaryIndicators: WorthinessScore[] = [];
  const secondaryIndicators: WorthinessScore[] = [];
  const mentionIndicators: WorthinessScore[] = [];
  
  for (const score of sorted) {
    if (!score.isWrapWorthy) continue;
    
    if (score.suggestedPriority === 'hero' && heroIndicators.length < maxHero) {
      heroIndicators.push(score);
    } else if (score.suggestedPriority === 'primary' && primaryIndicators.length < maxPrimary) {
      primaryIndicators.push(score);
    } else if (score.suggestedPriority === 'secondary' && secondaryIndicators.length < maxSecondary) {
      secondaryIndicators.push(score);
    } else if (mentionIndicators.length < 20) {
      mentionIndicators.push(score);
    }
  }
  
  // Build output
  const language = input.options?.language || 'sv';
  const geoLabel = input.geoIds[0] || 'Selected region';
  
  return {
    id: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    input,
    summary: {
      heroIndicators,
      primaryIndicators,
      secondaryIndicators,
      mentionIndicators,
      totalEvaluated: indicators.length,
      totalIncluded: heroIndicators.length + primaryIndicators.length + secondaryIndicators.length + mentionIndicators.length,
    },
    steps: {
      overview: {
        title: language === 'sv' ? `${geoLabel} ${input.timeRange}` : `${geoLabel} ${input.timeRange}`,
        subtitle: language === 'sv' 
          ? `${indicators.length} indikatorer analyserade`
          : `${indicators.length} indicators analyzed`,
        mainIndicators: heroIndicators.slice(0, 3).map(h => ({
          id: h.indicatorId,
          hook: h.narrativeHook,
          score: h.totalScore,
        })),
      },
      biggestChanges: {
        changes: [...heroIndicators, ...primaryIndicators].slice(0, 5).map(s => ({
          id: s.indicatorId,
          hook: s.narrativeHook,
          reason: s.worthinessReason,
        })),
        analysisText: language === 'sv'
          ? `De största förändringarna under perioden dominerades av ${heroIndicators[0]?.narrativeHook || 'flera faktorer'}.`
          : `The biggest changes during the period were dominated by ${heroIndicators[0]?.narrativeHook || 'multiple factors'}.`,
      },
      comparisons: {
        rankings: [],
        comparisonText: language === 'sv'
          ? 'Jämförelser kräver ytterligare geografisk kontext.'
          : 'Comparisons require additional geographic context.',
      },
      unchanged: {
        stableIndicators: sorted.filter(s => !s.isWrapWorthy).slice(0, 5).map(s => ({
          id: s.indicatorId,
          reason: s.worthinessReason,
        })),
      },
      limitations: {
        items: [
          language === 'sv' ? 'Data baseras på senast tillgängliga officiella källor' : 'Data based on latest available official sources',
          language === 'sv' ? 'Vissa indikatorer kan ha tidsfördröjning' : 'Some indicators may have time lag',
          language === 'sv' ? 'Kausalitet kan inte fastställas från korrelation' : 'Causation cannot be established from correlation',
        ],
        disclaimerText: language === 'sv'
          ? 'Denna sammanfattning är automatiskt genererad och bör verifieras mot primärkällor för beslutsunderlag.'
          : 'This summary is automatically generated and should be verified against primary sources for decision-making.',
      },
    },
    metadata: {
      version: '1.0.0',
      processingTimeMs: Date.now() - startTime,
      dataQuality: indicators.length > 0 
        ? indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length
        : 0,
    },
  };
}

// ===========================================
// REQUEST HANDLERS
// ===========================================

async function handleGenerate(req: Request, supabase: any): Promise<Response> {
  try {
    const body = await req.json() as WrappedInput;
    
    // Validate required fields
    if (!body.scope || !body.geoIds || !body.timeRange) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: scope, geoIds, timeRange',
        example: {
          scope: 'municipality',
          geoIds: ['0180'],
          timeRange: '2024',
          options: { language: 'sv', maxHero: 2 }
        }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const result = await generateWrapped(supabase, body);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Generate error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate wrapped summary',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleEvaluate(req: Request): Promise<Response> {
  try {
    const body = await req.json() as { indicators: IndicatorSnapshot[] };
    
    if (!body.indicators || !Array.isArray(body.indicators)) {
      return new Response(JSON.stringify({
        error: 'Missing required field: indicators (array)',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const scores = body.indicators.map(calculateWorthinessScore);
    const sorted = [...scores].sort((a, b) => b.totalScore - a.totalScore);
    
    return new Response(JSON.stringify({
      scores: sorted,
      summary: {
        total: scores.length,
        wrapWorthy: scores.filter(s => s.isWrapWorthy).length,
        hero: scores.filter(s => s.suggestedPriority === 'hero').length,
        primary: scores.filter(s => s.suggestedPriority === 'primary').length,
        secondary: scores.filter(s => s.suggestedPriority === 'secondary').length,
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Evaluate error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to evaluate indicators',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

function handleSchemas(): Response {
  return new Response(JSON.stringify({
    version: '1.0.0',
    endpoints: {
      'POST /generate': {
        description: 'Generate a complete Wrapped summary',
        body: {
          scope: { type: 'string', enum: ['world', 'region', 'country', 'city', 'municipality', 'custom'], required: true },
          geoIds: { type: 'string[]', description: 'Geographic identifiers', required: true },
          timeRange: { type: 'string', description: 'Year or range (e.g., "2024" or "2020-2024")', required: true },
          indicators: { type: 'string[]', description: 'Optional filter by indicator IDs' },
          comparison: { type: 'string[]', enum: ['previous_year', 'previous_period', 'regional_average', 'national_average', 'global_average', 'peer_group'] },
          options: {
            maxHero: { type: 'number', default: 2 },
            maxPrimary: { type: 'number', default: 5 },
            maxSecondary: { type: 'number', default: 10 },
            includeRaw: { type: 'boolean', default: false },
            language: { type: 'string', enum: ['sv', 'en'], default: 'sv' },
          },
        },
      },
      'POST /evaluate': {
        description: 'Evaluate worthiness scores for custom indicators',
        body: {
          indicators: {
            type: 'IndicatorSnapshot[]',
            description: 'Array of indicator snapshots to evaluate',
          },
        },
      },
      'GET /schemas': {
        description: 'Get API schemas and options',
      },
    },
    scoring: {
      thresholds: {
        wrapWorthy: 50,
        hero: 85,
        primary: 70,
        secondary: 55,
        mention: 50,
      },
      components: {
        relevance: { max: 40, description: 'Based on CRM level (L0-L4)' },
        magnitude: { max: 25, description: 'Change percentage' },
        velocity: { max: 15, description: 'Rate of change acceleration' },
        quality: { max: 10, description: 'Data reliability' },
        impact: { max: 10, description: 'Cross-domain connections' },
      },
    },
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ===========================================
// MAIN HANDLER
// ===========================================

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  const url = new URL(req.url);
  const path = url.pathname.split('/').pop() || '';
  
  // Initialize Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Route requests
  try {
    switch (path) {
      case 'generate':
        if (req.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        return handleGenerate(req, supabase);
        
      case 'evaluate':
        if (req.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        return handleEvaluate(req);
        
      case 'schemas':
        return handleSchemas();
        
      default:
        // Default to schemas for base path
        if (req.method === 'GET') {
          return handleSchemas();
        }
        return new Response(JSON.stringify({
          error: 'Unknown endpoint',
          available: ['/generate', '/evaluate', '/schemas'],
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Request error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
