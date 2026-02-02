import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// KPI ID mappings (from your database)
const KPI_MAPPINGS: Record<string, string> = {
  'life_expectancy': 'd6788eb6-ccff-4112-8967-37330aaa158b',
  'employment_rate': '9a6ef79a-a719-4133-be03-76bdc4bccf0a',
  'population': '68c5c6bf-afe0-4f69-9f9e-552a82edc776',
  'school_outcomes': '62983e23-343f-4dc5-951d-9b3799c4f70c',
  'healthcare_wait': '47a0800c-a5eb-42dc-9790-2d7d5d581dbf',
  'violent_crime': '5987e149-c730-4e07-9c66-61533eeaacd7',
  'excess_mortality': '2746ac6d-e3d8-455c-8635-0af8e416af7c',
  'productivity': '362ddb45-91ff-4427-856b-39b40b5cb131',
  'gdp_by_industry': '362ddb45-91ff-4427-856b-39b40b5cb131', // Maps to productivity
  'labor_force_participation': '9a6ef79a-a719-4133-be03-76bdc4bccf0a', // Maps to employment
  'gdp_growth': '362ddb45-91ff-4427-856b-39b40b5cb131',
  'gdp_per_capita': '362ddb45-91ff-4427-856b-39b40b5cb131',
};

interface ImportedValue {
  indicator_key: string;
  value: number;
  period_start: string;
  period_end: string;
  source: string;
  confidence: number;
  granularity: string;
}

// SCB API configuration - using actual working endpoints
const SCB_ENDPOINTS = {
  life_expectancy: {
    url: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/BE/BE0101/BE0101I/Medellivsl',
    query: {
      query: [
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "Tid", selection: { filter: "top", values: ["20"] } }
      ],
      response: { format: "json" }
    }
  },
  population: {
    url: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/BE/BE0101/BE0101A/BeijFolkmLanK',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Tid", selection: { filter: "top", values: ["20"] } }
      ],
      response: { format: "json" }
    }
  },
  // BNP per bransch (SNI2007)
  gdp_by_industry: {
    url: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/NR/NR0103/NR0103A/NR0103ENS2010T01A',
    query: {
      query: [
        { code: "SNI2007", selection: { filter: "item", values: [
          "A", "B-E", "F", "G-I", "J", "K", "L", "M-N", "O-Q", "R-U"
        ] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["0000001W"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } }
      ],
      response: { format: "json" }
    }
  },
  // Arbetskraftsdeltagande
  labor_force_participation: {
    url: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/AM/AM0401/AM0401A/NAKUBefAkeLArb',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["15-74"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CI"] } }, // Arbetskraftstal
        { code: "Tid", selection: { filter: "top", values: ["24"] } }
      ],
      response: { format: "json" }
    }
  },
  // Sysselsättningsgrad 20-64
  employment_rate: {
    url: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/AM/AM0401/AM0401A/NAKUBefAkeLArb',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["20-64"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CK"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } }
      ],
      response: { format: "json" }
    }
  },
  // BNP-tillväxt
  gdp_growth: {
    url: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/NR/NR0103/NR0103B/NR0103ENS2010T01Kv',
    query: {
      query: [
        { code: "SNI2007", selection: { filter: "item", values: ["BNP"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["0000002P"] } },
        { code: "Tid", selection: { filter: "top", values: ["20"] } }
      ],
      response: { format: "json" }
    }
  },
  // BNP per capita
  gdp_per_capita: {
    url: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/NR/NR0103/NR0103A/NR0103ENS2010T01A',
    query: {
      query: [
        { code: "SNI2007", selection: { filter: "item", values: ["BNPCap"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["0000001X"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } }
      ],
      response: { format: "json" }
    }
  }
};

// Kolada API - using correct endpoints
const KOLADA_ENDPOINTS = {
  school_outcomes: {
    kpi: 'N15033', // Elever som uppnått kunskapskraven
    title: 'Skolutfall åk 9'
  },
  healthcare_wait: {
    kpi: 'N61824',
    title: 'Vårdköer'
  }
};

// Fetch from SCB
async function fetchSCBData(indicatorKey: string): Promise<ImportedValue[]> {
  const config = SCB_ENDPOINTS[indicatorKey as keyof typeof SCB_ENDPOINTS];
  if (!config) {
    console.log(`No SCB config for ${indicatorKey}`);
    return [];
  }

  try {
    console.log(`Fetching SCB: ${config.url}`);
    
    const response = await fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config.query)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`SCB API error: ${response.status} - ${text.substring(0, 200)}`);
      return [];
    }

    const data = await response.json();
    return parseSCBResponse(data, indicatorKey);
  } catch (error) {
    console.error(`SCB fetch error for ${indicatorKey}:`, error);
    return [];
  }
}

function parseSCBResponse(data: any, indicatorKey: string): ImportedValue[] {
  const values: ImportedValue[] = [];
  
  try {
    if (!data.data || !Array.isArray(data.data)) {
      console.log('SCB response has no data array');
      return values;
    }

    for (const row of data.data) {
      // SCB data format: { key: ["2023"], values: ["83.5"] }
      const yearStr = row.key?.[row.key.length - 1];
      const valueStr = row.values?.[0];
      
      if (!yearStr || !valueStr) continue;
      
      const year = parseInt(yearStr);
      const value = parseFloat(valueStr);
      
      if (isNaN(year) || isNaN(value)) continue;
      
      values.push({
        indicator_key: indicatorKey,
        value,
        period_start: `${year}-01-01`,
        period_end: `${year}-12-31`,
        source: 'scb',
        confidence: 95,
        granularity: 'yearly'
      });
    }
  } catch (error) {
    console.error('Error parsing SCB response:', error);
  }
  
  return values;
}

// Fetch from Kolada
async function fetchKoladaData(indicatorKey: string): Promise<ImportedValue[]> {
  const config = KOLADA_ENDPOINTS[indicatorKey as keyof typeof KOLADA_ENDPOINTS];
  if (!config) {
    console.log(`No Kolada config for ${indicatorKey}`);
    return [];
  }

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 15;
  
  // National level data (municipality 0000)
  const url = `https://api.kolada.se/v2/data/kpi/${config.kpi}/municipality/0000/year/${startYear}-${currentYear}`;
  
  try {
    console.log(`Fetching Kolada: ${url}`);
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      console.error(`Kolada API error: ${response.status}`);
      
      // Try alternative: get average from all municipalities
      const altUrl = `https://api.kolada.se/v2/data/kpi/${config.kpi}/year/${startYear}-${currentYear}`;
      console.log(`Trying alternative: ${altUrl}`);
      
      const altResponse = await fetch(altUrl, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!altResponse.ok) {
        console.error(`Kolada alt API error: ${altResponse.status}`);
        return [];
      }
      
      const data = await altResponse.json();
      return parseKoladaResponse(data, indicatorKey, true);
    }

    const data = await response.json();
    return parseKoladaResponse(data, indicatorKey, false);
  } catch (error) {
    console.error(`Kolada fetch error for ${indicatorKey}:`, error);
    return [];
  }
}

function parseKoladaResponse(data: any, indicatorKey: string, aggregate: boolean): ImportedValue[] {
  const values: ImportedValue[] = [];
  
  try {
    if (!data.values || !Array.isArray(data.values)) {
      console.log('Kolada response has no values array');
      return values;
    }

    if (aggregate) {
      // Aggregate by year
      const yearMap: Record<number, number[]> = {};
      
      for (const item of data.values) {
        const period = item.period;
        if (!period) continue;
        
        for (const v of (item.values || [])) {
          if (v.value !== null && v.value !== undefined && v.gender === 'T') {
            if (!yearMap[period]) yearMap[period] = [];
            yearMap[period].push(v.value);
          }
        }
      }
      
      for (const [yearStr, vals] of Object.entries(yearMap)) {
        const year = parseInt(yearStr);
        if (vals.length > 0) {
          const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
          values.push({
            indicator_key: indicatorKey,
            value: Math.round(avg * 10) / 10,
            period_start: `${year}-01-01`,
            period_end: `${year}-12-31`,
            source: 'kolada',
            confidence: 85,
            granularity: 'yearly'
          });
        }
      }
    } else {
      // Direct national data
      for (const item of data.values) {
        const period = item.period;
        if (!period) continue;
        
        for (const v of (item.values || [])) {
          if (v.value !== null && v.value !== undefined) {
            values.push({
              indicator_key: indicatorKey,
              value: Math.round(v.value * 10) / 10,
              period_start: `${period}-01-01`,
              period_end: `${period}-12-31`,
              source: 'kolada',
              confidence: 90,
              granularity: 'yearly'
            });
            break; // One value per period
          }
        }
      }
    }
  } catch (error) {
    console.error('Error parsing Kolada response:', error);
  }
  
  return values;
}

// Calculate trend and status
function calculateTrendAndStatus(currentValue: number, previousValue: number | null, indicatorKey: string): {
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  status: 'positive' | 'warning' | 'critical' | 'neutral';
} {
  if (previousValue === null || previousValue === 0) {
    return { trend: 'stable', trendPercent: 0, status: 'neutral' };
  }
  
  const percentChange = ((currentValue - previousValue) / previousValue) * 100;
  
  const trend: 'up' | 'down' | 'stable' = 
    percentChange > 1 ? 'up' : 
    percentChange < -1 ? 'down' : 'stable';
  
  // Inverted indicators (lower is better)
  const invertedIndicators = ['violent_crime', 'excess_mortality', 'healthcare_wait'];
  const isInverted = invertedIndicators.includes(indicatorKey);
  
  let status: 'positive' | 'warning' | 'critical' | 'neutral';
  const absChange = Math.abs(percentChange);
  
  if (absChange < 2) {
    status = 'neutral';
  } else if (isInverted) {
    status = percentChange < 0 ? 'positive' : percentChange > 5 ? 'critical' : 'warning';
  } else {
    status = percentChange > 0 ? 'positive' : percentChange < -5 ? 'critical' : 'warning';
  }
  
  return { trend, trendPercent: Math.round(percentChange * 10) / 10, status };
}

// Insert values into database
async function insertValues(supabase: any, values: ImportedValue[]): Promise<{ inserted: number; errors: string[] }> {
  const errors: string[] = [];
  let inserted = 0;
  
  // Sort by date
  values.sort((a, b) => a.period_start.localeCompare(b.period_start));
  
  // Group by indicator
  const byIndicator: Record<string, ImportedValue[]> = {};
  for (const v of values) {
    if (!byIndicator[v.indicator_key]) byIndicator[v.indicator_key] = [];
    byIndicator[v.indicator_key].push(v);
  }
  
  for (const [indicatorKey, indicatorValues] of Object.entries(byIndicator)) {
    const kpiId = KPI_MAPPINGS[indicatorKey];
    if (!kpiId) {
      errors.push(`No KPI mapping for ${indicatorKey}`);
      continue;
    }
    
    let previousValue: number | null = null;
    
    for (const v of indicatorValues) {
      const { trend, trendPercent, status } = calculateTrendAndStatus(v.value, previousValue, indicatorKey);
      
      const record = {
        kpi_id: kpiId,
        value: v.value,
        previous_value: previousValue,
        period_start: v.period_start,
        period_end: v.period_end,
        status,
        trend,
        trend_percent: trendPercent,
        confidence: v.confidence,
        granularity: v.granularity,
      };
      
      // Check if exists
      const { data: existing } = await supabase
        .from('kpi_values')
        .select('id')
        .eq('kpi_id', kpiId)
        .eq('period_start', v.period_start)
        .eq('period_end', v.period_end)
        .maybeSingle();
      
      if (existing) {
        const { error } = await supabase
          .from('kpi_values')
          .update(record)
          .eq('id', existing.id);
        
        if (error) {
          errors.push(`Update error: ${error.message}`);
        } else {
          inserted++;
        }
      } else {
        const { error } = await supabase
          .from('kpi_values')
          .insert(record);
        
        if (error) {
          errors.push(`Insert error: ${error.message}`);
        } else {
          inserted++;
        }
      }
      
      previousValue = v.value;
    }
  }
  
  return { inserted, errors };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const body = await req.json().catch(() => ({}));
    const { sources = ['scb', 'kolada'], indicators = 'all', dryRun = false } = body;
    
    console.log(`Starting import from: ${sources.join(', ')}, dryRun: ${dryRun}`);
    
    const allValues: ImportedValue[] = [];
    const fetchResults: Record<string, { fetched: number; errors: string[] }> = {};
    
    // Fetch from SCB
    if (sources.includes('scb')) {
      const scbIndicators = indicators === 'all' 
        ? Object.keys(SCB_ENDPOINTS)
        : indicators.filter((i: string) => i in SCB_ENDPOINTS);
      
      fetchResults.scb = { fetched: 0, errors: [] };
      
      for (const indicator of scbIndicators) {
        console.log(`Fetching SCB: ${indicator}`);
        const values = await fetchSCBData(indicator);
        console.log(`  Got ${values.length} values`);
        allValues.push(...values);
        fetchResults.scb.fetched += values.length;
      }
    }
    
    // Fetch from Kolada
    if (sources.includes('kolada')) {
      const koladaIndicators = indicators === 'all'
        ? Object.keys(KOLADA_ENDPOINTS)
        : indicators.filter((i: string) => i in KOLADA_ENDPOINTS);
      
      fetchResults.kolada = { fetched: 0, errors: [] };
      
      for (const indicator of koladaIndicators) {
        console.log(`Fetching Kolada: ${indicator}`);
        const values = await fetchKoladaData(indicator);
        console.log(`  Got ${values.length} values`);
        allValues.push(...values);
        fetchResults.kolada.fetched += values.length;
      }
    }
    
    if (dryRun) {
      return new Response(JSON.stringify({
        success: true,
        dryRun: true,
        summary: {
          totalValues: allValues.length,
          bySource: fetchResults,
          sampleValues: allValues.slice(0, 10)
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Inserting ${allValues.length} values...`);
    const insertResult = await insertValues(supabase, allValues);
    
    // Log import
    try {
      await supabase.from('trust_log').insert({
        log_id: `IMPORT-${new Date().toISOString().slice(0, 10)}-${Date.now()}`,
        change_type: 'method_update',
        scope: 'data_import',
        reason: `Data import from ${sources.join(', ')}: ${insertResult.inserted} values`,
        data_changed: true,
        method_changed: false,
        initiated_by: 'system',
        initiated_by_role: 'system_admin'
      });
    } catch (e) {
      console.error('Failed to log import:', e);
    }
    
    return new Response(JSON.stringify({
      success: true,
      summary: {
        fetched: allValues.length,
        inserted: insertResult.inserted,
        errors: insertResult.errors,
        bySource: fetchResults
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Import error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
